import Xdc3 from "xdc3";
import { nftaddress, nftmarketaddress, nftmarketlayeraddress } from "./config";
import { DEFAULT_PROVIDER, HEADER } from "./constant";
import NFT from "./abis/NFT.json";
import NFTMarket from "./abis/NFTMarket.json";
import NFTMarketLayer1 from "./abis/NFTMarketLayer1.json";
import { GetWallet, SendTransaction } from "xdc-connect";
import { fromXdc, isXdc } from "./common/common";

export const BuyNFT = async (nft) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    // console.log(nft)

    // const contract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
    const contract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
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
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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

export const LegacyBuyNFT = async (nft) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    // console.log(nft)

    // const contract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
    const contract = new xdc3.eth.Contract(
      NFTMarket.abi,
      nftmarketaddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
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
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
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

export const SellNFT = async (approved, sellData, sellPrice) => {
  try {
    const wallet = await GetWallet();
    // console.log(wallet, approved, sellData, sellPrice);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
    var formattedWallet = isXdc(wallet.wallet.address)
      ? fromXdc(wallet.wallet.address)
      : wallet.wallet.address;

    // console.log(price, formattedWallet, nftaddress);

    // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, formattedWallet)
    const contract2 = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      formattedWallet
    );
    // let tokenOwner = await contract2.methods.getOwnerOfToken(nftaddress, sellData.tokenId).call()
    // console.log(tokenOwner)

    let data = contract2.methods
      .listItem(nftaddress, sellData.tokenId, price)
      .encodeABI();

    // console.log(nft)

    // console.log(data);

    const tx2 = {
      from: formattedWallet,
      to: nftmarketlayeraddress,
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

export const WithdrawListing = async (approved, nft) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
    );
    let data = contract2.methods
      .withdrawListing(nftaddress, nft.tokenId)
      .encodeABI();

    const tx2 = {
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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

export const LegacyWithdrawListing = async (approved, nft) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketaddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
    );
    let data = contract2.methods
      .withdrawListing(nftaddress, nft.itemId)
      .encodeABI();

    const tx2 = {
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
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

export const TransferNFT = async (approved, transferNFT, transferAddress) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    // console.log(wallet, approved, transferNFT, transferAddress);

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
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
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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

export const Offer = async (approved, offerNFT, offerPrice) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
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
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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

export const WithdrawOffer = async (approved, tokenId, offerId) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
    );

    let data = contract2.methods.withdrawOffer(tokenId, offerId).encodeABI();

    const tx2 = {
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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

export const AcceptOffer = async (approved, tokenId, offerId) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
    );

    let data = contract2.methods.acceptOffer(tokenId, offerId, nftaddress).encodeABI();
    // console.log(tokenId, offerId)

    const tx2 = {
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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

export const EditNFT = async (approved, sellData, sellPrice) => {
  try {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));

    if (approved === false) {
      // console.log("Approving")
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      var appData = nftContract.methods
        .setApprovalForAll(nftmarketlayeraddress, true)
        .encodeABI();

      const tx1 = {
        from: isXdc(wallet.wallet.address)
          ? fromXdc(wallet.wallet.address)
          : wallet.wallet.address,
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
      nftmarketlayeraddress,
      isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address
    );
    // let tokenOwner = await contract2.methods.getOwnerOfToken(nftaddress, sellData.tokenId).call()
    // console.log(tokenOwner)
    let data = contract2.methods
      .editListing(sellData.tokenId, price)
      .encodeABI();

    const tx2 = {
      from: isXdc(wallet.wallet.address)
        ? fromXdc(wallet.wallet.address)
        : wallet.wallet.address,
      to: nftmarketlayeraddress,
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
