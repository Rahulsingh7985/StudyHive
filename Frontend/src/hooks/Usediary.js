import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useDiary = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Helper: wraps every API call with consistent error handling
  const apiCall = useCallback(
    async (method, endpoint, body = null) => {
      setLoading(true);
      setError(null);
      try {
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(`${BASE_URL}/api/diary${endpoint}`, options);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const getEntries = useCallback(
    (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiCall("GET", query ? `?${query}` : "");
    },
    [apiCall]
  );

  const getEntryById = useCallback((id) => apiCall("GET", `/${id}`), [apiCall]);

  const createEntry = useCallback((body) => apiCall("POST", "", body), [apiCall]);

  const updateEntry = useCallback((id, body) => apiCall("PUT", `/${id}`, body), [apiCall]);

  const deleteEntry = useCallback((id) => apiCall("DELETE", `/${id}`), [apiCall]);

  const togglePin = useCallback((id) => apiCall("PATCH", `/${id}/pin`), [apiCall]);

  return { loading, error, getEntries, getEntryById, createEntry, updateEntry, deleteEntry, togglePin };
};