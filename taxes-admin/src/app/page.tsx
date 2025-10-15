//taxes-admin\src\app\page.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/next.svg" // 👉 tu peux remplacer par ton logo (ex: /logo.png)
          alt="Logo app"
          width={200}
          height={60}
          priority
        />
      </div>

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur l'application de gestion des taxes</h1>

      {/* Bouton connexion */}
      <button
        onClick={() => router.push("/login")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Se connecter
      </button>
    </div>
  );
}
