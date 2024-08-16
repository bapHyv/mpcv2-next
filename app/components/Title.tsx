type TitleType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface Title {
  type: TitleType;
  title: string;
  classname?: string;
}

export default function Title({ type, title, classname }: Title) {
  switch (type) {
    case "h1":
      return <h1 className={classname}>{title}</h1>;
    case "h2":
      return <h2 className={classname}>{title}</h2>;
    case "h3":
      return <h3 className={classname}>{title}</h3>;
    case "h4":
      return <h4 className={classname}>{title}</h4>;
    case "h5":
      return <h5 className={classname}>{title}</h5>;
    case "h6":
      return <h6 className={classname}>{title}</h6>;
    default:
      return <h1 className={classname}>{title}</h1>;
  }
}
