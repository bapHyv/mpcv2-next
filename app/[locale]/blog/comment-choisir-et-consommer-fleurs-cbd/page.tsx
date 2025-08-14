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
      <h1>Guide pour choisir et consommer les fleurs de CBD</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          Découvrez comment choisir vos fleurs de CBD en fonction du taux de cannabidiol et des arômes recherchés. Apprenez également les différentes
          méthodes de consommation, notamment la vaporisation qui permet de bénéficier des bienfaits du CBD sans inhaler de fumées toxiques.
        </p>
      </details>

      <p>
        Vous souhaitez profiter des bienfaits du cannabidiol ? Vous vous demandez comment choisir vos fleurs de CBD et comment les consommer ? Ici, on
        vous présente les différents critères pour vous aider à choisir vos fleurs de CBD ainsi que les différentes méthodes de consommation du CBD.
      </p>

      <h2>Qu’est-ce que les fleurs de CBD ?</h2>

      <h3>Fleurs de chanvre</h3>
      <p>
        <strong>Les fleurs de CBD sont les fleurs issues de la plante de chanvre</strong> qui contient un taux de CBD plus ou moins important selon
        les différentes sous-espèces. Ces fleurs de CBD offrent de nombreux bienfaits comme un effet <mark>anti-stress</mark>,{" "}
        <mark>anti-douleur</mark>, et une aide contre les troubles du sommeil. À l’inverse du THC présent dans le cannabis récréatif,{" "}
        <strong>la molécule de cannabidiol contenue dans les fleurs de CBD n’engendre aucun effet psychoactif</strong>. De ce fait, la vente et la
        consommation de CBD sont légales en France. Plus précisément, les fleurs de CBD doivent être issues de plants de chanvre contenant un taux de
        THC inférieur à 0,2%.
      </p>

      <h3>Production des fleurs de CBD</h3>
      <p>
        Les plants de chanvre peuvent pousser en culture dite <dfn>indoor</dfn> (à l’intérieur), <dfn>outdoor</dfn> (à l’extérieur) ou encore en{" "}
        <dfn>greenhouse</dfn>, soit sous serre. La méthode de culture varie selon les caractéristiques des sous-espèces cultivées. Une fois que les
        fleurs de CBD sont arrivées à maturité, elles sont récoltées puis séchées avant d’être vendues.
      </p>

      <h2>Quelles fleurs de CBD choisir ?</h2>
      <p>
        Pour <strong>choisir vos fleurs de CBD</strong>, plusieurs éléments sont à prendre en compte. En effet, puisqu’il existe différents plants de
        chanvre, il existe un grand nombre de fleurs de CBD proposant des <strong>caractéristiques variées</strong>.
      </p>

      <h3>Quel taux de CBD pour vos fleurs de CBD ?</h3>
      <p>
        Les différentes fleurs de chanvre contiennent des <strong>taux de CBD</strong> pouvant varier <mark>entre 2% et 8%</mark>. Il est possible -
        mais très rare - de trouver certaines fleurs contenant naturellement un taux de 10% de CBD. Au-delà, prudence, il y a quelque chose de pas
        normal dans les fleurs de CBD repérées !*
      </p>
      <p>
        <em>
          [*Pour en savoir plus, nous vous invitons à lire{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/la-realite-autour-des-taux-de-cbd/`}>
            notre article sur les fleurs de chanvre et les taux de CBD
          </a>
          .]
        </em>
      </p>

      <h2>Différentes méthodes de consommation des fleurs de CBD</h2>

      <h3>Vaporisation des fleurs de CBD</h3>
      <p>
        La méthode de consommation idéale est <strong>la vaporisation des fleurs de CBD</strong>. En effet, le vaporisateur va chauffer la fleur de
        CBD sans jamais arriver au stade de la combustion. Cela signifie que vous allez pouvoir{" "}
        <strong>profiter de tous les bienfaits du cannabidiol sans inhaler de fumées toxiques.*</strong>
      </p>
      <p>
        <em>
          [*Si vous souhaitez en apprendre plus sur la vaporisation du CBD, c’est{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/vaporiser-du-cbd/`}>par ici</a> !]
        </em>
      </p>
      <p>
        Pour vaporiser des fleurs de CBD, il suffit d’avoir un <a href={`https://www.monplancbd.fr/${locale}/vaporisateur`}>vaporisateur</a>. Si vous
        en cherchez un, nous vous proposons différents modèles sur notre <a href={`https://www.monplancbd.fr/${locale}/vaporisateur`}>e-shop CBD</a>.
        (Et si vous ne savez pas trop lequel choisir, on reste disponible pour vous aider !)
      </p>

      <h3>Fumer du CBD ? Fausse bonne idée !</h3>
      <p>
        On pourrait imaginer que fumer du CBD est une méthode intéressante. Mais chez Mon Plan CBD, on vous le déconseille formellement ! Comme on l’a
        vu juste au-dessus, si vous brûlez des fleurs de chanvre, vous allez absorber des matières toxiques liées à la combustion. Mauvais plan.
      </p>

      <figure>
        <Image
          width="300"
          height="200"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/11/hemp-300x200.jpg"
          alt="cannabidivarine CBDV fleurs"
          loading="lazy"
        />
        <figcaption>Illustration de fleurs de chanvre utilisées pour l&apos;extraction de CBD.</figcaption>
      </figure>
    </article>
  );
}
