import { useState } from "react";
import PostCard from "../components/PostCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "unCategorized",
  });
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const data = 0;
  const loading = true;

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
  return (
    <div className="container mx-auto px-4 text-base_03 mt-10">
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
