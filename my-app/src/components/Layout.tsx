import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "../App.css";

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
