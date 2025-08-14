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
      <h1>Les Trichomes du Chanvre et leur Importance dans les Produits au CBD</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Les trichomes sont des glandes résineuses présentes sur les feuilles et les fleurs du chanvre. Ils jouent un rôle crucial dans la production
          de cannabinoïdes, terpènes et flavonoïdes. Il existe trois types de trichomes glandulaires : bulbeux, à capitule sessile et à capitule
          tigée. Leur taille influence la concentration en composés actifs. En plus de protéger la plante, ils servent d’indicateurs de récolte grâce
          à leur changement de couleur. Enfin, les trichomes sont essentiels pour les produits au CBD, notamment dans le kief et le hash.
        </p>
      </details>

      <p>
        Si vous lisez nos articles, vous avez certainement déjà croisé le terme <dfn>trichome</dfn>. Mais que sont ces fameux trichomes ? Quelle est
        leur importance lorsqu’il s’agit de produits au CBD ? Dans cet article, nous vous présentons le chanvre, ces trichomes et le rôle qu’ils
        jouent.
      </p>

      <h2>Que sont les trichomes ?</h2>
      <p>
        Le mot <dfn>trichome</dfn> vient de <em>trikhoma</em> qui signifie “croissance de poil” en grec ancien. Ce n’est donc pas surprenant si les
        trichomes ressemblent à de minuscules poils cristallins qui habillent les feuilles et les bourgeons de la plante de chanvre. Ces trichomes
        sont en fait les <strong>glandes résineuses de la plante</strong>.
      </p>
      <p>Les trichomes ne se trouvent pas exclusivement dans le chanvre, bien d’autres plantes en sont dotées.</p>

      <h2>Les différents types de trichomes</h2>
      <p>
        Il existe deux grandes catégories de trichomes : les <strong>trichomes glandulaires</strong> et les{" "}
        <strong>trichomes non-glandulaires</strong>. Dans cet article éclairant le lien entre les trichomes et le chanvre, nous avons choisi de
        traiter uniquement les trichomes glandulaires. En effet, les trichomes non-glandulaires ne contiennent pas de cannabinoïdes et sont de moindre
        importance lorsqu’il s’agit de comprendre les bienfaits du chanvre et des produits au CBD.
      </p>
      <p>
        Les trichomes glandulaires sont donc caractérisés par leurs glandes contenant des cannabinoïdes, des terpènes et des flavonoïdes. Il existe{" "}
        <strong>3 types de trichomes glandulaires</strong>, ceux-ci se distinguent notamment par leurs différentes tailles.
      </p>

      <h3>Trichomes bulbeux</h3>
      <figure>
        <Image
          width="1024"
          height="414"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/04/Trichome_Closeup_25853749933-1024x414.jpg"
          alt="trichome cbd bulbeux chanvre"
          loading="lazy"
        />
        <figcaption>Trichomes bulbeux visibles au microscope</figcaption>
      </figure>
      <p>
        Les trichomes bulbeux sont les plus petits trichomes contenus dans le chanvre. Avec une largeur de 10 à 15 micromètres, ils sont très
        difficiles à voir à l’œil nu. Les trichomes bulbeux recouvrent toute la surface de la plante.
      </p>

      <h3>Trichomes à capitule sessile</h3>
      <p>
        Les trichomes à capitule sessile sont légèrement plus grands que les trichomes bulbeux. Ils présentent une largeur allant de 20 à 30
        micromètres. Ce type de trichomes dispose d’une petite tige que n’ont pas les trichomes bulbeux.
      </p>

      <h3>Trichomes à capitule tigée</h3>
      <p>
        Avec une largeur allant de 50 à 100 micromètres, les trichomes à capitule tigée sont les plus grands des trichomes glandulaires. Ce sont ceux
        que vous pouvez observer si vous regardez des fleurs de chanvre à l’œil nu. Ces trichomes sont dotés d’une tige relativement large au bout de
        laquelle se trouve leur glande.
      </p>

      <figure>
        <Image
          width="1024"
          height="731"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/04/211147831_501500f2b8_b.jpg"
          alt="trichome cbd"
          loading="lazy"
        />
        <figcaption>Vue rapprochée des trichomes du chanvre</figcaption>
      </figure>

      <h2>Le rôle des trichomes du chanvre</h2>

      <h3>Protection de la plante de chanvre</h3>
      <p>
        Dans le cas du chanvre, les trichomes agissent comme une barrière défensive face aux animaux nuisibles. En effet, ils présentent un goût amer
        et des odeurs qui sont essentiellement liés aux terpènes qu’ils contiennent. Les trichomes vont donc repousser les insectes ou les animaux qui
        pourraient nuire à la plante de chanvre.
      </p>

      <h3>Concentration en composés actifs</h3>
      <p>
        Les trichomes abritent les composés actifs du chanvre. Nous voulons ici parler des <mark>terpènes</mark>, des <mark>flavonoïdes</mark> et des{" "}
        <mark>cannabinoïdes</mark> comme le CBD, le CBG, le CBN, le THC,... Ces composants se forment dans les trichomes dès que la plante de chanvre
        débute sa floraison.
      </p>

      <h3>Indicateurs de récolte</h3>
      <p>
        Lors de leur développement, les trichomes peuvent présenter différentes couleurs allant du blanc au marron en passant par des tons ambrés. Les
        cultivateurs de chanvre se basent notamment sur leur couleur pour savoir à quel moment effectuer la récolte.
      </p>

      <h2>Les trichomes et les produits au CBD</h2>

      <figure>
        <Image
          width="1024"
          height="768"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/04/3488349952_46685cb5ee_b.jpg"
          alt="kief cbd"
          loading="lazy"
        />
        <figcaption>Le kief, concentré de trichomes</figcaption>
      </figure>

      <p>
        Les trichomes jouent un rôle clé dans les produits à base de CBD puisqu’ils concentrent l’essentiel des cannabinoïdes. Pour une expérience
        intense, il est possible d’opter pour le <strong>kief de CBD</strong>, obtenu par tamisage des fleurs de CBD. Plus le maillage est fin, plus
        la concentration en trichomes est élevée.
      </p>
      <p>
        Par extension, on peut également choisir du{" "}
        <a href={`https://www.monplancbd.fr/${locale}/pollen-resines-hash-cbd/`}>
          <strong>hash de CBD</strong>
        </a>
        , issu de la pression du kief.
      </p>
    </article>
  );
}
