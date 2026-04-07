import { Link } from 'react-router-dom';
import '../style/side-menu.css';

export function Menu() {
  return (
    <aside className="side-menu">
      <div className="logo-container">
        <h2>La Region </h2>
      </div>

      <nav className="nav-menu">
        <Link to="/dashboard" className="nav-item active">
          Dashboard
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