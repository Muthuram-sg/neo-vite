/* eslint-disable array-callback-return */
 import React, { useState, useEffect, forwardRef, useImperativeHandle,useRef } from "react";
import Grid from "components/Core/GridNDL"; 
import Typography from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next';
import moment from 'moment';  
import { useRecoilState } from "recoil"; 
import TableReports from "./TableReports.jsx";
import QualityReport from 'components/layouts/Reports/QualityReport';

import DowntimeReport from 'components/layouts/Reports/DowntimeReport/Index'; 
import ProductionWorkOrder from 'components/layouts/Reports/ProductionWorkOrder';
import SteelProduction from 'components/layouts/Reports/SteelProduction';

import MaintenanceErrorLogs from 'components/layouts/Reports/MaintainceErrorLog'; 
import TimeSlotReport from 'components/layouts/Reports/TimeSlot'
import { 
  isRunForToday, 
  userData,
  selectedPlant,
  reportProgress,
  snackToggle,
  snackMessage,
  snackType,
  themeMode,
  SelectedReportPage,ReportNameselected
  
} from "recoilStore/atoms"; 
import Button from 'components/Core/ButtonNDL';
import useParameterList from 'components/layouts/Reports/hooks/useParameterList';
import useEntityFormulaList from 'components/layouts/Reports/hooks/useEntityFormulaList';
import useHierarchy from 'components/layouts/Reports/hooks/useHierarchy';
import useGenerateRawReport from 'components/layouts/Reports/hooks/useGenerateRawReport';
import useGetReport from 'components/layouts/Reports/hooks/useGetReport'; 
import AvailabilityReport from "../AvailabilityReport/index.jsx";
import CalendarReport from "../CalendarReport/index.jsx";
import OptixReport from "../OptixReport/index.jsx";
import HorizontalLineNDL from "components/Core/HorizontalLine/HorizontalLineNDL.jsx";
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg';
import ExcelJS from "exceljs";
import SpeedFeedReport from "components/layouts/Reports/SpeedFeedReport";
import RouteCard from "components/layouts/Reports/RouteCard";

import * as momentZone from 'moment-timezone';

// eslint-disable-next-line no-unused-vars
 
