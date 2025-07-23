import React, { useEffect,useState } from 'react';
import {useParams} from 'react-router-dom'
import { useTranslation } from "react-i18next";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import OEEIcon from 'assets/neo_icons/Dashboard/OEE_icon.svg';   
import useGetOEE from '../hooks/useGetOEE';
import { dashBtnGrp,userDefaultLines } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import OEEIcons from 'assets/neo_icons/newUIIcons/OEE 1.svg?react';



function OEEDashboard(props){
    const { t } = useTranslation();
    let {moduleName,subModule1} = useParams()
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [Details,setDetails] = useState({});
    const [plantata,setPlantData] = useState([])
    const [userDefaultList] = useRecoilState(userDefaultLines);  
    const  { GetOEELoading, GetOEEData, GetOEEError, getOEEFunc } = useGetOEE();
    useEffect(()=>{

            getOEEFunc(btGroupValue,props.headPlant); 
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[btGroupValue])
    useEffect(()=>{
        if(!GetOEELoading && GetOEEData && !GetOEEError){
            let exist = {...Details};
            let actual = 0;
            let today = 0;
            let actual_oee = 0;
            let today_oee = 0;
            const formatted = GetOEEData.map(x=>{
                const currObj = {...x};
                const childPlant = userDefaultList.filter(y=> y.line.id === x.line).map(z=>z.line)[0];
                currObj['line_name'] = childPlant.name;
                currObj["plantName"]= childPlant.name;
                currObj['module'] = 'dashboard';
                currObj['type'] = 'oee';
                currObj['title'] = "OEE";
                currObj['icon'] = OEEIcon;
                currObj['schema'] = childPlant.plant_name
                actual_oee += Number(x.actual_range);
                today_oee += Number(x.today); 
                if (btGroupValue === 6 || btGroupValue === 7 || btGroupValue === 10 || btGroupValue === 11  || btGroupValue === 19  || btGroupValue === 20  || btGroupValue === 21  || btGroupValue === 22  || btGroupValue === 23) {
                    currObj['actual_range'] = x.actual_range;
                }   else{
                    currObj['actual_range'] = null;
                }       
                return currObj;
            })
            if (btGroupValue === 6 || btGroupValue === 7 || btGroupValue === 10 || btGroupValue === 11  || btGroupValue === 19  || btGroupValue === 20  || btGroupValue === 21  || btGroupValue === 22  || btGroupValue === 23) {
                actual = Math.floor(actual_oee/formatted.length);
            }else{
                actual = '--'
            }
            
            today = Math.floor(today_oee/formatted.length)
            // console.log(moduleName,subModule1,formatted,"oee check")
            setPlantData(formatted);
            exist['actual'] = actual;
            exist['today'] = today;
            setDetails(exist);
            props.loading(false,formatted,'OEE')
             
        }  
        if(!GetOEELoading && !GetOEEData && GetOEEError){
            setPlantData([]);
            setDetails({});
            props.loading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[GetOEEData,moduleName,subModule1])
    return(
        <Card  style={{cursor:'pointer',height:"160px"}} onClick={()=>props.getChild(plantata,'OEE')}>
                            <div   className='flex flex-col justify-between gap-2' >

                                
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("OEE")}/>
                                    {GetOEELoading ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                                    <OEEIcons />
                                </div>
                                <TypographyNDL mono  variant="display-lg">
                                {Details && !isNaN(Details.actual) && Details.actual !== null?Details.actual +'%':"--"}</TypographyNDL>
                                <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{Details && !isNaN(Details.today) && Details.today !== null ?Details.today +'%':"--"}</TypographyNDL>
                             </div>
                            </div>
                        </Card>
    )
}
export default OEEDashboard;
