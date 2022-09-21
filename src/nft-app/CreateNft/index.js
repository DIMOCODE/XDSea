import React, { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { SendTransaction } from "xdc-connect";
import Xdc3 from "xdc3";
import {
  DEFAULT_PROVIDER,
  HEADER,
  HTTP_METHODS,
  LS,
  LS_ROOT_KEY,
} from "../../constant";
import NFT from "../../abis/NFT.json";
import { nftaddress, nftmarketlayeraddress } from "../../config";
import { fromXdc, isXdc } from "../../common/common";
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
import { createRequest } from "../../API";
import {
  checkCollectionExistsRequest,
  createCollection,
  getCollection,
  getCollections,
} from "../../API/Collection";
import { createNFT, getSignedURLNFT, updateNFT } from "../../API/NFT";
import { isVideo } from "../../common";
import { uploadFileInS3Bucket } from "../../helpers/fileUploader";
import seamless from "../../images/newBlue.png";

function CreateNft(props) {
  const size = useWindowSize();

  const [nft, setNFT] = useState({
    preview: "",
    raw: "",
    fileType: "",
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
  const [isWalletDisconnectedCollection, setIsWalletDisconnectedCollection] =
    useState(false);
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
  const [wallet, setWallet] = useState(null);
  const [minted, setMinted] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [, setShowMenu] = useState(props.showMenu);
  const [scrollTop, setScrollTop] = useState();
  const [scrolling, setScrolling] = useState();
  const [collectionNickName, setCollectionNickName] = useState("");
  const [collectionAllowed, setCollectionAllowed] = useState(false);

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

  /**
   * Initialize the IPFS HTTP Client
   */
  const client = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization: auth,
    },
  });

  /**
   * Filter out all the properties that are blank
   *
   * @returns array of properties with the blank properties removed
   */
  const removeBlankProperties = async () => {
    var filteredProperties = [];
    await Promise.all(
      properties.map((property) => {
        if (property.property !== "" && property.value !== "")
          filteredProperties.push(property);
      })
    );
    return filteredProperties;
  };

  /**
   * Get the list of collections for which the user is the creator
   *
   * @param {*} userData the User DB object
   */
  const fetchCollections = async (userData) => {
    setLoadingIconSelector(loading);
    try {
      setIsCollectionNotSelected(false);
      if (userData.user._id !== undefined) {
        const collectionData = await (
          await getCollections({ userId: userData.user._id })
        ).data;
        setCollections(collectionData.collections);
      } else {
        setIsWalletDisconnectedCollection(true);
        setCollections([]);
      }
      setLoadingIconSelector(arrowDown);
    } catch (err) {
      setIsWalletDisconnectedCollection(true);
    }
  };

  /**
   * Show the list of collections created by the user
   */
  const toggleCollectionSelector = async () => {
    const userData = await getUser();
    if (!isOpenSelector && collections.length == 0)
      await fetchCollections(userData);
    setIsOpenSelector(!isOpenSelector);
  };

  /**
   * Set the selected collection as the state value
   *
   * @param {string} value the name of the selected collection
   * @param {string} nickName the nickname of the selected collection
   */
  const onCollectionSelected = (value, nickName) => {
    setSelectedCollection(value);
    setIsOpenSelector(false);
    setNewCollection(false);
    setIsCollectionNotSelected(false);
    setCollection(value);
    setCollectionNickName(nickName);
  };

  /**
   * Get the user's information
   *
   * @returns the user DB object
   */
  const getUser = async () => {
    const userData = await LS.get(LS_ROOT_KEY);
    setUser(userData);
    return userData;
  };

  /**
   * Get the default untitled collection name when the collection name input is empty
   */
  const getCollectionName = async () => {
    setLoadingIcon(loading);
    const tokenData = await (
      await createRequest(HTTP_METHODS.get, "nft/higher", null, null)
    ).data.higher.tokenId;
    setCollectionName(`Untitled Collection ${tokenData + 1}`);
    setCollectionExists(false);
    setCollectionEmpty(true);
    if (document.getElementsByClassName("collection-url")[0])
      document
        .getElementsByClassName("collection-url")[0]
        .setAttribute(
          "placeholder",
          `Untitled Collection ${tokenData + 1}`.replace(/\s+/g, "-")
        );
    setLoadingIcon(empty);
  };

  /**
   * Check if the user entered collection name is available for their use
   *
   * @param {string} collectionName the collection name entered by the user
   * @returns true if the collection exists with the collection object, false if
   *            it does not exist
   */
  const checkCollectionExists = async (collectionName) => {
    setLoadingIcon(loading);
    const collectionData = await (
      await checkCollectionExistsRequest(collectionName)
    ).data;
    if (collectionData.alreadyExist) {
      if (collectionData.collection.creator._id === user.user._id) {
        setCollectionExists(false);
        setCollectionValid(true);
        setCollectionAllowed(false);
        setCollectionEmpty(false);
      } else {
        setCollectionExists(true);
        setCollectionValid(false);
        setCollectionAllowed(false);
        setCollectionEmpty(false);
      }
      setLoadingIcon(empty);
      setCollectionNickName(collectionNickName);
      return true;
    } else {
      setCollectionAllowed(true);
      setCollectionExists(false);
      setCollectionValid(false);
      setCollectionEmpty(false);
      setLoadingIcon(empty);
      return false;
    }
  };

  /**
   * Update the state with the uploaded NFT asset
   *
   * @param {*} event the change event for the input element
   */
  const handleChangeUploadMultimedia = (event) => {
    setIsAssetEmpty(false);
    if (event.target.files.length) {
      setNFT({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
        fileType: event.target.files[0].type,
      });
    }
  };

  /**
   * Update the state with the uploaded preview image
   *
   * @param {*} event the change event for the input element
   */
  const handleChangeUploadMultimediaPreview = (event) => {
    if (event.target.files.length) {
      setPreview({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
        fileType: event.target.files[0].type,
      });
    }
  };

  /**
   * Update the state with the uploaded Collection Banner
   *
   * @param {*} event the change event for the input element
   */
  const handleChangeUploadMultimediaCollection = (event) => {
    if (event.target.files.length) {
      setCollectionBanner({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
        fileType: event.target.files[0].type,
      });
    }
  };

  /**
   * Update the state with the uploaded Collection Logo
   *
   * @param {*} event the change event for the input element
   */
  const handleChangeUploadMultimediaLogo = (event) => {
    if (event.target.files.length) {
      setCollectionLogo({
        preview: URL.createObjectURL(event.target.files[0]),
        raw: event.target.files[0],
        fileType: event.target.files[0].type,
      });
    }
  };

  /**
   * Clear the form of all the information
   */
  const clearForm = async () => {
    setNFT({
      preview: "",
      raw: "",
      fileType: "",
    });
    document.getElementById("upload-button").value = null;
    setIsAssetEmpty(false);
    setPreview({
      preview: "",
      raw: "",
      fileType: "",
    });
    if (document.getElementById("preview-file"))
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
      fileType: "",
    });
    if (document.getElementById("upload-button-collection"))
      document.getElementById("upload-button-collection").value = null;
    setCollectionLogo({
      preview: "",
      raw: "",
      fileType: "",
    });
    if (document.getElementById("upload-button-logo"))
      document.getElementById("upload-button-logo").value = null;
    setInstagramLink("");
    setTwitterLink("");
    setDiscordLink("");
    setWebsiteLink("");
    getCollectionName();
    setCollectionEmpty(false);
    setCollectionExists(false);
    setCollectionValid(false);
    setCollectionAllowed(false);
    setIsCollectionNotSelected(false);
    setCollection("");
    setCollectionName("");
    setCollectionDescription("");
    setPreviewURL("");
    setAssetURL("");
    setModalAlert(false);
    setMintButtonStatus(0);
  };

  /**
   * Upload the NFT asset to IPFS
   *
   * @returns the IPFS URL for the asset uploaded
   */
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

  /**
   * Upload the Collection Banner to IPFS (to be changed to an s3 bucket)
   *
   * @returns the IPFS URL for the banner uploaded
   */
  const addToIPFSCollectionBanner = async () => {
    setUploadBannerStatus(true);
    if (collectionBanner.raw !== "") {
      const file = document.getElementById("upload-button-collection").files[0];
      try {
        const added = await client.add(file);
        const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
        setUploadBannerStatus(false);
        return url;
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    } else return "";
  };

  /**
   * Upload the Collection Logo to IPFS (to be changed to an s3 bucket)
   *
   * @returns the IPFS URL for the logo uploaded
   */
  const addToIPFSCollectionLogo = async () => {
    setUploadLogoStatus(true);
    if (collectionLogo.raw !== "") {
      const file = document.getElementById("upload-button-logo").files[0];
      try {
        const added = await client.add(file);
        const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
        setUploadLogoStatus(false);
        return url;
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    } else return "";
  };

  /**
   * Upload the preview of the NFT asset to IPFS
   *
   * @returns the IPFS URL for the preview image uploaded
   */
  const addToIPFSPreview = async () => {
    setUploadPreviewStatus(true);
    if (preview.raw !== "") {
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
    } else return "";
  };

  /**
   * Check if the royalty percentage is set and if not the user is aware
   * that 0% royalty will be charged
   */
  const checkRoyalty = async () => {
    if (royalty === 0) {
      setRoyaltyAlert(true);
    } else {
      setRoyaltyAlert(false);
      mintNFT();
    }
  };

  /**
   * Upload the NFT Metadata to the IPFS after checking the required fields are
   * filled
   */
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
          } else {
            const filteredProperties = await removeBlankProperties();
            setProperties(filteredProperties);
            const nftUrl = await addToIPFS();
            const previewUrl = await addToIPFSPreview();

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
                const added = await client.add(uploadData);
                const url = `https://xdsea.infura-ipfs.io/ipfs/${added.path}`;
                updateMarketplace(url, nftUrl, filteredProperties);
              } catch (error) {
                console.log(error);
                setMintButtonStatus(4);
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

  /**
   * Mint the NFT, update the marketplace ledger with the NFT, and update the DB with
   * the new NFT
   *
   * @param {string} url url of the NFT metadata uploaded
   * @param {string} nftUrl url of the NFT asset
   * @param {*} filteredProperties list of properties with blank properties removed
   */
  const updateMarketplace = async (url, nftUrl, filteredProperties) => {
    try {
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
      var nftCreation = {};
      if (newCollection && !collectionExists) {
        const bannerUrl = await addToIPFSCollectionBanner();
        const logoUrl = await addToIPFSCollectionLogo();
        const collectionCreation = await (
          await createCollection(
            collectionName,
            user.XDCWallets[0],
            collectionDescription,
            logoUrl,
            bannerUrl,
            twitterLink,
            instagramLink,
            discordLink,
            websiteLink
          )
        ).data.collection;
        nftCreation = await (
          await createNFT(
            collectionCreation._id,
            tokenId,
            isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address,
            nftmarketlayeraddress,
            price,
            royalty,
            name,
            description,
            nftUrl,
            nft.fileType,
            previewURL,
            filteredProperties
          )
        ).data.nft;
      } else {
        const collectionId = await (
          await getCollection(collectionNickName)
        ).data.collection._id;
        nftCreation = await (
          await createNFT(
            collectionId,
            tokenId,
            isXdc(wallet?.address) ? fromXdc(wallet?.address) : wallet?.address,
            price,
            royalty,
            name,
            description,
            nftUrl,
            nft.fileType,
            previewURL,
            filteredProperties
          )
        ).data.nft;
      }
      if (isVideo(nft.fileType)) {
        const success = await uploadFileInS3Bucket(
          nft.raw,
          "nft",
          "urlFile",
          nftCreation._id
        );
        console.log("update s3 result: ", success, nftCreation._id);
      }
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

  useEffect(async () => {
    window.scrollTo(0, 0);
    setWallet(props?.wallet);
    await getUser();
  }, [props?.wallet]);

  /**
   * Scroll listeners to close the menu on scroll
   */
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
    <CreationSection>
      {/* Wallet not connected alert modal triggered when trying to mint without connecting the wallet */}
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
      {/* Wallet not connected alert modal triggered when trying to get a list of created collections 
        without connecting the wallet */}
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
      {/* Alert modal to confirm if the user wants to clear all fields */}
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
      {/* Alert modal to confirm if the user wants to choose 0% royalty being 
        charged for the NFT */}
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
      {/* Successfully minted modal showing the newly minted NFT */}
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
                props.redirect(`nft/${nftaddress}/${tokenId}`);
              }}
            ></TxModal>
          </VStack>
        </FadedBack>
      )}

      {/* Create NFT Page Banner */}
      <HStack
        id={"creation-banner"}
        padding="69px 0 0 0 "
        backgroundimage={seamless}
      >
        <HStack width="1200px" height="157px" padding="0px 30px">
          <TitleBold27 textcolor={appStyle.colors.white}>
            Create an NFT
          </TitleBold27>
        </HStack>
      </HStack>
      <ContentCreation>
        <VStack spacing="51px">
          <HStack padding="0 39px" spacing="69px" responsive={true}>
            {/* Upload NFT Asset Upload Box */}
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
                          fileType: "",
                        });
                        if (document.getElementById("preview-file")) {
                          document.getElementById("preview-file").value = null;
                          setPreview({
                            preview: "",
                            raw: "",
                            fileType: "",
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

            {/* NFT Name Input Field */}
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
                textplace={"rgba(0,0,0,0.6)"}
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

              {/* NFT Description Input Field */}
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
                textColor={({ theme }) => theme.text}
                background={({ theme }) => theme.backElement}
              ></TextAreaStyled>

              {/* NFT Price Input Field */}
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
                textplace={"rgba(0,0,0,0.6)"}
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
            {/* NFT Properties Input Fields */}
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
                  background={({ theme }) => theme.blue}
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
              {/* NFT Royalty Input Field */}
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
                  textplace={"rgba(0,0,0,0.6)"}
                ></InputStyled>
              </VStack>

              {/* NFT Unlockable Content Input Field */}
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
                    textplace={"rgba(0,0,0,0.6)"}
                  ></InputStyled>
                ) : null}
                <ButtonApp
                  btnStatus={0}
                  icon={lock}
                  background={({ theme }) => theme.blue}
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
              Add your NFT to your collection. Choose from previously created
              collections or create a new one.
            </BodyRegular>

            {/* Collection Name Selector */}
            <HStack style={{ zIndex: "1" }}>
              <VStack alignment="flex-start" width="100%">
                <HStack
                  background={({ theme }) => theme.backElement}
                  border="6px"
                  height="49px"
                  onClick={toggleCollectionSelector}
                  padding="0 15px"
                >
                  <BodyRegular>{selectedCollection}</BodyRegular>
                  <Spacer></Spacer>
                  <IconImg
                    url={loadingIconSelector}
                    width="15px"
                    height="15px"
                  ></IconImg>
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
                            onClick={() =>
                              onCollectionSelected(
                                collection.name,
                                collection.nickName
                              )
                            }
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
                            .setAttribute("placeholder", name);
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

            {/* Create new collection section */}
            {newCollection ? (
              <>
                <HStack responsive={true} spacing="0px" alignment="flex-start">
                  <VStack width="100%" padding="30px" spacing="150px">
                    {/* Collection Banner Upload Box */}
                    <VStack>
                      <TitleBold15>
                        Upload Banner and Collection Image
                      </TitleBold15>
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
                                  fileType: "",
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
                        {/* Collection Logo Upload Image */}
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
                                      fileType: "",
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

                    {/* Collection Social Links */}
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
                    {/* Collection Name Input Field */}
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
                          setCollectionAllowed(false);
                          document
                            .getElementsByClassName("collection-url")[0]
                            .setAttribute(
                              "placeholder",
                              event.target.value.replace(/\s+/g, "-")
                            );
                        }}
                        onBlur={async () => {
                          if (collectionName === "") {
                            setLoadingIcon(loading);
                            getCollectionName();
                            setCollectionExists(false);
                            setCollectionEmpty(true);
                            setCollectionAllowed(false);
                            setCollectionValid(false);
                            setLoadingIcon(empty);
                          } else {
                            checkCollectionExists(collectionName);
                          }
                        }}
                        textplace={"rgba(0,0,0,0.6)"}
                      ></InputStyled>
                      {collectionExists ? (
                        <HStack
                          background={appStyle.colors.softRed}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular textcolor={appStyle.colors.darkRed}>
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
                          <CaptionRegular textcolor={appStyle.colors.darkGreen}>
                            This collection belongs to you. You can add NFTs to
                            this collection. You can choose the collection from
                            the selector above, or skip to the minting step.
                          </CaptionRegular>
                        </HStack>
                      ) : null}
                      {collectionAllowed ? (
                        <HStack
                          background={appStyle.colors.green}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular textcolor={appStyle.colors.darkGreen}>
                            This collection name is available.
                          </CaptionRegular>
                        </HStack>
                      ) : null}
                    </VStack>

                    {/* Collection Link Display TextBox */}
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
                        textColor={({ theme }) => theme.text}
                        background={({ theme }) => theme.backElement}
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
              <IconImg url={xdc} width="45px" height="45px"></IconImg>

              {/* Blockchain Icon (would be a selector when more blockchains added) */}
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
              {/* Clear Form Button */}
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

              {/* Mint Button */}
              <ButtonApp
                buttonId="mint-button"
                text="Mint your NFT"
                btnStatus={mintButtonStatus}
                func={"Mint"}
                height="39px"
                width="100%"
                background={({ theme }) => theme.blue}
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
  padding: 0px 0;
  width: 100%;
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

const ListItem = styled(HStack)`
  cursor: pointer;

  &:hover {
    background: rgb(0, 0, 0, 0.06);
  }
`;
