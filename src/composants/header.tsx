import '../header.css';
import { UserAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

export default function Header() {
    
    const { session, profile, loading, signOut } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    
    if (session === undefined || loading) {
        return (
            <header className="header">
                <p>Chargement du compte...</p>
            </header>
        );
    }

    if (session === null) {
        return null; 
    }

    return (
        <header className="header">
            <div className="Profil-User">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     className="icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {}
                <span className="user-name">
                    {profile?.name} {profile?.last_name}
                </span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     className="icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Déconnexion
            </button>
        </header>
    );
}