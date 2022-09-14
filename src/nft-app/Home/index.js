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
import { TitleBold18, TitleBold27 } from "../../styles/TextStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import logoXuppi from "../../images/LogoXuppi.png";
import bannerXuppi from "../../images/bannerXuppi.png";
import menuContext from "../../context/menuContext";
import { NewFeatured } from "../../styles/NewFeatured";
import { borderColor } from "@mui/system";
import "./customstyles.css";
import banner1 from "../../images/Banner1.jpg";
import { isSafari } from "../../common/common";

const Home = (props) => {
  const history = useHistory();
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
  const [, setShowMenu] = useContext(menuContext);

  /**
   * Get content for the Home page
   */
  const getData = async () => {
    try {
      setLoading(true);
      const homeData = (await getHomeData()).data;
      const featuredNFTList = await Promise.all(
        homeData.featuredNfts.map(async (nft) => {
          let featuredNFT = {
            collectionName: nft.collectionId.name,
            collectionNickName: nft.collectionId.nickName,
            collectionLogo: nft.collectionId.logo.v0,
            image: nft.urlFile.v0,
            name: nft.name,
            fileType: nft.fileType,
            nftContract: nft.collectionId.address,
            preview: nft.preview.v0,
            creator: nft.creator.userName,
            creatorId: nft.creator._id,
            tokenId: nft.tokenId,
            isVerified: nft.creator.isVerified,
          };
          return featuredNFT;
        })
      );

      const topCollectionList = await Promise.all(
        homeData.topCollections.map(async (collection, i) => {
          let topCollection = {
            id: i,
            name: collection.name,
            nickName: collection.nickName,
            logo: collection.logo.v0,
            floorPrice: collection.floorPrice,
            volumeTraded: collection.volumeTrade,
            items: collection.totalNfts,
            owners: collection.owners,
          };
          return topCollection;
        })
      );

      const trendingNFTList = await Promise.all(
        homeData.trendingNfts.map(async (nft) => {
          let trendingNFT = {
            collectionName: nft.collectionId.name,
            collectionNickName: nft.collectionId.nickName,
            creatorLogo: nft.owner.urlProfile,
            image: nft.urlFile,
            name: nft.name,
            hasOpenOffer: nft.hasOpenOffer,
            price: nft.price,
            fileType: nft.fileType,
            preview: nft.preview.v0,
            nftContract: nft.collectionId.address,
            creator: nft.creator.userName,
            ownerId: nft.owner._id,
            tokenId: nft.tokenId,
            saleType: nft.saleType.toLowerCase(),
            isVerified: nft.owner.isVerified,
            collectionVerified: nft.creator.isVerified,
          };
          return trendingNFT;
        })
      );

      setFeaturedNFTs(featuredNFTList);
      setTopCollections(topCollectionList);
      setTrendingNFTs(trendingNFTList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 6) + "..." + address.substring(38)
      : "undefined";
  };

  function NavigateTo(route) {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
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

  return (
    <Content>
      <HStack width="100%" height="auto" flexwrap="wrap" spacing="9px">
        {/* Main Logo Square */}
        <VStack
          background={({ theme }) => theme.faded}
          minwidth={size.width > 768 ? "30%" : "100%"}
          border="9px"
          height={size.width > 768 ? "390px" : "260px"}
        >
          <IconImg
            url={logoXuppi}
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
        </VStack>

        {size.width > 728 ? (
          <>
            {/* First NFT Featured */}
            <VStack
              minwidth={
                size.width > 768 ? "30%" : size.width > 425 ? "39%" : "100%"
              }
              height="390px"
            >
              <LayoutGroup id="number1">
                <NewFeatured
                  creatorImage={featuredNFTs[0]?.collectionLogo}
                  itemImage={featuredNFTs[0]?.image}
                  collectionName={featuredNFTs[0]?.collectionName}
                  creatorName={truncateAddress(featuredNFTs[0]?.creator)}
                  itemNumber={featuredNFTs[0]?.name}
                  fileType={featuredNFTs[0]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(
                      `collection/${featuredNFTs[0]?.collectionNickName}`
                    )
                  }
                  onClick={() =>
                    NavigateTo(`nft/${featuredNFTs[0].nftContract}/${featuredNFTs[0]?.tokenId}`)
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
                  creatorImage={featuredNFTs[1]?.collectionLogo}
                  itemImage={featuredNFTs[1]?.image}
                  collectionName={featuredNFTs[1]?.collectionName}
                  creatorName={truncateAddress(featuredNFTs[1]?.creator)}
                  itemNumber={featuredNFTs[1]?.name}
                  fileType={featuredNFTs[1]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(
                      `collection/${featuredNFTs[1]?.collectionNickName}`
                    )
                  }
                  onClick={() =>
                    NavigateTo(`nft/${featuredNFTs[1].nftContract}/${featuredNFTs[1]?.tokenId}`)
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
                  creatorImage={featuredNFTs[2]?.collectionLogo}
                  itemImage={featuredNFTs[2]?.image}
                  collectionName={featuredNFTs[2]?.collectionName}
                  creatorName={truncateAddress(featuredNFTs[2]?.creator)}
                  itemNumber={featuredNFTs[2]?.name}
                  fileType={featuredNFTs[2]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(
                      `collection/${featuredNFTs[2]?.collectionNickName}`
                    )
                  }
                  onClick={() =>
                    NavigateTo(`nft/${featuredNFTs[2].nftContract}/${featuredNFTs[2]?.tokenId}`)
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
                  creatorImage={featuredNFTs[3]?.collectionLogo}
                  itemImage={featuredNFTs[3]?.image}
                  collectionName={featuredNFTs[3]?.collectionName}
                  creatorName={truncateAddress(featuredNFTs[3]?.creator)}
                  itemNumber={featuredNFTs[3]?.name}
                  fileType={featuredNFTs[3]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(
                      `collection/${featuredNFTs[3]?.collectionNickName}`
                    )
                  }
                  onClick={() =>
                    NavigateTo(`nft/${featuredNFTs[3].nftContract}/${featuredNFTs[3]?.tokenId}`)
                  }
                ></NewFeatured>
              </LayoutGroup>
            </VStack>
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
                    creatorImage={featuredNFTs[0]?.collectionLogo}
                    itemImage={featuredNFTs[0]?.image}
                    collectionName={featuredNFTs[0]?.collectionName}
                    creatorName={truncateAddress(featuredNFTs[0]?.creator)}
                    itemNumber={featuredNFTs[0]?.name}
                    fileType={featuredNFTs[0]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(
                        `collection/${featuredNFTs[0]?.collectionNickName}`
                      )
                    }
                    onClick={() =>
                      NavigateTo(
                        `nft/${featuredNFTs[0].nftContract}/${featuredNFTs[0]?.tokenId}`
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
                    creatorImage={featuredNFTs[1]?.collectionLogo}
                    itemImage={featuredNFTs[1]?.image}
                    collectionName={featuredNFTs[1]?.collectionName}
                    creatorName={truncateAddress(featuredNFTs[1]?.creator)}
                    itemNumber={featuredNFTs[1]?.name}
                    fileType={featuredNFTs[1]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(
                        `collection/${featuredNFTs[1]?.collectionNickName}`
                      )
                    }
                    onClick={() =>
                      NavigateTo(
                        `nft/${featuredNFTs[1].nftContract}/${featuredNFTs[1]?.tokenId}`
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
                    creatorImage={featuredNFTs[2]?.collectionLogo}
                    itemImage={featuredNFTs[2]?.image}
                    collectionName={featuredNFTs[2]?.collectionName}
                    creatorName={truncateAddress(featuredNFTs[2]?.creator)}
                    itemNumber={featuredNFTs[2]?.name}
                    fileType={featuredNFTs[2]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(
                        `collection/${featuredNFTs[2]?.collectionNickName}`
                      )
                    }
                    onClick={() =>
                      NavigateTo(
                        `nft/${featuredNFTs[2].nftContract}/${featuredNFTs[2]?.tokenId}`
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
                    creatorImage={featuredNFTs[3]?.collectionLogo}
                    itemImage={featuredNFTs[3]?.image}
                    collectionName={featuredNFTs[3]?.collectionName}
                    creatorName={truncateAddress(featuredNFTs[3]?.creator)}
                    itemNumber={featuredNFTs[3]?.name}
                    fileType={featuredNFTs[3]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(
                        `collection/${featuredNFTs[3]?.collectionNickName}`
                      )
                    }
                    onClick={() =>
                      NavigateTo(
                        `nft/${featuredNFTs[3].nftContract}/${featuredNFTs[3]?.tokenId}`
                      )
                    }
                  ></NewFeatured>
                </LayoutGroup>
              </VStack>
            </Carousel>
          </VStack>
        )}

        {/* Simpler & Faster Block */}
        <VStack
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
        </VStack>
      </HStack>

      {/* How to get started Banner */}
      <VStack width="100%" padding="60px 0">
        <ZStack height="300px">
          <ZItem>
            <IconImg
              url={bannerXuppi}
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
              onClick={() => NavigateTo("HowToStart")}
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
          <IconImg url={rocketCollection} width="45px" height="45px"></IconImg>
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
              : topCollections.map((item) => (
                  <LayoutGroup id={item.id + 1}>
                    <TopCollectionItem
                      key={item?.id + 1}
                      width={size.width < 1200 ? "100%" : "580px"}
                      imageCreator={item?.logo}
                      collectionName={item?.name}
                      position={item?.id + 1}
                      floorprice={item?.floorPrice}
                      owners={item?.owners}
                      nfts={item?.items}
                      volumetraded={item?.volumeTraded}
                      textcolor={({ theme }) => theme.text}
                      onClick={() => NavigateTo(`collection/${item?.nickName}`)}
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
                    isVerified={item.isVerified}
                    iconStatus={item.saleType}
                    hasOffers={item.hasOpenOffer}
                    fileType={item.fileType}
                    creatorImage={item.creatorLogo}
                    itemImage={item.image}
                    price={item.price}
                    collectionName={item.collectionName}
                    itemNumber={item.name}
                    background={({ theme }) => theme.backElement}
                    onClick={() =>
                      NavigateTo(`nft/${item.nftContract}/${item.tokenId}`)
                    }
                    onClickCreator={() =>
                      NavigateTo(`UserProfile/${item.ownerId}`)
                    }
                    owner={true}
                    usdPrice={props.xdc}
                    collectionVerified={item.collectionVerified}
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
                    isVerified={item.isVerified}
                    iconStatus={item.saleType}
                    hasOffers={item.hasOpenOffer}
                    fileType={item.fileType}
                    creatorImage={item.creatorLogo}
                    itemImage={item.image}
                    price={item.price}
                    collectionName={item.collectionName}
                    itemNumber={item.name}
                    background={({ theme }) => theme.backElement}
                    onClick={() =>
                      NavigateTo(`nft/${item.nftContract}/${item.tokenId}`)
                    }
                    onClickCreator={() =>
                      NavigateTo(`UserProfile/${item.ownerId}`)
                    }
                    owner={true}
                    usdPrice={props.xdc}
                    collectionVerified={item.collectionVerified}
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
                    isVerified={item.isVerified}
                    iconStatus={item.saleType}
                    hasOffers={item.hasOpenOffer}
                    fileType={item.fileType}
                    creatorImage={item.creatorLogo}
                    itemImage={item.image}
                    price={item.price}
                    collectionName={item.collectionName}
                    itemNumber={item.name}
                    background={({ theme }) => theme.backElement}
                    onClick={() =>
                      NavigateTo(`nft/${item.nftContract}/${item.tokenId}`)
                    }
                    onClickCreator={() =>
                      NavigateTo(`UserProfile/${item.ownerId}`)
                    }
                    usdPrice={props.xdc}
                    owner={true}
                    collectionVerified={item.collectionVerified}
                  ></NftContainer>
                </VStack>
              ))}
        </HStack>
        <ButtonApp
          height="39px"
          width="300px"
          text="Discover More"
          textcolor={appStyle.colors.white}
          onClick={() => NavigateTo(`discover`)}
          cursor="pointer"
          btnStatus={0}
          background={({ theme }) => theme.blue}
        ></ButtonApp>
      </VStack>
    </Content>
  );
};

export { Home };

const Content = styled(motion.div)`
  padding: 120px 0;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.background};
`;
