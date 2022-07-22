import React, { 
  useEffect, 
  useState, 
  useContext 
} from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { 
  LayoutGroup, 
  motion 
} from "framer-motion/dist/framer-motion";
import { Collection } from "../../styles/Collection";
import DiscoverBar from "../../images/DiscoverBar.png";
import { 
  HStack, 
  Spacer, 
  VStack 
} from "../../styles/Stacks";
import { TitleBold27 } from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopLogo } from "../../styles/LoopLogo";
import menuContext from "../../context/menuContext";
import { getCollections } from "../../API/Collection";

import {
  untitledCollections,
  verifiedProfiles
} from "../../blacklist";

const Discover = () => {
  const history = useHistory();
  const [collections, setCollections] = useState([]);
  const [collectionPage, setCollectionPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCollections] = useState([
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
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();

  /**
   * Get the collections data for the first page
   */
  const getData = async () => {
    try {
      setLoading(true);
      const collectionData = await (await getCollections({page: 1})).data.collections;
      const collectionList = await Promise.all(
        collectionData.map(async (collectionItem) => {
          let collection = {
            name: collectionItem.name,
            nickName: collectionItem.nickName,
            description: collectionItem.description,
            logo: collectionItem.logo,
            isVerified: collectionItem.creator.isVerified,
            banner: collectionItem.banner,
            creator: collectionItem.creator.userName,
            floorPrice: collectionItem.floorPrice,
            nfts: collectionItem.totalNfts,
            owners: collectionItem.owners,
            tradeVolume: collectionItem.volumeTrade
          };
          return collection;
        })
      );

      // Old to new contract migration of NFTs function
      {/*
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
      */}
      
      // Update payout addresses of NFTs function
      {/*
        // const data2 = await marketContract.methods.idToMarketItem(5).call()
        // const uri = await nftContract.methods.tokenURI(data2.tokenId).call()
        // var metadata = await axios.get(uri)
        // const wallet = await GetWallet();
        // let data = marketContract.methods.editMarketItem(
        //     data2.tokenId,
        //     data2.itemId,
        //     "0x0d0C5e0F7F26277794753fBC739612CEd4cD1d18",
        //     // metadata?.data?.collection?.nft?.owner,
        //     "0x0d0C5e0F7F26277794753fBC739612CEd4cD1d18",
        //     // metadata?.data?.collection?.creator,
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
      */}

      // Export Contract data for migration to DB function
      {/*
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
        //     console.log(i)
        // }
        // console.log(JSON.stringify(meta))
      */}

      setCollections(collectionList);
      setCollectionPage(1);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get the collections data for the next page
   */
  const fetchMoreCollections = async () => {
    const collectionData = await (await getCollections({page: collectionPage + 1})).data.collections;
    const collectionList = await Promise.all(
      collectionData.map(async (collectionItem) => {
        let collection = {
          name: collectionItem.name,
          nickName: collectionItem.nickName,
          description: collectionItem.description,
          logo: collectionItem.logo,
          isVerified: collectionItem.creator.isVerified,
          banner: collectionItem.banner,
          creator: collectionItem.creator.userName,
          floorPrice: collectionItem.floorPrice,
          nfts: collectionItem.totalNfts,
          owners: collectionItem.owners,
          tradeVolume: collectionItem.volumeTrade
        };
        return collection;
      })
    );
    
    setCollectionPage(collectionPage + 1);
    setCollections((prevState) => [...prevState, ...collectionList]);
  };

  function NavigateTo(route) {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

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
          hasMore={collections.length < 1000000}
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
                {loading
                  ? loadingCollections.map((item) => (
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
                            isVerified={verifiedProfiles.includes(item.creator)}
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
                              NavigateTo(`collection/${item.nickName}`)
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