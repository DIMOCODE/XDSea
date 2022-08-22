import React, { useEffect, useState } from "react";
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
  BodyBold,
  BodyRegular,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopLogo } from "../../styles/LoopLogo";
import { getCollections } from "../../API/Collection";
import { getNFTs } from "../../API/NFT";
import { nftaddress } from "../../config";
import { NftContainer } from "../../styles/NftContainer";
import noResult from "../../images/noResult.png";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import { FiltersButton } from "../../styles/FiltersButton";
import { SortButtonCollections } from "../../styles/SortButtonCollections";
import { StickySectionHeader } from "../../CustomModules/sticky/StickySectionHeader.js";

import "./customstyles.css";
import { positions } from "@mui/system";
import zIndex from "@mui/material/styles/zIndex";

const Discover = (props) => {
  const size = useWindowSize();

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
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [, setShowMenu] = useState(props.showMenu);
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
   * Get the collections and NFT data for the first page
   */
  const getData = async () => {
    try {
      if (isSelected) {
        if (collections.length == 0) {
          const collectionData = await (
            await getCollections(collectionParams)
          ).data;

          setCollections(collectionData.collections);
          setTotalCollections(collectionData.collectionsAmount);
          setCollectionParams((prevState) => ({
            ...prevState,
            page: prevState.page + 1,
          }));
        }
        setLoading(false);
      } else {
        if (nfts.length === 0) {
          const nftData = await (await getNFTs(nftParams)).data;

          setMaxPrice(nftData.higherPrice);
          setNfts(nftData.nfts);
          setTotalNFTs(nftData.nftsAmount);
          setNftParams((prevState) => ({
            ...prevState,
            page: prevState.page + 1,
          }));
        }
        setLoading(false);
      }
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

    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setCollections((prevState) => [...prevState, ...collectionData]);
  };

  /**
   * Update the state of the component and update the collection data
   *
   * @param {*} params - Collection Search Params
   */
  const handleChangeFilter = (params) => {
    setLoading(true);
    setCollectionParams(params);
    updateCollections(params);
  };

  /**
   * Update the collection items
   *
   * @param {*} params - Collection Search Params
   */
  const updateCollections = async (params) => {
    const collectionData = await (await getCollections(params)).data;

    setCollections(collectionData.collections);
    setTotalCollections(collectionData.collectionsAmount);
    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setLoading(false);
  };

  /**
   * Get the NFTs data for the next page
   */
  const fetchMoreNFTs = async () => {
    const nftData = await (await getNFTs(nftParams)).data.nfts;

    setNftParams({
      ...nftParams,
      page: nftParams.page + 1,
    });
    setNfts([...nfts, ...nftData]);
  };

  /**
   * Update NFT list based on the filters chosen by the user
   *
   * @param {*} params parameters used to filter query results
   */
  const handleChangeFilterNFT = (params) => {
    setLoading(true);
    setNftParams(params);
    updateNFTs(params);
  };

  /**
   * Get the filtered list of NFTs
   *
   * @param {*} params parameters used to filter query results
   */
  const updateNFTs = async (params) => {
    const nftData = await (await getNFTs(params)).data;

    setNfts(nftData.nfts);
    setMaxPrice(nftData.higherPrice);
    setTotalNFTs(nftData.nftsAmount);
    setNftParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setLoading(false);
  };

  /**
   * React Hook re-render when the Collection/NFT switch is toggled
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getData();
  }, [isSelected]);

  /**
   * Scroll listeners to close the menu on scroll
   */
  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
      setShowMenu(false);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  useEffect(() => {}, [scrolling]);

  return (
    <DiscoverSection id="scrollableDiv" style={{ zIndex: 10 }}>
      {/* Discover top Section with toggle*/}
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
                <AnimatePresence initial="false">
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
      {/*Sticky bar for collections or for NFTs  */}

      <StickySectionHeader top="90">
        {isSelected ? (
          <HStack
            background="rgb(0,0,0, 0.06)"
            padding="6px"
            border="9px"
            width="100%"
            blur="30px"
          >
            <HStack width="1200px">
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
          </HStack>
        ) : (
          <HStack
            background="rgb(0,0,0, 0.06)"
            padding="6px"
            border="9px"
            width="100%"
            blur="30px"
          >
            <HStack width="1200px">
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
          </HStack>
        )}
      </StickySectionHeader>

      {/* Content of discover filtering */}
      <ContentDiscover id="scrollableDiv" style={{ zIndex: "0" }}>
        {/* Show Collection or NFTS Content */}

        {isSelected ? (
          <VStack padding="30px 12px" style={{ zIndex: "0" }}>
            <InfiniteScroll
              dataLength={collections.length}
              next={fetchMoreCollections}
              hasMore={collections.length < totalCollections}
              scrollThreshold={0.6}
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
              style={{ overflow: "show", zIndex: -1 }}
            >
              <HStack spacing="12px" flexwrap="wrap" justify="flex-start">
                {loading ? (
                  loadingCollections.map((item) => (
                    <VStack key={item.name} minwidth="326px" height="440px">
                      <LoadingNftContainer></LoadingNftContainer>
                    </VStack>
                  ))
                ) : collections.length !== 0 ? (
                  collections.map((item) => (
                    <LayoutGroup id="collection" key={item.name}>
                      <VStack
                        width="326px"
                        height="440px"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Collection
                          key={item.name}
                          isVerified={item.creator.isVerified}
                          keyContent={item.name}
                          keyID={item.creator.userName}
                          collectionImage={item.banner.v0}
                          creatorLogo={item.logo.v0}
                          collectionName={item.name}
                          collectionDescription={item.description}
                          creatorName={item.creator.userName}
                          onClickCollection={() =>
                            props.redirect(`collection/${item.nickName}`)
                          }
                          floorprice={item.floorPrice}
                          owners={item.owners}
                          nfts={item.totalNfts}
                          volumetraded={item.volumeTrade}
                          onClickCreator={() =>
                            props.redirect(`UserProfile/${item.creator._id}`)
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
                style={{
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <VStack>
                  <HStack>
                    <HStack
                      spacing="12px"
                      flexwrap="wrap"
                      justify="flex-start"
                      padding={size.width < 1200 ? "0 12px" : "0"}
                      width="100%"
                    >
                      {loading ? (
                        loadingNFTs.map((item) => (
                          <VStack
                            minwidth="240px"
                            height="390px"
                            key={item.name}
                          >
                            <LoadingNftContainer></LoadingNftContainer>
                          </VStack>
                        ))
                      ) : nfts.length !== 0 ? (
                        nfts.map((item, i) => (
                          <VStack minwidth="240px" height="390px">
                            <NftContainer
                              key={i}
                              isVerified={item.owner.isVerified}
                              iconStatus={item.saleType.toLowerCase()}
                              hasOffers={item.hasOpenOffer}
                              creatorImage={item.owner.urlProfile}
                              itemImage={item.urlFile.v0}
                              itemPreview={item.preview.v0}
                              price={item.price}
                              collectionName={item.collectionId.name}
                              itemNumber={item.name}
                              fileType={item.fileType}
                              background={({ theme }) => theme.backElement}
                              onClick={() =>
                                props.redirect(
                                  `nft/${nftaddress}/${item.tokenId}`
                                )
                              }
                              onClickCreator={() =>
                                props.redirect(`UserProfile/${item.owner._id}`)
                              }
                              owner={true}
                              usdPrice={props.xdc}
                              collectionVerified={item.creator.isVerified}
                            ></NftContainer>
                          </VStack>
                        ))
                      ) : (
                        <VStack
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
                          <BodyBold>Oops... nothing found</BodyBold>
                          <BodyRegular animate={{ opacity: 0.6 }}>
                            Try again
                          </BodyRegular>
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
  position: relative;
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
