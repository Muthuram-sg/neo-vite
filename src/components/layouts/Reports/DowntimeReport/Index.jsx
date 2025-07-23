/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import { useRecoilState } from "recoil";
import { themeMode, reportProgress, stdReportDuration, stdDowntimeAsset, selectedPlant, microStopDuration, user, customdates } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import moment from 'moment'; 
import EnhancedTable from "components/Table/Table";
import Charts from 'components/Charts_new/Chart'
import Button from 'components/Core/ButtonNDL';
import useAddreasons from "./hooks/useAddreasons";
import useUpdatereasons from "./hooks/useUpdatereasons";
import useReasonslistbyType from "./hooks/useReasonslistbyType";
import useAssetOEE from "./hooks/useAssetOEE";
import useRealinstrulist from "./hooks/useRealInstrumentList";
import useAssetListofOEE from "./hooks/useAssetOEEofLine";
import useReasonsType from "components/layouts/Settings/Production/Reasons/hooks/useReasonsType";
import useGetDownTime from './hooks/useGetDownTime';
import DownTimeView from './components/DownTimeView';
import useReasons from "components/layouts/Settings/Production/Reasons/hooks/useReasons.jsx";
import useReasonTags from "components/layouts/Settings/Production/Reasons/hooks/useReasonTags.jsx";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import commonReports from '../components/common';
import KpiCards from 'components/Core/KPICards/KpiCardsNDL';
import LoadingScreenNDL from "LoadingScreenNDL";
import Tooltip from 'components/Core/ToolTips/TooltipNDL';
import RejectDTModal from "./components/RejectDTmodal";
import Toast from "components/Core/Toast/ToastNDL";
import usePartSignalStatus from 'Hooks/usePartSignalStatus';
import useGetEntityInstrumentsList from 'components/layouts/Tasks/hooks/useGetEntityInstrumentsList.jsx';
import useGenerateRawReport from 'components/layouts/Reports/hooks/useGenerateRawReport';
import useGetProdOutage from './hooks/useGetProdOutage'
import * as momentZone from 'moment-timezone';


