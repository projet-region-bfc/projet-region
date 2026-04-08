import {useParams} from "react-router-dom";

export function Formations() {
    const {slug} = useParams();
    console.log(slug);
    return (
        <div>
        <h1>Bienvenue sur nos offres de formations</h1>
        <p>Bienvenue</p>
        </div>
    )
}