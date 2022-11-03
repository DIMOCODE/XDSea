import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { VStack, HStack, ZItem, ZStack, IconImg } from "../../styles/Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  TitleBold27,
  TitleRegular27,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
import DiscoverBar from "../../images/newBlue.png";
import { SortButtonCollections } from "../../styles/SortButtonCollections";
import useWindowSize from "../../styles/useWindowSize";
import { FiltersButton } from "../../styles/FiltersButton";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import noResult from "../../images/noResult.png";
import { useLocation } from "react-router-dom";
import { getCollections } from "../../API/Collection";
import { getNFTs } from "../../API/NFT";
import { LoopLogo } from "../../styles/LoopLogo";
import InfiniteScroll from "react-infinite-scroll-component";
import { NftContainer } from "../../styles/NftContainer";
import { nftaddress } from "../../config";
import { LayoutGroup } from "framer-motion/dist/framer-motion";
import { Collection } from "../../styles/Collections/Collection";
import { StickySectionHeader } from "../../CustomModules/sticky/StickySectionHeader.js";
import { SearchCollection } from "../../styles/SearchCollection";
import { isXdc, toXdc } from "../../common/common";
import { TabBar } from "../Discover/TabBar";
import seamless from "../../images/newBlue.png";
import { DynaMenu } from "../../styles/DynaMenu/DynaMenu";
import { TitleBold18 } from "../../styles/TextStyles";

