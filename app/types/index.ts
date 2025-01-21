// ------ DROPDOWN BEGIN ------

import { ReactElement } from "react";

export interface IDropdownItem {
  text?: string;
  href?: string;
  icon?: any;
  onClick?: string;
}

export interface IDropdown {
  locale: string;
  button: ReactElement;
  items: IDropdownItem[];
  menuButtonClassname?: string;
  menuItemsClassname?: string;
  menuClassname?: string;
}

// ------ DROPDOWN END------
