import { atom } from "recoil";
import moment from 'moment';
export const apiTimeout = atom({
  key: "apiTimeout",
  default: false
})
export const Loadingpanel = atom({
  key: "Loadingpanel",
  default: false
})
export const AnalyticsMode = atom({
  key: "AnalyticsMode",
  default: 0
})
export const saRange = atom({
  key: "saRange",
  default: ''
})
export const saPartsList = atom({
  key: "saPartsList",
  default: []
})
export const saParts = atom({
  key: "saParts",
  default: ''
})
export const SigTabval = atom({
  key: "SigTabval",
  default: parseInt(JSON.parse(localStorage.getItem('analyticsDefault'))?.tabValue) || 0
})

export const decodeToken = atom({
  key: "decodeToken",
  default: {}
})

export const dashboardHideGap = atom({
  key: "dashboardHideGap",
  default: false
})

export const currentPage = atom({
  key: "currentPage",
  default: localStorage.getItem('currpage') || "",
});
export const oeeProdData = atom({
  key: "oeeProdData",
  default: [],
});
export const oeeAssets = atom({
  key: "oeeAssets",
  default: [],
});
export const metricsArry = atom({
  key: "metricsArry",
  default: [],
});
export const instrumentsArry = atom({
  key: "instrumentsArry",
  default: [],
});
export const showEdgeData = atom({
  key: "showEdgeData",
  default: [],
});
export const edgeUpdateStatus = atom({
  key: "edgeUpdateStatus",
  default: [],
});
export const MeterUpdateStatus = atom({
  key: "MeterUpdateStatus",
  default: [],
});
export const showMeterData = atom({
  key: "showMeterData",
  default: [],
});
export const showOEEAsset = atom({
  key: "showOEEAsset",
  default: { show: false, id : 0 },
});
export const showReportAsset = atom({
  key: "showReportAsset",
  default: { show: false, id : 0 },
});
export const themeMode = atom({
  key: "themeMode",
  default: localStorage.getItem('mode') || "light",
});
export const appLanguage = atom({
  key: "appLanguage",
  default: localStorage.getItem('language') || "en",
});
export const snackMessage = atom({
  key: "snackMessage",
  default: "",
});
export const snackDesc = atom({
  key: "snackDesc",
  default: "",
});
export const snackType = atom({
  key: "snackType",
  default: "success",
});
export const snackToggle = atom({
  key: "snackToggle",
  default: false,
});
export const userPlantList = atom({
  key: "userPlantList",
  default: [],
});
export const selUserforLine = atom({
  key: "selUserforLine",
  default: {},
});
export const selUserforLineValid = atom({
  key: "selUserforLineValid",
  default: true,
});
export const drawerMode = atom({
  key: "drawerMode",
  default: JSON.parse(localStorage.getItem("topBarStatus"))===true,
});
export const customDashBool = atom({
  key: "customDashBool",
  default: false,
});
export const currDashName = atom({
  key: "currDashName",
  default: "",
});
export const currentHierarchyData = atom({
  key: "currentHierarchyData",
  default: []
})
export const editDash = atom({
  key: "editDash",
  default: false,
});
export const FullScreenmode = atom({
  key: "FullScreenmode",
  default: false,
});
export const StopExec = atom({
  key: "StopExec",
  default: false,
});
export const ConfirmStopExe = atom({
  key: "ConfirmStopExe",
  default: false,
});
export const ExecDialog = atom({
  key: "ExecDialog",
  default: false,
});
export const dashAssetID = atom({
  key: "dashAssetID",
  default: 1,
});
export const dashBtnGrp = atom({
  key: "dashBtnGrp",
  default: localStorage.getItem("currRangeValue") ? Number(localStorage.getItem("currRangeValue")) : 1,
});
export const customdates = atom({
  key: "customdates",
  default: { StartDate: new Date(), EndDate: new Date() },
});
export const DateSrch = atom({
  key: "DateSrch",
  default: false,
});
export const  tasktablesearch = atom({
  key: "tasktablesearch",
  default: "",
});

export const dashDateArray = atom({
  key: "dashDateArray",
  default: [moment().subtract(6, 'minutes').format("YYYY-MM-DD HH:mm:ss"), moment().subtract(16, 'minutes').format("YYYY-MM-DD HH:mm:ss"), moment().subtract(31, 'minutes').format("YYYY-MM-DD HH:mm:ss"), moment().subtract(61, 'minutes').format("YYYY-MM-DD HH:mm:ss"), moment().subtract(361, 'minutes').format("YYYY-MM-DD HH:mm:ss"), moment().subtract(1, 'day').format("YYYY-MM-DDT23:59:00"), moment().subtract(2, 'day').format("YYYY-MM-DDT23:59:00"),moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'), moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'), moment().format(), moment().format() ],
});
export const dashboardCoreData = atom({
  key: "dashboardCoreData",
  default: []
});
export const selDashLayout = atom({
  key: "selDashLayout",
  default: {}
});
export const selDashData = atom({
  key: "selDashData",
  default: {}
});
export const selDashPoints = atom({
  key: "selDashPoints",
  default: {}
});
export const defaultDashboard = atom({
  key: "defaultDashboard",
  default: ""
});
export const defaultassetid = atom({
  key: "defaultassetid",
  default: ""
});
export const InstrumentsMapList = atom({
  key: "InstrumentsMapList",
  default: []
});

