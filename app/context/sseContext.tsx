import { createContext, ReactNode, useState, useContext, Dispatch, SetStateAction, useEffect, ChangeEvent } from "react";
import { useAlerts } from "@/app/context/alertsContext";
import { SSEData, SSEDataAPIResponse } from "@/app/types/sseTypes";

interface ISseContext {
  sseData: null | SSEData;
  setSseData: Dispatch<SetStateAction<null | SSEData>>;
}

const sseContext = createContext({} as ISseContext);

const baseUrl = "https://api.monplancbd.fr/test-sse";

export function SseProvider({ children }: { children: ReactNode }): JSX.Element {
  const [sseData, setSseData] = useState<null | SSEData>(null);
  const [value, setValue] = useState(100);

  const { addAlert } = useAlerts();

  useEffect(() => {
    const fetchSSEData = async () => {
      const response = await fetch(baseUrl);
      const data: SSEDataAPIResponse = await response.json();

      const transformedStocks: Record<string, number> = Object.entries(data.stocks).reduce((acc, [productId, stock]) => {
        if (stock !== null) {
          acc[productId] = Math.max(0, parseInt(stock));
        }
        return acc;
      }, {} as Record<string, number>);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  const handleSetStock = () => {
    setSseData((prevSSEData) => {
      if (prevSSEData) {
        return {
          ...prevSSEData,
          stocks: {
            ...prevSSEData.stocks,
            4658: value,
          },
        };
      } else {
        return null;
      }
    });
  };

  const handleRemoveStock = () => {
    setSseData((prevSSEData) => {
      if (prevSSEData) {
        return {
          ...prevSSEData,
          stocks: {
            ...prevSSEData.stocks,
            4658: 0,
          },
        };
      } else {
        return null;
      }
    });
  };

  return (
    <sseContext.Provider
      value={{
        sseData,
        setSseData,
      }}
    >
      {/* <div className="fixed bottom-14 bg-black w-full h-20 flex items-start gap-5 p-3">
        <input value={value} type="number" onChange={handleChange} />
        <button onClick={handleSetStock} className="text-xs px-3 py-2 bg-blue-600 uppercase text-white rounded-md hover:bg-blue-500">
          Set stock
        </button>
        <button onClick={handleRemoveStock} className="text-xs px-3 py-2 bg-red-600 uppercase text-white rounded-md hover:bg-red-500">
          Remove stock
        </button>
      </div> */}
      {children}
    </sseContext.Provider>
  );
}

export function useSse() {
  return useContext(sseContext);
}

export default sseContext;
