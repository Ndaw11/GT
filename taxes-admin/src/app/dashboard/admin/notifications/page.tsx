"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiCheck, FiLoader, FiFileText, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { fetchNotifications, createNotification, updateNotification } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotif, setNewNotif] = useState({
    titre: "",
    message: "",
    type_notification: "facture_emise",
  });
  const [editing, setEditing] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async () => {
    if (!newNotif.titre || !newNotif.message) return;
    await createNotification(newNotif);
    setNewNotif({ titre: "", message: "", type_notification: "facture_emise" });
    refresh();
  };

  const handleUpdate = async (id: number) => {
    await updateNotification(id, editValues);
    setEditing(null);
    setEditValues({});
    refresh();
  };

  // Calculs pour les cartes
  const totalNotifications = notifications.length;
  const typesCount = notifications.reduce((acc, n) => {
    acc[n.type_notification] = (acc[n.type_notification] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen p-6 lg:p-8 overflow-hidden">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Gestion des Modèles de Notifications
      </h1>

      {/* Cartes résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Notifications", value: totalNotifications, icon: FiFileText, color: "text-blue-500" },
          { label: "Facture Émise", value: typesCount["facture_emise"] || 0, icon: FiFileText, color: "text-green-500" },
          { label: "Paiement Réussi", value: typesCount["paiement_reussi"] || 0, icon: FiCheckCircle, color: "text-purple-500" },
          { label: "Rappel Facture", value: typesCount["rappel_facture"] || 0, icon: FiAlertCircle, color: "text-red-500" },
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

      {/* Formulaire d'ajout */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6 flex gap-4 flex-wrap border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <input
          type="text"
          placeholder="Titre"
          value={newNotif.titre}
          onChange={(e) => setNewNotif({ ...newNotif, titre: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
        />
        <input
          type="text"
          placeholder="Message"
          value={newNotif.message}
          onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[200px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
        />
        <select
          value={newNotif.type_notification}
          onChange={(e) => setNewNotif({ ...newNotif, type_notification: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-40 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 transition-all duration-300"
        >
          <option value="facture_emise">Facture émise</option>
          <option value="paiement_reussi">Paiement réussi</option>
          <option value="paiement_echec">Paiement échoué</option>
          <option value="rappel_facture">Rappel facture</option>
        </select>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <FiPlus size={16} />
          Ajouter
        </button>
      </div>

      {/* Tableau avec structure similaire à Conducteurs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden transition-all duration-300 h-[400px]">
        {/* En-têtes fixes */}
        <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          {["Titre", "Message", "Type", "Actions"].map((h) => (
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
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400 italic">
              Aucun modèle de notification
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="grid grid-cols-4 group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  {/* Titre */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {editing === n.id ? (
                      <input
                        type="text"
                        defaultValue={n.titre}
                        onChange={(e) => setEditValues({ ...editValues, titre: e.target.value })}
                        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full text-sm"
                      />
                    ) : (
                      n.titre
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {editing === n.id ? (
                      <input
                        type="text"
                        defaultValue={n.message}
                        onChange={(e) => setEditValues({ ...editValues, message: e.target.value })}
                        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full text-sm"
                      />
                    ) : (
                      n.message
                    )}
                  </div>
                  
                  {/* Type */}
                  <div className="p-4 text-gray-800 dark:text-gray-200 truncate">
                    {editing === n.id ? (
                      <select
                        defaultValue={n.type_notification}
                        onChange={(e) => setEditValues({ ...editValues, type_notification: e.target.value })}
                        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 w-full text-sm"
                      >
                        <option value="facture_emise">Facture émise</option>
                        <option value="paiement_reussi">Paiement réussi</option>
                        <option value="paiement_echec">Paiement échoué</option>
                        <option value="rappel_facture">Rappel facture</option>
                      </select>
                    ) : (
                      (() => {
                        const types: Record<string, string> = {
                          facture_emise: "Facture émise",
                          paiement_reussi: "Paiement réussi",
                          paiement_echec: "Paiement échoué",
                          rappel_facture: "Rappel facture",
                        };
                        return types[n.type_notification] || n.type_notification;
                      })()
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 flex justify-center">
                    {editing === n.id ? (
                      <button
                        onClick={() => handleUpdate(n.id)}
                        className="bg-green-600 text-black px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1 text-sm"
                      >
                        <FiCheck size={14} /> Enregistrer
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing(n.id);
                          setEditValues(n);
                        }}
                        className="bg-yellow-500 text-black mr-60 px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1 text-sm"
                      >
                        <FiEdit size={14} /> Modifier
                      </button>
                    )}
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