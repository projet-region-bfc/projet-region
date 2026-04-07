import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import {getThemeStatsByRole, type ThemeStat} from "../services/themeService.tsx";
import {getTotalPoints, type TotalPoints} from "../services/questionnaire_sessionsService.tsx";
import '../style/side-menu.css';
import * as React from "react";
import "../style/dashboard.css"

export function Dashboard() {
    const {session, signOut} = UserAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [worstThemes, setWorstThemes] = useState<ThemeStat[]>([]);
    const [totalPoints, setTotalPoints] = useState<TotalPoints | null>(null);
    const [role, setRole] = useState<string>("Agent");
    const [loading, setLoading] = useState(true);
    const [allThemes, setAllThemes] = useState<ThemeStat[]>([]);

    console.log(session);

    useEffect(() => {
        if (session === null) {
            setLoading(false);
            return;
        }

        if (!session?.user?.id) return;
        (async () => {
            try {
                setLoading(true);
                const statsData = await getThemeStatsByRole(session.user.id, role);
                setAllThemes(statsData);

                const sortedWorst = [...statsData]
                    .sort((a, b) => a.moyenne_perso - b.moyenne_perso)
                    .slice(0, 3);
                setWorstThemes(sortedWorst);

                const [profileData, pointsData] = await Promise.all([
                    getProfileByUserId(session.user.id),
                    getTotalPoints(session.user.id, role),
                ]);

                setProfile(profileData);
                setTotalPoints(pointsData);
            } catch (err) {
                console.error("Erreur:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session, role]);

    console.log(allThemes.length);
    console.log(role);

    if (session === undefined) {
        return <p>Vérification de l'authentification...</p>;
    }
    if (session === null) {
        return <p>Accès refusé, veuillez vous connecter.</p>;
    }
    if (loading) return <p>Chargement de vos statistiques...</p>;

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await signOut();
        navigate("/");
    };

    return (
        <div className="dash-content">
            <div className="title-container">
            <h1>Dashboard</h1>
            </div>
            <div className="user-container">
            <p>Points total : {totalPoints?.total_points ?? 0}</p>
            <h2>Bienvenue {session?.user?.email}</h2>
            <p>{profile?.name} {profile?.last_name}</p>
            </div>
            <div className="toImprove-container">
            <h3>Thèmes à améliorer (Top 3 pires notes) :</h3>
            {worstThemes.length > 0 ? (
                <ul>
                    {worstThemes.map((el: any, index: number) => (
                        <li key={index}>
                            <strong>{el.theme}</strong> : {el.moyenne_perso} / 5
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune donnée du questionnaire pour le moment.</p>
            )}
            </div>

            <div className="table-container">
                <ul className="custom-table">
                    <li className="custom-table-header">
                        <div className="cellule">Thèmes</div>
                        <div className="cellule">Mes points</div>
                        <div className="cellule">Points de mon équipe</div>
                    </li>
                    {
                        allThemes.map((el) => (
                            <li className="Points-Rangée" key={el.theme}>
                                <div className="cellule">{el.theme}</div>
                                <div className="cellule">{el.moyenne_perso}</div>
                                <div className="cellule">{el.moyenne_equipe}</div>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="role-selection">
            <h3>Rôle actuel : {role}</h3>
            <button onClick={() => setRole("Manager")}>Manager</button>
            <button onClick={() => setRole("Agent")}>Agent</button>
            <Link to="/questionnaire">Lancer le questionnaire</Link>
            <button onClick={handleSignOut}>Se déconnecter</button>
            </div>
        </div>
    )
}