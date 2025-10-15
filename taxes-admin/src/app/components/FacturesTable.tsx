"use client";

import React from "react";
import { FiLoader } from "react-icons/fi";

export default function FacturesTable({ title, facturesList }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-[400px]"> {/* Hauteur fixe réduite */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        {title}
      </h2>

      <div className="flex flex-col flex-1 min-h-0">
        {/* En-têtes fixes */}
        <div className="grid grid-cols-6 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          {["Conducteur", "Véhicule", "Montant", "Date émission", "Période", "Statut"].map((h) => (
            <div
              key={h}
              className="p-3 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm truncate"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {facturesList.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 italic">
              Aucune facture trouvée
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {facturesList.map((f: any) => (
                <div
                  key={f.id}
                  className="grid grid-cols-6 group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  {/* Conducteur */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate">
                    {f.conducteur
                      ? `${f.conducteur.prenom} ${f.conducteur.nom}`
                      : "-"}
                  </div>
                  
                  {/* Véhicule */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate">
                    {f.vehicule?.immatriculation ?? "-"}
                  </div>
                  
                  {/* Montant */}
                  <div className="p-3 font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {f.montantDu} CFA
                  </div>
                  
                  {/* Date émission */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate">
                    {f.dateEmission?.toString?.() ?? f.dateEmission}
                  </div>
                  
                  {/* Période */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate">
                    {f.periode}
                  </div>
                  
                  {/* Statut */}
                  <div className="p-3 truncate">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                        f.statut === "payee"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/50"
                          : f.statut === "non_payee"
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/50"
                          : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50"
                      }`}
                    >
                      {f.statut === "payee"
                        ? "Payée"
                        : f.statut === "non_payee"
                        ? "Non payée"
                        : f.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}