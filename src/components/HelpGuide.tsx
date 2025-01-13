import { useState } from 'react';
import { AnimatedButton } from './AnimatedButton';

export function HelpGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const guides = [
    {
      title: '安装要求',
      items: [
        '请确保已安装 Keplr 浏览器插件（Cosmos生态）',
        '请确保已安装 MetaMask 浏览器插件（以太坊生态）',
        '推荐使用 Chrome 或 Brave 浏览器以获得最佳体验'
      ]
    },
    {
      title: '安全提示',
      items: [
        '请妥善保管您的私钥和助记词，不要泄露给任何人',
        '不要在不信任的网站上连接您的钱包',
        '转账前请仔细核对接收地址',
        '建议先转小额测试'
      ]
    },
    {
      title: '使用说明',
      items: [
        '首次使用时需要授权钱包访问权限',
        '转账时请确保有足够的代币支付 gas 费用',
        'Cosmos 转账需要预留少量 ATOM 作为 gas 费用',
        '以太坊转账需要预留少量 ETH 作为 gas 费用'
      ]
    },
    {
      title: '常见问题',
      items: [
        '如果无法连接钱包，请检查浏览器插件是否正确安装',
        '如果转账失败，请检查余额是否足够支付 gas 费用',
        '地址格式：Cosmos 以 cosmos1 开头，ETH 以 0x 开头',
        '如遇到问题，请刷新页面或重新连接钱包'
      ]
    }
  ];

  return (
    <div className="relative">
      <AnimatedButton
        onClick={() => setIsOpen(!isOpen)}
        className="!w-auto !bg-transparent text-gray-400 hover:text-white text-sm"
      >
        {isOpen ? '关闭帮助' : '使用帮助'}
      </AnimatedButton>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface rounded-lg shadow-xl p-4 z-50">
          <div className="space-y-4">
            {guides.map((guide) => (
              <div key={guide.title}>
                <h3 className="text-sm font-medium text-white mb-2">
                  {guide.title}
                </h3>
                <ul className="space-y-2">
                  {guide.items.map((item, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              注意：本插件仅用于管理数字资产，请遵守当地法律法规，注意资产安全。
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 