//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketplace;
    address owner;

    /**
        Construct the NFT Contract that follows the ERC-721 standard.

        @param _collectionName - Name of the collection
        @param _collectionSymbol - Symbol for the collection
        @param _marketplace - Address for the XDSea marketplace
    */
    constructor(
        string memory _collectionName, 
        string memory _collectionSymbol, 
        address _marketplace
    ) ERC721(
        _collectionName, 
        _collectionSymbol
    ) {
        marketplace = _marketplace;
        owner = msg.sender;
    }

    /**
        Mint the next token on the contract and store the token metadata with the token.
        
        @param _tokenURI - URI of the NFT Metadata
        @return newItemId - token ID of the minted NFT
     */
    function createToken(string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        setApprovalForAll(marketplace, true);
        return newItemId;
    }

    /**
        Burn a given token ID. (Only owner has permission and that too only if they own the NFT)

        @param _tokenID - token ID of the NFT to be burned
     */
    function burnToken(uint256 _tokenID) public {
        require(msg.sender == owner, "Only the owner of the collection can burn NFTs");
        require(ownerOf(_tokenID) == owner, "Owner of the collection can only burn NFTs owned by them");

        _burn(_tokenID);
    }
}