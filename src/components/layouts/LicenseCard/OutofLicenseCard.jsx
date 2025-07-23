import React, { useState } from "react";
import KpiCardsNDL from "components/Core/KPICards/KpiCardsNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import HorizontalLineNDL from "components/Core/HorizontalLine/HorizontalLineNDL";
import Button from "components/Core/ButtonNDL";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil"; 
import {selectedPlant} from "recoilStore/atoms";
import GridNDL from 'components/Core/GridNDL'



const Drawer = React.lazy(() => import('components/app/LeftDrawer.jsx'));
const Support = React.lazy(() => import("components/layouts/Support"));


export default function OutofLicenseCard(){
const [isSupport,setisSupport] = useState(false)
const  handleSupport =()=>{
    setisSupport(true)



}   

    return(
        <React.Fragment>
        <Drawer noLicense />

        {/* <AppBar isLicense isSupport={isSupport} /> */}
        {
            !isSupport ?
<GridNDL container >
            <GridNDL sm={4}/>
            <GridNDL sm={4}>
            <div className="flex justify-center items-center mt-[50%]">
            <KpiCardsNDL style={{height:"264px"}}>
                <div className="h-[40px]">
                <TypographyNDL value='Your license has expired!' variant='heading-02-s'/>
                </div>
                <HorizontalLineNDL variant='divider1'/>
                <br></br>
                <div className="h-[88px]">

                <TypographyNDL value='Renew your license to continue using the application, stay connected, and maintain continuous data monitoring.' variant='lable-01-m' /> 
                <br></br>
                <TypographyNDL value='For assistance, contact our support team.' variant='lable-01-m' /> 
                </div>
                <br></br>
                <div className="float-right">
                <Button   variant="primary"                
                value={'Contact Support'}  onClick={()=>handleSupport()}
                  />
                  </div>
            </KpiCardsNDL>
        </div>
                </GridNDL>
            <GridNDL sm={4}/>

        </GridNDL>
        :
        <Support />
        }
        
       
        </React.Fragment>
    )

}