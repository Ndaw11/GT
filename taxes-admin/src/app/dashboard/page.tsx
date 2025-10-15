"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    else if (user?.role === "admin") router.push("/dashboard/admin");
    else if (user?.role === "tresorier") router.push("/dashboard/tresorier");
  }, [isAuthenticated, user, router]);

  return <p className="p-6">Redirection en cours...</p>;
}
