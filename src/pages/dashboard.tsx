import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import {getThemeStats, type ThemeStat} from "../services/themeService.tsx";
import {getTotalPoints, type TotalPoints} from "../services/questionnaire_sessionsService.tsx";
import * as React from "react";

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
            <button onClick={() => setRole("Manager")}>Manager</button>
            <button onClick={() => setRole("Agent")}>Agent</button>
            <Link to="/Questionnaire">Lancer le questionnaire</Link>
            <button onClick={() => setRole("Manager")} >Manager</button>
            <button onClick={() => setRole("Agent")} >Agent</button>
            <button onClick={handleSignOut}>Se déconnecter</button>
        </div>
    )
}