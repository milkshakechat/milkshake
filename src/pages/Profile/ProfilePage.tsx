import AppLayout from "@/AppLayout";
import { NavLink } from "react-router-dom";

const ProfilePage = () => {
  return (
    <>
      <div>ProfilePage</div>
      <NavLink
        to="/app/profile/style"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Edit Profile
      </NavLink>
    </>
  );
};

export default ProfilePage;
