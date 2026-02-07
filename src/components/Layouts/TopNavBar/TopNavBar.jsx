import React, { useCallback } from "react";
import { Menubar } from "primereact/menubar";
import { createCustomItems } from "../../../helpers/CreateCustomItems";
import { topBarLinks } from "../../../constants/navBarLinks";
import logo from "../../../assets/imgs/RoboyCollections.png";
import styles from "./TopNavBar.scss";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { useNavigate } from "react-router-dom";
import { logoutUser, useAuthUser } from "../../../helpers/authUser";

export default function TopNavBar() {
  const [profile] = useAuthUser();
  const navigate = useNavigate();

  const handleSignIn = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logoutUser();
    navigate("/");
    window.dispatchEvent(new Event("authChange")); // trigger re-render
  }, []);

  const start = (
    <img alt="logo" className={styles.logo} src={logo} height="40" />
  );

  const end = (
    <div className={styles.menuend}>
      {profile && profile.userID > 0 ? (
        <>
          <Chip className={styles.profilename} label={profile.firstName} />
          <Button
            icon="pi pi-sign-out"
            severity="danger"
            rounded
            text
            tooltip="Logout"
            tooltipOptions={{ position: "bottom" }}
            onClick={handleLogout}
          />
        </>
      ) : (
        <Button
          icon="pi pi-sign-in"
          severity="success"
          rounded
          text
          tooltip="Log In"
          tooltipOptions={{ position: "bottom" }}
          onClick={handleSignIn}
        />
      )}
    </div>
  );

  return (
    <Menubar
      start={start}
      model={createCustomItems(topBarLinks)}
      end={end}
      className="navBar"
    />
  );
}
