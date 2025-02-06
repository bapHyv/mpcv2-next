import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>La Légalité du CBD en France et en Europe</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          La consommation et la vente de <mark>CBD</mark> en France sont légales sous certaines conditions. La Cour de justice de l&apos;Union
          Européenne a clarifié que le <mark>CBD</mark> n&apos;est pas un stupéfiant. Cependant, les produits doivent contenir moins de 0,2% de{" "}
          <dfn>THC</dfn> et ne peuvent pas revendiquer d&apos;allégations thérapeutiques. En Europe, bien que la majorité des pays autorisent le{" "}
          <mark>CBD</mark>, certains, comme la Lituanie et la Slovénie, interdisent totalement son usage. D&apos;autres pays imposent une restriction,
          ne l&apos;autorisant que pour un usage médical.
        </p>
      </details>

      <h2>Vente et consommation de CBD en France</h2>

      <h3>Ce que dit la loi française sur le CBD</h3>

      <figure>
        <Image
          width="884"
          height="1024"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/04/Drapeau_francais-884x1024.png"
          alt="consommation légale"
          loading="lazy"
          sizes="(max-width: 884px) 100vw, 884px"
        />
        <figcaption>Drapeau français illustrant la législation sur le CBD en France.</figcaption>
      </figure>

      <p>
        En France, un article de l&apos;arrêté du 22 août 1990 limitait l&apos;utilisation du chanvre aux fibres et graines, interdisant ainsi la
        commercialisation des produits à base de <mark>CBD</mark>. Toutefois, depuis le 19 novembre 2020, un arrêt de la Cour de justice de
        l&apos;Union Européenne (CJUE) a établi que le <mark>CBD</mark> n&apos;était pas un stupéfiant, rendant sa vente légale.
      </p>

      <p>
        <em>
          [Pour en savoir plus sur cette affaire, consultez{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cannabis-que-dit-lactualite/`}>cet article</a>.]
        </em>
      </p>

      <h3>Des dispositions législatives à respecter</h3>

      <p>
        Si la consommation de <mark>CBD</mark> est autorisée, elle doit respecter certaines règles :
      </p>
      <ul>
        <li>
          Les <mark>produits à base de CBD</mark> doivent contenir moins de <mark>0,2% de THC</mark>, le <dfn>THC</dfn> étant une substance
          psychotrope interdite.
        </li>
        <li>
          Le <mark>CBD</mark> ne peut pas être présenté comme un médicament et ne doit pas remplacer un traitement médical sans autorisation.
        </li>
        <li>
          La promotion du <mark>CBD</mark> ne doit pas entretenir la confusion avec le cannabis, sous peine d&apos;infraction pénale.
        </li>
      </ul>

      <h2>En Europe</h2>

      <h3>Dans la plupart des cas, le CBD est légal en Europe</h3>

      <figure>
        <Image
          width="1024"
          height="768"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/04/european_flag.jpg"
          alt="European Flag"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <figcaption>Drapeau de l&apos;Union Européenne.</figcaption>
      </figure>

      <p>
        La CJUE a statué que la vente et la consommation de <mark>CBD</mark> sont légales dans l&apos;UE, et une harmonisation des réglementations est
        en cours entre les États membres.
      </p>

      <h3>Les états d’Europe où le CBD est illégal</h3>

      <h4>Lituanie et Slovénie, pays les plus fermes</h4>
      <p>
        Dans ces pays, l&apos;exploitation, la vente et la consommation de <mark>CBD</mark> sous toutes ses formes sont strictement interdites.
      </p>

      <h4>L’exception médicale pour certains pays européens</h4>
      <p>
        En <mark>Bulgarie, Chypre, Croatie, Finlande, Slovaquie et Suède</mark>, l&apos;usage du <mark>CBD</mark> est interdit sauf pour des raisons
        médicales.
      </p>

      <p>
        Le <mark>CBD</mark> continue de gagner du terrain dans le domaine de la légalité en Europe. Pour en savoir plus, consultez{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/`}>notre blog</a>. Découvrez aussi nos{" "}
        <a href="https://www.monplancbd.fr/">produits à base de CBD</a>.
      </p>
    </article>
  );
}
