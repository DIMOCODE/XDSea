const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe("StakingPool", function() {
    let deployer, addr1, addr2, nft, marketplace;
    let URI = "Sample URI";
    let nullAddress = "0x0000000000000000000000000000000000000000";
    let tokenIds = [...Array.from({length: 1278}, (x, i) => i)];
    beforeEach(async function() {
        const NFT721 = await ethers.getContractFactory("NFT721");
        const XDSeaMarket721 = await ethers.getContractFactory("XDSeaMarket721");
        const XRC20 = await ethers.getContractFactory("XRC20");
        const NFT = await ethers.getContractFactory("NFT");
        const NFT1155 = await ethers.getContractFactory("NFT1155");
        XDSeaStaking = await ethers.getContractFactory("XDSea721Staking");
        [deployer, addr1, addr2, commissionAddress, royaltyAddr1, royaltyAddr2] = await ethers.getSigners();
        nft = await NFT721.deploy("XDSea NFT v2", "XDSEAv2", 0, royaltyAddr1.address);
        nft2 = await NFT721.deploy("XDSea NFT v2.1", "XDSEAv2.1", 0, royaltyAddr2.address);
        marketplace = await XDSeaMarket721.deploy();
        xrc20 = await XRC20.deploy(100000);
        nft3 = await NFT.deploy(marketplace.address);
        nft1155 = await NFT1155.deploy();
        await xrc20.connect(deployer).mint(1000000);
        await xrc20.connect(addr1).mint(1000000);
        await xrc20.connect(addr2).mint(100000);
        await xrc20.connect(commissionAddress).mint(100000);
        await xrc20.connect(royaltyAddr1).mint(100000);
    });
    describe("Deployment of Staking Pool", function() {
        it("Should deploy the staking pool", async function() {
            staking = await XDSeaStaking.deploy(nft3.address, [1, 2, 3], [10, 10, 10], 0, 1658102400);
            expect(await staking.poolOwner()).to.be.equal(deployer.address);
            expect(await staking.nftCollection()).to.be.equal(nft3.address);
            expect(await staking.nftCollection()).to.be.not.equal(nft2.address);
            expect((await staking.stakedNFTs(1)).isEligible).to.be.equal(true);
            expect((await staking.stakedNFTs(2)).isEligible).to.be.equal(true);
            expect((await staking.stakedNFTs(3)).isEligible).to.be.equal(true);
            expect((await staking.stakedNFTs(4)).isEligible).to.be.equal(false);
            expect(await staking.lockInPeriod()).to.be.equal(0);
            expect(await staking.lockInPeriod()).to.be.not.equal(100);
        });
    });
    describe("Admin privileges", function() {
        beforeEach(async function() {
            staking = await XDSeaStaking.deploy(nft3.address, [1, 2, 3], [toWei(10), toWei(20), toWei(30)], 20, ~~(Date.now() / 1000));
        });
        it("Should only allow pool owner to update pool owner address", async function() {
            await expect(staking.connect(addr1).updatePoolOwner(addr1.address)).to.be.revertedWith("NotPoolOwner");
            await staking.connect(deployer).updatePoolOwner(addr1.address);
            expect(await staking.poolOwner()).to.be.equal(addr1.address);
        });
        it("Should only allow pool owner to view the balance of the staking pool", async function() {
            await expect(staking.connect(addr1).balanceOf()).to.be.revertedWith("NotPoolOwner");
            expect(await staking.connect(deployer).balanceOf()).to.be.equal(0);
        });
        it("Should only allow pool owner to send funds to the staking pool", async function() {
            await expect(addr1.sendTransaction({
                to: staking.address,
                value: toWei(5.0)
            })).to.be.revertedWith("NotPoolOwner");
            let contractBalance = await staking.connect(deployer).balanceOf();
            await deployer.sendTransaction({
                to: staking.address,
                value: toWei(5.0)
            });
            let contractBalanceAfter = await staking.connect(deployer).balanceOf();
            expect(fromWei(contractBalanceAfter) - fromWei(contractBalance)).to.equal(5);
        });
        it("Should only allow pool owner to update the lock-in period of the staking pool", async function() {
            await expect(staking.connect(addr1).updateLockInPeriod(500)).to.be.revertedWith("NotPoolOwner");
            await staking.connect(deployer).updateLockInPeriod(500);
            expect(await staking.lockInPeriod()).to.be.equal(500);
        });
        it("Should only allow pool owner to update the eligibility of NFTs to be in the staking pool", async function() {
            await expect(staking.connect(addr1).updateEligibility([1], [false])).to.be.revertedWith("NotPoolOwner");
            await staking.connect(deployer).updateEligibility([1], [false]);
            expect((await staking.stakedNFTs(1)).isEligible).to.be.equal(false);
        });
        it("Should only allow pool owner to update the backed values of staked NFTs", async function() {
            await expect(staking.connect(addr1).updateBackedValues([1], [100])).to.be.revertedWith("NotPoolOwner");
            await staking.connect(deployer).updateBackedValues([1], [100]);
            expect((await staking.stakedNFTs(1)).backedValue).to.be.equal(100);
        });
        it("Should only allow pool owner to update backed values if they are enabled", async function() {
            await staking.connect(deployer).removeBackedValues([1, 2, 3]);
            await expect(staking.connect(addr1).updateBackedValues([1], [100])).to.be.revertedWith("NotPoolOwner");
        });
        it("Should only allow pool owner to set rewards for the staking pool", async function() {
            await staking.connect(deployer).setRewards([nullAddress], [600], [1], [0]);
        });
        it("Should not allow the deployer to use false contract addresses for the different reward types", async function() {
            await expect(staking.connect(deployer).setRewards([nullAddress], [600], [1], [1])).to.be.reverted;
            await staking.connect(deployer).setRewards([xrc20.address], [600], [1], [1]);
        })
    });
    describe("Staking NFTs", function() {
        beforeEach(async function() {
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            staking = await XDSeaStaking.deploy(nft3.address, [1, 2, 3], [], 100, ~~(Date.now() / 1000));
        });
        it("Should check ownership when staking", async function() {
            await expect(staking.connect(addr2).stake(1)).to.be.revertedWith("NotOwner");
        });
        it("Should check if NFT is eligible for staking", async function() {
            await expect(staking.connect(addr1).stake(4)).to.be.revertedWith("NotEligibleForStaking");
        });
        it("Should transfer the NFT from the staker to the staking pool", async function() {
            await nft3.connect(addr1).approve(staking.address, 1);
            await staking.connect(addr1).stake(1);
            expect(await nft3.ownerOf(1)).to.be.equal(staking.address);
        });
        it("Should update the staked NFT information on the contract", async function() {
            await nft3.connect(addr1).approve(staking.address, 1);
            await staking.connect(addr1).stake(1);
            expect((await staking.stakedNFTs(1)).stakerAddress).to.be.equal(addr1.address);
        });
    });
    describe("Withdrawal of NFTs", function() {
        beforeEach(async function() {
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            staking = await XDSeaStaking.deploy(nft3.address, [1, 2, 3], [], 5, ~~(Date.now() / 1000));
            await nft3.connect(addr1).approve(staking.address, 1);
            await staking.connect(addr1).stake(1);
        });
        it("Should only let owners withdraw their NFTs", async function() {
            await expect(staking.connect(addr2).withdraw(1)).to.be.revertedWith("NotOwner");
        });
        it("Should only let the staker withdraw NFTs after the lock-in period ends", async function() {
            await expect(staking.connect(addr1).withdraw(1)).to.be.revertedWith("StillLockedIn");
        });
        it("Should let the NFT be withdrawn to the staker", async function() {
            await new Promise(r => setTimeout(r, 5000));
            await staking.connect(addr1).withdraw(1);
            expect(await nft3.ownerOf(1)).to.be.equal(addr1.address);
        });
        it("Should update the staked NFT information on the contract", async function() {
            await new Promise(r => setTimeout(r, 5000));
            await staking.connect(addr1).withdraw(1);
            expect((await staking.stakedNFTs(1)).stakerAddress).to.be.equal(nullAddress);
            expect((await staking.stakedNFTs(1)).timeOfStake).to.be.equal(0);
        });
    });
    describe("Calculate and distributes rewards", function() {
        beforeEach(async function() {
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            await nft3.connect(addr1).createToken(URI);
            staking = await XDSeaStaking.deploy(nft3.address, [1, 2, 3], [toWei(10), toWei(20), toWei(30)], 20, ~~(Date.now() / 1000));
            await staking.connect(deployer).setRewards([nullAddress, xrc20.address], [30, 60], [1, 1], [0, 1]);
            staking2 = await XDSeaStaking.deploy(nft3.address, [1, 2, 3], [], 20, ~~(Date.now() / 1000));
            await staking2.connect(deployer).setRewards([nullAddress, xrc20.address], [30, 60], [1, 1], [0, 1]);
            await nft3.connect(addr1).approve(staking.address, 1);
            await staking.connect(addr1).stake(1)
            await nft3.connect(addr1).approve(staking2.address, 2);
            await staking2.connect(addr1).stake(2);
        });
        it("Should calculate the rewards for NFTs in the staking pool", async function() {
            console.log(await staking.calculateRewards(1));
            console.log(await staking2.calculateRewards(2));
        });
        it("Should let the staker claim rewards for their staked NFT", async function() {
            await expect(staking.connect(addr1).claimRewards(3)).to.be.revertedWith("NFTNotStaked");
            await expect(staking.connect(addr2).claimRewards(1)).to.be.revertedWith("NotOwner");
            await expect(staking.connect(addr1).claimRewards(1)).to.be.revertedWith("NotEnoughBalance");
            await deployer.sendTransaction({
                to: staking.address,
                value: toWei(9100)
            });
            await xrc20.connect(addr1).approve(staking.address, 200000);
            await xrc20.connect(addr1).transfer(staking.address, 200000);
            let stakerBalance = await addr1.getBalance();
            await staking.connect(addr1).claimRewards(1);
            let stakerBalanceAfter = await addr1.getBalance();
        });
        it("Should allow the pool owner to deposit funds to be distributed", async function() {
            await expect(staking.connect(addr1).depositFunds(toWei(10), nullAddress)).to.be.revertedWith("NotPoolOwner");
            await expect(staking.connect(deployer).depositFunds(toWei(10), nullAddress, { value: toWei(20) })).to.be.revertedWith("NotEnoughBalance");
            expect(await staking.connect(deployer).depositFunds(toWei(10), nullAddress, { value: toWei(10) })).to.emit(staking, "FundsReceived").withArgs(deployer.address, nullAddress, toWei(10));
            expect(await staking.balanceOf()).to.be.equal(toWei(10));
            await xrc20.connect(deployer).approve(staking.address, 10);
            expect(await staking.connect(deployer).depositFunds(10, xrc20.address)).to.emit(staking, "FundsReceived").withArgs(deployer.address, xrc20.address, 10);
            expect(await xrc20.balanceOf(staking.address)).to.be.equal(10);
        })
    })
});