import { useState, useCallback } from "react";

interface UseApiOptions extends RequestInit {
  immediate?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (url?: string, options?: RequestInit) => Promise<T | null>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useApi<T>(
  initialUrl?: string,
  initialOptions: UseApiOptions = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!initialOptions.immediate);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (url?: string, options?: RequestInit) => {
      setLoading(true);
      setError(null);
      const targetUrl = url || initialUrl;

      if (!targetUrl) {
        setLoading(false);
        return null;
      }

      try {
        const response = await fetch(targetUrl, {
          ...initialOptions,
          ...options,
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
        return jsonData;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [initialUrl, initialOptions]
  );

  useState(() => {
    if (initialOptions.immediate) {
      execute();
    }
  });

  return { data, loading, error, execute, setData };
}