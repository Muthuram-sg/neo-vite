/* eslint-disable no-useless-concat */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { trendLegendView, labelInterval, groupBreachCount, CalcStat , snackMessage , snackType , snackToggle,alertchartenable,exploreLoader,dataForecastenable, forecastCalc, breachCountExplore, groupBreachCountExplore, snackDesc, themeMode} from "recoilStore/atoms";
import moment from 'moment';
import DatePickerNDL from "components/Core/DatepickerNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import Select from "components/Core/DropdownList/DropdownListNDL"
import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TrendUp from 'assets/neo_icons/Explore/TrendUp.svg?react';
import TrendDown from 'assets/neo_icons/Explore/TrendDown.svg?react';
import Right from 'assets/neo_icons/Equipments/right_chevron.svg?react';
import Timer1S from 'assets/neo_icons/TimerIcon/Timer_1s.svg?react';
import Timer5S from 'assets/neo_icons/TimerIcon/Timer_5s.svg?react';
import Timer10S from 'assets/neo_icons/TimerIcon/Timer_10s.svg?react';
import Timer1M from 'assets/neo_icons/TimerIcon/Timer_1m.svg?react';
import Timer2M from 'assets/neo_icons/TimerIcon/Timer_2m.svg?react';
import Timer5M from 'assets/neo_icons/TimerIcon/Timer_5m.svg?react';
import Timer10M from 'assets/neo_icons/TimerIcon/Timer_10m.svg?react';
import Timer15M from 'assets/neo_icons/TimerIcon/Timer_15m.svg?react';
import Timer30M from 'assets/neo_icons/TimerIcon/Timer_30m.svg?react';
import Timer30S from 'assets/neo_icons/TimerIcon/Timer_30s.svg?react';
import Timer60M from 'assets/neo_icons/TimerIcon/Timer_60m.svg?react';
import AlarmFilled from 'assets/neo_icons/Explore/Explore_Icons/Alarm_Filled.svg?react';
import AlarmTrendFilled from 'assets/neo_icons/Explore/Explore_Icons/Alarm_trend_Filled.svg?react';
import AlarmTrend from 'assets/neo_icons/Explore/Explore_Icons/Alarm_trend.svg?react';
import Alarm from 'assets/neo_icons/Explore/Explore_Icons/Alarm.svg?react';
import CommentFilled from 'assets/neo_icons/Explore/Explore_Icons/Comment_Filled.svg?react';
import Comment from 'assets/neo_icons/Explore/Explore_Icons/Comment.svg?react';
import ForecastFilled from 'assets/neo_icons/Explore/Explore_Icons/Forecast_Filled.svg?react';
import Forecast from 'assets/neo_icons/Explore/Explore_Icons/Forecast.svg?react';
import Eyeopen from 'assets/eye.svg?react';
import EyeClose from 'assets/eye-off.svg?react';
import DeleteIcon from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import trendsColours from "../../trendsColours";
import Checkboxs from 'components/Core/CustomSwitch/CustomSwitchNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import Grid from 'components/Core/GridNDL'
import useGetInstrumentMetricsByInsId from "components/layouts/Settings/Instrument/Hooks/useGetInstrumentMetricsByInsId.jsx";
import useInstrumentWiseAlert from "../hooks/useInstrumentWiseAlert.jsx";
import useAlarmHistoryIns from "../hooks/useAlarmHistoryIns.jsx";
import useGetMetricId from "../hooks/useGetMetricId.jsx";
import InputFieldNDL from 'components/Core/InputFieldNDL';

