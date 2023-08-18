 
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";

import HomePage from "../screens/HomePage";
// import HomePage from "../app/Home";

import Create from "../screens/Create";
import CollectionList from "../screens/CollectionList";
import CollectionDetails from "../screens/CollectionDetails";
import EditProfile from "../screens/EditProfile";
import Explore from "../screens/Explore";
import CreateCollection from "../screens/CreateCollection";
import MyItems from "../screens/MyItems";
import InfoPage from "../screens/InfoPage";
import Earn from "../screens/earn"
import SearchPage from "../screens/SearchPage";
import Categories from '../screens/Categories'
import Drops from "../screens/Drops";
import StackDetails from '../screens/StakingDetails'
import CartPage from "../screens/CartPage";

 

function MyRoutes() {
  return (
    <>
     
        <Routes  >
        <Route exact path='/' element={<HomePage/>}></Route>
        <Route exact path='/home/:id' element={<HomePage/>}></Route>

        <Route exact path='/create' element={<Create/>}></Route>
        <Route exact path='/collectionList' element={<CollectionList/>}></Route> 
        <Route exact path='/mycollections/:Creator' element={<CollectionList/>}></Route> 
        {/* <Route exact path='/collection/:url' element={<CollectionList/>}></Route>  */}
        {/* <Route exact path='/explore/All' element={<Explore/>}></Route>  */}
        <Route exact path='/explore/:category' element={<Explore/>}></Route> 

        <Route exact path='/collectionDetails' element={<CollectionDetails/>}></Route>
        <Route exact path='/editProfile' element={<EditProfile/>}></Route>
        <Route exact path="/my-item/:customurl" element={<MyItems/>}></Route>
        <Route exact path='/myitem' element={<MyItems/>}></Route>
        <Route exact path='/earn' element={<Earn/>}></Route>
        <Route exact path='/category' element={<Categories/>}></Route>
        <Route exact path='/drops' element={<Drops/>}></Route>
        <Route exact path='/stackdetails/:creator/:customurl' element={<StackDetails/>}></Route>
        <Route exact path='/cartpage' element={<CartPage/>}></Route>
        

        <Route exact path="/search/:key" element={<SearchPage/>} />
 
 
        <Route exact path='/info/:network/:Contract/:Owner/:Id' element={<InfoPage/>}></Route>
        {/* <Route exact path='/createCollection/:type' element={<CreateCollection/>}></Route> */}
        <Route exact path='/createCollection/:type/:contracttype' element={<CreateCollection/>}></Route>
        <Route exact path='/collection/:creator/:customurl' element={<CollectionDetails/>}></Route>
        <Route exact path='/importcollection/:creator/:customurl' element={<CollectionDetails/>}></Route>


        <Route exact path='/*' element={<HomePage/>}></Route>
       
 

        
        </Routes>
    
    </>
  )
}

 
export default MyRoutes