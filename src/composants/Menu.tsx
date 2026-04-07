import { Link } from 'react-router-dom';
import '../style/side-menu.css';

export function Menu() {
  return (
    <aside className="side-menu">
      <div className="logo-container">
        <h2>La region </h2>
      </div>

      <nav className="nav-menu">
        <Link to="/" className="nav-item active">
          Home
        </Link>

        <Link to="/dashboard" className="nav-item active">
          Dashboard
        </Link>
      </nav>
    </aside>
  );
}