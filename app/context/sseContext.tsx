import { createContext, ReactNode, useState, useContext, Dispatch, SetStateAction, useEffect, ChangeEvent } from "react";
import { SSEData } from "@/app/types/sseTypes";

interface ISseContext {
  sseData: null | SSEData;
  setSseData: Dispatch<SetStateAction<null | SSEData>>;
}

const sseContext = createContext({} as ISseContext);

export function SseProvider({ children }: { children: ReactNode }): JSX.Element {
  const [sseData, setSseData] = useState<null | SSEData>(null);

  useEffect(() => {
    const eventSource = new EventSource("https://api.monplancbd.fr/new-sse-client");

    eventSource.onopen = () => {
      console.log("connexion opened successfully");
    };

    eventSource.onerror = (e) => {
      console.error(e);
    };

    eventSource.addEventListener("metadata", (event: MessageEvent<string>) => {
      const sseData: SSEData = JSON.parse(event.data);
      setSseData(sseData);
    });

    eventSource.addEventListener("updateStocks", (event: MessageEvent<string>) => {
      const stockData: Record<string, number> = JSON.parse(event.data);
      setSseData((prevState) => {
        if (prevState) {
          return { ...prevState, stocks: Object.assign(prevState?.stocks, stockData) };
        } else {
          return null;
        }
      });
    });

    return () => eventSource.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
