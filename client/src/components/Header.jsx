import { useState } from "react";
import { Link } from "react-router-dom";
import { TbCodeDots } from "react-icons/tb";
import {
  MdLogin,
  MdMenu,
  MdLogout,
  MdAdminPanelSettings,
  MdAutoStories,
  MdLightbulbOutline,
  MdOutlineDashboard,
  MdPermIdentity,
} from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import { useAuth } from "../hooks/AuthProvider";

export default function Header() {
  const { user, logOff } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className={`bg-base_01 text-base_03 w-full h-30`}>
      <div className="sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto pt-10 sm:pt-14 lg:pt-20 pb-4 flex items-end justify-between animate-slideon">
        <Link
          to="/"
          className="whitespace-nowrap  font-semibold flex items-center gap-2 "
        >
          <TbCodeDots className="text-4xl md:text-6xl" />
          <p className="text-2xl md:text-4xl lg:text-6xl">DevLab, blog</p>
        </Link>
        <div className="relative">
          {user ? (
            <div className="sm:flex items-center gap-1 cursor-pointer hidden">
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="absolute top-full right-0 bg-white shadow-md py-2 w-48 rounded-2xl "
                  >
                    <div className="px-4 py-2">
                      <Link to="/profile" className="text-gray-600">
                        Perfil do {user.username}
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
              className="sm:flex items-center gap-1  hover:text-blue-600 hidden"
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

      <ul className="hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto sm:flex gap-12 text-lg font-light  justify-start py-4 md:py-2 text-gray-600 animate-slidein">
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
      </ul>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex  justify-end"
          onClick={toggleModal}
        >
          <div className="bg-white p-6 rounded-l-lg  h-full w-2/3 flex">
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
                  Sobre <MdAutoStories className="text-2xl" />
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
                      to="/profile"
                      className="hover:underline flex justify-between hover:text-black"
                    >
                      Perfil do {user.username}{" "}
                      <MdPermIdentity className="text-2xl" />
                    </Link>
                    {/* <p className="text-sm text-gray-400">{user.email}</p> */}
                  </li>
                </>
              ) : (
                <></>
              )}

              <hr />
              <li>
                {user ? (
                  <button
                    onClick={logOff}
                    className="text-red-500 hover:text-red-700 w-full text-left flex justify-between"
                  >
                    SAIR <MdLogout className="text-2xl inline-block" />
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
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
