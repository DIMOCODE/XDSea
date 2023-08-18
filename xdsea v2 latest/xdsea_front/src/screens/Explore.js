 
import React,{useEffect} from 'react'
import FilterContent from '../Components/FilterContent'
import Header from '../app/Header'
import Footer from '../app/Footer'

function Explore() {

  useEffect(() =>{
    window.scrollTo(0,0);
},[])
  return (
    <>
    <Header/>
    <FilterContent/>
    <Footer/>
    </>
  )
}

 
export default Explore