import DisplayProductsCartPage from "@/app/components/cart/DisplayProductsCartPage";
import Separator from "@/app/components/Separator";
import Title from "@/app/components/Title";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

/**
 *
 * TODO: Mettre lien vers connectez vous
 */

export default async function Page() {
  const isConnected = false;

  const sectionClassname =
    "mt-2 rounded-lg bg-neutral-100 p-3 sm:p-4 lg:col-span-5 lg:mt-4";

  const titleClassname = `relative mb-4 uppercase text-md text-green font-bold tracking-widest
          after:content-['_'] after:absolute after:left-0 after:2xl:left-2 after:-bottom-1 after:h-1.5 after:w-16 after:bg-black
          dark:after:bg-white`;

  const buttonClassname =
    "px-2 py-0.5 bg-green rounded-md text-white w-1/3 lg:w-1/4 2xl:w-1/6";

  const inputClassname = `block w-2/3 lg:w-3/4 2xl:w-5/6 sm:text-sm sm:leading-6 rounded-md border-0 py-0.5 text-gray-900 shadow-sm 
                  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                  focus:ring-1`;
  return (
    <>
      <Title
        title="Panier"
        type="h1"
        classname={`relative mt-4 sm:mt-8 2xl:pl-2 uppercase text-xl text-green font-bold tracking-widest
          after:content-['_'] after:absolute after:left-0 after:2xl:left-2 after:-bottom-1 after:h-1.5 after:w-16 after:bg-black
          dark:after:bg-white`}
        firstLetterClassname="text-4xl"
      />
      {/* WRAP ALL */}
      <div className="flex flex-col md:flex-row gap-x-5 p-2">
        {/* WRAP CONNECTED AND PRODUCTS */}
        <div className="w-full md:w-1/2">
          {/* IS CONNECTED */}
          {isConnected ? null : (
            <section className={twMerge("text-sm", sectionClassname)}>
              Vous etes client chez nous? Connectez-vous
            </section>
          )}
          {/* PRODUCTS */}
          <section
            aria-labelledby="products"
            className={twMerge(sectionClassname)}
          >
            <Title
              title="Products"
              type="h2"
              classname={twMerge(titleClassname)}
              firstLetterClassname="text-2xl"
              id="products"
            />

            <DisplayProductsCartPage />
          </section>
        </div>

        {/* WRAP REST */}
        <div className="w-full md:w-1/2">
          {/* DISCOUNT CODE */}
          <section
            aria-labelledby="discount-code"
            className={twMerge(sectionClassname)}
          >
            <Title
              title="Code promo"
              type="h2"
              classname={twMerge(titleClassname)}
              firstLetterClassname="text-2xl"
              id="discount-code"
            />
            <div className="flex gap-x-3 justify-between items-center">
              <label htmlFor="discount-code" className="sr-only">
                discount-code
              </label>
              <input
                id="discount-code"
                name="discount-code"
                type="text"
                className={twMerge(inputClassname)}
              />
              <button className={twMerge(buttonClassname)}>Appliquer</button>
            </div>
          </section>
          {/* PROMO CODE LINKED ACCOUNT */}
          <section
            aria-labelledby="Promo-code-linked-to-the-account"
            className={twMerge(sectionClassname)}
          >
            <Title
              title="Code promo lié au compte"
              type="h2"
              classname={twMerge(titleClassname)}
              firstLetterClassname="text-2xl"
              id="Promo-code-linked-to-the-account"
            />
            {/* TODO: PUT IN COMPONENT */}
            <div className="flex items-center justify-between gap-x-3">
              <span className="w-1/3 text-ellipsis overflow-hidden text-nowrap">
                codecodecodecodecodecodecodecodecodecodecodecodecodecodecode
              </span>
              <span className="w-1/3 text-ellipsis overflow-hidden text-nowrap">
                code value code value code value code value code value code
                value code value code value
              </span>
              <button className={twMerge(buttonClassname)}>Utiliser</button>
            </div>
          </section>
          {/* FIDELITY POINTS */}
          {/* TODO: ADD CONDITION isConnected */}
          <section
            aria-labelledby="fidelity-points"
            className={twMerge(sectionClassname, "sm:pb-0")}
          >
            <Title
              title="Vos points de fidelite"
              type="h2"
              classname={twMerge(titleClassname)}
              firstLetterClassname="text-2xl"
              id="fidelity-points"
            />
            <div>
              <div className="flex items-center justify-between">
                <span>Nombres de points:</span>
                <span>4000</span>
              </div>
              <div className="flex items-center gap-x-2">
                <label
                  htmlFor="amount-of-fidelity-points-to-use"
                  className="w-1/6 lg:w-1/12"
                >
                  Total
                </label>
                <input
                  id="amount-of-fidelity-points-to-use"
                  name="amount-of-fidelity-points-to-use"
                  type="text"
                  className={twMerge(inputClassname, "w-3/6 lg:w-8/12")}
                />
                <button className={twMerge(buttonClassname)}>Appliquer</button>
              </div>
            </div>
            <p className="uppercase text-neutral-600 text-xs mt-4 mb-1">
              1 point = 0,10 euro de reduction
            </p>
          </section>
          {/* CART SUMMARY */}
          <section
            aria-labelledby="summary-heading"
            className={twMerge(sectionClassname)}
          >
            <Title
              title="Total du panier"
              type="h2"
              classname={twMerge(titleClassname)}
              firstLetterClassname="text-2xl"
              id="summary-heading"
            />

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$99.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$8.32</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">$112.32</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="submit"
                className={`w-full rounded-md border border-transparent bg-green px-4 py-3 text-base font-medium text-white shadow-sm 
                  hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-50`}
              >
                Commander
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
