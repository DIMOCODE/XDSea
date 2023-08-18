 
import React,{useState,useEffect} from 'react'
import Header from '../app/Header'
import Footer from '../app/Footer'
import { Container,Row,Col } from 'react-bootstrap'
import Select from "react-select";
import { useParams,useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import config from "../config/config.js"
import {createNewCollection,ImportNewCollection} from "../actions/axioss/nft.axios.js"
import { toast } from "react-toastify";
toast.configure()

function CreateCollection() {

  useEffect(() =>{
    window.scrollTo(0,0);
},[])
    const options = [
        { value: 'ERC 721', label: 721 },
        { value: 'ERC 1155', label: 1155 },
        
      ]
      const styles = {
        option: (styles, {isFocused, isSelected}) => ({
          ...styles,
          color: "white",
          background: isFocused
              ? '#414141'
              : isSelected
                  ? '#343434'
                  : "#161616",
          zIndex: 1
      }),
        valueContainer: (provided, state) => ({
          ...provided,
          height: '45px',
          padding: '0 6px',
          backgroundColor: "#fff ",
          
        borderRadius: 30,
        padding:10,
        
        
        }),
        control: (provided, state) => ({
          ...provided,
          height: '45px',
          borderRadius:30,
          backgroundColor: "#fff",
          border:'none'
         
        }),
        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: '45px',
          position: 'absolute',
          right: 0,
          top: 0,
          color:'#fff' 
        }),    
        singleValue: (provided, state) => ({
          ...provided,
          color: "#fff"
        }),
        menuList: base => ({
          ...base,
          // kill the white space on first and last option
          padding: 0
        })
      };

      const stylesselect = {
        option: (styles, {isFocused, isSelected,siHovered}) => ({
          ...styles,
          color: "white",
          background: isFocused
              ? 'rgba(60,88,203,1)'
              : isSelected
                  ? '#262626 '
                  : "#262626 ",
          zIndex: 1,
          cursor:"pointer"
      }),
        valueContainer: (provided, state) => ({
          ...provided,
          height: '66px',
          padding: '0 6px',
          backgroundColor: "rgba(60,88,203,1)",
        borderRadius: 30,
        padding:10
        
        }),
        control: (provided, state) => ({
          ...provided,
          height: '66px',
          borderRadius:30,
          backgroundColor: "#fff",
          border:'none'
         
        }),
        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: '66px',
          position: 'absolute',
          right: 0,
          top: 0,
          color:'#fff' 
        }),    
        singleValue: (provided, state) => ({
          ...provided,
          color: "#fff"
        }),
        menuList: base => ({
          ...base,
          // kill the white space on first and last option
          padding: 0
        })
      };

      ///    ------> collection creation

      var {type} = useParams();
      var {contracttype} = useParams();

      var navigate = useNavigate();
      const { web3p, web3, accountAddress } = useSelector(
        (state) => state.LoginReducer.AccountDetails
      );

      useEffect(()=>{
        setCollectionData({
          ...collectionData,
          ...{ ["Creator"]: accountAddress ,
              },
        })
      },[accountAddress])

      useEffect(()=>{
        setCollectionData({
          ...collectionData,
          ...{ ["collectionType"]: contracttype == "Single" ? 721:1155,
               ["contractAddress"]:(contracttype == "Single")?config.ERC721:config.ERC1155},
        })
      },[contracttype])

      var initState = {"profile":"","banner":"","collectionName":"","customUrl":"","collectionType":"","contractAddress":"","Bio":"","royalty":0,"twitter":"","instagram":"",
                       "Creator":accountAddress}

      
      const [collectionData,setCollectionData] = useState(initState);
      const [err,setErr] = useState({});
      const [profile,setProfile] = useState(require('../app/assets/images/collection.png'));
      const [banner,setBanner] = useState(require("../../src/app/assets/images/bannerbig.jpg"));
      const [createbutton,setcreatebutton] = useState(false)



      const onChange = async(e,type)=>{
          
          setErr({})
          if(e && e.target && !e.target.files ){

            const { files, value, id, name } = e.target;
            setCollectionData({ ...collectionData, ...{ [id]: value } });
          }

          if (e?.target?.files) {
             
             // validation for image file
             var fileType = (e?.target?.files)[0].type
             if(!fileType.includes("image")) return toast.error("File should be of jpg/jpeg/png/gif format.") 

             if(type == "banner"){ 
              setBanner(URL.createObjectURL((e?.target?.files)[0]))
              setCollectionData({ ...collectionData, ...{ ["banner"]: (e?.target?.files)[0] } })
             }
             else {
              setProfile(URL.createObjectURL((e?.target?.files)[0]))
              setCollectionData({ ...collectionData, ...{ ["profile"]: (e?.target?.files)[0] } })

             }

             
          }

      }


      const validation = async(data)=>{

  
        if(!accountAddress) return toast.error("Please connect wallet")
        var errors = {}
        
        var validateKeys = ["profile","banner","collectionName","customUrl","collectionType","contractAddress","Creator"]

        validateKeys.forEach((key)=>{
          if(!collectionData[key]){
            errors[key] = `${key} cannot be empty`
          }
        })

        if(collectionData["customUrl"] && !config.OnlyAlphSpecial.test(collectionData["customUrl"]))
            errors["customUrl"] = `CustomUrl cannot be empty and should contain only letters`

        if(type != "gallery"){
          if(collectionData["royalty"] < 0 || !collectionData["royalty"] ) errors["royalty"] = "Royalty must be greater than 0"

          if(collectionData["contractAddress"] && (String(collectionData["contractAddress"]).toLowerCase() == config.ERC721 || String(collectionData["contractAddress"]).toLowerCase() == config.ERC1155 || String(collectionData["contractAddress"]).toLowerCase() == config.TradeContract))
             errors["contractAddress"] = "can't import market place contract"
       
        }

        setErr(errors)
        return errors;
        // var nameUrlErr = await createNewCollection()

       

      }

      const onSubmit = async()=>{

        var validateErr = await validation(collectionData)

        if(Object.keys(validateErr).length >0){
            return toast.error("Enter correct data and try again")
        }else{
         
          const id = toast.loading("Creating Collection");
          setcreatebutton(true)
          if(type == "gallery")
             var create = await createNewCollection(collectionData)
          else{
             collectionData.isImported = true
             var create = await ImportNewCollection(collectionData)
          }
          if(create?.error){
            setcreatebutton(false)

            if(create.error?.name) { setErr(err => {
              return { 
                ...err, 
                collectionName: create?.error?.name
              }
            })}

            if(create.error?.customurl) { setErr(err => {
              return { 
                ...err, 
                customUrl: create?.error?.customurl
              }
            })}
            if(create.error?.contractAddress) { 
              setErr(err => {
              return { 
                ...err, 
                customUrl: create?.error?.contractAddress
              }
            })}
            
            

          }
          if(create.status) {
          //  toast.success(create.msg)
          setcreatebutton(false)

           toast.update(id, {
            render:  "Collection Successfully Created",
            type:  "success",
            isLoading: false,
            autoClose: 1000,
          });
           navigate("/collectionList")
          }else{
            setcreatebutton(false)

            return toast.update(id, {
              render:  "Try-again",
              type:  "error",
              isLoading: false,
              autoClose: 1000,
            });
          }

        }
        
       

      }



  return (
    <>
    <Header/>

    <Container fluid className='edit_profile_whole_content'>
        <div className='banner_img_align'>

        <img src={banner?banner:require('../app/assets/images/bannerbig.jpg')}/>
            <button className='banner_edit_btn'><input   name="banner"
                              id="banner"
                              accept="image/*"
                              onChange={(e) => onChange(e, "banner")}
 className='choose_file_input_dtls' type='file'/><span><i class="fa-solid fa-pen"/></span> Edit</button>

   

        </div>
                       {err.banner && (
                          <span className="text-danger img-file">
                            {err.banner}
                          </span>
                        )}
        <div className='edit_profile_content my-5 pb-5 pe-5'>
            <Row>
                <Col  xxl={2} xl={2} lg={2} md={2} sm={12} xs={12}>
                    <div className='edit_profile_img_align w-100'>
 
                    <img className='edit_profile_img' src={profile?profile:require('../app/assets/images/collection.png')}/>
                    <button className='edit_profile_btn mt-2'><input className='choose_file_input_dtls' type='file'   name="profile"
                              id="profile"
                              accept="image/*"
                              onChange={(e) => onChange(e, "profile")}
 />Edit Profile</button>
 
 
                    </div>
                    {err.profile && (
                          <span className="text-danger img-file">
                            {err.profile}
                          </span>
                        )}

                </Col>
                <Col className='edit_profile_whole_inputs' xxl={10} xl={10} lg={10} md={10} sm={12} xs={12}>
                    <Row>
                        <Col className='p-3' xxl={6} xl={6} lg={6} md={12} sm={12} xs={12}>

                        <label className='input_labels' for="fname">Collection Name</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Untitled Collection Name' id="collectionName" name="collectionName" onChange={onChange}/>

                        {err.collectionName && (
                          <span className="text-danger img-file">
                            {err.collectionName}
                          </span>
                        )}
                        <br/>
                        <label className='input_labels mt-3' for="fname">Collection URL</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='https://app.XDSea nft.com/Untitled Collection 7417' id="customUrl" name="customUrl" onChange={onChange}/>
                        {err.customUrl && (
                          <span className="text-danger img-file">
                            {err.customUrl}
                          </span>
                        )}

                       {type != "gallery" &&
                       <>
                        <label className='input_labels mt-3' for="fname">Contract Address</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='kjahsp9843yroketjpow8ytowehwp9t8' id="contractAddress" name="contractAddress" onChange={onChange}/>
                        {err.contractAddress && (
                          <span className="text-danger img-file">
                            {err.contractAddress}
                          </span>
                        )}
                        </>
                        
                        }
                        <br/>

                        <label className='input_labels mt-3' for="fname">Bio</label><br/>
                        <textarea className='edit_profile_textarea mt-3' placeholder='Tell about yourself in few words' id="Bio"  rows="6" name="Bio" onChange={onChange}>

                        </textarea>
                        {err.Bio && (
                          <span className="text-danger img-file">
                            {err.Bio}
                          </span>
                        )}
                        
                        </Col>
                        <Col className='p-3' xxl={6} xl={6} lg={6} md={12} sm={12} xs={12}>
                           {/* {type == "gallery" ?
                          <>                        <label className='input_labels mb-3' for="fname">Collection Type</label><br/>
                                             <Select
                                                id="collectionType"
                                                name="collectionType"
                                                onChange={(e) =>{
                                                  setCollectionData({
                                                    ...collectionData,
                                                    ...{ ["collectionType"]: e.label ,
                                                         ["contractAddress"]:(e.label == 721)?config.ERC721:config.ERC1155},
                                                  })

                                                  setErr({})
                                                }
                                                }
                                                options={options}
                                                styles={styles} className="border_blue_select"
                                                classNamePrefix="react-select"
                                            />
                          {err.collectionType && (
                          <span className="text-danger img-file">
                            {err.collectionType}
                          </span>
                        )}
                        </>

                        :
                        <>
                        <label className='input_labels mb-3' for="fname">Collection Type</label><br/>
                                             <Select
                                                id="collectionType"
                                                name="collectionType"
                                                onChange={(e) =>{
                                                  setCollectionData({
                                                    ...collectionData,
                                                    ...{ ["collectionType"]: e.label ,
                                                         }
                                                  })

                                                  setErr({})
                                                }
                                                }
                                                options={options}
                                                styles={styles} className="border_blue_select"
                                                classNamePrefix="react-select"
                                            />
                          {err.collectionType && (
                          <span className="text-danger img-file">
                            {err.collectionType}
                          </span>
                        )}
                        </>
                        } */}
                        <label className='input_labels mt-3' for="fname">Collection Type</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Your own Website Link' id="royalty" name="royalty" value={collectionData?.collectionType}/>
                      
                      
                       {type != "gallery" &&
                       <>
                        <label className='input_labels mt-3' for="fname">Collection Royalty</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Enter royalty amount' id="royalty" name="royalty" onChange={onChange}/>
                        {err.royalty && (
                          <span className="text-danger img-file">
                            {err.royalty}
                          </span>
                        )}
                        </>}
                        <br/>

                        <label className='input_labels mt-3' for="fname">Twitter User Name</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Enter twitter User Name' id="twitter" name="twitter" onChange={onChange}/>

                        <label className='input_labels mt-3' for="fname">Instagram User Name</label><br/>
                        <input type="text" className='edit_profile_inputs mt-3' placeholder='Enter Instagram User Name' id="instagram" name="instagram" onChange={onChange}/>
                       
                       
                        <div className='update_profile_btn_align w-100'>




                        <a data-ignore-split="true" class="Button"  id="" disabled={createbutton}onClick={()=>onSubmit()} tabindex="0" aria-label="">
    Create
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-helper"></span>
    <span class="Button-hover-content" aria-hidden="true">Create</span>
    <span class="Button-hover-content" aria-hidden="true">Create</span>
    <span class="Button-hover-content" aria-hidden="true">Create</span>
    <span class="Button-hover-content" aria-hidden="true">Create</span>
  </a>

                        {/* <button className='update_profile_btn mt-2' disabled={createbutton}onClick={()=>onSubmit()}>Create</button> */}
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
 
export default CreateCollection