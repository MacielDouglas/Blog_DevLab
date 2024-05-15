import { useState } from "react";
import PostCard from "../components/PostCard";
import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { FILTER_POST } from "./../graphql/queries/post.query";
import useEffectOnce from "./../hooks/useEffectOnce";
import RecentPost from "./../components/RecentPost";
import { useAuth } from "../hooks/AuthProvider";

export default function Search() {
  const { uniqueCategories } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
    .toString()
    .split("=");

  const [sidebarData, setSidebarData] = useState({
    input: {
      title: "",
      category: "",
    },
  });

  if (
    queryParams[0] === "category" &&
    sidebarData.input.category !== queryParams[1]
  ) {
    setSidebarData(() => ({
      ...sidebarData,
      input: {
        ...sidebarData.input,
        category: queryParams[1],
      },
    }));
  }

  if (
    queryParams[0] === "title" &&
    sidebarData.input.title !== queryParams[1]
  ) {
    setSidebarData(() => ({
      ...sidebarData,
      input: {
        ...sidebarData.input,
        title: queryParams[1],
      },
    }));
  }

  const [searchData, { data, loading, error }] = useLazyQuery(FILTER_POST);

  useEffectOnce(() => {
    searchData({ variables: sidebarData });
  });

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit");
  };

  const handleShowMore = async () => {
    console.log("ÉEEEEEE.");
  };
  const recentPosts = data?.getPosts;
  if (recentPosts === undefined) return <h1>Carregando...</h1>;

  return (
    <div className="container text-base_03 mt-10 mx-auto">
      <div>
        <p>selecione uma categoria: </p>
        {uniqueCategories.map((cat) => (
          <p key={cat}>{cat}</p>
        ))}
      </div>
      <h1 className="text-center capitalize text-5xl font-bold my-5 md:my-0">
        {/* {category.category} */}
      </h1>
      <div>
        <h2 className="p-4 text-lg font-semibold text-stone-600">
          Postagens encontradas:{" "}
        </h2>
        <RecentPost recentPosts={recentPosts} />
      </div>
    </div>
  );
}
