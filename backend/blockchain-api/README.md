# Blockchain API with PostgreSQL Integration

This API connects to the NEAR Protocol blockchain and stores transaction records in a PostgreSQL database.

## Setup Instructions

### Prerequisites

- Node.js and npm
- PostgreSQL database
- NEAR account with full access key

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:
   Edit the `.env` file and fill in:

```
PRIVATE_KEY=<your-near-private-key>
CONTRACT_ID=<your-near-account-id>

# PostgreSQL configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=<your-postgres-password>
DB_NAME=caseritos
```

3. Create the database:

```bash
psql -U postgres
CREATE DATABASE caseritos;
\q
```

4. Run database migrations:

```bash
npm run migrate
```

5. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Usage

### Add Record

Add a new record to the blockchain and save transaction details.

**Endpoint**: `POST /add-record`

**Request Body**:

```json
{
  "did1": "did:example:entity1",
  "hash": "bafybeianou72k7utcqinixkefamitw5qmitpakqcoph2jxj5kx3f65cu5e",
  "did2": "did:example:entity2"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "transactionHash": "...",
    "blockHash": "...",
    "recordId": "did:example:entity1-did:example:entity2-1619348266781",
    ...
  }
}
```

### Get Transactions

Retrieve transaction records with optional filtering.

**Endpoint**: `GET /transactions`

**Query Parameters**:

- `recordId`: Filter by unique record ID
- `did1`: Filter by first DID
- `did2`: Filter by second DID
- `transactionHash`: Filter by transaction hash

**Example**: `/transactions?did1=did:example:entity1`

**Response**:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "transactionHash": "...",
      "blockHash": "...",
      "recordId": "...",
      ...
    },
    ...
  ]
}
```

## Database Schema

The `raw_transactions` table stores blockchain transaction data:

| Column               | Type      | Description                           |
| -------------------- | --------- | ------------------------------------- |
| id                   | integer   | Primary key                           |
| transaction_hash     | string    | Unique blockchain transaction hash    |
| block_hash           | string    | Block hash containing the transaction |
| did1                 | string    | First DID entity                      |
| did2                 | string    | Second DID entity                     |
| data_hash            | string    | Hash of the data being referenced     |
| record_id            | string    | Unique record identifier              |
| status               | string    | Transaction status (SUCCESS/FAILURE)  |
| gas_burnt            | bigint    | Gas consumed by the transaction       |
| logs                 | jsonb     | Transaction logs array                |
| explorer_link        | string    | Link to transaction in NEAR explorer  |
| created_at           | timestamp | Record creation timestamp             |
| blockchain_timestamp | timestamp | Transaction timestamp on blockchain   |
