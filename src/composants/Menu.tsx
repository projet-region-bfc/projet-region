import {Link} from 'react-router-dom';
import '../style/side-menu.css';
import {UserAuth} from "../context/AuthContext.tsx";
import logoImg from "../assets/logo.png";

export function Menu() {
    const {questionnaireFait} = UserAuth();
    return (
        <aside className="side-menu">
            <div className="logo-container">
                <img src={logoImg} alt="Logo" />
                <h2>Indice de la maturité des équipes et du management </h2>
            </div>
            <div className='trait' />

            <nav className="nav-menu">
                <Link to="/dashboard" className="nav-item active">
                    Résultats
                </Link>
                {/*<Link to="/questionnaire" className="nav-item active">*/}
                {/*    Lancer le questionnaire*/}
                {/*</Link>*/}
                {questionnaireFait != true && (
                    <Link to="/questionnaire" className="nav-item active">
                        Lancer le questionnaire
                    </Link>
                )}
                <Link to="/catalogue" className="nav-item active">
                    Catalogue de formations
                </Link>
            </nav>
        </aside>
    );
}