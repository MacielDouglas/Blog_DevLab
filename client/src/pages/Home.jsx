import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { ALL_POSTS } from "../graphql/queries/post.query";
import PostCard from "./../components/PostCard";
import CallToAction from "../components/CallToAction";
import CategoryList from "./../components/CategoryList";

export default function Home() {
  const { data, loading } = useQuery(ALL_POSTS);

  const uniqueCategories = [
    ...new Set(data?.getPosts.map((item) => item.category)),
  ];
  // console.log(unico);

  if (loading) return <h1>Carregando...</h1>;

  return (
    <>
      <div className="rounded-lg mt-2 bg-base_01">
        <CategoryList uniqueCategories={uniqueCategories} />
        <div className="bg-base_02 py-28 text-base_03">
          <h1 className="text-3xl font-medium text-base-03 text-center text-wrap my-5">
            Explorando o Mundo da Codificação
          </h1>
          <p className="text-base-03 text-xl text-wrap mx-28 text-center font-light">
            Desvendando o código, libertando criatividade e construindo um
            algoritmo - uma linha de código de cada vez.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-7 items-center">
        <PostCard data={data} loading={loading} />

        <Link
          to={"/search"}
          className="text-lg text-base_03 hover:underline text-center self-center"
        >
          Veja mais postagens
        </Link>
      </div>

      <div className="flex flex-col py-24 bg-base_01 items-center shadow-md">
        <CallToAction />
      </div>
    </>
  );
}
