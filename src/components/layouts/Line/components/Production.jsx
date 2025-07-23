import React, { useState,useEffect } from "react";
import useTheme from "TailwindTheme"; 
import Grid from 'components/Core/GridNDL'
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Chart from "react-apexcharts";
import Typography from 'components/Core/Typography/TypographyNDL';
import Card from "components/Core/KPICards/KpiCardsNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import { useRecoilState } from "recoil";
import {
 lineAssetArray, snackToggle, snackMessage, snackType, selectedPlant, themeMode, dashBtnGrp, Loadingpanel,customdates
} from "recoilStore/atoms"; 
import configParam from "config";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import { useTranslation } from 'react-i18next';
import CriticalBadge from 'assets/neo_icons/Notification/Critical.svg?react';
import WarnBadge from 'assets/neo_icons/Notification/Warning.svg?react';
import useAssetOEE from "components/layouts/Reports/DowntimeReport/hooks/useAssetOEE";
import useReasonList from "Hooks/useReasonList";
import useMachinestatussignal from "components/layouts/Line/hooks/useMachinestatussignal";
import usePaginationAlerts from "components/layouts/Line/hooks/usePaginationAlerts";
import useTaskList from "components/layouts/Tasks/hooks/useTaskList.jsx";
import useEnergyLineData from "components/layouts/Line/hooks/useEnergyLineData";
import useCycleTime from 'components/layouts/Dashboards/Content/standard/hooks/useCycleTime.jsx';
import usePartsProduced from 'Hooks/usePartsProduced';
import usePartsSummary from 'components/layouts/Dashboards/Content/standard/hooks/usePartsSummary';
import useAssetStatus from 'Hooks/useAssetStatus';
import useQualityDefects from 'Hooks/useQualityDefects';
import moment from 'moment';
import TablePagination from 'components/Table/TablePagination';
import SolidGauge from "components/Core/SolidGauge/SolidGauge";

