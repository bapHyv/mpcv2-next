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
      <h1>Vaporisation du CBD et Aromathérapie : Le Rôle des Terpènes</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          Les terpènes sont des composés aromatiques présents dans de nombreuses plantes, dont le chanvre. Ils influencent l&apos;odeur, le goût et
          les bienfaits du CBD. L&apos;aromathérapie repose sur l&apos;utilisation des huiles essentielles riches en terpènes pour le bien-être. La
          vaporisation permet de libérer ces terpènes sans combustion, optimisant ainsi leurs effets. Différentes températures permettent
          d&apos;exploiter pleinement les bienfaits des terpènes présents dans le chanvre.
        </p>
      </details>

      <p>
        Nous vous avions précédemment expliqué{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/terpenes-et-cbd-comment-ca-fonctionne/`}>
          ce que sont les terpènes et comment ceux-ci fonctionnent
        </a>
        . Aujourd’hui, nous développons le sujet de la vaporisation du CBD et faisons le lien entre les terpènes et l’aromathérapie. Vous allez voir,
        c’est un sujet absolument passionnant !
      </p>

      <h2>Rappel : que sont les terpènes ?</h2>
      <p>Si vous n’avez pas encore lu notre article sur les terpènes, voici un petit rappel !</p>
      <p>
        <strong>Les terpènes</strong> appartiennent à la catégorie des hydrocarbures. Ce sont des <dfn>composés organiques</dfn> produits
        naturellement par un grand nombre de plantes. Les terpènes issus de végétaux ont des <mark>propriétés odoriférantes</mark>, influençant
        l’odeur et le goût. Il existe plus de 20 000 terpènes, chacun possédant des arômes et des bienfaits spécifiques.
      </p>
      <p>
        Comme toutes les plantes, <strong>le chanvre possède donc une multitude de terpènes</strong>. Grâce à ces terpènes,{" "}
        <strong>le CBD que vous consommez peut vous offrir plein de saveurs et de bienfaits</strong>.
      </p>

      <h2>Quel lien entre terpènes et aromathérapie ?</h2>
      <h3>Principe de l’aromathérapie</h3>
      <p>
        <strong>L’aromathérapie repose sur l’utilisation des composés aromatiques des plantes</strong> pour le bien-être, la prévention et le
        soulagement de certains troubles. Ces composés, sous forme d’huiles essentielles, sont riches en terpènes. Concernant le chanvre,{" "}
        <mark>les terpènes jouent un rôle clé dans l&apos;aromathérapie</mark>.
      </p>

      <h3>La vaporisation pour profiter des bienfaits des terpènes</h3>
      <p>
        Comme pour de nombreuses plantes, vous pouvez <strong>vaporiser le chanvre</strong> afin de bénéficier de ses nombreux effets. Contrairement à
        la combustion, la vaporisation <mark>évite la production de substances toxiques</mark> et préserve les principes actifs.
      </p>
      <p>
        Lors de la vaporisation, le chanvre que vous placez dans <a href={`https://www.monplancbd.fr/${locale}/vaporisateur/`}>votre vaporisateur</a>{" "}
        subit un <strong>chauffage doux</strong>. Un vaporisateur ne devrait pas dépasser le <mark>point de combustion</mark> du chanvre (230°C).
      </p>
      <p>
        La <a href={`https://www.monplancbd.fr/${locale}/vaporisateur/`}>vaporisation</a> du CBD permet d’obtenir une expérience gustative plus pure,
        mettant en valeur les terpènes.
      </p>

      <ul>
        <li>
          <strong>Plus votre chanvre sera sec, meilleure sera sa vaporisation</strong>. Ce sont les principes actifs qui sont vaporisés, pas l’eau
          contenue dans le chanvre !
          <ul>
            <li>
              <strong>Plus votre chanvre contiendra des huiles essentielles (donc des terpènes), plus la vapeur obtenue sera dense</strong>.
              Cependant, une faible quantité de vapeur ne signifie pas nécessairement une absence d’extraction des terpènes.
            </li>
          </ul>
        </li>
      </ul>

      <h2>Les températures de vaporisation pour les différents terpènes</h2>
      <h3>Trouver la bonne température de vaporisation</h3>
      <p>
        Une <mark>température trop basse</mark> empêche la libération des terpènes et de leurs bienfaits. À l’inverse, une{" "}
        <mark>température trop élevée</mark> (au-delà de 230°C) détruit ces composés.
      </p>
      <p>
        Si aucune température parfaite n’existe pour la vaporisation du CBD, sachez que les terpènes commencent à se libérer à partir de{" "}
        <mark>119°C</mark>.
      </p>

      <h3>Quelles températures de vaporisation pour quels terpènes ?</h3>
      <p>
        Voici les <mark>points d’ébullition</mark> des terpènes présents en quantité significative dans le chanvre :
      </p>

      <ul>
        <li>
          <strong>119°C</strong> : <dfn>Bêta-caryophyllène</dfn> → arôme épicé, propriétés relaxantes et anti-inflammatoires.
        </li>
        <li>
          <strong>156°C</strong> : <dfn>Alpha-pinène</dfn> → goût de pin et romarin, effets bronchodilatateurs, anti-inflammatoires et anti-stress.
        </li>
        <li>
          <strong>166°C - 168°C</strong> : <dfn>Myrcène</dfn> → arôme terreux, musqué et fruité.
        </li>
        <li>
          <strong>176°C</strong> : <dfn>Cinéole (Eucalyptol)</dfn> → saveur d’eucalyptus, propriétés antivirales, anti-douleurs, antifongiques et
          anti-inflammatoires.
        </li>
        <li>
          <strong>177°C</strong> : <dfn>Limonène</dfn> → saveur d’agrumes, effets antidépresseurs.
        </li>
        <li>
          <strong>198°C</strong> : <dfn>Linalol</dfn> → arôme floral, boisé et épicé, propriétés sédatives et immunostimulantes.
        </li>
        <li>
          <strong>217°C - 218°C</strong> : <dfn>Alpha-terpinéol</dfn> → goût de lilas, effets sédatifs et antioxydants.
        </li>
        <li>
          <strong>224°C</strong> : <dfn>Pulégone</dfn> → saveur menthe poivrée, effet sédatif.
        </li>
      </ul>

      <p>
        En vaporisant progressivement votre chanvre à différentes températures, vous pouvez <mark>explorer et maximiser les bienfaits</mark> des
        terpènes. Vous serez surpris par les possibilités qu’offre le chanvre !
      </p>

      <p>
        Si vous recherchez des <strong>fleurs de CBD</strong> ou des <strong>vaporisateurs de qualité</strong>, rendez-vous sur{" "}
        <a href={`https://www.monplancbd.fr/${locale}`}>notre e-shop</a> !
      </p>

      <figure>
        <Image
          width="150"
          height="150"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/07/MG_3543-1-150x150.jpg"
          alt="terpènes CBD fleur"
          loading="lazy"
        />
        <figcaption>Fleur de chanvre riche en terpènes</figcaption>
      </figure>
    </article>
  );
}
