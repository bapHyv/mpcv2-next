'use client';

import {useState } from 'react';
import { useTranslations } from "next-intl";


const Commandes = () => {
  const t = useTranslations("orders");

  const [orders, setOrders] = useState<any[]>(() => {
    const storedUserData = localStorage.getItem('userData');
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    return parsedUserData?.orders || [];
  });

  return (
    <section className="text-gray-800 mt-8 py-12 px-6 max-w-4xl mx-auto rounded-lg shadow-md">
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-teal-800 mb-6">
          {t("title")}
        </h3>
        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-semibold text-green">
                    {t("order.orderNumber")}: {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-gray-900">
                    {parseFloat(order.total).toFixed(2)} {order.currency}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "wc-on-hold"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status === "wc-on-hold"
                      ? t("order.status.onHold")
                      : order.status === "wc-failed"
                      ? t("order.status.failed")
                      : t("order.status.delivered")}
                  </p>
                </div>
              </div>
              <table className="mt-6 w-full text-gray-700">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-600">
                    <th className="py-3 pr-8">{t("order.product")}</th>
                    <th className="py-3 pr-8 hidden sm:table-cell">
                      {t("order.price")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.products.map((product: any) => (
                    <tr key={product.name} className="text-sm">
                      <td className="py-4 pr-8 text-teal-900 font-medium">
                        {product.name}
                      </td>
                      <td className="py-4 pr-8 hidden sm:table-cell">
                        {parseFloat(product.price).toFixed(2)} {order.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Commandes;
