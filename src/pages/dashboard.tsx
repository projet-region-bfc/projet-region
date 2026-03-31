import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export function Dashboard() {
    const {session, profile, signOut} = UserAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState("Agent"); // Connecté en tant que "Agent" par défaut

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



    const handleQuestion = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/PageLuisa"); // pour le test -> fichier a changer (fichier questionnaire)
        } catch (err) {
            console.error(err);
        }
    }

    if (!session) return <p>Accès refusé. Connectez-vous.</p>;


//=====================================
    // HTML
//=====================================





    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Bienvenue {session?.user?.email}</h2>
            <p>{profile?.name} {profile?.last_name}</p>
            <button
                onClick={() => setRole("Manager")}
                style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: role === "Manager" ? "#007bff" : "transparent",
                    color: role === "Manager" ? "white" : "#555",
                    transition: "0.3s"
                }}
            >
                Manager
            </button>

            {/* Bouton Agent */}
            <button
                onClick={() => setRole("Agent")}
                style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: role === "Agent" ? "#007bff" : "transparent",
                    color: role === "Agent" ? "white" : "#555",
                    transition: "0.3s"
                }}
            >
                Agent
            </button>
            <br/>
            <button onClick={handleQuestion}>Lancer le questionnaire</button>
            <br/>
            <button onClick={handleSignOut}>Sign out</button>
            <br/>
        </div>
    )
}