import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useRef } from "react";

export default function CategoryList({ uniqueCategories }) {
  const listRef = useRef(null);

  return (
    <div className="w-full p-3">
      <ul ref={listRef} className="flex flex-wrap gap-4 p-2 justify-center">
        {uniqueCategories?.map((cat) => (
          <li key={cat}>
            <Link
              to={`/search?category=${cat}`}
              className="border p-2 text-xs font-bold border-base_03 hover:bg-base_04"
            >
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

CategoryList.propTypes = {
  uniqueCategories: PropTypes.array.isRequired,
};
