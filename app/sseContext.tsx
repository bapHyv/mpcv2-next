import {
  createContext,
  ReactNode,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Prices } from "@/app/types/productsTypes";
import { useAlerts } from "./alertsContext";
import { v4 as uuid } from "uuid";

const fakeSseData = {
  coupons: {
    aurelie10: {
      linkedToUser: false,
      individualUse: false,
      discountType: "fixed_cart",
      discountValue: "10",
    },
    carole5: {
      linkedToUser: true,
      individualUse: false,
      discountType: "fixed_cart",
      discountValue: "5",
    },
  },
  stocks: {
    341: 46,
    342: 11,
    346: 40,
    4658: 750,
    6416: 136,
    8575: 4,
    16762: 90,
    17334: 20,
    18061: 15,
    18601: 36,
    18614: 42,
    18647: 6,
    18919: 100,
    19547: 95,
    20274: 0,
    20385: 396,
    20460: 1667,
    20494: 47,
    20798: 230,
    20891: 220,
    20904: 720,
    21103: 435,
    21216: 0,
    21226: 475,
    21335: 1465,
    21419: 180,
  },
  shippingMethods: {
    "France (hors Corse)": {
      zone_id: 2,
      name: "France (hors Corse)",
      methods: [
        { instanceId: 6, id: "boxtal_connect" },
        { instanceId: 65, id: "local_pickup" },
        { instanceId: 8, id: "free_shipping" },
        { instanceId: 7, id: "flat_rate" },
      ],
    },
  },
};

interface IDiscountCode {
  [code: string]: {
    linkedToUser: boolean;
    individualUse: boolean;
    discountType: string;
    discountValue: string;
  };
}

interface IProductStock {
  [productId: number | string]: number;
}

interface IShippingMethods {
  [method: string]: {
    zone_id: number;
    name: string;
    methods: { instanceId: number; id: string }[];
  };
}

interface ISseData {
  coupons: IDiscountCode;
  stocks: IProductStock;
  shippingMethods: IShippingMethods;
}

interface ISseContext {
  sseData: ISseData;
  setSseData: Dispatch<SetStateAction<ISseData>>;
}

const sseContext = createContext({} as ISseContext);

export function SseProvider({ children }: { children: ReactNode }): JSX.Element {
  const [sseData, setSseData] = useState<ISseData>(fakeSseData as ISseData);

  const { addAlert } = useAlerts();

  // useEffect(() => {
  //   const eventSource = new EventSource("https://api.monplancbd.fr/new-sse-client");

  //   eventSource.onopen = () => {
  //     console.log("Connection with the SSE opened");
  //   };

  //   eventSource.onerror = (e) => {
  //     //   addAlert(uuid(), e.type, "Error in SSE", "red");
  //     console.error(e);
  //   };

  //   eventSource.onmessage = (e) => {
  //     console.log(e.data);
  //   };

  //   return () => eventSource.close();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <sseContext.Provider
      value={{
        sseData,
        setSseData,
      }}
    >
      {children}
    </sseContext.Provider>
  );
}

export function useSse() {
  return useContext(sseContext);
}

export default sseContext;
