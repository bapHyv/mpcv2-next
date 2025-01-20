'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/authContext';
import { UpdatedUserData, UserData } from '@/app/types/profileTypes';



const PointsSection: React.FC = () => {

  // State to hold addresses
  const [userData, setUserData] = useState<any>(() => {
    const storedUserData = localStorage.getItem('userData')
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null
    return parsedUserData || []
  });
  const [inputValue, setInputValue] = useState(`https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData.referralToken}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue).then(
      () => {
        alert("Copied to clipboard!"); // Optional feedback for the user
      },
      () => {
        alert("Failed to copy!");
      }
    );
  };

  return (
    <>
      <section className="bg-light-green text-white py-10 px-5 text-center">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl mb-2">
            Votre solde actuel <span className="font-bold text-3xl">{userData.loyaltyPoints} points</span>
          </h2>
          <h3 className="text-xl">Comment gagner des points</h3>
        </div>

        {/* Boxes */}
        <div className="flex flex-col md:flex-row justify-center items-start gap-6">
          {/* Box 1 */}
          <div className="border-white border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-5">
            <h4 className="text-lg text-center mb-3">Gagnez 1 point pour chaque € dépensé dans notre boutique !</h4>
            <p className="text-sm text-center">
              <strong>Points acquis</strong>
              <br />1 POINT / 1,00 €
            </p>
          </div>

          {/* Box 2 */}
          <div className="border-white border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-5">
            <h4 className="text-lg text-center mb-9">Noter un produit et recevez 10 points !</h4>
            <p className="text-sm text-center">
              <strong>Points acquis</strong>
              <br />10 POINTS
            </p>
          </div>

          {/* Box 3 */}
          <div className="border-white border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-5">
            <h4 className="text-lg text-center mb-16">Enregistrement du parrainé</h4>
            <p className="text-sm text-center">
              <strong>Points acquis</strong>
              <br />50 POINTS
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm">
          <strong>POINTS DU PANIER :</strong> À chaque Point que vous utilisez vaut 0,1 €
        </p>
      </section>

      <section className="bg-white text-teal-600 py-10 px-5 text-center">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">Votre lien de parrainage</h3>
          <p className="text-sm">
            Copiez et partagez votre lien de parrainage avec vos amis pour gagner
            des points !
          </p>
        </div>

        {/* Referral Link */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          {/* Input Box */}
          <input
            type="text"
            readOnly
            value={`https://www.monplancbd.fr/mon-compte-mon-plan-cbd/?referral=${userData.referralToken}`}
            className="w-full md:w-2/3 border border-teal-600 rounded-lg p-3 text-sm text-teal-600 focus:outline-none focus:ring focus:ring-teal-300"
          />

          {/* Copy Button */}
          <button onClick={handleCopy}
            className="bg-light-green text-white px-6 py-3 rounded-lg hover:bg-teal-700">
            Copier
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-sm text-teal-700">
          Invitez vos amis à nous rejoindre pour gagner encore plus de points !
        </p>



        <div className="flex flex-col md:flex-row justify-center items-start gap-6 m-5">
          {/* Box 1 */}
          <div className="border-light-green border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-4">
            <h4 className="text-lg text-center mb-3">Commandes du parrainé (montant superieur a 30,00 euros) (premiere commande seulement)</h4>
            <p className="text-sm text-center">
              
              <br />1 POINT
            </p>
          </div>

          {/* Box 2 */}
          <div className="border-light-green border-2 rounded-lg w-72 h-64 flex flex-col justify-center items-center p-4">
            <h4 className="text-lg text-center mb-10">Commandes du parrainé (premiere commande seulement)</h4>
            <p className="text-sm text-center">
              <br />1 POINTS
            </p>
          </div>
          </div>

      </section>


    </>

  );
};

export default PointsSection;
