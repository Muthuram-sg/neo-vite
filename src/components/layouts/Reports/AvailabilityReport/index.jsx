import React, { useState, useEffect } from 'react';
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import KpiCards from 'components/Core/KPICards/KpiCardsNDL';
import { useRecoilState } from "recoil";
import { themeMode, reportProgress, stdReportDuration, stdDowntimeAsset, selectedPlant, customdates, userData, snackMessage, snackType, snackToggle } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import AvailabilityOverview from './components/AvilabilityOverview';
import EnhancedTable from "components/Table/Table";
import useGetAvailability from './hooks/useGetAvailability';
import useAssetOEE from "../DowntimeReport/hooks/useAssetOEE";
import useAssetListofOEE from "../DowntimeReport/hooks/useAssetOEEofLine";
import commonReports from '../components/common';
import moment from 'moment';
import useGetEntityInstrumentsList from 'components/layouts/Tasks/hooks/useGetEntityInstrumentsList';
import useWorkExecution from 'Hooks/useGetWorkExecution.jsx';
import LoadingScreenNDL from 'LoadingScreenNDL';
import ButtonNDL from 'components/Core/ButtonNDL';
import useGenerateRawReport from 'components/layouts/Reports/hooks/useGenerateRawReport';
import momentZone from 'moment-timezone';

