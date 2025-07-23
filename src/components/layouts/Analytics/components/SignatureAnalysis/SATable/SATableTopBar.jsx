import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import Tooltip from "components/Core/ToolTips/TooltipNDL";
import Grid from 'components/Core/GridNDL';
import Typography from 'components/Core/Typography/TypographyNDL';
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import { useRecoilState } from "recoil";
import {
    oeeAssets, saPartsList, saParts, selectedPlant, saAssetArray, SATableData, SALineData, ErrorPage,
    Loadingpanel, SigTabval, superData, SATableData2, snackToggle, snackMessage, snackType,dashBtnGrp,customdates,MetricSANames,AnalyticMet
} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useAuth } from "components/Context";
import useDressingCount from "components/layouts/Reports/ProductionWorkOrder/hooks/useDressingCount";
import useGetMultipleAssetOEEConfig from "components/layouts/Reports/ProductionWorkOrder/hooks/useMultipleAssetOEEConfig";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Button from "components/Core/ButtonNDL/index";
import useGetTheme from 'TailwindTheme';
import SelectBox from 'components/Core/DropdownList/DropdownListNDL';
import CaretLeft from 'assets/neo_icons/Arrows/CaretLeft.svg?react';
import CaretRight from 'assets/neo_icons/Arrows/CaretRight.svg?react';
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import useAnalyticConfigList from 'components/layouts/Settings/Entity/hooks/useAnalyticConfigList.jsx';
import useQualitydata from "components/layouts/Reports/QualityReport/hooks/useQualitydata";
import useMetricTypelist from "components/layouts/Dashboards/Content/standard/hooks/useMetricTypes";
import useAssetOEE from "components/layouts/Reports/DowntimeReport/hooks/useAssetOEE";
import useAssetMetrics from "components/layouts/Analytics/hooks/useAssetMetrics"; 
import useActualPartSignalSA from "components/layouts/Analytics/hooks/useActualPartSignalSA"; 
import useContinousPartsData from "components/layouts/Analytics/hooks/useContinousPartsData"; 
import useChartData from "components/layouts/Analytics/hooks/useChartData"; 
import useSuperpartData from "components/layouts/Analytics/hooks/useSuperpartData";  


