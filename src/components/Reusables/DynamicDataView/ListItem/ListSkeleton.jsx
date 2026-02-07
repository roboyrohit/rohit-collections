import React from 'react';
import { Skeleton } from "primereact/skeleton";
import styles from "./listItem.module.scss";
import { Button } from 'primereact/button';

export default function ListSkeleton() {
    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardWrapper}>
                {/* Thumbnail */}
                <Skeleton
                    className={styles.thumbnail}
                    width="80%"
                    height="230px"
                />

                <div className={styles.contentWrapper}>
                    <div className={styles.textDiv}>
                        {/* Title */}
                        <Skeleton width="70%" height="1.4rem" className="mb-2" />

                        {/* Rating (media version placeholder) */}
                        <Skeleton width="60%" height="1.2rem" className="mb-3" />

                        {/* Meta group */}
                        <div className={styles.metaGroup}>
                            <span className={styles.originGroup}>
                                <Skeleton width="120px" height="1rem" />
                            </span>
                            <Skeleton width="70px" height="1.6rem" borderRadius="12px" />
                        </div>

                        {/* Info rows */}
                        <span className={styles.originGroup}>
                            <Skeleton width="55%" height="1rem" />
                        </span>
                        <span className={styles.originGroup}>
                            <Skeleton width="50%" height="1rem" />
                        </span>
                        <span className={styles.originGroup}>
                            <Skeleton width="65%" height="1rem" />
                        </span>
                        <span className={styles.originGroup}>
                            <Skeleton width="40%" height="1rem" />
                        </span>
                    </div>

                    {/* Action section (only visible in non-flight cards, but OK as placeholder) */}
                    <div className={styles.actionDiv}>
                        <Skeleton width="80px" height="1rem" className="mb-2" />

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
    );
};