// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   createHttpLink,
// } from "@apollo/client";
// import { AuthProvider } from "./hooks/AuthProvider.jsx";
// import { setContext } from "@apollo/client/link/context";
// import Cookies from "js-cookie";

// const httpLink = createHttpLink({
//   uri: "/graphql",
// });

// const authLink = setContext((_, { headers }) => {
//   // const accessTokenCookie = document.cookie
//   // .split("; ")
//   // .find((row) => row.startsWith("access_token="));
//   const accessTokenCookie = Cookies.get("access_token");

//   console.log("Access Token:", accessTokenCookie);

//   const token = localStorage.getItem("access_token");
//   // const token = document.cookie("access_token");
//   console.log("TOKEN main: ", token);
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `${token}` : "",
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <ApolloProvider client={client}>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </ApolloProvider>
// );
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AuthProvider } from "./hooks/AuthProvider.jsx";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
);
