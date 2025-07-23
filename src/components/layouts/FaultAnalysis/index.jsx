/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef } from "react";
import {useParams} from "react-router-dom"//NOSONAR
import { useRecoilState } from "recoil";
import Typography from "components/Core/Typography/TypographyNDL";
import useTheme from "TailwindTheme";
import { selectedPlant, assetList, userLine, defectseverity, defects, faultRecommendations, sensordetails, customdates, currentPage, instrumentsList,snackToggle, snackMessage, snackType,ErrorPage,themeMode } from "recoilStore/atoms";
import moment from "moment";
import LineCard from "./components/LineCard";
import Grid from 'components/Core/GridNDL'
import Tag from 'components/Core/Tags/TagNDL';
import Severe from 'assets/neo_icons/FaultAnalysis/Severe.svg?react';
import Moderate from 'assets/neo_icons/FaultAnalysis/Moderate.svg?react';
import NoFault from 'assets/neo_icons/FaultAnalysis/NoFault.svg?react';
import History from 'assets/neo_icons/FaultAnalysis/History.svg?react';
import Trend from 'assets/neo_icons/FaultAnalysis/Trend.svg?react';
import DateRange from "./components/DateRange";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import EnhancedTable from "components/Table/Table";
import EnhancedTablePagination from "components/Table/TablePagination";
import FFTPlot from 'assets/neo_icons/Menu/3DPlot.svg?react';
import { useAuth } from "components/Context";
import FaultModal from "./components/FaultModal";
import Select from "components/Core/DropdownList/DropdownListNDL";
import { useNavigate, } from "react-router-dom";//NOSONAR
import LoadingScreenNDL from "LoadingScreenNDL";
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import EyeClosed from 'assets/neo_icons/Menu/Hide Connectivity Status.svg?react';
import useMeterReadingsV1 from "components/layouts/Explore/BrowserContent/hooks/useGetMeterReadingV1";
import StatusNDL from 'components/Core/Status/StatusNDL';
import download from 'assets/neo_icons/Menu/newTableIcons/download_table.svg?react';
//ComponentCards
import ComponentCard from "./components/Componentcard";
import Button from "components/Core/ButtonNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import FaultAnalysisChart from "./FaultAnalysisChart"

import { useTranslation } from 'react-i18next';
import KpiCards from 'components/Core/KPICards/KpiCardsNDL'
//hooks
import useGetFaultInfo from "./hooks/useGetFaultInfo";
import useUpdateFaultInfo from './hooks/useUpdateFaults'
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";
import TableIcon from 'assets/neo_icons/Dashboard/table2.svg?react';
import TileIcon from 'assets/neo_icons/Dashboard/layout-grid.svg?react';
import useGetDefectInfo from "components/layouts/Explore/ExploreMain/ExploreTabs/components/FaultHistory/hooks/useGetDefectInfo"
import useGetEntityInstrumentsList from 'components/layouts/Tasks/hooks/useGetEntityInstrumentsList.jsx';
import useGetAlertsOverviewData from 'components/layouts/Alarms/Overview/hooks/useGetAlertsOverviewData'
import * as XLSX from 'xlsx';

