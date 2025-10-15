"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function PaymentsByTresorierChart({ data }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-[22rem] border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Paiements — avec / sans trésorier
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            <Cell fill="#16A34A" />
            <Cell fill="#EF4444" />
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}