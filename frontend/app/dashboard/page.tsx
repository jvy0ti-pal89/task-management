'use client';

import { useRouter } from 'next/navigation';
import { TaskManager } from '@/components/TaskManager';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/lib/useToast';
import { authService } from '@/lib/auth';
import styles from './page.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { toasts, show } = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
      show('Logged out successfully', 'success');
      router.push('/login');
    } catch (error) {
      show('Logout failed', 'error');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>My Tasks</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>
      <main>
        <TaskManager />
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
