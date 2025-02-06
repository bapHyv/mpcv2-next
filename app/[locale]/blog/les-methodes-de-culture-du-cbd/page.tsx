interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Les Différentes Méthodes de Culture du CBD</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          Le chanvre peut être cultivé selon trois principales méthodes : <mark>outdoor</mark> (en extérieur), <mark>indoor</mark> (en intérieur) et{" "}
          <mark>greenhouse</mark> (sous serre). Chaque méthode présente des avantages et des inconvénients en termes de qualité, de rendement et
          d&apos;impact environnemental. Cet article détaille les caractéristiques de chaque type de culture et vous aide à choisir les meilleures
          fleurs de CBD selon vos préférences.
        </p>
      </details>

      <h2>
        Culture du CBD en extérieur ou <dfn>outdoor</dfn>
      </h2>
      <p>
        La culture en extérieur du chanvre est la plus ancienne et nécessite peu d&apos;interventions humaines. Les plantes poussent naturellement,
        alimentées par le soleil et les nutriments du sol.
      </p>

      <h3>
        Les avantages du CBD <dfn>outdoor</dfn>
      </h3>
      <ul>
        <li>
          <strong>Production généreuse</strong> : le rendement est très bon.
        </li>
        <li>
          <strong>Peu de moyens nécessaires</strong> : la nature fait l&apos;essentiel du travail.
        </li>
        <li>
          <strong>Culture écologique et économique</strong> : faible consommation de ressources.
        </li>
      </ul>

      <h3>Les inconvénients de la culture en extérieur</h3>
      <ul>
        <li>
          <strong>Croissance longue</strong> : au moins 6 mois avant récolte.
        </li>
        <li>
          <strong>Aléas climatiques et insectes</strong> : exposition aux éléments et aux nuisibles.
        </li>
      </ul>
      <h2>
        Culture du CBD en intérieur ou <dfn>indoor</dfn>
      </h2>
      <p>La culture en intérieur permet un contrôle précis des conditions de croissance et assure des fleurs de haute qualité.</p>

      <h3>
        Les avantages du CBD <dfn>indoor</dfn>
      </h3>
      <ul>
        <li>
          <strong>Contrôle précis</strong> des conditions environnementales.
        </li>
        <li>
          <strong>Production de qualité</strong> avec des taux de CBD optimaux.
        </li>
        <li>
          <strong>Protection contre les aléas</strong> climatiques et les nuisibles.
        </li>
      </ul>

      <h3>Les points faibles de la culture en intérieur</h3>
      <ul>
        <li>
          <strong>Consommation d&apos;énergie</strong> élevée.
        </li>
        <li>
          <strong>Coût global important</strong> (matériel, main-d&apos;œuvre).
        </li>
        <li>
          <strong>Rendement plus faible</strong> que l&apos;outdoor.
        </li>
      </ul>

      <h2>
        Culture du CBD sous serre ou <dfn>greenhouse</dfn>
      </h2>
      <p>La culture sous serre combine les avantages de l&apos;outdoor et de l&apos;indoor.</p>

      <h3>
        Les avantages de la culture de CBD <dfn>greenhouse</dfn>
      </h3>
      <ul>
        <li>
          <strong>Environnement naturel</strong> et sol riche en nutriments.
        </li>
        <li>
          <strong>Protection</strong> contre les nuisibles et intempéries.
        </li>
        <li>
          <strong>Économie de ressources</strong>, faible consommation énergétique.
        </li>
      </ul>

      <h3>Les inconvénients de la culture sous serre</h3>
      <ul>
        <li>
          <strong>Rendement moyen</strong>, inférieur à l&apos;outdoor.
        </li>
      </ul>
    </article>
  );
}
