"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from "react";

interface ClickOutsideContext {
  ref: MutableRefObject<HTMLElement | null>;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const clickOutsideContext = createContext({} as ClickOutsideContext);

export function ClickOutsideProvider({ children }: { children: ReactNode }): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      if (isVisible) {
        setIsVisible(false);
      }
      console.log("triggered");
      console.log({ isVisible });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <clickOutsideContext.Provider value={{ ref, isVisible, setIsVisible }}>
      {children}
    </clickOutsideContext.Provider>
  );
}

export function useClickOutside() {
  return useContext(clickOutsideContext);
}

export default clickOutsideContext;
