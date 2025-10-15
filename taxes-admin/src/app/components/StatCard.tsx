"use client";

import React from "react";

export default function StatCard({ title, value, color, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
      role="button"
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100" style={{ color }}>
        {value ?? 0}
      </div>
    </div>
  );
}