import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Xdc3 from 'xdc3'
import {nftaddress, nftmarketaddress, nftmarketlayeraddress} from "../../config";
import {DEFAULT_PROVIDER} from "../../constant";
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import NFTMarketLayer1 from "../../abis/NFTMarketLayer1.json"
import CollectionCard from "../Home/common/collectionCard";
import {GetWallet} from 'xdc-connect';
import axios from "axios"
import { SendTransaction } from 'xdc-connect';
import SkeletonCollectionCard from '../../common/skeleton/collectionCard';

import styled from "styled-components";
import { LayoutGroup, motion } from "framer-motion/dist/framer-motion";

import { DiscoverFilter } from "../../styles/DiscoverFilter";
import { Collection } from "../../styles/Collection";

import DiscoverBar from "../../images/DiscoverBar.png";
import { HStack, Spacer, VStack } from "../../styles/Stacks";
import { TitleBold27 } from "../../styles/TextStyles";
import { appStyle } from "../../styles/AppStyles";
import ButtonApp from "../../styles/Buttons";
import useWindowSize from "../../styles/useWindowSize";

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
            const collections = await Promise.all(collectionData.slice(0, 12).map(async i => {
                const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                var metadata = await axios.get(uri)
                const collectionData2 = await marketContract.methods.getCollectionNFTs(metadata?.data?.collection?.name).call()
                var volumeTraded = 0
                const uniqueOwners = []
                var lowestPrice = 99999999999999999999999999999
                const allEvents = await Promise.all(collectionData2.map(async item => {
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

                let collection = {
                    name: metadata?.data?.collection?.name,
                    description: metadata?.data?.collection?.description,
                    creator: metadata?.data?.collection?.creator,
                    banner: metadata?.data?.collection?.banner,
                    logo: metadata?.data?.collection?.logo,
                    fileType: metadata?.data?.collection?.nft?.fileType,
                    preview: metadata?.data?.collection?.nft?.preview,
                    floorPrice: lowestPrice,
                    volumeTraded: volumeTraded,
                    items: collectionData2.length,
                    owners: uniqueOwners.length
                }

                return collection
            }))

            var filteredCollections = collections.filter((element) => {
                return element?.name !== "Untitled Collection 7"
            })

            setCollections(filteredCollections)
            setCollectionPage(collectionData)
            
            // const allEvents = await Promise.all(data2.map(async item => {
            //     // console.log(item.tokenId)
            //     var eventCount = item.eventCount
            //     var events = []
            //     for(var i = 1; i <= eventCount; i++) {
            //         var event = await oldMarketContract.methods.getEventHistory(item.itemId, i).call()  
            //         if(event.timestamp >= 1650376040) {
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
        setPageCount(pageCount + 1)
        const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
        const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)
        const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
        const collections = await Promise.all(collectionPage.slice(pageCount * 12, 12 * (pageCount + 1)).map(async i => {
            const uri = await nftContract.methods.tokenURI(i.tokenId).call()
            var metadata = await axios.get(uri)
            const collectionData2 = await marketContract.methods.getCollectionNFTs(metadata?.data?.collection?.name).call()
            var volumeTraded = 0
            const uniqueOwners = []
            var lowestPrice = 99999999999999999999999999999
            const allEvents = await Promise.all(collectionData2.map(async item => {
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

            let collection = {
                name: metadata?.data?.collection?.name,
                description: metadata?.data?.collection?.description,
                creator: metadata?.data?.collection?.creator,
                banner: metadata?.data?.collection?.banner,
                logo: metadata?.data?.collection?.logo,
                fileType: metadata?.data?.collection?.nft?.fileType,
                preview: metadata?.data?.collection?.nft?.preview,
                floorPrice: lowestPrice,
                volumeTraded: volumeTraded,
                items: collectionData2.length,
                owners: uniqueOwners.length
            }

            return collection
        }))

        var filteredCollections = collections.filter((element) => {
            return element?.name !== "Untitled Collection 7"
        })

        setCollections(prevState => ([...prevState, ...filteredCollections]));
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const size = useWindowSize();

    function NavigateTo(route) {
        history.push(`/${route}`);
    }

    return (
    <DiscoverSection>
        {/* Discover Top Bar */}

        <HStack backgroundimage={DiscoverBar}>
            <HStack width="1200px" height="157px" padding="0px 30px">
            <TitleBold27 textcolor={appStyle.colors.white}>Discover Collections</TitleBold27>
            <Spacer></Spacer>
            {/* <ButtonApp
                background="white"
                text="Collections"
                textcolor={appStyle.colors.black}
            ></ButtonApp> */}
            </HStack>
        </HStack>

        {/* Content Discover*/}

        <ContentDiscover>
            <VStack spacing="30px">
            {/* <HStack>
                <DiscoverFilter
                textcolor={({ theme }) => theme.text}
                background={({ theme }) => theme.backElement}
                ></DiscoverFilter>
            </HStack> */}
            <HStack>
                <HStack
                    spacing="30px"
                    flexwrap="wrap"
                    padding="0 30px"
                    justify="flex-start"
                    width={size.width < 768 ? "100%" : "1100px"}
                >
                {collections.map((item) => (
                    <VStack
                        minwidth={size.width < 768 ? "100%" : "500px"}
                        maxwidth="500px"
                        height={size.width < 768 ? "440px" : "420px"}
                    >
                        <Collection
                            key={item.name}
                            collectionImage={item.banner}
                            creatorLogo={item.logo}
                            collectionName={item.name}
                            collectionDescription={
                                item.description
                            }
                            creatorName={item.creator}
                            onClickCollection={() =>
                                NavigateTo(`collection/${item.name}`)
                            }
                            floorprice={item.floorPrice}
                            owners={item.owners}
                            nfts={item.items}
                            volumetraded={item.volumeTraded}
                            // onClickCreator={() => NavigateTo("UserProfile")}
                        ></Collection>
                    </VStack>
                ))}
                </HStack>
            </HStack>
            </VStack>
        </ContentDiscover>
    </DiscoverSection>
    );
}

export { Discover };

const DiscoverSection = styled(motion.div)`
  padding: 90px 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.06);
`;

const ContentDiscover = styled(motion.div)`
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
`;