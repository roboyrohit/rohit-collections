import React from "react";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import styles from "./listItem.module.scss";

export default function ListItem({ data, severity, onShowDetail }) {
  return (
    <div
      className={styles.cardContainer}
      onClick={() => onShowDetail(data)}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.cardWrapper}>
        <img
          className={styles.thumbnail}
          src={`/Thumbnails/${data.Thumbnail}`}
          alt={data.Name}
        />
        {Object.keys(data).includes("FlightName") ? (
          <div className={styles.contentWrapper}>
            <div className={styles.textDiv}>
              <div className={styles.title}>{data.FlightName}</div>
              <div className={styles.metaGroup}>
                <span className={styles.originGroup}>
                  <i className="pi pi-map-marker"></i>
                  <span className={styles.originText}>{data.LaunchSite}</span>
                </span>
                <Tag value={data.Result} severity={severity(data)} />
              </div>
              <span className={styles.originGroup}>
                <i className="pi pi-calendar"></i>
                <span className={styles.originText}>{data.LaunchDate}</span>
              </span>
              <span className={styles.originGroup}>
                <i className="pi pi-hammer"></i>
                <span className={styles.originText}>{data.Config}</span>
              </span>
              <span className={styles.originGroup}>
                <i className="pi pi-truck"></i>
                <span className={styles.originText}>
                  {data.Payloads.length > 35
                    ? data.Payloads.slice(0, 35) + "..."
                    : data.Payloads}
                </span>
              </span>
              <span className={styles.originGroup}>
                <i className="pi pi-upload"></i>
                <span className={styles.originText}>{data.Mass}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.contentWrapper}>
            <div className={styles.textDiv}>
              {data.Wikipedia ? (
                <a
                  href={`https://en.wikipedia.org/wiki/${data.Wikipedia}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.wikiLink}
                  title="Open wikipedia link in external browser"
                >
                  <div className={styles.title}>{data.Name}</div>
                </a>
              ) : (
                <div className={styles.title}>{data.Name}</div>
              )}
              <Rating
                value={Number(data.IMDB)}
                readOnly
                cancel={false}
                onIcon={<i className="pi pi-thumbs-up-fill"></i>}
                offIcon={<i className="pi pi-thumbs-up"></i>}
                stars={10}
              />
              <div className={styles.metaGroup}>
                <span className={styles.originGroup}>
                  <i className="pi pi-map-marker"></i>
                  <span className={styles.originText}>{data.Origin}</span>
                </span>
                <Tag
                  value={
                    data.IMDB ? parseFloat(data.IMDB).toFixed(1) : "Upcoming"
                  }
                  severity={severity(data)}
                />
              </div>
              <span className={styles.originGroup}>
                <i className="pi pi-users"></i>
                <span className={styles.originText}>{data.Director}</span>
              </span>
              <span className={styles.originGroup}>
                <i className="pi pi-ticket"></i>
                <span className={styles.originText}>{data.Genre}</span>
              </span>
              {data.Language && (
                <span className={styles.originGroup}>
                  <i className="pi pi-language"></i>
                  <span className={styles.originText}>{data.Language}</span>
                </span>
              )}
              {data.Episodes && (
                <span className={styles.originGroup}>
                  <i className="pi pi-truck"></i>
                  <span className={styles.originText}>{data.Episodes}</span>
                </span>
              )}
            </div>
            <div className={styles.actionDiv}>
              <span className={styles.price}>
                <i className="pi pi-calendar"></i> {data.Year}
              </span>
              <Button
                icon="pi pi-eye"
                rounded
                severity="success"
                text={!data.Watched}
                raised
              />
              <Button
                icon={"pi pi-heart"}
                rounded
                severity="danger"
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
                icon="pi pi-shopping-cart"
                className={styles.button}
                disabled={Number(data.Year) > 2025}
              /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
