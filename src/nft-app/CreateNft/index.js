import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  Component,
  Fragment,
  useRef,
} from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { GetWallet, SendTransaction } from "xdc-connect";
import Xdc3 from "xdc3";
import { DEFAULT_PROVIDER } from "../../constant";
import NFT from "../../abis/NFT.json";
import NFTMarket from "../../abis/NFTMarket.json";
import {
  nftaddress,
  nftmarketaddress,
  nftmarketlayeraddress,
} from "../../config";
import { fromXdc, isXdc } from "../../common/common";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json";

import styled from "styled-components";
import { Divider, HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionRegular,
  TitleBold15,
  TitleBold27,
} from "../../styles/TextStyles";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion/dist/framer-motion";
import { appStyle } from "../../styles/AppStyles";
import CreationBar from "../../images/DiscoverBar.png";

import { InputStyled } from "../../styles/InputStyled";
import xdc from "../../images/miniXdcLogo.png";
import imageTest from "../../images/imageTest.jpg";
import { TextAreaStyled } from "../../styles/TextAreaStyled";
import ButtonApp from "../../styles/Buttons";
import { PropertyValue } from "../../styles/PropertyValue";
import percent from "../../images/percent.png";
import { SelectStyled } from "../../styles/SelectStyled";
import lock from "../../images/lock.png";
import { UploadMultimedia } from "../../styles/UploadMultimedia";
import xinfinLogo from "../../images/xinfinLogo.png";
import useWindowSize from "../../styles/useWindowSize";
import { useHistory } from "react-router-dom";
import { InputStyledURL } from "../../styles/InputStyledURL";
import { InputStyledLink } from "../../styles/InputStyledLink";
import instagramIcon from "../../images/instagramMini.png";
import twitterIcon from "../../images/twitter.png";
import telegramIcon from "../../images/telegram.png";
import warning from "../../images/alert.png";
import coverAudio from "../../images/coverAudio.png";
import discordIcon from "../../images/discordIcon.png";
import linkIcon from "../../images/link.png";
import loading from "../../images/loadingDots.gif";
import empty from "../../images/empty.png";
import { ConfirmationModal } from "../../ConfirmationModal";
import { TxModal } from "../../styles/TxModal";
import { PushSpinner } from "react-spinners-kit";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

