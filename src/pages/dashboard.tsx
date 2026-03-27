import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

export function Dashboard() {
    const {session, profile, signOut} = UserAuth();
    const navigate = useNavigate();

    console.log(session);

    const handleSignOut = async (e) => {
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
            <p>Prénom : {profile?.name} Nom : {profile?.last_name}</p>
            <button onClick={handleSignOut}>Sign out</button>
        </div>
    )
}