export default function FaultHistory(props) {

  const theme = useTheme()
  let {queryParam} = useParams() 
  const paramsArray = queryParam ? queryParam.split('&') : []; 
  // Create an empty object to store the values
  const queryParams = {}; 
  // Iterate over the array and split each key-value pair
  paramsArray.forEach(param => {   const [key, value] = param.split('=');   
  queryParams[key] = value; });
  const Daterange = queryParams['range']; 
    const [currTheme] = useRecoilState(themeMode);
  const [FaultModeParam,setFaultModeParam] = useState('')
  const [rangeParam,setRangeParam] = useState(Daterange)
  const [assetParam,setAssetParam] = useState('')
  const [instrumentParam,setInstrumentParam] = useState('')
  const [headPlant] = useRecoilState(selectedPlant)
  const [assets] = useRecoilState(assetList)
  const [,setErrorPage] = useRecoilState(ErrorPage)
  const [instrumentList] = useRecoilState(instrumentsList);
  const { t } = useTranslation();
  const [users] = useRecoilState(userLine);
  const [defectinfodata] = useRecoilState(defects);
  const [defectsseveritydata] = useRecoilState(defectseverity);
  const [sensorsdata] = useRecoilState(sensordetails);
  const [faultactions] = useRecoilState(faultRecommendations)
  const [accordiandata, setaccordiandata] = useState([])
  const [groupedHistableData, setGroupedHistableData] = useState({});
  const [severitycount, setseveritycount] = useState(0)
  const [moderatecount, setmoderatecount] = useState(0)
  const [mildcount, setmildcount] = useState(0)
  const [nofaultcount, setnofaultcount] = useState(0)
  const [overviewdata, setoverviewdata] = useState([])
  const [severemode, setseveremode] = useState(true)
  const [moderatemode, setmoderatemode] = useState(true)
  const [mildmode, setmildmode] = useState(true)
  const [nofaultmode, setnofaultmode] = useState(true)
  const [assetdata, setassetdata] = useState([])
  const [showassetdata, setshowassetdata] = useState(false)
  const [rawdataobject, setrawdataobject] = useState([])
  const [showoverviewdata, setshowoverviewdata] = useState(true)
  const [navigateArr, setnavigateArr] = useState([])
  const [showinstrumentdata, setshowinstrumentdata] = useState(false)
  const [showaxisdata, setshowaxisdata] = useState(false)
  const [instrumentdata, setinstrumentdata] = useState({})
  const [axisdata, setaxisdata] = useState({})
  const [, setContentSwitchIndex] = useState(0);
  const [tabledata, setTableData] = useState([])
  const [faultsdata, setfaultsdata] = useState([])
  const [, setdownloadabledata] = useState();
  const [showhistory, setshowhistory] = useState(true)
  const [loading, setLoading] = useState(false);
  const [chartData, setchartData] = useState([]);
  const [selectedinstrument, setselectedinstrument] = useState({})
  const [customdatesval,] = useRecoilState(customdates);
  const [, setCurPage] = useRecoilState(currentPage);
  const [selected, setSelected] = useState("tile"); 
  const [hisSelected, setHisSelected] = useState("tile"); 
  const { HF } = useAuth();
  const [headCells, setheadCells] = useState([])
  const [selectedcolnames, setselectedcolnames] = useState([])
  const [instrumentname, setinstrumentname] = useState('')
  const [assetname, setassetname] = useState('')
  const [allfaults, setallfaultsdata] = useState([])
  const [assetfaultsdata, setassetfaultsdata] = useState([])
  const [modeFilterOption, setmodeFilterOption] = useState([])
  const [modeFilterValue, setmodeFilterValue] = useState([])
  const [metricsRowsPerPage, setMetricsRowsPerPage] = useState(5);
  const [metricsCurrentPage, setMetricsCurrentPage] = useState(0);
  const [metricsCurrentData, setMetricsCurrentData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [typeFilterValue, settypeFilterValue] = useState(1)
  const [totalFault, settotalFault] = useState('')
  const [FaultFilterData, setFaultFilterData] = useState([])
  const [faultInforData, setfaultInforData] = useState([])
  const [nodatacount, setnodatacount] = useState(0)
  const [nodatamode, setnodatamode] = useState(false)
  const [ metricTitle, setMetricTitle ] = useState([])//NOSONAR
  const [ metricValue, setMetricValue ] = useState([])//NOSONAR
  const {AlertsOverviewLoading, AlertsOverviewData, AlertsOverviewError, getAlertsOverviewData} = useGetAlertsOverviewData()
  const { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList } = useGetEntityInstrumentsList();
  const {defetcsinfoLoading, defectsinfodata, defectsinfoerror, getDefectInfo} = useGetDefectInfo()
  const { meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error, getMeterReadingsV1 } = useMeterReadingsV1()//NOSONAR
  const [ type,setType ] = useState(-1)
  const [ isdiableTrend, setisdiableTrend ] = useState(false)//NOSONAR
  const [ ackCount, setAckCount ] = useState(-1)
  const [ ackType, setAckType ] = useState(-1)
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [bulkRemarkData,setbulkRemarkData] = useState([])//NOSONAR
  const [faultType,setfaultType] = useState('')//NOSONAR
  const [buttonsEnabled, setButtonsEnabled] = useState(false); 
  const [flag,setflag]= useState(false)
  const [accordian1, setaccordian1] = useState(true);
  const [accordian2, setaccordian2] = useState(true);
  const [tableData, setTable]= useState([])
  const [historytableData, sethistorytableData]= useState([])
  const [historyrawtableData, sethistoryrawtableData]= useState([])
  const [uniqueHistories, setuniqueHistories]= useState([])
  const [assertslevelcard, setassertslevelcard]= useState([])
  const [finaldata, setfinaldata]= useState([])
  const [finaltempdata, setfinaltempdata]= useState([])
  const [finalrawtempdata, setfinalrawtempdata]= useState([])
  //hooks

  const { faultupdateLoading, faultupdateData, faultupdateError, getUpdateFaultInfo } = useUpdateFaultInfo()
  const { faultInfoLoading, faultInfoData, faultInfoError, getFaultInfo } = useGetFaultInfo();
  let navigate = useNavigate();
  const ModalRef = useRef()
  const tableheadCells = [
    {
      id: 'SNo',
      numeric: false,
      disablePadding: true,
      label: t('SNo'),
      align: 'left',
      width:100,
    },
    {
      id: 'Asset',
      numeric: false,
      disablePadding: true,
      label: t('Asset'),
      align: 'left',
      colSearch: true,
      width:120
    },
    {
      id: 'Sensor',
      numeric: false,
      disablePadding: true,
      label: t('Sensor'),
      align: 'left',
      colSearch: true,
      width:120
    },
    {
      id: 'SensorAxis',
      numeric: false,
      disablePadding: true,
      label: t('Axis'),
      align: 'left',
      colSearch: true,
      width:120
    },
    {
      id: 'Fault',
      numeric: false,
      disablePadding: true,
      label: t('Fault'),
      align: 'left',
      colSearch: true,
      width:120
    },
    {
      id: 'Severity',
      numeric: false,
      disablePadding: true,
      label: t('Severity'),
      align: 'left',
      colSearch: true,
      width:120
    },
    {
      id: 'Recommendations',
      numeric: false,
      disablePadding: true,
      label: t('Recommendations'),
      align: 'left',
      colSearch: true,
      width:160
    },
    {
      id: 'Rule',
      numeric: false,
      disablePadding: false,
      label: 'Rule',
      align: 'left',
      colSearch: true,
      width:100
    },
    {
      id: 'Status',
      numeric: false,
      disablePadding: false,
      label: t('status'),
      align: 'left',
      colSearch: true,
      width:120
    },
    {
      id: 'updated_at',
      numeric: false,
      disablePadding: true,
      label: t('Updated at'),
      align: 'left',
      colSearch: true,
      width:100
    },

    // {
    //   id: 'Analyst',
    //   numeric: false,
    //   disablePadding: false,
    //   label: t('Analyst'),
    //   align: 'left',
    //   colSearch: true,
    //   width:100
    // },
    {
      id: 'Fault_ID',
      numeric: false,
      disablePadding: true,
      label: t('Fault_id'),
      align: 'left',
      display: 'none',
      hide: true,
      colSearch: true,
      width:100
    },
    {
      id: 'Fault_severity_id',
      numeric: false,
      disablePadding: true,
      label: t('FaultSeverity'),
      align: 'left',
      display: 'none',
      hide: true,
      colSearch: true,
      width:100
    },

    {
      id: 'Data_received',
      numeric: false,
      disablePadding: true,
      label: t('Latest Data Recorded'),
      align: 'left',
      display: 'none',
      hide: true,
      colSearch: true,
      width:140
    },
    {
      id: 'Fault_processed',
      numeric: false,
      disablePadding: true,
      label: t('Last Defect Processed'),
      align: 'left',
      display: 'none',
      hide: true,
      colSearch: true,
      width:130
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('Fault ID'),
      hide: true,
      display: "none",
      colSearch: true,
      width: 100

  }

  ];

  const headOverviewCells = [
        
    {
        id: 'SNo',
        numeric: false,
        disablePadding: true,
        label: 'SNo',
    },
    {
        id: 'Asset',
        numeric: false,
        disablePadding: true,
        label: 'Asset',
        colSearch: true,
    },
    {
        id: 'Severity',
        numeric: false,
        disablePadding: true,
        label: 'Severity',
        colSearch: true,
    },
    {
        id: 'TriggeredAt',
        numeric: false,
        disablePadding: true,
        label: 'Triggered At',
        colSearch: true,
    },
    {
        id: 'PDMFaults',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'PDM Faults'
    }
  ];

  const headhistoryCells = [
        
    {
        id: 'SNo',
        numeric: false,
        disablePadding: true,
        label: 'SNo',
    },
    {
      id: 'Asset',
      numeric: false,
      disablePadding: true,
      label: 'Asset',
      colSearch: true,
  },
    {
        id: 'Instrument',
        numeric: false,
        disablePadding: true,
        label: 'Instrument',
        colSearch: true,
    },
    {
        id: 'Metrics',
        numeric: false,
        disablePadding: true,
        label: 'Metrics',
        colSearch: true,        
    },
    {
        id: 'Severity',
        numeric: false,
        disablePadding: true,
        label: 'Severity',
        colSearch: true,
    },
    {
        id: 'TriggeredAt',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'Triggered At'
    },
  //   {
  //     id: 'LimitValue',
  //     numeric: false,
  //     disablePadding: true,
  //     colSearch: true,
  //     label: 'Limit Value'
  // },
  // {
  //   id: 'RecentAlarmAt',
  //   numeric: false,
  //   colSearch: true,
  //   disablePadding: true,
  //   label: 'Recent Alarm At'
  // },
    {
        id: 'PDMFaults',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'PDM Faults'
    },
    {
      id: 'Observation',
      numeric: false,
      disablePadding: true,
      colSearch: true,
      label: 'Observation'
  },
    {
        id: 'Recommendation',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'Recommendation'
    }
  ];

  const headhisCells = [
        
    {
        id: 'SNo',
        numeric: false,
        disablePadding: true,
        label: 'SNo',
    },
    {
      id: 'Asset',
      numeric: false,
      colSearch: true,
      disablePadding: true,
      label: 'Asset',
  },
    {
        id: 'Instrument',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'Instrument',
    },
    {
        id: 'Metrics',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'Metrics',
    },
    {
      id: 'Criticality',
      numeric: false,
      disablePadding: true,
      label: 'Criticality',
      display: 'none',
      hide: true
  },
    {
        id: 'Severity',
        numeric: false,
        colSearch: true,
        disablePadding: true,
        label: 'Severity'
    },
    {
        id: 'TriggeredAt',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'Triggered At'
    },
  //   {
  //     id: 'LimitValue',
  //     numeric: false,
  //     disablePadding: true,
  //     colSearch: true,
  //     label: 'Limit Value'
  // },
  // {
  //   id: 'RecentAlarmAt',
  //   numeric: false,
  //   colSearch: true,
  //   disablePadding: true,
  //   label: 'Recent Alarm At'
  // },
    {
        id: 'PDMFaults',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'PDM Faults'
    },
    {
      id: 'Observation',
      numeric: false,
      disablePadding: true,
      colSearch: true,
      label: 'Observation'
  },
    {
        id: 'Recommendation',
        numeric: false,
        disablePadding: true,
        colSearch: true,
        label: 'PDM Recommendation'
    }
  ];

  const timeFormat = (val) => {
    return moment(val).format("DD-MM-YYYY " + HF.HMS);
  }

  const handleclick = () => {
    setaccordian1(!accordian1)
}

const handleclick1 = () => {
  setaccordian2(!accordian2)
}


  const overviewtypeoption = [
    { id: 1, title: "Default View" },
    { id: 2, title: "Detailed View" },
  ];  

  useEffect(() => {
    if (new Date(customdatesval.StartDate).getTime() !== new Date(customdatesval.EndDate).getTime() && headPlant && headPlant.id) {
      console.log('hi1')
      fetchfaults()
      setLoading(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customdatesval.StartDate, customdatesval.EndDate,headPlant])

  const filterOptions = [
    { id: 1, title: "None" },
    { id: 2, title: "Instrument" },
    { id: 3, title: "Metrics" },
    { id: 4, title: "Severity" }
];

const handleMetricsPageChange = (e, pageNumber) => {
  setMetricsCurrentPage(pageNumber);
  const startIndex = pageNumber * metricsRowsPerPage;
  const endIndex = startIndex + metricsRowsPerPage;
  setMetricsCurrentData(finaldata.slice(startIndex, endIndex))
}

const handleMetricsRowsPerPageChange = (event) => {
  setMetricsRowsPerPage(parseInt(event.target.value))
  let endIndex = parseInt(event.target.value)
  setMetricsCurrentData(finaldata.slice(0, endIndex))
  setMetricsCurrentPage(0)
}



  useEffect(()=>{
    processedoverviewrows()
  },[overviewdata])

  useEffect(() => {
    const timer = setTimeout(() => {
        setButtonsEnabled(true);
    }, 7000);

    return () => clearTimeout(timer);
}, [historytableData]);

  const handleviewmore = (id,value)=>{  
    renderAsset(value)
}
const handletrends = (id,value)=>{  
  menuItemClick(3, value, value.instrument_name,assetdata && assetdata.entity_name )
 }
 const handletasks = (id,value)=>{  
   menuItemClick(4, value ,value.instrument_name,assetdata && assetdata.entity_name )
 }
 const handlefft = (id,value)=>{  
   menuItemClick(1, value, value.instrument_name,assetdata && assetdata.entity_name )
 }

  const processedoverviewrows = () => {
    let temptabledata = [];
    let rawobject = [];
    if (overviewdata.length > 0) {
        temptabledata = temptabledata.concat(
          overviewdata.map((val, index) => {
            const objectRow = {
              SNo: index + 1,
              Asset: val.entity_name ? val.entity_name : "-",
              Severity: !val.latest_fault_severity_name || val.latest_fault_severity_name === ""
              ? "No Data"
              : val.latest_fault_severity_name === "All" 
              ? "Normal" 
              : val.latest_fault_severity_name,
              TriggeredAt: val.latest_fault_time ? moment(val.latest_fault_time).format("DD/MM/YYYY HH:mm:ss") : "-",               
              PDMFaults: val.latest_fault_defect_name ? val.latest_fault_defect_name : "-"
          };

          rawobject.push(objectRow);

                return [
                    index + 1,
                    val.entity_name ? val.entity_name : "-",
                    <StatusNDL 
                      lessHeight
                      colorbg={
                        !val.latest_fault_severity_name || val.latest_fault_severity_name === "" 
                          ? "#D9D9D9" 
                          : val.latest_fault_severity_name === "severe" 
                          ? "error-alt" 
                          : val.latest_fault_severity_name === "moderate" 
                          ? "warning02-alt" 
                          : val.latest_fault_severity_name === "minor" 
                          ? "#FFC53D" 
                          : "#30A46c"
                      }
                      style={{
                        backgroundColor: 
                          !val.latest_fault_severity_name || val.latest_fault_severity_name === ""
                            ? "#D9D9D9"
                            : val.latest_fault_severity_name === "minor"
                            ? "#FFC53D"
                            : val.latest_fault_severity_name === "severe"
                            ? "error-alt"
                            : val.latest_fault_severity_name === "moderate"
                            ? "warning02-alt"
                            : "#30A46c",
                        color:"#FFFFFF"
                      }}
                      name={
                        !val.latest_fault_severity_name || val.latest_fault_severity_name === ""
                          ? "No Data"
                          : val.latest_fault_severity_name === "All" 
                          ? "Normal" 
                          : val.latest_fault_severity_name
                      }
                    />,         
                    val.latest_fault_time ? moment(val.latest_fault_time).format("DD/MM/YYYY HH:mm:ss") : "-",               
                    val.latest_fault_defect_name ? val.latest_fault_defect_name : "-"
                ];
            })
        );
    }
    setrawdataobject(rawobject)
    setTable(temptabledata);
  };    

  const colorBg = (severity_name) => {
    if(severity_name=== "severe"){
      return "error-alt"
    } else   if(severity_name=== "moderate"){
      return "warning02-alt"
    } else {
      return ""
    }
    };

    const processedhistoryrows = () => {
      let temptabledata = [];
      let rawobject = [];
      if (uniqueHistories.length > 0) {
          const filteredHistories = uniqueHistories.filter(val => {
              if (val.severity_name === "severe" && severemode) return true;
              if (val.severity_name === "moderate" && moderatemode) return true;
              if (val.severity_name === "minor" && mildmode) return true;
              if (val.severity_name === "All" && nofaultmode) return true;//NOSONAR
              return false;
          });
  
          temptabledata = temptabledata.concat(
              filteredHistories.map((val, index) => {
                  const matchedInstrument = EntityInstrumentsListData.find(
                      entity => entity.instrument.id === val.iid
                  );
                  const matchedDefect = defectsinfodata.find(
                      defect => defect.defect_id === parseInt(val.defect, 10)
                  );
                  const matchedAlert = AlertsOverviewData && AlertsOverviewData.finalAlertsData && AlertsOverviewData.finalAlertsData.length > 0 && AlertsOverviewData.finalAlertsData
                      .filter(alert => Number(alert.instrument_id) === Number(val.iid))
                      .sort((a, b) => new Date(b.value_time) - new Date(a.value_time));
  
                  const latestAlert = matchedAlert && matchedAlert.length > 0 ? matchedAlert[0] : null;
                  const limitValue = latestAlert
                      ? latestAlert.alert_level === "warning"
                          ? latestAlert.warn_value
                          : latestAlert.alert_level === "critical"
                          ? latestAlert.critical_value
                          : "-"
                      : "-";
                  const latestTime = latestAlert?.value_time || "-";
                  const latestTimeFormatted = latestTime && moment(latestTime).isValid()
                      ? moment(latestTime).format("DD/MM/YYYY HH:mm:ss")
                      : "-";
                const objectRow = {
                        SNo: index + 1,
                        Asset:  matchedInstrument?.entity_instruments?.name || "-",
                        Instrument: val.instrument_name || "-",
                        Metrics: val.metrics || "-",
                        Severity: val.severity_name === "All" ? "Normal" : val.severity_name,
                        TriggeredAt:val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : "-",
                        LimitValue:limitValue,
                        RecentAlarmAt:latestTimeFormatted,
                        PDMFaults:val.defect_name || "-",
                        Observation: matchedDefect?.observation || "-",
                        Recommendation: val.action_recommended || "-",
                        iid: val.iid
                    };
          
                    rawobject.push(objectRow);
                  
  
                  return [
                      index + 1,
                      matchedInstrument?.entity_instruments?.name || "-",
                      val.instrument_name || "-",
                      val.metrics || "-",
                      <StatusNDL
                          lessHeight
                          colorbg={colorBg(val.severity_name)}
                          style={
                              val.severity_name === "minor"
                                  ? { backgroundColor: "#FFC53D", color: "#FCFCFC" }
                                  : val.severity_name === "All"
                                  ? { backgroundColor: "#30A46C", color: "#FCFCFC" }
                                  : {}
                          }
                          name={val.severity_name === "All" ? "Normal" : val.severity_name}
                      />,
                      val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : "-",
                      // limitValue,
                      // latestTimeFormatted,
                      val.defect_name || "-",
                      matchedDefect?.observation || "-",
                      val.action_recommended || "-"
                  ];
              })
          );
      }
      sethistoryrawtableData(rawobject)
      sethistorytableData(temptabledata);
  };
  

  useEffect(()=>{
    if(!defetcsinfoLoading && defectsinfodata && !defectsinfoerror && !EntityInstrumentsListLoading && EntityInstrumentsListData && !EntityInstrumentsListError && !AlertsOverviewLoading && AlertsOverviewData && !AlertsOverviewError){
    processedhistoryrows()
    }
  },[uniqueHistories, defetcsinfoLoading, defectsinfodata, defectsinfoerror, EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, AlertsOverviewLoading, AlertsOverviewData, AlertsOverviewError, severemode, moderatemode, mildmode, nofaultmode])

  const processedhisrows = (bulkdata) => {
    let groupedData = {};
    if (bulkdata.length > 0) {
        const groupKey = getGroupKey();
        if (groupKey) {
            groupedData = groupBy(bulkdata, groupKey);

            Object.keys(groupedData).forEach((key) => {
                if (key === "All") {
                    groupedData["normal"] = groupedData["All"];
                    delete groupedData["All"];
                }
            });
        } else {
            groupedData["All"] = bulkdata; 
        }
    }
    setGroupedHistableData(groupedData);
};
  
  useEffect(() => {
    let bulkdata = [];
    assertslevelcard.forEach((a) => {
      if (a.faults && Array.isArray(a.faults)) {
        a.faults.forEach((fault) => {
          if (fault.history) {
            bulkdata = bulkdata.concat(fault.history);
          }
        });
      }
    });
    if (bulkdata?.length > 0) {
      const updatedData = bulkdata.map(item => ({
        ...item,
        metrics: (() => {
          switch (item.key) {
            case "E":
              return "Envelop Acceleration (X)";
            case "X":
              return "Horizontal Velocity (X)";
            case "Y":
              return "Axial Velocity (Y)";
            case "Z":
              return "Vertical Velocity (Z)";
            default:
              return "-";
          }
        })()
      }));
      setfinaldata(updatedData);
      const startIndex = metricsCurrentPage * metricsRowsPerPage;
      const endIndex = startIndex + metricsRowsPerPage;
      setMetricsCurrentData(updatedData.slice(startIndex, endIndex))
      processedhisrows(updatedData.slice(startIndex, endIndex));
    }
  }, [assertslevelcard, selectedFilter,metricsCurrentPage,metricsRowsPerPage ]);

  useEffect(()=>{
    processedhisrows(metricsCurrentData);
  },[metricsRowsPerPage,metricsCurrentData])


  useEffect(()=>{
    processedfinalrows()
  },[finaldata])

  const processedfinalrows = () => {
    let temptabledata = [];
    let rawobject = [];
    if (finaldata.length > 0) {
        temptabledata = finaldata.map((val, index) => {
          const matchedAlert = AlertsOverviewData && AlertsOverviewData.finalAlertsData && AlertsOverviewData.finalAlertsData.length > 0 && AlertsOverviewData.finalAlertsData
          .filter(alert => Number(alert.instrument_id) === Number(val.iid))
          .sort((a, b) => new Date(b.value_time) - new Date(a.value_time));

            const latestAlert = matchedAlert && matchedAlert.length > 0 ? matchedAlert[0] : null;
            const limitValue = latestAlert
                ? latestAlert.alert_level === "warning"
                    ? latestAlert.warn_value
                    : latestAlert.alert_level === "critical"
                    ? latestAlert.critical_value
                    : "-"
                : "-";
            const latestTime = latestAlert?.value_time || "-";
            const latestTimeFormatted = latestTime && moment(latestTime).isValid()
                ? moment(latestTime).format("DD/MM/YYYY HH:mm:ss")
                : "-";
                const objectRow = {
                  SNo: index + 1,
                  Asset:  val.entity_name,
                  Instrument:  val.instrument_name || "-",
                  Metrics:   val.metrics || "-",
                  Severity:val.severity_name === "All" ? "Normal" : val.severity_name,
                  TriggeredAt:moment(val.time).format("DD/MM/YYYY HH:mm:ss"),
                  LimitValue:limitValue,
                  RecentAlarmAt:latestTimeFormatted,
                  PDMFaults:val.defect_name || "-",
                  Observation:  val.observation || "-",
                  Recommendation: val.action_recommended || "-",
                  iid: val.iid
              };
    
              rawobject.push(objectRow);
            return [
                index + 1,
                val.entity_name,
                val.instrument_name || "-",
                val.metrics || "-",
                val.severity_name === "All" ? "Normal" : val.severity_name,
                <StatusNDL
                    lessHeight
                    colorbg={colorBg(val.severity_name)}
                    style={
                      val.severity_name === "minor"
                          ? { backgroundColor: "#FFC53D", color: "#FCFCFC" }
                          : val.severity_name === "All" ? { backgroundColor: "#30A46C", color: "#FCFCFC" } : {}
                  }
                    name={val.severity_name === "All" ? "Normal" : val.severity_name}
                />,
                moment(val.time).format("DD/MM/YYYY HH:mm:ss"),
                // limitValue,
                // latestTimeFormatted,
                val.defect_name || "-",
                val.observation || "-",
                val.action_recommended || "-",
            ];
        });
    }

    setfinaltempdata(temptabledata);
    setfinalrawtempdata(rawobject)
};
  
  const groupBy = (data, key) => {
    return data.reduce((result, item) => {
      const groupKey = item[key] || "Unknown";
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  };
  
  const getGroupKey = () => {
    switch (selectedFilter) {
      case 2:
        return "instrument_name";
      case 3:
        return "metrics"; 
      case 4:
        return "severity_name"; 
      default:
        return null; 
    }
  };

  useEffect(()=>{
    console.log(assetdata,"assetdata")
    if (Object.keys(assetdata).length > 0 && assetdata.entity_instruments.length > 0 && type === 1) {
      
      let instrumentIds = [];
      let parameters = []
  
      assetdata.entity_instruments.forEach(instrument => {
          const result = getiidparam(instrument.instrument_id);
          instrumentIds.push(result[0]); 
          parameters.push(result[1])
      });
  
      const instrumentIdsString = instrumentIds.join(','); 
      getMeterReadingsV1(headPlant.schema, instrumentIdsString,parameters.toString(), customdatesval.StartDate, customdatesval.EndDate);
  }  
  else if (Object.keys(instrumentdata).length > 0 && type === 2) {
    let result = getiidparam(instrumentdata.data.instrument_id)
    getMeterReadingsV1(headPlant.schema, result[0], result[1], customdatesval.StartDate, customdatesval.EndDate)
    }
   else if (Object.keys(axisdata).length > 0 && type === 3) {
    let result = getiidparam(axisdata.data.iid)
    getMeterReadingsV1(headPlant.schema, result[0], result[1], customdatesval.StartDate, customdatesval.EndDate)
    }
},[type,assetdata,instrumentdata,axisdata,headPlant])

const getiidparam = (instrument) => {
    let iid_index = instrumentList.findIndex(val => val.id === instrument)
    let paramArr = ''
    let param = []
    if (iid_index >= 0) {
        param = instrumentList[iid_index].instruments_metrics.filter(im => im.metric.metric_datatype !== 4).map(m => m.metric.name)
    }
    paramArr = param.toString()
    return [instrument, paramArr]
}


  const handleType = ((e)=>{
    setType(e)
  })
  useEffect(() => {
    if(queryParam && (queryParam.includes('=') || queryParam.includes('&'))){ 
          // Extracting the respective values
          const severity = queryParams['severity'];
          const faultmode = queryParams['faultmode'];
          const nofault = queryParams['nofault'];
          const nodata = queryParams['nodata'];
          const range = queryParams['range']; 
      if((severity && nofault && nodata && faultmode) || range){
        console.log(severity , nofault , nodata , faultmode , range,"params")
        setseveremode(true)
        setmoderatemode(true)
        setmildmode(true)
        setnofaultmode(true)
        setnodatamode(false)
        setFaultModeParam(faultmode)
        setRangeParam(range)
      
      }else{
        setErrorPage(true)
      }
    }else if(queryParam && !(queryParam.includes('=') || queryParam.includes('&'))){ 
      setErrorPage(true)
    }
   
  
   else{
    setseveremode(true)
    setmoderatemode(true)
    setmildmode(true)
    setnofaultmode(true)
    setnodatamode(false)
   }
     
    
    if (new Date(customdatesval.StartDate).getTime() !== new Date(customdatesval.EndDate).getTime() && assets.length > 0) {
      console.log('hi')
      fetchfaults()
      setLoading(true)
    }
   setshowoverviewdata(true)
   setshowassetdata(false)
    setshowinstrumentdata(false)
    setshowaxisdata(false)
    setnavigateArr([{ "index": 0, "name": headPlant.name, "data": {} }])
    setinstrumentdata({})
    setaxisdata({})
    setassetdata({})
    getDefectInfo()
    getEntityInstrumentsList(headPlant.id)
    let queryData = {
      schema: headPlant.schema,
      from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      line_id: headPlant.id,
      alert_type: "alert",
      instrument_types: [3]
  };
  
  getAlertsOverviewData(queryData);
    setoverviewdata([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant,queryParam,customdatesval])


  const getAnalystName = (userIndex) => {
    if (userIndex >= 0) {
      return users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-';
    } else {
      return '-';
    }
  };

  const handleSwitch = (type) => {
    setSelected(type);
  };

  const handleHisSwitch = (type) => {
    setHisSelected(type);
  };

  const faultdataprocessing = (faultInfodata) => {
    let instrument_fault_data = [];
    // eslint-disable-next-line array-callback-return
    let tempfaultinfoData = [...faultInfodata];
    tempfaultinfoData.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
   

    tempfaultinfoData.forEach((item) => {
      let instrumentindex = instrumentList.findIndex(v => v.id === item.iid);
      let defect_index = defectinfodata ? defectinfodata.findIndex(d => Number(d.defect_id) === Number(item.defect)) : -1;
      let observation_index = defectinfodata ? defectinfodata.findIndex(d => Number(d.defect_id) === Number(item.defect)) : -1;
      let severity_index = defectsseveritydata ? defectsseveritydata.findIndex(s => Number(s.id) === Number(item.severity)) : -1;
      let action_index = faultactions ? faultactions.findIndex(f => (Number(f.defect_id) === Number(item.defect)) && (Number(f.severity_id) === Number(item.severity))) : -1;
      let userIndex = users.findIndex(v => v.user_id === item.updated_by);
      let sensorindex = sensorsdata.findIndex(s => s.iid === item.iid && s.axis === item.key);
      const analystName = getAnalystName(userIndex);
      // Array-building-starts-here
      let instru_present = instrument_fault_data.findIndex(instru => instru.iid === item.iid);
      // If instrument entry is present
      if (instru_present >= 0) {
        // Defect-axis-grouping
        let defect_present = instrument_fault_data[instru_present].faults.findIndex(d => (Number(d.defect) === Number(item.defect)) && (d.key === item.key));
        // Defect-axis-group-present
        if (defect_present >= 0) {
          instrument_fault_data[instru_present].faults[defect_present].history.push(
            Object.assign({}, item, {
              "defect_name": defect_index >= 0 ? defectinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
              "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
              "observation": observation_index >= 0 ? defectinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
              "value":  metricValue ? metricValue : "" ,
              "title":  metricTitle ? metricTitle : "" ,
              "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
              "analyst":analystName,
              "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
              "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
              "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
              "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-',  //sensorindex >= 0 && sensorsdata[sensorindex].predicted_rpm ? sensorsdata[sensorindex].predicted_rpm : '-',
              "severity" : action_index >= 0 ? item.severity :  -1 
            })
          );
        } else {
          instrument_fault_data[instru_present].faults.push(Object.assign({}, item, {
            "defect_name": defect_index >= 0 ? defectinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
            "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
            "observation": defect_index >= 0 ? defectinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
            "value":  metricValue ? metricValue : "" ,
            "title":  metricTitle ? metricTitle : "" ,
            "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
            "analyst": analystName,
            "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
            "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
            "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
            "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', //sensorindex >= 0 && sensorsdata[sensorindex].predicted_rpm ? sensorsdata[sensorindex].predicted_rpm : '-',
            "severity" : action_index >= 0 ? item.severity :  -1 ,
           
            "history": [Object.assign({}, item, {
              "defect_name": defect_index >= 0 ? defectinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
              "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
              "observation": defect_index >= 0 ? defectinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
              "value":  metricValue ? metricValue : "" ,
              "title":  metricTitle ? metricTitle : "" ,
              "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
              "analyst": analystName,
              "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
              "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
              "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
              "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', //sensorindex >= 0 && sensorsdata[sensorindex].predicted_rpm ? sensorsdata[sensorindex].predicted_rpm : '-',
              "severity" : action_index >= 0 ? item.severity :  -1 ,
            })]
          }));
        }
      } else {
        instrument_fault_data.push({
          "iid": item.iid,
          "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
          "datapresent": true,
          "faults": [Object.assign({}, item, {
            "defect_name": defect_index >= 0 ? defectinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
            "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
            "observation": defect_index >= 0 ? defectinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
            "value":  metricValue ? metricValue : "" ,
            "title":  metricTitle ? metricTitle : "" ,
            "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
            "analyst": analystName,
            "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
            "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
            "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
            "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', //sensorindex >= 0 && sensorsdata[sensorindex].predicted_rpm ? sensorsdata[sensorindex].predicted_rpm : '-',
            "severity" : action_index >= 0 ? item.severity :  -1, 
            "history": [Object.assign({}, item, {
              "defect_name": defect_index >= 0 ? defectinfodata[defect_index].defect_name : "No Faults",
              "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
              "observation": defect_index >= 0 ? defectinfodata[defect_index].observation : "No Observation",
              "value":  metricValue ? metricValue : "" ,
              "title":  metricTitle ? metricTitle : "" ,
              "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
              "analyst": analystName,
              "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
              "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
              "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
              "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', //sensorindex >= 0 && sensorsdata[sensorindex].predicted_rpm ? sensorsdata[sensorindex].predicted_rpm : '-',
              "severity" : action_index >= 0 ? item.severity :  -1 ,
              
            })]
          })]
        });
      }

    })



    let filtereddata = [...instrument_fault_data]
    let inst_arr = [];
    assets.map(fault_asset => {
      if (fault_asset.info && fault_asset.info.fault_Analysis  && fault_asset.entity_instruments && fault_asset.entity_instruments.length > 0) {
        fault_asset.entity_instruments.map(x => {
          //Instrument Data present in faulthistory in given time frame
          let instrudataavailable = instrument_fault_data.findIndex(i => i.iid === x.instrument_id)
   
          if (instrudataavailable < 0) {
            let instrumentindex = instrumentList.findIndex(v => v.id === x.instrument_id)
            instrument_fault_data.push({
              "iid": x.instrument_id,
              "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
              "datapresent": false,
              "faults": []
            })
          }
          inst_arr.push(x.instrument_id);
        })
      }
    })

    let defects = filtereddata.filter(x => inst_arr.includes(x.iid)).flatMap(entity => {
      return entity.faults.map(defects => {
        return { id:  defects.defect_name, name: defects.defect_name , count: defects.history.length };
      });
    });
    const aggregatedCounts = {};
    defects.forEach(item => {
      const { id, count } = item;
      if (aggregatedCounts[id]) {
        aggregatedCounts[id] += parseInt(count);
      } else {
        aggregatedCounts[id] = parseInt(count);
      }
    });
    let total = 0;
    for (let key in aggregatedCounts) {
      if (aggregatedCounts.hasOwnProperty(key)) {
        total += aggregatedCounts[key];
      }
    }
    settotalFault(total)
    const aggregatedCountsArray = Object.keys(aggregatedCounts).map(id => ({
      id,
      title: id + " " + "(" + aggregatedCounts[id].toString() + ")",
      // Convert count back to string if needed
    }));

    
      let defaultselectedarray = [...aggregatedCountsArray]
   
    console.log(aggregatedCountsArray,defaultselectedarray,"aggregatedCountsArray")
    setmodeFilterOption(aggregatedCountsArray)
    if(FaultModeParam === 'all'){
      setmodeFilterValue(aggregatedCountsArray)
    }
    else{
      setmodeFilterValue(defaultselectedarray)
    }
   
    setfaultInforData(faultInfoData)
    setFaultFilterData(instrument_fault_data)
    setLoading(false)

  }

  useEffect(() => {
    if (Array.isArray(FaultFilterData)) {
        const histories = [];
        FaultFilterData.forEach((instrument) => {
            if (Array.isArray(instrument.faults)) {
                instrument.faults.forEach((fault) => {
                    if (Array.isArray(fault.history)) {
                        fault.history.forEach((history) => {
                            histories.push(history);
                        });
                    }
                });
            }
        });
        console.log("histories", histories)
        const updatedData = histories.map(item => ({
          ...item,
          metrics: (() => {
            switch (item.key) {
              case "E":
                return "Envelop Acceleration (X)";
              case "X":
                return "Horizontal Velocity (X)";
              case "Y":
                return "Axial Velocity (Y)";
              case "Z":
                return "Vertical Velocity (Z)";
              default:
                return "-";
            }
          })()
        }));
        setuniqueHistories(updatedData)
        const defectCounts = histories.reduce((acc, curr) => {
            const defect = curr.defect_name; 
            if (defect) {
                acc[defect] = (acc[defect] || 0) + 1;
            }
            return acc;
        }, {});

        const totalDefects = Object.values(defectCounts).reduce((sum, count) => sum + count, 0);

        const chartData = Object.entries(defectCounts).map(([name, count]) => ({
            name,
            data: ((count / totalDefects) * 100).toFixed(2), 
        }));
        setchartData(chartData)
       
    }
}, [FaultFilterData]);

  useEffect(() => {
    if (!faultInfoLoading && faultInfoData && !faultInfoError && assets.length > 0) {
      faultdataprocessing(faultInfoData)
    } else if (faultInfoError || assets.length === 0) {
      setLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faultInfoLoading, faultInfoData, faultInfoError, assets, metricTitle, metricValue])
  useEffect(() => {
  if(queryParam && (queryParam.includes('=') || queryParam.includes('&'))){
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
          const asset = queryParams['asset'];
          const instrument = queryParams['instrumentname'];
              if(asset || instrument){
                setAssetParam(asset)
                if(paramsArray.length >2 && !instrument && asset){
                  setErrorPage(true)
                }
                if(paramsArray.length >2 && instrument && !asset){
                  setErrorPage(true)
                }
                setInstrumentParam(instrument)
                setflag(true)
              }else{
                setErrorPage(true)
              }
  }
    
    dataFormatingForFaults(FaultFilterData,assetParam,instrumentParam)
    if(modeFilterValue.findIndex(m=>m.id === "No Faults") < 0){
      setnofaultmode(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FaultFilterData, modeFilterValue, faultInforData,queryParam])

  useEffect(()=>{
    if(queryParam && type === 1 && flag){
      setflag(false)
      filterdata(accordiandata,assetParam,instrumentParam)
    }
  },[type])

  const dataFormatingForFaults = (instrument_fault_data,asset,instrument) => {
    let filteredData = []
    if (modeFilterValue.length > 0) {
      let keyId = modeFilterValue.map(x => x.id)
      filteredData = instrument_fault_data.map(items => {
        return {
          ...items, faults: items.faults.filter(defect => {
            return keyId.includes(defect.defect_name)
          })
        }
      })
      filteredData = filteredData.filter(x => (x.datapresent && x.faults.length > 0) || (!x.datapresent))
    } else {
      filteredData = instrument_fault_data
      
    }
    let entity_data = []
    let entity_instruments = assets.map((val =>
      val.entity_instruments
    )).flat(1)
    assets.filter(x => x.info && x.info.fault_Analysis && x.info.fault_Analysis === true).map((val => {

      let asset_level_fault_time_severity = []
      let asset_level_latest_fault = ''
      let asset_level_latest_severity = ''
      let asset_level_latest_severity_name = ''
      let asset_level_latest_severity_defect_name = ''
      entity_data.push({
        "entity_id": val.id,
        "entity_name": val.name,
        "entity_instruments": val.entity_instruments.length > 0 ?
          val.entity_instruments.map(ei => {
            let faults_index = filteredData.findIndex(i => (i.iid === ei.instrument.id) && (i.instrument_name === ei.instrument.name))
            if (faults_index >= 0 && filteredData[faults_index].datapresent) {
             

                asset_level_fault_time_severity = asset_level_fault_time_severity.concat(filteredData[faults_index].faults)
                asset_level_latest_fault = asset_level_fault_time_severity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0].time
                asset_level_latest_severity_name = asset_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(asset_level_latest_fault).getTime())[0] ? asset_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(asset_level_latest_fault).getTime())[0].severity_name : ''
                asset_level_latest_severity = asset_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(asset_level_latest_fault).getTime())[0] ? asset_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(asset_level_latest_fault).getTime())[0].severity : ''
                asset_level_latest_severity_defect_name = asset_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(asset_level_latest_fault).getTime())[0] ? asset_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(asset_level_latest_fault).getTime())[0].defect_name : ''
                //instrument_level
                var instrument_level_fault_time_severity = filteredData[faults_index].faults//NOSONAR
                var instrument_level_latest_fault = instrument_level_fault_time_severity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0].time//NOSONAR
                var instrument_level_latest_fault_data = instrument_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(instrument_level_latest_fault).getTime())[0] ? instrument_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(instrument_level_latest_fault).getTime())[0] : {}//NOSONAR

            }
            return ({
              "instrument_id": ei.instrument.id,
              "instrument_name": ei.instrument.name,
              "datapresent": faults_index >= 0 ? filteredData[faults_index].datapresent : false,
              "faults": faults_index >= 0 ?
                filteredData[faults_index].faults.map((f) => {
                  if (f.history) {
                    f.history = f.history.map(h => Object.assign({}, h, { "entity_name": val.name }))
                  }
                  return Object.assign({}, f, {
                    "entity_name": val.name
                  })
                }) : [],
              "latest_fault_data": instrument_level_latest_fault_data ? instrument_level_latest_fault_data : {}
            });
          }) : [],
        "latest_fault_time": asset_level_latest_fault,
        "latest_fault_severity_name": asset_level_latest_severity_name,
        "latest_fault_severity": asset_level_latest_severity,
        "latest_fault_defect_name": asset_level_latest_severity_defect_name
      })

    }))

    let tempfinaldata = []
    // eslint-disable-next-line array-callback-return
    entity_instruments && entity_instruments.length > 0 && entity_instruments.map((val) => {
      tempfinaldata = tempfinaldata.concat(
        faultInforData.map((item) => {
          if (item.iid === val.instrument_id) {
            return Object.assign({}, item, { "entity_id": val.entity_id })
          } else return []
        }
        ).flat(1))
    })
    if(modeFilterValue && modeFilterValue.length === 0){
      entity_data = entity_data.filter(a => a.entity_instruments.map(e => e.datapresent).every(d => d === false))
    }
    let overallfaultsdata = []
    entity_data.forEach(e => {
      e.entity_instruments && e.entity_instruments.forEach(a => {
        if (a.faults && a.faults.length > 0) {
          overallfaultsdata = overallfaultsdata.concat(a.faults);
          a.faults.forEach(f => {
            if (f.history && f.history.length > 0) {
              overallfaultsdata = overallfaultsdata.concat(f.history);
            }
          });
        }

      })
    })
    let tempdownloadabledata = []
    setaccordiandata(entity_data)
    if (overallfaultsdata && overallfaultsdata.length > 0) {
      // eslint-disable-next-line array-callback-return
      overallfaultsdata.forEach((val, index) => {
        let userIndex = users.findIndex(v => v.user_id === val.updated_by)
        if (val) {
          tempdownloadabledata.push(
            [
              index + 1,
              val.entity_name,
              val.instrument_name,
              val.key,
              val.defect_name.charAt(0).toUpperCase() + val.defect_name.slice(1),
              val.severity_name.charAt(0).toUpperCase() + val.severity_name.slice(1),
              val.action_recommended,
              val.rule,
              val.remarks && val.remarks.length > 0 ? "Acknowledged" :
            <span onClick={(id) => handleEdit(id, val)} style={{cursor: 'pointer', color: 'blue'}}>Yet to Acknowledge</span>,
              val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
              userIndex >= 0 ? users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-' : '-'
            ]
          )
        }
      })
    }
    setallfaultsdata(tempdownloadabledata);
    setAckType(1);
    if (entity_data.filter(e => e.entity_id == assetdata.entity_id).length > 0)
    assetexceldata(entity_data.filter(e => e.entity_id == assetdata.entity_id)[0])
    filterdata(entity_data,asset,instrument)
    setseveritycount(entity_data.filter(a => Number(a.latest_fault_severity) === 3).length)
    setmoderatecount(entity_data.filter(a => Number(a.latest_fault_severity) === 2).length)
    setmildcount(entity_data.filter(a => Number(a.latest_fault_severity) === 1).length)
    setnofaultcount(entity_data.filter(a => Number(a.latest_fault_severity) === -1).length)
    setnodatacount(entity_data.filter(a => a.entity_instruments.map(e => e.datapresent).every(d => d === false)).length)
  };

  useEffect(()=>{
    if (typeFilterValue === 2 && selected === "table") {
      setseveritycount(uniqueHistories.filter(a => Number(a.severity) === 3).length)
      setmoderatecount(uniqueHistories.filter(a => Number(a.severity) === 2).length)
      setmildcount(uniqueHistories.filter(a => Number(a.severity) === 1).length)
      setnofaultcount(uniqueHistories.filter(a => Number(a.severity) === -1).length)
    } else if(typeFilterValue === 1) {
        setseveritycount(accordiandata.filter(a => Number(a.latest_fault_severity) === 3).length)
        setmoderatecount(accordiandata.filter(a => Number(a.latest_fault_severity) === 2).length)
        setmildcount(accordiandata.filter(a => Number(a.latest_fault_severity) === 1).length)
        setnofaultcount(accordiandata.filter(a => Number(a.latest_fault_severity) === -1).length)
    }
  },[typeFilterValue, accordiandata, selected])
  
  useEffect(()=>{
    if(selected === "tile"){
    settypeFilterValue(1)
    }
  },[selected])

  const filterdata = (accordianData,asset,instrument) => {
    let filtereddata = [...accordianData]
    if (!severemode) {
      filtereddata = filtereddata.filter(a => Number(a.latest_fault_severity) !== 3)
    }


    if (!moderatemode) {
      filtereddata = filtereddata.filter(a => Number(a.latest_fault_severity) !== 2)
    }


    if (!mildmode) {
      filtereddata = filtereddata.filter(a => Number(a.latest_fault_severity) !== 1)
    }

    if (!nofaultmode) {
      let tempfiltereddata = filtereddata.filter(a => Number(a.latest_fault_severity) !== -1)
      filtereddata = tempfiltereddata.map(t=>{
        return Object.assign({},t,{entity_instruments : t.entity_instruments.filter(te=>te.faults.length > 0)})
      })
    }

    if (!nodatamode) {
      filtereddata = filtereddata.filter(a => !a.entity_instruments.map(e => e.datapresent).every(d => d === false))
    }
    let sortBasedTime = filtereddata.sort((a, b) => {
      const dateA = new Date(moment(a.latest_fault_time));
      const dateB = new Date(moment(b.latest_fault_time));

      if (isNaN(dateA) || isNaN(dateB)) {
        // Handle invalid dates if any
        return 0;
      }

      return dateB - dateA;
    });
    console.log(sortBasedTime,asset,instrument,showoverviewdata,showassetdata,"overview data")
    if(asset && asset !== '' && !instrument && showoverviewdata && !showassetdata && sortBasedTime.length > 0){
      console.log('check 1')
      let filteredAsset = sortBasedTime.filter(obj => obj.entity_id === asset)
      if(filteredAsset.length > 0){
        console.log(filteredAsset,"filteredAsset")
        renderAsset(filteredAsset[0])
      }
      else{
        setErrorPage(true)
      }
     
    }
    else if(asset && instrument && asset!=='' & instrument !== '' &&  showoverviewdata && !showassetdata && sortBasedTime.length > 0){
      console.log('check 2')
   
      let filteredAsset = sortBasedTime.filter(obj => obj.entity_id === asset)
      if(filteredAsset.length > 0){
        console.log(filteredAsset,"filteredAsset1")
        renderAsset(filteredAsset[0])
      }
      else{
        setErrorPage(true)
      }
     
    }
     else if(asset && asset!=='' && typeof instrument !== 'undefined' && !showoverviewdata && showassetdata && sortBasedTime.length > 0){
      console.log(asset,instrument,'check 3')
            let filteredInstrument = sortBasedTime.filter(obj => obj.entity_id === asset && obj.entity_instruments.some(instrumentObj => instrumentObj.instrument_id === instrument));
            console.log(filteredInstrument,"filtered instrument")
            if(filteredInstrument.length > 0){
              let finalFilteredInstrument = filteredInstrument && filteredInstrument[0] && filteredInstrument[0].entity_instruments && filteredInstrument[0].entity_instruments.length > 0 
              ? filteredInstrument[0].entity_instruments.filter(obj => obj.instrument_id === instrument)
              : [];
      
              console.log(finalFilteredInstrument, "final");
              if (filteredInstrument && filteredInstrument.length > 0 && filteredInstrument[0]) {
                renderInstrument(
                    finalFilteredInstrument[0], 
                    filteredInstrument[0].entity_name ? filteredInstrument[0].entity_name : []
                );
              } else {
                // Handle the case when filteredInstrument[0] is undefined
                console.log("filteredInstrument[0] is undefined or empty");
              }
            }
            else {
              setErrorPage(true)
            }
       
     }
    setoverviewdata(sortBasedTime)
    processoverviewdata(sortBasedTime)
  }
  useEffect(() => {
    filterdata(accordiandata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severemode, moderatemode, mildmode, nofaultmode, nodatamode])

 
  const filteroverview = (severity_index) => {

    if (severity_index === 3) {
      setseveremode(!severemode)
    }
    if (severity_index === 2) {
      setmoderatemode(!moderatemode)
    }
    if (severity_index === 1) {
      setmildmode(!mildmode)

    } if (severity_index === -1) {
      setnodatamode(!nodatamode)

    }
    if (!severity_index) {
      setnofaultmode(!nofaultmode)
    }
  }

  const assetexceldata = (data) => {
    let assetfaultsData = []

   data && data.entity_instruments && data.entity_instruments.map(a => {
      if (a.faults && a.faults.length > 0) {
        assetfaultsData = assetfaultsData.concat(a.faults)
        a.faults.map(f => {
          if (f.history && f.history.length > 0) {
            assetfaultsData = assetfaultsData.concat(f.history)
          }
        })
      }

    })

    let tempdownloadabledata = []
    if (assetfaultsData && assetfaultsData.length > 0) {
      // eslint-disable-next-line array-callback-return
      assetfaultsData.forEach((val, index) => {
        let userIndex = users.findIndex(v => v.user_id === val.updated_by)
        if (val) {
          tempdownloadabledata.push(
            [
              index + 1,
              val.entity_name,
              val.instrument_name,
              val.key,
              val.defect_name.charAt(0).toUpperCase() + val.defect_name.slice(1),
              val.severity_name.charAt(0).toUpperCase() + val.severity_name.slice(1),
              val.action_recommended,
              val.rule,
              val.remarks && val.remarks.length > 0 ? "Acknowledged" :
            <span onClick={(id) => handleEdit(id, val)} style={{cursor: 'pointer', color: 'blue'}}>Yet to Acknowledge</span>,
              val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
              userIndex >= 0 ? users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-' : '-'
            ]
          )
        }
      })
    }
    setassetfaultsdata(tempdownloadabledata)
    setAckType(2);
  }

  useEffect(() => {
    let dataFromAH = localStorage.getItem("openPDMFromAH");
    if (dataFromAH) {
      try {
        let data = JSON.parse(dataFromAH); 
  
        const matchingData = overviewdata.find(
          (item) => item.entity_id === data
        );
  
        if (matchingData) {
          renderAsset(matchingData); 
        } 
  
      } catch (error) {
        console.error("Error parsing dataFromAH", error);
      }
    }
  }, [overviewdata]);  

  const renderAsset = (data) => {
    handleType(1)
    assetexceldata(data)
    let linkarr = [...navigateArr]
    linkarr.push({ "index": 1, "name": data ? data.entity_name : '', "data": data })
    setassetdata(data)
    setshowassetdata(!showassetdata)
    console.log(linkarr,data,"check true")
    setshowoverviewdata(!showoverviewdata)
    setnavigateArr(linkarr)
    localStorage.setItem("openPDMFromAH", "")
  }
  const renderInstrument = (data, entity) => {
    console.log(data,entity,"instrument")
    handleType(2)
    let linkarr = [...navigateArr]
    linkarr.push({ "index": 2, "name": data.instrument_name, "data": data })
    setinstrumentdata({ "data": data, "asset": entity })
    setshowinstrumentdata(!showinstrumentdata)
    setshowassetdata(!showassetdata)
    setnavigateArr(linkarr)
    console.log(linkarr,"link")
    setTableData(processedrows(data.faults, true))
    setfaultsdata(data.faults)
    setinstrumentname(data.instrument_name)
    setassetname(entity)
  }


  const renderAxis = (data) => {
    let datas = data.entity_instruments[0].faults[0]
    let instrument = data.entity_instruments[0]
    let entity = data.entity_name
    let linkarr = [...navigateArr];
    linkarr.push({ "index": 3, "name": datas.defect_name, "data": datas })

    setaxisdata({ data: datas, asset: entity, instrument: instrument });
    setshowaxisdata(!showaxisdata);
    setshowinstrumentdata(!showinstrumentdata);
    setnavigateArr(linkarr);

    if (instrument && instrument.faults) {
        let processedHistory = [];

        instrument.faults.forEach(fault => {
            if (fault.history) {
                processedHistory.push(...fault.history);
            }
        });

        
            processedHistory = [...datas.history];
        const isNestedHistory = processedHistory.some(fault => fault.history);

        if (isNestedHistory) {
            processedHistory = processedHistory.flatMap(fault => fault.history || fault);
        }
        setfaultsdata(processedHistory);
    }
};

  const processoverviewdata = (overviewdata) => {
    console.log(overviewdata,assetdata,"is coming")
    try{
      let findasset = overviewdata.filter(o => o.entity_id === assetdata.entity_id)
      if (findasset.length > 0) {
        setassetdata(findasset[0])
      } else {
       if(!assetParam){
            setassetdata({})
       }
    
      }
  
  
  
      if (Object.keys(instrumentdata).length > 0) {
        findasset = overviewdata.filter(o => o.entity_id === assetdata.entity_id)
        if (findasset.length > 0) {
          let findinstrument = findasset[0].entity_instruments.filter(i => i.instrument_id === instrumentdata.data.instrument_id)
          if (findinstrument.length > 0) {
            setinstrumentdata({ "data": findinstrument[0], "asset": assetdata.entity_name })
            setTableData(processedrows(findinstrument[0].faults, true))
            setfaultsdata(findinstrument[0].faults)
          }
  
        }
      }
      
      if (Object.keys(instrumentdata).length > 0 && Object.keys(axisdata).length > 0) {
        findasset = overviewdata.filter(o => o.entity_id === assetdata.entity_id);
      
        if (findasset.length > 0) {
     let    findinstrument = findasset[0].entity_instruments.filter(i => i.instrument_id === instrumentdata.data.instrument_id);
          
          if (findinstrument.length > 0) {
            
            const defectToMatch = Array.isArray(axisdata.data) ? axisdata.data[0].defect : axisdata.data.defect;
            
            const allFaults = findinstrument.flatMap(inst => {
              return inst.faults
                .filter(f => f.defect === defectToMatch)
                .flatMap(fault => fault.history || []);
            });
      
            if (allFaults.length > 0) {
              const firstMatchingFault = findinstrument[0].faults.find(f => f.defect === defectToMatch);
              
              if (firstMatchingFault) {
                setaxisdata({ "data": allFaults, "asset": axisdata.asset, "instrument": axisdata.instrument });
              }
              setTableData(processedrows(allFaults, false));
              setfaultsdata(allFaults);
            } 
          }
        }
      }         
    
    }catch(err){
      console.log("error at processing data-Fault Analysis",err)
    }

  }



 

 

  const handleActiveIndex = (index) => {

    setType(index)

    if (index === 0) {
      setshowoverviewdata(true)
      setshowassetdata(false)
      setshowinstrumentdata(false)
      setshowaxisdata(false)
     // Check if navigateArr is defined before manipulating it
  if (navigateArr) {
    navigateArr.splice(index + 1, 3);
    setnavigateArr([...navigateArr]);
  }
      setshowhistory(true)
    }
    else if (index === 1) {
      setshowoverviewdata(false)
      setshowassetdata(true)
      setshowinstrumentdata(false)
      setshowaxisdata(false)
      if (navigateArr) {
        navigateArr.splice(index + 1, 2);
        setnavigateArr(prevNavigateArr => {
          const newArr = [...prevNavigateArr]; // Create a new array to trigger re-render
          return newArr;
        });
      }
      
      setshowhistory(true)
    }
    else if (index === 2) {
      setshowoverviewdata(false)
      setshowassetdata(false)
      setshowinstrumentdata(true)
      setshowaxisdata(false)
      if (navigateArr) {
        navigateArr.splice(index + 1, 2);
        setnavigateArr(prevNavigateArr => {
          const newArr = [...prevNavigateArr]; // Create a new array to trigger re-render
          return newArr;
        });
      }
      
      setshowhistory(true)
      setTableData(processedrows(instrumentdata.data.faults, true))
      setfaultsdata(instrumentdata.data.faults)
    }
    else if (index === 3) {
      setshowoverviewdata(false)
      setshowassetdata(false)
      setshowinstrumentdata(false)
      setshowaxisdata(true)

    }

  };

  const getTagprops = (severity) => {//NOSONAR
    
    let tagtext = severity === 1 ? "Minor" : severity === 2 ? "Moderate" : severity === 3 ? "Severe"  :severity === -1 ? "No Faults" : "No Data"
    let tagcolor = severity === 1 ? "#FFCA00" : severity === 2 ? "#EF5F00" : severity === 3 ? "#CE2C31" :severity === -1 ? "#30A46c" : "#E0E0E0"
    let textcolor = severity ===1 ?  "#FFF" :   (severity === 2 ||  severity ===3 || severity === -1)  ? "#FFF" : "#161616"
 
    return [tagtext, tagcolor, textcolor]
}

const processedrows = (faultsData, historypresent) => {

  if (!historypresent) {
      try {
          const hasHistory = faultsData.some(item => Array.isArray(item.history) && item.history.length > 0);

          if (hasHistory) {
              const combinedHistory = faultsData.flatMap(item => item.history || []);
              const sortedHistory = combinedHistory && combinedHistory.sort((a, b) => new Date(b.time) - new Date(a.time));
              faultsData = sortedHistory;
          } else {
              const combinedHistory = faultsData.data.mergedHistory && faultsData.data.mergedHistory.flatMap(item => item.history);
              const sortedHistory = combinedHistory && combinedHistory.sort((a, b) => new Date(b.time) - new Date(a.time));
              faultsData = sortedHistory;
          }
      } catch (error) {
          console.error("Error in processing combinedHistory", error);
      }
  } else {
      const latestFaultsMap = new Map();
      faultsData.forEach(fault => {
          if (!latestFaultsMap.has(fault.defect_name) || new Date(fault.time) > new Date(latestFaultsMap.get(fault.defect_name).time)) {
              latestFaultsMap.set(fault.defect_name, fault);
          }
      });
      faultsData = Array.from(latestFaultsMap.values()).sort((a, b) => new Date(b.time) - new Date(a.time));
  }

  let temptabledata = [];
  let tempdownloadabledata = [];

  if (faultsData && faultsData.length > 0) {
      faultsData.forEach((val, index) => {
          const userIndex = users.findIndex(v => v.user_id === val.updated_by);
          const analystName = getAnalystName(userIndex);

          if (val) {
              tempdownloadabledata.push([
                  index + 1,
                  val.entity_name,
                  val.instrument_name,
                  val.key,
                  val.defect_name.charAt(0).toUpperCase() + val.defect_name.slice(1),
                  val.severity_name.charAt(0).toUpperCase() + val.severity_name.slice(1),
                  val.action_recommended,
                  val.rule,
                  val.remarks && val.remarks.length > 0 ? "Acknowledged" :
                      <span onClick={() => handleEdit(val)} style={{ cursor: 'pointer', color: 'blue' }}>Yet to Acknowledge</span>,
                  val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
              //    analystName,
                 
                 
              ]);

              temptabledata.push([
                  index + 1,
                  val.entity_name,
                  val.instrument_name,
                  val.key,
                  <Typography style={{ textAlign: "left", fontWeight: "400", fontSize: "0.875rem", width: "70%" }}
                      value={val.defect_name.charAt(0).toUpperCase() + val.defect_name.slice(1)} />,
                  <div style={{ display: "flex", alignItems: "center" }}>
                      {historypresent &&
                          <div>
                              <Typography style={{
                                  backgroundColor: "#E0E0E0",
                                  borderRadius: "20px",
                                  padding: "4px 8px",
                                  width: "35px",
                                  height: "26px",
                                  marginRight: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "700",
                              }} color={"#161616"} value={val.history?.length || 0} />
                          </div>
                      }
                      <StatusNDL lessHeight style={{
                          color: getTagprops(Number(val.severity))[2],
                          backgroundColor: getTagprops(Number(val.severity))[1],
                          cursor: "pointer",
                          textAlign: "center"
                      }} name={getTagprops(Number(val.severity))[0]} />
                  </div>,
                  val.action_recommended,
                  val.rule,
                  val.remarks && val.remarks.length > 0 ? "Acknowledged" :
                      <span onClick={() => handleEdit(val)} style={{ cursor: 'pointer', color: 'blue' }}>Yet to Acknowledge</span>,
                  val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
                 // analystName,
                  val.defect,
                  val.severity,
                  val.updated_at ? moment(val.updated_at).format("DD/MM/YYYY HH:mm:ss") : '-',
                  val.defect_processed_at ? moment(val.defect_processed_at).format("DD/MM/YYYY HH:mm:ss") : '-',
                  
              ]);
          }
      });
  }

  setdownloadabledata(tempdownloadabledata);

  const filteredData = temptabledata.filter(x => x[5]?.props?.children?.[0]?.props?.children?.props?.value);

  if (!filteredData.length) {
      setAckType(3);
  } else {
      setAckType(-1);
  }
  
  setAckCount(temptabledata.filter(x => x[8]?.props?.children === "Yet to Acknowledge").length - 1);
  return temptabledata;
}

  const fetchhistory = (value) => {
    let linkarr = [...navigateArr]
    linkarr.push({ "index": 3, "name": value.key + " Axis " + value.defect_name, "data": value })
    setaxisdata({ "data": value, "asset": instrumentdata.asset, "instrument": instrumentdata.data })
    setnavigateArr(linkarr)
    setshowhistory(false)
    setTableData(processedrows(value.history, false))
    setfaultsdata(value.history)
    setshowaxisdata(!showaxisdata)
    setshowinstrumentdata(!showinstrumentdata)

  }


  const getfft = (values, instrument_name, asset_name) => {
    let value = values
    if(values.RecentAlarmAt){
      const { iid, Metrics } = values;

      const matchedHistory = uniqueHistories.find(history =>
          history.iid === iid &&
          history.metrics === Metrics
      );
      value = matchedHistory
    }
    setselectedinstrument(value)
    let ffttrends = []
    ffttrends.push({
      "frmDate": moment(value.time).subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
      "toDate": moment(value.time).add(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
      "interval": 15,
      "id": value.iid,
      "metric_val": "fft_x" //+ value.key.toLowerCase(),
    }, {
      "frmDate": moment(value.time).subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
      "toDate": moment(value.time).add(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
      "interval": 15,
      "id": value.iid,
      "metric_val": "fft_y" //+ value.key.toLowerCase(),
    }, {
      "frmDate": moment(value.time).subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
      "toDate": moment(value.time).add(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
      "interval": 15,
      "id": value.iid,
      "metric_val": "fft_z" //+ value.key.toLowerCase(),
    },
      {
        "frmDate": moment(value.time).subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
        "toDate": moment(value.time).add(30, 'seconds').format('YYYY-MM-DDTHH:mm:ssZ'),
        "interval": 15,
        "id": value.iid,
        "metric_val": "fft_e" //+ value.key.toLowerCase(),
      })
    ModalRef.current.handleFFTDialog(value, instrument_name ? instrument_name : instrumentname, asset_name ? asset_name : assetname, ffttrends)
  }

  const menuItemClick = (value, instrument, instrument_name, asset_name,bulkdata,ftype) => {
    if (value === 1) {
      getfft(instrument, instrument_name, asset_name)
    } 
   
    else if (value === 3) {
      getTrend(instrument, instrument_name ? instrument_name : instrumentname, asset_name ? asset_name : assetname)

    } else if (value === 4) {
    ModalRef.current.handleFaultDialog(false)
    
      createtask(instrument)
    }
  
  }



  async function fetchfaults() {
    getFaultInfo(headPlant.schema, moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ"), moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"))

  }

  useEffect(() => {
    if (!faultupdateLoading && faultupdateData && !faultupdateError) {
      if (faultupdateData.length > 0 && faultupdateData[0] > 0) {
        console.log('hi2')
        fetchfaults()
        if(faultupdateData){
          SetMessage(t('Fault Acknowledgement Updated Successfully'))
                        SetType("success")
                        setOpenSnack(true)
                        renderFaults()
                        renderAxisFaultHistory()
        }
      }
      else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faultupdateLoading, faultupdateData, faultupdateError])



  

  const handleSaveFaultAcknowlwdgement = (data, ischecked) => {
 if(ischecked){

  let modifiedData
  if(hisSelected === 'tile' ){
    modifiedData =  bulkRemarkData.filter(x=>x.remarks === null && x.severity_name === faultType).map(x=>{
      return {
        time:x.time,
        iid:x.iid,
        key:x.key,
        severity:x.severity,
        defect:x.defect,
        remarks:data
      }
    })
  }else{
    modifiedData =  faultsdata.filter(x=>x.remarks === null && x.severity_name === selectedinstrument.severity_name).map(x=>{
      return {
        time:x.time,
        iid:x.iid,
        key:x.key,
        severity:x.severity,
        defect:x.defect,
        remarks:data
      }
    })
  }
  getUpdateFaultInfo(headPlant.schema,modifiedData)  
 }else{
  getUpdateFaultInfo(headPlant.schema,[{ time:selectedinstrument.time, iid:selectedinstrument.iid, key:selectedinstrument.key, severity:selectedinstrument.severity,defect:selectedinstrument.defect, remarks:data}])  

 }
  }

  const handleEdit = (id, instrument, instrument_name, asset_name) => {
    let instrument_new
    instrument_new = tabledata[id][12]
    const combinedFaults = faultsdata.flatMap(fault => fault.history || [fault]);
    
    const filteredFaults = combinedFaults.filter(x => {
      const severityName = x?.severity || "";  
      return x.remarks === null && severityName === instrument_new;
  });  
    const severityCount = filteredFaults.length > 0 ? filteredFaults.length - 1 : '';

    setselectedinstrument(instrument);
    ModalRef.current.handleRemarks(
        instrument,
        instrument_name || instrumentname,
        asset_name || assetname,
        severityCount
    );
}

  const getTrend = (instrument, instrument_name, asset_name) => {
    setselectedinstrument(instrument)
    ModalRef.current.handleTrend(instrument, instrument_name ? instrument_name : instrumentname, asset_name ? asset_name : assetname)
  }
  const createtask = (value) => {
   const Title = 'New Task' // title is needed.Do not modify this
   const Description = `${instrumentdata.asset ? instrumentdata.asset : assetdata.entity_name}-${instrumentdata.data ? instrumentdata.data.instrument_name : value.instrument_name}-${value.key} - ${value.severity_name} - ${value.defect_name} @ ${timeFormat(value.time)}`
   let plantId = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'PlantID'
   let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : 'PlantSchema'
   let location = "/"+plantSchema+"/Tasks";
   navigate(location, { state: { title: Title, description: Description, obdate: value.time, additional: { entity_id: value.entity_id, entity_name: value.asset, analysis_type_id: 8, analysis_type_name: "Online Vibration" } } })
   setCurPage("Tasks")
   localStorage.setItem('currpage', "Tasks")
  }


  const handleColChange = (e, propss) => {

    const value = e.map(x => x.id);
    var tempcolnames = e

    // unchecked = deselected = not present


    let newCell = []
    tableheadCells.forEach(p => {
      var index = value.findIndex(v => p.id === v);
      if (index >= 0) {
        newCell.push({ ...p, display:'block' });
      } else {
        newCell.push({ ...p, display:  'none' });
      }
    });
     

    setheadCells(newCell)
    setselectedcolnames(tempcolnames);
  }

  useEffect(() => {
    setheadCells(tableheadCells)
    setselectedcolnames(tableheadCells.filter(val => !val.hide))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  //Download-excel-code
  const createdownloadablerows = (data) => {
    let keys = []
    // eslint-disable-next-line array-callback-return
    headCells.forEach(key => {
      if (key.display !== "none") keys.push(key.id);
    });
    
    var rows = [];
    if (data.length > 0) {
      rows = [].concat(
        data.map((val, index) => {
          var obj = {};
          keys.forEach((k, i) => (obj[k] = val[i]));
          return obj;
        })
      );
    }

    return rows;
  }

  const downloadExcel = (data, name) => {
    let dataWithoutSno = data.map(item => {
      const { SNo, ...rest } = item; // Destructure 'id' and the rest of the object
      return rest; // Return the object without the 'id' key
  });
  const uniqueArray = dataWithoutSno.filter((item, index, array) => {
    // Find the index of the first occurrence of the current item in the array
    const firstIndex = array.findIndex(obj =>
        obj.Asset === item.Asset &&
        obj.Sensor === item.Sensor &&
        obj.SensorAxis === item.SensorAxis &&
        obj.Fault === item.Fault &&
        obj['Fault Severity'] === item['Fault Severity'] &&
        obj['Fault_action_recommended'] === item['Fault_action_recommended'] &&
        obj.Rule === item.Rule &&
        obj.Remarks === item.Remarks &&
        obj.updated_at === item.updated_at &&
        obj.Analyst === item.Analyst

    );

    // Return true only if the current index matches the first occurrence index
    return index === firstIndex;
});
    const worksheet = XLSX.utils.json_to_sheet(uniqueArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name + ".xlsx");
  };
  
  const groupFaults = (faults) => {
    const grouped = {};
    faults.forEach(fault => {
        const key = `${fault.iid}-${fault.defect_name}`;
        if (!grouped[key]) {
            grouped[key] = {
                ...fault,
                mergedHistory: []
            };
        }
        grouped[key].mergedHistory.push(fault);
    });
    return Object.values(grouped);
    };

    const renderFaults = () => {
        if (instrumentdata.data && instrumentdata.data.faults && instrumentdata.data.faults.length > 0) {
            
            const groupedFaults = groupFaults(instrumentdata.data.faults);
            return groupedFaults.sort((a, b) => new Date(b.time) - new Date(a.time)).map(a => (
                <Grid xs={12} key={`${a.iid}-${a.defect_name}`} >
                    <ComponentCard 
                        type={2} 
                        metricData={meterReadingsV1Data ? meterReadingsV1Data.data : []} 
                        fault={a} 
                        disableTrendIcon={(value) => { setisdiableTrend(value); }} 
                        instrument={instrumentdata.data} 
                        asset={instrumentdata.asset} 
                        getChild={renderAxis} 
                        menuItemClick={menuItemClick} 
                    />
                </Grid>
            ));
        } else {
            return (
                <Grid xs={12} style={{ textAlign: "center" }}>
                    <Typography variant="heading-02-lg" value={t("No Faults")} />
                </Grid>
            );
        }
    };

  const className = showhistory ? "" : "px-16";
  const renderEnhancedTable = () => {

    return (showhistory ?

      <EnhancedTable
        headCells={headCells.filter(c => !c.hide)}
        data={tabledata}
        download={true}
        search={true}
        rawdata={faultsdata}
        enableButton={"Task"}
        enableButtonIcon={Plus}
        actionenabled={true}
        disabledbutton={[]}
        customAction={[{ icon: FFTPlot, name: 'Locate in Graph', stroke: '#0F6FFF', customhandle: (value) => getfft(value) },
        { icon: History, name: 'See the History', stroke: '#0F6FFF', customhandle: (value) => fetchhistory(value) },
        { icon: Trend, name: 'See the Trend', stroke: '#0F6FFF', customhandle: (value) => getTrend(value) }]}
        handleCreateTask={(id, value) => { createtask(value) }}
        buttontype={"tertiary"}
        enableEdit={true}
        handleEdit={(id, value) => handleEdit(id, value)}
        rowSelect={true}
         checkBoxId={"SNo"}
         tagKey={["Fault",'Severity',"Status"]}

      />


      :
      <EnhancedTable
        headCells={headCells.filter(c => !c.hide)}
        data={tabledata}
        download={true}
        search={true}
        rawdata={faultsdata}
        enableButton={"Task"}
        enableButtonIcon={Plus}
        actionenabled={true}
        disabledbutton={[]}
        customAction={[{ icon: FFTPlot, name: 'Locate in Graph', stroke: '#0F6FFF', customhandle: (value) => getfft(value) },
        { icon: Trend, name: 'See the Trend', stroke: '#0F6FFF', customhandle: (value) => getTrend(value) }]}
        handleCreateTask={(id, value) => { createtask(value) }}
        buttontype={"tertiary"}
        enableEdit={true}
        handleEdit={(id, value) => handleEdit(id, value)}
        rowSelect={true}
        checkBoxId={"SNo"}
        tagKey={["Fault",'Severity',"Status"]}




      />)
  }

  const renderAxisFaultHistory = () => {
    if (axisdata.data && axisdata.data.mergedHistory) {
      const combinedHistory = axisdata.data.mergedHistory.flatMap(item => item.history);
      const sortedHistory = combinedHistory.sort((a, b) => new Date(b.time) - new Date(a.time));
  
      return sortedHistory.map(a => (
        <Grid xs={12} key={a.someUniqueKey} className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'>
          <ComponentCard
            type={3}
            axisfault={a}
            ackCount={ackCount}
            metricData={meterReadingsV1Data ? meterReadingsV1Data.data : []}
            disableTrendIcon={(value) => { setisdiableTrend(value) }}
            instrument={axisdata.instrument}
            asset={axisdata.asset}
            menuItemClick={menuItemClick}
            bulkdata={sortedHistory}
          />
        </Grid>
      ));
    } else if (axisdata.data && axisdata.data.history) {
      const sortedHistory = axisdata.data.history.sort((a, b) => new Date(b.time) - new Date(a.time));
      return sortedHistory.map(a => (
        <Grid xs={12} key={a.someUniqueKey} className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'>
          <ComponentCard
            type={3}
            axisfault={a}
            ackCount={ackCount}
            metricData={meterReadingsV1Data ? meterReadingsV1Data.data : []}
            disableTrendIcon={(value) => { setisdiableTrend(value) }}
            instrument={axisdata.instrument}
            asset={axisdata.asset}
            menuItemClick={menuItemClick}
            bulkdata={axisdata.data.history}
          />
        </Grid>
      ));
    } else if (axisdata.data && axisdata.data) {
      const sortedHistory = axisdata.data.sort((a, b) => new Date(b.time) - new Date(a.time));
      return sortedHistory.map(a => (
        <Grid xs={12} key={a.someUniqueKey} className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'>
          <ComponentCard
            type={3}
            axisfault={a}
            ackCount={ackCount}
            metricData={meterReadingsV1Data ? meterReadingsV1Data.data : []}
            disableTrendIcon={(value) => { setisdiableTrend(value) }}
            instrument={axisdata.instrument}
            asset={axisdata.asset}
            menuItemClick={menuItemClick}
            bulkdata={axisdata.data}
          />
        </Grid>
      ));
    } else if (axisdata.instrument && axisdata.instrument.faults) {
      // Combine all histories from each fault object
      const combinedFaultHistory = axisdata.instrument.faults.flatMap(fault => fault.history || []);
      const sortedHistory = combinedFaultHistory.sort((a, b) => new Date(b.time) - new Date(a.time));
  
      return sortedHistory.map(a => (
        <Grid xs={12} key={a.someUniqueKey} className='bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark'>
          <ComponentCard
            type={3}
            axisfault={a}
            ackCount={ackCount}
            metricData={meterReadingsV1Data ? meterReadingsV1Data.data : []}
            disableTrendIcon={(value) => { setisdiableTrend(value) }}
            instrument={axisdata.instrument}
            asset={axisdata.asset}
            menuItemClick={menuItemClick}
            bulkdata={combinedFaultHistory}
          />
        </Grid>
      ));
    } else {
      return (
        <Grid xs={12} style={{ textAlign: "center" }}>
          <Typography variant="heading-02-lg" value={t("No Fault History")}></Typography>
        </Grid>
      );
    }
  };  


function OverviewHTML(arr){
  return arr.map(a => {
    return (<Grid xs={3}>
      <LineCard asset={a} getChild={renderAsset}/>
    </Grid>)
  })
}

const renderOverViewdata = () =>{
  if(modeFilterValue && modeFilterValue.length >0 && overviewdata && overviewdata.length > 0){
    return OverviewHTML(overviewdata)
  }else if (nofaultmode){
    return OverviewHTML(overviewdata.filter(x=>x.latest_fault_severity === ''))
  }else{
    return (
      <React.Fragment></React.Fragment>
    )
  }
}
  const handleFilterChange = (e) => {
    setmodeFilterValue(e)
  }

  const handleFiltersChange = (e) => {
    setSelectedFilter(e.target.value)
  }

  const handleTypeChange = (e) => {
    settypeFilterValue(e.target.value)
  }

  useEffect(()=>{
  let assertlevelcard = []
  if (assetdata.entity_instruments  && assetdata.entity_instruments.length > 0) {
    assertlevelcard = assetdata.entity_instruments.sort((a, b) => {
      const dateA = a.latest_fault_data.time ? new Date(a.latest_fault_data.time) : null;
      const dateB = b.latest_fault_data.time ? new Date(b.latest_fault_data.time) : null;

      // Check for missing or invalid dates
      if (!dateA && !dateB) {
        return 0; // Default to a neutral value if both dates are missing or invalid
      } else if (!dateA) {
        return 1; // Place objects with missing or invalid dates at the end
      } else if (!dateB) {
        return -1; // Place objects with missing or invalid dates at the end
      }

      return dateB - dateA;
    });
  }
  setassertslevelcard(assertlevelcard)
 console.log("overviewdata",overviewdata,assertlevelcard,assetdata,instrumentdata)
  },[assetdata])

  return (

    <React.Fragment>
      <FaultModal
        ref={ModalRef}
        handleSaveFaultAcknowlwdgement={handleSaveFaultAcknowlwdgement}
        ackType ={ackType}
        fault={uniqueHistories}
      />
      {(loading) && <LoadingScreenNDL />}
      <Grid container className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark" style={{ zIndex: '20', width: "100%", justifyContent: 'flex-end', alignItems: "center",height:"48px" }}>
        <Grid item lg={8} md={8} >
          <Typography  variant="heading-02-xs" style={{marginLeft:"16px"}}value={t("Predictive Maintenance")} ></Typography>

        </Grid>
        <Grid item lg={4} md={4} style={{ marginRight:"16px" }}>
          <div className="h-[32px]  " ><DateRange range={rangeParam}/></div>
        </Grid>

      </Grid>
      <HorizontalLine variant="divider1" />
      {showoverviewdata && (
      <div className=" bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
      <AccordianNDL1 title={t('Overview')} isexpanded={accordian1}  managetoggle={() => handleclick()}  >
        <div className="px-4 py-2">
        <KpiCards style={{ height: "300px",  width: "50%" }}  >
      <div className="h-[270px] max-h-[270px] overflow-y-auto scrollbar-hide">
        <FaultAnalysisChart  chartData={chartData}/>
      </div>
      </KpiCards>
        </div>
     
      </AccordianNDL1> 
      </div>
      )}
      {!showoverviewdata && (
        <div className="flex h-[48px] items-center justify-between bg-Background-bg-primary dark:bg-Background-bg-primary-dark" >
            <div className="flex items-center">
                <div className="pt-2 pb-2 pl-4 pr-4">
                    <BredCrumbsNDL breadcrump={navigateArr} onActive={handleActiveIndex} />
                </div>
            </div>
            <div className="flex items-center">
                {showassetdata && (
                    <Button
                        type={"ghost"}
                        icon={download}
                        style={{ marginRight: "20px", cursor: "pointer" }}
                        onClick={() => downloadExcel(createdownloadablerows(assetfaultsdata), "Exported Data Table")}
                    />
                )}
                {    hisSelected === 'tile' &&
                 <Select
                labelId="faultFilter"
                id="faultFilter"
                options={filterOptions}
                placeholder={"Select Grouping"}
                value={selectedFilter}
                onChange={(e) => handleFiltersChange(e)}
                keyValue="title"
                isAllSelected={true}
                keyId="id"
                width="250px"
              />
                }
              <div className="px-4 py-2 flex">
              <div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  rounded-lg">
                <button
                    className={`flex items-center justify-center p-2 transition ${
                      hisSelected === "tile" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                    } rounded-md`}
                    onClick={() => handleHisSwitch("tile")}
                >
                    <TileIcon stroke={hisSelected === "tile" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                </button>
                <button
                    className={`flex items-center justify-center p-2 transition ${
                      hisSelected === "table" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                    } rounded-md`}
                    onClick={() => handleHisSwitch("table")}
                >
                   <TableIcon stroke={hisSelected === "table" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                </button>
                </div>

            </div>
            </div>
        </div>
    )}
          
      {
        showoverviewdata &&
          (<div className="h-[48px] bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark flex justify-between items-center p-4" >
            <div className="flex gap-2 items-center">
              <Tag mono
               bordercolor={{ border: "1px solid #ce2c31" }} 
                style={{
                  color: severemode ? "#FFF" : "#ce2c31",
                  backgroundColor: severemode ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                  cursor: "pointer",
                }}
                name={
                  "Severe : " +
                  (modeFilterValue && modeFilterValue.length > 0 && overviewdata && overviewdata.length > 0 ? severitycount : 0)
                }
                stroke={severemode ? "#FFF" : "#CE2C31"}
                icon={Severe}
                onClick={(e) => filteroverview(3)}
              />
              <Tag mono
               bordercolor={{ border: "1px solid #ef5f00" }} 
                style={{
                  color: moderatemode ? "#FFF" : "#ef5f00",
                  backgroundColor: moderatemode ? "#ef5f00" : (currTheme === 'dark' ? "#111111" : "#FFF"),//NOSONAR
                  cursor: "pointer",
                }}
                name={
                  "Moderate : " +
                  (modeFilterValue && modeFilterValue.length > 0 && overviewdata && overviewdata.length > 0 ? moderatecount : 0)
                }
                stroke={moderatemode ? "#FFF" : "#EF5F00"}
                icon={Moderate}
                onClick={(e) => filteroverview(2)}
              />
              <Tag mono
               bordercolor={{ border: "1px solid #ffc53d" }} 
                style={{
                  color: mildmode ? "#fff" : "#ffc53d",
                  backgroundColor: mildmode ? "#ffc53d" : (currTheme === 'dark' ? "#111111" : "#FFF"),//NOSONAR
                  cursor: "pointer",
                }}
                name={
                  "Minor : " +
                  (modeFilterValue && modeFilterValue.length > 0 && overviewdata && overviewdata.length > 0 ? mildcount : 0)
                }
                stroke={mildmode ? "#fff" : "#FFC53D"}
                icon={Moderate}
                onClick={(e) => filteroverview(1)}
              />
              <Tag mono
               bordercolor={{ border: "1px solid #30A46c" }} 
                style={{
                  color: nofaultmode ? "#FFF" : "#30A46c",
                  backgroundColor: nofaultmode ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                  cursor: "pointer",
                }}
                name={
                  "Normal : " +
                  (modeFilterValue && modeFilterValue.length > 0 ? nofaultcount.toString() : 0)
                }
                stroke={nofaultmode ? "#FFF" : "#30A46c"}
                icon={NoFault}
                onClick={(e) =>
                  modeFilterValue.findIndex((f) => f.id === "No Faults") >= 0
                    ? filteroverview()
                    : ""
                }
              />
              <Tag  mono
               bordercolor={{ border:nodatamode ? "" : currTheme === 'dark' ? "1px solid #E0E0E0" : "1px solid #111111" }} 
                style={{
                  color: nodatamode ? "#161616" : (currTheme === 'dark' ? "#E0E0E0" : "#111111"),
                  backgroundColor: nodatamode ? "#E0E0E0" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                  cursor: "pointer",
                }}
                name={"No Data : " + nodatacount}
                stroke={nodatamode ? "#161616" : (currTheme === 'dark' ? "#E0E0E0" : "#111111")}
                icon={EyeClosed}
                onClick={(e) => filteroverview(-1)}
              />
            </div>
            <div className="flex gap-2 items-center ml-auto">
              <Button
                type="ghost"
                icon={Download}
                onClick={() =>
                  downloadExcel(createdownloadablerows(allfaults), "Exported Data Table")
                }
              />
              {typeFilterValue !== 2 &&
              <Select
                labelId="faultFilter"
                id="faultFilter"
                auto={true}
                multiple={true}
                options={modeFilterOption}
                isMArray={true}
                placeholder={"Select Fault Modes"}
                value={modeFilterValue}
                onChange={(e) => handleFilterChange(e)}
                keyValue="title"
                isAllSelected={true}
                keyId="id"
                width="350px"
                selectAll={true}
                selectAllText={`All Faults (${totalFault})`}
              />
              }
              {selected === 'table' && (
               <Select
                labelId="faultFilter"
                id="faultFilter"
                options={overviewtypeoption}
                placeholder={"Select type"}
                value={typeFilterValue}
                onChange={(e) => handleTypeChange(e)}
                keyValue="title"
                keyId="id"
                width="250px"
              />
              )}
              <div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark rounded-lg ">
                <button
                    className={`flex items-center justify-center p-2 transition ${
                    selected === "tile" ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                    } rounded-md`}
                    onClick={() => handleSwitch("tile")}
                >
                    <TileIcon stroke={selected ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                </button>
                <button
                    className={`flex items-center justify-center p-2 transition ${
                    selected === "table" ? "bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                    } rounded-md`}
                    onClick={() => handleSwitch("table")}
                >
                   <TableIcon stroke={selected ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                </button>
                </div>
            </div>
          </div>          
      
        )
      }

  

      {/* </div> */}
      

      
      {
        showoverviewdata &&
        <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark" style={{ margin: 0, padding: "16px",minHeight:"86.5vh"  }}>
        <Grid container spacing={4} >

          {(overviewdata && selected === "tile" && overviewdata.length > 0) ? overviewdata.map(a => {
            return (<Grid xs={3}>
              <LineCard asset={a} getChild={renderAsset} />
            </Grid>)
          })
          
              :
              <React.Fragment></React.Fragment>
          }

              
        </Grid>
        {selected === 'table' && typeFilterValue === 1 && (
                    <EnhancedTable
                    heading={"PDM Faults"}
                    headCells={headOverviewCells}
                    columnwisefilter={true}
                    data={tableData}
                    rawdata={overviewdata}
                    columnfilterdata={rawdataobject}
                    search={true}
                    download={true}
                    rowSelect={true}
                    checkBoxId={"SNo"}
                    verticalMenu={true}
                    groupBy={'connectivity_table'}
                    tagKey={["Severity"]}
                    enableviewmore={true}
                    actionenabled={true}
                    handleviewmore={(id, value) => handleviewmore(id, value)} 
                    />
                    )}
         {selected === 'table' && typeFilterValue === 2 && (
                    <EnhancedTable
                    heading={"PDM Faults"}
                    headCells={headhistoryCells}
                    columnwisefilter={true}
                    data={historytableData}
                    rawdata={historyrawtableData}
                    search={true}
                    download={true}
                    rowSelect={true}
                    checkBoxId={"SNo"}
                    verticalMenu={true}
                    groupBy={'connectivity_table'}
                    tagKey={["Severity"]}
                    enabletrends={buttonsEnabled}
                    actionenabled={true}
                    handletrends={(id, value) => handletrends(id, value)} 
                    enablefft={buttonsEnabled}
                    handlefft={(id, value) => handlefft(id, value)} 
                    enabletasks={buttonsEnabled}
                    handletasks={(id, value) => handletasks(id, value)} 
                    />
                    )}
        </div>
      }
      {
        showassetdata &&
        <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark" style={{ margin: 0, padding: "16px",minHeight:"86.5vh"  }}>
        {assertslevelcard &&
          assertslevelcard.length > 0 &&
          hisSelected === 'tile' &&
          (() => {
            let bulkdata = [];

            assertslevelcard.forEach((a) => {
              if (a.faults && Array.isArray(a.faults)) {
                a.faults.forEach((fault) => {
                  if (fault.history) {
                    bulkdata = bulkdata.concat(fault.history);
                  }
                });
              }
            });

            const groupBy = (data, key) => {
              return data.reduce((result, item) => {
                  let groupKey = item[key] || 'Unknown';
          
                  if (groupKey === "All") {
                      groupKey = "normal";
                  }
          
                  if (!result[groupKey]) {
                      result[groupKey] = [];
                  }
          
                  result[groupKey].push(item);
                  return result;
              }, {});
          };
          

            const getGroupKey = () => {
              switch (selectedFilter) {
                case 2:
                  return 'instrument_name'; 
                case 3:
                  return 'metrics'; 
                case 4:
                  return 'severity_name'; 
                default:
                  return null; 
              }
            };

            const groupKey = getGroupKey();
            const groupedData = groupKey
            ? groupBy(metricsCurrentData, groupKey)
            : { None: metricsCurrentData }; 
        
            return Object.keys(groupedData).map((group, groupIndex) => (
              <div key={groupIndex} style={{ marginBottom: '20px' }}>
             <AccordianNDL1
                title={`${groupKey ? (group.charAt(0).toUpperCase() + group.slice(1)) : t('All')} (${groupKey ? groupedHistableData[group]?.length || 0 : groupedHistableData["All"]?.length || 0})`}
                isexpanded={accordian2}
                managetoggle={() => handleclick1()}
              >
                  <Grid container spacing={4}className='py-2'>
                    {groupedData[group].map((fault, index) => (
                      <Grid
                        item
                        xs={12}
                        key={index}
                        
                      >
                        <ComponentCard
                          type={3}
                          axisfault={fault}
                          metricData={
                            meterReadingsV1Data ? meterReadingsV1Data.data : []
                          }
                          disableTrendIcon={(value) => {
                            setisdiableTrend(value);
                          }}
                          menuItemClick={menuItemClick}
                          bulkdata={bulkdata}
                          instrument={assertslevelcard[0]}
                          asset={assetdata}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordianNDL1>
              </div>
            ));
          })()}



        {  finaltempdata &&
              finaltempdata.length > 0 &&
              hisSelected === "table" &&
                <div style={{ marginBottom: "20px" }}>
                    <EnhancedTable
                      heading={'PDM Faults'}
                      headCells={headhisCells}
                      data={finaltempdata}
                      rawdata={finalrawtempdata}
                      columnwisefilter={true}
                      defaultvisibleColumn
                      search={true}
                      // download={true}
                      rowSelect={true}
                      checkBoxId={"SNo"}
                      verticalMenu={true}
                      groupBy={"faults_table"}
                      enabletrends={buttonsEnabled}
                      actionenabled={true}
                      handletrends={(id, value) => handletrends(id, value)} 
                      enablefft={buttonsEnabled}
                      handlefft={(id, value) => handlefft(id, value)} 
                      enabletasks={buttonsEnabled}
                      handletasks={(id, value) => handletasks(id, value)} 
                    />
                </div>
          }
            {hisSelected === 'tile' && (
                    <EnhancedTablePagination
                        onPageChange={handleMetricsPageChange}
                        onRowsPerPageChange={handleMetricsRowsPerPageChange}
                        count={finaldata.length}
                        rowsPerPage={metricsRowsPerPage}
                        PerPageOption={[5, 10, 20, 50]}
                        page={metricsCurrentPage}
                        visibledata={[]}
                        noBorderRadius
                    />
                )}
        </div>
      }
      {
        showinstrumentdata &&
        (
          hisSelected === 'tile' ?
          <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark" style={{ margin: 0, padding: "16px", minHeight:"86.5vh"  }}>
                <Grid container spacing={4} >

{renderFaults()}


</Grid>

          </div>
        
            :
            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark min-h-[86.5vh]"  style={{ padding:"16px" }}>
              <div className={`${className} float-right m-3`} >
                <Select
                  labelId="filter-column-fault-analysis"
                  id="filter-column"
                  placeholder={t("Select column")}
                  disabledName={t("FilterColumn")}
                  auto={false}
                  edit={true}
                  options={headCells.filter(c => !c.hide)}
                  keyValue={"label"}
                  keyId={"id"}
                  value={selectedcolnames}
                  multiple={true}
                  isMArray={true}
                  onChange={(e, propss) => handleColChange(e, propss)}
                  checkbox={true}
                  selectAll={true}
                  selectAllText={"Select All"}
                />

              </div>
              {renderEnhancedTable()}
            </div>
        )
      }
      {
        showaxisdata &&
        (
          hisSelected === 'tile' ?
          <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark" style={{ margin: 0, padding: "16px",minHeight:"86.5vh"  }}>
            <Grid container spacing={4} >
              {renderAxisFaultHistory()}
            </Grid>
            </div>
            
            :
            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark " style={{ margin: 0, padding: "16px",minHeight:"86.5vh"  }}>
              <div className="p-2" style={{ float: "right"}}>
                <Select
                  labelId="filter-column-fault-analysis"
                  id="filter-column"
                  placeholder={t("Select column")}
                  disabledName={t("FilterColumn")}
                  auto={false}
                  edit={true}
                  options={headCells.filter(c => !c.hide)}
                  keyValue={"label"}
                  keyId={"id"}
                  value={selectedcolnames}
                  multiple={true}
                  isMArray={true}
                  onChange={(e, propss) => handleColChange(e, propss)}
                  checkbox={true}
                  selectAll={true}
                  selectAllText={"Select All"}
                />

              </div>
               <EnhancedTable
                headCells={headCells.filter(c => !c.hide)}
                data={tabledata}
                download={true}
                search={true}
                rawdata={faultsdata}
                enableButton={"Task"}
                actionenabled={true}
                disabledbutton={[]}
                customAction={[{ icon: FFTPlot, name: 'Locate in Graph', stroke: '#0F6FFF', customhandle: (value) => getfft(value) },
                { icon: Trend, name: 'See the Trend', stroke: '#0F6FFF', customhandle: (value) => getTrend(value) }]}
                handleCreateTask={(id, value) => { createtask(value) }}
                buttontype={"tertiary"}
                enableEdit={true}
                enableButtonIcon={Plus}
                handleEdit={(id, value) => handleEdit(id, value)}
                rowSelect={true}
                checkBoxId={"SNo"}
                tagKey={["Fault",'Severity',"Status"]}


              />
            </div>
        )
      }






    </React.Fragment >

  );
}
