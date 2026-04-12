import {supabase} from "../supabaseClient.tsx";

export interface OffreFormation {
    uid: string;
    theme_name: string;
    formation_text: string;
    role: string;
    pdf_url: string;
}

export const getOffreByThemeAndRole = async (themeName: string, role: string): Promise<OffreFormation[]> => {
    const { data, error } = await supabase
        .from('resultats_offre' as any)
        .select('*')
        .eq('theme_name', themeName)
        .eq('role', role);

    if (error) throw error;
    return (data as unknown as OffreFormation[]) || [];
};