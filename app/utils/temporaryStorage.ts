interface StoredItem<T> {
  value: T;
  expiry: number;
}

export function setItemWithExpiry<T>(key: string, value: T, ttlInSeconds: number): void {
  if (typeof window === "undefined") {
    return;
  }

  const now = new Date();

  const item: StoredItem<T> = {
    value: value,
    expiry: now.getTime() + ttlInSeconds * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getItemWithExpiry<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const itemStr = localStorage.getItem(key);

  if (!itemStr) {
    return null;
  }

  try {
    const item: StoredItem<T> = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error("Error parsing item from localStorage:", error);
    localStorage.removeItem(key);
    return null;
  }
}
