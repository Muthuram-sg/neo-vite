import React, { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next';
import Typography from "components/Core/Typography/TypographyNDL";
import moment from 'moment';
import { useAuth } from "components/Context";
import Grid from 'components/Core/GridNDL'
import Select from "components/Core/DropdownList/DropdownListNDL";
import Button from 'components/Core/ButtonNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import { useRecoilState } from "recoil";
import { selectedPlant, currentPage,customdates,HistroyTable,AlarmHistroyColumnFilter,AlarmHistroyHeadCells,HistoryTableCustomization,themeMode} from "recoilStore/atoms";
import usePaginationAlerts from "components/layouts/Line/hooks/usePaginationAlerts";
import useAlertConfigurations from "../hooks/useGetAlertConfigurations";
import useGetInstrumentMetrics from "../hooks/useGetInstrumentMetrics";
import EnhancedTable from "components/Table/Table"; 
import { isInteger } from "lodash";
import  useTheme from "TailwindTheme";
import TagNDL from "components/Core/Tags/TagNDL"
import ClickAwayListener from 'react-click-away-listener';
import { useNavigate, } from "react-router-dom";
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";

export default function Histroy(props) {
  const useThemes = useTheme();
  let navigate = useNavigate();
  
const classes = {
    countType: {
    display: "flex",
    float: "left",
    gap: "28px"
  },
  countTypeDiv: {
    display: "flex",
    justifyContent: "end",
    gap: "5px",
    
  },
  level: {
    width: 64,
    textAlign: 'center',
    padding: '3px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 500
  },
  // eslint-disable-next-line no-dupe-keys
    warning: {
    background: useThemes.warning,
  },
  critical: {
    background: useThemes.critical
  },
  ok: {
    background: useThemes.ok
  }
}
  const { HF } = useAuth();
  const { t } = useTranslation();
  const [,setCurPage]=useRecoilState(currentPage)
  const [headPlant] = useRecoilState(selectedPlant);
  const[histroyTable,setHistroyTable]=useRecoilState(HistroyTable)
  const [Historyopens] = useState(true);
  const [count, setCount] = useState(0);
  const [alertTriggers, setAlertTriggers] = useState([]);
  const [alertTriggersList, setAlertTriggersList] = useState([]);
  const [customdatesval,] = useRecoilState(customdates);
  const [alarmNamesArr, setAlarmNamesArr] = useState([]);
  const [alarmsList, setAlarmsList] = useState([]);
  const [FilterListMet, setFilterListMet] = useState([]);
  const [FilterListIntru, setFilterListIntru] = useState([]);
  const [FilterAlarmName, setFilterAlarmName] = useState([]);
  const [FilterAlarmType, setFilterAlarmType] = useState([]);
  const [InstrumentMetricList, setInstrumentMetricList] = useState([]);
  const [AlertTypeCount, setAlertTypeCount] = useState([]);
  const { PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsError, getPaginationAlerts } = usePaginationAlerts();
  const { alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror, getAlertConfigurations } = useAlertConfigurations();
  const { InstrumetMetricsLoading, InstrumetMetricsData, InstrumetMetricsError, getInstrumentMetrics } = useGetInstrumentMetrics();

  //Table params
  const [tableData, setTableData] = useState([]);
  const [selectedcolnames, setselectedcolnames] = useRecoilState(AlarmHistroyColumnFilter)
  const [headCells, setheadCells] = useRecoilState(AlarmHistroyHeadCells)
  const [, setalertLevel] = useState(''); 
  const [downloadabledata, setdownloadabledata] = useState([]);
  const [AlarmFiltervalue,setAlarmFiltervalue] = useState(histroyTable.typeFilter);
  const [histroySortCustomization,sethistroySortCustomization] = useRecoilState(HistoryTableCustomization)
  let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
  let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
  let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
  let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 
  const [currTheme] = useRecoilState(themeMode);
 
  const tableheadCells = [
    {
      id: 'alarmName',
      numeric: false,
      disablePadding: false,
      label: t('Alarm Name'),

    }, {
      id: 'instrument',
      numeric: false,
      disablePadding: false,
      label: t("Instrument"),

    },
    {
      id: 'parameter',
      numeric: false,
      disablePadding: false,
      label: t('Parameter'),

    },
    {
      id: 'checklimit',
      numeric: false,
      disablePadding: false,
      label: t('Check Limit'),

    },
    {
      id: 'actualValue',
      numeric: false,
      disablePadding: false,
      label: t('Actual Value'),
    },
    {
      id: 'alertType',
      numeric: false,
      disablePadding: false,
      label: t('Alert Type'),

    },
    {
      id: 'triggeredAt',
      numeric: false,
      disablePadding: false,
      label: t('Triggered at'),
    },
    {
      id: 'checkedAt',
      numeric: false,
      disablePadding: false,
      label: t('Checked at'),

    }

  ]




  useEffect(() => {
    if(headCells.length === 0){
      setheadCells(tableheadCells)
      setselectedcolnames(tableheadCells.filter(val => !val.hide))
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headCells])

  const handleColChange = (e) => {
    const value = e.map(x=> x.id);
    let tempcolnames = e 

    let newCell = []
    // eslint-disable-next-line array-callback-return
    tableheadCells.forEach(p => {
      let index = value.findIndex(v => p.id === v)
      if (index >= 0) { 
        newCell.push({ ...p, display: 'block' })
      } else {
        newCell.push({ ...p, display: 'none' })
      }
    })
    setheadCells(newCell)
    setselectedcolnames(tempcolnames);
  }
  const getColor = (val) => {
  
    let background = ''
    if(val === 'warning' )
    {    background= "#FFC0AE" }
    else{
     if ( val === 'ok' )
     {background= "#D0E0BA"}
     else{
      background="#F3AFB4"
     }
    }
    let foreground = ''
    if(val === 'warning' )
    {    foreground=  "#9E3614" }
    else{
     if ( val === 'ok' )
     {foreground= "#3A521F"}
     else{
      foreground="#A2171D"
     }
    }


    return [foreground, background]
  }

  const processedrows = () => {
    let temptabledata = []
    let tempdownloadabledata = []
    if (alertTriggersList.length > 0) {

      temptabledata = temptabledata.concat(alertTriggersList.map((val, index) => {
       
        let alert_level_value = ''
        if(val.alert_level_value === ""){
          alert_level_value = (`Min - ${val.alert_level_min}  Max - ${ val.alert_level_max}`)
        }else{
          // NOSONAR
            if(val.alert_level_value == isNaN(val.alert_level_value)){
              alert_level_value = val.alert_level_value

            }
            else
            {alert_level_value= parseFloat(val.alert_level_value).toFixed(2)}
        }

        let Alertvalue=""
         if (val.value && isNaN(val.value))
        {
          Alertvalue=val.value
        }
        else if(val.value){ 
            Alertvalue= parseFloat(val.value).toFixed(2) 
        }

        tempdownloadabledata.push(
          [
            val.alert_name ? val.alert_name : "",
            val.instrument_name ? val.instrument_name : "",
            val.metric_name ? val.metric_name : "",
            alert_level_value,
            Alertvalue,
            val.alert_level,
            val.value_time_format,
            val.alarm_time_format

          ]
        )
      
        return [
          val.alert_name ? val.alert_name : "",
          val.instrument_name ? val.instrument_name : "",
          val.metric_name ? val.metric_name : "",
          alert_level_value,
          Alertvalue,
          <React.Fragment key={index+1}>
            <TagNDL name={
            <Typography variant={"Body2Reg"}
            style={{width:"75%"}}
            align="center"
            value={val.alert_level} color={getColor(val.alert_level)[0]} />
        
        }  style={{backgroundColor:getColor(val.alert_level)[1],width:"100%"}}    />
            </React.Fragment>,
          val.value_time_format,
          val.alarm_time_format

        ]
      })
      )
    }
    setdownloadabledata(tempdownloadabledata)
    setTableData(temptabledata)

  }

  useEffect(() => {
    processedrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertTriggersList])

  useEffect(() => {
    getAlertConfigurations(headPlant.id) 
    getInstrumentMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant, customdatesval]);
 
  useEffect(() => {
    if (!InstrumetMetricsLoading && InstrumetMetricsData && !InstrumetMetricsError) {
      setInstrumentMetricList(InstrumetMetricsData);
    }
  }, [InstrumetMetricsLoading, InstrumetMetricsData, InstrumetMetricsError])

  useEffect(() => {
    if (!PaginationAlertsLoading && PaginationAlertsData && !PaginationAlertsError) {
      let resp = PaginationAlertsData.Data
      let alerCount = resp.alertTypeCount
      setAlertTypeCount(alerCount)
      if (resp && Number(resp.count) > 0) {
        setCount(resp.count);
        if (resp.data && resp.data.length > 0) {
          setAlertTriggers(resp.data);
          let name = [...new Set(resp.data.map(item => item.alert_name))];
          let type = [...new Set(resp.data.map(item => item.alert_type))];
        
          if (PaginationAlertsData.type !== 'filter') {
            let alarmname = [{ id: '', name: "All name" }]
            name.forEach((v, i) => {
              alarmname.push({ id: v, name: v })
            })
            let alarmtype = [{ id: '', name: "All Condition" }]
          
            type.forEach((v, i) => {
              alarmtype.push({ id: v, name: v })
            });
         setHistroyTable({...histroyTable,columnFilter:{...histroyTable.columnFilter,alarmName:alarmname}})
            setFilterAlarmName(alarmname);
            setFilterAlarmType(alarmtype);
          }


        } else {
          setAlertTriggers([]);
          if (PaginationAlertsData.type !== 'filter') {
         setHistroyTable({...histroyTable,columnFilter:{...histroyTable.columnFilter,alarmName:[]}})
            setFilterAlarmName([]);
            setFilterAlarmType([]);
          }
        }
      } else {
        setCount(0);
        setAlertTriggers([]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsError])

  useEffect(() => {
    if (!alertConfigurationsLoading && !alertConfigurationserror && alertConfigurationsdata) {
     
      let data = alertConfigurationsdata.filter(e => e.alertType !== "connectivity")
      setAlarmsList(data);
      let intruname = [{id:"0",name:"All Instrument"}]
      let intrunameuniq = [...new Set(data.map(item => item.instrument_id))];
      // eslint-disable-next-line array-callback-return
      intrunameuniq.forEach(val => {
        let filval = data.filter(fil => fil.instrument_id === val)
        let instruName 
        if(filval.length > 0){
          if(filval[0].viid !==null){
            instruName = filval[0] && filval[0].virtual_instrument && filval[0].virtual_instrument.name
          }else{
            instruName = filval[0].instrument_name
          }
          
        }
        intruname.push({
          id: filval[0].instrument_id,
          name: instruName 
        })
      })
      setFilterListIntru(intruname)
      let alarmsNamesArr = []
      alarmsNamesArr = data.map(x => x.name);
      setAlarmNamesArr(alarmsNamesArr)
     
      if(histroyTable.search){
        autoTrigger(histroyTable.search,alarmsNamesArr)
        
      }
      else{
       
      getfetchAlertNotifications({currpage:histroyTable.page,perRow: histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmsNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName);
      }
      
   
    
      if(histroyTable.columnFilter.metricsList){
        setFilterListMet(histroyTable.columnFilter.metricsList)
      }
      if(histroyTable.columnFilter.alarmName){
        setFilterAlarmName(histroyTable.columnFilter.alarmName)

      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertConfigurationsLoading, alertConfigurationserror, alertConfigurationsdata])

  useEffect(() => {
    let data = []
    data = alertTriggers.map((alert) => {
     

      const valueTime = timeFormat(alert.value_time)
      const entityName = instrumentName(alert.alert_id)
      const metricName = intrumetric(alert.iid, alert.key)
      const alarmTime = timeFormat(alert.time)

      alert.value_time_format = valueTime;
      alert.instrument_name = entityName
      alert.metric_name = metricName;
      alert.alarm_time_format = alarmTime;
     

      return alert
    })
   
    setAlertTriggersList(data);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertTriggers, InstrumentMetricList,alarmsList])

useEffect(()=>{
    setHistroyTable({...histroyTable,typeFilter:AlarmFiltervalue})
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[AlarmFiltervalue])

  const timeFormat = (val) => {
    return moment(val).format("DD-MM-YYYY " + HF.HMS);
  }


function instrumentName(viid){
  let virtinstru = alarmsList.filter((x)=> x.id === viid )
  let InstrumentName
  if(virtinstru.length > 0){
  if(virtinstru[0].viid !==null){
    InstrumentName = virtinstru.length > 0 ? virtinstru[0].virtual_instrument && virtinstru[0].virtual_instrument.name : ""
  }else{
    InstrumentName = virtinstru.length > 0 ? virtinstru[0].instrument_name  : ""
  }}
 
  return InstrumentName
}
  function intrumetric(id, key) {
    let listMet = InstrumentMetricList.filter(x => x.instruments_id === id)

    if (listMet.length > 0) {
      let MetVal = listMet.filter(e => e.metric.name === key)
      return MetVal[0] ? MetVal[0].metric.title : ''
    }

    return ""
  }

  const filterTypeOption = [
    { id: "name", value: "Alarm Name" },
    { id: "type", value: "Alarm Type" },
    { id: "condition", value: "Condition" },
    { id: "instrument", value: "Instrument" }, 
  ]
  const handleAlarmFilter = (e) => {
    setAlarmFiltervalue(e)

  }
  const getfetchAlertNotifications = (PageConfig, searchStatus, searchName, ByType, IntruName, Metric, type) => {
   
    if (searchName.length > 0) {
      let queryData = {
        schema: headPlant.schema,
        currpage: PageConfig.currpage,
        perRow: PageConfig.perRow,
        searchBy: searchStatus,
        from:  moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+TZone),
        to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss"+TZone),
        ByName: searchName.length > 0 ? JSON.stringify(searchName) : '',
        Bytype: ByType,
        ByIntrument: IntruName,
        ByMetric: Metric.length > 0 ? JSON.stringify(Metric) : '',
        ByCount: true
      }
     
      getPaginationAlerts(queryData, type)
    }

  }


// NOSONAR
  function FilterByStatus(e, type) {
    if (type === 1) { 
      setHistroyTable({...histroyTable,page:0,columnFilter:{...histroyTable.columnFilter,filterStatus:e.target.value}})
      getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, e.target.value, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName]  : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru,  histroyTable.columnFilter.filterMetName, "filter");
    } else if (type === 2) { 
      setHistroyTable({...histroyTable,page:0,columnFilter:{...histroyTable.columnFilter,filterName:e.target.value,alarmName:FilterAlarmName}})
      
      getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage},  histroyTable.columnFilter.filterStatus, e.target.value !== "" ? [e.target.value] : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru,  histroyTable.columnFilter.filterMetName, "filter");
    } else if (type === 3) { 
      setHistroyTable({...histroyTable,page:0,columnFilter:{...histroyTable.columnFilter,filterType:e.target.value}})
      getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage},  histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName]  : alarmNamesArr, e.target.value, histroyTable.columnFilter.filterIntru,  histroyTable.columnFilter.filterMetName, "filter");
    } else if (type === 4) { 
      let metList = alarmsList.filter(x => x.instruments_metric.instrument.id === e.target.value).map(v => { return { id: v.instruments_metric.metric.id, name: v.instruments_metric.metric.title } })
      setFilterListMet(metList) 
      setHistroyTable({...histroyTable,page:0,columnFilter:{...histroyTable.columnFilter,filterIntru:e.target.value,metricsList:metList}})
      getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage},  histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName]  : alarmNamesArr, histroyTable.columnFilter.filterType, e.target.value === "0" ? '' : e.target.value,  histroyTable.columnFilter.filterMetName, "filter");
    }
    else if (type === 5) {
      let selectedAsset = e.map((x) => { return FilterListMet.filter(v => v.name === x.name)[0].id});
      
      
      setHistroyTable({...histroyTable,page:0,columnFilter:{...histroyTable.columnFilter,filterMetName:e}})
      getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage},  histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName]  : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, selectedAsset, "filter");
    }

  }

  const filterStatusOption = [
    { id: "", value: t('All Type') },
    { id: "crit", value: t('Critical') },
    { id: "warn", value: t('Warning') },
    { id: "ok", value: t('Ok') }
  ]



  function onChangePage(e, perpage,atoms) {

    if(histroyTable.search){
    autoTrigger(histroyTable.search,alarmNamesArr,e,perpage)}
    else{
    getfetchAlertNotifications({currpage:e, perRow:perpage},  histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] :alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName);

  }
  setHistroyTable({...histroyTable,page:e,rowperpage:perpage})
    sethistroySortCustomization(atoms) 
  }

  const createtask = (id, alert) => {
    let titlealertvalue=''
    if(alert.alert_level === 'warn' || alert.alert_level === 'warning'){
      titlealertvalue='Warning'
    }
    else if( alert.alert_level === 'ok')
    {
      titlealertvalue='Ok'  }
    else{
      titlealertvalue='Critical'
    }

    const Description = `${intrumetric(alert.iid, alert.key)} - Alert value ${alert.value} @ ${timeFormat(alert.value_time)} (limit - ${alert.alert_level_value})`
    const Title = `${instrumentName(alert.alert_id)} - ${titlealertvalue} Alarm Triggered @ ${timeFormat(alert.time)
    }`
    let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'PlantSchema'
    let location = "/"+plantSchema+"/tasks";
    navigate(location, { state: { title: Title, description: Description, obdate: alert.time, additional: {  analysis_type_id: 8, analysis_type_name: "Online Vibration"} }})
    setCurPage("Tasks") 
  }

  
  const handleSearchChange = (e) => { 
      setHistroyTable({...histroyTable,search:e.target.value})

      
      getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
    
  }

  const clickAwayHistorySearch = () => {

 
      if (!histroyTable.search) {
        setHistroyTable({...histroyTable,search:'',searchOpen:false})
           getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
       
      }
    
  }
 
