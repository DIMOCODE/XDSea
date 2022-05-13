import React, { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Card from "./common/card";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER } from "../../constant";
import {
  nftaddress,
  nftmarketaddress,
  nftmarketlayeraddress,
} from "../../config";
import NFT from "../../abis/NFT.json";
import NFTMarket from "../../abis/NFTMarket.json";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import axios from "axios";
import { GetWallet } from "xdc-connect";
import { Dialog, Transition } from "@headlessui/react";
import {
  LegacyBuyNFT,
  BuyNFT,
  LegacyWithdrawListing,
  SellNFT,
  WithdrawListing,
} from "../../common";
import { toXdc } from "../../common/common";
import SkeletonCard from "../../common/skeleton/card";
import detectEthereumProvider from "@metamask/detect-provider";
import CollectionCard from "./common/collectionCard";
import { fromXdc, isXdc } from "../../common/common";
import { XdcConnect } from "xdc-connect";
import {
  permaBlacklist,
  featuredNFTList,
  spotlightCollectionList,
  trendingItemList,
} from "../../blacklist";

import styled from "styled-components";
// import imageNFT2 from "../../images/Doodles.jpeg";
// import creatorLogo2 from "../src/Assets/DoodlesNFT.png";
// import imageNFT3 from "../src/Assets/CloneNFT.png";
// import creatorLogo3 from "../src/Assets/CloneX.png";
import rocketCollection from "../../images/rocketCollection.png";
import iconTrending from "../../images/trendingNFT.png";
import { TopCollectionItem } from "../../styles/TopCollectionItem";
import { NftContainer } from "../../styles/NftContainer";
// import imageNFT1 from "../src/Assets/imageNFT.png";
// import creatorLogo1 from "../src/Assets/creatorLogo.jpg";
import XDSealogo from "../../images/LogoXDSEA.png";

