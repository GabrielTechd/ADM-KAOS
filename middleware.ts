// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

// Função de middleware
export function middleware(req: NextRequest) { // Adicionando o tipo NextRequest
  // Obtém o cookie do token
  const token = req.cookies.get('token');

  // Se não houver token e o usuário tentar acessar a página de usuários, redirecione
  if (!token && req.nextUrl.pathname.startsWith('/usuarios')) {
    return NextResponse.redirect(new URL('/', req.url)); // Redireciona para a página de login
  }

  return NextResponse.next(); // Permite continuar a requisição
}

// Configuração do middleware para proteger as rotas
export const config = {
  matcher: ['/usuarios/:path*'], // Rotas a serem protegidas
};
