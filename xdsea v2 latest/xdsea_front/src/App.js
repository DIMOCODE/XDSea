 
import React, { useState, useEffect, useRef, useContext, } from "react";
import logo from './logo.svg';
import './App.css';
import Header from './app/Header';
import Footer from './app/Footer';
import Home from './app/Home';
import Create from './screens/Create';
import MyRoutes from './router/MyRoutes'

function App() {
  return (
      <>
       <MyRoutes/>
      </>
  );
}

export default App;
 
