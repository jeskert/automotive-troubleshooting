'use client'

import { Schema } from '@/amplify/data/resource'
import styles from '@/styles/features/CreateTicketModal.module.css'
import { generateClient } from '@aws-amplify/api'
import { FileUploader } from '@aws-amplify/ui-react-storage'
import { FileText, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import '@aws-amplify/ui-react/styles.css';

const client = generateClient<Schema>()

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket?: Schema["Ticket"]["type"] | null;
    mode?: 'create' | 'edit';
    onSuccess?: () => void;
}

export default function CreateTicketModal({ isOpen, onClose, ticket, mode = 'create', onSuccess }: CreateTicketModalProps) {
    const [imagePaths, setImagePaths] = React.useState<string[]>([]);

    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'CLOSED';
        userId: number;
        resolverId: number;
        imagePaths: string[];
    }>({
        title: '',
        content: '',
        status: 'NEW',
        userId: 1,
        resolverId: 1,
        imagePaths: []
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (ticket && mode === 'edit') {
            setFormData({
                title: ticket.title ?? '',
                content: ticket.content ?? '',
                status: ticket.status ?? 'NEW',
                userId: ticket.userId ?? 1,
                resolverId: ticket.resolverId ?? 1,
                imagePaths: ticket.imagePaths?.filter((path): path is string => path !== null) ?? []
            });
            setImagePaths(ticket.imagePaths?.filter((path): path is string => path !== null) ?? []);
        }
    }, [ticket, mode]);

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (mode === 'edit' && ticket?.id) {
                await client.models.Ticket.update({
                    id: ticket.id,
                    ...formData
                });
            } else {
                await client.models.Ticket.create({
                    ...formData
                });
            }
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('Error creating/updating ticket:', error)
        } finally {
            setIsSubmitting(false)
        }
    };

    const handleFileUploadSuccess = (event: { key?: string }) => {
        if (!event.key) return;
        setImagePaths(prev => [...prev, event.key!]);
        setFormData(prev => ({ ...prev, imagePaths: [...prev.imagePaths, event.key!] }));
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
                        <FileText size={20} />
                        {mode === 'edit' ? '编辑工单' : '创建工单'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        {/* Title */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="title" className={styles.label}>
                                标题
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className={styles.input}
                                placeholder="输入工单标题"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="content" className={styles.label}>
                                详情
                            </label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                                className={styles.textarea}
                                placeholder="输入详细描述..."
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className={styles.inputGroup}>
                            <FileUploader
                                acceptedFileTypes={['image/*']}
                                path="ticket-pictures/"
                                maxFileCount={10}
                                isResumable
                                onUploadSuccess={handleFileUploadSuccess}
                                onFileRemove={handleFileRemove}
                            />
                        </div>
                    </div>

                    {/* Actions */}
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
                            {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? '更新工单' : '创建工单')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
