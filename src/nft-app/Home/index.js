import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { nftaddress } from "../../config";
import { getHomeData } from "../../API/Home";
import rocketCollection from "../../images/rocketCollection.png";
import { LoadingSpot } from "../../styles/LoadingSpot";
import { TopCollectionItem } from "../../styles/TopCollectionItem";
import styled from "styled-components";
import iconTrending from "../../images/trendingNFT.png";
import { NftContainer } from "../../styles/NftContainer";
import { appStyle } from "../../styles/AppStyles";
import ButtonApp from "../../styles/Buttons";
import Carousel from "react-elastic-carousel";
import {
  HStack,
  IconImg,
  Spacer,
  VStack,
  ZItem,
  ZStack,
} from "../../styles/Stacks";
import {
  TitleBold18,
  TitleBold21,
  TitleBold27,
  TitleBold30,
  TitleBold60,
  TitleRegular21,
} from "../../styles/TextStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import logoXDSEA from "../../images/LogoXDSEA.png";
import outlinesXDSEA from "../../images/XDSeaOutlines.png";
import bannerXDC from "../../images/bannerXdc.png";
import { NewFeatured } from "../../styles/NewFeatured";
import { borderColor } from "@mui/system";
import "./customstyles.css";
import { truncateAddress } from "../../common/common";
import BlueBanner from "../../images/multicolorblur1.png";
import nftIdea from "../../images/nftIdea.jpg";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { TypeAnimation } from "react-type-animation";

