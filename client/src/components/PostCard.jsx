import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useEffect, useState, useRef } from "react";

export default function PostCard({ data, loading }) {
  const [randomPosts, setRandomPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!loading && data) {
      const allPostsCopy = [...data.getPosts];
      allPostsCopy.sort(
        (a, b) => new Date(Number(b.createdAt)) - new Date(Number(a.createdAt))
      );
      const selectedPosts = allPostsCopy.slice(0, 6);
      setRandomPosts(selectedPosts);
    }
  }, [loading, data]);

  useEffect(() => {
    function handleScroll() {
      const container = containerRef.current;
      if (!container) return;

      const { scrollTop, clientHeight } = document.documentElement;
      const containerRect = container.getBoundingClientRect();
      const containerBottom =
        scrollTop + containerRect.top + containerRect.height;

      if (
        containerBottom - scrollTop - clientHeight <= 0.5 * clientHeight &&
        !loadingMore &&
        showPosts < randomPosts.length // Verifica se há mais posts para carregar
      ) {
        setLoadingMore(true);
        setTimeout(() => {
          setShowPosts((showPosts) => showPosts + 2);
          setLoadingMore(false);
        }, 1000); // Tempo para simular carregamento
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, showPosts, randomPosts]);

  return (
    <div className="container mx-auto mt-20 px-4" ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {randomPosts.slice(0, showPosts).map((item) => (
          <Link
            to={`/post/${item.slug}`}
            key={item.id}
            className="flex flex-col group animate-slideoff"
          >
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full aspect-video"
              />
            </div>
            <div className="p-4 text-center gap-3 flex flex-col">
              <p className="text-gray-500 mt-2 text-base transition-all duration-400">
                {`${new Date(Number(item.createdAt)).toLocaleDateString(
                  "pt-BR"
                )}`}
              </p>

              <h2 className="text-2xl font-medium">{item.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{item.category}</p>
              <p className="group-hover:underline">Leia o artigo</p>
            </div>
          </Link>
        ))}
      </div>
      {loadingMore && <p className="text-center mt-4">Carregando...</p>}
    </div>
  );
}

PostCard.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
