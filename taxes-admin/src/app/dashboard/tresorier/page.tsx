"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  CurrencyDollarIcon,
  ChartPieIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

export default function TresorierDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "tresorier") {
      router.push("/dashboard/admin");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "tresorier") {
    return null; // Évite le clignotement
  }

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-10 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700 mb-4">
          Tableau de bord Trésorier
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Bienvenue {user?.prenom} {user?.nom}, vous êtes connecté en tant que{" "}
          <span className="font-semibold text-blue-500 dark:text-blue-400">{user?.role}</span>.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Paiements récents */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 relative overflow-hidden">
          <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-300">
            <CurrencyDollarIcon className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Paiements récents
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Consultez et gérez les derniers paiements effectués.
          </p>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </div>

        {/* Statistiques */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 relative overflow-hidden">
          <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-300">
            <ChartPieIcon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Statistiques
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualisez les graphiques et chiffres clés financiers.
          </p>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </div>

        {/* Actions rapides */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 relative overflow-hidden">
          <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-300">
            <BoltIcon className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Actions rapides
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Accédez rapidement aux outils essentiels du trésorier.
          </p>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
}