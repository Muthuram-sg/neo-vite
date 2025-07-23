/* eslint-disable no-unused-vars */

/* eslint-disable array-callback-return */
import React, { useEffect, useState, forwardRef, useImperativeHandle, } from "react";
import useTheme from "TailwindTheme";
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState, useRecoilValue } from "recoil";
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import trendsColours from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/trendsColours";
import TreeComponent from "./components/TreeComponent";
import HierarchySearch from "./components/HierarchySearch";
import {
  user,
  defaultHierarchyData,
  selectedmeterExplore,
  selectedMeterName,
  selectedPlant,
  onlineTrendsChipArr,
  assetSelected,
  selectedItem,
  onlineTrendsMetrArr,
  hierarchyvisible,
  exploreRange,
  selectedInterval,
  customdates,
  ExpandedNodeList,
  pinSelected,
  expandedNodeIdHierarchy,
  snackToggle, snackMessage, snackType, MeterReadingStatus,
  alertchartenable,dataForecastenable,normalMode,NormalizeMode,trendLegendView,
  selectedInstrument
} from "recoilStore/atoms";
import { useAuth } from "components/Context";
import { useTranslation } from 'react-i18next';
import moment from "moment";
import commontrends from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/common";
// alert count hooks
import useInstrumentList from 'Hooks/useInstrumentList';
import useMetricsforInstrumentwithID from '../../hooks/useMetricsforInstrumentWithID'
import useFetchMetricAlertsV2 from "../../hooks/usefetchMetricAlertsV2";
import useMeterReadingsV2 from "../../hooks/useMeterReadingsV2"
import useMeterReadingsV1 from "../../hooks/useGetMeterReadingV1"
import useAlertConfigurations from "components/layouts/Alarms/hooks/useGetAlertConfigurations";
import useAlertCount from 'components/layouts/Explore/BrowserContent/hooks/useAlertCounts.jsx';
import useGetGroupMetric from "components/layouts/Settings/MetricsGroup/hooks/useGetGroupMetric.jsx"

import * as XLSX from 'xlsx';

