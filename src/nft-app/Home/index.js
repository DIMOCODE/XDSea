import React, { useEffect, useState, useContext } from "react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { nftaddress } from "../../config";
import { getHomeData } from "../../API/Home";
import { isImage, isVideo, isAudio } from "../../common";
import { LoadingSpot } from "../../styles/LoadingSpot";

import styled from "styled-components";

import { NftContainer } from "../../styles/NftContainer";
import { appStyle } from "../../styles/AppStyles";
import ButtonApp from "../../styles/Buttons";

import { Swiper, SwiperSlide } from "swiper/react";

import {
  HStack,
  IconImg,
  Spacer,
  VStack,
  ZItem,
  ZStack,
} from "../../styles/Stacks";
import {
  BodyMedium,
  BodyRegular,
  SubtTitleRegular18,
  TitleBold42,
  TitleSemiBold15,
  TitleRegular36,
  CaptionBold,
  TitleRegular18,
  TitleRegular27,
  TitleRegular33,
} from "../../styles/TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import useWindowSize from "../../styles/useWindowSize";
import goldshape1 from "../../images/goldshape1.png";
import goldshape2 from "../../images/goldshape2.png";
import goldshape3 from "../../images/goldshape3.png";
import goldshape4 from "../../images/goldshape4.png";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import monkeyBanner from "../../images/monkeyBanner.png";

import Swipper from "../Home/Swiper.css";

import { isXdc, toXdc, truncateAddress } from "../../common/common";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Grid, FreeMode, Navigation, Thumbs, Pagination } from "swiper";

import goldSphere from "../../images/GoldSphere.png";
import rocket3D from "../../images/Rocket3D.png";
import Star3D from "../../images/Star3D.png";
import firstPlaces from "../../images/firstplaces.png";
import nftIdea from "../../images/nftIdea.jpg";
import outlinesXDSEA from "../../images/logoShield.png";
import newBlue from "../../images/newBlue.png";
import CristalHeart from "../../images/CristalHeart.png";

import { SubtitleBubble } from "../../styles/SubtitleBubble";
import { PricePosition } from "../../styles/PricePosition";
import { CollectionPosition } from "../../styles/CollectionPosition";
import { BigButton } from "../../styles/BigButton";
import ReactPlayer from "react-player";
import verifiedBlue from "../../images/verifiedBlue.png";
import { useLongPress } from "react-use";

