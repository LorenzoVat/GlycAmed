import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  LogOut,
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
} from "lucide-react";
import type { Route } from "./+types/dashboard";
import { clsx } from "clsx";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard - GlycAmed" }];
}

const LIMITS = { SUGAR: 50, CAFFEINE: 400 };

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
  if (interval > 1) return `il y a ${Math.floor(interval)} ans`;
  interval = seconds / 2592000;
  if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
  interval = seconds / 86400;
  if (interval > 1) return `il y a ${Math.floor(interval)} jours`;
  interval = seconds / 3600;
  if (interval > 1) return `il y a ${Math.floor(interval)} h`;
  interval = seconds / 60;
  if (interval > 1) return `il y a ${Math.floor(interval)} min`;

  return "à l'instant";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [history, setHistory] = useState<Consumption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/user/me");
        if (!userRes.ok) throw new Error("Non connecté");
        setUser(await userRes.json());

        const dashRes = await fetch("/dashboard");
        if (dashRes.ok) setStats(await dashRes.json());

        const historyRes = await fetch("/consumption/all");
        if (historyRes.ok) setHistory(await historyRes.json());
      } catch (err) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("/user/logout", { method: "POST" });
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600 font-medium">
        Chargement...
      </div>
    );

  const sugarCurrent = stats?.totals.sugar || 0;
  const caffeineCurrent = stats?.totals.caffeine || 0;
  const sugarWidth = Math.min((sugarCurrent / LIMITS.SUGAR) * 100, 100);
  const caffeineWidth = Math.min(
    (caffeineCurrent / LIMITS.CAFFEINE) * 100,
    100
  );

  const getBarColor = (current: number, max: number) => {
    if (current > max) return "bg-red-500";
    if (current > max * 0.75) return "bg-orange-400";
    return "bg-emerald-500";
  };

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-emerald-800 text-xl">
            <Activity className="w-6 h-6" /> GlycAmed
          </div>
          <div className="flex items-center gap-4">
            <div
              onClick={() => navigate("/profile")}
              className="hidden md:flex items-center gap-2 text-slate-600 text-sm bg-slate-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <UserIcon className="w-4 h-4 text-emerald-700" />
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        <div
          className={clsx(
            "rounded-2xl p-6 border flex items-start gap-4 shadow-sm",
            statusColor
          )}
        >
          <StatusIcon className="w-8 h-8 shrink-0" />
          <div>
            <h2 className="text-lg font-bold">{statusTitle}</h2>
            <p className="text-sm mt-1 opacity-90">{statusMessage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Zap className="w-4 h-4 text-pink-500" /> Sucre
              </div>
              {isSugarOver && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  DANGER
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span
                className={clsx(
                  "text-3xl font-bold",
                  isSugarOver ? "text-red-600" : "text-slate-900"
                )}
              >
                {sugarCurrent.toFixed(1)}
              </span>
              <span className="text-slate-400 text-sm">/ {LIMITS.SUGAR}g</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  getBarColor(sugarCurrent, LIMITS.SUGAR)
                )}
                style={{ width: `${sugarWidth}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
              Max recommandé : {LIMITS.SUGAR}g/jour
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Activity className="w-4 h-4 text-purple-500" /> Caféine
              </div>
              {isCaffeineOver && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                  DANGER
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span
                className={clsx(
                  "text-3xl font-bold",
                  isCaffeineOver ? "text-red-600" : "text-slate-900"
                )}
              >
                {caffeineCurrent.toFixed(0)}
              </span>
              <span className="text-slate-400 text-sm">
                / {LIMITS.CAFFEINE}mg
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  getBarColor(caffeineCurrent, LIMITS.CAFFEINE)
                )}
                style={{ width: `${caffeineWidth}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
              Max recommandé : {LIMITS.CAFFEINE}mg/jour
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
              <Flame className="w-4 h-4 text-orange-500" /> Calories
            </div>
            <span className="text-3xl font-bold block text-slate-900">
              {stats?.totals.calories.toFixed(0)}
            </span>
            <span className="text-xs text-slate-400">kcal cumulées</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
              <Users className="w-4 h-4 text-blue-500" /> Contributions
            </div>
            <span className="text-3xl font-bold block text-slate-900">
              {stats?.totals.contributions}
            </span>
            <span className="text-xs text-slate-400">entrées aujourd'hui</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">
              Fil d'actualité
            </h3>
            <button
              onClick={() => navigate("/history")}
              className="text-sm text-emerald-600 font-medium hover:underline"
            >
              Voir tout
            </button>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Aucune activité récente.
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {history.slice(0, 5).map((item) => (
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
                      <span
                        className={clsx(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          item.nutrients.sugar > 20
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-800"
                        )}
                      >
                        +{item.nutrients.sugar}g sucre
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => navigate("/add")}
          className="fixed bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-xl shadow-emerald-600/30 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group z-50 cursor-pointer"
          title="Ajouter une consommation"
        >
          <Plus className="w-8 h-8" />
        </button>
      </main>
    </div>
  );
}
