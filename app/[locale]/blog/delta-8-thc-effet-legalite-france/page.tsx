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
      <h1>Tout savoir sur le delta-8-THC : effets, légalité et potentiels bienfaits</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Le <dfn>delta-8-THC</dfn> est une molécule dérivée du cannabis qui présente des effets psychotropes plus légers que le{" "}
          <dfn>delta-9-THC</dfn>. Bien que certaines études suggèrent des propriétés thérapeutiques, il reste interdit en France, où tous les{" "}
          <mark>THC</mark> sont classés comme stupéfiants. Cet article explore ses effets, sa fabrication et son cadre légal.
        </p>
      </details>

      <p>
        Il est de plus en plus courant de rencontrer des produits contenant du <mark>delta-8-THC</mark>. Cette molécule est-elle sans risque ?{" "}
        <mark>Que dit la loi en France sur la consommation de delta-8</mark> ou de delta-9 ? Dans cet article, nous vous présentons ce{" "}
        <dfn>cannabinoïde</dfn> naturellement présent dans le chanvre, <mark>ses effets sur l’organisme</mark> et{" "}
        <mark>ses potentielles propriétés thérapeutiques</mark>.
      </p>

      <h2>Qu’est-ce que le delta-8-THC ?</h2>
      <p>
        Le <dfn>delta-8-THC</dfn>, également connu sous le nom de <dfn>delta-8-tétrahydrocannabinol</dfn>, est un composé chimique dérivé du cannabis
        qui suscite un intérêt croissant en France. Contrairement au <dfn>delta-9-THC</dfn>, il présente des propriétés légèrement différentes,
        offrant un effet psychotrope plus doux. Cette variation chimique suscite un débat constant sur sa légalité en France, où les lois sur les
        produits du cannabis évoluent.
      </p>
      <p>
        L&apos;utilisation du <dfn>delta-8-THC</dfn> est souvent comparée à celle du <dfn>CBD</dfn>, un autre composé du cannabis. Le <dfn>CBD</dfn>,
        ou <dfn>cannabidiol</dfn>, est non psychotrope et souvent utilisé pour ses propriétés relaxantes et thérapeutiques. Les deux composés, le{" "}
        <dfn>CBD</dfn> et le <dfn>delta-8-THC</dfn>, proviennent de la même plante, mais leurs effets diffèrent.
      </p>
      <p>
        La réglementation entourant le <dfn>delta-8-THC</dfn> en France évolue constamment. Il est important de se tenir informé des dernières lois et
        réglementations à ce sujet.
      </p>
      <p>
        Lorsque vous entendez parler du <mark>THC</mark>, il est généralement question du <dfn>delta-9-tétrahydrocannabinol</dfn> (
        <dfn>delta-9-THC</dfn>), un cannabinoïde connu pour ses effets psychotropes. Le <dfn>delta-8-THC</dfn> est en fait un{" "}
        <mark>autre type de THC</mark> présentant quelques différences par rapport à son cousin plus connu. Comme tous les cannabinoïdes, le{" "}
        <dfn>delta-8</dfn> agit via notre{" "}
        <a href={`https://www.monplancbd.fr/${locale}/cbd-et-systeme-endocannabinoide/`}>système endocannabinoïde</a>.
      </p>
      <p>
        Comme le <dfn>delta-9-THC</dfn>, le <dfn>delta-8-THC</dfn> est un <mark>cannabinoïde psychoactif et psychotrope</mark> extrait des plantes du
        genre <dfn>Cannabis</dfn>. Cependant, le <dfn>delta-8</dfn> est présent en infime quantité. La plupart du temps, il est donc synthétisé et
        ajouté aux fleurs de chanvre ou vendu sous forme de distillat.
      </p>

      <h2>Quels sont les effets du delta-8-THC ?</h2>
      <p>
        Le <dfn>delta-8-THC</dfn> procure des effets similaires au <dfn>delta-9-THC</dfn>, mais plus modérés. Les consommateurs rapportent un{" "}
        <mark>sentiment d’euphorie</mark>, une <mark>sensation de détente</mark> et un <mark>soulagement de certaines douleurs</mark>. L’effet de{" "}
        <i>high</i> du <dfn>delta-8-THC</dfn> est plus faible que celui du <dfn>delta-9-THC</dfn>.
      </p>
      <p>
        Les recherches sur le <dfn>delta-8-THC</dfn> restent limitées. Cependant, certaines études lui attribuent des{" "}
        <mark>propriétés thérapeutiques</mark> :
      </p>
      <ul>
        <li>
          <mark>Inhibition de la croissance de tumeurs</mark> :{" "}
          <a href="https://academic.oup.com/jnci/article-abstract/55/3/597/912322?redirectedFrom=fulltext">Une étude de 1975</a> a observé une action
          inhibitrice du <dfn>delta-8-THC</dfn> sur les tumeurs chez les rongeurs.
        </li>
        <li>
          <mark>Accompagnement de traitements en oncologie</mark> : En 1995, <a href="https://pubmed.ncbi.nlm.nih.gov/7776837/">une étude</a> a
          démontré ses propriétés antiémétiques chez des enfants atteints de cancer.
        </li>
        <li>
          <mark>Stimulation de l’appétit</mark> : <a href="https://pubmed.ncbi.nlm.nih.gov/15099912/">Une étude de 2004</a> a montré que le{" "}
          <dfn>delta-8-THC</dfn> stimule davantage l’appétit que le <dfn>delta-9-THC</dfn>.
        </li>
      </ul>
      <p>
        Le manque d’études approfondies limite néanmoins notre compréhension des effets thérapeutiques et des risques liés au <dfn>delta-8-THC</dfn>.
      </p>

      <h2>Le delta-8-THC est-il légal en France ?</h2>
      <p>
        En France, <mark>la vente et la consommation de tous les THC sont interdites</mark> (delta-8, delta-9, delta-10…). Les{" "}
        <dfn>tétrahydrocannabinols</dfn> figurent sur la liste des stupéfiants. Face au manque de recherches, le <dfn>delta-8-THC</dfn> est donc
        interdit.
      </p>
      <p>
        Seul <mark>un taux de 0,3% de THC est autorisé</mark> dans les <a href={`https://www.monplancbd.fr/${locale}/fleurs-cbd/`}>fleurs de CBD</a>{" "}
        et les produits à base de chanvre comme l’<a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/`}>huile de CBD</a>.
      </p>

      <figure>
        <Image
          width="860"
          height="574"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/07/Delta-8-1.webp"
          alt="Delta-8-THC"
          loading="lazy"
          sizes="(max-width: 860px) 100vw, 860px"
        />
        <figcaption>Le delta-8-THC est un cannabinoïde issu du chanvre, aux effets plus légers que le delta-9-THC.</figcaption>
      </figure>
    </article>
  );
}
