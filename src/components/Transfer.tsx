import { useState } from 'react';
import { AnimatedButton } from './AnimatedButton';
import { WalletService } from '../services/wallet';

interface TransferProps {
  wallet: string;
  address: string;
  onSuccess: () => void;
}

export function Transfer({ wallet, address, onSuccess }: TransferProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAddress = (addr: string, type: 'cosmos' | 'ethereum'): boolean => {
    if (type === 'cosmos') {
      return addr.startsWith('cosmos1') && addr.length === 45;
    } else {
      return /^0x[a-fA-F0-9]{40}$/.test(addr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 验证地址格式
      const isValidAddress = validateAddress(
        recipient,
        wallet === 'keplr' ? 'cosmos' : 'ethereum'
      );

      if (!isValidAddress) {
        throw new Error(`无效的${wallet === 'keplr' ? 'Cosmos' : 'ETH'}地址`);
      }

      // 验证金额
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('无效的转账金额');
      }

      if (wallet === 'keplr') {
        if (!window.keplr) throw new Error('Keplr wallet not found');
        
        const txHash = await WalletService.sendCosmos(address, recipient, amount);
        console.log('Cosmos transaction hash:', txHash);
        
      } else if (wallet === 'metamask') {
        if (!window.ethereum) throw new Error('MetaMask not found');
        
        const amountInWei = BigInt(parseFloat(amount) * 1e18);
        
        await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: recipient,
            value: '0x' + amountInWei.toString(16),
          }],
        });
      }

      onSuccess();
      setRecipient('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '转账失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">接收地址</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full bg-background/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={`输入${wallet === 'keplr' ? 'Cosmos' : 'ETH'}地址`}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          {wallet === 'keplr' 
            ? '地址格式: cosmos1...' 
            : '地址格式: 0x...'}
        </p>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-1">转账金额</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-background/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0.0"
            step="0.000001"
            min="0"
            required
          />
          <span className="absolute right-3 top-2 text-gray-400">
            {wallet === 'keplr' ? 'ATOM' : 'ETH'}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {wallet === 'keplr'
            ? '注意：转账将收取 gas 费用（ATOM）'
            : '注意：转账将收取 gas 费用（ETH）'}
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <AnimatedButton
        type="submit"
        disabled={loading}
        className={loading ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {loading ? '处理中...' : '确认转账'}
      </AnimatedButton>
    </form>
  );
} 