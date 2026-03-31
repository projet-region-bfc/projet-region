import { useState } from "react";

export function Questionnaire() {
    const [progression, setProgression] = useState(0);

    const faireAvancer = () => {
        if (progression < 100) {
            setProgression(progression + 5);
        }
    };

    const handleVoirResultats = () => {
        // Pour l'instant on met une alerte, mais on va mettre un navigate("/resultats") pour voir les résultats
        alert("Redirection vers la page des résultats...");
    };

    return (
        <div>
            <h1>Évaluation de la maturité de l'équipe</h1>
            <p>Thématique .../20</p>
            <p>Page .../30</p>

            {/* balise native sans style */}
            <progress value={progression} max="100"></progress>
            <p>Progression : {progression}%</p>

            <br />
            <br />

            <h2>Thème</h2>
            <h3>Catégorie</h3>
            <p>Sélectionnez le niveau qui correspond le mieux à votre pratique actuelle :</p>



            {progression < 100 && (
                <button onClick={faireAvancer}>
                    Question suivante
                </button>
            )}

            {progression === 100 && (
                <button onClick={handleVoirResultats}>
                    Voir les résultats !
                </button>
            )}

            <button onClick={() => setProgression(0)}>
                Réinitialiser
            </button>
        </div>
    );
}