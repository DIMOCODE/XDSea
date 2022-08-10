import React, { 
  useEffect, 
  useState 
} from "react";
import styled from "styled-components";
import {
  VStack,
  HStack,
  ZItem,
  ZStack,
  IconImg,
} from "../../styles/Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionBoldShort,
  TitleBold27,
  TitleRegular27,
} from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import { 
  AnimatePresence, 
  motion 
} from "framer-motion/dist/framer-motion";
import DiscoverBar from "../../images/DiscoverBar.png";
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
import { Collection } from "../../styles/Collection";
import { isSafari } from "../../common/common";
import { StickySectionHeader } from "@mayank1513/sticky-section-header";
import { SearchCollection } from "../../styles/SearchCollection";

function SearchPage(props) {
  const size = useWindowSize();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm"));
  const [isSelected, setIsSelected] = useState(
    searchParams.get("mode") === "nft" 
      ? false 
      : true
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
  const [newResults, setNewResults] = useState(true);
  const [maxPrice, setMaxPrice] = useState(0);

  /**
   * Get a list of collections
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
      searchTerm: params.searchTerm,
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

    setNftData([...nftData, ...nftResults.nfts]);
    setNftParams({ 
      ...nftParams, 
      page: nftParams.page + 1 
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
      page: prevState.page + 1 
    }));
    setTotalNFTs(nftResults.nftsAmount);
    setLoading(false);
  };

  /**
   * React Hook to re-render the component when the search term is updated
   */
  useEffect(async () => {
    setLoading(true);
    if (isSelected) {
      var newurl =
        location.pathname + `?searchTerm=${searchTerm}&mode=collection`;
      window.history.replaceState({ path: newurl }, "", newurl);
      getCollectionData({ page: 1, searchTerm: searchTerm });
      setNftParams({ page: 1, searchBy: searchTerm });
    } else {
      var newurl = location.pathname + `?searchTerm=${searchTerm}&mode=nft`;
      window.history.replaceState({ path: newurl }, "", newurl);
      getNFTData({ page: 1, searchBy: searchTerm });
      setCollectionParams({ page: 1, searchTerm: searchTerm });
    }
    setNewResults(true);
  }, [searchTerm]);

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

          {/* Toggle between NFTs and Collections */}
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
                      if (newResults) {
                        setLoading(true);
                        getCollectionData(collectionParams);
                      }
                      setNewResults(false);
                      var newurl =
                        location.pathname + `?${searchTerm}&mode=collection`;
                      window.history.replaceState({ path: newurl }, "", newurl);
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
                      if (newResults) {
                        setLoading(true);
                        getNFTData(nftParams);
                      }
                      setNewResults(false);
                      var newurl =
                        location.pathname + `?${searchTerm}&mode=nft`;
                      window.history.replaceState({ path: newurl }, "", newurl);
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
        {/* Sticky bar with filters and sort for NFT and Collections */}
        <StickySectionHeader top="90">
          {isSelected ? (
            <HStack
              background="rgb(0,0,0, 0.06)"
              padding="6px"
              border="9px"
              width="100%"
              blur="39px"
            >
              <FiltersButton
                onChange={handleChangeFilter}
                params={collectionParams}
                isNftFilter={false}
                isSearchPage={true}
                switched={isSelected}
              ></FiltersButton>
              <SearchCollection
                inputId={"searchPageCollection"}
                placeholder={searchTerm}
                onClickIcon={(searchWord) => {
                  setSearchTerm(searchWord);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(e.target.value);
                  }
                }}
              ></SearchCollection>
              <SortButtonCollections
                onChange={handleChangeFilter}
                params={collectionParams}
                isSearchPage={true}
              ></SortButtonCollections>
            </HStack>
          ) : (
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
                switched={isSelected}
                isSearchPage={true}
                maxPrice={maxPrice}
              ></FiltersButton>
              <SearchCollection
                inputId={"searchPageNFT"}
                placeholder={searchTerm}
                onClickIcon={(searchWord) => {
                  setSearchTerm(searchWord);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchTerm(e.target.value);
                  }
                }}
              ></SearchCollection>
              <SortButtonNFTS
                onChange={handleChangeFilterNFT}
                params={nftParams}
                isSearchPage={true}
              ></SortButtonNFTS>
            </HStack>
          )}
        </StickySectionHeader>

        {/* Content results depending of search query */}

        {isSelected ? (
          <VStack style={{ zIndex: "20" }} spacing="30px" padding="30px 12px">
            {loading ? (
              <VStack minheight="300px">
                <LoopLogo></LoopLogo>
              </VStack>
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
                                props.redirect(`collection/${item.nickName}`)
                              }
                              floorprice={item.floorPrice}
                              owners={item.owners}
                              nfts={item.totalNfts}
                              volumetraded={item.volumeTrade}
                              sortFloor={
                                collectionParams.sortBy === "floorPrice"
                              }
                              sortOwners={collectionParams.sortBy === "owners"}
                              sortNFTs={collectionParams.sortBy === "nfts"}
                              sortVolume={
                                collectionParams.sortBy === "volumeTrade"
                              }
                              onClickCreator={() =>
                                props.redirect(`UserProfile/${item.creator._id}`)
                              }
                              xdc={props.xdc}
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
                  style={{ zIndex: "-50" }}
                  border="6px"
                >
                  <IconImg url={noResult} width="90px" height="90px"></IconImg>
                  <BodyBold>Oops... nothing here</BodyBold>
                  <BodyRegular animate={{ opacity: 0.6 }}>
                    Try again
                  </BodyRegular>
                </VStack>
              </>
            )}
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
                        <VStack minwidth="240px" height="390px">
                          <NftContainer
                            key={i}
                            isVerified={item.owner.isVerified}
                            iconStatus={item.saleType.toLowerCase()}
                            hasOffers={item.hasOpenOffer}
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
                              props.redirect(`nft/${nftaddress}/${item.tokenId}`)
                            }
                            onClickCreator={() =>
                              props.redirect(`UserProfile/${item.creator._id}`)
                            }
                            owner={true}
                            usdPrice={props.xdc}
                            collectionVerified={item.creator.isVerified}
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
