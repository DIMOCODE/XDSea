import express from 'express'
import userRouter from './user.routes.js' 
import nftRouter from './nft.routes.js'


const frontRouter = express()

frontRouter.use('/user',userRouter);
frontRouter.use('/nft',nftRouter);


export default frontRouter