const Home = (props) => {
  /** State Variables */
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [trendingNFTs, setTrendingNFTs] = useState([]);
  const [newestNFTs, setNewestNFTs] = useState([]);

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
  ]);
  const [loadingNFTs] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
    { id: 5, name: "NFT 5" },
    { id: 6, name: "NFT 6" },
  ]);

  const [loadingFeatured] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
    { id: 5, name: "NFT 5" },
    { id: 6, name: "NFT 6" },
  ]);

  const [loadingTrending] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
  ]);

  const size = useWindowSize();
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [, setShowMenu] = useState(props.showMenu);
  const heights = [360, 522, 260, 320, 490];
  const [featuredNFTPlaying, setFeaturedNFTPlaying] = useState([]);
  const [nftPlaying, setNftPlaying] = useState([]);

  /**
   * Get content for the Home page including featured NFTs, trending NFTs and top Collections
   */
  const getData = async () => {
    try {
      const homeData = (await getHomeData()).data;

      let nftHeights = homeData.featuredNfts.map((item) => ({
        ...item,
        height: heights[Math.round(Math.random() * 2)],
      }));

      setFeaturedNFTs(nftHeights);
      setFeaturedNFTPlaying(new Array(nftHeights.length).fill(false));
      setTopCollections(homeData.topCollections);
      setTrendingNFTs(homeData.trendingNfts);
      setNewestNFTs(homeData.newestNfts);
      setNftPlaying(
        new Array(
          homeData.trendingNfts.length + homeData.newestNfts.length
        ).fill(false)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  function longPress(callback, ms = 250) {
    let timeout = null;

    const start = () => (timeout = setTimeout(callback, ms));
    const stop = () => timeout && window.clearTimeout(timeout);
    return callback
      ? {
          onMouseDown: start,
          onMouseUp: stop,
          onMouseLeave: stop,
          onTouchStart: start,
          onTouchMove: stop,
          onTouchEnd: stop,
        }
      : {};
  }

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
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

  useEffect(() => {}, [scrolling]);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <Content>
      {/* Blue banner background */}
      <VStack
        backgroundimage={newBlue}
        padding="90px 0px 21px 0px"
        spacing="30px"
      >
        {/* Logo marketplace */}
        <IconImg
          url={outlinesXDSEA}
          width={size.width > 768 ? "190px" : "150px"}
          height={size.width > 768 ? "190px" : "150px"}
          cursor={"pointer"}
        ></IconImg>

        {/* Slogan */}
        <TitleBold42 textcolor="white" align="center">
          Exploring, Collecting, and <br></br> Selling NFTs
        </TitleBold42>

        {/* Marketplace subtitle */}

        <SubtitleBubble
          text={"Has now become simpler and faster"}
        ></SubtitleBubble>

        <Swiper
          slidesPerView={"1"}
          spaceBetween={9}
          centeredSlides={false}
          loop={true}
          autoHeight={true}
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
            // height: size.width > 440 ? "780px" : "500px",
          }}
          navigation={true}
          modules={[Grid, FreeMode, Navigation, Thumbs]}
          onSwiper={(swiper) => {}}
          onSlideChange={() => {}}
          // className="mySwiper2"
        >
          <SwiperSlide
            key="monkey"
            style={{ cursor: "pointer", background: "transparent" }}
          >
            <IconImg
              url={monkeyBanner}
              width="100%"
              height={size.width > 440 ? "460px" : "150px"}
              backsize="cover"
              cursor="pointer"
              onClick={() => props.redirect("collection/XDSEA-MONKEYS-ORIGINAL-ART")}
            ></IconImg>
          </SwiperSlide>

          <SwiperSlide
            key="featured"
            style={{ cursor: "pointer", background: "transparent" }}
          >
            <Masonry
              columnsCount={size.width > 428 ? 3 : 2}
              gutter={
                size.width > 768 ? "15px" : size.width > 428 ? "8px" : "2px"
              }
              style={{
                width: size.width > 1200 ? "1200px" : size.width,
                padding:
                  size.width > 768 ? "15px" : size.width > 428 ? "8px" : "2px",
              }}
            >
              {loading
                ? loadingFeatured.map((item, i) => (
                    <VStack
                      key={i}
                      minwidth={size.width > 428 ? "290px" : "100px"}
                      minheight={size.width > 428 ? "380px" : "150px"}
                    >
                      <LoadingNftContainer
                        scale={size.width > 428 ? "1" : "0.72"}
                      ></LoadingNftContainer>
                    </VStack>
                  ))
                : featuredNFTs.length !== 0
                ? featuredNFTs?.map((item, i) => (
                    <ZStack
                      minheight={
                        size.width > 428 ? item.height + "px" : "150px"
                      }
                      cursor="pointer"
                      onClick={() =>
                        props.redirect(
                          `nft/${
                            isXdc(item.collectionId.address)
                              ? item.collectionId.address.toLowerCase()
                              : toXdc(item.collectionId.address.toLowerCase())
                          }/${item.tokenId}`
                        )
                      }
                      onHoverStart={() => {
                        setFeaturedNFTPlaying((prevState) => {
                          prevState[i] = true;
                          return [...prevState];
                        });
                      }}
                      onHoverEnd={() => {
                        setFeaturedNFTPlaying((prevState) => {
                          prevState[i] = false;
                          return [...prevState];
                        });
                      }}
                    >
                      <ZItem cursor="pointer">
                        <VStack
                          key={"featured_" + item._id}
                          cursor="pointer"
                          border={size.width > 428 ? "6px" : "0px"}
                          overflowx="hidden"
                          overflowy="hidden"
                        >
                          {isImage(item.fileType) ? (
                            <IconImg
                              url={item.urlFile.v0}
                              backsize="cover"
                              width="100%"
                              height="100%"
                              border={size.width > 428 ? "6px" : "0px"}
                              cursor="pointer"
                            ></IconImg>
                          ) : (
                            <VStack
                              background="black"
                              border={size.width > 428 ? "6px" : "0px"}
                              overflowx="hidden"
                              animate={{ scale: 2 }}
                              cursor="pointer"
                            >
                              <ReactPlayer
                                url={item.urlFile.v0}
                                playing={featuredNFTPlaying[i]}
                                volume={0}
                                muted={true}
                                loop={true}
                                width="100%"
                                height="100%"
                              ></ReactPlayer>
                            </VStack>
                          )}
                        </VStack>
                      </ZItem>
                      <ZItem
                        cursor="pointer"
                        {...longPress(() => {
                          const newFeaturedNFTPlaying = new Array(
                            featuredNFTPlaying.length
                          ).fill(false);
                          setFeaturedNFTPlaying((prevState) => {
                            newFeaturedNFTPlaying[i] =
                              !newFeaturedNFTPlaying[i];
                            return [...newFeaturedNFTPlaying];
                          });
                        })}
                      >
                        <VStack
                          background={
                            size.width > 428
                              ? "linear-gradient(190.5deg, rgba(0, 0, 0, 0) 75.64%, rgba(0, 0, 0, 0.90) 90.61%)"
                              : null
                          }
                          border={size.width > 428 ? "6px" : "0px"}
                          alignment="flex-start"
                          cursor="pointer"
                        >
                          <Spacer></Spacer>
                          <VStack
                            spacing="0px"
                            alignment="flex-start"
                            padding={
                              size.width > 768
                                ? "0 0 0px 15px"
                                : "0 0 30px 15px"
                            }
                            maxheight="60px"
                            width="100%"
                            cursor="pointer"
                          >
                            {size.width > 428 ? (
                              <HStack spacing="6px" cursor="pointer">
                                <IconImg
                                  url={item.creator.urlProfile}
                                  width="18px"
                                  height="18px"
                                  backsize="cover"
                                  border="12px"
                                  cursor="pointer"
                                ></IconImg>
                                <BodyMedium
                                  textcolor="rgba(255,255,255,0.6)"
                                  cursor="pointer"
                                >
                                  {item.creator.userName}
                                </BodyMedium>
                                <IconImg
                                  url={verifiedBlue}
                                  width="15px"
                                  height="15px"
                                  border="12px"
                                  cursor="pointer"
                                ></IconImg>
                                <Spacer></Spacer>
                              </HStack>
                            ) : null}

                            {size.width > 428 ? (
                              <TitleRegular18
                                textcolor="white"
                                cursor="pointer"
                              >
                                {item.collectionId.name}
                              </TitleRegular18>
                            ) : null}
                          </VStack>
                        </VStack>
                      </ZItem>
                    </ZStack>
                  ))
                : null}
            </Masonry>
          </SwiperSlide>
        </Swiper>
      </VStack>

      <ContentCentered>
        {/* TOP COLLECTION SECTION */}
        <VStack alignment="center">
          <AbsoluteObject top="90px" left="-260px">
            <IconImg
              url={goldshape1}
              width={size.width > 428 ? "390px" : "320px"}
              height="390px"
              backsize="contain"
            ></IconImg>
          </AbsoluteObject>

          <AbsoluteObject top="990px" right="-260px">
            <IconImg
              url={goldshape2}
              width={size.width > 428 ? "390px" : "320px"}
              height="390px"
              backsize="contain"
            ></IconImg>
          </AbsoluteObject>

          <VStack padding="40px 0 0 0 ">
            <IconImg
              url={rocket3D}
              width="150px"
              height="150px"
              backsize="cover"
            ></IconImg>

            {/* Top collection Subtitle */}
            <SubtitleBubble text={"DISCOVER WHAT'S HOT NOW"}></SubtitleBubble>

            {/* Top collection Title */}
            <TitleRegular36>Top Collections</TitleRegular36>
          </VStack>

          {/* First 3 Places  */}
          <HStack
            width="100%"
            padding={
              size.width > 428
                ? "120px 0 0 0"
                : size.width > 375
                ? "45px 0 0 0"
                : size.width > 320
                ? "30px 0 0 0"
                : "0"
            }
          >
            <VStack maxwidth="600px" height="360px">
              <IconImg
                url={firstPlaces}
                width={size.width > 428 ? "100%" : "95%"}
                height="100%"
              ></IconImg>

              {/* 1st Place */}
              <Gold
                animate={{
                  scale: size.width > 428 ? 1 : size.width > 320 ? 0.81 : 0.65,
                }}
                top={
                  size.width > 768
                    ? "-64px"
                    : size.width > 428
                    ? "-64px"
                    : size.width > 375
                    ? "-12px"
                    : size.width > 320
                    ? "0px"
                    : "14px"
                }
              >
                <PricePosition
                  position={1}
                  creator={topCollections[0]?.name}
                  image={topCollections[0]?.logo.v0}
                  amount={
                    topCollections[0]?.volumeTrade === undefined
                      ? "loading"
                      : Number(topCollections[0]?.volumeTrade) > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(Number(topCollections[0]?.volumeTrade))
                      : Number(topCollections[0]?.volumeTrade).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) || "0"
                  }
                  nickName={topCollections[0]?.nickName}
                  redirect={props.redirect}
                ></PricePosition>
              </Gold>

              {/* 2nd Place */}
              <Silver
                animate={{
                  scale: size.width > 428 ? 1 : size.width > 320 ? 0.81 : 0.65,
                }}
                left={
                  size.width > 428
                    ? "26px"
                    : size.width > 375
                    ? "2px"
                    : size.width > 320
                    ? "-10px"
                    : "-16px"
                }
                top={
                  size.width > 428
                    ? "32px"
                    : size.width > 375
                    ? "52px"
                    : size.width > 320
                    ? "60px"
                    : "64px"
                }
              >
                <PricePosition
                  position={2}
                  creator={topCollections[1]?.name}
                  image={topCollections[1]?.logo.v0}
                  amount={
                    topCollections[1]?.volumeTrade === undefined
                      ? "loading"
                      : Number(topCollections[1]?.volumeTrade) > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(Number(topCollections[1]?.volumeTrade))
                      : Number(topCollections[1]?.volumeTrade).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) || "0"
                  }
                  nickName={topCollections[1]?.nickName}
                  redirect={props.redirect}
                ></PricePosition>
              </Silver>

              {/* 3rd Place */}
              <Cooper
                animate={{
                  scale: size.width > 428 ? 1 : size.width > 320 ? 0.81 : 0.65,
                }}
                top={
                  size.width > 428
                    ? "80px"
                    : size.width > 375
                    ? "84px"
                    : size.width > 320
                    ? "84px"
                    : "84px"
                }
                right={
                  size.width > 428
                    ? "26px"
                    : size.width > 375
                    ? "0px"
                    : size.width > 320
                    ? "-6px"
                    : "-18px"
                }
              >
                <PricePosition
                  position={3}
                  creator={topCollections[2]?.name}
                  image={topCollections[2]?.logo.v0}
                  amount={
                    topCollections[2]?.volumeTrade === undefined
                      ? "loading"
                      : Number(topCollections[2]?.volumeTrade) > 100000
                      ? Intl.NumberFormat("en-US", {
                          notation: "compact",
                          maximumFractionDigits: 2,
                        }).format(Number(topCollections[2]?.volumeTrade))
                      : Number(topCollections[2]?.volumeTrade).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) || "0"
                  }
                  nickName={topCollections[2]?.nickName}
                  redirect={props.redirect}
                ></PricePosition>
              </Cooper>
            </VStack>
          </HStack>

          {/* Rest of the 7 Places */}
          <HStack
            style={
              size.width > 375
                ? {}
                : size.width > 320
                ? {
                    "margin-top": "-60px",
                  }
                : {
                    "margin-top": "-80px",
                  }
            }
          >
            <VStack maxwidth="600px">
              {loading
                ? loadingCollections.map((item, i) => (
                    <VStack key={i} width="100%" minheight="136px">
                      <LoadingNftContainer scale="0.72"></LoadingNftContainer>
                    </VStack>
                  ))
                : topCollections.length !== 0
                ? topCollections.slice(3).map((item, i) => (
                    <CollectionPosition
                      key={item._id}
                      rank={i + 4}
                      creator={item.logo.v0}
                      name={item.name}
                      amount={
                        Number(item.volumeTrade) > 100000
                          ? Intl.NumberFormat("en-US", {
                              notation: "compact",
                              maximumFractionDigits: 2,
                            }).format(Number(item.volumeTrade))
                          : Number(item.volumeTrade).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            }) || "0"
                      }
                      percent={
                        (Number(item.volumeTrade) / 2500).toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                          }
                        ) + "%"
                      }
                      nickName={item.nickName}
                      redirect={props.redirect}
                    ></CollectionPosition>
                  ))
                : null}
            </VStack>
          </HStack>

          {/* Explore button */}
          <HStack>
            <BigButton
              text="Explore All Collections"
              onClick={() => props.redirect("discover/collections")}
              width={size.width > 375 ? null : size.width - 30 + "px"}
            ></BigButton>
          </HStack>
        </VStack>

        {/* TRENDING NFT SECTION */}
        <VStack alignment="center" padding="40px 0 ">
          <AbsoluteObject top="90px" left="-300px">
            <IconImg
              url={goldshape3}
              width={size.width > 428 ? "490px" : "380px"}
              height="490px"
              backsize="contain"
            ></IconImg>
          </AbsoluteObject>
          <VStack padding="0 0 0 0 ">
            <IconImg
              url={CristalHeart}
              width="150px"
              height="150px"
              backsize="cover"
            ></IconImg>

            {/* Trending NFT Subtitle */}
            <SubtitleBubble text={"WHAT USERS LOVE MOST"}></SubtitleBubble>

            {/* Trending NFT Title */}
            <TitleRegular36>Trending NFTs</TitleRegular36>
          </VStack>

          {/* Trending NFT Cards */}
          <HStack
            flexwrap="wrap"
            padding={size.width > 428 ? "0 12px 0 12px" : "0 2px 0 2px"}
            height="auto"
            spacing={size.width > 428 ? "15px" : "2px"}
          >
            {loading
              ? loadingTrending.map((item, i) => (
                  <VStack
                    key={i}
                    minwidth="46%"
                    height={size.width < 429 ? "190px" : "390px"}
                    minheight={size.width < 429 ? "190px" : "390px"}
                  >
                    <LoadingNftContainer
                      scale={size.width < 429 ? "0.72" : 1}
                    ></LoadingNftContainer>
                  </VStack>
                ))
              : trendingNFTs.length !== 0
              ? trendingNFTs
                  .slice(0, 4)
                  .map((item, i) => (
                    <NftContainer
                      key={"trending_" + item._id}
                      itemImage={item.urlFile.v0}
                      itemPreview={item.preview.v0}
                      fileType={item.fileType}
                      background={({ theme }) => theme.backElement}
                      onClick={() =>
                        props.redirect(
                          `nft/${
                            isXdc(item.collectionId.address)
                              ? item.collectionId.address.toLowerCase()
                              : toXdc(item.collectionId.address.toLowerCase())
                          }/${item.tokenId}`
                        )
                      }
                      minwidth="46%"
                      height={size.width < 429 ? "190px" : "390px"}
                      minheight={size.width < 429 ? "190px" : "390px"}
                      border={size.width > 428 ? "6px" : "0px"}
                      setIsPlaying={handleNFTLongPress}
                      isPlaying={nftPlaying[i]}
                      nftIndex={i}
                      iconStatus={item.saleType.toLowerCase()}
                      price={item.price}
                      collectionName={item.collectionId.name}
                      itemNumber={item.name}
                      usdPrice={props.xdc}
                      collectionVerified={item.creator.isVerified}
                      width="100%"
                    ></NftContainer>
                  ))
              : null}
          </HStack>

          {/* Discover Button */}
          <HStack>
            <BigButton
              text="Discover All NFTs"
              onClick={() => props.redirect("discover/nfts")}
              width={size.width > 375 ? null : size.width - 30 + "px"}
            ></BigButton>
          </HStack>
        </VStack>

        {/* NEW NFT SECTION */}
        <VStack alignment="center" padding="40px 0 ">
          <AbsoluteObject top="90px" right="-230px">
            <IconImg
              url={goldshape4}
              width={size.width > 428 ? "390px" : "320px"}
              height="390px"
              backsize="contain"
            ></IconImg>
          </AbsoluteObject>

          <VStack padding="0 0 0 0 ">
            <IconImg
              url={Star3D}
              width="150px"
              height="150px"
              backsize="cover"
            ></IconImg>

            {/* New Nfts Subtitle */}
            <SubtitleBubble
              text={"NEW TALENTS ON THE MARKETPLACE"}
            ></SubtitleBubble>

            {/* New Nfts Title */}
            <TitleRegular36>New NFTs</TitleRegular36>
          </VStack>

          <Swiper
            slidesPerView={size.width > 428 ? "3" : "1"}
            spaceBetween={9}
            centeredSlides={false}
            loop={true}
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
              height: "390px",
            }}
            navigation={true}
            modules={[Grid, FreeMode, Navigation, Thumbs]}
            onSwiper={(swiper) => {}}
            onSlideChange={() => {}}
            className="mySwiper2"
          >
            {newestNFTs.length !== 0
              ? newestNFTs.map((item, i) => (
                  <SwiperSlide
                    key={"newSlide_" + item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      props.redirect(
                        `nft/${
                          isXdc(item.collectionId.address)
                            ? item.collectionId.address.toLowerCase()
                            : toXdc(item.collectionId.address.toLowerCase())
                        }/${item.tokenId}`
                      )
                    }
                  >
                    <NftContainer
                      key={"new_" + item._id}
                      iconStatus={item.saleType.toLowerCase()}
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
                            isXdc(item.collectionId.address)
                              ? item.collectionId.address.toLowerCase()
                              : toXdc(item.collectionId.address.toLowerCase())
                          }/${item.tokenId}`
                        )
                      }
                      usdPrice={props.xdc}
                      collectionVerified={item.creator.isVerified}
                      width="100%"
                      height="100%"
                      border={size.width > 428 ? "6px" : "0px"}
                      setIsPlaying={handleNFTLongPress}
                      isPlaying={nftPlaying[i]}
                      nftIndex={i}
                    ></NftContainer>
                  </SwiperSlide>
                ))
              : null}
          </Swiper>

          {/* Discover Button */}
          <HStack>
            <BigButton
              text="Discover The Latest NFTs"
              onClick={() => props.redirect("discover/nfts")}
              width={size.width > 375 ? null : size.width - 30 + "px"}
            ></BigButton>
          </HStack>
        </VStack>
      </ContentCentered>

      {/* How to get started Banner */}
      <VStack padding="150px 0">
        <Sphere>
          <IconImg
            url={goldSphere}
            width="390px"
            height="390px"
            backsize="contain"
          ></IconImg>
        </Sphere>

        <VStack
          minheight="210px"
          background="rgba(11, 26, 163, 0.85)"
          width="100%"
          className="blend"
        >
          <VStack height="100%">
            <BodyRegular textcolor="rgba(255,122,0,100)">
              WANT TO GET STARTED?
            </BodyRegular>
            {size.width > 375 ? (
              <TitleRegular36
                textcolor="rgba(251,195,75, 100)"
                alignment="center"
              >
                Create and sell your NFTs
              </TitleRegular36>
            ) : (
              <TitleRegular27
                textcolor="rgba(251,195,75,100)"
                alignment="center"
              >
                Create and sell your NFTs
              </TitleRegular27>
            )}

            <HStack
              self="none"
              padding="0 15px"
              height="42px"
              border="30px"
              background="white"
              cursor="pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => props.redirect("HowToStart")}
            >
              <SubtTitleRegular18 cursor="pointer">
                Here is how
              </SubtTitleRegular18>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Content>
  );
};

export { Home };

const Content = styled(motion.div)`
  padding: 0 0 120px 0;
  widht: 100%;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
`;

const ContentCentered = styled(motion.div)`
  padding: 0 0 90px 0;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
`;

const GridNfts = styled(motion.div)`
  position: absolute;
  bottom: -300px;
  width: 1100px;
  box-sizing: border-box;
`;

const Blend = styled(motion.div)`
  mix-blend-mode: difference;
  width: 100%;
`;

const SvgTexture = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100vw;
  heigth: 100vh;
  z-index: -1;
`;

const Gold = styled(motion.div)`
  position: absolute;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  top: ${(props) => props.top};

  z-index: 10;
`;

const Silver = styled(motion.div)`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  // left: 33px;
  // top: 52px;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
`;

const Cooper = styled(motion.div)`
  position: absolute;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
`;

const Sphere = styled(motion.div)`
  position: absolute;
`;

const AbsoluteObject = styled(motion.div)`
  position: absolute;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  left: ${(props) => props.left};
`;
