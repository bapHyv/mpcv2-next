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
      <h1>Comment bien choisir son huile au CBD ?</h1>
      <details>
        <summary>Résumé</summary>
        <p>
          L&apos;huile au CBD est une des méthodes de consommation les plus simples et adaptées à tous. Cet article vous guide pour bien choisir votre
          huile en abordant le dosage, la composition, la méthode de consommation et d&apos;autres critères importants tels que l&apos;origine du
          chanvre, les analyses de CBD/THC, la concentration et le prix.
        </p>
      </details>

      <p>
        L&apos;huile au CBD est sûrement la méthode de consommation de CBD la plus simple. Elle est adaptée à toutes et à tous et ses effets sont
        appréciés des utilisateurs. Dans cet article, nous allons vous donner des conseils pour bien choisir votre huile, car il est très facile de se
        perdre face à la diversité de produits et de marques qui s&apos;offrent à vous.
      </p>

      <h2>Le dosage</h2>
      <p>
        Lorsque l&apos;on prend de l&apos;huile au CBD, c&apos;est dans la majorité des cas pour soulager des maux ou pour se relaxer. Il est
        important de trouver un dosage adapté. Pour ceci, nous vous conseillons{" "}
        <b>
          <a href="https://calculer-dosage-cbd.com/" target="_blank" rel="noopener">
            ce calculateur
          </a>
        </b>
        . Il a été réalisé à partir des travaux de <dfn>Leonardo Leinow</dfn> et <dfn>Juliana Birnbaum</dfn>, deux spécialistes qui étudient et
        expérimentent le cannabis médical depuis plus de trente ans.
      </p>

      <h2>La composition</h2>
      <p>Il existe deux types d&apos;huile au CBD :</p>
      <ul>
        <li>
          Les huiles faites avec de <b>l&apos;isolat de CBD</b>
        </li>
        <li>
          Les huiles <b>d&apos;extrait de chanvre</b>
        </li>
      </ul>

      <h3>Les huiles à l&apos;isolat de CBD</h3>
      <p>
        Elles sont composées de <b>cristaux de CBD</b> purs (en général au-delà de 98%) et d&apos;une base d&apos;huile végétale. Ces huiles ont une
        composition très simple et sont connues pour être très pures.
      </p>

      <h3>Les huiles aux extraits de chanvre</h3>
      <p>
        Également composées d&apos;une base d&apos;huile végétale, ces mixtures ont la particularité d&apos;être plus <mark>naturelles</mark>. En
        effet, les extraits de <b>chanvre</b> utilisés sont directement issus de la plante et contiennent donc du <b>CBD</b> mais également beaucoup
        d&apos;autres <b>cannabinoïdes</b> ainsi que des <b>terpènes</b>. Grâce à la présence de tous ces composés naturels qui agissent entre eux,
        les effets qu&apos;offre cette huile sont plus appréciés et plus importants.
      </p>

      <h3>L&apos;huile végétale</h3>
      <p>
        Il faut garder à l&apos;esprit que ces huiles ont toutes une base d&apos;huile végétale. Elles peuvent être à base d&apos;huile de graine de
        chanvre mais également d&apos;huile d&apos;olive. Il existe aussi des bases végétales plus originales comme l&apos;huile de graine de courge.
      </p>

      <h2>La méthode de consommation</h2>
      <p>
        Les huiles au CBD sont contenues dans des <b>fioles</b>. Le <b>bouchon</b> de ces fioles est en fait une <b>pipette compte-gouttes</b> qui
        rend le <b>dosage</b> extrêmement précis. Ces huiles sont destinées à une consommation par voie <b>sublinguale</b>. Il suffit de déposer les
        gouttes sous la langue et de patienter entre <b>30 et 60 secondes</b> avant d&apos;avaler. Cette méthode permet une meilleure absorption du
        CBD. Certaines personnes trouvent que le goût de l&apos;huile est acide, mais rassurez-vous, il est tout à fait possible de boire une gorgée
        d&apos;eau en même temps que l&apos;huile pour faire disparaître le goût.
      </p>

      <h2>Les critères supplémentaires à considérer</h2>
      <p>
        Nous avons détaillé les trois grandes étapes pour vous aider à choisir l&apos;huile au CBD qui vous conviendra le mieux. Il y a également
        quatre autres choses à garder à l&apos;esprit lorsque vous achetez de l&apos;huile :
      </p>
      <ul>
        <li>
          <b>L&apos;origine du chanvre :</b> Il est important de savoir d&apos;où vient le chanvre pour éviter de consommer de l&apos;huile polluée
          par des pesticides ou des substances toxiques.
        </li>
        <li>
          <b>Les analyses CBD/THC :</b> Des analyses récentes doivent être fournies avec le produit pour prouver qu&apos;il n&apos;y a pas de THC afin
          d&apos;être en accord avec la législation française.
        </li>
        <li>
          <b>La concentration :</b> Il est toujours conseillé de commencer par un dosage bas (5 ou 10%).
        </li>
        <li>
          <b>Le prix :</b> Un prix trop bas reflète dans la majorité des cas un produit de mauvaise qualité dont nous déconseillons la consommation.
        </li>
      </ul>

      <div className="flex flex-wrap gap-x-3 mt-4">
        <figure>
          <a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/huile-fullspectrum/`}>
            <Image width="300" height="300" src="https://www.monplancbd.fr/wp-content/uploads/2020/08/H5_2.jpg" alt="CBD huile 5%" loading="lazy" />
          </a>
          <figcaption>Huile 5%</figcaption>
        </figure>
        <figure>
          <a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/huile-full-spectrum-10/`}>
            <Image width="300" height="300" src="https://www.monplancbd.fr/wp-content/uploads/2020/08/H10_3.jpg" alt="Huile CBD 10%" loading="lazy" />
          </a>
          <figcaption>Huile 10%</figcaption>
        </figure>
        <figure>
          <a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/huile-full-spectrum-20/`}>
            <Image width="300" height="300" src="https://www.monplancbd.fr/wp-content/uploads/2020/08/H20_3.jpg" alt="Huile CBD 20%" loading="lazy" />
          </a>
          <figcaption>Huile 20%</figcaption>
        </figure>
        <figure>
          <a href={`https://www.monplancbd.fr/${locale}/huiles-cbd/huile-broad-spectrum-30/`}>
            <Image
              width="300"
              height="300"
              src="https://www.monplancbd.fr/wp-content/uploads/2020/09/Huile_30-300x300.jpg"
              alt="Huile 30 % de CBD"
              loading="lazy"
            />
          </a>
          <figcaption>Huile 30%</figcaption>
        </figure>
      </div>
    </article>
  );
}
