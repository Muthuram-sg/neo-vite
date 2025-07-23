import React, { useState, useEffect, useCallback,useRef } from "react";
import Grid from 'components/Core/GridNDL'
import moment from 'moment';
import { useRecoilState } from "recoil";
import { selectedPlant,snackToggle,snackMessage,snackType,snackDesc,themeMode } from "recoilStore/atoms";
import GatewayModal from "./components/GatewayModal";
import { useTranslation } from 'react-i18next';
import useGateWay from "components/layouts/Settings/Gateway/hooks/useGetGateWay.jsx"
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import useTheme from 'TailwindTheme';
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import Card from "components/layouts/NewSettings/Gateway/components/Card.jsx";
import NewReport from 'assets/neo_icons/Menu/plus.svg?react'; 
import Button from "components/Core/ButtonNDL";
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Tag_icon from 'assets/neo_icons/Settings/Tag.svg?react';
import ClickAwayListener from "react-click-away-listener";
import Tag from "components/Core/Tags/TagNDL";
import Gatewaypage from './components/Gatewaypage'
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL'
import useUpdateGateWayStatus from 'components/layouts/NewSettings/Gateway/hooks/useUpdateStatus.jsx'
import useUpdateRTUStatus from 'components/layouts/NewSettings/Gateway/hooks/useUpdateRTUstatus.jsx'
import useUpdateTCPStatus from 'components/layouts/NewSettings/Gateway/hooks/useUpdateTCPStatus.jsx'

import Edit from 'assets/neo_icons/Settings/GateWayIcons/edit.svg?react';
import Delete from 'assets/neo_icons/Settings/GateWayIcons/delete.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import useRealInstrumentList from "components/layouts/Settings/Instrument/Hooks/useRealInstrumentList.jsx";
import useLineConnectivity from "components/layouts/Line/hooks/useLineConnectivity";
import configParam from "config";
import useGetStatus from './hooks/useGetStatus'
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import ModalNDL from "components/Core/ModalNDL";

