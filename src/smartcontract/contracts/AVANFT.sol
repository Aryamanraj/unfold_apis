// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EnhancedNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    uint256 public maxSupply = 10000;

    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => Auction) public auctions;

    struct Auction {
        bool isActive;
        uint256 startTime;
        uint256 endTime;
        address highestBidder;
        uint256 highestBid;
    }

    constructor(string memory name, string memory symbol, string memory initialBaseURI) ERC721(name, symbol) {
        baseURI = initialBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(uint256 numberOfTokens) public onlyOwner {
        require(totalSupply() + numberOfTokens <= maxSupply, "Minting exceeds max supply");

        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 mintIndex = totalSupply();
            _safeMint(msg.sender, mintIndex);
        }
    }

    function startAuction(uint256 tokenId, uint256 endTime) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(endTime > block.timestamp, "Invalid end time");

        auctions[tokenId] = Auction({
            isActive: true,
            startTime: block.timestamp,
            endTime: endTime,
            highestBidder: address(0),
            highestBid: 0
        });
    }

    function placeBid(uint256 tokenId) public payable {
        require(auctions[tokenId].isActive, "Auction not active");
        require(block.timestamp < auctions[tokenId].endTime, "Auction ended");
        require(msg.value > auctions[tokenId].highestBid, "Bid too low");

        if (auctions[tokenId].highestBidder != address(0)) {
            // Refund the previous highest bidder
            payable(auctions[tokenId].highestBidder).transfer(auctions[tokenId].highestBid);
        }

        auctions[tokenId].highestBidder = msg.sender;
        auctions[tokenId].highestBid = msg.value;
    }

    function endAuction(uint256 tokenId) public {
        require(auctions[tokenId].isActive, "Auction not active");
        require(block.timestamp >= auctions[tokenId].endTime, "Auction not ended yet");
        require(msg.sender == ownerOf(tokenId) || msg.sender == auctions[tokenId].highestBidder, "Not authorized");

        // Transfer the NFT to the highest bidder
        _transfer(ownerOf(tokenId), auctions[tokenId].highestBidder, tokenId);

        // Transfer the bid amount to the owner
        payable(ownerOf(tokenId)).transfer(auctions[tokenId].highestBid);

        // Mark the auction as inactive
        auctions[tokenId].isActive = false;
    }

    function cancelAuction(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Not the owner");
        require(auctions[tokenId].isActive, "Auction not active");

        if (auctions[tokenId].highestBidder != address(0)) {
            // Refund the highest bidder if there’s a bid placed
            payable(auctions[tokenId].highestBidder).transfer(auctions[tokenId].highestBid);
        }

        // Mark the auction as inactive
        auctions[tokenId].isActive = false;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory separator = bytes(_baseURI()).length > 0 ? "/" : "";

        return bytes(_tokenURI).length > 0
            ? string(abi.encodePacked(_baseURI(), separator, _tokenURI))
            : string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }

    function updateTokenURI(uint256 tokenId, string memory newURI) external {
        require(msg.sender == ownerOf(tokenId), "Not the owner");
        _tokenURIs[tokenId] = newURI;
    }
    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getHighestBid(uint256 tokenId) public view returns (uint256) {
        require(auctions[tokenId].isActive, "Auction not active");
        return auctions[tokenId].highestBid;
    }

    function getHighestBidder(uint256 tokenId) public view returns (address) {
        require(auctions[tokenId].isActive, "Auction not active");
        return auctions[tokenId].highestBidder;
    }

}
