import {supabase} from "../supabaseClient.tsx";

export interface TotalPoints {
    total_points: number | null;
}

export const getTotalPoints = async (userId: string) => {
    const {data, error} = await supabase
        .from('questionnaire_sessions')
        .select('total_points')
        .eq('profile_id', userId)
        .single()

    if (error) throw error;
    console.log(data);
    return data;
}