import '../header.css';
import {useEffect, useState} from "react";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";


export default function Header() {

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const {session} = UserAuth();
    const {signOut} = UserAuth()
    const navigate = useNavigate();

    const test = async () => {
        await signOut();
        navigate("/login");
    }


    useEffect(() => {
        if (session === null) {
            setLoading(false);
            return;
        }

        if (!session?.user?.id) return;
        (async () => {
            try {
                setLoading(true);
                const [profileData] = await Promise.all([
                    getProfileByUserId(session.user.id),
                ]);
                setProfile(profileData);
            } catch (err) {
                console.error("Erreur chargement dashboard:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

    if (session === undefined) {
        return <p>Vérification de l'authentification...</p>;
    }
    if (session === null) {
        return <p>Accès refusé, veuillez vous connecter.</p>;
    }
    if (loading) return <p>chargement du compte</p>;


    return (
        <header className="header">
            <div className="Profil-User">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     className="icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="user-name">{profile?.name} {profile?.last_name}</span>
            </div>

            <button className="logout-btn" onClick={test}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     className="icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>

                Déconnexion
            </button>

        </header>
    )
}