let instrumentsList = [];
let AssetListOEE = [];
function DowntimeReport(props) {//NOSONAR
    const [curTheme] = useRecoilState(themeMode);
    const [headPlant,] = useRecoilState(selectedPlant);
    const [, setProgress] = useRecoilState(reportProgress);
    const [reportDuration] = useRecoilState(stdReportDuration);
    const [downtimeAsset] = useRecoilState(stdDowntimeAsset);
    const [tableData, setTableData] = useState([]);
    const [overviewXval, setOverviewX] = useState([]);
    const [overviewYval, setOverviewY] = useState([]);
    const [trendsData, setTrendsData] = useState([]);
    const [trendsLoading, setTrendsLoading] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackType, setType] = useState('');
    const [snackOpen, setOpenSnack] = useState(false);
    const [showMicroStop,] = useRecoilState(microStopDuration);
    const [currUser] = useRecoilState(user);
    const [outageID, setOutageID] = useState('');
    const [startDt, setStartDt] = useState('')
    const [endDt, setEndDt] = useState('');
    const { t } = useTranslation();
    const [mttfAvgVal, setMttfAvgVal] = useState(0);
    const [mttfXVal, setMttfXVal] = useState([]);
    const [mttfYVal, setMttfYVal] = useState([]);
    const [customdatesval,] = useRecoilState(customdates);
    const [tableDataTotal, SetTableDataTotal] = useState([]);
    const [isShowShift, setIsShowShift] = useState(false);
    const [isShowEnergy, setIsShowEnergy] = useState(false);
    const [reasonsList, setReasonsList] = useState([])
    const [pageCount, setpageCount] = useState(0)
    const [pageSize, setpageSize] = useState('')
    const [DataOption, setDataOption] = useState([])
    const [downloadablecolumn, setdownloadabledata] = useState();
    const [pageidx,setPageidx] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { addreasonswithoutIDLoading, addresonswithoutIDData, addreasonswithoutIDError, getaddreasonswithoutID } = useAddreasons()
    const { updatereasonswithoutIDLoading, updatereasonswithoutIDData, updatereasonswithoutIDError, getupdatereasonswithoutID } = useUpdatereasons();
    const { outRTYLoading, outRTYData, outRTYError, getReasonTypes } = useReasonsType();
    const { outlistbytypeLoading, outlistbytypeData, outlistbytypeError, getReasonListbyTypes } = useReasonslistbyType();
    const { AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, getAssetOEEConfigsofEntity } = useAssetOEE();
    const { partLoading, partData, partError, getPartsCompleted } = usePartSignalStatus();
    const { outreallistLoading, outreallistData, outreallistError, getInstrumentFormulaList } = useRealinstrulist();
    const { AssetOEEConfigsofLineLoading, AssetOEEConfigsofLineData, AssetOEEConfigsofLineError, getAssetOEEConfigsofLine } = useAssetListofOEE();
    const { downTimeLoading, downTimeData, downTimeError, getDownTime } = useGetDownTime();
    const { outGRLoading, outGRData, outGRError, getReasons } = useReasons();
    const { ReasonTagsListData, getReasonTags } = useReasonTags()
    const [, setentityId] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [EntityInstrumentsList, setEntityInstrumentsListData] = useState([]);
    const { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList } = useGetEntityInstrumentsList();
    const [bulkDownload, setBulkDownload] = useState(false);
    const [cancelText, setcancelText] = useState(false);
    const [bulkJsonObj, setbulkJsonObj] = useState({})
    const [dialogType, setdialogType] = useState('')
    const { GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError, getGenerateRawReport } = useGenerateRawReport();
    const [okText, setokText] = useState(false);
    const { productoutagelistLoading, productoutagelistdata, productoutagelisterror, getProductOutageList } = useGetProdOutage()

    const [groupby, setgroupby] = useState(1)
    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 
    const DTRef = useRef();
    const reportGroupBy = [{ id: 1, groupby: "All" }, { id: 2, groupby: "Daywise" }, { id: 3, groupby: "Shiftwise" }]

    useEffect(() => {
        if (!outGRLoading && !outGRError && outGRData) {

            if (outGRData) {
                setReasonsList(outGRData)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGRLoading, outGRData, outGRError])
useEffect(()=>{
console.log("pageidx",pageidx)
},[pageidx])

    useEffect(() => {
        if (!GenerateRawReportLoading && GenerateRawReportData && !GenerateRawReportError) {
            if (GenerateRawReportData.id) {
                setProgress(false);
                setOpenSnack(false);
                setokText(true)

            } else {
                setProgress(false);
                setOpenSnack(true)
                setType("warning")
                setSnackMessage("Unable To Run Bulk Report Please Try Again")

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError]);
    useEffect(() => {

    })

    useEffect(() => {
        if (!EntityInstrumentsListLoading && EntityInstrumentsListData && !EntityInstrumentsListError) {
            setEntityInstrumentsListData(EntityInstrumentsListData)
        }
    }, [EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError])

    useEffect(() => {
        getAssetOEEConfigsofLine(headPlant.id)
        getInstrumentFormulaList(headPlant.id);
        getReasons();
        getReasonTypes();
        getReasonTags(headPlant.id)
        getEntityInstrumentsList(headPlant.id)

    }, [headPlant])
    
    useEffect(() => {
        getAssetOEEConfigsofEntity(downtimeAsset);
        if (downtimeAsset.length > 0) {
            setProgress(true);
        }
        setIsShowEnergy(false)
        setBulkDownload(false)
        setcancelText(false)
        setokText(false)
        console.log('report downtime index',customdatesval)
    }, [downtimeAsset, reportDuration, customdatesval,showMicroStop]);

    useEffect(() => {
        setBulkDownload(false)
        setcancelText(false)
    }, [downtimeAsset, AssetOEEConfigsofEntityData])

    

    useEffect(() => {
        let startDate = moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DDTHH:mm:ssZ")
        let endDate = moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DDTHH:mm:ssZ")
        if (AssetOEEConfigsofEntityData && AssetOEEConfigsofEntityData.length > 0) {
            getPartsCompleted(headPlant.schema, AssetOEEConfigsofEntityData, startDate, endDate, '', [], [],0,false,false,true)
        }

    }, [AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, bulkDownload]);

    useEffect(() => {
        if (partData && partData !== null) {
            getTrendAndStatus(AssetOEEConfigsofEntityData, 0)
        }

    }, [partLoading, partData, partError]);

    useEffect(() => {
        getAssetOEEConfigsofEntity(downtimeAsset)
        getInstrumentFormulaList(headPlant.id);
        getAssetOEEConfigsofLine(headPlant.id)
        getReasonTypes();
    }, [addresonswithoutIDData, headPlant, downtimeAsset, refresh]);


    useEffect(() => {
        if (outreallistData) {
            instrumentsList = [...instrumentsList, ...outreallistData]
        }

    }, [outreallistLoading, outreallistData, outreallistError])

    useEffect(() => {
        if (!AssetOEEConfigsofLineLoading && AssetOEEConfigsofLineData && !AssetOEEConfigsofLineError) {
            AssetListOEE = [...AssetListOEE, ...AssetOEEConfigsofLineData]
        }

    }, [AssetOEEConfigsofLineLoading, AssetOEEConfigsofLineData, AssetOEEConfigsofLineError])

    //Updated DT Table
    let headCells = [
        {
            id: 'Serial No.',
            numeric: false,
            disablePadding: true,
            label: t('SNo'),
        },
        {
            id: 'Asset Name',
            numeric: false,
            disablePadding: true,
            label: t('AssetName'),
        },
        {
            id: 'Date',
            numeric: false,
            disablePadding: false,
            label: t('Date'),
        },
        (groupby === 1 &&
        {
            id: 'Start Time',
            numeric: false,
            disablePadding: false,
            label: t('Start Time'),
        }
        ),
        (groupby === 1 &&
        {
            id: 'End Time',
            numeric: false,
            disablePadding: false,
            label: t('End Time'),
        }),
        {
            id: 'Duration',
            numeric: false,
            disablePadding: false,
            label: t('Duration'),
        },

        {
            id: 'Minutes',
            numeric: false,
            disablePadding: false,
            label: t('Minutes'),
        },
        {
            id: 'Energy Loss',
            numeric: false,
            disablePadding: false,
            label: t('Energy Loss'),
            display: isShowEnergy ? 'block' : 'none'
        },
        (((groupby === 1 && isShowShift) || groupby === 3) &&
        {
            id: 'Shift',
            numeric: false,
            disablePadding: false,
            label: t('Shift'),

        }),
        (groupby === 1 &&
        {
            id: 'Reason_Type',
            numeric: false,
            disablePadding: false,
            label: t('Reason Type'),

        }
        ),
        (groupby === 1 &&
        {
            id: 'Reason',
            numeric: false,
            disablePadding: false,
            label: t('Reason'),
        }
        ),
        (groupby === 1 &&
        {
            id: 'Reason Tags',
            numeric: false,
            disablePadding: false,
            label: t('Reason Tags'),
        }
        ),
        (groupby === 1 &&
        {
            id: 'Comments',
            numeric: false,
            disablePadding: false,
            label: t('Comments'),
        }
        ),
        (groupby === 1 &&
        {
            id: 'outage_id',
            numeric: false,
            disablePadding: false,
            label: t('Outage'),
            display: "none",
            hide : true
        }
        )


    ];



    var downloadableheadcells = headCells.map(x => {
        if (x.id === 'Energy Loss') {
            return { ...x, display: 'block' }
        }
        else {
            return x
        }
    }).filter(Boolean)

    useEffect(() => {
        if (downTimeData && !downTimeLoading && !downTimeError) {
            const statusSignal = (AssetOEEConfigsofEntityData[0] && AssetOEEConfigsofEntityData[0].is_status_signal_available) ? AssetOEEConfigsofEntityData[0].is_status_signal_available : false;
            let AssetStat = partData && partData[0] ? [partData[0][0].assetStatData] : []
            let DowntimeData = statusSignal ? downTimeData : AssetStat
            let Count = downTimeData[0].Count
            // console.log(DowntimeData,"DowntimeData",statusSignal)
            if (DowntimeData.length > 0) {
                setpageCount(Count)
                let Dataopt = []
                if (Count > 0) {
                    setpageSize(1)
                    for (let i = 0; i < Number(Count); i++) {
                        Dataopt.push({ id: i + 1, name: "Dataset" + (i + 1), pageIndex: i })
                    }
                    if (pageCount === 0) {
                        setSnackMessage(t("HugeData1") + Count + t("HugeData2"));
                        setType("info");
                        setOpenSnack(true);
                    }

                }

                setDataOption(Dataopt)
                let downtimeTable = [];
                let micmax = AssetOEEConfigsofEntityData[0] ? AssetOEEConfigsofEntityData[0].mic_stop_duration : 0
                let micmin = AssetOEEConfigsofEntityData[0] ? AssetOEEConfigsofEntityData[0].min_mic_stop_duration : 0
                for (let i of DowntimeData) {
                    if (i?.raw && i?.raw?.length > 0) {
                        
                        let activeFiltered = [];
                        if (statusSignal) {
                            activeFiltered = i.raw.filter(x => x.value !== 'ACTIVE');
                        } else {
                            activeFiltered = i.raw;
                        }

                        const process = processSignalResult(activeFiltered);
                        convertTosignalOverview(showMicroStop ? process : process.filter(x => x.finalTime >= micmax));

                        downtimeTable.push(...showMicroStop ? process : process.filter(x => x.finalTime >= micmax))
                        convertTosignalTrends(showMicroStop ? process : process.filter(x => x.finalTime >= micmax), micmin, micmax);

                        setTrendsLoading(false);
                    }
                    else {
                        setTrendsData([])
                        setOverviewY([])
                    }
                }

                let Tablearr = downtimeTable.map((val) => {
                    let time = (new Date(moment(val.next).format('YYYY-MM-DDTHH:mm:ss')).getTime() - new Date(moment(val.time).format('YYYY-MM-DDTHH:mm:ss')).getTime()) / 1000
                    let minutes = (((new Date(val.next).getTime() - new Date(val.time).getTime()) / 1000) / 60).toFixed(2);
                    let reason_name = val.reason_name
                    if ((time > micmin) && (time < micmax)) {
                        reason_name = 'Micro stop'
                    }

                    let Tags
                    if (val.reason_tags) {
                        if (val.reason_tags.length > 0) {
                            Tags = val.reason_tags.map(tag => {
                                if (tag.id !== -1) {
                                    return tag.reason_tag
                                } else {
                                    return null
                                }
                            })
                        }
                    }
                    return {

                        "Asset_id": val.entity_id ? val.entity_id : '',
                        "Asset_Name": val.asset,
                        "Start": val.time,
                        "End": val.next,
                        "Duration": time,
                        "Reason_Type": val.reason_type_name,
                        "ReasonId": val.reason,
                        "Minutes": minutes,
                        "energy": val.energy ? val.energy : 0,
                        "Reason Type": val.reason_type_name,
                        "Reason": reason_name,
                        "Reason Tags": Tags ? Tags.join(",") : "",
                        "Comments": val.comments,
                        "outage_id": val.outage_id,
                        "reason_tags": val.reason_tags,
                    }
                })
                if (groupby === 1) {
                    processedrows(Tablearr, 1, isShowShift)
                } else if (groupby === 2) {
                    processedrows(Tablearr, 2, isShowShift)
                } else if (groupby === 3) {
                    processedrows(Tablearr, 3, isShowShift)
                }

            }

        }
        setProgress(false);
    }, [downTimeData, groupby, isShowShift]);

    function getTrendAndStatus(oeeConfig, pageIndex) {
        if (oeeConfig && oeeConfig.length > 0) {
            let startDate = moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DDTHH:mm:ssZ")
            let endDate = moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DDTHH:mm:ssZ")

            if (endDate) {
                let datediff = moment(endDate).diff(moment(startDate), 'days');
                if ((reportDuration === 14 || reportDuration === 15 || reportDuration === 16 || reportDuration === 9 || datediff > 1) && showMicroStop) {

                    setProgress(false)
                } else {
                    let formula = [];
                    const entityInstruments = EntityInstrumentsList.filter(x => x.entity_id === oeeConfig[0].entity_id);
                    entityInstruments.forEach(entry => {
                        if (entry.instrument && entry.instrument.instruments_metrics) {
                            const kwhMetrics = entry.instrument.instruments_metrics.filter(metric => metric.metric.name === 'kwh');
                            if (kwhMetrics.length > 0) {
                                formula.push(entry.instrument_id);
                            }
                        }
                    });
                    let PartData = partData && partData[0] ? partData[0] : []
                    if (Math.abs((customdatesval.EndDate - customdatesval.StartDate) / (1000 * 60 * 60 * 24)) <= 3) {
                        getDownTime(headPlant.schema, oeeConfig, { startDate, endDate }, showMicroStop, pageIndex, 4000, formula, PartData);
                    }
                    else {
                        if (!isShowEnergy) {
                            getDownTime(headPlant.schema, oeeConfig, { startDate, endDate }, showMicroStop, pageIndex, 4000, '', PartData);
                        }
                        else if (formula.length > 0) {
                            setbulkJsonObj({ "schema": headPlant.schema, "asset_id": oeeConfig[0].entity_id, "downfall": oeeConfig[0].is_part_count_downfall, "end_date": endDate, "mic_stop": oeeConfig[0].mic_stop_duration, "start_date": startDate, "assert_name": oeeConfig[0].instrumentByMachineStatusSignalInstrument ? oeeConfig[0].instrumentByMachineStatusSignalInstrument.name : "", "metric_name": oeeConfig[0].metricByMachineStatusSignal ? oeeConfig[0].metricByMachineStatusSignal.name : '', "active_signal": oeeConfig[0].is_status_signal_available, "instrument_id": oeeConfig[0].machine_status_signal_instrument, "energyInstrument": formula.join(',') })
                        }
                        else {
                            setBulkDownload(false)
                            setcancelText(false)
                            getDownTime(headPlant.schema, oeeConfig, { startDate, endDate }, showMicroStop, pageIndex, 4000, '', PartData);
                        }
                    }
                }
            } else {
                setProgress(false)
            }
        }
    }

    useEffect(() => {
        const startTime = new Date(customdatesval.StartDate);
        const endTime = new Date(customdatesval.EndDate);

        const durationMilliseconds = endTime - startTime;

        const durationSeconds = durationMilliseconds / 1000;
        if (durationSeconds <= 259200) {
            setBulkDownload(false)
            setcancelText(false)
        } else {
            if (isShowEnergy && downtimeAsset.length > 0) {
                setBulkDownload(true)
                setcancelText(false)
            }
        }
    }, [isShowEnergy, customdatesval, downtimeAsset])
 
   

    useEffect(() => {
        if (!productoutagelistLoading && productoutagelistdata && !productoutagelisterror) {
            if (productoutagelistdata.Data.length > 0 && dialogType !== "Edit") {
                setSnackMessage("Already Exist");
                setType("warning");
                setOpenSnack(true);
                setRefresh(!refresh)
                setdialogType(null)
                // DTRef.current.handleReasonDialogClose()
            }
            else if(productoutagelistdata.value){
                createDowntimeReason(productoutagelistdata.value)
            }

        }
    }, [productoutagelistLoading, productoutagelistdata, productoutagelisterror])

    useEffect(() => {
        if (!updatereasonswithoutIDLoading && !updatereasonswithoutIDError && updatereasonswithoutIDData) {

            if (updatereasonswithoutIDData.update_neo_skeleton_prod_outage.affected_rows > 0) {


                getAssetOEEConfigsofEntity(downtimeAsset);
                setSnackMessage(t("Reason Updated Successfully"));
                setType("success");
                setOpenSnack(true);
                // DTRef.current.handleReasonDialogClose()

            } else {
                setSnackMessage(t("Reason update has failed"));
                setType("warning");
                setOpenSnack(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatereasonswithoutIDLoading, updatereasonswithoutIDData, updatereasonswithoutIDError])
    useEffect(() => {
        if (!addreasonswithoutIDLoading && !addreasonswithoutIDError && addresonswithoutIDData) {
            let data = addresonswithoutIDData.insert_neo_skeleton_prod_outage_one
            if (data) {
                getAssetOEEConfigsofEntity(downtimeAsset);
                setSnackMessage(t('Added a new Downtime '))
                setType("success")
                setOpenSnack(true);
                // DTRef.current.handleReasonDialogClose()
            } else {
                setSnackMessage(t('Failed to add the downtime '))
                setType("error")
                setOpenSnack(true)
                // DTRef.current.handleReasonDialogClose()

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addreasonswithoutIDLoading, addreasonswithoutIDError, addresonswithoutIDData])





    const processSignalResult = (data) => {

        return data.map(x => {


            const asset = AssetListOEE.filter(y => Number(y.machine_status_signal_instrument) === Number(x.iid) && y.entity.id === downtimeAsset)
            const start = moment(x.time).subtract(moment(x.time).isDST() ? 1 : 0, 'hour');
            const end = moment(x.next).subtract(moment(x.next).isDST() ? 1 : 0, 'hour');

            const reason = x.reason ? reasonsList.filter(y => Number(x.reason === y.id)) : [];
            const total = (((new Date(x.next).getTime() - new Date(x.time).getTime()) / 1000) / 60).toFixed(2);
            // console.log(AssetListOEE,"reasonsList",reasonsList,x)
            let time = parseInt(moment.duration(moment(end).diff(moment(start))).asSeconds());
            if (x.reason) {
                x['finalTime'] = time
                x['totalMins'] = Number(total);
                x['entity_id'] = asset.length > 0 ? asset[0].entity.id : ''
                x['asset'] = asset.length > 0 ? asset[0].entity.name : '';
                x['reason_type'] = reason.length > 0 ? reason[0].prod_reason_type.id : "";
                x['reason_type_name'] = reason.length > 0 ? reason[0].prod_reason_type.reason_type : "";
                x['reason_tags'] = x.reason_tags ?
                      // eslint-disable-next-line array-callback-return

                    (Array.isArray(x.reason_tags) ?
                        x.reason_tags.map((val) => {
                            if (typeof val === 'object') {
                                if (isShowShift) {
                                    let index = ReasonTagsListData.findIndex(item => item.id === val.id)
                                    if (index >= 0) return val
                                    else return { "id": -1, "reason_tag": '' }
                                } else {
                                    let index = ReasonTagsListData.findIndex(item => item.id === val.id)
                                    if (index >= 0) return { "id": val.id, "reason_tag": ReasonTagsListData[index].reason_tag }
                                    else return { "id": -1, "reason_tag": '' }
                                }
                            } else {
                                let index = ReasonTagsListData.findIndex(item => item.id === val)
                                if (index >= 0) return { "id": val, "reason_tag": ReasonTagsListData[index].reason_tag }
                                else return { "id": -1, "reason_tag": '' }
                            }
                        })
                        : [{
                            "id": x.reason_tags.id,
                            "reason_tag": ReasonTagsListData.find(item => item.id === x.reason_tags.id)?.reason_tag || ''
                        }])
                    : [{ "id": -1, "reason_tag": '' }];


            } else {

                x['finalTime'] = time
                x['totalMins'] = Number(total);
                x['entity_id'] = asset.length > 0 ? asset[0].entity.id : ''
                x['asset'] = asset.length > 0 ? asset[0].entity.name : '';
                x['reason_name'] = reason.length > 0 ? reason[0].reason : "Others";
                x['reason_type'] = reason.length > 0 ? reason[0].prod_reason_type.id : "Others";
                x['reason_type_name'] = reason.length > 0 ? reason[0].prod_reason_type.reason_type : "Others";
                x['reason_id'] = reason.length > 0 ? reason[0].id : "Others";
                x['reason_tags'] = [{ "id": -1, "reason_tag": '' }]
                x['comments'] = ''
                x['outage_id'] = ''


            }

            return x;
        })
    }

    const convertTosignalOverview = (data) => {

        let overviewx = [];
        let timeY = [];
        let mttrData = [];

        data.length > 0 && data.map(x => {

            const reason = x.reason ? (reasonsList.length > 0 && reasonsList.filter(y => Number(x.reason === y.id))) : [];

            const reasonname = reason.length > 0 ? reason[0].reason : "Others";
            const index = overviewx.findIndex(y => y === reasonname);

            const total = x.totalMins;


            if (index >= 0) {
                let exist = timeY[index];
                let totalVal = exist + total;
                timeY[index] = Number(totalVal);
                const mttfIndex = mttrData.findIndex(val => val.reason === reasonname);
                mttrData[mttfIndex]["total"] = totalVal;
                mttrData[mttfIndex]["reason"] = reasonname;
                mttrData[mttfIndex]["count"] = parseInt(mttrData[mttfIndex].count) + parseInt(1);
                mttrData[mttfIndex]["avg"] = totalVal / mttrData[mttfIndex]["count"];

            } else {

                overviewx.push(reasonname);
                timeY.push(Number(total));
                let datas = { "total": total, "count": 1, "reason": reasonname, "avg": total / 1 }
                mttrData.push(datas)
            }

        })

        mttrData.sort((a, b) => b.total - a.total)

        const totalTime = timeY.reduce((a, b) => a + b, 0)

        const timePercent = timeY.map(x => parseFloat((x / totalTime) * 100).toFixed(2));

        timeY.sort((a, b) => b - a)
        timePercent.sort((a, b) => b - a)

        const lineObj = { type: 'line', data: timePercent, color: '#66B0FF' };
        const columnObj = { type: 'column', data: timeY, color: '#66B0FF' };
        const overviewY = [lineObj, columnObj];

        const reasons = mttrData.map(item => item.reason);
        setOverviewX(reasons);
        setOverviewY(overviewY);
        getMttfData(mttrData);
    }
    const getMttfData = (data) => {

        let totaltime = data.reduce((a, v) => a + v.avg, 0);
        let totalcount = data.reduce((a, v) => a + v.count, 0);
        let mttfAvg = totaltime ? totalcount / data.length : 0;
        setMttfAvgVal(Math.round(mttfAvg));
        let mttfX = [];
        let mttfY = [];

        data.map(function (item, i) {
            mttfX[i] = item.avg && item.avg > 0 ? Math.round(item.avg) : 0;
            mttfY[i] = item.reason;
        })

        mttfX.sort((a, b) => b - a)



        setMttfXVal(mttfX);
        setMttfYVal(mttfY);
    }
    const convertTosignalTrends = (value, min, max) => {
        let trends = [];
        value.map(x => {
            const reason = x.reason ? reasonsList.filter(y => Number(x.reason === y.id)) : [];
            const microReason = (((x.finalTime > min) && (x.finalTime < max)) ? "Micro stop" : "Others")
            const reasonname = reason.length > 0 ? reason[0].reason : microReason;

            const start = moment(x.time).utcOffset(stdOffset);

            const total = x.finalTime;
            const index = trends.findIndex(y => y.name === reasonname);
            let obj = {}
            if (index >= 0) {
                let data = [...trends[index].data];
                let timeObj = {
                    x: moment(new Date(start).getTime()).format('DD MMM'),
                    y: Number(total)
                };

                if (data.length > 0) {
                    let xindex = data.findIndex((item) => item.x === timeObj.x)
                    if (xindex == -1) {
                        data.push(timeObj)
                    } else {
                        data[xindex].y += timeObj.y
                    }

                } else {
                    data.push(timeObj);

                }
                data.sort((a, b) => a.x - b.x);
                trends[index]['data'] = data
            } else {
                let data = [];
                let timeObj = {
                    x: moment(new Date(start).getTime()).format('DD MMM'),
                    y: Number(total)
                };
                data.push(timeObj);
                obj['name'] = reasonname;
                obj['data'] = data;
                trends.push(obj)
            }
        })
        setTrendsData(trends);
    }

    const trendsRefresh = () => {
        getAssetOEEConfigsofEntity(downtimeAsset);
    }

    function ReasonCheckFnc(e) {
        getProductOutageList(startDt, endDt, downtimeAsset, e)
    }

    const createDowntimeReason = (e) => {


        if (outageID) {
            if (!e.reasonID) {
                setSnackMessage(t("Please enter mandatory fields"));
                setType("warning");
                setOpenSnack(true);
                return true;
            } else {

                getupdatereasonswithoutID(e.reasonID, outageID, e.reasonDesc, "{" + e.reasonTags.toString() + "}");
            }

        } else {

            if (!e.reasonID) {
                setSnackMessage(t("Please enter mandatory fields"));
                setType("warning");
                setOpenSnack(true);
                return true;
            } else {

                getaddreasonswithoutID({ start_dt: startDt, end_dt: endDt }, downtimeAsset, e.reasonID, e.reasonDesc, currUser.id, headPlant.id, "{" + e.reasonTags.toString() + "}")
            }
        }
        setdialogType(null)
    }



    const getShift = (startrange, endrange) => {
        const shifts = headPlant.shift.shifts;
        const day = moment(startrange).format("YYYY-MM-DD")
              // eslint-disable-next-line array-callback-return

        var shiftName = ''
        if (Object.keys(shifts).length > 0) {
            if (headPlant.shift.ShiftType === "Weekly") {
                let td = new Date(startrange).getDay() === 0 ? 6 : new Date(startrange).getDay() - 1;
                for (let j = 0; j < shifts[td].length; j++) {
                    if (j === 0) {
                        const previousShift = td === 0 ? shifts[Object.keys(shifts).length - 1] : shifts[td - 1];
                        const lastshift = j === 0 ? previousShift[previousShift.length - 1] : shifts[td][j - 1];
                        var day1 = moment(startrange).subtract(1, 'day').format("YYYY-MM-DD")
                        var starttime = new Date(moment().format(day1 + "T" + lastshift.startDate) + "Z");
                        var endtime = new Date(moment().format(day1 + "T" + lastshift.endDate) + "Z");
                        if (endtime.getTime() < starttime.getTime()) {
                            if (endtime.getDay() === new Date(day1).getDay() && endtime.getDay() === starttime.getDay()) {
                                endtime = new Date(moment(endtime).add(1, 'day'))
                            } else {
                                starttime = new Date(moment(starttime).subtract(1, 'day'))
                            }

                        }
                        if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {

                            shiftName = lastshift.name
                            return shiftName;
                        }
                    }
                    starttime = new Date(moment().format(day + "T" + shifts[td][j].startDate) + "Z");
                    endtime = new Date(moment().format(day + "T" + shifts[td][j].endDate) + "Z");
                    if (endtime.getTime() < starttime.getTime()) {
                        if (endtime.getDay() === new Date(day).getDay() && endtime.getDay() === starttime.getDay()) {
                            endtime = new Date(moment(endtime).add(1, 'day'))
                        } else {
                            starttime = new Date(moment(starttime).subtract(1, 'day'))
                        }
                    }
                    if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
                        shiftName = shifts[td][j].name
                        return shiftName;
                    }
                }


            } else {
                for (let i = 0; i < shifts.length; i++) {
                    if (i === 0) {
                        const lastshift = i === 0 ? shifts[shifts.length - 1] : shifts[i - 1];
                        day1 = moment(startrange).subtract(1, 'day').format("YYYY-MM-DD")
                        starttime = new Date(moment().format(day1 + "T" + lastshift.startDate) + "Z");
                        endtime = new Date(moment().format(day1 + "T" + lastshift.endDate) + "Z");
                        if (endtime.getTime() < starttime.getTime()) {
                            if (endtime.getDay() === new Date(day1).getDay() && endtime.getDay() === starttime.getDay()) {
                                endtime = new Date(moment(endtime).add(1, 'day'))
                            } else {
                                starttime = new Date(moment(starttime).subtract(1, 'day'))
                            }

                        }
                        if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
                            shiftName = lastshift.name
                            return shiftName;
                        }
                    }
                    starttime = new Date(moment().format(day + "T" + shifts[i].startDate) + "Z");
                    endtime = new Date(moment().format(day + "T" + shifts[i].endDate) + "Z");
                    if (endtime.getTime() < starttime.getTime()) {
                        if (endtime.getDay() === new Date(day).getDay() && endtime.getDay() === starttime.getDay()) {
                            endtime = new Date(moment(endtime).add(1, 'day'))
                        } else {
                            starttime = new Date(moment(starttime).subtract(1, 'day'))
                        }
                    }
                    if ((new Date(startrange).getTime() >= new Date(starttime).getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
                        shiftName = shifts[i].name
                        return shiftName;
                    }
                }

            }



        }

    }

    let processeddata = []
    let temptabledata = []
    let tempdownloadabledata = []
    const getAllRawData = (data) => {
        tempdownloadabledata = []
        data.map((val, index) => {
            let ReasonTags = ''
            if (val.reason_tags) {
                ReasonTags = val.reason_tags.length > 5 ? val.reason_tags.slice(0, 5).map(tag => { if (tag.id !== -1) return tag.reason_tag }).join(", ") : val.reason_tags.map(tag => { if (tag.id !== -1) return tag.reason_tag }).join(", ")
            }
            tempdownloadabledata.push(
                [index + 1,
                val["Asset_Name"],
                moment(val["Start"]).format('DD/MM/YYYY'),
                moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
                moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
                <Typography style={{ textAlign: "center", fontWeight: "400", fontSize: "0.875rem" ,width:"100px"}} value={commonReports.formattime(val.Duration, true)} />
                ,
                val.Minutes,
                val.energy,
                val["Reason Type"],
                val.Reason,
                    ReasonTags,
                val.Comments ? val.Comments : ''
                ]
            )
        })

        setdownloadabledata(tempdownloadabledata)

        temptabledata = temptabledata.concat(data.map((val, index) => {
            let ReasonTag = ''
            if (val.reason_tags) {
                      // eslint-disable-next-line array-callback-return

                ReasonTag = val.reason_tags.length > 5 ?
                    <div style={{ display: 'inline-flex' }}>
                        {val.reason_tags.slice(0, 5).map(tag => {
                            if (tag.id !== -1) return <Typography className={{ backgroundColor: "#F2F2F2", borderRadius: "20px", padding: "4px 11px 4px 11px", width: "fit-content", marginLeft: "auto", marginRight: "auto" }} align="center" value={tag.reason_tag} />

                        })}
                        <Typography className={{ backgroundColor: "#F2F2F2", borderRadius: "20px", padding: "4px 11px 4px 11px", width: "fit-content", marginLeft: "auto", marginRight: "auto" }} align="center" value={"+5 more"} />
                    </div>
                    :
                    <div style={{ display: 'inline-flex' }}>
                        {val.reason_tags.map(tag => {
                            if (tag.id !== -1) return <Typography className={{ backgroundColor: "#F2F2F2", borderRadius: "20px", padding: "4px 11px 4px 11px", width: "fit-content", marginLeft: "auto", marginRight: "auto" }} align="center" value={tag.reason_tag} />
                        })}
                    </div>
            }
            return [index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
            moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
            <Tooltip title={commonReports.formattime(val.Duration, true)} placement="bottom" arrow>
                <div>
                    <Typography style={{ fontWeight: "400", fontSize: "0.875rem",width:"100px" }} value={commonReports.formattime(val.Duration, false)} />
                </div>
            </Tooltip>,
            val.Minutes,
            val.energy,
            val["Reason_Type"],
            val.Reason,
            // ReasonTag,
            val['Reason Tags'],
            val.Comments ? val.Comments : '',
            val.outage_id,
            ]
        }))
    }

    const getAllShowShift = () => {
        temptabledata = temptabledata.concat(processeddata.map((val, index) => {
            let ReasonTag = ''
            if (val.reason_tags) {
                ReasonTag = val.reason_tags.length > 5 ? val.reason_tags.slice(0, 5).map(tag => {
                    if (tag.id !== -1)
                        return tag.reason_tag
                }).join(", ")
                    : val.reason_tags.map(tag => {

                        if (tag.id !== -1) return tag.reason_tag
                    }).join(", ")
            }
            return [index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
            moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
            <Tooltip title={commonReports.formattime(val.Duration, true)} placement="bottom" arrow>
                <div>
                    <Typography style={{ fontWeight: "400", fontSize: "0.875rem", width: "70%" }} value={commonReports.formattime(val.Duration, false)} />
                </div>
            </Tooltip>,
            val.Minutes,
            val.energy,
            getShift(val["Start"], val["End"]),
            val["Reason Type"],
            val.Reason,
                ReasonTag,
            val.Comments ? val.Comments : ''


            ]
        }))
    }

    const getDaywiseData = (daywisesplitdata) => {
        let daywisedata = []
        tempdownloadabledata = []
        daywisesplitdata.forEach((val) => {
            let presentindex = daywisedata.findIndex(d => d.Asset_Name === val.Asset_Name &&
                moment(d.Start).format("DD/MM/YYYY") === moment(val.Start).format("DD/MM/YYYY"))
            if (presentindex >= 0) {
                daywisedata[presentindex].Duration = daywisedata[presentindex].Duration +
                    val.Duration
                daywisedata[presentindex].Minutes = daywisedata[presentindex].Minutes +
                    val.Minutes
                if (val.energy) {
                    daywisedata[presentindex].energy = (daywisedata[presentindex].energy || 0) + val.energy;
                    daywisedata[presentindex].energy = Number(daywisedata[presentindex].energy.toFixed(3));
                }
            }
            else {
                daywisedata.push({
                    "Asset_Name": val.Asset_Name, "Start": val.Start,
                    "Duration": val.Duration,
                    "Minutes": val.Minutes,
                    "energy": val.energy,
                })
            }
        })

        daywisedata.forEach((val, index) => {
            tempdownloadabledata.push([
                index + 1,
                val["Asset_Name"],
                moment(val["Start"]).format('DD/MM/YYYY'),
                <Typography style={{ textAlign: "center", fontWeight: "400", fontSize: "0.875rem" ,width:"100px"}} value={commonReports.formattime(val.Duration, true)} />
                ,
                val.Minutes,
                val.energy,
            ]);
        });


        setdownloadabledata(tempdownloadabledata)

        temptabledata = temptabledata.concat(daywisedata.map((val, index) => {
            let duration = commonReports.formattime(val.Duration, false)

            return ([index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            <Tooltip title={commonReports.formattime(val.Duration, true)} placement="bottom" arrow>
                <div  > <Typography style={{ textAlign: "center", fontWeight: "400", fontSize: "0.875rem",width:"100px"}} value={duration} /></div>
            </Tooltip>,
            val.Minutes ? (val.Minutes).toFixed(2) : 0,
            val.energy,
            ])
        }))
        console.log(daywisedata, "temptabledatatemptabledata")

    }

    const getShiftwiseData = (shiftwiseSPlitdata) => {
        let shiftwisedata = []
        let tempdownloadabledata1 = []


        shiftwiseSPlitdata.map((val) => {
            let presentindex = shiftwisedata.findIndex(d => d.Asset_Name === val.Asset_Name &&
                moment(d.Start).format("DD/MM/YYYY") === moment(val.Start).format("DD/MM/YYYY") &&
                d.Shift === getShift(val.Start, val.End))

            if (presentindex >= 0) {
                shiftwisedata[presentindex].Duration = shiftwisedata[presentindex].Duration +
                    val.Duration
                shiftwisedata[presentindex].Minutes = shiftwisedata[presentindex].Minutes +
                    val.Minutes
                if (val.energy) {
                    const currentEnergyLoss = shiftwisedata[presentindex].energy || 0;
                    shiftwisedata[presentindex].energy = Number((currentEnergyLoss + val.energy).toFixed(3));
                }
            }
            else {
                shiftwisedata.push({
                    "Asset_Name": val.Asset_Name,
                    "Start": val.Start,
                    "End": val.End,
                    "Duration": val.Duration,
                    "Minutes": val.Minutes,
                    "energy": val.energy,
                    "Shift": getShift(val["Start"], val["End"])

                })
            }
        })


        setdownloadabledata(tempdownloadabledata1)

        temptabledata = temptabledata.concat(shiftwisedata.map((val, index) => {
            let duration = commonReports.formattime(val.Duration, false)
            return ([index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            <Tooltip title={commonReports.formattime(val.Duration, true)} placement="bottom" arrow>
                <div ><Typography style={{ textAlign: "center", fontWeight: "400", fontSize: "0.875rem" ,width:"100px"}} value={duration} /></div>
            </Tooltip >,
            val.Minutes ? (val.Minutes).toFixed(2) : 0,
            val.energy,
            val["Shift"]
            ])
        }))
    }

    const postshiftprocessing = (shifts, start, end) => {
        let completeshifts = []
        shifts.forEach((s, index) => {

            if (index === 0) {
                completeshifts.push(s)
            } else {
                if (new Date(s.start).getTime() === new Date(shifts[index - 1].end).getTime()) {
                    completeshifts.push(s)
                }
                else {
                    completeshifts.push({
                        "start": shifts[index - 1].end,
                        "end": s.start,
                        "name": ""
                    })
                    completeshifts.push(s)
                }
            }

        })
        let newshifts = []
        completeshifts.forEach(s => {
            if ((new Date(s.start).getDate() === new Date(s.end).getDate()) && (new Date(s.start).getMonth() === new Date(s.end).getMonth()) &&
                (new Date(s.start).getFullYear() === new Date(s.end).getFullYear())) {
                newshifts.push(s)
            }
            else {
                newshifts.push(
                    Object.assign({}, s, { "end": moment(s.start).utcOffset(stdOffset).add(1, 'day').startOf('day').format("YYYY-MM-DDTHH:mm:ss" + TZone) })
                )
                newshifts.push(
                    Object.assign({}, s, { "start": moment(s.end).utcOffset(stdOffset).startOf('day').format("YYYY-MM-DDTHH:mm:ss" + TZone) })

                )
            }
        })

        return newshifts
    }

    const processedrows = (data, grpby, isShowshift) => {

        processeddata = []
        tempdownloadabledata = []

        if (isShowshift || grpby === 3) {
            data.map(val => {

                let shifts = commonReports.getShiftBetweenDates2(
                    moment(moment(val.Start).subtract(1, 'day').startOf('day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone)),
                    moment(moment(val.End).add(1, 'day').endOf('day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone)),
                    headPlant.shift)

                let newshifts = postshiftprocessing(shifts, val.Start, val.End)

                newshifts.forEach(s => {

                    if ((new Date(val.Start).getTime() >= new Date(s.start).getTime()) && (new Date(val.End).getTime() <= new Date(s.end).getTime())) {
                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(val.Start).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(val.End).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000) / 60).toFixed(2)),
                            "energy": val.energy ? val.energy : 0,
                        }));



                    } else if ((new Date(val.Start).getTime() >= new Date(s.start).getTime()) && (new Date(val.Start).getTime() < new Date(s.end).getTime()) && (new Date(val.End).getTime() > new Date(s.end).getTime())) {

                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(val.Start).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(s.end).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(s.end).getTime() - new Date(val.Start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(s.end).getTime() - new Date(val.Start).getTime()) / 1000) / 60).toFixed(2)),
                            "energy": val.energy ? val.energy : 0,
                        }))

                    } else if ((new Date(val.Start).getTime() < new Date(s.start).getTime()) && (new Date(val.End).getTime() >= new Date(s.start).getTime()) && (new Date(val.End).getTime() < new Date(s.end).getTime())) {

                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(s.start).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(val.End).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(val.End).getTime() - new Date(s.start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(val.End).getTime() - new Date(s.start).getTime()) / 1000) / 60).toFixed(2)),
                            "energy": val.energy ? val.energy : 0,

                        }))
                    } else if ((new Date(val.Start).getTime() < new Date(s.start).getTime()) && (new Date(val.End).getTime() >= new Date(s.start).getTime()) && (new Date(val.End).getTime() > new Date(s.end).getTime())) {

                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(s.start).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(s.end).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(s.end).getTime() - new Date(s.start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(s.end).getTime() - new Date(s.start).getTime()) / 1000) / 60).toFixed(2)),
                            "energy": val.energy ? val.energy : 0,
                        }))

                    }
                });


            })
        } else {
            processeddata = []
            data.map(val => {
                processeddata.push(Object.assign({}, val, {
                    "Start": moment(val.Start).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    "End": moment(val.End).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    "Duration": (new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000,
                    "Minutes": parseFloat((((new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000) / 60).toFixed(2)),
                    "energy": val.energy ? val.energy : 0,
                }));
            })
        }
        processeddata = removeDuplicatesWithOutage(processeddata)
        console.log(processeddata,"processeddata")
        temptabledata = []

        if (processeddata.length > 0) {

            if (grpby === 1 && !isShowShift) {
                getAllRawData(processeddata)
            }
            else if (grpby === 1 && isShowShift) {
                processeddata.forEach((val, index) => {
                    console.log(val, 'val')
                    tempdownloadabledata.push(
                        [index + 1,
                        val["Asset_Name"],
                        moment(val["Start"]).format('DD/MM/YYYY'),
                        moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
                        moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
                        <Typography style={{ textAlign: "center", fontWeight: "400", fontSize: "0.875rem" ,width:"100px"}} value={commonReports.formattime(val.Duration, true)} />
                        ,
                        val.Minutes,
                        val.energy,
                        getShift(val["Start"], val["End"]),
                        val["Reason Type"],
                        val.Reason,
                        val['Reason Tags'],
                        val.Comments ? val.Comments : '',

                        ]
                    )
                })

                setdownloadabledata(tempdownloadabledata)
                getAllShowShift()
            }
            else if (grpby === 2) {
                getDaywiseData(processeddata)
            } else if (grpby === 3) {
                getShiftwiseData(processeddata)
            }
        }
        console.log(temptabledata,"tableData",processeddata)
        SetTableDataTotal(temptabledata)
        setTableData(processeddata)

    }


    function removeDuplicatesWithOutage(data) {
        const uniqueMap = new Map();
      
        for (const item of data) {
          const key = `${item.Start}|${item.End}|${item.Duration}`;
          
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          } else {
            const existing = uniqueMap.get(key);
      
            const existingOutage = existing.outage_id?.trim();
            const currentOutage = item.outage_id?.trim();
      
            // Prefer item with non-empty outage_id
            if (!existingOutage && currentOutage) {
              uniqueMap.set(key, item);
            }
          }
        }
      
        return Array.from(uniqueMap.values());
      }

    const handleDialogEdit = (id, row, value) => {
        // console.log(row,"row")
        setentityId(row.Asset_id)
        setStartDt(row.Start);
        setEndDt(row.End);
        setOutageID(row.outage_id);
        if (row.ReasonId) {
            setdialogType("Edit")
        }
        DTRef.current.handleEditDowntimeDialogOpen(row)
       
    }

    const handleDataset = (e) => {
        setpageSize(e.target.value)
        getTrendAndStatus(AssetOEEConfigsofEntityData, (Number(e.target.value) - 1))

    }
    const handlereportGroupBy = (e) => {
        setgroupby(e.target.value)
        setIsShowShift(false)
        setIsShowEnergy(false)
    }

    const handleShowShift = () => {
        setIsShowShift(!isShowShift)
    }

    const handleShowEnergy = () => {
        setIsShowEnergy(!isShowEnergy)
    }

    // console.log(ReasonTagsListData,"ReasonTagsListData")
    return (
        <div className='p-4'>
            <Toast type={snackType} message={snackMessage} toastBar={snackOpen} handleSnackClose={() => setOpenSnack(false)} ></Toast>
            {(downTimeLoading || AssetOEEConfigsofEntityLoading || partLoading) && <LoadingScreenNDL />}
            {!bulkDownload &&
                <React.Fragment>
            <Grid container >
                <Grid item xs={6} sm={6} >
                    <div>
                        <KpiCards style={{ minHeight: '410px' }} >
                            <DownTimeView
                                overviewYval={overviewYval}
                                overviewXval={overviewXval}
                                mttfXVal={mttfXVal}
                                mttfYVal={mttfYVal}
                                mttfAvgVal={mttfAvgVal}
                                pageSize={Number(pageSize - 1)}
                            />
                        </KpiCards>
                    </div>
                </Grid>
                <Grid item xs={6} sm={6} >
                    <div >
                        <KpiCards style={{ minHeight: '410px' }}>
                            <div className='h-8 flex items-center '>
                            <Typography variant="heading-01-xs" color='secondary' value={t("Daily Downtime Trends")}> 
                            {trendsLoading ? <CircularProgress style={{ float: "right", marginTop: "5px" }} disableShrink size={15} color="primary" /> : (
                                            <Button style={{ float: "right" }} onClick={trendsRefresh} icon={RefreshLight} />
                                        )}
                                    </Typography>
                            </div>

                                       

                            <Grid container spacing={2} >

                                        <Grid item xs={12} sm={12}>
                                            {
                                                trendsData.length > 0 ? (
                                                    <React.Fragment>
                                                        <Charts
                                                            height={345}
                                                            id={"trendChart"}
                                                            type={"line"}
                                                            data={trendsData}
                                                            xaxisval={trendsData}
                                                            format={'MMM ddd'}
                                                            xTooltip={'MMM ddd'}
                                                            unit={'minutes'}
                                                            minutes
                                                        />

                                                    </React.Fragment>
                                                ) : (
                                                    <React.Fragment>
                                                    <br></br>
                                                    <br></br>
                                                    <br></br>
                                                    <br></br>
                                                    <div className='flex items-center justify-center'>
                                                    <Typography  variant="heading-02-sm" value={t("No Data")} />
                                                    </div>
                                                    </React.Fragment>
                                                  
                                                )
                                            }
                                        </Grid>
                                    </Grid>

                                </KpiCards>
                            </div>
                        </Grid>
                        <Grid item xs={12} >
                    <div >
                       
                        <div  >
                            {pageCount > 0 &&
                                <div style={{ width: '200px', marginLeft: 'auto' }}>
                                    <SelectBox
                                        labelId="Dataset"
                                        placeholder={t("Dataset")}
                                        id={"select-part-signal"}
                                        auto={false}
                                        multiple={false}
                                        options={DataOption}
                                        isMArray={true}
                                        checkbox={false}
                                        value={pageSize}
                                        onChange={(e) => handleDataset(e)}
                                        keyValue="name"
                                        keyId="id"
                                    />
                                </div>}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <div style={{ float: "right", width: "10%", marginTop:"12px",marginRight:"10px" }}>
                                        <SelectBox
                                            labelId="Groupby"
                                            id={"select-report-group-by"}
                                            auto={false}
                                            multiple={false}
                                            options={reportGroupBy}
                                            placeholder={t('SelectFilterBy')}
                                            isMArray={true}
                                            checkbox={false}
                                            value={groupby}
                                            onChange={(e) => handlereportGroupBy(e)}
                                            keyValue="groupby"
                                            keyId="id"
                                        /></div>
                                        <div style={{ float: "right", width: "10%", marginTop: "12px" }}>
                                            <CustomSwitch
                                                onChange={handleShowEnergy}
                                                checked={isShowEnergy}
                                                primaryLabel="Show Energy"
                                                switch={false}
                                            />
                                        </div>
                                    {groupby === 1 &&
                                        <div style={{ float: "right", width: "10%", marginTop: "12px" }}>
                                            <CustomSwitch
                                                onChange={handleShowShift}
                                                checked={isShowShift}
                                                primaryLabel="Show Shift"
                                                switch={false}
                                            />
                                        </div>
                                    }
 
                                    <EnhancedTable
                                        headCells={headCells.filter(Boolean)}
                                        data={tableDataTotal}
                                        rawdata={tableData}
                                        search={true}
                                        download={true}
                                        actionenabled={groupby === 1 && !isShowShift ? true : false && !isShowEnergy ? true : false}
                                        handleEdit={(id, value) =>
                                            handleDialogEdit(id,value)}
                                        enableEdit={true}
                                        downloadabledata={downloadablecolumn}
                                        downloadHeadCells={downloadableheadcells}
                                        verticalMenu={true}
                                        groupBy={'downtime_report'}
                                        onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
                                        page={pageidx}
                                        tagKey={["Duration"]}
                                        rowsPerPage={rowsPerPage}
                                       
                                    />
                                </Grid>
                            </Grid>
                        </div>
                       
                    </div>
                </Grid>
                    </Grid>
                    <RejectDTModal
                        ref={DTRef}
                        getDowntimeReasons={(e) => getReasonListbyTypes(e)}
                        createDowntimeReason={(e) => ReasonCheckFnc(e)}
                        prodReasonType={!outRTYLoading && outRTYData && !outRTYError ? outRTYData.filter(val => val.id === 3 || val.id === 17) : []}
                        downtimeReasonTagList={ReasonTagsListData}
                        Reasons={outGRData}
                        downtimeAsset={downtimeAsset}
                        dialogMode={(e) => setdialogType(e)}
                    />
                </React.Fragment>
            }
            {
                (isShowEnergy && bulkDownload) && (
                    <React.Fragment>
                        {
                            cancelText &&
                            <div className='flex justify-center items-center'>
                                <Typography value={"To view the downtime report, please choose a time range of less than three days."} variant={"label-02-m"} />

                            </div>
                        }
                        {
                            !cancelText && okText && (
                                <div className='flex items-center justify-center'>
                                    <Typography value={"You can track the status of background processes in a bulk report."} variant={"label-02-m"} />
                                </div>
                            )
                        }
                        {
                            !cancelText && !okText &&
                            <React.Fragment>
                                <div className='flex justify-center items-center'>
                                    <Typography value={"If the selected time range exceeds three days, you'll need to download the data as a raw report."} variant={"label-02-m"} />

                                </div>
                                <br></br>
                                <div className='flex justify-center gap-2 items-center'>
                                    <Button
                                        type="primary"
                                        onClick={() => getGenerateRawReport(momentZone.tz.guess(),"10f85da2-9fa3-4d2b-a3e1-2707ad7a0465", currUser.id, bulkJsonObj.start_date, bulkJsonObj.end_date, headPlant.id, bulkJsonObj, true, AssetOEEConfigsofEntityData)}
                                        value={"Continue"}
                                        disabled={GenerateRawReportLoading}
                                    />
                                    <Button
                                        type="secondary"
                                        onClick={() => setcancelText(true)}
                                        value={"Cancel"}
                                    />
                                </div>
                            </React.Fragment>
                        }

                    </React.Fragment>

                )
            }
        </div>
    )
}
export default DowntimeReport;