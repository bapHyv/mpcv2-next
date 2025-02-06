import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Les Méthodes d&apos;Analyse des Cannabinoïdes</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Les cannabinoïdes, présents dans le chanvre, nécessitent des analyses précises pour assurer leur conformité et leur qualité. Cet article
          explore les différentes méthodes d&apos;analyse, notamment la <mark>chromatographie à phase liquide à haute performance (CLHP)</mark>, la{" "}
          <mark>chromatographie par partage centrifuge (CPC)</mark> et d&apos;autres techniques moins courantes. Ces analyses permettent de quantifier
          et qualifier les cannabinoïdes contenus dans les produits à base de CBD.
        </p>
      </details>

      <p>
        Comment connaissons-nous les cannabinoïdes contenus dans nos produits au CBD ainsi que leurs taux respectifs ? Tous sont soumis à des{" "}
        <mark>analyses de cannabinoïdes régulières</mark> permettant de nous assurer de leurs spécificités et de leur bonne conformité. Dans cet
        article, nous vous présentons les principales méthodes d’analyse des cannabinoïdes.
      </p>

      <h2>Rappel : qu’est-ce que les cannabinoïdes ?</h2>
      <p>
        Les <dfn>cannabinoïdes</dfn> sont un groupe de molécules agissant sur le système nerveux de notre organisme. Ces molécules activent les
        récepteurs de notre <dfn>système endocannabinoïde</dfn>. Il existe deux grandes catégories de cannabinoïdes :
      </p>
      <ul>
        <li>
          Les <mark>cannabinoïdes endogènes</mark>, sécrétés naturellement par notre corps.
        </li>
        <li>
          Les <mark>cannabinoïdes exogènes</mark>, qui peuvent être des <mark>phytocannabinoïdes</mark> (issus du chanvre) ou des cannabinoïdes
          synthétiques.
        </li>
      </ul>
      <p>
        Parmi les cannabinoïdes végétaux, on retrouve le <mark>THC, CBD, CBG et CBN</mark>. Chaque cannabinoïde possède des{" "}
        <mark>propriétés différentes</mark>. Par exemple, le THC a des effets psychoactifs et analgésiques, tandis que le CBD possède des propriétés
        antipsychotiques, anxiolytiques et antidépressives.
      </p>

      <p>
        <em>
          [Pour en savoir plus sur les cannabinoïdes, nous vous invitons à consulter notre article dédié{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cbg-thc-cbn-quels-sont-les-differents-cannabinoides/`}>en cliquant juste ici</a>.]
        </em>
      </p>

      <h2>Différentes méthodes d’analyse des cannabinoïdes</h2>
      <p>
        Avant toute analyse, il est nécessaire d’extraire les cannabinoïdes contenus dans la plante de chanvre. Une fois cette extraction réalisée,
        ils peuvent être étudiés. <mark>L’analyse des cannabinoïdes permet de les quantifier et de les qualifier</mark>. En France, les vendeurs de
        CBD doivent posséder les analyses de leurs produits et les rendre accessibles aux consommateurs.
      </p>

      <h3>Chromatographie à phase liquide à haute performance</h3>
      <p>
        La <dfn>chromatographie à phase liquide à haute performance</dfn> (CLHP), aussi connue sous l’acronyme anglais <em>HPLC</em>, est la méthode
        la plus utilisée depuis les années 1990. Elle est considérée comme <mark>la plus précise</mark> et permet de{" "}
        <mark>détecter d’éventuels résidus de solvants</mark>. Cette méthode assure donc une sécurité optimale pour le consommateur.
      </p>
      <p>
        Grâce à la CLHP, il est possible de <mark>quantifier précisément les phytocannabinoïdes et les terpènes</mark> présents dans un échantillon de
        chanvre. Ces données sont essentielles puisqu’elles permettent de déterminer les effets potentiels des produits analysés.
      </p>

      <p>
        <em>
          [Si certains termes vous semblent complexes, consultez{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/le-petit-lexique-du-cbd/`}>notre petit lexique du CBD</a>.]
        </em>
      </p>

      <h3>Chromatographie par partage centrifuge</h3>
      <p>
        La <dfn>chromatographie par partage centrifuge</dfn> (CPC) est une autre méthode d’analyse des cannabinoïdes. À l’origine, cette technique
        servait à <mark>extraire et purifier le chanvre</mark>. Bien que moins répandue que la CLHP, son usage est en progression. Elle est
        particulièrement appréciée pour sa <mark>rapidité</mark> (environ 30 minutes) et son coût inférieur.
      </p>

      <p>
        D’autres méthodes existent, comme la chromatographie sur couche mince (CCM), la chromatographie en phase supercritique (SFC) ou encore la
        chromatographie en phase gazeuse (CPG). Moins courantes, elles feront l’objet d’un futur article.
      </p>

      <p>
        Le CBD vous intéresse ? Découvrez notre e-shop <a href="https://www.monplancbd.fr/">en cliquant ici</a>. Vous y trouverez les analyses
        respectives de tous nos produits. Pour toute question, contactez-nous via <a href="https://www.monplancbd.fr/contact/">notre formulaire</a>,
        sur notre page{" "}
        <a href="https://www.facebook.com/monplancbd" target="_blank" rel="nofollow noopener">
          Facebook
        </a>{" "}
        ou{" "}
        <a href="https://www.instagram.com/monplancbd.fr/" target="_blank" rel="nofollow noopener">
          Instagram
        </a>{" "}
        !
      </p>
    </article>
  );
}
