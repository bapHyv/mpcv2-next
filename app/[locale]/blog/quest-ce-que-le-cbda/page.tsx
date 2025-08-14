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
      <h1>Tout savoir sur le CBDA, la forme acide du CBD</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Le CBDA, ou acide cannabidiolique, est un précurseur du CBD présent dans la plante de chanvre. Ce composé se transforme en CBD lors de la
          décarboxylation. Bien que moins étudié que le CBD, le CBDA possède des effets anti-inflammatoires, anti-nauséeux et pourrait jouer un rôle
          dans la prévention du cancer du sein. Les produits combinant CBD et CBDA offrent des effets complémentaires, et Mon Plan CBD propose
          diverses fleurs riches en ces cannabinoïdes.
        </p>
      </details>

      <p>
        Vous devez certainement rencontrer la mention <strong>CBDA</strong> pas très loin de celle de CBD, c’est notamment le cas lorsque l’on vous
        présente la plupart de <a href={`https://www.monplancbd.fr/${locale}/fleurs-cbd/`}>nos fleurs de CBD</a>. Alors dans cet article, on vous
        explique tout sur le CBDA, cette forme acide du cannabinoïde CBD.
      </p>

      <h2>Le CBDA, forme acide du CBD</h2>

      <p>
        L’<dfn>acide cannabidiolique</dfn>, ou <mark>CBDA</mark>, est un cannabinoïde extrait de la plante de chanvre. Plus précisément, le CBDA est
        en fait un <mark>cannabinoïde précurseur du CBD</mark>, c’est la <mark>forme acide du cannabidiol</mark>. On vous explique juste après ce que{" "}
        <em>cannabinoïde précurseur</em> signifie.
      </p>

      <p>
        Au cours de sa croissance, la plante de chanvre produit notamment deux molécules qui nous intéressent ici, <strong>le THCA et le CBDA</strong>{" "}
        - de leurs formes longues <dfn>tétrahydrocannabinolique</dfn> et <dfn>acide cannabidiolique</dfn>. Ensuite, le chanvre et ses fleurs sont
        récoltés puis séchés. Lors de la <mark>décarboxylation</mark>* du chanvre, certaines molécules contenues dans cette plante vont évoluer. Le
        THCA et le CBDA vont alors perdre leur atome de carbone et se transformer respectivement en THC et en CBD, deux fameux cannabinoïdes dont vous
        avez forcément entendu parler. Précisons tout de même que l’intégralité du CBDA ne se transforme pas en CBD. C’est pourquoi vous pouvez
        trouver des <a href={`https://www.monplancbd.fr/${locale}/fleurs-cbd/`}>fleurs de CBD</a> ou des{" "}
        <a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/`}>huiles de CBD</a> contenant à la fois du CBD et du CBDA.
      </p>

      <p>
        Comme le CBD, <mark>le CBDA n’a aucun effet psychoactif</mark> et la consommation de produits à base de CBD et CBDA est légale en France et en
        Europe.
      </p>

      <p>
        <em>
          [*Dans <a href={`https://www.monplancbd.fr/${locale}/blog/le-petit-lexique-du-cbd/`}>notre petit lexique du CBD</a>, vous retrouverez toutes
          les définitions des termes que nous utilisons fréquemment.]
        </em>
      </p>

      <figure>
        <Image
          width="800"
          height="473"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/11/cbda.png"
          alt="cbda"
          loading="lazy"
          sizes="(max-width: 800px) 100vw, 800px"
        />
        <figcaption>Illustration du CBDA</figcaption>
      </figure>

      <h2>Les bienfaits du CBDA</h2>

      <p>
        Le CBDA offre différents bienfaits. De par sa forme acide, ce cannabinoïde procure des{" "}
        <mark>effets différents et plus puissants que le CBD</mark> (sa forme neutre), il agit plus rapidement sur l’organisme humain et peut procurer
        des effets sur le long terme.
      </p>

      <h3>Action anti-inflammatoire du CBDA</h3>

      <p>
        Vous saviez peut-être que le CBD possédait des propriétés anti-inflammatoires, c’est un fait étayé par de nombreuses études scientifiques. Il
        en va de même pour le <mark>CBDA qui réduit les inflammations</mark>.
      </p>

      <p>
        La recherche scientifique concernant le CBD et ses bienfaits dispose de plus de moyens que celle consacrée au CBDA. Pour cette raison, il est
        encore trop tôt pour affirmer qui du CBD ou du CBDA offre une action anti-inflammatoire plus puissante.
      </p>

      <h3>Effet anti-nausée et anti-vomissement du CBDA</h3>

      <p>
        En 2013, <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3596650/">une étude britannique</a> réalisée sur des rats a permis de démontrer
        que le <mark>CBDA a un effet puissant contre la nausée et les vomissements</mark> sur l’organisme des rongeurs.
      </p>

      <h3>Des pistes pour la lutte contre le cancer du sein</h3>

      <p>
        Aujourd’hui, le cancer du sein est l’un des cancers les plus répandus et les plus meurtriers chez les femmes. L’univers de la recherche
        scientifique a commencé à explorer <mark>l’effet du CBD et du CBDA sur le cancer du sein</mark>.
      </p>

      <p>
        Différentes études scientifiques ont montré que, dans certains cas, le CBD et le THC permettaient de ralentir l’expansion voire de tuer des
        cellules cancéreuses. Cependant, <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4009504/">une étude japonaise</a> a montré que{" "}
        <mark>le CBDA empêcherait la mutation du cancer du sein vers une forme plus agressive</mark>.
      </p>
      <p>
        Pour toute question, contactez-nous par e-mail{" "}
        <strong>
          <a href="mailto:contact@monplancbd.fr">contact@monplancbd.fr</a>
        </strong>
        , via <a href="https://www.instagram.com/monplancbd.fr/">Instagram</a>, <a href="https://www.facebook.com/monplancbd/">Facebook</a> ou par
        téléphone <strong>06 65 35 03 78</strong>. On vous répondra !
      </p>
    </article>
  );
}
