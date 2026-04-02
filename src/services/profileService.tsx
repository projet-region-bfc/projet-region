import {supabase} from "../supabaseClient.tsx";

export interface UserProfile {
    name: string | null;
    last_name: string | null;
}

export const getProfileByUserId = async (userId: string) => {
    const {data, error} = await supabase
        .from('profile')
        .select('name, last_name')
        .eq('uid', userId)
        .single();

    if (error) throw error;
    return data;
};