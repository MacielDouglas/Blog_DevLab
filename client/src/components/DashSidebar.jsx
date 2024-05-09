import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";

export default function DashSidebar() {
  const { user, logOff } = useAuth();

  return (
    <div className="w-full md:56 bg-stone-300 h-full flex flex-col gap-2 p-3">
      <Link
        to="/dashboard?tab=profile"
        className="flex justify-between items-center p-2 rounded-lg hover:bg-white"
      >
        <p className="text-lg flex items-center gap-1">
          <HiUser /> Perfil
        </p>
        <p className="py-1 px-3 text-sm bg-base_03 rounded-lg text-base_04">
          {user.isAdmin ? "admin" : "usuário"}
        </p>
      </Link>
      <hr className="my-2" />
      {user.isAdmin ? (
        <>
          <Link
            to="/dashboard?tab=posts"
            className="flex justify-between items-center p-2 rounded-lg hover:bg-white"
          >
            <p className="text-lg flex items-center gap-1">
              <HiDocumentText /> Postagens
            </p>
          </Link>
          <hr />
          <Link
            to="/dashboard?tab=users"
            className="flex justify-between items-center p-2 rounded-lg hover:bg-white"
          >
            <p className="text-lg flex items-center gap-1">
              <HiOutlineUserGroup /> Usuários
            </p>
          </Link>
          <hr />
          <Link
            to="/dashboard?tab=comments"
            className="flex justify-between items-center p-2 rounded-lg hover:bg-white"
          >
            <p className="text-lg flex items-center gap-1">
              <HiAnnotation /> Comentários
            </p>
          </Link>
          <hr />
        </>
      ) : (
        <></>
      )}
      <p
        onClick={logOff}
        className="text-xl p-2 rounded-lg hover:bg-white flex items-center gap-1 cursor-pointer hover:text-red-800"
      >
        <HiArrowSmRight /> Sair
      </p>
    </div>
  );
}
