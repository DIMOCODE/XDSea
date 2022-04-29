import React, { useState, createContext, useContext, Component, Fragment, useRef} from 'react';
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {GetWallet, SendTransaction} from 'xdc-connect';
import Xdc3 from "xdc3";
import {DEFAULT_PROVIDER} from "../../constant";
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import {nftaddress, nftmarketaddress, nftmarketlayeraddress} from "../../config";
import { fromXdc, isXdc } from '../../common/common';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import NFTMarketLayer1 from '../../abis/NFTMarketLayer1.json'

import styled from "styled-components";
import { Divider, HStack, IconImg, Spacer, VStack } from "../../styles/Stacks";
import {
  BodyBold,
  BodyRegular,
  CaptionRegular,
  TitleBold15,
  TitleBold27,
} from "../../styles/TextStyles";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion/dist/framer-motion";
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

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function CreateNft(props) {
    const history = useHistory();

    function NavigateTo(route) {
        history.push(`/${route}`);
    }
    const [textarea, setTextarea] = useState("Describe your NFT");

    const handleChange = (event) => {
        setTextarea(event.target.value);
    };

    const size = useWindowSize();

    return (
        <CreationSection>
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
                    <CaptionRegular
                        textcolor={({ theme }) => theme.text}
                    ></CaptionRegular>
                    </HStack>
                    <UploadMultimedia
                    border="15px"
                    sizeText="490px x 490px"
                    width={size.width < 768 ? "320px" : "489px"}
                    height={size.width < 768 ? "320px" : "489px"}
                    ></UploadMultimedia>
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
                    type="text"
                    placeholder="Name your NFT"
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
                    value={textarea}
                    onChange={handleChange}
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
                    type="text"
                    placeholder="0.00"
                    icon={xdc}
                    ></InputStyled>
                </VStack>
                </HStack>
                <Divider></Divider>

                <HStack padding="0 39px" spacing="69px" responsive={true}>
                {/* Properties */}
                <VStack alignment="flex-start">
                    <TitleBold15 textcolor={({ theme }) => theme.text}>
                    Properties
                    </TitleBold15>
                    <BodyRegular textcolor={({ theme }) => theme.text}>
                    Create custom properties that define the Rarity of your NFT.
                    Properties are shown underneath your piece.
                    </BodyRegular>

                    {/* Value variables are "Property" and "Value" */}
                    <HStack padding="0 45px 0 0">
                    <TitleBold15 width="100%" textcolor={({ theme }) => theme.text}>
                        Property
                    </TitleBold15>
                    <TitleBold15 width="100%" textcolor={({ theme }) => theme.text}>
                        Value
                    </TitleBold15>
                    </HStack>

                    {/* Value variables are "Property" and "Value", user can add or erase as many they wish */}
                    <PropertyValue></PropertyValue>
                    <PropertyValue></PropertyValue>

                    <ButtonApp
                    height="39px"
                    width={size.width < 768 ? "100%" : "44%"}
                    text="Add More"
                    textcolor={appStyle.colors.white}
                    ></ButtonApp>
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
                    <InputStyled placeholder="0.00" icon={percent}></InputStyled>
                    </VStack>

                    <VStack width="100%" alignment="flex-start">
                    <BodyRegular textcolor={({ theme }) => theme.text}>
                        If your NFT belongs to any collection, please choose one
                    </BodyRegular>
                    <SelectStyled></SelectStyled>
                    </VStack>

                    <VStack width="100%" alignment="flex-start">
                    <ButtonApp
                        icon={lock}
                        iconWidth="39px"
                        iconHeight="18px"
                        text="Add Unlockable Content"
                        width="100%"
                        height="39px"
                        textcolor={appStyle.colors.white}
                    ></ButtonApp>
                    <BodyRegular textcolor={({ theme }) => theme.text}>
                        If needed, include unlockable content that will be revealed by
                        the owner of the NFT.
                    </BodyRegular>
                    </VStack>
                </VStack>
                </HStack>

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
                        Your NFT will be published on XinFin Blockchain
                    </BodyRegular>
                    </VStack>
                </HStack>
                <HStack width="100%">
                    <ButtonApp
                    text="Cancel"
                    height="39px"
                    width="100%"
                    background={({ theme }) => theme.faded}
                    textcolor={appStyle.colors.text}
                    onClick={() => NavigateTo(``)}
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

// export default class CreateToken extends Component {

//     close = () => {
//     }

//     constructor(props) {
//         super(props)

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

//     typingTimer = setTimeout(this.checkCollectionExists, 999999999999999999);

//     doneTypingInterval = 1000;

//     closeUpload = () => {
//         this.setState({uploading: false})
//         this.setState({uploadFailure: false})
//     }

//     closeMint = () => {
//         this.setState({minting: false})
//         this.setState({mintFailure: false})
//     }

//     addUnlockableContent = async() => {
//         this.state.hasUnlockableContent ? this.setState({hasUnlockableContent: false}) : this.setState({hasUnlockableContent: true});
//     };

//     addProperty = async() => {
//         this.state.hasProperties ? this.setState({hasProperties : false}) : this.setState({hasProperties: true});
//     };

//     handleChangeProperty(i, e) {
//         let properties = this.state.properties;
//         properties[i][e.target.name] = e.target.value;
//         this.setState({ properties });
//     }

//     addFormFields() {
//         this.setState(({
//             properties: [...this.state.properties, { property: "", value: "" }]
//         }))
//     }

//     removeFormFields(i) {
//         let properties = this.state.properties;
//         properties.splice(i, 1);
//         this.setState({ properties });
//     }

//     handleChange = (event) => {

//         const name = event.target.name;
//         const value = event.target.value;

//         this.setState({
//             [name]: value
//         });
//     }

//     addToIPFS = async (e) => {
//         this.setState({uploading:true})
//         const file = e.target.files[0]
//         this.setState({uploadProgress: 0.00})
//         try {
//             const added = await client.add(
//                 file, {
//                     progress: (prog) => this.setState({uploadProgress: (prog * 100) / file.size})
//                 })
//             const url = `https://ipfs.infura.io/ipfs/${added.path}`
//             this.setState({fileUrl: url})
//             this.setState({file: file})
//             this.setState({uploading:false})
//         } catch (error) {
//             console.log('Error uploading file:', error)
//             this.setState({uploadFailure: true})
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

//     addBannerToIPFS = async (e) => {
//         this.setState({uploading:true})
//         const file = e.target.files[0]
//         this.setState({uploadProgress: 0.00})
//         try {
//             const added = await client.add(
//                 file, {
//                     progress: (prog) => this.setState({uploadProgress: (prog * 100) / file.size})
//                 })
//             const url = `https://ipfs.infura.io/ipfs/${added.path}`
//             this.setState({collectionBannerUrl: url})
//             this.setState({uploading:false})
//         } catch (error) {
//             console.log('Error uploading file:', error)
//             this.setState({uploadFailure: true})
//         }
//     }

//     addLogoToIPFS = async (e) => {
//         this.setState({uploading:true})
//         const file = e.target.files[0]
//         this.setState({uploadProgress: 0.00})
//         try {
//             const added = await client.add(
//                 file, {
//                     progress: (prog) => this.setState({uploadProgress: (prog * 100) / file.size})
//                 })
//             const url = `https://ipfs.infura.io/ipfs/${added.path}`
//             this.setState({collectionLogoUrl: url})
//             this.setState({uploading:false})
//         } catch (error) {
//             console.log('Error uploading file:', error)
//             this.setState({uploadFailure: true})
//         }
//     }

//     addPreviewToIPFS = async (e) => {
//         this.setState({uploading:true})
//         const file = e.target.files[0]
//         this.setState({uploadProgress: 0.00})
//         try {
//             const added = await client.add(
//                 file, {
//                     progress: (prog) => this.setState({uploadProgress: (prog * 100) / file.size})
//                 })
//             const url = `https://ipfs.infura.io/ipfs/${added.path}`
//             this.setState({previewUrl: url})
//             this.setState({uploading:false})
//         } catch (error) {
//             console.log('Error uploading file:', error)
//             this.setState({uploadFailure: true})
//         }
//     }

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

//     checkCollectionExists = async(event) => {
//         const value = document.getElementsByClassName('collection-name nft-input')[0].value;
//         const wallet = await GetWallet()
//         const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
//         // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
//         const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
//         const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
//         const collectionData = await marketContract.methods.fetchCollections().call()
//         const uniqueCollections = []
//         const ownedCollections = []
//         const collections = await Promise.all(collectionData.map(async i => {
//             if(i.collectionName === value) {
//                 if(i.creator === (isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address)) {
//                     const uri = await nftContract.methods.tokenURI(i.tokenId).call()
//                     var metadata = await axios.get(uri)
//                     let collection = {
//                         name: metadata?.data?.collection?.name,
//                         description: metadata?.data?.collection?.description,
//                         creator: metadata?.data?.collection?.creator,
//                         banner: metadata?.data?.collection?.banner,
//                         logo: metadata?.data?.collection?.logo,
//                         twitterUrl: metadata?.data?.collection?.twitterUrl,
//                         instagramUrl: metadata?.data?.collection?.instagramUrl,
//                         discordUrl: metadata?.data?.collection?.discordUrl,
//                         websiteUrl: metadata?.data?.collection?.websiteUrl,
//                     }
//                     this.setState({ownedCollection: collection})
//                     ownedCollections.push(metadata?.data?.collection?.name)
//                 }
//             }
//             uniqueCollections.push(i.collectionName)
//         }))

//         if(uniqueCollections.includes(value) && !ownedCollections.includes(value)) {
//             this.setState({existingCollection: true});
//             this.setState({ownedCollections: false});
//         }
//         else if(uniqueCollections.includes(value) && ownedCollections.includes(value)) {
//             this.setState({existingCollection: true});
//             this.setState({ownedCollections: true});
//         }
//         else {
//             this.setState({existingCollection: false});
//             this.setState({ownedCollections: false});
//         };
//         clearTimeout(this.typingTimer)
//     }

//     checkTyping = async(event) => {
//         clearTimeout(this.typingTimer);
//         if(document.getElementsByClassName('collection-name nft-input')[0].value) {
//             this.typingTimer = setTimeout(this.checkCollectionExists, this.doneTypingInterval);
//         }
//     }

//     render() {
//         return <div>
//             <header className='secondary-page-header'>
//                 <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                     <h2 className="nft-h2"><span className="gradient-text">Create</span> your own NFT</h2>
//                 </div>
//             </header>
//             <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                 <div className='flex justify-center'>
//                     <div className='w-1/2 flex flex-col pb-12'>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Asset</label>
//                             <input type='file' name='Asset' className='nft-input' onChange={this.addToIPFS}/> 
//                             {this.state.fileUrl
//                                 ? <>
//                                     {this.isImage(this.state.file)
//                                         ? <img alt="NFT Media" className='rounded mt-4' width='350px' src={this.state.fileUrl}/>
//                                         : <></>
//                                     }
//                                     {this.isVideo(this.state.file)
//                                         ? <>
//                                             <video className='rounded mt-4' width='350px' controls>
//                                                 <source src={this.state.fileUrl} type={this.state.file.type}/>
//                                             </video>
//                                             <label className="nft-input-label">Preview</label>
//                                             <label className='nft-neutral-label'>This image will be used as the primary display on the marketplace.</label>
//                                             <input type='file' name='Preview' className='nft-input' onChange={this.addPreviewToIPFS}/>
//                                             {this.state.previewUrl
//                                                 ? <img alt="NFT Video Preview" className='rounded mt-4' width='350px' src={this.state.previewUrl}/>
//                                                 : <></>
//                                             }
//                                         </>
//                                         : <></>
//                                     }
//                                     {this.isAudio(this.state.file)
//                                         ? <>
//                                             <audio className='rounded mt-4' width='350px' controls>
//                                                 <source src={this.state.fileUrl} type={this.state.file.type}/>
//                                             </audio>
//                                             <label className="nft-input-label">Cover Art</label>
//                                             <label className='nft-neutral-label'>This image will be used as the primary display on the marketplace.</label>
//                                             <input type='file' name='Cover Art' className='nft-input' onChange={this.addPreviewToIPFS}/>
//                                             {this.state.previewUrl
//                                                 ? <img alt="NFT Audio Preview" className='rounded mt-4' width='350px' src={this.state.previewUrl}/>
//                                                 : <></>
//                                             }
//                                         </>
//                                         : <></>
//                                     }
//                                 </>
//                                 : <></>
//                             }
//                         </div>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Asset Name</label>
//                             <input placeholder='Individual NFT Name' className='nft-input' name="name" value={this.state.name} onChange={this.handleChange}/>
//                         </div>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Asset Description</label>
//                             <textarea placeholder='A description of your asset' className='nft-input' name="description" value={this.state.description} onChange={this.handleChange}/>
//                         </div>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Asset Price in XDC</label>
//                             <input placeholder='Asset Price in XDC' className='nft-input' name="price" value={this.state.price} onChange={this.handleChange}/>
//                         </div>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Royalty (in percentage)</label>
//                             <input className='nft-input' name="royalty" value={this.state.royalty} onChange={this.handleChange}/>
//                         </div>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Collection</label>
//                             {this.state.collection === "" 
//                             ? <>
//                             </>
//                             : <>
//                                 {this.state.existingCollection
//                                     ? <>
//                                         {this.state.ownedCollections
//                                             ? <label className='nft-success-label'>{this.state.existingCollection ? "You can add NFTs to this collection!" : ""}</label>
//                                             : <label className='nft-warning-label'>{this.state.existingCollection ? "Please enter a different collection name as the chosen collection name already exists and you do not have contributor access to this collection" : ""}</label>
//                                         }
//                                     </>
//                                     : <>
//                                         <label className='nft-success-label'>{this.state.existingCollection ? "" : "Collection name available!"}</label>
//                                     </>
//                                 }
//                             </>
//                             }
//                             <input placeholder='Collection Name' className='collection-name nft-input' name="collection" value={this.state.collection} onChange={this.handleChange} onKeyUp={this.checkTyping}/>
//                         </div>
//                         {this.state.collection === "" 
//                             ? <>
//                             </>
//                             : <>
//                                 {this.state.existingCollection
//                                     ? <></>
//                                     : <>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Collection Description</label>
//                                             <textarea placeholder='Collection Description' className='nft-input' name="collectionDescription" value={this.state.collectionDescription} onChange={this.handleChange}/>
//                                         </div>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Collection Banner</label>
//                                             <label className='nft-neutral-label'>Recommended size: 1600 x 350 (w x h)</label>
//                                             <input type='file' name='Collection Banner' className='nft-input' onChange={this.addBannerToIPFS}/> {
//                                             this.state.collectionBannerUrl && (
//                                                 <img alt="Collection Banner" className='rounded mt-4' width='350px' src={this.state.collectionBannerUrl}/>
//                                             )}
//                                         </div>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Collection Logo</label>
//                                             <input type='file' name='Collection Logo' className='nft-input' onChange={this.addLogoToIPFS}/> {
//                                             this.state.collectionLogoUrl && (
//                                                 <img alt="Collection Logo" className='rounded mt-4' width='350px' src={this.state.collectionLogoUrl}/>
//                                             )}
//                                         </div>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Twitter Link</label>
//                                             <input placeholder='https://twitter.com/' className='nft-input' name="twitterUrl" value={this.state.twitterUrl} onChange={this.handleChange}/>
//                                         </div>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Instagram Link</label>
//                                             <input placeholder='https://instagram.com/' className='nft-input' name="instagramUrl" value={this.state.instagramUrl} onChange={this.handleChange}/>
//                                         </div>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Discord Link</label>
//                                             <input placeholder='https://discord.com/' className='nft-input' name="discordUrl" value={this.state.discordUrl} onChange={this.handleChange}/>
//                                         </div>
//                                         <div className="mb-4">
//                                             <label className="nft-input-label">Website</label>
//                                             <input placeholder='Collection Website URL' className='nft-input' name="websiteUrl" value={this.state.websiteUrl} onChange={this.handleChange}/>
//                                         </div>
//                                     </>
//                                 }
//                             </>
//                         }
//                         <div className="mb-4">
//                             <label className="nft-input-label">Properties</label>
//                             <button onClick = {this.addProperty} className='nft-btn-gradient w-full'>{this.state.hasProperties ? "Remove Property" : "Add Property"}</button>
//                             {this.state.hasProperties &&
//                             (<>
//                             {this.state.properties.map((element, index) => (
//                                 <div className="mb-4" key={index}>
//                                     <label className="nft-input-label">Property</label>
//                                     <input placeholder = "e.g. Character" type="text" className="nft-input" name="property" value={element.property || ""} onChange={e => this.handleChangeProperty(index, e)} />
//                                     <label className="nft-input-label">Value</label>
//                                     <input placeholder = "e.g. Male" type="text" className="nft-input" name="value" value={element.value || ""} onChange={e => this.handleChangeProperty(index, e)} />
//                                 {
//                                     index ? 
//                                     <button type="button"  className="nft-btn-gradient" onClick={() => this.removeFormFields(index)}>Remove</button> 
//                                     : null
//                                 }
//                                 </div>
//                             ))}
//                             <div className="button-section">
//                                 <button className="nft-btn-gradient" type="button" onClick={() => this.addFormFields()}>Add</button>
//                             </div>
//                             </>)}
                            
//                         </div>
//                         <div className="mb-4">
//                             <label className="nft-input-label">Unlockable Content</label>
//                             <button onClick = {this.addUnlockableContent} className='nft-btn-gradient w-full'>{this.state.hasUnlockableContent ? "Remove Unlockable Content" : "Add Unlockable Content"}</button>
//                             {this.state.hasUnlockableContent && 
//                                 (<input placeholder='Unlockable Content' className='nft-input' name="unlockableContent" value={this.state.unlockableContent} onChange={this.handleChange} />
//                             )}
//                         </div>
//                         <div className="mb-4">
//                             <button onClick={this.createMarket} className='nft-btn-gradient w-full' disabled={this.state.name === "" || this.state.name === undefined || this.state.fileUrl === null || (this.state.existingCollection && !this.state.ownedCollection)}>Mint NFT</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Transition.Root show={this.state.minting} as={Fragment}>
//                 <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={this.close}>
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0"
//                             enterTo="opacity-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100"
//                             leaveTo="opacity-0"
//                         >
//                             <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//                         </Transition.Child>

//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                             enterTo="opacity-100 translate-y-0 sm:scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                             leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                         >
//                             <div
//                                 className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                                 <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                     {this.state.mintSuccess 
//                                         ? <>
//                                             <h2 className='text-center gradient-text'>NFT Successfully Minted!</h2>
//                                             <div className="mt-3 text-center">
//                                                 <div className="mt-2 w-full">
//                                                     <h4>{this.state.name} is successfully minted and can now be listed on the market for purchase.</h4>
//                                                     <button className="nft-btn-gradient h-32 py-0 my-1" onClick={() => {this.props.history.push(`/my-nfts`)}}>Ok!</button>
//                                                 </div>
//                                             </div>
//                                         </>
//                                         : <>
//                                             {this.state.mintFailure
//                                                 ? <>
//                                                     <h2 className='text-center gradient-text'>Minting failed!</h2>
//                                                     <div className="mt-3 text-center">
//                                                         <div className="mt-2 w-full">
//                                                             <h4>Something went wrong while minting the NFT. Please check your wallet connection and try again.</h4>
//                                                             <button className="nft-btn-gradient h-32 py-0 my-1" onClick={this.closeMint}>Ok!</button>
//                                                         </div>
//                                                     </div>
//                                                 </>
//                                                 : <>
//                                                     {this.state.updatingLedger 
//                                                         ? <>
//                                                             <h2 className='text-center gradient-text'>Updating the marketplace ledger!</h2>
//                                                             <div className="mt-3 text-center">
//                                                                 <div className="mt-2 w-full">
//                                                                     <h4>We are making your freshly minted NFT visible on the marketplace. Thank you for your patience!</h4>
//                                                                 </div>
//                                                             </div>
//                                                         </>
//                                                         : <>
//                                                             <h2 className='text-center gradient-text'>Minting in progress!</h2>
//                                                             <div className="mt-3 text-center">
//                                                                 <div className="mt-2 w-full">
//                                                                     <h4>We are minting your NFT! Thank you for your patience!</h4>
//                                                                 </div>
//                                                             </div>
//                                                         </>
//                                                     }
//                                                 </>
//                                             }
//                                         </>
//                                     }
//                                 </div>
//                             </div>
//                         </Transition.Child>
//                     </div>
//                 </Dialog>
//             </Transition.Root>
        
//             <Transition.Root show={this.state.uploading} as={Fragment}>
//                 <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={this.close}>
//                     <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0"
//                             enterTo="opacity-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100"
//                             leaveTo="opacity-0"
//                         >
//                             <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//                         </Transition.Child>
//                         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                             enterTo="opacity-100 translate-y-0 sm:scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                             leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                         >
//                             <div
//                                 className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                                 <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                     <h2 className='text-center gradient-text'>{this.state.uploadFailure ? "Upload failed!" : "Upload in progress!"}</h2>
//                                     <div className="mt-3 text-center">
//                                         <div className="mt-2 w-full">
//                                             {this.state.uploadFailure
//                                                 ? <>
//                                                     <h4>Something went wrong while uploading the asset. Please ensure that the file size is less than 100MB and try again.</h4>
//                                                     <button className="nft-btn-gradient h-32 py-0 my-1" onClick={this.closeUpload}>Ok!</button>
//                                                 </>
//                                                 : <>
//                                                     <h4>We are uploading your assets! Thank you for your patience!</h4>
//                                                     <h4>{`Progress: ${this.state.uploadProgress.toFixed(2)}%`}</h4>
//                                                 </>
//                                             }
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Transition.Child>
//                     </div>
//                 </Dialog>
//             </Transition.Root>
//         </div>;
//     }
// }
