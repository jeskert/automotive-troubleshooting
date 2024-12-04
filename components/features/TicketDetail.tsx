// components/features/TicketDetail.tsx
import type { Schema } from "@/amplify/data/resource";
import styles from '@/styles/features/TicketDetail.module.css';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import ImageViewerModal from '@/components/features/ImageViewerModal';
import { useState } from 'react';
import AIHelper from "@/components/features/AIHelper";

interface TicketDetailProps {
    ticket: Schema["Ticket"]["type"];
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImagePath, setSelectedImagePath] = useState('');

    const openImageViewer = (imagePath: string) => {
        setSelectedImagePath(imagePath);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setIsImageViewerOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.detail}>
                <h2 className={styles.title}>{ticket.title}</h2>
                <div className={styles.field}>
                    <span className={styles.label}>工单状态:</span>
                    <span className={styles.value}>{ticket.status}</span>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>创建人:</span>
                    <span className={styles.value}>{ticket.userId}</span>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>上次更新时间</span>
                    <span className={styles.value}>{ticket.updatedAt}</span>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>创建时间</span>
                    <span className={styles.value}>{ticket.createdAt}</span>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>已上传图像:</span>
                    <div className={styles.imagesContainer}>
                        {ticket.imagePaths?.map((imagePath, index) => (
                            imagePath ? (
                                <StorageImage
                                    key={index}
                                    alt="ticket image"
                                    path={imagePath}
                                    onClick={() => openImageViewer(imagePath)}
                                    className={styles.imageThumbnail}
                                />
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.textAreaContainer}>
                <AIHelper />
            </div>
            <ImageViewerModal
                isOpen={isImageViewerOpen}
                onClose={closeImageViewer}
                imagePath={selectedImagePath}
            />
        </div>
    );
}
