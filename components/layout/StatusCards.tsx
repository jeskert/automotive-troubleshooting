'use client'

import styles from '@/styles/layout/StatusCards.module.css'
import { CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react'

export default function StatusCards() {
    const stats = [
        {
            label: 'Pending',
            count: 12,
            icon: Clock,
            color: 'bg-blue-500/10',
            textColor: 'text-blue-500'
        },
        {
            label: 'In Progress',
            count: 8,
            icon: RefreshCw,
            color: 'bg-cyan-500/10',
            textColor: 'text-cyan-500'
        },
        {
            label: 'Completed',
            count: 24,
            icon: CheckCircle,
            color: 'bg-teal-500/10',
            textColor: 'text-teal-500'
        },
        {
            label: 'Rejected',
            count: 3,
            icon: XCircle,
            color: 'bg-purple-500/10',
            textColor: 'text-purple-500'
        }
    ]

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