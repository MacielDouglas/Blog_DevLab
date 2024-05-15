import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { FILTER_POST } from "./../graphql/queries/post.query";
import useEffectOnce from "./../hooks/useEffectOnce";
import RecentPost from "./../components/RecentPost";
import { useAuth } from "../hooks/AuthProvider";

export default function Search() {
  const { uniqueCategories, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const title = queryParams.get("title");

  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarData, setSidebarData] = useState({
    input: {
      title: "",
      category: "",
    },
  });

  const [searchData, { data }] = useLazyQuery(FILTER_POST);

  useEffect(() => {
    const fetchData = () => {
      searchData({ variables: sidebarData });
    };

    if (
      (category && category !== sidebarData.input.category) ||
      (title && title !== sidebarData.input.title)
    ) {
      setSidebarData((prevData) => ({
        ...prevData,
        input: {
          ...prevData.input,
          category: category || "",
          title: title || "",
        },
      }));
    } else {
      fetchData();
    }
  }, [category, title, sidebarData, searchData]);

  useEffectOnce(() => {
    searchData({ variables: sidebarData });
  });

  const recentPosts = data?.getPosts;
  if (recentPosts === undefined) return <h1>Carregando...</h1>;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?title=${searchQuery}`);
  };

  return (
    <div className="text-base_03 mx-auto max-w-6xl p-2">
      <p className="text-end">Olá {user ? user.username : "visitante"}, </p>
      <div className="flex gap-3 flex-wrap items-center  justify-end mx-auto py-1">
        <div className="flex flex-wrap items-center">
          pesquise:
          {uniqueCategories.map((cat) => (
            <Link
              to={`/search?category=${cat}`}
              key={cat}
              className="font-semibold hover:text-black border border-transparent hover:border-base_03 hover:bg-white p-2"
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 m-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <input
              type="text"
              id="title"
              name="titulo"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite algo..."
              className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 p-2 "
            />
            <button type="submit" className="absolute right-2">
              <MdSearch className=" text-gray-700" />
            </button>
          </form>
        </div>
      </div>

      <h1 className="text-center capitalize text-xl font-bold my-5 md:my-3 text-wrap">
        Pesquisa realizada: {queryParams.toString().split("=")[1]}
      </h1>
      <div>
        <h2 className="p-4 text-lg font-semibold text-stone-600">
          Postagens encontradas: {recentPosts.length}
        </h2>
        <RecentPost recentPosts={recentPosts} />
      </div>
    </div>
  );
}
