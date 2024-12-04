'use client'

import CreateTicketModal from '@/components/features/CreateTicketModal'
import TicketList from '@/components/features/TicketList'
import MainLayout from '@/components/layout/MainLayout'
import StatusCards from '@/components/layout/StatusCards'
import {Plus} from 'lucide-react'
import {useState} from 'react'

export default function TicketDashboard() {
    const [showCreateModal, setShowCreateModal] = useState(false)

    const handleSuccess = () => {
        // Optionally refresh your ticket list here
        setShowCreateModal(false)
    }

    return (
        <MainLayout>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 active:bg-blue-700 transition duration-200"
                >
                    <Plus size={20}/>
                    创建工单
                </button>
            </div>

            <StatusCards/>
            <TicketList/>

            <CreateTicketModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleSuccess}
            />
        </MainLayout>
    )
}
