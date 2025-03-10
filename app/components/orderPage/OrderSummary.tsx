import Title from "@/app/components/Title";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useOrder } from "@/app/context/orderContext";
import { sectionClassname, titleClassname } from "@/app/staticData/cartPageClasses";
import { twMerge } from "tailwind-merge";
import { displayDiscountValue } from "@/app/utils/orderFunctions";
import { useAlerts } from "@/app/context/alertsContext";
import { v4 as uuid } from "uuid";
import { useProductsAndCart } from "@/app/context/productsAndCartContext";

export default function OrderSummary() {
  const { order, discountApplied, setDiscountApplied } = useOrder();
  const { addAlert } = useAlerts();
  const { cart } = useProductsAndCart();

  const handleRemoveDiscount = (name: string) => {
    setDiscountApplied((prevState) => prevState.filter((e) => e.name !== name));
    addAlert(uuid(), `Discount code ${name} has been removed`, "Discount code removed", "yellow");
  };

  return (
    <section aria-labelledby="commande" className={twMerge(sectionClassname)}>
      <Title title="Votre commande" type="h2" classname={twMerge(titleClassname)} firstLetterClassname="text-2xl" id="linked-account-discount-code" />
      <div className="flex items-center justify-between">
        <span>Produits</span>
        <span>Sous-total</span>
      </div>
      <Separator />
      <div className="my-3">
        {Object.entries(order.products).map(([pId, orderP]) =>
          orderP.map((p) => (
            <div key={`${p.label} - x${p.option}`} className="text-xs md:text-base flex items-center justify-between">
              <div>
                <span>{`${p.label} ${p.option}${p.per === "g" ? "g" : "u"} - ${p.quantity} x ${p.unitPrice}€`}</span>
                {/* <span>{p.totalPrice}</span> */}
              </div>
              <div>
                <span>{p.totalPrice}€</span>
              </div>
            </div>
          ))
        )}
      </div>
      {!!discountApplied.length && (
        <>
          <div className="flex items-center justify-between">
            <span>Code promos</span>
          </div>
          <Separator />
        </>
      )}
      {discountApplied.map((d) => (
        <div key={d.name} className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">{d.name}</dt>
          <div className="flex gap-x-2 justify-center">
            <div>
              <span className="text-sm font-medium text-gray-900">{displayDiscountValue(d, cart.products)}</span>
            </div>
            <XMarkIcon onClick={() => handleRemoveDiscount(d.name)} type="button" className="w-5 h-5 text-red-600 cursor-pointer" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between mt-3">
        <span>Sous-total</span>
        <span>{order.total.toFixed(2)}€</span>
      </div>
    </section>
  );
}

function Separator() {
  return <div className="h-[1px] bg-black"></div>;
}
