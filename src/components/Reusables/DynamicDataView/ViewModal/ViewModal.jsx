import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import styles from "./viewModal.module.scss";
import { Tag } from "primereact/tag";

export default function ViewModal({ visible, onHide, data, severity }) {
  const iframeRef = useRef(null);

  // Stop video when modal closes
  const handleHide = () => {
    if (iframeRef.current) {
      iframeRef.current.src = ""; // Unload the video
    }
    onHide();
  };

  if (!data) return null;

  const renderHeader = () => {
    return (
      <div className={styles.modalHeader}>
        {data.Wikipedia ? (
          <a
            href={`https://en.wikipedia.org/wiki/${data.Wikipedia}`}
            target="_blank"
          >
            {data.Name}
          </a>
        ) : (
          data.FlightName || data.Name
        )}
        <label>({data.LaunchDate || data.Year})</label>
      </div>
    );
  };

  return (
    <Dialog
      className={styles.modal}
      header={renderHeader()}
      visible={visible}
      onHide={handleHide}
      modal
    >
      <div className={styles.content}>
        <div className={styles.left}>
          {data.imdbThumbnail ? (
            <a
              href={`https://m.media-amazon.com/images/M/${data.imdbThumbnail}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imdbLink}
              title="Open original poster in external browser"
            >
              <img
                className={styles.thumbnail}
                src={`/Thumbnails/${data.Thumbnail}`}
                alt={data.Name}
              />
            </a>
          ) : (
            <img
              className={styles.thumbnail}
              src={`/Thumbnails/${data.Thumbnail}`}
              alt={data.Name}
            />
          )}
        </div>
        {Object.keys(data).includes("FlightName") ? (
          <div className={styles.right}>
            <div className={styles.details}>
              <table>
                <tbody>
                  <tr>
                    <th>Launch Site :</th>
                    <td>{data.LaunchSite}</td>
                  </tr>
                  <tr>
                    <th>Payload No :</th>
                    <td>{data.PayloadsNos}</td>
                  </tr>

                  <tr>
                    <th>Config :</th>
                    <td>{data.Config}</td>
                  </tr>
                  <tr>
                    <th>Mass :</th>
                    <td>{data.Mass}</td>
                  </tr>
                  <tr>
                    <th>Result :</th>
                    <td>
                      <Tag value={data.Result} severity={severity(data)} />
                    </td>
                  </tr>
                  <tr>
                    <th>Payloads :</th>
                    <td>{data.Payloads}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={styles.right}>
            <div className={styles.details}>
              <table>
                <tbody>
                  <tr>
                    <th>IMDB :</th>
                    <td> {data.IMDB || "Upcoming"}</td>
                  </tr>
                  {data.Rating && (
                    <tr>
                      <th>Rating :</th>
                      <td> {data.Rating}</td>
                    </tr>
                  )}
                  <tr>
                    <th>Origin :</th>
                    <td> {data.Origin}</td>
                  </tr>
                  <tr>
                    <th>Genre :</th>
                    <td> {data.Genre}</td>
                  </tr>
                  <tr>
                    <th>Director :</th>
                    <td> {data.Director}</td>
                  </tr>
                  {data.Language && (
                    <tr>
                      <th>Language :</th>
                      <td> {data.Language}</td>
                    </tr>
                  )}
                  {data.Franchise && (
                    <tr>
                      <th>Franchise :</th>
                      <td> {data.Franchise}</td>
                    </tr>
                  )}
                  {data.Episodes && (
                    <tr>
                      <th>Episodes :</th>
                      <td> {data.Episodes}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {data.Trailer && (
              <div className={styles.trailer}>
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${data.Trailer}?autoplay=1&mute=1&loop=1`}
                  title={`${data.Name} Trailer`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
