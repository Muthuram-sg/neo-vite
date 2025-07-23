/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import { useRecoilState, useRecoilValue } from "recoil";
import moment from 'moment';
import { useAuth } from "components/Context";
import ApexCharts from 'apexcharts';

import {
    exploreRange,
    selectedmeterExplore,
    onlineTrendsMetrArr,
    hierarchyExplore,
    chipState,
    trendsload,
    GapMode,
    DateSrch,
    onlineTrendsChipArr,
    selectedPlant,
    customdates,
    snackToggle,
    snackMessage,
    snackType,
    TrendschartMode,
    CalcStat,
    alertchartenable,
    exploreLoader,
    dataForecastenable,
    forecastCalc,normalMode, NormalizeMode,trendLegendView, breachCountExplore, groupBreachCountExplore, groupBreachCount
} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import TrendsChart from './components/TrendsChart'

//hooks
import useTrends from "../../hooks/useTrends.jsx";
import useComments from "../../hooks/useComments.jsx";
import useInstrumentCategory from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/hooks/useGetInstrumentCategory.jsx";
import useFetchlimits from "components/layouts/Explore/ExploreMain/ExploreTabs/components/Trends/hooks/useGetFetchLimits";
import LoadingScreenNDL from "LoadingScreenNDL";
import useGetForeCastData from "../../hooks/usegetForeCastData"; 
import * as XLSX from 'xlsx';

