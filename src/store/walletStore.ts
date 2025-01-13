import { create } from 'zustand'

interface WalletState {
  activeWallet: string | null
  isConnected: boolean
  address: string | null
  balance: string | null
  setActiveWallet: (wallet: string) => void
  setConnectionStatus: (status: boolean) => void
  setAddress: (address: string | null) => void
  setBalance: (balance: string | null) => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  activeWallet: null,
  isConnected: false,
  address: null,
  balance: null,
  
  setActiveWallet: (wallet) => set({ activeWallet: wallet }),
  setConnectionStatus: (status) => set({ isConnected: status }),
  setAddress: (address) => set({ address }),
  setBalance: (balance) => set({ balance }),
  disconnect: () => set({
    isConnected: false,
    address: null,
    balance: null,
    activeWallet: null,
  }),
})) 