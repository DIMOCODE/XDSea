import React, {Fragment, useEffect, useState, useRef} from 'react';
import {useHistory} from "react-router-dom";
import Card from "./common/card";
import Xdc3 from "xdc3";
import {DEFAULT_PROVIDER} from "../../constant";
import {nftaddress, nftmarketaddress, nftmarketlayeraddress} from "../../config";
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import NFTMarketLayer1 from '../../abis/NFTMarketLayer1.json'
import axios from "axios";
import { GetWallet } from 'xdc-connect';
import { Dialog, Transition } from '@headlessui/react';
import { LegacyBuyNFT, BuyNFT, LegacyWithdrawListing, SellNFT, WithdrawListing } from '../../common';
import {toXdc} from '../../common/common';
import SkeletonCard from "../../common/skeleton/card";
import detectEthereumProvider from "@metamask/detect-provider";
import CollectionCard from './common/collectionCard';
import { fromXdc, isXdc } from '../../common/common';
import { XdcConnect } from "xdc-connect";
import { permaBlacklist } from '../../blacklist';

const Home = (props) => {
    const history = useHistory()
    const [nfts, setNFts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [wallet, setWallet] = useState({})
    const [featuredNFT, setFeaturedNFT] = useState(null)
    const [address, setAddress] = useState(false)
    const [collections, setCollections] = useState([]);
    const [creating, setCreating] = useState(false);

    const [sellPrice, setSellPrice] = useState('');
    const [approved, setApproved] = useState(false)
    const cancelButtonRef = useRef(null)
    const [sellData, setSellData] = useState(null)
    const [listSuccess, setListSuccess] = useState(false);
    const [listFailure, setListFailure] = useState(false);
    const [listedNFT, setListedNFT] = useState(null);
    const [listing, setListing] = useState(false);
    const [buySuccess, setBuySuccess] = useState(false);
    const [buyFailure, setBuyFailure] = useState(false)
    const [boughtNFT, setBoughtNFT] = useState(null);
    const [buying, setBuying] = useState(false);
    const [withdrawSuccess, setWithdrawSuccess] = useState(false);
    const [withdrawFailure, setWithdrawFailure] = useState(false)
    const [withdrawnNFT, setWithdrawnNFT] = useState(null);
    const [withdrawing, setWithdrawing] = useState(false);
    const [settingPrice, setSettingPrice] = useState(false);
    const [blacklist, setBlacklist] = useState([])
    const [featuredNFTType, setFeaturedNFTType] = useState('')

    const close = () => {
        setSellData(null)
        setSellPrice('')
    }

    const startSale = async (nft) =>{
        setSellData(nft)
        setListing(true)
        setListFailure(false)
        setSettingPrice(true)
    }
    const sellNFT = async () => {
        setSettingPrice(false)
        var success = false
        if(!blacklist.includes(sellData.tokenId)){
            success = await SellNFT(approved, sellData, sellPrice)
        }
        if(success) {
            setListedNFT(sellData)
            setListSuccess(true)
        }
        else {
            setListFailure(true)
        }
    }
    const closeList = () => {
        setListing(false);
        if(!listFailure)
            history.push(`/my-nfts`)
    }
    const buyNFT = async (nft) => {
        setBuying(true)
        setBuyFailure(false)
        var success = false
        if(blacklist.includes(nft.tokenId)){
            success = await LegacyBuyNFT(nft)
        }
        else{
            success = await BuyNFT(nft)
        }
        if(success) {
            setBoughtNFT(nft)
            setBuySuccess(true)
        }
        else {
            setBuyFailure(true)
        }
    }
    const closeBuy = () => {
        setBuying(false)
        if(!buyFailure)
            history.push('/my-nfts')
    }
    const withdrawListing = async(nft) => {
        setWithdrawing(true)
        setWithdrawFailure(false)
        var success = false
        if(blacklist.includes(nft.tokenId)) {
            success = await LegacyWithdrawListing(approved, nft)
        }
        else{
            success = await WithdrawListing(approved, nft)
        }
        if(success) {
            setWithdrawnNFT(nft)
            setWithdrawSuccess(true)
        }
        else{
            setWithdrawFailure(true)
        }
    }
    const closeWithdraw = () => {
        setWithdrawing(false); 
        if(!withdrawFailure)
            history.push('/my-nfts')
    }

    const checkWalletConnection = async () => {
        try {
            await window.ethereum.enable()

            const provider = await detectEthereumProvider()

            const xdc3 = new Xdc3(provider)
            const accounts = await xdc3.eth.getAccounts();
            setAddress(true)
        } catch (e) {
            console.log(e)
        }
    }
    
    const getData = async () => {
        try {
            // console.log(permaBlacklist)
            setBlacklist(permaBlacklist)
            const wallet = await GetWallet()
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
            const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

            // console.log(wallet)
            if(wallet.wallet.address !== '')
                var getVal = await nftContract.methods.isApprovedForAll(isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address, nftmarketlayeraddress).call()
            
            const featuredNFT = await marketContract.methods.idToMarketItem(1772).call()
            const featuredNFTUri = await nftContract.methods.tokenURI(featuredNFT.tokenId).call()
            var featuredNFTMetadata = await axios.get(featuredNFTUri)
            let featuredNFTData = {
                collectionName: featuredNFTMetadata?.data?.collection?.name,
                image: featuredNFTMetadata?.data?.collection?.nft?.image,
                name: featuredNFTMetadata?.data?.collection?.nft?.name,
                fileType: featuredNFTMetadata?.data?.collection?.nft?.fileType,
                preview: featuredNFTMetadata?.data?.collection?.nft?.preview
            }

            var collectionData = await marketContract.methods.fetchCollection("The Lucid Women").call()
            var spotlightCollections = []
            const collectionUri = await nftContract.methods.tokenURI(collectionData.tokenId).call()
            var collectionMetadata = await axios.get(collectionUri)
            let collection = {
                collectionName: collectionMetadata?.data?.collection?.name,
                collectionDescription: collectionMetadata?.data?.collection?.description,
                collectionCreator: collectionMetadata?.data?.collection?.creator,
                collectionBanner: collectionMetadata?.data?.collection?.banner,
                collectionLogo: collectionMetadata?.data?.collection?.logo,
                fileType: collectionMetadata?.data?.collection?.nft?.fileType,
                preview: collectionMetadata?.data?.collection?.nft?.preview
            }
            spotlightCollections.push(collection)

            var collectionData = await marketContract.methods.fetchCollection("NFTHC").call()
            const collectionUri2 = await nftContract.methods.tokenURI(collectionData.tokenId).call()
            var collectionMetadata = await axios.get(collectionUri2)
            let collection2 = {
                collectionName: collectionMetadata?.data?.collection?.name,
                collectionDescription: collectionMetadata?.data?.collection?.description,
                collectionCreator: collectionMetadata?.data?.collection?.creator,
                collectionBanner: collectionMetadata?.data?.collection?.banner,
                collectionLogo: collectionMetadata?.data?.collection?.logo,
                fileType: collectionMetadata?.data?.collection?.nft?.fileType,
                preview: collectionMetadata?.data?.collection?.nft?.preview
            }
            spotlightCollections.push(collection2)

            var trendingItems = []
            var itemData = await marketContract.methods.idToMarketItem(97).call()
            const trendingItemUri = await nftContract.methods.tokenURI(itemData.tokenId).call()
            var trendingItemMetadata = await axios.get(trendingItemUri)
            var price = await xdc3.utils.fromWei(itemData.price, "ether")
            let item = {
                price: price,
                tokenId: itemData.tokenId,
                itemId: itemData.itemId,
                owner: itemData.owner,
                image: trendingItemMetadata?.data?.collection?.nft?.image,
                name: trendingItemMetadata?.data?.collection?.nft?.name,
                description: trendingItemMetadata?.data?.collection?.nft?.description,
                nftContract: itemData.nftContract,
                isListed: itemData.isListed,
                fileType: trendingItemMetadata?.data?.collection?.nft?.fileType,
                preview: trendingItemMetadata?.data?.collection?.nft?.preview
            }
            trendingItems.push(item)

            var itemData = await marketContract.methods.idToMarketItem(760).call()
            const trendingItemUri2 = await nftContract.methods.tokenURI(itemData.tokenId).call()
            var trendingItemMetadata = await axios.get(trendingItemUri2)
            var price = await xdc3.utils.fromWei(itemData.price, "ether")
            let item2 = {
                price: price,
                tokenId: itemData.tokenId,
                itemId: itemData.itemId,
                owner: itemData.owner,
                image: trendingItemMetadata?.data?.collection?.nft?.image,
                name: trendingItemMetadata?.data?.collection?.nft?.name,
                description: trendingItemMetadata?.data?.collection?.nft?.description,
                nftContract: itemData.nftContract,
                isListed: itemData.isListed,
                fileType: trendingItemMetadata?.data?.collection?.nft?.fileType,
                preview: trendingItemMetadata?.data?.collection?.nft?.preview
            }
            trendingItems.push(item2)

            var itemData = await marketContract.methods.idToMarketItem(2133).call()
            const trendingItemUri3 = await nftContract.methods.tokenURI(itemData.tokenId).call()
            var trendingItemMetadata = await axios.get(trendingItemUri3)
            var price = await xdc3.utils.fromWei(itemData.price, "ether")
            let item3 = {
                price: price,
                tokenId: itemData.tokenId,
                itemId: itemData.itemId,
                owner: itemData.owner,
                image: trendingItemMetadata?.data?.collection?.nft?.image,
                name: trendingItemMetadata?.data?.collection?.nft?.name,
                description: trendingItemMetadata?.data?.collection?.nft?.description,
                nftContract: itemData.nftContract,
                isListed: itemData.isListed,
                fileType: trendingItemMetadata?.data?.collection?.nft?.fileType,
                preview: trendingItemMetadata?.data?.collection?.nft?.preview
            }
            trendingItems.push(item3)

            var itemData = await marketContract.methods.idToMarketItem(1772).call()
            const trendingItemUri4 = await nftContract.methods.tokenURI(itemData.tokenId).call()
            var trendingItemMetadata = await axios.get(trendingItemUri4)
            var price = await xdc3.utils.fromWei(itemData.price, "ether")
            let item4 = {
                price: price,
                tokenId: itemData.tokenId,
                itemId: itemData.itemId,
                owner: itemData.owner,
                image: trendingItemMetadata?.data?.collection?.nft?.image,
                name: trendingItemMetadata?.data?.collection?.nft?.name,
                description: trendingItemMetadata?.data?.collection?.nft?.description,
                nftContract: itemData.nftContract,
                isListed: itemData.isListed,
                fileType: trendingItemMetadata?.data?.collection?.nft?.fileType,
                preview: trendingItemMetadata?.data?.collection?.nft?.preview
            }
            trendingItems.push(item4)

            setCollections(spotlightCollections)
            setLoadingState('loaded')
            setNFts(trendingItems)
            setFeaturedNFT(featuredNFTData)
            setFeaturedNFTType(featuredNFTData.fileType)
            setApproved(getVal)
        } catch (error) {
            console.log(error)
        }
    }
    const viewNFT = data => {
        history.push(`/nft/${nftaddress}/${data.tokenId}`)
    }
    
    const viewCollection = (data) => {
        history.push(`/collection/${data}`)
    }
    const setBannerImage = () => {
        let data = document.getElementsByClassName("nft-banner")[0] !== undefined 
            ? document.getElementsByClassName("nft-banner")[0].style.backgroundImage = featuredNFT?.preview 
                ? `url(${featuredNFT.preview})` 
                : "" 
            : ""
    }
    const goToCreate = async () => {
        const wallet = await GetWallet();
        setWallet(wallet);
        if(wallet?.wallet?.connected){
            history.push('/mint-item')
        }
        else {
            setCreating(true)
        }
    }
    const getBlacklist = async () => {
        const wallet = await GetWallet();
        setWallet(wallet);
        const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
        const oldMarketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
        const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
        const data = await oldMarketContract.methods.fetchMarketItems().call()

        var newBlacklist = []
        const marketItems = await Promise.all(data.map(async i => {
            if(i.isListed) {
                newBlacklist.push(i.tokenId)
            }
        }))
        // console.log(newBlacklist)
        // setBlacklist(newBlacklist)
    }

    const isImage = (fileType) => {
        return !!fileType?.match('image.*');
    }
      
    const isVideo = (fileType) => {
        return !!fileType?.match('video.*');
    }

    useEffect(() => {
        checkWalletConnection()
        setWallet(props.wallet)
        getData();
        // getBlacklist()
    }, [])
    useEffect(() => {
        setWallet(props.wallet)
    }, [props.wallet])
    return (
        <div key={props.wallet} className="nft-banner" style={{
            backgroundImage: setBannerImage()
        }}>
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 container max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className='topBannerText'>
                        <h2 className='gradient-text'>Exploring, Collecting, and Selling exclusive <span>NFTs</span> has now become simpler & faster.</h2>
                        <p>Be a part of the world's first NFT Marketplace on the XRC blockchain.</p>
                        <button className="nft-btn-gradient ml-2 mt-2" onClick={goToCreate}>Create</button>
                        <button className="nft-btn-linear-gradient ml-2 mt-2 text-white" onClick={() => history.push('/discover')}>Discover More</button>
                    </div>
                    <div>
                        <div className='featuredNFT' onClick = {() => {history.push(`/collection/${featuredNFT.collectionName}`)}}>
                            <div className='featuredNFTCaption'>
                                {isImage(featuredNFTType)
                                    ? <img src={featuredNFT?.image ? featuredNFT.image : ""} />
                                    : <></>
                                }
                                {isVideo(featuredNFTType)
                                    ? <video autoPlay loop muted>
                                        <source src={featuredNFT?.image ? featuredNFT.image : ""} type={featuredNFTType.type}/>
                                    </video>
                                    : <></>
                                }
                                {/* <img src={featuredNFT?.preview ? featuredNFT.preview : ""}/> */}
                            </div>
                            <div className="featuredNFTTitle">
                                <h5>{featuredNFT?.name ? featuredNFT.name : ""} <>{featuredNFT?.name ? "from" : ""}</> <span>{featuredNFT?.collectionName ? featuredNFT.collectionName : ""}</span></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='spotlightCollections'>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    <h2 className="nft-h2">Spotlight <span className="gradient-text">Collections</span></h2>
                </div>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    <div>
                        <div style={{maxWidth: '1600px'}}>
                            {loadingState === 'loaded' ? (<React.Fragment>{!collections.length ? (
                                <p className="text-2xl text-white px-20 py-7 text-4x1">No Collections available on the marketplace</p>
                                ) : (
                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                                        {collections.map((collection, i) => (
                                            <React.Fragment key={i}>
                                                {collection != undefined 
                                                ? <CollectionCard
                                                name={collection.collectionName}
                                                description={collection.collectionDescription}
                                                banner = {collection.collectionBanner}
                                                logo = {collection.collectionLogo}
                                                viewCollection={() => viewCollection(collection.collectionName)}
                                                wallet = {wallet}
                                            />
                                                : <></>}
                                            </React.Fragment>
                                        ))
                                        }
                                </div>
                            )}</React.Fragment>) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <SkeletonCard/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='trendingItems'>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    <h2 className="nft-h2"><span className="gradient-text">Trending</span> Items</h2>
                </div>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    <div>
                        <div style={{maxWidth: '1600px'}}>
                            {loadingState === 'loaded' ? (<React.Fragment>{!nfts.length ? (
                                <p className="text-2xl text-white px-20 py-7 text-4x1">No NFTs available on the marketplace</p>
                                ) : (

                                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                        {nfts.map((nft, i) => (
                                            <React.Fragment key={i}>
                                                <Card
                                                    image={nft.image}
                                                    name={nft.name}
                                                    description={nft.description}
                                                    seller={nft.seller}
                                                    price={nft.price}
                                                    collection={nft.collectionName}
                                                    buyNFT={() => buyNFT(nft)}
                                                    viewNFT={() => viewNFT(nft)}
                                                    listNFT={() => startSale(nft)}
                                                    withdrawNFT = {() => withdrawListing(nft)}
                                                    wallet={wallet}
                                                    isListed={nft.isListed}
                                                    fileType = {nft.fileType}
                                                    preview = {nft.preview}
                                                />
                                            </React.Fragment>
                                        ))
                                        }
                                </div>
                            )}</React.Fragment>) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <SkeletonCard/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
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

                        {/* This element is to trick the browser into centering the modal contents. */}
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

                        {/* This element is to trick the browser into centering the modal contents. */}
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

                        {/* This element is to trick the browser into centering the modal contents. */}
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

                        {/* This element is to trick the browser into centering the modal contents. */}
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

                        {/* This element is to trick the browser into centering the modal contents. */}
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
        </div>
    )
};

export default Home;