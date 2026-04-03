import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import {getThemeStats, type ThemeStat} from "../services/themeService.tsx";
import {getTotalPoints, type TotalPoints} from "../services/questionnaire_sessionsService.tsx";
import * as React from "react";
import "../pages/dashboard.css"

export function Dashboard() {
    const {session, signOut} = UserAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [worstThemes, setWorstThemes] = useState<ThemeStat[]>([]);
    const [totalPoints, setTotalPoints] = useState<TotalPoints | null>(null);
    const [role, setRole] = useState<string>("Agent");
    const [loading, setLoading] = useState(true);

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
                const [profileData, statsData, pointsData] = await Promise.all([
                    getProfileByUserId(session.user.id),
                    getThemeStats(session.user.id, 'ASC'),
                    getTotalPoints(session.user.id),
                ]);
                setProfile(profileData);
                setWorstThemes(statsData);
                setTotalPoints(pointsData);
            } catch (err) {
                console.error("Erreur chargement dashboard:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

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
        <div>
            <h1>Dashboard</h1>
            <p>Points total : {totalPoints?.total_points ?? 0}</p>
            <h2>Bienvenue {session?.user?.email}</h2>
            <p>{profile?.name} {profile?.last_name}</p>
            <h3>Thèmes à améliorer (Top 3 pires notes) :</h3>
            {worstThemes.length > 0 ? (
                <ul>
                    {worstThemes.map((el: any, index: number) => (
                        <li key={index}>
                            <strong>{el.theme}</strong> : {el.moyenne_points} / 5
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune donnée du questionnaire pour le moment.</p>
            )}

            <div className="table-container">
                <ul className="custom-table">
                    {/* En-tête du tableau */}
                    <li className="custom-table-header">
                        <div className="cellule">Thèmes</div>
                        <div className="cellule">Mes points</div>
                        <div className="cellule">Points de mon équipe</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Capacité d'innovation</div>
                        <div className="cellule">50</div>
                        <div className="cellule">20</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Gouvernance</div>
                        <div className="cellule">30</div>
                        <div className="cellule">18</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Performance</div>
                        <div className="cellule">28</div>
                        <div className="cellule">38</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Communication</div>
                        <div className="cellule">8</div>
                        <div className="cellule">11</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Appartenance</div>
                        <div className="cellule">12</div>
                        <div className="cellule">22</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Autonomie</div>
                        <div className="cellule">9</div>
                        <div className="cellule">12</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Développement des compétences</div>
                        <div className="cellule">30</div>
                        <div className="cellule">2</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Collaboration</div>
                        <div className="cellule">19</div>
                        <div className="cellule">20</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Adapation aux changements</div>
                        <div className="cellule">17</div>
                        <div className="cellule">19</div>
                    </li>
                    <li className="Points-Rangée">
                        <div className="cellule">Motivation</div>
                        <div className="cellule">40</div>
                        <div className="cellule">25</div>
                    </li>
                </ul>
            </div>




            <button onClick={() => setRole("Manager")}>Manager</button>
            <button onClick={() => setRole("Agent")}>Agent</button>
            <Link to="/questionnaire">Lancer le questionnaire</Link>
            <button onClick={handleSignOut}>Se déconnecter</button>
        </div>
    )
}