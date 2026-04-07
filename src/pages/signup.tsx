import {useState} from "react";
import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";
import logoImg from "../assets/logo.png";

export function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {signUpNewUser} = UserAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signUpNewUser(email, password);
            if (result.success) {
                navigate("/main");
            }
        } catch (err) {
            setError("Une erreur s'est produite lors de la création du compte");
        } finally {
            setLoading(false);
        }
    }


    const colors = {
        bg: "#00636D",
        accent: "#00828C",
        border: "#CCCCCC",
        textLabel: "#555555",
    };

    const styles = {
        page: {
            minHeight: "100vh",
            backgroundColor: colors.bg,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            padding: "20px",
            position: "relative",
        },
        header: {
            textAlign: "center",
            marginBottom: "50px",
        },
        logoContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "15px",
        },
        logoImg: {
            position: "absolute",
            top: "30px",
            left: "30px",
            width: "200px",
            height: "auto",
            objectFit: "contain",
        },
        logoText: {
            fontSize: "60px",
            fontWeight: "800",
            letterSpacing: "-2px",
            margin: 0,
        },
        card: {
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "480px",
            padding: "45px",
            boxSizing: "border-box",
        },
        title: {
            fontSize: "24px",
            color: "#333",
            fontWeight: "700",
            marginBottom: "10px",
            textAlign: "center",
        },
        subtitle: {
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "30px",
        },
        form: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
        },
        inputGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
        },
        label: {
            fontSize: "14px",
            color: colors.textLabel,
            fontWeight: "500",
        },
        input: {
            width: "100%",
            padding: "14px 18px",
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            fontSize: "16px",
            boxSizing: "border-box",
            outline: "none",
            backgroundColor: "#F9FAFB",
            color: "#333",
        },
        submitButton: {
            width: "100%",
            backgroundColor: colors.accent,
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "10px",
            transition: "all 0.2s",
        },
        footerLink: {
            marginTop: "25px",
            textAlign: "center",
            fontSize: "14px",
            color: "white",
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <img src={logoImg} alt="Logo" style={styles.logoImg}/>
                    <h1 style={styles.logoText}>Indice de la maturité des équipes et du management</h1>
                </div>
                <br/>
                <p style={{fontSize: "16px", margin: 0, opacity: 0.9, color: "white"}}>
                    Créer votre compte pour accéder à votre espace
                </p>
            </div>

            {/* Carte d'inscription */}
            <div style={styles.card}>
                <h2 style={styles.title}>Créer un compte</h2>
                <p style={styles.subtitle}>Remplissez les informations ci-dessous</p>

                <form onSubmit={handleSignUp} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mail professionnel</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="prenom.nom@bourgognefranchecomte"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                            style={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Création..." : "S'inscrire"}
                    </button>
                </form>

                {error && (
                    <p style={{color: "#DC2626", fontSize: "13px", textAlign: "center", marginTop: "15px"}}>
                        {error}
                    </p>
                )}
            </div>

            <Link to="/login" style={styles.footerLink}>
                Vous avez déjà un compte ? <span
                style={{fontWeight: "bold", textDecoration: "underline"}}>Connectez-vous</span>
            </Link>
        </div>
    );
}