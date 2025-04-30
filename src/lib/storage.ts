// Utility functions for localStorage

/**
 * Saves data to localStorage.
 * @param key The key under which to store the data.
 * @param value The data to store (will be JSON.stringified).
 */
export function saveData<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
  }
}

/**
 * Loads data from localStorage.
 * @param key The key of the data to retrieve.
 * @param defaultValue The default value to return if the key doesn't exist or an error occurs.
 * @returns The retrieved data or the default value.
 */
export function loadData<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return defaultValue;
      }
      return JSON.parse(storedValue) as T;
    } catch (error) {
      console.error(`Error loading data from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  }
  return defaultValue;
}

/**
 * Removes data from localStorage.
 * @param key The key of the data to remove.
 */
export function removeData(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data from localStorage for key "${key}":`, error);
    }
  }
}
