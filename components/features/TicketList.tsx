'use client'

import type { Schema } from "@/amplify/data/resource";
import styles from '@/styles/features/TicketList.module.css';
import { generateClient } from "aws-amplify/data";
import { Edit2, MoreVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {Amplify} from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function TicketList() {
    const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);

    function deleteTicket(id: string | null | undefined) {
        if (!id) return;
        client.models.Ticket.delete({ id });
    }

    function listTickets() {
        client.models.Ticket.observeQuery().subscribe({
            next: (data) => setTickets([...data.items]),
        });
    }

    useEffect(() => {
        listTickets();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>ID</th>
                            <th className={styles.th}>Ticket Title</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Creator</th>
                            <th className={styles.th}>Update Time</th>
                            <th className={styles.th}>Creation Time</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className={styles.tr}>
                                <td className={styles.td}>{ticket.id}</td>
                                <td className={styles.td}>{ticket.title}</td>
                                <td className={styles.td}>{ticket.status}</td>
                                <td className={styles.td}>{ticket.userId}</td>
                                <td className={styles.td}>{ticket.updatedAt}</td>
                                <td className={styles.td}>{ticket.createdAt}</td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <button className={styles.actionButton}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className={styles.actionButton} onClick={() => deleteTicket(ticket.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                        <button className={styles.actionButton}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 