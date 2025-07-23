import React, { useState,useEffect } from "react";
import { useRecoilState } from "recoil";
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import moment from 'moment';
import {  Loadingpanel,selHierIndex, showEdgeData,showMeterData,edgeUpdateStatus,MeterUpdateStatus  } from "recoilStore/atoms";
import useTheme from "TailwindTheme";
import LoadingScreenNDL from "LoadingScreenNDL";
import GatewayIconDark from 'assets/neo_icons/Equipments/rasberry_pi_dark.svg?react';
import MerterNewIcon from 'assets/neo_icons/Equipments/energy_meter.svg?react';
import configParam from "config";
import Card from 'components/Core/KPICards/KpiCardsNDL';
import Edge from "./Edge";
import Meter from "./Meter";
import useLineConnectivity from "components/layouts/Line/hooks/useLineConnectivity";
import useMetricsInstrument from "components/layouts/Line/hooks/useMetricsInstrument";
import { useTranslation } from 'react-i18next';

export default function Connectivity(props) {
    const theme = useTheme();
    const classes ={
        root: {
          display: 'flex',
          flexDirection: 'row',
          padding: 0,
        //   marginLeft: '-16px',
        //   marginRight: '-16px',
          // height: 56,
          position:"fixed",
          width:"100%",
          zIndex:2,
          backgroundColor: theme.colorPalette.foreGround,
          borderBottom: '1px solid '+theme.colorPalette.divider
      
      },
      settingsItem: {
          color: theme.colorPalette.primary,
          padding: 16,
          borderBottom: theme.colorPalette.divider,
          display: "flex"
      },
      selectedSettingsItem: {
          borderBottom: "1px solid "+ theme.colorPalette.blue,
          color: theme.colorPalette.blue,
          padding: 16,
          display: "flex"
      }
       
      }
    const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0); 
  const [LoadPanel] = useRecoilState(Loadingpanel);
  const [, setHierTabValue] = useRecoilState(selHierIndex);
  const [edgeData,setEdgeData] = useRecoilState(showEdgeData);
  const [edgeStatus,setEdgeUpdateStatus] = useRecoilState(edgeUpdateStatus);
  const [meterStatus,setMeterUpdateStatus] = useRecoilState(MeterUpdateStatus);
  const [meterData,setMeterData] = useState([]); 
  const [edgOnlineCount,setEdgOnlineCount] = useState(0);
  const [edgofflineCount,setEdgOfflineCount] = useState(0);
  const [mtrOnlineCount,setMtrOnlineCount] = useState(0);
  const [MtrofflineCount,setMtrOfflineCount] = useState(0);
  const [,setFormattedMeter] = useRecoilState(showMeterData);
  const [InstrumentMet,setInstrumentMet] = useState([]);
  const { LineConnectivityLoading, LineConnectivityData, LineConnectivityError, getLineConnectivity } = useLineConnectivity() 
  const { MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentError, getMetricsInstrument } = useMetricsInstrument()
  
  const mainTheme = useTheme();

  useEffect(() => {
    if (!LineConnectivityLoading && !LineConnectivityError && LineConnectivityData) {
        if(LineConnectivityData.data){
            setEdgeData(LineConnectivityData.data.edge_data?LineConnectivityData.data.edge_data:[]);
            setMeterData(LineConnectivityData.data.meter_data?LineConnectivityData.data.meter_data:[]);
            setEdgeUpdateStatus(LineConnectivityData.data.edgeTime?LineConnectivityData.data.edgeTime:[]);
            setMeterUpdateStatus(LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[]);
        }else{
            setEdgeData([]);
            setMeterData([]);
            setEdgeUpdateStatus([]);
            setMeterUpdateStatus([]);
        }        
        props.refreshOff(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LineConnectivityLoading, LineConnectivityData, LineConnectivityLoading])

  useEffect(() => {
        if (!MetricsInstrumentLoading && !MetricsInstrumentError && MetricsInstrumentData) {
        setInstrumentMet(MetricsInstrumentData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentLoading])

  useEffect(()=>{
        getLineConnectivity({ schema: props.headPlant.schema,lineId :props.headPlant.id  })
        getMetricsInstrument()  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.headPlant,props.refresh]);

  useEffect(()=>{
    getCount(edgeData);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[edgeData]);
  useEffect(()=>{
    getMeterCount(meterData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[meterData]);
  const getMeterCount = (data) =>{
    let onLineData  = 0;
    let offlineLineData = 0 ;
    let meters = [];
    
    if(meterData.length >0){
        // eslint-disable-next-line array-callback-return
        meterData.forEach((val, index) => {
            let obj1 = {...val};
            let freq = InstrumentMet.filter(x=> x.instruments_id === val.id).map(x => x.frequency)
         
            if(meterStatus && meterStatus[val['id']]){
                let min = freq.length > 0 ? (configParam.MODE(freq) * 3) : 0
                let LA = new Date(meterStatus[val['id']])
                let CT = new Date()
                let diff = CT - LA
                let Status = diff < (Math.max(min, 3600) * 1000)
                if(!Status){
                    obj1['status'] = "Offline";
                    offlineLineData +=1; 
                }else{
                    obj1['status'] = "Online";
                    onLineData +=1; 
                }
            }
            meters.push(obj1);
        });
    } 
    setFormattedMeter(meters);
    setMtrOnlineCount(onLineData);
    setMtrOfflineCount(offlineLineData);
  }
const getCount =(data) =>{
    let onLineData  = 0;
    let offlineLineData = 0 ;
    // eslint-disable-next-line array-callback-return
    edgeData.map((val, index) => {
        if(edgeStatus && edgeStatus[val['name']]){
            if(parseInt(moment.duration(moment(moment()).diff(edgeStatus[val['name']])).asMinutes())>60){
                offlineLineData +=1; 
            }else{
                onLineData +=1; 
               
            }

        }
       
    });
    setEdgOnlineCount(onLineData);
    setEdgOfflineCount(offlineLineData);

};
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setHierTabValue(-1)
    
};
    
    
      const menuData = [
        {
            iconLight: <GatewayIconDark stroke={mainTheme.colorPalette.primary}/>,
            iconDark: <GatewayIconDark stroke={mainTheme.colorPalette.primary}/>,
            selected: <GatewayIconDark stroke={mainTheme.colorPalette.primary}/>,
            title: <Typography style={{ fontSize: "16px", fontWeight: "500", lineHeight: "24px",color:"#101010" }} value={ <React.Fragment>
                <span style={{ display:"flex" }}>
                {t("Gateway")} &nbsp;&nbsp;&nbsp;<span >(<font  color="green" style={{ fontSize: "14px", fontWeight: "500", lineHeight: "24px" }}>{t("Online -")} {edgOnlineCount}</font></span>,&nbsp;&nbsp;<span><font color="red" style={{ fontSize: "14px", fontWeight: "500", lineHeight: "24px" }}>{t("Offline -")} {edgofflineCount}</font>)</span> 
                </span> </React.Fragment>} />,
            subtitle: <Typography style={{ fontSize: "8px", fontWeight: "500"}} value={t('MetaData')}></Typography>,
            content: <Edge />
        },
        {
            iconLight: <MerterNewIcon stroke={mainTheme.colorPalette.primary}/>,
            iconDark: <MerterNewIcon stroke={mainTheme.colorPalette.primary}/>,
            selected: <MerterNewIcon stroke={mainTheme.colorPalette.primary}/>,
            title: <Typography style={{ fontSize: "16px", fontWeight: "500", lineHeight: "24px",color:"#101010" }} value={ <React.Fragment> 
                <span  style={{ display:"flex" }}>
                {t("Meter")} &nbsp;&nbsp;&nbsp;<span>(<font color="green" style={{ fontSize: "14px", fontWeight: "500", lineHeight: "24px" }}>{t("Online -")} {mtrOnlineCount}</font></span>,&nbsp;&nbsp;<span> <font color="red" style={{ fontSize: "14px", fontWeight: "500", lineHeight: "24px" }}>{t("Offline -")} {MtrofflineCount}</font>)</span>
                </span>  </React.Fragment>} />,
            subtitle: <Typography style={{ fontSize: "8px", fontWeight: "500"}} value={t('ConfigInstruments')}></Typography>,
            content: <Meter />
        }]
   return (
  <React.Fragment>
 
      {LoadPanel ? <LoadingScreenNDL/>
            :
            <React.Fragment>
            <ul style={classes.root}>
                                
                {menuData.map((data, index) => {
                    return (
                        <li key={index} button style={tabValue === index ? classes.selectedSettingsItem : classes.settingsItem} onClick={(event) => handleChange(event, index)}>
                            <div style={{ minWidth: 30 }}>
                                {tabValue === index ?
                                        data.selected
                                    :
                                    
                                        data.iconLight
                                }
                            </div>
                            <Typography value={data.title}/>
                        </li>);
                })}
            </ul>
            <Card elevation={0} style={{borderTop:'1px solid'+theme.colorPalette.divider,marginTop:"56px"}}>
                <div style={{padding: 5}}>
                    <Grid container spacing={1} >
                        <Grid item xs={12} style={{ paddingTop: 0 }}>
                            
                            <div style={{marginTop:"65px"}} >
                            {menuData[tabValue].content} 
                            
                            </div>
                            
                        </Grid>
                    </Grid>
                </div>
            </Card>
            </React.Fragment>
    }
     

  </React.Fragment>
 
   );
}