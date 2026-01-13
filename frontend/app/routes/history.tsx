import { useEffect, useState } from "react";
import { useApi } from "~/hooks/useApi";
import { useUser } from "~/context/UserContext";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Search,
  Calendar,
  MapPin,
  User,
  X,
  Filter,
  Trash2,
} from "lucide-react";
import type { Route } from "./+types/history";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Historique - GlycAmed" }];
}

interface Consumption {
  _id: string;
  productName: string;
  quantityMl: number;
  nutrients: { sugar: number; caffeine: number; calories: number };
  consumedAt: string;
  contributorId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  location?: string;
  notes?: string;
}

export default function History() {
  const navigate = useNavigate();

  const { user } = useUser();

  const {
    data: remoteConsumptions,
    loading,
    execute: fetchConsumptions,
    setData: setConsumptions,
  } = useApi<Consumption[]>();

   const consumptions = remoteConsumptions || [];

  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [contributorFilter, setContributorFilter] = useState("");

  const fetchHistory = () => {
    const params = new URLSearchParams();

    if (productFilter) params.append("productName", productFilter);
    if (locationFilter) params.append("location", locationFilter);

    if (dateFilter) {
      const start = new Date(dateFilter);
      const end = new Date(dateFilter);
      end.setHours(23, 59, 59);
      params.append("dateFrom", start.toISOString());
      params.append("dateTo", end.toISOString());
    }

    fetchConsumptions(`/api/consumption/all?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [productFilter, dateFilter, locationFilter]); // Removed fetchHistory from deps to avoid loop if it were unstable, but here it's derived from useApi which is stable-ish. Safest to just depend on filters.

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette entrée ?")) return;

    try {
      const res = await fetch(`/api/consumption/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConsumptions((prev) => prev?.filter((c) => c._id !== id) || null);
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const filteredConsumptions = consumptions.filter((item) => {
    if (!contributorFilter) return true;
    const fullName =
      `${item.contributorId?.firstName} ${item.contributorId?.lastName}`.toLowerCase();
    return fullName.includes(contributorFilter.toLowerCase());
  });

  const resetFilters = () => {
    setProductFilter("");
    setDateFilter("");
    setLocationFilter("");
    setContributorFilter("");
  };

  const hasFilters =
    productFilter || dateFilter || locationFilter || contributorFilter;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold">Historique complet</h1>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700">
            <Filter className="w-4 h-4" /> Filtres
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Produit..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Lieu..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Contributeur..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                value={contributorFilter}
                onChange={(e) => setContributorFilter(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="date"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-slate-600"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" /> Effacer tous les filtres
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Lieu & Notes</th>
                  <th className="p-4 text-right">Qté</th>
                  <th className="p-4 text-right">Sucre</th>
                  <th className="p-4">Contributeur</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredConsumptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Aucun résultat ne correspond à vos filtres.
                    </td>
                  </tr>
                ) : (
                  filteredConsumptions.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                        {new Date(item.consumedAt).toLocaleDateString()} <br />
                        <span className="text-xs opacity-70">
                          {new Date(item.consumedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-emerald-900 block">
                          {item.productName}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-600 max-w-xs">
                        {item.location && (
                          <div className="flex items-center gap-1 mb-1 text-emerald-700">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </div>
                        )}
                        {item.notes && (
                          <span className="italic text-slate-400">
                            "{item.notes}"
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right text-slate-600">
                        {item.quantityMl} ml
                      </td>
                      <td className="p-4 text-right font-medium">
                        {item.nutrients.sugar > 20 ? (
                          <span className="text-red-600">
                            {item.nutrients.sugar}g
                          </span>
                        ) : (
                          <span className="text-slate-700">
                            {item.nutrients.sugar}g
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-700 font-bold">
                            {item.contributorId?.firstName?.[0]}
                          </div>
                          <span className="text-sm text-slate-700">
                            {item.contributorId?.firstName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {user &&
                        item.contributorId &&
                        (user.email === item.contributorId.email ||
                          user._id === item.contributorId._id) ? (
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-200">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
