import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import styled from "styled-components";
import {
  VStack,
  HStack,
  Spacer,
  ZItem,
  ZStack,
  IconImg,
} from "../../styles/Stacks";
import {
  CaptionBoldShort,
  TitleBold18,
  TitleBold27,
  TitleRegular27,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";

import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import DiscoverBar from "../../images/DiscoverBar.png";
import { SortButtonCollections } from "../../styles/SortButtonCollections";
import useWindowSize from "../../styles/useWindowSize";
import { FiltersButton } from "../../styles/FiltersButton";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import noResult from "../../images/noResult.png";
import { useHistory, useLocation } from "react-router-dom";
import { getCollections } from "../../API/Collection";
import { getNFTs } from "../../API/NFT";
import { LoopLogo } from "../../styles/LoopLogo";
import InfiniteScroll from "react-infinite-scroll-component";
import { NftContainer } from "../../styles/NftContainer";
import banner1 from "../../images/Banner1.jpg";
import { nftaddress } from "../../config";
import { LayoutGroup } from "framer-motion/dist/framer-motion";
import { Collection } from "../../styles/Collection";
import { isSafari } from "../../common/common";

function SearchPage(props) {
  const size = useWindowSize();
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("searchTerm");
  const [isSelected, setIsSelected] = useState(
    searchParams.get("mode") === "nft" ? false : true
  );
  const [collectionData, setCollectionData] = useState([]);
  const [totalCollections, setTotalCollections] = useState(0);
  const [nftData, setNftData] = useState([]);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [collectionParams, setCollectionParams] = useState({
    page: 1,
    searchTerm: searchTerm,
  });
  const [nftParams, setNftParams] = useState({
    page: 1,
    searchBy: searchTerm,
  });

  const getCollectionData = async () => {
    const collectionResults = await (
      await getCollections(collectionParams)
    ).data;
    setCollectionData(collectionResults.collections);
    setTotalCollections(collectionResults.collectionsAmount);
    console.log(collectionResults);
    setLoading(false);
    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
  };

  const fetchMoreCollections = async () => {
    const collectionResults = await (
      await getCollections(collectionParams)
    ).data;
    setCollectionData([...collectionData, ...collectionResults.collections]);
    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
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

  const updateCollections = async (params) => {
    setLoading(true);
    const collectionResults = await (await getCollections(params)).data;
    setCollectionData(collectionResults.collections);
    setCollectionParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setTotalCollections(collectionResults.collectionsAmount);
    setLoading(false);
  };

  const getNFTData = async () => {
    const nftResults = await (await getNFTs(nftParams)).data;
    setNftData(nftResults.nfts);
    setTotalNFTs(nftResults.nftsAmount);
    console.log(nftResults);
    setLoading(false);
    setNftParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
  };

  const fetchMoreNFTs = async () => {
    const nftResults = await (await getNFTs(nftParams)).data;
    setNftData([...nftData, ...nftResults.nfts]);
    setNftParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
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

  const updateNFTs = async (params) => {
    setLoading(true);
    const nftResults = await (await getNFTs(params)).data;
    setNftData(nftResults.nfts);
    setNftParams((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    setTotalNFTs(nftResults.nftsAmount);
    setLoading(false);
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  useEffect(async () => {
    if (isSelected) {
      getCollectionData();
    } else {
      getNFTData();
    }
  }, []);

  return (
    <SearchSection id="scrollableDiv">
      {/* Top Banner */}
      <HStack backgroundimage={DiscoverBar}>
        <HStack
          width="1200px"
          height="157px"
          padding="0px 30px"
          alignment="center"
          responsive="true"
        >
          <HStack
            width="100%"
            justify={size.width > 1023 ? "flex-start" : "center"}
          >
            <TitleRegular27 textcolor={appStyle.colors.white}>
              Search results for:
            </TitleRegular27>
            <TitleBold27
              textcolor={appStyle.colors.white}
            >{`"${searchTerm}"`}</TitleBold27>
          </HStack>

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
                    onClick={async () => {
                      if (collectionData.length == 0) {
                        setLoading(true);
                        getCollectionData();
                      }
                      setIsSelected(true);
                    }}
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
                    onClick={async () => {
                      if (nftData.length == 0) {
                        setLoading(true);
                        getNFTData();
                      }
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

      <ContentSearch id="scrollableDiv">
        {isSelected ? (
          <VStack style={{ zIndex: "20" }} spacing="30px">
            <HStack
              style={{ zIndex: 1 }}
              background="rgb(0,0,0, 0.06)"
              padding="6px"
              border="9px"
              width="100%"
            >
              <FiltersButton
                onChange={handleChangeFilter}
                params={collectionParams}
                isNftFilter={false}
                isSearchPage={true}
              ></FiltersButton>
              <Spacer></Spacer>
              <SortButtonCollections
                onChange={handleChangeFilter}
                params={collectionParams}
                isSearchPage={true}
              ></SortButtonCollections>
            </HStack>

            {loading ? (
              <LoopLogo></LoopLogo>
            ) : collectionData.length !== 0 ? (
              <InfiniteScroll
                dataLength={collectionData.length}
                next={fetchMoreCollections}
                hasMore={collectionData.length < totalCollections}
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
                <VStack
                  spacing="30px"
                  padding={size.width < 1200 ? "0 12px" : "0"}
                >
                  <HStack>
                    <HStack spacing="12px" flexwrap="wrap" justify="flex-start">
                      {collectionData.map((item) => (
                        <LayoutGroup id="collection" key={item.name}>
                          <VStack width="326px" height="440px">
                            <Collection
                              key={item.name}
                              isVerified={item.creator.isVerified}
                              keyContent={item.name}
                              keyID={item.creator._id}
                              collectionImage={
                                isSafari ? item.banner.v1 : item.banner.v0
                              }
                              creatorLogo={
                                isSafari ? item.logo.v1 : item.logo.v0
                              }
                              collectionName={item.name}
                              collectionDescription={item.description}
                              creatorName={item.creator.userName}
                              onClickCollection={() =>
                                NavigateTo(`collection/${item.nickName}`)
                              }
                              floorprice={item.floorPrice}
                              owners={item.owners}
                              nfts={item.totalNfts}
                              volumetraded={item.volumeTrade}
                              onClickCreator={() =>
                                NavigateTo(`UserProfile/${item.creator._id}`)
                              }
                            ></Collection>
                          </VStack>
                        </LayoutGroup>
                      ))}
                    </HStack>
                  </HStack>
                </VStack>
              </InfiniteScroll>
            ) : (
              <>
                <VStack
                  padding="90px"
                  width="100%"
                  background={({ theme }) => theme.faded}
                  style={{ zIndex: "-50" }}
                  border="6px"
                >
                  <IconImg url={noResult} width="90px" height="90px"></IconImg>
                  <TitleBold18 animate={{ opacity: 0.6 }}>
                    Nothing Found
                  </TitleBold18>
                </VStack>
              </>
            )}
          </VStack>
        ) : (
          <VStack spacing="30px">
            {/* Filter and Sort for NFTs  */}
            <HStack
              style={{ zIndex: 1 }}
              background="rgb(0,0,0, 0.06)"
              padding="6px"
              border="9px"
            >
              <FiltersButton
                isNftFilter={true}
                onChange={handleChangeFilterNFT}
                params={nftParams}
                isSearchPage={true}
              ></FiltersButton>
              <Spacer></Spacer>
              <SortButtonNFTS
                onChange={handleChangeFilterNFT}
                params={nftParams}
                isSearchPage={true}
              ></SortButtonNFTS>
            </HStack>
            {loading ? (
              <LoopLogo></LoopLogo>
            ) : nftData.length !== 0 ? (
              <InfiniteScroll
                dataLength={nftData.length}
                next={fetchMoreNFTs}
                hasMore={nftData.length < totalNFTs}
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
                <VStack
                  spacing="30px"
                  padding={size.width < 1200 ? "0 12px" : "0"}
                >
                  <HStack>
                    <HStack spacing="12px" flexwrap="wrap" justify="flex-start">
                      {nftData.map((item, i) => (
                        <VStack minwidth="240px" height="390px">
                          <NftContainer
                            key={i}
                            isVerified={item.owner.isVerified}
                            iconStatus={item.saleType}
                            hasOffers={item.hasOpenOffer ? true : false}
                            creatorImage={item.owner.urlProfile}
                            itemImage={
                              isSafari ? item.urlFile.v1 : item.urlFile.v0
                            }
                            price={item.price}
                            collectionName={item.collectionId.name}
                            itemNumber={item.name}
                            fileType={item.fileType}
                            background={({ theme }) => theme.backElement}
                            onClick={() =>
                              NavigateTo(`nft/${nftaddress}/${item.tokenId}`)
                            }
                            onClickCreator={() =>
                              NavigateTo(`UserProfile/${item.creator._id}`)
                            }
                            owner={true}
                            usdPrice={props.xdc}
                          ></NftContainer>
                        </VStack>
                      ))}
                    </HStack>
                  </HStack>
                </VStack>
              </InfiniteScroll>
            ) : (
              <>
                {/* Empty state no results */}
                <VStack
                  padding="90px"
                  width="100%"
                  background={({ theme }) => theme.faded}
                  style={{ zIndex: "-50" }}
                  border="6px"
                >
                  <IconImg url={noResult} width="90px" height="90px"></IconImg>
                  <TitleBold18 animate={{ opacity: 0.6 }}>
                    Nothing Found
                  </TitleBold18>
                </VStack>
              </>
            )}
          </VStack>
        )}
      </ContentSearch>
    </SearchSection>
  );
}

export { SearchPage };

const SearchSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.06);
`;

const ContentSearch = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;
