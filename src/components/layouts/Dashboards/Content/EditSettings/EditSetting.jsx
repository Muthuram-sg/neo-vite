/* eslint-disable no-unused-vars */
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import Button from "components/Core/ButtonNDL";
import DummyImage from 'assets/neo_icons/SettingsLine/image_icon.svg?react';
import BlackX from 'assets/neo_icons/SettingsLine/black_x.svg?react';
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import Grid from "components/Core/GridNDL";
import useTheme from "TailwindTheme";
import InputFieldNDL from "components/Core/InputFieldNDL";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import RadioNDL from "components/Core/RadioButton/RadioButtonNDL";
import ListNDL from "components/Core/DropdownList/ListNDL";
import useGetAlertsDashboard from "components/layouts/Dashboards/hooks/useAlertsDashboard.jsx";
import useLineListData from "../../hooks/useLocationList.jsx";
import useTemperatureSensorData from "../../hooks/useTemperatureSensorList.jsx";
import {
  dashboardEditMode,
  selectedPlant,
  currentDashboardSkeleton,
  InstrumentsMapList,
  defaultDashboard,
  user,
  playOption,
  snackToggle,
  snackMessage,
  snackType,
  oeeAssets,currentDashboard,
  themeMode
} from "recoilStore/atoms";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import useInstrumentMetricsList from "Hooks/useGetMetricForInstrument";
import Toast from "components/Core/Toast/ToastNDL";
import useUpdateDashData from "../../hooks/useUpdateDashData.jsx";
import useUpdateDashLayout from "../../hooks/useUpdateDashLayout.jsx";
import useDashboardUploads from "../../hooks/useDashboardUpload.jsx";
import useDashboardFetch from '../../hooks/useGetDashboardUploads.jsx';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Typography from "components/Core/Typography/TypographyNDL";
import Image from "components/Core/Image/ImageNDL";
import { isArray } from "lodash";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";
/** Drag and Drop */
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableIcon } from "components/layouts/Settings/Production/Steel/components/DraggableIcon.jsx";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import DatepickerNDL from "components/Core/DatepickerNDL/index.jsx";
import TypographyNDL from "components/Core/Typography/TypographyNDL.jsx";
import FileInputNDL from "components/Core/FileInput/FileInputNDL.jsx"; 
import moment from "moment";
import EditPicker from  "./EditSettingPicker.jsx"



