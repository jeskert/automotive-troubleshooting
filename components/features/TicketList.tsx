// components/features/TicketList.tsx
'use client'

import type {Schema} from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import styles from '@/styles/features/TicketList.module.css';
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/data";
import {Edit2, Trash2} from 'lucide-react';
import {useEffect, useState} from 'react';
import CreateTicketModal from "./CreateTicketModal";
import TabLayout from "@/components/layout/TabLayout";
import TicketDetail from "@/components/features/TicketDetail";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function TicketList() {
    const [tickets, setTickets] = useState<Array<Schema["Ticket"]["type"]>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Schema["Ticket"]["type"] | null>(null);
    const [tabs, setTabs] = useState<{ label: string; content: React.ReactNode }[]>([{
        label: "工单列表",
        content: <div>Initial Content</div>
    }]);
    const [activeTab, setActiveTab] = useState("工单列表");

    function deleteTicket(id: string | null | undefined) {
        if (!id) return;
        client.models.Ticket.delete({id});
    }

    function listTickets() {
        client.models.Ticket.observeQuery().subscribe({
            next: (data) => setTickets([...data.items]),
        });
    }

    useEffect(() => {
        listTickets();
    }, []);

    function handleEditClick(ticket: Schema["Ticket"]["type"]) {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    }

    function handleModalClose() {
        setIsModalOpen(false);
        setSelectedTicket(null);
    }

    function handleRowClick(ticket: Schema["Ticket"]["type"]) {
        const existingTab = tabs.find(tab => tab.label === ticket.title);
        if (existingTab) {
            setActiveTab(existingTab.label);
        } else {
            const newTab = {
                label: ticket.title || '', // 确保 label 始终为 string 类型
                content: <TicketDetail ticket={ticket}/>
            };
            setTabs([...tabs, newTab]);
            setActiveTab(newTab.label);
        }
    }


    const handleCloseTab = (label: string) => {
        const newTabs = tabs.filter(tab => tab.label !== label);
        setTabs(newTabs);

        // 如果关闭的是当前激活的 Tab，则激活前一个 Tab
        if (label === activeTab) {
            const newIndex = Math.max(0, tabs.findIndex(tab => tab.label === label) - 1);
            setActiveTab(tabs[newIndex]?.label || '');
        }
    };

    return (
        <div className={styles.container}>
            <TabLayout activeTab={activeTab} onTabChange={setActiveTab} onCloseTab={handleCloseTab}>
                {tabs.map((tab, index) => (
                    <div key={index} label={tab.label}>
                        {tab.label === "工单列表" ? (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead className={styles.thead}>
                                    <tr>
                                        <th className={styles.th}>标题</th>
                                        <th className={styles.th}>状态</th>
                                        <th className={styles.th}>创建人</th>
                                        <th className={styles.th}>更新时间</th>
                                        <th className={styles.th}>创建时间</th>
                                        <th className={styles.th}>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody className={styles.tbody}>
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className={styles.tr}
                                            onClick={() => handleRowClick(ticket)}>
                                            <td className={styles.td}>{ticket.title}</td>
                                            <td className={styles.td}>{ticket.status}</td>
                                            <td className={styles.td}>{ticket.userId}</td>
                                            <td className={styles.td}>{ticket.updatedAt}</td>
                                            <td className={styles.td}>{ticket.createdAt}</td>
                                            <td className={styles.td}>
                                                <div className={styles.actions}>
                                                    <button className={styles.actionButton}
                                                            onClick={() => handleEditClick(ticket)}>
                                                        <Edit2 size={16}/>
                                                    </button>
                                                    <button className={styles.actionButton}
                                                            onClick={() => deleteTicket(ticket.id)}>
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            tab.content
                        )}
                    </div>
                ))}
            </TabLayout>
            <CreateTicketModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                ticket={selectedTicket}
                mode="edit"
            />
        </div>
    )
}
