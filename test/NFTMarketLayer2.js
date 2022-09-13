const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("XDSeaMarket721", function() {
    let deployer, addr1, addr2, nft, marketplace
    let URI = "Sample URI"
    let nullAddress = "0x0000000000000000000000000000000000000000"
    beforeEach(async function() {
        const NFT721 = await ethers.getContractFactory("NFT721");
        const XDSeaMarket721 = await ethers.getContractFactory("XDSeaMarket721");
        [deployer, addr1, addr2, commissionAddress] = await ethers.getSigners();
        nft = await NFT721.deploy("XDSea NFT v2", "XDSEAv2");
        nft2 = await NFT721.deploy("XDSea NFT v2.1", "XDSEAv2.1");
        marketplace = await XDSeaMarket721.deploy();
    });
    describe("Deployment", function() {
        it("Should track name and symbol of the NFT Collection", async function() {
            expect(await nft.name()).to.equal("XDSea NFT v2")
            expect(await nft.symbol()).to.equal("XDSEAv2")
            expect(await nft2.name()).to.equal("XDSea NFT v2.1")
            expect(await nft2.symbol()).to.equal("XDSEAv2.1")
        })
        it("Should track the owner of the marketplace", async function() {
            expect(await marketplace.marketOwner()).to.equal(deployer.address)
        })
    })
    describe("Minting NFTs", function() {
        it("Should track each minted NFT", async function() {
            await nft.connect(addr1).mint(URI)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            await nft.connect(addr2).mint(URI)
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })
    describe("Burning NFTs", function() {
        it("Should prevent NFTs from being burned by non-owners", async function() {
            await nft.connect(addr1).mint(URI)
            await expect(nft.connect(addr2).burn(1)).to.be.revertedWith("Owner of the NFT can only burn NFTs owned by them");
        })
        it("Should burn the NFTs", async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).burn(1)
            expect(await nft.balanceOf(addr1.address)).to.equal(0);
            await expect(nft.tokenURI(1)).to.be.revertedWith("ERC721: invalid token ID");
        })
    })
    describe("Listing NFTs", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI)
            await nft2.connect(addr1).mint(URI)
        })
        it("Should be listed for a price greater than 0 XDC", async function() {
            await expect(marketplace.connect(addr1).list(nft.address, 1, 0, nullAddress)).to.be.revertedWith("PriceMustBeAboveZero");
        })
        it("Should not list an NFT without approval", async function() {
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)).to.be.revertedWith("NotApprovedForMarketplace");
        })
        it("Should list an approved NFT", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)).to.emit(marketplace, "NFTListed").withArgs(addr1.address, nft.address, 1, nullAddress, toWei(100));
        })
        it("Should list an approved NFT for another contract", async function() {
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress)).to.emit(marketplace, "NFTListed").withArgs(addr1.address, nft2.address, 1, nullAddress, toWei(100));
        })
        it("Should not list an already listed NFT", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)).to.be.revertedWith("NotOwner");
        })
        it("Should transfer NFT from owner to marketplace", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
        })
        it("Should update the listing ledger", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(1);
        })
    })
    describe("Withdrawing NFT Listings", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)
            await nft2.connect(addr1).mint(URI)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress)
        })
        it("Should not let non-owner withdraw an NFT", async function() {
            await expect(marketplace.connect(addr2).withdrawListing(nft.address, 1)).to.be.revertedWith("NotOwner");
        })
        it("Should withdraw an NFT", async function() {
            await expect(marketplace.connect(addr1).withdrawListing(nft.address, 1)).to.emit(marketplace, "NFTWithdrawn").withArgs(addr1.address, nft.address, 1);
        })
        it("Should withdraw an NFT from another contract", async function() {
            await expect(marketplace.connect(addr1).withdrawListing(nft2.address, 1)).to.emit(marketplace, "NFTWithdrawn").withArgs(addr1.address, nft2.address, 1);
        })
        it("Should return NFT to owner", async function() {
            await marketplace.connect(addr1).withdrawListing(nft.address, 1)
            expect(await nft.ownerOf(1)).to.equal(addr1.address);
        })
    })
    describe("Buying NFTs", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)
            await nft2.connect(addr1).mint(URI)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress)
        })
        it("Should not let non-listed NFT be purchased", async function() {
            await marketplace.connect(addr1).withdrawListing(nft.address, 1)
            await expect(marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 0, nullAddress)).to.be.revertedWith("NotListed");
        })
        it("Should check if the correct amount is sent", async function() {
            await expect(marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 0, nullAddress, { value: toWei(100) })).to.be.revertedWith("PriceNotMet");
        })
        it("Should check if the right currency is sent for purchase", async function() {
            await expect(marketplace.connect(addr2).buy(nft.address, 1, marketplace.address, 0, nullAddress, { value: toWei(102) })).to.be.revertedWith("NotTheRightCurrency");
        })
        it("Should not let owner buy their own NFT", async function() {
            await expect(marketplace.connect(addr1).buy(nft.address, 1, nullAddress, 0, nullAddress, { value: toWei(102) })).to.be.revertedWith("OwnerCannotBuyOwnNFT");
        })
        it("Should pay commission if 3rd party uses contract", async function() {
            let commissionAddressBalance = await commissionAddress.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) });
            let commissionAddressBalanceAfter = await commissionAddress.getBalance();
            expect(fromWei(commissionAddressBalanceAfter) - fromWei(commissionAddressBalance)).to.equal(3);
        })
        it("Should pay the marketplace fee", async function() {
            let deployerAddressBalance = await deployer.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) });
            let deployerAddressBalanceAfter = await deployer.getBalance();
            expect(fromWei(deployerAddressBalanceAfter) - fromWei(deployerAddressBalance)).to.equal(2);
        })
        it("Should pay the seller the price", async function() {
            let addr1Balance = await addr1.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) });
            let addr1BalanceAfter = await addr1.getBalance();
            expect(fromWei(addr1BalanceAfter) - fromWei(addr1Balance)).to.equal(100);
        })
        it("Should change ownership of NFT", async function() {
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) });
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        })
        it("Should update the listing ledger", async function() {
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) });
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr2.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(2);
        })
        it("Should buy an NFT", async function() {
            expect(await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) })).to.emit(marketplace, "NFTPurchased").withArgs(addr2.address, nft.address, 1, toWei(105));
        })
        it("Should buy an NFT from another contract", async function() {
            expect(await marketplace.connect(addr2).buy(nft2.address, 1, nullAddress, 3, commissionAddress.address, { value: toWei(105) })).to.emit(marketplace, "NFTPurchased").withArgs(addr2.address, nft2.address, 1, toWei(105));
        })
    })
    describe("Updating Listings", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress)
            await nft2.connect(addr1).mint(URI)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress)
        })
        it("Should only allow owner to update listing", async function() {
            await expect(marketplace.connect(addr2).updateListing(nft.address, 1, toWei(200))).to.be.revertedWith("NotOwner");
        })
        it("Should only update listing if it exists", async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, toWei(100), nullAddress)
            await marketplace.connect(addr1).withdrawListing(nft.address, 2)
            await expect(marketplace.connect(addr1).updateListing(nft.address, 2, toWei(200))).to.be.revertedWith("NotListed");
        })
        it("Should update the price to be greater than 0 XDC", async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, toWei(100), nullAddress)
            await expect(marketplace.connect(addr1).updateListing(nft.address, 2, toWei(0))).to.be.revertedWith("PriceMustBeAboveZero");
        })
        it("Should update listings ledger", async function() {
            await marketplace.connect(addr1).updateListing(nft.address, 1, toWei(200));
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(200));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(1);
        })
        it("Should update NFT listing", async function() {
            expect(await marketplace.connect(addr1).updateListing(nft.address, 1, toWei(200))).to.emit(marketplace, "NFTListEdited").withArgs(addr1.address, nft.address, 1, toWei(200));
        })
        it("Should update NFT listing from another contract", async function() {
            expect(await marketplace.connect(addr1).updateListing(nft2.address, 1, toWei(200))).to.emit(marketplace, "NFTListEdited").withArgs(addr1.address, nft2.address, 1, toWei(200));
        })
    })
    describe("Transferring NFTs", function () {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await nft2.connect(addr1).mint(URI)
            await nft2.connect(addr1).approve(marketplace.address, 1)
        })
        it("Should only allow owner to transfer NFT", async function() {
            await expect(marketplace.connect(addr2).transfer(nft.address, 1, addr2.address)).to.be.revertedWith("NotOwner");
        })
        it("Should not allow transfer to null address", async function() {
            await expect(marketplace.connect(addr1).transfer(nft.address, 1, nullAddress)).to.be.revertedWith("CannotTransferToNull");
        })
        it("Should transfer NFT to the other address", async function() {
            expect(await marketplace.connect(addr1).transfer(nft.address, 1, addr2.address)).to.emit(marketplace, "NFTTransferred").withArgs(addr1.address, nft.address, 1, addr2.address);
        })
        it("Should transfer NFT to the other address from another contract", async function() {
            expect(await marketplace.connect(addr1).transfer(nft2.address, 1, addr2.address)).to.emit(marketplace, "NFTTransferred").withArgs(addr1.address, nft2.address, 1, addr2.address);
        })
        it("Should transfer ownership", async function() {
            await marketplace.connect(addr1).transfer(nft.address, 1, addr2.address)
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
        })
    })
})