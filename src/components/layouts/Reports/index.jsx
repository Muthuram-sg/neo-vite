import React, { useState, useEffect, useRef } from "react";
import {useParams} from "react-router-dom"
import useTheme from "TailwindTheme";
import Grid from 'components/Core/GridNDL'
import ReportsMain from "./components/ReportsMain";
import CreateReport from "./CustomReport/components/NewReport";
import EditReport from "./components/EditReports"; 
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import ReportLight from 'assets/Reports-light.svg?react';
import ReportDark from 'assets/Reports - Dark.svg?react';
import TopBar from "./components/ReportTopBar";
import {
  currentPage,
  selectedPlant, 
  themeMode,
  isRunForToday,
  reportsList,
  editReportValue,
  ReportNameselected,
  selectedReport,  
  reportObject,
  snackToggle,
  snackMessage,
  snackType, 
  SelectedReportPage,
  userData,
  user,
  ErrorPage
} from "recoilStore/atoms";
import useSaveReports from './hooks/useSaveReports' 
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useGetChannelListForLine from "components/layouts/Alarms/hooks/useGetChannelListForLine.jsx";
import useRealVirtualInstruments from "Hooks/useGetRealVirtualInstruments";
import useGetInstrumentMetrics from "Hooks/useInstrumentMetrics"; 
import useMetricsList from "Hooks/useMetricsList";
import CustomDashboardTileView from "components/layouts/Reports/components/CustomDashboardTileView"
import useUpdateLastOpened from "components/layouts/Reports/hooks/useUpdateLastOpened.jsx"
import useIncertStarReport from './starhooks/useIncertStarReport.jsx'
import useGetStarReport from './starhooks/useGetStarReport.jsx'
import useDeleteStarReport from './starhooks/useDeleteStarReport' 
export default function Reports() {
  const theme = useTheme();
  const { t } = useTranslation();
  const savedreportref = useRef();
  const mainReport = useRef(); 
  const openBulkReportRef = useRef();
  const [curTheme] = useRecoilState(themeMode);
  const [savedReports, setSavedReports] = useRecoilState(reportsList);
  const [newReportFlag, setnewReportFlag] = useState(0);
  const [AssetParam,setAssetParam] = useState('')
  const [RangeParam,setRangeParam] = useState('')
  const [TechniqueParam,setTechniqueParam] = useState('') 
  let {moduleName,subModule1,subModule2} = useParams()
  const [editReportVal, setEditReportVal] = useRecoilState(editReportValue);
  const [editReportFlag, setEditReportFlag] = useState(0);
  const [runReportFlag, setRunReportFlag] = useState(0); 
  const [groupByVal, setGroupByVal] = useState("");
  const [reportSelected, setReportSelected] = useState({}); 
  const [, setIsRunToday] = useRecoilState(isRunForToday);
  const [headPlant] = useRecoilState(selectedPlant);
  const [moduleFlag,setModuleFlag] = useState(false)
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [, setCurPage] = useRecoilState(currentPage);
  const [, setErrorPage] = useRecoilState(ErrorPage);
  const [currentreport, setcurrentreport] = useState("");
  const [GenReportTable,setGenReportTable] = useState(false);
  const [SelectedReport, setSelectedReports] = useRecoilState(selectedReport);
  const [, setSelectedReportName] = useRecoilState(ReportNameselected);
  const [selectedReportPage,setselectedReportPage] = useRecoilState(SelectedReportPage)
  const [userDetails] = useRecoilState(userData);
  const [predefinedData,setpredefinedData] = useState({})
  const [isList,setisList]=useState(false)
  const [curruser] = useRecoilState(user);  
  const [reportFilterValue,setreportFilterValue] =  useState('all')
  const [reportSortValue,setreportSortValue] =  useState('frequently')
  const [searchTerm, setSearchTerm] = useState('')
  const [overallReportList, setOverallReportList] = useState([]);
  
  const [UserOption, setUserOption] = useState([])
  const [ChannelList, setChannelList] = useState([]);
  const [ReportList, setReportList] = useState([]);
  const openReportRef= useRef()
  const [flag,setFlag] = useState(true)
  const { SaveReportsLoading, SaveReportsData, SaveReportsError, getSaveReports } = useSaveReports()
  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const { ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError, getChannelListForLine } = useGetChannelListForLine();
  // eslint-disable-next-line no-unused-vars
  const {RealVirtualInstrumentsListLoading, RealVirtualInstrumentsListData, RealVirtualInstrumentsListError, getRealVirtualInstruments} = useRealVirtualInstruments();
  // eslint-disable-next-line no-unused-vars
  const { instrumentMetricsListLoading, instrumentMetricsListData, instrumentMetricsListError, instrumentMetricsList } = useGetInstrumentMetrics();
  const { metricsListLoading, metricsListData, metricsListError, metricsList } = useMetricsList();
  const { getLastOpened} = useUpdateLastOpened()
  const { InsertStarReportLoading, InsertStarReportData, InsertStarReportError,getInsertStarReport} = useIncertStarReport()
   const { StarReportLoading,  StarReportData , StarReportError,getStarReport } = useGetStarReport()
   const {DeleteStarReportLoading, DeleteStarReportData, DeleteStarReportError, getDeleteStarReport} = useDeleteStarReport()
   const [StaredDetails,setStaredDetails] = useState([])
   const [starLoaderId,setstarLoaderId] = useState('')
  const [hideToolBar,setHideToolBar] = useState(false)

   
  useEffect(()=>{
    setReportSelected(reportObject[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reportObject])
  useEffect(() => {
    setCurPage("reports");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleFilterChange=(e)=>{
    setreportFilterValue(e.target.value)
  
  }
  
  const handleSortChange=(e)=>{
    setreportSortValue(e.target.value)
  
  
  }


  useEffect(() => {
    let reportArr = []
    if (savedReports.length > 0) {
      // eslint-disable-next-line array-callback-return
      savedReports.map(val => {
        reportArr.push({
          id: val.id, name: val.name, custome_reports: val.custome_reports, timestamp: val.updated_ts,
          subtext: t("UpdatedBy") + ' ' + val.userByUpdatedBy.name, created_by: val.created_by, public_access: val.public_access,last_opened:val.last_opened,user_access_list:val.user_access_list
        })
      })
      let costomRpt = reportArr.filter(e => (e.custome_reports === true && ((e.public_access && e.created_by !== userDetails.id) || (e.created_by === userDetails.id) || (e.standard === true?e.user_access_list&&e.user_access_list.length>0?e.user_access_list.includes(userDetails.id):true:false))))
      if(StaredDetails.length > 0){
    costomRpt = costomRpt.map(x=>{
      if(StaredDetails.includes(x.id)){
        return {...x,stared:true}
      }else{
        return {...x,stared:false}
      }
    })
      }

      if (reportFilterValue === 'stared') {
        costomRpt = costomRpt.filter(x => x.stared === true);
      } else if (reportFilterValue === 'onlyme') {
        costomRpt = costomRpt.filter(x => x.created_by === curruser.id);
      }
  
      // Apply sorting
      if (reportSortValue === 'a-z') {
        costomRpt = costomRpt.sort((a, b) => a.name.localeCompare(b.name));
      } else if (reportSortValue === 'z-a') {
        costomRpt = costomRpt.sort((a, b) => b.name.localeCompare(a.name));
      } else if (reportSortValue === 'frequently') {
        costomRpt = costomRpt.sort((a, b) => new Date(b.last_opened) - new Date(a.last_opened));
      } else if (reportSortValue === 'rarely') {
        costomRpt = costomRpt.sort((a, b) => new Date(a.last_opened) - new Date(b.last_opened));
      }

      if(searchTerm.length > 0){
        costomRpt = costomRpt.filter((content) =>
          content.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      setOverallReportList(reportArr.filter(x=>x.custome_reports === true))
      setReportList(costomRpt);
    console.log(costomRpt,"costomRpt")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [savedReports, userDetails, headPlant,StaredDetails,reportFilterValue,reportSortValue,searchTerm])

  useEffect(()=>{
    if( !StarReportLoading && StarReportData && !StarReportError){
      setStaredDetails(StarReportData.map(x=>x.report_id))
    }
  },[ StarReportLoading,  StarReportData , StarReportError])


  useEffect(()=>{
    if(!InsertStarReportLoading &&  InsertStarReportData &&  !InsertStarReportError){
      getStarReport({line_id:headPlant.id,user_id:curruser.id})
    }
  },[InsertStarReportLoading, InsertStarReportData, InsertStarReportError])

  useEffect(()=>{
    if(!DeleteStarReportLoading && DeleteStarReportData && !DeleteStarReportError){
      getStarReport({line_id:headPlant.id,user_id:curruser.id})
    }
  },[DeleteStarReportLoading, DeleteStarReportData, DeleteStarReportError])

  

console.log(savedReports,"savedReports")
      // eslint-disable-next-line array-callback-return
  useEffect(() => {
    if(!SaveReportsLoading && SaveReportsData && !SaveReportsError){
      if (SaveReportsData.Data.length > 0) { 
        if(moduleName === 'custom' && subModule1 === 'edit' && subModule2 && flag){
          console.log(subModule2,SaveReportsData.Data,"s2")
           let filteredObject = SaveReportsData.Data.filter(obj => obj.id === subModule2)
           if(filteredObject.length > 0){
            editReport(filteredObject[0])
           }
           else{
            setErrorPage(true)
           }
          
        }
        if(SaveReportsData.type === 'refresh'){
          let currentreport1 =SaveReportsData.Data.filter(function(obj) {
            return !savedReports.some(function(obj2) {
                return obj.id === obj2.id;
            })
          })
          setcurrentreport(currentreport1)
        }
        setSavedReports(SaveReportsData.Data)
        // eslint-disable-next-line no-unused-vars
        
      } else {
        setSavedReports([]);
        console.log("returndata undefined reports");
      }
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SaveReportsLoading, SaveReportsData, SaveReportsError,moduleName,subModule1,subModule2]); 

  useEffect(() => { 
    if(headPlant && headPlant.id){
      getSaveReports(headPlant.id,'')
      setnewReportFlag(0);
      setEditReportFlag(0);
      setRunReportFlag(0);
      setSelectedReports("");
      setSelectedReportName("");
      getUsersListForLine(headPlant.id)
      getChannelListForLine(headPlant.id) 
      getRealVirtualInstruments(headPlant.id)
      instrumentMetricsList(headPlant.id) 
      metricsList();
      getStarReport({line_id:headPlant.id,user_id:curruser.id})
    }
    
    console.log('hi',moduleName,subModule1)
   
    if(moduleName === "custom" && subModule1 === "new"){
     createNewReport()    
    }
   
    else  if(moduleName === 'calendar' && subModule1 === 'upload' && subModule2 && (subModule2.includes('=') || subModule2.includes('&'))){
      // Split the query string at '&' to separate each key-value pair
        const paramsArray = subModule2.split('&'); 
        
        // Create an empty object to store the values
        const queryParams = {};
        
        // Iterate over the array and split each key-value pair
        paramsArray.forEach(param => {   const [key, value] = param.split('=');   
        queryParams[key] = value; });
        
        // Extracting the respective values
        const asset = queryParams['asset'];
        const range = queryParams['range'];
        const technique = queryParams['technique'];
      console.log(asset,range,"calendar")
     
      if(asset && (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(range)) && technique){
        if(new Date(range) === "Invalid Date"){
          setErrorPage(true)  
        }
        setModuleFlag(true)
        setAssetParam(asset)
        setRangeParam(range)
        setTechniqueParam(technique)
      }
      else{
        setErrorPage(true)
      }
    
    } 
    else{
     
        getSaveReports(headPlant.id,'')
        setnewReportFlag(0);
        setEditReportFlag(0);
        setRunReportFlag(0);
        setSelectedReports("");
        setSelectedReportName("");
        getUsersListForLine(headPlant.id)
        getChannelListForLine(headPlant.id) 
        getRealVirtualInstruments(headPlant.id)
        instrumentMetricsList(headPlant.id) 
        metricsList();
     }
 
  
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant,moduleName,subModule1,subModule2,AssetParam,RangeParam,TechniqueParam]);
  useEffect(() => {
    if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
      let userOption = []
      userOption = UsersListForLineData.map(x => {
        let id = x.user_id
        let format = x.userByUserId.name + " (" + x.userByUserId.sgid + ")"
        return Object.assign(x, { "id": id, "value": format ,name: x.userByUserId.name });
      })
      setUserOption(userOption)
    }
  }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError])
  
  useEffect(() => {
    if (!ChannelListForLineLoading && ChannelListForLineData && !ChannelListForLineError) { 
      setChannelList(ChannelListForLineData.filter(f=> f.notificationChannelType.name.toLowerCase().includes("email"))) 
    }
  }, [ChannelListForLineLoading, ChannelListForLineData, ChannelListForLineError])

  const createNewReport = (name,accessType,userList) => {
    setnewReportFlag(1);
    setRunReportFlag(0);
    setEditReportFlag(0); 
    setEditReportVal({custome_reports : false})
    setSelectedReports("");
    setSelectedReportName("");
    setGenReportTable(false)
    setpredefinedData({name:name,accessType:accessType,userList:userList})
  };
  const GeneratedReport = () => {
    setnewReportFlag(0);
    setRunReportFlag(0);
    setEditReportFlag(0); 
    setEditReportVal({custome_reports : false})
    setSelectedReports("");
    setSelectedReportName("");
    setGenReportTable(true)
  };
  const cancelReport = (cancelReport1) => { 
    setnewReportFlag(0);
    setEditReportFlag(0);
    if(editReportVal.custome_reports){
      setRunReportFlag(cancelReport1 ? cancelReport1 : 0);
    }else{
      setRunReportFlag(0);
    }
    
  };
  const runReport = (val, day) => {
    if (day === "today") {
      setIsRunToday(true);
      savedreportref.current.clickrun();
    } else {
      setIsRunToday(false);
    }
    setRunReportFlag(1);
    setnewReportFlag(0);
    setEditReportFlag(0);
    setGroupByVal(val.group_by);
    setReportSelected(val); 
  };
  const editReport = (value,islist) => {
    setEditReportVal(value);
    setnewReportFlag(0);
    setRunReportFlag(0)
    setEditReportFlag(1);
    setGenReportTable(false)
    if(islist){
      setisList(true)
    }else{
      setisList(false)
    }
  };  

  
  const resetTags =(e)=>{
    setRunReportFlag(0);
    setnewReportFlag(0);
    setEditReportFlag(0);
    setGenReportTable(false)
    if(!e){
      setselectedReportPage({id:"My Report",custome_reports:false,title:"My Report"})
    }else{
  setSelectedReports('')

    }
  }
  const getSavedReports = (e, val) => {
    setnewReportFlag(0);
      setRunReportFlag(0);    
      setSelectedReports("");
      setSelectedReportName("");
      setcurrentreport("");
    if (val !== "Deleted") { 
      getSaveReports(headPlant.id,"refresh")
    }
    setSnackMessage(t("ReportsSpace") + val + t("Successfully"));
    setSnackType("success");
    getSaveReports(headPlant.id,'')
    resetTags()
    handleSnackOpen();
    setFlag(false)
  };
 
  const handleSnackOpen = () => {
    setOpenSnack(true);
  };
  const generateReport = (from, to) => {
    mainReport.current.handleGo(from, to);
  };

  const handleCustomReportOpen =(e)=>{
    getLastOpened(e)
    setselectedReportPage({id:e,custome_reports:true,title:""})
  
      openReportRef.current.openReport({id:e,custome_reports:true})

  }

  const handleEditOpen=(e)=>{
    editReport(SaveReportsData.Data.filter(x=>x.id === e)[0],true)
  }


  const handleTrigerStar=(id,isStar)=>{
    let body={
      line_id:headPlant.id,
      user_id:curruser.id,
      report_id:id
    }
    setstarLoaderId(id)
    if(isStar){
      getDeleteStarReport({id:id})
    }else{
      getInsertStarReport(body)
    }


  }

  const trigerNewReport =()=>{
    openReportRef.current.OpenNewReportModel()
  }

  const triggerDownload=(type,name)=>{
    mainReport.current.triggerDownload(type,name)
  }

  const handleHideToolBar=(r)=>{
    setHideToolBar(r)
  }

 console.log(newReportFlag,editReportFlag,"console") 




  return (
    <Grid container spacing={0} disableGutters>
      {(newReportFlag !== 1 && editReportFlag !== 1) &&
      <Grid
        item
        xs={12}
        style={{
          padding: '8px 16px 8px 16px',
          height:" 48px",
          borderBottom: '1px solid ' + theme.colorPalette.divider,
          zIndex: '20',
          width: `calc(100% -"253px"})`
        }}
        className={"bg-Background-bg-primary dark:bg-Background-bg-primary-dark "}
       > 
          <TopBar
            run={runReport}
            edit={editReport}
            generate={generateReport}
            cancelReport={cancelReport}
            getSavedReports={getSavedReports}
            newReport={createNewReport}
            currentreport={currentreport}
            UserOption={UserOption}
            generatedTable={GeneratedReport}
            ref={openReportRef}
            resetTags={resetTags}
            reportFilterValue={reportFilterValue}
            reportSortValue={reportSortValue}
            handleFilterChange={handleFilterChange}
            handleSortChange={handleSortChange}
            setSearchTerm={(e)=>setSearchTerm(e)}
            searchTerm={searchTerm}
            ReportList={overallReportList}
            triggerDownload={triggerDownload}
            hideToolBar={hideToolBar}


          /> 
      </Grid>}
      <Grid
        item
        xs={12}
        sm={12} 
        style={{ position: "relative"}}
        className={"bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark "}

        >
        
         
        {newReportFlag === 1 &&
          <CreateReport
            getSavedReports={(e) => {
              getSavedReports(e, "Created");
            }}
            predefinedData={predefinedData}
            cancelReport={cancelReport}
            UserOption={UserOption}
            resetTags={resetTags} 
            ChannelList={ChannelList}
            ReportList={overallReportList}
            metricList = {!metricsListLoading && !metricsListError && metricsListData && metricsListData.length > 0?metricsListData:[] }
            instrumentMetricsListData={!instrumentMetricsListLoading && !instrumentMetricsListError && instrumentMetricsListData?instrumentMetricsListData:[]} 
          />}
         { editReportFlag === 1 && 
          <EditReport
            runtoday={(id) => runReport(id, "today")}
            cancelReport={cancelReport}
            getSavedReports={(e) => {
              getSavedReports(e, "Updated");
            }}
            getSavedRep={(e) => {
              getSavedReports(e, "Deleted");
            }}
            data={editReportVal}
            run={runReport}
            resetTags={resetTags}
            isList={isList}
            UserOption={UserOption}
            ReportList={overallReportList}
            ChannelList={ChannelList}
            RealVirtualInstrumentsListData={!RealVirtualInstrumentsListLoading && !RealVirtualInstrumentsListError && RealVirtualInstrumentsListData ? RealVirtualInstrumentsListData : []}
            instrumentMetricsListData={instrumentMetricsListData?instrumentMetricsListData:[]}
            metricList = {!metricsListLoading && !metricsListError && metricsListData && metricsListData.length > 0?metricsListData:[] }
          />}
        { runReportFlag === 1 &&
          <ReportsMain
            ref={mainReport}
            handleHideToolBar={handleHideToolBar}
            hideToolBar={hideToolBar}
            asset={AssetParam}
            range={RangeParam}
            technique={TechniqueParam}
            moduleFlag={moduleFlag}
            groupBy={groupByVal}
            reportSelected={reportSelected}
            edit={editReport}
            cancelReport={cancelReport}
            // forwardBulkRef={forwardBulkRef}
            getSavedRep={(e) => {
              getSavedReports(e, "Deleted");
            }}
            metricList = {!metricsListLoading && !metricsListError && metricsListData && metricsListData.length > 0?metricsListData:[] }
          />
         
        } 
        {
          ((GenReportTable && newReportFlag !== 1 && editReportFlag !== 1 && runReportFlag !== 1)) && 
          <Grid item xs={12} 
          >
          <CustomDashboardTileView  handleEditOpen={handleEditOpen} starLoaderId={starLoaderId} InsertStarReportLoading={InsertStarReportLoading} handleTrigerStar={handleTrigerStar} ReportList={ReportList} resetTags={resetTags}  cancelReport={cancelReport} getSavedReports={getSavedReports} handleCustomReportOpen={handleCustomReportOpen} />
          </Grid>
        }
        {
          (!GenReportTable && newReportFlag !== 1 && editReportFlag !== 1 && runReportFlag !== 1 && !SelectedReport) && 
          <Grid container justifyContent="center" >
             {
            selectedReportPage.id === "My Report" && ReportList.length > 0 ?  
            <Grid item xs={12}>
            <CustomDashboardTileView  handleEditOpen={handleEditOpen} starLoaderId={starLoaderId} InsertStarReportLoading={InsertStarReportLoading} handleTrigerStar={handleTrigerStar} ReportList={ReportList} resetTags={resetTags}  cancelReport={cancelReport} getSavedReports={getSavedReports} handleCustomReportOpen={handleCustomReportOpen} />
            </Grid>
          
            :
            <Grid item xs={12} className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'  style={{ textAlign: "center",display: 'block',padding:16 }}>
            {curTheme === "light" ? <ReportLight /> : <ReportDark />}
            <span
            style={{
              color: theme.colorPalette.primary,
              fontSize: "1rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: "400",
              display: 'block'
            }}>
              {" "}
              {t("RunSavedReport")}{" "}
              <a
                href="# "
                style={{ color: "#0085FF" }}
                id="new-report"
                onClick={trigerNewReport}>
                {t("CreateSmall")}
              </a>{" "}
              {t("ANewOne")}
            </span>
          </Grid>
          }
         
          </Grid>
        }
          
      </Grid>
    </Grid>
  );
}
