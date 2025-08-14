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
      <h1>Légalisation du cannabis : Où se situent les candidats à la présidentielle 2022 ?</h1>

      <details>
        <summary>Résumé</summary>
        <p>
          La France est le premier pays consommateur de cannabis en Europe, ce qui fait de sa légalisation un sujet clé des débats présidentiels de
          2022. Parmi les 12 candidats, 5 sont en faveur de la légalisation, 2 souhaitent un débat national et 5 s&apos;y opposent fermement. Certains
          voient dans la légalisation une opportunité économique et un moyen de lutter contre le trafic, tandis que d&apos;autres estiment que cela
          nuirait à la santé publique et encouragerait la consommation. Découvrez les positions détaillées des candidats dans cet article.
        </p>
      </details>

      <p>
        La France est le premier pays consommateur de cannabis en Europe. Partant de ce constat, il semble logique que la légalisation du cannabis
        alimente les débats précédant les élections présidentielles 2022. Pour vous, nous avons fait{" "}
        <strong>la liste des candidats pour ou contre la légalisation du cannabis</strong>. Alors, lequel des 12 candidats vous convaincra ?
      </p>

      <figure>
        <Image
          width="910"
          height="607"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/03/cannabis_legal.jpg"
          alt="cannabis légal"
          loading="lazy"
          sizes="(max-width: 910px) 100vw, 910px"
        />
        <figcaption>Le débat sur la légalisation du cannabis en France</figcaption>
      </figure>

      <figure>
        <Image
          width="1024"
          height="949"
          src="https://www.monplancbd.fr/wp-content/uploads/2022/03/cannabis_legal_justice-1024x949.png"
          alt="cannabis légal justice"
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <figcaption>Le cannabis et la justice en France</figcaption>
      </figure>

      <h2>5 candidats pour la légalisation du cannabis</h2>

      <p>
        <strong>Nathalie Arthaud</strong> est pour la légalisation du cannabis. Pour la tête d’affiche de Lutte Ouvrière, l’interdiction pratiquée est
        un échec. Depuis une vingtaine d’années, la consommation de cannabis se maintient à un niveau élevé en France. Elle propose donc{" "}
        <mark>de mettre fin à la répression contre les consommateurs et les vendeurs</mark>. Nathalie Arthaud suggère une commercialisation du
        cannabis contrôlée par l’État.
      </p>

      <p>
        <strong>Yannick Jadot</strong> se prononce également en faveur de la légalisation du cannabis. Selon lui, c’est un <mark>enjeu majeur</mark>{" "}
        pour sortir certains quartiers de l’emprise des mafias organisées autour du deal de cannabis. Il y voit également des{" "}
        <mark>potentielles recettes fiscales</mark> estimées entre 5 et 6 milliards d’euros. En parallèle, il souhaite{" "}
        <mark>adopter une politique de santé et une politique sociale</mark> pour accompagner la population et éliminer les points de deal.
      </p>

      <p>
        <strong>Jean Lassalle</strong> soutient aussi la légalisation du cannabis. Il plaide pour un <mark>système encadré par l’État</mark>. Il
        souhaite que les gains issus de la légalisation soient attribués aux personnes touchées par une consommation excessive de cannabis.
      </p>

      <p>
        <strong>Jean-Luc Mélenchon</strong> défend la légalisation en avançant que{" "}
        <mark>60 % des contacts entre policiers et jeunes citoyens concernent des affaires de cannabis</mark>. Pour lui, la prohibition alimente le
        trafic et sa levée permettrait de réduire les tensions policières et d’exploiter les vertus médicinales du cannabis.
      </p>

      <p>
        <strong>Philippe Poutou</strong> est non seulement pour la légalisation du cannabis, mais aussi{" "}
        <mark>pour la dépénalisation des drogues en général</mark>. Il considère que <mark>la répression est inefficace</mark> et qu’elle exacerbe les
        tensions entre la police et les jeunes des quartiers populaires.
      </p>

      <h2>2 candidats veulent un débat national sur le cannabis</h2>

      <p>
        <strong>Anne Hidalgo</strong> reconnaît l’échec de la politique d’interdiction du cannabis en France. Elle souhaite organiser un{" "}
        <mark>débat national</mark> afin de trouver un consensus sur la question.
      </p>

      <p>
        <strong>Fabien Roussel</strong> est favorable à la dépénalisation, mais pas à la légalisation. Il pense que le trafic continuerait avec du
        cannabis plus concentré. Il prône donc un <mark>débat démocratique</mark> pour déterminer la meilleure politique à adopter.
      </p>

      <h2>5 candidats contre la légalisation du cannabis</h2>

      <p>
        <strong>Nicolas Dupont-Aignan</strong> s’oppose à la légalisation, arguant que le cannabis est nocif pour la santé et que sa légalisation{" "}
        <mark>augmenterait mécaniquement la consommation</mark>.
      </p>

      <p>
        <strong>Marine Le Pen</strong> est fermement opposée à la légalisation, mais reconnaît le potentiel du <mark>cannabis thérapeutique</mark>,
        qu’elle soutient.
      </p>

      <p>
        <strong>Emmanuel Macron</strong> est contre la légalisation et souhaite <mark>renforcer la lutte contre le commerce de cannabis</mark>.
      </p>

      <p>
        <strong>Valérie Pécresse</strong> estime qu’une légalisation rendrait difficile l’interdiction aux mineurs et que le trafic continuerait avec
        des produits plus concentrés. Elle propose une <mark>amende pénale</mark> pouvant être inscrite au casier judiciaire.
      </p>

      <p>
        <strong>Éric Zemmour</strong> considère que la France n’a jamais appliqué une politique de répression efficace contre le cannabis. Il souhaite{" "}
        <mark>donner plus de moyens aux forces de l’ordre</mark> pour lutter contre la vente et la consommation.
      </p>

      <p>
        Pour la légalisation du cannabis, contre ou encore sans prise de position, les 12 candidats officiels à l’élection présidentielle 2022
        présentent donc des points de vue divers. Pour compléter ces arguments, découvrez l’approche de <strong>Gaspard Koenig</strong>, un candidat
        non qualifié qui prône une <mark>réglementation stricte et une prévention audacieuse</mark>. Son point de vue est disponible{" "}
        <a href={`https://www.monplancbd.fr/${locale}/62161110708909664c381f67_Fiche%20programme%20-%20Le%CC%87galisation%20du%20cannabis.pdf`}>
          ici
        </a>
        .
      </p>

      <p>
        <em>
          En bonus : L’avis de 10 candidats sur 12 en vidéo par Konbini… <a href="https://www.youtube.com/watch?v=-vnkKSa8Z-s">Cliquez ici</a> !
        </em>
      </p>
    </article>
  );
}
