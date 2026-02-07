import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React from 'react';

export default function DocumentaryCard({ index, data, styles }) {
    return (
        <Card
            key={index}
            className={styles.documentaryCard}
            title={data.Name?.length > 42 ? data.Name.slice(0, 42) + "..." : data.Name}
            subTitle={`${data.Platform} • ${data.Year}`}
            header={
                <img
                    src={data.Thumbnail}
                    alt={data.Name}
                    className={styles.thumbnail}
                />
            }
            footer={
                <div className={styles.tags}>
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
                    <Button
                        icon="pi pi-youtube"
                        rounded
                        className="p-button-danger"
                        onClick={() => window.open(`https://www.youtube.com/embed/${data.Trailer}`, "_blank")}
                        raised
                    />

                </div>
            }
        >
            <div className={styles.docInfo}>
                <p><strong>Owner :</strong> {data.Owner}</p>
            </div>
        </Card>
    )
}
