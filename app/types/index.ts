// ------ DROPDOWN BEGIN ------

import { ReactElement } from "react";

export interface IDropdownItem {
  //   icon: any;
  text: string;
  href: string;
}

export interface IDropdown {
  locale: string;
  button: ReactElement;
  items: IDropdownItem[];
}

// ------ DROPDOWN END------
