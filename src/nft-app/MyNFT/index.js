import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { nftaddress } from "../../config";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import { LoopLogo } from "../../styles/LoopLogo";
import emptyCollection from "../../images/emptyCollection.png";
import emptyNFT from "../../images/emptyNFT.png";
import copyIcon from "../../images/copyAddress.png";
import verified from "../../images/verified.png";
import styled from "styled-components";
import {
  HStack,
  Spacer,
  VStack,
  IconImg,
  ZStack,
  ZItem,
} from "../../styles/Stacks";
import { motion } from "framer-motion/dist/framer-motion";
import {
  BodyRegular,
  CaptionBold,
  TitleBold15,
  TitleBold18,
  CaptionBoldShort,
  TitleBold27,
  TitleSemi21,
  CaptionSmallRegular,
  TitleSemi18,
  BodyBold,
} from "../../styles/TextStyles";
import xdcLogo from "../../images/miniXdcLogo.png";

import editProfile from "../../images/editProfile.png";
import mountain from "../../images/mountain.jpg";
import exampleImage from "../../images/audioCover0.png";
import instagramColor from "../../images/instagramColor.png";
import twitterColor from "../../images/twitterColor.png";
import webColor from "../../images/webColor.png";
import walletBlue from "../../images/walletBlue.png";
import useWindowSize from "../../styles/useWindowSize";
import ButtonApp from "../../styles/Buttons";

import { appStyle } from "../../styles/AppStyles";
import { BubbleCopied } from "../../styles/BubbleCopied";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import { getNFTs } from "../../API/NFT";
import { getCollections } from "../../API/Collection";
import { getUser } from "../../API/User";
import { isImage, isVideo, isAudio } from "../../common";
import { CircleButton } from "../../styles/CircleButton";
import Pager from "react-js-pager";

