import React, { useEffect, useState, useCallback } from "react";
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
  TitleRegular18,
} from "../../styles/TextStyles";
import xdcLogo from "../../images/miniXdcLogo.png";

import uploadIcon from "../../images/uploadiconwhite.png";
import addIcon from "../../images/addIcon.png";
import crossIcon from "../../images/crossIcon.png";
import minusIcon from "../../images/minusIcon.png";
import editProfile from "../../images/editProfile.png";
import mountain from "../../images/mountain.jpg";
import exampleImage from "../../images/audioCover0.png";
import instagramColor from "../../images/instagramColor.png";
import twitterColor from "../../images/twitterColor.png";
import webColor from "../../images/webColor.png";
import walletBlue from "../../images/walletBlue.png";
import useWindowSize from "../../styles/useWindowSize";
import ButtonApp from "../../styles/Buttons";
import newBlue from "../../images/newBlue.webp";

import { appStyle } from "../../styles/AppStyles";
import { BubbleCopied } from "../../styles/BubbleCopied";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import { getNFTs } from "../../API/NFT";
import { getCollections } from "../../API/Collection";
import { getUser } from "../../API/User";
import { isImage, isVideo, isAudio } from "../../common";
import { CircleButton } from "../../styles/CircleButton";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "./styles.css";

import { InputStyled } from "../../styles/InputStyled";

import { UploadMultimedia } from "../../styles/UploadMultimedia";
import { Activity } from "./Activity";
import { CollectionTab } from "./CollectionTab";

