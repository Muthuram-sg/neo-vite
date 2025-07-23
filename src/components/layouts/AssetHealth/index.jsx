import React, { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import Typography from "components/Core/Typography/TypographyNDL";
import { selectedPlant,instrumentsArry,CalenderYear,ErrorPage } from "recoilStore/atoms";
import Grid from 'components/Core/GridNDL';
import KpiCards from 'components/Core/KPICards/KpiCardsNDL';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Select from "components/Core/DropdownList/DropdownListNDL";
import { useTranslation } from 'react-i18next';
import TaskAlarmTabs from "./Components/TaskAlarmTabs";
import CustomizedProgressBars from "components/Core/ProgressBar/Progress"; 
import Bar from 'components/Charts_new/bar'
import useGetAssetCountPlantWise from './hooks/useGetAssetCountPlantWise'
import useGetAssetPlantWise from './hooks/useGetAssetPlantWise'
import useGetEntityInstrument from './hooks/useGetEntityInstrument'
import useGetAlertsData from './hooks/useAlertsData'
import useGetZoneByLine from './hooks/useGetZoneByLine'
import useGetAssetByZone from './hooks/useGetAssetByZone'
import useGetTaskAssetWise from './hooks/useGetTaskAssetWise'
import useGetAlarmSummaryData from './hooks/useGetAlarmSummaryData'
import useGetTaskWiseAssetstatus from './hooks/usegetTaskWiseAssetStatus'
import useGetOverallTask from './hooks/useGetOverallTask'
import AssetInfo from './Components/AssetInfo'
import useGetAlertsOverviewData from '../Alarms/Overview/hooks/useGetAlertsOverviewData'
import useGetAlarmAcknowledgement from '../Alarms/Overview/hooks/useGetAlarmAcknowledgement'
import useLineConnectivity from "components/layouts/Line/hooks/useLineConnectivity";
import moment from 'moment';
import Charts from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/ChartJS/chart.jsx"
import configParam from "config";
import EnhancedTable from "components/Table/Table";
import useAllTask from './hooks/useAllTask'
import PopOut from 'assets/neo_icons/AssetHealth/PopOut.svg?react';
import {useParams} from "react-router-dom"
import DatePickerNDL from 'components/Core/DatepickerNDL';
import DefaultAsset from 'assets/neo_icons/AssetHealth/DefaultAsset.svg?react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import useGetMultipleAssetImages from "./hooks/useGetMultipleAssetImages"
import useGetTaskAsset from "./hooks/useGetTaskAsset"
import StatusNDL from 'components/Core/Status/StatusNDL'
import Button from 'components/Core/ButtonNDL';
import TagNDL from "components/Core/Tags/TagNDL";
import LoadingScreenNDL from "LoadingScreenNDL";

export default function FaultHistory() {//NOSONAR
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    let {schema,moduleName,subModule1,subModule2} = useParams()
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const carouselRef = useRef(null);
    const [selectedTechnique, setSelectedTechnique] = useState('Online Vibration');
    const [secPage,setSectionPage]=useState('')//NOSONAR
    const [tabValue, setTabValue] = useState(0);
    const [tab,setTab] = useState('')
    const [selectedAlarmSummary,setselectedAlarmSummary] = useState('Overview');
    const [selectedAlarmTime,setselectedAlarmTime] = useState('Last 7 days');
    const [selectedTaskSummary, setselectedTaskSummary] = useState('Overview');
    const [totalAssetCount, setTotalAssetCount]= useState(0);
    const [totalAsset,setTotalAsset]= useState(0);
    const [warnCount, setWarnCount] = useState(0);
    const [normalCount, setNormalCount] = useState(0);
    const [highCount, setHighCount] = useState(0);
    const [totalTask,setTotalTask] = useState(0);
    const [totalOverdueTask,setTotalOverdueTask] = useState(0);
    const [warnPer,setWarnPer] = useState(0);
    const [criPer,setCriPer] = useState(0);
    const [totalAlerts,setTotalAlerts] = useState(0);
    const [totCriAlerts,setTotCriAlerts] = useState(0);
    const [totWarnAlerts,setTotWarnAlerts] = useState(0);
    const [MeterDat,setMeterData]=useState([])
    const [meterStatus,setMeterUpdateStatus]=useState([])
    const [FormattedMeter,setFormattedMeter] =useState([]);
    const [mtrOnlineCount,setMtrOnlineCount] = useState(0);
    const [MtrofflineCount,setMtrOfflineCount] = useState(0);
    const [InstrumentMet,setInstrumentMet] = useState([]);//NOSONAR
    const [selectedCategoryType, setSelectedCategoryType] = useState([]);//NOSONAR
    const [instrumentList] = useRecoilState(instrumentsArry);
    const [totStatus,setTotStatus] = useState(0);
    const [tableData,setTableData] = useState([]);
    const [alertsTableData,setAlertsTableData] = useState([]);
    const [selectedZone, setSelectedZone] = useState(0);
    const [zones, setZones] = useState(["All Zones"]);
    const [updatedAssetData, setUpdatedAssetData] = useState([]);
    const [groupedData, setGroupedData] = useState(null);//NOSONAR
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([]);
    const [datasetalarm,setDatasetalarm] = useState([]);
    const [labelsalarm,setLabelsalarm] = useState([]);
    const [datasetTask,setDatasetTask] = useState([]);
    const [labelsTask,setLabelsTask] = useState([]);
    const [overallTaskCounts,setOverallTaskCounts]= useState(0);
    const [overallCounts,setOverallCounts]= useState(0);
    const [connecPer,setConnecPer]= useState(0);
    const [alertsPer, setAlertsPer]= useState(0);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [, setdownloadabledata] = useState([]);
    const [, settaskcount]= useState(0);
    const [, setalarmcount]= useState(0);
    const [, setdownloadablealarmdata] = useState([]);
    const [base64String, setbase64String]= useState({});
    const [page,setPage] =useState("parent")
    const [insType, setInsType] =useState(2)
    const [,setCalenderYear] = useRecoilState(CalenderYear)
    const [selectedDateStart, setSelectedDateStart] = useState(new Date());
    const [taskSummaryDate, setTaskSummaryDate] = useState({
        start: moment().subtract(6, 'months').startOf('month').toDate(),
        end: moment().endOf('month').toDate()
    });
    const {taskLoading, taskData, taskError, getTask} = useGetTaskAsset();
    const {assetCountPlantWiseLoading, assetCountPlantWiseData, assetCountPlantWiseError, getAssetCountPlantWise} = useGetAssetCountPlantWise();
    const {assetPlantWiseLoading, assetPlantWiseData, assetPlantWiseError, getAssetPlantWise} = useGetAssetPlantWise();
    const {taskWiseAssetstatusLoading, taskWiseAssetstatusData, taskWiseAssetstatusError, getTaskWiseAssetStatusCount} = useGetTaskWiseAssetstatus();
    const { AlertsOverviewLoading, AlertsOverviewData, AlertsOverviewError, getAlertsOverviewData } = useGetAlertsOverviewData();
    const { LineConnectivityLoading, LineConnectivityData, LineConnectivityError, getLineConnectivity } = useLineConnectivity() 
    const { entityInstrumentLoading, entityInstrumentData, entityInstrumentError, getEntityInstrument } = useGetEntityInstrument() 
    const { allTaskListLoading, allTaskListData, allTaskListError, getAllTaskList } = useAllTask();
    const { AlertsLoading, AlertsData, AlertsError, getAlertsData } = useGetAlertsData();
    const { AlertsSummaryLoading, AlertsSummaryData, AlertsSummaryError, getAlarmSummaryData } = useGetAlarmSummaryData();
    const { zoneByLineLoading, zoneByLineData, zoneByLineError, getZonesByLine } = useGetZoneByLine();
    const { assetByZoneLoading, assetByZoneData, assetByZoneError, getAssetsByzone } = useGetAssetByZone();
    const { taskByAssetLoading, taskByAssetData, taskByAssetError, getTaskdetailsByEntity } = useGetTaskAssetWise();
    const { taskDataLoading, taskDataData, taskDataError, getOverallTaskData } = useGetOverallTask();
    const { ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError, getViewAssetDoc } = useGetMultipleAssetImages()
    const { getAlarmAcknowledgementLoading, getAlarmAcknowledgementData, getAlarmAcknowledgementError, getAlarmAcknowledgement } = useGetAlarmAcknowledgement();//NOSONAR
    const hasAssets = updatedAssetData && updatedAssetData.some(zone => zone.asset_id.length > 0);
    const FilterByStatus = (e, type) => {
        if(e.target.value === "Online Vibration"){
            setInsType(2)
        } else if(e.target.value === "Offline Vibration"){
            setInsType(10)
        } else if(e.target.value === "Offline MCSA"){
            setInsType(11)
        } else if(e.target.value === "Offline Thermography"){
            setInsType(12)
        } else if(e.target.value === "Ultrasound Air Leak"){
            setInsType(13)
        } else if(e.target.value === "Ultrasound Bearing"){
            setInsType(15)
        } else if(e.target.value === "Ultrasound Electrical"){
            setInsType(14)
        } 
        setSelectedTechnique(e.target.value);
    };
    useEffect(() => {
      if(moduleName && moduleName.includes('=')){
        const paramsArray = moduleName.split('&'); 
        // Create an empty object to store the values
        const queryParams = {};
        // Iterate over the array and split each key-value pair
        paramsArray.forEach(param => {   
          const [key, value] = param.split('=');   
          queryParams[key] = value;
       });
        // Extracting the respective values
        const technique = queryParams['technique'] ? queryParams['technique'].toLowerCase() : queryParams['technique'];
         
        if(technique === 'onlinevibration'){
            let obj={target:{value:'Online Vibration'}}
            FilterByStatus(obj)

        }
        else if(technique === 'offlinevibration'){
            let obj={target:{value:'Offline Vibration'}}
            FilterByStatus(obj)
        }
        else if(technique === 'offlinemcsa'){
            let obj={target:{value:'Offline MCSA'}}
            FilterByStatus(obj)
        }
        else if(technique === 'offlinethermography'){
            let obj={target:{value:'Offline Thermography'}}
            FilterByStatus(obj)
        }
        else if(technique === 'ultrasoundairleak'){
            let obj={target:{value:'Ultrasound Air Leak'}}
            FilterByStatus(obj)
        }
        else if(technique === 'ultrasoundelectrical'){
            let obj={target:{value:'Ultrasound Electrical'}}
            FilterByStatus(obj)
        }else{
            setErrorPage(true)
        }
        
      }
    },[moduleName])
    function capitalizeWords(text) {
        if (!text) return ''; // Handle empty or undefined input
        return text
          .toLowerCase() // Convert entire text to lowercase
          .split(' ') // Split by spaces to handle multiple words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(' '); // Join the words back into a single string
      }
    useEffect(() => {
        if (selectedDateStart && headPlant) {
            const year = selectedDateStart.getFullYear();

            const startOfYear = new Date(year, 0, 1); 
    
            const endOfYear = new Date(year, 11, 31); 

            getTask(startOfYear, endOfYear, headPlant.id, insType );
        }
    }, [selectedDateStart, headPlant, insType]);

    useEffect(() => {
        if (!taskLoading && taskData && !taskError) {
            let normalCount = 0;
            let warningCount = 0;
            let criticalCount = 0;

            const filteredData = Object.values(
                taskData.reduce((acc, task) => {
                    const month = new Date(task.reported_date).getMonth();
                    const entityMonthKey = `${task.entity_id}-${month}`;
    
                    if (
                        !acc[entityMonthKey] ||
                        task.instrument_status_type.status_type === "Critical" ||
                        (task.instrument_status_type.status_type === "Warning" &&
                            acc[entityMonthKey].instrument_status_type.status_type === "Normal")
                    ) {
                        acc[entityMonthKey] = task;
                    }
    
                    return acc;
                }, {})
            );
    
            filteredData.forEach(task => {
                const statusType = task.instrument_status_type && task.instrument_status_type.status_type;
    
                if (statusType === "Normal") {
                    normalCount += 1;
                } else if (statusType === "Warning") {
                    warningCount += 1;
                } else if (statusType === "Critical") {
                    criticalCount += 1;
                }
            });
    
           
            const groupedData = filteredData.reduce((acc, task) => {
                const month = moment(task.reported_date).format("MMMM YYYY");
                const status = task.instrument_status_type && task.instrument_status_type.status_type;
    
                if (!acc[month]) {
                    acc[month] = { Normal: 0, Warning: 0, Critical: 0 };
                }
    
                if (status === "Normal") {
                    acc[month].Normal += 1;
                } else if (status === "Warning") {
                    acc[month].Warning += 1;
                } else if (status === "Critical") {
                    acc[month].Critical += 1;
                }
    
                return acc;
            }, {});
    
            const groupedEntries = Object.entries(groupedData).sort((a, b) => {
                const [monthA, yearA] = a[0].split(" ");
                const [monthB, yearB] = b[0].split(" ");
                const dateA = new Date(yearA, getMonthIndex(monthA));
                const dateB = new Date(yearB, getMonthIndex(monthB));
                return dateA - dateB;
            });
    
            const labels = groupedEntries.map(([key]) => key);
            const dataset = groupedEntries.map(([_, value]) => value);
    
            setLabelsTask(labels);
            setDatasetTask([
                {
                    label: "Normal",
                    backgroundColor: "#4CAF50",
                    data: dataset.map(d => d.Normal)
                },
                {
                    label: "Warning",
                    backgroundColor: "#FF6C3E",
                    data: dataset.map(d => d.Warning)
                },
                {
                    label: "Critical",
                    backgroundColor: "#DA1E28",
                    data: dataset.map(d => d.Critical)
                }
            ]);
        }
    }, [taskData]);
    
    function getMonthIndex(monthName) {
        return new Date(`${monthName} 1`).getMonth();
    }    

    const openWindow = () => {
        const dashboardData = [
            {
                "id": "a01c23c0-2fbb-4a32-b42a-a84b01b302cb",
                "custome_dashboard": false,
                "user_access_list": null,
                "standard": true,
                "dashboard": {
                    "cols": 0,
                    "data": {},
                    "breakpoint": "lg"
                },
                "line_id": null,
                "name": "Connectivity Dashboard",
                "updated_ts": "2023-12-06T20:49:28.303825+05:30",
                "userByUpdatedBy": {
                    "id": "22ccfe4b-d861-4e1d-9e85-b30948db5ad5",
                    "name": "BHARANIDHARAN L",
                    "updated_ts": "2024-09-23T10:01:28.04236+05:30"
                },
                "userByCreatedBy": {
                    "id": "22ccfe4b-d861-4e1d-9e85-b30948db5ad5",
                    "name": "BHARANIDHARAN L"
                },
                "updated_by": "BHARANIDHARAN L"
            }
        ];
    
        localStorage.setItem('selectedDashboard', JSON.stringify(dashboardData));
    
        window.open(configParam.APP_URL + '/'+schema+'/dashboard')
    }    

    const openAlarmWindow = () => {
        window.open(configParam.APP_URL + '/'+schema+ '/Alarms')
    }    

    const openTaskFormWindow = (taskId) => {
        localStorage.setItem("openTaskFromAH", JSON.stringify({ id: taskId }));
    
        window.open(configParam.APP_URL + '/'+schema+'/Tasks/editform');
    };    

    const openTaskWindow = () => {
        window.open(configParam.APP_URL + '/'+schema+'/Tasks' )
    }    

    useEffect(() => {
        let startDate = moment(taskSummaryDate.start).startOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
        let endDate = moment(taskSummaryDate.end).endOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
    
        if (taskSummaryDate.start && taskSummaryDate.end) {
            const startMonth = moment(taskSummaryDate.start).month();
            const endMonth = moment(taskSummaryDate.end).month();
    
            if (endMonth > startMonth) {
                endDate = moment(taskSummaryDate.end).endOf('month').endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
            }
        }
    if(startDate && endDate !== "Invalid date"){
        getOverallTaskData(insType ,headPlant.id, startDate, endDate);
      
    }
    }, [taskSummaryDate, headPlant, totalAsset ]);     

    useEffect( () => {
        if (!ViewAssetDocLoading && ViewAssetDocData && !ViewAssetDocError) {
            if (ViewAssetDocData.Data && ViewAssetDocData.Data.length > 0) {
                const base64DataMap = {};
              const getAPI =async()=>{
                await configParam.RUN_FILE_API(localStorage.getItem('neoToken'),headPlant.id).then((res) => {
                    ViewAssetDocData.Data.forEach((asset) => {
                        if (Array.isArray(asset.files) && asset.files.length > 0) {
                            asset.files.forEach((file) => {
                                if (file.name) {
                                    base64DataMap[asset.assetId] =configParam.API_URL + "/settings/getAssertImageUrl?filename=/" + file.name + "&x-access-token=" + res;
                                }
                            });
                        }
                    });
    
    
                    setbase64String(base64DataMap)
                }).catch(error => {
                  console.error("Error:", error);
                });
               }
               getAPI()
             
            }else{
            setbase64String({});

            } 
        }
    }, [ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError]);       

  

    

    useEffect(() => {
        let queryData = {
            schema: headPlant.schema,
            line_id: headPlant.id,
            alert_type: "alert",
            instrument_types: [3]
        };
    
        let fromDate, toDate;
        
        const now = moment(); 

        switch (selectedAlarmTime) {
            case "Last 7 days":
                fromDate = now.clone().subtract(6, 'days'); 
                break;
            case "Last 30 days":
                fromDate = now.clone().subtract(29, 'days'); 
                break;
            case "Last 3 months":
                fromDate = now.clone().subtract(3, 'months'); 
                break;
            case "Last 6 months":
                fromDate = now.clone().subtract(6, 'months'); 
                break;
            default:
                fromDate = now.clone().startOf('day'); 
        }
        
        queryData.from = fromDate.format('YYYY-MM-DDTHH:mm:ssZ');
        queryData.to = now.format('YYYY-MM-DDTHH:mm:ssZ');
        getAlarmSummaryData(queryData);
    }, [headPlant, selectedAlarmTime]); 
          // eslint-disable-next-line array-callback-return


    useEffect(() => {//NOSONAR
        if (!AlertsSummaryLoading && AlertsSummaryData && !AlertsSummaryError) {
            const finalAlertsData = AlertsSummaryData.finalAlertsData;
    
    
            let groupedData = {};
    
            const groupBy = (array, keyFunction) => {
                return array && array.reduce((result, item) => {
                    const key = keyFunction(item);
                    if (!result[key]) {
                        result[key] = [];
                    }
                    result[key].push(item);
                    return result;
                }, {});
            };
    
            if (selectedAlarmTime === "Last 7 days") {
                groupedData = groupBy(finalAlertsData, alert => moment(alert.time).startOf('day').format('DD MMM YYYY'));
            } else if (selectedAlarmTime === "Last 30 days") {
                const sortedAlerts = [...finalAlertsData].sort((a, b) => moment(a.time) - moment(b.time));
                groupedData = groupBy(sortedAlerts, alert => {
                    const startOfWeek = moment(alert.time).startOf('week');
                    const endOfWeek = moment(alert.time).endOf('week');
            
                    const startDate = startOfWeek.format('DD MMM YYYY');
                    const endDate = endOfWeek.format('DD MMM YYYY');
            
                    return `${startDate} - ${endDate}`;
                });
            }   else if (selectedAlarmTime === "Last 6 months" || selectedAlarmTime === "Last 3 months") {
                groupedData = groupBy(finalAlertsData, alert => moment(alert.time).startOf('month').format('MMM YYYY'));
            }            
    
            const alertCounts = groupedData && Object.keys(groupedData).sort().reduce((acc, key) => {
                acc[key] = groupedData[key].reduce((subAcc, alert) => {
                    if (alert.alert_level === "critical") {
                        subAcc.critical += 1;
                    } else if (alert.alert_level === "warning") {
                        subAcc.warning += 1;
                    }
    
                    if (alert.alert_level !== "ok") { 
                        if (alert.acknowledge_by !== null) {
                            subAcc.acknowledged += 1;
                        } else {
                            subAcc.yetToAcknowledge += 1;
                        }
                    }
    
                    return subAcc;
                }, { critical: 0, warning: 0, acknowledged: 0, yetToAcknowledge: 0 });
                return acc;
            }, {});
    
            const overallCounts = finalAlertsData && finalAlertsData.reduce((acc, alert) => {
                if (alert.alert_level === "critical") {
                    acc.critical += 1;
                } else if (alert.alert_level === "warning") {
                    acc.warning += 1;
                }
    
                if (alert.alert_level !== "ok") { 
                    if (alert.acknowledge_by !== null) {
                        acc.acknowledged += 1;
                    } else {
                        acc.yetToAcknowledge += 1;
                    }
                }
    
                return acc;
            }, { critical: 0, warning: 0, acknowledged: 0, yetToAcknowledge: 0 });
    
            const labels = alertCounts && Object.keys(alertCounts);
            const dataset = alertCounts && Object.values(alertCounts);

            if (selectedAlarmSummary === "Overview") {
                setLabelsalarm(labels);
                setDatasetalarm([
                    {
                        label: "Critical",
                        backgroundColor: "#DA1E28",
                        data: dataset && dataset.map(d => d.critical)
                    },
                    {
                        label: "Warning",
                        backgroundColor: "#FF6C3E",
                        data: dataset && dataset.map(d => d.warning)
                    }
                ]);
            } else if (selectedAlarmSummary === "Acknowledgment") {
                setLabelsalarm(labels);
                setDatasetalarm([
                    {
                        label: "Acknowledged",
                        backgroundColor: "#3DA3F5",
                        data: dataset && dataset.map(d => d.acknowledged)
                    },
                    {
                        label: "Yet to Acknowledge",
                        backgroundColor: "#8D8D8D",
                        data: dataset && dataset.map(d => d.yetToAcknowledge)
                    }
                ]);
            }
    
            if(overallCounts){
            setOverallCounts({
                critical: overallCounts.critical,
                warning: overallCounts.warning,
                acknowledged: overallCounts.acknowledged,
                yetToAcknowledge: overallCounts.yetToAcknowledge,
            });
        }
        }
    }, [AlertsSummaryLoading, AlertsSummaryData, AlertsSummaryError, selectedAlarmSummary, selectedAlarmTime]);
    
  

    const FilterByStatusAlarm = (e, type) => {
        setselectedAlarmSummary(e.target.value);
    };
    
    const FilterByStatusTask = (e, type) => {
        setselectedTaskSummary(e.target.value);
    };

    const FilterByStatusAlarmTime = (e, type) => {
        setselectedAlarmTime(e.target.value);
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
      };

      const getLast24HoursRange = () => {
        const now = moment(); 
        const startOfRange = moment().subtract(24, 'hours'); 
    
        const TZone = '+05:30'; 
    
        return {
            from: startOfRange.format(`YYYY-MM-DDTHH:mm:ss${TZone}`),
            to: now.format(`YYYY-MM-DDTHH:mm:ss${TZone}`)
        };
    };

      const getLastWeekRange = () => {
        const now = moment(); 
        const startOfRange = moment(now).subtract(6, 'days'); 
    
        const TZone = '+05:30'; 
    
        return {
            from: startOfRange.format(`YYYY-MM-DDTHH:mm:ss${TZone}`), 
            to: now.format(`YYYY-MM-DDTHH:mm:ss${TZone}`)
        };
    };  
      
      const getfetchAlertsOverviewData = () => {
          const defaultDates = getLast24HoursRange();
      
          let queryData = {
              schema: headPlant.schema,
              from: defaultDates.from,
              to: defaultDates.to,
              line_id: headPlant.id,
              alert_type: "alert",
              instrument_types: [3]
          };
      
          getAlertsOverviewData(queryData);
      };   

      const getAlertsWeeklyData = () => {
        const defaultDates = getLastWeekRange();
      
        let queryData = {
            schema: headPlant.schema,
            from: defaultDates.from,
            to: defaultDates.to,
            line_id: headPlant.id,
            alert_type: "alert",
            instrument_types: [3]
        };
        getAlertsData(queryData);
    }
      
    const getMeterCount = (data) =>{

        let onLineData  = 0;
        let offlineLineData = 0 ;
        let meters = [];
        if(data.length >0){
            data.map((val, index) => {
           const result =  processMeterData(val,meterStatus,meters,onLineData,offlineLineData)
           onLineData = result.onLineData;
           offlineLineData = result.offlineLineData;
            })
        } 
      
        setFormattedMeter(meters.filter(x=>"LastActive" && "status" in x && x.is_offline === false))
      }

      useEffect(()=>{
        setMtrOfflineCount(FormattedMeter.filter(x => x.status === "Inactive").length);
        setMtrOnlineCount(FormattedMeter.filter(x => x.status === "Active").length);
        setTotStatus(FormattedMeter.filter(x => x.status === "Inactive").length + FormattedMeter.filter(x => x.status === "Active").length)
        const total = FormattedMeter.filter(x => x.status === "Inactive").length + FormattedMeter.filter(x => x.status === "Active").length;
        setConnecPer(Math.floor((FormattedMeter.filter(x => x.status === "Active").length / total) * 100));
      },[FormattedMeter])


      const processMeterData = (val,meterStat,meters,onLineData,offlineLineData) => {
        let obj1 = { ...val };
        let freq = InstrumentMet.filter(x => x.instruments_id === val.id).map(x => x.frequency);
        if (meterStat && meterStat[val['id']]) {
            let min = freq.length > 0 ? (configParam.MODE(freq) * 3) : 0;
            let LA = new Date(meterStat[val['id']]);
            let CT = new Date();
            let diff = CT - LA;
            let Status = diff < (Math.max(min, 3600) * 1000);
    
            if(obj1['category'] === 3){
            if (!Status) {
                obj1['status'] = "Inactive";
                offlineLineData += 1;
            } else {
                obj1['status'] = "Active";
                onLineData += 1;
            }
            obj1["LastActive"] = moment(meterStat[val['id']]).format('DD/MM/YYYY HH:mm:ss a');
        }
    }
    
        meters.push(obj1);
        return { onLineData, offlineLineData };
    };   

    const handleDivClick = (zone, asset) => {
        console.log(zone,asset,"zone and asset")
        setSelectedAsset({ zone, asset });
        setPage("child") 
    };


    const getTaskListWithLastSixMonths = (headPlant, insType) => {
        const startDate = insType === 2 
            ? moment().subtract(6, 'months').toISOString()  
            : moment().subtract(2, 'years').toISOString();  
        
        const now = moment().toISOString(); 
        
        getAllTaskList(headPlant, startDate, now, insType);
    };     

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -100, behavior: 'smooth' });
        }
    };
    
    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 100, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!AlertsLoading && AlertsData && !AlertsError) {
            setAlertsTableData(AlertsData.finalAlertsData);
            processAlertsListData();
        }
    }, [AlertsLoading, AlertsData, AlertsError]);    

      useEffect(() => {
        getAssetCountPlantWise(headPlant.id, insType);
        getAssetPlantWise(headPlant.id, insType);
        getfetchAlertsOverviewData()
        getAlertsWeeklyData()
        getLineConnectivity({schema: headPlant.schema,lineId :headPlant.id })
        getTaskListWithLastSixMonths(headPlant.id, insType);
        const body = {
            type: "alert"
        }
        getAlarmAcknowledgement(body)
        getZonesByLine(headPlant.id)
    }, [headPlant,insType]);

    

    
    useEffect(() => {
        if (!assetCountPlantWiseLoading && assetCountPlantWiseData && !assetCountPlantWiseError) {
            setTotalAssetCount(assetCountPlantWiseData ? assetCountPlantWiseData : 0);
        }
    }, [assetCountPlantWiseLoading, assetCountPlantWiseData, assetCountPlantWiseError]);
    
    useEffect(() => {
        if (!assetPlantWiseLoading && assetPlantWiseData && !assetPlantWiseError) {
            const assetIds = assetPlantWiseData.map(asset => asset.id);
            setTotalAsset(assetIds);
        }
    }, [assetPlantWiseLoading, assetPlantWiseData, assetPlantWiseError]);
    
    useEffect(() => {
        if(totalAsset.length > 0){
        getTaskWiseAssetStatusCount(totalAsset, insType);
        getEntityInstrument(totalAsset, insType)
        getViewAssetDoc({line_id:headPlant.id, type:insType})
        }
    }, [totalAsset, insType, headPlant]); 
 

    useEffect(() => {
        if (!taskWiseAssetstatusLoading && taskWiseAssetstatusData && !taskWiseAssetstatusError) {
            const latestTaskForEntity = {};
            const priorityLabels = {
                1: "Normal",
                2: "Warning",
                3: "Critical"
            };
    
            let warnCount = 0;
            let normalCount = 0;
            let highCount = 0;
    
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            taskWiseAssetstatusData.forEach(task => {
                const { entity_id, id, instrument_status_type_id, reported_date } = task;
                const reportedDateObj = new Date(reported_date);
                if (reportedDateObj >= sixMonthsAgo && (!latestTaskForEntity[entity_id] || reportedDateObj > new Date(latestTaskForEntity[entity_id].reported_date))) {
                    latestTaskForEntity[entity_id] = {
                        id,
                        instrument_status_type_id,
                        reported_date
                    };
                }
            });
            Object.values(latestTaskForEntity).forEach(task => {
                const priorityLabel = priorityLabels[task.instrument_status_type_id];
                if (priorityLabel === "Warning") {
                    warnCount++;
                } else if (priorityLabel === "Normal") {
                    normalCount++;
                } else if (priorityLabel === "Critical") {
                    highCount++;
                }
            });
            setWarnCount(warnCount);
            setNormalCount(normalCount);
            setHighCount(highCount);
        }
    }, [taskWiseAssetstatusLoading, taskWiseAssetstatusData, taskWiseAssetstatusError]);           

    useEffect(() => {
        if (!taskWiseAssetstatusLoading && taskWiseAssetstatusData && !taskWiseAssetstatusError) {
    
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
           
    
            const filteredData = taskWiseAssetstatusData.filter(task => {
                const reportedDate = new Date(task.reported_date);
                return task.status !== 21 && task.priority !== 17 && reportedDate >= sixMonthsAgo;
                
            });            

            setTotalTask(filteredData);
    
            const currentDate = new Date();
            const overdueTasks = filteredData.filter(task => {
                const reportedDate = new Date(task.reported_date);
                const diffInDays = (currentDate - reportedDate) / (1000 * 60 * 60 * 24);
    
                return diffInDays > 15;
            });
    
            setTotalOverdueTask(overdueTasks);
    
            const priorityWarnTasks = filteredData.filter(task => task.instrument_status_type_id === 2);
            const priorityCritTasks = filteredData.filter(task => task.instrument_status_type_id === 3);
    
            setWarnPer(priorityWarnTasks);
            setCriPer(priorityCritTasks);
        }
    }, [taskWiseAssetstatusLoading, taskWiseAssetstatusData, taskWiseAssetstatusError]);
     

    useEffect(() => {
        if (!AlertsOverviewLoading && AlertsOverviewData && !AlertsOverviewError) {
            setTotalAlerts(AlertsOverviewData.totalDataAlert);
            setTotCriAlerts(AlertsOverviewData.totalCriticalAlerts);
    
            const totwarnalerts = AlertsOverviewData.totalDataAlert - AlertsOverviewData.totalCriticalAlerts;
            setTotWarnAlerts(totwarnalerts);

            setAlertsPer(AlertsOverviewData.totalDataAlert > 0 ? Math.floor((totwarnalerts / AlertsOverviewData.totalDataAlert) * 100) : 0);
        }
    }, [AlertsOverviewLoading, AlertsOverviewData, AlertsOverviewError]);    

    useEffect(()=>{
        if(!LineConnectivityLoading && LineConnectivityData && !LineConnectivityError){
            setMeterData(LineConnectivityData.data && LineConnectivityData.data.meter_data?LineConnectivityData.data.meter_data:[]);
            setMeterUpdateStatus(LineConnectivityData.data && LineConnectivityData.data.meterTime && LineConnectivityData.data.meterTime?LineConnectivityData.data.meterTime:[]);
        }
    },[LineConnectivityLoading, LineConnectivityData, LineConnectivityError])

    useEffect(()=>{
        getMeterCount(MeterDat);
      },[MeterDat, selectedCategoryType]);

      useEffect(() => {
        if (!entityInstrumentLoading && entityInstrumentData && !entityInstrumentError) {
    
            const instrumentIdsArray = entityInstrumentData.map(item => item.instrument_id);
    
           
        }
    }, [entityInstrumentLoading, entityInstrumentData, entityInstrumentError, instrumentList]);

    useEffect(() => {
        if (!zoneByLineLoading && zoneByLineData && !zoneByLineError) {
            const zoneNames = zoneByLineData.map(item => item.name);
            setZones(["All Zones", ...zoneNames]); 
            const idArray = zoneByLineData.map(item => item.id);
            getAssetsByzone(idArray); 
        }
    }, [zoneByLineLoading, zoneByLineData, zoneByLineError]);    

    useEffect(() => {
        if (!taskByAssetLoading && taskByAssetData && !taskByAssetError) {
            const sortedTaskByAssetData = taskByAssetData.sort((a, b) => new Date(a.reported_date) - new Date(b.reported_date));
    
            const latestRecords = sortedTaskByAssetData.reduce((acc, current) => {
                const { entity_id, reported_date } = current;
                const faultModeName = current.faultModeByFaultMode?.name || '';
    
                if (!acc[entity_id]) {
                    acc[entity_id] = {
                        latestRecord: current,
                        faultModes: [faultModeName],
                    };
                } else {
                    if (new Date(reported_date) > new Date(acc[entity_id].latestRecord.reported_date)) {
                        acc[entity_id].latestRecord = current;
                    }
    
                    const newFaultModes = [...new Set([...acc[entity_id].faultModes, faultModeName])].slice(-3);
                    acc[entity_id].faultModes = newFaultModes;
                }
    
                return acc;
            }, {});
            const updatedData = zoneByLineData.map(zone => {
                const matchingZone = assetByZoneData.find(assetZone => assetZone.entity_id === zone.id);
                if (matchingZone) {
                    return {
                        ...matchingZone,
                        asset_id: matchingZone.asset_id.map(asset => {
                            const matchingRecord = latestRecords[asset.id];
    
                            if (matchingRecord) {
                                return {
                                    ...asset,
                                    reported_date: matchingRecord.latestRecord.reported_date,
                                    status_type: matchingRecord.latestRecord.instrument_status_type.status_type,
                                    fault_modes: matchingRecord.faultModes,
                                };
                            }
    
                            return asset;
                        }),
                    };
                } else {
                    return {
                        entity_id: zone.id,
                        asset_id: [], 
                    };
                }
            });
    
            if (updatedData) {
                const filteredAssetData = updatedData.map(zone => {
                    const filteredAssets = zone.asset_id.filter(asset => totalAsset && totalAsset.includes(asset.id));
                    
                    return {
                        ...zone,
                        asset_id: filteredAssets 
                    };
                });
                setUpdatedAssetData(filteredAssetData);
                console.log(filteredAssetData,"filtered asset")
                if(moduleName && subModule1 && subModule1.includes('=') && subModule2){
                    
                    const paramsArray = subModule1.split('&'); 
                    // Create an empty object to store the values
                    const queryParams = {};
                    // Iterate over the array and split each key-value pair
                    paramsArray.forEach(param => {   
                      const [key, value] = param.split('=');   
                      queryParams[key] = value;
                   });
                    // Extracting the respective values
                    const asset = queryParams['asset'];
                   
                    if(asset){
                            // Find the zones object containing the asset_id with the assetID
                            const zones = filteredAssetData.find(zone => 
                                zone.asset_id.some(a => a.id === asset)
                            );
                            if (zones && Object.keys(zones).length > 0) {
                            
                            // Find the specific asset within the found zones object
                            const assets = zones ? zones.asset_id.find(a => a.id === asset) : null;
                         
                           handleDivClick(zones,assets)
                           if(subModule2 === 'status'){
                            setTab('status')
                            }
                            else if(subModule2 === 'maintenancelog'){
                                setTab('maintenancelog')
                            }
                            else{
                                setErrorPage(true)
                            }
                           
                           
                            }
                            else{
                            
                                    setErrorPage(true)
                                
                            }
              

                    }else{
                        setErrorPage(true)
                    }
            }
        }
    }
    }, [taskByAssetLoading, taskByAssetData, taskByAssetError, zoneByLineData,totalAsset,moduleName,subModule1,subModule2,tab]);     
