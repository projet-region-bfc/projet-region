import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";
import {getThemeStatsByRole, type ThemeStat} from "../services/themeService.tsx";
import {getTotalPoints, type TotalPoints} from "../services/questionnaire_sessionsService.tsx";
import '../style/side-menu.css';
import * as React from "react";
import "../style/dashboard.css"
import {ResultatChart} from "./Resultat.tsx";
import {supabase} from "../supabaseClient.tsx";

export function Dashboard() {
    const {session, signOut, setSelectedRole, selectedRole, questionnaireFait} = UserAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [worstThemes, setWorstThemes] = useState<ThemeStat[]>([]);
    const [totalPoints, setTotalPoints] = useState<TotalPoints | null>(null);
    const [loading, setLoading] = useState(true);
    const [allThemes, setAllThemes] = useState<ThemeStat[]>([]);
    const handleMode = (role: string) => {
        setSelectedRole(role);
    };

    const user = session?.user;

    const [teams, setTeams] = useState<{ uid: string; nom_equipe: string }[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");

    // 1. Charger les équipes (dynamique selon Agent ou Manager)
    useEffect(() => {
        const fetchTeams = async () => {
            if (!user?.id) return;

            if (selectedRole === 'manager') {
                const {data} = await supabase.from('team').select('uid, nom_equipe').eq('manager_id', user.id);
                if (data && data.length > 0) {
                    setTeams(data);
                    setSelectedTeamId(data[0].uid);
                }
            } else {
                const {data} = await supabase.from('team_members').select('team_id, team:team_id (uid, nom_equipe)').eq('profile_uid', user.id);
                if (data && data.length > 0) {
                    const extractedTeams = data.map((d: any) => Array.isArray(d.team) ? d.team[0] : d.team).filter(Boolean);
                    setTeams(extractedTeams);
                    if (extractedTeams.length > 0) setSelectedTeamId(extractedTeams[0].uid);
                }
            }
        };
        fetchTeams();
    }, [user, selectedRole]);

    // 2. Charger les stats
    useEffect(() => {
        // MODIF : On attend que la session ET le rôle soient là
        if (!session?.user?.id || selectedRole === "") {
            return;
        }

        (async () => {
            try {
                setLoading(true);
                // On lance tout en parallèle avec le bon rôle
                const [statsData, profileData, pointsData] = await Promise.all([
                    getThemeStatsByRole(session.user.id, selectedRole),
                    getProfileByUserId(session.user.id),
                    getTotalPoints(session.user.id, selectedRole),
                ]);

                setAllThemes(statsData);
                const sortedWorst = [...statsData]
                    .sort((a, b) => a.moyenne_perso - b.moyenne_perso)
                    .slice(0, 3);
                setWorstThemes(sortedWorst);

                setProfile(profileData);
                setTotalPoints(pointsData);
            } catch (err) {
                console.error("Erreur chargement Dashboard:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session, selectedRole]);

    console.log(allThemes.length);
    console.log("ROLE : " + selectedRole);

    if (session === undefined) {
        return <p>Vérification de l'authentification...</p>;
    }
    if (session === null) {
        return <p>Accès refusé, veuillez vous connecter.</p>;
    }
    if (selectedRole === "") return <p>Initialisation du rôle...</p>;
    if (loading) return <p>Chargement de vos statistiques...</p>;

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await signOut();
        navigate("/");
    };

    const statsForChart = allThemes.map(el => ({
        indicateur: el.theme,
        scoreIndividuel: el.moyenne_perso,
        scoreEquipe: el.moyenne_equipe
    }));

    return (
        <div className="dash-content">
            <div className="title-container">
                <h1>Résultats</h1>
            </div>
            <div className="user-container">
                <p>Points total : {totalPoints?.total_points ?? 0}</p>
                <h2>Bienvenue {session?.user?.email}</h2>
                <p>{profile?.name} {profile?.last_name}</p>
            </div>

            <div>
                <ResultatChart
                    data={statsForChart}
                    nomEquipe={teams.find(t => t.uid === selectedTeamId)?.nom_equipe || "Mon Équipe"}
                />
            </div>

            <div className="toImprove-container">
                <h3>Thèmes à améliorer (Top 3 scores les plus bas) :</h3>
                {worstThemes.length > 0 ? (
                    <ul>
                        {worstThemes.map((el: any, index: number) => (
                            <li key={index}>
                                <strong>{el.theme}</strong> : {el.moyenne_perso} / 4
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
                        <div className="cellule">Mon score</div>
                        <div className="cellule">Score de mon équipe</div>
                    </li>
                    {allThemes.map((el) => (
                        <li className="Points-Rangée" key={el.theme}>
                            <div className="cellule">{el.theme}</div>
                            <div className="cellule">{el.moyenne_perso}</div>
                            <div className="cellule">{el.moyenne_equipe}</div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="role-selection">
                <h3>Rôle actuel : {selectedRole}</h3>

                {/* Bouton Manager : s'affiche si le rôle contient 'manager' */}
                {profile?.user_role?.includes('manager') && (
                    <button className="btn-mode" onClick={() => handleMode("manager")}>
                        Mode Manager
                    </button>
                )}

                {/* Bouton Agent : s'affiche si le rôle contient 'agent' */}
                {profile?.user_role?.includes('agent') && (
                    <button className="btn-mode" onClick={() => handleMode("agent")}>
                        Mode Agent
                    </button>
                )}

                {/* Lien vers le questionnaire : s'affiche si non fait */}
                {!questionnaireFait && (
                    <Link className="btn-launch" to="/questionnaire">
                        Lancer le questionnaire
                    </Link>
                )}

                {/* Bouton Se déconnecter : unique et à la fin */}
                <button className="btn-signout" onClick={handleSignOut}>
                    Se déconnecter
                </button>
            </div>
        </div>
    )
}