import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Actualité CBD en France</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          Ce mois de décembre 2021 apporte de bonnes nouvelles pour le secteur du CBD en France. La Commission européenne a rejeté le projet
          d&apos;arrêté de la Mildeca, notamment car les fleurs et feuilles de chanvre peuvent être considérées comme des denrées alimentaires. De
          plus, l&apos;affaire Kanavape se termine sur une relaxe totale pour les fondateurs de l&apos;entreprise après sept ans de bataille
          judiciaire.
        </p>
      </details>

      <h2>CBD NEWS</h2>
      <p>
        On vous propose de commencer ce mois de décembre 2021 avec un petit tour d’horizon de l’<strong>actualité CBD en France</strong>. L’occasion
        de reprendre deux faits récents qui sont porteurs de bonnes nouvelles pour le CBD et le chanvre en France. Zoom sur{" "}
        <mark>le rejet du projet d’arrêté de la Mildeca et sur la fin de l’affaire Kanavape</mark>.
      </p>

      <h2>La Commission européenne invalide le projet d’arrêté de la Mildeca</h2>
      <p>
        En juillet 2021, la Mission interministérielle de lutte contre les drogues et les conduites addictives (la Mildeca) avait présenté à la
        Commission européenne
        <strong>un projet d’arrêté afin de réviser l’arrêté du 22 août 1990</strong> “qui limite la culture, l’importation et l’utilisation
        industrielle et commerciale du chanvre aux seules fibres et graines de la plante et interdit de ce fait l’importation et la commercialisation
        d’e-liquide pour cigarette électronique contenant de l’huile de cannabidiol (CBD) obtenue à partir de plantes entières de chanvre”. Ce projet
        faisait suite au positionnement de la Cour de justice de l’Union européenne (CJUE) rappelant à la France que{" "}
        <mark>l’huile de CBD ne pouvait pas être considérée comme un stupéfiant</mark> en l’état des connaissances scientifiques actuelles.
      </p>

      <p>
        Ce nouveau projet d’arrêté de la Mildeca avait déclenché un vent de contestation dans tout l’univers du CBD. En effet, ce texte prévoyait
        notamment que les fleurs et les feuilles de chanvre pouvaient être récoltées, importées et utilisées uniquement dans le cadre de la production
        d’extraits de chanvre telles que les huiles de CBD. De ce fait,{" "}
        <mark>la commercialisation et la consommation des feuilles et des fleurs brutes de chanvre auraient été interdites</mark> (seules ou même
        mélangées en tisane).
      </p>

      <p>
        Cependant, le 12 novembre 2021, la Commission européenne a demandé à la Mildeca de revoir ce projet d’arrêté. Plusieurs points problématiques
        ont été relevés et celui concernant la consommation des feuilles et des fleurs brutes de chanvre pourrait vous surprendre :
      </p>

      <blockquote>
        “Il n’est pas exclu que certains des produits qui entreraient dans le champ d’application de cette interdiction soient considérés comme des
        denrées alimentaires conformément à la définition de l’article 2 du règlement (CE) n° 178/2002, [...]”.
      </blockquote>

      <p>
        Oui, vous avez bien compris,{" "}
        <mark>
          la Commission européenne a retoqué ce projet d’arrêté notamment car les fleurs et feuilles de chanvre peuvent être considérées comme des
          produits alimentaires
        </mark>
        .
      </p>

      <p>
        Il est donc attendu de la Mildeca une redéfinition de certains éléments de ce projet d’arrêté. Les mois à venir nous apporteront ces
        précisions… Quoi qu’il en soit, <mark>les fleurs et les feuilles de chanvre peuvent être consommées en toute légalité en France.</mark>
      </p>

      <h2>Fin de l’Affaire KANAVAPE : la relaxe !</h2>
      <p>Vous avez probablement suivi la très médiatisée affaire Kanavape. Mais rappelons rapidement les faits…</p>

      <p>
        À l&apos;origine, Kanavape est une entreprise française fondée par Sébastien Beguerie et Antonin Cohen. Nous sommes alors en 2014 et avec leur
        cigarette électronique au CBD, les deux jeunes hommes sont des <mark>pionniers dans l’univers du chanvre</mark>. Dès 2015, les deux
        entrepreneurs font face à de multiples chefs d’accusation comme promotion à l’usage des drogues, trafic de stupéfiants, pratique illégale de
        la médecine et de la pharmacie ou encore ouverture illégale d&apos;une officine. S&apos;ensuivent des années de bataille judiciaire qui ne
        sont pas l’objet de cet article*.
      </p>

      <p>
        Après sept années de conflit avec la justice française et l’implication des instances européennes, l’entreprise Kanavape est enfin arrivée au
        bout de ce long combat pour le chanvre. En effet, la Cour d’appel d’Aix-en-Provence a rendu son délibéré le 17 octobre 2021 :{" "}
        <mark>les charges contre les deux entrepreneurs sont abandonnées</mark>. C’est donc une belle victoire de Kanavape qui va bénéficier à tout le
        secteur du chanvre et du CBD en France !
      </p>

      <p>
        <em>
          [*Vous pouvez retrouver quelques éléments sur cette affaire dans{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/cbd-cannabis-que-dit-lactualite/`} rel="nofollow">
            notre ancien article
          </a>{" "}
          ou dans
          <a
            href="https://business.lesechos.fr/entrepreneurs/juridique/0610631724225-cbd-comment-kanavape-a-fait-bouger-les-lignes-342828.php"
            rel="nofollow sponsored"
          >
            celui-ci
          </a>
          .]
        </em>
      </p>

      <figure>
        <Image
          width="300"
          height="185"
          src="https://www.monplancbd.fr/wp-content/uploads/2021/12/news_paper-300x185.jpg"
          alt="actualité cbd"
          loading="lazy"
          sizes="(max-width: 300px) 100vw, 300px"
        />
        <figcaption>Actualité CBD en France - Décembre 2021</figcaption>
      </figure>
    </article>
  );
}
