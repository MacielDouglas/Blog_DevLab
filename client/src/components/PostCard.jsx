import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";

export default function PostCard({ data, loading }) {
  const [randomPosts, setRandomPosts] = useState([]);

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

  return (
    <div className="container mx-auto mt-20 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {randomPosts.map((item) => (
          <Link
            to={`/post/${item.slug}`}
            key={item.id}
            className="flex flex-col  group"
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
                {/* <IoCalendarOutline /> */}
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
    </div>
  );
}

PostCard.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
