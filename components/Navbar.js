const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo-container">
        <img
          className="navbar__logo"
          src="./img/CM_logo.svg"
          alt="Chartmetric logo"
        />
        <img
          className="navbar__logo-mini"
          src="./img/CM_logo_mini.png"
          alt="Chartmetric minimized logo"
        />
      </div>
      <ul className="navbar__content">
        <li>
          <Search />
        </li>
        <li>
          <i className="fas fa-bullhorn navbar__icon"></i>
        </li>
        <li>
          <i className="fas fa-bell navbar__icon"></i>
        </li>
        <li>
          <i className="fas fa-bars navbar__icon"></i>
        </li>
      </ul>
    </nav>
  );
};
