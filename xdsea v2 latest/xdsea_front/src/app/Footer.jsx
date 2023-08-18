 
import React,{useState,useEffect} from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { isEmpty, NumANdDotOnly, NumberOnly } from "../actions/common.js";
import  config  from "../config/config.js";
import { Newsletter,Sociallinks} from "../actions/axioss/user.axios.js";
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate,Link} from "react-router-dom";
import { toast } from 'react-toastify';
toast.configure();

export default function Footer(){


  const { payload } = useSelector(state => state.LoginReducer.User)
const navigate = useNavigate();
    var [link,setLink] = useState([]);
    var [email,setEmail] = useState('');
    var [Error,SetError] = useState({});



  useEffect(()=>{
    var a = Getlink();
},[])

const Getlink=async()=>{
        
  let link_res= await Sociallinks();
  setLink(link_res?.msg??[])
}

    const NewsLetter = async() =>{
        const id = toast.loading("Subscribing...");
        var err = {};
        if(!email) err.email="Email Id Required";
        if(email && !(config.EMAIL).test(email)) err.email = 'Invalid Email ID Format';
        SetError(err);
        if(isEmpty(err)){
            let resp = await Newsletter({email : email});
            if(resp.success === 'success'){
                toast.update(id ,{render:"successfully Subcribed for NewsLetter", type: "success", isLoading: false, autoClose: 1000})
                setEmail('');
            }
            else{
                toast.update(id ,{ render : "Already User", type :'error', isLoading: false, autoClose: 1000})
                SetError({email:resp.msg});
                setEmail('')
            }
        }
        else{
            toast.update(id ,{ render : err.email, type :'error', isLoading: false, autoClose: 1000})
        }
      }


    return(
        <>
            <Box className="footer">
                <Box className="container-fluid">

                    <Box className='container'>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid className="footer_top_logo_align" item xl={12} lg={12} md={12} sm={12} xs={12}>
                <img src={require("../app/assets/images/footer-logo.png")} className="mui-img-fluid" />
                </Grid>
             <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
                <Box className="firstblock">
                    <Box>
                    <p className="we_also_make_emails">Stay in the Loop!</p>
                    <p className="receive">Join our community  for all the juicy details on drops, events, and secret insider info. Don't miss out - sign up now and be the first to know!</p>
                    </Box>
                    <Box className="footer_mail_dtls_align">
                        <input className="footer_email_input_align" placeholder="Email Address" type="email"value={''||email} onChange={(event)=>{setEmail(event.target.value)}}/>
                        <button className="footer_mail_btn_align" onClick={NewsLetter}>Submit</button>
                    </Box>
                </Box>
             </Grid>
             <Grid item xxl={3} xl={3} lg={3} md={3} sm={12} xs={6}>
                <Box>
                    <p className="account">Marketplace</p>
                    <ul >
                        <li className="footer_li_align" onClick={()=>{navigate("/")}}>Home</li>
                        <li className="footer_li_align" onClick={()=>{navigate("/explore/All")}}>Discover</li>
                        <li className="footer_li_align">How to start</li>
                    </ul>
                </Box>
             </Grid>
             <Grid item xxl={3} xl={3.} lg={3} md={3} sm={12} xs={6}>
                <Box>
                <Box>
                    <p className="account">Account</p>
                    <ul>
                        <li className="footer_li_align" onClick={()=>{navigate("/create")}}>Create NFT</li>
                    </ul>
                </Box>
                </Box>
             </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="copyright ">
             <Box className="bottom_footer w-100">
                <Box>
                    <p className="rights_reserved_text_align">&copy; 2023 XDSea.All rights Reserved.</p>
                </Box>
                <Box>
                    <ul className="d-flex align-items-center justify-content-end social-icons">
                    {link.map((mlink)=>{
                            return(
                            <>
                     {mlink?.website == "Instagram" && 
                    <li><Link to={mlink.link} target="blank"><i class="fa-brands fa-instagram bottom_footer_icons_align"></i></Link></li>}
                      {mlink?.website == "facebook" && 
                    <li><Link to={mlink.link} target="blank"><i class="fa-brands fa-facebook-f bottom_footer_icons_align"></i></Link></li>}
                      {mlink?.website == "twitter" && 
                    <li><Link to={mlink.link} target="blank"><i class="fa-brands fa-twitter bottom_footer_icons_align"></i></Link></li>}
                      {mlink?.website == "youtube" && 
                    <li><Link to={mlink.link} target="blank"><i class="fa-brands fa-youtube bottom_footer_icons_align"></i></Link></li>}
                      

                        </>
                        )
                      })}
                    </ul>
                </Box>
             </Box>
            </Grid>
            </Box>
            </Box>
            </Box>
        </>
    )
 
}
