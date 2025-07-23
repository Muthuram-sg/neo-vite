import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import Grid from 'components/Core/GridNDL';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import AssetInfoTabs from "./AssetInfoTabs"
import { selectedPlant, user,snackToggle,snackMessage,snackType,instrumentsList,defects,defectseverity,GapMode, trendsload,
     faultRecommendations, userLine, sensordetails,assetList, CalenderYear, customdates  } from "recoilStore/atoms";
import Typography from "components/Core/Typography/TypographyNDL";
import { themeMode } from "recoilStore/atoms"
import KpiCards from 'components/Core/KPICards/KpiCardsNDL';
import Select from "components/Core/DropdownList/DropdownListNDL";
import { useTranslation } from 'react-i18next';
import useGetAlarmSummaryData from '../hooks/useGetAlarmSummaryData'
import usegetTaskDataWithEntity from '../hooks/useGetTaskDataWithEntity'
import useGetLastConnectivity from '../hooks/useGetLastConnectivity'
import useGetTaskAsset from '../hooks/useGetTaskAsset'
import useGetMainLog from '../hooks/useGetMainLog'
import useUpdateLog from '../hooks/useUpdateLog'
import useGetDeleteMaintLog from '../hooks/useGetDeleteMaintLog'
import useMeterReadingsV1 from "components/layouts/Explore/BrowserContent/hooks/useGetMeterReadingV1";
import moment from 'moment';
import User from 'assets/neo_icons/FaultAnalysis/userNew.svg?react';
import Charts from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/ChartJS/chart.jsx"
import TrendsChart from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/TrendsGraph/components/TrendsChart"
import Tag from "components/Core/Tags/TagNDL";
import useGetEntityInstrument from '../hooks/useGetEntityInstrument'
import useGetAssetClass from '../hooks/useGetAssetClass'
import useGetLastAlert from '../hooks/useGetLastAlert'
import useAddNewLog from '../hooks/useAddNewLog'
import useGetIntrumentMetrics from '../hooks/useGetIntrumentMetrics'
import useGetMetricName from '../hooks/useGetMetricName'
import EnhancedTable from "components/Table/Table";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import configParam from "config";
import {useParams} from "react-router-dom"
import EditsLog from "./EditLog";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import ModalNDL from "components/Core/ModalNDL";
import DefaultAsset from 'assets/neo_icons/AssetHealth/DefaultAsset.svg?react';
import PopOut from 'assets/neo_icons/AssetHealth/PopOut.svg?react';
import Connectivity from 'assets/neo_icons/AssetHealth/Show Connectivity Status.svg?react';
import HideConnectivity from 'assets/neo_icons/AssetHealth/Hide Connectivity Status.svg?react';
import useGetFaultInfo from "components/layouts/FaultAnalysis/hooks/useGetFaultInfo";
import Instrument from 'assets/neo_icons/FaultAnalysis/MeterNew.svg?react';
import Axis from 'assets/neo_icons/FaultAnalysis/Axis.svg?react';
import RightArrow from 'assets/chevron-right.svg?react';
import LeftArrow from 'assets/chevron-left 1.svg?react';
import useTrends from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/hooks/useTrends.jsx";
import trendsColours from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/trendsColours";
import useViewAssetDoc from "components/layouts/Settings/Entity/hooks/useViewAssetDoc"
import ImageNDL from 'components/Core/Image/ImageNDL';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import useViewFiles from 'components/layouts/Tasks/hooks/useViewFiles';
import useFetchOffline from 'components/layouts/OfflineDAQ/Hooks/useFetchOffline';
import useGetOfflineData from '../hooks/useGetOfflineData'
import Button from 'components/Core/ButtonNDL';
import Status from 'components/Core/Status/StatusNDL'
export default function AssetInfo(props) {
    const { t } = useTranslation();
    let {schema} = useParams()
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [selectedInstrumentId, setSelectedInstrumentId] = useState(null); 
    const [base64String, setbase64String] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [graphdata, setGraphData] = useState({ 'data': [], 'annotation': [], 'charttype': "timeseries" })
    const [selectedMetric, setSelectedMetric] = useState("velocity_rms_z_lh"); 
    const [, SetMessage] = useRecoilState(snackMessage);
    const [assetdata, setassetdata] = useState([])
    const [, setseveritycount] = useState(0)
    const [, setmoderatecount] = useState(0)
    const [, setmildcount] = useState(0)
    const [, setnofaultcount] = useState(0)
    const [, setnodatacount] = useState(0)
    const [faultEntityData, setFaultEntityData] = useState([])
    const [, SetType] = useRecoilState(snackType);
    const [tabValue, setTabValue] = useState(0);
    const [headPlant] = useRecoilState(selectedPlant);
    const [datasetalarm,setDatasetalarm] = useState([]);
    const [labelsalarm,setLabelsalarm] = useState([]);
    const [, setmodeFilterOption] = useState([])
    const [combinedData, setcombinedData] = useState([])
    const [faultInforData, setfaultInforData] = useState([])
    const [, setallfaultsdata] = useState([])
    const [ , setAckType ] = useState(-1)
    const [toV1Date, settoV1Date] = useState([])
    const [fromV1Date, setfromV1Date] = useState([])
    const [, setVisibleWidth] = useState(0);
    const [FaultFilterData, setFaultFilterData] = useState([])
    const [mainLogdata,setmainLogdata] = useState([]);
    const [downloadabledata, setdownloadabledata] = useState([]);
    const [selectedAlarmTime,setselectedAlarmTime] = useState('Last 7 days');
    const [,setOverallCounts]= useState(0);
    const [isRightDisabled, setIsRightDisabled] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [,setLastConnectivity]= useState('-');
    const [insClass,setInsClass]= useState('-');
    const [, setLoading] = useState(false);
    const [, setnofaultmode] = useState(false)
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setaccordiandata] = useState([])
    const [, settotalFault] = useState('')
    const [modeFilterValue, setmodeFilterValue] = useState([])
    const [updatedOfflineData,setUpdatedOfflineData] = useState([])
    const [model, setModel] = useState(false)
    const [selectedDate, setselectedDate] = useState(new Date());
    const [ metricTitle, setMetricTitle ] = useState([])
    const [instrumentID, setinstrumentID] = useState([])
    const [activeInstrumentsCount, setActiveInstrumentsCount] = useState(0);
    const [, setTotalInstrumentsCount] = useState(0);
    const [allConnected, setAllConnected] = useState(false);
    const [ metricValue, setMetricValue ] = useState([])
    const [currUser] = useRecoilState(user);
    const [instrumentList] = useRecoilState(instrumentsList);
    const [defectsinfodata] = useRecoilState(defects);
    const [defectsseveritydata] = useRecoilState(defectseverity);
    const [assets] = useRecoilState(assetList)
    const [faultactions] = useRecoilState(faultRecommendations)
    const [users] = useRecoilState(userLine);
    const [, setType] = useRecoilState(snackType);
    const [, setDataAvailable] = useState(false)
    const [, setTrendsOnlineLoad] = useRecoilState(trendsload);
    const [sensorsdata] = useRecoilState(sensordetails);
    const [,setalternateNames] = useState([]);
    const [taskImage, setTaskImage] = useState([]);
    const [currentTaskImageIndex, setCurrentTaskImageIndex] = useState(0);  
    const [editId, setEditId]= useState('');
    const [editLog, setEditLog]= useState('');
    const [containerWidth, setContainerWidth] = useState(0);
    const [CurTheme] = useRecoilState(themeMode)
    const [latestAlertData,setLatestAlertData]= useState('');
    const [,setCalenderYear] = useRecoilState(CalenderYear)
    const [selectedDotIndex, setSelectedDotIndex] = useState(null); 
    const [timelineData, setTimelineData] = useState([]);
    const [selectedDateStart, setSelectedDateStart] = useState(new Date()); 
    const { taskLoading, taskData, taskError, getTask } = useGetTaskAsset()
    const { ViewFilesLoading, ViewFilesData, ViewFilesError, getViewFiles } = useViewFiles()
    const { mainLogLoading, mainLogData, mainLogError, getMainLog }= useGetMainLog()
    const { insClassLoading, insClassData, insClassError, getInsClass } = useGetAssetClass() 
    const { fetchOfflineLoading, fetchOfflineData, fetchOfflineError, getfetchOffline } = useFetchOffline()
    const { offlineLoading, offlineData, offlineError, getOfflineData } = useGetOfflineData()
    const { meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error, getMeterReadingsV1 } = useMeterReadingsV1()
    const { entityInstrumentLoading, entityInstrumentData, entityInstrumentError, getEntityInstrument } = useGetEntityInstrument() 
    const { lastConnectStatusLoading, lastConnectStatusData, lastConnectStatusError, getLastConnectivity  } = useGetLastConnectivity() 
    const { entityWiseTaskLoading, entityWiseTaskData, entityWiseTaskError, getTaskDataWithEntity } = usegetTaskDataWithEntity();
    const { lastAlertLoading, lastAlertData, lastAlertError, getLastAlert } = useGetLastAlert();
    const { AlertsSummaryLoading, AlertsSummaryData, AlertsSummaryError, getAlarmSummaryData } = useGetAlarmSummaryData();
    const { outMaintenanceLogsLoading, outMaintenanceLogsData, outMaintenanceLogsError, getAddMaintenanceLogsDetails } = useAddNewLog();
    const { updateMaintLogLoading, updateMaintLogData, updateMaintLogError, getUpdateLog } = useUpdateLog();
    const { delMaintLogLoading, delMaintLogData, delMaintLogError, getDelMaintLog } = useGetDeleteMaintLog();
    const { faultInfoLoading, faultInfoData, faultInfoError, getFaultInfo } = useGetFaultInfo();
    const { trendsdataLoading, trendsdataData, trendsdataError, getTrends } = useTrends();
    const { ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError, getViewAssetDoc } = useViewAssetDoc()
    const { metricnameLoading, metricnameData, metricnameError, getmetricname } = useGetMetricName()
    const { instrumentMetricsLoading, instrumentMetricsData, instrumentMetricsError, getInstrumentMetrics } = useGetIntrumentMetrics()
    const [sortedTasks, setSortedTasks] = useState([]);
    const [faultData, setFaultData] = useState(null);
    const [updatedFaultData, setUpdatedFaultData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const dotWidth = 100;
    const timelineWidth = fetchOfflineData && fetchOfflineData.length * dotWidth;
    const totalScrollableWidth = timelineData.length * dotWidth; 
    const maxScrollPosition = Math.max(0, timelineWidth - containerWidth);

    useEffect(() => {
        if(props.tabSet){
            if(props.tabSet === 'status'){
                setTabValue(0)
            }else if(props.tabSet === 'maintenancelog'){
                setTabValue(1)
            }
        }
        else {
            setTabValue(0)
        }
    },[props.tabSet])
    console.log(tabValue,"check tab")
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
      };
      function cryptoRandom() {
        let array = new Uint32Array(1);
        return window.crypto.getRandomValues(array)[0] / Math.pow(2, 32);
    }
    const handleCardClick = (instrumentId) => {
        setSelectedInstrumentId(instrumentId);
    };

    useEffect(() => {
        const container = document.getElementById('timeline-container');
        if (container) {
            const containerWidth = container.clientWidth;
            setVisibleWidth(containerWidth);
        }
    }, []);  

    useEffect(() => {
        if(selectedDotIndex === null){
        if (timelineData && timelineData.length > 0) {
          const lastIndex = timelineData.length - 1;
          setSelectedDotIndex(lastIndex);
        }
    }
      }, [timelineData]);      

    const FilterByStatusAlarmTime = (e, type) => {
        setselectedAlarmTime(e.target.value);
    };

    const handleNextImage = (assetId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [assetId]: (prevState[assetId] + 1) % (base64String[assetId] ? base64String[assetId].length : 1), 
        }));
    };
    
    const openWindow = () => {      
        const matchedInstrument = entityInstrumentData.find(
          (item) => item.instrument.id === selectedInstrumentId
        );
      
        const dataToStore = {
          selectedInstrumentId: selectedInstrumentId,
          selectedMetric: selectedMetric,
          from: toV1Date,
          to: fromV1Date,
          instrumentname: matchedInstrument ? matchedInstrument.instrument.name : selectedInstrument,
          metric: matchedMetric.title,
        };
      
        localStorage.setItem("openExploreFromAH", JSON.stringify(dataToStore));
        window.open(configParam.APP_URL + '/'+schema+'/explore');
      };      

      useEffect(() => {
        if (selectedDate && entityInstrumentData) {
      
          let dateObject;
      
          if (typeof selectedDate === 'string' && selectedDate.includes('/')) {
            const [day, month, year] = selectedDate.split('/');
            dateObject = new Date(`${year}-${month}-${day}`);
          } else if (selectedDate instanceof Date) {
            dateObject = selectedDate;
          } else {
            console.error("Invalid date format:", selectedDate);
            return;
          }
      
          const startOfDay = new Date(dateObject.setHours(0, 0, 0, 0));
          const endOfDay = new Date(dateObject.setHours(23, 59, 59, 999));
      
          const instrumentIds = entityInstrumentData.map((item) => item.instrument_id);
          getOfflineData(
            headPlant.schema,
            instrumentIds,
            moment(startOfDay).format("YYYY-MM-DDTHH:mm:ss"),
            moment(endOfDay).format("YYYY-MM-DDTHH:mm:ss"),
            "3600"
          );
        }
      }, [selectedDate, entityInstrumentData]);      

    const openTaskWindow = () => {
        localStorage.setItem("openTaskFromAH", JSON.stringify(currentTask));
        window.open(configParam.APP_URL + '/'+schema+'/Tasks/editform' )
    }    

    const openFaultWindow = () => {
        localStorage.setItem("openPDMFromAH", JSON.stringify(props.selectedAsset.asset.id));
        window.open(configParam.APP_URL + '/'+schema+'/Pdm' )
    }    

    useEffect(() => {
        if (selectedDateStart && headPlant) {
            const year = selectedDateStart.getFullYear();
    
            const startOfYear = new Date(year, 0, 1); 
    
            const endOfYear = new Date(year, 11, 31); 
            
            getTask(startOfYear, endOfYear, headPlant.id, props.insType );
        }
    }, [selectedDateStart, headPlant, props.insType]);
      
      const handlePrevImage = (assetId) => {
        setCurrentImageIndex((prevState) => {
            const totalImages = base64String[assetId] ? base64String[assetId].length : 0;
            const newIndex = (prevState[assetId] - 1 + totalImages) % totalImages;
    
            return {
                ...prevState,
                [assetId]: newIndex,
            };
        });
    };    
      
      const handleDotClick = (assetId, index) => {
        setCurrentImageIndex((prevState) => ({
          ...prevState,
          [assetId]: index, 
        }));
      };
      
    const colors = [
        "#007bff", "#d3e1c1", "#f1c0c0", "#ffc5a1", "#d9a3ff", "#ff9d85", "#ffb2a1", "#f2bebe"
    ];
    
    const metricNames = instrumentMetricsData?.map((metricItem) => ({
        name: metricItem.metric.name,
        title: metricItem.metric.title
    }));    


    const matchedMetric = metricNames?.find(
        (metricItem) => metricItem.name === selectedMetric
      );

    const handleSelectMetric = (name) => {
        setSelectedMetric(name); 
    };

    useEffect(() => {
        if (!ViewFilesLoading && ViewFilesData && !ViewFilesError) {
          
          const base64Array = ViewFilesData.map((file) => file.base64);
          setTaskImage(base64Array);
        }
      }, [ViewFilesLoading, ViewFilesData, ViewFilesError]);
    
      const handleTaskPrevImage = () => {
        setCurrentTaskImageIndex((prevIndex) =>
          prevIndex === 0 ? taskImage.length - 1 : prevIndex - 1
        );
      };
    
      const handleTaskNextImage = () => {
        setCurrentTaskImageIndex((prevIndex) =>
          prevIndex === taskImage.length - 1 ? 0 : prevIndex + 1
        );
      };    

    useEffect(() => {
        if (!ViewAssetDocLoading && ViewAssetDocData && !ViewAssetDocError) {
      
          if (ViewAssetDocData.Data && ViewAssetDocData.Data.length > 0) {
            const base64DataMap = {};
      
            ViewAssetDocData.Data.forEach((asset) => {
      
              const fileKeys = Object.keys(asset).filter((key) => key.startsWith("file"));
      
              if (fileKeys && fileKeys.length > 0) {
                if (!base64DataMap[asset.assetId]) {
                  base64DataMap[asset.assetId] = [];
                }
      
                fileKeys.forEach((key) => {
                  base64DataMap[asset.assetId].push(`data:image/jpeg;base64,${asset[key]}`);
                });
              }
            });
      
            setbase64String(base64DataMap);
            const initialImageIndex = {};
            Object.keys(base64DataMap).forEach((assetId) => {
              initialImageIndex[assetId] = 0; 
            });
            setCurrentImageIndex(initialImageIndex);
          } else {
            setbase64String({});
          }
        }
      }, [ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError]);     
      
    const listArray = [
        { index: 'parent', name: 'Overview' },
        { index: 'child', name: props.selectedAsset.asset.name },
    ]
    const AlarmTime = [
        { id: "Last 7 days", name: t("Last 7 days") },
        { id: "Last 30 days", name: t("Last 30 days") },
        { id: "Last 3 months", name: t("Last 3 months") },
        { id: "Last 6 months", name: t("Last 6 months") }
    ];

    useEffect(() => {
        if (faultEntityData && props.selectedAsset?.asset?.id) {
            const filteredData = faultEntityData.filter(item => item.entity_id === props.selectedAsset.asset.id);
            
            let faultDetected = null;
            let faultInstrument = null;
            let allFaults = [];
        
            filteredData.forEach(item => {
                item.entity_instruments.forEach(instrument => {
                    if (instrument.faults && instrument.faults.length > 0) {
                        instrument.faults.forEach(fault => {
                            allFaults.push({
                                ...fault,
                                instrumentName: instrument.name,
                                reportedDate: fault.reportedDate, 
                                instrumentId: instrument.id, 
                                severity: fault.severity,
                                severityLabel: fault.severityLabel,
                                userName: fault.userName
                            });
                        });
                    }
                });
            });
        
            if (allFaults.length > 0) {
                allFaults.sort((a, b) => new Date(b.time) - new Date(a.time));
                
                const latestFault = allFaults[0];
                setFaultData(latestFault);
                getMeterReadingsV1(headPlant.schema, latestFault.iid, "env_acc_lh,acc_rms_x_lh,acc_rms_z_lh,velocity_rms_x_lh,acc_rms_y_lh,velocity_rms_z_lh,temp,velocity_rms_y_lh", latestFault.time, latestFault.time);

            } else {
                setFaultData(null);
            }            
        }
    }, [faultEntityData, props.selectedAsset, headPlant]);   

    useEffect(() => {
        const container = document.getElementById("timeline-container");
        if (!container) return;
      
        const dotsContainer = container.querySelector("div > div");
        if (!dotsContainer) return;
      
        const dots = dotsContainer.children;
        if (dots.length === 0) return;
      
        const lastDot = dots[dots.length - 1];
      
        if (!lastDot) return;
      
        const containerRight = container.scrollLeft + container.clientWidth;
        const lastDotRight = lastDot.offsetLeft + lastDot.offsetWidth;
      
        setIsRightDisabled(lastDotRight <= containerRight);
      }, [scrollPosition, timelineData]);      
         

    useEffect(() => {
        if (fetchOfflineData && fetchOfflineData.length > 0 && taskData && !taskLoading && !taskError && props.selectedAsset?.asset?.id) {
            const uniqueDates = new Set();
    
            const filteredData = fetchOfflineData.map(data => {
                const date = new Date(data.time);
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                if (!uniqueDates.has(formattedDate)) {
                    uniqueDates.add(formattedDate);
    
                    const matchingTask = taskData.find(task => {
                        const taskDate = new Date(task.observed_date);
                        const formattedTaskDate = `${String(taskDate.getDate()).padStart(2, '0')}/${String(taskDate.getMonth() + 1).padStart(2, '0')}/${taskDate.getFullYear()}`;
    
                        return formattedTaskDate === formattedDate;
                    });
    
                    const assetHealth = matchingTask
                        ? matchingTask.instrument_status_type && matchingTask.instrument_status_type.status_type === "Normal"
                            ? "Normal"
                            : matchingTask.instrument_status_type && matchingTask.instrument_status_type.status_type === "Warning"
                            ? "Warning"
                            : "Critical"
                        : "";
                    const machineISO = matchingTask?.instrument?.instrumentClassByInstrumentClass?.class || "";
                    const dataCollectedBy = matchingTask?.userByObservedBy?.name || "";
                    const reportedBy = matchingTask?.userByReportedBy?.name || "";
    
                    return {
                        date: formattedDate,
                        assetHealth,
                        machineISO,
                        dataCollectedBy,
                        reportedBy,
                        ...data, // Keep other fields from fetchOfflineData
                    };
                }
                return null;
            }).filter(Boolean);
    
            // Sort the filtered data by the date in ascending order
            const sortedData = filteredData.sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-')); // Convert to YYYY-MM-DD for correct comparison
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateA - dateB; // Ascending order
            });
    
            setTimelineData(sortedData); // Set the sorted data
            
            // Set the latest date as selected by default (last entry in sortedData)
            if (sortedData.length > 0) {
                setselectedDate(sortedData[sortedData.length - 1].date); 
            }
        }
    }, [fetchOfflineData, taskData, props.selectedAsset, taskLoading, taskError]);    

    useEffect(() => {

        if (fetchOfflineData && Array.isArray(fetchOfflineData)) {
            if (offlineData && Array.isArray(offlineData) && offlineData.length > 0) {
                const offlineDatesSet = new Set(offlineData.map(item => new Date(item.time).toISOString().split('T')[0]));
    
                const filteredFetchData = fetchOfflineData.filter(fetchItem => {
                    const fetchDate = new Date(fetchItem.time).toISOString().split('T')[0];
                    return offlineDatesSet.has(fetchDate);
                });
    
                const combinedData = [...offlineData, ...filteredFetchData];
                setcombinedData(combinedData);
            } else {
                if (selectedDate) {
                    const validDate = new Date(selectedDate);
                    if (!isNaN(validDate.getTime())) { 
                        const selectedDateString = validDate.toISOString().split('T')[0];
    
                        const filteredFetchDataByDate = fetchOfflineData.filter(fetchItem => {
                            const fetchDate = new Date(fetchItem.time).toISOString().split('T')[0];
                            return fetchDate === selectedDateString; 
                        });
    
                        setcombinedData(filteredFetchDataByDate);
                        
                    } else {
                        setcombinedData([]); 
                    }
                } else {
                    setcombinedData([]);
                }
            }
        }
    }, [offlineData, fetchOfflineData, selectedDate]);     
    
    useEffect(() => {
        if (
          !meterReadingsV1Loading &&
          Array.isArray(meterReadingsV1Data?.data) &&
          !meterReadingsV1Error
        ) {
          const faultKey = faultData.key.toLowerCase(); 
      
          const filteredData = meterReadingsV1Data.data.filter((reading) => {
            if (reading.key.startsWith('acc_')) return false;
      
            const match = reading.key.match(/_(x|y|z)_/); 
      
            if (match) {
              const axis = match[1]; 
              return axis === faultKey;
            }
      
            return false; 
          });
      
          const amplitudes = filteredData.map(reading => reading.key);
          const amplitudeValues = filteredData.map(reading => reading.value);
      
          getmetricname(amplitudes.join(', '));
          const updatedFaultData = {
            ...faultData,
            amplitude: amplitudes,
            amplitudeValues: amplitudeValues,
          };
          setUpdatedFaultData(updatedFaultData)
        }
      }, [faultData, meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error]);         
    
    useEffect(() => {
        fetchfaults();
    }, []);

    const matchedAmplitude = updatedFaultData && metricNames?.find(
        (metricItem) => {
          const amplitudeValue = Array.isArray(updatedFaultData.amplitude)
            ? updatedFaultData.amplitude.join('') 
            : updatedFaultData.amplitude;
      
          return (
            typeof amplitudeValue === 'string' &&
            metricItem.name.trim().toLowerCase() === amplitudeValue.trim().toLowerCase()
          );
        }
      )          

    async function fetchfaults() {
        const endDate = moment().format("YYYY-MM-DDTHH:mm:ssZ");
        const startDate = moment().subtract(7, 'days').format("YYYY-MM-DDTHH:mm:ssZ");

        getFaultInfo(headPlant.schema, startDate, endDate);
    }
      

    useEffect(() => {
        const year = selectedDateStart.getFullYear();
        
        const startOfYear = new Date(year, 0, 1); 
        const endOfYear = new Date(year, 11, 31); 
        
        const instrumentIds = entityInstrumentData && entityInstrumentData[0] && entityInstrumentData[0].instrument_id
        
            getfetchOffline(
                headPlant.schema,
                [instrumentIds],
                moment(startOfYear).format("YYYY-MM-DDTHH:mm:ss"),
                moment(endOfYear).format("YYYY-MM-DDTHH:mm:ss"),
                "3600"
            );
    }, [headPlant, entityInstrumentData, selectedDateStart]);
     
    const alternateNamesMapping = {
        "acceleration_rms_ver": "VerAcc",
        "acceleration_rms_hor": "HorAcc",
        "velocity_rms_hor": "HorVel",
        "acceleration_rms_axi": "AxiAcc",
        "velocity_rms_axi": "AxiVel",
        "velocity_rms_ver": "VerVel",
        "env_acc_lh": "EnvAcc"
    };
    const columnNames = Object.values(alternateNamesMapping);   

    useEffect(() => {
        const alternateNames = columnNames.map(name => alternateNamesMapping[name] || name);
        
        setalternateNames(prevNames => {
            if (JSON.stringify(prevNames) !== JSON.stringify(alternateNames)) {
                return alternateNames;
            }
            return prevNames; 
        });
    }, [columnNames]);     
    
    const transformedData = combinedData.reduce((acc, current) => {
        let existingRow = acc.find(row => row.iid === current.iid);
        
        if (existingRow) {
            existingRow[alternateNamesMapping[current.key] || current.key] = current.value; 
        } else {
            acc.push({ iid: current.iid, [alternateNamesMapping[current.key] || current.key]: current.value }); 
        }
        return acc;
    }, []);    

    useEffect(() => {
        const updatedData = transformedData.map(dataItem => {
            const matchedInstrument = entityInstrumentData.find(entity => entity.instrument_id === dataItem.iid);
            
            if (matchedInstrument) {
                const instrumentName = matchedInstrument.instrument.name;
                const parts = instrumentName.split('_'); 
                const cleanedName = parts.slice(1, -1).join('_');
                
                return {
                    ...dataItem,
                    instrument_name: cleanedName
                };
            }
            
            return {
                ...dataItem,
                instrument_name: 'Unknown'
            };
        });
        const roundedData = updatedData.map(dataItem => {
            const newItem = { ...dataItem }; 
            
            Object.keys(newItem).forEach(key => {
                // Exclude 'instrument_name' and 'iid'
                if (key !== 'instrument_name' && key !== 'iid') {
                    // Check if the value is a number and round it off
                    const value = parseFloat(newItem[key]);
                    if (!isNaN(value)) {
                        newItem[key] = value.toFixed(2);
                    }
                }
            });
            
            return newItem;
        });
        if (JSON.stringify(updatedOfflineData) !== JSON.stringify(roundedData)) {
            setUpdatedOfflineData(roundedData);
        }
    }, [transformedData, entityInstrumentData, updatedOfflineData]);
    
    
    const faultdataprocessing = (faultInfodata) => {
        let instrument_fault_data = [];
        let tempfaultinfoData = [...faultInfodata];
        tempfaultinfoData.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        faultInfodata=tempfaultinfoData
      
        tempfaultinfoData.forEach((item) => {
            let instrumentindex = instrumentList.findIndex(v => v.id === item.iid);
            let defect_index = defectsinfodata ? defectsinfodata.findIndex(d => Number(d.defect_id) === Number(item.defect)) : -1;
            let observation_index = defectsinfodata ? defectsinfodata.findIndex(d => Number(d.defect_id) === Number(item.defect)) : -1;
            let severity_index = defectsseveritydata ? defectsseveritydata.findIndex(s => Number(s.id) === Number(item.severity)) : -1;
            let action_index = faultactions ? faultactions.findIndex(f => (Number(f.defect_id) === Number(item.defect)) && (Number(f.severity_id) === Number(item.severity))) : -1;
            let userIndex = users.findIndex(v => v.user_id === item.updated_by);
            let sensorindex = sensorsdata.findIndex(s => s.iid === item.iid && s.axis === item.key);
          const analystName = getAnalystName(userIndex);
          var instru_present = instrument_fault_data.findIndex(instru => instru.iid === item.iid);
          if (instru_present >= 0) {
            var defect_present = instrument_fault_data[instru_present].faults.findIndex(d => (Number(d.defect) === Number(item.defect)) && (d.key === item.key));
           
            if (defect_present >= 0) {
              instrument_fault_data[instru_present].faults[defect_present].history.push(
                Object.assign({}, item, {
                  "defect_name": defect_index >= 0 ? defectsinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
                  "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
                  "observation": observation_index >= 0 ? defectsinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
                  "value":  metricValue ? metricValue : "" ,
                  "title":  metricTitle ? metricTitle : "" ,
                  "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
                  "analyst":analystName,
                  "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
                  "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
                  "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
                  "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-',  
                  "severity" : action_index >= 0 ? item.severity :  -1 
                })
              );
            } else {
              instrument_fault_data[instru_present].faults.push(Object.assign({}, item, {
                "defect_name": defect_index >= 0 ? defectsinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
                "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
                "observation": defect_index >= 0 ? defectsinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
                "value":  metricValue ? metricValue : "" ,
                "title":  metricTitle ? metricTitle : "" ,
                "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
                "analyst": analystName,
                "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
                "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
                "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
                "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', 
                "severity" : action_index >= 0 ? item.severity :  -1 ,
               
                "history": [Object.assign({}, item, {
                  "defect_name": defect_index >= 0 ? defectsinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
                  "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
                  "observation": defect_index >= 0 ? defectsinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
                  "value":  metricValue ? metricValue : "" ,
                  "title":  metricTitle ? metricTitle : "" ,
                  "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
                  "analyst": analystName,
                  "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
                  "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
                  "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
                  "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', 
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
                "defect_name": defect_index >= 0 ? defectsinfodata[defect_index].defect_name : action_index >= 0 ? "" : "No Faults",
                "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
                "observation": defect_index >= 0 ? defectsinfodata[defect_index].observation : action_index >= 0 ? "" : "No Observation",
                "value":  metricValue ? metricValue : "" ,
                "title":  metricTitle ? metricTitle : "" ,
                "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
                "analyst": analystName,
                "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
                "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
                "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
                "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', 
                "severity" : action_index >= 0 ? item.severity :  -1, 
                "history": [Object.assign({}, item, {
                  "defect_name": defect_index >= 0 ? defectsinfodata[defect_index].defect_name : "No Faults",
                  "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
                  "observation": defect_index >= 0 ? defectsinfodata[defect_index].observation : "No Observation",
                  "value":  metricValue ? metricValue : "" ,
                  "title":  metricTitle ? metricTitle : "" ,
                  "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended',
                  "analyst": analystName,
                  "updated_at": sensorindex >= 0 ? sensorsdata[sensorindex].updated_at : '-',
                  "defect_processed_at": sensorindex >= 0 ? sensorsdata[sensorindex].defect_processed_at : '-',
                  "instrument_name": instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
                  "rpm": item.predicted_rpm ? Math.round(parseFloat(item.predicted_rpm)) : '-', 
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
            return { id:  defects.defect_name, name: defects.defect_name , count: defects &&defects.history && defects.history.length };
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
        }));
        if(!(modeFilterValue.findIndex(fi=>fi.id === "No Faults") > 0 && modeFilterValue && modeFilterValue.length > 0)){
            var defaultselectedarray = aggregatedCountsArray.filter(f=>f.id !== "No Faults")
        } else {
          defaultselectedarray = [...aggregatedCountsArray]
        }
        setmodeFilterOption(aggregatedCountsArray)
        setmodeFilterValue(defaultselectedarray)
        setfaultInforData(faultInfoData)
        setFaultFilterData(instrument_fault_data)
        setLoading(false)
    
      }

      useEffect(() => {
        dataFormatingForFaults(FaultFilterData)
        if(modeFilterValue.findIndex(m=>m.id === "No Faults") < 0){
          setnofaultmode(false)
        }
      }, [FaultFilterData, modeFilterValue, faultInforData])
    
      const dataFormatingForFaults = (instrument_fault_data) => {
        let filteredData = []
        if (modeFilterValue && modeFilterValue.length > 0) {
          let keyId = modeFilterValue.map(x => x.id)
          filteredData = instrument_fault_data.map(items => {
            return {
              ...items, faults: items.faults.filter(defect => {
                return keyId.includes(defect.defect_name)
              })
            }
          })
          filteredData = filteredData.filter(x => (x.datapresent && x.faults && x.faults.length > 0) || (!x.datapresent))
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
                    let instrument_level_fault_time_severity = filteredData[faults_index].faults
                    let instrument_level_latest_fault = instrument_level_fault_time_severity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0].time
                    var instrument_level_latest_fault_data = instrument_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(instrument_level_latest_fault).getTime())[0] ? instrument_level_fault_time_severity.filter(f => new Date(f.time).getTime() === new Date(instrument_level_latest_fault).getTime())[0] : {}
    
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
                  val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
                  userIndex >= 0 ? users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-' : '-'
                ]
              )
            }
          })
        }
        setallfaultsdata(tempdownloadabledata);
        setAckType(1);
         setFaultEntityData(entity_data)
        if (entity_data.filter(e => e.entity_id == assetdata.entity_id).length > 0)
        setseveritycount(entity_data.filter(a => Number(a.latest_fault_severity) === 3).length)
        setmoderatecount(entity_data.filter(a => Number(a.latest_fault_severity) === 2).length)
        setmildcount(entity_data.filter(a => Number(a.latest_fault_severity) === 1).length)
        setnofaultcount(entity_data.filter(a => Number(a.latest_fault_severity) === -1).length)
        setnodatacount(entity_data.filter(a => a.entity_instruments.map(e => e.datapresent).every(d => d === false)).length)
      };
    
      useEffect(() => {
        if (!faultInfoLoading && faultInfoData && !faultInfoError ) {
          faultdataprocessing(faultInfoData)
        }
      }, [faultInfoLoading, faultInfoData, faultInfoError])

      const getAnalystName = (userIndex) => {
        if (userIndex >= 0) {
          return users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-';
        } else {
          return '';
        }
      };

    useEffect(() => {
        try {
            if (
                !entityWiseTaskLoading &&
                Array.isArray(entityWiseTaskData) &&
                entityWiseTaskData.length > 0 &&
                !entityWiseTaskError
            ) {
                const isOnline = props?.insType === 2;

                const duration = isOnline ? 6 : 24;
                const cutoffDate = moment().subtract(duration, 'months');

                const filteredByTime = entityWiseTaskData.filter(task => {
                    const date = task?.reported_date;
                    return date && moment(date).isAfter(cutoffDate);
                });

                if (filteredByTime?.length === 0) {
                    setSortedTasks([]);
                    return;
                }

                const latestTask = filteredByTime.reduce((latest, task) => {
                    return moment(task?.reported_date).isAfter(moment(latest?.reported_date)) ? task : latest;
                }, filteredByTime[0]);

                const latestDate = moment(latestTask?.reported_date).format('YYYY-MM-DD');

                const latestDateTasks = filteredByTime.filter(task =>
                    moment(task?.reported_date).format('YYYY-MM-DD') === latestDate
                );

                const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };

                const sortedTasks = latestDateTasks.sort((a, b) =>
                    (priorityOrder[a?.taskPriority?.task_level] || 4) -
                    (priorityOrder[b?.taskPriority?.task_level] || 4)
                );

                setSortedTasks(sortedTasks);
                setCurrentIndex(0);
            }
        } catch (error) {
            console.error("Error while processing entityWiseTaskData:", error);
            setSortedTasks([]);
        }
    }, [entityWiseTaskData, entityWiseTaskLoading, entityWiseTaskError, props?.insType]);
    
    const handleNext = () => {
        if (currentIndex < sortedTasks.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };    
    
    const currentTask = sortedTasks && sortedTasks[currentIndex];  
    
    const handleSaveFunction = (date, remarks) => {
        const selectedDate = new Date(date.value);
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
    
        getAddMaintenanceLogsDetails(
            props.selectedAsset.asset.id,
            headPlant.id,
            remarks,
            currUser.id,
            formattedDate 
        );
    };
    
    const handleUpdateFunction = (date, remarks, editId) => {
        const selectedDate = new Date(date.value);
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
    
        getUpdateLog(
            editId,
            formattedDate,
            remarks
        );
    };

    const handleDeleteFunction = (deleteID) => {
    getDelMaintLog(deleteID)
    }

    useEffect(()=>{
        if(!outMaintenanceLogsLoading && outMaintenanceLogsData && !outMaintenanceLogsError){
            if (outMaintenanceLogsData.affected_rows >= 1) {
                handleDialogClose();
                SetMessage(t('AddMaintenanceInfo') + " " + outMaintenanceLogsData.returning[0].entity.name)
                SetType("success")
                setOpenSnack(true)
                setTimeout(() => {
                    getMainLog(props.selectedAsset.asset.id)
                }, 1000);
            }
        }
    },[outMaintenanceLogsLoading, outMaintenanceLogsData, outMaintenanceLogsError])

    useEffect(()=>{
        if(!updateMaintLogLoading && updateMaintLogData && !updateMaintLogError){
            if (updateMaintLogData.affected_rows >= 1) {
                handleDialogClose();
                SetMessage('Maintenance Info Updated')
                SetType("success")
                setOpenSnack(true)
                setTimeout(() => {
                    getMainLog(props.selectedAsset.asset.id)
                }, 1000);
                setEditLog('')
                setEditId('')
            }
        }
    },[updateMaintLogLoading, updateMaintLogData, updateMaintLogError])

    useEffect(()=>{
        if(!delMaintLogLoading && delMaintLogData && !delMaintLogError){
            if (delMaintLogData.affected_rows >= 1) {
                SetMessage('Maintenance Info Deleted')
                SetType("success")
                setOpenSnack(true)
                getMainLog(props.selectedAsset.asset.id)
            }
        }
    },[delMaintLogLoading, delMaintLogData, delMaintLogError])

    useEffect(()=>{
        getTaskDataWithEntity(props.selectedAsset.asset.id)
        getEntityInstrument(props.selectedAsset.asset.id, props.insType)
        getMainLog(props.selectedAsset.asset.id)
        getInsClass(props.selectedAsset.asset.id)
        getViewAssetDoc({entity_id:props.selectedAsset.asset.id})
    },[props.selectedAsset.asset.id])

    useEffect(()=>{
        if(sortedTasks && sortedTasks.length > 0){
        getViewFiles(sortedTasks[0].id)
        }
    },[sortedTasks])

    useEffect(() => {
        if (!entityInstrumentLoading && entityInstrumentData && !entityInstrumentError) {

            if ((Array.isArray(entityInstrumentData) && entityInstrumentData?.length > 0) && props?.insType === 2) {
    
                let fromV1Date = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ssZ");
                let toV1Date = moment().format("YYYY-MM-DD HH:mm:ssZ");
                setfromV1Date(fromV1Date)
                settoV1Date(toV1Date)
                const meters = entityInstrumentData.map((instrument) => ({
                    frmDate: fromV1Date,
                    toDate: toV1Date,
                    interval: "15", 
                    id: instrument.instrument_id, 
                    metric_val: selectedMetric
                }));
    
                const selectedInstrument = selectedInstrumentId || entityInstrumentData[0].instrument_id;
                
                getTrends(meters, headPlant.schema, true);
    
                const instrumentIds = entityInstrumentData && entityInstrumentData.map(item => item.instrument_id);
                setinstrumentID(instrumentIds);
                getLastConnectivity(instrumentIds);
                getLastAlert(instrumentIds);
    
                if (!selectedInstrumentId) {
                    setSelectedInstrumentId(entityInstrumentData[0].instrument_id);
                }
            }
        }
    }, [entityInstrumentLoading, entityInstrumentData, entityInstrumentError, selectedMetric, selectedInstrumentId]);       

    useEffect(()=>{ 
        if(!lastConnectStatusLoading && lastConnectStatusData && !lastConnectStatusError){
            if(lastConnectStatusData[0] && lastConnectStatusData[0].last_state){
            setLastConnectivity(lastConnectStatusData[0].last_state ? lastConnectStatusData[0].last_state : "")
            }
        }
    },[lastConnectStatusLoading, lastConnectStatusData, lastConnectStatusError])

    useEffect(() => {
        const filteredInstruments = props.FormattedMeter.filter(
            (meter) => instrumentID.includes(meter.id)
        );
        
        const activeCount = filteredInstruments.filter(
            (meter) => meter.status === "Active"
        ).length;
    
        const totalCount = filteredInstruments.length;
        
        setActiveInstrumentsCount(activeCount);
        setTotalInstrumentsCount(totalCount);
        setAllConnected(totalCount !== 0 && activeCount === totalCount);
    }, [instrumentID, props.FormattedMeter]); 

    useEffect(()=>{
        if(!insClassLoading && insClassData && !insClassError){
            setInsClass(insClassData[0]?.instrumentClassByInstrumentClass?.class || "No Class Defined");
        }
    },[insClassLoading, insClassData, insClassError])

    function handleDialogClose() {
        setModel(false)
      }

    useEffect(()=>{
        if(!mainLogLoading && mainLogData && !mainLogError){
            setmainLogdata(mainLogData);
            processmainLogdata();
        }
    },[mainLogLoading, mainLogData, mainLogError])

    const processmainLogdata = () => {
        let temptabledata = [];
    
        if (mainLogData) {
            temptabledata = mainLogData.map((val, index) => {
                return [
                    index + 1,
                    moment(val.log_date).format("DD/MM/YYYY"), 
                    val.log,
                    val.userByUpdatedBy.name,
                    moment(val.updated_ts).format("DD/MM/YYYY"),
                    val.id
                ];
            });
        }        
    
        setmainLogdata(temptabledata);
        setdownloadabledata(temptabledata)
    }; 

    const EditLog = (id, value) => {
        handleOpenPopUp()
    }

    const DeleteLog = (id, value) => {
        handleDeleteFunction(value.id)
    }

    const handleOpenPopUp = (event) => {
        setModel(true)
    };

    useEffect(() => {
        if (!AlertsSummaryLoading && AlertsSummaryData && !AlertsSummaryError) {
            const finalAlertsData = AlertsSummaryData.finalAlertsData;

            const filteredAlertsData = finalAlertsData && finalAlertsData.filter(alert =>
                entityInstrumentData && entityInstrumentData.some(entity => entity.instrument_id === alert.iid)
            );
            setLatestAlertData(filteredAlertsData && filteredAlertsData[0])
    
            const now = moment();
    
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
                groupedData = groupBy(filteredAlertsData, alert => moment(alert.time).startOf('day').format('DD/MM/YYYY'));
            } else if (selectedAlarmTime === "Last 30 days") {
                groupedData = groupBy(filteredAlertsData, alert => {
                    const startOfWeek = moment(alert.time).startOf('week');
                    const endOfWeek = moment(alert.time).endOf('week');
                    
                    const startDate = startOfWeek.format('WW DD/MMM');
                    const endDate = endOfWeek.format('WW DD/MMM');
                    
                    return `${startDate} - ${endDate}`;
                });
            } else if (selectedAlarmTime === "Last 6 months" || selectedAlarmTime === "Last 3 months") {
                groupedData = groupBy(filteredAlertsData, alert => moment(alert.time).startOf('month').format('MM(MMM)-YY'));
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
    
            const overallCounts = filteredAlertsData && filteredAlertsData.reduce((acc, alert) => {
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
    
            if(overallCounts){
                setOverallCounts({
                    critical: overallCounts.critical,
                    warning: overallCounts.warning,
                    acknowledged: overallCounts.acknowledged,
                    yetToAcknowledge: overallCounts.yetToAcknowledge,
                });
            }
        }
    }, [AlertsSummaryLoading, AlertsSummaryData, AlertsSummaryError, selectedAlarmTime, entityInstrumentData]);
    

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
    
    useEffect(()=>{
        getInstrumentMetrics(selectedInstrumentId)
    },[selectedInstrumentId])

    const selectedInstrument = selectedInstrumentId || entityInstrumentData && entityInstrumentData[0] && entityInstrumentData[0].instrument_id;

    useEffect(() => {
        if (!trendsdataLoading && trendsdataData && trendsdataData.data && trendsdataData.data.flat(1).length > 0 && !trendsdataError) {
            var finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
            convertchartFormat(trendsdataData.data.flat(1),selectedInstrumentId,selectedMetric)

        }

else if (!trendsdataLoading&& (!trendsdataData || (trendsdataData && trendsdataData.data && trendsdataData.data.flat(1).length === 0) || trendsdataError)) {
            setLoading(false)
        } 
       

    }, [trendsdataLoading, trendsdataData, trendsdataError, selectedInstrumentId, selectedMetric])

    const convertchartFormat = (rawData, iid, key) => {
        let colorindex = Math.floor(cryptoRandom() * trendsColours[1].length);
        let metricColour = trendsColours[1][colorindex];
        const tempObj = {
            'data': [
                {
                    name: key + " (" + iid + ")",
                    id: iid,
                    color: metricColour,
                    data: [],
                    time: "",
                    type: "line"
                }
            ],
            'annotation': [],
            'charttype': "timeseries"
        };
    
        const filteredData = rawData.filter(d => d.iid === iid && d.key === key);
        let trend_data = [];
    
        const uniqueDataSet = new Set();
    
        filteredData.forEach(data => {
            const time = data.time;  
            const value = Number(data.value);
    
            const uniqueKey = `${time}-${value}`;
            if (!uniqueDataSet.has(uniqueKey)) {
                uniqueDataSet.add(uniqueKey);
    
                let obj1 = {
                    x: time,  
                    y: value  
                };
    
                trend_data.push(obj1);
            }
        });
    
        tempObj.data[0].data = trend_data;

        setGraphData(tempObj);
    };    

    const tableheadCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
            width:100
        },
        {
            id: 'Maintenance Date',
            numeric: false,
            disablePadding: true,
            label: t('Maintenance Date'),
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
            id: 'Last Updated by',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated by'),
            width:140
        },
        {
            id: 'Last Updated on',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated on'),
            width:140
        }
    ];

    const headCellsMain = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
            width:100
        },
        {
            id: 'Maintenance Date',
            numeric: false,
            disablePadding: true,
            label: t('Maintenance Date'),
            width:150
        },
        {
            id: 'Remarks',
            numeric: false,
            disablePadding: false,
            label: t('Remarks'),
            width:130
        },
        {
            id: 'Last Updated by',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated by'),
            width:150
        },
        {
            id: 'Last Updated on',
            numeric: false,
            disablePadding: false,
            label: t('Last Updated on'),
            width:150
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

    const assetImages = base64String && base64String[props.selectedAsset.asset.id];      
    
    const scrollRight = () => {
        const container = document.getElementById("timeline-container");
        if (!container) return;
      
        const dots = container.querySelectorAll(".timeline-dot");
        if (!dots.length) return;
      
        const lastDot = dots[dots.length - 1];
        if (!lastDot) return;
      
        const lastDotRight = lastDot.getBoundingClientRect().right;
        const containerRight = container.getBoundingClientRect().right;
      
        if (lastDotRight > containerRight) {
          const scrollBy = container.clientWidth / 2;
          container.scrollBy({ left: scrollBy, behavior: "smooth" });
        }
      };      
      
      const scrollLeft = () => {
        const container = document.getElementById("timeline-container");
        if (!container) return;
      
        const scrollBy = container.clientWidth / 2;
        container.scrollBy({ left: -scrollBy, behavior: "smooth" });
      };          
    
    function capitalizeWords(text) {
        if (!text) return ''; // Handle empty or undefined input
        return text
          .toLowerCase() // Convert entire text to lowercase
          .split(' ') // Split by spaces to handle multiple words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
          .join(' '); // Join the words back into a single string
      }

    return (
        
        <React.Fragment>
        {
            props.page === "child" &&
            <React.Fragment>
            <div className="flex px-4 py-2" style={{ justifyContent: "left", minHeight:"48px" }}>
                <BredCrumbsNDL breadcrump={listArray} onActive={() => props.handleActiveIndex(props.page)} />
            </div>
            <HorizontalLine variant="divider1" />
            <div>
                          <Grid item xs={5} sm={5}  >
                            <AssetInfoTabs currentTab={tabValue} tabChange={handleChange} />
                            </Grid>

                            <HorizontalLine variant="divider1" />


                            {tabValue === 0 && (
                                 <div className='flex gap-4 p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark '>
                                      <div className="w-2/3 h-[82vh] overflow-y-auto overflow-x-hidden pr-4" >
                                    <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} >
                                    <div className="flex flex-col gap-2 pb-2">
                                 <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    {props.insType === 2 ? (
                                <KpiCards >
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <Typography variant="heading-01-xs" color="secondary">
                                  
                                                Last 7 days Trend
                                           
                                            </Typography>
                                        <Button   type="ghost"  icon={PopOut} value="View in Explore"    onClick={openWindow} />
                                        </div>
                                        {/* <HorizontalLine variant="divider1" /> */}
                                        <Grid container spacing={2}>
                                        {!entityInstrumentLoading && entityInstrumentData && !entityInstrumentError &&
                                            entityInstrumentData.map((instrumentData) => {
                                                const isSelected = selectedInstrumentId === instrumentData.instrument_id;
                                                const instrument = props.FormattedMeter.find(
                                                    (meter) => meter.id === instrumentData.instrument_id
                                                );
                                                const isActive = instrument && instrument.status === "Active";

                                                return (
                                                    <Grid item xs={6} sm={6}>
                                                        <div
                                                         key={instrumentData.instrument_id} 
                                                         onClick={() => handleCardClick(instrumentData.instrument_id)} 
                                                        style={{ 
                                                            height: "48px", 
                                                            width: "370px", 
                                                            display: "flex", 
                                                            justifyContent: "space-between", 
                                                            alignItems: "center", 
                                                            padding: "12px",
                                                            cursor: "pointer",
                                                            borderRadius:"6px"
                                                        }}
                                                        className={`${isSelected ? "bg-Surface-surface-active dark:bg-Surface-surface-active-dark" : 'bg-Surface-surface-default-50 dark:bg-Surface-surface-default-50-dark'}`}>
                                                        <Typography 
                                                            variant="paragraph-xs" 
                                                           
                                                        >
                                                            {instrumentData.instrument.name.split('(')[0].trim()}
                                                            <br />
                                                            {instrumentData.instrument.name.includes('(') && (
                                                                <span>
                                                                    ({instrumentData.instrument.name.split('(')[1].trim()}
                                                                </span>
                                                            )}
                                                        </Typography>
                                                        {isActive ? (
                                                            <Connectivity  height={16} width={16}/>
                                                        ) : (
                                                            <HideConnectivity height={16} width={16}/>
                                                        )}
                                                        </div>
                                                    </Grid>
                                                );
                                            })
                                        }
                                        </Grid>
                                  
                                        <div style={{ height: "100%", marginTop:"16px"}}>
                                        {trendsdataLoading ? (
                                            <div className="flex justify-center items-center h-[400px]">
                                                <CircularProgress />
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                {graphdata && graphdata.data.length > 0 ?
                                              <TrendsChart
                                                yData={graphdata}
                                                disableMeter={false}
                                                yaxistitle={matchedMetric ? matchedMetric.title : selectedMetric}
                                                height={400}
                                                style={{marginTop:"8px"}}
                                                /> : 
                                                <div className="flex justify-center items-center h-[400px]">
                                                <Typography value={"No Data"} variant="heading-01-xs" color="secondary" />
                                                </div>
                                                }
                                            <div style={{ display: "flex", justifyContent: "center", marginTop: 20,  overflowX: "auto", flexWrap: "wrap",maxWidth: "100%" }}>
                                            {metricNames?.map((metricItem, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handleSelectMetric(metricItem.name)} 
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginRight: 20,
                                                        cursor: 'pointer',
                                                        opacity: selectedMetric === metricItem.name ? 1 : 0.5, 
                                                        fontWeight: selectedMetric === metricItem.name ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            backgroundColor: colors[index % colors.length],
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: "50%",
                                                            marginRight: 8
                                                        }}
                                                    ></div>
                                                    <span className="text-Text-text-primary dark:text-Text-text-primary-dark leading-4 font-geist-sans" style={{fontSize: 14 }}>
                                                        {metricItem.title.replace("_", " ").toUpperCase()} 
                                                    </span>
                                                </div>
                                            ))}

                                            </div>
                                            </React.Fragment>
                                        )}
                                        </div>     
                                    </div>
                                </KpiCards>
                                    ) :
                                    (
                                        <KpiCards >
                                        <div>
                                          <div className="flex justify-between items-center">
                                            <Typography variant="heading-01-xs" color="secondary">Measurement Calendar</Typography>
                                            <div className="flex space-x-4" style={{ width: '150px' }}>
                                              <DatePickerNDL
                                                id="custom-range-report"
                                                onChange={(dates, end) => {
                                                  setSelectedDateStart(dates);
                                                  setCalenderYear(dates);
                                                }}
                                                startDate={selectedDateStart}
                                                dateFormat="yyyy"
                                                showYearPicker
                                                maxDate={new Date()}
                                              />
                                            </div>
                                          </div>
                                      
                                          {/* <HorizontalLine variant="divider1" /> */}
                                      
                                          {fetchOfflineLoading ? (
                                            <div className="flex justify-center items-center h-full">
                                              <CircularProgress />
                                            </div>
                                          ) : fetchOfflineData && fetchOfflineData.length > 0 ? (
                                            <React.Fragment>
                                              <div className="flex items-center justify-between">
                                                <div className="relative">
                                                <button
                                                    onClick={() => {
                                                        if (timelineData.length > 3) scrollLeft();
                                                    }}
                                                    className={`p-2 text-lg mx-10 z-10 rounded 
                                                        ${timelineData.length <= 3 || scrollPosition >= maxScrollPosition ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} 
                                                        ${CurTheme === 'dark' ? 'text-white' : 'text-black'}
                                                    `}
                                                    style={{ position: 'relative', zIndex: 1 }}
                                                    disabled={timelineData.length <= 3}>
                                                    &#8249;
                                                    </button>
                                                </div>
                                      
                                                <div
                                                  id="timeline-container"
                                                  className="flex justify-between items-center overflow-hidden relative"
                                                  style={{ width: '90%', paddingTop: '25px' }}
                                                >
                                                  <div className="absolute inset-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-300"></div>
                                      
                                                  <div
                                                    className="flex items-center justify-between"
                                                    style={{
                                                        width: `${timelineWidth}px`,
                                                      transform: `translateX(-${scrollPosition}px)`,
                                                      transition: 'transform 0.3s ease-in-out',
                                                    }}
                                                  >
                                                    {timelineData.map((item, index) => {
                                                      const rawDate = item.date;
                                                      let selectedDate = null;
                                      
                                                      if (rawDate) {
                                                        selectedDate = moment(rawDate, "DD/MM/YYYY").toDate();
                                                        if (isNaN(selectedDate.getTime())) {
                                                            selectedDate = null;
                                                        }
                                                    }
                                                    
                                                      return (
                                                        <div key={index} className="relative flex flex-col items-center mx-4">
                                                          <div className="relative">
                                                            <div
                                                             className={`timeline-dot w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                                                                item.assetHealth=== 'Critical'
                                                                    ? 'bg-red-500 border-red-500'
                                                                    : item.assetHealth=== 'Warning'
                                                                    ? 'bg-orange-500 border-orange-500'
                                                                    : item.assetHealth=== 'Normal'
                                                                    ? 'bg-green-500 border-green-500'
                                                                    : 'bg-gray-200 border-gray-200' 
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedDotIndex(index);
                                                                setselectedDate(selectedDate)
                                                             
                                                                  
                                                              }}
                                                              style={{ cursor: 'pointer' }}
                                                            >
                                                              <div
                                                                className={`w-7 h-7 rounded-full ${
                                                                  item.assetHealth=== 'Critical'
                                                                    ? 'bg-red-300'
                                                                    : item.assetHealth=== 'Warning'
                                                                    ? 'bg-orange-300'
                                                                    : item.assetHealth=== 'Normal'
                                                                    ? 'bg-green-300'
                                                                    : 'border-gray-300'
                                                                }`}
                                                              ></div>
                                                            </div>
                                                          </div>
                                                          <span className="mt-2 text-sm">
                                                                {selectedDate ? (
                                                                    <Typography value={item.date} color={CurTheme === "dark" ? "#FFFFFF" : "#000000"}></Typography>
                                                                ) :<Typography value={'Invalid Date'} color={CurTheme === "dark" ? "#FFFFFF" : "#000000"}></Typography>}
                                                                </span>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                      
                                                <div className="relative">
                                                <button
                                                onClick={() => {
                                                    if (!isRightDisabled) scrollRight();
                                                }}
                                                className={`p-2 text-lg mx-10 z-10 rounded 
                                                    ${isRightDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} 
                                                    ${CurTheme === 'dark' ? 'text-white' : 'text-black'}
                                                `}
                                                disabled={isRightDisabled}
                                                >
                                                &#8250;
                                                </button>
                                                </div>
                                              </div>
                                      
                                              <div style={{ height: '180px', padding: '16px', marginTop: '16px', borderRadius:"16px" }}>
                                                <div className="flex items-baseline gap-1" >
                                                <div className="flex-shrink-0 w-[250px]">
                                                  <Typography className="whitespace-nowrap" variant="paragraph-lg" color="secondary">
                                                    {'Asset Health'} 
                                                  </Typography>
                                                  </div>
                                                  <div className="break-all">
                                                  {selectedDotIndex !== null && timelineData[selectedDotIndex] && timelineData[selectedDotIndex].assetHealth ? (
                                                    <Tag
                                                      style={{
                                                        color: '#FFFFFF',
                                                        
                                                        textAlign: 'center',
                                                      }}
                                                      name={
                                                        typeof timelineData[selectedDotIndex].assetHealth === 'string'
                                                          ? timelineData[selectedDotIndex].assetHealth
                                                          : ''
                                                      }
                                                      colorbg={ timelineData[selectedDotIndex].assetHealth === 'Normal'
                                                      ? 'success-alt'
                                                      : timelineData[selectedDotIndex].assetHealth === 'Warning'
                                                      ? 'warning02-alt'
                                                      : timelineData[selectedDotIndex].assetHealth === 'Critical'
                                                      ? 'error-alt'
                                                      : ''}
                                                    />
                                                  ) : (
                                                    <Typography className="whitespace-nowrap ml-2" variant="xl-body-01">
                                                      {''}
                                                    </Typography>
                                                  )}
                                                  </div>
                                                </div>
                                      
                                                <div className="flex items-baseline gap-1 mt-4" >
                                                <div className="flex-shrink-0 w-[250px]">
                                                  <Typography className="whitespace-nowrap" variant="paragraph-lg" color="secondary">
                                                    {'Machine ISO Class'} 
                                                  </Typography>
                                                  </div>
                                                  <div className="break-all">
                                                  <Typography className="whitespace-nowrap ml-2"  variant="paragraph-lg">
                                                    {selectedDotIndex !== null && timelineData[selectedDotIndex]
                                                      ? typeof timelineData[selectedDotIndex].machineISO === 'string'
                                                        ? timelineData[selectedDotIndex].machineISO
                                                        : ''
                                                      : ''}
                                                  </Typography>
                                                  </div>
                                                </div>
                                      
                                                <div className="flex items-baseline gap-1  mt-4" >
                                                <div className="flex-shrink-0 w-[250px]">
                                                  <Typography className="whitespace-nowrap" variant="paragraph-lg" color="secondary">
                                                    {'Data Collected By'} 
                                                  </Typography>
                                                  </div>
                                                  <div className="break-all">
                                                  <Typography className="whitespace-nowrap ml-2" variant="paragraph-lg">
                                                    {capitalizeWords(selectedDotIndex !== null && timelineData[selectedDotIndex]
                                                      ? timelineData[selectedDotIndex].dataCollectedBy
                                                      : '')}
                                                  </Typography>
                                                  </div>
                                                </div>
                                      
                                                <div className="flex items-baseline gap-1  mt-4" >
                                                <div className="flex-shrink-0 w-[250px]">
                                                  <Typography className="whitespace-nowrap" variant="paragraph-lg" color="secondary">
                                                    {'Reported By'} 
                                                  </Typography>
                                                  </div>
                                                  <div className="break-all">
                                                  <Typography className="whitespace-nowrap ml-2" variant="paragraph-lg">
                                                    {capitalizeWords(selectedDotIndex !== null && timelineData[selectedDotIndex]
                                                      ? timelineData[selectedDotIndex].reportedBy
                                                      : '')}
                                                  </Typography>
                                                  </div>
                                                </div>
                                              </div>
                                              {updatedOfflineData && updatedOfflineData.length > 0 ? (
                                                <React.Fragment>
                                                    <div className="flex flex-col h-full mt-4">
                                                        <div className="flex-1 overflow-x-auto">
                                                            <div className="min-w-max">
                                                                <div
                                                                    className="grid gap-2 font-bold p-2"
                                                                    style={{ gridTemplateColumns: `repeat(${columnNames.length + 1}, minmax(150px, 1fr))` }}
                                                                >
                                                                    <Typography variant="label-02-m">Instrument Name</Typography>
                                                                    {columnNames.map((colName, index) => (
                                                                        <Typography key={index} variant="label-02-m">
                                                                            {alternateNamesMapping[colName] || colName} 
                                                                        </Typography>
                                                                    ))}
                                                                </div>

                                                                <HorizontalLine variant="divider1" />
                                                                <div>
                                                                    {updatedOfflineData.map((row, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className={`grid gap-2 p-2 ${index !== updatedOfflineData.length - 1 ? 'border-b' : ''}`}
                                                                            style={{ gridTemplateColumns: `repeat(${columnNames.length + 1}, minmax(150px, 1fr))` }}
                                                                        >
                                                                            <Typography variant="paragraph-m" color="secondary">{row.instrument_name}</Typography>

                                                                            {columnNames.map((colName, colIndex) => (
                                                                                <Typography key={colIndex}  variant="paragraph-m" color="secondary" mono>
                                                                                    {row[colName] || row[Object.keys(alternateNamesMapping).find(key => alternateNamesMapping[key] === colName)] || '-'}
                                                                                </Typography>
                                                                                
                                                                            ))}
                                                                              
                                                                        </div>
                                                                         
                                                                    ))}
                                                                  
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            ) : null}
                                            </React.Fragment>
                                          ) :<Typography value={"No Offline Data"} color={CurTheme === "dark" ? "#FFFFFF" : "#000000"}></Typography>}
                                        </div>
                                      </KpiCards>
                                      
                                      
                            )}                                  
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                {props.insType === 2 ? (
                                <KpiCards >
                                <div>
                                    <div className="flex items-center justify-between">
                                    <Typography variant="heading-01-xs" color="secondary">
                                        Triggered Alarms
                                    </Typography>
                                    <div className="flex space-x-4 w-[250px]">
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
                                        />
                                        </div>
                                        </div>
                                    {/* <HorizontalLine variant="divider1" /> */}
                                    {AlertsSummaryLoading ? (
                                            <div className="flex justify-center items-center h-full">
                                                <CircularProgress />
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                    <div style={{ height: "350px" }}>
                                        <Charts
                                        charttype={"bar"}
                                        labels={labelsalarm}
                                        data={datasetalarm}
                                        legend={true}
                                    />      
                                    </div> 
                                    </React.Fragment>  
                                        )}
                                </div>
                                </KpiCards>
                                ) : (
                                    <KpiCards style={{ height: "500px", padding: "20px", position: "relative" }}>
                                    <div className="flex items-center justify-between">
                                      <Typography variant="heading-01-xs" color="secondary">
                                        FFT Spectra
                                      </Typography>
                                    </div>
                                    {/* <HorizontalLine variant="divider1" /> */}
                                    <div
                                        style={{
                                          position: "relative",
                                          width: "100%",
                                          height: "350px",
                                          display:"flex",
                                          justifyContent:"center",
                                          margin: "0 auto",
                                          overflow: "hidden",
                                          paddingTop: "50px",
                                        }}
                                      >
                                    {taskImage && taskImage.length > 0 ? (
                                      <div className="flex items-center gap-4">
                                        {taskImage.length > 1 && (
                                          <button
                                            style={{
                                              position: "absolute",
                                              top: "50%",
                                              left: "10px",
                                              transform: "translateY(-50%)",
                                              fontSize: "2rem",
                                              background: "none",
                                              border: "none",
                                              cursor: currentTaskImageIndex === 0 ? "not-allowed" : "pointer", 
                                              zIndex: 1,
                                              color: currentTaskImageIndex === 0 ? "#ccc" : "#000", 
                                            }}
                                            onClick={currentTaskImageIndex !== 0 ? handleTaskPrevImage : null} 
                                            disabled={currentTaskImageIndex === 0} 
                                          >
                                            &#8249;
                                          </button>
                                        )}
                                        <div style={{ position: "relative",  overflow: "hidden" }}>
                                  <div className="h-[320px] flex items-center justify-center">
                                        <ImageNDL
                                          src={taskImage[currentTaskImageIndex]}
                                          width="100%"
                                          height= "320px"
                                          style={{ height: "320px", objectFit: "cover",borderRadius:"6px"}}
                                          alt={"Task Image"}
                                        />
                                  </div>
                                  </div>
                                        {taskImage.length > 1 && (
                                          <button
                                            style={{
                                              position: "absolute",
                                              top: "50%",
                                              right: "10px",
                                              transform: "translateY(-50%)",
                                              fontSize: "2rem",
                                              background: "none",
                                              border: "none",
                                              cursor: currentTaskImageIndex === taskImage.length - 1 ? "not-allowed" : "pointer", 
                                              zIndex: 1,
                                              color: currentTaskImageIndex === taskImage.length - 1 ? "#ccc" : "#000", 
                                            }}
                                            onClick={currentTaskImageIndex !== taskImage.length - 1 ? handleTaskNextImage : null} 
                                            disabled={currentTaskImageIndex === taskImage.length - 1} 
                                          >
                                            &#8250;
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex justify-center items-center h-[500px]">
                                        <Typography value={"No task images uploaded"} color={CurTheme === "dark" ? "#FFFFFF" : "#000000"}></Typography></div>
                                    )}
                                     </div>
                                  </KpiCards>
                                  
                                  
                                                               
                                )}
                               
                            </Grid>
                            </Grid>
                            </div>
                            </Grid>
                     
                            </Grid>
                            <Grid container spacing={2}>

                            <Grid item xs={12} sm={12}>
                            <KpiCards style={{ height: "auto", position: "relative", padding: "16px" }}>
                            <div className="flex justify-between items-center mb-4">
                                            <Typography variant="heading-01-xs" color="secondary">

                                                Latest Task
                                        
                                            </Typography>
                                            {
                                                currentTask &&  <Button style={{minWidth:140}} type="ghost"  icon={PopOut} value=" View in Task"  onClick={openTaskWindow}  />
                                            }
                                       
                                        </div>
                          
                                <KpiCards style={{  height: "auto", width:"96%", marginLeft:"16px", display:currentTask ? "block":"none"}}>
                                    {currentTask && 
                                        <React.Fragment>
                                            <div className="flex justify-between items-center gap-2 py-1">
                                                <Typography variant="paragraph-xs" mono color="tertiary">
                                                    {currentTask.task_id && "#" + currentTask.task_id}
                                                </Typography>
                                                <Typography variant="paragraph-xs" mono color="tertiary">
                                                    {moment(currentTask.reported_date).format('DD/MM/YYYY')}
                                                </Typography>
                                            </div>
                                            <div className="mb-2">
                                                <Typography variant="label-02-s" >{capitalizeWords(currentTask.title)}</Typography>
                                            </div>
                                            <div className=" flex">
                                            <Tag  colorbg={"neutral"} lessHeight style={{  textAlign: "center", marginRight: "8px" }}
                                                name={currentTask.taskType.task_type} />
                                            <Tag colorbg={"neutral"} lessHeight style={{  textAlign: "center", marginRight: "8px" }}
                                                name={currentTask.taskStatus.status} />
                                            <Tag  lessHeight style={{
                                                textAlign: "center",
                                            }}
                                            colorbg={currentTask.taskPriority.task_level === "High"
                                            ? "error-alt"
                                            : currentTask.taskPriority.task_level === "Medium"
                                                ? "warning02-alt"
                                                : "success-alt"}
                                                name={currentTask.taskPriority.task_level} />
                                             </div>
                                            <div className="flex items-baseline gap-1  mt-2">
                                                <div className="flex-shrink-0 w-[150px]">
                                                    <Typography className="whitespace-nowrap flex-shrink-0"variant="paragraph-xs" value="Recommendations" />
                                                </div>
                                                <div>
                                                    <Typography color="secondary" value="-" /> 
                                                </div>
                                                <div className="break-all">
                                                <Typography  variant="paragraph-xs" color="secondary">
                                                    {currentTask.action_recommended ? currentTask.action_recommended : 'N/A'}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="flex items-baseline gap-1 mt-2">
                                                <div className="flex-shrink-0 w-[150px]">
                                                    <Typography className="whitespace-nowrap flex-shrink-0" variant="paragraph-xs"ccolor="secondary" value="Fault Mode" />
                                                </div>
                                                <div>
                                                    <Typography color="secondary" value="-" /> 
                                                </div>
                                                <div className="break-all">
                                                <Typography variant="paragraph-xs" color="secondary">
                                                    {currentTask.faultModeByFaultMode.name ? currentTask.faultModeByFaultMode.name : 'N/A'}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 pt-2 ">
                                                <User style={{ width: "16px", height: "16px" }} />
                                                <Typography variant="paragraph-xs" color="secondary">
                                                    {currentTask.userByCreatedBy ? capitalizeWords(currentTask.userByCreatedBy.name) : 'N/A'}
                                                </Typography>
                                            </div>
                                        </React.Fragment>
                                    
                                       
                                    }
                                 
                                </KpiCards>
                                {!currentTask&& props?.insType === 2 && 
                                    <Typography variant="lable-01-m"  className="mt-4" style={{display:"flex", justifyContent:"center"}}>
                                            No Task record available in last 6 months
                                        </Typography> }
                                 {!currentTask&& props?.insType !== 2 && 
                                    <Typography variant="lable-01-m"  className="mt-4" style={{display:"flex", justifyContent:"center"}}>
                                            No Task record available in last 2 years
                                        </Typography> }
                               {
                                currentTask &&
                                <div className="flex justify-between items-center absolute top-1/2 transform -translate-y-1/2 left-0 right-0">
                                    <div className="ml-1.5">
                                    <LeftArrow style={{ cursor:"pointer"}}
                                        onClick={handlePrevious} 
                                        disabled={currentIndex === 0} 
                                        className={`"#000" ${currentIndex === 0 ? 'opacity-50' : 'font-bold text-xl'}`}
                                      
                                    />
                                    </div>
                                 
                                  <div className="mr-1.5">
                                  <RightArrow  style={{cursor:"pointer"}}
                                        onClick={handleNext} 
                                        disabled={currentIndex === sortedTasks.length - 1} 
                                        className={`"#000" ${currentIndex === sortedTasks.length - 1 ? 'opacity-50' : 'font-bold text-xl'}`}
                                       
                                    />
                                  </div>
                                    
                                    
                                </div>
                               } 
                            </KpiCards>

                            </Grid>
                            <Grid item xs={12} sm={12}>
                            {props.insType === 2 && (
                            <KpiCards >
                                <div>
                                <div className="flex justify-between items-center mb-2">
                                            <Typography variant="heading-01-xs" color="secondary">
                                               
                                                Lastest Fault Ocuured
                                         
                                            </Typography>
                                        <Button   type="ghost"  icon={PopOut} value=" View in PDM "  onClick={openFaultWindow} />
                                        </div>
                                   
                                    <KpiCards style={{ position: "relative" }}>
                                  
                                    
                                    {updatedFaultData ? (
                                        <div >
                                        <div className="flex justify-between items-center gap-1 py-1">
                                            <div className='flex gap-2'>
                                            <svg width="6" height="42" viewBox="0 0 6 38" fill="none" xmlns="
                                     http://www.w3.org/2000/svg">
                                        <path d="M3.00012 3L3.00012 35" stroke={updatedFaultData.severity_name === "minor"
                                                ? "#FFC53D"
                                                : faultData.severity_name === "moderate"
                                                ? "#EF5F00"
                                                : faultData.severity_name === "severe"
                                                ? "#CE2C31"
                                                : "#D9D9D9"} stroke-width="5" stroke-linecap="round" />
                                    </svg>
                                    <div className='flex flex-col gap-0.5 mt-1'>
                                            <Typography variant="label-02-s">
                                            {capitalizeWords(updatedFaultData.defect_name)}
                                            </Typography>
                                            <Typography variant="paragraph-xs" mono color={"secondary"}>
                                            {moment(updatedFaultData.time).format("DD/MM/YYYY hh:mm:ss A")}
                                            </Typography>
                                            </div>
                                            </div>
                                
                                            <Status
                                            lessHeight
                                            style={{
                                                color: "#FFFFFF",
                                            
                                                textAlign: "center",
                                            }}
                                            colorbg={ updatedFaultData.severity_name === "minor"
                                            ? "warning01-alt"
                                            : faultData.severity_name === "moderate"
                                            ? "warning02-alt"
                                            : faultData.severity_name === "severe"
                                            ? "error-alt"
                                            : ""}
                                            name={updatedFaultData.severity_name}
                                            />
                                        </div>

                                        <div className="flex items-baseline gap-1 py-1">
                                            <div className="flex-shrink-0 w-[150px]">
                                            <Typography
                                                className="whitespace-nowrap flex-shrink-0"
                                                variant="paragraph-xs" color={"secondary"}
                                                value="Observations"
                                            />
                                            </div>
                                            <div>
                                                    <Typography color="secondary" value="-" /> 
                                                </div>
                                            <div className="break-all">
                                            <Typography
                                              variant="paragraph-xs" color={"secondary"}
                                                value={updatedFaultData.observation}
                                            />
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-1 py-1">
                                            <div className="flex-shrink-0 w-[150px]">
                                            <Typography
                                                className="whitespace-nowrap flex-shrink-0"
                                                variant="paragraph-xs" color={"secondary"}
                                                value="Recommendations"
                                            />
                                            </div>
                                            <div>
                                                    <Typography color="secondary" value="-" /> 
                                                </div>
                                            <div className="break-all">
                                            <Typography
                                               variant="paragraph-xs" color={"secondary"}
                                                value={updatedFaultData.action_recommended}
                                            />
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-1 py-1">
                                            <div className="flex-shrink-0 w-[150px]">
                                            <Typography
                                                className="whitespace-nowrap flex-shrink-0"
                                                variant="paragraph-xs" color={"secondary"}
                                                value="Remarks"
                                            />
                                            </div>
                                            <div>
                                                    <Typography color="secondary" value="-" /> 
                                                </div>
                                            <div className="break-all">
                                            <Typography
                                               variant="paragraph-xs" color={"secondary"}
                                                value={updatedFaultData.remarks}
                                            />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 py-1">
                                        <div className="flex-shrink-0 w-[150px]">
                                            <Typography
                                                className="whitespace-nowrap"
                                                variant="paragraph-xs" color={"secondary"}
                                                value="Status"
                                            />
                                        </div>
                                        <div>
                                                    <Typography color="secondary" value="-" /> 
                                                </div>
                                        <div className="flex items-center">
                                            {updatedFaultData && updatedFaultData.remarks && updatedFaultData.remarks.length > 0 ? (
                                                <Typography
                                                variant="paragraph-xs" color={"secondary"}
                                                    value="Acknowledged"
                                                />
                                            ) : (
                                                <Typography
                                                variant="paragraph-xs" color={"secondary"}
                                                    value="Yet to Acknowledge"
                                                />
                                            )}
                                        </div>
                                    </div>
                                      

                                        <div style={{display:"flex", alignItems:"center", backgroundColor: "#F4F4F4",  height:"32px", borderRadius:"8px", padding:"8px"}}>
                                        <Instrument />
                                        <Typography variant="paragraph-xs"  color={"secondary"} style={{marginLeft:"4px"}} >
                                            {updatedFaultData.instrument_name
                                            .split('-')
                                            .slice(-2)
                                            .join(' - ')
                                            .trim()}
                                        </Typography>
                                        <div className="text-Border-border-100 ml-2">|</div> 
                                        <Axis  width={16} height={16} style={{marginLeft:"8px"}}/>
                                        <div className='text-Border-border-100 ml-2' >
                                            {updatedFaultData.key}
                                        </div>
                                        <div className='text-Border-border-100 ml-2'>|</div>
                                        <Typography variant="paragraph-xs"  color={"secondary"} style={{marginLeft:"8px"}} >
                                            {updatedFaultData && (matchedAmplitude ? matchedAmplitude.title : updatedFaultData.amplitude)}{" : "}{updatedFaultData?.amplitudeValues || '-'}
                                            </Typography>
                                        <div className="flex items-center ml-auto gap-2">
                                            <User style={{ width: "16px", height: "16px" }} />
                                            <Typography  variant="paragraph-xs" color={"secondary"}>
                                            {capitalizeWords(updatedFaultData.analyst)}
                                            </Typography>
                                        </div>
                                        </div>
                                        </div>
                                    ) : (
                                        <Typography variant="base-body-01" color="red" className="mt-4">
                                        No fault detected in the last 7 days
                                        </Typography>
                                    )}
                                    </KpiCards>
                                </div>
                                </KpiCards>
                            )}
                            </Grid>
                            </Grid>
                            </div>
                            <div className="w-1/3  h-[82vh]" >
                            <KpiCards >
                            <Typography variant="heading-02-xs" color="secondary">{props.selectedAsset.asset.name}</Typography>
                            <div
                            style={{
                              
                                position: "relative", 
                                display: "flex", 
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column", 

                            }}
                            >
                            {assetImages && assetImages.length > 0 ? (
                                            <div className="flex items-center gap-4">
                                            {assetImages.length > 1 && (
                                                <React.Fragment>
                                                <button
                                                    style={{
                                                        fontSize: "2rem",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        zIndex: 1,
                                                        color: CurTheme === "dark" ? "#FFFFFF" : "#000000"
                                                    }}
                                                    onClick={() => handlePrevImage(props.selectedAsset.asset.id)}
                                                >
                                                    &#8249;
                                                </button>
                                                </React.Fragment>
                                            )}
                                            <div style={{ position: "relative", overflow: "hidden" }}>
                                                
                                                
                                                <div className="h-[340px] w-[340px] flex items-center justify-center" style={{  overflow: "hidden", marginTop:"20px" }}>
                                                    <ImageNDL
                                                        src={assetImages[currentImageIndex[props.selectedAsset.asset.id]]}
                                                        width="100%"
                                                        height="340px"
                                                        alt={"original"}
                                                        style={{ height: "340px", width:"340px", objectFit: "cover",borderRadius:"6px"}} // Maintain height and cover aspect
                                                    />
                                                </div>

                                                
                                            </div>
                                            {assetImages.length > 1 && (
                                                <React.Fragment>
                                                    <button
                                                        style={{
                                                            fontSize: "2rem",
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            zIndex: 1,
                                                            color: CurTheme === "dark" ? "#FFFFFF" : "#000000"
                                                        }}
                                                        onClick={() => handleNextImage(props.selectedAsset.asset.id)}
                                                    >
                                                        &#8250;
                                                    </button>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        ) : (
                                            <DefaultAsset style={{ height: "100%", width: "100%" }} />
                                        )}

                            {assetImages && assetImages.length > 1 && (
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                {assetImages.map((_, index) => (
                                    <span
                                    key={index}
                                    onClick={() => handleDotClick(props.selectedAsset.asset.id, index)}
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        margin: "0 5px",
                                        borderRadius: "50%",
                                        backgroundColor:
                                        currentImageIndex[props.selectedAsset.asset.id] === index ? "#646464" : "#E0E0E0",
                                        cursor: "pointer",
                                    }}
                                    ></span>
                                ))}
                                </div>
                            )}
                            </div>
                            <div className="bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark" style={{ padding: "20px", marginTop:"8px", borderRadius:"16px" }}>
                            {props.insType === 2 && (
                            <div className="flex justify-between items-center w-full mb-4">
                                {allConnected ? 
                                <Typography className="whitespace-nowrap" variant="label-02-s"color="secondary" value={"Connection"} />   :
                                <Typography className="whitespace-nowrap"  variant="label-02-s" color="secondary" value={"Connection - " + `${activeInstrumentsCount}/${instrumentID && instrumentID.length}`} />   
                                }
                                <Tag
                                lessHeight
                                style={{
                                    color: "#FFFFFF",
                                    textAlign: "center",
                                    marginBottom: "4px", 
                                }}
                                colorbg={allConnected ? "success-alt" : "error-alt"}
                                name={allConnected ? "Active" : "Inactive"}
                            />
                            </div>
                            )}
                            <div className="flex justify-between items-center w-full mb-4">
                                <Typography className="whitespace-nowrap"  variant="label-02-s" color="secondary" value={"Asset Health"} />
                                <Tag
                                lessHeight
                                    style={{
                                        color: "#FFFFFF",
                                        textAlign: "center",
                                    }}
                                    // colorbg={allConnected ? "success-alt" : "warning02-alt"}

                                    colorbg={ props.selectedAsset.asset.status_type === "Critical"
                                    ? "error-alt"
                                    : props.selectedAsset.asset.status_type === "Warning"
                                    ?  "warning02-alt"
                                    : "success-alt"}
                                    name={props.selectedAsset.asset.status_type || "Normal"} 
                                    />
                            </div>
                            <div className="flex justify-between items-center w-full mb-4">
                                <Typography className="whitespace-nowrap"  variant="label-02-s" color="secondary" value={"Machine ISO Class"} />
                                <Typography className="whitespace-nowrap" variant="paragraph-xs"  style={{marginRight:"30px"}}value={insClass} />
                            </div>
                            {props.insType === 2 ? (
                                            <div className="flex justify-between items-center w-full mt-4">
                                                  <div className="w-[200px]">
                                                <Typography className="whitespace-nowrap"  variant="label-02-s"   color="secondary"   value={"Latest Alarm"} />
                                               
                                               </div>
                                               <div className="ml-8">
                                                <Typography
                                                    className="whitespace-nowrap"
                                                    variant="paragraph-s"
                                                    mono
                                                    value={
                                                        latestAlertData ? (
                                                            <div>
                                                                {latestAlertData.alert_level}
                                                                {" @ " + moment(latestAlertData.value_time).format("DD/MM/YYYY hh:mm:ss A")}
                                                            </div>
                                                        ) : "No Alarm"
                                                    }
                                                />
                                                </div>
                                              
                                            </div>
                                        ) : (
                                            <div className="flex  items-center mt-4">
                                                  <div className="flex-1 pr-2">
                                                <Typography className="whitespace-nowrap"  variant="label-02-s"   color="secondary"  value={"Last Inspection"} />
                                                </div>
                                                <div className="flex-2 pr-2">
                                                <Typography
                                                    className="whitespace-nowrap"
                                                    variant="paragraph-s"
                                                    mono
                                                    value={
                                                        fetchOfflineData  && fetchOfflineData[0] ? moment(fetchOfflineData[0].time).format("DD/MM/YYYY") : "No Details"
                                                    }
                                                />
                                                </div>
                                            </div>
                                        )}
                            </div>
                                </KpiCards>
                        
                                </div>
                            </div>
                           
                        
                            )}
                            {tabValue === 1 && (
                                <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
                                    <Grid container spacing={2}>
                                    <Grid item xs={8} sm={8}>
                                    <EnhancedTable
                                        downloadHeadCells={tableheadCells}
                                        downloadabledata={downloadabledata}
                                        headCells={headCellsMain}
                                        data={mainLogdata}
                                        download={true}
                                        search={true}
                                        rawdata={mainLogData}
                                        actionenabled={true}
                                        enableDelete={true}
                                        enableEdit={true}
                                        handleEdit={(id, value) => EditLog(setEditId(value.id), setEditLog(value))}
                                        handleDelete={(id, value) => DeleteLog(id, value)}
                                        buttonpresent={"New Log"}
                                        Buttonicon={Plus}
                                        onClickbutton={handleOpenPopUp}
                                        rowSelect={true}
                                        checkBoxId={'S.No'}
                                    />
                                    {/* </KpiCards> */}
                                    </Grid>
                                    <Grid item xs={4} sm={4} style={{marginLeft:"8px"}}>
                                    <KpiCards style={{ height: "896px" }}>
                                    <Typography variant="heading-01-xs" color="secondary" >{capitalizeWords(props.selectedAsset.asset.name)}</Typography>
                                    <div
                                        style={{
                                           
                                            position: "relative",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column",
                                            
                                        }}
                                    >
                                        
                                        {assetImages && assetImages.length > 0 ? (
                                            <div className="flex items-center gap-4">
                                            {assetImages.length > 1 && (
                                                <React.Fragment>
                                                <button
                                                    style={{
                                                        fontSize: "2rem",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        zIndex: 1,
                                                    }}
                                                    onClick={() => handlePrevImage(props.selectedAsset.asset.id)}
                                                >
                                                    &#8249;
                                                </button>
                                                </React.Fragment>
                                            )}
                                            <div style={{ position: "relative",  overflow: "hidden" }}>
                                                
                                                
                                                <div className="h-[340px] w-[340px] flex items-center justify-center mt-4" style={{  overflow: "hidden" }}>
                                                    <ImageNDL
                                                        src={assetImages[currentImageIndex[props.selectedAsset.asset.id]]}
                                                        width="100%"
                                                        height="340px"
                                                        alt={"original"}
                                                        style={{ height: "340px", width:"340px", objectFit: "cover", borderRadius:"6px" }} 
                                                    />
                                                </div>

                                                
                                            </div>
                                            {assetImages.length > 1 && (
                                                <React.Fragment>
                                                    <button
                                                        style={{
                                                            fontSize: "2rem",
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            zIndex: 1,
                                                        }}
                                                        onClick={() => handleNextImage(props.selectedAsset.asset.id)}
                                                    >
                                                        &#8250;
                                                    </button>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        ) : (
                                            <DefaultAsset style={{ height: "100%", width: "100%" }} />
                                        )}

                                        {/* Dot Indicators */}
                                        {assetImages && assetImages.length > 1 && (
                                            <div style={{ display: "flex", justifyContent: "center", marginTop:"8px" }}>
                                                {assetImages.map((_, index) => (
                                                    <span
                                                        key={index}
                                                        onClick={() => handleDotClick(props.selectedAsset.asset.id, index)}
                                                        style={{
                                                            width: "8px",
                                                            height: "8px",
                                                            margin: "0 5px",
                                                            borderRadius: "50%",
                                                            backgroundColor:
                                                                currentImageIndex[props.selectedAsset.asset.id] === index ? "#646464" : "#E0E0E0",
                                                            cursor: "pointer",
                                                        }}
                                                    ></span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"  style={{ padding: "20px", marginTop:"8px", borderRadius:"16px" }}>
                                        {props.insType === 2 && (
                                            <div className="flex justify-between items-center w-full mb-4">
                                                <Typography className="whitespace-nowrap" variant="label-02-s"   color="secondary"  value={"Connection - " + `${activeInstrumentsCount}/${instrumentID && instrumentID.length}`} />
                                                <Tag
                                                lessHeight
                                                    style={{
                                                        color: "#FFFFFF",
                                                      
                                                        textAlign: "center",
                                                    }}
                                                    name={allConnected ? "Active" : "Inactive"}
                                                    colorbg={activeInstrumentsCount === instrumentID && instrumentID.length ? "success-alt" : "error-alt"}
                                                />
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center w-full mb-4">
                                            <Typography className="whitespace-nowrap"  variant="label-02-s"   color="secondary"  value={"Asset Health"} />
                                            <Tag
                                            lessHeight
                                                style={{
                                                    color: "#FFFFFF",
                                                    textAlign: "center",
                                                }}
                                                name={props.selectedAsset.asset.status_type || "Normal"} 
                                                colorbg={    props.selectedAsset.asset.status_type === "Critical"
                                                ? "error-alt"
                                                : props.selectedAsset.asset.status_type === "Warning"
                                                ? "warning02-alt"
                                                : "success-alt"}
                                                />
                                        </div>
                                        <div className="flex justify-between items-center w-full ">
                                            <Typography className="whitespace-nowrap"  variant="label-02-s"   color="secondary"  value={"Machine ISO Class"} />
                                            <div className="flex justify-start mr-7">
                                            <Typography className="whitespace-nowrap" variant="paragraph-s" value={insClass} />
                                            </div>
                                            
                                        </div>
                                        {props.insType === 2 ? (
                                            <div className="flex justify-between items-center w-full mt-4">
                                                  <div className="w-[200px]">
                                                <Typography className="whitespace-nowrap"  variant="label-02-s"   color="secondary"   value={"Latest Alarm"} />
                                               
                                               </div>
                                               <div className="ml-4">
                                                <Typography
                                                    className="whitespace-nowrap"
                                                    variant="paragraph-s"
                                                    mono
                                                    value={
                                                        latestAlertData ? (
                                                            <div>
                                                                {latestAlertData.alert_level}
                                                                {" @ " + moment(latestAlertData.value_time).format("DD/MM/YYYY hh:mm:ss A")}
                                                            </div>
                                                        ) : "No Alarm"
                                                    }
                                                />
                                                </div>
                                              
                                            </div>
                                        ) : (
                                            <div className="flex  items-center mt-4">
                                                  <div className="flex-1 pr-2">
                                                <Typography className="whitespace-nowrap"  variant="label-02-s"   color="secondary"  value={"Last Inspection"} />
                                                </div>
                                                <div className="flex-2 pr-2">
                                                <Typography
                                                    className="whitespace-nowrap"
                                                    variant="paragraph-s"
                                                    mono
                                                    value={
                                                        fetchOfflineData  && fetchOfflineData[0] ? moment(fetchOfflineData[0].time).format("DD/MM/YYYY") : "No Details"
                                                    }
                                                />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </KpiCards>

                                    </Grid>
                                    </Grid>
                                    <ModalNDL disableEnforceFocus onClose={() => handleDialogClose()} aria-labelledby="entity-dialog-title" open={model}>
                                    <EditsLog
                                    handleDialogClose={handleDialogClose}
                                     handleSaveFunction={handleSaveFunction}
                                     handleUpdateFunction={handleUpdateFunction}
                                     EditedID ={editId}
                                     EditLog={editLog}
                                    />
                                </ModalNDL>
                                </div>
                            )}
            </div>
            </React.Fragment>
        }
        </React.Fragment>
    )
}