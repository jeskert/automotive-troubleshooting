'use client'

import styles from '@/styles/layout/Sidebar.module.css'
import {LayoutDashboard, LogOut, Menu, Settings, Book} from 'lucide-react' // 添加 Book 图标
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useAuthenticator} from "@aws-amplify/ui-react";

interface SidebarProps {
    onCollapseChange?: (collapsed: boolean) => void
}

export default function Sidebar({onCollapseChange}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        {icon: LayoutDashboard, label: '工单管理', href: '/'},
        {icon: Book, label: '知识库管理', href: '/knowledge-base'}, // 新增的知识库管理项
    ]

    const { user, signOut } = useAuthenticator((context) => [context.user]);

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
                    <Menu size={20}/>
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
                                <item.icon
                                    className={`${styles.navIcon} ${isCollapsed ? styles.navIconCollapsed : ''}`}/>
                                {!isCollapsed && <span className={styles.navText}>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info */}
                <div className={styles.userInfo} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <img
                        src={'/images/img.png'}
                        alt="User Avatar"
                        className={styles.userAvatar}
                    />
                    {!isCollapsed && <span className={styles.userName}>{user.signInDetails?.loginId}</span>}
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            <Link href="/profile" className={styles.dropdownItem}>
                                <Settings className={styles.dropdownIcon}/>
                                <span>个人中心</span>
                            </Link>
                            <button className={styles.dropdownItem} onClick={signOut}>
                                <LogOut className={styles.dropdownIcon}/>
                                <span>退出</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}
