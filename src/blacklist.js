// Old to new contract migration of NFTs function
{
  /*
  // const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
  // const marketContract = new xdc3.eth.Contract(
  //   NFTMarketLayer1.abi,
  //   nftmarketlayeraddress,
  //   xdc3
  // );
  // const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
  // const oldMarketContract = new xdc3.eth.Contract(
  //   NFTMarket.abi,
  //   nftmarketaddress,
  //   xdc3
  // );
  // const data2 = await oldMarketContract.methods.idToMarketItem(1124).call()
  // console.log(data2)
  // var eventCount = data2.eventCount
  // var events = []
  // for(var i = 1; i <= eventCount; i++) {
  //   var event = await oldMarketContract.methods.getEventHistory(data2.itemId, i).call()
  //   if(event.timestamp >= 1648900000) {
  //       const uri = await nftContract.methods.tokenURI(data2.tokenId).call()
  //       var metadata = await axios.get(uri)
  //       console.log(data2, event, metadata?.data?.collection?.nft?.name, metadata?.data?.collection?.name)
        // let data = marketContract.methods.addEventsToItem(
        //     data2.tokenId,
        //     i,
        //     event.eventType,
        //     event.from,
        //     event.to,
        //     event.price,
        //     event.timestamp
        // ).encodeABI()
        // const wallet = await GetWallet();
        // const tx = {
        //     from: wallet.wallet.address,
        //     to: nftmarketlayeraddress,
        //     data
        // }
        // var gasLimit = await xdc3.eth.estimateGas(tx)
        // tx["gas"] = gasLimit
        // let transaction = SendTransaction(tx)
        // let data = marketContract.methods.editMarketItem(
        //     data2.tokenId,
        //     data2.itemId,
        //     data2.owner,
        //     data2.creator,
        //     data2.price,
        //     data2.isListed,
        //     data2.royalty,
        //     data2.eventCount,
        //     0,
        //     metadata?.data?.collection?.nft?.name,
        //     metadata?.data?.collection?.name,
        // ).encodeABI()
        // const tx = {
        //     from: wallet.wallet.address,
        //     to: nftmarketlayeraddress,
        //     data
        // }
        // var gasLimit = await xdc3.eth.estimateGas(tx)
        // tx["gas"] = gasLimit
        // let transaction = await SendTransaction(tx);
  //   }
  // }
*/
}

// Update payout addresses of NFTs function
{/*
// const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
// const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
// const marketContract = new xdc3.eth.Contract(
//     NFTMarketLayer1.abi,
//     nftmarketlayeraddress,
//     xdc3
//   );
// const data2 = await marketContract.methods.idToMarketItem(2689).call()
// var item = await marketContract.methods.getTokenEventHistory(2689).call();
// const weiprice = await xdc3.utils.toWei("20", "ether");
// console.log(data2, item)
// let data = marketContract.methods.editMarketItem(
//     data2.tokenId,
//     data2.itemId,
//     // "0x0d0C5e0F7F26277794753fBC739612CEd4cD1d18",
//     data2.owner,
//     // "0x0d0C5e0F7F26277794753fBC739612CEd4cD1d18",
//     data2.creator,
//     // weiprice,
//     data2.price,
//     // false,
//     data2.isListed,
//     data2.royalty,
//     // 4,
//     data2.eventCount,
//     0,
//     // data2.offerCount,
//     data2.name,
//     data2.collectionName,
// ).encodeABI()
// const tx = {
//     from: props?.wallet?.address,
//     to: nftmarketlayeraddress,
//     data
// }
// var gasLimit = await xdc3.eth.estimateGas(tx)
// tx["gas"] = gasLimit
// let transaction = await SendTransaction(tx);
*/}