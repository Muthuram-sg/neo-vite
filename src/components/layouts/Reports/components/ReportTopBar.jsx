import React, { useEffect, useState,forwardRef,useImperativeHandle,useRef} from 'react';
import {useParams,useLocation,useNavigate} from "react-router-dom"
import Button from "components/Core/ButtonNDL";
import useTheme from 'TailwindTheme';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import Standard from 'assets/neo_icons/Menu/Standard.svg?react';
import Custom from 'assets/neo_icons/Menu/Custom.svg?react';
import ReportIcon from 'assets/neo_icons/Dashboard/reports_dark.svg?react';
import ListDownload from 'assets/neo_icons/Menu/ListDownload.svg?react';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import DatePickerNDL from 'components/Core/DatepickerNDL';
import * as XLSX from 'xlsx';
import { useRecoilState } from "recoil";
import GeneratedReportTable from './GeneratedReport'
import  Popover from 'components/Core/DropdownList/Poper';
import Grid from 'components/Core/GridNDL'
import {
  selectedPlant,
  oeeAssets,
  currentUserRole,
  snackToggle,
  snackMessage,
  snackType,
  reportProgress,
  reportsList,
  dashBtnGrp,
  stdDowntimeAsset,
  microStopDuration,
  RptFrom,
  RptTo,
  selectedReport,
  ReportNameselected,
  reportObject,
  stdReportAsset, userData,
  oeereportgroupby,
  customdates,
  optixOptions,
  optixServerityOption,
  selectedOptixAsserts,
  triggerFileUpload,
  SelectedReportType,
  CalenderYear,
  CalendarCurrentPage,
  selectedReportTypeMultiple,
  downlaodRawData,
  userLine,
  SelectedReportPage,
  ErrorPage,
  defTypes,
  selecteddefectType,
  themeMode,
  

} from "recoilStore/atoms";
import configParam from "config";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useMutation } from "@apollo/client";
import NewReport from 'assets/neo_icons/Menu/plus.svg?react';
import useSaveReports from 'components/layouts/Reports/hooks/useSaveReports';
import { useAuth } from "components/Context";
import useGetAllSteelAsset from 'components/layouts/Settings/Production/Steel/hooks/useGetAllSteelAsset';
import useGetAllCNCAsset from 'components/layouts/Reports/hooks/useGetAllCNCAssets'
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import useGetOptixAssertOption from '../hooks/useGetOptixAssertOption';
import useGetReportType from '../CalendarReport/hooks/useGetReportType';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Search from 'assets/neo_icons/Menu/newTableIcons/search_table.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import ClickAwayListener from "react-click-away-listener"
import ThreeDot from 'assets/neo_icons/NewReportIcons/ThreeDot_New.svg?react';
import Edit from 'assets/neo_icons/NewReportIcons/edit_report.svg?react';
import Delete from 'assets/neo_icons/NewReportIcons/delete_report.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import PreDefinedContent from './PredefinedContent'
import BackIcon from 'assets/neo_icons/NewReportIcons/Back_icon.svg?react';
import { id } from 'date-fns/locale';







const  ReportTopBar=forwardRef((props,ref)=> {//NOSONAR

  const theme = useTheme()

  const classes = {
    topBar: {
      background: theme.colorPalette.foreGround,
       padding: '16px',
      height:" 48px",
      borderBottom: '1px solid ' + theme.colorPalette.divider,
      zIndex: '20',
      width: `calc(100% -"253px"})`
    },  
    selectDashIcon: {
      position: 'absolute',
      left: '10px',
      top: "8px"
    },
    dashCategIcon: {
      verticalAlign: 'text-top'
    },
    reportName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },

    leftAlign: {
      marginRight: 15,
      marginLeft: 'auto'
    },
    normalAlign: {
      marginRight: 15
    },
    dateLabel: {
      color: theme.colorPalette.primary,
      fontSize: '16px',
      fontWeight: '500',
      paddingRight: '10px'
    },
  }
  const { HF } = useAuth();
  var date = new Date()
  const navigate = useNavigate()
  date.setMinutes(0);
  date.setSeconds(0);
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  let {moduleName,subModule1,subModule2}=useParams()
  const [savedReports, setSavedReports] = useRecoilState(reportsList);
  const [selectedReports, setSelectedReports] = useRecoilState(selectedReport);
  const [selectedReportName, setSelectedReportName] = useRecoilState(ReportNameselected);


 
  const location = useLocation();
  const paramsArray2 = subModule2 ? subModule2.split('&'):[]; 
  const [currTheme] = useRecoilState(themeMode)
        
     // Create an empty object to store the values
     const queryParams2 = {};
     
     // Iterate over the array and split each key-value pair
     paramsArray2.forEach(param => {   const [key, value] = param.split('=');   
     queryParams2[key] = value; });
     
     // Extracting the respective values
     const DateRange2 = queryParams2['range'];
  const [AssetParam,setAssetParam] = useState('')
  const [maxDate, setMaxDate] = useState(new Date())
  const [maxDay, setMaxDay] = useState(2)
  const [DateRangeParam,setDateRangeParam] = useState(DateRange2)
  const [ModuleParam,setModuleParam] = useState('')
  const [subModuleParam,setSubModule1] = useState('')
  const [,setFilterParam] = useState('')
  const [isReportStd, setReportStd] = useState(false);
  const [durationLimit, setDurationLimit] = useRecoilState(dashBtnGrp);
  const [flag,setFlag]=useState(true)
  const [dateSelected, setDateSelected] = useState(6)
  const [oeeAssetsArray] = useRecoilState(oeeAssets);
  const [currUserRole] = useRecoilState(currentUserRole);
  const [userDetails] = useRecoilState(userData);
  const [, setIsDeleteVal] = useState(false);
  const [Customdatesval] = useRecoilState(customdates);
  const [, setErrorPage] = useRecoilState(ErrorPage);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [progress, setProgress] = useRecoilState(reportProgress);
  const [selectedReportPage,setselectedReportPage] = useRecoilState(SelectedReportPage)
  const [input, setInput] = useState(false);
  const [openGap,setOpenGap] = useState(false); 
  const [AnchorPos,setAnchorPos] = useState(null); 
  const [anchorEl,setanchorEl] = useState(null)
  const [isDeleteModel,setisDeleteModel] = useState(false)
  const [openGapSpeedFeed,setOpenGapSpeedFeed] = useState(false); 
  const [AnchorPosSpeedFeed,setAnchorPosSpeedFeed] = useState(null); 
  const bulkReportPopup=useRef()


  const [type, setType] = useState('');
  const [, setselectedDowntimeAsset] = useRecoilState(stdDowntimeAsset);
  const [, setMultiReportName] = useState([]);
  const [fromDate, setFromDate] = useRecoilState(RptFrom);
  const [toDate, setToDate] = useRecoilState(RptTo);
  const [reportObj, setReportObj] = useRecoilState(reportObject);
  const [disableStopDuration, setMicroStopDuration] = useRecoilState(microStopDuration);
  const [selectedAsset, SetSelectedAsset] = useRecoilState(stdReportAsset);
  const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.StartDate);
  const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.EndDate);
  const [, setReportList] = useState([]);
  const [AssetList, setAssetList] = useState([]);
  const [DateRefresh, setDateRefresh] = useState(true);
  const [OptixAssertOption, setOptixAssertOption] = useState([])
  const [, setOptixAssert] = useRecoilState(optixOptions)
  const [,setCalenderYear] = useRecoilState(CalenderYear)
  const [deftype] = useRecoilState(defTypes)
  const [selectedOptixAssert, setselectedOptixAssert] = useRecoilState(selectedOptixAsserts)
  const [TriggerFileUpload, setTriggerFileUpload] = useRecoilState(triggerFileUpload)
  const [selectedReportType, setselectedReportType] = useRecoilState(SelectedReportType)
  const [assetPage] = useRecoilState(CalendarCurrentPage)
  const [SelectedReportTypeMultiple,setselectedReportTypeMultiple] = useRecoilState(selectedReportTypeMultiple)
  const [DownlaodRawData] = useRecoilState(downlaodRawData)
  const [currUser] = useRecoilState(userLine)
  const [isformOpen,setisformOpen] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [enableTrigger,setenableTrigger] = useState(false)
  const [btnLoader,setbtnLoader] = useState(false)
  const [isBulkOpen,setisBulkOpen]=useState(false)
  const [,setdashboardlistloader] = useState(true)


  const ServerityLevelOption = [
    { id: "very high", name: "Very High" },
    { id: "high", name: "High" },
    { id: "medium", name: "Medium" },
    { id: "low", name: "Low" },
    {id: "-", name: "-"}

  ]

  // useEffect(() => {
  //   if(selectedReportName === 'Speed-Feed Performance'){
  //     localStorage.setItem('Speed-Feed Performance', 7)
  //     // setDurationLimit(7)
  //   }
  // }, [])
  


  useEffect(()=>{
    if(fromDate && toDate && enableTrigger){
     
      generate()

    }
  },[fromDate,toDate])

  const [SeverityLevel, setSeverityLevel] = useRecoilState(optixServerityOption)
  const [defectType, setDefectType] = useRecoilState(selecteddefectType)
  const [selectedGroupby, SetSelectedGroupby] = useRecoilState(oeereportgroupby);
  const { SaveReportsLoading, SaveReportsData, SaveReportsError, getSaveReports } = useSaveReports();
  const { SteelAssetListLoading, SteelAssetListData, SteelAssetListError, getSteelAssetList } = useGetAllSteelAsset();
  const { CNCAssetListLoading, CNCAssetListData, CNCAssetListError, getCNCAssetList } = useGetAllCNCAsset()
  const { GetReportTypeLoading, GetReportTypedata, GetReportTypeerror, getGetReportType } = useGetReportType()
  const [loader,setLoader] = useState(false)


  const AggregationModes = [{ "id": 1, "name": "Daywise" }, { "id": 2, "name": "Shiftwise" }, { "id": 3, "name": "Operatorwise" }, { "id": 4, "name": "Executionwise" }]
  // const SteelAggregationModes = [{ "id": 1, "name": "All" }, { "id": 2, "name": "Daywise" }, { "id": 3, "name": "Shiftwise" }, { "id": 4, "name": "Operatorwise" }, { "id": 5, "name": "Executionwise" }]
  const SteelAggregationModes = [{ "id": 1, "name": "All" }, { "id": 2, "name": "Daywise" }, { "id": 3, "name": "Shiftwise" }]
  const { GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError, getGetOptixAssertOption } = useGetOptixAssertOption()
 
  useImperativeHandle((ref),()=>({
    openReport: (value)=>handleReportChange(value,[]),
    OpenNewReportModel:()=>handleNewReport(),
    // handleVisibleChange: (e) => handleVisibleChange(e)
   
}))

