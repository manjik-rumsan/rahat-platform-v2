import { ethers } from "ethers";
import { IWallet, WalletKeys, WalletStorage } from "../types.js";
import { EVM_CreateTransactionWithPk } from "./types.js";
import { getEVMTransaction } from "./utils.js";

class EVMWallet implements IWallet {
    blockchainType = "EVM";
    rpcUrl: string;
    storage: WalletStorage
    currentWalletKeys?: WalletKeys
    provider?: ethers.Provider;
    chainId?: bigint;

    constructor(rpcUrl: string, storage: WalletStorage) {
        this.rpcUrl = rpcUrl
        this.storage = storage
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }
    currentWallet() {
        return this.currentWalletKeys?.address || 'wallet not initialized';
    }

    async init() {
        await this.storage.init();
        const network = await this.provider?.getNetwork()
        if (!network) throw new Error("Couldn't get ChainId");
        this.chainId = network.chainId;
    }

    async connect(walletAddess: string): Promise<this> {
        const keys = await this.storage.getKey(walletAddess);
        if (!keys) throw new Error('Wallet not found')
        this.currentWalletKeys = keys;
        return this;
    }

    async createWallet(): Promise<WalletKeys> {
        const wallet = ethers.Wallet.createRandom();
        const walletKeys = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            mnemonic: wallet.mnemonic?.phrase,
            blockchain: this.blockchainType
        }
        await this.storage.saveKey(walletKeys)
        return walletKeys
    }

    async importWallet(privateKey: string): Promise<WalletKeys> {
        const wallet = new ethers.Wallet(privateKey);
        const walletKeys = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.signingKey.compressedPublicKey,
            blockchain: this.blockchainType
        }
        await this.storage.saveKey(walletKeys)
        return walletKeys
    }


    async signMessage(message: string): Promise<string> {
        if (!this.currentWalletKeys) {
            throw new Error("No current account set for signing");
        }
        const wallet = new ethers.Wallet(this.currentWalletKeys.privateKey);
        return wallet.signMessage(message);
    }

    //TODO define transaction type
    async signTransaction(transactionData: any): Promise<any> {
        if (!this.currentWalletKeys || !this.provider) {
            throw new Error("No current account or provider set for signing transaction");
        }
        const wallet = new ethers.Wallet(this.currentWalletKeys.privateKey, this.provider);
        return wallet.signTransaction(transactionData);
    }

    async sendTransaction(rawTransaction: any): Promise<any> {
        if (!this.provider) {
            throw new Error("Provider is not initialized");
        }
        const signedTransaction = await this.signTransaction(rawTransaction);
        if (!this.provider.sendTransaction) {
            throw new Error("Provider's sendTransaction method is not available");
        }
        return await this.provider.sendTransaction(signedTransaction);
    }

    async getWalletKeys(): Promise<WalletKeys> {
        if (!this.currentWalletKeys) {
            throw new Error("No current wallet to export");
        }
        return this.currentWalletKeys;
    }

    //TODO : cleanup this 
    async writeContract(transactionParams: EVM_CreateTransactionWithPk) {
        if (!this.provider) {
            throw new Error("Provider is not initialized");
        }
        const txn = await getEVMTransaction({
            ...transactionParams.txnParams,
            networkProvider: this.rpcUrl,
        });

        const signedTxn = await this.signTransaction(txn)

        this.sendTransaction(signedTxn);
    }


}

export default EVMWallet;