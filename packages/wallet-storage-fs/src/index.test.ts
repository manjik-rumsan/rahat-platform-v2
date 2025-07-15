import { WalletKeys } from '@workspace/wallet';
import fs from 'fs/promises';
import path from 'path';
import { WalletStorageFS } from './index.js';

describe('WalletStorageFS', () => {
    const testPath = path.join(process.cwd(), 'test-wallets.json');
    let storage: WalletStorageFS;

    beforeEach(async () => {
        storage = new WalletStorageFS(testPath);
        await storage.init();
    });

    afterEach(async () => {
        try {
            await fs.unlink(testPath);
        } catch (error) {
            // Ignore if file doesn't exist
        }
    });

    const mockWalletKeys: WalletKeys = {
        address: '0x123',
        privateKey: '0xabc',
        publicKey: '0xdef',
        blockchain: 'EVM',
        mnemonic: 'test test test'
    };

    describe('init', () => {
        it('should create storage file if it does not exist', async () => {
            const exists = await fs.access(testPath)
                .then(() => true)
                .catch(() => false);
            expect(exists).toBe(true);
        });
    });

    describe('saveKey', () => {
        it('should save wallet keys', async () => {
            await storage.saveKey(mockWalletKeys);
            const saved = await storage.getKey(mockWalletKeys.address);
            expect(saved).toEqual(mockWalletKeys);
        });

        it('should update existing wallet keys', async () => {
            await storage.saveKey(mockWalletKeys);
            const updatedKeys = { ...mockWalletKeys, privateKey: '0xnew' };
            await storage.saveKey(updatedKeys);
            const saved = await storage.getKey(mockWalletKeys.address);
            expect(saved).toEqual(updatedKeys);
        });

        it('should throw error if not initialized', async () => {
            storage = new WalletStorageFS(testPath);
            await expect(storage.saveKey(mockWalletKeys)).rejects.toThrow('not initialized');
        });
    });

    describe('getKey', () => {
        it('should return null for non-existent wallet', async () => {
            const result = await storage.getKey('non-existent');
            expect(result).toBeNull();
        });

        it('should return wallet keys for existing wallet', async () => {
            await storage.saveKey(mockWalletKeys);
            const result = await storage.getKey(mockWalletKeys.address);
            expect(result).toEqual(mockWalletKeys);
        });

        it('should throw error if not initialized', async () => {
            storage = new WalletStorageFS(testPath);
            await expect(storage.getKey('test')).rejects.toThrow('not initialized');
        });
    });

    describe('deleteWallet', () => {
        it('should delete existing wallet', async () => {
            await storage.saveKey(mockWalletKeys);
            await storage.deleteWallet(mockWalletKeys.address);
            const result = await storage.getKey(mockWalletKeys.address);
            expect(result).toBeNull();
        });

        it('should not throw error when deleting non-existent wallet', async () => {
            await expect(storage.deleteWallet('non-existent')).resolves.not.toThrow();
        });

        it('should throw error if not initialized', async () => {
            storage = new WalletStorageFS(testPath);
            await expect(storage.deleteWallet('test')).rejects.toThrow('not initialized');
        });
    });
}); 