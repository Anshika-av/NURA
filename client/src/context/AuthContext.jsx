import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  authApi,
  userApi,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  setUnauthorizedHandler,
} from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    removeStoredToken();
    try {
      localStorage.removeItem("nura_user");
    } catch {
      // Ignore storage restrictions
    }
    setUser(null);
  }, []);

  // Sync token expiry from centralized API client (e.g. 401 from backend)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [logout]);

  // Initial persistent authentication check on app load
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        // Validate saved token with backend GET /users/me
        const response = await userApi.getProfile();

        if (isMounted) {
          if (response?.data) {
            setUser(response.data);
            try {
              localStorage.setItem("nura_user", JSON.stringify(response.data));
            } catch {
              // Ignore storage errors
            }
          } else {
            removeStoredToken();
            try {
              localStorage.removeItem("nura_user");
            } catch {
              // Ignore storage errors
            }
            setUser(null);
          }
        }
      } catch (err) {
        if (!isMounted) return;

        // If unauthorized or forbidden, the token is invalid/expired
        if (err.status === 401 || err.status === 403) {
          removeStoredToken();
          try {
            localStorage.removeItem("nura_user");
          } catch {
            // Ignore storage errors
          }
          setUser(null);
        } else {
          // On network errors (err.status === 0), do not abruptly wipe token
          // Attempt to hydrate from cached user data if available
          try {
            const cached = localStorage.getItem("nura_user");
            if (cached) {
              setUser(JSON.parse(cached));
            } else {
              setUser(null);
            }
          } catch {
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials);

    if (response?.data?.token) {
      setStoredToken(response.data.token);

      if (response.data.user) {
        setUser(response.data.user);
        try {
          localStorage.setItem("nura_user", JSON.stringify(response.data.user));
        } catch {
          // Ignore storage errors
        }
      }
    }

    return response;
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authApi.register(userData);

    if (response?.data?.token) {
      setStoredToken(response.data.token);

      if (response.data.user) {
        setUser(response.data.user);
        try {
          localStorage.setItem("nura_user", JSON.stringify(response.data.user));
        } catch {
          // Ignore storage errors
        }
      }
    }

    return response;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
