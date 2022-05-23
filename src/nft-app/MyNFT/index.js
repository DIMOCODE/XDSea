import React, { Fragment, useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import Xdc3 from "xdc3";
import {
  nftaddress,
  nftmarketaddress,
  nftmarketlayeraddress,
} from "../../config";
import { DEFAULT_PROVIDER } from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
// import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import NFT from "../../abis/NFT.json";
import NFTMarket from "../../abis/NFTMarket.json";
import Card from "../Home/common/card";
import { GetWallet, SendTransaction } from "xdc-connect";
import detectEthereumProvider from "@metamask/detect-provider";
import { AnimatePresence } from "framer-motion/dist/framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoopLogo } from "../../styles/LoopLogo";
import { Collection } from "../../styles/Collection";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { LayoutGroup } from "framer-motion/dist/framer-motion";
import emptyCollection from "../../images/emptyCollection.png";
import emptyNFT from "../../images/emptyNFT.png";

import axios from "axios";
import {
  LegacyBuyNFT,
  BuyNFT,
  SellNFT,
  LegacyWithdrawListing,
  WithdrawListing,
} from "../../common";
import { fromXdc, toXdc, isXdc } from "../../common/common";
import { XdcConnect } from "xdc-connect";
import SkeletonCard from "../../common/skeleton/card";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import { burnedNFTs, permaBlacklist } from "../../blacklist";
import banner1 from "../../images/Banner1.jpg";
import checkOk from "../../images/checkOkIcon.png";
import copyIcon from "../../images/copyAddress.png";
import verified from "../../images/verified.png";

import styled from "styled-components";
import {
  HStack,
  Spacer,
  VStack,
  IconImg,
  ZStack,
  ZItem,
  Divider,
} from "../../styles/Stacks";
import { motion } from "framer-motion/dist/framer-motion";
import {
  BodyBold,
  BodyRegular,
  CaptionBold,
  CaptionBoldShort,
  TitleBold15,
  TitleBold18,
  TitleBold21,
  TitleBold27,
} from "../../styles/TextStyles";
import { CollectionUserProfile } from "../../styles/collectionUserProfile";
import twitterMini from "../../images/twitterMini.png";
import instagramMini from "../../images/instagramMini.png";
import linkMini from "../../images/linkMini.png";
import xdcLogo from "../../images/miniXdcLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import ButtonApp from "../../styles/Buttons";
import { appStyle } from "../../styles/AppStyles";
import seeAll from "../../images/seeAll.png";
import { TableActivityNft } from "../../styles/TableActivityNft";
import { TableOffersNft } from "../../styles/TableOffersNft";
import { TableUserProfile } from "../../styles/TableUserProfile";
import { OwnedNfts } from "../../styles/OwnedNfts";
import { BubbleCopied } from "../../styles/BubbleCopied";

const MyNFT = (props) => {
  const { urlAddress } = useParams();
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [wallet, setWallet] = useState(null);
  const [page, setPage] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const [sellPrice, setSellPrice] = useState("");
  const [isOwned, setIsOwned] = useState(false);
  const [isCreatedCollection, setIsCreatedCollection] = useState(false);
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
  const [collectionGroup, setCollectionGroup] = useState([]);
  const [ownedGroup, setOwnedGroup] = useState({});
  const [ownedCollections, setOwnedCollections] = useState([]);
  const [showAllCollection, setShowAllCollection] = useState({});

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
    if (!listFailure)
      history.push(`/nft/${toXdc(listedNFT.nftContract)}/${listedNFT.tokenId}`);
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
    if (!buyFailure)
      history.push(`/nft/${toXdc(boughtNFT.nftContract)}/${boughtNFT.tokenId}`);
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
    if (!withdrawFailure)
      history.push(
        `/nft/${toXdc(withdrawnNFT.nftContract)}/${withdrawnNFT.tokenId}`
      );
  };

  const [setLoading, isSetLoading] = useState(false);

  const getData = async () => {
    try {
      // console.log(permaBlacklist)
      isSetLoading(true);
      setBlacklist(permaBlacklist);
      const wallet = await GetWallet();
      if (true) {
        const xdc3 = new Xdc3(
          new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER)
        );
        // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
        const marketContract = new xdc3.eth.Contract(
          NFTMarketLayer1.abi,
          nftmarketlayeraddress,
          xdc3
        );
        const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);

        if (urlAddress !== "")
          var getVal = await nftContract.methods
            .isApprovedForAll(
              isXdc(urlAddress) ? fromXdc(urlAddress) : urlAddress,
              nftmarketlayeraddress
            )
            .call();
        // console.log(getVal)

        const data = await marketContract.methods
          .fetchMyNFTs(isXdc(urlAddress) ? fromXdc(urlAddress) : urlAddress)
          .call();
        const items = await Promise.all(
          data.slice(0, 20).map(async (i) => {
            const uri = await nftContract.methods.tokenURI(i.tokenId).call();

            var metadata = await axios.get(uri);
            // const blob = await fetch(metadata?.data?.collection?.nft?.image)
            //     .then(r => r.blob())

            var price = await xdc3.utils.fromWei(i.price, "ether");
            let item = {
              price: price,
              tokenId: i.tokenId,
              itemId: i.itemId,
              seller: i.seller,
              owner: i.owner,
              collectionName: metadata?.data?.collection?.name,
              image: metadata?.data?.collection?.nft?.image,
              name: metadata?.data?.collection?.nft?.name,
              description: metadata?.data?.collection?.nft?.description,
              nftContract: i.nftContract,
              isListed: i.isListed,
              fileType: metadata?.data?.collection?.nft?.fileType,
              preview: metadata?.data?.collection?.nft?.preview,
            };
            return item;
          })
        );

        console.log();
        setLoadingState("loaded");
        setApproved(getVal);
        setPage(data);
        setNFts(items);
        isSetLoading(false);
      } else {
        // console.log(wallet);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop <=
      document.documentElement.offsetHeight - 510
    )
      return;
    setIsFetching(true);
  };

  const fetchMoreNFTs = async () => {
    setPageCount(pageCount + 1);
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const nfts = await Promise.all(
      page.slice(pageCount * 20, 20 * (pageCount + 1)).map(async (i) => {
        const uri = await nftContract.methods.tokenURI(i.tokenId).call();
        var metadata = await axios.get(uri);
        var price = await xdc3.utils.fromWei(i.price, "ether");

        let nft = {
          price: price,
          tokenId: i.tokenId,
          itemId: i.itemId,
          seller: i.seller,
          owner: i.owner,
          collectionName: metadata?.data?.collection?.name,
          image: metadata?.data?.collection?.nft?.image,
          name: metadata?.data?.collection?.nft?.name,
          description: metadata?.data?.collection?.nft?.description,
          nftContract: i.nftContract,
          isListed: i.isListed,
          fileType: metadata?.data?.collection?.nft?.fileType,
          preview: metadata?.data?.collection?.nft?.preview,
        };

        return nft;
      })
    );
    setNFts((prevState) => [...prevState, ...nfts]);
    setIsFetching(false);
  };

  const viewNFT = (data) => {
    history.push(`/nft/${nftaddress}/${data.tokenId}`);
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

  const getCreatedCollections = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const data = await marketContract.methods
      .fetchItemsCreated(urlAddress)
      .call();

    var uniqueCollections = [];
    const createdCollections = await Promise.all(
      data.map(async (i) => {
        if (!uniqueCollections.includes(i.collectionName)) {
          uniqueCollections.push(i.collectionName);
        }
      })
    );

    const collectionGroups = [];

    for (var i = 0; i < uniqueCollections.length; i++) {
      const collectionNFTs = await marketContract.methods
        .getCollectionNFTs(uniqueCollections[i])
        .call();

      var collectionNFTsList = [];
      const collectionNFTsData = await Promise.all(
        collectionNFTs.slice(0, 4).map(async (j) => {
          const uri = await nftContract.methods.tokenURI(j.tokenId).call();
          var metadata = await axios.get(uri);
          let nft = {
            tokenId: j.tokenId,
            image: metadata?.data?.collection?.nft?.image,
            name: j.name,
            logo: metadata?.data?.collection?.logo,
          };
          collectionNFTsList.push(nft);
        })
      );
      let group = {
        name: uniqueCollections[i],
        nfts: collectionNFTsList,
        logo: collectionNFTsList[0].logo,
        items:
          uniqueCollections[i] === "The Lucid Women" ||
          uniqueCollections[i] === "NFTHC" ||
          uniqueCollections[i] === "DØP3 Punks "
            ? collectionNFTs.length - 1
            : collectionNFTs.length,
      };
      collectionGroups.push(group);
    }

    setCollectionGroup(collectionGroups);
  };

  const getOwnedNFTs = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
    const data = await marketContract.methods.fetchMyNFTs(urlAddress).call();

    var uniqueCollections = [];
    const uniqueCollectionsData = [];
    var showAllGroups = {};
    const collectionGroups = {};
    const ownedCollections = await Promise.all(
      data.map(async (i) => {
        if (!burnedNFTs.includes(i.tokenId)) {
          const uri = await nftContract.methods.tokenURI(i.tokenId).call();
          var metadata = await axios.get(uri);
          if (!uniqueCollections.includes(i.collectionName)) {
            uniqueCollections.push(i.collectionName);
            collectionGroups[i.collectionName] = [];
            showAllGroups[i.collectionName] = false;
          }

          let nft = {
            tokenId: i.tokenId,
            image: metadata?.data?.collection?.nft?.image,
            name: i.name,
            logo: metadata?.data?.collection?.logo,
          };
          collectionGroups[i.collectionName].push(nft);
        }
      })
    );

    for (var i = 0; i < uniqueCollections.length; i++) {
      const collectionNFTs = await marketContract.methods
        .getCollectionNFTs(uniqueCollections[i])
        .call();
      const uri = await nftContract.methods
        .tokenURI(collectionNFTs[0].tokenId)
        .call();
      var metadata = await axios.get(uri);
      let collection = {
        name: uniqueCollections[i],
        logo: metadata?.data?.collection?.logo,
        items:
          uniqueCollections[i] === "The Lucid Women" ||
          uniqueCollections[i] === "NFTHC" ||
          uniqueCollections[i] === "DØP3 Punks "
            ? collectionNFTs.length - 1
            : collectionNFTs.length,
        owned: collectionGroups[uniqueCollections[i]].length,
        nfts: collectionGroups[uniqueCollections[i]],
      };
      uniqueCollections[i] = collection;
    }

    setOwnedCollections(uniqueCollections);
    console.log(uniqueCollections);

    setOwnedGroup(collectionGroups);
    setShowAllCollection(showAllGroups);
  };

  const [loadingCollection, setIsLoadingCollection] = useState([
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
    { id: 11, name: "Collection 11" },
    { id: 12, name: "Collection 12" },
  ]);

  const [subMenu, setSubMenu] = useState(0);

  useEffect(() => {
    getCreatedCollections();
    // getOwnedNFTs();
    // setWallet(props.wallet);
    getData();
    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  //   useEffect(() => {
  //     if (!isFetching) return;
  //     fetchMoreNFTs();
  //   }, [isFetching]);
  //   useEffect(() => {
  //     setWallet(props.wallet);
  //   }, [props.wallet]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  const size = useWindowSize();

  return (
    <UserSection>
      <Content id="scrollableDiv">
        <VStack padding="30px 30px 300px 30px" spacing="36px">
          <VStack>
            <VStack direction={size.width < 768 ? "row" : "column"}>
              <VStack>
                <VerifiedIcon>
                  <IconImg url={verified} width="42px" height="42px"></IconImg>
                </VerifiedIcon>
                <IconImg
                  url={banner1}
                  width={size.width < 768 ? "60px" : "150px"}
                  height={size.width < 768 ? "60px" : "150px"}
                  border="90px"
                  backsize="cover"
                  bordercolor="white"
                  bordersize="6px"
                  style={{
                    boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
                  }}
                ></IconImg>
              </VStack>

              <VStack spacing="9px" direction="column">
                <CaptionBold textcolor={({ theme }) => theme.text}>
                  CREATOR
                </CaptionBold>
                {/* <TitleBold21 textcolor={({ theme }) => theme.text}>
                  {truncateAddress(
                    isXdc(urlAddress) ? fromXdc(urlAddress) : urlAddress
                  )}
                </TitleBold21> */}{" "}
                <BubbleCopied
                  logo={xdcLogo}
                  address={urlAddress}
                  icon={copyIcon}
                ></BubbleCopied>
                {/* <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                  Joined 31 March 22
                </CaptionBoldShort> */}
              </VStack>
            </VStack>
            {/* <HStack
            {/* <HStack
                                background={({ theme }) => theme.backElement}
                                border="9px"
                                spacing="6px"
                                padding="6px 12px"
                            >
                                <IconImg url={xdcLogo} width="21px" height="21px"></IconImg>
                                <Spacer></Spacer>
                                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                                    0xdc...e23a
                                </CaptionBoldShort>
                                <Spacer></Spacer>
                            </HStack> */}
            {/* <HStack
                                spacing="6px"
                                padding="6px 12px"
                                background={({ theme }) => theme.backElement}
                                border="9px"
                            >
                                <IconImg
                                    url={instagramMini}
                                    width="18px"
                                    height="18px"
                                ></IconImg>
                                <Spacer></Spacer>
                                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                                    @azuki_team3667
                                </CaptionBoldShort>
                                <Spacer></Spacer>
                            </HStack> */}
            {/* <HStack
                                spacing="6px"
                                padding="6px 12px"
                                background={({ theme }) => theme.backElement}
                                border="9px"
                            >
                                <IconImg url={linkMini} width="18px" height="18px"></IconImg>
                                <Spacer></Spacer>
                                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                                    azuki.com
                                </CaptionBoldShort>
                                <Spacer></Spacer>
                            </HStack> */}
            {/* <HStack
                                spacing="6px"
                                padding="6px 12px"
                                background={({ theme }) => theme.backElement}
                                border="9px"
                            >
                                <IconImg url={twitterMini} width="18px" height="18px"></IconImg>
                                <Spacer></Spacer>
                                <CaptionBoldShort textcolor={({ theme }) => theme.text}>
                                    @azuki77288
                                </CaptionBoldShort>
                                <Spacer></Spacer>
                            </HStack> */}
            {/* <VStack spacing="3px" padding="30px 0">
                                <ButtonApp
                                    width="100%"
                                    height="30px"
                                    text="Create NFT"
                                    textcolor={appStyle.colors.white}
                                    onClick={() => NavigateTo("CreateNFT")}
                                    btnStatus={0}
                                ></ButtonApp>
                                <ButtonApp
                                    width="100%"
                                    height="30px"
                                    text="Create Collection"
                                    textcolor={appStyle.colors.white}
                                    onClick={() => NavigateTo("CreateCollection")}
                                    btnStatus={0}
                                ></ButtonApp>
                            </VStack> */}
          </VStack>
          {/* User Collections, NFTS,Purchaised, Likes, Follow */}
          <VStack
            maxwidth={size.width < 768 ? "100%" : "70%"}
            minwidth={size.width < 768 ? "100%" : "70%"}
          >
            {/* UserProfile Menu */}
            <HStack>
              <ButtonApp
                background={
                  subMenu === 0
                    ? ({ theme }) => theme.backElement
                    : "transparent"
                }
                textcolor={({ theme }) => theme.text}
                text="Created Collections"
                height="39px"
                onClick={() => setSubMenu(0)}
                cursor={"pointer"}
                btnStatus={0}
              ></ButtonApp>

              <ButtonApp
                background={
                  subMenu === 1
                    ? ({ theme }) => theme.backElement
                    : "transparent"
                }
                textcolor={({ theme }) => theme.text}
                text="Owned"
                height="39px"
                onClick={() => {
                  setSubMenu(1);
                  getOwnedNFTs();
                }}
                cursor={"pointer"}
                btnStatus={0}
              ></ButtonApp>

              {/* <ButtonApp
                background={
                  subMenu === 2
                    ? ({ theme }) => theme.backElement
                    : "transparent"
                }
                textcolor={({ theme }) => theme.text}
                text="Offers Received"
                height="39px"
                onClick={() => setSubMenu(2)}
                cursor={"pointer"}
                btnStatus={0}
              ></ButtonApp>

              <ButtonApp
                background={
                  subMenu === 3
                    ? ({ theme }) => theme.backElement
                    : "transparent"
                }
                textcolor={({ theme }) => theme.text}
                text="Offers Placed"
                height="39px"
                onClick={() => setSubMenu(3)}
                cursor={"pointer"}
                btnStatus={0}
              ></ButtonApp> */}

              {/* <BodyBold textcolor={({ theme }) => theme.text}>Like</BodyBold>
                            <BodyBold textcolor={({ theme }) => theme.text}>
                                Following
                            </BodyBold>
                            <HStack cursor={"pointer"} onClick={() => setSubMenu(1)}>
                                <BodyBold textcolor={({ theme }) => theme.text}>
                                    Activity
                                </BodyBold>
                            </HStack> */}
            </HStack>
          </VStack>
          <AnimatePresence>
            <ZStack>
              {subMenu === 0 && (
                <VStack
                  width="100%"
                  key={"Created"}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                >
                  {!isCreatedCollection ? (
                    <VStack
                      border="15px"
                      background="white"
                      width="100%"
                      minheight="300px"
                      // background={({ theme }) => theme.backElement}
                    >
                      <IconImg
                        url={emptyCollection}
                        width="60px"
                        height="60px"
                      ></IconImg>
                      <BodyRegular>
                        This creator has not yet created any collection
                      </BodyRegular>
                    </VStack>
                  ) : collectionGroup.length ? (
                    collectionGroup.map((item, i) => (
                      <VStack width="100%" padding="30px" spacing="30px">
                        <HStack width="100%">
                          <IconImg
                            url={item.logo}
                            width="60px"
                            height="60px"
                            backsize="cover"
                            border="36px"
                          ></IconImg>
                          <VStack spacing="6px" alignment="flex-start">
                            <TitleBold18>{item.name}</TitleBold18>
                            <BodyRegular>{item.items} Items</BodyRegular>
                          </VStack>
                        </HStack>
                        <HStack justify="flex-start">
                          {item.nfts.map((nft, j) => (
                            <VStack
                              maxwidth="186px"
                              height="186px"
                              border="15px"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {
                                NavigateTo(`nft/${nftaddress}/${nft.tokenId}`);
                              }}
                            >
                              <ZStack cursor={"pointer"}>
                                <CreatorTag>CREATOR</CreatorTag>
                                <ZItem>
                                  <IconImg
                                    url={nft.image}
                                    width="100%"
                                    height="100%"
                                    backsize="cover"
                                    border="15px"
                                  ></IconImg>
                                </ZItem>
                                <ZItem>
                                  <VStack padding="15px">
                                    <HStack>
                                      <Spacer></Spacer>
                                      <IconImg
                                        url={banner1}
                                        width="45px"
                                        height="45px"
                                        backsize="cover"
                                        border="45px"
                                        bordersize="3px"
                                        bordercolor="white"
                                      ></IconImg>
                                    </HStack>
                                    <Spacer></Spacer>
                                    <TitleBold15
                                      textcolor={appStyle.colors.white}
                                    >
                                      {nft.name}
                                    </TitleBold15>
                                  </VStack>
                                </ZItem>
                              </ZStack>
                            </VStack>
                          ))}
                          <VStack
                            maxwidth="186px"
                            height="186px"
                            border="15px"
                            whileHover={{ scale: 1.05 }}
                            background={({ theme }) => theme.backElement}
                            spacing="6px"
                            cursor="pointer"
                            onClick={() => {
                              NavigateTo(`collection/${item.name}`);
                            }}
                          >
                            <IconImg
                              url={seeAll}
                              width="45px"
                              height="45px"
                            ></IconImg>
                            <BodyBold>See All</BodyBold>
                          </VStack>
                        </HStack>
                      </VStack>
                    ))
                  ) : (
                    <VStack padding="120px">
                      <LoopLogo></LoopLogo>
                    </VStack>
                  )}
                </VStack>
              )}
              {subMenu === 1 && (
                <>
                  {!isOwned ? (
                    <VStack
                      border="15px"
                      background="white"
                      width="100%"
                      minheight="300px"
                      // background={({ theme }) => theme.backElement}
                    >
                      <IconImg
                        url={emptyNFT}
                        width="60px"
                        height="60px"
                      ></IconImg>
                      <BodyRegular>
                        This creator does not have any NFT yet
                      </BodyRegular>
                    </VStack>
                  ) : ownedCollections.length ? (
                    <OwnedNfts collectionGroup={ownedCollections}></OwnedNfts>
                  ) : (
                    <VStack padding="120px">
                      <LoopLogo></LoopLogo>
                    </VStack>
                  )}
                </>
              )}
            </ZStack>

            {/* {subMenu === 2 && (
                <VStack
                width="100%"
                padding="15px 30px"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                >
                <HStack
                    width="100%"
                    overflowx={size.width < 768 ? "scroll" : "visible"}
                    overflowy={size.width < 768 ? "hidden" : "visible"}
                    justify="flex-start"
                >
                    <VStack
                    width={size.width < 768 ? "690px" : "100%"}
                    spacing="0px"
                    background={({ theme }) => theme.backElement}
                    padding="9px"
                    border="9px"
                    >
                    <TableUserProfile
                        imageBuyer={banner1}
                        offerBy="Team Woman"
                        offerTime="Today 9:00 am"
                        offerAmount="3200"
                        collectionName="Elite Collection"
                        nftName="Alice #003"
                        nftImage={banner1}
                        isPlaced={false}
                        rejectOffer=""
                        acceptOffer=""
                    ></TableUserProfile>
                    <Divider></Divider>
                    <TableUserProfile
                        imageBuyer={banner1}
                        offerBy="Team Woman"
                        offerTime="Today 9:00 am"
                        offerAmount="3200"
                        collectionName="Elite Collection"
                        nftName="Alice #003"
                        nftImage={banner1}
                        isPlaced={false}
                        rejectOffer=""
                        acceptOffer=""
                    ></TableUserProfile>
                    </VStack>
                </HStack>
                </VStack>
            )}
            {subMenu === 3 && (
                <VStack
                width="100%"
                padding="15px 30px"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                >
                <HStack
                    width="100%"
                    overflowx={size.width < 768 ? "scroll" : "visible"}
                    overflowy={size.width < 768 ? "hidden" : "visible"}
                    justify="flex-start"
                >
                    <VStack
                    width={size.width < 768 ? "690px" : "100%"}
                    spacing="0px"
                    background={({ theme }) => theme.backElement}
                    padding="9px"
                    border="9px"
                    >
                    <TableUserProfile
                        imageBuyer={banner1}
                        offerBy="Team Woman"
                        offerTime="Today 10:00 am"
                        offerAmount="3600"
                        collectionName="Elite Collection"
                        nftName="Alice #003"
                        nftImage={banner1}
                        isPlaced={true}
                        isRejected={true}
                        onClickRejected=""
                        onClickWithdraw=""
                    ></TableUserProfile>
                    <Divider></Divider>

                    <TableUserProfile
                        imageBuyer={banner1}
                        offerBy="Team Woman"
                        offerTime="Today 9:00 am"
                        offerAmount="3200"
                        collectionName="Elite Collection"
                        nftName="Alice #003"
                        nftImage={banner1}
                        isPlaced={true}
                        isRejected={false}
                        onClickRejected=""
                        onClickWithdraw=""
                    ></TableUserProfile>
                    </VStack>
                </HStack>
                </VStack>
            )} */}
          </AnimatePresence>
        </VStack>
        {/* <div>
          <header className="secondary-page-header">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
              <h2 className="nft-h2">
                <span className="gradient-text">My</span> NFTs
              </h2>
            </div>
          </header>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
            <div>
              <div className="trendingItems" style={{ maxWidth: "1600px" }}>
                {loadingState === "loaded" ? (
                  <React.Fragment>
                    {!nfts.length ? (
                      <h1 className="text-white px-4 py-4 text-4x1">
                        You can either purchase NFTs from the marketplace or
                        mint your own.
                      </h1>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {nfts.map((nft, i) => (
                            <React.Fragment key={i}>
                              <Card
                                image={nft.image}
                                name={nft.name}
                                description={nft.description}
                                seller={nft.seller}
                                price={nft.price}
                                owner={nft.owner}
                                collection={nft.collectionName}
                                buyNFT={() => buyNFT(nft)}
                                viewNFT={() => viewNFT(nft)}
                                listNFT={() => startSale(nft)}
                                withdrawNFT={() => withdrawListing(nft)}
                                wallet={wallet}
                                isListed={nft.isListed}
                                fileType={nft.fileType}
                                preview={nft.preview}
                              />
                            </React.Fragment>
                          ))}
                        </div>
                        <>
                          {isFetching && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <SkeletonCard />
                            </div>
                          )}
                        </>
                      </>
                    )}
                  </React.Fragment>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SkeletonCard />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Transition.Root show={listing} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-999 inset-0 overflow-y-auto"
              onClose={closeList}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h2 className="text-center gradient-text">
                        {settingPrice
                          ? "Set Sell Price"
                          : listSuccess
                          ? "NFT Successfully Listed!"
                          : listFailure
                          ? "Transaction failed!"
                          : "Listing in progress!"}
                      </h2>
                      <div className="mt-3 text-center">
                        <div className="mt-2 w-full">
                          {settingPrice ? (
                            <>
                              <input
                                type="number"
                                className="nft-input"
                                name="sellPrice"
                                value={sellPrice}
                                onChange={(e) => setSellPrice(e.target.value)}
                              />
                              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                  className="nft-btn-gradient h-32 py-0 my-1"
                                  disabled={
                                    sellPrice === 0 || sellPrice?.length === 0
                                  }
                                  onClick={() => {
                                    sellNFT();
                                  }}
                                >
                                  {approved ? "Submit" : "Approve and Submit"}
                                </button>
                                <button
                                  className="nft-btn-linear-gradient light h-32 py-0 ml-2 my-1 mr-2"
                                  onClick={closeList}
                                  ref={cancelButtonRef}
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              {listSuccess ? (
                                <>
                                  <h4>
                                    {listedNFT?.name} is successfully listed on
                                    the marketplace and can now be purchased by
                                    interested buyers.
                                  </h4>
                                  <button
                                    className="nft-btn-gradient h-32 py-0 my-1"
                                    onClick={closeList}
                                  >
                                    Ok!
                                  </button>
                                </>
                              ) : (
                                <>
                                  {listFailure ? (
                                    <>
                                      <h4>
                                        Something went wrong with listing the
                                        NFT. Please check your wallet connection
                                        and try again!
                                      </h4>
                                      <button
                                        className="nft-btn-gradient h-32 py-0 my-1"
                                        onClick={closeList}
                                      >
                                        Ok!
                                      </button>
                                    </>
                                  ) : (
                                    <h4>
                                      We are listing your NFT on the
                                      marketplace. Please be patient!
                                    </h4>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <Transition.Root show={withdrawing} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-999 inset-0 overflow-y-auto"
              onClose={closeWithdraw}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h2 className="text-center gradient-text">
                        {withdrawSuccess
                          ? "NFT Listing Successfully Withdrawn!"
                          : withdrawFailure
                          ? "Transaction failed!"
                          : "Withdrawing your NFT Listing!"}
                      </h2>
                      <div className="mt-3 text-center">
                        <div className="mt-2 w-full">
                          {withdrawSuccess ? (
                            <>
                              <h4>
                                The listing for {withdrawnNFT?.name} has been
                                successfully taken off the marketplace. You can
                                list it again when you change your mind.
                              </h4>
                              <button
                                className="nft-btn-gradient h-32 py-0 my-1"
                                onClick={closeWithdraw}
                              >
                                Ok!
                              </button>
                            </>
                          ) : (
                            <>
                              {withdrawFailure ? (
                                <>
                                  <h4>
                                    Something went wrong with withdrawing the
                                    NFT listing. Please check your wallet
                                    connection and try again!
                                  </h4>
                                  <button
                                    className="nft-btn-gradient h-32 py-0 my-1"
                                    onClick={closeWithdraw}
                                  >
                                    Ok!
                                  </button>
                                </>
                              ) : (
                                <h4>
                                  We are withdrawing the active listing of your
                                  NFT on the marketplace! Thank you for your
                                  patience!
                                </h4>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          <Transition.Root show={buying} as={Fragment}>
            <Dialog
              as="div"
              className="fixed z-999 inset-0 overflow-y-auto"
              onClose={closeBuy}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h2 className="text-center gradient-text">
                        {buySuccess
                          ? "NFT Successfully Bought!"
                          : buyFailure
                          ? "Transaction failed!"
                          : "Processing your buy request!"}
                      </h2>
                      <div className="mt-3 text-center">
                        <div className="mt-2 w-full">
                          {buySuccess ? (
                            <>
                              <h4>
                                {boughtNFT?.name} has been successfully
                                purchased! You can view it in the My NFTs
                                section!
                              </h4>
                              <button
                                className="nft-btn-gradient h-32 py-0 my-1"
                                onClick={closeBuy}
                              >
                                Ok!
                              </button>
                            </>
                          ) : (
                            <>
                              {buyFailure ? (
                                <>
                                  <h4>
                                    Something went wrong with buying the NFT.
                                    Please check your wallet connection and try
                                    again!
                                  </h4>
                                  <button
                                    className="nft-btn-gradient h-32 py-0 my-1"
                                    onClick={closeBuy}
                                  >
                                    Ok!
                                  </button>
                                </>
                              ) : (
                                <h4>
                                  We are processing your buy request! Thank you
                                  for your patience!
                                </h4>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </div> */}
      </Content>
    </UserSection>
  );
};

export default MyNFT;

const UserSection = styled(motion.div)`
  padding: 120px 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
`;

const Content = styled(motion.div)`
  padding: 0px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const OwnerTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 12px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const CreatorTag = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 8px;
  background: white;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: bold;
  z-index: 1;
`;

const VerifiedIcon = styled(motion.div)`
  position: absolute;
  bottom: 0px;
  right: 6px;
`;
