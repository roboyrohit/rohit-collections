import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import loadingImg from "../../../assets/imgs/underDevelopment.gif";
import styles from "./pageNotFound.module.scss";

export default function PageNotFound() {
  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <Image src={loadingImg} alt="Image" width="250" />
        <div className={styles.text}>
          <h2>404 - Page Not Found</h2>
          <p>
            Oops! The page you are looking for does not exist.
            <br />
            Maybe you took a wrong turn somewhere...
          </p>
        </div>
        <Button
          label="Go Home"
          icon="pi pi-home"
          className={styles.button}
          onClick={() => (window.location.href = "/")}
        />
      </Card>
    </div>
  );
}
