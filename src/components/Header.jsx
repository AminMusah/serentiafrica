import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [header, setHeader] = useState(false);

  const menuOpen = () => {
    setOpenMenu(!openMenu);
  };

  const headerTop = () => {
    setHeader(!openMenu);
  };
  return (
    <header className="header">
      <div className="header-bottom" data-header>
        <div className="container">
          <Link to="/" class="logo">
            <img
              src="/images/7D1CAE8D-5631-415E-A139-0B95215A0B9F-removebg.png"
              width="216"
              height="80"
              alt="serenti"
              className="w-100"
            />
          </Link>

          <nav className={`navbar ${openMenu ? "navbar-active" : ""}`}>
            <ul className="navbar-list">
              <li>
                <Link to="/" className="navbar-link" data-nav-link>
                  Home
                </Link>
              </li>

              <li>
                <Link to="/about" className="navbar-link" data-nav-link>
                  About
                </Link>
              </li>

              <li>
                <Link to="/service" className="navbar-link" data-nav-link>
                  Service
                </Link>
              </li>

              <li>
                <Link to="/portfolio" className="navbar-link" data-nav-link>
                  Portfolio
                </Link>
              </li>

              <li>
                <Link to="/blog" className="navbar-link" data-nav-link>
                  Blog
                </Link>
              </li>

              <li>
                <Link to="/contact" className="navbar-link" data-nav-link>
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to="/meettheteam" className="navbar-link" data-nav-link>
                  Meet The Team
                </Link>
              </li>
            </ul>

            <Link to="/portfolio" className="btn btn-primary">
              Explore
            </Link>
          </nav>

          <button
            className="nav-open-btn"
            aria-label="open menu"
            data-nav-toggler
            onClick={menuOpen}
          >
            <span className="span"></span>
            <span className="span"></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
