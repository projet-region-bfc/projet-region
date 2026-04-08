import {supabase} from "../supabaseClient.tsx";

export interface TotalPoints {
    total_points: number | null;
}

// export const getTotalPoints = async (userId: string, role: string): Promise<TotalPoints> => {
//     const { data, error } = await supabase
//         .from('questionnaire_sessions')
//         .select(`
//             total_points,
//             questionnaire_resultat!inner (
//                 reponse!inner (target_role)
//             )
//         `)
//         .eq('profile_id', userId)
//         .eq('questionnaire_resultat.reponse.target_role', role.toLowerCase());
//
//     if (error) throw error;
//
//     const sum = data?.reduce((acc, curr) => acc + (curr.total_points || 0), 0) || 0;
//
//     return { total_points: sum };
// }

export const getTotalPoints = async (userId: string, role: string): Promise<TotalPoints> => {
    const { data, error } = await supabase
        .from('questionnaire_sessions')
        .select('total_points')
        .eq('profile_id', userId)
        .eq('role', role.toLowerCase()); // Filtrage direct sur la nouvelle colonne !

    if (error) throw error;

    const sum = data?.reduce((acc, curr) => acc + (curr.total_points || 0), 0) || 0;
    return { total_points: sum };
}

export const getQuestionnaireSession = async (userId: string, role: string) => {
    const { data, error } = await supabase
        .from('user_questionnaire_status_view')
        .select('statut_questionnaire')
        .eq('profile_id', userId)
        .eq('questionnaire_role', role);

    if (error) throw error;
    return data?.length;
}

export const insertQuestionnaireSession = async (userId: string, role: string) => {
    const { data, error } = await supabase
        .from('questionnaire_sessions')
        .insert([{
            profile_id: userId,
            role: role
        }])
        .select()
        .single()

    if (error) throw error;
    return data
}

export const insertQuestionnaireResults = async (results: any[]) => {
    const { error } = await supabase
        .from('questionnaire_resultat')
        .insert(results);

    if (error) throw error;
};