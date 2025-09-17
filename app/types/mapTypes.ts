type ParcelPointNetworkCode = "MONR_NETWORK" | "CHRP_NETWORK" | "UPSE_NETWORK" | "SOGP_NETWORK" | "DHLE_NETWORK" | "COPR_NETWORK";
type Anchor = "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
interface ParcelPointNetwork {
  code: ParcelPointNetworkCode;
  markerTemplate?: {
    anchor: Anchor;
    element?: HTMLElement | null;
    color?: string;
  };
}
type AvailableLang = "en" | "fr";
interface MapConfig {
  locale?: AvailableLang;
  parcelPointNetworks: ParcelPointNetwork[];
  options: {
    autoSelectNearestParcelPoint: boolean;
    primaryColor: string;
  };
}
interface MapOptions {
  debug?: boolean;
  domToLoadMap: string;
  baseUrl?: string;
  accessToken: string;
  config?: MapConfig;
  onMapLoaded?: () => void;
}
interface Address {
  country: string;
  zipCode: string;
  city: string;
  street?: string;
}
type Location = Address & {
  position: {
    latitude: number;
    longitude: number;
  };
};
type OpeningPeriods = {
  closingTime: string;
  openingTime: string;
};
interface OpeningDays {
  weekday: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
  openingPeriods: OpeningPeriods[];
}
interface ParcelPoint {
  code: string;
  location: Location;
  name: string;
  network: ParcelPointNetworkCode;
  openingDays: OpeningDays[];
}
interface ParcelPointAndDistance {
  distanceFromSearchLocation: number;
  parcelPoint: ParcelPoint;
}

declare class BoxtalParcelPointMap {
  private options;
  private config;
  private debug;
  private domToLoadMap;
  private baseUrl;
  private accessToken;
  private eventPrefix;
  private communicationWindow;
  private registeredEvents;
  private iframeName;
  private iframeElm;
  private onMapLoaded;
  constructor(opts: MapOptions);
  private log;
  private getIframeName;
  private createMapIframe;
  private buildEventName;
  private messageListener;
  private initialize;
  private sendCallbackEvent;
  private removeCallbackEvent;
  onSearchParcelPointsResponse(callback: (parcelPointsResponse: ParcelPointAndDistance[]) => void): void;
  searchParcelPoints(address: Address, callback: (selectedParcelPoint: ParcelPoint) => void): void;
  clearParcelPoints(): void;
  chooseParcelPoint(parcelPoint: ParcelPoint): void;
  updateConfig(config: MapConfig): void;
}

export {
  type Address,
  type Anchor,
  type AvailableLang,
  BoxtalParcelPointMap,
  type Location,
  type MapConfig,
  type MapOptions,
  type OpeningDays,
  type OpeningPeriods,
  type ParcelPoint,
  type ParcelPointAndDistance,
  type ParcelPointNetwork,
  type ParcelPointNetworkCode,
};

export interface BoxtalAuthResponse {
  expiresIn: number;
  tokenType: string;
  accessToken: string;
}
