# NFT Platue Platform APIs

NFT Platue is a powerful and efficient platform offering a suite of APIs to interact with the NFT smart contracts, providing functionalities like minting NFTs, starting auctions, placing bids, and more. These APIs are built on Express and interact with Ethereum smart contracts.

## Deployment

The APIs are deployed on [Spheron.network](https://app.spheron.network/) using its Compute Engine, a global, production-ready environment optimized for high-performance applications.

Access the API documentation: [API Docs](http://provider.palmito.duckdns.org:31748/api-docs/).

## Spheron Network

Spheron is a Platform as a Service (PaaS) designed for dApps, providing compute, decentralized storage, CDN, and web hosting services out of the box. The Spheron Compute engine simplifies deployment, ensuring secure and encrypted connections, and facilitates containerization for efficient deployment and scalability.

## Smart Contract Deployment

The smart contract is deployed on the Avalanche C-Chain Fuji Testnet with the contract address: [`0x0b38bdc019954E5d8a26Be7523812e9BfeB240BE`](https://cchain.explorer.avax-test.network/address/0x0b38bdc019954E5d8a26Be7523812e9BfeB240BE/contracts).

## Getting Started

1. Clone the repository
2. Install the dependencies with `npm install`
3. Start the server with `npm start`

The server will be running on http://localhost:3225

## API Endpoints

All APIs are prefixed with `/nft`.

### Mint Tokens

- **Endpoint**: `/mint`
- **Method**: `POST`
- **Request Body**:
  - `numberOfTokens`: Number of tokens to mint
- **Response**:
  - Success: `{ success: true, message: "Tokens minted successfully!" }`
  - Error: `{ success: false, message: error.message }`

### Get Current Time

- **Endpoint**: `/current-time`
- **Method**: `GET`
- **Response**:
  - Success: `{ success: true, currentTime: currentTime }`
  - Error: `{ success: false, message: error.message }`

### Start Auction

- **Endpoint**: `/start-auction`
- **Method**: `POST`
- **Request Body**:
  - `tokenId`: ID of the token for which the auction is being started
  - `durationSeconds`: Duration of the auction in seconds
- **Response**:
  - Success: `{ success: true, message: "Auction started successfully!" }`
  - Error: `{ success: false, message: error.message }`

### Place Bid

- **Endpoint**: `/place-bid`
- **Method**: `POST`
- **Request Body**:
  - `tokenId`: ID of the token on which the bid is being placed
  - `value`: Value of the bid
- **Response**:
  - Success: `{ success: true, message: "Bid placed successfully!" }`
  - Error: `{ success: false, message: error.message }`

### End Auction

- **Endpoint**: `/end-auction`
- **Method**: `POST`
- **Request Body**:
  - `tokenId`: ID of the token for which the auction is being ended
- **Response**:
  - Success: `{ success: true, message: "Auction ended successfully!" }`
  - Error: `{ success: false, message: error.message }`

### Cancel Auction

- **Endpoint**: `/cancel-auction`
- **Method**: `POST`
- **Request Body**:
  - `tokenId`: ID of the token for which the auction is being cancelled
- **Response**:
  - Success: `{ success: true, message: "Auction cancelled successfully!" }`
  - Error: `{ success: false, message: error.message }`

### Get Auction Details

- **Endpoint**: `/auction-details/:tokenId`
- **Method**: `GET`
- **Response**:
  - Success: `{ success: true, auctionDetails: auctionDetails }`
  - Error: `{ success: false, message: error.message }`

### Get Highest Bid

- **Endpoint**: `/highest-bid/:tokenId`
- **Method**: `GET`
- **Response**:
  - Success: `{ success: true, highestBid: formatEther(highestBid) }`
  - Error: `{ success: false, message: error.message }`

### Get Highest Bidder

- **Endpoint**: `/highest-bidder/:tokenId`
- **Method**: `GET`
- **Response**:
  - Success: `{ success: true, highestBidder: highestBidder }`
  - Error: `{ success: false, message: error.message }`

### Update Token URI

- **Endpoint**: `/update-token-uri`
- **Method**: `PUT`
- **Request Body**:
  - `tokenId`: ID of the token whose URI is being updated
  - `newURI`: The new URI for the token
- **Response**:
  - Success: `{ success: true, message: "Token URI updated successfully!" }`
  - Error: `{ success: false, message: error.message }`

### Transfer Ownership

- **Endpoint**: `/transfer-ownership`
- **Method**: `POST`
- **Request Body**:
  - `tokenId`: ID of the token whose ownership is being transferred
- **Response**:
  - Success: `{ success: true, message: "Ownership transferred successfully!" }`
  - Error: `{ success: false, message: error.message }`

### Get Owner

- **Endpoint**: `/owner/:tokenId`
- **Method**: `GET`
- **Response**:
  - Success: `{ success: true, owner: owner }`
  - Error: `{ success: false, message: error.message }`

### Get Token URI

- **Endpoint**: `/token-uri/:tokenId`
- **Method**: `GET`
- **Response**:
  - Success: `{ success: true, tokenURI: tokenURI }`
  - Error: `{ success: false, message: error.message }`

## Token Details and Media URLs (Bulk Operations)

### Get Tokens Details

- **Endpoint**: `/tokens-details`
- **Method**: `POST`
- **Request Body**:
  - `tokenIds`: An array of token IDs whose details are being retrieved
- **Response**:
  - Success: `{ success: true, details: details }`
  - Error: `{ success: false, message: error.message }`

### Get Media URLs

- **Endpoint**: `/media-urls`
- **Method**: `POST`
- **Request Body**:
  - `tokenIds`: An array of token IDs whose media URLs are being retrieved
- **Response**:
  - Success: `{ success: true, mediaUrls: mediaUrls }`
  - Error: `{ success: false, message: error.message }`


### API Documentation

For more details and example responses, check the interactive API documentation at [http://localhost:3225/api-docs](http://localhost:3225/api-docs).


## Configuration

### Updating .env.example

The project contains a `.env.example` file. This file contains sample environment variables that the project needs to run properly. You should:

1. Copy the `.env.example` file and rename the copy to `.env`.
2. Update the `.env` file with your actual configurations, such as your Ethereum network details, contract addresses, and other necessary information.

Here is an explanation of some key environment variables:

- `NETWORK_URL`: The URL of the Ethereum network you are connecting to (it could be a local blockchain like Ganache, a testnet, or the mainnet).
- `CONTRACT_ADDRESS`: The address of the deployed smart contract on the Ethereum network.

### Example:

```plaintext
NETWORK_URL=http://localhost:8545
CONTRACT_ADDRESS=0x1234abcd5678efgh9012ijklmno34567
```

Make sure that the .env file is included in your .gitignore file to ensure that your configurations, especially sensitive ones like private keys and secrets, are not pushed to the public repository.


## Smart Contract

The APIs interact with the `EnhancedNFT` smart contract written in Solidity. The contract includes functions for minting tokens, starting, placing bids, and ending auctions, among others. The source code can be found in the `AVANFT.sol` file.

## Error Handling

All errors are returned with a 500 HTTP status code and a JSON body containing the error message.

### Example:

```json
{
  "success": false,
  "message": "Error message here"
}
```