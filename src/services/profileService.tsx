import {supabase} from "../supabaseClient.tsx";

export interface UserProfile {
    name: string | null;
    last_name: string | null;
    user_role: string | null;
}

export const getProfileByUserId = async (userId: string) => {
    const {data, error} = await supabase
        .from('profile_roles_view')
        .select('name, last_name, user_role')
        .eq('uid', userId)
        .single();

    if (error) throw error;
    console.log(data);
    return data;
}