import {createContext, useState, useContext, ReactNode, useEffect} from "react";
import {supabase} from "../supabaseClient.tsx";
import {getProfileByUserId} from "../services/profileService.tsx";

const AuthContext = createContext<any>(undefined);

export const AuthContextProvider = ({children}: { children: ReactNode }) => {
    const [session, setSession] = useState<any>(undefined);
    const [profile, setProfile] = useState<any>(null);

    // Sign up
    const signUpNewUser = async (email, password) => {
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
    const signInUser = async (email, password) => {
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

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, []);

    // Sign out
    const signOut = () => {
        const {error} = supabase.auth.signOut();
        if (error) {
            console.error("il y a eu un probleme : ", error);
        }
    }

    useEffect(() => {
        (async () => {
            if (session?.user?.id) {
                try {
                    const data = await getProfileByUserId(session.user.id);
                    setProfile(data);
                } catch (err) {
                    console.error("Erreur profil:", err);
                }
            } else {
                setProfile(null);
            }
        })();
    }, [session]);

    return (
        <AuthContext.Provider value={{session, profile, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};