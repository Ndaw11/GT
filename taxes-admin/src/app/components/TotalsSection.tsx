"use client";

import React from "react";
import StatCard from "./StatCard";

export default function TotalsSection({ totals, onCardClick }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Factures"
        value={totals.totalFactures}
        color="#2563EB"
        onClick={() => onCardClick("factures")}
      />
      <StatCard
        title="Factures Payées"
        value={totals.facturesPayees}
        color="#16A34A"
        onClick={() => onCardClick("facturesPayees")}
      />
      <StatCard
        title="Factures Non Payées"
        value={totals.facturesNonPayees}
        color="#EF4444"
        onClick={() => onCardClick("facturesNonPayees")}
      />
      <StatCard
        title="Factures Partiellement Payées"
        value={totals.facturesPartiellementPayees}
        color="#F59E0B"
        onClick={() => onCardClick("facturesPartiellementPayees")}
      />
    </div>
  );
}
