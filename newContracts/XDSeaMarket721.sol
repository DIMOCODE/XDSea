//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error AlreadyListed(address nftContract, uint256 tokenId);
error NotOwner();
error PriceMustBeAboveZero();
error NotApprovedForMarketplace();
error NotListed(address nftContract, uint256 tokenId);
error PriceNotMet(address nftContract, uint256 tokenId, uint256 price, uint256 sent);
error NotTheRightCurrency(address listingERC20Address, address transactionERC20Address);
error CannotTransferToNull(address nftContract, uint256 tokenId, address receiver);
error OwnerCannotBuyOwnNFT();
error CannotPayNullAddress();

contract XDSeaMarket721 is IERC721Receiver, ReentrancyGuard {

    address payable public marketOwner;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    enum State {
        WITHDRAWN,
        LISTED,
        SOLD
    }

    struct Listing {
        uint256 price;
        address seller;
        address erc20Address;
        uint256 royalty;
        address royaltyReceiver;
        address payout;
        State state;
    }

    event NFTListed(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        address erc20Address,
        uint256 price
    );

    event NFTWithdrawn(
        address indexed withdrawer,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    event NFTPurchased(
        address indexed buyer,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFTListEdited(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFTTransferred(
        address indexed sender,
        address indexed nftContract,
        uint256 indexed tokenId,
        address receiver
    );

    event ERC721Received(
        address indexed operator,
        address indexed from,
        uint256 indexed tokenId
    );

    modifier isOwner(address nftContract, uint256 tokenId, address caller) {
        IERC721 nft = IERC721(nftContract);
        address owner = nft.ownerOf(tokenId);
        if(caller != owner) {
            revert NotOwner();
        }
        _;
    }

    modifier isSeller(address nftContract, uint256 tokenId, address caller) {
        Listing memory listedNFT = _listings[nftContract][tokenId];
        if(caller != listedNFT.seller) {
            revert NotOwner();
        }
        _;
    }

    mapping(address => mapping(uint256 => Listing)) private _listings;

    constructor() {
        marketOwner = payable(msg.sender);
    }

    function list(address nftContract, uint256 tokenId, uint256 price, address erc20Address, uint256 royalty, address receiver, address payout) 
        external {
            IERC721 nft = IERC721(nftContract);
            address owner = nft.ownerOf(tokenId);
            if(msg.sender != owner) {
                revert NotOwner();
            }
            if(price <= 0) {
                revert PriceMustBeAboveZero();
            }
            if(nft.getApproved(tokenId) != address(this)) {
                revert NotApprovedForMarketplace();
            }
            if(payout == address(0)) {
                revert CannotPayNullAddress();
            }
            if(_checkRoyalties(nftContract)) {
                (address royaltyReceiver, uint256 royaltyAmount) = 
                    IERC2981(nftContract).royaltyInfo(tokenId, 10000);
                _listings[nftContract][tokenId] = Listing(price, msg.sender, erc20Address, royaltyAmount, royaltyReceiver, payout, State.LISTED);
            }
            else {
                if(_listings[nftContract][tokenId].royaltyReceiver != address(0)) {
                    _listings[nftContract][tokenId] = Listing(price, msg.sender, erc20Address, _listings[nftContract][tokenId].royalty, _listings[nftContract][tokenId].royaltyReceiver, payout, State.LISTED);
                }
                else {
                    _listings[nftContract][tokenId] = Listing(price, msg.sender, erc20Address, royalty, receiver, payout, State.LISTED);
                }
            }
            nft.safeTransferFrom(msg.sender, address(this), tokenId);
            emit NFTListed(msg.sender, nftContract, tokenId, erc20Address, price);
        }

    function withdrawListing(address nftContract, uint256 tokenId) 
        external isSeller(nftContract, tokenId, msg.sender) {
            IERC721 nft = IERC721(nftContract);
            nft.safeTransferFrom(address(this), msg.sender, tokenId);
            _listings[nftContract][tokenId].state = State.WITHDRAWN;
            emit NFTWithdrawn(msg.sender, nftContract, tokenId);
        }

    function buy(address nftContract, uint256 tokenId, address erc20Address, uint256 commission, address commissionAddress)
        external payable nonReentrant {
            Listing memory listedNFT = _listings[nftContract][tokenId];
            if(listedNFT.state != State.LISTED) {
                revert NotListed(nftContract, tokenId);
            }
            if(msg.value < _getTotalPrice(listedNFT.price, SafeMath.add(200, commission))) {
                if(erc20Address == address(0)) {
                    revert PriceNotMet(nftContract, tokenId, _getTotalPrice(listedNFT.price, SafeMath.add(200, commission)), msg.value);
                }
                else{
                    IERC20 token = IERC20(listedNFT.erc20Address);
                    if(token.balanceOf(msg.sender) < _getTotalPrice(listedNFT.price, SafeMath.add(200, commission))) {
                        revert PriceNotMet(nftContract, tokenId, _getTotalPrice(listedNFT.price, SafeMath.add(200, commission)), token.balanceOf(msg.sender));
                    }
                }
            }
            if(listedNFT.erc20Address != erc20Address) {
                revert NotTheRightCurrency(listedNFT.erc20Address, erc20Address);
            }        
            if(msg.sender == listedNFT.seller) {
                revert OwnerCannotBuyOwnNFT();
            }
            if(erc20Address == address(0)) {
                if(commission != 0) {
                    payable(commissionAddress).transfer(SafeMath.div(SafeMath.mul(listedNFT.price, commission), 10000));
                }
                marketOwner.transfer(SafeMath.div(SafeMath.mul(listedNFT.price, 200), 10000));
                if(_checkRoyalties(nftContract)) {
                    (address royaltyReceiver, uint256 royaltyAmount) = 
                        IERC2981(nftContract).royaltyInfo(tokenId, listedNFT.price);
                    payable(royaltyReceiver).transfer(royaltyAmount);
                    payable(listedNFT.payout).transfer(SafeMath.sub(listedNFT.price, royaltyAmount));
                }
                else{
                    payable(listedNFT.royaltyReceiver).transfer(_calculateRoyaltyAmount(listedNFT.price, listedNFT.royalty));
                    payable(listedNFT.payout).transfer(SafeMath.sub(listedNFT.price, _calculateRoyaltyAmount(listedNFT.price, listedNFT.royalty)));
                }
                IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);
            }
            else {
                IERC20 token = IERC20(listedNFT.erc20Address);
                if(commission != 0) {
                    token.transferFrom(msg.sender, payable(commissionAddress), SafeMath.div(SafeMath.mul(listedNFT.price, commission), 10000));
                }
                token.transferFrom(msg.sender, marketOwner, SafeMath.div(SafeMath.mul(listedNFT.price, 200), 10000));
                if(_checkRoyalties(nftContract)) {
                    (address royaltyReceiver, uint256 royaltyAmount) = 
                        IERC2981(nftContract).royaltyInfo(tokenId, listedNFT.price);
                    token.transferFrom(msg.sender, payable(royaltyReceiver), royaltyAmount);
                    token.transferFrom(msg.sender, payable(listedNFT.payout), SafeMath.sub(listedNFT.price, royaltyAmount));
                }
                else{
                    token.transferFrom(msg.sender, payable(listedNFT.royaltyReceiver), _calculateRoyaltyAmount(listedNFT.price, listedNFT.royalty));
                    token.transferFrom(msg.sender, payable(listedNFT.payout), SafeMath.sub(listedNFT.price, _calculateRoyaltyAmount(listedNFT.price, listedNFT.royalty)));
                }
                bytes memory bytesInput = abi.encodePacked(
                    "CUSTOMTOKEN0x", 
                    _toASCIIString(listedNFT.erc20Address), 
                    "'''###'''", 
                    _uintToStr(listedNFT.price)
                );
                IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, bytesInput);
            }
            _listings[nftContract][tokenId].state = State.SOLD;
            _listings[nftContract][tokenId].seller = msg.sender;
            _listings[nftContract][tokenId].payout = msg.sender;
            emit NFTPurchased(msg.sender, nftContract, tokenId, _getTotalPrice(listedNFT.price, SafeMath.add(200, commission)));
        }

    function _checkRoyalties(address nftContract) view internal returns (bool) {
        (bool success) = IERC165(nftContract).supportsInterface(_INTERFACE_ID_ERC2981);
        return success;
    }
    
    function _calculateRoyaltyAmount(uint256 royalty, uint256 price) pure internal returns (uint256) {
        return SafeMath.div(SafeMath.mul(price, royalty), 10000);
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

    function _getTotalPrice(uint256 listPrice, uint256 percentage) internal pure returns (uint256) {
        return SafeMath.div(SafeMath.mul(listPrice, SafeMath.add(10000, percentage)), 10000);
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
        external nonReentrant isSeller(nftContract, tokenId, msg.sender) {
            Listing memory listedNFT = _listings[nftContract][tokenId];
            if(listedNFT.state != State.LISTED) {
                revert NotListed(nftContract, tokenId);
            }
            if(newPrice == 0) {
                revert PriceMustBeAboveZero();
            }
            _listings[nftContract][tokenId].price = newPrice;
            emit NFTListEdited(msg.sender, nftContract, tokenId, newPrice);
        }

    function getListing(address nftContract, uint256 tokenId)
        external view returns (Listing memory) {
            return _listings[nftContract][tokenId];
        }

    function transfer(address nftContract, uint256 tokenId, address receiver)
        external isOwner(nftContract, tokenId, msg.sender) {
            if(receiver == address(0)) {
                revert CannotTransferToNull(nftContract, tokenId, receiver);
            }
            IERC721(nftContract).safeTransferFrom(msg.sender, receiver, tokenId);
            emit NFTTransferred(msg.sender, nftContract, tokenId, receiver);
        }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory)
        public virtual override returns (bytes4) {
            emit ERC721Received(operator, from, tokenId);
            return this.onERC721Received.selector;
        }

}