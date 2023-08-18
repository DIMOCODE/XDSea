import { Router} from 'express'

import * as adminctrl from '../../controller/admin_controller/admin_controller.js'
import * as cmsCtrl from '../../controller/admin_controller/cms_controller/cms.controller.js'
import * as userCtrl from '../../controller/admin_controller/user_controller/user.controller.js'
import * as tokenCtrl from '../../controller/admin_controller/token_controller/token.controller.js'
import {verifyToken} from '../../helper/credentialsSetup';

const routers = Router()
routers.route('/adminlogin').post(adminctrl.loginAdmin)
routers.route('/getcategory').get(cmsCtrl.getCategoryList);

routers.route('/addcategory').post(cmsCtrl.AddCategory);
routers.route('/hideshowcategory').post(cmsCtrl.HideShowCategory);

routers.route("/getsociallinks").get(userCtrl.getSocialLinks);
routers.route('/social').get(userCtrl.sociallinks);
routers.route('/getuserlist').get(userCtrl.getUserList);
routers.route('/getfaqlist').get(userCtrl.getFaqList);
routers.route("/addfaq").post(verifyToken,userCtrl.AddEditDeleteFAq);
routers.route('/getSubscribers').get(userCtrl.getSubscriberList);
routers.route('/sendSubscribeMail').post(userCtrl.SendMails);
routers.route('/addsociallinks').post(userCtrl.AddSocialLinks);
routers.route("/editdeletesocial").post(userCtrl.AddSocialLinks);

// routers.route('/addfaq').post(userCtrl.AddEditDeleteFAq);

routers.route('/currencylist').get(tokenCtrl.getCurrencyList);
routers.route("/gettokencheck").get(tokenCtrl.Tokenlistcheck);
routers.route("/getOwner").get(tokenCtrl.getTokenOwner);
routers.route('/addtoken').post(tokenCtrl.AddToken);
routers.route('/getcollection').get(tokenCtrl.GetCollectionlist);


routers.route('/managereporttoken').post(verifyToken,tokenCtrl.ManageReportToken);
// routers.route('/managereporttoken').post(token.ManageReportToken);
routers.route('/getreporttokens').get(tokenCtrl.getReportTokens);
routers.route('/getnfttag').get(tokenCtrl.getnfttaglist);
routers.route('/editnfttag').post(tokenCtrl.EditNFtTags);
routers.route('/getemailtemplate').get(tokenCtrl.getEmailTemplateList);
routers.route('/editemailtemplate').post(tokenCtrl.editEmailTemplateList);
routers.route('/getreportoftoken').get(tokenCtrl.getTokenReportStatus);
routers.route('/getcmslist').get(tokenCtrl.getCmsList);
routers.route('/editcms').post(tokenCtrl.editcms);
routers.route('/addfaqcontent').post(userCtrl.AddDelEditFAqcontent);
routers.route('/getfaqcontentslist').get(userCtrl.getFaqcontentsList);
routers.route("/token/getDropList").get(userCtrl.getDropList);
routers.route("/bannerpromotionaction").post(tokenCtrl.BannerPromotionAction)
routers.route("/collectionpromotionaction").post(tokenCtrl.CollectionPromotionAction)

export default routers