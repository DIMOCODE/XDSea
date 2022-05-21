import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER } from "../../constant";
import { nftaddress, nftmarketlayeraddress } from "../../config";
import NFT from "../../abis/NFT.json";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import axios from "axios";
import { GetWallet } from "xdc-connect";
import { fromXdc, isXdc } from "../../common/common";
import {
  featuredNFTList,
  spotlightCollectionList,
  trendingItemList,
  burnedCollections,
} from "../../blacklist";
import styled from "styled-components";
import rocketCollection from "../../images/rocketCollection.png";
import iconTrending from "../../images/trendingNFT.png";
import { TopCollectionItem } from "../../styles/TopCollectionItem";
import { NftContainer } from "../../styles/NftContainer";
import { appStyle } from "../../styles/AppStyles";
import ButtonApp from "../../styles/Buttons";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import { BodyRegular, TitleBold27, TitleBold33 } from "../../styles/TextStyles";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { Featured } from "../../styles/Featured";
import useWindowSize from "../../styles/useWindowSize";
import { LoadingSpot } from "../../styles/LoadingSpot";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { LogoHover } from "../../styles/LogoHover";

const Home = () => {
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [featuredNFT, setFeaturedNFT] = useState([]);
  const [collections, setCollections] = useState([]);
  const [setLoading, isSetLoading] = useState(false);
  const [arrayCollection] = useState([
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
  const [loadingNFT] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
    { id: 5, name: "NFT 5" },
    { id: 6, name: "NFT 6" },
  ]);
  const size = useWindowSize();

  const getData = async () => {
    try {
      isSetLoading(true);
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
      const marketContract = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        xdc3
      );
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
      const featuredNFTs = await Promise.all(
        featuredNFTList.map(async (i) => {
          var featuredNFTUri = await nftContract.methods.tokenURI(i).call();
          var featuredNFTMetadata = await axios.get(featuredNFTUri);
          let featuredNFTData = {
            collectionName: featuredNFTMetadata?.data?.collection?.name,
            collectionLogo: featuredNFTMetadata?.data?.collection?.logo,
            image: featuredNFTMetadata?.data?.collection?.nft?.image,
            name: featuredNFTMetadata?.data?.collection?.nft?.name,
            fileType: featuredNFTMetadata?.data?.collection?.nft?.fileType,
            preview: featuredNFTMetadata?.data?.collection?.nft?.preview,
            creator: featuredNFTMetadata?.data?.collection?.creator,
            tokenId: i,
          };
          return featuredNFTData;
        })
      );
      const spotlightCollections = await Promise.all(
        spotlightCollectionList.map(async (name, i) => {
          var collectionData = await marketContract.methods
            .fetchCollection(name)
            .call();
          const collectionUri = await nftContract.methods
            .tokenURI(collectionData.tokenId)
            .call();
          var collectionMetadata = await axios.get(collectionUri);
          const collectionData2 = await marketContract.methods
            .getCollectionNFTs(name)
            .call();
          var volumeTraded = 0;
          const uniqueOwners = [];
          var lowestPrice = 99999999999999999999999999999;
          const allEvents = await Promise.all(
            collectionData2.map(async (item) => {
              var price = await xdc3.utils.fromWei(item.price, "ether");
              if (!uniqueOwners.includes(item.owner)) {
                uniqueOwners.push(item.owner);
              }
              if (parseInt(price) < lowestPrice) {
                lowestPrice = parseInt(price);
              }
              var events = [];
              var tokenEvents = await marketContract.methods
                .getTokenEventHistory(item.tokenId)
                .call();
              for (var j = 0; j < tokenEvents.length; j++) {
                if (
                  tokenEvents[j].eventType === "3" ||
                  tokenEvents[j].eventType === "8"
                ) {
                  volumeTraded += parseInt(
                    await xdc3.utils.fromWei(tokenEvents[j].price, "ether")
                  );
                }
              }
              return events;
            })
          );
          let collection = {
            id: i,
            name: collectionMetadata?.data?.collection?.name,
            collectionLogo: collectionMetadata?.data?.collection?.logo,
            floorPrice: lowestPrice,
            volumeTraded: volumeTraded,
            items: !burnedCollections.includes(
              collectionMetadata?.data?.collection?.name
            )
              ? collectionData2.length
              : collectionData2.length - 1,
            owners: uniqueOwners.length,
          };
          return collection;
        })
      );
      const trendingItems = await Promise.all(
        trendingItemList.map(async (i) => {
          var itemData = await marketContract.methods.idToMarketItem(i).call();
          const trendingItemUri = await nftContract.methods.tokenURI(i).call();
          var trendingItemMetadata = await axios.get(trendingItemUri);
          var price = await xdc3.utils.fromWei(itemData.price, "ether");
          let item = {
            price: price,
            collectionLogo: trendingItemMetadata?.data?.collection?.logo,
            collectionName: trendingItemMetadata?.data?.collection?.name,
            tokenId: itemData.tokenId,
            image: trendingItemMetadata?.data?.collection?.nft?.image,
            name: trendingItemMetadata?.data?.collection?.nft?.name,
            fileType: trendingItemMetadata?.data?.collection?.nft?.fileType,
            preview: trendingItemMetadata?.data?.collection?.nft?.preview,
          };
          return item;
        })
      );
      setCollections(spotlightCollections);
      setNFts(trendingItems);
      setFeaturedNFT(featuredNFTs);
      isSetLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // const getBlacklist = async () => {
  //   const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
  //   const oldMarketContract = new xdc3.eth.Contract(
  //     NFTMarket.abi,
  //     nftmarketaddress,
  //     xdc3
  //   );
  //   const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
  //   const data = await oldMarketContract.methods.fetchMarketItems().call();
  //   var newBlacklist = [];
  //   const marketItems = await Promise.all(
  //     data.map(async (i) => {
  //       if (i.isListed) {
  //         newBlacklist.push(i.tokenId);
  //       }
  //     })
  //   );
  //   console.log(newBlacklist)
  // };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  useEffect(() => {
    getData();
    // getBlacklist()
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Content>
      <HStack
        width="100%"
        height={size.width < 768 ? "auto" : "580px"}
        alignment="flex-start"
        spacing="15px"
        padding="0px 30px"
        responsive={true}
      >
        <VStack
          maxwidth={size.width < 768 ? "100%" : "32%"}
          alignment="flex-start"
        >
          <Spacer></Spacer>
          <LogoHover></LogoHover>
          <VStack spacing="9px" alignment="flex-start">
            <TitleBold27>
              Exploring, Collecting, and Selling exclusive NFTs has now become
            </TitleBold27>
            <TitleBold33 textcolor={({ theme }) => theme.blue}>
              simpler & faster
            </TitleBold33>
          </VStack>
          <BodyRegular>
            Be a part of the world's first NFT Marketplace on the XDC
            blockchain.
          </BodyRegular>
          <HStack spacing="10px">
            <a href="#spotlightCollections">
              <ButtonApp
                btnStatus={0}
                height="45px"
                textcolor={appStyle.colors.white}
                background={({ theme }) => theme.blue}
                text="Spotlight Collections"
              ></ButtonApp>
            </a>
            <a href="#trendingNFTs">
              <ButtonApp
                height="45px"
                textcolor={appStyle.colors.white}
                background={({ theme }) => theme.blue}
                text="Trending NFTs"
                btnStatus={0}
              ></ButtonApp>
            </a>
            <Spacer></Spacer>
          </HStack>
          <Spacer></Spacer>
        </VStack>
        <HStack
          width={size.width < 768 ? "100%" : "60%"}
          height={size.width < 768 ? "390px" : "100%"}
        >
          <VStack>
            <Featured
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
            ></Featured>
          </VStack>
          <VStack>
            <LayoutGroup id="number2">
              <Featured
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
              ></Featured>
            </LayoutGroup>
            <LayoutGroup id="number3">
              <Featured
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
              ></Featured>
            </LayoutGroup>
          </VStack>
        </HStack>
      </HStack>
      <VStack
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
      </VStack>
      <VStack
        height={size.width < 768 ? "auto" : "1100px"}
        width="100%"
        id="trendingNFTs"
      >
        <HStack>
          <IconImg url={iconTrending} width="45px" height="45px"></IconImg>
          <TitleBold27>Trending NFTs</TitleBold27>
        </HStack>
        <HStack flexwrap="wrap" padding="0 30px">
          {setLoading
            ? loadingNFT.map(() => (
                <VStack
                  minwidth={size.width < 768 ? "230px" : "280px"}
                  height="450px"
                >
                  <LoadingNftContainer></LoadingNftContainer>
                </VStack>
              ))
            : nfts.map((item) => (
                <VStack
                  minwidth={size.width < 768 ? "230px" : "280px"}
                  height="450px"
                >
                  <NftContainer
                    key={item.name}
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
          width="360px"
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
