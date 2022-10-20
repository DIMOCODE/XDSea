// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error AlreadyListed(address nftContract, uint256 tokenId);
error NotOwner();
error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error NotListed(address nftContract, uint256 tokenId);
error PriceNotMet(address nftContract, uint256 tokenId, uint256 price);
error CannotTransferToNull(address nftContract, uint256 tokenId, address receiver);
error NotEnoughBalance(address nftContract, uint256 tokenId, address caller, uint256 balance);
error NotEnoughBalanceListed(address nftContract, uint256 tokenId, address caller, uint256 balance);
error NotTheRightCurrency(address listingERC20Address, address transactionERC20Address);
error AuctionAlreadyExists(address nftContract, uint256 tokenId, uint256 startedAt);
error Auction1155AlreadyExists(address nftContract, uint256 tokenId, address seller, uint256 startedAt);
error AuctionDurationTooShort(uint256 duration);
error AuctionEnded(address nftContract, uint256 tokenId, uint256 endedAt);
error Auction1155Ended(address nftContract, uint256 tokenId, address seller, uint256 endedAt);
error BidPriceNotMet(uint256 endingPrice);
error WrongAmountSent(uint256 bidAmount);
error AuctionNotOngoing(address nftContract, uint256 tokenId);
error NotAuctionSellerOrOwner();

