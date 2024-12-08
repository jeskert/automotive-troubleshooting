'use client'

import type {Schema} from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import styles from '@/styles/features/TicketList.module.css';
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/data";
import {Play, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import AddKnowledgeModal from "@/components/features/AddKnowledgeModal";
import {Nullable} from "@aws-amplify/data-schema";
import {downloadData} from 'aws-amplify/storage';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function IngestionTaskList() {
    const [ingestionTask, setIngestionTask] = useState<Array<Schema["IngestionTask"]["type"]>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Schema["IngestionTask"]["type"] | null>(null);


    function deleteTask(id: string | null | undefined) {
        if (!id) return;
        client.models.IngestionTask.delete({id});
    }

    async function processImage(imageUrl: string) {
        try {
            const {body} = await downloadData({
                path: imageUrl
            }).result;
            const blob = await body.blob();
            const base64String = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        const base64Data = reader.result.toString().split(',')[1]; // Remove data URL prefix
                        resolve(base64Data);
                    } else {
                        reject(new Error('Failed to read image data'));
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({image: base64String}),
            });

            const metadata = await response.json();
            const jsonString = JSON.stringify(metadata);
            const data2 = JSON.parse(jsonString);
            const jsonBytes = new TextEncoder().encode(JSON.stringify(data2));
            const base64Bytes = Buffer.from(jsonBytes).toString('base64');
            const encodedJson = Buffer.from(base64Bytes, 'base64').toString();
            const embeddingResponse = await fetch('/api/save-embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({metadataString: encodedJson, metadata: metadata, image: base64String}),
            });
            metadata.s3_location = imageUrl;
            return true;
        } catch (error) {
            console.error('Error processing image:', error);
            return false;
        }
    }

    async function startTask(id: string | null | undefined) {
        if (!id) return;

        try {
            await client.models.IngestionTask.update({
                id,
                status: "IN_PROGRESS",
            });

            const ingestionTask = await client.models.IngestionTask.get({id});
            if (!ingestionTask || !ingestionTask.data || !ingestionTask.data.imagePaths) {
                throw new Error('No images found for ingestionTask');
            }

            const validImagePaths = ingestionTask.data.imagePaths.filter((imageUrl: Nullable<string>) => imageUrl !== null && imageUrl !== undefined) as string[];


            const results = await Promise.all(
                validImagePaths.map(imageUrl => processImage(imageUrl))
            );

            if (results.every(result => result === true)) {
                await client.models.IngestionTask.update({
                    id,
                    status: "COMPLETED",
                });
            } else {
                await client.models.IngestionTask.update({
                    id,
                    status: "ERROR",
                });
            }
        } catch (error) {
            console.error('Error in startTask:', error);
            await client.models.IngestionTask.update({
                id,
                status: "ERROR",
            });
        }
    }


    function listIngestionTask() {
        client.models.IngestionTask.observeQuery().subscribe({
            next: (data) => setIngestionTask([...data.items]),
        });
    }

    useEffect(() => {
        listIngestionTask();
    }, []);

    function handleModalClose() {
        setIsModalOpen(false);
        setSelectedTask(null);
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>状态</th>
                            <th className={styles.th}>创建时间</th>
                            <th className={styles.th}>操作</th>
                        </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                        {ingestionTask.map((ingestionTask) => (
                            <tr key={ingestionTask.id} className={styles.tr}>
                                <td className={styles.td}>{ingestionTask.status}</td>
                                <td className={styles.td}>{ingestionTask.createdAt}</td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <button className={styles.actionButton}
                                                onClick={() => startTask(ingestionTask.id)}>
                                            <Play size={16}/>
                                        </button>
                                        <button className={styles.actionButton}
                                                onClick={() => deleteTask(ingestionTask.id)}>
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddKnowledgeModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                ingestionTask={selectedTask}
            />
        </div>
    )
}