export const currEditdialogToggle = atom({
  key: "currEditdialogToggle",
  default: false,
});
export const Duplicatecopy = atom({
  key: "Duplicatecopy",
  default: false,
});
export const currEditGraphKey = atom({
  key: "currEditGraphKey",
  default: "0",
});
export const currEditGraphData = atom({
  key: "currEditGraphData",
  default: "0",
});
export const DuplicateGraphData = atom({
  key: "DuplicateGraphData",
  default: "0",
});
export const selectedPlant = atom({
  key: "selectedPlant",
  default: { id: '', name: "Select a Plant" },
});
export const selectedPlantIndex = atom({
  key: "selectedPlantIndex",
  default: -1,
});
export const lineEntity = atom({
  key: "lineEntity",
  default: [],
});
export const userLine = atom({
  key: "userLine",
  default: [],
});
export const selectedMeter = atom({
  key: "selectedMeter",
  default: {},
});
export const filteredMeterList = atom({
  key: "filteredMeterList",
  default: [],
});
export const selectedPlantMeterList = atom({
  key: "selectedPlantMeterList",
  default: [],
});
export const reportTabValue = atom({
  key: "reportTabValue",
  default: 0,
});
export const dataTypeRadio = atom({
  key: "dataTypeRadio",
  default: "Consumption",
});
export const reportTypeRadio = atom({
  key: "reportTypeRadio",
  default: "Daywise",
});
export const user = atom({
  key: "user",
  default: {},
});
export const hrms = atom({
  key: "hrms",
  default: {},
});
export const userData = atom({
  key: "userData",
  default: {},
});
export const userDefaultLines = atom({
  key: "userDefaultLines",
  default: [],
});
export const currentUserRole = atom({
  key: "currentUserRole",
  default: { id: 0, role: "" },
});
export const userRoleList = atom({
  key: "userRoleList",
  default: [],
});
export const adminUsersData = atom({
  key: "adminUsersData",
  default: [],
});
export const defaultHierarchyData = atom({
  key: "defaultHierarchyData",
  default: [],
}); 
export const hierarchyData = atom({
  key: "hierarchyData",
  default: [],
});
export const selHierIndex = atom({
  key: "selHierIndex",
  default: -1,
});
export const meterHierarchyData = atom({
  key: "meterHierarchyData",
  default: [],
});
export const selectedHierNode = atom({
  key: "selectedHierNode",
  default: { node: {}, path: [] },
});
export const gatewayData = atom({
  key: "gatewayData",
  default: [],
});
export const alertsData = atom({
  key: "alertsData",
  default: [],
});
export const intervalData = atom({
  key: "intervalData",
  default: "5",
});
export const trendsParamData = atom({
  key: "trendsParamData",
  default: "Consumption (kWh)",
});
export const singleMeterTrendsData = atom({
  key: "singleMeterTrendsData",
  default: [],
});



// #region Gayathri

export const newUDDForm = atom({
  key: "newUDDForm",
  default: {
    formName: "",
    fields: [{ id: "1", metric_name: "", metric_unit: "", entity: "", mandatory: "", value: "" }],
    Frequency: "1d",
    timeResolution: "1h",
    observation: true,
    custome_form: true
  },
});
export const formFields = atom({
  key: "formFields",
  default: {
    formName: "New form",
    fields: ""
  },
});
export const newUDDFormFields = atom({
  key: "newUDDFormFields",
  default: {
    formName: "New form",
    fields: [{ id: "1", metricName: "Batch Production", unit: "tons", entity: "Float2", mandatory: "Yes", value: "" }]
  },
});
export const editFormValues = atom({
  key: "editFormValues",
  default: [],
});
export const measurementCalVal = atom({
  key: "measurementCalVal",
  default: [],
});
export const exploreRange = atom({
  key: "exploreRange",
  default: localStorage.getItem("exploreRange") || 1,
});
export const frmDateExplore = atom({
  key: "frmDateExplore",
  default: "",
});
export const toDateExplore = atom({
  key: "toDateExplore",
  default: "",
});
export const trendsXaxisData = atom({
  key: "trendsXaxisData",
  default: [],
});
export const trendsYaxisData = atom({
  key: "trendsYaxisData",
  default: [],
});
export const formsListTrends = atom({
  key: "formsListTrends",
  default: [],
});
export const metricsListTrends = atom({
  key: "metricsListTrends",
  default: [],
});
export const offlineTrendsData = atom({
  key: "offlineTrendsData",
  default: [],
});
export const selectedForm = atom({
  key: "selectedForm",
  default: "",
});
export const selectedMetric = atom({
  key: "selectedMetric",
  default: "Select all",
});
export const metricsList = atom({
  key: "metricsList",
  default: []
})

