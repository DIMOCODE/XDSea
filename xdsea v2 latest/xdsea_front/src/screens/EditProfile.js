 import React, {useState, useEffect, useCallback} from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { toast } from 'react-toastify';

import Header from '../app/Header'
import Footer from '../app/Footer'
import { Container,Row,Col } from 'react-bootstrap'

import action_config from '../config/config.js';
import { isEmpty } from "../actions/common";
import { userRegister,CheckUrl } from "../actions/axioss/user.axios";
toast.configure();


function EditProfile() {

    useEffect(() =>{
        window.scrollTo(0,0);
    },[])

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token, payload, isAdmin } = useSelector(state => state.LoginReducer.User)

    const initialValue = {
        DisplayName: payload?.DisplayName,
        EmailId: payload?.EmailId,
        Password: '',
        ConfirmPassword: '',
        Youtube: payload?.Youtube,
        Facebook:payload?.Facebook,
        Twitter: payload?.Twitter,
        Instagram: payload?.Instagram,
        Website: payload?.Website,
        Profile:payload?.Profile,
        WalletAddress: payload?.WalletAddress,
        // Profile:payload?.Profile ? action_config.BACK_URL + '/user/' + payload?.ProfileUrl + '/profile/' + payload?.Profile : '',
        Cover: payload?.Cover,
        Bio: payload?.Bio,
        CustomUrl:payload?.CustomUrl,
        Type: 'profile'
    }


useEffect(()=>{
    setFormValue(initialValue)
  },[payload])
  
  const [formValue, setFormValue] = useState(initialValue)
  const [ValidateError, SetValidateError] = useState('')
  const [onchangeimg, setOnchangeimg] = useState('')
  const [bannerimg, setbannerimg] = useState('')
  const [profileextension, setprofileextension] = useState('')
  const [bannerext, setbanerext] = useState('')
  const [imageVal, setImageVal] = useState('')
  const [disablebtn, setDisablebtn] = useState(0)
  
  
     const {
      DisplayName,
      WalletAddress,
      EmailId,
      Password,
      ConfirmPassword,
      Youtube,
      Facebook,
      Twitter,
      Instagram,
      Profile,
      Cover,
      Bio,
      CustomUrl,
      Type,
      Website
  } = formValue
  
  

  useEffect(() => {
    window.scrollTo(0, 0);
    getProfile()
  
  }, [payload?.Profile]);
  
  const getProfile = async () => {
    if (payload?.Profile) {
   var profileimage =  payload.Profile;
   var proext = payload?.Profile.split(".").pop()
   setprofileextension(proext)
   setOnchangeimg(profileimage);
  }
  if(payload?.Cover){
    var banext = payload?.Cover.split(".").pop()
    setbanerext(banext)
    setbannerimg(payload?.Cover)
  }
  }


const onChange = (e) => {
    SetValidateError('')

    setDisablebtn(0)
    const { value, id } = e.target
    if(id == 'CustomUrl')
        var formData = { ...formValue, ...{ ['CustomUrl']: value.toString().replace(/\s/g,'').toLowerCase() } } 
    else
        var formData = { ...formValue, ...{ [id]: value } }
    setFormValue(formData)

  }
//   const Validation = useCallback(async(data,WalletAddress) => {

     
//     let ValidateError = {}
//     let imageSize = 5000000;

//     var noSpecialChar = /^[a-zA-Z0-9]+$/
   
  
//     if (onchangeimg !== "") {
//         if (data.Profile !== "") {
//             if (imageSize < (data.Profile).size) {
//                 ValidateError.Profile = "File size must be below 5mb"
//             }
//             if (!(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|GIF)$/i).test((data.Profile).name)) {
//                 ValidateError.Profile = "file is invalid. only allowed JPG,PNG,WEBP,gif";
//             }
//         }
  
//     }

//     if (bannerimg !== "") {
//         if (data.Profile !== "") {
//             if (imageSize < (data.Profile).size) {
//                 ValidateError.Profile = "File size must be below 5mb"
//             }
//             if (!(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|GIF)$/i).test((data.Profile).name)) {
//                 ValidateError.Profile = "file is invalid. only allowed JPG,PNG,WEBP,gif";
//             }
//         }
  
