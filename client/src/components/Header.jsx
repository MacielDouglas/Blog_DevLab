import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TbCodeDots } from "react-icons/tb";
import {
  MdLogin,
  MdMenu,
  MdLogout,
  MdAdminPanelSettings,
  MdOutlineAssignment,
  MdLightbulbOutline,
  MdOutlineDashboard,
  MdPermIdentity,
  MdSearch,
} from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { useAuth } from "../hooks/AuthProvider";
import CategoryList from "./CategoryList";

export default function Header() {
  const { user, logOff, uniqueCategories } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearch = () => {
    setShowSearch(true);
  };

  const handleSearchSubmit = () => {
    setIsModalOpen(false);
    setShowMenu(false);
    if (searchQuery.trim()) {
      navigate(`/search?title=${searchQuery}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const isSearchPage = location.pathname === "/search";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMenu]);

  return (
    <header className={`bg-base_01 text-base_03 w-full h-30`}>
      <div className="sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto pt-10 sm:pt-14 lg:pt-20 pb-4 flex items-end justify-between animate-slideon">
        <Link
          to="/"
          className="whitespace-nowrap font-semibold flex items-center gap-2"
        >
          <TbCodeDots className="text-4xl md:text-6xl" />
          <p className="text-2xl md:text-4xl lg:text-6xl">DevLab, blog</p>
        </Link>
        <div className="relative">
          {user ? (
            <div className="sm:flex items-center gap-1 cursor-pointer hidden">
              <div
                onClick={() => setShowMenu((prevShowMenu) => !prevShowMenu)}
                ref={menuRef}
                className="relative flex items-center gap-2"
              >
                {user.isAdmin ? (
                  <MdAdminPanelSettings className="text-2xl" />
                ) : (
                  <FaRegCircleUser className="text-2xl" />
                )}
                <span className="font-semibold">{user.username}</span>
                {showMenu && (
                  <div
                    onClick={() => setShowMenu((prevShowMenu) => !prevShowMenu)}
                    className="absolute top-full right-0 bg-white shadow-md py-1 mt-2 w-48 rounded-2xl"
                  >
                    <div className="px-4 py-2">
                      <p>{user.username}</p>
                      <hr className="border-gray-200" />
                      <Link
                        to="/dashboard?tab=profile"
                        className="text-gray-600"
                      >
                        Perfil
                      </Link>
                    </div>
                    <hr className="border-gray-200" />
                    <button
                      onClick={logOff}
                      className="block px-4 py-2 text-sm text-red-500 hover:text-red-700 w-full text-left"
                    >
                      Sair <MdLogout className="text-xl inline-block" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="sm:flex items-center gap-1 hover:text-blue-600 hidden"
            >
              LOGIN <MdLogin className="text-2xl" />
            </Link>
          )}
        </div>

        <div className="sm:hidden">
          <button onClick={toggleModal}>
            <MdMenu className="text-4xl" />
          </button>
        </div>
      </div>
      <hr className="bg-base_03 h-[0.15rem]" />

      <ul className="hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto sm:flex gap-12 text-lg font-light justify-start py-4 md:py-2 text-gray-600 animate-slidein">
        <Link to="/">
          <li className="hover:text-gray-900 font-space">home</li>
        </Link>

        <Link to="/about">
          <li className="hover:text-gray-900 font-space">sobre</li>
        </Link>
        <Link to="/projects">
          <li className="hover:text-gray-900 font-space">projetos</li>
        </Link>
        <Link
          to="https://macield.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-base_01"
        >
          <li className="hover:text-gray-900 font-space">portfólio</li>
        </Link>
        {!isSearchPage && (
          <li>
            <MdSearch
              className="text-2xl mt-1 cursor-pointer hover:text-gray-900"
              onClick={handleSearch}
            />
          </li>
        )}
      </ul>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-l-lg h-full w-2/3 flex"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-4 text-xl w-full">
              <li>
                <Link to="/" className="hover:underline flex justify-between">
                  Home <IoHomeOutline className="text-2xl" />
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  to="/about"
                  className="hover:underline flex justify-between"
                >
                  Sobre <MdOutlineAssignment className="text-2xl" />
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  to="/projects"
                  className="hover:underline flex justify-between"
                >
                  Projetos <MdLightbulbOutline className="text-2xl" />
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  to="/projects"
                  className="hover:underline flex justify-between hover:text-black"
                >
                  Portfólio <MdOutlineDashboard className="text-2xl" />
                </Link>
              </li>
              {user ? (
                <>
                  <hr />
                  <li>
                    <Link
                      to="/dashboard?tab=profile"
                      className="hover:underline flex justify-between hover:text-black"
                    >
                      Perfil {user.username}{" "}
                      <MdPermIdentity className="text-2xl" />
                    </Link>
                  </li>
                </>
              ) : null}
              <hr />
              <li>
                {user ? (
                  <button
                    onClick={logOff}
                    className="text-red-500 hover:text-red-700 w-full text-left flex justify-between"
                  >
                    Sair <MdLogout className="text-2xl inline-block" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="hover:underline flex justify-between"
                  >
                    LOGIN <MdLogin className="text-2xl" />
                  </Link>
                )}
              </li>
              <hr />
              {!isSearchPage && (
                <div className=" flex flex-col gap-2 text-sm mt-5">
                  <h3 className="mb-3 sm:mb-5 text-xl font-semibold text-gray-500">
                    Pesquise por...
                  </h3>

                  <div onClick={toggleModal}>
                    <CategoryList uniqueCategories={uniqueCategories} />
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearchSubmit();
                    }}
                  >
                    <label htmlFor="title"></label>
                    <input
                      type="text"
                      id="title"
                      name="titulo"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Digite algo..."
                      className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:border-blue-500 mb-3"
                    />
                  </form>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSearchSubmit}
                      className="bg-blue-500 p-2 sm:p-3 rounded-md text-red-50 flex-1 flex items-center gap-2 justify-center"
                    >
                      <MdSearch className="text-xl mt-1 cursor-pointer hover:text-gray-900" />
                      Pesquisar!
                    </button>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}

      {showSearch && !isSearchPage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md flex text-center flex-col justify-around"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg text-gray-500 py-3">
              Pesquise por qualquer coisa...
            </h3>
            <p>Categorias:</p>
            <div
              onClick={() => setShowSearch(false)}
              className=" flex flex-wrap"
            >
              <CategoryList uniqueCategories={uniqueCategories} />
            </div>
            <div className="py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSubmit();
                }}
              >
                <label htmlFor="title"></label>
                <input
                  type="text"
                  id="title"
                  name="titulo"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite algo..."
                  className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:border-blue-500 mb-3"
                />
              </form>
              <div className="flex flex-col sm:flex-row gap-3 text-sm pt-2">
                <button
                  onClick={handleSearchSubmit}
                  className="bg-blue-500 p-1 sm:p-2 rounded-md text-red-50  hover:text-white flex-1 flex items-center gap-2 justify-center hover:bg-blue-700 border border-transparent hover:border-white"
                >
                  <MdSearch className="text-2xl mt-1 cursor-pointer" />
                  Pesquisar!
                </button>
                <button
                  className="bg-base_03 hover:bg-stone-700 p-1 sm:p-2 rounded-md text-stone-100 flex-1 mt-2 sm:mt-0 border border-transparent hover:border-white"
                  onClick={() => setShowSearch(false)}
                >
                  Não, cancelar!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
