import axios from "axios";

// ==========================
// 🔹 CONFIG API
// ==========================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ==========================
// 🔹 AUTH
// ==========================
export const login = async (email: string, password: string) => {
  const res = await api.post(
    "/auth/login",
    new URLSearchParams({
      username: email,
      password: password,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return res.data;
};

export const createUser = async (user: any) => {
  const payload: any = {
    prenom: user.prenom,
    nom: user.nom,
    tel: user.tel,
    email: user.email,
    adresse: user.adresse,
    role: user.role,
    password: user.password,
    cni: user.cni,
    dNaissance: user.dNaissance,
  };

  if (user.role === "conducteur") {
    payload.vehicules = [
      {
        immatriculation: user.vehicule.immatriculation,
        marque: user.vehicule.marque,
        modele: user.vehicule.modele,
        annee: user.vehicule.annee,
        type: user.vehicule.modele,
      },
    ];
  }

  const res = await api.post("/auth/register", payload);
  return res.data;
};

// ==========================
// 🔹 UTILISATEURS
// ==========================
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id: string | number) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: string | number, user: unknown) => {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: string | number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const searchUsers = async (
  query: string | Record<string, string | number | boolean>
) => {
  const params = new URLSearchParams();

  if (typeof query === "string") {
    params.append("matricule", query);
    params.append("immatriculation", query);
    params.append("nom", query);
    params.append("prenom", query);
  } else if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `/users/search?${queryString}` : `/users/search`;
  const res = await api.get(url);
  return res.data;
};

// ==========================
// 🔹 CONDUCTEURS
// ==========================
export const fetchConducteurs = async () => {
  const res = await api.get("/conducteurs");
  return res.data;
};

// ==========================
// 🔹 FACTURES
// ==========================
export const getFactures = async () => {
  const res = await api.get("/factures");
  return res.data;
};

export const getFacturesByConducteur = async (conducteurId: string | number) => {
  const res = await api.get(`/factures/conducteur/${conducteurId}`);
  return res.data;
};

export const fetchFactures = async (
  conducteurId: number,
  filters: { statut?: string; mois?: string; annee?: string }
) => {
  let url = `/factures/conducteur/${conducteurId}`;

  if (filters.mois && filters.annee) {
    url = `/factures/conducteur/${conducteurId}/par-mois?mois=${filters.mois}&annee=${filters.annee}`;
    if (filters.statut) url += `&statut=${filters.statut}`;
  } else if (filters.statut && filters.statut !== "tous") {
    url = `/factures/conducteur/${conducteurId}/statut?statut=${filters.statut}`;
  }

  const res = await api.get(url);

  // ⚡ Assure qu'on renvoie toujours un tableau
  if (Array.isArray(res.data)) {
    return res.data;
  } else if (res.data && res.data.factures) {
    return res.data.factures;
  } else {
    return [];
  }
};


// === TAXES ===
// === TAXES ===
export const fetchTaxes = async (filter: "all" | "active" | "inactive" = "active") => {
  try {
    const res = await api.get("/taxes", { params: { filter } });
    return res.data;
  } catch (error) {
    console.error("Erreur fetchTaxes:", error);
    return [];
  }
};

// === FACTURES ===
export const generateFactures = async (taxeId: number) => {
  try {
    const res = await api.post(`/generate-factures/${taxeId}`);
    return res.data;
  } catch (error) {
    console.error("Erreur generateFactures:", error);
    throw error;
  }
};


export const createTaxe = async (taxe: any) => {
  const res = await api.post("/taxes", taxe);
  return res.data;
};

export const updateTaxe = async (id: number, taxe: any) => {
  const res = await api.put(`/taxes/${id}`, taxe);
  return res.data;
};

// Activer ou désactiver une taxe
export const setTaxeActive = async (id: number, active: boolean) => {
  const res = await api.put(`/taxes/${id}/active?active=${active}`);
  return res.data;
};


// === NOTIFICATIONS ===
export const fetchNotifications = async () => {
  try {
    const res = await api.get("/modeles-notifications");
    return res.data;
  } catch (error) {
    console.error("Erreur fetchNotifications:", error);
    return [];
  }
};

export const createNotification = async (notif: {
  titre: string;
  message: string;
  type_notification: string;
}) => {
  try {
    const res = await api.post("/modeles-notifications", notif);
    return res.data;
  } catch (error) {
    console.error("Erreur createNotification:", error);
    throw error;
  }
};

export const updateNotification = async (id: number, notif: any) => {
  try {
    const res = await api.put(`/modeles-notifications/${id}`, notif);
    return res.data;
  } catch (error) {
    console.error("Erreur updateNotification:", error);
    throw error;
  }
};

export const deleteNotification = async (id: number) => {
  try {
    await api.delete(`/modeles-notifications/${id}`);
  } catch (error) {
    console.error("Erreur deleteNotification:", error);
    throw error;
  }
};


export const fetchStatsFactures = async () => {
  try {
    const res = await api.get("/factures/stats");
    return res.data;
  } catch (error) {
    console.error("Erreur fetchStatsFactures:", error);
    return null;
  }
};

export const fetchFacturesByType = async (type: "all" | "payees" | "non-payees") => {
  try {
    let url = "/factures";
    if (type === "payees") url = "/factures/payees";
    else if (type === "non-payees") url = "/factures/non-payees";

    const res = await api.get(url);
    return res.data || [];
  } catch (error) {
    console.error("Erreur fetchFacturesByType:", error);
    return [];
  }
};

export const fetchFacturesParMois = async (
  mois: number,
  annee: number,
  statut?: "payee" | "non_payee"
) => {
  try {
    const params: any = { mois, annee };
    if (statut) params.statut = statut;

    const res = await api.get("/factures/par-mois", { params });
    return res.data || [];
  } catch (error) {
    console.error("Erreur fetchFacturesParMois:", error);
    return [];
  }
};

/**
 * PAIEMENTS / STATS pour graphiques
 * (ces endpoints doivent exister côté backend — exemples fournis après)
 */

export const fetchPaymentsByDay = async (mois: number, annee: number) => {
  try {
    const res = await api.get("/paiements/stats/daily", {
      params: { mois, annee },
    });
    return res.data; // attend : [{ day: 1, total: 12000 }, ...]
  } catch (error) {
    console.error("Erreur fetchPaymentsByDay:", error);
    return [];
  }
};


export const fetchPaymentsByTresorier = async (mois: number, annee: number) => {
  try {
    const res = await api.get("/paiements/stats/by-tresorier", {
      params: { mois, annee },
    });
    return res.data || { with_tresorier: 0, without_tresorier: 0 };
  } catch (error) {
    console.error("Erreur fetchPaymentsByTresorier:", error);
    return { with_tresorier: 0, without_tresorier: 0 };
  }
};


export const fetchRoleDistribution = async () => {
  try {
    // attend : { admin: 2, tresorier: 3, agent: 10 }
    const res = await api.get("/users/stats/roles");
    return res.data || {};
  } catch (error) {
    console.error("Erreur fetchRoleDistribution:", error);
    return {};
  }
};


// Récupérer les factures selon l’immatricule du véhicule
export const fetchFacturesParImmatricule = async (immatricule: string) => {
  const res = await api.get(`/factures/vehicule/${immatricule}`);
  return res.data;
}

// @/lib/api.ts
export const effectuerPaiement = async (factureId: number, tresorierId: number) => {
  const res = await api.post(
    `/paiements/payer_par_tresorier/${factureId}`,
    {}, // body vide
    {
      headers: {
        "x-tresorier-id": tresorierId.toString(), // ✅ Convertir en string
      },
    }
  );
  return res.data;
};