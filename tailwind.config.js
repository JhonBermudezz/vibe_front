// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */

// Usamos la sintaxis de Módulos de ES (import/export)
import flowbitePlugin from "flowbite/plugin";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        // Nos aseguramos de que Flowbite pueda ser analizado por Tailwind
        "node_modules/flowbite-react/lib/esm/**/*.js",
    ],
    theme: {
        // Ponemos la configuración de fuentes directamente en el tema
        fontFamily: {
            sans: ["Lato", "sans-serif"],
            display: ["Montserrat", "sans-serif"],
        },
        // Usamos 'extend' para AÑADIR nuestros colores a los de Tailwind, no para reemplazarlos
        extend: {
            colors: {
                "vibe-coral": "#FF6B6B",
                "vibe-teal": "#008080",
                "vibe-yellow": "#FFD166",
                "vibe-purple": "#7E57C2",
                "vibe-light-gray": "#F5F5F7",
                "vibe-dark-slate": "#333333",
                "vibe-medium-gray": "#A9A9A9",
            },
        },
    },
    plugins: [
        flowbitePlugin, // Así se usa el plugin importado
    ],
};
