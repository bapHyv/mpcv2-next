'use client'

import { useEffect, useState } from 'react';

const Commandes = () => {

  // State to hold addresses
  const [orders, setOrders] = useState<any[]>(() => {
    const storedUserData = localStorage.getItem('userData')
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null
    return parsedUserData?.orders || [];
  });

  return (
    <section className="bg-teal-50 text-light-green py-10 px-5">
      {/* Commandes en cours */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-5">Commandes</h3>
        <div className="space-y-8">
          {/* Dynamic Orders List */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="border-b border-dark-green pb-4"
            >
              {/* Header Section */}
              <div className="flex justify-between items-center">
                {/* Left Section: Date and Order Details */}
                <div>
                  <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="font-bold text-teal-800">NUMÉRO DE COMMANDE: {order.id}</p>
                </div>

                {/* Right Section: Total Price and Status */}
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {parseFloat(order.total).toFixed(2)} {order.currency}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      order.status === "Delivered"
                        ? "text-green-600"

                        : order.status === 'wc-on-hold' ? "text-yellow-600" : 'text-red-600'
                    }`}
                  >
                    {order.status === 'wc-on-hold' ?  'In progress' :  order.status === 'wc-failed' ? 'Failed' : 'Delivered' }
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <table className="mt-4 w-full text-gray-500 sm:mt-6">
                <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                  <tr>
                    <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                      Product
                    </th>
                    <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                  {order.products.map((product : any) => (
                    <tr key={`${order.id}`}>
                      <td className="py-6 pr-8">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-teal-800">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
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