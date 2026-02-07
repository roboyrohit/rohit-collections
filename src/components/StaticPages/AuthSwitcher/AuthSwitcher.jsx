import React, { useState } from "react";
import LoginPage from "../../UserPages/LoginPage/LoginPage";
import SignupPage from "../../UserPages/SignUpPage/SignUpPage";
import styles from "./authSwitcher.module.scss";

export default function AuthSwitcher() {
  const [showLogin, setShowLogin] = useState(true);

  const handleSwitch = () => setShowLogin((prev) => !prev);

  return (
    <div className={styles.authSwitcherWrapper}>
      <div
        className={`${styles.cardContainer} ${
          showLogin ? styles.slideInLeft : styles.slideInRight
        }`}
      >
        {showLogin ? (
          <LoginPage toggle={handleSwitch} />
        ) : (
          <SignupPage toggle={handleSwitch} />
        )}
      </div>
    </div>
  );
}
