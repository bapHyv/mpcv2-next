export async function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "es" }];
}

export default function Page() {
  return (
    <article>
      <h1>Légalisation du cannabis médical en Ukraine</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          L&apos;Ukraine envisage sérieusement la légalisation du cannabis à usage médical. Après un premier projet de loi rejeté en 2021, une
          nouvelle version est soutenue par le ministère de la santé ukrainien. Cette légalisation vise à encadrer strictement la culture et la
          distribution du cannabis à des fins médicales, industrielles et scientifiques, en mettant en place des mesures de traçabilité et de contrôle
          rigoureuses. Le cannabis récréatif reste interdit.
        </p>
      </details>
      <p>
        Pendant des siècles, l’Ukraine a cultivé du chanvre et a notamment produit de l’huile de chanvre, du tissu… Puis, comme dans beaucoup de pays,
        les plantes issues du genre <dfn>Cannabis</dfn> et les consommateurs de chanvre ont été décriés. En 2020, Volodymyr Zelensky, alors candidat à
        la présidence ukrainienne, avait mené un sondage national portant sur le cannabis thérapeutique : 65% des sondés étaient favorables à l’usage
        du cannabis médical pour soulager les douleurs des malades du cancer en phase terminale, 29% s’y opposaient. Aujourd’hui, si son pays est en
        guerre, <mark>le gouvernement ukrainien envisage sérieusement la légalisation du cannabis</mark> et mesure l’intérêt de cette plante de la
        famille des Cannabaceae.
      </p>

      <h2>Légalisation du cannabis médical en Ukraine, contexte</h2>
      <p>
        En <mark>2021</mark>, après plus de deux ans de travail, des députés et représentants du secteur public ukrainiens avaient déposé un{" "}
        <mark>premier projet de loi portant sur la légalisation du cannabis à usage médical</mark>. Toutefois, ce premier texte avait été rejeté par
        le parlement. A présent, le ministère de la santé ukrainien s’est officiellement présenté comme un soutien à ce projet de loi.
      </p>
      <p>
        Le texte présenté concerne la{" "}
        <mark>
          circulation des plantes issues du genre <dfn>Cannabis</dfn> pour un usage médical, industriel et scientifique
        </mark>
        . En outre, ce texte élargit les<strong> conditions d’accès au cannabis thérapeutique</strong> pour des patients nécessitant un traitement de
        certains cancers ou de troubles de stress post-traumatique.
      </p>
      <p>
        Avec la guerre actuelle en Ukraine, le ministère de la santé ukrainien réalise l’
        <mark>intérêt thérapeutique du cannabis thérapeutique pour soulager les pathologies traumatiques</mark> que rencontrent de nombreux citoyens
        victimes du conflit armé. La volonté ministérielle est de ne pas perdre de temps avec la légalisation du cannabis, même si l’Ukraine est en
        état de guerre.
      </p>

      <h2>Que prévoit le projet de loi de légalisation du cannabis ?</h2>
      <p>
        <strong>
          L’Ukraine entend encadrer la culture des plantes du genre <dfn>Cannabis</dfn>
        </strong>{" "}
        ainsi que leur transformation afin de maîtriser la totalité de la production. Prenant en compte l’échec du premier projet de loi présenté en
        juillet 2021, la nouvelle version propose donc des mesures de contrôle strictes :
      </p>
      <ul>
        <li>Des licences sont délivrées pour la culture du cannabis médical.</li>
        <li>
          L’autorisation de culture concerne un nombre précis de variétés du genre <dfn>Cannabis</dfn>.
        </li>
        <li>Le projet de loi fixe de hautes exigences en matière de traçabilité pour les variétés de cannabis cultivées et commercialisées.</li>
        <li>Le chanvre et le CBD sortent du spectre des substances contrôlées.</li>
        <li>
          Les importations de cannabis sont soutenues grâce à la suppression temporaire des quotas d’importation. A terme, le but étant de pouvoir
          compter sur la seule production ukrainienne.
        </li>
      </ul>

      <h2>Encadrement strict du cannabis médical en Ukraine</h2>
      <p>
        Selon ce projet de loi ukrainien,{" "}
        <strong>le cannabis médical pourra être utilisé à condition que l’intégralité des éléments suivants soient respectés</strong> :
      </p>
      <ul>
        <li>
          L’usage médical du cannabis se fera exclusivement <strong>sous forme de médicament</strong> contenant du cannabis.
        </li>
        <li>
          Les médicaments contenant du cannabis seront délivrés uniquement sur présentation d’une <strong>prescription médicale</strong>.
        </li>
        <li>
          Pour la <strong>traçabilité</strong>, plusieurs exigences seront à appliquer comme le marquage spécifique des lots de médicaments au
          cannabis et le conditionnement avec un code unique.
        </li>
        <li>Les patients ne pourront pas stocker chez eux plus que la quantité de médicaments au cannabis prescrite par leur médecin.</li>
      </ul>
      <p>
        Si ce projet de loi doit d’abord être approuvé par au moins 226 voix au parlement ukrainien, le remaniement du texte associé au soutien du
        Ministère de la santé ukrainien peut laisser présager de <mark>belles perspectives pour le cannabis médical en Ukraine</mark>. Le cannabis
        récréatif, quant à lui, n’est pas concerné par la légalisation.
      </p>
    </article>
  );
}
