import {supabase} from "../supabaseClient.tsx";

export const get3PiresScores = async (userId: string) {
    const {data, error} = await supabase
        .from('team_members')

}