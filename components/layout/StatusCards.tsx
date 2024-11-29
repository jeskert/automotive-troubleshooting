'use client'

import { Schema } from '@/amplify/data/resource';
import styles from '@/styles/layout/StatusCards.module.css'
import { generateClient } from 'aws-amplify/api';
import { CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react';

const client = generateClient<Schema>();

export default function StatusCards() {
    const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);
    const [stats, setStats] = useState([
        {
            label: 'Overall',
            count: 0,
            icon: Clock,
            color: 'bg-blue-500/10',
            textColor: 'text-blue-500'
        },
        {
            label: 'In Progress',
            count: 0,
            icon: RefreshCw,
            color: 'bg-cyan-500/10',
            textColor: 'text-cyan-500'
        },
        {
            label: 'Resolved',
            count: 0,
            icon: CheckCircle,
            color: 'bg-teal-500/10',
            textColor: 'text-teal-500'
        },
        {
            label: 'Rejected',
            count: 0,
            icon: XCircle,
            color: 'bg-purple-500/10',
            textColor: 'text-purple-500'
        }
    ]);

    function listTickets() {
        client.models.Ticket.observeQuery().subscribe({
            next: (data) => {
                setTickets([...data.items]);
                updateStats(data.items);
            },
        });
    }

    function updateStats(tickets: Array<Schema["Ticket"]["type"]>) {
        const initialStats = [
            { label: 'Overall', count: 0, icon: Clock, color: 'bg-blue-500/10', textColor: 'text-blue-500' },
            { label: 'In Progress', count: 0, icon: RefreshCw, color: 'bg-cyan-500/10', textColor: 'text-cyan-500' },
            { label: 'Resolved', count: 0, icon: CheckCircle, color: 'bg-teal-500/10', textColor: 'text-teal-500' },
            { label: 'Rejected', count: 0, icon: XCircle, color: 'bg-purple-500/10', textColor: 'text-purple-500' }
        ];

        const updatedStats = tickets.reduce((acc, ticket) => {
            switch (ticket.status) {
                case 'IN_PROGRESS':
                    acc[1].count++;
                    break;
                case 'RESOLVED': // 假设 'completed' 应该是 'RESOLVED'
                    acc[2].count++;
                    break;
                case 'REJECTED':
                    acc[3].count++;
                    break;
            }
            acc[0].count++;
            return acc;
        }, initialStats);

        setStats(updatedStats);
    }

    useEffect(() => {
        listTickets();
    }, []);

    return (
        <div className={styles.container}>
            {stats.map((stat, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={`${styles.iconWrapper} ${stat.color}`}>
                            <stat.icon className={stat.textColor} size={24} />
                        </div>
                        <span className={styles.count}>{stat.count}</span>
                    </div>
                    <h3 className={styles.label}>{stat.label}</h3>
                </div>
            ))}
        </div>
    )
}
   