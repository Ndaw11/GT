"use client";

import { useEffect, useState } from "react";
import { FiX, FiSearch, FiUsers, FiFileText, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import { fetchConducteurs, fetchFactures } from "@/lib/api";

export default function ConducteursPage() {
  const [conducteurs, setConducteurs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedConducteur, setSelectedConducteur] = useState<any>(null);
  const [factures, setFactures] = useState<any[]>([]);
  const [filters, setFilters] = useState({ statut: "tous", mois: "", annee: "" });
  const [loadingConducteurs, setLoadingConducteurs] = useState(false);
  const [loadingFactures, setLoadingFactures] = useState(false);

  // Charger conducteurs
  useEffect(() => {
    setLoadingConducteurs(true);
    fetchConducteurs()
      .then(setConducteurs)
      .catch(console.error)
      .finally(() => setLoadingConducteurs(false));
  }, []);

  // Charger factures du conducteur sélectionné
  useEffect(() => {
    if (!selectedConducteur) {
      setFactures([]);
      return;
    }
    setLoadingFactures(true);
    fetchFactures(selectedConducteur.id, filters)
      .then((data) => setFactures(Array.isArray(data) ? data : []))
      .catch(() => setFactures([]))
      .finally(() => setLoadingFactures(false));
  }, [selectedConducteur, filters]);

  const filtered = conducteurs.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.nom?.toLowerCase().includes(q) ||
      c.prenom?.toLowerCase().includes(q) ||
      c.matricule?.toLowerCase().includes(q) ||
      c.vehicules?.some((v: any) =>
        v.immatriculation?.toLowerCase().includes(q)
      )
    );
  });

  // Calculs pour les cartes
  const totalFactures = factures.length;
  const payees = factures.filter((f) => f.statut === "payee").length;
  const nonPayees = totalFactures - payees;
  const totalConducteurs = conducteurs.length;

  return (
    <div className="min-h-screen p-6 lg:p-8 overflow-hidden">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Conducteurs & Factures
      </h1>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-7xl">
        {[
          { label: "Total Conducteurs", value: totalConducteurs, icon: FiUsers, color: "text-blue-500" },
          { label: "Factures Payées", value: payees, icon: FiCheckCircle, color: "text-green-500" },
          { label: "Factures Non Payées", value: nonPayees, icon: FiAlertCircle, color: "text-red-500" },
          { label: "Total Factures", value: totalFactures, icon: FiFileText, color: "text-purple-500" },
        ].map(({ label, value, icon: Icon, color }, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <Icon className={`${color} text-2xl`} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Conducteurs & Factures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl h-[calc(100vh-280px)]">
        {/* === Tableau Conducteurs === */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300">
          {/* Barre de recherche */}
          <div className="flex items-center gap-3 p-4 border-b bg-gray-50 dark:bg-gray-900">
            <FiSearch className="text-gray-500 dark:text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un conducteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                <FiX size={20} />
              </button>
            )}
          </div>

          {/* Liste Conducteurs */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* En-têtes fixes */}
            <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
              {["Nom", "Prénom", "Matricule", "Véhicules"].map((h) => (
                <div
                  key={h}
                  className="p-4 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm"
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Corps scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingConducteurs ? (
                <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiLoader className="animate-spin" size={20} />
                    Chargement...
                  </div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                  Aucun conducteur trouvé
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filtered.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConducteur(c)}
                      className={`grid grid-cols-4 cursor-pointer transition-all duration-200 ${
                        selectedConducteur?.id === c.id
                          ? "bg-gray-100 dark:bg-gray-700/50"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      }`}
                    >
                      <div className="p-4 text-gray-800 dark:text-gray-200 truncate">{c.nom}</div>
                      <div className="p-4 text-gray-800 dark:text-gray-200 truncate">{c.prenom}</div>
                      <div className="p-4 text-gray-800 dark:text-gray-200 truncate">{c.matricule || "-"}</div>
                      <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                        {c.vehicules?.map((v: any) => v.immatriculation).join(", ") || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === Tableau Factures === */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header + Filtres */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Factures{" "}
              {selectedConducteur
                ? `- ${selectedConducteur.prenom} ${selectedConducteur.nom}`
                : ""}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {["tous", "payee", "non_payee"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters((f) => ({ ...f, statut: s }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                    filters.statut === s
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  {s === "tous" ? "Tous" : s === "payee" ? "Payées" : "Non payées"}
                </button>
              ))}
            </div>
          </div>

          {/* Liste Factures */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* En-têtes fixes */}
            <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
              {["Période", "Montant", "Date Emission", "Statut"].map((h) => (
                <div
                  key={h}
                  className="p-4 text-left text-gray-700 dark:text-gray-200 font-semibold text-sm"
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Corps scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingFactures ? (
                <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FiLoader className="animate-spin" size={20} />
                    Chargement...
                  </div>
                </div>
              ) : factures.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                  {selectedConducteur ? "Aucune facture trouvée" : "Sélectionnez un conducteur"}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {factures.map((f) => (
                    <div
                      key={f.id}
                      className="grid grid-cols-4 group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                    >
                      <div className="p-4 text-gray-800 dark:text-gray-200 truncate">{f.periode}</div>
                      <div className="p-4 font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {f.montantDu} CFA
                      </div>
                      <div className="p-4 text-gray-800 dark:text-gray-200 truncate">{f.dateEmission}</div>
                      <div className="p-4 truncate">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                            f.statut === "payee"
                              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/50"
                              : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/50"
                          }`}
                        >
                          {f.statut === "payee" ? "Payée" : "Non payée"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
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