import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useState, useRef, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function CategoryList({ uniqueCategories }) {
  const listRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const listWidth = listRef.current.offsetWidth;
      const contentWidth = listRef.current.scrollWidth;
      // setShowLeftArrow(listRef.current.scrollLeft > 0);
      setShowRightArrow(listWidth < contentWidth);
      setShowLeftArrow(listWidth < contentWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [uniqueCategories]);

  const scrollLeft = () => {
    listRef.current.scrollTo({
      left: listRef.current.scrollLeft - 200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    listRef.current.scrollTo({
      left: listRef.current.scrollLeft + 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto pb-3">
      <div className="flex items-baseline justify-between gap-2">
        {showLeftArrow && (
          <MdChevronLeft
            className="text-5xl cursor-pointer"
            onClick={scrollLeft}
          />
        )}
        <ul
          ref={listRef}
          className="flex gap-4 flex-wrap overflow-x-hidden p-2"
        >
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
        {showRightArrow && (
          <MdChevronRight
            className="text-5xl cursor-pointer"
            onClick={scrollRight}
          />
        )}
      </div>
    </div>
  );
}

CategoryList.propTypes = {
  uniqueCategories: PropTypes.array.isRequired,
};
