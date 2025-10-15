"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FiRefreshCw, FiFilter } from "react-icons/fi";
import {
  fetchStatsFactures,
  fetchFacturesByType,
  fetchFacturesParMois,
  fetchPaymentsByDay,
  fetchPaymentsByTresorier,
  fetchRoleDistribution,
} from "@/lib/api";
import StatCard from "../../../components/StatCard";
import FacturesTable from "../../../components/FacturesTable";
import RoleDistributionChart from "../../../components/RoleDistributionChart";
import PaymentsByDayChart from "../../../components/PaymentsByDayChart";
import PaymentsByTresorierChart from "../../../components/PaymentsByTresorierChart";

export default function StatsPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [facturesList, setFacturesList] = useState<any[]>([]);
  const [selectedListTitle, setSelectedListTitle] = useState<string | null>(null);
  const [mois, setMois] = useState<number>(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [paymentsByDay, setPaymentsByDay] = useState<any[]>([]);
  const [paymentsByTresorier, setPaymentsByTresorier] = useState({
    with_tresorier: 0,
    without_tresorier: 0,
  });

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    loadPaymentsByDay(mois, annee);
    loadPaymentsByTresorier(mois, annee);
  }, [mois, annee]);

  const refreshAll = async () => {
    setLoading(true);
    try {
      const s = await fetchStatsFactures();
      setStats(s);

      const roles = await fetchRoleDistribution();
      const roleArr = Object.entries(roles).map(([k, v]) => ({
        name: k,
        value: Number(v),
      }));
      setRoleData(roleArr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (type: "all" | "payees" | "non-payees") => {
    setSelectedListTitle(
      type === "all"
        ? "Toutes les factures"
        : type === "payees"
        ? "Factures Payées"
        : "Factures Non Payées"
    );
    const data = await fetchFacturesByType(type);
    setFacturesList(Array.isArray(data) ? data : []);
  };

  const handleFilterMois = async () => {
    setSelectedListTitle(`Factures - ${mois}/${annee}`);
    const data = await fetchFacturesParMois(mois, annee);
    setFacturesList(Array.isArray(data) ? data : []);
  };

  const loadPaymentsByDay = async (moisVal: number, anneeVal: number) => {
    const data = await fetchPaymentsByDay(moisVal, anneeVal);
    const mapped = (data || []).map((d: any) => ({
      day: String(d.day),
      total: Number(d.total),
    }));
    setPaymentsByDay(mapped);
  };

  const loadPaymentsByTresorier = async (moisVal: number, anneeVal: number) => {
    const data = await fetchPaymentsByTresorier(moisVal, anneeVal);
    setPaymentsByTresorier({
      with_tresorier: Number(data.with_tresorier ?? 0),
      without_tresorier: Number(data.without_tresorier ?? 0),
    });
  };

  const paymentsByDayChartData = useMemo(() => {
    const daysInMonth = new Date(annee, mois, 0).getDate();
    const map = new Map(paymentsByDay.map((d: any) => [Number(d.day), d.total]));
    const arr = [];
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ day: d, total: map.get(d) || 0 });
    }
    return arr;
  }, [paymentsByDay, mois, annee]);

  return (
    <div className="min-h-screen p-6 lg:p-8 overflow-hidden">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Statistiques & Rapports
      </h1>

      {/* Filtre */}
      <div className="flex flex-wrap gap-3 items-center mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300">
        <label className="text-sm text-gray-600 dark:text-gray-400">Mois</label>
        <input
          type="number"
          min={1}
          max={12}
          value={mois}
          onChange={(e) =>
            setMois(Math.max(1, Math.min(12, Number(e.target.value) || 1)))
          }
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-24 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 transition-all duration-300"
        />
        <label className="text-sm text-gray-600 dark:text-gray-400">Année</label>
        <input
          type="number"
          min={2000}
          value={annee}
          onChange={(e) =>
            setAnnee(Number(e.target.value) || new Date().getFullYear())
          }
          className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none text-sm text-gray-800 dark:text-gray-200 transition-all duration-300"
        />
        <button
          onClick={handleFilterMois}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <FiFilter size={16} />
          Filtrer
        </button>
        <button
          onClick={refreshAll}
          className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <FiRefreshCw size={16} />
          Rafraîchir
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Factures"
          value={loading ? "..." : stats?.total_factures ?? 0}
          color="#2563EB"
          onClick={() => handleCardClick("all")}
        />
        <StatCard
          title="Factures Payées"
          value={loading ? "..." : stats?.total_payees ?? 0}
          color="#16A34A"
          onClick={() => handleCardClick("payees")}
        />
        <StatCard
          title="Factures Non Payées"
          value={loading ? "..." : stats?.total_non_payees ?? 0}
          color="#EF4444"
          onClick={() => handleCardClick("non-payees")}
        />
      </div>

      {/* Totaux + tableau + rôles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant total généré ce mois
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {loading ? "..." : (stats?.montant_total ?? 0).toLocaleString()} CFA
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant payé ce mois
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {loading ? "..." : (stats?.montant_payees ?? 0).toLocaleString()} CFA
              </div>
            </div>
          </div>

          {selectedListTitle && (
            <FacturesTable title={selectedListTitle} facturesList={facturesList} />
          )}
        </div>

        <RoleDistributionChart data={roleData} />
      </div>

      {/* Graphiques bas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PaymentsByDayChart
          data={paymentsByDayChartData}
          mois={mois}
          annee={annee}
        />
        <PaymentsByTresorierChart
          data={[
            { name: "Avec trésorier", value: paymentsByTresorier.with_tresorier },
            { name: "Sans trésorier", value: paymentsByTresorier.without_tresorier },
          ]}
        />
      </div>
    </div>
  );
}