"use client";

import { useState, useRef } from "react"; // Importando useState e useRef
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "react-feather"; // Certifique-se de ter o react-feather instalado
import api from "@/utils/api";
import { useRouter } from 'next/navigation'; // Ajustado para o correto uso de roteamento

export default function Login() {
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const [error, setError] = useState(""); // Estado para erros
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter(); // Inicializa o hook do roteador

  // Função de submit
  async function handlerSubmit(event) {
    event.preventDefault();
  
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
  
    try {
      const { data } = await api.post("/login", { email, password });
  
      // Certifique-se de acessar o token corretamente
      const token = data.token || data; // Ajuste conforme a estrutura da sua resposta
  
      localStorage.setItem("token", token); // Salva o token no localStorage
      console.log("Token salvo:", token); // Loga o token
  
      // Redireciona para a página de usuários após o login
      router.push('/inicio'); // Ajuste para usar o hook correto
  
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-overlay border border-gray-700 p-10 rounded-3xl shadow-lg w-auto">
        <h2 className="text-3xl text-destaques font-bold text-center mb-6">
          Login - Kaos Records
        </h2>
        <form onSubmit={handlerSubmit}>
          <div className="mb-4">
            <Input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="border border-secundaria rounded-xl p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-destaques"
            />
          </div>
          <div className="mb-4 relative">
            <Input
              ref={passwordRef}
              type={showPassword ? "text" : "password"} // Mostra ou oculta a senha
              placeholder="Senha"
              className="border border-secundaria rounded-xl p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-destaques"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Alterna a visibilidade da senha
              className="absolute text-black right-3 top-1/2 transform -translate-y-1/2"
              aria-label="Mostrar senha"
            >
              {showPassword ? <EyeOff /> : <Eye />} {/* Exibe o ícone de olho correspondente */}
            </button>
          </div>
          {error && (
            <p className="text-red-500 mb-4">{error}</p> // Exibe o erro, se houver
          )}
          <Button
            variant={"default"}
            type="submit"
            className="flex w-full py-3 rounded-xl bg-primaria hover:bg-secundaria transition duration-200 shadow-md"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
