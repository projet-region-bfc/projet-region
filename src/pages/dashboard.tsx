import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getProfileByUserId} from "../services/profileService.tsx";
import * as React from "react";

interface UserProfile {
    name: string | null;
    last_name: string | null;
}

export function Dashboard() {
    const {session, signOut} = UserAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<string>("Agent");

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

    console.log(session);
    console.log(role);

    const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    }

    if (!session) return <p>Accès refusé. Connectez-vous.</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Bienvenue {session?.user?.email}</h2>
            <p>{profile?.name} {profile?.last_name}</p>
            <button onClick={() => setRole("Manager")} >Manager</button>
            <button onClick={() => setRole("Agent")} >Agent</button>
            <button onClick={handleSignOut}>Se déconnecter</button>
        </div>
    )
}