"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function PaymentsByDayChart({ data, mois, annee }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 lg:col-span-2 h-[22rem] border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Paiements par jour ({mois}/{annee})
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="total" fill="#2563EB" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}