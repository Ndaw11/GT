"use client";

import { FiEdit2, FiSearch, FiX } from "react-icons/fi";

export default function UserTable({ users, search, setSearch, handleEdit }: any) {
  const filtered = users.filter((u: any) => {
    const q = search.toLowerCase();
    return (
      u.prenom?.toLowerCase().includes(q) ||
      u.nom?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.tel?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.matricule?.toLowerCase().includes(q) ||
      u.cni?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-transparent rounded-xl transition-all duration-300">
      {/* Barre de recherche */}
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50 dark:bg-gray-900 rounded-t-xl">
        <FiSearch className="text-gray-500 dark:text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
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

      {/* Tableau */}
      <div className="flex flex-col min-h-0">
        {/* En-têtes fixes */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1.2fr_0.8fr_1fr_1fr_1fr_1fr_0.6fr] bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          {["Nom", "Prénom", "Matricule", "Email", "Rôle", "Date naissance", "CNI", "Adresse", "Tel", "Actions"].map((h) => (
            <div
              key={h}
              className="p-3 text-left text-gray-700 dark:text-gray-200 font-semibold text-xs whitespace-nowrap truncate"
            >
              {h}
            </div>
          ))}
        </div>

        {/* Corps scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[400px]">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400 italic">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {filtered.map((u: any) => (
                <div
                  key={u.id}
                  className="grid grid-cols-[1fr_1fr_1fr_1.2fr_0.8fr_1fr_1fr_1fr_1fr_0.6fr] group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  {/* Nom */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">{u.nom}</div>
                  
                  {/* Prénom */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">{u.prenom}</div>
                  
                  {/* Matricule */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">{u.matricule || "-"}</div>
                  
                  {/* Email légèrement élargi */}
                  <div className="p-3 relative group/email">
                    <div className="text-gray-800 dark:text-gray-200 truncate text-xs">
                      {u.email}
                    </div>
                    {/* Tooltip qui remplace le contenu tronqué */}
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 hidden group-hover/email:block z-10 rounded border border-blue-300 dark:border-blue-600 shadow-lg">
                      <div className="p-3 text-gray-800 dark:text-gray-200 text-xs whitespace-nowrap overflow-visible">
                        {u.email}
                      </div>
                    </div>
                  </div>
                  
                  {/* Rôle (légèrement réduit) */}
                  <div className="p-3 truncate">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                        u.role === "admin"
                          ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400"
                          : u.role === "tresorier"
                          ? "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400"
                          : u.role === "conducteur"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400"
                          : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  
                  {/* Date naissance */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">
                    {u.dNaissance || "-"}
                  </div>
                  
                  {/* CNI */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">
                    {u.cni || "-"}
                  </div>
                  
                  {/* Adresse */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">
                    {u.adresse || "-"}
                  </div>
                  
                  {/* Tel */}
                  <div className="p-3 text-gray-800 dark:text-gray-200 truncate text-xs">{u.tel}</div>
                  
                  {/* Actions (colonne ajustée) */}
                  <div className="p-3 flex items-center justify-center">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      <FiEdit2 size={16} />
                    </button>
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