"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { FiMail, FiLock, FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await login(email, password);
      // La redirection est gérée dans AuthContext
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.detail || "❌ Erreur de connexion.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Form Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 max-w-md mx-auto"
        >
          {/* Header */}
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Connexion
          </h2>

          {/* Message */}
          {message && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg shadow-md text-sm font-medium transition-all duration-300 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-700 mb-6"
            >
              <FiXCircle size={18} />
              <span>{message.text}</span>
            </div>
          )}

          {/* Form Inputs */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiMail className="text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <FiLock className="text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  Connexion...
                </>
              ) : (
                <>
                  <FiCheckCircle size={16} />
                  Se connecter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}