"use client";

import { useState } from "react";

import Form from "@/app/components/orderPage/Form";
import Order from "@/app/components/orderPage/Order";
import OrderSummary from "@/app/components/orderPage/OrderSummary";
import PaymentMethods from "@/app/components/orderPage/PaymentMethods";
import Shipping from "@/app/components/orderPage/Shipping";
import AreYouCustomer from "@/app/components/cartPage/AreYouCustomer";

/**
 * [x] FREE SHIPPING
 *
 * [-] Ajouter condition générales à /inscription
 * [-] Gérer cas particulier code promos (Enlever code promo avec restriction)
 * [-] Gérer utilisation refresh Token (voir réponse Grok)
 *
 *
 *
 * connecter
 *
 * Pas connecter:
 *  [x] Afficher "Vous êtes client chez nous?" avec lien vers /connexion
 *
 * DisplayComponents:
 *  [x] Transformer en formulaire. Elements du form:
 *      - inputs shipping address
 *      - inputs billing address (optional)
 *      - inputs shipping method (radio)
 *      - inputs payment method (radio)
 *
 * orderContext:
 *  [x] Ajouter shippingCost et totalOrder
 *
 * OrderSummary:
 *  [x] Ajouter code promos
 *
 * Shipping:
 *  [x] REVOIR CONDITION AFFICHAGE DES METHODES D'EXPEDITION
 *  [x] Affichage des méthodes:
 *    - Country
 *    - Gratuit ou payant:
 *      - Discount freeShipping = true
 *                  OU
 *      - ignore_discounts = yes => vérifier que cart.total > min_amount
 *      - ignore_discounts = no => vérifier que order.total > min_amount
 *
 *
 *  [x] Lors du choix de la méthode:
 *    - set order.shippingMethodId = instanceId
 *    - set order.shippingCost = SI cost EXISTE method.cost SINON 0 (arrondir à l'entier supérieur)
 *    - set order.totalOrder = order.total + order.shippingCost
 *
 * Total:
 *  [x] Afficher frais d'expédition en fonction de order.shippingCost
 *
 * PaymentMethod:
 *  En fonction de la méthode choisie:
 *    [x] Afficher <p></p> en fonction du mode de paiement
 *
 * Order:
 *    [x] Si connecté, enlever checkboxes
 *    [x] Desactiver boutton si tout n'est pas remplis
 *    [x] Texte boutton en fonction du mode de paiement
 *    [-] Ajouter composant carte
 *    [-] Url boutton en fonction du mode de paiement
 *    [-] Modifier requête envoyé en fonction du mode de paiement
 *    [-] Si pas connecté Lors de la soumission du formulaire, créer l'utilisateur puis rediriger vers la page (soit virement, soit par carte)
 *    [-]
 *
 */

export default function DisplayComponents() {
  const [payment, setPayment] = useState<null | "secure-3d-card" | "bank-transfer">(null);
  const [formData, setFormData] = useState<{ [x: string]: string }>({
    "shipping-firstname": "",
    "shipping-lastname": "",
    "shipping-company": "",
    "shipping-country": "",
    "shipping-address1": "",
    "shipping-address2": "",
    "shipping-postalCode": "",
    "shipping-city": "",
    "shipping-province": "",
    "shipping-phone": "",
    "shipping-email": "",
    "shipping-password": "",
    "different-billing": "false",
    "billing-firstname": "",
    "billing-lastname": "",
    "billing-company": "",
    "billing-country": "",
    "billing-address1": "",
    "billing-address2": "",
    "billing-postalCode": "",
    "billing-city": "",
    "billing-province": "",
    "billing-phone": "",
    "billing-email": "",
    paymentMethod: "",
    shippingMethod: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, id, checked } = e.target as HTMLInputElement;
    if (type === "checkbox" && id.startsWith("different-")) {
      setFormData((prevState) => ({
        ...prevState,
        [id]: `${checked}`,
      }));
    } else if (type === "radio" && id.startsWith("payment-")) {
      setFormData((prevState) => ({
        ...prevState,
        paymentMethod: value,
      }));
    } else if (type === "radio" && id.startsWith("shipping-")) {
      setFormData((prevState) => ({
        ...prevState,
        shippingMethodId: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <form className="flex flex-col md:flex-row gap-x-5 p-2">
        <div>
          <AreYouCustomer redirect="commander" />
          <Form handleChange={handleChange} formData={formData} setFormData={setFormData} />
        </div>
        <div>
          <OrderSummary />
          <Shipping handleChange={handleChange} formData={formData} />
          <PaymentMethods payment={payment} setPayment={setPayment} handleChange={handleChange} formData={formData} />
          <Order payment={payment} formData={formData} />
        </div>
      </form>
    </>
  );
}
