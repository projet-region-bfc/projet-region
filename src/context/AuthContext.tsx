import {createContext, useState, useContext, type ReactNode, useEffect} from "react";
import {supabase} from "../supabaseClient.tsx";
import type {Session} from "@supabase/supabase-js";
import {getQuestionnaireSession} from "../services/questionnaire_sessionsService.tsx";
import {getProfileByUserId} from "../services/profileService.tsx";

// Création du contexte
const AuthContext = createContext<any>(undefined);

export const AuthContextProvider = ({children}: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [questionnaireStatus, setQuestionnaireStatus] = useState<number>(0);

    const questionnaireFait = questionnaireStatus > 0;

    useEffect(() => {
        // 1. Si pas de session, on reset tout et on s'arrête
        if (!session?.user?.id) {
            setSelectedRole("");
            setQuestionnaireStatus(0);
            return;
        }

        (async () => {
            try {
                // 2. On récupère TOUJOURS le profil du nouvel utilisateur
                const profile = await getProfileByUserId(session.user.id);
                const userRole = profile?.user_role || "";

                // 3. Détermination du rôle cible (Priorité Manager)
                let roleToSet = "";
                if (userRole.includes('manager')) {
                    roleToSet = 'manager';
                } else {
                    roleToSet = 'agent';
                }

                // 4. On met à jour le selectedRole si c'est une nouvelle connexion
                // ou si on n'a pas encore de rôle défini
                if (selectedRole === "") {
                    setSelectedRole(roleToSet);
                }

                // 5. On vérifie le statut du questionnaire avec le bon rôle
                // On utilise selectedRole s'il existe (cas du switch manuel), sinon le rôle calculé
                const roleForStatus = selectedRole !== "" ? selectedRole : roleToSet;
                const count = await getQuestionnaireSession(session.user.id, roleForStatus);
                setQuestionnaireStatus(count ?? 0);

            } catch (err) {
                console.error("Erreur initialisation Auth:", err);
            }
        })();
    }, [session?.user?.id, selectedRole]); // <--- ON SURVEILLE L'ID PRÉCIS ET LE ROLE

    const signUpNewUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({email, password});
        return error ? {success: false, error} : {success: true, data};
    };

    const signInUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        return error ? {success: false, error: error.message} : {success: true, data};
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setSelectedRole("");
        setQuestionnaireStatus(0);
    }

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