export default function Production() {
    const theme = useTheme()
    const [curTheme] = useRecoilState(themeMode);
    const [headPlant] = useRecoilState(selectedPlant);
    const [LoadPanel,setLoadPanel] = useRecoilState(Loadingpanel);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [count, setCount] = useState(0);
    const { t } = useTranslation();
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [oEE, setOEE] = useState({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 });
    const [assetID] = useRecoilState(lineAssetArray);
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [alarmData,setalarmData] = useState([]);
    const [taskData,settaskData] = useState([]);
    const [energy,setLineEnergy] = useState(0);
    const [noProducts,] = useState(0);
    const [noExecution,setnoExecution] = useState(0);
    const [assetStatusData, setAssetStatusData] = useState([]); 
    const [customdatesval,] = useRecoilState(customdates);
    const [AssetOeeData,setAssetOeeData] = useState([]); 
    const [rangeStart, setRangeStart] = useState(new Date());
    const [rangeEnd, setRangeEnd] = useState(new Date());
    const { AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, getAssetOEEConfigsofEntity } = useAssetOEE()
    const {reasonLoading, reasonData, reasonError, getReasonList}= useReasonList()
    const {MachinestatussignalLoading, MachinestatussignalData, MachinestatussignalError, getMachinestatussignal}= useMachinestatussignal() 
    const { PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsError, getPaginationAlerts } = usePaginationAlerts() 
    const { cycleLoading, cycleData, cycleError, getCycleTime } = useCycleTime();
    const { partLoading, partData, partError, getPartsCompleted } = usePartsProduced();
    const { partSumLoading, partSumData, partSumError, getPartsPerHour } = usePartsSummary();
    const { assetStatLoading, assetStatData, assetStatError, geAssetStatus } = useAssetStatus();
    const { qualDefLoading, qualDefData, qualDefError, getQualityDefects } = useQualityDefects();
    const { TaskListLoading, TaskListData, TaskListError, getTaskList } = useTaskList()
    const {EnergyLineDataLoading, EnergyLineDataData, EnergyLineDataError, getEnergyLineData} =useEnergyLineData()
    
    
    const classes ={ 
        card: {
            backgroundColor: theme.colorPalette.cards,
            width: "20%",
            margin: '0 10px',
            padding: 12,
            border: `1px solid ${theme.colorPalette.divider}`
        } 
    }
 
    var temp = [
        {
            name: 'ACTIVE',
            data: []
        },
        {
            name: 'IDLE',
            data: []
        }
    ]


    useEffect(() => {
        getTaskList(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        // console.log(assetID,"assetID")
        setAssetStatusData([]) 
        setTimeout(()=>{
            getAssetOEEConfigs();  
        },200)  
        getAlertNotifications(page, rowsPerPage, "") 
        if(btGroupValue === 6 || btGroupValue === 10 || btGroupValue === 11 || btGroupValue === 7 || btGroupValue === 9){
            getEnergyLineData({start:moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ") , end:moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")})
        }else{
            getEnergyLineData({start:'' , end:''})
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetID,customdatesval])

    useEffect(() => {
        // console.log(reasonData,"reasonData",AssetOeeData)
        if (!reasonLoading && !reasonError && reasonData) {
            if (reasonData.length === 0) { 
                SetMessage( t("ProdDashNoReason"))
                SetType("warning")
                setOpenSnack(true)
            }
            // console.log("returndata s",oeeData.neo_skeleton_prod_asset_oee_config, reasonsData); 
            // eslint-disable-next-line array-callback-return, react-hooks/exhaustive-deps
            temp = [
                {
                    name: 'ACTIVE',
                    data: []
                },
                {
                    name: 'IDLE',
                    data: []
                }
            ]
            
            // eslint-disable-next-line array-callback-return
            AssetOeeData.forEach((val, i) => {
                setLoadPanel(true);
                getTrendAndStatus(val);
              });
              

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reasonLoading, reasonData, reasonLoading])

    useEffect(() => {
        if (!AssetOEEConfigsofEntityLoading && !AssetOEEConfigsofEntityError && AssetOEEConfigsofEntityData) {
            let oeeData = AssetOEEConfigsofEntityData
            // console.log(AssetOEEConfigsofEntityData,"AssetOEEConfigsofEntityData")
            setAssetOeeData(AssetOEEConfigsofEntityData) 
            if (oeeData.length > 0) {
                triggerOEE(oeeData)
                if(oeeData[0].entity.prod_execs.length !== 0){ 
                    setnoExecution(oeeData[0].entity.prod_execs.length)
                    getReasonList()
                }else if (oeeData[0].entity.prod_execs.length === 0) {
                    getReasonList() 
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityLoading])
 
    useEffect(() => { 
        if (!MachinestatussignalLoading && !MachinestatussignalError && MachinestatussignalData) {
            setAssetStatusData(MachinestatussignalData)
            setLoadPanel(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MachinestatussignalLoading, MachinestatussignalData, MachinestatussignalLoading])

    useEffect(() => {
        if (!PaginationAlertsLoading && !PaginationAlertsError && PaginationAlertsData) {
            let res = PaginationAlertsData.Data
            if (res && Number(res.count) > 0) {
                setCount(res.count);
                if (res.data && res.data.length > 0) { 
                    setalarmData(res.data);
        
                } else {
                    setalarmData([]);
                }
            } else {
                setCount(0);
                setalarmData([]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsLoading])

    useEffect(()=>{
        if (!TaskListLoading && !TaskListError && TaskListData) {
            // console.log(TaskListData,"TaskListDataTaskListData")
            if(assetID.length > 0){
                settaskData(TaskListData.filter(e=>e.entity_id === assetID.toString()));
            }
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[TaskListLoading, TaskListData, TaskListLoading,assetID])

    useEffect(() => {
        if ((!cycleError && !cycleLoading && cycleData) && (!partError && !partLoading && partData) && (!partSumError && !partSumLoading && partSumData) && (!assetStatError && !assetStatLoading && assetStatData) && (!qualDefError && !qualDefLoading && qualDefData)) {
            var oee = configParam.OEE_PROD_VALUE({start:rangeStart, end: moment(Math.min(new Date(), new Date(rangeEnd))).format('YYYY-MM-DDTHH:mm:ssZ')}, {job_exp_cycle_time: cycleData[0].cycleTime, mode_exp_cycle_time: partData[0].cycleTime, part_act_cycle_time: partData[0].actCycleTime}, partData && partData[0].data?partData[0].data.length:0, assetStatData[0].dTime, assetStatData[0].totalDTime, qualDefData && qualDefData.length>0 && qualDefData[0].loss ? qualDefData[0].loss : 0)
            // console.log(oee,"Oeeeeeeeeeee")
            setOEE(oee)
            // setProgressBar(false)
        }
        else if(!cycleLoading && !partLoading && !partSumLoading && !assetStatLoading && !qualDefLoading){
            setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })
            // setProgressBar(false)
        }
        // console.log(cycleLoading, cycleError,cycleData, partLoading, partError,partData, partSumLoading, partSumError, assetStatLoading, assetStatError, qualDefLoading, qualDefError,"cycleLoading, cycleError, partLoading, partError, partSumLoading, partSumError, assetStatLoading, assetStatError, qualDefLoading, qualDefError")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cycleLoading, cycleError, partLoading, partError, partSumLoading, partSumError, assetStatLoading, assetStatError, qualDefLoading, qualDefError])

    useEffect(()=>{
        if (!EnergyLineDataLoading && !EnergyLineDataError && EnergyLineDataData) {  
                if(EnergyLineDataData.data.dayData){
                    // eslint-disable-next-line array-callback-return
                    EnergyLineDataData.data.dayData.map((data) => {
                        let formula = EnergyLineDataData.data.vi.formula
                        if(data.length > 0){
                            // eslint-disable-next-line array-callback-return
                            data.map((val) => {
                                let total = val.endReading - val.startReading;
                                total = total < 0 || total === null? 0:total;
                                formula = formula.replace(val.iid + "." + val.key, total)
                            })
                            formula = formula.replace(/\d+.kwh/g,0);
                            formula = formula.replace(/\n/g, '')
                            // console.log(calcFormula(formula),"formula",formula);
                            // eslint-disable-next-line no-eval
                            setLineEnergy(parseInt(calcFormula(formula)))
                        }                        
                    }) 
                }
              
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[EnergyLineDataLoading, EnergyLineDataData, EnergyLineDataLoading])
  
    function getAssetOEEConfigs() {  
        // console.log("TEST HERE",assetID)
        if (assetID.length > 0) {
            getAssetOEEConfigsofEntity(assetID) 
            settaskData(TaskListData.filter(e=>e.entity_id === assetID.toString()));
        }
        else {
            console.log("returndata undefined getAssetOEEConfigsofEntity2");
        }
    }
    
    async function triggerOEE(data,isRepeat) {  
        // console.log(data,"triggerOEE")
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ");
        let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"); 
        let val = data[0]
        let shiftAvailable = true; 
        getCycleTime(data, 'now()', 'now()')             
        if (btGroupValue === 10) {
            if (!cycleError && cycleData) {
                startrange = moment(cycleData[0].jobStart).format('YYYY-MM-DDTHH:mm:ssZ')
                endrange = moment(cycleData[0].jobEnd).format('YYYY-MM-DDTHH:mm:ssZ')
            }
            else {
                startrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
                endrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
            } 
        } 
        if (shiftAvailable && val) { 
            setRangeStart(startrange)
            setRangeEnd(endrange)
            getPartsCompleted(headPlant.schema, data, startrange, endrange,isRepeat,partData &&partData.length>0&&partData[0].data?partData[0].data:[])
            // getDressingCount(headPlant.schema,data,startrange,endrange)
            
            getPartsPerHour({schema:headPlant.schema,instrument :val.part_signal_instrument,metric:val.metric.name},{start:startrange,end:endrange},val.is_part_count_binary, val.is_part_count_downfall, val.dressing_program === null ? "" : val.dressing_program, val.metricByDressingSignal && val.metricByDressingSignal.name ? val.metricByDressingSignal.name : "","Perhour")
            geAssetStatus(headPlant.schema, data, startrange, endrange)
            getQualityDefects(data, startrange, endrange)
            // getDownTimeReason(val.entity_id, startrange, endrange)
        } 
        
        setLoadPanel(false); 
    }
    

    function getTrendAndStatus(val) {
       
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss");
        let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss");
        
        const body2 = {
            schema: headPlant.schema,
            instrument_id: val.instrumentByMachineStatusSignalInstrument.id,
            metric_name: val.metricByMachineStatusSignal.name,
            start_date: startrange,
            end_date: endrange,
            mic_stop: val.mic_stop_duration,
            active_signal: val.is_status_signal_available,
            downfall: val.is_part_count_downfall
        }  
        // console.log(body2,"body2getMachinestatussignal")
        getMachinestatussignal(body2,val,temp,btGroupValue,headPlant)
                   
    }

    function getBadge(type) { 
        switch (type) {
            case ('warning'):
                return <WarnBadge style={{ verticalAlign: "text-top" }} />
            case ('critical'):
                return <CriticalBadge style={{ verticalAlign: "text-top" }} />
            default: break
        }
    }

    function getTaskBadge(type) {
        switch (type) {
            case 'Open':
                return <div style={{ background: "#28BD41", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}>{t("Open")}</div>
            case 'Inprogress':
                return <div style={{ background: "#BABABA", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}> {t("Inprogress")} </div>
            case 'Closed':
                return <div style={{ background: "#ff0d00", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}> {t("Closed")} </div>
            case 'Pending':
                return <div style={{ background: "#FF9500", fontWeight: 500, fontSize: "12px", lineHeight: "18px", color: "#FFFFFF", borderRadius: "4px", padding: "2px", margin: "auto", width: "80px", textAlign: "center" }}> {t("Pending")} </div>
            default: break
        }
    } 

    const getAlertNotifications = (currpage, perRow, searchStatus) => {
        var frmDate = ''
        var toDate = '' 
        if(btGroupValue === 6 || btGroupValue === 10 || btGroupValue === 11 || btGroupValue === 7 || btGroupValue === 9){
            frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ");
            toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"); 
        }
        let queryData = {
            schema: headPlant.schema,
            currpage: currpage,
            perRow: perRow,
            searchBy: searchStatus, 
            from:frmDate,
            to:toDate
          }
          
          getPaginationAlerts(queryData)  
      }

    const handleChangePage = (event, newPage) => {
        getAlertNotifications(newPage, rowsPerPage, "");
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getAlertNotifications(0, parseInt(event.target.value, 10), "");
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }; 

    function ProductionFnc(){
        if(assetID.length > 0){
            return <Grid container spacing={3} style={{ padding: 10,width: '100%',margin: '0',marginTop: '50px',gap:"20px" }}>

                <Grid item xs={12} style={{ padding: "15px 0px 15px 0px" }}>
                    <Typography variant={"Caption1"} value={t("Key Performance Indicators")} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex' }}>
                    <div style={classes.card}>
                        <Typography variant={"Caption1"} value={t("OEE - Overall")} />
                        <Typography variant="heading-01-lg" style={{ float: 'right' }} value={Number(oEE.oee.toFixed(2)) * 100} />
                    </div>
                    <div style={classes.card}>
                        <Typography variant={"Caption1"} value={t("Utilization - Overall")} />
                        <Typography variant="heading-01-lg" style={{ float: 'right' }} value={Number(oEE.availability.toFixed(2)) * 100} />
                    </div>
                    <div style={classes.card}>
                        <Typography variant={"Caption1"} value={t("No of Execution")} />
                        <Typography variant="heading-01-lg" style={{ float: 'right' }} value="" >{noExecution}</Typography>
                    </div>
                    <div style={classes.card}>
                        <Typography variant={"Caption1"} value={t("No of products")} />
                        <Typography variant="heading-01-lg" style={{ float: 'right' }} value="" >{noProducts}</Typography>
                    </div>
                    <div style={classes.card}>
                        <Typography variant={"Caption1"} value={t("No of Parts")} />
                        <Typography variant="heading-01-lg" style={{ float: 'right' }} value={oEE.actParts} />
                    </div>
                </Grid>

                <Grid item xs={12} >
                    <Typography variant={"Sub2"} value={t("Timeline")} />
                    <HorizontalLine variant="divider1" />

                </Grid>

                <Grid item xs={12}>
                    <Chart
                        options={{
                            theme: {
                                mode: curTheme
                            },
                            chart: {
                                height: 450,
                                type: 'rangeBar',
                                background: '0'
                            },
                            plotOptions: {
                                bar: {
                                    horizontal: true,
                                    barHeight: '80%',
                                    rangeBarGroupRows: true
                                }
                            },
                            colors: ['#007BFF', '#CCE5FF'],
                            dataLabels: {
                                enabled: true,
                                formatter: function (val, opts) {
                                    var label = opts.w.config.series[opts.seriesIndex].name;
                                    var a = moment(val[0]).format('HH:mm A')
                                    var b = moment(val[1]).format('HH:mm A')
                                    return label + ': ' + a + ' -' + b
                                },
                                style: {
                                    colors: ['#f3f4f5', '#444']
                                }
                            },
                            xaxis: {
                                type: 'datetime',
                                labels: {
                                    rotate: 0,
                                    datetimeUTC: false,
                                    format: 'hh:mm tt',
                                    style: {
                                        colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                                    },
                                }
                            },
                            legend: {
                                show: false
                            },
                            tooltip: {
                                enabled: true,
                                x: {
                                    show: true,
                                    format: 'hh:mm tt'
                                },
                                // y: {
                                //     formatter: undefined,
                                //     title: {
                                //         formatter: (seriesName) => seriesName + OEEData.dtReasonArray.filter(x => x.id === value.reason).length > 0 ? OEEData.dtReasonArray.filter(x => x.id === value.reason)[0].name : "",
                                //     },
                                // },
                            },
                            grid: {
                                row: {

                                    opacity: 1
                                }
                            }
                        }}
                        series={assetStatusData} height={350} type={'rangeBar'} />
                </Grid>

                <Grid item xs={12} style={{ display: 'flex' }}>
                    <div style={classes.card}>
                        <Typography variant={"Sub2"} value={t("OEE")} />
                        <SolidGauge machineAvailablity={oEE.availability} Performance={oEE.performance} Quality={oEE.quality} ></SolidGauge>
                    </div>
                    <div style={classes.card}>
                        <Typography variant={"Sub2"} value={t("Energy")} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '95%' }}>
                            <Typography variant="heading-02-m" value={energy + ' kWh'} />
                        </div>
                    </div>
                    <div style={{ width: "35%", ...classes.card }}>
                        <Typography variant={"Sub2"} value={t("Alarms")} />
                        {
                            (alarmData.length > 0) ?
                                alarmData.map(datum => {
                                    return (

                                        <li style={{ listStyleType: 'none', width: 'auto', overflow: 'hidden', fontSize: '1rem', boxSizing: 'border-box', minHeight: '48px', fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: 1.5, paddingTop: '6px', whiteSpace: 'nowrap', paddingBottom: '6px', transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms' }}>
                                            <div style={{ justifyContent: 'space-evenly', flex: '1 1 auto', minWidth: 0, marginTop: '4px', marginBottom: '4px', boxSizing: 'border-box', display: 'block' }}>
                                                <span style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 400, display: 'block', margin: 0, lineHeight: 1.5 }}>
                                                    <div style={{ fontWeight: 500, fontSize: 12, lineHeight: "18px" }}>
                                                        <span>{datum.key}</span>
                                                        <span style={{ float: 'right' }}>{getBadge(datum.alert_level)}</span>
                                                    </div>
                                                    <div style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }}>{moment(datum.time).fromNow()}</div>
                                                </span>
                                            </div>
                                        </li>

                                    )
                                }
                                )

                                :
                                <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: '500', padding: "8px 0px 8px 0px" }}>{t("No Alarm Generated for the selected range")}</div>
                        }
                        <TablePagination
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            visibledata={alarmData}
                            count={count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            PerPageOption={[5, 10, 25, 50, 100]}
                        />
                    </div>

                    <div style={{ width: "35%", height: '54vh', overflow: 'auto', ...classes.card }}>
                        <Typography variant={"Sub2"} value={t("Tasks")} style={{ paddingBottom: "8px" }} />
                        {
                            taskData.length > 0 ?
                                taskData.map(datum =>
                                    <li class="list-none w-auto overflow-hidden text-1rem box-border min-h-48 font-geist-sans font-normal leading-1.5 transition-bg-150ms flex justify-between items-center pb-3">

                                        <span class="text-1rem font-geist-sans font-normal leading-1.5 m-0 block">

                                            <div style={{ fontWeight: 500, fontSize: 12, lineHeight: "18px" }}>
                                                <span>{datum.title}</span>
                                                <span style={{ float: 'right' }}>{getTaskBadge(datum.taskStatus.status)}</span>
                                            </div>
                                            <div style={{ fontWeight: 500, fontSize: 9, lineHeight: "18px" }}>{moment(datum.created_ts).fromNow()}&nbsp; &nbsp; {t("Created by ")} {datum.userByCreatedBy && datum.userByCreatedBy.name} </div>
                                        </span>
                                    </li>
                                )
                                :
                                <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: '500' }}>{t("No Task Assigned for this Asset")}</div>
                        }
                    </div>

                </Grid>

            </Grid> 
        }else{
            return <Grid container spacing={0} style={{ padding: 4,marginTop: '50px' }}>
                <Grid item xs={12} style={{ padding: 4}}>
                    <Card elevation={0} style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }} >
                        <div style={{ padding: 10, textAlign: "center" }}>
                            <Typography variant="label-02-s" value={t("PleaseSelectAnAsset")}/>
                        </div>
                    </Card>
                </Grid>
            </Grid> 
        }
    }

    return (
        <React.Fragment> 
            {LoadPanel ? 
                <LoadingScreenNDL /> :
                ProductionFnc()
                
            }
        </React.Fragment>
    );
}