import { WalletKeys, WalletStorage } from '@workspace/wallet';
import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

export class WalletStorageSQLite implements WalletStorage {
    private db!: Database<sqlite3.Database, sqlite3.Statement>;

    constructor(private dbPath: string = 'wallets.db') { }

    async init(): Promise<void> {
        this.db = await open({
            filename: this.dbPath,
            driver: sqlite3.Database
        });

        await this.db.run(`
            CREATE TABLE IF NOT EXISTS wallets (
                address TEXT PRIMARY KEY,
                privateKey TEXT NOT NULL,
                publicKey TEXT NOT NULL,
                blockchain TEXT NOT NULL,
                mnemonic TEXT
            )
        `);
    }

    async saveKey(key: WalletKeys): Promise<void> {
        await this.db.run(
            `INSERT INTO wallets (address, privateKey, publicKey, blockchain, mnemonic) 
             VALUES (?, ?, ?, ?, ?) 
             ON CONFLICT(address) DO UPDATE SET 
                privateKey = excluded.privateKey, 
                publicKey = excluded.publicKey, 
                blockchain = excluded.blockchain, 
                mnemonic = excluded.mnemonic`,
            [key.address, key.privateKey, key.publicKey, key.blockchain, key.mnemonic]
        );
    }

    async getKey(address: string): Promise<WalletKeys | null> {
        const row = await this.db.get(`SELECT * FROM wallets WHERE address = ?`, [address]);
        return row ? (row as WalletKeys) : null;
    }

    async deleteWallet(address: string): Promise<void> {
        await this.db.run(`DELETE FROM wallets WHERE address = ?`, [address]);
    }
}
