import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Actualité CBD en France : Ce qu&apos;il faut savoir</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          La vente de fleurs de CBD est à nouveau légale en France après l&apos;annulation de l&apos;arrêté du 31 décembre 2021 par le Conseil
          d&apos;État. De plus, le taux de THC autorisé dans les produits au CBD a été relevé de 0,2% à 0,3%, permettant ainsi aux agriculteurs de
          cultiver de nouvelles variétés de chanvre avec des taux de CBD plus élevés. Enfin, un exemple de fleur CBD respectant ces nouvelles
          réglementations est la <em>Fruit Cake CBD</em>, qui contient 15% de CBD et 0,29% de THC.
        </p>
      </details>

      <p>
        Si vous avez lu ou écouté l&apos;actualité CBD, plusieurs informations ont pu retenir votre attention et peut-être vous posez-vous les
        questions suivantes :{" "}
        <strong>
          la vente de fleurs de CBD est-elle légale ou illégale ? Est-ce que le taux de cannabidiol autorisé dans les produits au CBD a changé ?
        </strong>{" "}
        On vous propose un petit point rapide sur l&apos;actualité CBD en France !
      </p>

      <h2>La vente de fleurs de CBD est de nouveau légale en France</h2>

      <p>
        L&apos;année s&apos;est mal terminée pour les acteurs de la filière du chanvre et du CBD. En effet,{" "}
        <mark>
          le 31 décembre 2021, le gouvernement français publiait un arrêté interdisant la vente de la fleur et de la feuille de chanvre à l&apos;état
          brut
        </mark>
        . Une manière pour la France d&apos;affirmer juridiquement sa position contre le CBD, une molécule naturelle procurant pourtant de nombreux
        bienfaits mais ne procurant aucun effet psychotrope.
      </p>

      <p>
        Cependant, la Cour de Justice Européenne et la Cour de Cassation ont rendu leur avis depuis longtemps :{" "}
        <dfn>le CBD ne peut pas être catégorisé comme un stupéfiant</dfn>. Et pour respecter la libre-circulation des marchandises dans l&apos;Union
        Européenne, l&apos;État français ne pouvait interdire la vente de CBD.
      </p>

      <p>
        Le 24 janvier 2022, saisi par plusieurs représentants de la filière du chanvre français,{" "}
        <mark>le Conseil d&apos;État français a suspendu l&apos;arrêté du 31 décembre 2021</mark> qui interdisait la vente de fleurs et de feuilles de
        CBD. La plus haute juridiction administrative française a estimé que la teneur en THC de moins de 0,3% ne posait aucun problème au niveau
        sanitaire. Depuis lors, <mark>la vente de CBD est de nouveau légale en France</mark>. 2022 commence finalement sous de bons augures !
      </p>

      <h2>NEW : 0,3% de THC dans les produits au CBD</h2>

      <p>
        Vous avez correctement lu, nous avons bien écrit <mark>0,3% de THC dans les produits au CBD</mark>. Pour les acteurs de la filière du chanvre
        comme pour celles et ceux qui consomment régulièrement du CBD, ceci est une bonne nouvelle !
      </p>

      <p>
        En effet, jusqu&apos;à fin 2021,{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/la-consommation-de-cbd-est-elle-legale-en-france/`}>
          le taux maximal de THC autorisé dans les produits au CBD était de 0,2%
        </a>
        . Puis le 31 décembre 2021, l&apos;arrêté publié par le gouvernement français était au moins doté d&apos;un point positif :{" "}
        <mark>le taux maximal de THC autorisé dans les produits au CBD est passé de 0,2% à 0,3%</mark>.
      </p>

      <p>
        Si cela vous semble une augmentation anecdotique, ce taux qui passe de 0,2% à 0,3% de THC est une source de nouvelles opportunités pour le
        secteur du chanvre. En effet, ce changement de taux légal permet aux agriculteurs de cultiver de nouvelles variétés de chanvre bien-être.{" "}
        <mark>Ces nouvelles génétiques exploitables offrent des taux de CBD plus élevés</mark>. Une expérience de consommation qui reste sans effet
        psychotrope mais qui offre la possibilité de ressentir davantage les bienfaits du cannabidiol.
      </p>

      <p>
        <em>
          [Si vous voulez comprendre comment fonctionne le ratio THC/CBD pour les plantes de chanvre, lisez{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/la-realite-autour-des-taux-de-cbd/`}>notre article à ce sujet</a> !]
        </em>
      </p>

      <p>
        Rendez-vous sur <a href={`https://www.monplancbd.fr/${locale}/fleurs-cbd/`}>notre e-shop CBD</a> !
      </p>

      <figure>
        <Image
          width="1024"
          height="683"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/02/MG_6696-1024x683.jpg"
          alt="fruit cake cbd 1"
          loading="lazy"
        />
        <figcaption>Fruit Cake CBD : une fleur de qualité avec 0,3% de THC</figcaption>
      </figure>

      <figure>
        <Image
          width="1024"
          height="683"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/02/MG_6695-1024x683.jpg"
          alt="fruit cake cbd 2"
          loading="lazy"
        />
        <figcaption>Fruit Cake CBD : un goût sucré et terreux</figcaption>
      </figure>
    </article>
  );
}
