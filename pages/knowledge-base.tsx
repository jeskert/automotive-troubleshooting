'use client'

import MainLayout from '@/components/layout/MainLayout'
import {Plus} from "lucide-react";
import React, {useState} from "react";
import AddKnowledgeModal from "@/components/features/AddKnowledgeModal";
import IngestionTaskList from "@/components/features/IngestionTaskList";

export default function KnowledgeBase() {

    const [showUploadModal, setShowUploadModal] = useState(false)

    const handleSuccess = () => {
        // Optionally refresh your ticket list here
        setShowUploadModal(false)
    }
    return (
        <MainLayout>
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 active:bg-blue-700 transition duration-200"
                >
                    <Plus size={20}/>
                    创建图片处理任务
                </button>
            </div>

            <IngestionTaskList/>
            <AddKnowledgeModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={handleSuccess}
            />
        </MainLayout>
    )
}
