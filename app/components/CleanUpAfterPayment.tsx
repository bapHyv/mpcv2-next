"use client";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import useCleanUpAfterPayment from "@/app/hooks/useCleanUpAfterPayment";
import { useAlerts } from "../context/alertsContext";

export default function CleanUpAfterPayment() {
  const { handleCleanUpAfterPayment } = useCleanUpAfterPayment();
  const { addAlert } = useAlerts();
  useEffect(() => {
    handleCleanUpAfterPayment();
    addAlert(uuid(), "Votre commande a bien été reçues. Nous attendons le virement pour procéder à l'expédition", "Commande reçues", "emerald");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
