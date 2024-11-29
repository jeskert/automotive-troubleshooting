'use client'

import styles from '@/styles/layout/Sidebar.module.css'
import {
    ClipboardList,
    FileText,
    LayoutDashboard,
    Menu
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/' },
        { icon: ClipboardList, label: 'Work Order Management', href: '/work-order-management' },
        { icon: FileText, label: 'My Tasks', href: '/my-tasks' },
    ]

    return (
        <>
            {/* Overlay for mobile */}
            {!isCollapsed && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
                {/* Toggle Button */}
                <button
                    className={styles.toggleButton}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <Menu size={20} />
                </button>

                {/* Logo */}
                <div className={styles.logo}>
                    <img
                        src="https://picsum.photos/32"
                        alt="Logo"
                        className={styles.logoImage}
                    />
                    {!isCollapsed && <span className={styles.logoText}>Dashboard</span>}
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                            >
                                <item.icon className={styles.navIcon} />
                                {!isCollapsed && <span className={styles.navText}>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
} 