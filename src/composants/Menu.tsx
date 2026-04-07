import { Link } from 'react-router-dom';
import '../style/side-menu.css';

export function Menu() {
  return (
    <aside className="side-menu">
      <div className="logo-container">
        <h2>Indice de la maturité des équipes et du management </h2>
      </div>

      <nav className="nav-menu">
        <Link to="/dashboard" className="nav-item active">
          Résultats
        </Link>
          <Link to="/questionnaire" className="nav-item active">
              Lancer le questionnaire
          </Link>
          <Link to="/formation" className="nav-item active">
             Catalogue de formations
          </Link>
      </nav>
    </aside>
  );
}