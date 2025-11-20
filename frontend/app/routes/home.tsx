import { useState } from "react";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import {
  Activity,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GlycAmed - Connexion" },
    { name: "description", content: "Suivi de santé connecté." },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = isRegister ? "/api/user/register" : "/api/user/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const specificError = data.errors?.message;
        const globalError = data.message || data.error;
        throw new Error(
          specificError || globalError || "Une erreur est survenue"
        );
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-slate-50">
      <div className="hidden lg:flex w-1/2 bg-emerald-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Activity className="w-8 h-8 text-emerald-400" />
            </div>
            GlycAmed
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Votre santé, <br />
            notre priorité <span className="text-emerald-400">collective</span>.
          </h1>
          <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
            Plateforme collaborative de suivi nutritionnel. Aidez Amed à
            maintenir ses indicateurs au vert grâce à une communauté
            bienveillante.
          </p>

          <div className="space-y-4">
            {[
              "Analyse temps réel",
              "Base de données open-source",
              "Protection des données",
              "Alertes préventives",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-emerald-50 font-medium"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-sm text-emerald-200/60">
          © 2025 GlycAmed Project. Master 1 MBA.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="lg:hidden flex justify-center mb-4">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xl">
              <Activity className="w-6 h-6" /> GlycAmed
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegister ? "Créer un compte" : "Connexion"}
            </h2>
            <p className="text-slate-500">
              {isRegister
                ? "Rejoignez le tableau de bord."
                : "Accédez à vos statistiques."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Prénom
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text"
                    required={isRegister}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Amed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Nom
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    required={isRegister}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="H."
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email étudiant
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="etudiant@ecole.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {isRegister && (
                <p className="text-xs text-slate-400">
                  8 car., 1 Maj, 1 chiffre, 1 spécial.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : isRegister ? (
                "S'inscrire"
              ) : (
                "Se connecter"
              )}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 hover:underline cursor-pointer"
            >
              {isRegister
                ? "J'ai déjà un compte"
                : "Créer un compte maintenant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
