import React, { 
  useEffect, 
  useState
} from "react";
import { useParams } from "react-router-dom";
import { nftaddress } from "../../config";
import ButtonApp from "../../styles/Buttons";
import { 
  HStack, 
  IconImg, 
  Spacer, 
  VStack 
} from "../../styles/Stacks";
import {
  BodyRegular,
  BodyBold,
  CaptionBoldShort,
  CaptionBold,
  TitleBold21,
} from "../../styles/TextStyles";
import instagram from "../../images/instagramMini.png";
import twitter from "../../images/twitter.png";
import link from "../../images/link.png";
import discord from "../../images/discordIcon.png";
import miniXdcLogo from "../../images/miniXdcLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { NftContainer } from "../../styles/NftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopBars } from "../../styles/LoopBars";
import { LoopLogo } from "../../styles/LoopLogo";
import { Tooltip } from "@mui/material";
import verified from "../../images/verified.png";
import linkSocial from "../../images/linkSocial.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import copiedLink from "../../images/oklink.png";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import { 
  getCollection, 
  getCollectionNFTs 
} from "../../API/Collection";
import { 
  isSafari, 
  truncateAddress 
} from "../../common/common";
import { SearchCollection } from "../../styles/SearchCollection";
import { FiltersButton } from "../../styles/FiltersButton";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import noResult from "../../images/noResult.png";
import { StickySectionHeader } from "@mayank1513/sticky-section-header";

