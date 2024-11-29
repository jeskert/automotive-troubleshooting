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
        <div className={styles.overlay}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <FileText size={20} />
                        {mode === 'edit' ? 'Edit Ticket' : 'Create New Ticket'}
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
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className={styles.input}
                                placeholder="Enter ticket title"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="content" className={styles.label}>
                                Description
                            </label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                                className={styles.textarea}
                                placeholder="Enter ticket description"
                                required
                            />
                        </div>

                        {/* Status */}
                        {/* <div className={styles.inputGroup}>
                            <label htmlFor="status" className={styles.label}>
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    status: e.target.value as 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | 'CLOSED'
                                }))}
                                className={styles.select}
                            >
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div> */}

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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.submitButton}
                        >
                            {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Ticket' : 'Create Ticket')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 