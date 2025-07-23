import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {useParams} from "react-router-dom"
import { useRecoilState } from "recoil";
import {
    selectedPlant, customdates, OverviewType, categoryFilter, alarmCurrentState, user, snackToggle, snackMessage, snackType,
    lineEntity, TaskRange,ErrorPage,themeMode, faultRange
} from "recoilStore/atoms";
import Typography from "components/Core/Typography/TypographyNDL";
import EnhancedTable from "components/Table/Table";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Grid from 'components/Core/GridNDL'
import KpiCardsNDL from "components/Core/KPICards/KpiCardsNDL";
import { useTranslation } from "react-i18next";
import useGetMetricsUnit from "../hooks/useGetMetricsUnit";
import useGetAlertCount from "../../hooks/usegetAlertCount";
import useGetAlert1MonthCount from "../../hooks/useGetAlert1MonthCount";
import Tag from "components/Core/Tags/TagNDL";
import ClickAwayListener from "react-click-away-listener";
import InputFieldNDL from 'components/Core/InputFieldNDL';
import moment from 'moment';
import LoadingScreenNDL from 'LoadingScreenNDL';
import Search from 'assets/neo_icons/Menu/SearchTable.svg?react';
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import AlarmIcon from 'assets/neo_icons/newUIIcons/Alarms.svg?react';
import AcknowledgeIcon from 'assets/neo_icons/newUIIcons/Acknowledge.svg?react';
import AlarmTrigeredIcon from 'assets/neo_icons/newUIIcons/TrigeredAlarm.svg?react';
import CriticalIcons from 'assets/neo_icons/newUIIcons/Critical.svg?react';



