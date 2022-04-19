import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import Card from "../home/common/card";
import Xdc3 from 'xdc3'
import { DEFAULT_PROVIDER, NETWORK_NAME } from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { nftmarketaddress, nftmarketlayeraddress } from "../../config";
// import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import axios from 'axios';
import { GetWallet } from 'xdc-connect';
import { Dialog, Transition } from '@headlessui/react';
import { LegacyBuyNFT, BuyNFT, SellNFT, LegacyWithdrawListing, WithdrawListing, TransferNFT, EditNFT, Offer, WithdrawOffer, AcceptOffer } from '../../common';
import {toXdc} from '../../common/common';
import SkeletonCard from "../../common/skeleton/card";
import PropertyCard from '../home/common/propertyCard';
import SkeletonMyNFT from "../../common/skeleton/my-nft";
import { fromXdc, isXdc } from '../../common/common';
import NFTMarketLayer1 from '../../abis/NFTMarketLayer1.json'
import { permaBlacklist, contractFix } from '../../blacklist';

const NFTDetails = (props) => {
    const history = useHistory()
    const [nfts, setNFts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [tab, setTab] = useState('token'); //price, offers, token
    const [metadata, setMetadata] = useState(null)
    const [wallet, setWallet] = useState(null)
    const [nft, setNFT] = useState(null)
    const [collections, setCollections] = useState([])
    const [offers, setOffers] = useState([])

    const [sellPrice, setSellPrice] = useState('');
    const [approved, setApproved] = useState(false)
    const cancelButtonRef = useRef(null)
    const cancelButtonRef2 = useRef(null)
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

    const [transferSuccess, setTransferSuccess] = useState(false)
    const [transferFailure, setTransferFailure] = useState(false)
    const [transferNFT, setTransferNFT] = useState(null)
    const [transferring, setTransferring] = useState(false)
    const [editSuccess, setEditSuccess] = useState(false);
    const [editFailure, setEditFailure] = useState(false)
    const [editedNFT, setEditedNFT] = useState(null);
    const [editing, setEditing] = useState(false);
    const [offerSuccess, setOfferSuccess] = useState(false);
    const [offerFailure, setOfferFailure] = useState(false);
    const [offerData, setOfferData] = useState(null);
    const [offering, setOffering] = useState(false);
    const [withdrawOfferSuccess, setWithdrawOfferSuccess] = useState(false);
    const [withdrawOfferFailure, setWithdrawOfferFailure] = useState(false)
    const [withdrawingOffer, setWithdrawingOffer] = useState(false);
    const [acceptOfferSuccess, setAcceptOfferSuccess] = useState(false);
    const [acceptOfferFailure, setAcceptOfferFailure] = useState(false)
    const [acceptingOffer, setAcceptingOffer] = useState(false);
    const [confirmingAcceptOffer, setConfirmingAcceptOffer] = useState(false);
    const [offerSender, setOfferSender] = useState("")
    const [offerPrice, setOfferPrice] = useState(0)
    const [offerTokenId, setOfferTokenId] = useState(0)
    const [offerId, setOfferId] = useState(0)
    const [activeCollection, setActiveCollection] = useState("");
    const [eventHistory, setEventHistory] = useState([])
    const [propertyProportions, setPropertyProportions] = useState([]);
    const [transferAddress, setTransferAddress] = useState('');
    const [nftAsset, setNftAsset] = useState(null)
    const [moreFromCollectionNfts, setMoreFromCollectionNfts] = useState([])
    const [blacklist, setBlacklist] = useState([])
    const [contractFixes, setContractFixes] = useState([])

    const { id, nftaddress } = useParams()

    const viewNFT = data => {
        history.push(`/collection/${data.collectionName}`)
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
        if(!blacklist.includes(nft.tokenId)){
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
    const offer = async () => {
        setSettingPrice(false)
        var success = false
        if(!blacklist.includes(nft.tokenId)){
            success = await Offer(approved, offerData, sellPrice)
        }
        if(success) {
            setOfferData(offerData)
            setOfferSuccess(true)
        }
        else {
            setOfferFailure(true)
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
    const placeOffer = async(nft) => {
        setOfferData(nft)
        setOffering(true)
        setOfferFailure(false)
        setSettingPrice(true)
    }
    const closeOffer = () => {
        setOffering(false);
        if(!offerFailure)
            history.push(`/collection/${nft.collectionName}`)
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
    const withdrawOffer = async(tokenId, i) => {
        setWithdrawingOffer(true)
        setWithdrawOfferFailure(false)
        var success = false
        if(!blacklist.includes(nft.tokenId)){
            success = await WithdrawOffer(approved, tokenId, i + 1)
        }
        if(success) {
            setWithdrawOfferSuccess(true)
        }
        else{
            setWithdrawOfferFailure(true)
        }
        // console.log(success)
    }
    const closeWithdrawOffer = () => {
        setWithdrawingOffer(false); 
        if(!withdrawOfferFailure)
            history.push(`/collection/${nft.collectionName}`)
    }
    const acceptOffer = async() => {
        setConfirmingAcceptOffer(false)
        var success = false
        if(!blacklist.includes(nft.tokenId)){
            success = await AcceptOffer(approved, offerTokenId, offerId)
        }
        if(success) {
            setAcceptOfferSuccess(true)
        }
        else {
            setAcceptOfferFailure(true)
        }
    }
    const confirmAcceptOffer = async(tokenId, i, from, price) => {
        setConfirmingAcceptOffer(true)
        setAcceptingOffer(true)
        setAcceptOfferFailure(false)
        setOfferTokenId(tokenId)
        setOfferId(i + 1)
        setOfferSender(from)
        setOfferPrice(price)
    }
    const closeAcceptOffer = () => {
        setAcceptingOffer(false)
        if(!acceptOfferFailure)
            history.push(`/my-nfts`)
    }
    const editListing = async (nft) =>{
        setSellData(nft)
        setEditFailure(false)
        setEditing(true)
        setSettingPrice(true)
    }
    const editNFT = async () => {
        setSettingPrice(false)
        var success = false
        if(!blacklist.includes(nft.tokenId)){
            success = await EditNFT(approved, sellData, sellPrice)
        }
        if(success) {
            setEditedNFT(sellData)
            setEditSuccess(true)
        }
        else {
            setEditFailure(true)
        }
    }
    const closeEdit = () => {
        setEditing(false);
        if(!editFailure)
            history.push(`/my-nfts`)
    }
    const startTransfer = async (nft) => {
        setTransferNFT(nft)
        setTransferFailure(false)
        setSettingPrice(true)
        setTransferring(true)
    }
    const transfer = async () => {
        setSettingPrice(false)
        var success = false
        if(!blacklist.includes(nft.tokenId)){
            success = await TransferNFT(approved, transferNFT, transferAddress)
        }
        if(success) {
            setTransferNFT(transferNFT)
            setTransferSuccess(true)
        }
        else {
            setTransferFailure(true)
        }
    }
    const closeTransfer = () => {
        setTransferring(false);
        if(!transferFailure)
            history.push('/my-nfts')
    }

    const showProperties = async () => {
        var coll = document.getElementsByClassName("nft-properties-collapsible")[0];
        coll.className = "nft-properties-collapsible nft-properties-active";
        var content = document.getElementsByClassName("nft-property-tags")[0];
        // console.log(content)
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        }
        else {
            content.style.maxHeight = 1000 + "px";
        }
    }

    const showUnlockableContent = async () => {
        var coll = document.getElementsByClassName("unlockable-content-collapsible")[0];
        coll.className = "unlockable-content-collapsible unlockable-content-active";
        var content = document.getElementsByClassName("unlockable-content")[0];
        // console.log(content)
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        }
        else {
            content.style.maxHeight = 1000 + "px";
        }
    }

    const isImage = (fileType) => {
        return !!fileType?.match('image.*');
    }
      
    const isVideo = (fileType) => {
        return !!fileType?.match('video.*');
    }

    const isAudio = (fileType) => {
        return !!fileType?.match('audio.*');
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

    const getData = async () => {
        try {
            // console.log(permaBlacklist)
            setBlacklist(permaBlacklist)
            setContractFixes(contractFix)
            const wallet = await GetWallet()

            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
            const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

            if(wallet.wallet.address !== '')
                var getVal = await nftContract.methods.isApprovedForAll(isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address, nftmarketlayeraddress).call()

            var item = await marketContract.methods.idToMarketItem(id).call()
            var uri = await nftContract.methods.tokenURI(item.tokenId).call()
            var metadata = await axios.get(uri)

            var price = await xdc3.utils.fromWei(item.price, "ether")

            let currentItem = {
                price: price,
                tokenId: item.tokenId,
                itemId: item.itemId,
                creator: item.creator,
                owner: item.owner,
                collectionName: metadata?.data?.collection?.name,
                image: metadata?.data?.collection?.nft?.image,
                name: metadata?.data?.collection?.nft?.name,
                description: metadata?.data?.collection?.nft?.description,
                nftContract: item.nftContract,
                itemId: item.itemId,
                isListed: item.isListed,
                properties: metadata?.data?.collection?.nft?.properties,
                fileType: metadata?.data?.collection?.nft?.fileType,
                preview: metadata?.data?.collection?.nft?.preview,
                royalty: metadata?.data?.collection?.nft?.royalty
            }

            setActiveCollection(metadata?.data?.collection?.name)

            // console.log(currentItem)

            const data = await marketContract.methods.getCollectionNFTs(metadata?.data?.collection?.name).call()
            var moreFromCollectionItems = []
            const collection = await Promise.all(data.map(async i => {

                var price = await xdc3.utils.fromWei(i.price, "ether")

                const uri = await nftContract.methods.tokenURI(i.tokenId).call()

                var metadata = await axios.get(uri)

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
                    properties: metadata?.data?.collection?.nft?.properties,
                    fileType: metadata?.data?.collection?.nft?.fileType,
                    preview: metadata?.data?.collection?.nft?.preview
                }

                if(metadata?.data?.collection?.name === currentItem.collectionName && i.tokenId !== currentItem.tokenId
                    && moreFromCollectionItems.length < 8 && i.tokenId !== "119" && i.tokenId !== "1778") {
                    moreFromCollectionItems.push(item)
                }
                return item
            }))
            setCollections(collections)

            const properties = await Promise.all(metadata.data.collection.nft.properties.map( async (property, i) => {
                let propertyProp = {
                    property: property.property,
                    value: property.value,
                    proportion: 0
                }
                return propertyProp
            }))

            const moreFromCollection = await Promise.all(collection.map(async i => {

                const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                var metadata = await axios.get(uri)

                var currentItemURI = await nftContract.methods.tokenURI(item.tokenId).call()
                var currentItemMetadata = await axios.get(currentItemURI)

                if(i.tokenId !== id && metadata?.data?.collection?.name == currentItemMetadata?.data?.collection?.name) {
                    var props = await Promise.all(metadata?.data?.collection?.nft?.properties.map(async prop => {
                        return prop
                    }))
                    return props
                }

            }))

            setNftAsset(metadata.data.collection.nft.fileType)

            const filteredCollectionProperties = moreFromCollection.filter((element) => { return element !== undefined })

            for(var i = 0; i < properties.length; i++) {
                var propCount = 1
                var totalCount = 1
                for(var j = 0; j < filteredCollectionProperties.length; j++) {
                    for(var k = 0; k < filteredCollectionProperties[j].length; k++) {
                        if(filteredCollectionProperties[j][k].property == properties[i].property && filteredCollectionProperties[j][k].value == properties[i].value) {
                            propCount += 1
                        }
                    }
                    totalCount += 1
                }
                properties[i].proportion = propCount * 100 / totalCount
            }

            var events = await marketContract.methods.getTokenEventHistory(id).call()

            // console.log(events)

            var offerCount = item.offerCount

            var offers = await marketContract.methods.getTokenOfferList(id).call()

            setOffers(offers)

            setEventHistory(events)
            setLoadingState('loaded')
            setNFts(collection)
            setNFT(currentItem)
            setMetadata(metadata.data)
            setPropertyProportions(properties)
            setWallet(wallet?.wallet)
            setApproved(getVal)
            setMoreFromCollectionNfts(moreFromCollectionItems)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setWallet(props.wallet)
        getData()
    }, [])
    useEffect(() => {
        setWallet(props.wallet)
    }, [props.wallet])

    return (
        <div>
            <header className='secondary-page-header'>
                <></>
            </header>
            <div className="nft-detail">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    {loadingState === "loaded" &&
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="nft-image">
                                {isImage(nftAsset)
                                    ? <img src={metadata?.collection?.nft?.image ? metadata.collection.nft.image : ""} />
                                    : <></>
                                }
                                {isVideo(nftAsset)
                                    ? <video controls>
                                        <source src={metadata?.collection?.nft?.image ? metadata.collection.nft.image : ""} type={nftAsset.type}/>
                                    </video>
                                    : <></>
                                }
                                {isAudio(nftAsset)
                                    ? <audio controls>
                                        <source src={metadata?.collection?.nft?.image ? metadata.collection.nft.image : ""} type={nftAsset.type}/>
                                    </audio>
                                    : <></>
                                }
                                {metadata?.collection?.nft?.properties && metadata?.collection?.nft?.properties[0]?.property !== ""
                                    ? <>
                                        <div className="nft-properties mt-10">
                                            <button type='button' className='nft-properties-collapsible' onClick={showProperties}>Properties</button>
                                            <div className='nft-property-tags grid grid-cols-1 md:grid-cols-3 gap-2'>
                                                {propertyProportions.map((property, index) => (
                                                    <>
                                                        <PropertyCard property={property.property} value={property.value} proportion={property.proportion.toFixed(2)} />
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                                }
                                {nft?.owner === wallet?.address
                                    ? <>
                                        {metadata?.collection?.nft?.unlockableContent
                                            ? <>
                                                <div className='unlockable-content-div mt-2'>
                                                    <button type='button' className='unlockable-content-collapsible' onClick={showUnlockableContent}>Unlocked Content</button>
                                                    <div className='unlockable-content'>
                                                        <p>{metadata?.collection?.nft?.unlockableContent}</p>
                                                    </div>
                                                </div>
                                            </>
                                            : <></>
                                        }
                                    </> 
                                    : <></>
                                }
                            </div>
                            <div className="col-span-2 nft-details">
                                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                                    <div className=" nft-details-header">
                                        <h2 className="nft-h2">{metadata?.collection?.nft?.name ? metadata.collection.nft.name : "Undefined Name"}</h2>
                                        <p className="nft-label">{metadata?.collection?.nft?.name ? metadata.collection.nft.description : "Undefined Description"}</p>
                                    </div>
                                    <div className="py-4 grid grid-cols-1 md:grid-cols-1">
                                        <div className="flex nft-details-owner-card my-1">
                                            <div className="mr-2">
                                                <img src="/collections.png" />
                                            </div>
                                            <div>
                                                <p className="nft-label mb-2">Owner</p>
                                                <h2 className="nft-label text-white">{nft?.owner ? nft.owner : "Undefined Owner"}</h2>
                                            </div>
                                        </div>

                                        <div className="flex nft-details-owner-card my-1">
                                            <div className="mr-2">
                                                <img src="/collections.png" />
                                            </div>
                                            <div>
                                                <p className="nft-label mb-2">Collection</p>
                                                <Link className="nft-label text-white" to={`/${metadata?.collection?.name ? `collection/${metadata.collection.name}` : "discover"}`}>{metadata?.collection?.name ? metadata.collection.name : "Undefined Collection"}</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nft-details-price block items-end md:flex">
                                        <div>
                                            <p className="nft-label mb-1">Current Price</p>
                                            <h5 className="flex items-center text-white"><img src="/xdc-icon.png" className="nft-xdc-24 mr-2" />{nft?.price ? nft.price : "Unable to fetch"} XDC <span className="nft-label mx-4"></span></h5>
                                        </div>
                                        <div>
                                            {wallet?.connected 
                                                ? nft?.isListed
                                                    ? nft?.owner === wallet?.address
                                                        ? <>
                                                            <button onClick={() => {withdrawListing(nft)}} className="nft-btn-gradient h-32 py-0 px-3 my-1 mx-2">{contractFixes?.includes(nft?.tokenId) ? "Withdraw Old" : "Withdraw Listing"}</button>
                                                            {
                                                                blacklist?.includes(nft?.tokenId)
                                                                ? <></>
                                                                : <button onClick={() => {editListing(nft)}} className="nft-btn-gradient h-32 py-0 px-3 my-1 mx-2">Edit Listing</button>
                                                            }
                                                        </>
                                                        : <>
                                                            {
                                                                blacklist?.includes(nft?.tokenId)
                                                                ? <></>
                                                                : <button onClick={() => {placeOffer(nft)}} className="nft-btn-gradient h-32 p-0 my-1 mx-2">Place Offer</button>
                                                            }
                                                        <button onClick={() => {buyNFT(nft)}} className="nft-btn-gradient h-32 p-0 my-1 mx-2">Buy</button></>
                                                    : blacklist?.includes(nft?.tokenId)
                                                        ? <></>
                                                        : nft?.owner === wallet?.address
                                                            ? <><button onClick={() => {startSale(nft)}} className="nft-btn-gradient h-32 p-0 my-1 mx-2">List</button><button onClick={() => {startTransfer(nft)}} className="nft-btn-gradient h-32 p-0 my-1">Transfer</button></>
                                                            : <><button onClick={() => {placeOffer(nft)}} className="nft-btn-gradient h-32 p-0 my-1 mx-2">Place Offer</button></>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='text-white'>
                                        <p className='nft-label my-2'>{`The sale of this NFT provides ${nft?.royalty}% royalty to the creator.`}</p>
                                    </div>

                                    <div>

                                        <div className="border-b border-gray-200 pt-12">
                                            <ul className="flex flex-wrap -mb-px">
                                            <li className="mr-2">
                                                    <p onClick={() => setTab('token')}
                                                        className={`inline-block px-2 py-2 m-0 cursor-pointer text-sm font-medium text-center rounded-t-lg border-b-2 ${tab === 'token' ? 'active-tab border-white active font-bold' : 'font-secondary border-transparent hover:border-white'}`}>Token
                                                        Detail</p>
                                                </li>
                                                <li className="mr-2">
                                                    <p onClick={() => setTab('price')}
                                                        className={`inline-block px-2 py-2 m-0 cursor-pointer text-sm font-medium text-center rounded-t-lg border-b-2 ${tab === 'price' ? 'active-tab border-white active font-bold' : 'font-secondary border-transparent hover:border-white'}`}>Events</p>
                                                </li>
                                                <li className="mr-2">
                                                    <p onClick={() => setTab('offers')}
                                                        className={`inline-block px-2 py-2 m-0 cursor-pointer text-sm font-medium text-center rounded-t-lg border-b-2 ${tab === 'offers' ? 'active-tab border-white active font-bold' : 'font-secondary border-transparent hover:border-white'}`}>Offers</p>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            {tab === 'offers' && <Offers confirmAcceptOffer={confirmAcceptOffer} withdrawOffer={withdrawOffer} wallet={wallet} tokenId={nft?.tokenId} loadingState={loadingState} offers={offers} />}
                                            {tab === 'token' && <TokenDetails nftAddress={nftaddress} id={nft?.tokenId} />}
                                            {tab === 'price' && <PriceHistory loadingState={loadingState} events={eventHistory} />}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                    //     : <SkeletonMyNFT />
                    }
                </div>

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
                <Transition.Root show={acceptingOffer} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeAcceptOffer}>
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
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle" style={{"width": "600px"}}>
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>{confirmingAcceptOffer ? "Are you sure you want to accept this offer?" : acceptOfferSuccess ? "NFT Offer Successfully Accepted!" : acceptOfferFailure ? "Acceptance failed!" : "Accepting the NFT Offer!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {confirmingAcceptOffer
                                                    ? <>
                                                        <h4>You are about to accept the offer made by {offerSender} for {offerPrice}. Would you like to proceed?</h4>
                                                        <button className="nft-btn-gradient h-32 py-0 my-1 mx-2" onClick={acceptOffer}>Yes</button>
                                                        <button className="nft-btn-gradient h-32 py-0 my-1 mx-2" onClick={closeAcceptOffer}>No</button>
                                                    </>
                                                    : <>
                                                        {acceptOfferSuccess 
                                                            ? <>
                                                                <h4>The offer has been successfully accepted. The NFT will be delivered to the respective owner.</h4>
                                                                <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeAcceptOffer}>Ok!</button>
                                                            </>
                                                            : <>
                                                                {acceptOfferFailure
                                                                    ? <>
                                                                        <h4>Something went wrong with accepting the NFT Offer. Please refresh the page to ensure the offer has not been withdrawn and try again!</h4>
                                                                        <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeAcceptOffer}>Ok!</button>
                                                                    </>
                                                                    : <h4>We are accepting the chosen offer placed on your NFT! Thank you for your patience!</h4>
                                                                }
                                                            </>
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
                <Transition.Root show={withdrawingOffer} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeWithdrawOffer}>
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
                                        <h2 className='text-center gradient-text'>{withdrawOfferSuccess ? "NFT Offer Successfully Withdrawn!" : withdrawOfferFailure ? "Withdrawal failed!" : "Withdrawing your NFT Offer!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {withdrawOfferSuccess 
                                                ? <>
                                                    <h4>The offer for {nft?.name} has been successfully withdrawn.</h4>
                                                    <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeWithdrawOffer}>Ok!</button>
                                                </>
                                                : <>
                                                    {withdrawOfferFailure
                                                        ? <>
                                                            <h4>Something went wrong with withdrawing the NFT Offer. Please try again!</h4>
                                                            <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeWithdrawOffer}>Ok!</button>
                                                        </>
                                                        : <h4>We are withdrawing the active offer you placed on the NFT! Thank you for your patience!</h4>
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

                <Transition.Root show={editing} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeEdit}>
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
                                        <h2 className='text-center gradient-text'>{settingPrice ? "Set Sell Price" : editSuccess ? "Listing successfully updated!" : editFailure ? "Transaction failed!" : "Updating your listing!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {settingPrice 
                                                ? <>
                                                    <input type="number" className="nft-input" name="sellPrice" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
                                                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button className="nft-btn-gradient h-32 py-0 my-1" disabled={sellPrice === 0 || sellPrice?.length === 0} onClick={() => {editNFT()}}>{approved ? "Submit" : "Approve and Submit"}</button>
                                                        <button className="nft-btn-linear-gradient light h-32 py-0 ml-2 my-1 mr-2" onClick={closeEdit} ref={cancelButtonRef}>Cancel</button>
                                                    </div>
                                                </>
                                                : <>
                                                    {editSuccess
                                                        ? <>
                                                            <h4>The listing for {editedNFT?.name} has been successfully updated on the marketplace.</h4>
                                                            <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeEdit}>Ok!</button>
                                                        </> 
                                                        : <>
                                                            {editFailure
                                                                ? <>
                                                                    <h4>Something went wrong with editing the NFT listing. Please check your wallet connection and try again!</h4>
                                                                    <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeEdit}>Ok!</button>
                                                                </>
                                                                : <h4>We are updating the listing of your NFT on the marketplace. Please be patient!</h4>
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
                <Transition.Root show={offering} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeOffer}>
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
                                        <h2 className='text-center gradient-text'>{settingPrice ? "Set Offer Price" : offerSuccess ? "Offer successfully placed!" : offerFailure ? "Placing an offer has failed!" : "Placing the offer!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {settingPrice 
                                                ? <>
                                                    <input type="number" className="nft-input" name="sellPrice" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
                                                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button className="nft-btn-gradient h-32 py-0 my-1" disabled={sellPrice === 0 || sellPrice?.length === 0} onClick={() => {offer()}}>{approved ? "Submit" : "Approve and Submit"}</button>
                                                        <button className="nft-btn-linear-gradient light h-32 py-0 ml-2 my-1 mr-2" onClick={closeOffer} ref={cancelButtonRef}>Cancel</button>
                                                    </div>
                                                </>
                                                : <>
                                                    {offerSuccess
                                                        ? <>
                                                            <h4>The offer for {offerData?.name} has been successfully placed.</h4>
                                                            <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeOffer}>Ok!</button>
                                                        </> 
                                                        : <>
                                                            {offerFailure
                                                                ? <>
                                                                    <h4>Something went wrong while placing an order for the NFT listing. Please check your wallet connection and try again!</h4>
                                                                    <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeOffer}>Ok!</button>
                                                                </>
                                                                : <h4>We are placing an order for this NFT on the marketplace. Please be patient!</h4>
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
                <Transition.Root show={transferring} as={Fragment}>
                    <Dialog as="div" className="fixed z-999 inset-0 overflow-y-auto" onClose={closeTransfer}>
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
                                    className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle" style={{"width": "550px"}}>
                                    <div className="bg-black text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h2 className='text-center gradient-text'>{settingPrice ? "Enter the recipient's wallet address" : transferSuccess ? "NFT Successfully Transferred!" : transferFailure ? "Transaction failed!" : "Transferring your NFT!"}</h2>
                                        <div className="mt-3 text-center">
                                            <div className="mt-2 w-full">
                                                {settingPrice 
                                                ? <>
                                                    <input className="nft-input" name="transferAddress" value={transferAddress} onChange={e => setTransferAddress(e.target.value)} />
                                                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button className="nft-btn-gradient h-32 py-0 my-1" disabled={transferAddress === '0x0000000000000000000000000000000000000000' || transferAddress?.length === 0} onClick={() => {transfer()}}>{approved ? "Submit" : "Approve and Submit"}</button>
                                                        <button className="nft-btn-linear-gradient light h-32 py-0 ml-2 my-1 mr-2" onClick={closeTransfer} ref={cancelButtonRef2}>Cancel</button>
                                                    </div>
                                                </>
                                                : <>
                                                    {transferSuccess
                                                        ? <>
                                                            <h4 style={{"width" : "auto"}}>{transferNFT?.name} was successfully transferred to {transferAddress}.</h4>
                                                            <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeTransfer}>Ok!</button>
                                                        </>
                                                        : <>
                                                            {transferFailure
                                                                ? <>
                                                                    <h4>Something went wrong with transferring the NFT. Please check your wallet connection and try again!</h4>
                                                                    <button className="nft-btn-gradient h-32 py-0 my-1" onClick={closeTransfer}>Ok!</button>
                                                                </>
                                                                : <h4>We are transferring the NFT to the selected address. Please be patient!</h4>
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
                

                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    {!moreFromCollectionNfts.length ? <></> : <h2 className="nft-h2 mb-8"><span className="gradient-text">More from this</span> collection</h2>}
                    <div>
                        <div className='collectionNFTs' style={{maxWidth: '1600px'}}>
                            {loadingState === 'loaded' ? (
                                <React.Fragment>
                                    {!moreFromCollectionNfts.length ? <></>
                                    :
                                    <div style={{maxWidth: '1600px'}}>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                            {moreFromCollectionNfts.map((nft, i) => (
                                                <React.Fragment key={i}>
                                                    <Card
                                                        image={nft.image}
                                                        name={nft.name}
                                                        description={nft.description}
                                                        seller={nft.seller}
                                                        price={nft.price}
                                                        owner={nft.owner}
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
                                    </div>
                                    }
                                </React.Fragment>
                            ) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <SkeletonCard/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PriceHistory = (props) => {
    return <div>
        <table className="border-collapse table-auto w-full text-sm">
            <tbody>
            {props.loadingState === 'loaded' ? (
                <React.Fragment>
                    {!props.events.length ? <h1 className='px-4 py-4 text-4x1'>No events have been recorded yet.</h1>
                    :
                    <React.Fragment>
                        {props.events.map((event, i) => 
                            <tr key={i}>
                                <td className="border-b border-gray-300 py-3 pr-3 pl-0 font-secondary">
                                    <div className="flex">
                                        <div>
                                            <h2 className="m-0 from-address">{event.from} <span className="font-secondary">{event.eventType == 0 ? `minted the NFT for ${event.to}` : event.eventType == 1 ? "listed the NFT" : event.eventType == 2 ? "withdrew the NFT listing" : event.eventType == 3 ? `sold the NFT to ${event.to}` : event.eventType == 4 ? `transferred the NFT to ${event.to}` : event.eventType == 5 ? `updated the NFT listing` : event.eventType == 6 ? 'placed an offer' : event.eventType == 7 ? 'withdrew an offer' : `accepted ${event.to}'s offer`}</span></h2>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-b border-gray-300 py-3 pr-3 pl-0 font-secondary"><p className="font-bold m-0 flex items-center"><img src="/xdc-icon.png" className="nft-xdc-20 mr-2" />{event.price !== 0 ? event.price / 1000000000000000000 : ""}</p></td>
                            </tr>
                        )}
                    </React.Fragment>
                    }
                </React.Fragment>
            ) : (
                <></>
            )}
            </tbody>
        </table>
    </div>
}
const Offers = (props) => {
    return <div>
        <table className="border-collapse table-auto w-full text-sm">
            <tbody>
            {props.loadingState === 'loaded' ? (
                <React.Fragment>
                    {props.offers.length === 0 ? <h1 className='px-4 py-4 text-4x1'>No offers have been placed yet.</h1>
                    :
                    <React.Fragment>
                        {props.offers.map((offer, i) => 
                            <tr key={i}>
                                <td className="border-b border-gray-300 py-3 pr-3 pl-0 font-secondary">
                                    <div className="flex">
                                        <div>
                                            {offer.isWithdrawn
                                                ? <>
                                                    <h2 className="m-0 from-address withdrawn-offer">{offer.from} <span className="font-secondary">has placed an offer of {offer.price / 1000000000000000000} XDC</span></h2><h2 className='italic text-gray text-base'>Withdrawn</h2>
                                                </>
                                                : <>
                                                    <h2 className="m-0 from-address">{offer.from} <span className="font-secondary">has placed an offer of {offer.price / 1000000000000000000} XDC</span></h2>
                                                    {props?.wallet?.address === offer.from
                                                        ? <button className="nft-btn-gradient h-32 py-1 my-1" onClick={() => {props?.withdrawOffer(props?.tokenId, i)}}>{"Withdraw Offer"}</button>
                                                        : <></>
                                                    }
                                                    {props?.wallet?.address === offer.to
                                                        ? <button className="nft-btn-gradient h-32 py-1 my-1" onClick={() => {props?.confirmAcceptOffer(props?.tokenId, i, offer.from, offer.price / 1000000000000000000)}}>{"Accept Offer"}</button>
                                                        : <></>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                    }
                </React.Fragment>
            ) : (
                <></>
            )}
            </tbody>
        </table>
    </div>
}
const TokenDetails = (props) => {
    return <div>
                <table className="border-collapse table-auto w-full text-sm">
                    <tbody>
                        <tr>
                            <td className="border-b border-gray-300 py-3 pr-3 pl-0 font-secondary"><p className="font-bold m-0">Contract Address</p></td>
                            <td className="border-b border-gray-300 py-3 pr-0 pl-3 font-secondary text-right">{props.nftAddress}</td>
                        </tr>
                        <tr>
                            <td className="border-b border-gray-300 py-3 pr-3 pl-0 font-secondary"><p className="font-bold m-0">Token</p></td>
                            <td className="border-b border-gray-300 py-3 pr-0 pl-3 font-secondary text-right">{props.id}</td>
                        </tr>
                        <tr>
                            <td className="border-b border-gray-300 py-3 pr-3 pl-0 font-secondary"><p className="font-bold m-0">Block Chain</p></td>
                            <td className="border-b border-gray-300 py-3 pr-0 pl-3 font-secondary text-right">{NETWORK_NAME}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
}
export default NFTDetails;
