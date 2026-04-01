import {supabase} from "../supabaseClient.tsx";

export interface ThemeStat {
    theme: string;
    moyenne_points: number;
}

export const getThemeStats = async (userId: string, order: 'ASC' | 'DESC') => {
    let query = supabase
        .from('theme_stats_view')
        .select('theme, moyenne_points')
        .eq('profile_id', userId);

    query = query.order('moyenne_points', {ascending: order == 'ASC'})

    const {data, error} = await query.limit(3);

    if (error) {
        console.error("Erreur lors de la récupération des pires notes :", error);
        return [];
    }
    return data;
};