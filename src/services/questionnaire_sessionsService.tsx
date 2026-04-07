import {supabase} from "../supabaseClient.tsx";

export interface TotalPoints {
    total_points: number | null;
}

export const getTotalPoints = async (userId: string, role: string): Promise<TotalPoints> => {
    const { data, error } = await supabase
        .from('questionnaire_sessions')
        .select(`
            total_points,
            questionnaire_resultat!inner (
                reponse!inner (target_role)
            )
        `)
        .eq('profile_id', userId)
        .eq('questionnaire_resultat.reponse.target_role', role.toLowerCase());

    if (error) throw error;

    // On additionne les total_points de toutes les sessions correspondant au rôle
    // (Même s'il n'y en a qu'une, .reduce est plus safe)
    const sum = data?.reduce((acc, curr) => acc + (curr.total_points || 0), 0) || 0;

    return { total_points: sum };
}