import Datacapsule from "components/Core/Data Capsule/DatacapsuleNDL";
import TagIcon from 'assets/neo_icons/Menu/newMenuIcon/tag.svg?react';
import { omit } from "lodash";
export default function LegendItem(props) {
    const { t } = useTranslation();
    const [,setAnchorEl] = useState(null);
    const calculationArr = useRecoilValue(CalcStat)
    const [legendView] = useRecoilState(trendLegendView);
    const [BreachCountExplore] = useRecoilState(breachCountExplore)
    const [, setgroupBreachCountExplore] = useRecoilState(groupBreachCountExplore)
    const [GroupBreachCount] = useRecoilState(groupBreachCount)
    const [, setSnackDesc] = useRecoilState(snackDesc);
    const [, setOpen] = useState('')
     const [modalOpen, setModalOpen] = useState(false);
     const [removingIndex, setRemovingIndex] = useState(0)
    const [, setintervalLabel] = useRecoilState(labelInterval)
    const [, setopenmenu] = useState(false);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [alertconfig, setalertconfig]= useRecoilState(alertchartenable);
    const [forecastconfig, setForecastconfig] = useRecoilState(dataForecastenable)
    const [,setisgrouptagging ] = useState(false);
    const { InstrumentMetricsByInsIdLoading, InstrumentMetricsByInsIdData, InstrumentMetricsByInsIdError, getInstrumentMetricsByInsId } = useGetInstrumentMetricsByInsId();
    const { insAlarmLoading, insAlarmData, insAlarmError, InstrumentWiseAlert } = useInstrumentWiseAlert()
    const { AlarmHistoryLoading, AlarmHistoryData, AlarmHistoryError, getAlarmHistory } = useAlarmHistoryIns()
    const { insMetricLoading, insMetricData, insMetricError, InstrumentWiseMetric } = useGetMetricId()
    const [ frmDate, setfrmDate]  = useState([]);
    const [ toDate, settoDate]  = useState([]);
    const [ metricVal, setMetricVal ] = useState([]);
    const [ metricTitle, setMetricTitle ] = useState([]);
    const [ insId, setInsId ] = useState([]);
    const [, setLoaderForMeter] = useRecoilState(exploreLoader);
    const forecastCalcArray = useRecoilValue(forecastCalc);
    const [updatedSelectedMetrics, setUpdatedSelectedMetrics] = useState([])
    const [showBreachCount, setShowBreachCount] = useState([])
    const [breachCount, setbreachCount] = useState()
    const [enableComments, setEnableComments] = useState(false)
    const [showGroupLimits, setShowGroupLimits] = useState({0: false})
    const [buttonClick, setButtonClick] = useState({ alarm: false, comment: false, alert: false, forecast: false})
    const [show, setShow] = useState({0: false})
    const [currTheme] = useRecoilState(themeMode)

    useEffect(()=>{
        if(!InstrumentMetricsByInsIdLoading && InstrumentMetricsByInsIdData && !InstrumentMetricsByInsIdError){
            InstrumentWiseAlert(InstrumentMetricsByInsIdData)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[InstrumentMetricsByInsIdLoading, InstrumentMetricsByInsIdData, InstrumentMetricsByInsIdError])

    useEffect(()=>{
        if(!insAlarmLoading && insAlarmData && !insAlarmError){
            getAlarmHistory(insAlarmData.length > 0 ? insAlarmData[0].id : '' )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[insAlarmLoading, insAlarmData, insAlarmError])

    useEffect(() => {
        if (!AlarmHistoryLoading && AlarmHistoryData && !AlarmHistoryError) {
            
            let extractedDataArray = AlarmHistoryData.map(entry => {
                const {
                    action_timestamp,
                    new_values: { warn_value: new_values_warning_value, critical_value: new_values_critical_value } = {},
                    old_values: { warn_value: old_values_warning_value, critical_value: old_values_critical_value } = {}
                } = entry;
                
                const extractedData = {
                    action_timestamp,
                    new_values_warning_value,
                    new_values_critical_value,
                    old_values_warning_value,
                    old_values_critical_value,
                    metric_val: metricVal,
                    id: insId,
                    metric_title: metricTitle
                };
                
                if (extractedData.new_values_warning_value && extractedData.old_values_warning_value) {
                    if (extractedData.new_values_warning_value === extractedData.old_values_warning_value) {
                        extractedData.warning_value = extractedData.new_values_warning_value;
                    }
                } else if (extractedData.new_values_critical_value && extractedData.old_values_critical_value) {
                    if (extractedData.new_values_critical_value === extractedData.old_values_critical_value) {
                        extractedData.critical_value = extractedData.new_values_critical_value;
                    }
                }
    
                return extractedData;
            });
    
            props.extractedDataArray(extractedDataArray)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AlarmHistoryLoading, AlarmHistoryData, AlarmHistoryError, frmDate, toDate]);
    

    const closenewpopupdate = (start, end, value) => {

        let frmDate = moment(start).format("YYYY-MM-DDTHH:mm:ss")
        let toDate = end ? moment(end).format("YYYY-MM-DDTHH:mm:ss") : null
        props.handleChange(17, value, frmDate, toDate)

    }

    const handleInterval = (e, metric) => {
        props.handleInterval(e, metric)
    }

    const intervalOption = [
        { id: "0.0167", value: "1 sec", icon: Timer1S, stroke: "#262626" },
        { id: "0.083", value: "5 sec", icon: Timer5S, stroke: "#262626" },
        { id: "0.167", value: "10 sec", icon: Timer10S, stroke: "#262626" },
        { id: "0.5", value: "30 sec", icon: Timer30S, stroke: "#262626" },
        { id: "1", value: "1 min", icon: Timer1M, stroke: "#262626" },
        { id: "2", value: "2 min", icon: Timer2M, stroke: "#262626" },
        { id: "5", value: "5 min", icon: Timer5M, stroke: "#262626" },
        { id: "10", value: "10 min", icon: Timer10M, stroke: "#262626" },
        { id: "15", value: "15 min", icon: Timer15M, stroke: "#262626" },
        { id: "30", value: "30 min", icon: Timer30M, stroke: "#262626" },
        { id: "60", value: "60 min", icon: Timer60M, stroke: "#262626" },
    ]

    const coloroptions = trendsColours[1].map(colour => {
        return ({
            "id": colour, "value":
                <div class="flex" >
                    <span class="w-4 h-4 border-4xl " style={{ background: colour, borderRadius: "50px" }}></span>
                </div>
        }

        )
    })



    function convertMinutesToTime(minutes) {

        let Intminutes = Number(minutes)

        if (Intminutes >= 60) {
            const hours = Intminutes / 60
            setintervalLabel(hours.toFixed(2) + " " + "hr(s)")
            return hours.toFixed(2) + " " + "hr(s)"


        } else if (Intminutes < 60) {
            setintervalLabel(Intminutes + " " + "Minutes")
            return Intminutes.toFixed(2) + " " + "Minutes"


        }

    }


    useEffect(()=>{
        if(!insMetricLoading && insMetricData && !insMetricError){
            let arr = []
            updatedSelectedMetrics.forEach(x => (
            getInstrumentMetricsByInsId(x.id,insMetricData[0].id),
            setInsId(x.id),
            arr.push(false)
            ));
            setShowBreachCount(arr)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[insMetricLoading, insMetricData, insMetricError])

    const handleClose = () => {
        setopenmenu(false)
        setAnchorEl(null);
    };

    useEffect(()=> {
        let updatedSelectedMetrics;
        let selectedMetric = localStorage.getItem('selectedChipArr') !== "" ? JSON.parse(localStorage.getItem('selectedChipArr')) : '';
        // Check if the arrays have the same length
        if (calculationArr.length > 0 && props.selectedMetric.length === calculationArr.length) {

            updatedSelectedMetrics = props.selectedMetric.map((metric, index) => ({
                ...metric,
                minimum: calculationArr[index].minimum,
                minTime: calculationArr[index].minTime,
                maximum: calculationArr[index].maximum,
                maxTime: calculationArr[index].maxTime,
                average: calculationArr[index].average,
                stddev: calculationArr[index].stddev,
                mode: calculationArr[index].mode,
                datapresent : calculationArr[index].datapresent

            }));
        } else {
            updatedSelectedMetrics = props.selectedMetric.map((metric,) => ({
                ...metric,

            }));
        }
        let finalMetrics=[];
        // console.log(updatedSelectedMetrics,selectedMetric)
        if(updatedSelectedMetrics.length === selectedMetric.length){
            updatedSelectedMetrics.forEach((val,ind) => {
                let newVal = val;
                if(val.forecastenable !== selectedMetric[ind].forecastenable){
                    newVal.forecastenable = selectedMetric[ind].forecastenable
                }
                finalMetrics.push(newVal);
            })
        }
        else
            finalMetrics = updatedSelectedMetrics;
        setUpdatedSelectedMetrics(finalMetrics)
    },[props.selectedMetric,calculationArr])
        

    function showStatus() {
        if(!alertconfig){
            setSnackMessage('No data is available to plot the chart or alarm limits')
            setOpenSnack(true)
            setType('warning')
        } else {
            setSnackMessage('Disable Trend graph to plot the limits')
            setOpenSnack(true)
            setType('warning')
        }
       
    }

    function showcommentStatus() {
      
            setSnackMessage('Disable Trend graph to add comments ')
            setOpenSnack(true)
            setType('warning')
       
       
    }

      function loadForecastChartData(config,id,val){
        if(!config){
            props.getForecastSeries(id,val)
        }
        else{
            props.loadNormalData()
        }
        handleClose()
      }

      function getTrendUpDownIcons(foreastVal,actualVal){
        if(foreastVal < actualVal)
            return <TrendDown width='20' height='20' />;
        else
            return <TrendUp width='20' height='20' />
      }

      useEffect(()=>{
        if(props && props.selectedMetric && !props.selectedMetric[0].hierarchy.includes("All Metrics Group")){
        setisgrouptagging(true)
        } else {
            setisgrouptagging(false)
        }
      })

      function getBreachCount(val){
        // console.clear()
        // console.log(BreachCountExplore)
        // let lower = val.limits.lower.
        // setbreachCount({upperLimit: 0, lowerLimit: 0})
      }

      function getGroupCount(val){
        let lower = val.limits.lower.y
        let upper = val.limits.upper.y
        setgroupBreachCountExplore({ upper, lower })
        // setbreachCount({upperLimit: 0, lowerLimit: 0})
      }

      useEffect(() => {
        setbreachCount(BreachCountExplore)
      }, [BreachCountExplore ])

    //  console.log(updatedSelectedMetrics,'updatedSelectedMetrics')   
      
    return (
        <div className='flex flex-wrap'>

            {updatedSelectedMetrics && updatedSelectedMetrics.length > 0 ?
                (
                    updatedSelectedMetrics.map((val, index) => {
                        // console.log(val,"___val___")
                        return (
                            <>
                                <div className={(index % 2 == 0) ? "p-2 flex flex-col gap-1 border-r border-Border-border-50 dark:border-Border-border-dark-50":"p-2 flex flex-col gap-1"} style={{width: props.legendWith+'px'}}>
                                    <div>
                                        <div className="flex justify-between">
                                           
                                            <div>
                                                <div className="flex items-center  ">
                                                {props && props.selectedMetric && !props.selectedMetric[0].hierarchy.includes("All Metrics Group")  &&
                                                <Checkboxs disabled={alertconfig || show[index] === true} checked={val.checked} onChange={(e) => props.setMetrics(e, index)} />
                                                 }
                                                <Tooltip title={
                                                    val && val.hierarchy && val.hierarchy.split('_').map(x => <>{x}
                                                        <div class="align-text-top mt-0.5 ml-2.5"  >
                                                            <Right stroke="#898989" />
                                                        </div>
                                                    </>
                                                    )
                                                }>
                                                    <TypographyNDL  variant="lable-01-m" color="primary" style={{ color: currTheme === 'dark' ? show[index] === true ? '#BBBBBB' : '#eeeeee' : show[index] === true ? '#BBBBBB' : '#202020' }} >
                                                    {
                                                            !props.selectedMetric[0].hierarchy.includes("All Metrics Group") 
                                                                ? <>{ val.instrument_name}</> 
                                                                :  <span>
                                                                        {val && val.hierarchy && val.hierarchy.split('_')[val && val.hierarchy && val.hierarchy.split('_').length - 1] + " "}
                                                                    </span>
                                                        }
                                                    </TypographyNDL>

                                                </Tooltip>
                                                </div>
                                            
                                            </div>
                                            <div>
                                            {                                          
                                                show[index] === true ? (
                                                    <EyeClose  
                                                        disabled={props?.selectedMetric?.filter(x=>x.checked === true).length > 0 || show[index] === true}
                                                        style={{ cursor: 'pointer' }}
                                                        stroke={props?.selectedMetric?.filter(x=>x.checked === true).length > 0 ?'#BBBBBB' : '#646464'}
                                                        onClick={() => {
                                                            if(props?.selectedMetric?.filter(x=>x.checked === true).length === 0) {
                                                            setShow({ ...show, [index]: false })
                                                            if (val?.metric_data_type !== 4 && val?.metric_data_type !== 5) {
                                                                props.showSeries(val)
                                                            } else {
                                                                props.showSeries(val, true)
                                                            }
                                                            }
                                                        }} 
                                                    />
                                                ) : (
                                                    <Eyeopen 
                                                        disabled={props?.selectedMetric?.filter(x=>x.checked === true).length > 0 || show[index] === true}
                                                        style={{ cursor: 'pointer' }}
                                                        // disabled={props?.selectedMetric?.filter(x=>x.checked === true).length > 0}
                                                        stroke={props?.selectedMetric?.filter(x=>x.checked === true).length > 0 ? '#BBBBBB' : '#646464'}
                                                        onClick={() => {
                                                            if(props?.selectedMetric?.filter(x=>x.checked === true).length === 0) {
                                                            setShow({ ...show, [index]: true })
                                                            if(val?.metric_data_type !== 4 && val?.metric_data_type !== 5){
                                                                props.hideSeries(val)
                                                            }else {
                                                                props.hideSeries(val, true)
                                                            }
                                                        }
                                                        }} 
                                                />
                                                ) 
                                            }
                                            {
                                            !props.selectedMetric[0].hierarchy.includes("All Metrics Group") && 
                                            <DeleteIcon disabled={props?.selectedMetric?.filter(x=>x.checked === true).length > 0 || show[index] === true} 
                                                style={{ cursor: 'pointer', stroke: props?.selectedMetric?.filter(x=>x.checked === true).length > 0 ? '#FFDBDC' :'red', marginLeft: '8px' }} 
                                                    onClick={(e) => {
                                                        let temp_show = omit(show, [index])
                                                        if(props?.selectedMetric?.filter(x=>x.checked === true).length === 0) {
                                                            setRemovingIndex(index)
                                                            setModalOpen(true)
                                                            setShow(temp_show)
                                                        }
                                                }} />
                                            }
                                                    <ModalNDL open={modalOpen} width="30%" >
                                                            <ModalHeaderNDL >
                                                                <div className="flex flex-col items-start">
                                                                    <TypographyNDL variant="heading-02-xs" value="Confirmation" />
                                                                    {/* <Typography variant="paragraph-xs"  color="tertiary" value="Manage your profile, access permissions, requests, and login activity." /> */}
                                                                  
                                                                </div>
                                                            </ModalHeaderNDL>
                                            
                                                            <ModalContentNDL height >
                                                                <TypographyNDL variant="paragraph-s" value="Are you sure to remove this items ?" />
                                                            </ModalContentNDL>
                                            
                                                            <ModalFooterNDL>
                                                                <Button type='secondary' value={t("Cancel")} onClick={() => setModalOpen(false)} />
                                                                <Button type='primary' danger value={'Remove'} onClick={() => {
                                                                    setModalOpen(false)
                                                                    props.removeMetrics(removingIndex)
                                                                    setButtonClick({ alarm: false, comment: false, alert: false, forecast: false })
                                                                    setShowBreachCount([]);
                                                                    console.log(props.annotView)
                                                                    props.setannotView([])
                                                                    setRemovingIndex(0)
                                                                }} />
                                                            </ModalFooterNDL>
                                                        </ModalNDL>
                                            </div>

                                        </div>
                                    </div>
                                    {props && props.selectedMetric && !props.selectedMetric[0].hierarchy.includes("All Metrics Group")  &&
                                            <React.Fragment>
                                    <Grid container spacing={2}>
                                        <Grid item xs={10} sm={10} >
                                          
                                            {
                                                show[index] === true 
                                                ? <> <InputFieldNDL
                                                id="date-explore-legend"
                                                value={(moment(val.frmDate).format("DD-MM-YYYY HH:mm:ss"))+"-"+(moment(val.toDate).format("DD-MM-YYYY HH:mm:ss"))}
                                                disabled={true}
                                                />
                                             </> 
                                                : <>
                                            {!alertconfig ? 
                                            <DatePickerNDL
                                                id="custom-range-Legends"
                                                onChange={(dates, btnvalue) => {
                                                    if (btnvalue === 17) {
                                                        const [start, end] = dates;
                                                        closenewpopupdate(start, end, val)

                                                    } else {
                                                        const [start, end] = dates;
                                                        let frmDate = moment(start).format("YYYY-MM-DDTHH:mm:ss")
                                                        let toDate = end ? moment(end).format("YYYY-MM-DDTHH:mm:ss") : null
                                                        props.handleChange(btnvalue, val, frmDate, toDate)
                                                        setfrmDate(frmDate)
                                                        settoDate(toDate)
                                                    }
                                                }}
                                                startDate={new Date(moment(val.frmDate).format("YYYY-MM-DD HH:mm:ss"))}
                                                endDate={new Date(moment(val.toDate).format("YYYY-MM-DD HH:mm:ss"))}
                                                disabled={alertconfig || Boolean(show[index])}
                                                 dateFormat="dd/MM/yyyy HH:mm:ss"
                                                selectsRange={true}
                                                timeFormat="HH:mm:ss"
                                                customRange={true}
                                                // width={'386px'}
                                                defaultDate={val.range}
                                                Dropdowndefine={"Explorer"}
                                                dynamic={true}
                                            />
                                            :
                                            <InputFieldNDL
                                                id="date-explore-legend"
                                                value={(moment(val.frmDate).format("DD-MM-YYYY HH:mm:ss"))+"-"+(moment(val.toDate).format("DD-MM-YYYY HH:mm:ss"))}
                                                disabled={true}
                                                />
                                            }
                                            </>
                                            }
                                          
                                        </Grid>
                                        <Grid item xs={2} sm={2} >
                                            {
                                                Number(val.frequency) > 60 ?
                                                    <b style={{ width: "100%", height: "100%", marginLeft: "10px" }}>
                                                        {convertMinutesToTime(val.frequency)}

                                                    </b>
                                                    :

                                                    <Select
                                                        labelId=""
                                                        id="explore-interval"
                                                        auto={false}
                                                        options={intervalOption}
                                                        isMArray={true}
                                                        checkbox={false}
                                                        onChange={(e) => handleInterval(e, val)}
                                                        keyValue="value"
                                                        keyId="id"
                                                        error={false}
                                                        value={val.interval}
                                                        // isIconRight
                                                        width={25}
                                                        // isIcon
                                                        // OnlyIcon
                                                        placeholder={t("Interval")}
                                                        disabled={alertconfig || show[index] === true}
                                                        noSorting
                                                    />

                                            }
                                        </Grid>
                                        
                                    </Grid>
                                    </React.Fragment>
                                            }
                                    <Grid container spacing={2}>
                                        <Grid item xs={2} sm={2} >
                                            <Select
                                                labelId=""
                                                id="explore-interval"
                                                auto={false}
                                                options={coloroptions}
                                                isMArray={true}
                                                checkbox={false}
                                                onChange={(e) => props.changeLegendColour(e, val)}
                                                value={val.colour}
                                                keyValue="value"
                                                keyId="id"
                                                placeholder={t("Select Color")}
                                                error={false}
                                                noBoxIcon
                                                selectpadding={"3px"}
                                                disabled={alertconfig ? true : legendView.includes(`${val.metric_val}-${val.id}-${val.metric_title}`) ? true : false || show[index] === true}

                                            />

                                        </Grid>
                                        <Grid item xs={10} sm={10} >
                                            {val.metric_data_type !== 4 &&
                                                <Datacapsule  stroke={currTheme === 'dark' ? "#FFFFFF" :"#101010"} regular name={val.metric_title} value={val && val.meter_value && val.meter_value.toLowerCase().includes("undefined") ? val && val.meter_value && val.meter_value.replace("undefined", "--") : val && val.meter_value && val.meter_value.replace(/(\d+\.\d{2})\d*/, '$1')} colorbg={"silver"}/>
                                            }
                             
                                        </Grid>

                                       {/* <Grid item xs={4} sm={4} ></Grid> */}
                                      
                                        
                                      
                                    </Grid>


                                {
                                    // enableComments
                                    buttonClick.comment[index] 
                                    ? ( <>  
                                        {props.commentView.includes(`${val.metric_val}_${val.id}`) &&
                                        <Grid container>
                                            <Grid item xs={12} sm={12} >
                                                <div >
                                                    <InputFieldNDL

                                                        label={t("CommentsRemarks")}
                                                        helperText={"Press Enter to Update the comment"}
                                                        variant="outlined"
                                                        size="small"
                                                        // multiline={true}
                                                        // maxRows={1}
                                                        disableUnderline
                                                        value={props.comment}
                                                        onChange={(e) => props.handlecommentchange(e)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                console.clear()
                                                                console.log(`${val.metric_title} (${val.id})`, props.markedmetric)
                                                                if(`${val.metric_title} (${val.id})` === props.markedmetric){
                                                                    props.insertcomment(val.metric_val, val.id, val.frmDate, val.toDate,val.metric_title)
                                                                    setEnableComments(!enableComments)
                                                                    setButtonClick({ ...buttonClick, comment: { ...buttonClick.comment,[index]: !buttonClick.comment[index] } });
                                                                } else {
                                                                    setOpenSnack(true)
                                                                    setSnackMessage("Select appropriate comment box")
                                                                    setType("warning")
                                                                }
                                                               

                                                            }
                                                        }}
                                                    ></InputFieldNDL>

                                                </div>
                                            </Grid>
                                        </Grid>

                                    }
                                        </> ) 
                                    : ( <>
                                        <div style={{ width: '-webkit-fill-available' }} className={val.forecastenable ? "h-24 p-2 flex-row justify-start items-center gap-2 inline-flex": "h-20 p-2 flex-col justify-start gap-2 inline-flex"}>
                                       

                                        <div style={{ display: 'grid', gap: '6px' }}>
                                            <div>
                                                <div style ={{ display: 'grid', gridTemplateColumns: '15% 75%'}}>
                                                    <div><TypographyNDL variant="sans-label-01-s" color='secondary' style={{ color:currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }} value={"Min"} /></div>
                                                    <div><>
                                                        {forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                            <div class="grid" style={{marginLeft:"24px"}}>
                                                                <TypographyNDL mono variant="label-02-s" value={(val.minimum && !isNaN(Number(val.minimum)) ? Number(val.minimum).toFixed(2) : "--") + " " + val.unit} />
                                                                <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                    <TypographyNDL style={{color:"#0F6FFF"}} mono variant="label-02-s" value={(forecastCalcArray[0].minimum && !isNaN(Number(forecastCalcArray[0].minimum)) ? Number(forecastCalcArray[0].minimum).toFixed(2) : "--") + " " + val.unit} />
                                                                    {getTrendUpDownIcons(Number(forecastCalcArray[0].minimum),Number(val.minimum))}
                                                                </div>
                                                            </div>
                                                        }
                                                        {!val.forecastenable && <>
                                                            <TypographyNDL mono color={show[index] === true ? 'tertiary' : 'primary'}  variant="label-02-s"> {(val.minimum && !isNaN(Number(val.minimum)) ? Number(val.minimum).toFixed(2) : "--") + " " + val.unit}<span mono variant="label-02-s" style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}>{" " + moment(val.minTime).format('DD/MM/YYYY HH:mm:ss')}</span></TypographyNDL>
                                                            </>
                                                        }
                                                        </>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div style ={{ display: 'grid', gridTemplateColumns: '15% 75%'}}>
                                                    <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }} value={"Max"} /></div>
                                                    <div>
                                                        {forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                        <div class="grid">
                                                            <TypographyNDL mono variant="label-02-s" value={(val.maximum && !isNaN(Number(val.maximum)) ? Number(val.maximum).toFixed(2) : "--") + " " + val.unit} />
                                                            <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                    <TypographyNDL mono style={{color:"#0F6FFF"}} variant="label-02-s" value={(forecastCalcArray[0].maximum && !isNaN(Number(forecastCalcArray[0].maximum)) ? Number(forecastCalcArray[0].maximum).toFixed(2) : "--") + " " + val.unit} />
                                                                {getTrendUpDownIcons(Number(forecastCalcArray[0].maximum),Number(val.maximum))}
                                                            </div>
                                                        </div>
                                                        }
                                                        {!val.forecastenable && <>
                                                            <TypographyNDL mono color={show[index] === true ? 'tertiary' : 'primary'}   variant="label-02-s">{(val.maximum && !isNaN(Number(val.maximum)) ? Number(val.maximum).toFixed(2) : "--") + " " + val.unit}<span mono variant="label-02-s" style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}>{" " + moment(val.maxTime).format('DD/MM/YYYY HH:mm:ss')}</span></TypographyNDL>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                !showBreachCount[index] 
                                                ? 
                                                    !showGroupLimits[index] ? 
                                                    <>
                                                        <div>
                                                            <div style ={{ display: 'grid', gridTemplateColumns: '40% 40%'}}>
                                                                <div style ={{ display: 'grid', gridTemplateColumns: '37% 60%'}}>
                                                                    <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'}  style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }} value={"Std.Div"} /></div>
                                                                    <div>
                                                                    {
                                                                        forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                                        <div class="grid">
                                                                            <TypographyNDL mono variant="label-02-s" value={(val.stddev && !isNaN(Number(val.stddev)) ? Number(val.stddev).toFixed(2) : "--") + " " + val.unit} />
                                                                            <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                                <TypographyNDL mono style={{color:"#0F6FFF"}} variant="label-02-s" value={(forecastCalcArray[0].stddev && !isNaN(Number(forecastCalcArray[0].stddev)) ? Number(forecastCalcArray[0].stddev).toFixed(2) : "--") + " " + val.unit} />
                                                                                {getTrendUpDownIcons(Number(forecastCalcArray[0].stddev),Number(val.stddev))}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {!val.forecastenable && 
                                                                        <TypographyNDL mono color={show[index] === true ? 'tertiary' : 'primary'}  variant="label-02-s" value={(val.stddev && !isNaN(Number(val.stddev)) ? Number(val.stddev).toFixed(2) : "--") + " " + val.unit} />
                                                                    }
                                                                    </div>

                                                                </div>
                                                                
                                                                <div style ={{ display: 'grid', gridTemplateColumns: '25% 70%'}}>
                                                                <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }} value={"Avg"} /></div>
                                                                    <div>
                                                                    {forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                                        <div class="grid">
                                                                            <TypographyNDL mono variant="label-02-s" value={(val.average && !isNaN(Number(val.average)) ? Number(val.average).toFixed(2) : "--") + " " + val.unit} />
                                                                            <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                    
                                                                                <TypographyNDL style={{color:"#0F6FFF"}} variant="label-01-s" value={(forecastCalcArray[0].average && !isNaN(Number(forecastCalcArray[0].average)) ? Number(forecastCalcArray[0].average).toFixed(2) : "--") + " " + val.unit} />
                                                                    
                                                                                {getTrendUpDownIcons(Number(forecastCalcArray[0].average),Number(val.average))}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {!val.forecastenable && 
                                                                        <TypographyNDL mono variant="label-01-s" color={show[index] === true ? 'tertiary' : 'primary'}    value={(val.average && !isNaN(Number(val.average)) ? Number(val.average).toFixed(2) : "--") + " " + val.unit} />
                                                                    }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '15% 75%' }}>
                                                            <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color:currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={"Mode"} /></div>
                                                                    <div>
                                                                    {forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                                        <div class="grid">
                                                                            <TypographyNDL mono variant="label-02-s" value={(val.mode && !isNaN(Number(val.mode)) ? Number(val.mode).toFixed(2) : "--") + " " + val.unit} />
                                                                            <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                                <TypographyNDL mono style={{color:"#0F6FFF"}} variant="label-02-s" value={(forecastCalcArray[0].mode && !isNaN(Number(forecastCalcArray[0].mode)) ? Number(forecastCalcArray[0].mode).toFixed(2) : "--") + " " + val.unit} />
                                                                                {getTrendUpDownIcons(Number(forecastCalcArray[0].mode),Number(val.mode))}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {!val.forecastenable && 
                                                                        <TypographyNDL mono variant="label-02-s" color={show[index] === true ? 'tertiary' : 'primary'}   value={(val.mode && !isNaN(Number(val.mode)) ? Number(val.mode).toFixed(2) : "--") + " " + val.unit} />
                                                                    }
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    : 
                                                    <>
                                                        {/* For Grouped Metric Breach COunt  */}
                                                        <div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '35% 40%' }}>
                                                            <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={"Upper Limit Breaches"} /></div>
                                                                    <div>
                                                                    
                                                                    {/* {!val.forecastenable &&  */}
                                                                        <TypographyNDL mono variant="label-02-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color:currTheme === 'dark' ? show[index] === true ? '#646464' : '#eeeeee' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={GroupBreachCount?.length > 0 ? GroupBreachCount?.filter((x) => x.id === `${val.metric_val}_${val.id}`)[0]?.upperbreach || '0' : '0'} />
                                                                    {/* } */}
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '35% 40%' }}>
                                                            <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color:currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={"Lower Limit Breaches"} /></div>
                                                                    <div>
                                                                    {/* {!val.forecastenable &&  */}
                                                                        <TypographyNDL mono variant="label-02-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#eeeeee' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={
                                                                            GroupBreachCount?.length > 0 ? GroupBreachCount?.filter((x) => x.id === `${val.metric_val}_${val.id}`)[0]?.lowerbreach || '0' : '0'} />
                                                                    {/* } */}
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                : 
                                                    <>
                                                        <div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '40% 40%' }}>
                                                            <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={!props.selectedMetric[0]?.hierarchy.includes("All Metrics Group") ? `Critical Limit  - ${(breachCount && breachCount.length > 0 && breachCount?.filter((x) => x.iid === `${val.metric_val}_${val.id}`)[0]?.max) ? breachCount?.filter((x) => x.iid === `${val.metric_val}_${val.id}`)[0]?.max + ' ' + val.unit : '-'}` : "Upper Limit Breach"} /></div>
                                                                    <div>
                                                                    {forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                                        <div class="grid">
                                                                            <TypographyNDL mono variant="label-02-s" value={(val.mode && !isNaN(Number(val.mode)) ? Number(val.mode).toFixed(2) : "--") + " " + val.unit} />
                                                                            <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                                <TypographyNDL mono style={{color:"#0F6FFF"}} variant="label-02-s" value={(forecastCalcArray[0].mode && !isNaN(Number(forecastCalcArray[0].mode)) ? Number(forecastCalcArray[0].mode).toFixed(2) : "--") + " " + val.unit} />
                                                                                {getTrendUpDownIcons(Number(forecastCalcArray[0].mode),Number(val.mode))}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    
                                                                    {!val.forecastenable && 
                                                                        <TypographyNDL mono variant="label-02-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#eeeeee' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={`. Breaches - ${breachCount.length > 0 ? breachCount?.filter((x) => x.iid === `${val.metric_val}_${val.id}`)[0]?.upperbreach || '0' : '0'}`} />
                                                                    }
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '40% 40%' }}>
                                                            <div><TypographyNDL variant="sans-label-01-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={!props.selectedMetric[0]?.hierarchy.includes("All Metrics Group") ? `Warning Limit - ${(breachCount && breachCount.length > 0 && breachCount?.filter((x) => x.iid === `${val.metric_val}_${val.id}`)[0]?.min) ? breachCount?.filter((x) => x.iid === `${val.metric_val}_${val.id}`)[0]?.min + ' ' + val.unit : '-' }` :"Lower Limit Breach"} /></div>
                                                                    <div>
                                                                    {forecastconfig && forecastCalcArray.length > 0 && val.forecastenable && 
                                                                        <div class="grid">
                                                                            <TypographyNDL mono variant="label-02-s" value={(val.mode && !isNaN(Number(val.mode)) ? Number(val.mode).toFixed(2) : "--") + " " + val.unit} />
                                                                            <div class="grow shrink basis-0 h-5 justify-start  gap-0.5 flex">
                                                                                <TypographyNDL mono style={{color:"#0F6FFF"}} variant="label-02-s" value={(forecastCalcArray[0].mode && !isNaN(Number(forecastCalcArray[0].mode)) ? Number(forecastCalcArray[0].mode).toFixed(2) : "--") + " " + val.unit} />
                                                                                {getTrendUpDownIcons(Number(forecastCalcArray[0].mode),Number(val.mode))}
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {!val.forecastenable && 
                                                                        <TypographyNDL mono variant="label-02-s" color={show[index] === true ? 'tertiary' : 'secondary'} style={{ color: currTheme === 'dark' ? show[index] === true ? '#646464' : '#eeeeee' : show[index] === true ? '#BBBBBB' : '#646464' }}  value={`. Breaches - ${breachCount.length > 0 ? breachCount?.filter((x) => x.iid === `${val.metric_val}_${val.id}`)[0]?.lowerbreach || '0' : '0'}`} />
                                                                    }
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    </>
                                            }


                                        </div>
                                    </div>
                                        </> )
                                }

                                    
                                    
                                    <div className="flex flex-wrap border-b border-neutral-200"  style={{ borderBottomColor: currTheme === 'dark' && '#2a2a2a' ,alignItems: 'center', padding: '10px', gap: '8px', paddingTop: '14px' }}> 
                                        {props 
                                        && props.selectedMetric 
                                        //  Commented for testing 
                                        && !props.selectedMetric[0]?.hierarchy.includes("All Metrics Group") 
                                        && (
                                            <>
                                                {val.metric_data_type !== 4 && val.metric_data_type !== 5 && !forecastconfig && (
                                                <>
                                                    {
                                                        !buttonClick.comment[index] 
                                                        ? (
                                                            <Comment style={{ cursor: 'pointer' }} stroke={currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' : show[index] === true ? '#BBBBBB' : '#646464'} onClick={() => {
                                                                if(show[index] !== true){
                                                                setButtonClick({ ...buttonClick, comment: { ...buttonClick.comment,[index]: !buttonClick.comment[index] } });
                                                                alertconfig
                                                                    ? showcommentStatus()
                                                                    : props.addcomment(val.metric_val, val.id, val.metric_title)
                                                                }
                                                            }}/>
                                                        ) 
                                                        : (
                                                            <CommentFilled style={{ cursor: 'pointer' }} onClick={() => {
                                                                setButtonClick({ ...buttonClick, comment:{ ...buttonClick.comment,[index]: !buttonClick.comment[index] } });
                                                                alertconfig
                                                                    ? showcommentStatus()
                                                                    : props.addcomment(val.metric_val, val.id, val.metric_title)
                                                            }}/>
                                                        )
                                                    }
                                                </>
                                                    
                                                    
                                                )}

                                                {val.metric_data_type !== 4 && val.metric_data_type !== 5 && (
                                                    props.annotView.includes(`${val.metric_val}_${val.id}`) ? (
                                                        <>
                                                        {!buttonClick.alarm[index] 
                                                            ? (
                                                                <Alarm style={{ cursor: val.alarmcolor === '#bbbbbb' ? undefined :'pointer' }} stroke={currTheme === 'dark' ? show[index] === true ? '#646464' : `${val.alarmcolor}` || '#b4b4b4' :show[index] === true ? '#BBBBBB' : val.alarmcolor || '#646464'} onClick={() => {
                                                                    
                                                                    if(show[index] !== true &&  val.alarmcolor !== '#bbbbbb'){
                                                                        setButtonClick({ ...buttonClick, alarm: { ...buttonClick.alarm, [index]: !buttonClick.alarm[index] } })
                                                                        getBreachCount(val)
                                                                        let brech_count = showBreachCount;
                                                                        brech_count[index] = !brech_count[index]
                                                                        setShowBreachCount(brech_count)
                                                                        val.datapresent && !alertconfig
                                                                            ? props.hideannot(val)
                                                                            : showStatus()
                                                                    }
                                                                    
                                                                }} />
                                                            ) 
                                                            : (
                                                                <AlarmFilled style={{ cursor: 'pointer' }} onClick={() => {
                                                                    
                                                                    setButtonClick({ ...buttonClick, alarm: { ...buttonClick.alarm, [index]: !buttonClick.alarm[index] } })
                                                                    getBreachCount(val)
                                                                    let brech_count = showBreachCount;
                                                                    brech_count[index] = !brech_count[index]
                                                                    setShowBreachCount(brech_count)
                                                                    val.datapresent && !alertconfig
                                                                        ? props.hideannot(val)
                                                                        : showStatus()
                                                                }} />
                                                            )
                                                        }
                                                        </>
                                                    ) : (
                                                        <>
                                                        {!buttonClick.alarm[index] 
                                                            ? (
                                                                <Alarm
                                                                style={{ cursor: val.alarmcolor === '#bbbbbb' ? undefined :'pointer' }}
                                                                stroke={currTheme === 'dark' ? show[index] === true ? '#646464' : `${val.alarmcolor}` || '#b4b4b4' :show[index] === true ? '#BBBBBB' :  `${val.alarmcolor}` || '#646464'}
                                                                    onClick={() => {
                                                                        // console.log("val.alarmcolor", val.alarmcolor)
                                                                        if(show[index] !== true  &&  val.alarmcolor !== '#bbbbbb'){
                                                                            
                                                                            if(buttonClick.alert[index]){
                                                                                // setButtonClick({ ...buttonClick, alert: { ...buttonClick.alert, [index]: false } })
                                                                                // props.setAlertLimitMetric(val)
                                                                                setalertconfig(false);
                                                                            }
                                                                            if(buttonClick.forecast[index]){
                                                                                // setButtonClick({ ...buttonClick, forecast: { ...buttonClick.forecast, [index]: false }})
                                                                                setTimeout(() => {
                                                                                    // loadForecastChartData(forecastconfig,val?.id,val?.metric_val)
                                                                                }, 1000);
                                                                                setForecastconfig(false)
                                                                            }
                                                                            setButtonClick({ ...buttonClick, alarm: { ...buttonClick.alarm, [index]: !buttonClick.alarm[index] }, alert: { ...buttonClick.alert, [index]: false },  forecast: { ...buttonClick.forecast, [index]: false } })
                                                                            getBreachCount(val)
                                                                            let brech_count = showBreachCount;
                             
                                                                            brech_count[index] = !brech_count[index]
                                                   
                                                                            setShowBreachCount(brech_count)
                                                                            // console.log(val.datapresent,'val.datapresent')
                                                                            // val.datapresent && !alertconfig
                                                                            val.datapresent
                                                                                ? props.showannot(val)
                                                                                : showStatus()

                                                                            

                                                                            
                                                                        }

                                                                        
                                                                }}/>
                                                            )
                                                            : (
                                                                <AlarmFilled style={{ cursor: 'pointer' }} onClick={() => {
                                                                    setButtonClick({ ...buttonClick, alarm: { ...buttonClick.alarm, [index]: !buttonClick.alarm[index] } })
                                                                    
                                                                    getBreachCount(val)
                                                                        let brech_count = showBreachCount;
                                                                        brech_count[index] = !brech_count[index]
                                                                        setShowBreachCount(brech_count)
                                                                        val.datapresent && !alertconfig
                                                                            ? props.showannot(val)
                                                                            : showStatus()
                                                                }}/>
                                                            )
                                                        }
                                                        </>
                                                    )
                                                )}

                                                {/* Alert Trend Button */}
                                                {
                                                        !buttonClick.alert[index] ? (
                                                            <AlarmTrend 
                                                                
                                                                style={{ cursor: 'pointer' }}
                                                                stroke={currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' :show[index] === true ? '#BBBBBB' : '#646464'}
                                                                onClick={() => {

                                                                    if(Object.values(buttonClick.alert).filter(z => z === true).length > 0){
                                                                        setOpen('')
                                                                        setOpenSnack(true)
                                                                        setSnackMessage("Already Alarm Trend Selected")
                                                                        setSnackDesc('Please remove it to view this alarm trend')
                                                                        setType("warning")
                                                                    }
                                                                    if(show[index] !== true && Object.values(buttonClick.alert).filter(z => z === true).length <= 0){
                                                                        setButtonClick({ ...buttonClick, alert: { ...buttonClick.alert, [index]: !buttonClick.alert[index] }, alarm: { ...buttonClick.alarm, [index]: false },  forecast: { ...buttonClick.forecast, [index]: false } })
                                                                        props.setAlertLimitMetric(val)
                                                                        if(!alertconfig){
                                                                            
                                                                            // props.disableothermeters(val,true)
                                                                            setLoaderForMeter(true)
                                                                            InstrumentWiseMetric(val.metric_val, val.metric_title)
                                                                            setMetricVal(val.metric_val)
                                                                            setMetricTitle(val.metric_title)
                                                                        }
                                                                        setalertconfig(!alertconfig);

                                                                        if(buttonClick.alarm[index]){
                                                                            // setButtonClick({ ...buttonClick, alarm: { ...buttonClick.alarm, [index]: false } })
                                                                            // getBreachCount(val)
                                                                            let brech_count = showBreachCount;
                                                                            brech_count[index] = false
                                                                            setShowBreachCount(brech_count)
                                                                            props.hideannot(val)
                                                                           
                                                                        }
    
                                                                        if(buttonClick.forecast[index]){
                                                                            // setButtonClick({ ...buttonClick, forecast: { ...buttonClick.forecast, [index]: false }})
                                                                            setTimeout(() => {
                                                                                // loadForecastChartData(forecastconfig,val?.id,val?.metric_val)
                                                                            }, 1000);
                                                                            setForecastconfig(false)
                                                                        }
                                                                    }

                                                                    
                                                                }}
                                                            />
                                                        ) : (
                                                            <AlarmTrendFilled 
                                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                                                onClick={() => {
                                                                    setButtonClick({ ...buttonClick, alert: { ...buttonClick.alert, [index]: !buttonClick.alert[index] } })
                                                                    props.setAlertLimitMetric(val)
                                                                    if(!alertconfig){
                                                                        // props.disableothermeters(val,true)
                                                                        setLoaderForMeter(true)
                                                                        InstrumentWiseMetric(val.metric_val, val.metric_title)
                                                                        setMetricVal(val.metric_val)
                                                                        setMetricTitle(val.metric_title)
                                                                    }  
                                                                    setalertconfig(!alertconfig);
                                                                }}
                                                            />
                                                        )
                                                    }


                                                    {/* Data Forecast */}
                                                    {
                                                        val.isForecast && (<>
                                                    {
                                                        !buttonClick.forecast[index] ? (
                                                            <Forecast 
                                                                stroke={currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' :show[index] === true ? '#BBBBBB' : '#646464'}
                                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                                                onClick={() => {
                                                                    console.clear()
                                                                    console.log(buttonClick)
                                                                    if(Object.values(buttonClick.forecast).filter(z => z === true).length > 0){
                                                                        setOpen('')
                                                                        setOpenSnack(true)
                                                                        setSnackMessage("Already Forecast Selected")
                                                                        setSnackDesc('Please remove it to view this forecasr trend')
                                                                        setType("warning")
                                                                    }
                                                                    if(show[index] !== true && Object.values(buttonClick.forecast).filter(z => z === true).length <= 0){
                                                                        setButtonClick({ ...buttonClick, forecast:{ ...buttonClick.forecast, [index]: !buttonClick.forecast[index] }, alarm: { ...buttonClick.alarm, [index]: false }, alert: { ...buttonClick.alert, [index]: false }})
                                                                        setTimeout(() => {
                                                                            loadForecastChartData(forecastconfig,val?.id,val?.metric_val)
                                                                        }, 1000);
                                                                        setForecastconfig(!forecastconfig)

                                                                        // props.handleForecastSwitch(!e.checked,val?.id,val?.metric_val)
                                                                    }

                                                                    if(buttonClick.alert[index]){
                                                                        // setButtonClick({ ...buttonClick, alert: { ...buttonClick.alert, [index]: false } })
                                                                        props.setAlertLimitMetric(val)
                                                                        setalertconfig(!alertconfig);
                                                                    }
                                                                    if(buttonClick.alarm[index]){
                                                                        // setButtonClick({ ...buttonClick, alarm: { ...buttonClick.alarm, [index]: false } })
                                                                        getBreachCount(val)
                                                                        let brech_count = showBreachCount;
                                                                        brech_count[index] = false
                                                                        setShowBreachCount(brech_count)
                                                                        props.hideannot(val)
                                                                    }
                                                                }} 
                                                            />
                                                        ) : (
                                                            <ForecastFilled
                                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                                                onClick={() => {
                                                                    setButtonClick({ ...buttonClick, forecast: { ...buttonClick.forecast, [index]: !buttonClick.forecast[index] }})
                                                                    setTimeout(() => {
                                                                        loadForecastChartData(forecastconfig,val?.id,val?.metric_val)
                                                                    }, 1000);
                                                                    setForecastconfig(!forecastconfig)
                                                                    // props.handleForecastSwitch(!e.checked,val?.id,val?.metric_val)
                                                                }} 
                                                            />
                                                        )
                                                    }
                                                    </>)
                                                    }
                                            </>
                                        )}
                                        {
                                            props.selectedMetric[0]?.hierarchy.includes("All Metrics Group")  && (
                                                <>{
                                                    !showGroupLimits[index] ? <Alarm style={{ cursor: 'pointer' }} stroke={currTheme === 'dark' ? show[index] === true ? '#646464' : '#b4b4b4' :show[index] === true ? '#BBBBBB' : '#646464'}
                                                   
                                                            onClick={() => {
                                                                setShowGroupLimits({ ...showGroupLimits, [index]: !showGroupLimits[index]})
                                                                getGroupCount(val)
                                                                console.log(val)
                                                            }}
                                                        /> : 
                                                        <AlarmFilled style={{ cursor: 'pointer' }} stroke={show[index] === true ? '#BBBBBB' : '#646464'}
                                                
                                                        onClick={() => {
                                                            setShowGroupLimits({ ...showGroupLimits, [index]: !showGroupLimits[index]})
                                                            getGroupCount(val)
                                                            console.log(val)
                                                        }}
                                                    />
                                                }</>
                                                
                                            )
                                        }
                                        
                                    </div>                                    

                                </div>








                            </>)
                    })
                )
                :
                <React.Fragment></React.Fragment>
            }


        </div>

    )
}