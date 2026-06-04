import { SecureStorageService } from '../libs/shared/src/services/secureStorage';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => {
  const store: Record<string, string> = {};
  return {
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    getItemAsync: jest.fn(async (key: string) => {
      return store[key] || null;
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      delete store[key];
    }),
  };
});

describe('SecureStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully store and retrieve items', async () => {
    await SecureStorageService.setItem('authToken', 'test-token-123');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('authToken', 'test-token-123');

    const value = await SecureStorageService.getItem('authToken');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('authToken');
    expect(value).toBe('test-token-123');
  });

  it('should return null when getting an item that does not exist', async () => {
    const value = await SecureStorageService.getItem('nonExistentKey');
    expect(value).toBeNull();
  });

  it('should successfully check item existence with hasItem', async () => {
    const hasBefore = await SecureStorageService.hasItem('sessionKey');
    expect(hasBefore).toBe(false);

    await SecureStorageService.setItem('sessionKey', 'active');
    const hasAfter = await SecureStorageService.hasItem('sessionKey');
    expect(hasAfter).toBe(true);
  });

  it('should successfully delete stored items', async () => {
    await SecureStorageService.setItem('tempKey', 'tempValue');
    await SecureStorageService.removeItem('tempKey');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('tempKey');

    const value = await SecureStorageService.getItem('tempKey');
    expect(value).toBeNull();
  });
});
