# 多链钱包 Chrome 插件

一个支持 Cosmos 和以太坊生态的多链钱包 Chrome 插件。

## 功能特点

- 支持 Keplr 钱包（Cosmos 生态）
- 支持 MetaMask 钱包（以太坊生态）
- 查看钱包余额
- 转账功能
- 交易历史记录
- 实时通知提醒
- 美观的用户界面

## 技术栈

- React
- TypeScript
- Vite
- TailwindCSS
- Ant Design
- Zustand

## 开发环境要求

- Node.js >= 16
- pnpm >= 8

## 安装和使用

1. 克隆仓库：
   ```bash
   git clone [repository-url]
   cd chrome-plugin
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 创建环境变量文件：
   ```bash
   cp .env.example .env
   ```
   然后编辑 `.env` 文件，填入必要的配置信息。

4. 开发模式：
   ```bash
   pnpm dev
   ```

5. 构建插件：
   ```bash
   pnpm build
   ```

6. 安装到 Chrome：
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目的 `dist` 目录

## 使用说明

1. 安装插件后，点击 Chrome 工具栏中的插件图标
2. 选择要连接的钱包类型（Keplr 或 MetaMask）
3. 按照提示完成钱包连接
4. 连接成功后可以查看余额、进行转账和查看交易历史

## 注意事项

- 使用前请确保已安装 Keplr 或 MetaMask 浏览器扩展
- 请妥善保管您的钱包私钥和助记词
- 转账前请仔细核对接收地址

## 许可证

MIT
