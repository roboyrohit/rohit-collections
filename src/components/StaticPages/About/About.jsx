import React from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import styles from "./about.module.scss";
import logo from "../../../assets/imgs/RoboyCollections.png";

export default function About() {
  return (
    <div className={styles.aboutDiv}>
      <Card
        title="About Us"
        subTitle="Rohit Collections is a modern React app built with PrimeReact, designed to help you organize and enjoy your favourite movies, series and more."
        className={styles.infoDiv}
        header={
          <img
            src={logo}
            alt="Asha Roboy"
            className={styles.thumbnail}
          />
        }
      >
        <Divider />
        <span>Features :</span>
        <ul>
          <li>Sleek UI with PrimeReact</li>
          <li>Easy navigation and management</li>
          <li>Bookmark and watchlist support</li>
        </ul>
      </Card>
    </div>
  );
}
