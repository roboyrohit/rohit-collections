import React from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import styles from "./gridItem.module.scss";

export default function GridSkeleton() {
    return (
        <div className={styles.cardColumn}>
            <div className={styles.card}>
                {/* Top Row */}
                <div className={styles.topRow}>
                    <div className={styles.ratingGroup}>
                        <Skeleton width="60px" height="1rem" />
                        <Skeleton width="80px" height="1rem" className="ml-2" />
                    </div>

                    <Skeleton width="70px" height="1.6rem" borderRadius="12px" />
                </div>

                {/* Center Block */}
                <div className={styles.centerBlock}>
                    <Skeleton
                        className={styles.image}
                        width="80%"
                        height="280px"
                    />

                    <Skeleton width="75%" height="1.4rem" className="mt-2" />

                    <Skeleton width="60%" height="1.2rem" className="mt-1" />
                </div>

                {/* Bottom Row */}
                <div className={styles.bottomRow}>
                    <Skeleton width="90px" height="1rem" />

                    <div>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
