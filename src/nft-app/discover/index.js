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
import { spotlightCollectionList } from '../../blacklist';

const Discover = () => {
    const history = useHistory()
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [wallet, setWallet] = useState(null)
    const [collections, setCollections] = useState([])
    const [collectionPage, setCollectionPage] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [isFetching, setIsFetching] = useState(false)
    const [lastIndex, setLastIndex] = useState(0)
    
    const getData = async () => {
        try {
            const wallet = await GetWallet();
            setWallet(wallet);
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            const oldMarketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
            const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

            // const data2 = await oldMarketContract.methods.fetchMarketItems().call()
            // console.log(data2.length);
            // const oldData = await Promise.all(data2.map( async i => {
            //     console.log(i.tokenId, i.itemId)
            // }))
            // const newCollections = await Promise.all(data2.slice(1380, 1500).map(async i => {
                // // console.log(i)
                // const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                // var metadata = await axios.get(uri)
                // // console.log(metadata?.data?.collection?.nft?.name, metadata?.data?.collection?.name)
                // let data = marketContract.methods.createMarketItem(
                //     i.tokenId, 
                //     i.itemId,
                //     i.owner, 
                //     i.creator,
                //     i.price,
                //     i.isListed,
                //     i.royalty,
                //     i.eventCount,
                //     metadata?.data?.collection?.nft?.name,
                //     metadata?.data?.collection?.name,
                // ).encodeABI()
                
                // const tx = {
                //     from: wallet.wallet.address,
                //     to: nftmarketlayeraddress,
                //     data
                // }
        
                // var gasLimit = await xdc3.eth.estimateGas(tx)
                // tx["gas"] = gasLimit
                // let transaction = await SendTransaction(tx);
            // }))

            const collectionData = await marketContract.methods.fetchCollections().call()

            const spotlightCollections = await Promise.all(spotlightCollectionList.map(async i => {
                var collectionData = await marketContract.methods.fetchCollection(i).call();
                const uri = await nftContract.methods.tokenURI(collectionData.tokenId).call()
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
            
            // const data56 = await marketContract.methods.fetchMarketItems().call()
            // console.log(data56.length)
            // const offers = await Promise.all(data56.slice(0,1000).map(async i => {
            //     var offerList = await marketContract.methods.getTokenOfferList(i.tokenId).call()
            //     for(var j = 0; j < offerList.length; j++){
            //         if(offerList[j].from == "0xb1F2A68728849A0f3c4740E0A42C73E1691cC2aC") {
            //             console.log(i.tokenId, offerList[j])
            //         }
            //     }
            // }))
            // console.log("Finished")

            setCollections(spotlightCollections)
            setCollectionPage(collectionData)

            // const collections = await Promise.all(
            //     collectionData.slice(100, 300)
            //       .map(async (i) => {
            //         const collectionData2 = await marketContract.methods
            //           .getCollectionNFTs(i.collectionName)
            //           .call();
            //         // console.log(i.collectionName)
            //         var volumeTraded = 0;
            //         const allEvents = await Promise.all(
            //           collectionData2.map(async (item) => {
            //             // console.log(item.name)
            //             var tokenEvents = await marketContract.methods
            //               .getTokenEventHistory(item.tokenId)
            //               .call();
            //             // console.log(tokenEvents)
            //             for (var j = 0; j < tokenEvents.length; j++) {
            //               if (
            //                 tokenEvents[j].eventType === "3" ||
            //                 tokenEvents[j].eventType === "8"
            //               ) {
            //                 //   console.log(tokenEvents[j].price)
            //                 volumeTraded += parseInt(
            //                   await xdc3.utils.fromWei(tokenEvents[j].price, "ether")
            //                 );
            //               }
            //             }
            //             // console.log(volumeTraded);
            //           })
            //         );
          
            //         let collection = {
            //           name: i.collectionName,
            //           volumeTraded: volumeTraded,
            //         };

            //         // console.log(collection)
          
            //         return collection;
            //       })
            //   );

            // const topCollections = collections.sort((collection1, collection2) => {
            //     if(collection1.volumeTraded > collection2.volumeTraded)
            //         return -1;
            //     else return 1;
            // })

            // console.log(topCollections)
            
            // const allEvents = await Promise.all(data2.map(async item => {
            //     // console.log(item.tokenId)
            //     var eventCount = item.eventCount
            //     var events = []
            //     for(var i = 1; i <= eventCount; i++) {
            //         var event = await oldMarketContract.methods.getEventHistory(item.itemId, i).call()  
            //         if(event.timestamp >= 1651244575) {
            //             const uri = await nftContract.methods.tokenURI(item.tokenId).call()
            //             var metadata = await axios.get(uri)
            //             console.log(item, event, metadata?.data?.collection?.nft?.name, metadata?.data?.collection?.name)
                        // let data = marketContract.methods.editMarketItem(
                        //     item.tokenId, 
                        //     item.itemId,
                        //     item.owner, 
                        //     item.creator,
                        //     item.price,
                        //     item.isListed,
                        //     item.royalty,
                        //     item.eventCount,
                        //     0,
                        //     metadata?.data?.collection?.nft?.name,
                        //     metadata?.data?.collection?.name,
                        // ).encodeABI()
                        
                        // const tx = {
                        //     from: wallet.wallet.address,
                        //     to: nftmarketlayeraddress,
                        //     data
                        // }
                
                        // var gasLimit = await xdc3.eth.estimateGas(tx)
                        // tx["gas"] = gasLimit
                        // let transaction = await SendTransaction(tx);

                        // let data = marketContract.methods.addEventsToItem(
                        //     item.tokenId,
                        //     i,
                        //     event.eventType,
                        //     event.from,
                        //     event.to,
                        //     event.price,
                        //     event.timestamp
                        // ).encodeABI()

                        //     const tx = {
                        //         from: wallet.wallet.address,
                        //         to: nftmarketlayeraddress,
                        //         data
                        //     }

                        //     var gasLimit = await xdc3.eth.estimateGas(tx)
                        //     tx["gas"] = gasLimit
                        //     let transaction = SendTransaction(tx)
                //     }
                // }  

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

            //         const tx = {
            //             from: wallet.wallet.address,
            //             to: nftmarketlayeraddress,
            //             data
            //         }

            //         var gasLimit = await xdc3.eth.estimateGas(tx)
            //         tx["gas"] = gasLimit
            //         let transaction = SendTransaction(tx)
            //     }
            // return events
            // }))

            // const topCollections = await Promise.all(collectionData.slice(250, 300).map(async i => {
            //     const uri = await nftContract.methods.tokenURI(i.tokenId).call()
            //     var metadata = await axios.get(uri)
            //     const collectionData2 = await marketContract.methods.getCollectionNFTs(metadata?.data?.collection?.name).call()
            //     var volumeTraded = 0
            //     const allEvents = await Promise.all(collectionData2.map(async item => {
            //         var events = []
            //         var tokenEvents = await marketContract.methods.getTokenEventHistory(item.tokenId).call()
            //         for(var j = 0; j < tokenEvents.length; j++) {
            //             if(tokenEvents[j].eventType === "3" || tokenEvents[j].eventType === "8"){
            //                 volumeTraded += parseInt(await xdc3.utils.fromWei(tokenEvents[j].price, "ether"))
            //             }
            //         }
            //         return events
            //     }))
            //     console.log(metadata?.data?.collection?.name, volumeTraded)
            // }))
            
            setLoadingState('loaded')
        } catch (error) {
            console.log(error)
        }
    }
    const viewCollection = (data) => {
        history.push(`/collection/${data}`)
    }
    const handleScroll = () => {
        // console.log(window.innerHeight, document.documentElement.scrollTop, document.documentElement.offsetHeight)
        if (window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight - 510) return;
        setIsFetching(true)
    }
    const fetchMoreCollections = async () => {
        try{
            setPageCount(pageCount + 1)
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
            var nextPage = []
            const collections = await Promise.all(collectionPage.slice(lastIndex, lastIndex + 24).map(async (i, index) => {
                if(!spotlightCollectionList.includes(i.collectionName) && i.collectionName !== "Untitled Collection 7") {
                    const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                    var metadata = await axios.get(uri)

                    let collection = {
                        id: index,
                        name: metadata?.data?.collection?.name,
                        description: metadata?.data?.collection?.description,
                        creator: metadata?.data?.collection?.creator,
                        banner: metadata?.data?.collection?.banner,
                        logo: metadata?.data?.collection?.logo
                    }

                    nextPage.push(collection)
                }
            }))

            nextPage = nextPage.sort((collection1, collection2) => {if(collection1.id < collection2.id) 
                return -1
            else return 1}).slice(0, 12)
            setLastIndex(lastIndex + nextPage[11].id + 1)

            setCollections(prevState => ([...prevState, ...nextPage]));
            setIsFetching(false);
        }
        catch (error) {
            setIsFetching(false);
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0);
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
                                                banner = {collection.name === "DØP3 Punks " ? "/hfnn-jfjd-ornj.jpeg" : collection.banner}
                                                logo = {collection.name === "DØP3 Punks " ? "/ghnj-hjoe-nfks.jpeg" : collection.logo}
                                                description = {collection.name === "DØP3 Punks " ? `A multichain NFT project minting collections on every major blockchain!\n\nWhere DØP3 Art Meets Web3` : collection.description}
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