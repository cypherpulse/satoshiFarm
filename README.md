
# SatoshiFarm

<p align="center">
	<a href="https://stacks.co/"><img src="https://img.shields.io/badge/Stacks-5546FF?style=for-the-badge&logo=stackshare&logoColor=white" alt="Stacks" /></a>
	<a href="https://clarity-lang.org/"><img src="https://img.shields.io/badge/Clarity-000000?style=for-the-badge&logo=stackshare&logoColor=white" alt="Clarity" /></a>
	<a href="https://www.circle.com/en/usdc-multichain/usdcx"><img src="https://img.shields.io/badge/USDCx-2775CA?style=for-the-badge&logo=circle&logoColor=white" alt="USDCx" /></a>
</p>




<p align="center"><b>Empowering farmers with direct, secure, and stablecoin-enabled commerce on the Stacks blockchain.</b></p>

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [System Integration](#system-integration)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

---

---



## Project Overview

SatoshiFarm is a decentralized marketplace built on the Stacks blockchain, enabling farmers to sell agricultural products directly to buyers with no intermediaries. The platform supports payments in both STX and USDCx stablecoin, providing a seamless, secure, and transparent experience for both sellers and buyers. SatoshiFarm leverages Clarity smart contracts for on-chain logic and a modern React/TypeScript frontend for user interaction.

---

---

---


## Features

- **Direct-to-Buyer Sales:** Farmers list and sell products directly, no middlemen
- **Dual Payment Support:** Accepts both STX and USDCx stablecoin
- **Secure Treasury:** Escrow and withdrawal for stablecoin payments
- **Farmer-First UX:** Effortless product listing, inventory, and earnings tracking
- **Wallet Integration:** Supports Leather and Xverse wallets
- **Open Source & Audited:** Fully open, with comprehensive tests
- **Modern Tech Stack:** Clarity smart contracts, React/TypeScript frontend

---



## Architecture

### High-Level System Structure

```mermaid
graph TD
	subgraph User
		U1[Browser]
	end
	subgraph Frontend
		F1[React/TypeScript App]
	end
	subgraph Blockchain
		C1[Clarity Smart Contracts]
		S1[Stacks Blockchain]
	end
	subgraph Wallets
		W1[Leather]
		W2[Xverse]
	end
	U1-- UI/API -->F1
	F1-- Connect, Transactions -->W1
	F1-- Connect, Transactions -->W2
	F1-- @stacks/connect, @stacks/transactions -->C1
	C1-- On-chain logic -->S1
	F1-- Data Fetch -->C1
```

---

## System Integration

### User Flow: Listing, Buying, and Withdrawing

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

---

## Project Structure

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



### Usage

#### List a Product (Farmer)
1. Connect your wallet (Leather/Xverse)
2. Go to "List Product" and enter details
3. Confirm the transaction in your wallet

#### Buy a Product (Buyer)
1. Connect your wallet
2. Browse available products
3. Click "Buy" and confirm payment (STX or USDCx)

#### Withdraw Earnings (Farmer)
1. Go to "Withdraw" section
2. Choose STX or USDCx
3. Confirm withdrawal in your wallet

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

