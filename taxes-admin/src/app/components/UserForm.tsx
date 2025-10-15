"use client";

import { FiPlus, FiCheck } from "react-icons/fi";

interface UserFormProps {
  form: any;
  setForm: (form: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  editingUserId: number | null;
}

export default function UserForm({ form, setForm, handleSubmit, editingUserId }: UserFormProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
      <input
        type="text"
        placeholder="Prénom"
        value={form.prenom}
        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <input
        type="text"
        placeholder="Nom"
        value={form.nom}
        onChange={(e) => setForm({ ...form, nom: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={form.tel}
        onChange={(e) => setForm({ ...form, tel: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <input
        type="text"
        placeholder="Adresse"
        value={form.adresse}
        onChange={(e) => setForm({ ...form, adresse: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-40 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 transition-all duration-300"
      >
        <option value="agent">Agent</option>
        <option value="conducteur">Conducteur</option>
        <option value="tresorier">Trésorier</option>
        <option value="admin">Admin</option>
      </select>
      <input
        type="text"
        placeholder="CNI"
        value={form.cni}
        onChange={(e) => setForm({ ...form, cni: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      <input
        type="date"
        placeholder="Date de naissance"
        value={form.dNaissance}
        onChange={(e) => setForm({ ...form, dNaissance: e.target.value })}
        className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
      />
      {!editingUserId && (
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
        />
      )}
      {form.role === "conducteur" && (
        <div className="flex gap-4 flex-wrap w-full">
          <input
            type="text"
            placeholder="Immatriculation"
            value={form.vehicule.immatriculation}
            onChange={(e) =>
              setForm({ ...form, vehicule: { ...form.vehicule, immatriculation: e.target.value } })
            }
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
          />
          <input
            type="text"
            placeholder="Marque"
            value={form.vehicule.marque}
            onChange={(e) =>
              setForm({ ...form, vehicule: { ...form.vehicule, marque: e.target.value } })
            }
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
          />
          <input
            type="text"
            placeholder="Modèle"
            value={form.vehicule.modele}
            onChange={(e) =>
              setForm({ ...form, vehicule: { ...form.vehicule, modele: e.target.value } })
            }
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
          />
          <input
            type="number"
            placeholder="Année"
            value={form.vehicule.annee}
            onChange={(e) =>
              setForm({ ...form, vehicule: { ...form.vehicule, annee: e.target.value } })
            }
            className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 min-w-[150px] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
          />
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
      >
        {editingUserId ? <FiCheck size={16} /> : <FiPlus size={16} />}
        {editingUserId ? "Modifier" : "Ajouter"}
      </button>
    </form>
  );
}