"use client"; // Necessário para habilitar hooks

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import api from "@/utils/api";
import { Eye, EyeOff } from "react-feather"; // Certifique-se de ter o react-feather instalado

export default function Cadastro() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(''); // Mensagem de sucesso ou erro
  
  async function handlerSubmit(event) {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await api.post("/cadastro", {
        name: nameRef.current.value,
        email,
        password,
      });
      setMessage("Usuário criado com sucesso!"); // Mensagem de sucesso
      setTimeout(() => {
        window.location.reload(); // Recarrega a página após 2 segundos
      }, 2000);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setMessage("Não foi possível criar o usuário. Tente novamente."); // Mensagem de erro
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="p-10 rounded-3xl shadow-lg w-96">
        {message && <p className={`text-center mb-4 ${message.includes('sucesso') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>} {/* Exibe mensagens de erro ou sucesso */}
        <form onSubmit={handlerSubmit}>
          <div className="mb-4">
            <Input
              ref={nameRef}
              type="text"
              placeholder="Nome"
              className="border border-secundaria rounded-xl p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-destaques"
            />
          </div>
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
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="border border-secundaria rounded-xl p-3 w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-destaques"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-black right-3 top-1/2 transform -translate-y-1/2"
              aria-label="Mostrar senha"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <Button
            variant={"default"}
            className="flex w-full py-3 rounded-xl bg-primaria hover:bg-secundaria transition duration-200 shadow-md"
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