const MyNFT = (props) => {
  let pagerMethods = null;

  const next_page_handle = () => {
    if (pagerMethods !== null) pagerMethods.next();
  };

  const previous_page_handle = () => {
    if (pagerMethods !== null) pagerMethods.previous();
  };

  const set_page_handle = (pageIndex) => {
    if (pagerMethods !== null) pagerMethods.setPage(pageIndex);
  };

  const { userId } = useParams();
  const size = useWindowSize();

  const [collections, setCollections] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [user, setUser] = useState({});
  const [nftParams, setNftParams] = useState({
    pageSize: 15,
    page: 1,
    userId: userId,
  });
  const [collectionParams] = useState({
    userId: userId,
  });
  const [subMenu, setSubMenu] = useState(0);
  const [, setShowMenu] = useState(props.showMenu);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();

  /**
   * Get the owned collections of the user
   */
  const getCreatedCollections = async () => {
    const collectionData = await (await getCollections(collectionParams)).data;

    setCollections(collectionData.collections);
    setLoadingCollection(false);
  };

  /**
   * Get the first page of owned NFTs of the user
   */
  const getOwnedNFTs = async () => {
    await Promise.all(
      [1, 2].map(async (i) => {
        if (i === 1) {
          let userData = await (await getUser(userId)).data.user;
          setUser(userData);
        } else {
          let nftData = await (await getNFTs(nftParams)).data;

          setNfts(nftData.nfts);
          setTotalNfts(nftData.nftsAmount);
        }
      })
    );

    setNftParams({
      ...nftParams,
      page: nftParams.page + 1,
    });
    setLoading(false);
  };

  /**
   * Get the next page of owned NFTs of the user
   */
  const fetchMoreNFTs = async () => {
    const nftData = await (await getNFTs(nftParams)).data;

    setNfts([...nfts, ...nftData.nfts]);
    setNftParams({
      ...nftParams,
      page: nftParams.page + 1,
    });
  };

  /**
   * Truncate the string to the specified number of characters
   *
   * @param {string} str the string to be truncated
   * @param {number} n the maximum number of characters to include
   * @returns the truncated string
   */
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  /**
   * React Hook to re-render the component when the userId state changes
   */
  useEffect(() => {
    window.scrollTo(0, 0);
    setSubMenu(0);
    setLoading(true);
    getOwnedNFTs();
  }, [userId]);

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

  const selection = {
    active: {
      opacity: 1,
    },
    faded: {
      opacity: 0.3,
    },
  };

  return (
    <UserSection>
      <UserProfileBack>
        <IconImg
          url={mountain}
          backsize="cover"
          width="100%"
          height="100%"
        ></IconImg>
      </UserProfileBack>

      <Content id="scrollableDiv">
        {size.width > 414 ? (
          <HStack spacing="0px" height="900px">
            <VStack spacing="30px" minwidth="70%" padding="12px 0 0 12px">
              {/* User Image, Name and Social Networks */}

              <HStack>
                {/* User image */}
                <VStack maxwidth="96px" maxheight="96px">
                  {user.isVerified ? (
                    <VerifiedIcon>
                      <IconImg
                        url={verified}
                        width="30px"
                        height="30px"
                      ></IconImg>
                    </VerifiedIcon>
                  ) : null}
                  <IconImg
                    url={user.urlProfile}
                    width="90px"
                    height="90px"
                    border="90px"
                    backsize="cover"
                    bordercolor="white"
                    bordersize="3px"
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                    }}
                  ></IconImg>
                </VStack>

                {/* Username and social networks    */}
                <VStack alignment="flex-start">
                  <TitleSemi21 textcolor="white">XDSea Creator #1</TitleSemi21>
                  <HStack spacing="12px" justify="flex-start">
                    {/* Instagram Button */}
                    <CircleButton image={instagramColor}></CircleButton>

                    {/* Twitter Button  */}
                    <CircleButton image={twitterColor}></CircleButton>

                    {/* Web Icon  */}
                    <CircleButton image={webColor}></CircleButton>

                    {/* Wallet button  */}
                    <CircleButton image={walletBlue}></CircleButton>
                  </HStack>
                </VStack>
              </HStack>

              {/* <VStack spacing="9px" direction="column">
                <CaptionBold textcolor={({ theme }) => theme.text}>
                  CREATOR
                </CaptionBold>
                <BubbleCopied
                  logo={xdcLogo}
                  address={user.XDCWallets ? user.XDCWallets[0] : ""}
                  icon={copyIcon}
                ></BubbleCopied>
              </VStack> */}

              {/* User Content */}

              <HStack spacing="30px">
                {/* Collections Button */}
                <HStack
                  onClick={() => {
                    setSubMenu(1);
                    setLoadingCollection(true);
                    getCreatedCollections();
                  }}
                  cursor={"pointer"}
                  variants={selection}
                  animate={subMenu === 1 ? "active" : "faded"}
                >
                  <TitleSemi18 cursor="pointer" textcolor="white">
                    Collections
                  </TitleSemi18>
                  <VStack
                    width="26px"
                    height="26px"
                    border="30px"
                    background={({ theme }) => theme.backElement}
                    cursor="pointer"
                  >
                    <BodyRegular>0</BodyRegular>
                  </VStack>
                </HStack>

                {/* Nft Button  */}
                <HStack
                  onClick={() => setSubMenu(0)}
                  cursor={"pointer"}
                  variants={selection}
                  animate={subMenu === 0 ? "active" : "faded"}
                >
                  <TitleSemi18 cursor="pointer" textcolor="white">
                    NFT Purchased
                  </TitleSemi18>
                  <VStack
                    width="26px"
                    height="26px"
                    border="30px"
                    background={({ theme }) => theme.backElement}
                    cursor="pointer"
                  >
                    <BodyRegular>0</BodyRegular>
                  </VStack>
                </HStack>

                <Spacer></Spacer>
              </HStack>

              <VStack width="100%" overflowy="scroll" justify="flex-start">
                {/* Content of result of filtering Owned or Created Collections */}

                <ZStack height="auto">
                  {subMenu === 0 && (
                    <VStack
                      width="100%"
                      key={"Created"}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      id={"scrollableDiv"}
                    >
                      {loading ? (
                        <VStack padding="120px">
                          <LoopLogo></LoopLogo>
                        </VStack>
                      ) : nfts.length !== 0 ? (
                        <InfiniteScroll
                          dataLength={nfts.length}
                          next={fetchMoreNFTs}
                          hasMore={nfts.length < totalNfts}
                          scrollThreshold={0.6}
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
                            width="100%"
                            justify="flex-start"
                            spacing="9px"
                          >
                            {nfts.map((item, i) => (
                              <VStack
                                minwidth={size.width < 1112 ? "166px" : "240px"}
                                maxwidth={size.width < 1112 ? "166px" : "240px"}
                                height={size.width < 1112 ? "166px" : "240px"}
                                border="15px"
                                cursor="pointer"
                                overflow="hidden"
                                background="green"
                                whileHover={{ scale: 1.01 }}
                                onClick={() => {
                                  props.redirect(
                                    `nft/${nftaddress}/${item.tokenId}`
                                  );
                                }}
                              >
                                <ZStack cursor={"pointer"}>
                                  {item.hasOpenOffer ? (
                                    <BubbleOffers>
                                      <HStack
                                        background="linear-gradient(180deg, #FF5A5A 0%, rgba(255, 90, 90, 0.88) 100%)"
                                        width="26px"
                                        height="26px"
                                        border="300px"
                                        padding="0 6px"
                                        spacing="6px"
                                      >
                                        <CaptionBoldShort textcolor="white">
                                          !
                                        </CaptionBoldShort>
                                      </HStack>
                                    </BubbleOffers>
                                  ) : null}
                                  <ZItem>
                                    {isImage(item.fileType) ? (
                                      <IconImg
                                        url={
                                          item.urlFile.v0
                                        }
                                        width="100%"
                                        height="100%"
                                        backsize="cover"
                                        border="15px"
                                      ></IconImg>
                                    ) : isVideo(item.fileType) ? (
                                      <VStack
                                        width="186px"
                                        height="186px"
                                        border="9px"
                                        overflow="hidden"
                                      >
                                        <ReactPlayer
                                          url={
                                            item.urlFile.v0
                                          }
                                          playing={true}
                                          volume={0}
                                          muted={true}
                                          loop={false}
                                          width="100%"
                                          height="160%"
                                        />
                                      </VStack>
                                    ) : isAudio(item.fileType) ? (
                                      <IconImg
                                        url={
                                          item.preview.v0
                                        }
                                        width="100%"
                                        height="100%"
                                        backsize="cover"
                                        border="15px"
                                      ></IconImg>
                                    ) : null}
                                  </ZItem>
                                  <ZItem>
                                    <VStack padding="15px">
                                      <Spacer></Spacer>
                                      <TitleBold15
                                        textcolor={appStyle.colors.white}
                                      >
                                        {item.name}
                                      </TitleBold15>
                                    </VStack>
                                  </ZItem>
                                </ZStack>
                              </VStack>
                            ))}
                          </HStack>
                        </InfiniteScroll>
                      ) : (
                        <VStack
                          border="15px"
                          width="100%"
                          minheight="300px"
                          background={({ theme }) => theme.backElement}
                        >
                          <IconImg
                            url={emptyNFT}
                            width="60px"
                            height="60px"
                          ></IconImg>
                          <BodyRegular>
                            This creator does not have any NFT yet
                          </BodyRegular>
                        </VStack>
                      )}
                    </VStack>
                  )}
                  {subMenu === 1 && (
                    <HStack flexwrap="wrap" justify="flex-start">
                      <VStack
                        background="green"
                        minwidth={size.width < 1112 ? "260px" : "330px"}
                        maxwidth={size.width < 1112 ? "260px" : "330px"}
                        height={size.width < 1112 ? "260px" : "330px"}
                        border="12px"
                      >
                        <TitleBold18 textcolor="white">
                          Collection Name Example
                        </TitleBold18>
                      </VStack>

                      <VStack
                        background="green"
                        minwidth={size.width < 1112 ? "260px" : "330px"}
                        maxwidth={size.width < 1112 ? "260px" : "330px"}
                        height={size.width < 1112 ? "260px" : "330px"}
                        border="12px"
                      >
                        <TitleBold18 textcolor="white">
                          Collection Name Example
                        </TitleBold18>
                      </VStack>

                      <VStack
                        background="green"
                        minwidth={size.width < 1112 ? "260px" : "330px"}
                        maxwidth={size.width < 1112 ? "260px" : "330px"}
                        height={size.width < 1112 ? "260px" : "330px"}
                        border="12px"
                      >
                        <TitleBold18 textcolor="white">
                          Collection Name Example
                        </TitleBold18>
                      </VStack>

                      {/* {loadingCollection ? (
                    <VStack padding="120px">
                      <LoopLogo></LoopLogo>
                    </VStack>
                  ) : collections.length ? (
                    collections.map((item, i) => (
                      <VStack width="100%" padding="30px" spacing="30px">
                        <HStack width="100%">
                          <IconImg
                            url={item.logo.v0}
                            width="60px"
                            height="60px"
                            backsize="cover"
                            border="36px"
                          ></IconImg>
                          <VStack spacing="6px" alignment="flex-start">
                            <TitleBold18>{item.name}</TitleBold18>
                            <BodyRegular>{item.totalNfts} Items</BodyRegular>
                          </VStack>
                        </HStack>
                        <HStack justify="flex-start">
                          {item.nfts.map((nft, j) => (
                            <VStack
                              maxwidth="186px"
                              height="186px"
                              border="15px"
                              whileHover={{ scale: 1.05 }}
                              overflow="hidden"
                              onClick={() => {
                                props.redirect(`nft/${nftaddress}/${nft.tokenId}`);
                              }}
                            >
                              <ZStack cursor={"pointer"}>
                                <ZItem>
                                  {isImage(nft.fileType) ? (
                                    <IconImg
                                      url={nft.urlFile.v0}
                                      width="100%"
                                      height="100%"
                                      backsize="cover"
                                      border="15px"
                                    ></IconImg>
                                  ) : isVideo(nft.fileType) ? (
                                    <VStack
                                      width="186px"
                                      height="186px"
                                      border="9px"
                                      overflow="hidden"
                                    >
                                      <ReactPlayer
                                        url={nft.urlFile.v0}
                                        playing={true}
                                        muted={true}
                                        loop={false}
                                        volume={0}
                                        width="100%"
                                        height="180%"
                                      />
                                    </VStack>
                                  ) : isAudio(nft.fileType) ? (
                                    <IconImg
                                      url={nft.urlFile.v0}
                                      width="100%"
                                      height="100%"
                                      backsize="cover"
                                      border="15px"
                                    ></IconImg>
                                  ) : null}
                                </ZItem>
                                <ZItem>
                                  <VStack padding="15px">
                                    <Spacer></Spacer>
                                    <TitleBold15
                                      textcolor={appStyle.colors.white}
                                    >
                                      {truncate(nft.name, 33)}
                                    </TitleBold15>
                                  </VStack>
                                </ZItem>
                              </ZStack>
                            </VStack>
                          ))}
                        </HStack>
                        {item.totalNfts > 5 ? (
                          <ButtonApp
                            text={"See Collection"}
                            textcolor={appStyle.colors.white}
                            border="30px"
                            onClick={() =>
                              props.redirect(`collection/${item.nickName}`)
                            }
                            btnStatus={0}
                          ></ButtonApp>
                        ) : null}
                      </VStack>
                    ))
                  ) : (
                    <VStack
                      border="15px"
                      width="100%"
                      minheight="300px"
                      background={({ theme }) => theme.backElement}
                    >
                      <IconImg
                        url={emptyCollection}
                        width="60px"
                        height="60px"
                      ></IconImg>
                      <BodyRegular>
                        This creator has not yet created any collection
                      </BodyRegular>
                    </VStack>
                  )} */}
                    </HStack>
                  )}
                </ZStack>
              </VStack>
            </VStack>

            {/* Sidebar Content         */}
            <VStack
              minwidth="30%"
              height="100%"
              padding="12px 12px 30px 0"
              alignment="flex-end"
            >
              {/* Edit button  */}
              <HStack
                background="white"
                border="30px"
                cursor="pointer"
                height="42px"
                self="none"
                spacing="6px"
                padding="0 6px 0 9px"
              >
                <BodyRegular cursor="pointer">Edit Profile</BodyRegular>
                <IconImg
                  cursor="pointer"
                  url={editProfile}
                  width="30px"
                  height="30px"
                ></IconImg>
              </HStack>

              <Spacer></Spacer>

              <HStack>
                <VStack
                  background={({ theme }) => theme.faded}
                  alignment="flex-start"
                  padding="18px"
                  border="6px"
                  maxheight="auto"
                  blur="30px"
                >
                  <BodyRegular textcolor="white">
                    We are launching a new collection in couple mins stays tuned
                    🤩
                  </BodyRegular>

                  <CaptionSmallRegular textcolor="white">
                    10 MINS AGO
                  </CaptionSmallRegular>
                </VStack>
              </HStack>

              <HStack
                height="42px"
                background={({ theme }) => theme.blue}
                border="6px"
                cursor="pointer"
                whileTap={{ scale: 0.96 }}
              >
                <BodyRegular textcolor="white" cursor="pointer">
                  Follow Creator
                </BodyRegular>
              </HStack>

              <VStack
                background={({ theme }) => theme.backElement}
                width="100%"
                minheight="560px"
                border="6px"
                padding="21px"
                alignment="flex-end"
              >
                <TitleSemi18>Activity</TitleSemi18>

                {/* Notifications */}
                <VStack
                  spacing="30px"
                  width="100%"
                  justify={"flex-start"}
                  overflowy="scroll"
                >
                  {/* Sold Notification */}
                  <HStack spacing="9px">
                    <VStack spacing="6px" alignment="flex-end">
                      <CaptionSmallRegular>
                        {" "}
                        You sold <b>Fibowall #11</b> 🎉
                      </CaptionSmallRegular>
                      <CaptionSmallRegular animate={{ opacity: 0.6 }}>
                        8 mins ago
                      </CaptionSmallRegular>
                    </VStack>

                    <IconImg
                      url={exampleImage}
                      width="33px"
                      height="33px"
                      border="3px"
                    ></IconImg>
                  </HStack>

                  {/* Offer Notification */}
                  <HStack spacing="9px">
                    <VStack spacing="6px" alignment="flex-end">
                      <CaptionSmallRegular>
                        <b>300 XDC</b>offer on <b>Fibowall #11</b> 💰
                      </CaptionSmallRegular>
                      <CaptionSmallRegular animate={{ opacity: 0.6 }}>
                        10 mins ago
                      </CaptionSmallRegular>
                    </VStack>

                    <IconImg
                      url={exampleImage}
                      width="33px"
                      height="33px"
                      border="3px"
                    ></IconImg>
                  </HStack>

                  {/* New Follower */}
                  <HStack spacing="9px">
                    <VStack spacing="6px" alignment="flex-end">
                      <CaptionSmallRegular>
                        <b>XDSeaMonkeys</b> is following you ⚡️
                      </CaptionSmallRegular>
                      <CaptionSmallRegular animate={{ opacity: 0.6 }}>
                        30 mins ago
                      </CaptionSmallRegular>
                    </VStack>

                    <IconImg
                      url={exampleImage}
                      width="33px"
                      height="33px"
                      border="3px"
                    ></IconImg>
                  </HStack>

                  <Spacer></Spacer>
                </VStack>

                <HStack height="49px">
                  {/* Tag Sold */}
                  <HStack
                    cursor="pointer"
                    whileTap={{ scale: 0.9 }}
                    self="none"
                    spacing="9px"
                  >
                    <TitleSemi21 cursor="pointer">🎉</TitleSemi21>
                    <HStack
                      cursor="pointer"
                      border="6px"
                      width="30px"
                      height="30px"
                      background={({ theme }) => theme.faded}
                    >
                      <CaptionBoldShort>1</CaptionBoldShort>
                    </HStack>
                  </HStack>

                  {/* Tag Offer */}
                  <HStack
                    cursor="pointer"
                    whileTap={{ scale: 0.9 }}
                    self="none"
                    spacing="9px"
                  >
                    <TitleSemi21 cursor="pointer">💰</TitleSemi21>
                    <HStack
                      cursor="pointer"
                      border="6px"
                      width="30px"
                      height="30px"
                      background={({ theme }) => theme.faded}
                    >
                      <CaptionBoldShort>1</CaptionBoldShort>
                    </HStack>
                  </HStack>

                  {/* Tag Follower */}
                  <HStack
                    cursor="pointer"
                    whileTap={{ scale: 0.9 }}
                    self="none"
                    spacing="9px"
                  >
                    <TitleSemi21 cursor="pointer">⚡️</TitleSemi21>
                    <HStack
                      cursor="pointer"
                      border="6px"
                      width="30px"
                      height="30px"
                      background={({ theme }) => theme.faded}
                    >
                      <CaptionBoldShort>1</CaptionBoldShort>
                    </HStack>
                  </HStack>

                  {/* All */}
                  <HStack
                    cursor="pointer"
                    whileTap={{ scale: 0.9 }}
                    self="none"
                    spacing="9px"
                  >
                    <HStack
                      cursor="pointer"
                      border="6px"
                      width="30px"
                      height="30px"
                    >
                      <CaptionBoldShort>ALL</CaptionBoldShort>
                    </HStack>
                  </HStack>
                </HStack>
              </VStack>
            </VStack>
          </HStack>
        ) : (
          <VStack padding="15px 12px 12px 12px">
            {/* App Style Design from Here */}
            <VStack maxwidth="96px" maxheight="96px">
              {user.isVerified ? (
                <VerifiedIcon>
                  <IconImg url={verified} width="30px" height="30px"></IconImg>
                </VerifiedIcon>
              ) : null}
              <IconImg
                url={user.urlProfile}
                width="90px"
                height="90px"
                border="90px"
                backsize="cover"
                bordercolor="white"
                bordersize="3px"
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                }}
              ></IconImg>
            </VStack>

            {/* Username and social networks    */}
            <VStack width="100%">
              <TitleSemi21 textcolor="white">XDSea Creator #1</TitleSemi21>
              <HStack spacing="12px" justify="center">
                {/* Instagram Button */}
                <CircleButton image={instagramColor}></CircleButton>

                {/* Twitter Button  */}
                <CircleButton image={twitterColor}></CircleButton>

                {/* Web Icon  */}
                <CircleButton image={webColor}></CircleButton>

                {/* Wallet button  */}
                <CircleButton image={walletBlue}></CircleButton>
              </HStack>
            </VStack>

            <HStack>
              <VStack
                background={({ theme }) => theme.faded}
                alignment="flex-start"
                padding="18px"
                border="6px"
                maxheight="auto"
                blur="30px"
              >
                <BodyRegular textcolor="white">
                  We are launching a new collection in couple mins stays tuned
                  🤩
                </BodyRegular>

                <CaptionSmallRegular textcolor="white">
                  10 MINS AGO
                </CaptionSmallRegular>
              </VStack>
            </HStack>

            <HStack
              height="42px"
              background={({ theme }) => theme.blue}
              border="6px"
              cursor="pointer"
              whileTap={{ scale: 0.96 }}
            >
              <BodyRegular textcolor="white" cursor="pointer">
                Follow Creator
              </BodyRegular>
            </HStack>

            <HStack spacing="30px" height="90px">
              {/* Collections Button */}
              <HStack
                onClick={() => {
                  setSubMenu(1);
                  setLoadingCollection(true);
                  getCreatedCollections();
                }}
                cursor={"pointer"}
                variants={selection}
                animate={subMenu === 1 ? "active" : "faded"}
              >
                <BodyRegular cursor="pointer">Collections</BodyRegular>
                <VStack
                  width="26px"
                  height="26px"
                  border="30px"
                  background={({ theme }) => theme.backElement}
                  cursor="pointer"
                >
                  <BodyRegular>0</BodyRegular>
                </VStack>
              </HStack>

              {/* Nft Button  */}
              <HStack
                onClick={() => setSubMenu(0)}
                cursor={"pointer"}
                variants={selection}
                animate={subMenu === 0 ? "active" : "faded"}
              >
                <BodyRegular cursor="pointer">NFT Purchased</BodyRegular>
                <VStack
                  width="26px"
                  height="26px"
                  border="30px"
                  background={({ theme }) => theme.backElement}
                  cursor="pointer"
                >
                  <BodyRegular>0</BodyRegular>
                </VStack>
              </HStack>
            </HStack>

            <Pager
              ref={(node) => (pagerMethods = node)}
              orientation="horizontal"
              animationStyle="scroll"
              wrapperStyle={{ width: "300px" }}
            >
              <VStack
                background="green"
                minwidth={size.width < 1112 ? "260px" : "330px"}
                maxwidth={size.width < 1112 ? "260px" : "330px"}
                height={size.width < 1112 ? "260px" : "330px"}
                border="12px"
              >
                <TitleBold18 textcolor="white">
                  Collection Name Example
                </TitleBold18>
              </VStack>
              {/* Page with index (0) */}
              <div className="pageContainer">...Page0 Content</div>
              {/* Page with index (1) */}
              <div className="pageContainer">...Page1 Content</div>
              {/* Page with index (2) */}
              <div className="pageContainer">...Page2 Content</div>
            </Pager>
          </VStack>
        )}
      </Content>
    </UserSection>
  );
};

export default MyNFT;

const UserSection = styled(motion.div)`
  padding: 90px 0 0 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
`;

const Content = styled(motion.div)`
  padding: 0px 0;
  max-width: 1200px;
  margin: 0 auto;

  z-index: 30px;
`;

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 8px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const VerifiedIcon = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 10;
`;

const BubbleOffers = styled(motion.div)`
  top: 12px;
  right: 12px;
  position: absolute;
  z-index: 100;
`;

const UserProfileBack = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 420px;

  z-index: -30px;
`;
