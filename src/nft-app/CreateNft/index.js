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
import discordIcon from "../../images/discordIcon.png";
import linkIcon from "../../images/link.png";
import loading from "../../images/loading.gif";
import { ConfirmationModal } from "../../ConfirmationModal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

function CreateNft(props) {
  const history = useHistory();

  function NavigateTo(route) {
    history.push(`/${route}`);
  }
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadBannerStatus, setUploadBannerStatus] = useState(false);
  const [uploadLogoStatus, setUploadLogoStatus] = useState(false);
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
  });
  const [collectionLogo, setCollectionLogo] = useState({
    preview: "",
    raw: "",
  });
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionExists, setCollectionExists] = useState(false);
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
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [modalAlert, setModalAlert] = useState(false);

  const size = useWindowSize();

  const addToIPFS = async (e) => {
    setUploadNFT(true);
    e.preventDefault();
    const file = document.getElementById("upload-button").files[0];
    try {
      const added = await client.add(file);
      setUploadNFT(false);

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setUploadStatus(true);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSCollectionBanner = async (e) => {
    setUploadBannerStatus(true);
    e.preventDefault();
    const file = document.getElementById("upload-button-collection").files[0];
    try {
      const added = await client.add(file);

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setUploadBannerStatus(true);
      s;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const addToIPFSCollectionLogo = async (e) => {
    setUploadLogoStatus(true);
    e.preventDefault();
    const file = document.getElementById("upload-button-logo").files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setUploadLogoStatus(false);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const handleChangeUploadMultimedia = (e) => {
    console.log(e.target.files);
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleChangeUploadMultimediaCollection = (e) => {
    if (e.target.files.length) {
      setCollectionBanner({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleChangeUploadMultimediaLogo = (e) => {
    if (e.target.files.length) {
      setCollectionLogo({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const clearForm = async () => {
    setImage({ preview: "", raw: "" });
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
  };

  //     createMarket = async () => {
  //         try {
  //             this.setState({minting: true})
  //             const wallet = await GetWallet()
  //             var name = this.state.name
  //             var description = this.state.description
  //             var price = this.state.price
  //             var fileUrl = this.state.fileUrl
  //             var unlockableContent = this.state.unlockableContent
  //             var properties = this.state.properties
  //             this.setState({creator: isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address})

  //             const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
  //             // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
  //             const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
  //             const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

  //             // const data = await marketContract.methods.fetchCollections().call()
  //             // const collections = await Promise.all(data.map(async i => {
  //             //     const uri = await nftContract.methods.tokenURI(i.tokenId).call()
  //             //     var metadata = await axios.get(uri)
  //             //     let collection = {
  //             //         name: metadata?.data?.collection?.name,
  //             //         description: metadata?.data?.collection?.description,
  //             //         creator: metadata?.data?.collection?.creator,
  //             //         banner: metadata?.data?.collection?.banner,
  //             //         logo: metadata?.data?.collection?.logo,
  //             //         twitterUrl: metadata?.data?.collection?.twitterUrl,
  //             //         instagramUrl: metadata?.data?.collection?.instagramUrl,
  //             //         discordUrl: metadata?.data?.collection?.discordUrl,
  //             //         websiteUrl: metadata?.data?.collection?.websiteUrl,
  //             //     }
  //             //     return collection
  //             // }))
  //             // this.setState({collections: collections})

  //             const tokenCount = await marketContract.methods.tokenCount().call()
  //             var collection = this.state.collection == "" || this.state.collection == undefined
  //                                 ? `Untitled Collection ${tokenCount}` : this.state.collection

  //             this.setState({collection: collection})

  //             var bannerFile = null
  //             await fetch("/Untitled Collection.svg")
  //             .then(response => response.text())
  //             .then(data => {
  //                 bannerFile = new File([data], "Untitled Collection")
  //             });

  //             if(this.state.ownedCollection !== null){
  //                 this.setState({
  //                     collection: this.state.ownedCollection.name,
  //                     collectionDescription: this.state.ownedCollection.description,
  //                     creator: this.state.ownedCollection.creator,
  //                     collectionBannerUrl: this.state.ownedCollection.banner,
  //                     collectionLogoUrl: this.state.ownedCollection.logo,
  //                     twitterUrl: this.state.ownedCollection.twitterUrl,
  //                     instagramUrl: this.state.ownedCollection.instagramUrl,
  //                     discordUrl: this.state.ownedCollection.discordUrl,
  //                     websiteUrl: this.state.ownedCollection.websiteUrl,
  //                 })
  //             }

  //             if(this.state.collectionBannerUrl == null && !this.state.existingCollection) {
  //                 const added = await client.add(
  //                     bannerFile)
  //                 const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //                 this.setState({ collectionBannerUrl: url })
  //             }

  //             if(this.state.collectionLogoUrl == null && !this.state.existingCollection) {
  //                 this.setState({ collectionLogoUrl: this.state.fileUrl })
  //             }

  //             const uploadData = JSON.stringify({
  //                 collection: {
  //                     name: this.state.collection,
  //                     description: this.state.collectionDescription,
  //                     creator: this.state.creator,
  //                     banner: this.state.collectionBannerUrl,
  //                     logo: this.state.collectionLogoUrl,
  //                     twitterUrl: this.state.twitterUrl,
  //                     instagramUrl: this.state.instagramUrl,
  //                     discordUrl: this.state.discordUrl,
  //                     websiteUrl: this.state.websiteUrl,
  //                     nft:{
  //                         name,
  //                         description,
  //                         owner: isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address,
  //                         image: fileUrl,
  //                         unlockableContent,
  //                         properties: properties,
  //                         royalty: this.state.royalty,
  //                         fileType: this.state.file.type,
  //                         preview: this.state.previewUrl
  //                     }
  //                 }
  //             })

  //             const added = await client.add(uploadData)
  //             const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //             this.createSale(url)
  //         } catch (error) {
  //             console.log('Error uploading file:', error)
  //             this.setState({mintFailure: true})
  //         }
  //     }

  //     createSale = async (url) => {
  //         try {
  //             const wallet = await GetWallet()
  //             const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))

  //             const contract = new xdc3.eth.Contract(NFT.abi, nftaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
  //             let data = contract.methods.createToken(url).encodeABI()

  //             const tx = {
  //                 from: isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address,
  //                 to: nftaddress,
  //                 data
  //             }
  //             let gasLimit = await xdc3.eth.estimateGas(tx);

  //             tx["gas"] = gasLimit

  //             let transaction = await SendTransaction(tx)

  //             this.setState({updatingLedger: true})

  //             var txReceipt = await xdc3.eth.getTransactionReceipt(transaction.transactionHash)
  //             var tokenId = await txReceipt.logs[0].topics[3]

  //             const price = await xdc3.utils.toWei(this.state.price, "ether")

  //             var metadata = await axios.get(url)

  //             var tokenName = metadata?.data?.collection?.nft?.name;
  //             var collectionName = metadata?.data?.collection?.name;

  //             // const contract2 = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
  //             const contract2 = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)
  //             data = contract2.methods.createMarketItem(Number(tokenId), 0, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address, isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address, price, false, this.state.royalty, 1, tokenName, collectionName).encodeABI()

  //             const tx2 = {
  //                 from: isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address,
  //                 to: nftmarketlayeraddress,
  //                 value: "",
  //                 data
  //             }

  //             gasLimit = await xdc3.eth.estimateGas(tx2);

  //             tx2["gas"] = gasLimit

  //             transaction = await SendTransaction(tx2)
  //             this.setState({mintSuccess: true})
  //         } catch (error) {
  //             console.log(error)
  //             this.setState({mintFailure: true})
  //         }
  //     }

  const fetchCollection = async () => {
    const wallet = await GetWallet();
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    try {
      const data = await marketContract.methods
        .fetchItemsCreated(
          isXdc(wallet.wallet.address)
            ? fromXdc(wallet.wallet.address)
            : wallet.wallet.address
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
    const collectionName =
      document.getElementsByClassName("collection-name")[0].value;
    const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER));
    const marketContract = new xdc3.eth.Contract(
      NFTMarketLayer1.abi,
      nftmarketlayeraddress,
      xdc3
    );
    const collectionData = await marketContract.methods
      .fetchCollections()
      .call();
    var uniqueCollections = [];
    const collections = await Promise.all(
      collectionData.map(async (i) => {
        uniqueCollections.push(i.collectionName);
      })
    );
    if (uniqueCollections.includes(collectionName)) setCollectionExists(true);
    else setCollectionExists(false);
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <CreationSection>
      {modalAlert && (
        <ConfirmationModal
          iconModal={warning}
          onCancel={() => setModalAlert(false)}
          onConfirm={() => clearForm()}
          actionModal="Are you sure, do you want to clear all fields?"
        ></ConfirmationModal>
      )}

      {/* Creation Top Bar */}

      <HStack backgroundimage={CreationBar}>
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
              <HStack>
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
                image={image}
                button={"upload-button"}
                isUploading={uploadNFT}
                uploadConfirmed={uploadStatus}
                description="Click to upload NFT Image"
              ></UploadMultimedia>
              <input
                type="file"
                id="upload-button"
                style={{ display: "none" }}
                onChange={handleChangeUploadMultimedia}
              />
              {image.raw !== "" && (
                <ButtonsNFT>
                  <HStack
                    width={size.width < 768 ? "320px" : "489px"}
                    height={size.width < 768 ? "320px" : "489px"}
                    padding="15px"
                    alignment="flex-end"
                  >
                    <ButtonApp
                      text="Clear"
                      textcolor={({ theme }) => theme.text}
                      onClick={() => setImage({ preview: "", raw: "" })}
                      background={({ theme }) => theme.backElement}
                      width="90px"
                      height="39px"
                    ></ButtonApp>
                    <Spacer></Spacer>
                    <ButtonApp
                      text="Upload"
                      textcolor={appStyle.colors.white}
                      onClick={addToIPFS}
                      width="90px"
                      height="39px"
                    ></ButtonApp>
                  </HStack>
                </ButtonsNFT>
              )}
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
                  setName(event.target.value);
                }}
              ></InputStyled>

              <HStack>
                <TitleBold15 textcolor={({ theme }) => theme.text}>
                  Description
                </TitleBold15>
                <Spacer></Spacer>
                <CaptionRegular textcolor={({ theme }) => theme.text}>
                  Required
                </CaptionRegular>
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
                type="number"
                placeholder="0.00"
                propertyKey={"nft-price"}
                input={price}
                min={"0.0001"}
                icon={xdc}
                onChange={(event) => {
                  setPrice(event.target.value);
                }}
              ></InputStyled>
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
                    setRoyalty(event.target.value);
                  }}
                  onBlur={() => {
                    if (parseInt(royalty) > 100) {
                      setRoyalty(100);
                    } else if (isNaN(parseInt(royalty))) {
                      setRoyalty(0);
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
              onChange={(event) => {
                if (event.target.value === "newCollection-nxfgh-odjfg-hjdeb") {
                  setNewCollection(true);
                  setCollection("newCollection-nxfgh-odjfg-hjdeb");
                } else {
                  setNewCollection(false);
                  setCollection(event.target.value);
                }
              }}
            ></SelectStyled>
          </VStack>
          {isNewCollection ? (
            <>
              <HStack responsive={true} spacing="0px" alignment="flex-start">
                <VStack minwidth="50%" padding="30px" spacing="90px">
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
                      image={collectionBanner}
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
                            onClick={() =>
                              setCollectionBanner({ preview: "", raw: "" })
                            }
                            background={({ theme }) => theme.backElement}
                            width="81px"
                            height="36px"
                          ></ButtonApp>
                          <Spacer></Spacer>
                          <ButtonApp
                            text="Upload"
                            textcolor={appStyle.colors.white}
                            onClick={addToIPFSCollectionBanner}
                            width="81px"
                            height="36px"
                          ></ButtonApp>
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
                          image={collectionLogo}
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
                            <VStack width="150px" height="150px" spacing="6px">
                              <ButtonApp
                                text="Clear"
                                textcolor={({ theme }) => theme.text}
                                onClick={() =>
                                  setCollectionLogo({ preview: "", raw: "" })
                                }
                                background={({ theme }) => theme.backElement}
                                width="81px"
                                height="36px"
                              ></ButtonApp>

                              <ButtonApp
                                text="Upload"
                                textcolor={appStyle.colors.white}
                                onClick={addToIPFSCollectionLogo}
                                width="81px"
                                height="36px"
                              ></ButtonApp>
                            </VStack>
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
                          input={websiteLink}
                          placeholder="Discord Link"
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
                <VStack minwidth="50%" padding="30px">
                  <VStack alignment="flex-start" width="100%">
                    <TitleBold15>Collection Name</TitleBold15>
                    <InputStyled
                      icon={loading}
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
                    {!collectionExists ? (
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
                text="Mint your NFT"
                height="39px"
                width="100%"
                textcolor={appStyle.colors.white}
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
  bottom: 0px;
`;

const ButtonsNFT = styled(motion.div)`
  position: absolute;
  bottom: 3px;
`;
