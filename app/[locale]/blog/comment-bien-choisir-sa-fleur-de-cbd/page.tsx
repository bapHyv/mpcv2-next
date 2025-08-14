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
      <h1>Le monde du CBD : Une alternative naturelle et écologique</h1>

      <details>
        <summary>Résumé</summary>
        Cet article explore l&apos;essor du CBD, mettant en avant ses bienfaits en tant qu&apos;alternative aux substances psychotropes et chimiques.
        Il aborde la structure et les composants du <dfn>Cannabis Sativa L.</dfn>, les différentes méthodes de culture (outdoor, greenhouse, indoor),
        ainsi que les divers profils aromatiques apportés par les terpènes. Enfin, il distingue les phénotypes principaux : <mark>Sativa</mark>,{" "}
        <mark>Indica</mark> et <mark>Ruderalis</mark>.
      </details>

      <h2>La plante</h2>
      <p>
        Le <dfn>Cannabis Sativa L.</dfn>, ou chanvre commun, est une plante ancienne qui pousse sur plusieurs parties du globe. En plus de renouveler
        et aérer les sols, elle contient des vitamines, minéraux, protéines, etc. Elle est composée de cinq parties distinctes : les racines, les
        tiges, les feuilles, les graines et les fleurs. Elles ont la particularité d&apos;être composées de deux molécules principales distinctes :
        les{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/terpenes-et-cbd-comment-ca-fonctionne/"`}>
          <b>terpènes</b>
        </a>{" "}
        et les{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cbg-thc-cbn-quels-sont-les-differents-cannabinoides/"`}>
          <b>cannabinoïdes</b>
        </a>
        .
      </p>

      <p>
        Les <dfn>terpènes</dfn> sont des hydrocarbures produits naturellement par un grand nombre de plantes. Ils influencent l&apos;odeur et le goût
        du chanvre. Les <dfn>cannabinoïdes</dfn>, quant à eux, agissent sur le système nerveux en activant les récepteurs du{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-et-systeme-endocannabinoide-comment-ca-marche/"`}>
          <b>système endocannabinoïde</b>
        </a>
        .
      </p>

      <h2>La méthode de culture</h2>
      <p>Il existe trois principales méthodes de culture :</p>

      <h3>Outdoor</h3>
      <p>La plante se développe en plein air, bénéficiant du soleil et parfois d&apos;un système d&apos;irrigation.</p>
      <figure>
        <Image
          width="640"
          height="426"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/03/cannabis-2773112_640.jpg"
          alt="cbd outdoor"
          loading="lazy"
        />
        <figcaption>Culture en extérieur</figcaption>
      </figure>

      <h3>Greenhouse</h3>
      <p>La culture sous serre permet de combiner les avantages de la lumière naturelle et d&apos;une assistance lumineuse contrôlée.</p>
      <figure>
        <Image
          width="640"
          height="426"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/03/greenhouse-691704_640.jpg"
          alt="cbd greenhouse"
          loading="lazy"
        />
        <figcaption>Culture en serre</figcaption>
      </figure>

      <h3>Indoor</h3>
      <p>Cette méthode offre un contrôle optimal sur l&apos;environnement : lumière, humidité, vent, etc.</p>
      <figure>
        <Image
          width="640"
          height="480"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/03/marijuana-1281540_640.jpg"
          alt="cbd indoor"
          loading="lazy"
        />
        <figcaption>Culture en intérieur</figcaption>
      </figure>

      <h2>Le goût</h2>
      <p>Les terpènes jouent un rôle clé dans l&apos;arôme du chanvre, offrant une large palette de saveurs.</p>

      <h3>Bêta-Caryophyllène</h3>
      <figure>
        <Image
          width="640"
          height="423"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/02/pepper-3061211_640.jpg"
          alt="terpène poivre cbd"
          loading="lazy"
        />
        <figcaption>Goût poivré et boisé</figcaption>
      </figure>

      <h3>Myrcène</h3>
      <figure>
        <Image
          width="640"
          height="407"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/02/tree-276014_640.jpg"
          alt="terpènes cbd myrcène"
          loading="lazy"
        />
        <figcaption>Saveur terreuse et musquée</figcaption>
      </figure>

      <h3>Limonène</h3>
      <figure>
        <Image
          width="640"
          height="359"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/02/lime-2481346_640.jpg"
          alt="terpène limonène cbd"
          loading="lazy"
        />
        <figcaption>Saveur citronnée</figcaption>
      </figure>

      <h2>Le phénotype</h2>
      <p>
        Il existe trois grandes familles : <mark>Sativa</mark>, <mark>Indica</mark> et <mark>Ruderalis</mark>.
      </p>

      <h3>Sativa</h3>
      <p>Plante haute et élancée, typique des zones tropicales, avec des effets stimulants.</p>
      <figure>
        <Image
          width="1024"
          height="683"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/08/Amnesia-1024x683.jpg"
          alt="Amnesia CBD"
          loading="lazy"
        />
        <figcaption>Amnesia</figcaption>
      </figure>

      <h3>Indica</h3>
      <p>Plante buissonnante aux feuilles épaisses, idéale pour la relaxation.</p>
      <figure>
        <Image
          width="1024"
          height="683"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/08/Skywalker-1024x683.jpg"
          alt="Skywalker CBD"
          loading="lazy"
        />
        <figcaption>Skywalker</figcaption>
      </figure>

      <p>
        Pour choisir votre CBD, considérez le mode de culture, les arômes et les effets recherchés. En cas de doute, contactez-nous via{" "}
        <a href="https://www.facebook.com/monplancbd/" target="_blank" rel="nofollow noopener">
          Facebook
        </a>{" "}
        ou{" "}
        <a href="https://www.instagram.com/monplancbd.fr/" target="_blank" rel="nofollow noopener">
          Instagram
        </a>
        .
      </p>
    </article>
  );
}
