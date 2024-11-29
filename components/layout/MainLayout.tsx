'use client'

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import styles from '@/styles/layout/MainLayout.module.css'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
} 