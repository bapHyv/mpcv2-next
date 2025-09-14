import { useTranslations } from "next-intl";

interface Props {
  price: number;
}

export default function FidelityPointsEarned({ price }: Props) {
  const t = useTranslations("loyalty");
  const points = !isNaN(price) && price > 0 ? Math.floor(price) : 0;

  if (points <= 0) {
    return null;
  }

  return (
    <p className="text-center text-xs text-gray-600 mt-2">
      {t("earnPrefix")}{" "}
      <span className="font-semibold text-green">
        {new Intl.NumberFormat().format(points)} {t(points > 1 ? "pointsPlural" : "pointsSingular")}
      </span>{" "}
      {t("earnSuffix")}
    </p>
  );
}
