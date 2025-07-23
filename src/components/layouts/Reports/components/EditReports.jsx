/* eslint-disable array-callback-return */
/* eslint-disable no-useless-escape */
import React, { useState, useEffect,useRef } from "react";
import Grid from "components/Core/GridNDL"; 
import Typography from "components/Core/Typography/TypographyNDL"; 
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL'; 
import Button from "components/Core/ButtonNDL";  
import moment from 'moment'; 
import { useRecoilState } from "recoil";    
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import {
  defaultHierarchyData, 
  userData,
  hierarchyData,
  snackToggle,snackMessage,snackType,selectedReport
} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import useMetricsForInstrument from "components/layouts/Reports/hooks/useMetricsForInstrument";
import useUpdateReport from "components/layouts/Reports/hooks/useUpdateReport";
import { useAuth } from "components/Context";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Delete from 'assets/neo_icons/NewReportIcons/delete_report.svg?react';
import Plus from 'assets/neo_icons/Menu/add.svg?react';
import { faLinesLeaning } from "@fortawesome/free-solid-svg-icons";
import Breadcrumbs from 'components/Core/Bredcrumbs/BredCrumbsNDL' 


export default function EditReports(props) {//NOSONAR
  console.log(props.data,'props.data')
  const { HF } = useAuth();
  const { t } = useTranslation(); 
  const [newReportName, setnewReportName] = useState(props.data.name); 
  const [descriptionVal, setDescriptionVal] = useState(props.data.description);
  const [parameterList, setParameterList] = useState([]);
  const [HierarchyInstrumentList, setReportingMetrics] = useState([]);
  const [reportingEntityArr, setEntityArr] = useState([]); 
  const [, setInstrumentsAutocomplete] = useState([]);
  const [entityAutocomplete, setEntityAutocomplete] = useState([]);
  // eslint-disable-next-line no-unused-vars 
  const [aggregationVal, setAggregationVal] = useState(props.data.aggreation);
  const [cumulativeAggregation, setCumulativeAggregation] = useState( props?.data?.config?.length > 0 ? props.data.config[0]?.grouping : 'single')
  const [cycleStartAt, setCycleStartAt] = useState(props?.data?.config?.length > 0 ? props.data.config[0]?.cycleStartstAt : 1)
  const [groupByVal, setGroupByVal] = useState(props.data.group_by);
  const [groupByTimeVal, setGroupByTimeVal] = useState(moment(moment().format('L') + " " + props.data.startsat).format(HF.HM));
  const [groupByTimeMeridVal, setGroupByTimeMeridVal] = useState(moment(moment().format('L') + " " + props.data.startsat).format('A'));
  const [selectedHierarchyData] = useRecoilState(defaultHierarchyData);
  const [hierarchyView] = useRecoilState(hierarchyData);
  const [ , setcustomReport] = useState(props.data.custome_reports);
  const [userDetails] = useRecoilState(userData);  
  const [, setInstrumentArrForEntity] = useState([]);
  const [aggregationCheck, setAggregationCheck] = useState((props.data.aggreation !== undefined) ? true : false);
  const [groupByChecked, setGroupByChecked] = useState(props.data.group_by !== undefined ? true : false);
  const [hierarchyVal,setHierarchyVal] = useState(props.data.hierarchy_id); 
  const [Loading, setLoad] = useState(false);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setSnackType] = useRecoilState(snackType);
  const [publicAccessChecked,setpublicAccessChecked] = useState(false);
  const [EmailAccessChecked,setEmailAccessChecked] = useState(false);
  const [userFields, setUserFields] = useState([]);
  const [userIDs, setUserIDs] = useState([]);
  const [AllUsers,setAllUsers] = useState(false);
  const [UserOption] = useState(props.UserOption)
  const [channelFields, setChannelFields] = useState([]);
  const [channelIDs, setChannelIDs] = useState([]);
  const [ChannelList] = useState(props.ChannelList);
  const [AllChannels,setAllChannels] = useState(false);  
  const [instrumentSelectionType,setInstrumentSelectionType] = useState(1);
  const [groupAggregation,setGroupAggregation] = useState(true);
  const [instrumentRow,setInstrumentRow] = useState([{Field: 1,metrics:[]}])
  const [aggregatedInstruments,setAggregatedInstruments] = useState([]);
  const [aggregatedMetrics,setAggregatedMetric] = useState([]);
  const [tableLayout,setTableLayout] = useState(3);
  const { MetricsForInstrumentLoading, MetricsForInstrumentData, MetricsForInstrumentError, getMetricsForInstrument } = useMetricsForInstrument() 
  const { UpdateReportLoading, UpdateReportData, UpdateReportError, getUpdateReport } = useUpdateReport();
  const [access,setaccess] = useState('private')
  const [shareduserList,setshareduserList] = useState([])
  const [, setSelectedReports] = useRecoilState(selectedReport);

  
  const titleRef = useRef();
  const descriptionRef = useRef(); 
  const aggregationRef = useRef(); 
  const timeRef = useRef();
  let selectedEntityList = [];
  let  instrumentArr = []; 
 
    useEffect(()=>{
        if (!UpdateReportLoading && !UpdateReportError && UpdateReportData) { 
            props.getSavedReports();
            setLoad(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[UpdateReportLoading, UpdateReportData, UpdateReportError])
    useEffect(()=>{
      console.log(instrumentRow,'instrumentRow')
     },[instrumentRow])
    useEffect(()=>{
        if (!MetricsForInstrumentLoading && !MetricsForInstrumentError && MetricsForInstrumentData) { 
          // setdashboardlistloader(false)
            if (MetricsForInstrumentData.length > 0 && (entityAutocomplete.length > 0 || aggregatedInstruments.length > 0 )) {

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
 
  function getSelectedVals(arr1, arr2) {
    let finalArr = [];
    if(Array.isArray(arr2)){
      arr1.forEach(function (a) {
        arr2.forEach(function (obj) {
          if (obj === a.id) { finalArr.push(a) }
        });
      })
      return finalArr
    }else{
      return []
    }
   
  }
  let reportingMetricArr = [];
  let entityArr = [];
  const indfinder = (a) => {
    a.forEach(function (b) {
      if (b.type === "instrument") {
        reportingMetricArr.push({ "title": b.name, "id": b.id, type: 'real' })
      }
      if (b.type === "entity" || b.type === "node" || b.type === "asset") {
        if(b.subnode && b.subnode.id){
          reportingMetricArr.push({ title: b.subnode.name, id: b.subnode.id,type: b.subnodeType === 'virtual'?'virtual':'instrument',formula: b.subnode.formula });
        }
        entityArr.push({ "title": b.name+ " ("+b.subtype+")", "id": b.id, "type": b.subtype })
      }
      if (b.hasOwnProperty("children") && b.children.length > 0) {
        indfinder(b.children)
      }

    })  
  } 

  function ArithMetricFnc(val,arr,existarr){
    let value =''
    if(val.type && val.type === 'virtual'){
      value = val.type
    }else{
      value = val.formula ? val.formula : ''
    }
    if(value){
      let arithmetic = arr.formula.split(/([-+*\/()])/g);
      arithmetic = arithmetic.filter(word => word.trim().length > 0);
      let re = '-+*\/()';
      let metricparam = [];
      arithmetic.map(param => { 
        if (!re.includes(param)) {
          if(param.split('.')[1]){
            metricparam.push(param.split('.')[1]);
          } 
        }
      })
      metricparam = [...new Set(metricparam)]; 
      const metric = props.metricList && props.metricList.length > 0?props.metricList.filter(met=>metricparam.includes(met.name)):[]; 
      return [...existarr,...metric];
    }else{
      const exist = props.instrumentMetricsListData.filter(metric=>val.id === metric.instruments_id).map(m=>m.metric);
      if(exist.length > 0){
        return [...existarr, ...exist];
      }
    }  
  }

  const renderAccess=(access,list)=>{
    if(access && list && list.length > 0){
     return 'shared'
    }else if(access){
    return 'public'
    }else{
      return 'private'
    }

  }

  useEffect(() => {  
    setnewReportName(props.data.name);
    setDescriptionVal(props.data.description);
    setaccess(renderAccess(props.data.public_access,props.data.user_access_list))
    setshareduserList(props.data.user_access_list && props.data.user_access_list !== null ? props.data.user_access_list : [])
    let metrics_list = []
    let instrumentid = [];
    let selected_metric_list = []
    const filteredListFnc =(arr)=>{
      const filtered_list = arr.filter(x=>instrumentid.includes(x.instruments_id)).map(y=> { 
        return {
          id: y.metric.id,
          name: y.metric.name,
          title: y.metric.title 
        } 
      });
      metrics_list = [...metrics_list, ...filtered_list];
    }
    const selected_metricFnc =(v,key)=>{
      const metricArr = props.instrumentMetricsListData.filter(y=>y.metric[key] === v).map(z=>{
        return {
          id: z.metric.id,
          name: z.metric.name,
          title: z.metric.title 
        }
      });
      if(metricArr.length > 0){
          selected_metric_list.push(metricArr[0]);
      }
    }
    if(props.data.config){
        if(props.data.group_aggregation){
          let selected_instrument_list = []; 
          
          if(props.data.config.length >0){
            const config = props.data.config[0];
            if(config.instrument && config.instrument.length > 0){
              config.instrument.forEach(x=>{
                const instArr = props.RealVirtualInstrumentsListData.filter(y=>y.id === x.id);
                if(instArr.length > 0){
                    selected_instrument_list.push(instArr[0]);
                    instrumentid.push(x.id)
                }
            })
            }
            if(config.metric && config.metric.length > 0){
              config.metric.forEach(x=>{
                  selected_metricFnc(x,"name")
                  
              })
            }
            if(props.instrumentMetricsListData && props.instrumentMetricsListData.length > 0){
              filteredListFnc(props.instrumentMetricsListData)  
            }
          }
            const uniquemetrics = metrics_list.filter((obj, index) => { // Filter Unique metrics
                return index === metrics_list.findIndex(o => obj.id === o.id);
            });
            setParameterList(uniquemetrics); 
            setAggregatedInstruments(selected_instrument_list);
            setAggregatedMetric(selected_metric_list);
        }else{
          if(props.data.config.length >0){

            const instrument_rows = props.data.config.map((row,index)=>{
              let selected_instrument_list = []; 
              let filtered_list = [];
              if(row.instrument && row.instrument.length>0){
                row.instrument.forEach(x=>{
                  const instArr = props.RealVirtualInstrumentsListData.filter(y=>y.id === x.id);
                  if(instArr.length > 0){
                      selected_instrument_list.push(instArr[0]); 
                      filtered_list = ArithMetricFnc(x,instArr[0],filtered_list)
                  }  
                })
              } 
              if(row.metric && row.metric.length > 0){ 
                row.metric.forEach(x=>{
                  const metricArr = filtered_list && filtered_list.filter(y=>y.name === x) 
                  if(metricArr && metricArr.length > 0){
                      selected_metric_list.push(metricArr[0]);
                  }
                })
              } 
                const aggregation = aggregationOpt.filter(agg=>row.aggregate === agg.id);
                let uniqfilter = filtered_list && filtered_list.length > 1 ? [...new Map(filtered_list.map(item => [item.name, item])).values()] : filtered_list
                let metric_li = filtered_list && filtered_list.length > 0 ? uniqfilter : [];  
                return {
                  Field: index +1,
                  instrument: selected_instrument_list,
                  metrics: selected_metric_list.filter(x=>row.metric.includes(x.name)),
                  aggregate: (aggregation.length > 0) ? aggregation[0].id : '',
                  metric_list: metric_li
                }
            })
            setInstrumentRow(instrument_rows)
          }
        }
        
        setInstrumentSelectionType(props.data.instrument_list_from && props.data.instrument_list_from === 2?2:1);
        setGroupAggregation(props.data.group_aggregation)
    }else{
      let selected_instrument_list = []; 
      props.data.instument_ids.forEach(x=>{
        const instArr = props.RealVirtualInstrumentsListData.filter(y=>y.id === x);
        if(instArr.length > 0){
            selected_instrument_list.push(instArr[0]);
            instrumentid.push(x.id)
        }
      })
      props.data.metric_ids.forEach(x=>{
          selected_metricFnc(x,"id")
      })
      filteredListFnc(props.instrumentMetricsListData) 
      setParameterList(metrics_list);
      setAggregatedInstruments(selected_instrument_list);
      setAggregatedMetric(selected_metric_list);
    }
    setTableLayout(props.data.table_layout?props.data.table_layout:3);
    setAggregationVal(props.data.aggreation);
    setGroupByVal(props.data.group_by); 
    setpublicAccessChecked(props.data.public_access)
    setEmailAccessChecked(props.data.send_mail)
    setUserIDs(props.data.alert_users)
    let selectedUserName = props.data.alert_users.map(v=> { 
      return UserOption.filter(f=> f.id === v)[0];
    }) 
    setUserFields(selectedUserName) 
    let selectedChnl = props.data.alert_channels.map(v=> {
      return ChannelList.filter(f=> f.id === v)[0];
    }) 
    console.log(selectedChnl,"selectedChnlselectedChnl")
    setChannelFields(selectedChnl)
    setChannelIDs(props.data.alert_channels)
    setGroupByTimeVal(moment(moment().format('L') + " " + props.data.startsat).format(HF.HM));
    setHierarchyVal(props.data.hierarchy_id)
    setAggregationCheck(props.data.aggreation && props.data.aggreation !== undefined ? true : false);
    setGroupByChecked(props.data.group_by && props.data.group_by !== undefined ? true : false);
    setInstrumentArrForEntity(props.data.instument_ids);
    setcustomReport(props.data.custome_reports);
    if(props.data && props.data.instrument_list_from !== 2){
      let tempProps = []; 
      if (props.data.hierarchy_id) {
        let tempProps1 = JSON.parse(JSON.stringify(hierarchyView));
        let tempProps2 = tempProps1.filter((val, index) => val.id === props.data.hierarchy_id);
        tempProps = tempProps2[0].hierarchy[0];
      } else {
        let hierarchyDataArr = selectedHierarchyData[0].hierarchy.hierarchy[0]
        tempProps = JSON.parse(JSON.stringify(hierarchyDataArr));
      } 
  
       
      tempProps.children.forEach(function (a) {
        if (a.type === "instrument") {
          reportingMetricArr.push({ "title": a.name, "id": a.id, type: 'real' })
        }
        if (a.type === "entity" || a.type === "node" || a.type === "asset") { 
          if(a.subnode && a.subnode.id){
          reportingMetricArr.push({ title: a.subnode.name, id: a.subnode.id,type: a.subnodeType === 'virtual'?'virtual':'instrument',formula: a.subnode.formula });
          }
          entityArr.push({ "title": a.name + " ("+a.subtype+")", "id": a.id, "type": a.subtype })
        }
        if (a.hasOwnProperty("children")) {
          indfinder(a.children)
        }
      }) 
      setReportingMetrics(reportingMetricArr)
      setEntityArr(entityArr) 
      selectedEntityList.push(entityArr);
      //  assigning values for autocomplete sections
      const generateArr = (a) => {
        a.children.forEach(function (b) {
          if (b.subnode) { 
            if (b.subnode.formula) { 
              if(b.subnodeType === 'virtual'){
                const formula = b.subnode.formula;
                // eslint-disable-next-line no-useless-escape
                let formulaArr = formula.split(/([-+*\/()])/g);
                formulaArr = formulaArr.filter(String);
                // eslint-disable-next-line no-useless-escape
                let re = '-+*\/()';
                formulaArr = formulaArr.filter(val => !re.includes(val));
                formulaArr = formulaArr.map(val => val.split('.')[0]);
                const instruments = [...instrumentArr, ...formulaArr];
                // eslint-disable-next-line react-hooks/exhaustive-deps 
                instrumentArr = [...new Set(instruments)];
              }else{
                instrumentArr.push(b.subnode.formula);
                instrumentArr = [...new Set(instrumentArr)];
              }
            } else {
              instrumentArr.push(b.id);
              instrumentArr = [...new Set(instrumentArr)];
            } 
          } else {
            if (b.hasOwnProperty("children")) {
              generateArr(b)
            }
          }
        }) 
      }
  
  
      const indfinder1 = (a, id) => {
        a.children.forEach(function (b) {
          if ((b.type === "entity" || b.type === "node" || b.type === "asset") && (b.id === id)) {
            if (b.hasOwnProperty("children")) {
              generateArr(b)
              subnodeInstrument(a);
  
            }
          } else if (b.hasOwnProperty("children")) {
            indfinder1(b, id)
          }
        }) 
      }
      const subnodeInstrument = (sub) => {
        if (sub.subnode) {
          if (sub.subnode.formula) {
            if(sub.subnodeType === 'virtual'){
  
              const formula = sub.subnode.formula;
              // eslint-disable-next-line no-useless-escape
              let formulaArr = formula.split(/([-+*\/()])/g);
              formulaArr = formulaArr.filter(String);
              // eslint-disable-next-line no-useless-escape
              let re = '-+*\/()';
              formulaArr = formulaArr.filter(val => !re.includes(val));
              formulaArr = formulaArr.map(val => val.split('.')[0]);
              const instruments = [...instrumentArr, ...formulaArr];
              instrumentArr = [...new Set(instruments)];
            }else{
              instrumentArr.push(sub.subnode.formula);
              instrumentArr = [...new Set(instrumentArr)];
            }
          } else if (sub.subnodeType === 'instrument') {
            instrumentArr.push(sub.subnode.id);
            instrumentArr = [...new Set(instrumentArr)];
          }
        }
        sub.children.forEach(function (subnode) {
          if (subnode.type === 'instrument') {
            instrumentArr.push(subnode.id);
            instrumentArr = [...new Set(instrumentArr)];
          }
          if ((subnode.type === "entity" || subnode.type === "node" || subnode.type === "asset")) {
            if (subnode.hasOwnProperty("children")) {
              subnodeInstrument(subnode);
            }
          }
        })
      }
  
      if (tempProps.subnode) {
        // eslint-disable-next-line default-case
        if (tempProps.subnode.formula) {
          const formula = tempProps.subnode.formula;
          // eslint-disable-next-line no-useless-escape
          let formulaArr = formula.split(/([-+*\/()])/g);
          formulaArr = formulaArr.filter(String);
          // eslint-disable-next-line no-useless-escape
          let re = '-+*\/()';
          formulaArr = formulaArr.filter(val => !re.includes(val));
          formulaArr = formulaArr.map(val => val.split('.')[0]);
          const instruments = [...instrumentArr, ...formulaArr];
          instrumentArr = [...new Set(instruments)];
        } else if (tempProps.subnodeType === 'instrument') {
          instrumentArr.push(tempProps.subnode.id);
          instrumentArr = [...new Set(instrumentArr)];
        }
      }
      tempProps.children.forEach(function (a) { 
        for (var q in selectedEntityList) {
          if ((a.type === "entity" || a.type === "node" || a.type === "asset") && a.id === selectedEntityList[q][0].id) {
            if (a.hasOwnProperty("children")) { 
              generateArr(a)
              subnodeInstrument(a);
            }
          }
          else if (a.hasOwnProperty("children")) {
            indfinder1(a, selectedEntityList[q][0].id)
          }
          return
        }
      }) 
   
      //constructing array for pre - load data on autocomplete sections
      let InstrumentsAutocomplete = getSelectedVals(HierarchyInstrumentList, props.data.instument_ids)
      setInstrumentsAutocomplete(InstrumentsAutocomplete)
  
      if (entityArr.length > 0) {
        let entitysAutocomplete = getSelectedVals(entityArr, props.data.entity_ids) 
        setEntityAutocomplete(entitysAutocomplete)
      }
      
      if (instrumentArr.length > 0) {
        getMetricsForInstrument(instrumentArr)
      } else {
        let instru_met = []
        setParameterList(instru_met)
      }
    }
     
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data])
 
 

 

  const handleGroupbyCheck = (e) => {
    if(groupByChecked){
      setEmailAccessChecked(false);
      setUserFields([]) 
      setUserIDs([])
      setChannelFields([]);
      setChannelIDs([])
    }
    setGroupByChecked(!groupByChecked)
    setGroupByVal('');
    setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
    setGroupByTimeMeridVal('AM');
  }

  const handlehierarchyChange = (event) => {
    let checkVal = "" 
    if (event.target.value !== "" && event.target.value !== undefined) {
      setHierarchyVal(event.target.value)
      checkVal = event.target.value
    } else {
      setHierarchyVal(selectedHierarchyData[0].hierarchy.id)
      checkVal = selectedHierarchyData[0].hierarchy.id
    }
    let tempProps1 = JSON.parse(JSON.stringify(hierarchyView));
    let tempProps2 = tempProps1.filter((val) => val.id === checkVal);
    let tempProps = tempProps2[0].hierarchy[0];
    reportingMetricArr = [];
    entityArr = [];
    
    tempProps.children.forEach(function (a) {
      if (a.type === "instrument") {
        reportingMetricArr.push({ "title": a.name, "id": a.id, type: 'real' })
      }
      if (a.type === "entity" || a.type === "node" || a.type === "asset") {
        if(a.subnode && a.subnode.id){
          reportingMetricArr.push({ title: a.subnode.name, id: a.subnode.id,type: a.subnodeType === 'virtual'?'virtual':'instrument',formula: a.subnode.formula });
        }        
        entityArr.push({ "title": a.name, "id": a.id, "type": a.subtype })
      }
      if (a.hasOwnProperty("children")) {
        indfinder(a.children)
      }
    })
    setReportingMetrics(reportingMetricArr)
    setEntityArr(entityArr) 

    setEntityAutocomplete([])
    setParameterList([])
    setAggregatedMetric([]); 
    setInstrumentRow([{Field: 1}]);
  };
  const snackTrigger = (msg) => {
    setSnackMessage(msg);
    setSnackType("warning");
    handleSnackOpen();
    return false; 
  };

  function individualValidation(){
    if(instrumentRow.length >0){
      let count = 0;
      instrumentRow.forEach(instrument=>{ 
        if(!instrument.instrument || !instrument.metrics || !instrument.aggregate){
          snackTrigger(t("Please fill all fields in a row")); 
          count =1;
        }else{
          if(instrument.instrument.length === 0 || instrument.metrics.length === 0 || instrument.aggregate.length === 0){
            snackTrigger(t("Please fill all fields in a row")); 
            count =1;
          }
        }
        
      })    
      if(count > 0){
        return false;
      }else{
        return true;
      }         
    }else{
      snackTrigger(t("Please add instruments"));
      return false;
    }
  }

  const updateReport = (e) => {  
    setLoad(true);
  
   
    let selectedEntityID = [];  
    const aggregationValue = aggregationVal?aggregationVal:"";
    const hierarchyValue = hierarchyVal?hierarchyVal:null;
    const sequenceValue = groupByVal
    const timeValue =groupByTimeVal
    selectedEntityID = entityAutocomplete.map(a => a.id);  
    
    if(props.ReportList &&  props.ReportList.filter(x=>x.id !== props.data.id).some((item) => item.name === titleRef.current.value) ){
      setSnackMessage('Report Name Already Exists');
      setSnackType("warning");
      handleSnackOpen();
      setLoad(false)
      return false;
    }

    if (titleRef.current.value === "") { 
        setSnackMessage(t('FillRepTitle'));
        setSnackType("warning");
        handleSnackOpen();
        setLoad(false)
        return false;
      }

      if(access === 'shared' && shareduserList.length === 0){
        setSnackMessage('Select users to give access.');
        setSnackType("warning");
        handleSnackOpen();
        setLoad(false)
        return false;
      }
      
      if(instrumentSelectionType === 1){  
        if (!hierarchyValue) {
          snackTrigger(t("Please select a hierarchy"));
           setLoad(false)
          return false;
        }
        if(groupAggregation){
          if (selectedEntityID.length === 0) {
            snackTrigger(t("PlsSelEntity"));
             setLoad(false)
            return false;
          }
          if (aggregatedMetrics.length === 0) {
            snackTrigger(t("PlsSelMetrics"));
             setLoad(false)
            return false;
          }
        }else{ 
          const isValid = individualValidation();
          if(!isValid){
            setLoad(false);
            return false;
          }
        }      
      }else{
        if(groupAggregation){ 
          if(aggregatedInstruments.length === 0){ 
            snackTrigger("Please select aggregated instrument");
             setLoad(false)
            return false; 
          }
          if(aggregatedMetrics.length === 0){
            snackTrigger(t("Please select aggregated metrics"));
             setLoad(false)
            return false; 
          }
        }else{
          const isValid = individualValidation();
          if(!isValid){
            setLoad(false);
            return false;
          }       
        }       
      }
      console.log(aggregationCheck,aggregationValue,"aggregationCheck")
      
      if (groupByChecked && sequenceValue === "") {
        setSnackMessage(t("SelGroupby"));
        setSnackType("warning");
        handleSnackOpen(); 
        setLoad(false)
        return false;
      }
      if(EmailAccessChecked){
        if(userIDs.length === 0){
          if(channelIDs.length === 0){
            setSnackMessage(t("Please select user or channel type"));
            setSnackType("warning");
            setLoad(false)
            handleSnackOpen();  
            return false
          }
        }
      } 
      let instrumentConfig =[];
      if(groupAggregation){ 
        let inst = aggregatedInstruments.map(y=> {return {id: y.id,type: y.type}});
        inst = [...new Map(inst.map(item => [item['id'], item])).values()] 
        const metric = aggregatedMetrics.map(y=> y.name);
        instrumentConfig.push({instrument: inst,metric: metric,aggregate: aggregationValue && aggregationValue === 'none'  ?  '' : aggregationValue, grouping: cumulativeAggregation, cycleStartstAt: cycleStartAt });      
      }else{
        instrumentConfig = instrumentRow.map(x=>{
          const inst = x.instrument.map(y=> {return {id: y.id,type: y.type}});
          const metric = x.metrics.map(y=> y.name);
          const aggregate = x.aggregate;
          return {instrument: inst,metric: metric,aggregate: aggregate, grouping: cumulativeAggregation, cycleStartstAt: cycleStartAt };
        })
      }
      let datas={
        id:props.data.id,
        name:titleRef.current.value,
        description:descriptionRef.current.value,
        custome_reports:true,
        hierarchy_id:hierarchyValue,
        metric_ids:"{}",
        instrument_ids:"{}",
        entity_ids:"{" + selectedEntityID.toString() + "}",
        startsat:moment(moment().format('L') + " " + timeValue + (HF.HM !== 'HH:mm' ? " "+groupByTimeMeridVal : '')).format('HH:mm:ss'),
        aggreation:aggregationValue && aggregationValue === 'none'  ?  '' : aggregationValue,
        group_by:sequenceValue,
        updated_by:userDetails.id,
        public_access:access === "private" ? false : true,
        user_access_list:Array.isArray(shareduserList) &&  shareduserList.length > 0 ? shareduserList : [],
        send_mail:EmailAccessChecked,
      }
      getUpdateReport(datas,"{"+channelIDs.toString()+ "}","{"+userIDs.toString()+"}",instrumentConfig,instrumentSelectionType,groupAggregation,tableLayout)
  };
 
  const handleEntitySelect = (e) => { 
    selectedEntityList.push(e) 
    
    setEntityAutocomplete(e) // assigning value for autocomplete 

    if (e.length === 0) {
      setEntityAutocomplete([])
      setParameterList([])
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
                // eslint-disable-next-line no-useless-escape
                let formulaArr = formula.split(/([-+*\/()])/g);
                formulaArr = formulaArr.filter(String);
                // eslint-disable-next-line no-useless-escape
                let re = '-+*\/()';
                formulaArr = formulaArr.filter(val => !re.includes(val));
                formulaArr = formulaArr.map(val => val.split('.')[0]);
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
              generateArr(b)
            }  
          }
        }) 
      }


      const indfinder1 = (a, id) => { 
        a.children.forEach(function (b) {
          if ((b.type === "entity" || b.type === "node" || b.type === "asset") && (b.id === id)) {
            if (b.hasOwnProperty("children")) {
              generateArr(b)
              subnodeInstrument(b);
            }
          } else if (b.hasOwnProperty("children")) {
            indfinder1(b, id)
          }
        }) 
      }

      const subnodeInstrument = (sub) => {
          if (sub.subnode) {
            if (sub.subnode.formula) {
              if(sub.subnodeType === 'virtual'){ 
                const formula = sub.subnode.formula;
                // eslint-disable-next-line no-useless-escape
                let formulaArr = formula.split(/([-+*\/()])/g);
                formulaArr = formulaArr.filter(String);
                // eslint-disable-next-line no-useless-escape
                let re = '-+*\/()';
                formulaArr = formulaArr.filter(val => !re.includes(val));
                formulaArr = formulaArr.map(val => val.split('.')[0]); 
                entityInstrument.push({ title: sub.subnode.name, id: sub.subnode.id,type: "virtual",sub: sub.subnode.formula });
                const instruments = [...instrumentArr, ...formulaArr];
                instrumentArr = [...new Set(instruments)];
              }else{
                entityInstrument.push({ title: sub.subnode.name, id: sub.subnode.id,type: 'instrument',formula: sub.subnode.formula});
                instrumentArr.push(sub.subnode.formula);
                instrumentArr = [...new Set(instrumentArr)];
              }
            } else if (sub.type === 'instrument') {
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
          if ((subnode.type === "entity" || subnode.type === "node" || subnode.type === "asset")) {
            if (subnode.hasOwnProperty("children")) {
              subnodeInstrument(subnode);
            }
          }
        })
      }

      if (tempProps5.subnode) {
        if (tempProps5.subnode.formula) {
          const formula = tempProps5.subnode.formula;
          // eslint-disable-next-line no-useless-escape
          let formulaArr = formula.split(/([-+*\/()])/g);
          formulaArr = formulaArr.filter(String);
          // eslint-disable-next-line no-useless-escape
          let re = '-+*\/()';
          formulaArr = formulaArr.filter(val => !re.includes(val));
          formulaArr = formulaArr.map(val => val.split('.')[0]); 
          const instruments = [...instrumentArr, ...formulaArr];
          instrumentArr = [...new Set(instruments)];
          entityInstrument.push({ title: tempProps5.subnode.name, id: tempProps5.subnode.id,type: tempProps5.subnodeType === "virtual"?"virtual":"instrument",formula: tempProps5.subnode.formula });
        } else if (tempProps5.subnodeType === 'instrument') {
            entityInstrument.push({ title: tempProps5.subnode.name, id: tempProps5.subnode.id,type: 'instrument',formula: tempProps5.subnode.formula});
            instrumentArr.push(tempProps5.subnode.id);
          instrumentArr = [...new Set(instrumentArr)];
        }
      }
      tempProps5.children.forEach(function (a) {
        let aobj = a 
        for (let q of selectedEntityList[0]) {
          if ((a.type === "entity" || a.type === "node" || a.type === "asset") && a.id === q.id) {
            if(a.hasOwnProperty("children")){
              aobj = a
           }else{
            aobj = {...a,children:[a.subnode&&Object.keys(a.subnode).length>0?a.subnode:{}]}
            
           }
            if (aobj.hasOwnProperty("children")) {
              generateArr(aobj)
              subnodeInstrument(aobj);
            }
          }
          else if (aobj.hasOwnProperty("children")) {
            indfinder1(aobj, q.id)
          }
        }
      }) 
      setAggregatedInstruments(entityInstrument);
      
      if (instrumentArr.length > 0) {
        getMetricsForInstrument(instrumentArr)
        if(entityAutocomplete.length !== e.length){
          setAggregatedMetric([])
        }
      } else {
        let instru_met = []
        setParameterList(instru_met)
        if(entityAutocomplete.length !== e.length){
          setAggregatedMetric([])
        }
      }
    } else {
      setSnackMessage(t('PlsSelectHier'));
      setSnackType("warning");
      handleSnackOpen();
    }
  }

  const handleGroupByChange = (event) => {
    if(event.target.value === 'hour'){
      setEmailAccessChecked(false);
      setUserFields([]) 
      setUserIDs([])
      setChannelFields([]);
      setChannelIDs([])
    }
     setGroupByVal(event.target.value)
    if ((!aggregationCheck || !aggregationVal) && groupAggregation) {
      setAggregationCheck(true);   
    }
  };

 

  const handleGroupByTimeChange = (event) => {
    setGroupByTimeVal(event.target.value)
  };

  const aggregationOpt = [
    { id: "avg",  title: t('Average') },
    { id: "min",  title: t('Minimum') },
    { id: "max",  title: t('Maximum') },
    { id: "sum",  title: t('Sum') },
    { id: "cons", title: t('Consumption') },
    { id: "last",title: t("Last") }, //The default Last should always be the last entry of aggregation mode
  ]

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
    { id: "hour",  title: t('Hourly') },
    { id: "shift", title:t("ShiftWise") },
    { id: "day",   title: t('Daywise') },
    { id: "month", title: t('Monthwise') },
    { id: "year",  title: t('Yearwise') },
  ] 

  const handleSnackOpen = () => {
    setOpenSnack(true);
  };
 
  const onChangeArgg = (event) =>{
    if(event.target.value === 'none'){
      setTableLayout(3)
      setAggregationVal('')
    }else{
      setAggregationVal(event.target.value)
    }
  }

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

const handlemailCheck = (e) => {
  setEmailAccessChecked(!EmailAccessChecked);
  if(!e.target.checked){
    setUserFields([]) 
    setUserIDs([])
    setChannelFields([]);
    setChannelIDs([])
  }
};

// Add user to send alarm
const handleMultiAlertUsersChange = (e,opt) => {
  if(e && e.length === 0){
    setUserFields([]);
    setUserIDs([])
    setAllUsers(false)
    return false;
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
      return faLinesLeaning;
    }
    
    let ChannelID = e.map(v=> { 
        let CHid = ChannelList.filter(f=> f.name === v.name)
        return CHid.length>0 ? CHid[0].id : '';  
    })  
    setChannelFields(e);
    setChannelIDs(ChannelID)
    setAllChannels(false) 
     
}
const handleInstrumentSelectType = (type) =>{
  setInstrumentSelectionType(type)
  setInstrumentRow([{Field: 1}]);
  setHierarchyVal('')
  setEntityAutocomplete([])
  setAggregatedInstruments([])
  setLoad(false)
  setAggregatedMetric([]);
  setReportingMetrics([])
  setEntityArr([])
  setParameterList([])
  setAggregationCheck(false);
  setAggregationVal("");
  setGroupByChecked(false);
  setGroupByVal("");
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
  setEntityAutocomplete([])
  setAggregatedInstruments([])
  setAggregatedMetric([]);
  setLoad(false)
  setReportingMetrics([])
  setParameterList([])
  setEntityArr([])
  setAggregationCheck(false);
  setAggregationVal("");
  setGroupByChecked(false);
  setGroupByVal("");
  setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
  setGroupByTimeMeridVal("AM");
  setEmailAccessChecked(false);
  setUserFields([]) 
  setUserIDs([])
  setChannelFields([]);
  setChannelIDs([])
}

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
    if(aggregatedInstruments.length !== instruments.length){
      setAggregatedMetric([])
    }
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
    setGroupByVal("");
    setGroupByTimeVal(HF.HM === 'HH:mm' ? '00:00' : '12:00');
    setGroupByTimeMeridVal("AM");
    setTableLayout(3)
  }
  setAggregatedMetric(metrics)
}
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
}
const handleIndividualMetricSelect = (metric,field) =>{
  let existInstRow = [...instrumentRow];
  const existIndex = existInstRow.findIndex(x=>x.Field === field);
  existInstRow[existIndex]['metrics'] =  metric;  
  setInstrumentRow(existInstRow)
}
const handleIndividualAggregateSelect = (e,field) =>{ 
  let existInstRow = [...instrumentRow];
  const existIndex = existInstRow.findIndex(x=>x.Field === field);
  existInstRow[existIndex]['aggregate'] =  e.target.value;  
  setInstrumentRow(existInstRow)
 
}
const handletableLayout = (val)=> setTableLayout(val)