let AssetListOEE = [];
function AvailabilityReport(props) {
    const [curTheme] = useRecoilState(themeMode);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setProgress] = useRecoilState(reportProgress);
    const [reportDuration] = useRecoilState(stdReportDuration);
    const [downtimeAsset] = useRecoilState(stdDowntimeAsset);
    const [customdatesval,] = useRecoilState(customdates);
    const [tableDataTotal, SetTableDataTotal] = useState([]);
    const [isShowShift, setIsShowShift] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [groupby, setgroupby] = useState(1)
    const [isShowEnergy, setisShowEnergy] = useState(false)
    const [currUser] = useRecoilState(userData);
    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 

    const { t } = useTranslation();
    const [selectedcolnames, setselectedcolnames] = useState([])
    const [isShift, setisShift] = useState(false)
    const [isUtilization, setisUtilization] = useState(false)
    const [pageCount, setpageCount] = useState(0)
    const [downloadablecolumn, setdownloadabledata] = useState();

    const { availabilityLoading, availabilityData, availabilityError, getAvailability } = useGetAvailability();
    const { AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, getAssetOEEConfigsofEntity } = useAssetOEE();
    const { AssetOEEConfigsofLineLoading, AssetOEEConfigsofLineData, AssetOEEConfigsofLineError, getAssetOEEConfigsofLine } = useAssetListofOEE();
    const { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList } = useGetEntityInstrumentsList();
    const [EntityInstrumentsList, setEntityInstrumentsListData] = useState([]);
    const { GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError, getGenerateRawReport } = useGenerateRawReport();
    const { WorkExecutionLoading, WorkExecutionData, WorkExecutionError, getWorkExecutionTime } = useWorkExecution();
    const [ExecutionDetail, setExecutionDetail] = useState([])
    const [EnergyTotal, setEnergyTotal] = useState()
    const [ShowEnergy, setShowEnergy] = useState(false)
    const [bulkDownload, setbulkDownload] = useState(false)
    const [cancelText, setcancelText] = useState(false)
    const [okText, setokText] = useState(false)
    const [bulkJsonObj, setbulkJsonObj] = useState({})
    const [isEnergyInstrument, setisEnergyInstrument] = useState(false)
    const [enableHour, setenableHour] = useState(false)
    const [tableheadCells, settableheadCells] = useState([
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

        {
            id: 'Start Time',
            numeric: false,
            disablePadding: false,
            label: t('Start Time'),
        },
        {
            id: 'End Time',
            numeric: false,
            disablePadding: false,
            label: t('End Time'),
        },
        {
            id: 'Duration',
            numeric: false,
            disablePadding: false,
            label: t('Duration'),
        },
        {
            id: 'Energy',
            numeric: false,
            disablePadding: false,
            label: t('Energy'),
            display: isShowEnergy ? "block" : 'none'
        },
        {
            id: 'Product',
            numeric: false,
            disablePadding: false,
            label: t('Product'),
        },

    ])
    const [chartData, setchartData] = useState({ bar: { name: 'hourly' }, column: {} });

    useEffect(() => {
        if (!EntityInstrumentsListLoading && EntityInstrumentsListData && !EntityInstrumentsListError) {
            setEntityInstrumentsListData(EntityInstrumentsListData)
        }
    }, [EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError])
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
        settableheadCells(tableheadCells)//NOSONAR
        setselectedcolnames(tableheadCells.filter(val => !val.hide && val.display !== "none"))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableheadCells])

    useEffect(() => {
        if (isShift) {
            updateArray()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShowShift])

    useEffect(() => {
        if (isUtilization) {
            updateDayShift()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupby])

    const updateArray = () => {
        if (isShowShift) {
            // Add an object to the array
            settableheadCells(prevData => [...prevData, { id: 'shift', numeric: false, disablePadding: false, label: t('Shift') }]);
        }
        else {
            // Remove the last object from the array
            settableheadCells(prevData => prevData.slice(0, -1));

        }
    };

    const updateDayShift = () => {
        if (groupby !== 1) {
            // Add an object to the array
            if (tableheadCells.filter(x => x.id === 'Avilability').length === 0) {
                settableheadCells(prevData => [...prevData, { id: 'Avilability', numeric: false, disablePadding: false, label: t('Avilability') }]);
            }
        }

    };

    const handleShowShift = () => {
        setisShift(true)
        setIsShowShift(!isShowShift)
    }
    const tableFilterOption = [{ id: 1, groupby: "All" }, { id: 2, groupby: "Daywise" }, { id: 3, groupby: "Shiftwise" }]

    useEffect(() => {
        const startTime = new Date(customdatesval.StartDate);
        const endTime = new Date(customdatesval.EndDate);

        // Calculate the difference in milliseconds
        const durationMilliseconds = endTime - startTime;

        // Convert milliseconds to seconds
        const durationSeconds = durationMilliseconds / 1000;
        if (durationSeconds <= 259200 && isEnergyInstrument) {
            setbulkDownload(false)
            setcancelText(false)
            setokText(false)
            if (tableheadCells.length > 0) {
                settableheadCells(prevState => {
                    if (isShowEnergy) {
                        return prevState.map(obj => {
                            if (obj.id === "Energy") {
                                return { ...obj, display: "block" }
                            }
                            return obj
                        })
                    } else {
                        return prevState.map(obj => {
                            if (obj.id === "Energy") {
                                return { ...obj, display: "none" }
                            }
                            return obj
                        })
                    }
                })
            }
        } else {
            if (isShowEnergy && isEnergyInstrument) {
                setbulkDownload(true)
            } else {
                setbulkDownload(false)

            }
            if (tableheadCells.length > 0) {
                settableheadCells(prevState => {
                    if (isShowEnergy) {
                        return prevState.map(obj => {
                            if (obj.id === "Energy") {
                                return { ...obj, display: "block" }
                            }
                            return obj
                        })
                    } else {
                        return prevState.map(obj => {
                            if (obj.id === "Energy") {
                                return { ...obj, display: "none" }
                            }
                            return obj
                        })
                    }
                })
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShowEnergy, customdatesval, isEnergyInstrument, downtimeAsset])
    const handleTableFilter = (e) => {
        if (groupby !== e.target.value) {
            setgroupby(e.target.value)
            if (e.target.value !== 1) {
                if (e.target.value === 3) {
                    setisShift(false)
                    settableheadCells([{
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
                    {
                        id: 'Duration',
                        numeric: false,
                        disablePadding: false,
                        label: t('Duration'),
                    },
                    {
                        id: 'Energy',
                        numeric: false,
                        disablePadding: false,
                        label: t('Energy'),
                        display: isShowEnergy ? "block" : 'none'
                    }, {
                        id: 'Shift',
                        numeric: false,
                        disablePadding: false,
                        label: t('Shift'),
                    }

                    ])
                } else {
                    setisShift(false)
                    settableheadCells([{
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

                    {
                        id: 'Duration',
                        numeric: false,
                        disablePadding: false,
                        label: t('Duration'),
                    },
                    {
                        id: 'Energy',
                        numeric: false,
                        disablePadding: false,
                        label: t('Energy'),
                        display: isShowEnergy ? "block" : 'none'
                    },

                    ])
                }

                setisUtilization(true)
                setIsShowShift(false)
            } else {

                settableheadCells([
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

                    {
                        id: 'Start Time',
                        numeric: false,
                        disablePadding: false,
                        label: t('Start Time'),
                    },
                    {
                        id: 'End Time',
                        numeric: false,
                        disablePadding: false,
                        label: t('End Time'),
                    },
                    {
                        id: 'Duration',
                        numeric: false,
                        disablePadding: false,
                        label: t('Duration'),
                    },
                    {
                        id: 'Energy',
                        numeric: false,
                        disablePadding: false,
                        label: t('Energy'),
                        display: isShowEnergy ? "block" : 'none'
                    },
                    {
                        id: 'Product',
                        numeric: false,
                        disablePadding: false,
                        label: t('Product'),
                    },
                ])
            }
        }

    }
    const handleColChange = (e) => {
        if (e) {
            const value = e.map(x => x.id);
            // unchecked = deselected = not  
            let newCell = []
            // eslint-disable-next-line array-callback-return
            tableheadCells.forEach(p => {
                let index = value.findIndex(v => p.id === v);

                if (index >= 0) {
                    newCell.push({ ...p, display: 'block' });
                } else {
                    newCell.push({ ...p, display: 'none' });
                }

            });
            settableheadCells(newCell)
            setselectedcolnames(e);

        }
    }




    useEffect(() => {
        if (tableData.length > 0) {
            getShiftwiseData(tableData, 1)
            getDaywiseData(tableData, 1)
        }
        else {
            setchartData({ bar: { name: 'hourly' }, column: {} })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableData])

    useEffect(() => {
        setbulkDownload(false)
        setcancelText(false)
        setokText(false)
        setisShowEnergy(false)

    }, [downtimeAsset, AssetOEEConfigsofEntityData])

    useEffect(() => {
        if (headPlant.id) {
            getAssetOEEConfigsofLine(headPlant.id)
            getEntityInstrumentsList(headPlant.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        getAssetOEEConfigsofEntity(downtimeAsset);
     
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downtimeAsset, reportDuration, customdatesval]);

    useEffect(() => {
        if (!AssetOEEConfigsofLineLoading && AssetOEEConfigsofLineData && !AssetOEEConfigsofLineError) {
            AssetListOEE = [...AssetListOEE, ...AssetOEEConfigsofLineData]
        }


    }, [AssetOEEConfigsofLineLoading, AssetOEEConfigsofLineData, AssetOEEConfigsofLineError])

    useEffect(() => {
        getTrendAndStatus(AssetOEEConfigsofEntityData, 0)
        console.log(AssetOEEConfigsofEntityData, "AssetOEEConfigsofEntityData")
        if (AssetOEEConfigsofEntityData && AssetOEEConfigsofEntityData.length > 0) {
            getWorkExecutionTime(AssetOEEConfigsofEntityData, [{ start: customdatesval.StartDate, end: customdatesval.EndDate }])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AssetOEEConfigsofEntityLoading, AssetOEEConfigsofEntityData, AssetOEEConfigsofEntityError, bulkDownload]);

    useEffect(() => {
        if (!WorkExecutionLoading && WorkExecutionData && WorkExecutionData.length > 0 && !WorkExecutionError) {

            setExecutionDetail(WorkExecutionData.filter(x => x.woid !== 'all'))
        } else {
            setExecutionDetail([])
        }

    }, [WorkExecutionLoading, WorkExecutionData, WorkExecutionError])

    function getTrendAndStatus(oeeConfig, pageIndex) {
        if (oeeConfig && oeeConfig.length > 0) {
            let startDate = moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DDTHH:mm:ssZ")
            let endDate = moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DDTHH:mm:ssZ")
            let btwHrs = moment.duration(moment(endDate).diff(startDate));
            let hours = btwHrs.asHours();
            let formula = [];
            const entityInstruments = EntityInstrumentsList.filter(x => x.entity_id === oeeConfig[0].entity_id);
            entityInstruments.forEach(entry => {
                if (entry.instrument && entry.instrument.instruments_metrics && entry.instrument.instruments_metrics.length > 0 && entry.instrument.instruments_metrics.filter(b => b.metric.name === "kwh").length > 0) {
                    formula.push(entry.instrument_id);
                }

            });

            if (formula.length > 0) {
                setisEnergyInstrument(true)
            } else {
                setisEnergyInstrument(false)

            }

            if (endDate) {
                let datediff = moment(endDate).diff(moment(startDate), 'days');
                if ((datediff > 2) || hours > 72) { // Show modal message
                    setbulkJsonObj(
                        {
                            "schema": headPlant.schema,
                            "asset_id": oeeConfig[0].entity_id,
                            "downfall": oeeConfig[0].is_part_count_downfall,
                            "end_date": endDate,
                            "mic_stop": oeeConfig[0].mic_stop_duration,
                            "start_date": startDate,
                            "assert_name": oeeConfig[0].instrumentByMachineStatusSignalInstrument ? oeeConfig[0].instrumentByMachineStatusSignalInstrument.name : "",
                            "metric_name": oeeConfig[0].metricByMachineStatusSignal ? oeeConfig[0].metricByMachineStatusSignal.name : '',
                            "active_signal": oeeConfig[0].is_status_signal_available,
                            "instrument_id": oeeConfig[0].machine_status_signal_instrument,
                            "energyInstrument": formula.join(',')
                        }
                    )
                    if (!bulkDownload && !isShowEnergy) {
                        if (moment(startDate) > moment(new Date()) || moment(endDate) > moment(new Date())) {
                            setOpenSnack(true)
                            setType('warning')
                            setSnackMessage('Your selected time range includes future dates. Please select correct date range')
                            getAvailability(headPlant.schema, oeeConfig, moment().format("YYYY-MM-DDTHH:mm:ssZ"), moment().format("YYYY-MM-DDTHH:mm:ssZ"), pageIndex, 4000);


                        }
                        else
                            getAvailability(headPlant.schema, oeeConfig, startDate, endDate, pageIndex, 4000);
                    }


                } else { // Call API only if hrs difference is less than 72 hrs(i.e, 3 days)
                    if (moment(startDate) > moment(new Date()) || moment(endDate) > moment(new Date())) {
                        setOpenSnack(true)
                        setType('warning')
                        setSnackMessage('Your selected time range includes future dates. Please select correct date range')
                        getAvailability(headPlant.schema, oeeConfig, moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ"), moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ"), pageIndex, 4000);


                    }
                    else {
                        getAvailability(headPlant.schema, oeeConfig, startDate, endDate, pageIndex, 4000, formula.join(","));
                    }
                }
            }
         


        }
    }

    useEffect(() => {
        if (availabilityData && !availabilityLoading && !availabilityError) {
            if (availabilityData.length > 0) {
                setpageCount(availabilityData[0].Count)
                setShowEnergy(true)
                let Dataopt = []
                if (availabilityData[0].Count > 0) {

                    for (let i = 0; i < Number(availabilityData[0].Count); i++) {
                        Dataopt.push({ id: i + 1, name: "Dataset" + (i + 1), pageIndex: i })
                    }
                    if (pageCount === 0) {
                        setSnackMessage(t("HugeData1") + availabilityData[0].Count + t("HugeData2"));
                        setType("info");
                        setOpenSnack(true);
                    }

                }

                let downtimeTable = [];
                for (let i of availabilityData) {
                    if (i.raw && i.raw.length > 0) {
                        const statusSignal = AssetOEEConfigsofEntityData[0] ? AssetOEEConfigsofEntityData[0].is_status_signal_available : true;
                        let activeFiltered = [];
                        
                        activeFiltered = i.raw;

                        const process = processSignalResult(activeFiltered);

                        downtimeTable = process

                    }
                }
                downtimeTable.forEach(timeRange => {
                    const start_time = new Date(timeRange['time']);
                    const end_time = new Date(timeRange['next']);
                    if (ExecutionDetail.length > 0) {
                        ExecutionDetail.forEach(item => {
                            const jobStartTime = new Date(item['jobStart']);
                            const jobEndTime = new Date(item['jobEnd']);

                            // Check if job start time falls within the range
                            if (moment(start_time).isBetween(moment(jobStartTime), moment(jobEndTime))) {
                                timeRange['productname'] = item['productname'];
                            }

                            // Check if job end time falls within the range
                            if (moment(end_time).isBetween(moment(jobStartTime), moment(jobEndTime))) {
                                timeRange['productname'] = item['productname'];
                            }

                        });
                    }

                });
                let TotalEnergy = []
                let Tablearr = downtimeTable.map(val => {
                    let time = (new Date(val.next).getTime() - new Date(val.time).getTime()) / 1000
                    let minutes = (((new Date(val.next).getTime() - new Date(val.time).getTime()) / 1000) / 60).toFixed(2);
                    TotalEnergy.push(Number(val.energy))


                    return {

                        "Asset_id": val.entity_id ? val.entity_id : '',
                        "Asset_Name": val.asset,
                        "Start": val.time,
                        "End": val.next,
                        "Duration": time,
                        "Reason_Type": val.reason_type_name,
                        "ReasonId": val.reason,
                        "Minutes": minutes,
                        "Energy": val.energy ? (val.energy == 0 ? "0" : Number(val.energy).toFixed(3)) : 0,
                        "Product": val.productname ? val.productname : '-',
                        "outage_id": val.outage_id,
                    }
                })
                let NanRemoved = TotalEnergy.map(value => {
                    if (value === null || isNaN(value)) {
                        return 0;
                    }
                    return value;
                });

                setEnergyTotal(NanRemoved.reduce((accumulator, currentValue) => accumulator + currentValue, 0))

                if (groupby === 1) {
                    processedrows(Tablearr, 1, isShowShift)
                } else if (groupby === 2) {
                    processedrows(Tablearr, 2, isShowShift)
                } else if (groupby === 3) {
                    processedrows(Tablearr, 3, isShowShift)
                }

            } else {
                setShowEnergy(false)
            }

        }
        setProgress(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availabilityData, groupby, isShowShift, ExecutionDetail, isShowEnergy]);

    const processSignalResult = (data) => {
        return data.map(x => {
            const asset = AssetListOEE.filter(y => Number(y.machine_status_signal_instrument) === Number(x.iid) && y.entity.id === downtimeAsset)
            const start = moment(x.time).subtract(moment(x.time).isDST() ? 1 : 0, 'hour');
            const end = moment(x.next).subtract(moment(x.next).isDST() ? 1 : 0, 'hour');
            const total = parseInt(moment.duration(moment(end).diff(moment(start))).asMinutes());
            let time = parseInt(moment.duration(moment(end).diff(moment(start))).asSeconds());

            x['finalTime'] = time
            x['totalMins'] = total;
            x['entity_id'] = asset.length > 0 ? asset[0].entity.id : ''
            x['asset'] = asset.length > 0 ? asset[0].entity.name : '';
            x['comments'] = ''
            x['outage_id'] = ''

            return x;
        })
    }



    const getShift = (startrange, endrange) => {
        const shifts = headPlant.shift.shifts;
        const day = moment(startrange).format("YYYY-MM-DD")
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
                    if ((new Date(startrange).getTime() >= new Date(moment(starttime)).getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
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
        data.forEach((val, index) => {
            if (isShowEnergy) {
                tempdownloadabledata.push(
                    [index + 1,
                    val["Asset_Name"],
                    moment(val["Start"]).format('DD/MM/YYYY'),
                    moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
                    moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
                    commonReports.formattime(val.Duration, true),
                    val.Energy,
                    val.Product
                    ]
                )
            } else {
                tempdownloadabledata.push(
                    [index + 1,
                    val["Asset_Name"],
                    moment(val["Start"]).format('DD/MM/YYYY'),
                    moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
                    moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
                    commonReports.formattime(val.Duration, true),
                    val.Product
                    ]
                )
            }

        })

        setdownloadabledata(tempdownloadabledata)

        temptabledata = temptabledata.concat(data.map((val, index) => {

            return [index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
            moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
            
            <Typography style={{ fontWeight: "400", fontSize: "0.875rem" }} value={commonReports.formattime(val.Duration, false)} />,
           
            val.Energy, val.Product
            ]
        }))
    }

    const getAllShowShift = () => {
        temptabledata = temptabledata.concat(processeddata.map((val, index) => {

            return [index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
            moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
           
            <Typography style={{ fontWeight: "400", fontSize: "0.875rem", width: "70%" }} value={commonReports.formattime(val.Duration, false)} />,
          
            val.Energy, val.Product,
            // energy,
            getShift(val["Start"], val["End"]),

            ]
        }))
    }

    // Function to calculate the difference between two date times
    function differenceBetweenDates(date1, date2) {
        // Convert both dates to milliseconds
        let date1MS = date1.getTime();
        let date2MS = date2.getTime();

        // Calculate the difference in milliseconds
        let difference = Math.abs(date2MS - date1MS);

        // Convert the difference to seconds, minutes, hours, and days
        let seconds = Math.floor(difference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        // Return an object containing the difference in various units
        return {
            milliseconds: difference,
            seconds: seconds,
            minutes: minutes,
            hours: hours,
            days: days
        };
    }

    // Function to find the next hour of a given datetime
    function findNextHour(datetime) {
        // Create a new Date object from the input datetime
        var nextHour = new Date(datetime);

        // Set minutes and seconds to 0
        nextHour.setMinutes(0);
        nextHour.setSeconds(0);

        // Add 1 hour
        nextHour.setHours(nextHour.getHours() + 1);

        // Format the result as HH:00
        // var formattedNextHour = nextHour.getHours().toString().padStart(2, '0') + ":00";

        // Return the formatted next hour
        return nextHour;
    }
    const renderShiftName = (shiftName, date) => {
        const shifts = headPlant.shift.shifts;
        let StartEnd = shifts.filter(o => o.name === shiftName).map(x => {
            return [new Date(moment().format(date + "T" + x.startDate) + "Z"), new Date(moment().format(date + "T" + x.endDate) + "Z")]

        })
      
        return StartEnd


    }

    const getDaywiseData = (daywisesplitdata, isChart) => {
        let daywisedata = []
        tempdownloadabledata = []
        temptabledata = []
        let temp = {
            name: "daywise",
            dates: [],
            data: [],
        }
        let startDate = moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DD")
        let endDate = moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DD")

        let today = moment();
        today = today.format('YYYY-MM-DD');
        let yesterday = moment().add(-1, 'days');
        yesterday = yesterday.format('YYYY-MM-DD');

        let secondsDiff = 86400; // 24 hrs in seconds
        if (startDate === endDate) {
            if (moment(new Date(customdatesval.StartDate)).format("HH:mm") !== "00:00" || (moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") && moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"))) {
                let fromTime = moment(new Date(customdatesval.StartDate), 'HH:mm');
                let toTime = moment(new Date(customdatesval.EndDate), 'HH:mm');
                secondsDiff = toTime.diff(fromTime, 'seconds'); // calculate seconds for today upto current time
            }
        }
        daywisesplitdata.forEach((val) => {
            var presentindex = daywisedata.findIndex(d => d.Asset_Name === val.Asset_Name &&
                moment(d.Start).format("DD/MM/YYYY") === moment(val.Start).format("DD/MM/YYYY"))

            if (presentindex >= 0) {
                daywisedata[presentindex].Duration = daywisedata[presentindex].Duration + val.Duration
                daywisedata[presentindex].Energy = Number(daywisedata[presentindex].Energy) + Number(val.Energy)
             
                daywisedata[presentindex].Availability = (daywisedata[presentindex].Duration / secondsDiff) * 100

                if (startDate !== endDate && (startDate !== today || startDate !== yesterday))
                    temp.data[presentindex] = daywisedata[presentindex].Availability;
            }
            else {
                daywisedata.push({
                    "Asset_Name": val.Asset_Name,
                    "Start": val.Start,
                    "Duration": val.Duration,
                    "Minutes": val.Minutes,
                    "Availability": 0,
                    "Energy": val.Energy
                })
                if (startDate !== endDate && (startDate !== today || startDate !== yesterday)) {
                    temp.dates.push(moment(val["Start"]).format("YYYY-MM-DD"))
                    temp.data.push(0)
                }
            }
        })
        
        let fromTime = moment(new Date(customdatesval.StartDate), 'HH:mm');
        let toTime = moment(new Date(customdatesval.EndDate), 'HH:mm');
        if (startDate === endDate || moment.duration(toTime.diff(fromTime)).days() == 1) {
            let hours = [];
            if (moment(new Date(customdatesval.StartDate)).format("HH:mm") !== "00:00" || (moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") && moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"))) {
                let fromTime = moment(new Date(customdatesval.StartDate), 'HH:mm');
                let toTime = moment(new Date(customdatesval.EndDate), 'HH:mm');
                let duration = moment.duration(toTime.diff(fromTime));
                let diff = duration.hours() == 0 ? 24 : duration.hours();
                let mins = duration.minutes();
                diff = mins > 1 ? diff + 1 : diff;
                for (let i = 0; diff > i; i++) {
                    let result = moment(fromTime).add(i, 'hours').format('YYYY-MM-DD HH:mm')
                    hours.push(result)
                }
            }
            else {
                hours = Array.from({
                    length: 24
                }, (_, hour) => moment({
                    hour: hour,
                    minutes: 0
                }).format('YYYY-MM-DD HH:mm')
                );
            }
            console.log(hours)
            temp.name = "hourly";
            temp.dates = hours; // hours list
            hours.forEach((hr, i) => { // dafault 0 for all hourly data
                temp.data[i] = 0;
            })
            daywisesplitdata.reverse().forEach((val) => {

                let hourIndex = temp.dates.findIndex(d =>
                    moment(d).format("HH:00") === moment(val.Start).format("HH:00"))
                /** check if both start and end occurs in same hour */
                const start = moment(val.Start).startOf('hour');
                const end = moment(val.End).startOf('hour');
                if (start.isSame(end)) { // If true
                    let diff_secs = val.Duration;
                    let avail = (diff_secs / 3600) * 100;
                    temp.data[hourIndex] = temp.data[hourIndex] + avail;
                }
                else { // If false
                    let difference_data = differenceBetweenDates(new Date(val.Start), new Date(val.End));
                    if (difference_data.hours >= 1) {
                        let hr_start = new Date(val.Start);
                        let hr_end = findNextHour(val.Start);

                        for (let i = 0; i < difference_data.hours; i++) {
                            if (i != 0) {
                                hr_start = hr_end
                                hr_end = findNextHour(hr_start);
                            }
                            // console.log(hr_start,hr_end)
                            let hr_diff_data = differenceBetweenDates(hr_start, hr_end);
                            let hrIndex = temp.dates.findIndex(d =>
                                moment(d).format("HH:00") === moment(hr_start).format("HH:00"))
                            let diff_secs = hr_diff_data.seconds; console.log(diff_secs, hrIndex)
                            let avail = (diff_secs / 3600) * 100; console.log(avail, temp.data[hrIndex])
                            temp.data[hrIndex] = temp.data[hrIndex] + avail;
                        }

                        /** Calculate final hour value */
                        hr_start = hr_end;
                        hr_end = new Date(val.End);
                        if (differenceBetweenDates(hr_start, hr_end).hours) {
                            let iindex = temp.dates.findIndex(d =>
                                moment(d).format("HH:00") === moment(hr_start).format("HH:00"))
                            temp.data[iindex] = 100;
                            hr_start = findNextHour(hr_start);
                        }
                        let hrlastIndex = temp.dates.findIndex(d =>
                            moment(d).format("HH:00") === moment(hr_start).format("HH:00"))
                        let diff_secs = differenceBetweenDates(hr_start, hr_end).seconds;
                        let avail = (diff_secs / 3600) * 100;
                        temp.data[hrlastIndex] = temp.data[hrlastIndex] + avail;
                    }
                    else {
                        let f_start = new Date(val.Start);
                        let f_end = findNextHour(val.Start);
                        console.log(f_start, f_end)
                        let f_diff_data = differenceBetweenDates(f_start, f_end);
                        let fIndex = temp.dates.findIndex(d =>
                            moment(d).format("HH:00") === moment(f_start).format("HH:00"))
                        let diff_secs = f_diff_data.seconds;
                        let avail = (diff_secs / 3600) * 100;
                        temp.data[fIndex] = temp.data[fIndex] + avail;

                        let l_start = f_end;
                        let l_end = new Date(val.End);
                        let ldiff_secs = differenceBetweenDates(l_start, l_end).seconds;
                        let lastIndex = temp.dates.findIndex(d =>
                            moment(d).format("HH:00") === moment(l_start).format("HH:00"))
                        let lavail = (ldiff_secs / 3600) * 100;
                        temp.data[lastIndex] = temp.data[lastIndex] + lavail;
                    }
                }
            })
        }

        if (isChart) {
            let tempObj = chartData.column;
            setchartData({ bar: temp, column: tempObj })
        }

        daywisedata.forEach((val, index) => {
            if (isShowEnergy) {
                tempdownloadabledata.push([
                    index + 1,
                    val["Asset_Name"],
                    moment(val["Start"]).format('DD/MM/YYYY'),
                    commonReports.formattime(val.Duration, true),
                    val.Energy,
                    val.Availability.toFixed()
                ]);
            } else {
                tempdownloadabledata.push([
                    index + 1,
                    val["Asset_Name"],
                    moment(val["Start"]).format('DD/MM/YYYY'),
                    commonReports.formattime(val.Duration, true),
                    val.Availability.toFixed()
                ]);
            }

        });


        setdownloadabledata(tempdownloadabledata)
        temptabledata = temptabledata.concat(daywisedata.map((val, index) => {
            let duration = commonReports.formattime(val.Duration, false)

            return ([index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
            
            <Typography style={{ fontWeight: "400", fontSize: "0.875rem" }} value={duration} />,
            
            val.Energy ? Number(val.Energy).toFixed(3) : 0,
            val.Availability.toFixed() + "%"
            ])
        }))

    }

    const getShiftwiseData = (shiftwiseSPlitdata, isChart) => {
        let shiftwisedata = []
        let tempdownloadabledata1 = []
        let temp = {
            dates: [],
            shifts: []
        }
        let startDate = moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DD")
        let endDate = moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DD")
        let secondsDiff = 86400; // 24 hrs in seconds
        if (startDate === endDate) {
            if (moment(new Date(customdatesval.StartDate)).format("HH:mm") !== "00:00" || (moment(new Date(customdatesval.StartDate)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") && moment(new Date(customdatesval.EndDate)).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD"))) {
                let fromTime = moment(new Date(customdatesval.StartDate), 'HH:mm');
                let toTime = moment(new Date(customdatesval.EndDate), 'HH:mm');
                secondsDiff = toTime.diff(fromTime, 'seconds'); // calculate seconds for today upto current time
            }
        }
        console.log(shiftwiseSPlitdata, "shiftwiseSPlitdata")
        shiftwiseSPlitdata.forEach((val) => {
            var presentindex = shiftwisedata.findIndex(d => d.Asset_Name === val.Asset_Name &&
                moment(d.Start).format("DD/MM/YYYY") === moment(val.Start).format("DD/MM/YYYY") &&
                d.Shift === getShift(val.Start, val.End))
            if (presentindex >= 0) {

                shiftwisedata[presentindex].Duration = shiftwisedata[presentindex].Duration + val.Duration
                shiftwisedata[presentindex].Energy = Number(shiftwisedata[presentindex].Energy) + Number(val.Energy)
                shiftwisedata[presentindex].Availability = (shiftwisedata[presentindex].Duration / secondsDiff) * 100
            }
            else {
                shiftwisedata.push({
                    "Asset_Name": val.Asset_Name,
                    "Start": val.Start,
                    "End": val.End,
                    "Duration": val.Duration,
                    "Energy": val.Energy,
                    "Shift": getShift(val["Start"], val["End"]),
                    "Availability": 0
                })
            }
        })
        shiftwisedata.forEach((val, index) => {
            if (isShowEnergy) {
                tempdownloadabledata1.push([
                    index + 1,
                    val["Asset_Name"],
                    moment(val["Start"]).format('DD/MM/YYYY'),
                    commonReports.formattime(val.Duration, true),
                    val.Energy ? Number(val.Energy).toFixed(3) : 0,
                    val["Shift"],
                    val.Availability.toFixed()
                ]);
            } else {
                tempdownloadabledata1.push([
                    index + 1,
                    val["Asset_Name"],
                    moment(val["Start"]).format('DD/MM/YYYY'),
                    commonReports.formattime(val.Duration, true),
                    val["Shift"],
                    val.Availability.toFixed()
                ]);
            }

        });
        console.log(shiftwisedata, "shiftwisedata")
        let newshiftwisedata = [...shiftwisedata]
        // Get unique dates
        const uniqueDates = [...new Set(newshiftwisedata.map(entry => entry.Start.slice(0, 10)))];

        // Get unique shifts
        const uniqueShifts = [...new Set(headPlant.shift.shifts.map(entry => entry.name))];

        // Initialize an array to store new entries
        const newData = [];

        // Iterate over unique dates
        uniqueDates.forEach(date => {
            // Iterate over unique shifts
            uniqueShifts.forEach(shift => {
                // Check if the current date and shift combination exists in the raw data
                const entry = newshiftwisedata.find(item => item.Start.startsWith(date) && item.Shift === shift);

                // If the combination doesn't exist, create a new entry with availability as 0
                if (!entry) {
                    let dynamicShift = renderShiftName(shift, date)
                    if (dynamicShift.length > 0) {
                        newData.push(
                            {
                                Start: dynamicShift[0][0],
                                End: dynamicShift[0][1], // Assuming the start time for the date
                                Duration: 0,
                                Energy: 0,
                                Shift: shift,
                                Availability: 0
                            });
                    }

                } else {
                    // If the combination exists, push the existing entry
                    newData.push(entry);
                }
            });
        });

        console.log(newData, "newData")
        newData.forEach((val, index) => {

            //For chart
            if (val["Shift"] !== undefined) {
                let dateIndex = temp.dates.findIndex(d =>
                    moment(d).format("DD/MM/YYYY") === moment(val.Start).format("DD/MM/YYYY"))
                let shift_name = getShift(val.Start, val.End);
                if (dateIndex >= 0) { // Push shift data in existing date array based on date
                    let shiftIndex = temp.shifts.findIndex(d =>
                        d.name === shift_name)
                    if (shiftIndex >= 0) { // if Shift name already exists, update data
                       
                        temp.shifts[shiftIndex].data[dateIndex] = val.Availability.toFixed()
                    }
                    else { // Push new shift name 
                        let shiftData = [];
                        shiftData.push(val.Availability.toFixed())
                        let shiftObj = {
                            name: shift_name,
                            data: shiftData
                        }
                        temp.shifts.push(shiftObj)
                    }
                }
                else { // Create new array & Push date with shift data
                    let shiftData = [];
                    shiftData.push(Number(val.Availability).toFixed())
                    let shiftObj = {
                        name: shift_name,
                        data: shiftData
                    }
                    if (temp.dates.length > 0) { // If already dates array exists, then push data
                        temp.dates.push(moment(val.Start).format("YYYY-MM-DD"))
                        let shiftIndex2 = temp.shifts.findIndex(d =>
                            d.name === shift_name)
                        if (shiftIndex2 >= 0) { // if Shift name already exists, update data
                            temp.shifts[shiftIndex2].data.push(Number(val.Availability).toFixed())
                        }
                        else {
                            shiftObj.data.push(0);
                            temp.shifts.push(shiftObj)
                        }
                    }
                    else { // Create new data
                        temp = {
                            dates: [moment(val.Start).format("YYYY-MM-DD")],
                            shifts: [shiftObj]
                        }
                    }
                }
            }
        });
        console.log(temp)
        if (isChart) {
            let tempObj = chartData.bar;
            setchartData({ bar: tempObj, column: temp })
        }

        setdownloadabledata(tempdownloadabledata1)

        temptabledata = temptabledata.concat(shiftwisedata.map((val, index) => {
            let duration = commonReports.formattime(val.Duration, false)
            return ([index + 1, val["Asset_Name"],
            moment(val["Start"]).format('DD/MM/YYYY'),
          
            <Typography style={{ fontWeight: "400", fontSize: "0.875rem" }} value={duration} />,
           
            val.Energy ? Number(val.Energy).toFixed(3) : 0,
            val["Shift"],
            val.Availability.toFixed() + "%"
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
            data.forEach(val => {

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
                            "Minutes": parseFloat((((new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000) / 60).toFixed(2))
                        }));



                    } else if ((new Date(val.Start).getTime() >= new Date(s.start).getTime()) && (new Date(val.Start).getTime() < new Date(s.end).getTime()) && (new Date(val.End).getTime() > new Date(s.end).getTime())) {

                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(val.Start).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(s.end).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(s.end).getTime() - new Date(val.Start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(s.end).getTime() - new Date(val.Start).getTime()) / 1000) / 60).toFixed(2))
                        }))

                    } else if ((new Date(val.Start).getTime() < new Date(s.start).getTime()) && (new Date(val.End).getTime() >= new Date(s.start).getTime()) && (new Date(val.End).getTime() < new Date(s.end).getTime())) {

                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(s.start).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(val.End).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(val.End).getTime() - new Date(s.start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(val.End).getTime() - new Date(s.start).getTime()) / 1000) / 60).toFixed(2))

                        }))
                    } else if ((new Date(val.Start).getTime() < new Date(s.start).getTime()) && (new Date(val.End).getTime() >= new Date(s.start).getTime()) && (new Date(val.End).getTime() > new Date(s.end).getTime())) {

                        processeddata.push(Object.assign({}, val, {
                            "Start": moment(s.start).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "End": moment(s.end).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                            "Duration": (new Date(s.end).getTime() - new Date(s.start).getTime()) / 1000,
                            "Minutes": parseFloat((((new Date(s.end).getTime() - new Date(s.start).getTime()) / 1000) / 60).toFixed(2))
                        }))

                    }
                });


            })
        } else {
            processeddata = []
            data.forEach(val => {
                processeddata.push(Object.assign({}, val, {
                    "Start": moment(val.Start).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    "End": moment(val.End).utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone),
                    "Duration": (new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000,
                    "Minutes": parseFloat((((new Date(val.End).getTime() - new Date(val.Start).getTime()) / 1000) / 60).toFixed(2))
                }));
            })
        }

        temptabledata = []

        if (processeddata.length > 0) {


            if (grpby === 1 && !isShowShift) {
                getAllRawData(processeddata)
            }
            else if (grpby === 1 && isShowShift) {
                processeddata.forEach((val, index) => {
                    console.log(val, 'val')
                    if (isShowEnergy) {
                        tempdownloadabledata.push(
                            [index + 1,
                            val["Asset_Name"],
                            moment(val["Start"]).format('DD/MM/YYYY'),
                            moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
                            moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
                            commonReports.formattime(val.Duration, true),
                            val.Energy,
                            val.Product,
                            getShift(val["Start"], val["End"]),

                            ]
                        )
                    } else {
                        tempdownloadabledata.push(
                            [index + 1,
                            val["Asset_Name"],
                            moment(val["Start"]).format('DD/MM/YYYY'),
                            moment(val["Start"]).utcOffset(stdOffset).format('HH:mm:ss'),
                            moment(val["End"]).utcOffset(stdOffset).format('HH:mm:ss'),
                            commonReports.formattime(val.Duration, true),
                            val.Product,
                            getShift(val["Start"], val["End"]),

                            ]
                        )
                    }

                })

                setdownloadabledata(tempdownloadabledata)
                getAllShowShift()
            }
            else if (grpby === 2) {
                getDaywiseData(processeddata, 0)
            } else if (grpby === 3) {
                getShiftwiseData(processeddata, 0)
            }
        }

        SetTableDataTotal(temptabledata)
        setTableData(processeddata)

    }


    const handleShowEnergy = () => {
        setisShowEnergy(!isShowEnergy)
    }
    useEffect(() => {
        if (!availabilityLoading) {
            setenableHour(!enableHour)

        }
    }, [availabilityLoading])

    return (
        <div className='p-4'>
            {
                (availabilityLoading || WorkExecutionLoading) && <LoadingScreenNDL />
            }
            {
                !bulkDownload &&
                (
                    <React.Fragment>
                        <Grid container style={{paddingBottom:"16px"}}>
                            <Grid item xs={12} sm={12} >
                                <div>
                                    <KpiCards style={{ minHeight: '420px' }} >
                                        <AvailabilityOverview
                                            tableData={tableData}
                                            getDaywiseData={getDaywiseData}
                                            getShiftwiseData={getShiftwiseData}
                                            data={chartData}
                                            enableHour={enableHour} />

                                    </KpiCards>
                                </div>
                            </Grid>



                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <div className={"float-left  p-4 "}>
                                    <div className='flex gap-6 items-center'>
                                        <Typography value={'Availability Details'} variant='heading-01-xs'
                    color='secondary'  />
                                        {
                                            isShowEnergy &&
                                            <Typography value={`Total Energy : ${EnergyTotal ? Number(EnergyTotal).toFixed(3) : '0'} kWh`} variant="label-02-m" />

                                        }
                                    </div>
                                </div>
                                <div className={"float-right w-auto p-2 flex items-center justify-center"}>
                                    <div className="flex gap-2 items-center  justify-left">
                                        {groupby === 1 && (
                                            <div className="flex w-[16%] items-center justify-center ">
                                                <CustomSwitch
                                                    onChange={handleShowShift}
                                                    checked={isShowShift}
                                                    primaryLabel="Show Shift"
                                                    switch={false}
                                                />
                                            </div>
                                        )}
                                        {ShowEnergy && (
                                            <div className="flex w-[16%] items-center justify-center  ">
                                                <CustomSwitch
                                                    onChange={handleShowEnergy}
                                                    checked={isShowEnergy}
                                                    primaryLabel="Show Energy"
                                                    switch={false}
                                                />
                                            </div>
                                        )}
                                        <div className="w-[300px] flex justify-center">
                                            <SelectBox
                                                labelId="contract-column-task"
                                                id="filter"
                                                placeholder={t("Select column")}
                                                options={!isShowEnergy ? tableheadCells.filter(x => x.id !== 'Energy') : tableheadCells}
                                                keyValue={"label"}
                                                keyId={"id"}
                                                value={selectedcolnames}
                                                multiple={true}
                                                onChange={handleColChange}
                                                selectAll={true}
                                                selectAllText={"Select All"}
                                            />
                                        </div>
                                        <div className="w-[200px] flex justify-center">
                                            <SelectBox
                                                labelId="tablefilter"
                                                id="contract-tablefilter"
                                                auto={false}
                                                multiple={false}
                                                options={tableFilterOption}
                                                isMArray={true}
                                                checkbox={false}
                                                value={groupby}
                                                onChange={handleTableFilter}
                                                keyValue="groupby"
                                                keyId="id"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <EnhancedTable
                                    headCells={tableheadCells.filter(Boolean)}
                                    data={tableDataTotal}
                                    rawdata={tableData}
                                    search={true}
                                    download={true}
                                    downloadabledata={downloadablecolumn}
                                />

                            </Grid>
                        </Grid>
                    </React.Fragment>
                )
            }
            {
                (isShowEnergy && bulkDownload && isEnergyInstrument) && (
                    <React.Fragment>
                        {
                            cancelText &&
                            <div className='flex justify-center items-center'>
                                <Typography value={"To view the availability report, please choose a time range of less than three days."} variant={"label-02-m"} />

                            </div>
                        }
                        {
                            !cancelText && !okText &&
                            <React.Fragment>
                                <div className='flex justify-center items-center'>
                                    <Typography value={"If the selected time range exceeds three days, you'll need to download the data as a raw report."} variant={"label-02-m"} />

                                </div>
                                <br></br>
                                <div className='flex justify-center gap-2 items-center'>
                                    <ButtonNDL
                                        type="secondary"
                                        onClick={() => setcancelText(true)}
                                        value={"Cancel"}
                                    />
                                     <ButtonNDL
                                        type="primary"
                                        onClick={() => getGenerateRawReport(momentZone.tz.guess(),"a815203d-97c5-40b3-ada1-31124acf66e2", currUser.id, bulkJsonObj.start_date, bulkJsonObj.end_date, headPlant.id, bulkJsonObj, true, AssetOEEConfigsofEntityData)}
                                        value={"Continue"}
                                    />
                                </div>
                            </React.Fragment>
                        }
                        {
                            !cancelText && okText && (
                                <div className='flex items-center justify-center'>
                                    <Typography value={"You can track the status of background processes in a bulk report."} variant={"label-02-m"} />
                                </div>
                            )
                        }

                    </React.Fragment>

                )
            }

        </div>
    )


}

export default AvailabilityReport;