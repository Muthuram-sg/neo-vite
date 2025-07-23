/* eslint-disable no-useless-escape */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import Grid from "components/Core/GridNDL";
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL';  
import moment from "moment";
import { useRecoilState } from "recoil"; 
import Button from "components/Core/ButtonNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Delete from 'assets/neo_icons/NewReportIcons/delete_report.svg?react';
import Plus from 'assets/neo_icons/Menu/add.svg?react';
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import {
  defaultHierarchyData,
  selectedPlant,
  userData,
  hierarchyData,
  snackToggle,
  snackMessage,
  snackType,
  selectedReport
} from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import useInsertReport from "components/layouts/Reports/hooks/useInsertReport";
import useMetricsForInstrument from "components/layouts/Reports/hooks/useMetricsForInstrument";
import useRealVirtualInstruments from "Hooks/useGetRealVirtualInstruments";
import useTimeSlot from "Hooks/useTimeSlot"; 
import { useAuth } from "components/Context";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL' 

export default function NewReport(props) {//NOSONAR
  const { t } = useTranslation();
  const { HF } = useAuth(); 
  const [parameterList, setParameterList] = useState([]);
  const [HierarchyInstrumentList, setReportingMetrics] = useState([]);
  const [reportingEntityArr, setEntityArr] = useState([]); 
  const [selectedEntityVal, setSelectedEntityVal] = useState([]);
  const [hierarchyView] = useRecoilState(hierarchyData);
  const [aggregationVal, setAggregationVal] = useState("");
  const [aggregationCheck, setAggregationCheck] = useState(false);
  const [groupByChecked, setGroupByChecked] = useState(false); 
  const [, setGroupByTimeVal] = useState("12:00");
  const [groupByTimeMeridVal, setGroupByTimeMeridVal] = useState("AM");
  const [hierarchyVal, setHierarchyVal] = useState("");
  const [selectedHierarchyData] = useRecoilState(defaultHierarchyData);
  const [userDetails] = useRecoilState(userData);
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setStartAt] = useState([]);
  const [startedAtTime, setStartedAtTime] = useState('');
  const [reportType, setReportType] = useState('');
  let selectedEntityList = [];
  let instrumentArr = [];
  const [aggregationValue, setAggregationValue] = useState('');
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [EmailAccessChecked,setEmailAccessChecked] = useState(false);
  const [cumulativeAggregation, setCumulativeAggregation] = useState('single')
  const [cycleStartAt, setCycleStartAt] = useState(1)
  const titleRef = useRef();
  const descriptionRef = useRef();
  const hierarchyRef = useRef();
  const [checkStat,]=useState("false");
  const [,settTimeSlotsNames]=useState([]) 
  const [userFields, setUserFields] = useState([]);
  const [userIDs, setUserIDs] = useState([]);
  const [AllUsers,setAllUsers] = useState(false);
  const [UserOption] = useState(props.UserOption)
  const [channelFields, setChannelFields] = useState([]);
  const [channelIDs, setChannelIDs] = useState([]);
  const [ChannelList] = useState(props.ChannelList);
  const [AllChannels,setAllChannels] = useState(false);
  const [, setLoad] = useState(false);
  const [instrumentSelectionType,setInstrumentSelectionType] = useState(1);
  const [groupAggregation,setGroupAggregation] = useState(true);
  const [instrumentRow,setInstrumentRow] = useState([{Field: 1}])
  const [aggregatedInstruments,setAggregatedInstruments] = useState([]);
  const [aggregatedMetrics,setAggregatedMetric] = useState([]);
  const [tableLayout,setTableLayout] = useState(3);
  const [access,setaccess] = useState('private')
  const [shareduserList,setshareduserList] = useState([])
  const [openModel,setopenModel] =useState(false)
  const [, setSelectedReports] = useRecoilState(selectedReport);
  const [isCancelConfirmation,setisCancelConfirmation] = useState(false)


  const {InsertReportLoading, InsertReportData, InsertReportError, getInsertReport } = useInsertReport();
  const { MetricsForInstrumentLoading, MetricsForInstrumentData, MetricsForInstrumentError, getMetricsForInstrument } = useMetricsForInstrument() 
  const { outshiftLoading, outshiftData, outshiftError, gettimeslot } = useTimeSlot(); 
  // eslint-disable-next-line no-unused-vars
  const {RealVirtualInstrumentsListLoading, RealVirtualInstrumentsListData, RealVirtualInstrumentsListError, getRealVirtualInstruments} = useRealVirtualInstruments(); //NOSONAR
  useEffect(()=>{
    gettimeslot(headPlant.id)
    getRealVirtualInstruments(headPlant.id) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[headPlant])

  useEffect(()=>{
    if(props.predefinedData && Object.keys(props.predefinedData).length > 0){
      setTimeout(()=>{
        if(props.predefinedData.name){
          titleRef.current.value = props.predefinedData.name
        }else{
            titleRef.current.value = ''
        }
      },300)
      setaccess(props.predefinedData.accessType)
      if(props.predefinedData.accessType === 'shared'){
        setshareduserList(props.predefinedData.userList)
      }

    }
  },[props.predefinedData])
  useEffect(()=>{
      if (!InsertReportLoading && !InsertReportError && InsertReportData) { 
          props.getSavedReports();
          props.cancelReport();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[InsertReportLoading, InsertReportData, InsertReportError])

  useEffect(()=>{
    console.log(parameterList,"parameterList")
  },[parameterList])

  useEffect(()=>{
    if (!outshiftLoading && outshiftData && !outshiftError) {
      if(outshiftData.timeslot.timeslots.length>0){
        let data = outshiftData.timeslot.timeslots
        data=data.map((val,index)=>{
          return{
            "title":val.name,
            "id":index+1
          }
        })
        settTimeSlotsNames(data);
      }else{settTimeSlotsNames([])}

    }
  },[outshiftLoading, outshiftData, outshiftError]);

  useEffect(()=>{
    if (!MetricsForInstrumentLoading && !MetricsForInstrumentError && MetricsForInstrumentData) { 
      if (MetricsForInstrumentData.length > 0 && (selectedEntityVal.length > 0 || aggregatedInstruments.length > 0)) {
    
        const data = MetricsForInstrumentData;
        const value = data.map((val) => {
          return {
            id: val.metric.id,
            name: val.metric.name,
            title: val.metric.title,
            unit: val.metric.metricUnitByMetricUnit.unit,
          };
        });
        setParameterList(value);
       
      } else {
       
        setParameterList([])
        console.log("returndata undefined newreports");
      }
    }
    if (!MetricsForInstrumentLoading && MetricsForInstrumentError && !MetricsForInstrumentData) { 
      setParameterList([])
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[MetricsForInstrumentLoading, MetricsForInstrumentData, MetricsForInstrumentError])


  useEffect(() => {
    //#region pre loaded data for time picker
    if(HF.HM === 'HH:mm'){
      setStartAt([
        { id: 24, name: "00:00" },
        { id: 1, name: "01:00" },
        { id: 2, name: "02:00" },
        { id: 3, name: "03:00" },
        { id: 4, name: "04:00" },
        { id: 5, name: "05:00" },
        { id: 6, name: "06:00" },
        { id: 7, name: "07:00" },
        { id: 8, name: "08:00" },
        { id: 9, name: "09:00" },
        { id: 10, name: "10:00" },
        { id: 11, name: "11:00" },
        { id: 12, name: "12:00" },
        { id: 13, name: "13:00" },
        { id: 14, name: "14:00" },
        { id: 15, name: "15:00" },
        { id: 16, name: "16:00" },
        { id: 17, name: "17:00" },
        { id: 18, name: "18:00" },
        { id: 19, name: "19:00" },
        { id: 20, name: "20:00" },
        { id: 21, name: "21:00" },
        { id: 22, name: "22:00" },
        { id: 23, name: "23:00" }
      ]);
    }else{
      setStartAt([
      
        { id: 1, name: "01:00" },
        { id: 2, name: "02:00" },
        { id: 3, name: "03:00" },
        { id: 4, name: "04:00" },
        { id: 5, name: "05:00" },
        { id: 6, name: "06:00" },
        { id: 7, name: "07:00" },
        { id: 8, name: "08:00" },
        { id: 9, name: "09:00" },
        { id: 10, name: "10:00" },
        { id: 11, name: "11:00" },
        { id: 12, name: "12:00" },
      ]);
    }
    //#endregion
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      selectedHierarchyData.length > 0 &&
      selectedHierarchyData !== "" &&
      selectedHierarchyData !== undefined &&
      selectedHierarchyData !== null
    ) {
      setHierarchyVal(selectedHierarchyData[0].hierarchy.id);
      let hierarchyDataArr = selectedHierarchyData[0].hierarchy.hierarchy[0];
      let tempProps = JSON.parse(JSON.stringify(hierarchyDataArr));
      let reportingMetricArr = [];
      let entityArr = [];
      const indfinder = (a) => {
        a.forEach( (b)=> {
          if (b.type === "instrument") {
            reportingMetricArr.push({ title: b.name, id: b.id, type: 'real' });
          }
          if (b.type === "entity") {
            if(b.subnode && b.subnode.id){
              reportingMetricArr.push({ title: b.subnode.name, id: b.subnode.id,type: a.subnodeType === 'virtual'?'virtual':'instrument',formula: b.subnode.formula });
            }
            entityArr.push({ title: b.name, id: b.id, type: b.subtype });
          }
        });

        a.forEach( (b)=> {
          if (b.hasOwnProperty("children") && b.children.length > 0) {
            indfinder(b.children);
          }
        });
      };
      tempProps.children.forEach(function (a) {
        if (a.type === "instrument") {
          reportingMetricArr.push({ title: a.name, id: a.id, type: 'real' });
        }
        if (a.type === "entity") {
          if(a.subnode && a.subnode.id){
            reportingMetricArr.push({ title: a.subnode.name, id: a.subnode.id,type: a.subnodeType === 'virtual'?'virtual':'instrument',formula: a.subnode.formula });
          }
          entityArr.push({ title: a.name, id: a.id, type: a.subtype });
        }
        if (a.hasOwnProperty("children")) {
          indfinder(a.children);
        }
      });
      console.log(reportingMetricArr,selectedHierarchyData,"reportingMetricArr")
      setReportingMetrics(reportingMetricArr);
      setEntityArr(entityArr);
    }
  }, [selectedHierarchyData]);





  const handleGroupbyCheck = (e) => { 
    if(groupByChecked){
      setEmailAccessChecked(false);
      setUserFields([]) 
      setUserIDs([])
      setChannelFields([]);
      setChannelIDs([])
    }
    setGroupByChecked(!groupByChecked);
    setReportType("");
    setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
    setGroupByTimeMeridVal("AM"); 
  };


  const snackTrigger = (msg) => {
    setSnackMessage(msg);
    setSnackType("warning");
    handleSnackOpen();
    return false
  };

  function individualValidation(){
  
    if(instrumentRow.length >0){
      let isValid=[]
     instrumentRow.forEach(instrument=>{ 
        if(!instrument.instrument || !instrument.metrics || !instrument.aggregate){
        
          isValid.push(snackTrigger(t("Please fill all fields in a row")))
        }else{
          if(instrument.instrument.length === 0 || instrument.metrics.length === 0 || instrument.aggregate.length === 0){
          
            isValid.push(snackTrigger(t("Please fill all fields in a row")))
          }
          else{
           isValid.push(true)
          }
        }
        
      }) 
      return isValid.every(e => e)
               
    }else{
      return snackTrigger(t("Please add instruments"));
    }
  }
  
  const saveNewReport = (e) => { 
 
    const titleValue = titleRef.current.value;
    const descriptionValue = descriptionRef.current.value;
    const hierarchyValue = hierarchyVal ?hierarchyVal:null;
    const sequenceValue = reportType;
    const timeValue = startedAtTime ? startedAtTime :"12:00";
 
    // eslint-disable-next-line no-unused-vars
    let selectedEntityID = selectedEntityVal.map((a) => a.id);
    if (titleValue === "") {
      return snackTrigger(t("FillRepTitle")); 
    }
    if(props.ReportList &&  props.ReportList.some((item) => item.name === titleValue) ){
      return snackTrigger("Report Name Already Exists"); 
    }
    
    if(access === 'shared' && shareduserList.length === 0){
      return snackTrigger("Select users to give access."); 
    }
    if(instrumentSelectionType === 1){  
      if (!hierarchyValue) {
        return snackTrigger(t("Please select a hierarchy")); 
      }
      if(groupAggregation){
        //#region checking empty field validation in grroup aggregation
        if (selectedEntityID.length === 0) {
          return snackTrigger(t("PlsSelEntity")); 
        }
        if (aggregatedMetrics.length === 0) {
          return snackTrigger(t("PlsSelMetrics")); 
        }
        //#endregion
      }else{ 
        //#region checking empty field validation in row wise individual selection
          let isValid = individualValidation()
          if(!isValid){
            return false
          }
        //#endregion
      }      
    }else{
      if(groupAggregation){ 
        if(aggregatedInstruments.length === 0){ 
          return snackTrigger(t("Please select aggregated instrument"));
        }
        if(aggregatedMetrics.length === 0){
          return snackTrigger(t("Please select aggregated metrics"));
        }
      }else{
        let isValid = individualValidation()
        if(!isValid){
          return false
        }
      }       
    }
 
     if (groupByChecked && sequenceValue === "") {
      return snackTrigger(t("SelGroupby"));
    }
    if(EmailAccessChecked){
      if(userIDs.length === 0){
        if(channelIDs.length === 0){
          return snackTrigger(t("Please select user or channel type"));
        }
      }
    }
    let instrumentConfig =[];
    if(groupAggregation){
      //#region formatting all selected instrument, metric and aggregate options into json format
      let inst = aggregatedInstruments.map(y=> {return {id: y.id,type: y.type}});
      inst = [...new Map(inst.map(item => [item['id'], item])).values()] 
      const metric = aggregatedMetrics.map(y=> y.name);
      instrumentConfig.push({instrument: inst,metric: metric,aggregate: aggregationValue && aggregationValue === 'none'  ?  '' : aggregationValue , grouping: cumulativeAggregation, cycleStartstAt: cycleStartAt});      
      //#endregion
    }else{
      //#region formatting individual row wise selected instrument, metric and aggregate options into json format
    
      instrumentConfig = instrumentRow.map(x=>{
        const inst = x.instrument.map(y=> {return {id: y.id,type: y.type}});
        const metric = x.metrics.map(y=> y.name);
        const aggregate = x.aggregate;
        return {instrument: inst,metric: metric,aggregate: aggregate, grouping: cumulativeAggregation, cycleStartstAt: cycleStartAt };
      })
      //#endregion
    }
    // graphql query for create new report
   
    let datas={
      name:titleValue,
      description:descriptionValue,
      custome_reports:true,
      hierarchy_id:hierarchyValue,
      metric_ids:"{}",
      instument_ids:"{}",
      entity_ids:"{" + selectedEntityID.toString() + "}",
      startsat: moment(moment().format("L") + " " + timeValue + (HF.HM !== 'HH:mm' ? " "+groupByTimeMeridVal : '')).format("HH:mm:ss"),
      aggreation:aggregationValue && aggregationValue === 'none'  ?  '' : aggregationValue,
      group_by:sequenceValue,
      created_by:userDetails.id,
      line_id: headPlant.id,
      public_access:access === "private" ? false : true,
      user_access_list:shareduserList.length > 0 ? shareduserList : [],
      send_mail:EmailAccessChecked

    }
  
    getInsertReport( datas,"{"+channelIDs.toString()+ "}","{"+userIDs.toString()+"}",instrumentConfig,instrumentSelectionType,groupAggregation,tableLayout)
  };

  const cancelReport = (e) => {
    props.cancelReport(1);
  };

  const handleEntitySelect = (values1) => {
    selectedEntityList.push(values1);
    setSelectedEntityVal(values1);

    if (values1.length === 0) {
      setSelectedEntityVal([]);
      setParameterList([]);
    }

    if (hierarchyVal && hierarchyVal !== "" && hierarchyVal !== undefined) {
      let tempArr1 = JSON.parse(JSON.stringify(hierarchyView));
      let tempArr2 = tempArr1.filter((val, index) => val.id === hierarchyVal);
      let tempProps5 = tempArr2[0].hierarchy[0];
      let entityInstrument = []
      const generateArr = (a) => {
        a.children.forEach(function (b) {
          if (b.subnode) {
            if (b.subnode.formula) {
              if(b.subnodeType === 'virtual'){ 
                const formula = b.subnode.formula;
                let formulaArr = formula.split(/([-+*\/()])/g);
                formulaArr = formulaArr.filter(String);
                let re = "-+*/()";
                formulaArr = formulaArr.filter((val) => !re.includes(val));
                formulaArr = formulaArr.map((val) => val.split(".")[0]);
                entityInstrument.push({ title: b.subnode.name, id: b.subnode.id,type: "virtual",sub: b.subnode.formula });
                const instruments = [...instrumentArr, ...formulaArr];
                instrumentArr = [...new Set(instruments)];
              }else{
                entityInstrument.push({ title: b.subnode.name, id: b.subnode.id,type: 'instrument',formula: b.subnode.formula});
                instrumentArr.push(b.subnode.formula);
                instrumentArr = [...new Set(instrumentArr)];
              }
            } else {
              entityInstrument.push({ title: b.name, id: b.id, type: 'real' });
              instrumentArr.push(b.id);
              instrumentArr = [...new Set(instrumentArr)];
            }
          } else {
            if (b.hasOwnProperty("children")) {
              generateArr(b);
            }
          }
        });
      };


      const indfinder1 = (a, id) => {
        a.children.forEach(function (b) {
          if (
            (b.type === "entity" || b.type === "node" || b.type === "asset") &&
            b.id === id
          ) {
            if (b.hasOwnProperty("children")) {
              generateArr(b);
              subnodeInstrument(b);
            }
          } else if (b.hasOwnProperty("children")) {
            indfinder1(b, id);
          }
        });
      };


      if (tempProps5.subnode) {
        if (tempProps5.subnode.formula) {
          const formula = tempProps5.subnode.formula;
          let formulaArr = formula.split(/([-+*\/()])/g);
          formulaArr = formulaArr.filter(String);
          let re = "-+*/()";
          formulaArr = formulaArr.filter((val) => !re.includes(val));
          formulaArr = formulaArr.map((val) => val.split(".")[0]);
          const instruments = [...instrumentArr, ...formulaArr];
          instrumentArr = [...new Set(instruments)];
          entityInstrument.push({ title: tempProps5.subnode.name, id: tempProps5.subnode.id,type: tempProps5.subnodeType == "virtual"?"virtual":"instrument",formula: tempProps5.subnode.formula });
        } else if (tempProps5.subnodeType == "instrument") {
          entityInstrument.push({ title: tempProps5.subnode.name, id: tempProps5.subnode.id,type: 'instrument',formula: tempProps5.subnode.formula});
          instrumentArr.push(tempProps5.subnode.id);
          instrumentArr = [...new Set(instrumentArr)];
        }
      }
      const subnodeInstrument = (sub) => {
        if (sub.subnode) {
          if (sub.subnode.formula) {
            if(sub.subnodeType === 'virtual'){
              const formula = sub.subnode.formula;
              let formulaArr = formula.split(/([-+*\/()])/g);
              formulaArr = formulaArr.filter(String);
              let re = "-+*/()";
              formulaArr = formulaArr.filter((val) => !re.includes(val));
              formulaArr = formulaArr.map((val) => val.split(".")[0]);
              entityInstrument.push({ title: sub.subnode.name, id: sub.subnode.id,type: "virtual",sub: sub.subnode.formula });
              const instruments = [...instrumentArr, ...formulaArr];
              instrumentArr = [...new Set(instruments)];
            }else{
              entityInstrument.push({ title: sub.subnode.name, id: sub.subnode.id,type: 'instrument',formula: sub.subnode.formula});
              instrumentArr.push(sub.subnode.formula);
              instrumentArr = [...new Set(instrumentArr)];
            }
          } else if (sub.subnodeType == "instrument") {
            entityInstrument.push({ title: sub.subnode.name, id: sub.subnode.id,type: 'instrument',formula: sub.subnode.formula});
            instrumentArr.push(sub.subnode.id);
            instrumentArr = [...new Set(instrumentArr)];
          }
        }
        sub.children.forEach(function (subnode) {
          if (subnode.type === 'instrument') {
            entityInstrument.push({ title: subnode.name, id: subnode.id, type: 'real' });
            instrumentArr.push(subnode.id);
            instrumentArr = [...new Set(instrumentArr)];
          }
          if (
            subnode.type === "entity" ||
            subnode.type === "node" ||
            subnode.type === "asset"
          ) {
            if (subnode.hasOwnProperty("children")) {
              subnodeInstrument(subnode);
            }
          }
        });
      };

      tempProps5.children.forEach(function (a) {//NOSONAR
        let aobj = a
        for (let q of selectedEntityList[0]) {
          if (
            (a.type === "entity" || a.type === "node" || a.type === "asset") &&
            a.id === q.id
          ) {
            if(a.hasOwnProperty("children")){
              aobj = a
           }else{
            aobj = {...a,children:[a.subnode&&Object.keys(a.subnode).length>0?a.subnode:{}]}
            
           }
            if (aobj.hasOwnProperty("children")) {
              generateArr(aobj);
              subnodeInstrument(aobj);
            }
          } else if (aobj.hasOwnProperty("children")) {
            indfinder1(aobj, q.id);
          }
        }
      });
      setAggregatedInstruments(entityInstrument);
      if (instrumentArr.length > 0) {
        getMetricsForInstrument(instrumentArr)
        setAggregatedMetric([])
      }else{
        setParameterList([])
        setAggregatedMetric([])
      }
    } else {
      setSnackMessage(t("PlsSelectHier"));
      setSnackType("warning");
      handleSnackOpen();
    }
  };

  const handleGroupByChange = (event) => {
    if(event.target.value === 'hour'){
      setEmailAccessChecked(false);
      setUserFields([]) 
      setUserIDs([])
      setChannelFields([]);
      setChannelIDs([])
    }
    setReportType(event.target.value);
    if ((!aggregationCheck || !aggregationVal) && groupAggregation) {
      setAggregationCheck(true);
    }
  };

 

  const handlemailCheck = (e) => {
    setEmailAccessChecked(!EmailAccessChecked);
    if(!e.target.checked){
      setUserFields([]) 
      setUserIDs([])
      setChannelFields([]);
      setChannelIDs([])
    }
  };
  
  const handlehierarchyChange = (event) => {
    
    let checkVal = "";
    if (event.target.value !== "" && event.target.value !== undefined) {
      setHierarchyVal(event.target.value);
      checkVal = event.target.value;
    } else {
      const hierarchyId =
        selectedHierarchyData.length > 0
          ? selectedHierarchyData[0].hierarchy.id
          : 0;
      setHierarchyVal(hierarchyId);
      checkVal = hierarchyId;
    }
    let tempProps1 = JSON.parse(JSON.stringify(hierarchyView));
    let tempProps2 = tempProps1.filter((val, index) => val.id === checkVal); 
    let tempProps =
      tempProps2.length > 0 ? tempProps2[0].hierarchy[0] : { children: [] };
    let reportingMetricArr = [];
    let entityArr = [];
    const indfinder = (a) => {
      a.forEach( (b)=> {
        if (b.type === "instrument") {
          reportingMetricArr.push({ title: b.name, id: b.id, type: 'real' });
        }
        if (b.type === "entity" || b.type === "node" || b.type === "asset") {
          if(b.subnode && b.subnode.id){
            reportingMetricArr.push({ title: b.subnode.name, id: b.subnode.id,type: a.subnodeType === 'virtual'?'virtual':'instrument',formula: b.subnode.formula });
          }
          entityArr.push({ title: b.name, id: b.id, type: b.subtype });
        }
        if (b.hasOwnProperty("children") && b.children.length > 0) {
          indfinder(b.children);
        }
      });
    };

    tempProps.children.forEach(function (a) {
      if (a.type === "instrument") {
        reportingMetricArr.push({ title: a.name, id: a.id, type: 'real' });
      }
      if (a.type === "entity" || a.type === "node" || a.type === "asset") {
        if(a.subnode && a.subnode.id){
          reportingMetricArr.push({ title: a.subnode.name, id: a.subnode.id,type: a.subnodeType === 'virtual'?'virtual':'instrument',formula: a.subnode.formula });
        }
        entityArr.push({ title: a.name, id: a.id, type: a.subtype });
      }
      if (a.hasOwnProperty("children")) {
        indfinder(a.children);
      }
    }); 
    setEntityArr(entityArr);
    console.log(reportingMetricArr,"reportingMetricArr2")
    setReportingMetrics(reportingMetricArr);
    setSelectedEntityVal([]); 
    setInstrumentRow([{Field: 1}]);
    setParameterList([]);
    setAggregatedMetric([]);
  };
//#region hard coded options for select boxes
  const aggregationOpt = [
   
    { id: "avg", title: t("Average") },
    { id: "min", title: t("Minimum") },
    { id: "max", title: t("Maximum") },
    { id: "sum", title: t("Sum") },
    { id: "cons",title:t("Consumption") },
    { id: "last",title: t("Last") }, //The default Last should always be the last entry of aggregation mode
  ];

  const cumulativeAggregationOpt = [
    { id: 'single', title: 'Single' },
    { id: 'cumulative', title: 'Cumulative' }
  ]

  const cycleStartAtOpt = [
    { id: 1, title: 1 },
    { id: 2, title: 2 },
    { id: 3, title: 3 },
    { id: 4, title: 4 },
    { id: 5, title: 5 },
    { id: 6, title: 6 },
    { id: 7, title: 7 },
    { id: 8, title: 8 },
    { id: 9, title: 9 },
    { id: 10, title: 10 },
    { id: 11, title: 11 },
    { id: 12, title: 12 },
    { id: 13, title: 13 },
    { id: 14, title: 14 },
    { id: 15, title: 15 },
    { id: 16, title: 16 },
    { id: 17, title: 17 },
    { id: 18, title: 18 },
    { id: 19, title: 19 },
    { id: 20, title: 20 },
    { id: 21, title: 21 },
    { id: 22, title: 22 },
    { id: 23, title: 23 },
    { id: 24, title: 24 },
    { id: 25, title: 25 },
    { id: 26, title: 26 },
    { id: 27, title: 27 },
    { id: 28, title: 28 },
    { id: 29, title: 29 },
    { id: 30, title: 30 },
    { id: 31, title: 31 },
  ]

  const groupByOptions = [
    { id: "hour",  title: t("Hourly") },
    { id: "shift", title: t("ShiftWise") },
    { id: "day",   title: t("Daywise") },
    { id: "month", title: t("Monthwise") },
    { id: "year",  title: t("Yearwise") },
  ]; 

  let TimeOption =[
    {value: '01:00',id : '01:00'},
    {value: '02:00',id : '02:00'},
    {value: '03:00',id : '03:00'},
    {value: '04:00',id : '04:00'},
    {value: '05:00',id : '05:00'},
    {value: '06:00',id : '06:00'},
    {value: '07:00',id : '07:00'},
    {value: '08:00',id : '08:00'},
    {value: '09:00',id : '09:00'},
    {value: '10:00',id : '10:00'},
    {value: '11:00',id : '11:00'},
    {value: '12:00',id : '12:00'},
]

if(HF.HM === 'HH:mm'){
  TimeOption =[
    {value: '00:00',id : '00:00'},
    {value: '01:00',id : '01:00'},
    {value: '02:00',id : '02:00'},
    {value: '03:00',id : '03:00'},
    {value: '04:00',id : '04:00'},
    {value: '05:00',id : '05:00'},
    {value: '06:00',id : '06:00'},
    {value: '07:00',id : '07:00'},
    {value: '08:00',id : '08:00'},
    {value: '09:00',id : '09:00'},
    {value: '10:00',id : '10:00'},
    {value: '11:00',id : '11:00'},
    {value: '12:00',id : '12:00'},
    { id: "13:00", value: "13:00" },
    { id: "14:00", value: "14:00" },
    { id: "15:00", value: "15:00" },
    { id: "16:00", value: "16:00" },
    { id: "17:00", value: "17:00" },
    { id: "18:00", value: "18:00" },
    { id: "19:00", value: "19:00" },
    { id: "20:00", value: "20:00" },
    { id: "21:00", value: "21:00" },
    { id: "22:00", value: "22:00" },
    { id: "23:00", value: "23:00" }
]
} 
//#endregion

  const handleSnackOpen = () => {
    setOpenSnack(true);
  };
  const handleChangeTime = (event) =>{
    setStartedAtTime(event.target.value);
  }
  const onHandleArrG = (event)=>{
    if(event.target.value === 'none'){
      setTableLayout(3)
      setAggregationValue('')
    }else{
      setAggregationValue(event.target.value);
    }

  }
 
  // Add user to send alarm
  const handleMultiAlertUsersChange = (e) => { 
    if(e && e.length === 0){
      setUserFields([]);
      setUserIDs([])
      setAllUsers(false)
      return;
    }
    
        let selectedUserID = e.map(v=> {
          let userid = UserOption.filter(f=> f.name === v.name)
          return userid.length>0 ? userid[0].id : '';
        }) 
        setUserFields(e) 
        setUserIDs(selectedUserID)
        setAllUsers(false)
    
  }


  // Add channel to send Alarm
  const handleMultiChannelChange = (e) => {
      if(e && e.length === 0){
        setChannelFields([]);
        setChannelIDs([])
        setAllChannels(false)
        return;
      }
      
      let ChannelID = e.map(v=> { 
          let CHid = ChannelList.filter(f=> f.name === v.name)
          return CHid.length>0 ? CHid[0].id : '';  
      })  
      setChannelFields(e);
      setChannelIDs(ChannelID)
      setAllChannels(false) 
       
  }
//#region instrument type, aggregation enable or disable and table layout checkbox and radion button 
  const handleInstrumentSelectType = (type) =>{
    setInstrumentSelectionType(type)
    setInstrumentRow([{Field: 1}]);
    setHierarchyVal('')
    setSelectedEntityVal([])
    setAggregatedInstruments([])
    setAggregatedMetric([]);
    setParameterList([])
    setEntityArr([])
    setReportingMetrics([])
    setAggregationCheck(false);
    setAggregationVal("");
    setGroupByChecked(false);
    setReportType("");
    setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
    setGroupByTimeMeridVal("AM"); 
    setEmailAccessChecked(false);
    setUserFields([]) 
    setUserIDs([])
    setChannelFields([]);
    setChannelIDs([])
  }
  const handleGroupAggregation = () => {
    setGroupAggregation(!groupAggregation)
    setInstrumentRow([{Field: 1}]);
    setHierarchyVal('')
    setSelectedEntityVal([])
    setAggregatedInstruments([])
    setAggregatedMetric([]);
    setReportingMetrics([])
    setParameterList([])
    setEntityArr([])
    setAggregationCheck(false);
    setAggregationVal("");
    setGroupByChecked(false);
    setReportType("");
    setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
    setGroupByTimeMeridVal("AM");
    setEmailAccessChecked(false);
    setUserFields([]) 
    setUserIDs([])
    setChannelFields([]);
    setChannelIDs([])
  }
  const handletableLayout = (val)=> setTableLayout(val)
  //#endregion

 //#region instrument row crud
  const addInstrumentRow = () =>{
    let existRow = [...instrumentRow];
    const newRow = {Field: existRow.length+1};
    existRow.push(newRow);
    setInstrumentRow(existRow);
  }
  const deleteCurrentRow = (field) =>{
    let allRow = [...instrumentRow];
    const filteredRow = allRow.filter(row=>row.Field !== field).map((fields,index)=>{fields.Field=index+1;return fields});
    setInstrumentRow(filteredRow);
  }
//#endregion

//#region grouped instrument and metric select
  const handleInstrumentSelect = (instruments)=>{
    if(instruments.length>0){
      let instrument_id = [];
      instruments.forEach(inst=>{
        if(inst.type === 'real'){
          instrument_id.push(inst.id)
        }else{
          if(inst.type === 'virtual'){
            const formula = inst.formula;
            let formulaArr = formula.split(/([-+*\/()])/g);
            formulaArr = formulaArr.filter(String);
            let re = "-+*/()";
            formulaArr = formulaArr.filter((val) => !re.includes(val));
            formulaArr = formulaArr.map((val) => val.split(".")[0]);
            instrument_id = [...instrument_id,...formulaArr];
          }else{
          instrument_id.push(inst.id)
          }
        }
      }); 
      getMetricsForInstrument(instrument_id)
      setAggregatedMetric([])
      
    }else{
      setParameterList([])
      setAggregatedMetric([])
    }    
    setAggregatedInstruments(instruments) 
  }
  const handleAggMetricSelect = (metrics)=>{
    if(metrics.length > 1){
      setAggregationCheck(false);
      setAggregationVal("");
      setGroupByChecked(false);
      setReportType("");
      setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
      setGroupByTimeMeridVal("AM");
      setTableLayout(3)
    }
    setAggregatedMetric(metrics)
  }
  //#endregion 

 //#region individual instrument, metric and aggregate select
  const handleIndividualInstrumentSelect = (option,field)=>{
    let existInstRow = [...instrumentRow];
    const existIndex = existInstRow.findIndex(x=>x.Field === field);
    let metricList = [];
    option.forEach(inst=>{
      if(inst.formula){
        let arithmetic = inst.formula.split(/([-+*\/()])/g);
        arithmetic = arithmetic.filter(word => word.trim().length > 0);
        let re = '-+*\/()';
        let metricparam = [];
        // eslint-disable-next-line array-callback-return
        arithmetic.map(param => { 
          if (!re.includes(param)) {
            if(param.split('.')[1]){
              metricparam.push(param.split('.')[1]); 
            } 
          }
        })
        metricparam = [...new Set(metricparam)]; 
        const metric = props.metricList && props.metricList.length > 0?props.metricList.filter(met=>metricparam.includes(met.name)):[]; 
        metricList = [...metricList,...metric];
      }else{
        const exist = props.instrumentMetricsListData.filter(metric=>inst.id === metric.instruments_id).map(x=>x.metric);
        if(exist.length > 0){
          metricList = [...metricList, ...exist];
        }
      }   
    })     
    // Filter Unique metrics
    const uniquemetrics = metricList.filter((obj, index) => { 
      return index === metricList.findIndex(o => obj.id === o.id);
  });

    existInstRow[existIndex]['instrument'] =  option;        
    existInstRow[existIndex]['metric_list'] =  uniquemetrics;   
    existInstRow[existIndex]['metrics'] =  [];    
    setInstrumentRow(existInstRow);
    setLoad(false)

  }
  const handleIndividualMetricSelect = (metric,field) =>{
    let existInstRow = [...instrumentRow];
    const existIndex = existInstRow.findIndex(x=>x.Field === field);
    existInstRow[existIndex]['metrics'] =  metric;  
    setInstrumentRow(existInstRow)
    setLoad(false)

  }
  const handleIndividualAggregateSelect = (e,field) =>{ 
    let existInstRow = [...instrumentRow];
    const existIndex = existInstRow.findIndex(x=>x.Field === field);
    existInstRow[existIndex]['aggregate'] =  e.target.value;  
    setInstrumentRow(existInstRow)
    setLoad(false)
  }
  //#endregion

  function IntruOption(){
    if(instrumentSelectionType === 1){
      console.log("HierarchyInstrumentList",HierarchyInstrumentList)
      return HierarchyInstrumentList.map(item => ({
        ...item,
        id: item.id,
        title: item.title, 
        discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 
      
      }))
    }else{
      if(RealVirtualInstrumentsListData && RealVirtualInstrumentsListData.length>0){
        return RealVirtualInstrumentsListData.map(item => ({
          ...item,
          id: item.id,
          title: item.title, 
          discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 
        
        }))
      }else{return []}
    }
  }


  function GroupByState(){
    if((groupAggregation && aggregatedMetrics.length > 1) || (!aggregationValue && groupAggregation)){
      return true
    }else{return checkStat == 1 ? true : false}  
  }

  const handleAccessChange =(e)=>{
    setaccess(e.target.value)
  }

  const handleConfirmSave=()=>{
    setopenModel(false)
    saveNewReport()
  }
  const triggerConfirmationModel=()=>{
    setopenModel(true)

  }

  
const listArr = [{ index: 0, name: "Reports" },{ index: 1, name: "New Report"}]
const handleActiveIndex = (index) => {
  if(index === 0){
  setSelectedReports('')
  props.resetTags()
  }

}

const realInstruments = RealVirtualInstrumentsListData?.filter(item => item.type === 'real') || [];
const virtualInstruments = RealVirtualInstrumentsListData?.filter(item => item.type === 'virtual') || [];

const formattedOptions = [...realInstruments, ...virtualInstruments].map(item => ({
  ...item,
  id: item.id,
  title: item.title, 
  discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 

}));
useEffect(() => {
  console.log("instrumentSelectionType",instrumentSelectionType,groupAggregation,formattedOptions)

},[instrumentSelectionType,groupAggregation])

  return (
    <div>
        <React.Fragment>

          <div className="py-2 px-4 flex items-center justify-between h-[48px] bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
          <Breadcrumbs breadcrump={listArr} onActive={handleActiveIndex} />
              <div className="flex items-center gap-2"> 
                <Button
                    type="secondary"
                    value={t("Cancel")}
                    onClick={()=>{setisCancelConfirmation(true)}}
                  />
                  <Button
                    type="primary"
                    loading={InsertReportLoading}
                    value={t("create")}
                    onClick={triggerConfirmationModel}
                  />                 
              </div>

          </div>
        </React.Fragment>
      <HorizontalLine variant="divider1" />
      <div className="py-4 bg-Background-bg-primary  dark:bg-Background-bg-primary-dark h-[93vh] overflow-y-auto">
        <Grid container>
        <Grid item xs={3} >
        </Grid>
        <Grid item xs={6} >
        <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
        <ParagraphText
                variant={"heading-02-xs"}
                value={t("Basic")}
                
              />
              </Grid>
       
          <Grid item xs={12} sm={12}>
            <InputFieldNDL
              id="newReportName"
              defaultValue={""}
              inputRef={titleRef}
              placeholder={t("NewReport")}
              label={t("Report title")}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <InputFieldNDL
              id="newReportDesc"
              defaultValue={""}
              inputRef={descriptionRef}
              placeholder={t("Description")}
              multiline
              row={4}
              label={t("Description")}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
          <SelectBox
                labelId=""
                id="access"
                auto={false}
                multiple={false}
                options={[{id:"public",name:"Public"},{id:"private",name:"Private"},{id:"shared",name:"Shared"}]}
                isMArray={true}
                checkbox={false}
                value={access}
                onChange={handleAccessChange}
                keyValue="name"
                keyId="id"
                error={false}
                label={t("Access")}
                              />
          </Grid>
          {
              access && access === 'shared' && 
          <Grid item xs={12} sm={12}>
              <SelectBox
              id="userSelect"
              auto={true}
              multiple={true}
              options={props.UserOption}
              isMArray={true}
              keyValue={"value"}
              label={"Share with"}
              placeholder={t('Select User')}
              keyId={"id"}
              value={shareduserList}
              // inputRef={aggregationRef} 
              onChange={(e) => setshareduserList(e)}
          />
          </Grid>
          }
          <Grid item xs={12} sm={12}>
          <HorizontalLine variant="divider1" />
          </Grid>
          <Grid item xs={12} sm={12}>
        <ParagraphText
                variant={"heading-02-xs"}
                value={t("Labels")}
                
              />
              </Grid>
          <Grid item xs={6} sm={6}>
                <RadioNDL name={'Hierarchy'} labelText={t('Hierarchy')} id={'Hierarchy'} checked={instrumentSelectionType ===1?true: false} onChange={()=>handleInstrumentSelectType(1)}/>
          </Grid>
          <Grid item xs={6} sm={6}>
          <RadioNDL name={'Instrument/Virtual Instrument'} labelText={t('Instrument/Virtual Instrument')} id={'Instrument/Virtual Instrument'} checked={instrumentSelectionType ===2?true: false} onChange={()=>handleInstrumentSelectType(2)}/> 
            </Grid>
        
          {
            instrumentSelectionType === 1 &&
             <Grid item xs={12} sm={12}>
              <SelectBox
                labelId=""
                id="hierarchy"
                inputRef={hierarchyRef}
                auto={false}
                multiple={false}
                options={hierarchyView}
                isMArray={true}
                checkbox={false}
                value={hierarchyVal}
                onChange={handlehierarchyChange}
                keyValue="name"
                keyId="id"
                error={false}
                label={t("Hierarchy")}
                defaultDisableOption={true}
                              />
            </Grid>
          }
            <Grid item xs={12} sm={12}>
            <CustomSwitch
              checked={groupAggregation}
              primaryLabel={t('Group Aggregation')}
              switch={false}
              disabled={false}
              onChange={handleGroupAggregation}
            />
          </Grid> 
        </Grid> 
        {          
          groupAggregation &&
          <React.Fragment>    
          <br/>
            {/*#region if report has  aggregated instrument and metrics */}
              <Grid container spacing={4}>
                { 
                instrumentSelectionType === 1 &&
                  <Grid item xs={12} sm={12}>
                    <SelectBox
                      labelId=""
                      label={t("Entity")}
                      id="metric-entity-select"
                      auto={true}
                      multiple={true}
                      value={selectedEntityVal}
                      options={reportingEntityArr}
                      isMArray={true}
                      checkbox={false}
                      onChange={handleEntitySelect}
                      keyValue="title"
                      keyId="id"
                      error={false} 
                      defaultDisableOption={true}
                      placeholder={t("SelectEntityForms")}
                      
                    /> 
                  </Grid>
                }
                {
                 instrumentSelectionType !== 1 &&
                    <Grid item xs={12} sm={12}>
                      {/* entity wise instrument selection */}
                     
                      <SelectBox
                        labelId=""
                        id="metric-entity-select"
                        auto={true}
                        multiple={true}
                        label={t('Instrument/ Virtual Instrument')}
                        value={aggregatedInstruments}
                        options={formattedOptions}
                        isDescription={true}
                        isMArray={true}
                        checkbox={false}
                        onChange={
                          handleInstrumentSelect
                        }
                        keyValue="title"
                        keyId="id"
                        
                        error={false} 
                        defaultDisableOption={true}
                        
                        
                      /> 
                    </Grid>
                } 
                 <Grid item xs={groupAggregation ? 6 : 12}>
             
                  <SelectBox
                    labelId=""
                    id="metric-entity-select"
                    auto={true}
                    multiple={true}
                    label={t("Metric")}
                    value={aggregatedMetrics}
                    options={(parameterList && parameterList.length>0) ? parameterList:[]}
                    optionloader={MetricsForInstrumentLoading}
                    isMArray={true}
                    checkbox={false}
                    onChange={handleAggMetricSelect}
                    keyValue="title"
                    keyId="name"
                    error={false}
                    defaultDisableOption={true}
                    
                  />
                </Grid>
                {
                  groupAggregation && aggregatedMetrics.length < 2  &&
                  <Grid item xs={6} sm={6}>
                  <SelectBox
                          labelId=""
                          id="metric-entity-select"
                          auto={false}
                          multiple={false}
                          options={[...aggregationOpt,...[{id:"none",title:"None"}]]}
                          isMArray={true}
                          checkbox={false}
                          onChange={onHandleArrG}
                          label="Aggregation"
                          value={aggregationValue ? aggregationValue : "none"}
                          keyValue="title"
                          keyId="id"
                          error={false}
                          defaultDisableOption={true}
                          placeholder={t("SelectAggregation")}
                        />
                        </Grid>  
                }
               
                     
            </Grid> 
            <Grid item xs={12} sm={12}>
              <div className="py-4">
              <HorizontalLine variant="divider1" />

              </div>
                      </Grid>
            {/*#endregion */}
          </React.Fragment>
        }
        {
          !groupAggregation &&
          (
            <div>
              {/* if report has individual row wise instrument and metrics */}
              <Grid container spacing={4} style={{alignItems:"end",marginTop:"12px"}}> 

              {
                instrumentRow && instrumentRow.length > 0 && instrumentRow.map(row=>{ 
                  return (
                    <React.Fragment>
  <Grid item xs={11}>
                     
                     <SelectBox
                       labelId=""
                       id="metric-entity-select"
                       auto={true}
                       label={t("Instruments")} 
                       multiple={true}
                       dynamic={instrumentRow}
                       limitTags={1}
                       value={(row.instrument && row.instrument.length>0) ? row.instrument:[]}
                       options={IntruOption()}
                       isDescription={true}
                       isMArray={true}
                       checkbox={false}
                       onChange={
                         (e)=>handleIndividualInstrumentSelect(e,row.Field)
                       }
                       keyValue="title"
                       keyId="id"
                       error={false} 
                       defaultDisableOption={true}
                       placeholder={"Select Instrument"}
                       
                     />   
                   </Grid>
                   <Grid xs={1}>
                     {
                       instrumentRow.length !== 1 &&
                       <div className="flex items-center">
                       <Button icon={Delete} danger type={'ghost'} onClick={()=>deleteCurrentRow(row.Field)}/>
                       </div>
                     }
                   </Grid>
                   <Grid item  xs={6}>
                   <SelectBox
                     labelId=""
                     id="metric-entity-select"
                     auto={true}
                     multiple={true}
                     dynamic={instrumentRow}
                     label={t("ReportingMetric")}
                     limitTags={1}
                     value={row.metrics && row.metrics.length>0?row.metrics:[]}
                     options={row.metric_list && row.metric_list.length>0?row.metric_list:[]}
                     isMArray={true}
                     checkbox={false}
                     onChange={(e,option)=>handleIndividualMetricSelect(e,row.Field)}
                     keyValue="title"
                     keyId="id"
                     error={false}
                     defaultDisableOption={true}
                     
                     
                   /> 
                   </Grid>
                   <Grid item xs={6}>
                   <SelectBox
                     labelId=""
                     id="metric-entity-select"
                     auto={true}
                     label={t("Aggregation")} 
                     value={row.aggregate && row.aggregate.length>0?row.aggregate:''}
                     options={aggregationOpt}
                     isMArray={true}
                     checkbox={false}
                     onChange={(e)=>handleIndividualAggregateSelect(e,row.Field)}
                     keyValue="title"
                     keyId="id"
                     error={false}
                     defaultDisableOption={true}
                   /> 
                   </Grid>
                    </React.Fragment>
                  
                  )                
                })
              }         
                 <Grid item xs={12}>
              <Button  style={{float: 'right',marginTop: 10}} value={t("AddInstru")} icon={Plus} type={'ghost'} onClick={addInstrumentRow}/>
                  
                  </Grid>  
                  <Grid item xs={12} sm={12}>
              <HorizontalLine variant="divider1" />
                      </Grid>  
              </Grid>
            </div>
          )
        }  
        <Grid container spacing={4}>  
          <Grid item xs={12} sm={12}>
            <ParagraphText disabled={(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationValue && groupAggregation)) ? true : false}    variant={"heading-02-xs"} value={t('Metric Orientation')} />
            </Grid>
            <Grid item xs={12} sm={12}>
            <div className="flex items-center justify-between gap-3">
              <RadioNDL disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationValue && groupAggregation)) ? true : false} name={'Column'} labelText={t('Column')} id={'Column'} checked={tableLayout ===1?true: false} onChange={()=>handletableLayout(1)}/>
              <RadioNDL  disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationValue && groupAggregation)) ? true : false} name={'Row'} labelText={t('Row')} id={'Row'} checked={tableLayout ===2?true: false} onChange={()=>handletableLayout(2)}/>
              <RadioNDL  disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationValue && groupAggregation)) ? true : false}  name={'None'} labelText={t('None')} id={'None'} checked={tableLayout ===3?true: false} onChange={()=>handletableLayout(3)}/>
            </div>
          </Grid>
          <Grid item xs={12} sm={12}>
              <HorizontalLine variant="divider1" />
          </Grid>  
     
         <Grid item xs={12} sm={12}>
         <CustomSwitch
                    checked={groupByChecked}
                    id={"GroupBy"}
                    switch={false}
                    disabled={GroupByState() }
                    onChange={handleGroupbyCheck}
                    primaryLabel={t("GroupBy")} 
                  />
         </Grid>
               
          <Grid item xs={(reportType !=="" && reportType !=="hour" && reportType!=="shift")  ? 6 : 12} >
              {groupByChecked && (
                <SelectBox
                  labelId=""
                  id="metric-entity-select"
                  auto={false}
                  multiple={false}
                  options={groupByOptions}
                  isMArray={true}
                  checkbox={false}
                  onChange={handleGroupByChange}
                  keyValue="title"
                  keyId="id"
                  error={false}
                  value={reportType}
                  label={'Type'}
                  defaultDisableOption={true}
                />
              ) }
          </Grid> 
          
            {(reportType !=="" && reportType !=="hour" && reportType!=="shift") &&
            <Grid item xs={6} style={{display:'flex',alignItems:'end'}}> 
                <div style={{width:'100%'}}>
                  <div
                    style={{  display: "flex" }}> 
                        <SelectBox
                          labelId=""  
                          label={t("Starts At")}
                          id="metric-entity-select"
                          auto={false}
                          options={TimeOption}
                          isMArray={true}
                          checkbox={false}
                          onChange={handleChangeTime}
                          keyValue="value"
                          keyId="id"
                          error={false}
                          value={startedAtTime}
                          placeholder={t("Select Time")}
                      
                        />
                      </div>
                    {HF.HM !== 'HH:mm' &&
                    <Button
                      id="ampm"
                      type="secondary"
                      onClick={() =>
                        setGroupByTimeMeridVal(
                          groupByTimeMeridVal === "AM" ? "PM" : "AM"
                        )
                      }
                      value={groupByTimeMeridVal}
                    />} 
                </div>
          </Grid>
            }
            {
              groupByChecked && 
              <Grid item xs={12} sm={12}>
              <ParagraphText value='Note: Report type requires an aggregation to be set.' variant="paragraph-s" color='tertiary' />
              </Grid>
            }
               <Grid item xs={12} sm={12}>
              <HorizontalLine variant="divider1" />
          </Grid>  

          </Grid>
          <Grid container spacing={4} >
            
            {reportType !=="hour"  && reportType !=="" &&
            <Grid item xs={12} sm={12}>
              <CustomSwitch
                    checked={EmailAccessChecked}
                    primaryLabel={t("SendEmail")}
                    switch={false}
                    disabled={false}
                    onChange={handlemailCheck}
                  />
            </Grid>}

            {
              ((reportType === 'shift') && EmailAccessChecked) && 
              <Grid item xs={4} sm={4}>
                <SelectBox
                        id="cumulativeAggregation"
                        auto={false}
                        options={cumulativeAggregationOpt}
                        isMArray={true}
                        keyValue={"title"}
                        label={"Grouping"}
                        keyId={"id"}
                        value={cumulativeAggregation}
                        onChange={(e) => setCumulativeAggregation(e.target.value)}
                    />
                </Grid>
            }
            {
              (reportType === 'day' && EmailAccessChecked) &&
              <>
              <Grid item xs={6} >
                <SelectBox
                        id="cumulativeAggregation"
                        auto={false}
                        options={cumulativeAggregationOpt}
                        isMArray={true}
                        keyValue={"title"}
                        label={"Grouping"}
                        keyId={"id"}
                        value={cumulativeAggregation}
                        onChange={(e) => setCumulativeAggregation(e.target.value)}
                    />
                </Grid>
                {
                  cumulativeAggregation !== 'cumulative' && 
                  <Grid item xs={6} >
                  
                </Grid>
                }
                
                {
                  cumulativeAggregation === 'cumulative' && 
                
                    <Grid item xs={6} >
                    <SelectBox
                            id="cycleStartsAt"
                            auto={false}
                            options={cycleStartAtOpt}
                            isMArray={true}
                            keyValue={"title"}
                            label={"Cycle Starts At"}
                            keyId={"id"}
                            value={cycleStartAt}
                            onChange={(e) => setCycleStartAt(e.target.value)}
                        />
                    </Grid>
                }
                </>
            }

            {EmailAccessChecked &&
            <Grid item xs={6}>
                <SelectBox
                        labelId="assetuserLbl"
                        label={t('Users')}
                          id="Select-asset"
                        auto={true}
                        multiple={true}
                        options={UserOption}
                        isMArray={true}
                        checkbox={true}
                        value={userFields}
                        renderValue={(selected) => selected.length>0 ? selected.join(",") : t("Select Users")}
                        onChange={handleMultiAlertUsersChange} 
                        keyValue="value"
                        keyId="name" 
                        selectall={true}
                        isAllSelected={AllUsers}
                        selectAllText={"All User"}
                />
            </Grid>}
            {EmailAccessChecked &&
            <Grid item xs={6}>
                <SelectBox
                        labelId="assetuserLbl"
                        label={t('CommunicationChannel')}
                        id="Select-asset"
                        auto={true}
                        multiple={true}
                        options={ChannelList}
                        isMArray={true}
                        checkbox={true}
                        value={channelFields}
                        renderValue={(selected) => selected.length>0 ? selected.join(",") : t("SelectChannel")}
                        onChange={handleMultiChannelChange} 
                        keyValue="name"
                        keyId="name" 
                        selectall={true}
                        isAllSelected={AllChannels}
                        selectAllText={"All Channel"}
                />
            </Grid>}
              {reportType !== "hour" && reportType !== "" &&
                <Grid item xs={12} sm={12}>
                  <HorizontalLine variant="divider1" />
                </Grid>
              }
          </Grid>
        </Grid>
        <Grid item xs={3} >
        
        </Grid>
        </Grid>
       
          
          
      </div> 
      <ModalNDL open={openModel} size="lg">
        <ModalHeaderNDL>
          <ParagraphText variant="heading-02-xs" value={"Confirmation"} />
        </ModalHeaderNDL>
        <ModalContentNDL>
        <ParagraphText variant="paragraph-s" color="secondary" value={"Report will be generated for the fields which are filled, fields remain unfilled will not be considered."} />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button
          type='secondary'
            value={t("Cancel")}
            onClick={()=>setopenModel(false)}
          />
          <Button value={"Proceed"}  onClick={handleConfirmSave}    />
        </ModalFooterNDL>
      </ModalNDL>

      <ModalNDL open={isCancelConfirmation} size="lg">
        <ModalHeaderNDL>
          <ParagraphText variant="heading-02-xs" value={"Exit Without Saving ?"} />
        </ModalHeaderNDL>
        <ModalContentNDL>
        <ParagraphText variant="paragraph-s" color="secondary" value={"Are you sure want to cancel? Save your changes before exiting to avoid losing progress."} />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button
          type='secondary'
            value={t("Cancel")}
            onClick={()=>setisCancelConfirmation(false)}
          />
          <Button value={"Exit"}  onClick={cancelReport}    />
        </ModalFooterNDL>
      </ModalNDL>
    </div>

  );
}
