"use client";

import { useEffect, useState } from "react";
import Sidebarnav from "@/components/sidebar/sidebar";
import Loading from "./loading"; // Ajuste o caminho de acordo com a estrutura do seu projeto
import api from "@/utils/api";

export default function Contato() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]); // Estado para armazenar as mensagens

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get("/listarmensagens"); // Ajuste o endpoint se necessário
                setMessages(response.data); // Armazena as mensagens no estado
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages(); // Chama a função para buscar mensagens
    }, []);

    const deleteMessage = async (id) => {
        try {
            await api.delete(`/deletarmensagem/${id}`); // Chama a rota DELETE
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id)); // Atualiza o estado local
        } catch (error) {
            console.error("Erro ao deletar mensagem:", error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebarnav />
            <div className="flex-2 p-6 md:p-8 bg-background shadow-lg rounded-lg ml-72 transition-all duration-300">
                <h2 className="text-2xl font-bold text-texto mb-6">Mensagens de Contato</h2>
                <div className="mt-4">
                    {messages.length === 0 ? (
                        <p className="texto">Nenhuma mensagem encontrada.</p>
                    ) : (
                        <ul className="space-y-4">
                            {messages.slice().reverse().map((message) => (
                                <li key={message.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow duration-200">
                                    <div className="font-semibold text-texto">
                                        <strong>Nome:</strong> {message.name}
                                    </div>
                                    <div className="texto">
                                        <strong>Email:</strong> {message.email}
                                    </div>
                                    <div className="texto">
                                        <strong>Telefone:</strong> {message.phone}
                                    </div>
                                    <div className="texto">
                                        <strong>Mensagem:</strong> {message.message}
                                    </div>
                                    <button 
                                        onClick={() => deleteMessage(message.id)} 
                                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                                    >
                                        Deletar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
