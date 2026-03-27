import {useState} from "react";
import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";

export function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {session, signInUser} = UserAuth();
    const navigate = useNavigate();
    console.log(session);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signInUser(email, password);
            if (result.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            setError("Une erreur c'est produite");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSignIn}>
                <div>
                    <h2>Login page</h2>
                    <p>Vous n'avez pas de compte ? <Link to="/signup">Sign up!</Link> </p>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="email"/>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="password"/>
                    <input type="submit" value="envoyer"/>
                </div>
                {error}
            </form>
        </div>
    )
}