import { createMMKV } from 'react-native-mmkv';

let mmkvInstance: ReturnType<typeof createMMKV> | null = null;

export function getStorage() {
  if (mmkvInstance === null) {
    try {
      mmkvInstance = createMMKV({
        id: 'app-global-storage',
      });
    } catch (e) {
      console.error('MMKV initialization failed:', e);
    }
  }
  return mmkvInstance;
}

