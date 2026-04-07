import { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import { supabase } from "../supabaseClient.tsx";
import type { Session } from "@supabase/supabase-js";

// Création du contexte
const AuthContext = createContext<any>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const signUpNewUser = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        return error ? { success: false, error } : { success: true, data };
    };

    const signInUser = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { success: false, error: error.message } : { success: true, data };
    };

    const signOut = () => supabase.auth.signOut();

    useEffect(() => {
        // Récupérer la session initiale
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Écouter les changements (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ session, user: session?.user, loading, signUpNewUser, signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Le Hook personnalisé pour utiliser l'auth partout
export const UserAuth = () => {
    return useContext(AuthContext);
};