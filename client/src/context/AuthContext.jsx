/* Provider quan ly token, user va dong bo localStorage */
import { useCallback, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/auth.service";
import { getMyProfile } from "../services/user.service";
import { AuthContext } from "./auth-context";
const STORAGE_KEY = "travel-web-auth";

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setAuthLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setToken(parsed.token || "");
      setUser(parsed.user || null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token,
        user,
      })
    );
  }, [token, user]);

  const handleLogin = useCallback(async (payload) => {
    const data = await loginUser(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const handleRegister = useCallback(async (payload) => {
    const data = await registerUser(payload);
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;

    const data = await getMyProfile(token);
    setUser(data.user);
    return data.user;
  }, [token]);

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      authLoading,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      login: handleLogin,
      register: handleRegister,
      logout,
      refreshProfile,
      setUser,
    }),
    [token, user, authLoading, handleLogin, handleRegister, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
