"use client";

import { useEffect, useState } from "react";
import Sidebarnav from "@/components/sidebar/sidebar";
import Loading from "./loading"; // Ajuste o caminho de acordo com a estrutura do seu projeto
import { FaTrash } from "react-icons/fa"; // Ícone para deletar
import api from "@/utils/api"; // Supondo que você tenha uma instância do axios aqui
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Posts() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false); // Novo estado para loading de deleção
  const [loadingCreate, setLoadingCreate] = useState(false); // Estado para feedback ao criar post
  const [newPost, setNewPost] = useState({
    title: "",
    postName: "",
    description: "",
    photoLink: "",
    coveredBy: "",
    eventDetails: "",
    eventLocation: "",
    message: ""
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        alert("Erro ao buscar posts. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este post?");
    if (!confirmDelete) return;

    setLoadingDelete(true);
    try {
      const response = await api.delete(`/posts/${id}`);
      if (response.status === 204) {
        setPosts(posts.filter(post => post.id !== id));
        alert("Post deletado com sucesso!");
      } else {
        alert("Erro ao deletar o post.");
      }
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      alert("Não foi possível deletar o post. Tente novamente.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCreatePost = async () => {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!newPost.title || !newPost.postName || !newPost.description || !newPost.photoLink) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoadingCreate(true);

    try {
      const response = await api.post('/posts', newPost);
      if (response.status === 201) {
        // Atualiza a lista de posts com o novo post criado
        setPosts([...posts, response.data]);
        alert("Post criado com sucesso!");
        setNewPost({
          title: "",
          postName: "",
          description: "",
          photoLink: "",
          coveredBy: "",
          eventDetails: "",
          eventLocation: "",
          message: ""
        });
      } else {
        alert("Erro ao criar o post.");
      }
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Não foi possível criar o post. Tente novamente.");
    } finally {
      setLoadingCreate(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen text-white">
      <Sidebarnav />
      <div className="flex-1 p-6 md:p-8 ml-72 transition-all duration-300">
        <h1 className="text-2xl font-bold mb-6">Meus Posts</h1>

        {/* Dialog para Criar Post */}
        <Dialog>
          <DialogTrigger>
            <Button variant={"secondary"} >
              Criar Post
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black">
            <DialogHeader>
              <DialogTitle>Criar Novo Post</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para criar um novo post.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Título *"
                value={newPost.title}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
                required
              />
              <input
                type="text"
                name="postName"
                placeholder="Nome do Post *"
                value={newPost.postName}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
                required
              />
              <input
                type="text"
                name="photoLink"
                placeholder="Link da Imagem *"
                value={newPost.photoLink}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
                required
              />
              <textarea
                name="description"
                placeholder="Descrição *"
                value={newPost.description}
                onChange={handleInputChange}
                className="w-full p-2 resize-none bg-gray-800 text-white rounded-lg"
                required
              />
              <input
                type="text"
                name="coveredBy"
                placeholder="Coberto por"
                value={newPost.coveredBy}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                name="eventDetails"
                placeholder="Detalhes do Evento"
                value={newPost.eventDetails}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
              />
              <input
                type="text"
                name="eventLocation"
                placeholder="Local do Evento"
                value={newPost.eventLocation}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-800 text-white rounded-lg"
              />
              <textarea
                name="message"
                placeholder="Mensagem"
                value={newPost.message}
                onChange={handleInputChange}
                className="w-full p-2 resize-none bg-gray-800 text-white rounded-lg"
              />
              <Button
              variant={"default"}
                onClick={handleCreatePost}
                disabled={loadingCreate}
              >
                {loadingCreate ? "Criando..." : "Criar Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {posts.map(post => (
            <div key={post.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-lg transition-transform duration-200 hover:shadow-xl">
              <img src={post.photoLink} alt={post.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                <h3 className="text-lg font-medium text-gray-400 mb-2">Nome do Post: {post.postName}</h3>
                <p className="text-gray-300 mb-2"><strong>Descrição:</strong> {post.description}</p>
                <p className="text-gray-300 mb-2"><strong>Coberto por:</strong> {post.coveredBy}</p>
                <p className="text-gray-300 mb-2"><strong>Detalhes do Evento:</strong> {post.eventDetails}</p>
                <p className="text-gray-300 mb-2"><strong>Local do Evento:</strong> {post.eventLocation}</p>
                <p className="text-gray-300 mb-4"><strong>Mensagem:</strong> {post.message}</p>
                <div className="flex justify-end mt-auto">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className={`text-red-600 hover:text-red-800 flex items-center ${loadingDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loadingDelete}
                  >
                    <FaTrash className="mr-2" /> {loadingDelete ? "Deletando..." : "Deletar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
