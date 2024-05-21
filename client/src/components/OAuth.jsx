import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "./../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IoLogoGoogle } from "react-icons/io5";
import { useMutation } from "@apollo/client";
import { LOGIN_GOOGLE } from "../graphql/mutation/user.mutation";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/AuthProvider";

export default function OAuth() {
  const [newGoogle, { loading, data, error }] = useMutation(LOGIN_GOOGLE);

  const { setIsLoggedIn, isLoggedIn, setUser } = useAuth();
  const auth = getAuth(app);

  const navigate = useNavigate();

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      await handleGoogleSignInResults(resultsFromGoogle.user);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleGoogleSignInResults = async (user) => {
    const { displayName, email, photoURL } = user;

    try {
      await newGoogle({
        variables: {
          user: {
            email: email,
            displayName: displayName,
            profilePicture: photoURL,
            name: displayName,
          },
        },
      });
    } catch (error) {
      throw new Error("Erro ao fazer login: ", error.message);
    }
  };

  useEffect(() => {
    if (!loading && !error && data) {
      setIsLoggedIn(true);
      Cookies.set("loginUser", JSON.stringify(data.loginGoogle), {
        expires: 1 / 24,
      });
      setUser({
        username: data.loginGoogle.username,
        isAdmin: data.loginGoogle.isAdmin,
        profilePicture: data.loginGoogle.profilePicture,
        id: data.loginGoogle.id,
        name: data.loginGoogle.name,
      });
    }
  }, [loading, error, data, setIsLoggedIn, setUser]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="bg-red-700 text-white rounded-md py-2 px-4 hover:bg-red-600 focus:outline-none focus:bg-blue-600 disabled:bg-red-500 mt-3 w-full flex gap-3 items-center justify-center"
      disabled={loading}
    >
      <IoLogoGoogle />
      {loading ? "Loading..." : "Continuar com Google"}
    </button>
  );
}
