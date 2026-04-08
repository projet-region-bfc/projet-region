import {useState, useEffect} from "react";
import {getFullQuestionnaire} from "../services/themeService.tsx";
import {UserAuth} from "../context/AuthContext.tsx";
import {insertQuestionnaireResults, insertQuestionnaireSession} from "../services/questionnaire_sessionsService.tsx";

interface Etape {
    idCategorie: string;
    nomCategorie: string;
    nomTheme: string;
    options: {
        uid: string;
        reponse_text: string;
        points: number;
    }[];
}

export function Questionnaire() {
    const {session, selectedRole} = UserAuth();
    const [listeEtapes, setListeEtapes] = useState<Etape[]>([]);
    const [index, setIndex] = useState(0);
    const [reponsesChoisies, setReponsesChoisies] = useState<Record<string, string>>({});
    const [chargement, setchargement] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getFullQuestionnaire(selectedRole);

                const listeReponseTemp: Etape[] = [];

                data.forEach((theme) => {
                    theme.category.forEach((cat) => {
                        listeReponseTemp.push({
                            idCategorie: cat.uid,
                            nomTheme: theme.name,
                            nomCategorie: cat.name,
                            options: cat.reponse
                        });
                    });
                });

                setListeEtapes(listeReponseTemp);

            } catch (err) {
                console.error(err);
            } finally {
                setchargement(false);
            }
        })();
    }, []);

    if (chargement) return <p>Chargement...</p>;
    if (listeEtapes.length === 0) return <p>Aucune donnée.</p>;

    const etapeCourante = listeEtapes[index];
    const dejaRepondu = reponsesChoisies[etapeCourante.idCategorie];

    const selectionner = (idReponse: string) => {
        setReponsesChoisies({
            ...reponsesChoisies,
            [etapeCourante.idCategorie]: idReponse
        });
    };

    console.log(reponsesChoisies)
    Object.entries(reponsesChoisies).forEach(([idCategorie, idReponse]) => {
        console.log(`Pour la catégorie ${idCategorie}, la réponse est ${idReponse}`);
    });

    const sendReponse = async () => {
        try {
            setIsSubmitting(true);
            const sessionData = await insertQuestionnaireSession(session.user.id, selectedRole);
            const sessionId = sessionData.uid;

            
            const reponsesFormatees = Object.entries(reponsesChoisies).map(([idCategorie, idReponse]) => ({
                session_uid: sessionId,  
                category_uid: idCategorie, 
                reponse_uid: idReponse     
            }));

            await insertQuestionnaireResults(reponsesFormatees);

            alert(`Bravo ! Questionnaire enregistré.`);
            window.location.href = "/dashboard";

        } catch (err) {
            console.error("Erreur :", err);
            alert("Une erreur est survenue.");
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="question-container">
            <h1 className="question-main-title">Questionnaire : {selectedRole}</h1>

            <p className="question-progress-text">Question {index + 1} / {listeEtapes.length}</p>
            <progress className="question-progress-bar" value={index + 1} max={listeEtapes.length}></progress>

            <div className="question-card">
                <p className="question-theme-badge"><strong>Thème :</strong> {etapeCourante.nomTheme}</p>
                <h2 className="question-title">{etapeCourante.nomCategorie}</h2>

                <div className="question-options-list">
                    {etapeCourante.options.map((opt) => (
                        <button
                            key={opt.uid}
                            onClick={() => selectionner(opt.uid)}
                            className={`question-option-btn ${dejaRepondu === opt.uid ? "selected" : ""}`}
                        >
                            {dejaRepondu === opt.uid ? "✅ " : ""}{opt.reponse_text}
                        </button>
                    ))}
                </div>
            </div>

            <div className="question-actions-container">
                {index < listeEtapes.length - 1 ? (
                    <button className="question-btn-primaire" onClick={() => setIndex(index + 1)}
                            disabled={!dejaRepondu}>
                        Suivant
                    </button>
                ) : (
                    <button
                        className="question-btn-primaire"
                        onClick={sendReponse}
                        disabled={!dejaRepondu || isSubmitting} 
                    >
                        {isSubmitting ? "Envoi..." : "Terminer"}
                    </button>
                )}

                <button className="question-btn-secondaire" onClick={() => setIndex(0)}>Recommencer</button>
            </div>
        </div>
    );
}