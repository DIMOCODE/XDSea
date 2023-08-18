import { Router} from 'express'
import * as userCtrl from '../../controller/front_controller/user.controller'
const routers = Router()

routers.route('/create').post(userCtrl.UserRegister);
// routers.route('/FollowUnFollowFunc').post(userCtrl.FollowUnFollowFunc);
// routers.route('/getfollowstatus').get(userCtrl.getfollowstatus);
routers.route('/social').get(userCtrl.sociallinks);
routers.route('/newsletter').post(userCtrl.Newsletter)


export default routers