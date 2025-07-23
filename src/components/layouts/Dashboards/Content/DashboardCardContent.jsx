import React,{useState,useEffect,forwardRef,useImperativeHandle,useRef} from 'react';
import moment from 'moment';
import { Duplicatecopy, selectedPlant, playOption,dashBtnGrp,ProgressLoad,customdates,instrumentsArry,currentDashboard,dashboardEditMode, goLiveData, microStopDuration } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import useFetchDashboardData from '../hooks/useFetchDashboardData';
import ChartBlock from './ChartBlock';
import configParam,{refesh_neo_token} from 'config';
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx"; 
import useEnergyDay from 'components/layouts/Dashboards/Content/standard/EnergyDashboard/hooks/usegetEnergyDay';
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import useRealInstrumentList from "components/layouts/Settings/Instrument/Hooks/useRealInstrumentList";
import useGetVirtulInstrumentDashboardData from '../hooks/useGetVirtualInstrumentDashboardData';
import useGetMultipleVirtulInstrumentDashboardData from '../hooks/useGetMultipleVirtualDashboardData'
import useFetchMultiMetricDashboardData from '../hooks/useFetchMultiMetricDashboard';


import useGetDownTime from '../../Reports/DowntimeReport/hooks/useGetDownTime';
import useAssetOEE from "../../Reports/DowntimeReport/hooks/useAssetOEE";
import usePartsProduced from 'Hooks/usePartsProduced';
import useQualitydata from "../../Reports/QualityReport/hooks/useQualitydata";


import { socket } from 'components/socket'; 

