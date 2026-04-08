import {useNavigate, useParams} from "react-router-dom";
import {UserAuth} from "../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import {getOffreByThemeAndRole, type OffreFormation} from "../services/catalogueService.tsx";

export function Formations() {
    const {slug} = useParams<{slug: string}>();
    console.log(slug);
    const { selectedRole} = UserAuth();
    const navigate = useNavigate();

    const [offres, setOffres] = useState<OffreFormation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffres = async () => {
            if (!slug || !selectedRole) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const themeName = decodeURIComponent(slug);

                const data = await getOffreByThemeAndRole(themeName, selectedRole);
                setOffres(data);
            } catch (err) {
                console.log("erreur lors de la récupération des données :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffres();
    }, [slug, selectedRole]);
    if (loading) return <p>Chargement des offres...</p>;

    return (
        <div className="formations-detail-container">
            <header className="formations-header">
                <h1>Offre pour le thème : {slug ? decodeURIComponent(slug) : ""}</h1>
                <p>Profil actuel : <strong>{selectedRole}</strong></p>
            </header>

            <div className="offres-list">
                {offres.length > 0 ? (
                    offres.map((offre) => (
                        <div key={offre.uid} className="offre-card">
                            <div className="offre-content">
                                <p className="offre-texte">{offre.formation_text}</p>
                            </div>
                            {offre.pdf_url && (
                                <a href={offre.pdf_url} target="_blank" rel="noopener noreferrer" className="pdf-link-button">
                                    Télécharger la fiche (PDF)
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-offre">
                        aucune offre n'a été trouvée pour ce thème avec ce rôle {selectedRole}.
                    </p>
                )}
            </div>

            <button className="btn-back" onClick={() => navigate(-1)}>
                Retour au catalogue
            </button>
        </div>

    );
}