
# SatoshiFarm

<p align="center">
	<a href="https://stacks.co/"><img src="https://img.shields.io/badge/Stacks-5546FF?style=for-the-badge&logo=stackshare&logoColor=white" alt="Stacks" /></a>
	<a href="https://clarity-lang.org/"><img src="https://img.shields.io/badge/Clarity-000000?style=for-the-badge&logo=stackshare&logoColor=white" alt="Clarity" /></a>
	<a href="https://www.circle.com/en/usdc-multichain/usdcx"><img src="https://img.shields.io/badge/USDCx-2775CA?style=for-the-badge&logo=circle&logoColor=white" alt="USDCx" /></a>
</p>



<p align="center"><b>Empowering farmers with direct, secure, and stablecoin-enabled commerce on the Stacks blockchain.</b></p>

---


## What is SatoshiFarm?

SatoshiFarm is a decentralized marketplace built on Stacks, designed to help farmers sell their products directly to buyers—no middlemen, no barriers. With support for STX and USDCx stablecoin payments, SatoshiFarm brings real-world agriculture to Web3, making it easy for anyone to buy and sell farm goods securely and transparently.

---

---


## Features

- Dual Payment Support: Accepts both STX and USDCx stablecoin
- Farmer-First UX: Effortless product listing, inventory, and earnings tracking
- Secure Treasury: Escrow and withdrawal for stablecoin payments
- Open Source & Audited: Fully open, with comprehensive tests
- Modern Tech Stack: Built with Clarity smart contracts and a React/TypeScript frontend

---


## Project Structure

```mermaid
graph TD
	A[frontend (React/TypeScript)] -->|Stacks.js, @stacks/connect| B[clarityContract (Clarity)]
	B --> C[Stacks Blockchain]
	A --> D[User Wallets (Leather, Xverse)]
	D --> A
```

- `clarityContract/` — Clarity smart contracts and tests (Stacks)
- `frontend/` — Web frontend for user interaction
- `solidityContract/` — (Planned) Solidity contracts for future expansion

---

### System Integration

```mermaid
sequenceDiagram
	participant User
	participant Frontend as Frontend (React)
	participant Wallet as Wallet (Leather/Xverse)
	participant Clarity as Clarity Contract
	participant Stacks as Stacks Blockchain

	User->>Frontend: List item / Buy item / Withdraw
	Frontend->>Wallet: Request signature
	Wallet-->>Frontend: Signed transaction
	Frontend->>Clarity: Submit transaction
	Clarity->>Stacks: Write/read state
	Stacks-->>Clarity: Confirm transaction
	Clarity-->>Frontend: Result (success/fail)
	Frontend-->>User: Show status, update UI
```



## Getting Started

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) (for Clarity contracts)
- Node.js & npm

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd satoshiFarm

# Install Clarity contract dependencies
cd clarityContract
npm install
```


### Run Tests

```bash
clarinet check
npm test
```

---



## Contributing

We welcome your ideas and code! Fork the repo, create a feature branch, and submit a pull request after testing your changes.

---



## License

MIT License — see LICENSE for details.

---

---

<p align="center"><sub>Built for farmers, on Stacks and beyond.</sub></p>

