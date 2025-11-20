import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  LogOut,
  Edit2,
  Save,
  Loader2,
  X,
} from "lucide-react";
import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Mon Profil - GlycAmed" }];
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    fetch("/user/me")
      .then((res) => {
        if (!res.ok) throw new Error("Non connecté");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
        setLoading(false);
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setUser({ ...user, ...formData });
        setIsEditing(false);
      } else {
        alert("Erreur lors de la mise à jour (Email déjà pris ?)");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="relative -top-10 mb-[-20px] flex justify-between items-end">
              <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md inline-block">
                <div className="h-full w-full rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 uppercase">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mb-12 text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center gap-2 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Modifier
                </button>
              )}
            </div>

            <div className="mt-6 space-y-6">
              {isEditing ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 uppercase font-semibold mb-1.5 block">
                        Prénom
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase font-semibold mb-1.5 block">
                        Nom
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                          Email étudiant
                        </p>
                        <p className="text-slate-900 font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                          Rôle système
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-8 border border-red-100"
                  >
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
