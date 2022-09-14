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

import { HStack, IconImg, VStack, ZItem, ZStack } from "../../styles/Stacks";
import {
  BodyRegular,
  SubtTitleRegular18,
  TitleBold42,
  TitleRegular36,
} from "../../styles/TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";

import Swipper from "../Home/Swiper.css";

import { truncateAddress } from "../../common/common";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { Grid, FreeMode, Navigation, Thumbs, Pagination } from "swiper";

import goldSphere from "../../images/GoldSphere.webp";
import rocket3D from "../../images/Rocket3D.webp";
import Star3D from "../../images/Star3D.webp";
import firstPlaces from "../../images/firstplaces.webp";
import nftIdea from "../../images/nftIdea.webp";
import outlinesXDSEA from "../../images/logoShield.webp";
import newBlue from "../../images/newBlue.webp";
import CristalHeart from "../../images/CristalHeart.webp";

import { SubtitleBubble } from "../../styles/SubtitleBubble";
import { PricePosition } from "../../styles/PricePosition";
import { CollectionPosition } from "../../styles/CollectionPosition";
import { BigButton } from "../../styles/BigButton";
import ReactPlayer from "react-player";

const Home = (props) => {
  /** State Variables */
  const [featuredNFTs, setFeaturedNFTs] = useState([]);
  const [topCollections, setTopCollections] = useState([]);
  const [trendingNFTs, setTrendingNFTs] = useState([]);

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
  const size = useWindowSize();
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [, setShowMenu] = useState(props.showMenu);

  /**
   * Get content for the Home page including featured NFTs, trending NFTs and top Collections
   */
  const getData = async () => {
    try {
      const homeData = (await getHomeData()).data;

      setFeaturedNFTs(homeData.featuredNfts);
      setTopCollections(homeData.topCollections);
      setTrendingNFTs(homeData.trendingNfts);
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      <VStack
        width="100%"
        backgroundimage={newBlue}
        padding="90px 0px 21px 00px"
        overflowx="hidden"
        spacing="30px"
      >
        {/* Logo marketplace */}
        <IconImg
          url={outlinesXDSEA}
          width={size.width > 768 ? "190px" : "150px"}
          height={size.width > 768 ? "190px" : "150px"}
        ></IconImg>

        {/* Slogan */}
        <TitleBold42 textcolor="white" align="center">
          Exploring, Collecting, and <br></br> Selling NFTs
        </TitleBold42>

        {/* Marketplace subtitle */}

        <SubtitleBubble
          text={"Has now become simpler and faster"}
        ></SubtitleBubble>

        {/* Featured Section */}
        <VStack spacing="6px" width="100%">
          {/* Big Tiles */}
          <Swiper
            slidesPerView={size.width > 414 ? "2" : "1"}
            spaceBetween={9}
            centeredSlides={true}
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
              height: "380px",
            }}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            onSwiper={() => {}}
            onSlideChange={(event) => {}}
            className="featuredBig"
          >
            {featuredNFTs.length !== 0
              ? featuredNFTs?.map((item) => (
                  <SwiperSlide
                    onClick={() =>
                      props.redirect(
                        `nft/${item.nftContract}/${item.tokenId}`
                      )
                    }
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    {isImage(item.fileType) ? (
                      <IconImg
                        url={item.urlFile.v0}
                        backsize="cover"
                        width="100%"
                        height="100%"
                        border="6px"
                      ></IconImg>
                    ) : (
                      <ReactPlayer
                        url={item.urlFile.v0}
                        playing={true}
                        volume={0}
                        muted={true}
                        loop={true}
                        width="100%"
                        height="100%"
                      ></ReactPlayer>
                    )}
                  </SwiperSlide>
                ))
              : null}
          </Swiper>

          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={9}
            slidesPerView={6}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            style={{
              height: size.width > 414 ? "69px" : "60px",
              width: size.width > 414 ? "680px" : "100%",
            }}
            className="mySwiperThumb"
          >
            {featuredNFTs.length !== 0
              ? featuredNFTs?.map((item) => (
                  <SwiperSlide>
                    {isImage(item.fileType) ? (
                      <IconImg
                        url={item.urlFile.v0}
                        backsize="cover"
                        width="100%"
                        height="100%"
                        border="6px"
                      ></IconImg>
                    ) : (
                      <ReactPlayer
                        url={item.urlFile.v0}
                        playing={false}
                        volume={0}
                        muted={true}
                        loop={true}
                        width="100%"
                        height="100%"
                      ></ReactPlayer>
                    )}
                  </SwiperSlide>
                ))
              : null}
          </Swiper>
        </VStack>
      </VStack>

      <ContentCentered>
        {/* TOP COLLECTION SECTION */}
        <VStack alignment="center">
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
          <HStack width="100%" padding="120px 0 0 0">
            <VStack maxwidth="600px" height="360px">
              <IconImg url={firstPlaces} width="100%" height="100%"></IconImg>

              {/* 1st Place */}
              <Gold
                animate={{ scale: size.width > 414 ? 1 : 0.81 }}
                top="-49px"
              >
                <PricePosition
                  position={1}
                  creator={topCollections[0]?.name}
                  image={topCollections[0]?.logo.v0}
                  amount={
                    Number(topCollections[0]?.volumeTrade) > 100000
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
                animate={{ scale: size.width > 414 ? 1 : 0.81 }}
                left={size.width > 414 ? "33px" : "0"}
                top="52px"
              >
                <PricePosition
                  position={2}
                  creator={topCollections[1]?.name}
                  image={topCollections[1]?.logo.v0}
                  amount={
                    Number(topCollections[1]?.volumeTrade) > 100000
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
                animate={{ scale: size.width > 414 ? 1 : 0.81 }}
                top={size.width > 414 ? "100px" : "90px"}
                right={size.width > 414 ? "26px" : 0}
              >
                <PricePosition
                  position={3}
                  creator={topCollections[2]?.name}
                  image={topCollections[2]?.logo.v0}
                  amount={
                    Number(topCollections[2]?.volumeTrade) > 100000
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
          <HStack>
            <VStack maxwidth="600px">
              {topCollections.length !== 0
                ? topCollections.slice(3).map((item, i) => (
                    <CollectionPosition
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
            ></BigButton>
          </HStack>
        </VStack>

        {/* TRENDING NFT SECTION */}
        <VStack alignment="center" padding="40px 0 ">
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
          <HStack flexwrap="wrap" padding="0 12px 0 12px">
            {trendingNFTs.length !== 0
              ? trendingNFTs.slice(0, 4).map((item) =>
                  isImage(item.fileType) ? (
                    <IconImg
                      url={item.urlFile.v0}
                      backsize="cover"
                      width="48%"
                      height={size.width > 414 ? "360px" : "180px"}
                      border="6px"
                      cursor="pointer"
                      onClick={() =>
                        props.redirect(
                          `nft/${item.nftContract}/${item.tokenId}`
                        )
                      }
                    ></IconImg>
                  ) : (
                    <HStack
                      background="black"
                      width="48%"
                      height={size.width > 414 ? "360px" : "180px"}
                      border="6px"
                    >
                      <ReactPlayer
                        url={item.urlFile.v0}
                        playing={true}
                        volume={0}
                        muted={true}
                        loop={true}
                        width="100%"
                        height="100%"
                      ></ReactPlayer>
                    </HStack>
                  )
                )
              : null}
          </HStack>

          {/* Discover Button */}
          <HStack>
            <BigButton
              text="Discover All NFTs"
              onClick={() => props.redirect("discover/nfts")}
            ></BigButton>
          </HStack>
        </VStack>

        {/* NEW NFT SECTION */}
        <VStack alignment="center" padding="40px 0 ">
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
            slidesPerView={size.width > 414 ? "3" : "1"}
            spaceBetween={9}
            centeredSlides={false}
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
            {trendingNFTs.length !== 0
              ? trendingNFTs.slice(0, 4).map((item) => (
                  <SwiperSlide
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      props.redirect(
                        `nft/${item.nftContract}/${item.tokenId}`
                      )
                    }
                  >
                    <ZStack background="black" width="100%" border="6px">
                      <ZItem>
                        {isImage(item.fileType) ? (
                          <IconImg
                            url={item.urlFile.v0}
                            backsize="cover"
                            width="100%"
                            height="100%"
                            border="6px"
                          ></IconImg>
                        ) : (
                          <ReactPlayer
                            url={item.urlFile.v0}
                            playing={true}
                            volume={0}
                            muted={true}
                            loop={true}
                            width="100%"
                            height="100%"
                          ></ReactPlayer>
                        )}
                      </ZItem>
                      <ZItem>
                        <VStack
                          border="6px"
                          background="linear-gradient(181.21deg, rgba(0, 0, 0, 0) 75.55%, #000000 96.17%)"
                        ></VStack>
                      </ZItem>
                    </ZStack>
                  </SwiperSlide>
                ))
              : null}
          </Swiper>

          {/* Discover Button */}
          <HStack>
            <BigButton
              text="Discover The Latest NFTs"
              onClick={() => props.redirect("discover/nfts")}
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
            <TitleRegular36 textcolor="rgba(251,195,75, 100)">
              Create and sell your NFTs
            </TitleRegular36>

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

  box-sizing: border-box;
`;

const ContentCentered = styled(motion.div)`
  padding: 0 0 90px 0;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
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

  top: ${(props) => props.top};

  z-index: 10;
`;

const Silver = styled(motion.div)`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  // left: 33px;
  // top: 52px;
`;

const Cooper = styled(motion.div)`
  position: absolute;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
`;

const Sphere = styled(motion.div)`
  position: absolute;
`;
