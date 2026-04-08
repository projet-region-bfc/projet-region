import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext.tsx";
import { useEffect, useState } from "react";
import { getOffreByThemeAndRole, type OffreFormation } from "../services/catalogueService.tsx";
import '../style/formations.css';

export function Formations() {
    const { slug } = useParams<{ slug: string }>();
    const { selectedRole } = UserAuth();
    const navigate = useNavigate();

    const [offres, setOffres] = useState<OffreFormation[]>([]);
    const [loading, setLoading] = useState(true);

    const downloadPdf = (fileName: string) => {
        const projectId = "iljoibwqidyrbncovhwy";

        const bucketName = "formations";

        const fullUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;

        const link = document.createElement('a');
        link.href = fullUrl;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                console.error("Erreur de récupération :", err);
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
                <h1>Offres pour le thème : {slug ? decodeURIComponent(slug) : ""}</h1>
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
                                <button
                                    onClick={() => downloadPdf(offre.pdf_url)}
                                    className="pdf-link-button"
                                >
                                    Télécharger la fiche (PDF)
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-offre">
                        Aucune offre trouvée pour ce thème avec le rôle {selectedRole}.
                    </p>
                )}
            </div>

            <button className="btn-back" onClick={() => navigate(-1)}>
                Retour au catalogue
            </button>
        </div>
    );
}