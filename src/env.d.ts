/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ETHERSCAN_API_KEY: string
  readonly VITE_COSMOS_RPC: string
  readonly VITE_COSMOS_GAS_PRICE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 