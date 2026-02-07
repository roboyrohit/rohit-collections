import React from "react";
import { PanelMenu } from "primereact/panelmenu";
import { createCustomItems } from "../../../helpers/CreateCustomItems";
import { sideBarLinks } from "../../../constants/navBarLinks";
import { useAuthUser } from "../../../helpers/authUser";

export default function SideNavBar() {
  const [user] = useAuthUser();

  // If logged in, show all links; else, only the first link
  const accessibleLinks = user ? sideBarLinks : sideBarLinks.slice(0, 1);

  return (
    <PanelMenu
      model={createCustomItems(accessibleLinks)}
      style={{ background: "transparent", border: "none" }}
    />
  );
}
