import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import styles from './Layout.module.css';

export function Layout() {
    return (
        <div className={styles.layout}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <Header />
                </div>
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
