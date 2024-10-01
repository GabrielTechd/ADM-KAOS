"use client";

import api from "@/utils/api";
import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
}

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState<User[]>([]); // Estado para armazenar os usuários

    useEffect(() => {
        async function loadUsers() {
            const token = localStorage.getItem('token');

            try {
                const response = await api.get("/usuarios", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUsuarios(response.data); // Armazena os usuários no estado
            } catch (error) {
                console.error("Erro ao carregar usuários:", error);
            }
        }

        loadUsers(); // Chama a função para carregar os usuários
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Usuários</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {usuarios.map(user => (
                    <div key={user.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
