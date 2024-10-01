"use client";

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa"; // Importa o ícone de lixeira
import Sidebarnav from "@/components/sidebar/sidebar";
import Loading from "./loading"; // Certifique-se de que este caminho esteja correto
import api from "@/utils/api"; // Supondo que você tenha uma instância do axios aqui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Photos() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    photoLink: "",
    photoName: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await api.get("/fotos");
        setPhotos(response.data);
      } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        alert("Erro ao buscar fotos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPhoto({ ...newPhoto, [name]: value });
  };

  const handleCreatePhoto = async () => {
    if (!newPhoto.title || !newPhoto.photoLink || !newPhoto.photoName) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoadingCreate(true);

    try {
      const response = await api.post("/fotos", newPhoto);
      if (response.status === 201) {
        setPhotos([...photos, response.data]);
        alert("Foto criada com sucesso!");
        setNewPhoto({ title: "", photoLink: "", photoName: "" });
        setIsDialogOpen(false);
      } else {
        alert("Erro ao criar a foto.");
      }
    } catch (error) {
      console.error("Erro ao criar foto:", error);
      alert("Não foi possível criar a foto. Tente novamente.");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm("Você tem certeza que deseja deletar esta foto?")) {
      setLoadingDelete(true);
      try {
        const response = await api.delete(`/fotos/${id}`);
        if (response.status === 204) {
          setPhotos(photos.filter((photo) => photo.id !== id));
          alert("Foto deletada com sucesso!");
        } else {
          console.error(
            `Erro ao deletar foto: ${response.status} - ${response.statusText}`
          );
          alert(`Erro ao deletar foto: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Erro ao deletar foto:", error);
        const errorMessage =
          error.response?.data?.message || error.message || "Erro desconhecido";
        alert(`Não foi possível deletar a foto. Erro: ${errorMessage}`);
        console.log(error.response); // Log da resposta de erro
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  return (
    <div className="flex h-screen text-white">
      <Sidebarnav />
      <div className="flex-1 p-6 md:p-8 ml-72 transition-all duration-300">
        <h1 className="text-2xl font-bold mb-6">Minhas Fotos</h1>

        {/* Mostra o componente de loading se estiver carregando */}
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Diálogo para Criar Foto */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={"secondary"}>Postar Nova Foto</Button>
              </DialogTrigger>
              <DialogContent className="bg-black">
                <DialogHeader>
                  <DialogTitle>Criar Nova Foto</DialogTitle>
                  <DialogDescription>
                    Preencha as informações abaixo para postar uma nova foto.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Título *"
                    value={newPhoto.title}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="photoLink"
                    placeholder="Link da Imagem *"
                    value={newPhoto.photoLink}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    name="photoName"
                    placeholder="Nome da Foto *"
                    value={newPhoto.photoName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg"
                    required
                  />
                  <Button
                    variant={"default"}
                    onClick={handleCreatePhoto}
                    disabled={loadingCreate}
                  >
                    {loadingCreate ? "Criando..." : "Postar Foto"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Lista de Fotos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg transition-transform duration-200 hover:shadow-xl"
                >
                  <img
                    src={photo.photoLink}
                    alt={photo.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold mb-1">{photo.title}</h2>
                    <p className="text-gray-300 mb-2">
                      <strong>Nome da Foto:</strong> {photo.photoName}
                    </p>
                  </div>
                  <button
                    className={`mt-2 text-red-500 hover:text-red-700 ${
                      loadingDelete ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={loadingDelete} // Desabilita o botão durante a exclusão
                  >
                    <FaTrash className="inline-block" /> {/* Ícone da lixeira */}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