const ReportsMain = forwardRef((props, ref) => { 
  const { t } = useTranslation(); 
  let date = new Date()
  date.setMinutes(0);
  date.setSeconds(0);
  const [fromDate, setFromDate] = useState(date.toString());
  const [toDate, setToDate] = useState(date.toString());
  const [type, setType] = useState(props.groupBy);
  const [reportVal, setReportVal] = useState(props.reportSelected);
  const [selectedReportPage] = useRecoilState(SelectedReportPage)
  const [selectedReportName] = useRecoilState(ReportNameselected);
  const [darkMode] = useRecoilState(themeMode)
  const [, setMetriclist] = useState([]);
  const [, setdisableToSelector] = useState(true);
  const [, setSelectedMetric] = useState("");
  const [, setSelectedMetricType] = useState(null); 
  const [, setReportDataArr] = useState([]); 
  const [tempHierarchySplitedArr, setTempHierarchyArr] = useState([]);
  const [, setColumnArr] = useState([]); 
  const [reportType] = useState("table"); 
  const [hideReport, setHideReport] = useState(true);
  const [, setProgress] = useRecoilState(reportProgress);
  const [isRangeHeavy,setIsRangeHeavy] = useState(false);
  const [isRuntoday] = useRecoilState(isRunForToday); 
  const [, setMailNotification] = useRecoilState(snackToggle); 
  const [openSnack, setOpenSnack] = useState('');
  const [, setSnackMsg] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [currUser] = useRecoilState(userData); 
  const [isReading, setIsReading] = useState(0); 
  const [headPlant] = useRecoilState(selectedPlant); 
  const [previewReport,setPreviewReport] = useState([]);
  const [,setReportHeader] = useState([]);
  const [,setTableColumn2] = useState([]);
  const [,setChildColumn] = useState([]);
  const [,setFlatData] = useState([]);
  const [reportColumn,setReportColumn] = useState([]);
  const [reportData,setReportData] = useState([]);
  const [readingToggle,setReadingToggle] = useState(false);
  const [,setColSpan] = useState([]);
  const [metricName, setMetricName] = useState('');
  const { ParameterListLoading, ParameterListData, ParameterListError, getParameterList } = useParameterList();
  const { EntityFormulaListLoading, EntityFormulaListData, EntityFormulaListError, getEntityFormulaList } = useEntityFormulaList();
  const { HierarchyLoading, HierarchyData, HierarchyError, getHierarchy } = useHierarchy();
  const { GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError, getGenerateRawReport } = useGenerateRawReport();
  const { GetReportLoading, GetReportData, GetReportError, getGetReport } = useGetReport();
    const speedFeedRef= useRef()
  
  useImperativeHandle(ref, () => ({
    
    handleGo: (fromDT, ToDt) => {
      let from = moment(fromDT).format("YYYY-MM-DDTHH:mm:ssZ"); 
      let todate = moment(ToDt).format("YYYY-MM-DDTHH:mm:ssZ"); 
      setFromDate(from);
      setToDate(todate);
      generateReports(from, todate)
      setIsReading(1)
    },
    triggerDownload:(type,name)=>{
      speedFeedRef.current.triggerDownload(type,name)
    }
  })) 
   
  // eslint-disable-next-line no-unused-vars
  useEffect(() => {
    
    if(!ParameterListLoading && ParameterListData && !ParameterListError){
        let metricsAutocompleteSelected = getSelectedVals1(ParameterListData, props.reportSelected.metric_ids)
        setMetriclist(metricsAutocompleteSelected) 
        if (metricsAutocompleteSelected.length > 0) { 
          setSelectedMetric(metricsAutocompleteSelected[0].id)
          setSelectedMetricType(metricsAutocompleteSelected[0].type); 
        } 
        fetchHierarchy(props.reportSelected.hierarchy_id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ParameterListLoading, ParameterListData, ParameterListError]); 

  useEffect(() => {
    if(!EntityFormulaListLoading && EntityFormulaListData && !EntityFormulaListError){
         console.log(EntityFormulaListData,"EntityFormulaListData")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EntityFormulaListLoading, EntityFormulaListData, EntityFormulaListError]);
  
  useEffect(() => {
    
    if(!HierarchyLoading && HierarchyData && !HierarchyError){ 
        if (HierarchyData.length > 0) {
            setTempHierarchyArr(HierarchyData[0].hierarchy);
          } else {
            setTempHierarchyArr([]);
          }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HierarchyLoading, HierarchyData, HierarchyError]);

  useEffect(() => {
    if(!GenerateRawReportLoading && GenerateRawReportData && !GenerateRawReportError){ 
        if(GenerateRawReportData.id){ 
            setProgress(false);
            setOpenSnack(false);
            setMailNotification(true)
            setSnackMsg('Report Generation is started')
            setSnackType('success')

        }else{ 
            setProgress(false);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError]);

  useEffect(() => {
    if(!GetReportLoading && GetReportData && !GetReportError){
        setProgress(false);
        setOpenSnack(false);   
        setReportColumn(GetReportData.column?GetReportData.column:[])
        setReportData(GetReportData.data?GetReportData.data:[])
        generateExcelForDownload(GetReportData.column?GetReportData.column:[],GetReportData.data?GetReportData.data:[]);
        if (Object.keys(GetReportData.data).length <= 0) { 
          let temp = []
          setColumnArr(temp)
          setReportDataArr(temp)
          setHideReport(true)
          setMailNotification(true)
          setSnackMsg(t('No record Found'))
          setSnackType('warning')
        } else {
          setHideReport(false)
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GetReportLoading, GetReportData, GetReportError]);
  useEffect(() => {  
    if(hideReport){ 
      let temp = []
      const config = props.reportSelected && props.reportSelected.config?props.reportSelected.config:null;
      const group_aggregation = props.reportSelected && props.reportSelected.group_aggregation?props.reportSelected.group_aggregation:true;
      const table_layout = props.reportSelected && props.reportSelected.table_layout?props.reportSelected.table_layout:1;
      // #region showing regading toggle 
      let reading = false; 
      if(config && group_aggregation && table_layout === 2 && props.metricList.length >0){ 
        if(config.length === 1 ){  
          const metric = config[0].metric && config[0].metric.length ===1?config[0].metric[0]:null;
          if(metric){ 
            const filter_metric = props.metricList.filter(met=>met.name === metric);
            setMetricName(filter_metric[0].title);
            if(filter_metric && filter_metric.length >0 && filter_metric[0].type === 2){
              reading = true;
            }
          }
        }
      }else if(props.metric_ids && props.metric_ids.length >0){
        const filter_metric = props.metricList.filter(met=>met.id === props.metric_ids[0]);
        if(filter_metric && filter_metric.length >0 && filter_metric[0].type === 2){
          reading = true;
        }
      }
      // #endregion 
      setColumnArr(temp)
      setReportDataArr(temp)
      setTableColumn2(temp);
      setChildColumn(temp);
      setFlatData(temp)
      setType(props.groupBy)
      setReportVal(props.reportSelected) 
      getParameterList();
      setProgress(false);
      setOpenSnack(false);
      setIsRangeHeavy(false);
      setReadingToggle(reading)
      handleFromChange(moment().format(), 'from');
      handleToChange(moment().format()); 
      getEntityFormulaList(headPlant.id)
    }else{ 
      getParameterList();
      setHideReport(false)
      setReportVal(props.reportSelected) 
      setColumnArr([])
      setReportDataArr([])
      setTableColumn2([]);
      setChildColumn([]);
      setFlatData([])
      setReportColumn([])
      setReportData([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
  
  useEffect(() => {
    if (isRuntoday) {
      getTodayReport();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempHierarchySplitedArr])
  
  
  function getTodayReport() {
    const from = moment().startOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
    const Dateto = moment().format("YYYY-MM-DDTHH:mm:ssZ"); 
    generateReports(from, Dateto);
  }
 
   
  function fetchHierarchy(id) {
    getHierarchy(id)
  } 
   

  function getSelectedVals1(arr1, arr2) { 
    let finalArr = [];
    arr1.forEach(function (a) {
        if(arr2){
            arr2.forEach(function (obj) {
                if (obj === a.id) {
                  let tempObj = {
                    id: a.id,
                    name: a.name,
                    title: a.title,
                    type: a.type,
                    unit: a.metricUnitByMetricUnit.unit
                  }
                  finalArr.push(tempObj)
                }
              });
        }
      
    })
    return finalArr
  }

  function getDateVal(selectedVal, range) {
    let dateVal = "";
    if (type === "year") {
      if (range === "from") {
        dateVal = moment(selectedVal).startOf("year").format("YYYY-MM-DDTHH:mm:ss");
      } else {
        dateVal = moment(selectedVal).endOf("year").format("YYYY-MM-DDTHH:mm:ss");
      }
    }
    else if (type === "month") {
      if (range === "from") {
        dateVal = moment(selectedVal).startOf("month").format("YYYY-MM-DDTHH:mm:ss");
      } else {
        dateVal = moment(selectedVal).endOf("month").format("YYYY-MM-DDTHH:mm:ss");
      }
    } else if (type === "day") {
      if (range === "from") {
        dateVal = moment(selectedVal).startOf("day").format("YYYY-MM-DDTHH:mm:ss");
      } else {
        dateVal = moment(selectedVal).endOf("day").format("YYYY-MM-DDTHH:mm:ss");
      }
    } else if (type === "hour") {
      if (!isRuntoday) {
        if (range === "from") {
          dateVal = moment(selectedVal).startOf("hour").format("YYYY-MM-DDTHH:mm:ss");
        } else {
          dateVal = moment(selectedVal).endOf("hour").format("YYYY-MM-DDTHH:mm:ss");
        }
      } else {
        if (range === "from") {
          dateVal = moment(selectedVal).startOf("day").format("YYYY-MM-DDTHH:mm:ss");
        } else {
          dateVal = moment(selectedVal).format("YYYY-MM-DDTHH:mm:ss");
        }
      }
    }
    return dateVal;
  }

  const handleFromChange = (val, types) => {
    let from = "";
    if (reportVal && (reportVal.group_by === "month" || reportVal.group_by === "year" || reportVal.group_by === "day" || reportVal.group_by === "hour")) {
      from = getDateVal(val, types)
    } else {
      from = moment(val).format("YYYY-MM-DDTHH:mm:ss");
    }
    setFromDate(from);
    setdisableToSelector(false)
  };
  let toDT = "";
  const handleToChange = (val, types) => {
    if (reportVal && (reportVal.group_by === "month" || reportVal.group_by === "year" || reportVal.group_by === "day" || reportVal.group_by === "hour")) {
      toDT = getDateVal(val, types)
    } else {
      toDT = moment(val).format("YYYY-MM-DDTHH:mm:ss");
    }
    setToDate(toDT);
  };
 

  function generateReports(from, Dateto) { 
    const aggregation = reportVal.aggreation;
    const group_by = reportVal.group_by;
    const hours = moment(Dateto).diff(moment(from),'hours');  
    let grpName = 'days'
    if(group_by === 'year'){
      grpName = 'years'
    }
    if(group_by === 'month'){
      grpName = 'months'
    }
    const days = moment(Dateto).diff(moment(from),grpName);
      
    if(aggregation === '' && group_by === '' && Number(hours) >= 1){ 
      setOpenSnack(true);
      setHideReport(true)    
      setReportColumn([])
      setReportData([]) 
    }else{
      if(group_by === 'month'){
        ReportCondition(days,7,from, Dateto)
        
      }else if(group_by === 'year' || group_by === 'shift'){
        ReportCondition(days,3,from, Dateto)
      }else if(group_by === 'hour'){
        ReportCondition(days,2,from, Dateto)
      }else{
        ReportCondition(days,45,from, Dateto)
      }
             
    }        
  } 

  function ReportCondition(dayval,value,from, Dateto){
    if(dayval < value){
      setReportDataArr([])
      setProgress(true); 
      getGetReport(reportVal.id,from, Dateto,headPlant.id,momentZone.tz.guess())
    }else{
      setOpenSnack(true);
      setHideReport(true)  
      setReportColumn([])
      setReportData([]) 
    }
  }

  const hideNotification = () => { 
    setOpenSnack(false);
  }; 

  const handleReading = (index) => {   
    if(index === 0){
      setReportColumn(GetReportData.reading_column?GetReportData.reading_column:[])
      generateExcelForDownload(GetReportData.reading_column?GetReportData.reading_column:[],GetReportData.data?GetReportData.data:[]);
    }else{
      setReportColumn(GetReportData.column?GetReportData.column:[])
      generateExcelForDownload(GetReportData.column?GetReportData.column:[],GetReportData.data?GetReportData.data:[]);
    }
    setIsReading(index);
  } 
  

   const downloadExcel = async (data, fileName) => {
    if (!data || data.length === 0) {
      console.error("No data provided for Excel export");
      return;
    }
    try{

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
    
      // Add header row with styles
      const ReportHeader = Object.keys(data[0]); // Dynamically infer headers
      const headerRow = worksheet.addRow(ReportHeader);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" }, // Header color
        };
        cell.alignment = { horizontal: "center" }; // Center alignment for header
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });
    
      // Add data rows with styles
      data.forEach((rowData) => {
        const row = worksheet.addRow(Object.values(rowData));
    
        // Apply styles to the first column in the row
        const firstCell = row.getCell(1);
        firstCell.font = { bold: true }; // Bold text for first column
        firstCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" }, // Background color for the first column
        };
        firstCell.alignment = { horizontal: "left" }; // Left alignment
        firstCell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
    
        // Apply styles to other cells in the row
        row.eachCell((cell, colNumber) => {
          if (colNumber !== 1) {
            cell.alignment = { horizontal: "right" }; // Right align other columns
            cell.border = {
              top: { style: "thin", color: { argb: "000000" } },
              left: { style: "thin", color: { argb: "000000" } },
              bottom: { style: "thin", color: { argb: "000000" } },
              right: { style: "thin", color: { argb: "000000" } },
            };
    
            // Check if the row contains "Cumulative" or "Average" and make entire row bold
            if (cell.value === "Cumulative" || cell.value === "Average") {
              row.eachCell((boldCell) => {
                boldCell.font = { bold: true, color: { argb: "000000" } };
              });
            }
          }
        });
      });
    
      // Auto-adjust column widths
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          if (cell.value) {
            maxLength = Math.max(maxLength, cell.value.toString().length);
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength; // Set minimum width to 10
      });
    
      // Generate a buffer and trigger download in the browser
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }catch(e){
      console.log('Error At Download Excel',e)

    }
  };
  const renderStdReport = (id) => {
    if (id === 'e695c04b-f5bf-4fc3-97df-27d8ad9713af') {
      return <QualityReport />;
    } else if (id === '10f85da2-9fa3-4d2b-a3e1-2707ad7a0465') {
      return <DowntimeReport reportId={'10f85da2-9fa3-4d2b-a3e1-2707ad7a0465'}/>
    } else if (id === 'c300f461-eb26-49aa-8ea8-ec5ff11055de') {
      return (<ProductionWorkOrder />)
    } else if (id === '1e3d11b6-a23e-4602-995e-392869f9ae5f') {
      return (<MaintenanceErrorLogs />)
    } else if (id === 'eb050eef-4ba4-44a9-9a7e-4fbcaa6ef9a5') {
      return (<TimeSlotReport />)
    } else if (id === '3ea8b976-c2bc-4a12-b9eb-6164bdd3f2ba') {
      return (<SteelProduction />)
    }else if(id === 'a815203d-97c5-40b3-ada1-31124acf66e2'){
      return(
           <AvailabilityReport />
      )
    }else if(id === "d0604373-78d5-4c94-8362-bbaf588484f1"){
      return(
        <CalendarReport asset={props.asset} range={props.range} technique={props.technique} moduleFlag={props.moduleFlag}/>
      )
    }
    else if(id === '5ae212e5-b818-4fa4-9496-575f188955e2'){
      return(
           <OptixReport forwardBulkRef={props.forwardBulkRef}/>
      )
    }else if (id === 'dcd96437-e694-45ce-aebb-25500da2b635'){
      return (<SpeedFeedReport ref={speedFeedRef} handleHideToolBar={props.handleHideToolBar} 
        hideToolBar={props.hideToolBar}
        />)
    }else if(id === '25a79769-7924-4548-b483-485d4238ed52'){
      return (
       <RouteCard />
      )

    }
  }
  // #region generate excel sheet for download option
  function generateExcelForDownload(column,data){
    let report_header = [];
    let additional_row = [{Time: ''}];
    let span_col = [];
    let isSubheader = false;
    if(column.length >0){
      let startcol, endcol = 0;
      column.forEach((col,index)=>{
        startcol = endcol;
        report_header.push(col.title);
        if(col.subHeader && col.subHeader.length > 0){     
          isSubheader = true;  
          col.subHeader.forEach((x,ind)=>{
            if(ind !== 0){
              endcol = endcol+1;
              report_header.push(col.title+ind);
              additional_row[0][col.title+ind] = x.title ;   
            } else{
              additional_row[0][col.title] = x.title ;               
            }            
          })    
          if(col.subHeader.length>1){ 
            span_col.push({ s: { r: 0, c: startcol }, e: { r: 0, c: endcol } })
          }         
          endcol = endcol + 1; 
        }else{
          endcol = endcol+1;
        }
      }) 
      setColSpan(span_col);
      setReportHeader(report_header);
    }
    if(column.length>0 && data.length >0){
      let xcel_format = []
      data.forEach(x=>{
        let obj = {};
        column.forEach(col=>{ 
          if(col.subHeader && col.subHeader.length > 0){   
            col.subHeader.forEach((y,ind)=>{
              if(ind !== 0){
                obj[col.title+ind] = x[y.key];
              }else{
                obj[col.title] = x[y.key];
              }         
            })
          }else{ 
            obj[col.title] = x[col.key];
          }
        }) 
        xcel_format.push(obj)
        if(x.children && x.children.length > 0){
          x.children.forEach(child=>{ 
            let child_obj = {}
            column.forEach(col_child=>{ 
              child_obj[col_child.title] = child[col_child.key];
            })
            xcel_format.push(child_obj) 
          })
        }
      })
      if(isSubheader){
        xcel_format = [...additional_row,...xcel_format];
      } 
      setPreviewReport(xcel_format)
    }
  }
  // #endregion

  function RangeWarning(){
    let monthName = t('48 hours')
    if(reportVal.group_by === 'month'){
      monthName = t('7 months')
    }else if(reportVal.group_by === 'year'){
      monthName = t('2 years')
    }else if(reportVal.group_by === 'day'){
      monthName = t('7 days')
    }else if(reportVal.group_by === 'shift'){
      monthName = t('3 days')
    }
    return t('Selected time range should be less than ') + monthName + ', Please select time range within '+ monthName
  }

  function reportconfirmation(){
    if(openSnack) {
      return(
      <ModalNDL open={openSnack} size="lg">
      <ModalHeaderNDL>
        <Typography variant="heading-02-xs" value={"Bulk Confirmation"} />
      </ModalHeaderNDL>
      <ModalContentNDL>
      <Typography variant="paragraph-s" color="secondary" value={t("ReportMail")} />
      </ModalContentNDL>
      <ModalFooterNDL>
      <Button  type="secondary" value={"Cancel"} onClick={() => hideNotification()}/> 
      <Button  type="perimary" value={"Ok"} disabled={GenerateRawReportLoading} onClick={() =>{ getGenerateRawReport(momentZone.tz.guess(),reportVal.id,currUser.id,fromDate, toDate,headPlant.id); setOpenSnack(false);}}/> 
      </ModalFooterNDL>
      </ModalNDL>
      )
    }else{ return null}
  }

 
  
  const OverAllList = [
    { id: false, value: "Reading", disabled: false },
    { id: true, value: "Consumption", disabled: false },
  
  ]
  
  return (
    <React.Fragment>
        <div >
        {
            selectedReportName &&  selectedReportPage.custome_reports && 
              <Grid container justifyContent="center" style={{padding:"8px 16px 8px 16px"}} className='bg-Background-bg-primary h-12 dark:bg-Background-bg-primary-dark border-b border-Border-border-50 dark:border-Border-border-dark-50 content-center' >
            <Grid item xs={12} >
              <div className="flex items-center justify-between">
              <Typography value={selectedReportName} variant='heading-02-xs' />
              {
                (!hideReport && !openSnack && !isRangeHeavy && reportData.length>0) &&
<div className="flex items-center gap-2 justify-between  ">
            {
             !hideReport &&  reportVal.aggreation && readingToggle && (
<ContentSwitcherNDL listArray={OverAllList}  lessHeight contentSwitcherClick={handleReading} switchIndex={isReading} ></ContentSwitcherNDL>

              //     <CustomSwitch
              //     onChange={handleReading}
              //     checked={!isReading}
              //     primaryLabel={t('Reading')}
              //     secondaryLabel="Consumption"
              //     switch={true}
              //     size="small" 
              // />
              )
            }
  <Button type="ghost"  icon={Download} onClick={()=>downloadExcel(previewReport, reportVal.name + "_previewdata")}/> 
              </div>  
              }
          
              </div>
      
          </Grid>
          </Grid>
            }
              {
                (!hideReport && !openSnack && !isRangeHeavy && reportData.length>0) &&
                <React.Fragment>
    {/* <div className="h-[32px] flex items-center justify-between px-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
          <div className="flex " >
              {!hideReport &&
              <React.Fragment>
               {reportType === "table" && <Typography variant="label-02-s" value={metricName && `${metricName}`}/>}
                    
              </React.Fragment>
              }
          </div>
          <div className="flex items-center gap-2 justify-between  ">
            
                    {
                     !hideReport &&  reportVal.aggreation && readingToggle && (
<ContentSwitcherNDL listArray={OverAllList}  lessHeight contentSwitcherClick={handleReading} switchIndex={isReading} ></ContentSwitcherNDL>

                     
                      )
                    }
          <Button type="ghost"  icon={Download} onClick={()=>downloadExcel(previewReport, reportVal.name + "_previewdata")}/> 
                      </div>  

    </div> */}
    {/* <HorizontalLineNDL variant='divider1' /> */}
    </React.Fragment>
               } 
            </div> 

    <div >
      {
        !selectedReportPage.custome_reports ? 
          renderStdReport(selectedReportPage.id)
         : 
          <React.Fragment>
          
                 
              
            {
              reportconfirmation()
              
            } 
              <div>
              {
                isRangeHeavy &&
                  <div style={{ textAlign: "center" }}>
                    <Typography>{RangeWarning()}</Typography>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <Button type="tertiary" value={t("Ok")} onClick={() => setIsRangeHeavy(false)}/> 
                    </div>
                  </div> 
              }
              </div>
              <div>
              {
                 (!hideReport && !openSnack && !isRangeHeavy) &&
                  <TableReports reportData={reportData} darkMode={darkMode} reportColumn={reportColumn}/>
                 
              }  
              </div>
          </React.Fragment>
        
      }
    </div>
    </React.Fragment>
  );
})
export default ReportsMain;
