import { useLazyQuery, useQuery } from "@apollo/client";
import { createContext, useState, useContext, useEffect } from "react";
import { PropTypes } from "prop-types";
import { LOGIN_USER, LOGOUT_USER } from "../graphql/queries/user.query";
import { ALL_POSTS } from "../graphql/queries/post.query";

// Criar o contexto de autenticação
const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginQuery, { loading, error, data }] = useLazyQuery(LOGIN_USER);
  const [logout] = useLazyQuery(LOGOUT_USER);

  const { data: postData } = useQuery(ALL_POSTS);

  const uniqueCategories = [
    ...new Set(postData?.getPosts.map((item) => item.category)),
  ];

  useEffect(() => {
    if (!loading && !error && data) {
      setIsLoggedIn(true);
      setUser({
        username: data.loginUser.username,
        isAdmin: data.loginUser.isAdmin,
        profilePicture: data.loginUser.profilePicture,
        id: data.loginUser.id,
      });
    }
  }, [loading, error, data]);

  const signIn = async (userData) => {
    try {
      loginQuery(userData);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const logOff = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        signIn,
        logOff,
        data,
        loading,
        error,
        uniqueCategories,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
