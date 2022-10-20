//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

error NotOwner(address owner, address sender);
error NotEligibleForStaking(uint256 tokenId);

error NoNFTsStaked(address sender);
error NoRewardsLeft(uint256 rewards);

contract XDSea721Staking is ReentrancyGuard, IERC721Receiver {

    // Allows the usage of safe functions for XRC20 tokens
    using SafeERC20 for IERC20;

    // Store the NFT contract address for the staked NFTs
    address public immutable nftCollection;

    // Store the staking lock-in period if there is one set by the creator
    uint256 public immutable lockInPeriod;

    // Store a record of all the token IDs that are eligible to be staked in
    // this pool.
    mapping(uint256 => bool) public eligibleTokenIds;

    // Emits event when the contract receives an XRC-721 token
    event XRC721Received(
        address indexed operator,
        address indexed from,
        uint256 indexed tokenId
    );

    // Represents the NFTs that are currently staked for this pool
    struct StakedNFT {
        address staker;
        uint256 tokenId;
    }

    // Represents the Staker of an NFT
    struct Staker {

        // Number of NFTs staked from this collection
        uint256 amountStaked;

        // List of the staked NFTs
        StakedNFT[] stakedNFTs;

        // Last time rewards were claimed for this staker
        uint256 timeOfLastClaim;

        // Unclaimed rewards for this staker
        uint256 unclaimedRewards;
    }

    // Rewards rate set by the creator of the staking pool
    uint256 private rewardsRate;

    // Reward frequency options
    enum RewardsFrequency {
        HOURS,
        DAYS,
        WEEKS,
        MONTHS,
        YEARS
    }

    // Reward frequency set by the creator of the staking pool
    RewardsFrequency private rewardsFrequency;

    // Mapping of wallet addresses to the stakers of the pool
    mapping(address => Staker) public stakers;

    // Mapping of token ID to stakers
    mapping(uint256 => address) public stakerAddress;

    // Constructor that sets the NFT contract information, the list of eligible tokenIds for
    // the staking pool, the lock-in period, and the rewards and their frequency for staking the NFTs.
    constructor(address _nftCollection, uint256[] memory _tokenIds, uint256 _lockInPeriod, uint256 _rewards, RewardsFrequency _rewardsFrequency ) {
        nftCollection = _nftCollection;
        _updateEligibleNFTs(_tokenIds);
        lockInPeriod = _lockInPeriod;

        rewardsRate = _rewards;
        rewardsFrequency = _rewardsFrequency;
    }

    // Increment the amount staked and store the sender information for reward payouts
    // and recording the address where the token is to be sent back.
    function stake(uint256 _tokenId) external nonReentrant {

        // Only the owners of the token ID can stake their NFTs
        if(IERC721(nftCollection).ownerOf(_tokenId) != msg.sender) {
            revert NotOwner(IERC721(nftCollection).ownerOf(_tokenId), msg.sender);
        }

        // Check if the token ID is eligible for staking in this pool
        if(!eligibleTokenIds[_tokenId]) {
            revert NotEligibleForStaking(_tokenId);
        }


        // Transfer the NFT to the staking pool
        IERC721(nftCollection).safeTransferFrom(msg.sender, address(this), _tokenId);

        // Create StakedNFT record
        StakedNFT memory stakedNFT = StakedNFT(msg.sender, _tokenId);

        // Add the token to the staked NFTs array
        stakers[msg.sender].stakedNFTs.push(stakedNFT);

        // Increment the amount staked for this address
        stakers[msg.sender].amountStaked++;

        // Update the records to reflect who the payee is for a given token
        stakerAddress[_tokenId] = msg.sender;
    }

    // Update the eligible NFTs record for the staking pool with a user-provided list of
    // token IDs.
    function _updateEligibleNFTs(uint256[] memory _tokenIds) internal {
        for(uint i = 0; i < _tokenIds.length; i++) {
            eligibleTokenIds[_tokenIds[i]] = true;
        }
    }

    // Override method for the IERC721Receiver implementation.
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory)
        public virtual override returns (bytes4) {
            emit XRC721Received(operator, from, tokenId);
            return this.onERC721Received.selector;
        }

    // Calculate the rewards for the NFT to be withdrawn and update the unclaimed
    // rewards for the msg.sender, decrement the amount of staked NFTs for the
    // sender, and transfer the NFT back to the staker.
    function withdraw(uint256 _tokenId) external nonReentrant {

        // Allow only the owner of the token to withdraw the staked NFT
        if(stakerAddress[_tokenId] != msg.sender) {
            revert NotOwner(stakerAddress[_tokenId], msg.sender);
        }

        // Allow only senders who have staked NFTs to withdraw them
        if(stakers[msg.sender].amountStaked <= 0) {
            revert NoNFTsStaked(msg.sender);
        }

        if(stakers[msg.sender].stakedNFTs[])

        // Calculate the rewards for the withdrawn NFT and update the records
        // to allow the staker to claim them later
        uint256 rewards = _calculateRewards(msg.sender);
        stakers[msg.sender].unclaimedRewards += rewards;

        // Find the index of the NFT to be withdrawn from the staker records
        uint256 index = 0;
        for(uint256 i = 0; i < stakers[msg.sender].stakedNFTs.length; i++) {
            if(stakers[msg.sender].stakedNFTs[i].tokenId == _tokenId &&
                stakers[msg.sender].stakedNFTs[i].staker != address(0)
            ) {
                index = i;
                break;
            }
        }

        // Update the staker NFT address to the null address
        stakers[msg.sender].stakedNFTs[index].staker = address(0);

        // Update the count of NFTs staked by the staker
        stakers[msg.sender].amountStaked--;

        // Update records to reflect that the token ID of the withdrawn NFT is
        // not staked any more
        stakerAddress[_tokenId] = address(0);

        // Transfer the NFT back to the staker
        IERC721(nftCollection).safeTransferFrom(address(this), msg.sender, _tokenId);
    }

    // Calculate the rewards for the msg.sender and if there are any rewards available,
    // transfer the funds to the staker.
    function claimRewards() external {
        uint256 rewards = _calculateRewards(msg.sender) + 
            stakers[msg.sender].unclaimedRewards;
        if(rewards <= 0) {
            revert NoRewardsLeft(rewards);
        }
        stakers[msg.sender].timeOfLastClaim = block.timestamp;
        stakers[msg.sender].unclaimedRewards = 0;
        payable(msg.sender).transfer(rewards);
    }

    // Calculate the rewards for the staker based on the rewards rate and the time staked.
    function _calculateRewards(address _staker) internal view returns(uint256) {
        return (((((block.timestamp - stakers[_staker].timeOfLastClaim) * stakers[_staker].amountStaked)) * rewardsRate) / 3600);
    }
}