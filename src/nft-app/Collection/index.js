import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { nftaddress } from "../../config";
import ButtonApp from "../../styles/Buttons";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyRegular,
  BodyBold,
  CaptionBoldShort,
  CaptionBold,
  TitleBold21,
  TitleBold18,
} from "../../styles/TextStyles";
import instagram from "../../images/instagramColor.png";
import twitter from "../../images/twitterColor.png";
import link from "../../images/webColor.png";
import discord from "../../images/discordColor.png";

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
import { getCollection, getCollectionNFTs } from "../../API/Collection";
import { truncateAddress, toXdc, isXdc, fromXdc } from "../../common/common";
import { SearchCollection } from "../../styles/SearchCollection";
import { FiltersButton } from "../../styles/FiltersButton";
import { SortButtonNFTS } from "../../styles/SortButtonNFTS";
import noResult from "../../images/noResult.png";
import { StickySectionHeader } from "../../CustomModules/sticky/StickySectionHeader.js";
import { getXdcDomain } from "../../constant";
import { BannerMobile } from "./BannerMobile";
import { CollectionStats } from "./CollectionStats";
import { CircleButton } from "../../styles/CircleButton";
import { DynaMenu } from "../../styles/DynaMenu/DynaMenu";
import { BlockTVL } from "./TVL/BlockTVL";
import { TokenSelector } from "./TokenSelector/TokenSelector";
import { TopInventory } from "./Inventory/TopInventory";
import { HolderSection } from "./HoldersSection";
import { StakeSection } from "../Staking/StakeSection";
import { StakingModal } from "../Staking/StakingModal";
import { AddRemoveModal } from "../Staking/AddRemoveModal";
import { BackedValueModal } from "../Staking/BackedValueModal";
import { getStakingPoolsByCollection, getStakes } from "../../API/stake";
import { getNFTs } from "../../API/NFT";
import { TxModal } from "../../styles/TxModal";
import { DepositFunds, WithdrawFunds } from "../../common";
import { stakingaddress } from "../../config";

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
  const [params, setParams] = useState({
    page: 1,
  });
  const [stakingParams, setStakingParams] = useState({
    page: 1,
  });
  const [copied, setCopied] = useState(false);
  const [nftNumber, setNftNumber] = useState(0);
  const [nftPlaying, setNftPlaying] = useState([]);
  const [isStake, setIsStake] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [stakingPool, setStakingPool] = useState({});
  const [stakes, setStakes] = useState([]);
  const [addRemoveModal, setAddRemoveModal] = useState(false);
  const [backedValueModal, setBackedValueModal] = useState(false);
  const [stakingNFTs, setStakingNFTs] = useState([]);
  const [stakingNFTsNumber, setStakingNFTsNumber] = useState(0);
  const [withdrawing, setWithdrawing] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [withdrawFundPrice, setWithdrawFundPrice] = useState(0);
  const [depositFundPrice, setDepositFundPrice] = useState(0);
  const [priceIsInvalid, setPriceIsInvalid] = useState(false);

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
   */
  const getData = async () => {
    try {
      const collectionData = await (
        await getCollection(collectionNickName)
      ).data;
      let collection = {
        _id: collectionData.collection._id,
        banner: collectionData.collection.banner.v0,
        creator: await getXdcDomain(
          toXdc(collectionData.collection.addressCreator)
        ),
        addressCreator: isXdc(collectionData.collection.addressCreator)
          ? collectionData.collection.addressCreator.toLowerCase()
          : toXdc(collectionData.collection.addressCreator.toLowerCase()),
        creatorId: collectionData.collection.creator.nickName,
        isVerified: collectionData.collection.creator.isVerified,
        description: collectionData.collection.description,
        discordUrl: collectionData.collection.discordUrl,
        floorPrice: collectionData.metrics.floorPrice,
        instagramUrl: collectionData.collection.instagramUrl,
        logo: collectionData.collection.logo.v0,
        name: collectionData.collection.name,
        twitterUrl: collectionData.collection.twitterUrl,
        volumeTrade: collectionData.metrics.volumeTraded,
        websiteUrl: collectionData.collection.websiteUrl,
        nftsCount: collectionData.metrics.nftsCount,
        owners: collectionData.metrics.owners,
        isStakeable: collectionData.collection.isStakeable,
        nftContract: collectionData.collection.address,
      };
      const collectionNFTData = await (
        await getCollectionNFTs({
          ...params,
          page: 1,
          collectionId: collectionData.collection._id,
        })
      ).data;

      var collectionStakingPool = {};
      var stakingNFTsData = [];
      if (collectionData.collection.isStakeable) {
        await Promise.all(
          [1, 2].map(async (i) => {
            if (i === 1) {
              collectionStakingPool = await (
                await getStakingPoolsByCollection(collectionData.collection._id)
              ).data;
              setStakingPool(collectionStakingPool.stakingPools[0]);
            } else {
              stakingNFTsData = await (
                await getNFTs({
                  ...stakingParams,
                  page: 1,
                  collectionId: collectionData.collection._id,
                  stakeable: true,
                })
              ).data;
              setStakingNFTs(stakingNFTsData.nfts);
              setStakingNFTsNumber(stakingNFTsData.nftsAmount);
              setStakingParams({
                ...stakingParams,
                collectionId: collectionData.collection._id,
                stakeable: true,
                page: stakingParams.page + 1,
              });
            }
          })
        );
      }

      setNftNumber(collectionNFTData.nftsAmount);
      setMaxPrice(collectionNFTData.higherPrice);
      setParams({
        collectionId: collectionData.collection._id,
        page: params.page + 1,
      });
      setNfts(collectionNFTData.nfts);
      setNftPlaying(new Array(collectionNFTData.nftsAmount).fill(false));
      setCollection(collection);
      setLoadingState("loaded");
    } catch (error) {
      console.log(error);
    }
  };

  const getStakesData = async () => {
    try {
      const stakesData = await getStakes(1, collection._id);
      setStakes(stakesData.data.stakes);
    } catch (error) {
      console.log("Failed on load stakes!!", error);
    }
  };

  /**
   * Get the next page of collection NFTs
   */
  const fetchMoreNFTs = async () => {
    const collectionNFTData = await (await getCollectionNFTs(params)).data.nfts;

    setParams({
      ...params,
      page: params.page + 1,
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

    setNftNumber(collectionNFTData.nftsAmount);
    setMaxPrice(collectionNFTData.higherPrice);
    setParams({
      ...params,
      page: params.page + 1,
    });
    setNfts(collectionNFTData.nfts);
    setNftPlaying(new Array(collectionNFTData.nftsAmount).fill(false));
    setCollection(collection);
    setLoadingState("loaded");
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

  const withdrawFunds = async () => {
    try {
      const success = await WithdrawFunds(
        stakingaddress,
        props?.wallet?.address,
        withdrawFundPrice,
        "0x0000000000000000000000000000000000000000"
      );
    } catch (err) {
      console.log(err);
    }
    setWithdrawing(false);
  };

  const depositFunds = async () => {
    try {
      const success = await DepositFunds(
        stakingaddress,
        props?.wallet?.address,
        depositFundPrice,
        "0x0000000000000000000000000000000000000000"
      );
    } catch (err) {
      console.log(err);
    }
    setDepositing(false);
  };

  useEffect(() => {
    if (isStake) getStakesData();
  }, [isStake]);

  /**
   * React Hook to re-render when the search term state value is changed
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    getData();
  }, []);

  return (
    <CollectionSection>
      {addRemoveModal && (
        <AddRemoveModal
          setAddRemoveModal={setAddRemoveModal}
          nftContract={collection?.nftContract}
          collectionId={collection?._id}
          stakingPool={stakingPool}
          setNfts={setStakingNFTs}
          setNftsCount={setStakingNFTsNumber}
          setStakingParams={setStakingParams}
          stakingParams={stakingParams}
          wallet={props?.wallet}
        ></AddRemoveModal>
      )}
      {backedValueModal && (
        <BackedValueModal
          setBackedValueModal={setBackedValueModal}
          nftContract={collection?.nftContract}
          collectionId={collection?._id}
          stakingPool={stakingPool}
          setNfts={setStakingNFTs}
          setNftsCount={setStakingNFTsNumber}
          setStakingParams={setStakingParams}
          stakingParams={stakingParams}
          wallet={props?.wallet}
        ></BackedValueModal>
      )}
      {withdrawing && (
        <TxModal
          isWithdrawFund={true}
          cancelWithdrawFund={() => {
            setWithdrawing(false);
          }}
          withdrawFunds={() => withdrawFunds()}
          onChangeWithdrawFunds={(event) => {
            setPriceIsInvalid(false);
            setWithdrawFundPrice(event.target.value);
          }}
          priceInvalid={priceIsInvalid}
          withdrawFundPrice={withdrawFundPrice}
        ></TxModal>
      )}
      {depositing && (
        <TxModal
          isDepositFund={true}
          cancelDepositFund={() => {
            setDepositing(false);
          }}
          depositFunds={() => depositFunds()}
          onChangeDepositFunds={(event) => {
            setPriceIsInvalid(false);
            setDepositFundPrice(event.target.value);
          }}
          priceInvalid={priceIsInvalid}
          depositFundPrice={depositFundPrice}
        ></TxModal>
      )}
      {/* Banner */}
      <BannerAbsolute>
        <IconImg
          url={collection.banner}
          width="100%"
          height={size.width > 428 ? "369px" : "269px"}
          backsize="cover"
          key="imageBanner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></IconImg>
      </BannerAbsolute>

      {size.width > 710 ? (
        <HStack style={{ zIndex: 1 }} padding="0 9px">
          <VStack
            padding="69px 0 0 0"
            spacing="15px"
            maxwidth="1200px"
            cursor={"pointer"}
            style={{ zIndex: 1 }}
          >
            <VStack
              width={"100%"}
              height={size.width < 768 ? "90px" : "290px"}
              alignment="flex-start"
              padding="30px 0"
            >
              {/* Share Collection to Socials Link */}
              <SocialAbsolute>
                <HStack
                  justify="flex-start"
                  border="30px"
                  padding="0 15px"
                  spacing="15px"
                  height="42px"
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
                    <IconImg
                      url={copiedLink}
                      width="28px"
                      height="28px"
                    ></IconImg>
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
                </HStack>
              </SocialAbsolute>

              {/* Creator Tag */}
              <CreatorAbsolute>
                <HStack
                  onClick={() => props.redirect(`user/${collection.creatorId}`)}
                  border="0 6px 6px 0"
                  padding={"6px 9px"}
                  height="42px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                  cursor={"pointer"}
                  background={({ theme }) => theme.backElement}
                >
                  <VStack
                    spacing="0px"
                    alignment="flex-start"
                    cursor={"pointer"}
                  >
                    <CaptionBold textcolor={({ theme }) => theme.text}>
                      CREATOR
                    </CaptionBold>
                    <HStack spacing="6px">
                      {collection.addressCreator ? (
                        <Tooltip title={collection.addressCreator}>
                          <CaptionBold textcolor={({ theme }) => theme.text}>
                            {collection.creator !== ""
                              ? collection.creator
                              : truncateAddress(collection.addressCreator)}
                          </CaptionBold>
                        </Tooltip>
                      ) : (
                        <LoopBars width="115px" heigth="90px"></LoopBars>
                      )}

                      {collection.isVerified ? (
                        <IconImg
                          cursor={"pointer"}
                          url={verified}
                          width="15px"
                          height="15px"
                        ></IconImg>
                      ) : null}
                    </HStack>
                  </VStack>
                </HStack>
              </CreatorAbsolute>
              {/* Collection Logo */}
              <IconImg
                url={collection.logo}
                width="150px"
                height="150px"
                border="9px"
                bordersize="6px"
                bordercolor="white"
                backsize="cover"
                style={{
                  boxShadow: "0px 3px 9px 0px rgba(0, 0, 0, 0.3)",
                }}
              ></IconImg>

              {/* Collection Name */}
              <HStack self="none">
                <VStack
                  background={({ theme }) => theme.walletButton}
                  padding="6px 15px"
                  border="9px"
                  spacing="3px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                  alignment="flex-start"
                >
                  <CaptionBold initial={{ opacity: 0.6 }} textcolor="white">
                    COLLECTION
                  </CaptionBold>

                  <TitleBold18
                    align="center"
                    textcolor={({ theme }) => theme.walletText}
                  >
                    {collection.name}
                  </TitleBold18>
                </VStack>

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
                      <CircleButton
                        image={twitter}
                        background={"#151515"}
                      ></CircleButton>
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
                      <CircleButton
                        image={instagram}
                        background={"#151515"}
                      ></CircleButton>
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
                      <CircleButton
                        image={discord}
                        background={"#151515"}
                      ></CircleButton>
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
                      <CircleButton
                        image={link}
                        background={"#151515"}
                      ></CircleButton>
                    </a>
                  ) : (
                    <></>
                  )}
                </HStack>
              </HStack>

              {/* Collection Statistics */}
              <CollectionStats
                owners={collection.owners}
                nftsCount={collection.nftsCount}
                floorPrice={
                  collection.floorPrice > 100000
                    ? Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 2,
                      }).format(collection.floorPrice)
                    : collection.floorPrice?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) || "0"
                }
                volumeTrade={
                  collection.volumeTrade > 100000
                    ? Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 2,
                      }).format(collection.volumeTrade)
                    : collection.volumeTrade?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) || "0"
                }
                width="390px"
              ></CollectionStats>
            </VStack>

            {/* Collection Description */}
            <VStack
              padding="15px 60px"
              maxwidth="1200px"
              background={({ theme }) => theme.backElement}
              border="6px"
            >
              {collection.description !== undefined ? (
                <BodyRegular
                  textcolor={({ theme }) => theme.text}
                  align="flex-start"
                >
                  {collection.description}
                </BodyRegular>
              ) : (
                <VStack maxwidth="1200px">
                  <LoopBars width="340px"></LoopBars>
                  <LoopBars width="300px"></LoopBars>
                </VStack>
              )}
            </VStack>
          </VStack>
        </HStack>
      ) : (
        <BannerMobile
          style={{ zIndex: 2000 }}
          collectionImage={collection.logo}
          collectionName={collection.name}
          addressCreator={
            collection.creator !== ""
              ? collection.creator
              : truncateAddress(collection.addressCreator)
          }
          onClickCreator={() => props.redirect(`user/${collection.creatorId}`)}
          owners={collection.owners}
          isVerified={collection.isVerified}
          nftCount={collection.nftsCount}
          collectionNickName={collectionNickName}
          floorPrice={
            collection.floorPrice > 100000
              ? Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                }).format(collection.floorPrice)
              : collection.floorPrice?.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) || "0"
          }
          volumeTrade={
            collection.volumeTrade > 100000
              ? Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 2,
                }).format(collection.volumeTrade)
              : collection.volumeTrade?.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) || "0"
          }
          collectionDescription={collection.description}
          twitterUrl={collection.twitterUrl}
          instagramUrl={collection.instagramUrl}
          discordUrl={collection.discordUrl}
          websiteUrl={collection.websiteUrl}
        ></BannerMobile>
      )}

      {/* Collection NFTs */}

      <CollectionContent id="scrollableDiv">
        {/* Collection NFT Cards */}
        {isStake ? (
          <StakeSection
            nfts={stakingNFTs}
            setNfts={setStakingNFTs}
            usdPrice={props.xdc}
            stakingPool={stakingPool}
            stakes={stakes}
            onClickAR={() => {
              setAddRemoveModal(true);
            }}
            onClickBV={() => {
              setBackedValueModal(true);
            }}
            setStakingPool={setStakingPool}
            wallet={props?.wallet}
            isCreator={
              collection?.addressCreator?.toLowerCase() ===
              isXdc(props?.wallet?.address)
                ? fromXdc(props?.wallet?.address)
                : props?.wallet?.address
            }
            nftsCount={stakingNFTsNumber}
            setNftsCount={setStakingNFTsNumber}
            setWithdrawModal={setWithdrawing}
            setDepositModal={setDepositing}
            redirect={props?.redirect}
          ></StakeSection>
        ) : (
          <InfiniteScroll
            dataLength={nfts.length}
            next={fetchMoreNFTs}
            hasMore={nfts.length < nftNumber}
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
                      // minwidth={size.width > 425 ? "300px" : "300px"}
                      // width={"240px"}
                      minwidth={size.width > 425 ? "290px" : "100%"}
                      maxwidth="290px"
                      height={size.width > 425 ? "290px" : "380px"}
                      key={"collectionStack_" + item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <NftContainer
                        hasStaking={item.isStakeable}
                        elementKey={"collection_" + item._id}
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
                        collectionVerified={item.owner.isVerified}
                        setIsPlaying={handleNFTLongPress}
                        isPlaying={nftPlaying[i]}
                        nftIndex={i}
                        border={"6px"}
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
        )}
      </CollectionContent>

      <BottomStick>
        <DynaMenu
          isCollections={false}
          handleFilterNFTs={handleChangeFilterNFT}
          nftParams={params}
          isStake={isStake}
          setIsStake={setIsStake}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          isStakingEnabled={collection?.isStakeable}
        ></DynaMenu>
      </BottomStick>
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
  padding: 0px 0;
  width: 100%;

  position: relative;
`;

const BannerAbsolute = styled(motion.div)`
  position: absolute;
  width: 100%;
`;

const CreatorAbsolute = styled(motion.div)`
  position: absolute;
  top: 75px;
  left: 145px;
`;

const SocialAbsolute = styled(motion.div)`
  position: absolute;
  bottom: 45px;
  right: 0px;
`;

const BottomStick = styled(motion.div)`
  position: fixed;
  bottom: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;
