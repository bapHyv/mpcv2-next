"use client";

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";
import {
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";

import { v4 as uuid } from "uuid";

interface AlertsContext {
  addAlert: (
    alertId: string,
    description: string,
    title: string,
    color: color
  ) => void;
}

const alertsContext = createContext({} as AlertsContext);

type color = "emerald" | "yellow" | "blue" | "red";

interface IAlertElement {
  alertId: string;
  description: string;
  title: string;
  color: color;
}

function AlertElement({ alertId, color, description, title }: IAlertElement) {
  return (
    <div
      id={alertId}
      className={`rounded-r-md bg${color}50 border-l-4 border${color}400 p-4 animate-slideinright`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            aria-hidden="true"
            className={`h-5 w-5 text${color}400`}
          />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium text${color}800`}>{title}</h3>
          <div className={`mt-2 text-sm text${color}700`}>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!!alerts.length) {
      const timeoutId = setTimeout(() => {
        const _alerts = alerts.slice(0, alerts.length - 1);
        setAlerts([..._alerts]);
      }, 1750);
      console.log("Timeout in useEffect in alertContext");
      return () => clearTimeout(timeoutId);
    }
  }, [alerts]);

  const addAlert = (
    alertId: string,
    description: string,
    title: string,
    color: color
  ) => {
    const element = (
      <AlertElement
        key={alertId}
        alertId={alertId}
        description={description}
        title={title}
        color={color}
      />
    );
    setAlerts((prevState) => [...prevState, element]);
  };

  console.log("In alerts context");

  return (
    <alertsContext.Provider
      value={{
        addAlert,
      }}
    >
      <>
        {children}
        <div className="w-4/5 sm:w-3/5 xl:w-2/5 fixed right-5 top-5 flex flex-col gap-5">
          {alerts}
        </div>
      </>
    </alertsContext.Provider>
  );
}

export function useAlerts() {
  return useContext(alertsContext);
}

export default alertsContext;
