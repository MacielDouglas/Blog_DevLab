import { useState } from "react";
import PostCard from "../components/PostCard";
import { useLazyQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { FILTER_POST } from "./../graphql/queries/post.query";
import useEffectOnce from "./../hooks/useEffectOnce";
import RecentPost from "./../components/RecentPost";

export default function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
    .toString()
    .split("=");
  const category = { [queryParams[0]]: queryParams[1] };

  const [searchData, { data, loading, error }] = useLazyQuery(FILTER_POST);
  console.log(data);

  useEffectOnce(() => {
    searchData({ variables: sidebarData });
  });

  const [sidebarData, setSidebarData] = useState({
    input: {
      title: "",
      category: category.category || "",
    },
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
  console.log(recentPosts);

  return (
    <div className="container mx-auto px-4 text-base_03 mt-10">
      <h1 className="text-center capitalize text-5xl font-bold my-5 md:my-0">
        {category.category}
      </h1>
      <div>
        <h2 className="p-4 text-lg font-semibold text-stone-600">
          Postagens encontradas:{" "}
        </h2>
        <RecentPost recentPosts={recentPosts} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:border-r border-gray-500 pb-4">
          <form className="space-y-4 mr-5" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <label className="block font-semibold">Pesquisar por:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-gray-500 text-base_03"
                placeholder="Pesquise..."
                id="searchTerm"
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block font-semibold">Ordenar:</label>
              <select
                className="border rounded-lg p-2 border-gray-300 focus:border-gray-500"
                id="sort"
                onChange={handleChange}
                value={sidebarData.sort}
              >
                <option value="desc">Mais recente</option>
                <option value="asc">Mais antigo</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-semibold">Categoria:</label>
              <select
                className="border rounded-lg p-2 border-gray-300 focus:border-gray-500"
                id="sort"
                onChange={handleChange}
                value={sidebarData.category}
              >
                <option value="unCategorized">Todos</option>
                <option value="reactjs">React.Js</option>
                <option value="nextjs">Next.Js</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full border border-base_03 hover:text-base_02 hover:bg-base_03 p-2"
            >
              Filtrar
            </button>
          </form>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <h1 className="text-3xl font-semibold border-b-2 border-gray-400 pb-2 mb-4 text-stone-700">
            Resultado da pesquisa:
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {posts.length === 0 && (
              <p className="text-xl text-stone-500">
                Nenhuma postagem encontrada.
              </p>
            )}
            <PostCard data={data} loading={loading} />
            {showMore && (
              <button
                onClick={handleShowMore}
                className="text-teal-500 text-lg hover:underline p-7 w-full"
              >
                Mostrar mais
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
