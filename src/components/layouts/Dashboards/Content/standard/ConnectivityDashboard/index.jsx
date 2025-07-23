/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState,useRef } from "react";
import {  useRecoilState } from "recoil";
import configParam from "config";
import GateWay from "./components/gateWay";
import Instrument from "./components/instrument";
import useLineConnectivity from "components/layouts/Line/hooks/useLineConnectivity";
import Accordion from "components/Core/Accordian/AccordianNDL1";
import {
    
    selectedPlant,
    ConnectivityLoading
   
} from "recoilStore/atoms";
import useMetricsInstrument from "components/layouts/Line/hooks/useMetricsInstrument";
import useGateWay from "components/layouts/Settings/Gateway/hooks/useGetGateWay";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import useInstrumentCategory from "Hooks/useInstrumentCategory";

function ConnectivityDashboardCards() {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [MeterDat,setMeterData]=useState([])//NOSONAR
    const [edgeUpdateStatus,setEdgeUpdateStatus]=useState([])
    const [meterStatus,setMeterUpdateStatus]=useState([])//NOSONAR
    const [InstrumentMet,setInstrumentMet] = useState([]);
    const [FormattedMeter,setFormattedMeter] =useState([]);
    const [FormattedMeterInstrument,setFormattedMeterInstrument] =useState([]);
    const [formatedEdge,setFormatedEdge] = useState([]);
    const [mtrOnlineCount,setMtrOnlineCount] = useState(0);
    const [MtrofflineCount,setMtrOfflineCount] = useState(0);//NOSONAR
    const [mtrOnlineCountInstrument,setMtrOnlineCountInstrument] = useState(0);//NOSONAR
    const [MtrofflineCountInstrument,setMtrOfflineCountInstrument] = useState(0);//NOSONAR
    const [edgOnlineCount,setEdgOnlineCount] = useState(0);
    const [edgofflineCount,setEdgOfflineCount] = useState(0);//NOSONAR
    const [GateWayList,setGateWayList] = useState([])
    const { MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentError, getMetricsInstrument } = useMetricsInstrument()
    const { LineConnectivityLoading, LineConnectivityData, LineConnectivityError, getLineConnectivity } = useLineConnectivity() 
    const { GateWayLoading, GateWayData, GateWayError, getGateWay } = useGateWay()
    const [Instrumentopens] = useState(true);
    const [Gateopens] = useState(true);
    const [loading,setLoading] =useRecoilState(ConnectivityLoading)
    const [page,setPage] =useState("parent")
    const [GatewayName,setGatewayName] = useState('')
    const [GatewayInstruments,setGatewayInstruments] = useState([])
    const [selectedCategoryType, setSelectedCategoryType] = useState([]);
    const [selectedGatewayCategoryType, setSelectedGatewayCategoryType] = useState([]);
    const [instrumentCategoryList, setInstrumentCategoryList] = useState([]);
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
   
    function useInterval(callback, delay) {
        const savedCallback = useRef();
    
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
    
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
      }

    useEffect(()=>{
        getInstrumentCategory()
        getLineConnectivity({schema: headPlant.schema,lineId :headPlant.id })
        getMetricsInstrument()
        getGateWay(headPlant.id)
    },[headPlant])
    

    useInterval(() => {
        if(page !== "child"){
            getLineConnectivity({schema: headPlant.schema,lineId :headPlant.id })

        }
      }, 60000);

      useEffect(() => {
        if (!InstrumentCategoryListLoading && InstrumentCategoryListData && !InstrumentCategoryListError) {
          if (InstrumentCategoryListData.length > 0) {
            setInstrumentCategoryList(InstrumentCategoryListData)
            setSelectedCategoryType(InstrumentCategoryListData)
            setSelectedGatewayCategoryType(InstrumentCategoryListData)
          }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [InstrumentCategoryListData])

    useEffect(() => {
        if (!LineConnectivityLoading && !LineConnectivityError && LineConnectivityData) {
            if(LineConnectivityData.data){
                setLoading(true)
                setMeterData(LineConnectivityData.data.meter_data?LineConnectivityData.data.meter_data:[]);
                setEdgeUpdateStatus(LineConnectivityData.data && LineConnectivityData.data.edgeTime?LineConnectivityData.data.edgeTime:{});
                setMeterUpdateStatus(LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[]);
            }else{
                setLoading(false)
                setMeterData([]);
                setEdgeUpdateStatus([]);
                setMeterUpdateStatus([]);
            }        
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [LineConnectivityLoading, LineConnectivityData, LineConnectivityLoading])

    useEffect(()=>{
        let categoryIds = selectedCategoryType.map((x) => x.id)
        let filteredMeterDat = MeterDat.filter((x) => categoryIds.includes(x.category))
        if(InstrumentMet.length){
          getMeterCount(filteredMeterDat);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[MeterDat, selectedCategoryType,InstrumentMet]);

      useEffect(()=>{
        if(!GateWayLoading && GateWayData && !GateWayError){
            setGateWayList(GateWayData)
            
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps

    },[GateWayLoading ,GateWayData ,GateWayError])

      useEffect(()=>{
        if(GateWayList && edgeUpdateStatus){
            getCount(GateWayList)

        }
      // eslint-disable-next-line react-hooks/exhaustive-deps

      },[GateWayList,edgeUpdateStatus])

    
    useEffect(() => {
        if (!MetricsInstrumentLoading && !MetricsInstrumentError && MetricsInstrumentData) {
          // console.log(MetricsInstrumentData,"MetricsInstrumentData")
        setInstrumentMet(MetricsInstrumentData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentLoading])
    
    const processMeterData = (val,meterStat,meters,onLineData,offlineLineData) => {
        let obj1 = { ...val };
        let freq = InstrumentMet.filter(x => x.instruments_id === val.id).map(x => x.frequency);

        if (meterStat && meterStat[val['id']]) {
          
            let min = freq.length > 0 ? (configParam.MODE(freq) * 3) : 0;
            let LastAct = moment(meterStat[val['id']]).format("YYYY-MM-DDTHH:mm:ss")
            let diff = moment().diff(moment(LastAct), 'seconds');
     
            if (diff > min) {
                obj1['status'] = "Inactive";
                offlineLineData += 1;
            } else {
                obj1['status'] = "Active";
                onLineData += 1;
            }
            obj1["LastActive"] = moment(meterStat[val['id']]).format('DD/MM/YYYY HH:mm:ss a');
        }
    
        meters.push(obj1);
        return { onLineData, offlineLineData };
    };

    const getMeterCount = (data) =>{
        setLoading(true)

        let onLineData  = 0;
        let offlineLineData = 0 ;
        let meters = [];
        if(data.length >0){
            // eslint-disable-next-line array-callback-return
            data.map((val, index) => {
           const result =  processMeterData(val,meterStatus,meters,onLineData,offlineLineData)
           onLineData = result.onLineData;
           offlineLineData = result.offlineLineData;
            })
        } 

        console.log(onLineData,"onLineData",offlineLineData)
        setFormattedMeter(meters.filter(x=>"LastActive" && "status" in x))//NOSONAR
        setMtrOnlineCount(onLineData)
        setMtrOfflineCount(offlineLineData)
      }
      const getCount =(data) =>{
        setLoading(true)

        let onLineData  = 0
        let offlineLineData = 0 
        let gateWay = []
        // eslint-disable-next-line array-callback-return
       

        if(GateWayList.length > 0 ){
         
            GateWayList.forEach((val)=>{
                let onMeterData  = 0
                let offlineMeterData = 0 
                let obj1 ={...val}
                if(edgeUpdateStatus && edgeUpdateStatus[val.iid]){
                    if(parseInt(moment.duration(moment(moment()).diff(edgeUpdateStatus[val.iid])).asMinutes())> 15 ){
                        offlineLineData +=1 
                        obj1['status'] = "Inactive"
                        
                    }else{
                        onLineData +=1 
                        obj1['status'] = "Active"
                    }
                  
    
                    obj1["LastActive"] = moment(edgeUpdateStatus[val.iid]).format('DD/MM/YYYY HH:mm:ss a') 
        
                }
              
                if(val.instrument_id && val.instrument_id.length > 0){
              
                    val.instrument_id.map((valt, index) => {
                        
                        let freq = InstrumentMet.filter(x=> x.instruments_id === valt.id).map(x => x.frequency)
                      
                        if(meterStatus && meterStatus[valt['id']]){
                  
                            let LA = new Date(meterStatus[valt['id']])
                            let CT = new Date()
                            let diff = CT - LA
                            let Status =(diff/1000) < (configParam.MODE(freq) * 3)
                          
                            if(!Status){
                                offlineMeterData +=1 
                            }else{
                                onMeterData +=1
                            }
                            
                        }
                    })
                    obj1["Active"] = onMeterData
                    obj1['Inactive'] = offlineMeterData
                }
               
                gateWay.push(obj1)
            })

        } 
        
        setFormatedEdge(gateWay.filter(x=>"LastActive" in x))
        setEdgOnlineCount(onLineData)
        setEdgOfflineCount(offlineLineData)

    
    }

    
    const getMeterCountForInstrument = (data) =>{
        setLoading(true)

        let onLineData  = 0
        let offlineLineData = 0 
        let meters = []
        if(data.length >0){
            // eslint-disable-next-line array-callback-return
            data.map((val, index) => {
                const result =  processMeterData(val,meterStatus,meters,onLineData,offlineLineData)
                onLineData = result.onLineData;
                offlineLineData = result.offlineLineData;
            })
        } 

      
        setFormattedMeterInstrument(meters.filter(x=>"LastActive" && "status" in x));//NOSONAR
        setMtrOnlineCountInstrument(onLineData)
        setMtrOfflineCountInstrument(offlineLineData)
      }
  
     const edgeMapedInstrument = (value)=> {
        setPage("child") 
        setGatewayName(value.name)
        setSelectedGatewayCategoryType(instrumentCategoryList)
        setGatewayInstruments(value.instrument_id)
        //getMeterCountForInstrument(value.instrument_id)

        
     }

     useEffect(()=>{
      
        let categoryIds = selectedGatewayCategoryType.map((x) => x.id)
        let filteredMeterData = GatewayInstruments.filter((x) => categoryIds.includes(x.category))
        getMeterCountForInstrument(filteredMeterData)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[GatewayInstruments, selectedGatewayCategoryType]);

     const handleActiveIndex = (index) => {
        if(index === "child"){
            setPage('parent')
        }
        
      };

      
    return (

          <div className="p-4">
          {
                page === "child" ? 
                
                <Instrument MeterDat={MeterDat} handleActiveIndex={handleActiveIndex} GatewayName={GatewayName} page={page} MeterUpdateStatus={meterStatus} FormattedMeter={FormattedMeterInstrument} mtrOnlineCount={mtrOnlineCountInstrument} MtrofflineCount={MtrofflineCountInstrument} LineConnectivityLoading={LineConnectivityLoading} loading={loading} instrumentCategoryList={instrumentCategoryList} selectedGatewayCategoryType={selectedGatewayCategoryType} getselectedGatewayCategoryType={(SelectedGatewayCategoryType) => setSelectedGatewayCategoryType(SelectedGatewayCategoryType)}/>

                :
                <React.Fragment>
                <Accordion noborder title={t('Gateways')}  isexpanded={Gateopens}>

                <GateWay formatedEdge={formatedEdge} edgeOnlineCount={edgOnlineCount} edgeofflineCount={edgofflineCount} edgeMapedInstrument={edgeMapedInstrument} />
                </Accordion>
               
                <Accordion noborder title={t('Instrument')} isexpanded={Instrumentopens}>
    
                <Instrument MeterDat={MeterDat}  MeterUpdateStatus={meterStatus} FormattedMeter={FormattedMeter} mtrOnlineCount={mtrOnlineCount} MtrofflineCount={MtrofflineCount} LineConnectivityLoading={LineConnectivityLoading} loading={loading} instrumentCategoryList={instrumentCategoryList} selectedCategoryType={selectedCategoryType} getselectedCategoryType={(SelectedCategoryType) => setSelectedCategoryType(SelectedCategoryType)}/>
           </Accordion>
           </React.Fragment>
            }
          </div>
           
          
    

    )
}

export default ConnectivityDashboardCards;
