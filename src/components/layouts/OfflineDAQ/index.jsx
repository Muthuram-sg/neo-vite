import React,{useState,useEffect} from 'react';
import OfflineTab from './OfflineTab';
import OfflineDAQ from './OfflineDAQ';
import Production from './ProductionDAQ/Production';
import { useRecoilState } from "recoil";
import {selectedPlant} from "recoilStore/atoms"

const OfflineIndex = () => {
 const [tabValue, setTabValue] = useState(0);
 const [headPlant] = useRecoilState(selectedPlant);
 const [hideTabtitle,setHideTabTitle]=useState("enable");


useEffect(()=>{

  setTabValue(0)
},[headPlant])

 const handleChange = (event, newValue) => {
  setTabValue(newValue);
};


const hideTab=(type)=>{
    setHideTabTitle(type)
}

console.log(hideTabtitle,tabValue,"tab")

const MenuList = [
 {
     title:"Offline Instruments",
     content:<OfflineDAQ hideTabtitle={hideTabtitle} hideTab={hideTab}  />
 },
 
  {
    title:   "Offline Production" ,
    content: <Production hideTab={hideTab} /> 
  }

]


 return (
  <React.Fragment>
    <div  className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-b border-Border-border-50 dark:border-Border-border-dark-50'>
   <div style={{ maxWidth: '50%' }} >
      {
      hideTabtitle==="enable" ?
       <OfflineTab  currentTab={tabValue} tabChange={handleChange}  isDisable ={hideTabtitle ==="enable" ? true : false}/>
        :<></>
     }  
        </div>
      </div>
      {MenuList[tabValue].content}
  </React.Fragment>
 );
}

export default OfflineIndex;