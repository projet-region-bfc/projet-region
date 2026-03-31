import {UserAuth} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";


export function Home() {

   // const {session, signInUser} = UserAuth();
   //  console.log(session);

        const { session } = UserAuth();
        const navigate = useNavigate();

        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <h1>Bienvenue sur l'Accueil</h1>

                {session ? (
                    <div>
                        <p>Vous êtes connecté avec : <strong>{session.user?.email}</strong></p>
                        {/* Le bouton qui te ramène au Dashboard */}
                        <button
                            onClick={() => navigate("/dashboard")}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            Accéder à mon Dashboard
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>Veuillez vous connecter pour accéder à vos outils.</p>
                        <button onClick={() => navigate("/login")}>
                            Se connecter
                        </button>
                    </div>
                )}
            </div>
        );
    }