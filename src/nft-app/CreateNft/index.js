import React, { useState, useEffect, useContext } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { SendTransaction } from "xdc-connect";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER } from "../../constant";
import NFT from "../../abis/NFT.json";
import { nftaddress, nftmarketlayeraddress } from "../../config";
import { fromXdc, isXdc } from "../../common/common";
import axios from "axios";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";
import styled from "styled-components";
import { Divider, HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyRegular,
  CaptionRegular,
  TitleBold15,
  TitleBold27,
} from "../../styles/TextStyles";
import { motion } from "framer-motion/dist/framer-motion";
import { appStyle } from "../../styles/AppStyles";
import CreationBar from "../../images/DiscoverBar.png";
import { InputStyled } from "../../styles/InputStyled";
import xdc from "../../images/miniXdcLogo.png";
import { TextAreaStyled } from "../../styles/TextAreaStyled";
import ButtonApp from "../../styles/Buttons";
import { PropertyValue } from "../../styles/PropertyValue";
import percent from "../../images/percent.png";
import lock from "../../images/lock.png";
import { UploadMultimedia } from "../../styles/UploadMultimedia";
import xinfinLogo from "../../images/xinfinLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import { InputStyledURL } from "../../styles/InputStyledURL";
import { InputStyledLink } from "../../styles/InputStyledLink";
import instagramIcon from "../../images/instagramMini.png";
import twitterIcon from "../../images/twitter.png";
import discordIcon from "../../images/discordIcon.png";
import linkIcon from "../../images/link.png";
import loading from "../../images/loadingDots.gif";
import empty from "../../images/empty.png";
import { TxModal } from "../../styles/TxModal";
import { useHistory } from "react-router-dom";
import menuContext from "../../context/menuContext";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

