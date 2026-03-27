import {UserAuth} from "../context/AuthContext.tsx";

export function Home() {

    const {session, signInUser} = UserAuth();
    console.log(session);

    return (
        <div>Accueil</div>
    )
}