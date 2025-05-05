"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction } from "react";
import {
  ConsentState,
  ConsentCategory,
  getConsentState as getConsentStateFromUtil,
  setConsentState as setConsentStateInUtil,
  setAllConsent as setAllConsentInUtil,
} from "@/app/utils/consent";

interface ConsentContextType {
  consentState: ConsentState;
  setConsent: (category: ConsentCategory, value: boolean) => void;
  setAllCategoriesConsent: (value: boolean) => void;
  isLoadingConsent: boolean;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentProviderProps {
  children: ReactNode;
}

export const ConsentProvider = ({ children }: ConsentProviderProps) => {
  const [consentState, setConsentStateInternal] = useState<ConsentState>({
    functional: false,
    analytics: false,
  });
  const [isLoadingConsent, setIsLoadingConsent] = useState(true);

  useEffect(() => {
    const initialConsent = getConsentStateFromUtil();
    setConsentStateInternal(initialConsent);
    setIsLoadingConsent(false);
  }, []);

  const setConsent = useCallback((category: ConsentCategory, value: boolean) => {
    setConsentStateInUtil(category, value);
    setConsentStateInternal((prevState) => ({
      ...prevState,
      [category]: value,
    }));
  }, []);

  const setAllCategoriesConsent = useCallback((value: boolean) => {
    setAllConsentInUtil(value);
    setConsentStateInternal({
      functional: value,
      analytics: value,
    });
  }, []);

  const contextValue: ConsentContextType = {
    consentState,
    setConsent,
    setAllCategoriesConsent,
    isLoadingConsent,
  };

  return <ConsentContext.Provider value={contextValue}>{children}</ConsentContext.Provider>;
};

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
};
