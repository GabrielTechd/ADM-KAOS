"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importando useRouter para redirecionamento
import { Poppins } from "next/font/google";
import "./globals.css";

// Carregamento da fonte
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
});

// Definição do layout global
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter(); // Inicializando o hook do roteador

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Verifica se o token existe
    if (!token) {
      router.push("/"); // Redireciona para a página de login se não houver token
    }
  }, [router]);

  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default Layout;