useEffect(()=>{
  if(localStorage.getItem("isBulkOpen") ){
    if (bulkReportPopup.current) {
      bulkReportPopup.current.click();
   
    }
  }
 
},[])
 
useEffect(()=>{
    if(selectedReportPage.id && selectedReportPage.id !=="My Report" && !selectedReportPage.routerTriger){
      handleReportChange(selectedReportPage,[])
    }else if(!selectedReportPage.routerTriger){
      props.resetTags(true)
    }
  
  
},[selectedReportPage])
  useEffect(() => {
    let reportArr = []
    if (savedReports.length > 0) {
      // eslint-disable-next-line array-callback-return
      savedReports.map(val => {
        reportArr.push({
          id: val.id, name: val.name, custome_reports: val.custome_reports, timestamp: val.updated_ts,
          subtext: t("UpdatedBy") + ' ' + val.userByUpdatedBy.name, created_by: val.created_by, public_access: val.public_access
        })
      })
      let standRpt = reportArr.filter(e => !e.custome_reports === true).map(x => { return { ...x, icon: Standard, RightIcon: true } })
      let costomRpt = reportArr.filter(e => (e.custome_reports === true && ((e.public_access && e.created_by !== userDetails.id) || (e.created_by === userDetails.id)))).map(x => { return { ...x, icon: Custom, RightIcon: true } })
      let ReportsDropdown = [...standRpt, ...costomRpt]
      if (OptixAssertOption.length > 0) {
        ReportsDropdown = ReportsDropdown
      } else {
        ReportsDropdown = ReportsDropdown.filter(x => x.id !== "5ae212e5-b818-4fa4-9496-575f188955e2")
      }
      setReportList(ReportsDropdown)
      setLoader(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedReports, userDetails, headPlant, OptixAssertOption])
 
 


  useEffect(() => {
  let ModuleArr = ['custom','bulk downloads','calendar','steel','maintanance_logs','quality','time_slot','production','availability','downtime']
    if(moduleName === "downtime" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
      // Split the query string at '&' to separate each key-value pair
        const paramsArray = subModule1.split('&'); 
        
        // Create an empty object to store the values
        const queryParams = {};
        
        // Iterate over the array and split each key-value pair
        paramsArray.forEach(param => {   const [key, value] = param.split('=');   
        queryParams[key] = value; });
        
        // Extracting the respective values
        const asset = queryParams['asset'];
        const DateRange = queryParams['range'];
      setModuleParam('Downtime Report')
      if(asset && DateRange){
        setAssetParam(asset)
        setselectedDowntimeAsset(AssetParam)
        setDurationLimit(17)
        SetSelectedAsset(AssetParam)
        setDateRangeParam(DateRange)
        
      }
      else{
        setErrorPage(true)
       
      }
  }
  else if(moduleName === "steel" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
     const paramsArray = subModule1.split('&'); 
        
     // Create an empty object to store the values
     const queryParams = {};
     
     // Iterate over the array and split each key-value pair
     paramsArray.forEach(param => {   const [key, value] = param.split('=');   
     queryParams[key] = value; });
     
     // Extracting the respective values
     const asset = queryParams['asset'];
     const DateRange = queryParams['range'];
     const filter = queryParams['filter']
    setModuleParam('Steel Production')
    if(asset && DateRange && filter){
      setAssetParam(asset)
      setselectedDowntimeAsset(AssetParam) 
      setDateRangeParam(DateRange)
      SetSelectedAsset(AssetParam)

   //   setDurationLimit(17)
      setFilterParam(filter)
      SetSelectedGroupby(1)
    }   else{
      setErrorPage(true)
    }
   
  }
  else if(moduleName === "maintanance_logs" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
    // Split the query string at '&' to separate each key-value pair
    const paramsArray = subModule1.split('&'); 
        
    // Create an empty object to store the values
    const queryParams = {};
    
    // Iterate over the array and split each key-value pair
    paramsArray.forEach(param => {   const [key, value] = param.split('=');   
    queryParams[key] = value; });
    
    // Extracting the respective values
    const asset = queryParams['asset'];
    const DateRange = queryParams['range'];
     setModuleParam('Maintenance Error Logs')
     if(asset && DateRange){
      setAssetParam(asset)
      setDateRangeParam(DateRange)
      SetSelectedAsset(AssetParam)
  //    setDurationLimit(17)
     }   else{
      setErrorPage(true)
     }
  
  }
  else if(moduleName === "quality" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
     const paramsArray = subModule1.split('&'); 
        
     // Create an empty object to store the values
     const queryParams = {};
     
     // Iterate over the array and split each key-value pair
     paramsArray.forEach(param => {   const [key, value] = param.split('=');   
     queryParams[key] = value; });
     
     // Extracting the respective values
     const asset = queryParams['asset'];
     const DateRange = queryParams['range'];
    setModuleParam('Quality Report')
    if(asset && DateRange){
      setAssetParam(asset)
      setDateRangeParam(DateRange)
      SetSelectedAsset(AssetParam)
      setselectedDowntimeAsset([asset]) 
    //  setDurationLimit(17)
     }  else{
      setErrorPage(true)
     }
     
  }
  else if(moduleName === "time_slot" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
     const paramsArray = subModule1.split('&'); 
        
     // Create an empty object to store the values
     const queryParams = {};
     
     // Iterate over the array and split each key-value pair
     paramsArray.forEach(param => {   const [key, value] = param.split('=');   
     queryParams[key] = value; });
     
     // Extracting the respective values
     const DateRange = queryParams['range'];
    setModuleParam('Time Slot Report')
    if(DateRange){
      setDateRangeParam(DateRange)
    }else{
      setErrorPage(true)
    }
   
  }
  else if(moduleName === "calendar" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
        // Split the query string at '&' to separate each key-value pair
        const paramsArray = subModule1.split('&'); 
        
        // Create an empty object to store the values
        const queryParams = {};
        
        // Iterate over the array and split each key-value pair
        paramsArray.forEach(param => {   const [key, value] = param.split('=');   
        queryParams[key] = value; });
        
        // Extracting the respective values
        const DateRange = queryParams['range'];
        const filter = queryParams['technique filter'];
      
    setModuleParam('Calendar View')
    if(DateRange && filter){
      
      if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRange)) {
        const convertToIST = (dateStr) => new Date(dateStr.split(' ')[0].split('-').reverse().join('-') + 'T' + dateStr.split(' ')[1]);
        convertToIST(DateRange)
        let result = convertToIST(DateRange)
        setSelectedDateStart(result ? result : selectedDateStart)
        setCalenderYear(result ? result : selectedDateStart)
       }
       else{
        setErrorPage(true)
       }

      if(filter === 'vibration analysis'){
       
        setselectedReportType(1)
      }
      else if(filter === 'infrared thermography'){
        setselectedReportType(2)
      }
      else if(filter === 'ultrasound air leak'){
        setselectedReportType(3)
      }
      else if(filter === 'maintenance'){
        setselectedReportType(4)
      }
      else if(filter === 'oil analysis'){
        setselectedReportType(5)
      }
      else if(filter === 'others'){
        setselectedReportType(6)
      }
      else{
        setselectedReportType(1)
      }
     
    }  else{
      setErrorPage(true)
    }
   
 
  }
  else if(moduleName === "calendar" && subModule1 === "upload"){
    setModuleParam('Calendar View')
  }
  else if(moduleName === "availability" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
     const paramsArray = subModule1.split('&'); 
        
     // Create an empty object to store the values
     const queryParams = {};
     
     // Iterate over the array and split each key-value pair
     paramsArray.forEach(param => {   const [key, value] = param.split('=');   
     queryParams[key] = value; });
     
     // Extracting the respective values
     const asset = queryParams['asset'];
     const DateRange = queryParams['range'];
    setModuleParam('Availability Report')
    if(asset && DateRange){
      setAssetParam(asset)
      setDateRangeParam(DateRange)
      SetSelectedAsset(AssetParam)
    }else{
      setErrorPage(true)
    }
  
  }
  else if(moduleName === "production" && subModule1 && (subModule1.includes('=') || subModule1.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
     const paramsArray = subModule1.split('&'); 
        
     // Create an empty object to store the values
     const queryParams = {};
     
     // Iterate over the array and split each key-value pair
     paramsArray.forEach(param => {   const [key, value] = param.split('=');   
     queryParams[key] = value; });
     
     // Extracting the respective values
     const asset = queryParams['asset'];
     const DateRange = queryParams['range'];
     const filter = queryParams['filter'];
    setModuleParam('Production Work Order')
    if(asset && DateRange && filter){
      setAssetParam(asset)
      setselectedDowntimeAsset([asset])
      setDateRangeParam(DateRange)
      setFilterParam(filter)
      SetSelectedAsset(AssetParam)
      
      SetSelectedGroupby(1)
    }  else{
      setErrorPage(true)
    }
   
  }
  else if(moduleName === "custom" && subModule1 && subModule2 && (subModule2.includes('=') || subModule2.includes('&'))){
     // Split the query string at '&' to separate each key-value pair
     
    setModuleParam('Custom')
    setSubModule1(subModule1)
    if(DateRange2){
      setDateRangeParam(DateRange2)
    }  else{
      setErrorPage(true)
    }
    
  }else if(moduleName && !ModuleArr.includes(moduleName)){
    setErrorPage(true)
  }else if(ModuleArr.filter(x=> x!=='bulk downloads').includes(moduleName) && !subModule1){
    setErrorPage(true)
  }else if(ModuleArr.includes(moduleName) && subModule1 && !(subModule1.includes('=') || subModule1.includes('&')) && !['new','upload','edit'].includes(subModule1)){
    setErrorPage(true)
  }else if(moduleName && !['custom','calendar'].includes(moduleName) && subModule1 && subModule2 && !(subModule2.includes('=') || subModule2.includes('&'))){
    setErrorPage(true)
  }else if(['custom','calendar'].includes(moduleName) && subModule1 && !['new','upload','edit'].includes(subModule1) && subModule2 && !(subModule2.includes('=') || subModule2.includes('&'))){
    setErrorPage(true)
  }

      getGetOptixAssertOption(21, headPlant.id)
      getGetReportType()
    
      
  

  }, [headPlant,moduleName])
  useEffect(()=>{
    if( !GetReportTypeLoading &&  GetReportTypedata &&  !GetReportTypeerror){
      setselectedReportTypeMultiple(GetReportTypedata)
    }

  },[ GetReportTypeLoading, GetReportTypedata, GetReportTypeerror])
  useEffect(() => {
    if (!GetOptixAssertOptionLoading && GetOptixAssertOptionData && !GetOptixAssertOptionError) {
      setOptixAssertOption(GetOptixAssertOptionData)

    }

  }, [GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError])
 
  useEffect(() => {
    let oeeArr = []
    if (oeeAssetsArray.length > 0) {
      // eslint-disable-next-line array-callback-return
      oeeAssetsArray.map(val => {
        if(!val.is_part_count_binary && !val.is_part_count_downfall && selectedReportName === 'Route Card'){
          oeeArr.push({
            id: val.entity.id, name: val.entity.name,...val
          })
        }else{
          oeeArr.push({
            id: val.entity.id, name: val.entity.name
          })
        }
     
      })
      if(subModule1 && AssetParam && oeeArr.length>0){
        if(oeeArr.filter(v=>v.id === AssetParam).length === 0){
          setErrorPage(true)
        }
      }
      setAssetList(oeeArr)
    }

  }, [oeeAssetsArray,selectedReportName])


  useEffect(() => {
    if (!SaveReportsLoading && SaveReportsData && !SaveReportsError) {
      
      if (SaveReportsData.Data.length > 0) {
        setdashboardlistloader(false)

        setSavedReports(SaveReportsData.Data)
       
        
      } else {
        
        setdashboardlistloader(false)

        setSavedReports([]);
      }
      setdashboardlistloader(false)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SaveReportsLoading, SaveReportsData, SaveReportsError]);


  useEffect(() => {
    if (!selectedReports) {
      getSaveReports(headPlant.id, '')
      setLoader(true)
    }
    if (headPlant.id ) {
      if (selectedReportName === "Steel Production") {
        getSteelAssetList(headPlant.id)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  useEffect(() => {
    if (selectedReportName === 'Speed-Feed Performance') {
      getCNCAssetList(headPlant.id)
      
    }
  }, [selectedReportName]);

  useEffect(() => {
    if (!SteelAssetListLoading && SteelAssetListData && !SteelAssetListError) {
      if (SteelAssetListData.length > 0) {

        setAssetList(SteelAssetListData)
      } else {
        setAssetList([]);
        console.log("returndata is undefined for getSteelAssetList");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SteelAssetListData]);

  useEffect(() => {
    if (!CNCAssetListLoading && CNCAssetListData && !CNCAssetListError) {
      if (CNCAssetListData.length > 0) {

        setAssetList(CNCAssetListData)
      } else {
        setAssetList([]);
        console.log("returndata is undefined for CNCAssetListData");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CNCAssetListData]);

 
 
  const handleReportChange = (e, child,val,Params) => {
    setDateRefresh(false)
    setIsDeleteVal(false)
    
    if(child.length === 0){
      if (e) {
       
          const  report = savedReports.find(x => x.id === e.id);
        
   
        setSelectedReports(e);
        setSelectedReportName(report.name)
        setReportStd(!e.custome_reports);
        setType(report.group_by);
        setReportObj(report);
        if (report.group_by === 'year' || report.group_by === 'month' || report.group_by === 'day' || report.group_by === 'hour') {
          if(!Params){
            setFromDate(new Date(moment().startOf(report.group_by).format("YYYY-MM-DDTHH:mm:ss")));
          }
          else {
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRangeParam) && report.custome_reports){
            setFromDate(new Date(
              moment(
                  new Date(DateRangeParam.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + DateRangeParam.split(';')[0].split(' ')[1] + '+05:30').toString()
              ).startOf(report.group_by).format("YYYY-MM-DDTHH:mm:ss")
            )
            )
          }
          else{
            if(report.custome_reports){
              setErrorPage(true)
            }else{
              setDateRangeParam(DateRangeParam)
            }
          }
           
          }
         
        } else {
          if(!Params){
            setFromDate(new Date(moment().format("YYYY-MM-DDTHH:mm:ss")));
          }
          else{
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRangeParam) && report.custome_reports) {
              setFromDate(
                new Date(DateRangeParam.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + DateRangeParam.split(';')[0].split(' ')[1] + '+05:30').toISOString()
              );
              
            }
            else{
              if(report.custome_reports){
                setErrorPage(true)
              }else{
                setDateRangeParam(DateRangeParam)
              }
             
            }
           
            
          }
         
        }
      if(!Params){
        setToDate(report.group_by === 'hour' ? new Date(moment().endOf("hour").format("YYYY-MM-DDTHH:mm:ss")) : new Date());
      }
      else {
      
        if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRangeParam) && report.custome_reports) {
          const dateParts = DateRangeParam.split(';');
          
          // Ensure dateParts[1] exists and is valid
          if (dateParts.length > 1 && dateParts[1]) {
              const datePart = dateParts[1].split(' ')[0].split('-').reverse().join('-');
              const timePart = dateParts[1].split(' ')[1];
              
              if (datePart && timePart) {
                  const toDateString = `${datePart}T${timePart}+05:30`;
                  setToDate(new Date(toDateString));
              }
          }
      }
      else{
        if(report.custome_reports){
          setErrorPage(true)
        }else{
          setDateRangeParam(DateRangeParam)
        }
      }
      
      }
      
        setTimeout(() => { setDateRefresh(true) }, 100)
        if (e.title === 'Time Slot Report') {
          if(Params && flag){
            setDurationLimit(17)
            setFlag(false)
          }
          else{
            setDurationLimit(7)
          }
        
        } else {
          if(Params){
            setDurationLimit(17)
          }
          else{
            setDurationLimit(e.title === 'Speed-Feed Performance' ? 7 : 6)
          }
        
        }
        props.run(report)
      }
    }else{
      if (e.target.value) {
        let Stdreport = child.filter(x => x.id === e.target.value)
        let report;
        if(val && val.length > 0){
           report = val.find(x => x.id === e.target.value);
        }
        else{
           report = savedReports.find(x => x.id === e.target.value);
        }
        
     
        setSelectedReports(e.target.value);
        setSelectedReportName(report.name)
        if(Stdreport.length === 0){
          navigate('/AccessCard')
          return
        }
        setReportStd(!Stdreport[0].custome_reports);
        setType(report.group_by);
        setReportObj(report);
        
        if (report.group_by === 'year' || report.group_by === 'month' || report.group_by === 'day' || report.group_by === 'hour') {
          if(!Params){
            setFromDate(new Date(moment().startOf(report.group_by).format("YYYY-MM-DDTHH:mm:ss")));
          }
          else {
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRangeParam) && report.custome_reports){
            setFromDate(new Date(
              moment(
                  new Date(DateRangeParam.split(';')[0].split(' ')[0].split('-').reverse().join('-') + 'T' + DateRangeParam.split(';')[0].split(' ')[1] + '+05:30').toString()
              ).startOf(report.group_by).format("YYYY-MM-DDTHH:mm:ss")
            )
            )
          }
          else{
            if(report.custome_reports){
              setErrorPage(true)
            }else{
              setDateRangeParam(DateRangeParam)
            }
          }
           
          }
         
        } else {
          if(!Params){
            setFromDate(new Date(moment().format("YYYY-MM-DDTHH:mm:ss")));
          }
          else{
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRangeParam) && report.custome_reports) {
              const dateParts = DateRangeParam.split(';');
          
          // Ensure dateParts[1] exists and is valid
          if (dateParts.length > 0 && dateParts[0]) {
              const datePart = dateParts[0].split(' ')[0].split('-').reverse().join('-');
              const timePart = dateParts[0].split(' ')[1];
              
              if (datePart && timePart) {
                  const toDateString = `${datePart}T${timePart}+05:30`;
                  setFromDate(new Date(toDateString));
              }
          }


             
              
            }
            else{
              if(report.custome_reports){
                setErrorPage(true)
              }else{
                setDateRangeParam(DateRangeParam)
              }
             
            }
           
            
          }
         
        }
      if(!Params){
        setToDate(report.group_by === 'hour' ? new Date(moment().endOf("hour").format("YYYY-MM-DDTHH:mm:ss")) : new Date());
      }
      else {
      
        if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(DateRangeParam) && report.custome_reports) {
          const dateParts = DateRangeParam.split(';');
          // Ensure dateParts[1] exists and is valid
          if (dateParts.length > 1 && dateParts[1]) {
            
              const datePart = dateParts[1].split(' ')[0].split('-').reverse().join('-');
              const timePart = dateParts[1].split(' ')[1];
              
              if (datePart && timePart) {

                  const toDateString = `${datePart}T${timePart}+05:30`;
                  
                  setToDate(new Date(toDateString));
              }
          }
      }
      else{
        if(report.custome_reports){
          setErrorPage(true)
        }else{
          setDateRangeParam(DateRangeParam)
        }
      }
      
      }
      
        setTimeout(() => { setDateRefresh(true) }, 100)
        if (e.target.value === 'Time Slot Report') {
          if(Params && flag){
            setDurationLimit(17)
            setFlag(false)
          }
          else{
            setDurationLimit(7)
          }
        
        } else {
          if(Params){
            setDurationLimit(17)
          }
          else{
            setDurationLimit(6)
          }
        
        }
        props.run(report)
      }
    }


   
  }

 
  const handleVisibleChange = (e) => {

    if(e){
      setanchorEl(e.currentTarget)
    }
    setisBulkOpen(true)
  };




  const handleDowntimeAsset = (e, child) => {
    setselectedDowntimeAsset(e.target.value)
    SetSelectedAsset(e.target.value);
    setMultiReportName(e.target.value);
  }

  const handleSteelAsset = (e) => {
    setselectedDowntimeAsset(e.target.value)
    SetSelectedAsset(e.target.value);
    setMultiReportName(e.target.value);
  }

  const handleAggregationMode = (e, child) => {
    SetSelectedGroupby(e.target.value);
  }


  const handleOptixAssertChange = (e) => {
    setselectedOptixAssert(e.target.value)
    setOptixAssert(OptixAssertOption.filter(x => x.id === e.target.value))
  }

  function removeKeysFromArrayOfObjects(array, keysToRemove) {
    return array.map(obj => {
      keysToRemove.forEach(key => {
        delete obj[key];
      });
      return obj;
    });
  }

  const downloadExcel = () => {
    try {
      // Sample data

      let formatedData
      if(DownlaodRawData.length > 0){
        formatedData = DownlaodRawData.map((x,i)=>{
          return {...x,
            "S NO":i+1,
             Entity:x.entity.name,
             "Path Name":x.path_name,
            "Report Type":GetReportTypedata.find(y=>y.id === x.report_type).name,
            'Upload Date':moment(x.upload_date).format('YYYY-MM-DD'),
             "Created At":moment(x.created_ts).format('YYYY-MM-DDTHH:mm:ss'),
            'Created By':currUser.find(k=>k.user_id === x.created_by).userByUserId.name,
            "Updated At":moment(x.updated_ts).format('YYYY-MM-DDTHH:mm:ss'),
            'Updated By':currUser.find(k=>k.user_id === x.updated_by).userByUserId.name,
          }
        })
      }else{
        formatedData = [
           {
            "S NO":'',
             "Entity":'',
             "Path Name":'',
            "Report Type":'',
            'Upload Date':'',
             "Created At":'',
            'Created By':'',
            "Updated At":'',
            'Updated By':'',
          }
        ]
      }
      
      const keyToRemove = ['id', 'entity_id',"created_by","created_ts","path_name","report_type","updated_by","updated_ts","upload_date","entity"];;

      // Remove the specified key from each object in the array
      const cleanedData = removeKeysFromArrayOfObjects(formatedData, keyToRemove);
    
      if (!Array.isArray(cleanedData)) {
        throw new Error("Data should be an array of objects");
      }

      // Check if each item in the array is an object
      cleanedData.forEach(item => {
        if (typeof item !== 'object' || item === null) {
          throw new Error("Each item in the data array should be a non-null object");
        }
      });

      // Convert the array of objects to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Generate a binary string representation of the workbook
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

      // Convert the binary string to a Blob
      const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      };

      const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

      // Trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "CalendarReport.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Excel file: ", error.message);
    }
  };




  const deleteRep = (id) => {
    deleteReport({ variables: { id: id,status:2} })
  }

  const [deleteReport, { error: deleteErr }] = useMutation(
    configParam.deleteReport,
    {
      update: (inMemoryCache, returnData) => {
        if (!deleteErr) {
          props.cancelReport();
          props.getSavedReports({}, 'Deleted');
          setisDeleteModel(false)
          setbtnLoader(false)
          props.resetTags()

      }
    }
    }
  );
  useEffect(() => {
    if (deleteErr) {
      setSnackMessage("Unable to delete the report");
      setSnackType("error");
      setOpenSnack(true);
      setbtnLoader(false)
      setisDeleteModel(false)

    }
  }, [deleteErr]);

  const edit = (value) => {
    if (value) {
      props.edit(reportObj)
      setProgress(false);
    } else {
      setSnackMessage(t('Please Select Report'));
      setSnackType('warning');
      setOpenSnack(true);
    }
  }

  const generate = (from,to) => {

    if (selectedReports) {
      if (moment(toDate).isBefore(moment(fromDate))) {
        setSnackMessage('Please select valid dates');
        setSnackType('warning');
        setOpenSnack(true);
      } else {
        props.generate(fromDate, toDate) 
      }
    } else {
      setSnackMessage(t('Please Select Report'));
      setSnackType('warning');
      setOpenSnack(true);
    }
    setenableTrigger(false)
  }

  const handleMicroStopDuration = () => {
    setMicroStopDuration(!disableStopDuration);
  }

  useEffect(() => {
    setDateSelected(durationLimit)
  }, [durationLimit])

  function EmptyGrid() {
    if (selectedReportName === 'Production Work Order' || selectedReportName === 'Steel Production' ) {
      return <Grid item xs={3} lg={3} />
    } else if( selectedReportName === 'Calendar View' && assetPage ){
      return <Grid item xs={7} lg={7} />

    }else if(selectedReportName === 'Calendar View' && !assetPage){
      return <Grid item xs={4} lg={4} />

    
    }
    else if (selectedReportName === 'AI camera') {
      return <Grid item xs={2} lg={2} />
    }
     else {
      if (selectedReportName === 'Downtime Report') {
        return <Grid item xs={2} />
      } {
        return <Grid item xs={selectedReportName === 'Time Slot Report' ? 8 : 5} />
      }
    }
  }

  function PickerFormat() {
    if (type === "day" || type === "shift") {
      return "dd-MM-yyyy"
    } else if (type === "year") { return "yyyy" }
    else if (type === "month") { return "MM/yyyy" }
    else if (type === "hour") { return "yyyy/MM/dd " + HF.HM }
    else {
      return "dd MMM yyyy - " + HF.HM
    }
  }

  const HandleAvailabilityAsset = (e) => {
    setselectedDowntimeAsset(e.target.value)
    SetSelectedAsset(e.target.value);
    setMultiReportName(e.target.value);
  }
  function CustomDateRender() {
    if (DateRefresh) {
      return <React.Fragment>

        <div style={{ marginLeft: 'auto', paddingRight: '10px', display: 'flex',gap:"8px", alignItems: 'center', ...classes.root }} >
          <DatePickerNDL
            id="custom-range-starts"
            onChange={(dates,subpicker) => {
              const [start, end] = dates
              let dateval;
              if (type === "month") {
                dateval = moment(start).startOf('month').startOf('day').format("YYYY-MM-DDTHH:mm:ss")
              } else if (type === "year") {
                dateval = moment(start).startOf('year').startOf('month').startOf('day').format("YYYY-MM-DDTHH:mm:ss")
              } else if (type === "day" || type === "shift") {
                dateval = moment(start).startOf('day').format("YYYY-MM-DDTHH:mm:ss")
              } else if (type === 'hour') {
                dateval = moment(start).startOf('hour').format("YYYY-MM-DDTHH:mm")
              } else {
                dateval = moment(start).format("YYYY-MM-DDTHH:mm")
              }
              setFromDate(start ? new Date(dateval) : start)
              let datevalTo;
              if (type === "month") {
                datevalTo = moment(end).endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ss")
              } else if (type === "year") {
                datevalTo = moment(end).endOf('year').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ss")
              } else if (type === "day" || type === "shift") {
                datevalTo = moment(end).endOf('day').format("YYYY-MM-DDTHH:mm:ss")
              } else if (type === 'hour') {
                datevalTo = moment(end).endOf('hour').format("YYYY-MM-DDTHH:mm:ss")
              } else {
                datevalTo = moment(end).format("YYYY-MM-DDTHH:mm")
              }
              setToDate(end ? new Date(datevalTo) : end)
              if(subpicker){
                setenableTrigger(true)
              }
            }}
            startDate={fromDate}
            endDate={toDate}
            dateFormat={PickerFormat()}
            width={(type === "month" || type === 'year' )  ? "296px" :type ? "350px" :"430px" }
            selectsRange={true}
            customRange={true}
            disabled={true}
            timeFormat={type === "hour" ? "HH:mm" : "HH:mm:ss"}
            showTimeSelect={(type === 'hour' || type === '') ? true : false}
            showYearPicker={type === "year" ? true : false}
            showMonthYearPicker={type === "month"}
            maxDate={(type === "year" || type === "month" || type === "day" || type === "shift") && new Date()}
            minDate={type === "hour" && "2018-01-01T00:00"}
            note={helperText[type]}
            onlyRangePicker={true}
                                    />
        
     
        </div>

      </React.Fragment>
    }
  }

  function maxDayFnc() {
    if (selectedReportName === 'Downtime Report' || selectedReportName === 'AI camera') { return 30 } 
    else if (selectedReportName === 'Steel Production') { return 30 } 
    else if (selectedReportName === 'Speed-Feed Performance' || selectedReportName === 'Route Card') { return 6 }
    
    else { return undefined }
  }

  const getMaxDay = () => {
    const today = new Date();
    if (!selectedDateStart) return today; // Default max date is today
    const next7Days = new Date(selectedDateStart);
    next7Days.setDate(next7Days.getDate() + 7);
    next7Days > today 
      ? setMaxDay(moment(next7Days).diff(moment(), 'days'))
      : setMaxDay(moment().diff(moment(selectedDateStart), 'days'))
  }

  const getMaxDate = () => {
    const today = new Date();
    if (!selectedDateStart) return today; // Default max date is today
    const next7Days = new Date(selectedDateStart);
    next7Days.setDate(next7Days.getDate() + 7);
    next7Days > today ? setMaxDate(today) : setMaxDate(next7Days)
    // return next7Days > today ? today : next7Days; // Restrict beyond today
  };

  useEffect(() => {
    getMaxDate()
    getMaxDay()
  }, [selectedDateStart])

  function GridStyle() {
    if (selectedReportName === 'Time Slot Report') { return 'flex' } else { return 'block' }
  }


  const HandleSeverityChange = (e) => {
    setSeverityLevel(e)
  }
  const HandleDefectTypeChange = (e) => {
    setDefectType(e)
  }
  const handleUploadFile = () => {
    setTriggerFileUpload(!TriggerFileUpload)
  }
  const handleReportType = (e) => {
    setselectedReportType(e.target.value)
  }

  const handleReportTypeMultiple = (e) => {
    setselectedReportTypeMultiple(e)
  }
  const updateSearch=(e)=>{
    props.setSearchTerm(e.target.value)
    setInputValue(e.target.value)

  }

  const clickAwaySearch = () => {
    if (props.searchTerm === '')
        setInput(false)
    else
        setInput(true)
}

