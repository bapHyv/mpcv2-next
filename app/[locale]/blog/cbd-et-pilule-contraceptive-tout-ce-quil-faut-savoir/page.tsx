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
      <h1>CBD et Pilule Contraceptive : Ce qu&apos;il Faut Savoir</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Le CBD peut aider à atténuer certains effets secondaires liés à la contraception hormonale, tels que les migraines ou les douleurs.
          Cependant, une interaction existe entre le cannabidiol et les oestrogènes, ce qui pourrait réduire l&apos;efficacité des pilules
          oestroprogestatives. Pour éviter tout impact sur votre contraception, il est recommandé d&apos;espacer la prise de CBD et celle de la pilule
          d&apos;au moins 3 à 4 heures. Si vous êtes une consommatrice régulière de CBD, une pilule progestative pourrait être une alternative plus
          adaptée. Consultez votre médecin pour des conseils personnalisés.
        </p>
      </details>

      <p>
        Vous vous demandez si vous pouvez <strong>consommer du CBD et prendre votre pilule contraceptive</strong> ? Si les bienfaits du cannabidiol
        sont nombreux et permettent notamment de réduire certains effets secondaires de la contraception hormonale, il est important de comprendre
        l’interaction entre les produits issus du chanvre et les oestrogènes. Découvrez{" "}
        <strong>quand et comment prendre votre CBD et votre pilule pour vous assurer une contraception optimale</strong>.
      </p>

      <h2>Pourquoi prendre du CBD quand on prend la pilule ?</h2>
      <p>
        Il est parfois bénéfique de consommer du cannabidiol lorsque l’on prend une pilule contraceptive. En effet, les{" "}
        <strong>produits au CBD</strong> (<a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/`}>huile CBD</a>,{" "}
        <a href={`https://www.monplancbd.fr/${locale}/fleurs-cbd/`}>fleurs de chanvre</a>…) peuvent{" "}
        <strong>aider à lutter contre certains effets secondaires liés à une contraception hormonale</strong>. Chez certaines personnes, la pilule
        contraceptive peut engendrer les effets secondaires suivants :
      </p>

      <ul>
        <li>Migraines</li>
        <li>Accentuation de certaines douleurs : à la poitrine, dans le ventre ou dans le dos</li>
        <li>Baisse de libido…</li>
      </ul>

      <p>
        Ces douleurs parfois causées ou aggravées par la pilule contraceptive peuvent être soulagées grâce au CBD. En effet, en agissant sur notre
        système endocannabinoïde, le cannabidiol peut soulager ces différents maux* et aider au bien-être général.
      </p>

      <p>
        <em>
          [*Pour découvrir plus en détail l’action du CBD sur le système endocannabinoïde, consultez{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-et-systeme-endocannabinoide/`}>notre article à ce sujet</a> !]
        </em>
      </p>

      <figure>
        <Image
          width="1024"
          height="683"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/03/MG_7024-1024x683.jpg"
          alt="cbg lemon 5"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </figure>

      <figure>
        <Image
          width="1024"
          height="683"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/06/pilule.jpg"
          alt="pilule et cbd"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </figure>

      <h2>Quels sont les effets du CBD sur votre contraception hormonale ?</h2>
      <p>
        Alors, peut-on prendre du CBD et la pilule contraceptive en même temps ? Si vous vous posez cette question, sachez que{" "}
        <strong>le cannabidiol pourrait réduire l’efficacité de votre pilule si celle-ci est à base d’oestrogènes</strong>. Si vous prenez une pilule
        contenant uniquement de la progestérone, vous pouvez consommer votre pilule et votre CBD sans contrainte spécifique. On vous explique.
      </p>

      <h3>Fonctionnement de la pilule contraceptive</h3>
      <p>
        Il existe deux types de pilule contraceptive : la pilule oestroprogestative et la pilule progestative. Ces deux moyens de contraception
        libèrent des hormones dans l’organisme. S’ils ont le même objectif - modifier ou bloquer le cycle menstruel afin d’empêcher la procréation -
        ils ne contiennent pas les mêmes hormones et n’impliquent donc pas les mêmes précautions d’usage.
      </p>

      <h4>Pilule combinée</h4>
      <p>
        La pilule oestroprogestative, ou pilule combinée, est composée d’oestrogène et de progestérone. Elle se prend en continu pendant 21 jours puis
        s’arrête pendant 7 jours au cours desquels surviennent des “règles artificielles” (générées par l’arrêt de la pilule). L’ovulation n’a pas
        lieu, la glaire cervicale sécrétée au niveau du col de l’utérus s’épaissit pour ne pas laisser passer les spermatozoïdes et l’endomètre ne
        peut pas accueillir d’ovule fécondé.
      </p>

      <h4>Pilule progestative</h4>
      <p>
        La pilule progestative contient une seule hormone, la progestérone. Les 28 comprimés sont à prendre de manière continue. À chaque fin de
        cycle, il faut recommencer une autre plaquette de 28 pilules sans s’arrêter. La progestérone va donc influer sur le cycle menstruel afin
        d’empêcher les spermatozoïdes de féconder l’ovule.
      </p>

      <h3>Effets du CBD sur la pilule oestroprogestative</h3>
      <p>
        La première étude significative portant sur les <strong>effets du CBD sur la pilule contraceptive</strong> a été menée en 1983 par le Docteur
        Sauer. Ce processus de recherche scientifique a été réalisé sur une population de rats et visait plus précisément à mesurer l’interaction
        entre cannabidiol et oestrogènes. Est donc exclusivement concernée par cette étude la pilule combinée qui contient un oestrogène.
      </p>

      <p>
        Lors de cette étude, les chercheurs ont constaté que{" "}
        <strong>le CBD se liait aux récepteurs d’oestrogènes présents dans le système de reproduction</strong>. Or, l’oestrogène présent dans la
        pilule contraceptive a besoin de se fixer intégralement sur ces récepteurs pour garantir le fonctionnement optimal de la contraception
        hormonale.
      </p>

      <h2>Comment consommer du CBD sans impacter sa contraception hormonale ?</h2>
      <p>
        Une interaction existe entre le cannabidiol et les oestrogènes,{" "}
        <strong>il est tout de même possible de consommer des produits au CBD sans effet sur l’efficacité de la pilule contraceptive</strong>.
      </p>

      <p>
        Pour cela, il faut prendre en considération le laps de temps nécessaire à la dégradation complète de la pilule hormonale par l’organisme. Cela
        représente 3 à 4 heures de temps pour notre organisme.{" "}
        <strong>Il est donc conseillé de ne pas prendre votre CBD et votre pilule en même temps et d’espacer au maximum ces deux prises</strong>. Vous
        pouvez par exemple prendre votre pilule le matin et consommer votre CBD le soir.
      </p>

      <p>
        Et si vous consommez fréquemment du CBD, vous pouvez aussi choisir une pilule progestative. En cas de doute et d’interrogation, c’est votre
        médecin traitant qui sera le plus à même de vous conseiller.
      </p>
    </article>
  );
}
