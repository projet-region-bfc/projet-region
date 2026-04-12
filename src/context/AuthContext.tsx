import {createContext, useState, useContext, type ReactNode, useEffect} from "react";
import {supabase} from "../supabaseClient.tsx";
import type {Session} from "@supabase/supabase-js";
import {getQuestionnaireSession} from "../services/questionnaire_sessionsService.tsx";
import {getProfileByUserId, type UserProfile} from "../services/profileService.tsx";

const AuthContext = createContext<any>(undefined);

export const AuthContextProvider = ({children}: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null); 
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [questionnaireStatus, setQuestionnaireStatus] = useState<number>(0);

    const questionnaireFait = questionnaireStatus > 0;

    
    const refreshQuestionnaireStatus = async (userId: string, role: string) => {
        const status = await getQuestionnaireSession(userId, role);
        setQuestionnaireStatus(status || 0);
    };

    useEffect(() => {
        if (!session?.user?.id) {
            setProfile(null);
            setSelectedRole("");
            setQuestionnaireStatus(0);
            return;
        }

        (async () => {
            try {
                setLoading(true);
                
                const profileData = await getProfileByUserId(session.user.id);
                setProfile(profileData as any as UserProfile);

                
                const userRole = (profileData as any)?.user_role || "";
                let initialRole = "";
                if (userRole.includes("manager")) {
                    initialRole = "manager";
                } else if (userRole.includes("agent")) {
                    initialRole = "agent";
                }

                if (initialRole) {
                    setSelectedRole(initialRole);
                    
                    await refreshQuestionnaireStatus(session.user.id, initialRole);
                }
            } catch (err) {
                console.error("Erreur AuthContext Initialisation:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

    
    useEffect(() => {
        if (session?.user?.id && selectedRole) {
            refreshQuestionnaireStatus(session.user.id, selectedRole);
        }
    }, [selectedRole, session]);

    const signInUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        return error ? {success: false, error: error.message} : {success: true, data};
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        setSelectedRole("");
        setQuestionnaireStatus(0);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            if (!session) setLoading(false);
        });

        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{
            session,
            user: session?.user,
            profile, 
            loading,
            signInUser,
            signOut,
            selectedRole,
            setSelectedRole,
            questionnaireStatus,
            questionnaireFait,
            refreshQuestionnaireStatus
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};