const CollectionPage = (props) => {
  const size = useWindowSize();
  const { collectionNickName } = useParams();
  
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [collection, setCollection] = useState({});
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
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [params, setParams] = useState({
    page: 1,
    searchBy: searchTerm,
  });
  const [copied, setCopied] = useState(false);
  
  const webLink = `https://www.xdsea.com/collection/${collectionNickName}`;

  /**
   * Copy the current location URL to the clipboard
   */
  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /**
   * Get collection NFT data for the first page
   * 
   * @param {string} searchBy search word to filter NFT results
   */
  const getData = async (searchBy) => {
    try {
      const collectionData = await ( await getCollection(collectionNickName)).data;
      let collection = {
        _id: collectionData.collection._id,
        banner: isSafari
          ? collectionData.collection.banner.v1
          : collectionData.collection.banner.v0,
        creator: collectionData.collection.addressCreator,
        creatorId: collectionData.collection.creator._id,
        isVerified: collectionData.collection.creator.isVerified,
        description: collectionData.collection.description,
        discordUrl: collectionData.collection.discordUrl,
        floorPrice: collectionData.collection.floorPrice,
        instagramUrl: collectionData.collection.instagramUrl,
        logo: isSafari
          ? collectionData.collection.logo.v1
          : collectionData.collection.logo.v0,
        name: collectionData.collection.name,
        twitterUrl: collectionData.collection.twitterUrl,
        volumeTrade: collectionData.collection.volumeTrade,
        websiteUrl: collectionData.collection.websiteUrl,
        nftsCount: collectionData.metrics.nftsCount,
        owners: collectionData.metrics.owners,
      };
      const collectionNFTData = await ( await getCollectionNFTs({
        ...params,
        collectionId: collectionData.collection._id,
        searchBy: searchBy,
      })).data;

      setMaxPrice(collectionNFTData.higherPrice);
      setParams({
        collectionId: collectionData.collection._id,
        searchBy: searchBy,
        page: params.page + 1,
      });
      setNfts(collectionNFTData.nfts);
      setCollection(collection);
      setLoadingState("loaded");
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get the next page of collection NFTs
   */
  const fetchMoreNFTs = async () => {
    const collectionNFTData = await (await getCollectionNFTs(params)).data.nfts;

    setParams({ 
      ...params, 
      page: params.page + 1 
    });
    setNfts([...nfts, ...collectionNFTData]);
  };

  /**
   * Update NFT list based on the filters chosen by the user
   * 
   * @param {*} params parameters used to filter query results
   */
  const handleChangeFilterNFT = (params) => {
    setLoadingState("not-loaded");
    setParams(params);
    updateNFTs(params);
  };

  /**
   * Get the filtered list of collection NFTs
   * 
   * @param {*} params parameters used to filter query results
   */
  const updateNFTs = async (params) => {
    const collectionNFTData = await (await getCollectionNFTs(params)).data;

    setMaxPrice(collectionNFTData.higherPrice);
    setParams({ 
      ...params, 
      page: params.page + 1 
    });
    setNfts(collectionNFTData.nfts);
    setCollection(collection);
    setLoadingState("loaded");
  };

  /**
   * React Hook to re-render when the search term state value is changed
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    getData(searchTerm);
  }, [searchTerm]);

  return (
    <CollectionSection>
      {/* Banner */}
      <BannerAbsolute>
        <IconImg
          url={collection.banner}
          width="100%"
          height="355px"
          backsize="cover"
          key="imageBanner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></IconImg>
      </BannerAbsolute>
      <HStack style={{ zIndex: 1 }}>
        <VStack
          padding={
            size.width < 768 ? "260px 30px 30px 30px" : "260px 30px 30px 30px"
          }
          spacing="15px"
          maxwidth="1200px"
          cursor={"pointer"}
          style={{ zIndex: 1 }}
        >
          {/* Creator Tag */}
          <CreatorAbsolute>
            <HStack
              onClick={() => props.redirect(`UserProfile/${collection.creatorId}`)}
              border="30px"
              padding="6px 15px"
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
              }}
              cursor={"pointer"}
              background={({ theme }) => theme.backElement}
            >
              {collection.isVerified ? (
                <IconImg
                  cursor={"pointer"}
                  url={verified}
                  width="21px"
                  height="21px"
                ></IconImg>
              ) : null}
              <VStack spacing="0px" alignment="flex-start" cursor={"pointer"}>
                <CaptionBold textcolor={({ theme }) => theme.text}>
                  CREATOR
                </CaptionBold>
                {collection.creator ? (
                  <Tooltip title={nfts[0]?.collectionCreator}>
                    <CaptionBold textcolor={({ theme }) => theme.text}>
                      {truncateAddress(collection.creator)}
                    </CaptionBold>
                  </Tooltip>
                ) : (
                  <LoopBars width="115px" heigth="90px"></LoopBars>
                )}
              </VStack>
            </HStack>
          </CreatorAbsolute>

          {/* Share Collection to Socials Link */}
          <SocialAbsolute>
            <VStack
              justify="flex-start"
              border="9px"
              padding="12px 6px"
              spacing="15px"
              background={({ theme }) => theme.backElement}
            >
              <CaptionBoldShort>SHARE</CaptionBoldShort>

              <FacebookShareButton
                url={webLink}
                quote={"Check out this NFT Collection!"}
                hashtag={["#XDSea"]}
                description={"XDSea"}
                className="Demo__some-network__share-button"
              >
                <a>
                  <IconImg
                    url={facebookSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </FacebookShareButton>
              <TwitterShareButton
                title={"Check out this NFT Collection!"}
                url={webLink}
                hashtags={["XDSea", "BuildItOnXDC"]}
              >
                <a>
                  <IconImg
                    url={twitterSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </TwitterShareButton>
              <TelegramShareButton
                title={"Check out this NFT Collection!"}
                url={webLink}
              >
                <a>
                  <IconImg
                    url={telegramSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </TelegramShareButton>
              <WhatsappShareButton
                title={"Check out this NFT Collection!"}
                url={webLink}
              >
                <a>
                  <IconImg
                    url={whatsSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </WhatsappShareButton>

              {copied ? (
                <IconImg url={copiedLink} width="28px" height="28px"></IconImg>
              ) : (
                <a>
                  <IconImg
                    onClick={copy}
                    url={linkSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              )}
            </VStack>
          </SocialAbsolute>

          <VStack
            width={size.width < 768 ? "100%" : "500px"}
            height={size.width < 768 ? "90px" : "290px"}
          >
            {/* Collection Logo */}
            <IconImg
              url={collection.logo}
              width="150px"
              height="150px"
              border="150px"
              bordersize="6px"
              bordercolor="white"
              backsize="cover"
              style={{
                boxShadow: "0px 3px 9px 0px rgba(0, 0, 0, 0.3)",
              }}
            ></IconImg>
            <HStack>
              <Spacer></Spacer>

              {/* Collection Name */}
              <HStack
                background={({ theme }) => theme.walletButton}
                padding="6px 15px"
                border="9px"
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                <TitleBold21
                  align="center"
                  textcolor={({ theme }) => theme.walletText}
                >
                  {collection.name}
                </TitleBold21>
              </HStack>

              <Spacer></Spacer>
            </HStack>

            {/* Collection Statistics */}
            <HStack height={"auto"} spacing="12px" responsive={true}>
              <HStack width="100%">
                <VStack
                  spacing="9px"
                  border="9px"
                  padding="18px 0"
                  background={({ theme }) => theme.backElement}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <HStack spacing="6px">
                    <IconImg
                      url={miniXdcLogo}
                      width="18px"
                      height="18px"
                    ></IconImg>
                    {collection.floorPrice !== undefined ? (
                      <BodyBold textcolor={({ theme }) => theme.text}>
                        {collection.floorPrice > 100000
                          ? Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 2,
                            }).format(collection.floorPrice)
                          : collection.floorPrice.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            }) || "0"}
                      </BodyBold>
                    ) : (
                      <LoopBars width="54px"></LoopBars>
                    )}
                  </HStack>
                  <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                    Floor Price
                  </CaptionBoldShort>
                </VStack>
                <VStack
                  border="9px"
                  padding="18px 0"
                  spacing="9px"
                  background={({ theme }) => theme.backElement}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {collection.owners !== undefined ? (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {collection.owners}
                    </BodyBold>
                  ) : (
                    <LoopBars width="54px"></LoopBars>
                  )}
                  <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                    Owners
                  </CaptionBoldShort>
                </VStack>
              </HStack>

              <HStack width="100%">
                <VStack
                  border="9px"
                  padding="18px 0"
                  background={({ theme }) => theme.backElement}
                  spacing="9px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {collection.nftsCount ? (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {collection.nftsCount}
                    </BodyBold>
                  ) : (
                    <LoopBars width="54px"></LoopBars>
                  )}
                  <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                    NFTs
                  </CaptionBoldShort>
                </VStack>
                <VStack
                  border="9px"
                  padding="18px 0"
                  background={({ theme }) => theme.backElement}
                  spacing="9px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <HStack spacing="6px">
                    <IconImg
                      url={miniXdcLogo}
                      width="18px"
                      height="18px"
                    ></IconImg>
                    {collection.volumeTrade !== undefined ? (
                      <BodyBold textcolor={({ theme }) => theme.text}>
                        {collection.volumeTrade > 100000
                          ? Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 2,
                            }).format(collection.volumeTrade)
                          : collection.volumeTrade.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            }) || "0"}
                      </BodyBold>
                    ) : (
                      <LoopBars width="54px"></LoopBars>
                    )}
                  </HStack>
                  <CaptionBoldShort
                    align="center"
                    textcolor={({ theme }) => theme.text}
                  >
                    Volume Traded
                  </CaptionBoldShort>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          {/* Collection Description */}
          <VStack width={size.width < 768 ? "100%" : "60%"} padding="15px">
            {collection.description !== undefined ? (
              <BodyRegular textcolor={({ theme }) => theme.text} align="center">
                {collection.description}
              </BodyRegular>
            ) : (
              <VStack>
                <LoopBars width="340px"></LoopBars>
                <LoopBars width="300px"></LoopBars>
              </VStack>
            )}

            {/* Collection Social Links */}
            <HStack>
              {collection.twitterUrl ? (
                <a
                  href={collection.twitterUrl}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={twitter}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {collection.instagramUrl ? (
                <a
                  href={collection.instagramUrl}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={instagram}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {collection.discordUrl ? (
                <a
                  href={collection.discordUrl}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={discord}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {collection.websiteUrl ? (
                <a
                  href={collection.websiteUrl}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={link}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
            </HStack>
          </VStack>
        </VStack>
      </HStack>

      {/* Collection NFTs */}
      <CollectionContent id="scrollableDiv">
        <StickySectionHeader top="90">
          {/* Filters Search and Sort */}
          <HStack
            responsive="true"
            spacing="6px"
            padding=" 6px"
            blur="30px"
            border="6px"
          >
            <SearchCollection
              inputId={"collectionNFT"}
              placeholder="Search inside the collection"
              onClickIcon={(searchWord) => {
                setSearchTerm(searchWord);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(e.target.value);
                }
              }}
            ></SearchCollection>
            <HStack>
              <FiltersButton
                isNftFilter={true}
                onChange={handleChangeFilterNFT}
                params={params}
                maxPrice={maxPrice}
              ></FiltersButton>
              <SortButtonNFTS
                onChange={handleChangeFilterNFT}
                params={params}
                isSearchPage={true}
              ></SortButtonNFTS>
            </HStack>
          </HStack>
        </StickySectionHeader>

        {/* Collection NFT Cards */}
        <InfiniteScroll
          dataLength={nfts.length}
          next={fetchMoreNFTs}
          hasMore={nfts.length < collection.nftsCount}
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
          <HStack
            flexwrap="wrap"
            padding="30px 6px"
            justify={size.width < 768 ? "center" : "flex-start"}
            spacing="9px"
          >
            {loadingState === "loaded" ? (
              nfts.length !== 0 ? (
                nfts.map((item, i) => (
                  <VStack
                    minwidth={size.width < 768 ? "100%" : "300px"}
                    width={"240px"}
                    height="450px"
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <NftContainer
                      key={i}
                      isVerified={item.owner.isVerified}
                      iconStatus={item.saleType.toLowerCase()}
                      hasOffers={item.hasOpenOffer}
                      creatorImage={item.owner.urlProfile}
                      itemImage={isSafari
                        ? item.urlFile.v1
                        : item.urlFile.v0
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
                        props.redirect(`UserProfile/${item.owner._id}`)
                      }
                      owner={true}
                      usdPrice={props.xdc}
                      collectionVerified={item.owner.isVerified}
                    ></NftContainer>
                  </VStack>
                ))
              ) : (
                <VStack
                  padding="90px"
                  width="100%"
                  background={({ theme }) => theme.faded}
                  style={{ zIndex: "-50" }}
                  border="6px"
                >
                  <IconImg url={noResult} width="90px" height="90px"></IconImg>
                  <BodyBold>Oops... nothing found</BodyBold>
                  <BodyRegular animate={{ opacity: 0.6 }}>
                    Try again
                  </BodyRegular>
                </VStack>
              )
            ) : (
              loadingNFTs.map((item) => (
                <VStack
                  minwidth={size.width < 768 ? "100%" : "300px"}
                  width={"240px"}
                  height="450px"
                  key={item.id}
                >
                  <LoadingNftContainer></LoadingNftContainer>
                </VStack>
              ))
            )}
          </HStack>
        </InfiniteScroll>
      </CollectionContent>
    </CollectionSection>
  );
};

export default CollectionPage;

const CollectionContent = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const CollectionSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.04);
  position: relative;
`;

const BannerAbsolute = styled(motion.div)`
  position: absolute;
  width: 100%;
`;

const CreatorAbsolute = styled(motion.div)`
  position: absolute;
  top: 15px;
  left: 15px;
`;

const SocialAbsolute = styled(motion.div)`
  position: absolute;
  top: 15px;
  right: 15px;
`;
