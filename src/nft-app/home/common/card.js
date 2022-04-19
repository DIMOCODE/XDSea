import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import {toXdc} from "../../../common/common";
import { GetWallet } from 'xdc-connect';

const Card = (props) => {
    const [wallet, setWallet] = useState({})
    const getWalletAddress = async() => {
        const wallet = await GetWallet();
        setWallet(wallet);
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
    useEffect(() => {
        setWallet(props.wallet)
    }, [])
    useEffect(() => {
        // console.log(props?.wallet?.address)
        setWallet(props.wallet)
    }, [props.wallet])
    return (
        <div className="nft-card cursor-pointer" onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            props.viewNFT()
        }}>
            <div className="nft-card-header">
                <h4 className="nft-value">{props.name}</h4>
                {/* <p className="nft-label">{props.description}</p> */}
                <div className='nft-card-collection'>
                    {props?.collection ? <p className='nft-label'>Collection: {props.collection}</p> : <></>}
                </div>
            </div>
            <div className="nft-card-body">
                {isImage(props?.fileType)
                    ? <img alt="NFT Media" src={props.image} />
                    : <></>
                }
                {isVideo(props?.fileType)
                    ? <img alt='NFT Video' src={props.preview} />
                    : <></>
                }
                {isAudio(props?.fileType)
                    ? <img alt='NFT Audio' src={props.preview} />
                    : <></>
                }
            </div>
            <div className="nft-card-footer">
                <div className="nft-card-footer-bid">
                    <p className="nft-label">Price</p>
                    <h4 className="nft-value truncate" title={`${props.price} XDC`}>{props.price} XDC</h4>
                </div>
                <div className="nft-card-footer-bid">
                    {props?.wallet?.connected 
                        ? props.isListed 
                            ? props?.wallet?.address === props.owner 
                                ? <>
                                    <button className='nft-btn-linear' onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        props.withdrawNFT()}}>{"Withdraw Listing"}</button>
                                </> 
                                : <>
                                        <button className="nft-btn-linear" onClick={e => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            props.buyNFT()
                                        }}>{"Buy"}
                                        </button>
                                </> 
                            : props.wallet?.address === props.owner 
                                ? <>
                                    <button className='nft-btn-linear' onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        props.listNFT()}}>{"List"}</button>
                                </> 
                                : <>
                                </>
                        : <></>
                    }
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    viewNFT: PropTypes.func,
    buyNFT: PropTypes.func,
    listNFT: PropTypes.func,
    withdrawNFT: PropTypes.func
}

Card.defaultProps = {
    viewNFT: () => {
    },
    buyNFT: () => {
    },
    listNFT: () => {
    },
    withdrawNFT: () => {
    }
};


export default Card;