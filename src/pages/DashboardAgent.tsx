import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.tsx";
import { UserAuth } from "../context/AuthContext";
import { ResultatChart } from "./Resultat.tsx";

export const DashboardAgent = () => {
    const { session } = UserAuth();
    const user = session?.user;

    const [teamInfo, setTeamInfo] = useState<{ uid: string; nom_equipe: string } | null>(null);
    const [stats, setStats] = useState<any[]>([]); // On utilise any[] comme dans ResultatChart
    const [isLoading, setIsLoading] = useState(true);

    // 1. Trouver l'équipe de l'agent
    useEffect(() => {
        const fetchAgentTeam = async () => {
            if (!user?.id) return;

            // On cherche l'équipe via la table de liaison team_members
            const { data, error } = await supabase
                .from('team_members')
                .select('team_id, team:team_id (uid, nom_equipe)')
                .eq('profile_uid', user.id)
                .single();

            if (data?.team) {
                // @ts-ignore
                setTeamInfo(Array.isArray(data.team) ? data.team[0] : data.team);
            } else {
                console.error("Agent sans équipe ou erreur:", error);
                setIsLoading(false);
            }
        };
        fetchAgentTeam();
    }, [user]);

    // 2. Charger les statistiques de cette équipe
    useEffect(() => {
        if (!teamInfo?.uid || !user?.id) return;

        const fetchStats = async () => {
            setIsLoading(true);

            try {
                // On utilise la même fonction qui marche pour le manager !
                // Si la fonction demande "p_manager_id", tu lui passes l'ID de l'agent,
                // la fonction RPC est sûrement codée pour calculer le score individuel avec ce paramètre.
                const { data, error } = await supabase.rpc('get_radar_stats', {
                    p_manager_id: user.id, // ID de l'agent (pour calculer le "scoreIndividuel")
                    p_team_id: teamInfo.uid // ID de son équipe
                });

                if (error) throw error;

                if (data) {
                    setStats(data);
                }
            } catch (error) {
                console.error("Erreur chargement stats agent :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [teamInfo, user]);

    if (!user) return <p>Veuillez vous connecter pour accéder à votre espace.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Espace Équipe</h2>
            <p>Bonjour {user.email}</p>

            {isLoading ? (
                <p>Chargement de vos données...</p>
            ) : teamInfo ? (
                <div>
                    <p>Vous êtes membre de l'équipe : <strong>{teamInfo.nom_equipe}</strong></p>
                    <ResultatChart
                        data={stats}
                        nomEquipe={teamInfo.nom_equipe}
                    />
                </div>
            ) : (
                <p>Vous n'êtes actuellement assigné à aucune équipe. Contactez votre manager.</p>
            )}
        </div>
    );
};