//     }
//     if (!data.DisplayName) ValidateError.DisplayName = 'DisplayName Required'
//     if (!data.CustomUrl) ValidateError.CustomUrl = 'CustomUrl Required'
//     if (!noSpecialChar.test(data.CustomUrl)) ValidateError.CustomUrl = "Custom Url should not contain special characters or spaces"
//     // if (data.CustomUrl && !(action_config.OnlyAlbhabets).test(data.CustomUrl)) ValidateError.CustomUrl = 'CustomUrl Must Be Allowed Only Letters'
  
//     // if (!data.EmailId) ValidateError.EmailId = 'EmailId Required'
//     if (data.EmailId && !(action_config.EMAIL).test(data.EmailId)) ValidateError.EmailId = 'Invalid Email Format'

//      // test for customurl existence

//      var isUrlExists = await CheckUrl({CustomUrl:data.CustomUrl})
//      if(isUrlExists?.status && isUrlExists?.data?.WalletAddress != WalletAddress){
//         ValidateError.CustomUrl = 'CustomUrl already exists try a different one'
//      } 

//     SetValidateError(ValidateError)

//     return ValidateError
//   }, [ValidateError])

const Validation =  async (data,WalletAddress) => {


    let ValidateError = {}
    let imageSize = 5000000;

    var noSpecialChar = /^[a-zA-Z0-9]+$/
   
 
    if (onchangeimg !== "") {
        if (data.Profile !== "") {
            if (imageSize < (data.Profile).size) {
                ValidateError.Profile = "File size must be below 5mb"
            }
            // if (!(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|GIF)$/i).test((data.Profile).name)) {
            if (!["jpg","JPG","jpeg","JPEG","png","PNG","webp","WEBP","gif","GIF"].includes(profileextension)) {

                ValidateError.Profile = "file is invalid. only allowed JPG,PNG,WEBP,gif";
            }
        }
  
    }

    if (bannerimg !== "") {
        if (data.Profile !== "") {
            if (imageSize < (data.Profile).size) {
                ValidateError.Profile = "File size must be below 5mb"
            }
            // if (!(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|GIF)$/i).test((data.Profile).name)) {
            if (!["jpg","JPG","jpeg","JPEG","png","PNG","webp","WEBP","gif","GIF"].includes(bannerext)) {

                ValidateError.Profile = "file is invalid. only allowed JPG,PNG,WEBP,gif";
            }
        }
  
    }
    if (!data.DisplayName) ValidateError.DisplayName = 'DisplayName Required'
    if (!data.CustomUrl) ValidateError.CustomUrl = 'CustomUrl Required'
    if (!noSpecialChar.test(data.CustomUrl)) ValidateError.CustomUrl = "Custom Url should not contain special characters or spaces"
    // if (data.CustomUrl && !(action_config.OnlyAlbhabets).test(data.CustomUrl)) ValidateError.CustomUrl = 'CustomUrl Must Be Allowed Only Letters'
  
    // if (!data.EmailId) ValidateError.EmailId = 'EmailId Required'
    if (data.EmailId && !(action_config.EMAIL).test(data.EmailId)) ValidateError.EmailId = 'Invalid Email Format'

     // test for customurl existence


     var isUrlExists = await CheckUrl({CustomUrl:data.CustomUrl})
     if(isUrlExists?.status && isUrlExists?.data?.WalletAddress != WalletAddress){
        ValidateError.CustomUrl = 'CustomUrl already exists try a different one'
     }


    SetValidateError(ValidateError)
    return ValidateError
  }
  
     const FormSubmit = async () => {
         const id = toast.loading("Updating Progress..")
         let error = await Validation(formValue,payload?.WalletAddress)
    
      
         if (!isEmpty(error)) {
             setDisablebtn(1)
             SetValidateError(error)
             toast.update(id, { render:  'Validation Failed', type: 'error', isLoading: false,autoClose:1000,position:'top-center'})
  
         }
         else {
     
             let Resp = await userRegister(formValue)
             if(Resp.success === 'success'){
                 toast.update(id, { render: 'Saved successfully', type: 'suceess', isLoading: false,autoClose:1000,position:'top-center'})
                 setDisablebtn(0)
  
             dispatch({
                 type: 'Register_Section',
                 Register_Section: {
                     User: {
                         payload	: 	Resp.data,
                         isAdmin	: 	Resp.data?.isAdmin ? Resp.data?.isAdmin == 'Yes' ? true : false : isAdmin,
                         token	:	Resp.token ? Resp.token : token
                     }
                 }
             })
             if(Resp.data.CustomUrl ) document.cookie = 'user' + "=" + Resp.data.CustomUrl + ";" + ";path=/";
              navigate(`/my-item/${formValue.CustomUrl}`)
         }
         else{
             setDisablebtn(1)
             toast.update(id, { render:  'Validation Failed', type: 'error', isLoading: false,autoClose:1000,position:'top-center'})
             SetValidateError({...ValidateError,...Resp.validate})
         }
         }
  
     }
     const handleFile = (event) => {
         setDisablebtn(0)
         event.preventDefault();
         // console.log('dsugfdsk',event)
         var reader = new FileReader()
         const { id, files } = event.target;
         if (event.target.files && event.target.files[0]) {
             var file = event.target.files[0];
             setImageVal(file)
             var url = reader.readAsDataURL(file);
             reader.onloadend = function (e) {
                 if (reader.result && id == "Profile") {
                    let ext = event.target.files[0].name.split(".").pop()
                     setprofileextension(ext)
                     setOnchangeimg(reader.result);
                 }else{
                    let ext = event.target.files[0].name.split(".").pop()
                    setbanerext(ext)
                    setbannerimg(reader.result)
                 }
             }
         }
         let formData = { ...formValue, ...{ [id]: files[0] } };
         setFormValue(formData);
     }




  return (
    <>
    <Header/>
    <Container fluid className='edit_profile_whole_content'>
        <div className='banner_img_align'>
            <img src={bannerimg?bannerimg:require('../app/assets/images/bannerbig.jpg')}/>
            <button className='banner_edit_btn'><input className='choose_file_input_dtls' type='file' id="Cover" name="upload" onChange={(e) => handleFile(e)}/><span><i class="fa-solid fa-pen"/></span> Edit</button>

        </div>

        <div className='edit_profile_content my-5 pb-5 pe-5'>
            <Row>
                <Col  xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
                    <div className='edit_profile_img_align w-100'>
                    <img className='edit_profile_img' src={onchangeimg?onchangeimg:require('../app/assets/images/collection.png')}/>

                    <button className='editprfl_edit_btn mt-2'><input className='choose_file_input_dtls' type='file' id="Profile" name="upload" onChange={(e) => handleFile(e)}/>Edit Profile</button>
                    </div>

                </Col>
                <Col className='edit_profile_whole_inputs' xxl={10} xl={10} lg={10} md={10} sm={12} xs={12}>
                    <Row>
                        <Col className='p-3' xxl={6} xl={6} lg={6} md={12} sm={12} xs={12}>
                        <label className='input_labels' for="fname">Display Name</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Enter Display Name' id="DisplayName" value={DisplayName} onChange={onChange} required/>
                        {ValidateError && ValidateError.DisplayName && <span className="error_msg">{ValidateError.DisplayName}</span>}

                        <label className='input_labels mt-3' for="fname">Custom URL</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='https://app.XDSea nft.com/Enter unique name' id="CustomUrl" value={CustomUrl}  onChange={onChange} required />
                        {ValidateError && ValidateError.CustomUrl && <span className="error_msg">{ValidateError.CustomUrl}</span>}

                        <label className='input_labels mt-3' for="fname">Wallet Address</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='kjahsp9843yroketjpow8ytowehwp9t8' value={payload?.WalletAddress}/>

                        <label className='input_labels mt-3' for="fname">Bio</label><br/>
                        <textarea className='edit_profile_textarea mt-3' placeholder='Tell about yourself in few words'id="Bio" value={Bio} onChange={onChange}  rows="5" >

</textarea>
                        
                        </Col>
                        <Col className='p-3' xxl={6} xl={6} lg={6} md={12} sm={12} xs={12}>
                        <label className='input_labels' for="fname">Email</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='sample@gmail.com'  id="EmailId" value={EmailId}  onChange={onChange} required/>
                        {ValidateError && ValidateError.EmailId && <span className="error_msg">{ValidateError.EmailId}</span>}

                        <label className='input_labels mt-3' for="fname">Personal Site or Portfolio</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Your own Website Link' id="Website" value={Website} onChange={onChange}/>

                        <label className='input_labels mt-3' for="fname">Twitter User Name</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Enter twitter User Name'  id="Twitter" value={Twitter} onChange={onChange}/>

                        <label className='input_labels mt-3' for="fname">Instagram User Name</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Enter Instagram User Name' id="Instagram" value={Instagram}  onChange={onChange}/>
                        <div className='update_profile_btn_align w-100'>

                        <button className='update_profile_btn mt-2' onClick={FormSubmit}>Update Profile</button>
                        </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </Container>
    <Footer/>
    </>
  )
}
 
export default EditProfile