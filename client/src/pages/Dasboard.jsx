import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import Profile from "./Profile";

export default function Dasboard() {
  const location = useLocation();

  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || ""
  );

  // Efeito para atualizar a aba com base nos parâmetros da URL
  useEffect(() => {
    // Extrair o valor do parâmetro "tab" da URL
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    // Definir a aba com base no valor da URL, ou manter vazio se não estiver presente
    setTab(tabFromUrl || "");
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {tab === "profile" && <Profile />}
    </div>
  );
}
