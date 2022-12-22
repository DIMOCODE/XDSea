import Xdc3 from "xdc3";
import { nftaddress, nftmarketaddress, nftmarketlayeraddress } from "./config";
import { DEFAULT_PROVIDER, HEADER } from "./constant";
import NFT from "./abis/NFT.json";
import NFTMarket from "./abis/NFTMarket.json";
import NFTMarketLayer1 from "./abis/NFTMarketLayer1.json";
import XDSea721Staking from "./abis/XDSea721Staking.json";
import XRC20 from "./abis/XRC20.json";
import { GetWallet, SendTransaction } from "xdc-connect";
import { fromXdc, isXdc } from "./common/common";
import ARPCNFT from "./abis/ARPCNFT.json";

/**
 * Convert numbers with decimals to the correct wei amount
 * 
 * @param {number} value the amount of ether to be converted to wei
 * @returns the amount in wei
 */
const countDecimals = (value) => {
  var zeroes = 18;
  var decimal = 0;
  if (Math.floor(value.valueOf()) === value.valueOf()) decimal = 0;
  else {
    decimal = value.toString().split(".")[1].length;
  }
  var suffix = "";
  for (var i = 0; i < zeroes - decimal; i++) {
    suffix += "0";
  }
  var amount = 0
  if (decimal !== 0)
    amount =
      value.toString().split(".")[0] + value.toString().split(".")[1] + suffix;
  else amount = value.toString().split(".")[0] + suffix;
  return amount;
};

/**
 * Buy a specific NFT
 * 
 * @param {*} nft the NFT to be bought
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const BuyNFT = async (nft, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
    const contract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nft.marketAddress,
      wallet
    );
    var item = await contract.methods.idToMarketItem(nft.tokenId).call();
    var price = item.price;
    const xdcPrice = await xdc3.utils.fromWei(price, "ether");
    var numToString = (xdcPrice * 102) / 100;
    var marketplacefee = await xdc3.utils.toBN(countDecimals(numToString));

    var data = await contract.methods
      .createMarketSale(nftaddress, nft.tokenId)
      .encodeABI();

    const tx = {
      from: wallet,
      to: nft.marketAddress,
      value: marketplacefee,
      data: data,
    };

    var gasLimit = await xdc3.eth.estimateGas(tx);

    tx["gas"] = gasLimit;

    await SendTransaction(tx);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Buy a specific NFT using the old marketplace contract
 * 
 * @param {*} nft the NFT to be bought
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const LegacyBuyNFT = async (nft, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
    const contract = new xdc3.eth.Contract(
      NFTMarket.abi,
      nftmarketaddress,
      wallet
    );
    var item = await contract.methods.idToMarketItem(nft.itemId).call();
    var price = item.price;
    const xdcPrice = await xdc3.utils.fromWei(price, "ether");
    var numToString = (xdcPrice * 102) / 100;
    var marketplacefee = await xdc3.utils.toBN(countDecimals(numToString));

    var data = await contract.methods
      .createMarketSale(nftaddress, nft.itemId)
      .encodeABI();

    const tx = {
      from: wallet,
      to: nftmarketaddress,
      value: marketplacefee,
      data: data,
    };

    var gasLimit = await xdc3.eth.estimateGas(tx);

    tx["gas"] = gasLimit;

    await SendTransaction(tx);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * List a specific NFT
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {*} sellData the NFT to be listed
 * @param {number} sellPrice the amount for which the NFT is to be listed
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const SellNFT = async (approved, sellData, sellPrice, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);
      var appData = nftContract.methods
        .setApprovalForAll(sellData.marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const price = await xdc3.utils.toWei(sellPrice, "ether");

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      sellData.marketAddress,
      wallet
    );

    let data = contract2.methods
      .listItem(nftaddress, sellData.tokenId, price)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: sellData.marketAddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Withdraw a specific NFT Listing
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {*} nft the NFT Listing to be withdrawn
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const WithdrawListing = async (approved, nft, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nft.marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nft.marketAddress,
      wallet
    );

    let data = contract2.methods
      .withdrawListing(nftaddress, nft.tokenId)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: nft.marketAddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Withdraw a specific NFT Listing using the old marketplace contract
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {*} nft the NFT Listing to be withdrawn
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const LegacyWithdrawListing = async (approved, nft, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketaddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarket.abi,
      nftmarketaddress,
      wallet
    );

    let data = contract2.methods
      .withdrawListing(nftaddress, nft.itemId)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: nftmarketaddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Transfer a specific NFT to a given address
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {*} transferNFT the NFT to be transferred
 * @param {string} transferAddress the wallet address the NFT is to be transferred to
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const TransferNFT = async (approved, transferNFT, transferAddress, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      console.log(transferNFT.marketAddress)
      
      var appData = nftContract.methods
        .setApprovalForAll(transferNFT.marketAddress, true)
        .encodeABI();

      console.log(wallet, nftaddress)

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      transferNFT.marketAddress,
      wallet
    );

    let data = contract2.methods
      .transferNFT(nftaddress, transferNFT.tokenId, transferAddress)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: transferNFT.marketAddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Place an offer on a specific NFT
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {*} offerNFT the NFT on which the offer is being placed
 * @param {number} offerPrice the offer amount
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const Offer = async (approved, offerNFT, offerPrice, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(offerNFT.marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      offerNFT.marketAddress,
      wallet
    );

    const price = await xdc3.utils.toWei(offerPrice, "ether");

    let data = contract2.methods
      .placeOffer(offerNFT.tokenId, price)
      .encodeABI();

    var numToString = (offerPrice * 102) / 100;
    var marketplacefee = await xdc3.utils.toBN(countDecimals(numToString));

    const tx2 = {
      from: wallet,
      to: offerNFT.marketAddress,
      value: marketplacefee,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Withdraw a specific offer made on a given NFT
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {number} tokenId the token ID of the NFT on which the offer is placed
 * @param {number} offerId the offer ID of the offer that is to be withdrawn
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const WithdrawOffer = async (approved, tokenId, offerId, wallet, marketAddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      marketAddress,
      wallet
    );

    let data = contract2.methods.withdrawOffer(tokenId, offerId).encodeABI();

    const tx2 = {
      from: wallet,
      to: marketAddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Accept a specific offer made on a given NFT
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {number} tokenId the token ID of the NFT on which the offer is placed
 * @param {number} offerId the offer ID of the offer that is to be accepted
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const AcceptOffer = async (approved, tokenId, offerId, wallet, marketAddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      marketAddress,
      wallet
    );

    let data = contract2.methods.acceptOffer(tokenId, offerId).encodeABI();

    const tx2 = {
      from: wallet,
      to: marketAddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Edit a specific NFT Listing and update the price
 * 
 * @param {boolean} approved check user approval of the marketplace
 * @param {*} sellData the NFT Listing to be edited
 * @param {number} sellPrice the edited price of the listing
 * @param {string} wallet the wallet address of the user
 * @returns true if the transaction is successful, false if not
 */
