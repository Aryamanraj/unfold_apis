const { ethers, parseEther, formatEther } = require("ethers");
const { abi } = require("../builds/compiledcontract.json");
const { getConfig } = require("../../../config");

// Verifying the existence of ABI
if (!abi) {
  console.error('The ABI is undefined. Please check the ABI import.');
  process.exit();
}

const contractAddress = getConfig("contractAddr"); 
const privateKey = getConfig("PRIV_KEY_METAMASK"); 
const infuraProjectURI = getConfig("infuraProjectURI"); 
const infuraAPISecret = getConfig("INFURA_API_SEC");


async function getCurrentTimeFromContract() {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const currentTime = await contract.getCurrentTimestamp();
    console.log("Current time from contract:", currentTime.toString()); // Changed to .toString()
    return parseInt(currentTime.toString()); // Parsing to integer for easy addition operation later
  } catch (error) {
    console.error("Error getting current time from the contract:", error);
  }
}

async function startAuctionWithEndTime(tokenId, durationSeconds) {
  try {
    const currentTime = await getCurrentTimeFromContract();
    const endTime = currentTime + durationSeconds;

    console.log("Auction will end at timestamp:", endTime);
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.startAuction(tokenId, endTime);
    await tx.wait();
    console.log("Auction Started successfully!");
  } catch (error) {
    console.error("Error scheduling the auction:", error);
  }
}

async function placeBid(tokenId, value) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.placeBid(tokenId, { value: parseEther(value.toString()) });
    await tx.wait();

    console.log("Bid placed successfully!");
  } catch (error) {
    console.error("Error placing bid:", error);
  }
}

async function endAuction(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.endAuction(tokenId);
    await tx.wait();

    console.log("Auction ended successfully!");
  } catch (error) {
    console.error("Error ending the auction:", error);
  }
}

async function cancelAuction(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.cancelAuction(tokenId);
    await tx.wait();

    console.log("Auction cancelled successfully!");
  } catch (error) {
    console.error("Error cancelling the auction:", error);
  }
}

async function mintTokens(numberOfTokens) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.mint(numberOfTokens);

    await tx.wait();
    console.log("Tokens minted successfully!");
  } catch (error) {
    console.error("Error minting tokens:", error);
  }
}

async function updateTokenURI(tokenId, newURI) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.updateTokenURI(tokenId, newURI);
    await tx.wait();

    console.log("Token URI updated successfully!");
  } catch (error) {
    console.error("Error updating token URI:", error);
  }
}

async function getAuctionDetails(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const auction = await contract.auctions(tokenId);
    console.log("Auction Details:", auction);
    return auction;
  } catch (error) {
    console.error("Error getting auction details:", error);
  }
}

async function getHighestBid(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const highestBid = await contract.getHighestBid(tokenId);
    console.log("Highest Bid:", formatEther(highestBid));
    return highestBid;
  } catch (error) {
    console.error("Error getting highest bid:", error);
  }
}

async function getHighestBidder(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const highestBidder = await contract.getHighestBidder(tokenId);
    console.log("Highest Bidder:", highestBidder);
    return highestBidder;
  } catch (error) {
    console.error("Error getting highest bidder:", error);
  }
}

async function getTokenURI(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);
    return tokenURI;
  } catch (error) {
    console.error("Error getting highest bidder:", error);
  }
}

async function getOwner(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const tokenURI = await contract.ownerOf(tokenId);
    console.log(`Owner of token id ${tokenId} -> ${tokenURI}`);
    return tokenURI;
  } catch (error) {
    console.error("Error getting highest bidder:", error);
  }
}

async function transferOwnership(tokenId) {
  try {
    const provider = new ethers.JsonRpcProvider(infuraProjectURI);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const _highestBidder = "0x2597526F5355ED6FE776406Da85E3448629e3104"//await contract.getHighestBider()

    const tx = await contract.transferFrom("0x94E71CfEB2c0275FFbFfF6E214Cc9cDbd75a971f", _highestBidder, tokenId);
    await tx.wait();

    console.log("Ownership transfered to: ", _highestBidder);
  } catch (error) {
    console.error("Error ending the auction:", error);
  }
}

// mintTokens(6)

module.exports = {
  mintTokens,
  startAuctionWithEndTime,
  getCurrentTimeFromContract,
  placeBid,
  endAuction,
  cancelAuction,
  updateTokenURI,
  getAuctionDetails,
  getHighestBid,
  getHighestBidder,
  getTokenURI,
  getOwner,
  transferOwnership
}
// mintTokens(3)
// updateTokenURI(0, "Qmcknvt5nsAJqN56EUdBpwrhjR7Ctiox2cVe4E6Bqvp14b")
// getTokenURI(0)
// startAuctionWithEndTime(0,200)
// placeBid(0, 0.00005)
// getAuctionDetails(0)
// getCurrentTimeFromContract()
// endAuction(0)
// getHighestBidder(0)
// transferOwnership(0)
// getOwner(0)