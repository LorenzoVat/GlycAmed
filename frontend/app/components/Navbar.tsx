import { useNavigate } from "react-router";
import {
  Activity,
  Plus,
  PieChart,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { useUser } from "~/context/UserContext";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex justify-between items-center">
        <div
          className="flex items-center gap-2 font-bold text-emerald-800 text-xl cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <Activity className="w-6 h-6" /> GlycAmed
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/add")}
            className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-emerald-200 mr-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>

          <button
            onClick={() => navigate("/statistics")}
            className="hidden md:flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium mr-2 cursor-pointer"
            title="Voir les statistiques"
          >
            <PieChart className="w-5 h-5" /> Stats
          </button>

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
            onClick={logout}
            className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