export const EditNFT = async (approved, sellData, sellPrice, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(sellData.marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const price = await xdc3.utils.toWei(sellPrice, "ether");

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      sellData.marketAddress,
      wallet
    );

    let data = contract2.methods
      .editListing(sellData.tokenId, price)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: sellData.marketAddress,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const StakeNFT = async(stakingContract, tokenId, wallet) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

    var appData = nftContract.methods
      .approve(stakingContract, tokenId)
      .encodeABI();

    const tx1 = {
      from: wallet,
      to: nftaddress,
      data: appData,
    };

    var gasLimit = await xdc3.eth.estimateGas(tx1);

    tx1["gas"] = gasLimit;

    await SendTransaction(tx1);

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .stake(tokenId)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const WithdrawStake = async(stakingContract, tokenId, wallet) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .withdraw(tokenId)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const ClaimRewards = async(stakingContract, tokenId, rewardContract, wallet) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .claimRewards(tokenId, rewardContract)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const DepositFunds = async(stakingContract, wallet, amount, erc20address) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (erc20address !== "0x0000000000000000000000000000000000000000") {
      const erc20contract = new xdc3.eth.Contract(XRC20.abi, erc20address);

      var appData = erc20contract.methods
        .approve(stakingContract, amount)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: erc20address,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
    }

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );
    
    var price = xdc3.utils.toWei(amount);
    if(erc20address !== "0x0000000000000000000000000000000000000000") {
      price /= 1000;
    }

    let data = contract2.methods
      .depositFunds(price, erc20address)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      value: price,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const WithdrawFunds = async(stakingContract, wallet, amount, erc20address) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    var price = xdc3.utils.toWei(amount);
    if(erc20address !== "0x0000000000000000000000000000000000000000") {
      price /= 1000;
    }

    let data = contract2.methods
      .withdrawFunds(price, erc20address)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const SaveAllRewards = async(stakingContract, wallet, poolTime, rewardContract) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .saveAllRewards(poolTime, rewardContract)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const SaveRewardsForTokenID = async(stakingContract, wallet, poolTime, rewardContract, tokenId) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .saveRewardsForTokenID(poolTime, rewardContract, tokenId)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const UpdateLockInPeriod = async(stakingContract, wallet, lockInPeriod) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .updateLockInPeriod(lockInPeriod)
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const UpdateEligibility = async(stakingContract, wallet, tokenId, isEligible) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .updateEligibility([tokenId], [isEligible])
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const UpdateBackedValues = async(stakingContract, wallet, tokenId, backedValue) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .updateBackedValues([tokenId], [backedValue])
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const UpdateRewards = async(stakingContract, wallet, erc20address, rewardRate, rewardFrequency, rewardType, startTime) => {
  try{
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    const contract2 = new xdc3.eth.Contract(
      XDSea721Staking.abi,
      stakingContract,
      wallet
    );

    let data = contract2.methods
      .setRewards([erc20address], [rewardRate], [rewardFrequency], [rewardType], [startTime])
      .encodeABI();

    const tx2 = {
      from: wallet,
      to: stakingContract,
      data,
    };

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    await SendTransaction(tx2);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Check if the file is an image
 * 
 * @param {string} fileType MIME type of the file
 * @returns true if the file is an image, false if not
 */
export const isImage = (fileType) => {
  return !!fileType?.match("image.*");
};

/**
 * Check if the file is an video
 * 
 * @param {string} fileType MIME type of the file
 * @returns true if the file is a video, false if not
 */
export const isVideo = (fileType) => {
  return !!fileType?.match("video.*");
};

/**
 * Check if the file is an audio file
 * 
 * @param {string} fileType MIME type of the file
 * @returns true if the file is an audio file, false if not
 */
export const isAudio = (fileType) => {
  return !!fileType?.match("audio.*");
};
