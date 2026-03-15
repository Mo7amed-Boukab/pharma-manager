import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react";
import { isAuthenticated as checkAuthenticated, saveTokens as storeTokens, clearTokens as removeTokens } from "../auth/tokenStorage";
import { login as apiLogin, register as apiRegister, fetchMe, type AuthUser } from "../api/authApi";
import { getApiErrorMessage } from "../api/axiosConfig";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = useCallback(async () => {
    if (checkAuthenticated()) {
      try {
        const userData = await fetchMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to load user profile:", error);
        removeTokens();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const tokens = await apiLogin(credentials);
      storeTokens(tokens.access, tokens.refresh);
      setIsAuthenticated(true);
      await loadUser();
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Identifiants invalides."));
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const tokens = await apiRegister(data);
      storeTokens(tokens.access, tokens.refresh);
      setIsAuthenticated(true);
      await loadUser();
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur lors de l'inscription."));
    }
  };

  const logout = () => {
    removeTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
