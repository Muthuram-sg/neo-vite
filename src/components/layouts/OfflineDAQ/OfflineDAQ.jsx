import React, { useState,useEffect, useRef} from 'react';
import {useParams,useLocation} from "react-router-dom"//NOSONAR
import { useNavigate } from 'react-router-dom';//NOSONAR
import  useTheme from "TailwindTheme";
import useOfflineInstrumentList from './Hooks/useOfflineInstrumentList';
import {currentPage, selectedPlant, snackToggle, snackMessage, snackType,metricsArry,oeeAssets,ErrorPage } from "recoilStore/atoms"; 
import { useRecoilState } from "recoil";
import AddOfflineData from './AddOfflineData'; 
import useFetchOffline from './Hooks/useFetchOffline';
import useDeleteOffline from './Hooks/useDeleteOffline';
import OfflineFileUpload from './offlineFileUploadModel';
import moment from 'moment';
import { useTranslation } from 'react-i18next'; 
import DatePickerNDL from 'components/Core/DatepickerNDL'; 
import Dialog from 'components/Core/ModalNDL/index';
import DialogTitle from 'components/Core/ModalNDL/ModalHeaderNDL';
import DialogContent from 'components/Core/ModalNDL/ModalContentNDL';
import DialogActions from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL  from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL'; 
import LoadingScreen from "LoadingScreenNDL"
import Breadcrumbs from "components/Core/Bredcrumbs/BredCrumbsNDL";
import useMeterReadingsV2 from '../Explore/BrowserContent/hooks/useMeterReadingsV2';

