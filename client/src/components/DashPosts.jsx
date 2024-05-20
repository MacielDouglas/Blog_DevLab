import { useQuery } from "@apollo/client";
import { ALL_POSTS } from "../graphql/queries/post.query";
import { useAuth } from "../hooks/AuthProvider";
import { Link } from "react-router-dom";

export default function DashPosts() {
  const { user } = useAuth();
  const { data, loading } = useQuery(ALL_POSTS);

  if (loading) return <h1>Carregando...</h1>;
  const posts = data.getPosts.filter((post) => post.userId === user.id);

  return (
    <div className="max-w-3xl mx-auto m-3  w-full bg-white flex flex-col items-center gap-4">
      <h1 className="text-2xl font-semibold m-6">
        Minhas Postagens: {posts.length}
      </h1>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-full bg-gray-100 border-b">
              <th className="p-4 text-left">Imagem</th>
              <th className="p-4 text-left">Título</th>
              <th className="p-4 text-left">Data</th>
              <th className="p-4 text-left">Categoria</th>
              <th className="p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <Link to={`/post/${post.slug}`}>
                    <img
                      src={post.image}
                      alt={`imagem da postagem ${post.title}`}
                      className="w-20 h-10 object-cover bg-stone-500"
                    />
                  </Link>
                </td>
                <td className="p-4 hover:font-semibold">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </td>
                <td className="p-4 text-xs">
                  {new Date(Number(post.createdAt)).toLocaleDateString()}
                </td>
                <td className="p-4 hover:font-semibold">
                  <Link to={`/search?category=${post.category}`}>
                    {post.category}
                  </Link>
                </td>
                <td className="p-5 flex gap-2">
                  <button className="border py-1 px-3 rounded-md text-red-600 hover:text-white hover:bg-red-500 mr-2">
                    Delete
                  </button>
                  <button className="border py-1 px-3 rounded-md text-blue-600 hover:text-white hover:bg-blue-500 ">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
