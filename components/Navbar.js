import React from "react";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark menu shadow fixed-top">
    <div className="container">
      <a class="navbar-brand" href="#">
        <img src="./images/logo.png" alt="Home" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a href="#ABOUT" class="nav-link">
              About
            </a>
          </li>
          <li class="nav-item">
            <a href="#DOCUMENTATION" class="nav-link">
              Docs
            </a>
          </li>
          <li class="nav-item">
            <a href="#GET" class="nav-link">
              Get Super Addon Manager
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
