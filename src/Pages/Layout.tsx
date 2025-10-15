import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { ScrollToTop } from "../Components/ScrollToTop";

export const Layout: React.FC = () => {
  const [theme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Removed CursorOrb component as it is undefined */}
      <NavBar />
      <ScrollToTop />
      <main className="relative z-10 flex-grow">
        <Outlet /> {/* Renders the page for each route */}
      </main>
    </div>
  );
};
