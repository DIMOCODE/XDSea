import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Xdc3 from "xdc3";
import { nftaddress, nftmarketlayeraddress } from "../../config";
import { DEFAULT_PROVIDER } from "../../constant";
import NFT from "../../abis/NFT.json";
import axios from "axios";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import ButtonApp from "../../styles/Buttons";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyRegular,
  BodyBold,
  CaptionBoldShort,
  CaptionBold,
  TitleBold21,
} from "../../styles/TextStyles";
import instagram from "../../images/instagramMini.png";
import twitter from "../../images/twitter.png";
import link from "../../images/link.png";
import discord from "../../images/discordIcon.png";
import miniXdcLogo from "../../images/miniXdcLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { NftContainer } from "../../styles/NftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopBars } from "../../styles/LoopBars";
import { LoopLogo } from "../../styles/LoopLogo";
import {
  burnedNFTs,
  burnedCollections,
  verifiedProfiles,
} from "../../blacklist";
import { untitledCollections } from "../../blacklist";
import { Tooltip } from "@mui/material";
import banner1 from "../../images/Banner1.jpg";
import verified from "../../images/verified.png";

const CollectionDetails = (props) => {
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [page, setPage] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [collectionOwners, setCollectionOwners] = useState([]);
  const [floorPrice, setFloorPrice] =
    useState(999999999999999999999999999999999999999999999);
  const [volume, setVolume] = useState(-1);
  const size = useWindowSize();
  const [loadingNFT] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
    { id: 5, name: "NFT 5" },
    { id: 6, name: "NFT 6" },
    { id: 7, name: "NFT 7" },
    { id: 8, name: "NFT 8" },
    { id: 9, name: "NFT 9" },
    { id: 10, name: "NFT 10" },
    { id: 11, name: "NFT 11" },
    { id: 12, name: "NFT 12" },
  ]);

  const { collectionName } = useParams();

  const getData = async () => {
    try {
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
      const marketContract = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        xdc3
      );
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
      const collectionData = await marketContract.methods
        .getCollectionNFTs(collectionName)
        .call();
      const reversedCollections = [...collectionData].sort((nft1, nft2) => {
        if (parseInt(nft1.tokenId) > parseInt(nft2.tokenId)) return -1;
        else return 1;
      });
      const collectionItems = await Promise.all(
        reversedCollections.slice(0, 12).map(async (i) => {
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          var price = await xdc3.utils.fromWei(i.price, "ether");
          let item = {
            price: price,
            tokenId: i.tokenId,
            owner: i.owner,
            isListed: i.isListed,
            offerCount: i.offerCount,
            collectionName: metadata?.data?.collection?.name,
            collectionBanner: untitledCollections.includes(collectionName)
              ? banner1
              : metadata?.data?.collection?.banner
              ? metadata.data.collection.banner
              : banner1,
            collectionCreator: metadata?.data?.collection?.creator,
            collectionDescription: metadata?.data?.collection?.description,
            collectionDiscord: metadata?.data?.collection?.discordUrl,
            collectionInstagram: metadata?.data?.collection?.instagramUrl,
            collectionLogo: metadata?.data?.collection?.logo,
            collectionTwitter: metadata?.data?.collection?.twitterUrl,
            collectionWebsite: metadata?.data?.collection?.websiteUrl,
            image: metadata?.data?.collection?.nft?.image,
            name: metadata?.data?.collection?.nft?.name,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview: metadata?.data?.collection?.nft?.preview,
          };
          return item;
        })
      );
      var filteredCollectionItems = collectionItems.filter((element) => {
        return !burnedNFTs.includes(element?.tokenId);
      });
      var volumeTraded = 0;
      const uniqueOwners = [];
      var lowestPrice = 99999999999999999999999999999;
      await Promise.all(
        collectionData.map(async (item) => {
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
      setFloorPrice(lowestPrice);
      setVolume(volumeTraded);
      setLoadingState("loaded");
      setNFts(filteredCollectionItems);
      setPage(reversedCollections);
      setCollectionOwners(uniqueOwners);
    } catch (error) {
      console.log(error);
    }
  };

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  const fetchMoreNFTs = async () => {
    await new Promise(r => setTimeout(r, 3000));
    setPageCount(pageCount + 1);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const newNFTs = await Promise.all(
      page.slice(pageCount * 12, 12 * (pageCount + 1)).map(async (i) => {
        const uri = await nftContract.methods.tokenURI(i.tokenId).call();
        var metadata = await axios.get(uri);
        var price = await xdc3.utils.fromWei(i.price, "ether");
        let nft = {
          price: price,
          tokenId: i.tokenId,
          owner: i.owner,
          collectionName: metadata?.data?.collection?.name,
          image: metadata?.data?.collection?.nft?.image,
          name: metadata?.data?.collection?.nft?.name,
          fileType: metadata?.data?.collection?.nft?.fileType,
          preview: metadata?.data?.collection?.nft?.preview,
        };
        return nft;
      })
    );
    var filteredCollectionItems = newNFTs.filter((element) => {
      return !burnedNFTs.includes(element?.tokenId);
    });
    setNFts((prevState) => [...prevState, ...filteredCollectionItems]);
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  function validateAddress(address) {
    var url = address;
    if(url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
      return url;
    }
    else return "https://" + address;;
  }

  useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <CollectionSection>
      <BannerAbsolute>
        <IconImg
          url={nfts[0]?.collectionBanner}
          width="100%"
          height="355px"
          backsize="cover"
          key="imageBanner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></IconImg>
      </BannerAbsolute>
      <HStack>
        <VStack
          padding={
            size.width < 768 ? "260px 30px 30px 30px" : "260px 30px 30px 30px"
          }
          spacing="15px"
          maxwidth="1200px"
          cursor={"pointer"}
        >
          <CreatorAbsolute>
            <HStack
              onClick={() =>
                NavigateTo(`UserProfile/${nfts[0]?.collectionCreator}`)
              }
              border="30px"
              padding="6px 15px"
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
              }}
              cursor={"pointer"}
              background={({ theme }) => theme.backElement}
            >
              {verifiedProfiles.includes(nfts[0]?.collectionCreator) ? (
                <IconImg
                  cursor={"pointer"}
                  url={verified}
                  width="21px"
                  height="21px"
                ></IconImg>
              ) : null}
              <VStack spacing="0px" alignment="flex-start" cursor={"pointer"}>
                <CaptionBold textcolor={({ theme }) => theme.text}>
                  CREATOR
                </CaptionBold>
                {nfts[0]?.collectionCreator ? (
                  <Tooltip title={nfts[0]?.collectionCreator}>
                    <CaptionBold textcolor={({ theme }) => theme.text}>
                      {truncateAddress(nfts[0]?.collectionCreator)}
                    </CaptionBold>
                  </Tooltip>
                ) : (
                  <LoopBars width="115px" heigth="90px"></LoopBars>
                )}
              </VStack>
            </HStack>
          </CreatorAbsolute>
          <VStack
            width={size.width < 768 ? "100%" : "500px"}
            height={size.width < 768 ? "90px" : "290px"}
          >
            <IconImg
              url={nfts[0]?.collectionLogo}
              width="150px"
              height="150px"
              border="150px"
              bordersize="6px"
              bordercolor="white"
              backsize="cover"
              style={{
                boxShadow: "0px 3px 9px 0px rgba(0, 0, 0, 0.3)",
              }}
            ></IconImg>
            <HStack>
              <Spacer></Spacer>
              <HStack
                background={({ theme }) => theme.walletButton}
                padding="6px 15px"
                border="9px"
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                <TitleBold21 textcolor={({ theme }) => theme.walletText}>
                  {collectionName}
                </TitleBold21>
              </HStack>
              <Spacer></Spacer>
            </HStack>
            <HStack height="90px" spacing="12px">
              <VStack
                spacing="9px"
                border="9px"
                padding="18px 0"
                background={({ theme }) => theme.backElement}
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                <HStack spacing="6px">
                  <IconImg
                    url={miniXdcLogo}
                    width="18px"
                    height="18px"
                  ></IconImg>
                  {floorPrice ===
                  999999999999999999999999999999999999999999999 ? (
                    <LoopBars width="54px"></LoopBars>
                  ) : (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {floorPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) || "0"}
                    </BodyBold>
                  )}
                </HStack>
                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                  Floor Price
                </CaptionBoldShort>
              </VStack>
              <VStack
                border="9px"
                padding="18px 0"
                spacing="9px"
                background={({ theme }) => theme.backElement}
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                {collectionOwners.length === 0 ? (
                  <LoopBars width="54px"></LoopBars>
                ) : (
                  <BodyBold textcolor={({ theme }) => theme.text}>
                    {collectionOwners.length}
                  </BodyBold>
                )}
                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                  Owners
                </CaptionBoldShort>
              </VStack>
              <VStack
                border="9px"
                padding="18px 0"
                background={({ theme }) => theme.backElement}
                spacing="9px"
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                {collectionOwners.length === 0 ? (
                  <LoopBars width="54px"></LoopBars>
                ) : (
                  <BodyBold textcolor={({ theme }) => theme.text}>
                    {burnedCollections.includes(collectionName)
                      ? page.length - 1
                      : page.length}
                  </BodyBold>
                )}
                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                  NFT's
                </CaptionBoldShort>
              </VStack>
              <VStack
                border="9px"
                padding="18px 0"
                background={({ theme }) => theme.backElement}
                spacing="9px"
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                <HStack spacing="6px">
                  <IconImg
                    url={miniXdcLogo}
                    width="18px"
                    height="18px"
                  ></IconImg>
                  {volume === -1 ? (
                    <LoopBars width="54px"></LoopBars>
                  ) : (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {volume.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      }) || "0"}
                    </BodyBold>
                  )}
                </HStack>
                <CaptionBoldShort
                  align="center"
                  textcolor={({ theme }) => theme.text}
                >
                  Volume Traded
                </CaptionBoldShort>
              </VStack>
            </HStack>
          </VStack>
          <VStack width={size.width < 768 ? "100%" : "60%"} padding="15px">
            {nfts[0]?.collectionDescription !== "null" ? (
              <BodyRegular textcolor={({ theme }) => theme.text} align="center">
                {collectionName === "DØP3 Punks "
                  ? `A multichain NFT project minting collections on every major blockchain!\n\nWhere DØP3 Art Meets Web3`
                  : nfts[0]?.collectionDescription}
              </BodyRegular>
            ) : (
              <VStack>
                <LoopBars width="340px"></LoopBars>
                <LoopBars width="300px"></LoopBars>
              </VStack>
            )}
            <HStack>
              {nfts[0]?.collectionTwitter !== undefined &&
              nfts[0]?.collectionTwitter !== "" ? (
                <a
                  href={nfts[0]?.collectionTwitter}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={twitter}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {nfts[0]?.collectionInstagram !== undefined &&
              nfts[0]?.collectionInstagram !== "" ? (
                <a
                  href={nfts[0]?.collectionInstagram}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={instagram}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {nfts[0]?.collectionDiscord !== undefined &&
              nfts[0]?.collectionDiscord !== "" ? (
                <a
                  href={nfts[0].collectionDiscord}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={discord}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {nfts[0]?.collectionWebsite !== undefined &&
              nfts[0]?.collectionWebsite !== "" ? (
                <a
                  href={validateAddress(nfts[0].collectionWebsite)}
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    borderRadius: 9,
                  }}
                >
                  <ButtonApp
                    width="39px"
                    height="39px"
                    icon={link}
                    iconWidth="18px"
                    iconHeight="18px"
                    hasImage={true}
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                    cursor={"pointer"}
                    btnStatus={0}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
            </HStack>
          </VStack>
        </VStack>
      </HStack>
      <CollectionContent id="scrollableDiv">
        <InfiniteScroll
          dataLength={nfts.length}
          next={fetchMoreNFTs}
          hasMore={
            burnedCollections.includes(collectionName)
              ? nfts.length < page.length - 1
              : nfts.length < page.length
          }
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
          <VStack>
            <HStack>
              <HStack
                flexwrap="wrap"
                padding="0"
                justify={size.width < 768 ? "center" : "flex-start"}
                width={size.width < 1191 ? "900px" : "1191px"}
                spacing="9px"
              >
                {loadingState === "loaded"
                  ? nfts.map((item, i) => (
                      <VStack
                        minwidth={size.width < 768 ? "330px" : "290px"}
                        maxwidth={size.width < 768 ? "330px" : "290px"}
                        height="450px"
                        key={i}
                      >
                        <NftContainer
                          key={i}
                          iconStatus={item.isListed ? "sale" : "notforsale"}
                          // iconStatus are : notforsale, relist, sale, sold, empty returns null
                          hasOffers={item.offerCount > 0 ? true : false}
                          creatorImage={banner1}
                          itemImage={item.image}
                          price={item.price}
                          collectionName={collectionName}
                          itemNumber={item.name}
                          fileType={item.fileType}
                          background={({ theme }) => theme.backElement}
                          onClick={() =>
                            NavigateTo(`nft/${nftaddress}/${item.tokenId}`)
                          }
                          onClickCreator={() =>
                            NavigateTo(`UserProfile/${item.owner}`)
                          }
                          owner={true}
                        ></NftContainer>
                      </VStack>
                    ))
                  : loadingNFT.map((item) => (
                      <VStack
                        minwidth={size.width < 768 ? "230px" : "280px"}
                        height="450px"
                        key={item.id}
                      >
                        <LoadingNftContainer></LoadingNftContainer>
                      </VStack>
                    ))}
              </HStack>
            </HStack>
          </VStack>
        </InfiniteScroll>
      </CollectionContent>
    </CollectionSection>
  );
};

export default CollectionDetails;

const CollectionContent = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const CollectionSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.04);
  position: relative;
`;

const BannerAbsolute = styled(motion.div)`
  position: absolute;
  width: 100%;
`;

const CreatorAbsolute = styled(motion.div)`
  position: absolute;
  top: 15px;
  left: 15px;
`;