const CardContent = forwardRef(({children,...props},ref)=>{
    const [headPlant] = useRecoilState(selectedPlant);
    const {  realInstrumentListData, getRealInstrumentList } = useRealInstrumentList()
    const [,setProgressBar] = useRecoilState(ProgressLoad);
    const [playalue,setPlayMode]  = useRecoilState(playOption); 
    const [duplicate] = useRecoilState(Duplicatecopy);
    const [editMode] = useRecoilState(dashboardEditMode);
    const [btGroupValue] = useRecoilState(dashBtnGrp);     
    const [customDates]=useRecoilState(customdates);
   
    const [live, setLive] = useRecoilState(goLiveData)
    const [showMicroStop,] = useRecoilState(microStopDuration);

    let socketRooms = [] 
    let iidRooms = []
    
    const [existData,setExistData] = useState([]);
    const [viData,setVIData] = useState([])
    const [marker,setMarker] = useState([]); 

    const [forPareto, setForPareto] = useState(true)
  
    const [instrumentList] = useRecoilState(instrumentsArry);
    const [selectedDashboard] = useRecoilState(currentDashboard);
    const {  fetchDashboardLoading, fetchDashboardData, fetchDashboardError, getfetchDashboard } = useFetchDashboardData();  
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay(); 

    const { VIDashboardDataLoading, VIDashboardData, VIDashboardError, getVIDashboardData} = useGetVirtulInstrumentDashboardData();
    const { MultiVIDashboardDataLoading, MultiVIDashboardData, MultiVIDashboardError, getMultiVIDashboardData } = useGetMultipleVirtulInstrumentDashboardData()

    const { fetchMultiMetricDashboardLoading, fetchMultiMetricDashboardData, fetchMultiMetricDashboardError, getfetchMultiMetricDashboard } = useFetchMultiMetricDashboardData()
   

    const { downTimeLoading, downTimeData, downTimeError, getDownTime } = useGetDownTime();
    const {  AssetOEEConfigsofEntityData, getAssetOEEConfigsofEntity } = useAssetOEE();
    const {  partData, getPartsCompleted } = usePartsProduced();
    const {  outQualityData,  getdowntimedata } = useQualitydata();

    let custome_dashboard_data = existData

    useEffect(()=>{
        getAssetOEEConfigsofEntity(props.detail.meta.asset)
    }, [])

    useEffect(() => {
        if(props.detail.type === 'pareto') {
        const detail =  props.detail;
            let  startrange = moment(customDates.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let  endrange = moment(customDates.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let  range = changeCurrentDate(detail.meta  && detail.meta.selectedRange ? detail.meta.selectedRange : 1)
            if(selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker'){
                if(props.detail.meta.isDowntime){
                    getPartsCompleted(headPlant.schema, AssetOEEConfigsofEntityData, startrange, endrange, '', [], [])
                } else {
                    getdowntimedata(props.detail.meta.asset, startrange, endrange)
                }
            }else{
                if(props.detail.meta.isDowntime){
                    getPartsCompleted(headPlant.schema, AssetOEEConfigsofEntityData, range[0], range[1], '', [], [])
                } else {
                    getdowntimedata(props.detail.meta.asset, range[0], range[1])
                }
            }
           

        }
    }, [AssetOEEConfigsofEntityData, forPareto, customDates, duplicate])

    useEffect(() => {
        if(props.detail.type === 'pareto' && props.detail.meta.isDowntime && AssetOEEConfigsofEntityData && partData){
        const detail =  props.detail;

            let  startrange = moment(new Date(customDates.StartDate)).format("YYYY-MM-DDTHH:mm:ssZ")
            let  endrange = moment(new Date(customDates.EndDate)).format("YYYY-MM-DDTHH:mm:ssZ")
            let  range = changeCurrentDate(detail.meta  && detail.meta.selectedRange ? detail.meta.selectedRange : 1)

            if(selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker'){
                getDownTime(headPlant.schema, AssetOEEConfigsofEntityData, { startDate:startrange, endDate:endrange }, showMicroStop, 0, 4000, '', partData)
            }else{
                getDownTime(headPlant.schema, AssetOEEConfigsofEntityData, { startDate:range[0], endDate:range[1] }, showMicroStop, 0, 4000, '', partData)

            }
        }
    }, [AssetOEEConfigsofEntityData, forPareto, customDates, duplicate, partData])

    useEffect(()=>{
   
        setExistData([])
        refesh_neo_token("", (token) => {
            // //console.log("INSISISISISISI__________________")
            socket.auth = { 'token': token }
            localStorage.setItem('neoToken', token)
        })
        getRealInstrumentList(headPlant.id)
        // //console.log("USE EFFECR")
        setProgressBar(false)
        if(!socket.connected){
            // //console.log("--ELSES--", localStorage.getItem('neoToken').trim())
            socket.open()
            socket.connect()
            // props.endrefresh()
        }
        props?.startRefresh()
        if(!live){
            if(selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker'){
            
                fetchData(props.detail,props.typelist, true)
            }else{
            fetchWidgetWisedata(props.detail,props.typelist, true)
            }
        }
        // initialJoinRoom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[customDates,props.typelist,props.detail])

    useEffect(() => {
        // //console.log("FFFSKSLKSLAKSL")
        if(live){
            getRealInstrumentList(headPlant.id)
          
            refesh_neo_token("", (token) => {
                socket.auth = { 'token': token }
                socket.open()
                // //console.log("Z - INITIAL JOIN")
                // socket.disconnect()
                initialJoinRoom()
                custome_dashboard_data = []
            })
            
        } else {
            setPlayMode(false)
            if(socket.connected){
                socket.close()
                socket.disconnect()
            }
            custome_dashboard_data = []
            localStorage.removeItem('rooms')
        }
        if(selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker'){
            fetchData(props.detail,props.typelist)
            }else{
            fetchWidgetWisedata(props.detail,props.typelist)
            }
    }, [live,selectedDashboard,customDates])
    
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

 

    let CustomDuration = selectedDashboard[0] && selectedDashboard[0].dashboard && "interval" in selectedDashboard[0].dashboard && selectedDashboard[0].dashboard.interval && "isCustomInterval" in selectedDashboard[0].dashboard && selectedDashboard[0].dashboard.isCustomInterval ? selectedDashboard[0].dashboard.interval * 1000 : 60000;
    useInterval(() => {
         if(!props.modalOpen){
           console.log('enter22')

            if(selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker'){         
           console.log('enter224')
             
                fetchData(props.detail,props.typelist,true) 
        }else{
            fetchWidgetWisedata(props.detail,props.typelist,true,true)
        }
        }
        
      }, playalue ? CustomDuration : null);

      useEffect(() => {
        if(props.modalOpen){
             if(selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker'){
                console.log('enter22')
                fetchData(props.detail,props.typelist,true) 
        }else{
            fetchWidgetWisedata(props.detail,props.typelist,true)
        }
        }
      },[props.modalOpen])

      useEffect(()=>{
        if(!fetchDashboardError && !fetchDashboardLoading && fetchDashboardData){ 
            props?.endrefresh(false)
            let fetcharray=[...fetchDashboardData]
            //console.log(fetcharray,'fetcharray')
            const uniquefetcharray = fetcharray.filter((obj, index) => { // Filter Unique metrics
                return index === fetcharray.findIndex(o => obj.time === o.time && obj.iid === o.iid && obj.value === o.value && obj.key === o.key && obj.instrument === o.instrument && obj.name === o.name);
            });
            //console.log(uniquefetcharray,'uniquefetcharray')
                if((props.detail.type !== 'singleText' && playalue)){
  
                    console.log("uniquefetcharray", uniquefetcharray)
                        setExistData(uniquefetcharray);
                  }else{
                 
                        // console.clear()
                        console.log("fetchDashboardData", fetchDashboardData)
                        setExistData(fetchDashboardData?fetchDashboardData:[]);  
                    // }
                 }
            
        }
        if(fetchDashboardError && !fetchDashboardLoading){
            props?.endrefresh(false)
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fetchDashboardLoading, fetchDashboardData, fetchDashboardError])

    //console.log(existData,"existData")

    useEffect(() => {
        if(!fetchMultiMetricDashboardError && !fetchMultiMetricDashboardLoading && fetchMultiMetricDashboardData){
            props?.endrefresh(false)
            if(props.detail.type === 'pie'){
       
                let res = fetchMultiMetricDashboardData?.[0].map((x) => {
                    let instrument = instrumentList.filter((ins) => ins.id === x.iid )?.[0]
                    let unit = instrument?.instruments_metrics?.filter((met) => met.metric.name === x.key)?.[0]?.metric?.title
                    console.log("INSTRUMENT", unit)
                    return {
                        time: x.time,
                        iid: x.iid,
                        key: x.key,
                        name: unit,
                        value: x.value,
                        instrument: unit
                        // instrument: `${instrument?.name} - ${unit}`,
                    }
                })
                // console.clear()
                console.log("fetchMultiMetricDashboardData", res, fetchMultiMetricDashboardData[0])
                setExistData(fetchMultiMetricDashboardData? res :[]);  
            }
            else {
            
                let res = fetchMultiMetricDashboardData?.[0].map((x) => {
                    let instrument = instrumentList.filter((ins) => ins.id === x.iid )?.[0]
                    let unit = instrument?.instruments_metrics?.filter((met) => met.metric.name === x.key)?.[0]?.metric?.title
                    console.log("INSTRUMENT", unit)
                    return {
                        time: x.time,
                        iid: x.iid,
                        key: x.key,
                        value: x.value,
                        instrument: unit
                        // instrument: `${instrument?.name} - ${unit}`,
                    }
                })
                // console.clear()
                console.log("fetchMultiMetricDashboardData", res, fetchMultiMetricDashboardData[0])
                setExistData(fetchMultiMetricDashboardData? res :[]);  
            }
        }
        if(fetchMultiMetricDashboardError && !fetchMultiMetricDashboardLoading){
            props?.endrefresh(false)
        }
    }, [fetchMultiMetricDashboardError, fetchMultiMetricDashboardData, fetchMultiMetricDashboardLoading])

    useEffect(() => {
        if(!downTimeLoading && downTimeData && !downTimeError){
            downTimeData.length > 0 && props?.endrefresh(false)
            setExistData(downTimeData)
        } else {
            // props?.endrefresh(false)
        }
    }, [downTimeLoading, downTimeData, downTimeError])

    useEffect(() => {
   
    }, [outQualityData])
    
    
    useImperativeHandle(ref,()=>({
        refreshData: (data)=>props.detail.type === 'pareto' ? setForPareto(!forPareto) : (selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type !== 'widgetpicker' ? fetchData(data,props.typelist,true): fetchWidgetWisedata(data,props.typelist,true)) ,
        setMarker: (data)=>setMarker(data),
        goLive: ()=>setLive(!live),
        liveState: live
    }))

    useEffect(()=>{
        setPlayMode(false)
     
    },[btGroupValue]) 



    const reconnect = (token) => {
        socket.auth = { token };
    
        if (!socket.connected) {
            socket.open();
            socket.connect();
            props.endrefresh();
        }
    
        let headPlant = localStorage.getItem("headPlant");
        const rooms = [...new Set(localStorage?.getItem("rooms")?.trim()?.split(","))];
    
        rooms.forEach((x, index) => {
            socket.emit("join_room", `${headPlant}/data/${x}`, (response) => {
                console.log("Server acknowledged the message:", response);
            });
        });
    
        return; //NOSONAR
    };
    

    const initialJoinRoom = () => {
        // For Custom Dashoard - socket Connection
        try{
        if(selectedDashboard[0].custome_dashboard === true){
            
            // console.clear()
            console.log("JOIN ROOM - Connected -",socket.connected, props.detail)
            let roomsdata =  []
            localStorage.getItem('rooms') && roomsdata.push(localStorage.getItem('rooms'))
            let data = []
            let iid = []
            localStorage.setItem('headPlant', headPlant?.schema)
            if(typeof(props.detail?.meta?.metric) === 'object'){
                console.log("OBJECT", props.detail.meta)
                if(props.detail.type === 'bar' || props.detail.type === 'singleText' || props.detail.type === 'area' || props.detail.type === 'dataoverimage' || props.detail.type === 'energymeter' || props.detail.type === "thermometer" || props.detail.type === 'dialgauge' || props.detail.type === 'dialgauge2' || props.detail.type === 'fillgauge' || props.detail.type === 'Table' ){
                    data = [ ...data, ...props.detail?.meta?.metric.map(x => x?.split('-')[0])]
                    console.log(" METRIC DATA _______", data)
                    iid =  [props.detail?.meta?.instrument]
                    props.detail?.meta?.metric.map((z) => {
                        roomsdata.push(`${props.detail?.meta?.instrument}/${z?.split('-')[0]}`)
                    })
                    data.forEach((x) => {
                        console.log("JOIN ROOM",`${headPlant?.schema}/data/${props.detail?.meta?.instrument}/${x}`)
                        socket.emit('join_room',  `${headPlant?.schema}/data/${props.detail?.meta?.instrument}/${x}`);
                    })

                    // console.clear()
                    socketRooms = data
                    iidRooms = iid
                }
            }else{
                console.log("NON _ OBJECT - ", props.detail)
                if(props.detail.type === 'Table'){
                    Object.keys(props.detail?.meta?.metricField[0]).forEach((field, index) => {
                        props.detail?.meta?.metricField?.[0][field].metric.map((x) => {
                            data = [ ...data, x?.split('-')[0]]
                            iid = [ ...iid, props.detail?.meta?.metricField[0]?.[field].instrument]
                            roomsdata.push(`${props.detail?.meta?.metricField[0]?.[field].instrument}/${x?.split('-')[0]}`)
                            socket.emit('join_room', `${headPlant?.schema}/data/${props.detail?.meta?.metricField[0]?.[field].instrument}/${x?.split('-')[0]}`);
                            console.log(`${headPlant?.schema}/data/${props.detail?.meta?.metricField[0]?.[field].instrument}/${x?.split('-')[0]}`)
                        })
                        console.log("DATA++++",data)
                        
                    })
                    iidRooms = iid
                    socketRooms = data
                }
                else {
                    props.detail?.meta?.metricField?.[0].field1.metric?.forEach((x, index) => {
                        // //console.log(`Connecting to - ${headPlant?.schema}/data/${props.detail?.meta?.metricField[0].field1.instrument}/${x?.split('-')[0]}`)
                        data = [ ...data, x?.split('-')[0]]
                        Object.keys(props.detail?.meta?.metricField[0]).forEach((z, index) => {
                            // //console.log("INSI" , props.detail?.meta?.metricField[0]?.[z].instrument)
    
                            iid = [ ...iid, props.detail?.meta?.metricField[0]?.[z].instrument]
                            roomsdata.push(`${props.detail?.meta?.metricField[0]?.[z].instrument}/${x?.split('-')[0]}`)
                            console.log(`${headPlant?.schema}/data/${props.detail?.meta?.metricField[0]?.[z].instrument}/${x?.split('-')[0]}`)
                            socket.emit('join_room', `${headPlant?.schema}/data/${props.detail?.meta?.metricField[0]?.[z].instrument}/${x?.split('-')[0]}`);
                        })
    
                        // joinRoom()
                        // //console.log("AFTER JOIN - ", iid)
                        socketRooms = data
                        iidRooms = iid
                    })
                }
               
            }
            localStorage.setItem('rooms', roomsdata)
        } else {
            // console.clear()
            //console.log('NOT A CUSTOM DASHBOARD')
        }
    } catch(e){
        console.log(e)
    }
    }
    function changeCurrentDate(e,onChange){
        //console.log('showtextvalue',e)
        let startrange;
        let endrange;
        startrange = configParam.DATE_ARR(e, headPlant); 
         if(e === 7){
            endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
        }else if (e === 20) {
          endrange = configParam.DATE_ARR(22, headPlant)
        } else if (e === 21) {
          endrange = configParam.DATE_ARR(23, headPlant)
        } else if (e === 16) {
          endrange =  moment().subtract(1, 'month').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
        } else { 
          endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
        }

    
        //console.log(startrange,endrange,"startrange,endrange")
        if(startrange && endrange){
            return [startrange,endrange]
        }else{
            return []
        }
      }
    

      useEffect(()=>{
        //console.log(playalue,existData,'trigerdata')

      },[playalue,existData])

   const fetchWidgetWisedata=(data,typelistArr,refresh,isrepeat)=>{
    try{
        const detail = data ? data : props.detail;

        const isbetweenToday = isrepeat &&  detail.meta  && detail.meta.selectedRange && detail.meta.selectedRange ? [19,11,6,8,9].includes(detail.meta.selectedRange) : true
        // For Standard Dashboard
        //console.log(isbetweenToday,'isbetweenToday')
        if(!live){
            if((!playalue || (detail.type !== 'singleText' && playalue)) && !refresh){
                //console.log("IINSISISIS")
                setExistData([]) 
                setVIData([])
            }
            if(detail.meta && isbetweenToday){ 
                if(detail.type !== 'Text' && detail.type !== 'Image' && detail.type !== 'pareto'){
                    props.startRefresh()
                    let instrument = '';
                    let metric = '';
                let  range = changeCurrentDate(detail.meta  && detail.meta.selectedRange ? detail.meta.selectedRange : 1)
                //console.log(range,"pickerrange")
                if  (detail.meta.virturalInstrument !== undefined && (detail.meta.virturalInstrument && detail.meta.virturalInstrument.length > 0) && detail.type !== 'Table' ){
                    if(detail.type === 'donut' || detail.type === 'pie') {
                        
                        let tempbody = []
                        detail.meta.variables.map((z) => {
                            let bodyParams = { 
                                viid: z.id,
                                from: range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ") ,
                                to:range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ") ,
                            // aggregation: detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                                bodyParams.groupby = detail.meta.groupBy;
                            }
                            if(detail.meta.aggregation !== "none" && detail.meta.aggregation !== undefined){
                                bodyParams.aggregation = detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            tempbody.push(bodyParams)
                        }) 
                        getMultiVIDashboardData(tempbody)
                    } else {
                        let bodyParams = { 
                            viid: typeof detail.meta.virturalInstrument === 'string' ? detail.meta.virturalInstrument : detail.meta.virturalInstrument?.map((x) => x.id)?.join(','),
                            from:range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ"),
                            to: range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                        // aggregation: detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                        }
                        if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                            bodyParams.groupby = detail.meta.groupBy;
                        }
                        if(detail.meta.aggregation !== "none" && detail.meta.aggregation !== undefined){
                            bodyParams.aggregation = detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                        }

                        getVIDashboardData(bodyParams)
                    }
                }
                
                if(detail.type === 'Table'){
                    const virtualInstruments = [];

                        Object.values(detail.meta.metricField[0]).forEach(field => {
                            if (field.virtualInstrument) {
                                virtualInstruments.push(field.virtualInstrument);
                            }
                        });

                        const result = virtualInstruments.join(',');
                        // //console.log(result,"res")
                        if(result !== ""){
                            let bodyParams = { 
                                viid: result,
                                from: range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ"),
                                to:range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ") ,
                            // aggregation: detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                                bodyParams.groupby = detail.meta.groupBy;
                            }
                            if(detail.meta.aggregation !== "none" && detail.meta.aggregation !== undefined){
                                bodyParams.aggregation = detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            getVIDashboardData(bodyParams)
                        }
                    
                    
                }

                    if(detail.meta && detail.meta.selectedRange &&[19,11,6,8,9].includes(detail.meta.selectedRange)){
                        //console.log("eneter222222",editMode,refresh)
                        setTimeout(()=>{
                            if(!editMode && !refresh){ 
                                // //console.log("eneter222222")
                                setPlayMode(true)
                            }
                        },500) 
                    }   
                
                    if (detail.type === "map") {
                        instrument = detail.meta.instrumentMap.toString()
                        metric = "loc_cord,loc_data,loc_status"
                    }else{
                        if (detail.meta.instrument) {
                            if (Array.isArray(detail.meta.instrument)) {
                                instrument = detail.meta.instrument.join(',');
                            } else {
                                instrument = detail.meta.instrument;
                            }
                        } else {
                            instrument = '';
                        }
                        if (detail.meta.metric) {
                            if (Array.isArray(detail.meta.metric)) {
                                if(detail.type === 'dialgauge' || detail.type === 'dialgauge2' || detail.type === 'fillgauge'){
                                    metric = detail.meta.metric.length > 0 ?detail.meta.metric[0].split("-")[0]:'';
                                }else {
                                    metric = detail.meta.metric.length > 0 
                                        ? detail.meta.metric.map(x => (typeof x === 'string' && x.split("-")[0]) || '').join(',')
                                        : '';
                                }
                                
                            } else {
                                metric = detail.meta.metric.split("-")[0];
                            }
                        } else {
                            metric = '';
                        }
                    } 
                    let consMetric = []
                    let OtherMetric = []
                    let types =[]
                    if((detail.type === 'line' || detail.type === 'area' || detail.type === 'bar' || detail.type === 'correlogram') && detail.meta.isConsumption && detail.meta.isOnline && metric){
                        
                        let samarr = metric ? metric.split(",") : []
                        if(typelistArr.length>0){
                            // eslint-disable-next-line array-callback-return
                            samarr.forEach(f => {
                                const mettype = props.typelist.filter(e => f === e.metric_name);
                                if (mettype[0] && mettype[0].id) {
                                    if (mettype[0].id === 2) {
                                        consMetric.push(f);
                                    } else {
                                        OtherMetric.push(f);
                                    }
                                }
                            });
                            
                        }
                        types = common.getmetrictype(consMetric,typelistArr)
                    }else{
                        OtherMetric = metric ? metric.split(",") : []

                        if(detail.meta.metricField && detail.meta.metricField.length > 0 && detail.meta.isOnline && detail.meta.aggregation === 'consumption' && detail.type !== 'stackedbar' && detail.type !== 'groupedbar' && (detail.meta.aggregation === "none" || detail.meta.aggregation === undefined)){ // detail.meta.isConsumption
                            // eslint-disable-next-line array-callback-return
                            Object.keys(detail.meta.metricField[0]).forEach(field => {
                                consMetric = [];
                                OtherMetric = [];
                                instrument = detail.meta.metricField[0][field].instrument;
                        
                                metric = detail.meta.metricField[0][field].metric.map(x => x && x.split("-")[0]).join(',');
                                let samarr = metric.split(",");
                            
                                if (typelistArr.length > 0) {
                                    // eslint-disable-next-line array-callback-return
                                    samarr.forEach(f => {
                                        const mettype = typelistArr.filter(e => f === e.metric_name);
                                        if (mettype[0] && mettype[0].id) {
                            
                                            if (mettype[0].id === 2) {
                                                consMetric.push(f);
                                            } else {
                                                OtherMetric.push(f);
                                            }
                                        }
                                    });
                                }
                                types = common.getmetrictype(consMetric, typelistArr);
                                let finalrequestarray = [];
                                let dates = common.getBetweenDates(moment(range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ") ),  range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ"), 'day');
                                finalrequestarray.push({ "start": range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ") , "end":  range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ") , "type": types.length > 0 ? types : [''], "metrics": consMetric.length > 0 ? consMetric : [''], "instruments": instrument, "viid": '' });
                                // //console.log("metricFieldgetEnergyDay",finalrequestarray, dates)
                                getEnergyDay(finalrequestarray, dates, []);
                            
                            });
                            
                        }
                        if((detail.type === 'line' || detail.type === 'correlogram' || detail.type === 'area' || detail.type === 'bar' || detail.type === 'Table') && detail.meta.formula && !detail.meta.isOnline && detail.meta.aggregation === 'consumption' && (detail.meta.aggregation === "none" || detail.meta.aggregation === undefined)){ // detail.meta.isConsumption
                            let values = common.getVirtualInstrumentInfo(detail.meta, typelistArr)
                            instrument = values[0]
                            metric = values[1]
                            types = values[2]
                            let finalrequestarray = []
                            let dates = common.getBetweenDates(range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ") ,range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ"), 'day')
                            finalrequestarray.push({ "start":range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ"), "end": range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ") , "type": types.length>0 ? types : [''], "metrics": metric.length>0 ? metric : [''], "instruments": instrument, "viid": '' })
                            getEnergyDay(finalrequestarray,dates,[])
                        }
                    } 
                    //console.log(detail.meta && detail.meta.selectedRange ? detail.meta.selectedRange : 1,"detail.meta && detail.meta.selectedRange ? detail.meta.selectedRange : 1")
                    const lastTime = configParam.DATE_ARR(detail.meta && detail.meta.selectedRange ? detail.meta.selectedRange : 1, headPlant); 
                    let url = "/dashboards/getdashboard"; 
                    let params = { 
                        schema: headPlant.schema,
                        instrument: instrument ? instrument : null,
                        metric: OtherMetric.length>0 ? OtherMetric.toString() : null,
                        type: detail.type,
                        from: range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ"),
                        to:range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                        isConsumption: detail.meta.isConsumption?detail.meta.isConsumption:false
                    }
                    // //console.log(params,"params")
                    if(detail.type === 'line' || detail.type === 'stackedbar' || detail.type === 'groupedbar' || detail.type === 'Table'){
                        params = { 
                            schema: headPlant.schema,  
                            type: detail.type,
                            from: range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ"),
                            to:range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                            isConsumption: detail.meta.isConsumption?detail.meta.isConsumption:false 
                        }
                    }
                    if(detail.type && (detail.type === 'combobar' || detail.type === 'correlogram' || detail.type === 'line' || detail.type === 'stackedbar' || detail.type === 'groupedbar'  || detail.type === 'area' || detail.type === 'bar'|| detail.type === 'pie' || detail.type === 'donut'  || detail.type === 'Table' || detail.type === 'energymeter' || detail.type === 'singleText')){
                        if(detail.meta.groupBy !== "none" || detail.meta.aggregation !== "none"){
                            params.line_id = headPlant.id
                        }
                        if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                            params.group_by = detail.meta.groupBy;
                        }
                        if(detail.meta.aggregation !== "none"&& detail.meta.aggregation !== undefined){
                            params.aggregation = detail.meta.aggregation;
                        }
                    }
                    if(detail.type === 'pie' || detail.type === 'donut'){
                        
                        params.variables = JSON.stringify(detail.meta.variables)
                    }
                    if(detail.type === 'alerts' && detail.meta.alertname.length>0 ){
                        let alertNamesArr= detail.meta.alertname.map(x => x.name);
                        let alerNameEmtptyArr=detail.meta.alertname.length === 0 ? "" : alertNamesArr;
                        url = "/alerts/getPaginationAlerts"
                        params = {
                            schema: headPlant.schema,
                            perRow: 'All',
                            from: range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ"),
                            to:range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ") ,
                            ByName: JSON.stringify(alerNameEmtptyArr),
                            type: detail.type,
                        }
                    }
                    // //console.log(consMetric,"consMetric")
                    if(consMetric.length>0 && (detail.type === 'area' || detail.type === 'bar') && (detail.meta.aggregation === "none" || detail.meta.aggregation === undefined)){ // Area and bar with consumption
                        let finalrequestarray = []
                        let dates = common.getBetweenDates(range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ") , range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ"), 'day')
                        finalrequestarray.push({ "start": range.length > 1  ? range[0] : moment().subtract(5,"minute").format("YYYY-MM-DDTHH:mm:ssZ") , "end": range.length > 1  ? range[1] : moment().format("YYYY-MM-DDTHH:mm:ssZ") , "type": types, "metrics": consMetric, "instruments": instrument, "viid": '' })
                        getEnergyDay(finalrequestarray,dates,[])
                    }
                    if(detail.type === 'pareto'){
                        setForPareto(!forPareto)
                    
                    }
                    if(detail.meta.isOnline && 
                        ((OtherMetric.length>0) || detail.meta.metricField || (detail.meta.formula && !detail.meta.isConsumption) || (detail.type === 'alerts'))){ // All charts without consumtion
                            console.log(params,'trigerdata')
                            getfetchDashboard(url,params,((detail.type === 'line') || (detail.type === 'correlogram') || (detail.type === 'stackedbar') || (detail.type === 'groupedbar') || (detail.type === 'combobar') || (detail.type === 'Table')) && detail.meta.metricField && detail.meta.metricField.length > 0?detail.meta.metricField[0]:[],playalue,existData,detail.meta.formula?detail.meta.formula:"",lastTime);
                            
                    }
                    if((OtherMetric.length === 0 && consMetric.length===0) && !detail.meta.metricField && !detail.meta.formula){ // without chart configuration
                        // alert("!!")
                        props.endrefresh(false)
                    }
                    if(!detail.meta.virturalInstrument &&
                        ((OtherMetric.length>0) || detail.meta.metricField || (detail.meta.formula && !detail.meta.isConsumption) || (detail.type === 'alerts'))){ // All charts without consumtion
                        // //console.log(OtherMetric.length>0 , detail.meta.metricField , (detail.meta.formula && !detail.meta.isConsumption && !(detail.meta.virturalInstrument !== undefined)) , (detail.type === 'alerts'),params,"params")
                       //console.log("enteringwrong")
                       console.log(params,'trigerdata--2')
                        getfetchDashboard(url,params,((detail.type === 'line') || (detail.type === 'correlogram') || (detail.type === 'stackedbar') || (detail.type === 'groupedbar') || (detail.type === 'combobar') || (detail.type === 'Table')) && detail.meta.metricField && detail.meta.metricField.length > 0?detail.meta.metricField[0]:[],playalue, existData ,detail.meta.formula?detail.meta.formula:"",lastTime);
                    }
                    if((OtherMetric.length === 0 && consMetric.length===0) && !detail.meta.metricField && !detail.meta.formula){ // without chart configuration
                        props?.endrefresh(false)
                    }
                }
                else{
                    if(detail.type !== 'pareto') {
                        props?.endrefresh(false)
                    }
                } 
            } else {
                props?.endrefresh(false)
            }
        } 

    }catch(e){
        //console.log(`error while executing fetchWidgetWisedata the error message is ${e} `)
    }

   }
    const fetchData = (data,typelistArr,refresh) =>{ 

        try{
            const detail = data ? data : props.detail;
        // For Standard Dashboard
        if(!live){
             
            if((!playalue || (detail.type !== 'singleText' && playalue)) && !refresh){
                //console.log("IINSISISIS")
                setExistData([]) 
                setVIData([])
            }
    
            if(detail.meta){ 
                if(detail.type !== 'Text' && detail.type !== 'Image' && detail.type !== 'pareto'){
                    props.startRefresh()
                    let instrument = '';
                    let metric = '';
                let  startrange = moment(customDates.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
                let  endrange = moment(customDates.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")

                if  (detail.meta.virturalInstrument !== undefined && (detail.meta.virturalInstrument && detail.meta.virturalInstrument.length > 0) && detail.type !== 'Table' ){
                 
                    if(detail.type === 'donut' || detail.type === 'pie') {
                        
                        let tempbody = []
                        detail.meta.variables.map((z) => {
                            let bodyParams = { 
                                viid: z.id,
                                from: startrange,
                                to: endrange,
                            // aggregation: detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                                bodyParams.groupby = detail.meta.groupBy;
                            }
                            if(detail.meta.aggregation !== "none" && detail.meta.aggregation !== undefined){
                                bodyParams.aggregation = detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            tempbody.push(bodyParams)
                        }) 
                        getMultiVIDashboardData(tempbody)
                    } else {
                        console.log(detail.meta,"meta")
                        let bodyParams = { 
                            viid: typeof detail.meta.virturalInstrument === 'string' ? detail.meta.virturalInstrument : detail.meta.virturalInstrument?.map((x) => x.id)?.join(','),
                            from: startrange,
                            to: endrange,
                        // aggregation: detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                        }
                        if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                            bodyParams.groupby = detail.meta.groupBy;
                        }
                        if(detail.meta.aggregation !== "none" && detail.meta.aggregation !== undefined){
                            bodyParams.aggregation = detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                        }
                          console.log(bodyParams,"body")
                        getVIDashboardData(bodyParams)
                    }
                }
                
                if(detail.type === 'Table'){
                    const virtualInstruments = [];

                        Object.values(detail.meta.metricField[0]).forEach(field => {
                            if (field.virtualInstrument) {
                                virtualInstruments.push(field.virtualInstrument);
                            }
                        });
                        // console.clear()

                        const result = virtualInstruments.join(',');
                        // //console.log(result,"res")
                        if(result !== ""){
                            let bodyParams = { 
                                viid: result,
                                from: startrange,
                                to: endrange,
                            // aggregation: detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
                            if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                                bodyParams.groupby = detail.meta.groupBy;
                            }
                            if(detail.meta.aggregation !== "none" && detail.meta.aggregation !== undefined){
                                bodyParams.aggregation = detail.meta.aggregation === "consumption" ? "cons" : detail.meta.aggregation
                            }
            
                            getVIDashboardData(bodyParams)
                        }
                    
                    
                }

                
                    // console.log(btGroupValue,"btGroupValuebtGroupValue")
                    if([1,2,3,4,5,6,12,13,27].includes(btGroupValue)){
                        // console.log("enter223",!editMode,!refresh)

                        setTimeout(()=>{
                            if(!editMode && !refresh){ 
                            // console.log("enter223")
                                setPlayMode(true)
                            }
                        },500) 
                    }   
                
                    if (detail.type === "map") {
                        instrument = detail.meta.instrumentMap.toString()
                        metric = "loc_cord,loc_data,loc_status"
                    }else{
                        if (detail.meta.instrument) {
                            if (Array.isArray(detail.meta.instrument)) {
                                instrument = detail.meta.instrument.join(',');
                            } else {
                                instrument = detail.meta.instrument;
                            }
                        } else {
                            instrument = '';
                        }
                        if (detail.meta.metric) {
                            if (Array.isArray(detail.meta.metric)) {
                                if(detail.type === 'dialgauge' || detail.type === 'dialgauge2' || detail.type === 'fillgauge'){
                                    metric = detail.meta.metric.length > 0 ?detail.meta.metric[0].split("-")[0]:'';
                                }else {
                                    metric = detail.meta.metric.length > 0 
                                        ? detail.meta.metric.map(x => (typeof x === 'string' && x.split("-")[0]) || '').join(',')
                                        : '';
                                }
                                
                            } else {
                                metric = detail.meta.metric.split("-")[0];
                            }
                        } else {
                            metric = '';
                        }
                    } 
                    let consMetric = []
                    let OtherMetric = []
                    let types =[]
                    if((detail.type === 'line' || detail.type === 'area' || detail.type === 'bar' || detail.type === 'correlogram') && detail.meta.isConsumption && detail.meta.isOnline && metric){
                        
                        let samarr = metric ? metric.split(",") : []
                        if(typelistArr.length>0){
                            // eslint-disable-next-line array-callback-return
                            samarr.forEach(f => {
                                const mettype = props.typelist.filter(e => f === e.metric_name);
                                if (mettype[0] && mettype[0].id) {
                                    if (mettype[0].id === 2) {
                                        consMetric.push(f);
                                    } else {
                                        OtherMetric.push(f);
                                    }
                                }
                            });
                            
                        }
                        types = common.getmetrictype(consMetric,typelistArr)
                    }else{
                        OtherMetric = metric ? metric.split(",") : []

                        if(detail.meta.metricField && detail.meta.metricField.length > 0 && detail.meta.isOnline && detail.meta.aggregation === 'consumption' && detail.type !== 'stackedbar' && detail.type !== 'groupedbar' && (detail.meta.aggregation === "none" || detail.meta.aggregation === undefined)){ // detail.meta.isConsumption
                            // eslint-disable-next-line array-callback-return
                            Object.keys(detail.meta.metricField[0]).forEach(field => {
                                consMetric = [];
                                OtherMetric = [];
                                instrument = detail.meta.metricField[0][field].instrument;
                        
                                metric = detail.meta.metricField[0][field].metric.map(x => x && x.split("-")[0]).join(',');
                                let samarr = metric.split(",");
                            
                                if (typelistArr.length > 0) {
                                    // eslint-disable-next-line array-callback-return
                                    samarr.forEach(f => {
                                        const mettype = typelistArr.filter(e => f === e.metric_name);
                                        if (mettype[0] && mettype[0].id) {
                            
                                            if (mettype[0].id === 2) {
                                                consMetric.push(f);
                                            } else {
                                                OtherMetric.push(f);
                                            }
                                        }
                                    });
                                }
                                types = common.getmetrictype(consMetric, typelistArr);
                                let finalrequestarray = [];
                                let dates = common.getBetweenDates(moment(startrange), moment(endrange), 'day');
                                finalrequestarray.push({ "start": startrange, "end": endrange, "type": types.length > 0 ? types : [''], "metrics": consMetric.length > 0 ? consMetric : [''], "instruments": instrument, "viid": '' });
                                // //console.log("metricFieldgetEnergyDay",finalrequestarray, dates)
                                getEnergyDay(finalrequestarray, dates, []);
                            
                            });
                            
                        }
                        if((detail.type === 'line' || detail.type === 'correlogram' || detail.type === 'area' || detail.type === 'bar' || detail.type === 'Table') && detail.meta.formula && !detail.meta.isOnline && detail.meta.aggregation === 'consumption' && (detail.meta.aggregation === "none" || detail.meta.aggregation === undefined)){ // detail.meta.isConsumption
                            let values = common.getVirtualInstrumentInfo(detail.meta, typelistArr)
                            instrument = values[0]
                            metric = values[1]
                            types = values[2]
                            let finalrequestarray = []
                            let dates = common.getBetweenDates(moment(startrange), moment(endrange), 'day')
                            finalrequestarray.push({ "start": startrange, "end": endrange, "type": types.length>0 ? types : [''], "metrics": metric.length>0 ? metric : [''], "instruments": instrument, "viid": '' })
                            getEnergyDay(finalrequestarray,dates,[])
                        }
                    } 
                    
                    const lastTime = configParam.DATE_ARR(btGroupValue, headPlant); 
                    let url = "/dashboards/getdashboard"; 
                    let params = { 
                        schema: headPlant.schema,
                        instrument: instrument ? instrument : null,
                        metric: OtherMetric.length>0 ? OtherMetric.toString() : null,
                        type: detail.type,
                        from: startrange,
                        to: endrange,
                        isConsumption: detail.meta.isConsumption?detail.meta.isConsumption:false
                    }
                    // //console.log(params,"params")
                    if(detail.type === 'line' || detail.type === 'stackedbar' || detail.type === 'groupedbar' || detail.type === 'Table'){
                        params = { 
                            schema: headPlant.schema,  
                            type: detail.type,
                            from: startrange,
                            to: endrange,
                            isConsumption: detail.meta.isConsumption?detail.meta.isConsumption:false 
                        }
                    }
                    if(detail.type && (detail.type === 'combobar' || detail.type === 'correlogram' || detail.type === 'line' || detail.type === 'stackedbar' || detail.type === 'groupedbar'  || detail.type === 'area' || detail.type === 'bar'|| detail.type === 'pie' || detail.type === 'donut'  || detail.type === 'Table' || detail.type === 'energymeter' || detail.type === 'singleText')){
                        if(detail.meta.groupBy !== "none" || detail.meta.aggregation !== "none"){
                            params.line_id = headPlant.id
                        }
                        if(detail.meta.groupBy !== "none" && detail.meta.groupBy !== undefined){
                            params.group_by = detail.meta.groupBy;
                        }
                        if(detail.meta.aggregation !== "none"&& detail.meta.aggregation !== undefined){
                            params.aggregation = detail.meta.aggregation;
                        }
                    }
                    if(detail.type === 'pie' || detail.type === 'donut'){
                        
                        params.variables = JSON.stringify(detail.meta.variables)
                    }
                    if(detail.type === 'alerts' && detail.meta.alertname.length>0 ){
                        let alertNamesArr= detail.meta.alertname.map(x => x.name);
                        let alerNameEmtptyArr=detail.meta.alertname.length === 0 ? "" : alertNamesArr;
                        url = "/alerts/getPaginationAlerts"
                        params = {
                            schema: headPlant.schema,
                            perRow: 'All',
                            from: startrange,
                            to: endrange,
                            ByName: JSON.stringify(alerNameEmtptyArr),
                            type: detail.type,
                        }
                    }
                    // //console.log(consMetric,"consMetric")
                    if(consMetric.length>0 && (detail.type === 'area' || detail.type === 'bar') && (detail.meta.aggregation === "none" || detail.meta.aggregation === undefined)){ // Area and bar with consumption
                        let finalrequestarray = []
                        let dates = common.getBetweenDates(moment(startrange), moment(endrange), 'day')
                        finalrequestarray.push({ "start": startrange, "end": endrange, "type": types, "metrics": consMetric, "instruments": instrument, "viid": '' })
                        getEnergyDay(finalrequestarray,dates,[])
                    }
                    if(detail.type === 'pareto'){
                        setForPareto(!forPareto)
                       
                    }
                    if(detail.meta.isOnline && 
                        ((OtherMetric.length>0) || detail.meta.metricField || (detail.meta.formula && !detail.meta.isConsumption) || (detail.type === 'alerts'))){ // All charts without consumtion
                            if((detail.type === 'Table' || detail.type === 'pie') && detail.meta.isMultiMetric){
                                getfetchMultiMetricDashboard(url, params, detail.meta.metricField[0])
                                // props.endrefresh(false)
                            }
                            else {
                                console.log(params, detail.meta.variables, 'trigerdata --3')
                                getfetchDashboard(url,params,((detail.type === 'line') || (detail.type === 'correlogram') || (detail.type === 'stackedbar') || (detail.type === 'groupedbar') || (detail.type === 'combobar') || (detail.type === 'Table')) && detail.meta.metricField && detail.meta.metricField.length > 0?detail.meta.metricField[0]:[],playalue,existData,detail.meta.formula?detail.meta.formula:"",lastTime);
                            }
                            
                    }
                    if((OtherMetric.length === 0 && consMetric.length===0) && !detail.meta.metricField && !detail.meta.formula){ // without chart configuration
                        // alert("!!")
                        props.endrefresh(false)
                    }
                    if(!detail.meta.virturalInstrument &&
                        ((OtherMetric.length>0) || detail.meta.metricField || (detail.meta.formula && !detail.meta.isConsumption) || (detail.type === 'alerts'))){ // All charts without consumtion
                        // //console.log(OtherMetric.length>0 , detail.meta.metricField , (detail.meta.formula && !detail.meta.isConsumption && !(detail.meta.virturalInstrument !== undefined)) , (detail.type === 'alerts'),params,"params")
                        if((detail.type === 'Table' || detail.type === 'pie') && detail.meta.isMultiMetric){
                            getfetchMultiMetricDashboard(url, params, detail.meta.metricField[0])
                            // props.endrefresh(false)
                        }
                        else {
                            console.log(params,'trigerdata --4')
                            getfetchDashboard(url,params,((detail.type === 'line') || (detail.type === 'correlogram') || (detail.type === 'stackedbar') || (detail.type === 'groupedbar') || (detail.type === 'combobar') || (detail.type === 'Table')) && detail.meta.metricField && detail.meta.metricField.length > 0?detail.meta.metricField[0]:[],playalue,existData,detail.meta.formula?detail.meta.formula:"",lastTime);
                        }
                    }
                    if((OtherMetric.length === 0 && consMetric.length===0) && !detail.meta.metricField && !detail.meta.formula){ // without chart configuration
                        props?.endrefresh(false)
                    }
                }
                else{
                    if(detail.type !== 'pareto') {
                        props?.endrefresh(false)
                    }
                } 
            } else {
                props?.endrefresh(false)
            }
        } 
        else if((live && props.detail.meta.aggregation === 'none' && props.detail.type !== 'correlogram') || (live && props.detail.type === 'Table') ) {
        //    alert("INSIS")
            props?.startRefresh() 
            socket.on('mqtt_message', (msg) => {
                // console.clear()
                console.log(msg)
                if(socketRooms.includes(JSON.parse(msg.message).key) && iidRooms.includes(JSON.parse(msg.message).iid.toString())){
                    props?.endrefresh(false)
                    let te = JSON.parse(msg.message)
                    // //console.log(detail)
                    if(detail.type === 'bar') {
                        //console.log( )
                        custome_dashboard_data = [ ...custome_dashboard_data, {
                            iid: te.iid,
                            key: te.key,
                            value: te.value,
                            name: undefined,
                            instrument: realInstrumentListData.filter((x) => x.id?.toString() === te.iid?.toString())?.[0]?.name,
                            time: moment(te.time)
                        }]
                        custome_dashboard_data.length > 50 && custome_dashboard_data?.shift();
                    } else if (detail.type === 'Table') {
                        let current_iids = [ ...new Set(custome_dashboard_data?.map((x) => x.iid))]
                        console.log(current_iids, te.iid)
                        if(custome_dashboard_data.length > 0){
                            if(current_iids.includes(te.iid.toString())){
                                let index = custome_dashboard_data.indexOf(custome_dashboard_data.filter((x) => x.iid === te.iid.toString())[0])
                                console.log(custome_dashboard_data, index) 

                                custome_dashboard_data = custome_dashboard_data.map((x, ind) => {
                                    if(ind === index) {
                                        return {
                                            iid: te.iid.toString(),
                                            key: te.key,
                                            value: te.value,
                                            // instrument: te.iid,
                                            instrument: `${realInstrumentListData.filter((x) => x.id?.toString() === te.iid?.toString())?.[0]?.name}`,
                                            name: undefined,
                                            time: te.time
                                        }
                                    } else {
                                        return x
                                    }
                                })
                                console.log(custome_dashboard_data)
                            } else {
                                // alert("2")
                                custome_dashboard_data = [...custome_dashboard_data, {
                                    iid: te.iid.toString(),
                                    key: te.key,
                                    value: te.value,
                                    // instrument: te.iid,
                                    instrument: `${realInstrumentListData.filter((x) => x.id?.toString() === te.iid?.toString())?.[0]?.name}`,
                                    name: undefined,
                                    time: te.time
                                }]
                            }
                        }
                        else {
                            // alert('3')
                            custome_dashboard_data = [{
                                iid: te.iid.toString(),
                                key: te.key,
                                value: te.value,
                                // instrument: te.iid,
                                instrument: `${realInstrumentListData.filter((x) => x.id?.toString() === te.iid?.toString())?.[0]?.name}`,
                                name: undefined,
                                time: te.time
                            }]
                        }
                    }
                    else if(detail.type !== 'singleText'){
                        // console.log("__ MESSAGE __", te)
                        custome_dashboard_data = [ ...custome_dashboard_data, {
                            iid: te.iid,
                            key: te.key,
                            value: te.value,
                            instrument: `${realInstrumentListData.filter((x) => x.id?.toString() === te.iid?.toString())?.[0]?.name}`,
                            name: undefined,
                            // time: moment(te.time).format('YYYY-MM-DD HH:mm:ss.SSSSSS Z')
                            time: te.time
                        }]
                        custome_dashboard_data.length > 100 && custome_dashboard_data?.shift();
                    } else { 
                        custome_dashboard_data = [{
                            iid: te.iid,
                            key: te.key,
                            value: te.value,
                             time: te.time
                        }]
                    } 
                        setExistData(custome_dashboard_data) 
                } else {
                    props?.endrefresh(false)
                     
                }
               
            });
               
            socket.on('disconnect', (reason) => {
                // //console.log('DISCONNECT REASON', reason)
                props?.startRefresh() 
                if(selectedDashboard[0].custome_dashboard === true){
                    refesh_neo_token("", (token) => {
                        // socket.auth = { 'token': token }
                        reconnect(token)
                    })
                } else {
                    props.endrefresh()
                }
            })

            socket.on('connect', () => {
                //console.log("Connected to Socket - ")
            })


            }
            
        }
        catch(e){
            console.log("ERROR___", e)
        }
    }

    

    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            let daywiseData = [...existData];
            // eslint-disable-next-line array-callback-return
            energydayData.map((instrument) => {
                if (instrument.dayData) {
                    // eslint-disable-next-line array-callback-return
                    instrument.dayData.map((data) => {
                        let formula = props.detail.meta.formula?props.detail.meta.formula:""
                        let iid 
                        let key
                        let instruName
                        if (data.length > 0) {
                            // eslint-disable-next-line array-callback-return
                            data.map((val) => {
                                let metrictype = common.getmetrictype([val.key], props.typelist)
                                let total 
                                if (metrictype === 2 && !val.offline){
                                 total = val.endReading - val.startReading;
                                }else{
                                     total = val.value
                                }
                                total = total === null ? 0 : total;
                                if(props.detail.meta.isOnline){
                                    formula = total    
                                }else{
                                    formula = formula.replace(val.iid + "." + val.key, total)
                                }
                                iid = val.iid
                                key = val.key
                                instruName = instrumentList.filter(int => int.id === val.iid)
                            })
    
                            if(!props.detail.meta.isOnline){
                                formula = formula.replace(/[a-z0-9]+.kwh/g, 0).replace('--', '-');
                            }
                            daywiseData.push({ iid : iid,key:key , time: new Date(moment(data[0].time)).getTime(),value: parseInt(isFinite(calcFormula(formula)) ? calcFormula(formula) : 0) ,instrument: (instruName.length>0) ? instruName[0].name : ''})
                             
                        }
                        else {
                            if (instrument.vi && instrument.vi === headPlant.energy_asset) {
                                daywiseData.push({ iid : '',key:'', time: new Date().getTime(),value: 0,instrument: '' })
                            } 
                        }
                    })
                }
                
            })
            //console.log("ENERGY")
            setExistData(daywiseData)
            props?.endrefresh(false)
            

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])

    useEffect(() => {
        if (!VIDashboardDataLoading && VIDashboardData && !VIDashboardError) {
           if(props.detail.type === 'Table'){
            // console.clear()
            console.log("DATA__", VIDashboardData)
            setVIData(VIDashboardData?VIDashboardData:[]);
           }
           else{
                console.log("VI", VIDashboardData)
             setExistData(VIDashboardData?VIDashboardData:[]);
           }
           
            props?.endrefresh(false)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VIDashboardDataLoading, VIDashboardData, VIDashboardError])

    useEffect(() => {
            if(!MultiVIDashboardDataLoading && MultiVIDashboardData && !MultiVIDashboardError){
                if (props.detail.type === 'donut' || props.detail.type === 'pie'){
                    // console.clear()
                    //console.log(MultiVIDashboardData)
                    let data = []
                    MultiVIDashboardData.map((x) => {
                        if(x){
                            data.push({
                                name: x?.instrument,
                                value: x?.value
                            })
                        }
                    })
                    setExistData(data || [])
                    props?.endrefresh(false)
                   }
            }
    }, [MultiVIDashboardDataLoading,
        MultiVIDashboardData,
        MultiVIDashboardError])

    const calcHeigth = (height) => {
        //console.log("HEIGHT _ ", height*0.8)
        return props.detail.type === 'weather' ? height+10 : height+18
    }

    console.log(instrumentList ,"___existData____", existData, props.detail.type, props.detail.meta)

    return(
        <div  style={{padding: 5, paddingBottom: (props.detail.type === 'energymeter' || props.detail.type === 'weather') ? '15px' : '0px', height:(props.height < 150 ? '66%': (props.detail.type === 'energymeter' || props.detail.type === 'weather') ? calcHeigth(props.height) :'80%'),
        // overflow: (props.detail.type ==='dialgauge') ?   'auto' : existData.length > 0 ? 'unset' : 'auto',
        overflow:
      props.detail.type === 'Image'  ? 'unset'  : props.detail.type === 'dialgauge'? 'auto' : existData.length > 0 ? 'unset': 'auto',
        display:(props.detail.type === 'dialgauge2' || props.detail.type === 'fillgauge')? "flex" : "",justifyContent:(props.detail.type === 'dialgauge2' || props.detail.type === 'fillgauge')? "center" : "" ,alignItems:(props.detail.type === 'dialgauge2' || props.detail.type === 'fillgauge') ? "center" : ""}}> 
            <React.Fragment>
                <ChartBlock 
                type={props.detail.type}  
                markers={marker} 
                existData={existData} 
                viData={viData} 
                data={existData} 
                width={props.width} 
                height={props.height} 
                meta={props.detail.meta} 
                showTable={props.showTable} 
                showChart={props.showChart}
                cardColor={(e)=>props.cardColor(e)}
                />
                    {children} 
            </React.Fragment>   
        </div>
    )
}) 
const isNotRender = (prev, next) => { 
    return prev.width !== next.width || prev.height !== next.height || prev.showTable !== next.showTable || prev.showChart !== next.showChart || prev.detail !== next.detail || prev.cardcolor !== next.cardcolor ? false : true;
};
const DashboardCardContent = React.memo(CardContent, isNotRender);
export default DashboardCardContent;