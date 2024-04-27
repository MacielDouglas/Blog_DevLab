import { Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { PropTypes } from "prop-types";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-[380px] border border-transparent hover:border-base_01  hover:bg-stone-100 h-[350px] overflow-hidden transition-all m-3 shadow-md">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="w-full h-[220px] object-cover group-hover:h-[260px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="py-[0.1rem] px-3 flex flex-col gap-2">
        <p className="text-gray-500 mt-2 text-sm font-roboto flex items-center gap-2 group-hover:hidden transition-all duration-400">
          <IoCalendarOutline />
          {`${new Intl.DateTimeFormat("pt-BR", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(Number(post.createdAt)))}`}{" "}
        </p>
        <p className="text-lg font-semibold line-clamp-2 font-comfortaa group-hover:pt-2">
          {post.title}
        </p>
        <span className="italic text-sm font-roboto">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border bg-base_03 text-base_01 transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2 font-roboto"
        >
          Leia o artigo
        </Link>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
};
