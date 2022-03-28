// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./NFT.sol";
import "./NFTMarketOffers.sol";
import "./NFTMarketEvents.sol";
import "./NFTMarketCollections.sol";

import { Event } from "./NFTMarketEvents.sol";
import { Offer } from "./NFTMarketOffers.sol";

contract NFTMarketLayer1 is ReentrancyGuard, IERC721Receiver {
  address payable public owner;

  uint256 public collectionCount;

  uint256 public tokenCount;

  NFTMarketOffers internal offerList = new NFTMarketOffers();

  NFTMarketEvents internal eventHistory = new NFTMarketEvents();

  NFTMarketCollections internal collectionList = new NFTMarketCollections();

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    address nftContract;
    uint256 tokenId;
    address payable owner;
    address creator;
    uint256 price;
    bool isListed;
    uint256 royalty;
    uint256 eventCount;
    uint256 offerCount;
    string name;
    string collectionName;
  }

  mapping(uint256 => MarketItem) public idToMarketItem;

  function getCollectionNFTs(string memory collectionName) external view returns(MarketItem[] memory){
    uint256 currentIndex = 0;

    MarketItem[] memory nfts = new MarketItem[](collectionList._getCollectionCount(collectionName));
    for (uint256 i = 0; i < collectionList._getCollectionCount(collectionName); i++) {
        nfts[currentIndex] = idToMarketItem[collectionList._getCollectionNFT(collectionName, i + 1)];
        currentIndex = SafeMath.add(currentIndex, 1);
    }
    return nfts;
  }

  function getTokenEventHistory(uint256 tokenId) external view returns(Event[] memory) {
    uint256 currentIndex = 0;

    Event[] memory events = new Event[](idToMarketItem[tokenId].eventCount);
    for (uint256 i = 0; i < idToMarketItem[tokenId].eventCount; i++) {
        events[currentIndex] = eventHistory._getEvent(tokenId, i + 1);
        currentIndex = SafeMath.add(currentIndex, 1);
    }
    return events;
  }

  function getTokenOfferList(uint256 tokenId) external view returns(Offer[] memory) {
    uint256 currentIndex = 0;

    Offer[] memory offers = new Offer[](idToMarketItem[tokenId].offerCount);
    for (uint256 i = 0; i < idToMarketItem[tokenId].offerCount; i++) {
        offers[currentIndex] = offerList._getOffer(tokenId, i + 1);
        currentIndex = SafeMath.add(currentIndex, 1);
    }
    return offers;
  }

  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    address payable nftowner,
    address creator,
    uint256 price,
    bool isListed,
    uint256 royalty,
    uint256 eventCount,
    string memory nftName,
    string memory collectionName,
    bool add
  ) external payable nonReentrant {
    require(price > 0);

    if(add) {
      require(msg.sender == owner);
    }
    else{
      eventHistory._addEvent(tokenId, 1, msg.sender, address(0), 0, block.timestamp, 0);
    }

    idToMarketItem[tokenId] = MarketItem(
      nftContract,
      tokenId,
      nftowner,
      creator,
      price,
      isListed,
      royalty,
      eventCount,
      0,
      nftName,
      collectionName
    );

    tokenCount = tokenId;

    if(collectionList._getCollectionCreator(collectionName) == address(0x0)){
      collectionCount += 1;
      collectionList._addCollection(collectionName, msg.sender, collectionCount);
      collectionList._addNFTToCollection(collectionName, 1, tokenId);
    }
    else {
      collectionList._incrementCollectionCount(collectionName);
      collectionList._addNFTToCollection(collectionName, collectionList._getCollectionCount(collectionName), tokenId);
    }
  }

  function editMarketItem(
    address nftContract,
    uint256 tokenId,
    address payable nftowner,
    address creator,
    uint256 price,
    bool isListed,
    uint256 royalty,
    uint256 eventCount,
    uint256 offerCount,
    string memory nftName,
    string memory collectionName
  ) external payable nonReentrant {
    require(msg.sender == owner);
    idToMarketItem[tokenId] = MarketItem(
      nftContract,
      tokenId,
      nftowner,
      creator,
      price,
      isListed,
      royalty,
      eventCount,
      offerCount,
      nftName,
      collectionName
    );
  }

  function getOwnerOfToken(address nftContract, uint256 tokenId) external view returns (address) {
    return IERC721(nftContract).ownerOf(tokenId);
  }

  function listItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) external payable nonReentrant {
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    idToMarketItem[tokenId].price = price;
    idToMarketItem[tokenId].isListed = true;
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, msg.sender, address(this), price, block.timestamp, 1);
  }

  function withdrawListing(
    address nftContract,
    uint256 tokenId
    ) external payable nonReentrant {
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[tokenId].isListed = false;
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, address(this), msg.sender, 0, block.timestamp, 2);
  }

  function editListing(
    uint256 tokenId,
    uint256 price
  ) external payable nonReentrant {
    idToMarketItem[tokenId].price = price;
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, msg.sender, address(this), price, block.timestamp, 5);
  }

  function transferNFT(address nftContract, uint256 tokenId, address receiver) external payable nonReentrant {
    IERC721(nftContract).transferFrom(msg.sender, receiver, tokenId);
    idToMarketItem[tokenId].owner = payable(receiver);
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, msg.sender, receiver, 0, block.timestamp, 4);
    for(uint i = 1; i <= idToMarketItem[tokenId].offerCount; i++) {
      if(!offerList._isWithdrawn(tokenId, i)) {
        address payable from = offerList._getOfferFrom(tokenId, i);
        uint256 price = offerList._getOfferPrice(tokenId, i);
        offerList._withdrawOffer(tokenId, i);
        (from).transfer(SafeMath.div(SafeMath.mul(price, 102), 100));
      }
    }
    idToMarketItem[tokenId].offerCount = 0;
  }

  function createMarketSale(
    address nftContract,
    uint256 tokenId
    ) external payable nonReentrant {
    require(msg.value >= idToMarketItem[tokenId].price);
    payable(owner).transfer(SafeMath.mul(SafeMath.div(idToMarketItem[tokenId].price, 100), 2));
    payable(idToMarketItem[tokenId].creator).transfer(SafeMath.mul(SafeMath.div(idToMarketItem[tokenId].price, 100), idToMarketItem[tokenId].royalty));
    idToMarketItem[tokenId].owner.transfer(SafeMath.mul(SafeMath.div(idToMarketItem[tokenId].price, 100), (SafeMath.sub(100, idToMarketItem[tokenId].royalty))));
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[tokenId].isListed = false;
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, idToMarketItem[tokenId].owner, msg.sender, idToMarketItem[tokenId].price, block.timestamp, 3);
    idToMarketItem[tokenId].owner = payable(msg.sender);
    collectionList._incrementCollectionVolumeTraded(idToMarketItem[tokenId].collectionName, idToMarketItem[tokenId].price);
    for(uint i = 1; i <= idToMarketItem[tokenId].offerCount; i++) {
      if(!offerList._isWithdrawn(tokenId, i)) {
        address payable from = offerList._getOfferFrom(tokenId, i);
        uint256 price = offerList._getOfferPrice(tokenId, i);
        offerList._withdrawOffer(tokenId, i);
        (from).transfer(SafeMath.div(SafeMath.mul(price, 102), 100));
      }
    }
    idToMarketItem[tokenId].offerCount = 0;
  }

  function placeOffer(uint256 tokenId, uint256 price) external payable {
    require(price > 0);
    idToMarketItem[tokenId].offerCount = idToMarketItem[tokenId].offerCount + 1;
    offerList._placeOffer(
      price, 
      payable(msg.sender), 
      idToMarketItem[tokenId].owner, 
      tokenId, 
      idToMarketItem[tokenId].offerCount
    );
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, msg.sender, idToMarketItem[tokenId].owner, price, block.timestamp, 6);
  }

  function withdrawOffer(uint256 tokenId, uint256 offerId) external nonReentrant{
    offerList._withdrawOffer(tokenId, offerId);
    idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
    eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, msg.sender, idToMarketItem[tokenId].owner, offerList._getOfferPrice(tokenId, offerId), block.timestamp, 7);
    offerList._getOfferFrom(tokenId, offerId).transfer(SafeMath.div(SafeMath.mul(offerList._getOfferPrice(tokenId, offerId), 102), 100));
  }

  function acceptOffer(uint256 tokenId, uint256 offerId) external payable nonReentrant {
    offerList._acceptOffer(tokenId, offerId);
    for(uint i = 1; i <= idToMarketItem[tokenId].offerCount; i++) {
      if(!offerList._isWithdrawn(tokenId, i)) {
        address payable from = offerList._getOfferFrom(tokenId, i);
        uint256 price = offerList._getOfferPrice(tokenId, i);
        if(offerList._isAccepted(tokenId, i)) {
            payable(owner).transfer(SafeMath.div(SafeMath.mul(price, 2), 100));
            payable(idToMarketItem[tokenId].creator).transfer(SafeMath.div(SafeMath.mul(price, idToMarketItem[tokenId].royalty), 100));
            payable(idToMarketItem[tokenId].owner).transfer(SafeMath.div(SafeMath.mul(price, SafeMath.sub(100, idToMarketItem[tokenId].royalty)), 100));
            if(idToMarketItem[tokenId].isListed){
              IERC721(idToMarketItem[tokenId].nftContract).transferFrom(address(this), from, tokenId);  
            }
            else{
              IERC721(idToMarketItem[tokenId].nftContract).transferFrom(idToMarketItem[tokenId].owner, from, tokenId);
            }
            idToMarketItem[tokenId].eventCount = SafeMath.add(idToMarketItem[tokenId].eventCount, 1);
            eventHistory._addEvent(tokenId, idToMarketItem[tokenId].eventCount, idToMarketItem[tokenId].owner, from, price, block.timestamp, 8);
            idToMarketItem[tokenId].owner = from;
            collectionList._incrementCollectionVolumeTraded(idToMarketItem[tokenId].collectionName, price);
        }
        else{
            offerList._withdrawOffer(tokenId, i);
            (from).transfer(SafeMath.div(SafeMath.mul(price, 102), 100));
        }
      }
    }
    idToMarketItem[tokenId].offerCount = 0;
  }

  function transferFunds(uint256 price) external {
    require(msg.sender == owner);
    payable(owner).transfer(price);
  }

  function fetchCollections() external view returns (MarketItem[] memory) {
    uint256 currentIndex = 0;

    MarketItem[] memory collectionItems = new MarketItem[](collectionCount);
    for(uint i = 1; i <= collectionCount; i++) {
      collectionItems[currentIndex] = idToMarketItem[collectionList._getCollectionNFT(collectionList._getCollectionName(i), 1)];
      currentIndex = SafeMath.add(currentIndex, 1);
    }
    return collectionItems;
  }

  function fetchCollection(string memory collectionName) external view returns (MarketItem memory) {
    return idToMarketItem[collectionList._getCollectionNFT(collectionName, 1)];
  }

  function fetchMarketItems() external view returns (MarketItem[] memory) {
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](tokenCount);
    for (uint i = 0; i < tokenCount; i++) {
      if (idToMarketItem[i + 1].tokenId != 0) {
        items[currentIndex] = idToMarketItem[i + 1];
        currentIndex = SafeMath.add(currentIndex, 1);
      }
    }
    return items;
  }

  function fetchMyNFTs(address user) external view returns (MarketItem[] memory) {
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < tokenCount; i++) {
      if (idToMarketItem[SafeMath.add(i, 1)].owner == user) {
        itemCount = SafeMath.add(itemCount, 1);
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < tokenCount; i++) {
      if (idToMarketItem[SafeMath.add(i, 1)].owner == user) {
        items[currentIndex] = idToMarketItem[i + 1];
        currentIndex = SafeMath.add(currentIndex, 1);
      }
    }
    return items;
  }

  function fetchItemsCreated(address user) external view returns (MarketItem[] memory) {
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < tokenCount; i++) {
      if (idToMarketItem[SafeMath.add(i, 1)].creator == user) {
        itemCount = SafeMath.add(itemCount, 1);
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < tokenCount; i++) {
      if (idToMarketItem[SafeMath.add(i, 1)].creator == user) {
        items[currentIndex] = idToMarketItem[i + 1];
        currentIndex = SafeMath.add(currentIndex, 1);
      }
    }
    return items;
  }

  function setTradeVolume(string memory collectionName, uint256 volumeTraded) external {
    collectionList._setVolumeTraded(collectionName, volumeTraded);
  }

  function addEventsToItem(
    uint256 tokenId,
    uint256 eventId,
    uint256 eventType,
    address from,
    address to,
    uint256 price,
    uint256 timestamp
  ) external {
    require(msg.sender == owner);
    eventHistory._addEvent(tokenId, eventId, from, to, price, timestamp, eventType);
  }
 
  function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
    return this.onERC721Received.selector;
  }
}