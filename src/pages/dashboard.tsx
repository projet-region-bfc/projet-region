import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export function Dashboard() {
    const {session, profile, signOut} = UserAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState("Agent"); // Connecté en tant que "Agent" par défaut

    // faire un truc ou quand tu cliques sur le bouton agent ça t'amène a la page agent. Et quand tu cliques sur manager ça t'amène sur la page manager.

    // if agent affiche bonjour et if manager affiche au revoir

    console.log(session);

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            navigate("/home");
        } catch (err) {
            console.error(err);
        }
    }

    const handleQuestion = async (e) => {
        e.preventDefault();
            navigate("/Questionnaire");
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
            >
                Manager
            </button>

            {/* EXEMPLE DE STYLE POUR LE BOUTON MANAGER
            style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: role === "Manager" ? "#007bff" : "transparent",
                    color: role === "Manager" ? "white" : "#555",
                    transition: "0.3s"
                }}*/}

            {/* Bouton Agent */}
            <button
                onClick={() => setRole("Agent")}
            >
                Agent
            </button>


            {/* EXEMPLE DE STYLE pour le bouton
            style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: role === "Agent" ? "#007bff" : "transparent",
                    color: role === "Agent" ? "white" : "#555",
                    transition: "0.3s"
                }}*/}
            <br/>


            {/* Ici on gère les if agent / manager*/}

            {/* IF agent :*/}

            {role === "Agent" && (
                <div>
                    <h3>Espace Agent</h3>
                    <p>Bonjour {profile?.name} !</p>
                    {/* ici on pourra mettre les graphiques/sondages de l'agent, ou l'actualité*/}
                </div>
            )}

            {/* IF manager*/}

            {role === "Manager" && (
                <div>
                    <h3>Espace Manager</h3>
                    <p>Au revoir {profile?.name} !</p>
                    {/* ici on pourra mettre les graphiques/sondages de l'agent, ou l'actualité, la vue sur l'agent etc*/}
                </div>
            )}
            <button onClick={handleQuestion}>Lancer le questionnaire</button>
            <br/>
            <button onClick={handleSignOut}>Se déconnecter</button>
            <br/>
        </div>
    )
}