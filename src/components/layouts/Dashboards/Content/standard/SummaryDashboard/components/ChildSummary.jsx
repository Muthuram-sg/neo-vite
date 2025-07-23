import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import Grid from 'components/Core/GridNDL' 
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'

function ChildSummary(props){
    const { t } = useTranslation();   
    const [childData,setchildData] = useState([])
    const [IssubData,setIssubData]= useState(false)

    useEffect(()=>{
        if((props.childTitle === 'Gas Consumption') || (props.childTitle === 'Electricity Consumption') || (props.childTitle === 'Energy Price')){
            setchildData(props.childData[0].subChild)
            setIssubData(true)
        }else{
            setchildData(props.childData)
            setIssubData(false)
        }
    },[props.childTitle]) 
    
    return(
        <React.Fragment>
            {
                IssubData &&
                    childData.map(Details=>{
                        return (
                            <Grid xs={3} key={Details.title}>
                                <Card  style={{cursor:'pointer', height:"160px"}} onClick={()=>props.getChild(Details.Data,t(Details.title),3)}>
                                    <div className='flex flex-col justify-between gap-2' 
                                     
                                    >
                                        <div className='flex justify-between'>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t(Details.title)}/>
                                        </div>
                                        <TypographyNDL mono  variant="display-lg">
                                        {(Details.currency ? Details.currency : '') + (Details.Data && Details.Data.length > 0 ? Details.Data.reduce((partialSum, x) => partialSum + (x.actual_range ? x.actual_range : 0), 0) : 0).toFixed(2) + " "+ Details.unit}</TypographyNDL>
                                <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{(Details.currency ? Details.currency : '') + (Details.Data.reduce((partialSum, x) => partialSum + x.today, 0)).toFixed(2) + " "+ Details.unit}</TypographyNDL>
                             </div>
                                        

                                       
                                    </div>
                                </Card>
                            </Grid>
                        )
                    })
            }
            {!IssubData &&
                    childData.map(Details=>{
                        // console.log(Details,"DetailsDetails")
                        let typeValue = Details.type==='oee'?' %':""
                        let Unit = Details.unit ? ' '+Details.unit : '' 
                        let Currency=Details.currency ? Details.currency : '' 
                        return (
                            <Grid item xs={3} key={Details.title}>
                                <Card style={{cursor:'pointer', height:"160px"}} onClick={()=>props.getplants({id:Details.line,module: Details.module,type: Details.type,title:Details.title,schema:Details.schema,name: Details.plantName})}>
                                    <div className='flex flex-col justify-between gap-2'
                                    //  style={{ 
                                    // backgroundImage: `url(${Details.icon})`,
                                    // backgroundPosition: '90% 15%',
                                    // backgroundSize: '35%',
                                    // backgroundRepeat: "no-repeat",
                                    // height: "100%"
                                    // }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={Details.line_name?Details.line_name:""}/>
                                        </div>
                                        <TypographyNDL mono  variant="display-lg">
                                        {(Currency) + ((Details && !isNaN(Details.actual_range) && Details.actual_range !== null && Details.actual_range !== undefined) ? (Number(Details.actual_range).toFixed(Details.type==='Co2 Emission' ? 0:2) + typeValue + Unit) : "--")}</TypographyNDL>
                                        <div className='flex flex-col gap-0.5'>
                                            <div style={{ display: "flex", justifyContent: "space-between"}}>
                                                <TypographyNDL variant="paragraph-xs" color='secondary'>{Details.title === 'Connectivity Alert' ? t("Online"):t("Today")}</TypographyNDL>
                                                {(Details.title === 'Connectivity Alert') && <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Offline")}</TypographyNDL>}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <TypographyNDL mono variant="paragraph-xs" color={(Details.title === 'Connectivity Alert') ? 'success' : 'primary'} >{(Currency) + ((Details && !isNaN(Details.today) && Details.today !== null && Details.today !== undefined) ? (Number(Details.today).toFixed(Details.type==='Co2 Emission' ? 0:2) + typeValue + Unit) : "--")}</TypographyNDL>
                                                {(Details.title === 'Connectivity Alert') && <TypographyNDL mono variant="paragraph-xs" color='danger'>{Details && !isNaN(Details.Offline) && Details.Offline !== null ?Details.Offline:"--"}</TypographyNDL>}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        )
                    })
            }
            
        </React.Fragment>        
    )
}
export default ChildSummary;