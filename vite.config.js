import inertia from "@inertiajs/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.tsx"],
            ssr: "resources/js/ssr.tsx",
        }),
        inertia(),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@shared": path.resolve(
                __dirname,
                "./Modules/Shared/resources/assets/js"
            ),
            "@pages": path.resolve(
                __dirname,
                "./Modules/Pages/resources/assets/js"
            ),
            "@projects": path.resolve(
                __dirname,
                "./Modules/Projects/resources/assets/js"
            ),
            "@dashboard": path.resolve(
                __dirname,
                "./Modules/Dashboard/resources/assets/js"
            ),
        },
    },
});
