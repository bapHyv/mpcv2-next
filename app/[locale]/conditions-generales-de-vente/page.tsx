import { linkClassname } from "@/app/staticData/cartPageClasses";
import { getTranslations } from "next-intl/server";
/**
 * 
H2: Préambule et Champ d'Application
  H3: Identification du Vendeur (MONPLANCBD SAS)
  H3: Identification de l'Acheteur
  H3: Objet des Conditions Générales de Vente
  H3: Acceptation des Conditions
H2: Produits
  H3: Description des Produits
  H3: Disponibilité des Produits
  H3: Zone Géographique de Vente
H2: Prix
  H3: Devise et Taxes (TVA)
  H3: Modification des Prix
  H3: Frais de Livraison (Suggestion: Follow this with a clear table instead of paragraph)
H2: Commande et Paiement
  H3: Processus de Commande
  H3: Compte Client et Commande Invité
  H3: Confirmation de Commande
  H3: Moyens de Paiement Sécurisés
  H3: Preuve de la Transaction




H2: Réserve de Propriété
H2: Droit de Rétractation
  H3: Délai d'Exercice du Droit de Rétractation
  H3: Conditions de Retour des Produits
  H3: Modalités de Retour et Remboursement (Suggestion: Link to a detailed Returns Policy page if available)
H2: Livraison
  H3: Adresse de Livraison
  H3: Modes et Frais de Livraison (Reiteration/link back to price section or dedicated policy)
  H3: Délais de Livraison (Indicatifs)
  H3: Transfert des Risques
  H3: Réception de la Commande et Vérification
  H3: Problèmes de Livraison (Dommages, Colis non reçu)
H2: Garanties Légales
  H3: Garantie de Conformité
  H3: Garantie des Vices Cachés
  H3: Modalités de Réclamation
H2: Responsabilité







H2: Propriété Intellectuelle
H2: Protection des Données Personnelles (Short section linking to the full Privacy Policy)
H2: Utilisation des Cookies (Short section linking to Cookie information, likely within Privacy Policy)
H2: Modification des Conditions Générales de Vente
H2: Droit Applicable et Règlement des Litiges
  H3: Droit Applicable
  H3: Juridiction Compétente
  H3: Médiation et Règlement en Ligne des Litiges (ODR) (Optional but recommended)
H2: Contact


first step: generate content
seconde step: generate html and translation keys
third step: english translation
fourth step: french translation
fith step: spanish translation
 */
interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "GCS" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "GCS" });
  return (
    <div className="utility-page">
      {/* H2: Préambule et Champ d'Application */}
      <h2>{t("preamble.title")}</h2>

      {/* H3: Identification du Vendeur (MONPLANCBD SAS) */}
      <h3>{t("preamble.sellerId.title")}</h3>
      <p>{t("preamble.sellerId.para1")}</p>

      {/* H3: Identification de l'Acheteur */}
      <h3>{t("preamble.buyerId.title")}</h3>
      <p>{t("preamble.buyerId.para1")}</p>

      {/* H3: Objet des Conditions Générales de Vente */}
      <h3>{t("preamble.object.title")}</h3>
      <p>{t("preamble.object.para1")}</p>

      {/* H3: Acceptation des Conditions */}
      <h3>{t("preamble.acceptance.title")}</h3>
      <p>{t("preamble.acceptance.para1")}</p>

      {/* H2: Produits */}
      <h2>{t("products.title")}</h2>

      {/* H3: Description des Produits */}
      <h3>{t("products.description.title")}</h3>
      <p>{t("products.description.para1")}</p>

      {/* H3: Disponibilité des Produits */}
      <h3>{t("products.availability.title")}</h3>
      <p>{t("products.availability.para1")}</p>

      {/* H3: Zone Géographique de Vente */}
      <h3>{t("products.zone.title")}</h3>
      <p>{t("products.zone.para1")}</p>

      {/* H2: Prix */}
      <h2>{t("price.title")}</h2>

      {/* H3: Devise et Taxes (TVA) */}
      <h3>{t("price.currencyVat.title")}</h3>
      <p>{t("price.currencyVat.para1")}</p>

      {/* H3: Modification des Prix */}
      <h3>{t("price.modification.title")}</h3>
      <p>{t("price.modification.para1")}</p>

      {/* H3: Frais de Livraison */}
      <h3>{t("price.shippingCosts.title")}</h3>
      <p>{t("price.shippingCosts.para1")}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: t("price.shippingCosts.para2", {
            shippingPolicyLink: `<a href="/${locale}/politique-expedition" class="${linkClassname}">${t(
              "price.shippingCosts.shippingPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Reminder: Insert Shipping Costs Table HTML here after this paragraph */}

      {/* H2: Commande et Paiement */}
      <h2>{t("orderPayment.title")}</h2>

      {/* H3: Processus de Commande */}
      <h3>{t("orderPayment.process.title")}</h3>
      <p>{t("orderPayment.process.para1")}</p>

      {/* H3: Compte Client et Commande Invité */}
      <h3>{t("orderPayment.accountGuest.title")}</h3>
      <p>{t("orderPayment.accountGuest.para1")}</p>

      {/* H3: Confirmation de Commande */}
      <h3>{t("orderPayment.confirmation.title")}</h3>
      <p>{t("orderPayment.confirmation.para1")}</p>

      {/* H3: Moyens de Paiement Sécurisés */}
      <h3>{t("orderPayment.securePayment.title")}</h3>
      <p>{t("orderPayment.securePayment.para1")}</p>

      {/* H3: Preuve de la Transaction */}
      <h3>{t("orderPayment.proof.title")}</h3>
      <p>{t("orderPayment.proof.para1")}</p>

      {/* H2: Réserve de Propriété */}
      <h2 className="!text-xl !text-left">{t("retentionOfTitle.title")}</h2>
      <p>{t("retentionOfTitle.para1")}</p>

      {/* H2: Droit de Rétractation */}
      <h2 className="!text-xl !text-left">{t("rightOfWithdrawal.title")}</h2>

      {/* H3: Délai d'Exercice du Droit de Rétractation */}
      <h3 className="!text-lg !text-left">{t("rightOfWithdrawal.exercisePeriod.title")}</h3>
      <p>{t("rightOfWithdrawal.exercisePeriod.para1")}</p>

      {/* H3: Conditions de Retour des Produits */}
      <h3 className="!text-lg !text-left">{t("rightOfWithdrawal.returnConditions.title")}</h3>
      <p>{t("rightOfWithdrawal.returnConditions.para1")}</p>

      {/* H3: Modalités de Retour et Remboursement */}
      <h3 className="!text-lg !text-left">{t("rightOfWithdrawal.returnRefundProcess.title")}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: t("rightOfWithdrawal.returnRefundProcess.para1", {
            returnPolicyLink: `<a href="/${locale}/politique-de-retour" class="${linkClassname}">${t(
              "rightOfWithdrawal.returnRefundProcess.returnPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Adjust href="/${locale}/politique-de-retour" if your return policy page slug is different */}

      {/* H2: Livraison */}
      <h2 className="!text-xl !text-left">{t("delivery.title")}</h2>

      {/* H3: Adresse de Livraison */}
      <h3 className="!text-lg !text-left">{t("delivery.address.title")}</h3>
      <p>{t("delivery.address.para1")}</p>

      {/* H3: Modes et Frais de Livraison */}
      <h3 className="!text-lg !text-left">{t("delivery.methodsCosts.title")}</h3>
      <p>{t("delivery.methodsCosts.para1")}</p>

      {/* H3: Délais de Livraison (Indicatifs) */}
      <h3 className="!text-lg !text-left">{t("delivery.timescales.title")}</h3>
      <p>{t("delivery.timescales.para1")}</p>

      {/* H3: Transfert des Risques */}
      <h3 className="!text-lg !text-left">{t("delivery.riskTransfer.title")}</h3>
      <p>{t("delivery.riskTransfer.para1")}</p>

      {/* H3: Réception de la Commande et Vérification */}
      <h3 className="!text-lg !text-left">{t("delivery.receptionVerification.title")}</h3>
      <p>{t("delivery.receptionVerification.para1")}</p>

      {/* H3: Problèmes de Livraison (Dommages, Colis non reçu) */}
      <h3 className="!text-lg !text-left">{t("delivery.issues.title")}</h3>
      <p>{t("delivery.issues.para1")}</p>

      {/* H2: Garanties Légales */}
      <h2 className="!text-xl !text-left">{t("legalGuarantees.title")}</h2>

      {/* H3: Garantie de Conformité */}
      <h3 className="!text-lg !text-left">{t("legalGuarantees.conformity.title")}</h3>
      <p>{t("legalGuarantees.conformity.para1")}</p>

      {/* H3: Garantie des Vices Cachés */}
      <h3 className="!text-lg !text-left">{t("legalGuarantees.hiddenDefects.title")}</h3>
      <p>{t("legalGuarantees.hiddenDefects.para1")}</p>

      {/* H3: Modalités de Réclamation */}
      <h3 className="!text-lg !text-left">{t("legalGuarantees.claimsProcess.title")}</h3>
      <p>{t("legalGuarantees.claimsProcess.para1")}</p>

      {/* H2: Responsabilité */}
      <h2 className="!text-xl !text-left">{t("liability.title")}</h2>
      <p>{t("liability.para1")}</p>
      <p>{t("liability.para2")}</p>

      <h2 className="!text-xl !text-left">{t("intellectualProperty.title")}</h2>
      <p>{t("intellectualProperty.para1")}</p>
      <p>{t("intellectualProperty.para2")}</p>

      {/* H2: Protection des Données Personnelles */}
      <h2 className="!text-xl !text-left">{t("personalData.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("personalData.para1", {
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "personalData.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Adjust href="/${locale}/politiques-de-confidentialites" if your privacy policy page slug is different */}

      {/* H2: Utilisation des Cookies */}
      <h2 className="!text-xl !text-left">{t("cookies.title")}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: t("cookies.para1", {
            privacyPolicyLink: `<a href="/${locale}/politiques-de-confidentialites" class="${linkClassname}">${t(
              "cookies.privacyPolicyLinkText"
            )}</a>`,
          }),
        }}
      />
      {/* Note: Linking to the privacy policy again, assuming cookie details are within it */}

      {/* H2: Modification des Conditions Générales de Vente */}
      <h2 className="!text-xl !text-left">{t("modificationGTC.title")}</h2>
      <p>{t("modificationGTC.para1")}</p>
      <p>{t("modificationGTC.para2")}</p>

      {/* H2: Droit Applicable et Règlement des Litiges */}
      <h2 className="!text-xl !text-left">{t("governingLawDisputes.title")}</h2>

      {/* H3: Droit Applicable */}
      <h3 className="!text-lg !text-left">{t("governingLawDisputes.applicableLaw.title")}</h3>
      <p>{t("governingLawDisputes.applicableLaw.para1")}</p>

      {/* H3: Juridiction Compétente */}
      <h3 className="!text-lg !text-left">{t("governingLawDisputes.jurisdiction.title")}</h3>
      <p>{t("governingLawDisputes.jurisdiction.para1")}</p>

      {/* H3: Médiation et Règlement en Ligne des Litiges (ODR) */}
      <h3 className="!text-lg !text-left">{t("governingLawDisputes.mediationODR.title")}</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: t("governingLawDisputes.mediationODR.para1", {
            odrLink: `<a href="https://webgate.ec.europa.eu/odr/" target="_blank" rel="noopener noreferrer" class="${linkClassname}">${t(
              "governingLawDisputes.mediationODR.odrLinkText"
            )}</a>`,
          }),
        }}
      />

      {/* H2: Contact */}
      <h2 className="!text-xl !text-left">{t("contact.title")}</h2>
      <p>{t("contact.para1")}</p>
      <ul className="list-disc list-inside space-y-1 my-4">
        <li>
          {t("contact.email")}:{" "}
          <a href={`mailto:${t("contact.emailAddress")}`} className={linkClassname}>
            {t("contact.emailAddress")}
          </a>
        </li>
        <li>
          {/* TODO: change here */}
          {t("contact.phone")}: {t("contact.phoneNumber")} ({t("contact.phoneInfo")})
        </li>
        <li>
          {t("contact.mail")}: {t("contact.postalAddress")}
        </li>
      </ul>

      <p>___________________________________________________________________________________________________________________</p>
      <h1>CONDITIONS GÉNÉRALES DE VENTE MON PLAN CBD</h1>
      <p>
        Les présentes conditions de vente sont conclues d’une part par la société MONPLANCBD au capital social de 1000€ dont le siège social est situé
        à Bayonne, immatriculée au Registre du Commerce et des Sociétés de Bayonne sous le numéro 887803955 ci-après dénommée “SAS MONPLANCBD” et
        gérant le site <a href="https://monplancbd.fr/">www.monplancbd.fr</a> et, d’autre part, par toute personne physique ou morale souhaitant
        procéder à un achat via le site internet <a href="https://monplancbd.fr/">www.monplancbd.fr</a> dénommée ci-après “l’acheteur”.
      </p>
      <p>
        <strong>Article 1. Objet: </strong>Les présentes conditions de vente visent à définir les relations contractuelles entre MONPLANCBD et
        l’acheteur et les conditions applicables à tout achat effectué par le biais du site internet{" "}
        <a href="https://monplancbd.fr/">www.monplancbd.fr</a>. L’acquisition d’un produit à travers le présent site implique une acceptation sans
        réserve par l’acheteur des présentes conditions de vente dont l’acheteur reconnaît avoir pris connaissance préalablement à sa commande. Avant
        toute transaction, l’acheteur déclare d’une part que l’achat de produits sur le site <a href="https://monplancbd.fr/">www.monplancbd.fr</a>{" "}
        est sans rapport direct avec son activité professionnelle et est limité à une utilisation strictement personnelle et d’autre part avoir la
        pleine capacité juridique, lui permettant de s’engager au titre des présentes conditions générales de vente.La société MONPLANCBD conserve la
        possibilité de modifier à tout moment ces conditions de vente, afin de respecter toute nouvelle réglementation ou dans le but d’améliorer
        l’utilisation de son site. De ce fait, les conditions applicables seront celles en vigueur à la date de la commande par l’acheteur.
      </p>
      <p>
        <strong>Article 2. Produits: </strong>Les produits proposés sont ceux qui figurent sur le site{" "}
        <a href="https://monplancbd.fr/">www.monplancbd.fr</a> de la société MONPLANCBD, dans la limite des stocks disponibles. La société MONPLANCBD
        se réserve le droit de modifier à tout moment l’assortiment de produits. Chaque produit est présenté sur le site internet sous forme d’un
        descriptif reprenant ses principales caractéristiques techniques (contenance, utilisation, composition…). Les photographies sont les plus
        fidèles possibles mais n’engagent en rien le Vendeur. La vente des produits présentés dans le site{" "}
        <a href="https://monplancbd.fr/">www.monplancbd.fr</a> est destinée à tous les acheteurs résidants sur le territoire européen.
      </p>
      <p>
        <strong>Article 3. Tarifs: </strong>Les prix figurant sur les fiches produits du catalogue internet sont des prix en Euros (€) toutes taxes
        comprises (TTC) tenant compte de la TVA applicable au jour de la commande. Tout changement du taux de la TVA pourra être répercuté sur le prix
        des produits. La société MONPLANCBD se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix figurant au
        catalogue le jour de la commande sera le seul applicable à l’acheteur. Les prix indiqués ne comprennent pas les frais de livraison, facturés
        en supplément du prix des produits achetés suivant le montant total de la commande. En France métropolitaine, pour toute commande supérieure
        ou égale à 40 euros TTC, les frais de port sont offerts ; pour toute commande inférieure à 40 euros TTC, un forfait de participation aux frais
        d’expédition sera facturé à l’acheteur d’un montant de 5 euros TTC. En Belgique, pour toute commande supérieure ou égale à 65 euros TTC, les
        frais de port sont offerts ; pour toute commande inférieure à 65 euros TTC, un forfait de participation aux frais d’expédition sera facturé à
        l’acheteur d’un montant de 8 euros TTC. La réunion, pour toute commande supérieure ou égale à 80 euros TTC, les frais de port sont offerts ;
        pour toute commande inférieure à 80 euros TTC, un forfait de participation aux frais d’expédition sera facturé à l’acheteur d’un montant de 10
        euros TTC. En Espagne, pour toute commande supérieure ou égale à 80 euros TTC, les frais de port sont offerts ; pour toute commande inférieure
        à 80 euros TTC, un forfait de participation aux frais d’expédition sera facturé à l’acheteur d’un montant de 10 euros TTC. En Irlande, pour
        toute commande supérieure ou égale à 80 euros TTC, les frais de port sont offerts ; pour toute commande inférieure à 80 euros TTC, un forfait
        de participation aux frais d’expédition sera facturé à l’acheteur d’un montant de 10 euros TTC.
      </p>
      <p>
        <strong>Article 4. Commande et modalités de paiement: </strong>Avant toute commande, l’acheteur peut créer un compte sur le site{" "}
        <a href="https://monplancbd.fr/">www.monplancbd.fr</a> ou passer commande en mode “Invité”. La rubrique de création de compte est accessible
        directement depuis la barre de menu latérale. A chaque visite, l’acheteur, s’il souhaite commander ou consulter son compte (état des
        commandes, profil…), devra s’identifier à l’aide de ces informations. La société MONPLANCBD propose à l’acheteur de commander et régler ses
        produits en plusieurs étapes, avec 1 option de paiement:<strong>– Paiement sécurisé par carte bancaire (3D secure) :</strong> l’acheteur
        sélectionne les produits qu’il souhaite commander dans le « panier », modifie si besoin (quantités, références…), vérifie l’adresse de
        livraison ou en renseigne une nouvelle. Puis, les frais de port sont calculés et soumis à l’acheteur. Ensuite, l’acheteur choisit le mode de
        paiement de son choix : « Paiement par CB ». L’étape suivante lui propose de vérifier l’ensemble des informations, prendre connaissance et
        accepter les présentes conditions générales de vente en cochant la case correspondante, puis l’invite à valider sa commande en cliquant sur le
        bouton « Confirmer ma commande ». Enfin, l’acheteur est redirigé sur l’interface sécurisée Stripe afin de renseigner en toute sécurité ses
        références de carte bleue personnelle. Si le paiement est accepté, la commande est enregistrée et le contrat définitivement formé. Le paiement
        par carte bancaire est irrévocable. La responsabilité du titulaire d’une carte bancaire n’est pas engagée si le paiement contesté a été prouvé
        effectué frauduleusement, à distance, sans utilisation physique de sa carte. Pour obtenir le remboursement du débit frauduleux et des
        éventuels frais bancaires que l’opération a pu engendrer, le porteur de la carte doit contester, par écrit, le prélèvement auprès de sa
        banque, dans les 70 jours suivant l’opération, voire 120 jours si le contrat le liant à celle-ci le prévoit. Les montants prélevés sont
        remboursés par la banque dans un délai maximum d’un mois après réception de la contestation écrite formée par le porteur. Aucun frais de
        restitution des sommes ne pourra être mis à la charge du titulaire.La confirmation d’une commande entraîne l&apos;acceptation des présentes
        conditions de vente, la reconnaissance d’en avoir parfaite connaissance et la renonciation à se prévaloir de ses propres conditions d’achat.
        L’ensemble des données fournies et la confirmation enregistrée vaudront preuve de la transaction. Si l’acheteur possède une adresse
        électronique et s’il l’a renseignée sur son bon de commande, la société MONPLANCBD lui communiquera par courrier électronique la confirmation
        de l’enregistrement de sa commande.Si l’acheteur souhaite contacter la société MONPLANCBD il peut le faire soit par courrier à l’adresse
        suivante : MONPLANCBD, 2 place Elie Lambert, 64100 Bayonne ; soit par e-mail à l’adresse suivante : contact@monplancbd.fr, soit par téléphone
        au 07 66 13 59 38.
      </p>
      <p>
        <strong>Article 5. Réserve de propriété: </strong>La société MONPLANCBD conserve la propriété pleine et entière des produits vendus jusqu’au
        parfait encaissement du prix, en principal, frais et taxes compris.
      </p>
      <p>
        <strong>Article 6. Rétractation: </strong>En vertu de l’article L121-20 du Code de la consommation, l’acheteur dispose d’un délai de quatorze
        jours ouvrables à compter de la livraison de sa commande pour exercer son droit de rétractation et ainsi faire retour du produit au vendeur
        pour échange ou remboursement sans pénalité, à l’exception des frais de retour. Les produits devront êtres intacts. Ils ne devront présenter
        aucune différence avec ceux envoyés.
      </p>
      <p>
        <strong>Article 7. Livraison: </strong>Les livraisons sont faites à l’adresse indiquée sur le bon de commande qui ne peut être que dans la
        zone géographique convenue. La livraison des commandes est effectuée par Chronopost, service de livraison avec suivi, remise avec ou sans
        signature. Les délais de livraison ne sont donnés qu’à titre indicatif ; si ceux-ci dépassent trente jours à compter de la commande, le
        contrat de vente pourra être résilié et l’acheteur remboursé. La société MONPLANCBD pourra fournir par e-mail à l’acheteur le numéro de suivi
        de son colis. L’acheteur est livré à son domicile par son facteur. En cas d’absence de l’acheteur, il recevra un avis de passage de son
        facteur, ce qui lui permet de retirer les produits commandés au bureau de poste le plus proche, pendant un délai indiqué par les services
        postaux. Les risques liés au transport sont à la charge de l’acquéreur à compter du moment où les articles quittent les locaux de la société
        MONPLANCBD. L’acheteur est tenu de vérifier en présence du préposé de La Poste ou du livreur, l’état de l’emballage de la marchandise et son
        contenu à la livraison. En cas de dommage pendant le transport, toute protestation doit être effectuée auprès du transporteur dans un délai de
        trois jours à compter de la livraison.<strong>IMPORTANT : </strong> Lorsque votre suivi indique que votre commande a été distribuée mais que
        vous affirmez ne pas l’avoir reçue, veuillez noter que nous ne pourrons en aucun cas procéder au renvoi de votre commande ni au remboursement
        de celle-ci, peu importe le mode de livraison choisi.
      </p>
      <p>
        <strong>Article 8. Garantie: </strong>Tous les produits fournis par la société MONPLANCBD bénéficient de la garantie légale prévue par les
        articles 1641 du Code civil. En cas de non conformité d’un produit vendu, il pourra être retourné à la société MONPLANCBD qui le reprendra,
        l’échangera ou le remboursera. Toutes les réclamations, demandes d’échange ou de remboursement doivent s’effectuer par voie postale à
        l’adresse suivante : MONPLANCBD, 2 place Elie Lambert, 64100 Bayonne, dans un délai de trente jours après livraison.
      </p>

      <p>
        <strong>Article 9. Responsabilité: </strong>La société MONPLANCBD, dans le processus de vente à distance, n’est tenue que par une obligation
        de moyens. Sa responsabilité ne pourra être engagée pour un dommage résultant de l’utilisation du réseau Internet tel que perte de données,
        intrusion, virus, rupture du service, ou autres problèmes involontaires.
      </p>
      <p>
        <strong>Article 10. Propriété intellectuelle: </strong>Tous les éléments du site <a href="https://monplancbd.fr/">www.monplancbd.fr</a> sont
        et restent la propriété intellectuelle et exclusive de la société MONPLANCBD. Personne n’est autorisé à reproduire, exploiter, ou utiliser à
        quelque titre que ce soit, même partiellement, des éléments du site qu’ils soient sous forme de photo, logo, visuel ou texte.
      </p>
      <p>
        <strong>Article 11. Données à caractère personnel: </strong>La société MONPLANCBD s’engage à préserver la confidentialité des informations
        fournies par l’acheteur, qu’il serait amené à transmettre pour l’utilisation de certains services. Toute information le concernant est soumise
        aux dispositions de la loi n° 78-17 du 6 janvier 1978. A ce titre, l’internaute dispose d’un droit d’accès, de modification et de suppression
        des informations le concernant. Il peut en faire la demande à tout moment par courrier à l’adresse suivante : MONPLANCBD, 2 place Elie
        Lambert, 64100 Bayonne.
      </p>
      <p>
        <strong>Article 12. Règlement des litiges: </strong>Les présentes conditions de vente à distance sont soumises à la loi française. Pour tous
        litiges ou contentieux, le Tribunal compétent sera celui de Bayonne
      </p>
    </div>
  );
}
