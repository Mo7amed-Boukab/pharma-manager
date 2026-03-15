import { type FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bg-image.png";
import { isAuthenticated } from "../auth/tokenStorage";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ username: loginUsername, password: loginPassword });
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-widest text-white mb-2 uppercase">
            Connexion
          </h1>
          <p className="text-white/80 text-xs tracking-wider">
            ACCEDEZ AU VOTRE ESPACE PERSONNEL
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-5">
              <InputGroup label="ADRESSE EMAIL / NOM D'UTILISATEUR">
                <input
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-transparent border border-white/60 rounded-sm px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/80 transition text-sm"
                  placeholder="nom@exemple.com"
                  required
                />
              </InputGroup>

              <InputGroup 
                label="MOT DE PASSE" 
                rightAction={
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              >
                <input
                  type={showPassword ? "password" : "text"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-transparent border border-white/60 rounded-sm px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/80 transition text-sm"
                  placeholder="Entrez votre mot de passe"
                  required
                />
              </InputGroup>
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold text-white/80 uppercase">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="w-3 h-3 rounded-none bg-transparent border-white/80 checked:bg-white" />
                Rester connecté
              </label>
              <button type="button" className="hover:text-white transition-colors">Mot de passe oublié ?</button>
            </div>

            {error && <div className="text-red-400 text-[11px] font-bold text-center uppercase tracking-wider bg-red-900/20 py-2 border border-red-500/20">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-black font-bold py-4 rounded-sm tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 text-xs uppercase"
            >
              {submitting ? "CONNEXION..." : "SE CONNECTER"}
            </button>
          </form>

          <div className="pt-8 border-t border-white text-center">
            <Link
              to="/register"
              className="text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Pas encore de compte ? S'inscrire
            </Link>
          </div>
        </div>

        <p className="mt-16 text-center text-white text-[10px] tracking-[0.3em] uppercase">
           2026 PharmaManager. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}

function InputGroup({ 
  label, 
  children, 
  rightAction 
}: { 
  label: string; 
  children: React.ReactNode; 
  rightAction?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[9px] font-bold tracking-[0.2em] text-white/60 uppercase">
        {label}
      </label>
      <div className="relative">
        {children}
        {rightAction && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
}
