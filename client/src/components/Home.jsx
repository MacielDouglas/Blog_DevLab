import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ALL_POSTS } from "../graphql/queries/post.query";
import RecentPost from "./RecentPost";
import PostCard from "./PostCard";
import CallToAction from "./CallToAction";
import { MdFiberNew } from "react-icons/md";
import CategoryList from "./CategoryList";

export default function Home() {
  const { data, loading, error } = useQuery(ALL_POSTS);
  const [randomPosts, setRandomPosts] = useState([]);
  const uniqueCategories = [
    ...new Set(data?.allPosts.map((post) => post.category)),
  ];

  useEffect(() => {
    if (!loading && data) {
      const allPostsCopy = [...data.allPosts];
      const shuffledPosts = allPostsCopy.sort(() => Math.random() - 0.5);
      const selectedPosts = shuffledPosts.slice(0, 6);
      setRandomPosts(selectedPosts);
    }
  }, [loading, data]);

  return (
    <>
      <div className="bg-newspaper  rounded-lg bg-base_01 mt-24">
        {loading ? (
          <h2>Carregando....</h2>
        ) : (
          <>
            <div className="flex flex-col gap-7 items-center">
              <h2 className="text-3xl font-semibold text-base_03 font-comfortaa flex items-center gap-2">
                Postagens recentes <MdFiberNew className="text-5xl" />
              </h2>

              {error ? (
                <h2 className="text-red-700">
                  Problema no servidor, não foi possível carregar postagens,
                  tente novamente mais tarde...
                </h2>
              ) : (
                <RecentPost recentPosts={data?.allPosts?.slice(2, 5)} />
              )}
              <hr className="bg-base_03 h-[0.15rem] px-[100%]" />
            </div>
            <div className="bg-base_02 py-28 font-chivo text-base_03">
              <h2 className="text-3xl font-medium text-base-03 text-center text-wrap my-5 font-chivo">
                Explorando o Mundo da Codificação
              </h2>
              <p className="text-base-03 text-xl text-wrap mx-28 text-center font-light">
                Desvendando o código, libertando criatividade e construindo um
                algoritmo - uma linha de código de cada vez.
              </p>
            </div>
            {error ? (
              <></>
            ) : (
              <CategoryList uniqueCategories={uniqueCategories} />
            )}

            <h2 className="text-center font-chivo mt-20">algumas postagens</h2>
            {error ? (
              <h2 className="text-red-700 text-center p-5">
                Problema no servidor, não foi possível carregar postagens, tente
                novamente mais tarde...
              </h2>
            ) : (
              <div className="flex flex-wrap justify-center mt-10">
                {randomPosts?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="text-center my-10">
          <Link
            to="/search"
            className="text-xs sm:text-sm text-base_03 font-bold hover:underline"
          >
            Veja todas as postagens
          </Link>
        </div>
      </div>
      <div className="flex flex-col py-24 bg-base_01 items-center shadow-md">
        <CallToAction />
      </div>
    </>
  );
}
