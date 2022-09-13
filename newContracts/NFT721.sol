//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract NFT721 is ERC721URIStorage, ERC721Royalty {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public tokenCount;
    address public owner;

    /**
        Construct the NFT Contract that follows the ERC-721 standard.
        @param _collectionName - Name of the collection
        @param _collectionSymbol - Symbol for the collection
    */
    constructor(
        string memory _collectionName, 
        string memory _collectionSymbol 
    ) ERC721(
        _collectionName, 
        _collectionSymbol
    ) {
        owner = msg.sender;
        tokenCount = 0;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory) {
        return super.tokenURI(tokenId);
    }

    /**
        Mint the next token on the contract and store the token metadata with the token.
        
        @param _tokenURI - URI of the NFT Metadata
        @return newItemId - token ID of the minted NFT
     */
    function mint(string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        tokenCount = newItemId;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    /**
        Burn a given token ID. (Only owner has permission and that too only if they own the NFT)
        @param _tokenID - token ID of the NFT to be burned
     */
    function burn(uint256 _tokenID) public {
        require(ownerOf(_tokenID) == msg.sender, "Owner of the NFT can only burn NFTs owned by them");
        _burn(_tokenID);
    }

    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
        super._resetTokenRoyalty(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure override(ERC721, ERC721Royalty) returns(bool) {
        return interfaceId == 0x01ffc9a7 ||    // ERC-165
            interfaceId == 0x150b7a02 ||       // ERC-721
            interfaceId == 0x2a55205a;         // ERC-2981
    }
}