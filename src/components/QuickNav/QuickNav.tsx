import { NavLink } from "react-router-dom";
import CurrentUser from "../CurrentUser/CurrentUser";

const QuickNav = () => (
  <ul>
    <CurrentUser />
    <br />
    <NavLink
      to="/"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      Home
    </NavLink>
    <br />
    <NavLink
      to="/app/settings"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      Settings
    </NavLink>
    <br />
    <NavLink
      to="/app/login"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      Login
    </NavLink>
    <br />
    <NavLink
      to="/app/logout"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      Logout
    </NavLink>
    <br />
  </ul>
);

export default QuickNav;
