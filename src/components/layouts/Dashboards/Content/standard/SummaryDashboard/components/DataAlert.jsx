import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom"
import { useTranslation } from "react-i18next";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import AlarmIcon from 'assets/neo_icons/Dashboard/Alarm_icon.svg' 
import useDataAlertsPlant from '../hooks/useDataAlertsPlant.jsx'
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import AlarmsIcon from 'assets/neo_icons/newUIIcons/TrigeredAlarm.svg?react';


function DataAlert(props){
    const { t } = useTranslation();
    let {moduleName,subModule1} = useParams()
    const [flag,setFlag] = useState(true)
    const [AlertPlants,setAlertPlants] = useState([]);
    const [Loading,setLoading] = useState(false);
    const [ActualAlerts,setActualAlerts] = useState([]);
    const { DataAlertsPlantLoading, DataAlertsPlantData, DataAlertsPlantError, getDataAlertsPlant } = useDataAlertsPlant() 

    useEffect(()=>{
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
        if(childLine && childLine.length>0 && props.userDefaultList.length>0){ 
            setLoading(true) 
            console.log(props.userDefaultList,"userDefaultListDataAlert")
            getDataAlertsPlant(childLine.filter(e=> e.line_id !== props.headPlant.id),props.btGroupValue,props.userDefaultList,props.customdatesval)
        }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.headPlant.id,props.btGroupValue])

    useEffect(()=>{
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
         if(props.DatesSearch && childLine && childLine.length>0){
            setLoading(true)
            props.loading(true)
            getDataAlertsPlant(childLine.filter(e=> e.line_id !== props.headPlant.id),props.btGroupValue,props.userDefaultList,props.customdatesval)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.DatesSearch])

    useEffect(() => { 
        if (!DataAlertsPlantLoading && DataAlertsPlantData && !DataAlertsPlantError) {
            let Alertresult = []; 
            DataAlertsPlantData.forEach(x => Alertresult = [...Alertresult, ...x]);
            let AlertData = Alertresult.map(e=>{
                return {...e , actual_range: Number(e.Data.count), 
                    line_name: e.childPlant.name,
                    plantName:e.childPlant.name,
                    line: e.childPlant.id,
                    schema:e.childPlant.plant_name,
                    module: 'explore',
                    type: "alarms",
                    title: 'Data Alert',
                    icon: AlarmIcon
                }
            })
            setAlertPlants(AlertData)
            setLoading(false)
            props.loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DataAlertsPlantLoading, DataAlertsPlantData, DataAlertsPlantError])

    useEffect(()=>{
        if((props.AlertDefault.length>0) && (AlertPlants.length > 0)){
            let actualData = props.AlertDefault.map(e=>{
                let filterplant = AlertPlants.filter(f=>f.line_name === e.line_name) ;
                console.log("filterplant",filterplant)
                return {...e , actual_range: filterplant[0] && !isNaN(filterplant[0].actual_range) 
                    ? filterplant[0].actual_range 
                    : 0, 
                    module: 'Alarms',
                    type: "overview",
                    title: 'Data Alert',
                    icon: AlarmIcon
                }
            })
            setActualAlerts(actualData)
            if(moduleName === 'BI' && subModule1 === 'Data Alerts' && actualData.length > 0 && flag){
                props.getChild(actualData,'Data Alert')
                setFlag(false)
            }
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.AlertDefault,AlertPlants]) 


    return(
        <Card style={{cursor:'pointer', height:"160px"}}  onClick={()=>props.getChild(ActualAlerts,'Data Alert')}>
            <div className='flex flex-col justify-between gap-2'>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Data Alert")}/>
                {Loading ? <CircularProgress disableShrink size={15} color="primary" /> :<> </>}
                <AlarmsIcon />
                </div>
                <TypographyNDL mono  variant="display-lg">
                {(ActualAlerts.reduce((partialSum, x) => partialSum + x.actual_range, 0))}</TypographyNDL>
                <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{(ActualAlerts.reduce((partialSum, x) => partialSum + x.today, 0))}</TypographyNDL>
                             </div>
            </div>
        </Card>
    )
}
export default DataAlert;