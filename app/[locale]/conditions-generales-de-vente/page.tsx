import { getTranslations } from "next-intl/server";

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
