const express = require("express");
const axios = require("axios");
const router = express.Router();
const {
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
  transferOwnership,
} = require("../smartcontract/utils/utils");
const { formatEther } = require("ethers");

router.post("/mint", async (req, res) => {
  try {
    const { numberOfTokens } = req.body;
    await mintTokens(numberOfTokens);
    res.json({ success: true, message: "Tokens minted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/current-time", async (req, res) => {
  try {
    const currentTime = await getCurrentTimeFromContract();
    res.json({ success: true, currentTime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/start-auction", async (req, res) => {
  try {
    const { tokenId, durationSeconds } = req.body;
    await startAuctionWithEndTime(tokenId, durationSeconds);
    res.json({ success: true, message: "Auction started successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/place-bid", async (req, res) => {
  try {
    const { tokenId, value } = req.body;
    await placeBid(tokenId, value);
    res.json({ success: true, message: "Bid placed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/end-auction", async (req, res) => {
  try {
    const { tokenId } = req.body;
    await endAuction(tokenId);
    res.json({ success: true, message: "Auction ended successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/cancel-auction", async (req, res) => {
  try {
    const { tokenId } = req.body;
    await cancelAuction(tokenId);
    res.json({ success: true, message: "Auction cancelled successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/cancel-auction", async (req, res) => {
  try {
    const { tokenId } = req.body;
    await cancelAuction(tokenId);
    res.json({ success: true, message: "Auction cancelled successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/auction-details/:tokenId", async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const auctionDetails = await getAuctionDetails(tokenId);
    res.json({ success: true, auctionDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/highest-bid/:tokenId", async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const highestBid = await getHighestBid(tokenId);
    res.json({
      success: true,
      highestBid: formatEther(highestBid),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/highest-bidder/:tokenId", async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const highestBidder = await getHighestBidder(tokenId);
    res.json({ success: true, highestBidder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put("/update-token-uri", async (req, res) => {
  try {
    const { tokenId, newURI } = req.body;
    await updateTokenURI(tokenId, newURI);
    res.json({ success: true, message: "Token URI updated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/transfer-ownership", async (req, res) => {
  try {
    const { tokenId } = req.body;
    await transferOwnership(tokenId);
    res.json({ success: true, message: "Ownership transferred successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/owner/:tokenId", async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const owner = await getOwner(tokenId);
    res.json({ success: true, owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/token-uri/:tokenId", async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const tokenURI = await getTokenURI(tokenId);
    res.json({ success: true, tokenURI });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/tokens-details", async (req, res) => {
  try {
    const { tokenIds } = req.body;
    const details = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenURI = await getTokenURI(tokenId);
        const response = await axios.get(tokenURI); // Assuming the tokenURI is a direct link to the JSON data on IPFS
        return response.data;
      })
    );
    res.json({ success: true, details });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/media-urls", async (req, res) => {
  try {
    const { tokenIds } = req.body;
    const mediaUrls = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenURI = await getTokenURI(tokenId);
        const response = await axios.get(tokenURI);
        return response.data.media.url; // Extracting just the media URL from the details
      })
    );
    res.json({ success: true, mediaUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
