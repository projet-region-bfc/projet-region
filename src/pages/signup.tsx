import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "../style/signup.css"; 

export function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signUpNewUser } = UserAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signUpNewUser(email, password);
            if (result.success) {
                navigate("/main");
            }
        } catch (err) {
            setError("Une erreur s'est produite lors de la création du compte");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="signup-page">
            {/* --- LE LOGO ET LE TITRE --- */} 
            <img src={logoImg} alt="Logo" className="signup-logo-img" />

            <header className="signup-header">
                <h1 className="signup-main-title">Indice de la maturité des équipes et du management</h1>
                <p className="signup-main-subtitle">
                    Créez votre compte pour accéder à votre espace
                </p>
            </header>

            <main className="signup-card">
                <h2 className="signup-card-title">Créer un compte</h2>
                <p className="signup-card-subtitle">Remplissez les informations ci-dessous</p>

                <form onSubmit={handleSignUp} className="signup-form">
                    <div className="signup-input-group">
                        <label className="signup-label">Mail professionnel</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="prenom.nom@bourgognefranchecomte.fr"
                            className="signup-input"
                            required
                        />
                    </div>

                    <div className="signup-input-group">
                        <label className="signup-label">Mot de passe</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            className="signup-input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="signup-submit-btn"
                    >
                        {loading ? "Création..." : "S'inscrire"}
                    </button>
                </form>

                {error && (
                    <p className="signup-error-message">
                        {error}
                    </p>
                )}
            </main>

            <Link to="/login" className="signup-footer-link">
                Vous avez déjà un compte ? <span>Connectez-vous</span>
            </Link>
        </div>
    );
}