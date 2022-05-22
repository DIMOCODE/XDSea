import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Xdc3 from "xdc3";
import {
  nftaddress,
  nftmarketaddress,
  nftmarketlayeraddress,
} from "../../config";
import { DEFAULT_PROVIDER } from "../../constant";
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
import { deletedCollections, burnedCollections } from "../../blacklist";

const Discover = () => {
  const history = useHistory();
  const [collections, setCollections] = useState([]);
  const [collectionPage, setCollectionPage] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [setLoading, isSetLoading] = useState(false);
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

  const getData = async () => {
    try {
      isSetLoading(true);
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
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
      // const data2 = await oldMarketContract.methods.fetchMarketItems().call()
      // console.log(data2.length);
      // const allEvents = await Promise.all(data2.map(async item => {
      //     // console.log(item.tokenId)
      //     var eventCount = item.eventCount
      //     var events = []
      //     for(var i = 1; i <= eventCount; i++) {
      //         var event = await oldMarketContract.methods.getEventHistory(item.itemId, i).call()
      //         if(event.timestamp >= 1650376040) {
      //             const uri = await nftContract.methods.tokenURI(item.tokenId).call()
      //             var metadata = await axios.get(uri)
      //             console.log(item, event, metadata?.data?.collection?.nft?.name, metadata?.data?.collection?.name)
      // let data = marketContract.methods.editMarketItem(
      //     item.tokenId,
      //     item.itemId,
      //     item.owner,
      //     item.creator,
      //     item.price,
      //     item.isListed,
      //     item.royalty,
      //     item.eventCount,
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
      // let data = marketContract.methods.addEventsToItem(
      //     item.tokenId,
      //     i,
      //     event.eventType,
      //     event.from,
      //     event.to,
      //     event.price,
      //     event.timestamp
      // ).encodeABI()
      //     const tx = {
      //         from: wallet.wallet.address,
      //         to: nftmarketlayeraddress,
      //         data
      //     }
      //     var gasLimit = await xdc3.eth.estimateGas(tx)
      //     tx["gas"] = gasLimit
      //     let transaction = SendTransaction(tx)
      //     }
      // }
      // return events
      // }))

      const collectionData = await marketContract.methods
        .fetchCollections()
        .call();
      const collections = await Promise.all(
        collectionData.slice(0, 12).map(async (i) => {
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
            name: metadata?.data?.collection?.name,
            description: metadata?.data?.collection?.description,
            creator: metadata?.data?.collection?.creator,
            banner: metadata?.data?.collection?.banner,
            logo: metadata?.data?.collection?.logo,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview: metadata?.data?.collection?.nft?.preview,
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
      var filteredCollections = collections.filter((element) => {
        return !deletedCollections.includes(element?.name);
      });
      setCollections(filteredCollections);
      setCollectionPage(collectionData);
      isSetLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoreCollections = async () => {
    setPageCount(pageCount + 1);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const collections = await Promise.all(
      collectionPage
        .slice(pageCount * 12, 12 * (pageCount + 1))
        .map(async (i) => {
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          const collectionData2 = await marketContract.methods
            .getCollectionNFTs(metadata?.data?.collection?.name)
            .call();
          var volumeTraded = 0;
          const uniqueOwners = [];
          var lowestPrice = 99999999999999999999999999999;
          const allEvents = await Promise.all(
            collectionData2.map(async (item) => {
              var price = await xdc3.utils.fromWei(item.price, "ether");
              if (!uniqueOwners.includes(item.owner)) {
                uniqueOwners.push(item.owner);
              }
              if (parseInt(price) < lowestPrice) {
                lowestPrice = parseInt(price);
              }
              var events = [];
              var tokenEvents = await marketContract.methods
                .getTokenEventHistory(item.tokenId)
                .call();
              for (var j = 0; j < tokenEvents.length; j++) {
                if (
                  tokenEvents[j].eventType === "3" ||
                  tokenEvents[j].eventType === "8"
                ) {
                  volumeTraded += parseInt(
                    await xdc3.utils.fromWei(tokenEvents[j].price, "ether")
                  );
                }
              }
              return events;
            })
          );
          let collection = {
            name: metadata?.data?.collection?.name,
            description: metadata?.data?.collection?.description,
            creator: metadata?.data?.collection?.creator,
            banner: metadata?.data?.collection?.banner,
            logo: metadata?.data?.collection?.logo,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview: metadata?.data?.collection?.nft?.preview,
            floorPrice: lowestPrice,
            volumeTraded: volumeTraded,
            items: !burnedCollections.includes(metadata?.data?.collection?.name)
              ? collectionData2.length
              : collectionData2.length - 1,
            owners: uniqueOwners.length,
          };
          return collection;
        })
    );
    var filteredCollections = collections.filter((element) => {
      return !deletedCollections.includes(element?.name);
    });
    setCollections((prevState) => [...prevState, ...filteredCollections]);
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          hasMore={collections.length < collectionPage.length - 1}
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
                spacing="30px"
                flexwrap="wrap"
                padding="15px 30px"
                justify="flex-start"
                width={size.width < 768 ? "100%" : "1100px"}
              >
                {setLoading
                  ? loadingCollection.map((item) => (
                      <VStack
                        key={item.name}
                        minwidth={size.width < 768 ? "100%" : "500px"}
                        maxwidth="500px"
                        height={size.width < 768 ? "440px" : "420px"}
                      >
                        <LoadingNftContainer></LoadingNftContainer>
                      </VStack>
                    ))
                  : collections.map((item) => (
                      <LayoutGroup id="collection">
                        <VStack
                          minwidth={size.width < 768 ? "100%" : "500px"}
                          maxwidth="500px"
                          height={size.width < 768 ? "440px" : "420px"}
                        >
                          <Collection
                            key={item.name}
                            keyContent={item.name}
                            keyID={item.creator}
                            collectionImage={item.banner}
                            creatorLogo={item.logo}
                            collectionName={item.name}
                            collectionDescription={item.description}
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
