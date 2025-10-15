"use client";

import Link from "next/link";
import {
  UsersIcon,
  UserGroupIcon,
  Cog8ToothIcon,
  BellIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const cards = [
    { 
      title: "Utilisateurs", 
      description: "Gérer les utilisateurs et leurs rôles", 
      path: "/dashboard/admin/utilisateurs",
      icon: <UsersIcon className="w-8 h-8 text-blue-500" />
    },
    { 
      title: "Conducteurs", 
      description: "Voir et gérer les conducteurs enregistrés", 
      path: "/dashboard/admin/conducteurs",
      icon: <UserGroupIcon className="w-8 h-8 text-green-500" />
    },
    { 
      title: "Taxes", 
      description: "Gérer les taxes, paiements et finances", 
      path: "/dashboard/admin/taxes",
      icon: <Cog8ToothIcon className="w-8 h-8 text-purple-500" />
    },
    { 
      title: "Notifications", 
      description: "Envoyer et gérer les notifications aux utilisateurs", 
      path: "/dashboard/admin/notifications",
      icon: <BellIcon className="w-8 h-8 text-yellow-500" />
    },
    { 
      title: "Statistiques", 
      description: "Visualiser les statistiques et rapports détaillés", 
      path: "/dashboard/admin/statistique",
      icon: <ChartBarIcon className="w-8 h-8 text-red-500" />
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-400 dark:to-blue-700 mb-4">
          Bienvenue sur le Dashboard Admin
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explorez les sections pour gérer efficacement votre plateforme. Utilisez les cartes ci-dessous pour un accès rapide.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            key={card.path}
            href={card.path}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 overflow-hidden relative"
          >
            {/* Icon with gradient background */}
            <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {card.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.description}
            </p>
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}