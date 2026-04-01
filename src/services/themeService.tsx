import {supabase} from "../supabaseClient.tsx";

export interface ThemeStat {
    theme: string;
    moyenne_points: number;
}

export const getThemeStats = async (userId: string) => {
    const { data, error } = await supabase
        .from('theme_stats_view') // On appelle la vue comme une table
        .select('theme, moyenne_points')
        .eq('profile_id', userId)
        .order('moyenne_points', { ascending: true })
        .limit(3);

    if (error) {
        console.error("Erreur lors de la récupération des pires notes :", error);
        return [];
    }
    return data;
};