"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#2563EB", "#16A34A", "#EF4444", "#F59E0B", "#8B5CF6"];

export default function RoleDistributionChart({ data }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 h-[32rem] border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Répartition des rôles
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie 
            data={data} 
            dataKey="value" 
            nameKey="name" 
            outerRadius={120} 
            label
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
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