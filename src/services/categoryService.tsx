import { supabase } from "../supabaseClient.tsx";

export const getCategoryWithReponse = async () => {
    try {
        const { data, error } = await supabase
            .from('category')
            .select(`
                uid,
                name,
                theme (
                    name
                ),
                reponse (
                    uid,
                    reponse_text,
                    points,
                    target_role
                )
            `);

        if (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Erreur dans getCategoryWithReponse :", error);
        return null;
    }
};