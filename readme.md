
# Caserito App - Blockchain Hackathon Project Documentation

## Project Overview
Caserito App is a blockchain-based application that leverages NEAR Protocol to provide a decentralized platform. The project consists of multiple components working together to create a comprehensive blockchain solution.

## Project Structure
The project is organized into several key components:

### 1. Backend Services

#### a. Blockchain API Service
- **Purpose**: Connects to NEAR Protocol blockchain and manages transaction records
- **Technology Stack**:
  - Node.js
  - PostgreSQL for data persistence
  - NEAR Protocol integration
- **Key Features**:
  - Transaction record management
  - PostgreSQL database integration
  - RESTful API endpoints
- **Setup Requirements**:
  - Node.js ≥ 16
  - PostgreSQL database
  - NEAR account with full access key

#### b. DID Service (Decentralized Identity)
- **Purpose**: Handles decentralized identity management
- **Technology Stack**:
  - NestJS framework
  - TypeScript
- **Features**:
  - Credential issuance
  - JWT-based proof validation
  - Credential request handling

#### c. Smart Contract
- **Technology**: NEAR Protocol
- **Features**: 
  - Record management on blockchain
  - Transaction handling
  - Data verification

#### d. Agents Service
- **Purpose**: AI-powered validation and review processing
- **Integration**: NEAR AI documentation integration
- **Components**:
  - Review validation with image support
  - Score validation with review processing

### 2. Frontend Applications

#### a. Caseritos App (Main Application)
- **Technology Stack**:
  - Next.js
  - Prisma for database management
  - Authentication system
- **Features**:
  - User interface for blockchain interactions
  - Customer-focused functionality
  - Secure authentication

#### b. Landing Page
- **Technology**: Next.js
- **Purpose**: Public-facing website
- **Features**:
  - Project information
  - User onboarding

## Technical Architecture

### 1. Database Structure
- PostgreSQL database for transaction records
- Prisma schema for application data
- Blockchain state management

### 2. API Endpoints

#### Blockchain API
```json
POST /add-record
{
  "did1": "did:example:entity1",
  "hash": "bafybeianou72k7utcqinixkefamitw5qmitpakqcoph2jxj5kx3f65cu5e",
  "did2": "did:example:entity2"
}
```

### 3. Deployment Configuration
- Docker containers for services
- Environment configuration through `.env` files
- Deployment scripts for various components

## Development Setup

### 1. Blockchain API Setup
```bash
npm install
# Configure .env file
npm run migrate
npm start
```

### 2. DID Service Setup
```bash
yarn install
yarn run start:dev
```

### 3. Smart Contract Development
```bash
npm install
npm run build
```

## Testing
Each component includes comprehensive testing:

### DID Service
```bash
yarn run test        # Unit tests
yarn run test:e2e    # End-to-end tests
yarn run test:cov    # Test coverage
```

## Production Deployment
- Docker containers for service deployment
- Environment-specific configurations
- Database migration handling

## Links and Resources
- Main Application: https://caserito.app/
- Documentation References:
  - [NEAR Protocol Documentation](https://docs.near.org/)
  - [Next.js Documentation](https://nextjs.org/docs)

## License
The project components are licensed under MIT License, allowing for open-source collaboration and usage.

---

This documentation provides a comprehensive overview of the Caserito App blockchain project, including its architecture, components, setup instructions, and deployment guidelines. The project leverages modern technologies and blockchain capabilities to create a robust decentralized application.

