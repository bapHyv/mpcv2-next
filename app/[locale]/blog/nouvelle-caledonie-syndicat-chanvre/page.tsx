import Image from "next/image";
interface Params {
  locale: string;
}

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Le Syndicat du Chanvre en Nouvelle-Calédonie</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Contrairement à la métropole, la <mark>vente et la consommation de CBD</mark> sont interdites en Nouvelle-Calédonie. Le{" "}
          <strong>Syndicat du chanvre calédonien</strong>, créé en 2022, œuvre pour la légalisation et la promotion du chanvre sur le territoire. Il a
          remplacé l&apos;<dfn>Association des chanvriers de Nouvelle-Calédonie</dfn> (ACNC), poursuivant les mêmes objectifs : favoriser la culture
          du chanvre, sensibiliser le public et promouvoir une industrie locale. L&apos;organisation met en avant l&apos;incohérence des
          réglementations locales qui autorisent la culture de certaines plantes considérées comme dangereuses mais interdisent celle du chanvre.
        </p>
      </details>

      <p>
        Contrairement à la législation en vigueur en métropole,{" "}
        <mark>la vente et la consommation de chanvre bien-être et de CBD sont interdites en Nouvelle-Calédonie</mark>. Pour sensibiliser le peuple
        calédonien aux intérêts divers de la culture du chanvre, <strong>le Syndicat du chanvre calédonien a vu le jour en 2022</strong>. Si cette
        organisation est indépendante du <dfn>Syndicat professionnel du chanvre</dfn> de métropole, leur objectif est bien commun. Chez{" "}
        <a href={`https://www.monplancbd.fr/${locale}/`}>Mon Plan CBD</a>, comme nous faisons partie du{" "}
      </p>

      <h2>Le chanvre en Nouvelle-Calédonie, chronologie</h2>
      <p>
        <strong>10 avril 2018</strong> : la Nouvelle-Calédonie classe le chanvre comme un stupéfiant. Cela vaut pour toutes les plantes issues du
        genre <dfn>Cannabis</dfn> ainsi que pour les produits en étant issus tels que la résine ou les cannabinoïdes (CBD, THC, CBG, CBN*…).
      </p>

      <p>
        <strong>Jusqu’en avril 2022 </strong>: c’est l’<dfn>Association des chanvriers de Nouvelle-Calédonie</dfn> (ACNC), une organisation à but non
        lucratif, qui sensibilise la population calédonienne aux bienfaits et aux intérêts du chanvre. L’ACNC rassemble des agriculteurs, économistes
        et scientifiques. Voici les différents buts poursuivis :
      </p>

      <ul>
        <li>Regrouper des moyens et compétences pour cultiver du chanvre et le transformer.</li>
        <li>Participer à la diversification de l’agriculture grâce au chanvre.</li>
        <li>Chercher des solutions écologiques biosourcées pour réduire l’empreinte carbone de la Nouvelle-Calédonie.</li>
        <li>Promouvoir la culture du chanvre en Nouvelle-Calédonie et informer à ce sujet.</li>
        <li>
          Représenter les adhérents de l’association et leurs intérêts tout en animant le dialogue avec les pouvoirs publics et les citoyens
          calédoniens.
        </li>
      </ul>

      <p>
        <strong>Depuis avril 2022 </strong>: le <dfn>Syndicat du chanvre de Nouvelle-Calédonie</dfn> remplace l’ACNC. Son objectif principal reste le
        même, à savoir <mark>la légalisation du chanvre</mark> sur le territoire calédonien. Dans un premier temps, le Syndicat du chanvre calédonien
        vise l’utilisation du chanvre dans l’industrie. Dans un second temps, l’organisation souhaite pouvoir légaliser l’extraction et l’utilisation
        des cannabinoïdes (CBD, CBG…).
      </p>

      <p>
        <em>
          [*Vous voulez en apprendre davantage sur les différents cannabinoïdes ? Consultez{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cbg-thc-cbn-les-differents-cannabinoides/`}>notre article dédié à ce sujet</a> !]
        </em>
      </p>

      <h2>Quelle est la mission du Syndicat du chanvre calédonien ?</h2>

      <h3>Oeuvrer pour la légalisation du chanvre et du CBD</h3>
      <p>
        Le <strong>Syndicat du chanvre de Nouvelle-Calédonie</strong> n’a pas de lien avec le syndicat du chanvre présent en métropole, ni avec celui
        de Tahiti, géographiquement proche. Toutefois, le but recherché reste le même : <mark>faire évoluer les mentalités et les lois</mark> par
        rapport à la culture et à la consommation du chanvre.
      </p>

      <p>
        La Nouvelle-Calédonie est une collectivité territoriale autonome. Elle a son propre gouvernement ainsi que son Parlement. Certaines lois sont
        donc différentes de celles appliquées en métropole. Concernant la légalisation du chanvre, depuis 2018, un arrêté interdit le cannabidiol
        (CBD), considéré comme un stupéfiant. <mark>La consommation et la commercialisation de CBD sont donc interdites en Nouvelle-Calédonie</mark>.
        De la même manière, <mark>l’importation de graines de chanvre est interdite</mark>, la plante de chanvre étant catégorisée comme une espèce
        invasive.
      </p>

      <h3>Proposer une culture du chanvre adaptée à la Nouvelle-Calédonie</h3>
      <p>
        En outre,{" "}
        <strong>
          la loi française appliquée en métropole limite le taux de THC naturellement présent dans les plantes de chanvre bien-être à 0,3%
        </strong>
        . Ce critère est un frein supplémentaire à la culture du chanvre en Nouvelle-Calédonie puisque le climat tropical fait mécaniquement augmenter
        le taux de THC. À titre de comparaison, <strong>la Réunion</strong> (département et région d’outre-mer){" "}
        <strong>a mis en place une dérogation</strong> pour résoudre cette problématique de culture, le chanvre cultivé peut donc présenter{" "}
        <mark>un taux de THC allant jusqu’à 1%</mark>.
      </p>

      <p>
        Précisons qu’en Nouvelle-Calédonie, il est possible d’obtenir des licences pour cultiver du pavot (contenant des composants analgésiques
        reconnus dangereux pour la santé) ou de la coca (considérée en métropole comme un stupéfiant), alors que la culture du chanvre est totalement
        interdite. Le Syndicat du Chanvre de Nouvelle-Calédonie met donc en perspective la culture du chanvre par rapport à ces deux espèces et
        s’appuie sur <strong>le reclassement du chanvre par l’ONU comme un stupéfiant ayant un usage médical</strong> (2020).
      </p>

      <p>
        Si vous voulez suivre l’actualité CBD ou consulter nos différents articles concernant l’univers du chanvre, découvrez{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog`}>le blog Mon Plan CBD</a> !
      </p>

      <figure>
        <Image
          width="800"
          height="600"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/07/vue-aerienne-de-l-ile-des-pins-en-nouvelle-caledonie.webp"
          alt="Vue aérienne de l’île des Pins en Nouvelle-Calédonie"
          loading="lazy"
          sizes="(max-width: 800px) 100vw, 800px"
        />
        <figcaption>Vue aérienne de l’île des Pins en Nouvelle-Calédonie</figcaption>
      </figure>
    </article>
  );
}
