import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Comprendre les taux de CBD dans les fleurs de chanvre</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          Les taux de CBD affichés sur les fleurs de chanvre vendues en France sont souvent source de confusion. Cet article explique pourquoi ces
          taux ne dépassent généralement pas 8 %, comment certains vendeurs annoncent des taux plus élevés (par addition de CBD+CBDA ou ajout
          d&apos;isolat de CBD), et donne des conseils pour acheter du CBD de manière avisée.
        </p>
      </details>
      <p>
        Nous recevons souvent des questions de la part de nos acheteurs sur notre{" "}
        <a href="https://www.instagram.com/monplancbd.fr/" target="_blank" rel="nofollow noopener">
          Instagram
        </a>{" "}
        (on adore y répondre) et récemment nous avons reçu ce message : &quot;J’ai grave envie de commander sur votre site mais pourquoi vos taux de
        CBD sont si bas ? J’ai trouvé des kush à 16% de CBD et là vous affichez 2,47%. J’ai peur que ça me fasse zéro effet&quot;.
      </p>
      <p>
        Chez Mon Plan CBD, nous faisons le maximum pour être une entreprise transparente. Alors nous voulons que vous sachiez ce que vous consommez,
        pourquoi nous affichons des pourcentages de CBD et ce à quoi ces taux de CBD correspondent vraiment. Dans cet article, nous allons donc vous
        expliquer la réalité autour des taux de CBD des fleurs de chanvre.
      </p>

      <h2>Importance du ratio THC/CBD</h2>
      <figure>
        <Image
          width="1024"
          height="608"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/03/Cannabidiol-1024x608.png"
          alt="taux"
          loading="lazy"
        />
        <figcaption>Taux de CBD</figcaption>
      </figure>
      <figure>
        <Image
          width="640"
          height="347"
          src="https://www.monplancbd.fr/wp-content/uploads/2020/12/cropped-tetrahydrocannabinol.jpg"
          alt="tetrahydrocannabinol"
          loading="lazy"
        />
        <figcaption>THC</figcaption>
      </figure>
      <p>
        Comme vous le savez certainement, en France, il est légal de vendre des fleurs de CBD. Toutefois, une condition s’applique,{" "}
        <mark>le taux de THC contenu dans ces fleurs de chanvre doit être inférieur à 0,2%</mark>. Or, de par leur génétique, les fleurs de chanvre
        contenant moins de 0,2% de THC ne peuvent pas dépasser les 8% de CBD dans leur composition.
      </p>
      <p>
        En moyenne donc, les taux de CBD constatés dans les fleurs de chanvre oscillent <mark>entre 2% et 8% de CBD</mark>. Ces taux sont dus au{" "}
        <dfn>ratio naturel THC/CBD de 1:20</dfn>. Cela signifie que pour 1% de THC dans la plante de chanvre, il y aura mécaniquement un taux de 20%
        de CBD. Et puisque le taux de THC doit se situer en dessous des 0,2% dans les produits à base de CBD vendus en France, le taux de CBD se
        situera à 4%.
      </p>
      <p>(Pour ceux qui n’auraient pas bien suivi en cours de mathématiques, c’est une simple règle de trois que nous appliquons ici !)</p>
      <p>
        Cependant certaines sélections génétiques permettent d’atteindre un <mark>ratio THC/CBD de 1:30</mark> ou <mark>1:40</mark>. Cela équivaut à
        des fleurs présentant un taux de CBD allant jusqu’à 8%.
      </p>
      <p>
        Du fait de certaines sélections génétiques poussées, il peut exister des exceptions. Il semblerait que le ratio THC/CBD puisse atteindre{" "}
        <mark>1:50</mark>, soit 10% de CBD dans une fleur de chanvre. Cela concerne de très rares génétiques, cultivées en intérieur et sous des
        lampes. Ne faisons pas de ces exceptions une généralité.
      </p>

      <h2>Pourquoi certains taux de CBD sont annoncés comme supérieurs à 10% ?</h2>
      <h3>Addition des taux de CBD et de CBDA</h3>
      <p>
        Une fleur de chanvre avec un taux de CBD affiché supérieur à 10% peut correspondre à l’addition des formes acides et actives du cannabidiol.
        C&apos;est-à-dire le taux de CBD plus le taux de CBDA. Ce <mark>taux CBD+CBDA</mark> permet d’atteindre le taux de 10% (ou plus) affiché par
        le vendeur.
      </p>
      <p>
        Lorsque vous achetez des fleurs de CBD, nous vous conseillons de privilégier des vendeurs honnêtes qui{" "}
        <mark>affichent clairement un taux de CBD+CBDA supérieur à 10%</mark> à d’autres commerçants peu scrupuleux affichant seulement un taux
        magique de 16% de CBD (vous l’aurez compris, c’est impossible...).
      </p>

      <h3>Ajout d’isolat de CBD</h3>
      <p>
        Un taux de CBD dépassant les 10% pour une fleur de chanvre peut aussi s’expliquer par l’<mark>ajout d’isolat de CBD</mark>. En effet, l’isolat
        étant hydrosoluble, il est possible de le diluer puis de l’asperger sur les fleurs de chanvre. Une fois séchées, ces fleurs de chanvre peuvent
        afficher des <mark>taux très élevés de CBD</mark> (et très rares).
      </p>
      <p>
        Normalement, le prix final de la fleur de CBD boostée à l’isolat doit être relativement élevé puisque l’isolat de CBD est un produit très
        concentré et qu’il y a eu des étapes supplémentaires dans la production de la fleur de CBD.
      </p>
      <p>
        <em>
          [Pour en savoir plus sur l’isolat de CBD, nous vous invitons à consulter{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/quest-ce-que-lisolat-de-cbd/`}>notre article juste ici</a>.]
        </em>
      </p>
      <figure>
        <Image
          width="612"
          height="400"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/03/isolate_cbd.jpg"
          alt="isolat de cbd"
          loading="lazy"
        />
        <figcaption>Isolat de CBD</figcaption>
      </figure>

      <h2>Nos conseils pour acheter du CBD de manière avisée</h2>
      <p>
        1 - Passez par une <mark>entreprise fiable et transparente</mark> qui connaît vraiment ses produits.{" "}
        <em>
          [<a href={`https://www.monplancbd.fr/${locale}`}>Mon Plan CBD</a> par exemple ! Nous sommes des passionnés et nous goûtons absolument TOUT
          pour vous garantir des produits au CBD de grande qualité.]
        </em>
      </p>
      <p>
        2 - Regardez les <mark>descriptions des produits</mark> que vous souhaitez acheter. Si un taux très élevé de CBD est affiché, sans explication
        et à un prix ridiculement bas : fuyez !
      </p>
      <p>
        3 - Consultez les <mark>analyses</mark> des fleurs de CBD. Elles vous donneront plus d’informations sur vos fleurs de chanvre, leur taux de
        CBD réel, etc.
      </p>
      <p>4 - Si un taux de CBD vous paraît très élevé mais que vous faites confiance au vendeur de CBD, posez directement la question !</p>
      <p>
        Vous voulez acheter des <mark>fleurs de CBD</mark> ? Découvrez toutes nos références avec des taux de CBD plus ou moins élevés{" "}
        <a href={`https://www.monplancbd.fr/${locale}/fleurs-cbd/`}>en cliquant ici</a> !
      </p>
    </article>
  );
}
