
# SatoshiFarm

<p align="center">
	<a href="https://stacks.co/"><img src="https://img.shields.io/badge/Stacks-5546FF?style=for-the-badge&logo=stackshare&logoColor=white" alt="Stacks" /></a>
	<a href="https://clarity-lang.org/"><img src="https://img.shields.io/badge/Clarity-000000?style=for-the-badge&logo=stackshare&logoColor=white" alt="Clarity" /></a>
	<a href="https://www.circle.com/en/usdc-multichain/usdcx"><img src="https://img.shields.io/badge/USDCx-2775CA?style=for-the-badge&logo=circle&logoColor=white" alt="USDCx" /></a>
</p>

SatoshiFarm is a decentralized marketplace on the Stacks blockchain, empowering farmers to sell agricultural products directly to buyers and accept payments in STX and USDCx stablecoin. Built for transparency, security, and ease of use, SatoshiFarm removes intermediaries and enables real-world commerce on Web3 rails.

---

## Key Features

- **Dual Payment Support:** Accept STX and USDCx stablecoin
- **Farmer-Friendly:** Simple product listing, inventory, and earnings tracking
- **Secure Treasury:** Escrow and withdrawal for stablecoin payments
- **Open & Audited:** Fully open source, with comprehensive tests

## Project Structure

- `clarityContract/` — Clarity smart contracts and tests (Stacks)
- `solidityContract/` — (Planned) Solidity contracts for future expansion
- `frontend/` — (Planned) Web frontend for user interaction

## Getting Started

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) (for Clarity contracts)
- Node.js & npm

### Quick Start

```bash
# Clone the repository

cd satoshiFarm

# Install Clarity contract dependencies
cd clarityContract
npm install
```

### Testing

```bash
clarinet check
npm test
```

## Contributing

We welcome contributions! Please fork the repo, create a feature branch, and submit a pull request after testing your changes.

## License

MIT License — see LICENSE for details.

---

<p align="center"><sub>Built for farmers, on Stacks and beyond.</sub></p>

