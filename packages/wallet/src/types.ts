
// export enum BlockchainType {
//     EVM = "evm",
//     STELLAR = "stellar",
// }

export interface WalletConfig {
    rpcUrl: string;
    storage: WalletStorage;
    encryptionKey?: Uint8Array; // Optional for encryption
}


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
    blockchain: string;
    mnemonic?: string; // Optional - Only if you want to support exports to external wallets and recovery
}

export interface IWallet {
    init(): Promise<void>;
    createWallet(): Promise<WalletKeys>;
    importWallet(privateKey: string): Promise<WalletKeys>; // require mnemonic?
    signMessage(message: string): Promise<string>;
    signTransaction(transactionData: any): Promise<any>;
    sendTransaction(rawTransaction: any): Promise<any>;
    getWalletKeys(): Promise<WalletKeys>;
}
