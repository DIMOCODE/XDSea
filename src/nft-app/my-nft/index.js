import React, { Fragment, useEffect, useState, useRef } from 'react';
import {useHistory} from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import Xdc3 from 'xdc3'
import { nftaddress, nftmarketaddress, nftmarketlayeraddress } from "../../config";
import { DEFAULT_PROVIDER } from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
// import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import Card from "../home/common/card";
import { GetWallet, SendTransaction } from 'xdc-connect';
import detectEthereumProvider from "@metamask/detect-provider";
import axios from 'axios';
import { LegacyBuyNFT, BuyNFT, SellNFT, LegacyWithdrawListing, WithdrawListing } from '../../common';
import { toXdc } from '../../common/common';
import { XdcConnect } from 'xdc-connect';
import SkeletonCard from "../../common/skeleton/card";
import { fromXdc, isXdc } from '../../common/common';
import NFTMarketLayer1 from '../../abis/NFTMarketLayer1.json'
import { permaBlacklist } from '../../blacklist';

const MyNFT = () => {
    const history = useHistory()
    const [nfts, setNFts] = useState([]);
    const [address, setAddress] = useState('')
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [wallet, setWallet] = useState(null)
    const [page, setPage] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [isFetching, setIsFetching] = useState(false)

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
            history.push(`/nft/${toXdc(listedNFT.nftContract)}/${listedNFT.tokenId}`)
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
            history.push(`/nft/${toXdc(boughtNFT.nftContract)}/${boughtNFT.tokenId}`)
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
            history.push(`/nft/${toXdc(withdrawnNFT.nftContract)}/${withdrawnNFT.tokenId}`)
    }

    const getData = async () => {
        try {
            // console.log(permaBlacklist)
            setBlacklist(permaBlacklist)
            const wallet = await GetWallet();
            setWallet(wallet);
            if(wallet.wallet.connected) {
                const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
                // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
                const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
                const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

                if(wallet.wallet.address !== '')
                    var getVal = await nftContract.methods.isApprovedForAll(isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address, nftmarketlayeraddress).call()
                    // console.log(getVal)

                const data = await marketContract.methods.fetchMyNFTs(isXdc(wallet.wallet.address) ? fromXdc(wallet.wallet.address) : wallet.wallet.address).call()
                const items = await Promise.all(data.slice(0, 12).map(async i => {

                    const uri = await nftContract.methods.tokenURI(i.tokenId).call()

                    var metadata = await axios.get(uri)
                    // const blob = await fetch(metadata?.data?.collection?.nft?.image)
                    //     .then(r => r.blob())

                    var price = await xdc3.utils.fromWei(i.price, "ether")
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
                        fileType: metadata?.data?.collection?.nft?.fileType,
                        preview: metadata?.data?.collection?.nft?.preview
                    }
                    return item
                }))
                setLoadingState('loaded')
                setApproved(getVal)
                setPage(data)
                setNFts(items)
            }
            else{
                // console.log(wallet);
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight - 510) return;
        setIsFetching(true)
    }

    const fetchMoreNFTs = async () => {
        setPageCount(pageCount + 1)
        const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
        const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
        const nfts = await Promise.all(page.slice(pageCount * 12, 12 * (pageCount + 1)).map(async i => {
            const uri = await nftContract.methods.tokenURI(i.tokenId).call()
            var metadata = await axios.get(uri)
            var price = await xdc3.utils.fromWei(i.price, "ether")

            let nft = {
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
                fileType: metadata?.data?.collection?.nft?.fileType,
                preview: metadata?.data?.collection?.nft?.preview
            }

            return nft
        }))
        setNFts(prevState => ([...prevState, ...nfts]));
        setIsFetching(false);
    }

    const viewNFT = data => {
        history.push(`/nft/${nftaddress}/${data.tokenId}`)
    }

    const checkWalletConnection = async () => {
        try {

            await window.ethereum.enable()

            const provider = await detectEthereumProvider()

            const xdc3 = new Xdc3(provider)
            // console.log('==========', xdc3)
            const accounts = await xdc3.eth.getAccounts();
            setAddress(accounts[0])
        } catch (e) {
            console.log(e)
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
        getData()
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])
    useEffect(() => {
        if (!isFetching) return;
        fetchMoreNFTs();
    }, [isFetching]);
    return <div>
        <header className='secondary-page-header'>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                <h2 className="nft-h2"><span className="gradient-text">My</span> NFTs</h2>
            </div>
        </header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
            {/* Replace with your content */}
            <div>
                <div className="trendingItems" style={{maxWidth: '1600px'}}>
                    {loadingState === 'loaded' ? (
                        <React.Fragment>
                            {!nfts.length ?
                                <h1 className='text-white px-4 py-4 text-4x1'>You can either purchase NFTs from the marketplace or mint your own.</h1>
                                :
                                <>
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
                                    <>
                                        {isFetching && <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                            <SkeletonCard/>
                                        </div>      
                                        }
                                    </>
                                </>
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
export default MyNFT