contract NFTMarketLayer2 is IERC721Receiver, IERC1155Receiver, ReentrancyGuard {

    address payable public marketOwner;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    uint256 private constant _THREE_DAYS = 259200;

    enum State {
        LISTED,
        SOLD,
        WITHDRAWN
    }

    struct Listing {
        uint256 price;
        address seller;
        address erc20Address;
        State state;
    }

    struct Listing1155 {
        uint256 price;
        uint256 amount;
        address erc20Address;
        State state;
    }

    struct Auction{
        address seller;
        uint256 endedAt;
        uint256 startedAt;
        address erc20Address;
        uint256 endingPrice;
        address bidder;
        uint256 commission;
        address commissionAddress;
    }

    struct Auction1155{
        uint256 endedAt;
        uint256 startedAt;
        address erc20Address;
        uint256 endingPrice;
        address bidder;
        uint256 commission;
        address commissionAddress;
        uint256 amount;
    }

    event NFTListed(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        address erc20Address,
        uint256 price
    );

    event NFT1155Listed(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        address erc20Address,
        uint256 amount,
        uint256 price
    );

    event NFTWithdrawn(
        address indexed withdrawer,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    event NFT1155Withdrawn(
        address indexed withdrawe,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 amount
    );

    event NFTPurchased(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFT1155Purchased(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price
    );

    event NFTListEdited(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFT1155ListEdited(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 amount,
        uint256 price
    );

    event NFTTransferred(
        address indexed sender,
        address indexed nftContract,
        uint256 indexed tokenId,
        address receiver
    );

    event NFT1155Transferred(
        address indexed sender,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 amount,
        address receiver
    );

    event ERC721Received(
        address indexed operator,
        address indexed from,
        uint256 indexed tokenId
    );

    event ERC1155Received(
        address indexed operator,
        address indexed from,
        uint256 indexed id,
        uint256 value
    );

    event ERC1155BatchReceived(
        address indexed operator,
        address indexed from,
        uint256[] ids,
        uint256[] values
    );

    event AuctionStarted(
        address indexed nftContract,
        uint256 indexed tokenId,
        address erc20Address,
        uint256 endedAt
    );

    event Auction1155Started(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 amount,
        address erc20Address,
        uint256 endedAt
    );

    event AuctionBid(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event Auction1155Bid(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 amount,
        uint256 price
    );

    event AuctionSettled(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    event Auction1155Settled(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 amount
    );

    event AuctionCancelled(
        address indexed nftContract,
        uint256 indexed tokenId
    );

    event Auction1155Cancelled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 amount
    );

    mapping(address => mapping(uint256 => Listing)) private _listings;
    mapping(address => mapping(uint256 => mapping(address => Listing1155))) private _listings1155;
    mapping(address => mapping(uint256 => Auction)) private _auctions;
    mapping(address => mapping(uint256 => mapping(address => Auction1155))) private _auctions1155;

    modifier notListed(address nftContract, uint256 tokenId, address owner) {
        Listing memory listing = _listings[nftContract][tokenId];
        if(listing.state == State.LISTED) {
            revert AlreadyListed(nftContract, tokenId);
        }
        _;
    }

    modifier isOwner(address nftContract, uint256 tokenId, address caller) {
        IERC721 nft = IERC721(nftContract);
        address owner = nft.ownerOf(tokenId);
        if(caller != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isOwner1155(address nftContract, uint256 tokenId, address caller) {
        IERC1155 nft = IERC1155(nftContract);
        uint256 balance = nft.balanceOf(caller, tokenId);
        if(balance <= 0) {
            revert NotOwner();
        }
        _;
    }

    modifier hasBalance(address nftContract, uint256 tokenId, address caller, uint256 amount) {
        IERC1155 nft = IERC1155(nftContract);
        uint256 balance = nft.balanceOf(caller, tokenId);
        if(balance < amount) {
            revert NotEnoughBalance(nftContract, tokenId, caller, balance);
        }
        _;
    }

    modifier isListed(address nftContract, uint256 tokenId) {
        Listing memory listing = _listings[nftContract][tokenId];
        if(listing.state != State.LISTED) {
            revert NotListed(nftContract, tokenId);
        }
        _;
    }

    modifier hasListedBalance(address nftContract, uint256 tokenId, address caller, uint256 amount) {
        Listing1155 memory listing = _listings1155[nftContract][tokenId][caller];
        if(listing.amount < amount) {
            revert NotEnoughBalanceListed(nftContract, tokenId, caller, listing.amount);
        }
        _;
    }

    modifier isCorrectCurrency1155(address nftContract, uint256 tokenId, address seller, address erc20Address) {
        Listing1155 memory listing = _listings1155[nftContract][tokenId][seller];
        if(listing.erc20Address != erc20Address) {
            revert NotTheRightCurrency(listing.erc20Address, erc20Address);
        }
        _;
    }

    modifier noOngoingAuction1155(address nftContract, uint256 tokenId, address seller) {
        Auction1155 memory auction = _auctions1155[nftContract][tokenId][seller];
        if(auction.startedAt != 0) {
            revert Auction1155AlreadyExists(nftContract, tokenId, seller, auction.startedAt);
        }
        _;
    }

    modifier ongoingAuction(address nftContract, uint256 tokenId, uint256 time) {
        Auction memory auction = _auctions[nftContract][tokenId];
        if(auction.endedAt <= time) {
            revert AuctionEnded(nftContract, tokenId, auction.endedAt);
        }
        _;
    }

    modifier ongoingAuction1155(address nftContract, uint256 tokenId, address seller, uint256 time) {
        Auction1155 memory auction = _auctions1155[nftContract][tokenId][seller];
        if(auction.endedAt <= time) {
            revert Auction1155Ended(nftContract, tokenId, seller, auction.endedAt);
        }
        _;
    }

    modifier isApproved(address nftContract, uint256 tokenId) {
        IERC721 nft = IERC721(nftContract);
        if(nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        _;
    }

    constructor() {
        marketOwner = payable(msg.sender);
    }

    function list(address nftContract, uint256 tokenId, uint256 price, address erc20Address) 
        external isOwner(nftContract, tokenId, msg.sender) {
            if(price <= 0) {
                revert PriceMustBeAboveZero();
            }
            Listing memory listing = _listings[nftContract][tokenId];
            if(listing.state == State.LISTED) {
                revert AlreadyListed(nftContract, tokenId);
            }
            IERC721 nft = IERC721(nftContract);
            if(nft.getApproved(tokenId) != address(this)) {
                revert NotApprovedForMarketplace();
            }
            nft.safeTransferFrom(msg.sender, address(this), tokenId);
            _listings[nftContract][tokenId] = Listing(price, msg.sender, erc20Address, State.LISTED);
            emit NFTListed(msg.sender, nftContract, tokenId, erc20Address, price);
        }

    function list1155(address nftContract, uint256 tokenId, uint256 amount, uint256 price, address erc20Address)
        external isOwner1155(nftContract, tokenId, msg.sender) {
            if(price <= 0) {
                revert PriceMustBeAboveZero();
            }
            IERC1155 nft = IERC1155(nftContract);
            uint256 balance = nft.balanceOf(msg.sender, tokenId);
            if(balance < amount) {
                revert NotEnoughBalance(nftContract, tokenId, msg.sender, balance);
            }
            if(!nft.isApprovedForAll(msg.sender, address(this))) {
                revert NotApprovedForMarketplace();
            }
            nft.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
            _listings1155[nftContract][tokenId][msg.sender] = Listing1155(price, amount, erc20Address, State.LISTED);
            emit NFT1155Listed(msg.sender, nftContract, tokenId, erc20Address, amount, price);
        }

    function withdrawListing(address nftContract, uint256 tokenId) 
        external isOwner(nftContract, tokenId, msg.sender)
        isListed(nftContract, tokenId) {
            IERC721 nft = IERC721(nftContract);
            nft.safeTransferFrom(address(this), msg.sender, tokenId);
            _listings[nftContract][tokenId].state = State.WITHDRAWN;
            emit NFTWithdrawn(msg.sender, nftContract, tokenId);
        }

    function withdrawListing1155(address nftContract, uint256 tokenId, uint256 amount, uint256 price)
        external isOwner1155(nftContract, tokenId, msg.sender) {
            if(price <= 0) {
                revert PriceMustBeAboveZero();
            }
            Listing1155 memory listing = _listings1155[nftContract][tokenId][msg.sender];
            if(listing.amount < amount) {
                revert NotEnoughBalanceListed(nftContract, tokenId, msg.sender, listing.amount);
            }
            IERC1155 nft = IERC1155(nftContract);
            nft.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
            _listings1155[nftContract][tokenId][msg.sender].amount -= amount;
            if(_listings1155[nftContract][tokenId][msg.sender].amount == 0) {
                _listings1155[nftContract][tokenId][msg.sender].state = State.WITHDRAWN;
            }
            else {
                _listings1155[nftContract][tokenId][msg.sender].price = price;
            }
            emit NFT1155Withdrawn(msg.sender, nftContract, tokenId, amount);
        }

    function buy(address nftContract, uint256 tokenId, address erc20Address, uint256 commission, address commissionAddress)
        external payable isListed(nftContract, tokenId)
        nonReentrant {
            Listing memory listedNFT = _listings[nftContract][tokenId];
            if(msg.value < listedNFT.price) {
                revert PriceNotMet(nftContract, tokenId, listedNFT.price);
            }
            if(listedNFT.erc20Address != erc20Address) {
                revert NotTheRightCurrency(listedNFT.erc20Address, erc20Address);
            }        
            if(erc20Address == address(0)) {
                if(commission != 0) {
                    payable(commissionAddress).transfer(SafeMath.div(SafeMath.mul(listedNFT.price, commission), 100));
                }
                marketOwner.transfer(SafeMath.div(SafeMath.mul(listedNFT.price, 2), 100));
                if(_checkRoyalties(nftContract)) {
                    (address royaltyReceiver, uint256 royaltyAmount) = 
                        IERC2981(nftContract).royaltyInfo(tokenId, listedNFT.price);
                    payable(royaltyReceiver).transfer(royaltyAmount);
                    payable(listedNFT.seller).transfer(SafeMath.sub(listedNFT.price, royaltyAmount));
                }
                else{
                    payable(listedNFT.seller).transfer(listedNFT.price);
                }
                IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);
            }
            else {
                IERC20 token = IERC20(listedNFT.erc20Address);
                if(commission != 0) {
                    token.transferFrom(msg.sender, payable(commissionAddress), SafeMath.div(SafeMath.mul(listedNFT.price, commission), 100));
                }
                token.transferFrom(msg.sender, marketOwner, SafeMath.div(SafeMath.mul(listedNFT.price, 2), 100));
                if(_checkRoyalties(nftContract)) {
                    (address royaltyReceiver, uint256 royaltyAmount) = 
                        IERC2981(nftContract).royaltyInfo(tokenId, listedNFT.price);
                    token.transferFrom(msg.sender, payable(royaltyReceiver), royaltyAmount);
                    token.transferFrom(msg.sender, payable(listedNFT.seller), SafeMath.sub(listedNFT.price, royaltyAmount));
                }
                else{
                    token.transferFrom(msg.sender, payable(listedNFT.seller), listedNFT.price);
                }
                bytes memory bytesInput = abi.encodePacked(
                    "CUSTOMTOKEN0x", 
                    _toASCIIString(listedNFT.erc20Address), 
                    "'''###'''", 
                    _uintToStr(listedNFT.price)
                );
                IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, bytesInput);
            }
            IERC721(nftContract).approve(address(this), tokenId);
            _listings[nftContract][tokenId].state = State.SOLD;
            _listings[nftContract][tokenId].seller = msg.sender;
            emit NFTPurchased(msg.sender, nftContract, tokenId, msg.value);
        }

    function buy1155(address nftContract, uint256 tokenId, address seller, uint256 amount, address erc20Address, uint256 commission, address commissionAddress)
        external payable nonReentrant {
            Listing1155 memory listedNFT = _listings1155[nftContract][tokenId][seller];
            if(listedNFT.amount < amount) {
                revert NotEnoughBalanceListed(nftContract, tokenId, seller, listedNFT.amount);
            }
            if(listedNFT.erc20Address != erc20Address) {
                revert NotTheRightCurrency(listedNFT.erc20Address, erc20Address);
            }
            if(erc20Address != address(0)) {
                if(commission != 0) {
                    payable(commissionAddress).transfer(SafeMath.div(SafeMath.mul(listedNFT.price, commission), 100));
                }
                marketOwner.transfer(SafeMath.div(SafeMath.mul(listedNFT.price, 2), 100));
                if(_checkRoyalties(nftContract)) {
                    (address royaltyReceiver, uint256 royaltyAmount) =
                        IERC2981(nftContract).royaltyInfo(tokenId, listedNFT.price);
                    payable(royaltyReceiver).transfer(royaltyAmount);
                    payable(seller).transfer(SafeMath.sub(listedNFT.price, royaltyAmount));
                }
                else{
                    payable(seller).transfer(listedNFT.price);
                }
                IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
            }
            else {
                IERC20 token = IERC20(listedNFT.erc20Address);
                if(commission != 0) {
                    token.transferFrom(msg.sender, payable(commissionAddress), SafeMath.div(SafeMath.mul(listedNFT.price, commission), 100));
                }
                token.transferFrom(msg.sender, marketOwner, SafeMath.div(SafeMath.mul(listedNFT.price, 2), 100));
                if(_checkRoyalties(nftContract)) {
                    (address royaltyReceiver, uint256 royaltyAmount) = 
                        IERC2981(nftContract).royaltyInfo(tokenId, listedNFT.price);
                    token.transferFrom(msg.sender, payable(royaltyReceiver), royaltyAmount);
                    token.transferFrom(msg.sender, payable(seller), SafeMath.sub(listedNFT.price, royaltyAmount));
                }
                else{
                    token.transferFrom(msg.sender, payable(seller), listedNFT.price);
                }
                bytes memory bytesInput = abi.encodePacked(
                    "CUSTOMTOKEN0x", 
                    _toASCIIString(listedNFT.erc20Address), 
                    "'''###'''", 
                    _uintToStr(listedNFT.price)
                );
                IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, amount, bytesInput);
            }
            IERC1155(nftContract).setApprovalForAll(msg.sender, true);
            _listings1155[nftContract][tokenId][seller].state = State.SOLD;
            _listings1155[nftContract][tokenId][msg.sender] = listedNFT;
            _listings1155[nftContract][tokenId][msg.sender].state = State.SOLD;
            emit NFT1155Purchased(msg.sender, nftContract, tokenId, amount, msg.value);
        }

    function _checkRoyalties(address nftContract) view internal returns (bool) {
        (bool success) = IERC165(nftContract).supportsInterface(_INTERFACE_ID_ERC2981);
        return success;
    }

    function _toASCIIString(address _address) internal pure returns (bytes memory) {
        bytes memory addressString = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 _bytes1 = bytes1(uint8(uint256(uint160(_address) / (2 ** (8 * (19 - i))))));
            bytes1 high = bytes1(uint8(_bytes1) / 16);
            bytes1 low = bytes1(uint8(_bytes1) - 16 * uint8(high));
            addressString[2 * i] = _char(high);
            addressString[2 * i + 1] = _char(low);
        }
        return addressString;
    }

    function _char(bytes1 _bytes) 
        internal pure returns (bytes1 charBytes) {
            if (uint8(_bytes) < 10) return bytes1(uint8(_bytes) + 0x30);
            else return bytes1(uint8(_bytes) + 0x57);
        }

    function _uintToStr(uint256 _uint)
        internal pure returns (string memory uintString) {
            if(_uint == 0) {
                return "0";
            }
            uint256 i = _uint;
            uint256 length;
            while(i != 0) {
                length++;
                i /= 10;
            }
            bytes memory bytesString = new bytes(length);
            uint256 j = length;
            while(_uint != 0) {
                j = j - 1;
                uint8 k = (48 + uint8(_uint - (_uint / 10) * 10));
                bytes1 _bytes1 = bytes1(k);
                bytesString[j] = _bytes1;
                _uint /= 10;
            }
            return string(bytesString);
        }

    function updateListing(address nftContract, uint256 tokenId, uint256 newPrice)
        external isListed(nftContract, tokenId)
        nonReentrant
        isOwner(nftContract, tokenId, msg.sender) {
            if(newPrice == 0) {
                revert PriceMustBeAboveZero();
            }
            _listings[nftContract][tokenId].price = newPrice;
            emit NFTListEdited(msg.sender, nftContract, tokenId, newPrice);
        }

    function updateListing1155(address nftContract, uint256 tokenId, uint256 amount, uint256 newPrice)
        external nonReentrant
        isOwner1155(nftContract, tokenId, msg.sender) {
            if(newPrice == 0) {
                revert PriceMustBeAboveZero();
            }
            Listing1155 memory listing = _listings1155[nftContract][tokenId][msg.sender];
            if(listing.amount < amount) {
                revert NotEnoughBalanceListed(nftContract, tokenId, msg.sender, listing.amount);
            }
            _listings1155[nftContract][tokenId][msg.sender].price = newPrice;
            emit NFT1155ListEdited(msg.sender, nftContract, tokenId, amount, newPrice);
        }

    function getListing(address nftContract, uint256 tokenId)
        external view returns (Listing memory) {
            return _listings[nftContract][tokenId];
        }

    function getListing1155(address nftContract, uint256 tokenId, address seller)
        external view returns (Listing1155 memory) {
            return _listings1155[nftContract][tokenId][seller];
        }

    function getAuction(address nftContract, uint256 tokenId)
        external view returns (Auction memory) {
            return _auctions[nftContract][tokenId];
        }

    function getAuction1155(address nftContract, uint256 tokenId, address seller)
        external view returns (Auction1155 memory) {
            return _auctions1155[nftContract][tokenId][seller];
        }

    function transfer(address nftContract, uint256 tokenId, address receiver)
        external notListed(nftContract, tokenId, msg.sender)
        isOwner(nftContract, tokenId, msg.sender) {
            if(receiver == address(0)) {
                revert CannotTransferToNull(nftContract, tokenId, receiver);
            }
            IERC721(nftContract).safeTransferFrom(msg.sender, receiver, tokenId);
            IERC721(nftContract).approve(address(this), tokenId);
            emit NFTTransferred(msg.sender, nftContract, tokenId, receiver);
        }

    function transfer1155(address nftContract, uint256 tokenId, uint256 amount, address receiver)
        external isOwner1155(nftContract, tokenId, msg.sender) {
            if(receiver == address(0)) {
                revert CannotTransferToNull(nftContract, tokenId, receiver);
            }
            IERC1155 nft = IERC1155(nftContract);
            uint256 balance = nft.balanceOf(msg.sender, tokenId);
            if(balance < amount) {
                revert NotEnoughBalance(nftContract, tokenId, msg.sender, balance);
            }
            IERC1155(nftContract).safeTransferFrom(msg.sender, receiver, tokenId, amount, "");
            IERC1155(nftContract).setApprovalForAll(address(this), true);
            emit NFT1155Transferred(msg.sender, nftContract, tokenId, amount, receiver);
        }

    function startAuction(address nftContract, uint256 tokenId, uint256 endAt, uint256 minPrice, address erc20Address)
        external isOwner(nftContract, tokenId, msg.sender) {
            if(endAt - block.timestamp < _THREE_DAYS) {
                revert AuctionDurationTooShort(endAt - block.timestamp);
            }
            Listing memory listing = _listings[nftContract][tokenId];
            if(listing.state == State.LISTED) {
                revert AlreadyListed(nftContract, tokenId);
            }
            Auction memory auction = _auctions[nftContract][tokenId];
            if(auction.startedAt != 0) {
                revert AuctionAlreadyExists(nftContract, tokenId, auction.startedAt);
            }
            IERC721 nft = IERC721(nftContract);
            if(nft.getApproved(tokenId) != address(this)) {
                revert NotApprovedForMarketplace();
            }
            nft.safeTransferFrom(msg.sender, address(this), tokenId);
            _auctions[nftContract][tokenId] = Auction(
                msg.sender,
                endAt,
                block.timestamp,
                erc20Address,
                minPrice,
                address(0),
                0,
                address(0)
            );
            emit AuctionStarted(nftContract, tokenId, erc20Address, endAt);
        }

    function startAuction1155(address nftContract, uint256 tokenId, uint256 endAt, uint256 minPrice, address erc20Address, uint256 amount)
        external {
            if(endAt - block.timestamp < _THREE_DAYS) {
                revert AuctionDurationTooShort(endAt - block.timestamp);
            }
            Auction1155 memory auction = _auctions1155[nftContract][tokenId][msg.sender];
            if(auction.startedAt != 0) {
                revert Auction1155AlreadyExists(nftContract, tokenId, msg.sender, auction.startedAt);
            }
            IERC1155 nft = IERC1155(nftContract);
            uint256 balance = nft.balanceOf(msg.sender, tokenId);
            if(balance <= 0) {
                revert NotOwner();
            }
            if(balance < amount) {
                revert NotEnoughBalance(nftContract, tokenId, msg.sender, balance);
            }
            if(!nft.isApprovedForAll(msg.sender, address(this))) {
                revert NotApprovedForMarketplace();
            }
            nft.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
            _auctions1155[nftContract][tokenId][msg.sender] = Auction1155(
                endAt,
                block.timestamp,
                erc20Address,
                minPrice,
                address(0),
                0,
                address(0),
                amount
            );
            emit Auction1155Started(nftContract, tokenId, msg.sender, amount, erc20Address, endAt);
        }

    function bid(address nftContract, uint256 tokenId, uint256 bidValue, address erc20Address, uint256 commission, address commissionAddress)
        external payable nonReentrant ongoingAuction(nftContract, tokenId, block.timestamp) {
            Auction memory auction = _auctions[nftContract][tokenId];
            if(auction.endingPrice >= bidValue) {
                revert BidPriceNotMet(auction.endingPrice);
            }
            if(bidValue < SafeMath.mul(SafeMath.div(msg.value, SafeMath.add(102, commission)), 100)) {
                revert WrongAmountSent(bidValue);
            }
            if(erc20Address != auction.erc20Address) {
                revert NotTheRightCurrency(auction.erc20Address, erc20Address);
            }
            if(auction.bidder != address(0)) {
                if(auction.erc20Address != address(0)) {
                    IERC20 token = IERC20(auction.erc20Address);
                    token.transferFrom(address(this), payable(auction.bidder), SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
                else {
                    payable(auction.bidder).transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
            }
            _auctions[nftContract][tokenId].endingPrice = bidValue;
            _auctions[nftContract][tokenId].bidder = msg.sender;
            _auctions[nftContract][tokenId].endedAt += 600;
            _auctions[nftContract][tokenId].commission = commission;
            _auctions[nftContract][tokenId].commissionAddress = commissionAddress;
            emit AuctionBid(msg.sender, nftContract, tokenId, bidValue);
        }

    function bid1155(address nftContract, uint256 tokenId, address seller, uint256 bidValue, address erc20Address, uint256 commission, address commissionAddress)
        external payable nonReentrant ongoingAuction1155(nftContract, tokenId, seller, block.timestamp) {
            Auction1155 memory auction = _auctions1155[nftContract][tokenId][seller];
            if(auction.endingPrice >= bidValue) {
                revert BidPriceNotMet(auction.endingPrice);
            }
            if(bidValue < SafeMath.mul(SafeMath.div(msg.value, SafeMath.add(102, commission)), 100)) {
                revert WrongAmountSent(bidValue);
            }
            if(erc20Address != auction.erc20Address) {
                revert NotTheRightCurrency(auction.erc20Address, erc20Address);
            }
            if(auction.bidder != address(0)) {
                if(auction.erc20Address != address(0)) {
                    IERC20 token = IERC20(auction.erc20Address);
                    token.transferFrom(address(this), payable(auction.bidder), SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
                else {
                    payable(auction.bidder).transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
            }
            _auctions1155[nftContract][tokenId][seller].endingPrice = bidValue;
            _auctions1155[nftContract][tokenId][seller].bidder = msg.sender;
            _auctions1155[nftContract][tokenId][seller].endedAt += 600;
            _auctions1155[nftContract][tokenId][seller].commission = commission;
            _auctions1155[nftContract][tokenId][seller].commissionAddress = commissionAddress;
            emit Auction1155Bid(msg.sender, nftContract, tokenId, seller, auction.amount, bidValue);
        }

    function settle(address nftContract, uint256 tokenId, address erc20Address)
        external payable nonReentrant {
            Auction memory auction = _auctions[nftContract][tokenId];
            if(auction.startedAt != 0) {
                revert AuctionAlreadyExists(nftContract, tokenId, auction.startedAt);
            }
            if(auction.erc20Address != erc20Address) {
                revert NotTheRightCurrency(auction.erc20Address, erc20Address);
            }
            if(auction.erc20Address != address(0)) {
                IERC20 token = IERC20(auction.erc20Address);
                if(auction.bidder != address(0)) {
                    if(auction.commission != 0) {
                        token.transferFrom(address(this), payable(auction.commissionAddress), SafeMath.div(SafeMath.mul(auction.endingPrice, auction.commission), 100));
                    }
                    token.transferFrom(address(this), marketOwner, SafeMath.div(SafeMath.mul(auction.endingPrice, 2), 100));
                    if(_checkRoyalties(nftContract)) {
                        (address royaltyReceiver, uint256 royaltyAmount) = 
                            IERC2981(nftContract).royaltyInfo(tokenId, auction.endingPrice);
                        token.transferFrom(msg.sender, payable(royaltyReceiver), royaltyAmount);
                        token.transferFrom(msg.sender, payable(msg.sender), SafeMath.sub(auction.endingPrice, royaltyAmount));
                    }
                    else {
                        token.transferFrom(address(this), payable(msg.sender), auction.endingPrice);
                    }
                }
                bytes memory bytesInput = abi.encodePacked(
                    "CUSTOMTOKEN0x", 
                    _toASCIIString(auction.erc20Address), 
                    "'''###'''", 
                    _uintToStr(auction.endingPrice)
                );
                IERC721(nftContract).safeTransferFrom(address(this), auction.bidder, tokenId, bytesInput);
            }
            else {
                if(auction.bidder != address(0)) {
                    if(auction.commission != 0) {
                        payable(auction.commissionAddress).transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, auction.commission), 100));
                    }
                    marketOwner.transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, 2), 100));
                    payable(msg.sender).transfer(auction.endingPrice);
                }
                IERC721(nftContract).safeTransferFrom(address(this), auction.bidder, tokenId);
            }
            IERC721(nftContract).approve(address(this), tokenId);
            address buyer = auction.bidder;
            _auctions[nftContract][tokenId].endingPrice = 0;
            _auctions[nftContract][tokenId].bidder = address(0);
            emit AuctionSettled(buyer, nftContract, tokenId);
        }

    function settle1155(address nftContract, uint256 tokenId, address erc20Address)
        external payable nonReentrant noOngoingAuction1155(nftContract, tokenId, msg.sender) {
            Auction1155 memory auction = _auctions1155[nftContract][tokenId][msg.sender];
            if(auction.erc20Address != erc20Address) {
                revert NotTheRightCurrency(auction.erc20Address, erc20Address);
            }
            if(auction.erc20Address != address(0)) {
                IERC20 token = IERC20(auction.erc20Address);
                if(auction.bidder != address(0)) {
                    if(auction.commission != 0) {
                        token.transferFrom(address(this), payable(auction.commissionAddress), SafeMath.div(SafeMath.mul(auction.endingPrice, auction.commission), 100));
                    }
                    token.transferFrom(address(this), marketOwner, SafeMath.div(SafeMath.mul(auction.endingPrice, 2), 100));
                    if(_checkRoyalties(nftContract)) {
                        (address royaltyReceiver, uint256 royaltyAmount) = 
                            IERC2981(nftContract).royaltyInfo(tokenId, auction.endingPrice);
                        token.transferFrom(msg.sender, payable(royaltyReceiver), royaltyAmount);
                        token.transferFrom(msg.sender, payable(msg.sender), SafeMath.sub(auction.endingPrice, royaltyAmount));
                    }
                    else {
                        token.transferFrom(address(this), payable(msg.sender), auction.endingPrice);
                    }
                }
                bytes memory bytesInput = abi.encodePacked(
                    "CUSTOMTOKEN0x", 
                    _toASCIIString(auction.erc20Address), 
                    "'''###'''", 
                    _uintToStr(auction.endingPrice)
                );
                IERC1155(nftContract).safeTransferFrom(address(this), auction.bidder, tokenId, auction.amount, bytesInput);
            }
            else {
                if(auction.bidder != address(0)) {
                    if(auction.commission != 0) {
                        payable(auction.commissionAddress).transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, auction.commission), 100));
                    }
                    marketOwner.transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, 2), 100));
                    payable(msg.sender).transfer(auction.endingPrice);
                }
                IERC1155(nftContract).safeTransferFrom(address(this), auction.bidder, tokenId, auction.amount, "");
            }
            IERC1155(nftContract).setApprovalForAll(address(this), true);
            address buyer = auction.bidder;
            _auctions1155[nftContract][tokenId][msg.sender].endingPrice = 0;
            _auctions1155[nftContract][tokenId][msg.sender].bidder = address(0);
            emit Auction1155Settled(buyer, nftContract, tokenId, msg.sender, auction.amount);
        }

    function cancelAuction(address nftContract, uint256 tokenId, address erc20Address)
        external payable nonReentrant ongoingAuction(nftContract, tokenId, block.timestamp) {
            Auction memory auction = _auctions[nftContract][tokenId];
            if(auction.seller != msg.sender && msg.sender != marketOwner) {
                revert NotAuctionSellerOrOwner();
            }
            if(auction.erc20Address != erc20Address) {
                revert NotTheRightCurrency(auction.erc20Address, erc20Address);
            }
            if(auction.bidder != address(0)) {
                if(auction.erc20Address != address(0)) {
                    IERC20 token = IERC20(auction.erc20Address);
                    token.transferFrom(address(this), payable(auction.bidder), SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
                else {
                    payable(auction.bidder).transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
            }
            IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);
            _auctions[nftContract][tokenId].endedAt = block.timestamp;
            _auctions[nftContract][tokenId].endingPrice = 0;
            _auctions[nftContract][tokenId].bidder = address(0);
            emit AuctionCancelled(nftContract, tokenId);
        }

    function cancelAuction1155(address nftContract, uint256 tokenId, address erc20Address)
        external payable nonReentrant ongoingAuction1155(nftContract, tokenId, msg.sender, block.timestamp) {
            Auction1155 memory auction = _auctions1155[nftContract][tokenId][msg.sender];
            if(auction.erc20Address != erc20Address) {
                revert NotTheRightCurrency(auction.erc20Address, erc20Address);
            }
            if(auction.bidder != address(0)) {
                if(auction.erc20Address != address(0)) {
                    IERC20 token = IERC20(auction.erc20Address);
                    token.transferFrom(address(this), payable(auction.bidder), SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
                else {
                    payable(auction.bidder).transfer(SafeMath.div(SafeMath.mul(auction.endingPrice, SafeMath.add(102, auction.commission)), 100));
                }
            }
            IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, auction.amount, "");
            _auctions1155[nftContract][tokenId][msg.sender].endedAt = block.timestamp;
            _auctions1155[nftContract][tokenId][msg.sender].endingPrice = 0;
            _auctions1155[nftContract][tokenId][msg.sender].bidder = address(0);
            emit Auction1155Cancelled(nftContract, tokenId, msg.sender, auction.amount);
        }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory)
        public virtual override returns (bytes4) {
            emit ERC721Received(operator, from, tokenId);
            return this.onERC721Received.selector;
        }

    function onERC1155Received(address operator, address from, uint256 tokenId, uint256 value, bytes memory)
        public virtual override returns (bytes4) {
            emit ERC1155Received(operator, from, tokenId, value);
            return this.onERC1155Received.selector;
        }

    function onERC1155BatchReceived(address operator, address from, uint256[] memory tokenIds, uint256[] memory values, bytes memory)
        public virtual override returns (bytes4) {
            emit ERC1155BatchReceived(operator, from, tokenIds, values);
            return this.onERC1155BatchReceived.selector;
        }

    function supportsInterface(bytes4 interfaceID) external override pure returns (bool) {
      return  interfaceID == 0x01ffc9a7 ||    // ERC-165
              interfaceID == 0x150b7a02 ||    // ERC-721
              interfaceID == 0x4e2312e0;      // ERC-1155
    }
}