const autoTrigger=(searchvalue,alarmNames,pages,perpage)=>{
 
    let level = "ok warning critical"
      let condition = FilterAlarmType.map(str => {
        let keyValuePairs = Object.entries(str).map(([key, value]) => `${value}`)
        return `${keyValuePairs.join(' ')}`;
      }).join('')
      let alarmName = FilterAlarmName.map(str => {
        let keyValuePairs = Object.entries(str).map(([key, value]) => `${value}`)
        return `${keyValuePairs.join(' ')}`;
      }).join('')
      
      let idName = FilterListIntru.map(str => {
        let keyValuePairs = Object.entries(str).map(([key, value]) => `${value}`)
        return `${keyValuePairs.join(' ')}`;
      }).join('')

      if (level.includes(searchvalue.toLowerCase())) {
        
        setalertLevel(searchvalue) 
        getfetchAlertNotifications({currpage:pages ? pages : 0, perRow: perpage ? perpage : histroyTable.rowperpage}, searchvalue.toLowerCase(), histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNames, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
      } else if (isInteger(Number(searchvalue))) { 
        setalertLevel('')
        setHistroyTable({...histroyTable,page:0})
        getfetchAlertNotifications({currpage:pages ? pages : 0, perRow: perpage ? perpage : histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNames, histroyTable.columnFilter.filterType, searchvalue, histroyTable.columnFilter.filterMetName, "filter");

      }
      else {
        if (condition.includes(searchvalue.toLowerCase())) { 
          setalertLevel('')
          setHistroyTable({...histroyTable,page:0})
          getfetchAlertNotifications({currpage:pages ? pages : 0, perRow: perpage ? perpage : histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNames, searchvalue.toLowerCase(), histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");

        } else if (alarmName.includes(searchvalue)) { 
          setalertLevel('')
          setHistroyTable({...histroyTable,page:0})
          
          getfetchAlertNotifications({currpage:pages ? pages : 0, perRow: perpage ? perpage : histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, [searchvalue], histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");

        } else if (idName.includes(searchvalue)) {
          setHistroyTable({...histroyTable,page:0})
          getfetchAlertNotifications({currpage:pages ? pages : 0, perRow: perpage ? perpage : histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus,histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName]: alarmNames, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");

        } else { 
          setalertLevel('')
          setHistroyTable({...histroyTable,page:0})
          getfetchAlertNotifications({currpage:pages ? pages : 0, perRow: perpage ? perpage : histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNames, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
        }

      }
}
// NOSONAR
  const handleKeyDown = (event) => {

    
    if (event.code === 'Enter' || event.code === "NumpadEnter") {
     setHistroyTable({...histroyTable,search:event.target.value})
      let level = "ok warning critical"
      let condition = FilterAlarmType.map(str => {
        let keyValuePairs = Object.entries(str).map(([key, value]) => `${value}`)
        return `${keyValuePairs.join(' ')}`;
      }).join('')
      let alarmName = FilterAlarmName.map(str => {
        let keyValuePairs = Object.entries(str).map(([key, value]) => `${value}`)
        return `${keyValuePairs.join(' ')}`;
      }).join('')
      let idName = FilterListIntru.map(str => {
        let keyValuePairs = Object.entries(str).map(([key, value]) => `${value}`)
        return `${keyValuePairs.join(' ')}`;
      }).join('')

      if (level.includes(event.target.value.toLowerCase())) {
       
        setalertLevel(event.target.value) 
        getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, event.target.value.toLowerCase(), histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
      } else if (isInteger(Number(event.target.value))) { 
        setalertLevel('')
        setHistroyTable({...histroyTable,page:0,search:event.target.value})
        getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, histroyTable.columnFilter.filterType, event.target.value, histroyTable.columnFilter.filterMetName, "filter");

      }
      else {
        if (condition.includes(event.target.value.toLowerCase())) { 
          setalertLevel('')
          setHistroyTable({...histroyTable,page:0,search:event.target.value})
          getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, event.target.value.toLowerCase(), histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");

        } else if (alarmName.includes(event.target.value)) { 
          setalertLevel('')
          setHistroyTable({...histroyTable,page:0,search:event.target.value})
         
          getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, [event.target.value],  histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");

        } else if (idName.includes(event.target.value)) {
          setHistroyTable({...histroyTable,page:0})
          getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus,histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName]: alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");

        } else { 
          setalertLevel('')
          setHistroyTable({...histroyTable,page:0,search:event.target.value})
          getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
        }

      }
    }

  };
  const clearSearch=()=>{
    setHistroyTable({...histroyTable,search:'',searchOpen:true}) 
    getfetchAlertNotifications({currpage:0, perRow:histroyTable.rowperpage}, histroyTable.columnFilter.filterStatus, histroyTable.columnFilter.filterName ? [histroyTable.columnFilter.filterName] : alarmNamesArr, histroyTable.columnFilter.filterType, histroyTable.columnFilter.filterIntru, histroyTable.columnFilter.filterMetName, "filter");
   
  }
  
  return (
    <React.Fragment>

<AccordianNDL1 title={t('History')} isexpanded={Historyopens}>
<React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center' }} >
            {histroyTable.typeFilter.map(x=>x.id).includes("type") &&
              <div style={{ margin: "10px" }} >
                <Select
                  labelId=""
                  id="hierarchy-type"
                  value={histroyTable.columnFilter.filterStatus}
                  placeholder={t('All Type')}
                  options={filterStatusOption}
                  onChange={(e) => FilterByStatus(e, 1)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  keyValue="value"
                  keyId="id"
                />

              </div>



            }
            {histroyTable.typeFilter.map(x=>x.id).includes("instrument") &&

              <div style={{ margin: "10px" }}>
                <Select
                  labelId="hierarchyView"
                  id="hierarchy-Instrument"
                  value={histroyTable.columnFilter.filterIntru}
                  placeholder={t('All Instruments')}
                  options={FilterListIntru}
                  onChange={(e) => FilterByStatus(e, 4)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  keyValue="name"
                  keyId="id"

                />
              </div>



            }
            {histroyTable.typeFilter.map(x=>x.id).includes("metrics") &&

              <div style={{ margin: "10px" }}>
                <Select
                  labelId="hierarchyView"
                  id="hierarchy-metric"
                  value={histroyTable.columnFilter.filterMetName}
                  placeholder={t('All Metric')}
                  options={FilterListMet}
                  onChange={(e) => FilterByStatus(e, 5)}
                  multiple={true}
                  isMArray={true}
                  auto={false}
                  keyValue="name"
                  keyId="name"
                  dynamic={histroyTable.columnFilter.filterMetName}
                  selectAll={true}
                  selectAllText={"Select All"}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <span>{t("All Metric")}</span>;
                    }
                    return selected.join(', ');
                  }}


                />
              </div>


            }
            {histroyTable.typeFilter.map(x=>x.id).includes("name") &&
              <div style={{ margin: "10px" }}>
                <Select
                  labelId="FilterAlarmName"
                  id="Filter-AlarmName"
                  placeholder={t('All Name')}
                  value={histroyTable.columnFilter.filterName}
                  options={FilterAlarmName}
                  onChange={(e) => FilterByStatus(e, 2)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  keyValue="name"
                  keyId="id"
                />
              </div>


            }
            {histroyTable.typeFilter.map(x=>x.id).includes("condition") &&
              <div style={{ margin: "10px" }}>
                <Select
                  labelId="hierarchyView"
                  id="hierarchy-condition"
                  value={histroyTable.columnFilter.filterType}
                  options={FilterAlarmType}
                  placeholder={t('All Condition')}
                  onChange={(e) => FilterByStatus(e, 3)}
                  multiple={false}
                  isMArray={true}
                  auto={false}
                  keyValue="name"
                  keyId="id"
                />
              </div>


            }
          </div>
          <Grid item xs={12} sm={12} style={{ marginTop: "10px" }}>
            <div style={classes.countType}>
              {
                AlertTypeCount && AlertTypeCount.length > 0 ?
                  AlertTypeCount.map((type,index) => {
                    return (
                      <React.Fragment key={index+1}>
                          <TagNDL name={
                            <div  className={"flex items-center justify-center gap-1 p-1 " }>
                            <Typography variant={"Body2Reg"}
                          align="center"
                          value={type.alert_level} color={getColor(type.alert_level)[0] } />
                        <div style={{ color: getColor(type.alert_level)[0] }}>{"-"}</div>
                        <b style={{ color: getColor(type.alert_level)[0] }}>{type.count}</b>
                       </div>
                          } style={{backgroundColor:getColor(type.alert_level)[1]}}>
                        </TagNDL>
                        </React.Fragment>
                    
                    )

                  })

                  : ""
              }
            </div>
            <div className=" float-right " >
              <Select
                labelId=""
                id="filter-value"
                placeholder={t("Select column")}
                auto={false}
                options={filterTypeOption}
                keyValue="value"
                keyId="id"
                value={histroyTable.typeFilter}
                multiple={true}
                isMArray={true}
                checkbox={true} 
                onChange={(e)=>handleAlarmFilter(e)}               
                 
              />
             
            </div>
            <div  className=" float-right ml-2.5 mr-2.5 "  >
              <Select
                labelId="filter-column-alarm-rules"
                id="filter-column"
                placeholder={t("Select column")}
                disabledName={t("FilterColumn")}
                auto={false}
                edit={true}
                options={tableheadCells.filter(c => !c.hide)}
                keyValue={"label"}
                keyId={"id"}
                value={selectedcolnames}
                multiple={true}
                isMArray={true}
                onChange={(e) => handleColChange(e)}
                checkbox={true} 
                selectAll={true}
                selectAllText={"Select All"}
              />

            </div>
            <ClickAwayListener onClickAway={()=>clickAwayHistorySearch()}>
            <div>
            {histroyTable.searchOpen ?
            
              <div  className=" float-right ">
                
                <InputFieldNDL
                  id="alertHistroyID"
                  placeholder={t("Search")}
                  size="small"
                  type="text"
                  value={histroyTable.search} 
                  onKeyPress={(e) => handleKeyDown(e)}
                  onChange={handleSearchChange}
                  startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}   />}
                  endAdornment={histroyTable.search && <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}    onClick={()=>clearSearch()}/>}
                  dynamic={histroyTable.rowperpage}   
                />
              </div> 
              :
             
               <Button style={{ float: "right" }} type={"ghost"} icon={Search} onClick={() => {setHistroyTable({...histroyTable,searchOpen:true}) }} />
              
            } 
           
            <EnhancedTable
             downloadHeadCells ={tableheadCells}
              headCells={headCells}
              data={tableData ? tableData : []}
              download={true}
              search={false}
              actionenabled={true}
              rawdata={alertTriggersList}
              enableButton={"Create Task"}
              handleCreateTask={(id, value) => { createtask(id, value) }}
              disabledbutton={[]}
              rowsPerPage={histroyTable.rowperpage}
              // PerPageOption={[10, 20, 50, 100]}
              onPageChange={onChangePage}
              page={histroyTable.page}
              serverside={true}
              count={count}
              downloadabledata={downloadabledata}
              rowPerPageSustain={true}
              // TableCustomization={e => sethistroySortCustomization(e)}
              TableSustainValue={histroySortCustomization}
              order={histroySortCustomization.order}
              orderBy={histroySortCustomization.orderby}
             
             
            />
           
            </div>
             </ClickAwayListener>
          </Grid>
        </React.Fragment >
        </AccordianNDL1> 
      
    </React.Fragment>
  )
}