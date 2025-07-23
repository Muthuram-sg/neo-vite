import React, { useEffect, useState } from "react";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Neo from 'assets/neo_icons/neo_main_icon.svg?react';
import{themeMode, selectedPlant} from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import LogoNDL from "components/Core/Logo/LogoNDL";
import axios from "axios";
import configParam from "../../../config";
// import Grindsmart from 'assets/neo_icons/Logos/GrindSmart.svg?react';
// import Cmsicon from 'assets/neo_icons/Logos/cmslogo.svg?react';

const NotAccessRequired = () => {
  const [curTheme]=useRecoilState(themeMode)
  const [headPlant, setheadPlant] = useRecoilState(selectedPlant);

  const [logo, setLogo] = useState('')

  const changeFavIcon = () => {
    try{
      if(headPlant.id){
        // console.clear()
        // let blob = null;
        if(localStorage.getItem('mode') === 'dark'){
          // alert("1")
        axios.get(configParam.API_URL+`/settings/downloadLogo?category=dark_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
          .then((response) => {
            console.log(response,"__RESPONSE")
            let blob = new Blob([response?.data], { type: "image/svg+xml" });
            // localStorage.setItem('logo', URL.createObjectURL(blob))
            setLogo(URL.createObjectURL(blob))
  
          }).catch((e) => {
            console.log(e)
            return null
          })
          
          
        }
        else {
          axios.get(configParam.API_URL+`/settings/downloadLogo?category=light_logo&line_id=${headPlant.id}&x-access-token=${localStorage.getItem("neoToken").replace(/['"]+/g, "")}`)
          .then((light_logo) => {
            let blob = new Blob([light_logo?.data], { type: "image/svg+xml" });
            setLogo(URL.createObjectURL(blob))
          }).catch((e) => {
            return null
          })
        }
      }
    }
    catch(e){
      console.log("(((")
      return null
    }
    
  }

  useEffect(() => {
    changeFavIcon()
  }, [])

  return (
    <div className={`${curTheme === 'dark' ? 'bg-Background-bg-secondary-dark' : "bg-Background-bg-secondary"} h-screen flex items-center justify-center`}>
    <div >
          <div className={`${curTheme === 'dark' ? 'bg-Background-bg-primary-dark  border-Border-border-dark-50 ' : " bg-Background-bg-primary p-4 border-Border-border-50"} block w-full h-full   border rounded-2xl   p-4`}>
            <div style={{paddingBottom:"10px"}}>
            {logo ? <LogoNDL src={logo} alt={'IIOT Platform'} /> : <Neo /> }
            </div>
           
                <TypographyNDL value="Sorry you don't have access to view this page." variant='heading-02-s'/><br/>
                <TypographyNDL value="Please request access from the sender or administrator." variant='paragraph-xs'/><br/>
                <div className="flex flex-col items-center text-center">
                <TypographyNDL value="You can also email us for support at." variant='paragraph-xs'/>
                <a 
                                        href="mailto:UNIGEN.NEOSupport@saint-gobain.com?cc=Srivatsan.R@Saint-Gobain.com&subject=Access Required"
                                        style={{ fontSize: '10px', color: 'blue', textDecoration: 'underline' }}
                                    >
                                   UNIGEN.NEOSupport@saint-gobain.com    
                 </a>
         </div>  </div>
      </div>
    </div>
      
  
  )
}

export default NotAccessRequired