const MyNFT = (props) => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [isInstaAdded, setIsInstaAdded] = useState(false);
  const [isTweetAdded, setIsTweetAdded] = useState(false);
  const [isWebAdded, setIsWebAdded] = useState(false);
  const [isDarkUI, setIsDarkUI] = useState(false);
  const [isAdjust, setIsAdjust] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  const heights = [100, 590, 300];

  let position = Math.round(Math.random() * 2);

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

  const [width, setWidth] = React.useState(200);
  const [height, setHeight] = React.useState(200);

  const [target, setTarget] = React.useState();
  const [frame, setFrame] = React.useState({
    translate: [0, 0],
  });
  React.useEffect(() => {
    setTarget(document.querySelector(".target"));
  }, []);

  // First Uploader

  const [image, setImage] = useState({ preview: "", raw: "" });

  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image.raw);

    await fetch("YOUR_URL", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  };

  // Second Uploader

  const [banner, setBanner] = useState({ preview: "", raw: "" });

  const handleChangeBanner = (e) => {
    if (e.target.files.length) {
      setBanner({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleUploadBanner = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", banner.raw);

    await fetch("YOUR_URL", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
  };

  return (
    <UserSection>
      {size.width > 414 ? (
        <ZStack>
          <ZItem>
            <VStack width="100%" height="900px" justify="flex-start">
              <VStack
                width="100%"
                minwidth="100%"
                maxheight="522px"
                overflowx="hidden"
              >
                <IconImg
                  url={banner.preview}
                  backsize="cover"
                  width="100%"
                  height="100%"
                ></IconImg>
              </VStack>
            </VStack>
          </ZItem>

          {isEditing ? (
            <ZItem>
              <Content>
                <VStack height="900px">
                  <HStack
                    width="100%"
                    spacing="0%"
                    height="552px"
                    alignment="flex-start"
                    self="none"
                    padding="90px 0 0 0"
                  >
                    <VStack
                      minwidth="70%"
                      height="420px"
                      alignment="flex-start"
                      padding="24px 0 12px 12px"
                    >
                      <HStack>
                        {/* User image uploader*/}
                        <VStack
                          maxwidth="96px"
                          maxheight="96px"
                          cursor="pointer"
                        >
                          <ZStack
                            cursor="pointer"
                            width="90px"
                            minheight="90px"
                            overflow="auto"
                          >
                            <ZItem>
                              <HStack
                                width="90px"
                                height="90px"
                                border="90px"
                                background={"rgba(0,0,0,0.3)"}
                              >
                                <IconImg
                                  url={uploadIcon}
                                  width="30px"
                                  height="30px"
                                ></IconImg>
                              </HStack>
                            </ZItem>
                            <ZItem>
                              <label htmlFor="upload-button">
                                {image.preview ? (
                                  <IconImg
                                    whileTap={{ scale: 0.97 }}
                                    cursor="pointer"
                                    url={image.preview}
                                    width="90px"
                                    height="90px"
                                    border="90px"
                                    backsize="cover"
                                    bordercolor="white"
                                    bordersize="3px"
                                    style={{
                                      boxShadow:
                                        "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                                    }}
                                  ></IconImg>
                                ) : (
                                  <>
                                    <IconImg
                                      whileTap={{ scale: 0.97 }}
                                      cursor="pointer"
                                      url={""}
                                      width="90px"
                                      height="90px"
                                      border="90px"
                                      backsize="cover"
                                      bordercolor="white"
                                      bordersize="3px"
                                      style={{
                                        boxShadow:
                                          "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                                      }}
                                    ></IconImg>
                                  </>
                                )}
                              </label>
                              <input
                                type="file"
                                id="upload-button"
                                style={{ display: "none" }}
                                onChange={handleChange}
                              />
                            </ZItem>
                          </ZStack>

                          <CaptionBoldShort textcolor="white" align="center">
                            UPLOAD USER PROFILE
                          </CaptionBoldShort>
                        </VStack>

                        {/* Username and social networks selector    */}
                        <VStack alignment="flex-start">
                          <VStack spacing="9px" alignment="flex-start">
                            <CaptionBoldShort textcolor="white">
                              EDIT CREATOR NAME
                            </CaptionBoldShort>

                            <InputStyled
                              placeholder="XDSEA Creator #1"
                              fontsize="21px"
                              textcolor="white"
                              background={"rgba(0,0,0,0.3)"}
                            ></InputStyled>
                          </VStack>

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

                      <Spacer></Spacer>
                      <VStack width="300px">
                        {/* Add instagram input     */}

                        <HStack>
                          <InputStyled
                            icon={instagramColor}
                            background={({ theme }) => theme.faded}
                            placeholder="Add Instagram"
                            textcolor="white"
                            iconRight=""
                            iconLeft="15px"
                            padding="0  0 0  42px"
                          ></InputStyled>

                          {isInstaAdded ? (
                            <HStack
                              width="42px"
                              height="36px"
                              border="36px"
                              background="white"
                              cursor="pointer"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setIsInstaAdded(false)}
                            >
                              <IconImg
                                url={minusIcon}
                                width="18px"
                                height="18px"
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                          ) : (
                            <HStack
                              width="42px"
                              height="36px"
                              border="36px"
                              background="white"
                              cursor="pointer"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setIsInstaAdded(true)}
                            >
                              <IconImg
                                url={addIcon}
                                width="18px"
                                height="18px"
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                          )}
                        </HStack>

                        {/* Add twitter input     */}

                        <HStack>
                          <InputStyled
                            icon={twitterColor}
                            background={({ theme }) => theme.faded}
                            placeholder="Add Twitter account"
                            textcolor="white"
                            iconRight=""
                            iconLeft="15px"
                            padding="0  0 0  42px"
                          ></InputStyled>

                          {isTweetAdded ? (
                            <HStack
                              width="42px"
                              height="36px"
                              border="36px"
                              background="white"
                              cursor="pointer"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setIsTweetAdded(false)}
                            >
                              <IconImg
                                url={minusIcon}
                                width="18px"
                                height="18px"
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                          ) : (
                            <HStack
                              width="42px"
                              height="36px"
                              border="36px"
                              background="white"
                              cursor="pointer"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setIsTweetAdded(true)}
                            >
                              <IconImg
                                url={addIcon}
                                width="18px"
                                height="18px"
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                          )}
                        </HStack>

                        {/* Add website input     */}
                        <HStack>
                          <InputStyled
                            icon={webColor}
                            background={({ theme }) => theme.faded}
                            placeholder="Add website"
                            textcolor="white"
                            iconRight=""
                            iconLeft="15px"
                            padding="0  0 0  42px"
                          ></InputStyled>

                          {isWebAdded ? (
                            <HStack
                              width="42px"
                              height="36px"
                              border="36px"
                              background="white"
                              cursor="pointer"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setIsWebAdded(false)}
                            >
                              <IconImg
                                url={minusIcon}
                                width="18px"
                                height="18px"
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                          ) : (
                            <HStack
                              width="42px"
                              height="36px"
                              border="36px"
                              background="white"
                              cursor="pointer"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setIsWebAdded(true)}
                            >
                              <IconImg
                                url={addIcon}
                                width="18px"
                                height="18px"
                                cursor="pointer"
                              ></IconImg>
                            </HStack>
                          )}
                        </HStack>
                      </VStack>
                    </VStack>

                    <VStack
                      // background="pink"
                      height="420px"
                      minwidth="30%"
                      alignment="flex-end"
                      padding="12px 12px 12px 0"
                    >
                      {/* Close button  */}
                      <HStack
                        background="white"
                        border="30px"
                        cursor="pointer"
                        height="42px"
                        self="none"
                        spacing="6px"
                        padding="6px 10px"
                        onClick={() => setIsEditing(false)}
                      >
                        <IconImg
                          cursor="pointer"
                          url={crossIcon}
                          width="21px"
                          height="21px"
                        ></IconImg>
                      </HStack>

                      <HStack width="100%" justify="flex-end">
                        <HStack
                          background="rgba(0, 0, 0, 0.21)"
                          height="42px"
                          width="240px"
                          spacing="0px"
                          border="6px"
                          blur="30px"
                          overflowx="hidden"
                        >
                          <Selector>
                            <AnimatePresence initial="false">
                              <HStack
                                width="100%"
                                justify={isDarkUI ? "flex-start" : "flex-end"}
                              >
                                <HStack
                                  height="42px"
                                  width="120px"
                                  background="rgba(0, 0, 0, 0.52)"
                                  border="6px"
                                  cursor="pointer"
                                  layout
                                ></HStack>
                              </HStack>
                            </AnimatePresence>
                          </Selector>

                          <HStack
                            width="100%"
                            cursor="pointer"
                            onClick={() => setIsDarkUI(true)}
                          >
                            <CaptionBoldShort
                              cursor="pointer"
                              textcolor="white"
                            >
                              DARK UI
                            </CaptionBoldShort>
                          </HStack>
                          <HStack
                            width="100%"
                            onClick={() => setIsDarkUI(false)}
                            cursor="pointer"
                          >
                            <CaptionBoldShort
                              textcolor="white"
                              cursor="pointer"
                            >
                              CLEAN UI
                            </CaptionBoldShort>
                          </HStack>
                        </HStack>
                      </HStack>

                      <Spacer></Spacer>

                      <label htmlFor="upload-button-banner">
                        <HStack
                          width="240px"
                          overflowx="hidden"
                          self="none"
                          style={{
                            boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.6)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          cursor="pointer"
                          border="6px"
                        >
                          <IconImg
                            url={banner.preview}
                            width="100%"
                            height="120px"
                            border="6px"
                            backsize="cover"
                            cursor="pointer"
                          ></IconImg>

                          <OverImage>
                            <VStack
                              background="rgba(0,0,0,0.3)"
                              border="6px"
                              cursor="pointer"
                            >
                              <IconImg
                                url={uploadIcon}
                                width="30px"
                                height="30px"
                                cursor="pointer"
                              ></IconImg>
                              <CaptionBoldShort
                                textcolor="white"
                                cursor="pointer"
                              >
                                CHANGE BANNER IMAGE
                              </CaptionBoldShort>
                            </VStack>
                          </OverImage>
                        </HStack>
                      </label>
                      <input
                        type="file"
                        id="upload-button-banner"
                        style={{ display: "none" }}
                        onChange={handleChangeBanner}
                      />
                    </VStack>
                  </HStack>
                  {/* Buttons */}
                  <HStack>
                    <HStack
                      height="42px"
                      background="white"
                      width="210px"
                      border="6px"
                      cursor="pointer"
                      whileTap={{ scale: 0.98 }}
                      style={{
                        boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <BodyRegular cursor="pointer">Cancel</BodyRegular>
                    </HStack>
                    <HStack
                      height="42px"
                      background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                      width="210px"
                      border="6px"
                      cursor="pointer"
                      whileTap={{ scale: 0.98 }}
                      style={{
                        boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <BodyRegular cursor="pointer" textcolor="white">
                        Save Changes
                      </BodyRegular>
                    </HStack>
                  </HStack>
                  <Spacer></Spacer>
                </VStack>
              </Content>
            </ZItem>
          ) : (
            <ZItem>
              <Content>
                <HStack
                  spacing="0px"
                  width="100%"
                  height="390px"
                  padding="90px 0 0 0"
                >
                  <VStack
                    spacing="30px"
                    minwidth="70%"
                    padding="12px 0 0 12px"
                    justify="flex-start"
                  >
                    {/* User Image, Name and Social Networks */}

                    <HStack>
                      {/* User image */}
                      <VStack maxwidth="96px" height="96px">
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
                        <TitleSemi21 textcolor="white">
                          XDSea Creator #1
                        </TitleSemi21>
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

                    {/* Filter Buttons */}

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

                    {subMenu === 0 && (
                      <HStack justify="flex-start" spacing="9px">
                        <CollectionTab name="Tab 1"></CollectionTab>
                        <CollectionTab name="Tab 2"></CollectionTab>
                        <CollectionTab name="Tab 3"> </CollectionTab>
                      </HStack>
                    )}
                  </VStack>

                  {/* Sidebar Content         */}
                  <VStack
                    minwidth="30%"
                    height="100%"
                    padding="12px 12px 30px 0"
                    alignment="flex-end"
                    justify="flex-start"
                    spacing="21px"
                  >
                    {/* Edit button  */}
                    <HStack
                      background="white"
                      border="30px"
                      cursor="pointer"
                      minheight="42px"
                      self="none"
                      spacing="6px"
                      padding="0 6px 0 9px"
                      onClick={() => setIsEditing(true)}
                    >
                      <BodyRegular cursor="pointer">Edit Profile</BodyRegular>
                      <IconImg
                        cursor="pointer"
                        url={editProfile}
                        width="30px"
                        height="30px"
                      ></IconImg>
                    </HStack>

                    <HStack>
                      <VStack
                        background={({ theme }) => theme.faded}
                        alignment="flex-start"
                        padding="18px 18px 12px 18px"
                        border="6px"
                        maxheight="auto"
                        blur="30px"
                      >
                        {newMessage ? (
                          <VStack>
                            <BodyRegular textcolor="white">
                              We are launching a new collection in couple mins
                              stays tuned 🤩
                            </BodyRegular>
                            <HStack>
                              <CaptionSmallRegular textcolor="white">
                                10 MINS AGO
                              </CaptionSmallRegular>

                              <Spacer></Spacer>

                              <HStack
                                background="white"
                                padding="6px 12px"
                                border="6px"
                                cursor="pointer"
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setNewMessage(false)}
                              >
                                <CaptionSmallRegular cursor="pointer">
                                  NEW
                                </CaptionSmallRegular>
                              </HStack>
                            </HStack>
                          </VStack>
                        ) : (
                          <InputStyled
                            background="transparent"
                            textcolor="white"
                            placeholder="Leave a new message here"
                          ></InputStyled>
                        )}
                      </VStack>
                    </HStack>

                    {newMessage ? (
                      <HStack
                        minheight="42px"
                        background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                        border="6px"
                        cursor="pointer"
                        whileTap={{ scale: 0.98 }}
                      >
                        <BodyRegular textcolor="white" cursor="pointer">
                          Follow Creator
                        </BodyRegular>
                      </HStack>
                    ) : (
                      <HStack width="100%">
                        <HStack
                          width="100%"
                          minheight="42px"
                          background={({ theme }) => theme.backElement}
                          border="6px"
                          cursor="pointer"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setNewMessage(true)}
                        >
                          <BodyRegular cursor="pointer">Cancel</BodyRegular>
                        </HStack>
                        <HStack
                          width="100%"
                          minheight="42px"
                          background="linear-gradient(166.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
                          border="6px"
                          cursor="pointer"
                          whileTap={{ scale: 0.98 }}
                        >
                          <BodyRegular textcolor="white" cursor="pointer">
                            Publish New
                          </BodyRegular>
                        </HStack>
                      </HStack>
                    )}

                    {/* <Activity></Activity> */}
                  </VStack>
                </HStack>

                {console.log(heights[position])}
                {/* Collection or NFT Purchased  */}
                <HStack>
                  <ZStack height="auto" width="100%" padding="0 0 12px 0">
                    {/* <HStack background="green" padding="30px">
                      <VStack
                        width="100%"
                        height={heights[position] + "px"}
                        background="pink"
                      >
                        Test sizes
                      </VStack>
                      <VStack
                        height={heights[position] + "px"}
                        width="100%"
                        background="pink"
                      >
                        Test sizes
                      </VStack>
                      <VStack
                        height={heights[position] + "px"}
                        width="100%"
                        background="pink"
                      >
                        Test sizes
                      </VStack>
                    </HStack> */}

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
                              spacing="6px"
                              padding="12px"
                            >
                              {nfts.map((item, i) => (
                                <VStack
                                  minwidth="23%"
                                  width="23%"
                                  height="300px"
                                  border="15px"
                                  cursor="pointer"
                                  overflow="hidden"
                                  whileHover={{ scale: 1.009 }}
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
                                          url={item.urlFile.v0}
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
                                            url={item.urlFile.v0}
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
                                          url={item.preview.v0}
                                          width="100%"
                                          height="100%"
                                          backsize="cover"
                                          border="15px"
                                        ></IconImg>
                                      ) : null}
                                    </ZItem>
                                    <ZItem>
                                      <VStack
                                        padding="15px"
                                        background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                                        border="9px"
                                      >
                                        <Spacer></Spacer>
                                        <BodyRegular
                                          textcolor={appStyle.colors.white}
                                        >
                                          {item.name}
                                        </BodyRegular>
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
                      <HStack
                        flexwrap="wrap"
                        justify="flex-start"
                        padding="12px"
                      >
                        <ZStack
                          maxwidth="49%"
                          height={size.width < 1112 ? "320px" : "490px"}
                          border="9px"
                          padding="12px"
                          overflow="hidden"
                        >
                          <ZItem>
                            <IconImg
                              url={mountain}
                              width="100%"
                              height="100%"
                              backsize="cover"
                              border="9px"
                            ></IconImg>
                          </ZItem>
                          <ZItem>
                            <VStack
                              background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                              width="100%"
                              height="100%"
                              border="12px"
                              padding="12px"
                            >
                              <Spacer></Spacer>
                              <BodyRegular textcolor="white">
                                Collection Name Example
                              </BodyRegular>
                            </VStack>
                          </ZItem>
                        </ZStack>
                        <ZStack
                          maxwidth="49%"
                          height={size.width < 1112 ? "320px" : "490px"}
                          border="9px"
                          padding="12px"
                          overflow="hidden"
                        >
                          <ZItem>
                            <IconImg
                              url={mountain}
                              width="100%"
                              height="100%"
                              backsize="cover"
                              border="9px"
                            ></IconImg>
                          </ZItem>
                          <ZItem>
                            <VStack
                              background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                              width="100%"
                              height="100%"
                              border="12px"
                              padding="12px"
                            >
                              <Spacer></Spacer>
                              <BodyRegular textcolor="white">
                                Collection Name Example
                              </BodyRegular>
                            </VStack>
                          </ZItem>
                        </ZStack>

                        <ZStack
                          maxwidth="49%"
                          height={size.width < 1112 ? "320px" : "490px"}
                          border="9px"
                          padding="12px"
                          overflow="hidden"
                        >
                          <ZItem>
                            <IconImg
                              url={mountain}
                              width="100%"
                              height="100%"
                              backsize="cover"
                              border="9px"
                            ></IconImg>
                          </ZItem>
                          <ZItem>
                            <VStack
                              background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                              width="100%"
                              height="100%"
                              border="12px"
                              padding="12px"
                            >
                              <Spacer></Spacer>
                              <BodyRegular textcolor="white">
                                Collection Name Example
                              </BodyRegular>
                            </VStack>
                          </ZItem>
                        </ZStack>

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
                                  <BodyRegular>
                                    {item.totalNfts} Items
                                  </BodyRegular>
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
                                      props.redirect(
                                        `nft/${nftaddress}/${nft.tokenId}`
                                      );
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
                                    props.redirect(
                                      `collection/${item.nickName}`
                                    )
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
                </HStack>
              </Content>
            </ZItem>
          )}
        </ZStack>
      ) : (
        <VStack padding="96px 12px 12px 12px">
          <BannerPhone>
            <IconImg
              url={banner.preview}
              backsize="cover"
              width="100%"
              height="470px"
            ></IconImg>
          </BannerPhone>

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
                We are launching a new collection in couple mins stays tuned 🤩
              </BodyRegular>

              <CaptionSmallRegular textcolor="white">
                10 MINS AGO
              </CaptionSmallRegular>
            </VStack>
          </HStack>

          <HStack
            height="42px"
            background="linear-gradient(180.99deg, #2868F4 37.6%, #0E27C1 115.6%)"
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

          {subMenu === 1 && (
            <ZStack width="100%" height="360px" border="9px" padding="12px">
              <ZItem>
                <IconImg
                  url={mountain}
                  width="100%"
                  height="100%"
                  backsize="cover"
                  border="9px"
                ></IconImg>
              </ZItem>
              <ZItem>
                <VStack
                  background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                  width="100%"
                  height="100%"
                  border="12px"
                  padding="12px"
                >
                  <Spacer></Spacer>
                  <BodyRegular textcolor="white">
                    Collection Name Example
                  </BodyRegular>
                </VStack>
              </ZItem>
            </ZStack>
          )}

          {subMenu === 0 && (
            <Swiper
              spaceBetween={30}
              onSwiper={(swiper) => console.log(swiper)}
              onSlideChange={() => console.log("slide change")}
            >
              {nfts.map((item, i) => (
                <SwiperSlide>
                  <VStack
                    width="100%"
                    height="360px"
                    border="15px"
                    cursor="pointer"
                    overflow="hidden"
                    onClick={() => {
                      props.redirect(`nft/${nftaddress}/${item.tokenId}`);
                    }}
                  >
                    <ZStack width="100%" cursor={"pointer"}>
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
                            url={item.urlFile.v0}
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
                              url={item.urlFile.v0}
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
                            url={item.preview.v0}
                            width="100%"
                            height="100%"
                            backsize="cover"
                            border="15px"
                          ></IconImg>
                        ) : null}
                      </ZItem>
                      <ZItem>
                        <VStack
                          padding="15px"
                          background="linear-gradient(180deg, rgba(0, 0, 0, 0) 54.41%, #000000 91.67%)"
                          border="9px"
                        >
                          <Spacer></Spacer>
                          <BodyRegular textcolor={appStyle.colors.white}>
                            {item.name}
                          </BodyRegular>
                        </VStack>
                      </ZItem>
                    </ZStack>
                  </VStack>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </VStack>
      )}

      {size.width < 415 ? (
        <SliderActivity>
          <Activity></Activity>
        </SliderActivity>
      ) : null}
    </UserSection>
  );
};

export default MyNFT;

const UserSection = styled(motion.div)`
  padding: 0 0 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
  z-index: 100;
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
  z-index: 30px;
`;

const Selector = styled(motion.div)`
  position: absolute;
  width: 240px;
  height: 42px;
`;

const OverImage = styled(motion.div)`
  position: absolute;
  width: 240px;
  height: 120px;
`;

const Controls = styled(motion.div)`
  position: absolute;
  bottom: 10px;

  z-index: 1;
  height: 42px;
`;

const BannerPhone = styled(motion.div)`
  position: absolute;
  top: 0px;
  width: 100%;
`;

const SliderActivity = styled(motion.div)`
  position: fixed;
  z-index: 3000;
  bottom: -503px;
  width: 100%;
`;
