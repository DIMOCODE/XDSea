//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

error NotPoolOwner(address owner, address sender);
error NotOwner(address owner, address sender);
error NotEligibleForStaking(uint256 tokenId);
error StillLockedIn(uint256 lockInEnd, uint256 currentTime);

contract XDSea721Staking is ReentrancyGuard, IERC721Receiver {

    // Allows the usage of safe functions for XRC20 tokens
    using SafeERC20 for IERC20;

    // Store the address of the staking pool creator
    address public poolOwner;

    // Store the NFT contract address for the staked NFTs
    address public immutable nftCollection;

    // Store the staking lock-in period if there is one set by the creator
    uint256 public lockInPeriod;

    // Store the reward value distributed per cycle.
    uint256 public rewardRate;

    // Store the length of the reward distribution cycle.
    uint256 public rewardFrequency;

    // Flag to indicate if backed values are in use.
    bool public isBackedValue;

    // Store a record of all the token IDs that are eligible to be staked in
    // this pool
    mapping(uint256 => StakedNFT) public stakedNFTs;

    // StakedNFT object that stores all the information about the staked NFT
    struct StakedNFT {
        bool isEligible;
        uint256 backedValue;
        address stakerAddress;
        uint256 timeOfStake;
    }
    
    // Emits event when the contract receives XDC
    event FundsReceived(
        address indexed from,
        uint256 value
    );

    // Emits event when the contract receives an XRC-721 token
    event XRC721Received(
        address indexed operator,
        address indexed from,
        uint256 indexed tokenId
    );

    // Constructor that sets the NFT contract information, the list of eligible tokenIds for
    // the staking pool, the lock-in period, and the rewards and their frequency for staking the NFTs.
    constructor(
        address _nftCollection, 
        uint256[] memory _tokenIds, 
        uint256[] memory _backedValues, 
        uint256 _lockInPeriod,
        uint256 _rewardRate,
        uint256 _rewardFrequency
    ) {
        poolOwner = msg.sender;
        nftCollection = _nftCollection;
        _updateEligibleNFTs(_tokenIds);
        if(_backedValues.length != 0) {
            _updateBackedValues(_tokenIds, _backedValues);
            isBackedValue = true;
        }
        lockInPeriod = _lockInPeriod;
        rewardRate = _rewardRate;
        rewardFrequency = _rewardFrequency;
    }

    // Allow the owner of the staking pool to send funds to the contract.
    receive() external payable {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        emit FundsReceived(msg.sender, msg.value);
    }

    // Stake the NFT in the staking pool.
    function stake(
        uint256 _tokenId
    ) external nonReentrant {

        // Only the owners of the token ID can stake their NFTs
        if(IERC721(nftCollection).ownerOf(_tokenId) != msg.sender) {
            revert NotOwner(IERC721(nftCollection).ownerOf(_tokenId), msg.sender);
        }

        // Check if the token ID is eligible for staking in this pool
        if(!stakedNFTs[_tokenId].isEligible) {
            revert NotEligibleForStaking(_tokenId);
        }
        
        // Transfer the NFT from the wallet address to the staking pool
        IERC721(nftCollection).safeTransferFrom(msg.sender, address(this), _tokenId);

        // Add the staker address to the records
        stakedNFTs[_tokenId].stakerAddress = msg.sender;

        // Update the time of stake for the staked NFT
        stakedNFTs[_tokenId].timeOfStake = block.timestamp;
    }

    // Withdraw the staked NFT and send it back to the staker.
    function withdraw(
        uint256 _tokenId
    ) external nonReentrant {

        // Only allow the staker to withdraw their NFT
        if(stakedNFTs[_tokenId].stakerAddress != msg.sender) {
            revert NotOwner(stakedNFTs[_tokenId].stakerAddress, msg.sender);
        }
        
        // Only allow the staker to withdraw their NFT after lock-in period ends
        if((stakedNFTs[_tokenId].timeOfStake + lockInPeriod) > block.timestamp) {
            revert StillLockedIn(stakedNFTs[_tokenId].timeOfStake + lockInPeriod, block.timestamp);
        }

        // Transfer the NFT from the staking pool back to the staker
        IERC721(nftCollection).safeTransferFrom(address(this), msg.sender, _tokenId);

        // Reset the staker address to the null address
        stakedNFTs[_tokenId].stakerAddress = address(0);

        // Reset the time of stake to 0
        stakedNFTs[_tokenId].timeOfStake = 0;
    }

    // Check the eligibility of the token to be staked in this pool.
    function checkEligibility(
        uint256 _tokenId
    ) external view returns(bool) {
        return stakedNFTs[_tokenId].isEligible;
    }

    // Check the backed value of the token in this pool.
    function checkBackedValue(
        uint256 _tokenId
    ) external view returns(uint256) {
        return stakedNFTs[_tokenId].backedValue;
    }

    // Check the staker address of the token in this pool.
    function checkStakerAddress(
        uint256 _tokenId
    ) external view returns(address) {
        return stakedNFTs[_tokenId].stakerAddress;
    }

    // Check the time when the token was staked in this pool.
    function checkTimeOfStake(
        uint256 _tokenId
    ) external view returns(uint256) {
        return stakedNFTs[_tokenId].timeOfStake;
    }

    // Return the balance of XDC of the smart contract.
    function balanceOf() external view returns(uint256){
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        return address(this).balance;
    }

    // Allow only the pool owner to update the pool owner address.
    function updatePoolOwner(
        address _poolOwner
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        poolOwner = _poolOwner;
    }

    // Allow only the pool owner to update the lock-in period.
    function updateLockInPeriod(
        uint256 _lockInPeriod
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        lockInPeriod = _lockInPeriod;
    }

    // Allow only the pool owner to update the eligibility of the NFTs in the
    // staking pool.
    function updateEligibility(
        uint256[] memory _tokenIds, 
        bool[] memory _eligibility
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].isEligible = _eligibility[i];
        }
    }

    // Allow only the pool owner to update the backed values of the NFTs in the
    // staking pool.
    function updateBackedValues(
        uint256[] memory _tokenIds, 
        uint256[] memory _backedValues
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].backedValue = _backedValues[i];
        }
    }

    // Update the eligible NFTs record for the staking pool with a user-provided list of
    // token IDs.
    function _updateEligibleNFTs(
        uint256[] memory _tokenIds
    ) internal {
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].isEligible = true;
        }
    }

    // Update the backed values for the staking pool with a user-provided list of
    // backed values.
    function _updateBackedValues(
        uint256[] memory _tokenIds, 
        uint256[] memory _backedValues
    ) internal {
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].backedValue = _backedValues[i];
        }
    }

    // Override method for the IERC721Receiver implementation.
    function onERC721Received(
        address operator, 
        address from, 
        uint256 tokenId, 
        bytes memory
    ) public virtual override returns (bytes4) {
            emit XRC721Received(operator, from, tokenId);
            return this.onERC721Received.selector;
        }
}