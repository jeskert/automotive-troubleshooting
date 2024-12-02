// components/layout/TabLayout.tsx
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styles from '@/styles/features/TabLayout.module.css';

interface TabLayoutProps {
    children: React.ReactElement<{ label: string }>[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    onCloseTab?: (tabLabel: string) => void; // 新增关闭 Tab 的回调函数
}

const TabLayout: React.FC<TabLayoutProps> = ({ children, activeTab, onTabChange, onCloseTab }) => {
    const tabs = React.Children.toArray(children) as React.ReactElement<{ label: string }>[];

    // 处理 Tab 关闭事件
    const handleTabClose = (label: string) => {
        if (onCloseTab) {
            onCloseTab(label);
        }
    };

    // 找到当前激活的 Tab 的索引
    const activeTabIndex = activeTab ? tabs.findIndex(child => child.props.label === activeTab) : 0;

    return (
        <Tabs selectedIndex={activeTabIndex} onSelect={(index) => onTabChange?.(tabs[index].props.label)}>
            <TabList className={styles.tabList}>
                {tabs.map((child, index) => (
                    <div key={index} className={styles.tabItem}>
                        <Tab>{child.props.label}</Tab>
                        <button onClick={() => handleTabClose(child.props.label)} className={styles.closeButton}>X</button>
                    </div>
                ))}
            </TabList>
            {tabs.map((child, index) => (
                <TabPanel key={index}>{child}</TabPanel>
            ))}
        </Tabs>
    );
};

export default TabLayout;
