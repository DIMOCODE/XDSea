import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Xdc3 from "xdc3";
import { nftaddress, nftmarketlayeraddress, nftmarketaddress } from "../../config";
import { DEFAULT_PROVIDER, HEADER } from "../../constant";
import NFT from "../../abis/NFT.json";
import NFTMarket from "../../abis/NFTMarket.json";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import axios from "axios";
import styled from "styled-components";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { Collection } from "../../styles/Collection";
import DiscoverBar from "../../images/DiscoverBar.png";
import { HStack, Spacer, VStack } from "../../styles/Stacks";
import { TitleBold27 } from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopLogo } from "../../styles/LoopLogo";
import { GetWallet, SendTransaction } from "xdc-connect";
import {
  deletedCollections,
  spotlightCollectionList,
  untitledCollections,
} from "../../blacklist";
import menuContext from "../../context/menuContext";
import CID from "cids";

const Discover = () => {
  const history = useHistory();
  const [collections, setCollections] = useState([]);
  const [collectionPage, setCollectionPage] = useState([]);
  const [setLoading, isSetLoading] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);
  const [loadingCollection] = useState([
    { id: 1, name: "Collection 1" },
    { id: 2, name: "Collection 2" },
    { id: 3, name: "Collection 3" },
    { id: 4, name: "Collection 4" },
    { id: 5, name: "Collection 5" },
    { id: 6, name: "Collection 6" },
    { id: 7, name: "Collection 7" },
    { id: 8, name: "Collection 8" },
    { id: 9, name: "Collection 9" },
    { id: 10, name: "Collection 10" },
    { id: 11, name: "Collection 11" },
    { id: 12, name: "Collection 12" },
  ]);
  const size = useWindowSize();
  const [showMenu, setShowMenu] = useContext(menuContext);

  const getData = async () => {
    try {
      isSetLoading(true);
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
      const marketContract = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        xdc3
      );
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

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

      // for(var i = 2000; i < 3200; i++) {
      // const nftData = await marketContract.methods.idToMarketItem(i).call();
      // const offers = await marketContract.methods.getTokenOfferList(i).call();
      // if(offers.length !== 0)
      //   console.log(i, offers);
      //   var events = await marketContract.methods.getTokenEventHistory(i).call();
      //   for(var j = 1; j <= events.count ; i++)
      //     if(events[j].eventType === "8")
      //       console.log(i, events[j])
      // }
      // const data56 = await marketContract.methods.fetchMarketItems().call()
      // console.log(data56.length)
      // // const offers = await Promise.all(data56.slice(0,1000).map(async i => {
      // //     var offerList = await marketContract.methods.getTokenOfferList(i.tokenId).call()
      // //     for(var j = 0; j < offerList.length; j++){
      // //         if(offerList[j].from == "0x1ddd41ef7c11a4042467e44047295b7c6e361085") {
      // //             console.log(i.tokenId, offerList[j])
      // //         }
      // //     }
      // // }))
      // console.log("Finished")

      // const meta = {}
      // for(var i = 2001; i < 3893; i++) {
      //   const uri = await nftContract.methods.tokenURI(i).call()
        // var metadata = await axios.get(uri)
        // meta[i] = metadata.data;
          // var item = await marketContract.methods.idToMarketItem(i).call();
          // let nft = {
          //   tokenId: item.tokenId,
          //   itemId: item.itemId,
          //   owner: item.owner,
          //   creator: item.creator,
          //   price: item.price,
          //   isListed: item.isListed,
          //   royalty: item.royalty,
          //   eventCount: item.eventCount,
          //   offerCount: item.offerCount,
          //   name: item.name,
          //   collectionName: item.collectionName
          // }
          // var item = await marketContract.methods.getTokenEventHistory(i).call();
          // var events = []
          // for(var j = 0; j < item.length; j++) {
          //   let event = {
          //     eventType: item[j].eventType,
          //     from: item[j].from,
          //     to: item[j].to,
          //     price: item[j].price,
          //     timestamp: item[j].timestamp
          //   }
          //   events.push(event)
          // }
          // var item = await marketContract.methods.getTokenOfferList(i).call();
          // var offers = []
          // for(var j = 0; j < item.length; j++) {
          //   let offer = {
          //     price: item[j].price,
          //     from: item[j].from,
          //     to: item[j].to,
          //     isWithdrawn: item[j].isWithdrawn,
          //     isAccepted: item[j].isAccepted
          //   }
          //   offers.push(offer)
          // }
          // if(offers.length !== 0)
            // meta[i] = nft;
          // await new Promise((r) => setTimeout(r, 500));
          // console.log(i)
      // }
      // console.log(JSON.stringify(meta))

      const collectionData = await marketContract.methods
        .fetchCollections()
        .call();

      const spotlightCollections = await Promise.all(
        spotlightCollectionList.map(async (i) => {
          var collectionData = await marketContract.methods
            .fetchCollection(i)
            .call();
          const uri = await nftContract.methods
            .tokenURI(collectionData.tokenId)
            .call();
          var metadata = await axios.get(uri);
          // const collectionData2 = await marketContract.methods
          //   .getCollectionNFTs(metadata?.data?.collection?.name)
          //   .call();
          // var volumeTraded = 0;
          // const uniqueOwners = [];
          // var lowestPrice = 99999999999999999999999999999;
          // const allEvents = await Promise.all(
          //   collectionData2.map(async (item) => {
          //     var price = await xdc3.utils.fromWei(item.price, "ether");
          //     if (!uniqueOwners.includes(item.owner)) {
          //       uniqueOwners.push(item.owner);
          //     }
          //     if (parseInt(price) < lowestPrice) {
          //       lowestPrice = parseInt(price);
          //     }
          //     var events = [];
          //     var tokenEvents = await marketContract.methods
          //       .getTokenEventHistory(item.tokenId)
          //       .call();
          //     for (var j = 0; j < tokenEvents.length; j++) {
          //       if (
          //         tokenEvents[j].eventType === "3" ||
          //         tokenEvents[j].eventType === "8"
          //       ) {
          //         volumeTraded += parseInt(
          //           await xdc3.utils.fromWei(tokenEvents[j].price, "ether")
          //         );
          //       }
          //     }
          //     return events;
          //   })
          // );
          let collection = {
            name: metadata?.data?.collection?.name,
            description: metadata?.data?.collection?.description,
            creator: metadata?.data?.collection?.creator,
            banner:
              metadata?.data?.collection?.banner.split("/")[2] ===
              "ipfs.infura.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.banner.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.banner,
            logo:
              metadata?.data?.collection?.logo.split("/")[2] ===
              "ipfs.infura.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.logo.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.logo,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview:
              metadata?.data?.collection?.nft?.preview.split("/")[2] ===
              "ipfs.infura.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.nft?.preview.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.nft?.preview,
            // floorPrice: lowestPrice,
            // volumeTraded: volumeTraded,
            // items: !burnedCollections.includes(metadata?.data?.collection?.name)
            //   ? collectionData2.length
            //   : collectionData2.length - 1,
            // owners: uniqueOwners.length,
          };
          return collection;
        })
      );

      setCollections(spotlightCollections);
      setCollectionPage(collectionData);
      isSetLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoreCollections = async () => {
    await new Promise((r) => setTimeout(r, 3000));
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER));
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    var nextPage = [];
    await Promise.all(
      collectionPage.slice(lastIndex, lastIndex + 24).map(async (i, index) => {
        if (
          !spotlightCollectionList.includes(i.collectionName) &&
          !deletedCollections.includes(i.collectionName)
        ) {
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          // const collectionData2 = await marketContract.methods
          //   .getCollectionNFTs(metadata?.data?.collection?.name)
          //   .call();
          // var volumeTraded = 0;
          // const uniqueOwners = [];
          // var lowestPrice = 99999999999999999999999999999;
          // const allEvents = await Promise.all(
          //   collectionData2.map(async (item) => {
          //     var price = await xdc3.utils.fromWei(item.price, "ether");
          //     if (!uniqueOwners.includes(item.owner)) {
          //       uniqueOwners.push(item.owner);
          //     }
          //     if (parseInt(price) < lowestPrice) {
          //       lowestPrice = parseInt(price);
          //     }
          //     var events = [];
          //     var tokenEvents = await marketContract.methods
          //       .getTokenEventHistory(item.tokenId)
          //       .call();
          //     for (var j = 0; j < tokenEvents.length; j++) {
          //       if (
          //         tokenEvents[j].eventType === "3" ||
          //         tokenEvents[j].eventType === "8"
          //       ) {
          //         volumeTraded += parseInt(
          //           await xdc3.utils.fromWei(tokenEvents[j].price, "ether")
          //         );
          //       }
          //     }
          //     return events;
          //   })
          // );
          let collection = {
            id: index,
            name: metadata?.data?.collection?.name,
            description: metadata?.data?.collection?.description,
            creator: metadata?.data?.collection?.creator,
            banner: untitledCollections.includes(i.collectionName)
              ? chooseBanner()
              : metadata?.data?.collection?.banner
              ? metadata?.data?.collection?.banner.split("/")[2] ===
                "ipfs.infura.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.banner.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.bannner
              : chooseBanner(),
            logo:
              metadata?.data?.collection?.logo.split("/")[2] ===
              "ipfs.infura.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.logo.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.logo,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview:
              metadata?.data?.collection?.nft?.preview.split("/")[2] ===
              "ipfs.infura.io"
                ? `https://${new CID(
                    metadata?.data?.collection?.nft?.preview.split("/")[4]
                  )
                    .toV1()
                    .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                : metadata?.data?.collection?.nft?.preview,
            // floorPrice: lowestPrice,
            // volumeTraded: volumeTraded,
            // items: !burnedCollections.includes(metadata?.data?.collection?.name)
            //   ? collectionData2.length
            //   : collectionData2.length - 1,
            // owners: uniqueOwners.length,
          };
          nextPage.push(collection);
        }
      })
    );
    nextPage = nextPage
      .sort((collection1, collection2) => {
        if (collection1.id < collection2.id) return -1;
        else return 1;
      })
      .slice(0, 12);
    setLastIndex(lastIndex + nextPage[nextPage.length - 1].id + 1);
    setCollections((prevState) => [...prevState, ...nextPage]);
  };

  function chooseBanner() {
    return `./Banner${Math.ceil(Math.random() * 28)}.jpg`;
  }

  function NavigateTo(route) {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();

  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
      setShowMenu(false);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  useEffect(() => {
    // console.log(scrolling);
  }, [scrolling]);

  return (
    <DiscoverSection id="scrollableDiv">
      <HStack backgroundimage={DiscoverBar}>
        <HStack width="1200px" height="157px" padding="0px 30px">
          <TitleBold27 textcolor={appStyle.colors.white}>
            Discover Collections
          </TitleBold27>
          <Spacer></Spacer>
        </HStack>
      </HStack>
      <ContentDiscover id="scrollableDiv">
        <InfiniteScroll
          dataLength={collections.length}
          next={fetchMoreCollections}
          hasMore={collections.length < collectionPage.length - 2}
          scrollThreshold={0.8}
          loader={
            <HStack
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              height="210px"
            >
              <LoopLogo></LoopLogo>
            </HStack>
          }
          scrollableTarget="#scrollableDiv"
          style={{ overflow: "hidden" }}
        >
          <VStack spacing="30px">
            {/* <HStack>
                  <DiscoverFilter
                    textcolor={({ theme }) => theme.text}
                    background={({ theme }) => theme.backElement}
                  ></DiscoverFilter>
              </HStack> */}
            <HStack>
              <HStack
                spacing="21px"
                flexwrap="wrap"
                padding="15px 30px"
                justify="flex-start"
                width={size.width < 768 ? "100%" : "1100px"}
              >
                {setLoading
                  ? loadingCollection.map((item) => (
                      <VStack
                        key={item.name}
                        minwidth={size.width < 768 ? "100%" : "326px"}
                        maxwidth="326px"
                        height={size.width < 768 ? "440px" : "420px"}
                      >
                        <LoadingNftContainer></LoadingNftContainer>
                      </VStack>
                    ))
                  : collections.map((item) => (
                      <LayoutGroup id="collection" key={item.name}>
                        <VStack
                          width="326px"
                          height={size.width < 768 ? "440px" : "420px"}
                        >
                          <Collection
                            key={item.name}
                            isVerified={true}
                            keyContent={item.name}
                            keyID={item.creator}
                            collectionImage={item.banner}
                            creatorLogo={
                              untitledCollections.includes(item.name)
                                ? item.banner
                                : item.logo
                            }
                            collectionName={item.name}
                            collectionDescription={
                              item.name === "DØP3 Punks "
                                ? `A multichain NFT project minting collections on every major blockchain!\n\nWhere DØP3 Art Meets Web3`
                                : item.description
                            }
                            creatorName={item.creator}
                            onClickCollection={() =>
                              NavigateTo(`collection/${item.name}`)
                            }
                            floorprice={item.floorPrice}
                            owners={item.owners}
                            nfts={item.items}
                            volumetraded={item.volumeTraded}
                            onClickCreator={() =>
                              NavigateTo(`UserProfile/${item.creator}`)
                            }
                          ></Collection>
                        </VStack>
                      </LayoutGroup>
                    ))}
              </HStack>
            </HStack>
          </VStack>
        </InfiniteScroll>
      </ContentDiscover>
    </DiscoverSection>
  );
};

export { Discover };

const DiscoverSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.06);
`;

const ContentDiscover = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;