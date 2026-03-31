import {supabase} from "../supabaseClient.tsx";

export const getStatsAvecVue = async (userId: string) => {
    const { data, error } = await supabase
        .from('theme_stats_view') // On appelle la vue comme une table
        .select('theme, moyenne_points')
        .eq('profile_id', userId)
        .order('moyenne_points', { ascending: true })
        .limit(3);

    if (error) throw error;
    return data;
};