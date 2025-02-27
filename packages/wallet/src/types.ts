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
    createWallet(chain: BlockchainType): Promise<WalletKeys>;
    importWallet(privateKey: string): Promise<WalletKeys>; // require mnemonic?
    signMessage(message: string): Promise<string>;
    signTransaction(transactionData: any): Promise<any>;
    sendTransaction(rawTransaction: any): Promise<any>;
    exportWallet(): Promise<WalletKeys>;
}
