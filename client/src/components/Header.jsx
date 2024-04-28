import { useState } from "react";
import { Link } from "react-router-dom";
import { TbCodeDots } from "react-icons/tb";
import { MdLogin, MdMenu } from "react-icons/md";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-base_01 text-base_03 h-30 w-full font-chivo ">
      <div className="sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto pt-10 sm:pt-14 lg:pt-20 pb-4 flex items-end justify-between animate-slideon">
        <Link
          to="/"
          className="whitespace-nowrap  font-semibold flex items-center gap-2 "
        >
          <TbCodeDots className="text-4xl md:text-6xl" />
          <p className="text-2xl md:text-4xl lg:text-6xl">DevLab, blog</p>
        </Link>
        <div className="hidden sm:block">
          {/* <button className="mr-5">ENTRAR</button> */}
          <button className="flex items-center gap-1">
            LOGIN <MdLogin className="text-2xl" />
          </button>
        </div>
        <div className="sm:hidden">
          <button onClick={toggleModal}>
            <MdMenu className="text-4xl" />
          </button>
        </div>
      </div>
      <hr className="bg-base_03 h-[0.15rem]" />

      <ul className="hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto sm:flex gap-12 text-lg font-light font-mono justify-start py-4 md:py-2 text-gray-600 animate-slidein">
        <Link to="/">
          <li className="hover:text-gray-900">home</li>
        </Link>
        <Link to="/about">
          <li className="hover:text-gray-900">sobre</li>
        </Link>
        <Link to="/projects">
          <li className="hover:text-gray-900">projetos</li>
        </Link>
        <Link
          to="https://macield.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-base_01"
        >
          <li className="hover:text-gray-900">portfólio</li>
        </Link>
      </ul>

      {/* <ul className="hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-10 md:mx-auto sm:flex gap-12 text-lg font-light font-mono justify-start py-4 md:py-2 text-gray-600">
        <Link to="/">
          <li className="hover:text-gray-900">home</li>
        </Link>
        <Link to="/about">
          <li className="hover:text-gray-900">sobre</li>
        </Link>
        <Link to="/projects">
          <li className="hover:text-gray-900">projetos</li>
        </Link>
        <Link to="/projects">
          <li className="hover:text-gray-900">portfólio</li>
        </Link>
      </ul> */}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex  justify-end"
          onClick={toggleModal}
        >
          <div className="bg-white p-6 rounded-l-lg  h-full w-1/2 flex">
            <ul className="flex flex-col gap-4 text-xl w-full">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <hr />
              <li>
                <Link to="/about" className="hover:underline">
                  Sobre
                </Link>
              </li>
              <hr />
              <li>
                <Link to="/projects" className="hover:underline">
                  Projetos
                </Link>
              </li>
              <hr />
              <li>
                <Link to="/projects" className="hover:underline">
                  ENTRAR
                </Link>
              </li>
              <hr />
              <li>
                <Link to="/projects" className="hover:underline">
                  LOGIN
                </Link>
              </li>
              <hr />
              {/* {isLoggedIn ? (
                <>
                  <p>{user?.username}</p>
                  <hr />
                  <button
                    onClick={logOff}
                    className="text-red-500 hover:text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <li className="hover:underline">Login</li>
                </Link>
              )} */}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
