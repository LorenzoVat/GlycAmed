import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Shield, LogOut } from "lucide-react";
import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Mon Profil - GlycAmed" }];
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/user/me")
      .then((res) => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("/user/logout", { method: "POST" });
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-600">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold">Mon Profil</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-emerald-600 h-24"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-10 mb-[-20px]">
              <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md inline-block">
                <div className="h-full w-full rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-slate-500">
                  {user.role === "amed" ? "Administrateur" : "Étudiant"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">
                      Email
                    </p>
                    <p className="text-slate-900 font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">
                      Rôle
                    </p>
                    <p className="text-slate-900 font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
