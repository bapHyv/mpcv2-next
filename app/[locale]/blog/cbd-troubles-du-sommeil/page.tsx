import Image from "next/image";

export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export default function Page() {
  return (
    <article>
      <h1>Le CBD et les troubles du sommeil</h1>
      <p>
        L’enquête “Sommeil et modes de vie” publiée par l&apos;Institut National du Sommeil et de la Vigilance (INSV) en 2019 exprime le fait que 39%
        des français souffrent d’au moins un trouble du sommeil. Ici, nous vous expliquons ce que sont les troubles du sommeil puis comment le CBD
        peut être une solution pour dormir correctement.
      </p>
      <figure>
        <Image src="/troubles-sommeil-1.png" alt="Comparaison entre troubles du sommeil et CBD" width={614} height={362} />
        <figcaption>Choisissez une approche pour améliorer la qualité du sommeil.</figcaption>
      </figure>
      <h2>Quels sont les troubles du sommeil ?</h2>
      <p>Avant d’aborder les bienfaits du CBD sur le sommeil, rappelons ce que sont les troubles du sommeil.</p>
      <p>
        L’American Academy of Sleep Medicine a établi la Classification internationale des troubles du sommeil. En France, cette classification a été
        reprise dans le rapport Giordanella, un travail réalisé pour le Ministère de la Santé et des Solidarités publié en 2006. Il existe donc une
        liste exhaustive recensant les différents troubles du sommeil. L’INSV présente quatre catégories principales de troubles du sommeil.
      </p>

      <figure>
        <Image src="/troubles-sommeil-7.png" alt="Catégorisation des troubles du sommeil" width={854} height={620} />
        <figcaption>Catégorisation des troubles du sommeil.</figcaption>
      </figure>

      <h3>L’insomnie</h3>
      <p>
        L’<strong>insomnie</strong> est définie par l’INSV comme “<em>une insatisfaction liée à la quantité ou la qualité du sommeil</em>“. De plus,
        elle associe généralement un ou plusieurs symptômes comme des <strong>difficultés de sommeil</strong> et des{" "}
        <strong>retentissements au cours de la journée</strong>. Cela se traduit par des difficultés à s’endormir, des réveils pendant la nuit ou tôt
        le matin sans possibilité de se rendormir, une fatigue pendant la journée, de la somnolence diurne, un trouble de l’attention ou encore une
        perturbation de l’humeur.
      </p>
      <p>
        L’insomnie est considérée comme occasionnelle lorsqu’elle est liée à un événement stressant, à un environnement défavorable (bruit, chaleur ou
        froid, mauvaise literie…), à une maladie ou à la prise d’excitants (le café par exemple). L’
        <strong>insomnie occasionnelle cesse dès lors que l’origine du trouble disparaît</strong>. Elle engendre peu de conséquences si ce n’est un
        inconfort de vie sur le moment.
      </p>
      <p>
        Cependant, certaines personnes font face à une <strong>insomnie chronique</strong>. Cette forme se manifeste{" "}
        <strong>au minimum 3 fois par semaine et depuis 3 mois</strong>. L’insomnie chronique a des <strong>conséquences importantes</strong> sur la
        vie des personnes concernées.
      </p>
      <p>
        Les origines de ce type d’insomnie sont diverses (anxiété, dépression, suites de maladies comme l’hyperthyroïdie, reflux gastro-œsophagien,
        asthme nocturne…).
      </p>

      <figure>
        <Image src="/troubles-sommeil-6.png" alt="Types d'insomnie" width={614} height={386} />
        <figcaption>Quel type d&apos;insomnie nécessite une attention et une gestion approfondies ?</figcaption>
      </figure>

      <h3>Le syndrome d’apnée du sommeil</h3>
      <p>
        Le <strong>syndrome d’apnée du sommeil</strong> se caractérise par des <strong>arrêts respiratoires pendant le sommeil</strong>. Ces apnées
        peuvent se répéter jusqu’à plusieurs centaines de fois par nuit. S’il est normal de faire de courtes pauses respiratoires pendant le sommeil,
        faire des apnées répétées et longues (plus de 10 secondes) enlève le côté récupérateur du sommeil, le fragmente et induit des{" "}
        <strong>répercussions sur la santé</strong>.
      </p>
      <p>
        L’apnée du sommeil est accompagnée de signes comme des <strong>ronflements bruyants</strong>, des{" "}
        <strong>pauses respiratoires nocturnes</strong> et la plupart du temps elle provoque une{" "}
        <strong>somnolence excessive pendant la journée</strong>.
      </p>
      <p>
        Les apnées du sommeil induisent une baisse de l’oxygénation et une élévation de la pression artérielle. Cela augmente significativement le
        risque d&apos;hypertension artérielle, de maladie cardiovasculaire et de diabète de type 2.
      </p>

      <figure>
        <Image src="/troubles-sommeil-5.png" alt="Facteurs liés à l'apnée du sommeil" width={818} height={602} />
        <figcaption>Facteurs contribuant aux problèmes de santé liés à l&apos;apnée du sommeil.</figcaption>
      </figure>

      <h3>La narcolepsie</h3>
      <p>
        La <strong>narcolepsie</strong> est une maladie rare qui touche 0,026% de la population française. Elle se traduit par des{" "}
        <strong>accès irrépressibles de sommeil</strong> qui surviennent <strong>plusieurs fois par jour</strong> et même lorsqu’une personne est en
        activité. Ce trouble sévère de l’éveil est lié à une forte prédisposition génétique et survient généralement après un événement fort
        (infection, deuil, grossesse…). C’est une <strong>maladie chronique</strong>, elle va donc persister toute la vie mais elle peut évoluer avec
        l’âge.
      </p>

      <figure>
        <Image src="/troubles-sommeil-4.png" alt="Gestion des troubles du sommeil liés à la narcolepsie" width={614} height={362} />
        <figcaption>Comment gérer les troubles du sommeil liés à la narcolepsie ?</figcaption>
      </figure>

      <h3>Le syndrome des jambes sans repos</h3>
      <p>
        Le <strong>syndrome des jambes sans repos</strong> est un <strong>trouble neurologique</strong> qui concerne 5% de la population. Dans la
        plupart des cas, cela se traduit par le <strong>syndrome d’impatiences des membres inférieurs</strong> (simple démangeaison ou décharge
        électrique douloureuse) ainsi que des <strong>mouvements périodiques au cours du sommeil</strong>. Tout cela altère la qualité du sommeil en
        le déstructurant.
      </p>
      <p>
        Le syndrome des jambes sans repos semble notamment lié à un <strong>manque de dopamine</strong>, un neurotransmetteur permettant la
        communication entre différents neurones.
      </p>

      <figure>
        <Image src="/troubles-sommeil-3.png" alt="Facteurs contribuant à la mauvaise qualité du sommeil" width={818} height={404} />
        <figcaption>Facteurs contribuant à la mauvaise qualité du sommeil.</figcaption>
      </figure>

      <h2>Le CBD, une solution aux troubles du sommeil ?</h2>
      <p>
        Nous l’avons vu précédemment, les troubles du sommeil présentent des origines diverses et des conséquences plus ou moins importantes sur la
        vie des personnes concernées. Le <strong>CBD</strong> se présente alors comme une{" "}
        <strong>solution face à certains troubles du sommeil</strong>.
      </p>

      <h3>Le CBD utilise notre système endocannabinoïde</h3>
      <p>
        Comme tous les cannabinoïdes, le <strong>cannabidiol</strong> (CBD) agit sur le corps humain par l’intermédiaire du{" "}
        <strong>système endocannabinoïde</strong>. Or, ce système endocannabinoïde assure le bon fonctionnement de fonctions importantes et notamment
        du <strong>sommeil</strong>.
      </p>
      <p>
        Le système endocannabinoïde est constitué d’un réseau de récepteurs cannabinoïdes situé dans le système nerveux central et dans le cerveau. Le
        récepteur qui nous intéresse pour comprendre l’action du CBD sur les <strong>troubles du sommeil</strong> est le{" "}
        <strong>récepteur CB1</strong>. En interagissant avec le récepteur CB1, le cannabidiol agit donc sur les mécanismes du sommeil.
      </p>

      <h3>Que disent les études sur le CBD et les troubles du sommeil ?</h3>
      <p>
        Une <a href="https://pubmed.ncbi.nlm.nih.gov/30624194/">étude publiée en 2019</a> a montré qu’en un mois, la{" "}
        <strong>qualité du sommeil a été améliorée pour plus de 66%</strong> des participants.
      </p>

      <h3>Comment consommer le CBD dans le cas de troubles du sommeil ?</h3>
      <p>
        Le <strong>CBD ne doit pas se substituer à la prescription médicamenteuse de votre médecin</strong>. Il se présente comme un complément.
      </p>
      <p>
        Vous pouvez consommer le cannabidiol sous plusieurs formes : <strong>huile de CBD</strong>, <strong>vaporisation</strong> ou{" "}
        <strong>infusion</strong>.
      </p>
      <p>
        Découvrez notre gamme CBD <a href="https://www.monplancbd.fr/">en cliquant ici</a> !
      </p>
      <figure>
        <Image src="/troubles-sommeil-2.png" alt="Facteurs améliorant le sommeil avec le CBD" width={758} height={506} />
        <figcaption>Facteurs contribuant à l&apos;amélioration du sommeil avec le CBD.</figcaption>
      </figure>
    </article>
  );
}
