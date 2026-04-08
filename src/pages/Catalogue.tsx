import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { getThemeStatsByRole, getAllThemes, type ThemeStat, type ThemeName } from "../services/themeService.tsx";
import "../style/catalogue.css";

import "../style/dashboard.css";
import { Link } from "react-router-dom";

export function Catalogue() {
    const { session, selectedRole, setSelectedRole, profile } = UserAuth();

    const [stats, setStats] = useState<ThemeStat[]>([]);
    const [allThemes, setAllThemes] = useState<ThemeName[]>([]);
    const [loading, setLoading] = useState(true);

    const handleMode = (role: string) => {
        setSelectedRole(role);
    };

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, themesData] = await Promise.all([
                    getThemeStatsByRole(session.user.id, selectedRole),
                    getAllThemes()
                ]);
                setStats(statsData || []);
                setAllThemes(themesData || []);
            } catch (err) {
                console.error("Erreur chargement catalogue:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, selectedRole]);

    if (loading) return <div className="loading">Chargement du catalogue...</div>;

    return (
        <div className="catalogue-container">
            <div className="catalogue-header">
                <h1>Catalogue de formations</h1>
                <p>Bienvenue dans votre espace de développement, <strong>{profile?.name}</strong>.</p>
                <p>Voici les formations adaptées à votre profil <strong>{selectedRole}</strong>.</p>

                {}
                <div className="role-switch">
                    <h3>Changer de rôle :</h3>

                    {profile?.user_role?.includes('manager') && (
                        <button
                            className={selectedRole === 'manager' ? 'active' : ''}
                            onClick={() => handleMode("manager")}
                        >
                            Mode Manager
                        </button>
                    )}

                    {profile?.user_role?.includes('agent') && (
                        <button
                            className={selectedRole === 'agent' ? 'active' : ''}
                            onClick={() => handleMode("agent")}
                        >
                            Mode Agent
                        </button>
                    )}
                </div>
            </div>

            <hr/>

            <div className="themes-grid">
                {allThemes.length > 0 ? (
                    allThemes.map((themeItem) => {
                        const userStat = stats.find(s => s.theme === themeItem.name);
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