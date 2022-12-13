// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

contract NFTMarketCollections {

    // Collection struct that records all the required information for
    // an NFT Collection
    struct Collection {
        address creator;
        uint256 volumeTraded;
        uint256 collectionCount;
    }
    
    // Store a record of all the Collections on the marketplace
    mapping(string => Collection) internal idToCollection;

    // Store a record of the token IDs that belong to a given Collection
    mapping(string => mapping(uint256 => uint256)) internal collectionNFTs;

    // Store a record of all the Collection names
    mapping(uint256 => string) internal collectionList;

    // Return the count of the total number of NFTs that belong to a 
    // given collection
    function _getCollectionCount(string memory collectionName) external view returns (uint256) {
        return idToCollection[collectionName].collectionCount;
    }

    // Return the address of the creator of a given collection
    function _getCollectionCreator(string memory collectionName) external view returns (address) {
        return idToCollection[collectionName].creator;
    }

    // Return a specific NFT from a given collection
    function _getCollectionNFT(string memory collectionName, uint256 collectionId) external view returns (uint256) {
        return collectionNFTs[collectionName][collectionId];
    }

    // Return the name of a collection based on a given collection ID
    function _getCollectionName(uint256 collectionId) external view returns (string memory) {
        return collectionList[collectionId];
    }

    // Create a new Collection
    function _addCollection(string memory collectionName, address creator, uint256 collectionCount) external {
        idToCollection[collectionName] = Collection(
            creator,
            0,
            1
        );
        collectionList[collectionCount] = collectionName;
    }

    // Add a given NFT to the given collection
    function _addNFTToCollection(string memory collectionName, uint256 nftId, uint256 tokenId) external {
        collectionNFTs[collectionName][nftId] = tokenId;
    }

    // Update the count of the given collection
    function _incrementCollectionCount(string memory collectionName) external {
        idToCollection[collectionName].collectionCount += 1;
    }

    // Update the volume traded record for a given collection
    function _incrementCollectionVolumeTraded(string memory collectionName, uint256 price) external {
        idToCollection[collectionName].volumeTraded += price;
    }

    // Explicitly set the volume traded record for a given collection
    function _setVolumeTraded(string memory collectionName, uint256 price) external {
        idToCollection[collectionName].volumeTraded = price;
    }
}