// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

struct Offer {
    uint256 price;
    address payable from;
    address payable to;
    bool isWithdrawn;
    bool isAccepted;
}

contract NFTMarketOffers {
    
    mapping(uint256 => mapping(uint256 => Offer)) internal offerList;

    function _getOfferPrice(uint256 tokenId, uint256 offerId) external view returns (uint256) {
        return offerList[tokenId][offerId].price;
    }

    function _getOfferFrom(uint256 tokenId, uint256 offerId) external view returns (address payable) {
        return offerList[tokenId][offerId].from;
    }

    function _getOfferTo(uint256 tokenId, uint256 offerId) external view returns (address payable) {
        return offerList[tokenId][offerId].to;
    }

    function _getOffer(uint256 tokenId, uint256 offerId) external view returns (Offer memory) {
        return offerList[tokenId][offerId];
    }
    
    function _isAccepted(uint256 tokenId, uint256 offerId) external view returns (bool) {
        return offerList[tokenId][offerId].isAccepted;
    }

    function _isWithdrawn(uint256 tokenId, uint256 offerId) external view returns (bool) {
        return offerList[tokenId][offerId].isWithdrawn;
    }

    function _placeOffer(uint256 price, address payable from, address payable to, uint256 tokenId, uint256 offerId) external {
        offerList[tokenId][offerId] = Offer(
            price,
            from,
            to,
            false,
            false
        );
    }

    function _withdrawOffer(uint256 tokenId, uint256 offerId) external {
        require(offerList[tokenId][offerId].isAccepted != true, "The Offer has already been accepted.");
        offerList[tokenId][offerId].isWithdrawn = true;
    }

    function _acceptOffer(uint256 tokenId, uint256 offerId) external {
        require(offerList[tokenId][offerId].isWithdrawn != true, "The Offer has already been withdrawn.");
        offerList[tokenId][offerId].isAccepted = true;
    }
}