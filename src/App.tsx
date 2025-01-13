import { useEffect, useState } from 'react'
import { useWalletStore } from './store/walletStore'
import { WalletService } from './services/wallet'
import { TransactionHistory } from './components/TransactionHistory'
import { Transfer } from './components/Transfer'
import { AnimatedButton } from './components/AnimatedButton'
import { HelpGuide } from './components/HelpGuide'
import './App.css'
import { NotificationProvider } from './components/Notification'

function App() {
  const { 
    activeWallet,
    isConnected,
    address,
    balance,
    setActiveWallet,
    setConnectionStatus,
    setAddress,
    setBalance,
    disconnect
  } = useWalletStore()

  const [activeTab, setActiveTab] = useState<'transfer' | 'history'>('transfer')

  const connectWallet = async (walletType: string) => {
    try {
      let walletAddress = ''
      
      if (walletType === 'keplr') {
        walletAddress = await WalletService.connectKeplr()
        const balance = await WalletService.getKeplrBalance(walletAddress)
        setBalance(balance)
      } else if (walletType === 'metamask') {
        walletAddress = await WalletService.connectMetamask()
        const balance = await WalletService.getMetamaskBalance(walletAddress)
        setBalance(balance)
      }

      setActiveWallet(walletType)
      setConnectionStatus(true)
      setAddress(walletAddress)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const refreshBalance = async () => {
    if (!address || !activeWallet) return
    
    try {
      const newBalance = activeWallet === 'keplr'
        ? await WalletService.getKeplrBalance(address)
        : await WalletService.getMetamaskBalance(address)
      setBalance(newBalance)
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    }
  }

  useEffect(() => {
    if (activeWallet && !isConnected) {
      connectWallet(activeWallet)
    }
  }, [activeWallet, isConnected])

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-background text-white p-4">
        <div className="max-w-md mx-auto bg-surface rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">多链钱包</h1>
            <HelpGuide />
          </div>
          
          {!isConnected ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-400 mb-4">
                请选择要连接的钱包：
              </div>
              <AnimatedButton
                variant="primary"
                onClick={() => connectWallet('keplr')}
              >
                连接 Keplr 钱包
              </AnimatedButton>
              <AnimatedButton
                variant="secondary"
                onClick={() => connectWallet('metamask')}
              >
                连接 MetaMask 钱包
              </AnimatedButton>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">当前钱包</p>
                  <p className="font-medium">{activeWallet === 'keplr' ? 'Keplr' : 'MetaMask'}</p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">钱包地址</p>
                  <p className="font-medium break-all">{address}</p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">余额</p>
                      <p className="font-medium">
                        {balance} {activeWallet === 'keplr' ? 'ATOM' : 'ETH'}
                      </p>
                    </div>
                    <AnimatedButton
                      onClick={refreshBalance}
                      className="!w-auto"
                    >
                      刷新
                    </AnimatedButton>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex space-x-4 mb-4">
                  <AnimatedButton
                    onClick={() => setActiveTab('transfer')}
                    className={`!w-auto ${
                      activeTab === 'transfer'
                        ? ''
                        : '!bg-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    转账
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => setActiveTab('history')}
                    className={`!w-auto ${
                      activeTab === 'history'
                        ? ''
                        : '!bg-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    交易记录
                  </AnimatedButton>
                </div>

                {activeTab === 'transfer' && activeWallet && address ? (
                  <Transfer
                    wallet={activeWallet}
                    address={address}
                    onSuccess={refreshBalance}
                  />
                ) : activeTab === 'history' && activeWallet && address ? (
                  <TransactionHistory
                    wallet={activeWallet}
                    address={address}
                  />
                ) : null}
              </div>

              <AnimatedButton
                variant="danger"
                onClick={disconnect}
              >
                断开连接
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>
    </NotificationProvider>
  )
}

export default App
