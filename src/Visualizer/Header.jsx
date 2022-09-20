import React from "react";
import "./styles/Header.css";

export default function Header() {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <span className="navbar-brand mb-0">Pathfinding Visualizer</span>
        <div className="navbar-text github-icon">
        <a href="https://github.com/chrisliang12"><i className="fa-brands fa-github fa-lg"></i></a>
      </div>
      </div>
    </nav>
  );
}
