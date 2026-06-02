import { getStorage } from './storage';

export interface SyncStatus {
  lastSyncTime: string;
  status: 'idle' | 'syncing' | 'completed' | 'failed';
}

const STORAGE_KEY = 'background-sync-status';

export const backgroundTasksService = {
  getSyncStatus(): SyncStatus {
    const storage = getStorage();
    if (!storage) {
      return { lastSyncTime: 'Never', status: 'idle' };
    }
    const data = storage.getString(STORAGE_KEY);
    if (!data) {
      return { lastSyncTime: 'Never', status: 'idle' };
    }
    try {
      return JSON.parse(data) as SyncStatus;
    } catch {
      return { lastSyncTime: 'Never', status: 'idle' };
    }
  },

  updateSyncStatus(status: SyncStatus): void {
    const storage = getStorage();
    if (!storage) {
      return;
    }
    storage.set(STORAGE_KEY, JSON.stringify(status));
  },

  async executeBackgroundSync(): Promise<boolean> {
    console.log('[BackgroundSync] Triggered telemetry and state sync sequence...');
    
    this.updateSyncStatus({
      lastSyncTime: new Date().toISOString(),
      status: 'syncing',
    });

    try {
      // Simulate network request/sync lag
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
      
      console.log('[BackgroundSync] Sync task completed successfully!');
      this.updateSyncStatus({
        lastSyncTime: new Date().toLocaleTimeString(),
        status: 'completed',
      });
      return true;
    } catch (error) {
      console.error('[BackgroundSync] Sync task failed:', error);
      this.updateSyncStatus({
        lastSyncTime: new Date().toLocaleTimeString(),
        status: 'failed',
      });
      return false;
    }
  },
};