const reportFilterOption = [
  {id:"all",name:"All Reports"},
  {id:"onlyme",name:"Created By Me"},
  {id:"stared",name:"Starred"},

]

const reportSortOption = [
  {id:"a-z",name:"Alphabetical: A-Z"},
  {id:"z-a",name:"Alphabetical: Z-A"},
  {id:"frequently",name:"Frequently Opened"},
  {id:"rarely",name:"Rarely Opened"},

]



const handleNullPopper = (e) => {
  setOpenGap(!openGap)
  setAnchorPos(e.currentTarget)
}

  
function optionChange(e) {
      if(e === "edit"){
          edit(selectedReports)
          setOpenGap(!openGap)
          setAnchorPos(null)
      }
      if(e === "delete"){
        setisDeleteModel(true)
          setOpenGap(!openGap)
          setAnchorPos(null)
      }
    
    }

    function optionChangeSpeedFeed(e) {
          props.triggerDownload(e,AssetList.find(x=>x.id === selectedAsset).name)
          setOpenGapSpeedFeed(!openGapSpeedFeed)
          setAnchorPosSpeedFeed(null)
     
    }

    
    const handleClose = () => {
      setOpenGap(false)
      setAnchorPos(null)
    };

const handleCloseSpeedFeed = () => {
      setOpenGapSpeedFeed(false)
      setAnchorPosSpeedFeed(null)
    };

    const handleBulkClose=()=>{
      localStorage.removeItem("isBulkOpen");
      setisBulkOpen(false)
      setanchorEl(null)
    }
  

    const handleModelClose=()=>{
      setisDeleteModel(false)

    }


    const handleConfirmDelete =()=>{
      setbtnLoader(true)
      deleteRep(selectedReports.id)

    }


    const menuOption = [
      {id:"edit",name:"Edit",icon:Edit,toggle: false,stroke:'#0090FF',},
      {id:"delete",name:"Delete",icon:Delete,color:"#CE2C31",stroke:'#CE2C31',toggle: false},
    ]

     const downdableOption = [
      {id:"csv",name:"CSV"},
      {id:"pdf",name:"PDF"},

    ]


