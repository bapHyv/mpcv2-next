export default function ShippingCalendar() {
  return (
    <table className="shadow-md text-xs md:text-base">
      <caption className="mt-2">Shipping calendar</caption>
      <thead className="bg-green border border-black text-white">
        <tr>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">Commande</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">LUN</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">MAR</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">MER</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">JEU</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">VEN</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">SAM</th>
          <th className="border border-black py-0.5 px-1 md:py-2 md:px-4">DIM</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-black py-0.5 px-1 md:py-2 md:px-4">Avant 12h00</td>
          <td colSpan={5} className="border border-black py-0.5 px-1 md:py-2 md:px-4 bg-teal-100">
            Expédiée le jour même
          </td>
          <td colSpan={2} className="border border-black py-0.5 px-1 md:py-2 md:px-4 bg-orange-100">
            Expédiée le lundi
          </td>
        </tr>
        <tr>
          <td className="border border-black py-0.5 px-1 md:py-2 md:px-4">Après 12h00</td>
          <td colSpan={4} className="border border-black py-0.5 px-1 md:py-2 md:px-4 bg-teal-50">
            Expédiée le lendemain
          </td>
          <td colSpan={3} className="border border-black py-0.5 px-1 md:py-2 md:px-4 bg-red-100">
            Expédiée le lundi
          </td>
        </tr>
      </tbody>
    </table>
  );
}
