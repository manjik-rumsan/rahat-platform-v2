import { ethers } from "ethers";
import { BASE_FEE, Keypair, Networks, TransactionBuilder } from 'stellar-sdk';
import { IWallet, WalletKeys, WalletStorage } from "../types.js";


class StellarWallet implements IWallet {
    blockchainType = "STELLAR";
    rpcUrl: string;
    storage: WalletStorage
    currentWalletKeys?: WalletKeys

    constructor(rpcUrl: string, storage: WalletStorage) {
        this.rpcUrl = rpcUrl
        this.storage = storage
    }

    async init() {
        await this.storage.init();
    }
    currentWallet() {
        return this.currentWalletKeys?.address || 'wallet not initialized';
    }
    async getWalletKeys(): Promise<WalletKeys> {
        if (!this.currentWalletKeys) {
            throw new Error("No current wallet to export");
        }
        return this.currentWalletKeys;
    }
    async connect(walletAddess: string): Promise<this> {
        const keys = await this.storage.getKey(walletAddess);
        if (!keys) throw new Error('Wallet not found')
        this.currentWalletKeys = keys;
        return this;
    }

    async createWallet(): Promise<WalletKeys> {
        const mnemonic = ethers.Mnemonic.fromEntropy(ethers.randomBytes(16));
        const hdPath = "m/44'/148'/0'/0/0";
        const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, hdPath);
        const walletKeys = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            mnemonic: wallet.mnemonic?.phrase,
            blockchain: this.blockchainType
        }
        await this.storage.saveKey(walletKeys)
        return walletKeys;
    }

    async importWallet(privateKey: string): Promise<WalletKeys> {
        const keypair = Keypair.fromSecret(privateKey)
        const walletKeys = {
            address: keypair.publicKey(),
            privateKey: keypair.secret(),
            blockchain: this.blockchainType
        }
        return walletKeys;
    }

    async signMessage(message: string): Promise<string> {
        if (!this.currentWalletKeys) {
            throw new Error("No current account set for signing");
        }
        const keypair = Keypair.fromSecret(this.currentWalletKeys.privateKey)
        const messageBuffer = Buffer.from(message, "utf8");
        const signature = keypair.sign(messageBuffer);
        return signature.toString("base64")
    }


    //TODO: Desine transaction type
    async signTransaction(transactionData: any): Promise<any> {

        if (!this.currentWalletKeys) {
            throw new Error("No current account set for signing");
        }
        const keypair = Keypair.fromSecret(this.currentWalletKeys.privateKey);
        const transaction = new TransactionBuilder(transactionData, {
            fee: BASE_FEE,
            networkPassphrase: Networks.PUBLIC // or Networks.TESTNET for testnet
        })
            .setTimeout(30)
            .build();

        return transaction.sign(keypair);
    }


    //TDOD: implement Send transactions
    async sendTransaction(transactionData: any): Promise<any> {

        if (!this.currentWalletKeys) {
            throw new Error("No current account set for signing");
        }
        const keypair = Keypair.fromSecret(this.currentWalletKeys.privateKey);
        const transaction = new TransactionBuilder(transactionData, {
            fee: BASE_FEE,
            networkPassphrase: Networks.PUBLIC // or Networks.TESTNET for testnet
        })
            .setTimeout(30)
            .build();

        return transaction.sign(keypair);

    }







}