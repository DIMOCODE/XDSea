
import React,{useEffect,useState}from 'react'

import Header from '../app/Header'
import Footer from '../app/Footer'
import DataTable from 'react-data-table-component';
import {Link} from 'react-router-dom'
import { useSelector } from "react-redux";
import {getcartlist,updatecart,bulkBuyCall} from "../actions/axioss/nft.axios"
import useContractProviderHook from "../actions/contractProviderHook";
import config from "../config/config.js";
import CartList from "../modals/cartlist.js";
import { toast } from 'react-toastify';
import BigNumber from "bignumber.js";
import { useNavigate } from "react-router-dom";




function CartPage() {

 
  const { web3p, accountAddress } = useSelector(
    (state) => state.LoginReducer.AccountDetails
  );
  const ContractCall = useContractProviderHook();
  const { currency } = useSelector(state => state.LoginReducer)
  const { buyerFees,sellerFees } = useSelector(state => state.LoginReducer.ServiceFees);
  const navigate  = useNavigate()

    useEffect(()=>{
        getcarttokens()
    },[accountAddress])

    const [listitems,setlistitems] = useState([])
    const [totalusd,settotalusd] = useState(0)
    const [hidediv,sethidediv] = useState(false)
    const [btntext,setbtntext] = useState("buy")

    useEffect(() =>{
      window.scrollTo(0,0);
  },[])
  

    const getcarttokens = async()=>{
      var resp = await getcartlist({buyerAddress:accountAddress})
      if(resp?.data){
        var listdata = resp?.data
        var totalprice = 0
        listdata.map((data,i)=>{
          let dollarvalue = currency?.find(coin => coin.label == data?.CoinName)?.usd
          listdata[i]["usdval"] = Number(data?.quantity)*(Number(data?.NFTPrice)*Number(dollarvalue))
          totalprice += Number(data?.quantity)*(Number(data?.NFTPrice)*Number(dollarvalue))
          settotalusd(totalprice)
        })
        setlistitems(listdata)

      }
    }

    const buycartitems = async()=>{

      sethidediv(true)
      setbtntext("processing")
      var tokenIdArr = []
      var tokenOwnerArr = []
      var priceArr = []
      var quantityArr = []
      var contractArr = []
      var tokencoin = []
      var contracttype = []

      var coinAmount = 0
      
await Promise.all(
  listitems.map(async(data)=>{
 
    tokenIdArr.push(Number(data.NFTId))
    tokenOwnerArr.push(data.NFTOwner)
    priceArr.push(await testtofix(Number(web3p.utils.toWei(data.NFTPrice))))
    quantityArr.push(Number(data.quantity))
    contractArr.push(data.ContractAddress)
    tokencoin.push((config.COIN_NAME == data.CoinName)?"ETH":data.CoinName)
    contracttype.push(Number(data.ContractType))

     
    if(config.COIN_NAME == data.CoinName){
      let coindecimal = currency?.find(coin => coin.label == data?.CoinName)?.decimal
 
      let amount = ContractCall.buy_bid_price_calculation((Number(data.quantity)*Number(data.NFTPrice)),Number(coindecimal))
      coinAmount = coinAmount + Number(web3p.utils.toWei(String(amount)))
      coinAmount = await testtofix(coinAmount)
    }
    

})
)
 
      // console.log("finalarrdatas",tokenIdArr,tokenOwnerArr,priceArr,quantityArr,contractArr,tokencoin,contracttype,Number(web3p.utils.fromWei(coinAmount)))
  
      var resp = await ContractCall.cartbuy_721_1155(coinAmount,tokenIdArr,tokenOwnerArr,priceArr,quantityArr,contractArr,tokencoin,contracttype)

      var toUpdateResponse =[]
      if(resp.status){
        listitems.map((data)=>{


          let usprice = currency?.find(coin => coin.label == data?.CoinName)?.usd

          let newOwner = {
            HashValue: resp.HashValue,
            NewTokenOwner: accountAddress,
            NFTQuantity: data.quantity,
            NFTId: data.NFTId,
            NFTOwner: data.NFTOwner,
            PutOnSale: data.PutOnSale,
            PutOnSaleType: data.PutOnSaleType,
            activity: "Buy",
            TP:Number(data.NFTPrice),
            CN: data.CoinName,
            // click: `${config.FRONT_URL}/info/${item.CollectionNetwork}/${item.ContractAddress}/${accountAddress}/${owner.NFTId}`,
  
            CollectionName:data.CollectionName,
            // usdprice:Number(data.NFTPrice)*Number(usprice),
            // usdvolume:Number(data.quantity)*Number(usprice)*Number(data.NFTPrice)
            usdprice:Number(data.NFTPrice) ,
            usdvolume:Number(data.quantity)*Number(data.NFTPrice)
  
         }


         let item = { NFTId:data.NFTId,
                      ContractAddress:data.ContractAddress, 
                      ContractType:data.ContractType,
                      NFTCreator :data.NFTCreator}
                      
         toUpdateResponse.push({newOwner:newOwner,item:item})            
        
         
        })
        var updresponse = await bulkBuyCall(toUpdateResponse)

        if(updresponse.status){
          sethidediv(false)
          toast.success(updresponse.msg)
          setTimeout(() => {
            navigate("/explore/All")
          }, 1000);
        }  
 
      }
      else{
        sethidediv(false)
        setbtntext("try")
      }


    }
     


    const manageSale = async(e,data,filter)=>{
     if(filter == "edit"){
      if(e.target.id == "decrement") {
        if((Number(data.quantity) - 1)<1) return toast.error("NFT quantity should be atleat one")
        var newquantity = Number(data.quantity) - 1}
      else {
        if((Number(data.quantity) + 1)>data.NFTBalance) return toast.error(`Available Quantity only ${data?.NFTBalance}` )
        var newquantity = Number(data.quantity) + 1}  
   
        var updatedata = {
      
          quantity:newquantity
        }

        var finddata = {
          NFTId:data?.NFTId,
          NFTOwner:data?.NFTOwner,
          buyerAddress:data?.buyerAddress,
          ContractAddress:data?.ContractAddress,
          ContractType:data?.ContractType,
          CollectionName:data?.CollectionName

        }


        var bodydata = {finddata:finddata,updatedata:updatedata,filter:"edit"}

        var respo = await updatecart(bodydata)
        if(respo.status) getcarttokens()
      }
      else{
        var finddata = {
          NFTId:data?.NFTId,
          NFTOwner:data?.NFTOwner,
          buyerAddress:data?.buyerAddress,
          ContractAddress:data?.ContractAddress,
          ContractType:data?.ContractType,
          CollectionName:data?.CollectionName

        }
        var bodydata = {finddata:finddata,filter:"remove"}
 
        var respo = await updatecart(bodydata)
        if(respo.status) getcarttokens()

      }
      }

      // useEffect(()=>{
      //   testtofix()
      // },[])
  
 const testtofix = async(x)=>{
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
 
  return x
   }

   
    
 
 
  return (
    <>
    <Header/>

     <>
     <div className='container home-container mt-3'>
        <div className='cart_title'>
        <span className='cart_title_align '>Your Bag</span>
        </div>

        <div className='whole_cart_title_dtls'>
          <div><b>Item</b></div>
          <div><b>USD Price</b></div>
          <div><b>Quantity</b></div>
          <div><b>Price</b></div>
          <div><b>Remove</b></div>
        </div>
     <div className='wrapping_dtls'>
   {(listitems && listitems.length > 0)&&
    listitems.map((data)=>{
      return(
      <>
    <div className='whole_cart_dtls'>
        <div className="ofrrcvd_tbl_all_data">
        <img className="table_nft_img_align" src={(data?.fileType.includes("image"))?
                                                     (data?.NFTOrginalImage)
                                                     :
                                                     (data?.NFTThumpImage)?
                                                     (data?.NFTThumpImage)
                                                     :require('../app/assets/images/drop6.jpg')}/>
        <div>
          <p>{data?.NFTName}</p>
          <span>{String(data?.NFTOwner).slice(0,4).concat("...")}</span>
        </div>
        </div>
        <div className='inc_dec_btn_dtls'> <b className='usdprice_value'>$ {data?.usdval} USD</b></div>
{(data?.ContractType == "721" || data?.ContractType == 721)?
        <div className='inc_dec_btn_dtls'>
        <span className='tbl_qnttty_value'> {data?.quantity}  </span>
        </div>:

        <div className='inc_dec_btn_dtls'>
        <button className='cart_chnge_btn' id="decrement" onClick={(e)=>{manageSale(e,data,"edit")}}>-</button> 
        <span className='tbl_qnttty_value'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {data?.quantity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button className='cart_chnge_btn' id="increment"  onClick={(e)=>{manageSale(e,data,"edit")}}>+</button>
        </div>
    }
        <div className='inc_dec_btn_dtls'><b className='tbl_bnb_value'>{Number(data?.NFTPrice)*Number(data?.quantity)}{" "}{data?.CoinName}</b></div>
        <div className='inc_dec_btn_dtls'><i class="fa-solid fa-trash-can cart_trash_ic" onClick={()=>manageSale("",data,"remove")}/></div>


      </div>
      </>
      )
    })}
        </div>

 
    </div>
    <div className='container mt-3'>
        <div className='ttl_price_align'>
            <p>Total Price: <b>${totalusd}</b></p>
        </div>
       
    {!hidediv &&       
                <div className='cart_buynowbtn_dtls' onClick={()=>{buycartitems()}}>
                <a data-ignore-split="true" class="Button"  id=""   tabindex="0" aria-label="">
   {btntext == "buy"?"Buy Now":btntext == "try"?"Try Again":"processing"} 
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
    <span class="Button-hover-content" aria-hidden="true">Buy Now</span>
  </a>
                 
           
        </div>}
    </div>
 </>
    <Footer/>
    </>
  )
}

export default CartPage