const BrowserHierarchy = forwardRef((props, ref) => {

  const theme = useTheme();

  const { t } = useTranslation();
  const { HF } = useAuth();
  const [defaulthierarchy] = useRecoilState(defaultHierarchyData);
  const [, setSelectedExploreInstrument] = useRecoilState(selectedInstrument)

  const [treeData, setTreeData] = useState([]);
  const [currUser] = useRecoilState(user);
  const [nodeIDArray, setNodeIDArray] = useState([]);
  const [, setSelectedMeter] = useRecoilState(selectedmeterExplore);
  const [, setSelectedMeterVal] = useRecoilState(selectedMeterName);
  const [selectedHierarchy, setSelectedHierarchy] = useState({});
  const [headPlant] = useRecoilState(selectedPlant);
  const [meterReadings, setMeterReadings] = useState([]);
  const [, setTempProps] = useState([]);
  const [allMetersList, setAllMetersList] = useState([]);
  const [selectedTree, setSelectedTree] = useState([]);
  const [parametersOfMeter, setParametersOfMeter] = useState([]);
  const [defaultExpandNodeList, setDefaultExpandNodeList] = useRecoilState(ExpandedNodeList);
  const [, setSelectedChipArr] = useRecoilState(onlineTrendsChipArr);
  const [, setSelectedAsset] = useRecoilState(assetSelected);
  const [, setSelectedItem] = useRecoilState(selectedItem);
  const [loaderStatus, setLoaderStatus] = useState(true);
  const [fetchValuesStatus, setfetchValuesStatus] = useState(false)
  const [selectedMeterAndChip, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
  const [pinnedMeter, setpinnedMeter] = useState([])
  const [pinnedNodeList, setPinnedNodeList] = useState([])
  const [pintreeData, setPinTreeData] = useState([]);
  const [pinstate, setPinState] = useState(false)
  const [searchNodeList, setSearchNodeList] = useState([])
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [search, setSearch] = useState("");
  const [meterstatus, setMeterReadingStatus] = useRecoilState(MeterReadingStatus)
  const [, setShowHierarchy] = useRecoilState(hierarchyvisible)
  const [selectedRange, setselectedRange] = useRecoilState(exploreRange);
  const [selectedIntervals] = useRecoilState(selectedInterval);
  const [customdatesval,] = useRecoilState(customdates);
  const [now] = useState(new Date());
  const [InstruArr, setInstruArr] = useState([]);
  const [MetList, setMetList] = useState([]);
  const [ExcelData, setExcelData] = useState([]);
  const { alertCountData, getAlertCount } = useAlertCount();
  const [, setPinSelected] = useRecoilState(pinSelected);
  const [expandedNodeIDArrays, setExpandedNodeIDArrays] = useRecoilState(expandedNodeIdHierarchy);
  const [, setalertconfig]= useRecoilState(alertchartenable);
  const forecastconfig = useRecoilValue(dataForecastenable);
  const [, setGraphMode] = useRecoilState(normalMode);
  const [, setNormalizeMode] = useRecoilState(NormalizeMode)
  const [legendView, setLegendView] = useRecoilState(trendLegendView);
  const [openExplore,setOpenExplore] = useState(null)
  const [groupData, setgroupData] = useState([])
  const { instrumentListData, instrumentList } = useInstrumentList();
  const {GroupMetricLoading, GroupMetricData, GroupMetricError, getGroupMetrics} = useGetGroupMetric();
  const { metricsforinstrumentLoading, metricsforinstrumentData, metricsforinstrumentError, getMetricsforInstrumentwithID } = useMetricsforInstrumentwithID()
  const { metricAlertsV2Loading, metricAlertsV2Data, metricAlertsV2Error, getfetchMetricAlertsV2 } = useFetchMetricAlertsV2()
  const { meterReadingsV2Loading, meterReadingsV2Data, meterReadingsV2Error, getMeterReadingsV2 } = useMeterReadingsV2()
  const { meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error, getMeterReadingsV1 } = useMeterReadingsV1()
  const { alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror, getAlertConfigurations } = useAlertConfigurations();


  useEffect(() => {

    let tableHead = ["Instrument", "TimeStamp", ...MetList]
    let tablearray = []
    InstruArr.forEach(val => {
      let obj = {};
      tablearray.push(obj);
    
      tableHead.forEach((val2, i) => {
        let metVal = val.metrics ? val.metrics.filter(x => x.metric_name === val2) : [];
        let TimeArr = [];
        if (val2 === 'TimeStamp') {
          TimeArr = val.metrics.filter(x => x.time);
        }
    
        if (val2 === 'Instrument') {
          obj[val2] = val.InstrumentName;
        } else if (val2 === 'TimeStamp') {
          let TimeVal = [];
          if ((TimeArr.length > 0) && TimeArr[0].time) {
            TimeVal = moment(TimeArr[0].time).format("DD-MM-YYYY " + HF.HMS);
          } else {
            TimeVal = 'NA';
          }
          obj[val2] = TimeVal;
        } else {
          if (metVal.length > 0) {
            obj[val2] = metVal[0].meterValue1 ? metVal[0].meterValue1 : '---';
          }
          else
            obj[val2] ='--'
        }
      });
    });
    
    setExcelData(tablearray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InstruArr])

  useEffect(()=>{
    if(!loaderStatus){
    localStorage.setItem("openExploreFromAH", "")
    }
  },[loaderStatus])

  function hierarchyTable(child, arr) {
    child.map(val => {
      if (val.type === 'instrument') {
        arr.push({
          InstrumentName: val.name,
          metrics: val.children && val.children !== undefined ? val.children : []
        })
        setInstruArr([...arr])

      } else {
        if (val.children) {
          hierarchyTable(val.children, arr)
        }
      }
    })
    return arr
  }
  let arrmet = []
  function metricTable(child) {
    child.map(val => {
      if (val.children) {
        metricTable(val.children)
      } else {
        if (val.metric_name) {
          arrmet.push(val.metric_name)
          let uniqmet = [...new Set([...arrmet, ...MetList].map(item => item))];
          setMetList(uniqmet)
        }
      }
    })
  }


  useEffect(() => {

    if (search === '' && defaultExpandNodeList.length === 0) {
      setShowHierarchy(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    if (GroupMetricData && !GroupMetricLoading && !GroupMetricError) {
        const filteredData = GroupMetricData.filter(val => {
            if (val.access === "public") {
                return true;
            }

            if (val.access === "shared") {
                const isUserShared = val.shared_users.some(user => user.id === currUser.id);
                return val.updated_by === currUser.id || isUserShared;
            } else {
                return val.updated_by === currUser.id;
            }
        });

        setgroupData(filteredData);
    }
}, [GroupMetricData, GroupMetricLoading, GroupMetricError, currUser.id]);


  useEffect(() => {
    setPinState(false)
    setSearch('')
    setNodeIDArray([])
  }, [selectedHierarchy])


  useEffect(() => {
    setNodeIDArray([])
    getAlertConfigurations(headPlant.id)
    getGroupMetrics(headPlant.id)
    instrumentList(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant.id])
  useEffect(() => {
    const { frmDate, toDate } = commontrends.getFromandToDate(selectedRange, customdatesval.StartDate, customdatesval.EndDate, headPlant)
    getAlertCount(headPlant.schema, headPlant.id, frmDate, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange])

  useEffect(() => {
    generateTree(selectedTree, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertCountData])



  useEffect(() => {
    setLoaderStatus(false)
    setfetchValuesStatus(true)
    if (meterstatus && headPlant.id !== '') {
      getMeterReadingsV2(headPlant.schema,headPlant.id)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meterstatus])


  let reportingMetricArr = [];

  useImperativeHandle(ref, () =>
  (
    {
      expandAll: () => {

        if (pinstate) { setPinnedNodeList(nodeIDArray) }
        if (!pinstate && search === '') {
          expandAll('expand')
        }
        if (search !== '') { setDefaultExpandNodeList(searchNodeList) }
      },
      collapseAll: () => {
        if (pinstate) { setPinnedNodeList([]) }
        if (!pinstate && search === '') { expandAll('collapse') }
        if (search !== '') { setDefaultExpandNodeList([]) }
      },
      downloadTable: () => {
        if (!fetchValuesStatus) {
          downloadExcel(ExcelData, "Hierarchy_Intruments")
        } else {
          setSnackMessage(t("Please wait...to fetch data to download"))
          setType("warning");
          setOpenSnack(true)
        }

      }
    }
  )
  )

  const downloadExcel = (data, name) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name + ".xlsx");
  };

  function exists(id, metric_val) {
    return selectedMeterAndChip.some(car => car.id === id && car.metric_val === metric_val)
  }
  const addMetricPin = (e, val) => {
    let pinnedNodeList1 = []
    let existedMeter = []
    existedMeter.push(val)
    // pinnedNodeList1.push(props.nodeId)
    pinnedNodeList1.push(val.nodeId)
    setPinnedNodeList(pinnedNodeList1)
    setpinnedMeter(existedMeter)
    setPinState(true)
    //setPinTreeData(props.item)
    setPinTreeData(val)


  }

  const removeMetricPin = (e, val) => {
    let existedMeter = [...pinnedMeter]
    let pinnedNodeList1 = [...pinnedNodeList]
    let newmeters = existedMeter.filter(function (item) {
      return item !== val
    })

    pinnedNodeList1.splice(pinnedNodeList.indexOf(props.nodeId))
    setPinnedNodeList(pinnedNodeList1)
    setpinnedMeter(newmeters)
    setPinState(false)
  }

  function cryptoRandom() {
    let array = new Uint32Array(1)
    return window.crypto.getRandomValues(array)[0] / Math.pow(2, 32);
  }

  const getInterval = (val) => {
    if(val.metric_data_type === 4 || val.metric_data_type === 5)
      return 15 
    return (val.frequency / 60).toFixed(4) <= Number(selectedIntervals) ? selectedIntervals : parseFloat((val.frequency / 60).toFixed(4));
  }

  const transformGroupData = (groupData, instrumentListData, val) => {
    return groupData && groupData.flatMap(group => {
        return Object.entries(group.metrics).flatMap(([metricId, metricData]) => {
            const instrument = instrumentListData && instrumentListData.length > 0 && instrumentListData.find(inst => inst.id === metricId);
            const instrumentName = instrument ? instrument.name : group.grpname;

            return Object.values(metricData.metrics).map((metricObj) => {
                // Create limit markers only if limits are non-zero
                const limits = (group.upper_limit !== 0 || group.lower_limit !== 0) ? {
                    upper: group.upper_limit !== 0 ? {
                        id: `${metricObj.name.replace(/[ ()\/]/g, '-')}-${metricId}-upper`,
                        y: group.upper_limit,
                        borderColor: '#FF0D00',
                        seriesIndex: 0,
                        label: {
                            borderColor: '#FF0D00',
                            style: {
                                color: '#fff',
                                background: '#FF0D00',
                            },
                            text: `Upper Limit (${group.grpname} - ${group.upper_limit})`
                        }
                    } : undefined,
                    lower: group.lower_limit !== 0 ? {
                        id: `${metricObj.name.replace(/[ ()\/]/g, '-')}-${metricId}-lower`,
                        y: group.lower_limit,
                        borderColor: '#FF9500',
                        seriesIndex: 0,
                        label: {
                            borderColor: '#FF9500',
                            style: {
                                color: '#fff',
                                background: '#FF9500',
                            },
                            text: `Lower Limit (${group.grpname} - ${group.lower_limit})`
                        }
                    } : undefined
                } : undefined;

                return {
                    key: metricObj.key,
                    metric_name: metricObj.name,
                    unit: metricObj.name.toLowerCase().includes("voltage") ? "V" : "mm/s",
                    metric_id: metricId,
                    meterValue1: 237,
                    nodeId: parseInt(group.id.split('-')[0], 16) % 1000,
                    time: new Date().toISOString(),
                    category: 1,
                    instrument_name: group.grpname,
                    hierarchy: headPlant.name + "_All Metrics Group_" + instrumentName,
                    metric_data_type: 3,
                    frequency: 300,
                    alarmcolor: "#FF9500",
                    alarmbg: "#FFEACC",
                    alarmLevel: "",
                    alarmTime: "",
                    enable: true,
                    key_id: 1,
                    alertenabled: false,
                    forecastenable: false,
                    isForecast: null,
                    test: 1,
                    connectloss: 1,
                    expanded: false,
                    group: true,
                    ...(limits && { limits }) // Add limits only if they exist
                };
            });
        });
    });
};

  const addMetricToDashboard = async (val) => {
    setSelectedExploreInstrument([])
    let result = transformGroupData(groupData, instrumentListData, val);
    result = result ? result.filter(item => item.instrument_name === val.metric_name) : [];      
  
    if (result && result.length > 0) {
      val = result[0];
    }
   
    let test = exists(val.metric_id, val.key);
    const { frmDate, toDate } = commontrends.getFromandToDate(selectedRange, customdatesval.StartDate, customdatesval.EndDate, headPlant);

    result = result.map(item => {
      let index = Math.floor(cryptoRandom() * trendsColours[1].length);
      let metricColour = trendsColours[1][index]; 
      return {
        category_id: item.category || 1,
        id: item.metric_id,
        instrument_name: item.instrument_name,
        metric_title: item.metric_name,
        metric_val: item.key,
        selectedIndex: item.selectedIndex || 0,
        unit: item.unit,
        hierarchy: item.hierarchy,
        colour: metricColour, 
        checked: item.checked || false,
        meter_value: `${item.meterValue1} ${item.unit}`, 
        time: item.time,
        alarmcolor: item.alarmcolor,
        alarmbg: item.alarmbg,
        range: selectedRange,
        frmDate: moment(frmDate).format("YYYY-MM-DDTHH:mm:ssZ"),
        toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ssZ"),
        interval: getInterval(item),
        frequency: (item.frequency / 60).toFixed(4),
        metric_data_type: item.metric_data_type,
        alertenabled: item.alertenabled || false,
        forecastenable: item.forecastenable || false,
        isForecast: item.isForecast || null,
        group: true,
        limits: item.limits
      };
    });    
    const uniqueResult = result.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id && t.metric_val === item.metric_val)
    );
    let existedMeter = selectedMeterAndChip && selectedMeterAndChip.length > 0 ? [...selectedMeterAndChip] : [...uniqueResult];
    if (
      existedMeter.some(m => m.metric_data_type !== val.metric_data_type) &&
      (
        ((existedMeter.some(p => p.metric_data_type === 4) || existedMeter.some(p => p.metric_data_type === 5)) &&
        (val.metric_data_type !== 4 && val.metric_data_type !== 5)) ||
        ((existedMeter.some(p => p.metric_data_type === 1) || existedMeter.some(p => p.metric_data_type === 2) || existedMeter.some(p => p.metric_data_type === 3)) &&
        (val.metric_data_type === 4 || val.metric_data_type === 5))
      )
    ) {
      setSnackMessage(t("Please clear the current selected trend"));
      setType("warning");
      setOpenSnack(true);
    } else {
      if (!test) {
        let index = Math.floor(cryptoRandom() * trendsColours[1].length);
        let metricColour = trendsColours[1][index];
        const { frmDate, toDate } = commontrends.getFromandToDate(selectedRange, customdatesval.StartDate, customdatesval.EndDate, headPlant);
  
        let item = {
          category_id: val.category,
          id: val.metric_id,
          instrument_name: val.instrument_name,
          metric_title: val.metric_name,
          metric_val: val.key,
          selectedIndex: 0,
          unit: val.unit,
          hierarchy: val.hierarchy,
          colour: metricColour,
          checked: false,
          meter_value: val.meterValue1 + " " + val.unit,
          time: val.time,
          alarmcolor: val.alarmcolor,
          alarmbg: val.alarmbg,
          range: selectedRange,
          frmDate: moment(frmDate).format("YYYY-MM-DDTHH:mm:ssZ"),
          toDate: moment(toDate).format("YYYY-MM-DDTHH:mm:ssZ"),
          interval: getInterval(val),
          frequency: (val.frequency / 60).toFixed(4),
          metric_data_type: val.metric_data_type,
          alertenabled: false,
          forecastenable: false,
          isForecast: val.isForecast,
        };
        if(!(result && result.length > 0)){
        existedMeter.push(item);
        }
      } else {
        let index = existedMeter.findIndex(e => e.id === val.metric_id && e.metric_val === val.key);
        existedMeter[index] = { ...existedMeter[index], meter_value: val.meterValue1 + " " + val.unit };
      }
    }
  
    if(existedMeter && (existedMeter.length <= 0) && result && result.length > 0){
      existedMeter = result 
    }   
    let tempArr = existedMeter.map(x => x.metric_val);
    localStorage.setItem('selectedChipArr', JSON.stringify(existedMeter));
    setalertconfig(false);
    setselectedMeterAndChip(existedMeter);
    setSelectedChipArr(tempArr);
    setSelectedExploreInstrument([])
  };  

  const removeMetricfromDashboard = (val) => {
    let existingMeters = [...selectedMeterAndChip]
    const isUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    if (isUUID(val.id) && val.metric_name === selectedMeterAndChip[0].instrument_name) {
      existingMeters = []
      let tempArr = existingMeters.map(x => x.metric_val)
      localStorage.setItem('selectedChipArr', JSON.stringify(existingMeters));
      setselectedMeterAndChip(existingMeters)
      setSelectedChipArr(tempArr)
    }
    let eindex = existingMeters.findIndex(e => e.id === val.metric_id && e.metric_val === val.key);
    let isForecastMetric = existingMeters[eindex].forecastenable;
    existingMeters.splice(eindex, 1)
    let tempArr = existingMeters.map(x => x.metric_val)
    localStorage.setItem('selectedChipArr', JSON.stringify(existingMeters));
    setselectedMeterAndChip(existingMeters)
    setSelectedChipArr(tempArr)
    setPinSelected(false)
    if(forecastconfig && isForecastMetric)
      setGraphMode(true);
    if(existingMeters.length === 0){
      setNormalizeMode(false)
    }

    let toggledLegend = [...legendView];console.log(val)
    const key = `${val.key}-${val.metric_id}-${val.metric_name}`;console.log(toggledLegend,key)
    if (toggledLegend.includes(key)) {
      toggledLegend = toggledLegend.filter(tval => tval !== key)
    }
    console.log(toggledLegend)
    setLegendView(toggledLegend);
   
  }

  const meterNameLocal = (val) => {
    setSelectedMeterVal(val)
    localStorage.setItem('MetricName', JSON.stringify(val));
  }


  const meterSelected = (e, data) => {
    // console.log(props,"propsdata")
    if (props && props.type === "entity") {
      setSelectedItem(props);
    }
    else {
      setSelectedItem({});
    }

    setSelectedAsset(props.meterValue)
    localStorage.setItem('assetSelected', props.meterValue)
    if (props.nodeId !== "") {
      let nodeExpandStatus = defaultExpandNodeList.includes(parseInt(props.nodeId))
      if (!nodeExpandStatus) {
        if (data !== undefined) {
          setSelectedMeter([])
          if (data.length <= 0) {
            meterNameLocal("")
          }
          let hierarchyDataArr = selectedHierarchy.toString() !== "" && selectedHierarchy !== undefined && selectedHierarchy.actualname ? selectedHierarchy : defaulthierarchy[0].hierarchy.hierarchy[0];
          if (hierarchyDataArr.type === "instrument") {
            reportingMetricArr.push(hierarchyDataArr.actualname)
            let tempArr = [];
            tempArr.push(hierarchyDataArr.name)
            localStorage.setItem("selectedChildrenObj", JSON.stringify(tempArr))
          } else {
            let selectedEntityArr = getMeterList(hierarchyDataArr, data);
            if (selectedEntityArr !== undefined && selectedEntityArr.type === "instrument") {
              reportingMetricArr = []
              reportingMetricArr.push(selectedEntityArr.actualname)
              
              localStorage.setItem("selectedChildrenObj", JSON.stringify([selectedEntityArr]))
            } else if (selectedEntityArr !== undefined && selectedEntityArr.children !== undefined) {
              let tempChildObjct = []
              selectedEntityArr.children.forEach(function (a) {
                if (a.type === "instrument") {
                  //to get all meters below direct parent mode
                  reportingMetricArr.push(a.actualname)
                  tempChildObjct.push(a)
                }
              })
              localStorage.setItem("selectedChildrenObj", JSON.stringify(tempChildObjct))
            } 
          }

          localStorage.setItem('selectedMeterExplore', reportingMetricArr);
        }


      }
    }

  }

  function getMeterList(object, string) {
    if (!object || typeof object !== 'object') return;
    return Object.values(object).some(v => {
      if (v === string) return object;
      return getMeterList(v, string);
    });
  }
  

  useEffect(() => {
    if (props.selectedHierarchy !== "" && props.selectedHierarchy !== undefined && Object.keys(props.selectedHierarchy).length > 0) {
      setLoaderStatus(true)
      if (defaultExpandNodeList.length === 0) {
        let tempNodeDefaultArr = [1]
        setDefaultExpandNodeList(tempNodeDefaultArr)
      }
      if (props.selectedHierarchy !== "" && props.selectedHierarchy !== undefined && props.selectedHierarchy.id) {
        let tempProps1 = JSON.parse(JSON.stringify(props.selectedHierarchy));

        generateTree(tempProps1, []);
        setSelectedTree(tempProps1)
        getChildMeters(tempProps1)
        setSelectedHierarchy(tempProps1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedHierarchy])

  const getChildMeters = (tempProps) => {
    let tempArrTest111 = [];
    const indfinder = (a) => {
      a.forEach(function (b) {
        if (b.type === "instrument") {
          tempArrTest111.push(b.id)
        }
      })
      a.forEach(function (b) {
        if (b.hasOwnProperty("children") && b.children.length > 0) {
          indfinder(b.children)
        }
      })
    }
    tempProps.children.forEach(function (a) {
      if (a.hasOwnProperty("children") && a.children.length > 0) {
        indfinder(a.children)
      }
    })
    if (tempArrTest111.length > 0) {
      setAllMetersList(tempArrTest111)

    }
  };
  useEffect(() => {

    getMetricsforInstrumentwithID(allMetersList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMetersList])


  useEffect(() => {
    if (!metricsforinstrumentLoading && metricsforinstrumentData && !metricsforinstrumentError) {
      setParametersOfMeter(metricsforinstrumentData)
      setfetchValuesStatus(true)
      getMeterReadingsV2(headPlant.schema,headPlant.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricsforinstrumentLoading, metricsforinstrumentData, metricsforinstrumentError])





  const getiidparam = () => {
    let iid = '';
    let param = '';
    let uniqueMeter;
    let paramArr = parametersOfMeter.map(function (el) { return el.metric.name; })
    if (allMetersList && Array.isArray(allMetersList)) {
      uniqueMeter = [...new Set(allMetersList)];
      iid = uniqueMeter.join(',');
    }
    if (paramArr && Array.isArray(paramArr)) {
      let uniqueParam = [...new Set(paramArr)];
      param = uniqueParam.map(x => x.split("-")[0]).join(',');
    }

    return [iid, param, uniqueMeter]
  }


  useEffect(() => {
    let result = getiidparam()
    const iid = result[0]
    const param = result[1]
    const uniqueMeter = result[2]
    if (!meterReadingsV2Loading && meterReadingsV2Data && !meterReadingsV2Error) {
      console.log(meterReadingsV2Data,"meterReadingsV2Data")
      let metricdata = []
      uniqueMeter.forEach((instrument) => {

        if (meterReadingsV2Data[instrument]) {
          Object.keys(meterReadingsV2Data[instrument]).forEach((key) => {

            metricdata.push({
              "iid": instrument, "key": key, "time": meterReadingsV2Data[instrument][key].time, "value": meterReadingsV2Data[instrument][key].value, "alarmcolor": "#bbbbbb",
              "alarmbg": ""
            })
          })
        }
      })


      if (metricdata.length === 0) {
        getMeterReadingsV1(headPlant.schema, iid, param)
      }
      else {
        setMeterReadings(metricdata)
        getfetchMetricAlertsV2(headPlant.schema, iid, param)
      }
      setfetchValuesStatus(false);
    }
    else if (!meterReadingsV2Loading && meterReadingsV2Error) {
      setfetchValuesStatus(false);
      setSnackMessage(t("No data for Metrics"))
      setType("error");
      setOpenSnack(true)
    }



    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meterReadingsV2Loading, meterReadingsV2Data, meterReadingsV2Error])

  const getAlarmColor = (alerts) => {
    if(alerts.alert_level === "critical")
      return "#FF0D00";
    if(alerts.alert_level === "warning")
      return "#FF9500";
    return alerts.alert_level === "ok" ? theme.colorPalette.primary : "#bbbbbb";
  }

  const getAlarmBg = (alerts) => {
    if(alerts.alert_level === "critical")
      return "#FFCFCC";
    if(alerts.alert_level === "warning")
      return "#FFEACC";
    return alerts.alert_level === "ok" ? theme.colorPalette.activeClor : ""
            
  }

  function findNearestObjectByTime(alertData) {
    // Get the current time
    let currentTime = new Date();

    // Initialize variables to store the nearest object and its time difference
    let nearestObject = null;
    let minTimeDifference = Infinity;

    // Iterate through the array
    alertData.forEach(obj => {
        // Parse the time string to Date object
        let objTime = new Date(obj.time);
        
        // Calculate the time difference
        let timeDifference = Math.abs(objTime - currentTime);

        // Update the nearest object if this object's time is closer
        if (timeDifference < minTimeDifference) {
            minTimeDifference = timeDifference;
            nearestObject = obj;
        }
    });

    return nearestObject;
}

  useEffect(() => {
    if ((!metricAlertsV2Loading && metricAlertsV2Data && !metricAlertsV2Error) &&
      (!alertConfigurationsLoading && alertConfigurationsdata && !alertConfigurationserror)) {
      let data = alertConfigurationsdata.filter(e => e.alertType !== "connectivity")
      let alertrules = data.map(item => {
        if (item.instruments_metric && item.instruments_metric.instrument && item.instruments_metric.metric) {
          return { id: item.instruments_metric.instrument.id, metric: item.instruments_metric.metric.name }
        } else {
          return {}
        }
      }

      );
      // console.log(alertrules.filter(x=>x.id === "31001"),'alertrules',metricAlertsV2Data.filter(x=>x.iid === "31001"))
      const filteredalertsdata = metricAlertsV2Data.filter(m => {
        return alertrules.findIndex(a => a.id === m.iid && a.metric === m.key) >= 0
      })
      if (filteredalertsdata.length > 0) {
        let metricdatawithalerts = meterReadings.map((val) => {
          let alerts = filteredalertsdata.filter((item) => item.iid === val.iid && item.key === val.key)
          if (alerts.length > 0) {
          let nearestObject = findNearestObjectByTime(alerts);  
          let alarmcolor = getAlarmColor(nearestObject);
            let alarmbg = getAlarmBg(nearestObject);
            return Object.assign({}, val, { alarmcolor: alarmcolor, alarmbg: alarmbg, alert_level: nearestObject.alert_level, alert_time: nearestObject.time })
          }
          else if(alertrules.findIndex(a => a.id === val.iid && a.metric === val.key)>= 0){
            return Object.assign({}, val, { alarmcolor: "#101010", alarmbg: "" })
          } else {
            return Object.assign({}, val, { alarmcolor: "#bbbbbb", alarmbg: "" })
          }
        })
        setMeterReadings(metricdatawithalerts)
        generateTree(selectedTree, metricdatawithalerts,alertrules)

      }
      else {
        generateTree(selectedTree, meterReadings,alertrules)
      }
    } else {
      generateTree(selectedTree, meterReadings,[])
    }
    setfetchValuesStatus(false)
    setMeterReadingStatus(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricAlertsV2Loading, metricAlertsV2Data, metricAlertsV2Error, alertConfigurationsLoading, alertConfigurationsdata, alertConfigurationserror])


  useEffect(() => {
    if (!meterReadingsV1Loading && meterReadingsV1Data && !meterReadingsV1Error) {
      let result = getiidparam()
      const iid = result[0]
      const param = result[1]
      let updatedmeterReadingsData = []
      if (Array.isArray(meterReadingsV1Data.data)) {
        updatedmeterReadingsData = meterReadingsV1Data.data.map((val) => Object.assign({}, val, {
          "alarmcolor": "#bbbbbb",
          "alarmbg": ""
        }))
        setMeterReadings(updatedmeterReadingsData)
        getfetchMetricAlertsV2(headPlant.schema, iid, param)
      } else {
        setSnackMessage(t('NoBrowserData'))
        setType("info");
        setOpenSnack(true)
        setfetchValuesStatus(false)
      }
    } else if (!meterReadingsV1Loading && meterReadingsV1Error) {
      setSnackMessage(t('NoBrowserData'))
      setType("info");
      setOpenSnack(true)
      setfetchValuesStatus(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error])



  //TREE generation starts here

  const generateTree = (tempProps1, finalMeterReadings,alertrules) => {

    try {
      let i = 2;
      let defaultExtendArr = [...nodeIDArray];
      tempProps1.nodeId = 1;
      tempProps1.connectloss = 0;
      tempProps1.expanded = true

      if (tempProps1.type !== "instrument" && tempProps1.children) {
        defaultExtendArr.push(tempProps1.nodeId)
      }




      if (tempProps1 && tempProps1.children) {
        console.log("DSDS_________", tempProps1, finalMeterReadings)
        tempProps1.children.forEach(function (item) {
          let isExpand = expandedNodeIDArrays.includes(item.nodeId)
          item.nodeId = i;
          item.test = 1;
          item.connectloss = 0;
          item.expanded = isExpand ? isExpand : false;
          if (item.type !== "instrument" && item.children) {
            defaultExtendArr.push(item.nodeId)
          }

          i++
        })
        const indfinder = (a, nid, name) => {
          a.forEach(function (b) {
            let isExpand = expandedNodeIDArrays.includes(b.nodeId)
            b.test = 1;
            b.nodeId = i;
            b.connectloss = 0
            b.expanded = isExpand ? isExpand : false;


            if (b.type !== "instrument" && b.children) {
              defaultExtendArr.push(b.nodeId)
            }


            i++
            if (b.type === "instrument") {
              if (alertCountData && alertCountData.length > 0) {
                const filterAlert = alertCountData.filter(x => x.iid === b.id)
                if (filterAlert.length > 0) {
                  b.critical = filterAlert[0].critical;
                  b.warning = filterAlert[0].warning;
                }
              }

              if (parametersOfMeter !== undefined && parametersOfMeter.length > 0) {

                let test = []

                parametersOfMeter.forEach(obj => {
                  let obj_metric_id = obj.instruments_id
                  let metric_names = obj.metric.name
                  if (obj_metric_id === b.id) {
                    let unit = finalMeterReadings.findIndex((el) =>
                      el.key === metric_names && el.iid === obj_metric_id
                    )
                    let tempObj;
                    if (unit >= 0) {

                      tempObj = {
                        key: finalMeterReadings[unit].key,
                        metric_name: obj.metric.title,
                        unit: obj.metric.metricUnitByMetricUnit.unit,
                        metric_id: obj_metric_id,
                        meterValue1: finalMeterReadings[unit].value ,
                        nodeId: i,
                        time: finalMeterReadings[unit].time,
                        category: obj.instrument.category,
                        instrument_name: obj.instrument.name,
                        hierarchy: `${name}_${b.name}`,
                        metric_data_type: obj.metric.metric_datatype,
                        frequency: obj.frequency ? obj.frequency : 10,
                        alarmcolor: finalMeterReadings[unit].alarmcolor,
                        alarmbg: finalMeterReadings[unit].alarmbg,
                        alarmLevel: finalMeterReadings[unit].alert_level,
                        alarmTime: finalMeterReadings[unit].alert_time,
                        enable: obj.metric.Enable,
                        key_id : obj.metrics_id,
                        alertenabled : false,
                        forecastenable: false,
                        isForecast : obj.enable_forecast,
                      }
                      i++
                      test.push(tempObj)

                    }

                    else {

                      let alarmcolor = "#bbbbbb"
                      let alarmbg = ""
                      if(alertrules.findIndex(a => a.id === obj.instruments_id && a.metric === obj.metric.name)>= 0){
                         alarmcolor = "#101010"
                        alarmbg =  "" 
                      }
                      tempObj = {
                        key: obj.metric.name,
                        metric_name: obj.metric.title,
                        unit: obj.metric.metricUnitByMetricUnit.unit,
                        metric_id: obj.instruments_id,
                        meterValue1: obj.value,
                        nodeId: i,
                        time: obj.time,
                        category: obj.instrument ? obj.instrument.category : "",
                        instrument_name: obj.instrument ? obj.instrument.name : obj.instruments_id,
                        hierarchy: `${name}_${b.name}`,
                        metric_data_type: obj.metric.metric_datatype,
                        frequency: obj.frequency ? obj.frequency : 10,
                        alarmcolor: alarmcolor,
                        alarmbg: alarmbg,
                        alarmLevel: "",
                        alarmTime: "",
                        enable: obj.metric.Enable,
                        key_id : obj.metrics_id,
                        alertenabled : false,
                        forecastenable: false,
                        isForecast : obj.enable_forecast,
                      }
                      i++
                      test.push(tempObj)

                    }



                  }
                })
                b.children = test
              }


            }
          }
          )
          a.forEach(function (b) {
            if (b.hasOwnProperty("children") && b.children.length > 0) {
              indfinder(b.children, b.nodeId, `${name}_${b.name}`)
            }
          })
        }
        tempProps1.children.forEach(function (a) {
          if (a.hasOwnProperty("children")) {
            indfinder(a.children, a.nodeId, `${tempProps1.name}_${a.name}`)
          }
        })
      }


      if (tempProps1.children) {
        connectstatus(tempProps1, 0)
      }



      if (Object.keys(tempProps1).length > 1) {


        setNodeIDArray(defaultExtendArr)
        setLoaderStatus(false)
        setTreeData(tempProps1)
        setTempProps(tempProps1)

        if (tempProps1.children) {
          let arr = []
          tempProps1.children.map(val => {
            if (val.children) {
              metricTable(val.children)
              arr = hierarchyTable(val.children, arr)
            }

          })
        }
      }
    }
    catch (err) {
      console.log('generateTree', err)
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("openExploreFromAH");
    if (storedData) {
      try {
        setOpenExplore(JSON.parse(storedData));
        setselectedRange(14)
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        setOpenExplore(null);
      }
    } else {
      setOpenExplore(null); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

    useEffect(()=>{
      console.clear()
      console.log(openExplore,fetchValuesStatus)
      if(openExplore !== null && Object.keys(openExplore).length > 0 && fetchValuesStatus === false){
        addMetricToDashboard({
            "key": openExplore.selectedMetric,
            "metric_name": openExplore.metric,
            "unit": "mm/s",
            "metric_id": openExplore.selectedInstrumentId,
            "meterValue1": "0.0429",
            "nodeId": 1654,
            "time": "2024-10-02 15:12:58.000000 +000",
            "category": 3,
            "instrument_name": openExplore.instrumentname,
            "hierarchy": headPlant.name + "_All Instruments_" + openExplore.instrumentname,
            "metric_data_type": 3,
            "frequency": 300,
            "alarmcolor": "#101010",
            "alarmbg": "#E0E0E0",
            "alarmLevel": "ok",
            "alarmTime": "2024-08-18T01:26:38.124Z",
            "enable": true,
            "key_id": 43,
            "alertenabled": false,
            "forecastenable": false,
            "isForecast": false,
            "test": 1,
            "connectloss": 0,
            "expanded": true
      })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[openExplore, fetchValuesStatus])

  const handleToggle = (data, node, expanded, path) => {

    console.clear()
    console.log(data)
    console.log(node)
    console.log(expandedNodeIDArrays)

    let defaultExtendArr = [...expandedNodeIDArrays];
    let arrCheck = defaultExtendArr.includes(node.nodeId)

    if (arrCheck) {
      defaultExtendArr = defaultExtendArr.filter(item => item !== node.nodeId)
    }
    else {
      defaultExtendArr.push(node.nodeId)
    }
    console.log("defaultExtendArr_", defaultExtendArr)
    setExpandedNodeIDArrays(defaultExtendArr)
    // setDefaultExpandNodeList(defaultExtendArr)

    let temptreedata = data && data.length > 0 ? data[0] : {};
    const setsubnodesexpansion = (a, status) => {
      console.log("su nodes",a, status)
      a.forEach(function (b) {
        b.expanded = status
        if (b.hasOwnProperty("children")) {
          setsubnodesexpansion(b.children, status)
        }
      })


    }
    const expandtoggle = (a) => {

      a.forEach(function (b) {
        if (b.nodeId === node) {
          const status = !b.expanded
          b.expanded = status
          if (b.children) setsubnodesexpansion(b.children, status)
        }
        else if (b.hasOwnProperty("children") && b.children.length > 0) {
          expandtoggle(b.children)
        }
      })
    }
    temptreedata.children.forEach(function (a) {


      console.log("A__", a)
      // if(a.type === 'entity'){
      //   if (a.nodeId === node) {
      //     console.log("INSS")
      //     const status = !a.expanded
      //     a.expanded = status

      //     if (a.children) setsubnodesexpansion(a.children, status)
      //   }
      //   else if (a.hasOwnProperty("children")) {
      //     console.log("$EWW")
      //     expandtoggle(a.children)
      //   }
      // } else {
      //   if (a.nodeId === node.nodeId) {
      //     console.log("INSS")
      //     const status = !a.expanded
      //     a.expanded = status
        
      //     if (a.children) setsubnodesexpansion(a.children, status)
      //   }
      //   else if (a.hasOwnProperty("children")) {
      //     console.log("$EWW")
      //     expandtoggle(a.children)
      //   }
      // }
      if (a.nodeId === node) {
        console.log("INSS")
        const status = !a.expanded
        a.expanded = status

        if (a.children) setsubnodesexpansion(a.children, status)
      }
      else if (a.hasOwnProperty("children")) {
        expandtoggle(a.children)
      }
    })
    console.log("temptreedata", temptreedata, defaultExpandNodeList)
    debugger
    setTreeData(temptreedata)
  }

  const handleTogglePin = (data) => {
    let temptreedata = data && data.length > 0 ? data[0] : {};
    setPinTreeData(temptreedata)
  }
  // eslint-disable-next-line no-unused-vars
  const expandAll = (bool) => {
    let defaultExtendArr = []

    let temptreedata = { ...treeData }
    const setsubnodesexpansion = (a) => {
      a.forEach(function (b) {
        if (b.hasOwnProperty("children") && b.type !== "instrument") {
          if (bool === "expand") {
            b.expanded = true
            defaultExtendArr.push(b.nodeId)
          }
          else {
            b.expanded = false
          }
          setsubnodesexpansion(b.children)
        }
        else {
          b.expanded = false
        }
      })
    }
    temptreedata.expanded = bool === "expand" ? true : false
    if (temptreedata.children) setsubnodesexpansion(temptreedata.children)


    //console.log("temptreedata",temptreedata)
    console.log("XOXOX", defaultExtendArr)
    setExpandedNodeIDArrays(defaultExtendArr)
    setTreeData(temptreedata)
  }
  // eslint-disable-next-line no-unused-vars


  function dfs(node, term, foundIDS, nodes) {
    let isMatching = node.name && node.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        dfs(child, term, foundIDS, nodes);
      });
    }


    if (isMatching && node.id) {
      foundIDS.unshift(node);
      nodes.unshift(node.nodeId)
    }

    return isMatching;
  }



  function connectstatus(node, count) {

    if (node && node.type === "instrument" && node.children) { //there can't be an immediate instrument under the first level of hierarchy

      if (node.children.length === 0) {

        count = count + 1
        node.connectloss = 1
        return count
      }
      else {

        let connectstat = node.children.every(c => c.time === undefined) || node.children.every(c => moment(now).diff(moment(c.time), 'seconds') > (3 * c.frequency) || c.time === undefined) // || node.children.some(c => c.alarmcolor.toUpperCase() === "#FF0D00")

        if (connectstat) {
          count = count + 1
          node.connectloss = 1
          return count
        }
      }

    }


    if (node && node.children) {
      node.children.forEach((child) => {

        node.connectloss = node.connectloss + connectstatus(child, count)


      }
      )
    }

    return node.connectloss

  }
  
  const renderTreeComponents = ()=>{
    if(pinstate){
      return ( <div className ='px-4  bg-Background-bg-primary  dark:bg-Background-bg-primary-dark' style={{ height: "calc(100vh - 150px)", position: "relative" }} >

      <TreeComponent nodeList={pinnedNodeList} treedata={pintreeData} addMetricToDashboard={addMetricToDashboard} removeMetricfromDashboard={removeMetricfromDashboard} addMetricPin={addMetricPin} removeMetricPin={removeMetricPin} meterSelected={meterSelected} fetchValuesStatus={fetchValuesStatus} handleToggle={handleTogglePin} pinnedMeter={pinnedMeter} />
    </div>)
    }else{
    return  (
      <div className ='px-4 bg-Background-bg-primary  dark:bg-Background-bg-primary-dark' style={{ height: "calc(100vh - 150px)", position: "relative" }} >
        <TreeComponent
          nodeList={defaultExpandNodeList}
          treedata={treeData}
          addMetricToDashboard={addMetricToDashboard}
          removeMetricfromDashboard={removeMetricfromDashboard}
          addMetricPin={addMetricPin}
          removeMetricPin={removeMetricPin}
          meterSelected={meterSelected}
          fetchValuesStatus={fetchValuesStatus}
          handleToggle={handleToggle}
          pinnedMeter={pinnedMeter}
        />

      </div>
)
    }
  }
 
  return (

    <>
      <HierarchySearch setTreeData={setTreeData} fetchValuesStatus={fetchValuesStatus} setSearchNodeList={setSearchNodeList} selectedHierarchy={selectedHierarchy} defaultExpandNodeList={defaultExpandNodeList} />
      {loaderStatus &&
       <div className="dark:bg-Background-bg-primary-dark bg-Background-bg-primary  flex items-start justify-center mt-4 h-screen gap-2">
       <div className="flex items-center gap-2">
       <CircularProgress disableShrink size={20} color="primary"  />
       <Typography variant='paragraph-xs'>{t("Fetching metrics...")}</Typography>
       </div>
       </div> 
      }
      {!loaderStatus &&
        <>
          {fetchValuesStatus ? <div className="bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-screen  flex items-start mt-4 justify-center gap-2">
            <div className="flex items-center gap-2">
            <CircularProgress disableShrink size={20} color="primary"  />
            <Typography variant='paragraph-xs'>{t("Fetching metrics...")}</Typography>
            </div>
            </div> 
            : ""}
            {
              !fetchValuesStatus && 
            renderTreeComponents()
              
            }
        </>
      }

    </>
  );
});
export default BrowserHierarchy;
 