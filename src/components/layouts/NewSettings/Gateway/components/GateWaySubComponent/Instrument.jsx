/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import "components/style/instrument.css";
import EnhancedTable from "components/Table/Table";
import useRealInstrumentList from "components/layouts/Settings/Instrument/Hooks/useRealInstrumentList.jsx";
import AddInstrument from "./components/instrumentModel/instrumentModel";
import LoadingScreenNDL from "LoadingScreenNDL"; 

//Hooks
import useInstrumentCategory from "Hooks/useInstrumentCategory";
import useParameterList from "components/layouts/Settings/Instrument/Hooks/useParameterList.jsx";
import { useTranslation } from 'react-i18next';
import useInstrumentClass from 'components/layouts/Settings/Instrument/Hooks/useInstrumentClass.jsx';
import useGetInstrumentConfig from "./components/instrumenthooks/useGetInstrumentConfig";
import useLineConnectivity from "components/layouts/Line/hooks/useLineConnectivity";
import configParam from "config";
import Tag from 'components/Core/Tags/TagNDL'; 
import StatusNDL from 'components/Core/Status/StatusNDL'
import useGetDeviceRunning from "./components/instrumenthooks/instrumentHooks/useGetDeviceRunning";




export default function Instrument(props) {
    const { t } = useTranslation();
    const AddInstrumentref = useRef()
    const [headPlant] = useRecoilState(selectedPlant);
    const [categories, setCategories] = useState([]);
    const [iso,setIso] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false)
    //table pagination and search
    const [, setSearch] = useState("");// NOSONAR 
    const [, setTotCount] = useState(0);// NOSONAR 
    const [tabledata, setTableData] = useState([])// NOSONAR 
    const [GateWayConfigData,setGateWayConfigData] = useState([])
    const [,setMeterData] = useState([])// NOSONAR 
    const [MeterUpdateStatus,setMeterUpdateStatus] = useState({})
    const [rawInstrumentData ,setrawInstrumentData] = useState([])
    const { realInstrumentListLoading, realInstrumentListData, realInstrumentListError, getRealInstrumentList } = useRealInstrumentList()
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
    const { ParameterListLoading, ParameterListData, ParameterListError, getParameterList } = useParameterList()
    const { InstrumentClassLoading, InstrumentClassData, InstrumentClassError, getInstrumentClass } = useInstrumentClass();
    const { GateWayInstrumentConfigLoading, GateWayInstrumentConfigData, GateWayInstrumentConfigError,getGateWayInstrumentConfig} = useGetInstrumentConfig()
    const { LineConnectivityLoading, LineConnectivityData, LineConnectivityError, getLineConnectivity } = useLineConnectivity() 
    const {DeviceRunningLoading, DeviceRunningData, DeviceRunningError, getDeviceRunning } = useGetDeviceRunning()
    const [tcplist,settcplist] = useState([])
    const [rtulist,setrtulist] = useState([])

    useEffect(()=>{
        if(!InstrumentClassLoading && InstrumentClassData && !InstrumentClassError){
        setIso(InstrumentClassData);
    }
    },[InstrumentClassLoading, InstrumentClassData, InstrumentClassError,])

    useEffect(()=>{
        getLineConnectivity({schema: headPlant.schema,lineId :headPlant.id })

    },[headPlant])

    useEffect(()=>{
        getGateWayInstrumentConfig(props.GateWayId)// NOSONAR 
    },[props.GateWayId])// NOSONAR 

    useEffect(()=>{
        getDeviceRunning({path:props.path,protocol:"tcp",port:":5000/",endurl:"/devices_running/"})// NOSONAR 
        getDeviceRunning({path:props.path,protocol:"rtu",port:":5000/",endurl:"/devices_running/"})// NOSONAR 
    },[props.path])// NOSONAR 
