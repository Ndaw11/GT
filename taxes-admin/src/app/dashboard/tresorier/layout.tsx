"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import {
  HomeIcon,
  CreditCardIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function TresorierLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "tresorier") {
        router.push("/dashboard/admin");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Pendant le chargement initial
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-64 bg-blue-800 h-screen"></div>
        <main className="flex-1 p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "tresorier") {
    return null;
  }

  const menus = [
    { label: "Accueil", path: "/dashboard/tresorier", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Paiements", path: "/dashboard/tresorier/paiements", icon: <CreditCardIcon className="w-5 h-5" /> },
    { label: "Conducteurs", path: "/dashboard/tresorier/conducteurs", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Statistiques", path: "/dashboard/tresorier/statistique", icon: <ChartBarIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col fixed top-0 left-0 h-full shadow-xl">
        {/* HEADER */}
        <div className="p-6 border-b border-blue-600/50">
          <h2 className="text-2xl font-bold">Trésorier</h2>
          <p className="text-sm opacity-80 mt-1">
            {user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : "Trésorier"}
          </p>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menus.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? "bg-white/20 text-white font-semibold shadow-md"
                  : "hover:bg-white/10 hover:text-blue-200"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 mt-auto border-t border-blue-600/50">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}