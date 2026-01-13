import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle,
  CheckCircle,
  X,
  Bell,
  Zap,
  Droplets,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { CONFIG } from "~/config/constants";
import type { Route } from "./+types/alerts";
import { clsx } from "clsx";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Historique des Alertes - GlycAmed" }];
}

interface Alert {
  _id: string;
  date: string;
  type: "sugar" | "caffeine" | "both";
  sugarTotal: number;
  caffeineTotal: number;
  triggeredAt: string;
}

import { useApi } from "~/hooks/useApi";

// ... existing code ...

export default function Alerts() {
  const navigate = useNavigate();
  const { data, loading } = useApi<Alert[]>("/api/alert/history", {
    immediate: true,
  });
  const alerts = data || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold">Historique des Alertes</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Chargement des incidents...
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun incident</h3>
            <p className="text-slate-500 mt-2">
              Amed a été exemplaire jusqu'à présent !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={clsx(
                  "p-6 rounded-2xl border flex flex-col md:flex-row gap-6 md:items-center shadow-sm transition-transform hover:scale-[1.01]",
                  alert.type === "both"
                    ? "bg-red-50 border-red-200"
                    : "bg-orange-50 border-orange-200"
                )}
              >
                {/* Icône et Date */}
                <div className="flex items-center gap-4 md:w-1/3">
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      alert.type === "both"
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                    )}
                  >
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p
                      className={clsx(
                        "font-bold text-lg",
                        alert.type === "both"
                          ? "text-red-900"
                          : "text-orange-900"
                      )}
                    >
                      {alert.type === "both"
                        ? "Alerte Critique"
                        : alert.type === "sugar"
                          ? "Excès de Sucre"
                          : "Excès de Caféine"}
                    </p>
                    <div className="flex items-center gap-1 text-sm opacity-75">
                      <Calendar className="w-3 h-3" />
                      {new Date(alert.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Détails */}
                <div className="flex-1 flex gap-4 justify-start md:justify-end">
                  <div
                    className={clsx(
                      "px-4 py-2 rounded-xl flex items-center gap-2",
                      alert.type === "sugar" || alert.type === "both"
                        ? "bg-white/60 border border-red-100"
                        : "opacity-50"
                    )}
                  >
                    <Zap className="w-4 h-4 text-pink-500" />
                    <span className="font-semibold">
                      {alert.sugarTotal.toFixed(1)}g
                    </span>
                    <span className="text-xs text-slate-500">
                      / {CONFIG.HEALTH_LIMITS.SUGAR}g
                    </span>
                  </div>

                  <div
                    className={clsx(
                      "px-4 py-2 rounded-xl flex items-center gap-2",
                      alert.type === "caffeine" || alert.type === "both"
                        ? "bg-white/60 border border-red-100"
                        : "opacity-50"
                    )}
                  >
                    <Droplets className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold">
                      {alert.caffeineTotal}mg
                    </span>
                    <span className="text-xs text-slate-500">
                      / {CONFIG.HEALTH_LIMITS.CAFFEINE}mg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
