"use client";

import { useEffect, useState } from "react";
import Sidebarnav from "@/components/sidebar/sidebar";
import api from "@/utils/api"; // Certifique-se de que este caminho está correto
import Loading from "./loading"; // Ajuste o caminho de acordo com a estrutura do seu projeto

export default function Config() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Função para buscar informações do usuário logado
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserInfo(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error("Erro ao buscar informações do usuário:", error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      await fetchUserData();

      // Aguarda 2 segundos antes de definir loading como false
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      // Limpeza do timer quando o componente for desmontado
      return () => clearTimeout(timer);
    };

    loadUserData();
  }, []);

  // Função para atualizar as informações do usuário
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/me",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo({ ...userInfo, name, email });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar informações do usuário:", error);
    }
  };

  // Função para excluir a conta do usuário
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza de que deseja excluir sua conta?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await api.delete("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("token"); // Remove o token do localStorage
        alert("Conta excluída com sucesso.");
        // Redirecionar para a página de login ou homepage
        window.location.href = "/"; // Altere conforme necessário
      } catch (error) {
        console.error("Erro ao excluir a conta:", error);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen">
      <Sidebarnav />
      <div className="flex-1 p-6 md:p-8 bg-background ml-72 transition-all duration-300">
        <h1 className="text-4xl font-bold text-texto mb-4">
          Configurações do Usuário
        </h1>

        {userInfo ? (
          <div className="p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-[#FAF7F0] mb-4">
              Informações do Usuário
            </h2>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border text-black rounded p-2 mb-2 w-full"
                  placeholder="Nome"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border text-black rounded p-2 mb-4 w-full"
                  placeholder="Email"
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                  onClick={handleUpdate}
                >
                  Salvar Alterações
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded ml-4"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <p className="text-[#FAF7F0]">
                  <strong>Nome:</strong> {userInfo.name}
                </p>
                <p className="text-[#FAF7F0]">
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p className="text-[#FAF7F0]">
                  <strong>Data de Registro:</strong>{" "}
                  {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-6 flex space-x-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Conta
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={handleDelete}
                  >
                    Excluir Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-lg text-red-500">
            Erro ao carregar as informações do usuário.
          </p>
        )}
      </div>
    </div>
  );
}
