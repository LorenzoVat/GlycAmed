import { useState, useEffect } from "react";
import { useApi } from "~/hooks/useApi";
import { useUser } from "~/context/UserContext";
import { Navbar } from "~/components/Navbar";
import { StatCard } from "~/components/StatCard";
import { Badge } from "~/components/Badge";
import { CONFIG } from "~/config/constants";
import { useNavigate } from "react-router";
import {
  User as UserIcon,
  Activity,
  Zap,
  Flame,
  Users,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Trophy,
  PieChart,
} from "lucide-react";
import type { Route } from "./+types/dashboard";
import { clsx } from "clsx";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard - GlycAmed" }];
}

interface DashboardData {
  totals: {
    sugar: number;
    caffeine: number;
    calories: number;
    contributions: number;
  };
  healthStatus: { isSugarOverLimit: boolean; isCaffeineOverLimit: boolean };
}

interface Consumption {
  _id: string;
  productName: string;
  quantityMl: number;
  nutrients: { sugar: number; caffeine: number; calories: number };
  consumedAt: string;
  contributorId: { firstName: string; lastName: string };
  location?: string;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `il y a ${Math.floor(interval)} an(s)`;
  interval = seconds / 2592000;
  if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
  interval = seconds / 86400;
  if (interval > 1) return `il y a ${Math.floor(interval)} j`;
  interval = seconds / 3600;
  if (interval > 1) return `il y a ${Math.floor(interval)} h`;
  interval = seconds / 60;
  if (interval > 1) return `il y a ${Math.floor(interval)} min`;

  return "à l'instant";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: userLoading, logout } = useUser();

  const { data: stats, loading: statsLoading } = useApi<DashboardData>(
    "/api/dashboard",
    { immediate: true }
  );
  const { data: historyData, loading: historyLoading } = useApi<Consumption[]>(
    "/api/consumption/all",
    { immediate: true }
  );
  const history = historyData || [];

  const loading = userLoading || statsLoading || historyLoading;

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/");
    }
  }, [user, userLoading, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600 font-medium">
        Chargement...
      </div>
    );

  const sugarCurrent = stats?.totals.sugar || 0;
  const caffeineCurrent = stats?.totals.caffeine || 0;

  const isSugarOver = stats?.healthStatus.isSugarOverLimit;
  const isCaffeineOver = stats?.healthStatus.isCaffeineOverLimit;

  let statusTitle = "✅ Sous les limites";
  let statusMessage = "Tout va bien, Amed gère sa consommation.";
  let statusColor = "bg-emerald-50 border-emerald-100 text-emerald-900";
  let StatusIcon = CheckCircle;

  if (isSugarOver && isCaffeineOver) {
    statusTitle = "🚨 Toutes les limites dépassées";
    statusMessage =
      "Alerte rouge ! Sucre et caféine sont au-dessus des seuils.";
    statusColor = "bg-red-50 border-red-200 text-red-900";
    StatusIcon = AlertTriangle;
  } else if (isSugarOver) {
    statusTitle = "⚠️ Limite de sucre dépassée";
    statusMessage = "Attention au diabète, Amed a mangé trop de sucre.";
    statusColor = "bg-orange-50 border-orange-200 text-orange-900";
    StatusIcon = AlertTriangle;
  } else if (isCaffeineOver) {
    statusTitle = "⚠️ Limite de caféine dépassée";
    statusMessage = "Attention aux palpitations, Amed a bu trop de caféine.";
    statusColor = "bg-orange-50 border-orange-200 text-orange-900";
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-2">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div
          className={clsx(
            "rounded-2xl p-6 border flex items-start gap-4 shadow-sm transition-all",
            statusColor
          )}
        >
          <StatusIcon className="w-8 h-8 shrink-0" />
          <div className="flex-1">
            <h2 className="text-lg font-bold">{statusTitle}</h2>
            <p className="text-sm mt-1 opacity-90">{statusMessage}</p>
          </div>
          <button
            onClick={() => navigate("/alerts")}
            className="text-sm font-semibold underline opacity-80 hover:opacity-100 whitespace-nowrap cursor-pointer"
          >
            Voir historique
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Sucre"
            value={sugarCurrent}
            icon={Zap}
            iconColor="text-pink-500"
            unit="g"
            limit={CONFIG.HEALTH_LIMITS.SUGAR}
            isOverLimit={isSugarOver}
          />

          <StatCard
            label="Caféine"
            value={caffeineCurrent}
            icon={Activity}
            iconColor="text-purple-500"
            unit="mg"
            limit={CONFIG.HEALTH_LIMITS.CAFFEINE}
            isOverLimit={isCaffeineOver}
          />

          <StatCard
            label="Calories"
            value={stats?.totals.calories || 0}
            icon={Flame}
            iconColor="text-orange-500"
            type="simple"
          />

          <StatCard
            label="Contributions"
            value={stats?.totals.contributions || 0}
            icon={Users}
            iconColor="text-blue-500"
            type="interactive"
            onClick={() => navigate("/leaderboard")}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-0">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">
              Dernières activités
            </h3>

            <button
              onClick={() => navigate("/add")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Aucune consommation aujourd'hui.
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {history.slice(0, 4).map((item) => (
                <li
                  key={item._id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg shrink-0">
                      🥤
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        <span className="font-semibold text-emerald-800">
                          {item.contributorId?.firstName}
                        </span>{" "}
                        a ajouté{" "}
                        <span className="font-semibold">
                          {item.productName}
                        </span>{" "}
                        {item.quantityMl}ml
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(item.consumedAt)}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />À {item.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        label={`+${item.nutrients.sugar}g sucre`}
                        variant={
                          item.nutrients.sugar > 20 ? "bg-red" : "bg-slate"
                        }
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {history.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => navigate("/history")}
                className="w-full py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Voir tout l'historique <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/add")}
          className="md:hidden fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-xl shadow-emerald-600/30 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group z-50 cursor-pointer"
        >
          <Plus className="w-8 h-8" />
        </button>
      </main>
    </div>
  );
}