import Button from "components/Core/ButtonNDL";
import Ok from 'assets/neo_icons/Alarms/CheckCircle.svg?react';
import Warning from 'assets/neo_icons/Alarms/WarningCircle.svg?react';
import Critical from 'assets/neo_icons/Alarms/critical.svg?react';
import FileDownload from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import Plus from 'assets/plus.svg?react';
import ActiveIcon from 'assets/neo_icons/Dashboard/Active_tagIcon.svg?react';
import InactiveIcon from 'assets/neo_icons/Dashboard/Inactive_tagIcon.svg?react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Card from "./Card";
import useGetAlertsOverviewData from "../hooks/useGetAlertsOverviewData";
import Trend from 'assets/trend.svg?react';
import useGetAlertsDowntimeData from "../hooks/useGetAlertsDowntimeData"
import useGetAlarmAcknowledgement from "../hooks/useGetAlarmAcknowledgement"
import EnhancedTablePagination from "components/Table/TablePagination";
import useGetAlertComparisonList from "../../hooks/useGetAlertComarisonList";
import MetricCard from "./MetricCard";
import Breadcrumbs from "components/Core/Bredcrumbs/BredCrumbsNDL";
import useGetInstrumentAlert from "../hooks/useGetInstrumentAlert";
import AlarmOverviewModal from "./AlarmOverviewModal";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import AlarmDownloadModal from "./AlarmDownloadModal";
import useGetAlarmDownloadData from "../hooks/useGetAlarmDownloadData";
import useGetConnectivityOverviewData from "../hooks/useGetConnectivityOverviewData";
import useGetConnectivityAlerts from "../hooks/useGetConnectivityAlerts";
import useGetMostDisconnectedInstrument from "../hooks/useGetMostDisconnectedInstrument";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import useUpdateAlarmAcknowledgement from "../hooks/useUpdateAlarmAcknowledgement";
import useUpdateConnectivityAlarmAcknowledgement from "../hooks/useUpdateConnectivityAlarmAcknowledgement";
import useGetAlertsTodayDowntimeData from "../hooks/usegetAlertsTodayDowntimeData";
import useGetDowntimeAlertCount from "../../hooks/useGetDowntimeAlertCount";
import useGetMetricsWithAlertID from "../hooks/useGetMetricsWithAlertID";
import useGetFaultInfo from "components/layouts/FaultAnalysis/hooks/useGetFaultInfo.jsx";
import TableIcon from 'assets/neo_icons/Dashboard/table2.svg?react';
import TileIcon from 'assets/neo_icons/Dashboard/layout-grid.svg?react';
import ListIcon from 'assets/neo_icons/Alarms/list.svg?react';
import Charts from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/ChartJS/chart.jsx";
import useTaskList from 'components/layouts/Tasks/hooks/useTaskList'
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";
import StatusNDL from 'components/Core/Status/StatusNDL'
import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx";
import useGetEntityInstrumentsList from 'components/layouts/Tasks/hooks/useGetEntityInstrumentsList.jsx';
import * as XLSX from 'xlsx';
// NOSONAR
export default function AlarmOverview(props) {
    const { t } = useTranslation();
    let {moduleName,queryParam} = useParams() 
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [bulkack, setbulkack] = useState(true);
    const [severityParam] = useState('')
    const [historydata, sethistorydata] = useState(false)
    const [assetParam,setAssetParam] = useState('')
    const [instrumentParam,setInstrumentParam] = useState('')
    const [headPlant] = useRecoilState(selectedPlant)
    const [currUser] = useRecoilState(user)
    const [EntityList] = useRecoilState(lineEntity);
    const [countList, setcountList] = useState([])
    const [monthcountList, setmonthcountList] = useState([])
    const [AckPieData, setAckPieData] = useState({ label: [], Data: [], BGcolor: [] })
    const [CriticalityPieData, setCriticalityPieData] = useState({ label: [], Data: [], BGcolor: [] })
    const [isHomeOkAlert, setIsHomeOkAlert] = useState(true)
    const [isHomeWarningAlert, setIsHomeWarningAlert] = useState(true)
    const [isHomeCriticalAlert, setIsHomeCriticalAlert] = useState(true)
    const [isInstrumentOkAlert, setIsInstrumentOkAlert] = useState(true)
    const [isInstrumentWarningAlert, setIsInstrumentWarningAlert] = useState(true)
    const [overviewrawdata, setoverviewrawdata]= useState(true)
    const [isInstrumentCriticalAlert, setIsInstrumentCriticalAlert] = useState(true)
    const [isMetricsOkAlert, setIsMetricsOkAlert] = useState(true)
    const [isMetricsWarningAlert, setIsMetricsWarningAlert] = useState(true)
    const [isMetricsCriticalAlert, setIsMetricsCriticalAlert] = useState(true)
    const [isMetricDetailsOkAlert, setIsMetricDetailsOkAlert] = useState(true)
    const [isMetricDetailsWarningAlert, setIsMetricDetailsWarningAlert] = useState(true)
    const [isMetricDetailsCriticalAlert, setIsMetricDetailsCriticalAlert] = useState(true)
    const [count, setCount] = useState('')
    const [alert_id, setalert_id]=useState([])
    const [countToday, setCountToday] = useState('')
    const [customdatesval,] = useRecoilState(customdates);
    const [OverviewTypes] = useRecoilState(OverviewType);

    const [categoryTypes] = useRecoilState(categoryFilter)
    const [, setErrorPage] = useRecoilState(ErrorPage);
    const [, setentityData] = useState([]);
    const [, setinstrumentData] = useState([])
    const [, setvirtualInstrumentData] = useState([])
    const [toadyCritical, setToadyCritical] = useState(0)
    const [totalCritical, setTotalCritical] = useState(0)
    const [totalWarning, setTotalWarning] = useState(0)
    const [, setTotalAlarmsTriggered] = useState(0)
    const [, setTotalDataAlert] = useState(0)
    const [DowntimeAssetData, setDowntimeAssetData] = useState([])
    const [, setTotalTimeslotAlert] = useState(0)
    const [, setTotalDowntimeAlert] = useState(0)
    const [TotalToolAlert,setTotalToolAlert] = useState(0)
    const [totalConnectivityAlert, setTotalConnectivityAlert] = useState(0)
    const [, setTotalAlarmsLength] = useState(0)
    const [alarmAcknowledged, setAlarmAcknowledged] = useState(0)
    const [alarmYetToAcknowleded, setAlarmYetToAcknowleded] = useState(0)
    const [, setAlarmAcknowledgePercentage] = useState(0)
    const [EntityCardData, setEntityCardData] = useState([]);
    const [overallAlarmsTriggered, setOverallAlarmsTriggered] = useState([])
    const [filteredOverallAlarmsTriggered, setFilteredOverallAlarmsTriggered] = useState([])
    const {  metricsunitData, getmetricsunit } = useGetMetricsUnit()
    const [overallInstrumentAlarms, setOverallInstrumentAlarms] = useState([])
    const [filteredOverallInstrumentAlarms, setFilteredOverallInstrumentAlarms] = useState([])
    const [overallMetricsAlarms, setOverallMetricsAlarms] = useState([])
    const [filteredOverallMetricsAlarms, setFilteredOverallMetricsAlarms] = useState([])
    const [overallMetricDetailsAlarms, setOverallMetricDetailsAlarms] = useState([])
    const [filteredOverallMetricDetailsAlarms, setFilteredOverallMetricDetailsAlarms] = useState([])
    const [historyrawdata, sethistoryrawdata]= useState([])
    const [listArray, setListArray] = useState([{ index: 'home', name: headPlant.name }])
    const [datatype, setdatatype]= useState([])
    const [overallsingle, setoverallsingle]= useState(false)
    const [page, setPage] = useRecoilState(alarmCurrentState);
    const [EntityName, setEntityName] = useState('')
    const [EntityID, setEntityID] = useState('')
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [instrumentName, setInstrumentName] = useState('')
    const {  TaskListData, getTaskList } = useTaskList();
    const [homeInput, setHomeInput] = useState(false);
    const [homeSearchText, setHomeSearchText] = useState('')
    const [debouncedHomeSearchText, setDebouncedHomeSearchText] = useState('');
    const [homeRowsPerPage, setHomeRowsPerPage] = useState(12);
    const [metrawdata, setmetrawdata]= useState([]);
    const [homeCurrentPage, setHomeCurrentPage] = useState(0);
    const [homeCurrentData, setHomeCurrentData] = useState([])
    const [homeCurrentDataOverall, sethomeCurrentDataOverall] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [upmetricsCurrentData, setupmetricsCurrentData]= useState([])
    const [upupdatedMetricDetails, setupupdatedMetricDetails]= useState([])
    const [, setInstrumentInput] = useState(false);
    const [instrumentSearchText, setInstrumentSearchText] = useState('')
    const [debouncedInstrumentSearchText, setDebouncedInstrumentSearchText] = useState('');
    const [instrumentRowsPerPage, setInstrumentRowsPerPage] = useState(12);
    const [instrumentCurrentPage, setInstrumentCurrentPage] = useState(0);
    const [instrumentCurrentData, setInstrumentCurrentData] = useState([])
    const [isackdis, setisackdis]= useState(0)
    const [, setMetricsInput] = useState(false);
    const [metricsSearchText, setMetricsSearchText] = useState('')
    const [debouncedMetricsSearchText, setDebouncedMetricsSearchText] = useState('');
    const [metricsRowsPerPage, setMetricsRowsPerPage] = useState(5);
    const [metricsCurrentPage, setMetricsCurrentPage] = useState(0);
    const [metricsCurrentData, setMetricsCurrentData] = useState([])
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
    const { getAlarmAcknowledgementLoading, getAlarmAcknowledgementData, getAlarmAcknowledgementError, getAlarmAcknowledgement } = useGetAlarmAcknowledgement();
    const [mostDisconnectedOverall, setMostDisconnectedOverall] = useState([])
    const [mostDisconnectedToday, setMostDisconnectedToday] = useState([])
    const [mostDisconnectedDialog, setMostDisconnectedDialog] = useState(false)
    const [isoverviewexpad] = useState(true)
    const [, setMetricDetailsInput] = useState(false);
    const [metricDetailsSearchText, setMetricDetailsSearchText] = useState('')
    const [debouncedMetricDetailsSearchText, setDebouncedMetricDetailsSearchText] = useState('');
    const [metricDetailsRowsPerPage, setMetricDetailsRowsPerPage] = useState(5);
    const [metricDetailsCurrentPage, setMetricDetailsCurrentPage] = useState(0);
    const [metricDetailsCurrentData, setMetricDetailsCurrentData] = useState([])
    const [sortByFilter, setSortByFilter] = useState(3)
    const [groupByFilter, setGroupByFilter] = useState(1)
    const [removeRepeatAlarm, setRemoveRepeatAlarm] = useState()
    const [removeOkAlarm, setRemoveOkAlarm] = useState()
    const [, setFaultRange] = useRecoilState(faultRange);
    const [fetchdata , setfetchdata]= useState([])
    const [downloadData, setDownloadData] = useState([])
    const [loading, setLoading] = useState(false)
    const [alarmsConfiguredLoading, setAlarmsConfiguredLoading] = useState(false)
    const [alertsOverviewDataLoading, setAlertsOverviewDataLoading] = useState(false)
    const [, setAlertsDowntimeDataLoading] = useState(false)
    const [, setAlertsTodayDowntimeDataLoading] = useState(false)
    const [, setMostDisconnectedLoading] = useState(false)
    const [, setDowntimeCount] = useState('')
    const [faultdata, setfaultdata] = useState([])
    const [tabledata, settabledata] = useState([])
    const [finalupdatedtabledata, setfinalupdatedtabledata] = useState([])
    const [tablehistorydata, settablehistorydata] = useState([])
    const [, setfintabledata] = useState([])
    const [, setmettabledata] = useState([])
    const [defect_name, setdefect_name] = useState([])
    const [recommendation, setrecommendation] = useState([])
    const [rangeSelected] = useRecoilState(TaskRange);
    const [connectivityData, setConnectivityData] = useState([])
    const [updatedMetricDetails, setUpdatedMetricDetails] = useState([]);
    const [selected, setSelected] = useState("tile"); 
    const [metSelected, setMetSelected] = useState("tile"); 
    const [finSelected, setFinSelected] = useState("tile"); 
    const [valertid, setvalertid] = useState([]);
    const [selecteddata, setselecteddata]= useState([]);
  const [currTheme] = useRecoilState(themeMode);
  const [pageidx,setPageidx] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageDetailedidx,setPageDetailedidx] = useState(0)
  const [rowsDetailedPerPage, setRowsdetailedPerPage] = useState(10);
  const [pageViewidx,setPageViewidx] = useState(0)
  const [rowsViewPerPage, setRowsViewPerPage] = useState(10);
  const [groupedData, setgroupedData] = useState([])

    const connectivityOption = [
        { id: "all", name: t("Show All") },
        { id: "instruments", name: t("Instruments") },
        { id: "gateway", name: t("Gateway") },
    ]
    const handleConnectivityType = (e) => {
        props.filterhandler(e)
        if (e.target.value !== "all") {
            let filter = e.target.value === "instruments" ? 1 : 2;
            let temp = connectivityData.filter(t => t.connectivity_type == filter)
            setHomeCurrentData(temp.slice(0, homeRowsPerPage))
            sethomeCurrentDataOverall(temp)
        }
        else {
            setHomeCurrentData(connectivityData.slice(0, homeRowsPerPage))
            sethomeCurrentDataOverall(connectivityData)
        }
    }

    const AlarmOverviewModalRef = useRef()
    const AlarmDownloadModalRef = useRef()

    const { AlertCountLoading, AlertCountData, AlertCountError, getAlertCount } = useGetAlertCount()
    const { AlertsCountLoading,  AlertsCountData , AlertsCountError,getAlertsCount } = useGetAlert1MonthCount()
    const {  EntityInstrumentsListData, getEntityInstrumentsList } = useGetEntityInstrumentsList();
    const { AlertsOverviewLoading, AlertsOverviewData, AlertsOverviewError, getAlertsOverviewData } = useGetAlertsOverviewData();
    const { AlertsDowntimeLoading, AlertsDowntimeData, AlertsDowntimeError, getAlertsDowntimeData } = useGetAlertsDowntimeData();
    const { AlertsTodayDowntimeLoading, AlertsTodayDowntimeData, AlertsTodayDowntimeError, getAlertsTodayDowntimeData } = useGetAlertsTodayDowntimeData();
    const { ConnectivityOverviewLoading, ConnectivityOverviewData, ConnectivityOverviewError, getConnectivityOverviewData } = useGetConnectivityOverviewData();
    const { AlertDowntimeCountLoading, AlertDowntimeCountData, AlertDowntimeCountError, getAlertDowntimeCount } = useGetDowntimeAlertCount()
    const { alarmMetricsLoading, alarmMetricsData, alarmMetricsError, getAlarmMetrics } = useGetMetricsWithAlertID()
    const { mostDisconnectedInstrumentLoading, mostDisconnectedInstrumentData, mostDisconnectedInstrumentError, getMostDisconnectedInstrument } = useGetMostDisconnectedInstrument();
    const { ConnectivityAlerstLoading, ConnectivityAlerstData, ConnectivityAlerstError, getConnectivityAlerts } = useGetConnectivityAlerts()
    const { AlertComparisonListLoading, AlertComparisonListData, AlertComparisonListError } = useGetAlertComparisonList()
    const { InstrumentAlertLoading, InstrumentAlertData, InstrumentAlertError, getInstrumentAlertData } = useGetInstrumentAlert()
    const { alarmDataDownloadLoading, alarmDataDownloadData, alarmDataDownloadError, getAlarmDownloadData } = useGetAlarmDownloadData()
    const { updateAlarmAcknowledgementLoading, updateAlarmAcknowledgementData, updateAlarmAcknowledgementError, getUpdateAlarmAcknowledgement } = useUpdateAlarmAcknowledgement();
    const { updateConnectivityAlarmAcknowledgementLoading, updateConnectivityAlarmAcknowledgementData, updateConnectivityAlarmAcknowledgementError, getUpdateConnectivityAlarmAcknowledgement } = useUpdateConnectivityAlarmAcknowledgement();
    const { faultInfoLoading, faultInfoData, faultInfoError, getFaultInfo } = useGetFaultInfo();

    

    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight

    // useEffect(() => {
    //     if(range){
    //         setbtGroupValue(17)
    //         setRangeSelected(17)
    //     }
    //     else{
    //         if(!range){
    //             setbtGroupValue(13)
    //             setRangeSelected(13)
    //         }
    //     }
       
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[])

    const headCells = [

        {
            id: 'S.No',
            label: 'S.No',
            disablePadding: false,
        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: false,
            label: t('Asset'),
            colSearch: true,
        }, {
            id: 'Criticality',
            numeric: false,
            disablePadding: false,
            label: t("Criticality"),
            colSearch: true,
        },
        {
            id: 'CriticalAlarms',
            numeric: false,
            disablePadding: false,
            label: t("CriticalAlarms"),
            colSearch: true,
        },
        {
            id: 'WarningAlarms',
            numeric: false,
            disablePadding: false,
            label: t("WarningAlarms"),
            colSearch: true,
        },
        {
            id: 'TriggeredAt',
            numeric: false,
            disablePadding: false,
            label: t("TriggeredAt"),
            colSearch: true,
        },
        {
            id: 'ReportStatus',
            numeric: false,
            disablePadding: false,
            label: t("ReportStatus"),
            width: 120,
            colSearch: true,
        },
        {
            id: 'PDMFaults',
            numeric: false,
            disablePadding: false,
            label: t("PDM Faults"),
            width: 120,
            colSearch: true,
        },
    ]

    const headHistoryCells = [

        {
            id: 'S.No',
            label: 'S.No',
            disablePadding: false,
        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: false,
            label: t('Asset'),
            colSearch: true,
        },
        {
            id: 'Instrument',
            numeric: false,
            disablePadding: false,
            label: t('Instrument'),
            colSearch: true,
        }, {
            id: 'Metrics',
            numeric: false,
            disablePadding: false,
            label: t("Metrics"),
            colSearch: true,
        },
        {
            id: 'LimitValue',
            numeric: false,
            disablePadding: false,
            label: t("LimitValue"),
            colSearch: true,
        },
        {
            id: 'EventValue',
            numeric: false,
            disablePadding: false,
            label: t("EventValue"),
            colSearch: true,
        },
        {
            id: 'Unit',
            numeric: false,
            disablePadding: false,
            label: t("Unit"),
            colSearch: true,
        },
        {
            id: 'Criticality',
            numeric: false,
            disablePadding: false,
            label: t("Criticality"), 
            colSearch: true,
        },
        {
            id: 'TriggeredAt',
            numeric: false,
            disablePadding: false,
            label: t("TriggeredAt"),
            display: "none",
            colSearch: true,
            visiblity:false
        },
        {
            id: 'CheckedAt',
            numeric: false,
            disablePadding: false,
            label: t("CheckedAt"),
            colSearch: true,
            display: "none",
            visiblity:false
        },
        {
            id: 'AlertType',
            numeric: false,
            disablePadding: false,
            colSearch: true,
            label: t("AlertType")
        },
        {
            id: 'ReportStatus',
            numeric: false,
            disablePadding: false,
            label: t("ReportStatus"),
            colSearch: true,
        },
        {
            id: 'AcknowledgedBy',
            numeric: false,
            disablePadding: false,
            label: t("AcknowledgedBy"),
            display: "none",
            visiblity:false,
            colSearch: true,
        },
        {
            id: 'AnalystRemark',
            numeric: false,
            disablePadding: false,
            label: t("AnalystRemark"),
            display: "none",
            visiblity:false,
            colSearch: true,
        },
        {
            id: 'PDMFaults',
            numeric: false,
            colSearch: true,
            disablePadding: false,
            label: t("PDM Faults"),
        },
        {
            id: 'PDMRecommendation',
            numeric: false,
            disablePadding: false,
            colSearch: true,
            label: t("PDM Recommendation"),
            display: "none",
            visiblity:false
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: false,
            label: t("Status"),
            hide: true
        },
        {
            id: 'criticality',
            numeric: false,
            disablePadding: false,
            label: t("criticality"),
            colSearch: true,
            width: 120,
            display: "none",
            hide: true
        },
        {
            id: 'viid',
            numeric: false,
            disablePadding: false,
            label: t("viid"),
            colSearch: true,
            width: 120,
            display: "none",
            hide: true
        },
        {
            id: 'Acknowledge',
            numeric: false,
            disablePadding: false,
            label: t("Acknowledge"),
            display: "none",
            hide: true,
            alternate: true
        },
    ]

    const metheadCells = [

        {
            id: 'S.No',
            label: 'S.No',
            disablePadding: false,
        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: false,
            label: t('Asset'),
            colSearch: true,
        },
        {
            id: 'Instrument',
            numeric: false,
            disablePadding: false,
            label: t('Instrument'),
            colSearch: true,
        },
         {
            id: 'Metrics',
            numeric: false,
            disablePadding: false,
            label: t("Metrics"),
            colSearch: true,
        },
        {
            id: 'AlarmStatus',
            numeric: false,
            disablePadding: false,
            label: t("Alarm Status"),
            display: "none",
            hide: true
        },
        {
            id: 'LimitValue',
            numeric: false,
            disablePadding: false,
            label: t("LimitValue"),
            colSearch: true,
        },
        {
            id: 'EventValue',
            numeric: false,
            disablePadding: false,
            label: t("EventValue"),
            colSearch: true,
        },
        {
            id: 'Unit',
            numeric: false,
            disablePadding: false,
            label: t("Unit"),
            colSearch: true,
        },
        {
            id: 'Criticality',
            numeric: false,
            disablePadding: false,
            colSearch: true,
            label: t("Criticality"),
        },
        {
            id: 'TriggeredAt',
            numeric: false,
            disablePadding: false,
            label: t("TriggeredAt"),
            display: "none",
            colSearch: true,
            visiblity:false
        },
        {
            id: 'CheckedAt',
            numeric: false,
            disablePadding: false,
            label: t("CheckedAt"),
            colSearch: true,
            display: "none",
            visiblity:false
        },
        {
            id: 'AlertType',
            numeric: false,
            disablePadding: false,
            colSearch: true,
            label: t("AlertType")
        },
        {
            id: 'ReportStatus',
            numeric: false,
            disablePadding: false,
            colSearch: true,
            label: t("ReportStatus"),
        },
        {
            id: 'AcknowledgedBy',
            numeric: false,
            disablePadding: false,
            label: t("Acknowledged By"),
            colSearch: true,
            display: "none",
            visiblity:false
        },
        {
            id: 'AnalystRemark',
            numeric: false,
            disablePadding: false,
            label: t("Analyst Remark"),
            colSearch: true,
            display: "none",
            visiblity:false
        },
        {
            id: 'Acknowledge',
            numeric: false,
            disablePadding: false,
            label: t("Acknowledge"),
            display: "none",
            hide: true,
            alternate: true
        },
        {
            id: 'PDMFaults',
            numeric: false,
            colSearch: true,
            disablePadding: false,
            label: t("PDM Faults"),
        },
        {
            id: 'PDMRecommendation',
            numeric: false,
            disablePadding: false,
            label: t("PDM Recommendation"),
            colSearch: true,
            display: "none",
            visiblity:false
        },
        {
            id: 'Status',
            numeric: false,
            disablePadding: false,
            label: t("Status"),
            alternate: false,
            hide: true
        },
        {
            id: 'criticality',
            numeric: false,
            disablePadding: false,
            label: t("criticality"),
            colSearch: true,
            width: 120,
            display: "none",
            hide: true
        },
        {
            id: 'viid',
            numeric: false,
            disablePadding: false,
            label: t("viid"),
            colSearch: true,
            width: 120,
            display: "none",
            hide: true
        },
        {
            id: 'iid',
            numeric: false,
            disablePadding: false,
            label: t("iid"),
            colSearch: true,
            width: 120,
            display: "none",
            hide: true
        },
        {
            id: 'metric',
            numeric: false,
            disablePadding: false,
            label: t("metric"),
            colSearch: true,
            width: 120,
            display: "none",
            hide: true
        }

    ]

    const groupbyopt = [
        {id :1, name :'None'},
        {id :2, name :'Acknowledgement'},
        {id :3, name :'Criticality'},
        {id :4, name :'Instrument'},
        {id :5, name :'Metrics'},
    ]

    const Overivewopt = [
        {id :1, name :'Default View'},
        {id :2, name :'Detailed View'}
    ]

    useEffect(() => {
        getmetricsunit()
        getfetchAlertsOverviewData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (categoryTypes.length > 0 && rangeSelected !== 29) { 
            setAlarmsConfiguredLoading(true)
            setAlertsOverviewDataLoading(true)
            if (headPlant.id) {
                getAlertCount(headPlant.id, categoryTypes)
                getAlertsCount(headPlant.id, categoryTypes, customdatesval)
            }
            getAlertDowntimeCount(headPlant.id, categoryTypes) 

            if (OverviewTypes === 'connectivity') {
                getfetchConnectivityOverviewData()

            } else {
                getfetchAlertsOverviewData()
                getfetchAlertsDowntimeData()
                getfetchAlertsTodayDowntimeData()
            }

            setPage('home')
            setSortByFilter(3)
            setListArray([{ index: 'home', name: headPlant.name }])
        }
        else {
            setcountList([])
            setOverallAlarmsTriggered([])
            setFilteredOverallAlarmsTriggered([])
            setHomeCurrentData([])
            sethomeCurrentDataOverall([])
            setConnectivityData([])
            setToadyCritical(0);
            setTotalCritical(0);
            setTotalWarning(0);
            setTotalAlarmsTriggered(0);
            setTotalDataAlert(0);
            setTotalTimeslotAlert(0);
            setTotalDowntimeAlert(0)
            setTotalToolAlert(0)
            setTotalConnectivityAlert(0);
            setAlarmAcknowledged(0);
            setAlarmYetToAcknowleded(0);
            setAlarmAcknowledgePercentage(0);
            setTotalAlarmsLength(0);
            setMostDisconnectedOverall([])
            setMostDisconnectedToday([])
        }

        getEntityInstrumentsList(headPlant.id)
        const body = {
            type: "alert"
        }
        getAlarmAcknowledgement(body)
        getUsersListForLine(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant, customdatesval, OverviewTypes, categoryTypes])

    useEffect(() => {
        const endDate = new Date(); 
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        startDate.setHours(0, 0, 0, 0);
        
        getTaskList(headPlant.id, startDate.toISOString(), endDate.toISOString());
    }, [headPlant]);    

    useEffect(() => {
        setIsHomeOkAlert(true)
        setIsHomeWarningAlert(true)
        setIsHomeCriticalAlert(true)
        setIsInstrumentOkAlert(true)
        setIsInstrumentWarningAlert(true)
        setIsInstrumentCriticalAlert(true)
        setIsMetricsOkAlert(true)
        setIsMetricsWarningAlert(true)
        setIsMetricsCriticalAlert(true)
        setIsMetricDetailsOkAlert(true)
        setIsMetricDetailsWarningAlert(true)
        setIsMetricDetailsCriticalAlert(true)
        if(OverviewTypes !== "alert")
            {
            setSelected("tile")
            setMetSelected("tile")
            setFinSelected("tile")
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OverviewTypes])

    useEffect(() => {
        if (!AlertComparisonListLoading && AlertComparisonListData && !AlertComparisonListError) {
            if (AlertComparisonListData.neo_skeleton_entity) {
                setentityData(AlertComparisonListData.neo_skeleton_entity)
            }
            if (AlertComparisonListData.neo_skeleton_instruments) {
                let resInstrumentData = AlertComparisonListData.neo_skeleton_instruments
                let objInstrumentData = resInstrumentData.filter((x) => x.entity_instruments.length === 0)
                
                setinstrumentData(objInstrumentData)
            }
            if (AlertComparisonListData.neo_skeleton_virtual_instruments) {
                setvirtualInstrumentData(AlertComparisonListData.neo_skeleton_virtual_instruments)
            }

        }

    }, [AlertComparisonListLoading, AlertComparisonListData, AlertComparisonListError])

    useEffect(() => {
        if (!AlertCountLoading && AlertCountData && !AlertCountError) {
            if (AlertCountData.length > 0) {
             
                setcountList(AlertCountData)
            }
            else {
                setcountList([])
            }
            setAlarmsConfiguredLoading(false)
        }
    }, [AlertCountLoading, AlertCountData, AlertCountError])

    useEffect(() => {
        if (!AlertsCountLoading && AlertsCountData && !AlertsCountError) {
            if (AlertsCountData.length > 0) {
                setmonthcountList(AlertsCountData)
            }
            else {
                setmonthcountList([])
            }
            setAlarmsConfiguredLoading(false)
        }
    }, [ AlertsCountLoading,  AlertsCountData , AlertsCountError])


    const sumValues = (arr, timeSlot, tool) => {
        let total = 0;
        arr.forEach((obj) => {
            const value = Object.values(obj)[0];
            if (!isNaN(value)) {
                total += value;
            }
        });
        return (total - timeSlot - tool);
    };

    const viewalarm = (id, value) => {
        const matchingData = homeCurrentData[id];
        if (matchingData) {
            handleEntityCardActionInstrument(matchingData, id, value);
        } 
    };

    const handleupdatedData = (value) => {
        const hasValidCondition = value.some(item => item.criticality === "ok" || item.viid || item.Acknowledge === "Acknowledged");
        if(value.length > 1 && hasValidCondition === false){
        setselecteddata(value)
        setisackdis(1)
        } else {
            setisackdis(0)
        }
    }
    
    const handlebulkack = (data) => {
        setdatatype(data)
        const matchedData = selecteddata.map(selected => {
            
            let matchingAlert

            if(data === 1){
            matchingAlert = AlertsOverviewData.finalAlertsData.find(alert =>
                alert.instrument_name === selected["Instrument"] &&
                alert.metric_title === selected["Metrics"] &&
                alert.alert_level === selected["criticality"] &&
                moment(alert.time).format("YYYY-MM-DDTHH:mm:ssZ") === moment(selected["TriggeredAt"], "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ssZ")
            ); 
        } else if(data === 2){
            matchingAlert = InstrumentAlertData.dataAlerts.find(alert =>
                alert.iid === selected["iid"] &&
                alert.metric_name === selected["metric"] &&
                alert.alert_level === selected["criticality"] &&
                moment(alert.time).format("YYYY-MM-DDTHH:mm:ssZ") === moment(selected["TriggeredAt"], "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ssZ")
            );
        }
            return {
                selected,
                matchingAlert
            };
        });
        menuItemClick(2, matchedData, "bulkack")
        setbulkack(true)
    };   

    useEffect(() => {
        if (
            !InstrumentAlertLoading &&
            InstrumentAlertData &&
            InstrumentAlertData.dataAlerts &&
            InstrumentAlertData.dataAlerts.length > 0 &&
            !InstrumentAlertError &&
            !getAlarmAcknowledgementLoading &&
            getAlarmAcknowledgementData &&
            getAlarmAcknowledgementData.length > 0 &&
            !getAlarmAcknowledgementError &&
            !UsersListForLineLoading &&
            UsersListForLineData &&
            UsersListForLineData.length > 0 &&
            !UsersListForLineError
        ) {
            let transformedDataAlerts;
            
            if (fetchdata.Type === "VirtualInstrument") {
                const instdata = InstrumentAlertData.dataAlerts.filter(
                    (x) => (x.entity_type === "virtual_instrument" || x.entity_type === "time_slot") && x.alert_id === valertid
                );
                transformedDataAlerts = instdata.map((alert) => {
                    const user =
                        UsersListForLineData.find(
                            (user) => user.userByUserId?.id === alert.acknowledge_by
                        )?.userByUserId?.name || "";
    
                    const acknowledge =
                        getAlarmAcknowledgementData.find(
                            (ack) => ack.id === parseInt(alert.acknowledge_id)
                        )?.name || "";
    
                    return {
                        alarmName: alert.alert_name,
                        alert_id: alert.alert_id,
                        alarmStatus: alert.alert_level,
                        alarmValue: alert.value,
                        alarmValueTime: alert.value_time,
                        alarmTriggeredTime: alert.time,
                        alarmType: alert.alert_type || "",
                        minValue: alert.alert_level_min || "",
                        maxValue: alert.alert_level_max || "",
                        alarmLimitValue: alert.alert_level_value || "",
                        instrument_id: alert.instrument_id,
                        instrument_name: alert.config.instrument_name,
                        metricName: alert.metric_title,
                        metricKey: alert.metric_name,
                        acknowledgeID: alert.acknowledge_id,
                        acknowledgeName: acknowledge,
                        acknowledgeById: alert.acknowledge_by,
                        acknowledgeByName: user,
                        taskId: alert.task_id,
                        virtualInstrumentId: alert.viid || "",
                        Type: "Metrics",
                        config: alert.config,
                    };
                });
                
            } else {
                transformedDataAlerts = InstrumentAlertData.dataAlerts.map(
                    (alert) => {
                        const user =
                            UsersListForLineData.find(
                                (user) => user.userByUserId?.id === alert.acknowledge_by
                            )?.userByUserId?.name || "";
    
                        const acknowledge =
                            getAlarmAcknowledgementData.find(
                                (ack) => ack.id === parseInt(alert.acknowledge_id)
                            )?.name || "";
    
                        return {
                            alarmName: alert.alert_name,
                            alert_id: alert.alert_id,
                            alarmStatus: alert.alert_level,
                            alarmValue: alert.value,
                            alarmValueTime: alert.value_time,
                            alarmTriggeredTime: alert.time,
                            alarmType: alert.alert_type || "",
                            minValue: alert.alert_level_min || "",
                            maxValue: alert.alert_level_max || "",
                            alarmLimitValue: alert.alert_level_value || "",
                            instrument_id: alert.instrument_id,
                            instrument_name: alert.config.instrument_name,
                            metricName: alert.metric_title,
                            metricKey: alert.metric_name,
                            acknowledgeID: alert.acknowledge_id,
                            acknowledgeName: acknowledge,
                            acknowledgeById: alert.acknowledge_by,
                            acknowledgeByName: user,
                            taskId: alert.task_id,
                            virtualInstrumentId: alert.viid || "",
                            Type: "Metrics",
                            config: alert.config,
                        };
                    }
                );
            } 
            const combinedData = [...transformedDataAlerts];
            const uniqueData = combinedData.filter(
                (item, index, self) =>
                    index ===
                    self.findIndex(
                        (t) =>
                            t.alarmValueTime === item.alarmValueTime &&
                            t.instrument_id === item.instrument_id &&
                            t.metricName === item.metricName
                    )
            );
    
            setOverallMetricsAlarms(uniqueData);
            setOverallMetricDetailsAlarms(uniqueData);
            setOverallInstrumentAlarms(uniqueData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        InstrumentAlertLoading,
        InstrumentAlertData,    
        InstrumentAlertError,
        getAlarmAcknowledgementLoading,
        getAlarmAcknowledgementData,
        getAlarmAcknowledgementError,
        UsersListForLineLoading,
        UsersListForLineData,
        UsersListForLineError,
    ]);    

    async function fetchfaults() {
        getFaultInfo(headPlant.schema, moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ"), moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"));
    }


    useEffect(() => {
        if(moduleName === 'overview' && queryParam && (queryParam.includes('=') || queryParam.includes('&'))){
            // Split the query string at '&' to separate each key-value pair
                const paramsArray = queryParam.split('&'); 
                
                // Create an empty object to store the values
                const queryParams = {};
                
                // Iterate over the array and split each key-value pair
                paramsArray.forEach(param => {   const [key, value] = param.split('=');   
                queryParams[key] = value; });
                
                // Extracting the respective values
                const type = queryParams['type'];
                const category = queryParams['category'];
                const severity = queryParams['severity'];
                
            if(type === 'all' && category === 'all' && severity === 'ok'){
                setIsHomeCriticalAlert(false)
                setIsHomeWarningAlert(false)
            }
            if(type === 'all' && category === 'all' && severity === 'warning'){
                setIsHomeOkAlert(false)
                setIsHomeCriticalAlert(false)
            }
            if(type === 'all' && category === 'all' && severity === 'critical'){
                setIsHomeOkAlert(false)
                setIsHomeWarningAlert(false)
            }
           
        }
        if (new Date(customdatesval.StartDate).getTime() !== new Date(customdatesval.EndDate).getTime() && headPlant && headPlant.id && rangeSelected !== 29) {
            fetchfaults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval.StartDate, customdatesval.EndDate, headPlant,moduleName,severityParam,queryParam]);

    useEffect(() => {
        if (!faultInfoLoading && faultInfoData && !faultInfoError) {
            setfaultdata(faultInfoData)
        }
    }, [faultInfoLoading, faultInfoData, faultInfoError, instrumentCurrentData, filteredOverallAlarmsTriggered, homeCurrentData, metricDetailsCurrentData])

    useEffect(() => {
        if (!AlertDowntimeCountLoading && AlertDowntimeCountData && !AlertDowntimeCountError) {
            setDowntimeCount(AlertDowntimeCountData)

        }
    }, [AlertDowntimeCountLoading, AlertDowntimeCountData, AlertDowntimeCountError])

   const getBaseAlarmName = (name) => name.replace(/-\d+$/, '');

    useEffect(() => {
        if (!metricDetailsCurrentData || metricDetailsCurrentData.length === 0) return;

        const groups = {};

        metricDetailsCurrentData.forEach((item) => {
            const key = `${item?.metricKey}-${item?.alarmName}`;

            if (!groups[key]) groups[key] = [];

            groups[key].push(item);
        });

        const updatedGroups = Object.values(groups).map((group) => {
            const sortedGroup = group.sort(
                (a, b) => new Date(a.alarmTriggeredTime) - new Date(b.alarmTriggeredTime)
            );

            return sortedGroup;
        });

        const finalData = updatedGroups.flat().sort(
            (a, b) => new Date(b.alarmTriggeredTime) - new Date(a.alarmTriggeredTime)
        );

        setUpdatedMetricDetails(finalData);
    }, [metricDetailsCurrentData]);

    useEffect(() => {
        if (!metricsCurrentData || metricsCurrentData.length === 0) return;

        const groups = {};

        metricsCurrentData.forEach((item) => {
            const key = `${item?.metricKey}-${item?.alarmName}`;

            if (!groups[key]) groups[key] = [];

            groups[key].push(item);
        });

        const updatedGroups = Object.values(groups).map((group) => {
            const sorted = group.sort(
                (a, b) => new Date(a.alarmTriggeredTime) - new Date(b.alarmTriggeredTime)
            );

            return sorted;
        });

        const finalData = updatedGroups.flat().sort(
            (a, b) => new Date(b.alarmTriggeredTime) - new Date(a.alarmTriggeredTime)
        );

        setupmetricsCurrentData(finalData);
    }, [metricsCurrentData]);

    useEffect(() => {
        if (
            upmetricsCurrentData &&
            upmetricsCurrentData.groupedData &&
            typeof upmetricsCurrentData.groupedData === "object" &&
            Object.values(upmetricsCurrentData.groupedData).some(
                (arr) => Array.isArray(arr) && arr.length > 0
            )
        ) {

            const combinedData = Object.values(upmetricsCurrentData?.groupedData)
                .flat()
                .filter(Boolean);

            const groups = {};

            combinedData.forEach((item) => {
                const key = `${item?.metricKey}-${item?.alarmName}`;

                if (!groups[key]) groups[key] = [];

                groups[key].push(item);
            });

            const updatedGroups = Object.values(groups).map((group) => {
                const sorted = group.sort(
                    (a, b) => new Date(a?.alarmTriggeredTime) - new Date(b?.alarmTriggeredTime)
                );

                return sorted;
            });

            const finalDataDesc = updatedGroups
                .flat()
                .sort((a, b) => new Date(b?.alarmTriggeredTime) - new Date(a?.alarmTriggeredTime));

            const groupedData = processGroupedData(finalDataDesc, groupByFilter);
            setgroupedData(groupedData);
        }
    }, [upmetricsCurrentData, groupByFilter]);

    useEffect(() => {
 
        if (!ConnectivityAlerstLoading && ConnectivityAlerstData && !ConnectivityAlerstError) { 
            if (ConnectivityAlerstData.type === "Metrics") {
                setOverallMetricsAlarms(ConnectivityAlerstData.data);
            }
            if (ConnectivityAlerstData.type === "DownloadData") {

                if (ConnectivityAlerstData.data.length > 0) {
                    let finalData = []
                    // eslint-disable-next-line array-callback-return
                    ConnectivityAlerstData.data.map((x) => {

                        finalData.push({ alarmName: x.alarmName, instrument_id: x.instrument_id, instrument: x.instrument_name, alarmStatus: x.alarmStatus, checkedAt: moment(x.alarmTriggeredTime).format('DD-MM-YYYY HH:mm:ss')})

                    })
                    downloadExcel(finalData, "ConnectivityAlarmData  - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
                }
            }
        } else if (ConnectivityAlerstLoading) {
            setMostDisconnectedLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ConnectivityAlerstData])

    useEffect(() => {
        const labels = ["Acknowledged", "Yet to Acknowledge"];
        const data = [
            alarmAcknowledged, 
            alarmYetToAcknowleded 
        ];
        const bgColor = ["#0588F0", "#5EB1EF"]; 
        
        setAckPieData({ label: labels, Data: data, BGcolor: bgColor });
    }, [alarmAcknowledged, alarmYetToAcknowleded]);

    useEffect(()=>{
        const labels = ["Warning", "Critical"];
        const data = [
            totalWarning, 
            totalCritical 
        ];
        const bgColor = ["#EF5F00", "#CE2C31"]; 
        setCriticalityPieData({ label: labels, Data: data, BGcolor: bgColor });
    },[totalWarning, totalCritical])

    useEffect(()=>{
        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[homeCurrentDataOverall])

        useEffect(()=>{
            if(isMetricsOkAlert === true && isMetricsWarningAlert === true && isMetricsCriticalAlert === true){
            processedfinaltabledata(overallInstrumentAlarms)
            } else {
                processedfinaltabledata(filteredOverallMetricsAlarms)
            }// eslint-disable-next-line react-hooks/exhaustive-deps
        },[overallInstrumentAlarms, filteredOverallInstrumentAlarms,  isMetricsOkAlert, isMetricsWarningAlert, isMetricsCriticalAlert])

        const processedfinaltabledata = (overallInstrumentAlarms) => {
            let temptabledata = [];
            let objectTableData = [];
            if(overallInstrumentAlarms && overallInstrumentAlarms.length > 0){
            temptabledata = overallInstrumentAlarms.map((val, index) => {
                    const instrumentName = val.instrument_name;
                    const user = UsersListForLineData.find(user => user.userByUserId?.id === val.acknowledgeById)?.userByUserId?.name || "";
                    const acknowledge = getAlarmAcknowledgementData.find(ack => ack.id === parseInt(val.acknowledgeID))?.name || "";
                    
               
                    
                    const tasksForEntity = instrumentName
                        ? TaskListData && TaskListData.filter(task => task.instrument.name === instrumentName)
                        : [];

                    let highestPriority = "Not reported";
                    let highestPrioritycolor = "#202020";
                    let colorbg = "neutral-alt";
                    if (tasksForEntity && tasksForEntity.length > 0) {
                        const hasHighPriority = tasksForEntity.some(task => task.taskPriority.task_level === "High");
                        const hasMediumPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Medium");
                        const hasLowPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Low");

                        if (hasHighPriority || hasMediumPriority || hasLowPriority) {
                            highestPriority = "Report Done";
                            highestPrioritycolor = "#FFFFFF";
                            colorbg = "success-alt";
                        }
                    }

                    let faultText = "No Fault";
                    let faultRecommendation = "-";
                    if (val.metricName && (val.metricName.toLowerCase().includes("reading") || val.metricName.toLowerCase().includes("voltage"))) {
                        faultText = "-";
                        faultRecommendation = "-";
                    } else if (val.alarmStatus === "ok") {
                        faultText = "NA";
                        faultRecommendation = "-";
                    }
                    const unitObj = metricsunitData.filter(x => x.title.toLowerCase() === val.metricName.toLowerCase())
                    const objectRow = {
                        SNo: index + 1,
                        Asset: EntityName ? EntityName : "-",
                        Instrument: instrumentName,
                        Metrics: val.metricName,
                        LimitValue: val.alarmStatus === "critical" ? val.config.critical_value : val.config.warn_value || "-", 
                        EventValue: (Number(val.alarmValue) ? Number(val.alarmValue).toFixed(2) : "-"),
                        Unit: unitObj && unitObj[0].metricUnitByMetricUnit && unitObj[0].metricUnitByMetricUnit.unit,
                        Criticality: val.alarmStatus,
                        TriggeredAt: moment(val.alarmTriggeredTime).format("DD/MM/YYYY HH:mm:ss"),
                        CheckedAt: val.config ? moment(val.config.last_check_value_time).format("DD/MM/YYYY HH:mm:ss") : "-", 
                        AlertType:  val.alarmType,
                        ReportStatus: highestPriority,
                        AcknowledgedBy: user,
                        AnalystRemark: acknowledge,
                        PDMFaults: faultText,
                        PDMRecommendation: faultRecommendation,
                        iid : val.instrument_id,
                        metricKey: val.metricKey,
                        assetID:EntityID ? EntityID : "-",
                        instrument_id: val.instrument_id
                    };
        
                    objectTableData.push(objectRow);
        
                    return [
                        index + 1,
                        EntityName ? EntityName : "-",
                        instrumentName,
                        val.metricName,
                        val.alarmStatus,
                        val.alarmStatus === "critical" ? val.config.critical_value : val.config.warn_value || "-", 
                        (Number(val.alarmValue) ? Number(val.alarmValue).toFixed(2) : "-"),
                        unitObj && unitObj[0].metricUnitByMetricUnit && unitObj[0].metricUnitByMetricUnit.unit,
                        <StatusNDL
                        key={index+1}
                            style={{
                                color: "#FFFFFF",
                                textAlign: "center"
                            }}
                            colorbg={
                                val.alarmStatus === "critical" ? "error-alt" :
                                    val.alarmStatus === "warning" ? "warning02-alt" :
                                        val.alarmStatus === "ok" ? "success-alt" : ""
                            }
                            name={val.alarmStatus}
                        />,
                        moment(val.alarmTriggeredTime).format("DD/MM/YYYY HH:mm:ss"),
                        val.config ? moment(val.config.last_check_value_time).format("DD/MM/YYYY HH:mm:ss") : "-", 
                        val.alarmType,
                        <StatusNDL
                        key={index+1}
                            style={{
                                color: highestPrioritycolor,
                                textAlign: "center"
                            }}
                            colorbg={colorbg}
                            name={highestPriority}
                        />,
                        user,
                        acknowledge,
                        val.acknowledgeID ? "Acknowledged" : "Unacknowledged",
                        faultText,
                        faultRecommendation,
                        (
                            (val.virtualInstrumentId === null || val.virtualInstrumentId === "") &&
                            OverviewType !== 'tool' &&
                            val.alarmStatus !== "ok" ? (
                                val.acknowledgeID !== null ? (
                                    <Button type="ghost" disabled value={t("Acknowledged")} />
                                ) : (
                                    <Button
                                        type="ghost"
                                        disabled={false}
                                        onClick={() => menuItemClick(2, val)}
                                        value={t("Acknowledge")}
                                    />
                                )
                            ) : (
                                <Button type="ghost" disabled value={t("-")} />
                            )
                        ),
                        val.alarmStatus,
                        val.virtualInstrumentId,
                        val.instrument_id,
                        val.metricKey
                    ];
                })
        }
            setfinalupdatedtabledata(temptabledata)
            setmetrawdata(objectTableData)
        }


    const processedrows = () => {
        let tempObjectData = [];
        let temptabledata = [];
    
        if (homeCurrentDataOverall.length > 0) {
            homeCurrentDataOverall.forEach((val, index) => {
                const tasksForEntity = TaskListData && TaskListData.filter(task => task.entity_id === val.id);
    
                let highestPriority = "Not reported";
                let highestPrioritycolor = "#202020";
                let colorbg = "neutral-alt";
    
                if (tasksForEntity && tasksForEntity.length > 0) {
                    const hasHighPriority = tasksForEntity.some(task => task.taskPriority.task_level === "High");
                    const hasMediumPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Medium");
                    const hasLowPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Low");
    
                    if (hasHighPriority || hasMediumPriority || hasLowPriority) {
                        highestPriority = "Report Done";
                        highestPrioritycolor = "#FFFFFF";
                        colorbg = "success-alt"; 
                    }
                }
    
                tempObjectData.push({
                    SNo: index + 1,
                    Asset: val.name,
                    Criticality: val.CriticalityType, 
                    CriticalAlarms: val.Total_Critical,
                    WarningAlarms: val.Total_Warning,
                    TriggeredAt: moment(val.LastActiveAt).format("DD/MM/YYYY HH:mm:ss"),
                    ReportStatus: highestPriority,
                    PDMFaults: val.defects ? "No faults" : "-"
                });
    
                temptabledata.push([
                    index + 1,
                    val.name,
                    <StatusNDL 
                    key={index+1}
                        style={{ color: "#FFFFFF", textAlign: "center" }} 
                        colorbg={val.CriticalityType === "critical" ? "error-alt" :
                            val.CriticalityType === "warning" ? "warning02-alt" :
                            val.CriticalityType === "ok" ? "success-alt" : ""}
                        name={val.CriticalityType} 
                    />,
                    val.Total_Critical,
                    val.Total_Warning,
                    moment(val.LastActiveAt).format("DD/MM/YYYY HH:mm:ss"),
                    <StatusNDL 
                    key={index+1}
                        style={{ color: highestPrioritycolor, textAlign: "center" }} 
                        colorbg={colorbg}
                        name={highestPriority} 
                    />,
                    val.defects ? "No faults" : "-"
                ]);
            });
        }
    
        settabledata(temptabledata);
        setoverviewrawdata(tempObjectData);
    };        
        

    useEffect(()=>{
        processedfinrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[updatedMetricDetails])

    const processedfinrows = () => {
        let temptabledata = [];
        if (updatedMetricDetails.length > 0) {
            temptabledata = temptabledata.concat(updatedMetricDetails.map((val, index) => {
                let faultText = "No Fault";
                if (val.metricName && (val.metricName.toLowerCase().includes("reading") || val.metricName.toLowerCase().includes("voltage"))) {
                    faultText = "-";
                } else if (val.alarmStatus === "ok") {
                    faultText = "NA";
                }

                const tasksForEntity = TaskListData && TaskListData.filter(task => task.entity_id === val.id);
    
                let highestPriority = "Not reported";
                let highestPrioritycolor = "#202020";
                let colorbg = "neutral-alt";
                if (tasksForEntity && tasksForEntity.length > 0) {
                    const hasHighPriority = tasksForEntity.some(task => task.taskPriority.task_level === "High");
                    const hasMediumPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Medium");
                    const hasLowPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Low");
    
                    if (hasHighPriority || hasMediumPriority || hasLowPriority) {
                        highestPriority = "Report Done";
                        highestPrioritycolor = "#FFFFFF";
                        colorbg = "success-alt"; 
                    }
                }
    
                return [
                    index + 1,
                    val.config && val.config.instrument_name,
                    val.metricName,
                    <StatusNDL 
                    key={index+1}
                        style={{ 
                            color: "#FFFFFF", 
                            textAlign: "center" 
                        }} 
                        colorbg={val.alarmStatus === "critical" ? "error-alt" :
                            val.alarmStatus === "warning" ? "warning02-alt" :
                            val.alarmStatus === "ok" ? "success-alt" : ""}
                        name={val.alarmStatus} 
                    />,
                    moment(val.alarmTriggeredTime).format("DD/MM/YYYY HH:mm:ss"),
                    <StatusNDL 
                    key={index+1}
                        style={{ 
                            color: {highestPrioritycolor}, 
                            textAlign: "center" 
                        }} 
                        colorbg={colorbg}
                        name={highestPriority} 
                    />,
                    faultText
                ];
            }));
        }
    
        setfintabledata(temptabledata);
    };

    useEffect(()=>{
        processedmetrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[metricsCurrentData])

    const processedmetrows = () => {
        let temptabledata = [];
        if (metricsCurrentData.length > 0) {
            temptabledata = temptabledata.concat(metricsCurrentData.map((val, index) => {
                let faultText = "No Fault";
                if (val.metricName && (val.metricName.toLowerCase().includes("reading") || val.metricName.toLowerCase().includes("voltage"))) {
                    faultText = "-";
                } else if (val.alarmStatus === "ok") {
                    faultText = "NA";
                }

                const tasksForEntity = TaskListData && TaskListData.filter(task => task.entity_id === val.id);

                let highestPriority = "Not reported";
                let highestPrioritycolor = "#202020";
                let colorbg = "neutral-alt";
                if (tasksForEntity && tasksForEntity.length > 0) {
                    const hasHighPriority = tasksForEntity.some(task => task.taskPriority.task_level === "High");
                    const hasMediumPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Medium");
                    const hasLowPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Low");
    
                    if (hasHighPriority || hasMediumPriority || hasLowPriority) {
                        highestPriority = "Report Done";
                        highestPrioritycolor = "#FFFFFF";
                        colorbg = "success-alt"; 
                    }
                }
    
                return [
                    index + 1,
                    val.config && val.config.instrument_name,
                    val.metricName,
                    <StatusNDL 
                    key={index+1}
                        style={{ 
                            color: "#FFFFFF", 
                            textAlign: "center" 
                        }} 
                        colorbg={val.alarmStatus === "critical" ? "error-alt" :
                            val.alarmStatus === "warning" ? "warning02-alt" :
                            val.alarmStatus === "ok" ? "success-alt" : ""}
                        name={val.alarmStatus} 
                    />,
                    moment(val.alarmTriggeredTime).format("DD/MM/YYYY HH:mm:ss"),
                    <StatusNDL 
                    key={index+1}
                    style={{ 
                        color: {highestPrioritycolor}, 
                        textAlign: "center" 
                    }} 
                    colorbg={colorbg}
                    name={highestPriority} 
                />,
                    faultText
                ];
            }));
        }
    
        setmettabledata(temptabledata);
    };

    useEffect(() => {
        if (!mostDisconnectedInstrumentLoading && mostDisconnectedInstrumentData && !mostDisconnectedInstrumentError) {
            // console.log("mostDisconnectedInstrumentData", mostDisconnectedInstrumentData)
            if (mostDisconnectedInstrumentData.mostDisconnectedOverall && mostDisconnectedInstrumentData.mostDisconnectedToday) {
                setMostDisconnectedOverall(mostDisconnectedInstrumentData.mostDisconnectedOverall)
                setMostDisconnectedToday(mostDisconnectedInstrumentData.mostDisconnectedToday)
            }
            else {
                setMostDisconnectedOverall([])
                setMostDisconnectedToday([])
            }
        }
        else {
            setMostDisconnectedOverall([])
            setMostDisconnectedToday([])
        }
        setMostDisconnectedLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mostDisconnectedInstrumentData])

    useEffect(() => {
        if (!AlertsOverviewLoading && AlertsOverviewData && !AlertsOverviewError &&
            !getAlarmAcknowledgementLoading &&
            getAlarmAcknowledgementData &&
            getAlarmAcknowledgementData.length > 0 &&
            !getAlarmAcknowledgementError &&
            !UsersListForLineLoading &&
            UsersListForLineData &&
            UsersListForLineData.length > 0 &&
            metricsunitData && metricsunitData.length > 0 &&
            !UsersListForLineError) {
            processedrowshistory()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[AlertsOverviewData, isackdis,
            getAlarmAcknowledgementLoading,
            getAlarmAcknowledgementData,
            getAlarmAcknowledgementError,
            UsersListForLineLoading,
            UsersListForLineData,
            UsersListForLineError,
            metricsunitData,
        isHomeOkAlert, isHomeWarningAlert, isHomeCriticalAlert]);

        const processedrowshistory = () => {
            let temptabledata = [];
            let objectTableData = [];
        
            if (AlertsOverviewData && AlertsOverviewData.finalAlertsData && AlertsOverviewData.finalAlertsData.length > 0) {
                const filteredAlerts = AlertsOverviewData.finalAlertsData.filter(alert => {
                    if (alert.alert_level === "ok" && !isHomeOkAlert) return false;
                    if (alert.alert_level === "warning" && !isHomeWarningAlert) return false;
                    if (alert.alert_level === "critical" && !isHomeCriticalAlert) return false;
                    return true;
                });
        
                temptabledata = filteredAlerts.map((val, index) => {
                    const user = UsersListForLineData.find(user => user.userByUserId?.id === val.acknowledge_by)?.userByUserId?.name || "";
                    const acknowledge = getAlarmAcknowledgementData.find(ack => ack.id === parseInt(val.acknowledge_id))?.name || "";
        
                    let faultText = "No Fault";
                    let faultRecommendation = "-";
                    if (val.metric_title && (val.metric_title.toLowerCase().includes("reading") || val.metric_title.toLowerCase().includes("voltage"))) {
                        faultText = "-"; 
                    } else if (val.alert_level === "ok") {
                        faultText = "NA"; 
                    }
        
                    const tasksForEntity = instrumentName
                        ? TaskListData?.filter(task => task.instrument.name === instrumentName) || []
                        : [];
        
                    const matchedInstrument = EntityInstrumentsListData?.find(entity => entity.instrument.id === val.iid);
                    let highestPriority = "Not reported";
                    let highestPrioritycolor = "#202020";
                    let colorbg = "neutral-alt";
        
                    if (tasksForEntity.length > 0) {
                        const hasHighPriority = tasksForEntity.some(task => task.taskPriority.task_level === "High");
                        const hasMediumPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Medium");
                        const hasLowPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Low");
        
                        if (hasHighPriority || hasMediumPriority || hasLowPriority) {
                            highestPriority = "Report Done";
                            highestPrioritycolor = "#FFFFFF";
                            colorbg = "success-alt";
                        }
                    }
        
                    const unitObj = metricsunitData.find(x => x.name === val.key);
                    const criticalityText = val.alert_level || "-";
                    const reportStatus = highestPriority;
                    const objectRow = {
                        SNo: index + 1,
                        Asset: matchedInstrument ? matchedInstrument.entity_instruments.name : "-",
                        Instrument: val.instrument_name || "-",
                        Metrics: val.metric_title || "-",
                        LimitValue: val.alert_level === "critical" ? val.critical_value : val.warn_value || "-",
                        EventValue: Number(val.value) ? Number(val.value).toFixed(2) : "-",
                        Unit: unitObj?.metricUnitByMetricUnit?.unit || "-",
                        Criticality: criticalityText,
                        TriggeredAt: moment(val.time).format("DD/MM/YYYY HH:mm:ss"),
                        CheckedAt: val.config ? moment(val.config.last_check_value_time).format("DD/MM/YYYY HH:mm:ss") : "-",
                        AlertType: val.alert_type,
                        ReportStatus: reportStatus,
                        AcknowledgedBy: user,
                        AnalystRemark: acknowledge,
                        PDMFaults: faultText,
                        PDMRecommendation: faultRecommendation,
                        iid : val.iid,
                        metricKey: val.key,
                        assetID:matchedInstrument ? matchedInstrument.entity_instruments.id : "-",
                        instrument_id: val.iid
                    };
        
                    objectTableData.push(objectRow);
        
                    return [
                        index + 1, 
                        matchedInstrument ? matchedInstrument.entity_instruments.name : "-",
                        val.instrument_name || "-",
                        val.metric_title || "-",
                        val.alert_level === "critical" ? val.critical_value : val.warn_value || "-", 
                        (Number(val.value) ? Number(val.value).toFixed(2) : "-"),
                        unitObj?.metricUnitByMetricUnit?.unit || "-",
                        <StatusNDL
                        key={index+1}
                            style={{
                                color: "#FFFFFF",
                                textAlign: "center",
                            }}
                            colorbg={
                                val.alert_level === "critical" ? "error-alt"
                                    : val.alert_level === "warning" ? "warning02-alt"
                                        : val.alert_level === "ok" ? "success-alt"
                                            : ""
                            }
                            name={val.alert_level || "-"} 
                        />,
                        moment(val.time).format("DD/MM/YYYY HH:mm:ss"),
                        val.config ? moment(val.config.last_check_value_time).format("DD/MM/YYYY HH:mm:ss") : "-", 
                        val.alert_type,
                        <StatusNDL
                        key={index+1}
                            style={{
                                color: highestPrioritycolor,
                                textAlign: "center",
                            }}
                            colorbg={colorbg}
                            name={highestPriority} 
                        />,
                        user,
                        acknowledge,
                        faultText, 
                        faultRecommendation, 
                        (val.viid === null && OverviewTypes !== "tool" && val.alert_level !== "ok") && (
                            val.acknowledge_id !== null ? (
                                <Button
                                    type="ghost"
                                    disabled={isackdis === 1 || val.acknowledge_id !== null}
                                    value={t("Acknowledged")}
                                />
                            ) : (
                                <Button
                                    type="ghost"
                                    disabled={isackdis === 1}
                                    onClick={() => menuItemClick(2, val, "his", sethistorydata(true))}
                                    value={t("Acknowledge")}
                                />
                            )
                        ),
                        val.alert_level,
                        val.viid,
                        val.acknowledge_id ? "Acknowledged" : "Unacknowledged"
                    ];
                });
            }
        
            settablehistorydata(temptabledata);
            sethistoryrawdata(objectTableData);
        };
           
    
// NOSONAR
    useEffect(() => {
        if (!AlertsOverviewLoading && AlertsOverviewData && !AlertsOverviewError) {
            // Check if AlertsOverviewData has the expected structure
            if (AlertsOverviewData.data && AlertsOverviewData.data.length > 0) {
                if(groupByFilter === 1 || selected === "tile"){
                setOverallAlarmsTriggered(AlertsOverviewData.data);
                } else if(groupByFilter === 2 || selected === "table"){
                    setOverallAlarmsTriggered(AlertsOverviewData.finalAlertsData);
                    } else {
                        setOverallAlarmsTriggered(AlertsOverviewData.data);
                    }
                if(groupByFilter === 1){
                setOverallAlarmsTriggered(AlertsOverviewData.data);
                } else if(groupByFilter === 2){
                    setOverallAlarmsTriggered(AlertsOverviewData.finalAlertsData);
                    } 
            }
            else {
                setOverallAlarmsTriggered([])
                setFilteredOverallAlarmsTriggered([])
                setHomeCurrentData([])
                sethomeCurrentDataOverall([])
                setConnectivityData([])
            }
            // Optional chaining is used here to handle null or undefined properties
            setToadyCritical(Number(AlertsOverviewData?.todayCriticalAlerts || 0));
            setTotalCritical(Number(AlertsOverviewData?.totalCriticalAlerts || 0));
            setTotalWarning(Number(AlertsOverviewData?.totalWarningAlerts || 0));
            setTotalAlarmsTriggered(Number(AlertsOverviewData?.totalAlarmsTriggered || 0));
            setTotalDataAlert(Number(AlertsOverviewData?.totalDataAlert || 0));
            setTotalTimeslotAlert(Number(AlertsOverviewData?.totalTimeslotAlert || 0));
            setTotalDowntimeAlert(Number(AlertsOverviewData?.totalDowntimeAlert || 0));
            setTotalToolAlert(Number(AlertsOverviewData?.totalToolAlert || 0))
            setTotalConnectivityAlert(Number(AlertsOverviewData?.totalConnectivityAlert || 0));
            setAlarmAcknowledged(Number(AlertsOverviewData?.alarmAcknowledged || 0));
            setAlarmYetToAcknowleded(Number(AlertsOverviewData?.alarmYetToAcknowleded || 0));
            setAlarmAcknowledgePercentage(Number(AlertsOverviewData?.alarmAcknowledgePercentage || 0));
            setTotalAlarmsLength(Number(AlertsOverviewData?.totalAlerts || 0))
        }
        else {
            setOverallAlarmsTriggered([])
            setFilteredOverallAlarmsTriggered([])
            setHomeCurrentData([])
            sethomeCurrentDataOverall([])
            setConnectivityData([])
            setToadyCritical(0);
            setTotalCritical(0);
            setTotalWarning(0);
            setTotalAlarmsTriggered(0);
            setTotalDataAlert(0);
            setTotalTimeslotAlert(0);
            setTotalDowntimeAlert(0)
            setTotalToolAlert(0)
            setTotalConnectivityAlert(0);
            setAlarmAcknowledged(0);
            setAlarmYetToAcknowleded(0);
            setAlarmAcknowledgePercentage(0);
            setTotalAlarmsLength(0);
        }

        setAlertsOverviewDataLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AlertsOverviewData, groupByFilter, selected]);

    
    const handleSwitch = (type) => {
        setSelected(type);
        setGroupByFilter(1)
    };

    useEffect(()=>{
        if(page === 'home'){
            setMetSelected('tile');
        }
    },[page])

    const handleMetSwitch = (type) => {
        setMetSelected(type);
    };

    const handleFinSwitch = (type) => {
        setFinSelected(type);
    };

    useEffect(() => {
        if (!AlertsDowntimeLoading && AlertsDowntimeData && !AlertsDowntimeError) {

          

            if (AlertsDowntimeData && AlertsDowntimeData.data && AlertsDowntimeData.data.length > 0) {
                let resultantArray = [];
                let count = 0;
              
                AlertsDowntimeData.data && AlertsDowntimeData.data.length > 0 && AlertsDowntimeData.data.forEach(obj => {
                    if (obj.Total_Critical > 5) {
                        resultantArray.push({
                            name: obj.name,
                            TotalAlert: obj.Total_Critical + obj.Total_Warning
                        });
                        count++;
                    }
                });
                setCount(count);
                setDowntimeAssetData(resultantArray);
            }


        }
    }, [AlertsDowntimeLoading, AlertsDowntimeData, AlertsDowntimeError])

    useEffect(() => {
        if (!AlertsTodayDowntimeLoading && AlertsTodayDowntimeData && !AlertsTodayDowntimeError) {

            if (AlertsTodayDowntimeData && AlertsTodayDowntimeData.data && AlertsTodayDowntimeData.data.length > 0 && Array.isArray(AlertsTodayDowntimeData.data)) {
                let count = 0;
                console.log(AlertsTodayDowntimeData,"AlertsTodayDowntimeData")
                AlertsTodayDowntimeData.data.forEach(obj => {
                    if (obj.Total_Critical > 5) {
                        count++;
                    }
                });
                if (count === 0) {
                    count = 0;
                }
                setCountToday(count);
            } else {
                setCountToday(0);
            }


        }
    }, [AlertsTodayDowntimeLoading, AlertsTodayDowntimeData, AlertsTodayDowntimeError])


    useEffect(() => {

        if (!ConnectivityOverviewLoading && ConnectivityOverviewData && !ConnectivityOverviewError) {


            if (ConnectivityOverviewData.data && ConnectivityOverviewData.data.length > 0) {
                setOverallAlarmsTriggered(ConnectivityOverviewData.data);
            }
            else {
                setOverallAlarmsTriggered([])
                setFilteredOverallAlarmsTriggered([])
                setHomeCurrentData([])
                sethomeCurrentDataOverall([])
                setConnectivityData([])
            }

            // Optional chaining is used here to handle null or undefined properties
            setTotalAlarmsTriggered(Number(ConnectivityOverviewData?.totalAlarmsTriggered || 0));
            setTotalDataAlert(Number(ConnectivityOverviewData?.totalDataAlert || 0));
            setTotalTimeslotAlert(Number(ConnectivityOverviewData?.totalTimeslotAlert || 0));
            setTotalDowntimeAlert(Number(ConnectivityOverviewData?.totalDowntimeAlert || 0));
            setTotalConnectivityAlert(Number(ConnectivityOverviewData?.totalConnectivityAlert || 0));
            setAlarmAcknowledged(Number(ConnectivityOverviewData?.alarmAcknowledged || 0));
            setAlarmYetToAcknowleded(Number(ConnectivityOverviewData?.alarmYetToAcknowleded || 0));
            setAlarmAcknowledgePercentage(Number(ConnectivityOverviewData?.alarmAcknowledgePercentage || 0));
            setTotalAlarmsLength(Number(ConnectivityOverviewData?.totalAlerts || 0))
        }
        else {
            setOverallAlarmsTriggered([])
            setFilteredOverallAlarmsTriggered([])
            setHomeCurrentData([])
            sethomeCurrentDataOverall([])
            setConnectivityData([])

            setTotalAlarmsTriggered(0);
            setTotalDataAlert(0);
            setTotalTimeslotAlert(0);
            setTotalDowntimeAlert(0)
            setTotalConnectivityAlert(0);
            setAlarmAcknowledged(0);
            setAlarmYetToAcknowleded(0);
            setAlarmAcknowledgePercentage(0);
            setTotalAlarmsLength(0);
        }
        setAlertsOverviewDataLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ConnectivityOverviewData])

    const getfetchAlertsOverviewData = () => {
        let queryData = {
            schema: headPlant.schema,
            from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            line_id: headPlant.id,
            alert_type: OverviewTypes,
            instrument_types: categoryTypes
        }
        setAlertsDowntimeDataLoading(true)
        getAlertsOverviewData(queryData)
        sethistorydata(false)
        setoverallsingle(false)
        setbulkack(false)
    }

    const getfetchAlertsDowntimeData = () => {
        let queryData = {
            schema: headPlant.schema,
            from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            line_id: headPlant.id,
            alert_type: "downtime",
            instrument_types: categoryTypes
        }
        setAlertsDowntimeDataLoading(true)
        getAlertsDowntimeData(queryData)
    }

    const getfetchAlertsTodayDowntimeData = () => {

        let queryData = {
            schema: headPlant.schema,
            from: moment(Date.now()).startOf('day').format("YYYY-MM-DDTHH:mm:ss"),
            to: moment(Date.now()).endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
            line_id: headPlant.id,
            alert_type: "downtime",
            instrument_types: categoryTypes
        }
        setAlertsTodayDowntimeDataLoading(true)
        getAlertsTodayDowntimeData(queryData)
    }

    useEffect(() => {
        const storedAlertId = localStorage.getItem("openAlertFromAH");
        
        if (storedAlertId) {
            
          try {
            const alert_id = JSON.parse(storedAlertId);
           
            setalert_id(alert_id);
          } catch (error) {
            console.error("Failed to parse JSON:", error);
            setalert_id(null); 
          }
        } else {
          setalert_id(null); 
        }
      }, []);

    useEffect(()=>{
        if(alert_id){
            const alertdata = homeCurrentData.find(item => item.alert_id === alert_id.id);
            getfetchInstrumentAlertData(alertdata)
            setfetchdata(alertdata)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[alert_id,homeCurrentData])

    const getfetchInstrumentAlertData =(data)=>{
       
        let body
        if (data) {
            if (data.Type === "Asset") {
                body = {
                    schema: headPlant.schema,
                    from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    line_id: headPlant.id,
                    alertType: OverviewTypes,
                    entityType: "Instrument",
                    instrument_ids: data.instrumentsArr,
                    id: data.id,
                    alert_id: data.alert_id,
                    metricKey: "",
                    instrument_types: categoryTypes
                }
            } else if (data.Type === "Instrument") {
            
                const matchedEntity = EntityList.find(
                    (entity) => entity.name === data.name
                );
            
                let instrument_ids = [];
            
                if (matchedEntity && matchedEntity.entity_instruments?.length) {
                    instrument_ids = matchedEntity.entity_instruments.map(
                        (inst) => inst.instrument_id
                    );
                } else if (data.id) {
                    instrument_ids = Array.isArray(data.id) ? data.id : [data.id];
                }
                body = {
                    schema: headPlant.schema,
                    from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    line_id: headPlant.id,
                    alertType: OverviewTypes,
                    entityType: data.Type,
                    instrument_ids: instrument_ids, 
                    id: data.id,
                    alert_id: data.alert_id,
                    metricKey: "",
                    instrument_types: categoryTypes
                }
            } else if (data.Type === "VirtualInstrument") {
                    setvalertid(data.alert_id)
                    body = {
                        schema: headPlant.schema,
                        from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                        to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                        line_id: headPlant.id,
                        alertType: OverviewTypes,
                        entityType: data.Type,
                        instrument_ids: "",
                        id: data.id,
                        alert_id: data.alert_id,
                        metricKey: "",
                        instrument_types: categoryTypes
                    }
                }
            else {
                let instrument_ids = "";

                if (data.instrument_id) {
                    instrument_ids = Array.isArray(data.instrument_id) ? data.instrument_id : [data.instrument_id];
                }
                body = {
                    schema: headPlant.schema,
                    from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    line_id: headPlant.id,
                    alertType: OverviewTypes,
                    entityType: data.Type,
                    instrument_ids: instrument_ids,
                    id: data.virtualInstrumentId,
                    alert_id: data.alert_id,
                    metricKey: data.metricKey,
                    instrument_types: categoryTypes
                }
            }
        }
        getInstrumentAlertData(body)
        setbulkack(false)
    }

    const getfetchConnectivityOverviewData = () => {
        let queryData = {
            schema: headPlant.schema,
            from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            line_id: headPlant.id,
            alert_type: OverviewTypes,
            instrument_types: categoryTypes
        }
        getConnectivityOverviewData(queryData)

        let queryParam = {
            schema: headPlant.schema,
            from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
            line_id: headPlant.id,
            instrument_types: categoryTypes
        }
        setMostDisconnectedLoading(true)
        getMostDisconnectedInstrument(queryParam)
    }

    const getFetchConnectivityAlertData = (data) => {
        let body = {}
        if (data) {
            if (data.Type === "Instrument") {
                body = {
                    schema: headPlant.schema,
                    from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    line_id: headPlant.id,
                    instrument_ids: [data.id],
                    connectivity_id: data.connectivity_id,
                    instrument_types: categoryTypes
                }
            }

        }
        getConnectivityAlerts(body)
    }

    const handleEntityCardActionInstrument = (obj, defect_name, recommendation, type) => {
        let value = obj
        if (OverviewTypes === 'downtime') {
            let AstList = EntityList.filter(f => f.id === value.id)[0].prod_asset_oee_configs[0]
            let metKey
            if (AstList) {
                if (AstList.is_status_signal_available) {
                    metKey = AstList.metricByMachineStatusSignal.name
                } else {
                    metKey = AstList.metric.name
                }
            }
            setEntityName(value.name)
            value = { ...obj, metricKey: metKey, Type: "Metrics", metricName: value.name }
        }
        if (OverviewTypes === 'tool') { 
            setEntityName(value.name)
            value = { ...obj, metricKey: value.metric_name, Type: "Metrics", metricName: value.name }
        }
        console.log(value, "value",OverviewTypes, EntityList.filter(f => f.id === value.id))

        if( value && value.instrumentsArr){
        setdefect_name(value.defect_name ? value.defect_name : defect_name)
        setrecommendation(value.recommendation ? value.recommendation : recommendation)
        }

        setEntityCardData(value)
        if (OverviewTypes === 'connectivity') {

            if(value && value.Type === "Instrument"){
                setPage("Metrics")
                setInstrumentName(value.name)
                let breadCrumbArray = listArray
                breadCrumbArray.push({ index: "Metrics", name: value.name })
                setListArray(breadCrumbArray)

                getFetchConnectivityAlertData(value)
            }

        } else {
            if (value.Type === "Asset") {
                setEntityName(value.name)
                 setEntityID(value.id)
                    value = {...value, Type : "Instrument", id : value.instrumentsArr} 
            }
            if (value && (value.Type === "Instrument" || value.Type === "VirtualInstrument" || value.Type === "Metrics")) {

                let type = ((value.Type === "Instrument" || value.Type === "VirtualInstrument") ? "Metrics" : "MetricsDetails")
                setPage(type)
                if (value.Type === "Instrument" || value.Type === "VirtualInstrument") {
                    setInstrumentName(value.name)
                }
                let name = value.Type === "Metrics" ? value.metricName : value.name
                let breadCrumbArray = listArray
                breadCrumbArray.push({ index: type, name: name })
                setListArray(breadCrumbArray)
            }
            getfetchInstrumentAlertData(value)
            setfetchdata(value)

        }

    }

    const handleActiveIndex = (index, item) => {
        console.log(index,item,"item")
        if (index === 0) {
            setPage('home')
            setListArray([{ index: 'home', name: headPlant.name }])
            setEntityID("")
            setEntityName("")
            setInstrumentName("")
            setGroupByFilter(1)
            setFilteredOverallInstrumentAlarms([])
            setFilteredOverallMetricsAlarms([])
            setFilteredOverallMetricDetailsAlarms([])
            setInstrumentCurrentData([])
            setMetricsCurrentData([])
            setMetricDetailsCurrentData([])
            setHomeSearchText("")
            setHomeInput(false)
            setInstrumentSearchText("")
            setInstrumentInput(false)
            setMetricsSearchText("")
            setMetricsInput(false)
            setMetricDetailsSearchText("")
            setMetricDetailsInput(false)
        } else {
            setPage(item.index)
            let breadCrumbArray = listArray
            let newBreadCrumb = []
            breadCrumbArray.forEach((x, i) => {
                if (i <= index) {
                    newBreadCrumb.push({ index: x.index, name: x.name })
                }
                else {
                    if (x.index === "Instrument" ) {
                        setFilteredOverallInstrumentAlarms([])
                        setFilteredOverallMetricsAlarms([])
                        setFilteredOverallMetricDetailsAlarms([])
                        setInstrumentCurrentData([])
                        setMetricsCurrentData([])
                        setMetricDetailsCurrentData([])
                        setInstrumentSearchText("")
                        setInstrumentInput(false)
                        setMetricsSearchText("")
                        setMetricsInput(false)
                        setMetricDetailsSearchText("")
                        setMetricDetailsInput(false)
                    }
                    if (x.index === "Metrics") {
                        setFilteredOverallMetricsAlarms([])
                        setFilteredOverallMetricDetailsAlarms([])
                        setMetricsCurrentData([])
                        setMetricDetailsCurrentData([])
                        setMetricsSearchText("")
                        setMetricsInput(false)
                        setMetricDetailsSearchText("")
                        setMetricDetailsInput(false)
                    }
                    if (x.index === "MetricsDetails") {
                        setFilteredOverallMetricDetailsAlarms([])
                        setMetricDetailsCurrentData([])
                        setMetricDetailsSearchText("")
                        setMetricDetailsInput(false)
                    }
                }

            })
            setListArray(newBreadCrumb)
        }

    };




    //#region home

    const homeTagFilter = (type) => {
        if (OverviewTypes === 'connectivity') {
            if (type === "active") {
                setIsHomeOkAlert(!isHomeOkAlert)
            }
            if (type === "inactive") {
                setIsHomeCriticalAlert(!isHomeCriticalAlert)
            }

        } else {
            if (type === "ok") {
                setIsHomeOkAlert(!isHomeOkAlert)
            }
            if (type === "warning") {
                setIsHomeWarningAlert(!isHomeWarningAlert)
            }
            if (type === "critical") {
                setIsHomeCriticalAlert(!isHomeCriticalAlert)
            }
        }
    }
// NOSONAR
    useMemo(() => {

        
        if (overallAlarmsTriggered && overallAlarmsTriggered.length > 0) {
            let OverallTriggered
            if (OverviewTypes === 'downtime') {
                OverallTriggered = overallAlarmsTriggered.filter(x => x.entity_type === OverviewTypes && x.Type === 'Asset')
            } else if (OverviewTypes !== 'connectivity') {
                OverallTriggered = overallAlarmsTriggered.filter(x => x.entity_type !== "downtime")
            }else if (OverviewTypes === 'tool') {
                OverallTriggered = overallAlarmsTriggered.filter(x => x.entity_type === "tool")
            }else {
                OverallTriggered = [...overallAlarmsTriggered]
            }
            let TotalArray = []
            if (debouncedHomeSearchText && debouncedHomeSearchText !== '') {
                const searchFilter = OverallTriggered.filter(item =>
                    Object.values(item).some(value =>
                        typeof value === 'string' && value.toLowerCase().includes(debouncedHomeSearchText.toLowerCase())
                    )
                );
                TotalArray = searchFilter;
            } else if (!isHomeOkAlert || !isHomeWarningAlert || !isHomeCriticalAlert) {
                let cloneTagData = [...OverallTriggered]
                
                if(groupByFilter === 2){
                    if (OverviewTypes === 'connectivity') {
                        if (!isHomeOkAlert) {
                            cloneTagData = cloneTagData.filter(x => x.alert_level !== "active")
                        }
                        if (!isHomeCriticalAlert) {
                            cloneTagData = cloneTagData.filter(x => x.alert_level !== "inactive")
                        }
                    }
                    else {
                        if (!isHomeOkAlert) {
                            cloneTagData = cloneTagData.filter(x => x.alert_level !== "ok")
                        }
                        if (!isHomeWarningAlert) {
                            cloneTagData = cloneTagData.filter(x => x.alert_level !== "warning")
                        }
                        if (!isHomeCriticalAlert) {
                            cloneTagData = cloneTagData.filter(x => x.alert_level !== "critical")
                        }
    
                    }
                } else {
                if (OverviewTypes === 'connectivity') {
                    if (!isHomeOkAlert) {
                        cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "active")
                    }
                    if (!isHomeCriticalAlert) {
                        cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "inactive")
                    }
                }
                else {
                    if (!isHomeOkAlert) {
                        cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "ok")
                    }
                    if (!isHomeWarningAlert) {
                        cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "warning")
                    }
                    if (!isHomeCriticalAlert) {
                        cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "critical")
                    }

                }
            }
                TotalArray = cloneTagData;
            } else {
                TotalArray = OverallTriggered;
            }
            setFilteredOverallAlarmsTriggered(TotalArray)
            if (props.overviewFilter === 'connectivity' && props.connectivityFilter !== 'all') {
                let filter = props.connectivityFilter === "instruments" ? 1 : 2;
                let temp = TotalArray.filter(t => t.connectivity_type == filter)
                setHomeCurrentData(temp.slice(0, homeRowsPerPage))
                sethomeCurrentDataOverall(temp)
            }
            else {
                setHomeCurrentData(TotalArray.slice(0, homeRowsPerPage))
                sethomeCurrentDataOverall(TotalArray)
            }
            setConnectivityData(TotalArray.slice(0, homeRowsPerPage))

        }
        else {
            setFilteredOverallAlarmsTriggered([])
            setHomeCurrentData([])
            sethomeCurrentDataOverall([])
            setConnectivityData([])
            setHomeCurrentPage(0)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedHomeSearchText, overallAlarmsTriggered, isHomeOkAlert, isHomeWarningAlert, isHomeCriticalAlert])

    useEffect(() => {
        if (overallAlarmsTriggered && overallAlarmsTriggered.length > 0 && groupByFilter !== 2) {
            const alertIds = overallAlarmsTriggered.map(alarm => alarm.alert_id);
            getAlarmMetrics(alertIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overallAlarmsTriggered,]);

    useEffect(() => {
        if(moduleName === 'overview' && isFirstTime && queryParam && (queryParam.includes('=') || queryParam.includes('&'))){
            // Split the query string at '&' to separate each key-value pair
            const paramsArray = queryParam.split('&'); 
                        
            // Create an empty object to store the values
            const queryParams = {};
            
            // Iterate over the array and split each key-value pair
            paramsArray.forEach(param => {   const [key, value] = param.split('=');   
            queryParams[key] = value; });
            
            // Extracting the respective values
            const asset = queryParams['asset'];
            const instrument = queryParams['instrument'];
            if(asset || instrument){
                setAssetParam(asset)
                setInstrumentParam(instrument)
            }
            setIsFirstTime(false)
        }
       
        if (!alarmMetricsLoading && alarmMetricsData && !alarmMetricsError && filteredOverallAlarmsTriggered.length > 0) {
            const alarmMetricsDataMap = {};
            alarmMetricsData.forEach(data => {
                alarmMetricsDataMap[data.id] = data;
            });

            const updatedAlarms = filteredOverallAlarmsTriggered.map(alarm => {
                const matchingMetricsData = alarmMetricsDataMap[alarm.alert_id];
                if (matchingMetricsData) {
                    return {
                        ...alarm,
                        metric_name: matchingMetricsData.metric_name
                    };
                } else {
                    return alarm;
                }
            });
            console.log(updatedAlarms,"updated alarms")
            setFilteredOverallAlarmsTriggered(updatedAlarms)
           setInstrumentCurrentData(updatedAlarms.slice(0, instrumentRowsPerPage))
            setHomeCurrentData(updatedAlarms.slice(0, homeRowsPerPage))
            sethomeCurrentDataOverall(updatedAlarms)
            if(moduleName === 'overview'){
                
                if((assetParam) && !instrumentParam && page === 'home' && updatedAlarms.length > 0){
                    console.log(assetParam,instrumentParam,"assetParam")
                   let filteredAsset = updatedAlarms.filter(obj => obj.id === assetParam);
                    if(filteredAsset.length > 0){
                        console.log(filteredAsset,assetParam,"filtered 0")
                        handleEntityCardActionInstrument(filteredAsset[0])
                        setAssetParam('')
                    }
                    else{
                        setErrorPage(true)
                    }
                   
                    
                }
                else if(!assetParam && instrumentParam && page === 'home' && updatedAlarms.length > 0){
                  
                    let filteredInstrument = updatedAlarms.filter(inst => inst.id ===  instrumentParam)
                    if(filteredInstrument.length > 0){
                        handleEntityCardActionInstrument(filteredInstrument[0])
                        setInstrumentParam('')
                        console.log(instrumentParam,filteredInstrument,"filtered 1")
                    }
                    else{
                        setErrorPage(true)
                    }
                  
                }
                else if(assetParam && instrumentParam && updatedAlarms.length > 0){
                    if(page === 'home'){
                        let filteredAsset = updatedAlarms.filter(obj => obj.id === assetParam);
                        if(filteredAsset.length > 0){
                            console.log(filteredAsset,assetParam,"filtered 2")
                            handleEntityCardActionInstrument(filteredAsset[0])
                        }
                        else{
                            setErrorPage(true)
                        }
                       
                       
                    }
                    else if(page === 'Instrument'  && updatedAlarms.slice(0, instrumentRowsPerPage).length > 0){
                        let filteredInstrument = updatedAlarms.slice(0, instrumentRowsPerPage).filter(obj => obj.id ===instrumentParam)
                        
                        if(filteredInstrument.length > 0){
                            handleEntityCardActionInstrument(filteredInstrument[0])
                            setAssetParam('')
                            setInstrumentParam('')
                        }
                        else {
                            setErrorPage(true)
                        }
                       
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alarmMetricsLoading, alarmMetricsData, alarmMetricsError,assetParam,instrumentParam,page,queryParam]);       

    useEffect(() => {
        if (filteredOverallAlarmsTriggered && filteredOverallAlarmsTriggered.length > 0) {
          const filteredData = filteredOverallAlarmsTriggered.filter(item => item.alert_id === alert_id && alert_id.id);
          if (filteredData.length > 0) {
            setInstrumentCurrentData(filteredData)
          } 
        }
      }, [alert_id, filteredOverallAlarmsTriggered]);

    const clickAwayHomeSearch = () => {
        if (homeSearchText === '')
            setHomeInput(false)
        else
            setHomeInput(true)
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedHomeSearchText(homeSearchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [homeSearchText]);

    const updateHomeSearch = useCallback((e) => {
        setHomeSearchText(e.target.value);
    }, [setHomeSearchText]);

    const handleHomePageChange = (e, pageNumber) => {
        setHomeCurrentPage(pageNumber);
        const startIndex = pageNumber * homeRowsPerPage;
        const endIndex = startIndex + homeRowsPerPage;
        setHomeCurrentData(filteredOverallAlarmsTriggered.slice(startIndex, endIndex))
        sethomeCurrentDataOverall(filteredOverallAlarmsTriggered)
        setConnectivityData(filteredOverallAlarmsTriggered.slice(startIndex, endIndex))

    }

    const handleHomeRowsPerPageChange = (event) => {
        setHomeRowsPerPage(parseInt(event.target.value))
        let endIndex = parseInt(event.target.value)
        setHomeCurrentData(filteredOverallAlarmsTriggered.slice(0, endIndex))
        sethomeCurrentDataOverall(filteredOverallAlarmsTriggered)
        setConnectivityData(filteredOverallAlarmsTriggered.slice(0, endIndex))
        setHomeCurrentPage(0)
    }

    //#endregion



    //#region Instrument

    const instrumentTagFilter = (type) => {
        if (type === "ok") {
            setIsInstrumentOkAlert(!isInstrumentOkAlert)
        }
        if (type === "warning") {
            setIsInstrumentWarningAlert(!isInstrumentWarningAlert)
        }
        if (type === "critical") {
            setIsInstrumentCriticalAlert(!isInstrumentCriticalAlert)
        }
    }
// NOSONAR
    useMemo(() => {

        if (overallInstrumentAlarms && overallInstrumentAlarms.length > 0) {

            let TotalArray = []
            if (debouncedInstrumentSearchText && debouncedInstrumentSearchText !== '') {
                const searchFilter = overallInstrumentAlarms.filter(item =>
                    Object.values(item).some(value =>
                        typeof value === 'string' && value.toLowerCase().includes(debouncedInstrumentSearchText.toLowerCase())
                    )
                );
                TotalArray = searchFilter;
            } else if (!isInstrumentOkAlert || !isInstrumentWarningAlert || !isInstrumentCriticalAlert) {
                let cloneTagData = [...overallInstrumentAlarms]
                if (!isInstrumentOkAlert) {
                    cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "ok")
                }
                if (!isInstrumentWarningAlert) {
                    cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "warning")
                }
                if (!isInstrumentCriticalAlert) {
                    cloneTagData = cloneTagData.filter(x => x.CriticalityType !== "critical")
                }
                TotalArray = cloneTagData;
            } else {
                TotalArray = overallInstrumentAlarms;
            }
            setInstrumentCurrentPage(0)
            setFilteredOverallInstrumentAlarms(TotalArray)
            setInstrumentCurrentData(TotalArray.slice(0, instrumentRowsPerPage))

        }
        else {
            setFilteredOverallInstrumentAlarms([])
            setInstrumentCurrentData([])
            setInstrumentCurrentPage(0)
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedInstrumentSearchText, overallInstrumentAlarms, isInstrumentOkAlert, isInstrumentWarningAlert, isInstrumentCriticalAlert])

  
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInstrumentSearchText(instrumentSearchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [instrumentSearchText]);

    const handleInstrumentPageChange = (e, pageNumber) => {
        setInstrumentCurrentPage(pageNumber);
        const startIndex = pageNumber * instrumentRowsPerPage;
        const endIndex = startIndex + instrumentRowsPerPage;
        setInstrumentCurrentData(filteredOverallInstrumentAlarms.slice(startIndex, endIndex))

    }

    const handleInstrumentRowsPerPageChange = (event) => {
        setInstrumentRowsPerPage(parseInt(event.target.value))
        let endIndex = parseInt(event.target.value)
        setInstrumentCurrentData(filteredOverallInstrumentAlarms.slice(0, endIndex))
        setInstrumentCurrentPage(0)
    }

    //#endregion

    //#region Metrics

    const metricsTagFilter = (type) => {
        if (OverviewTypes === 'connectivity') {
            if (type === "active") {
                setIsMetricsOkAlert(!isMetricsOkAlert)
            }
            if (type === "inactive") {
                setIsMetricsCriticalAlert(!isMetricsCriticalAlert)
            }

        } else {
            if (type === "ok") {
                setIsMetricsOkAlert(!isMetricsOkAlert)
            }
            if (type === "warning") {
                setIsMetricsWarningAlert(!isMetricsWarningAlert)
            }
            if (type === "critical") {
                setIsMetricsCriticalAlert(!isMetricsCriticalAlert)
            }
        }
    }
// NOSONAR
    useMemo(() => {
        if (overallMetricsAlarms && overallMetricsAlarms.length > 0) {
            let filteredArray = [...overallMetricsAlarms];

            if (debouncedMetricsSearchText && debouncedMetricsSearchText !== '') {
                filteredArray = filteredArray.filter(item =>
                    Object.values(item).some(value =>
                        typeof value === 'string' &&
                        value.toLowerCase().includes(debouncedMetricsSearchText.toLowerCase())
                    )
                );
            } else if (!isMetricsOkAlert || !isMetricsWarningAlert || !isMetricsCriticalAlert) {
                if (OverviewTypes === 'connectivity') {
                    if (!isMetricsOkAlert) filteredArray = filteredArray.filter(x => x.alarmStatus !== "active");
                    if (!isMetricsCriticalAlert) filteredArray = filteredArray.filter(x => x.alarmStatus !== "inactive");
                } else {
                    if (!isMetricsOkAlert) filteredArray = filteredArray.filter(x => x.alarmStatus !== "ok");
                    if (!isMetricsWarningAlert) filteredArray = filteredArray.filter(x => x.alarmStatus !== "warning");
                    if (!isMetricsCriticalAlert) filteredArray = filteredArray.filter(x => x.alarmStatus !== "critical");
                }
            }

            const grouped = {};
            filteredArray.forEach(item => {
                const baseName = getBaseAlarmName(item?.alarmName);
                const key = `${item?.metricKey}-${baseName}`;

                if (!grouped[key]) grouped[key] = [];

                grouped[key].push({
                    ...item,
                    alarmName: baseName,
                });
            });

            const updated = Object.values(grouped).flatMap(group => {
                const sorted = group.sort((a, b) => new Date(a.alarmTriggeredTime) - new Date(b.alarmTriggeredTime));

                let currentStatus = null;
                let count = 0;

                return sorted.map(item => {
                    if (item.alarmStatus !== currentStatus) {
                        currentStatus = item.alarmStatus;
                        count = 0;
                    }

                    const updatedName = count > 0 ? `${item?.alarmName}-${count}` : item?.alarmName;
                    const result = { ...item, alarmName: updatedName, count: count > 0 ? count + 1 : null };

                    count++;
                    return result;
                });
            });

            setMetricsCurrentPage(0);
            setFilteredOverallMetricsAlarms(updated);
            setMetricsCurrentData(updated.slice(0, metricsRowsPerPage));
        } else {
            setFilteredOverallMetricsAlarms([]);
            setMetricsCurrentData([]);
            setMetricsCurrentPage(0);
        }
    }, [debouncedMetricsSearchText, overallMetricsAlarms, isMetricsOkAlert, isMetricsWarningAlert, isMetricsCriticalAlert]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMetricsSearchText(metricsSearchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [metricsSearchText]);

    
    const handleMetricsPageChange = (e, pageNumber) => {
        setMetricsCurrentPage(pageNumber);
        const startIndex = pageNumber * metricsRowsPerPage;
        const endIndex = startIndex + metricsRowsPerPage;
        setMetricsCurrentData(filteredOverallMetricsAlarms.slice(startIndex, endIndex))

    }

    const handleMetricsRowsPerPageChange = (event) => {
        setMetricsRowsPerPage(parseInt(event.target.value))
        let endIndex = parseInt(event.target.value)
        setMetricsCurrentData(filteredOverallMetricsAlarms.slice(0, endIndex))
        setMetricsCurrentPage(0)
    }

    //#endregion


    //#region MetricsDetails

    const metricDetailsTagFilter = (type) => {
        if (type === "ok") {
            setIsMetricDetailsOkAlert(!isMetricDetailsOkAlert)
        }
        if (type === "warning") {
            setIsMetricDetailsWarningAlert(!isMetricDetailsWarningAlert)
        }
        if (type === "critical") {
            setIsMetricDetailsCriticalAlert(!isMetricDetailsCriticalAlert)
        }
    }
// NOSONAR
    useMemo(() => {
        if (overallMetricsAlarms && overallMetricsAlarms.length > 0) {

            let TotalArray = [];

            if (debouncedMetricsSearchText && debouncedMetricsSearchText !== '') {
                const searchFilter = overallMetricsAlarms.filter(item =>
                    Object.values(item).some(value =>
                        typeof value === 'string' && value.toLowerCase().includes(debouncedMetricsSearchText.toLowerCase())
                    )
                );
                TotalArray = searchFilter;
            }
            else if (!isMetricsOkAlert || !isMetricsWarningAlert || !isMetricsCriticalAlert) {
                let cloneTagData = [...overallMetricsAlarms];

                if (OverviewTypes === 'connectivity') {
                    if (!isMetricsOkAlert) {
                        cloneTagData = cloneTagData.filter(x => x.alarmStatus !== "active");
                    }
                    if (!isMetricsCriticalAlert) {
                        cloneTagData = cloneTagData.filter(x => x.alarmStatus !== "inactive");
                    }
                } else {
                    if (!isMetricsOkAlert) {
                        cloneTagData = cloneTagData.filter(x => x.alarmStatus !== "ok");
                    }
                    if (!isMetricsWarningAlert) {
                        cloneTagData = cloneTagData.filter(x => x.alarmStatus !== "warning");
                    }
                    if (!isMetricsCriticalAlert) {
                        cloneTagData = cloneTagData.filter(x => x.alarmStatus !== "critical");
                    }
                }

                TotalArray = cloneTagData;
            }
            else {
                TotalArray = overallMetricsAlarms;
            }

            const groups = {};
            TotalArray.forEach((item) => {
                const baseName = getBaseAlarmName(item.alarmName);
                const key = `${item.metricKey}-${baseName}`;

                if (!groups[key]) groups[key] = [];

                groups[key].push({
                    ...item,
                    alarmName: baseName
                });
            });

            const updatedGroups = Object.values(groups).map((group) => {
                const sortedGroup = group.sort(
                    (a, b) => new Date(a.alarmTriggeredTime) - new Date(b.alarmTriggeredTime)
                );

                let result = [];
                let currentStatus = null;
                let count = 0;

                sortedGroup.forEach((item) => {
                    if (item.alarmStatus !== currentStatus) {
                        currentStatus = item.alarmStatus;
                        count = 0;
                    }

                    result.push({
                        ...item,
                        alarmName: count > 0 ? `${item.alarmName}-${count}` : item.alarmName,
                        count: count > 0 ? count + 1 : null
                    });

                    count++;
                });

                return result;
            });

            const finalData = updatedGroups
                .flat()
                .sort((a, b) => new Date(b.alarmTriggeredTime) - new Date(a.alarmTriggeredTime));

            setMetricsCurrentPage(0);
            setFilteredOverallMetricsAlarms(finalData);
            setMetricsCurrentData(finalData.slice(0, metricsRowsPerPage));
        } else {
            setFilteredOverallMetricsAlarms([]);
            setMetricsCurrentData([]);
            setMetricsCurrentPage(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedMetricsSearchText, overallMetricsAlarms, isMetricsOkAlert, isMetricsWarningAlert, isMetricsCriticalAlert]);

   
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMetricDetailsSearchText(metricDetailsSearchText);
        }, 500); // Adjust the delay as needed
        return () => clearTimeout(timer);
    }, [metricDetailsSearchText]);

    const handleMetricDetailsPageChange = (e, pageNumber) => {
        setMetricDetailsCurrentPage(pageNumber);
        const startIndex = pageNumber * metricDetailsRowsPerPage;
        const endIndex = startIndex + metricDetailsRowsPerPage;
        setMetricDetailsCurrentData(filteredOverallMetricDetailsAlarms.slice(startIndex, endIndex))

    }

    const handleMetricDetailsRowsPerPageChange = (event) => {
        setMetricDetailsRowsPerPage(parseInt(event.target.value))
        let endIndex = parseInt(event.target.value)
        setMetricDetailsCurrentData(filteredOverallMetricDetailsAlarms.slice(0, endIndex))
        setMetricDetailsCurrentPage(0)
    }


    //#endregion

    const sortByOption = [
        { id: 1, name: t("Minimum") },
        { id: 2, name: t("Maximum") },
        { id: 3, name: t("Recent") },
        { id: 4, name: t("Oldest") }
    ]

    const handleSortByChange = (e) => {
        setSortByFilter(e.target.value)

        let sortedData = handleSortBy(filteredOverallMetricDetailsAlarms, e.target.value)
        setMetricDetailsCurrentData(sortedData.slice(0, metricDetailsRowsPerPage))
    }

    const handleGroupByChange = (e) => {
        setGroupByFilter(e.target.value)
    }

    useEffect(()=>{
        const groupedData = processGroupedData(metricsCurrentData,  groupByFilter);
        setupmetricsCurrentData(groupedData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[metricsCurrentData])

    useEffect(()=>{
        const groupedData = processGroupedData(updatedMetricDetails, groupByFilter)
        setupupdatedMetricDetails(groupedData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[updatedMetricDetails])

    const handleSortGroupByChange = (e) => {
        setGroupByFilter( e.target.value);  
        const groupedData = processGroupedData(metricsCurrentData,  e.target.value);
        setupmetricsCurrentData(groupedData);
    };
    
    const handleSortsGroupByChange = (e) => {
        setGroupByFilter(e.target.value)
        const groupedData = processGroupedData(updatedMetricDetails, e.target.value)
        setupupdatedMetricDetails(groupedData)
    }

    const processGroupedData = (data, groupByFilter) => {
        const allData = data;
        switch (groupByFilter) {
            case 1:
                return { groupedData: { All: allData } };
    
            case 2: {
                const acknowledged = allData.filter(item => item.acknowledgeID !== null);
                const unacknowledged = allData.filter(item => item.acknowledgeID === null);
                const groupedData = {};
                if (acknowledged.length > 0) groupedData.Acknowledged = acknowledged;
                if (unacknowledged.length > 0) groupedData.Unacknowledged = unacknowledged;
                return { groupedData };
            }
    
            case 3:
                return {
                    groupedData: allData.reduce((acc, item) => {
                        const key = item.alarmStatus || "-";
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(item);
                        return acc;
                    }, {}),
                };
    
            case 4:
                return {
                    groupedData: allData.reduce((acc, item) => {
                        const key = item.config.instrument_name || "-";
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(item);
                        return acc;
                    }, {}),
                };
    
            case 5:
                return {
                    groupedData: allData.reduce((acc, item) => {
                        const key = item.metricName || "-";
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(item);
                        return acc;
                    }, {}),
                };
    
            default:
                return { groupedData: { All: allData } };
        }
    };


    const handleSortBy = (data, sortBy) => {

        if (sortBy === 1) {
            data.sort((a, b) => a.alarmValue - b.alarmValue);
        }
        else if (sortBy === 2) {
            data.sort((a, b) => b.alarmValue - a.alarmValue);
        }
        else if (sortBy === 3) {
            data.sort((a, b) => new Date(b.alarmTriggeredTime) - new Date(a.alarmTriggeredTime));
        }
        else if (sortBy === 4) {
            data.sort((a, b) => new Date(a.alarmTriggeredTime) - new Date(b.alarmTriggeredTime));
        }

        return data;
    }


    const menuItemClick = (value, data, type) => {
        if (value === 1) {
            AlarmOverviewModalRef.current.handleTrend(data, EntityName, instrumentName)
        } else if (value === 2) {

            let metricAlarm = [];
            let alarmStatus = "";

            if (data.Type === "MetricsDetails") {
                alarmStatus = data.alarmStatus
                metricAlarm = filteredOverallMetricDetailsAlarms ? filteredOverallMetricDetailsAlarms.filter((x) => x.alarmStatus === alarmStatus && x.acknowledgeID === null) : []
            }
            else {
                alarmStatus = data.alarmStatus
                metricAlarm = filteredOverallMetricsAlarms ? filteredOverallMetricsAlarms.filter((x) => x.alarmStatus === alarmStatus && x.acknowledgeID === null) : []
            }
            const dataArray = [data];
            
            if(type === "his" || type === "bulkack"){
            AlarmOverviewModalRef.current.handleAcknowledge(data, headPlant.id, OverviewTypes, dataArray, data.alert_level, type)
            } else {
                AlarmOverviewModalRef.current.handleAcknowledge(data, headPlant.id, OverviewTypes, metricAlarm, alarmStatus)
            }
        } else if (value === 3) {
            console.log("CreateTask")
            AlarmOverviewModalRef.current.handleCreateTask(data, EntityName, instrumentName, EntityID)
        }
}

    const handleDownloadDialog = (data) => {
        if (OverviewTypes === 'connectivity') {
            getFetchConnectivityDownloadAlertData(data)
        } else {
            setDownloadData(data)
            AlarmDownloadModalRef.current.handleAlarmDownloadModal(true)
        }
    }

    const handleDownloadClick = () => {
        setLoading(true)
        getFetchDownloadAlertData()
    }

    const alarmDataDownloadWithFilter = (data) => {

        if (data && data.length > 0) {

            let alarmData = data
            let finalData = []

            if (removeOkAlarm) {
                alarmData = alarmData.filter((x) => x.alarmStatus !== 'ok')
            }

            if (removeRepeatAlarm !== "" && removeRepeatAlarm !== undefined) {

                let sortedData = handleSortBy(alarmData, removeRepeatAlarm)

                // eslint-disable-next-line array-callback-return
                sortedData && sortedData.length > 0 && sortedData.map((x) => {
                    if (finalData.length > 0) {
                        let fieldIndex = finalData.findIndex((y) => y.instrument_id === x.instrument_id && y.metricKey
                            === x.metricKey
                        )

                        if (fieldIndex === -1) {
                            finalData.push(x)
                        }
                    }
                    else {
                        finalData.push(x)
                    }

                })
            }
            else {
                finalData = [...alarmData]
            }
            if (finalData.length > 0) {
                let data = []
                // eslint-disable-next-line array-callback-return
                finalData.forEach((x) => {

                    let limitValue = x.alarmType === "inside_the_range" || x.alarmType === "outside_the_range" ? "Min - " + x.minValue + " Max - " + x.maxValue : x.alarmLimitValue

                    let objinstrumentName = page === "home" || page === "Instrument" ? x.instrument : instrumentName
                    if (OverviewTypes === 'downtime' || OverviewTypes === 'tool') {
                        data.push({ AssetName: x.alarmName, parameter: x.metricName, alertType: x.alarmStatus, TriggeredAt: moment(x.alarmValueTime).format('DD-MM-YYYY HH:mm:ss'), checkedAt: moment(x.alarmTriggeredTime).format('DD-MM-YYYY HH:mm:ss'), acknowledgedBy: x.acknowledgeByName[0] })
                    } else  if (OverviewTypes === 'connectivity') {
                        data.push({ alarmName: x.alarmName, instrument: objinstrumentName, parameter: x.metricName, checkLimit: limitValue, actualValue: x.alarmValue, alertType: x.alarmStatus, TriggeredAt: moment(x.alarmValueTime).format('DD-MM-YYYY HH:mm:ss'), checkedAt: moment(x.alarmTriggeredTime).format('DD-MM-YYYY HH:mm:ss')})
                    } else {
                        data.push({ alarmName: x.alarmName, instrument: objinstrumentName, parameter: x.metricName, checkLimit: limitValue, actualValue: x.alarmValue, alertType: x.alarmStatus, TriggeredAt: moment(x.alarmValueTime).format('DD-MM-YYYY HH:mm:ss'), checkedAt: moment(x.alarmTriggeredTime).format('DD-MM-YYYY HH:mm:ss'), analystRemark: x.acknowledgeName[0], acknowledgedBy: x.acknowledgeByName[0] })
                    }


                })
                downloadExcel(data, "AlarmData  - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
                setLoading(false)
                AlarmDownloadModalRef.current.handleDownloadModalClose()
            }
          

        }
        else {
            downloadExcel(data, "AlarmData  - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
            setLoading(false)
            AlarmDownloadModalRef.current.handleDownloadModalClose()
        }


    }
    //CSV Download
    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    };

    const getFetchDownloadAlertData = () => {
        let body
        if (page === "home") {

            let entityInstruments = overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.Type === "Asset").map((y) => y.instrumentsArr).flat() : []
            let instrument_ids = overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.Type === "Instrument").map((y) => y.id) : []
            let virtualInstrumentAlertIDs = overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.Type === "VirtualInstrument").map((y) => y.alert_id) : []
            let cocatInstruments
            if (OverviewTypes === 'downtime') {
                cocatInstruments = [...entityInstruments]
                virtualInstrumentAlertIDs = []
            } else {
                cocatInstruments = [...entityInstruments, ...instrument_ids]
            }
            body = {
                schema: headPlant.schema,
                from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                line_id: headPlant.id,
                alertType: OverviewTypes,
                entityType: "Instrument",
                instrument_ids: cocatInstruments ? cocatInstruments : "",
                alert_id: virtualInstrumentAlertIDs,
                instrument_types: categoryTypes
            }
            getAlarmDownloadData(body)
        } else if (page === "Instrument") {

            let instrument_ids = overallInstrumentAlarms ? overallInstrumentAlarms.filter((x) => x.Type === "Instrument").map((y) => y.id) : []
            let virtualInstrumentAlertIDs = overallInstrumentAlarms ? overallInstrumentAlarms.filter((x) => x.Type === "VirtualInstrument").map((y) => y.alert_id) : []

            body = {
                schema: headPlant.schema,
                from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                line_id: headPlant.id,
                alertType: OverviewTypes,
                entityType: page,
                instrument_ids: instrument_ids ? instrument_ids : "",
                alert_id: virtualInstrumentAlertIDs,
                instrument_types: categoryTypes
            }
            getAlarmDownloadData(body)
        } else if (page === "Metrics") {

            let alert_ids = overallMetricsAlarms ? overallMetricsAlarms.map((x) => x.alert_id) : []

            body = {
                schema: headPlant.schema,
                from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                line_id: headPlant.id,
                alertType: OverviewTypes,
                entityType: page,
                instrument_ids: "",
                alert_id: alert_ids,
                instrument_types: categoryTypes
            }
            getAlarmDownloadData(body)
        }
        else {
            if (downloadData.length > 0) {
                alarmDataDownloadWithFilter(downloadData)
            }
            else {
                alarmDataDownloadWithFilter([])
                setLoading(false)
            }
        }
    }

    const getFetchConnectivityDownloadAlertData = (data) => {
        let body
        if (page === "home") {
            if (categoryTypes.length > 0) {

                let instrument_ids = overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.Type === "Instrument").map((y) => y.id) : []

                body = {
                    schema: headPlant.schema,
                    from: moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    to: moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    line_id: headPlant.id,
                    instrument_ids: instrument_ids,
                    connectivity_id: "",
                    instrument_types: categoryTypes
                }
                getConnectivityAlerts(body)
            }
            else {
                let finalData = []
                downloadExcel(finalData, "ConnectivityAlarmData  - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
            }

        } else if (page === "Metrics") {

            if (data.length > 0) {
                let finalData = []
                // eslint-disable-next-line array-callback-return
                data.map((x) => {

                    finalData.push({ alarmName: x.alarmName, instrument_id: x.instrument_id, instrument: x.instrument_name, alarmStatus: x.alarmStatus, checkedAt: moment(x.alarmTriggeredTime).format('DD-MM-YYYY HH:mm:ss')})

                })
                downloadExcel(finalData, "ConnectivityAlarmData  - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
            }
        }

    }

    const handleMostDisconnectedCard = () => {
        setMostDisconnectedDialog(true)
    }

    const handleMostDisconnectedDialogClose = () => {
        setMostDisconnectedDialog(false)
    }

    const getDisplayValue = () => {
        if (OverviewTypes !== 'tool') {
            return sumValues(countList ? countList : [], countList && countList[1] ? countList[1].time_slot : 0, countList && countList[0] ? countList[0].tool : 0);
        } 
        return countList && countList[0] ? countList[0].tool : 0;
    };

    useEffect(() => {
        if (!alarmDataDownloadLoading && alarmDataDownloadData && !alarmDataDownloadError) {
            if (alarmDataDownloadData && alarmDataDownloadData.data.length > 0) {
                alarmDataDownloadWithFilter(alarmDataDownloadData.data)
            } else {
                alarmDataDownloadWithFilter([])
                setLoading(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alarmDataDownloadData])


    const handleSaveAlarmAcknowlwdgement = (data, alarmAcknowledge, chkAcknowledge) => {
        AlarmOverviewModalRef.current.handleAlarmOverviewDialogClose()
        if (OverviewTypes !== 'connectivity') {

            let where = ""
            if (chkAcknowledge) {
                where = overallMetricDetailsAlarms.filter(((x) => x.alarmStatus === data.alarmStatus && x.acknowledgeID == null)).map((y) => ({ iid: y.instrument_id, key: y.metricKey, time: y.alarmTriggeredTime, alert_level: y.alarmStatus }))
            } else if (bulkack) {
                const dataArray = Array.isArray(data) ? data : [data];
                const matchingAlerts = dataArray.map(item => item.matchingAlert || item);
                const matchingAlert = matchingAlerts.map(item => ({
                    iid: item.instrument_id || item.iid,
                    key: item.metricKey || item.metric_name || item.key,
                    time: item.alarmTriggeredTime || item.time,
                    alert_level: item.alarmStatus || item.alert_level
                }));
                where = matchingAlert;
            } else {
                setoverallsingle(true)
                where = [{ iid: data.instrument_id, key: data.metricKey || data.metric_name, time: data.alarmTriggeredTime || data.time, alert_level: data.alarmStatus || data.alert_level }]
            }
            const body = {
                "schema": headPlant.schema,
                "set": { acknowledge_id: alarmAcknowledge, acknowledge_by: currUser.id, acknowledge_date: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss" + TZone) },
                "where": where
            }


            getUpdateAlarmAcknowledgement(body)
        } else {
            let where = ""
            if (chkAcknowledge) {
                where = overallMetricsAlarms.filter(((x) => x.alarmStatus === data.alarmStatus)).map((y) => ({ iid: y.instrument_id, time: y.lastCheckedTime, status: y.alarmStatus }))
            }
            else {
                where = [{ iid: data.instrument_id, time: data.lastCheckedTime, status: data.alarmStatus }]
            }

            const body = {
                "schema": headPlant.schema,
                "set": { acknowledge_id: alarmAcknowledge, acknowledge_by: currUser.id, acknowledge_ts: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss" + TZone) },
                "where": where
            }


            getUpdateConnectivityAlarmAcknowledgement(body)
        }
    }
    setFaultRange(14)
    useEffect(() => {
        if (!updateAlarmAcknowledgementLoading && updateAlarmAcknowledgementData && !updateAlarmAcknowledgementError) {
            const isAllSuccess = updateAlarmAcknowledgementData.data?.length > 0;
    
            if (isAllSuccess) {
                SetMessage(t('Alarm Acknowledgement Updated Successfully'));
                SetType("success");
                setOpenSnack(true);
                const body = {
                    type: "alert"
                }
                getAlarmAcknowledgement(body)
            } else {
                SetMessage(t('Some Alarm Acknowledgements Failed'));
                SetType("error");
                setOpenSnack(true);
            }
    
            AlarmOverviewModalRef.current.handleAlarmOverviewDialogClose();
            if(historydata || bulkack){
                if(datatype === 1){
                getfetchAlertsOverviewData()
            } else if(datatype === 2) {
                getfetchInstrumentAlertData(EntityCardData);
                setfetchdata(EntityCardData)
            } else if(overallsingle === true){
                getfetchAlertsOverviewData()
            } 
            } else {
                getfetchInstrumentAlertData(EntityCardData);
                setfetchdata(EntityCardData)
            }
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateAlarmAcknowledgementData, overallsingle]);
    
    useEffect(() => {
        if (!updateConnectivityAlarmAcknowledgementLoading && updateConnectivityAlarmAcknowledgementData && !updateConnectivityAlarmAcknowledgementError) {
            if (updateConnectivityAlarmAcknowledgementData && updateConnectivityAlarmAcknowledgementData.data === 1) {
                SetMessage(t('Connectivity Alarm Acknowledgement Updated Successfully'))
                SetType("success")
                setOpenSnack(true)
            }
            AlarmOverviewModalRef.current.handleAlarmOverviewDialogClose()
            getFetchConnectivityAlertData(EntityCardData)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateConnectivityAlarmAcknowledgementData])

    const handleCardClick = () => {
        setOpenDialog(true)
    }
    const handleClose = () => {
        setOpenDialog(false)
    }
// NOSONAR
    function MetDotOptions(x) {
        if (OverviewTypes === 'connectivity') {
            return [{ id: 1, name: <div style={{ display: "flex" , alignItems : "center" }}><Trend stroke={currTheme ==='dark' ? "#FFFFFF":"#202020"} style={{width : 16 , height : 16, marginRight: "8px"}}/><Typography value={t("View Trend")}></Typography></div>, disabled: false },
            // {
            //     id: 3, name:
            //         <div style={{ display: "flex", alignItems: "center" }}>
            //             <Plus stroke={x.taskId !== null || EntityID === "" ? "rgb(196 196 178)" : "#0090ff"} style={{ width: 16, height: 16, marginRight: "8px" }} /><Typography style={{ color: x.taskId !== null || EntityID === "" ? "rgb(196 196 178)" : "#0090ff" }}  value={t("Create Task")}></Typography></div>, disabled: (x.acknowledgeID === null || x.taskId !== null || EntityID === "") ? true : false
            // }
        ]
        } else if (OverviewTypes !== 'connectivity' && OverviewTypes !== 'downtime' && OverviewTypes !== 'tool') {
            if (x.virtualInstrumentId !== "") {
                return []
            } else {
                return [{
                    id: 1, name: <div style={{ display: "flex" , alignItems : "center" }}><Trend stroke={currTheme ==='dark' ? "#FFFFFF":"#202020"} style={{width : 16 , height : 16, marginRight: "8px"}}/><Typography value={t("View Trend")}></Typography></div>, disabled: x.virtualInstrumentId !== "" ? true : false,
                    color: x.virtualInstrumentId !== "" ? "rgb(196 196 178)" : ""
                },
                {
                    id: 3, name:
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Plus stroke={x.taskId !== null || EntityID === "" ? "rgb(196 196 178)" : "#0090ff"} style={{ width: 16, height: 16, marginRight: "8px" }} /><Typography style={{ color: x.taskId !== null || EntityID === "" ? "rgb(196 196 178)" : "#0090ff" }} value={t("Create Task")}></Typography></div>, disabled: (x.acknowledgeID === null || x.taskId !== null || EntityID === "") ? true : false  
            }]
            }
        } else {
                return []
        }

    }
    // NOSONAR
    function metDetDotOption(x) {
        if (x.virtualInstrumentId !== null || OverviewTypes === 'tool') {
            return []
        } else {
            if (OverviewTypes === 'downtime') {
                return [
                ]
            } else {
                return [{ id: 1, name: <div style={{ display: "flex" , alignItems : "center" }}><Trend style={{width : 16 , height : 16, marginRight: "8px"}}/><Typography value={t("View Trend")}></Typography></div>, disabled: x.virtualInstrumentId !== null ? true : false }, 
                {
                    id: 3, name:
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Plus stroke={x.taskId !== null || EntityID === "" ? "rgb(196 196 178)" : "#0090ff"} style={{ width: 16, height: 16, marginRight: "8px" }} /><Typography style={{ color: x.taskId !== null || EntityID === "" ? "rgb(196 196 178)" : "#0090ff" }} value={t("Create Task")}></Typography></div>, disabled: (x.acknowledgeID === null || x.taskId !== null || EntityID === "") ? true : false   
            }]
            }
        }
    }

    function getActiveCount(tag) {
        let temp = overallAlarmsTriggered;
        if (props.overviewFilter === 'connectivity' && props.connectivityFilter !== 'all') {
            let filter = props.connectivityFilter === "instruments" ? 1 : 2;
            temp = overallAlarmsTriggered.filter(t => t.connectivity_type == filter)
        }
        return temp.filter((x) => x.CriticalityType === tag).length;
    }

    return (
        <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark h-auto">
            <AlarmOverviewModal
                ref={AlarmOverviewModalRef} handleSaveAlarmAcknowlwdgement={handleSaveAlarmAcknowlwdgement}
            />
            <AlarmDownloadModal
                ref={AlarmDownloadModalRef} handleDownloadClick={handleDownloadClick} loading={loading} getRemoveRepeatAlarm={(val) => setRemoveRepeatAlarm(val)} getRemoveOkAlarm={(val) => setRemoveOkAlarm(val)}
                viewType={OverviewTypes}
            />
            {
                page === "home" &&
                <React.Fragment>
                   
                     <AccordianNDL1 
                        title={"Overview"} 
                        isexpanded={isoverviewexpad}
                        >
                    <Grid container spacing={4} style={{ padding: "8px 16px 8px 16px" }}>
                    <Grid item xs={4} >
                            <KpiCardsNDL style={{ height: "134px" }}  >
                                <div style={{
                                  
                                }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Typography variant="heading-01-xs" color='secondary'
                                                value={t("Configured Alarms")} />
                                            
                                        </div>
                                        <AlarmIcon />
                                    </div>



                                    {
                                        alarmsConfiguredLoading ? <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                                            :
                                            <React.Fragment>
                                                <div className="pt-1">
                                                    <div className=" leading-10 flex items-center text-[36px]" >
                                                        <Typography variant="display-lg" mono >
                                                        {getDisplayValue()}
                                                             </Typography>
                                                    </div>
                                                    {OverviewTypes !== 'tool' &&
                                                    <Typography variant="paragraph-xs" color="secondary">
                                                    You have configured{" "}
                                                    <strong>
                                                      {OverviewTypes !== "tool"
                                                        ? sumValues(
                                                            monthcountList ? monthcountList : [],
                                                            monthcountList && monthcountList[1]
                                                              ? monthcountList[1].time_slot
                                                              : 0,
                                                              monthcountList && monthcountList[0]
                                                              ? monthcountList[0].tool
                                                              : 0
                                                          )
                                                        : monthcountList && monthcountList[0]
                                                        ? monthcountList[0].tool
                                                        : 0}{" "}
                                                      alarms
                                                    </strong>{" "}
                                                    this month
                                                  </Typography>                                                                                             
                                                  
                                                    }
                                                </div>
                                            </React.Fragment>
                                    }
                                </div>
                            </KpiCardsNDL>
                            <div className="pt-4">
                            {
                            OverviewTypes !== 'downtime' && OverviewTypes !== 'connectivity' &&
                            <Grid item xs={OverviewTypes === 'tool' ? 4:3} >
                                <KpiCardsNDL style={{ height: "134px" }}  >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Typography variant="heading-01-xs" color='secondary'
                                                    value={t("Critical Alarms")} />
                                               
                                            </div>
                                            <CriticalIcons />
                                        </div>
                                        {
                                            alertsOverviewDataLoading ? <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                                                :
                                                <React.Fragment>
                                                    <div >
                                                        <div className="flex items-center text-[36px]" >

                                                            <Typography variant="display-lg" mono color={"#ce2c31"} > {totalCritical} </Typography>
                                                        </div>
                                                        <div >
                                                            <div className="flex justify-between ">
                                                                {/* <Typography variant="label-02-s" color="secondary" value={t("Action Taken")} /> */}
                                                                {/* <Typography variant="label-02-s" color="secondary" value={t("Today")} /> */}
                                                            </div>
                                                            <div className="flex justify-between ">
                                                                {/* <Typography variant={"label-02-m"}  > {"0"} </Typography> */}
                                                                <div className="flex gap-1 items-center">
                                                                <Typography variant={"paragraph-xs"}  mono> {toadyCritical} alarms</Typography>
                                                                <Typography variant={"paragraph-xs"} color='tertiary' >triggered today</Typography>
                                                                </div>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>

                                                </React.Fragment>
                                        }
                                    </div>
                                </KpiCardsNDL>
                            </Grid>
                        }{
                            OverviewTypes === 'connectivity' &&
                            <Grid item xs={3} >
                                <KpiCardsNDL style={{ height: "165px" }} onClick={handleMostDisconnectedCard} >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Typography variant="heading-01-xs" color='secondary'
                                                    value={t("Most Disconnected")} />
                                                
                                            </div>
                                            <CriticalIcons />
                                        </div>
                                        {
                                            mostDisconnectedInstrumentLoading ? <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                                                :
                                                <React.Fragment>
                                                    <div >
                                                        <div className="flex items-center text-[36px]" >

                                                            <Typography variant="heading-02-xl" color={"#ce2c31"} mono> {mostDisconnectedOverall.length} </Typography>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between ">
                                                                <Typography variant="label-02-s" color="secondary" value={t("Today")} />
                                                            </div>
                                                            <div className="flex justify-between ">
                                                                <Typography variant={"label-02-m"} mono> {mostDisconnectedToday.length} </Typography>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </React.Fragment>
                                        }
                                    </div>
                                </KpiCardsNDL>
                            </Grid>
                        }
                        {
                            OverviewTypes === 'downtime' &&
                            <Grid item xs={3} >
                                <KpiCardsNDL style={{ height: "165px" }} onClick={handleCardClick}>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Typography variant="heading-01-xs" color='secondary'
                                                    value={t("Most Down Assets")} />
                                              
                                            </div>
                                            <CriticalIcons />
                                        </div>
                                        {
                                            alertsOverviewDataLoading ? <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                                                :
                                                <React.Fragment>
                                                    <div >
                                                        <div className="flex items-center text-[36px]" >

                                                            <Typography variant="heading-02-xl" color={"#ce2c31"} > {count} </Typography>
                                                        </div>
                                                        <div >
                                                            <div className="flex justify-between "> 
                                                                <Typography variant="label-02-s" color="secondary" value={t("Today")} />
                                                            </div>
                                                            <div className="flex justify-between "> 
                                                                <Typography variant={"label-02-m"} > {countToday} </Typography>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </React.Fragment>
                                        }
                                    </div>
                                </KpiCardsNDL>
                            </Grid>

                        }
                          </div>
                        </Grid>
                        <Grid 
                            item 
                            xs={4}
                            >
                            <KpiCardsNDL style={{ height: "284px", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "relative", height: "100%", width: "100%" }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                    <Typography variant="heading-01-xs" color="secondary" value={t("Alarms Raised")} />
                                    </div>
                                    <AlarmTrigeredIcon />
                                </div>
                                {alertsOverviewDataLoading ? (
                                    <div style={{ display: "flex", justifyContent: "center", margin: 10 }}>
                                    <CircularProgress />
                                    </div>
                                ) : (
                                    <React.Fragment>
                                    <div className="flex p-4">
                                        {CriticalityPieData.Data[0] === 0 && CriticalityPieData.Data[1] === 0 ? (
                                        <div style={{ width: "180px", height: "180px"}} className="flex items-center">
                                           <Typography variant="label-01-xs" color="secondary">
                                             No Data
                                         </Typography>
                                        </div>  ) : (
                                              <div style={{ width: "180px", height: "180px" }}>
                                              <Charts
                                                  charttype={"pie"}
                                                  title={''}
                                                  hidelegend={true}
                                                  labels={CriticalityPieData.label}
                                                  data={CriticalityPieData.Data}
                                                  colors={CriticalityPieData.BGcolor}
                                              />
                                              </div> 
                                       
                                    )}

                                        <div className="flex flex-col gap-[16px]" style={{ marginLeft: "50px" }}>
                                        <div className="flex flex-col gap-[8px]">
                                            <Typography variant="label-01-xs" style={{ fontSize: "14px" }} color="secondary">
                                            Total Alarms
                                            </Typography>
                                            <Typography variant="label-02-xl" mono>
                                            {OverviewTypes === 'tool' ? TotalToolAlert : OverviewTypes === 'connectivity' ? totalConnectivityAlert : (totalCritical + totalWarning)}
                                            </Typography>
                                        </div>
                                        <div className="flex flex-col gap-[8px]">
                                            <Typography variant="label-01-xs" style={{ fontSize: "14px" }} color="secondary">
                                            Critical Alarms
                                            </Typography>
                                            <Typography variant="label-02-xl" style={{ color: "#CE2C31" }} mono>
                                            {totalCritical}
                                            </Typography>
                                        </div>
                                        <div className="flex flex-col gap-[8px]">
                                            <Typography variant="label-01-xs" style={{ fontSize: "14px" }} color="secondary">
                                            Warning Alarms
                                            </Typography>
                                            <Typography variant="label-02-xl" style={{ color: "#EF5F00" }} mono>
                                            {totalWarning}
                                            </Typography>
                                        </div>
                                        </div>
                                    </div>
                                    </React.Fragment>
                                )}
                                </div>
                            </KpiCardsNDL>
                            </Grid>

                        {OverviewTypes !== 'tool' &&
                        <Grid item xs={4}>
                            <KpiCardsNDL style={{ height: "284px", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                                <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="heading-01-xs" color="secondary" value={t("Alarms Acknowledged ")} />
                                </div>
                                <AcknowledgeIcon />
                                </div>
                                {alertsOverviewDataLoading || ConnectivityOverviewLoading ? (
                                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}>
                                    <CircularProgress />
                                </div>
                                ) : (
                                <React.Fragment>
                                    <div className="flex" style={{ gap: "45px", padding:"16px" }}>
                                    {/* Chart with fixed dimensions */}
                                    {AckPieData.Data[0] === 0 && AckPieData.Data[1] === 0 ? (
                                    <div style={{ width: "180px", height: "180px", flexShrink: 0 }} className="flex items-center">
                                         <Typography variant="label-01-xs" color="secondary">
                                            No Data
                                        </Typography>
                                    </div>
                                    ) : (
                                    <div style={{ width: "180px", height: "180px", flexShrink: 0 }}>
                                       <Charts
                                       charttype={"pie"}
                                       title={''}
                                       labels={AckPieData.label}
                                       data={AckPieData.Data}
                                       colors={AckPieData.BGcolor}
                                       hidelegend={true}
                                       />
                                   </div>
                                    )}
                                    {/* Text content with fixed layout */}
                                    <div className="flex flex-col" style={{ gap: "16px", flexGrow: 1, padding: "32px" }}>
                                        <div className="flex flex-col" style={{ gap: "4px" }}>
                                        <Typography variant="label-01-xs" color="secondary">
                                            Acknowledged
                                        </Typography>
                                        <Typography
                                            variant="label-02-xl"
                                            style={{ color: "#0588F0", whiteSpace: "nowrap" }}
                                            mono
                                        >
                                            {alarmAcknowledged}
                                        </Typography>
                                        </div>
                                        <div className="flex flex-col" style={{ gap: "4px" }}>
                                        <Typography variant="label-01-xs" color="secondary">
                                            Yet to Acknowledge
                                        </Typography>
                                        <Typography
                                            variant="label-02-xl"
                                            style={{ color: "#5EB1EF", whiteSpace: "nowrap" }}
                                            mono
                                        >
                                            {alarmYetToAcknowleded}
                                        </Typography>
                                        </div>
                                    </div>
                                    </div>
                                </React.Fragment>
                                )}
                            </div>
                            </KpiCardsNDL>
                        </Grid>
                        }
                        <ModalNDL onClose={handleClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={openDialog}>
                            <ModalHeaderNDL>
                                <Typography id="entity-dialog-title" variant="heading-02-s" model value={"Most Down Assets"} />
                            </ModalHeaderNDL>
                            <ModalContentNDL>
                            {DowntimeAssetData.length > 0 ? (
    DowntimeAssetData.map((val, index) => (
        <div key={val.id || index} style={{ margin: '5px 0' }}>
            <Typography value={val.name} variant="heading-02-base" style={{ marginBottom: '5px' }} />
            <Typography value={`${val.TotalAlert} Times`} variant="lable-01-s" />
        </div>
    ))
) : (
    <div>
        <Typography value={"No Assets"} variant="lable-01-s" style={{ marginBottom: '5px' }} />
    </div>
)}

                            </ModalContentNDL>
                            <ModalFooterNDL>
                                <Button value={t('Cancel')} style={{ marginTop: 10, marginBottom: 10 }} type="secondary" onClick={handleClose} />
                            </ModalFooterNDL>
                        </ModalNDL>
                    </Grid>
                    </AccordianNDL1>
                    <div className="flex items-center justify-between py-2 px-4 h-12">
                        {/* Left Section */}
                        <div className="flex items-center gap-2" style={{ justifyContent: "left" }}>
                            {
                                OverviewTypes !== 'connectivity' &&
                                <React.Fragment>
                                    {(OverviewTypes !== 'downtime' && OverviewTypes !== 'tool') &&
                                        <Tag icon={Ok} stroke={!isHomeOkAlert ? "#30A46c" : "#FFFFFF"} bordercolor={{ border: "1px solid #30A46c" }} style={{ color: !isHomeOkAlert ? "#30A46c" : "#FFFFFF", backgroundColor: isHomeOkAlert ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Ok: ${overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.CriticalityType === "ok" || x.alert_level === "ok").length : 0}`} onClick={() => homeTagFilter("ok")} />}

                                    <Tag icon={Warning} stroke={!isHomeWarningAlert ? "#ef5f00" : "#FFFFFF"} bordercolor={{ border: "1px solid #ef5f00" }} style={{ color: !isHomeWarningAlert ? "#ef5f00" : "#FFFFFF", backgroundColor: isHomeWarningAlert ? "#ef5f00" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer"}} name={`Warning: ${overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.CriticalityType === "warning" || x.alert_level === "warning").length : 0}`} onClick={() => homeTagFilter("warning")} />
                                    {(OverviewTypes !== 'downtime') ?
                                        <Tag icon={Critical} stroke={!isHomeCriticalAlert ? "#ce2c31" : "#FFFFFF"} bordercolor={{ border: "1px solid #ce2c31" }} style={{ color: !isHomeCriticalAlert ? "#ce2c31" : "#FFFFFF", backgroundColor: isHomeCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Critical: ${overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => x.CriticalityType === "critical"|| x.alert_level === "critical").length : 0}`} onClick={() => homeTagFilter("critical")} /> :
                                        <Tag icon={Critical} stroke={!isHomeCriticalAlert ? "#ce2c31" : "#FFFFFF"} bordercolor={{ border: "1px solid #ce2c31" }} style={{ color: !isHomeCriticalAlert ? "#ce2c31" : "#FFFFFF", backgroundColor: isHomeCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer", justifyContent:"center" }} name={`Critical: ${overallAlarmsTriggered ? overallAlarmsTriggered.filter((x) => (x.CriticalityType === "critical" || x.alert_level === "critical") && x.Type === 'Asset').length : 0}`} onClick={() => homeTagFilter("critical")} />
                                    }
                                </React.Fragment>
                            }
                            {
                                OverviewTypes === 'connectivity' &&
                                <React.Fragment>
                                    <Tag icon={ActiveIcon} stroke={!isHomeOkAlert ? "#30A46c" : "#FFFFFF"} bordercolor={{ border: "1px solid #30A46c" }} style={{ color: !isHomeOkAlert ? "#30A46c" : "#FFFFFF", backgroundColor: isHomeOkAlert ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Active: ${overallAlarmsTriggered ? getActiveCount("active") : 0}`} onClick={() => homeTagFilter("active")} />

                                    <Tag icon={InactiveIcon} stroke={!isHomeCriticalAlert ? "#ce2c31" : "#FFFFFF"} bordercolor={{ border: "1px solid #ce2c31" }} style={{ color: !isHomeCriticalAlert ? "#ce2c31" : "#FFFFFF", backgroundColor: isHomeCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Inactive: ${overallAlarmsTriggered ? getActiveCount("inactive") : 0}`} onClick={() => homeTagFilter("inactive")} />

                                    <div className="w-[120px]">
                                        <SelectBox
                                            labelId="Select-type-label"
                                            id="selectTypeLabel"
                                            value={props.connectivityFilter}
                                            placeholder={t('Select Type')}
                                            options={connectivityOption}
                                            onChange={handleConnectivityType}
                                            multiple={false}
                                            isMArray={true}
                                            auto={false}
                                            keyValue="name"
                                            keyId="id"
                                        />
                                    </div>
                                </React.Fragment>
                            }
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                        {selected === 'tile' && (
                            <React.Fragment>
                            <ClickAwayListener onClickAway={clickAwayHomeSearch}>
                                {homeInput ? (
                                    <div>
                                        <InputFieldNDL
                                            autoFocus
                                            id="Table-search"
                                            placeholder={t("Search")}
                                            size="small"
                                            value={homeSearchText}
                                            type="text"
                                            onChange={updateHomeSearch}
                                            disableUnderline={true}
                                            startAdornment={<Search stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'}  />}
                                            endAdornment={homeSearchText !== '' ? <Clear stroke={currTheme === 'dark' ? "#b4b4b4" : '#202020'} onClick={() => { setHomeSearchText(''); setHomeInput(true) }} /> : ''}
                                        />
                                    </div>
                                ) : (
                                    <Button type={"ghost"} icon={Search} stroke={"#585757"} onClick={() => { setHomeInput(true); }} />
                                )}
                            </ClickAwayListener>
                            <Button type='ghost' icon={FileDownload} stroke={"#007BFF"} onClick={() => handleDownloadDialog([])} />
                            </React.Fragment>
                        )}
                         {selected === 'table' && (
                             <SelectBox
                             labelId="Select-ov-label"
                             id="selectovLabel"
                             value={groupByFilter}
                             placeholder={t('GroupBy')}
                             options={Overivewopt}
                             onChange={handleGroupByChange}
                             multiple={false}
                             isMArray={true}
                             auto={false}
                             keyValue="name"
                             keyId="id"
                             width="114px"
                         />
                            )}
                        {OverviewTypes === "alert" &&
                             <div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  rounded-lg">
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                 selected === "tile" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleSwitch("tile")}
                                           >
                                               <TileIcon stroke={selected === "tile" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                 selected === "table" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleSwitch("table")}
                                           >
                                              <TableIcon stroke={selected === "table" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           </div>
                                            }
                        </div>
                    </div>

                  
                        {selected === 'tile' && (
                            !AlertsOverviewLoading && !ConnectivityOverviewLoading && homeCurrentData && homeCurrentData.length > 0 ? (
                                <Grid container spacing={4} style={{ padding: "16px" }}>
                                    {homeCurrentData.map((x, index) => (
                                        <Card 
                                        key={x.id ||index } 
                                            TaskListData={TaskListData}
                                            info={x} 
                                            index={index} 
                                            faultInfoData={faultdata} 
                                            openalert={alert_id} 
                                            handleEntityCardActionInstrument={handleEntityCardActionInstrument} 
                                            headPlant={headPlant.id}
                                        />
                                    ))}
                                </Grid>
                            ) : (
                                <React.Fragment>
                                <div className="flex text-center justify-center p-2">
                                    {(AlertsOverviewLoading || ConnectivityOverviewLoading) ? (
                                        <LoadingScreenNDL />
                                    ) : homeCurrentData?.length === 0 ? (
                                        <Typography
                                            variant={"label-02-m"}
                                            value={"No Data"}
                                        />
                                    ) : null}
                                </div>
                            </React.Fragment>
                            )
                        )}
                        {selected === 'table' && groupByFilter === 1 && (
                            <div className="p-[16px]">
                            <EnhancedTable
                            heading={'Alarm Details'}
                            headCells={headCells}
                            columnwisefilter={true}
                            data={tabledata}
                            rawdata={overviewrawdata}
                            search={true}
                            download={true}  
                            rowSelect={true}  
                            checkBoxId={"S.No"}
                            verticalMenu={true}    
                            groupBy={'alert_table'}     
                            defaultvisibleColumn
                            enableview={true}    
                            actionenabled={true}
                            handleview={(id, value) => viewalarm(id, value)}
                            tagKey={["Criticality", "ReportStatus"]}  
                            onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                            page={pageidx}
                            rowsPerPage={rowsPerPage}          
                            />
                            </div>
                              )}
                     {selected === 'table' && groupByFilter === 2 && (
                        <div className="p-[16px]">
                            <EnhancedTable
                            heading={'Alarm Details'}
                            headCells={headHistoryCells}
                            data={tablehistorydata}
                            rawdata={historyrawdata}
                            search={true}
                            download={true}  
                            rowSelect={true}  
                            defaultvisibleColumn
                            columnwisefilter={true}
                            checkBoxId={"S.No"}
                            verticalMenu={true}  
                            groupBy={'alert_table'}     
                            tagKey={["Criticality", "ReportStatus", "Status"]}  
                            ackmultiselect={true}
                            enabletrend={true}           
                            actionenabled={true}
                            handletrend={(id, value) => menuItemClick(1, value)}        
                            enabletask={true}  
                            handletask={(id, value) => menuItemClick(3, value)}    
                            handleupdatedData={(value) => handleupdatedData(value)}    
                            buttonpresent={isackdis === 1 ? "Acknowledge" : false}
                            onClickbutton={() => handlebulkack(1)}
                            onPageChange={(p,r)=>{setPageDetailedidx(p);setRowsdetailedPerPage(r)}}
                            page={pageDetailedidx}
                            rowsPerPage={rowsDetailedPerPage} 
                            />
                            </div>
                              )}
                   {selected === 'tile' && (            
                    <EnhancedTablePagination 
                        onPageChange={handleHomePageChange}
                        onRowsPerPageChange={handleHomeRowsPerPageChange}
                        count={filteredOverallAlarmsTriggered.length} 
                        rowsPerPage={homeRowsPerPage}
                        PerPageOption={[12, 24, 48, 96, 120]}
                        page={homeCurrentPage}
                        visibledata={[]}
                        noBorderRadius
                    />
                )}
                </React.Fragment>
            }
      
            {
                page === "Instrument" &&
                <React.Fragment>
                    <div className="flex p-2 h-12 bg-Background-bg-primary dark:bg-Background-bg-primary-dark " style={{ justifyContent: "left" }}>
                        <Breadcrumbs breadcrump={listArray} onActive={(index, item) => handleActiveIndex(index, item)} />
                    </div>
                    <HorizontalLine variant='divider1' />
                    <div className="flex items-center gap-2 p-2" style={{ justifyContent: "right" }}>

                        {OverviewTypes !== 'downtime' &&
                            <Tag icon={Ok} stroke={!isInstrumentOkAlert ? "#30A46c" : "#FFFFFF"} bordercolor={{ border: "1px solid #30A46c" }} style={{ color: !isInstrumentOkAlert ? "#30A46c" : "#FFFFFF", backgroundColor: isInstrumentOkAlert ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Ok: ${overallInstrumentAlarms ? overallInstrumentAlarms.filter((x) => x.CriticalityType === "ok").length : 0}`} onClick={() => instrumentTagFilter("ok")} />}

                        <Tag icon={Warning} stroke={!isInstrumentWarningAlert ? "#ef5f00" : "#FFFFFF"} bordercolor={{ border: "1px solid #ef5f00" }} style={{ color: !isInstrumentWarningAlert ? "#ef5f00" : "#FFFFFF", backgroundColor: isInstrumentWarningAlert ? "#ef5f00" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Warning: ${overallInstrumentAlarms ? overallInstrumentAlarms.filter((x) => x.CriticalityType === "warning").length : 0}`} onClick={() => instrumentTagFilter("warning")} />

                        <Tag icon={Critical} stroke={!isInstrumentCriticalAlert ? "#ce2c31" : "#FFFFFF"} bordercolor={{ border: "1px solid #ce2c31" }} style={{ color: !isInstrumentCriticalAlert ? "#ce2c31" : "#FFFFFF", backgroundColor: isInstrumentCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" }} name={`Critical: ${overallInstrumentAlarms ? overallInstrumentAlarms.filter((x) => x.CriticalityType === "critical").length : 0}`} onClick={() => instrumentTagFilter("critical")} />
                        <Button type='ghost' icon={FileDownload} stroke={"#007BFF"} 
                            onClick={() => handleDownloadDialog([])}
                        />
                    </div>

                     {!InstrumentAlertLoading && instrumentCurrentData && instrumentCurrentData.length > 0 ?

                        <Grid container spacing={4} style={{ padding: "16px" }}>
                            { // eslint-disable-next-line array-callback-return
                                instrumentCurrentData.map((x, index) => {
                                    return (
                                        <Card info={x} key={index+1} index={index} defect_name={defect_name} recommendation={recommendation} faultInfoData={faultdata} handleEntityCardActionInstrument={handleEntityCardActionInstrument} />
                                        
                                      
                                    )
                                })
                            }
                        </Grid>
                        :
                        <React.Fragment>
                            <div className="flex text-center p-2">
                                <Typography variant={"label-02-m"} value={InstrumentAlertLoading ? "Loading..." : "No Alerts"} />
                            </div>
                        </React.Fragment>
                    } 

                    <EnhancedTablePagination 
                        onPageChange={handleInstrumentPageChange}
                        onRowsPerPageChange={handleInstrumentRowsPerPageChange}
                        count={filteredOverallInstrumentAlarms.length} 
                        rowsPerPage={instrumentRowsPerPage}
                        PerPageOption={[12, 24, 48, 96, 120]}
                        page={instrumentCurrentPage}
                        visibledata={[]}
                        noBorderRadius
                    />

                </React.Fragment>
            }
            {
                page === "Metrics" &&
                <React.Fragment>
                    <div className="flex p-2 h-12 bg-Background-bg-primary dark:bg-Background-bg-primary-dark " style={{ justifyContent: "left" }}>
                        <Breadcrumbs breadcrump={listArray} onActive={(index, item) => handleActiveIndex(index, item)} />
                    </div>
                    <HorizontalLine variant='divider1' />
                    <div className="flex justify-between items-center gap-4 p-2">
                        {/* Tags Section */}
                        <div className="flex items-center gap-2">
                            {OverviewTypes !== 'connectivity' && (
                                <React.Fragment>
                                    {OverviewTypes !== 'downtime' && OverviewTypes !== 'tool' && (
                                        <Tag
                                            icon={Ok}
                                            stroke={!isMetricsOkAlert ? "#30A46c" : "#FFFFFF"}
                                            bordercolor={{ border: "1px solid #30A46c" }}
                                            style={{
                                                color: !isMetricsOkAlert ? "#30A46c" : "#FFFFFF",
                                                backgroundColor: isMetricsOkAlert ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                                cursor: "pointer",
                                            }}
                                            name={`Ok: ${overallMetricsAlarms ? overallMetricsAlarms.filter((x) => x.alarmStatus === "ok").length : 0}`}
                                            onClick={() => metricsTagFilter("ok")}
                                        />
                                    )}
                                    <Tag
                                        icon={Warning}
                                        stroke={!isMetricsWarningAlert ? "#ef5f00" : "#FFFFFF"}
                                        bordercolor={{ border: "1px solid #ef5f00" }}
                                        style={{
                                            color: !isMetricsWarningAlert ? "#ef5f00" : "#FFFFFF",
                                            backgroundColor: isMetricsWarningAlert ? "#ef5f00" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                            cursor: "pointer",
                                        }}
                                        name={`Warning: ${overallMetricsAlarms ? overallMetricsAlarms.filter((x) => x.alarmStatus === "warning").length : 0}`}
                                        onClick={() => metricsTagFilter("warning")}
                                    />
                                    <Tag
                                        icon={Critical}
                                        stroke={!isMetricsCriticalAlert ? "#ce2c31" : "#FFFFFF"}
                                        bordercolor={{ border: "1px solid #ce2c31" }}
                                        style={{
                                            color: !isMetricsCriticalAlert ? "#ce2c31" : "#FFFFFF",
                                            backgroundColor: isMetricsCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                            cursor: "pointer",
                                        }}
                                        name={`Critical: ${overallMetricsAlarms ? overallMetricsAlarms.filter((x) => x.alarmStatus === "critical").length : 0}`}
                                        onClick={() => metricsTagFilter("critical")}
                                    />
                                </React.Fragment>
                            )}
                            {OverviewTypes === 'connectivity' && (
                                <React.Fragment>
                                    <Tag
                                        icon={ActiveIcon}
                                        stroke={!isMetricsOkAlert ? "#30A46c" : "#FFFFFF"}
                                        bordercolor={{ border: "1px solid #30A46c" }}
                                        style={{
                                            color: !isMetricsOkAlert ? "#30A46c" : "#FFFFFF",
                                            backgroundColor: isMetricsOkAlert ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                            cursor: "pointer",
                                        }}
                                        name={`Active: ${overallMetricsAlarms ? overallMetricsAlarms.filter((x) => x.alarmStatus === "active").length : 0}`}
                                        onClick={() => metricsTagFilter("active")}
                                    />
                                    <Tag
                                        icon={InactiveIcon}
                                        stroke={!isMetricsCriticalAlert ? "#ce2c31" : "#FFFFFF"}
                                        bordercolor={{ border: "1px solid #ce2c31" }}
                                        style={{
                                            color: !isMetricsCriticalAlert ? "#ce2c31" : "#FFFFFF",
                                            backgroundColor: isMetricsCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                            cursor: "pointer",
                                        }}
                                        name={`Inactive: ${overallMetricsAlarms ? overallMetricsAlarms.filter((x) => x.alarmStatus === "inactive").length : 0}`}
                                        onClick={() => metricsTagFilter("inactive")}
                                    />
                                </React.Fragment>
                            )}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                        {metSelected === 'tile' && (
                            <Button
                                type="ghost"
                                icon={FileDownload}
                                stroke={"#007BFF"}
                                onClick={() => handleDownloadDialog(OverviewTypes === 'connectivity' ? overallMetricsAlarms : [])}
                            />
                        )}
                         {metSelected === 'tile' && (OverviewTypes !== "downtime" && OverviewTypes !== "connectivity" && OverviewTypes !== "tool" && OverviewTypes !== "timeslot") && (
                        <div className="w-[150px]">
                            <SelectBox
                                labelId="Select-sort-label"
                                id="selectSortLabel"
                                value={groupByFilter}
                                placeholder={t('GroupBy')}
                                options={groupbyopt}
                                onChange={handleSortGroupByChange}
                                multiple={false}
                                isMArray={true}
                                auto={false}
                                keyValue="name"
                                keyId="id"
                                width="350px"
                            />
                        </div>
                        )}
                        {OverviewTypes === "alert" &&
                        <div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  rounded-lg">
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                metSelected === "tile" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleMetSwitch("tile")}
                                           >
                                               <ListIcon stroke={metSelected === "tile" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                metSelected === "table" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleMetSwitch("table")}

                                           >
                                              <TableIcon stroke={metSelected === "table" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           </div>
                             }
                        </div>
                    </div>

                    {metSelected === 'tile' && (
                        !InstrumentAlertLoading && !ConnectivityAlerstLoading && metricsCurrentData && metricsCurrentData.length > 0 ? (
                            <Grid container spacing={4} style={{ padding: "16px" }}>
                            {groupedData.groupedData && typeof groupedData.groupedData === 'object' ? (
                                Object.entries(groupedData.groupedData).map(([category, data], categoryIndex) => (
                                    <React.Fragment key={categoryIndex+1}>
                                    <Grid item xs={12}>
                                        <AccordianNDL1 
                                        title={`${t(category)} (${data.length})`} 
                                        isexpanded={categoryIndex === 0}
                                        >
                                      <Grid container spacing={4} className='py-2'>
                                        {Array.isArray(data) && data.length > 0 ? (
                                          data.map((x, index) => (
                                            <Grid item xs={12} key={`${category}-${index}`}>
                                              <MetricCard
                                                entityName={EntityName}
                                                faultInfoData={faultdata}
                                                instrumentName={instrumentName}
                                                info={x}
                                                index={index}
                                                handleEntityCardActionInstrument={handleEntityCardActionInstrument}
                                                menuItemClick={menuItemClick}
                                                threeDotMenuOption={MetDotOptions(x)}
                                                type={OverviewTypes}
                                              />
                                            </Grid>
                                          ))
                                        ) : (
                                          <Grid item xs={12}>
                                            <Typography variant="body1" color="textSecondary">
                                              No data available for {category}.
                                            </Typography>
                                          </Grid>
                                        )}
                                      </Grid>
                                    </AccordianNDL1>
                                  </Grid>
                                </React.Fragment>
                              ))
                            ) : (
                              <Grid item xs={12}>
                                <Typography variant="body1" color="textSecondary">
                                  No data available.
                                </Typography>
                              </Grid>
                            )}
                          </Grid>                                                            
                        ) : (
                            <React.Fragment>
                                <div className="flex text-center p-2">
                                    <Typography variant={"label-02-m"} value={InstrumentAlertLoading || ConnectivityAlerstLoading ? "Loading..." : "No Alerts"} />
                                </div>
                            </React.Fragment>
                        )
                    )}
                    {metSelected === 'table' && (
                        finalupdatedtabledata && finalupdatedtabledata.length > 0 ? (
                            <div style={{ padding: "16px" }}>
                                <EnhancedTable
                                    heading="Alarm Details"
                                    headCells={metheadCells}
                                    data={finalupdatedtabledata}
                                    rawdata={metrawdata}
                                    columnwisefilter={true}
                                    search={true}
                                    download={true}
                                    rowSelect={true}
                                    checkBoxId={"S.No"}
                                    verticalMenu={true}
                                    groupBy={'alerts_table'}
                                    tagKey={["Criticality", "ReportStatus"]}
                                    enabletrend={true}
                                    actionenabled={true}
                                    defaultvisibleColumn
                                    handletrend={(id, value) => menuItemClick(1, value)}
                                    enabletask={true}
                                    handletask={(id, value) => menuItemClick(3, value)}
                                    buttonpresent={isackdis === 1 ? "Acknowledge" : false}
                                    onClickbutton={() => handlebulkack(2)}
                                    ackmultiselect={true}       
                                    handleupdatedData={(value) => handleupdatedData(value)}  
                                    disabletask={EntityID ? false : true}
                                    onPageChange={(p,r)=>{setPageViewidx(p);setRowsViewPerPage(r)}}
                                    page={pageViewidx}
                                    rowsPerPage={rowsViewPerPage} 

                                />
                            </div>
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No data available.
                            </Typography>
                        )
                    )}

                      {metSelected === 'tile' && (
                    <EnhancedTablePagination
                        onPageChange={handleMetricsPageChange}
                        onRowsPerPageChange={handleMetricsRowsPerPageChange}
                        count={filteredOverallMetricsAlarms.length}
                        rowsPerPage={metricsRowsPerPage}
                        PerPageOption={[5, 10, 20, 50, 100]}
                        page={metricsCurrentPage}
                        visibledata={[]}
                        noBorderRadius
                    />
                )}
                </React.Fragment>
            }
            {
                page === "MetricsDetails" &&
                <React.Fragment>
                    <div className="flex p-2 h-12 bg-Background-bg-primary dark:bg-Background-bg-primary-dark " style={{ justifyContent: "left" }}>
                        <Breadcrumbs breadcrump={listArray} onActive={(index, item) => handleActiveIndex(index, item)} />
                    </div>
                    <HorizontalLine variant='divider1' />
                    <div className="flex items-center justify-between p-2">
                        {/* Tags Section */}
                        <div className="flex items-center gap-2">
                            {OverviewTypes !== 'downtime' && OverviewTypes !== 'tool' && (
                                <Tag
                                    icon={Ok}
                                    stroke={!isMetricDetailsOkAlert ? "#30A46c" : "#FFFFFF"}
                                    bordercolor={{ border: "1px solid #30A46c" }}
                                    style={{
                                        color: !isMetricDetailsOkAlert ? "#30A46c" : "#FFFFFF",
                                        backgroundColor: isMetricDetailsOkAlert ? "#30A46c" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                        cursor: "pointer",
                                    }}
                                    name={`Ok: ${overallMetricDetailsAlarms ? overallMetricDetailsAlarms.filter((x) => x.alarmStatus === "ok").length : 0}`}
                                    onClick={() => metricDetailsTagFilter("ok")}
                                />
                            )}
                            <Tag
                                icon={Warning}
                                stroke={!isMetricDetailsWarningAlert ? "#ef5f00" : "#FFFFFF"}
                                bordercolor={{ border: "1px solid #ef5f00" }}
                                style={{
                                    color: !isMetricDetailsWarningAlert ? "#ef5f00" : "#FFFFFF",
                                    backgroundColor: isMetricDetailsWarningAlert ? "#ef5f00" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                    cursor: "pointer",
                                }}
                                name={`Warning: ${overallMetricDetailsAlarms ? overallMetricDetailsAlarms.filter((x) => x.alarmStatus === "warning").length : 0}`}
                                onClick={() => metricDetailsTagFilter("warning")}
                            />
                            <Tag
                                icon={Critical}
                                stroke={!isMetricDetailsCriticalAlert ? "#ce2c31" : "#FFFFFF"}
                                bordercolor={{ border: "1px solid #ce2c31" }}
                                style={{
                                    color: !isMetricDetailsCriticalAlert ? "#ce2c31" : "#FFFFFF",
                                    backgroundColor: isMetricDetailsCriticalAlert ? "#ce2c31" : (currTheme === 'dark' ? "#111111" : "#FFF"),
                                    cursor: "pointer",
                                }}
                                name={`Critical: ${overallMetricDetailsAlarms ? overallMetricDetailsAlarms.filter((x) => x.alarmStatus === "critical").length : 0}`}
                                onClick={() => metricDetailsTagFilter("critical")}
                            />
                        </div>

                        {/* Right-Aligned Section */}
                        <div className="flex items-center gap-4">
                            {/* Sort By Select Box */}
                            {OverviewTypes !== 'tool' && (
                                <div className="w-36">
                                    <SelectBox
                                        labelId="Select-sort-label"
                                        id="selectSortLabel"
                                        value={sortByFilter}
                                        placeholder={t('SortBy')}
                                        options={OverviewTypes === 'downtime' ? sortByOption.filter((f) => f.id !== 1 && f.id !== 2) : sortByOption}
                                        onChange={handleSortByChange}
                                        multiple={false}
                                        isMArray={true}
                                        auto={false}
                                        keyValue="name"
                                        keyId="id"
                                        width="150px"
                                    />
                                </div>
                            )}
                            {OverviewTypes !== "downtime" && OverviewTypes !== "connectivity" && OverviewTypes !== "tool" && 
                            <SelectBox
                                labelId="Select-group-label"
                                id="selectGroupLabel"
                                value={groupByFilter}
                                placeholder={t('GroupBy')}
                                options={groupbyopt}
                                onChange={handleSortsGroupByChange}
                                multiple={false}
                                isMArray={true}
                                auto={false}
                                keyValue="name"
                                keyId="id"
                            />}
                            {finSelected === 'tile' && (
                                <Button
                                    type="ghost"
                                    icon={FileDownload}
                                    stroke={"#007BFF"}
                                    onClick={() => handleDownloadDialog(OverviewTypes === 'connectivity' ? overallMetricsAlarms : [])}
                                />
                            )}
                            {/* Toggle Buttons */}
                            {OverviewTypes === "alert" &&
                            <div className="flex items-center justify-center p-1 bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark  rounded-lg">
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                finSelected === "tile" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleFinSwitch("tile")}
                                           >
                                               <ListIcon stroke={finSelected === "tile" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>
                                           <button
                                               className={`flex items-center justify-center p-2 transition ${
                                                finSelected === "table" ?"bg-Background-bg-primary dark:bg-Background-bg-primary-dark shadow-sm " : "bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark"
                                               } rounded-md`}
                                               onClick={() => handleFinSwitch("table")}

                                           >
                                              <TableIcon stroke={finSelected === "table" ? (currTheme === "dark" ?"#FFFFFF" :"#202020") :"#646464"} />
                                           </button>

                           </div>
                           }
                        </div>
                    </div>
                    {finSelected === 'tile' && (
                            !InstrumentAlertLoading && metricDetailsCurrentData && metricDetailsCurrentData.length > 0 ? (
                                <Grid container spacing={4} style={{ padding: "16px" }}>
                                {upupdatedMetricDetails.groupedData && typeof upupdatedMetricDetails.groupedData === 'object' ? (
                                    Object.entries(upupdatedMetricDetails.groupedData).map(([category, data], categoryIndex) => (
                                        <React.Fragment key={categoryIndex+1}>
                                        <Grid item xs={12}>
                                            <AccordianNDL1 
                                            title={`${t(category)} (${data.length})`} 
                                            isexpanded={categoryIndex === 0}
                                            >
                                          <Grid container spacing={2} style={{ padding: "8px 8px" }}>
                                            {Array.isArray(data) && data.length > 0 ? (
                                              data.map((x, index) => (
                                                <Grid item xs={12} key={`${category}-${index}`}>
                                                  <MetricCard
                                                    entityName={EntityName}
                                                    instrumentName={instrumentName}
                                                    info={x}
                                                    index={index}
                                                    menuItemClick={menuItemClick}
                                                    threeDotMenuOption={metDetDotOption(x)}
                                                    type={OverviewTypes}
                                                    faultInfoData={faultdata}
                                                  />
                                                </Grid>
                                              ))
                                            ) : (
                                              <Grid item xs={12}>
                                                <Typography variant="body1" color="textSecondary">
                                                  No data available for {category}.
                                                </Typography>
                                              </Grid>
                                            )}
                                          </Grid>
                                        </AccordianNDL1>
                                      </Grid>
                                    </React.Fragment>
                                  ))
                                ) : (
                                  <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary">
                                      No data available.
                                    </Typography>
                                  </Grid>
                                )}
                              </Grid>                                                                                          
                            ) : (
                                <React.Fragment>
                                    <div className="flex text-center p-2">
                                        <Typography
                                            variant={"label-02-m"}
                                            value={InstrumentAlertLoading ? "Loading..." : "No Alerts"}
                                        />
                                    </div>
                                </React.Fragment>
                            )
                        )}
                  {finSelected === 'table' && (
                    upupdatedMetricDetails.groupedData && typeof upupdatedMetricDetails.groupedData === 'object' ? (
                        Object.entries(upupdatedMetricDetails.groupedData).map(([category, data], categoryIndex) => (
                          <div key={categoryIndex+1} style={{ marginBottom: "32px" }}>
                         <AccordianNDL1 
                            title={`${t(category)} (${data.length})`} 
                            isexpanded={categoryIndex === 0}
                            >                      
                            <div style={{ padding: "16px 16px" }}>
                                <EnhancedTable
                                heading={`Alarm Details - ${category}`}
                                headCells={metheadCells}
                                data={data.map((val, index) => {
                                    const instrumentName = val.alarmName;
                                    const tasksForEntity = instrumentName 
                                    ? TaskListData && TaskListData.filter(task => task.instrument.name === instrumentName) 
                                    : [];

                                    let highestPriority = "Not reported";
                                    let highestPriorityColor = "#202020";
                                    let colorbg = "neutral-alt";

                                    if (tasksForEntity && tasksForEntity.length > 0) {
                                    const hasHighPriority = tasksForEntity.some(task => task.taskPriority.task_level === "High");
                                    const hasMediumPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Medium");
                                    const hasLowPriority = tasksForEntity.some(task => task.taskPriority.task_level === "Low");

                                    if (hasHighPriority || hasMediumPriority || hasLowPriority) {
                                        highestPriority = "Report Done";
                                        highestPriorityColor = "#FFFFFF";
                                        colorbg = "success-alt";
                                    }
                                    }

                                    let faultText = "No Fault";
                                    if (val.metricName && (val.metricName.toLowerCase().includes("reading") || val.metricName.toLowerCase().includes("voltage"))) {
                                    faultText = "-";
                                    } else if (val.alarmStatus === "ok") {
                                    faultText = "NA";
                                    }

                                    return [
                                    index + 1,
                                    instrumentName,
                                    val.metricName,
                                    <StatusNDL 
                                        key={index+1}
                                        style={{ color: "#FFFFFF", textAlign: "center" }}
                                        colorbg={
                                        val.alarmStatus === "critical" ? "error-alt" :
                                        val.alarmStatus === "warning" ? "warning02-alt" :
                                        val.alarmStatus === "ok" ? "success-alt" : ""
                                        }
                                        name={val.alarmStatus} 
                                    />,
                                    moment(val.alarmTriggeredTime).format("DD/MM/YYYY HH:mm:ss"),
                                    <StatusNDL 
                                        key={index+1}
                                        style={{ color: highestPriorityColor, textAlign: "center" }}
                                        colorbg={colorbg}
                                        name={highestPriority} 
                                    />,
                                    faultText,
                                    (val.virtualInstrumentId === null && OverviewType !== 'tool' && val.alarmStatus !== "ok" && val.acknowledgeID !== null) 
                                        ? <Button type="ghost" disabled={true} value={t("Acknowledged")} />
                                        : <Button type="ghost" disabled={false} onClick={() => menuItemClick(2, val)} value={t("Acknowledge")} />
                                    ];
                                })}
                                rawdata={data}
                                search={true}
                                download={true}
                                rowSelect={true}
                                checkBoxId={"S.No"}
                                verticalMenu={true}
                                groupBy={'alert_table'} 
                                tagKey={["Criticality", "ReportStatus"]}    
                                enabletrend={true}           
                                actionenabled={true}
                                handletrend={(id, value) => menuItemClick(1, value)}        
                                enabletask={true}   
                                defaultvisibleColumn
                                handletask={(id, value) => menuItemClick(3, value)}   
                                />
                            </div>
                            </AccordianNDL1>

                        </div>
                        ))
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                        No data available.
                        </Typography>
                    )
                    )}
                 {finSelected === 'tile' && (
                    <EnhancedTablePagination
                        onPageChange={handleMetricDetailsPageChange}
                        onRowsPerPageChange={handleMetricDetailsRowsPerPageChange}
                        count={filteredOverallMetricDetailsAlarms.length}
                        rowsPerPage={metricDetailsRowsPerPage}
                        PerPageOption={[5, 10, 20, 50, 100]}
                        page={metricDetailsCurrentPage}
                        visibledata={[]}
                        noBorderRadius
                    />
                )}
                </React.Fragment>
            }

            <ModalNDL open={mostDisconnectedDialog}>
                <ModalHeaderNDL>
                    <div className="flex p-2 items-center justify-between">
                        <Typography variant="heading-02-xs" value={t("Most Disconnected Instruments")} />
                    </div>
                </ModalHeaderNDL>
                <ModalContentNDL>

                    {mostDisconnectedOverall.length > 0 ?
                        mostDisconnectedOverall.map((x, index) => (
                            <div key={index+1}  >

                                <div >
                                    <Typography className="whitespace-nowrap flex-shrink-0" variant="label-02-m" value={x.instrument_name} />
                                    <Typography variant="lable-01-s" color={"secondary"} value={x.count + " Times"} />
                                </div>
                                <br />
                            </div>
                        ))
                        :
                        <div style={{ marginBottom: '10px' }}>
                            <Typography
                                style={{ textAlign: "center" }}
                                value={t("No Data")}>
                            </Typography>
                        </div>
                    }
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button id='reason-update' type={"secondary"} value={t('Close')} onClick={handleMostDisconnectedDialogClose}></Button>
                </ModalFooterNDL>
            </ModalNDL>

        </div>



    );
}