//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error NotPoolOwner(address owner, address sender);
error NotOwner(address owner, address sender);
error NotEligibleForStaking(uint256 tokenId);
error StillLockedIn(uint256 lockInEnd, uint256 currentTime);
error BackedValueNotSet();
error BackedValueAlreadySet();
error LengthMismatch(uint256 tokenIdLength, uint256 backedValueLength);
error NotTheCorrectContractAddress(address given);
error NFTNotStaked(uint256 _tokenId);
error NotEnoughBalance(uint256 balance, uint256 reward);

contract XDSea721Staking is ReentrancyGuard, IERC721Receiver, IERC1155Receiver {

    // Allows the usage of safe functions for XRC20 tokens
    using SafeERC20 for IERC20;

    address public marketplaceAddress = 0x43174a2Cf9b214D9036eD73EFB7E36395FB86344;

    // Store the address of the staking pool creator
    address public poolOwner;

    // Store the NFT contract address for the staked NFTs
    address public immutable nftCollection;

    // Store the staking lock-in period if there is one set by the creator
    uint256 public lockInPeriod;

    // Flag to indicate if backed values are in use.
    bool public isBackedValue;

    // Store a record of all the token IDs that are eligible to be staked in
    // this pool
    mapping(uint256 => StakedNFT) public stakedNFTs;

    // Store a record of all the reward types that are awarded to stakers in
    // this pool
    Reward[] public rewards;

    // Store the time from which the creator wishes to have rewards enabled.
    uint256 public timeOfPoolInitialization;

    // StakedNFT object that stores all the information about the staked NFT
    struct StakedNFT {
        bool isEligible;
        uint256 backedValue;
        address stakerAddress;
        uint256 timeOfStake;
        uint256 timeOfLastClaim;
    }

    // Reward object that stores all the information about the rewards offered
    // by this staking pool
    struct Reward {
        address tokenContract;
        uint256 rewardRate;
        uint256 rewardFrequency;
        RewardType rewardType;
    }

    // Enumeration of all the reward types offered by the staking pool
    enum RewardType {
        Coin,
        Token
    }
    
    // Emits event when the contract receives XDC
    event FundsReceived(
        address indexed from,
        address indexed contractAddress,
        uint256 value
    );

    // Emits event when the contract receives an XRC-721 token
    event XRC721Received(
        address indexed operator,
        address indexed from,
        uint256 indexed tokenId
    );

    // Emits event when the contract receives an XRC-1155 token
    event XRC1155Received(
        address indexed operator,
        address indexed from,
        uint256 indexed id,
        uint256 value
    );

    // Emits event when the contract receives a batch of XRC-1155 tokens
    event XRC1155BatchReceived(
        address indexed operator,
        address indexed from,
        uint256[] ids,
        uint256[] values
    );

    // Constructor that sets the NFT contract information, the list of eligible tokenIds for
    // the staking pool, the lock-in period, and the rewards and their frequency for staking the NFTs.
    constructor(
        address _nftCollection, 
        uint256[] memory _tokenIds, 
        uint256[] memory _backedValues, 
        uint256 _lockInPeriod,
        uint256 _timeOfPoolInitialization
    ) {
        poolOwner = msg.sender;
        nftCollection = _nftCollection;
        _updateEligibleNFTs(_tokenIds);
        if(_backedValues.length != 0) {
            if(_tokenIds.length != _backedValues.length) {
                revert LengthMismatch(_tokenIds.length, _backedValues.length);
            }
            _updateBackedValues(_tokenIds, _backedValues);
            isBackedValue = true;
        }
        lockInPeriod = _lockInPeriod;
        timeOfPoolInitialization = _timeOfPoolInitialization;
    }

    // Allow the owner of the staking pool to send funds to the contract.
    receive() external payable {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        emit FundsReceived(msg.sender, address(0), msg.value);
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

        // Update the time of stake and time of last claim for the staked NFT
        stakedNFTs[_tokenId].timeOfStake = block.timestamp;
        if(stakedNFTs[_tokenId].timeOfLastClaim == 0) {
            stakedNFTs[_tokenId].timeOfLastClaim = timeOfPoolInitialization;
        }   
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
        
        // Get the duration for which the NFT has been staked since the last claim
        uint256 claimDuration = block.timestamp - stakedNFTs[_tokenId].timeOfLastClaim;

        // Get the number of reward cycles completed by the staked NFT
        uint256 claimCycles = claimDuration / rewards[0].rewardFrequency;

        // For all the different reward types in the staking pool
        for(uint i = 0; i < rewards.length; i++) {

            // If backed value-based distribution of rewards is enabled
            if(isBackedValue) {
                uint256 rewardValue = SafeMath.div(claimCycles * (rewards[i].rewardRate * (stakedNFTs[_tokenId].backedValue / 1 ether)), 10000);
                if(rewards[i].rewardType == RewardType.Coin) {
                    if(address(this).balance < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(address(this).balance, SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    payable(marketplaceAddress).transfer(SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    payable(msg.sender).transfer(rewardValue);
                }
                else {
                    if(IERC20(rewards[i].tokenContract).balanceOf(address(this)) < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(IERC20(rewards[i].tokenContract).balanceOf(address(this)), SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    IERC20(rewards[i].tokenContract).safeTransfer(marketplaceAddress, SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    IERC20(rewards[i].tokenContract).safeTransfer(msg.sender, rewardValue);
                }
            }
            else {
                uint256 rewardValue = SafeMath.div(claimCycles * rewards[i].rewardRate, 10000);
                if(rewards[i].rewardType == RewardType.Coin) {
                    if(address(this).balance < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(address(this).balance, SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    payable(marketplaceAddress).transfer(SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    payable(msg.sender).transfer(rewardValue);
                }
                else {
                    if(IERC20(rewards[i].tokenContract).balanceOf(address(this)) < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(IERC20(rewards[i].tokenContract).balanceOf(address(this)), SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    IERC20(rewards[i].tokenContract).safeTransfer(marketplaceAddress, SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    IERC20(rewards[i].tokenContract).safeTransfer(msg.sender, rewardValue);
                }
            }
        }

        // Update the time of the last claim for the staked NFT
        stakedNFTs[_tokenId].timeOfLastClaim = stakedNFTs[_tokenId].timeOfLastClaim + SafeMath.mul(claimCycles, rewards[0].rewardFrequency);

        // Transfer the NFT from the staking pool back to the staker
        IERC721(nftCollection).safeTransferFrom(address(this), msg.sender, _tokenId);

        // Reset the staker address to the null address
        stakedNFTs[_tokenId].stakerAddress = address(0);

        // Reset the time of stake to 0
        stakedNFTs[_tokenId].timeOfStake = 0;
    }

    // Calculate the rewards for each of the reward types.
    function calculateRewards(
        uint256 _tokenId
    ) external view returns(uint256[] memory) {

        // Only calculate rewards for staked NFTs
        if(stakedNFTs[_tokenId].timeOfLastClaim == 0) {
            revert NFTNotStaked(_tokenId);
        }

        // Get the duration for which the NFT has been staked
        uint256 stakeDuration = block.timestamp - stakedNFTs[_tokenId].timeOfLastClaim;

        uint256[] memory rewardReturns = new uint256[](rewards.length);

        // For all the different reward types in the staking pool
        for(uint i = 0; i < rewards.length; i++) {

            // Get the number of reward cycles completed by the staked NFT
            uint256 stakeCycles = stakeDuration / rewards[i].rewardFrequency;

            // If backed value-based distribution of rewards is enabled
            if(isBackedValue) {
                rewardReturns[i] = SafeMath.div(stakeCycles * (rewards[i].rewardRate * (stakedNFTs[_tokenId].backedValue / 1 ether)), 10000);
            }
            else {
                rewardReturns[i] = SafeMath.div(stakeCycles * rewards[i].rewardRate, 10000);
            }
        }

        // Return an array of rewards for each of the reward types
        return rewardReturns;
    }

    // Let the stakers claim staking rewards for their staked NFT.
    function claimRewards(
        uint256 _tokenId
    ) external nonReentrant {

        // Only allow rewards to be claimed for staked NFTs
        if(stakedNFTs[_tokenId].timeOfLastClaim == 0) {
            revert NFTNotStaked(_tokenId);
        }

        // Only allow the owner of the staked NFT to claim rewards
        if(msg.sender != stakedNFTs[_tokenId].stakerAddress) {
            revert NotOwner(stakedNFTs[_tokenId].stakerAddress, msg.sender);
        }

        // Get the duration for which the NFT has been staked since the last claim
        uint256 claimDuration = block.timestamp - stakedNFTs[_tokenId].timeOfLastClaim;

        // Get the number of reward cycles completed by the staked NFT
        uint256 claimCycles = claimDuration / rewards[0].rewardFrequency;

        // For all the different reward types in the staking pool
        for(uint i = 0; i < rewards.length; i++) {

            // If backed value-based distribution of rewards is enabled
            if(isBackedValue) {
                uint256 rewardValue = SafeMath.div(claimCycles * (rewards[i].rewardRate * (stakedNFTs[_tokenId].backedValue / 1 ether)), 10000);
                if(rewards[i].rewardType == RewardType.Coin) {
                    if(address(this).balance < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(address(this).balance, SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    payable(marketplaceAddress).transfer(SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    payable(msg.sender).transfer(rewardValue);
                }
                else {
                    if(IERC20(rewards[i].tokenContract).balanceOf(address(this)) < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(IERC20(rewards[i].tokenContract).balanceOf(address(this)), SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    IERC20(rewards[i].tokenContract).safeTransfer(marketplaceAddress, SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    IERC20(rewards[i].tokenContract).safeTransfer(msg.sender, rewardValue);
                }
            }
            else {
                uint256 rewardValue = SafeMath.div(claimCycles * rewards[i].rewardRate, 10000);
                if(rewards[i].rewardType == RewardType.Coin) {
                    if(address(this).balance < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(address(this).balance, SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    payable(marketplaceAddress).transfer(SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    payable(msg.sender).transfer(rewardValue);
                }
                else {
                    if(IERC20(rewards[i].tokenContract).balanceOf(address(this)) < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                        revert NotEnoughBalance(IERC20(rewards[i].tokenContract).balanceOf(address(this)), SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                    }
                    IERC20(rewards[i].tokenContract).safeTransfer(marketplaceAddress, SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                    IERC20(rewards[i].tokenContract).safeTransfer(msg.sender, rewardValue);
                }
            }
        }

        // Update the time of the last claim for the staked NFT
        stakedNFTs[_tokenId].timeOfLastClaim = stakedNFTs[_tokenId].timeOfLastClaim + SafeMath.mul(claimCycles, rewards[0].rewardFrequency);
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

    // Check the rewards awarded by the staking pool.
    function checkRewards() external view returns(Reward[] memory) {
        return rewards;
    }

    // Return the balance of XDC of the smart contract.
    function balanceOf() external view returns(uint256){
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        return address(this).balance;
    }

    // Allow only the pool owner to deposit coins and tokens to the contract.
    function depositFunds(
        uint256 amount,
        address erc20address
    ) external payable {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }

        // Match the value of the coins sent to the amount specified if coins are
        // the mode of deposit
        if(erc20address == address(0)) {
            if(msg.value != amount) {
                revert NotEnoughBalance(msg.value, amount);
            }

            emit FundsReceived(msg.sender, address(0), msg.value);
        }
        else{
            IERC20(erc20address).safeTransferFrom(msg.sender, address(this), amount);

            emit FundsReceived(msg.sender, erc20address, amount);
        }
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

    // Allow only the pool owner to update the time of pool initialization i.e.,
    // time from which the rewards are initially distributed.
    function updateTimeOfPoolInitialization(
        uint256 _timeOfPoolInitialization
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        timeOfPoolInitialization = _timeOfPoolInitialization;
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

    // Allow only the pool owner to add the backed values of the NFTs in the
    // staking pool.
    function addBackedValues(
        uint256[] memory _tokenIds,
        uint256[] memory _backedValues
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        if(isBackedValue) {
            revert BackedValueAlreadySet();
        }
        if(_tokenIds.length != _backedValues.length) {
            revert LengthMismatch(_tokenIds.length, _backedValues.length);
        }
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].backedValue = _backedValues[i];
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
        if(!isBackedValue) {
            revert BackedValueNotSet();
        }
        if(_tokenIds.length != _backedValues.length) {
            revert LengthMismatch(_tokenIds.length, _backedValues.length);
        }
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].backedValue = _backedValues[i];
        }
    }

    // Allow only the pool owner to remove the backed values of the NFTs in the
    // staking pool.
    function removeBackedValues(
        uint256[] memory _tokenIds
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        if(!isBackedValue) {
            revert BackedValueNotSet();
        }
        isBackedValue = false;
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].backedValue = 0;
        }
    }

    // Allow only the pool owner to set rewards for the staking pool.
    function setRewards(
        address[] memory _tokenAddresses,
        uint256[] memory _rewardRates,
        uint256[] memory _rewardFrequencies,
        uint256[] memory _rewardTypes
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        if(_tokenAddresses.length != _rewardRates.length) {
            revert LengthMismatch(_tokenAddresses.length, _rewardRates.length);
        }
        else if(_tokenAddresses.length != _rewardFrequencies.length) {
            revert LengthMismatch(_tokenAddresses.length, _rewardFrequencies.length);
        }
        else if(_rewardRates.length != _rewardFrequencies.length) {
            revert LengthMismatch(_rewardRates.length, _rewardFrequencies.length);
        }
        else if(_tokenAddresses.length != _rewardTypes.length) {
            revert LengthMismatch(_tokenAddresses.length, _rewardTypes.length);
        }
        else if(_rewardRates.length != _rewardTypes.length) {
            revert LengthMismatch(_rewardRates.length, _rewardTypes.length);
        }
        else if(_rewardFrequencies.length != _rewardTypes.length) {
            revert LengthMismatch(_rewardFrequencies.length, _rewardTypes.length);
        }
        else {
            for(uint i = 0; i < _tokenAddresses.length; i++) {
                RewardType rewardType = RewardType.Coin;
                if(_rewardTypes[i] == 0) {
                    if(_tokenAddresses[i] != address(0)) {
                        revert NotTheCorrectContractAddress(_tokenAddresses[i]);
                    }
                    rewardType = RewardType.Coin;
                }
                else {
                    IERC20 token = IERC20(_tokenAddresses[i]);
                    token.totalSupply();
                    rewardType = RewardType.Token;                   
                }
                Reward memory reward = Reward(_tokenAddresses[i], _rewardRates[i], _rewardFrequencies[i], rewardType);
                rewards.push(reward);
            }
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

    // Override method for the IERC1155Receiver implementation.
    function onERC1155Received(address operator, address from, uint256 tokenId, uint256 value, bytes memory)
        public virtual override returns (bytes4) {
            emit XRC1155Received(operator, from, tokenId, value);
            return this.onERC1155Received.selector;
        }

    // Override method for the IERC1155Receiver implementation.
    function onERC1155BatchReceived(address operator, address from, uint256[] memory tokenIds, uint256[] memory values, bytes memory)
        public virtual override returns (bytes4) {
            emit XRC1155BatchReceived(operator, from, tokenIds, values);
            return this.onERC1155BatchReceived.selector;
        }

    // Override method for the IERC1155Receiver implementation.
    function supportsInterface(bytes4 interfaceID) external override pure returns (bool) {
      return  interfaceID == 0x01ffc9a7 ||    // ERC-165
              interfaceID == 0x150b7a02 ||    // ERC-721 Receiver
              interfaceID == 0x4e2312e0;      // ERC-1155 Receiver
    }
}