import { Router} from 'express'
import * as nftCtrl from '../../controller/front_controller/nft.controller'
import * as bulkCtrl from '../../controller/front_controller/bulkmint.controller'
import * as importNftCtrl from '../../controller/front_controller/importnft.controller'
import * as stakingNftCtrl from '../../controller/front_controller/staking.controller'



const routers = Router()



routers.route('/nftimageupload').post(nftCtrl.nftImageUpload);
routers.route('/bulk').post(nftCtrl.bulkupload);
routers.route('/createnft').post(nftCtrl.createNewNFT);
routers.route('/collecitonvalidation').post(nftCtrl.CreateCollectionValidation);
routers.route('/createcolleciton').post(nftCtrl.CreateCollectionValidation,nftCtrl.EditCreateCollection);
routers.route('/editcollectionimage').post(nftCtrl.EditCreateCollection); 
routers.route('/collectionstats').post(nftCtrl.GetCollectionStats);
routers.route('/collectionnfts').get(nftCtrl.GetCollectionNfts);
routers.route('/myitems').get(nftCtrl.MyItemTokenlistfunc);
routers.route('/CollectionByCreator').get(nftCtrl.CollectionByCreator)
routers.route('/topcollections').get(nftCtrl.TopCollections)
routers.route('/ValidateTokenName').post(nftCtrl.validateNFTName);
routers.route('/Tokenlistfunc').get(nftCtrl.Tokenlistfunc);
routers.route('/updateTime').post(nftCtrl.updateTime);
routers.route('/myItemList').get(nftCtrl.MyItemTokenlistfunc);
routers.route('/createdCollections').get(nftCtrl.GetCreatedCollections);
routers.route('/info').get(nftCtrl.info)
routers.route('/CreateOrder').post(nftCtrl.CreateOrder)
routers.route('/BuyAccept').post(nftCtrl.BuyAccept)
 
routers.route('/BidAction').post(nftCtrl.BidAction);
routers.route('/SearchAction').get(nftCtrl.SearchAction)
routers.route('/SearchActionTest').get(nftCtrl.SearchActionBar)

routers.route('/report').post(nftCtrl.Report);
routers.route('/BurnUpdate').post(nftCtrl.BurnUpdate);

routers.route('/getpromotedtoken').get(nftCtrl.GetPromotedToken);
routers.route('/getpromotedcollection').get(nftCtrl.GetPromotedCollection);
routers.route('/ListNFtFunc').post(nftCtrl.ListNFtFunc);
routers.route('/getcollectiondata').get(nftCtrl.getcollectiondata);


// Bulk mint route to bulkmintcontroller

routers.route('/bulkmintcall').post(bulkCtrl.BulkMint);
routers.route('/newlycreatednfts').get(nftCtrl.NewNFts);
routers.route('/importcollections').post(importNftCtrl.CreateCollectionValidation2,importNftCtrl.ImportCollection2,importNftCtrl.EditCreateCollection);
// routers.route('/toupdatecollections').post(importNftCtrl.updatecollectionnfts);
// routers.route('/testdata').post(importNftCtrl.test_contract,importNftCtrl.ImportCollection2);
routers.route('/testdata').post(importNftCtrl.ImportCollection2);
routers.route('/checknftintokens').post(nftCtrl.checkIfTokenExists);
routers.route('/ListImportedNfts').post(nftCtrl.ListImportedNfts);
routers.route('/findupdatebalance').post(nftCtrl.Findupdatebalance)
routers.route('/addToCart').post(nftCtrl.addToCart)
routers.route('/getCartItems').get(nftCtrl.getCartItems)
routers.route('/updatecart').post(nftCtrl.UpdateCart)
routers.route('/bulkbuyupdate').post(nftCtrl.cartPurchase)

//staking routes
routers.route('/createstakingpool').post(stakingNftCtrl.CreateStakingPool)
routers.route('/createstake').post(stakingNftCtrl.CreateStake)
routers.route('/getpool').get(stakingNftCtrl.getStakingPoolsByCollection)
routers.route('/claimreward').post(stakingNftCtrl.ClaimReward)
routers.route('/withdrawstake').post(stakingNftCtrl.withdrawStake)
routers.route('/stopstake').post(stakingNftCtrl.stopStake)
routers.route('/topstakers').get(stakingNftCtrl.getTopStakers)
routers.route('/updatestakingpool').post(stakingNftCtrl.updateStakingPool)
routers.route('/getstakes').get(stakingNftCtrl.getStakes2)
routers.route('/getmybids').get(nftCtrl.offersmade)
routers.route('/getreceivedbids').get(nftCtrl.getreceivedbids)
routers.route('/nftpooldetails').get(stakingNftCtrl.nftpooldetails)
routers.route('/getpoolinfopage').get(stakingNftCtrl.getpoolinfopage)
routers.route('/getcollection').get(stakingNftCtrl.getcollection)
routers.route('/updateeligibility').post(stakingNftCtrl.updateeligibility)
routers.route('/updateBackValueDB').post(stakingNftCtrl.updateNFTBackedValue)
routers.route('/checkurl').get(nftCtrl.GetUrlUser)
routers.route('/PendingClaimedRewards').get(stakingNftCtrl.PendingClaimedRewards)
routers.route('/UserCollectionMigration').get(stakingNftCtrl.UserCollectionMigration)

// importcolletion route 
routers.route('/importedCollectionLoadMore').get(nftCtrl.importedCollectionLoadMore);

routers.route('/collectionDetailPage').get(nftCtrl.collectionDetailPage);
routers.route('/updatewithdrawstatus').post(nftCtrl.updatewithdrawstatus);
routers.route('/importcollectionstest').post(importNftCtrl.CreateCollectionValidation3,importNftCtrl.ImportCollection3);




 





 







 




















export default routers