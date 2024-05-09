import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import { ONE_POST } from "../graphql/queries/post.query";
import { IoCalendarOutline } from "react-icons/io5";
import CallToAction from "../components/CallToAction";

export default function PostPage() {
  const { postSlug } = useParams();
  const { data, loading } = useQuery(ONE_POST, {
    variables: {
      slug: postSlug,
    },
  });

  const getMonthName = (month) => {
    const months = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];
    return months[month - 1];
  };

  // Formatação da data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthName(date.getMonth());
    return `${day} de ${month}`;
  };

  if (loading) return <h1>Carregando....</h1>;
  const post = data?.getPosts[0];

  console.log(post);

  return (
    <main className="p-3 flex flex-col max-w-5xl mx-auto min-h-screen gap-5 mb-20">
      <p className="text-gray-500 mt-2 text-base transition-all duration-400 flex  justify-between gap-2 flex-wrap">
        <span className="flex items-center gap-3">
          <IoCalendarOutline />
          {`${formatDate(Number(post.createdAt))}`}. - escrito por{" "}
          {post.writer ? post.writer : "..."}
        </span>
        <span className="italic">
          tempo de leitura {post && (post.content.length / 1000).toFixed(0)} min
        </span>
      </p>
      <h1 className="text-4xl md:text-6xl">{post.title}</h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center"
      >
        <button className="border p-2 border-base_03 hover:bg-base_03 hover:text-base_02 mx-auto">
          {post && post.category}
        </button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[500px] aspect-video w-full object-scale-down"
      />
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full mt-10">
        <CallToAction />
      </div>
    </main>
  );
}
