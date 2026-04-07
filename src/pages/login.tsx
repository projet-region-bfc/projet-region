import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "../style/login.css"; 

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signInUser } = UserAuth();
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signInUser(email, password);
            if (result.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            setError("Identifiants incorrects ou problème de connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <header className="login-header">
                <img src={logoImg} alt="Logo Bourgogne Franche-Comté" className="logo-img" />
                <h1 className="logo-text">La région</h1>
                <p className="subtitle">Connectez-vous pour accéder à votre espace</p>
            </header>

            <section className="login-card">
                <form onSubmit={handleSignIn} className="login-form">
                    
                    <div className="form-group">
                        <label className="form-label">Mail professionnel</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="prenom.nom@bourgognefranchecomte"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            className="form-input no-icon"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>

                <p className="rgpd-text">
                    En vous connectant, vous acceptez que vos données soient traitées conformément au RGPD.
                    Vos informations restent confidentielles et ne sont utilisées que dans le cadre de votre
                    accompagnement professionnel.
                </p>
            </section>

            <Link to="/signup" className="footer-link">
                Vous n'avez pas de compte ? <span>Inscrivez-vous</span>
            </Link>
        </main>
    );
}