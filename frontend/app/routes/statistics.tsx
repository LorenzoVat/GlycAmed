import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  MapPin,
  Clock,
  PieChart as PieIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Route } from "./+types/statistics";
import { clsx } from "clsx";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Statistiques - GlycAmed" }];
}

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

interface Consumption {
  _id: string;
  productName: string;
  quantityMl: number;
  nutrients: { sugar: number; caffeine: number; calories: number };
  consumedAt: string;
  location?: string;
  contributorId: { firstName: string; lastName: string };
}

export default function Statistics() {
  const navigate = useNavigate();
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<
    "1d" | "7d" | "30d" | "6m" | "1y" | "custom"
  >("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        let startDate = new Date();
        let endDate = new Date();

        if (period === "1d") startDate.setHours(0, 0, 0, 0);
        else if (period === "7d") startDate.setDate(startDate.getDate() - 7);
        else if (period === "30d") startDate.setDate(startDate.getDate() - 30);
        else if (period === "6m") startDate.setMonth(startDate.getMonth() - 6);
        else if (period === "1y")
          startDate.setFullYear(startDate.getFullYear() - 1);
        else if (period === "custom") {
          if (!customStart || !customEnd) {
            setLoading(false);
            return;
          }
          startDate = new Date(customStart);
          endDate = new Date(customEnd);
          endDate.setHours(23, 59, 59);
        }

        params.append("dateFrom", startDate.toISOString());
        params.append("dateTo", endDate.toISOString());

        const res = await fetch(`/api/consumption/all?${params.toString()}`);
        if (res.ok) setConsumptions(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, customStart, customEnd]);

  const stats = useMemo(() => {
    if (consumptions.length === 0) return null;

    const dailyMap = new Map<
      string,
      { date: string; sugar: number; caffeine: number }
    >();
    const productMap = new Map<string, number>();
    const locationMap = new Map<string, number>();
    const contributorMap = new Map<string, number>();
    const hourMap = new Array(24)
      .fill(0)
      .map((_, i) => ({ hour: `${i}h`, count: 0 }));

    let totalSugar = 0;
    let totalCaffeine = 0;

    consumptions.forEach((c) => {
      const dateObj = new Date(c.consumedAt);
      const dayKey = dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
      const currentDay = dailyMap.get(dayKey) || {
        date: dayKey,
        sugar: 0,
        caffeine: 0,
      };

      currentDay.sugar += c.nutrients.sugar;
      currentDay.caffeine += c.nutrients.caffeine;
      dailyMap.set(dayKey, currentDay);

      totalSugar += c.nutrients.sugar;
      totalCaffeine += c.nutrients.caffeine;

      productMap.set(c.productName, (productMap.get(c.productName) || 0) + 1);
      if (c.location)
        locationMap.set(c.location, (locationMap.get(c.location) || 0) + 1);

      const contributorName = c.contributorId?.firstName || "Inconnu";
      contributorMap.set(
        contributorName,
        (contributorMap.get(contributorName) || 0) + 1
      );

      hourMap[dateObj.getHours()].count += 1;
    });

    const chartData = Array.from(dailyMap.values()).reverse();
    const daysCount = dailyMap.size || 1;
    const pieData = Array.from(productMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      chartData,
      pieData,
      hourData: hourMap,
      avgSugar: (totalSugar / daysCount).toFixed(1),
      avgCaffeine: (totalCaffeine / daysCount).toFixed(0),
      daysOverLimit: Array.from(dailyMap.values()).filter(
        (d) => d.sugar > 50 || d.caffeine > 400
      ).length,
      topLocation:
        Array.from(locationMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "-",
      topContributor:
        Array.from(contributorMap.entries()).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] || "-",
      topProduct: pieData[0]?.name || "-",
    };
  }, [consumptions]);

  return (
    <div className="min-h-screen md:h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:overflow-hidden">
      <div className="shrink-0 pt-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 w-full md:w-[80%] mx-auto px-4 md:px-0">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold">Statistiques</h1>
        </div>

        <div className="flex gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          {(["1d", "7d", "30d", "6m", "1y"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer",
                period === p
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {p === "1d"
                ? "Auj."
                : p === "7d"
                  ? "7j"
                  : p === "30d"
                    ? "30j"
                    : p === "6m"
                      ? "6 mois"
                      : p === "1y"
                        ? "1 an"
                        : "Perso"}
            </button>
          ))}
        </div>
      </div>

      {period === "custom" && (
        <div className="shrink-0 flex justify-center gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-4 py-1 text-sm rounded-lg border border-slate-300"
          />
          <span className="self-center text-slate-400 text-sm">au</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-4 py-1 text-sm rounded-lg border border-slate-300"
          />
        </div>
      )}

      <div className="flex-1 p-4 md:px-0 md:pb-6 overflow-y-auto md:overflow-hidden flex flex-col gap-4 w-full md:w-[80%] mx-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-emerald-600">
            Chargement...
          </div>
        ) : !stats ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Aucune donnée.
          </div>
        ) : (
          <>
            <div className="shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                {
                  label: "Moyenne Sucre",
                  val: `${stats.avgSugar}g`,
                  color: "text-emerald-700",
                },
                {
                  label: "Moyenne Caféine",
                  val: `${stats.avgCaffeine}mg`,
                  color: "text-purple-700",
                },
                {
                  label: "Jours d'Alertes",
                  val: stats.daysOverLimit,
                  color: "text-red-600",
                },
                {
                  label: "Produit Favori",
                  val: stats.topProduct,
                  color: "text-slate-800",
                },
                {
                  label: "Lieu Favori",
                  val: stats.topLocation,
                  color: "text-slate-800",
                },
                {
                  label: "Top Contributeur",
                  val: stats.topContributor,
                  color: "text-slate-800",
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center"
                >
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">
                    {kpi.label}
                  </div>
                  <div
                    className={clsx("text-lg font-bold truncate", kpi.color)}
                    title={String(kpi.val)}
                  >
                    {kpi.val}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 pb-8 md:pb-0">
              {/* Chart 1: Sucre */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-72 md:h-auto">
                <h3 className="shrink-0 text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Sucre consommé par jour
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <ReferenceLine
                        y={50}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                      />
                      <Bar
                        dataKey="sugar"
                        name="Sucre"
                        unit="g"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Caféine */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-72 md:h-auto">
                <h3 className="shrink-0 text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Évolution de la caféine
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
                      />
                      <ReferenceLine
                        y={400}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                      />
                      <Line
                        type="monotone"
                        dataKey="caffeine"
                        name="Caféine"
                        unit="mg"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Produits */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-72 md:h-auto">
                <h3 className="shrink-0 text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <PieIcon className="w-4 h-4" /> Répartition par produit
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="80%"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {stats.pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={20}
                        iconSize={8}
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Heures */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-72 md:h-auto">
                <h3 className="shrink-0 text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Heures de consommation
                </h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.hourData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{ borderRadius: "8px", fontSize: "14px" }}
                      />
                      <Bar
                        dataKey="count"
                        name="Consommations"
                        fill="#3b82f6"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
