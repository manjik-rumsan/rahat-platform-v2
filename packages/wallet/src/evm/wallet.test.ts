import { WalletStorage } from '../types.js';
import EVMWallet from './wallet.js';

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

// Mock provider
jest.mock('ethers', () => {
    const originalModule = jest.requireActual('ethers');
    return {
        ...originalModule,
        JsonRpcProvider: jest.fn().mockImplementation(() => ({
            getNetwork: jest.fn().mockResolvedValue({ chainId: BigInt(1) }),
            getFeeData: jest.fn().mockResolvedValue({
                maxFeePerGas: BigInt(1000000000),
                maxPriorityFeePerGas: BigInt(1000000000)
            }),
            estimateGas: jest.fn().mockResolvedValue(BigInt(21000)),
            sendTransaction: jest.fn().mockResolvedValue({ hash: '0x123' })
        }))
    };
});

describe('EVMWallet', () => {
    let wallet: EVMWallet;
    let storage: MockStorage;
    const TEST_RPC_URL = 'https://ethereum.publicnode.com';

    beforeEach(() => {
        storage = new MockStorage();
        wallet = new EVMWallet(TEST_RPC_URL, storage);
    });

    describe('init', () => {
        it('should initialize wallet and set chainId', async () => {
            await wallet.init();
            expect(wallet.chainId).toBe(BigInt(1));
        });
    });

    describe('createWallet', () => {
        it('should create a new wallet with correct properties', async () => {
            const walletKeys = await wallet.createWallet();

            expect(walletKeys).toHaveProperty('address');
            expect(walletKeys).toHaveProperty('privateKey');
            expect(walletKeys).toHaveProperty('publicKey');
            expect(walletKeys).toHaveProperty('mnemonic');
            expect(walletKeys.blockchain).toBe('EVM');

            // Verify wallet was saved to storage
            const savedWallet = await storage.getKey(walletKeys.address);
            expect(savedWallet).toEqual(walletKeys);
        });
    });

    describe('importWallet', () => {
        it('should import wallet from private key', async () => {
            const testPrivateKey = '0x1234567890123456789012345678901234567890123456789012345678901234';
            const walletKeys = await wallet.importWallet(testPrivateKey);

            expect(walletKeys).toHaveProperty('address');
            expect(walletKeys).toHaveProperty('privateKey');
            expect(walletKeys).toHaveProperty('publicKey');
            expect(walletKeys.blockchain).toBe('EVM');

            // Verify wallet was saved to storage
            const savedWallet = await storage.getKey(walletKeys.address);
            expect(savedWallet).toEqual(walletKeys);
        });

        it('should throw error for invalid private key', async () => {
            await expect(wallet.importWallet('invalid-key')).rejects.toThrow();
        });
    });

    describe('connect', () => {
        it('should connect to existing wallet', async () => {
            const walletKeys = await wallet.createWallet();
            const connectedWallet = await wallet.connect(walletKeys.address);

            expect(connectedWallet.currentWalletKeys).toEqual(walletKeys);
            expect(connectedWallet).toBe(wallet); // Should return this
        });

        it('should throw error for non-existent wallet', async () => {
            await expect(wallet.connect('0x1234')).rejects.toThrow('Wallet not found');
        });
    });

    describe('signMessage', () => {
        it('should throw error if no wallet is connected', async () => {
            await expect(wallet.signMessage('test')).rejects.toThrow('No current account set for signing');
        });

        it('should sign a message when wallet is connected', async () => {
            const walletKeys = await wallet.createWallet();
            await wallet.connect(walletKeys.address);

            const message = 'Hello, World!';
            const signature = await wallet.signMessage(message);

            expect(typeof signature).toBe('string');
            expect(signature.startsWith('0x')).toBe(true);
        });
    });

    describe('signTransaction', () => {
        it('should throw error if no wallet is connected', async () => {
            await expect(wallet.signTransaction({})).rejects.toThrow('No current account or provider set for signing transaction');
        });

        it('should throw error if provider is not initialized', async () => {
            const walletKeys = await wallet.createWallet();
            await wallet.connect(walletKeys.address);
            wallet.provider = undefined;

            await expect(wallet.signTransaction({})).rejects.toThrow('No current account or provider set for signing transaction');
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

    describe('writeContract', () => {
        it('should throw error if provider is not initialized', async () => {
            wallet.provider = undefined;
            await expect(wallet.writeContract({
                txnParams: {
                    abi: [],
                    contractAddress: '0x1234567890123456789012345678901234567890',
                    functionName: 'test',
                    args: []
                },
                privateKey: '0x1234567890123456789012345678901234567890123456789012345678901234'
            })).rejects.toThrow('Provider is not initialized');
        });
    });
}); 