import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Les pays où le cannabis récréatif est totalement légal</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Le cannabis récréatif est légal dans très peu de pays. L&apos;Uruguay a été le premier pays à le légaliser en 2013, suivi du Canada en 2018.
          En 2021, Malte est devenu le premier pays européen à légaliser sa culture et sa consommation. D&apos;autres pays européens comme le
          Luxembourg et l&apos;Allemagne envisagent des mesures similaires pour lutter contre le marché noir.
        </p>
      </details>

      <h2>Le cannabis récréatif est différent du chanvre bien-être</h2>
      <p>
        Cannabis, marijuana, chanvre indien, weed, ganja, beuh, herbe… Lorsque l’on parle de <mark>cannabis récréatif</mark>, il est en fait question
        de la plante appartenant au genre botanique <dfn>Cannabis</dfn> qui contient notamment un <mark>taux élevé de tétrahydrocannabinol</mark>{" "}
        (THC). Le THC est un cannabinoïde bien connu pour ses <mark>propriétés psychotropes</mark>.
      </p>
      <p>
        Il est important de différencier le cannabis récréatif du <mark>chanvre bien-être</mark> qui ne contient qu’un infime pourcentage de THC et
        n’engendre donc aucun effet psychotrope.
      </p>

      <h2>Deux pays ont légalisé le cannabis avant 2021</h2>

      <h3>Uruguay, premier pays où la marijuana est légale</h3>
      <p>
        Le 20 décembre 2013, <mark>l’Uruguay est devenu le premier pays au monde à légaliser la culture et la vente du cannabis récréatif</mark>. Ce
        pays d’Amérique du Sud avait entamé la voie de la légalisation de nombreuses années auparavant. En effet, dès 1974, la consommation du
        cannabis y avait été dépénalisée.
      </p>
      <p>
        En Uruguay, <mark>la culture à domicile est autorisée</mark> (6 plantes femelles en fleurs maximum par personne) ainsi que celle dans{" "}
        <mark>les clubs cannabiques</mark> (jusqu’à 99 plants et 45 membres au plus). Aujourd’hui,{" "}
        <mark>le cannabis récréatif peut s&apos;acheter dans certaines pharmacies</mark>. Il est tout de même nécessaire de s’inscrire sur un registre
        national. Par ailleurs, le taux de THC dans le cannabis commercialisé en pharmacie peut aller jusqu’à 4%.
      </p>
      <p>Entre 2014 et 2018, le taux de consommation de cannabis récréatif est passé de 9,3% de la population uruguayenne à 14,6%.</p>

      <h3>Canada, premier pays du G7 à légaliser le cannabis récréatif</h3>
      <p>
        Après l’Uruguay, <mark>le Canada a officiellement légalisé la consommation et la vente du cannabis récréatif</mark> le 16 octobre 2018.
        Précisons que le recours au cannabis médical était déjà autorisé.
      </p>
      <p>
        Au Canada, les personnes majeures peuvent se déplacer avec jusqu’à 30 grammes de cannabis sur elles, en posséder au maximum 150 grammes chez
        elles et cultiver 4 plants tout au plus par résidence. Seuls les titulaires d’une <mark>licence fédérale de cannabis</mark> peuvent cultiver
        cette plante dans le but de la commercialiser.
      </p>
      <p>Les différentes provinces canadiennes peuvent établir des restrictions supplémentaires, notamment :</p>
      <ul>
        <li>Augmenter l’âge minimal,</li>
        <li>Réduire la limite de possession,</li>
        <li>Limiter les lieux où le cannabis récréatif peut être consommé en public,</li>
        <li>Établir des exigences supplémentaires pour la culture du cannabis pour un usage personnel.</li>
      </ul>

      <h2>2021 : Malte, premier pays européen à légaliser le cannabis</h2>

      <figure>
        <Image
          width="225"
          height="300"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/03/cannabis-plant-weed-marijuana-225x300.jpg"
          alt="Cannabis en pot"
          loading="lazy"
        />
        <figcaption>Cannabis en pot cultivé légalement.</figcaption>
      </figure>

      <figure>
        <Image
          width="200"
          height="300"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/03/cannabis-4633206_1280-200x300.webp"
          alt="Feuille de cannabis"
          loading="lazy"
        />
        <figcaption>Feuille de cannabis sous éclairage naturel.</figcaption>
      </figure>

      <p>
        Depuis le 14 décembre 2021, <mark>Malte a légalisé la vente et la consommation du cannabis récréatif</mark>. En 2015, Malte avait déjà
        dépénalisé la possession de petites quantités de marijuana. Et en 2018, c’est l’utilisation du cannabis médical qui devenait à son tour
        dépénalisée.
      </p>
      <p>
        La loi maltaise permet maintenant aux résidents majeurs de l’île de posséder sur eux jusqu’à 7 grammes de marijuana et de cultiver jusqu’à 4
        pieds de cannabis par résidence. La consommation en public reste toutefois interdite avec une amende de 235€ en cas d’entrave à la loi.
      </p>
      <p>
        Grâce à cette disposition législative, Malte souhaite <mark>réduire les risques liés à la consommation de cannabis</mark> pour que les Maltais
        n’aient pas à acheter des produits de mauvaise qualité sur le marché noir.
      </p>
      <p>
        Certains États européens tolèrent la consommation de cannabis récréatif tandis que d’autres - comme la France - continuent à plaider pour son
        interdiction ferme. En Europe, le Luxembourg et l’Allemagne envisagent de légaliser le cannabis pour{" "}
        <mark>lutter contre la criminalité associée à ce marché non régulé</mark>. Malte servira-t-elle d’exemple au sein de l’Europe ?
      </p>
    </article>
  );
}
