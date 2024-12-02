import type { Schema } from "@/amplify/data/resource";
import styles from '@/styles/features/TicketDetail.module.css';
import { StorageImage } from "@aws-amplify/ui-react-storage";

interface TicketDetailProps {
    ticket: Schema["Ticket"]["type"];
}

export default function TicketDetail({ ticket }: TicketDetailProps) {
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
                                <StorageImage key={index} alt="ticket image" path={imagePath} />
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.textAreaContainer}>
                <textarea className={styles.textArea} placeholder="Enter your notes here..."></textarea>
            </div>
        </div>
    );
}
