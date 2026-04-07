import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.tsx";
import { UserAuth } from "../context/AuthContext"; // On utilise le hook UserAuth
import { ResultatChart, type StatistiqueRadar } from "./Resultat";

export const DashboardManager = () => {
    const { session } = UserAuth(); // Récupère la session globale
    const user = session?.user;

    const [teams, setTeams] = useState<{ uid: string; nom_equipe: string }[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>("");
    const [stats, setStats] = useState<StatistiqueRadar[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Charger les équipes du manager
    useEffect(() => {
        const fetchTeams = async () => {
            if (!user?.id) return;

            const { data, error } = await supabase
                .from('team')
                .select('uid, nom_equipe')
                .eq('manager_id', user.id);

            if (data && data.length > 0) {
                setTeams(data);
                setSelectedTeamId(data[0].uid);
            } else {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, [user]);

    // 2. Charger les stats du radar
    useEffect(() => {
        if (!selectedTeamId || !user?.id) return;

        const fetchStats = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.rpc('get_radar_stats', {
                p_manager_id: user.id,
                p_team_id: selectedTeamId
            });

            if (data) setStats(data);
            setIsLoading(false);
        };

        fetchStats();
    }, [selectedTeamId, user]);

    if (!user) return <p>Veuillez vous connecter pour accéder au dashboard.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Tableau de bord de {user.email}</h2>

            {teams.length > 0 && (
                <select value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}>
                    {teams.map(team => (
                        <option key={team.uid} value={team.uid}>{team.nom_equipe}</option>
                    ))}
                </select>
            )}

            {isLoading ? (
                <p>Chargement du radar...</p>
            ) : (
                <ResultatChart
                    data={stats}
                    nomEquipe={teams.find(t => t.uid === selectedTeamId)?.nom_equipe || ""}
                />
            )}
        </div>
    );
};