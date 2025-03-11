"use client";

import { useFormState } from "react-dom";
import Title from "../Title";
import { comment } from "@/app/actions";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAlerts } from "@/app/context/alertsContext";
import { v4 as uuid } from "uuid";

const initialState = {
  comment: "",
  rating: 0,
};

interface Props {
  id: number;
}

export default function ReviewForm({ id }: Props) {
  // @ts-ignore
  const [state, formAction] = useFormState(comment, initialState);
  const [commentValue, setCommentValue] = useState("");
  const [rating, setRating] = useState(0); // State to manage the selected rating
  const [hoverRating, setHoverRating] = useState(0); // State to manage hover effect on stars

  const { userData } = useAuth();
  const { addAlert } = useAlerts();
  const pathname = usePathname();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoverRating(hoveredRating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  useEffect(() => {
    if (state.isSuccess && state.statusCode === 204) {
      addAlert(uuid(), "Le commentaire a bien été reçus. Il doit être examiné avant d'être publié", "Ajout de commentaire", "emerald");
      setCommentValue("");
      setRating(0);
      setHoverRating(0);
    } else if (!state.isSuccess && !state.data) {
      switch (state.statusCode) {
        case 400:
          addAlert(uuid(), "Le commentaire que vous avez publié n'est pas recevable", "Problème commentaire", "yellow");
          break;
        case 401:
          addAlert(uuid(), "Vous n'êtes pas autorisé à ajouté un commentaire. Veuillez vous connecter", "Problème commentaire", "yellow");
          break;
        case 500:
          addAlert(uuid(), "Erreur lors de l'ajout du commentaire. Veuillez réessayer plus tard", "Erreur serveur", "red");
          break;
        default:
          break;
      }
    }
  }, [state]);

  return !userData ? (
    <div className="my-6">
      <p>
        Si vous souhaitez ajouter un commentaire,{" "}
        <Link href={`/connexion?redirect=${pathname}`} className="text-green underline cursor-pointer">
          cliquez ici
        </Link>{" "}
        pour vous connecter (Rassurez-vous, vous serez rediriger vers cette page après votre connexion){" "}
      </p>
    </div>
  ) : (
    <div className="mt-2">
      <Title title="Ajouter un commentaire" type="h2" classname="text-green text-xl" />
      <form action={formAction}>
        {/* Hidden input to store the rating value */}
        <input type="hidden" name="rating" value={rating} />
        <input type="hidden" name="id" value={id} />

        {/* Textarea for the comment */}
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Votre commentaire
          </label>
          <textarea
            name="comment"
            id="comment"
            rows={7}
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-light-green sm:text-sm sm:leading-6"
            aria-describedby="comment-description"
            required
          ></textarea>
          <p id="comment-description" className="text-sm text-gray-500">
            Veuillez écrire votre commentaire ici.
          </p>
        </div>

        {/* Star rating input */}
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Note
          </label>
          <div className="flex" id="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={handleRatingLeave}
                aria-label={`Donner une note de ${star} étoile${star > 1 ? "s" : ""}`}
                className="focus:outline-none"
              >
                <StarIcon className={`h-8 w-8 ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">Veuillez sélectionner une note entre 1 et 5 étoiles.</p>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end mt-2">
          <button
            type="submit"
            className="px-3 py-2 bg-green text-white rounded-md shadow-md hover:bg-light-green focus:outline-none focus:ring-2 focus:ring-light-green focus:ring-offset-2"
          >
            Commenter
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 I want to create a form to add a review to a product. The review has a comment (text area) and a rating (the StarIcon) rated from 1 (worst) to 5 (best)
 Using this code, I want to you to create the form, using react latest features, respect accessibility and use the tags usually found in an form
 */
