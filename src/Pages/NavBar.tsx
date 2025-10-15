import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/comosLogo.svg";

export const NavBar: React.FC = () => {
  return (
      <nav className="navbar sticky top-0 z-50 px-4 md:px-10 backdrop-blur-md h-[60px] border-b border-base-300 comos-bg/80">
        <div className="container mx-auto flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/#homeSection" className="flex-shrink-0 flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-20 md:w-28 h-20 md:h-28" />
          </Link>
          <Link to="/join-waitlist" className="btn comos-bg rounded-xl px-4 text-white transition-transform hover:scale-105">
            Join Waitlist
          </Link>
        </div>
      </nav>
    );
};