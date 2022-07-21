import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { HTTP_METHODS } from "../../constant";
import { nftaddress } from "../../config";
import {
  featuredNFTList,
  trendingItemList,
  verifiedProfiles,
//   spotlightCollectionList,
//   burnedCollections
} from "../../blacklist";
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
  TitleBold27,
} from "../../styles/TextStyles";
import {
  LayoutGroup,
  motion,
} from "framer-motion/dist/framer-motion";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import logoXDSEA from "../../images/LogoXDSEA.png";
import bannerXDC from "../../images/bannerXdc.png";
import menuContext from "../../context/menuContext";
import { NewFeatured } from "../../styles/NewFeatured";
import "./customstyles.css";
import CID from "cids";
import { createRequest } from "../../API/index";

const Home = () => {
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [featuredNFT, setFeaturedNFT] = useState([]);
  const [setLoading, isSetLoading] = useState(false);
  const [, setShowMenu] = useContext(menuContext);
  // const [arrayCollection] = useState([
  //   { id: 1, name: "Collection 1" },
  //   { id: 2, name: "Collection 2" },
  //   { id: 3, name: "Collection 3" },
  //   { id: 4, name: "Collection 4" },
  //   { id: 5, name: "Collection 5" },
  //   { id: 6, name: "Collection 6" },
  //   { id: 7, name: "Collection 7" },
  //   { id: 8, name: "Collection 8" },
  //   { id: 9, name: "Collection 9" },
  //   { id: 10, name: "Collection 10" },
  // ]);
  const [loadingNFT] = useState([
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

  const getData = async () => {
    try {
        isSetLoading(true);
        const featuredNFTs = await Promise.all(
            featuredNFTList.map(async (i) => {
                const nftData = await (await createRequest(HTTP_METHODS.get, `nft/byToken/${i}`, null, null)).data.nft;
                let featuredNFTData = {
                    collectionName: nftData.collectionId.name,
                    collectionLogo: nftData.collectionId.logo.split("/")[2] === "ipfs.infura.io"
                        ? `https://${new CID(nftData.collectionId.logo.split("/")[4]).toV1()
                            .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                        : nftData.collectionId.logo,
                    image: nftData.urlFile.split("/")[2] === "ipfs.infura.io"
                        ? `https://${new CID(nftData.urlFile.split("/")[4]).toV1()
                            .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                        : nftData.urlFile,
                    name: i === "3567"
                        ? "TAURULIOMPS 1/12"
                        : i === "3580"
                            ? "GEMINLIOMP 2/12"
                            : i === "3584"
                                ? "LIBRIOMP 2/12"
                                : i === "3650"
                                    ? "PISCELIOMPS 8/12"
                                    : i === "3679"
                                        ? "LEOIOMP 10/12"
                                        : i === "3695"
                                            ? "SAGITTARIOMPS 11/12"
                                            : nftData.name,
                    fileType: nftData.fileType,
                    preview: nftData.preview.split("/")[2] === "ipfs.infura.io"
                        ? `https://${new CID(nftData.preview.split("/")[4]).toV1()
                            .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                        : nftData.preview,
                    creator: nftData.addressCreator,
                    tokenId: i,
                };
                return featuredNFTData;
            }));
        const trendingItems = await Promise.all(
            trendingItemList.map(async (i) => {
                const nftData = await (await createRequest(HTTP_METHODS.get, `nft/byToken/${i}`, null, null)).data.nft;
                let item = {
                    price: nftData.price,
                    collectionLogo: nftData.collectionId.logo.split("/")[2] === "ipfs.infura.io"
                        ? `https://${new CID(nftData.collectionId.logo.split("/")[4]).toV1()
                            .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                        : nftData.collectionId.logo,
                    collectionName: nftData.collectionId.name,
                    tokenId: i,
                    image: nftData.urlFile.split("/")[2] === "ipfs.infura.io"
                        ? `https://${new CID(nftData.urlFile.split("/")[4]).toV1()
                            .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                        : nftData.urlFile,
                    name: i === "3567"
                        ? "TAURULIOMPS 1/12"
                        : i === "3580"
                            ? "GEMINLIOMP 2/12"
                            : i === "3584"
                                ? "LIBRIOMP 2/12"
                                : i === "3650"
                                    ? "PISCELIOMPS 8/12"
                                    : i === "3679"
                                        ? "LEOIOMP 10/12"
                                        : i === "3695"
                                            ? "SAGITTARIOMPS 11/12"
                                            : nftData.name,
                    fileType: nftData.fileType,
                    preview: nftData.preview.split("/")[2] === "ipfs.infura.io"
                        ? `https://${new CID(nftData.preview.split("/")[4]).toV1()
                            .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
                        : nftData.preview,
                    isListed: nftData.isListed,
                    // offerCount: itemData.offerCount,
                    creator: nftData.addressCreator,
                };
                return item;
            }));
    //   const spotlightCollections = await Promise.all(
    //     spotlightCollectionList.map(async (name, i) => {
    //         const collectionData = await (await createRequest(HTTP_METHODS.get, `collection/byNickName/${name}`, null, null)).data;
    //         let collection = {
    //             id: i,
    //             name: collectionData.collection.name,
    //             collectionLogo: collectionData.collection.logo.split("/")[2] === "ipfs.infura.io"
    //                 ? `https://${new CID(collectionData.collection.logo.split("/")[4]).toV1()
    //                     .toBaseEncodedString("base32")}.ipfs.infura-ipfs.io`
    //                 : collectionData.collection.logo,
    //             floorPrice: collectionData.metrics.floorPrice,
    //             // volumeTraded: volumeTraded,
    //             items: !burnedCollections.includes(collectionData.collection.name)
    //                 ? collectionData.metrics.nftCount
    //                 : collectionData.metrics.nftCount - 1,
    //             owners: collectionData.metrics.owners,
    //         };
    //         return collection;
    //     })
    //   );

      // setCollections(spotlightCollections);
      setNFts(trendingItems);
      setFeaturedNFT(featuredNFTs);
      isSetLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  function NavigateTo(route) {
    setShowMenu(false);
    history.push(`/${route}`);
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  useEffect(() => {
  }, [scrolling]);

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
                  creatorImage={featuredNFT[0]?.collectionLogo}
                  itemImage={featuredNFT[0]?.image}
                  collectionName={featuredNFT[0]?.collectionName}
                  creatorName={truncateAddress(featuredNFT[0]?.creator)}
                  itemNumber={featuredNFT[0]?.name}
                  fileType={featuredNFT[0]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(`collection/${featuredNFT[0]?.collectionName}`)
                  }
                  onClick={() =>
                    NavigateTo(`nft/${nftaddress}/${featuredNFT[0]?.tokenId}`)
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
                  creatorImage={featuredNFT[1]?.collectionLogo}
                  itemImage={featuredNFT[1]?.image}
                  collectionName={featuredNFT[1]?.collectionName}
                  creatorName={truncateAddress(featuredNFT[1]?.creator)}
                  itemNumber={featuredNFT[1]?.name}
                  fileType={featuredNFT[1]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(`collection/${featuredNFT[1]?.collectionName}`)
                  }
                  onClick={() =>
                    NavigateTo(`nft/${nftaddress}/${featuredNFT[1]?.tokenId}`)
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
                  creatorImage={featuredNFT[2]?.collectionLogo}
                  itemImage={featuredNFT[2]?.image}
                  collectionName={featuredNFT[2]?.collectionName}
                  creatorName={truncateAddress(featuredNFT[2]?.creator)}
                  itemNumber={featuredNFT[2]?.name}
                  fileType={featuredNFT[2]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(`collection/${featuredNFT[2]?.collectionName}`)
                  }
                  onClick={() =>
                    NavigateTo(`nft/${nftaddress}/${featuredNFT[2]?.tokenId}`)
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
                  creatorImage={featuredNFT[3]?.collectionLogo}
                  itemImage={featuredNFT[3]?.image}
                  collectionName={featuredNFT[3]?.collectionName}
                  creatorName={truncateAddress(featuredNFT[3]?.creator)}
                  itemNumber={featuredNFT[3]?.name}
                  fileType={featuredNFT[3]?.fileType}
                  onClickCreator={() =>
                    NavigateTo(`collection/${featuredNFT[3]?.collectionName}`)
                  }
                  onClick={() =>
                    NavigateTo(`nft/${nftaddress}/${featuredNFT[3]?.tokenId}`)
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
                    creatorImage={featuredNFT[0]?.collectionLogo}
                    itemImage={featuredNFT[0]?.image}
                    collectionName={featuredNFT[0]?.collectionName}
                    creatorName={truncateAddress(featuredNFT[0]?.creator)}
                    itemNumber={featuredNFT[0]?.name}
                    fileType={featuredNFT[0]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(`collection/${featuredNFT[0]?.collectionName}`)
                    }
                    onClick={() =>
                      NavigateTo(`nft/${nftaddress}/${featuredNFT[0]?.tokenId}`)
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
                    creatorImage={featuredNFT[1]?.collectionLogo}
                    itemImage={featuredNFT[1]?.image}
                    collectionName={featuredNFT[1]?.collectionName}
                    creatorName={truncateAddress(featuredNFT[1]?.creator)}
                    itemNumber={featuredNFT[1]?.name}
                    fileType={featuredNFT[1]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(`collection/${featuredNFT[1]?.collectionName}`)
                    }
                    onClick={() =>
                      NavigateTo(`nft/${nftaddress}/${featuredNFT[1]?.tokenId}`)
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
                    creatorImage={featuredNFT[2]?.collectionLogo}
                    itemImage={featuredNFT[2]?.image}
                    collectionName={featuredNFT[2]?.collectionName}
                    creatorName={truncateAddress(featuredNFT[2]?.creator)}
                    itemNumber={featuredNFT[2]?.name}
                    fileType={featuredNFT[2]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(`collection/${featuredNFT[2]?.collectionName}`)
                    }
                    onClick={() =>
                      NavigateTo(`nft/${nftaddress}/${featuredNFT[2]?.tokenId}`)
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
                    creatorImage={featuredNFT[3]?.collectionLogo}
                    itemImage={featuredNFT[3]?.image}
                    collectionName={featuredNFT[3]?.collectionName}
                    creatorName={truncateAddress(featuredNFT[3]?.creator)}
                    itemNumber={featuredNFT[3]?.name}
                    fileType={featuredNFT[3]?.fileType}
                    onClickCreator={() =>
                      NavigateTo(`collection/${featuredNFT[3]?.collectionName}`)
                    }
                    onClick={() =>
                      NavigateTo(`nft/${nftaddress}/${featuredNFT[3]?.tokenId}`)
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

        {/* Top Collections Section */}
      {/* <VStack
        height={size.width < 768 ? "auto" : "700px"}
        width="100%"
        spacing="9px"
        padding="60px 0"
        marginTop="60px"
        id="spotlightCollections"
      >
        <HStack>
          <IconImg url={rocketCollection} width="45px" height="45px"></IconImg>
          <TitleBold27 textcolor={({ theme }) => theme.text}>
            Spotlight Collections
          </TitleBold27>
        </HStack>
        <HStack responsive={true}>
          <VStack
            flexwrap={size.width < 768 ? "nowrap" : "wrap"}
            height={size.width < 768 ? "auto" : "630px"}
            spacing="15px"
          >
            {setLoading
              ? arrayCollection.map((item) => (
                  <LoadingSpot
                    key={item.name}
                    width={size.width < 768 ? "100%" : "580px"}
                  ></LoadingSpot>
                ))
              : collections.map((item) => (
                  <LayoutGroup id={item.id + 1}>
                    <TopCollectionItem
                      key={item.id + 1}
                      width={size.width < 768 ? "100%" : "580px"}
                      imageCreator={item.collectionLogo}
                      collectionName={item.name}
                      position={item.id + 1}
                      floorprice={item.floorPrice}
                      owners={item.owners}
                      nfts={item.items}
                      volumetraded={item.volumeTraded}
                      textcolor={({ theme }) => theme.text}
                      onClick={() => NavigateTo(`collection/${item.name}`)}
                    ></TopCollectionItem>
                  </LayoutGroup>
                ))}
          </VStack>
        </HStack>
      </VStack> */}

      {/* How to get started Banner */}
      <VStack width="100%" padding="60px 0">
        <ZStack height="300px">
          <ZItem>
            <IconImg
              url={bannerXDC}
              width="100%"
              height="300px"
              border={size.width < 768 ? "0px" : "15px"}
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

      {/* Trending NFTs Section */}
      <VStack
        height="auto"
        // height={size.width < 768 ? "auto" : "auto"}
        width="100%"
        id="trendingNFTs"
      >
        <HStack>
          <IconImg url={iconTrending} width="45px" height="45px"></IconImg>
          <TitleBold27>Trending NFTs</TitleBold27>
        </HStack>
        <HStack flexwrap="wrap" padding="0 30px">
          {setLoading
            ? loadingNFT.map((item) => (
                <VStack
                  minwidth={size.width < 768 ? "230px" : "280px"}
                  height="450px"
                  key={item.id}
                >
                  <LoadingNftContainer></LoadingNftContainer>
                </VStack>
              ))
            : size.width > 728 
              ? nfts.map((item, i) => (
                <VStack
                  minwidth={size.width < 768 ? "300px" : "280px"}
                  height="450px"
                  key={i}
                >
                  <NftContainer
                    isVerified={verifiedProfiles.includes(item.creator)}
                    iconStatus={item.isListed ? "sale" : "notforsale"}
                    // iconStatus are : notforsale, relist, sale, sold, empty returns null
                    hasOffers={item.offerCount > 0 ? true : false}
                    fileType={item.fileType}
                    creatorImage={item.collectionLogo}
                    itemImage={item.image}
                    price={item.price}
                    collectionName={item.collectionName}
                    itemNumber={item.name}
                    background={({ theme }) => theme.backElement}
                    onClick={() =>
                      NavigateTo(`nft/${nftaddress}/${item.tokenId}`)
                    }
                    onClickCreator={() =>
                      NavigateTo(`collection/${item.collectionName}`)
                    }
                  ></NftContainer>
                </VStack>
              ))
              : nfts.slice(0, 3).map((item, i) => (
                <VStack
                  minwidth={size.width < 768 ? "300px" : "280px"}
                  height="450px"
                  key={i}
                >
                  <NftContainer
                    isVerified={verifiedProfiles.includes(item.creator)}
                    iconStatus={item.isListed ? "sale" : "notforsale"}
                    // iconStatus are : notforsale, relist, sale, sold, empty returns null
                    hasOffers={item.offerCount > 0 ? true : false}
                    fileType={item.fileType}
                    creatorImage={item.collectionLogo}
                    itemImage={item.image}
                    price={item.price}
                    collectionName={item.collectionName}
                    itemNumber={item.name}
                    background={({ theme }) => theme.backElement}
                    onClick={() =>
                      NavigateTo(`nft/${nftaddress}/${item.tokenId}`)
                    }
                    onClickCreator={() =>
                      NavigateTo(`collection/${item.collectionName}`)
                    }
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