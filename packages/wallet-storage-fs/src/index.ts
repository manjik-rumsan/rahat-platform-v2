import { WalletKeys, WalletStorage } from '@workspace/wallet';
import fs from 'fs/promises';
import path from 'path';

export class WalletStorageFS implements WalletStorage {
    private initialized = false;
    private wallets: { [address: string]: WalletKeys } = {};

    constructor(private storagePath: string = 'wallets.json') {
        // Ensure path is absolute
        if (!path.isAbsolute(storagePath)) {
            this.storagePath = path.join(process.cwd(), storagePath);
        }
    }

    async init(): Promise<void> {
        try {
            // Create directory if it doesn't exist
            await fs.mkdir(path.dirname(this.storagePath), { recursive: true });

            // Try to read existing file
            try {
                const data = await fs.readFile(this.storagePath, 'utf-8');
                this.wallets = JSON.parse(data);
            } catch (error: any) {
                if (error.code === 'ENOENT') {
                    // File doesn't exist, create empty one
                    await fs.writeFile(this.storagePath, JSON.stringify({}));
                } else {
                    throw error;
                }
            }

            this.initialized = true;
        } catch (error) {
            throw new Error(`Failed to initialize wallet storage: ${error}`);
        }
    }

    private async ensureInitialized() {
        if (!this.initialized) {
            throw new Error('WalletStorage not initialized. Call init() first.');
        }
    }

    private async saveToFile(): Promise<void> {
        await fs.writeFile(this.storagePath, JSON.stringify(this.wallets, null, 2));
    }

    async saveKey(key: WalletKeys): Promise<void> {
        await this.ensureInitialized();
        this.wallets[key.address] = key;
        await this.saveToFile();
    }

    async getKey(address: string): Promise<WalletKeys | null> {
        await this.ensureInitialized();
        return this.wallets[address] || null;
    }

    async deleteWallet(address: string): Promise<void> {
        await this.ensureInitialized();
        delete this.wallets[address];
        await this.saveToFile();
    }
}
