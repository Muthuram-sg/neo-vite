/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import Grid from 'components/Core/GridNDL'; 
import { useRecoilState } from "recoil";
import { themeMode, ProdBtnGrp, selectedPlant, showOEEAsset, customDashBool, hierarchyData, customdates, oeeAssets,DateSrch } from "recoilStore/atoms";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import moment from 'moment';
import ProductionDashboard from './ProductionDashboard';
import LoadingScreenNDL from "LoadingScreenNDL";
import useCycleTime from './hooks/useCycleTime'; 
import useQualityDefects from 'Hooks/useQualityDefects';
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import SolidGauge from 'components/Core/SolidGauge/SolidGauge';
import HorizontalLineNDL from 'components/Core/HorizontalLine/HorizontalLineNDL';
import usePartSignalStatus from 'Hooks/usePartSignalStatus';

export default function OEEDashboard(props) {
    const [OEEList, setOEEList] = useState([]);
    const [curTheme] = useRecoilState(themeMode);
    const [hierarchyView] = useRecoilState(hierarchyData);
    const [hieararchyData, setHierarchyData] = useState([]);
    const [headPlant] = useRecoilState(selectedPlant);
    const [btGroupValue] = useRecoilState(ProdBtnGrp);
    const [, setSelectedAssetID] = useRecoilState(showOEEAsset);
    const [, setIsCustom] = useRecoilState(customDashBool);
    const [breadcrump, setBreadcrump] = useState([{ id: 1, name: 'Home' }]);
    const [hierarchyIndex, setHierarchyIndex] = useState(0);
    const [isProdDash, setIsProdDash] = useState(false);
    const [Loadingpanel, setLoadingPanel] = useState(false);
    const [customdatesval] = useRecoilState(customdates);
    const [oeeConfigData, setOEEConfigData] = useState([]);
    const [rangeStart, setRangeStart] = useState(new Date());
    const [rangeEnd, setRangeEnd] = useState(new Date());
    const [oeeAssetsArray] = useRecoilState(oeeAssets);
    const [assertstatus, setassertstatus] = useState('');
    const [DatesSearch,setDatesSearch] = useRecoilState(DateSrch); 
    const { cycleLoading, cycleData, cycleError, getCycleTime } = useCycleTime(); 
    const { partLoading, partData, partError, getPartsCompleted } = usePartSignalStatus(); 
    const { qualDefLoading, qualDefData, qualDefError, getQualityDefects } = useQualityDefects();
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight  

    
    
    useEffect(() => {
        getAssetOEEConfigs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        
         if (oeeConfigData.length > 0 && (btGroupValue === 6 || btGroupValue === 7 || btGroupValue === 10 || btGroupValue === 11 || btGroupValue === 21 || btGroupValue === 19 || btGroupValue === 20 || btGroupValue === 17)) {
            triggerOEE(oeeConfigData)
            // console.log(customdatesval,"customdatesval1",oeeConfigData)
           
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval])

    useEffect(() => {
        // console.log(DatesSearch,"customdatesval2",oeeConfigData)
        if (oeeConfigData.length > 0) {
            if (btGroupValue === 6 || btGroupValue === 7 || btGroupValue === 10 || btGroupValue === 11 || btGroupValue === 21 || btGroupValue === 19 || btGroupValue === 20 || btGroupValue === 17) {
                triggerOEE(oeeConfigData)

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oeeConfigData])

    useEffect(() => {
        let OEE = { availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", status: "STOPPED", runTime: 0, downTime: 0, rejParts: 0 };
        if ((!cycleError && !cycleLoading && cycleData && cycleData.length >0) && (!partError && !partLoading && partData && partData.length > 0) && (!qualDefError && !qualDefLoading && qualDefData)) {
            
            Promise.all(oeeConfigData.map(async (val, index) => {
                if (!cycleLoading && !cycleError && !partLoading && !partError && !qualDefLoading && !qualDefError) {
                    // console.log(partData[index][0],"assetStatData.dTime")
                    let assetStatData = partData[index][0].assetStatData
                    OEE = configParam.OEE_PROD_VALUE({start :rangeStart, end: moment(Math.min(new Date(), new Date(rangeEnd))).format('YYYY-MM-DDTHH:mm:ss'+TZone)}, {job_exp_cycle_time: cycleData[index].cycleTime, mode_exp_cycle_time: partData[index][0].cycleTime, part_act_cycle_time: partData[index][0].actCycleTime}, partData[index][0].data.length, assetStatData ? assetStatData.dTime : 0, assetStatData ? assetStatData.totalDTime : 0, qualDefData[index].loss ? qualDefData[index].loss : 0);
                    const availability = isNaN(OEE.availability) ? 0 : OEE.availability;
                    const performance = isNaN(OEE.performance) ? 0 : OEE.performance;
                    const Quality = isNaN(OEE.quality) ? 0 : OEE.quality;
                    OEE.OEE = parseInt((availability * performance * Quality) * 100)
                    OEE.entity_id = val.entity_id;
                } 
                let assetStatData2 = partData[partData.length-1][0].assetStatData
                if (partData && assetStatData2 && assetStatData2.data.length > 0) { 
                    
                    if (!val.is_status_signal_available) {
                        setassertstatus(assetStatData2 ? assetStatData2.status : '')
                     } else {
                         OEE.status = assetStatData2 ? assetStatData2.status : ''
                    }

                    // console.log('Oee',OEE)
                }
                return OEE;
            }))
                .then(data => {
                    processOEE(data, hierarchyView);
                    // console.log(data,"OEEdata")
                    setOEEList(data);
                    setLoadingPanel(false);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cycleLoading, cycleError, partLoading, partError, qualDefLoading, qualDefError])

    function getAssetOEEConfigs() {
        setLoadingPanel(true);
        configParam.RUN_GQL_API(gqlQueries.getOnlyAssetOEEConfig, { line_id: headPlant.id })
            .then((oeeData) => {
                if (oeeData !== undefined && oeeData.neo_skeleton_prod_asset_oee_config && oeeData.neo_skeleton_prod_asset_oee_config.length > 0) {
                    setOEEConfigData(oeeData.neo_skeleton_prod_asset_oee_config)
                    setSelectedAssetID({ show: false, id: 0 })
                } else {
                    setLoadingPanel(false);
                }
            });
    }

    async function triggerOEE(dataArray) {
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+TZone);
        let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss"+TZone);

         if (btGroupValue === 10) {
            if (!cycleError && cycleData) {
                startrange = moment(cycleData[0].jobStart).format('YYYY-MM-DDTHH:mm:ss'+TZone)
                endrange = moment(cycleData[0].jobEnd).format('YYYY-MM-DDTHH:mm:ss'+TZone)
            }
            else {
                startrange = moment().format('YYYY-MM-DDTHH:mm:ss'+TZone)
                endrange = moment().format('YYYY-MM-DDTHH:mm:ss'+TZone)
            }
        } 
        if (startrange === "No shift") {
            setLoadingPanel(false);
            setHierarchyData([])
        } else {
            getCycleTime(dataArray, 'now()', 'now()')
            setRangeStart(startrange)
            setRangeEnd(endrange)
            getPartsCompleted(headPlant.schema, dataArray, startrange, endrange,false,[],[],'',true) 
            getQualityDefects(dataArray, startrange, endrange);
        }
        setDatesSearch(false)

    }

    const viewDetailedOEE = (node) => {
        const assetID = node.id;
        setSelectedAssetID({ show: true, id: assetID })
        setIsCustom(false);
        setIsProdDash(true);
        const level = {
            id: node.id,
            name: node.name,
            index: node.hierarchy ? node : hierarchyIndex
        };
        const breads = [...breadcrump];
        breads.push(level)
        setBreadcrump(breads);
    }
    function processOEE(oee, hierarchylist) {
        let hierarchyList = [];
        oee.forEach(y => {
            if (y) {
                const hierarchy = hierarchylist.filter((x) => {
                    const hierString = JSON.stringify(x.hierarchy ? x.hierarchy : x);
                    if (hierString.includes(y.entity_id)) {
                        return x;
                    }
                }).map(z => {
                    let obj1 = { ...z };
                    const hierString = JSON.stringify(z.hierarchy ? z.hierarchy : z);
                    if (hierString.includes(y.entity_id)) {
                        const repeatedArr = hierarchyList.find(x => x.id === z.id);
                        const accAvailability = repeatedArr ? repeatedArr.availability : 0;
                        const accPerformance = repeatedArr ? repeatedArr.performance : 0;
                        const accQuality = repeatedArr ? repeatedArr.quality : 0;
                        obj1.availability = y.availability + accAvailability;
                        obj1.performance = y.performance + accPerformance;
                        obj1.quality = y.quality + accQuality;
                        obj1.status = y.status;
                        obj1.OEE = y.OEE;
                    }
                    if (z.id === y.entity_id) {
                        obj1.isEntity = true;
                        obj1.Actualparts = parseInt(y.actParts);
                        obj1.Expectedparts = parseInt(y.expParts);
                        obj1.PartsDifferenceStatus = y.partDiffStat;
                        obj1.PartsDifferenceValue = parseInt(y.partDiffVal);
                        obj1.dtTimeDiff = y.downTime;
                        obj1.QualityLoss = parseInt(y.qualLoss);
                        obj1.actualOperateTime = y.runTime;
                        obj1.RejectedParts = parseInt(y.rejParts);
                    }
                    return obj1;
                })
                hierarchyList = [...hierarchyList, ...hierarchy]
            }
        })
        const uniqueIds = new Set(hierarchyList.map((item) => item.id))
        const hierarchyWithUniqueIds = [...uniqueIds].map(id => hierarchyList.find(item => item.id === id)).filter(Boolean)

        setHierarchyData(hierarchyWithUniqueIds);
    }

    const sortedHierarchyData = [...hieararchyData].sort((a, b) => {
        const extractParts = (name) => {
            const match = name.match(/^([a-zA-Z\s\-]+)(\d+)?$/i);
            return {
                alpha: match ? match[1].trim().toLowerCase() : name.toLowerCase(),
                num: match && match[2] ? parseInt(match[2], 10) : NaN
            };
        };
    
        const aParts = extractParts(a.name);
        const bParts = extractParts(b.name);
        if (aParts.alpha < bParts.alpha) return -1;
        if (aParts.alpha > bParts.alpha) return 1;
    
        // If alphabetic parts are equal, compare numeric
        if (isNaN(aParts.num) && !isNaN(bParts.num)) return -1;
        if (!isNaN(aParts.num) && isNaN(bParts.num)) return 1;
        if (!isNaN(aParts.num) && !isNaN(bParts.num)) {
            return aParts.num - bParts.num;
        }
    
        return 0;
    });


    const viewInDetail = (hierarchy) => {
        if (hierarchy.hierarchy || hierarchy.children) {
            const level = {
                id: hierarchy.id,
                name: hierarchy.name,
                index: hierarchy.hierarchy ? hierarchy : hierarchyIndex
            };
            const breads = [...breadcrump];
            breads.push(level)
            processOEE(OEEList, hierarchy.hierarchy ? hierarchy.hierarchy : hierarchy.children)
            setBreadcrump(breads);
            if (hierarchy.hierarchy) {
                setHierarchyIndex(hierarchy.id)
            }
        }
    }
    const findCurrentNode = (hierarchy, hierID, store) => {
        if (hierarchy.id === hierID) {
            if (hierarchy.children && hierarchy.children.length > 0) {
                hierarchy.children.forEach(x => store.push(x))
            }
        }
        hierarchy.children.map(hier => {
            if (hier.children) {
                findCurrentNode(hier, hierID, store);
            }
        })
    }
    
    function OeeLoop(type, arr) {
        if (arr[0]) {
            if (arr[0].children) {
                if (arr[0].children[0] && arr[0].children[0].type === 'instrument') {
                    return arr[0].id
                } else {
                    if (arr[0].children) {
                        return OeeLoop(arr[0].type, arr[0].children)
                    }
                }
            } else {
                return arr[0].id
            }
        }
    }
    function getBG(val, shadow, shadowglow) {
        let dataconf = []
        if (val.children) {
            if (val.children && val.children.length > 0 && val.children[0].type === 'instrument') {
                dataconf = oeeConfigData.filter(e => e.entity_id === val.id)
            } else {
                if (val.children && val.children[0]) {
                    let oeeID = OeeLoop(val.children[0].type, val.children)
                    if (oeeID) {
                        dataconf = oeeConfigData.filter(e => e.entity_id === oeeID)
                    }
                }
            }
        } else {
            if (val.hierarchy && val.hierarchy[0]) {
                let oeeID = OeeLoop(val.hierarchy[0].type, val.hierarchy[0].children)
                if (oeeID) {
                    dataconf = oeeConfigData.filter(e => e.entity_id === oeeID)
                }
            }
        } 
        if (val) {
            if (dataconf.length > 0) {
                if (shadow) {

                    if (val.OEE > Number(dataconf[0].above_oee_value)) {

                        return "#FFFFFF"
                    }
                    else if (val.OEE < Number(dataconf[0].below_oee_value)) {

                        return "#FF2B2B"
                    }
                    else {

                        return "#E0B103"
                    }

                }
                else if (shadowglow) {
                    if (val.OEE < Number(dataconf[0].below_oee_value)) {

                        return "isbelow 2s infinite"
                    }
                    else if (val.OEE <= Number(dataconf[0].above_oee_value)) {


                        return "isbetween 2s infinite"
                    }

                } else {
                    if (val.OEE > Number(dataconf[0].above_oee_value)) {

                        return dataconf[0].above_oee_color
                    }
                    else if (val.OEE < Number(dataconf[0].below_oee_value)) {

                        return dataconf[0].below_oee_color
                    }
                    else {

                        return dataconf[0].between_oee_color
                    }
                }

            }
            else {
                return curTheme === "dark" ? "#171717" : "#ffffff"
            }
        }

    } 
const renderColorsForbackground = (valstatus) => {
    if (valstatus) {
        if (valstatus === "ACTIVE") {
            return "#30a46e"
        } else {
            if (valstatus === "IDLE") {
                return '#0074CB'
            }   
        }
    } else {
        return "#FFFFFF"
    }
}

    const assetCard = (val) => {
        const asset = oeeAssetsArray.filter(x => x.entity.id === val.id)
        let isDryer = false;
        if (asset.length > 0) {
            isDryer = asset[0] && asset[0].entity && asset[0].entity.dryer_config ? asset[0].entity.dryer_config.is_enable : false ;
        }
        if (isDryer) {
            return (
                <Grid item sm={12} md={4} lg={4} >
                    <KpiCards style={{  border: '1px solid transparent ',borderRadius:"6px", backgroundClip: 'padding-box', borderImage: `${getBG(val)}`, boxShadow: `0px 0px 16px 0px ${getBG(val, true)}`, animation: `${getBG(val, false, true)}` }} onClick={() => { viewDetailedOEE(val) }} >

                                <div style={{ display: "flex", justifyContent: "space-between" }}>

                                    <TypographyNDL variant="heading-02-xs" color='secondary' style={{ textAlign: 'left' }} value={val.name}/>
                                    {
                                        val.status ?
                                            (val.status === 'ACTIVE' || val.status === 'IDLE') && (btGroupValue === 6 || btGroupValue === 11 || btGroupValue === 19) &&
                                            
                                         <div className={"h-[24px] px-2 py-1 rounded inline-flex gap-1 justify-center items-center "} style={{ background:renderColorsForbackground(val.status)}}>
                                                <div style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', fontWeight: '500', lineHeight: "18px", wordWrap: 'break-word' }}>{val.status}</div>
                                            </div>
                                            :
                                            (assertstatus === 'ACTIVE' || assertstatus === 'IDLE') && (btGroupValue === 6 || btGroupValue === 11 || btGroupValue === 19) &&
                                            <div className={"h-[24px] px-2 py-1 rounded inline-flex gap-1 justify-center items-center "} style={{ background:renderColorsForbackground(assertstatus)}}>
                                                <div style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', fontWeight: '500', lineHeight: "18px", wordWrap: 'break-word' }}>{assertstatus}</div>
                                            </div>
                                    }
                                </div>
                                <Grid container spacing={4}>
                                   
                                    <Grid item lg={6}>
                                      
                                         <SolidGauge status={val.status} actualParts={val.Actualparts} machineAvailablity={val.availability} Performance={val.performance} Quality={val.quality}/>
                                       
                                    </Grid>
                                    <Grid item lg={3} style={{ justifyContent: 'center', display: 'inline-grid' }}>
                                        <div style={{ paddingTop: 20 }}>
                                            <TypographyNDL variant="paragraph-s" value="Material Fed" />
                                            <TypographyNDL variant="label-02-lg" mono  value={val.Expectedparts} />
                                        </div>
                                        <div >
                                            <TypographyNDL variant="paragraph-s" value="Material Dried" />
                                            <TypographyNDL variant="label-02-lg" mono  value={val.QualityLoss} />
                                        </div>
                                        <div>
                                            <TypographyNDL variant="paragraph-s" value="Startup Time" />
                                            <TypographyNDL variant="label-02-lg" mono  value={val.Actualparts} />
                                        </div>
                                        <div>
                                            <TypographyNDL variant="paragraph-s" value="Downtime" />
                                            <TypographyNDL variant="label-02-lg" mono  value={val.PartsDifferenceValue} />
                                        </div>
                                    </Grid>
                                </Grid>
                                
                            </KpiCards>
                </Grid>
            )
        } else {
            return (
                <Grid item sm={12} md={4} lg={4} >
                    <KpiCards style={{ height: "100%",borderRadius:"6px",  border: '1px solid transparent ', backgroundClip: 'padding-box', borderImage: `${getBG(val)}`, boxShadow: `0px 0px 16px 0px ${getBG(val, true)}`, animation: `${getBG(val, false, true)}` }} onClick={() => { viewDetailedOEE(val) }} >
                         
                                <div  className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark' style={{ display: "flex", justifyContent: "space-between" }}>
                                    <TypographyNDL variant="heading-02-xs" color='secondary' style={{ textAlign: 'left', fontWeight: 500 }} value={val.name}/>
                                    {
                                        val.status ?
                                            (val.status === 'ACTIVE' || val.status === 'IDLE') && (btGroupValue === 6 || btGroupValue === 11 || btGroupValue === 19) &&
                                            <div className={"h-[24px] px-2 py-1 rounded inline-flex gap-1 justify-center items-center "} style={{background:renderColorsForbackground(val.status)}}>
                                                <div style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', fontWeight: '500', lineHeight: "18px", wordWrap: 'break-word' }}>{val.status}</div>
                                            </div>
                                            :
                                            (assertstatus === 'ACTIVE' || assertstatus === 'IDLE') && (btGroupValue === 6 || btGroupValue === 11 || btGroupValue === 19) &&
                                            <div className={"h-[24px] px-2 py-1 rounded inline-flex gap-1 justify-center items-center "} style={{background:renderColorsForbackground(assertstatus)}}>
                                                <div style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', fontWeight: '500', lineHeight: "18px", wordWrap: 'break-word' }}>{assertstatus}</div>
                                            </div>
                                    }

                                </div>
                                <Grid container spacing={4}>
                                    <Grid item sm={8}>
                                    <SolidGauge   status={val.status} actualParts={val.Actualparts} machineAvailablity={val.availability} Performance={val.performance} Quality={val.quality}/>
                                    </Grid>
                                    <Grid item lg={3} style={{ justifyContent: 'center', display: 'inline-grid' }}>
                                        <div style={{ paddingTop: 20 }}>
                                            <TypographyNDL variant="paragraph-s" color='secondary' value="Actual Parts" />
                                            <TypographyNDL variant="label-02-lg" mono   value={val.Actualparts} />
                                        </div>
                                        <div>
                                            <TypographyNDL variant="paragraph-s" color='secondary' value="Rejected Parts" />
                                            <TypographyNDL variant="label-02-lg" mono   value={val.RejectedParts ? val.RejectedParts : "--"} />
                                        </div>
                                        <div>
                                            <TypographyNDL variant="paragraph-s" color='secondary' value="Run Time" />
                                            <TypographyNDL variant="label-02-lg" mono   value={moment("1900-01-01 00:00:00").add(val.actualOperateTime, 'seconds').format("HH:mm:ss")} />
                                        </div>
                                        <div>
                                            <TypographyNDL variant="paragraph-s" color='secondary' value="Downtime" />
                                            <TypographyNDL variant="label-02-lg" mono   value={moment("1900-01-01 00:00:00").add(val.dtTimeDiff, 'seconds').format("HH:mm:ss")} />
                                        </div>
                                    </Grid>
                                </Grid>
                               
                            </KpiCards>
                </Grid>
            )
        }
    }
    const handleActiveIndex = (index) => {
        const existBreadcrump = [...breadcrump];
        const hierarchysid = existBreadcrump[index].id
        existBreadcrump.length = index + 1;
        const filterHierarchy = hierarchyView.filter(x => x.id === hierarchyIndex);
        if (index === 0) {
            processOEE(OEEList, hierarchyView)
        } else if (index === 1) {
            const currentHierarchy = filterHierarchy[0].hierarchy;
            processOEE(OEEList, currentHierarchy)
        } else {
            const currentHierarchy = filterHierarchy[0].hierarchy[0];
            let storage = [];
            findCurrentNode(currentHierarchy, hierarchysid, storage);
            processOEE(OEEList, storage)
        }
        setBreadcrump(existBreadcrump);
        setIsProdDash(false);
    };

    const renderOEEEntity = (valt) => {
        // console.log(valt,'valt')
        if (!valt.isEntity) {
            return (
                <Grid item sm={3} >
                    <KpiCards style={{border: '1px solid transparent ',borderRadius:"6px", backgroundClip: 'padding-box', borderImage: `${getBG(valt)}`, boxShadow: `0px 0px 16px 0px ${getBG(valt, true)}`, animation: `${getBG(valt, false, true)}` }} onClick={() => { viewInDetail(valt) }} >
                        <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark' style={{ display: "flex", justifyContent: "space-between" }}>
                            <TypographyNDL color='secondary' variant="heading-01-xs"  value={valt.name} />
                            {
                                valt.status ?
                                    (valt.status === 'ACTIVE' || valt.status === 'IDLE') && (btGroupValue === 6 || btGroupValue === 11 || btGroupValue === 19) &&
                                    <div className={"h-[24px] p-2 rounded-md inline-flex gap-1 justify-center items-center "} style={{ background:renderColorsForbackground(valt.status)}}>
                                        <TypographyNDL color ="#FFFFFF" value={valt.status} variant={'paragraph-xs'} />
                                    </div>
                                    :
                                    (assertstatus === 'ACTIVE' || assertstatus === 'IDLE') && (btGroupValue === 6 || btGroupValue === 11 || btGroupValue === 19) &&
                                    <div className={"h-[24px] p-2 rounded-md inline-flex gap-1 justify-center items-center "} style={{ background:renderColorsForbackground(assertstatus)}}>
                                        <TypographyNDL color ="#FFFFFF" value={assertstatus} variant={'paragraph-xs'} />
                                    </div>
                            }


                        </div>
                        <SolidGauge machineAvailablity={valt.availability} Performance={valt.performance} Quality={valt.quality} />
                    </KpiCards>
                </Grid>
            )
        } else {
            return (
                <React.Fragment>
                    {assetCard(valt)}
                </React.Fragment>
            )

        }
    }
  const renderOEELayout=()=>{
    if (Loadingpanel) {
        return <LoadingScreenNDL />;
    }else{
        if (hieararchyData && hieararchyData.length > 0) {
            return (
                <React.Fragment>
                    {
                        breadcrump.length > 1 && (
                            <React.Fragment>
  <div className='px-4 py-2 bg-Background-bg-primary dark:bg-Background-bg-primary-dark flex h-[48px]'>
                                {
                                    <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
                                }
                            </div>
                            <HorizontalLineNDL variant='divider1' />
                            </React.Fragment>
                          
                        )
                    }
                    {
                        isProdDash ? (
                            <ProductionDashboard />
                        ) : (
                            <Grid container spacing={4} style={{ padding:16 }}>
                                {

                                sortedHierarchyData.map((val, index) => {
                                        return(
                                            renderOEEEntity(val)
                                        )
                                      
                                    })

                                }
                            </Grid>
                        )
                    }
                </React.Fragment>
            );
        } else {
            return (
                <div style={{ textAlign: "center", display: "flex", justifyContent: "center", position: "relative", top: "250px" }}>
                    <TypographyNDL variant="heading-01-lg" color="primary" value={rangeStart.toString() === "No shift" ? 'No Shift Available for Selected Time  Range' : 'No Data'} />
                </div>
            );
        }
    
    }

  }


    return (
        <div className='bg-Background-bg-secondary min-h-92vh dark:bg-Background-bg-secondary-dark '>
{renderOEELayout()}
        </div>
    )
}