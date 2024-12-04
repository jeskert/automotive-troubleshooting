// components/features/ImageViewerModal.tsx
'use client'

import styles from '@/styles/features/ImageViewerModal.module.css'
import {X} from 'lucide-react'
import {StorageImage} from "@aws-amplify/ui-react-storage";


interface ImageViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    imagePath: string;
}

export default function ImageViewerModal({isOpen, onClose, imagePath}: ImageViewerModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    <X size={24}/>
                </button>
                <StorageImage path={imagePath} alt="ticket image" className={styles.image}/>
            </div>
        </div>
    )
}
