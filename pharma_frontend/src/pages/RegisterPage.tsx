import { type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bg-image.png";
import { isAuthenticated } from "../auth/tokenStorage";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (registerPassword !== registerConfirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        username: registerUsername,
        password: registerPassword,
        email: registerEmail,
        first_name: registerFirstName,
        last_name: registerLastName,
      });
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
            Inscription
          </h1>
          <p className="text-white/80 text-xs tracking-wider">
            CREEZ VOTRE COMPTE PHARMAMANAGER
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputGroup label="PRENOM">
                  <input
                    value={registerFirstName}
                    onChange={(e) => setRegisterFirstName(e.target.value)}
                    className="w-full bg-transparent border border-white/60 rounded px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition text-sm"
                    placeholder="Jean"
                  />
                </InputGroup>
                <InputGroup label="NOM">
                  <input
                    value={registerLastName}
                    onChange={(e) => setRegisterLastName(e.target.value)}
                    className="w-full bg-transparent border border-white/60 rounded px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition text-sm"
                    placeholder="Dupont"
                  />
                </InputGroup>
              </div>

              <InputGroup label="IDENTIFIANT">
                <input
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="w-full bg-transparent border border-white/60 rounded px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition text-sm"
                  placeholder="nom_utilisateur"
                  required
                />
              </InputGroup>

              <InputGroup label="EMAIL">
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/60 rounded px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white transition text-sm"
                  placeholder="votre@email.com"
                  required
                />
              </InputGroup>

              <div className="grid grid-cols-2 gap-3">
                <InputGroup label="MOT DE PASSE">
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full bg-transparent border border-white/60 rounded px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/50 transition text-sm"
                    placeholder="********"
                    required
                  />
                </InputGroup>
                <InputGroup label="CONFIRMER">
                  <input
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border border-white/60 rounded px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:border-white/50 transition text-sm"
                    placeholder="********"
                    required
                  />
                </InputGroup>
              </div>
            </div>

            {error && <div className="text-red-400 text-[11px] font-bold text-center uppercase tracking-wider bg-red-900/20 py-2 border border-red-500/20">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-black font-bold py-4 rounded tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 text-xs uppercase"
            >
              {submitting ? "CRÉATION..." : "S'INSCRIRE"}
            </button>
          </form>

          <div className="pt-8 border-t border-white text-center">
            <Link
              to="/login"
              className="text-white/80 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Déja un compte ? Se connecter
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
