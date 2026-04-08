import {useState, useEffect} from "react";
import {UserAuth} from "../context/AuthContext.tsx";
import {getThemeStatsByRole, getAllThemes, type ThemeStat, type ThemeName} from "../services/themeService.tsx";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import "../style/catalogue.css";
import {Link} from "react-router-dom";


export function Catalogue() {
    const {session, selectedRole, setSelectedRole} = UserAuth();

    const [stats, setStats] = useState<ThemeStat[]>([]);
    const [allThemes, setAllThemes] = useState<ThemeName[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const [profileData, statsData, themesData] = await Promise.all([
                    getProfileByUserId(session.user.id),
                    getThemeStatsByRole(session.user.id, selectedRole),
                    getAllThemes()
                ]);

                setProfile(profileData as any);
                setStats(statsData || []);
                setAllThemes(themesData || []);
            } catch (err) {
                console.error("Erreur chargement formation:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, selectedRole]);

    if (session === undefined) return <p>Vérification de l'identité...</p>;
    if (session === null) return <p>Veuillez vous connecter.</p>;
    if (loading) return <p>Chargement du catalogue...</p>;

    return (
        <div className="catalogue-container">
            <h1>Catalogue de formations et accompagnements</h1>
            <p>Découvrez l'ensemble des formations, ateliers et démarches d'accompagnement proposés par la Région
                Bourgogne-Franche-Comté pour développer vos pratiques managériales et renforcer la cohésion de vos
                équipes.</p>
            <p>
                Découvrez les solutions pour votre rôle de : <strong>{selectedRole}</strong>
            </p>

            <div className="role-switch">
                {(profile?.user_role === 'agent' || profile?.user_role === 'manager et agent') && (
                    <button
                        className={selectedRole === 'agent' ? "active" : ""}
                        onClick={() => setSelectedRole('agent')}
                    >
                        Mode Agent
                    </button>
                )}
                {(profile?.user_role === 'manager' || profile?.user_role === 'manager et agent') && (
                    <button
                        className={selectedRole === 'manager' ? "active" : ""}
                        onClick={() => setSelectedRole('manager')}
                    >
                        Mode Manager
                    </button>
                )}
            </div>

            <hr/>

            <div className="themes-grid">
                {allThemes.length > 0 ? (
                    allThemes.map((themeItem) => {
                        const userStat = stats.find(s => s.theme === themeItem.name);

                        // On vérifie si l'utilisateur a un score ET s'il est en dessous de 2
                        const isLowScore = userStat && userStat.moyenne_perso <= 2;

                        return (
                            <Link
                                key={themeItem.name}
                                className="theme-card-button"
                                to={`/catalogue/${encodeURIComponent(themeItem.name)}`}
                                style={{textDecoration: 'none'}}
                            >
                    <span className="theme-name">
                        {themeItem.name}
                    </span>

                                <span className={`theme-score ${userStat ? "scored" : "unrated"} ${isLowScore ? "low-score" : ""}`}>
                                    {userStat ? `Score : ${userStat.moyenne_perso} / 4` : "Non évalué"}
                                </span>
                            </Link>
                        );
                    })
                ) : (
                    <p>Aucun thème disponible.</p>
                )}
            </div>
        </div>
    );
}