'use client'

import styles from '@/styles/layout/Sidebar.module.css'
import {
    ClipboardList,
    FileText,
    LayoutDashboard,
    Menu,
    UserCircle2,
    LogOut,
    Settings
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void
}

export default function Sidebar({ onCollapseChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: '工单管理', href: '/' },
    ]

    const user = {
        name: '张三',
        avatar: '/images/img.png'
    }

    useEffect(() => {
        if (onCollapseChange) {
            onCollapseChange(isCollapsed)
        }
    }, [isCollapsed, onCollapseChange])

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
                        src="/images/img.png"
                        alt="Logo"
                        className={styles.logoImage}
                    />
                    {!isCollapsed && <span className={styles.logoText}></span>}
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
                                <item.icon className={`${styles.navIcon} ${isCollapsed ? styles.navIconCollapsed : ''}`} />
                                {!isCollapsed && <span className={styles.navText}>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info */}
                <div className={styles.userInfo} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className={styles.userAvatar}
                    />
                    {!isCollapsed && <span className={styles.userName}>{user.name}</span>}
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            <Link href="/profile" className={styles.dropdownItem}>
                                <Settings className={styles.dropdownIcon} />
                                <span>个人中心</span>
                            </Link>
                            <button className={styles.dropdownItem} onClick={() => console.log('Logout')}>
                                <LogOut className={styles.dropdownIcon} />
                                <span>退出</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}
