import Image from "next/image";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import Title from "@/app/components/Title";
import { Dispatch, SetStateAction } from "react";
import { inputCN } from "@/app/staticData/orderPageClasses";
import Star from "@/app/components/Star";
import { useOrder } from "@/app/context/orderContext";

export default function PaymentMethods() {
  const { order, handleChange } = useOrder();
  return (
    <div aria-labelledby="paiement" className={twMerge(sectionClassname)}>
      <fieldset>
        <legend className="flex gap-x-1">
          <Title title="Mode de paiement" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" />
          <Star />
        </legend>
        <div className="flex gap-x-2 items-center">
          <input
            type="radio"
            id="payment-method-secure-3d-card"
            name="payment-method"
            value="secure-3d-card"
            checked={order["payment-method"] === "secure-3d-card"}
            required
            onChange={(e) => handleChange(e)}
            className={inputCN}
          />
          <label className="cursor-pointer" htmlFor="payment-method-secure-3d-card">
            Carte Bancaire 3D Secure
          </label>
          <Image width={120} height={23} src={"/cb-visa-mastercard.png"} alt="cb visa mastercard" />
        </div>

        {order["payment-method"] === "secure-3d-card" && (
          <div className="p-2 text-sm italic text-neutral-500">
            <p>En choisissant ce mode de paiement vous pourrez effectuer votre règlement sur le serveur sécurisé de notre banque.</p>
          </div>
        )}

        <div className="flex gap-x-2 items-center">
          <input
            type="radio"
            id="payment-method-bank-transfer"
            name="payment-method"
            value="bank-transfer"
            checked={order["payment-method"] === "bank-transfer"}
            required
            onChange={(e) => handleChange(e)}
            className={inputCN}
          />

          <label className="cursor-pointer" htmlFor="payment-method-bank-transfer">
            Virement bancaire
          </label>
        </div>

        {order["payment-method"] === "bank-transfer" && (
          <div className="p-2 text-sm italic text-neutral-500">
            <p>
              Effectuez le paiement directement depuis votre compte bancaire. Veuillez utiliser l’ID de votre commande comme référence du paiement.
              Votre commande ne sera pas expédiée tant que les fonds ne seront pas reçus.
            </p>
          </div>
        )}
      </fieldset>
    </div>
  );
}