const SATableTopBar = forwardRef((props, ref) => { 
    const { HF } = useAuth();
    const theme = useGetTheme();
    const { t } = useTranslation();
    const [,setErrorPage] = useRecoilState(ErrorPage)
    const [durationLimit, setDurationLimit] = useRecoilState(dashBtnGrp);
    const [Customdatesval] = useRecoilState(customdates);
    const [open, setOpen] = useState(false);
    const [AnchorPos, setAnchorPos] = useState(null);
    const [popperOption, setpopperOption] = useState([{ id: 1, name: t("Show Rejections"), checked: false }, { id: 2, name: t("Show Dressing"), checked: false }])
    let analyticDefaults = JSON.parse(localStorage?.getItem('analyticsDefault'))?.startDate ? JSON.parse(localStorage?.getItem('analyticsDefault')) : null
    // console.log(analyticDefaults,"analyticDefaults",Customdatesval)
    const [selectedDateStart, setSelectedDateStart] = useState(analyticDefaults ? new Date(analyticDefaults.startDate) : Customdatesval.StartDate);
    const [selectedDateEnd, setSelectedDateEnd] = useState(analyticDefaults ? new Date(analyticDefaults.endDate) : Customdatesval.EndDate);
    const [tabValue] = useRecoilState(SigTabval);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [, setanalysLoad] = useRecoilState(Loadingpanel);
    const [assetArray, setAssetArray] = useRecoilState(saAssetArray);
    const [oeeAssetsArray] = useRecoilState(oeeAssets);
    const [rangeFrom, setRangeFrom] = useState('');
    const [rangeTo, setRangeTo] = useState('');
    const [assetMap, setAssetMap] = useState([]);
    const [partList, setpartList] = useRecoilState(saPartsList);
    const [partListBad, setpartListBad] = useState([]);
    const [PartListFilter, setpartListFilter] = useState([]);
    const [PartListFilterBad, setpartListFilterBad] = useState([]);
    const [part, setPart] = useRecoilState(saParts);
    const [partBad, setPartBad] = useState('');
    const [headPlant] = useRecoilState(selectedPlant);
    const [TableData, settableData] = useRecoilState(SATableData);
    const [TableCopyData, setTableCopyData] = useState([]);
    const [, setLineSA] = useRecoilState(SALineData);
    const [page,] = useState(0);
    const [rowsPerPage] = useState(6);
    const [count, setCount] = useState(0);
    const [dataSuper, setdataSuper] = useRecoilState(superData);
    const [ImposeTable, setImposeTable] = useRecoilState(SATableData2);
    const [DressingData, setDressingData] = useState([]);
    const [Binary, setBinary] = useState(false);
    const [downFall, setDownFall] = useState(false);
    const [metricArrayName, setmetricArrayName] = useState([]) 
    const [MetricArray,setMetricArray] = useRecoilState(MetricSANames) 
    const [metricArrayName2, setmetricArrayName2] = useState([]) 
    const [MetricArray2,setMetricArray2] = useState([])
    const [metricMap, setmetricMap] = useState([]);
    const [metricMap2, setmetricMap2] = useState([]);
    const [checked, setchecked] = useState(props?.normalize || false);
    const [checkedRej, setcheckedRej] = useState(false); 
    const [AnlyConf,setAnlyConf] = useRecoilState(AnalyticMet);
    const [confintruid,setconfintruid] = useState([]);
    const [confMSintru,setconfMSintru] = useState([]);
    const [confMSMetric,setconfMSMetric] = useState(''); 
    const [MetricName,setmetricName] = useState('part_count'); 
    const [RejectData,setRejectData] = useState([]);
    const [OEEConfigData,setOEEConfigData] = useState([]);
    const [Timer,setTimer] = useState(false);
    const { dressingCountLoading, dressingCountData, dressingCountError, getDressingCount } = useDressingCount();
    const { multipleAssetOEEConfigLoading, multipleAssetOEEConfigData, multipleAssetOEEConfigError, getMultipleAssetOEEConfig } = useGetMultipleAssetOEEConfig();
    const { AnalyticConfigListLoading, AnalyticConfigListData, AnalyticConfigListError, getAnalyticConfigList } = useAnalyticConfigList();
    const { metrictypelistLoading, metrictypelistdata, metrictypelisterror, getMetricTypelist } = useMetricTypelist();
    const { AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, getAssetOEEConfigsofEntity } = useAssetOEE();
    const { AssetMetricsLoading, AssetMetricsData, AssetMetricsError, getAssetMetrics } = useAssetMetrics();
    const { ActualPartSignalSALoading, ActualPartSignalSAData, ActualPartSignalSAError, getActualPartSignalSA } = useActualPartSignalSA()
    const { ContinousPartsDataLoading, ContinousPartsData, ContinousPartsDataError, getContinousPartsData } = useContinousPartsData()
    const { ChartDataLoading, ChartData, ChartDataError, getChartData } = useChartData()
    const { SuperpartDataLoading, SuperpartData, SuperpartDataError, getSuperpartData } = useSuperpartData()
    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight


    const [confiqasset, setconfiqasset] = useState([]);
    const [TempData, setTempData] = useState([]);
    const [IntrType, setIntrType] = useState(0);
    const [RejData, setRejData] = useState([]);
    const [AnalyticConfigList, setAnalyticConfigList] = useState([]);
    const [CycleTime, setCycleTime] = useState(40);
    const [Dresspages, setDresspages] = React.useState([]);
    const [DressIndex, setDressIndex] = React.useState(0);
    const [checkedDress, setcheckedDress] = React.useState(false);
    const { outQualityData, getdowntimedata } = useQualitydata(); 
    const [first, setFirst] = React.useState(true)
    const [flag,setflag] = useState(true)

    useImperativeHandle(ref, () =>
    (
        {
            ChangePage: (e,type) => {
                setanalysLoad(true)
                if(type ==='Locate' || !checkedRej){
                
                 let datas6={
                    data:TempData,
                    val:confintruid,
                    key:MetricArray,
                    page:e,
                    RejectedGraph:RejData,
                    IntrmType:IntrType,
                    dataExe:TableData,
                    cyTime:CycleTime,
                    type:type
                 }
                    getChartData(datas6,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)
                }
            }
        }
    )
    )

    useEffect(() => {
        if (!ActualPartSignalSALoading && ActualPartSignalSAData && !ActualPartSignalSAError) {
            let partlist = []
            if (ActualPartSignalSAData.data.length > 0) {
                for (let i = 0; i < ActualPartSignalSAData.count[0].count; i++) {
                    partlist.push({
                        name: "part_count" + (i + 1),
                        id: i + 1
                    })
                }
                setpartList(partlist)
                setpartListFilter(partlist)
                setanalysLoad(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ActualPartSignalSAData]);

    useEffect(() => {
        getMetricTypelist()
        getAnalyticConfigList()
        if(props.range && flag){
            setDurationLimit(17) 
        }else if(JSON.parse(localStorage?.getItem('analyticsDefault'))?.startDate){
            setDurationLimit(17) 
        }else{
            if(headPlant.cycle_time === 21){
                setDurationLimit(30)
            }else if(headPlant.cycle_time > 61 ){
                setDurationLimit(28)
            }else{
                setDurationLimit(4)
            }
        } 
        setTimer(headPlant.cycle_time) 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    

    useEffect(() => {
        if (!AnalyticConfigListLoading && AnalyticConfigListData && !AnalyticConfigListError) {
            setAnalyticConfigList(AnalyticConfigListData)
            let assetArr = JSON.parse(JSON.stringify(oeeAssetsArray));
            let tempAssetMap = assetArr.filter(at => at.entity.prod_asset_analytics_config).map((tempAsset) => {
                let obj = { "value": false }
                let tmpObj = tempAsset.entity
                tmpObj = { ...tmpObj, ...obj }
                return tmpObj
            })
            setAssetMap(tempAssetMap)
            if(props.module === 'continuous' && tempAssetMap.length > 0){
                console.log(props.module,props.asset,props.metric,props.normalizeParam,props.range,"props")
                if(props.asset && props.metric && props.normalizeParam){
                    if(props.normalizeParam === 'true'){
                        setchecked(true)
                    }
                  console.log(tempAssetMap,"tempAssetMap")
                  let filteredAsset = tempAssetMap.filter(obj => obj.id === props.asset)
                  if(filteredAsset.length > 0){
                  let myObject={
                        target:{
                            value:filteredAsset[0].id || ''
                        }
                    }
                    console.log(myObject,"obj")
                    if(metricMap.length === 0){
                        handleAssetChange(myObject,tempAssetMap)
                    }
                    
                  }else{
                    setErrorPage(true)
                  }
                  console.log(metricMap,"outside")
                  if(filteredAsset && metricMap && metricMap.length > 0){
             
                    
                    props.setModule('')
                   
                  } 
              
                }
                
            }
            else if(props.module === 'superimpose' && tempAssetMap.length > 0){
                if(props.asset && props.metric && props.normalizeParam){
                    if(props.normalizeParam === 'true'){
                        setchecked(true)
                    }
                    console.log(tempAssetMap,"tempAssetMap1")
                    if(tempAssetMap.length > 0){
                       
                        let filteredAsset = tempAssetMap.filter(obj => obj.id === props.asset)
                        console.log(filteredAsset,"filteredAsset1")
                        if(filteredAsset.length > 0){
                        let myObject={
                              target:{
                                  value:filteredAsset[0].id || ''
                              }
                          }
                          console.log(myObject,"obj")
                          if(metricMap2.length === 0){
                            handleAssetChange(myObject,tempAssetMap)
                          }
                         
                        }else{
                            setErrorPage(true)
                        }
                        if(filteredAsset && metricMap2 && metricMap2.length > 0){
                          let metricSplit = props.metric.split(',') 
                          const filteredMetricMap = metricMap2.filter(metric => metricSplit.includes(metric.title));
                          console.log(filteredMetricMap,"filtered1")
                          if(filteredMetricMap.length === 0){
                            setErrorPage(true)
                        }
                          handleMetricChange2(filteredMetricMap)
                        } 
                     
                    }
                
                  }
                  setflag(false)
                  props.setModule('')
            }
            else{
                // console.log('hello')
                if(!props.asset && !props.metric && !props.normalizeParam && (metricMap.length === 0)){
                    setAssetArray([])
                    setmetricArrayName([])
                    setMetricArray([])
                    setmetricArrayName([])
                }
              
                settableData([])
                setLineSA({ Data: [], Data2: [], superData: [], key: [], stroke: [], MaxMin: [], Rejected: [] })
                 setTempData([])
                 setTableCopyData([])
            }
          
        
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AnalyticConfigListLoading, AnalyticConfigListData, AnalyticConfigListError, oeeAssetsArray,props.module,props.asset,props.metric,props.normalizeParam,props.range])

    useEffect(() => {
        if (!multipleAssetOEEConfigLoading && multipleAssetOEEConfigData && !multipleAssetOEEConfigError) {
           
            getDressingCount(headPlant.schema, multipleAssetOEEConfigData, rangeFrom, rangeTo,multipleAssetOEEConfigData.length>0 ? multipleAssetOEEConfigData[0].part_signal_instrument : '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multipleAssetOEEConfigData, rangeFrom, rangeTo]);

    useEffect(() => {
        getMultipleAssetOEEConfig(assetArray)
            getAssetOEEConfigsofEntity(assetArray)
            if(assetArray.length > 0){
                getdowntimedata(assetArray, selectedDateStart, selectedDateEnd)
            }else{
                setmetricMap([])
                setmetricMap2([])
                settableData([])
            }
            // getAssetMetrics(assetArray)
    //    console.log(localStorage.getItem('plantid'),"localStorage.getItem('plantid')",headPlant,assetArray)
    }, [assetArray, headPlant]);

    useEffect(() => {
        if (!dressingCountLoading && dressingCountData && !dressingCountError) {
            setDressingData(dressingCountData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dressingCountLoading, dressingCountData, dressingCountError]);
    useEffect(() => {
        if (outQualityData) {
            setRejectData(outQualityData)
            if (assetArray.length > 0 && metricArrayName.length > 0) {
                getPartsData(rangeFrom, rangeTo, assetArray, MetricArray, page, rowsPerPage, outQualityData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outQualityData])

    useEffect(() => {
        if (AssetOEEConfigsofEntityData && !AssetOEEConfigsofEntityLoading && !AssetOEEConfigsofEntityError) {
            if (AssetOEEConfigsofEntityData.length > 0) {
                setOEEConfigData(AssetOEEConfigsofEntityData)
                // eslint-disable-next-line array-callback-return
                AssetOEEConfigsofEntityData.map((val) => {
                    let metData = []
                    let AnalyticConfig = AnalyticConfigList.filter(x => x.entity_id === val.entity_id)
                    setAnlyConf(AnalyticConfig)
                    console.log(AnalyticConfig, "AnalyticConfig")
                    if (AnalyticConfig.length > 0) {
                        let metArrmap
                        
                        if (durationLimit === 25) {
                            metArrmap = AnalyticConfig[0].config.Metrics.filter(e => (e.key === "ct_load") || (e.key === "f_command"))
                        } else {
                            metArrmap = AnalyticConfig[0].config.Metrics
                        }
                        // eslint-disable-next-line array-callback-return
                        metArrmap.map(val2 => {
                            metData.push({
                                "value": false,
                                "name": val2.name.split('(')[0] + " (" + val2.key + ")",
                                "title": val2.key,
                                "id": val2.id,
                                "on_change": val2.on_change
                            })
                        })
                        setmetricMap(metData)
                        setmetricMap2(metData)
                        
                    } else {
                        getAssetMetrics(assetArray)
                    }
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AssetOEEConfigsofEntityData, AnalyticConfigList]);





    // useEffect(()=> {
    //     getAnalyticConfigList()
    //     JSON.parse(localStorage.getItem('analyticsDefault'))?.asset.length > 0 && getAssetMetrics(JSON.parse(localStorage.getItem('analyticsDefault'))?.asset)
    // },[])

    // useEffect(() => {
    //     setOEEConfigData(AssetOEEConfigsofEntityData)
    //     if(AssetMetricsData?.length > 0) {
    //         let metric_arr = []
    //         // AssetMetricsData?.[0]?.instrument?.instruments_metrics?.map((z) => { metric_arr.push({
    //         //     value: false,
    //         //     name: `${z.metric.title} (${z.metric.name})`,
    //         //     title: z.metric.name || z.metric.title,
    //         //     id: z.metric.id,
    //         //     on_change: z.on_change
    //         // }) })
    //         console.log(AssetMetricsData,"AssetMetricsData")
    //         let entities = AssetMetricsData;
    //             let metricnames = []
    //             entities.forEach((e) => metricnames = metricnames.concat(e.instrument.instruments_metrics.map((m) => m.metric.name)))
    //             let uniquemetricnames = [...new Set(metricnames)]
    //             if (durationLimit === 25) {
    //                 uniquemetricnames = uniquemetricnames.filter(e => (e === "ct_load") || (e === "f_command"))
    //             }
    //             entities.forEach((e) => {
    //                 // eslint-disable-next-line array-callback-return
    //                 // eslint-disable-next-line array-callback-return
    //                 uniquemetricnames.forEach(val => {
    //                     let metfilter = e.instrument.instruments_metrics.filter(f => f.metric.name === val)[0]
    //                     metric_arr.push({
    //                         "value": false,
    //                         "name": metfilter.metric.title + " (" + metfilter.metric.name + ")",
    //                         "title": metfilter.metric.name,
    //                         "id": metfilter.metric.id,
    //                         "on_change": metfilter.on_change

    //                     })
    //                 })
    //             })
    //         setmetricMap(metric_arr)
    //         setmetricMap2(metric_arr)
    //     }
        
    // }, [ localStorage.getItem('analyticsDefault') ])

    useEffect(() => {
        
        if(assetMap?.length > 0) {
            let analyticsDefault = JSON.parse(localStorage.getItem('analyticsDefault'))
            console.log(assetMap,"analyticsDefault",analyticsDefault,props)
            if(analyticsDefault?.asset?.length > 0 && !props.asset && !props.metric){
                console.log(analyticsDefault,"analyticsDefault",AnlyConf)
                getAssetMetrics(analyticsDefault?.asset)
                handleAssetChange(analyticsDefault?.asset?.[0])
                setanalysLoad(false)
            }
        }
    }, [assetMap])
          // eslint-disable-next-line array-callback-return


    useEffect(() => {
        if(metricMap?.length > 0 && AssetOEEConfigsofEntityData?.length > 0 && (first || flag)) {
           if(props.metric && flag){
                let metricSplit = props.metric.split(',') 
                const filteredMetricMap = metricMap.filter(metric => metricSplit.includes(metric.title));
                if(filteredMetricMap.length === 0){
                    setErrorPage(true)
                }
                handleMetricChange(filteredMetricMap)
                setflag(false)
           }else{
                if(first){
                    let analyticsDefault = JSON.parse(localStorage.getItem('analyticsDefault'))
                    analyticsDefault?.metric?.length > 0 ? handleMetricChange(analyticsDefault?.metric) : setanalysLoad(false)
                    analyticsDefault?.metric?.length > 0 && setFirst(false)
                } 
           }
        }
    }, [metricMap])

    useEffect(() => {
        if (!AssetMetricsLoading && AssetMetricsData && !AssetMetricsError) {
            console.log(AssetMetricsData,"AssetMetricsDataAssetMetricsData")
            if (AssetMetricsData.length > 0) {
                setanalysLoad(true)
                let metData = []
                let entities = AssetMetricsData;
                let metricnames = []
                entities.forEach((e) => metricnames = metricnames.concat(e.instrument.instruments_metrics.map((m) => m.metric.name)))
                let uniquemetricnames = [...new Set(metricnames)]
                if (durationLimit === 25) {
                    uniquemetricnames = uniquemetricnames.filter(e => (e === "ct_load") || (e === "f_command"))
                }
                entities.forEach((e) => {
                    // eslint-disable-next-line array-callback-return
                    // eslint-disable-next-line array-callback-return
                    uniquemetricnames.forEach(val => {
                        let metfilter = e.instrument.instruments_metrics.filter(f => f.metric.name === val)[0]
                        metData.push({
                            "value": false,
                            "name": metfilter.metric.title + " (" + metfilter.metric.name + ")",
                            "title": metfilter.metric.name,
                            "id": metfilter.metric.id,
                            "on_change": metfilter.on_change

                        })
                    })
                })
                setmetricMap(metData)
                setmetricMap2(metData)
            }
            else {
                console.log("returndata undefined getMetricsofEntity1");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AssetMetricsLoading, AssetMetricsData, AssetMetricsError]);
    let result = [];
    
    function mapToNameAndId(val) {
        return {
            name: val.Partnum,
            id: val.SNo
        };
    }
    function GoodPartFnc(arr){
        return arr.filter(e => e["Part Quality"] === "Accepted").map(mapToNameAndId);
    }

    function BadPartFnc(arr){
        return arr.filter(e => e["Part Quality"] !== "Accepted").map(mapToNameAndId);
    }

    useEffect(()=>{ 
        if(!ContinousPartsDataLoading && ContinousPartsData && !ContinousPartsDataError){  
         
            if(ContinousPartsData.data.length > 0){
                setanalysLoad(true)
                setCycleTime(ContinousPartsData.cyTime)
                setCount(ContinousPartsData.temp.count[0].count)
                // eslint-disable-next-line react-hooks/exhaustive-deps
                ContinousPartsData.data.forEach(x => result = [...result, ...x.table]);
               
                
                let TabArr=result.map((val,i)=>{
                    
                    let Reject = ContinousPartsData.RejTemp.filter(e => {
                        const formattedMarkedAt = moment(e.marked_at).format("YYYY-MM-DD " + HF.HMS);
                        const formattedEndTime = moment(val.endTime).format("YYYY-MM-DD " + HF.HMS);
                    
                        return moment(formattedMarkedAt).isBetween(moment(val.startTime), moment(formattedEndTime)) || moment(formattedMarkedAt).isSame(formattedEndTime);
                        
                    });
                    
                   
                    return {...val,"SNo":i+1
                                ,"Part Quality": (Reject.length>0) ? "Rejected ,"+Reject[0].prod_reason.reason : "Accepted"
                }
                })
                
               
                let RejectedGraph =TabArr.filter(e=>e["Part Quality"] !== 'Accepted')
                setRejData(RejectedGraph) 
                // console.log(TabArr,"TabArr",ContinousPartsData.RejTemp)
                settableData(TabArr)
                setTableCopyData(TabArr)
                if (metricArrayName2.length > 0) {
                    let partlist = []
                    let partlistBad = []
                    if (TabArr.length > 0) {
                        partlist = GoodPartFnc(TabArr)
                        partlistBad = BadPartFnc(TabArr)
                        
                        setpartList(partlist)
                        setpartListFilter(partlist)
                        setpartListBad(partlistBad)
                        setpartListFilterBad(partlistBad)
                    }
                }

                setTempData(ContinousPartsData.temp)
                let datas7={
                    data:ContinousPartsData.temp,
                    val:ContinousPartsData.value,
                    key:ContinousPartsData.key,
                    page:0,
                    RejectedGraph:RejectedGraph,
                    IntrmType:ContinousPartsData.IntrmType,
                    dataExe:TabArr,
                    cyTime:ContinousPartsData.cyTime,
                    type:"page"
                 }
                getChartData(datas7,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)
            }else{ 
                    settableData([])
                    setTempData([])
                    setTableCopyData([])
                    setanalysLoad(false)  // testing
                    setLineSA({ Data: [], Data2: [], superData: [], key: ContinousPartsData.key,stroke:[],MaxMin:[],Rejected:[] })
                    setImposeTable([])
                    setdataSuper({ Data: [], key: ContinousPartsData.key ,stroke:[]})  
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ContinousPartsData, headPlant]);

    useEffect(() => {
        if(!ChartDataLoading && ChartData && !ChartDataError){
            setanalysLoad(true)
            let Chartresult = [];
            let Chartresult2 = [];
            let Chartresult3 = [];
            
            ChartData.Data.forEach(x => Chartresult2 = [...Chartresult2, ...x.Line]);
            ChartData.Data.forEach(x => Chartresult = [...Chartresult, ...x.table]);
            ChartData.Data.forEach(x => Chartresult3 = [...Chartresult3, ...x.impose]);

            let uniq = [...new Set(Chartresult2.map(item => item.x))];
            let sampearr = []
          
            // eslint-disable-next-line array-callback-return
            uniq.forEach(val => {
                let filval = Chartresult2.filter(fil => fil.x === val);
                filval.forEach(item => {
                    sampearr.push({
                        name: item.name,
                        data: [{
                            x: new Date(item.x).getTime(),
                            y: parseFloat(item.y)
                        }]
                    });
                });
            });
            
            Chartresult.forEach(val => {
                // Assuming curpeak, average, and metrics have the same length
                if(val.curpeak){
                    for (let i = 0; i < val.curpeak.length; i++) {
                        const curpeakData = {
                            name: "Current Peak " + val.metrics[i].title,
                            data: [{
                                x: new Date(val.peakTime[i]).getTime(),
                                y: val.curpeak[i] ? parseFloat(val.curpeak[i]) : 0
                            }]
                        };
                
                        const averageData = {
                            name: "Current Average " + val.metrics[i].title,
                            data: [{
                                x: new Date(val.averageTime[i]).getTime(),
                                y: val.average[i] ? parseFloat(val.average[i]) : 0
                            }]
                        };
                
                        sampearr.push(curpeakData);
                        sampearr.push(averageData);
                        
                        if (Object.keys(val.prod_part_comment).length > 0) {
                            Object.keys(val.prod_part_comment).forEach((newVal) => {
                                if (!isNaN(parseFloat(val.prod_part_comment[newVal][i]))) {
                                    const metricData = {
                                        name: val.metrics[i].title + " " + newVal,
                                        data: [{
                                            x: new Date(val.startTime).getTime(),
                                            y: parseFloat(val.prod_part_comment[newVal][i])
                                        }]
                                    };
                                    sampearr.push(metricData);
                                }
                            });
                        }
                    }
                }
              
            });
            
            let uniqMet = [...new Set(sampearr.map(item => item.name))];
            let strokearr= []
            let MaxMin= []
            let minval=[]
            let maxval=[]
        
            // eslint-disable-next-line array-callback-return
            uniqMet.forEach(val => {
                let mettype = []

                if (AnlyConf.length > 0) {
                    mettype = AnlyConf[0].config.Metrics.filter(e => e.key === val)



                }

                if (mettype.length > 0) {

                    // eslint-disable-next-line array-callback-return
                    AnlyConf[0].config.Config.map(e => {
                        if (e.metric_id === mettype[0].id) {
                            minval.push(Number(e.Min ? e.Min : 0))
                            maxval.push(Number(e.Max ? e.Max : 0))
                        }
                    })

                    let chart = AnlyConf[0].config.Config.filter(e => e.metric_id === mettype[0].id)
                    if (chart.length > 0) {
                        if (chart[0].chartType === 1) {
                            strokearr.push('smooth')
                        } else {
                            strokearr.push('stepline')
                        }
                    } else {
                        strokearr.push('smooth')
                    }

                } else {
                    strokearr.push('smooth')
                }
            })
            if (minval.length > 0) {
                MaxMin = [{ max: Math.max(...maxval), min: Math.min(...minval) }]
            }

            setLineSA({ Data: sampearr, Data2: ChartData.Data2, superData: DressingData, key: ChartData.key, stroke: strokearr, MaxMin: MaxMin, Rejected: ChartData.Rejected })
            setanalysLoad(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ChartDataLoading, ChartData, ChartDataError]);

    useEffect(() => {
        if (!SuperpartDataLoading && SuperpartData && !SuperpartDataError) {
            if (SuperpartData.Data.length > 0) {
                setdataSuper({ Data: SuperpartData.Data, key: SuperpartData.key, stroke: SuperpartData.stroke })
                setImposeTable(SuperpartData.ImposeData)
                props.imposTable(SuperpartData.ImposeData)
                setanalysLoad(false)
            } else {
                setanalysLoad(false)
                setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('No record Found for this part_count'))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SuperpartDataLoading, SuperpartData, SuperpartDataError]);

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useInterval(() => {
        if(metricArrayName.length>0){
            let startrange = moment(rangeFrom).add(10, 'seconds').format('YYYY-MM-DDTHH:mm:ss'+TZone)
            let endrange = moment(rangeTo).add(10, 'seconds').format('YYYY-MM-DDTHH:mm:ss'+TZone)
            setRangeTo(endrange)
            setRangeFrom(startrange)
            
            let datas={
                val:confintruid,
                assets:assetArray,
                start:startrange,
                end:endrange,
                page:page,
                rowsPerPage:rowsPerPage,
                binaryval:Binary,
                downfallval:downFall,
                key:MetricArray,
                MSintru:confMSintru,
                MSMetric:confMSMetric,
                metName:MetricName
            }
            getContinousPartsData(datas,IntrType,RejectData,headPlant,Timer,CycleTime,AnlyConf)
        }
    }, (durationLimit === 25) ? 10000 : null);

    const handleAssetChange = (e,assetList) => {
        console.log(e,assetList,"e value")
        setMetricArray([])
        setmetricArrayName([])
        setmetricArrayName2([])
        setMetricArray2([])
        let assetArr = []
        let selectedAsset;
        if(props.module && props.asset){
             selectedAsset = e?.target?.value ? assetList.filter(v => v.id === e?.target?.value) : assetList.filter(v => v.id === e);
        }
        else{
            selectedAsset = e?.target?.value ? assetMap.filter(v => v.id === e?.target?.value) : assetMap.filter(v => v.id === e);
        } 

        if (selectedAsset.length > 0) {
            assetArr.push(selectedAsset[0].id)
        }
       
        if (assetArr.length > 0) {
            getAssetOEEConfigsofEntity(assetArr)
        }
        else {
            setmetricMap([])
            setmetricMap2([])
        }
        setAssetArray(assetArr);
        if (assetArr.length > 0 && rangeFrom && rangeTo) {
            getdowntimedata(assetArr, rangeFrom, rangeTo)
            settableData([])
            setTempData([])
            setTableCopyData([])
            setanalysLoad(false)
            setLineSA({ Data: [], Data2: [], superData: [], key: [], stroke: [], MaxMin: [], Rejected: [] })
            setImposeTable([])
            setdataSuper({ Data: [], key: [], stroke: [] })
        }

    }


    const handleMetricChange = (e) => {

        if (e.length > 3) {
            setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Maximum 3 metrics Allowed'))

            return false
        } 
        setMetricArray(e)
        setmetricArrayName(e)
        settableData([])
        setLineSA({ Data: [], Data2: [], superData: [], key: [], stroke: [], MaxMin: [], Rejected: [] })
        setImposeTable([])
        setTempData([])
        setTableCopyData([])
        setdataSuper({ Data: [], key: [], stroke: [] })
        if (rangeFrom && e.length > 0) {
            getPartsData(rangeFrom, rangeTo, assetArray, e, page, rowsPerPage, RejectData)
        } else {
            setanalysLoad(false)
        }
    }
    const handleMetricChange2 = (e) => {
        if (e.length > 3) {
            setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Maximum 3 metrics Allowed'))
            return false
        }
        setMetricArray2(e)
        setmetricArrayName2(e)

        setImposeTable([])
        setdataSuper({ Data: [], key: [], stroke: [] })
        if (e.length > 0) {
            getPartsData(rangeFrom, rangeTo, assetArray, e, page, rowsPerPage, RejectData)
        }


    }
    const handlePartChange = (val, e) => {
        if (val) {
            if (metricArrayName2.length > 1) {

                if (ImposeTable.length >= 2) {
                    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Maximum 2 parts allowed'))
                    return false
                }

            } else {
                if (ImposeTable.length >= 6) {
                    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Maximum 6 parts allowed'))
                    return false
                }
            }

            let data = [...partList]
            let index = data.findIndex(f => f.id === val.target.value) 
            setPart(val.target.value) 
            getSuperLine(confiqasset, rangeFrom, rangeTo, index, data[index].name, MetricArray2)
        }

    }
    const handlePartChangeBad = (val, e) => {
        if (val) {
            if (metricArrayName2.length > 1) {
                if (ImposeTable.length >= 2) {
                    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Maximum 2 parts allowed'))
                    return false
                }

            } else {
                if (ImposeTable.length >= 6) {
                    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Maximum 6 parts allowed'))
                    return false
                }
            }

            let data = [...partListBad]
            let index = data.findIndex(f => f.id === val.target.value)
            setPartBad(val.target.value)
            getSuperLine(confiqasset, rangeFrom, rangeTo, index, data[index].name, MetricArray2)
        }
    }

    function getPartsData(start, end, assets, key, pages, PerPage, RejDat) {
        if (tabValue === 0) {
            props.pageindex(0)
            setcheckedRej(false)
            props.RejectedOnly(false)
        }

       
        if (part !== 'all') {
        
                    setanalysLoad(true)
                    if (OEEConfigData.length > 0) {
                        // eslint-disable-next-line array-callback-return
                        result = [];
                        // eslint-disable-next-line array-callback-return
                        let intruid = []
                        let MSintru = []
                        let binary = false;
                        let downfall = false; 
                        let MSMetric=''
                        let metName='part_count'
                        let TypeInt = 0
                        OEEConfigData.forEach((val) => { 
                            intruid.push(val.instrument.id)
                            binary = val.is_part_count_binary
                            downfall = val.is_part_count_downfall 
                            metName=val.metric.name
                            setBinary(val.is_part_count_binary)
                            setDownFall(val.is_part_count_downfall) 
                            setmetricName(val.metric.name)
                            let AnalyticConfig = AnalyticConfigList.filter(x => x.entity_id === val.entity_id)
                            if(!metrictypelisterror && !metrictypelistLoading && metrictypelistdata){
                                let metType= metrictypelistdata.filter(e=> e.name === metName)
                                TypeInt = metType[0].instrument_type
                                setIntrType(metType[0].instrument_type)
                            }
                            setAnlyConf(AnalyticConfig)
                            if(AnalyticConfig.length > 0){
                                if(val.is_status_signal_available){
                                    MSintru.push(val.instrumentByMachineStatusSignalInstrument.id)
                                    MSMetric =val.metricByMachineStatusSignal.name
                                }
                            }
                            
                            
                            
                        })
                        setconfintruid(intruid)
                        setconfMSintru(MSintru)
                        setconfMSMetric(MSMetric)
                        setconfiqasset(intruid)
                        if(tabValue === 0){
                            let datas1={
                                val:intruid,
                                assets:assets,
                                start:start,
                                end:end,
                                page:pages,
                                rowsPerPage:PerPage,
                                binaryval:binary,
                                downfallval:downfall,
                                key:key,
                                MSintru:MSintru,
                                MSMetric:MSMetric,
                                metName:metName
                            }
                            getContinousPartsData(datas1,TypeInt,RejDat,headPlant,Timer,CycleTime,AnlyConf)
                            
                        }else{
                            let datesARR={
                                start:start,
                                end:end
                            }
                            let MSignal={
                                binary:binary,
                                downfall:downfall,
                                MSintru:MSintru,
                                MSMetric:MSMetric,
                                metName:metName
                            }
                            getSuperParts(intruid, assets, datesARR, pages, PerPage,MSignal)
                        }  
                    }
                    
           
        }
    }

    function getSuperParts(val, assets, Datearr, pages, PerPage, Msignal) {

        const body1 = {
            schema: headPlant.schema,
            instrument_id: val.toString(),
            metric_name: Msignal.metName,
            MSMetric: Msignal.MSMetric,
            MSintru: Msignal.MSintru.toString(),
            start_date: Datearr.start,
            end_date: Datearr.end,
            asset_ids: assets, 
            pagesize: PerPage,
            pageindex: pages,
            binary: Msignal.binary,
            downfall: Msignal.downfall
        }
        let partlist = []
        let partlistBad = []
        if (TableCopyData.length > 0) {
            partlist = GoodPartFnc(TableCopyData)
            partlistBad = BadPartFnc(TableCopyData) 
            setpartList(partlist)
            setpartListFilter(partlist)
            setpartListBad(partlistBad)
            setpartListFilterBad(partlistBad)
            setanalysLoad(false)
        } else {
            setanalysLoad(true)
            getActualPartSignalSA(body1)
        }


    }

    function getSuperLine(val, start, end, pages, partname, metrics) {
        setanalysLoad(true)
        if (tabValue !== 0) {
            props.pageindex(0)
            setcheckedDress(false)
            if(!checkedRej){
                let datas8={
                    data:TempData,
                    val:confintruid,
                    key:MetricArray,
                    page:0,
                    RejectedGraph:RejData,
                    IntrmType:IntrType,
                    dataExe:TableCopyData,
                    cyTime:CycleTime,
                    type:"page"
                 }
                getChartData(datas8,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)
            }
        }
        let datas5={
            val:val,
            metrics:metrics,
            start:start,
            end:end,
            page:pages,
            part:partname,
            headPlant:headPlant,
            MetricName:MetricName,
            confMSMetric:confMSMetric,
            confMSintru:confMSintru,
            assetArray:assetArray,
            Binary:Binary,
            downFall:downFall

        }
        // eslint-disable-next-line array-callback-return
        if (ImposeTable.length > 0) {
            // eslint-disable-next-line array-callback-return
            let len = ImposeTable.filter(v => v.Partnum.includes(partname))
            if (len.length > 0) {
                setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('Already Exist'))
                setanalysLoad(false)
                return false
            } else { 
                
               
                getSuperpartData(datas5, TableCopyData, count, RejectData, ImposeTable, dataSuper, AnlyConf)
            }

        } else {
           
            getSuperpartData(datas5, TableCopyData, count, RejectData, ImposeTable, dataSuper, AnlyConf)
        }

        

    }

    const handleCheck = (e) => {
        setchecked(!checked)
        props.setnormalize(e.target.checked)
    }

    const handleClose = () => {
        setOpen(false)
        setAnchorPos(null)
    };

    const handleClick = (e, type) => {
        setOpen(!open)
        setAnchorPos(e.currentTarget)
    };

    useEffect(() => {
        let startrange = moment(Customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ')
        let endrange = moment(Customdatesval.EndDate).format('YYYY-MM-DDTHH:mm:ssZ')
        let limit = (headPlant.cycle_time === 61 || headPlant.cycle_time === 60) ? 60 : headPlant.cycle_time === 21 ? 20 : 120 
        if(moment(Customdatesval.EndDate).diff(moment(Customdatesval.StartDate), 'minutes') > limit){
            endrange = moment(Customdatesval.StartDate).add(limit,'minutes').format("YYYY-MM-DDTHH:mm:ssZ")
        }
        if (durationLimit === 25) {
            setAssetArray([])
            setmetricArrayName([])
            setMetricArray([])
            settableData([])
            setTempData([])
            setTableCopyData([])
            setmetricMap([])
            setmetricMap2([])
            setLineSA({ Data: [], Data2: [], superData: [], key: [], stroke: [], MaxMin: [], Rejected: [] })
            startrange = moment(moment().subtract(Timer, 'minutes')).format("YYYY-MM-DDTHH:mm:ssZ")
            endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
        }

        setRangeFrom(startrange)
        setRangeTo(endrange)
        if (assetArray.length > 0 && metricArrayName.length > 0) {
            if (durationLimit !== 25) {
                if (metricMap.length === 2) {
                    // console.log('hi 1')
                    setAssetArray([])
                    setmetricArrayName([])
                    setMetricArray([])
                    settableData([])
                    setTempData([])
                    setTableCopyData([])
                    setmetricMap([])
                    setmetricMap2([])
                    setLineSA({ Data: [], Data2: [], superData: [], key: [], stroke: [], MaxMin: [], Rejected: [] })
                } else {
                    setcheckedDress(false)
                    getdowntimedata(assetArray, startrange, endrange)
                }
            }
        }
        console.log(Customdatesval,"JSON.stringify(analyticDefaults)")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Customdatesval])

      
      function NextDressing(){
        let indx = Math.ceil(parseFloat(Dresspages[DressIndex+1],5)/5) 
        props.pageindex(indx-1)
        setDressIndex(DressIndex+1)
        let datas9={
            data:TempData,
            val:confintruid,
            key:MetricArray,
            page:indx-1,
            RejectedGraph:RejData,
            IntrmType:IntrType,
            dataExe:TableCopyData,
            cyTime:CycleTime,
            type:"Locate"
         }
        getChartData(datas9,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)
      }
      
    function PrevDressing() {
        let indx = Math.ceil(parseFloat(Dresspages[DressIndex - 1], 5) / 5)
        props.pageindex(indx-1)
        setDressIndex(DressIndex-1)
        let datas10={
            data:TempData,
            val:confintruid,
            key:MetricArray,
            page:indx-1,
            RejectedGraph:RejData,
            IntrmType:IntrType,
            dataExe:TableCopyData,
            cyTime:CycleTime,
            type:"Locate"
         }
        getChartData(datas10,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)
      }

    function optionChange(e, data, val) {
        let value = data.map(v => {
            if (v.id === e.id) {
                return { ...v, checked: !v.checked }
            } else {
                return { ...v }
            }
        })
        setpopperOption(value)
        if (e.name === 'Show Rejections') {
            setcheckedRej(!checkedRej)
            props.RejectedOnly(!checkedRej)
            props.pageindex(0)
            if (value && value.length > 0 && value[0].checked) {
                let rejection = TableData.filter(f => f["Part Quality"] !== "Accepted")
                settableData(rejection)
                if(rejection.length === 0){
                    setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('No rejection Found'))
                    return false
                }
            } else {
                settableData(TableCopyData)
                if(TableCopyData.length>0){
                    let datas11={
                        data:TempData,
                        val:confintruid,
                        key:MetricArray,
                        page:0,
                        RejectedGraph:RejData,
                        IntrmType:IntrType,
                        dataExe:TableCopyData,
                        cyTime:CycleTime,
                        type:"page"
                     }
                    getChartData(datas11,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)    
                }


            }
        } else {
            setcheckedDress(!checkedDress)
            if (!e.checked) {
                let pages = []
                // eslint-disable-next-line array-callback-return
                TempData.data.map((obj, i) => {
                    if ((TempData.data.length - 1) !== i) {
                        let Dress = DressingData[0].data.filter(f => moment(moment(f.time).format("YYYY-MM-DD " + HF.HMS)).isBetween(moment(TempData.data[i + 1].time), moment(obj.time)))
                        if (Dress.length > 0) {
                            pages.push(i + 1)
                        }
                    } else {
                        let Dress = DressingData[0].data.filter(f => moment(moment(f.time).format("YYYY-MM-DD " + HF.HMS)).isBetween(moment(obj.time).subtract(CycleTime, 'seconds'), moment(obj.time)))
                        if (Dress.length > 0) {
                            pages.push(i + 1)
                        }
                    }
                })
                setDresspages(pages)
                if (pages.length > 0) {
                    let pageIdx = Math.ceil(parseFloat(pages[0], 5) / 5)
                    props.pageindex(pageIdx-1)
                    let datas12={
                        data:TempData,
                        val:confintruid,
                        key:MetricArray,
                        page:pageIdx-1,
                        RejectedGraph:RejData,
                        IntrmType:IntrType,
                        dataExe:TableCopyData,
                        cyTime:CycleTime,
                        type:"Locate"
                     }
                    getChartData(datas12,headPlant,rowsPerPage,rangeFrom,rangeTo,AnlyConf,MetricArray)
                }else{
                    
                        setOpenSnack(true); setSnackType('warning'); setSnackMessage(t('No Record Found in Dressing'))
                    
                    
                }
            }
        }
    }
    return (
        <div className='px-4 py-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark' style={{height: '47', borderBottom: '1px solid ' + theme.colorPalette.divider }} >
            <ListNDL
                options={popperOption}
                Open={open}
                multiple={true}
                optionChange={optionChange}
                keyValue={"name"}
                keyId={"id"}
                id={"popper-dressing"}
                onclose={handleClose}
                anchorEl={AnchorPos}
                width="180px"
            />
<div className='flex gap-4 items-center'>
<Grid container spacing={4} style={{ alignItems: "center" }} size={12}>
                <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography value={t('Signature Analysis')}  variant="heading-01-xs" color='secondary'/>
                </Grid>
                 
                
                <Grid item xs={tabValue === 0 ? 4 : 2} >
                    <div style={{display : tabValue === 0 ? "block" : "none" }} >
                        <DatePickerNDL
                            id="custom-range-analytics"
                            onChange={(dates,btn) => {
                                const [start, end] = dates;
                                let analyticDefaults = JSON.parse(localStorage?.getItem('analyticsDefault')) ? JSON.parse(localStorage?.getItem('analyticsDefault')) : {}
                                
                                
                                if(headPlant.cycle_time && start && end){
                                    let limit = (headPlant.cycle_time === 61 || headPlant.cycle_time === 60) ? 60 : headPlant.cycle_time === 21 ? 20 : 120
                                    let startrange = moment(start).format("YYYY-MM-DDTHH:mm:ssZ") 
                                    let endrange = moment(end).format("YYYY-MM-DDTHH:mm:ssZ")
                                    let diff = moment(end).diff(moment(start), 'minutes')
                                    if(diff > limit){
                                        endrange = moment(start).add(limit,'minutes').format("YYYY-MM-DDTHH:mm:ssZ")
                                    }else if(diff <= 0){
                                        endrange = moment(start).add(limit,'minutes').format("YYYY-MM-DDTHH:mm:ssZ")
                                    }
                                    // console.log(analyticDefaults,"JSON.stringify(analyticDefaults)",headPlant,endrange,moment(end).diff(moment(start), 'minutes'))    
                                    if(analyticDefaults){
                                        analyticDefaults["startDate"] = new Date(startrange)
                                    }
                                    setSelectedDateStart(new Date(startrange))
                                    if(moment(end).isAfter(endrange) || moment(start).isAfter(moment(end))){
                                        setSelectedDateEnd(new Date(endrange))
                                        if(analyticDefaults){
                                            analyticDefaults["endDate"] = new Date(endrange)
                                        } 
                                    }else{
                                        setSelectedDateEnd(end);
                                        if(analyticDefaults){
                                            analyticDefaults["endDate"] = new Date(end)
                                        } 
                                    }
                                    if(analyticDefaults){
                                        
                                        localStorage.setItem('analyticsDefault',JSON.stringify(analyticDefaults))
                                    }
                                    
                                }
                                else{
                                    setSelectedDateStart(start);
                                    setSelectedDateEnd(end);
                                }
                            }}
                            startDate={selectedDateStart}
                            endDate={selectedDateEnd}
                            disabled={true}
                             dateFormat="dd/MM/yyyy HH:mm:ss"
                            selectsRange={true}
                            timeFormat="HH:mm:ss"
                            customRange={true}
                            defaultDate={durationLimit}
                            Dropdowndefine={"analytics"}
                            timerChange={Timer}
                            maxDays={'0'}
                            maxHours={Timer}
                            queryDate={props.range}
                            isNoEditTime={true}
                            warning={'Data will be display up to max of 1 hr.'}
                        />
                        </div>
                </Grid>
                <Grid item xs={tabValue === 0 ? 2 : 1} >
                    {(tabValue === 0) &&
                        <SelectBox
                            labelId="assetSelectLbl"
                            placeholder={t("Select asset")}
                            label={""}
                            id="Select-asset"
                            auto={false}
                            multiple={false}
                            options={assetMap}
                            isMArray={true}
                            checkbox={false}
                            value={assetArray.length > 0 ? assetArray[0] : ''}
                            onChange={handleAssetChange}
                            dynamic={rangeFrom}
                            keyValue="name"
                            keyId="id"
                        />
                    }
                </Grid>
                <Grid item xs={2} >
                    {tabValue === 0 ?
                        <SelectBox
                            labelId="assetmetricLbl"
                            label={""}
                            placeholder={t("SelectMetric")}
                            id="Select-metric"
                            auto={false}
                            multiple={true}
                            options={metricMap}
                            isMArray={true}
                            checkbox={true}
                            value={metricArrayName}
                            onChange={handleMetricChange}
                            dynamic={rangeFrom}
                            keyValue="name"
                            keyId="title"
                            maxSelect={3}
                        />
                        :
                        <SelectBox
                            labelId="assetmetricLbl"
                            placeholder={t("SelectMetric")}
                            id="Select-metric"
                            auto={false}
                            multiple={true}
                            options={metricMap2}
                            isMArray={true}
                            checkbox={true}
                            value={metricArrayName2}
                            onChange={handleMetricChange2}
                            dynamic={rangeFrom}
                            keyValue="name"
                            keyId="title"
                            maxSelect={3}
                        />

                    }

                </Grid>
                {
                    tabValue ===0 &&
                    <Grid item xs={1} >
                    {(durationLimit !== 25) &&
                        <CustomSwitch
                            id={'Normalize'}
                            switch={false}
                            checked={checked}
                            onChange={handleCheck}
                            primaryLabel={t("Normalize")}
                        />
                    }
                </Grid>
                }
                

                <Grid item xs={tabValue === 0 ? 1 : 4} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    {tabValue === 0 &&
                        ((durationLimit !== 25) &&
                            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                {/* {(DressingData.length > 0) && checkedDress && (Dresspages.length > 0) && */}
                                    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Tooltip title={DressIndex !== 0 &&'Previous Dressing'} placement="top" arrow>
                                            <CaretLeft onClick={DressIndex !== 0 && PrevDressing}
                                                fontSize='small' stroke={"#0F6FFF"} fill={DressIndex === 0 ? "#0f6fff2b" : "#0F6FFF"} />
                                        </Tooltip>
                                        <span style={{ color: '#444' }}>Dressing</span>
                                        <Tooltip title={DressIndex !== (Dresspages.length - 1) && 'Next Dressing'} placement="top" arrow>
                                            <CaretRight onClick={DressIndex === (Dresspages.length - 1) ? null : NextDressing}
                                                fontSize='small' stroke={"#0F6FFF"} fill={DressIndex === (Dresspages.length - 1) ? "#0f6fff2b" : "#0F6FFF"} />
                                        </Tooltip>
                                    </div> */}
                                {/* } */}

                            </div>)
                    }
                    {tabValue !== 0 &&
                        <div style={{ display: 'flex', justifyContent: 'end',gap:"16px", alignItems: 'center', width: '405px' }}>
                            <SelectBox
                                labelId="assetmetricLbl"
                                label={""}
                                placeholder={t("AcceptedPart")}
                                id="Select-Accepted-Part"
                                disableCloseOnSelect={true}
                                auto={true}
                                value={part}
                                options={PartListFilter}
                                isMArray={true}
                                onChange={(e, option) => handlePartChange(e, option)}
                                keyValue="name"
                                keyId="id"
                            />

                            <SelectBox
                                labelId="assetmetricLbl"
                                label={""}
                                placeholder={t("RejectedPart")}
                                id="Select-Rejected-Part"
                                auto={true}
                                value={partBad}
                                disableCloseOnSelect={true}
                                options={PartListFilterBad}
                                isMArray={true}
                                onChange={(e, option) => handlePartChangeBad(e, option)}
                                keyValue="name"
                                keyId="id"
                            />

                        </div>
                    }
                    {tabValue === 0 &&
                        <Button icon={MoreVertLight} type='ghost' onClick={(e) => handleClick(e)} />}

                </Grid>
                {
                    tabValue ===1 &&
                    <Grid item xs={1} >
                    {(durationLimit !== 25) &&
                        <CustomSwitch
                            id={'Normalize'}
                            switch={false}
                            checked={checked}
                            onChange={handleCheck}
                            primaryLabel={t("Normalize")}
                        />
                    }
                </Grid>
                }
                

            </Grid >

            {tabValue === 0 &&
                        ((durationLimit !== 25) &&
            <div>
             {(DressingData.length > 0) && checkedDress && (Dresspages.length > 0) &&
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {(DressIndex !== 0) &&
                                        <Tooltip title={(DressIndex !== 0) ? 'Previous Dressing' : ''} placement="bottom" arrow>
                                            <CaretLeft style={{cursor:'pointer'}} onClick={DressIndex !== 0 ? PrevDressing : null}
                                                fontSize='small' stroke={"#0F6FFF"} fill={DressIndex === 0 ? "#0f6fff2b" : "#0F6FFF"} />
                                        </Tooltip>}
                                        <span style={{ color: '#444' }}>Dressing</span>
                                        {(DressIndex !== (Dresspages.length - 1)) &&
                                        <Tooltip title={(DressIndex !== (Dresspages.length - 1)) ? 'Next Dressing' : ''} placement="bottom" arrow>
                                            <CaretRight style={{cursor:'pointer'}} onClick={DressIndex === (Dresspages.length - 1) ? null : NextDressing}
                                                fontSize='small' stroke={"#0F6FFF"} fill={DressIndex === (Dresspages.length - 1) ? "#0f6fff2b" : "#0F6FFF"} />
                                        </Tooltip>}
                                    </div>
             }
            </div>
                        )
                    }
</div>
            

        </div>
    )
})

export default SATableTopBar;