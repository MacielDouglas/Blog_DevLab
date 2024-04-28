import { IoCalendarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

export default function RecentPost({ recentPosts }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-32">
      {recentPosts.map((post) => (
        <Link
          to={`/post/${post.slug}`}
          key={post.id}
          className="group relative w-[380px] border border-transparent hover:border-base_01  hover:bg-stone-100 h-[350px] overflow-hidden transition-all m-3 shadow-md"
        >
          {/* <Link key={post.id} className="shadow-xl"> */}
          <img
            className="w-full h-[220px] object-cover group-hover:h-[260px] transition-all duration-300 z-2"
            src={post.image}
            alt={`imagem de ${post.title}`}
          />
          <div className="py-[0.1rem] px-3 flex flex-col gap-2">
            <p className="text-gray-500 mt-2 text-sm flex items-center gap-2 group-hover:hidden transition-all duration-400">
              <IoCalendarOutline />
              {`${new Intl.DateTimeFormat("pt-BR", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(Number(post.createdAt)))}`}{" "}
            </p>

            <h3 className="text-lg font-semibold line-clamp-2 group-hover:pt-2">
              {post.title}
            </h3>
            <span className="italic text-sm">{post.category}</span>
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
// import { IoCalendarOutline } from "react-icons/io5";
// import { PropTypes } from "prop-types";
// import { Link } from "react-router-dom";

// export default function RecentPost({ recentPosts }) {
//   return (
//     <div className="flex flex-col lg:flex-row gap-8 pb-32">
//       {recentPosts.map((post) => (
//         <Link
//           key={post.id}
//           className="group relative w-[350px] border border-transparent hover:border-base_01  hover:bg-stone-200 h-[370px] overflow-hidden transition-all m-3 shadow-md duration-300"
//         >
//           {/* <Link key={post.id} className="shadow-xl"> */}
//           <img
//             className="w-[350px] h-[232px] object-cover  z-20 group-hover:h-[260px] transition-all duration-300"
//             src={post.image}
//             alt=""
//           />
//           <div className="p-2">
//             <p className="text-gray-500 mt-2 text-sm font-roboto flex items-center gap-2 pl-2 group-hover:hidden transition-all duration-400">
//               <IoCalendarOutline />
//               {`${new Intl.DateTimeFormat("pt-BR", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               }).format(new Date(Number(post.createdAt)))}`}{" "}
//             </p>

//             <h3 className="font-medium text-lg mt-1 text-gray-800 font-comfortaa pl-2">
//               {post.title}
//             </h3>
//             <p className="text-center border hidden group-hover:block transition-all duration-300">
//               leia o artigo
//             </p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// RecentPost.propTypes = {
//   recentPosts: PropTypes.array.isRequired,
// };
