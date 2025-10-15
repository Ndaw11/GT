"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiCheck, FiX, FiFileText, FiLoader } from "react-icons/fi";
import {
  fetchTaxes,
  createTaxe,
  updateTaxe,
  setTaxeActive,
  generateFactures,
} from "@/lib/api";

export default function TaxesPage() {
  const [taxes, setTaxes] = useState<any[]>([]);
  const [newTaxe, setNewTaxe] = useState({ libelle: "", montant: "", periodicite: "" });
  const [editing, setEditing] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshTaxes();
  }, [filter]);

  const refreshTaxes = async () => {
    setLoading(true);
    try {
      const data = await fetchTaxes(filter);
      setTaxes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTaxe.libelle || !newTaxe.montant || !newTaxe.periodicite) return;
    await createTaxe({
      ...newTaxe,
      montant: parseInt(newTaxe.montant),
      active: true,
    });
    setNewTaxe({ libelle: "", montant: "", periodicite: "" });
    refreshTaxes();
  };

  const handleUpdate = async (id: number, taxe: any) => {
    await updateTaxe(id, taxe);
    setEditing(null);
    refreshTaxes();
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    await setTaxeActive(id, active);
    refreshTaxes();
  };

  const handleGenerateFactures = async (id: number) => {
    try {
      const res = await generateFactures(id);
      alert(`✅ ${res.total_factures} factures générées`);
    } catch (err) {
      alert("❌ Erreur lors de la génération");
      console.error(err);
    }
  };

  // Cartes résumé
  const totalTaxes = taxes.length;
  const activeTaxes = taxes.filter((t) => t.active).length;
  const inactiveTaxes = totalTaxes - activeTaxes;
  const totalMontant = taxes.reduce((sum, t) => sum + t.montant, 0);

  return (
    <div className="min-h-screen p-6 lg:p-8 overflow-hidden">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Gestion des Taxes
      </h1>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Taxes", value: totalTaxes, color: "text-blue-500" },
          { label: "Actives", value: activeTaxes, color: "text-green-500" },
          { label: "Inactives", value: inactiveTaxes, color: "text-red-500" },
          { label: "Montant Total", value: `${totalMontant} CFA`, color: "text-purple-500" },
        ].map(({ label, value, color }, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className={`${color} text-2xl`}>
              <FiFileText />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtre */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "active", "inactive"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm border ${
              filter === f
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            }`}
          >
            {f === "all" ? "Tous" : f === "active" ? "Actives" : "Désactivées"}
          </button>
        ))}
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6 flex gap-4 flex-wrap border border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Nom de la taxe"
          value={newTaxe.libelle}
          onChange={(e) => setNewTaxe({ ...newTaxe, libelle: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <input
          type="number"
          placeholder="Montant (CFA)"
          value={newTaxe.montant}
          onChange={(e) => setNewTaxe({ ...newTaxe, montant: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="Périodicité"
          value={newTaxe.periodicite}
          onChange={(e) => setNewTaxe({ ...newTaxe, periodicite: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-40 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-200"
        >
          <FiPlus size={16} /> Ajouter
        </button>
      </div>

      {/* Tableau avec structure similaire à Conducteurs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 h-[400px]">
        {/* En-têtes fixes */}
        <div className="grid grid-cols-5 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          {["Nom", "Montant", "Périodicité", "Gestion", "Facture"].map((h) => (
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
          ) : taxes.length === 0 ? (
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400 italic">
              Aucune taxe enregistrée
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {taxes.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-5 group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  {/* Nom */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {editing === t.id ? (
                      <input
                        type="text"
                        defaultValue={t.libelle}
                        onChange={(e) => (t.libelle = e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full bg-transparent text-sm"
                      />
                    ) : (
                      t.libelle
                    )}
                  </div>
                  
                  {/* Montant */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {editing === t.id ? (
                      <input
                        type="number"
                        defaultValue={t.montant}
                        onChange={(e) => (t.montant = parseInt(e.target.value))}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full bg-transparent text-sm"
                      />
                    ) : (
                      `${t.montant} CFA`
                    )}
                  </div>
                  
                  {/* Périodicité */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {editing === t.id ? (
                      <input
                        type="text"
                        defaultValue={t.periodicite}
                        onChange={(e) => (t.periodicite = e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full bg-transparent text-sm"
                      />
                    ) : (
                      t.periodicite
                    )}
                  </div>
                  
                  {/* Gestion */}
                  <div className="p-4 flex gap-2 flex-wrap">
                    {editing === t.id ? (
                      <button 
                        onClick={() => handleUpdate(t.id, t)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 text-sm"
                      >
                        <FiCheck size={14} /> Enregistrer
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => setEditing(t.id)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1 text-sm"
                        >
                          <FiEdit size={14} /> Modifier
                        </button>
                        <button 
                          onClick={() => handleToggleActive(t.id, !t.active)}
                          className={`px-3 py-1 rounded text-white text-sm flex items-center gap-1 ${
                            t.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {t.active ? "Désactiver" : "Activer"}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Facture */}
                  <div className="p-4">
                    <button 
                      onClick={() => handleGenerateFactures(t.id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 flex items-center gap-1 text-sm"
                    >
                      <FiFileText size={14} /> Générer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
      `}</style>
    </div>
  );
}