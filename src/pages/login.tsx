import { useState } from "react";
import { UserAuth } from "../context/AuthContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();


  const colors = {
    bg: "#00636D", 
    accent: "#00828C", 
    border: "#CCCCCC", 
    textLabel: "#555555", 
    textPlaceholder: "#AAAAAA", 
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
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
      color: "white",
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
    logoText: {
      fontSize: "60px",
      fontWeight: "800",
      letterSpacing: "-2px",
      margin: 0,
    },

            logoImg: {
            position: "absolute",
            top: "30px",
            left: "30px",
            width: "200px",
            height: "auto",
            objectFit: "contain",
        },

    card: {
      backgroundColor: "white",
      borderRadius: "15px", 
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "500px",
      padding: "40px",
      color: "#333333",
      boxSizing: "border-box", 
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      color: colors.textLabel,
      fontWeight: "400",
    },

    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },

    inputIcon: {
      position: "absolute",
      left: "15px",
      width: "20px",
      height: "20px",
      color: "#CCCCCC",
      pointerEvents: "none", 
    },

    input: {
      width: "100%",
      padding: "15px 20px",
      paddingLeft: "45px", 
      border: `1px solid ${colors.border}`, 
      borderRadius: "8px",
      fontSize: "16px",
      color: "#333333",
      backgroundColor: "white",
      boxSizing: "border-box",
      outline: "none",
      transition: "border-color 0.2s",
    },

    inputPass: {
      paddingLeft: "20px", 
    },
   

    submitButton: {
      width: "100%",
      backgroundColor: colors.accent,
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "18px 20px",
      fontSize: "18px",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background-color 0.2s",
    },

    rgpdText: {
      marginTop: "30px",
      fontSize: "11px",
      color: "#999999",
      textAlign: "center",
      lineHeight: "1.6",
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
                    <img src={logoImg} alt="Logo" style={styles.logoImg} />
                    <h1 style={styles.logoText}>La région</h1>
                </div>
        <br/>
        <p style={{ fontSize: "16px", margin: 0, opacity: 0.9 }}>
          Connectez-vous pour accéder à votre espace
        </p>
      </div>

      <div style={styles.card}>
        

        <form onSubmit={handleSignIn} style={styles.form}>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Mail professionnel</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input 
                type="email" 
                placeholder="prenom.nom@bourgognefranchecomte."
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input} 
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{...styles.input, ...styles.inputPass}} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={styles.submitButton}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p style={styles.rgpdText}>
          En vous connectant, vous acceptez que vos données soient traitées conformément au RGPD. 
          Vos informations restent confidentielles et ne sont utilisées que dans le cadre de votre accompagnement professionnel.
        </p>
      </div>

            <Link to="/signup" style={styles.footerLink}>
        Vous n'avez pas de compte ? <span style={{ fontWeight: "bold", textDecoration: "underline" }}>Inscrivez-vous</span>
      </Link>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
}