import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import "../style/home.css";


export function Home() {

    const {session} = UserAuth();
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Bienvenue sur l'Accueil</h1>
            <div className="home-nav">
                <ul>
                    <li>
                        <Link to="/dashboard">dashboard</Link>
                    </li>
                    <li>
                        <Link to="/signup">signup</Link>
                    </li>
                    <li>
                        <Link to="/login">login</Link>
                    </li>
                </ul>
            </div>
            <div className="home-auth-section">
                {session ? (
                    <div className="home-auth-content">
                        <p>Vous êtes connecté avec : <strong>{session.user?.email}</strong></p>
                        <button className="home-auth-button" onClick={() => navigate("/dashboard")}>
                            Accéder à mon Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="home-auth-content">
                        <p>Veuillez vous connecter pour accéder à vos outils.</p>
                        <button onClick={() => navigate("/login")}>
                            Se connecter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}