"use client"; // Necessário para habilitar hooks

import { useEffect, useState } from "react";
import Sidebarnav from "@/components/sidebar/sidebar"; // Importando o componente de sidebar
import Loading from "./loading"; // Importando o componente de loading
import api from "@/utils/api"; // Importando a API
import { Button } from "@/components/ui/button"; // Importando o componente de botão
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Importando componentes do Dialog
import Cadastro from "@/components/cadastro/cadastro"; // Importando o componente de cadastro
import { FaTrash } from "react-icons/fa"; // Importando o ícone de lixeira do react-icons

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para armazenar dados dos usuários
  const [loading, setLoading] = useState(true); // Estado para gerenciar carregamento
  const [error, setError] = useState(null); // Estado para gerenciar mensagens de erro
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para gerenciar a abertura do diálogo

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("token"); // Obtém o token do local storage
      try {
        const response = await api.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuarios(response.data); // Define os dados dos usuários
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setError("Falha ao buscar usuários. Tente novamente mais tarde."); // Define mensagem de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    loadUsers(); // Chama a função para carregar usuários
  }, []);

  const deleteUser = async (id) => {
    const token = localStorage.getItem("token"); // Obtém o token do local storage
    try {
      await api.delete(`/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Limpa o token e desloga o usuário se o usuário deletado for o logado
      localStorage.removeItem("token"); // Remove o token do local storage
      window.location.href = "/login"; // Redireciona para a página de login
      
      setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id)); // Remove o usuário da lista
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      setError("Falha ao deletar usuário. Tente novamente mais tarde."); // Define mensagem de erro
    }
  };

  // Exibe o componente de loading
  if (loading) {
    return <Loading />;
  }

  // Exibe mensagem de erro se houver erro
  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebarnav />
        <div className="flex-1 p-6 md:p-8 bg-background ml-72 transition-all duration-300">
          <h2 className="text-red-500">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebarnav />
      <div className="flex-1 p-6 md:p-8 bg-background ml-72 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">Usuários:</h2>

        {/* Botão "Criar novo usuário" */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"secondary"}
              className="p-8 mb-10 text-black rounded-xl"
            >
              Criar novo usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo usuário.
              </DialogDescription>
            </DialogHeader>
            <Cadastro setUsuarios={setUsuarios} /> {/* Passa a função setUsuarios para o componente de cadastro */}
          </DialogContent>
        </Dialog>

        {usuarios.length > 0 ? (
          <ul className="space-y-4">
            {usuarios.map((usuario) => (
              <li
                key={usuario.id}
                className="p-4 w-96 border border-gray-300 rounded-lg shadow-md flex justify-between items-center transition-colors duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold">{usuario.name}</h3>
                  <p className="text-texto">{usuario.email}</p>
                  <p className="text-texto">ID: {usuario.id}</p>
                </div>
                {/* Ícone de lixeira */}
                <button
                  onClick={() => {
                    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
                      deleteUser(usuario.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash className="h-6 w-6" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-red-500">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
