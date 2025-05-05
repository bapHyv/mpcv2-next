export interface ConsentState {
  functional: boolean;
  analytics: boolean;
}

export type ConsentCategory = keyof ConsentState;

const localStorageKey = "user_consent_preferences_v1";

const defaultConsentState: ConsentState = {
  functional: false,
  analytics: false,
};

/**
 * Retrieves the current consent state from localStorage.
 * Returns default state (all false) if no consent has been saved yet or if localStorage is unavailable.
 * @returns {ConsentState} The current consent state.
 */
export function getConsentState(): ConsentState {
  if (typeof window === "undefined" || !window.localStorage) {
    console.warn("localStorage not available. Returning default consent state.");
    return { ...defaultConsentState };
  }

  try {
    const storedState = localStorage.getItem(localStorageKey);
    if (storedState) {
      const parsedState = JSON.parse(storedState);

      if (
        typeof parsedState === "object" &&
        parsedState !== null &&
        typeof parsedState.functional === "boolean" &&
        typeof parsedState.analytics === "boolean"
      ) {
        return { ...defaultConsentState, ...parsedState };
      } else {
        console.warn("Invalid consent state found in localStorage. Resetting to default.");
        localStorage.removeItem(localStorageKey);
        return { ...defaultConsentState };
      }
    }
  } catch (error) {
    console.error("Error reading consent state from localStorage:", error);
  }

  return { ...defaultConsentState };
}

/**
 * Updates the consent state for a specific category in localStorage.
 * @param {ConsentCategory} category - The category to update ('functional' or 'analytics').
 * @param {boolean} value - The new consent value (true or false).
 */
export function setConsentState(category: ConsentCategory, value: boolean): void {
  if (typeof window === "undefined" || !window.localStorage) {
    console.warn("localStorage not available. Cannot set consent state.");
    return;
  }

  try {
    const currentState = getConsentState();
    const newState: ConsentState = {
      ...currentState,
      [category]: value,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(newState));
    // Optional: Dispatch a custom event to notify other parts of the app
    // window.dispatchEvent(new CustomEvent('consentChanged', { detail: newState }));
  } catch (error) {
    console.error("Error setting consent state in localStorage:", error);
  }
}

/**
 * Sets all consent categories to the same value (true for Accept All, false for Reject All).
 * @param {boolean} value - The value to set for all categories.
 */
export function setAllConsent(value: boolean): void {
  if (typeof window === "undefined" || !window.localStorage) {
    console.warn("localStorage not available. Cannot set all consent.");
    return;
  }

  try {
    const newState: ConsentState = {
      functional: value,
      analytics: value,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(newState));
    // Optional: Dispatch a custom event
    // window.dispatchEvent(new CustomEvent('consentChanged', { detail: newState }));
  } catch (error) {
    console.error("Error setting all consent states in localStorage:", error);
  }
}

/**
 * Checks if the user has made any consent choice (i.e., if consent data exists in localStorage).
 * @returns {boolean} True if consent has been set previously, false otherwise.
 */
export function hasConsentBeenSet(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  return localStorage.getItem(localStorageKey) !== null;
}
