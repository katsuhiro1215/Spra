import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // ダークモードをクラスベースで有効化
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--color-primary, #4f46e5)",
                    hover: "var(--color-primary-hover, #4338ca)",
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    200: "#c7d2fe",
                    300: "#a5b4fc",
                    400: "#818cf8",
                    500: "var(--color-primary, #4f46e5)",
                    600: "var(--color-primary-hover, #4338ca)",
                    700: "#3730a3",
                    800: "#312e81",
                    900: "#1e1b4b",
                },
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideInDown: {
                    "0%": { opacity: "0", transform: "translateY(-20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.3s ease-out",
                slideInDown: "slideInDown 0.3s ease-out",
            },
        },
    },

    plugins: [forms],
};
