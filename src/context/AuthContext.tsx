import {createContext, useState, useContext, type ReactNode, useEffect} from "react";
import {supabase} from "../supabaseClient.tsx";

const AuthContext = createContext<any>(undefined);

export const AuthContextProvider = ({children}: { children: ReactNode }) => {
    const [session, setSession] = useState<any>(undefined);

    // Sign up
    const signUpNewUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            console.error("il y a eu un probleme : ", error);
            return {success: false, error};
        }
        return {success: true, data};
    };

    // Sign in
    const signInUser = async (email: string, password: string) => {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                console.error("il y a eu un probleme de connexion : ", error);
                return {success: false, error: error.message};
            }
            console.log("sign-in success", data);
            return {success: true, data}
        } catch (error) {
            console.error("il y a eu un probleme : ", error);
        }
    }

    // Sign out

    const signOut = () => supabase.auth.signOut();

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, []);

    return (
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};