import { Link } from "react-router-dom";
import { BsEnvelope, BsLinkedin, BsGithub, BsTwitterX } from "react-icons/bs";
import { TbCodeDots } from "react-icons/tb";

export default function Footer() {
  return (
    <footer className="bg-base_03 py-5 w-full text-base_02">
      <div className="max-w-6xl xl:mx-auto mx-10 sm:mx-20 ">
        <div className="mt-16 ">
          <Link
            to="/"
            className="self-center whitespace-nowrap  font-semibold flex items-center gap-2 hover:text-base_01"
          >
            <TbCodeDots className="text-6xl" />
            <p className="text-3xl font-bold ">DevLab</p>
          </Link>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:justify-between my-10 lg:mx-3">
          <div className="flex flex-col gap-2">
            <p className="font-medium">SOBRE</p>
            <Link
              to="https://macield.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-base_01"
            >
              Meu Portfólio
            </Link>
          </div>
          <hr />
          <div>
            <p className="font-medium mb-2">SIGA-NOS</p>
            <Link
              className="hover:text-base_01"
              to="https://github.com/MacielDouglas"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </div>
          <hr />

          <div className="flex flex-col">
            <p className="mb-2 font-medium ">CONHEÇA OUTROS PROJETOS </p>
            <div className="flex flex-col gap-2">
              <Link
                to="https://aboutmovie.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-base_01"
              >
                About Movie
              </Link>
              <Link
                to="https://imobiliaria-olinda.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-base_01"
              >
                Olinda Imóveis
              </Link>
              <Link
                to="https://cafe-bourbon.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-base_01"
              >
                {" "}
                Café Bourbon
              </Link>
              <Link
                to="https://olibike.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-base_01"
              >
                {" "}
                #Olibike
              </Link>
            </div>
          </div>
        </div>
        <hr className="text-base_02" />
        <div className="flex flex-col gap-10 md:flex-row md:justify-between my-10 lg:mx-3">
          <div className="flex gap-2">
            <p>
              © {`${new Date().getFullYear()}`}{" "}
              <Link
                to="https://macield.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-base_01"
              >
                Maciel D.
              </Link>
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              to="https://github.com/MacielDouglas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-base_01"
            >
              <BsGithub className="text-2xl" />
            </Link>
            <Link
              to="https://www.linkedin.com/in/douglas-maciel-4943461b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-base_01"
            >
              <BsLinkedin className="text-2xl" />
            </Link>
            <Link
              to="https://twitter.com/Maciel_dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-base_01"
            >
              <BsTwitterX className="text-2xl" />
            </Link>
            <Link
              to="mailto:maciel.d.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-base_01"
            >
              <BsEnvelope className="text-2xl" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
