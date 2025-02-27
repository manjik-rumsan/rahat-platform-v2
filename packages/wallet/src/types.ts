import { WalletKeys, WalletStorage } from "@workspace/wallet-storage";

export enum BlockchainType {
    EVM = "evm",
    STELLAR = "stellar",
}

export interface WalletConfig {
    blockchain: BlockchainType;
    storage: WalletStorage;
    encryptionKey?: Uint8Array; // Optional for encryption
}


export interface IWallet {
    init(): Promise<void>;
    createWallet(): Promise<WalletKeys>;
    importWallet(privateKey: string): Promise<WalletKeys>;
    signMessage(message: string): Promise<string>;
    signTransaction(transactionData: any): Promise<string>;
    exportWallet(): Promise<WalletKeys>;
}
