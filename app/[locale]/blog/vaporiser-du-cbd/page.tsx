import Image from "next/image";
interface Params {
  locale: string;
}
export default function Page({ params }: { params: Params }) {
  const { locale } = params;
  return (
    <article>
      <h1>Comment bien vaporiser du CBD ?</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          La vaporisation du CBD est une alternative plus saine à la combustion, permettant d&apos;inhaler les principes actifs du chanvre sans
          absorption de goudron ni d&apos;autres substances toxiques. Elle préserve le goût, maximise l&apos;effet d&apos;entourage et est plus
          économique. La température de vaporisation optimale varie entre 160°C et 220°C selon les effets recherchés. Quelques conseils sont donnés
          pour optimiser l&apos;expérience, comme bien préparer son CBD et utiliser un vaporisateur adapté.
        </p>
      </details>

      <h2>Qu’est-ce que la vaporisation du CBD ?</h2>

      <h3>Fonctionnement de la vaporisation de CBD</h3>
      <p>
        La vaporisation est une méthode où{" "}
        <mark>
          le CBD est chauffé doucement grâce à <a href={`https://www.monplancbd.fr/${locale}/vaporisateur/`}>un vaporisateur</a>
        </mark>
        . Plusieurs produits issus du chanvre peuvent être vaporisés : fleurs de CBD, hash, pollen... Grâce à ce processus, les{" "}
        <mark>principes actifs contenus dans le chanvre vont se libérer sous forme de vapeur</mark>. Lors de la vaporisation, le chanvre ne brûle pas.
        La structure végétale reste donc intacte.
      </p>
      <p>
        Lorsque le CBD est vaporisé, celui-ci est chauffé sans jamais atteindre 230°C, son point de combustion. De cette manière,{" "}
        <mark>aucun goudron issu de la combustion n’est absorbé par votre organisme</mark>, il n’y a pas d’émission toxique.
      </p>
      <p>
        Contrairement à la combustion qui génère des sous-produits nocifs, la vaporisation du CBD offre un <mark>goût particulièrement pur</mark> aux
        consommateurs. De manière générale, la vapeur de CBD est moins irritante que la fumée du CBD sous combustion.
      </p>
      <p>
        Enfin, la vaporisation du CBD permet de bénéficier des bienfaits de l’<dfn>effet d’entourage</dfn>, le fameux principe d’action en synergie de
        tous les composants présents dans le chanvre.
      </p>
      <p>
        <em>
          [Pour en savoir plus sur l’effet d’entourage, nous vous invitons à consulter notre article dédié à ce sujet{" "}
          <a href={`https://www.monplancbd.fr/${locale}/blog/quest-ce-que-leffet-dentourage/`}>en cliquant ici</a>!]
        </em>
      </p>

      <h3>Les avantages de la vaporisation de CBD par rapport à la combustion</h3>
      <p>
        Par rapport à la combustion, la <mark>vaporisation du CBD est beaucoup moins risquée pour la santé</mark> du consommateur. En effet, il y a
        95% de substances toxiques en moins absorbées par l’organisme lorsque le CBD est vaporisé.
      </p>
      <p>
        Ensuite, vaporiser du CBD est une <mark>option plus économique</mark> que la combustion. Pour obtenir le même effet, une quantité moindre de
        CBD est nécessaire en vaporisation comparée à la combustion. Cela s’explique par le fait que{" "}
        <mark>80% des principes actifs sont libérés et absorbés lors de la vaporisation du CBD contre seulement 20% si le chanvre est fumé</mark>.
      </p>

      <h2>Comment bien vaporiser du CBD ?</h2>

      <h3>À quelle température vaporiser du CBD ?</h3>
      <p>
        Dans la vaporisation, le <mark>bon réglage de la température</mark> joue un rôle important. Une bonne température de chauffe est comprise{" "}
        <mark>entre 160°C et 220°C</mark>. À partir de 230°C, le chanvre va commencer sa combustion, ce qu’il faut éviter.
      </p>
      <p>
        <strong>À 160°C</strong>, vous ressentirez une <mark>légère détente et une augmentation de votre concentration</mark>. À{" "}
        <strong>180°C</strong>, l’effet sera plus intense avec un <mark>léger effet stone</mark>. À <strong>190°C et au-delà</strong>, la vaporisation
        pourra aider à <mark>apaiser des douleurs</mark>.
      </p>

      <h3>Nos conseils pour une expérience de vaporisation optimale</h3>
      <ul>
        <li>
          <mark>Plus votre CBD sera sec, plus il se vaporisera efficacement</mark>.
        </li>
        <li>
          <mark>Inhalez doucement et régulièrement</mark>, inspirez jusqu’à remplir vos poumons à moitié puis retenez la vapeur quelques secondes.
        </li>
        <li>
          <mark>Préchauffez votre vaporisateur</mark> pendant une quinzaine de minutes avant d’y placer la fleur de votre choix.
        </li>
        <li>
          <mark>Effritez et répartissez uniformément</mark> le pollen de CBD dans votre vaporisateur.
        </li>
        <li>
          <mark>Ne mettez pas directement moonrocks et hash</mark> dans votre vaporisateur : utilisez de la fibre de chanvre dégommée.
        </li>
      </ul>

      <p>
        D’autres articles arrivent très vite sur la vaporisation du CBD, consultez{" "}
        <a href={`https://www.monplancbd.fr/${locale}/blog/`}>notre blog</a> régulièrement. Si vous avez d’autres questions, contactez-nous !
      </p>
      <p>
        Et pour trouver le <mark>vaporisateur CBD</mark> qui vous convient, rendez-vous sur{" "}
        <a href={`https://www.monplancbd.fr/${locale}/vaporisateur/`}>notre e-shop</a>.
      </p>
    </article>
  );
}
