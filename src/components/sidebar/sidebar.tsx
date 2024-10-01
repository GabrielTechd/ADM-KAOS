"use client";

import { useEffect, useState } from "react";
import { Home, User, Settings, LogOut, Menu, Image, FileText, Phone } from "react-feather"; // Ícones ajustados
import api from "@/utils/api"; // Supondo que este seja seu cliente axios ou fetch
import { useRouter, usePathname } from "next/navigation"; // Importando para redirecionar o usuário e obter o caminho atual

export default function Sidebarnav() {
  const [isOpen, setIsOpen] = useState(false); // Controle de visibilidade da sidebar
  const [isMobile, setIsMobile] = useState(false); // Estado para detectar dispositivo móvel
  const [userName, setUserName] = useState("");
  const router = useRouter(); // Hook do Next.js para navegação
  const pathname = usePathname(); // Hook do Next.js para obter o caminho da URL atual

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Função para verificar o tamanho da tela
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true); // Se a tela for menor que 768px, considera como dispositivo móvel
    } else {
      setIsMobile(false); // Caso contrário, usa layout de desktop
      setIsOpen(true); // Sidebar fica aberta por padrão no desktop
    }
  };

  // Hook para monitorar o redimensionamento da tela
  useEffect(() => {
    handleResize(); // Verifica o tamanho da tela ao carregar a página
    window.addEventListener("resize", handleResize); // Adiciona listener para redimensionamento

    return () => {
      window.removeEventListener("resize", handleResize); // Remove listener quando o componente desmonta
    };
  }, []);

  // Busca o nome do usuário logado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error("Erro ao buscar o usuário logado:", error);
      }
    };

    fetchUserData();
  }, []);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Função para verificar se o link está ativo
  const isActive = (path: string): boolean => pathname === path;

  return (
    <div className="flex h-screen">
      {/* Botão de menu para dispositivos móveis */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 text-white bg-primaria rounded-md focus:outline-none"
        >
          <Menu />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed border-r inset-y-0 left-0 bg-background transition-transform duration-300 ease-in-out z-40 ${
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        } w-64 sm:w-72 flex flex-col p-4 space-y-4`}
      >
        <div className="flex items-center justify-between">
          <span className="text-texto pl-4 text-2xl font-semibold">Kaos Records</span>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-texto focus:outline-none"
            >
              X {/* Botão para fechar a sidebar em mobile */}
            </button>
          )}
        </div>

        {/* Nome do usuário logado */}
        <div className="p-4 text-texto">
          {userName ? `Bem-vindo, ${userName}!` : "Carregando..."}
        </div>

        {/* Links de navegação */}
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <a
                href="/inicio"
                className={`flex items-center text-texto p-3 rounded-lg hover:bg-primaria ${
                  isActive("/inicio") ? "bg-destaques" : ""
                }`}
              >
                <Home className="mr-3" />
                <span>Início</span>
              </a>
            </li>

            <li>
              <a
                href="/posts"
                className={`flex items-center text-texto p-3 rounded-lg hover:bg-primaria ${
                  isActive("/posts") ? "bg-destaques" : ""
                }`}
              >
                <FileText className="mr-3" />
                <span>Posts</span>
              </a>
            </li>


            <li>
              <a
                href="/fotos"
                className={`flex items-center text-texto p-3 rounded-lg hover:bg-primaria ${
                  isActive("/fotos") ? "bg-destaques" : ""
                }`}
              >
                <Image className="mr-3" />
                <span>Fotos</span>
              </a>
            </li>

            <li>
              <a
                href="/contatos"
                className={`flex items-center text-texto p-3 rounded-lg hover:bg-primaria ${
                  isActive("/contatos") ? "bg-destaques" : ""
                }`}
              >
                <Phone className="mr-3" />
                <span>Contatos</span>
              </a>
            </li>

            <div className="h-0.5 w-full bg-white"></div>

            <li>
              <a
                href="/usuarios"
                className={`flex items-center text-texto p-3 rounded-lg hover:bg-primaria ${
                  isActive("/usuarios") ? "bg-destaques" : ""
                }`}
              >
                <User className="mr-3" />
                <span>Usuários</span>
              </a>
            </li>

            <li>
              <a
                href="/configuracoes"
                className={`flex items-center text-texto p-3 rounded-lg hover:bg-primaria ${
                  isActive("/configuracoes") ? "bg-destaques" : ""
                }`}
              >
                <Settings className="mr-3" />
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Botão de logout */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-400 p-3 hover:bg-destaques duration-500 hover:rounded-xl hover:text-white"
          >
            <LogOut className="mr-3" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Overlay para dispositivos móveis (ao abrir o menu) */}
      {isMobile && isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-overlay opacity-50"
        />
      )}
    </div>
  );
}
