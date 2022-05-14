import React, { useRef, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Xdc3 from "xdc3";
import {
  nftaddress,
  nftmarketaddress,
  nftmarketlayeraddress,
} from "../../config";
import { DEFAULT_PROVIDER } from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
// import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import NFT from "../../abis/NFT.json";
import NFTMarket from "../../abis/NFTMarket.json";
// import CollectionCard from "../home/common/collectionCard";
import { GetWallet } from "xdc-connect";
import axios from "axios";
import {
  LegacyBuyNFT,
  BuyNFT,
  SellNFT,
  LegacyWithdrawListing,
  WithdrawListing,
} from "../../common";
import { fromXdc, isXdc } from "../../common/common";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import { permaBlacklist } from "../../blacklist";

import ButtonApp from "../../styles/Buttons";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyRegular,
  BodyBold,
  CaptionBoldShort,
  CaptionBold,
  CaptionRegular,
  TitleBold30,
  TitleBold21,
} from "../../styles/TextStyles";
import instagram from "../../images/instagramMini.png";
import twitter from "../../images/twitter.png";
import link from "../../images/link.png";
import miniXdcLogo from "../../images/miniXdcLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import { motion } from "framer-motion/dist/framer-motion";
import styled from "styled-components";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { NftContainer } from "../../styles/NftContainer";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopBars } from "../../styles/LoopBars";
import { appStyle } from "../../styles/AppStyles";
import { LoopLogo } from "../../styles/LoopLogo";

