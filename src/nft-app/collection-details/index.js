import React, {Fragment, useRef, useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Xdc3 from 'xdc3'
import {nftaddress, nftmarketaddress, nftmarketlayeraddress} from "../../config";
import {DEFAULT_PROVIDER} from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
// import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import Card from "../home/common/card";
// import CollectionCard from "../home/common/collectionCard";
import {GetWallet, SendTransaction} from 'xdc-connect';
import axios from "axios"
import { LegacyBuyNFT, BuyNFT, SellNFT, LegacyWithdrawListing, WithdrawListing } from '../../common';
import { Dialog, Transition } from '@headlessui/react';
import {toXdc} from '../../common/common';
import SkeletonCard from "../../common/skeleton/card";
import { fromXdc, isXdc } from '../../common/common';
import NFTMarketLayer1 from '../../abis/NFTMarketLayer1.json'
import { permaBlacklist } from '../../blacklist';

const CollectionDetails = (props) => {
    const history = useHistory()
    const [nfts, setNFts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [wallet, setWallet] = useState(null)
    const [page, setPage] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    const [collections, setCollections] = useState([])
    const [collection, setCollection] = useState({})
    const [showingDescription, setShowingDescription] = useState(false);
    const [collectionOwners, setCollectionOwners] = useState([]);
    const [floorPrice, setFloorPrice] = useState(999999999999999999999999999999999999999999999);
    const [volume, setVolume] = useState(0.00);

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

    const { collectionName } = useParams()

    const getData = async () => {
        try {
            // console.log(permaBlacklist)
            setBlacklist(permaBlacklist)
            const wallet = await GetWallet();
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
            const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

            if(wallet.wallet.address !== '')
                var getVal = await nftContract.methods.isApprovedForAll(isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address, nftmarketlayeraddress).call()

            const collectionData = await marketContract.methods.getCollectionNFTs(collectionName).call()
            // console.log('============', data)
            const collectionItems = await Promise.all(collectionData.slice(0, 12).map(async i => {
                const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                var metadata = await axios.get(uri)     
                var price = await xdc3.utils.fromWei(i.price, "ether")
                
                let item = {
                    price: price,
                    tokenId: i.tokenId,
                    itemId: i.itemId,
                    owner: i.owner,
                    collectionName: metadata?.data?.collection?.name,
                    collectionBanner: metadata?.data?.collection?.banner,
                    collectionCreator: metadata?.data?.collection?.creator,
                    collectionDescription: metadata?.data?.collection?.description,
                    collectionDiscord: metadata?.data?.collection?.discordUrl,
                    collectionInstagram: metadata?.data?.collection?.instagramUrl,
                    collectionLogo: metadata?.data?.collection?.logo,
                    collectionTwitter: metadata?.data?.collection?.twitterUrl,
                    collectionWebsite: metadata?.data?.collection?.websiteUrl,
                    image: metadata?.data?.collection?.nft?.image,
                    name: metadata?.data?.collection?.nft?.name,
                    description: metadata?.data?.collection?.nft?.description,
                    nftContract: i.nftContract,
                    isListed: i.isListed,
                    eventCount: i.eventCount,
                    fileType: metadata?.data?.collection?.nft?.fileType,
                    preview: metadata?.data?.collection?.nft?.preview
                }
                return item
            }))
            var filteredCollectionItems = collectionItems.filter((element) => {
                return element?.tokenId !== "119" && element?.tokenId !== "1778" && element?.tokenId !== "2756"
            })
            var volumeTraded = 0
            const uniqueOwners = []
            var lowestPrice = 99999999999999999999999999999
            const allEvents = await Promise.all(collectionData.map(async item => {
                var price = await xdc3.utils.fromWei(item.price, "ether")
                if(!uniqueOwners.includes(item.owner)) {
                    uniqueOwners.push(item.owner);
                }
                if(parseInt(price) < lowestPrice) {
                    lowestPrice = parseInt(price)
                }
                var eventCount = item.eventCount
                var events = []
                var tokenEvents = await marketContract.methods.getTokenEventHistory(item.tokenId).call()
                for(var j = 0; j < tokenEvents.length; j++) {
                    if(tokenEvents[j].eventType === "3" || tokenEvents[j].eventType === "8"){
                        volumeTraded += parseInt(await xdc3.utils.fromWei(tokenEvents[j].price, "ether"))
                    }
                }
                return events
            }))

            setFloorPrice(lowestPrice)
            setVolume(volumeTraded)
            setLoadingState('loaded')
            setNFts(filteredCollectionItems)
            setPage(collectionData)
            setCollectionOwners(uniqueOwners)
            setApproved(getVal)
        } catch (error) {
            console.log(error)
        }
    }

    const handleScroll = () => {
        // console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight)
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight - 510) return;
        setIsFetching(true)
    }

    const fetchMoreNFTs = async () => {
        setPageCount(pageCount + 1)
        const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
        const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
        const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
        const nfts = await Promise.all(page.slice(pageCount * 12, 12 * (pageCount + 1)).map(async i => {
            const uri = await nftContract.methods.tokenURI(i.tokenId).call()
            var metadata = await axios.get(uri)
            var price = await xdc3.utils.fromWei(i.price, "ether")

            let nft = {
                price: price,
                tokenId: i.tokenId,
                itemId: i.itemId,
                owner: i.owner,
                collectionName: metadata?.data?.collection?.name,
                collectionBanner: metadata?.data?.collection?.banner,
                collectionCreator: metadata?.data?.collection?.creator,
                collectionDescription: metadata?.data?.collection?.description,
                collectionDiscord: metadata?.data?.collection?.discordUrl,
                collectionInstagram: metadata?.data?.collection?.instagramUrl,
                collectionLogo: metadata?.data?.collection?.logo,
                collectionTwitter: metadata?.data?.collection?.twitterUrl,
                collectionWebsite: metadata?.data?.collection?.websiteUrl,
                image: metadata?.data?.collection?.nft?.image,
                name: metadata?.data?.collection?.nft?.name,
                description: metadata?.data?.collection?.nft?.description,
                nftContract: i.nftContract,
                isListed: i.isListed,
                eventCount: i.eventCount,
                fileType: metadata?.data?.collection?.nft?.fileType,
                preview: metadata?.data?.collection?.nft?.preview
            }

            return nft
        }))
        var filteredCollectionItems = nfts.filter((element) => {
            return element?.tokenId !== "119" && element?.tokenId !== "1778" && element?.tokenId !== "2756"
        })

        setNFts(prevState => ([...prevState, ...filteredCollectionItems]));
        setIsFetching(false);
    }

    const viewNFT = data => {
        history.push(`/nft/${nftaddress}/${data.tokenId}`)
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
    
    const showDescription = () => {
        if(showingDescription) {
            var description = document.getElementById('collection-description-text');
            description.style.height = "50px";
            setShowingDescription(false)
        }
        else {
            var description = document.getElementById('collection-description-text');
            description.style.height = "100px";
            setShowingDescription(true)
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
    useEffect(() => {
        setWallet(props.wallet)
        getData()
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])
    useEffect(() => {
        if (!isFetching) return;
        fetchMoreNFTs();
    }, [isFetching]);
    useEffect(() => {
        setWallet(props.wallet)
    }, [props.wallet])
    return <div>
        <header className='secondary-page-header'>
            <div className='collection-banner'>
                <img alt='Collection Banner' src={collectionName === "DØP3 Punks " ? "/hfnn-jfjd-ornj.jpeg" : nfts[0]?.collectionBanner}></img>
            </div>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6 text-center">
                <div className="collection-logo">
                    <img alt='Collection Logo' src={collectionName === "DØP3 Punks " ? "/ghnj-hjoe-nfks.jpeg" : nfts[0]?.collectionLogo}></img>
                </div>
                <h1 className="nft-h1"><span className="gradient-text">{collectionName}</span></h1>
                <h6 className='nft-h3 text-white'><span className='gradient-text'>Created by</span> {nfts[0]?.collectionCreator}</h6>
                <div className='collection-social-links mt-7'>
                    {nfts[0]?.collectionTwitter !== undefined && nfts[0]?.collectionTwitter !== ""
                        ? <span><a href={nfts[0]?.collectionTwitter}><img src="/twitter.svg" className="w-8 h-8 xdc-icon mr-2"/></a></span>
                        : <></>
                    }
                    {nfts[0]?.collectionInstagram !== undefined && nfts[0]?.collectionInstagram !== ""
                        ? <span><a href={nfts[0]?.collectionInstagram}><img src="/instagram.svg" className="w-8 h-8 xdc-icon mr-2"/></a></span>
                        : <></>
                    }
                    {nfts[0]?.collectionDiscord !== undefined && nfts[0]?.collectionDiscord !== ""
                        ? <span><a href={nfts[0]?.collectionDiscord}><img src="/discord.svg" className="w-7 h-7 xdc-icon mr-2"/></a></span>
                        : <></>
                    }
                    {nfts[0]?.collectionWebsite !== undefined && nfts[0]?.collectionWebsite !== ""
                        ? <span><a href={nfts[0]?.collectionWebsite}><img src="/website.png" className="w-8 h-8 xdc-icon mr-2"/></a></span>
                        : <></>
                    }
                </div>
            </div>
            <div className='collection-details max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='collection-count'>
                    <h2 className='text-white text-center'>{collectionName == "The Lucid Women" || collectionName == "NFTHC" || collectionName == "DØP3 Punks " ? page.length - 1 : page.length}</h2>
                    <h5 className='text-white text-center'>{page.length === 1 ? "Item" : "Items"}</h5>
                </div>
                <div className='collection-owners'>
                    <h2 className='text-white text-center'>{collectionOwners.length}</h2>
                    <h5 className='text-white text-center'>{collectionOwners.length === 1 ? "Owner" : "Owners"}</h5>
                </div>
                <div className='collection-floor-price'>
                    <h2 className='text-white text-center'><img src="/xdc-icon.png" className="w-8 h-8 xdc-icon mr-2"/>{`${floorPrice}`}</h2>
                    <h5 className='text-white text-center'>Floor Price</h5>
                </div>
                <div className='collection-volume-traded'>
                    <h2 className='text-white text-center'><img src="/xdc-icon.png" className="w-8 h-8 xdc-icon mr-2"/>{`${volume}`}</h2>
                    <h5 className='text-white text-center'>Trade Volume</h5>
                </div>
            </div>
            {/* <div className='description-gradient'></div> */}
            {collectionName === "DØP3 Punks " ? 
                <div className='max-w-7xl mx-auto py-6 px-4 text-center text-white collection-description'>
                    <p id='collection-description-text'>"A multichain NFT project minting collections on every major blockchain!<br></br><br></br>Where DØP3 Art Meets Web3"</p>
                    {/* <button onClick={showDescription} className='w-full'>{showingDescription ? "Show Less" : "Show More"}</button> */}
                </div> : 
                nfts[0]?.collectionDescription !== undefined ? 
                    <div className='max-w-7xl mx-auto py-6 px-4 text-center text-white collection-description'>
                        <p id='collection-description-text'>{nfts[0]?.collectionDescription}</p>
                        {/* <button onClick={showDescription} className='w-full'>{showingDescription ? "Show Less" : "Show More"}</button> */}
                    </div>
                    : <></>
            }
        </header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
            {/* Replace with your content */}
            <div>
                <div className='collectionNFTs' style={{maxWidth: '1600px'}}>
                    {loadingState === 'loaded' ? (
                        <>
                        {!nfts.length 
                        ? <h1 className='text-white px-4 py-4 text-4x1'>You will be able to mint your own NFTs soon.</h1>
                        : 
                        <>
                            <div style={{maxWidth: '1600px'}}>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    {nfts.map((nft, i) => (
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
                            <>
                                {isFetching && <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <SkeletonCard/>
                                </div>      
                                }
                            </>
                        </>
                        }
                        </>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                <SkeletonCard/>
                            </div>
                        )}
                </div>
                {loadingState === 'loaded' && !nfts.length ? <h1 className='text-white px-4 py-4 text-4x1'>You will be able to mint your own NFTs soon.</h1>
                    :
                    <div> {/*flex justify-center*/}
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
                }
            </div>
        </div>
    </div>
}
export default CollectionDetails