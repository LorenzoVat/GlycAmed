import { useEffect, useState, useMemo } from "react";
import { CONFIG } from "~/config/constants";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  MapPin,
  Clock,
  PieChart as PieIcon,
  FileText,
  Download,
  Printer,
  Zap,
  Activity,
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

  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

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
        if (res.ok) {
          const data = await res.json();
          setConsumptions(data);

          if (showReport) {
            generateClientReport(data, startDate, endDate);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setReportLoading(false);
      }
    };
    fetchData();
  }, [period, customStart, customEnd, showReport]);

  const generateClientReport = (
    data: Consumption[],
    start: Date,
    end: Date
  ) => {
    const dailyMap = new Map<string, { sugar: number; caffeine: number }>();

    data.forEach((c) => {
      const dayKey = new Date(c.consumedAt).toLocaleDateString();
      const current = dailyMap.get(dayKey) || { sugar: 0, caffeine: 0 };
      current.sugar += c.nutrients.sugar;
      current.caffeine += c.nutrients.caffeine;
      dailyMap.set(dayKey, current);
    });

    const daysWithData = dailyMap.size || 1;
    let totalSugar = 0;
    let totalCaffeine = 0;
    let daysOverLimit = 0;

    Array.from(dailyMap.values()).forEach((day) => {
      totalSugar += day.sugar;
      totalCaffeine += day.caffeine;
      if (
        day.sugar > CONFIG.HEALTH_LIMITS.SUGAR ||
        day.caffeine > CONFIG.HEALTH_LIMITS.CAFFEINE
      )
        daysOverLimit++;
    });

    const sorted = [...data].sort(
      (a, b) =>
        new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime()
    );
    let trend: "up" | "down" | "stable" = "stable";

    if (sorted.length >= 2) {
      const mid = Math.floor(sorted.length / 2);
      const firstHalf = sorted.slice(0, mid);
      const secondHalf = sorted.slice(mid);

      const sumFirst = firstHalf.reduce((acc, c) => acc + c.nutrients.sugar, 0);
      const sumSecond = secondHalf.reduce(
        (acc, c) => acc + c.nutrients.sugar,
        0
      );

      if (sumSecond > sumFirst * 1.1) trend = "up";
      else if (sumSecond < sumFirst * 0.9) trend = "down";
    }

    const productMap = new Map<string, number>();
    data.forEach((c) => {
      productMap.set(c.productName, (productMap.get(c.productName) || 0) + 1);
    });
    const topProducts = Array.from(productMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const contributorMap = new Map<string, number>();
    data.forEach((c) => {
      const name = c.contributorId
        ? `${c.contributorId.firstName} ${c.contributorId.lastName}`
        : "Inconnu";
      contributorMap.set(name, (contributorMap.get(name) || 0) + 1);
    });
    const topContributors = Array.from(contributorMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setReport({
      summary: {
        averageSugar: parseFloat((totalSugar / daysWithData).toFixed(1)),
        averageCaffeine: parseFloat((totalCaffeine / daysWithData).toFixed(1)),
        daysOverLimit,
        totalDays: daysWithData,
        trend,
      },
      topProducts,
      topContributors,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
  };

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
        (d) =>
          d.sugar > CONFIG.HEALTH_LIMITS.SUGAR ||
          d.caffeine > CONFIG.HEALTH_LIMITS.CAFFEINE
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

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "📈 En hausse";
    if (trend === "down") return "📉 En baisse";
    return "➡️ Stable";
  };

  const handleDownloadCSV = () => {
    if (!report) return;

    const csvRows = [];

    csvRows.push(["Rapport de Santé GlycAmed"]);
    csvRows.push([`Généré le ${new Date().toLocaleDateString()}`]);
    csvRows.push([]);

    csvRows.push(["Résumé Global"]);
    csvRows.push(["Moyenne Sucre (g/jour)", report.summary.averageSugar]);
    csvRows.push(["Moyenne Caféine (mg/jour)", report.summary.averageCaffeine]);
    csvRows.push(["Jours en dépassement", report.summary.daysOverLimit]);
    csvRows.push(["Tendance", report.summary.trend]);
    csvRows.push([]);

    csvRows.push(["Top Produits"]);
    csvRows.push(["Nom", "Consommations"]);
    report.topProducts.forEach((p) => {
      csvRows.push([p.name, p.count]);
    });
    csvRows.push([]);

    csvRows.push(["Top Contributeurs"]);
    csvRows.push(["Nom", "Contributions"]);
    report.topContributors.forEach((c) => {
      csvRows.push([c.name, c.count]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `rapport_glycamed_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReport(!showReport)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm cursor-pointer",
              showReport
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            )}
          >
            <FileText className="w-4 h-4" />
            {showReport ? "Voir Graphiques" : "Voir Rapport"}
          </button>

          <div className="flex gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {(["1d", "7d", "30d", "6m", "1y", "custom"] as const).map((p) => (
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

      <div className="flex-1 p-4 md:px-0 md:pb-6 overflow-y-auto flex flex-col gap-4 w-full md:w-[80%] mx-auto">
        {loading || (showReport && reportLoading) ? (
          <div className="flex-1 flex items-center justify-center text-emerald-600">
            Chargement...
          </div>
        ) : showReport && report ? (
          <div className="space-y-8 animate-in fade-in zoom-in-95 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                Rapport de Santé
              </h2>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Télécharger CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h3 className="text-gray-500 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-700" /> Moyenne Sucre /
                  jour
                </h3>
                <p className="text-2xl font-bold mt-1 text-emerald-700">
                  {report.summary.averageSugar}g
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Max recommandé: 50g
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h3 className="text-gray-500 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-700" /> Moyenne
                  Caféine / jour
                </h3>
                <p className="text-2xl font-bold mt-1 text-purple-700">
                  {report.summary.averageCaffeine}mg
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Max recommandé: {CONFIG.HEALTH_LIMITS.CAFFEINE}mg
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h3 className="text-gray-500 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-700" /> Tendance
                </h3>
                <p className="text-2xl font-bold mt-1 text-slate-700">
                  {getTrendIcon(report.summary.trend)}
                </p>
                <p
                  className={clsx(
                    "text-xs mt-2 font-medium",
                    report.summary.daysOverLimit > 0
                      ? "text-red-500"
                      : "text-emerald-500"
                  )}
                >
                  {report.summary.daysOverLimit} jours en dépassement
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-xl font-bold mb-4">🏆 Top Produits</h2>
                <ul className="space-y-3">
                  {report.topProducts.map((product, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border-b border-slate-50 last:border-0"
                    >
                      <span className="font-medium">
                        {index + 1}. {product.name}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {product.count} fois
                      </span>
                    </li>
                  ))}
                  {report.topProducts.length === 0 && (
                    <li className="text-gray-400 text-center py-4">
                      Aucune donnée
                    </li>
                  )}
                </ul>
              </section>

              <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-xl font-bold mb-4">👥 Top Contributeurs</h2>
                <ul className="space-y-3">
                  {report.topContributors.map((contributor, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border-b border-slate-50 last:border-0"
                    >
                      <span className="font-medium">
                        {index + 1}. {contributor.name}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {contributor.count} contrib.
                      </span>
                    </li>
                  ))}
                  {report.topContributors.length === 0 && (
                    <li className="text-gray-400 text-center py-4">
                      Aucune donnée
                    </li>
                  )}
                </ul>
              </section>
            </div>
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

            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 pb-8 md:pb-0 print:hidden">
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
                        y={CONFIG.HEALTH_LIMITS.CAFFEINE}
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