function CreateNft(props) {
  const history = useHistory();

  function NavigateTo(route) {
    history.push(`/${route}`);
  }

  const [uploadBannerStatus, setUploadBannerStatus] = useState(false);
  const [uploadLogoStatus, setUploadLogoStatus] = useState(false);
  const [uploadPreviewStatus, setUploadPreviewStatus] = useState(false);
  const [uploadNFT, setUploadNFT] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [royalty, setRoyalty] = useState(0);
  const [collection, setCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const [isNewCollection, setNewCollection] = useState(false);
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
  const [preview, setPreview] = useState({ preview: "", raw: "", fileType: "" });
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
  const [creator, setCreator] = useState(null);
  const [assetURL, setAssetURL] = useState("");
  const [collectionBannerURL, setCollectionBannerURL] = useState("");
  const [collectionLogoURL, setCollectionLogoURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");

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
    try{
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setPreviewURL(url);
      setUploadPreviewStatus(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  }

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
  }

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
    setAssetURL("");
    setFile({ preview: "", raw: "", fileType: "" });
    setName("");
    setDescription("");
    setPrice(0.00001);
    setProperties([]);
    setRoyalty(0);
    setIsUnlockableContent(false);
    setUnlockableContent("");
    setCollection("");
    setNewCollection(false);
    setCollectionBanner({ preview: "", raw: "" });
    setCollectionLogo({ preview: "", raw: "" });
    setCollectionDescription("");
    setInstagramLink("");
    setTwitterLink("");
    setDiscordLink("");
    setWebsiteLink("");
    setModalAlert(false);
    setRoyaltyAlert(false);
  };

  const fetchCollection = async () => {
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    try {
      const data = await marketContract.methods
        .fetchItemsCreated(
          isXdc(props?.wallet?.address)
            ? fromXdc(props?.wallet?.address)
            : props?.wallet?.address
        )
        .call();
      var uniqueCollections = [];
      const creations = await Promise.all(
        data.map(async (i) => {
          if (!uniqueCollections.includes(i.collectionName))
            uniqueCollections.push(i.collectionName);
        })
      );
      setCollections(uniqueCollections);
    } catch (e) {
      console.log(e.message);
    }
  };

  const checkCollectionExists = async () => {
    setLoadingIcon(loading);
    const collectionName =
      document.getElementsByClassName("collection-name")[0].value;
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const tokenCount = await marketContract.methods.tokenCount().call();
    const collectionData = await marketContract.methods
      .fetchCollections()
      .call();
    var uniqueCollections = [];
    const collections = await Promise.all(
      collectionData.map(async (i) => {
        uniqueCollections.push(i.collectionName);
      })
    );
    if (uniqueCollections.includes(collectionName)) {
      setCollectionExists(true);
      setLoadingIcon(empty)
      return true;
    }
    else {
      setCollectionExists(false);
      setCollectionEmpty(false);
    }
    setLoadingIcon(empty);

    return false;
  };

  const mintNFT = async () => {
    setRoyaltyAlert(false);
    
    if(file.raw === "") {
      setIsAssetEmpty(true);
      document.getElementById("nft-asset").scrollIntoView();
    }
    else {
      if(name === "") {
        setIsNameEmpty(true);
        document.getElementById("creation-banner").scrollIntoView();
      }
      else {
        if(price === 0) {
          setIsPriceZero(true);
          document.getElementsByClassName("nft-description")[0].scrollIntoView();
        }
        else {
          if(document.getElementsByClassName("nft-collection")[0].value === "") {
            setIsCollectionNotSelected(true);
            document.getElementById("nft-unlockable").scrollIntoView();
          }
          else {
            setMintButtonStatus(1);
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
            const marketContract = new xdc3.eth.Contract(
              NFTMarketLayer1.abi,
              nftmarketlayeraddress,
              xdc3
            );
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress);
            if(props?.wallet?.connected) {
              try{
                const check = await checkCollectionExists();
                if(check) {
                  
                  const collectionData = await marketContract.methods.fetchCollection(document.getElementsByClassName("collection-name")[0].value).call();
                  if(collectionData.creator === (isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address)) {
                    setCollectionExists(false);                    
                    const collectionUri = await nftContract.methods
                      .tokenURI(collectionData.tokenId)
                      .call();
                    var collectionMetadata = await axios.get(collectionUri);
                    setCollectionBannerURL(collectionMetadata?.data?.collection?.banner);
                    setCollectionLogoURL(collectionMetadata?.data?.collection?.logo);
                    setCollectionDescription(collectionMetadata?.data?.collection?.description);
                    setInstagramLink(collectionMetadata?.data?.collection?.instagramUrl);
                    setTwitterLink(collectionMetadata?.data?.collection?.twitterUrl);
                    setDiscordLink(collectionMetadata?.data?.collection?.discordUrl);
                    setWebsiteLink(collectionMetadata?.data?.collection?.websiteUrl);
                    const uploadData = JSON.stringify({
                      collection: {
                        name: document.getElementById("collection-name-input").value,
                        description: collectionMetadata?.data?.collection?.description,
                        creator: isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address,
                        banner: collectionMetadata?.data?.collection?.banner,
                        logo: collectionMetadata?.data?.collection?.logo,
                        twitterUrl: collectionMetadata?.data?.collection?.twitterUrl,
                        instagramUrl: collectionMetadata?.data?.collection?.instagramUrl,
                        discordUrl: collectionMetadata?.data?.collection?.discordUrl,
                        websiteUrl: collectionMetadata?.data?.collection?.websiteUrl,
                        nft:{
                            name,
                            description,
                            owner: isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address,
                            image: assetURL,
                            unlockableContent,
                            properties: properties,
                            royalty: royalty,
                            fileType: file.fileType,
                            preview: previewURL
                        }
                      }
                    })
                    console.log(uploadData);
                    const added = await client.add(uploadData)
                    const url = `https://ipfs.infura.io/ipfs/${added.path}`
                    updateMarketplace(url);
                  }
                  else {
                    document.getElementsByClassName("nft-collection")[0].scrollIntoView();
                    return;
                  }
                }
                else{
                  const uploadData = JSON.stringify({
                    collection: {
                      name: document.getElementById("collection-name-input").value,
                      description: collectionDescription,
                      creator: isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address,
                      banner: collectionBannerURL,
                      logo: collectionLogoURL,
                      twitterUrl: twitterLink,
                      instagramUrl: instagramLink,
                      discordUrl: discordLink,
                      websiteUrl: websiteLink,
                      nft:{
                          name,
                          description,
                          owner: isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address,
                          image: assetURL,
                          unlockableContent,
                          properties: properties,
                          royalty: royalty,
                          fileType: file.fileType,
                          preview: previewURL
                      }
                    }
                  })
                  console.log(uploadData);
                  const added = await client.add(uploadData);
                  const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                  updateMarketplace(url);
                }
              } catch (error) {
                console.log(error);
                setMintButtonStatus(4);
                return;
              }
            }
            else {
              setIsWalletDisconnected(true);
              setMintButtonStatus(4);
            }
          }
        }
      }
    }
  }

  const updateMarketplace = async (url) => {
    try {
        const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));

        const contract = new xdc3.eth.Contract(NFT.abi, nftaddress, isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address);
        let data = contract.methods.createToken(url).encodeABI();

        const tx = {
            from: isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address,
            to: nftaddress,
            data
        };
        let gasLimit = await xdc3.eth.estimateGas(tx);

        tx["gas"] = gasLimit

        let transaction = await SendTransaction(tx)

        setMintButtonStatus(2);

        var txReceipt = await xdc3.eth.getTransactionReceipt(transaction.transactionHash)
        var tokenId = await txReceipt.logs[0].topics[3]

        const weiprice = await xdc3.utils.toWei(price, "ether");

        const contract2 = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address);
        data = contract2.methods.createMarketItem(
          Number(tokenId), 
          0, 
          isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address, 
          isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address, 
          weiprice, 
          false, 
          royalty, 
          1, 
          name, 
          collection
        ).encodeABI()

        const tx2 = {
            from: isXdc(props?.wallet?.address) ? fromXdc(props?.wallet?.address) : props?.wallet?.address,
            to: nftmarketlayeraddress,
            value: "",
            data
        }

        gasLimit = await xdc3.eth.estimateGas(tx2);

        tx2["gas"] = gasLimit;

        transaction = await SendTransaction(tx2);
        setMintButtonStatus(3);
    } catch (error) {
        console.log(error)
        setMintButtonStatus(4);
    }
  }

  const checkRoyalty = function(){
    if(royalty === 0) {
      setRoyaltyAlert(true);
    }
    else{
      setRoyaltyAlert(false);
      mintNFT();
    }
  }

  useEffect(() => {
    fetchCollection();
  }, []);

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

            {/* <TxModal
              isOffer={true}
              cancelOffer=""
              placeOffer=""
              onChange=""
              offerPrice=""
            ></TxModal> */}

            {/* <TxModal isProcessing={true}></TxModal> */}

            {/* <TxModal
              isPurchaised={true}
              PurchaisedNftName="Amazing Plug #001"
              ListedImage={imageTest}
              cancelBtnPurchaise=""
              confirmBtnPurchaise=""
            ></TxModal> */}

            {/* <TxModal
              isList={true}
              ListedNftName="Amazing Woman #001"
              ListedImage={imageTest}
              cancelBtnList=""
              confirmBtnList=""
            ></TxModal> */}
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

      <HStack id={"creation-banner"} backgroundimage={CreationBar}>
        <HStack width="1200px" height="157px" padding="0px 30px">
          <TitleBold27 textcolor={appStyle.colors.white}>
            Create an NFT
          </TitleBold27>
        </HStack>
      </HStack>
      <ContentCreation>
        {/* Creation Content */}

        <VStack spacing="51px">
          <HStack padding="0 39px" spacing="69px" responsive={true}>
            {/* Preview Square */}
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
                // Revisar aqui
                button={"upload-button"}
                secondaryButton={"preview-file"}
                isUploading={uploadNFT}
                secondaryUploading={uploadPreviewStatus}
                onClickSecondary={() => {
                  document.getElementById("preview-file").value = null;
                  setPreview({ preview: "", raw: "", fileType: "" })
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
                    ></ButtonApp>
                    <Spacer></Spacer>
                    {/* <ButtonApp
                      onClick={() =>
                        setFile({ preview: "", raw: "", fileType: "" })
                      }
                      background={appStyle.colors.cleanGray}
                      width="180px"
                      height="39px"
                    ></ButtonApp>*/}

                    {/* btnStatus, 0 is default, 1 is uploading, 2 is success, 3 is failed */}

                    {/* <ButtonApp
                      text="Upload"
                      btnStatus={0}
                      textcolor={appStyle.colors.white}
                      onClick={addToIPFS}
                      width="180px"
                      height="39px"
                    ></ButtonApp> */}
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
                    Asset cannot be empty.
                    Please upload an asset before proceeding with the minting process.
                  </CaptionRegular>
                </HStack>
              ) : null}
            </VStack>

            {/* Form with Name, Description and Price */}
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
                    Name cannot be empty.
                    Please choose a name for your asset before proceeding with the minting process.
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
                  if(isNaN(parseFloat(price)) && price !== 0)
                    setIsPriceInvalid(true);
                  else
                    setIsPriceInvalid(false);
                }}
              ></InputStyled>
              {isPriceInvalid ? (
                <HStack
                  background={appStyle.colors.softRed}
                  padding="6px 15px"
                  border="6px"
                >
                  <CaptionRegular textcolor={appStyle.colors.darkRed}>
                    The input in the price field is not a number. Please 
                    use numeric characters with a maximum of one decimal point only.
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
                    Price cannot be zero.
                    Please set a price for your asset before proceeding with the minting process.
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
            {/* Properties */}
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
                {/* Value variables are "Property" and "Value", user can add or erase as many they wish */}
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
                ></ButtonApp>
                <ButtonApp
                  height="39px"
                  width={size.width < 768 ? "100%" : "44%"}
                  text="Add"
                  textcolor={appStyle.colors.white}
                  onClick={() =>
                    setProperties([...properties, { property: "", value: "" }])
                  }
                ></ButtonApp>
              </HStack>
            </VStack>

            {/* Royalties, Collection Selector and Unlockables */}
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
                  icon={lock}
                  buttonId = {"nft-unlockable"}
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
              If your NFT belongs to any collection, please choose one
            </BodyRegular>
            <SelectStyled
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
            ></SelectStyled>
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
          {isNewCollection ? (
            <>
              <HStack responsive={true} spacing="0px" alignment="flex-start">
                <VStack width="100%" padding="30px" spacing="150px">
                  {/* Banner Image */}
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
                              document.getElementById("upload-button-collection").value = null;
                              setCollectionBanner({ preview: "", raw: "" })
                            }}
                            background={({ theme }) => theme.backElement}
                            width="81px"
                            height="36px"
                          ></ButtonApp>
                          <Spacer></Spacer>
                          {/* <ButtonApp
                            text="Upload"
                            textcolor={appStyle.colors.white}
                            onClick={addToIPFSCollectionBanner}
                            width="81px"
                            height="36px"
                          ></ButtonApp> */}
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
                                text="Clear"
                                textcolor={({ theme }) => theme.text}
                                onClick={() => {
                                  document.getElementById("upload-button-logo").value = null;
                                  setCollectionLogo({ preview: "", raw: "" })
                                }}
                                background={({ theme }) => theme.backElement}
                                width="81px"
                                height="36px"
                              ></ButtonApp>

                              {/* <ButtonApp
                                text="Upload"
                                textcolor={appStyle.colors.white}
                                onClick={addToIPFSCollectionLogo}
                                width="81px"
                                height="36px"
                              ></ButtonApp>*/}
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

                {/* Collection Name  URL and Description */}
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
                        document
                          .getElementsByClassName("collection-url")[0]
                          .setAttribute(
                            "placeholder",
                            event.target.value.replace(/\s+/g, "%20")
                          );
                      }}
                      onBlur={() => checkCollectionExists()}
                    ></InputStyled>
                    {collectionExists ? (
                      <HStack
                        background={appStyle.colors.yellow}
                        padding="6px 15px"
                        border="6px"
                      >
                        <CaptionRegular textcolor={appStyle.colors.darkYellow}>
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
                        <CaptionRegular textcolor={appStyle.colors.darkYellow}>
                          Collection name is empty. Collection will be assigned an Untitled Collection name.
                        </CaptionRegular>
                      </HStack>
                    ) : null}

                    {/* {collectionExists ? (
                      <>
                        <HStack
                          background={appStyle.colors.yellow}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular
                            textcolor={appStyle.colors.darkYellow}
                          >
                            Collection name already taken. Please choose a
                            different name.
                          </CaptionRegular>
                        </HStack>
                      </>
                    ) : (
                      <>
                        <HStack
                          background={appStyle.colors.softGreen}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular textcolor={appStyle.colors.darkGreen}>
                            Collection Name Available
                          </CaptionRegular>
                        </HStack>

                        <HStack
                          background={appStyle.colors.softRed}
                          padding="6px 15px"
                          border="6px"
                        >
                          <CaptionRegular textcolor={appStyle.colors.darkRed}>
                            Error Message for Inputs
                          </CaptionRegular>
                        </HStack>
                      </>
                    )} */}
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
          <Divider></Divider>

          {/* Blockchain and Mint Button */}
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
              ></ButtonApp>
              <ButtonApp
                buttonId="mint-button"
                text="Mint your NFT"
                btnStatus={mintButtonStatus}
                height="39px"
                width="100%"
                textcolor={appStyle.colors.white}
                onClick={checkRoyalty}
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

//         this.state = {
//             fileUrl: null,
//             file: null,
//             name: "",
//             price: 0,
//             description: "",
//             hasUnlockableContent: false,
//             unlockableContent: "",
//             hasProperties: false,
//             properties: [{ property: "", value : "" }],
//             collection: "",
//             collectionDescription: "",
//             creator: "",
//             collectionBannerUrl: null,
//             collectionLogoUrl: null,
//             twitterUrl: "",
//             instagramUrl: "",
//             discordUrl: "",
//             websiteUrl: "",
//             royalty: 0,
//             existingCollection: false,
//             ownedCollections: false,
//             mintSuccess: false,
//             nftContract: "",
//             nftItemID: "",
//             uploading: false,
//             minting: false,
//             updatingLedger: false,
//             ownedCollection: null,
//             uploadProgress: 0.00,
//             uploadFailure: false,
//             mintFailure: false,
//             previewUrl: ""
//         }
//     }

//     isImage = (file) => {
//         return !!file?.type.match('image.*');
//     }

//     isVideo = (file) => {
//         return !!file?.type.match('video.*');
//     }

//     isAudio = (file) => {
//         return !!file?.type.match('audio.*');
//     }

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