import { appStyle } from "../../styles/AppStyles";
import ButtonApp from "../../styles/Buttons";
import { HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import { BodyRegular, TitleBold27, TitleBold33 } from "../../styles/TextStyles";

import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";
import { Featured } from "../../styles/Featured";
import useWindowSize from "../../styles/useWindowSize";
import { textFieldClasses } from "@mui/material";
import { LoadingSpot } from "../../styles/LoadingSpot";
import { LoadingNftContainer } from "../../styles/LoadingNftContainer";
import { LogoHover } from "../../styles/LogoHover";

const Home = (props) => {
  const history = useHistory();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [wallet, setWallet] = useState({});
  const [featuredNFT, setFeaturedNFT] = useState([]);
  const [address, setAddress] = useState(false);
  const [collections, setCollections] = useState([]);
  const [creating, setCreating] = useState(false);

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
  const [setLoading, isSetLoading] = useState(false);

  const close = () => {
    setSellData(null);
    setSellPrice("");
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

  const checkWalletConnection = async () => {
    try {
      await window.ethereum.enable();

      const provider = await detectEthereumProvider();

      const xdc3 = new Xdc3(provider);
      const accounts = await xdc3.eth.getAccounts();
      setAddress(true);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      isSetLoading(true);
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

      // console.log(wallet)
      if (wallet.wallet.address !== "")
        var getVal = await nftContract.methods
          .isApprovedForAll(
            isXdc(wallet.wallet.address)
              ? fromXdc(wallet.wallet.address)
              : wallet.wallet.address,
            nftmarketlayeraddress
          )
          .call();

      const featuredNFTs = await Promise.all(
        featuredNFTList.map(async (i) => {
          var featuredNFT = await marketContract.methods
            .idToMarketItem(i)
            .call();
          var featuredNFTUri = await nftContract.methods
            .tokenURI(featuredNFT.tokenId)
            .call();
          var featuredNFTMetadata = await axios.get(featuredNFTUri);
          let featuredNFTData = {
            collectionName: featuredNFTMetadata?.data?.collection?.name,
            collectionLogo: featuredNFTMetadata?.data?.collection?.logo,
            image: featuredNFTMetadata?.data?.collection?.nft?.image,
            name: featuredNFTMetadata?.data?.collection?.nft?.name,
            fileType: featuredNFTMetadata?.data?.collection?.nft?.fileType,
            preview: featuredNFTMetadata?.data?.collection?.nft?.preview,
            creator: featuredNFTMetadata?.data?.collection?.creator,
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
          let collection = {
            id: i,
            name: collectionMetadata?.data?.collection?.name,
            collectionLogo: collectionMetadata?.data?.collection?.logo,
            fileType: collectionMetadata?.data?.collection?.nft?.fileType,
            preview: collectionMetadata?.data?.collection?.nft?.preview,
            floorPrice: lowestPrice,
            volumeTraded: volumeTraded,
            items: collectionData2.length,
            owners: uniqueOwners.length,
          };
          return collection;
        })
      );

      const trendingItems = await Promise.all(
        trendingItemList.map(async (i) => {
          var itemData = await marketContract.methods.idToMarketItem(i).call();
          const trendingItemUri = await nftContract.methods
            .tokenURI(itemData.tokenId)
            .call();
          var trendingItemMetadata = await axios.get(trendingItemUri);
          var price = await xdc3.utils.fromWei(itemData.price, "ether");
          let item = {
            price: price,
            collectionLogo: trendingItemMetadata?.data?.collection?.logo,
            collectionName: trendingItemMetadata?.data?.collection?.name,
            tokenId: itemData.tokenId,
            itemId: itemData.itemId,
            owner: itemData.owner,
            image: trendingItemMetadata?.data?.collection?.nft?.image,
            name: trendingItemMetadata?.data?.collection?.nft?.name,
            description:
              trendingItemMetadata?.data?.collection?.nft?.description,
            nftContract: itemData.nftContract,
            isListed: itemData.isListed,
            fileType: trendingItemMetadata?.data?.collection?.nft?.fileType,
            preview: trendingItemMetadata?.data?.collection?.nft?.preview,
          };
          return item;
        })
      );

      setCollections(spotlightCollections);
      setLoadingState("loaded");
      setNFts(trendingItems);
      setFeaturedNFT(featuredNFTs);
      setApproved(getVal);
      isSetLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const viewNFT = (data) => {
    history.push(`/nft/${nftaddress}/${data.tokenId}`);
  };

  const viewCollection = (data) => {
    history.push(`/collection/${data}`);
  };
  const setBannerImage = () => {
    let data =
      document.getElementsByClassName("nft-banner")[0] !== undefined
        ? (document.getElementsByClassName(
            "nft-banner"
          )[0].style.backgroundImage = featuredNFT?.preview
            ? `url(${featuredNFT.preview})`
            : "")
        : "";
  };
  const goToCreate = async () => {
    const wallet = await GetWallet();
    setWallet(wallet);
    if (wallet?.wallet?.connected) {
      history.push("/mint-item");
    } else {
      setCreating(true);
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

  const isImage = (fileType) => {
    return !!fileType?.match("image.*");
  };

  const isVideo = (fileType) => {
    return !!fileType?.match("video.*");
  };

  useEffect(() => {
    checkWalletConnection();
    setWallet(props.wallet);
    getData();
    // getBlacklist()
  }, []);
  useEffect(() => {
    setWallet(props.wallet);
  }, [props.wallet]);

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  const truncateAddress = (address) => {
    return address
      ? address.substring(0, 7) + "..." + address.substring(38)
      : "undefined";
  };

  const [arrayCollection, setArrayCollection] = useState([
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

  const [loadingNFT, setIsLoadingNFT] = useState([
    { id: 1, name: "NFT 1" },
    { id: 2, name: "NFT 2" },
    { id: 3, name: "NFT 3" },
    { id: 4, name: "NFT 4" },
    { id: 5, name: "NFT 5" },
    { id: 6, name: "NFT 6" },
  ]);

  const size = useWindowSize();

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
            {/* <ButtonApp
                  height="39px"
                  textcolor={appStyle.colors.white}
                  background={({ theme }) => theme.blue}
                  text="Top Collections"
              ></ButtonApp> */}
            <a href="#spotlightCollections"><ButtonApp
              height="45px"
              textcolor={appStyle.colors.white}
              background={({ theme }) => theme.blue}
              text="Spotlight Collections"
            ></ButtonApp></a>
            <a href="#trendingNFTs"><ButtonApp
              height="45px"
              textcolor={appStyle.colors.white}
              background={({ theme }) => theme.blue}
              text="Trending NFTs"
            ></ButtonApp></a>
            <Spacer></Spacer>
          </HStack>
          <Spacer></Spacer>
        </VStack>

        <HStack
          width={size.width < 768 ? "100%" : "60%"}
          height={size.width < 768 ? "390px" : "100%"}
        >
          {/* Featured Big */}
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
            ></Featured>
          </VStack>
          {/* Featured Small */}
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
              ></Featured>
            </LayoutGroup>
          </VStack>
        </HStack>
      </HStack>

      {/* Top Collections */}
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
                    width={size.width < 768 ? "100%" : "490px"}
                  ></LoadingSpot>
                ))
              : collections.map((item) => (
                  <LayoutGroup id={item.id + 1}>
                    <TopCollectionItem
                      key={item.id + 1}
                      width={size.width < 768 ? "100%" : "490px"}
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

      {/* Hot NFTs */}

      <VStack height={size.width < 768 ? "auto" : "1100px"} width="100%" id="trendingNFTs">
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
        ></ButtonApp>
      </VStack>

      {/* <div key={props.wallet} className="nft-banner" style={{
                backgroundImage: setBannerImage()
            }}>
                <div className='tutorial'>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                        <h2 className="text-center nft-h2"><span className="gradient-text">Want to get started?</span> Here's how you do it</h2>
                        <img style={{"width": "100%"}} alt="Tutorial" src='/Tutorial.png'></img>
                    </div>
                </div>

                <Transition.Root show={!address} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={close}>
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

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>Wallet Extension Not Detected!</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                <h4>A valid wallet extension was not detected. We are currently in beta and are working on letting visitors explore without a wallet connection.</h4>
                                                <h4>We apologize for the inconvenience!</h4>
                                                <h4>Please download XDCPay for Chrome and refresh the page:</h4> 
                                                <h4><a href = "https://chrome.google.com/webstore/detail/xdcpay/bocpokimicclpaiekenaeelehdjllofo?hl=en-GB">Download here</a></h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={creating} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={close}>
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

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>Wallet not connected!</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                <h4>Your wallet does not seem to be connected. Please connect your wallet before proceeding to mint your NFT!</h4>
                                                <XdcConnect btnClass={wallet.connected ? "connected nft-btn-gradient" : "connect nft-btn-gradient"} btnName={wallet.connected ? "Connected" : "Connect"} onConnect={(wallet) => {
                                                    setWallet(wallet); setCreating(false); history.push("/mint-item")}} onDisconnect={(wallet) => {setWallet(wallet);}} showButton = {wallet.connected ? false : true}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={listing} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeList}>
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

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>{settingPrice ? "Set Sell Price" : listSuccess ? "NFT Successfully Listed!" : listFailure ? "Transaction failed!" : "Listing in progress!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {settingPrice 
                                                ? <>
                                                    <input type="number" className="nft-input" name="sellPrice" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
                                                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button className="nft-btn-gradient h-32 py-0 my-1" disabled={sellPrice === 0 || sellPrice?.length === 0} onClick={() => {sellNFT()}}>{approved ? "Submit" : "Approve and Submit"}</button>
                                                        <button className="nft-btn-linear-gradient light h-32 py-0 ml-2 my-1 mr-2" onClick={closeList} ref={cancelButtonRef}>Cancel</button>
                                                    </div>
                                                </>
                                                : <>
                                                    {listSuccess
                                                        ? <>
                                                            <h4>{listedNFT?.name} is successfully listed on the marketplace and can now be purchased by interested buyers.</h4>
                                                            <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeList}>Ok!</button>
                                                        </> 
                                                        : <>
                                                            {listFailure
                                                                ? <>
                                                                    <h4>Something went wrong with listing the NFT. Please check your wallet connection and try again!</h4>
                                                                    <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeList}>Ok!</button>
                                                                </>
                                                                : <h4>We are listing your NFT on the marketplace. Please be patient!</h4>
                                                            }
                                                            
                                                        </>
                                                    }
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={withdrawing} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeWithdraw}>
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

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>{withdrawSuccess ? "NFT Listing Successfully Withdrawn!" : withdrawFailure ? "Transaction failed!" : "Withdrawing your NFT Listing!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {withdrawSuccess 
                                                ? <>
                                                    <h4>The listing for {withdrawnNFT?.name} has been successfully taken off the marketplace. You can list it again when you change your mind.</h4>
                                                    <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeWithdraw}>Ok!</button>
                                                </>
                                                : <>
                                                    {withdrawFailure
                                                        ? <>
                                                            <h4>Something went wrong with withdrawing the NFT listing. Please check your wallet connection and try again!</h4>
                                                            <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeWithdraw}>Ok!</button>
                                                        </>
                                                        : <h4>We are withdrawing the active listing of your NFT on the marketplace! Thank you for your patience!</h4>
                                                    }
                                                </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={buying} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeBuy}>
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

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <div
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>{buySuccess ? "NFT Successfully Bought!" : buyFailure ? "Transaction failed!" : "Processing your buy request!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {buySuccess 
                                                    ? <>
                                                        <h4>{boughtNFT?.name} has been successfully purchased! You can view it in the My NFTs section!</h4>
                                                        <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeBuy}>Ok!</button>
                                                    </>
                                                    : <>
                                                        {buyFailure
                                                            ? <>
                                                                <h4>Something went wrong with buying the NFT. Please check your wallet connection and try again!</h4>
                                                                <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeBuy}>Ok!</button>
                                                            </>
                                                            : <h4>We are processing your buy request! Thank you for your patience!</h4>
                                                        }
                                                    </>
                                                }
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
  );
};

export { Home };

const Content = styled(motion.div)`
  padding: 120px 0;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
`;