const realInstruments = props.RealVirtualInstrumentsListData?.filter(item => item.type === 'real') || [];
const virtualInstruments = props.RealVirtualInstrumentsListData?.filter(item => item.type === 'virtual') || [];

const formattedOptions = [...realInstruments, ...virtualInstruments].map(item => ({
  ...item,
  id: item.id,
  title: item.title, 
  discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 

}));

function IntrumentComponent(){ 
    if(instrumentSelectionType === 1) { 
    return <Grid item xs={12} sm={12}> 
              <SelectBox
                  id="Entity"
                  label={t('Entity')}
                  auto={true}
                  options={reportingEntityArr}
                  isMArray={true}
                  keyValue={"title"}
                  keyId={"id"}
                  value={entityAutocomplete}
                  multiple={true}
                  onChange={(e)=>handleEntitySelect(e)}  
              />
            </Grid>
  }else{
    return <Grid item xs={12} sm={12}> 
              <SelectBox
                    labelId=""
                    id="metric-entity-select"
                    label={'Instrument/ Virtual Instrument'}
                    auto={true}
                    multiple={true}
                    value={aggregatedInstruments}
                    options={(props.RealVirtualInstrumentsListData && props.RealVirtualInstrumentsListData.length>0) ? props.RealVirtualInstrumentsListData.map(item => ({
                      ...item,
                      id: item.id,
                      title: item.title, 
                      discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 
                    
                    })) : []}
                    isDescription={true}
                    isMArray={true}
                    checkbox={false}
                    onChange={(e)=>handleInstrumentSelect(e)}
                    keyValue="title"
                    keyId="id"
                    error={false} 
                    defaultDisableOption={true}
                    
                  /> 
            </Grid>
  }
     
}

