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
        const XRC20 = await ethers.getContractFactory("XRC20");
        const NFT = await ethers.getContractFactory("NFT");
        const XDSeaMarketOffers = await ethers.getContractFactory("XDSeaMarketOffers");
        [deployer, addr1, addr2, commissionAddress, royaltyAddr1, royaltyAddr2] = await ethers.getSigners();
        nft = await NFT721.deploy("XDSea NFT v2", "XDSEAv2", 0, royaltyAddr1.address);
        nft2 = await NFT721.deploy("XDSea NFT v2.1", "XDSEAv2.1", 0, royaltyAddr2.address);
        marketplace = await XDSeaMarket721.deploy();
        xrc20 = await XRC20.deploy(100000);
        nft3 = await NFT.deploy(marketplace.address);
        offers = await XDSeaMarketOffers.deploy();
        await xrc20.connect(addr1).mint(100000)
        await xrc20.connect(addr2).mint(100000)
        await xrc20.connect(commissionAddress).mint(100000)
        await xrc20.connect(royaltyAddr1).mint(100000)
        await xrc20.connect(addr1).approve(marketplace.address, 100000)
        await xrc20.connect(addr2).approve(marketplace.address, 100000)
        await xrc20.connect(commissionAddress).approve(marketplace.address, 100000)
        await xrc20.connect(royaltyAddr1).approve(marketplace.address, 100000)
    });
    describe("Deployment", function() {
        it("Should track name and symbol of the NFT Collection", async function() {
            expect(await nft.name()).to.equal("XDSea NFT v2")
            expect(await nft.symbol()).to.equal("XDSEAv2")
            expect(await nft2.name()).to.equal("XDSea NFT v2.1")
            expect(await nft2.symbol()).to.equal("XDSEAv2.1")
            expect(await nft3.name()).to.equal("XDSea Marketplace")
            expect(await nft3.symbol()).to.equal("XDSea Token")
        })
        it("Should track the owner of the marketplace", async function() {
            expect(await marketplace.marketOwner()).to.equal(deployer.address)
        })
    })
    describe("Minting NFTs", function() {
        it("Should track each minted NFT", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            await nft.connect(addr2).mint(URI, nullAddress, 0)
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        })
    })
    describe("Burning NFTs", function() {
        it("Should prevent NFTs from being burned by non-owners", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await expect(nft.connect(addr2).burn(1)).to.be.revertedWith("Owner or Approved sender of the NFT can only burn NFTs owned by them");
        })
        it("Should burn the NFTs", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).burn(1)
            expect(await nft.balanceOf(addr1.address)).to.equal(0);
            await expect(nft.tokenURI(1)).to.be.revertedWith("ERC721URIStorage: URI query for nonexistent token");
        })
    })
    describe("Listing NFTs", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft2.connect(addr1).mint(URI, nullAddress, 0)
            await nft3.connect(addr1).createToken(URI)
        })
        it("Should be listed for a price greater than 0 XDC", async function() {
            await expect(marketplace.connect(addr1).list(nft.address, 1, 0, nullAddress, 0, addr1.address, addr1.address)).to.be.revertedWith("PriceMustBeAboveZero");
        })
        it("Should be listed for a price greater than 0 XRC20", async function() {
            await expect(marketplace.connect(addr1).list(nft.address, 1, 0, xrc20.address, 0, addr1.address, addr1.address)).to.be.revertedWith("PriceMustBeAboveZero");
        })
        it("Should not list an NFT without approval", async function() {
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)).to.be.revertedWith("NotApprovedForMarketplace");
        })
        it("Should not let payout address be null address", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, nullAddress)).to.be.revertedWith("CannotPayNullAddress");
        })
        it("Should list an approved NFT", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)).to.emit(marketplace, "NFTListed").withArgs(addr1.address, nft.address, 1, nullAddress, toWei(100));
        })
        it("Should list an approved NFT with XRC20 price", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), xrc20.address, 0, addr1.address, addr1.address)).to.emit(marketplace, "NFTListed").withArgs(addr1.address, nft.address, 1, xrc20.address, toWei(100));
        })
        it("Should list an approved NFT with external royalty", async function() {
            await nft3.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft3.address, 1, toWei(100), nullAddress, 500, addr1.address, addr1.address)).to.emit(marketplace, "NFTListed").withArgs(addr1.address, nft3.address, 1, nullAddress, toWei(100));
        })
        it("Should list an approved NFT for another contract", async function() {
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await expect(marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)).to.emit(marketplace, "NFTListed").withArgs(addr1.address, nft2.address, 1, nullAddress, toWei(100));
        })
        it("Should not list an already listed NFT", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await expect(marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)).to.be.revertedWith("NotOwner");
        })
        it("Should transfer NFT from owner to marketplace", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
        })
        it("Should update the listing ledger", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(0);
            await expect((await marketplace.getListing(nft.address, 1))[4]).to.equal(royaltyAddr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[5]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[6]).to.equal(1);
        })
        it("Should update the listing ledger for XRC20 token", async function() {
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), xrc20.address, 0, addr1.address, addr1.address)
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(xrc20.address);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(0);
            await expect((await marketplace.getListing(nft.address, 1))[4]).to.equal(royaltyAddr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[5]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[6]).to.equal(1);
        })
        it("Should update the listing ledger with external royalty", async function() {
            await nft3.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft3.address, 1, toWei(100), nullAddress, 500, addr1.address, addr1.address)
            await expect((await marketplace.getListing(nft3.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft3.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft3.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft3.address, 1))[3]).to.equal(500);
            await expect((await marketplace.getListing(nft3.address, 1))[4]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft3.address, 1))[5]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft3.address, 1))[6]).to.equal(1);
        })
        it("Should not update the external royalty once set", async function() {
            await nft3.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft3.address, 1, toWei(100), nullAddress, 500, addr1.address, addr1.address)
            await marketplace.connect(addr1).withdrawListing(nft3.address, 1)
            await nft3.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft3.address, 1, toWei(1000), nullAddress, 1000, commissionAddress.address, addr1.address)
            await expect((await marketplace.getListing(nft3.address, 1))[0]).to.equal(toWei(1000));
            await expect((await marketplace.getListing(nft3.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft3.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft3.address, 1))[3]).to.equal(500);
            await expect((await marketplace.getListing(nft3.address, 1))[4]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft3.address, 1))[5]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft3.address, 1))[6]).to.equal(1);
        })
    })
    describe("Withdrawing NFT Listings", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await nft2.connect(addr1).mint(URI, nullAddress, 0)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
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
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await nft2.connect(addr1).mint(URI, nullAddress, 0)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, 100, xrc20.address, 0, addr1.address, addr1.address)
            await nft3.connect(addr1).createToken(URI)
            await nft3.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft3.address, 1, toWei(100), nullAddress, 500, addr2.address, addr1.address)
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 3)
            await marketplace.connect(addr1).list(nft.address, 3, toWei(100), nullAddress, 0, addr1.address, commissionAddress.address)
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 4)
            await marketplace.connect(addr1).list(nft.address, 4, 100, xrc20.address, 0, addr1.address, commissionAddress.address)
        })
        it("Should not let non-listed NFT be purchased", async function() {
            await marketplace.connect(addr1).withdrawListing(nft.address, 1)
            await expect(marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 0, nullAddress)).to.be.revertedWith("NotListed");
        })
        it("Should check if the correct amount is sent", async function() {
            await expect(marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 0, nullAddress, { value: toWei(100) })).to.be.revertedWith("PriceNotMet");
        })
        it("Should check if the correct amount is sent in XRC20 tokens", async function() {
            await expect(marketplace.connect(royaltyAddr2).buy(nft.address, 2, xrc20.address, 0, nullAddress)).to.be.revertedWith("PriceNotMet");
        })
        it("Should check if the right currency is sent for purchase", async function() {
            await expect(marketplace.connect(addr2).buy(nft.address, 1, xrc20.address, 0, nullAddress, { value: toWei(102) })).to.be.revertedWith("NotTheRightCurrency");
            await expect(marketplace.connect(addr2).buy(nft.address, 2, nullAddress, 0, nullAddress, { value: toWei(102) })).to.be.revertedWith("NotTheRightCurrency");
        })
        it("Should not let owner buy their own NFT", async function() {
            await expect(marketplace.connect(addr1).buy(nft.address, 1, nullAddress, 0, nullAddress, { value: toWei(102) })).to.be.revertedWith("OwnerCannotBuyOwnNFT");
        })
        it("Should pay commission if 3rd party uses contract", async function() {
            let commissionAddressBalance = await commissionAddress.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 300, commissionAddress.address, { value: toWei(105) });
            let commissionAddressBalanceAfter = await commissionAddress.getBalance();
            expect(fromWei(commissionAddressBalanceAfter) - fromWei(commissionAddressBalance)).to.equal(3);
        })
        it("Should pay commission if 3rd party uses contract with XRC20 token", async function() {
            let commissionAddressBalance = await xrc20.balanceOf(commissionAddress.address);
            await marketplace.connect(addr2).buy(nft.address, 2, xrc20.address, 300, commissionAddress.address);
            let commissionAddressBalanceAfter = await xrc20.balanceOf(commissionAddress.address);
            expect(commissionAddressBalanceAfter - commissionAddressBalance).to.equal(3);
        })
        it("Should pay the marketplace fee", async function() {
            let deployerAddressBalance = await deployer.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 300, commissionAddress.address, { value: toWei(105) });
            let deployerAddressBalanceAfter = await deployer.getBalance();
            expect(fromWei(deployerAddressBalanceAfter) - fromWei(deployerAddressBalance)).to.equal(2);
        })
        it("Should pay the marketplace fee with XRC20 token", async function() {
            let deployerAddressBalance = await xrc20.balanceOf(deployer.address);
            await marketplace.connect(addr2).buy(nft.address, 2, xrc20.address, 300, commissionAddress.address);
            let deployerAddressBalanceAfter = await xrc20.balanceOf(deployer.address);
            expect(deployerAddressBalanceAfter - deployerAddressBalance).to.equal(2);
        })
        it("Should pay the payout address the price", async function() {
            let commisionBalance = await commissionAddress.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 3, nullAddress, 300, commissionAddress.address, { value: toWei(105) });
            let commissionBalanceAfter = await commissionAddress.getBalance();
            expect(fromWei(commissionBalanceAfter) - fromWei(commisionBalance)).to.equal(103);
        })
        it("Should pay the payout address the price with XRC20 token", async function() {
            let commisionBalance = await xrc20.balanceOf(commissionAddress.address);
            await marketplace.connect(addr2).buy(nft.address, 4, xrc20.address, 300, commissionAddress.address);
            let commissionBalanceAfter = await xrc20.balanceOf(commissionAddress.address);
            expect(commissionBalanceAfter - commisionBalance).to.equal(103);
        })
        it("Should change ownership of NFT", async function() {
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 300, commissionAddress.address, { value: toWei(105) });
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            await marketplace.connect(addr2).buy(nft.address, 2, xrc20.address, 300, commissionAddress.address);
            expect(await nft.ownerOf(2)).to.equal(addr2.address);
        })
        it("Should update the listing ledger", async function() {
            await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 300, commissionAddress.address, { value: toWei(105) });
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr2.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(0);
            await expect((await marketplace.getListing(nft.address, 1))[4]).to.equal(royaltyAddr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[5]).to.equal(addr2.address);
            await expect((await marketplace.getListing(nft.address, 1))[6]).to.equal(2);
            await marketplace.connect(addr2).buy(nft.address, 2, xrc20.address, 300, commissionAddress.address);
            await expect((await marketplace.getListing(nft.address, 2))[0]).to.equal(100);
            await expect((await marketplace.getListing(nft.address, 2))[1]).to.equal(addr2.address);
            await expect((await marketplace.getListing(nft.address, 2))[2]).to.equal(xrc20.address);
            await expect((await marketplace.getListing(nft.address, 2))[3]).to.equal(0);
            await expect((await marketplace.getListing(nft.address, 1))[4]).to.equal(royaltyAddr1.address);
            await expect((await marketplace.getListing(nft.address, 2))[5]).to.equal(addr2.address);
            await expect((await marketplace.getListing(nft.address, 1))[6]).to.equal(2);
        })
        it("Should buy an NFT", async function() {
            expect(await marketplace.connect(addr2).buy(nft.address, 1, nullAddress, 300, commissionAddress.address, { value: toWei(105) })).to.emit(marketplace, "NFTPurchased").withArgs(addr2.address, nft.address, 1, toWei(105));
            expect(await marketplace.connect(addr2).buy(nft.address, 2, xrc20.address, 300, commissionAddress.address)).to.emit(marketplace, "NFTPurchased").withArgs(addr2.address, nft.address, 2, 105);
        })
        it("Should buy an NFT from another contract", async function() {
            expect(await marketplace.connect(addr2).buy(nft2.address, 1, nullAddress, 300, commissionAddress.address, { value: toWei(105) })).to.emit(marketplace, "NFTPurchased").withArgs(addr2.address, nft2.address, 1, toWei(105));
        })
        it("Should pay royalty payments to the right address", async function() {
            await nft.connect(addr1).mint(URI, royaltyAddr1.address, 500)
            await nft.connect(addr1).approve(marketplace.address, 5)
            await marketplace.connect(addr1).list(nft.address, 5, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            let royaltyBalanceBefore = await royaltyAddr1.getBalance();
            await marketplace.connect(addr2).buy(nft.address, 5, nullAddress, 0, nullAddress, { value: toWei(102) });
            let royaltyBalanceAfter = await royaltyAddr1.getBalance();
            expect(fromWei(royaltyBalanceAfter) - fromWei(royaltyBalanceBefore)).to.equal(5);
        })
        it("Should pay royalty payments to the right address with XRC20 tokens", async function() {
            await nft.connect(addr1).mint(URI, royaltyAddr1.address, 500)
            await nft.connect(addr1).approve(marketplace.address, 5)
            await marketplace.connect(addr1).list(nft.address, 5, 100, xrc20.address, 0, addr1.address, addr1.address)
            let royaltyBalanceBefore = await xrc20.balanceOf(royaltyAddr1.address);
            await marketplace.connect(addr2).buy(nft.address, 5, xrc20.address, 0, nullAddress);
            let royaltyBalanceAfter = await xrc20.balanceOf(royaltyAddr1.address);
            expect(royaltyBalanceAfter - royaltyBalanceBefore).to.equal(5);
        })
        it("Should pay external royalty payments to the right address", async function() {
            let royaltyBalanceBefore = await addr2.getBalance();
            await marketplace.connect(commissionAddress).buy(nft3.address, 1, nullAddress, 0, nullAddress, { value: toWei(102) });
            let royaltyBalanceAfter = await addr2.getBalance();
            expect(fromWei(royaltyBalanceAfter) - fromWei(royaltyBalanceBefore)).to.equal(5);
        })
        it("Should pay external royalty payments to the right address with XRC20 tokens", async function() {
            await nft3.connect(addr1).createToken(URI)
            await nft3.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft3.address, 2, 100, xrc20.address, 500, addr2.address, addr1.address)
            let royaltyBalanceBefore = await xrc20.balanceOf(addr2.address);
            await marketplace.connect(commissionAddress).buy(nft3.address, 2, xrc20.address, 0, nullAddress);
            let royaltyBalanceAfter = await xrc20.balanceOf(addr2.address);
            expect(royaltyBalanceAfter - royaltyBalanceBefore).to.equal(5);
        })
    })
    describe("Updating Listings", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await nft2.connect(addr1).mint(URI, nullAddress, 0)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
        })
        it("Should only allow owner to update listing", async function() {
            await expect(marketplace.connect(addr2).updateListing(nft.address, 1, toWei(200))).to.be.revertedWith("NotOwner");
        })
        it("Should only update listing if it exists", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await marketplace.connect(addr1).withdrawListing(nft.address, 2)
            await expect(marketplace.connect(addr1).updateListing(nft.address, 2, toWei(200))).to.be.revertedWith("NotListed");
        })
        it("Should update the price to be greater than 0 XDC", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await expect(marketplace.connect(addr1).updateListing(nft.address, 2, toWei(0))).to.be.revertedWith("PriceMustBeAboveZero");
        })
        it("Should update listings ledger", async function() {
            await marketplace.connect(addr1).updateListing(nft.address, 1, toWei(200));
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(200));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(0);
            await expect((await marketplace.getListing(nft.address, 1))[4]).to.equal(royaltyAddr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[5]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[6]).to.equal(1);
        })
        it("Should update NFT listing", async function() {
            expect(await marketplace.connect(addr1).updateListing(nft.address, 1, toWei(200))).to.emit(marketplace, "NFTListEdited").withArgs(addr1.address, nft.address, 1, toWei(200), addr1.address);
        })
        it("Should update NFT listing from another contract", async function() {
            expect(await marketplace.connect(addr1).updateListing(nft2.address, 1, toWei(200))).to.emit(marketplace, "NFTListEdited").withArgs(addr1.address, nft2.address, 1, toWei(200), addr1.address);
        })
    })
    describe("Updating Payout", function() {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await nft2.connect(addr1).mint(URI, nullAddress, 0)
            await nft2.connect(addr1).approve(marketplace.address, 1)
            await marketplace.connect(addr1).list(nft2.address, 1, toWei(100), nullAddress, 0, addr1.address, addr1.address)
        })
        it("Should only allow owner to update payout", async function() {
            await expect(marketplace.connect(addr2).updatePayout(nft.address, 1, addr2.address)).to.be.revertedWith("NotOwner");
        })
        it("Should only update payout if listing exists", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await marketplace.connect(addr1).withdrawListing(nft.address, 2)
            await expect(marketplace.connect(addr1).updatePayout(nft.address, 2, addr2.address)).to.be.revertedWith("NotListed");
        })
        it("Should update the price to not be the null address", async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 2)
            await marketplace.connect(addr1).list(nft.address, 2, toWei(100), nullAddress, 0, addr1.address, addr1.address)
            await expect(marketplace.connect(addr1).updatePayout(nft.address, 2, nullAddress)).to.be.revertedWith("CannotPayNullAddress");
        })
        it("Should update listings ledger", async function() {
            await marketplace.connect(addr1).updatePayout(nft.address, 1, addr2.address);
            await expect((await marketplace.getListing(nft.address, 1))[0]).to.equal(toWei(100));
            await expect((await marketplace.getListing(nft.address, 1))[1]).to.equal(addr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[2]).to.equal(nullAddress);
            await expect((await marketplace.getListing(nft.address, 1))[3]).to.equal(0);
            await expect((await marketplace.getListing(nft.address, 1))[4]).to.equal(royaltyAddr1.address);
            await expect((await marketplace.getListing(nft.address, 1))[5]).to.equal(addr2.address);
            await expect((await marketplace.getListing(nft.address, 1))[6]).to.equal(1);
        })
        it("Should update NFT listing", async function() {
            expect(await marketplace.connect(addr1).updatePayout(nft.address, 1, addr2.address)).to.emit(marketplace, "NFTListEdited").withArgs(addr1.address, nft.address, 1, toWei(100), addr2.address);
        })
        it("Should update NFT listing from another contract", async function() {
            expect(await marketplace.connect(addr1).updatePayout(nft2.address, 1, addr2.address)).to.emit(marketplace, "NFTListEdited").withArgs(addr1.address, nft2.address, 1, toWei(100), addr2.address);
        })
    })
    describe("Transferring NFTs", function () {
        beforeEach(async function() {
            await nft.connect(addr1).mint(URI, nullAddress, 0)
            await nft.connect(addr1).approve(marketplace.address, 1)
            await nft2.connect(addr1).mint(URI, nullAddress, 0)
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
    describe("Marketplace Offers", function () {
        it("Should not receive funds sent by anyone else except deployer", async function() {
            await expect(addr1.sendTransaction({
                to: offers.address,
                value: toWei(1.0)
            })).to.be.revertedWith("NotOwner");
        })
        it("Should receive funds from the deployer", async function() {
            let contractBalance = await offers.connect(addr1).balanceOf();
            await deployer.sendTransaction({
                to: offers.address,
                value: toWei(5.0)
            });
            let contractBalanceAfter = await offers.connect(addr1).balanceOf();
            expect(fromWei(contractBalanceAfter) - fromWei(contractBalance)).to.equal(5);
        })
        it("Should receive XRC20 tokens", async function() {
            let contractBalance = await xrc20.balanceOf(offers.address);
            await xrc20.connect(deployer).transfer(offers.address, 5);
            let contractBalanceAfter = await xrc20.balanceOf(offers.address);
            expect(contractBalanceAfter - contractBalance).to.equal(5);
        })
        it("Should not let everyone withdraw funds out of the contract", async function() {
            await deployer.sendTransaction({
                to: offers.address,
                value: toWei(5.0)
            });
            await expect(offers.connect(addr1).withdrawToAddress(addr1.address, toWei(5), nullAddress)).to.be.revertedWith("NotOwner");
        })
        it("Should not let anyone withdraw more funds than available out of the contract", async function() {
            await deployer.sendTransaction({
                to: offers.address,
                value: toWei(5.0)
            });
            await expect(offers.connect(deployer).withdrawToAddress(addr1.address, toWei(10), nullAddress)).to.be.revertedWith("NotEnoughBalance");
        })
        it("Should not let anyone withdraw more XRC20 funds than available out of the contract", async function() {
            await xrc20.connect(deployer).transfer(offers.address, 5);
            await expect(offers.connect(deployer).withdrawToAddress(addr1.address, 10, xrc20.address)).to.be.revertedWith("NotEnoughBalance");
        })
        it("Should let the deployer withdraw funds out of the contract", async function() {
            await deployer.sendTransaction({
                to: offers.address,
                value: toWei(5.0)
            });
            let addressBalance = await addr1.getBalance();
            await offers.connect(deployer).withdrawToAddress(addr1.address, toWei(5), nullAddress);
            let addressBalanceAfter = await addr1.getBalance();
            expect(fromWei(addressBalanceAfter) - fromWei(addressBalance)).to.equal(5);
        })
        it("Should let the deployer withdraw XRC20 funds out of the contract", async function() {
            await xrc20.connect(deployer).transfer(offers.address, 5);
            let addressBalance = await xrc20.balanceOf(addr1.address);
            await offers.connect(deployer).withdrawToAddress(addr1.address, 5, xrc20.address);
            let addressBalanceAfter = await xrc20.balanceOf(addr1.address);
            expect(addressBalanceAfter - addressBalance).to.equal(5);
        })
    })
})