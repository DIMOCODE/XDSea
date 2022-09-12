import React, { useEffect, useState, useContext } from "react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { nftaddress } from "../../config";
import { getHomeData } from "../../API/Home";

import { LoadingSpot } from "../../styles/LoadingSpot";

import styled from "styled-components";

import { NftContainer } from "../../styles/NftContainer";
import { appStyle } from "../../styles/AppStyles";
import ButtonApp from "../../styles/Buttons";

import { Swiper, SwiperSlide } from "swiper/react";

import { HStack, IconImg, VStack } from "../../styles/Stacks";
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
import outlinesXDSEA from "../../images/XDSeaOutlines.webp";
import newBlue from "../../images/newBlue.webp";
import CristalHeart from "../../images/CristalHeart.webp";

import { SubtitleBubble } from "../../styles/SubtitleBubble";
import { PricePosition } from "../../styles/PricePosition";
import { CollectionPosition } from "../../styles/CollectionPosition";
import { BigButton } from "../../styles/BigButton";

const Home = (props) => {
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
        <TitleBold42 textcolor="white" align="center">
          Exploring Collecting and <br></br> Selling NFT's
        </TitleBold42>

        {/* Marketplace subtitle */}

        <SubtitleBubble
          text={"Has now become, simpler and faster"}
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
              height: "420px",
            }}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
            className="mySwiper2"
          >
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>

            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
          </Swiper>
          {/* Thumbnails */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={9}
            slidesPerView={6}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            style={{
              height: size.width > 414 ? "90px" : "60px",
              width: size.width > 414 ? "680px" : "100%",
            }}
            className="mySwiperThumb"
          >
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>{" "}
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>{" "}
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>{" "}
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>{" "}
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
          </Swiper>
        </VStack>
      </VStack>

      <ContentCentered>
        {/* TOP COLLECTION SECTION              */}

        <VStack alignment="center">
          <VStack padding="90px 0 0 0 ">
            <IconImg
              url={rocket3D}
              width="150px"
              height="150px"
              backsize="cover"
            ></IconImg>

            <SubtitleBubble text={"DISCOVER WHATS HOT NOW"}></SubtitleBubble>

            <TitleRegular36>Top Collections</TitleRegular36>
          </VStack>
          {/* First 3 Places  */}
          <HStack width="100%" padding="120px 0 0 0">
            <VStack maxwidth="600px" height="360px">
              <IconImg url={firstPlaces} width="100%" height="100%"></IconImg>

              <Gold
                animate={{ scale: size.width > 414 ? 1 : 0.81 }}
                top="-49px"
              >
                <PricePosition
                  creator={"Gold Creator"}
                  amount="10M"
                ></PricePosition>
              </Gold>

              <Silver
                animate={{ scale: size.width > 414 ? 1 : 0.81 }}
                left={size.width > 414 ? "33px" : "0"}
                top="52px"
              >
                <PricePosition
                  creator={"Silver Creator"}
                  amount="9M"
                ></PricePosition>
              </Silver>
              <Cooper
                animate={{ scale: size.width > 414 ? 1 : 0.81 }}
                top={size.width > 414 ? "100px" : "90px"}
                right={size.width > 414 ? "26px" : 0}
              >
                <PricePosition
                  creator={"Cooper Creator"}
                  amount="8M"
                ></PricePosition>
              </Cooper>
            </VStack>
          </HStack>
          {/* Rest 7 Places                 */}
          <HStack>
            <VStack maxwidth="600px">
              <CollectionPosition
                rank="4"
                creator={newBlue}
                name="Creator Example"
                amount="300k"
                percent="90%"
              ></CollectionPosition>
            </VStack>
          </HStack>

          <HStack>
            <BigButton text="Explore All Collections"></BigButton>
          </HStack>
        </VStack>

        {/* TRENDING NFT SECTION              */}
        <VStack alignment="center" padding="90px 0 ">
          <VStack padding="90px 0 0 0 ">
            <IconImg
              url={CristalHeart}
              width="150px"
              height="150px"
              backsize="cover"
            ></IconImg>

            <SubtitleBubble text={"WHAT USERS LOVES MOST"}></SubtitleBubble>

            <TitleRegular36>Trending NFTs</TitleRegular36>
          </VStack>

          <HStack
            flexwrap="wrap"
            padding={size.width > 414 ? "0 12px 0 12px" : "0 12px 0 12px"}
          >
            <IconImg
              url={nftIdea}
              backsize="cover"
              width="48%"
              height={size.width > 414 ? "360px" : "180px"}
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              backsize="cover"
              width="48%"
              height={size.width > 414 ? "360px" : "180px"}
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              backsize="cover"
              width="48%"
              height={size.width > 414 ? "360px" : "180px"}
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              backsize="cover"
              width="48%"
              height={size.width > 414 ? "360px" : "180px"}
              border="6px"
            ></IconImg>
          </HStack>

          <HStack>
            <BigButton text="Discover All Trending NFTs"></BigButton>
          </HStack>
        </VStack>

        {/* NEW NFT SECTION              */}
        <VStack alignment="center" padding="60px 0 ">
          <VStack padding="90px 0 0 0 ">
            <IconImg
              url={Star3D}
              width="150px"
              height="150px"
              backsize="cover"
            ></IconImg>

            <SubtitleBubble
              text={"NEW TALENTS ON THE MARKETPLACE"}
            ></SubtitleBubble>

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
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
            className="mySwiper2"
          >
            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>

            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>

            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>

            <SwiperSlide>
              <IconImg
                url={nftIdea}
                backsize="cover"
                width="100%"
                height="100%"
                border="6px"
              ></IconImg>
            </SwiperSlide>
          </Swiper>

          <HStack>
            <BigButton text="Discover All Trending NFTs"></BigButton>
          </HStack>
        </VStack>

        {/* <VStack
          height={size.width < 1200 ? "auto" : "740px"}
          width="100%"
          spacing="30px"
          padding="60px 0"
          marginTop="60px"
          id="spotlightCollections"
        >
          <HStack responsive={true} padding="0 12px">
            <VStack
              flexwrap={size.width < 1200 ? "nowrap" : "wrap"}
              height={size.width < 1200 ? "auto" : "600px"}
              spacing="15px"
              padding={size.width > 728 ? "0 150px" : 0}
            >
              {loading
                ? loadingCollections.map((item) => (
                    <LoadingSpot
                      key={item.name}
                      width={size.width < 1200 ? "100%" : "580px"}
                    ></LoadingSpot>
                  ))
                : topCollections.map((item, i) => (
                    <LayoutGroup id={i + 1}>
                      <TopCollectionItem
                        key={i + 1}
                        width={size.width < 1200 ? "100%" : "580px"}
                        imageCreator={item?.logo.v0}
                        collectionName={item?.name}
                        position={i + 1}
                        floorprice={item?.floorPrice}
                        owners={item?.owners}
                        nfts={item?.totalNfts}
                        volumetraded={item?.volumeTrade}
                        textcolor={({ theme }) => theme.text}
                        onClick={() =>
                          props.redirect(`collection/${item?.nickName}`)
                        }
                      ></TopCollectionItem>
                    </LayoutGroup>
                  ))}
            </VStack>
          </HStack>
        </VStack> */}

        {/* Trending NFTs Section */}
        {/* <VStack height="auto" width="100%" id="trendingNFTs">
          <HStack>
            <IconImg url={iconTrending} width="45px" height="45px"></IconImg>
            <TitleBold27>Trending NFTs</TitleBold27>
          </HStack>
          <HStack flexwrap="wrap" padding="0 30px">
            {loading
              ? loadingNFTs.map((item) => (
                  <VStack
                    minwidth={size.width < 768 ? "230px" : "280px"}
                    height="450px"
                    key={item.id}
                  >
                    <LoadingNftContainer></LoadingNftContainer>
                  </VStack>
                ))
              : size.width > 728
              ? trendingNFTs.map((item, i) => (
                  <VStack
                    minwidth={size.width < 768 ? "300px" : "280px"}
                    height="450px"
                    key={i}
                  >
                    <NftContainer
                      isVerified={item.nftId.owner.isVerified}
                      iconStatus={item.nftId.saleType.toLowerCase()}
                      hasOffers={item.nftId.hasOpenOffer}
                      fileType={item.nftId.fileType}
                      creatorImage={item.nftId.owner.urlProfile}
                      itemImage={item.nftId.urlFile.v0}
                      itemPreview={item.preview.v0}
                      price={item.nftId.price}
                      collectionName={item.nftId.collectionId.name}
                      itemNumber={item.nftId.name}
                      background={({ theme }) => theme.backElement}
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${item.nftId.tokenId}`
                        )
                      }
                      onClickCreator={() =>
                        props.redirect(`UserProfile/${item.nftId.owner._id}`)
                      }
                      owner={true}
                      usdPrice={props.xdc}
                      collectionVerified={item.nftId.creator.isVerified}
                    ></NftContainer>
                  </VStack>
                ))
              : size.width > 692
              ? trendingNFTs.slice(0, 4).map((item, i) => (
                  <VStack
                    minwidth={size.width < 768 ? "300px" : "280px"}
                    height="450px"
                    key={i}
                  >
                    <NftContainer
                      isVerified={item.nftId.owner.isVerified}
                      iconStatus={item.nftId.saleType.toLowerCase()}
                      hasOffers={item.nftId.hasOpenOffer}
                      fileType={item.nftId.fileType}
                      creatorImage={item.nftId.owner.urlProfile}
                      itemImage={item.nftId.urlFile.v0}
                      itemPreview={item.preview.v0}
                      price={item.nftId.price}
                      collectionName={item.nftId.collectionId.name}
                      itemNumber={item.nftId.name}
                      background={({ theme }) => theme.backElement}
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${item.nftId.tokenId}`
                        )
                      }
                      onClickCreator={() =>
                        props.redirect(`UserProfile/${item.nftId.owner._id}`)
                      }
                      owner={true}
                      usdPrice={props.xdc}
                      collectionVerified={item.nftId.creator.isVerified}
                    ></NftContainer>
                  </VStack>
                ))
              : trendingNFTs.slice(0, 3).map((item, i) => (
                  <VStack
                    minwidth={size.width < 768 ? "300px" : "280px"}
                    height="450px"
                    key={i}
                  >
                    <NftContainer
                      isVerified={item.nftId.owner.isVerified}
                      iconStatus={item.nftId.saleType.toLowerCase()}
                      hasOffers={item.nftId.hasOpenOffer}
                      fileType={item.nftId.fileType}
                      creatorImage={item.nftId.owner.urlProfile}
                      itemImage={item.nftId.urlFile.v0}
                      itemPreview={item.preview.v0}
                      price={item.nftId.price}
                      collectionName={item.nftId.collectionId.name}
                      itemNumber={item.nftId.name}
                      background={({ theme }) => theme.backElement}
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${item.nftId.tokenId}`
                        )
                      }
                      onClickCreator={() =>
                        props.redirect(`UserProfile/${item.nftId.owner._id}`)
                      }
                      owner={true}
                      usdPrice={props.xdc}
                      collectionVerified={item.nftId.creator.isVerified}
                    ></NftContainer>
                  </VStack>
                ))}
          </HStack>
          <ButtonApp
            height="39px"
            width="300px"
            text="Discover More"
            textcolor={appStyle.colors.white}
            onClick={() => props.redirect(`discover`)}
            cursor="pointer"
            btnStatus={0}
            background={({ theme }) => theme.blue}
          ></ButtonApp>
        </VStack> */}
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
              WANT TO GET STARTED
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
  background: linear-gradient(
    180deg,
    #f1eff0 20.8%,
    #efeff1 32.39%,
    #dce0ef 51.62%,
    #c7d0d7 64.26%,
    #dce3e8 85.56%,
    #f8fbfd 100%
  );
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
