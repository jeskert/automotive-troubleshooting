'use client'

import { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import styles from '@/styles/layout/MainLayout.module.css'

interface MainLayoutProps {
    children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Function to handle sidebar collapse state change
    const handleSidebarCollapse = (collapsed: boolean) => {
        setIsCollapsed(collapsed)
    }

    return (
        <div className={styles.layout}>
            <Sidebar onCollapseChange={handleSidebarCollapse} />
            <main className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ''}`}>
                {children}
            </main>
        </div>
    )
}
