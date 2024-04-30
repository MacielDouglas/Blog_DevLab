import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <div className="bg-[rgb(34,34,34)] flex flex-col sm:flex-row p-3 border border-base_03 justify-center items-center text-center max-w-6xl shadow-2xl">
      <div className="flex-1 justify-center flex flex-col items-center">
        <h2 className="text-2xl text-gray-100">Gostou desse projeto?</h2>
        <p className="text-gray-500 my-2">
          Fale comigo e criaremos um projeto juntos, seja página web, aplicativo
          ou back-end.
        </p>
        <Link
          to="https://macield.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-base_02 hover:bg-base_01 border border-transparent hover:border-base_01 p-3 rounded-lg w-[300px]"
        >
          Maciel.D
        </Link>
      </div>
      <div className="p-7 flex-1">
        <img
          className="w-[500px] h-[350px] object-scale-down"
          src="../../public/macield.png"
          alt=""
        />
      </div>
    </div>
  );
}
