import { useState, useEffect, useCallback, useRef } from "react";
import { pincodeApi } from "../api";

// Generic async hook
function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFn(...args);
      if (mountedRef.current) setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      if (mountedRef.current) setState({ data: null, loading: false, error: err.message });
    }
  }, deps);

  return { ...state, execute };
}

// Hook: fetch all pincodes with filters
export function usePincodes(params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const res = await pincodeApi.getPincodes(p);
      setData(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(params);
  }, [JSON.stringify(params)]);

  return { data, loading, error, refetch: fetch };
}

// Hook: lookup single pincode
export function usePincodeLookup() {
  return useAsync((pin) => pincodeApi.getPincode(pin));
}

// Hook: search by area
export function useAreaSearch() {
  return useAsync((q) => pincodeApi.searchByArea(q));
}

// Hook: fetch zones
export function useZones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pincodeApi.getZones().then(setData).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

// Hook: stats
export function useStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pincodeApi.getStats().then(setData).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

// Hook: debounced value
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Hook: clipboard copy
export function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = useCallback((text, key = text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }, []);
  return { copy, copiedKey };
}
