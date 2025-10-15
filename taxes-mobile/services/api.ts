// services/api.ts
import axios from 'axios';

//const API_URL = 'http://localhost:8080';
const API_URL = 'http://192.168.1.5:8080';

export async function loginRequest(email: string, password: string) {
  try {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);

    const res = await axios.post(`${API_URL}/auth/login`, form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
console.log('LOGIN RESPONSE', res.data);
    return res.data; // { access_token, token_type }
  } catch (err: any) {
    // Si l'API renvoie 401
    const msg =
      err.response?.data?.detail || 'Impossible de se connecter';
    throw new Error(msg);
  }
}


// 👉 nouvelle fonction
export async function fetchFacturesConducteur(
  userId: number,
  token: string
) {
  const res = await axios.get(`${API_URL}/factures/conducteur/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function payerFacture(factureId: number, token: string, userId: number) {
  const res = await axios.post(
    `${API_URL}/paiements/payer/${factureId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user-id': userId, // optionnel mais recommandé pour la sécurité
      },
    }
  );
  return res.data;
}

// Agent pour conducteur 

export async function fetchConducteurs(token: string) {
  const res = await axios.get(`${API_URL}/conducteurs/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // tableau de conducteurs
}

export async function searchConducteurByImmatriculation(
  immatriculation: string,
  token: string
) {
  const res = await axios.get(`${API_URL}/conducteurs/search`, {
    params: { immatriculation },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // objet conducteur
}

//Stats pour agent 
// Statistiques globales
export async function fetchStats(token: string) {
  const res = await axios.get(`${API_URL}/factures/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// Statistiques filtrées par mois/année
export async function fetchStatsByMonth(
  token: string,
  mois: number,
  annee: number
) {
  const res = await axios.get(`${API_URL}/factures/par-mois`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { mois, annee },
  });
  // on veut juste la liste -> on recompte côté front
  return res.data;
}

// 🆕 Lister toutes les factures
export async function fetchAllFactures(token: string) {
  const res = await axios.get(`${API_URL}/factures/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 🆕 Lister factures payées
export async function fetchFacturesPayees(token: string) {
  const res = await axios.get(`${API_URL}/factures/payees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 🆕 Lister factures non payées
export async function fetchFacturesNonPayees(token: string) {
  const res = await axios.get(`${API_URL}/factures/non-payees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchFacturesByConducteur(token: string, conducteurId: number) {
  try {
    const res = await fetch(`${API_URL}/factures/conducteur/${conducteurId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Erreur lors du chargement des factures');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}