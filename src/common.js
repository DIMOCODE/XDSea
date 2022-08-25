import Xdc3 from "xdc3";
import { nftaddress, nftmarketaddress, nftmarketlayeraddress } from "./config";
import { DEFAULT_PROVIDER, HEADER } from "./constant";
import NFT from "./abis/NFT.json";
import NFTMarket from "./abis/NFTMarket.json";
import NFTMarketLayer1 from "./abis/NFTMarketLayer1.json";
import { GetWallet, SendTransaction } from "xdc-connect";
import { fromXdc, isXdc } from "./common/common";
import ARPCNFT from "./abis/ARPCNFT.json";

export const BuyNFT = async (nft, wallet, nftaddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    // console.log(nft)

    // const contract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
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

export const LegacyBuyNFT = async (nft, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    // console.log(nft)

    // const contract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
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

export const SellNFT = async (approved, sellData, sellPrice, wallet, nftaddress) => {
  try {
    // console.log(wallet, approved, sellData, sellPrice);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
    }

    // console.log(sellData.tokenId)

    const price = await xdc3.utils.toWei(sellPrice, "ether");

    // console.log(price, formattedWallet, nftaddress);

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, formattedWallet)
    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      sellData.marketAddress,
      wallet
    );
    // let tokenOwner = await contract2.methods.getOwnerOfToken(nftaddress, sellData.tokenId).call()
    // console.log(tokenOwner)

    let data = contract2.methods
      .listItem(nftaddress, sellData.tokenId, price)
      .encodeABI();

    // console.log(nft)

    // console.log(data);

    const tx2 = {
      from: wallet,
      to: sellData.marketAddress,
      data,
    };

    // console.log(tx2)

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    // console.log(tx2)

    await SendTransaction(tx2);

    return true;
    // console.log(transaction)
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const WithdrawListing = async (approved, nft, wallet, nftaddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
    }

    // console.log(nft.tokenId)

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
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

    // console.log(tx2)

    await SendTransaction(tx2);

    return true;
    // console.log(transaction)
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const LegacyWithdrawListing = async (approved, nft, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
    }

    // console.log(nft.tokenId)

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
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

    // console.log(tx2)

    await SendTransaction(tx2);

    return true;
    // console.log(transaction)
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const TransferNFT = async (approved, transferNFT, transferAddress, wallet, nftaddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    // console.log(wallet, approved, transferNFT, transferAddress);

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(nftaddress === "0x22222d61173b3b5be47965e19168b50f19826eee" ? ARPCNFT.abi : NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(transferNFT.marketAddress, true)
        .encodeABI();

      const tx1 = {
        from: wallet,
        to: nftaddress,
        data: appData,
      };

      var gasLimit = await xdc3.eth.estimateGas(tx1);

      tx1["gas"] = gasLimit;

      await SendTransaction(tx1);
      // console.log(trans)
    }

    // console.log(sellData.tokenId)

    // const price = await xdc3.utils.toWei(sellPrice, "ether")

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      transferNFT.marketAddress,
      wallet
    );
    // let tokenOwner = await contract2.methods.getOwnerOfToken(nftaddress, sellData.tokenId).call()
    // console.log(tokenOwner)
    let data = contract2.methods
      .transferNFT(nftaddress, transferNFT.tokenId, isXdc(transferAddress)
        ? fromXdc(transferAddress)
        : transferAddress)
      .encodeABI();

    // console.log(data);

    const tx2 = {
      from: wallet,
      to: transferNFT.marketAddress,
      data,
    };

    // console.log(tx2)

    var gasLimit2 = await xdc3.eth.estimateGas(tx2);

    tx2["gas"] = gasLimit2;

    // console.log(tx2)

    await SendTransaction(tx2);

    return true;
    // console.log(transaction)
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const Offer = async (approved, offerNFT, offerPrice, wallet, nftaddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
    }

    // console.log(sellData.tokenId)

    // const price = await xdc3.utils.toWei(sellPrice, "ether")

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      offerNFT.marketAddress,
      wallet
    );
    // let tokenOwner = await contract2.methods.getOwnerOfToken(nftaddress, sellData.tokenId).call()
    // console.log(tokenOwner)

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

    // console.log(tx2)

    await SendTransaction(tx2);

    return true;
    // console.log(transaction)
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const WithdrawOffer = async (approved, tokenId, offerId, wallet, nftaddress, marketAddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
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

export const AcceptOffer = async (approved, tokenId, offerId, wallet, nftaddress, marketAddress) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
    }

    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      marketAddress,
      wallet
    );

    let data = contract2.methods.acceptOffer(tokenId, offerId, nftaddress).encodeABI();
    // console.log(tokenId, offerId)

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

export const EditNFT = async (approved, sellData, sellPrice, wallet) => {
  try {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
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
      // console.log(trans)
    }

    // console.log(sellData.tokenId)

    const price = await xdc3.utils.toWei(sellPrice, "ether");

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      sellData.marketAddress,
      wallet
    );
    // let tokenOwner = await contract2.methods.getOwnerOfToken(nftaddress, sellData.tokenId).call()
    // console.log(tokenOwner)
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

    // console.log(tx2)

    await SendTransaction(tx2);

    return true;
    // console.log(transaction)
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const isImage = (fileType) => {
  return !!fileType?.match("image.*");
};

export const isVideo = (fileType) => {
  return !!fileType?.match("video.*");
};

export const isAudio = (fileType) => {
  return !!fileType?.match("audio.*");
};
