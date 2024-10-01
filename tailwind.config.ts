import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#181C14', // Cor de fundo mais escura
                overlay: '#1E201E',      // Cor de sobreposição
                texto: '#FAF7F0',        // Cor do texto
                destaques: '#FF204E',   // Cor de destaque
                primaria: '#2D3250',       // Cor ao passar o mouse
                secundaria: '#424769',       // Cor ao passar o mouse
            },
            boxShadow: {
                'custom': '0 4px 30px rgba(0, 0, 0, 0.7)', // Sombra personalizada
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            }
        }
    },
};

export default config;
