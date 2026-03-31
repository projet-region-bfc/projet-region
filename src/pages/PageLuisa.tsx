import {useState, useEffect} from "react";


    function PageLuisa() {

        const [count, setCount] = useState(0);

        const [nom,setNom] = useState("");

        const [allume, setAllume] = useState(false);

        const [items, setItems] = useState([]);

        const ajouter = () => {
            // @ts-ignore
            setItems([...items, "Nouvel item"]);
        };

        useEffect(() => {
            console.log("Le composant a été chargé ou count a changé !");
        }, [count]);

        const increment = () => {
            setCount(count + 1);
        }
        return <>
            <div>
                <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Tape ton nom"
                />
                <p>Bonjour {nom}</p>
            </div>
            <div>
                <h1>Bienvenue sur la page de Luisa !</h1>
                <h2>Page de test pour apprendre react</h2>
                <p>Nous avons appris a faire un use state, maintenant apprenons use effect.</p>
            </div>
            <p> Compteur : {count} </p>
        <button onClick={() => increment()}>Clique</button>
            <button onClick={() => setAllume(!allume)}>
                {allume ? "ON" : "OFF"}
            </button>

            <div>
                <button onClick={ajouter}>Ajouter</button>
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </>
    }

export default PageLuisa

