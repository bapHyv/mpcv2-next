import Image from "next/image";

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export default function Page() {
  return (
    <article>
      <h1>Les différentes utilisations du chanvre</h1>
      <p>
        Le chanvre est une plante pleine de surprises ! Dans cet article, nous vous faisons découvrir les{" "}
        <strong>différentes utilisations du chanvre</strong>. Du papier de chanvre à l’huile de chanvre en passant par la laine de chanvre et
        l’alimentation animale… Le chanvre est convoité pour ses fibres et pour ses graines. De là, découlent une multitude de possibilités que nous
        vous présentons.
      </p>

      <h2>Utilisation des fibres de chanvre</h2>
      <p>
        On distingue deux types de fibres de chanvre. D’une part, les <strong>fibres de la chènevotte</strong>, la tige centrale du chanvre, elles
        sont connues pour leur grande capacité d’absorption. D’autre part, les <strong>fibres de la partie périphérique</strong> de la chènevotte, ce
        sont les plus utilisées.
      </p>

      <h3>Cordages et voiles en fibres de chanvre</h3>
      <figure>
        <Image
          width="640"
          height="426"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/12/cord-4088055_640.jpg"
          alt="Corde en fibre de chanvre"
          loading="lazy"
        />
        <figcaption>Corde en fibre de chanvre</figcaption>
      </figure>
      <p>
        Les fibres de chanvre sont reconnues pour leur usage dans le milieu de la navigation. En effet, les propriétés des fibres de chanvre rendent
        les <strong>cordages en chanvre robustes</strong> face à la rupture, à l’abrasion, à la chaleur et sont difficilement inflammables. De plus,
        les fibres de chanvre font d’excellentes <strong>voiles pour les bateaux</strong>.
      </p>
      <p>
        Ce n’est donc pas un hasard si, pendant plus de 200 ans, toutes les cordes fabriquées par la Corderie Royale de Rochefort étaient en chanvre.
        C’est dans ce lieu créé par Louis XIV qu’étaient produits les cordages en chanvre pour les bateaux à voiles de la marine de guerre française.
        Et avec l’explosion du commerce intercontinental entre le XVIIe et le XVIIIe siècle, le chanvre a connu son âge d’or puisqu’il a permis
        d’équiper le nombre grandissant de navires marchands en cordes et en voiles en fibres de chanvre.
      </p>

      <h3>Papier de chanvre</h3>
      <p>
        Le <strong>papier de chanvre</strong> est utilisé par l’Homme depuis le début du premier millénaire de notre ère. Et jusqu’à la fin du 19e
        siècle, le papier de chanvre représentait plus de 80% du papier mondial. Aujourd’hui c’est le papier de bois qui règne en maître avec plus de
        90% de la production mondiale.
      </p>
      <p>
        Ainsi, de nombreux ouvrages historiques ont été imprimés au cours des siècles sur du papier de chanvre. C’est notamment le cas pour la{" "}
        <a href="https://www.monplancbd.fr/le-chanvre-dans-lhistoire-7-faits-historiques-qui-vont-vous-surprendre/">Bible de Gutenberg</a> qui a été
        imprimée sur des feuilles en fibres de chanvre.
      </p>
      <p>
        Le papier de chanvre a également été largement utilisé dans la fabrication de <strong>billets de banque</strong> au cours des années 1900. En
        effet, les fibres de chanvre sont particulièrement résistantes aux manipulations et aux pliages répétés.
      </p>
      <figure>
        <Image
          width="640"
          height="452"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/12/document-435349_640.jpg"
          alt="Papier de chanvre"
          loading="lazy"
        />
        <figcaption>Papier de chanvre</figcaption>
      </figure>

      <h3>Isolation thermique grâce aux fibres le chanvre</h3>
      <p>
        Les <strong>fibres de chanvre</strong> sont également utilisées dans le secteur de la construction à des fins d’
        <strong>isolation thermique</strong>. Nous pouvons citer le béton de chanvre qui est un mélange de chènevotte et de chaux. Ce{" "}
        <strong>béton de chanvre</strong> permet une isolation extérieure ou intérieure des bâtiments tout en garantissant une bonne respiration des
        murs.
      </p>

      <h3>Vêtements en fibres de chanvre</h3>
      <figure>
        <Image
          width="640"
          height="426"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/12/white-845071_640.jpg"
          alt="Vêtements en fibre de chanvre"
          loading="lazy"
        />
        <figcaption>Vêtements en fibre de chanvre</figcaption>
      </figure>
      <p>
        Depuis le 6e siècle avant J.-C., les Chinois utilisaient la <strong>fibre de chanvre pour confectionner des vêtements</strong>. Aujourd’hui,
        on note un regain d’intérêt pour l’utilisation des fibres de chanvre dans l’industrie textile.
      </p>

      <h2>Utilisation des graines de chanvre</h2>
      <p>
        La <strong>graine de chanvre</strong>, aussi connue sous le nom de{" "}
        <strong>
          <em>chènevis</em>
        </strong>
        , offre de nombreuses possibilités d’utilisation.
      </p>

      <h3>Huile de chanvre</h3>
      <figure>
        <Image
          width="640"
          height="427"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/12/cbd-oil-5358403_640.jpg"
          alt="Huile de chanvre"
          loading="lazy"
        />
        <figcaption>Huile de chanvre</figcaption>
      </figure>
      <p>
        Lorsque le chènevis est pressé, on obtient de l’<strong>huile de chanvre</strong>. Grâce à son équilibre en acides gras poly-insaturés,
        l’huile de chanvre a un <strong>effet nourrissant pour la peau</strong>. Elle est donc souvent utilisée dans le domaine{" "}
        <strong>cosmétique</strong>.
      </p>

      <h3>Farine de chanvre</h3>
      <p>
        Le chènevis permet de produire de la <strong>farine de chanvre</strong>. Elle présente l’avantage supplémentaire d’être une{" "}
        <strong>farine sans gluten</strong>, contenant <strong>peu de glucides</strong> et une <strong>grande teneur en protéines</strong>.
      </p>

      <h3>Alimentation animale</h3>
      <p>
        Les graines de chanvre sont également utilisées dans l’alimentation animale. Ainsi, on retrouve le chènevis dans les{" "}
        <strong>mélanges de graines pour les oiseaux domestiques</strong>. C’est aussi un<strong> appât pour la pêche</strong> de certains poissons.
      </p>
      <p>
        Le chanvre, aussi bien avec ses fibres qu’avec ses graines, présente donc une grande variété d’utilisations possibles. Et dans un souci
        d’écologie et de durabilité, les produits issus des fibres de chanvre ou des graines de chanvre présentent un grand intérêt du fait de leur
        origine naturelle.
      </p>
    </article>
  );
}
