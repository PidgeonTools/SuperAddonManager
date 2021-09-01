import React from "react";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark menu shadow fixed-top">
    <div className="container">
      <a className="navbar-brand" href="#">
        <img src="./images/logo.png" alt="Home" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#ABOUT" className="nav-link">
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="#DOCUMENTATION" className="nav-link">
              Docs
            </a>
          </li>
          <li className="nav-item">
            <a href="#GET" className="nav-link">
              Get Super Addon Manager
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
