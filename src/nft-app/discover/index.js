import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Xdc3 from 'xdc3'
import {nftaddress, nftmarketaddress, nftmarketlayeraddress} from "../../config";
import {DEFAULT_PROVIDER} from "../../constant";
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json"
import CollectionCard from "../home/common/collectionCard";
import {GetWallet} from 'xdc-connect';
import axios from "axios"
import { SendTransaction } from 'xdc-connect';
import SkeletonCollectionCard from '../../common/skeleton/collectionCard';

const Discover = () => {
    const history = useHistory()
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [wallet, setWallet] = useState(null)
    const [collections, setCollections] = useState([])
    const [collectionPage, setCollectionPage] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    
    const getData = async () => {
        try {
            const wallet = await GetWallet();
            setWallet(wallet);
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            const oldMarketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
            const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

            const data2 = await oldMarketContract.methods.fetchMarketItems().call()
            console.log(data2.length);
            const newCollections = await Promise.all(data2.slice(600, 650).map(async i => {
                // console.log(i)
                // const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                // var metadata = await axios.get(uri)
                // console.log(metadata?.data?.collection?.nft?.name, metadata?.data?.collection?.name)
                // let data = marketContract.methods.createMarketItem(
                //     nftaddress, 
                //     i.tokenId, 
                //     i.owner, 
                //     i.creator,
                //     i.price,
                //     i.isListed,
                //     i.royalty,
                //     i.eventCount,
                //     metadata?.data?.collection?.nft?.name,
                //     metadata?.data?.collection?.name,
                //     true
                // ).encodeABI()
                
                // const tx = {
                //     from: wallet.wallet.address,
                //     to: nftmarketlayeraddress,
                //     data
                // }
        
                // var gasLimit = await xdc3.eth.estimateGas(tx)
                // tx["gas"] = gasLimit
                // let transaction = await SendTransaction(tx);
            }))

            const collectionData = await marketContract.methods.fetchCollections().call()
            const collections = await Promise.all(collectionData.slice(0, 12).map(async i => {
                const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                var metadata = await axios.get(uri)

                let collection = {
                    name: metadata?.data?.collection?.name,
                    description: metadata?.data?.collection?.description,
                    creator: metadata?.data?.collection?.creator,
                    banner: metadata?.data?.collection?.banner,
                    logo: metadata?.data?.collection?.logo
                }

                return collection
            }))

            setCollections(collections)
            setCollectionPage(collectionData)
            
            const allEvents = await Promise.all(data2.slice(600, 650).map(async item => {
                // var eventCount = item.eventCount
                // var events = []
                // for(var i = 1; i <= eventCount; i++) {
                //     var event = await oldMarketContract.methods.getEventHistory(item.itemId, i).call()
                //     let data = marketContract.methods.addEventsToItem(
                //         item.tokenId,
                //         i,
                //         event.eventType,
                //         event.from,
                //         event.to,
                //         event.price,
                //         event.timestamp
                //     ).encodeABI()

                //     const tx = {
                //         from: wallet.wallet.address,
                //         to: nftmarketlayeraddress,
                //         data
                //     }

                //     var gasLimit = await xdc3.eth.estimateGas(tx)
                //     tx["gas"] = gasLimit
                //     let transaction = SendTransaction(tx)
                // }
                // return events
            }))
            
            setLoadingState('loaded')
        } catch (error) {
            console.log(error)
        }
    }
    const viewCollection = (data) => {
        history.push(`/collection/${data}`)
    }
    const handleScroll = () => {
        console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight)
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight - 510) return;
        setIsFetching(true)
    }
    const fetchMoreCollections = async () => {
        setPageCount(pageCount + 1)
        const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
        const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
        const collections = await Promise.all(collectionPage.slice(pageCount * 12, 12 * (pageCount + 1)).map(async i => {
            const uri = await nftContract.methods.tokenURI(i.tokenId).call()
            var metadata = await axios.get(uri)

            let collection = {
                name: metadata?.data?.collection?.name,
                description: metadata?.data?.collection?.description,
                creator: metadata?.data?.collection?.creator,
                banner: metadata?.data?.collection?.banner,
                logo: metadata?.data?.collection?.logo
            }

            return collection
        }))
        setCollections(prevState => ([...prevState, ...collections]));
        setIsFetching(false);
    }
    useEffect(() => {
        getData()
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])
    useEffect(() => {
        if (!isFetching) return;
        fetchMoreCollections();
    }, [isFetching]);
    return <div className='bg-black'>
        <header className='secondary-page-header'>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                <h2 className="nft-h2"><span className="gradient-text">Discover</span> Collections</h2>
            </div>
        </header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
            <div>
                {loadingState === 'loaded' ? (
                    <React.Fragment>
                        {!collections.length 
                        ? <h1 className='px-4 py-4 text-4x1 text-white'>There are no collections available on the market.</h1>
                        :
                        <>
                            <div className='grid grid-cols-3 gap-4'>
                                {collections.map((collection, i) => (
                                    (collection !== undefined) ?
                                        <React.Fragment key={i}>
                                            <CollectionCard
                                                name={collection.name}
                                                creator = {collection.creator}
                                                banner = {collection.banner}
                                                logo = {collection.logo}
                                                description = {collection.description}
                                                viewCollection={() => viewCollection(collection.name)}
                                                wallet = {wallet}
                                            />
                                        </React.Fragment>
                                    : <></>
                                ))}
                            </div>
                            <>
                                {isFetching && <div className='grid grid-cols-3 gap-4'>
                                    <SkeletonCollectionCard/>
                                </div>      
                                }
                            </>
                        </>
                        }
                    </React.Fragment>
                ) : (
                    <div className='grid grid-cols-3 gap-4'>
                        <SkeletonCollectionCard/>
                    </div>
                )}
            </div>
        </div>
    </div>
}
export default Discover