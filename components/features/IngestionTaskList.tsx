// components/features/IngestionTaskList.tsx
'use client'

import type {Schema} from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import styles from '@/styles/features/TicketList.module.css';
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/data";
import {Play, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import AddKnowledgeModal from "@/components/features/AddKnowledgeModal";

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

    function startTask(id: string | null | undefined) {
        if (!id) return;
        client.models.IngestionTask.update({
            id,
            status: "IN_PROGRESS",
        });
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
