import {useState} from "react";
import {UserAuth} from "../context/AuthContext.tsx";
import {Link, useNavigate} from "react-router-dom";

export function Signup() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {session, signUpNewUser} = UserAuth();
    const navigate = useNavigate();
    console.log(session);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signUpNewUser(email, password);
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
            <form onSubmit={handleSignUp}>
                <div>
                    <h2>Signup page</h2>
                    <p>Vous avez déjà un compte ? <Link to="/login">Login !</Link> </p>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="email"/>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="password"/>
                    <input type="submit" value="envoyer"/>
                </div>
                {error}
            </form>
        </div>
    )
}