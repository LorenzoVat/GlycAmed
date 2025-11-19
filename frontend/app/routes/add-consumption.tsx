import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowLeft, Save, Loader2, MapPin, FileText, Clock } from "lucide-react";
import type { Route } from "./+types/add-consumption";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Ajouter une consommation - GlycAmed" }];
}

interface ProductResult {
  name: string;
  brand: string;
  image: string;
  sugars: number;
  caffeine: number;
  calories: number;
  barcode?: string;
}

export default function AddConsumption() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(null);

  const [quantity, setQuantity] = useState<number>(250);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    setLoading(true);
    setSelectedProduct(null);
    
    try {
      const res = await fetch(`/product/search?name=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (res.ok) setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    const ratio = quantity / 100;
    const totalSugar = (selectedProduct.sugars || 0) * ratio;
    const totalCaffeine = (selectedProduct.caffeine || 0) * ratio;
    const totalCalories = (selectedProduct.calories || 0) * ratio;

    const payload = {
      productName: selectedProduct.name,
      barcode: selectedProduct.barcode || "00000000",
      quantityMl: Number(quantity),
      nutrients: {
        sugar: Number(totalSugar.toFixed(1)),
        caffeine: Number(totalCaffeine.toFixed(1)),
        calories: Number(totalCalories.toFixed(1)),
      },
      location: location || undefined,
      notes: notes || undefined,
      consumedAt: new Date(date).toISOString(),
    };

    try {
      const res = await fetch("/consumption/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto pb-20">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-white rounded-full transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold">Nouvelle consommation</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input 
                    type="text"
                    placeholder="Rechercher (ex: Coca, Monster...)"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 cursor-pointer">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
            </form>
        </div>

        {selectedProduct && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                
                <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="h-16 w-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        {selectedProduct.image ? <img src={selectedProduct.image} className="h-12 w-12 object-contain"/> : <span className="text-2xl">🥤</span>}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                        <p className="text-slate-500 text-sm">{selectedProduct.brand}</p>
                        <div className="flex gap-3 mt-2 text-xs font-medium">
                            <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded">Sucre: {selectedProduct.sugars}g/100ml</span>
                            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Caféine: {selectedProduct.caffeine}mg/100ml</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantité (ml)</label>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                            <Clock className="w-4 h-4 text-slate-400" /> Date et Heure
                        </label>
                        <input 
                            type="datetime-local" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-slate-600"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" /> Lieu <span className="text-slate-400 font-normal">(Optionnel)</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Ex: Cafétaria, Salle 101..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
                            <FileText className="w-4 h-4 text-slate-400" /> Notes <span className="text-slate-400 font-normal">(Optionnel)</span>
                        </label>
                        <textarea 
                            placeholder="Ex: Vu pendant la pause..."
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all mt-4 cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        Valider la consommation
                    </button>

                </div>
            </div>
        )}

        <div className="space-y-3">
            {!selectedProduct && results.map((product, idx) => (
                <button 
                    key={idx}
                    onClick={() => { setSelectedProduct(product); setQuantity(250); }}
                    className="w-full text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer"
                >
                    <div className="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                       {product.image ? <img src={product.image} className="h-10 w-10 object-contain" /> : <span>🥤</span>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 group-hover:text-emerald-700">{product.name}</h4>
                        <p className="text-sm text-slate-500">{product.brand}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}