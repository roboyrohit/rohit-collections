import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { loginUser } from "../../../helpers/authUser";
import { SIGN_IN } from "../../../assets/apis/apiList";
import useAxios from "../../../hooks/useAxios";
import styles from "./loginPage.module.scss";
import logo from "../../../assets/imgs/RoboyCollections.png";


export default function LoginPage({ toggle }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { callApi: signIn, errors, loading } = useAxios(SIGN_IN);

  const handleLogin = () => {
    try {
      signIn({ LoginID: username, Password: password })
        .then((res) => {
          if (res && res.success) {
            loginUser(res.userData); // Save user data to localStorage
            navigate("/");
            window.dispatchEvent(new Event("authChange")); // trigger re-render
          } else {
            // Handle login failure
          }
        })
        .catch((err) => {
          console.log("Error :>", err);
        });
    } catch (err) {
      console.log("Error :>", err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card
        title="Welcome Back 👋"
        subTitle="Please login to continue"
        header={
          <img
            src={logo}
            alt="Asha Roboy"
            className={styles.thumbnail}
          />
        }
        className={styles.loginCard}
      >
        <div className={styles.formWrapper}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username :</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password :</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false}
              placeholder="Enter your password"
              className={styles.inputField}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <Checkbox
              inputId="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          <Button
            label="Login"
            icon="pi pi-sign-in"
            onClick={handleLogin}
            className={styles.loginButton}
          />

          <Divider className={styles.divider} />

          <Button
            label="Create New Account"
            icon="pi pi-user-plus"
            onClick={toggle}
          // className={styles.loginButton}
          />
        </div>
      </Card>
    </div>
  );
}