import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
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

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  return (
    <Content>
      <VStack
        width="100%"
        backgroundimage={BlueBanner}
        padding="90px 30px 21px 30px"
        overflowx="hidden"
      >
        {/* Particles effect inside the top banner */}
        <Blend>
          <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "repulse",
                  },
                  onHover: {
                    enable: true,
                    mode: "bubble",
                  },
                },
                modes: {
                  attract: {
                    distance: 200,
                    duration: 0.4,
                    easing: "ease-out-quad",
                    factor: 1,
                    maxSpeed: 50,
                    speed: 1,
                  },
                  bounce: {
                    distance: 200,
                  },
                  bubble: {
                    distance: 250,
                    duration: 2,
                    mix: false,
                    opacity: 0,
                    size: 0,
                    divs: {
                      distance: 200,
                      duration: 0.4,
                      mix: false,
                      selectors: [],
                    },
                  },
                  connect: {
                    distance: 80,
                    links: {
                      opacity: 0.5,
                    },
                    radius: 60,
                  },
                  grab: {
                    distance: 400,
                    links: {
                      blink: false,
                      consent: false,
                      opacity: 1,
                    },
                  },
                  push: {
                    default: true,
                    groups: [],
                    quantity: 4,
                  },
                  remove: {
                    quantity: 2,
                  },
                  repulse: {
                    distance: 400,
                    duration: 0.4,
                    factor: 100,
                    speed: 1,
                    maxSpeed: 50,
                    easing: "ease-out-quad",
                    divs: {
                      distance: 200,
                      duration: 0.4,
                      factor: 100,
                      speed: 1,
                      maxSpeed: 50,
                      easing: "ease-out-quad",
                      selectors: [],
                    },
                  },
                  trail: {
                    delay: 1,
                    pauseOnStop: false,
                    quantity: 1,
                  },
                  light: {
                    area: {
                      gradient: {
                        start: {
                          value: "#ffffff",
                        },
                        stop: {
                          value: "#000000",
                        },
                      },
                      radius: 1000,
                    },
                    shadow: {
                      color: {
                        value: "#000000",
                      },
                      length: 2000,
                    },
                  },
                },
              },
              particles: {
                color: {
                  value: "#ffffff",
                },
                move: {
                  attract: {
                    rotate: {
                      x: 600,
                      y: 600,
                    },
                  },
                  enable: true,
                  outModes: {
                    bottom: "out",
                    left: "out",
                    right: "out",
                    top: "out",
                  },
                  random: true,
                  speed: 1,
                },
                number: {
                  density: {
                    enable: true,
                  },
                  value: 300,
                },
                opacity: {
                  random: {
                    enable: true,
                  },
                  value: {
                    min: 0,
                    max: 1,
                  },
                  animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0,
                  },
                },
                size: {
                  random: {
                    enable: true,
                  },
                  value: {
                    min: 1,
                    max: 90,
                  },
                  animation: {
                    speed: 4,
                    minimumValue: 0.3,
                  },
                },
                life: {
                  count: 0,
                  delay: {
                    random: {
                      enable: false,
                      minimumValue: 0,
                    },
                    value: 0,
                    sync: false,
                  },
                  duration: {
                    random: {
                      enable: false,
                      minimumValue: 0.0001,
                    },
                    value: 0,
                    sync: false,
                  },
                },
                roll: {
                  darken: {
                    enable: false,
                    value: 0,
                  },
                  enable: false,
                  enlighten: {
                    enable: false,
                    value: 0,
                  },
                  mode: "vertical",
                  speed: 25,
                },
                tilt: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 0,
                  animation: {
                    enable: false,
                    speed: 0,
                    decay: 0,
                    sync: false,
                  },
                  direction: "clockwise",
                  enable: false,
                },
                twinkle: {
                  lines: {
                    enable: false,
                    frequency: 0.05,
                    opacity: 1,
                  },
                  particles: {
                    enable: false,
                    frequency: 0.05,
                    opacity: 1,
                  },
                },
                wobble: {
                  distance: 5,
                  enable: false,
                  speed: {
                    angle: 50,
                    move: 10,
                  },
                },
                orbit: {
                  animation: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    sync: false,
                  },
                  enable: false,
                  opacity: 1,
                  rotation: {
                    random: {
                      enable: false,
                      minimumValue: 0,
                    },
                    value: 45,
                  },
                  width: 1,
                },
                links: {
                  blink: false,
                  color: {
                    value: "#ffffff",
                  },
                  consent: false,
                  distance: 150,
                  enable: false,
                  frequency: 1,
                  opacity: 0.4,
                  shadow: {
                    blur: 5,
                    color: {
                      value: "#000",
                    },
                    enable: false,
                  },
                  triangles: {
                    enable: false,
                    frequency: 1,
                  },
                  width: 1,
                  warp: false,
                },
                repulse: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 0,
                  enabled: false,
                  distance: 1,
                  duration: 1,
                  factor: 1,
                  speed: 1,
                },
              },
            }}
          />
        </Blend>

        <IconImg
          url={outlinesXDSEA}
          width={size.width > 768 ? "240px" : "150px"}
          height={size.width > 768 ? "240px" : "150px"}
        ></IconImg>

        <TypeAnimation
          sequence={[
            "Exploring",
            600,
            "Exploring Collecting",
            600,
            "Exploring Collecting and Selling NFT's",
            600,
          ]}
          //  Replacing previous Text
          style={{
            fontSize: "66px",
            fontWeight: "600",
            letterSpacing: "-0.06em",
            color: "white",
          }}
          wrapper="h1"
          repeat={0}
        />

        <HStack
          blur="30px"
          self="none"
          padding="12px 30px"
          border="6px"
          background="rgba(0,0,0,0.3)"
        >
          <TypeAnimation
            sequence={[
              "",
              6000,
              "Has now",
              300,
              "Has now become",
              300,
              "Has now become, simpler and faster ",
              300,
            ]}
            //  Replacing previous Text
            style={{
              fontSize: "21px",
              fontWeight: "600",
              letterSpacing: "-0.06em",
              color: "white",
              textAlign: "center",
            }}
            wrapper="h2"
            repeat={0}
            cursor={false}
          />
        </HStack>

        <VStack minwidth="1200px">
          <Masonry columnsCount={3} gutter="10px">
            <IconImg
              url={nftIdea}
              backsize="cover"
              width="100%"
              height="372px"
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%px"
              height="435px"
              backsize="cover"
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="306px"
              backsize="cover"
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="401px"
              backsize="cover"
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="338px"
              backsize="cover"
              border="6px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="469px"
              backsize="cover"
              border="6px"
            ></IconImg>
          </Masonry>
        </VStack>

        {/* <GridNfts>
          <Masonry columnsCount={3} gutter="10px">
            <IconImg
              url={nftIdea}
              backsize="cover"
              width="100%"
              height="372px"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%px"
              height="435px"
              backsize="cover"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="306px"
              backsize="cover"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="401px"
              backsize="cover"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="341px"
              backsize="cover"
            ></IconImg>
            <IconImg
              url={nftIdea}
              width="100%"
              height="469px"
              backsize="cover"
            ></IconImg>
          </Masonry>
        </GridNfts> */}
      </VStack>

      <ContentCentered>
        {/* Top Section in Home */}

        <HStack width="100%" height="auto" flexwrap="wrap" spacing="9px">
          {/* Main Logo Square */}

          {/* <VStack
            background={({ theme }) => theme.faded}
            minwidth={size.width > 768 ? "30%" : "100%"}
            border="9px"
            height={size.width > 768 ? "390px" : "260px"}
          >
            <IconImg
              url={logoXDSEA}
              width={size.width > 768 ? "150px" : "90px"}
              height={size.width > 768 ? "150px" : "90px"}
            ></IconImg>
            <HStack padding="0 21px">
              <TitleBold27 align="center">
                Exploring, Collecting <br></br> and Selling
              </TitleBold27>
            </HStack>

            <HStack>
              <Spacer></Spacer>
              <HStack
                background={({ theme }) => theme.blue}
                border="9px"
                padding="12px 30px"
              >
                <TitleBold18 textcolor={appStyle.colors.white}>
                  Exclusive NFTs
                </TitleBold18>
              </HStack>
              <Spacer></Spacer>
            </HStack>
          </VStack> */}

          {size.width > 728 ? (
            <>
              {/* First NFT Featured */}
              {/* <VStack
                minwidth={
                  size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                }
                height="390px"
              >
                <LayoutGroup id="number1">
                  <NewFeatured
                    creatorImage={featuredNFTs[0]?.nftId.collectionId.logo.v0}
                    itemImage={featuredNFTs[0]?.nftId.urlFile.v0}
                    collectionName={featuredNFTs[0]?.nftId.collectionId.name}
                    creatorName={truncateAddress(
                      featuredNFTs[0]?.nftId.creator.userName
                    )}
                    itemNumber={featuredNFTs[0]?.nftId.name}
                    fileType={featuredNFTs[0]?.nftId.fileType}
                    onClickCreator={() =>
                      props.redirect(
                        `collection/${featuredNFTs[0]?.nftId.collectionId.nickName}`
                      )
                    }
                    onClick={() =>
                      props.redirect(
                        `nft/${nftaddress}/${featuredNFTs[0]?.nftId.tokenId}`
                      )
                    }
                  ></NewFeatured>
                </LayoutGroup>
              </VStack> */}
              {/* Second NFT Featured */}
              {/* <VStack
                minwidth={
                  size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                }
                height="390px"
              >
                <LayoutGroup id="number2">
                  <NewFeatured
                    creatorImage={featuredNFTs[1]?.nftId.collectionId.logo.v0}
                    itemImage={featuredNFTs[1]?.nftId.urlFile.v0}
                    collectionName={featuredNFTs[1]?.nftId.collectionId.name}
                    creatorName={truncateAddress(
                      featuredNFTs[1]?.nftId.creator.userName
                    )}
                    itemNumber={featuredNFTs[1]?.nftId.name}
                    fileType={featuredNFTs[1]?.nftId.fileType}
                    onClickCreator={() =>
                      props.redirect(
                        `collection/${featuredNFTs[1]?.nftId.collectionId.nickName}`
                      )
                    }
                    onClick={() =>
                      props.redirect(
                        `nft/${nftaddress}/${featuredNFTs[1]?.nftId.tokenId}`
                      )
                    }
                  ></NewFeatured>
                </LayoutGroup>
              </VStack> */}
              {/* Third NFT Featured */}
              {/* <VStack
                minwidth={
                  size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                }
                height="390px"
              >
                <LayoutGroup id="number3">
                  <NewFeatured
                    creatorImage={featuredNFTs[2]?.nftId.collectionId.logo.v0}
                    itemImage={featuredNFTs[2]?.nftId.urlFile.v0}
                    collectionName={featuredNFTs[2]?.nftId.collectionId.name}
                    creatorName={truncateAddress(
                      featuredNFTs[2]?.nftId.creator.userName
                    )}
                    itemNumber={featuredNFTs[2]?.nftId.name}
                    fileType={featuredNFTs[2]?.nftId.fileType}
                    onClickCreator={() =>
                      props.redirect(
                        `collection/${featuredNFTs[2]?.nftId.collectionId.nickName}`
                      )
                    }
                    onClick={() =>
                      props.redirect(
                        `nft/${nftaddress}/${featuredNFTs[2]?.nftId.tokenId}`
                      )
                    }
                  ></NewFeatured>
                </LayoutGroup>
              </VStack> */}
              {/* Four NFT Featured */}
              {/* <VStack
                minwidth={
                  size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                }
                height="390px"
              >
                <LayoutGroup id="number4">
                  <NewFeatured
                    creatorImage={featuredNFTs[3]?.nftId.collectionId.logo.v0}
                    itemImage={featuredNFTs[3]?.nftId.urlFile.v0}
                    collectionName={featuredNFTs[3]?.nftId.collectionId.name}
                    creatorName={truncateAddress(
                      featuredNFTs[3]?.nftId.creator.userName
                    )}
                    itemNumber={featuredNFTs[3]?.nftId.name}
                    fileType={featuredNFTs[3]?.nftId.fileType}
                    onClickCreator={() =>
                      props.redirect(
                        `collection/${featuredNFTs[3]?.nftId.collectionId.nickName}`
                      )
                    }
                    onClick={() =>
                      props.redirect(
                        `nft/${nftaddress}/${featuredNFTs[3]?.nftId.tokenId}`
                      )
                    }
                  ></NewFeatured>
                </LayoutGroup>
              </VStack> */}
            </>
          ) : (
            // Doc from Carousel https://sag1v.github.io/react-elastic-carousel/

            <VStack className="bigblue">
              <Carousel
                itemsToShow={1}
                // enableAutoPlay={true}
                // autoPlaySpeed={3000}
                showArrows={false}
                pagination={true}
                enableTilt={true}
              >
                {/* First NFT Featured */}
                <VStack
                  minwidth={
                    size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                  }
                  height="390px"
                >
                  <LayoutGroup id="number1">
                    <NewFeatured
                      creatorImage={featuredNFTs[0]?.nftId.collectionId.logo.v0}
                      itemImage={featuredNFTs[0]?.nftId.urlFile.v0}
                      collectionName={featuredNFTs[0]?.nftId.collectionId.name}
                      creatorName={truncateAddress(
                        featuredNFTs[0]?.nftId.creator.userName
                      )}
                      itemNumber={featuredNFTs[0]?.nftId.name}
                      fileType={featuredNFTs[0]?.nftId.fileType}
                      onClickCreator={() =>
                        props.redirect(
                          `collection/${featuredNFTs[0]?.nftId.collectionId.nickName}`
                        )
                      }
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${featuredNFTs[0]?.nftId.tokenId}`
                        )
                      }
                    ></NewFeatured>
                  </LayoutGroup>
                </VStack>
                {/* Second NFT Featured */}
                <VStack
                  minwidth={
                    size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                  }
                  height="390px"
                >
                  <LayoutGroup id="number2">
                    <NewFeatured
                      creatorImage={featuredNFTs[1]?.nftId.collectionId.logo.v0}
                      itemImage={featuredNFTs[1]?.nftId.urlFile.v0}
                      collectionName={featuredNFTs[1]?.nftId.collectionId.name}
                      creatorName={truncateAddress(
                        featuredNFTs[1]?.nftId.creator.userName
                      )}
                      itemNumber={featuredNFTs[1]?.nftId.name}
                      fileType={featuredNFTs[1]?.nftId.fileType}
                      onClickCreator={() =>
                        props.redirect(
                          `collection/${featuredNFTs[1]?.nftId.collectionId.nickName}`
                        )
                      }
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${featuredNFTs[1]?.nftId.tokenId}`
                        )
                      }
                    ></NewFeatured>
                  </LayoutGroup>
                </VStack>

                {/* Third NFT Featured */}
                <VStack
                  minwidth={
                    size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                  }
                  height="390px"
                >
                  <LayoutGroup id="number3">
                    <NewFeatured
                      creatorImage={featuredNFTs[2]?.nftId.collectionId.logo.v0}
                      itemImage={featuredNFTs[2]?.nftId.urlFile.v0}
                      collectionName={featuredNFTs[2]?.nftId.collectionId.name}
                      creatorName={truncateAddress(
                        featuredNFTs[2]?.nftId.creator.userName
                      )}
                      itemNumber={featuredNFTs[2]?.nftId.name}
                      fileType={featuredNFTs[2]?.nftId.fileType}
                      onClickCreator={() =>
                        props.redirect(
                          `collection/${featuredNFTs[2]?.nftId.collectionId.nickName}`
                        )
                      }
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${featuredNFTs[2]?.nftId.tokenId}`
                        )
                      }
                    ></NewFeatured>
                  </LayoutGroup>
                </VStack>

                {/* Four NFT Featured */}
                <VStack
                  minwidth={
                    size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
                  }
                  height="390px"
                >
                  <LayoutGroup id="number4">
                    <NewFeatured
                      creatorImage={featuredNFTs[3]?.nftId.collectionId.logo.v0}
                      itemImage={featuredNFTs[3]?.nftId.urlFile.v0}
                      collectionName={featuredNFTs[3]?.nftId.collectionId.name}
                      creatorName={truncateAddress(
                        featuredNFTs[3]?.nftId.creator.userName
                      )}
                      itemNumber={featuredNFTs[3]?.nftId.name}
                      fileType={featuredNFTs[3]?.nftId.fileType}
                      onClickCreator={() =>
                        props.redirect(
                          `collection/${featuredNFTs[3]?.nftId.collectionId.nickName}`
                        )
                      }
                      onClick={() =>
                        props.redirect(
                          `nft/${nftaddress}/${featuredNFTs[3]?.nftId.tokenId}`
                        )
                      }
                    ></NewFeatured>
                  </LayoutGroup>
                </VStack>
              </Carousel>
            </VStack>
          )}

          {/* Simpler & Faster Block */}
          {/* <VStack
            background={appStyle.colors.darkgrey10}
            minwidth={size.width > 768 ? "30%" : "100%"}
            height={size.width > 768 ? "390px" : "210px"}
            border="9px"
          >
            <VStack padding="0 21px" spacing="3px">
              <TitleBold27 align="center">
                has now <br></br> become
              </TitleBold27>
              <TitleBold27 align="center" textcolor={({ theme }) => theme.blue}>
                simpler & <br></br>faster.
              </TitleBold27>
            </VStack>
          </VStack> */}
        </HStack>

        {/* How to get started Banner */}
        <VStack width="100%" padding="60px 0">
          <ZStack height="300px">
            <ZItem>
              <IconImg
                url={BlueBanner}
                width="100%"
                height="300px"
                border={size.width < 1200 ? "0px" : "15px"}
                backsize="cover"
              ></IconImg>
            </ZItem>

            <ZItem>
              <VStack
                width="100%"
                height="100%"
                whileHover={{ scale: 1.05 }}
                onClick={() => props.redirect("HowToStart")}
              >
                <TitleBold27 textcolor={appStyle.colors.white}>
                  Want to Get Started?
                </TitleBold27>
                <ButtonApp
                  text="Here is How"
                  textcolor={appStyle.colors.black}
                  background={appStyle.colors.white}
                  width="180px"
                  cursor="pointer"
                ></ButtonApp>
              </VStack>
            </ZItem>
          </ZStack>
        </VStack>

        {/* Top Collections Section */}
        <VStack
          height={size.width < 1200 ? "auto" : "740px"}
          width="100%"
          spacing="30px"
          padding="60px 0"
          marginTop="60px"
          id="spotlightCollections"
        >
          <HStack>
            <IconImg
              url={rocketCollection}
              width="45px"
              height="45px"
            ></IconImg>
            <TitleBold27 textcolor={({ theme }) => theme.text}>
              Top Collections
            </TitleBold27>
          </HStack>
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
        </VStack>

        {/* Trending NFTs Section */}
        <VStack height="auto" width="100%" id="trendingNFTs">
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
        </VStack>
      </ContentCentered>
    </Content>
  );
};

export { Home };

const Content = styled(motion.div)`
  padding: 0;
  widht: 100%;

  box-sizing: border-box;
  background: ${({ theme }) => theme.background};
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
  mix-blend-mode: overlay;
`;
