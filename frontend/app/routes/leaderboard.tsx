import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trophy, Calendar, Flame, Eye, Medal } from "lucide-react";
import type { Route } from "./+types/leaderboard";
import { clsx } from "clsx";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Classement - GlycAmed" }];
}

interface Consumption {
  _id: string;
  consumedAt: string;
  contributorId: { _id: string; firstName: string; lastName: string };
}

interface ContributorStats {
  id: string;
  firstName: string;
  lastName: string;
  totalCount: number;
  monthCount: number;
  lastContribution: string;
  hasContributedToday: boolean;
  streak: number; // Nouveau champ pour la série
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/consumption/all");
        if (res.ok) setConsumptions(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { rankedContributors, firstContributorTodayId, topMonthId } =
    useMemo(() => {
      if (consumptions.length === 0)
        return {
          rankedContributors: [],
          firstContributorTodayId: null,
          topMonthId: null,
        };

      const statsMap = new Map<string, ContributorStats>();
      const userDaysMap = new Map<string, Set<string>>(); // Pour stocker les jours uniques par user

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const todayString = now.toDateString();

      let earliestTodayTime = Infinity;
      let firstTodayId = null;

      // 1. Agrégation des données
      consumptions.forEach((c) => {
        if (!c.contributorId) return;

        const cId = c.contributorId._id;
        const cDate = new Date(c.consumedAt);
        const dateString = cDate.toDateString(); // "Mon Nov 19 2025" (Ignore l'heure pour le streak)

        // Init Stats
        const current = statsMap.get(cId) || {
          id: cId,
          firstName: c.contributorId.firstName,
          lastName: c.contributorId.lastName,
          totalCount: 0,
          monthCount: 0,
          lastContribution: c.consumedAt,
          hasContributedToday: false,
          streak: 0,
        };

        // Init Jours uniques
        if (!userDaysMap.has(cId)) {
          userDaysMap.set(cId, new Set());
        }
        userDaysMap.get(cId)?.add(dateString);

        // Compteurs basiques
        current.totalCount += 1;
        if (
          cDate.getMonth() === currentMonth &&
          cDate.getFullYear() === currentYear
        ) {
          current.monthCount += 1;
        }
        if (new Date(current.lastContribution) < cDate) {
          current.lastContribution = c.consumedAt;
        }
        if (dateString === todayString) {
          current.hasContributedToday = true;
          if (cDate.getTime() < earliestTodayTime) {
            earliestTodayTime = cDate.getTime();
            firstTodayId = cId;
          }
        }

        statsMap.set(cId, current);
      });

      // 2. Calcul du STREAK pour chaque utilisateur
      statsMap.forEach((stats, userId) => {
        const daysSet = userDaysMap.get(userId);
        if (!daysSet) return;

        let streak = 0;
        const checkDate = new Date(); // On commence aujourd'hui

        // Si pas de contrib aujourd'hui, on regarde si la série est active depuis hier
        if (!daysSet.has(checkDate.toDateString())) {
          checkDate.setDate(checkDate.getDate() - 1); // On recule à hier
          if (!daysSet.has(checkDate.toDateString())) {
            // Ni aujourd'hui ni hier : série brisée
            stats.streak = 0;
            return;
          }
        }

        // On remonte le temps tant qu'on trouve des jours consécutifs
        while (daysSet.has(checkDate.toDateString())) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1); // Jour précédent
        }
        stats.streak = streak;
      });

      // 3. Tri et Résultats
      const sorted = Array.from(statsMap.values()).sort(
        (a, b) => b.totalCount - a.totalCount
      );
      const topMonth = Array.from(statsMap.values()).sort(
        (a, b) => b.monthCount - a.monthCount
      )[0];

      return {
        rankedContributors: sorted,
        firstContributorTodayId: firstTodayId,
        topMonthId: topMonth?.id,
      };
    }, [consumptions]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold">Classement des Contributeurs</h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-emerald-600">
            Calcul des scores...
          </div>
        ) : rankedContributors.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Aucune contribution enregistrée.
          </div>
        ) : (
          <div className="space-y-4">
            {/* PODIUM (TOP 3) */}
            <div className="grid grid-cols-3 gap-4 mb-8 items-end">
              {/* 2ème */}
              {rankedContributors[1] && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center order-1 relative">
                  <div className="absolute -top-3 bg-slate-300 text-white text-xs font-bold px-2 py-1 rounded-full">
                    2
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg mb-2 border-2 border-slate-300">
                    {rankedContributors[1].firstName[0]}
                  </div>
                  <div className="font-bold text-slate-800 text-sm truncate w-full">
                    {rankedContributors[1].firstName}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {rankedContributors[1].totalCount} ajouts
                  </div>
                </div>
              )}

              {/* 1er (Au milieu, plus grand) */}
              {rankedContributors[0] && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-yellow-200 flex flex-col items-center text-center order-2 relative -top-4 z-10">
                  <div className="absolute -top-4">
                    <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-700 flex items-center justify-center font-bold text-2xl mb-2 border-2 border-yellow-400">
                    {rankedContributors[0].firstName[0]}
                  </div>
                  <div className="font-bold text-slate-900 truncate w-full">
                    {rankedContributors[0].firstName}
                  </div>
                  <div className="text-sm text-emerald-600 font-bold">
                    {rankedContributors[0].totalCount} ajouts
                  </div>
                </div>
              )}

              {/* 3ème */}
              {rankedContributors[2] && (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center order-3 relative">
                  <div className="absolute -top-3 bg-orange-300 text-white text-xs font-bold px-2 py-1 rounded-full">
                    3
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-lg mb-2 border-2 border-orange-300">
                    {rankedContributors[2].firstName[0]}
                  </div>
                  <div className="font-bold text-slate-800 text-sm truncate w-full">
                    {rankedContributors[2].firstName}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {rankedContributors[2].totalCount} ajouts
                  </div>
                </div>
              )}
            </div>

            {/* LISTE COMPLÈTE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {rankedContributors.map((contributor, index) => (
                <div
                  key={contributor.id}
                  className={clsx(
                    "p-4 flex items-center gap-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors",
                    index < 3 ? "bg-slate-50/50" : ""
                  )}
                >
                  <div className="w-8 text-center font-bold text-slate-400">
                    #{index + 1}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {contributor.firstName[0]}
                    {contributor.lastName[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 truncate">
                        {contributor.firstName} {contributor.lastName}
                      </p>
                      {/* BADGES */}
                      <div className="flex gap-1">
                        {/* Badge du Mois */}
                        {contributor.id === topMonthId && (
                          <span
                            className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 flex items-center gap-1"
                            title="Top du mois"
                          >
                            <Medal className="w-3 h-3" /> Mois
                          </span>
                        )}

                        {/* Badge Streak (Modifié) */}
                        {contributor.streak > 0 && (
                          <span
                            className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded border border-orange-200 flex items-center gap-1"
                            title={`Série de ${contributor.streak} jours`}
                          >
                            <Flame className="w-3 h-3 fill-orange-500 text-orange-600" />{" "}
                            Streak {contributor.streak}
                          </span>
                        )}

                        {/* Badge First */}
                        {contributor.id === firstContributorTodayId && (
                          <span
                            className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-1"
                            title="Première contribution du jour"
                          >
                            <Eye className="w-3 h-3" /> First
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Dernier ajout :{" "}
                      {new Date(
                        contributor.lastContribution
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="block font-bold text-lg text-slate-900">
                      {contributor.totalCount}
                    </span>
                    <span className="text-xs text-slate-400 uppercase">
                      Total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
