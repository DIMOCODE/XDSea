import React, { useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation, useHistory } from "react-router-dom";
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import Home from './home'
import ConnectWallet from "./connect-wallet";
import MyNFT from "./my-nft";
import Discover from "./discover";
import CreateToken from "./create-token";
import { XdcConnect, Disconnect } from "xdc-connect";
import NFTDetails from "./nft-details";
import CollectionDetails from "./collection-details";
import Profile from './profile';
import { isXdc, fromXdc } from '../common/common';
import Xdc3 from "xdc3";
import ScrollToTop from '../common/scrollToTop';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const NFTApp = () => {
    const location = useLocation()
    const history = useHistory()
    const [wallet, setWallet] = useState({});

    const navigation = useMemo(() => {
        return [
            { name: 'Discover', href: '/discover', current: location.pathname === '/discover' },
            { name: 'My NFTs', href: '/my-nfts', current: location.pathname === '/my-nfts' },
            { name: 'Create an NFT', href: '/mint-item', current: location.pathname === '/mint-item' },
            // { name: 'Profile', href: '/profile', current: location.pathname === '/profile' },
            // {name: 'Connect Wallet', href: '/connect', current: location.pathname === '/connect'},
        ]
    }, [location.pathname])

    return (
        <>
            <div className="min-h-full nft">
                <div>
                    <Disclosure as="nav" className={`nft-header bg-black ${location.pathname === "/" ? 'nft-header-home' : ''}`}>
                        {({ open }) => (
                            <>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="flex items-center justify-betweenss">
                                        <div className="flex items-center">
                                            <div className="cursor-pointer" onClick={() => history.push('/')}>
                                                <img className="w-30 light-logo" src="/xdsea_logo.svg" alt="XDSea Logo" />
                                                <img className="w-30 dark-logo" src="/xdsea_logo.svg" alt="XDSea Logo" />
                                            </div>
                                            <div className="hidden md:block">
                                                <div className="flex items-baseline space-x-4">
                                                    {navigation.map((item) => (
                                                        (item.name === "My NFTs" || item.name === "Create an NFT") ? (wallet.connected) ? 
                                                        <>
                                                        <Link className={classNames(
                                                            item.current
                                                                ? (location.pathname === "/" ? 'text-white' : 'text-white')
                                                                : `text-gray-400 ${location.pathname === "/" ? 'hover:text-white' : 'hover:text-gray-900'}`,
                                                            'px-3 py-2 rounded-md text-lg font-medium navbarLinks'
                                                        )} key={item.name} to={item.href}>{item.name}
                                                        </Link>
                                                        
                                                        </> : "" :
                                                        <Link className={classNames(
                                                            item.current
                                                                ? (location.pathname === "/" ? 'text-white' : 'text-white')
                                                                : `text-gray-400 ${location.pathname === "/" ? 'hover:text-white' : 'hover:text-gray-900'}`,
                                                            'px-3 py-2 rounded-md text-lg font-medium navbarLinks'
                                                        )} key={item.name} to={item.href}>{item.name}
                                                        </Link>
                                                    ))}
                                                    <XdcConnect btnClass={wallet.connected ? "connected nft-btn-gradient" : "connect nft-btn-gradient"} btnName={wallet.connected ? "Connected" : "Connect"} onConnect={(wallet) => {
                                                        setWallet(wallet); 
                                                        // console.log(wallet)
                                                        }} onAddressChange={(wallet) => {setWallet(wallet)}} onDisconnect={(wallet) => {setWallet(wallet);}} showButton = {wallet.connected ? false : true}/>
                                                    <Disclosure as = "p" className={'text-gray-400 px-3 py-3 rounded-md text-lg font-medium mb-0'}>{wallet.connected ? isXdc(wallet.address) ? fromXdc(wallet.address) : wallet.address : "" }</Disclosure>
                                                    {wallet.connected ? <button className='nft-btn-gradient' onClick = {Disconnect}>Disconnect</button> : ""}
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                             Profile dropdown
                                            <Menu as="div" className="ml-3 relative">
                                                <div>
                                                    <Menu.Button
                                                        className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                        <span className="sr-only">Open user menu</span>
                                                        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt=""/>
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items
                                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {userNavigation.map((item) => (
                                                            <Menu.Item key={item.name}>
                                                                {({active}) => (
                                                                    <a
                                                                        href={item.href}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                                )}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>*/}
                                        <div className="md:hidden nft-menu-button">
                                            {/* Mobile menu button */}
                                            <Disclosure.Button
                                                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <span className="sr-only">Open main menu</span>
                                                {open ? (
                                                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                                                ) : (
                                                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                                )}
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                </div>

                                <Disclosure.Panel className="md:hidden nft-responsive-menu">
                                    <div className="bg-black px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                        {navigation.map((item) => (
                                            <Link className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-white bg-black hover:bg-gray-700 hover:text-white',
                                                'block px-3 py-2 rounded-md text-base font-medium'
                                            )} key={item.name} to={item.href}>{item.name}
                                            </Link>
                                        ))}
                                        <XdcConnect btnClass={wallet.connected ? "connected nft-btn-gradient" : "connect nft-btn-gradient"} btnName={wallet.connected ? "Connected" : "Connect"} onConnect={(wallet) => {
                                                        setWallet(wallet);}} onAddressChange={(wallet) => {setWallet(wallet);}} onDisconnect={(wallet) => {setWallet(wallet);}} showButton = {wallet.connected ? false : true}/>
                                        <Disclosure as = "p" className={'text-white block px-3 py-2 rounded-md text-base font-medium'}>{wallet.connected ? isXdc(wallet.address) ? fromXdc(wallet.address) : wallet.address : "" }</Disclosure>
                                        {wallet.connected ? <button className='nft-btn-gradient' onClick = {Disconnect}>Disconnect</button> : ""}
                                    </div>
                                    {/*<div className="pt-4 pb-3 border-t border-gray-700">
                                    <div className="mt-3 px-2 space-y-1">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                </div>*/}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                </div>
                <div className={location.pathname !== "/" ? 'bg-black' : ''}>
                    {/*<Component {...pageProps} />*/}
                    <ScrollToTop />
                    <Switch>
                        {/*<Route exact path="/my-nfts" component={MyNFTs} />*/}
                        <Route exact path="/discover" component={Discover} />
                        <Route exact path="/mint-item" component={CreateToken} />
                        {/* <Route exact path="/connect" component={ConnectWallet}/> */}
                        <Route exact path="/my-nfts" component={MyNFT} />
                        <Route exact path="/nft/:nftaddress/:id" component={NFTDetails} />
                        <Route exact path="/collection/:collectionName" component={CollectionDetails} />
                        <Route exact path="/" component={Home} />
                        {/* <Route exact path="/profile" component = {Profile} /> */}
                    </Switch>
                </div>
                <footer>

                    <div className="nft-footer">
                        <div className="max-w-7xl mx-auto p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                                <div className="col-span-5">
                                    <div className="nft-footer-logo cursor-pointer" onClick={() => {history.push("/")}}>
                                        <img src="/xdsea-bottom-banner.svg " width = "500" height = "400" />
                                    </div>
                                    <p className="nft-footer-text">The world's first open-source NFT marketplace on the XRC blockchain.</p>
                                    <h4 className='text-white'>Join our community!</h4>
                                    <div className="nft-footer-social">
                                        <span><a href='https://twitter.com/XDSeaNFT'><img src="/twitter.svg"/></a></span>
                                        <span><a href='https://www.instagram.com/xdsea.nft/'><img src="/instagram.svg"/></a></span>
                                        <span><a href='mailto:support@xdsea.com'><img src="/mail.png"/></a></span>
                                    </div>
                                </div>
                                <div className="col-span-7">
                                    <div className="nft-footer-list grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
                                        <div className="mb-4">
                                            <h4>Marketplace</h4>
                                            <Link to="/discover">Discover</Link> <br />
                                            <Link to="/my-nfts">My NFTs</Link><br />
                                            {/* <Link to="/discover">View Collection</Link> */}
                                        </div>
                                        <div className="mb-4">
                                            <h4>Explorer</h4>
                                            <Link to="/mint-item">Create NFT</Link><br />
                                            {/* <Link to="/connect">Connect Wallet</Link><br /> */}
                                            {/* <p>Creators</p> */}
                                        </div>
                                        <div className="mb-4">
                                            {/* <h4>Helpful Links</h4> */}
                                            {/* <p>Blog</p> */}
                                            {/* <p>FAQs</p> */}
                                            {/* <p>Become Creator</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <p className="nft-footer-copy">Copyright @2022 XDSea All Rights Reserved</p>
                        </div>
                    </div>
                </footer>
            </div>
            {/*Background Color: #FF04B4*/}
        </>
    );
};

export default NFTApp;