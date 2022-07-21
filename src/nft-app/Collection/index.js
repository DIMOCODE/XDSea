import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Xdc3 from "xdc3";
import { nftaddress, nftmarketlayeraddress } from "../../config";
import { DEFAULT_PROVIDER, HEADER, HTTP_METHODS } from "../../constant";
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
import menuContext from "../../context/menuContext";
import linkSocial from "../../images/linkSocial.png";
import whatsSocial from "../../images/whatsSocial.png";
import telegramSocial from "../../images/telegramSocial.png";
import twitterSocial from "../../images/twitterSocial.png";
import facebookSocial from "../../images/facebookSocial.png";
import copiedLink from "../../images/oklink.png";
import CID from "cids";

import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  InstapaperShareButton,
} from "react-share";
import { createRequest } from "../../API";

const CollectionDetails = (props) => {
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [page, setPage] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [NFTCount, setNFTCount] = useState(0);
  const [collectionOwners, setCollectionOwners] = useState(0);
  const [floorPrice, setFloorPrice] =
    useState(999999999999999999999999999999999999999999999);
  const [volume, setVolume] = useState(-1);
  const size = useWindowSize();
  const [collection, setCollection] = useState({});
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
  const [, setShowMenu] = useContext(menuContext);

  const getData = async () => {
    try {
      const collectionData = await (await createRequest(HTTP_METHODS.get, `collection/byNickName/${collectionName
        .replace(/\s/g, "-").replace(/#/g, "%23").replace(/^-+/, "").replace(/-+$/, "")}`, null, null)).data;
      const collectionItems = await (await createRequest(HTTP_METHODS.get, `collection/nft/${collectionData
        .collection._id}/${pageCount}`)).data.nfts
      const collectionItems2 = await Promise.all(
        collectionItems.map(async (i) => {
          let item = {
            price: i.price,
            tokenId: i.tokenId,
            owner: i.addressOwner,
            isListed: i.isListed,
            // offerCount: i.offerCount,
            collectionName: i.collectionId.name,
            collectionBanner: untitledCollections.includes(collectionName)
              ? banner1
              : collectionData.collection.banner
                ? collectionData.collection.banner.split('/')[2] === "ipfs.infura.io" 
                  ? `https://${new CID(collectionData.collection.banner.split('/')[4]).toV1().toBaseEncodedString('base32')}.ipfs.infura-ipfs.io`
                  : collectionData.collection.banner
                : banner1,
            collectionCreator: collectionData.collection.addressCreator,
            collectionDescription: collectionData.collection.description,
            collectionDiscord: collectionData.collection.discordUrl,
            collectionInstagram: collectionData.collection.instagramUrl,
            collectionLogo: collectionData.collection.logo.split('/')[2] === "ipfs.infura.io" 
              ? `https://${new CID(collectionData.collection.logo.split('/')[4]).toV1().toBaseEncodedString('base32')}.ipfs.infura-ipfs.io`
              : collectionData.collection.logo,
            collectionTwitter: collectionData.collection.twitterUrl,
            collectionWebsite: collectionData.collection.websiteUrl,
            image: i.urlFile.split('/')[2] === "ipfs.infura.io" 
              ? `https://${new CID(i.urlFile.split('/')[4]).toV1().toBaseEncodedString('base32')}.ipfs.infura-ipfs.io`
              : i.urlFile,
            name: i.tokenId === "3567"
              ? "TAURULIOMPS 1/12"
              : i.tokenId === "3580"
                ? "GEMINLIOMP 2/12"
                : i.tokenId === "3584"
                  ? "LIBRIOMP 2/12"
                  : i.tokenId === "3650"
                    ? "PISCELIOMPS 8/12"
                    : i.tokenId === "3679"
                      ? "LEOIOMP 10/12"
                      : i.tokenId === "3695"
                        ? "SAGITTARIOMPS 11/12"
                        : i.name,
            fileType: i.fileType,
            preview: i.preview.split('/')[2] === "ipfs.infura.io" 
              ? `https://${new CID(i.preview.split('/')[4]).toV1().toBaseEncodedString('base32')}.ipfs.infura-ipfs.io`
              : i.preview,
          };
          return item;
        })
      );
      var filteredCollectionItems = collectionItems2.filter((element) => {
        return !burnedNFTs.includes(element?.tokenId);
      });

      setFloorPrice(collectionData.metrics.floorPrice);
      // setVolume(volumeTraded);
      setLoadingState("loaded");
      setNFts(filteredCollectionItems);
      setCollectionOwners(collectionData.metrics.owners);
      setCollection(collectionData);
      setNFTCount(collectionData.metrics.nftsCount);
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
    // await new Promise((r) => setTimeout(r, 3000));
    setPageCount(pageCount + 1);
    const collectionItems = await (await createRequest(HTTP_METHODS.get, `collection/nft/${collection
      .collection._id}/${pageCount + 1}`)).data.nfts
    const newNFTs = await Promise.all(
      collectionItems.map(async (i) => {
        let nft = {
          price: i.price,
          tokenId: i.tokenId,
          isListed: i.isListed,
          // offerCount: i.offerCount,
          owner: i.addressOwner,
          collectionName: collection.collection.name,
          image: i.urlFile.split('/')[2] === "ipfs.infura.io" 
            ? `https://${new CID(i.urlFile.split('/')[4]).toV1().toBaseEncodedString('base32')}.ipfs.infura-ipfs.io`
            : i.urlFile,
          name: i.tokenId === "3567"
            ? "TAURULIOMPS 1/12"
            : i.tokenId === "3580"
              ? "GEMINLIOMP 2/12"
              : i.tokenId === "3584"
                ? "LIBRIOMP 2/12"
                : i.tokenId === "3650"
                  ? "PISCELIOMPS 8/12"
                  : i.tokenId === "3679"
                    ? "LEOIOMP 10/12"
                    : i.tokenId === "3695"
                      ? "SAGITTARIOMPS 11/12"
                      : i.name,
          fileType: i.fileType,
          preview: i.preview.split('/')[2] === "ipfs.infura.io" 
            ? `https://${new CID(i.preview.split('/')[4]).toV1().toBaseEncodedString('base32')}.ipfs.infura-ipfs.io`
            : i.preview,
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
    setShowMenu(false);
    history.push(`/${route}`);
  }

  function validateAddress(address) {
    var url = address;
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
      return url;
    } else return "https://" + address;
  }

  useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const webLocation = useLocation();
  const webLink = "https://www.xdsea.com" + (webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, ""));

  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(webLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500)
  };

  return (
    <CollectionSection>
    {/* Banner */}
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
          {/* Creator Tag */}
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

          {/* Share Collection to Socials Link */}
          <SocialAbsolute>
            <VStack
              justify="flex-start"
              border="9px"
              padding="12px 6px"
              spacing="15px"
              background={({ theme }) => theme.backElement}
            >
              <CaptionBoldShort>SHARE</CaptionBoldShort>

              <FacebookShareButton
                url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
                quote={"Check out this NFT Collection!"}
                hashtag={["#XDSea"]}
                description={"XDSea"}
                className="Demo__some-network__share-button"
              >
                <a>
                  <IconImg
                    url={facebookSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </FacebookShareButton>
              <TwitterShareButton
                title={"Check out this NFT Collection!"}
                url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
                hashtags={["XDSea", "BuildItOnXDC"]}
              >
                <a>
                  <IconImg
                    url={twitterSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </TwitterShareButton>
              <TelegramShareButton
                title={"Check out this NFT Collection!"}
                url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
              >
                <a>
                  <IconImg
                    url={telegramSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </TelegramShareButton>
              <WhatsappShareButton
                title={"Check out this NFT Collection!"}
                url={"https://www.xdsea.com" + webLocation.pathname.replace(/\s+/g, "%20").replace(/%20$/, "")}
              >
                <a>
                  <IconImg
                    url={whatsSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              </WhatsappShareButton>

              {copied ? (
                <IconImg url={copiedLink} width="28px" height="28px"></IconImg>
              ) : (
                <a>
                  <IconImg
                    onClick={copy}
                    url={linkSocial}
                    width="30px"
                    height="30px"
                  ></IconImg>
                </a>
              )}
            </VStack>
          </SocialAbsolute>

          <VStack
            width={size.width < 768 ? "100%" : "500px"}
            height={size.width < 768 ? "90px" : "290px"}
          >
            {/* Collection Logo */}
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

              {/* Collection Name */}
              <HStack
                background={({ theme }) => theme.walletButton}
                padding="6px 15px"
                border="9px"
                style={{
                  boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                <TitleBold21
                  align="center"
                  textcolor={({ theme }) => theme.walletText}
                >
                  {collectionName}
                </TitleBold21>
              </HStack>

              <Spacer></Spacer>
            </HStack>

            {/* Collection Statistics */}
            <HStack height={"auto"} spacing="12px" responsive={true}>
              <HStack width="100%">
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
                  {collectionOwners === 0 ? (
                    <LoopBars width="54px"></LoopBars>
                  ) : (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {collectionOwners}
                    </BodyBold>
                  )}
                  <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                    Owners
                  </CaptionBoldShort>
                </VStack>
              </HStack>

              <HStack width="100%">
                <VStack
                  border="9px"
                  padding="18px 0"
                  background={({ theme }) => theme.backElement}
                  spacing="9px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {NFTCount === 0 ? (
                    <LoopBars width="54px"></LoopBars>
                  ) : (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {burnedCollections.includes(collectionName)
                        ? NFTCount - 1
                        : collectionName === "XDSEA MONKEYS ORIGINAL ART"
                          ? NFTCount - 7
                          : NFTCount}
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
            </HStack>
          </VStack>

          {/* Collection Description */}
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

            {/* Collection Social Links */}
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

      {/* Collection NFTs */}
      <CollectionContent id="scrollableDiv">
        <InfiniteScroll
          dataLength={nfts.length}
          next={fetchMoreNFTs}
          hasMore={
            burnedCollections.includes(collectionName)
              ? nfts.length < NFTCount - 1
              : collectionName === "XDSEA MONKEYS ORIGINAL ART"
                ? nfts.length < NFTCount - 7
                : nfts.length < NFTCount
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
                          // isVerified={verifiedProfiles.includes(item.owner)}
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

const SocialAbsolute = styled(motion.div)`
  position: absolute;
  top: 15px;
  right: 15px;
`;
