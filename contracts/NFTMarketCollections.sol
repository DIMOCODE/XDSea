// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

contract NFTMarketCollections {
    struct Collection {
        address creator;
        uint256 volumeTraded;
        uint256 collectionCount;
    }
    
    mapping(string => Collection) internal idToCollection;

    mapping(string => mapping(uint256 => uint256)) internal collectionNFTs;

    mapping(uint256 => string) internal collectionList;

    function _getCollectionCount(string memory collectionName) external view returns (uint256) {
        return idToCollection[collectionName].collectionCount;
    }

    function _getCollectionCreator(string memory collectionName) external view returns (address) {
        return idToCollection[collectionName].creator;
    }

    function _getCollectionNFT(string memory collectionName, uint256 collectionId) external view returns (uint256) {
        return collectionNFTs[collectionName][collectionId];
    }

    function _getCollectionName(uint256 collectionId) external view returns (string memory) {
        return collectionList[collectionId];
    }

    function _addCollection(string memory collectionName, address creator, uint256 collectionCount) external {
        idToCollection[collectionName] = Collection(
            creator,
            0,
            1
        );
        collectionList[collectionCount] = collectionName;
    }

    function _addNFTToCollection(string memory collectionName, uint256 nftId, uint256 tokenId) external {
        collectionNFTs[collectionName][nftId] = tokenId;
    }

    function _incrementCollectionCount(string memory collectionName) external {
        idToCollection[collectionName].collectionCount += 1;
    }

    function _incrementCollectionVolumeTraded(string memory collectionName, uint256 price) external {
        idToCollection[collectionName].volumeTraded += price;
    }

    function _setVolumeTraded(string memory collectionName, uint256 price) external {
        idToCollection[collectionName].volumeTraded = price;
    }
}