import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import * as React from "react";
import {getThemeStats, type ThemeStat} from "../services/themeService.tsx";

export function Dashboard() {
    const {session, signOut} = UserAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [worstThemes, setWorstThemes] = useState<ThemeStat[]>([]);
    const [role, setRole] = useState<string>("Agent");
    const [loading, setLoading] = useState(true);

    console.log(session);

    useEffect(() => {
        (async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const [profileData, statsData] = await Promise.all([
                    getProfileByUserId(session.user.id),
                    getThemeStats(session.user.id, 'ASC'),
                ]);

                setProfile(profileData);
                setWorstThemes(statsData);
            } catch (err) {
                console.error("Erreur chargement dashboard:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

    console.log(role);

    if (loading) return <p>Chargement de vos statistiques...</p>;
    if (!session) return <p>Accès refusé, veuillez vous connecter.</p>;

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    }

    if (!session) return <p>Accès refusé. Connectez-vous.</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Bienvenue {session?.user?.email}</h2>
            <p>{profile?.name} {profile?.last_name}</p>
            <h3>Thèmes à améliorer (Top 3 pires notes) :</h3>
            {worstThemes.length > 0 ? (
                <ul>
                    {worstThemes.map((item: any, index: number) => (
                        <li key={index}>
                            <strong>{item.theme}</strong> : {item.moyenne_points} / 5
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune donnée du questionnaire pour le moment.</p>
            )}
            <button onClick={() => setRole("Manager")}>Manager</button>
            <button onClick={() => setRole("Agent")}>Agent</button>
            <button onClick={handleSignOut}>Se déconnecter</button>
        </div>
    )
}