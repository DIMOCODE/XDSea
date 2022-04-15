import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Xdc3 from 'xdc3'
import {nftaddress, nftmarketaddress, nftmarketlayeraddress} from "../../config";
import {DEFAULT_PROVIDER} from "../../constant";
// import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
// import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import NFT from '../../abis/NFT.json'
import NFTMarket from '../../abis/NFTMarket.json'
import Card from "../home/common/card";
import {GetWallet, SendTransaction} from 'xdc-connect';
import axios from "axios"
import { BuyNFT } from '../../common';
import NFTMarketLayer1 from '../../abis/NFTMarketLayer1.json'

const Profile = () => {
    const history = useHistory()
    const [ownedNfts, setOwnedNFts] = useState([]);
    const [createdNfts, setCreatedNFTs] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [wallet, setWallet] = useState({})
    const [profileName, setProfileName] = useState({})
    const [isEditing, setEditingStatus] = useState({});

    const getData = async () => {
        try {
            setEditingStatus(false);
            const wallet = await GetWallet();
            setWallet(wallet);
            const xdc3 = new Xdc3(new Xdc3.providers.HttpProvider(DEFAULT_PROVIDER))
            // const marketContract = new xdc3.eth.Contract(NFTMarket.abi, nftmarketaddress, xdc3)
            const marketContract = new xdc3.eth.Contract(NFTMarketLayer1.abi, nftmarketlayeraddress, xdc3)
            const nftContract = new xdc3.eth.Contract(NFT.abi, nftaddress)

            const data = await marketContract.methods.fetchMyNFTs(wallet.wallet.address).call()
            // console.log('============', data)
            const items = await Promise.all(data.map(async i => {
                if(i.owner === wallet.wallet.address){
                    const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                    // console.log(uri)

                    var metadata = await axios.get(uri)

                    // console.log(metadata.data)

                    // const blob = await fetch(metadata?.data?.collection?.nft?.image)
                    //     .then(r => r.blob())

                    var price = await xdc3.utils.fromWei(i.price, "ether")
                    let item = {
                        price: price,
                        tokenId: i.tokenId,
                        seller: i.seller,
                        owner: i.owner,
                        image: metadata?.data?.image,
                        name: metadata?.data?.name,
                        description: metadata?.data?.description,
                        nftContract: i.nftContract,
                        itemId: i.itemId,
                        fileType: metadata?.data?.collection?.nft?.fileType,
                        preview: metadata?.data?.collection?.nft?.preview
                    }
                    return item
                }   
            }))
            const createdData = await marketContract.methods.fetchItemsCreated(wallet.wallet.address).call()
            // console.log('============ Created Data', createdData)
            const createdItems = await Promise.all(createdData.map(async i => {
                if(i.creator != "0x0000000000000000000000000000000000000000") {
                    const uri = await nftContract.methods.tokenURI(i.tokenId).call()
                    // console.log(uri)

                    var metadata = await axios.get(uri)

                    // console.log(metadata.data)

                    var price = await xdc3.utils.fromWei(i.price, "ether")
                    let item = {
                        price: price,
                        tokenId: i.tokenId,
                        seller: i.seller,
                        owner: i.owner,
                        image: metadata?.data?.image,
                        name: metadata?.data?.name,
                        description: metadata?.data?.description,
                        nftContract: i.nftContract,
                        itemId: i.itemId
                    }
                    return item
                }
            }))
            setLoadingState('loaded')
            setOwnedNFts(items)
            // console.log(items)
            setCreatedNFTs(createdItems)
        } catch (error) {
            console.log(error)
        }
    }
    const editProfile = () => {
        if(!isEditing) {
            setEditingStatus(true);
            document.getElementsByClassName('profileLabel profileName')[0].style.display = 'none';
            var currentProfileName = document.getElementsByClassName('profileLabel profileName')[0].textContent;
            document.getElementsByClassName('nft-input profileName')[0].style.display = 'inline';
            document.getElementsByClassName('nft-input profileName')[0].placeholder = currentProfileName;
        }
        else {
            setEditingStatus(false);
            document.getElementsByClassName('profileLabel profileName')[0].style.display = 'inline';
            document.getElementsByClassName('profileLabel profileName')[0].textContent = profileName;
            document.getElementsByClassName('nft-input profileName')[0].style.display = 'none';
        }
    }
    const buyNFT = async (nft, i) => {
        await BuyNFT(nft, i)
    }
    const viewNFT = (data) => {
        // console.log("Data : ", data)
        history.push(`/nft/${nftaddress}/${data.itemId}`)
    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        // console.log(name);
        // console.log(value);
        setProfileName(value);
    }
    useEffect(() => {
        getData()
    }, [])
    return <div>
        {wallet?.wallet?.connected ?
            (<><header>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    <h2 className="nft-h2"><span className="gradient-text">Profile</span></h2>
                </div>
            </header><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-6">
                    <div>
                        <div>
                            <h2>Name: <span className='profileLabel profileName'>{(profileName == undefined) ? profileName : "Unnamed"}</span><input onChange={handleChange} className='nft-input profileName' name="profileName" /></h2>
                            <h2>Wallet Address: {wallet?.wallet?.address}</h2>
                            <button onClick = {editProfile} className='nft-btn w-full editProfileButton'>{isEditing ? "Save Changes" : "Edit Profile"}</button>
                            <h2>Your Owned NFTs:</h2>
                            {loadingState === 'loaded' && !ownedNfts.length ? <h1 className='px-4 py-4 text-4x1'>Mint your own NFTs here</h1>
                                :
                                <div> {/*flex justify-center*/}
                                    <div style={{ maxWidth: '1600px' }}>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                            {ownedNfts.map((nft, i) => (
                                                (nft !== undefined) ?
                                                    <React.Fragment key={i}>
                                                        <Card
                                                            image={nft.image}
                                                            name={nft.name}
                                                            description={nft.description}
                                                            seller={nft.seller}
                                                            price={nft.price}
                                                            owner={nft.owner}
                                                            buyNFT={() => buyNFT(nft, i)}
                                                            viewNFT={() => viewNFT(nft)}
                                                            wallet={wallet}
                                                            fileType = {nft.fileType} 
                                                            preview = {nft.preview}
                                                        />
                                                    </React.Fragment>
                                                    : ""
                                            ))}
                                        </div>
                                    </div>
                                </div>}
                            <h2>Your Created NFTs: </h2>
                            {loadingState === 'loaded' && !createdNfts.length ? <h1 className='px-4 py-4 text-4x1'>Mint your own NFTs here</h1>
                                :
                                <div> {/*flex justify-center*/}
                                    <div style={{ maxWidth: '1600px' }}>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                            {createdNfts.map((nft, i) => (
                                                (nft !== undefined) ?
                                                <React.Fragment key={i}>
                                                    <Card
                                                        image={nft.image}
                                                        name={nft.name}
                                                        description={nft.description}
                                                        seller={nft.seller}
                                                        price={nft.price}
                                                        owner={nft.owner}
                                                        buyNFT={() => buyNFT(nft, i)}
                                                        viewNFT={() => viewNFT(nft)}
                                                        wallet={wallet} 
                                                        file = {nft.file}
                                                        preview = {nft.preview}
                                                    />
                                                </React.Fragment>
                                                : ""
                                            ))}
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div></>)
            : <h1>Please connect your wallet before viewing your profile</h1>}
    </div>  
}
export default Profile