'use client'

import {Schema} from '@/amplify/data/resource'
import styles from '@/styles/features/CreateTicketModal.module.css'
import {generateClient} from '@aws-amplify/api'
import {FileUploader} from '@aws-amplify/ui-react-storage'
import {FileText, X} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>()

interface AddKnowledgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    ingestionTask?: Schema["IngestionTask"]["type"] | null;
    onSuccess?: () => void;
}


export default function AddKnowledgeModal({isOpen, onClose, ingestionTask, onSuccess}: AddKnowledgeModalProps) {
    const [imagePaths, setImagePaths] = React.useState<string[]>([]);

    const [formData, setFormData] = useState<{
        status: 'IN_PROGRESS' | 'COMPLETED' | 'ERROR';
        imagePaths: string[];
    }>({
        status: 'IN_PROGRESS',
        imagePaths: []
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (ingestionTask) {
            setFormData({
                status: ingestionTask.status ?? 'IN_PROGRESS',
                imagePaths: ingestionTask.imagePaths?.filter((path): path is string => path !== null) ?? []
            });
            setImagePaths(ingestionTask.imagePaths?.filter((path): path is string => path !== null) ?? []);
        } else {
            setFormData({
                status: 'IN_PROGRESS',
                imagePaths: []
            });
            setImagePaths([]);
        }
    }, [ingestionTask]);

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await client.models.IngestionTask.create({
                ...formData
            });

            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating ingestion task:', error)
        } finally {
            setIsSubmitting(false)
        }
    };

    const handleFileUploadSuccess = (event: { key?: string }) => {
        if (!event.key) return;
        setImagePaths(prev => [...prev, event.key!]);
        setFormData(prev => ({...prev, imagePaths: [...prev.imagePaths, event.key!]}));
    };

    const handleFileRemove = (event: { key?: string }) => {
        if (!event.key) return;
        setImagePaths(prev => prev.filter(k => k !== event.key));
    };

    return (
        <div className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}>
            <div className={`${styles.container} ${isOpen ? styles.visible : ''}`}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <FileText size={20}/>
                        添加图片
                    </h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <div className={styles.inputGroup}>
                            <FileUploader
                                acceptedFileTypes={['image/*']}
                                path="knowledge-base-pictures/"
                                maxFileCount={10}
                                isResumable
                                onUploadSuccess={handleFileUploadSuccess}
                                onFileRemove={handleFileRemove}
                            />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.submitButton}
                        >
                            {isSubmitting ? '创建任务中' : '创建任务'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
