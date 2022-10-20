//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error NotOwner(address sender, address owner);
error NotEnoughBalance(uint256 amount, uint256 balance);

contract XDSeaMarketOffers is ReentrancyGuard {
    
    using SafeERC20 for IERC20;

    using SafeMath for uint256;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    address payable public marketOwner;

    struct Offer {
        address nftContract;
        uint256 tokenId;
        address offerMaker;
        uint256 amount;
        uint256 duration;
    }

    event FundsReceived(
        address indexed sender,
        uint256 amount
    );

    event FundsSent(
        address indexed receiver,
        uint256 amount,
        address indexed erc20Address
    );

    modifier onlyOwner {
        if(msg.sender != marketOwner) {
            revert NotOwner(msg.sender, marketOwner);
        }
        _;
    }

    constructor() {
        marketOwner = payable(msg.sender);
    }

    /**
     * Allow the contract to receive payments from the contract deployer
     */
    receive() external payable {
        if(msg.sender != marketOwner) {
            revert NotOwner(msg.sender, marketOwner);
        }
        emit FundsReceived(msg.sender, msg.value);
    }

    /**
     * Returns the current balance of the contract
     */
    function balanceOf() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * Allow the contract deployer to use admin privileges to withdraw funds in case of technical issues or emergencies
     */
    function withdrawToAddress(address receiver, uint256 amount, address erc20Address) external payable onlyOwner nonReentrant {
        if(erc20Address != address(0)) {
            if(IERC20(erc20Address).balanceOf(address(this)) < amount) {
                revert NotEnoughBalance(amount, IERC20(erc20Address).balanceOf(address(this)));
            }
            IERC20(erc20Address).safeTransfer(receiver, amount);
        }
        else {
            if(address(this).balance < amount) {
                revert NotEnoughBalance(amount, address(this).balance);
            }
            payable(receiver).transfer(amount);
        }
        emit FundsSent(receiver, amount, erc20Address);
    }
}