// #endregion



// #region FOR OLD REPORTS

export const daywiseData = atom({
  key: "daywiseData",
  default: [],
});
export const daywiseConsData = atom({
  key: "daywiseConsData",
  default: [],
});
export const daywiseReadData = atom({
  key: "daywiseReadData",
  default: [],
});
export const shiftwiseData = atom({
  key: "shiftwiseData",
  default: [],
});
export const monthlyData = atom({
  key: "monthlyData",
  default: [],
});
export const hourlyData = atom({
  key: "hourlyData",
  default: [],
});
export const yearlyData = atom({
  key: "yearlyData",
  default: [],
});
export const specificData = atom({
  key: "specificData",
  default: [],
});
export const specificConsData = atom({
  key: "specificConsData",
  default: [],
});
export const specificReadData = atom({
  key: "specificReadData",
  default: [],
});
export const backup_daywiseData = atom({
  key: "backup_daywiseData",
  default: [],
});
export const backup_daywiseConsData = atom({
  key: "backup_daywiseConsData",
  default: [],
});
export const backup_daywiseReadData = atom({
  key: "backup_daywiseReadData",
  default: [],
});
export const backup_shiftwiseData = atom({
  key: "backup_shiftwiseData",
  default: [],
});
export const backup_monthlyData = atom({
  key: "backup_monthlyData",
  default: [],
});
export const backup_hourlyData = atom({
  key: "backup_hourlyData",
  default: [],
});
export const backup_yearlyData = atom({
  key: "backup_yearlyData",
  default: [],
});
export const backup_specificData = atom({
  key: "backup_specificData",
  default: [],
});
export const backup_specificConsData = atom({
  key: "backup_specificConsData",
  default: [],
});
export const backup_specificReadData = atom({
  key: "backup_specificReadData",
  default: [],
});
export const instrumentsList = atom({
  key: "instrumentsList",
  default: [],
});
export const assetList = atom({
  key: "assetList",
  default: [],
});
 export const nodeList = atom({
  key: "nodeList",
  default: [],
});
export const VirtualInstrumentsList = atom({
  key: "VirtualInstrumentsList",
  default: [],
});
export const selectedmeterExplore = atom({
  key: "selectedmeterExplore",
  default: localStorage.getItem('selectedMeterExplore') || "",
});
export const selectedParamExplore = atom({
  key: "selectedParamExplore",
  default: "",
});
export const onlineTrendsData = atom({
  key: "onlineTrendsData",
  default: [],
});
export const onlineTrendsParam = atom({
  key: "onlineTrendsParam",
  default: "",
});
export const metricUnitsList = atom({
  key: "metricUnitsList",
  default: "",
});
export const selectedMeterName = atom({
  key: "selectedMeterName",
  default: localStorage.getItem('MetricName') || "",
});
export const reportColumnArr = atom({
  key: "reportColumnArr",
  default: [],
});
export const reportDataArr = atom({
  key: "reportDataArr",
  default: [],
});
export const parameterListExplore = atom({
  key: "parameterListExplore",
  default: [],
});
export const onlineTrendsChipArr = atom({
  key: "onlineTrendsChipArr",
  default: [],
});
export const onlineTrendsMetrArr = atom({
  key: "onlineTrendsMetrArr",
  default: [],
});
export const selectedInterval = atom({
  key: "selectedInterval",
  default: localStorage.getItem('intervalOnlineTrends') ? localStorage.getItem('intervalOnlineTrends') : "5",
});
export const childObjctArr = atom({
  key: "childObjctArr",
  default: [],
});
export const dashboardLoader = atom({
  key: "dashboardLoader",
  default: false
})
export const yAxisLimitation = atom({
  key: "yAxisLimitation",
  default: 2
})
export const isRunForToday = atom({
  key: "isRunForToday",
  default: false
})
export const isFullView = atom({
  key: "isFullView",
  default: false
})
export const hierarchyExplore = atom({
  key: "hierarchyExplore",
  default: {}
})
export const hierarchyExploreId = atom({
  key: "hierarchyExploreId",
  default: false
})
export const exploreLoader = atom({
  key: "exploreLoader",
  default: false
})
export const exploreSelectetdHierarchy = atom({
  key: "exploreSelectetdHierarchy",
  default: localStorage.getItem('exploreSelectetdHierarchy') || {id:'',type:'standard'}
})
export const chipState = atom({
  key: "chipState",
  default: false
})
export const assetSelected = atom({
  key: "assetSelected",
  default: localStorage.getItem('assetSelected') || ""
})
export const assetDetails = atom({
  key: "assetDetails",
  default: []
})
export const selectedItem = atom({
  key: "selectedItem",
  default: {}
})
export const formChangeTrigger = atom({
  key: "formChangeTrigger",
  default: 0
})
export const ratingModal = atom({
  key:"ratingModal",
  default: false
})
export const isLogin = atom({
  key: "isLogin",
  default: false
})
export const entrycount = atom({
  key: "entryCOunt",
  default: 0
});
export const selectedHrs = atom({
  key: "selectedHrs",
  default: "Last 5 Min"
})
export const welcomeBack = atom({
  key: "welcomeBack",
  default: false
})
export const exploreExpand = atom({
  key: "exploreExpand",
  default: []
})
export const nodeIDArr = atom({
  key: "nodeIDArr",
  default: []
})
export const taskDialogMode = atom({
  key: "taskDialogMode",
  default: ""
})
export const alarmNotification = atom({
  key: 'alarmNotification',
  default: []
})
export const createNewExec = atom({
  key: 'createNewExec',
  default: 'default'
})
export const editExecVal = atom({
  key: 'editExecVal',
  default: {}
})
export const editExec = atom({
  key: 'editExec',
  default: false
})
export const formTopBar = atom({
  key: 'formTopBar',
  default: true
})
export const formeditbar = atom({
  key : 'formeditbar',
  default : false
})
export const reportProgress = atom({
  key: "reprotProgress",
  default: false
})
export const reportsList = atom({
  key: "reportsList",
  default: []
})
export const stdReportDuration = atom({
  key: 'stdReportDuration',
  default: 27
})
export const stdReportAsset = atom({
  key: 'stdReportAsset',
  default: []
})
export const stdDowntimeAsset = atom({
  key: 'stdDowntimeAsset',
  default: []
})
export const stdAssetName = atom({
  key: 'stdAssetName',
  default: []
})
export const lineTaskView = atom({
  key: 'lineTaskView',
  default: 'table'
})
export const lineOption = atom({
  key: 'lineOption',
  default: ''
})
export const lineAssetArray = atom({
  key: 'lineAssetArray',
  default: []
})
export const saAssetArray = atom({
  key: 'saAssetArray',
  default: JSON.parse(localStorage.getItem('analyticsDefault'))?.asset || []
})

