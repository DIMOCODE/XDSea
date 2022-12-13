// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

// Offer struct that records all the required information for
// an offer placed on an NFT
struct Offer {
    uint256 price;
    address payable from;
    address payable to;
    bool isWithdrawn;
    bool isAccepted;
}

contract NFTMarketOffers {
    
    // Store a record of all the offers placed on the marketplace
    mapping(uint256 => mapping(uint256 => Offer)) internal offerList;

    // Store a record of all the offers placed by a given address
    mapping(address => mapping(uint256 => Offer)) internal userFromOfferList;

    // Store a record of the number of offers placed by a given address
    mapping(address => uint256) internal userFromOfferCount;

    // Store a record of all the offers received by a given address
    mapping(address => mapping(uint256 => Offer)) internal userToOfferList;

    // Store a record of the number of offers received by a given address
    mapping(address => uint256) internal userToOfferCount;

    // Get the value of a given offer
    function _getOfferPrice(uint256 tokenId, uint256 offerId) external view returns (uint256) {
        return offerList[tokenId][offerId].price;
    }

    // Get the wallet address of the offerer of a given offer
    function _getOfferFrom(uint256 tokenId, uint256 offerId) external view returns (address payable) {
        return offerList[tokenId][offerId].from;
    }

    // Get the wallet address of the offeree of a given offer
    function _getOfferTo(uint256 tokenId, uint256 offerId) external view returns (address payable) {
        return offerList[tokenId][offerId].to;
    }

    // Return the Offer object given a token and offer ID
    function _getOffer(uint256 tokenId, uint256 offerId) external view returns (Offer memory) {
        return offerList[tokenId][offerId];
    }
    
    // Return a boolean that indicates whether the offer is accepted
    function _isAccepted(uint256 tokenId, uint256 offerId) external view returns (bool) {
        return offerList[tokenId][offerId].isAccepted;
    }

    // Return a boolean that indicates whether the offer is withdrawn
    function _isWithdrawn(uint256 tokenId, uint256 offerId) external view returns (bool) {
        return offerList[tokenId][offerId].isWithdrawn;
    }

    // Return the count of the offers placed by a given wallet address
    function _getOfferFromCount(address user) external view returns (uint256) {
        return userFromOfferCount[user];
    }

    // Return a specific Offer placed by a given wallet address
    function _getFromOffer(address user, uint256 offerId) external view returns (Offer memory) {
        return userFromOfferList[user][offerId];
    }

    // Return the count of the offers received by a given wallet address
    function _getOfferToCount(address user) external view returns (uint256) {
        return userToOfferCount[user];
    }

    // Return a specific Offer received by a given wallet address
    function _getToOffer(address user, uint256 offerId) external view returns (Offer memory) {
        return userToOfferList[user][offerId];
    }

    // Create a new Offer and apply it to the given NFT
    function _placeOffer(uint256 price, address payable from, address payable to, uint256 tokenId, uint256 offerId) external {
        offerList[tokenId][offerId] = Offer(
            price,
            from,
            to,
            false,
            false
        );
        userFromOfferCount[from] += 1;
        userFromOfferList[from][userFromOfferCount[from]] = offerList[tokenId][offerId];
        userToOfferCount[to] += 1;
        userToOfferList[to][userToOfferCount[to]] = offerList[tokenId][offerId];
    }

    // Withdraw a given offer placed on a given NFT
    function _withdrawOffer(uint256 tokenId, uint256 offerId) external {
        require(offerList[tokenId][offerId].isAccepted != true, "The Offer has already been accepted.");
        offerList[tokenId][offerId].isWithdrawn = true;
    }

    // Accept a given offer placed on a given NFT
    function _acceptOffer(uint256 tokenId, uint256 offerId) external {
        require(offerList[tokenId][offerId].isWithdrawn != true, "The Offer has already been withdrawn.");
        offerList[tokenId][offerId].isAccepted = true;
    }
}