/* eslint-disable no-undef */
/* eslint-disable array-callback-return */

import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import TrendsChart from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/components/TrendsGraph/components/TrendsChart"
import moment from "moment";
import { useRecoilState } from "recoil";
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import useMeterReadingsV1 from "components/layouts/Explore/BrowserContent/hooks/useGetMeterReadingV1";
import { selectedPlant, user, OverviewType, themeMode } from "recoilStore/atoms";  
import { useAuth } from "components/Context";
import Plus from 'assets/neo_icons/Menu/add.svg?react';
import configParam from 'config';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import ApexCharts from 'apexcharts';
import useGetAlarmAcknowledgement from "../hooks/useGetAlarmAcknowledgement";
import useAddAlarmAcknowledgement from "../hooks/useAddAlarmAcknowledgement";
import useGetConnectivityTimelineData from "../hooks/useGetConnectivityTimelineData";
import Chart from "react-apexcharts";
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import Toast from "components/Core/Toast/ToastNDL";
import * as xlsx from 'xlsx'

// NOSONAR
const ActionModal = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode); 
    const [loading, setLoading] = useState(false)
    const [graphdata, setGraphData] = useState([])
    const [headPlant] = useRecoilState(selectedPlant)
    const [types, settypes] = useState('');
    const [currUser] = useRecoilState(user);
    const [dialogMode, setDialogMode] = useState('')
    const { meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error, getMeterReadingsV1 } = useMeterReadingsV1()
    const [instrumentname, setinstrumentname] = useState('')
    const [assetname, setassetname] = useState('')
    const [assetID, setassetID] = useState('')
    const [trendData, setTrendData] = useState('') 
    const [addAcknowledgeDialog, setAddAcknowledgeDialog ] = useState(false)
    const alarmAcknowledgementRef = useRef(); 
    const { HF } = useAuth();
    const [OverviewTypes] = useRecoilState(OverviewType)
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const [metricsAlarm, setMetricsAlarm] = useState([]);
    const [currAlarmStatus, setCurrAlarmStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [alarmAcknowledge, setAlarmAcknowledge] = useState('')
    const [AckErrMsg,setAckErrMsg] = useState('')
    const [chkAcknowledge, setChkAcknowledge] = useState(false)
    const [isAlarmAcknowledged, setIsAlarmAcknowledged] = useState(false)
    const [timelineData, setTimelineData] = useState([])
    const { getAlarmAcknowledgementLoading, getAlarmAcknowledgementData, getAlarmAcknowledgement } = useGetAlarmAcknowledgement()
    const { addAlarmAcknowledgementLoading, addAlarmAcknowledgementData, addAlarmAcknowledgementError, getAddAlarmAcknowledgement } = useAddAlarmAcknowledgement()
    const { ConnectivityTimelineLoading, ConnectivityTimelineData, ConnectivityTimelineError, getConnectivityTimelineData } = useGetConnectivityTimelineData()

    let lastZoom1 = null; 
    useImperativeHandle(ref, () =>
    (
        {
            getTrendgraph: (data, EntityName, instrumentName, dialogMode) => {
                setLoading(true) 
                setinstrumentname(instrumentName)
                setassetname(EntityName) 
                setTrendData(data) 
                if (OverviewTypes === 'connectivity') {
                    let fromDate = moment(data.alarmTriggeredTime).subtract(12, 'hours').format("YYYY-MM-DD HH:mm:ssZ")
                    let toDate = moment(data.alarmTriggeredTime).add(12, 'hours').format("YYYY-MM-DD HH:mm:ssZ")
                    setStartDate(fromDate)
                    setEndDate(toDate)

                    let body = {
                        schema: headPlant.schema,
                        line_id: headPlant.id,
                        instrument_id: data.instrument_id,
                        from: fromDate,
                        to: toDate
                    }
                    getConnectivityTimelineData(body)
                } else {
                    let fromDate = moment(data.alarmTriggeredTime).subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ssZ")
                    let toDate = moment(data.alarmTriggeredTime).add(24, 'hours').format("YYYY-MM-DD HH:mm:ssZ")
                    setStartDate(fromDate)
                    setEndDate(toDate)
                    getMeterReadingsV1(headPlant.schema, data.instrument_id, data.metricKey || data.metric_name, fromDate, toDate)
                }
                
                setDialogMode(dialogMode)
            },
            handleAcknowledge: (data, line_id, selectedType, metricAlarm, alarmStatus, dialogMode, type) => {
                setTrendData(data)
                setMetricsAlarm(metricAlarm)
                setCurrAlarmStatus(alarmStatus)
                const body = {
                    type: selectedType
                }
                getAlarmAcknowledgement(body)
                setDialogMode(dialogMode)
                settypes(type)
            },
            handleCreateTask: (data, EntityName, instrumentName, EntityID, dialogMode) => { 
                setinstrumentname(instrumentName)
                setassetname(EntityName)
                setassetID(EntityID)
                setTrendData(data)
                setDialogMode(dialogMode) 
            },
            
        }
    )
    )

    const handleClick = () => {
        // if (types === "bulkack" && dialogMode === "Acknowledge") {
        //     handleAddAlarmAcknowlwdgement();
        // } else 
        if (dialogMode === "Acknowledge") {
            fnAcknowledge();
        } else {
            fnCreateTask();
        }
    };    

    const getChartData = (chartdata) => {

        if(chartdata && chartdata.length > 0){

            let finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
            let graphLimits = []
            let tempObj = {
                name: trendData.metricKey + " (" + trendData.instrument_id + ")",
                id: trendData.instrument_id,
                color: "#4caf50",
                data: [],
                type: "line"
            }
    
            if(trendData.alarmStatus !== "ok"){
                if (trendData.alarmType === "inside_the_range" || trendData.alarmType === "outside_the_range") {
                    let temp = {
                        id: trendData.metricKey,
                        y: trendData.maxValue,
                        borderColor: '#DA1E28',
                        seriesIndex: 0,
                        label: {
                            borderColor: '#DA1E28',
                            style: {
                                color: '#fff',
                                background: '#DA1E28',
                            },
                            text: 'Max'
                        },
        
                    }
                    let temp1 = {
                        id: trendData.metricKey,
                        y: trendData.minValue,
                        borderColor: '#FF815A',
                        seriesIndex: 0,
                        label: {
                            borderColor: '#FF815A',
                            style: {
                                color: '#fff',
                                background: '#FF815A',
                            },
                            text: 'Min'
                        },
        
                    }
                    graphLimits.push(temp, temp1)
                }
                else if(trendData.alarmType === "above" || trendData.alarmType === "below") {
                    let temp = {
                        id: trendData.metricKey,
                        y: trendData.alarmLimitValue,
                        borderColor: trendData.alarmStatus === "critical" ? '#DA1E28' : '#FF815A',
                        seriesIndex: 0,
                        label: {
                            borderColor: trendData.alarmStatus === "critical" ? '#DA1E28' : '#FF815A',
                            style: {
                                color: '#fff',
                                background: trendData.alarmStatus === "critical" ? '#DA1E28' : '#FF815A',
                            },
                            text: trendData.alarmStatus
                        }
        
                    }
                    graphLimits.push(temp)
                }
            }
             
            chartdata.map((a) => {
                let obj = {
                    x: new Date(a.time).getTime(),
                    y: a.value !== null ? (!isNaN(Number(a.value)) ? Number(a.value).toFixed(2) : null) : null
                }
                tempObj.data.push(obj)
                
            })
            
            finalDataArr.data.push(tempObj)
    
            setGraphData(finalDataArr)
    
            setTimeout(() => {
                if (document.getElementById('apexchartstrendChart') && document.getElementById('apexchartstrendChart').getElementsByClassName('apexcharts-menu-item exportCSV')[0]) {
                    document.getElementById('apexchartstrendChart').getElementsByClassName('apexcharts-menu-item exportCSV')[0].style.display = 'none'
                }

                if(graphLimits.length > 0){
                    graphLimits.forEach(element => {
                        ApexCharts.exec('trendChart', 'addYaxisAnnotation', element)
                    });
                }
                
            }, 500)
    
            setLoading(false)
            //console.log("graphLimits", graphLimits)
        }
        else{
            SetMessage(t('No Data'))
            SetType("warning")
            setOpenSnack(true)
        }
        
    }

    useEffect(() => {

        if (!meterReadingsV1Loading && meterReadingsV1Data && !meterReadingsV1Error) {
            if (meterReadingsV1Data && meterReadingsV1Data.data && meterReadingsV1Data.data.length > 0) { 
                getChartData(meterReadingsV1Data.data)
                setLoading(false)
            }
            else{
                SetMessage(t('No Data'))
                SetType("warning")
                setOpenSnack(true)
                setLoading(false)
                props.handleAlarmOverviewDialogClose()
            }
        } else if (meterReadingsV1Error) {
            setLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meterReadingsV1Loading, meterReadingsV1Data, meterReadingsV1Error])

    useEffect(() => {

        if (!ConnectivityTimelineLoading && ConnectivityTimelineData && !ConnectivityTimelineError) {
            if (ConnectivityTimelineData && ConnectivityTimelineData.length > 0) { 
                let StatusData = ConnectivityTimelineData.map(v=> 
                    {return {...v,data : v.data.map(e=> {return {...e,y : e.y.map(x=> {return new Date(moment(x).subtract(moment(x).isDST() ? 1 : 0,'hour')).getTime()})}})}})
                setTimelineData(StatusData)
                setLoading(false) 
            }
            else{
                SetMessage(t('No Data'))
                SetType("warning")
                setOpenSnack(true)
                setLoading(false)
                props.handleAlarmOverviewDialogClose()
            }
        } else if (ConnectivityTimelineError) {
            setLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ConnectivityTimelineLoading, ConnectivityTimelineData, ConnectivityTimelineError]) 
    useEffect(() => {

        if (!addAlarmAcknowledgementLoading && addAlarmAcknowledgementData && !addAlarmAcknowledgementError) {

            if(addAlarmAcknowledgementData.affected_rows >= 1){
                if(types ==="bulkack"){ 
                    props.handleSaveAlarmAcknowlwdgement(trendData, OverviewTypes !== "downtime" ? addAlarmAcknowledgementData.returning[0].id : 1, chkAcknowledge)
                }
                SetMessage(t('Added Alarm Acknowledgement Successfully'))
                SetType("success")
                setOpenSnack(true)
                setAddAcknowledgeDialog(false)
                const body = {
                    type: OverviewTypes
                }
                getAlarmAcknowledgement(body)
            }
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addAlarmAcknowledgementData])

    const timeFormat = (val) => {
        return moment(val).format("DD-MM-YYYY " + HF.HMS);
    }

    const fnCreateTask = () => {
        let trendsData = trendData;
    if (trendsData && typeof trendsData === "object" && trendsData.SNo) {
        trendsData = {
            ...trendsData,
            TriggeredAt: new Date(trendsData.TriggeredAt.split('/').reverse().join('-')).toISOString(),
            CheckedAt: new Date(trendsData.CheckedAt.split('/').reverse().join('-')).toISOString()
        };
    }
        let Title = ""
        let Description =""
        if(OverviewTypes === 'connectivity') {
            if(trendsData.SNo){
            Title = trendsData.Instrument + ' - ' + trendsData.Criticality + ' Alarm Checked At @ ' + timeFormat(trendsData.CheckedAt)
            } else {
            Title = instrumentname + ' - ' + trendsData.alarmStatus + ' Alarm Checked At @ ' + timeFormat(trendsData.alarmTriggeredTime)
            }
             Description = ""
        }
        else{
            if(trendsData.SNo){
                Title = trendsData.Instrument + ' - ' + trendsData.Criticality + ' Alarm Triggered @ ' + timeFormat(trendsData.TriggeredAt)
            Description = trendsData.Metrics + ' - Alert value ' + trendsData.EventValue + ' @ ' + timeFormat(trendsData.CheckedAt) + ' (limit - ' + trendsData.LimitValue + ')'
            } else {
            Title = instrumentname + ' - ' + trendsData.alarmStatus + ' Alarm Triggered @ ' + timeFormat(trendsData.alarmTriggeredTime)
            Description = trendsData.metricName + ' - Alert value ' + trendsData.alarmValue + ' @ ' + timeFormat(trendsData.alarmValueTime) + ' (limit - ' + trendsData.alarmLimitValue + ')'
            }
        }
        
        let plantSchema = localStorage.getItem('plantid') ? localStorage.getItem('plantid') : headPlant.plant_name
        if(trendsData.SNo){
            localStorage.setItem("createTaskFromAlarm", JSON.stringify({ state: { title: Title, description: Description, entity_id: trendsData.assetID, instrument: {id: trendsData.iid }, instrument_status_type:{id: trendsData.Criticality === "critical" ? 3 : trendsData.Criticality === "warning" ? 2 : trendsData.Criticality === "ok" ? 1 : 0}, taskPriority: {id: 14}, taskType: {id: 15}, taskStatus: {id: 1}, metricKey: trendsData.metricKey ? trendsData.metricKey : "", alarmStatus: trendsData.Criticality, alarmType: OverviewTypes, time: trendsData.TriggeredAt } }))
        } else {
        localStorage.setItem("createTaskFromAlarm", JSON.stringify({ state: { title: Title, description: Description, entity_id: assetID, instrument: {id: trendsData.instrument_id }, instrument_status_type:{id: trendsData.alarmStatus === "critical" ? 3 : trendsData.alarmStatus === "warning" ? 2 : trendsData.alarmStatus === "ok" ? 1 : 0}, taskPriority: {id: 14}, taskType: {id: 15}, taskStatus: {id: 1}, metricKey: trendsData.metricKey ? trendsData.metricKey : "", alarmStatus: trendsData.alarmStatus, alarmType: OverviewTypes, time: trendsData.alarmTriggeredTime } }))
        }
        props.handleAlarmOverviewDialogClose()
        // window.open(configParam.APP_URL + '/'+plantSchema+'/Tasks/form' )
        window.open(configParam.APP_URL + '/'+plantSchema+'/Tasks/newtask' )
    }

    const fnAcknowledge = () => { 
        if(OverviewTypes !== "downtime"){
            if (!alarmAcknowledge) {
                setIsAlarmAcknowledged(true)
                return false;
            }
            else{
                setIsAlarmAcknowledged(false)
            }
        }
        
        if (!isAlarmAcknowledged) { 
            props.handleSaveAlarmAcknowlwdgement(trendData, OverviewTypes !== "downtime" ? alarmAcknowledge : 1, chkAcknowledge)
        } 
    }
    
    const handleAddAlarmAcknowlwdgement = () => { 
        if(alarmAcknowledgementRef.current.value){
            getAddAlarmAcknowledgement(alarmAcknowledgementRef.current.value, OverviewTypes, headPlant.id, currUser.id)
            setAckErrMsg('')
        }else{
            setAckErrMsg('Enter Alarm Acknowledgement')
            return false
        }
    }

    const handleCreateAcknowledgeType = () => {
        setAddAcknowledgeDialog(true) 
    }

    const handleCloseAcknowledgeType = () => {
        setAddAcknowledgeDialog(false)
        setAckErrMsg('') 
    }

    const handleDownloadTrendData = (yData) => {

        if (yData.data && yData.data.length > 0) {

          
            let timestamps = []

            yData.data.forEach((item) => {
            
                let categoryX = item.data.map((i) => { return i.x })

            
                timestamps.push(...[...categoryX]);
            })

            let filterTimestamps = timestamps.filter((item,
                index) => timestamps.indexOf(item) === index);

            // Sort the array of timestamps
            const convertToTimestamp = (timestamp) => new Date(timestamp);

            const compareTimestamps = (a, b) => convertToTimestamp(b) - convertToTimestamp(a);
            
            const sortedTimestamps = filterTimestamps.slice(); // Create a copy of the array
            sortedTimestamps.sort(compareTimestamps);
            sortedTimestamps.reverse();
            let finalTrendData = [];

            filterTimestamps.forEach((date) => {
                let objResult = {};
                yData.data.forEach((item) => {
                    let yValue = item.data.filter((e) => e.x === date);

                    let data = {
                        "Range": moment(new Date(date)).subtract(moment(date).isDST() ? 1 : 0, 'hour').format('Do MMM YYYY ' + HF.HMSS),
                        [item.name]: yValue.length > 0 ? yValue[0].y : ""
                    };
                    Object.assign(objResult, data);
                });
                finalTrendData.push(objResult);
            });

            downloadExcel(finalTrendData, "trendsChartData - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
        }
    }

    //CSV Download
    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    };

    const handleAlarmAcknowledgement = (e) => {
        setIsAlarmAcknowledged(false)
        setAlarmAcknowledge(e.target.value)
    }


    const handleCheckAcknowledge = (e) => {
        setChkAcknowledge(e.target.checked)
    }

    return (
        <React.Fragment>
            <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
            <React.Fragment>
                <ModalHeaderNDL>
                    <div style={{ display: "block" }}>
                        <TypographyNDL variant="heading-02-s" value={dialogMode === "trend" && OverviewTypes !== "connectivity" ? t("View Trend") : dialogMode === "trend" && OverviewTypes === "connectivity" ? t("View Timeline") : dialogMode === "Acknowledge" ? t("Alarm Acknowledgement") : dialogMode === "CreateTask" ? t("Confirmation") : ""} />
                        {
                            dialogMode === "trend" &&
                            <TypographyNDL variant="lable-01-s" value={((assetname ? assetname + " - " : "") + instrumentname + " - " + trendData.metricName ? trendData.metricName : "")} />
                        }
                    </div>
                </ModalHeaderNDL>
                {loading && <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>}
                <ModalContentNDL height>
              
                    {dialogMode === "trend" ?
                        // <div style={{ height: "100%" }}>
                        //     <TrendsChart yData={graphdata} disableMeter={true} yaxistitle={trendData.metricName} />
                        // </div>
                        <div className="h-[75vh]">
                        <React.Fragment>
                            {OverviewTypes !== "connectivity" ?
                            <React.Fragment>
                                <div className="float-right">
                                <Button type={"ghost"} icon={Download} onClick={() => handleDownloadTrendData(graphdata)} />
                                </div>
                            <div style={{ height: "90%", marginRight: 30}}>
                                <TrendsChart yData={graphdata} disableMeter={true} yaxistitle={trendData.metricName}/>
                            </div>
                            </React.Fragment>
                            :
                            <div style={{ height: "100%" }}>

                                {
                                    <Chart
                                        height={85}
                                        width={'100%'}
                                        options={{
                                            theme: {
                                                mode: curTheme
                                            },
                                            chart: {
                                                id: "asset_status_data",
                                                background: '0',
                                                type: 'rangeBar',
                                                sparkline: {
                                                    enabled: false,
                                                },
                                                toolbar: {
                                                    show: true
                                                },
                                                events: {
                                                    zoomed: (_, value) => {
                                                        lastZoom1 = [value.xaxis.min, value.xaxis.max];
                                                    },
                                                    beforeZoom: function (chartContext, opts) { 
                                                        return {
                                                            xaxis: {
                                                                min: opts.xaxis.min,
                                                                max: opts.xaxis.max
                                                            }
                                                        }
                                                    },
                                                    beforeResetZoom: function (chartContext, opts) {
                                                        lastZoom1 = null;
                                                        return {
                                                            xaxis: {
                                                                min: new Date(startDate).getTime(),
                                                                max: new Date(endDate).getTime()
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            grid: {
                                                padding: {
                                                    right: 0,
                                                    left: 0
                                                }
                                            },
                                            plotOptions: {
                                                bar: {
                                                    horizontal: true,
                                                    barHeight: '100%',
                                                    rangeBarGroupRows: true
                                                }
                                            },
                                            colors: ['#76A43D', '#DA1E28', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF', '#AAC9FF'],
                                            fill: {
                                                type: ['solid', 'pattern', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid', 'solid'],
                                                pattern: {
                                                    style: 'slantedLines',
                                                    width: 4,
                                                    height: 18,
                                                    strokeWidth: 2,

                                                },
                                            },

                                            xaxis: {
                                                type: 'datetime',
                                                labels: {
                                                    rotate: 0,
                                                    datetimeUTC: false,
                                                    format: "dd-MMM HH:mm",
                                                    style: {
                                                        colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                                                    },
                                                },
                                                min: lastZoom1 ? lastZoom1[0] : new Date(startDate).getTime(),
                                                max: lastZoom1 ? lastZoom1[1] : new Date(endDate).getTime()
                                                // min: new Date('2023-06-25 00:00:00').getTime(),
                                                // max: new Date('2023-06-25 23:59:59').getTime()
                                            },
                                            legend: {
                                                show: false
                                            },
                                            tooltip: {
                                                enabled: false,
                                            }
                                        }}
                                        series={timelineData}
                                        type="rangeBar"
                                    />
                                }
                            </div>
                            }
                        </React.Fragment>   
                        </div>
                        :
                        // NOSONAR
                        dialogMode === "Acknowledge" ?
                            <div>
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <TypographyNDL variant="paragraph-s" color='text-secondary' value={t("You are about to acknowledge this alarm. This action confirms that you are aware of this existing alarm and this action cannot be undone.  Please review the alarm details carefully before proceeding.")} ></TypographyNDL>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                    <div className="flex items-end w-full">
                                        {/* {types === "bulkack" ? (
                                            <div className="w-[95%]">
                                            <InputFieldNDL
                                                id="txtAcknowledgement"
                                                placeholder={t('Alarm Acknowledgement')}
                                                inputRef={alarmAcknowledgementRef}
                                                width={"150px"}
                                            />
                                             </div>
                                        ) : (
                                            OverviewTypes !== 'downtime' && ( */}
                                                <div className="flex items-end w-full">
                                                    <SelectBox
                                                        labelId="select-acknowledge-label"
                                                        label=""
                                                        id="select-acknowledge"
                                                        placeholder={t("Select Acknowledge")}
                                                        auto={false}
                                                        options={
                                                            getAlarmAcknowledgementData && getAlarmAcknowledgementData.length > 0
                                                                ? getAlarmAcknowledgementData
                                                                : []
                                                        }
                                                        isMArray={true}
                                                        value={alarmAcknowledge}
                                                        onChange={handleAlarmAcknowledgement}
                                                        keyValue="name"
                                                        keyId="id"
                                                        optionloader={getAlarmAcknowledgementLoading}
                                                        multiple={false}
                                                        checkbox={false}
                                                        error={isAlarmAcknowledged}
                                                        msg={
                                                            isAlarmAcknowledged
                                                                ? t("Please Select Alarm Acknowledgement")
                                                                : undefined
                                                        }
                                                    />
                                                    <Button
                                                        id="reason-update"
                                                        type="ghost"
                                                        icon={Plus}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCreateAcknowledgeType();
                                                        }}
                                                    />
                                                </div>
                                            {/* )
                                        )} */}
                                    </div>
                                </Grid>
                                    {types !== "his" && types !== "bulkack" &&
                                        <Grid item xs={12} sm={12}>
                                            <CustomSwitch
                                                id={'chkAcknowledge'}
                                                switch={false}
                                                checked={chkAcknowledge}
                                                onChange={handleCheckAcknowledge}
                                                primaryLabel={t('Acknowledge remaining ') + (metricsAlarm.length > 0 ?(metricsAlarm.length-1).toString() : '0') + ' ' + currAlarmStatus + t(' alarms for this metric')}
                                                //primaryLabel={t('Acknowledge remaining ' + metricsAlarm.length + ' ' + currAlarmStatus + ' alarms for this metric')}
                                            />
                                        </Grid>
                                       }
                                </Grid>
                            </div>
                            :
                            dialogMode === "CreateTask" ?
                                <TypographyNDL  variant='paragraph-s' color='secondary' value={t("Do you really want to create task for this alarm? This action confirms that you are aware of this existing alarm. This will open in new tab.")} ></TypographyNDL>
                                :
                                <React.Fragment></React.Fragment>
                    }


                
                </ModalContentNDL>
                <ModalFooterNDL>


                    <Button type="secondary"  value={dialogMode === "trend" ? t("Close") : t('Cancel')} onClick={() => props.handleAlarmOverviewDialogClose()} />
                    {(dialogMode !== "trend") && <Button type="primary" style={{ width: dialogMode === "Acknowledge" ? "100px" : "80px" }} value={dialogMode === "Acknowledge" ? t("Acknowledge") : t("Proceed")}  onClick={handleClick}/>}

                </ModalFooterNDL>
            </React.Fragment >

            <React.Fragment>
                <ModalNDL open={addAcknowledgeDialog}  >
                    <ModalHeaderNDL>
                        <TypographyNDL variant="heading-02-xs" value={t("Add Alarm Acknowledgement")} ></TypographyNDL>
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        <InputFieldNDL
                        id="txtAcknowledgement"
                        placeholder={t('Alarm Acknowledgement')}
                        inputRef={alarmAcknowledgementRef}
                        label={t('Alarm Acknowledgement')}
                        error={AckErrMsg ? true : false}
                        helperText={AckErrMsg}
                        >
                        </InputFieldNDL>
                    </ModalContentNDL>
                    <ModalFooterNDL>
                        <Button type="secondary" value={t('Cancel')} onClick={() => handleCloseAcknowledgeType()} />
                        <Button type="primary" value={t('Save')} onClick={handleAddAlarmAcknowlwdgement} />
                    </ModalFooterNDL>
                </ModalNDL>

            </React.Fragment>
        </React.Fragment>

    )
})
export default ActionModal;