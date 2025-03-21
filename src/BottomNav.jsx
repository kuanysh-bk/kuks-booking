import React from "react";
import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className="nav-btn">
        Главная
      </NavLink>
      <NavLink to="/excursions" className="nav-btn">
        Экскурсии
      </NavLink>
      <NavLink to="/cars" className="nav-btn">
        Авто
      </NavLink>
    </nav>
  );
};

export default BottomNav;
