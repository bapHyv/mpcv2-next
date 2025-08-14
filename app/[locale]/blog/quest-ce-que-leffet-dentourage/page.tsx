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
      <h1>Qu’est-ce-que l’effet d’entourage ?</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          L&apos;effet d&apos;entourage est un concept qui explique que les différents composés du chanvre (cannabinoïdes, terpènes et flavonoïdes)
          agissent en synergie pour améliorer leurs effets respectifs. Cette interaction permet d&apos;optimiser les bienfaits du CBD et d&apos;autres
          composants en comparaison à leur action isolée. Cet article explore les différents composants impliqués, leurs interactions, et présente des
          exemples concrets de l&apos;effet d&apos;entourage, tout en mettant en avant certaines limites liées au manque de recherches approfondies.
        </p>
      </details>

      <p>
        Dans cet article, nous vous expliquons ce concept fréquemment évoqué dans les articles traitant du cannabidiol. Nous vous expliquons le
        fonctionnement de l’effet d’entourage qui prouve que le CBD n’est pas le seul composé d’intérêt dans le chanvre !
      </p>

      <h2>Définition de l’effet d’entourage</h2>
      <p>
        Lorsque l’on parle de <dfn>CBD</dfn>, l’effet d’entourage est un mécanisme défini comme une{" "}
        <mark>action en synergie de l’ensemble des composants présents dans la plante de chanvre</mark>. L’idée est qu’en fonctionnant simultanément,
        tous les composés chimiques du chanvre sont plus efficaces que s’ils sont isolés les uns des autres.
      </p>

      <h2>Les composants au cœur de l’effet d’entourage</h2>
      <p>L’effet d’entourage est rendu possible grâce à l’interaction de trois types de composés chimiques contenus dans la plante de chanvre.</p>

      <h3>Les cannabinoïdes</h3>
      <p>
        Les <dfn>cannabinoïdes</dfn> présents dans le chanvre sont les composés chimiques les plus connus. CBD, THC, CBG, CBN… Ces cannabinoïdes
        agissent sur{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-et-systeme-endocannabinoide-comment-ca-marche/`}>notre système endocannabinoïde</a>.
      </p>
      <p>Ils activent les récepteurs endocannabinoïdes de notre organisme et c’est par ce système que les effets du CBD se font sentir.</p>
      <p>
        <em>
          [Pour en savoir plus sur les différents cannabinoïdes, consultez{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cbg-thc-cbn-quels-sont-les-differents-cannabinoides/`}>
            notre article dédié au sujet
          </a>
          ]
        </em>
      </p>

      <figure>
        <Image
          width="1024"
          height="540"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/08/Molecule_CBD-1024x540.jpg"
          alt="cbd entourage molecule"
          loading="lazy"
        />
        <figcaption>Cannabidiol</figcaption>
      </figure>

      <h3>Les terpènes</h3>

      <figure>
        <Image
          width="213"
          height="300"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/03/linalool-213x300.jpg"
          alt="linalool"
          loading="lazy"
        />
        <figcaption>Linalool</figcaption>
      </figure>

      <p>
        Les <dfn>terpènes</dfn> sont les deuxièmes composés les plus présents dans le chanvre. Ils jouent donc un rôle important dans l’effet
        d’entourage. En effet, <a href={`https://www.monplancbd.fr/${locale}/blog/terpenes-et-cbd-comment-ca-fonctionne/`}>les terpènes</a> sont des
        composés aux propriétés odoriférantes. Ils <mark>influent sur le goût et sur l’odeur du chanvre</mark>, donc sur les arômes du CBD consommé.
      </p>

      <h3>Les flavonoïdes</h3>
      <p>
        Les <dfn>flavonoïdes</dfn> font partie de la famille des polyphénols. Ce sont des pigments végétaux responsables de la coloration des fleurs
        de chanvre. Les flavonoïdes présentent différents bienfaits, notamment des propriétés anti-inflammatoires et antioxydantes.
      </p>

      <figure>
        <Image width="200" height="156" src="https://www.monplancbd.fr/wp-content/uploads/2021/03/Flavone.png" alt="Flavone" loading="lazy" />
        <figcaption>Flavonoïde</figcaption>
      </figure>

      <h2>Les bénéfices de l’effet d’entourage</h2>
      <p>
        L’effet d’entourage est donc créé grâce à l’interaction des cannabinoïdes, aux terpènes et aux flavonoïdes. Ces composés chimiques
        fonctionnent comme un ensemble et permettent d’offrir des <mark>effets bénéfiques lors de la consommation de chanvre</mark>. Isolé, le CBD ne
        semble alors pas bénéficier de cet effet d’entourage. Pour profiter de ce mécanisme spécifique, il est donc recommandé d’opter pour du{" "}
        <strong>CBD à spectre complet</strong> qui contient tous les composés du chanvre.
      </p>
      <p>
        (Si le CBD à spectre complet vous intéresse, nous vous invitons à découvrir{" "}
        <a href="https://www.monplancbd.fr/huiles-cbd/">nos huiles de CBD full spectrum</a>)
      </p>

      <h3>Deux exemples concrets de l’effet d’entourage</h3>

      <h4>CBD et THC</h4>
      <p>
        L’effet d’entourage peut s’illustrer grâce à l’<mark>interaction du CBD et du THC</mark>, un exemple bien connu des consommateurs de cannabis.
      </p>
      <p>
        S’il est consommé pur, le THC contenu dans le cannabis va exprimer l’intégralité de ses effets psychoactifs. Cela peut amener le consommateur
        à des phases d’anxiété ou de paranoïa. Or, si le THC et le CBD sont associés, il est constaté que{" "}
        <mark>le CBD atténue les propriétés psychoactives du THC</mark> afin de ne pas dépasser une limite menant aux effets indésirables cités
        précédemment.
      </p>

      <h4>THC et Pinène</h4>
      <p>
        Une <a href="https://bpspubs.onlinelibrary.wiley.com/doi/full/10.1111/j.1476-5381.2011.01238.x">étude de 2011</a> de Ethan B. Russo illustre
        l’effet d’entourage. Celle-ci présente l’<mark>interaction du THC avec le pinène</mark>, un terpène particulièrement répandu.
      </p>
      <p>
        Il est démontré que le pinène préserve l’acétylcholine, une molécule de notre organisme permettant la formation de la mémoire. Or, un des
        effets constatés de la consommation de cannabis contenant du THC est la perte de mémoire. L’association du pinène avec le THC permettrait donc
        d’<mark>éviter la perte de mémoire lors de la consommation de THC</mark>.
      </p>

      <h2>Quelles limites à l’effet d’entourage ?</h2>
      <p>
        Malgré les résultats des premières études et les constats multiples des consommateurs de chanvre et experts en la matière, nous devons
        apporter des réserves quant à l’effet d’entourage. À ce jour, ce mécanisme est encore considéré comme une théorie, non comme une vérité
        scientifique absolue.
      </p>
      <p>
        Cela s’explique par des études aux résultats contradictoires mais aussi, et surtout, par le{" "}
        <mark>manque de fonds attribués à la recherche autour du chanvre</mark> et de son utilisation médicale en France.
      </p>
    </article>
  );
}
