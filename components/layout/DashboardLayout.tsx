'use client'

import { Bell, Filter } from 'lucide-react'
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
    children: ReactNode
    title: string
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <main className="ml-64 pt-16 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Filter size={20} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Bell size={20} />
                            </button>
                        </div>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    )
} 