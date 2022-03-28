// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

library SafeMath {

  /**
  * Multiplies two numbers
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    if (a == 0) {
      return 0;
    }
    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * Integer division of two numbers. Rounds down to nearest integer.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    return a / b;
  }

  /**
  * Subtracts two numbers.
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * Adds two numbers.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import "./NFT.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard, IERC721Receiver {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;

  constructor() {
    owner = payable(msg.sender);
  }

  function getOwner() public view returns(address) {
    return owner;
  }

  enum EventType {
    Minted,
    Listed,
    Withdrawn,
    Sale,
    Transfer,
    Edit
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    address creator;
    uint256 price;
    bool sold;
    bool isListed;
    uint256 royalty;
    uint256 eventCount;
  }

  struct Event {
    EventType eventType;
    address from;
    address to;
    uint256 price;
    uint256 timestamp;
  }

  mapping(uint256 => MarketItem) public idToMarketItem;

  mapping(uint256 => mapping(uint256 => Event)) public eventHistory;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    address creator,
    uint256 price,
    bool sold,
    bool isListed,
    uint256 royalty,
    uint256 eventCount
  );

  event MarketItemListed (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    address creator,
    uint256 price,
    bool sold,
    bool isListed,
    uint256 royalty,
    uint256 eventCount
  );

  event MarketItemWithdrawn (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    address creator,
    uint256 price,
    bool sold,
    bool isListed,
    uint256 royalty,
    uint256 eventCount
  );

  event MarketItemUpdated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    address creator,
    uint256 price,
    bool sold,
    bool isListed,
    uint256 royalty,
    uint256 eventCount
  );

  event MarketItemSold (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    address prevOwner,
    address creator,
    uint256 price,
    bool sold,
    bool isListed,
    uint256 royalty,
    uint256 eventCount
  );

  event MarketItemTransferred (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    address prevOwner,
    address creator,
    uint256 price,
    bool sold,
    bool isListed,
    uint256 royalty,
    uint256 eventCount
  );

  function getPrice(uint256 _tokenId) public view returns(uint256){
    return idToMarketItem[_tokenId].price;
  }

  function getEventHistory(uint256 itemId, uint256 eventId) public view returns(Event memory) {
    return eventHistory[itemId][eventId];
  }
  
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 royalty
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    eventHistory[itemId][1] = Event(
      EventType.Minted,
      address(0),
      msg.sender,
      0,
      block.timestamp
    );
  
    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(msg.sender),
      msg.sender,
      price,
      false,
      false,
      royalty,
      1
    );

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      msg.sender,
      msg.sender,
      price,
      false,
      false,
      royalty,
      1
    );
  }

  function getOwnerOfToken(address nftContract, uint256 tokenId) public view returns (address) {
    return IERC721(nftContract).ownerOf(tokenId);
  }

  function listItem(
    address nftContract,
    uint256 itemId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");

    uint256 tokenId = idToMarketItem[itemId].tokenId;

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    idToMarketItem[itemId].price = price;
    idToMarketItem[itemId].sold = false;
    idToMarketItem[itemId].isListed = true;
    eventHistory[itemId][idToMarketItem[itemId].eventCount + 1] = Event(
      EventType.Listed,
      msg.sender,
      address(this),
      price,
      block.timestamp
    );
    idToMarketItem[itemId].eventCount = idToMarketItem[itemId].eventCount + 1;
    MarketItem memory item = idToMarketItem[itemId];
    emit MarketItemListed(
      itemId, 
      nftContract, 
      tokenId, 
      msg.sender, 
      msg.sender, 
      item.creator, 
      price, 
      false, 
      true, 
      item.royalty, 
      item.eventCount
    );
  }

  function editListing(
    uint256 itemId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");

    idToMarketItem[itemId].price = price;
    eventHistory[itemId][idToMarketItem[itemId].eventCount + 1] = Event(
      EventType.Edit,
      msg.sender,
      address(this),
      price,
      block.timestamp
    );
    idToMarketItem[itemId].eventCount = idToMarketItem[itemId].eventCount + 1;
    MarketItem memory item = idToMarketItem[itemId];
    emit MarketItemUpdated(
      itemId, 
      item.nftContract, 
      item.tokenId, 
      msg.sender, 
      msg.sender, 
      item.creator, 
      price, 
      false, 
      true, 
      item.royalty, 
      item.eventCount
    );
  }

  function withdrawListing(address nftContract, uint256 itemId) public nonReentrant {
    uint256 tokenId = idToMarketItem[itemId].tokenId;
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].isListed = false;
    eventHistory[itemId][idToMarketItem[itemId].eventCount + 1] = Event(
      EventType.Withdrawn,
      address(this),
      msg.sender,
      0,
      block.timestamp
    );
    idToMarketItem[itemId].eventCount = idToMarketItem[itemId].eventCount + 1;
    MarketItem memory item = idToMarketItem[itemId];
    emit MarketItemWithdrawn(
      itemId, 
      item.nftContract, 
      item.tokenId, 
      msg.sender, 
      msg.sender, 
      item.creator, 
      item.price, 
      false, 
      false, 
      item.royalty, 
      item.eventCount
    );
  }

  function transferNFT(address nftContract, uint256 itemId, address receiver) public payable nonReentrant {
    uint256 tokenId = idToMarketItem[itemId].tokenId;
    IERC721(nftContract).transferFrom(msg.sender, receiver, tokenId);
    idToMarketItem[itemId].seller = payable(receiver);
    idToMarketItem[itemId].owner = payable(receiver);
    eventHistory[itemId][idToMarketItem[itemId].eventCount + 1] = Event(
      EventType.Transfer,
      msg.sender,
      receiver,
      0,
      block.timestamp
    );
    idToMarketItem[itemId].eventCount = idToMarketItem[itemId].eventCount + 1;
    MarketItem memory item = idToMarketItem[itemId];
    emit MarketItemTransferred(
      itemId, 
      item.nftContract, 
      item.tokenId, 
      receiver, 
      receiver, 
      msg.sender,
      item.creator, 
      item.price, 
      true, 
      false, 
      item.royalty, 
      item.eventCount
    );
  }

  function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
  }

  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value >= price, "Please submit the asking price in order to complete the purchase");
    uint royalty = idToMarketItem[itemId].royalty;
    address prevOwner = idToMarketItem[itemId].seller;
    payable(owner).transfer((price / 100) * 2);
    payable(idToMarketItem[itemId].creator).transfer((price / 100) * royalty);
    idToMarketItem[itemId].seller.transfer((price / 100) * (98 - royalty));
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToMarketItem[itemId].owner = payable(msg.sender);
    idToMarketItem[itemId].seller = payable(msg.sender);
    idToMarketItem[itemId].sold = true;
    idToMarketItem[itemId].isListed = false;
    eventHistory[itemId][idToMarketItem[itemId].eventCount + 1] = Event(
      EventType.Sale,
      prevOwner,
      msg.sender,
      price,
      block.timestamp
    );
    idToMarketItem[itemId].eventCount = idToMarketItem[itemId].eventCount + 1;
    _itemsSold.increment();
    MarketItem memory item = idToMarketItem[itemId];
    emit MarketItemSold(
      itemId, 
      item.nftContract, 
      item.tokenId, 
      msg.sender, 
      msg.sender, 
      prevOwner,
      item.creator, 
      price, 
      true, 
      false, 
      item.royalty, 
      item.eventCount
    );
  }

  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < itemCount; i++) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
    }
    return items;
  }

  function fetchMyNFTs(address user) public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == user) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == user) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchItemsCreated(address user) public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for(uint i = 0; i < totalItemCount; i++) {
      if(idToMarketItem[i + 1].creator == user) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < itemCount; i++) {
      if(idToMarketItem[i + 1].creator == user) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}