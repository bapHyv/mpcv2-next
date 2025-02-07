import { getTranslations } from "next-intl/server";
import Image from "next/image";

interface Params {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Page({ params: { locale } }: Params) {
  const t = await getTranslations({ locale, namespace: "about" });
  return (
    <div className="utility-page">
      <h1>À PROPOS DU CBD</h1>
      <h2>Une passion pour le CBD</h2>
      <p>
        Mon Plan CBD, c’est une idée qui a germé il y a quelques mois, une fin d’après-midi d’hiver dans le Bistrot des Halles de Bayonne. Nous avons
        tous, individuellement, cultivé un intérêt pour cette plante qu’est le chanvre. Pour des usages personnels, pour nos proches ou même notre
        entourage, que ce soit en huile, en baume, en infusion, nous nous accordons à croire, comme beaucoup d’autres personnes, qu’un avenir
        prometteur se dessine autour de cette plante ancestralement utilisée de part le monde.
      </p>
      <h2>Des produits autorisés</h2>
      <p>
        Nos produits contiennent du cannabidiol (CBD). De cette molécule contenue dans le chanvre sont extraites les fleurs à infuser que nous vous
        proposons dans notre catalogue. Le CBD fait partie des 111 cannabinoïdes<strong>* </strong>connus à ce jour par le monde scientifique et
        médical. Il se démocratise de plus en plus sur le marché européen ainsi qu&apos;outre-atlantique.
      </p>
      <h2>Des produits contrôlés et certifiés</h2>
      <p>
        Nos fleurs et huiles de chanvre à infuser ou à vaporiser sont contrôlées et certifiées. Les procédures d’analyses du spectre de ces produits,
        effectuées notamment par<strong> IFHA</strong> (Institut für Hanfanalytik), sont en accord avec l’annexe B de l’arrêté 2004-02-24 art. 3 JORF
        du 21 mars 2004. A tout moment, vous pouvez retrouver ces analyses avec les QR Code associés à nos produits. Si vous souhaitez en savoir plus,
        nous publions également des articles concernant le monde du chanvre.
      </p>
      <h2>Des valeurs fortes</h2>
      <p>
        Notre volonté de transparence et de garantie de qualité sont des éléments essentiels pour une relation de confiance avec nos client.e.s tout
        au long de cette aventure. Nos produits, triés sur le volet par notre équipe, peuvent vous être livrés sous 24H dans le Pays basque (
        <a
          href="https://www.google.com/maps/d/edit?mid=1UBp3lAoKqBxWujjIMBFOLJ6BtedjGsBI&amp;usp=sharing"
          target="_blank"
          rel="noreferrer noopener nofollow"
          aria-label="voir la carte (opens in a new tab)"
        >
          voir la carte
        </a>
        ). Pour le reste de la France, la livraison s’effectue par voie postale avec un suivi de votre colis. La livraison est offerte dès 40€
        d’achat.
      </p>

      <div className="flex justify-center">
        <figure>
          <Image
            width="768"
            height="1152"
            src="https://www.monplancbd.fr/wp-content/uploads/2020/10/MG_2616-768x1152.webp"
            alt="strawberry outdoor cbd"
          />
          <figcaption>Pot de fleur de CBD</figcaption>
        </figure>
      </div>
    </div>
  );
}