const CollectionDetails = (props) => {
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [wallet, setWallet] = useState(null);
  const [page, setPage] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collection, setCollection] = useState({});
  const [showingDescription, setShowingDescription] = useState(false);
  const [collectionOwners, setCollectionOwners] = useState([]);
  const [floorPrice, setFloorPrice] =
    useState(999999999999999999999999999999999999999999999);
  const [volume, setVolume] = useState(0.0);
  const [expand, setExpand] = useState(false);

  const [sellPrice, setSellPrice] = useState("");
  const [approved, setApproved] = useState(false);
  const cancelButtonRef = useRef(null);
  const [sellData, setSellData] = useState(null);
  const [listSuccess, setListSuccess] = useState(false);
  const [listFailure, setListFailure] = useState(false);
  const [listedNFT, setListedNFT] = useState(null);
  const [listing, setListing] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [buyFailure, setBuyFailure] = useState(false);
  const [boughtNFT, setBoughtNFT] = useState(null);
  const [buying, setBuying] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawFailure, setWithdrawFailure] = useState(false);
  const [withdrawnNFT, setWithdrawnNFT] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [settingPrice, setSettingPrice] = useState(false);
  const [blacklist, setBlacklist] = useState([]);

  const { collectionName } = useParams();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getData = async () => {
    try {
      // console.log(permaBlacklist)
      setBlacklist(permaBlacklist);
      const wallet = await GetWallet();
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
      // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
      const marketContract = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        xdc3
      );
      const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

      if (wallet.wallet.address !== "")
        var getVal = await nftContract.methods
          .isApprovedForAll(
            isXdc(wallet.wallet.address)
              ? fromXdc(wallet.wallet.address)
              : wallet.wallet.address,
            nftmarketlayeraddress
          )
          .call();

      const collectionData = await marketContract.methods
        .getCollectionNFTs(collectionName)
        .call();
      // console.log('============', data)
      const collectionItems = await Promise.all(
        collectionData.slice(0, 12).map(async (i) => {
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          var price = await xdc3.utils.fromWei(i.price, "ether");

          let item = {
            price: price,
            tokenId: i.tokenId,
            itemId: i.itemId,
            owner: i.owner,
            collectionName: metadata?.data?.collection?.name,
            collectionBanner: metadata?.data?.collection?.banner,
            collectionCreator: metadata?.data?.collection?.creator,
            collectionDescription: metadata?.data?.collection?.description,
            collectionDiscord: metadata?.data?.collection?.discordUrl,
            collectionInstagram: metadata?.data?.collection?.instagramUrl,
            collectionLogo: metadata?.data?.collection?.logo,
            collectionTwitter: metadata?.data?.collection?.twitterUrl,
            collectionWebsite: metadata?.data?.collection?.websiteUrl,
            image: metadata?.data?.collection?.nft?.image,
            name: metadata?.data?.collection?.nft?.name,
            description: metadata?.data?.collection?.nft?.description,
            nftContract: i.nftContract,
            isListed: i.isListed,
            eventCount: i.eventCount,
            fileType: metadata?.data?.collection?.nft?.fileType,
            preview: metadata?.data?.collection?.nft?.preview,
          };
          return item;
        })
      );
      var filteredCollectionItems = collectionItems.filter((element) => {
        return element?.tokenId !== "119" && element?.tokenId !== "1778";
      });
      var volumeTraded = 0;
      const uniqueOwners = [];
      var lowestPrice = 99999999999999999999999999999;
      const allEvents = await Promise.all(
        collectionData.map(async (item) => {
          var price = await xdc3.utils.fromWei(item.price, "ether");
          if (!uniqueOwners.includes(item.owner)) {
            uniqueOwners.push(item.owner);
          }
          if (parseInt(price) < lowestPrice) {
            lowestPrice = parseInt(price);
          }
          var eventCount = item.eventCount;
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
      setPage(collectionData);
      setCollectionOwners(uniqueOwners);
      setApproved(getVal);
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = () => {
    // console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight)
    if (
      window.innerHeight + document.documentElement.scrollTop <=
      document.documentElement.offsetHeight - 510
    )
      return;
    setIsFetching(true);
  };

  const fetchMoreNFTs = async () => {
    console.log(nfts.length < page.length, nfts.length, page.length);
    setPageCount(pageCount + 1);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const newNFTs = await Promise.all(
      page.slice(pageCount * 12, 12 * (pageCount + 1)).map(async (i) => {
        const uri = await nftContract.methods.tokenURI(i.tokenId).call();
        var metadata = await axios.get(uri);
        var price = await xdc3.utils.fromWei(i.price, "ether");

        let nft = {
          price: price,
          tokenId: i.tokenId,
          itemId: i.itemId,
          owner: i.owner,
          collectionName: metadata?.data?.collection?.name,
          collectionBanner: metadata?.data?.collection?.banner,
          collectionCreator: metadata?.data?.collection?.creator,
          collectionDescription: metadata?.data?.collection?.description,
          collectionDiscord: metadata?.data?.collection?.discordUrl,
          collectionInstagram: metadata?.data?.collection?.instagramUrl,
          collectionLogo: metadata?.data?.collection?.logo,
          collectionTwitter: metadata?.data?.collection?.twitterUrl,
          collectionWebsite: metadata?.data?.collection?.websiteUrl,
          image: metadata?.data?.collection?.nft?.image,
          name: metadata?.data?.collection?.nft?.name,
          description: metadata?.data?.collection?.nft?.description,
          nftContract: i.nftContract,
          isListed: i.isListed,
          eventCount: i.eventCount,
          fileType: metadata?.data?.collection?.nft?.fileType,
          preview: metadata?.data?.collection?.nft?.preview,
        };

        return nft;
      })
    );
    var filteredCollectionItems = newNFTs.filter((element) => {
      return element?.tokenId !== "119" && element?.tokenId !== "1778";
    });

    setNFts((prevState) => [...prevState, ...filteredCollectionItems]);
    setIsFetching(false);
    console.log(nfts.length < page.length, nfts.length, page.length);
  };

  const viewNFT = (data) => {
    history.push(`/nft/${nftaddress}/${data.tokenId}`);
  };

  const startSale = async (nft) => {
    setSellData(nft);
    setListing(true);
    setListFailure(false);
    setSettingPrice(true);
  };
  const sellNFT = async () => {
    setSettingPrice(false);
    var success = false;
    if (!blacklist.includes(sellData.tokenId)) {
      success = await SellNFT(approved, sellData, sellPrice);
    }
    if (success) {
      setListedNFT(sellData);
      setListSuccess(true);
    } else {
      setListFailure(true);
    }
  };
  const closeList = () => {
    setListing(false);
    if (!listFailure) history.push(`/my-nfts`);
  };
  const buyNFT = async (nft) => {
    setBuying(true);
    setBuyFailure(false);
    var success = false;
    if (blacklist.includes(nft.tokenId)) {
      success = await LegacyBuyNFT(nft);
    } else {
      success = await BuyNFT(nft);
    }
    if (success) {
      setBoughtNFT(nft);
      setBuySuccess(true);
    } else {
      setBuyFailure(true);
    }
  };
  const closeBuy = () => {
    setBuying(false);
    if (!buyFailure) history.push("/my-nfts");
  };
  const withdrawListing = async (nft) => {
    setWithdrawing(true);
    setWithdrawFailure(false);
    var success = false;
    if (blacklist.includes(nft.tokenId)) {
      success = await LegacyWithdrawListing(approved, nft);
    } else {
      success = await WithdrawListing(approved, nft);
    }
    if (success) {
      setWithdrawnNFT(nft);
      setWithdrawSuccess(true);
    } else {
      setWithdrawFailure(true);
    }
  };
  const closeWithdraw = () => {
    setWithdrawing(false);
    if (!withdrawFailure) history.push("/my-nfts");
  };

  const showDescription = () => {
    if (showingDescription) {
      var description = document.getElementById("collection-description-text");
      description.style.height = "50px";
      setShowingDescription(false);
    } else {
      var description = document.getElementById("collection-description-text");
      description.style.height = "100px";
      setShowingDescription(true);
    }
  };

  const getBlacklist = async () => {
    const wallet = await GetWallet();
    setWallet(wallet);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const oldMarketContract = new xdc3.eth.Contract(
      NFTMarket.abi,
      nftmarketaddress,
      xdc3
    );
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const data = await oldMarketContract.methods.fetchMarketItems().call();

    var newBlacklist = [];
    const marketItems = await Promise.all(
      data.map(async (i) => {
        if (i.isListed) {
          newBlacklist.push(i.tokenId);
        }
      })
    );
    // console.log(newBlacklist)
    // setBlacklist(newBlacklist)
  };

  useEffect(() => {
    setWallet(props.wallet);
    getData();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect(() => {
  //     if (!isFetching) return;
  //     fetchMoreNFTs();
  // }, [isFetching]);

  useEffect(() => {
    setWallet(props.wallet);
  }, [props.wallet]);

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  const size = useWindowSize();

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  const [loadingNFT, setIsLoadingNFT] = useState([
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

  return (
    <CollectionSection>
      <BannerAbsolute>
        {nfts[0]?.collectionBanner ? (
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
        ) : (
          <VStack
            width="100%"
            height="355px"
            key="loaderBanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
          ></VStack>
        )}
      </BannerAbsolute>

      <HStack>
        <VStack
          padding={size.width < 768 ? "90px 15px" : " 90px 30px"}
          spacing="15px"
          maxwidth="1200px"
        >
          <CreatorAbsolute>
            <HStack
              onClick={() => NavigateTo("UserProfile")}
              background="white"
              border="30px"
              padding="6px 15px"
              style={{
                boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
              }}
            >
              <VStack spacing="0px" alignment="flex-start">
                <CaptionBold textcolor={appStyle.colors.darkgrey30}>
                  CREATOR
                </CaptionBold>

                {nfts[0]?.collectionCreator ? (
                  <CaptionBold textcolor={({ theme }) => theme.text}>
                    {truncateAddress(nfts[0]?.collectionCreator)}
                  </CaptionBold>
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
                      {floorPrice}
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
                    {collectionName == "The Lucid Women" ||
                    collectionName == "NFTHC"
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
                  {volume === 0 ? (
                    <LoopBars width="54px"></LoopBars>
                  ) : (
                    <BodyBold textcolor={({ theme }) => theme.text}>
                      {volume}
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
            {nfts[0]?.collectionDescription ? (
              <BodyRegular textcolor={({ theme }) => theme.text} align="center">
                {nfts[0]?.collectionDescription}
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
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
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
                    background={({ theme }) => theme.backElement}
                    style={{
                      boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                    }}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}
              {/* {nfts[0]?.collectionDiscord !== undefined && nfts[0]?.collectionDiscord !== ""
                                ? <a href={nfts[0]?.collectionDiscord}>
                                    <ButtonApp
                                        width="39px"
                                        height="39px"
                                        icon={telegram}
                                        iconWidth="18px"
                                        iconHeight="18px"
                                        background={({ theme }) => theme.backElement}
                                    ></ButtonApp>
                                </a>
                                : <></>
                            } */}
              {nfts[0]?.collectionWebsite !== undefined &&
              nfts[0]?.collectionWebsite !== "" ? (
                <a
                  href={nfts[0].collectionWebsite}
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
                    background={({ theme }) => theme.backElement}
                  ></ButtonApp>
                </a>
              ) : (
                <></>
              )}

              {/* <ButtonApp
                                text="Share"
                                height="39px"
                                background={({ theme }) => theme.backElement}
                                textcolor={({ theme }) => theme.text}
                            ></ButtonApp> */}
            </HStack>
          </VStack>
        </VStack>
      </HStack>
      <CollectionContent id="scrollableDiv">
        <InfiniteScroll
          dataLength={nfts.length}
          next={fetchMoreNFTs}
          hasMore={
            collectionName == "The Lucid Women" ||
            collectionName == "NFTHC" ||
            collectionName == "DØP3 Punks "
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
            {/* Filter Bar */}

            {/* Collections */}

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
                      >
                        <NftContainer
                          key={i}
                          creatorImage={item.collectionLogo}
                          itemImage={item.image}
                          price={item.price}
                          collectionName={collectionName}
                          itemNumber={item.name}
                          fileType={item.fileType}
                          background={({ theme }) => theme.backElement}
                          onClick={() =>
                            NavigateTo(`nft/${nftaddress}/${item.tokenId}`)
                          }
                        ></NftContainer>
                      </VStack>
                    ))
                  : loadingNFT.map((item) => (
                      <VStack
                        minwidth={size.width < 768 ? "230px" : "280px"}
                        height="450px"
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
