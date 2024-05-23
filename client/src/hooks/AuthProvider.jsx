import { useLazyQuery, useQuery } from "@apollo/client";
import { createContext, useState, useContext, useEffect } from "react";
import { PropTypes } from "prop-types";
import { LOGIN_USER, LOGOUT_USER } from "../graphql/queries/user.query";
import { ALL_POSTS } from "../graphql/queries/post.query";
import Cookies from "js-cookie";

// Criar o contexto de autenticação
const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginQuery, { loading, error, data }] = useLazyQuery(LOGIN_USER);
  const [logout] = useLazyQuery(LOGOUT_USER);

  const { data: postData, refetch } = useQuery(ALL_POSTS);

  const uniqueCategories = [
    ...new Set(postData?.getPosts.map((item) => item.category)),
  ];
  useEffect(() => {
    const storeUserData = Cookies.get("loginUser");
    if (storeUserData) {
      const userData = JSON.parse(storeUserData);
      setIsLoggedIn(true);
      setUser({
        username: userData.username,
        isAdmin: userData.isAdmin,
        profilePicture: userData.profilePicture,
        id: userData.id,
        name: userData.name,
      });
    }
  }, []);

  useEffect(() => {
    if (!loading && !error && data) {
      setIsLoggedIn(true);
      Cookies.set("loginUser", JSON.stringify(data.loginUser), {
        expires: 1 / 24,
      });
      setUser({
        username: data.loginUser.username,
        isAdmin: data.loginUser.isAdmin,
        profilePicture: data.loginUser.profilePicture,
        id: data.loginUser.id,
        name: data.loginUser.name,
      });
      console.log(error);
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
    Cookies.remove("loginUser");
    logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  const refetchAllPosts = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching posts:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setIsLoggedIn,
        isLoggedIn,
        user,
        setUser,
        signIn,
        logOff,
        data,
        loading,
        error,
        uniqueCategories,
        refetchAllPosts,
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
