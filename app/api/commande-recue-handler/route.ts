import { generatePaymentToken } from "@/app/utils/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
type TempStatus =
  | "processing"
  | "success"
  | "fraud_refusal"
  | "fraud_warning"
  | "auth_failed"
  | "bank_refusal"
  | "max_attempts"
  | "technical_error"
  | "abandoned"
  | "unknown_failure"
  | "error";

export async function POST(request: NextRequest) {
  let orderId: string | undefined = request.nextUrl.searchParams.get("orderId") || undefined;
  let tempStatus: TempStatus = "processing";
  let failureReason: string | undefined;
  let internalErrorMessage: string | undefined;

  try {
    const formData = await request.formData();
    const dataString = formData.get("Data") as string | null;

    if (!dataString) {
      console.error("Missing Data field in POST request from payment provider.");
      tempStatus = "error";
      internalErrorMessage = "Données de paiement manquantes.";
    } else {
      try {
        const paymentData = JSON.parse(dataString);

        const responseCode: string | undefined = paymentData.responseCode;
        const acquirerResponseCode: string | undefined = paymentData.acquirerResponseCode;
        const holderAuthentStatus: string | undefined = paymentData.holderAuthentStatus;
        const scoreColor: string | undefined = paymentData.scoreColor;

        if (typeof responseCode !== "string") {
          console.warn("Response code is missing or not a string in Data payload.");
          tempStatus = orderId ? "processing" : "error";
          if (!orderId) internalErrorMessage = "Code de réponse et ID de commande manquants";
        } else {
          switch (responseCode) {
            case "00":
              tempStatus = "success";
              break;

            case "05":
              if (holderAuthentStatus === "FAILURE") {
                tempStatus = "auth_failed";
                failureReason = "Échec de l'authentification 3-D Secure.";
              } else if (scoreColor === "RED" || scoreColor === "BLACK") {
                tempStatus = "fraud_refusal";
                failureReason = "Refus suite à une suspicion de fraude (Score).";
              } else if (scoreColor === "ORANGE") {
                tempStatus = "fraud_warning";
                failureReason = "Paiement autorisé mais signalé pour vérification (Score Orange).";
              } else if (acquirerResponseCode === "A1") {
                tempStatus = "bank_refusal";
                failureReason = "Refus bancaire (données 3DS manquantes - Soft Decline).";
              } else {
                tempStatus = "bank_refusal";
                failureReason = `Refus bancaire (Code acquéreur: ${acquirerResponseCode || "N/A"}).`;
              }
              break;

            case "34":
              tempStatus = "fraud_refusal";
              failureReason = `Refus pour suspicion de fraude par la banque (Code acquéreur: ${acquirerResponseCode || "N/A"}).`;
              break;

            case "75":
              tempStatus = "max_attempts";
              failureReason = "Nombre maximum de tentatives atteint.";
              break;

            case "90":
            case "99":
              tempStatus = "technical_error";
              failureReason = "Erreur technique temporaire lors du traitement.";
              break;

            case "97":
              tempStatus = "abandoned";
              failureReason = "Paiement abandonné par l'utilisateur.";
              break;

            default:
              tempStatus = "unknown_failure";
              failureReason = `Échec du paiement (Code réponse Sips: ${responseCode}).`;
              break;
          }
        }

        if (!orderId && tempStatus !== "error") {
          console.error("OrderId missing from URL.");
          tempStatus = "error";
          internalErrorMessage = "ID de commande manquant dans l'URL de redirection.";
        }
      } catch (parseError) {
        console.error("Error parsing Data JSON:", parseError);
        tempStatus = "error";
        internalErrorMessage = "Format des données de paiement invalide.";
        if (!orderId) internalErrorMessage += " ID de commande également manquant.";
      }
    }
  } catch (error) {
    console.error("Error processing POST request in API route:", error);
    tempStatus = "error";
    internalErrorMessage = "Erreur serveur lors du traitement de la réponse de paiement.";
    if (!orderId) internalErrorMessage += " ID de commande également manquant.";
  }

  const token = generatePaymentToken({ orderId, status: tempStatus, payment: "secure3dcard" });

  const redirectUrl = new URL("/commande-recue", request.nextUrl.origin);

  if (token) {
    redirectUrl.searchParams.set("token", token);
  }

  if (failureReason && tempStatus !== "success" && tempStatus !== "processing" && tempStatus !== "error") {
    redirectUrl.searchParams.set("failure_reason", failureReason.replace(/\+/g, " "));
  }

  return NextResponse.redirect(redirectUrl.toString());
}

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/fr", request.nextUrl.origin);
  redirectUrl.searchParams.set("error", "Invalid access method");
  return NextResponse.redirect(redirectUrl.toString());
}
