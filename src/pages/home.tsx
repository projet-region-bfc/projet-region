import {UserAuth} from "../context/AuthContext.tsx";
import {Link} from "react-router-dom";

export function Home() {

    const {session, signInUser} = UserAuth();
    console.log(session);

    return (
        <div>
            <h1>
                Accueil
            </h1>
            <div>
                <ul>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}