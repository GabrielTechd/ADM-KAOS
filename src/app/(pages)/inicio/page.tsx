"use client";

import { useEffect, useState } from "react";
import Sidebarnav from "@/components/sidebar/sidebar";
import Loading from "./loading"; // Ajuste o caminho de acordo com a estrutura do seu projeto

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula um carregamento de 2 segundos
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        // Limpeza do timer quando o componente for desmontado
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex h-screen">
            <Sidebarnav />
            <div className="flex-1 p-6 md:p-8 bg-background ml-72 transition-all duration-300"> {/* Fundo escuro da página */}
                <h1 className="text-4xl font-bold text-texto mb-4">Bem-vindo ao Kaos Records</h1>
                <p className="text-lg text-texto mb-6">
                    Esta é a sua página inicial, onde você pode gerenciar sua aplicação de forma eficaz.
                </p>
                
                <div className="mt-6 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold text-[#FAF7F0] mb-4">O que você pode fazer:</h2>
                    <ul className="list-disc list-inside mt-2 text-[#FAF7F0]">
                        <li>Gerenciar usuários</li>
                        <li>Criar postagens, seções e adicionar novas fotos</li>
                        <li>Ver contatos de clientes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
