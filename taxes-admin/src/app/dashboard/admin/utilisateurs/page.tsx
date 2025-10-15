"use client";

import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser } from "@/lib/api";
import UserForm from "../../../components/UserForm";
import UserTable from "../../../components/UserTable";
import { FiCheckCircle, FiXCircle, FiUsers } from "react-icons/fi";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    tel: "",
    email: "",
    adresse: "",
    role: "agent",
    password: "",
    cni: "",
    dNaissance: "",
    vehicule: { immatriculation: "", marque: "", modele: "", annee: "" },
  });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: " Erreur lors du chargement des utilisateurs." });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        const { password, vehicule, ...payload } = form;
        await updateUser(editingUserId, payload);
        setMessage({ type: "success", text: " Utilisateur modifié avec succès !" });
      } else {
        const payload = {
          ...form,
          vehicules: form.role === "conducteur" ? [form.vehicule] : [],
        };
        await createUser(payload);
        setMessage({ type: "success", text: " Utilisateur créé avec succès !" });
      }
      setForm({
        prenom: "",
        nom: "",
        tel: "",
        email: "",
        adresse: "",
        role: "agent",
        password: "",
        cni: "",
        dNaissance: "",
        vehicule: { immatriculation: "", marque: "", modele: "", annee: "" },
      });
      setEditingUserId(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err?.response?.data?.detail || " Erreur lors de l'action sur l'utilisateur.",
      });
    }
  };

  const handleEdit = (user: any) => {
    setForm({
      prenom: user.prenom,
      nom: user.nom,
      tel: user.tel,
      email: user.email,
      adresse: user.adresse || "",
      role: user.role,
      password: "",
      cni: user.cni || "",
      dNaissance: user.dNaissance || "",
      vehicule: user.vehicule || { immatriculation: "", marque: "", modele: "", annee: "" },
    });
    setEditingUserId(user.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculs pour les cartes
  const totalUsers = users.length;
  const conducteurs = users.filter((u) => u.role === "conducteur").length;
  const agents = users.filter((u) => u.role === "agent").length;
  const tresoriers = users.filter((u) => u.role === "tresorier").length;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen p-6 lg:p-8 overflow-hidden">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Gestion Utilisateurs
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Utilisateurs", value: totalUsers, color: "text-blue-500" },
          { label: "Conducteurs", value: conducteurs, color: "text-green-500" },
          { label: "Agents", value: agents, color: "text-purple-500" },
          { label: "Trésoriers", value: tresoriers, color: "text-orange-500" },
          { label: "Admins", value: admins, color: "text-red-500" },
        ].map(({ label, value, color }, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <FiUsers className={`${color} text-2xl`} />
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form and Table */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300">
          <UserForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            editingUserId={editingUserId}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <UserTable users={users} search={search} setSearch={setSearch} handleEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}