// NOSONAR - This function requires multiple parameters due to its specific use case.
export default function Gateway(props) {// NOSONAR -  skip this line
    const { t } = useTranslation();
    const theme = useTheme();
    const [headPlant] = useRecoilState(selectedPlant);
    const [GatewayDialog, setGatewayDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [GateWayDataList, setGateWayDataList] = useState([])
    const [, setTableData] = useState([])// NOSONAR -  skip this line
    const { GateWayLoading, GateWayData, GateWayError, getGateWay } = useGateWay();
    const [editValue, setEditValue] = useState('')
    const [Instrumentarray, setInstrumentArray] = useState([]);// NOSONAR -  skip this line
    const [input, setInput] = useState(false);
    const [searchText, setsearchText] = useState('');
    const [isActive, setisActive] = useState(true);
    const [isInactive, setisInactive] = useState(true);
    const [page, setpage] = useState("home")
    const [GateWayName, setGateWayName] = useState('')
    const [isProtocolpage,setisProtocolpage] = useState('')
    const [protocolName,setprotocolName] = useState("")
    const [GateWayInstrument,setGateWayInstrument] = useState([])
    const [GateWayId,setGatewayId] = useState('')// NOSONAR -  skip this line
    const [GateWayPath,setGateWayPath] = useState('')
    const [anchorEl, setAnchorEl] = useState(null);
    const [openGap,setOpenGap] = useState(false); 
    const {UpdateGateWayStatusLoading, UpdateGateWayStatusData, UpdateGateWayStatusError, UpdateGateWayStatus} = useUpdateGateWayStatus()
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
  const [, setSnackDesc] = useRecoilState(snackDesc);// NOSONAR -  skip this line
  const [overallLoader,setoverallLoader] =useState(false)
  const [currTheme] = useRecoilState(themeMode);


    const [SelectedgateWayData,setSelectedgateWayData] = useState({})
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [rawDatas,setRrawData] = useState([])// NOSONAR -  skip this line
    const [instrumentData,setinstrumentData] = useState([])
    const [MeterUpdateStatus,setMeterUpdateStatus] = useState({})
    const [previousAction,setpreviousAction] = useState('')
    const [TCPStatus,setTCPStatus] = useState({})
    const [RTUStatus,setRTUStatus] = useState({})
    const GateWayPageRef = useRef()
    const [activeCount,setactiveCount] = useState(0)
    const [InactiveCount,setInactiveCount] = useState(0)
    const [isDeleteModel,setisDeleteModel] = useState(false)
    const [isStopGateway,setisStopGateway] = useState(false)
    const [isRestartGateway,setisRestartGateway] = useState(false)
    const [isStopRtu,setisStopRtu] = useState(false)
    const [isStopTcp,setisStopTcp] = useState(false)
    const [isRestartTCP,setisRestartTCP] = useState(false)
    const [isRestartRTU,setisRestartRTU] = useState(false)

    // const [previousAction,set]







    const {UpdateRTUStatusLoading, UpdateRTUStatusData, UpdateRTUStatusError, UpdateRTUStatus} = useUpdateRTUStatus()
    const {UpdateTCPStatusLoading, UpdateTCPStatusData, UpdateTCPStatusError, UpdateTCPStatus} = useUpdateTCPStatus()
    const { realInstrumentListLoading, realInstrumentListData, realInstrumentListError, getRealInstrumentList } = useRealInstrumentList()
    const { LineConnectivityLoading, LineConnectivityData, LineConnectivityError, getLineConnectivity } = useLineConnectivity() 
    const { StatusLoading, StatusData, StatusError, getStatus} = useGetStatus()

    useEffect(()=>{
        if(!LineConnectivityLoading &&  LineConnectivityData &&  !LineConnectivityError){
            if(LineConnectivityData.data){
                // setLoading(true)
                setMeterUpdateStatus(LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[]);
                console.log(LineConnectivityData.data.meter_data?LineConnectivityData.data.meter_data:[],
                    LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[],
                    "RwaData"
                )
            }else{
                setMeterUpdateStatus([]);
            }        
        }

    },[LineConnectivityLoading, LineConnectivityData, LineConnectivityError,UpdateGateWayStatusData])


    useEffect(()=>{
        if(rawDatas.length > 0){
            setactiveCount(GateWayDataList.filter(x=>x.Service === "Running").length)
            setInactiveCount(GateWayDataList.filter(x=>x.Service === "Stopped").length)
        }

    },[rawDatas])

    useEffect(()=>{
      let overallList = [...rawDatas]
        if(isActive && !isInactive){
            setGateWayDataList(overallList.filter(x=>x.Service === 'Running'))
        }else if(isInactive && !isActive){
            setGateWayDataList(overallList.filter(x=>x.Service === 'Stopped'))
        }else if(!isInactive && !isActive){
            setGateWayDataList(overallList.filter(x=>x.Service !== 'Stopped' && x.Service !== 'Running' ))
            
        }else{
            setGateWayDataList(overallList)
        }
       
        


    },[isActive,isInactive])
    


    useEffect(()=>{
        if( !StatusLoading &&  StatusData &&  !StatusError){
            console.log(StatusData,'StatusData')
            if(StatusData && "protocol" in StatusData && StatusData.protocol === 'rtu' ){
                setRTUStatus(StatusData.data)
            }else if(StatusData && "protocol" in StatusData && StatusData.protocol === 'tcp'){
                if(Object.keys(StatusData.data).length > 0){
                    setTCPStatus(StatusData.data)
                }else{
                    setTCPStatus({
                        tcp_status:"stopped"
                    })

                }

            }

        }
    },[StatusLoading , StatusData ,StatusError])



    useEffect(()=>{
        if( !realInstrumentListLoading &&  realInstrumentListData &&  !realInstrumentListError){
            if (realInstrumentListData && realInstrumentListData.length > 0) {
                const  finalData = realInstrumentListData.map(x=>{
                    let instrumentFreq = []
                    // console.log(MeterUpdateStatus[x.id],'MeterUpdateStatus[x.id]')
                    if(MeterUpdateStatus[x.id] !== undefined){
                        if(x.instruments_metrics.length > 0){
                          instrumentFreq = x.instruments_metrics.map(freq=>freq.frequency)
                          let min = instrumentFreq.length > 0 ? (configParam.MODE(instrumentFreq) * 3) : 0;
                          let LA = new Date(MeterUpdateStatus[x.id]);
                          let CT = new Date();
                          let diff = CT - LA;
                          let Status = diff < (Math.max(min, 3600) * 1000);
                          if(!Status){
                            return {...x,lastActive:MeterUpdateStatus[x.id],status:"Inactive"}
    
                          }else{
                            return {...x,lastActive:MeterUpdateStatus[x.id],status:"Live"}
                          }
                        }
    
                    }else{
                        return x
                    }
                })
                // console.log(finalData,'finalData')
                setinstrumentData(finalData)
            }
        }
       
    },[ realInstrumentListLoading, realInstrumentListData, realInstrumentListError,MeterUpdateStatus])

    useEffect(()=>{
        if(!UpdateGateWayStatusLoading &&  UpdateGateWayStatusData &&  !UpdateGateWayStatusError){
            console.log(UpdateGateWayStatusData,"UpdateGateWayStatusData")
            setOpenSnack(true)
            // NOSONAR - This function requires multiple parameters due to its specific use case.
            SetType(previousAction === 'restart' ? "info"  : previousAction === 'start' ? 'success' :'error') // NOSONAR -  skip this line
            SetMessage( previousAction === 'restart' ? "The gateway has been successfully restarted" : previousAction === "start" ? " The gateway has been successfully  started" : "The gateway has been successfully  stopped")// NOSONAR -  skip this line
            handleTriggerRows()
            setTimeout(()=>{
                GateWayPageRef.current.triggerMqtt()
            },600)

        }

    },[UpdateGateWayStatusLoading, UpdateGateWayStatusData, UpdateGateWayStatusError,])



    useEffect(()=>{
        if(!UpdateRTUStatusLoading &&  UpdateRTUStatusData &&  !UpdateRTUStatusError){
           
            if(UpdateRTUStatusData && UpdateRTUStatusData.protocol !== 'restart'){
                setTimeout(()=>{
                getStatus({type:"rtu",path:SelectedgateWayData.ip_address,port:":5000/",endurl:"rtu/status"})
               },[600])

                // console.log(UpdateRTUStatusData,"UpdateGateWayStatusData")
                setOpenSnack(true)
                SetMessage(`RTU Connection ${previousAction+"ed"} successfully`)
                SetType('success')
            }else if(UpdateRTUStatusData && UpdateRTUStatusData.data && UpdateRTUStatusData.protocol === 'restart'){
                setTimeout(()=>{
                    getStatus({type:"rtu",path:SelectedgateWayData.ip_address,port:":5000/",endurl:"rtu/status"})
                   },[600])
                setOpenSnack(true)
                SetMessage(`RTU Connection restarted successfully`)
                SetType('success')
            }
        }

    },[UpdateRTUStatusLoading, UpdateRTUStatusData, UpdateRTUStatusError])

    useEffect(()=>{
        if(!UpdateTCPStatusLoading &&  UpdateTCPStatusData &&  !UpdateTCPStatusError){
            if(UpdateTCPStatusData && UpdateTCPStatusData.protocol !== 'restart'){

                console.log(UpdateTCPStatusData,"UpdateGateWayStatusData")
                setOpenSnack(true)
                SetMessage(`TCP Connection ${previousAction +"ed"} successfully`)
                SetType('success')
                setTimeout(()=>{
                    getStatus({type:"tcp",path:SelectedgateWayData.ip_address,port:":5000/",endurl:"tcp/status"})
                },[600])

            }else if(UpdateTCPStatusData && UpdateTCPStatusData.data && UpdateTCPStatusData.protocol === 'restart'){
                console.log("EnterRestart")
                setTimeout(()=>{
                    getStatus({type:"tcp",path:SelectedgateWayData.ip_address,port:":5000/",endurl:"tcp/status"})
                },[600])
                setOpenSnack(true)
                SetMessage(`TCP Connection restarted successfully`)
                SetType('success')
            }
        }

    },[UpdateTCPStatusLoading, UpdateTCPStatusData, UpdateTCPStatusError])


    useEffect(() => {
        setoverallLoader(true)
        getGateWay(headPlant.id)
        getRealInstrumentList(headPlant.id)
        getLineConnectivity({schema: headPlant.schema,lineId :headPlant.id })
        setpage("home")
        setisProtocolpage(false)
        props.handleHide(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        setoverallLoader(true)
        processedrows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GateWayData,instrumentData])

    useEffect(()=>{
        let rawData = [...rawDatas]
        if(debouncedSearchText && debouncedSearchText !== ''){
            rawData = rawData.filter(x=>
                Object.values(x).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(debouncedSearchText.toLowerCase())
                )
            )
        }
        setGateWayDataList(rawData)


    },[debouncedSearchText])




    const triggerTableData = () => {
        getGateWay(headPlant.id)
    }
    const handleNewgateway = () => {
        setGatewayDialog(true);
        setDialogMode('create');


    }

    const handleDialogClose = () => {
        setGatewayDialog(false);

    }
    const handleDialogEdit = (id, value) => {
        setEditValue(value)
        setGatewayDialog(true);
        setDialogMode('edit');
    }
    const deleteGateWay = (id, value,status) => {
        if(status === 'Running'){
            setisDeleteModel(true)
            return false
        }else{
        setGatewayDialog(true)
        setDialogMode('delete');
        setEditValue(value)
    }
    }

    async function fetchDataByIP(ip) {
        const response = await configParam.RUN_REST_API('/settings/getDAQService', {type:"gateway",path:ip,port:":5001/",endurl:"status"});
        console.log(response,'response')
        const data = await response.data;
        return data;
      }
      

    async function mergeApiResponse(parentArray) {
        setoverallLoader(true)
        const updatedArray = await Promise.all(
          parentArray.map(async (item) => {
            if(item.ip_address){
                const apiResponse = await fetchDataByIP(item.ip_address);
                return { ...item, ...apiResponse };
            }else{
                return item
            }
          
          }) 
        );
        return updatedArray;
      }

    const processedrows =async () => {
        let temptabledata = []
        if (!GateWayLoading && GateWayData && !GateWayError) {
            
            let combinedList = GateWayData.map((x)=>{
                if(x.instrument_id && x.instrument_id.length > 0){
                    return {...x,instrument_id:x.instrument_id.map((j)=>{
                        const filteredOBJ = instrumentData.find(r=>r.id === j.id)
                        if(filteredOBJ){
                          return {...j,status:filteredOBJ.status,lastActive:filteredOBJ.lastActive}
                        }else{
                             return j
                        }
                    })} 

                }else{
                    return x
                }

            })
            
             
             await mergeApiResponse(combinedList).then((updatedList)=>{
                combinedList = updatedList
              }).catch((error) => {
                console.error("Error fetching data:", error);
              });
              
              combinedList = combinedList.map((item) => {
                let liveCount = 0
                if(item.instrument_id && Array.isArray(item.instrument_id) && item.instrument_id.length > 0){
                    liveCount = item.instrument_id.filter((status) => status.status === "Live").length;
                }
                return { ...item, count: liveCount };
              });
            //   console.log(SelectedgateWayData,"SelectedgateWayData")
            const currentTimestamp = new Date();
            combinedList.forEach((item) => {
                const liveInstruments = item.instrument_id.filter(
                  (instrument) => instrument.status === "Live" && instrument.lastActive
                );
              
                if (liveInstruments.length) {
                  const mostRecent = liveInstruments.reduce((latest, instrument) => {
                    const lastActiveDate = new Date(instrument.lastActive);
                    return lastActiveDate > new Date(latest.lastActive) ? instrument : latest;
                  });
              
                  const timeDifferenceInMilliseconds =
                    currentTimestamp - new Date(mostRecent.lastActive);
                  const timeDifferenceInMinutes = Math.floor(
                    timeDifferenceInMilliseconds / 60000
                  );
              
                  item.most_recent = {
                    id: mostRecent.id,
                    name: mostRecent.name,
                    lastActive: mostRecent.lastActive,
                    differenceInMinutes: timeDifferenceInMinutes,
                  };
                } else {
                  item.most_recent = {}; // No live instruments
                }
              });
            console.log(combinedList,"combinedList")
            if(page !== 'home'){
                setSelectedgateWayData(combinedList.find(data=>data.ip_address === SelectedgateWayData.ip_address))

            }
            if(isActive && !isInactive){
                setGateWayDataList(combinedList.filter(x=>x.Service === 'Running'))
            }else if(isInactive && !isActive){
                setGateWayDataList(combinedList.filter(x=>x.Service === 'Stopped'))
            }else if(!isInactive && !isActive){
                setGateWayDataList(combinedList.filter(x=>x.Service !== 'Stopped' && x.Service !== 'Running' ))
                
            }else{
                setGateWayDataList(combinedList)
            }
            setRrawData(combinedList)
            temptabledata = temptabledata.concat(combinedList.map((val, index) => {
                return [val.iid, val.name, val.ip_address, val.location ? val.location : "--", val.instrument_id && val.instrument_id.length > 0 ? val.instrument_id.map(x => x.name).join(",") : "--", moment(val.created_ts).format("DD/MM/YYYY HH:mm:ss"), val.user ? val.user.name : "--"]
            })

            )
            setInstrumentArray(GateWayData.map(val => val.instrument_id && val.instrument_id.length > 0 ? val.instrument_id.map(x => x.id) : []));
        }
        setoverallLoader(false)
        setTableData(temptabledata)
    }

    const updateSearch = useCallback((e) => {
        setsearchText(e.target.value);
    }, [setsearchText]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [searchText]);


    const renderSearchBox = () => {
        if (input) {
            return (
                <InputFieldNDL
                    autoFocus
                    id="Gateway-search"
                    placeholder={t("Search")}
                    size="small"
                    value={searchText}
                    type="text"
                    onChange={updateSearch}
                    disableUnderline={true}
                    startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  />}
                    endAdornment={searchText !== '' ? <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  onClick={() => { setsearchText(''); setInput(true) }} /> : ''}

                />
            )
        } else {
            return (
                <Button type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />
            )
        }
    }
    const clickAwaySearch = () => {
        if (searchText === '')
            setInput(false)
        else
            setInput(true)
    }

    const handleGateWayClick = (data) => {
        props.handleHide(true)
        setpage("GateWay")
        setGateWayName(data.name)
        console.log(data,"data")
        setSelectedgateWayData(data)
        if(data.instrument_id && data.instrument_id.length > 0 ){
        setGateWayInstrument(data.instrument_id.map(x=>x.id))
        }
        getStatus({type:"rtu",path:data.ip_address,port:":5000/",endurl:"rtu/status"})
        getStatus({type:"tcp",path:data.ip_address,port:":5000/",endurl:"tcp/status"})
        setGateWayPath(data.ip_address)
        setGatewayId(data.id)


    }


    const listArr = [{ index: 0, name: "Settings" }, { index: 1, name: "GateWay" }, { index: 2, name: GateWayName }]
    const handleActiveIndex = (index) => {
        if (index === 0) {
            setpage("home")
            setisProtocolpage(false)
            props.handleHide(false)
        }else if(index === 1){
            setpage("home")
            setisProtocolpage(false)
            props.handleHide(false)
        }else if(index === 2){
            setpage("GateWay")
            setisProtocolpage(false)
        }
      

    }
    const appenedArr = isProtocolpage ? [{index:3,name:protocolName}] : []

    
    const handleRestartRTUConnection=(ismodel)=>{
        if(ismodel){
            setisRestartRTU(true)

        }else{
            UpdateRTUStatus({path:SelectedgateWayData.ip_address,action:'restart',type:"rtu",port:":5000/rtu/"})
            setisRestartRTU(false)

        }

    }

    const handleStartRTUConnection=(action)=>{
        const startorstop = action.toLowerCase()
        if(startorstop === 'stop' ){
          setisStopRtu(true)
        }else{
            UpdateRTUStatus({path:SelectedgateWayData.ip_address,action:startorstop,type:"rtu",port:":5000/rtu/"})
            setpreviousAction(action)

        }
    }

    const handleRestartTCPConnection=(ismodel)=>{
        if(ismodel){
        setisRestartTCP(true)
        }else{
            UpdateTCPStatus({path:SelectedgateWayData.ip_address,action:'restart',type:"rtu",port:":5000/tcp/"})
            setisRestartTCP(false)

        }
    }

    const handleStartTCPConnection=(action)=>{
        const startorstop = action.toLowerCase()
        if(startorstop === 'stop' ){
            setisStopTcp(true)
          }else{
            UpdateTCPStatus({path:SelectedgateWayData.ip_address,action:'start',type:"rtu",port:":5000/tcp/"})
            setpreviousAction(action)

          }
    }

    const handleStartGateWayConnection=(action)=>{
        if(action === 'stop'){
            setisStopGateway(true)
        }else{
            UpdateGateWayStatus({path:SelectedgateWayData.ip_address,action:action,port:":5001/",type:"gateway"})
            setpreviousAction(action)
        }
       
    }

    
  const handleRestartGateWayConnection=()=>{
    setisRestartGateway(true)
   

  }
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); 
        setOpenGap(true)// Set anchor element for positioning the popper
    };

    const handleClose = () => {
        setAnchorEl(null); // Close the popper
        setOpenGap(false)
    };
    const popperOption = [
        { id: "edit", name: "Edit", icon: Edit, toggle: false,stroke:currTheme === 'dark' ? "#eeeeee" :'#202020'  },
        { id: "delete", name: "Delete", icon: Delete,color:"#CE2C31",stroke:'#CE2C31',toggle: false, },
    ]



    const handleOptionChange = (e,data)=>{
        if(e === "edit"){
            setOpenGap(!openGap)
            setAnchorEl(null)
            handleDialogEdit(SelectedgateWayData.id,SelectedgateWayData)
    
        }
        if(e === "delete"){
            setOpenGap(!openGap)
            setAnchorEl(null)
            if(SelectedgateWayData.Service === 'Running'){
                setisDeleteModel(true)
                return false
            }else{
                deleteGateWay(SelectedgateWayData.id,SelectedgateWayData)
            }
            
            
        }
       
    }


    const handleTriggerRows = ()=>{
        processedrows()
    }

    const handleCloseDelete=()=>{
        setisDeleteModel(false)
    }
    const handleCloseGatewayStopDilog=()=>{
        setisStopGateway(false)
    }
    const handleStopGateway=()=>{
        UpdateGateWayStatus({path:SelectedgateWayData.ip_address,action:'stop',port:":5001/",type:"gateway"})
        setpreviousAction('Stop')
        setisStopGateway(false)
    }

    const handleCloseGatewayRestartDilog=()=>{
        setisRestartGateway(false)
    }
    const handleRestartGateway=()=>{
        UpdateGateWayStatus({path:SelectedgateWayData.ip_address,action:'restart',port:":5001/",type:"gateway"})
        setpreviousAction('restart')
        setisRestartGateway(false)

    }

    const handleCloseTcpDilog=(isRtu)=>{
        if(isRtu){
            setisStopRtu(false)
        }else{
            setisStopTcp(false)

        }
    }

    const  handleStopTcp=(isTcp)=>{
        if(isTcp){
            UpdateTCPStatus({path:SelectedgateWayData.ip_address,action:'stop',type:"tcp",port:":5000/tcp/"})
            setpreviousAction("Stop")
            setisStopTcp(false)
        }else{
            UpdateRTUStatus({path:SelectedgateWayData.ip_address,action:'stop',type:"rtu",port:":5000/rtu/"})
            setpreviousAction('Stop')
            setisStopRtu(false)
    
        }
        
    }

    // console.log(RTUStatus,"RTUStatus")