function HierarchyInstrumentOption() {
  if(instrumentSelectionType === 1){
    if(HierarchyInstrumentList && HierarchyInstrumentList.length > 0){
      // setLoad(false)
      return HierarchyInstrumentList.map(item => ({
        ...item,
        id: item.id,
        title: item.title, 
        discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 
      
      }));
    }
    return []
  }else{
    if(props.RealVirtualInstrumentsListData && props.RealVirtualInstrumentsListData.length>0){
      return props.RealVirtualInstrumentsListData.map(item => ({
        ...item,
        id: item.id,
        title: item.title, 
        discText: item.type === "virtual" ? "Virtual Instrument" : "Instrument" 
      
      }));
    }
    return []
  }
}


const handleAccessChange =(e)=>{
  setaccess(e.target.value)
}




const listArr = [{ index: 0, name: "Reports" },{ index: 1, name: newReportName}]
const handleActiveIndex = (index) => {
  if(index === 0){
  setSelectedReports('')
  props.resetTags()
  }

}

  return (
    
    <div >
      <div >
      <React.Fragment>
      <div className="py-2 px-4 flex items-center justify-between h-[48px] bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
      <Breadcrumbs breadcrump={listArr} onActive={handleActiveIndex} />
      <div style={{ display: 'flex',gap:"8px", justifyContent: 'flex-end' }}>
                <Button  type="secondary" onClick={()=>{props.isList ? props.resetTags()  : props.run(props.data) }} value={t('Cancel')}/>
                <Button
      type="primary"
      loading={Loading}
      onClick={updateReport}
      value={t('Update')}
    >
      {Loading ? 'Loading...' : 'Update'}
    </Button>
            </div>
      </div>
      </React.Fragment>
      </div>
      <HorizontalLine variant="divider1" />

      <div className="py-4 bg-Background-bg-primary  dark:bg-Background-bg-primary-dark h-[93vh] overflow-y-auto">
      <Grid container>
      <Grid item xs={3} >
        </Grid>
        <Grid item xs={6} >
        <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
        <Typography
                variant={"heading-02-xs"}
                value={t("Basic")}
                
              />
              </Grid>
          <Grid item xs={12} sm={12}>
            
            <InputFieldNDL
               label={t("Title")}
                id="newReportName" 
                inputRef={titleRef}
                defaultValue={newReportName}
                placeholder={t('NewReport')} 
            /> 
          </Grid>
          <Grid item xs={12} sm={12}> 
            <InputFieldNDL
                id="Description" 
                inputRef={descriptionRef}
                multiline
                row={4}
                defaultValue={descriptionVal}
                placeholder={t('Description')} 
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
                disabled={props.data && props.data.created_by === userDetails.id ? false : true}
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
              options={props.UserOption}
              isMArray={true}
              keyValue={"value"}
              label={"Share with"}
              placeholder={t('Select User')}
              keyId={"id"}
              auto={true}
              multiple={true}
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
        <Typography
                variant={"heading-02-xs"}
                value={t("Labels")}
                
              />
              </Grid>
          <Grid item xs={6} sm={6}>
              <RadioNDL name={'Hierarchy'} labelText={'Hierarchy'} id={'Hierarchy'} checked={instrumentSelectionType ===1?true: false} onChange={()=>handleInstrumentSelectType(1)}/>
              </Grid>
              <Grid item xs={6} sm={6}>
              <RadioNDL name={'Instrument/Virtual Instrument'} labelText={'Instrument/Virtual Instrument'} id={'Instrument/Virtual Instrument'} checked={instrumentSelectionType ===2?true: false} onChange={()=>handleInstrumentSelectType(2)}/> 
          </Grid>
          {
            instrumentSelectionType === 1 &&
             <Grid item xs={12} sm={12}>
            <SelectBox
                labelId="SelectHierarchy"
                label ={t("Hierarchy")}
                value={hierarchyVal}
                id="SelectHierarchy"
                auto={false}
                multiple={false}
                options={hierarchyView}
                isMArray={true}
                checkbox={false} 
                onChange={handlehierarchyChange}
                keyValue="name"
                keyId="id" 
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
              <Grid container spacing={4}> 
                {IntrumentComponent()} 
              <Grid item xs={groupAggregation ? 6 : 12}>
                  <SelectBox
                      id="Reporting"
                      label={t("ReportingMetric")} 
                      auto={true}
                      multiple={true}
                      options={(parameterList && (parameterList.length>0) ) ? parameterList : []}
                      optionloader={MetricsForInstrumentLoading}
                      isMArray={true}
                      keyValue={"title"}
                      keyId={"id"}
                      placeholder={t('SelectMetrics')}
                      value={aggregatedMetrics}
                      onChange={handleAggMetricSelect}  
                  />
                  
              </Grid>   

              {
                  groupAggregation && aggregatedMetrics.length < 2  &&
                  <Grid item xs={6} sm={6}>
                  <SelectBox
                        id="aggregation"
                        auto={false}
                        options={[...aggregationOpt,...[{id:"none",title:"None"}]]}
                        isMArray={true}
                        keyValue={"title"}
                        label={t('Aggregation')}
                        keyId={"id"}
                        value={aggregationVal ? aggregationVal : 'none'}
                        inputRef={aggregationRef} 
                        onChange={onChangeArgg}
                    />
                        </Grid>  
                }

<Grid item xs={12} sm={12}>
              <div className="py-4">
              <HorizontalLine variant="divider1" />

              </div>
              </Grid>
              </Grid>
            </React.Fragment>
        }
        {!groupAggregation &&
            <div style={{paddingTop: 16}}>
                <Grid container spacing={3} style={{alignItems:"end",marginTop:"12px"}}> 

            {
              instrumentRow && instrumentRow.length > 0 && instrumentRow.map(row=>{                  
                return (
                  <React.Fragment>
                 <Grid item xs={11}>
                    <SelectBox
                      labelId=""
                      id="metric-entity-select"
                      label={t('Instrument')}
                      auto={true}
                      dynamic={instrumentRow}
                      multiple={true}
                      limitTags={1}
                      value={(row.instrument && row.instrument.length>0) ? row.instrument : []}
                      options={HierarchyInstrumentOption()}
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
                      
                    />   
                  </Grid>
                  <Grid item xs={1}>
                  <div className="flex items-center">

                  <Button icon={Delete} danger type={'ghost'} onClick={()=>deleteCurrentRow(row.Field)}/>
</div>
                  </Grid>
                  <Grid item xs={6}>
                  <SelectBox
                    labelId=""
                    id="metric-entity-select"
                    label={t('ReportingMetric')}
                    auto={true}
                    dynamic={instrumentRow}
                    multiple={true}
                    limitTags={1}
                    value={(row.metrics && row.metrics.length>0) ? row.metrics : []}
                    options={(row.metric_list && row.metric_list.length>0) ? row.metric_list : []}
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
                    label={t('Aggregation')}
                    auto={true} 
                    value={(row.aggregate && row.aggregate.length>0) ? row.aggregate : ''}
                    options={aggregationOpt}
                    isMArray={true}
                    checkbox={false}
                    onChange={(e,option)=>handleIndividualAggregateSelect(e,row.Field)}
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
            <Button style={{float: 'right',marginTop: 10,minWidth: 120}} value={t("AddInstru")} icon={Plus} type={'tertiary'} onClick={addInstrumentRow}/>
            </Grid>      
            </Grid>
            </div>
          
        }
        <br/>
        <Grid container spacing={4}>          
        <Grid item xs={12} sm={12}>
            <Typography  disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationVal && groupAggregation)) ? true : false}    variant={"heading-02-xs"} value={t('Metric Orientation')} />
            </Grid>
        <Grid item xs={12} sm={12}>
            <div className="flex items-center justify-between gap-3">
              <RadioNDL name={'Column'} disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationVal && groupAggregation)) ? true : false} labelText={t('Column')} id={'Column'} checked={tableLayout ===1?true: false} onChange={()=>handletableLayout(1)}/>
              <RadioNDL name={'Row'} disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationVal && groupAggregation)) ? true : false} labelText={t('Row')} id={'Row'} checked={tableLayout ===2?true: false} onChange={()=>handletableLayout(2)}/>
              <RadioNDL name={'None'} disabled = {(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationVal && groupAggregation)) ? true : false}  labelText={t('None')} id={'None'} checked={tableLayout ===3?true: false} onChange={()=>handletableLayout(3)}/>
            </div>
          </Grid> 
          <Grid item xs={12} sm={12}>
              <HorizontalLine variant="divider1" />
          </Grid>  

        
           

          <Grid item xs={12}>
            <CustomSwitch
                onChange={handleGroupbyCheck}
                checked={groupByChecked}
                switch={false}                
                disabled={(((groupAggregation && aggregatedMetrics.length >1 )) || (!aggregationVal && groupAggregation))  ? true : false}
                primaryLabel={t('GroupBy')}
            />
          </Grid>

          <Grid item xs={(groupByVal !=="" && groupByVal !=="hour" && groupByVal!=="shift")  ? 6 : 12} >
            {groupByChecked &&
                <SelectBox
                    id="GroupBy-select"
                    auto={false}
                    options={groupByOptions}
                    isMArray={true}
                    keyValue={"title"}
                    keyId={"id"}
                    value={groupByVal} 
                    label={'Type'}
                    onChange={handleGroupByChange}
                />
              }
            </Grid>
         
            {((groupByVal !=="hour" && groupByVal !=="shift" && groupByVal !=="") &&  groupByChecked) &&
          <Grid item xs={6} style={{display:'flex',alignItems:'end'}}>
            <div style={{width:'100%'}}>
                  <div
                    style={{  display: "flex" }}> 
                <SelectBox
                    id="groupByTime"
                    label={t('Starts At')}
                    auto={false}
                    options={TimeOption}
                    isMArray={true}
                    keyValue={"value"}
                    keyId={"id"}
                    value={groupByTimeVal}
                    inputRef={timeRef} 
                    onChange={handleGroupByTimeChange}
                />
                </div>
                {HF.HM !== 'HH:mm' &&
                <Button  type="primary" onClick={() => setGroupByTimeMeridVal(groupByTimeMeridVal === "AM" ? "PM" : "AM")} value={groupByTimeMeridVal}/>}
              </div>
          </Grid>
              }
              {
              groupByChecked && 
              <Grid item xs={12} sm={12}>
              <Typography value='Note: Report type requires an aggregation to be set.' variant="paragraph-s" color='tertiary' />
              </Grid>
            }
              <Grid item xs={12} sm={12}>
              <HorizontalLine variant="divider1" />
          </Grid>  
         
          
        </Grid>
        <div className="mt-3" />
        <Grid container spacing={4}>
            
            {groupByVal !=="hour"  && groupByVal !=="" &&
            <Grid item xs={12} sm={12}> 
                  <CustomSwitch
                  id={"EmailAccessChecked"}
                    checked={EmailAccessChecked}
                    primaryLabel={t("SendEmail")}
                    switch={false}
                    onChange={handlemailCheck}
                  /> 
            </Grid>}
            {
              (groupByVal === 'shift' && EmailAccessChecked) && 
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
                        inputRef={aggregationRef} 
                        onChange={(e) => setCumulativeAggregation(e.target.value)}
                    />
                </Grid>
            }
            {
              (groupByVal === 'day' && EmailAccessChecked) &&
              <>
              <Grid item xs={6}>
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
                  <Grid item xs={6}>
                    </Grid>
                }
                {
                  cumulativeAggregation === 'cumulative' && 
                    <Grid item xs={6}>
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
            <Grid item xs={6} >
                <SelectBox
                        labelId="assetuserLbl"
                        id="Select-User"
                        label={t('Users')}
                        auto={true}
                        multiple={true}
                        options={UserOption}
                        isMArray={true}
                        placeholder={t("Select Users")}
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
            <Grid item xs={6} >
                <SelectBox
                        labelId="assetuserLbl"
                        label={t('CommunicationChannel')}
                        placeholder={t('CommunicationChannel')}
                        id="Select-channel"
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
            </Grid> } 

            {groupByVal !=="hour"  && groupByVal !==""  &&
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
      
    </div>
  );
}
