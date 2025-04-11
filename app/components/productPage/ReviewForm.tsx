// ReviewForm.tsx (Styled)
"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

import Title from "@/app/components/Title";
import { comment as commentAction } from "@/app/actions";
import { useAuth } from "@/app/context/authContext";
import { useAlerts } from "@/app/context/alertsContext";
import { subtleSectionWrapperClassname, inputClassname, labelClassname, linkClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import SubmitButton from "@/app/components/SubmitButton";

const initialState = {
  message: "",
  data: null,
  isSuccess: false,
  statusCode: 0,
};

interface Props {
  id: number;
}

export default function ReviewForm({ id }: Props) {
  const t = useTranslations("reviews");
  const { userData } = useAuth();
  const { addAlert } = useAlerts();
  const pathname = usePathname();

  // Form state hook
  const [state, formAction] = useFormState(commentAction, initialState as any);

  const [commentValue, setCommentValue] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Keep rating handlers
  const handleRatingClick = (selectedRating: number) => setRating(selectedRating);
  const handleRatingHover = (hoveredRating: number) => setHoverRating(hoveredRating);
  const handleRatingLeave = () => setHoverRating(0);

  // Keep useEffect for handling form submission response
  useEffect(() => {
    if (state.statusCode !== 0) {
      // Action completed
      // TODO: add || state.statusCode === 201 in the if below
      if (state.isSuccess && (state.statusCode === 200 || state.statusCode === 204)) {
        // Check for success codes
        addAlert(uuid(), t("alerts.addReview.success.text"), t("alerts.addReview.success.title"), "emerald");
        // Reset form fields on success
        setCommentValue("");
        setRating(0);
        setHoverRating(0);
        // Optionally trigger a refresh of reviews if they are dynamic?
      } else {
        // Handle errors
        let alertTitle = t("alerts.genericError.title");
        let alertText = state.message || t("alerts.genericError.text");
        let alertType: "yellow" | "red" = "red";

        switch (state.statusCode) {
          case 400: // Bad request (e.g., missing field)
            alertTitle = t("alerts.addReview.400.title");
            alertText = state.message || t("alerts.addReview.400.text");
            alertType = "yellow";
            break;
          case 401: // Unauthorized
            alertTitle = t("alerts.addReview.401.title");
            alertText = state.message || t("alerts.addReview.401.text");
            alertType = "yellow";
            break;
          // TODO: Est-ce que utilisateur peut commenter plusieurs fois le meme produit?
          // case 403: // Forbidden (e.g., already reviewed?)
          //   alertTitle = t("alerts.addReview.403.title"); // Define translation
          //   alertText = state.message || t("alerts.addReview.403.text");
          //   alertType = "yellow";
          //   break;
          case 500: // Server error
            alertTitle = t("alerts.addReview.500.title");
            alertText = state.message || t("alerts.addReview.500.text");
            alertType = "red";
            break;
          // Add more cases if needed
        }
        addAlert(uuid(), alertText, alertTitle, alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!userData) {
    return (
      // Use subtle wrapper for login prompt
      <div className={twMerge(subtleSectionWrapperClassname, "mt-10 text-center")}>
        <p className="text-sm text-gray-700">
          {t("loginPrompt.text")}{" "}
          <Link href={`/connexion?redirect=${pathname}`} className={linkClassname}>
            {t("loginPrompt.link")}
          </Link>{" "}
          {t("loginPrompt.suffix")}
        </p>
      </div>
    );
  }

  // Render the form if user is logged in
  return (
    // Use section wrapper if desired, or just margin
    <div className="mt-10">
      {/* Use Title component for heading */}
      <Title
        title={t("addReviewTitle")}
        type="h3" // Use h3 for semantic structure within the page
        classname={twMerge(titleClassname, "text-center !mb-6 text-lg")} // Center, adjust margin/size
        firstLetterClassname="text-2xl"
      />
      <form action={formAction} className="space-y-5 max-w-xl mx-auto">
        {" "}
        {/* Center form, add spacing */}
        {/* Hidden input for rating value */}
        <input type="hidden" name="rating" value={rating} />
        {/* Hidden input for product ID */}
        <input type="hidden" name="id" value={id} />
        {/* Star Rating Input */}
        <div>
          <label htmlFor="rating-input" className={labelClassname}>
            {" "}
            {/* Use label class */}
            {t("ratingLabel")} <span className="text-red-600">*</span> {/* Required indicator */}
          </label>
          <div className="mt-1 flex items-center" id="rating-input" onMouseLeave={handleRatingLeave}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button" // Prevent form submission
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                aria-label={t("ratingAriaLabel", { count: star })} // e.g., "Donner une note de {count} étoiles"
                className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400 rounded-full p-0.5" // Add focus style
              >
                {/* Apply consistent star styling */}
                <StarIcon
                  className={twMerge(
                    "h-7 w-7 sm:h-8 sm:w-8 cursor-pointer transition-colors duration-150 ease-in-out", // Base size and transition
                    star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300 hover:text-gray-400" // Color logic
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
          {/* Add validation message if rating is required but not selected */}
          {/* This would typically come from the server `state` */}
          {/* {state?.errors?.rating && <p className="mt-1 text-xs text-red-600">{state.errors.rating}</p>} */}
        </div>
        {/* Comment Textarea */}
        <div>
          <label htmlFor="comment" className={labelClassname}>
            {" "}
            {/* Use label class */}
            {t("commentLabel")} <span className="text-red-600">*</span>
          </label>
          <div className="mt-1">
            <textarea
              name="comment"
              id="comment"
              rows={5} // Adjusted rows
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              className={inputClassname} // Apply consistent input style
              aria-describedby="comment-description"
              required
              placeholder={t("commentPlaceholder")}
              // aria-invalid={!!state?.errors?.comment}
            />
          </div>
          <p id="comment-description" className="mt-1 text-xs text-gray-500">
            {t("commentHint")}
          </p>
          {/* Add validation message */}
          {/* {state?.errors?.comment && <p className="mt-1 text-xs text-red-600">{state.errors.comment}</p>} */}
        </div>
        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          {" "}
          {/* Align button right */}
          <SubmitButton
            text={t("submitButton")}
            // Disable if rating or comment is missing
            isDisabled={rating === 0 || !commentValue.trim()}
            className="px-5 py-2" // Adjust padding if needed
          />
        </div>
      </form>
    </div>
  );
}
