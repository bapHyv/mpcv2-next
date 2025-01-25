import {
  createContext,
  ReactNode,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useAlerts } from "@/app/context/alertsContext";

interface SSEDataAPIResponse {
  stocks: Record<string, string | null>;
  coupons: Record<string, Coupon>;
  shippingMethods: ShippingMethods;
}

interface SSEData {
  stocks: Record<string, number>;
  coupons: Record<string, Coupon>;
  shippingMethods: ShippingMethods;
}

interface Coupon {
  linkedToUser: boolean;
  individualUse: boolean;
  discountType: "percent" | "fixed_cart" | "fixed_product";
  discountValue: string;
  freeShipping: boolean;
  excludePromoProduct?: boolean;
  maxUsage: number;
  maxUsageByUser: number;
  nbItemsLimit?: number;
  requiredProducts: string[];
  requiredCategories: number[];
  excludedProducts: string[];
  excludedCategories: number[];
  totalUsage: number;
  maxCartAmount?: string;
  minCartAmount?: string;
}

interface ShippingMethods {
  byShippingZones: Record<string, ShippingZone>;
  byId: Record<string, ShippingMethod>;
}

interface ShippingZone {
  zone_id: number;
  name: string;
  methods: ShippingMethod[];
}

interface ShippingMethod {
  instanceId: number;
  id: string;
}

interface ISseContext {
  sseData: null | SSEData;
  setSseData: Dispatch<SetStateAction<null | SSEData>>;
}

const sseContext = createContext({} as ISseContext);

const baseUrl = "https://api.monplancbd.fr/test-sse";

export function SseProvider({ children }: { children: ReactNode }): JSX.Element {
  const [sseData, setSseData] = useState<null | SSEData>(null);

  const { addAlert } = useAlerts();

  useEffect(() => {
    const fetchSSEData = async () => {
      const response = await fetch(baseUrl);
      const data: SSEDataAPIResponse = await response.json();

      const transformedStocks: Record<string, number> = Object.entries(data.stocks).reduce(
        (acc, [productId, stock]) => {
          if (stock !== null) {
            acc[productId] = Math.max(0, parseInt(stock));
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const sseData: SSEData = {
        stocks: transformedStocks,
        coupons: data.coupons,
        shippingMethods: data.shippingMethods,
      };

      setSseData(sseData);
    };

    fetchSSEData();
  }, []);

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