function SearchPage(props) {
  const size = useWindowSize();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm"));
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
    searchBy: searchTerm,
  });
  const [nftParams, setNftParams] = useState({
    page: 1,
    searchBy: searchTerm,
  });
  const [newResults, setNewResults] = useState(true);
  const [maxPrice, setMaxPrice] = useState(0);
  const [nftPlaying, setNftPlaying] = useState([]);
  const [isStake, setIsStake] = useState(false);
  const [minPrice, setMinPrice] = useState(0);

  /**
   * Get a list of collections based on the search results and filter
   *
   * @param {*} params the collection parameters for filtering
   */
  const getCollectionData = async (params) => {
    const collectionResults = await (await getCollections(params)).data;
    setCollectionData(collectionResults.collections);
    setTotalCollections(collectionResults.collectionsAmount);
    setLoading(false);
    setCollectionParams((prevState) => ({
      ...prevState,
      page: params.page + 1,
      searchBy: params.searchBy,
    }));
  };

  /**
   * Get the next page of collections
   */
  const fetchMoreCollections = async () => {
    const collectionResults = await (
      await getCollections(collectionParams)
    ).data;
    setCollectionData([...collectionData, ...collectionResults.collections]);
    console.log(collectionParams);
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

  /**
   * Update the list of collections with the new parameters
   *
   * @param {*} params the collection filter parameters
   */
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

  /**
   * Get a list of NFTs
   *
   * @param {*} params the NFT parameters for filtering
   */
  const getNFTData = async (params) => {
    const nftResults = await (await getNFTs(params)).data;

    setMaxPrice(nftResults.higherPrice);
    setNftData(nftResults.nfts);
    setTotalNFTs(nftResults.nftsAmount);
    setNftPlaying(new Array(nftResults.nftsAmount).fill(false));
    setLoading(false);
    setNftParams((prevState) => ({
      ...prevState,
      page: params.page + 1,
      searchBy: params.searchBy,
    }));
  };

  /**
   * Get the next page of NFTs
   */
  const fetchMoreNFTs = async () => {
    const nftResults = await (await getNFTs(nftParams)).data;

    console.log(nftParams);
    setNftData([...nftData, ...nftResults.nfts]);
    setNftParams({
      ...nftParams,
      page: nftParams.page + 1,
    });
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
    const nftResults = await (await getNFTs(params)).data;

    setMaxPrice(nftResults.higherPrice);
    setNftData(nftResults.nfts);
    setNftParams((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
    setTotalNFTs(nftResults.nftsAmount);
    setNftPlaying(new Array(nftResults.nftsAmount).fill(false));
    setLoading(false);
  };

  const handleNFTLongPress = (i, isNew) => {
    if (!isNew) {
      setNftPlaying((prevState) => {
        prevState[i] = !prevState[i];
        return [...prevState];
      });
    } else {
      const newNftPlaying = new Array(nftPlaying.length).fill(false);
      newNftPlaying[i] = !newNftPlaying[i];
      setNftPlaying([...newNftPlaying]);
    }
  };

  const tabDidChange = (status) => {
    if (status) {
      if (newResults) {
        setLoading(true);
        getCollectionData(collectionParams);
      }
      setNewResults(false);
      var newurl =
        location.pathname + `?searchTerm=${searchTerm}&mode=collection`;
      window.history.replaceState({ path: newurl }, "", newurl);
    } else {
      if (newResults) {
        setLoading(true);
        getNFTData(nftParams);
      }
      setNewResults(false);
      var newurl = location.pathname + `?searchTerm=${searchTerm}&mode=nft`;
      window.history.replaceState({ path: newurl }, "", newurl);
    }
    setIsSelected(status);
  };

  /**
   * React Hook to re-render the component when the search term is updated
   */
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (isSelected) {
        var newurl =
          location.pathname + `?searchTerm=${searchTerm}&mode=collection`;
        window.history.replaceState({ path: newurl }, "", newurl);
        getCollectionData({ page: 1, searchBy: searchTerm });
        setNftParams({ page: 1, searchBy: searchTerm });
      } else {
        var newurl = location.pathname + `?searchTerm=${searchTerm}&mode=nft`;
        window.history.replaceState({ path: newurl }, "", newurl);
        getNFTData({ page: 1, searchBy: searchTerm });
        setCollectionParams({ page: 1, searchBy: searchTerm });
      }
      setNewResults(true);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <SearchSection id="scrollableDiv">
      {/* Top Banner */}
      <HStack
        backgroundimage={seamless}
        padding="60px 0 0 0"
        style={{ zIndex: "1" }}
      >
        <VStack
          width="1200px"
          height="147px"
          spacing="36px"
          padding="69px 12px 0px 12px"
        >
          <TitleBold27 textcolor={appStyle.colors.white}>
            Search results for: "{searchTerm}"
          </TitleBold27>

          {/* TabBar */}
          <TabBar
            onClick={tabDidChange}
            initialTab={isSelected ? true : false}
          ></TabBar>
        </VStack>
      </HStack>

      <ContentSearch id="scrollableDiv">
        {/* Content results depending of search query */}

        {isSelected ? (
          <VStack padding="30px 12px" style={{ zIndex: "0" }}>
            <InfiniteScroll
              dataLength={collectionData.length}
              next={fetchMoreCollections}
              hasMore={collectionData.length < totalCollections}
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
                  <VStack minheight="300px">
                    <LoopLogo></LoopLogo>
                  </VStack>
                ) : collectionData.length !== 0 ? (
                  collectionData.map((item, i) => (
                    <LayoutGroup id="collection" key={item.name}>
                      <VStack
                        minwidth="290px"
                        height="380px"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Collection
                          key={item.name}
                          isVerified={item.creator.isVerified}
                          keyContent={item.name}
                          keyID={item.creator._id}
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
                          sortFloor={collectionParams.sortBy === "floorPrice"}
                          sortOwners={collectionParams.sortBy === "owners"}
                          sortNFTs={collectionParams.sortBy === "nfts"}
                          sortVolume={collectionParams.sortBy === "volumeTrade"}
                          onClickCreator={() =>
                            props.redirect(`user/${item.creator.nickName}`)
                          }
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
          <VStack spacing="30px" padding="30px 12px">
            {loading ? (
              <HStack height="360px">
                <LoopLogo></LoopLogo>
              </HStack>
            ) : nftData.length !== 0 ? (
              <InfiniteScroll
                dataLength={nftData.length}
                next={fetchMoreNFTs}
                hasMore={nftData.length < totalNFTs}
                loader={
                  <HStack
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    minheight="360px"
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
                        <VStack minwidth="240px" height="390px" key={i}>
                          <NftContainer
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
                                `nft/${
                                  isXdc(item.nftContract)
                                    ? item.nftContract.toLowerCase()
                                    : toXdc(item.nftContract.toLowerCase())
                                }/${item.tokenId}`
                              )
                            }
                            onClickCreator={() =>
                              props.redirect(`user/${item.owner.nickName}`)
                            }
                            owner={true}
                            usdPrice={props.xdc}
                            collectionVerified={item.creator.isVerified}
                            setIsPlaying={handleNFTLongPress}
                            isPlaying={nftPlaying[i]}
                            nftIndex={i}
                            border="6px"
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
                  style={{ zIndex: "-50" }}
                  border="6px"
                  spacing="9px"
                >
                  <IconImg url={noResult} width="90px" height="90px"></IconImg>
                  <BodyBold>Oops... nothing found</BodyBold>
                  <BodyRegular animate={{ opacity: 0.6 }}>
                    Try again
                  </BodyRegular>
                </VStack>
              </>
            )}
          </VStack>
        )}
      </ContentSearch>
      <BottomStick>
        <DynaMenu
          isCollections={isSelected}
          handleFilterCollections={handleChangeFilter}
          handleFilterNFTs={handleChangeFilterNFT}
          collectionParams={collectionParams}
          nftParams={nftParams}
          isStake={isStake}
          setIsStake={setIsStake}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          isStakingEnabled={true}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        ></DynaMenu>
      </BottomStick>
    </SearchSection>
  );
}

export { SearchPage };

const SearchSection = styled(motion.div)`
  padding: 0px 0;
  width: 100%;
`;

const ContentSearch = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const BottomStick = styled(motion.div)`
  position: fixed;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;
