import React, { useEffect, useRef, useState ,forwardRef,useImperativeHandle} from "react";
import Grid from 'components/Core/GridNDL'
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import GateWayTab from "./tabs/GateWayTab";
import Button from "components/Core/ButtonNDL";
import Mqtt from "../components/GateWaySubComponent/Mqtt";
import Protocol from "../components/GateWaySubComponent/Protocol";
import Instrument from "../components/GateWaySubComponent/Instrument";
import MqttModel from "./GateWaySubComponent/components/mqttModel/MqttModel";
import RTU from "./GateWaySubComponent/RTU";
import TCP from "./GateWaySubComponent/TCP";
import useGetMQttConfiguration from "./GateWaySubComponent/components/mqtthooks/useGetMqttData";
import usePartsMetricsData from "components/layouts/Reports/SteelProduction/hooks/usePartsMetricsData.jsx"
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import moment from "moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import TypographyNDL from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import useGetLengthOfConnection from '../hooks/useGetLengthOfConnection'



// Register the necessary chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);



const  GatewayPage=forwardRef((props,ref)=>{
    const [tabValue, setTabValue] = useState(0);
    const MqttRef = useRef()
    const [headPlant] = useRecoilState(selectedPlant);

    const {MQttConfigurationLoading, MQttConfigurationData, MQttConfigurationError, getMQttConfiguration} = useGetMQttConfiguration()
    const {partMetricsDataLoading, partMetricsData, partMetricsDataError, getPartMetricsData} = usePartsMetricsData()
    const {LengthOfConnLoading, LengthOfConnData, LengthOfConnError, getLengthOfConn} = useGetLengthOfConnection()
    const [mqttDetails,setmqttDetails] = useState([])
    const [chartData,setChartData] = useState({})
    const [chart1Data,setchart1Data] = useState({data:{},option:{}})
    const [chart2Data,setchart2Data] = useState({data:{},option:{}})
    const [connectionLength,setconnectionLength] = useState([])


 useImperativeHandle((ref),()=>({
        triggerMqtt : ()=>MqttConfiguration()
    }))
    
    const MenuList = [
        {
            title: 'MQTT',
            content:<Mqtt mqttDetails ={mqttDetails} MQttConfigurationLoading={MQttConfigurationLoading} />
        },
        {
            title: 'Protocol',
            content: <Protocol connectionLength={connectionLength}  path={props.GateWayPath} setisProtocolpage={props.setisProtocolpage}   setpage={props.setpage} setprotocolName={props.setprotocolName} handleActiveIndex={props.handleActiveIndex} />
        },
        {
            title: 'Instrument',
            content: <Instrument SelectedgateWayData={props.SelectedgateWayData}  path={props.GateWayPath} GateWayInstrument={props.GateWayInstrument} GateWayId={props.GateWayId}  />
        }
        ,
        
    ];

    const MenuTabList= [
        {
            title: 'MQTT',
        },
        {
            title: 'Protocol',
        },
        {
            title: 'Instrument',
        }
        ,
    ]

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEditDialog =()=>{
        setTimeout(()=>{
            MqttRef.current.handleGatewayDialogAdd()

        },200)
    }



    
    useEffect(()=>{
        getMQttConfiguration({path:props.GateWayPath,port:":5000/",endurl:"mqtt"})
        getLengthOfConn({path:props.GateWayPath,connection:["rtu","tcp"]})
    },[props.GateWayPath])

    useEffect(()=>{
      if(!LengthOfConnLoading &&  LengthOfConnData &&  !LengthOfConnError){
        console.log(LengthOfConnData,"LengthOfConnData")
        if(LengthOfConnData && LengthOfConnData.data && LengthOfConnData.data.length > 0 ){
          setconnectionLength(LengthOfConnData.data)

        }

      }
    },[LengthOfConnLoading, LengthOfConnData, LengthOfConnError])

    useEffect(()=>{
        getPartMetricsData(headPlant.schema,[props.GateWayInstrumentID],['cpu_load',"cpu_temperature"],moment(new Date()).startOf('day').format("YYYY-MM-DDT00:00:00Z"),moment( ).format("YYYY-MM-DDTHH:mm:ssZ"))
    },[headPlant])

    useEffect(()=>{
        if(!partMetricsDataLoading &&  partMetricsData && !partMetricsDataError){
            if(partMetricsData.data && partMetricsData.data.length > 0){
                const separated = partMetricsData.data.reduce((acc, item) => {
                    const key = item.key; // Use the key you want to separate by
                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push(item);
                    return acc;
                  }, {});
                  setChartData(separated)
            }
         

        }
        
    },[partMetricsDataLoading, partMetricsData, partMetricsDataError])

    useEffect(()=>{
        if(Object.keys(chartData).length > 0){
            const CpuLoad =chartData.cpu_load 
            const CpuUtilization =chartData.cpu_temperature 

            const data = {
                labels: CpuLoad.map(x=>moment(x.time).format("HH:mm")), // X-axis labels
                datasets: [
                  {
                    label:"CPU Load" ,
                    data: CpuLoad.map(x=>x.value), // Data points
                    borderColor: "#29A383", // Line color
                    backgroundColor: "#29A383", // Fill color (if applicable)
                    tension: 0.4, // Smoothness of the line
                  },
              
                  
                ],
              };

              const data2 = {
                labels: CpuUtilization.map(x=>moment(x.time).format("HH:mm")), // X-axis labels
                datasets: [
                  {
                    label:"CPU Temperature" ,
                    data: CpuLoad.map(x=>x.value), // Data points
                    borderColor: "#0090FF", // Line color
                    backgroundColor: "#0090FF", // Fill color (if applicable)
                    tension: 0.4, // Smoothness of the line
                  },
              
                  
                ],
              };

            
              const options = {
                responsive: true,
  maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom", // Position of the legend
                  },
                  datalabels: {
                    display: false, // Disable value labels on data points
                  },
                  tooltip: {
                    enabled: true, // Enable tooltips
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "Values", // Label for Y-axis
                    },
                  },
                },
              };

              setchart1Data({data:data,option:options})
              setchart2Data({data:data2,option:options})
        }

    },[chartData])

    useEffect(()=>{
        if(!MQttConfigurationLoading && MQttConfigurationData  && !MQttConfigurationError){
            setmqttDetails(MQttConfigurationData)
        }

    },[MQttConfigurationLoading, MQttConfigurationData, MQttConfigurationError])

    const MqttConfiguration =()=>{
        getMQttConfiguration({path:props.GateWayPath,port:":5000/",endurl:"mqtt"})
    }


    
    return (
        <React.Fragment>
               {
                    props.page === 'GateWay' ?
        <React.Fragment>
<div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ">
             <Grid container spacing={4}>
                 <Grid xs={6} >
                     <KpiCards style={{ height: "350px" }}>
                        <TypographyNDL value='CPU Utilization & Load' color='secondary' variant='heading-01-xs' />
                     <div className="py-2">

                        <HorizontalLine variant="divider1" />
                        </div>
                        {
                            Object.keys(chart1Data.data).length > 0  ? 
                            <div className="w-full h-[292px] relative">
                       <Line data={chart1Data.data} options={chart1Data.option} />
                            </div>
                     : 
                     <div className="flex items-center justify-center h-[300px]">
                     <TypographyNDL value="No Data" variant='label-01-s'   />
                    </div>

                        }
                     </KpiCards>

                 </Grid>
                 <Grid xs={6} >
                     <KpiCards style={{ height: "350px" }}>
                     <TypographyNDL value='CPU Health & Performance' variant='heading-01-xs'  color='secondary' />
                     <div className="py-2">
                     <HorizontalLine variant="divider1" />
                     </div>
                     {
                            Object.keys(chart2Data.data).length > 0  ? 
                            <div className="w-full h-[292px] relative">
                     <Line data={chart2Data.data} options={chart2Data.option} />
                     </div>
                     : 
                     <div className="flex items-center justify-center h-[300px]">
                      <TypographyNDL value="No Data" variant='label-01-s'   />
                     </div>

                        }
                     </KpiCards>

                 </Grid>


             </Grid>
         </div>
         <div className="flex items-center justify-between  gap-4 border border-t border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50 w-full">
          <div className="w-1/2">
          <GateWayTab MenuTabs={MenuTabList} currentTab={tabValue} tabChange={handleChange}/>
          </div>
         {
            tabValue === 0 && 
          <div className="w-1/2 flex justify-end">
         <Button type="ghost" value={'Edit'} style={{marginRight:"16px"}} onClick={handleEditDialog} />
         </div>
         }

         </div>

         <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
             {MenuList[tabValue].content} 
         </div>
        </React.Fragment>
                    :
                    <React.Fragment  >
                       {
                        props.page === 'RTU' ? 
                        <RTU path={props.GateWayPath} RTUStatus={props.RTUStatus}  />
                        :
                        <TCP path={props.GateWayPath} TCPStatus={props.TCPStatus}  />
                       }

                    </React.Fragment>

                }
<MqttModel  ref={MqttRef} mqttDetails ={mqttDetails} path={props.GateWayPath} MqttConfiguration={MqttConfiguration} />
        </React.Fragment>
    )

})

export default GatewayPage