const EnhancedTable = React.lazy(() => import("components/Table/Table"))
const FileSaver = require('file-saver');
const Excel = require("exceljs");
function OfflineDAQ(props){
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    const { t } = useTranslation();
    const theme = useTheme();
    const offlineRef = useRef();
    const [listArray, setListArray] = useState([
        { index: "", name: "Offline Instrument" },
      ]);
    const [tabledata,setTableData] = useState([]);

    const [pageidx,setPageidx] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [headPlant] = useRecoilState(selectedPlant);
    const [fields] = useState([]);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [oeeAssetsArray] = useRecoilState(oeeAssets);
    const [,setErrorPage] = useRecoilState(ErrorPage);

    const [isDataView,setIsDataView] = useState(false);
    const [currentInstrument,setCurrentInstrument] = useState("");
    const [offlineTableData,setOfflineTableData] = useState([]);
    const [from,setFrom] = useState(new Date());
    const [to,setTo] = useState(new Date());
    const [instrumentID,setInstrumentID] = useState('');
    const [frequencySec,setFrequency] = useState(0);
    const [deleteKey,setDeleteKey] = useState("");
    const [deleteTime, setDeleteTime] = useState("");
    const [deleteDialog,setDeleteDialog] = useState(false);
    const [selectedInstrumentMetrics,setSelectedInstrumentMetrics] = useState([]);

  const [metricsList] = useRecoilState(metricsArry);
  let {moduleName,queryParam} = useParams()
    const [dataCells,setDataCells] = useState( [        
        {
            id: 'index',
            numeric: false,
            disablePadding: true,
            label: t("SNo"),
            width:100            
        },
        {
            id: 'time',
            numeric: false,
            disablePadding: true,
            label: t("Updatedon"), 
            width:120              
        },
        {
            id: 'key',
            numeric: false,
            disablePadding: true,
            label: t("Metrics"),  
            width:120           
        },
        {
            id: 'value',
            numeric: false,
            disablePadding: true,
            label: t("Value"), 
            width:120            
        },
        {
            id: 'shift',
            display:  "none",
            numeric: false,
            disablePadding: true,
            label: t("Shift"), 
            width:120            
        }

    ])
    const fileUploadRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    let range = queryParams.get('range')
    const [, setCurPage] = useRecoilState(currentPage);
    const { offlineInstrumentListLoading, offlineInstrumentListData, offlineInstrumentListError, getofflineInstrumentList } = useOfflineInstrumentList()
    const { fetchOfflineLoading, fetchOfflineData, fetchOfflineError, getfetchOffline } = useFetchOffline()
    const { DeleteOfflineLoading, DeleteOfflineData, DeleteOfflineError, getDeleteOffline } = useDeleteOffline();
    const { meterReadingsV2Loading, meterReadingsV2Data, meterReadingsV2Error, getMeterReadingsV2 }= useMeterReadingsV2()
    const headCells = [
        {
            id: 'S.NO',
            numeric: false,
            disablePadding: true,
            label:  t("SNo"),
            width:100
        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: true,
            label:  t("Asset"),
            width:100
        },
        {
            id: 'INSTRUMENT ID',
            numeric: false,
            disablePadding: true,
            label: t("Instrumentid"),
            width:150
        },
        {
            id: 'INSTRUMENT NAME',
            numeric: false,
            disablePadding: false,
            label: t("Instrumentname"),
            width:150
        },
        {
            id: 'METRICS',
            numeric: false,
            disablePadding: false,
            label: t('Metrics'),
            width:100
        }, 
        {
            id: 'CATEGORY',
            numeric: false,
            disablePadding: false,
            label: t('Category'),
            width:150
        },
        {
            id: 'TYPE',
            numeric: false,
            disablePadding: false,
            label:t('Type'),
            width:100
        },
        {
            id: 'FREQUENCY',
            numeric: false,
            disablePadding: false,
            label: t("Frequency"),
            width:150
        },
        {
            id: 'UPDATED BY',
            numeric: false,
            disablePadding: false,
            label: t("UpdatedBy"),
            width:150
        },
        {
            id: 'UPDATED ON',
            numeric: false,
            disablePadding: false,
            label: t("Updatedon"),
            width:150
        },{
            id: 'Most Recent Data Points',
            numeric: false,
            disablePadding: true,
            label:  t("Most Recent Data Points"),
            width:250
        },

    ];
   

    useEffect(() => {
        setCurPage("offline");
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    useEffect(() => {  
        getofflineInstrumentList(headPlant.id) 
        setIsDataView(false);
        setCurrentInstrument({});
        getMeterReadingsV2(headPlant.schema,headPlant.id,true)
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant]);
    useEffect(()=>{
        if(!DeleteOfflineLoading && !DeleteOfflineError && DeleteOfflineData){
            getfetchOffline(headPlant.schema,instrumentID,from,to,frequencySec,selectedInstrumentMetrics);
            handleSnackBar('success',t('Offline data deleted'));
            handleCloseDialog();
        }
        if(!DeleteOfflineLoading && DeleteOfflineError && !DeleteOfflineData){
            handleSnackBar('error',t('Offline data delete failed'));
            handleCloseDialog();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DeleteOfflineLoading,DeleteOfflineError,DeleteOfflineData])
    useEffect(() => {
      
        if (!offlineInstrumentListLoading && !offlineInstrumentListError && offlineInstrumentListData) {
            processedrows() 
            console.log(offlineInstrumentListData.filter(x=>x.entity_instruments.length > 0),"datadata")
            if (moduleName === "add" && queryParam && (queryParam.includes('=') || queryParam.includes('&'))) {
                // Split the query string at '&' to separate each key-value pair
                const paramsArray = queryParam.split('&'); 
                            
                // Create an empty object to store the values
                const queryParams = {};
                
                // Iterate over the array and split each key-value pair
                paramsArray.forEach(param => {   
                    const [key, value] = param.split('=');   
                    queryParams[key] = value;
                });
                
                // Extracting the respective values
                const instrument = queryParams['instrument'];
                const range = queryParams['range'];
            
            
                const filteredData = offlineInstrumentListData.filter(data => data.name === instrument);
            
                // Check if filteredData exists and has an element
                if (filteredData.length > 0) {
                    if(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(range)){
                        offlineRef.current.openDialog('add', '', filteredData[0], '', range);
                    }
                    else{
                        setErrorPage(true)
                    }
                   
                } else {
                   setErrorPage(true)
                    console.log("No matching instrument found in offlineInstrumentListData");
                }
            } 
            
            else if(moduleName === "view" && queryParam.includes('=') && !queryParam.includes('all') ){
            //    console.log(queryParam,"ins")
                // Split the query string at '&' to separate each key-value pair
                    const paramsArray = queryParam.split('&'); 
                    
                    // Create an empty object to store the values
                    const queryParams = {};
                    
                    // Iterate over the array and split each key-value pair
                    paramsArray.forEach(param => {   
                        const [key, value] = param.split('=');   
                        queryParams[key] = value;
                 });
                    
                    // Extracting the respective values
                    const instrument = queryParams['instrument'];
                    // console.log(instrument,"ins")
                const filteredData1 = offlineInstrumentListData.filter(data => data.name === instrument)
                // console.log(filteredData1[0],"filteredData1[0]")

                if(filteredData1[0] && filteredData1[0].id && headPlant && headPlant.schema){
                    setCurrentInstrument(filteredData1[0])
                    processedrows1();
                    setIsDataView(true);            
                    let fromvalue = moment().subtract(24,'hours').format('YYYY-MM-DDTHH:mm:ss'),tovalue = moment().format('YYYY-MM-DDTHH:mm:ss');
                    let frequency = 0;
                    if(filteredData1[0].instruments_metrics && filteredData1[0].instruments_metrics[0] && filteredData1[0].instruments_metrics[0].frequency){
                        if(filteredData1[0].instruments_metrics[0].frequency === 3600){
                            frequency = 3600;
                        }else if(filteredData1[0].instruments_metrics[0].frequency === 86400){
                            frequency = 86400;
                            fromvalue = moment().subtract(6,'days').format('YYYY-MM-DDTHH:mm:ss')
                        }else if(filteredData1[0].instruments_metrics[0].frequency === 2628288){
                            frequency = 2628288;
                            fromvalue = moment().subtract(6,'months').format('YYYY-MM-DDTHH:mm:ss')
                        }else if(filteredData1[0].instruments_metrics[0].frequency === 31536000){
                            frequency = 31536000;
                            fromvalue = moment().subtract(1,'year').format('YYYY-MM-DDTHH:mm:ss')
                        }else if(filteredData1[0].instruments_metrics[0].frequency === 2){
                            frequency = 2;
                            fromvalue = moment().subtract(6,'days').format('YYYY-MM-DDTHH:mm:ss')
                        }
                    }
                    let newheadCells = [];
                    if(frequency === 2){
                        newheadCells = dataCells.map(p => {
                            if (p.id === "shift") {
                              return Object.assign({}, p, { "display": 'block', "hide": false })//NOSONAR
                            } else {
                                return Object.assign({}, p)//NOSONAR
                            }
                        });
                    }else{
                        newheadCells = dataCells.map(p => {
                            if (p.id === "shift") {
                              return Object.assign({}, p, { "display": 'none', "hide": true })//NOSONAR
                            } else {
                                return Object.assign({}, p)//NOSONAR
                            }
                        });
                    } 
                    let selectedInstrumentMetrics = filteredData1?.[0]?.instruments_metrics?.map(x => x?.metric?.title) || [];
                    getfetchOffline(headPlant.schema,filteredData1[0].id,fromvalue,tovalue,frequency,selectedInstrumentMetrics);
                    setDataCells(newheadCells);
                    setFrom(fromvalue);
                    setTo(tovalue);
                    setInstrumentID(filteredData1[0].id);
                    setSelectedInstrumentMetrics(selectedInstrumentMetrics)
                    setFrequency(frequency); 
                 }else{
                    // handleSnackBar('error',t("Fetching offline data is failed"))
                    if(instrument !== 'all'){//NOSONAR
                        setErrorPage(true)
                    }
                   
                 }
            }
            else if(moduleName) {
                setErrorPage(true)
                console.log("Invalid or missing queryParam:", queryParam);
            }
          
            //prepareDownloadTemplate()
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offlineInstrumentListLoading, offlineInstrumentListData, offlineInstrumentListError,moduleName,queryParam,range,meterReadingsV2Data])
    useEffect(() => {

        if (!fetchOfflineLoading && !fetchOfflineError && fetchOfflineData) {
            processedrows1();
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchOfflineLoading, fetchOfflineData, fetchOfflineError])
    // useEffect(() => {

    //     if (!fetchSingleLoading && !fetchSingleError && fetchSingleData) { 
    //         offlineRef.current.openDialog('edit',currentDataTime,currentInstrument,fetchSingleData);
    //     } 
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [fetchSingleLoading, fetchSingleData, fetchSingleError]) 
    // useEffect(()=>{ 
    //     getfetchOffline(headPlant.schema,instrumentID,from,to,frequencySec);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[from,to])
    const showFrequency = (freq) =>{
        if(freq === 3600){
            return "Hourly";
        }else if(freq === 86400){
            return "Daily";
        }else if(freq === 2628288){
            return "Monthly";
        }else if(freq === 31536000){
            return "Yearly";
        }else if(freq === 2){
            return "Shift"
        }else{
            return "None"
        }
    }

    const renderEntityName = (entity) => {
        if(entity.length > 0){
            return entity.map((val,index) => {
                if(val && val.entity_instruments && Object.keys(val.entity_instruments).length > 0&&val.entity_instruments.name){
                    return val.entity_instruments.name
                }else{
                    return ""
                }
            }).join(', ')

        }else{
            return "-"
        }
    }


    const getMostRecentDataTime = (data, id) => {
        if (!data || !data[id] || Object.keys(data[id]).length === 0) {
          return "No data available";
        }
       
        const times = Object.values(data[id])
          .map(item => item?.time ? new Date(item.time) : null)
          .filter(date => date instanceof Date && !isNaN(date));
       
        if (times.length === 0) return "No data available";
       
        const maxTime = new Date(Math.max(...times));
        return moment(maxTime).format('DD-MM-YYYY HH:mm:ss');
      };

    const processedrows = () => {
        let temptabledata = []
        if (offlineInstrumentListData && offlineInstrumentListData.length > 0 ) {
            const UpdatedofflineInstrumentListData = offlineInstrumentListData.map((val) => {
                return{
                    ...val,
                    mostrecentData:getMostRecentDataTime(meterReadingsV2Data, val.id)
                }

            })
            temptabledata = temptabledata.concat(UpdatedofflineInstrumentListData.map((val, index) => {
                if (val){
                return [index+1,
                    renderEntityName(val.entity_instruments) ? renderEntityName(val.entity_instruments) : "-",
                    val.id ? val.id : 0,
                     val.name ? val.name : "", 
                     val.instruments_metrics ? val.instruments_metrics.map(x => { return x["metric"] }).map(x => { return x["title"] }).join(', '):"", 
                     val.instrument_category?val.instrument_category.name : "", 
                     val.instrumentTypeByInstrumentType ?val.instrumentTypeByInstrumentType.name : "",
                     val.instruments_metrics && val.instruments_metrics.length > 0? showFrequency(val.instruments_metrics[0].frequency): "",
                     val.userByUpdatedBy ?  val.userByUpdatedBy.name : "",val.updated_ts? moment(val.updated_ts).utcOffset(stdOffset).format("DD-MM-YYYY HH:mm:ss"): "",
                     val.mostrecentData ? val.mostrecentData : "-"]
                }
                else return []
            })
            )
        }
        setTableData(temptabledata)  
    }

    const handleDownloadTemplate = ()=>{ 
        // console.log('yes')
        offlineRef.current.openDialog('template','','','');
    }

    const prepareDownloadTemplate = (instrumentTypeId) =>{
        if(offlineInstrumentListData && offlineInstrumentListData.length > 0){
            let dataDonwload = []
            offlineInstrumentListData.forEach(x => {
                if (x.instrument_type === instrumentTypeId) {
                    const iid = x.id;
                    const instrument_name = x.name ? x.name : "";
                    const instrument_category = x.instrument_category ? x.instrument_category.name : "";
                    const instrument_type = x.instrumentTypeByInstrumentType ? x.instrumentTypeByInstrumentType.name : "";
                    const metrics = x.instruments_metrics ? x.instruments_metrics : [];
                    if (metrics.length > 0) {
                        let metricsArr = [];
                        metrics.forEach(y => {
                            let metricObj = { iid: iid };
                            metricObj['instrument_name'] = instrument_name
                            metricObj['metric_name'] = y.metric && y.metric.name ? y.metric.name : '';
                            metricObj['metric_title'] = y.metric && y.metric.title ? y.metric.title : '';
                            metricObj['data'] = '';
                            metricObj['date(YYYY-MM-DD HH:mm)'] = '';
                            metricObj['category'] = instrument_category
                            metricObj['type'] = instrument_type;
                            metricObj['frequency'] = showFrequency(y.frequency)
                            metricsArr.push(metricObj);
                        })
                        dataDonwload = [...dataDonwload, ...metricsArr];
                    }
                }
            }) 

            if(dataDonwload.length > 0){
                downloadTemplateExcel(dataDonwload)
            }
            else{
                handleSnackBar('info',t("No Offline Instruments for the Type"))
            }
        }
        else{
            console.log("No res for offlineInstrumentListData")
        }
    }
    const processedrows1 = () => {
        let temptabledata = []
        let metriclistData = offlineInstrumentListData.length > 0 && offlineInstrumentListData.map(item=>item.instruments_metrics).length > 0  ? 
        offlineInstrumentListData.map(item=>item.instruments_metrics.map(metric => { return metric["metric"] }).map(metric => { return metric})).flat() : [] 
        // console.log(metriclistData,"offlineInstrumentListData",metriclistData.filter(x=>x.name === "velocity_rms_y_lh" && metricsList.filter(y=>y.id === x.id)))
        if (fetchOfflineData && fetchOfflineData.length > 0) {
            temptabledata = temptabledata.concat(fetchOfflineData.map((val, index) => { 
                if (val){                    
                    const metArr = metriclistData ?metriclistData.filter(x=>x.name === val.key && metricsList.filter(y=>y.id === x.id)):[];
                return frequencySec===2?[index+1,val.time ? moment(val.time).utcOffset(stdOffset).format("DD-MM-YYYY HH:mm:ss") : "",val.key,val.value,val.shift?val.shift:'-']:[index+1,val.time ? moment(val.time).utcOffset(stdOffset).format("DD-MM-YYYY HH:mm:ss") : "",metArr && metArr.length>0?metArr[0].title: "--",val.value]
                }
                else return []
            })
            )
        }
        // console.log(temptabledata,"temptabledata")
        setOfflineTableData(temptabledata)  
    }
    const handleSnackBar  =(type,message) =>{
        SetType(type);SetMessage(message);setOpenSnack(true);
    }
    const handleAdd = (id,value)=>{  
        // console.log(id,value,"valvalval")
        offlineRef.current.openDialog('add','',value);
    }

    
    const handleView = (id,value)=>{
         if(value && value.id && headPlant && headPlant.schema){
            setCurrentInstrument(value)
            setListArray([
                { index: 0, name: "Offline Instrument" },
                { index: 1, name: value.name },
              ]); 
            processedrows1();
            // console.log("enter")
            setIsDataView(true);  
            props.hideTab("disable"); 
    
            let fromvalue = moment().subtract(24,'hours').format('YYYY-MM-DDTHH:mm:ss'),tovalue = moment().format('YYYY-MM-DDTHH:mm:ss');
            let frequency = 0;
            // console.log('value.instruments_metrics',value.instruments_metrics);
            if(value.instruments_metrics && value.instruments_metrics[0] && value.instruments_metrics[0].frequency){
                if(value.instruments_metrics[0].frequency === 3600){
                    frequency = 3600;
                }else if(value.instruments_metrics[0].frequency === 86400){
                    frequency = 86400;
                    fromvalue = moment().subtract(6,'days').format('YYYY-MM-DDTHH:mm:ss')
                }else if(value.instruments_metrics[0].frequency === 2628288){
                    frequency = 2628288;
                    fromvalue = moment().subtract(6,'months').format('YYYY-MM-DDTHH:mm:ss')
                }else if(value.instruments_metrics[0].frequency === 31536000){
                    frequency = 31536000;
                    fromvalue = moment().subtract(1,'year').format('YYYY-MM-DDTHH:mm:ss')
                }else if(value.instruments_metrics[0].frequency === 2){
                    frequency = 2;
                    fromvalue = moment().subtract(6,'days').format('YYYY-MM-DDTHH:mm:ss')
                }
            }
            let newheadCells = [];
            if(frequency === 2){
                newheadCells = dataCells.map(p => {
                    if (p.id === "shift") {
                      return Object.assign({}, p, { "display": 'block', "hide": false })//NOSONAR
                    } else {
                        return Object.assign({}, p)//NOSONAR
                    }
                });
            }else{
                newheadCells = dataCells.map(p => {
                    if (p.id === "shift") {
                      return Object.assign({}, p, { "display": 'none', "hide": true })//NOSONAR
                    } else {
                        return Object.assign({}, p)//NOSONAR
                    }
                });
            } 
            let selectedInstrumentMetrics = value?.instruments_metrics?.map(x => x?.metric?.title) || [];
            // console.log(selectedInstrumentMetrics,"selectedInstrumentMetrics")
            getfetchOffline(headPlant.schema,value.id,fromvalue,tovalue,frequency,selectedInstrumentMetrics);
            setDataCells(newheadCells);
            setFrom(fromvalue);
            setTo(tovalue);
            setInstrumentID(value.id);
            setSelectedInstrumentMetrics(selectedInstrumentMetrics)

            setFrequency(frequency); 
         }else{
            
            handleSnackBar('error',t("Fetching offline data is failed"))
         }
    }
    
    const handleEdit = (id,value)=>{
        if(currentInstrument && currentInstrument.id && value && value.time){
            // getfetchSingle(headPlant.schema,currentInstrument.id,value.time)
            offlineRef.current.openDialog('edit',value.time,currentInstrument,[value]);
        }
    }
   
    const downloadTemplateExcel =(dataDonwload) => {
        // Create workbook & add worksheet 
        if(dataDonwload && dataDonwload.length > 0){
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('ExampleSheet');
            worksheet.columns = [
                { header: 'Instrument_Id', key: 'iid' },
                { header: 'Instrument_Name', key: 'instrument_name' },
                { header: 'Metric_Name', key: 'metric_name' },
                { header: 'Metric_Title', key: 'metric_title' },
                { header: 'Data', key: 'data' },
                { header: 'Date(YYYY-MM-DD HH:mm)', key: 'date' ,style: { numFmt: '@' } },
                { header: 'Category', key: 'category' },
                { header: 'Type', key: 'type' },
                {header: 'Frequency', key: 'frequency'}
              ];

              const Metric_NameCol = worksheet.getColumn('C'); 
              Metric_NameCol.hidden = true; 

              worksheet.addRows(dataDonwload);
            workbook.xlsx.writeBuffer()
            .then(buffer => FileSaver.saveAs(new Blob([buffer]), `Offline_Instrument_Metrics_List_${moment(Date.now()).format('YYYY_MM_DD HH:mm:ss')}.xlsx`))
            .catch(err => console.log('Error writing excel export', err))

        }        
    }
    const openFileUpload = () =>{
        fileUploadRef.current.openDialog()
    }
    const createTask = (id,value) =>{ 
        navigate({
          pathname: '/neo/explore',
          search: '?instrument='+currentInstrument.name,
        });
    }
    const handleDelete = (id,value) =>{        
        setDeleteDialog(true)
        setDeleteKey(value.key);
        setDeleteTime(value.time);
    }
    const handleCloseDialog = () =>{
        setDeleteDialog(false);
        setDeleteKey('');
        setDeleteTime('');
    }
    const deleteOfflineData = () =>{
        getDeleteOffline(headPlant.schema,instrumentID,deleteKey,deleteTime);
    }

   

const handleActiveIndex = (index) => {
    if (index === 0) {
      setIsDataView(false);
      props.hideTab("enable")
      TriggerLastUpdated()
    }
  };

  const TriggerLastUpdated=()=>{
    getMeterReadingsV2(headPlant.schema,headPlant.id,true)
  }
    return(
       <React.Fragment>        
        {
            (isDataView && fetchOfflineLoading || meterReadingsV2Loading) && <LoadingScreen/>
        } 
        <AddOfflineData ref={offlineRef} fields={fields} prepareDownloadTemplate={prepareDownloadTemplate} triggerLastUpdated = {TriggerLastUpdated} refreshData={()=>getfetchOffline(headPlant.schema,instrumentID,from,to,frequencySec)}/>
        <OfflineFileUpload ref={fileUploadRef}/>
        <div className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'>
            <div style={{display: 'flex',justifyContent: 'space-between'}}>
                <div className={`flex items-center justify-between w-full py-3 px-4  ${ oeeAssetsArray.length === 0   ? "border-b border-Border-border-50 dark:border-Border-border-dark-50" : "" }`}>
                   <div className ='flex items-center gap-1'>
                    {
                      oeeAssetsArray.length === 0 && !(currentInstrument && currentInstrument.name)  && 
                   <TypographyNDL variant="label-01-m" color={currentInstrument && currentInstrument.name ? "tertiary" : "primary"} value={t("Offline Instruments")}/>

                    }
                    {
                        currentInstrument && currentInstrument.name && (
                            <React.Fragment>
                   {/* <TypographyNDL variant="label-01-m" color={currentInstrument && currentInstrument.name ? "tertiary" : "primary"}   style={{ cursor: "pointer" }} 
value={t("Offline Instruments")}       onClick={() => OfflineDAQ()}
/> */}
{isDataView && (
    // <Grid container alignItems="center" justifyContent="space-between" style={{marginTop:10}}>
    //   <Grid item lg={8} md={8} style={{paddingLeft:15}}>
    //    
    //   </Grid>
    //   <Grid item lg={4} md={4} style={{ marginRight: 20 }}>
    //     <DateRangeSelect />
    //   </Grid>
    // </Grid>
    <Breadcrumbs
           breadcrump={listArray}
           onActive={(index) => handleActiveIndex(index)}
         />
  )}
                                {/* <svg style={{marginLeft:"4px",marginRight:"8px"}} width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="
http://www.w3.org/2000/svg">
<path d="M0.64 13.76L5.36 -9.53674e-07H6.656L1.92 13.76H0.64Z" fill="#202020"/>
</svg>
                                <TypographyNDL variant="label-02-m" value={currentInstrument.name} /> */}
                            </React.Fragment>
                        )
                    }
                    </div>
                    <div className='flex items-center'>
                    {
                     isDataView && (
                        <div style={{display: 'flex',alignItems:"center",gap:"8px"}}>
                            <div className='flex items-center gap-1'>
                            <TypographyNDL value="From"  variant="label-01-m"  />
                            <DatePickerNDL
                                    id="offline-picker"
                                    onChange={(dates) => { 
                                        setFrom(moment(dates).format("YYYY-MM-DDTHH:mm:ss")); 
                                    }} 
                                    startDate={new Date(from)}  
                                    dateFormat={"dd/MM/yyyy HH:mm"}  
                                    timeFormat="HH:mm:ss" 
                                    showTimeSelect
                                    maxDate={new Date()} 
                            />
                        </div>
                           <div className='flex items-center gap-1'>
                            <TypographyNDL value="To"  variant="label-01-m"     />

                            <DatePickerNDL
                                  id="offline-picker"
                                    onChange={(dates) => { 
                                        setTo(moment(dates).format("YYYY-MM-DDTHH:mm:ss")); 
                                    }} 
                                    startDate={new Date(to)}  
                                    dateFormat={"dd/MM/yyyy HH:mm"}  
                                    timeFormat="HH:mm:ss" 
                                    showTimeSelect
                                    maxDate={new Date()} 
                            /> 
                            </div>
                            <Button  onClick={()=>getfetchOffline(headPlant.schema,instrumentID,from,to,frequencySec)} value="Run"/>
                        </div>
                     )
                }
                        </div>
                  
                    </div>
                   
               
            </div>    
         <div className='px-4 py-3'>
         {
                
                isDataView && (
                <EnhancedTable
                    headCells={dataCells}
                    name="dataTable"
                    data={offlineTableData}  
                    rowSelect={true}
                    actionenabled={true}
                    rawdata={fetchOfflineData}
                    handleEdit={(id, value) => handleEdit(id, value)}  
                    enableEdit={true} 
                    enableDelete={true}
                    handleDelete={(id,value)=>handleDelete(id,value)}
                    enableCreateTask={true}
                    handleCreateTask={(id,value)=>createTask(id,value)} 
                    checkBoxId={"index"}
                    FilterCol
                    verticalMenu={true}
                    groupBy={'offilineDACDetail'}
                  

                /> 
                )}{
                    !isDataView && (
                        <React.Fragment>
                     {meterReadingsV2Loading && <LoadingScreen/>}
                <EnhancedTable
                    headCells={headCells}
                    name="instrumentTable"
                    data={tabledata} 
                    download={true}
                    rowSelect={true}
                    search={true} 
                    actionenabled={true}
                    rawdata={offlineInstrumentListData}
                    handleAdd={(id, value) => handleAdd(id, value)} 
                    handleView={(id,value)=>handleView(id,value)}
                    enableView={true}
                    enableAdd={true}
                    fileUpload={openFileUpload}
                    fileDownload={handleDownloadTemplate}
                    checkBoxId={"INSTRUMENT ID"}
                    FilterCol
                    verticalMenu={true}
                    groupBy={'offilineDAC'}
                    onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                    page={pageidx}
                    rowsPerPage={rowsPerPage}
                />
                </React.Fragment> 
                )
            } 
        </div>
           

        </div>
        <Dialog onClose={handleCloseDialog} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={deleteDialog}>
            <DialogTitle>
            <TypographyNDL variant="heading-02-xs" value = {t("Are you sure you want to delete?")}></TypographyNDL>
            </DialogTitle>
            <DialogContent>
            <TypographyNDL  variant='paragraph-s' color='secondary' value = {t("Do you really want to delete the entry,")+t('NotReversible')}></TypographyNDL>
            </DialogContent>
            <DialogActions>
            <Button value={t('Cancel')}  type={'secondary'} onClick={handleCloseDialog}/>
            <Button danger  loading={DeleteOfflineLoading} value={t('YesDelete')} onClick={deleteOfflineData}/>
            </DialogActions>
        </Dialog> 
       </React.Fragment>
    )
}
export default OfflineDAQ;