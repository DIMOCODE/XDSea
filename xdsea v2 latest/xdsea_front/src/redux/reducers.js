 
import { combineReducers } from "redux";
import { Data_Section, Account_Section, ServiceFees_Section } from "./constants";

const Initial_State = {
  currency : [],
  Categorys:[],
  USD:{
    BNB : '',
    ETH : ''
  },
  User:{
    token : '',
    payload : null
  },
  CMS: {
    impactcollectivemarketplace   :   '',
    latestdrop   :   '',
    featuredartist   :   '',
    footer   :   '',
    aboutus   :   '',
    contactus   :   '',
    termsofservice   :   '',
    privacypolicy   :   '',
},
    AccountDetails:{
        accountAddress : '',
        tokenBalance : 0,
        coinBalance : 0,
        web3        : null,
        web3p : null
    },
    ServiceFees:{
      buyerFees : '0',
      sellerFees : '0'
    }
  }


function LoginReducer(state = Initial_State, action) {
    switch (action.type) {
      case Data_Section:
        return {
          ...state,
          ...action.Register_Section
        }
      case Account_Section:
        return {
          ...state,
          ...action.Account_Section
        }
        case ServiceFees_Section:
          return {
            ...state,
            ...action.ServiceFees_Section
          }
      default:
        return state;
    }
  }  


const ImpactApp = combineReducers({LoginReducer:LoginReducer});
 
export default ImpactApp;