export const SATableData = atom({
  key: 'SATableData',
  default: []
})
export const SATableData2 = atom({
  key: 'SATableData2',
  default: []
})
export const superData = atom({
  key: 'superData',
  default:{Data:[],key:[],stroke:[]}
})
export const SALineData = atom({
  key: 'SALineData',
  default: { Data: [],Data2: [],superData:[],key:[],stroke:[],MaxMin:[],Rejected:[] }
})




export const newFormEntry = atom ({
  key : 'newFormEntry',
  default : 0
})
export const Fields = atom ({
  key : 'Fields',
  default : {}
})
export const MetricUpdateBar = atom ({
  key : 'MetricUpdateBar',
  default : 0
})
export const MetricViewBar = atom ({
  key : 'MetricViewBar',
  default : 0
})
export const hierarchyvisible = atom ({
  key : 'hierarchyvisible',
  default : false
})
export const hierarchyName = atom ({
  key : 'hierarchyName',
  default : ""
})
export const exploreTabValue = atom ({
  key : 'exploreTabValue',
  default : 0
})
export const legendvisible = atom ({
  key : 'legendvisible',
  default : true
})
// #endregion
export const microStopDuration = atom({
  key: "microStopDuration",
  default: false
})
export const selectedReport = atom({
  key: "selectedReport",
  default: ''
})
export const ReportNameselected = atom({
  key: "ReportNameselected",
  default: ''
})
export const editReportValue = atom({
  key: "editReportValue",
  default: []
})
export const reportObject = atom({
  key: "reportObject",
  default: {}
})



