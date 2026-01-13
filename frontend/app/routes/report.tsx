import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { CONFIG } from "~/config/constants";

export default function Report() {
  const [period, setPeriod] = useState("week");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport(period);
  }, [period]);

  const fetchReport = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?period=${selectedPeriod}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Génération du rapport...</div>;
  if (!report)
    return (
      <div className="p-8 text-center">Impossible de charger le rapport.</div>
    );

  const getScoreColor = (score: number) => {
    if (score >= CONFIG.SCORING.GOOD) return "text-green-500";
    if (score >= CONFIG.SCORING.MEDIUM) return "text-orange-500";
    return "text-red-500";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "📈 En hausse";
    if (trend === "down") return "📉 En baisse";
    return "➡️ Stable";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Rapport de Santé</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="p-2 border rounded-lg bg-white shadow-sm"
        >
          <option value="week">7 derniers jours</option>
          <option value="month">30 derniers jours</option>
          <option value="year">Cette année</option>
        </select>
      </header>

      <section className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-xl text-gray-500 mb-2">Score de Santé Global</h2>
        <div
          className={`text-6xl font-bold ${getScoreColor(report.healthScore ?? 0)}`}
        >
          {report.healthScore ?? 0}/100
        </div>
        <p className="mt-4 text-gray-600">
          Basé sur le respect des recommandations OMS (Sucre & Caféine)
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm">Moyenne Sucre / jour</h3>
          <p className="text-2xl font-bold mt-1">
            {report.summary.averageSugar}g
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Max recommandé: {CONFIG.HEALTH_LIMITS.SUGAR}g
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm">Moyenne Caféine / jour</h3>
          <p className="text-2xl font-bold mt-1">
            {report.summary.averageCaffeine}mg
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Max recommandé: {CONFIG.HEALTH_LIMITS.CAFFEINE}mg
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-500 text-sm">Tendance</h3>
          <p className="text-2xl font-bold mt-1">
            {getTrendIcon(report.summary.trend)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {report.summary.daysOverLimit} jours en dépassement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">🏆 Top Produits</h2>
          <ul className="space-y-3">
            {report.topProducts.map((product, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
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
              <li className="text-gray-400 text-center py-4">Aucune donnée</li>
            )}
          </ul>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">👥 Top Contributeurs</h2>
          <ul className="space-y-3">
            {report.topContributors.map((contributor, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
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
              <li className="text-gray-400 text-center py-4">Aucune donnée</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
