import { getTranslations } from "next-intl/server";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return (
    <div className="utility-page">
      <h1>FAQ - CBD</h1>
      <h3>CBD : Le cannabidiol, qu’est-ce que c’est ?</h3>
      <p>
        Le cannabidiol&nbsp;<strong>(CBD)&nbsp;</strong>est une molécule présente dans le chanvre et complète le spectre des 110 autres cannabinoïdes
        connus à ce jour. On lui connaît des vertus bien-être pour le sommeil, le stress, l’anxiété, les tensions musculaires, etc. On le retrouve
        sous forme de baume, d’huile ou de fleurs à infuser.
      </p>
      <h3>Comment connaître le taux de CBD/THC?</h3>
      <p>
        Il est tout naturel de vouloir connaître les taux de CBD ou de THC présents dans les fleurs et les huiles de chanvre que nous vous proposons.
        C’est pourquoi chaque étiquette produit se verra apposer un QR code qui vous redirigera vers l’analyse associée, répondant aux procédures
        requises par l’arrêté 2004-02-24 art. 3 JORF du 21 mars 2004.
      </p>
      <h3>Comment utiliser du CBD ?</h3>
      <p>
        Il n’y a pas une seule meilleure façon, tout simplement parce que chaque personne a un profil unique et particulier. La méthode la plus connue
        est l’infusion de la fleur de chanvre en incorporant un corps gras dans le mélange. Par exemple, vVous pouvez ajouter du beurre, de la crème
        ou encore de huile végétale (comme l’huile de coco) dans de l’eau frémissante à 90°CLaissez infuser 10 à 15 min. Servez.
      </p>
      <h3>Puis-je me faire livrer du CBD à domicile ?</h3>
      <p>
        Si vous habitez dans l’une de ces villes (
        <a href="https://www.google.com/maps/d/edit?mid=1UBp3lAoKqBxWujjIMBFOLJ6BtedjGsBI&amp;usp=sharing" target="_blank" rel="nofollow noopener">
          voir la carte
        </a>
        ), vous pourrez recevoir vos produits sous 24H. La qualité de service et d’information sont des critères essentiels pour Mon Plan CBD.&nbsp;
        Pour cette raison, vous recevrez votre commande dans un conditionnement garantissant une conservation optimale afin de profiter au maximum des
        vertus bien-êtres recherchées.
      </p>
      <h3>Quelques recommandations…</h3>
      Conformément à la loi en vigueur, nos produits ne sont pas destinés à la combustion. Il s’agit de respecter la méthode mentionnée plus haut, à
      savoir l’infusion avec un corps gras. Ne pas fumer, ne pas conduire après consommation, déconseillé pour la femme enceinte ou allaitante. Si
      vous souhaitez en savoir plus sur les conditions d’utilisation, veuillez&nbsp;
      <a
        href={`https://www.monplancbd.fr/${locale}/blog/comment-choisir-et-consommer-fleurs-cbd/`}
        target="_blank"
        rel="noreferrer noopener nofollow"
        aria-label="cliquer ici (opens in a new tab)"
      >
        cliquer ici
      </a>
      . Nos produits ne sont ni des stupéfiants, ni des médicaments. Pour toute question, n’hésitez pas à nous joindre sur les réseaux sociaux ou par
      e-mail à l’adresse que vous trouverez dans la rubrique , en mentionnant votre demande en objet.
    </div>
  );
}
