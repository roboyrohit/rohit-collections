import React from 'react';
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Skeleton } from 'primereact/skeleton'

export default function SkeletonCard({ styles }) {
    return (
        <Card
            className={styles.documentaryCard}
            title={<Skeleton width="70%" height="1.5rem" />}
            subTitle={<Skeleton width="50%" height="1rem" />}
            header={
                <Skeleton
                    width="100%"
                    height="180px"
                    className={styles.thumbnail}
                />
            }
            footer={
                <div className={styles.tags}>
                    <Button
                        icon="pi pi-eye"
                        rounded
                        disabled
                        className="p-button-text"
                    />
                    <Button
                        icon="pi pi-heart"
                        rounded
                        disabled
                        className="p-button-text"
                    />
                    <Button
                        icon="pi pi-bookmark"
                        rounded
                        disabled
                        className="p-button-text"
                    />
                    <Button
                        icon="pi pi-youtube"
                        rounded
                        disabled
                        className="p-button-text"
                    />
                </div>
            }
        >
            <div className={styles.docInfo}>
                <Skeleton width="60%" height="1rem" />
            </div>
        </Card>
    )
}
