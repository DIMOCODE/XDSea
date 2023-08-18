 
import React,{useEffect} from 'react'
import { Container } from 'react-bootstrap'
import TabContent  from '../Components/TabsContent';
import Header from '../app/Header';
import Footer from '../app/Footer';


function Create() {

  useEffect(() =>{
    window.scrollTo(0,0);
},[])
  return (
    <>
    <Header />
    <TabContent/>
    <Footer />
    </>
  )
}

 
export default Create