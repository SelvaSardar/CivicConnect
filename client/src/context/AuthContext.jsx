import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("civicconnect-token");
    const savedUser = localStorage.getItem("civicconnect-user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        setToken(savedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to restore user session");

        localStorage.removeItem("civicconnect-token");
        localStorage.removeItem("civicconnect-user");
      }
    }

    setIsLoading(false);
  }, []);

  const login = (loginData) => {
    const { token, user } = loginData;

    localStorage.setItem("civicconnect-token", token);
    localStorage.setItem(
      "civicconnect-user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("civicconnect-token");
    localStorage.removeItem("civicconnect-user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};