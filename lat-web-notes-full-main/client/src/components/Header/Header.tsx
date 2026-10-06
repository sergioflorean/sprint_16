import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'header__nav-link header__nav-link_active'
    : 'header__nav-link';
}

function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/signin');
  }

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__logo">
          Mis notas
        </NavLink>
        <nav className="header__nav">
          {isAuthenticated ? (
            <>
              <p className="header__text">{currentUser?.name}</p>
              <button
                type="button"
                className="header__logout-btn"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={getNavLinkClass}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/signup" className={getNavLinkClass}>
                Registrarse
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
