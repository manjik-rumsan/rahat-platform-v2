
export interface WalletStorage {
    init(walletId: string): Promise<void>;
    getKeys(): Promise<WalletKeys | null>;
    saveKeys(keys: WalletKeys): Promise<void>;
    deleteWallet(): Promise<void>;
}


// Is Mnemonic Required?
export interface WalletKeys {
    privateKey: string;
    publicKey: string;
    address: string;
    blockchain: string; // EVM, STELLAR, etc.
    mnemonic?: string; // Optional - Only if you want to support exports to external wallets and recovery

}
