import {
  createContext,
  ReactNode,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useAlerts } from "@/app/context/alertsContext";

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
    341: 234,
    342: 234,
    346: 234,
    4658: 234,
    5679: 234,
    6416: 234,
    8139: 234,
    8575: 234,
    16762: 234,
    18033: 234,
    18061: 234,
    18601: 234,
    18614: 234,
    18647: 234,
    18967: 234,
    18986: 234,
    18993: 234,
    19547: 234,
    20274: 234,
    20494: 234,
    20670: 234,
    20798: 234,
    20891: 234,
    20904: 234,
    21103: 234,
    21226: 234,
    21477: 234,
    21491: 234,
    21502: 234,
    21644: 234,
    21850: 234,
    21865: 234,
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
