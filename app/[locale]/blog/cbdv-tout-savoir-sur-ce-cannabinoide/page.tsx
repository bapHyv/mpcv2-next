import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Tout savoir sur le CBDV</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          Le CBDV, ou cannabidivarine, est un cannabinoïde secondaire issu du chanvre. Bien qu&apos;il soit proche du CBD, il possède des propriétés
          distinctes, notamment une action potentielle sur les récepteurs TRPV1 et TRPV2, liés à la sensation de douleur et à la température. Des
          études indiquent son potentiel dans le traitement de l&apos;épilepsie, des nausées et du syndrome de Rett. La recherche sur le CBDV est
          encore limitée, mais les résultats sont prometteurs.
        </p>
      </details>

      <p>
        Dans un précédent article, nous vous avons présenté{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cbg-thc-cbn-quels-sont-les-differents-cannabinoides/`}>
          différents cannabinoïdes fréquemment rencontrés tels que le CBD, le CBG, le THC ou encore le CBN
        </a>
        . Aujourd’hui, nous nous intéressons à un autre cannabinoïde et nous vous détaillons ses spécificités. Pour tout savoir sur le{" "}
        <mark>CBDV</mark>, c’est ici !
      </p>

      <h2>Rappel : qu’est-ce que les cannabinoïdes ?</h2>
      <p>
        Les <dfn>cannabinoïdes</dfn> sont un groupe de molécules agissant sur certaines cellules de l’organisme humain. Il existe deux catégories :
        les <strong>cannabinoïdes endogènes</strong> et les <strong>cannabinoïdes exogènes</strong>.
      </p>

      <p>
        Le corps humain sécrète ses propres cannabinoïdes, ce sont les <dfn>endocannabinoïdes</dfn> ou cannabinoïdes endogènes. Quant aux
        cannabinoïdes exogènes, il existe deux sous-catégories : les <strong>cannabinoïdes végétaux</strong> (ou <dfn>phytocannabinoïdes</dfn>) et les{" "}
        <strong>cannabinoïdes synthétiques</strong>. Les cannabinoïdes végétaux proviennent des plantes appartenant au genre botanique{" "}
        <em>Cannabis</em>, comme c’est le cas du chanvre. Les cannabinoïdes synthétiques sont eux élaborés en laboratoire.
      </p>

      <p>
        Ici, ce sont les phytocannabinoïdes extraits du chanvre qui nous intéressent. Découvrez aujourd’hui ce qu’est le <mark>CBDV</mark>, son
        fonctionnement et ses bienfaits sur notre organisme.
      </p>

      <figure>
        <Image
          width="768"
          height="530"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/11/cannabidivarine-768x530.png"
          alt="cannabidivarine CBDV"
          loading="lazy"
        />
        <figcaption>Représentation moléculaire du CBDV</figcaption>
      </figure>

      <h2>Le CBDV, jumeau du CBD ?</h2>

      <h3>Présentation du CBDV</h3>
      <p>
        Le <mark>CBDV</mark>, de son nom complet <dfn>cannabidivarine</dfn>, est l’un des 100 cannabinoïdes produits par les plantes issues du genre{" "}
        <em>Cannabis</em>. Le CBDV est un cannabinoïde secondaire que l’on trouve généralement en moins grande quantité que le CBD. Cependant,{" "}
        <strong>plus la variété de la plante est pauvre en THC, plus la concentration en CBDV pourra être élevée</strong>. C’est donc le cas pour la
        plante de chanvre dont sont extraites les fleurs de CBD.
      </p>

      <p>
        Les molécules de <strong>CBD et CBDV présentent deux structures chimiques similaires</strong>. Toutefois, la structure du CBD contient 5
        atomes de carbone quand celle du CBDV en contient 4. Ces deux cannabinoïdes agissent globalement de la même manière sur le corps humain. Comme
        le cannabidiol, <strong>le cannabidivarine n’engendre aucun effet psychoactif</strong>. Toutefois, bien que le CBD et le CBDV présentent de
        nombreuses similitudes, ils offrent tous deux des propriétés et des effets distincts.
      </p>

      <h3>Fonctionnement du CBDV</h3>
      <p>
        Comme le CBD, <strong>le CBDV agit sur l’organisme humain grâce au système endocannabinoïde</strong>*. Il semble que le cannabidivarine ait
        une action de désensibilisation sur les <strong>récepteurs TRPV1 et TRPV2</strong>. Ces récepteurs ont un rôle primordial dans la{" "}
        <strong>sensation de douleur</strong> et dans la <strong>perception de la température</strong>.
      </p>

      <p>
        <em>
          [*Pour tout savoir sur le système endocannabinoïde, consultez notre article à ce sujet{" "}
          <a href="https://www.monplancbd.fr/">en cliquant ici</a>.]
        </em>
      </p>

      <h3>Utilisations et bienfaits du CBDV dans l’univers médical</h3>

      <h4>CBDV, l’espoir pour le traitement de l’épilepsie</h4>
      <p>
        <a href="https://pubmed.ncbi.nlm.nih.gov/23902406/">Une étude britannique réalisée en 2013</a> sur des rats et des souris a montré que le CBDV
        possédait une action anticonvulsivante. En 2014, <a href="https://pubmed.ncbi.nlm.nih.gov/25029033/">une autre étude</a> a précisé que cette
        action bénéfique du CBDV se déroulait via les récepteurs TRPV.
      </p>

      <h4>Traiter les nausées grâce au CBDV ?</h4>
      <p>
        En 2013, <a href="https://pubmed.ncbi.nlm.nih.gov/23902479/">une étude britannique</a> a étudié les propriétés antiémétiques du CBDV.
        L&apos;étude a démontré que <strong>le CBDV réduisait les marqueurs associés aux maux d’estomac</strong> chez des rats.
      </p>

      <h4>Le CBDV pourrait soulager le syndrome de Rett</h4>
      <p>
        Le syndrome de Rett est une maladie rare qui altère le développement du système nerveux et entraîne une déficience intellectuelle sévère.{" "}
        <a href="https://pubmed.ncbi.nlm.nih.gov/30056123/">Une étude de 2014</a> a montré qu’après 14 jours de traitement au CBDV, les souris cobayes
        présentant ce syndrome avaient une <strong>amélioration de leur état de santé</strong>, avec un{" "}
        <strong>ralentissement de l’atrophie cérébrale</strong>.
      </p>

      <p>
        <em>Les recherches sur le CBDV sont encore limitées, mais les premiers résultats sont encourageants.</em>
      </p>

      <p>
        Si vous souhaitez profiter des bienfaits du CBDV, nous vous invitons à découvrir la Valentina, une fleur à la parfaite concentration en CBD et
        CBDV. Ça se passe sur <a href="https://www.monplancbd.fr/">notre e-shop</a> !
      </p>
    </article>
  );
}
