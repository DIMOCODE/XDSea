import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Collection } from "../../styles/Collection";
import DiscoverBar from "../../images/DiscoverBar.png";
import {
  LayoutGroup,
  AnimatePresence,
  motion,
} from "framer-motion/dist/framer-motion";
import {
  HStack,
  Spacer,
  VStack,
  ZItem,
  ZStack,
  IconImg,
} from "../../styles/Stacks";
import {
  CaptionBoldShort,
  TitleBold27,
  TitleBold18,
  CaptionRegular,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopLogo } from "../../styles/LoopLogo";
import menuContext from "../../context/menuContext";
import { getCollections } from "../../API/Collection";
import { getNFTs } from "../../API/NFT";
import banner1 from "../../images/Banner1.jpg";
import { nftaddress } from "../../config";
import { NftContainer } from "../../styles/NftContainer";
import { isSafari } from "../../common/common";
import noResult from "../../images/noResult.png";
import { untitledCollections, verifiedProfiles } from "../../blacklist";
import CID from "cids";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import { FilterCollections } from "../../styles/FilterCollections";
import { FilterNFT } from "../../styles/FilterNFT";
import { FiltersButton } from "../../styles/FiltersButton";
import "./customstyles.css";
import { SortButtonCollections } from "../../styles/SortButtonCollections";
import { StickySectionHeader } from "@mayank1513/sticky-section-header";

