import { Keypair } from 'stellar-sdk';
import { WalletStorage } from '../types.js';
import { StellarWallet } from './wallet.js';

// Mock WalletStorage
class MockStorage implements WalletStorage {
    private store: { [key: string]: any } = {};

    async init() { }

    async saveKey(key: any) {
        this.store[key.address] = key;
    }

    async getKey(address: string) {
        return this.store[address] || null;
    }
}

describe('StellarWallet', () => {
    let wallet: StellarWallet;
    let storage: MockStorage;

    beforeEach(() => {
        storage = new MockStorage();
        wallet = new StellarWallet('https://horizon-testnet.stellar.org', storage);
    });

    describe('createWallet', () => {
        it('should create a new wallet with correct properties', async () => {
            const walletKeys = await wallet.createWallet();

            expect(walletKeys).toHaveProperty('address');
            expect(walletKeys).toHaveProperty('privateKey');
            expect(walletKeys).toHaveProperty('publicKey');
            expect(walletKeys).toHaveProperty('mnemonic');
            expect(walletKeys.blockchain).toBe('STELLAR');
        });
    });

    describe('importWallet', () => {
        it('should import wallet from private key', async () => {
            const keypair = Keypair.random();
            const privateKey = keypair.secret();
            const publicKey = keypair.publicKey();

            const walletKeys = await wallet.importWallet(privateKey);

            expect(walletKeys.address).toBe(publicKey);
            expect(walletKeys.privateKey).toBe(privateKey);
            expect(walletKeys.blockchain).toBe('STELLAR');
        });

        it('should throw error for invalid private key', async () => {
            await expect(wallet.importWallet('invalid-key')).rejects.toThrow();
        });
    });

    describe('connect', () => {
        it('should connect to existing wallet', async () => {
            const walletKeys = await wallet.createWallet();
            await wallet.connect(walletKeys.address);

            expect(wallet.currentWalletKeys).toEqual(walletKeys);
        });

        it('should throw error for non-existent wallet', async () => {
            await expect(wallet.connect('non-existent-address')).rejects.toThrow('Wallet not found');
        });
    });

    describe('getWalletKeys', () => {
        it('should return current wallet keys', async () => {
            const walletKeys = await wallet.createWallet();
            await wallet.connect(walletKeys.address);

            const keys = await wallet.getWalletKeys();
            expect(keys).toEqual(walletKeys);
        });

        it('should throw error if no wallet is connected', async () => {
            await expect(wallet.getWalletKeys()).rejects.toThrow('No current wallet to export');
        });
    });
}); 