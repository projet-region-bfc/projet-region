import { useState, useEffect } from "react";
import { getCategoryWithReponse } from "../services/categoryService.tsx";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient.tsx";

interface ReponseData {
    uid: string;
    reponse_text: string;
    points: number;
    target_role: string;
}

interface CategoryData {
    uid: string;
    name: string;
    theme: {
        name: string;
    } | null;
    reponse: ReponseData[];
}

export const Questionnaire = () => {
    const navigate = useNavigate();
    const { session } = UserAuth();

    const [listeCategory, setListeCategory] = useState<Array<CategoryData>>([]);
    const [indexActuelle, setIndexActuelle] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [choixUtilisateur, setChoixUtilisateur] = useState<Record<string, string>>({});

    // Charger les catégories au démarrage
    useEffect(() => {
        (async () => {
            try {
                const data = await getCategoryWithReponse();
                if (data) setListeCategory(data);
            } catch (error) {
                console.error("Erreur chargement catégories:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Fonction pour enregistrer les résultats
    const handleVoirResultats = async () => {
        if (!session?.user) {
            alert("Vous devez être connecté pour enregistrer vos résultats.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Créer la session de questionnaire
            const { data: sessionData, error: sessionError } = await supabase
                .from("questionnaire_sessions")
                .insert([{ profile_id: session.user.id }])
                .select()
                .single();

            if (sessionError) throw sessionError;

            // 2. Préparer les lignes pour questionnaire_resultat
            const resultatsToInsert = Object.entries(choixUtilisateur).map(([categoryId, reponseId]) => ({
                session_uid: sessionData.uid,
                category_uid: categoryId,
                reponse_uid: reponseId
            }));

            // 3. Insérer les résultats en une seule fois (Bulk Insert)
            const { error: resultError } = await supabase
                .from("questionnaire_resultat")
                .insert(resultatsToInsert);

            if (resultError) throw resultError;

            console.log("Sauvegarde réussie !");

            // 4. VÉRIFICATION DU RÔLE POUR LA REDIRECTION
            // On regarde si l'utilisateur est assigné comme manager dans la table "team"
            const { data: teamData, error: teamError } = await supabase
                .from('team')
                .select('uid')
                .eq('manager_id', session.user.id);

            // S'il y a des données, c'est un manager, sinon c'est un agent !
            if (teamData && teamData.length > 0) {
                navigate("/DashboardManager");
            } else {
                navigate("/DashboardAgent");
            }

        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
            alert("Une erreur est survenue lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelection = (categoryId: string, reponseId: string) => {
        setChoixUtilisateur({
            ...choixUtilisateur,
            [categoryId]: reponseId
        });
    };

    const faireAvancer = () => {
        if (indexActuelle < listeCategory.length - 1) {
            setIndexActuelle(indexActuelle + 1);
        }
    };

    if (loading) return <p>Chargement du questionnaire...</p>;
    if (listeCategory.length === 0) return <p>Aucune donnée trouvée.</p>;

    const donneeActuelle = listeCategory[indexActuelle];
    const reponseSelectionee = choixUtilisateur[donneeActuelle.uid];
    const progression = Math.round((indexActuelle / listeCategory.length) * 100);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Évaluation de la maturité de l'équipe</h1>
            <p>Question {indexActuelle + 1} / {listeCategory.length}</p>

            <progress value={progression} max="100" style={{ width: "100%" }}></progress>
            <p>Progression : {progression}%</p>

            <div style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}>
                <h2>{donneeActuelle.theme?.name || "Thème"}</h2>
                <h3>{donneeActuelle.name}</h3>
                <p>Sélectionnez le niveau qui correspond le mieux :</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {donneeActuelle.reponse.map((rep) => (
                        <button
                            key={rep.uid}
                            onClick={() => handleSelection(donneeActuelle.uid, rep.uid)}
                            style={{
                                textAlign: "left",
                                padding: "10px",
                                backgroundColor: reponseSelectionee === rep.uid ? "#e0e0e0" : "white",
                                border: reponseSelectionee === rep.uid ? "2px solid blue" : "1px solid gray",
                                color: "black"
                            }}
                        >
                            {rep.reponse_text} (Score: {rep.points})
                        </button>
                    ))}
                </div>
            </div>

            <br />

            <div style={{ display: "flex", gap: "10px" }}>
                {indexActuelle < listeCategory.length - 1 ? (
                    <button onClick={faireAvancer} disabled={!reponseSelectionee}>
                        Question suivante
                    </button>
                ) : (
                    <button
                        onClick={handleVoirResultats}
                        disabled={!reponseSelectionee || isSubmitting}
                        style={{ backgroundColor: "green", color: "white" }}
                    >
                        {isSubmitting ? "Enregistrement..." : "Valider et voir les résultats !"}
                    </button>
                )}

                <button onClick={() => setIndexActuelle(0)}>Recommencer</button>
            </div>
        </div>
    );
};

export default Questionnaire;