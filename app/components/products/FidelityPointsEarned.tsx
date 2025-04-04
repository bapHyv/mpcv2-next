interface Props {
  price: number;
}

export default function FidelityPointsEarned({ price }: Props) {
  const points = !!price ? Math.floor(price) : 0;

  return (
    <p className="text-center my-6">
      ✨ Vous gagnerez{" "}
      <span className="text-green">
        {points.toFixed(0)} point{points > 1 && "s"}
      </span>{" "}
      de fidélité ✨
    </p>
  );
}
