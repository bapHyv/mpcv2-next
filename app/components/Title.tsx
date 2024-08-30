type TitleType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface Title {
  type: TitleType;
  title: string;
  classname?: string;
  firstLetterClassname?: string;
}

export default function Title({
  type,
  title,
  classname,
  firstLetterClassname,
}: Title) {
  switch (type) {
    case "h1":
      return (
        <h1 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h1>
      );
    case "h2":
      return (
        <h2 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h2>
      );
    case "h3":
      return (
        <h3 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h3>
      );
    case "h4":
      return (
        <h4 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h4>
      );
    case "h5":
      return (
        <h5 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h5>
      );
    case "h6":
      return (
        <h6 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h6>
      );
    default:
      return (
        <h1 className={classname}>
          <span className={firstLetterClassname}>{title.substring(0, 1)}</span>
          {title.substring(1, title.length)}
        </h1>
      );
  }
}