function CreateNft(props) {
  const [uploadBannerStatus, setUploadBannerStatus] = useState(false);
  const [uploadLogoStatus, setUploadLogoStatus] = useState(false);
  const [uploadPreviewStatus, setUploadPreviewStatus] = useState(false);
  const [uploadNFT, setUploadNFT] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [collection, setCollection] = useState("");
  const [collectionBanner, setCollectionBanner] = useState({
    preview: "",
    raw: "",
    fileType: "",
  });
  const [collectionLogo, setCollectionLogo] = useState({
    preview: "",
    raw: "",
    fileType: "",
  });
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionExists, setCollectionExists] = useState(false);
  const [collectionEmpty, setCollectionEmpty] = useState(false);
  const [instagramLink, setInstagramLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [properties, setProperties] = useState([
    { property: "", value: "" },
    { property: "", value: "" },
  ]);
  const [isUnlockableContent, setIsUnlockableContent] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState("");
  const [file, setFile] = useState({ preview: "", raw: "", fileType: "" });
  const [preview, setPreview] = useState({
    preview: "",
    raw: "",
    fileType: "",
  });
  const [modalAlert, setModalAlert] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(empty);
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);
  const [royaltyAlert, setRoyaltyAlert] = useState(false);
  const [isAssetEmpty, setIsAssetEmpty] = useState(false);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isPriceZero, setIsPriceZero] = useState(false);
  const [isCollectionNotSelected, setIsCollectionNotSelected] = useState(false);
  const [mintButtonStatus, setMintButtonStatus] = useState(0);
  const [isWalletDisconnected, setIsWalletDisconnected] = useState(false);
  const [assetURL, setAssetURL] = useState("");
  const [collectionBannerURL, setCollectionBannerURL] = useState("");
  const [collectionLogoURL, setCollectionLogoURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [wallet, setWallet] = useState(null);
  const [minted, setMinted] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const history = useHistory();
  const [collectionValid, setCollectionValid] = useState(false);
  const size = useWindowSize();

  const addToIPFS = async () => {
    setUploadNFT(true);
    const file = document.getElementById("upload-button").files[0];
    try {
      const added = await client.add(file);

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setAssetURL(url);
      setUploadNFT(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSCollectionBanner = async () => {
    setUploadBannerStatus(true);
    const file = document.getElementById("upload-button-collection").files[0];
    try {
      const added = await client.add(file);

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setCollectionBannerURL(url);
      setUploadBannerStatus(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSCollectionLogo = async () => {
    setUploadLogoStatus(true);
    const file = document.getElementById("upload-button-logo").files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setCollectionLogoURL(url);
      setUploadLogoStatus(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSPreview = async () => {
    setUploadPreviewStatus(true);
    const file = document.getElementById("preview-file").files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setPreviewURL(url);
      setUploadPreviewStatus(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleChangeUploadMultimedia = (e) => {
    setIsAssetEmpty(false);
    if (e.target.files.length) {
      setFile({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
    addToIPFS();
  };

  const handleChangeUploadMultimediaCollection = (e) => {
    if (e.target.files.length) {
      setCollectionBanner({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
    addToIPFSCollectionBanner();
  };

  const handleChangeUploadMultimediaLogo = (e) => {
    if (e.target.files.length) {
      setCollectionLogo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
    addToIPFSCollectionLogo();
  };

  const handleChangeUploadMultimediaPreview = (e) => {
    if (e.target.files.length) {
      setPreview({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
    addToIPFSPreview();
  };

  const clearForm = async () => {
    document.getElementById("upload-button").value = null;
    document.getElementById("upload-button-collection").value = null;
    document.getElementById("upload-button-logo").value = null;
    setCollectionEmpty(false);
    setCollectionExists(false);
    setIsCollectionNotSelected(false);
    setIsAssetEmpty(false);
    setIsNameEmpty(false);
    setIsPriceZero(false);
    setIsPriceInvalid(false);
    setCollectionBannerURL("");
    setCollectionLogoURL("");
    setPreviewURL("");
    setAssetURL("");
    setFile({ preview: "", raw: "", fileType: "" });
    setPreview({ preview: "", raw: "", fileType: "" });
    setName("");
    setDescription("");
    setPrice(0.00001);
    setProperties([
      { property: "", value: "" },
      { property: "", value: "" },
    ]);
    setRoyalty(0);
    setIsUnlockableContent(false);
    setUnlockableContent("");
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const tokenCount = await marketContract.methods.tokenCount().call();
    setCollection(`Untitled Collection ${tokenCount}`);
    document
      .getElementsByClassName("collection-url")[0]
      .setAttribute(
        "placeholder",
        `Untitled Collection ${tokenCount}`.replace(/\s+/g, "%20")
      );
    setCollectionBanner({ preview: "", raw: "", fileType: "" });
    setCollectionLogo({ preview: "", raw: "", fileType: "" });
    setCollectionDescription("");
    setInstagramLink("");
    setTwitterLink("");
    setDiscordLink("");
    setWebsiteLink("");
    setModalAlert(false);
    setRoyaltyAlert(false);
    setMintButtonStatus(0);
  };

  const fetchCollection = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );

    const tokenCount = await marketContract.methods.tokenCount().call();
    setCollection(`Untitled Collection ${tokenCount}`);
    setCollectionExists(false);
    setCollectionEmpty(true);
    document
      .getElementsByClassName("collection-url")[0]
      .setAttribute(
        "placeholder",
        `Untitled Collection ${tokenCount}`.replace(/\s+/g, "%20")
      );
    try {
      const data = await marketContract.methods
        .fetchItemsCreated(
          isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address
        )
        .call();
      var uniqueCollections = [];
      await Promise.all(
        data.map(async (i) => {
          if (!uniqueCollections.includes(i.collectionName))
            uniqueCollections.push(i.collectionName);
        })
      );
    } catch (e) {}
  };

  const checkCollectionExists = async () => {
    setLoadingIcon(loading);
    const collectionName = document
      .getElementsByClassName("collection-name")[0]
      .value.replace(/\s+$/, "");
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const data = await marketContract.methods
      .fetchItemsCreated(
        isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address
      )
      .call();
    var uniqueCollections = [];
    await Promise.all(
      data.map(async (i) => {
        if (!uniqueCollections.includes(i.collectionName))
          uniqueCollections.push(i.collectionName);
      })
    );
    const collectionData = await marketContract.methods
      .fetchCollections()
      .call();
    var uniqueCollections2 = [];
    await Promise.all(
      collectionData.map(async (i) => {
        uniqueCollections2.push(i.collectionName);
      })
    );
    if (uniqueCollections2.includes(collectionName)) {
      if (uniqueCollections.includes(collectionName)) {
        setCollectionExists(false);
        setCollectionValid(true);
      } else {
        setCollectionExists(true);
      }
      setLoadingIcon(empty);
      return true;
    } else {
      setCollectionExists(false);
      setCollectionEmpty(false);
    }
    setLoadingIcon(empty);
    return false;
  };

  const mintNFT = async () => {
    setRoyaltyAlert(false);
    if (file.raw === "") {
      setIsAssetEmpty(true);
      document.getElementById("nft-asset").scrollIntoView();
    } else {
      if (name === "") {
        setIsNameEmpty(true);
        document.getElementById("creation-banner").scrollIntoView();
      } else {
        if (price === 0) {
          setIsPriceZero(true);
          document
            .getElementsByClassName("nft-description")[0]
            .scrollIntoView();
        } else {
          // if(document.getElementsByClassName("nft-collection")[0].value === "") {
          //   setIsCollectionNotSelected(true);
          //   document.getElementById("nft-unlockable").scrollIntoView();
          // }
          // else {
          setMintButtonStatus(1);
          const xdc3 = new Xdc3(
            new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER)
          );
          const marketContract = new xdc3.eth.Contract(
            NFTMarketLayer1.abi,
            nftmarketlayeraddress,
            xdc3
          );
          const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
          if (wallet?.connected) {
            try {
              const check = await checkCollectionExists();
              if (check) {
                const collectionData = await marketContract.methods
                  .fetchCollection(
                    document.getElementsByClassName("collection-name")[0].value
                  )
                  .call();
                if (
                  collectionData.creator ===
                  (isXdc(wallet?.address)
                    ? fromXdc(wallet?.address)
                    : wallet?.address)
                ) {
                  setCollectionExists(false);
                  const collectionUri = await nftContract.methods
                    .tokenURI(collectionData.tokenId)
                    .call();
                  var collectionMetadata = await axios.get(collectionUri);
                  setCollectionBannerURL(
                    collectionMetadata?.data?.collection?.banner
                  );
                  setCollectionLogoURL(
                    collectionMetadata?.data?.collection?.logo
                  );
                  setCollectionDescription(
                    collectionMetadata?.data?.collection?.description
                  );
                  setInstagramLink(
                    collectionMetadata?.data?.collection?.instagramUrl
                  );
                  setTwitterLink(
                    collectionMetadata?.data?.collection?.twitterUrl
                  );
                  setDiscordLink(
                    collectionMetadata?.data?.collection?.discordUrl
                  );
                  setWebsiteLink(
                    collectionMetadata?.data?.collection?.websiteUrl
                  );
                  const uploadData = JSON.stringify({
                    collection: {
                      name: document.getElementById("collection-name-input")
                        .value,
                      description:
                        collectionMetadata?.data?.collection?.description,
                      creator: isXdc(wallet?.address)
                        ? fromXdc(wallet?.address)
                        : wallet?.address,
                      banner: collectionMetadata?.data?.collection?.banner,
                      logo: collectionMetadata?.data?.collection?.logo,
                      twitterUrl:
                        collectionMetadata?.data?.collection?.twitterUrl,
                      instagramUrl:
                        collectionMetadata?.data?.collection?.instagramUrl,
                      discordUrl:
                        collectionMetadata?.data?.collection?.discordUrl,
                      websiteUrl:
                        collectionMetadata?.data?.collection?.websiteUrl,
                      nft: {
                        name,
                        description,
                        owner: isXdc(wallet?.address)
                          ? fromXdc(wallet?.address)
                          : wallet?.address,
                        image: assetURL,
                        unlockableContent,
                        properties: properties,
                        royalty: royalty,
                        fileType: file.fileType,
                        preview: previewURL,
                      },
                    },
                  });
                  // console.log(uploadData);
                  const added = await client.add(uploadData);
                  const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                  updateMarketplace(url);
                } else {
                  document
                    .getElementsByClassName("nft-collection")[0]
                    .scrollIntoView();
                  return;
                }
              } else {
                const uploadData = JSON.stringify({
                  collection: {
                    name: document.getElementById("collection-name-input")
                      .value,
                    description: collectionDescription,
                    creator: isXdc(wallet?.address)
                      ? fromXdc(wallet?.address)
                      : wallet?.address,
                    banner: collectionBannerURL,
                    logo: collectionLogoURL,
                    twitterUrl: twitterLink,
                    instagramUrl: instagramLink,
                    discordUrl: discordLink,
                    websiteUrl: websiteLink,
                    nft: {
                      name,
                      description,
                      owner: isXdc(wallet?.address)
                        ? fromXdc(wallet?.address)
                        : wallet?.address,
                      image: assetURL,
                      unlockableContent,
                      properties: properties,
                      royalty: royalty,
                      fileType: file.fileType,
                      preview: previewURL,
                    },
                  },
                });
                // console.log(uploadData);
                const added = await client.add(uploadData);
                const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                updateMarketplace(url);
              }
            } catch (error) {
              console.log(error);
              setMintButtonStatus(4);
              return;
            }
          } else {
            setIsWalletDisconnected(true);
            setMintButtonStatus(4);
          }
          // }
        }
      }
    }
  };

  const updateMarketplace = async (url) => {
    try {
      const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
      const contract = new xdc3.eth.Contract(
        NFT.abi,
        nftaddress,
        isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address
      );
      let data = contract.methods.createToken(url).encodeABI();
      const tx = {
        from: isXdc(wallet?.address)
          ? fromXdc(wallet?.address)
          : wallet?.address,
        to: nftaddress,
        data,
      };
      let gasLimit = await xdc3.eth.estimateGas(tx);
      tx["gas"] = gasLimit;
      let transaction = await SendTransaction(tx);
      setMintButtonStatus(2);
      var txReceipt = await xdc3.eth.getTransactionReceipt(
        transaction.transactionHash
      );
      var tokenId = await txReceipt.logs[0].topics[3];
      setTokenId(tokenId);
      const weiprice = await xdc3.utils.toWei(price, "ether");
      const contract2 = new xdc3.eth.Contract(
        NFTMarketLayer1.abi,
        nftmarketlayeraddress,
        isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address
      );
      data = contract2.methods
        .createMarketItem(
          Number(tokenId),
          0,
          isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address,
          isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address,
          weiprice,
          false,
          royalty,
          1,
          name,
          collection
        )
        .encodeABI();
      const tx2 = {
        from: isXdc(wallet?.address)
          ? fromXdc(wallet?.address)
          : wallet?.address,
        to: nftmarketlayeraddress,
        value: "",
        data,
      };
      gasLimit = await xdc3.eth.estimateGas(tx2);
      tx2["gas"] = gasLimit;
      transaction = await SendTransaction(tx2);
      setMintButtonStatus(3);
      setMinted(true);
    } catch (error) {
      console.log(error);
      setMintButtonStatus(4);
    }
    setTimeout(() => {
      setMintButtonStatus(0);
    }, 1500);
  };

  const checkRoyalty = function () {
    if (royalty === 0) {
      setRoyaltyAlert(true);
    } else {
      setRoyaltyAlert(false);
      mintNFT();
    }
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  useEffect(() => {
    setWallet(props?.wallet);
    fetchCollection();
  }, []);

  useEffect(() => {
    setWallet(props?.wallet);
    fetchCollection();
  }, [props?.wallet]);

  const [showMenu, setShowMenu] = useContext(menuContext);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();

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
    // console.log(scrolling);
  }, [scrolling]);

  return (
    <CreationSection>
      {isWalletDisconnected && (
        <FadedBack>
          <VStack
            background={appStyle.colors.darkgrey60}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
            }}
          >
            <TxModal
              isNotice="true"
              noticeMessage="Wallet connection is not detected. Please connect your wallet and try again."
              noticeActionModal={() => {
                setIsWalletDisconnected(false);
                setMintButtonStatus(0);
              }}
            ></TxModal>
          </VStack>
        </FadedBack>
      )}
      {modalAlert && (
        <FadedBack>
          <VStack
            background={appStyle.colors.darkgrey60}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
            }}
          >
            <TxModal
              isAction="true"
              actionMessage="Are you sure you want to clear all the fields?"
              cancelActionModal={() => setModalAlert(false)}
              confirmActionModal={() => {
                clearForm();
              }}
            ></TxModal>
          </VStack>
        </FadedBack>
      )}
      {royaltyAlert && (
        <FadedBack>
          <VStack
            background={appStyle.colors.darkgrey60}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
            }}
          >
            <TxModal
              isAction="true"
              actionMessage="Are you sure you want to proceed with minting your NFT
                with 0% royalty?"
              cancelActionModal={() => setRoyaltyAlert(false)}
              confirmActionModal={() => {
                mintNFT();
              }}
            ></TxModal>
          </VStack>
        </FadedBack>
      )}
      {minted && (
        <FadedBack>
          <VStack
            background={appStyle.colors.darkgrey60}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3,
            }}
          >
            <TxModal
              isMint="true"
              mintName={name}
              mintedNFT={assetURL}
              confirmActionModal={() => {
                NavigateTo(`nft/${nftaddress}/${tokenId}`);
              }}
            ></TxModal>
          </VStack>
        </FadedBack>
      )}
      <HStack id={"creation-banner"} backgroundimage={CreationBar}>
        <HStack width="1200px" height="157px" padding="0px 30px">
          <TitleBold27 textcolor={appStyle.colors.white}>
            Create an NFT
          </TitleBold27>
        </HStack>
      </HStack>
      <ContentCreation>
        <VStack spacing="51px">
          <HStack padding="0 39px" spacing="69px" responsive={true}>
            <VStack maxwidth={size.width < 768 ? "320px" : "489px"}>
              <HStack id={"nft-asset"}>
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Upload you Image, Video or Audio
                </TitleBold15>
                <Spacer></Spacer>
                <CaptionRegular textcolor={({ theme }) => theme.text}>
                  Required
                </CaptionRegular>
              </HStack>
              <UploadMultimedia
                border="15px"
                sizeText="Recommended size: 490px x 490px"
                width={size.width < 768 ? "320px" : "489px"}
                height={size.width < 768 ? "320px" : "489px"}
                file={file}
                secondaryFile={preview}
                button={"upload-button"}
                secondaryButton={"preview-file"}
                isUploading={uploadNFT}
                secondaryUploading={uploadPreviewStatus}
                onClickSecondary={() => {
                  document.getElementById("preview-file").value = null;
                  setPreview({ preview: "", raw: "", fileType: "" });
                }}
                description="Click to upload NFT Image"
              ></UploadMultimedia>
              <input
                type="file"
                id="upload-button"
                style={{ display: "none" }}
                onChange={handleChangeUploadMultimedia}
              />
              <input
                type="file"
                id="preview-file"
                style={{ display: "none" }}
                onChange={handleChangeUploadMultimediaPreview}
              />
              {file.raw !== "" && (
                <ButtonsNFT>
                  <HStack
                    width={size.width < 768 ? "320px" : "489px"}
                    height={size.width < 768 ? "30px" : "60px"}
                    padding="0 15px"
                  >
                    <ButtonApp
                      text="Clear"
                      textcolor={({ theme }) => theme.text}
                      onClick={() => {
                        document.getElementById("upload-button").value = null;
                        setFile({ preview: "", raw: "", fileType: "" });
                      }}
                      background={({ theme }) => theme.backElement}
                      width="90px"
                      height="39px"
                      btnStatus={0}
                    ></ButtonApp>
                    <Spacer></Spacer>
                  </HStack>
                </ButtonsNFT>
              )}
              {isAssetEmpty ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    Asset cannot be empty. Please upload an asset before
                    proceeding with the minting process.
                  </CaptionRegular>
                </HStack>
              ) : null}
            </VStack>
            <VStack spacing="18px" width="100%">
              <HStack>
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Name
                </TitleBold15>
                <Spacer></Spacer>
                <CaptionRegular textcolor={({ theme }) => theme.text}>
                  Required
                </CaptionRegular>
              </HStack>
              <InputStyled
                propertyKey={"nft-name"}
                type="text"
                input={name}
                placeholder="Name your NFT"
                onChange={(event) => {
                  setIsNameEmpty(false);
                  setName(event.target.value);
                }}
              ></InputStyled>
              {isNameEmpty ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    Name cannot be empty. Please choose a name for your asset
                    before proceeding with the minting process.
                  </CaptionRegular>
                </HStack>
              ) : null}
              <HStack>
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Description
                </TitleBold15>
                <Spacer></Spacer>
              </HStack>
              <TextAreaStyled
                textClass={"nft-description"}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              ></TextAreaStyled>
              <HStack>
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Price
                </TitleBold15>
                <Spacer></Spacer>
                <CaptionRegular textcolor={({ theme }) => theme.text}>
                  Required
                </CaptionRegular>
              </HStack>
              <InputStyled
                inputId="price-input"
                type="number"
                placeholder="0.00"
                propertyKey={"nft-price"}
                input={price}
                min={"0.0001"}
                step={"0.0001"}
                icon={xdc}
                onChange={(event) => {
                  setIsPriceZero(false);
                  setPrice(event.target.value);
                }}
                onBlur={() => {
                  if (isNaN(parseFloat(price)) && price !== 0)
                    setIsPriceInvalid(true);
                  else setIsPriceInvalid(false);
                }}
              ></InputStyled>
              {isPriceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please use
                    numeric characters with a maximum of one decimal point only.
                  </CaptionRegular>
                </HStack>
              ) : null}
              {isPriceZero ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    Price cannot be zero. Please set a price for your asset
                    before proceeding with the minting process.
                  </CaptionRegular>
                </HStack>
              ) : null}
            </VStack>
          </HStack>
          <Divider></Divider>
          <HStack
            padding="0 39px"
            spacing="69px"
            responsive={true}
            alignment="flex-start"
          >
            <VStack alignment="flex-start">
              <TitleBold15 textcolor={({ theme }) => theme.text}>
                Properties
              </TitleBold15>
              <BodyRegular textcolor={({ theme }) => theme.text}>
                Create custom properties that define the Rarity of your NFT.
                Properties are shown underneath your piece.
              </BodyRegular>
              <HStack
                flexwrap="wrap"
                height="auto"
                spacing="9px"
                padding="0"
                justify={size.width < 768 ? "center" : "flex-start"}
              >
                {properties.map((property, i) => (
                  <PropertyValue
                    propertyKey={i}
                    key={i}
                    onChangeProperty={(event) => {
                      var newProperties = properties;
                      newProperties[
                        event.target.className.split(" ")[2] !== undefined
                          ? event.target.className.split(" ")[2]
                          : 0
                      ].property = event.target.value;
                      setProperties(newProperties);
                    }}
                    onChangeValue={(event) => {
                      var newProperties = properties;
                      newProperties[
                        event.target.className.split(" ")[2] !== undefined
                          ? event.target.className.split(" ")[2]
                          : 0
                      ].value = event.target.value;
                      setProperties(newProperties);
                    }}
                  ></PropertyValue>
                ))}
              </HStack>
              <HStack>
                <ButtonApp
                  height="39px"
                  width={size.width < 768 ? "100%" : "44%"}
                  text="Remove"
                  textcolor={({ theme }) => theme.text}
                  background={appStyle.colors.darkgrey10}
                  onClick={() => setProperties(properties.slice(0, -1))}
                  cursor="pointer"
                  btnStatus={0}
                ></ButtonApp>
                <ButtonApp
                  height="39px"
                  width={size.width < 768 ? "100%" : "44%"}
                  text="Add"
                  textcolor={appStyle.colors.white}
                  onClick={() =>
                    setProperties([...properties, { property: "", value: "" }])
                  }
                  cursor="pointer"
                  btnStatus={0}
                ></ButtonApp>
              </HStack>
            </VStack>
            <VStack spacing="39px">
              <VStack width="100%" alignment="flex-start">
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Royalty
                </TitleBold15>
                <BodyRegular textcolor={({ theme }) => theme.text}>
                  Earn a fee when a user re-sells your NFT
                </BodyRegular>
                <InputStyled
                  propertyKey={"nft-royalty"}
                  placeholder="0.00"
                  type={"number"}
                  min={"0"}
                  max={"100"}
                  icon={percent}
                  input={royalty}
                  onChange={(event) => {
                    setRoyalty(Math.ceil(event.target.value));
                  }}
                  onBlur={() => {
                    if (parseInt(royalty) > 100) {
                      setRoyalty(100);
                    }
                  }}
                ></InputStyled>
              </VStack>
              <VStack width="100%" alignment="flex-start">
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Unlockable Content
                </TitleBold15>
                <BodyRegular textcolor={({ theme }) => theme.text}>
                  If needed, include unlockable content that will be revealed by
                  the owner of the NFT.
                </BodyRegular>
                {isUnlockableContent ? (
                  <InputStyled
                    propertyKey={"nft-unlockable-content"}
                    input={unlockableContent}
                    placeholder="e.g. Secret Code, Invitation Link"
                    type={"text"}
                    onChange={(event) => {
                      setUnlockableContent(event.target.value);
                    }}
                  ></InputStyled>
                ) : null}
                <ButtonApp
                  btnStatus={0}
                  icon={lock}
                  buttonId={"nft-unlockable"}
                  iconWidth="39px"
                  iconHeight="18px"
                  text={
                    isUnlockableContent
                      ? "Remove Unlockable Content"
                      : "Add Unlockable Content"
                  }
                  width="100%"
                  height="39px"
                  textcolor={appStyle.colors.white}
                  onClick={() => {
                    setIsUnlockableContent(!isUnlockableContent);
                  }}
                  cursor="pointer"
                ></ButtonApp>
              </VStack>
            </VStack>
          </HStack>
          <Divider></Divider>
          <VStack width="100%" alignment="flex-start" padding="0 30px">
            <TitleBold15 textcolor={({ theme }) => theme.text}>
              Collection
            </TitleBold15>
            <BodyRegular textcolor={({ theme }) => theme.text}>
              If your NFT belongs to any collection, please use the name in the
              collection name field.
            </BodyRegular>
            {/* <SelectStyled
              selectClass={"nft-collection"}
              value={collection}
              collections={collections}
              onChange={async (event) => {
                if (event.target.value === "newCollection-nxfgh-odjfg-hjdeb") {
                  const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
                  const marketContract = new xdc3.eth.Contract(
                    NFTMarketLayer1.abi,
                    nftmarketlayeraddress,
                    xdc3
                  );
                  const tokenCount = await marketContract.methods.tokenCount().call();
                  setNewCollection(true);
                  setCollection(`Untitled Collection ${tokenCount}`);
                  setCollectionExists(false);
                  setCollectionEmpty(true)
                  document
                    .getElementsByClassName("collection-url")[0]
                    .setAttribute(
                      "placeholder",
                      `Untitled Collection ${tokenCount}`.replace(/\s+/g, "%20")
                    );
                } else {
                  setNewCollection(false);
                  setCollection(event.target.value);
                }
                setIsCollectionNotSelected(false);
              }}
            ></SelectStyled> */}
            {isCollectionNotSelected ? (
              <HStack
                background={appStyle.colors.softRed}
                padding="6px 15px"
                border="6px"
              >
                <CaptionRegular textcolor={appStyle.colors.darkRed}>
                  Please choose a collection to add your NFT to.
                </CaptionRegular>
              </HStack>
            ) : null}
          </VStack>
          {/* {isNewCollection ? ( */}
          <>
            <HStack responsive={true} spacing="0px" alignment="flex-start">
              <VStack width="100%" padding="30px" spacing="150px">
                <VStack>
                  <TitleBold15>Upload Banner and Collection Image</TitleBold15>
                  <UploadMultimedia
                    sizeText="Recommended size: 1200px x 520px"
                    width={size.width < 768 ? "390px" : "540px"}
                    height="210px"
                    backsize="cover"
                    border="9px"
                    file={collectionBanner}
                    button={"upload-button-collection"}
                    description="Collection Banner"
                    isUploading={uploadBannerStatus}
                  ></UploadMultimedia>
                  <input
                    type="file"
                    id="upload-button-collection"
                    style={{ display: "none" }}
                    onChange={handleChangeUploadMultimediaCollection}
                  />
                  {collectionBanner.raw !== "" && (
                    <ButtonsBanner>
                      <HStack
                        width="540px"
                        padding="15px"
                        height="213px"
                        alignment="flex-end"
                      >
                        <ButtonApp
                          text="Clear"
                          textcolor={({ theme }) => theme.text}
                          onClick={() => {
                            document.getElementById(
                              "upload-button-collection"
                            ).value = null;
                            setCollectionBanner({ preview: "", raw: "" });
                          }}
                          background={({ theme }) => theme.backElement}
                          width="81px"
                          height="36px"
                          btnStatus={0}
                        ></ButtonApp>
                        <Spacer></Spacer>
                      </HStack>
                    </ButtonsBanner>
                  )}
                  <ImageCollection>
                    <VStack width="150px" spacing="9px">
                      <UploadMultimedia
                        sizeText="400px x 400px"
                        width="150px"
                        height="150px"
                        backsize="cover"
                        file={collectionLogo}
                        border="150px"
                        button={"upload-button-logo"}
                        description="Collection Logo"
                        bordersize="3px"
                        bordercolor="white"
                        borderLoader="150px"
                        style={{
                          boxShadow: "0px 6px 9px 0px rgba(0, 0, 0, 1)",
                        }}
                        setBorder={true}
                        isUploading={uploadLogoStatus}
                      ></UploadMultimedia>
                      {collectionLogo.raw !== "" && (
                        <ButtonsLogo>
                          <HStack
                            width="180px"
                            height="190px"
                            spacing="6px"
                            alignment="flex-end"
                          >
                            <ButtonApp
                              btnStatus={0}
                              text="Clear"
                              textcolor={({ theme }) => theme.text}
                              onClick={() => {
                                document.getElementById(
                                  "upload-button-logo"
                                ).value = null;
                                setCollectionLogo({ preview: "", raw: "" });
                              }}
                              background={({ theme }) => theme.backElement}
                              width="81px"
                              height="36px"
                            ></ButtonApp>
                          </HStack>
                        </ButtonsLogo>
                      )}
                      <input
                        type="file"
                        id="upload-button-logo"
                        style={{ display: "none" }}
                        onChange={handleChangeUploadMultimediaLogo}
                      />
                    </VStack>
                  </ImageCollection>
                </VStack>
                <VStack width="100%" alignment="flex-start">
                  <TitleBold15>Social Networks and Link</TitleBold15>
                  <HStack>
                    <VStack width="100%">
                      <InputStyledLink
                        icon={instagramIcon}
                        input={instagramLink}
                        placeholder="Instagram Account"
                        onChange={(event) => {
                          setInstagramLink(event.target.value);
                        }}
                      ></InputStyledLink>
                      <InputStyledLink
                        icon={twitterIcon}
                        input={twitterLink}
                        placeholder="Twitter Account"
                        onChange={(event) => {
                          setTwitterLink(event.target.value);
                        }}
                      ></InputStyledLink>
                    </VStack>

                    <VStack>
                      <InputStyledLink
                        icon={discordIcon}
                        input={discordLink}
                        placeholder="Discord Link"
                        onChange={(event) => {
                          setDiscordLink(event.target.value);
                        }}
                      ></InputStyledLink>
                      <InputStyledLink
                        icon={linkIcon}
                        placeholder="Website"
                        input={websiteLink}
                        onChange={(event) => {
                          setWebsiteLink(event.target.value);
                        }}
                      ></InputStyledLink>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
              <VStack width="100%" padding="30px">
                <VStack alignment="flex-start" width="100%">
                  <TitleBold15>Collection Name</TitleBold15>
                  <InputStyled
                    inputId="collection-name-input"
                    icon={loadingIcon}
                    input={collection}
                    propertyKey={"collection-name"}
                    placeholder="Name your Collection"
                    onChange={(event) => {
                      setCollection(event.target.value);
                      setCollectionExists(false);
                      setCollectionValid(false);
                      setCollectionEmpty(false);
                      document
                        .getElementsByClassName("collection-url")[0]
                        .setAttribute(
                          "placeholder",
                          event.target.value
                            .replace(/\s+/g, "%20")
                            .replace(/%20$/, "")
                        );
                    }}
                    onBlur={async () => {
                      if (collection === "") {
                        const xdc3 = new Xdc3(
                          new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER)
                        );
                        const marketContract = new xdc3.eth.Contract(
                          NFTMarketLayer1.abi,
                          nftmarketlayeraddress,
                          xdc3
                        );
                        const tokenCount = await marketContract.methods
                          .tokenCount()
                          .call();
                        setCollection(`Untitled Collection ${tokenCount}`);
                        setCollectionExists(false);
                        setCollectionEmpty(true);
                        document
                          .getElementsByClassName("collection-url")[0]
                          .setAttribute(
                            "placeholder",
                            `Untitled Collection ${tokenCount}`.replace(
                              /\s+/g,
                              "%20"
                            )
                          );
                      } else {
                        checkCollectionExists();
                      }
                    }}
                  ></InputStyled>
                  {collectionExists ? (
                    <HStack
                      background={appStyle.colors.softRed}
                      padding="6px 15px"
                      border="6px"
                    >
                      <CaptionRegular textcolor={appStyle.colors.darkRed}>
                        Collection name already taken. Please choose a different
                        name.
                      </CaptionRegular>
                    </HStack>
                  ) : null}
                  {collectionEmpty ? (
                    <HStack
                      background={appStyle.colors.yellow}
                      padding="6px 15px"
                      border="6px"
                    >
                      <CaptionRegular textcolor={appStyle.colors.darkYellow}>
                        Collection name is empty. Collection will be assigned an
                        Untitled Collection name.
                      </CaptionRegular>
                    </HStack>
                  ) : null}
                  {collectionValid ? (
                    <HStack
                      background={appStyle.colors.green}
                      padding="6px 15px"
                      border="6px"
                    >
                      <CaptionRegular textcolor={appStyle.colors.darkGreen}>
                        This collection belongs to you. You can add NFTs to this
                        collection. You can skip to the minting step.
                      </CaptionRegular>
                    </HStack>
                  ) : null}
                </VStack>
                <VStack alignment="flex-start" width="100%">
                  <TitleBold15>Collection URL</TitleBold15>
                  <InputStyledURL
                    inputClass="collection-url"
                    placeholder="collection-name"
                  ></InputStyledURL>
                </VStack>
                <VStack alignment="flex-start" width="100%">
                  <TitleBold15>Description</TitleBold15>
                  <TextAreaStyled
                    value={collectionDescription}
                    onChange={(event) => {
                      setCollectionDescription(event.target.value);
                    }}
                    height="240px"
                  ></TextAreaStyled>
                </VStack>
              </VStack>
            </HStack>
          </>
          {/* ) : null} */}
          <Divider></Divider>
          <HStack padding="0 39px" spacing="69px" responsive={true}>
            <HStack width="100%">
              <IconImg url={xinfinLogo} width="45px" height="45px"></IconImg>
              <VStack width="100%" alignment="flex-start" spacing="6px">
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Blockchain
                </TitleBold15>
                <BodyRegular textcolor={({ theme }) => theme.text}>
                  Your NFT will be published on XDC Blockchain
                </BodyRegular>
              </VStack>
            </HStack>
            <HStack width="100%">
              <ButtonApp
                text="Clear Form"
                height="39px"
                width="100%"
                background={({ theme }) => theme.faded}
                textcolor={appStyle.colors.text}
                onClick={() => setModalAlert(true)}
                cursor="pointer"
                btnStatus={0}
              ></ButtonApp>
              <ButtonApp
                buttonId="mint-button"
                text="Mint your NFT"
                btnStatus={mintButtonStatus}
                func={"Mint"}
                height="39px"
                width="100%"
                textcolor={appStyle.colors.white}
                onClick={checkRoyalty}
                cursor="pointer"
              ></ButtonApp>
            </HStack>
          </HStack>
        </VStack>
      </ContentCreation>
    </CreationSection>
  );
}

export { CreateNft };

const ImageCollection = styled(motion.div)`
  position: absolute;
  bottom: -81px;
  filter: drop-shadow(0px 6px 9px rgba(0, 0, 0, 0.08));
`;

const CreationSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.04);
`;

const ContentCreation = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const ButtonsBanner = styled(motion.div)`
  position: absolute;
  bottom: 0;
`;

const ButtonsLogo = styled(motion.div)`
  position: absolute;
  bottom: -45px;
`;

const ButtonsNFT = styled(motion.div)`
  position: absolute;
  bottom: 15px;
`;

const FadedBack = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100vh;
  z-index: 100;
`;
