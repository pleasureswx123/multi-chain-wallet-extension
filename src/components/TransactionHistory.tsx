import { useEffect, useState } from 'react';
import { Transaction, WalletService } from '../services/wallet';

interface TransactionHistoryProps {
  address: string;
  wallet: string;
}

export function TransactionHistory({ address, wallet }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const history = await WalletService.getTransactionHistory(address, wallet);
        setTransactions(history);
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (address && wallet) {
      fetchTransactions();
    }
  }, [address, wallet]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400">
        暂无交易记录
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={tx.hash} className="bg-background/30 p-3 rounded-lg text-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="truncate flex-1">
              <span className="text-gray-400">交易哈希：</span>
              <span className="font-mono">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(tx.timestamp).toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="truncate">
              <span className="text-gray-400">发送方：</span>
              <span className="font-mono">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</span>
            </div>
            <div className="truncate">
              <span className="text-gray-400">接收方：</span>
              <span className="font-mono">{tx.to.slice(0, 6)}...{tx.to.slice(-4)}</span>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-gray-400">金额：</span>
            <span>{tx.amount} {wallet === 'keplr' ? 'ATOM' : 'ETH'}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 