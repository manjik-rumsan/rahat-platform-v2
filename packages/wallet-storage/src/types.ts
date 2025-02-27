
export interface WalletStorage {
    init(): Promise<void>; //initialize the storage connection
    saveKey(key: WalletKeys): Promise<void>;
    getKey(address: string): Promise<WalletKeys | null>;
    deleteWallet?(address: string): Promise<void>; // rethink?
}


// Is Mnemonic Required?
export interface WalletKeys {
    privateKey: string;
    publicKey: string;
    address: string;
    blockchain: string; // EVM, STELLAR, etc.
    mnemonic?: string; // Optional - Only if you want to support exports to external wallets and recovery

}
