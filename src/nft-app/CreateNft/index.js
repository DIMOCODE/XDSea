import React, { useState, useEffect, useContext } from "react";
import { create } from "ipfs-http-client";
import { SendTransaction } from "xdc-connect";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER, HEADER, HTTP_METHODS, LS, LS_ROOT_KEY } from "../../constant";
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
  BodyBold,
} from "../../styles/TextStyles";
import arrowDown from "../../images/arrowDown.png";
import addShape from "../../images/addShape.png";
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
import { createRequest } from "../../API";
import { createCollection, getCollection, getCollections } from "../../API/Collection";
import { createNFT } from "../../API/NFT";

function CreateNft(props) {
  const history = useHistory();
  const size = useWindowSize();
  const [nft, setNFT] = useState({ 
    preview: "", 
    raw: "", 
    fileType: "" 
  });
  const [isAssetEmpty, setIsAssetEmpty] = useState(false);
  const [preview, setPreview] = useState({
    preview: "",
    raw: "",
    fileType: "",
  });
  const [name, setName] = useState("");
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [isPriceZero, setIsPriceZero] = useState(false);
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);
  const [properties, setProperties] = useState([
    { property: "", value: "" },
    { property: "", value: "" },
  ]);
  const [royalty, setRoyalty] = useState(0);
  const [isUnlockableContent, setIsUnlockableContent] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState("");
  const [collections, setCollections] = useState([]);
  const [isWalletDisconnectedCollection, setIsWalletDisconnectedCollection] = useState(false);
  const [isOpenSelector, setIsOpenSelector] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(
    "Select your Collection"
  );
  const [newCollection, setNewCollection] = useState(false);
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
  const [instagramLink, setInstagramLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [token, setToken] = useState(0);
  const [collectionName, setCollectionName] = useState("");
  const [user, setUser] = useState({});
  const [isCollectionNotSelected, setIsCollectionNotSelected] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(empty);
  const [collectionExists, setCollectionExists] = useState(false);
  const [collectionEmpty, setCollectionEmpty] = useState(false);
  const [collectionValid, setCollectionValid] = useState(false);
  const [loadingIconSelector, setLoadingIconSelector] = useState(arrowDown);
  const [uploadBannerStatus, setUploadBannerStatus] = useState(false);
  const [uploadLogoStatus, setUploadLogoStatus] = useState(false);
  const [uploadPreviewStatus, setUploadPreviewStatus] = useState(false);
  const [uploadNFT, setUploadNFT] = useState(false);
  const [collection, setCollection] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [mintButtonStatus, setMintButtonStatus] = useState(0);
  const [isWalletDisconnected, setIsWalletDisconnected] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [royaltyAlert, setRoyaltyAlert] = useState(false);
  const [assetURL, setAssetURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [collectionBannerURL, setCollectionBannerURL] = useState("");
  const [collectionLogoURL, setCollectionLogoURL] = useState("");
  const [wallet, setWallet] = useState(null);
  const [minted, setMinted] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [, setShowMenu] = useContext(menuContext);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [collectionNickName, setCollectionNickName] = useState("");

  /**
   * Adding Authentication for pinning new uploads to the IPFS Project
   */
  const auth =
    "Basic " +
    Buffer.from(
      process.env.REACT_APP_PROJECT_ID +
        ":" +
        process.env.REACT_APP_PROJECT_SECRET
    ).toString("base64");
  
  const client = create({ url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const removeBlankProperties = async () => {
    var filteredProperties = [];
    await Promise.all(
      properties.map((property) => {
        if(property.property !== "" && property.value !== "")
          filteredProperties.push(property);
      })
    );
    return filteredProperties;
  }

  const fetchCollections = async (userData) => {
    setLoadingIconSelector(loading);
    try{
      setIsCollectionNotSelected(false);
      if(userData.user._id !== undefined) {
        const collectionData = await (
          await getCollections({ userId: userData.user._id })
        ).data;
        console.log(collectionData.collections);
        setCollections(collectionData.collections);
      }
      else {
        setIsWalletDisconnectedCollection(true);
        setCollections([]);
      }
      setLoadingIconSelector(arrowDown);
    }
    catch (err) {
      setIsWalletDisconnectedCollection(true);
    }
  };

  const toggleCollectionSelector = async () => {
    const userData = await getUser();
    if(!isOpenSelector && collections.length == 0)
      await fetchCollections(userData);
    setIsOpenSelector(!isOpenSelector);
  };

  const onCollectionSelected = (value, nickName) => () => {
    setSelectedCollection(value);
    setIsOpenSelector(false);
    setNewCollection(false);
    setIsCollectionNotSelected(false);
    setCollection(value);
    setCollectionNickName(nickName);
  };

  const handleChangeUploadMultimedia = (e) => {
    setIsAssetEmpty(false);
    if (e.target.files.length) {
      setNFT({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
  };

  const handleChangeUploadMultimediaPreview = (e) => {
    if (e.target.files.length) {
      setPreview({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
  };

  const handleChangeUploadMultimediaCollection = (e) => {
    if (e.target.files.length) {
      setCollectionBanner({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
  };

  const handleChangeUploadMultimediaLogo = (e) => {
    if (e.target.files.length) {
      setCollectionLogo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
        fileType: e.target.files[0].type,
      });
    }
  };

  const getCollectionName = async () => {
    setLoadingIcon(loading);
    const tokenData = await (await createRequest(HTTP_METHODS.get, "nft/higher", null, null)).data.higher.tokenId;
    setToken(tokenData + 1);
    setCollectionName(`Untitled Collection ${tokenData + 1}`);
    setCollectionExists(false);
    setCollectionEmpty(true);
    if(document.getElementsByClassName("collection-url")[0])
      document
        .getElementsByClassName("collection-url")[0]
        .setAttribute(
          "placeholder",
          `Untitled Collection ${tokenData + 1}`.replace(/\s+/g, "-")
        );
    setLoadingIcon(empty);
  };

  const checkCollectionExists = async (collectionNickName) => {
    setLoadingIcon(loading);
    try{
      const collectionData = await (await getCollection(collectionNickName)).data;
      if(collectionData.collection.creator._id === user) {
        setCollectionExists(false);
        setCollectionValid(true);
      }
      else {
        setCollectionExists(true);
      }
      setLoadingIcon(empty);
      setCollectionNickName(collectionNickName);
      return true;
    }
    catch(err) {
      setCollectionExists(false);
      setCollectionEmpty(false);
      setLoadingIcon(empty);
      return false;
    }
  };

  const clearForm = async () => {
    setNFT({ 
      preview: "", 
      raw: "", 
      fileType: "" 
    });
    document.getElementById("upload-button").value = null;
    setIsAssetEmpty(false);
    setPreview({ 
      preview: "", 
      raw: "", 
      fileType: "" 
    });
    if(document.getElementById("preview-file"))
      document.getElementById("preview-file").value = null;
    setName("");
    setIsNameEmpty(false);
    setDescription("");
    setPrice(0);
    setIsPriceZero(false);
    setIsPriceInvalid(false);
    setProperties([
      { property: "", value: "" },
      { property: "", value: "" },
    ]);
    setRoyalty(0);
    setIsUnlockableContent(false);
    setUnlockableContent("");
    setSelectedCollection("Select your Collection");
    setNewCollection(false);
    setCollectionBanner({ 
      preview: "", 
      raw: "", 
      fileType: "" 
    });
    if(document.getElementById("upload-button-collection"))
      document.getElementById("upload-button-collection").value = null;
    setCollectionLogo({ 
      preview: "", 
      raw: "", 
      fileType: "" 
    });
    if(document.getElementById("upload-button-logo"))
      document.getElementById("upload-button-logo").value = null;
    setInstagramLink("");
    setTwitterLink("");
    setDiscordLink("");
    setWebsiteLink("");
    getCollectionName();
    setCollectionEmpty(false);
    setCollectionExists(false);
    setCollectionValid(false);
    setIsCollectionNotSelected(false);
    setCollection("");
    setCollectionName("");
    setCollectionDescription("");
    setCollectionBannerURL("");
    setCollectionLogoURL("");
    setPreviewURL("");
    setAssetURL("");
    setModalAlert(false);
    setMintButtonStatus(0);
  };

  const addToIPFS = async () => {
    setUploadNFT(true);
    const file = document.getElementById("upload-button").files[0];
    try {
      const added = await client.add(file);
      const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
      setAssetURL(url);
      setUploadNFT(false);
      return url;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSCollectionBanner = async () => {
    setUploadBannerStatus(true);
    const file = document.getElementById("upload-button-collection").files[0];
    try {
      const added = await client.add(file);
      const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
      setCollectionBannerURL(url);
      setUploadBannerStatus(false);
      return url;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSCollectionLogo = async () => {
    setUploadLogoStatus(true);
    const file = document.getElementById("upload-button-logo").files[0];
    try {
      const added = await client.add(file);
      const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
      setCollectionLogoURL(url);
      setUploadLogoStatus(false);
      return url;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSPreview = async () => {
    setUploadPreviewStatus(true);
    if(preview.raw !== "") {
      const file = document.getElementById("preview-file").files[0];
      try {
        const added = await client.add(file);
        const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
        setPreviewURL(url);
        setUploadPreviewStatus(false);
        return url;
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    }
    else return "";
  };

  const checkRoyalty = async () => {
    if (royalty === 0) {
      setRoyaltyAlert(true);
    } else {
      setRoyaltyAlert(false);
      mintNFT();
    }
  };

  const mintNFT = async () => {
    setRoyaltyAlert(false);
    if (nft.raw === "") {
      setIsAssetEmpty(true);
      document.getElementById("nft-asset").scrollIntoView();
    } else {
      if (name === "") {
        setIsNameEmpty(true);
        document.getElementById("creation-banner").scrollIntoView();
      } else {
        if (price == 0) {
          setIsPriceZero(true);
          document
            .getElementsByClassName("nft-description")[0]
            .scrollIntoView();
        } else {
          if (collection === "" && collectionName === "") {
            setIsCollectionNotSelected(true);
          }
          else{
            const filteredProperties = await removeBlankProperties();
            console.log(filteredProperties)
            setProperties(filteredProperties);
            const nftUrl = await addToIPFS();
            const previewUrl = await addToIPFSPreview();
            // await addToIPFSCollectionBanner();
            // await addToIPFSCollectionLogo();

            setMintButtonStatus(1);
            if (user?.user?._id && wallet?.address) {
              try {
                const uploadData = JSON.stringify({
                  name,
                  description,
                  properties: filteredProperties,
                  royalty,
                  creator: isXdc(wallet?.address)
                    ? fromXdc(wallet?.address)
                    : wallet?.address,
                  image: nftUrl,
                  fileType: nft.fileType,
                  preview: previewUrl,
                });
                console.log(uploadData);
                const added = await client.add(uploadData);
                const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
                updateMarketplace(url, nftUrl, filteredProperties);
              } catch (error) {
                console.log(error);
                setMintButtonStatus(4);
                return;
              }
            } else {
              setIsWalletDisconnected(true);
              setMintButtonStatus(4);
            }
          }
        }
      }
    }
  };

  const updateMarketplace = async (url, nftUrl, filteredProperties) => {
    try {
      console.log("Update " + assetURL);
      const xdc3 = new Xdc3(
        new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER, HEADER)
      );
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
          collection !== "" ? collection : collectionName
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
      if(newCollection && !collectionExists) {
        const collectionCreation = await (await createCollection(
          collectionName, 
          isXdc(wallet?.address)
            ? fromXdc(wallet?.address)
            : wallet?.address, 
          collectionDescription,
          collectionLogoURL, 
          collectionBannerURL, 
          twitterLink,
          instagramLink,
          discordLink, 
          websiteLink)).data.collection;
        const nftCreation = await (await createNFT(
          collectionCreation._id, 
          tokenId, 
          isXdc(wallet?.address)
            ? fromXdc(wallet?.address)
            : wallet?.address, 
          price, 
          royalty, 
          name, 
          description, 
          nftUrl, 
          nft.fileType,
          previewURL, 
          filteredProperties
        )).data.nft;
      }
      else{
        const collectionId = await (await getCollection(collectionNickName)).data.collection._id;
        console.log(collectionId, 
          tokenId, 
          isXdc(wallet?.address)
            ? fromXdc(wallet?.address)
            : wallet?.address, 
          price, 
          royalty, 
          name, 
          description, 
          assetURL, 
          nft.fileType,
          previewURL, 
          properties)
        const nftCreation = await (await createNFT(
          collectionId, 
          tokenId, 
          isXdc(wallet?.address)
            ? fromXdc(wallet?.address)
            : wallet?.address, 
          price, 
          royalty, 
          name, 
          description, 
          nftUrl, 
          nft.fileType,
          previewURL, 
          filteredProperties
        )).data.nft;
      }
        
      setMinted(true);
    } catch (error) {
      console.log(error);
      setMintButtonStatus(4);
    }
    setTimeout(() => {
      setMintButtonStatus(0);
    }, 1500);
  };

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  const getUser = async () => {
    const userData = await LS.get(LS_ROOT_KEY);
    setUser(userData);
    console.log(userData);
    return userData;
  }

  useEffect(async () => {
    setWallet(props?.wallet);
    await getUser();
  }, [props?.wallet]);

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
      {isWalletDisconnectedCollection && (
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
              noticeMessage="Wallet connection is not detected. Please connect your wallet to choose from a list of your
               collections."
              noticeActionModal={() => {
                setIsWalletDisconnectedCollection(false);
                setIsOpenSelector(false);
                setLoadingIconSelector(arrowDown);
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
                file={nft}
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
              {nft.raw !== "" && (
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
                        setNFT({ 
                          preview: "", 
                          raw: "", 
                          fileType: "" 
                        });
                        if(document.getElementById("preview-file")) {
                          document.getElementById("preview-file").value = null;
                          setPreview({ 
                            preview: "", 
                            raw: "", 
                            fileType: "" 
                          });
                        }
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

          {/* Collection */}
          <VStack
            width="100%"
            alignment="flex-start"
            padding="0 30px"
            style={{ zIndex: 100 }}
          >
            <TitleBold15 textcolor={({ theme }) => theme.text}>
              Collection
            </TitleBold15>
            <BodyRegular textcolor={({ theme }) => theme.text}>
              Add your NFT to your collection. Choose from previously created collections or create a new one.
            </BodyRegular>

            <HStack>
              <VStack alignment="flex-start" width="100%">
                <HStack
                  background={({ theme }) => theme.backElement}
                  border="6px"
                  height="49px"
                  onClick={toggleCollectionSelector}
                  padding="0 15px"
                >
                  <BodyRegular>
                    {selectedCollection}
                  </BodyRegular>
                  <Spacer></Spacer>
                  <IconImg url={loadingIconSelector} width="15px" height="15px"></IconImg>
                </HStack>

                {isOpenSelector && (
                  <DropDownListContainer>
                    <VStack
                      background={({ theme }) => theme.backElement}
                      border="6px"
                      padding="15px"
                      width="100%"
                      spacing="9px"
                      style={{
                        boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {collections.map((collection) => (
                        <>
                          <ListItem
                            height="43px"
                            border="6px"
                            onClick={onCollectionSelected(collection.name, collection.nickName)}
                            key={Math.random()}
                          >
                            {collection.name}
                          </ListItem>
                        </>
                      ))}
                      <HStack
                        background={({ theme }) => theme.blue}
                        height="43px"
                        padding="0 15px"
                        border="6px"
                        whileTap={{ scale: 0.97 }}
                        onClick={async () => {
                          setSelectedCollection("Create New Collection");
                          setIsOpenSelector(false);
                          setNewCollection(true);
                          getCollectionName();
                          document
                            .getElementsByClassName("collection-url")[0]
                            .setAttribute(
                              "placeholder",
                              name
                            );
                        }}
                        cursor="pointer"
                      >
                        <BodyBold textcolor="white" cursor="pointer">
                          Create New Collection
                        </BodyBold>
                        <IconImg
                          url={addShape}
                          width="21px"
                          height="21px"
                          cursor="pointer"
                        ></IconImg>
                      </HStack>
                    </VStack>
                  </DropDownListContainer>
                )}
              </VStack>
            </HStack>

            {/* Create new collection button  */}
            {newCollection ? (
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
                                setCollectionBanner({ 
                                  preview: "", 
                                  raw: "",
                                  fileType: "" 
                                });
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
                                    setCollectionLogo({ 
                                      preview: "", 
                                      raw: "",
                                      fileType: ""
                                    });
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
                        input={collectionName}
                        propertyKey={"collection-name"}
                        placeholder="Name your Collection"
                        onChange={(event) => {
                          setCollectionName(event.target.value);
                          setCollectionExists(false);
                          setCollectionValid(false);
                          setCollectionEmpty(false);
                          document
                            .getElementsByClassName("collection-url")[0]
                            .setAttribute(
                              "placeholder",
                              event.target.value
                                .replace(/\s+/g, "-")
                            );
                        }}
                        onBlur={async () => {
                          if (collectionName === "") {
                            setLoadingIcon(loading);
                            getCollectionName();
                            setCollectionExists(false);
                            setCollectionEmpty(true);
                            setLoadingIcon(empty);
                          } else {
                            checkCollectionExists(collectionName.replace(/\s+/g, "-"));
                          }
                        }}
                      ></InputStyled>
                      {collectionExists ? (
                        <HStack
                          background={appStyle.colors.softRed}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular
                            textcolor={appStyle.colors.darkRed}
                          >
                            Collection name already taken. Please choose a
                            different name.
                          </CaptionRegular>
                        </HStack>
                      ) : null}
                      {collectionEmpty ? (
                        <HStack
                          background={appStyle.colors.yellow}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular
                            textcolor={appStyle.colors.darkYellow}
                          >
                            Collection name is empty. Collection will be
                            assigned an Untitled Collection name.
                          </CaptionRegular>
                        </HStack>
                      ) : null}
                      {collectionValid ? (
                        <HStack
                          background={appStyle.colors.green}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular
                            textcolor={appStyle.colors.darkGreen}
                          >
                            This collection belongs to you. You can add NFTs
                            to this collection. You can choose the collection from the
                            selector above, or skip to the minting step.
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
            ) : null}
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

// Dropdown Styles

const DropDownListContainer = styled(motion.div)`
  position: absolute;
  top: 52px;
  width: 100%;
  z-index: 10000;
`;

// const DropDownList = styled("ul")`
//   padding: 0;
//   margin: 0;
//   padding-left: 1em;
//   background: #ffffff;
//   border: 2px solid #e5e5e5;
//   box-sizing: border-box;
//   color: #3faffa;
//   font-size: 1.3rem;
//   font-weight: 500;
//   &:first-child {
//     padding-top: 0.8em;
//   }
// `;

const ListItem = styled(HStack)`
  cursor: pointer;

  &:hover {
    background: rgb(0, 0, 0, 0.06);
  }
`;
