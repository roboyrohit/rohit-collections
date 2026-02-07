import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Image } from "primereact/image";
import styles from "./loadingCard.module.scss";
import loadingImg from "../../../assets/imgs/underDevelopment.gif";

export default function LoadingCard({
  info = "Hang tight, magic is loading...",
}) {
  return (
    <div className={styles.loadingDiv}>
      <div className={styles.loadingbar}>
        {/* <div
          style={{ fontSize: "5rem", color: "#2196f3", marginBottom: "1rem" }}
        >
          <span role="img" aria-label="lost">
            🎨~✨
          </span>
        </div> */}
        <Image src={loadingImg} alt="Image" width="250" />
        <p className={styles.message}>{info}</p>
        <ProgressSpinner strokeWidth="4" />
        <p className={styles.message}>Warming up awesomeness…</p>
      </div>
    </div>
  );
}