const Discover = (props) => {
  const history = useHistory();

  const [collections, setCollections] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(true);
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
  const [loadingNFTs] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
    { id: 5, name: "NFT 5" },
    { id: 6, name: "NFT 6" },
    { id: 7, name: "NFT 7" },
    { id: 8, name: "NFT 8" },
    { id: 9, name: "NFT 9" },
    { id: 10, name: "NFT 10" },
    { id: 11, name: "NFT 11" },
    { id: 12, name: "NFT 12" },
  ]);
  const size = useWindowSize();
  const [, setShowMenu] = useContext(menuContext);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [collectionParams, setCollectionParams] = useState({
    page: 1,
    sortBy: "volumeTrade",
    sortDirection: -1,
  });
  const [nftParams, setNftParams] = useState({
    page: 1,
    sortBy: "publication",
    sortDirection: -1,
  });
  const [totalCollections, setTotalCollections] = useState(0);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  /**
   * Get the collections data for the first page
   */
  const getData = async () => {
    try {
      setLoading(true);
      const collectionData = await (
        await getCollections(collectionParams)
      ).data;
      const collectionList = await Promise.all(
        collectionData.collections.map(async (collectionItem) => {
          let collection = {
            name: collectionItem.name,
            nickName: collectionItem.nickName,
            description: collectionItem.description,
            logo: isSafari ? collectionItem.logo.v1 : collectionItem.logo.v0,
            isVerified: collectionItem.creator.isVerified,
            banner: isSafari
              ? collectionItem.banner.v1
              : collectionItem.banner.v0,
            creator: collectionItem.creator.userName,
            creatorId: collectionItem.creator._id,
            floorPrice: collectionItem.floorPrice,
            nfts: collectionItem.totalNfts,
            owners: collectionItem.owners,
            tradeVolume: collectionItem.volumeTrade,
          };
          return collection;
        })
      );

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
      {
        /*
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
      */
      }

      // Export Contract data for migration to DB function
      {
        /*
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
      */
      }

      setCollections(collectionList);
      setTotalCollections(collectionData.collectionsAmount);
      setCollectionParams((prevState) => ({
        ...prevState,
        page: prevState.page + 1,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get the collections data for the next page
   */
  const fetchMoreCollections = async () => {
    const collectionData = await (
      await getCollections(collectionParams)
    ).data.collections;
    const collectionList = await Promise.all(
      collectionData.map(async (collectionItem) => {
        let collection = {
          name: collectionItem.name,
          nickName: collectionItem.nickName,
          description: collectionItem.description,
          logo: isSafari ? collectionItem.logo.v1 : collectionItem.logo.v0,
          isVerified: collectionItem.creator.isVerified,
          banner: isSafari
            ? collectionItem.banner.v1
            : collectionItem.banner.v0,
          creator: collectionItem.creator.userName,
          creatorId: collectionItem.creator._id,
          floorPrice: collectionItem.floorPrice,
          nfts: collectionItem.totalNfts,
          owners: collectionItem.owners,
          tradeVolume: collectionItem.volumeTrade,
        };
        return collection;
      })
    );

    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setCollections((prevState) => [...prevState, ...collectionList]);
  };

  /**
   * Update the state of the component and update the collection data
   *
   * @param {*} params - Collection Search Params
   */
  const handleChangeFilter = (params) => {
    setCollectionParams(params);
    updateCollections(params);
  };

  /**
   * Update the collection items
   *
   * @param {*} params - Collection Search Params
   */
  const updateCollections = async (params) => {
    setLoading(true);
    const collectionData = await (await getCollections(params)).data;
    const collectionList = await Promise.all(
      collectionData.collections.map(async (collectionItem) => {
        let collection = {
          name: collectionItem.name,
          nickName: collectionItem.nickName,
          description: collectionItem.description,
          logo: isSafari ? collectionItem.logo.v1 : collectionItem.logo.v0,
          isVerified: collectionItem.creator.isVerified,
          banner: isSafari
            ? collectionItem.banner.v1
            : collectionItem.banner.v0,
          creator: collectionItem.creator.userName,
          creatorId: collectionItem.creator._id,
          floorPrice: collectionItem.floorPrice,
          nfts: collectionItem.totalNfts,
          owners: collectionItem.owners,
          tradeVolume: collectionItem.volumeTrade,
        };
        return collection;
      })
    );

    setCollections(collectionList);
    setTotalCollections(collectionData.collectionsAmount);
    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setLoading(false);
  };

  /**
   * Get the nfts data for the first page
   */
  const getNFTData = async () => {
    try {
      setLoading(true);
      const nftData = await (await getNFTs(nftParams)).data;
      setMaxPrice(nftData.higherPrice);
      const nftList = await Promise.all(
        nftData.nfts.map(async (nft) => {
          let nftItem = {
            collectionName: nft.collectionId.name,
            collectionNickName: nft.collectionId.nickName,
            creatorLogo: nft.owner.urlProfile,
            image: isSafari ? nft.urlFile.v1 : nft.urlFile.v0,
            name: nft.name,
            price: nft.price,
            fileType: nft.fileType,
            preview: isSafari ? nft.preview.v1 : nft.preview.v0,
            creator: nft.creator.userName,
            ownerId: nft.owner._id,
            tokenId: nft.tokenId,
            saleType: nft.saleType.toLowerCase(),
            isVerified: nft.owner.isVerified,
            collectionVerified: nft.creator.isVerified,
          };
          return nftItem;
        })
      );

      setNfts(nftList);
      setTotalNFTs(nftData.nftsAmount);
      setNftParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get the nfts data for the next page
   */
  const fetchMoreNFTs = async () => {
    const nftData = await (await getNFTs(nftParams)).data.nfts;
    const nftList = await Promise.all(
      nftData.map(async (nft) => {
        let nftItem = {
          collectionName: nft.collectionId.name,
          collectionNickName: nft.collectionId.nickName,
          creatorLogo: nft.owner.urlProfile,
          image: isSafari ? nft.urlFile.v1 : nft.urlFile.v0,
          name: nft.name,
          hasOpenOffer: nft.hasOpenOffer,
          price: nft.price,
          fileType: nft.fileType,
          preview: isSafari ? nft.preview.v1 : nft.preview.v0,
          creator: nft.creator.userName,
          ownerId: nft.owner._id,
          tokenId: nft.tokenId,
          saleType: nft.saleType.toLowerCase(),
          isVerified: nft.owner.isVerified,
          collectionVerified: nft.creator.isVerified,
        };
        return nftItem;
      })
    );

    setNftParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    setNfts((prevState) => [...prevState, ...nftList]);
  };

  /**
   * Update the state of the component and update the nft data
   *
   * @param {*} params - NFT Search Params
   */
  const handleChangeFilterNFT = (params) => {
    setNftParams(params);
    updateNFTs(params);
  };

  /**
   * Update the NFT items
   *
   * @param {*} params - NFT Search Params
   */
  const updateNFTs = async (params) => {
    setLoading(true);
    const nftData = await (await getNFTs(params)).data;
    setMaxPrice(nftData.higherPrice);
    const nftList = await Promise.all(
      nftData.nfts.map(async (nft) => {
        let nftItem = {
          collectionName: nft.collectionId.name,
          collectionNickName: nft.collectionId.nickName,
          creatorLogo: nft.owner.urlProfile,
          image: isSafari ? nft.urlFile.v1 : nft.urlFile.v0,
          name: nft.name,
          hasOpenOffer: nft.hasOpenOffer,
          price: nft.price,
          fileType: nft.fileType,
          preview: isSafari ? nft.preview.v1 : nft.preview.v0,
          creator: nft.creator.userName,
          ownerId: nft.owner._id,
          tokenId: nft.tokenId,
          saleType: nft.saleType.toLowerCase(),
          isVerified: nft.owner.isVerified,
          collectionVerified: nft.creator.isVerified,
        };
        return nftItem;
      })
    );

    setNfts(nftList);
    setTotalNFTs(nftData.nftsAmount);
    setNftParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    setLoading(false);
  };

  function NavigateTo(route) {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

  // useEffect(() => {
  //   const onScroll = (e) => {
  //     setScrollTop(e.target.documentElement.scrollTop);
  //     setScrolling(e.target.documentElement.scrollTop > scrollTop);
  //     setShowMenu(false);
  //   };
  //   window.addEventListener("scroll", onScroll);

  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [scrollTop]);

  // useEffect(() => {}, [scrolling]);

  return (
    <DiscoverSection id="scrollableDiv">
      <HStack backgroundimage={DiscoverBar}>
        <HStack width="1200px" height="157px" padding="0px 9px">
          <TitleBold27 textcolor={appStyle.colors.white}>Discover</TitleBold27>
          <Spacer></Spacer>
          {/* Toggle */}
          <HStack
            background="rgb(0,0,0,0.3)"
            padding="3px"
            border="6px"
            height="49px"
            self="none"
            spacing="3px"
            blur="10px"
          >
            <ZStack>
              <ZItem>
                {/* Selector */}
                <AnimatePresence inital="false">
                  <HStack
                    height="43px"
                    self="none"
                    spacing="3px"
                    justify={isSelected ? "flex-start" : "flex-end"}
                  >
                    <HStack
                      width="96px"
                      background="white"
                      border="6px"
                      layout
                    ></HStack>
                  </HStack>
                </AnimatePresence>
              </ZItem>
              <ZItem>
                <HStack height="43px" self="none" spacing="3px">
                  <HStack
                    width="96px"
                    onClick={() => setIsSelected(true)}
                    cursor="pointer"
                  >
                    <CaptionBoldShort
                      textcolor={isSelected ? "black" : "white"}
                      cursor="pointer"
                    >
                      Collections
                    </CaptionBoldShort>
                  </HStack>

                  <HStack
                    width="96px"
                    cursor="pointer"
                    onClick={() => {
                      setIsSelected(false);
                      if (nfts.length === 0) {
                        getNFTData();
                      }
                    }}
                  >
                    <CaptionBoldShort
                      textcolor={isSelected ? "white" : "black"}
                      cursor="pointer"
                    >
                      NFTs
                    </CaptionBoldShort>
                  </HStack>
                </HStack>
              </ZItem>
            </ZStack>
          </HStack>
        </HStack>
      </HStack>

      <ContentDiscover id="scrollableDiv">
        <StickySectionHeader top="90">
          {isSelected ? (
            <HStack
              background="rgb(0,0,0, 0.06)"
              padding="6px"
              border="9px"
              width="100%"
              style={{ zIndex: 10000 }}
              blur="30px"
            >
              <FiltersButton
                onChange={handleChangeFilter}
                params={collectionParams}
                isNftFilter={false}
                switched={isSelected}
              ></FiltersButton>
              <Spacer></Spacer>
              <SortButtonCollections
                onChange={handleChangeFilter}
                params={collectionParams}
              ></SortButtonCollections>
            </HStack>
          ) : (
            <HStack
              background="rgb(0,0,0, 0.06)"
              padding="6px"
              border="9px"
              style={{ zIndex: 10000 }}
              blur="30px"
            >
              <FiltersButton
                isNftFilter={true}
                onChange={handleChangeFilterNFT}
                params={nftParams}
                switched={isSelected}
                maxPrice={maxPrice}
              ></FiltersButton>
              <Spacer></Spacer>
              <SortButtonNFTS
                onChange={handleChangeFilterNFT}
                params={nftParams}
              ></SortButtonNFTS>
            </HStack>
          )}
        </StickySectionHeader>

        {isSelected ? (
          <VStack padding="30px 12px">
            {/* <FilterCollections
              params={collectionParams}
              onChange={handleChangeFilter}
            ></FilterCollections> */}

            <InfiniteScroll
              dataLength={collections.length}
              next={fetchMoreCollections}
              hasMore={collections.length < totalCollections}
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
              style={{ overflow: "show" }}
            >
              {/* Filter and Sort for Collections  */}

              <VStack
                spacing="30px"
                padding={size.width < 1200 ? "0 12px" : "0"}
              >
                <HStack>
                  <HStack spacing="12px" flexwrap="wrap" justify="flex-start">
                    {loading ? (
                      loadingCollections.map((item) => (
                        <VStack key={item.name} minwidth="326px" height="440px">
                          {/* <LoadingNftContainer></LoadingNftContainer> */}
                        </VStack>
                      ))
                    ) : collections.length !== 0 ? (
                      collections.map((item) => (
                        <LayoutGroup id="collection" key={item.name}>
                          <VStack width="326px" height="440px">
                            <Collection
                              key={item.name}
                              isVerified={item.isVerified}
                              keyContent={item.name}
                              keyID={item.creator}
                              collectionImage={item.banner}
                              creatorLogo={item.logo}
                              collectionName={item.name}
                              collectionDescription={item.description}
                              creatorName={item.creator}
                              onClickCollection={() =>
                                NavigateTo(`collection/${item.nickName}`)
                              }
                              floorprice={item.floorPrice}
                              owners={item.owners}
                              nfts={item.nfts}
                              volumetraded={item.tradeVolume}
                              onClickCreator={() =>
                                NavigateTo(`UserProfile/${item.creatorId}`)
                              }
                              sortFloor={
                                collectionParams.sortBy === "floorPrice"
                              }
                              sortOwners={collectionParams.sortBy === "owners"}
                              sortNFTs={collectionParams.sortBy === "nfts"}
                              sortVolume={
                                collectionParams.sortBy === "volumeTrade"
                              }
                              xdc={props.xdc}
                            ></Collection>
                          </VStack>
                        </LayoutGroup>
                      ))
                    ) : (
                      <VStack
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        width="326px"
                        height="440px"
                      >
                        <Collection
                          key={item.name}
                          isVerified={item.isVerified}
                          keyContent={item.name}
                          keyID={item.creator}
                          collectionImage={item.banner}
                          creatorLogo={item.logo}
                          collectionName={item.name}
                          collectionDescription={item.description}
                          creatorName={item.creator}
                          onClickCollection={() =>
                            NavigateTo(`collection/${item.nickName}`)
                          }
                          floorprice={item.floorPrice}
                          owners={item.owners}
                          nfts={item.nfts}
                          volumetraded={item.tradeVolume}
                          onClickCreator={() =>
                            NavigateTo(`UserProfile/${item.creatorId}`)
                          }
                          sortFloor={collectionParams.sortBy === "floorPrice"}
                          sortOwners={collectionParams.sortBy === "owners"}
                          sortNFTs={collectionParams.sortBy === "nfts"}
                          sortVolume={collectionParams.sortBy === "volumeTrade"}
                          xdc={props.xdc}
                        ></Collection>
                      </VStack>
                    </LayoutGroup>
                  ))
                ) : (
                  <VStack
                    padding="0px"
                    width="360px"
                    height="360px"
                    style={{ zIndex: "-50" }}
                    border="6px"
                  >
                    <IconImg
                      url={noResult}
                      width="90px"
                      height="90px"
                    ></IconImg>
                    <TitleBold18 animate={{ opacity: 0.6 }}>
                      Nothing Found
                    </TitleBold18>
                  </VStack>
                )}
              </HStack>
            </InfiniteScroll>
          </VStack>
        ) : (
          <VStack>
            <VStack background="transparent" width="100%" padding="30px 0">
              <InfiniteScroll
                dataLength={nfts.length}
                next={fetchMoreNFTs}
                hasMore={nfts.length < totalNFTs}
                loader={
                  <HStack
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    height="190px"
                  >
                    <LoopLogo></LoopLogo>
                  </HStack>
                }
                scrollableTarget="#scrollableDiv"
                style={{ overflow: "hidden" }}
              >
                <VStack>
                  <HStack>
                    <HStack
                      spacing="12px"
                      flexwrap="wrap"
                      justify="flex-start"
                      padding={size.width < 1200 ? "0 12px" : "0"}
                      width="100%"
                      // width={size.width < 768 ? "100%" : "1100px"}
                    >
                      {loading ? (
                        loadingNFTs.map((item) => (
                          <VStack
                            // minwidth={size.width < 768 ? "100%" : "326px"}
                            // maxwidth="326px"
                            // height={size.width < 768 ? "440px" : "420px"}
                            minwidth="240px"
                            height="390px"
                            key={item.name}
                          >
                            <LoadingNftContainer></LoadingNftContainer>
                          </VStack>
                        ))
                      ) : nfts.length !== 0 ? (
                        nfts.map((item, i) => (
                          <VStack
                            minwidth="240px"
                            height="390px"
                            // height={size.width < 768 ? "440px" : "420px"}
                          >
                            <NftContainer
                              key={i}
                              isVerified={item.isVerified}
                              iconStatus={item.saleType}
                              hasOffers={item.hasOpenOffer ? true : false}
                              creatorImage={item.creatorLogo}
                              itemImage={item.image}
                              price={item.price}
                              collectionName={item.collectionName}
                              itemNumber={item.name}
                              fileType={item.fileType}
                              background={({ theme }) => theme.backElement}
                              onClick={() =>
                                NavigateTo(`nft/${nftaddress}/${item.tokenId}`)
                              }
                              onClickCreator={() =>
                                NavigateTo(`UserProfile/${item.ownerId}`)
                              }
                              owner={true}
                              usdPrice={props.xdc}
                              collectionVerified={item.collectionVerified}
                            ></NftContainer>
                          </VStack>
                        ))
                      ) : (
                        <VStack
                          width="360px"
                          height="360px"
                          // background={({ theme }) => theme.faded}
                          style={{ zIndex: "-50" }}
                          border="6px"
                        >
                          <IconImg
                            url={noResult}
                            width="90px"
                            height="90px"
                          ></IconImg>
                          <TitleBold18 animate={{ opacity: 0.6 }}>
                            Nothing Found
                          </TitleBold18>
                        </VStack>
                      )}
                    </HStack>
                  </HStack>
                </VStack>
              </InfiniteScroll>
            </VStack>
            <Spacer></Spacer>
          </VStack>
        )}
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

const StickyMenu = styled(motion.div)`
  width: 100%;
  position: -webkit-sticky;
  position: sticky;

  top: 0;
`;
