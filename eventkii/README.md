# EventKii 🎫

**Secure Onchain Ticketing Platform**

EventKii is a revolutionary blockchain-based ticketing platform that eliminates fraud, ensures authenticity, and provides seamless event management through smart contracts and NFT technology.

![EventKii Logo](./public/eventkii-logo.svg)

## ✨ Features

### 🎪 **Event Creation & Management**
- Create and manage events with blockchain security
- Set ticket prices, quantities, and event details
- Real-time event analytics and insights

### 🎟️ **NFT Ticket Minting**
- Mint tickets as unique NFTs on the blockchain
- Fraud-proof ticket authentication
- Transferable and verifiable ownership

### 🔐 **Access Verification**
- QR code-based ticket verification
- Instant blockchain validation
- Secure entry management system

### 💸 **Ticket Transfers**
- Peer-to-peer ticket transfers
- Secure blockchain transactions
- Transfer history tracking

### 📊 **Analytics Dashboard**
- Real-time sales tracking
- Event performance metrics
- Revenue and attendance analytics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Web3 wallet (MetaMask recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nobantugumbi/EventKii.git
   cd EventKii/eventkii
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see EventKii in action.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Blockchain**: OnchainKit, Wagmi, Viem
- **Styling**: CSS Modules, Custom CSS
- **State Management**: React Query
- **Development**: ESLint, Prettier

## 📁 Project Structure

```
eventkii/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout component
│   ├── globals.css        # Global styles
│   └── page.module.css    # Page-specific styles
├── public/                # Static assets
│   ├── eventkii-logo.svg # Main logo
│   ├── eventkii-icon.svg # App icon
│   └── eventkii-logo-light.svg # Light theme logo
├── contracts/             # Smart contracts (future)
└── package.json          # Dependencies and scripts
```

## 🎯 Usage

### Creating an Event
1. Click "Create Events" on the main dashboard
2. Fill in event details (name, date, venue, price)
3. Set ticket quantity and sale parameters
4. Deploy your event to the blockchain

### Minting Tickets
1. Select "Mint Tickets" from the dashboard
2. Choose your event and ticket type
3. Set pricing and availability
4. Mint NFT tickets for your attendees

### Verifying Access
1. Use "Verify Access" for event entry
2. Scan attendee QR codes
3. Instant blockchain verification
4. Grant or deny access based on ticket validity

### Transferring Tickets
1. Navigate to "Transfer Tickets"
2. Enter recipient wallet address
3. Select tickets to transfer
4. Complete secure blockchain transaction

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

EventKii can be deployed on various platforms:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [EventKii Platform](https://eventkii.vercel.app)
- **Documentation**: [EventKii Docs](https://docs.eventkii.com)
- **Support**: [Contact Us](mailto:support@eventkii.com)

## 🙏 Acknowledgments

- Built with [OnchainKit](https://docs.base.org/onchainkit)
- Powered by [Next.js](https://nextjs.org)
- Blockchain infrastructure by [Base](https://base.org)

---

**EventKii** - *Revolutionizing event ticketing through blockchain technology* 🚀
