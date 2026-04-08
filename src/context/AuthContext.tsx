import {createContext, useState, useContext, type ReactNode, useEffect} from "react";
import {supabase} from "../supabaseClient.tsx";
import type {Session} from "@supabase/supabase-js";
import {getQuestionnaireSession} from "../services/questionnaire_sessionsService.tsx";

// Création du contexte
const AuthContext = createContext<any>(undefined);

export const AuthContextProvider = ({children}: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<string>("agent");
    const [questionnaireStatus, setQuestionnaireStatus] = useState<number>(0);

    const questionnaireFait = questionnaireStatus > 0;

    useEffect(() => {
        (async () => {
            if (session?.user?.id) {
                try {
                    const count = await getQuestionnaireSession(session.user.id, selectedRole);
                    setQuestionnaireStatus(count ?? 0);
                } catch (err) {
                    console.error("Erreur check questionnaire status:", err);
                }
            }
        })();
    }, [session, selectedRole]);

    const signUpNewUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({email, password});
        return error ? {success: false, error} : {success: true, data};
    };

    const signInUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        return error ? {success: false, error: error.message} : {success: true, data};
    };

    const signOut = () => supabase.auth.signOut();

    useEffect(() => {
        // Récupérer la session initiale
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            setLoading(false);
        });

        // Écouter les changements (login/logout)
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{
            session,
            user: session?.user,
            loading,
            signUpNewUser,
            signInUser,
            signOut,
            selectedRole,
            setSelectedRole,
            questionnaireStatus,
            questionnaireFait
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Le Hook personnalisé pour utiliser l'auth partout
export const UserAuth = () => {
    return useContext(AuthContext);
};