const StausRTU = RTUStatus && "rtu_status" in RTUStatus && RTUStatus.rtu_status === 'running' ? "Stop" : "Start"
const StausTCP = TCPStatus && "tcp_status" in TCPStatus && TCPStatus.tcp_status === 'running' ? "Stop" : "Start"

    return (

        <React.Fragment>
            {
                (overallLoader || UpdateRTUStatusLoading || UpdateTCPStatusLoading) && <LoadingScreenNDL />
            }
            <GatewayModal
                GatewayDialog={GatewayDialog}
                dialogMode={dialogMode}
                handleDialogClose={() => handleDialogClose()}
                headPlant={headPlant}
                triggerTableData={triggerTableData}
                editValue={editValue}
                GateWayData={GateWayDataList}
                Instrumentarray={Instrumentarray}


            />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div className="flex items-center justify-between  h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                        {
                            page === 'home' ?
                                <React.Fragment>
                                    <TypographyNDL value='Gateway' variant='heading-02-xs' />
                                    <Button type="tertiary" value={t('AddGateway')} onClick={handleNewgateway} iconAlignLeft icon={NewReport} />
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Breadcrumbs breadcrump={[...listArr,...appenedArr]} onActive={handleActiveIndex} />
                                    <div className="flex gap-2 items-center">
                                        {
                                            page === 'GateWay' && 
                                            <React.Fragment>
                                                <Button type="ghost" value={'Restart'} onClick={handleRestartGateWayConnection} />
                                                <Button danger={SelectedgateWayData && SelectedgateWayData.Service === "Running"} value={`${SelectedgateWayData && SelectedgateWayData.Service === "Running" ? "Stop" : 'Start'} Gateway`}  onClick={()=>handleStartGateWayConnection(SelectedgateWayData.Service === "Running" ? "stop" : 'start')} />
                                                <Button type="ghost" icon={MoreVertLight} onClick={(e) =>handleClick(e)} />
                                                    <ListNDL
                                                        options={popperOption}
                                                        Open={openGap}
                                                        multiple={false}
                                                        optionChange={(e) => handleOptionChange(e)}
                                                        keyValue={"name"}
                                                        keyId={"id"}
                                                        id={"popper-dressing"}
                                                        IconButton
                                                        isIcon
                                                        onclose={handleClose}
                                                        anchorEl={anchorEl}
                                                        width="180px"
                                                    />
                                            </React.Fragment>
                                        }

                                        {
                                             page === 'RTU' && 
                                             <React.Fragment>
                                             <Button type="ghost" value={'Restart'} onClick={()=>handleRestartRTUConnection(true)} />
                                             <Button value={`${StausRTU} Connection`} danger={RTUStatus.rtu_status === 'running'} onClick={()=>handleStartRTUConnection(StausRTU)} />
                                         </React.Fragment>
                                        }
                                       {
                                             page === 'TCP' && 
                                             <React.Fragment>
                                             <Button type="ghost" value={'Restart'} onClick={()=>handleRestartTCPConnection(true)} />
                                             <Button value={`${StausTCP} Connection`} danger={TCPStatus.tcp_status === 'running'} onClick={()=>handleStartTCPConnection(StausTCP)} />
                                         </React.Fragment>
                                        }
                                    </div>

                                </React.Fragment>
                        }

                    </div>
                    {
                        page === 'home' &&  rawDatas.length > 0 && 
                        <div className="gap-2 flex items-center p-4 h-12 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark justify-end ">
                            <div className="flex items-center gap-2">
                                <ClickAwayListener className='h-8' onClickAway={clickAwaySearch}>
                                    {renderSearchBox()}
                                </ClickAwayListener>
                                <Tag mono icon={Tag_icon} stroke={!isActive ? "#30A46C" : "#FFF7F7"} bordercolor={{ border: "1px solid #30A46C" }} style={{ color: !isActive ? "#30A46C" : "#FFF7F7", backgroundColor: isActive ? "#30A46C" : (currTheme === 'dark' ? "#111111" : "#FFF"), textAlign: "-webkit-center", cursor: "pointer" }} name={`${t('Active')}: ${activeCount}`} onClick={() => { setisActive(!isActive) }} />
                                <Tag mono icon={Tag_icon} stroke={!isInactive ? "#CE2C31" : "#FFF7F7"} bordercolor={{ border: "1px solid #CE2C31" }} style={{ color: !isInactive ? "#CE2C31" : "#FFF7F7", backgroundColor: isInactive ? "#CE2C31" : (currTheme === 'dark' ? "#111111" : "#FFF"), textAlign: "-webkit-center", cursor: "pointer" }} name={`${t('Inactive')}: ${InactiveCount}`} onClick={() => { setisInactive(!isInactive) }} />
                            </div>

                        </div>
                    }

                    <div className={` ${page === "home" ? (GateWayDataList.length > 0 ? "h-[93vh]" : "h-[86vh]") : "h-[93vh]"} overflow-y-auto bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark`}>
                        {
                            page === 'home' ?
                                <React.Fragment>

                                    {(GateWayDataList.length > 0) ? (
                                        // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                        <Grid container spacing={4} style={{ padding: "16px" }}>
                                            {/* <Grid item xs={3} > */}

                                            <React.Fragment>
                                                {GateWayDataList.map((gateway) => {
                                                    // console.log(gateway); // Corrected spelling to `gateway`
                                                    return (
                                                        <Card
                                                            data={gateway}
                                                            key={gateway.id} // Use a unique key
                                                            id={gateway.id}
                                                            name={gateway.iid}
                                                            isactive={gateway.location}
                                                            totalintrument={gateway.instrument_id.length}
                                                            lastsyncedts={gateway.created_ts}
                                                            istrument={gateway.instrument_id}
                                                            handleEditOpen={handleDialogEdit}
                                                            handleDetele={deleteGateWay}
                                                            handleGateWayClick={handleGateWayClick}
                                                            handleTriggerRows={handleTriggerRows}
                                                        />
                                                    );
                                                })}
                                            </React.Fragment>

                                        </Grid>
                                        // </Grid>
                                    ) : (<div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark  p-4 overflow-y-auto flex items-center justify-center min-h-[93vh]' >
                                        <Grid item xs={12} style={{ textAlign: "center", display: 'block', padding: 16 }}>
                                            <span
                                                style={{
                                                    color: theme.colorPalette.primary,
                                                    fontSize: "1rem",
                                                    fontFamily: "Inter, sans-serif",
                                                    fontWeight: "400",
                                                    display: 'block'
                                                }}>
                                                {" "}
                                                {t("Nogateway")}<br />{t("clickme")}
                                                <a
                                                    href="# "
                                                    style={{ color: "#0085FF" }}
                                                    id="AddGateway"
                                                    onClick={handleNewgateway}>
                                                    {t("AddGateway")}
                                                </a>
                                                {t("button")}
                                            </span>
                                        </Grid>

                                       
                                    </div>)}
                                </React.Fragment>


                                :

                                <React.Fragment>
                                    <Gatewaypage 
                                    GateWayInstrument={GateWayInstrument}
                                    handleActiveIndex={(e)=>handleActiveIndex(e)}
                                    setisProtocolpage={(e)=>{setisProtocolpage(e)}}
                                    page={page} setprotocolName={(e)=>{setprotocolName(e)}}
                                    setpage={(e)=>setpage(e)} 
                                    GateWayId={GateWayId}
                                    GateWayPath={GateWayPath}
                                    ref={GateWayPageRef}
                                    GateWayInstrumentID={SelectedgateWayData && SelectedgateWayData.gateway_instrument}
                                    TCPStatus={TCPStatus}
                                    RTUStatus={RTUStatus}
                                    SelectedgateWayData={SelectedgateWayData}
                                    
                                    />
                                    
                                </React.Fragment>

                        }

                    </div>
                </Grid>
            </Grid>
            <ModalNDL open={isDeleteModel} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Unable to Delete Gateway`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'You cannot delete the gateway while the service is running. Please stop the service before attempting to delete the gateway.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Close'} type='secondary' onClick={()=>handleCloseDelete()} />
        </ModalFooterNDL>
      </ModalNDL>
      <ModalNDL open={isStopGateway} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Stop Gateway`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'Are you sure you want to stop the gateway? All ongoing data transfers will be paused.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Cancel'} type='secondary' onClick={()=>handleCloseGatewayStopDilog()} />
          <Button value={'Stop'} danger onClick={()=>handleStopGateway()} />

        </ModalFooterNDL>
      </ModalNDL>

      <ModalNDL open={isRestartGateway} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Restart Gateway`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'Are you sure you want to restart the gateway? This action may temporarily disrupt data communication.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Cancel'} type='secondary' onClick={()=>handleCloseGatewayRestartDilog()} />
          <Button value={'Restart'}  onClick={()=>handleRestartGateway()} />

        </ModalFooterNDL>
      </ModalNDL>
      <ModalNDL open={isStopRtu} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Stop Connection`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'Are you sure you want to stop the connection? All ongoing data transfers will be paused.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Cancel'} type='secondary' onClick={()=>handleCloseTcpDilog(true)} />
          <Button value={'Stop'} danger onClick={()=>handleStopTcp()} />

        </ModalFooterNDL>
      </ModalNDL>
      <ModalNDL open={isStopTcp} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Stop Connection`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'Are you sure you want to stop the connection? All ongoing data transfers will be paused.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Cancel'} type='secondary' onClick={()=>handleCloseTcpDilog()} />
          <Button value={'Stop'} danger onClick={()=>handleStopTcp(true)} />

        </ModalFooterNDL>
      </ModalNDL>
      <ModalNDL open={isRestartRTU} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Restart Connection`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'Are you sure you want to restart the RTU protocol? This action may temporarily disrupt data communication.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Cancel'} type='secondary' onClick={()=>setisRestartRTU(false)} />
          <Button value={'Restart'}  onClick={()=>handleRestartRTUConnection(false)} />

        </ModalFooterNDL>
      </ModalNDL>
      <ModalNDL open={isRestartTCP} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL
            variant="heading-02-xs"
            value={`Restart Connection`}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={'Are you sure you want to restart the TCP protocol? This action may temporarily disrupt data communication.'}
            variant="paragraph-s"
            color='secondary'
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button value={'Cancel'} type='secondary' onClick={()=>setisRestartTCP(false)} />
          <Button value={'Restart'}  onClick={()=>handleRestartTCPConnection(false)} />

        </ModalFooterNDL>
      </ModalNDL>


        </React.Fragment>
    );
}