export const selectedReportObj = atom({
  key: "selectedReportObj",
  default: {}
})
export const connectstatvisible = atom ({
  key : 'connectstatvisible',
  default : false
})
export const TrendsMeterSummaryArr = atom({
  key: "TrendsMeterSummaryArr",
  default: [],
});
export const trendsload = atom ({
  key : 'trendsload',
  default : false
})
export const connectivitydata = atom({
  key: "connectivitydata",
  default: [],
});
export const connectivityload = atom ({
  key : 'connectivityload',
  default : false
})
export const MeterReadingStatus = atom ({
  key : 'MeterReadingStatus',
  default : false
})
export const GapMode = atom({
  key: "GapMode",
  default: false,
});
export const TrendschartMode = atom({
  key: "TrendschartMode",
  default: false,
});
export const trendsMarkerMode = atom({
  key: "trendsMarkerMode",
  default: false,
});
export const RptFrom = atom({
  key: "RptFrom",
  default: new Date(),
});
export const RptTo = atom({
  key: "RptTo",
  default: new Date(),
}); 
export const openModal = atom ({
  key : "openModal",
  default : false
})
export const sharedx = atom ({
  key : "sharedx",
  default : 0
})
export const QualityMetrics = atom({
  key : "QualityMetrics",
  default : []
})
export const hierNodeName = atom({
  key: "hierNodeName",
  default: ""
})
export const selectedNode = atom({
  key: "selectedNode",
  default: ""
}) 
export const selectedPath = atom({
  key: "selectedPath",
  default: ""
})
export const productTab = atom({
  key: "productTab",
  default: 0
})
export const energyTab = atom({
  key: "energyTab",
  default: 0
})
export const trendLegendView = atom({
  key: "trendLegendVIew",
  default: []
})
export const savedEnergyData = atom({
  key: "savedEnergyData",
  default: []
})
export const Reasontags = atom({
  key: "Reasontags",
  default: []
})
export const HourlyData = atom({
  key: "HourlyData",
  default: []
})
export const DailyData = atom({
  key: "DailyData",
  default: []
})
export const WeeklyData = atom({
  key: "WeeklyData",
  default: []
})
export const MonthlyData = atom({
  key: "MonthlyData",
  default: []
})
export const autoavg = atom({
  key: "autoavg",
  default: []
})
export const manavg = atom({
  key: "manavg",
  default: []
})
export const plantassets = atom({
  key: "plantassets",
  default: []
})
export const plantmetrics = atom({
  key: "plantmetrics",
  default: []
})
export const HourlyLabels = atom({
  key: "HourlyLabels",
  default: []
})
export const DailyLabels = atom({
  key: "DailyLabels",
  default: []
})
export const WeeklyLabels = atom({
  key: "WeeklyLabels",
  default: []
})
export const MonthlyLabels = atom({
  key: "MonthlyLabels",
  default: []
})
export const CategoryGroup = atom({
  key: "CategoryGroup",
  default: 1,
})
export const savedProductData = atom({
  key: "savedProductData",
  default: []
})
export const savedEnergySQMTData = atom({
  key: "savedEnergySQMTData",
  default: []
})
export const savedactivityData = atom({
  key: "savedactivityData",
  default: []
});
export const ProdBtnGrp = atom({
  key: "ProdBtnGrp",
  default:  localStorage.getItem("currRangeProd") ? Number(localStorage.getItem("currRangeProd")) : Number(localStorage.getItem("Production")) ? Number(localStorage.getItem("Production")) :  6,
});

export const dashboardEditMode = atom({
key: "dashboardEditMode",
default: false
})

export const currentDashboardSkeleton = atom({
key: "currentDashboardSkeleton",
default: {}
})

export const currentDashboard = atom({
key: "currentDashboard",
default: []
})


export const EnergyRange = atom({
key: "EnergyRange",
default: {date:'' ,compare:''},
});

