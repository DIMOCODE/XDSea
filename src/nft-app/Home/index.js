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
  TitleRegular18,
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
import verifiedBlue from "../../images/verifiedBlue.png";

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
  const size = useWindowSize();
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [, setShowMenu] = useState(props.showMenu);
  const heights = [260, 360, 300];
  const [featuredNFTPlaying, setFeaturedNFTPlaying] = useState([]);

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

        <Masonry
          columnsCount={3}
          gutter="15px"
          style={{
            width:
              size.width > 1200
                ? "1200px"
                : size.width > 1023
                ? "1024px"
                : "768px",
          }}
        >
          {featuredNFTs.length !== 0
            ? featuredNFTs?.map((item, i) => (
                <ZStack
                  minheight={item.height + "px"}
                  cursor="pointer"
                  onClick={() =>
                    props.redirect(`nft/${item.nftContract}/${item.tokenId}`)
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
                      border="6px"
                      overflowx="hidden"
                      overflowy="hidden"
                    >
                      {isImage(item.fileType) ? (
                        <IconImg
                          url={item.urlFile.v0}
                          backsize="cover"
                          width="100%"
                          height="100%"
                          border="6px"
                          cursor="pointer"
                        ></IconImg>
                      ) : (
                        <VStack
                          background="black"
                          border="6px"
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
                  <ZItem cursor="pointer">
                    <VStack
                      background="linear-gradient(190.5deg, rgba(0, 0, 0, 0) 75.64%, rgba(0, 0, 0, 0.90) 90.61%);"
                      border="6px"
                      alignment="flex-start"
                      cursor="pointer"
                    >
                      <Spacer></Spacer>
                      <VStack
                        spacing="0px"
                        alignment="flex-start"
                        padding="0 0 0px 30px"
                        maxheight="90px"
                        width="100%"
                        cursor="pointer"
                      >
                        <HStack spacing="6px" cursor="pointer">
                          <IconImg
                            url={item.creator.urlProfile}
                            width="18px"
                            height="18px"
                            backsize="cover"
                            border="12px"
                            cursor="pointer"
                          ></IconImg>
                          <BodyMedium textcolor="rgba(255,255,255,0.6)" cursor="pointer">
                            {truncateAddress(item.creator.userName)}
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
                        <TitleRegular18 textcolor="white" cursor="pointer">
                          {item.collectionId.name}
                        </TitleRegular18>
                      </VStack>
                    </VStack>
                  </ZItem>
                </ZStack>
              ))
            : null}
        </Masonry>
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
                left={size.width > 425 ? "33px" : "-12px"}
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
                top={size.width > 414 ? "100px" : "86px"}
                right={size.width > 414 ? "26px" : "-12px"}
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
          <HStack flexwrap="wrap" padding="0 12px 0 12px" height="auto">
            {trendingNFTs.length !== 0
              ? trendingNFTs
                  .slice(0, 4)
                  .map((item) => (
                    <NftContainer
                      key={"trending_" + item._id}
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
                          `nft/${item.nftContract}/${item.tokenId}`
                        )
                      }
                      usdPrice={props.xdc}
                      collectionVerified={item.creator.isVerified}
                      minwidth="46%"
                      height={size.width < 426 ? "190px" : "390px"}
                      minheight={size.width < 426 ? "190px" : "390px"}
                      border="6px"
                    ></NftContainer>
                  ))
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
            loop={true}
          >
            {newestNFTs.length !== 0
              ? newestNFTs.map((item) => (
                  <SwiperSlide
                    key={"newSlide_" + item._id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      props.redirect(`nft/${item.nftContract}/${item.tokenId}`)
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
                          `nft/${item.nftContract}/${item.tokenId}`
                        )
                      }
                      usdPrice={props.xdc}
                      collectionVerified={item.creator.isVerified}
                      width="100%"
                      height="100%"
                      border="6px"
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
            <TitleRegular36
              textcolor="rgba(251,195,75, 100)"
              alignment="center"
            >
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
