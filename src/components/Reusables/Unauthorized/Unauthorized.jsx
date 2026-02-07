import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import styles from "./unauthorized.module.scss";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className={styles.div}>
      <Card className={styles.card}>
        <i className={`pi pi-lock ${styles.icon}`} />
        <div className={styles.text}>
          <h2>Unauthorized Access</h2>
          <p>You must be logged in to view this page.</p>
        </div>
        <Button
          label="Go to Login"
          icon="pi pi-sign-in"
          className={styles.button}
          onClick={() => navigate("/auth")}
        />
      </Card>
    </div>
  );
}