const EditSetting = forwardRef((props, ref) => {//NOSONAR
  const { t } = useTranslation();
  const theme = useTheme();
  const [, setDashEdit] = useRecoilState(dashboardEditMode);
  const [, setPlayMode] = useRecoilState(playOption);
  const [oeeAssetsArray] = useRecoilState(oeeAssets);
  const [headPlant] = useRecoilState(selectedPlant);
  const [dashboardDefaultID] = useRecoilState(defaultDashboard);
  const [currUser] = useRecoilState(user);
  const [selectedDashboard] = useRecoilState(currentDashboard);
  const [openSnack, setOpenSnack] = useState(false);
  const [message, SetMessage] = useState("");//NOSONAR
  const [type, SetType] = useState("");//NOSONAR
  const [, SetMessageRecoil] = useRecoilState(snackMessage);
  const [, SetTypeRecoil] = useRecoilState(snackType);
  const [, setOpenSnackRecoil] = useRecoilState(snackToggle);
  const [selectedDashboardSkeleton, setSelectedDashboardSkeleton] =
    useRecoilState(currentDashboardSkeleton);
  const [instDisable, setInstDisable] = useState(false);
  const [InstrumentsMap] = useRecoilState(InstrumentsMapList);
  const [chartType, setChartType] = useState("");

  const [clockMode, setClockMode] = useState({});
  const [timeFormat, setTimeFormat] = useState();
  const [timeZone, setTimeZone] = useState();
  const [showDate, setShowDate] = useState(false);
  const [clockFont, setClockFont] = useState("default");
  const [date, setdate] = useState({ value: null, isValid: true });
  const [enddate, setenddate] = useState({ value: null, isValid: true }); 

  const [tempunit, setTempUnit] = useState("");//NOSONAR
  const [temperatureSensorData, setTemperatureSensorData] = useState([]);
  const [location, setLocation] = useState("");
  const [locationOption, setLocationOption] = useState([]);
  const [existingTempUnit, setExistingTempUnit] = useState();
  const [file, setFile] = useState(null);
  const [videoSource, setVideoSource] = useState("url");
  const [fileSizeError, setFileSizeError] = useState(false);

  const [tooltipDisable, setTooltipDisable] = useState(false);
  const [customYaxis, setCustomYaxis] = useState(false);
  const [textConvert, settextConvert] = useState(false);
  const [isInstrument, setIsInstrument] = useState(true);
  const [isBarVsLine, setIsBarVsLine] = useState(true);
  const [isDecimal, setIsDecimal] = useState(false);
  const [decimalPoint, setDecimalPoint] = useState("none");
  const [aggregation, setAggregation] = useState("none");
  const [groupBy, setGroupBy] = useState("none");
  const [tooltipSort, setTooltipSort] = useState("none");
  const [fontVariantValue, setFontVariantValue] = useState("default");
  const [textAlignValue, setTextAlignValue] = useState("center");
  const [textSizeValue, setTextSizeValue] = useState("10");
  const [displayStyleValue, setDisplayStyleValue] = useState("heading1");
  const [accordian1, setAccordian1] = useState(false);
  const [accordian2, setAccordian2] = useState(false);
  const [isLabel, setIsLabel] = useState(false);
  const [isMultiMetric, setIsMultiMetric] = useState(false)
  const [multiMetricCellColour, setMultiMetricCellColour] = useState('#ffffff')
  const [isdataStats, setDataStats] = useState(false);//NOSONAR
  const [isShowAlarm, setIsShowAlarm] = useState(false);
  const [isConsumption, setisConsumption] = useState(false);

  const [instrumentID, setInstrumentID] = useState("");
  const [metricName, setMetricName] = useState([]);
  const [metricTitle, setMetricTitle] = useState([]);
  const [virtualInstrumentID, setVirtualInstrumentID] = useState("");
  const [virtualFormula, setVirtualFormula] = useState("");
  const [CurTheme] = useRecoilState(themeMode)

  const [multipleVirtualInstrument, setMultipleVirtualInstrument] = useState([])
  const [yetToSelectMetric, setYetToSelectMetric] = useState(false)
  const [chart1, setChart1] = useState(null)
  const [chart2, setChart2] = useState(null)
  const [instrument1, setInstrument1] = useState(null)
  const [instrument2, setInstrument2] = useState(null)
  const [metric1, setMetric1] = useState(null)
  const [metric2, setMetric2] = useState(null)
  const [corrColour, setCorrColour] = useState('')

  const [isPrimary, setIsPrimary] = useState(true)
  const [primaryMetricOption, setPrimaryMetricOption] = useState([])
  const [secondaryMetricOption, setSecondaryMetricOption] = useState([])

  const [isDowntime, setIsDowntime] = useState(true);
  const [AssetOption, setAssetOption] = useState([]);
  const [asset, setAsset] = useState(null)
  const [product, setProduct] = useState(null)//NOSONAR

  const [anchorEl, setAnchorEl] = useState(null);
  const [, setOpen] = useState(false);//NOSONAR
  const [popperOption] = useState([
    { id: "instrument", name: "Instrument" },
    { id: "virtualInstrument", name: "Virtual Instrument" },
  ]);//NOSONAR
  const [MetricFields, setMetricFields] = useState([
    {
      field: 1,
      instrument_id: "",
      instrument_name: "",
      metric_name: [],
      metric_title: [],
      metOpt: [],
      TableCellColor: "#ffffff",
    },
  ]);

  const [arc1Max, setarc1Max] = useState(1);
  const [arc2Max, setarc2Max] = useState(0);
  const [arc3Max, setarc3Max] = useState(0);
  const [dataType, setdataType] = useState("");
  const [images, setImages] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [alertName, setAlertName] = useState([]);
  const [alertID, setAlertID] = useState([]);
  const [mapInstrumentID, setMapInstrumentID] = useState([]);
  const [formulaName, setFormulaName] = useState("");
  const [EditTitle, setEditTitle] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [, setMultiMetric] = useState(false);//NOSONAR
  const [Error, setError] = useState(false);//NOSONAR
  const [dashboardlistloader,setdashboardlistloader] = useState(true)

  const [ArcColor, setArcColor] = useState({});
  const [fromDate, setfromDate] = useState(new Date().setMinutes(new Date().getMinutes() - 5))
  const [toDate, settoDate] = useState(new Date())
  const [selectedRange,setselectedRange] = useState(1)
 

  const statusOption = [
    { id: "binary", name: "Binary" },
    { id: "multiLevel", name: "Multi Level" },
  ];
  const [optionTypes, setOptionType] = useState("binary");//NOSONAR

  const [multiStatus, setMultiStatus] = useState([
    {
      multiPossitiveText: "",
      multiPossitiveValue: "",
      multiPossitiveColor: "#88B056",
    },
  ]);
  const [dynamicColor,setDynamicColor]=useState({
    level1_color:"#ffffff",level2_color:"#ffffff",level3_color:"#ffffff",
  })
  const [arc1Min,setarc1Min]=useState("")
  const [alarmLevels, setAlarmLevels] = useState({});
  const [disable, setDisable] = useState(false);
  const [showButton, setShowButton] = useState(false);
 

  //const [IsAlarm,setIsAlarm] = useState(false)
  const {
    instrumentMetricListLoading,
    instrumentMetricListData,
    instrumentMetricListError,
    instrumentMetricList,
  } = useInstrumentMetricsList();
  const {
    alertsDashboardLoading,
    alertsDashboarddata,
    alertsDashboarderror,
    getAlertsDashboard,
  } = useGetAlertsDashboard();

  const {
  
    LocationDataData,

    getLineLocationData,
  } = useLineListData();
  const {

    temperatureSensorListDataData,

    getTemperatureSensorListData,
  } = useTemperatureSensorData();

  const {
    UpdateDashDataLoading,//NOSONAR
    UpdateDashDataData,//NOSONAR
    UpdateDashDataError,//NOSONAR
    getUpdateDashData,
  } = useUpdateDashData();
  const {
    UpdateDashLayoutLoading,//NOSONAR
    UpdateDashLayoutData,//NOSONAR
    UpdateDashLayoutError,//NOSONAR
    getUpdateDashLayout,
  } = useUpdateDashLayout();
  const {
    dashboardUploadsLoading,
    dashboardUploadsData,
    
    getaddDashboardUploadsDocs,
  } = useDashboardUploads();
  const {
    dashboardFetchLoading,
    dashboardFetchData,
    dashboardFetchError,
    getFetchDashboardUploadsDocs
  } = useDashboardFetch();

  const nameRef = useRef();
  const yaxisFromRef = useRef();
  const yaxisToRef = useRef();
  const Arc1color = useRef();
  const Arc2color = useRef();
  const Arc3color = useRef();
  const textContent = useRef();
  const positiveColor = useRef();
  const positiveValue = useRef();
  const positiveText = useRef();
  const negativeColor = useRef();
  const negativeValue = useRef();
  const negativeText = useRef();
  const Color = useRef();
  const BackgroundColor = useRef();
  //const TableCellColor = useRef()
  const Color1 = useRef();
  const Color2 = useRef();
  const Color3 = useRef();
  const text1Ref = useRef();
  const text2Ref = useRef();
  const text3Ref = useRef();
  const arc3MaxLimit = useRef();
  const maxTemp = useRef();
  const url = useRef();

  const widgetList = [
    {
      id: "line",
      name: "Line Chart",
    },
    {
      id: "bar",
      name: "Bar Chart",
    },
    {
      id: "stackedbar",
      name: "StackedBar Chart",
    },
    {
      id: "groupedbar",
      name: "Grouped Bar Chart",
    },
    {
      id: "combobar",
      name: "Combo Bar Chart",
    },
    {
      id: "correlogram",
      name: "Correlogram",
    },
    {
      id: "pie",
      name: "Pie Chart",
    },
    {
      id: "pareto",
      name: "Pareto Chart"
    },
    {
      id: "donut",
      name: "Donut Chart",
    },
    {
      id: "area",
      name: "Area Chart",
    },
    {
      id: "singleText",
      name: "Single Value",
    },
    {
      id: "dialgauge",
      name: "Dial Gauge 1",
    },
    {
      id: "dialgauge2",
      name: "Dial Gauge 2",
    },

    {
      id: "fillgauge",
      name: "Radial Gauge",
    },

    {
      id: "Text",
      name: "Text",
    },
    {
      id: "Table",
      name: "Table",
    },
    {
      id: "Image",
      name: "Image",
    },
    {
      id: "Status",
      name: "Status",
    },
    {
      id: "alerts",
      name: "Alert",
    },
    {
      id: "map",
      name: "Map",
    },
    {
      id: "clock",
      name: "Clock",
    },
    {
      id: "energymeter",
      name: "Energy Meter",
    },
    {
      id: "thermometer",
      name: "Thermometer",
    },
    {
      id: "weather",
      name: "Weather",
    },
    {
      id: "dataoverimage",
      name: "Data Over Image",
    },
    {
      id: "video",
      name: "Video",
    },
  ];

 

  const choseBarVsLineChart = [
    {
      id: "bar",
      name: "Bar Chart"
    },
    {
      id: "line",
      name: "Line Chart"
    }
  ]
  const choseAreaVsLineChart = [
    {
      id: "area",
      name: 'Area Chart'
    },
    {
      id: "line",
      name: 'Line Chart'
    }
  ] 
  const temperatureUnitOptions = [
    {
      id: "celcius",
      name: "Celsius",
    },
    {
      id: "farenheit",
      name: "Fahrenheit",
    },
    {
      id: "kelvin",
      name: "Kelvin",
    },
  ];

  const clockWidgetOptions = [
    {
      id: "clock",
      name: "Clock",
    },
    {
      id: "countdown",
      name: "Count Down",
    },
    {
      id: "countup",
      name: "Count Up",
    },
  ];
  const clockTimeZoneOptions = [
    {
      id: "GMT",
      name: "Greenwich Mean Time (GMT)",
    },
    {
      id: "IST",
      name: "Indian Standard Time (IST)",
    },
  ];

  const clockFontOptions = [
    {
      id: "default",
      name: "Default",
    },
    {
      id: "7segment",
      name: "7 Segment Display",
    },
  ];



  const decimalPointsList = [
    {
      id: "none",
      name: "None",
    },
    {
      id: 2,
      name: 2,
    },
    {
      id: 3,
      name: 3,
    },
    {
      id: 4,
      name: 4,
    },
  ];
  const aggregationList = [
    {
      id: "none",
      name: "None",
    },
    {
      id: "last",
      name: "Last",
    },
    {
      id: "sum",
      name: "Sum",
    },
    {
      id: "min",
      name: "Minimum",
    },
    {
      id: "max",
      name: "Maximum",
    },
    {
      id: "avg",
      name: "Average",
    },
    {
      id: "consumption",
      name: "Consumption",
    },
  ];
  const groupbyList = [
    {
      id: "none",
      name: "None",
    },
    {
      id: "hour",
      name: "Hour",
    },
    {
      id: "shift",
      name: "Shift",
    },
    {
      id: "day",
      name: "Day",
    },
  ];

  const tooltipSortList = [
    {
      id: "none",
      name: "None",
    },
    {
      id: "asc",
      name: "Ascending",
    },
    {
      id: "desc",
      name: "Descending",
    },
  ];

  const fontVariantList = [
    {
      id: "default",
      name: "Default",
    },
    {
      id: "7segmentdisplay",
      name: "7 Segment Display",
    },
  ];

  const colour = [
    {
      id: 'blue',
      name: 'Blue'
    },
    {
      id: 'red',
      name: 'Red'
    },
    {
      id: 'green',
      name: 'Green'
    }
  ]

  const textAlignList = [
    {
      id: "left",
      name: "Left",
    },
    {
      id: "center",
      name: "Center",
    },
    {
      id: "right",
      name: "Right",
    },
    {
      id: "justify",
      name: "Justify",
    },
  ];

  const displayStyleList = [
    {
      id: "heading1",
      name: <h1>Heading 1</h1>,
    },
    {
      id: "heading2",
      name: <h2>Heading 2</h2>,
    },
    {
      id: "paragraph",
      name: <p>Paragraph</p>,
    },
  ];

  const textSizeList = [
    {
      id: "10",
      name: "10",
    },
    {
      id: "12",
      name: "12",
    },
    {
      id: "14",
      name: "14",
    },
    {
      id: "16",
      name: "16",
    },
    {
      id: "20",
      name: "20",
    },
    {
      id: "24",
      name: "24",
    },
    {
      id: "32",
      name: "32",
    },
    {
      id: "36",
      name: "36",
    },
    {
      id: "40",
      name: "40",
    },
  ];
  const classes = {
    root: {
      margin: 0,
      padding: 5,
    },
    margin: {
      margin: "4px",
    },
    textField: {
      width: "16ch",
    },
    list: theme.list,
    paper: theme.menuPaper,

    colorDiv: {
      // display: 'inline-block',
      // paddingLeft: 10,
      // marginTop:17
    },
    colorInput: {
      height: "2.6rem",
      marginTop: "3px",
      border: 0,
      padding: "5px",
      width: "15ch",
    },
    ImageDiv: {
      position: "relative",
      height: "103px",
      color: "#97A1A8",
      // background: "#fff",
      border: CurTheme === "dark" ? "1px dashed #2a2a2a" :"1px dashed #C8CBCE",
      textAlign: "center",
      transition: "box-shadow 0.3s, border-color 0.3s",
      cursor: "pointer",
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
      borderRadius: "6px",
    },
    divcolorBackground: {
      width: "7.9rem",
      height: "37px",
      backgroundColor: theme.colorPalette.divcolor,
      padding: "5px",
    },
    colorPicker: {
      width: "7.1rem",
      height: "26px",
      border: "1px solid #000000",
      backgroundColor: theme.colorPalette.colorpicker1,
    },
    colorPicker2: {
      width: "7.1rem",
      height: "26px",
      border: "1px solid #000000",
      backgroundColor: theme.colorPalette.colorpicker2,
    },
    colorPicker3: {
      width: "7.1rem",
      height: "26px",
      border: "1px solid #000000",
      backgroundColor: theme.colorPalette.colorpicker3,
    },
  };

  useImperativeHandle(ref, () => ({
    openDialog: (detail) => {
      handleDialogOpen(detail);
    },
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1500);
 
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    let astArry = []

    oeeAssetsArray.map(val => {
      astArry.push({
        id: val.entity.id,
        name: val.entity.name,
      })
    })
    setAssetOption(astArry)



  }, [oeeAssetsArray])

  useEffect(() => {
      const formData = new FormData();
      if(file?.["0"]){
        formData.append("uploads", file?.["0"]);
        formData.append("dashboardId", dashboardDefaultID);
        getaddDashboardUploadsDocs(formData);
      }
  }, [file]);

  function base64ToBlob(base64, contentType) {
    try {
        const base64Fixed = base64.replace(/-/g, '+').replace(/_/g, '/');

        const byteCharacters = Buffer.from(base64Fixed, 'base64')
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        return new Blob([byteArray], { type: contentType });
    } catch (e) {
        console.error("Error decoding Base64 string: ", e);
        return null; 
    }
  }

  function base64ToFile(base64, filename, contentType) {
    // Convert the base64 string to a Blob
    const blob = base64ToBlob(base64, contentType);
    const input =filename;
    const[, secondPart] = input.split(/-(.+)/);
    return new File([blob], secondPart, { type: contentType });
  }

  useEffect(() => {
    // console.log("PROPS______!!\n",props)
    props?.detail?.meta?.url?.id && getFetchDashboardUploadsDocs(props?.detail?.meta?.url?.id) //NOSONAR
  }, [])

  useEffect(() => {
    if(!dashboardFetchLoading &&  dashboardFetchData && !dashboardFetchError){
   
      if(dashboardFetchData.data){
        const base64String1 = dashboardFetchData.data?.[dashboardFetchData.data.type] ; // Replace with your base64 string
        const filename = dashboardFetchData.data?.name; // Desired file name with the correct extension
        const contentType = `${dashboardFetchData.data.type}/${dashboardFetchData.data?.name.split('.')[1]}`;

        const file = base64ToFile(base64String1, filename, contentType);
        setFile(file)
      }
  }
  }, [dashboardFetchLoading,
    dashboardFetchData,
    dashboardFetchError])

    const handleRemoveAssetImage = ()=>{
      setFile(null)
      // setisFileSizeError({value:false,type:null})
    }

  useEffect(() => {
    getAlertsDashboard(headPlant.id);
    getLineLocationData();
    getTemperatureSensorListData(headPlant.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant]);

  useEffect(() => {
    let arr = [];
    if (LocationDataData?.length > 0) {
      LocationDataData.map((x) =>
        arr.push({
          id: x.location,
          name: x.location,
        })
      );
      setLocationOption(arr);
    }
  }, [LocationDataData]);

  useEffect(() => {
    if (temperatureSensorListDataData?.length > 0) {
      setTemperatureSensorData(temperatureSensorListDataData);
    }
  }, [temperatureSensorListDataData]);

  // console.log(MetricFields,"metricFields")
  useEffect(() => {//NOSONAR
    if (
      !alertsDashboardLoading &&
      alertsDashboarddata &&
      !alertsDashboarderror
    ) {
      // console.log(alertsDashboarddata,"alertsDashboarddata")
      if (
        chartType === "line" &&
        MetricFields &&
        MetricFields.length > 0 &&
        MetricFields[0] &&
        MetricFields[0].metric_title &&
        MetricFields[0].metric_title.length > 0
      ) {
        const metricField = MetricFields[0];
        if (MetricFields.length === 1) {
          if (metricField.metric_title && metricField.metric_title.length > 0) {
            const metricName =
              metricField.metric_title[0] && metricField.metric_title[0].name;
            const instrumentId = metricField.instrument_id;
            //console.log(alertsDashboarddata,metricName,instrumentId,"check")
            const matchedAlert = alertsDashboarddata.find(
              (alert) =>
                alert.instruments_metric.metric.name === metricName &&
                alert.instruments_metric.instrument.id === instrumentId
            );

            if (matchedAlert) {
              const result = {
                alert_id: matchedAlert.id,
              };
              //console.log(alertsDashboarddata,matchedAlert,result,"check alert")
              setAlarmLevels(result);
              if (disable) {
                setDisable(false);
              }
            } else {

              setDisable(true);
              setIsShowAlarm(false);
            }
          }  
        }
      } else if (
        (chartType === "bar" || chartType === "area") &&
        metricTitle &&
        metricTitle.length > 0 &&
        MetricFields.length > 0
      ) {
        if (metricTitle.length <= 1) {
          if (metricTitle[0]) {
            const metric = metricTitle[0].name;
            const instrument = metricTitle[0].title;
            let insID = MetricFields[0] && MetricFields[0].instrument_id;
            const matchedAlert = alertsDashboarddata.find(
              (alert) =>
                alert.instruments_metric.metric.name === metric &&
                alert.instruments_metric.metric.title === instrument &&
                alert.instruments_metric.instrument.id === insID
            );

            if (matchedAlert) {
              const result = {
                alert_id: matchedAlert.id,
              };
              //  console.log(matchedAlert,result,"check alert")
              setAlarmLevels(result);
              if (disable) {
                setDisable(false);
              }
            } else {
       
              if (metricTitle.length === 1) {
                setDisable(true);
                setIsShowAlarm(false);
              }
            }
          } 
        }  
      } else if (virtualInstrumentID && chartType !== "Table") {
        const matchedAlert = alertsDashboarddata.find(
          (alert) =>
            alert.viid === virtualInstrumentID &&
            alert.entity_type === "virtual_instrument"
        );
        // console.log(matchedAlert,"matched")
        if (matchedAlert) {
          const result = {
            alert_id: matchedAlert.id,
          };

          setAlarmLevels(result);
          if (disable) {
            setDisable(false);
          }
        } else {


          setDisable(true);
          setIsShowAlarm(false);
        }
      }
    }
  }, [
    alertsDashboardLoading,
    alertsDashboarddata,
    alertsDashboarderror,
    virtualInstrumentID,
    MetricFields,
    metricTitle,
  ]);

  useEffect(() => {
    if (
      !instrumentMetricListLoading &&
      !instrumentMetricListError &&
      instrumentMetricListData
    ) {
      if(chartType === "combobar"){
        // console.clear()
        console.log(instrumentMetricListData)
        if(instrumentMetricListData.length === 1) {
          // This is during Add part of Combo Chart 
          isPrimary ? setPrimaryMetricOption(instrumentMetricListData?.[0]?.metOpt) : setSecondaryMetricOption(instrumentMetricListData?.[0]?.metOpt)
        } else {
          // This is during Edit part of Combo chart
          setPrimaryMetricOption(instrumentMetricListData?.[0]?.metOpt)
          setSecondaryMetricOption(instrumentMetricListData?.[1]?.metOpt)
        }
      }
      else {
        // "HELLO"
        setMetricFields(instrumentMetricListData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    instrumentMetricListLoading,
    instrumentMetricListData,
    instrumentMetricListError,
  ]);


 
  useEffect(() => {
    setTimeout(() => {
      if (!isEdit) {
        if (chartType === "Status") {
          positiveColor.current.value = "#88B056";
          negativeColor.current.value = "#DF3B44";
        }
        if (chartType === "singleText") {
       

          Color1.current.value = "#88B056";
          Color2.current.value = "#FFD121";
          Color3.current.value = "#DF3B44";
          Color.current.value = "#000000";
        }
        if (
          chartType === "dialgauge" ||
          chartType === "dialgauge2" ||
          chartType === "fillgauge"
        ) {
          // console.log(detail.meta.color1,"detail.meta.color1")
          setArcColor({
            Arc1color: "#88B056",
            Arc2color: "#FFD121",
            Arc3color: "#DF3B44",
          });
        }
      }
    }, 1000);
  }, [isEdit, chartType]);

  const handleDialogOpen = (detail) => {//NOSONAR

    if (detail) {
      setIsEdit(true);
      setChartType(detail.type);
      settextConvert(detail.meta.isText ? detail.meta.isText : false);
      setCustomYaxis(
        detail.meta.isCustomYaxis ? detail.meta.isCustomYaxis : false
      );
      setIsDecimal(detail.meta.isDecimal ? detail.meta.isDecimal : false);
      setIsLabel(detail.meta?.isLabel ? detail.meta.isLabel : false);
      setIsInstrument(
        detail.meta.isOnline !== undefined ? detail.meta.isOnline : true
      );
      setisConsumption(
        detail.meta.isConsumption ? detail.meta.isConsumption : false
      );

      if( selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type === 'widgetpicker'){
        if(detail.meta.fromDate && detail.meta.toDate){
          setfromDate(new Date(detail.meta.fromDate))
          settoDate(new Date(detail.meta.toDate))
        }

        if(detail.meta.selectedRange && detail.meta.selectedRange !== '' ){
          // console.log(detail.meta.selectedRange,"detail.meta.selectedRange")
         setselectedRange(detail.meta.selectedRange)
        }

      }

      if (!detail.meta.isOnline) {
        setVirtualInstrumentID(detail.meta.virturalInstrument);
        setVirtualFormula(detail.meta.formula);
        setFormulaName(detail.meta.formulaName);
      }
      if (detail.meta.instrument) {
        setInstrumentID(detail.meta.instrument);
        instrumentMetricList(
          [{ metOpt: [], field: 1, instrument_id: detail.meta.instrument }],
          detail.type
        );
      }
      const getMetricObject = (metric, metricsListData) => {
        const metric_split = metric.split("-");
        return metricsListData.filter(
          (x) => x.name === metric_split[0]
        )[0];
      };
      if (
        (detail.type === "line" ||
          detail.type === "stackedbar" ||
          detail.type === "groupedbar" ||
          detail.type === "pie" ||
          detail.type === "combobar" ||
          detail.type === "correlogram" ||
          detail.type === "donut") &&
        detail.meta.metricField
      ) {
        //  console.log("entersesetagrregatiomn")
        setIsMultiMetric(detail.meta.isMultiMetric)
        setMetricTitle(detail.meta.metricField);
        setDecimalPoint(detail.meta.decimalPoint);
        setAggregation(detail.meta.aggregation);
        setGroupBy(detail.meta.groupBy);
        //if(detail.meta.metricField.length)
        setDataStats(detail.meta.isDataStats ? detail.meta.isDataStats : false);
        setTooltipSort(detail.meta.tooltipSort);
        setIsLabel(detail.meta.isLabel ? detail.meta.isLabel : false);
        setIsShowAlarm(
          detail.meta.isShowAlarm ? detail.meta.isShowAlarm : false
        );
        setMultipleVirtualInstrument(!detail.meta.isOnline ? detail.meta.variables : [])
        setShowDate(detail.meta.showLabel);
         
        const metricFields = detail.meta.metricField[0];
        const metricArr = Object.keys(metricFields).map((key, index) => {
          if (detail.meta.isOnline) {
            const field = index + 1;
            const instrument_id = metricFields[key].instrument;
            const instrument_name = props.instrumentListData
              .filter((iid) => iid.id === instrument_id)
              .map((y) => y.name);
            const metric_field = metricFields[key].metric;
            

            const titleArr = metric_field.map((metric) =>
              getMetricObject(metric, props.metricsListData)//NOSONAR
            );
            const nameArr = metric_field.map((metric) =>
              getMetricObject(metric, props.metricsListData)//NOSONAR
            );

            return {
              field: field,
              instrument_id: instrument_id,
              instrument_name: instrument_name[0],
              metric_name: nameArr,
              metric_title: titleArr,
              metOpt: [],
            };
          } else {
            return {
              field: 1,
              instrument_id: "",
              instrument_name: "",
              metric_name: [],
              metric_title: [],
              metOpt: [],
            };
          }
        });
        console.clear()
        console.log(metricArr)
        instrumentMetricList(metricArr, detail.type);
        //CheckConsumptionForMultiInstrument(metricArr)
      } else {
        if (detail.type === "Table" && detail.meta.metricField) {

          if(detail.meta.isMultiMetric){
            setMetricTitle(detail.meta.metricField);
            setDecimalPoint(detail.meta.decimalPoint);
            setAggregation(detail.meta.aggregation);
            setIsMultiMetric(detail.meta.isMultiMetric)
            setMultiMetricCellColour(detail.meta.multiMetricCellColour)
            const metricFields = detail.meta.metricField[0];
            const metricArr = Object.keys(metricFields).map((key, index) => {

                const field = index + 1;
                const instrument_id = metricFields[key].instrument;
                const instrument_name = props.instrumentListData
                  .filter((iid) => iid.id === instrument_id)
                  .map((y) => y.name);
                const metric_field = metricFields[key].metric;

              
                const titleArr = metric_field.map((metric) =>
                  // {return { cheked:true, ...getMetricObject(metric, props.metricsListData)}}//NOSONAR
                  getMetricObject(metric, props.metricsListData)//NOSONAR
                );
                const nameArr = metric_field.map((metric) =>
                  // {return { cheked:true, ...getMetricObject(metric, props.metricsListData)}}
                  getMetricObject(metric, props.metricsListData)//NOSONAR
                );
              
                return {
                  field: field,
                  instrument_id: instrument_id,
                  instrument_name: instrument_name[0],
                  metric_name: nameArr,
                  metric_title: titleArr,
                  metOpt: [],
                };
            });
            // console.clear()
            console.log(metricArr)
            instrumentMetricList(metricArr, detail.type);
          }
          else {
            setIsMultiMetric(false)
          
            setMetricTitle(detail.meta.metricField);
            setDecimalPoint(detail.meta.decimalPoint);
            setAggregation(detail.meta.aggregation);
            // console.clear()
            
            const metricFields = detail.meta.metricField[0];
            
            const metricArr = Object.keys(metricFields).map((key, index) => {
              if (metricFields[key].instrument) {
                const field = index + 1;
                const instrument_id = metricFields[key].instrument;
                const TableCellColor = metricFields[key].TableCellColor;
                const instrument_name = props.instrumentListData
                .filter((iid) => iid.id === instrument_id)
                .map((y) => y.name);
                const metric_field = metricFields[key].metric;
                
                
                const titleArr = metric_field.map((metric) =>
                  getMetricObject(metric, props.metricsListData)//NOSONAR
                );
                const nameArr = metric_field.map((metric) =>
                  getMetricObject(metric, props.metricsListData)//NOSONAR
                );
              
                return {
                  field: field,
                  instrument_id: instrument_id,
                  instrument_name: instrument_name[0],
                  metric_name: nameArr,
                  metric_title: titleArr,
                  metOpt: [],
                  TableCellColor: TableCellColor,
                };
              } else if (metricFields[key].virtualInstrument) {
                const field = index + 1;
                const virtualInstrument_id = metricFields[key].virtualInstrument;
                const TableCellColor = metricFields[key].TableCellColor;
                const virtualInstrument_name = props.virtualInstrumentListData
                  .filter((iid) => iid.id === virtualInstrument_id)
                  .map((y) => y.name);
              
                return {
                  field: field,
                  virtualInstrument_id: virtualInstrument_id,
                  virtualInstrument_name: virtualInstrument_name,
                  TableCellColor: TableCellColor,
                };
              } else {
                return {
                  field: 1,
                  instrument_id: "",
                  instrument_name: "",
                  metric_name: [],
                  metric_title: [],
                  metOpt: [],
                  TableCellColor: "",
                };
              }
            });
            instrumentMetricList(metricArr, detail.type);
            //CheckConsumptionForMultiInstrument(metricArr)
          }
        }
        if (detail.type === "area" || detail.type === "bar") {
          setMetricTitle(detail.meta.metric);
          setDecimalPoint(detail.meta.decimalPoint);
          setAggregation(detail.meta.aggregation);
          setGroupBy(detail.meta.groupBy);
          setDataStats(
            detail.meta.isDataStats ? detail.meta.isDataStats : false
          );
          setTooltipSort(detail.meta.tooltipSort);
          setIsLabel(detail.meta.isLabel ? detail.meta.isLabel : false);
          setIsShowAlarm(
            detail.meta.isShowAlarm ? detail.meta.isShowAlarm : false
          );
        }
        if (detail.type === "pie" || detail.type === "donut") {
          setDecimalPoint(detail.meta.decimalPoint);
          setAggregation(detail.meta.aggregation);
          setShowDate(detail.meta.showLabel);
        }
        
        if (detail.meta.metric) {
          const metric = detail.meta.metric;

          if (isArray(metric)) {
            const mapMetric = (x) => {
              let y = {};
              y["name"] = x && x.split("-")[0];
              y["title"] = x && x.split("-")[1];
              return y;
            };

            const title = metric.map(mapMetric);

            const name = metric.map(mapMetric);
            setMetricTitle(title);
            setMetricName(name);
            // CheckConsumptionForSingleInstrument(title)
          }
        }
      }
      if (detail.type === "Image") {
        setTimeout(() => {
          setImages(detail.meta.src);
        }, [100]);
      }
      if (detail.type === "Text") {
        setFontVariantValue(detail.meta.fontVariant);
        setTextAlignValue(detail.meta.textAlign);
        setTextSizeValue(detail.meta.textSize);
      }

      if (detail.type === "alerts") {
        setAlertName(detail.meta.alertname);
        setAlertID(detail.meta.alertid);
      }

      if (detail.type === "map") {
        setMapInstrumentID(detail.meta.mapInstrument);
      }

      if (
        detail.type === "dialgauge" ||
        detail.type === "dialgauge2" ||
        detail.type === "fillgauge"
      ) {
          setarc1Min(detail.meta.arc1Min);
          setDynamicColor({
          level1_color: detail.meta.
          color1,
          level2_color:detail.meta.
          color2,
          level3_color:detail.meta.
          color3

        })
        setDecimalPoint(detail.meta.decimalPoint);
        setAggregation(detail.meta.aggregation);
        setGroupBy(detail.meta.groupBy);
        setarc1Max(detail.meta.arc1);
        setarc2Max(detail.meta.arc2);
        setarc3Max(detail.meta.arc3);
        setdataType(detail.meta.dataType);
      }
      if (detail.type === "singleText") {
        setarc1Min(detail.meta.arc1Min);
        setDynamicColor({
          level1_color: detail.meta.
          SingleValueColor1,
          level2_color:detail.meta.
          SingleValueColor2,
          level3_color:detail.meta.
          SingleValueColor3

        })
        setDecimalPoint(detail.meta.decimalPoint);
        setAggregation(detail.meta.aggregation);
        setFontVariantValue(detail.meta.fontVariant);
        setTextAlignValue(detail.meta.textAlign);
        setTextSizeValue(detail.meta.textSize);
        setDisplayStyleValue(detail.meta.displayStyle);
        setarc1Max(detail.meta.arc1);
        setarc2Max(detail.meta.arc2);
        setarc3Max(detail.meta.arc3);
      }

      if (detail.type === "clock") {
        setClockMode(detail.meta.clockMode);
        setTimeFormat(detail.meta.timeFormat);
        setTimeZone(detail.meta.timeZone);
        setShowDate(detail.meta.showDate);
        setClockFont(detail.meta.clockFont);
        setdate(detail.meta.date);
        setenddate(detail.meta.date);
      }

      if (detail.type === "energymeter") {
        setDecimalPoint(detail.meta.decimalPoint);
      }

      if (detail.type === "weather") {
        setLocation(detail.meta.location);
        // setWidgetSize(detail.meta.size)
      }

      if (detail.type === "dataoverimage") {
        console.log(detail.meta)
        getFetchDashboardUploadsDocs(detail?.meta?.image?.id)
      }

      if (detail.type === "video") {
        // console.log(detail?.meta)
        setVideoSource(detail.meta.videoSource)
        detail.meta?.videoSource === 'url' 
        ? setVideoSource(detail.meta.videoSource)
        : console.log("HI")
        // : getFetchDashboardUploadsDocs(detail?.meta?.url?.id)
        // setCheck(true)
      }

      if (detail.type === "thermometer") {
        setTempUnit(detail.meta.unit);
      }

      

      

      setTimeout(() => {//NOSONAR
        if (detail.meta.yaxisFromRef && yaxisFromRef.current) {
          yaxisFromRef.current.value = detail.meta.yaxisFromRef;
        }

        if (detail.meta.yaxisToRef && yaxisToRef.current) {
          yaxisToRef.current.value = detail.meta.yaxisToRef;
        }

        if (detail.type !== "Text" && detail.type !== "Image") {
          if (nameRef.current) {
            nameRef.current.value = detail.title ? detail.title : "";
          }
          setEditTitle(detail.title);
        }
        
        if (detail.type === "singleText") {
          text1Ref.current.value = detail.meta.text1 ? detail.meta.text1 : "";
          text2Ref.current.value = detail.meta.text2 ? detail.meta.text2 : "";
          text3Ref.current.value = detail.meta.text3 ? detail.meta.text3 : "";
          Color1.current.value =
            detail.meta.SingleValueColor1 &&
            detail.meta.SingleValueColor1 !== "#000000"
              ? detail.meta.SingleValueColor1
              : "#88B056";
          Color2.current.value =
            detail.meta.SingleValueColor2 &&
            detail.meta.SingleValueColor1 !== "#000000"
              ? detail.meta.SingleValueColor2
              : "#FFD121";
          Color3.current.value =
            detail.meta.SingleValueColor3 &&
            detail.meta.SingleValueColor1 !== "#000000"
              ? detail.meta.SingleValueColor3
              : "#DF3B44";
          Color.current.value = detail.meta.SingleValueColor
            ? detail.meta.SingleValueColor
            : "#000000";
        }
        if (detail.type === "Text") {
          textContent.current.value = detail.meta.text;
          Color.current.value = detail.meta.Textcolor;
          BackgroundColor.current.value = detail.meta.BackgroundColor;
        }

        if (detail.type === "Status") {
          setOptionType(detail.meta.statusType);
          if (detail.meta.statusType === "multiLevel") {
            setMultiStatus(
              detail.meta.multiLevelValue.map((x) => ({
                multiPossitiveText: x.multiPositiveText,
                multiPossitiveValue: x.multiPositiveValue,
                multiPossitiveColor: x.multiPositiveColor,
              }))
            );
          }
          if (detail.meta.statusType === "binary") {
            positiveColor.current.value = detail.meta.positiveColor;
            positiveValue.current.value = detail.meta.positiveValue;
            positiveText.current.value = detail.meta.positiveText;
            negativeColor.current.value = detail.meta.negativeColor;
            negativeValue.current.value = detail.meta.negativeValue;
            negativeText.current.value = detail.meta.negativeText;
          }
        }
        if (
          detail.type === "dialgauge" ||
          detail.type === "dialgauge2" ||
          detail.type === "fillgauge"
        ) {
     setarc1Min(detail.meta.arc1Min);
          setArcColor({
            Arc1color:
              detail.meta.color1 && detail.meta.color1 !== "#000000"
                ? detail.meta.color1
                : "#88B056",
            Arc2color:
              detail.meta.color2 && detail.meta.color2 !== "#000000"
                ? detail.meta.color2
                : "#FFD121",
            Arc3color:
              detail.meta.color3 && detail.meta.color3 !== "#000000"
                ? detail.meta.color3
                : "#DF3B44",
          });
        }
        if (detail.type === "thermometer") {
          maxTemp.current.value = detail.meta.maxTemp;
          setTempUnit(detail.meta.unit);
        }
        if(detail.type === "video"){
         
          url.current.value = detail?.meta?.url
        }
        
        if(detail.type === "combobar"){
          setInstrument1(detail.meta.instrument1)
          setInstrument2(detail.meta.instrument2)
          setChart2(detail.meta.chart2)
          setChart1(detail.meta.chart1)
          setDecimalPoint(detail.meta.decimalPoint);
          setAggregation(detail.meta.aggregation);
          setMetric1(detail.meta.metric1)
          setMetric2(detail.meta.metric2)
          setGroupBy(detail.meta.groupBy);
          setIsBarVsLine(detail.meta.isBarVsLine)
          //if(detail.meta.metricField.length)
          setDataStats(detail.meta.isDataStats ? detail.meta.isDataStats : false);
          setTooltipSort(detail.meta.tooltipSort);
          setIsLabel(detail.meta.isLabel ? detail.meta.isLabel : false);
        }

        if(detail.type === 'correlogram') {
          nameRef.current.value = detail.title ? detail.title : "";
          setCorrColour(detail.meta.colour)
        }

        if(detail.type === "pareto"){
          setIsDowntime(detail.meta.isDowntime)
          // setAssetOption
          setAsset(detail.meta.asset)
        }
        
      }, 1000);
    
    } else {
      setIsEdit(false);
    }
  };

  const handleDialogHieClose = () => {
    props.handleDialogHieClose();//NOSONAR
    setDashEdit(true);
  };
  const handleInstrumentSwitch = (e) => {
    setMetricFields([
      {
        field: 1,
        instrument_id: "",
        instrument_name: "",
        metric_name: [],
        metric_title: [],
        metOpt: [],
        TableCellColor: "#ffffff",
      },
    ]);
    setIsInstrument(!isInstrument);
    setIsShowAlarm(false);
    setVirtualInstrumentID("");
    if (chartType === "bar" || chartType === "area") {
      setInstrumentID("");
      setMetricName([]);
      setMetricTitle([]);
    }
  };
  const handleInstrumentSelect = (e, option) => {
    setInstrumentID(e.target.value);
    instrumentMetricList(
      [{ metOpt: [], field: 1, instrument_id: e.target.value }],
      chartType
    );
    setMetricTitle([]);
  };

  const handleMetricSelect = (e, option, multi) => {//NOSONAR
    // console.clear()
    // console.log(e)
    // console.log(option.filter(f => f.title === e.target.value)?.[0]?.metric?.metricUnitByMetricUnit?.unit)

    if (multi) {
      if (e.length > 1) {
        setDataStats(false);
        setIsShowAlarm(false);
        setAggregation("none");
        setGroupBy("none");
        if (tooltipDisable) {
          setTooltipDisable(false);
        }
      } else {
        setTooltipDisable(true);
      }
      if (chartType === "energymeter") {
        if (e.length > 5) {
          setError(true);
        } else {
          setError(false);
        }
      } else {
        if (e.length > 10) {
          setError(true);
        } else {
          setError(false);
        }
      }
      setMetricName(e);
      setMetricTitle(e);
      // CheckConsumptionForSingleInstrument(e)
    } else {
      let existUnit = option.filter((f) => f.title === e.target.value)?.[0]
        ?.metric?.metricUnitByMetricUnit?.unit;
      let unit =
        existUnit === "°C"
          ? "celcius"
          : existUnit === "°F"//NOSONAR
          ? "farenheit"//NOSONAR
          : "kelvin";//NOSONAR
      setExistingTempUnit(unit);
      setMetricName(option.filter((f) => f.title === e.target.value));
      setMetricTitle(option.filter((f) => f.title === e.target.value));
      setdataType(
        e.target.value
          ? option.filter((f) => f.title === e.target.value)[0].metric
              .metricDatatypeByMetricDatatype.type
          : ""
      );
    }
  };


  const handleVirtualInstrumentTable = (e, row, field) => {

    let setelement = [...MetricFields];
  
    let Exist = e
      ? setelement.filter(
          (x) => x.virtualInstrument_id === e.target.value && x.field !== field
        )
      : [];

    if (Exist.length > 0) {
      const instrumentName = row.filter((x) => x.id === e.target.value)[0].name;
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj["virtualInstrument_id"] = "";
      setelement[fieldIndex] = fieldObj;
      setMetricFields(setelement);
      instrumentMetricList(setelement, chartType);
      SetMessage(instrumentName + " Virtual Instrument already exists");
      SetType("warning");
      setOpenSnack(true);
    } else {
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj["virtualInstrument_id"] = e.target.value;
      const selectedInst = props.virtualInstrumentListData.filter(
        (x) => x.id === e.target.value
      );
      fieldObj["virtual_formula"] = selectedInst[0].formula;
      fieldObj["formula_name"] = selectedInst[0].name;
      setelement[fieldIndex] = fieldObj;
      setVirtualInstrumentID(e.target.value);
      setMetricFields(setelement);
    }
  };

  const handleVirtualInstrument = (e) => {
    setMetricTitle([]);
    if (isdataStats) {
      setDataStats(false);
    }
    const selectedInst = props.virtualInstrumentListData.filter(
      (x) => x.id === e.target.value
    );
    if (selectedInst && selectedInst[0] && selectedInst[0].formula) {
      setVirtualFormula(selectedInst[0].formula);
      setFormulaName(selectedInst[0].name);
    } else {
      setVirtualFormula("");
      setFormulaName("");
    }
    setVirtualInstrumentID(e.target.value);
  };
  const handleMultiInstrumentChange = (e, row, field) => {
    setYetToSelectMetric(true)
    let setelement = [...MetricFields];
    let Exist = e
      ? setelement.filter(
          (x) => x.instrument_id === e.target.value && x.field !== field
        )
      : [];
    if (Exist.length > 0) {
      const instrumentName = row.filter((x) => x.id === e.target.value)[0].name;
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj["instrument_id"] = "";
      fieldObj["instrument_name"] = "";
      setelement[fieldIndex] = fieldObj;
      setMetricFields(setelement);
      instrumentMetricList(setelement, chartType);
      SetMessage(instrumentName + t(" Intrument Already selected"));
      SetType("warning");
      setOpenSnack(true);
    } else {
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj["instrument_id"] = e ? e.target.value : "";
      fieldObj["instrument_name"] = e
        ? row.filter((x) => x.id === e.target.value)[0].name
        : "";
      fieldObj["metric_name"] = "";
      fieldObj["metric_title"] = "";
      setelement[fieldIndex] = fieldObj;
      setMetricFields(setelement);
      instrumentMetricList(setelement, chartType);
    }
  };

  const handleMultiMetricChange = (e, row, field,istable) => {
     console.log(e,"metric e",row,istable)
     let selectedData

      if(istable){
        // selectedData = row.filter((x) => x.name === e.target.value)
        selectedData = row.filter((x) => x.title === e.target.value)
      }else{
        selectedData = e
      }

      selectedData.length > 0 ? setYetToSelectMetric(false) : setYetToSelectMetric(true)
    if (selectedData.length > 1 && chartType !== "Table") {
      setInstDisable(true);
      setIsShowAlarm(false);
      setDataStats(false);
      setIsShowAlarm(false);
      // if(MetricFields && Metric)
      setAggregation("none");
      setGroupBy("none");
      if (tooltipDisable) {
        setTooltipDisable(false);
      }
    } else {
      setInstDisable(false);
      setTooltipDisable(true);
    }

    setMetricTitle(selectedData);
    let setelement = [...MetricFields];
    const fieldIndex = setelement.findIndex((x) => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj["metric_name"] = selectedData;
    if (chartType !== "Table") {
      if (selectedData.length > 10) {
        fieldObj["error"] = "You can select up to 10 metrics only";
      } else {
        if (fieldObj["error"]) {
          delete fieldObj.error;
        }
      }
    } else {
      if (selectedData.length > 1) {
        fieldObj["error"] = "You can select up to 1 metric only";
      } else {
        if (fieldObj["error"]) {
          delete fieldObj.error;
        }
      }
    }

    fieldObj["metric_title"] = selectedData;
    setelement[fieldIndex] = fieldObj;
    console.log("IMAGAGA__", selectedData, setelement , fieldObj)
    setMetricFields(setelement);
    // CheckConsumptionForMultiInstrument(setelement)

    if (setelement.length > 1) {
      setMultiMetric(true);
    } else if (setelement.length === 1) {
      if (setelement[0].metric_name.length > 1) setMultiMetric(true);
      else setMultiMetric(false);
    } else {
      setMultiMetric(false);
    }
  };

  // FOR MULTI METRIC INSTRUMENT SELECTION IN TABLE WIDGET

  const handleMultiMetricInstrumentChange = (e, row, field) => {
    setYetToSelectMetric(true)
    let setelement = [...MetricFields];
    let Exist = e
      ? setelement.filter(
          (x) => x.instrument_id === e.target.value && x.field !== field
        )
      : [];
    if (Exist.length > 0) {
      const instrumentName = row.filter((x) => x.id === e.target.value)[0].name;
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj["instrument_id"] = "";
      fieldObj["instrument_name"] = "";
      setelement[fieldIndex] = fieldObj;
      setMetricFields(setelement);
      instrumentMetricList(setelement, chartType);
      SetMessage(instrumentName + t(" Intrument Already selected"));
      SetType("warning");
      setOpenSnack(true);
    } else {
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      fieldObj["instrument_id"] = e ? e.target.value : "";
      fieldObj["instrument_name"] = e
        ? row.filter((x) => x.id === e.target.value)[0].name
        : "";
      fieldObj["metric_name"] = "";
      fieldObj["metric_title"] = "";
      setelement[fieldIndex] = fieldObj;
      setMetricFields(setelement);
      instrumentMetricList(setelement, chartType);
    }
  };

  const handleMultipleMetricChange = (e, row, field,istable) => {

    if(e.length > 0){
      let selectedData = e
      selectedData.length > 0 ? setYetToSelectMetric(false) : setYetToSelectMetric(true)
      setMetricTitle(selectedData);
      console.clear()
      let setelement = [...MetricFields];
      console.log("MetricFields", MetricFields)
      console.log("selectedData", selectedData)
      const fieldIndex = setelement.findIndex((x) => x.field === field);
      let fieldObj = { ...setelement[fieldIndex] };
      console.log("fieldObj", fieldObj)
      fieldObj["metric_name"] = selectedData;
      fieldObj["metric_title"] = selectedData;
      setelement[fieldIndex] = fieldObj;
      console.log(setelement)
      setMetricFields(setelement);
      setAggregation("sum");
      // CheckConsumptionForMultiInstrument(setelement)
        
      if (setelement.length > 1) {
        setMultiMetric(true);
      } else if (setelement.length === 1) {
        if (setelement[0].metric_name.length > 1) setMultiMetric(true);
        else setMultiMetric(false);
      } else {
        setMultiMetric(false);
      }
    } else {
      setYetToSelectMetric(true)
    }
 };
  // _____________________________________________________



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  function optionChange(e, data) {

    if (e === "instrument") {
      let setelement = [...MetricFields];
      const lastfield =
        setelement.length > 0
          ? Number(setelement[setelement.length - 1].field) + 1
          : 1;
      setelement.push({
        field: lastfield,
        instrument_id: "",
        instrument_name: "",
        metric_name: [],
        metric_title: [],
        metOpt: [],
        TableCellColor: "#ffffff",
      });
      // console.log(setelement,"setelementsetelement")
      setMetricFields(setelement);
    } else if (e === "virtualInstrument") {
      let setelement = [...MetricFields];
      const lastfield =
        setelement.length > 0
          ? Number(setelement[setelement.length - 1].field) + 1
          : 1;
      setelement.push({
        field: lastfield,
        virtualInstrument_id: "",
        formula_name: "",
        virtual_formula: "",
        TableCellColor: "#ffffff",
      });
      // console.log(setelement,"setelementsetelement")
      setMetricFields(setelement);
    }
    setAnchorEl(null);
    setOpen(false);
  }
  const addRow = () => {
    //setInstDisable(true)
    let setelement = [...MetricFields];
    if (setelement.length > 0) {
      if (chartType !== "Table") {
        setDataStats(false);
        setIsShowAlarm(false);
        setAggregation("none");
        setGroupBy("none");
      }

      setIsShowAlarm(false);
    }
    const lastfield =
      setelement.length > 0
        ? Number(setelement[setelement.length - 1].field) + 1
        : 1;
    setelement.push({
      field: lastfield,
      instrument_id: "",
      instrument_name: "",
      metric_name: [],
      metric_title: [],
      metOpt: [],
      TableCellColor: "#ffffff",
    });
    // console.log(setelement,"setelementsetelement")
    setMetricFields(setelement);
  };
  const removeRow = (val) => {
    let setelement = [...MetricFields];

    let removed = setelement.filter((x) => x.field !== val);

    setMetricFields(removed);
    //CheckConsumptionForMultiInstrument(removed)
  };
  const handleArc1Max = (e) => {
    if (e.target.value !== "") {
      setarc1Max(Number(e.target.value));
    } else {
      setarc1Max(e.target.value);
    }
  };

  const handleDynamicColorChange = (key, value) => {
    setDynamicColor(prev => ({ ...prev, [key]: value }));
  };

  const handleArc1Min=(e)=>{
    if (e.target.value !== "") {
      setarc1Min(Number(e.target.value));
    } else {
      setarc1Min(e.target.value);
    } 
  }
  const handleArc1MaxBlur = () => {
    if (
      chartType === "dialgauge" &&
      Number(arc1Max) >= Number(arc3MaxLimit.current.value)
    ) {
      setarc1Max(Number(arc3MaxLimit.current.value) - 1);
      setarc2Max(arc3MaxLimit.current.value - 1);
    } else if (
      (chartType === "dialgauge2" && Number(arc1Max) === 0) ||
      (chartType === "singleText" && Number(arc1Max) === 0)
    ) {
      setarc1Max(1);
    } else {
      if (Number(arc1Max) >= Number(arc2Max)) {
        setarc2Max(Number(arc1Max) + 1);
      }
    }
  };
  const handleArc2Max = (e) => {
    if (e.target.value !== "") {
      setarc2Max(Number(e.target.value));
    } else {
      setarc2Max(e.target.value);
    }
  };
  const handleArc2MaxBlur = () => {
    if (Number(arc1Max) >= Number(arc2Max)) {
      setarc2Max(Number(arc1Max) + 1);
    }
    if (
      chartType === "dialgauge" &&
      Number(arc2Max) >= Number(arc3MaxLimit.current.value)
    ) {
      setarc2Max(Number(arc3MaxLimit.current.value) - 1);
    } else {
      if (Number(arc2Max) >= Number(arc3Max)) {
        setarc3Max(Number(arc2Max) + 1);
      }
    }
  };
  const handleArc3Max = (e) => {
    if (e.target.value !== "") {
      setarc3Max(Number(e.target.value));
    } else {
      setarc3Max(e.target.value);
    }
  };
  const handleArc3MaxBlur = () => {
    if (Number(arc2Max) > Number(arc3Max)) {
      setarc3Max(Number(arc2Max) + 1);
    }
  };

  const handleImageField = (e) => {
    const files = Array.from(e.target.files);
    const supportedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/png",
    ];
    let newTotalSize = totalSize;
    let newImages = [...images];

    for (let file of files) {
      if ((e.target.files.length + newImages.length) > 5) {
        SetMessage("You can select a maximum of 5 images.");
        SetType("warning");
        setOpenSnack(true);
        break;
      }

      if (!supportedFormats.includes(file.type)) {
        SetMessage("Unsupported file format.");
        SetType("warning");
        setOpenSnack(true);
        break;
      }

      if (newTotalSize + file.size > 25 * 1024 * 1024) {
        // 25MB in bytes
        SetMessage("Total Image Size should not exceed 25MB.");
        SetType("warning");
        setOpenSnack(true);
        break;
      }

      newTotalSize += file.size;

      const reader = new FileReader();
      // eslint-disable-next-line no-loop-func
      reader.onload = (x) => {
        newImages.push({ src: x.target.result, size: file.size });
        setImages(newImages);
        setTotalSize(newTotalSize);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAlertSelect = (e, option) => {
    if (option.length > 0) {
      const id = option.map((x) => x.id);
      setAlertName(e);
      setAlertID(id);
    } else {
      setAlertName([]);
      setAlertID([]);
    }
  };
  const handleMapInstrumentSelect = (e, option) => {
    setMapInstrumentID(e);
  };
  const duplicateTitle =
    selectedDashboardSkeleton &&
    selectedDashboardSkeleton.dashboard &&
    selectedDashboardSkeleton.dashboard.data;
  const mapData =
    duplicateTitle &&
    Object.keys(duplicateTitle).map((key) => {
      const DataItem = duplicateTitle[key];

      return DataItem.title;
    });

  const getDefaultPosition = (arr) => {
    let temp = {};
    arr.map((x, i) => {
      temp[i] = { 
        x: i<=3 ? 0 : i> 3 && i<=7 ? 100 : 200,//NOSONAR
        y: i<=3 ? 0 : i> 3 && i<=7 ? -240 : -480//NOSONAR
      }
    });
    return temp;
  };
  const saveChanges = (refresh) => {//NOSONAR
   
    let metric_field = [{}];
    let metricList = [];
    let cardObj = {};
    let selectedDashboard = JSON.parse(
      JSON.stringify(selectedDashboardSkeleton)
    );
    let filterCurrentTitle = mapData?.filter((x) => x !== EditTitle);
    // console.clear()
    // console.log(MetricFields, MetricFields?.filter((z) => (z.instrument_id !== '' && z.instrument_id !== null && z.instrument_id !== undefined)).map((x) => x.instrument_id))

    if(chartType !== 'Image' && chartType !== 'Text' && chartType !== 'clock'  && chartType !== 'video' && chartType !== 'weather' && chartType !== 'alerts' && isInstrument && MetricFields?.filter((z) => (z.instrument_id !== '' && z.instrument_id !== null && z.instrument_id !== undefined)).map((x) => x.instrument_id).length === 0){
      SetMessage("Please select an Instrument");
      SetType("warning");
      setOpenSnack(true);
      return false;
    }
    
    if(chartType !== 'dialgauge' && yetToSelectMetric){
        SetMessage("Please select a metric");
        SetType("warning");
        setOpenSnack(true);
        return false;
    }
    if (!chartType && !isEdit) {
      SetMessage(t("Select Chart Type"));
      SetType("warning");
      setOpenSnack(true);
      return false;
    }

    if(chartType === "singleText"){
      const min1 = Number(arc1Min);
      const max1 = Number(arc1Max);
      const max2 = Number(arc2Max);
      const max3=Number(arc3Max); 

      if (!min1 ||min1===0  && !max2 ||max2===0) {
        SetMessage("Please select value, It cannot be Empty or Zero");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if (max1 <= min1) {
        SetMessage("Maximum value  must be bigger than minimum.");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

      if (max2 <= max1) {
        SetMessage("Level 2 Minimum ≤ Level 1 Maximum");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
  if(max3 <=max2){
    SetMessage("Level 3 Minimum ≤ Level 2 Maximum");
    SetType("warning");
    setOpenSnack(true);
    return false;
  }

    }
 
 if(chartType === 'dialgauge' || chartType === 'dialgauge2' || chartType === 'fillgauge'){
      const min1 = Number(arc1Min);
      const max1 = Number(arc1Max);
      const max2 = Number(arc2Max);
      const max3=Number(arc3Max); 

      if (!min1 ||min1===0  && !max2 ||max2===0) {
        SetMessage("Please select value, It cannot be Empty or Zero");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if (max1 <= min1) {
        SetMessage("Maximum value  must be bigger than minimum.");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

      if (max2 <= max1) {
        SetMessage("Level 2 Minimum ≤ Level 1 Maximum");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
  if(max3 <=max2){
    SetMessage("Level 3 Minimum ≤ Level 2 Maximum");
    SetType("warning");
    setOpenSnack(true);
    return false;
  }

    }

      if(fromDate>= toDate){
        SetMessage("From date must be less than To date.");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    if (chartType === "thermometer") {
      if (maxTemp?.current?.value === "") {
        SetMessage("Enter Max Temperature");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    }
    if(chartType === 'video')
    {
      if(fileSizeError){
        SetMessage("File Should be 10MB or less");
        SetType("warning");
        setOpenSnack(true);
        return false;
      } else if (videoSource === 'url' && url?.current?.value.length === 0) {
        SetMessage("Video Source URL is needed");
        SetType("warning");
        setOpenSnack(true);
        return false;
      } else if (videoSource === 'file'){
        if(file === null ){
          SetMessage("Please select a video");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        if((file?.type && file?.type.split('/')[0] !== 'video') || (file[0].type && file[0].type.split('/')[0] !== 'video')){
          SetMessage("Only Video is allowed to upload");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        
      }
    }
    if(chartType === 'dataoverimage') {
      if(fileSizeError){
        SetMessage("File Should be 10MB or less");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if(file === null){
        SetMessage("Please select an image");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if((file?.type && file?.type?.split('/')[0] !== 'image') || (file[0]?.type && file?.[0].type.split('/')[0] !== 'image')){
        SetMessage("Only Image is allowed to upload");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      
    }
    if (chartType !== "Text" && chartType !== "Image") {
      if (!nameRef.current.value || nameRef.current.value?.trim().length === 0 || nameRef.current.value === '') {
        SetMessage(t("Please Enter title"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if(chartType !== 'Image' && chartType !== 'video' && chartType !== 'weather' && nameRef.current.value !== '' && nameRef.current.value[0] === ' '){
        SetMessage('Space not allowed as a 1st Character in Title');
        SetType("warning");
        setOpenSnack(true);
        return false;
    }
      if (filterCurrentTitle?.includes(nameRef.current.value)) {
        SetMessage(t("Title entered is already used"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    }
    if (chartType === "alerts") {
      if (alertName.length < 1) {
        SetMessage("Select Alarm Rules");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    }
    if (
      chartType === "line" ||
      chartType === "correlogram" ||
      chartType === "stackedbar"
    ) {
      if (customYaxis) {
  
        if (
          yaxisFromRef.current.value === "" ||
          yaxisToRef.current.value === ""
        ) {
          SetMessage("Enter Custom Y axis values");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
      }
      if (isInstrument) {
        let emptyspace = MetricFields.filter(
          (field) => field.instrument_id.trim() === ""
        );
        if (
          (isInstrument &&
            (!MetricFields[0].instrument_id ||
              MetricFields[0].metric_name.length === 0)) ||
          emptyspace.length !== 0
        ) {
          SetMessage(t("Select Intrument and metric"));
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        const hasError = MetricFields.some((field) =>
          field.hasOwnProperty("error")
        );

        if (hasError) {
          SetMessage("Select Metrics only upto 10");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        console.clear()
        console.log(MetricFields)
        MetricFields.forEach((x, indi) => {
          let existObj = { ...metric_field[0] };
          const no = indi + 1;
          let fieldObj = {};
          let valueObj = {};
          if (x.instrument_id) {
            valueObj["instrument"] = x.instrument_id;

            
            console.log(x.metric_name)
              const metrics = x.metric_name.map((y, ind) => {
                const metricname = y.name;
                const metrictitle = x.metric_title[ind].title;
                return metricname + "-" + metrictitle;
              });
              valueObj["metric"] = metrics;
              fieldObj["field" + no] = valueObj;
              metric_field[0] = { ...existObj, ...fieldObj };
        
          }
        });
      }

      if (
        !isInstrument &&
        (virtualInstrumentID === "" || virtualInstrumentID.length === 0)
      ) {
        // if virtual intrument not getting selected error message will pop up
        SetMessage(t("Please select Virtual instrument details"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    }
    if(chartType === "groupedbar") {
      if (customYaxis) { 
        if (
          yaxisFromRef.current.value === "" ||
          yaxisToRef.current.value === ""
        ) {
          SetMessage("Enter Custom Y axis values");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
      }
      if (isInstrument) {
        let emptyspace = MetricFields.filter(
          (field) => field.instrument_id.trim() === ""
        );
        if (
          (isInstrument &&
            (!MetricFields[0].instrument_id ||
              MetricFields[0].metric_name.length === 0)) ||
          emptyspace.length !== 0
        ) {
          SetMessage(t("Select Intrument and metric"));
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        const hasError = MetricFields.some((field) =>
          field.hasOwnProperty("error")
        );

        if (hasError) {
          SetMessage("Select Metrics only upto 10");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        MetricFields.forEach((x, indi) => {
          let existObj = { ...metric_field[0] };
          const no = indi + 1;
          let fieldObj = {};
          let valueObj = {};
          if (x.instrument_id) {
            valueObj["instrument"] = x.instrument_id;
            const metrics = x.metric_name.map((y, ind) => {
              const metricname = y.name;
              const metrictitle = x.metric_title[ind].title;
              return metricname + "-" + metrictitle;
            });
            valueObj["metric"] = metrics;
            fieldObj["field" + no] = valueObj;
            metric_field[0] = { ...existObj, ...fieldObj };
          }
        });
      }

      if (
        !isInstrument &&
        (multipleVirtualInstrument.length === 0)
      ) {
        // if virtual intrument not getting selected error message will pop up
        SetMessage(t("Please select Virtual instrument details"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    }
    
    if(chartType === "combobar"){
      if(instrument1 === null){
        SetMessage("Please select Primary Y axis Instrument");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      
      if(metric1 === null){
        SetMessage("Please select Primary Y axis Metric");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      
      if(chart1 === null) {
        SetMessage("Please select Primary Y axis Chart Type");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if(instrument2 === null) {
        SetMessage("Please select Secondary Y axis Instrument");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if(metric2 === null){
        SetMessage("Please select Secondary Y axis Metric");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if(chart2 === null) {
        SetMessage("Please select Secondary Y axis Chart Type");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

    }

    if(chartType === "pareto"){
      if(asset === null){
        SetMessage("Asset is mandatory");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
 
    }

    if(chartType === "pie" || chartType === "donut") {
        if (customYaxis) {
          console.log("hello", yaxisFromRef.current);
          if (
            yaxisFromRef.current.value === "" ||
            yaxisToRef.current.value === ""
          ) {
            SetMessage("Enter Custom Y axis values");
            SetType("warning");
            setOpenSnack(true);
            return false;
          }
        }
        if (isInstrument) {
          let emptyspace = MetricFields.filter(
            (field) => field.instrument_id.trim() === ""
          );
          if (
            (isInstrument &&
              (!MetricFields[0].instrument_id ||
                MetricFields[0].metric_name.length === 0)) ||
            emptyspace.length !== 0
          ) {
            SetMessage(t("Select Intrument and metric"));
            SetType("warning");
            setOpenSnack(true);
            return false;
          }
          const hasError = MetricFields.some((field) =>
            field.hasOwnProperty("error")
          );
  
          if (hasError) {
            SetMessage("Select Metrics only upto 10");
            SetType("warning");
            setOpenSnack(true);
            return false;
          }
          MetricFields.forEach((x, indi) => {
            let existObj = { ...metric_field[0] };
            const no = indi + 1;
            let fieldObj = {};
            let valueObj = {};
            if (x.instrument_id) {
              valueObj["instrument"] = x.instrument_id;
              const metrics = x.metric_name.map((y, ind) => {
                const metricname = y.name;
                const metrictitle = x.metric_title[ind].title;
                return metricname + "-" + metrictitle;
              });
              valueObj["metric"] = metrics;
              fieldObj["field" + no] = valueObj;
              metric_field[0] = { ...existObj, ...fieldObj };
            }
          });
        }

        console.clear()
        console.log(isInstrument, multipleVirtualInstrument)
  
        if (
          !isInstrument &&
          (multipleVirtualInstrument.length === 0)
        ) {
          // if virtual intrument not getting selected error message will pop up
          SetMessage(t("Please select Virtual instrument details"));
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
        if (aggregation === "none") {
          SetMessage("Aggregation is Mandatory");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
    } else if (chartType === "Table") {
      let noInstrument = MetricFields.filter(
        (field) =>
          field.hasOwnProperty("instrument_id") && field.instrument_id === ""
      );
      let nometric = MetricFields.filter(
        (field) =>
          field.hasOwnProperty("metric_name") && field.metric_name.length === 0
      );
      let noVirtual = MetricFields.filter(
        (field) =>
          field.hasOwnProperty("virtualInstrument_id") &&
          field.virtualInstrument_id === ""
      ); 
      if (noInstrument.length !== 0 || nometric.length !== 0) {
        SetMessage(t("Select Intrument and metric"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if (noVirtual.length !== 0) {
        SetMessage(t("Please select Virtual instrument details"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

      if (aggregation === "none") {
        SetMessage("Select Aggregation");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      const hasError = MetricFields.some((field) =>
        field.hasOwnProperty("error")
      );

      if (hasError) {
        SetMessage("Select Metrics only 1 for each Instrument");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      
      MetricFields.forEach((x, indi) => {
        let existObj;
        let fieldObj = {};
        let valueObj = {};
        let no;
        if (x.instrument_id) {
          existObj = { ...metric_field[0] };
          no = indi + 1;
          valueObj["instrument"] = x.instrument_id;
          valueObj["TableCellColor"] = x.TableCellColor;
          const metrics = x.metric_name.map((y, ind) => {
            const metricname = y.name;
            const metrictitle = x.metric_title[ind].title;
            return metricname + "-" + metrictitle;
          });
          valueObj["metric"] = metrics;
        } else if (x.virtualInstrument_id) {
          existObj = { ...metric_field[0] };
          no = indi + 1;
          valueObj["virtualInstrument"] = x.virtualInstrument_id;
          valueObj["TableCellColor"] = x.TableCellColor;
          const name = x.formula_name;
          valueObj["name"] = name;
        }

        fieldObj["field" + no] = valueObj;
        metric_field[0] = { ...existObj, ...fieldObj };
     
      });


    } else {
      const hasError = MetricFields.some((field) =>
        field.hasOwnProperty("error")
      );

      if (hasError) {
        SetMessage("Select Metrics only upto 10");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if (Error) {
        SetMessage(chartType === 'energymeter' ? "Select Metrics only upto 5" : "Select Metrics only upto 10");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }


      // metricList = metricName
      //   .map((x, ind) => {
      //     if (x.name && metricTitle[ind] && metricTitle[ind].title) {
            
      //       return (chartType !== "energymeter" || chartType !== 'dataoverimage')
      //         ? x.name + "-" + metricTitle[ind].title
      //         : x.name +
      //             "-" +
      //             metricTitle[ind].title +
      //             "-" +
      //             instrumentMetricListData[0].metOpt?.filter(
      //               (z) => z.name === x.name
      //             )[0]?.metric?.metricUnitByMetricUnit?.unit;
      //     }
      //     return null;
      //   })
      //   .filter((e) => e);
      metricList = metricName.map((x, ind) => {
        if (x.name && metricTitle[ind] && metricTitle[ind].title) {
            // console.log(chartType, instrumentMetricListData[0].metOpt?.filter((z) => z.name === x.name)[0]?.metric?.metricUnitByMetricUnit?.unit)
            if(chartType === 'energymeter' || chartType === 'dataoverimage'){
              // console.log("HJSJAHJA")
              return x.name + '-' + metricTitle[ind].title + '-' + instrumentMetricListData[0].metOpt?.filter((z) => z.name === x.name)[0]?.metric?.metricUnitByMetricUnit?.unit 
            } else {
              // console.log("XSXS")
              return x.name + '-' + metricTitle[ind].title
            }
        }
        return null;
    }).filter(e => e);
    console.log(" metricList +++++++++++++++++++",metricList)

   
    }

    if (chartType === "line" || chartType === "stackedbar" ) {
      if (customYaxis) {
        if (
          yaxisFromRef.current.value === "" ||
          yaxisToRef.current.value === ""
        ) {
          SetMessage("Enter Custom Y axis values");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
      }
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          unit: "",
          metricField: metric_field,
          isCustomYaxis: customYaxis,
          yaxisFromRef: yaxisFromRef.current
            ? yaxisFromRef.current.value
            : null,
          yaxisToRef: yaxisToRef.current ? yaxisToRef.current.value : null,
          //isDecimal: isDecimal,
          isDataStats: isdataStats,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          tooltipSort: tooltipSort,
          isLabel: isLabel,
          isShowAlarm: isShowAlarm,
          isOnline: isInstrument,
          alarmLevel: alarmLevels,
          tableName: headPlant.schema + "_data",
          isConsumption: isConsumption ? true : false,//NOSONAR
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange

        },
      };
    }

    if(chartType === "groupedbar") {
      if (customYaxis) {
        if (
          yaxisFromRef.current.value === "" ||
          yaxisToRef.current.value === ""
        ) {
          SetMessage("Enter Custom Y axis values");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
      }
      if(isInstrument){
        cardObj = {
          title: nameRef.current.value?.trim(),
          type: chartType,
          meta: {
            unit: "",
            metricField: metric_field,
            isCustomYaxis: customYaxis,
            yaxisFromRef: yaxisFromRef.current
              ? yaxisFromRef.current.value
              : null,
            yaxisToRef: yaxisToRef.current ? yaxisToRef.current.value : null,
            //isDecimal: isDecimal,
            isDataStats: isdataStats,
            decimalPoint: decimalPoint,
            aggregation: aggregation,
            groupBy: groupBy,
            tooltipSort: tooltipSort,
            isLabel: isLabel,
            isShowAlarm: isShowAlarm,
            isOnline: isInstrument,
            alarmLevel: alarmLevels,
            tableName: headPlant.schema + "_data",
            isConsumption: isConsumption ? true : false,//NOSONAR
            fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
            toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
          },
        };
      }
      else {
        cardObj = {
          type: chartType,
          title: nameRef.current.value?.trim(),
          meta: {
            tableName: headPlant.schema + "_data",
            label: "timerange",
            isMoment: true,
            labelFormat: "HH:mm",
            dataName: "value",
            isOnline: isInstrument,
            dataTitle: "",
            metricField: metric_field,
            unit: "",
            isDataStats: isdataStats,
            decimalPoint: decimalPoint,
            aggregation: aggregation,
            groupBy: groupBy,
            tooltipSort: tooltipSort,
            isLabel: isLabel,
            isShowAlarm: isShowAlarm,
            isConsumption: isConsumption ? true : false,//NOSONAR
            formula: virtualFormula,
            virturalInstrument: multipleVirtualInstrument,
            formulaName: formulaName,
            variables: multipleVirtualInstrument,
            fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
            toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
          },
        };
      }
    }

    if(chartType === 'correlogram'){
   
        if(corrColour === '') {
          SetMessage("Please select a display color");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
     
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          tableName: headPlant.schema + "_data",
          label: "timerange",
          isMoment: true,
          labelFormat: "HH:mm",
          dataName: "value",
          isOnline: isInstrument,
          dataTitle: "",
          yaxisFromRef: yaxisFromRef.current
            ? yaxisFromRef.current.value
            : null,
          yaxisToRef: yaxisToRef.current
            ? yaxisToRef.current.value
            : null,
          isCustomYaxis: customYaxis,
          metricField: metric_field,
          metric: metric_field,
          unit: "",
          isDataStats: isdataStats,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          tooltipSort: tooltipSort,
          isLabel: isLabel,
          isShowAlarm: isShowAlarm,
          isConsumption: isConsumption ? true : false,//NOSONAR
          alarmLevel: alarmLevels,
          colour: corrColour,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }

    if(chartType === 'combobar'){
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          tableName: headPlant.schema + "_data",
          label: "timerange",
          isMoment: true,
          labelFormat: "HH:mm",
          dataName: "value",
          isOnline: isInstrument,
          dataTitle: "",
          isBarVsLine: isBarVsLine,
          yaxisFromRef: yaxisFromRef.current
            ? yaxisFromRef.current.value
            : null,
          yaxisToRef: yaxisToRef.current
            ? yaxisToRef.current.value
            : null,
          isCustomYaxis: customYaxis,
          metricField: [{
            "field1": {
                "instrument": instrument1,
                "metric": [
                  `${instrumentMetricListData[0].metOpt.filter((x) => x.title === metric1)?.[0]?.name}-${metric1}`
                ]
            },
            "field2": {
                "instrument": instrument2,
                "metric": [
                    `${instrumentMetricListData[0].metOpt.filter((x) => x.title === metric2)?.[0]?.name}-${metric2}`
                ]
            }
          }],
          instrument1: instrument1,
          instrument2: instrument2,
          metric1: metric1,
          metric2: metric2,
          chart1: chart1,
          chart2: chart2,
          graph: {
            primary_y: {
              chart: chart1,
              metric: metric1,
              instrument: instrument1
            },
            secondary_y: {
              chart: chart2,
              metric: metric2,
              instrument: instrument2 
            }
          },
          unit: "",
          isDataStats: isdataStats,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          tooltipSort: tooltipSort,
          isLabel: isLabel,
          isShowAlarm: isShowAlarm,
          isConsumption: isConsumption ? true : false,//NOSONAR
          alarmLevel: alarmLevels,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }

    if(chartType === "pareto"){
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          tableName: headPlant.schema + "_data",
          label: "timerange",
          isMoment: true,
          labelFormat: "HH:mm",
          dataName: "value",
          isOnline: isInstrument,
          dataTitle: "",
          isDowntime: isDowntime,
          asset: asset,
          product: product ? product : null,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange,
        }
      }
    }


      

    if (chartType === "bar" || chartType === "area") {
  
      if (customYaxis) {
        if (
          yaxisFromRef.current.value === "" ||
          yaxisToRef.current.value === "" //NOSONAR
        ) {
          SetMessage("Enter Custom Y axis values");
          SetType("warning");
          setOpenSnack(true);
          return false;
        }
      }
      if (isInstrument && metricList.length === 0) {
        SetMessage(t("Select metric"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      // console.log(isInstrument,virtualInstrumentID,"val")
      if (
        !isInstrument &&
        (virtualInstrumentID === "" || virtualInstrumentID.length === 0)
      ) {
        // if virtual intrument not getting selected error message will pop up
        SetMessage(t("Please select Virtual instrument details"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          unit: "",
          instrument: instrumentID,
          metric: metricList,
          isCustomYaxis: customYaxis,
          isDataStats: isdataStats,
          yaxisFromRef: yaxisFromRef.current
            ? yaxisFromRef.current.value
            : null,
          yaxisToRef: yaxisToRef.current ? yaxisToRef.current.value : null,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          tooltipSort: tooltipSort,
          isLabel: isLabel,
          isShowAlarm: isShowAlarm,
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          isConsumption: isConsumption ? true : false,//NOSONAR
          alarmLevel: alarmLevels,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange,
        },
      };
    }
    if (chartType === "singleText") {
      if (isInstrument && metricList.length === 0) {
        SetMessage(t("Select metric"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

      if (
        !isInstrument &&
        (virtualInstrumentID === "" || virtualInstrumentID.length === 0)
      ) {
        // if virtual intrument not getting selected error message will pop up
        SetMessage(t("Please select Virtual instrument details"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if (!arc3Max && textConvert === false) {
        SetMessage("Please enter Maximum value, it cannot be empty or zero");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      if (Error) {
        SetMessage("Please select upto 10 metrics");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }

      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          unit: "",
          instrument: instrumentID,
          metric: metricList,
          isCustomYaxis: customYaxis,
          yaxisFromRef: yaxisFromRef.current
            ? yaxisFromRef.current.value
            : null,
          yaxisToRef: yaxisToRef.current ? yaxisToRef.current.value : null,
          isDecimal: isDecimal,
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          fontVariant: fontVariantValue,
          textAlign: textAlignValue,
          textSize: textSizeValue,
          displayStyle: displayStyleValue,
          arc1Min:arc1Min,
          arc1: arc1Max,
          arc2: arc2Max,
          arc3: arc3Max,
          text1: text1Ref.current ? text1Ref.current.value : "-",
          text2: text2Ref.current ? text2Ref.current.value : "-",
          text3: text3Ref.current ? text3Ref.current.value : "-",
          SingleValueColor: Color.current ? Color.current.value : "#000000",
          // SingleValueColor1: Color1.current ? Color1.current.value : "#88B056",
          // SingleValueColor2: Color2.current ? Color2.current.value : "#FFD121",
          // SingleValueColor3: Color3.current ? Color3.current.value : "#DF3B44",
             SingleValueColor1:dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
          SingleValueColor2: dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color: "#FFD121",
          SingleValueColor3: dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
          color1: "#88B056",
          color2: "#FFD121",
          color3: "#DF3B44",
          isConsumption: metricList.includes("kwh-Consumption Reading")
            ? true
            : false,//NOSONAR
          isText: textConvert ? textConvert : false,//NOSONAR
          dataType: dataType,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange,
        },
      };
    }

    if (chartType === "pie" || chartType === "donut") {
      
      if(chartType === "pie"  && isMultiMetric){
        let variables = MetricFields.map((x) => {
          return x.metric_name?.map((z) => {
            console.log(x.instrument_id, x.instrument_name, z,"vengatesh___")
            return {
              'instrument_id': x.instrument_id,
              'instrument_name': x.instrument_name,
              'metric': z.name,
              'metric_unit': z.metric?.metricUnitByMetricUnit?.unit,
                "metric_title": z.title
            }
          })
        })
  
        cardObj = {
          title: nameRef.current.value?.trim(),
          type: chartType,
          meta: {
            instrument: instrumentID,
            metricField: metric_field,
            isOnline: isInstrument,
            tableName: headPlant.schema + "_data",
            isCustomYaxis: customYaxis,
            yaxisFromRef: yaxisFromRef.current
              ? yaxisFromRef.current.value
              : null,
            yaxisToRef: yaxisToRef.current ? yaxisToRef.current.value : null,
            decimalPoint: decimalPoint,
            aggregation: aggregation,
            isMultiMetric: isMultiMetric,
            variables: variables.flat(),
            showLabel: showDate || false,
            fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
            toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
            selectedRange:selectedRange
          },
        };
      }
      else {
      if (isInstrument) {
      let variables = MetricFields.map((x) => {
        return x.metric_name?.map((z) => {
          console.log(x.instrument_id, x.instrument_name, z, "MAMAM")
          return {
            'instrument_id': x.instrument_id,
            'instrument_name': x.instrument_name,
            'metric': z.name,
            'metric_unit': z.metric?.metricUnitByMetricUnit?.unit,
            "metric_title": z.title
          }
        })
      })

      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          instrument: instrumentID,
          metricField: metric_field,
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          isCustomYaxis: customYaxis,
          yaxisFromRef: yaxisFromRef.current
            ? yaxisFromRef.current.value
            : null,
          yaxisToRef: yaxisToRef.current ? yaxisToRef.current.value : null,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          variables: variables.flat(),
          showLabel: showDate || false,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }
    else {
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          tableName: headPlant.schema + "_data",
          label: "timerange",
          isMoment: true,
          labelFormat: "HH:mm",
          dataName: "value",
          isOnline: isInstrument,
          dataTitle: "",
          metricField: metric_field,
          unit: "",
          isDataStats: isdataStats,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          tooltipSort: tooltipSort,
          isLabel: isLabel,
          isShowAlarm: isShowAlarm,
          isConsumption: isConsumption ? true : false,//NOSONAR
          formula: virtualFormula,
          virturalInstrument: multipleVirtualInstrument,
          formulaName: formulaName,
          variables: multipleVirtualInstrument,
          showLabel: showDate || false,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
      }
    }
    }
    if (chartType === "dialgauge") {
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          instrument: instrumentID,
          metric: metricList,
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          arc1Min:arc1Min,
          arc1: arc1Max,
          arc2: arc2Max,
          arc3: 100,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          // color1: Arc1color.current ? Arc1color.current.value : "#88B056",
          // color2: Arc2color.current ? Arc2color.current.value : "#FFD121",
          // color3: Arc3color.current ? Arc3color.current.value : "#DF3B44",
          color1: Arc1color.current ? Arc1color.current.value : dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
          color2: Arc2color.current ? Arc2color.current.value : dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color : "#FFD121",
          color3: Arc3color.current ? Arc3color.current.value : dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
          isConsumption: false,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
 selectedRange:selectedRange
        },
      };
      // if (arc1Max && arc2Max > 99) {
      //   // check the min and max value for charttype dialguage
      //   SetMessage(t("Please Enter Maximum and Minimum below 99"));
      //   SetType("warning");
      //   setOpenSnack(true);
      //   return false;
      // }
    }
    if (chartType === "dialgauge2" || chartType === "fillgauge") {
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          instrument: instrumentID,
          metric: metricList,
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          groupBy: groupBy,
          arc1Min:arc1Min,
          arc1: arc1Max,
          arc2: arc2Max,
          arc3: arc3Max,
          // color1: Arc1color.current ? Arc1color.current.value : "#88B056",
          // color2: Arc2color.current ? Arc2color.current.value : "#FFD121",
          // color3: Arc3color.current ? Arc3color.current.value : "#DF3B44",
          color1: Arc1color.current ? Arc1color.current.value : dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
          color2: Arc2color.current ? Arc2color.current.value : dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color : "#FFD121",
          color3: Arc3color.current ? Arc3color.current.value : dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
          isConsumption: false,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
          selectedRange:selectedRange
        },
      };
      if (chartType === "dialgauge2" && arc1Max === 0) {
        SetMessage("Please Enter the Value Above 0 ");
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
    }
    if (chartType === "Text") {
      cardObj = {
        type: chartType,
        meta: {
          text: textContent.current.value,
          //variant: variant
          fontVariant: fontVariantValue,
          textAlign: textAlignValue,
          textSize: textSizeValue,
          Textcolor: Color.current.value,
          BackgroundColor: BackgroundColor.current.value,
        },
      };
    }
    if (chartType === "Table") {
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          unit: "",
          metricField: metric_field,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          isMultiMetric: isMultiMetric,
          multiMetricCellColour: multiMetricCellColour,
          label: "timerange",
          isMoment: true,
          labelFormat: "HH:mm",
          dataName: "value",
          dataTitle: "",
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
          selectedRange:selectedRange,
          // TableCellColor : TableCellColor.current.value
        },
      };
    }
    if (chartType === "Image") {
      cardObj = {
        type: chartType,
        meta: {
          src: images,
        },
      };
    }
    if (chartType === "Status") {

      const meta = {
        isOnline: isInstrument,
        instrument: instrumentID,
        metric: metricList,
        statusType: optionTypes,
        tableName: `${headPlant.schema}_data`,
        formula: virtualFormula,
        virturalInstrument: virtualInstrumentID,
        formulaName: formulaName,
        fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
        toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
      };

      // Conditionally add binary-related properties if optionTypes is "binary"
      if (optionTypes === "binary") {
        meta.positiveColor = positiveColor.current
          ? positiveColor.current.value
          : "";
        meta.positiveText = positiveText.current
          ? positiveText.current.value
          : "";
        meta.positiveValue = positiveValue.current
          ? positiveValue.current.value
          : "";
        meta.negativeColor = negativeColor.current
          ? negativeColor.current.value
          : "";
        meta.negativeText = negativeText.current
          ? negativeText.current.value
          : "";
        meta.negativeValue = negativeValue.current
          ? negativeValue.current.value
          : "";
      }

      // Conditionally add multiLevelValue if optionTypes is "multiLevel"
      if (optionTypes === "multiLevel") {
        meta.multiLevelValue = multiStatus.map((x) => ({
          multiPositiveColor: x.multiPossitiveColor,
          multiPositiveText: x.multiPossitiveText,
          multiPositiveValue: x.multiPossitiveValue,
        }));
      }

      cardObj = {
        title: nameRef.current ? nameRef.current.value?.trim() : "",
        type: chartType,
        meta: meta,
      };

   
    }

    if (chartType === "alerts") {
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          alertid: alertID,
          alertname: alertName,
          tableName: headPlant.schema + "_alerts",
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }
    if (chartType === "map") {
      if (mapInstrumentID.length === 0) {
        SetMessage(t("SelInstru"));
        SetType("warning");
        setOpenSnack(true);
        return false;
      }
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          instrumentMap: mapInstrumentID.map((x) => x.id),
          mapInstrument: mapInstrumentID,
          tableName: headPlant.schema + "_data",
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }

    if (chartType === "clock") {
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          clockMode,
          timeFormat,
          timeZone,
          showDate,
          clockFont,
          date:
            clockMode === "countup"
              ? date
              : clockMode === "countdown"
              ? enddate
              : new Date(),//NOSONAR
        },
      };
    }

    if (chartType === "energymeter") {
      cardObj = {
        title: nameRef.current.value?.trim(),
        type: chartType,
        meta: {
          unit: "",
          instrument: instrumentID,
          metric: metricList,
          isDecimal: isDecimal,
          isOnline: isInstrument,
          tableName: headPlant.schema + "_data",
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          isConsumption: metricList.includes("kwh-Consumption Reading")
            ? true
            : false,//NOSONAR
          isText: textConvert ? textConvert : false,
          dataType: dataType,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }

    if (chartType === "weather") {
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          location: location,
          // size: widgetSize
        },
      };
    }

    if (chartType === "dataoverimage") {
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          unit: "",
          tableName: headPlant.schema + "_data",
          isOnline: true || isInstrument,//NOSONAR
          // metricField: metric_field,
          image: dashboardUploadsData.file === undefined ? { file: dashboardFetchData?.data?.name, id: dashboardFetchData?.data?.id } : dashboardUploadsData,
          instrument: instrumentID,
          position: props?.detail?.meta?.position || getDefaultPosition(metricList),//NOSONAR
          // position: getDefaultPosition(metricList),
          metric: metricList,
          decimalPoint: decimalPoint,
          aggregation: aggregation,
          isConsumption: metricList.includes("kwh-Consumption Reading")
            ? true
            : false,//NOSONAR
          isText: textConvert ? textConvert : false,//NOSONAR
          dataType: dataType,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }

    if (chartType === "video") {
      console.log("EED --------",dashboardUploadsData, dashboardFetchData)
      // dashboardUploadsData
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          url:
            videoSource === "file" 
            ? dashboardUploadsData.file === undefined  // new file not upload
                ? { file: dashboardFetchData?.data?.name, id: dashboardFetchData?.data?.id } 
                : dashboardUploadsData 
            : url?.current?.value,
          videoSource: videoSource,
          // size: widgetSize
        },
      };
    }

    if (chartType === "thermometer") {
      cardObj = {
        type: chartType,
        title: nameRef.current.value?.trim(),
        meta: {
          maxTemp: maxTemp.current.value,
          instrument: instrumentID,
          metric: metricList,
          unit: tempunit,
          currentUnit: existingTempUnit,
          fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        },
      };
    }

    
    if (chartType === 'dialgauge') {
      cardObj = {
          title: nameRef.current.value?.trim(),
          type: chartType,
          meta: {
              instrument: instrumentID,
              metric: metricList,
              isOnline: isInstrument,
              tableName: headPlant.schema + '_data',
              arc1Min:arc1Min,
              arc1: arc1Max,
              arc2: arc2Max,
              // arc3: 100,
              arc3: arc3Max,
              decimalPoint: decimalPoint,
              aggregation: aggregation,
              groupBy: groupBy,
              // color1: !accordian1 ? ArcColor.Arc1color : Arc1color.current.value ,
              // color2: !accordian1 ? ArcColor.Arc2color : Arc2color.current.value,
              // color3: !accordian1 ? ArcColor.Arc3color : Arc3color.current.value ,
               color1: Arc1color.current ? Arc1color.current.value : dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
              color2: Arc2color.current ? Arc2color.current.value : dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color : "#FFD121",
              color3: Arc3color.current ? Arc3color.current.value : dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
              isConsumption: false,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
              selectedRange:selectedRange
          }
      }
      // if (arc1Max && arc2Max > 99) { // check the min and max value for charttype dialguage
      //     SetMessage(t("Please Enter Maximum and Minimum below 99"))
      //     SetType("warning")
      //     setOpenSnack(true)
      //     return false
      // }
  }
  if (chartType === 'dialgauge2' || chartType === 'fillgauge') {
      cardObj = {
          title: nameRef.current.value?.trim(),
          type: chartType,
          meta: {
              instrument: instrumentID,
              metric: metricList,
              isOnline: isInstrument,
              tableName: headPlant.schema + '_data',
              decimalPoint: decimalPoint,
              aggregation: aggregation,
              groupBy: groupBy,
              arc1Min:arc1Min,
              arc1: arc1Max,
              arc2: arc2Max,
              arc3: arc3Max,
              // color1: !accordian1 ? ArcColor.Arc1color : Arc1color.current.value ,
              // color2: !accordian1 ? ArcColor.Arc2color : Arc2color.current.value ,
              // color3: !accordian1 ? ArcColor.Arc3color : Arc3color.current.value,
               color1: Arc1color.current ? Arc1color.current.value : dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
              color2: Arc2color.current ? Arc2color.current.value : dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color : "#FFD121",
              color3: Arc3color.current ? Arc3color.current.value : dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
              isConsumption: false,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
          }
      }
  }
      if (chartType === 'dialgauge2' && arc1Max === 0) {
          SetMessage("Please Enter the Value Above 0 ")
          SetType("warning")
          setOpenSnack(true)
          return false
      }

    if (chartType === 'Status') {
 
        const meta = {
            isOnline: isInstrument,
            instrument: instrumentID,
            metric: metricList,
            statusType: optionTypes,
            tableName: `${headPlant.schema}_data`,
            formula: virtualFormula,
            virturalInstrument: virtualInstrumentID,
            formulaName: formulaName,
            fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
            toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
        };

        // Conditionally add binary-related properties if optionTypes is "binary"
        if (optionTypes === "binary") {
            meta.positiveColor = positiveColor.current ? positiveColor.current.value : "";
            meta.positiveText = positiveText.current ? positiveText.current.value : "";
            meta.positiveValue = positiveValue.current ? positiveValue.current.value : "";
            meta.negativeColor = negativeColor.current ? negativeColor.current.value : "";
            meta.negativeText = negativeText.current ? negativeText.current.value : "";
            meta.negativeValue = negativeValue.current ? negativeValue.current.value : "";
        }

        // Conditionally add multiLevelValue if optionTypes is "multiLevel"
        if (optionTypes === "multiLevel") {
            meta.multiLevelValue = multiStatus.map((x) => ({
                multiPositiveColor: x.multiPossitiveColor,
                multiPositiveText: x.multiPossitiveText,
                multiPositiveValue: x.multiPossitiveValue,
            }));
        }

        cardObj = {
            title: nameRef.current ? nameRef.current.value?.trim() : "",
            type: chartType,
            meta: meta,
        };

      }
      if (!isInstrument ) {
        cardObj["meta"]["formula"] = virtualFormula;
        cardObj["meta"]["virturalInstrument"] = chartType === 'groupedbar' ? multipleVirtualInstrument : virtualInstrumentID;
        cardObj["meta"]["formulaName"] = formulaName;
        cardObj["meta"]["metricField"] = "kwh";
      }  
    if (isEdit) {
   

      selectedDashboard.dashboard.data[props.dictkey] = cardObj;
     
      let tempLayout = selectedDashboard.layout;
      getUpdateDashData({
        dashboard: selectedDashboard.dashboard,
        dash_id: dashboardDefaultID,
        user_id: currUser.id,
      });
      getUpdateDashLayout({
        layout: tempLayout,
        dash_id: dashboardDefaultID,
        user_id: currUser.id,
      });

      let obj = { layout: tempLayout, dashboard: selectedDashboard.dashboard };

      setSelectedDashboardSkeleton(obj);
      SetMessageRecoil("Graph updated successfully");
      SetTypeRecoil("success");
      setOpenSnackRecoil(true);
      setPlayMode(false);
      setIsEdit(false);
      props.refreshCard(cardObj);
    } else {
      //Add functionality
      try {
        let tempData = JSON.parse(JSON.stringify(selectedDashboard.dashboard));
        let tempLayout = JSON.parse(JSON.stringify(selectedDashboard.layout));
        const keys = Object.keys(tempData.data);
        let len = 0;
        if (keys.length !== 0) {
          len = parseInt(keys[keys.length - 1]);
        }
        if (
          chartType === "line" ||
          chartType === "stackedbar"
        ) {
          if (isInstrument) {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                alarmLevel: alarmLevels,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          } else {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                formula: virtualFormula,
                virturalInstrument: virtualInstrumentID,
                formulaName: formulaName,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }
        } else if(chartType === "groupedbar") {
          if (isInstrument) {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                alarmLevel: alarmLevels,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          } else {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                formula: virtualFormula,
                virturalInstrument: multipleVirtualInstrument,
                formulaName: formulaName,
                variables: multipleVirtualInstrument,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }
        } else if (chartType === 'correlogram') {

          if (isInstrument) {
           

            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metricField: metric_field,
                metric: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                alarmLevel: alarmLevels,
                colour: corrColour,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };

          } else {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                formula: virtualFormula,
                virturalInstrument: virtualInstrumentID,
                formulaName: formulaName,
                colour: corrColour,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }

        } else if (chartType === 'combobar') {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              tableName: headPlant.schema + "_data",
              label: "timerange",
              isMoment: true,
              labelFormat: "HH:mm",
              dataName: "value",
              isOnline: isInstrument,
              dataTitle: "",
              yaxisFromRef: yaxisFromRef.current
                ? yaxisFromRef.current.value
                : null,
              yaxisToRef: yaxisToRef.current
                ? yaxisToRef.current.value
                : null,
              isCustomYaxis: customYaxis,
              isBarVsLine: isBarVsLine,
              metricField: [{
                "field1": {
                    "instrument": instrument1,
                    "metric": [
                      `${instrumentMetricListData[0].metOpt.filter((x) => x.title === metric1)?.[0]?.name}-${metric1}`
                    ]
                },
                "field2": {
                    "instrument": instrument2,
                    "metric": [
                        `${instrumentMetricListData[0].metOpt.filter((x) => x.title === metric2)?.[0]?.name}-${metric2}`
                    ]
                }
              }],
              instrument1: instrument1,
              instrument2: instrument2,
              metric1: metric1,
              metric2: metric2,
              chart1: chart1,
              chart2: chart2,
              graph: {
                primary_y: {
                  chart: chart1,
                  metric: metric1,
                  instrument: instrument1
                },
                secondary_y: {
                  chart: chart2,
                  metric: metric2,
                  instrument: instrument2 
                }
              },
              unit: "",
              isDataStats: isdataStats,
              decimalPoint: decimalPoint,
              aggregation: aggregation,
              groupBy: groupBy,
              tooltipSort: tooltipSort,
              isLabel: isLabel,
              isShowAlarm: isShowAlarm,
              isConsumption: isConsumption ? true : false,//NOSONAR
              alarmLevel: alarmLevels,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        } else if (chartType === "pareto") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              tableName: headPlant.schema + "_data",
              label: "timerange",
              isMoment: true,
              labelFormat: "HH:mm",
              dataName: "value",
              isOnline: isInstrument,
              dataTitle: "",
              isDowntime: isDowntime,
              asset: asset,
              product: product ? product : null,//NOSONAR
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
          toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange

            }
          }
        } else if (chartType === "Table") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              tableName: headPlant.schema + "_data",
              label: "timerange",
              isMoment: true,
              labelFormat: "HH:mm",
              dataName: "value",
              dataTitle: "",
              metricField: metric_field,
              unit: "",
              decimalPoint: decimalPoint,
              aggregation: aggregation,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
              selectedRange:selectedRange,
              isMultiMetric: isMultiMetric,
              multiMetricCellColour: multiMetricCellColour
              // TableCellColor:TableCellColor.current.value
            },
          };
        } else if (chartType === "bar" || chartType === "area") {
          if (isInstrument) {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metric: metricList,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                instrument: instrumentID,
                alarmLevel: alarmLevels,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          } else {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isCustomYaxis: customYaxis,
                metric: "",
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                instrument: instrumentID,
                alarmLevel: alarmLevels,
                formula: virtualFormula,
                virturalInstrument: virtualInstrumentID,
                formulaName: formulaName,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }
        } else if (chartType === "Text") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,

            meta: {
              text: textContent.current.value,
              //variant: variant
              fontVariant: fontVariantValue,
              textAlign: textAlignValue,
              textSize: textSizeValue,
              Textcolor: Color.current.value,
              BackgroundColor: BackgroundColor.current.value,

            },
          };
        } else if (chartType === "map") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              instrumentMap: mapInstrumentID,
              tableName: headPlant.schema + "_data",
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        } else if (chartType === "Image") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,

            meta: {
              src: images,
            },
          };
        } else if (chartType === "Status") {
          // Initialize meta object
          const meta = {
            isOnline: isInstrument,
            instrument: instrumentID,
            metric: metricList,
            statusType: optionTypes,
            tableName: headPlant.schema + "_data",
            formula: virtualFormula,
            virturalInstrument: virtualInstrumentID,
            formulaName: formulaName,
            fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
            toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
          };

          // Conditionally add binary-related properties if optionTypes is "binary"
          if (optionTypes === "binary") {
            meta.positiveColor = positiveColor.current
              ? positiveColor.current.value
              : "";
            meta.positiveText = positiveText.current
              ? positiveText.current.value
              : "";
            meta.positiveValue = positiveValue.current
              ? positiveValue.current.value
              : "";
            meta.negativeColor = negativeColor.current
              ? negativeColor.current.value
              : "";
            meta.negativeText = negativeText.current
              ? negativeText.current.value
              : "";
            meta.negativeValue = negativeValue.current
              ? negativeValue.current.value
              : "";
          }

          // Conditionally add multiLevelValue if optionTypes is "multiLevel"
          if (optionTypes === "multiLevel") {
            meta.multiLevelValue = multiStatus.map((x) => ({
              multiPositiveColor: x.multiPossitiveColor,
              multiPositiveText: x.multiPossitiveText,
              multiPositiveValue: x.multiPossitiveValue,
            }));
          }

          // Assign the constructed object to tempData
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current ? nameRef.current.value?.trim() : "",
            meta: meta,
          };
        } else if (chartType === "alerts") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              alertid: alertID,
              alertname: alertName,
              tableName: headPlant.schema + "_alerts",
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        } else if (
          chartType === "dialgauge" ||
          chartType === "dialgauge2" ||
          chartType === "fillgauge"
        ) {
          if (isInstrument) {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                instrument: instrumentID,
                metric: metricList,
                isOnline: isInstrument,
                tableName: headPlant.schema + "_data",
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                 arc1Min:arc1Min,
                arc1: arc1Max,
                arc2: arc2Max,
                arc3: arc3Max,                
                // color1: !accordian1 ? ArcColor.Arc1color : Arc1color.current.value ,
                // color2: !accordian1 ? ArcColor.Arc2color : Arc2color.current.value,
                // color3: !accordian1 ? ArcColor.Arc3color : Arc3color.current.value ,
          color1: Arc1color.current ? Arc1color.current.value : dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
          color2: Arc2color.current ? Arc2color.current.value : dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color : "#FFD121",
          color3: Arc3color.current ? Arc3color.current.value : dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
           
                isConsumption: false,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          } else {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                instrument: instrumentID,
                metric: metricList,
                isOnline: isInstrument,
                tableName: headPlant.schema + "_data",
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                 arc1Min:arc1Min,
                arc1: arc1Max,
                arc2: arc2Max,
                arc3: arc3Max,
                // color1: Arc1color.current ? Arc1color.current.value : "#88B056",
                // color2: Arc2color.current ? Arc2color.current.value : "#FFD121",
                // color3: Arc3color.current ? Arc3color.current.value : "#DF3B44",
                color1: Arc1color.current ? Arc1color.current.value : dynamicColor&&dynamicColor.level1_color ?dynamicColor.level1_color : "#88B056",
             color2: Arc2color.current ? Arc2color.current.value : dynamicColor&&dynamicColor.level2_color ?dynamicColor.level2_color : "#FFD121",
             color3: Arc3color.current ? Arc3color.current.value : dynamicColor&&dynamicColor.level3_color ?dynamicColor.level3_color : "#DF3B44",
                isConsumption: false,
                formula: virtualFormula,
                virturalInstrument: virtualInstrumentID,
                formulaName: formulaName,

                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }
        }  else if (chartType === "singleText") {
          if (isInstrument) {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                unit: "",
                instrument: instrumentID,
                metric: metricList,
                isCustomYaxis: customYaxis,
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isDecimal: isDecimal,
                isOnline: isInstrument,
                tableName: headPlant.schema + "_data",
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                fontVariant: fontVariantValue,
                textAlign: textAlignValue,
                textSize: textSizeValue,
                displayStyle: displayStyleValue,
                arc1Min:arc1Min,
                arc1: arc1Max,
                arc2: arc2Max,
                arc3: arc3Max,
                text1: text1Ref.current ? text1Ref.current.value : "-",
                text2: text2Ref.current ? text2Ref.current.value : "-",
                text3: text3Ref.current ? text3Ref.current.value : "-",
                SingleValueColor: Color.current
                  ? Color.current.value
                  : "#000000",
           

                 SingleValueColor1: dynamicColor&&  dynamicColor.level1_color ? dynamicColor.level1_color
                  : "#88B056",
                SingleValueColor2: dynamicColor&&  dynamicColor.level2_color ? dynamicColor.level2_color
                  : "#FFD121",
                SingleValueColor3:dynamicColor&&  dynamicColor.level3_color ? dynamicColor.level3_color
                  : "#DF3B44",
                
                color1: "#88B056",
                color2: "#FFD121",
                color3: "#DF3B44",
                isConsumption: metricList.includes("kwh-Consumption Reading")
                  ? true
                  : false,//NOSONAR
                isText: textConvert ? textConvert : false,
                dataType: dataType,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          } else {
            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                unit: "",
                instrument: instrumentID,
                metric: metricList,
                isCustomYaxis: customYaxis,
                yaxisFromRef: yaxisFromRef.current
                  ? yaxisFromRef.current.value
                  : null,
                yaxisToRef: yaxisToRef.current
                  ? yaxisToRef.current.value
                  : null,
                isDecimal: isDecimal,
                isOnline: isInstrument,
                tableName: headPlant.schema + "_data",
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                fontVariant: fontVariantValue,
                textAlign: textAlignValue,
                textSize: textSizeValue,
                displayStyle: displayStyleValue,
                arc1Min:arc1Min,
                arc1: arc1Max,
                arc2: arc2Max,
                arc3: arc3Max,
                text1: text1Ref.current ? text1Ref.current.value : "-",
                text2: text2Ref.current ? text2Ref.current.value : "-",
                text3: text3Ref.current ? text3Ref.current.value : "-",
                SingleValueColor: Color.current
                  ? Color.current.value
                  : "#000000",
                // SingleValueColor1: Color1.current
                //   ? Color1.current.value
                //   : "#88B056",
                // SingleValueColor2: Color2.current
                //   ? Color2.current.value
                //   : "#FFD121",
                // SingleValueColor3: Color3.current
                //   ? Color3.current.value
                //   : "#DF3B44",
                SingleValueColor1: dynamicColor&&  dynamicColor.level1_color ? dynamicColor.level1_color
                : "#88B056",
              SingleValueColor2: dynamicColor&&  dynamicColor.level2_color ? dynamicColor.level2_color
                : "#FFD121",
              SingleValueColor3:dynamicColor&&  dynamicColor.level3_color ? dynamicColor.level3_color
                : "#DF3B44",

                color1: "#88B056",
                color2: "#FFD121",
                color3: "#DF3B44",
                isConsumption: metricList.includes("kwh-Consumption Reading")
                  ? true
                  : false,
                isText: textConvert ? textConvert : false,
                dataType: dataType,
                formula: virtualFormula,
                virturalInstrument: virtualInstrumentID,
                formulaName: formulaName,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }
        } else if (chartType === "clock") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              clockMode,
              timeFormat,
              timeZone,
              showDate,
              clockFont,
              date:
                clockMode === "countup"
                  ? date
                  : clockMode === "countdown"
                  ? enddate
                  : new Date(),
            },
          };
        } else if (chartType === "energymeter") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              unit: "",
              tableName: headPlant.schema + "_data",
              isOnline: isInstrument,
              // metricField: metric_field,
              instrument: instrumentID,
              metric: metricList,
              decimalPoint: decimalPoint,
              aggregation: aggregation,
              isConsumption: metricList.includes("kwh-Consumption Reading")
                ? true
                : false,//NOSONAR
              isText: textConvert ? textConvert : false,//NOSONAR
              dataType: dataType,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        } else if (chartType === "weather") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              location: location,
              // size: widgetSize
            },
          };
        } else if (chartType === "dataoverimage") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              unit: "",
              tableName: headPlant.schema + "_data",
              isOnline: isInstrument,
              // metricField: metric_field,
              instrument: instrumentID,
              image: dashboardUploadsData,
              position: getDefaultPosition(metricList),
              metric: metricList,
              decimalPoint: decimalPoint,
              aggregation: aggregation,
              isConsumption: metricList.includes("kwh-Consumption Reading")
                ? true
                : false,//NOSONAR
              isText: textConvert ? textConvert : false,//NOSONAR
              dataType: dataType,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        } else if (chartType === "video") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              url:
                videoSource === "file"
                  ? dashboardUploadsData
                  : url?.current?.value,
              videoSource: videoSource,
              // size: widgetSize
            },
          };
        } else if (chartType === "thermometer") {
          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: nameRef.current.value?.trim(),
            meta: {
              maxTemp: maxTemp.current.value,
              instrument: instrumentID,
              metric: metricList,
              unit: tempunit,
              currentUnit: existingTempUnit,
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        } else if (chartType === "donut" || chartType === "pie") {

          if(chartType === "pie" && isMultiMetric){
            let variables = MetricFields.map((x) => {
              return x.metric_name?.map((z) => {
                console.log(console.log("callingADD", z.title, z))
                return {
                  'instrument_id': x.instrument_id,
                  'instrument_name': x.instrument_name,
                 'metric': z.name,
                  'metric_unit': z?.metric?.metricUnitByMetricUnit?.unit,
                    "metric_title": z.title
                }
              })
            })


            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                variables: variables.flat(),
                isMultiMetric: isMultiMetric,
                isConsumption: isConsumption ? true : false,//NOSONAR
                alarmLevel: alarmLevels,
                showLabel: showDate || false,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
                selectedRange:selectedRange,
              },
            };
          }
          else {
          if (isInstrument) {

            let variables = MetricFields.map((x) => {
              return x.metric_name?.map((z) => {
                // console.log(x.instrument_id, x.instrument_name, z)
                return {
                  'instrument_id': x.instrument_id,
                  'instrument_name': x.instrument_name,
                  'metric': z?.name,
                  'metric_unit': z?.metric?.metricUnitByMetricUnit?.unit,
                  "metric_title": z.title
                }
              })
            })


            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                variables: variables.flat(),
                isConsumption: isConsumption ? true : false,//NOSONAR
                alarmLevel: alarmLevels,
                showLabel: showDate || false,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
                selectedRange:selectedRange,
              },
            };
          }
          else {
            console.log(multipleVirtualInstrument)

            tempData.data[(len + 1).toString()] = {
              type: chartType,
              title: nameRef.current.value?.trim(),
              meta: {
                tableName: headPlant.schema + "_data",
                label: "timerange",
                isMoment: true,
                labelFormat: "HH:mm",
                dataName: "value",
                isOnline: isInstrument,
                dataTitle: "",
                metricField: metric_field,
                unit: "",
                isDataStats: isdataStats,
                decimalPoint: decimalPoint,
                aggregation: aggregation,
                groupBy: groupBy,
                tooltipSort: tooltipSort,
                isLabel: isLabel,
                isShowAlarm: isShowAlarm,
                isConsumption: isConsumption ? true : false,//NOSONAR
                formula: virtualFormula,
                virturalInstrument: multipleVirtualInstrument,
                formulaName: formulaName,
                variables: multipleVirtualInstrument,
                showLabel: showDate || false,
                fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
                toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
              },
            };
          }
          }


        } 
        else {
          console.log("INSIDE___RRR___", chartType)

          tempData.data[(len + 1).toString()] = {
            type: chartType,
            title: "Graph" + (len + 1),
            meta: {
              tableName: headPlant.schema + "_data",
              label: "timerange",
              isMoment: true,
              labelFormat: "HH:mm",
              dataName: "value",
              isOnline: true,
              yaxisFromRef: "",
              yaxisToRef: "",
              dataTitle: "",
              limit: 5,
              metric: [],
              instrument: "",
              unit: "",
              fromDate:moment(fromDate).format("YYYY-MM-DDTHH:mm:ssz"),
              toDate:moment(toDate).format("YYYY-MM-DDTHH:mm:ssz"),
selectedRange:selectedRange
            },
          };
        }

        tempLayout.lg.push({
          w: 2,
          h: 2,
          x: (len * 2) % (tempData.cols || 12),
          y: Infinity,
          i: len.toString(),
        });
        tempLayout.sm.push({
          w: 2,
          h: 2,
          x: (len * 2) % (tempData.cols || 12),
          y: Infinity,
          i: len.toString(),
        });
        tempLayout.md.push({
          w: 2,
          h: 2,
          x: (len * 2) % (tempData.cols || 12),
          y: Infinity,
          i: len.toString(),
        });
        tempLayout.xs.push({
          w: 2,
          h: 2,
          x: (len * 2) % (tempData.cols || 12),
          y: Infinity,
          i: len.toString(),
        });

        console.log(tempData.data)
        localStorage.setItem("currentLayout", JSON.stringify(tempLayout));
        let obj = { layout: tempLayout, dashboard: tempData };
        console.log(tempData)
        setSelectedDashboardSkeleton(obj);
        SetMessageRecoil("New Graph Added");
        SetTypeRecoil("success");
        setOpenSnackRecoil(true);
      } catch (err) {
        console.log("handle grid add", err);
      }
    }

    handleDialogHieClose();
  };

  const changeChartType = (e) => {
    const chartTypes = e.target.value;
    if (
      chartTypes === "dialgauge" ||
      chartTypes === "dialgauge2" ||
      chartTypes === "fillgauge"
    ) {
      setTimeout(() => {
        Arc1color.current.value = "#88B056";
        Arc2color.current.value = "#FFD121";
        Arc3color.current.value = "#DF3B44";
      }, [1000]);
    }

    setChartType(e.target.value);
    if (nameRef.current) {
      nameRef.current.value = "";
    }

    setMetricFields([
      {
        field: 1,
        instrument_id: "",
        instrument_name: "",
        metric_name: [],
        metric_title: [],
        metOpt: [],
        TableCellColor: "#ffffff",
      },
    ]);
    setCustomYaxis(false);
    setDecimalPoint("none");
    setAggregation("none");
    setGroupBy("none");
    setDataStats(false);
    setTooltipSort("none");
    setIsLabel(false);
    setIsShowAlarm(false);
    setVirtualInstrumentID([]);
    setInstrumentID("");
    setMetricName([]);
    setMetricTitle([]);
    setInstrument1(null);
    setInstrument2(null);
    setMetric1(null);
    setMetric2(null);
    setChart1(null);
    setChart2(null);
    setIsMultiMetric(false)
  };

  const metricTitleValue =
    metricTitle && metricTitle.length > 0 ? metricTitle[0].title : "";
  

  //console.log(metricTitleValue,metricTitle,MetricFields,"metricsmetrics")
  function handleColorChange(e, row, field) {
    //  console.log(e,MetricFields,"color e")
    let setelement = [...MetricFields];
    const fieldIndex = setelement.findIndex((x) => x.field === field);
    let fieldObj = { ...setelement[fieldIndex] };
    fieldObj["TableCellColor"] = e.target.value;

    setelement[fieldIndex] = fieldObj;
    setMetricFields(setelement);
  }

  function AggregationDisable() {//NOSONAR
    if (
      chartType === "dialgauge" ||
      chartType === "dialgauge2" ||
      chartType === "fillgauge" ||
      chartType === "singleText"
    ) {
      let isDisable = isInstrument
        ? (metricTitle && metricTitle.length > 1) ||
          instDisable ||
          (MetricFields && MetricFields.length > 1)
        : false;
        
      return isDisable
    } 
    else if( chartType === 'Table' && isMultiMetric){
      return true
    }
    else if( chartType === "line" ||
      chartType === "stackedbar" ||
      chartType === "groupedbar"){
        let isDisable = false;

    if (MetricFields && MetricFields.length > 0) {
      const allHaveSingleMetricTitle = MetricFields.every(
        (field) => field.metric_title && field.metric_title.length === 1
      );
console.log(allHaveSingleMetricTitle,"1")
      if (allHaveSingleMetricTitle) {
        const firstMetricName = MetricFields[0].metric_title[0].name;
        const allNamesMatch = MetricFields.every(
          (field) => field.metric_title[0].name === firstMetricName
        );
console.log(allNamesMatch,"2",MetricFields,firstMetricName)
        isDisable = !allNamesMatch;
      } else {
        isDisable = true;
      }
    } else {
      isDisable = true;
    }
    console.log(isDisable,"isdisable")
    return isDisable;
   
    }else {
      let isDisable = isInstrument
        ? (metricTitle && metricTitle.length > 1) ||
          instDisable ||
          (MetricFields && MetricFields.length > 1) ||
          (MetricFields &&
            MetricFields[0] &&
            MetricFields[0].metric_title &&
            MetricFields[0].metric_title.length > 1)
        : false;
      if (isDisable) {//NOSONAR
        return true;
      } else {
        return false;
      }
    }
  }

  function GroupByDisable(){
    if (
      chartType === "line" ||
      chartType === "stackedbar" ||
      chartType === "groupedbar" ||
      chartType === "pie" ||
      chartType === "donut"
    ){
      let isDisable = false;

      if (MetricFields && MetricFields.length > 0) {
        const allHaveSingleMetricTitle = MetricFields.every(
          (field) => field.metric_title && field.metric_title.length === 1
        );
  console.log(allHaveSingleMetricTitle,"1")
        if (allHaveSingleMetricTitle) {
          const firstMetricName = MetricFields[0].metric_title[0].name;
          const allNamesMatch = MetricFields.every(
            (field) => field.metric_title[0].name === firstMetricName
          );
  console.log(allNamesMatch,"2",MetricFields,firstMetricName)
          isDisable = !allNamesMatch;
        } else {
          isDisable = true;
        }
      } else {
        isDisable = true;
      }
      console.log(isDisable,"isdisable")
      return isDisable;
     
    }
    else{
      let isDisable = isInstrument
      ? (metricTitle && metricTitle.length > 1) ||
        instDisable ||
        (MetricFields && MetricFields.length > 1) ||
        (MetricFields &&
          MetricFields[0] &&
          MetricFields[0].metric_title &&
          MetricFields[0].metric_title.length > 1)
      : false;
    return isDisable;
    }
  }

    
  
    const isInstrumentRender = () => {//NOSONAR
        if (chartType === 'line' || chartType === 'stackedbar' || chartType === "groupedbar"  || chartType === 'donut' || chartType === 'correlogram') {
       

          return (

                <React.Fragment>
                    {
                        MetricFields.map((val, i) => {
                            return (
                             
                                    <Grid key={val.field} container spacing={2} style={{ marginBottom: 4 }}>
                                        <Grid item xs={6}>
                                            <SelectBox
                                                auto={true}
                                                label={'Instrument'}
                                                placeholder={t("selectInstrument")}
                                                id={"entityInstru" + (val.field)}
                                                options={props.instrumentListData ? props.instrumentListData : []}
                                                isMArray={true}
                                                keyId="id"
                                                keyValue="name"
                                                dynamic={MetricFields}
                                                value={val.instrument_id ? val.instrument_id : ''}
                                                onChange={(e, row) => handleMultiInstrumentChange(e, row, val.field)}
                                            />
                                        </Grid>
                                        <Grid item xs={MetricFields.length !== 1 ? 5 : 6}>
                                            <SelectBox
                                                auto={true}
                                                label={'Metric'}
                                                id={"entityMet" + (val.field)}
                                                placeholder={t("SelectMetric")}
                                                options={val.metOpt}
                                                isMArray={true}
                                                limitTags={2}
                                                multiple
                                                keyId="name"
                                                keyValue="title"
                                                dynamic={MetricFields}
                                                value={val.metric_title ? val.metric_title : []}
                                                error={val.error ? true : false}
                                                msg={ chartType === 'correlogram' ? 'You can select up to 5 metrics only' : 'You can select up to 10 metrics only'}
                                                info={chartType === 'correlogram' ? 'Please select min of 2 metric with same freq.' : ''}
                                                onChange={(e, row) => handleMultiMetricChange(e, row, val.field)}
                                            />
                                        </Grid>
                                        {MetricFields.length !== 1 && <Grid item xs={1} style={{ display: "flex",justifyContent:"center", alignItems: "center", marginTop:12 }}>
                                            {
                                                MetricFields.length !== 1 && (
                                                    <Button type="ghost" danger icon={Delete} stroke={theme.colorPalette.genericRed} onClick={() => removeRow(val.field)} />
                                                )
                                            }
                                        </Grid>
                                        }
                           
                                    </Grid>
                              
                              
                            )
                        })
                    }
                    {
                        MetricFields.map(((val, i) => {
                            return (
                               <div  key={val.field}>
                                            {
                                                MetricFields.length - 1 === i &&
                                                (
                                                    <div className='float-right py-3' >
                                                        <Button
                                                            // type={"ghost"}
                                                            type={'tertiary'}
                                                            // style={{ borderWidth: '1px', borderColor: 'rgb(0 144 255 / var(--tw-text-opacity))'}}
                                                            value={t("Add Instrument")}
                                                            icon={Plus}
                                                            onClick={() => addRow()}
                                                            disabled={MetricFields.length >= 8}></Button>
                                                    </div>
                                                )
                                            }</div>
                            )
                        }))

                    }
           
                </React.Fragment>
             
            )
        } else if(chartType === 'pie'){
          return (

            <React.Fragment>
                {
                    MetricFields.map((val, i) => {
                        return (
                         
                                <Grid key={val.field} container spacing={2} style={{ marginBottom: 4 }}>
                                    <Grid item xs={6}>
                                        <SelectBox
                                            auto={true}
                                            label={'Instrument'}
                                            placeholder={t("selectInstrument")}
                                            id={"entityInstru" + (val.field)}
                                            options={props.instrumentListData ? props.instrumentListData : []}
                                            isMArray={true}
                                            keyId="id"
                                            keyValue="name"
                                            dynamic={MetricFields}
                                            value={val.instrument_id ? val.instrument_id : ''}
                                            onChange={(e, row) => handleMultiInstrumentChange(e, row, val.field)}
                                        />
                                    </Grid>
                                    <Grid item xs={MetricFields.length !== 1 ? 5 : 6}>
                                        <SelectBox
                                            auto={true}
                                            label={'Metric'}
                                            id={"entityMet" + (val.field)}
                                            placeholder={t("SelectMetric")}
                                            options={val.metOpt}
                                            isMArray={true}
                                            limitTags={2}
                                            multiple
                                            keyId="title"
                                            keyValue="title"
                                            dynamic={MetricFields}
                                            value={val.metric_title ? val.metric_title : []}
                                            error={val.error ? true : false}
                                            msg={ chartType === 'correlogram' ? 'You can select up to 5 metrics only' : 'You can select up to 10 metrics only'}
                                            info={chartType === 'correlogram' ? 'Please select min of 2 metric with same freq.' : ''}
                                            onChange={(e, row) => handleMultiMetricChange(e, row, val.field)}
                                        />
                                    </Grid>
                                    {MetricFields.length !== 1 && <Grid item xs={1} style={{ alignContent: "center" }}>
                                        {
                                            MetricFields.length !== 1 && (
                                                <Button type="ghost" danger icon={Delete} stroke={theme.colorPalette.genericRed} onClick={() => removeRow(val.field)} />
                                            )
                                        }
                                    </Grid>
                                    }

                                </Grid>

                          
                        )
                    })
                }
                {
                    MetricFields.map(((val, i) => {
                        return (
                           <div  key={val.field}>
                                        {
                                            MetricFields.length - 1 === i &&
                                            (
                                                <div className='float-right py-3' >
                                                    <Button
                                                        // type={"ghost"}
                                                        type={'tertiary'}
                                                        // style={{ borderWidth: '1px', borderColor: 'rgb(0 144 255 / var(--tw-text-opacity))'}}
                                                        value={t("Add Instrument")}
                                                        icon={Plus}
                                                        onClick={() => addRow()}
                                                        disabled={MetricFields.length >= 8}></Button>
                                                </div>
                                            )
                                        }</div>
                        )
                    }))

                }

            </React.Fragment>

        )
        }
       else {
            return (
                <>
                    <SelectBox
                        auto={true}
                        id="subnode-Instru"
                        options={chartType === 'Status' && props.instrumentListData ? (props.instrumentListData.filter(obj =>
                            obj.instruments_metrics.some(metricObj =>
                                metricObj.metric.metric_datatype === 1 || metricObj.metric.metric_datatype === 4
                            )
                        )) : (props.instrumentListData ? props.instrumentListData : [])}
                        isMArray={true}
                        keyId='id'
                        keyValue='name'
                        label={t('Instruments')}
                        value={instrumentID}
                        onChange={handleInstrumentSelect}
                    />
                    <div className='mb-3'/>
                    <SelectBox
                        id="subnode-Met"
                        options={!instrumentMetricListLoading && !instrumentMetricListError && instrumentMetricListData ? instrumentMetricListData[0].metOpt : []}
                        optionloader={instrumentMetricListLoading}
                        auto={true}
                        isMArray={true}
                        multiple={(chartType === 'dialgauge' || chartType === 'dialgauge2' || chartType === 'fillgauge' || textConvert || chartType === 'singleText') ? false : true}
                        keyId='title'
                        keyValue='title'
                        label={t('Metric')}
                        value={(chartType === 'dialgauge' || chartType === 'dialgauge2' || chartType === 'fillgauge' || textConvert || chartType === 'singleText') ? metricTitleValue : metricTitle}
                        error={Error ? true : false}
                        msg={(chartType === 'energymeter') ? 'You can select up to 5 metrics only' : 'You can select up to 10 metrics only'}
                        
                        onChange={(e, option) => handleMetricSelect(e, option, (chartType === 'dialgauge' || chartType === 'dialgauge2' || chartType === 'fillgauge' || textConvert || chartType === 'singleText') ? false : true)}
                    />
                </>
            )
        }
  
  
    }
    
    


    const handleclick = (type) => {
        if (type === 'accordian1') {
            setAccordian1(!accordian1)
            setAccordian2(false)
        }
        else if (type === 'accordian2') {
            setAccordian1(false)
            setAccordian2(!accordian2)

        }
        else if (type === 'singleaccordian') {
            setAccordian1(!accordian1)
            if(accordian1){
                setArcColor({
                    Arc1color: Arc1color.current && Arc1color.current.value ? Arc1color.current.value : "#88B056",
                    Arc2color: Arc2color.current && Arc2color.current.value ? Arc2color.current.value : "#FFD121",
                    Arc3color: Arc3color.current && Arc3color.current.value ? Arc3color.current.value : "#DF3B44"
                })
            }else{
                    
                 setTimeout(() => {
                    Arc1color.current.value = ArcColor.Arc1color
                    Arc2color.current.value = ArcColor.Arc2color
                    Arc3color.current.value = ArcColor.Arc3color
                }, 1000)
            }
            
           

        }

    }

    const AccordianDisplay = () => { //NOSONAR

        if (chartType === 'line' || chartType === 'area' || chartType === 'bar') {

            return (
                <>

                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('accordian1')} >
                        <React.Fragment>
                            <div style={{ paddingBottom: 12 }}>
                                {

                                    <React.Fragment>
                                        <CustomSwitch id={"switch"} switch={true} checked={customYaxis} onChange={(e) => setCustomYaxis(e.target.checked)}
                                            secondaryLabel={t('Y-Axis range')} size="small" />
                                        {customYaxis && (
                                            <div>
                                                <br />
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <InputFieldNDL placeholder="From" inputRef={yaxisFromRef} NoMinus />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <InputFieldNDL placeholder="To" inputRef={yaxisToRef} NoMinus />
                                                    </Grid>

                                                </Grid></div>   
                                            )} 
                                        </React.Fragment>
                                    }              
                                    </div> 
                        <div style={{paddingBottom: 12}}> 
                            <SelectBox 
                                id="subnode"
                                options={decimalPointsList}
                                isMArray={true} 
                                keyId='id'
                                keyValue='name'
                                label={t('Decimal Points')} 
                                value={decimalPoint}
                                onChange={(e)=>setDecimalPoint(e.target.value)}
                            />  
                        </div>
                        <div style={{paddingBottom: 12}}> 
                            <SelectBox 
                                id="subnode"
                                options={aggregationList}
                                isMArray={true} 
                                keyId='id'
                                keyValue='name'
                                label={t('Aggregation')} 
                                value={aggregation}
                                onChange={(e)=>setAggregation(e.target.value)}
                                // disabled={isInstrument ? (metricTitle && metricTitle.length > 1) || instDisable || (MetricFields && MetricFields.length > 1) || (MetricFields && MetricFields[0] && MetricFields[0].metric_title && MetricFields[0].metric_title.length > 1) : false}
                                disabled={AggregationDisable()}
                            />  
                        </div>
                        
                        <div style={{paddingBottom: 12}}> 
                            <SelectBox 
                                id="subnode"
                                options={groupbyList}
                                isMArray={true} 
                                keyId='id'
                                keyValue='name'
                                label={t('Group by')} 
                                value={groupBy}
                                onChange={(e)=>setGroupBy(e.target.value)}
                                disabled={GroupByDisable()}
                            />  
                        </div>
                        <div className="flex gap-2 items-center" style={{justifyContent:'space-between',paddingBottom: 12,paddingTop: 10}}>
                            <div className="flex flex-col gap-0.5">
                                <Typography variant="sm-label-text-01">{t('Show Data Stats')}</Typography>
                            </div>  
                            <CustomSwitch switch={true} checked={isdataStats} onChange={(e)=>setDataStats(e.target.checked)} primaryLabel={''} size="large" disabled={((metricTitle && metricTitle.length > 1) || instDisable || (MetricFields && MetricFields.length > 1) || (MetricFields && MetricFields[0] && MetricFields[0].metric_title && MetricFields[0].metric_title.length > 1) ) && isInstrument}/>      
                        </div>
                        
                    </React.Fragment>
                </AccordianNDL1> 
                <AccordianNDL1 title={t('Data Display Styles')} isexpand={accordian2} multiple  managetoggle={()=>handleclick('accordian2')} >
                    <React.Fragment>
                    <SelectBox 
                                id="subnode"
                                options={tooltipSortList}
                                isMArray={true}
                                keyId='id'
                                keyValue='name'
                                label={"Tooltip Sorting"}
                                value={MetricFields &&
                                    MetricFields.length === 1 &&
                                    MetricFields[0].metric_title &&
                                    MetricFields[0].metric_title.length <= 1 ? "none" : tooltipSort}
                                onChange={(e) => setTooltipSort(e.target.value)}
                                disabled={(
                                    MetricFields &&
                                    MetricFields.length === 1 &&
                                    MetricFields[0].metric_title &&
                                    MetricFields[0].metric_title.length <= 1
                                ) || tooltipDisable}
                            />  
                        <div className="flex gap-2 items-center" style={{justifyContent:'space-between',paddingBottom: 12,paddingTop: 10}}>
                            <div className="flex flex-col gap-0.5">
                                <Typography variant="sm-label-text-01">{t('Show Data Label')}</Typography>
                            </div>                       
                            <CustomSwitch switch={true} checked={isLabel} onChange={(e)=>setIsLabel(e.target.checked)} 
                                primaryLabel={''} size="large"  />          
                        </div> 
                        <div className="flex gap-2 items-center" style={{justifyContent:'space-between'}}>
                            <div className="flex flex-col ">
                                <Typography variant="sm-label-text-01">{t('Show Alarm Levels (If any)')}</Typography>
                            </div>          
                            <CustomSwitch switch={true} checked={isShowAlarm} onChange={(e)=>setIsShowAlarm(e.target.checked)} 
                                primaryLabel={''} size="large" disabled={isInstrument ?(metricTitle && metricTitle.length > 1) || instDisable || (MetricFields && MetricFields.length > 1) || (MetricFields && MetricFields[0] && MetricFields[0].metric_title && MetricFields[0].metric_title.length > 1) || disable : false}/>  
                               
                        </div> 
                        {disable && 
                        <span className="font-geist-sans" style={{ color: "#FF0D00",fontSize: '0.75rem',fontWeight:400 }}>
                {'There is no alert for the selected metric'}
                </span>}        
                    </React.Fragment>
                </AccordianNDL1>
                </>
            )
        }
        else if (chartType === 'stackedbar' || chartType === "groupedbar" || chartType === 'combobar' ) {

            return (
                <>
                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('accordian1')} >

                        <React.Fragment>
                          {
                            chartType !== 'combobar' ? 
                            <div style={{ paddingBottom: 12 }}>
                                {

                                    <React.Fragment>
                                        <CustomSwitch id={"switch"} switch={true} checked={customYaxis} onChange={(e) => setCustomYaxis(e.target.checked)}
                                            secondaryLabel={t('Y-Axis range')} size="small" />
                                        {

                                            <div style={{ display: customYaxis ? 'block' : 'none' }}>
                                                <br />
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <InputFieldNDL placeholder="From" inputRef={yaxisFromRef} NoMinus />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <InputFieldNDL placeholder="To" inputRef={yaxisToRef} NoMinus />
                                                    </Grid>

                                                </Grid></div>
                                        }
                                    </React.Fragment>
                                }
                            </div>
                            : <></>
                          }
                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={decimalPointsList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Decimal Points')}
                                    value={decimalPoint}
                                    onChange={(e) => setDecimalPoint(e.target.value)}
                                />
                            </div>
                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={aggregationList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Aggregation')}
                                    value={aggregation}
                                    onChange={(e) => setAggregation(e.target.value)}
                                    disabled={chartType === 'combobar' ? false : AggregationDisable()}
                                />
                            </div>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={groupbyList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Group by')}
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    disabled={chartType === 'combobar' ? false : GroupByDisable()}
                                />
                            </div>


                        </React.Fragment>
                    </AccordianNDL1>
                    <AccordianNDL1 title={t('Data Display Styles')} isexpand={accordian2} multiple managetoggle={() => handleclick('accordian2')}>
                        <React.Fragment>
                            <SelectBox
                                id="subnode"
                                options={tooltipSortList}
                                isMArray={true}
                                keyId='id'
                                keyValue='name'
                                label={"Tooltip Sorting"}
                                value={MetricFields &&
                                    MetricFields.length === 1 &&
                                    MetricFields[0].metric_title &&
                                    MetricFields[0].metric_title.length <= 1 ? "none" : tooltipSort}
                                onChange={(e) => setTooltipSort(e.target.value)}
                                disabled={(
                                    MetricFields &&
                                    MetricFields.length === 1 &&
                                    MetricFields[0].metric_title &&
                                    MetricFields[0].metric_title.length <= 1
                                ) || tooltipDisable}
                            />  
                        <div className="flex gap-2 items-center" style={{justifyContent:'space-between',paddingBottom: 12,paddingTop: 10}}>
                            <div className="flex flex-col gap-0.5">
                                <Typography variant="sm-label-text-01">{t('Show Data Label')}</Typography>
                            </div>                       
                            <CustomSwitch switch={true} checked={isLabel} onChange={(e)=>setIsLabel(e.target.checked)} 
                                primaryLabel={''} size="large"  />          
                        </div> 
                        
                    </React.Fragment>
                </AccordianNDL1> </>
            )
        }
        else if (chartType === 'pie' || chartType === 'donut') {
            return (
            
                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('singleaccordian')}>
                        <React.Fragment>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={decimalPointsList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Decimal Points')}
                                    value={decimalPoint}
                                    onChange={(e) => setDecimalPoint(e.target.value)}
                                />
                            </div>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={aggregationList?.filter((x) => x.id !== 'none')}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Aggregation')}
                                    value={aggregation}
                                    onChange={(e) => setAggregation(e.target.value)}
                                    // disabled={false}
                                    disabled={(isMultiMetric && chartType === 'pie') ? true : false}
                                />
                            </div>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={groupbyList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Group by')}
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                    disabled={GroupByDisable()}
                                />
                            </div>

                            {
                               (chartType === 'pie') && (
                                  <div
                                    className="flex gap-2 items-center"
                                    style={{
                                      justifyContent: "space-between",
                                      paddingBottom: 10,
                                      paddingTop: 10,
                                    }}
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      <Typography variant="sm-label-text-01">
                                        {"Show Data Label"}
                                      </Typography>
                                    </div>
                                    <CustomSwitch
                                      switch={true}
                                      checked={showDate}
                                      onChange={(e) => setShowDate(e.target.checked)}
                                      primaryLabel={""}
                                      size="small"
                                    />
                                  </div>
                              )
                            }


                        </React.Fragment>
                    </AccordianNDL1>
              
            )
        }
        else if (chartType === 'dialgauge' || chartType === 'dialgauge2' || chartType === 'fillgauge') {
            return (
           
                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('singleaccordian')}>
                        <React.Fragment>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={decimalPointsList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Decimal Points')}
                                    value={decimalPoint}
                                    onChange={(e) => setDecimalPoint(e.target.value)}
                                />
                            </div>
                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={aggregationList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Aggregation')}
                                    value={aggregation}
                                    onChange={(e) => setAggregation(e.target.value)}
                                    disabled={AggregationDisable()}
                                />
                            </div>

                            <div style={{ paddingBottom: 12 }}>
                                <Typography variant="Caption1"  value={"Arc Color"} />
                                <div>
                                   <Grid container spacing={4}>
                                    <Grid xs={5} >
                                    <InputFieldNDL
                                                id="arc1-length"
                                                type={'number'}
                                               
                                                label={t("Minimum")}
                                                 value={arc1Min}
                                                  arrow
                                                  NoMinus
                                            onChange={handleArc1Min}
                        
                                            />
                                  </Grid>
                                  <Grid xs={5} >
                                  <InputFieldNDL
                                                id="arc1-length"
                                                type={'number'}
                                                value={arc1Max}
                                                onChange={handleArc1Max}
                                                onBlur={handleArc1MaxBlur}
                                                label={t("Maximum")}
                                                arrow
                                                NoMinus
                                                helperText={arc1Max === 0 ? "Please Enter value Above 0" : ""}
                                                error={arc1Max === 0 ? true : false}

                                            />
                                  </Grid> 
                                  <Grid xs={2} >
                                          <TypographyNDL value="Color" variant='paragraph-xs' />
                                    <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                                    <InputFieldNDL
                                                id="arc1-length"
                                                type={'color'}
                                             
                                                value={dynamicColor.level1_color}
                                                onChange={(e) => handleDynamicColorChange("level1_color", e.target.value)}
                                               dynamic={MetricFields}
                                            />
                                           </div> 

                   
                                           
                                  </Grid>
                                 
                                  <Grid xs={5} >
                                  <InputFieldNDL
                                                id="arc1-length"
                                                type={'number'}
                                                value={arc1Max}
                                                label={t("Minimum")}
                                                disabled
                                            />
                                  </Grid>
                                  <Grid xs={5} >
                                  <InputFieldNDL
                                                id="arc1-length"
                                                type={'number'}
                                                value={arc2Max}
                                                arrow
                                                 NoMinus
                                                onChange={handleArc2Max}
                                              
                                                label={t("Maximum")}

                                            />
                                  </Grid> 
                                  <Grid xs={2} >
 <TypographyNDL value="Color" variant='paragraph-xs' />
 <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                                  <InputFieldNDL
                                                id="arc2-length"
                                                type={'color'}
                                          
                                                value={dynamicColor.level2_color}
                                          
                                                onChange={(e) => handleDynamicColorChange("level2_color", e.target.value)}
                                             dynamic={MetricFields}
                                            />
                                             </div>
                                  </Grid>
                                
                                  <Grid xs={5} >
                                  <InputFieldNDL
                                                    id="arc1-length"
                                                 
                                                      value={arc2Max}
                                                  onChange={handleArc2Max}
                                                onBlur={handleArc2MaxBlur}
                                                label="Minimum"
                                                disabled
                                                />
                                  </Grid>
                                  <Grid xs={5} >
                                  <InputFieldNDL
                                                    id="arc1-length"
                                                    type={'number'}
                                                    value={arc3Max}
                                                    onChange={handleArc3Max}
                                                
                                                    label={t("Maximum")}
                                                    arrow
                                                    NoMinus
                                                />
                                  </Grid> 
                                  <Grid xs={2} >
   <TypographyNDL value="Color" variant='paragraph-xs' />
   <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                                  <InputFieldNDL
                                                id="arc3-length"
                                                type={'color'}
                                               
                                                 value={dynamicColor.level3_color}
                                                onChange={(e) => handleDynamicColorChange("level3_color", e.target.value)}

                                               dynamic={MetricFields}
                                            />
                                            </div>
                                  </Grid>
                                  
                                   </Grid>
                                 
                                </div>
                            </div>

                        </React.Fragment>
                    </AccordianNDL1>
               
            )
        }
        else if (chartType === 'Table') {
            return (
             
                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('singleaccordian')}>
                        <React.Fragment>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={decimalPointsList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Decimal Points')}
                                    value={decimalPoint}
                                    onChange={(e) => setDecimalPoint(e.target.value)}
                                />
                            </div>
                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={aggregationList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={<span>Aggregation<span style={{ color: 'red' }}>*</span></span>}
                                    value={aggregation}
                                    onChange={(e) => setAggregation(e.target.value)}
                                    disabled={isMultiMetric ? true : false}
                                />
                            </div>

                        </React.Fragment>
                    </AccordianNDL1>
              
            )

        }
        else if (chartType === 'singleText') {
            return (
                <>
                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('accordian1')}>
                        <React.Fragment>

                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={decimalPointsList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Decimal Points')}
                                    value={decimalPoint}
                                    onChange={(e) => setDecimalPoint(e.target.value)}

                                />
                            </div>
                            <div style={{ paddingBottom: 12 }}>
                                <SelectBox
                                    id="subnode"
                                    options={aggregationList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Aggregation')}
                                    value={aggregation}
                                    onChange={(e) => setAggregation(e.target.value)}
                                    disabled={AggregationDisable()}
                                />
                            </div>


                        </React.Fragment>
                    </AccordianNDL1>
                    <AccordianNDL1 title={t('Data Display Styles')} isexpand={accordian2} multiple managetoggle={() => handleclick('accordian2')}>
                        <React.Fragment>
                            <div style={{ paddingBottom: 12 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <SelectBox
                                            id="subnode"
                                            options={displayStyleList}
                                            isMArray={true}
                                            keyId='id'
                                            keyValue='name'
                                            label={"Display Style"}
                                            value={displayStyleValue}
                                            onChange={(e) => setDisplayStyleValue(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <SelectBox
                                            id="subnode"
                                            options={fontVariantList}
                                            isMArray={true}
                                            keyId='id'
                                            keyValue='name'
                                            label={"Font Variant"}
                                            value={fontVariantValue}
                                            onChange={(e) => setFontVariantValue(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>


                            </div>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <SelectBox
                                        id="subnode"
                                        options={textAlignList}
                                        isMArray={true}
                                        keyId='id'
                                        keyValue='name'
                                        label={"Text Align"}
                                        value={textAlignValue}
                                        onChange={(e) => setTextAlignValue(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <SelectBox
                                        id="subnode"
                                        options={textSizeList}
                                        isMArray={true}
                                        keyId='id'
                                        keyValue='name'
                                        label={"Text Size"}
                                        value={textSizeValue}
                                        onChange={(e) => setTextSizeValue(e.target.value)}
                                    />

                                </Grid>
                                <Grid item xs={4}>
                                        <InputFieldNDL
                                            id="arc1-length"
                                            type={'color'}
                                            label={t('Color')}
                                            inputRef={Color}
                                        />
                                    
                                </Grid>

                            </Grid>


                        </React.Fragment>
                    </AccordianNDL1>

                </>
            )
        }
        else if (chartType === 'correlogram'){
          return (
           
              <AccordianNDL1 title={t('Data Display Style')} isexpand={accordian2} multiple managetoggle={() => handleclick('accordian2')}>
                        <React.Fragment>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                  {/* <InputFieldNDL
                                      id="arc1-length"
                                      type={'color'}
                                      label={t('Color')}
                                      inputRef={Color}
                                  /> */}

                                  <SelectBox
                                        id="subnode"
                                        options={colour}
                                        isMArray={true}
                                        keyId='id'
                                        keyValue='name'
                                        label={"Color Scheme"}
                                        value={corrColour}
                                        onChange={(e) => setCorrColour(e.target.value)}
                                    />
                                    
                                </Grid>

                            </Grid>


                        </React.Fragment>
                    </AccordianNDL1>
           
          )
        }
        else if (chartType === 'Text') {
            return (
             
                    <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('singleaccordian')}>
                        <React.Fragment>
                            <div style={{ paddingBottom: 12 }}>

                                <InputFieldNDL
                                    id="title"
                                    label={"Font Variant"}
                                    value={"Default"}
                                    disabled={true}
                                />
                            </div>
                            <Grid container spacing={1}>
                                <Grid item xs={3}>
                                    <SelectBox
                                        id="subnode"
                                        options={textAlignList}
                                        isMArray={true}
                                        keyId='id'
                                        keyValue='name'
                                        label={"Text Align"}
                                        value={textAlignValue}
                                        onChange={(e) => setTextAlignValue(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectBox
                                        id="subnode"
                                        options={textSizeList}
                                        isMArray={true}
                                        keyId='id'
                                        keyValue='name'
                                        label={"Text Size"}
                                        value={textSizeValue}
                                        onChange={(e) => setTextSizeValue(e.target.value)}
                                    />

                                </Grid>
                                <Grid item xs={3}>
                                        <InputFieldNDL
                                            id="arc1-length"
                                            type={'color'}
                                            label={t('Color')}
                                            inputRef={Color}
                                        />
                                </Grid>
                                <Grid item xs={3}>
                                        <InputFieldNDL
                                            id="arc1-length"
                                            type={'color'}
                                            label={"Background Color"}
                                            inputRef={BackgroundColor}
                                        />
                                </Grid>
                            </Grid>

                        </React.Fragment>
                    </AccordianNDL1>
             
            )
        } else if (chartType === 'clock') {

            return (
            <div class="mt-3">
 <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('singleaccordian')} >
                        <React.Fragment>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <SelectBox
                                        id="subnode"
                                        options={clockFontOptions}
                                        isMArray={true}
                                        keyId='id'
                                        keyValue='name'
                                        label={"Font Variant"}
                                        value={clockFont}
                                        onChange={(e) => setClockFont(e.target.value)}
                                    />

                                </Grid>
                            </Grid>

                        </React.Fragment>
                    </AccordianNDL1>
             
            </div>
               
            )
        } else if (chartType === 'energymeter') {
            return (
             
             <AccordianNDL1 title={t('Data Display Options')} isexpand={accordian1} multiple managetoggle={() => handleclick('accordian1')} >
                        <React.Fragment>
                            <div style={{ paddingBottom: 10 }}>
                                <SelectBox
                                    id="subnode"
                                    options={decimalPointsList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Decimal Points')}
                                    value={decimalPoint}
                                    onChange={(e) => setDecimalPoint(e.target.value)}
                                />
                            </div>
                            <div style={{ paddingBottom: 10 }}>
                                <SelectBox
                                    id="subnode"
                                    options={aggregationList}
                                    isMArray={true}
                                    keyId='id'
                                    keyValue='name'
                                    label={t('Aggregation')}
                                    value={aggregation}
                                    onChange={(e) => setAggregation(e.target.value)}
                                    // disabled={isInstrument ? (metricTitle && metricTitle.length > 1) || instDisable || (MetricFields && MetricFields.length > 1) || (MetricFields && MetricFields[0] && MetricFields[0].metric_title && MetricFields[0].metric_title.length > 1) : false}
                                    disabled={AggregationDisable()}
                                />
                            </div>
                        </React.Fragment>
                    </AccordianNDL1>
            )
        }
    }


    const moveCard = (dragIndex, hoverIndex) => {
        // console.log(dragIndex, hoverIndex)
        let fromIndex = dragIndex;
        let toIndex = hoverIndex;

        let arr = MetricFields;
        const element = arr.splice(fromIndex, 1)[0];
        arr.splice(toIndex, 0, element);
        arr = arr.map((x, i) => {
            return { ...x, field: i + 1 }
        })
        setMetricFields(arr)
    

    }
    const handleOptionChange = (e) => {
        const selectedValue = e.target.value;
        setOptionType(selectedValue);
    };
    const handleChange = (val, index, key) => {
   
        let updatedStatus=[...multiStatus]
        updatedStatus[index][key] = val;
        setMultiStatus(updatedStatus);
    };
    

    const handleAddRow = () => {
        if(multiStatus.length < 15){
            setMultiStatus([...multiStatus, { multiPossitiveText: "", multiPossitiveValue: "", multiPossitiveColor: "" }])
        }
       
    }
    const handleDeleteRow = (index) => {
        setMultiStatus(multiStatus.filter((_, i) => i !== index));
    };

    const RangeGeter=(e)=>{
      setselectedRange(e)
    }

    return (
        
    <React.Fragment>
      <Toast
        type={type}
        message={message}
        toastBar={openSnack}
        handleSnackClose={() => setOpenSnack(false)}
      ></Toast>
      <ModalHeaderNDL>
        <Typography
          variant="heading-02-xs"
          model
          value={isEdit ? t("EditGraph") : "Add Graph"}
        />
      </ModalHeaderNDL>
      <ModalContentNDL>
        <div style={{ paddingBottom: 12 }}>
          <SelectBox
            id="subnode"
            options={widgetList}
            isMArray={true}
            keyId="id"
            keyValue="name"
            label={t("ChartT")}
            mandatory={true}
            auto
            value={chartType}
            onChange={(e) => changeChartType(e)}
          />
        </div>
        {chartType !== "Text" &&
          chartType !== "Image" &&
          chartType.length > 0 && (
            <React.Fragment>
              <div style={{ paddingBottom: 12 }}>
                <InputFieldNDL
                  label={"Title"}
                  mandatory={true}
                  placeholder={t("Enter Title")}
                  inputRef={nameRef}
                  maxLength={"250"}
                  helperText={'Max of 250 character'}
                />
              </div>
              {
               selectedDashboard &&  selectedDashboard.length > 0 && selectedDashboard[0].datepicker_type === 'widgetpicker' && !['Image',"weather",'video',"clock","Text"].includes(chartType) && 
               <div className="flex flex-col gap-0.5 w-full">
             <TypographyNDL value={"DateRange"} variant='paragraph-xs' />
               <EditPicker selectedRange={selectedRange} RangeGeter={(e)=>{RangeGeter(e)}} />
       </div>
           
             }
             
             
            </React.Fragment>
          


          )}


        {chartType === "dialgauge" && (
          <Typography
            variant="paragraph-xs"
            color="tertiary"
            value={t("This Gauge will support value less then 100 ")}
          />
        )}

        {chartType === "Text" && (
    
            <div style={{ paddingBottom: 12 }}>
              {/* <InputFieldNDL label={'Text'}  placeholder={t("Enter Text")} inputRef={textContent} /> */}
              <InputFieldNDL
                label={"Text"}
                maxRows={5}
                inputRef={textContent}
                multiline={true}
                placeholder={t("Enter Text")}
              />
            </div>
       
        )}
        {chartType === "Image" && (
       
            <div style={{ paddingBottom: 12 }}>
              <Typography variant="paragraph-xs" value={t("image")} />
              <div 
                    className={"bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark mt-2.5"}
                    style={{
                      ...classes.ImageDiv,
                      cursor: "pointer", 
                      position: "relative", 
                    }}
                    
                    >
                <input
                  style={{
                    top: "0px",
                    cursor: "text !important",
                    height: "100%",
                    opacity: "0",
                    zIndex: "1",
                    position: "absolute",
                    width: "100%",
                    left: "0",
                    cursor: "pointer",
                  }}
                  type="file"
                  multiple
                  onChange={handleImageField}
                ></input>
                <Typography
                  variant="sm-heading-02"
                  value={t("Choose File")}
                  style={{ width: "35%" }}
                />
                {images.map((image, index) => (
                  <Image
                    // className={"bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark"}
                    key={index}
                    src={image.src}
                    alt={`selected-img-${index}`}
                    style={{ height: "100px", width: "100px", margin: "5px" }}
                  />
                ))}
                {/* <Typography variant="sm-heading-02" value={t('Choose File')} style={{width:"35%"}}/> */}
              </div>
            </div>
       
        )}
        {(chartType === "line" ||
          chartType === "stackedbar" ||
          chartType === "correlogram" ||
          chartType === "bar" ||
          chartType === "area" ||
          chartType === "singleText" ||
          chartType === "dialgauge" ||
          chartType === "dialgauge2" ||
          chartType === "fillgauge" ||
          chartType === "gauge" ||
          chartType === "Status") && (
       
            <div style={{ paddingBottom: 12 }}>
              <div className="mb-3" style={{ margin: "5px 0px 5px 0px" }}>
               {chartType !== 'correlogram' && <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={t("Instrument")}
                      labelText={t("Instrument")}
                      id={"Instrument"}
                      checked={isInstrument}
                      onChange={handleInstrumentSwitch}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={t("Virtual Instrument")}
                      labelText={t("Virtual Instrument")}
                      id={"Virtual Instrument"}
                      checked={!isInstrument}
                      onChange={handleInstrumentSwitch}
                    />
                  </Grid>
                </Grid>}
              </div>

              <div style={{ paddingBottom: 12 }}>
                {
                  chartType !== 'correlogram' ? <>
                      {isInstrument && isInstrumentRender()}
                      {!isInstrument && (
                        <SelectBox
                          id="subnode-VI"
                          options={
                            props.virtualInstrumentListData
                              ? props.virtualInstrumentListData
                              : []
                          }
                          isMArray={true}
                          keyId="id"
                          keyValue="name"
                          label={t("Virtual Instrument")}
                          value={virtualInstrumentID}
                          onChange={handleVirtualInstrument}
                          auto
                          multiple={false}
                          checkbox={false}
                        />
                      )}
                      </>
                      : <>{ isInstrumentRender() }  
                  
                      </>
                }
              </div>

              {/* <div style={{ paddingBottom: 12 }}>
                  <SelectBox
                      id="subnode"
                      options={aggregationList.filter((x) => x.id !== 'none')}
                      isMArray={true}
                      keyId='id'
                      keyValue='name'
                      label={t('Aggregation')}
                      value={aggregation}
                      onChange={(e) => setAggregation(e.target.value)}
                      disabled={AggregationDisable()}
                  />
              </div> */}
            </div>
         
        )}
        {
          (chartType === 'groupedbar') && (
        
            <div style={{ paddingBottom: 12 }}>
              {/* <CustomSwitch id={"switch"} switch={true} checked={isInstrument} onChange={handleInstrumentSwitch} primaryLabel={t('Virtual Instrument')} secondaryLabel={t('Instrument')} size="small" /> */}
              <div className="mb-3" style={{ margin: "5px 0px 5px 0px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={t("Instrument")}
                      labelText={t("Instrument")}
                      id={"Instrument"}
                      checked={isInstrument}
                      onChange={handleInstrumentSwitch}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={t("Virtual Instrument")}
                      labelText={t("Virtual Instrument")}
                      id={"Virtual Instrument"}
                      checked={!isInstrument}
                      onChange={handleInstrumentSwitch}
                    />
                  </Grid>
                </Grid>
              </div>

              <div style={{ paddingBottom: 12 }}>
                {isInstrument && isInstrumentRender()}
                {!isInstrument && (
                  <SelectBox
                    id="subnode-VI"
                    options={
                      props.virtualInstrumentListData
                        ? props.virtualInstrumentListData
                        : []
                    }
                    isMArray={true}
                    keyId="id"
                    keyValue="name"
                    label={t("Virtual Instrument")}
                    value={multipleVirtualInstrument}
                    onChange={(e, row) => setMultipleVirtualInstrument(e)}  
                    auto
                    multiple={true}
                    checkbox={true}
                  />
                )}
              </div>
            </div>
        
          )
        }
        {
          (chartType === 'combobar') && (
            <>
              <div className="mb-3" style={{ margin: "5px 0px 5px 0px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={"Bar Vs Line"}
                      labelText={"Bar Vs Line"}
                      id={"BarVsLine"}
                      checked={isBarVsLine}
                      onChange={() => setIsBarVsLine(true)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={"Line Vs Area"}
                      labelText={"Line Vs Area"}
                      id={"lineVsArea"}
                      checked={!isBarVsLine}
                      onChange={() => setIsBarVsLine(false)}
                    />
                  </Grid>
                </Grid>
              </div>
              
              <>
                <TypographyNDL  value="Primary Y-Axis" variant='label-02-s' style={{paddingBottom:12}}/>
                <div style={{ paddingBottom: 12 }}>
                    <SelectBox
                        auto={true}
                        id="subnode-Instru"
                        options={chartType === 'Status' && props.instrumentListData ? (props.instrumentListData.filter(obj =>
                            obj.instruments_metrics.every(metricObj =>
                                metricObj.metric.metric_datatype === 1 || metricObj.metric.metric_datatype === 4
                            )
                        )) : (props.instrumentListData ? props.instrumentListData : [])}
                        isMArray={true}
                        keyId='id'
                        keyValue='name'
                        label={t('Instruments')}
                        value={instrument1}
                        onChange={(e) => {handleInstrumentSelect(e); setIsPrimary(true); setMetric1(null); setInstrument1(e?.target?.value)}}
                    />
                    <div className='mb-3'/>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <SelectBox
                          id="subnode-Met"
                          options={primaryMetricOption.length > 0 ? primaryMetricOption : []}
                          auto={true}
                          isMArray={true}
                          multiple={false}
                          keyId='title'
                          keyValue='title'
                          label={t('Metric')}
                          value={metric1}
                          error={Error ? true : false}//NOSONAR
                          msg={chartType === 'energymeter' ? 'You can select up to 5 metrics only' : 'You can select up to 10 metrics only'}
                          onChange={(e, option) => {handleMetricSelect(e, option,  false); setMetric1(e.target.value)}}
                        />
                      </Grid>
                      <Grid item xs={6}>
                      
                        <SelectBox
                          id="subnode-chart"
                          options={isBarVsLine ? choseBarVsLineChart : choseAreaVsLineChart}
                          auto={true}
                          isMArray={true}
                          multiple={false}
                          keyId='id'
                          keyValue='name'
                          label={'Chart Type'}
                          value={chart1}
                          error={Error ? true : false}
                          msg={'You can select one metrics only'}
                          onChange={(e, option) => setChart1(e?.target.value)}
                        />
                      </Grid>
                    </Grid>
                   
                </div>
              </>

              <>
              <TypographyNDL  value="Secondary Y-Axis" variant='label-02-s' style={{ paddingBottom: 12 }}/>
                <div style={{ paddingBottom: 12 }}>
                    <SelectBox
                        auto={true}
                        id="subnode-Instru"
                        options={props.instrumentListData ? props.instrumentListData : []}//NOSONAR
                        isMArray={true}
                        keyId='id'
                        keyValue='name'
                        label={t('Instruments')}
                        value={instrument2}
                        onChange={(e) => {
                          if(instrument1 !== e.target.value){
                            handleInstrumentSelect(e); 
                            setMetric2(null)
                            setIsPrimary(false);
                            setInstrument2(e?.target?.value)
                          } else {
                            SetMessage("Already Selected as Primary Y-Axis");
                            SetType("warning");
                            setOpenSnack(true);
                        
                          }
                        }}
                    />
                    <div className='mb-3'/>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <SelectBox
                          id="subnode-Met"
                          options={secondaryMetricOption.length > 0 && instrument2 ? secondaryMetricOption : []}
                          auto={true}
                          isMArray={true}
                          multiple={false}
                          keyId='title'
                          keyValue='title'
                          label={t('Metric')}
                          value={metric2}
                          error={Error ? true : false}//NOSONAR
                          msg={chartType === 'energymeter' ? 'You can select up to 5 metrics only' : 'You can select up to 10 metrics only'}
                          onChange={(e, option) => {handleMetricSelect(e, option,  false); setMetric2(e.target.value)}}
                        />
                      </Grid>
                      <Grid item xs={6}>
                      
                        <SelectBox
                          id="subnode-chart"
                          options={isBarVsLine ? choseBarVsLineChart.filter((x) => x.id !== chart1) : choseAreaVsLineChart.filter((x) => x.id !== chart1) }
                          auto={true}
                          isMArray={true}
                          multiple={false}
                          keyId='id'
                          keyValue='name'
                          label={'Chart Type'}
                          value={chart2}
                          error={Error ? true : false}//NOSONAR
                          msg={'You can select one metrics only'}
                          onChange={(e, option) => setChart2(e?.target.value)}
                        />
                      </Grid>
                    </Grid>
                   
                </div>
              </>
            </>
          )
        }

        {
          (chartType === 'pareto') && (
            <>
              <div className="mb-3" style={{ margin: "5px 0px 5px 0px" }}>
              <TypographyNDL  value="Reason Type" variant='label-02-s' />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <RadioNDL
                      name={t("Downtime")}
                      labelText={t("Downtime")}
                      id={"Downtime"}
                      checked={isDowntime}
                      isPareto={true}
                      onChange={() => setIsDowntime(true)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                
                  </Grid>
                </Grid>
              </div>
              <div>
                <SelectBox
                  auto={true}
                  id="subnode-Instru"
                  options={AssetOption}
                  mandatory={true}
                  isMArray={true}
                  keyId='id'
                  keyValue='name'
                  label={'Asset'}
                  value={asset}
                  onChange={(e) => {console.log(e.target.value); setAsset(e?.target?.value)}}
                />
              </div>
         
            </>
          )
        }

        {
          (chartType === 'donut' || chartType === 'pie') && (
           
            <div style={{ paddingBottom: 12 }}>
              {
                chartType === 'pie' && (
                  <div className="flex gap-2 items-center" style={{justifyContent:'space-between',paddingBottom: 12,paddingTop: 10}}>
                      <div className="flex flex-col gap-0.5">
                          <Typography variant="sm-label-text-01">Enable Multi-Metric Selection</Typography>
                          <span className="font-geist-sans" style={{ color: '#A8A8A8',fontSize: '0.75rem',fontWeight:400 }}>Allows multiple metric selection for supported instruments.</span>
                      </div>                       
                      <CustomSwitch switch={true} checked={isMultiMetric} onChange={(e)=>{ 
                        setIsMultiMetric(e.target.checked); 
                        setMetricFields([{
                            field: 1,
                            instrument_id: "",
                            instrument_name: "",
                            metric_name: [],
                            metric_title: [],
                            metOpt: [],
                            TableCellColor: "#ffffff",
                          }]) 
                        }} 
                          primaryLabel={''} size="large"  />          
                  </div>
                )
              }
              {
                ((chartType === 'donut' || chartType === 'pie') && isMultiMetric) ? <>
                {/* Multi Metric Chages  */}
                  <Grid container spacing={2} style={{ marginBottom: 4 }}>
                            
                            <Grid item xs={6}>
                              <SelectBox
                                auto={true}
                                placeholder={t("selectInstrument")}
                                id={"entityInstru_Multi"}
                                options={
                                  props.instrumentListData
                                    ? props.instrumentListData?.filter((ins) => ins.instrument_type === 23)
                                    : []
                                }
                                isMArray={true}
                                keyId="id"
                                keyValue="name"
                                dynamic={MetricFields}
                                value={MetricFields?.[0]?.instrument_id}
                                onChange={(e, row) =>

                                  // console.log(e, row)
                                  handleMultiMetricInstrumentChange(e, row, 1)
                                  // handleMultiInstrumentChange(e, row, val.field)
                                }
                              />
                            </Grid>
                              
                            <Grid item xs={6}>
                              <SelectBox
                                auto={true}
                                id={"entityMet_multi"}
                                placeholder={t("SelectMetric")}
                                options={MetricFields?.[0]?.metOpt}
                                isMArray={true}
                                limitTags={2}
                                multiple
                                keyId="title"
                                keyValue="title"
                                dynamic={MetricFields}
                                value={MetricFields?.[0]?.metric_title ? MetricFields?.[0]?.metric_title : []}
                                // error={val.error ? true : false}
                                msg={"You can select up to 1 metric only"}
                                onChange={(e, row) => 

                                  // console.log(e, row)
                                  handleMultipleMetricChange(e, row, 1,true)
                                }
                              />
                            </Grid>
                          </Grid>
                </> : <>
              
              {/* // Not a Multimetric (NORMAL TABLE WIDGET)  */}
                <div className="mb-3" style={{ margin: "5px 0px 5px 0px" }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <RadioNDL
                        name={t("Instrument")}
                        labelText={t("Instrument")}
                        id={"Instrument"}
                        checked={isInstrument}
                        onChange={handleInstrumentSwitch}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioNDL
                        name={t("Virtual Instrument")}
                        labelText={t("Virtual Instrument")}
                        id={"Virtual Instrument"}
                        checked={!isInstrument}
                        onChange={handleInstrumentSwitch}
                      />
                    </Grid>
                  </Grid>
                </div>

                <div style={{ paddingBottom: 12 }}>
                  {isInstrument && isInstrumentRender()}

                  {!isInstrument && (
                    <SelectBox
                      id="subnode-VI"
                      options={
                        props.virtualInstrumentListData
                          ? props.virtualInstrumentListData
                          : []
                      }
                      isMArray={true}
                      keyId="id"
                      keyValue="name"
                      label={t("Virtual Instrument")}
                      value={multipleVirtualInstrument}
                      onChange={(e, row) => setMultipleVirtualInstrument(e)} 
                      auto
                      multiple={true}
                      checkbox={true}
                    />
                  )}
                </div>
              </> 
              }
            </div>
      
          )
        }
        {chartType === "Table" && (
          <>
              <div className="flex gap-2 items-center" style={{justifyContent:'space-between',paddingBottom: 12,paddingTop: 10}}>
                  <div className="flex flex-col gap-0.5">
                      <Typography variant="sm-label-text-01">Enable Multi-Metric Selection</Typography>
                      <span className="font-geist-sans" style={{ color: '#A8A8A8',fontSize: '0.75rem',fontWeight:400 }}>Allows multiple metric selection for supported instruments.</span>
                  </div>                       
                  <CustomSwitch switch={true} checked={isMultiMetric} onChange={(e)=>{
                    setIsMultiMetric(e.target.checked)
                    setMetricFields([{
                      field: 1,
                      instrument_id: "",
                      instrument_name: "",
                      metric_name: [],
                      metric_title: [],
                      metOpt: [],
                      TableCellColor: "#ffffff",
                    }]) 
                  }} 
                      primaryLabel={''} size="large"  />          
              </div>
          {
                    isMultiMetric 
                    ? (<>
                      {
                        // Multi Metric
                        <>
                          <Grid container spacing={2} style={{ marginBottom: 4 }}>
                            
                            <Grid item xs={6}>
                              <SelectBox
                                auto={true}
                                placeholder={t("selectInstrument")}
                                id={"entityInstru_Multi"}
                                options={
                                  props.instrumentListData
                                    ? props.instrumentListData?.filter((ins) => ins.instrument_type === 23)
                                    : []
                                }
                                isMArray={true}
                                keyId="id"
                                keyValue="name"
                                dynamic={MetricFields}
                                value={MetricFields?.[0]?.instrument_id}
                                onChange={(e, row) =>

                                  // console.log(e, row)
                                  handleMultiMetricInstrumentChange(e, row, 1)
                                  // handleMultiInstrumentChange(e, row, val.field)
                                }
                              />
                            </Grid>
                              
                            <Grid item xs={5}>
                              <SelectBox
                                auto={true}
                                id={"entityMet_multi"}
                                placeholder={t("SelectMetric")}
                                options={MetricFields?.[0]?.metOpt}
                                isMArray={true}
                                // limitTags={2}
                                multiple
                                keyId="title"
                                keyValue="title"
                                dynamic={MetricFields}
                                value={MetricFields?.[0]?.metric_title ? MetricFields?.[0].metric_title : []}
                                // error={val.error ? true : false}
                                msg={"You can select up to 1 metric only"}
                                onChange={(e, row) => {

                                  // console.log(e, row)
                                  handleMultipleMetricChange(e, row, 1,true)
                                }
                                }
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <div className="border border-Border-border-50 dark:border-Border-border-dark-50">
                                <InputFieldNDL
                                  id="arc1-length"
                                  type={"color"}
                                  // value={MetricFields?.[0].TableCellColor}
                                  value={multiMetricCellColour}
                                  onChange={(e, row) =>
                                    // console.log(e)
                                    setMultiMetricCellColour(e.target.value)
                                    // handleColorChange(e, row, 1)
                                  }
                                  dynamic={MetricFields}
                                />
                              </div>
                            </Grid>
                          </Grid>
                          <span className="font-geist-sans" style={{ color: '#A8A8A8',fontSize: '0.75rem',fontWeight:400 }}>The table will display only the top 10 values from the selected metrics.</span>
                        </>
                      }
                      </>) 
                    : (<> 
                        { 
                          // Not a Multimetric (NORMAL TABLE WIDGET) 
                          <>
                              {MetricFields.map((val, fIndex) => {
                                return (
                                  <>
                                    {"instrument_id" in val ? (
                                      <DndProvider backend={HTML5Backend}>
                                        <Grid container spacing={4} style={{ marginBottom: 4 }}>
                                          <Grid
                                            item
                                            xs={1}
                                            style={{ display: "flex", alignItems: "center" }}
                                          >
                                            <DraggableIcon
                                              key={val.field}
                                              index={fIndex}
                                              id={fIndex + 1}
                                              moveCard={moveCard}
                                            />
                                          </Grid>
                                          <Grid item xs={4}>
                                            <SelectBox
                                              auto={true}
                                              placeholder={t("selectInstrument")}
                                              id={"entityInstru" + val.field}
                                              options={
                                                props.instrumentListData
                                                  ? props.instrumentListData
                                                  : []
                                              }
                                              isMArray={true}
                                              keyId="id"
                                              keyValue="name"
                                              dynamic={MetricFields}
                                              value={val.instrument_id ? val.instrument_id : ""}
                                              onChange={(e, row) =>
                                                handleMultiInstrumentChange(e, row, val.field)
                                              }
                                            />
                                          </Grid>
                                            
                                          <Grid item xs={4}>
                                            <SelectBox
                                              auto={true}
                                              id={"entityMet" + val.field}
                                              placeholder={t("SelectMetric")}
                                              options={val.metOpt}
                                              isMArray={true}
                                              limitTags={2}
                                              // multiple
                                              // keyId="name"
                                              keyId="title"
                                              keyValue="title"
                                              dynamic={MetricFields}
                                              value={val.metric_title.length > 0 && val.metric_title[0] ? val.metric_title[0].title : []}
                                              error={val.error ? true : false}
                                              msg={"You can select up to 1 metric only"}
                                              onChange={(e, row) =>
                                                handleMultiMetricChange(e, row, val.field,true)
                                              }
                                            />
                                          </Grid>
                                          <Grid item xs={2}>
                                            <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                                              <InputFieldNDL
                                                id="arc1-length"
                                                type={"color"}
                                                value={val.TableCellColor}
                                                onChange={(e, row) =>
                                                  handleColorChange(e, row, val.field)
                                                }
                                                dynamic={MetricFields}
                                              />
                                            </div>
                                          </Grid>
                                              
                                          <Grid item xs={1}>
                                            {MetricFields.length !== 1 && (
                                              <Button
                                                type="ghost"
                                                danger
                                                icon={Delete}
                                                stroke={theme.colorPalette.genericRed}
                                                onClick={() => removeRow(val.field)}
                                              />
                                            )}
                                          </Grid>
                                        </Grid>
                                      </DndProvider>
                                    ) : (
                                      <DndProvider backend={HTML5Backend}>
                                        <Grid container spacing={2} style={{ marginBottom: 4 }}>
                                          <Grid
                                            item
                                            xs={1}
                                            style={{ display: "flex", alignItems: "center" }}
                                          >
                                            <DraggableIcon
                                              key={val.field}
                                              index={fIndex}
                                              id={fIndex + 1}
                                              moveCard={moveCard}
                                            />
                                          </Grid>
                                          <Grid item xs={9}>
                                            <SelectBox
                                              id="subnode-VI"
                                              options={
                                                props.virtualInstrumentListData
                                                  ? props.virtualInstrumentListData
                                                  : []
                                              }
                                              isMArray={true}
                                              placeholder={"Select Virtual Instrument"}
                                              keyId="id"
                                              keyValue="name"
                                              value={val.virtualInstrument_id}
                                              onChange={(e, row) =>
                                                handleVirtualInstrumentTable(e, row, val.field)
                                              }
                                              auto
                                              multiple={false}
                                              checkbox={false}
                                            />
                                          </Grid>
                                          <Grid item xs={1}>
                                            <InputFieldNDL
                                              id="arc1-length"
                                              type={"color"}
                                              value={val.TableCellColor}
                                              onChange={(e, row) =>
                                                handleColorChange(e, row, val.field)
                                              }
                                              dynamic={MetricFields}
                                            />
                                          </Grid>
                                            
                                          <Grid item xs={1}>
                                            {MetricFields.length !== 1 && (
                                              <Button
                                                type="ghost"
                                                danger
                                                icon={Delete}
                                                stroke={theme.colorPalette.genericRed}
                                                onClick={() => removeRow(val.field)}
                                              />
                                            )}
                                          </Grid>
                                        </Grid>
                                      </DndProvider>
                                    )}
                                  </>
                                );
                              })}
                              {MetricFields.map((val) => {
                                return (
                                  <div key={val.field} style={{ marginTop: "10px" }}>
                                    {Number(val.field) === 1 && (
                                      <>
                                        <div
                                          style={{
                                            marginLeft: 10,
                                            paddingBottom:10,
                                            float: "right",
                                            marginRight: "1rem",
                                          }}
                                        >
                                          <Button
                                            type={"tertiary"}
                                            value={"Add"}
                                            Righticon
                                            icon={Plus}
                                            onClick={handleClick}
                                            disabled={MetricFields.length >= 35}
                                          ></Button>
                                        </div>
                                        <ListNDL
                                          options={popperOption}
                                          Open={anchorEl}
                                          optionChange={(e, data) => optionChange(e, data)}
                                          keyValue={"name"}
                                          keyId={"id"}
                                          id={"popper-Parts"}
                                          onclose={handleClose}
                                          anchorEl={anchorEl}
                                          width="150px"
                                        />
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                          </>
                        } 
                      </>)
                  }
          </>
        )}

{
          (chartType === 'singleText') && (
            <div style={{ paddingBottom: 12 }}>
              <Typography variant="Caption1" value={t('Card Color')} />
              <div>
                <Grid container spacing={2} style={{ marginTop: "12px" }}>
                  <React.Fragment>
                    <Grid item xs={4} lg={4} style={{ display: textConvert ? 'block' : 'none' }}>
                      <InputFieldNDL
                        id=""
                        type="text"
                        inputRef={text1Ref}
                        label="Text 1"
                      />
                    </Grid>
                    <Grid item xs={1} lg={1} style={{ display: textConvert ? 'block' : 'none' }}>
                      <InputFieldNDL
                        id="arc1-length"
                        type="color"
                        label={t('Color')}
                        inputRef={Color1}
                      />
                    </Grid>

                    <Grid item xs={5} lg={5} style={{ display: textConvert ? 'none' : 'block' }}>
                      <div className={classes.colorDiv}>
                        <InputFieldNDL
                          id="arc1-length"
                          type="number"
                          // disabled
                          value={arc1Min}
                          label="Minimum"
                          arrow
                          NoMinus
                          onChange={handleArc1Min}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={5} lg={5} style={{ display: textConvert ? 'none' : 'block' }}>
                      <div className={classes.colorDiv}>
                        <InputFieldNDL
                          id="arc1-length"
                          type="number"
                          value={arc1Max}
                          onChange={handleArc1Max}
                          onBlur={handleArc1MaxBlur}
                          arrow
                          NoMinus
                          label="Maximum"
                           helperText={arc1Max === 0 ? "Please Enter value Above 0" : ""}
                          error={arc1Max === 0 ? true : false}

                                               

                        />
                      </div>
                    </Grid>
                    {/* <Grid item xs={4} lg={4} style={{ display: textConvert ? 'none' : 'block' }}>
                                            <div style={classes.colorDiv}>
                                                <TypographyNDL value="Color" variant='paragraph-xs' />
                                                <div>
                                                    <div style={classes.divcolorBackground}>
                                                        <div style={classes.colorPicker} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid> */}
                    <Grid item xs={2} lg={2} >
                      <TypographyNDL value="Color" variant='paragraph-xs' />
                      <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                        <InputFieldNDL
                          id="arc1-length"
                          type={"color"}

                          value={dynamicColor.level1_color}
                          // onChange={(e, row) =>
                          //   handleColorChange(e, row, val.field)
                          // }
                          onChange={(e) => handleDynamicColorChange("level1_color", e.target.value)}
                          dynamic={MetricFields}
                        />
                      </div>
                    </Grid>
                  </React.Fragment>
                </Grid>
              </div>
              <div>
                <Grid container spacing={2} style={{ marginTop: "12px" }}>
                  <Grid item xs={4} style={{ display: textConvert ? 'block' : 'none' }}>
                    <div style={{ marginRight: '13px' }}>
                      <InputFieldNDL
                        id=""
                        type="text"
                        inputRef={text2Ref}
                        label="Text 2"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={1} style={{ display: textConvert ? 'block' : 'none' }}>
                    <div>
                      <InputFieldNDL
                        id="arc1-length"
                        type="color"
                        label={t('Color')}
                        inputRef={Color2}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={5} lg={5} style={{ display: textConvert ? 'none' : 'block' }}>
                    <div className={classes.colorDiv}>
                      <InputFieldNDL
                        id="arc1-length"
                        type="number"
                        value={arc1Max}
                        label="Minimum"
                        disabled
                      />
                    </div>
                  </Grid>
                  <Grid item xs={5} lg={5} style={{ display: textConvert ? 'none' : 'block' }}>
                    <div className={classes.colorDiv}>
                      <InputFieldNDL
                        id="arc1-length"
                        type="number"
                        value={arc2Max}
                        label="Maximum"
                        arrow
                        NoMinus
                        onChange={handleArc2Max}
                      />
                    </div>
                  </Grid>
                  {/* <Grid item xs={4} style={{ display: textConvert ? 'none' : 'block' }}>
                                        <div style={classes.colorDiv}>
                                           <TypographyNDL value="Color" variant='paragraph-xs' />
                                            <div>
                                                <div style={classes.divcolorBackground}>
                                                    <div style={classes.colorPicker2} />
                                                </div>
                                            </div>
                                        </div>
                                    </Grid> */}
                  <Grid item xs={2}>
                    <TypographyNDL value="Color" variant='paragraph-xs' />
                    <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                      <InputFieldNDL
                        id="arc1-length"
                        type={"color"}

                        value={dynamicColor.level2_color}
                        // onChange={(e, row) =>
                        //   handleColorChange(e, row, val.field)
                        // }
                        onChange={(e) => handleDynamicColorChange("level2_color", e.target.value)}
                        dynamic={MetricFields}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Grid container spacing={2} style={{ marginTop: "12px" }}>
                  <Grid item xs={4} style={{ display: textConvert ? 'block' : 'none' }}>
                    <div style={{ marginRight: "13px" }}>
                      <InputFieldNDL
                        id=""
                        type="text"
                        inputRef={text3Ref}
                        label="Text 3"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={1} style={{ display: textConvert ? 'block' : 'none' }}>
                    <div>
                      <InputFieldNDL
                        id="arc1-length"
                        type="color"
                        label={t('Color')}
                        inputRef={Color3}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={5} lg={5} style={{ display: textConvert ? 'none' : 'block' }}>
                    <div className={classes.colorDiv}>
                      <InputFieldNDL
                        id="arc1-length"
                        type="number"
                        value={arc2Max}
                        onChange={handleArc2Max}
                        onBlur={handleArc2MaxBlur}
                        label="Minimum"
                        disabled
                      />
                    </div>
                  </Grid>
                  <Grid item xs={5} lg={5} style={{ display: textConvert ? 'none' : 'block' }}>
                    <div className={classes.colorDiv}>
                      <InputFieldNDL
                        id="arc1-length"
                        type="number"
                        value={arc3Max}
                        onChange={handleArc3Max}
                        // onBlur={handleArc3MaxBlur}
                        label="Maximum"
                        arrow
                        NoMinus
                      />
                    </div>
                  </Grid>
                  {/* <Grid item xs={4} style={{ display: textConvert ? 'none' : 'block' }}>
                                        <div style={classes.colorDiv}>
                                           <TypographyNDL value="Color" variant='paragraph-xs' />
                                            <div>
                                                <div style={classes.divcolorBackground}>
                                                    <div style={classes.colorPicker3} />
                                                </div>
                                            </div>
                                        </div>
                                    </Grid> */}
                  <Grid item xs={2}>
                    <TypographyNDL value="Color" variant='paragraph-xs' />
                    <div className="border border-Border-border-50 dark:border-Border-border-dark-50 rounded-md">
                      <InputFieldNDL
                        id="arc1-length"
                        type={"color"}
                        value={dynamicColor.level3_color}
                        onChange={(e) => handleDynamicColorChange("level3_color", e.target.value)}

                        dynamic={MetricFields}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          )}

        {chartType === "Status" && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ paddingBottom: 12 }}>
              <SelectBox
                auto={false}
                id="subnode-Map"
                options={statusOption}
                isMArray={true}
                checkbox={false}
                keyId="id"
                keyValue="name"
                multiple={false}
                label={t("Status Type")}
                value={optionTypes}
                onChange={handleOptionChange}
              />
            </div>

            
                            {optionTypes === "binary" && (
                                <div>
                                    <div>
                                        <Grid container spacing={1}>
                                            <Grid item xs={5}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id="arc1-length-positive-text"
                                                        type="text"
                                                        inputRef={positiveText}
                                                        label={t("Title")}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id="arc1-length-positive-value"
                                                        type="number"
                                                        inputRef={positiveValue}
                                                        label={t("Value")}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id="arc1-length-positive-color"
                                                        type="color"
                                                        inputRef={positiveColor}
                                                        label={t("Color")}
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>

                                    <div>
                                        <Grid container spacing={1}>
                                            <Grid item xs={5}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id="arc1-length-negative-text"
                                                        type="text"
                                                        inputRef={negativeText}
                                                        label={t("Title")}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id="arc1-length-negative-value"
                                                        type="number"
                                                        inputRef={negativeValue}
                                                        label={t("Value")}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id="arc1-length-negative-color"
                                                        type="color"
                                                        inputRef={negativeColor}
                                                        label={t("Color")}
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            )}

                            {optionTypes === "multiLevel" && (
                                <div>
                                    {multiStatus.map((item, index) => (
                                        
                                        <Grid container key={item.multiPossitiveText} spacing={3}  style={{disply:"flex",alignItems:"center"}} >
                                            <Grid item xs={5}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id={`arc1-length-positive-text`}
                                                        type="text"
                                                        value={item.multiPossitiveText}
                                                        label={t("Title")}
                                                        onChange={(e) => handleChange(e.target.value,index, 'multiPossitiveText')}
                                                        dynamic={multiStatus}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id={`arc1-length-positive-value`}
                                                        type="number"
                                                        value={item.multiPossitiveValue}
                                                        label={t("Value")}
                                                        onChange={(e) => handleChange(e.target.value,index, 'multiPossitiveValue')}
                                                        dynamic={multiStatus}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <div style={classes.colorDiv}>
                                                    <InputFieldNDL
                                                        id={`arc1-length-positive-color`}
                                                        type="color"
                                                        value={item.multiPossitiveColor}
                                                        label={t("Color")}
                                                        onChange={(e) => handleChange(e.target.value,index, 'multiPossitiveColor')}
                                                        dynamic={multiStatus}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={1} style={{ cursor: "pointer", marginTop:"10px", marginLeft:"10px" }}>
                                                {multiStatus.length > 1 && (
                                                    <Delete stroke={'#DA1E28'} onClick={() => handleDeleteRow(index)} />
                                                )}
                                            </Grid>
                                        </Grid>
                                    ))}

                                    <Grid item xs={12}>
                                        <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "85px" }}>
                                            <Button type="tertiary" value={t('AddField')} disabled={multiStatus.length >=15} onClick={handleAddRow} icon={Plus}/>
                                        </div>
                                    </Grid>
                                </div>
                            )}

                        </div>
                    )
                }

        {chartType === "map" && (
          <div style={{ paddingBottom: 12 }}>
            <SelectBox
              auto={true}
              id="subnode-Map"
              options={InstrumentsMap}
              isMArray={true}
              keyId="id"
              keyValue="name"
              multiple
              label={t("Instruments")}
              value={mapInstrumentID}
              onChange={handleMapInstrumentSelect}
            />
          </div>
        )}
        {chartType === "alerts" && (
          <div style={{ paddingBottom: 12 }}>
            <SelectBox
              auto={true}
              edit={true}
              id="subnode"
              options={//NOSONAR
                props.alertlistdata && props.alertlistdata.length > 0
                  ? props.alertlistdata.filter((x) => x.name !== "")
                  : []
              }
              isMArray={true}
              multiple
              keyId="id"
              keyValue="name"
              label={t("AlarmRules")}
              value={alertName}
              noSorting
              onChange={(e, row) => handleAlertSelect(e, row)}
            />
          </div>
        )}
        {chartType === "clock" && (
          <>
            <SelectBox
              id="subnode"
              options={clockWidgetOptions}
              isMArray={true}
              keyId="id"
              keyValue="name"
              label={"Mode"}
              auto
              value={clockMode}
              onChange={(e) => {
                setClockMode(e.target.value);
              }}
            />
            {clockMode === "clock" && (
              <>
                <div style={{ margin: "5px 0px 5px 0px" }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <RadioNDL
                        name={"24 Hrs"}
                        labelText={"24 Hrs"}
                        value={24}
                        id={"24_Hrs"}
                        checked={timeFormat === 24}
                        onChange={() => setTimeFormat(24)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <RadioNDL
                        name={"12 Hrs"}
                        labelText={"12 Hrs"}
                        value={12}
                        id={"12_Hrs"}
                        checked={timeFormat === 12}
                        onChange={(e) => setTimeFormat(12)}
                      />
                    </Grid>
                  </Grid>
                </div>

                <SelectBox
                  id="subnode"
                  options={clockTimeZoneOptions}
                  isMArray={true}
                  keyId="id"
                  keyValue="name"
                  label={"Timezone"}
                  auto
                  value={timeZone}
                  onChange={(e) => {
                    setTimeZone(e.target.value);
                  }}
                />
              </>
            )}

            {clockMode === "countup" && (
              <>
                <span className="block mb-2 text-[14px]  leading-[18px] font-medium text-primary-text dark:text-primary-text my-2">
                  {t("Start Date")}
                </span>
                <DatepickerNDL
                  id="Date-picker-start"
                  onChange={(e) => {
                    setdate({ value: e, isValid: true });
                  }}
                  startDate={date.value ? new Date(date.value) : date.value}
                  dateFormat="MMM dd yyyy HH:mm:ss"
                  placeholder={t("Enter Start Date")}
                  customRange={false}
                  showTimeSelect={true}
                  timeFormat="HH:mm:ss"
                  // maxDate={enddate.value ? new Date(enddate.value) : undefined}
                  // minDate={new Date(mindate)}
                />
                <span style={{ color: "red" }}> 
                </span>
              </>
            )}
            {clockMode === "countdown" && (
              <>
                <span className="block mb-2 text-[14px]  leading-[18px] font-medium text-primary-text dark:text-primary-text my-2">
                  {t("End Date")}
                </span>
                <DatepickerNDL
                  id="Date-picker-end"
                  onChange={(e) => {
                    setenddate({ value: e, isValid: true });
                  }}
                  startDate={
                    enddate.value ? new Date(enddate.value) : enddate.value
                  }
                  dateFormat="MMM dd yyyy HH:mm:ss"
                  placeholder={t("Enter End Date")}
                  customRange={false}
                  showTimeSelect={true}
                  timeFormat="HH:mm:ss"
                  // maxDate={new Date(maxdate)}
                  // minDate={date.value ? new Date(date.value) : undefined}
                />
                <span style={{ color: "red" }}>
                  {""}
                </span>
              </>
            )}
            {clockMode === "clock" && (
              <div
                className="flex gap-2 items-center"
                style={{
                  justifyContent: "space-between",
                  paddingBottom: 10,
                  paddingTop: 10,
                }}
              >
                <div className="flex flex-col gap-0.5">
                  <Typography variant="sm-label-text-01">
                    {"Show Date"}
                  </Typography>
                </div>
                <CustomSwitch
                  switch={true}
                  checked={showDate}
                  onChange={(e) => setShowDate(e.target.checked)}
                  primaryLabel={""}
                  size="small"
                />
              </div>
            )}
          </>
        )}
        {chartType === "energymeter" && (
          <div style={{ paddingBottom: 10 }}>{isInstrumentRender()}</div>
        )}
        {chartType === "thermometer" && (
          <>
            <SelectBox
              auto={true}
              id="subnode-Instru"
              // options={chartType === 'Status' && props.instrumentListData ? (props.instrumentListData.filter(obj =>
              //     obj.instruments_metrics.every(metricObj =>
              //         metricObj.metric.metric_datatype === 1 || metricObj.metric.metric_datatype === 4
              //     )
              // )) : (props.instrumentListData ? props.instrumentListData : [])}
              options={temperatureSensorData}
              isMArray={true}
              keyId="id"
              keyValue="name"
              label={t("Instruments")}
              value={instrumentID}
              onChange={handleInstrumentSelect}
            />
            <Grid container spacing={1} style={{marginTop:10}}>
              <Grid item xs={6}>
                <SelectBox
                  id="subnode-Met"
                  options={
                    !instrumentMetricListLoading &&
                    !instrumentMetricListError &&
                    instrumentMetricListData
                      ? instrumentMetricListData[0].metOpt
                      : []
                  }
                  auto={true}
                  isMArray={true}
                  multiple={
                    chartType === "dialgauge" ||
                    chartType === "dialgauge2" ||
                    chartType === "fillgauge" ||
                    chartType === "thermometer" ||
                    textConvert || chartType === 'singleText'
                      ? false
                      : true
                  }
                  keyId="title"
                  keyValue="title"
                  label={t("Metric")}
                  value={
                    chartType === "dialgauge" ||
                    chartType === "dialgauge2" ||
                    chartType === "fillgauge" ||
                    chartType === "thermometer" ||
                    textConvert
                      ? metricTitleValue
                      : metricTitle
                  }
                  error={Error ? true : false}
                  msg={"You can select up to 10 metrics only"}
                  onChange={(e, option) =>
                    handleMetricSelect(
                      e,
                      option,
                      chartType === "dialgauge" ||
                        chartType === "dialgauge2" ||
                        chartType === "fillgauge" ||
                        chartType === "thermometer" ||
                        textConvert || chartType === 'singleText'
                        ? false
                        : true
                    )
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <SelectBox
                  id="subnode"
                  options={temperatureUnitOptions}
                  isMArray={true}
                  keyId="id"
                  keyValue="name"
                  label={"Unit"}
                  auto
                  value={tempunit}
                  onChange={(e) => {
                    setTempUnit(e.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <div className="mt-2.5">
              <InputFieldNDL
                label={"Max Temperature"}
                placeholder={"Enter Max Temperature"}
                inputRef={maxTemp}
                maxLength={"250"}
              />
            </div>
          </>
        )}
        {chartType === "weather" && (
          
            <SelectBox
              id="subnode"
              options={locationOption}
              isMArray={true}
              keyId="id"
              keyValue="name"
              label={"Location"}
              auto
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            />
       
   
        )}
        {chartType === "dataoverimage" && (
          <>
          {
            file 
            ? 
              <>
                <Typography value="Uploaded File" variant="sm-label-text-01" />
                <Grid item xs={12}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    {
                      dashboardUploadsLoading 
                      ? <CircularProgress disableShrink size={15} color="primary" />
                      : <DummyImage /> 
                    }
                    <Typography value={dashboardUploadsLoading ? 'Uploading...' : file?.[0]?.name || file.name} variant="lable-01-s"  />
                  </div>
                  {!dashboardUploadsLoading && <BlackX onClick={()=>handleRemoveAssetImage()} />}
                </div>
                </Grid>
              </>
            : 
            <>
            <FileInputNDL
              accept="image/*"
              multiple={false}
              onChange={(e) => {
                if(e.target.files[0]?.size <= 10000000){
                  fileSizeError && setFileSizeError(false)
                  setFile(e.target.files) 
                } else { setFileSizeError(true) }
              }}
              onClose={(val, index, e) =>
                val.type ? console.log(index, e) : console.log(index, val)
              }
            />
            <Typography style={{paddingTop:10,paddingBottom:10}}color={fileSizeError ? 'danger' : 'secondary'} variant="paragraph-s" value={'File should be 10mb or less (Max 500x500px)'} />
            {
              dashboardUploadsLoading &&
              <Grid item xs={12}>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <CircularProgress disableShrink size={15} color="primary" />
                  <Typography value={'Uploading...'} variant="lable-01-s"  />
                </div>
              </div>
              </Grid>
            }
            </>
          }
            
            <div style={{ paddingBottom: 10 }}>{isInstrumentRender()}</div>
          </>
        )}
        {chartType === "video" && (
          <>
            <div style={{ margin: "5px 0px 5px 0px" }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <RadioNDL
                    name={"From File"}
                    labelText={"From File"}
                    value={"file"}
                    id={"from_file"}
                    checked={videoSource === "file"}
                    onChange={() => setVideoSource("file")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RadioNDL
                    name={"From URL"}
                    labelText={"From URL"}
                    value={"url"}
                    id={"from_url"}
                    checked={videoSource === "url"}
                    onChange={(e) => setVideoSource("url")}
                  />
                </Grid>
              </Grid>
            </div>
            <div style={{ paddingBottom: 12 }}>
              {videoSource === "url" ? (
                <InputFieldNDL
                  id="URL"
                  label={"URL"}
                  placeholder="URL"
                  inputRef={url}
                  NoMinus
                />
              ) : (
                <>
                {
                  file 
                  ? 
                    <>
                      <Typography value="Uploaded File" variant="sm-label-text-01" />
                      <Grid item xs={12}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          {
                            dashboardUploadsLoading 
                            ? <CircularProgress disableShrink size={15} color="primary" />
                            : <DummyImage /> 
                          }
                          <Typography value={dashboardUploadsLoading ? 'Uploading...' : file?.[0]?.name || file.name} variant="lable-01-s"  />
                        </div>
                        {!dashboardUploadsLoading && <BlackX onClick={()=>handleRemoveAssetImage()} />}
                      </div>
                      </Grid>
                    </>
                  : 
                    <>
                    <FileInputNDL
                      accept="video/*"
                      multiple={false}
                      onChange={(e) => {
                        if(e.target.files[0]?.size <= 10000000){
                          fileSizeError && setFileSizeError(false)
                          setFile(e.target.files) 
                        } else { setFileSizeError(true) }
                      }}
                      onClose={(val, index, e) =>
                        val.type ? console.log(index, e) : console.log(index, val)
                      }
                    />
                    <Typography  style={{paddingTop:10,paddingBottom:10}} color={fileSizeError ? 'danger' : 'secondary'} variant="paragraph-s" value={'File should be 10mb or less (Max 500x500px)'} />
                    {
                      dashboardUploadsLoading &&
                      <Grid item xs={12}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <CircularProgress disableShrink size={15} color="primary" />
                          <Typography value={'Uploading...'} variant="lable-01-s"  />
                        </div>
                      </div>
                      </Grid>
                }
                    </>
                }
                </>
              )}
            </div>
          </>
        )}

                {AccordianDisplay()}

            </ModalContentNDL>
            <ModalFooterNDL>
            <Button type="secondary" onClick={() => { handleDialogHieClose() }} value={t('Cancel')}  />
            {showButton &&(
                <Button value={isEdit ? "Update" : "Add"} onClick={() => saveChanges(true)} />
                )}
            </ModalFooterNDL>
        </React.Fragment>
    )
})
export default EditSetting;
