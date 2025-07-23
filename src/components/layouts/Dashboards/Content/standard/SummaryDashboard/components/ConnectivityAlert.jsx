import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom"
import { useTranslation } from "react-i18next";
import Card from "components/Core/KPICards/KpiCardsNDL";  
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Connectivit from 'assets/neo_icons/Dashboard/Show-Connectivit-Status.svg' 
import useConnectAlertsPlant from '../hooks/useConnectAlertsPlant';
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import ConnectivityAlertIcon from 'assets/neo_icons/newUIIcons/Connectivity.svg?react';



function ConnectivityAlert(props){
    const { t } = useTranslation();
    let {moduleName,subModule1} = useParams()
    const [Loading,setLoading] = useState(false);
    const [ActualConnect,setActualConnect] = useState([]);
    const { ConnectAlertsPlantLoading, ConnectAlertsPlantData, ConnectAlertsPlantError, getConnectAlertsPlant } = useConnectAlertsPlant()

    useEffect(()=>{
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
        if(childLine && childLine.length>0 && props.InstrumentMet.length>0 && props.userDefaultList.length>0){ 
            setLoading(true)
            getConnectAlertsPlant(childLine.filter(e=> e.line_id !== props.headPlant.id),props.userDefaultList,props.InstrumentMet,props.customdatesval)
        }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.headPlant.id,props.InstrumentMet])
  
    useEffect(() => { 
        if (!ConnectAlertsPlantLoading && ConnectAlertsPlantData && !ConnectAlertsPlantError) {
            let Connectresult = []; 
            ConnectAlertsPlantData.forEach(x => Connectresult = [...Connectresult, ...x]);
            let ConnectData = Connectresult.map(e=>{
                return {...e , actual_range: e.Total,
                    today: e.Online, 
                    line_name: e.childPlant.name,
                    plantName:e.childPlant.name,
                    line: e.childPlant.id,
                    schema: e.childPlant.plant_name,
                    module: 'dashboard',
                    type: "connectivity",
                    title: 'Connectivity Alert',
                    icon: Connectivit
                }
            })
            setActualConnect(ConnectData)
            setLoading(false)
            if(moduleName === 'BI' && subModule1 === 'Connectivity' && ConnectData.length > 0){
                props.getChild(ConnectData,'Connectivity')
            }
           
            // console.log(ConnectData,"ConnectDataConnectData")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ConnectAlertsPlantLoading, ConnectAlertsPlantData, ConnectAlertsPlantError])

    return(
        <Card style={{cursor:'pointer', height:"160px"}} onClick={()=>props.getChild(ActualConnect,'Connectivity')}>
                            <div className='flex flex-col justify-between gap-2' >
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("connectivity")}/>
                                    {Loading ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                                    <ConnectivityAlertIcon />
                                </div>

  <TypographyNDL mono  variant="display-lg">
  {(ActualConnect.reduce((partialSum, x) => partialSum + x.actual_range, 0))}</TypographyNDL>
                                <div >
                                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                                        <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Online")}</TypographyNDL>
                                        <TypographyNDL variant="paragraph-xs" color='secondary' >{t("Offline")}</TypographyNDL>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}> 
                                    <TypographyNDL mono variant="paragraph-xs" color='success' >{(ActualConnect.reduce((partialSum, x) => partialSum + x.today, 0))}</TypographyNDL> 
                                    <TypographyNDL mono variant="paragraph-xs" color='danger'>{(ActualConnect.reduce((partialSum, x) => partialSum + x.Offline, 0))}</TypographyNDL>
                                    </div>
                                </div>
                            </div>
                        </Card>
    )
}
export default ConnectivityAlert;