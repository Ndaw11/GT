"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { fetchFacturesParImmatricule, effectuerPaiement } from "@/lib/api";
import { FiSearch, FiX, FiCheckCircle, FiXCircle, FiLoader, FiDollarSign, FiFilter } from "react-icons/fi";

export default function PaiementsPage() {
  const { user } = useAuth();
  const [factures, setFactures] = useState<any[]>([]);
  const [immatricule, setImmatricule] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filtreStatut, setFiltreStatut] = useState<"tous" | "payee" | "non_payee">("tous");

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSearch = async () => {
    if (!immatricule.trim()) {
      setMessage({ type: "error", text: "❌ Veuillez entrer une immatricule de véhicule." });
      return;
    }

    setLoading(true);
    try {
      const data = await fetchFacturesParImmatricule(immatricule);
      setFactures(Array.isArray(data) ? data : [data]);
      setMessage({ type: "success", text: "✅ Factures chargées avec succès !" });
    } catch (err: any) {
      console.error("Erreur recherche:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "❌ Erreur lors de la recherche des factures.",
      });
      setFactures([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaiement = async (factureId: number) => {
    if (!user) {
      setMessage({ type: "error", text: "❌ Utilisateur non connecté." });
      return;
    }

    if (user.role !== "tresorier") {
      setMessage({ type: "error", text: "❌ Seul un trésorier peut effectuer des paiements." });
      return;
    }

    const tresorierId = user.id;
    if (!tresorierId) {
      setMessage({ type: "error", text: "❌ ID trésorier non trouvé." });
      return;
    }

    try {
      const result = await effectuerPaiement(factureId, tresorierId);
      setMessage({ type: "success", text: `✅ Paiement effectué avec succès ! Facture #${result.facture_id}` });
      handleSearch(); // Refresh the list
    } catch (err: any) {
      console.error("Erreur paiement:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "❌ Erreur lors du paiement.",
      });
    }
  };

  // Filtrer les factures selon le statut sélectionné
  const facturesFiltrees = factures.filter((f) => {
    if (filtreStatut === "tous") return true;
    if (filtreStatut === "payee") return f.statut === "payee";
    if (filtreStatut === "non_payee") return f.statut !== "payee";
    return true;
  });

  // Calculs pour les statistiques
  const totalFactures = factures.length;
  const facturesPayees = factures.filter((f) => f.statut === "payee").length;
  const facturesNonPayees = totalFactures - facturesPayees;
  const montantTotal = factures.reduce((sum, f) => sum + (f.montantDu || 0), 0);
  const montantRestant = factures
    .filter((f) => f.statut !== "payee")
    .reduce((sum, f) => sum + (f.montantDu || 0), 0);

  return (
    <div className="min-h-screen p-6 lg:p-8 overflow-hidden">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Paiements des Factures
      </h1>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-md text-sm font-medium transition-all duration-300 mb-6 ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-700"
              : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-700"
          }`}
        >
          {message.type === "success" ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            label: "Total Factures", 
            value: totalFactures, 
            color: "text-blue-500",
            icon: FiDollarSign
          },
          { 
            label: "Factures Payées", 
            value: facturesPayees, 
            color: "text-green-500",
            icon: FiCheckCircle
          },
          { 
            label: "Factures Non Payées", 
            value: facturesNonPayees, 
            color: "text-red-500",
            icon: FiXCircle
          },
          { 
            label: "Montant Restant", 
            value: `${montantRestant.toLocaleString()} FCFA`, 
            color: "text-purple-500",
            icon: FiDollarSign
          },
        ].map(({ label, value, color, icon: Icon }, index) => (
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

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Barre de recherche */}
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 flex-1">
          <FiSearch className="text-gray-500 dark:text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Immatricule du véhicule (ex: AA-123-BB)"
            value={immatricule}
            onChange={(e) => setImmatricule(e.target.value)}
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
          />
          {immatricule && (
            <button
              onClick={() => setImmatricule("")}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              <FiX size={20} />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <FiSearch size={16} />
            Rechercher
          </button>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <FiFilter className="text-gray-500 dark:text-gray-400" size={20} />
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Filtrer par :</span>
          {["tous", "payee", "non_payee"].map((statut) => (
            <button
              key={statut}
              onClick={() => setFiltreStatut(statut as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                filtreStatut === statut
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {statut === "tous" ? "Tous" : statut === "payee" ? "Payées" : "Non payées"}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 h-[400px]">
        {/* En-têtes fixes */}
        <div className="grid grid-cols-5 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          {["Conducteur", "Période", "Montant dû", "Statut", "Action"].map((h) => (
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
          {loading ? (
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FiLoader className="animate-spin" size={20} />
                Chargement...
              </div>
            </div>
          ) : facturesFiltrees.length === 0 ? (
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400 italic">
              {factures.length === 0 ? "Aucune facture trouvée" : "Aucune facture ne correspond au filtre"}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {facturesFiltrees.map((f, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  {/* Conducteur */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {f.conducteur || "—"}
                  </div>
                  
                  {/* Période */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {f.periode}
                  </div>
                  
                  {/* Montant dû */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {f.montantDu?.toLocaleString()} FCFA
                  </div>
                  
                  {/* Statut */}
                  <div className="p-4 truncate">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                        f.statut === "payee"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-800/50"
                          : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/50"
                      }`}
                    >
                      {f.statut === "payee" ? "Payée" : "Non payée"}
                    </span>
                  </div>
                  
                  {/* Action */}
                  <div className="p-4 flex justify-center">
                    {f.statut !== "payee" && user?.role === "tresorier" && (
                      <button
                        onClick={() => handlePaiement(f.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-1 shadow-sm text-sm"
                      >
                        <FiDollarSign size={14} />
                        Payer
                      </button>
                    )}
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