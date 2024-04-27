import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryList({ uniqueCategories }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const halfHeight = viewHeight / 2;

        if (rect.top <= halfHeight && rect.bottom >= halfHeight) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`my-14 text-center font-chivo transform transition-transform duration-1000 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <h2>pesquise por tema</h2>
      <ul className="flex gap-7 justify-center flex-wrap my-10">
        {uniqueCategories?.map((cat) => (
          <li key={cat}>
            <Link className="border font-medium border-base_03 py-2 px-4 md:py-3 md:px-6 uppercase bg-base_02 hover:bg-base_03 hover:text-base_02 font-roboto">
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
