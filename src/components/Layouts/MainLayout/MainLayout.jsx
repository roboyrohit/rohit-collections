import React from "react";
import { Outlet } from "react-router-dom";
import TopNavBar from "../TopNavBar/TopNavBar";
import SideNavBar from "../SideNavBar/SideNavBar";
import Layoutstyles from "./mainlayout.module.scss";

export default function MainLayout() {
  return (
    <div className={Layoutstyles.container}>
      <TopNavBar className={Layoutstyles.topNav} />
      <div className={Layoutstyles.mainContent}>
        <div className={Layoutstyles.sidebar}>
          <SideNavBar />
        </div>
        <main className={Layoutstyles.outlet}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}