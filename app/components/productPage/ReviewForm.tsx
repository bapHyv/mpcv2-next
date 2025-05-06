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
import {
  subtleSectionWrapperClassname,
  inputClassname,
  labelClassname,
  linkClassname,
  titleClassname as baseTitleClassname,
} from "@/app/staticData/cartPageClasses";
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
  const t = useTranslations("");
  const { userData } = useAuth();
  const { addAlert } = useAlerts();
  const pathname = usePathname();

  const [state, formAction] = useFormState(commentAction, initialState as any);

  const [commentValue, setCommentValue] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (selectedRating: number) => setRating(selectedRating);
  const handleRatingHover = (hoveredRating: number) => setHoverRating(hoveredRating);
  const handleRatingLeave = () => setHoverRating(0);

  useEffect(() => {
    if (state.statusCode !== 0) {
      // TODO STATUS: Check for various success codes (200, 201, 204 might indicate success)
      if (state.isSuccess && (state.statusCode === 200 || state.statusCode === 201 || state.statusCode === 204)) {
        addAlert(uuid(), t("alerts.addReview.success.text"), t("alerts.addReview.success.title"), "emerald");
        setCommentValue("");
        setRating(0);
        setHoverRating(0);
      } else if (!state.isSuccess) {
        let titleKey = "alerts.addReview.defaultError.title";
        let textKey = "alerts.addReview.defaultError.text";
        let alertType: "yellow" | "red" = "red";

        switch (state.statusCode) {
          case 400:
            titleKey = "alerts.addReview.error400.title";
            textKey = "alerts.addReview.error400.text";
            alertType = "yellow";
            break;
          case 401:
            titleKey = "alerts.addReview.error401.title";
            textKey = "alerts.addReview.error401.text";
            alertType = "yellow";
            break;
          case 403:
            titleKey = "alerts.addReview.error403.title";
            textKey = "alerts.addReview.error403.text";
            alertType = "yellow";
            break;
          case 500:
            titleKey = "alerts.addReview.error500.title";
            textKey = "alerts.addReview.error500.text";
            alertType = "red";
            break;
        }
        const alertText = state.message || t(textKey);
        addAlert(uuid(), alertText, t(titleKey), alertType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!userData) {
    const redirectValue = `${pathname}#review-form`;
    return (
      <div className={twMerge(subtleSectionWrapperClassname, "text-center")}>
        <p className="text-sm text-gray-700">
          {t("reviews.loginPrompt.text")}{" "}
          <Link
            href={{
              pathname: "/connexion", // The page to navigate to
              query: { redirect: redirectValue }, // The query parameters
            }}
            className={linkClassname}
          >
            {t("reviews.loginPrompt.link")}
          </Link>{" "}
          {t("reviews.loginPrompt.suffix")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <Title
        title={t("reviews.addReviewTitle")}
        type="h3"
        classname={twMerge(baseTitleClassname, "text-center !mb-6 text-lg")}
        firstLetterClassname="text-2xl"
      />
      <form action={formAction} className="space-y-5 max-w-xl mx-auto">
        <input type="hidden" name="rating" value={rating} />
        <input type="hidden" name="id" value={id} />

        {/* Star Rating */}
        <div>
          <label htmlFor="rating-input" className={labelClassname}>
            {t("reviews.ratingLabel")} <span className="text-red-600">*</span>
          </label>
          <div className="mt-1 flex items-center" id="rating-input" onMouseLeave={handleRatingLeave}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                aria-label={t("reviews.ratingAriaLabel", { count: star })}
                className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400 rounded-full p-0.5"
              >
                <StarIcon
                  className={twMerge(
                    "h-7 w-7 sm:h-8 sm:w-8 cursor-pointer transition-colors duration-150 ease-in-out",
                    star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300 hover:text-gray-400"
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label htmlFor="comment" className={labelClassname}>
            {t("reviews.commentLabel")} <span className="text-red-600">*</span>
          </label>
          <div className="mt-1">
            <textarea
              name="comment"
              id="comment"
              rows={5}
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              className={inputClassname}
              aria-describedby="comment-description"
              required
              placeholder={t("reviews.commentPlaceholder")}
              // aria-invalid={!!state?.errors?.comment}
            />
          </div>
          <p id="comment-description" className="mt-1 text-xs text-gray-500">
            {t("reviews.commentHint")}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <SubmitButton text={t("reviews.submitButton")} isDisabled={rating === 0 || !commentValue.trim()} className="px-5 py-2" />
        </div>
      </form>
    </div>
  );
}
