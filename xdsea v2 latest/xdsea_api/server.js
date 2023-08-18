import mongoose from 'mongoose';
import express from 'express'
import path from 'path';
import cors from "cors";
import fileupload from 'express-fileupload';
import config from './config/serverConfig.js'
import frontRoute from './routes/front_routes/front.routes.js'
import adminroute from './routes/admin_routes/admin.routes.js'

import cookieParser from 'cookie-parser'
import compression from 'compression';
console.log("Mongo Uri : ",config.MONGOURI)
// db connection

mongoose.set('strictQuery', true)

mongoose.connect(config.MONGOURI,(err)=>{
    if(err)  process.exit(1);
    console.log("Db connected Successfully")
})

const cacheTime = 86400000 * 3
const __dirname = path.resolve();
const app = express()
// get post content 
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
// app.use(cors())
// app.use(cookieParser());
app.use(compression());
// app.use(morgan('combined'));
app.options('*', cors());
app.use(fileupload())
app.use('/', express.static(path.join(__dirname, 'public'),{ maxAge: cacheTime }))


//cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');  
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.header('no-referrer-when-downgrade', '*');
    res.header('no-referrer', '*');
    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});



app.get('/',(req,res)=>{
    res.write(`<a href = ${config.SITE_URL}>Click To Redirect The OLBNFT</a>`)
})

//routes Declaration
app.use('/v1/front',frontRoute)
app.use('/v1/admin',adminroute)
// listening port
app.get('*',(req,res)=>{
    res.write("<b>404 - Not Found</b>")
})

app.listen(config.PORT,async()=>{
    console.log('Port Successflly Running',config.PORT)
}).on('error', (e) => {
    console.log('Error happened: ', e.message)
 })  