// NOSONAR - This function requires multiple parameters due to its specific use case.
    useEffect(()=>{// NOSONAR 
        if(!LineConnectivityLoading &&  LineConnectivityData &&  !LineConnectivityError){
            if(LineConnectivityData.data){
                // setLoading(true)
                setMeterData(LineConnectivityData.data.meter_data?LineConnectivityData.data.meter_data:[]);
                setMeterUpdateStatus(LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[]);
                console.log(LineConnectivityData.data.meter_data?LineConnectivityData.data.meter_data:[],
                    LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[],
                    "RwaData"
                )
            }else{
                setLoading(false)
                setMeterData([]);
                setMeterUpdateStatus([]);
            }        
            

        }

    },[LineConnectivityLoading, LineConnectivityData, LineConnectivityError,])
    

    useEffect(()=>{
    if(!GateWayInstrumentConfigLoading &&  GateWayInstrumentConfigData && !GateWayInstrumentConfigError){
        setGateWayConfigData(GateWayInstrumentConfigData)
    }
    },[GateWayInstrumentConfigLoading, GateWayInstrumentConfigData, GateWayInstrumentConfigError])

    useEffect(()=>{
        if(!DeviceRunningLoading &&  DeviceRunningData &&  !DeviceRunningError){

            console.log("DeviceRunningData",DeviceRunningData)
            if(DeviceRunningData && DeviceRunningData.protocol === "tcp"){
                settcplist(DeviceRunningData.data)
            }
            if(DeviceRunningData && DeviceRunningData.protocol === "rtu"){
                setrtulist(DeviceRunningData.data)

            }


        }
    },[DeviceRunningLoading, DeviceRunningData, DeviceRunningError])

    const headCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
            width:100
        },
        {
            id: 'Instrument ID',
            numeric: false,
            disablePadding: true,
            label: t('Instrument ID'),
            width:130
        },
        {
            id: 'Name',
            numeric: false,
            disablePadding: false,
            label:'Name',
            width:160
        },
        {
            id: 'Category',
            numeric: false,
            disablePadding: false,
            label: 'Category',
            width:200
        },
        {
            id: 'Type',
            numeric: false,
            disablePadding: false,
            label: 'Type',
            width:160
        },
        {
            id: 'Mode',
            numeric: false,
            disablePadding: false,
            label:'Mode',
            width:160
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: false,
            label:'Status',
            width:160
        },
        

    ];


    const processedrows = () => {
        let temptabledata = []; 

        if (realInstrumentListData && realInstrumentListData.length > 0) {
            const  finalData = realInstrumentListData.map(x=>{
                let instrumentFreq = []
                if(MeterUpdateStatus[x.id] !== undefined){
                    if(x.instruments_metrics.length > 0){
                      instrumentFreq = x.instruments_metrics.map(freq=>freq.frequency)
                      let min = instrumentFreq.length > 0 ? (configParam.MODE(instrumentFreq) * 3) : 0;
                      let LA = new Date(MeterUpdateStatus[x.id]);
                      let CT = new Date();
                      let diff = CT - LA;
                      let Status = diff < (Math.max(min, 3600) * 1000);
                      if(!Status || (props.SelectedgateWayData && props.SelectedgateWayData.Service && props.SelectedgateWayData.Service !== 'Running')){// NOSONAR 
                        return {...x,lastActive:MeterUpdateStatus[x.id],status:"Inactive"}

                      }else{
                        return {...x,lastActive:MeterUpdateStatus[x.id],status:"Live"}
                      }
                    }

                }else{
                    return x
                }
            })
            let gatewayInstu = finalData.filter(x=>x && props.GateWayInstrument.includes(x.id))// NOSONAR 
            gatewayInstu = gatewayInstu.map((k)=>{
                const rtulists = rtulist.find(x=>x.MQTT_IID == k.id)
                const tcplists = tcplist.find(x=>x.MQTT_IID == k.id)
                if(rtulists){
                    return {...k,config:rtulists,protocol:"rtu"}
                }else if(tcplists){
                    return {...k,config:tcplists,protocol:"tcp"}
                }else{
                    return k
                }
            })
            console.log(gatewayInstu,"gatewayInstu")
            setrawInstrumentData(gatewayInstu)
            temptabledata = temptabledata.concat(gatewayInstu.map((val, index) => {// NOSONAR 
            //    let instrumentConfig = GateWayConfigData.find(x=>x.instrument_id === val.id )
                if (val) {
                    return [
                        index + 1, 
                        val.id ? val.id : 0,
                        val.name ? val.name : "",
                        val.instrument_category ? val.instrument_category.name : "",
                        val.instrumentTypeByInstrumentType ? val.instrumentTypeByInstrumentType.name : "",
                        <Tag name={val.is_offline ? t("Offline") : t("Online")} colorbg={val.is_offline ? 'error' :"success"} lessHeight/>,// NOSONAR 
                        val.status? 
                        <StatusNDL
                        lessHeight
                            colorbg={val.status === "Inactive" ? "error-alt" : "success-alt"}
                            name={val.status}
                        /> : "--", 
                           
                       

                    ];
                } else return [];
            }));
        }
    
        setTableData(temptabledata);
        setLoading(false);
    };

    useEffect(() => {

        setLoading(true)
        getInstrumentFormulaList()
        fetchCategoriesAndInstrumentType()
        getInstrumentClass()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant]);

    function getInstrumentFormulaList() {
        if (headPlant) getRealInstrumentList(headPlant.id)
    }

    useEffect(() => {

        if (!realInstrumentListLoading && !realInstrumentListError && realInstrumentListData && Object.keys(MeterUpdateStatus).length > 0) {
            processedrows()
            setTotCount(realInstrumentListData.filter(x=>props.GateWayInstrument.includes(x.id)).length)// NOSONAR 
            setSearch("")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realInstrumentListLoading, realInstrumentListData, realInstrumentListError,GateWayConfigData,MeterUpdateStatus,rtulist || tcplist,props.SelectedgateWayData])// NOSONAR 


    useEffect(() => {

        if (!InstrumentCategoryListLoading && !InstrumentCategoryListError && InstrumentCategoryListData) {
            setCategories(InstrumentCategoryListData)
        }
        else {
            setCategories([])
        }
    }, [InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError])


    useEffect(() => {

        if (!ParameterListLoading && !ParameterListError && ParameterListData) {
            setMetrics(ParameterListData)
        }

    }, [ParameterListLoading, ParameterListData, ParameterListError])

 

    function getCategoriesList() {
        getInstrumentCategory()

    }



    function getMetricList() {
        getParameterList()

    }

    function fetchCategoriesAndInstrumentType() {
        getCategoriesList();
        getMetricList();
    }


    const handleFormulaCrudDialogEdit = (id, data) => {
        AddInstrumentref.current.handleFormulaCrudDialogEdit(id, data)
       
    }

    const handleFormulaCrudDialogDelete=(id, data)=>{
        AddInstrumentref.current.handleFormulaCrudDialogDelete(id, data)

    }

    const handlegetGateWayInstrumentConfig = ()=>{
        // getGateWayInstrumentConfig(props.GateWayId)
        getDeviceRunning({path:props.path,protocol:"tcp",port:":5000/",endurl:"/devices_running/"})// NOSONAR 
        getDeviceRunning({path:props.path,protocol:"rtu",port:":5000/",endurl:"/devices_running/"})// NOSONAR 
    }
    // console.log(tabledata,"tabledata",realInstrumentListData)

    
    return (
        <React.Fragment>
            {loading && <LoadingScreenNDL />}
            <div style={{ padding: 16 }}>
                <AddInstrument
                    ref={AddInstrumentref}
                    getInstrumentFormulaList={getInstrumentFormulaList}
                    categories={categories}
                    isostandard={iso}
                    metrics={metrics}
                    GateWayId={props.GateWayId}// NOSONAR 
                    path={props.path}// NOSONAR 
                    GateWayConfigData={GateWayConfigData}
                    getGateWayInstrumentConfig={handlegetGateWayInstrumentConfig}
                    rtulist ={rtulist}
                    tcplist={tcplist}
                    
                    
                />
                <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    download={true}
                    search={true}
                    actionenabled={true}
                    rawdata={rawInstrumentData}
                    handleEdit={(id, value) => handleFormulaCrudDialogEdit(id, value)}
                    handleDelete={(id, value) => handleFormulaCrudDialogDelete(id, value)}
                    enableEdit={true}
                    enableDelete={true}
                    // rowSelect={true}
                    tagKey={['Mode','Status']}
                    // checkBoxId={"Instrument ID"}
                    disableDelete
                />


            </div>
        </React.Fragment>
    )
}