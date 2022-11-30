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

    uint256[] public eligibleNFTs;

    mapping(uint256 => mapping(address => uint256)) public timeOfLastClaims;

    mapping(uint256 => mapping(address => uint256)) public pendingRewards;

    // Store a record of all the reward types that are awarded to stakers in
    // this pool
    mapping(address => Reward) public rewards;

    // Store the time from which the creator wishes to have rewards enabled.
    uint256 public timeOfPoolInitialization;

    // StakedNFT object that stores all the information about the staked NFT
    struct StakedNFT {
        bool isEligible;
        uint256 backedValue;
        address stakerAddress;
        uint256 timeOfStake;
    }

    // Reward object that stores all the information about the rewards offered
    // by this staking pool
    struct Reward {
        address tokenContract;
        uint256 rewardRate;
        uint256 rewardFrequency;
        RewardType rewardType;
        uint256 startTime;
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

    // Allow only the pool owner to set rewards for the staking pool.
    function setRewards(
        address[] memory _tokenAddresses,
        uint256[] memory _rewardRates,
        uint256[] memory _rewardFrequencies,
        uint256[] memory _rewardTypes,
        uint256[] memory _startTimes
    ) external {
        if(msg.sender == poolOwner) {
            if(_tokenAddresses.length == _rewardRates.length && _tokenAddresses.length == _rewardFrequencies.length && 
            _rewardRates.length == _rewardFrequencies.length && _tokenAddresses.length == _rewardTypes.length && 
            _rewardRates.length == _rewardTypes.length && _rewardFrequencies.length == _rewardTypes.length &&
            _tokenAddresses.length == _startTimes.length && _rewardRates.length == _startTimes.length &&
            _rewardFrequencies.length == _startTimes.length && _rewardTypes.length == _startTimes.length) {
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
                    Reward memory reward = Reward(_tokenAddresses[i], _rewardRates[i], _rewardFrequencies[i], rewardType, _startTimes[i]);
                    rewards[_tokenAddresses[i]] = reward;
                }
            }
        }
    }

    // Save the rewards accumulated by all the eligible token IDs up to this point
    function saveAllRewards(
        uint256 _startTime,
        address _tokenContract
    ) external {
        for(uint i = 0; i < eligibleNFTs.length; i++) {

            uint256 lastClaim = timeOfLastClaims[eligibleNFTs[i]][_tokenContract];

            if(lastClaim == 0) {
                timeOfLastClaims[eligibleNFTs[i]][_tokenContract] = _startTime;
                lastClaim = _startTime;
            }
                
            // Get the duration for which the NFT has been staked
            uint256 stakeDuration = block.timestamp - lastClaim;

            // Get the number of reward cycles completed by the staked NFT
            uint256 stakeCycles = stakeDuration / rewards[_tokenContract].rewardFrequency;

            // If backed value-based distribution of rewards is enabled
            if(isBackedValue) {
                pendingRewards[eligibleNFTs[i]][_tokenContract] += SafeMath.div(stakeCycles * (rewards[_tokenContract].rewardRate * stakedNFTs[eligibleNFTs[i]].backedValue), 10000);
            }
            else {
                pendingRewards[eligibleNFTs[i]][_tokenContract] += SafeMath.div(stakeCycles * rewards[_tokenContract].rewardRate, 10000);
            }

            // Update the time of the last claim for the staked NFT
            timeOfLastClaims[eligibleNFTs[i]][_tokenContract] += SafeMath.mul(stakeCycles, rewards[_tokenContract].rewardFrequency);
        }
    }

    // Save the rewards accumulated by the given token ID up to this point
    function saveRewardsForTokenID(
        uint256 _startTime,
        address _tokenContract,
        uint256 _tokenId
    ) external {

        uint256 lastClaim = timeOfLastClaims[_tokenId][_tokenContract];

        if(lastClaim == 0) {
            timeOfLastClaims[_tokenId][_tokenContract] = _startTime;
            lastClaim = _startTime;
        }
            
        // Get the duration for which the NFT has been staked
        uint256 stakeDuration = block.timestamp - lastClaim;

        // Get the number of reward cycles completed by the staked NFT
        uint256 stakeCycles = stakeDuration / rewards[_tokenContract].rewardFrequency;

        // If backed value-based distribution of rewards is enabled
        if(isBackedValue) {
            pendingRewards[_tokenId][_tokenContract] += SafeMath.div(stakeCycles * (rewards[_tokenContract].rewardRate * stakedNFTs[_tokenId].backedValue), 10000);
        }
        else {
            pendingRewards[_tokenId][_tokenContract] += SafeMath.div(stakeCycles * rewards[_tokenContract].rewardRate, 10000);
        }

        // Update the time of the last claim for the staked NFT
        timeOfLastClaims[_tokenId][_tokenContract] += SafeMath.mul(stakeCycles, rewards[_tokenContract].rewardFrequency);
    }

    // Calculate the rewards for each of the reward types.
    function calculateRewards(
        uint256 _tokenId,
        address[] memory _rewards
    ) external view returns(uint256[] memory) {

        uint256[] memory rewardReturns = new uint256[](_rewards.length);

        // For all the different reward types in the staking pool
        for(uint i = 0; i < _rewards.length; i++) {

            if(stakedNFTs[_tokenId].isEligible) {
                // Get the duration for which the NFT has been staked
                uint256 stakeDuration = block.timestamp - timeOfLastClaims[_tokenId][_rewards[i]];

                // Get the number of reward cycles completed by the staked NFT
                uint256 stakeCycles = stakeDuration / rewards[_rewards[i]].rewardFrequency;

                // If backed value-based distribution of rewards is enabled
                if(isBackedValue) {
                    rewardReturns[i] = SafeMath.div(stakeCycles * (rewards[_rewards[i]].rewardRate * stakedNFTs[_tokenId].backedValue), 10000);
                }
                else {
                    rewardReturns[i] = SafeMath.div(stakeCycles * rewards[_rewards[i]].rewardRate, 10000);
                }
            }

            rewardReturns[i] += pendingRewards[_tokenId][_rewards[i]];
        }

        // Return an array of rewards for each of the reward types
        return rewardReturns;
    }

    // Allow the owner of the staking pool to send funds to the contract.
    receive() external payable {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        emit FundsReceived(msg.sender, address(0), msg.value);
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

    // Allow only the pool owner to withdraw coins and tokens from the contract.
    function withdrawFunds(
        uint256 amount,
        address erc20address
    ) external payable {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }

        if(erc20address == address(0)) {
            payable(poolOwner).transfer(amount);
        }
        else{
            IERC20(erc20address).safeTransfer(poolOwner, amount);
        }
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
            if(!_eligibility[i]) {
                _removeFromList(_tokenIds[i]);
            }
            else {
                eligibleNFTs.push(_tokenIds[i]);
            }
            stakedNFTs[_tokenIds[i]].isEligible = _eligibility[i];
        }
    }

    // Remove the token ID from the list of eligible NFTs
    function _removeFromList(uint256 _tokenId) internal {
        for(uint i = 0; i < eligibleNFTs.length; i++) {
            if(eligibleNFTs[i] == _tokenId) {
                eligibleNFTs[i] = eligibleNFTs[eligibleNFTs.length - 1];
                eligibleNFTs.pop();
            }
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
        if(_tokenIds.length != _backedValues.length) {
            revert LengthMismatch(_tokenIds.length, _backedValues.length);
        }
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].backedValue = _backedValues[i];
        }
    }

    // Allow only the pool owner to update the time the rewards for a given token
    // were claimed.
    function updateTimeOfLastClaim(
        uint256 _tokenId,
        address _tokenContract,
        uint256 _newTime
    ) external {
        if(msg.sender != poolOwner) {
            revert NotPoolOwner(poolOwner, msg.sender);
        }
        timeOfLastClaims[_tokenId][_tokenContract] = _newTime;
    }

    // Allow only the pool owner to remove the backed values of the NFTs in the
    // staking pool.
    function removeBackedValues() external {
        if(msg.sender == poolOwner) {
            if(isBackedValue) {
                isBackedValue = false;
            }
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

        // Add the staker address to the records
        stakedNFTs[_tokenId].stakerAddress = msg.sender;

        // Update the time of stake and time of last claim for the staked NFT
        stakedNFTs[_tokenId].timeOfStake = block.timestamp;
        
        // Transfer the NFT from the wallet address to the staking pool
        IERC721(nftCollection).safeTransferFrom(msg.sender, address(this), _tokenId);
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

    // Let the stakers claim staking rewards for their staked NFT.
    function claimRewards(
        uint256 _tokenId,
        address _tokenContract
    ) external nonReentrant {

        // Only allow rewards to be claimed for staked NFTs
        if(stakedNFTs[_tokenId].timeOfStake == 0) {
            revert NFTNotStaked(_tokenId);
        }

        // Only allow the owner of the staked NFT to claim rewards
        if(msg.sender != stakedNFTs[_tokenId].stakerAddress) {
            revert NotOwner(stakedNFTs[_tokenId].stakerAddress, msg.sender);
        }

        // Get the duration for which the NFT has been staked since the last claim
        uint256 claimDuration = block.timestamp - timeOfLastClaims[_tokenId][_tokenContract];

        // Get the number of reward cycles completed by the staked NFT
        uint256 claimCycles = claimDuration / rewards[_tokenContract].rewardFrequency;
        
        // If backed value-based distribution of rewards is enabled
        if(isBackedValue) {
            uint256 rewardValue = SafeMath.div(claimCycles * (rewards[_tokenContract].rewardRate * stakedNFTs[_tokenId].backedValue), 10000);
            if(stakedNFTs[_tokenId].isEligible) {
                rewardValue += pendingRewards[_tokenId][_tokenContract];
            }
            else {
                rewardValue = pendingRewards[_tokenId][_tokenContract];
            }
            if(rewards[_tokenContract].rewardType == RewardType.Coin) {
                rewardValue *= (10**18);
                if(address(this).balance < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                    revert NotEnoughBalance(address(this).balance, SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                }
                payable(marketplaceAddress).transfer(SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                payable(msg.sender).transfer(rewardValue);
            }
            else {
                if(IERC20(_tokenContract).balanceOf(address(this)) < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                    revert NotEnoughBalance(IERC20(_tokenContract).balanceOf(address(this)), SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                }
                IERC20(_tokenContract).safeTransfer(marketplaceAddress, SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                IERC20(_tokenContract).safeTransfer(msg.sender, rewardValue);
            }
        }
        else {
            uint256 rewardValue = SafeMath.div(claimCycles * rewards[_tokenContract].rewardRate, 10000);
            if(stakedNFTs[_tokenId].isEligible) {
                rewardValue += pendingRewards[_tokenId][_tokenContract];
            }
            else {
                rewardValue = pendingRewards[_tokenId][_tokenContract];
            }
            if(rewards[_tokenContract].rewardType == RewardType.Coin) {
                rewardValue *= (10**18);
                if(address(this).balance < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                    revert NotEnoughBalance(address(this).balance, SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                }
                payable(marketplaceAddress).transfer(SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                payable(msg.sender).transfer(rewardValue);
            }
            else {
                if(IERC20(_tokenContract).balanceOf(address(this)) < SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000)) {
                    revert NotEnoughBalance(IERC20(_tokenContract).balanceOf(address(this)), SafeMath.div(SafeMath.mul(rewardValue, 10100), 10000));
                }
                IERC20(_tokenContract).safeTransfer(marketplaceAddress, SafeMath.div(SafeMath.mul(rewardValue, 100), 10000));
                IERC20(_tokenContract).safeTransfer(msg.sender, rewardValue);
            }
        }

        // Update the time of the last claim for the staked NFT and reset the pending rewards
        timeOfLastClaims[_tokenId][_tokenContract] += SafeMath.mul(claimCycles, rewards[_tokenContract].rewardFrequency);
        pendingRewards[_tokenId][_tokenContract] = 0;
    }

    // Update the eligible NFTs record for the staking pool with a user-provided list of
    // token IDs.
    function _updateEligibleNFTs(
        uint256[] memory _tokenIds
    ) internal {
        for(uint i = 0; i < _tokenIds.length; i++) {
            stakedNFTs[_tokenIds[i]].isEligible = true;
            eligibleNFTs.push(_tokenIds[i]);
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