console.log(tab,"tab")
    useEffect(() => {
        if (!assetByZoneLoading && assetByZoneData && !assetByZoneError) {
            const assetIds = assetByZoneData.flatMap(zone =>
                zone.asset_id.map(asset => asset.id)
            );
    
            const startDate = moment().subtract(6, 'months').format();
            const endDate = moment().format(); 
            getTaskdetailsByEntity(assetIds, startDate, endDate);
        }
    }, [assetByZoneLoading, assetByZoneData, assetByZoneError]);    

    const processTaskListData = () => {
        let temptabledata = [];
        let tempdownloadtabledata = [];
        let totalTaskIds;

        if (insType === 2) {
            totalTaskIds = Array.isArray(totalTask) ? totalTask.map(task => task.id) : [];
        } else {
            totalTaskIds = Array.isArray(allTaskListData) ? allTaskListData.map(task => task.id) : [];
        }
        
        if (allTaskListData.length > 0) {
    
            temptabledata = allTaskListData.filter(val => {
                return (
                    totalTaskIds.includes(val.id) &&
                    val?.taskStatus?.id !== 3 &&
                    val?.taskStatus?.id !== 21 &&
                    (val?.taskPriority?.id === 11 || val?.taskPriority?.id === 12 || val?.taskPriority?.id === 14)
                );
            })
            .map((val, index) => {
                const reportedDate = new Date(val.reported_date);
                const formattedReportedDate = `${reportedDate.getDate().toString().padStart(2, '0')}-${(reportedDate.getMonth() + 1).toString().padStart(2, '0')}-${reportedDate.getFullYear()}`;
    
                const today = new Date();
                const timeDifference = today - reportedDate;
                const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const reportedDateRelative = daysAgo === 0 ? "Today" : `${Math.abs(daysAgo)} days`;

 
                return [
                    index + 1,
                    val.task_id,
                    val.entityId.name,
                    val.instrument.name,
                          // eslint-disable-next-line array-callback-return

                    <StatusNDL 
                        style={{ 
                            color: "#FFFFFF", 
                            
                            textAlign: "center" 
                        }} 
                        colorbg={val.taskPriority?.task_level === "High" ? "error-alt" :
                        val.taskPriority?.task_level === "Medium" ? "warning02-alt" :
                        val.taskPriority?.task_level === "Low" ? "success-alt" : ""}
                        name={val.taskPriority?.task_level} 
                    />,
                    val.faultModeByFaultMode.name,
                    val.taskStatus.status,
                    formattedReportedDate,
                    reportedDateRelative,
                    <button 
                        onClick={() => handleViewDetails(val.id)} 
                        style={{ color: "#0090FF", border: "none", background: "none", padding: "0", cursor: "pointer"}}
                    >
                        View Details
                    </button>,
                      val.id
                ];
            });
    
            tempdownloadtabledata = allTaskListData.filter(val => {
                return (
                    totalTaskIds.includes(val.id) &&
                    val.taskStatus.id !== 3 &&
                    val.taskStatus.id !== 21 &&
                    (val.taskPriority.id === 11 || val.taskPriority.id === 12 || val.taskPriority.id === 14)
                );
            })
            .map((val, index) => {
                const reportedDate = new Date(val.reported_date);
                const formattedReportedDate = `${reportedDate.getDate().toString().padStart(2, '0')}-${(reportedDate.getMonth() + 1).toString().padStart(2, '0')}-${reportedDate.getFullYear()}`;
    
                const today = new Date();
                const timeDifference = today - reportedDate;
                const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const reportedDateRelative = daysAgo === 0 ? "Today" : `${Math.abs(daysAgo)} days`;
    
                return [
                    index + 1,
                    val.task_id,
                    val.entityId.name,
                    val.instrument.name,
                    val.taskPriority.task_level,
                    val.faultModeByFaultMode.name,
                    val.taskStatus.status,
                    formattedReportedDate,
                    reportedDateRelative,

                  
                ];
            });
        }
        setdownloadabledata(tempdownloadtabledata);
        settaskcount(temptabledata.length);
        setTableData(temptabledata);
    };

    const handleViewDetails = (taskId) => {
        openTaskFormWindow(taskId)
    };    

    const processAlertsListData = () => {
        let temptabledata = [];
        let tempdownloadtabledata = [];
    
        if (AlertsData && AlertsData.finalAlertsData && AlertsData.finalAlertsData.length > 0 && getAlarmAcknowledgementData) {
    
            temptabledata = AlertsData.finalAlertsData
                .filter(val => val.alert_level !== "ok")
                .map((val, index) => {
                    let acknowledgementName = "Yet to Acknowledge";
    
                    getAlarmAcknowledgementData.forEach(ack => {
                        if (ack.id === val.acknowledge_id) {
                            acknowledgementName = ack.name;
                        }
                    });
                    return [
                        index + 1,
                        val.instrument_name,
                        Number(parseFloat(val.value).toFixed(2)),
                        moment(val.value_time).format('DD/MM/YYYY hh:mm:ss A'),
                        val.alert_level === "warning" ? val.warn_value : val.critical_value,
                        val.alert_type,
                        <StatusNDL 
                            style={{ 
                                color: "#FFFFFF", 
                            
                                textAlign: "center" 
                            }} 
                            colorbg={
                                val.alert_level === "critical" ? "error-alt" : 
                                val.alert_level === "warning" ?"warning01-alt" : 
                                val.alert_level === "normal" ? "success-alt" : "" }
                            name={val.alert_level} 
                        />,
                        acknowledgementName,
                        <button 
                            style={{ color: "#0090FF", border: "none", background: "none", cursor: "pointer" }} 
                            onClick={() => openAlertDetails(val.iid)}
                        >
                            View Details
                        </button>,
                        val.alert_id
                    ];
                });
    
            tempdownloadtabledata = AlertsData.finalAlertsData
                .filter(val => val.alert_level !== "ok")
                .map((val, index) => {
    
                    let acknowledgementName = "Yet to Acknowledge";
    
                    getAlarmAcknowledgementData.forEach(ack => {
                        if (ack.id === val.acknowledge_id) {
                            acknowledgementName = ack.name;
                        }
                    });
    
                    return [
                        index + 1,
                        val.instrument_name,
                        Number(parseFloat(val.value).toFixed(2)),
                        moment(val.value_time).format('DD/MM/YYYY hh:mm:ss A'),
                        val.alert_level === "warning" ? val.warn_value : val.critical_value,
                        val.alert_type,
                        val.alert_level,
                        acknowledgementName,
                        "View Details" ,
                       
                    ];
                });
        }
        
        setdownloadablealarmdata(tempdownloadtabledata);
        setalarmcount(temptabledata.length);
        setAlertsTableData(temptabledata);
    };
    

    const openAlertDetails = (alertId) => {
        localStorage.setItem("openAlertFromAH", JSON.stringify({ id: alertId }));
        window.open(configParam.APP_URL + '/'+schema+'/Alarms')
    };
       
       
    useEffect(() => {
        if (!allTaskListLoading && allTaskListData && !allTaskListError) {
            setTableData(allTaskListData)
            processTaskListData();
        }
    }, [allTaskListLoading, allTaskListData, allTaskListError, totalTask]);   
    
    useEffect(() => {
        if (!taskDataLoading && taskDataData && !taskDataError) {
            const countedData = countTaskStatuses(taskDataData);
            setGroupedData(countedData);
            updateChartData(countedData);
        }
    }, [taskDataLoading, taskDataData, taskDataError,selectedTaskSummary]);
    
    const countTaskStatuses = (tasks) => {
        return tasks.reduce((acc, task) => {
            const statusId = task.taskStatus.id;
            const reportedDate = moment(task.reported_date);
            const monthKey = reportedDate.format('YYYY-MM');
    
            if (!acc[monthKey]) {
                acc[monthKey] = { 
                    statusCompleteCount: 0, 
                    statusOpenCount: 0,
                    warningCount: 0, 
                    criticalCount: 0 
                };
            }
    
            if (statusId === 3) {
                acc[monthKey].statusCompleteCount += 1;
            } else if ([1, 5, 16].includes(statusId)) {
                acc[monthKey].statusOpenCount += 1;
            }
    
            const instrumentStatusId = task && task.instrument_status_type && task.instrument_status_type.id;
            if (instrumentStatusId === 2) { 
                acc[monthKey].warningCount += 1;
            } else if (instrumentStatusId === 3) { 
                acc[monthKey].criticalCount += 1;
            }
    
            return acc;
        }, {});
    };

    const updateChartData = (data) => {
        const months = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
    
        const overallCounts = {
            closed: 0,
            open: 0,
            warning: 0,
            critical: 0,
        };
    
        months.forEach(month => {
            overallCounts.closed += parseInt(data[month].statusCompleteCount || 0, 10);
            overallCounts.open += parseInt(data[month].statusOpenCount || 0, 10);
            overallCounts.warning += parseInt(data[month].warningCount || 0, 10);
            overallCounts.critical += parseInt(data[month].criticalCount || 0, 10);
        });
    
        setLabels(months.map(month => moment(month).format('MMM YY')));
    
        if (selectedTaskSummary === "Overview") {
            setDatasets([
                {
                    label: "Closed",
                    backgroundColor: "#88B056",
                    data: months.map(month => data[month].statusCompleteCount),
                },
                {
                    label: "Open",
                    backgroundColor: "#2E81FF",
                    data: months.map(month => data[month].statusOpenCount),
                },
            ]);
        } else if (selectedTaskSummary === "Status") {
            setDatasets([
                {
                    label: "Warning",
                    backgroundColor: "#FF6C3E",
                    data: months.map(month => data[month].warningCount),
                },
                {
                    label: "Critical",
                    backgroundColor: "#DA1E28",
                    data: months.map(month => data[month].criticalCount),
                },
            ]);
        }
        setOverallTaskCounts(overallCounts);
    };
     

    const handleActiveIndex = (index) => {
        if(index === "child"){
            setPage('parent')
        }
        
      };

      useEffect(() => {
        if (headPlant) {
            handleActiveIndex("child")
        }
      }, [headPlant]);

      const AddOption = [
        { id: "Online Vibration", name: t("Online Vibration"), disabled: false },
        { id: "Offline Vibration", name: t("Offline Vibration"), disabled: false },
        { id: "Offline MCSA", name: t("Offline MCSA"), disabled: false },
        { id: "Offline Thermography", name: t("Offline Thermography"), disabled: false },
        { id: "Ultrasound Air Leak", name: t("Ultrasound Air Leak"), disabled: false },
        { id: "Ultrasound Bearing", name: t("Ultrasound Bearing"), disabled: false },
        { id: "Ultrasound Electrical", name: t("Ultrasound Electrical"), disabled: false }
    ];    

    const AlarmTime = [
        { id: "Last 7 days", name: t("Last 7 days") },
        { id: "Last 30 days", name: t("Last 30 days") },
        { id: "Last 3 months", name: t("Last 3 months") },
        { id: "Last 6 months", name: t("Last 6 months") }
        
    ];

    const AlarmSummary = [
        { id: "Overview", name: t("Overview") },
        { id: "Acknowledgment", name: t("Acknowledgment") }
    ];

    const TaskSummary = [
        { id: "Overview", name: t("Overview") },
        { id: "Status", name: t("Status") }
    ];

    const overView = [
        {
            "name": "Warning",
            "count": totWarnAlerts || 0,
        },
        {
            "name": "Critical",
            "count": totCriAlerts || 0,
        },
    ];
    
    if (!totWarnAlerts && !totCriAlerts) {
        overView.push({
            "name": "No Data",
            "count": 100,
        });
    }   

    const overViewConnectivity =[
        {
            "name": "Active",
            "count": mtrOnlineCount
        },
        {
            "name": "Inactive",
            "count": MtrofflineCount
        }
    ]

    if (!mtrOnlineCount && !MtrofflineCount) {
        overViewConnectivity.push({
            "name": "No Data",
            "count": 100,
        });
    } 
    
    const headCellsAlarm = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
            width:100
        },
        {
            id: 'Asset name',
            numeric: false,
            disablePadding: true,
            label: t('Asset name'),
            width:120
        },
        {
            id: 'Event Value',
            numeric: false,
            disablePadding: false,
            label: t('Event Value'),
            width:120
        },
        {
            id: 'Time',
            numeric: false,
            disablePadding: false,
            label: t('Time'),
            width:120
        },
        {
            id: 'Limit Value',
            numeric: false,
            disablePadding: false,
            label: t('Limit Value'),
            width:140
        },
        {
            id: 'Limit rule',
            numeric: false,
            disablePadding: false,
            label: t('Limit rule'),
            width:130
        },
        {
            id: 'Alarm status',
            numeric: false,
            disablePadding: false,
            label: t('Alarm status'),
            width:140
        },
        {
            id: 'Remarks',
            numeric: false,
            disablePadding: false,
            label: t('Remarks'),
            width:120
        },
        {
            id: 'Action',
            numeric: false,
            disablePadding: false,
            label: t('Action'),
            width:120
        },
        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('Alert ID'),
            hide: true,
            display: "none",
            width: 100

        }


    ];

   

    const headCellsTask = [
        {
            id: 'SNo',
            numeric: false,
            disablePadding: true,
            label: t('SNo'),
            width:100
        },
        {
            id: 'TaskID',
            numeric: false,
            disablePadding: true,
            label: t('TaskID'),
            width:120
        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: true,
            label: t('Asset'),
            width:120
        },
        {
            id: 'Instrument',
            numeric: false,
            disablePadding: false,
            label: t('Instrument'),
            width:150
        },
        {
            id: 'Priority',
            numeric: false,
            disablePadding: false,
            label: t('Priority'),
            width:100
        },
        {
            id: 'Faultmodeassociated',
            numeric: false,
            disablePadding: false,
            label: t('Fault mode associated'),
            width:190
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: false,
            label: t('Status'),
            width:110
        },
        {
            id: 'Reporteddate',
            numeric: false,
            disablePadding: false,
            label: t('Reported date'),
            width:130
        },
        {
            id: 'Pending Since',
            numeric: false,
            disablePadding: false,
            label: t('Pending Since'),
            width:120
        },
        {
            id: 'Action',
            numeric: false,
            disablePadding: false,
            label: t('Action'),
            width:110
        },
        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('Alert ID'),
            hide: true,
            display: "none",
            width: 100

        }

    ];

  

    return (
        <React.Fragment>
            {page === "child" ?
            <AssetInfo insType={insType} handleActiveIndex={handleActiveIndex} FormattedMeter={FormattedMeter} page={page} selectedAsset={selectedAsset} tabSet={tab} /> :
            <React.Fragment>
            <div>
            <div className="h-[48px] bg-Background-bg-primary dark:bg-Background-bg-primary-dark ">
                <Grid container style={{alignItems: "center",paddingLeft:"16px",paddingRight:"16px", height:"48px" }}>
                    <Grid item xs={10} sm={10} >
                        <Typography variant="heading-02-xs" value={t("Asset Health")}></Typography>
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <div style={{ paddingLeft: "16px"}}>
                            <Select
                                labelId="hierarchyView"
                                id="hierarchy-condition"
                                value={selectedTechnique}
                                options={AddOption}
                                placeholder={'Select Technique'}
                                onChange={(e) => FilterByStatus(e, "instID")}
                                multiple={false}
                                isMArray={true}
                                auto
                                keyValue={"name"}
                                keyId="id"
                            />
                        </div>
                    </Grid>
                </Grid>
                
            </div>
            <HorizontalLine  variant ="divider1"/>
             {(ViewAssetDocLoading || AlertsOverviewLoading || LineConnectivityLoading) && <LoadingScreenNDL />}
            {(!ViewAssetDocLoading || !AlertsOverviewLoading || !LineConnectivityLoading) &&
            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark h-full min-h-[89.7vh]">
            <div className='flex gap-4 p-4'>
            <div className="w-2/3 h-[88vh] overflow-y-auto overflow-x-hidden pr-4" >
            <div class="pb-4">
            <Grid container spacing={4}>
                <Grid item xs={6} sm={6}>
                    <KpiCards style={{ height: "200px"  }}>
                    <div>
                        <div class="flex justify-between">
                            <div>
                            <Typography variant="label-01-s" color="secondary">
                            Total
                        </Typography>
                        <Typography variant="label-01-s" color="secondary">
                        Asset
                        </Typography>
                            </div>

                        </div>
                       
                        {/* <HorizontalLine variant="divider1" /> */}
                        <Typography variant="display-lg" mono>
                            <div className="flex justify-left flex-col gap-2 h-[64px] pt-4 ">
                                {totalAssetCount}
                            </div>
                        </Typography>
                        <div className="flex justify-between">
                        <div className="flex flex-col flex-3 ">
                                <Typography variant="label-02-s" color="success">Normal</Typography>
                                <Typography variant="heading-01-s" color="success" mono>{normalCount + (totalAssetCount - (normalCount + warnCount + highCount))}</Typography>
                            </div>
                            <div className="flex flex-col flex-3 ">
                                <Typography variant="label-02-s" color="warning">Warning</Typography>
                                <Typography variant="heading-01-s"   color="warning" mono>{warnCount}</Typography>
                            </div>
                            <div className="flex flex-col flex-3 ">
                                <Typography variant="label-02-s" color="danger">Critical</Typography>
                                <Typography variant="heading-01-s" mono color="danger">{highCount}</Typography>
                            </div>
                        </div>
                        <div className="mt-2">
                            {insType === 2 ?
                            <Typography variant="paragraph-xs">Last 6 Months</Typography>
                            :
                            <Typography variant="paragraph-xs">Last 1 Year</Typography>
                            }
                        </div>
                    </div>
                    </KpiCards>
                </Grid>

                <Grid item xs={6} sm={6}>
                <KpiCards style={{ height: "200px" }}>
                <div className="flex flex-col h-full">
                <Typography variant="label-01-s" color="secondary">
                       
                        Pending 
                    </Typography>
                    <Typography variant="label-01-s" color="secondary">
                    Tasks
                        </Typography> 
 
                    <div className="flex justify-between items-center h-[60px] ">
                        <Typography  mono variant="display-lg">
                            <div>{totalTask.length > 0 ? totalTask.length : '0'}</div>
                        </Typography>
                        <div className="w-2/3 mr-2">
                            <div className="flex justify-between mb-1">
                            <Typography variant="paragraph-xs" color="secondary">{`Warning (${warnPer.length > 0 ?warnPer.length : '0'})`}</Typography>
                                <Typography variant="paragraph-xs" color="secondary">{warnPer.length > 0 ? `${((warnPer.length / totalTask.length) * 100).toFixed(2)}%` : `0%`}</Typography>
                            </div>
                            <CustomizedProgressBars
                                value={warnPer.length}
                                color="linear-gradient(90deg, #FFAB92 0%, #FF5722 100%)"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row w-full  h-[40px]">
                    <div className="flex justify-between items-center w-full ">
                        <div className="flex flex-col">
                        <Typography variant="paragraph-xs" color="secondary">{`> 15 days`}</Typography>
                    
                    <Typography variant="paragraph-xs" mono>{totalOverdueTask.length > 0 ? totalOverdueTask.length : '0'}</Typography>
                    </div>
                   
                        <div className="w-2/3 ml-auto mr-1.5">
                            <div className="flex justify-between mb-1">
                                <Typography variant="paragraph-xs" color="secondary">{`Critical (${criPer.length > 0 ? criPer.length : '0'})`}</Typography>
                                <Typography variant="paragraph-xs" color="secondary">{criPer.length > 0 ? `${((criPer.length / totalTask.length) * 100).toFixed(2)}%` : `0%`}</Typography>
                            </div>
                            <CustomizedProgressBars
                                value={criPer.length}
                                color="linear-gradient(90deg, #EE9298 0%, #DA1E28 100%)"
                            />
                        </div>
                    </div>
                </div>
                    
                <div className="mt-2">
                            <Typography variant="paragraph-xs">Last 6 Months</Typography>
                        </div>
                </div>
            </KpiCards>
                </Grid>
            </Grid>
        </div>
        {selectedTechnique === "Online Vibration" && (
            <div className='py-4 pt-0'>
                <Grid container spacing={4}>
                    <Grid item xs={6} sm={6}>
                    <KpiCards style={{ height: "310px", position: 'relative' }}>
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex  justify-between  items-center">
                            <div>
                            <Typography variant="heading-01-xs" color="secondary">

Connectivity

</Typography>
                            </div>
                            <div >
                            <Button   type="ghost"  icon={PopOut} value="View More"  onClick={openWindow} />
                            </div>
                        
                        
                        </div>

                        <div className="flex">
                            <div className="width-[212px] height-[212px]">
                                <Bar
                                    height={212}
                                    id={"donut"}
                                    centerValue={connecPer > 0 ? connecPer : '0'}
                                    type={"donut"}
                                    data={overViewConnectivity}
                                    showLegend={false}
                                    colors={["#FF6C3E", "#DA1E28", "#A9A9A9"]}
                                />
                            </div>

                            <div className="flex flex-col gap-8 ">
                                <div className="flex flex-col  gap-1">
                                    <Typography variant="label-01-xs"  color="secondary">
                                       
                                        Total
                                        
                                     
                                        </Typography>
                                    <Typography  style={{marginTop:"4px"}}variant="label-02-xl" mono>{totStatus}</Typography>
                                </div>
                                <div className="flex flex-col  gap-1">
                                    <Typography variant="label-01-xs"  color="secondary">
                                 
                                        Active
                               
                                        </Typography>
                                        
                                    <Typography  variant="label-02-xl" style={{marginTop:"4px"}} mono>{mtrOnlineCount}</Typography>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Typography variant="label-01-xs"  color="secondary">  
                                        Inactive
                                       
                                        </Typography>
                                    <Typography variant="label-02-xl" mono>{MtrofflineCount}</Typography>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <Typography variant="paragraph-xs">Most recent</Typography>
                    </div>
                    </div>
                </KpiCards>

                    </Grid>

                    <Grid item xs={6} sm={6}>
                    <KpiCards style={{ height: "310px", position: 'relative' }}> 
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                        <Typography variant="heading-01-xs" color="secondary">

                                    Alarm Raised
                            </Typography>
                        <Button  type="ghost"  icon={PopOut} value="View More"   onClick={openAlarmWindow} />
                        </div>
                        </div>

                        <div className="flex">
                            <div className="width-[212px] height-[212px]"> 
                            <Bar
                              height={212}
                                id={"donut"}
                                type={"donut"}
                                centerValue={alertsPer > 0 ? alertsPer : '0'}
                                data={overView}
                                showLegend={false}
                                colors={["#FF6C3E", "#DA1E28", "#A9A9A9"]} 
                            />
                            </div>

                            <div className="flex flex-col gap-8"> 
                                <div className="flex flex-col gap-1 ">
                                <Typography variant="label-01-xs"  color="secondary" >
                                       
                                        Total
                                   
                                     
                                        </Typography>
                                    <Typography variant="label-02-xl" mono>{totalAlerts}</Typography>
                                </div>
                                <div className="flex flex-col gap-1">
                                <Typography variant="label-01-xs"  color="secondary">
                                 
                                        Warning
                                  
                                        </Typography>
                                    <Typography  variant="label-02-xl" mono>{totWarnAlerts ? totWarnAlerts : 0}</Typography>
                                </div>
                                <div className="flex flex-col gap-1">
                                <Typography variant="label-01-xs"  color="secondary">
                       
                                    Critical
                                     
                                        </Typography>
                                    <Typography variant="label-02-xl" mono>{totCriAlerts}</Typography>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <Typography variant="paragraph-xs">Last 24hrs</Typography>
                        </div>
                    </div>
                </KpiCards>

                    </Grid>
                </Grid>
            </div>
        )}
        <div className='py-4 pb-0 pt-0'>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                {selectedTechnique === "Online Vibration" ? (
                <KpiCards style={{ height: "470px" }}>
                <div>
                    <div className="flex items-center justify-between pb-2">
                <Typography variant="heading-01-xs" color="secondary">
                     
                                Alarm
                        </Typography>
                        <div className="flex gap-4">
                            <div style={{width:"200px"}}>
                                <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={selectedAlarmSummary}
                                    options={AlarmSummary}
                                    placeholder={'Select Technique'}
                                    onChange={(e) => FilterByStatusAlarm(e)}
                                    multiple={false}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId="id"
                                />
                            </div>
                            <div style={{width:"200px"}}>
                            <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={selectedAlarmTime}
                                    options={AlarmTime}
                                    placeholder={'Select Technique'}
                                    onChange={(e) => FilterByStatusAlarmTime(e)}
                                    multiple={false}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId="id"
                                    noSorting
                                />
                            </div>
                        </div>
                    </div>
                    
                    {AlertsSummaryLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                ) : (
                    <React.Fragment>
                        {selectedAlarmSummary === "Acknowledgment" ? 
                        <React.Fragment>
                            <div className="flex h-10 justify-between mt-2 mb-2" >
                                <div style={{ display: "grid", gap: "4px",   width:"30%" }}>
                                    <Typography variant="label-02-s" color={"tertiary"}>
                                        Overall
                                    </Typography>
                                    <Typography variant="heading-01-s" mono>
                                        {overallCounts.acknowledged + overallCounts.yetToAcknowledge}
                                    </Typography>
                                </div>
                                <div style={{ display: "grid", gap: "4px",  borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%" }}>
                                    <Typography variant="label-02-s" color={"tertiary"}>
                                        Acknowledged
                                    </Typography>
                                    <Typography variant="heading-01-s" mono>
                                        {overallCounts.acknowledged}
                                    </Typography>
                                </div>
                                <div style={{ display: "grid", gap: "4px",  borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%" }}>
                                    <Typography variant="label-02-s" color={"tertiary"}>
                                        Yet to Acknowledge
                                    </Typography>
                                    <Typography variant="heading-01-s" mono>
                                        {overallCounts.yetToAcknowledge}
                                    </Typography>
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="flex h-10 justify-between mt-2 mb-2" >
                                <div style={{ display: "grid",  gap: "4px", width:"30%"  }}>
                                    <Typography variant="label-02-s" color={"tertiary"}>
                                        Overall
                                    </Typography>
                                    <Typography variant="heading-01-s" mono>
                                        {overallCounts.warning + overallCounts.critical}
                                    </Typography>
                                </div>
                                <div style={{ display: "grid", gap: "4px",  borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%" }}>
                                    <Typography variant="label-02-s" color={"tertiary"}>
                                        Warning
                                    </Typography>
                                    <Typography variant="heading-01-s" mono>
                                        {overallCounts.warning}
                                    </Typography>
                                </div>
                                <div style={{ display: "grid", gap: "4px",  borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%"  }}>
                                    <Typography variant="label-02-s" color={"tertiary"}>
                                        Critical
                                    </Typography>
                                    <Typography variant="heading-01-s" mono>
                                        {overallCounts.critical}
                                    </Typography>
                                </div>
                            </div>
                        </React.Fragment>
                        }
                        <div style={{ height: "350px" }}>
                            <Charts
                                charttype={"bar"}
                                labels={labelsalarm}
                                data={datasetalarm}
                                legend={true}
                                noSharedTooltip={true}
                                withTotal={true}
                                isTop

                            />      
                        </div>   
                    </React.Fragment> 
                )}
      
                </div>
            </KpiCards>
                ) : (<KpiCards style={{ height: "450px" }}>
                    <div>
                        <div className="flex items-center justify-between pb-2">
                            <Typography variant="heading-01-xs" color="secondary">
                                <div className="flex items-center h-10">
                                Asset Health Evolution
                                </div>
                            </Typography>
                            <div className="flex space-x-4" style={{"width": "150px"}}>
                            <DatePickerNDL
                                onChange={(dates, end) => {
                                    setSelectedDateStart(dates);
                                    setCalenderYear(dates);
                                }}
                                startDate={selectedDateStart}
                                dateFormat="yyyy"
                                showYearPicker
                            />
                            </div>
                        </div>
                        
                        {taskLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <CircularProgress />
                        </div>
                    ) : (
                        <React.Fragment>
                            <div style={{ height: "350px" }}>
                                <Charts
                                    charttype={"bar"}
                                    labels={labelsTask} 
                                    data={datasetTask} 
                                    legend={true}
                                    noSharedTooltip={true}
                                    withTotal={true}
                                    isTop

                                />
                            </div>
                        </React.Fragment>
                    )}          
                    </div>
                </KpiCards>)}
                </Grid>

                <Grid item xs={12} sm={12}>
                <KpiCards style={{ height: "470px" }}>
                <div>
                    <div className="flex items-center justify-between pb-2">
                        <Typography variant="heading-01-xs">
                            <div className="flex items-center h-10 text-Text-text-secondary dark:text-Text-text-secondary-dark">
                                Task Summary
                            </div>
                        </Typography>
                        <div className="flex space-x-4">
                            <div style={{width:"180px"}}>
                            <Select
                                    labelId="hierarchyView"
                                    id="hierarchy-condition"
                                    value={selectedTaskSummary}
                                    options={TaskSummary}
                                    placeholder={'Select Technique'}
                                    onChange={(e) => FilterByStatusTask(e)}
                                    multiple={false}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId="id"
                                />
                            </div>
                            <div>
                            <DatePickerNDL
                                onChange={(dates) => {
                                    const [start, end] = dates;
                                    setTaskSummaryDate({ start: start, end: end })
                                }}
                                startDate={taskSummaryDate.start}
                                endDate={taskSummaryDate.end}
                                dateFormat="MMM yyyy"
                                selectsRange={true}
                                showTimeSelect={false}
                                showYearPicker={false}
                                showMonthYearPicker={true}
                            />
                            </div>
                        </div>
                    </div>
                    
                    {/* <HorizontalLine variant="divider1" /> */}
                    {taskDataLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                ) : (
                    <React.Fragment>
                    {selectedTaskSummary === "Overview" ? 
                    <React.Fragment>
                    <div className="flex h-10 justify-between mt-2 mb-2" >
                        <div style={{ display: "grid", gap:"4px",width:"30%"}}>
                            <Typography variant="label-02-s" color={"tertiary"}>
                                Overall
                            </Typography>
                            <Typography variant="heading-01-s" mono>
                                {overallTaskCounts.open + overallTaskCounts.closed}
                            </Typography>
                        </div>
                        <div style={{ display: "grid",gap:"4px", borderLeft: "1px solid  #E0E0E0",paddingLeft: "16px",width:"30%"}}>
                            <Typography variant="label-02-s" color={"tertiary"}>
                                Open
                            </Typography>
                            <Typography variant="heading-01-s" mono>
                                {overallTaskCounts.open}
                            </Typography>
                        </div>
                        <div style={{ display: "grid",gap:"4px", borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%" }}>
                            <Typography variant="label-02-s" color={"tertiary"}>
                                Closed
                            </Typography>
                            <Typography variant="heading-01-s" mono>
                                {overallTaskCounts.closed}
                            </Typography>
                        </div>
                    </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                    <div  className="flex h-10 justify-between mt-2 mb-2" >
                        <div style={{ display: "grid",gap:"4px",width:"30%"}}>
                            <Typography variant="label-02-s" color={"tertiary"}>
                                Overall
                            </Typography>
                            <Typography variant="heading-01-s" mono>
                                {overallTaskCounts.warning + overallTaskCounts.critical}
                            </Typography>
                        </div>
                        <div style={{ display: "grid", gap:"4px",borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%" }}>
                            <Typography variant="label-02-s" color={"tertiary"}>
                                Warning
                            </Typography>
                            <Typography variant="heading-01-s" mono>
                                {overallTaskCounts.warning}
                            </Typography>
                        </div>
                        <div style={{ display: "grid",gap:"4px", borderLeft: "1px solid  #E0E0E0", paddingLeft: "16px",width:"30%" }}>
                            <Typography variant="label-02-s" color={"tertiary"}>
                                Critical
                            </Typography>
                            <Typography variant="heading-01-s" mono>
                                {overallTaskCounts.critical}
                            </Typography>
                        </div>
                    </div>
                    </React.Fragment>
                    }
                    <div style={{ height: "350px" }}>
                                                                        <Charts
                                                                            charttype={"bar"}
                                                                            labels={labels}
                                                                            data={datasets}
                                                                            legend={true}
                                                                            noSharedTooltip={true}
                                                                            withTotal={true}
                                                                            isTop
                    />      
                    </div>  
                    </React.Fragment> 
                )}  
                </div>
                
            </KpiCards>
                </Grid>
            </Grid>
        </div>
        <div className='py-4'>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                    <KpiCards >
                    <div>
                        {selectedTechnique === "Online Vibration" ? (
                                  // eslint-disable-next-line array-callback-return

                            !secPage ? (
                            <Grid item xs={5} sm={5}>
                                <div className="flex justify-between items-center mb-2">
                            <Typography variant="lg-heading-02">
                                <div className="flex items-center h-10">
                                <TaskAlarmTabs currentTab={tabValue} tabChange={handleChange} />
                                </div>
                            </Typography>
                            {tabValue === 0 ? (
                   
                           <Button   type="ghost"  icon={PopOut} value="View More"  onClick={openTaskWindow} />
                            ) :
                            ( 
                        <Button   type="ghost"  icon={PopOut} value="View More"  onClick={openAlarmWindow} />
                            )}
                        </div>
                                {tabValue === 1 && (
                                <EnhancedTable
                                    headCells={headCellsAlarm.filter(x=>!x.hide)}
                                    data={alertsTableData}
                                    download={true}
                                    search={true}
                                    rawdata={AlertsData.finalAlertsData}
                                    
                                    rowSelect={true}
                                    tagKey={["Alarm status"]}
                                    checkBoxId={"S.No"}
                                />
                                )}
                                {tabValue === 0 && (
                                <EnhancedTable
                                    headCells={headCellsTask.filter(x=>!x.hide)}
                                    data={tableData}
                                    download={true}
                                    search={true}
                                    rawdata={allTaskListData}
                                    tagKey={["Priority"]}
                                    
                                    rowSelect={true}
                                    checkBoxId={"SNo"}
                                />
                                )}
                            </Grid>
                            ) : null
                        ) : (
                            <div>
                                 <div className="flex justify-between items-center mb-2">
                            <Typography variant="heading-01-xs" color="secondary">
                                <div className="flex items-center h-10">
                                Tasks
                                </div>
                            </Typography>
                    
                        <Button   type="ghost"  icon={PopOut} value="View More"   onClick={openTaskWindow} />
                        </div>
                            <EnhancedTable
                            headCells={headCellsTask}
                            data={tableData}
                            download={true}
                            search={true}
                            rawdata={allTaskListData}
                            tagKey={["Priority"]}
                            rowSelect={true}
                            checkBoxId={"SNo"}
                            />
                            </div>
                        )}
                        </div>
                    </KpiCards>
                </Grid>
            </Grid>
        </div>
            </div>   
            <div className="w-1/3  h-[88vh]" >
            <KpiCards>
                <div className="pt-0">
                    <div>
                    <div className="flex items-center h-10">
                        <Typography variant="heading-01-xs" color='secondary' value='Assets Monitored' />
                        </div>

                        <div className="flex items-center justify-between m-4">
                            <div className="flex items-center gap-1 w-full">
                                <div>
                                    {zones.length > 1 && (
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={scrollLeft}
                                        >
                                            &#10094;
                                        </button>
                                    )}
                                </div>
                                <div
                                        className="whitespace-nowrap flex items-center space-x-4 mx-2 overflow-x-auto"
                                        ref={carouselRef}
                                        style={{
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none',
                                            WebkitOverflowScrolling: 'touch',
                                            overflowX: 'scroll',
                                            overflowY: 'hidden',
                                        }}
                                    >
                                        <button
                                            onClick={() => setSelectedZone(0)}
                                            className={`px-2 py-1 text-[14px] border rounded transition-colors ${
                                                selectedZone === 0
                                                    ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark  text-Text-text-primary dark:text-Text-text-primary-dark border-Border-border-50 dark:border-Border-border-dark-50'
                                                    : 'bg-Secondary_Interaction-secondary-default dark:border-Border-border-dark-50 dark:bg-Secondary_Interaction-secondary-default-dark text-Text-text-secondary dark:text-Text-text-secondary-dark border-Border-border-50 hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark'
                                            }`}
                                        >
                                            All Zones
                                        </button>

                                        {zones.slice(1).map((zone, index) => {
                                            const hasAssets = updatedAssetData[index]?.asset_id.length > 0; 
                                            if (hasAssets) {
                                                return (
                                                    <button
                                                        key={index + 1} 
                                                        onClick={() => setSelectedZone(index + 1)}
                                                        className={`px-2 py-1 text-[14px] border  rounded transition-colors ${
                                                            selectedZone === index + 1
                                                                ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark  text-Text-text-primary dark:text-Text-text-primary-dark border-Border-border-50 dark:border-Border-border-dark-50'
                                                                : 'bg-Secondary_Interaction-secondary-default dark:border-Border-border-dark-50 dark:bg-Secondary_Interaction-secondary-default-dark text-Text-text-secondary dark:text-Text-text-secondary-dark border-Border-border-50 hover:bg-Secondary_Interaction-secondary-hover dark:hover:bg-Secondary_Interaction-secondary-hover-dark'
                                                        }`}
                                                    >
                                                        {zone}
                                                    </button>
                                                );
                                            }
                                            return null; 
                                        })}
                                    </div>
                            </div>
                            <div>
                                {zones.length > 1 && (
                                    <button
                                        className="text-gray-500 hover:text-gray-700"
                                        onClick={scrollRight}
                                    >
                                        &#10095;
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="py-4 flex-1 pb-0 h-[72vh] overflow-y-auto">
                        {hasAssets ? (
                        updatedAssetData.map((zone, zoneIndex) => (
                            (selectedZone === 0 || selectedZone === zoneIndex + 1) && (
                                <React.Fragment key={zoneIndex}>
                                    {zone.asset_id.length > 0 ? (
                                        zone.asset_id.map((asset, assetIndex) => {
                                            const assetImage = base64String && base64String[asset.id];

                                            return (
                                                <div
                                                    key={`${zone.entity_id}-${asset.id}`}
                                                    className="flex p-2 gap-4 cursor-pointer"
                                                    onClick={() => handleDivClick(zone, asset)} 
                                                >
                                                   <div className="flex-shrink-0 pl-0  pb-0">
                                                    {assetImage ? (
                                                        <img 
                                                        src={assetImage} 
                                                        width="50px" 
                                                        height="50px" 
                                                        alt="original" 
                                                        style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius:"6px" }}
                                                        />
                                                    ) : (
                                                        <DefaultAsset />
                                                    )}
                                                    </div>
                                                    <div className="flex-1 ">
                                                        <div className="flex items-center justify-between mb-1">
                                                           <div style={{width:"180px"}}>
                                                           <Typography  style={{marginBottom:"0px"}} variant={ "label-02-m"} value={asset.name} />
                                                           </div>
                                                 
                                                            <StatusNDL
                                                            lessHeight 
                                                                
                                                                colorbg={asset.status_type === "Critical"
                                                                ? "error-alt"

                                                                : asset.status_type === "Warning"
                                                                    ? "warning02-alt"
                                                                    : asset.status_type === "Normal" || (!asset.status_type)
                                                                        ? "success-alt"
                                                                        : ""}
                                                                name={asset.status_type ? asset.status_type : "Normal"}
                                                            />
                                                        </div>
                                                        <div className="flex space-x-2 mb-1">
                                                            {asset.fault_modes && asset.fault_modes.length > 0 ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {asset.fault_modes.map((faultMode, index) => (
                                                                        <TagNDL name={faultMode} lessHeight colorbg={"neutral"} />
                                                                       
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <TagNDL name={'No faults'} lessHeight colorbg={"neutral"} />
                                                               
                                                            )}
                                                        </div>
                                                        {asset.reported_date ? 
                                                         <div className="text-xs text-Text-text-tertiary dark:text-Text-text-tertiary-dark  pb-2">
                                                         Last Reported at {asset.reported_date && moment(asset.reported_date).format('DD/MM/YYYY')}
                                                     </div> :
                                                      <div className="text-xs text-Text-text-tertiary dark:text-Text-text-tertiary-dark pb-2">
                                                      {!asset.reported_date && "No Recent Reports"}
                                                  </div> }
                                                        <HorizontalLine variant="divider1" />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : null}
                                </React.Fragment>
                            )
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <Typography variant="heading-02-xs">No assets are available</Typography>
                        </div>
                    )}


                        </div>
                    </div>
                </div>
            </KpiCards>

                </div>
            </div>
        </div>
         }
        </div>
        
        </React.Fragment>
    }</React.Fragment>
    );
}

