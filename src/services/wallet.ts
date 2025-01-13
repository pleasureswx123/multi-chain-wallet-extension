import { Window as KeplrWindow } from "@keplr-wallet/types";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { StargateClient, SigningStargateClient } from "@cosmjs/stargate";
import { GasPrice, calculateFee } from "@cosmjs/stargate";
import { coins } from "@cosmjs/proto-signing";
import { showNotification } from "../utils/notification";

declare global {
  interface Window extends KeplrWindow {
    ethereum?: MetaMaskInpageProvider;
  }
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}

interface EtherscanTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
}

const COSMOS_RPC = import.meta.env.VITE_COSMOS_RPC || "https://rpc.cosmoshub.strange.love";
const COSMOS_GAS_PRICE = import.meta.env.VITE_COSMOS_GAS_PRICE || "0.025uatom";
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || "YOUR_ETHERSCAN_API_KEY";

export class WalletService {
  static async connectKeplr() {
    if (!window.keplr) {
      showNotification("请先安装 Keplr 钱包浏览器扩展。您可以访问 https://www.keplr.app 下载安装。", {
        title: "连接失败",
        type: "error"
      });
      throw new Error("Keplr not installed");
    }
    
    try {
      await window.keplr.enable(["cosmoshub-4"]);
      const offlineSigner = window.keplr.getOfflineSigner("cosmoshub-4");
      const accounts = await offlineSigner.getAccounts();
      
      if (!accounts || accounts.length === 0) {
        showNotification("未找到 Keplr 钱包账户", {
          title: "连接失败",
          type: "error"
        });
        throw new Error("No accounts found");
      }
      
      showNotification("Keplr 钱包连接成功", {
        title: "连接成功",
        type: "success"
      });
      return accounts[0].address;
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      showNotification(`连接 Keplr 钱包失败: ${message}`, {
        title: "连接失败",
        type: "error"
      });
      throw error;
    }
  }

  static async connectMetamask(): Promise<string> {
    if (!window.ethereum) {
      showNotification("请先安装 MetaMask 钱包浏览器扩展", {
        title: "连接失败",
        type: "error"
      });
      throw new Error("MetaMask not installed");
    }

    try {
      const accounts = await window.ethereum.request<string[]>({
        method: "eth_requestAccounts",
      });
      
      if (!accounts || accounts.length === 0) {
        showNotification("未找到 MetaMask 钱包账户", {
          title: "连接失败",
          type: "error"
        });
        throw new Error("No accounts found");
      }
      
      const address = accounts[0];
      if (!address) {
        showNotification("未能获取钱包地址", {
          title: "连接失败",
          type: "error"
        });
        throw new Error("No address found");
      }
      
      showNotification("MetaMask 钱包连接成功", {
        title: "连接成功",
        type: "success"
      });
      return address;
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      showNotification(`连接 MetaMask 失败: ${message}`, {
        title: "连接失败",
        type: "error"
      });
      throw error;
    }
  }

  static async getKeplrBalance(address: string): Promise<string> {
    if (!window.keplr) {
      throw new Error("请先安装 Keplr 钱包浏览器扩展。您可以访问 https://www.keplr.app 下载安装。");
    }

    try {
      const client = await StargateClient.connect(COSMOS_RPC);
      const balance = await client.getAllBalances(address);
      
      const atomBalance = balance.find(coin => coin.denom === "uatom");
      return atomBalance ? (Number(atomBalance.amount) / 1000000).toString() : "0";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`获取 Keplr 钱包余额失败: ${error.message}`);
      }
      throw new Error("获取 Keplr 钱包余额时发生未知错误");
    }
  }

  static async getMetamaskBalance(address: string): Promise<string> {
    if (!window.ethereum) {
      throw new Error("请先安装 MetaMask 钱包浏览器扩展");
    }

    try {
      const balance = await window.ethereum.request<string>({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      
      if (!balance) return "0";
      
      // Convert from Wei to ETH
      const ethBalance = parseInt(balance, 16) / 1e18;
      return ethBalance.toFixed(4);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`获取 MetaMask 钱包余额失败: ${error.message}`);
      }
      throw new Error("获取 MetaMask 钱包余额时发生未知错误");
    }
  }

  static async sendCosmos(from: string, to: string, amount: string): Promise<string> {
    if (!window.keplr) {
      throw new Error("Keplr wallet not found");
    }

    const chainId = "cosmoshub-4";
    await window.keplr.enable(chainId);
    
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    const client = await SigningStargateClient.connectWithSigner(
      COSMOS_RPC,
      offlineSigner,
      { gasPrice: GasPrice.fromString(COSMOS_GAS_PRICE) }
    );

    // Convert ATOM to uATOM (1 ATOM = 1,000,000 uATOM)
    const uatomAmount = Math.floor(parseFloat(amount) * 1000000);
    
    // Calculate gas fee
    const fee = calculateFee(100000, COSMOS_GAS_PRICE);

    // Send transaction
    const result = await client.sendTokens(
      from,
      to,
      coins(uatomAmount.toString(), "uatom"),
      fee,
      "Transfer via Wallet Extension"
    );

    return result.transactionHash;
  }

  static async getTransactionHistory(address: string, wallet: string): Promise<Transaction[]> {
    if (wallet === 'keplr') {
      // 实现 Cosmos 交易历史查询
      return [];
    } else if (wallet === 'metamask') {
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "1" && Array.isArray(data.result)) {
        return data.result.slice(0, 10).map((tx: EtherscanTransaction) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          amount: (Number(tx.value) / 1e18).toFixed(4),
          timestamp: Number(tx.timeStamp) * 1000,
        }));
      }
      
      return [];
    }
    
    return [];
  }
} 