export const SQMTRange = atom({
  key: "SQMTRange",
  default: {start:new Date(moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss")) ,end:new Date()},
  });

export const ActivityWise = atom({
  key: "ActivityWise",
  default: [{id:1,name:"Production",checked:true},{id:2,name:"Adjustment",checked:true},{id:3,name:"Downtime",checked:true}],
});

export const NodeNames = atom({
key: "NodeNames",
default: [],
});


export const ProductName = atom({
key: "ProductName",
default: [],
});


export const averageType = atom({
key: "averageType",
default: 1,
});


export const YearOption = atom({
key: "YearOption",
default: new Date().getFullYear(),
});


export const playOption = atom({
key: "playOption",
default: false
})


export const ProgressLoad = atom({
key: "ProgressLoad",
default: false
})

export const WaterfallNodes = atom({
key: "WaterfallNodes",
default: [],
});

export const ActivityNodes = atom({
key: "ActivityNodes",
default: [],
});

export const ProductYear = atom({
key: "ProductYear",
default: new Date().getFullYear(),
});

export const ActivityYear = atom({
key: "ActivityYear",
default: new Date().getFullYear(),
});

export const ProductNames = atom({
key: "ProductNames",
default: [],
});

export const ActivityProductNames = atom({
key: "ActivityProductNames",
default: [],
});

export const EnergyProductNames = atom({
key: "EnergyProductNames",
default: [],
});

export const EnergyBtGroup = atom({
key: "EnergyBtGroup",
default: 1,
});

export const EnergySQMTBtGroup = atom({
key: "EnergySQMTBtGroup",
default: 1,
});
export const oeereportgroupby = atom({
  key: "oeereportgroupby",
  default: 4
}); 
export const NewGridWidget = atom({
  key: "NewGridWidget",
  default: false
});
export const HistoryNotify = atom({
  key: "HistoryNotify",
  default: false
});
export const WorkOrders = atom({
  key: "WorkOrders",
  default: [] 
});
export const ExpandedNodeList = atom({
  key: "ExpandedNodeList",
  default: [] 
});
export const adddtreasondisbale = atom({
  key: "adddtreasondisbale",
  default: false
});
export const MultiLineOEEAssets = atom({
  key: "MultiLineOEEAssets",
  default: []
});
export const sumaryLoading = atom({
  key: "sumaryLoading",
  default: {
    Energy : true, OEE: true, Exec: true,Parts: true, Alert: true,Task: true
  }
});
export const pickerDisable = atom({
  key: "pickerDisable",
  default: false
});
export const executionData = atom({
  key: "workExecution",
  default: []
})
export const executionDetails = atom({
  key: "executionDetails",
  default: []
})
 

export const labelInterval = atom({
  key: "labelInterval",
  default: '' 
});

export const pinSelected = atom({
  key: "pinSelected",
  default: true 
});

export const userInitial = atom({
  key: "userInitial",
  default: "",
});
export const alarmRange = atom({
  key: "alarmRange",
  default: 1,
});
export const defectseverity = atom({
  key: "defectseverity",
  default: [],
});
export const defects = atom({
  key: "defects",
  default: [],
});
export const faultRecommendations = atom({
  key: "faultRecommendations",
  default: [],
});
export const sensordetails = atom({
  key : "sensordetails",
  default : []
})
export const faultRange = atom({
  key: "faultRange",
  default: 14,
});
export const productionDateRange = atom({
  key: "productionDateRange",
  default: 15,
});
export const btnVal = atom({
  key:"btnVal",
  default:false
})
 

export const assetHierarchy = atom({
  key:"assetHierarchy",
  default:[]
})

export const metricGroupHierarchy = atom({
  key:"metricGroupHierarchy",
  default:[]
})

export const instrumentHierarchy = atom({
  key:"instrumentHierarchy",
  default:[]
})

export const selectedHierarchy = atom({
  key:"selectedHierarchy",
  default:[]
})

export const expandedNodeIdHierarchy = atom({
  key:"expandedNodeIdHierarchy",
  default:[]
})
export const resources = atom({
  key:"resources",
  default:[]
})
export const energytype = atom({
  key:"energytype",
  default:1
})
export const ProductList = atom({
  key:"ProductList",
  default:[]
})
export const ConnectivityLoading = atom({
  key:"ConnectivityLoading",
  default: false
})
export const CMSDashboardRange = atom({
  key: "CMSDashboardRange",
  default: {start:new Date(moment().subtract(3, 'months').format("YYYY-MM-DD HH:mm:ss")) ,end:new Date()},
});
export const prodComments = atom({
  key:"prodComments",
  default: {}
})

export const MetricSANames = atom({
  key:"MetricSANames",
  default: JSON.parse(localStorage.getItem('analyticsDefault'))?.metric || []
})
export const AnalyticMet = atom({
  key:"AnalyticMet",
  default: []
})
export const prodsqmtloading = atom({
  key:"prodsqmtloading",
  default: false
})
export const CalcStat = atom({
  key:"CalcStat",
  default: []
})
export const ExpandWidth = atom({
  key:"ExpandWidth",
  default: 250
})

export const TaskTableCustomization = atom({
  key:"TaskTableCustomization",
  default: {page:0,rowperpage:10,order:'asc',orderby:""}
})

export const TaskColumnFilter = atom({
  key:"TaskColumnFilter",
  default: []
})


export const TaskHeadCells = atom({
  key:"TaskHeadCells",
  default: []
})


export const AlarmTableCustomization = atom({
  key:"AlarmTableCustomization",
  default: {page:0,rowperpage:10,order:'asc',orderby:"", headCells:[], selectedColumns:[]}
})

export const AlarmColumnFilter = atom({
  key:"AlarmColumnFilter",
  default: []
})


export const AlarmHeadCells = atom({
  key:"AlarmHeadCells",
  default: []
})



export const AlarmHistroyColumnFilter = atom({
  key:"AlarmHistroyColumnFilter",
  default: []
})


export const AlarmHistroyHeadCells = atom({
  key:"AlarmHistroyHeadCells",
  default: []
})

export const AlarmSearch = atom({
  key:"AlarmSearch",
  default: ""
})

export const SensorSearch = atom({
  key:"SensorSearch",
  default: ""
})

export const AlarmDaterange = atom({
  key:"AlarmDaterange",
  default: localStorage.getItem("alarmRange") ? Number(localStorage.getItem("alarmRange")) : 4
})

export const HistroyTable = atom({
  key:"HistroyTable",
  default: {
    page:0,
    rowperpage:10,
    columnFilter:{
      filterStatus:"",
      filterIntru:"0",
      filterMetName:[],
      filterName:"",
      filterType:"",
      metricsList:[],
      alarmName:[]
    },
    typeFilter:[],
    searchOpen:false,
    search:'',
    typeFilterBy:[],
  
  }
})

export const HistoryTableCustomization =atom({
  key:"HistoryTableCustomization",
  default:{order:'asc',orderby:""}
})

export const TaskRange = atom({
  key:"TaskRange",
  default: 13
})

export const alarmFilter = atom({
  key:"alarmFilter",
  default:[]
})

export const OverviewType = atom({
  key:"OverviewType",
  default:'alert'
})

export const categoryFilter = atom({
  key:"categoryFilter",
  default:[]
})

export const alarmCurrentState = atom({
  key:"alarmCurrentState",
  default:"home"
})
export const selectedContract = atom({
  key:"selectedContract",
  default:[]
})

export const ContractDashboardRange = atom({
  key: "ContractDashboardRange",
  default: {start:new Date(moment().subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss")) ,end:new Date()},
})
export const settingsTabValue = atom({
  key:"settingsTabValue",
  default: localStorage.getItem('tabValue') || 0
})
export const productionTabValue = atom({
  key:"productionTabValue",
  default: 0
})

export const pdmTabValue = atom({
  key:"pdmTabValue",
  default: 0
})

export const neonixTabValue = atom({
  key:"neonixTabValue",
  default: 0
})

export const alarmTabValue = atom({
  key:"alarmTabValue",
  default: 0
})

export const settingsLoader = atom({
  key:"settingsLoader",
  default: true
})

export const optixOptions  = atom({
  key:"optixOptions",
  default: []
})

export const defectAnalyticsoptixOptions  = atom({
  key:"defectAnalyticsoptixOptions",
  default:{
    value:"",
    option:[]
  }
})

export const defTypes  = atom({
  key:"defTypes",
  default: []
})

export const selecteddefectType   = atom({
  key:"selecteddefectType",
  default: []
})

export const optixServerityOption =  atom({
  key:"optixServerityOption",
  default: [
    {id:"very high",name:"Very High"},
    {id:"high",name:"High"},
    {id:"medium",name:"Medium"},
    {id:"low",name:"Low"},
    {id:"-", name:"-"},
  ]
})

export const selectedOptixAsserts =  atom({
  key:"selectedOptixAsserts",
  default: ''
})

export const selectDefaultAnalyticsAsset =  atom({
  key:"selectDefaultAnalyticsAsset",
  default: ''
})

export const alertchartenable = atom({
  key:"alertchartenable",
  default: false
})
export const dataForecastenable = atom({
  key:"dataForecastenable",
  default: false
})
export const forecastCalc = atom({
  key:"forecastCalc",
  default: []
})

export const dashboardExec = atom({
  key:"dashboardExec",
  default: []
})

export const triggerFileUpload = atom({
  key:"triggerFileUpload",
  default: false
})

export const SelectedReportType =  atom({
  key:"SelectedReportType",
  default: 1
})

export const CalenderYear = atom({
  key:"CalenderYear",
  default: ''
})

export const CalendarCurrentPage = atom({
  key:"CalendarCurrentPage",
  default: false
})

export const selectedReportTypeMultiple = atom({
  key:"selectedReportTypeMultiple",
  default: []
})

export const downlaodRawData = atom({
  key:"downlaodRawData",
  default: []
})

export const goLiveData = atom({
  key: "goLive",
  default: false,
})


export const currentScadaJson = atom({
key: "currentScadaJson",
default: []
})

export const selectedScadaViewState = atom({
  key: 'selectedScadaViewState', // Unique ID for this atom
  default: null, // Initial value is null or an empty object if needed
});

export const defaultScadaView = atom({
  key: "defaultScadaView",
  default: ""
});

export const currentScadaViewSkeleton = atom({
key: "currentScadaViewSkeleton",
default: []
})

export const scadaViewEditMode = atom({
key: "scadaViewEditMode",
default: false
})

// Atom for storing the selected node scadacanvas
export const selectedNodeAtom = atom({
  key: 'selectedNodeAtom', 
  default: null,           
});

export const scadaViewListState = atom({
  key: 'scadaViewListState',
  default: [],
});

export const scadaSelectedDetailsState = atom({
  key: 'scadaSelectedDetailsState',
  default: null,
});

export const fetchedDashboardDataState = atom({
  key: 'fetchedDashboardDataState', // unique ID
  default: [], // Default value is an empty array
});

export const scadaSelectedEditmodeType = atom({
  key: 'scadaSelectedEditmodeType',
  default: null,
});
// Atom for storing nodes in the React Flow canvas
export const nodesAtom = atom({
  key: 'nodesAtom',       
  default: [],            
});

export const selectedNodeState = atom({
  key: 'selectedNodeState', // unique ID for this atom
  default: null, // Default value for the selected node (no node selected initially)
});

export const edgesAtom = atom({
  key: 'edgesAtom',       
  default: [],            
});

export const scadaInstance = atom({
key: "scadaInstance",
default: null
})
export const LineHaveLicense = atom({
  key:'LineHaveLicense',
  default: false
})
export const normalMode = atom({
  key: "normalMode",
  default: false
})
export const NormalizeMode = atom({
  key: "NormalizeMode",
  default: false,
});
export const SelectedWOExe = atom({
  key:"SelectedWOExe",
  default: {}
}); 

export const scadaContentVisibleEditState = atom({
  key: 'scadaContentVisibleEditState',
  default: false,
});

export const scadaContentVisibleDeleteState = atom({
  key: 'scadaContentVisibleDeleteState',
  default: false,
});

export const searchTextAtom = atom({
  key: 'searchTextAtom',
  default: '',
});

export const selectedAccessTypeAtom = atom({
  key: 'selectedAccessTypeAtom',
  default: null,
});

export const sortOrderAtom = atom({
  key: 'sortOrderAtom',
  default: '',
});

export const selectedUsersAtom = atom({
  key: 'selectedUsers', 
  default: [], 
});

export const ErrorPage = atom({
  key:"ErrorPage",
  default: false
});
export const AiConversation = atom({
  key:"AiConversation",
  default: []
}); 
export const EnableRearrange = atom({
  key: "EnableRearrange",
  default: false,
});

export const currentScadaId = atom({
  key: 'currentScadaId',
  default: null,
});

export const scadaIdState = atom({
  key: 'scadaIdState',
  default: null,
});

export const scadaContentVisibleState = atom({
  key: 'scadaContentVisibleState',
  default: false,
});

export const VisibleModuleAccess = atom({
  key: "VisibleModuleAccess",
  default: {
    mainModuleAccess:[],
    productionSubModel:[],
    dashboardsubmodelAccess:[],
    reportSubmodelAccess:[]
  }
});

export const SelectedReportPage = atom({
  key: "SelectedReportPage",
  default: {id:"My Report",custome_reports:false,title:"My Report"},
})
export const SelectedDashboardPage = atom({
  key: "SelectedDashboardPage",
  default: {id:"My Dashboard",custome_dashboard:false,title:"Dashboard",name:"Dashboard"},
})
export const dashboardDropdownState = atom({
  key: 'dashboardDropdownState',
  default: [], 
});
export const selectedInstrument = atom({
  key: 'selectedInstrument',
  default: []
})

export const breachCountExplore = atom({
  key: 'breachCountExplore',
  default: {},
})

export const groupBreachCountExplore = atom({
  key: 'groupBreachCountExplore',
  default: {},
})

export const DashBoardHeaderFilter = atom({
  key: 'DashBoardHeaderFilter',
  default: {
    filter: 'all',
    Sort: 'a-z',
    Search: '',
  },
});

export const scadaHeaderFilter = atom({
  key: 'scadaHeaderFilter',
  default: {
    filter: '',
    Sort: 'atoz',
    Search: '',
    SearchOpen:false
  },
});

export const DashBoardEditAccess = atom({
  key: 'DashBoardEditAccess',
  default: false,
});

export const groupBreachCount = atom({
  key: 'groupBreachCount',
  default: [],
})

export const exploreOptions = atom({
  key: 'exploreOptions',
  default: {
    normalize: false,
    markers: false,
    gap: false,
    chart: 0
  }
})

export const showExploreDate = atom({
  key: 'showExploreDate',
  default: null
})


export const exploreDrawerMode = atom({
  key: "exploreDrawerMode",
  default: true,
});

export const isSelectedIsProduct = atom({
  key: "isSelectedIsProduct",
  default: false,
});

export const customIcon = atom({
  key: "customIcon",
  default: null
})
export const IsSocketOn = atom({
  key: "IsSocketOn",
  default: false,
});
