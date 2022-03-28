import detectEthereumProvider from '@metamask/detect-provider';
import React, {Component} from 'react';
import Xdc3 from 'xdc3'

export default class ConnectWallet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            provider: null,
            address: null
        };
    }

    setAddress = async (address) => {
        this.setState({
            address: address
        })
    }

    setProvider = async (provider) => {
        this.setState({
            provider: provider
        })
    }

    connectXdc = async () => {

        if (this.state.provider !== null) {
            return
        }
        try {
            if (!window.ethereum) {
                throw new Error("No Wallet Found")
            }

            await window.ethereum.enable()

            const provider = await detectEthereumProvider()

            const xdc3 = new Xdc3(provider)
            const accounts = await xdc3.eth.getAccounts();
            this.setAddress(accounts[0])

            this.setProvider(provider)


        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return <div>
            <header>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h2 className="nft-h2"><span className="gradient-text">Connect</span> Wallet</h2>
                </div>
            </header>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Replace with your content */}
                <div>
                    <div className='walletCard'>
                        <div className="nft-info-card">
                            <h2 className="text-2xl text-grey">Connect to BlocksSea using XDCPay</h2>
                            <div className="my-8">Before purchasing an NFT please to make sure you are connected to the XinFin Main network.
                                <p>Once the below details have been added you can purchase an NFT with XDCPay.</p>
                                <div className="my-8"></div>
                                <p className="text-2xl text-grey mb-4">Connection Details</p>
                                <p><strong>RPC URL:</strong> https://eRPC.BlocksScan.io</p>
                                <p><strong>Chain ID:</strong> 50</p>
                                <p><strong>Currency Symbol:</strong> XDC</p>
                                <p><strong>Block Explorer URL:</strong> https://xdc.BlocksScan.io</p>
                            </div>
                        </div>
                        <div className="nft-info-card">
                            <button className='nft-btn mb-4' onClick={this.connectXdc}>{this.state.provider === null ? "Connect" : "Connected"}</button>
                            <div className="Address">Address : {this.state.address}</div>
                            {/* {wallet.connected ? <button onClick={Disconnect}>Logout</button> : ""} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

