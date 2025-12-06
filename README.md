# 🎮 RPS.SOL - Solana Gambling DApp

A decentralized Rock Paper Scissors gambling game built on Solana with provably fair gameplay and automatic revenue generation.

## 🚀 Features

- **Provably Fair Gaming** - Commit-reveal mechanism prevents cheating
- **SOL Betting** - Real SOL wagering with customizable bet amounts
- **Automatic Revenue** - 4% house edge goes directly to owner wallet
- **Modern UI** - Professional, responsive design with wallet integration
- **Admin Panel** - Withdraw funds from any game at any time
- **Security First** - Cryptographic hashing and on-chain verification

## 💰 Revenue Model

- **4% House Edge** - Automatically collected from every game
- **Minimum Bet** - 0.1 SOL per game
- **Instant Payouts** - Revenue flows directly to your wallet
- **Admin Controls** - Withdraw stuck funds anytime

## 🛠 Tech Stack

- **Smart Contract** - Rust + Anchor Framework
- **Frontend** - Vanilla JavaScript + Solana Web3.js
- **Wallet** - Phantom Wallet integration
- **Network** - Solana Devnet/Mainnet

## 📦 Project Structure

```
├── programs/
│   └── rock-paper-scissors/
│       └── src/
│           └── lib.rs          # Smart contract logic
├── web/
│   ├── index.html              # Main game interface
│   ├── admin.html              # Admin fund withdrawal panel
│   ├── anchor-client.js        # Solana blockchain client
│   └── server.js               # Local development server
├── tests/
│   └── rock-paper-scissors.ts  # Contract tests
└── deploy.sh                   # Deployment script
```

## 🎯 Game Flow

1. **Connect Wallet** - Players connect Phantom wallet
2. **Place Bet** - Choose bet amount (0.1 - 1 SOL)
3. **Select Move** - Rock, Paper, or Scissors
4. **Create Game** - Smart contract holds funds in escrow
5. **Opponent Joins** - Second player matches bet
6. **Reveal Moves** - Cryptographic reveal prevents cheating
7. **Determine Winner** - Smart contract calculates result
8. **Claim Winnings** - Winner gets 96%, house gets 4%

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local server
npm run dev

# Build smart contract (requires Anchor)
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## 🌐 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `web` folder

## 🔧 Configuration

### House Wallet
Update your wallet address in `programs/rock-paper-scissors/src/lib.rs`:
```rust
const HOUSE_WALLET: &str = "YOUR_WALLET_ADDRESS_HERE";
```

### Network Settings
Change network in `web/index.html`:
```javascript
// For mainnet
const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');

// For devnet
const connection = new solanaWeb3.Connection('https://api.devnet.solana.com');
```

## 🎮 How to Play

1. **Get SOL** - Ensure you have SOL in your Phantom wallet
2. **Connect** - Click "Connect Wallet" button
3. **Set Bet** - Choose your bet amount using presets or custom input
4. **Pick Move** - Select Rock, Paper, or Scissors
5. **Create Game** - Click "Create Game" to start
6. **Wait** - Game waits for opponent to join
7. **Auto-Reveal** - Moves are automatically revealed
8. **Claim** - Winner claims their prize!

## 🔒 Security Features

- **Commit-Reveal Scheme** - Prevents move manipulation
- **Cryptographic Hashing** - SHA-256 with random nonces
- **On-Chain Verification** - All logic runs on Solana
- **Escrow System** - Funds locked until game completion
- **Admin Controls** - Emergency fund recovery

## 📊 Revenue Analytics

- **Per Game Revenue** - 4% of total pot
- **Example**: 1 SOL game = 0.04 SOL revenue
- **Scaling**: 100 games/day = 4 SOL daily revenue
- **Compound Growth** - Revenue increases with player adoption

## 🚀 Live Demo

[Play Now](https://your-vercel-app.vercel.app) - Connect your Phantom wallet and start playing!

## 📄 License

MIT License - Feel free to fork and customize for your own gambling platform.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For technical support or business inquiries, create an issue in this repository.

---

**⚠️ Disclaimer**: This is gambling software. Ensure compliance with local laws and regulations before deployment.