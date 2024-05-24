import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BiBookReader } from "react-icons/bi";
import { PropTypes } from "prop-types";

export default function RecentPost({ recentPosts }) {
  return (
    <div className="flex flex-col items-center justify-center lg:flex-row gap-12 pb-32 flex-wrap">
      {recentPosts.map((post) => (
        <Link
          to={`/post/${post.slug}`}
          key={post.id}
          className="group relative w-[380px] border border-transparent hover:border-base_01  hover:bg-stone-100 h-[350px] overflow-hidden transition-all shadow-md"
        >
          {/* <Link key={post.id} className="shadow-xl"> */}
          <img
            className="w-full h-[220px] object-cover group-hover:h-[260px] transition-all duration-300 z-2"
            src={post.image}
            alt={`imagem de ${post.title}`}
          />
          <div className="py-[0.1rem] px-3 flex flex-col gap-2 justify-between">
            <p className="text-gray-500 mt-2 text-sm flex items-center gap-2 group-hover:hidden transition-all duration-400">
              <IoCalendarOutline />
              {`${new Intl.DateTimeFormat("pt-BR", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(Number(post.createdAt)))}`}{" "}
            </p>

            <h3 className="text-lg font-semibold line-clamp-2 group-hover:pt-2 text-nowrap">
              {post.title}
            </h3>
            <div className="flex justify-between group-hover:hidden italic text-sm">
              <p className="flex items-center gap-2 ">
                {/* <GiRead className="text-lg" />{" "} */}
                <BiBookReader className="text-xl" />
                {post && (post.content.length / 1000).toFixed(0)} min
              </p>
              <p>{post.category}</p>
            </div>
            <p className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border bg-base_03 text-base_01 transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2">
              leia o artigo
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

RecentPost.propTypes = {
  recentPosts: PropTypes.array.isRequired,
};
