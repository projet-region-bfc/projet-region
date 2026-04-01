import { useState, useEffect } from "react";
import { getCategoryWithTheme} from "../services/categoryService.tsx";

interface ReponseData{
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


export function Questionnaire() {
    const [listeCategory, setListeCategory] = useState<Array<CategoryData>>([]); // Liste complète de toutes les catégories.

    /// Savoir à quelle catégorie on est. (0)

    const [indexActuelle, setIndexActuelle] = useState(0);

    const [loading, setLoading] = useState(true);

    const [choixUtilisateur, setChoixUtilisateur] = useState<Record<string, string>>({});

    useEffect(() => {
        (async () => {
            try {
                const data = await getCategoryWithTheme();
                if (data) {
                    setListeCategory(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    },[]);

    const progression = listeCategory.length > 0
        ? Math.round((indexActuelle / listeCategory.length) * 100) : 0;

    const handleSelection = (categoryId: string, reponseId: string) => {
        setChoixUtilisateur({
            ...choixUtilisateur,
            [categoryId]: reponseId
        });
    };


    const faireAvancer = () => {
        if (progression < 100) {
            setProgression(progression + 5);
        }
    };

    const handleVoirResultats = () => {
        // Pour l'instant on met une alerte, mais on va mettre un navigate("/resultats") pour voir les résultats
        alert("Redirection vers la page des résultats...");
    };
    if (loading) return <p>Chargement du questionnaire...</p>;
    if (listeCategory.length === 0)
        return <p>Aucune données trouvées.</p>;

    const donneeActuelle = listeCategory[indexActuelle];

    const reponseSelectionee = choixUtilisateur[donneeActuelle.uid];

    return (
        <div>
            <h1>Évaluation de la maturité de l'équipe</h1>
            <p>Thématique {indexActuelle + 1}/{listeCategory.length}</p>
            <p>Page .../30</p>

            {/* balise native sans style */}
            <progress value={progression} max="100"></progress>
            <p>Progression : {progression}%</p>

            <br />
            <br />

            <h2>{donneeActuelle.theme?.name || "Thème introuvable"}</h2>
            <h3>{donneeActuelle.name || "Catégorie introuvable"}</h3>
            <p>Sélectionnez le niveau qui correspond le mieux à votre pratique actuelle :</p>


            <div>
                {donneeActuelle.reponse.map((rep) => (
                    <button key={rep.uid} onClick={() => handleSelection(donneeActuelle.uid, rep.uid)}>
                        {rep.reponse_text}
                    </button>
                ))}
            </div>

            <br />



            {indexActuelle < listeCategory.length - 1 && (
                <button onClick={faireAvancer}
                disabled={!reponseSelectionee}>
                    Question suivante
                </button>
            )}

            {indexActuelle === listeCategory.length - 1 && (
                <button onClick={handleVoirResultats}
                disabled={!reponseSelectionee}>
                    Voir les résultats !
                </button>
            )}

            <button onClick={() => setIndexActuelle(0)}>
                Recommencer.
            </button>
        </div>
    );
}

export default Questionnaire