const handleNewReport=()=>{
  setisformOpen(true)
}



const handleContineReport = (title,access,userList)=>{
  props.newReport(title,access,userList)

}
 const handleFormModelClose=()=>{
  setisformOpen(false)
 }

 const helperText = {
  "day":"Note: Reports will display up to 45 days; download CSV for longer periods.",
  "shift":"Note: Reports will display up to 3 days;  download CSV for longer periods.",
  "month":"Note: Reports will display up to 8 months;  download CSV for longer periods.",
  "hour":"Note: Reports will display up to 2 days;  download CSV for longer periods.",
  "year":"Note: Reports will display up to 3 years;  download CSV for longer periods."
 }


 const handleBackReport =()=>{
  setSelectedReports('')
  props.resetTags()
  setenableTrigger(false)
 }


 const OpenDownloadableList=(e)=>{
 setOpenGapSpeedFeed(!openGapSpeedFeed)
  setAnchorPosSpeedFeed(e.currentTarget)
 }
 
 const handleRouteCardChange=(e)=>{
  if(e.length <= 5){
    SetSelectedAsset(e);
  }else{
    setSnackMessage("Please select 5 or less assets");
    setSnackType("error");
    setOpenSnack(true);
    setAssetList((prev) => 
      prev.map(item => ({
          ...item,
          checked: false
      }))
  )
  }
 }
  return (
    <React.Fragment>
      {
        loader && <LoadingScreenNDL />
      }

      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div className='flex items-center gap-2'>
    
              {
                selectedReports ? 
                <React.Fragment>
                {
                  isReportStd ? 
                  <TypographyNDL value={selectedReportName} variant="heading-02-xs" />
                  :
                  <React.Fragment>
                    <BackIcon className='cursor-pointer' stroke={currTheme === "dark" ? "#e0e0e0" : "#191919"} onClick={handleBackReport} />
                   <TypographyNDL value="My Reports" variant="lable-02-m" />
                  </React.Fragment>
                }
                </React.Fragment>
                :
                <TypographyNDL value="Reports" variant="heading-02-xs" />

              }
             

          </div>
          <div 
  className={`flex ${isReportStd ? 'flex-col' : 'flex-row'} items-center justify-end gap-2`}
>            {
              selectedReports !== '' &&
              (!isReportStd ?
                <React.Fragment>
                  {CustomDateRender() }

                  {/* <Button type="primary" value={t('run')} onClick={() => generate()} /> */}
                  <div className='h-8'>
                    {
                      ((currUserRole.id === 2) &&
                       
                        <React.Fragment>
                          <Button type="ghost" icon={ThreeDot} onClick={(e) => handleNullPopper(e)} />
                          <ListNDL
                            options={menuOption}
                            Open={openGap}
                            optionChange={optionChange}
                            keyValue={"name"}
                            keyId={"id"}
                            id={"popper-Gap-Speed"}
                            onclose={handleCloseSpeedFeed}
                            IconButton
                            isIcon
                            anchorEl={AnchorPos}
                            width="170px"
                          />
                        </React.Fragment>
                        
                        
                      )
                    }
                  </div>
                  
                
                </React.Fragment>
                :
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                  {selectedReportName === 'Downtime Report' &&
                    <div className="flex justify-between ">
                    <CustomSwitch
                        id={"switch"}
                        switch={true}
                        checked={disableStopDuration}
                        onChange={handleMicroStopDuration}
                        primaryLabel={t('shMicStop')}
                        size="small"
                      />

                    </div>}
                  {selectedReportName === 'Production Work Order' &&
                    <div className="flex  w-auto mr-4">

                      <SelectBox
                        labelId="groupbySelect"
                        id="groupbySelect"
                        placeholder={t("SelectEntityForms")}
                        auto={false}
                        multiple={false}
                        options={AggregationModes}
                        isMArray={true}
                        checkbox={false}
                        value={selectedGroupby}
                        onChange={handleAggregationMode}
                        keyValue="name"
                        keyId="id"

                      />
                    </div>
                  }
                  {selectedReportName === 'Steel Production' &&
                    <div className="flex px-4 w-full mr-4">

                      <SelectBox
                        labelId="groupbySelect"
                        id="groupbySelect"
                        placeholder={t("Select Report type")}
                        auto={false}
                        multiple={false}
                        options={SteelAggregationModes}
                        isMArray={true}
                        checkbox={false}
                        value={selectedGroupby}
                        onChange={handleAggregationMode}
                        keyValue="name"
                        keyId="id"
                        width="100px"
                      />
                    </div>
                  }
                  {
                    selectedReportName === 'AI camera' &&
                    <React.Fragment>
                    <div className="flex px-4 gap-[16px] w-auto ">
                      <div >
                        <SelectBox
                          labelId="assetSelect"
                          id="assetSelect"
                          auto={false}
                          placeholder={t("SelectAsset")}
                          multiple={false}
                          options={OptixAssertOption}
                          isMArray={true}
                          checkbox={false}
                          value={selectedOptixAssert}
                          onChange={handleOptixAssertChange}
                          keyValue="name"
                          keyId="id"
                        />
                      </div>
                  
                      <div >
                        <SelectBox
                          labelId="assetSelect"
                          id="assetSelect"
                          multiple={true}
                          options={ServerityLevelOption}
                          isMArray={true}
                          checkbox={false}
                          value={SeverityLevel}
                          selectAll={true}
                          selectAllText={"All Severity"}
                          placeholder={t("Select Severity")}
                          auto
                          onChange={HandleSeverityChange}
                          keyValue="name"
                          keyId="id"
                          width="100px"
                        />
                      </div>
                  
                      <div >
                        <SelectBox
                          labelId="assetSelect"
                          id="assetSelect"
                          multiple={true}
                          options={deftype}
                          isMArray={true}
                          checkbox={false}
                          value={defectType}
                          selectAll={true}
                          selectAllText={"All Defect Type"}
                          placeholder={t("Select Defect Type")}
                          auto
                          onChange={HandleDefectTypeChange}
                          keyValue="name"
                          keyId="id"
                        />
                      </div>
                  {/* <div>
                  <Button  type="ghost" inputRef={bulkReportPopup} icon={ReportIcon}  onClick={(e)=>handleVisibleChange(e)}  /> 
                  <Popover
                 onclose={handleBulkClose}
                //  ref={poperref}
                 id={"popper-Gap"}
                anchorEl={anchorEl}
                Open={isBulkOpen}
                width= {'500px'}
        
      >
        <GeneratedReportTable  isOnlyAI/>
        </Popover>
                    
                  </div> */}
                
                    </div>
                  </React.Fragment>
                  
                  }
                  {
                    selectedReportName === 'Route Card' &&
                    <SelectBox
        labelId="assetSelect"
        id="assetSelect"
        auto={false}
        placeholder={t("SelectAsset")}
        multiple={true}
        maxSelect={"5"}
        options={AssetList}
        width="300px"
        isMArray={true}
        checkbox={false}
        value={selectedAsset}
        onChange={handleRouteCardChange}
        keyValue="name"
        keyId="id"
        handleSnackbar={()=>{
          setSnackMessage("Please select 5 or less assets");
          setSnackType("error");
          setOpenSnack(true);
        }}
      />

                  }
          {
  selectedReportName !== 'Calendar View' && (
<div class="flex  mx-4">
      <DatePickerNDL
        id="custom-range-reports"
        onChange={(dates, e) => {
          const [start, end] = dates;
          setSelectedDateStart(start);
          setSelectedDateEnd(end);
          if(selectedReportName === 'Speed-Feed Performance') {
            setDateSelected(e)
          }
        }}
        startDate={selectedDateStart}
        endDate={selectedDateEnd}
        disabled={true}
        dateFormat="dd/MM/yyyy HH:mm:ss"
        selectsRange={true}
        width={"380px"}
        timeFormat="HH:mm:ss"
        customRange={true}
        defaultDate={ selectedReportName === 'Speed-Feed Performance' ?  dateSelected : durationLimit}
        Dropdowndefine={selectedReportName}
        setMax={selectedReportName === 'Speed-Feed Performance' ? true : false}
        maxDate={new Date()}
        maxDays={maxDayFnc()}
        // maxDays={selectedReportName === 'Speed-Feed Performance' ? maxDay : maxDayFnc()}
        
        queryDate={DateRangeParam}
      />
    </div>
  )
}

{
  selectedReportName === 'Calendar View' && (
    
    <div className="flex w-auto mr-4">
<DatePickerNDL
        id="custom-range-reports"
        onChange={(dates) => {
          setSelectedDateStart(dates);
          setCalenderYear(dates);
        }}
        startDate={selectedDateStart}
        minDate={new Date(moment().subtract(24, 'years'))}
        maxDate={new Date()}
        dateFormat="yyyy"
        maxDays={maxDayFnc()}
        showYearPicker
      />
    </div>
  )
}

{
  (selectedReportName !== 'Maintenance Logs' &&
    selectedReportName !== 'Speed-Feed Performance' &&
    selectedReportName !== 'Time Slot Report' &&
    selectedReportName !== 'Steel Production' &&
    selectedReportName !== 'Calendar View' &&
    selectedReportName !== 'AI camera' && selectedReportName !== 'Route Card' ) && (
<div >
<SelectBox
        labelId="assetSelect"
        id="assetSelect"
        auto={false}
        placeholder={t("SelectAsset")}
        multiple={false}
        options={AssetList}
        isMArray={true}
        checkbox={false}
        value={selectedAsset}
        onChange={
          selectedReportName === 'Availability Report'
            ? HandleAvailabilityAsset
            : handleDowntimeAsset
        }
        keyValue="name"
        keyId="id"
      />
    </div>
  )
}

{
  (selectedReportName === 'Speed-Feed Performance' ) && (
<div class="flex w-1/3 gap-2">
<SelectBox
        labelId="assetSelect"
        id="assetSelect"
        auto={false}
        placeholder={t("SelectAsset")}
        multiple={false}
        options={AssetList}
        isMArray={true}
        checkbox={false}
        value={selectedAsset}
        onChange={(e) => {
          setselectedDowntimeAsset(e.target.value)
          SetSelectedAsset(e.target.value);
          setMultiReportName(e.target.value);
        }
        }
        keyValue="name"
        keyId="id"
      />

      <Button type="ghost" icon={ListDownload}   onClick={(e)=>OpenDownloadableList(e)}
            disabled={!props.hideToolBar}
      />
       <ListNDL
                            options={downdableOption}
                            Open={openGapSpeedFeed}
                            optionChange={optionChangeSpeedFeed}
                            keyValue={"name"}
                            keyId={"id"}
                            id={"popper-Gap"}
                            onclose={handleCloseSpeedFeed}
                            anchorEl={AnchorPosSpeedFeed}
                            width="120px"
                          />
</div>
    
  )
}

{
  selectedReportName === 'Steel Production' && (
<div class="flex w-1/3">
<SelectBox
        labelId="assetSelect"
        id="assetSelect"
        auto={false}
        placeholder={t("SelectAsset")}
        multiple={false}
        options={AssetList}
        isMArray={true}
        checkbox={false}
        value={selectedAsset}
        onChange={handleSteelAsset}
        keyValue="name"
        keyId="id"
      />
    </div>
  )
}

{
  selectedReportName === 'Calendar View' && !assetPage && (
    <React.Fragment>
<div class="flex justify-between w-[200px]">
<SelectBox
          labelId="assetSelect"
          id="assetSelect"
          auto={false}
          placeholder={t("Select Report Type")}
          multiple={false}
          options={
            !GetReportTypeLoading &&
            GetReportTypedata &&
            !GetReportTypeerror
              ? GetReportTypedata
              : []
          }
          isMArray={true}
          checkbox={false}
          value={selectedReportType}
          onChange={handleReportType}
          keyValue="name"
          keyId="id"
        />
      </div>
      <div className="flex gap-4 justify-end items-center">
          <Button icon={Download} type="ghost" onClick={downloadExcel} />
          <Button
            icon={NewReport}
            type="tertiary"
            value="Upload File"
            onClick={handleUploadFile}
            stroke={"#FFFFFF"}
          />
        </div>
    </React.Fragment>
  )
}


                  {
                    selectedReportName === 'Calendar View' && assetPage &&
<div >
<SelectBox
                    labelId="assetSelect"
                    id="assetSelect"
                    placeholder={t("Select Report Type")}
                    multiple={true}
                    options={!GetReportTypeLoading && GetReportTypedata && !GetReportTypeerror ? GetReportTypedata : []}
                    isMArray={true}
                    checkbox={false}
                    value={SelectedReportTypeMultiple}
                    selectAll={true}
                    selectAllText={"All Report Type"}
                    auto
                    onChange={handleReportTypeMultiple}
                    keyValue="name"
                    keyId="id"

                  />
                  </div>

                  }
                </div>)

            }


            {!selectedReports &&
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%', columnGap: '8px' }}>
                  <ClickAwayListener onClickAway={clickAwaySearch}>
            {input ? <div><InputFieldNDL
                autoFocus
                id="Table-search"
                placeholder={t("Search")}
                size="small"
                value={inputValue}
                type="text"
                onChange={updateSearch}
                disableUnderline={true}
                startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  />}
                endAdornment={props.searchTerm !== '' && <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  onClick={() => { setInputValue('');props.setSearchTerm(''); setInput(true) }} />}

            /></div> : <Button type={"ghost"} icon={Search} onClick={() => { setInput(true); }} />}
        </ClickAwayListener>
                  <div className='w-[200px]'>
                  <SelectBox
                labelId="reportSelect-label"
                id="reportSelect-NDL"
                options={reportFilterOption}
                value={props.reportFilterValue}
                onChange={(e)=>props.handleFilterChange(e)}
                keyValue="name"
                keyId="id"
              />
                  </div>

                  <div className='w-[200px]'>
                  <SelectBox 
              labelId="reportSelect-label"
              id="reportSelect-NDL"
              options={reportSortOption}
              placeholder={''}
              value={props.reportSortValue}
              onChange={(e)=>props.handleSortChange(e)}
              keyValue="name"
              keyId="id"
              
            />
                  </div>
                 
           
                  <Button  type="ghost" inputRef={bulkReportPopup}  icon={ReportIcon}  onClick={(e)=>handleVisibleChange(e)}  /> 
                <Popover
                 onclose={handleBulkClose}
                //  ref={poperref}
                 id={"popper-Gap"}
                anchorEl={anchorEl}
                Open={isBulkOpen}
                width= {'500px'}
        
      >
        <GeneratedReportTable />
        </Popover>
                <Button   value={t('NewReport')} onClick={() =>handleNewReport()} iconAlignLeft icon={NewReport} />
              </div>
            }
          </div>
        </div>
      </div>
      
      <div >
        {progress ? (
          <LoadingScreenNDL />
        ) :

          <>
          </>
        }
      </div>
      <ModalNDL open={isDeleteModel} size="lg">
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-xs" value={"Delete Report"} />
        </ModalHeaderNDL>
        <ModalContentNDL>
        <TypographyNDL variant="paragraph-s" color="secondary" value={`Do you really want to delete the ${selectedReportName}? This action cannot be undone.`} />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button
          type='secondary'
            value={t("Cancel")}
            onClick={handleModelClose}
          />
          <Button value={"Delete"} danger loading={btnLoader} onClick={handleConfirmDelete}    />
        </ModalFooterNDL>
      </ModalNDL>
      <ModalNDL open={isformOpen} size="lg">
       <PreDefinedContent ReportList={props.ReportList} UserOption={props.UserOption} handleFormModelClose={handleFormModelClose} handleContineReport={handleContineReport} />
      </ModalNDL>
    </React.Fragment>
  )
})

export default ReportTopBar