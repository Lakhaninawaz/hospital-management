import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("hms_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("hms_token") || "");

  useEffect(() => {
    if (user) {
      localStorage.setItem("hms_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hms_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("hms_token", token);
    } else {
      localStorage.removeItem("hms_token");
    }
  }, [token]);

  const login = async (payload) => {
    const data = await apiRequest("/auth/login", "POST", payload);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const signup = async (payload) => {
    const data = await apiRequest("/auth/signup", "POST", payload);
    setUser(data.user);
    setToken(data.token);
    return data.user;
  };

  const doctorSignup = async (payload) => {
    const data = await apiRequest("/auth/doctor-signup", "POST", payload);
    // Don't auto-login after signup - let them login manually
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, doctorSignup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