const TrendsOnline = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [selectedRange] = useRecoilState(exploreRange);
    const [, setBreachCountExplore] = useRecoilState(breachCountExplore);
    const [GroupBreachCountExplore] = useRecoilState(groupBreachCountExplore)
    const [GroupBreachCount, setgroupBreachCount] = useRecoilState(groupBreachCount)
    const [selectedMeter] = useRecoilState(selectedmeterExplore);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setDataAvailable] = useState(false)
    const [charttype] = useRecoilState(TrendschartMode)
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setType] = useRecoilState(snackType);
    const { HF } = useAuth();
    const [calcArr, setCalcArr] = useRecoilState(CalcStat)
    const [, setTrendsOnlineLoad] = useRecoilState(trendsload);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setDisableSlider] = useState(false);
    const [, setMeterLength] = useState(0);
    const [, setDisableParameters] = useRecoilState(chipState);
    const [loader, setLoaderForMeter] = useRecoilState(exploreLoader);
    const [yData, setYData] = useState({ 'data': [], 'annotation': [], 'charttype': "timeseries" });
    const [tyData, setTYData] = useState({ 'data': [], 'annotation': [], 'charttype': "timeseries" });
    const [yAxisDatamax, setyAxisDatamax] = useState(null)
    const [yAxisDatamin, setyAxisDatamin] = useState(null)
    const [min, setmin] = useState(undefined)
    const [max, setmax] = useState(undefined)
    const [limitannots, setlimitannotations] = useState([])
    const [noData, setNoData] = useState(false)
    const [selectedChipArr] = useRecoilState(onlineTrendsChipArr);
    const [selectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
    const [hierarchyArr] = useRecoilState(hierarchyExplore);
    const [, setCategoriesList] = useState([]);
    const [gapstatus] = useRecoilState(GapMode);
    const [, setselectedMeterAndChip] = useRecoilState(onlineTrendsMetrArr);
    const [, setDatesSearch] = useRecoilState(DateSrch);
    const [customdatesval] = useRecoilState(customdates);
    const [customdatesvals,setcustomdatesvals] =  useState([]);
    const [annotationss, setAnnotationss] = useState([]);
    const [alertconfig]= useRecoilState(alertchartenable);
    const [alertlimitData,setAlertLimitData]=useState([])
    const [forecastconfig, setForecastconfig] = useRecoilState(dataForecastenable)
    const [forecastData, setForecastData] = useState({});
    const [forecastAnnotation, setForecastAnnotation] = useState('');
    const [, setForecastCalcArray] = useRecoilState(forecastCalc);
    const [graphMode, setGraphMode] = useRecoilState(normalMode)
    const [normalizeMode, setNormalizeMode] = useRecoilState(NormalizeMode)
    
    const [isReloadForecast, setReloadForecast] = useState(false);
    const [nonNumberMetrics, setNonNumberMetrics] = useState([])
    const legendView = useRecoilValue(trendLegendView);
    const [stringAnnotations, setStringAnnotations] = useState([]);
    const [showLimits, setShowLimits] = useState([])

    //Hooks
    const { trendsdataLoading, trendsdataData, trendsdataError, getTrends } = useTrends();
    const { commentsLoading, commentsData, commentsError, getComments } = useComments();
    const { categoriesLoading, categoriesData, categoriesError, getInstrumentCategory } = useInstrumentCategory();
    const { fetchLimitsLoading, fetchLimitsData, fetchLimitsError, getFetchLimits } = useFetchlimits()
    const { forecastdataLoading, forecastdataData, forecastdataError, getForeCastData } = useGetForeCastData()
    

    useImperativeHandle(ref, () => ({
        showSeries: (series, fft, val) => {
            showSeriess(series, fft, val)
        },
        hideSeries: (series, fft, val) => {
            hideSeriess(series, fft, val)
        },
        hideAllSeries: (series) => {
            hideAllSeries(series);
        },
        showAllSeries: (series) => {
            showAllSeries(series);
        },
        showannot: (series) => {
            showannot(series);
        },
        hideannot: (series, graphval) => {
            hideannot(series, graphval);
        },
        generateChart: () => {
            generateChartDataTemp(props.trendsData)
        },
        addpointannot: (frm, to, metric_val, iid) => {
            getComments(selectedMeterAndChip)
        },
        fetchOnlineData: (metric, append) => {
            
            let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let result = moment(toDate).diff(frmDate, 'days') 
            // console.log("No of Days:", result)
            if(result > 10 && Number(props.selectedIntervals) <= 0.167){
                setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
                setType("warning");
                setOpenSnack(true);
            }
            else{
                setTrendsOnlineLoad(true)
                // showannot(newmeters)
                getTrends(metric, headPlant.schema, append)
            }

        },
        handleDownloadTrendData: () => {
            handleDownloadTrendData()
        },
        generateAlertsChart: (data, val) => {
            generateAlertsChart(data, val)
        },
        generateForecastChart: (metric,key) => {
            setTrendsOnlineLoad(true)
            generateForecastChart(metric,key)
        }

    }))


    useEffect(() => {
        // alert("HISS")
        if(selectedMeterAndChip &&
            // selectedMeterAndChip.length &&
            selectedMeterAndChip?.[0]?.hierarchy?.includes("All Metrics Group")){
                // console.clear()
            console.log(selectedMeterAndChip, GroupBreachCountExplore, yData)
            let res_temp = [];
            try{
            yData.data.forEach((x, zz) => {
                let upperbreach = 0
                let lowerbreach = 0
                let compare = {
                    id: `${selectedMeterAndChip?.[zz]?.metric_val}_${x.id}`,
                    max: GroupBreachCountExplore?.upper || 0,
                    min: GroupBreachCountExplore?.lower || 0,
                }
                x.data.map((z, index) => {
                    if(index === 0) {
                        if(parseFloat(z.y) > parseFloat(compare.max)) {
                            upperbreach = upperbreach + 1
                        } else if(parseFloat(z.y) < parseFloat(compare.min)) {
                            lowerbreach = lowerbreach = 1
                        }
                    } else {
                        if((parseFloat(z.y) > parseFloat(compare.max)) && (parseFloat(x.data[index-1].y) < parseFloat(compare.max))) {
                            upperbreach = upperbreach + 1
                        } else if((parseFloat(z.y) < parseFloat(compare.min)) && (parseFloat(x.data[index-1].y) > parseFloat(compare.min))) {
                            lowerbreach = lowerbreach + 1
                        }
                    }
                   
                })
                let data = {
                    id: `${selectedMeterAndChip?.[zz]?.metric_val}_${x.id}`,
                    iid: `${selectedMeterAndChip?.[zz]?.metric_title} (${x.id})`,
                    upperbreach,
                    lowerbreach,
                }
                res_temp.push(data)
            })
            console.log(res_temp)
            // alert("ASAS")
            setgroupBreachCount(res_temp)
        }
        catch(e){
            // console.clear()
            console.log(e)
        }
            
        } else {
            // alert("SIS")
        }
    }, [GroupBreachCountExplore])



    const setcoord = (x, y, iid, metric) => {
        props.setcoord(x, y, iid, metric)
    }


   
    useEffect(() => {
        console.log(graphMode)
        let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
        let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
        let result = moment(toDate).diff(frmDate, 'days') 
        if(result > 10 && Number(props.selectedIntervals) <= 0.167){
            setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
            setType("warning");
            setOpenSnack(true);
        }
        else{
            if(forecastconfig && graphMode){
                console.log("loadNormalData")
                setForecastconfig(false)
                setGraphMode(false);
                let selectedMetric = localStorage.getItem('selectedChipArr') !== "" ? JSON.parse(localStorage.getItem('selectedChipArr')) : '';
                let newmeters = [...selectedMetric]
                props.setTrendsData([])
                if(newmeters.length > 0){
                    setTrendsOnlineLoad(true)
                    getTrends(newmeters, headPlant.schema, false)
                }
                else{
                    setNormalizeMode(false)
                }
            }
            else{
                if (selectedRange) {
                    if (selectedRange === 9 || selectedRange === 16) {
                        localStorage.setItem('intervalOnlineTrends', 60)
                    }
                }
                //Code taken from selectedchip use Effect
                let diff = props.trendsData.filter((item) => { return !selectedMeterAndChip.some((val) => { return val.id === item.iid && val.metric_val === item.key }) })
                if (diff.length === 0) {
                    getOnlineTrendsData(true)
                }
                else {
                    props.setTrendsData(props.trendsData.filter((item) => !diff.includes(item)))
                    generateChartDataTemp(props.trendsData.filter((item) => !diff.includes(item)))
                }
                let annotids = limitannots.filter((val) => val !== undefined).map((item) => { return item.id })
                let existingmeters = selectedMeterAndChip.map((item) => { return item && item.metric_title && item.metric_title.replace(/[ ()\/]/g, '-')+ '-' + item.id + '-' })
                annotids.forEach((item) => { if (!existingmeters.includes(item)) { hideannot(item) } })
            }
        }
    }, [selectedMeterAndChip.length])

    useEffect(() => {
        if (selectedMeterAndChip.length > 0 && props.selectedRange) {
            const frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ");
            const toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ");
                let result = moment(toDate).diff(frmDate, 'days') 
                
                if(result > 10 && Number(props.selectedIntervals) <= 0.167){
                    setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
                    setType("warning");
                    setOpenSnack(true);
                }
                else{
        
            if (frmDate !== toDate) {
                let newmeters = [...selectedMeterAndChip].map(item => 
                        Object.assign({}, item, { range: props.selectedRange, frmDate: frmDate, toDate: toDate })
                    );
    
                    localStorage.setItem('selectedChipArr', JSON.stringify(newmeters));
                    setTrendsOnlineLoad(true);
                    getTrends(newmeters, headPlant.schema, false);
                 
                    
                    // showannot(newmeters)
                    setselectedMeterAndChip(newmeters);
                    setDatesSearch(false);                }
            }
        }
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval, customdatesvals]);

    useEffect(()=>{
        if(  selectedMeterAndChip &&
            selectedMeterAndChip.length &&
            selectedMeterAndChip[0].hierarchy.includes("All Metrics Group")){
            const startDate = moment().subtract(7, 'days').startOf('day').toDate();
            const endDate = moment().endOf('day').toDate();
            setcustomdatesvals({ StartDate: startDate, EndDate: endDate });
        }
    },[selectedMeterAndChip.length])

    useEffect(() => {

        if (selectedMeterAndChip.length > 0) {
            let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
            let result = moment(toDate).diff(frmDate, 'days') 
            // console.log("No of Days:", result)
            if(result > 10 && Number(props.selectedIntervals) <= 0.167){
                setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
                setType("warning");
                setOpenSnack(true);
            }
            else{
                let newmeters = [...selectedMeterAndChip]

                newmeters = newmeters.map((item, i) => {

                    if (Number(item.frequency) <= Number(props.selectedIntervals)) {
                        return Object.assign({}, item, { interval: props.selectedIntervals })
                    }

                    else {
                        return Object.assign({}, item);
                    }
                })
                localStorage.setItem('selectedChipArr', JSON.stringify(newmeters));
                setTrendsOnlineLoad(true)
                getTrends(newmeters, headPlant.schema, false)
                setselectedMeterAndChip(newmeters)
            }

        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedIntervals])



    useEffect(() => {
        if (!gapstatus) {
            let newdata = props.trendsData.filter((item) => { return item.value !== null })
            generateChartDataTemp(newdata)
        }
        else {
            generateChartDataTemp(props.trendsData)
        }


    }, [gapstatus])

    useEffect(() => {
        if (!normalizeMode) {
            if(forecastconfig){
                let selectedMetric = localStorage.getItem('selectedChipArr') !== "" ? JSON.parse(localStorage.getItem('selectedChipArr')) : '';
                let newmeters = [...selectedMetric]
                props.setTrendsData([])
                if(newmeters.length > 0){
                    let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
                    let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
                    let result = moment(toDate).diff(frmDate, 'days') 
                    // console.log("No of Days:", result)
                    if(result > 10 && Number(props.selectedIntervals) <= 0.167){
                        setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
                        setType("warning");
                        setOpenSnack(true);
                    }
                    else{
                        setTrendsOnlineLoad(true)
                        getTrends(newmeters, headPlant.schema, false)
                    }
                }
            }
            else{
                if (!gapstatus) {
                    let newdata = props.trendsData.filter((item) => { return item.value !== null })
                    generateChartDataTemp(newdata)
                }
                else {
                    generateChartDataTemp(props.trendsData)
                }
            }
        }
        else {
            if (!gapstatus) {
                let newdata = props.trendsData.filter((item) => { return item.value !== null })
                generateChartDataTemp(newdata)
            }
            else {
                generateChartDataTemp(props.trendsData)
            }
        }
    }, [normalizeMode])


    const getNormalizeForecastData = (templinedata) => {
        templinedata.forEach((s) => {
        let max = Math.max(...s.data.map(o => o));
        let tempdata = s.data.map((d) =>
            (d / max).toFixed(4))
        s.data = [...tempdata]
        })
        let NormalizedForecastData = {
            lower:templinedata[0],
            predicted: templinedata[1],
            upper: templinedata[2]
        }
        return NormalizedForecastData;
      }


    const handleDownloadTrendData = () => {

        if (yData.data && yData.data.length > 0) {
            setTYData(yData)
            let selected = JSON.parse(localStorage.getItem('selectedChipArr')).filter(x => x.checked === true).map(z => { return `${z.metric_title} (${z.id})`})
            if(selected.length > 0){
                tyData.data = yData.data.filter((z) => selected.includes(z.name))
            } else {
                tyData.data = yData.data
            }
            
            let timestamps = []

            tyData.data.forEach((item) => {
                let categoryX = item.data.map((i) => { return i.x })

                timestamps.push(...[...categoryX]);
            })

            let filterTimestamps = timestamps.filter((item,
                index) => timestamps.indexOf(item) === index);

            filterTimestamps = filterTimestamps.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b) - new Date(a);
            })
            filterTimestamps = filterTimestamps.reverse()
            let finalTrendData = [];

            // console.clear()
            let selectedMetric = localStorage.getItem('selectedChipArr') !== "" ? JSON.parse(localStorage.getItem('selectedChipArr')) : '';
            let isStringMetric = selectedMetric.filter(x=>(x.metric_data_type === 4 || x.metric_data_type === 5)).length;
            filterTimestamps.forEach((date) => {
                let objResult = {};
                if(isStringMetric){
                    // alert("1")
                    tyData.data.forEach((item,ind) => {
                        let keyVal = selectedMetric[ind].metric_val;
                        let dindex = props.trendsData.findIndex(e => e.iid === item.id && e.key === keyVal)
                        let yValue = props.trendsData[dindex].value;//console.log(yValue)

                        let data = {
                            "Range": moment(new Date(date)).subtract(moment(date).isDST() ? 1 : 0, 'hour').format('Do MMM YYYY ' + HF.HMSS),
                            [item.name]: yValue
                        };
                        Object.assign(objResult, data);
                    });
                }
                else{
                    // alert('2')
                    tyData.data.forEach((item) => {
                        let yValue = item.data.filter((e) => e.x === date);

                        let data = {
                            "Range": moment(new Date(date)).subtract(moment(date).isDST() ? 1 : 0, 'hour').format('Do MMM YYYY ' + HF.HMSS),
                            [item.name]: yValue.length > 0 ? !isNaN(Number(yValue[0].y)) ? Number(yValue[0].y) : (yValue[0].y).join(" - ") : ""
                        };
                        Object.assign(objResult, data);
                    });
                }
                finalTrendData.push(objResult);
            });
            let new_trend = [];
            ['Minimum_minVal', 'Maximum_maxVal', 'Average_avg', 'Mode_mode', 'Std.Deviation_stddev', 'Warning_lowerbreach', 'Critical_upperbreach']?.map((x) => {
                let split_item = x.split('_')

                tyData.data.forEach((item) => {


                    let upperbreach = 0
                    let lowerbreach = 0
                    if(fetchLimitsData){
                        let y = fetchLimitsData?.filter((limits) => limits.iid === item.name)?.map((value) => value.y)
                        let check = fetchLimitsData?.filter((limits) => limits.iid === item.name)?.map((value) => value.check_type)
                        let check_range = fetchLimitsData?.filter((limits) => limits.iid === item.name)?.map((value) => value)
                    // let y = fetchLimitsData?.filter((limits) => limits.id.includes(item?.id))?.map((value) => value.y)
                    // let check = fetchLimitsData?.filter((limits) => limits.id.includes(item?.id))?.map((value) => value.check_type)
                    // let check_range = fetchLimitsData?.filter((limits) => limits.id.includes(item?.id))?.map((value) => value)
    
                    let compare = {
                        id: item?.id,
                        max: y?.length > 0 ? y[0] > y[1] ? y[0] : y[1] : 0,
                        min: y?.length > 0 ? y[0] > y[1] ? y[1] : y[0] : 0,
                        crtical_range: [check_range?.[0]?.critical_min_value, check_range?.[0]?.critical_max_value],
                        warn_range: [check_range?.[1]?.warn_min_value, check_range?.[1]?.warn_max_value],
                    }
                    item?.data?.map((z, index) => {
                        
                        
                        if(index === 0) {
                            if(check[0] === 'above'){
                                if((parseFloat(z.y) > parseFloat(compare.max))){
                                    upperbreach = upperbreach + 1
                                } else if ((parseFloat(z.y) > parseFloat(compare.min))){
                                    lowerbreach = lowerbreach + 1
                                }
                            } 
                            else if (check[0] === 'below') {
                                if((parseFloat(z.y) < parseFloat(compare.max))){
                                    upperbreach = upperbreach + 1
                                } else if ((parseFloat(z.y) < parseFloat(compare.min)) && (parseFloat(z.y) > parseFloat(compare.max))){
                                    lowerbreach = lowerbreach + 1
                                }
                            }
                        } else {
                            if(check[0] === 'above'){
                                if((parseFloat(item?.data[index-1].y) < parseFloat(compare.max)) && (parseFloat(z.y) > parseFloat(compare.max))){
                                    upperbreach = upperbreach + 1
                                } 
                                else if ((parseFloat(z.y) > parseFloat(compare.min) && (parseFloat(z.y) < parseFloat(compare.max))) && (parseFloat(item?.data[index-1].y) > parseFloat(compare.max))){
                                    lowerbreach = lowerbreach + 1
                                } 
                                else if ((parseFloat(z.y) > parseFloat(compare.min)) && (parseFloat(item?.data[index-1].y) < parseFloat(compare.min))) {
                                    lowerbreach = lowerbreach + 1
                                }
                            } 
                            else if (check[0] === 'below') {
                                if((parseFloat(item?.data[index-1].y) > parseFloat(compare.min)) && (parseFloat(z.y) < parseFloat(compare.min))){
                                    upperbreach = upperbreach + 1
                                } else if ((parseFloat(z.y) > parseFloat(compare.min) && (parseFloat(z.y) < parseFloat(compare.max))) && ((parseFloat(item?.data[index-1].y) < parseFloat(compare.max)) && parseFloat(item?.data[index-1].y) > parseFloat(compare.min))){
                                    lowerbreach = lowerbreach + 1
                                } else if ((parseFloat(z.y) > parseFloat(compare.min) && (parseFloat(z.y) < parseFloat(compare.max))) && (parseFloat(item?.data[index-1].y) > parseFloat(compare.max))) {
                                    lowerbreach = lowerbreach + 1
                                }
                            }
                        }
                       
                    })
                }
                   

                    const yValues = item?.data?.map((point) => !isNaN(point.y) ? parseFloat(point.y) : 0);
                    const minVal = Math.min(...yValues);
                    const maxVal = Math.max(...yValues);
                   
                    const mode = findMode(yValues)
                    const avg = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;
                    const stddev = calculateStandardDeviation(yValues);
                    
                    let data = {
                        'Range': split_item[0],
                        [item.name]: split_item[1] === 'minVal' 
                                        ? minVal 
                                        : split_item[1] === 'maxVal'
                                            ? maxVal
                                            : split_item[1] === 'avg'
                                                ? avg
                                                : split_item[1] === 'mode'
                                                    ? mode[0]
                                                    : split_item[1] === 'stddev'
                                                        ? stddev
                                                        : split_item[1] === 'upperbreach' 
                                                            ? GroupBreachCount.filter((ss) => ss.iid === item.name)?.[0]?.upperbreach || upperbreach 
                                                            : split_item[1] === 'lowerbreach' 
                                                                ? GroupBreachCount.filter((ss) => ss.iid === item.name)?.[0]?.lowerbreach || lowerbreach 
                                                                : '-'
                    }
                    Object.assign(new_trend, data);
                })
                // console.log({ ...new_trend })
                finalTrendData.push({ ...new_trend })
            })
            downloadExcel(finalTrendData, "trendsChartData - " + moment(Date.now()).format('YYYY_MM_DD_HH_mm_ss'))
        }
    }

    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    }

    useEffect(() => {
        if (!categoriesLoading && categoriesData && !categoriesError) {
            setCategoriesList(categoriesData)
        }
    }, [categoriesLoading, categoriesData, categoriesError])

    useEffect(() => {

        getInstrumentCategory()
        let tempArr1 = []
        let meterIDs = JSON.parse(localStorage.getItem('selectedChildrenObj'))
        if (meterIDs !== null && meterIDs !== undefined && meterIDs.length > 0) {
            meterIDs = meterIDs.map(function (el) { return el.id; });
            if (typeof (selectedMeter) == "string") {
                tempArr1 = selectedMeter.split(",")
            } else {
                tempArr1 = selectedMeter
            }
            if (tempArr1 !== "" && tempArr1.length > 0 && meterIDs !== "" && meterIDs.length > 0) {
                setMeterLength(tempArr1.length)
                let chipLocalTemp = localStorage.getItem('selectedChipArr') !== "" ? JSON.parse(localStorage.getItem('selectedChipArr')) : '';
                if ((selectedChipArr !== "" && selectedChipArr !== null && selectedChipArr !== undefined) || (chipLocalTemp !== "" && chipLocalTemp != null && chipLocalTemp !== undefined)) {
                    let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
                    let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
                    let result = moment(toDate).diff(frmDate, 'days') 
                    // console.log("No of Days:", result)
                    if(result > 10 && Number(props.selectedIntervals) <= 0.167){
                        setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
                        setType("warning");
                        setOpenSnack(true);
                    }
                    else{
                        getOnlineTrendsData(false)
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMeter])

    useEffect(() => {
        // setTrendsData([])
        props.setTrendsData([])
        // eslint-disable-next-line react-hooks/exhaustive-deps            
    }, [hierarchyArr])
    useEffect(() => {
        if (!commentsLoading && commentsData && !commentsError && trendsdataData && trendsdataData.data.length > 0) {

            let data = commentsData.flat(1)
            const newAnnotations = data.map((item) => ({
                id: item.metric_key + "-" + item.instrument_id,
                x: moment(item.date).unix() * 1000,
                y: Number(item.value),
                label: {
                    text: item.comments,
                },
                instrument_id: item.instrument_id,
                metric_key: item.metric_key,
            }));
            newAnnotations.forEach((annotation) => {
                ApexCharts.exec('trendChart', "addPointAnnotation", annotation);
            });
            let nodupannotations = []
            newAnnotations.forEach(n => {
                if (nodupannotations.findIndex(np => np.x === n.x && np.y === n.y) < 0) {
                    nodupannotations.push(n)
                }
            })
            setAnnotationss(newAnnotations)
        }
    }, [commentsLoading, commentsData, commentsError, trendsdataData])

    function getOnlineTrendsData(append) {

        if (selectedChipArr.length > 0 && selectedMeterAndChip.length > 0) {
            if (!append || selectedMeterAndChip.length === 0) {
                setTrendsOnlineLoad(true)
                getTrends(selectedMeterAndChip, headPlant.schema, append)
                if (!selectedMeterAndChip.some(p => p.metric_data_type === 4 || p.metric_data_type === 5)) {
                    props.getSummary(selectedMeterAndChip)

                }

            }
            else {

                let tobefetchedmeter = [selectedMeterAndChip[selectedMeterAndChip.length - 1]]
                setTrendsOnlineLoad(true)
                getTrends(tobefetchedmeter, headPlant.schema, append)
                if (!tobefetchedmeter.some(p => p.metric_data_type === 4 || p.metric_data_type === 5)) {
                    props.getSummary(tobefetchedmeter)
                }

            }
        }
        else {
            setDisableSlider(false)
            setDisableParameters(false)
            setLoaderForMeter(true)
            props.showLoader(false)
        }
    }

    useEffect(() => {
        let timer;
        if (!trendsdataLoading && trendsdataData && !trendsdataError) {
            if (trendsdataData.data && trendsdataData.data.length > 0) {
             //   console.log("trendsdataData",trendsdataData)
                const merged = trendsdataData.data.flat(1);
                // console.log(merged,props.trendsData)
              
                if (merged.length === 0) {
                    timer = setTimeout(() => {
                        if (merged.length === 0) {
                            setSnackMessage(t("No data available for the given time range"))
                            setType("warning");
                            setOpenSnack(true);
                        }
                    }, 2000); // 5-second delay
                } else {
                    setDataAvailable(true);
                }
                setTrendsOnlineLoad(false)
                setDisableSlider(false)
                setDisableParameters(false)
                setLoaderForMeter(false)
                props.showLoader(false)
                let newdata=[];
                if (selectedMeterAndChip.length === 1 || !trendsdataData.append) {
                    if (merged.length === 0) {
                        setNoData(true);
                    }
                    else{
                        setNoData(false);
                        let newtrendsdata = props.trendsData.filter(object1 => {
                            return !merged.some(object2 => {
                                return object1.iid === object2.iid && object1.key === object2.key;
                            });
                        });
                        props.setTrendsData(JSON.parse(JSON.stringify(newtrendsdata.concat(merged))))                                  
                        if (!gapstatus) {
                            newdata = newtrendsdata.concat(merged).filter((item) => { return item.value !== null })
                            generateChartDataTemp(newdata,true)//send data change as a param to handle in forecast enable case

                        }
                        else {
                            generateChartDataTemp(merged)
                        }
                    }
                }
                else {
                    setNoData(false)
                    props.setTrendsData(JSON.parse(JSON.stringify(props.trendsData.concat(merged))))
                    if (!gapstatus) {
                        newdata = props.trendsData.concat(merged).filter((item) => { return item.value !== null })
                        generateChartDataTemp(newdata)
                    }
                    else {
                        generateChartDataTemp(props.trendsData.concat(merged))
                    }
                }
            } else {
                setDisableParameters(false)
                setNoData(true);
                // props.setTrendsData([])
            }
        }
        return () => {
            clearTimeout(timer);
        };

    }, [    trendsdataLoading, trendsdataData, trendsdataError, charttype, customdatesval])

    function calculateStandardDeviation(numbers) {
        const average = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
        const variance = numbers.reduce((acc, curr) => acc + Math.pow(curr - average, 2), 0) / numbers.length;
        return Math.sqrt(variance);
    }

    function getYaxis(value) {
        if (value !== null)
            return (!isNaN(Number(value)) ? Number(value).toFixed(2) : null)
        else
            return null
    }


    function generateAlertsChart(data, val) {
       
        let chipLocal;
        try {
        const storedData = localStorage.getItem('selectedChipArr');
        chipLocal = storedData ? JSON.parse(storedData) : [];
        } catch (e) {
        console.error("Failed to parse 'selectedChipArr' from localStorage", e);
        chipLocal = [];
        }

        let finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
        if(val){
            let plottedinstrument = chipLocal.filter(c => c.id === val.id && c.metric_title === val.metric_title)
            let tempObj2 = {
                name: plottedinstrument[0].metric_title + " (" + plottedinstrument[0].id + ")",
                id: plottedinstrument[0].id,
                color: plottedinstrument[0].colour,
                type: charttype ? 'area' : 'line',
                data: [],
            }
            let tempObj3 = {
                name: plottedinstrument[0].metric_title + " (" + plottedinstrument[0].id + ")_critical",
                id: plottedinstrument[0].id + "_critical",
                color: "#FF0D00",
                type: 'line',
                data: [],
            }
            let tempObj4 = {
                name: plottedinstrument[0].metric_title + " (" + plottedinstrument[0].id + ")_warning",
                id: plottedinstrument[0].id + "_warning",
                color: "#FF9500",
                type: 'line',
                data: [],
            }
            let tempValArr = [];
            let tempcritical = []
            let tempwarning = []
            if (data.length > 0) {
                data.map((a, index) => {
    
    
                    if (a.limit === "critical") {
    
                        tempcritical.push({
                            x: new Date(a.time).getTime(),
                            y: getYaxis(a.value)
                        })
                    } else if (a.limit === "warning") {
                        tempwarning.push({
                            x: new Date(a.time).getTime(),
                            y: getYaxis(a.value)
                        })
                    }
                    else {
                        tempValArr.push({
                            x: new Date(a.time).getTime(),
                            y: getYaxis(a.value)
                        })
                    }
    
    
    
                })
    
                tempObj2.data = tempValArr
                tempObj3.data = tempcritical
                tempObj4.data = tempwarning
                finalDataArr.data.push(tempObj2, tempObj3,tempObj4)
                // console.log("finalDataArr", finalDataArr)
    
            }
        }
        
        setAlertLimitData(finalDataArr)
        setLoaderForMeter(false)
    }

    const Normalize = (templinedata) => {
        // console.log(templinedata)
        if (normalizeMode) {
          templinedata.forEach((s) => {
            if(s.type === 'rangeArea'){
                let lowerMax = Math.max(...s.data.map(x => x.y[0]))
                let upperMax = Math.max(...s.data.map(x => x.y[1]))
                // console.log(lowerMax,upperMax)
                let temprangedata = s.data.map((d) =>
                    Object.assign({}, d, { y: [(d.y[0] / lowerMax).toFixed(4),(d.y[1] / upperMax).toFixed(4)] }))
                    s.data = [...temprangedata]
            }
            else{
                let max = Math.max(...s.data.map(o => o.y))
                let tempdata = s.data.map((d) =>
                Object.assign({}, d, { y: (d.y / max).toFixed(4) }))
                s.data = [...tempdata]
            }
          })
        //   console.log(templinedata)
          return templinedata
        }
        else {
            return templinedata
        }
        
    }

    function getShortText(text){
        let textarray = text.split(",");
        return textarray[0].substring(1)
    }

    function findMode(arr) {
        // console.clear()
        // console.log(arr)
        const frequencyMap = {};
        let maxFreq = 0;
        let modes = [];
      
        // Calculate frequencies of each element
        for (let num of arr) {
          frequencyMap[num] = (frequencyMap[num] || 0) + 1;
          if (frequencyMap[num] > maxFreq) {
            maxFreq = frequencyMap[num];
          }
        }
      
        // Find all elements with the maximum frequency
        for (let num in frequencyMap) {
          if (frequencyMap[num] === maxFreq) {
            modes.push(Number(num));
          }
        }
        return modes.length === arr.length ? "-" : [modes[0]];
    }
      

    function generateChartDataTemp(generateOnlineData,isDataChange) {
        // console.log(generateOnlineData,"generateOnlineData",forecastconfig,isReloadForecast)
        let finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
        let yAxisData = []
        let annotations = []
        let chipLocal;
            try {
            const storedData = localStorage.getItem('selectedChipArr');
            chipLocal = storedData ? JSON.parse(storedData) : [];
            } catch (e) {
            console.error("Failed to parse 'selectedChipArr' from localStorage", e);
            chipLocal = [];
            }

        if(forecastconfig && !isReloadForecast){
            let fdata = yData; 
            // console.log(fdata,chipLocal)
            if(fdata.data.length > chipLocal.length){
                let nmetrics = generateOnlineData.filter(v => typeof (v.value) !== "string")
                let predicted = {
                    data: []
                };
                chipLocal && chipLocal.map((val,ind) => {
                    if(ind === 0){
                        let tempRange = {
                            type: 'rangeArea',
                            data: fdata.data[0].data,
                            // color: val.colour, //"#FFECC9"
                            name: "Range Value - "+val.metric_title + " (" + val.id + ")"
                        }
                        if(isDataChange){
                            tempRange.data = [];
                            let checkvalue = parseInt(moment(customdatesval.EndDate).format("x"));
                            // console.log(checkvalue)
                            forecastData.lower.data.forEach((val,i) => {
                                if(forecastData.lower.time[i] === forecastData.upper.time[i] && forecastData.lower.time[i] === forecastData.predicted.time[i]  && (parseInt(moment(forecastData.predicted.time[i]).format("x"))) > checkvalue){
                                    let obj = {
                                    x: parseInt(moment(forecastData.lower.time[i]).format("x")),
                                    y: [Number(val).toFixed(4), Number(forecastData.upper.data[i]).toFixed(4)],
                                    }
                                    tempRange.data.push(obj)
                        
                                    let lineObj = {
                                    x: parseInt(moment(forecastData.predicted.time[i]).format("x")),
                                    y: Number(forecastData.predicted.data[i]).toFixed(4),
                                    }
                                    predicted.data.push(lineObj)
                        
                                    //Annotation for splitting line
                                    if(i === 0){
                                        setForecastAnnotation(parseInt(moment(forecastData.predicted.time[i]).format("x")));
                                    }
                                }
                            })
                        }
                        finalDataArr.data.push(tempRange)
                    }
                    if(isDataChange){
                        let index = selectedMeterAndChip.findIndex(x => x.forecastenable === true ) >= 0 ? selectedMeterAndChip.findIndex(x => x.forecastenable === true ) : 0;
                        let tempObj3 = {
                            name: val.metric_title + " (" + val.id + ")",
                            id: val.id,
                            color: val.colour,
                            type: charttype ? 'area' : 'line',
                            data: [],
                        }
                        let tempValArr = [];
                        if (nmetrics.length > 0) {
                            nmetrics.map((a, index) => {
                                if (a.key === val.metric_val && (a.iid === val.id)) {
                                    let obj1 = {
                                        x: new Date(a.time).getTime(),
                                        y: getYaxis(a.value)
                                    }
                                    tempValArr.push(obj1)
                                }
                                let tempYData = getYaxis(a.value)
                                yAxisData.push(tempYData)
                            })
        
                            tempObj3.data = tempValArr
                            // console.log(index,ind,tempObj3)
                            if(index === ind){
                                let newLineData = tempObj3.data.concat(predicted.data)
                                tempObj3.data = newLineData;
                                // console.log(tempObj3)
                            }
                            finalDataArr.data.push(tempObj3)
                        }
                        let result = []
                        if (finalDataArr.data.length > 0) {
                            result = finalDataArr.data.map((item) => {
                                let minVal, maxVal, avg, stddev, mode, minTime, maxTime;
                                if (item.data.length > 0) {
                                    const yValues = item.data.map((point) => !isNaN(point.y) ? parseFloat(point.y) : 0);
                                    minVal = Math.min(...yValues);
                                    maxVal = Math.max(...yValues);
                                    const xValues = item.data.map((point) => point.x);
                                    minTime = xValues[yValues.findIndex((val) => {return val === minVal})]
                                    maxTime = xValues[yValues.findIndex((val) => {return val === maxVal})]
                                    mode = findMode(yValues)
                                    avg = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;
                                    stddev = calculateStandardDeviation(yValues);
                                    return {
                                        minimum: minVal.toFixed(2),
                                        maximum: maxVal.toFixed(2),
                                        average: avg.toFixed(2),
                                        mode,
                                        minTime,
                                        maxTime,
                                        stddev: stddev.toFixed(2),
                                        datapresent: true
                                    };
                                }
                                else {
                                    return {
                                        minimum: "--",
                                        maximum: "--",
                                        average: "--",
                                        stddev: "--",
                                        datapresent: false
                                    };
                                }

                            });
                        }
                        setCalcArr(result)
                    }
                    else{
                        let newIndex = fdata.data.findIndex(x => x.name === val.metric_title + " (" + val.id + ")");
                        // console.log(newIndex)
                        if(newIndex >= 0){
                            let tempObj2 = {
                                name: val.metric_title + " (" + val.id + ")",
                                id: val.id,
                                color: val.colour,
                                type: 'line',
                                data: fdata.data[newIndex].data,
                            }
                            finalDataArr.data.push(tempObj2)
                        }
                    }
                    if(val.forecastenable){
                        finalDataArr.data[0].color = val.colour
                    }
                })
                
                if(normalizeMode){
                    let normalizedfinalData = Normalize(finalDataArr.data)
                    finalDataArr.data = normalizedfinalData;
                    setYData(finalDataArr) 
                }
                else { setYData(finalDataArr); }
            }
            else if(fdata.data.length === chipLocal.length){// handling new metric trend graph with forecast option enabled in another metric 
                let nummetrics = generateOnlineData.filter(v => typeof (v.value) !== "string")
                let newVal = chipLocal[chipLocal.length-1];
                let tempObj1 = {
                    name: newVal.metric_title + " (" + newVal.id + ")",
                    id: newVal.id,
                    color: newVal.colour,
                    type: charttype ? 'area' : 'line',
                    data: [],
                }

                chipLocal && chipLocal.map((val,ind) => {
                    if(ind === chipLocal.length-1){
                        let tempValArr = [];
                        if (nummetrics.length > 0) {
                            nummetrics.map((a, index) => {
                                if (a.key === val.metric_val && (a.iid === val.id)) {
                                    let obj1 = {
                                        x: new Date(a.time).getTime(),
                                        y: getYaxis(a.value)
                                    }

                                    tempValArr.push(obj1)
                                }
                                let tempYData = getYaxis(a.value)
                                yAxisData.push(tempYData)
                            })

                            tempObj1.data = tempValArr
                            finalDataArr.data.push(tempObj1)
                        }
                    }
                    else{
                        let newIndex = ind+1;
                        let tempObj2 = {
                            name: val.metric_title + " (" + val.id + ")",
                            id: val.id,
                            color: val.colour,
                            type: 'line',
                            data: fdata.data[newIndex].data,
                        }
                        if(ind === 0){
                            let tempRange = {
                                type: 'rangeArea',
                                data: fdata.data[0].data,
                                // color: val.colour, //"#FFECC9"
                                name: "Range Value - "+val.metric_title + " (" + val.id + ")"
                            }
                            
                            finalDataArr.data.push(tempRange)
                        }
                        finalDataArr.data.push(tempObj2)
                    }
                    if(val.forecastenable){
                        finalDataArr.data[0].color = val.colour
                    }
                })
                // console.log(finalDataArr)
                if(normalizeMode){
                    let normalizedfinalData = Normalize(finalDataArr.data)
                    finalDataArr.data = normalizedfinalData;
                    setYData(finalDataArr) 
                }
                else { setYData(finalDataArr); }

                let result = [...calcArr];
                // console.log(calcArr,result)
                if (finalDataArr.data.length > 0) {
                    let item = finalDataArr.data[finalDataArr.data.length-1]
                    let minVal, maxVal, avg, stddev, mode, minTime, maxTime;
                    if (item.data.length > 0) {
                        const yValues = item.data.map((point) => !isNaN(point.y) ? parseFloat(point.y) : 0);
                        const xValues = item.data.map((point) => point.x);
// console.log(yValues)
                        minVal = Math.min(...yValues);
                        maxVal = Math.max(...yValues);
                                    minTime = xValues[yValues.findIndex((val) => {return val === minVal})]
                                    maxTime = xValues[yValues.findIndex((val) => {return val === maxVal})]
                        mode = findMode(yValues)
                        avg = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;
                        stddev = calculateStandardDeviation(yValues);
                        result.push( {
                            minimum: minVal.toFixed(2),
                            maximum: maxVal.toFixed(2),
                            average: avg.toFixed(2),
                            mode,
                            minTime,
                            maxTime,
                            stddev: stddev.toFixed(2),
                            datapresent: true
                        });
                    }
                    else {
                        result.push( {
                            minimum: "--",
                            maximum: "--",
                            average: "--",
                            stddev: "--",
                            datapresent: false
                        });
                    }
                }
                // console.log(result)
                setCalcArr(result)
            }
        }
        else{
            let numericmetrics = generateOnlineData.filter(v => typeof (v.value) !== "string")
            let nonnumericmetrics = generateOnlineData.filter(v => typeof (v.value) === "string")
            let nonfftmetrics = []
            nonnumericmetrics.map((a) => {
                try {
                    let factor = a.key.includes("time_waveform") ? 0.000390625 : 0.625
                    let ind = chipLocal.findIndex(c => c.id === a.iid && c.metric_val === a.key)
                    if (ind >= 0) {
                        let tempObj1 = {
                            name: chipLocal[ind].metric_title + " (" + chipLocal[ind].id + ")",
                            id: chipLocal[ind].id,
                            color: chipLocal[ind].colour,
                            data: [],
                        }
                        JSON.parse(a.value).map((fft, i) => {
                            let obj1 = {
                                x: factor * i,
                                y: fft
                            }
                            tempObj1.data.push(obj1)
                        })
                        tempObj1.time = a.time
                        let tempYData = a.value
                        yAxisData.push(tempYData)
                        finalDataArr.charttype = "fft"
                        let key = finalDataArr.data.findIndex(d => d.name === chipLocal[ind].metric_title + " (" + chipLocal[ind].id + ")")
                        if (key >= 0) {
                            finalDataArr.data[key].data.push(tempObj1)
                        } else {
                            finalDataArr.data.push({ "name": chipLocal[ind].metric_title + " (" + chipLocal[ind].id + ")", data: [tempObj1], "selectedIndex": 0 })
                        }
                    }
                }
                catch (e) {
                    nonfftmetrics.push(a)
                }
            })
// console.log(nonfftmetrics)
            setNonNumberMetrics(nonfftmetrics)
            // console.log(stringAnnotations)
            if(stringAnnotations.length > 0){
                try{
                    let presentannots = stringAnnotations
                    presentannots.forEach(p => {
                        ApexCharts.exec('trendChart', 'removeAnnotation', p.id)
                    })
                }
                catch(err){
                    console.log("TrendsOnline remove annoation err", err)
                }
            }
            chipLocal && chipLocal.map((val) => {
                let tempObj2 = {
                    name: val.metric_title + " (" + val.id + ")",
                    id: val.id,
                    color: val.colour,
                    type: charttype ? 'area' : 'line',
                    data: [],
                }
                let tempRange = {
                    type: 'rangeArea',
                    data: [],
                    color: val.colour, //"#FFECC9"
                    name: val.metric_title + " (" + val.id + ")"
                }
                let tempValArr = [];
                let temprangeArr = []
                if (numericmetrics.length > 0) {
                    numericmetrics.map((a, index) => {
                        if (a.key === val.metric_val && (a.iid === val.id)) {
                            let obj1 = {
                                x: new Date(a.time).getTime(),
                                y: getYaxis(a.value)
                            }
                            if (a.upper && a.lower) {
                                let obj2 = {
                                    x: new Date(a.time).getTime(),
                                    y: [a.lower, a.upper]
                                }
                                temprangeArr.push(obj2)
                            }

                            tempValArr.push(obj1)
                        }
                        let tempYData = getYaxis(a.value)
                        yAxisData.push(tempYData)
                    })

                    tempObj2.data = tempValArr
                    finalDataArr.data.push(tempObj2)
                    if (temprangeArr.length > 0) {
                        tempRange.data = temprangeArr
                        finalDataArr.data.push(tempRange)
                    }

                }
                if (nonfftmetrics.length > 0) {
                    nonfftmetrics.forEach((a, index) => {
                        if (a.key === val.metric_val && (a.iid === val.id)) {
                            let obj1 = {
                                x: new Date(a.time).getTime(),
                                y: (index === 0 || index === nonfftmetrics.length-1) ? 0 : getYaxis(a.value)
                            };
                            tempValArr.push(obj1);
                        
                            let tempYData = getYaxis(a.value);
                            yAxisData.push(tempYData);

                            let akey = `${val.metric_val}-${val.id}-${val.metric_title}`;
                            // console.log(akey,legendView)
                            if(legendView.length > 0 && legendView.indexOf(akey) >= 0){
                                //do nothing to avoid hided annoations in case of hide series option
                            }
                            else{
                                let annot_text = val.metric_data_type === 5 ? getShortText(a.value): a.value;
                                // console.log(annot_text)
                                annotations.push({
                                    id: val.metric_title.replace(/[ ()\/]/g, '-')+ '-' + val.id + '-' ,
                                    x: new Date(a.time).getTime(),
                                    borderColor: val.colour,//'#9FC9F9',
                                    seriesIndex: 0,
                                    label: {
                                        borderColor: val.colour,//'#9FC9F9',
                                        style: {
                                            color: '#fff',
                                            background: val.colour,//'#9FC9F9',
                                        },
                                        text: val.metric_title.replace(/[ ()\/]/g, '-')+ '-' + val.id + '-' + "-" + annot_text
                                    },
                                });
                            }
                        }
                    });


                    tempObj2.data = tempValArr;

                    finalDataArr.data.push(tempObj2)

                }
            })
            setStringAnnotations(annotations);
            let result = []
            if (finalDataArr.data.length > 0) {
                result = finalDataArr.data.map((item) => {
                    let minVal, maxVal, avg, stddev, mode, minTime, maxTime;
                    if (item.data.length > 0) {
                        const yValues = item.data.map((point) => parseFloat(point.y) > 0 ? parseFloat(point.y) : 0);
                        const xValues = item.data.map((point) => { return point.x });
                        minVal = Math.min(...yValues);
                        maxVal = Math.max(...yValues);
                      
                        minTime = xValues[yValues?.findIndex((val) => {return val === minVal})]
                        maxTime = xValues[yValues?.findIndex((val) => {return val === maxVal})]
                        mode = findMode(yValues)
                        avg = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;
                        stddev = calculateStandardDeviation(yValues);
                        return {
                            minimum: minVal.toFixed(2),
                            maximum: maxVal.toFixed(2),
                            average: avg.toFixed(2),
                            stddev: stddev.toFixed(2),
                            mode,
                            minTime,
                            maxTime,
                            datapresent: true
                        };
                    }
                    else {
                        return {
                            minimum: "--",
                            maximum: "--",
                            average: "--",
                            stddev: "--",
                            datapresent: false
                        };
                    }

                });
            }

            setCalcArr(result)
            // console.log(finalDataArr,"finalDataArr")
            if(normalizeMode){
                let normalizedfinalData = Normalize(finalDataArr.data)
                finalDataArr.data = normalizedfinalData;
                setYData(finalDataArr) 
            }
            else { setYData(finalDataArr) }
            if(isReloadForecast){
                let fmetric = chipLocal.filter((a) => a.forecastenable === true)
                // console.log(fmetric)
                if(fmetric.length > 0){
                    setTrendsOnlineLoad(true)
                    getForeCastData(fmetric[0].id,fmetric[0].metric_val)
                }
            }
            
            if(annotations.length > 0){
                setTrendsOnlineLoad(true)
            }
            try {
                setTimeout(() => {
                    annotations.forEach(element => {
                        ApexCharts.exec('trendChart', 'addXaxisAnnotation', element)
                    });
                    setTrendsOnlineLoad(false)
                }, 5000)
            }
            catch (e) {
                setTimeout(() => {
                    annotations.forEach(element => {
                        ApexCharts.exec('trendChart', 'addXaxisAnnotation', element)
                    });
                    setTrendsOnlineLoad(false)
                }, 10000)
            }


            getComments(selectedMeterAndChip)
            let finalyaxisdata = [...new Set(yAxisData)]
            setyAxisDatamax(Math.max(...finalyaxisdata))
            setyAxisDatamin(Math.min(...finalyaxisdata))
        }
    }

    useEffect(() => {
        if (selectedMeterAndChip && selectedMeterAndChip.length) {
            try {
                const annotations = selectedMeterAndChip
                    .map(item => {
                        const { limits } = item;
                        if (limits) {
                            return [limits.upper, limits.lower];
                        }
                        return [];
                    })
                    .flat()
                    .filter(limit => limit && limit.y !== undefined); 
                    setlimitannotations(annotations)
                const annotMax = Math.max(...annotations.map(limit => limit.y));
                const annotMin = Math.min(...annotations.map(limit => limit.y));
    
                yAxisDatamax < annotMax && isFinite(annotMax) ? setmax(annotMax) : setmax(undefined);
                yAxisDatamin > annotMin && isFinite(annotMin) ? setmin(annotMin) : setmin(undefined);
    
                annotations.forEach(limit => {
                    ApexCharts.exec('trendChart', 'addYaxisAnnotation', limit);
                });
            } catch (err) {
                console.error("Error while plotting annotations from selectedMeterAndChip:", err);
            }
        }
    }, [selectedMeterAndChip, yAxisDatamax, yAxisDatamin]);
    
    useEffect(() => {
        
        if (!fetchLimitsLoading && fetchLimitsData && !fetchLimitsError) {
            // console.clear()
            // console.log(fetchLimitsData, yData)
            let res_temp = [];
            yData.data.forEach((x, zz) => {
                let upperbreach = 0
                let lowerbreach = 0
                let y = fetchLimitsData?.filter((limits) => limits.iid === x.name)?.map((value) => value.y)
                let check = fetchLimitsData?.filter((limits) => limits.iid === x.name)?.map((value) => value.check_type)
                let check_range = fetchLimitsData?.filter((limits) => limits.iid === x.name)?.map((value) => value)
                // console.log(x, y, check, check_range)
                if(y.length > 0){
                    let compare = {
                        id: x.id,
                        max: y[0] > y[1] ? y[0] : y[1],
                        min: y[0] > y[1] ? y[1] : y[0],
                        crtical_range: [check_range?.[0]?.critical_min_value, check_range?.[0]?.critical_max_value],
                        warn_range: [check_range?.[1]?.warn_min_value, check_range?.[1]?.warn_max_value],
                    }
                
                    // console.log(compare)
                    x.data.map((z, index) => {
                        // console.log("z _", z.y)

                        if(index === 0) {
                            if(check[0] === 'above'){
                                if((parseFloat(z.y) > parseFloat(compare.max))){
                                    upperbreach = upperbreach + 1
                                } else if ((parseFloat(z.y) > parseFloat(compare.min))){
                                    lowerbreach = lowerbreach + 1
                                }
                            } 
                            else if (check[0] === 'below') {
                                if((parseFloat(z.y) < parseFloat(compare.min))){
                                    upperbreach = upperbreach + 1
                                } else if ((parseFloat(z.y) < parseFloat(compare.max)) && (parseFloat(z.y) > parseFloat(compare.min))){
                                    lowerbreach = lowerbreach + 1
                                }
                            }
                        } else {
                            if(check[0] === 'above'){
                                if((parseFloat(x.data[index-1].y) < parseFloat(compare.max)) && (parseFloat(z.y) > parseFloat(compare.max))){
                                
                                    upperbreach = upperbreach + 1
                                } 
                                else if ((parseFloat(z.y) > parseFloat(compare.min) && (parseFloat(z.y) < parseFloat(compare.max))) && (parseFloat(x.data[index-1].y) > parseFloat(compare.max))){
                                    lowerbreach = lowerbreach + 1
                                } 
                                else if ((parseFloat(z.y) > parseFloat(compare.min)) && (parseFloat(x.data[index-1].y) < parseFloat(compare.min))) {
                                    lowerbreach = lowerbreach + 1
                                }
                            } 
                            else if (check[0] === 'below') {
                                if((parseFloat(x.data[index-1].y) > parseFloat(compare.min)) && (parseFloat(z.y) < parseFloat(compare.min))){

                                    upperbreach = upperbreach + 1
                                // } else if ((parseFloat(z.y) > parseFloat(compare.min) && (parseFloat(z.y) < parseFloat(compare.max))) && ((parseFloat(x.data[index-1].y) < parseFloat(compare.max)) && parseFloat(x.data[index-1].y) > parseFloat(compare.min))){
                                } else if (
                                    (parseFloat(z.y) > parseFloat(compare.min) && 
                                    (parseFloat(z.y) < parseFloat(compare.max))) && 
                                    ((parseFloat(x.data[index-1].y) < parseFloat(compare.min))) //(parseFloat(x.data[index-1].y) < parseFloat(compare.max)) 
                                    // && (parseFloat(x.data[index-1].y) > parseFloat(compare.min))) 
                                ){
                                    lowerbreach = lowerbreach + 1
                                } else if (
                                    (parseFloat(z.y) > parseFloat(compare.min) && 
                                    (parseFloat(z.y) < parseFloat(compare.max))) && 
                                    (parseFloat(x.data[index-1].y) > parseFloat(compare.max))) {
                                    lowerbreach = lowerbreach + 1
                                }
                            }
                        }
                        // console.log("upperbreach -", upperbreach)
                        // console.log("lowerbreach -", lowerbreach)
                        // console.log('\n')
                    })

                    let data = {
                        id: x.id,
                        max: compare.max,
                        min: compare.min,
                        name:`${selectedMeterAndChip?.[zz]?.metric_title} (${x.id})`, 
                        iid: `${selectedMeterAndChip?.[zz]?.metric_val}_${x.id}`,
                        upperbreach,
                        lowerbreach,
                    }
                    res_temp.push(data)
                }
            })
            setBreachCountExplore(res_temp)
            // console.log("______", showLimits)
            let ii = fetchLimitsData.map((xs) => {
                // console.log(xs)
                if(showLimits.includes(xs.iid)){
                    return xs
                }
            }).filter((ss) => ss !== undefined)
            setlimitannotations(ii)
            let annotmax = Math.max(...ii.filter((item) => item !== undefined).map((val) => { return val.y }))
            let annotmin = Math.min(...ii.filter((item) => item !== undefined).map((val) => { return val.y }))
            yAxisDatamax < annotmax && isFinite(annotmax) ? setmax(annotmax) : setmax(undefined)
            yAxisDatamin > annotmin && isFinite(annotmin) ? setmin(annotmin) : setmin(undefined)

            try {
                ii.forEach(element => {
                    ApexCharts.exec('trendChart', 'addYaxisAnnotation', element)
                })
            } catch (err) {
                console.log("error in TrendsOnline while plotting alarm limits", err)
            }
        }
    }, [fetchLimitsLoading, fetchLimitsData, fetchLimitsError, trendsdataData])

    const showannot = async (val) => {
        // console.clear()
        let chipLocal;
            try {
            chipLocal = localStorage.getItem('selectedChipArr')
                ? JSON.parse(localStorage.getItem('selectedChipArr'))
                : [];
            } catch (e) {
            console.error("Failed to parse 'selectedChipArr' from localStorage", e);
            chipLocal = [];
            }
            setShowLimits([...new Set([ ...showLimits, val])])
        getFetchLimits(chipLocal, val)

    }
    const hideannot = (val, graphval) => {
        // console.log(graphval)
        let text = val.split('-')[0]+" "+val.split('-')[1]+" ("+val.split('-')[2]+")"
        setShowLimits(showLimits.filter((xs) => !xs.includes(text)))
        setlimitannotations(limitannots?.filter((a) => a !== undefined && a.id !== val))
        setAnnotationss(annotationss?.filter(a => a.id === graphval?.metric_val + "-" + graphval?.id))
        let annotmax = Math.max(...limitannots.filter((item) => item !== undefined && item.id !== val).map((a) => { return a.y }))
        let annotmin = Math.min(...limitannots.filter((item) => item !== undefined && item.id !== val).map((a) => { return a.y }))
        yAxisDatamax < annotmax && isFinite(annotmax) ? setmax(annotmax) : setmax(undefined)
        yAxisDatamin > annotmin && isFinite(annotmin) ? setmin(annotmin) : setmin(undefined)

        try {
            ApexCharts.exec('trendChart', 'removeAnnotation', val)
            ApexCharts.exec('trendChart', 'removeAnnotation', val)
            let presentannots = annotationss.filter(a => a.id === graphval.metric_val + "-" + graphval.id)
            presentannots.forEach(p => {
                if (p.id === graphval.metric_val + "-" + graphval.id) {
                    ApexCharts.exec('trendChart', 'removeAnnotation', p.id)
                }

            })
            ApexCharts.exec('trendChart', 'removeAnnotation', graphval.metric_val + "-" + graphval.id) // to remove both critical and warning annotations
        }
        catch (err) {
            console.log("TrendsOnline err", err)
        }


    }
    const showSeriess = (val, fft, graphval) => {
        try {
            if (fft) { /** case for handling string type chart (annotations) */
                let annotations = [],strAnnots = stringAnnotations;
                if (nonNumberMetrics.length > 0) {
                    nonNumberMetrics.forEach((a, index) => {
                        if(graphval.id === a.iid && graphval.metric_val === a.key){
                            let annot_text = graphval.metric_data_type === 5 ? getShortText(a.value): a.value;console.log(annot_text)
                            let obj = {
                                id: graphval.metric_title.replace(/[ ()\/]/g, '-')+ '-' + graphval.id + '-',
                                x: new Date(a.time).getTime(),
                                borderColor: graphval.colour,//'#9FC9F9',
                                seriesIndex: 0,
                                label: {
                                    borderColor: graphval.colour,//'#9FC9F9',
                                    style: {
                                        color: '#fff',
                                        background: graphval.colour,//'#9FC9F9',
                                    },
                                    text: graphval.metric_title.replace(/[ ()\/]/g, '-')+ '-' + graphval.id + '-' + "-" + annot_text
                                },
                            };
                            annotations.push(obj);
                            strAnnots.push(obj)
                        }
                    });
                }
                // console.log(annotations)
                try {
                    annotations.forEach(element => {
                        ApexCharts.exec('trendChart', 'addXaxisAnnotation', element)
                    });
                }
                catch (e) {
                    setTimeout(() => {
                        annotations.forEach(element => {
                            ApexCharts.exec('trendChart', 'addXaxisAnnotation', element)
                        });
                    }, 10000)
                }

                if(annotations.length > 0){
                    setStringAnnotations(strAnnots);
                }
            } else {               
                    ApexCharts.exec('trendChart', 'showSeries', val)
               
                let hiddencomment = annotationss.filter(a => a.id === graphval.metric_val + "-" + graphval.id)
                hiddencomment.forEach(h => {
                    ApexCharts.exec('trendChart', "addPointAnnotation", h);
                })


            }
        } catch (err) {
            console.log("Error in TrendsOnline while showing series", err)
        }


    }
    const hideSeriess = (val, fft, graphval) => {
        try {
            setlimitannotations(limitannots.filter((a) => a !== undefined && a.id !== val.split("(")[0].replace(" ", "-")))
            let annotmax = Math.max(...limitannots.filter((item) => item !== undefined && item.id !== val).map((a) => { return a.y }))
            let annotmin = Math.min(...limitannots.filter((item) => item !== undefined && item.id !== val).map((a) => { return a.y }))
            yAxisDatamax < annotmax && isFinite(annotmax) ? setmax(annotmax) : setmax(undefined)
            yAxisDatamin > annotmin && isFinite(annotmin) ? setmin(annotmin) : setmin(undefined)
            if (fft) {/** case for handling string type chart (annotations) */
              
                if(stringAnnotations.length > 0){
                    let annots = stringAnnotations.filter(a => a.id === graphval.metric_title.replace(/[ ()\/]/g, '-')+ '-' + graphval.id + '-')
                    // console.log(stringAnnotations,annots)
                    annots.forEach(p => {
                        ApexCharts.exec('trendChart', 'removeAnnotation', p.id)
                    })
                    let finalannots = stringAnnotations.filter(a => a.id !== graphval.metric_title.replace(/[ ()\/]/g, '-')+ '-' + graphval.id + '-')
                    setStringAnnotations(finalannots);
                }
               
            } else {

                let presentannots = annotationss.filter(a => a.id === graphval.metric_val + "-" + graphval.id)
                presentannots.forEach(p => {
                    if (p.id === graphval.metric_val + "-" + graphval.id) {
                        ApexCharts.exec('trendChart', 'removeAnnotation', p.id)
                    }

                })
               
                    ApexCharts.exec('trendChart', 'hideSeries', val)
                
            }

        } catch (err) {
            console.log(err);
        }
    }
    const hideAllSeries = (val) => {
        val.map(x => {
            ApexCharts.exec('trendChart', 'hideSeries', x);
        })
    }
    const showAllSeries = (val) => {
        try{
            val.map(x => {
                ApexCharts.exec('trendChart', 'showSeries', x);
            })
        } catch(err){
            console.log("error",err)
        }
       
    }

    const renderTypograpyContent = (noalertlimits) => {
        if (noData || noalertlimits) {
            return <div  style={{ marginTop: "60px" }}>
                <Typography variant="paragraph-s" value={t("No Data")} />
            </div>
        }
        else {
            if (selectedMeter.length > 0 && selectedChipArr.length <= 0)
                return <div style={{ marginTop: "60px" }}>
                    <Typography variant="paragraph-s" value={t("ParameterSelect")} />
                </div>
            else
                return <div >
                    <Typography variant="paragraph-s" value={"Select an instrument or metric from the browser to visualize the trend."} />
                </div>
        }
    }

    const generateForecastChart = (metric,key) =>{
        // console.log(metric,key)
        getForeCastData(metric,key)
    }

    
    useEffect(() => {
        if (!forecastdataLoading && forecastdataData && !forecastdataError) {
            // console.log(forecastdataData,Object.keys(forecastdataData).length)
            if(Object.keys(forecastdataData).length === 0 || yData.data.length === 0){
                setSnackMessage(t("No forecast data available for the given metric"))
                setType("warning");
                setOpenSnack(true);

                setForecastconfig(false)
                setGraphMode(false);
                props.setTrendsData([])
                let selectedMetric = localStorage.getItem('selectedChipArr') !== "" ? JSON.parse(localStorage.getItem('selectedChipArr')) : '';
                let newmeters = [...selectedMetric]
                newmeters = newmeters.map((item, i) => {
                    return Object.assign({}, item, { forecastenable: false })
                })
                localStorage.setItem('selectedChipArr', JSON.stringify(newmeters));
                let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
                let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
                let result = moment(toDate).diff(frmDate, 'days') 
                // console.log("No of Days:", result)
                if(result > 10 && Number(props.selectedIntervals) <= 0.167){
                    setSnackMessage(t("Data is too large to display. Please select a shorter time range to view the chart."))
                    setType("warning");
                    setOpenSnack(true);
                }
                else{
                    setTrendsOnlineLoad(true)
                    getTrends(newmeters, headPlant.schema, false)
                }
                setselectedMeterAndChip(newmeters)
            }
            else{
                setForecastData(forecastdataData)
            }
            setTrendsOnlineLoad(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forecastdataLoading, forecastdataData, forecastdataError])

    useEffect(() => {
        // console.log("coming",forecastData)
        if(Object.keys(forecastData).length !== 0){
            if(normalizeMode){
                let tempForecastData = [];
                tempForecastData = tempForecastData.concat(forecastData.lower,forecastData.predicted,forecastData.upper);
                let normalizedData = getNormalizeForecastData(tempForecastData);console.log(normalizedData)
                setReloadForecast(true);
                formRangeAreaChartData(normalizedData)
            }
            else{
                setReloadForecast(false);
                formRangeAreaChartData(forecastData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forecastData])

    const formRangeAreaChartData = (forecastInfo) => {
        let index = selectedMeterAndChip.findIndex(x => x.forecastenable === true ) >= 0 ? selectedMeterAndChip.findIndex(x => x.forecastenable === true ) : 0;
        
        let range,predicted = {};
        range = {
          type: "rangeArea",
          name: "Range Value",
          data: [],
          color: yData.data[index].color,
        }
        predicted = {
          type: "line",
          name: yData.data[index].name,//"Predicted Value",
          data: yData.data[index].data,
          color: yData.data[index].color,
        }
        let checkvalue = parseInt(moment(customdatesval.EndDate).format("x"));//yData.data[index].data[yData.data[index].data.length-1].x;
      
        forecastInfo.lower.data.forEach((val,i) => {
            if(forecastInfo.lower.time[i] === forecastInfo.upper.time[i] && forecastInfo.lower.time[i] === forecastInfo.predicted.time[i] && (parseInt(moment(forecastInfo.predicted.time[i]).format("x"))) > checkvalue){
            let obj = {
              x: parseInt(moment(forecastInfo.lower.time[i]).format("x")),
              y: [Number(val).toFixed(4), Number(forecastInfo.upper.data[i]).toFixed(4)],
            }
            range.data.push(obj)
  
            let lineObj = {
              x: parseInt(moment(forecastInfo.predicted.time[i]).format("x")),
              y: Number(forecastInfo.predicted.data[i]).toFixed(4),
            }
            predicted.data.push(lineObj)
  
            //Annotation for splitting line
            if(i === 0){
              setForecastAnnotation(parseInt(moment(forecastInfo.predicted.time[i]).format("x")));
            }
          }
        })
        
        let series = [range];
        yData.data.forEach((val,ind) => {
            if(ind === index)
                series.push(predicted);
            else
                series.push(val);
        })
       
        let finalDataArr = { 'data': series, 'annotation': [], 'charttype': "timeseries" }
        setYData(finalDataArr)
  
        let result = [], fData;
        if(normalizeMode)
            fData = forecastData;
        else
            fData = forecastInfo;
        if(fData.predicted.data.length > 0){
            let minVal, maxVal, avg, stddev, mode;
            const yValues = fData.predicted.data.map((point) => !isNaN(point) ? parseFloat(point) : 0);

            minVal = Math.min(...yValues);
            maxVal = Math.max(...yValues);
            mode = findMode(yValues);
            avg = yValues.reduce((acc, val) => acc + val, 0) / yValues.length;
            stddev = calculateStandardDeviation(yValues);
            result.push({
                minimum: minVal.toFixed(2),
                maximum: maxVal.toFixed(2),
                average: avg.toFixed(2),
                mode,
                // minTime,
                // maxTime,
                stddev: stddev.toFixed(2),
                datapresent: true
            });
        }
        else {
            result.push({
                minimum: "--",
                maximum: "--",
                average: "--",
                stddev: "--",
                datapresent: false
            });
        }
        // console.log(result)
        setForecastCalcArray(result);
    }

    const renderTimeseriesChart = () => {
        return <TrendsChart hideSeriess={hideSeriess} yData={yData} setcoord={setcoord} min={min} max={max} isCSV={false}  forecastAnnotation={forecastAnnotation} />
    }

    return (
        <React.Fragment>
            {props.trendsData !== undefined && props.trendsData.length > 0 && selectedChipArr.length > 0 && !noData ?
                alertconfig ? loader ? <LoadingScreenNDL/> :
                (alertlimitData.data && alertlimitData.data.length > 0) ?
                <TrendsChart hideSeriess={hideSeriess} yData={alertlimitData} setcoord={setcoord}  isCSV={false}  height={props.height} /> :
                    <div className='flex items-center justify-center'  style={{ justifyContent: "center" }} >
                        {renderTypograpyContent(true)}
                    </div>
                 :
                 renderTimeseriesChart()
                :
                <div className='flex items-center justify-center h-full'  >
                    {renderTypograpyContent()}
                </div>
            }
        </React.Fragment>
    );
})
export default TrendsOnline;