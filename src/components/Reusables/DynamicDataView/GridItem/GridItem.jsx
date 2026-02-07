import React, { useState } from "react";
import { Tag } from "primereact/tag";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import styles from "./gridItem.module.scss";

export default function GridItem({ data, severity, onShowDetail }) {

  return (
    <div
      className={styles.cardColumn}
      onClick={() => onShowDetail(data)}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.ratingGroup}>
            {data.Config && (
              <>
                <i className="pi pi-hammer"></i>
                <span className={styles.ratingValue}>{data.Config}</span>
              </>
            )}
            {data.Franchise && (
              <>
                <i className="pi pi-sitemap"></i>
                <span className={styles.ratingValue}>{data.Franchise}</span>
              </>
            )}
            {data.Network && (
              <>
                <i className="pi pi-ticket"></i>
                <span className={styles.ratingValue}>{data.Network}</span>
              </>
            )}
          </div>
          <Tag
            value={
              data.Result
                ? data.Result
                : data.IMDB
                ? parseFloat(data.IMDB).toFixed(1)
                : "Upcoming"
            }
            severity={severity(data)}
          />
        </div>

        <div className={styles.centerBlock}>
          <img
            className={styles.image}
            src={`/Thumbnails/${data.Thumbnail}`}
            alt={data.Name}
          />
          <div className={styles.title}>{data.FlightName || data.Name}</div>

          <Rating
            value={data.IMDB ? Number(data.IMDB) / 2 : 0}
            readOnly
            cancel={false}
          />
        </div>

        <div className={styles.bottomRow}>
          {data.Date ? (
            <span className={styles.year}>
              <i className="pi pi-calendar"></i> {data.LaunchDate}
            </span>
          ) : (
            <>
              <span className={styles.year}>
                <i className="pi pi-calendar"></i> {data.Year}
              </span>
              <Button
                icon="pi pi-eye"
                severity="success"
                rounded
                text={!data.Watched}
                raised
              />
              <Button
                icon="pi pi-heart"
                severity="danger"
                rounded
                text={!data.Liked}
                raised
              />
              <Button
                icon="pi pi-bookmark"
                rounded
                severity="warning"
                text={!data.Bookmarked}
                raised
              />
              {/* <Button
              icon="pi pi-plus-circle"
              className={styles.cartButton}
              disabled={Number(data.Year) > 2025}
            /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
