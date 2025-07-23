/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import useTheme from 'TailwindTheme';
import Grid from "components/Core/GridNDL";
import Card from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import moment from 'moment';
import { useRecoilState } from "recoil";
import { customdates, VirtualInstrumentsList, energytype, instrumentsList, hierarchyData } from "recoilStore/atoms";
import Cards from "./components/Cards";
import Charts from "../components/ChartJS/Chart";
import common from "../components/common";

import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";

//Hooks
import useVirtualInstrumentFormula from "../hooks/useVirtualInstrumentFormula"
import useEnergyDay from "../hooks/usegetEnergyDay"
import useEnergyShift from "../hooks/useEnergyShift"
import useAssetEnergymeter from "../hooks/useAssetEnergymeter"
import useEnergyAssetwise from '../hooks/useEnergyAssetwise'
import useTimeslot from "components/layouts/Reports/TimeSlot/hooks/useFetchTimeslotData";
import useGetAllInstrument from "../hooks/useGetAllInstrument";
import useCo2Factor from "components/layouts/NewSettings/Co2Emission/hooks/useCo2Factor";

import Overview from 'components/layouts/Reports/TimeSlot/components/Overview';

import { t } from "i18next";
import useEnergyAssetshiftwise from '../hooks/useEnergyAssetshiftwise'


function EnergyDB(props) {
    const [dataShift, setDataShift] = useState([])
    const [isEnergyAssetCardLoading, setIsEnergyAssetCardLoading] = useState(false)
    const [isEnergyNodesLoading, setIsEnergyNodesLoading] = useState(false)
    const [isPieChartLoading, setIsPieChartLoading] = useState(false)
    const [isAssetcomparisionLoading, setIsAssetcomparisionLoading] = useState(false)
    const theme = useTheme();
    const [customdatesval] = useRecoilState(customdates)
    const [dataDay, setDataDay] = useState([])
    const [nodeDataDay, setNodeDataDay] = useState([])
    const [nodeDataShift, setNodeDataShift] = useState([])
    const [shifttime, setshifttime] = useState([])
    const [daytime, setdaytime] = useState([])

    const [price, setPrice] = useState(0);
    const [startrange, setstartrange] = useState(new Date())
    const [endrange, setendrange] = useState(new Date())
    const [energyassetinstruments, setenergyassetinstruments] = useState('')
    const [energyassetmetrics, setenergyassetmetrics] = useState('')
    const [energyassetval, setenergyassetval] = useState({})
    const [energyassettypes, setenergyassettypes] = useState([])
    const [WaterWasteinstruments, setWaterWasteinstruments] = useState('')
    const [WaterWastemetrics, setWaterWastemetrics] = useState('')
    const [WaterWasteval, setWaterWasteval] = useState({})
    const [WaterWastetypes, setWaterWastetypes] = useState([])
    const [showChildren, setshowChildren] = useState(false)
    const [ChildNodeData, setChildNodeData] = useState([])
    const [PieData, setPieData] = useState({ label: [], Data: [], BGcolor: [] })
    const [OverallSwitchIndex, setOverallSwitchIndex] = useState(0);
    const [NodeSwitchIndex, setNodeSwitchIndex] = useState(0);
    const [ReDraw, setReDraw] = useState(false);
    const [AssetCompareIndex, setAssetCompareIndex] = useState(0);
    const [AssetengOption, setAssetengOption] = useState([])
    const [Assetengval, setAssetengval] = useState([])
    const [timeslotenergynodes, setTimeSlotNodes] = useState([])
    const [KPIInfo, setKPIInfo] = useState([])
    const [uniquetimeslotdata, setuniquetimeslotdata] = useState([])
    const [vInstruments] = useRecoilState(VirtualInstrumentsList);
    const [instruments] = useRecoilState(instrumentsList);
    const [Timeslotengval, setTimeslotengval] = useState('')
    const [AssetwiseDay, setAssetwiseDay] = useState([])
    const [AsssetCompare, setAsssetCompare] = useState({ label: [], Data: [] })
    const [selectedenergytype] = useRecoilState(energytype)
    const [HierarchyData] = useRecoilState(hierarchyData);
    const [energyasset, setenergyasset] = useState('')
    const [AssetwiseShiftData, setAssetwiseShiftData] = useState([])
    const [AssetLabelShiftwise, setAssetLabelShiftwise] = useState([])
    const [compareAssetShifData, setcompareAssetShifData] = useState([])
    const [nodeshiftchartdata, setnodeshiftchartdata] = useState([])
    const [allInstrumentList, setallInstrumentList] = useState([])
    const [TypeFactor, setTypeFactor] = useState('')
    const [showHierarchyChildren, setshowHierarchyChildren] = useState(false)
    const [selectedHierarchy, setselectedHierarchy] = useState([])
    const [dayDataNodeChild, setdayDataNodeChild] = useState([])
    const [onlyInstrument, setonlyInstrument] = useState(false)
    const [onlyInstrumentData, setonlyInstrumentData] = useState({ Data: [], label: [], title: '' })
    const [clickedName, setclickedName] = useState('')
    const [MixedInstrument, setMixedInstrument] = useState([])
    const [hierarchyChildLoading, sethierarchyChildLoading] = useState(false)
    const [SelectedeTime, setSelectedeTime] = useState('')
    const [waterWasteAsset, setwaterWasteAsset] = useState('')

    const { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula } = useVirtualInstrumentFormula()
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();
    const { energyshiftLoading, energyshiftData, energyshiftError, getEnergyShift } = useEnergyShift();
    const { AssetEnergymeterLoading, AssetEnergymeterData, AssetEnergymeterError, getAssetEnergymeter } = useAssetEnergymeter();
    const { EnergyAssetwiseLoading, EnergyAssetwiseData, EnergyAssetwiseError, getEnergyAssetwise } = useEnergyAssetwise();
    const { TimeslotLoading, TimeslotData, TimeslotError, getTimeslot } = useTimeslot();
    const { EnergyAssetshiftwiseLoading, EnergyAssetshiftwiseData, EnergyAssetshiftwiseError, getEnergyAssetshiftwise } = useEnergyAssetshiftwise();
    const { InstrumentListLoading, InstrumentListData, InstrumentListError, getInstrumentList } = useGetAllInstrument()
    const { Co2FactorLoading, Co2FactorData, Co2FactorError, getCo2Factor } = useCo2Factor(); 
    const COLORS = ["#104C1A", "#F47180", "#856A00", "#FFA629", "#06356A",
        "#E854E8", "#400868", "#680813", "#AD6500", "#6FAFF6",
        "#A338F0", "#704200", "#F797A2", "#82BAF8", "#630D63",
        "#FFE47A", "#F0384D", "#FFE98F", "#7A0FC7", "#FF9D14"
    ];

    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z')


    useEffect(() => {
        getInstrumentList()
    }, [])
    useEffect(() => {
        setAssetengOption([])
        setAssetengval([])
        setPieData({ label: [], Data: [], BGcolor: [] })
        setAssetwiseDay([])
        setNodeDataDay([])
        setnodeshiftchartdata([])
        setTypeFactor('')
        setDataDay([])
        setNodeDataShift([])
        setMixedInstrument([])
        setonlyInstrument(false)
        setshowHierarchyChildren(false)
        setIsAssetcomparisionLoading(true)
        setdayDataNodeChild([])
        setselectedHierarchy([])
        setIsPieChartLoading(true)
        setonlyInstrumentData({ Data: [], label: [], title: '' })
        getAssetEnergymeter(props.headPlant.id, selectedenergytype)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedenergytype])

    useEffect(() => {
        setAssetengOption([])
        setPieData({ label: [], Data: [], BGcolor: [] })
        setIsAssetcomparisionLoading(true)
        setAssetwiseDay([])
        setNodeDataDay([])
        setnodeshiftchartdata([])
        setTypeFactor('')
        setdayDataNodeChild([])
        setMixedInstrument([])
        setselectedHierarchy([])
        setonlyInstrumentData({ Data: [], label: [], title: '' })
        setIsPieChartLoading(true)
        setonlyInstrument(false)
        setshowHierarchyChildren(false)
        getAssetEnergymeter(props.headPlant.id, selectedenergytype)
        getCo2Factor(props.headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant.id, customdatesval])

    useEffect(() => {
        if (AssetEnergymeterData && !AssetEnergymeterError && !AssetEnergymeterLoading) {
            let finalrequestarray = []
            let range = common.Range(props.btGroupValue, props.headPlant, customdatesval)
            setstartrange(range[0])
            setendrange(range[1])
            let dates = common.getBetweenDates(moment(range[0]), moment(range[1]), 'day')
            let shiftdates = common.getShiftBetweenDates(moment(range[0]), moment(range[1]), props.headPlant.shift)
            const now = new Date(); 

            // Convert ISO string with timezone to Date object
            const parseDate = (isoString) => new Date(isoString);
            
            // Filter shifts based on the current time
            const validShifts = shiftdates.filter(shift => parseDate(shift.start) <= now);
            console.log(validShifts,'dates')

            
            // eslint-disable-next-line array-callback-return
            AssetEnergymeterData.forEach(v => {
                let instrumentArr = []
                let metrics = []
                let types = []
                let APIArray = []
                v.entity_instruments.filter(f => f.instrument.instrumentTypeByInstrumentType.resource && (f.instrument.instrumentTypeByInstrumentType.resource.id === selectedenergytype)).forEach(e => {
                    instrumentArr.push(e.instrument_id)
                    if (e.instrument.instruments_metrics.filter(f1 => f1.metric.name === 'kwh').length > 0) {
                        e.instrument.instruments_metrics.filter(f1 => f1.metric.name === 'kwh').map(m => {
                            metrics.push(m.metric.name)
                            types.push(m.metric.metric_type.id)
                        })
                    } else {
                        metrics.push('kwh')
                        types.push('2')
                    }
                })
                APIArray.push({ "start": range[0], "end": range[1], "type": types, "metrics": metrics, "instruments": instrumentArr.toString(), "viid": '' })
                finalrequestarray.push({ "name": v.name, "responce": APIArray, id: v.id })
            })
            getEnergyAssetwise(finalrequestarray, dates, [])
            
            getEnergyAssetshiftwise(finalrequestarray, validShifts, [])
            setAssetengval(AssetEnergymeterData.length > 0 ? [AssetEnergymeterData[0]] : [])
            setAssetengOption(AssetEnergymeterData)
        } else if (AssetEnergymeterError) {
            setIsAssetcomparisionLoading(false)
            setIsPieChartLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [AssetEnergymeterLoading, AssetEnergymeterData, AssetEnergymeterError])

    useEffect(() => {
        if (!InstrumentListLoading && InstrumentListData && !InstrumentListError) {
            setallInstrumentList(InstrumentListData)

        }
    }, [InstrumentListLoading, InstrumentListData, InstrumentListError])
    useEffect(() => {
        if (EnergyAssetwiseData && !EnergyAssetwiseError && !EnergyAssetwiseLoading) {
            let assetLabel = []
            let assetData = []
            let daywiseData = []
            let range = common.Range(props.btGroupValue, props.headPlant, customdatesval)
            let dates = common.getBetweenDates(moment(range[0]), moment(range[1]), 'day')

            // eslint-disable-next-line array-callback-return
            EnergyAssetwiseData.forEach((v, i) => {
                assetLabel.push(v.name)
                v.data.forEach(d => {
                    let readingsum = []
                    d.dayData && d.dayData.forEach(x => {
                        readingsum.push(x.reduce((total, item) => total + item.value, 0))
                        if (x.length > 0) {
                            // eslint-disable-next-line array-callback-return
                            x.map(e => {
                                let dayindex = daywiseData.findIndex(z => z.time === moment(e.time).format('ll') && z.id === v.id)

                                if (dayindex >= 0) {
                                    daywiseData[dayindex].data.push(e.value)
                                } else {
                                    daywiseData.push({ data: [e.value], time: moment(e.time).format('ll'), name: v.name, id: v.id })
                                }
                            })
                        } else {
                            dates.forEach(k => {
                                daywiseData.push({ data: [0], time: moment(k.start).format('ll'), name: v.name, id: v.id })
                            })

                        }
                    })
                    assetData.push(readingsum.reduce((total, item) => total + item, 0))
                })
            })
            setPieData({ label: assetLabel, Data: assetData, BGcolor: COLORS })
            setAssetwiseDay(daywiseData)
            setIsPieChartLoading(false)
            setIsAssetcomparisionLoading(false)
            assetcomparisiondatadayWise(daywiseData)
        } else if (EnergyAssetwiseError) {
            setIsPieChartLoading(false)
            setIsAssetcomparisionLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [EnergyAssetwiseLoading, EnergyAssetwiseData, EnergyAssetwiseError])

    const assetshiftwisedata = (data) => {
        let datasets = []
        let bgColors = {};

        try {
            let uniquenodes = [...new Set(data.map(val => val.node))]
            uniquenodes.forEach((val, i) => { if (!bgColors[val]) { bgColors[val] = COLORS[i % COLORS.length] } })
            // eslint-disable-next-line array-callback-return
            data.forEach((val) => {
                datasets.push(
                    {
                        label: val.node,
                        data: val.data,
                        backgroundColor: bgColors[val.node],
                        stack: val.name
                    },
                )
            })
        } catch (err) {
            console.log("Error at Shiftwise NodeData", err)
        }
        setAssetwiseShiftData(datasets)
    }

    useEffect(() => {
        if (EnergyAssetshiftwiseData && !EnergyAssetshiftwiseError && !EnergyAssetshiftwiseLoading) {
            let assetLabel = common.getBetweenDates(moment(startrange), moment(endrange), 'day').map(val => val.end)
            let AssetshiftwiseData = []
            // eslint-disable-next-line array-callback-return
            let instrumentWiseData = []

            EnergyAssetshiftwiseData.forEach((v, i) => {

                let shiftwiseNodeData = []
                let tempshiftwisedata = []
                // eslint-disable-next-line array-callback-return
                v.data.forEach((instrument) => {
                    let shiftwiseData = instrument.shift ? instrument.shift.shifts : {};
                    if (instrument.shiftData && instrument.shift) {
                        // eslint-disable-next-line array-callback-return
                        instrument.shiftData.forEach((data) => {
                            let formula = [];
                            let IntrumentWise = []
                            data.data.forEach((val) => {

                                formula.push(val.value)
                                IntrumentWise.push({ name: val.iid, time: moment(val.time).format('ll'), data: Number(val.value), label: v.name, shift: data.name })
                            })
                            if (instrument.shift.ShiftType === "Weekly") {
                                Object.keys(shiftwiseData).forEach((shiftData, index) => {
                                    let timer = new Date().getDay();
                                    if (timer === parseInt(shiftData)) {
                                        shiftwiseData[index].map((x) => {
                                            if (!x.data) {
                                                x.data = []
                                            }
                                            if (!x.node) {
                                                x.node = v.name
                                            }
                                            if (!x.children) {
                                                x.children = []
                                            }
                                            if (x.name === data.name) {
                                                x.data.push((formula.length > 0) ? formula.reduce((tot, item) => tot + item, 0) : 0)
                                                x.children.push(IntrumentWise)
                                                instrumentWiseData.push(IntrumentWise)
                                            }
                                        })

                                        shiftwiseNodeData.push(shiftwiseData[index])
                                    }
                                })
                            } else {
                                // eslint-disable-next-line array-callback-return
                                shiftwiseData.forEach((x) => {

                                    if (!x.data) {
                                        x.data = []
                                    }
                                    if (!x.node) {

                                        x.node = v.name
                                    }
                                    if (!x.children) {
                                        x.children = []
                                    }

                                    if (x.name === data.name) {
                                        x.data.push((formula.length > 0) ? formula.reduce((tot, item) => tot + item, 0) : 0)
                                        x.children.push(IntrumentWise)
                                        instrumentWiseData.push(IntrumentWise)

                                    }
                                })

                                shiftwiseNodeData.push(shiftwiseData)
                            }
                        })
                    }

                })
                // eslint-disable-next-line array-callback-return
                shiftwiseNodeData.flat(1).forEach((val) => {

                    let index = tempshiftwisedata.findIndex((j) => j.name === val.name && j.node === val.node)
                    if (index !== -1) {
                        tempshiftwisedata[index].data.push(val.data)
                        tempshiftwisedata[index].children = [...tempshiftwisedata[index].children, ...val.children]
                    }
                    else {
                        tempshiftwisedata.push({ "data": [].concat(val.data), "node": val.node, "name": val.name, "children": val.children })
                    }
                })

                AssetshiftwiseData.push(tempshiftwisedata)
            })

            instrumentWiseData = instrumentWiseData.flat(1).map(x=>x.time)
            // console.log(instrumentWiseData,"instrumentWiseData")
            instrumentWiseData = [...new Set(instrumentWiseData)]
            setAssetLabelShiftwise(instrumentWiseData)
            assetshiftwisedata(AssetshiftwiseData.flat(1))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [EnergyAssetshiftwiseLoading, EnergyAssetshiftwiseData, EnergyAssetshiftwiseError])

    const instrumentIdForEnergy = (instrument_id) => {
        let finalrequestarray = []
        let range = common.Range(props.btGroupValue, props.headPlant, customdatesval)
        let dates = common.getBetweenDates(moment(range[0]), moment(range[1]), 'day')
        // let shiftdates = common.getShiftBetweenDates(moment(range[0]), moment(range[1]), props.headPlant.shift)
        // console.log(instrument_id,"vvviiiiddd")
        // console.log(dates,"dates")

        instrument_id.forEach((val) => {
            if (val !== '') {
                finalrequestarray.push({ "start": range[0], "end": range[1], "type": [2], "metrics": ['kwh'], "instruments": val })
            }
        })
        // console.log(finalrequestarray,"finalrequestarray")
        getEnergyDay(finalrequestarray, dates, [])
        // getEnergyShift(finalrequestarray, shiftdates, [])

    }


    useEffect(() => {
        if (!VirtualInstrumentFormulaLoading && VirtualInstrumentFormuladata && !VirtualInstrumentFormulaerror) {
            let finalrequestarray = []
            let range = common.Range(props.btGroupValue, props.headPlant, customdatesval)
            setstartrange(range[0])
            setendrange(range[1])
            let dates = common.getBetweenDates(moment(range[0]), moment(range[1]), 'day')
            let shiftdates = common.getShiftBetweenDates(moment(range[0]), moment(range[1]), props.headPlant.shift)
            VirtualInstrumentFormuladata.forEach((val) => {
                let values = common.getVirtualInstrumentInfo(val, props.typelist)
                let instrumentValue = values[0]
                let metrics = values[1]
                let types = values[2]

                // console.log(types,"types",metrics,instrumentValue)

                if (val.id === energyasset) {
                    setenergyassetinstruments(instrumentValue)
                    setenergyassetmetrics(metrics)
                    setenergyassetval(val)
                    setenergyassettypes(types)
                }
                if (val.id === waterWasteAsset) {
                    setWaterWasteinstruments(instrumentValue)
                    setWaterWastemetrics(metrics)
                    setWaterWasteval(val)
                    setWaterWastetypes(types)

                }

                // console.log(val,energyasset,"energyassetenergyasset")
                finalrequestarray.push({ "start": range[0], "end": range[1], "type": types, "metrics": metrics, "instruments": instrumentValue, "viid": val })
            })
            if (MixedInstrument.length > 0) {
                MixedInstrument.forEach(x => {
                    finalrequestarray.push({ "start": range[0], "end": range[1], "type": [2], "metrics": ['kwh'], "instruments": x, "viid": '' })
                })

            }
            // console.log(finalrequestarray, dates, [],"finalrequestarray, dates, []")
            getEnergyDay(finalrequestarray, dates, [])
        const now = new Date(); 

// Convert ISO string with timezone to Date object
const parseDate = (isoString) => new Date(isoString);

// Filter shifts based on the current time
const validShifts = shiftdates.filter(shift => parseDate(shift.start) <= now);


            getEnergyShift(finalrequestarray, validShifts, [])

        } else if (VirtualInstrumentFormulaerror) {
            setIsEnergyAssetCardLoading(false)
            setIsEnergyNodesLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror])
    const getEnergyAssetInstrumentsHierarchy = (viids, instrument_id) => {
        // console.log('enter',viids)

        setIsEnergyAssetCardLoading(true);
        setIsEnergyNodesLoading(true)
        sethierarchyChildLoading(true)
        setMixedInstrument(instrument_id)
        getVirtualInstrumentFormula(viids)
    }
    const getEnergyAssetInstruments = async (viids, assetID) => {
        if (assetID) {
            setIsEnergyAssetCardLoading(true);
            setIsEnergyNodesLoading(true)
            getVirtualInstrumentFormula(viids)
        }
    }

    const assetcomparisiondatadayWise = (assetwiseDay) => {
        let chartarr = []
        let Datalebel = []
        // eslint-disable-next-line array-callback-return
        Assetengval.forEach(x => {
            let data = assetwiseDay.filter(f => f.id === x.id)
            Datalebel = Datalebel.concat(data.map(d => d.time))
            data.forEach(d => {
                let index = chartarr.findIndex(c => (c.id === d.id))
                if (index >= 0) {
                    chartarr[index].data.push(d.data.reduce((j, i) => j + i, 0))
                } else {
                    chartarr.push(Object.assign({}, d, { "data": [d.data.reduce((j, i) => j + i, 0)] }))
                }
            })
        })
        // eslint-disable-next-line array-callback-return
        let chartData = chartarr.map((c, i) => {
            return {
                label: c.name,
                data: c.data,
                backgroundColor: (i + 1) > COLORS.length ? generateRandomColor() : COLORS[i],
                stack: c.name
            }
        })
        let uniqDate = [...new Set(Datalebel.map(val => val))]
        setAsssetCompare({ label: uniqDate, Data: chartData })
    }

    const assetcomparisiondataShiftWise = (assetwiseDay) => {
        let dataarr = []
        assetwiseDay.forEach(x => {
            let data = Assetengval.filter(f => f.name === x.label)
            if (data.length > 0) {
                dataarr.push(x)
            }
        })
        setcompareAssetShifData(dataarr)
    }
    useEffect(() => {

        if (!TimeslotLoading && TimeslotData && !TimeslotError) {
            let KPIinfo = []
            let uniqueTimeslotdata = []
            const timeslots = props.headPlant.timeslot ? props.headPlant.timeslot.timeslots : []
            TimeslotData.forEach((asset) => {
                let uniquedata = []
                // eslint-disable-next-line array-callback-return
                asset.data.forEach((val) => {
                    const timeslotpresent = timeslots.findIndex(s => s.name === val.name)
                    if (timeslotpresent >= 0) {
                        let index = uniquedata.findIndex(p => p.day === val.day && p.name === val.name)
                        if (index >= 0) {
                            uniquedata[index].value = uniquedata[index].value + val.value
                        } else {
                            uniquedata.push(val)
                        }
                    }

                })
                uniqueTimeslotdata.push(Object.assign({}, asset, { "data": uniquedata }))
            })
            setuniquetimeslotdata(uniqueTimeslotdata)
            // eslint-disable-next-line array-callback-return
            uniqueTimeslotdata.forEach((asset) => {
                asset.data.forEach((val, ind) => {
                    let index = KPIinfo.findIndex(s => s.name === val.name)
                    if (index >= 0) {
                        KPIinfo[index].value = KPIinfo[index].value + val.value
                        KPIinfo[index].consumption.push(val.value)
                    } else {
                        KPIinfo.push({
                            "name": val.name, "value": val.value,
                            "consumption": [val.value], color: COLORS[ind]
                        })

                    }
                })

            })
            let absentslot = timeslots.filter(s => !KPIinfo.map(k => k.name).includes(s.name))
            if (absentslot && absentslot.length > 0) {
                absentslot.forEach(val => {
                    KPIinfo.push({
                        "name": val.name, "value": '-',
                        "consumption": [], color: undefined
                    })
                })

            }
            setKPIInfo(KPIinfo)
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TimeslotLoading, TimeslotData, TimeslotError])

    useEffect(() => {

        if (selectedenergytype === 1) {
            let frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss" + TZone)
            let toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss" + TZone)
            setKPIInfo([])
            // console.log(props.btGroupValue,"props.btGroupValue")
            if (Timeslotengval && (moment.duration(moment(toDate).diff(moment(frmDate))).asHours() >= 24 || props.btGroupValue === 7)) {
                getTimeslot(frmDate, toDate, [Timeslotengval])
            }
        }




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval, Timeslotengval])



    useEffect(() => {

        let timeslotnodes = vInstruments.filter(v => props.headPlant.timeslot && props.headPlant.timeslot.node && props.headPlant.timeslot.nodes.findIndex(n => n.id === v.id) >= 0).concat(instruments.filter(v => props.headPlant.timeslot && props.headPlant.timeslot.node && props.headPlant.timeslot.nodes.findIndex(n => n.id === v.id) >= 0))

        let timeslotenergyasset = vInstruments.filter(v => props.headPlant.timeslot && props.headPlant.timeslot.energy_asset && props.headPlant.timeslot.energy_asset === v.id).concat(instruments.filter(v => props.headPlant.timeslot && props.headPlant.timeslot.energy_asset && props.headPlant.timeslot.energy_asset === v.id))
        timeslotnodes.unshift(timeslotenergyasset.length > 0 ? timeslotenergyasset[0] : null)
        let jsonObject = timeslotnodes.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
        if (uniqueArray.length > 0 && timeslotenergyasset.length > 0) {
            setTimeSlotNodes(uniqueArray)
            setTimeslotengval(uniqueArray[0].id)
        }

        let viids = []
        let electric_nodeids = []
        let selecetedHierarchy = {}
        setshowChildren(false)
        setshowHierarchyChildren(false)
        if (props.headPlant.node && props.headPlant.node.nodes) {
            electric_nodeids = props.headPlant.node.nodes.filter(n => n.type === selectedenergytype)
            // console.log(electric_nodeids,"electric_nodeids")

            if (electric_nodeids.length > 0) {
                let type = electric_nodeids[0].radio
                if (type === 'hierarchy' && electric_nodeids[0].selectedHierarchy && HierarchyData.length > 0) {
                    setTypeFactor("hierarchy")
                    selecetedHierarchy = HierarchyData.find(x => x.id === electric_nodeids[0].selectedHierarchy)
                    // console.log(selecetedHierarchy,"selecetedHierarchy",HierarchyData,electric_nodeids[0].selectedHierarchy)
                    // secondLevelHierarchyDrillDown(selecetedHierarchy)
                    viids = selecetedHierarchy ? selecetedHierarchy.hierarchy[0].children.map(x => x.subnode.id) : []
                    // console.log(selecetedHierarchy,"selecetedHierarchy")
                    if (selecetedHierarchy && selecetedHierarchy.hierarchy.length > 0) {
                        viids.push(selecetedHierarchy.hierarchy[0].subnode.id)
                        setselectedHierarchy(selecetedHierarchy.hierarchy[0].children)
                        setenergyasset(selecetedHierarchy.hierarchy[0].subnode.id)
                    }

                } else {
                    // console.log('enter')
                    viids = electric_nodeids[0].nodes.map(n => n.id)
                    viids.push(electric_nodeids[0].asset)
                    setenergyasset(electric_nodeids[0].asset)

                }
                if (electric_nodeids[0].type === 2 && electric_nodeids[0].waterWaste) {
                    viids.push(electric_nodeids[0].waterWaste)
                    setwaterWasteAsset(electric_nodeids[0].waterWaste)
                }

                // viids = electric_nodeids[0].nodes.map(n => n.id)
                // viids.push(electric_nodeids[0].asset)
                // setenergyasset(electric_nodeids[0].asset)
                // console.log(electric_nodeids[0].price ? Number(electric_nodeids[0].price) : 0,"UpdatedPrice")
                setPrice(electric_nodeids[0].price ? Number(electric_nodeids[0].price) : 0)
            }

        }
        if (electric_nodeids[0] && electric_nodeids[0].radio && electric_nodeids[0].radio === "hierarchy" && selecetedHierarchy && selecetedHierarchy.hierarchy.length > 0) {
            getEnergyAssetInstruments(viids, selecetedHierarchy.hierarchy[0].subnode.id)
        } else if (props.typelist.length > 0 && electric_nodeids[0]) {
            // console.log('enter2')
            getEnergyAssetInstruments(viids, electric_nodeids[0].asset)
        }





        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant, props.typelist, customdatesval, selectedenergytype, vInstruments, instruments, HierarchyData])

 
    useEffect(() => {
        // console.log(energydayData,'energydayData')
        if (!energydayLoading && energydayData && !energydayError) {
            let daywiseData = [];
            let tempdaytime = []
            let daywiseNodeData = []
            let dayNodeTime = []
            let tempnodewisedata = []
            // console.log(energydayData,'energydayData')
            let combinedEnergy = [...energydayData]
            if (MixedInstrument.length > 0) {
                combinedEnergy = combinedEnergy.map(x => {
                    if ('vi' in x) {
                        return x
                    } else {
                        // console.log(x.dayData,"x.dayData", Array.isArray(x.dayData) )
                        let flatten = Array.isArray(x.dayData) && x.dayData.length > 0 ? x.dayData.flat(1) : []
                        // console.log(flatten,"flatten")
                        return { ...x, vi: flatten.length > 0 ? { id: flatten[0].iid, name: getNameById(flatten[0].iid), formula: `(${flatten[0].iid}.kwh)` } : {} }
                    }
                })
            }
            // console.log(combinedEnergy,'combinedEnergy')
            combinedEnergy.forEach((instrument) => {
                if (instrument.dayData) {
                    instrument.dayData.forEach((data) => {
                        let formula = instrument.vi ? instrument.vi.formula : ''
                        const regex = /(\d+)\.(\w+)/g;
                        let match;
                        const result = [];
                        
                        while ((match = regex.exec(formula)) !== null) {
                            if (isNaN(Number(match[2]))) {
                                result.push({ iid: parseInt(match[1]), key: match[2] });
                            }
                        }
                        // console.log(formula,'1',result)
                        if (data.length > 0) {
                            let IntrumentWise = []
                            addMissingIds(result, data);
                            // console.log(data,"reportdata")

                            data.forEach((val) => {
                                let metrictype = common.getmetrictype([val.key], props.typelist)
                                let total
                                if (Number(metrictype) === 2 && !val.offline){
                                    total = val.endReading - val.startReading;
                                }else{
                                    total = val.value ? val.value : 0
                                } 
                                total = total === null ? 0 : total;
                                // console.log(val.iid + "." + val.key, total,'replaceall')
                                formula = formula.replaceAll(val.iid + "." + val.key, total)
                                IntrumentWise.push({ name: val.iid, time: moment(val.time).format('ll'), data: Number(total), label: instrument.vi ? instrument.vi.name : '' })

                            })
                            // console.log(formula,"formula")
                            formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                            if (instrument.vi && instrument.vi.id === energyasset) {
                                if (!tempdaytime.includes(moment(data[0].time).format('ll'))) tempdaytime.push(moment(data[0].time).format('ll'))

                                daywiseData.push({ data: Number(isFinite(eval(formula)) && eval(formula) >= 0 ? eval(formula) : 0), time: moment(data[0].time).format('ll') })
                            }
                            else {
                                if (!dayNodeTime.includes(moment(data[0].time).format('ll'))) dayNodeTime.push(moment(data[0].time).format('ll'))
                                daywiseNodeData.push({ data: Number(isFinite(eval(formula)) && eval(formula) >= 0 ? eval(formula) : 0), time: moment(data[0].time).format('ll'), name: onlyInstrument ? "" : instrument.vi ? instrument.vi.name : '', children: IntrumentWise })

                            }
                        }
                        else {
                            if (instrument.vi && instrument.vi.id === energyasset) {
                                daywiseData.push({ data: 0, time: "" })
                            }
                            else {
                                daywiseNodeData.push({ data: 0, time: "", name: onlyInstrument ? "" : instrument.vi ? instrument.vi.name : '', children: [] })
                            }
                        }
                    })
                }

            })
            if (!showHierarchyChildren) {
                setDataDay(daywiseData)

            }

            // console.log(daywiseNodeData,"daywiseNodeData")
            daywiseNodeData.forEach((val) => {
                //    console.log(val,"selectedHierarchy")
                let index = tempnodewisedata.findIndex((a) => a.name === val.name)
                // console.log("index",index)
                if (index !== -1) {
                    // console.log("eneter",val.data)
                    tempnodewisedata[index].data.push(val.data)
                    // console.log(val.children,"val.children")
                    tempnodewisedata[index].children.push(val.children)
                
                }
                else {
                    if (TypeFactor === 'hierarchy' && !onlyInstrument && selectedHierarchy) {
                        tempnodewisedata.push({ "data": [].concat(val.data), "time": val.time, "name": val.name, "children": val.children, "selectedHierarchy": selectedHierarchy })

                    } else {
                        tempnodewisedata.push({ "data": [].concat(val.data), "time": val.time, "name": val.name, "children": val.children })

                    }
                }

            })
            // console.log(tempnodewisedata,"tempnodewisedataddaywise",onlyInstrument)


            if (showHierarchyChildren && !onlyInstrument) {
                let previusNodeValue = [...dayDataNodeChild]
                let nameChangeToHierarchy = [...tempnodewisedata]
                nameChangeToHierarchy = nameChangeToHierarchy.map((k => {
                    let NodeselectedHierarchy = [...selectedHierarchy]
                    if (MixedInstrument.length > 0) {
                        NodeselectedHierarchy = NodeselectedHierarchy.map(x => {
                            if (x.subnode) {
                                return x
                            } else {
                                return { ...x, subnode: { name: x.name } }
                            }
                        })

                    }
                    // console.log(NodeselectedHierarchy,"NodeselectedHierarchy")
                    return { ...k, name: NodeselectedHierarchy.filter(q => q.subnode.name === k.name).length > 0 && NodeselectedHierarchy.filter(q => q.subnode.name === k.name)[0].name ? NodeselectedHierarchy.filter(q => q.subnode.name === k.name)[0].name : '' }
                }))
                let filterednameChangeToHierarchy = nameChangeToHierarchy.filter(x => x.name !== '')
                // console.log(filterednameChangeToHierarchy,"nameChangeToHierarchy")

                if (!(filterednameChangeToHierarchy.map(x => x.name).includes('')) && filterednameChangeToHierarchy.length > 0) {
                    let combinedArray = [...previusNodeValue, { field: dayDataNodeChild.length + 1, data: filterednameChangeToHierarchy, name: filterednameChangeToHierarchy.map(x => x.name)[0] }]
                    //    console.log(removeDuplicatesByKey(combinedArray, 'name'),'removeDuplicatesByKe')
                    setdayDataNodeChild(removeDuplicatesByKey(combinedArray, 'name', 'field'))
                }

            } else {
                if (onlyInstrument) {
                    let DataArray = tempnodewisedata[0].children.flat(1)
                    DataArray = DataArray.filter(x => x.time === SelectedeTime)
                    // console.log(DataArray,"DataArray")
                    let instrumentObj = {
                        Data: [{
                            label: clickedName,
                            data: DataArray.map(x => x.data),
                            backgroundColor: DataArray.map(x => x).fill("#680813")
                        }],
                        label: DataArray.map(x => {
                            return getNameById(x.name) + " " + "/" + " " + x.time
                        }),
                        title: clickedName
                    }
                    // console.log(tempnodewisedata,"instrument_data",instrumentObj)
                    setonlyInstrumentData(instrumentObj)
                } else {
                    if (TypeFactor === 'hierarchy') {
                        let nameChangeToHierarchy = [...tempnodewisedata]
                        nameChangeToHierarchy = nameChangeToHierarchy.map((k => {
                            return { ...k, name: selectedHierarchy.filter(q => q.subnode.name === k.name).length > 0 && selectedHierarchy.filter(q => q.subnode.name === k.name)[0].name ? selectedHierarchy.filter(q => q.subnode.name === k.name)[0].name : '' }
                        }))
                        // console.log(nameChangeToHierarchy,"nameChangeToHierarchy")
                        setNodeDataDay(nameChangeToHierarchy)
                    } else {
                        // console.log(tempnodewisedata,"tempnodewisedata")
                        setNodeDataDay(tempnodewisedata)
                    }
                }
            }
            // console.log(tempnodewisedata,"tempnodewisedata")
            sethierarchyChildLoading(false)
            setIsEnergyAssetCardLoading(false)
            setIsEnergyNodesLoading(false);

        } else if (energydayError) {
            setIsEnergyAssetCardLoading(false)
            setIsEnergyNodesLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])

    useEffect(() => {
        assetcomparisiondatadayWise(AssetwiseDay)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Assetengval])

    useEffect(() => {

        assetcomparisiondataShiftWise(AssetwiseShiftData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Assetengval, AssetwiseShiftData])




    useEffect(() => {
        if (!energyshiftLoading && energyshiftData && !energyshiftError) {
            let tempshifttime = common.getBetweenDates(moment(startrange), moment(endrange), 'day').map(val => val.end)
            let timeShiftTimeArray = []
            
            // console.log(updatedTimestamps,"tempshifttime")

            let shiftwiseNodeData = []
            let tempshiftwisedata = []
            energyshiftData.forEach((instrument) => {
                let shiftwiseData = instrument.shift ? instrument.shift.shifts : [];
                if (instrument.shiftData && instrument.shift) {
                    instrument.shiftData.forEach((data) => {
                        let formula = instrument.vi ? instrument.vi.formula : '';
                        let IntrumentWise = []
                        data.data.forEach((val) => {
                            let metrictype = common.getmetrictype([val.key], props.typelist)
                            let total
                            if (Number(metrictype) === 2 && !val.offline){
                                total = val.endReading - val.startReading;
                            } else{
                                total = val.value
                            } 
                            total = total === null ? 0 : total;
                            formula = formula.replaceAll(val.iid + "." + val.key, total)
                            IntrumentWise.push({ name: val.iid, time: moment(val.time).format('ll'), data: Number(total), label: instrument.vi ? instrument.vi.name : '', shift: data.name })
                        })
                        
                        formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                      //  console.log(formula,"formulaformulaShif",instrument.vi.formula)
                        if (instrument.shift.ShiftType === "Weekly") {
                            Object.keys(shiftwiseData).forEach((shiftData, index) => {
                                let time = new Date().getDay();
                                if (time === parseInt(shiftData)) {
                                    shiftwiseData[index].forEach((x) => {
                                        if (!x.data) {
                                            x.data = []
                                        }
                                        if (!x.node) {
                                            x.node = instrument.vi ? instrument.vi.name : ''
                                        }
                                        if (!x.children) {
                                            x.children = []
                                        }
                                        if (x.name === data.name) {
                                            x.data.push(parseInt(isFinite(eval(formula)) && eval(formula) >= 0 ? eval(formula) : 0))
                                            x.children.push(IntrumentWise)
                                            timeShiftTimeArray.push(IntrumentWise)

                                        }
                                    })
                                    if (instrument.vi && instrument.vi.id === energyasset) {

                                        setDataShift(shiftwiseData[index])
                                    }
                                    else {
                                        shiftwiseNodeData.push(shiftwiseData[index])
                                    }
                                }
                            })
                        } else {
                            shiftwiseData.forEach((x) => {

                                if (!x.data) {
                                    x.data = []
                                }
                                if (!x.node) {

                                    x.node = instrument.vi ? instrument.vi.name : ''
                                }
                                if (!x.children) {
                                    x.children = []
                                }

                                if (x.name === data.name) {
                                    x.data.push(parseInt(isFinite(eval(formula)) && eval(formula) >= 0 ? eval(formula) : 0))
                                    x.children.push(IntrumentWise)
                                    timeShiftTimeArray.push(IntrumentWise)
                                }
                            })
                            if (instrument.vi && instrument.vi.id === energyasset) {
                               
                                setDataShift(shiftwiseData)
                            }
                            else {
                                shiftwiseNodeData.push(shiftwiseData)
                            }
                        }
                    })
                }

            })

            shiftwiseNodeData.flat(1).forEach((val) => {

                let index = tempshiftwisedata.findIndex((s) => s.name === val.name && s.node === val.node)
                if (index !== -1) {
                    tempshiftwisedata[index].data.push(val.data)
                    tempshiftwisedata[index].children = [...tempshiftwisedata[index].children, ...val.children]

                }
                else {
                    if (TypeFactor === 'hierarchy' && !onlyInstrument) {
                        tempshiftwisedata.push({ "data": [].concat(val.data), "node": val.node, "name": val.name, "children": val.children, "selectedHierarchy": selectedHierarchy })

                    } else {
                        tempshiftwisedata.push({ "data": [].concat(val.data), "node": val.node, "name": val.name, "children": val.children })

                    }
                }
            })
            // console.log(tempshiftwisedata,"tempshiftwisedata")
            if (!showHierarchyChildren && !onlyInstrument) {
                if (TypeFactor === 'hierarchy') {
                    let nameChangeToHierarchy = [...tempshiftwisedata]
                    nameChangeToHierarchy = nameChangeToHierarchy.map(p => {
                        return { ...p, node: selectedHierarchy.filter(x => x.subnode.name === p.node).length > 0 && selectedHierarchy.filter(x => x.subnode.name === p.node)[0].name ? selectedHierarchy.filter(x => x.subnode.name === p.node)[0].name : '' }
                    })

                    nodeshiftwisedata(nameChangeToHierarchy)

                } else {
                    nodeshiftwisedata(tempshiftwisedata)

                }
            }
            setNodeDataShift(tempshiftwisedata)
            // nodeshiftwisedata(tempshiftwisedata)
            // console.log(timeShiftTimeArray.flat(1),"timeShiftTimeArray")
            timeShiftTimeArray = timeShiftTimeArray.flat(1).map(x=>x.time)
            timeShiftTimeArray = [...new Set(timeShiftTimeArray)]
            setshifttime(timeShiftTimeArray)
            setdaytime(tempshifttime)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energyshiftLoading, energyshiftData, energyshiftError])
    function removeDuplicatesByKey(array, key, fields) {
        return array.filter((item, index, self) =>
            index === self.findIndex(t => (
                t[key] === item[key] && t[fields] === item[fields]
            ))
        );
    }


    function addMissingIds(idArray, dataArray) {
        const idSet = new Set(dataArray.map(item => parseInt(item.iid)));
        // console.log(idSet,keyset,"keysetkeyset")
    
        idArray.forEach(i => {
            // console.log( dataArray.findIndex(c=>c.key === i.key) >= 0,' dataArray.findIndex(c=>c.key === i.key) >= 0')
            if (!idSet.has(i.iid)) {
          
                    dataArray.push({
                        "iid": i.iid.toString(),
                        "key": i.key.toString(),
                        "time": "", // Add appropriate default time if needed
                        "value": 0,
                        "startReading": 0, // Add appropriate default reading if needed
                        "endReading": 0,   // Add appropriate default reading if needed
                        "startTime": "", // Add appropriate default start time if needed
                        "endTime": "",   // Add appropriate default end time if needed
                        "name": ""
                    });
                // }else{
                //     dataArray.push({
                //         "iid": i.iid.toString(),
                //         "key": dataArray[dataArray.length - 1].key.toString(),
                //         "time": "", // Add appropriate default time if needed
                //         "value": 0,
                //         "startReading": 0, // Add appropriate default reading if needed
                //         "endReading": 0,   // Add appropriate default reading if needed
                //         "startTime": "", // Add appropriate default start time if needed
                //         "endTime": "",   // Add appropriate default end time if needed
                //         "name": ""
                //     });
                // }
              
            }
        });
    }
    

    function getNameById(id) {

        // Find the object with the matching ID
        const foundObject = allInstrumentList.find(item => item.id === id);

        // If an object with the matching ID is found, return its name
        if (foundObject) {
            return foundObject.name;
        } else {
            // If no object with the matching ID is found, return null or any default value you prefer
            return id;
        }
    }
    function updateNames(objOrArray, type) {
        // If it's an array, iterate through its elements
        if (Array.isArray(objOrArray)) {
            return objOrArray.map(item => updateNames(item, type));
        }

        // If it's an object, update its name if needed
        if (objOrArray.name && getNameById(objOrArray.name)) {
            return { ...objOrArray, name: getNameById(objOrArray.name) };
        }

        // If it's neither an array nor an object with a 'name' property, return as is
        return objOrArray;
    }

    const nodedaywisedata = (data, type) => {
        let datasets = []
        let bgColors = [];
        for (let i = 0; i < data.length; i++) {
            bgColors.push(COLORS[i % COLORS.length]);
        }
        // console.log(data,'data1')
        data.forEach((val, index) => {
            datasets.push(
                {
                    label: val.name,
                    data: val.data ? val.data : [0],
                    children: updateNames(val.children, type),
                    backgroundColor: bgColors[index], //colors[val.name],
                    selectedHierarchy: val.selectedHierarchy ? val.selectedHierarchy : null
                },
            )
        })
        // console.log(datasets,"energyassetdatasets")
        return datasets
    }





    function ChildData(val, level) {
        if (TypeFactor === 'hierarchy') {
            setshowHierarchyChildren(true)
       
            hierarchyChildWiseData(val, level)
            // }
        } else {
            setshowChildren(true)
            // console.log(val,'childenValll')
            ChildwiseData(val)
        }


    }
    function isUUID(uuid) {
        const uuidPattern = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
        return uuidPattern.test(uuid);
    }

    function containsOnlyUUIDs(array) {
        return array.map(x => {
            return isUUID(x)
        })
    }
    const hierarchyChildWiseData = (val, level = 0) => {
        // console.log(val,"valval.Data.selectedHierarchy",val.Data.selectedHierarchy)
        if (val.Data && val.Data.selectedHierarchy) {
            setSelectedeTime(val.Label)
            let clickedNode = val.Data.selectedHierarchy
            // console.log(clickedNode,"clickedNode")
            if (clickedNode.length > 0) {
                let instrumentID = []
                let Viids = clickedNode[0].children.map(x => {
                    if (x.type === 'instrument' || x.subnodeType === 'instrument') {
                        instrumentID.push(x.subnodeType === 'instrument' ? x.subnode.id : x.id)
                        return x.subnodeType === 'instrument' ? x.subnode.id : x.id
                    } else {
                        if (x.subnode && x.subnode.id) {
                            return x.subnode.id
                        } else {
                            return ''

                        }
                    }

                })
                // console.log(instrumentID,"instrumentID",Viids)
                if (containsOnlyUUIDs(Viids).includes(true)) {
                    setonlyInstrument(false)
                    if (level === 0) {
                        setdayDataNodeChild([])
                        setMixedInstrument([])
                    } else {
                        // console.log(dayDataNodeChild,"dayDataNodeChild",level) 
                        setdayDataNodeChild(dayDataNodeChild.splice(0, level))
                    }

                    Viids = Viids.filter(x => isUUID(x))
                    // console.log(Viids,'Viids',instrumentID)
                    setselectedHierarchy(clickedNode[0].children)
                    getEnergyAssetInstrumentsHierarchy(Viids, instrumentID)
                } else {
                    if (instrumentID.length > 0 && containsOnlyUUIDs(Viids).includes(false)) {
                        setonlyInstrument(true)
                        setclickedName(clickedNode[0].name)
                        instrumentIdForEnergy(Viids)
                    } else {
                        setMixedInstrument(Viids)
                        setselectedHierarchy(clickedNode[0].children)
                        setonlyInstrument(false)
                    }
                    if (level === 0) {
                        setdayDataNodeChild([])
                        setMixedInstrument([])
                    } else {
                        // console.log(dayDataNodeChild,"dayDataNodeChild",level) 
                        setdayDataNodeChild(dayDataNodeChild.splice(0, level))
                    }



                }

            }

        }




    }

    const ChildwiseData = (val) => {
        let datasets = { Data: [], label: [], title: val.Data.label + ((val.Data.stack && NodeSwitchIndex) ? " - " + val.Data.stack : '') }

        try {
            let samArr = []
            val.Data.children.forEach(e => {
                if (Array.isArray(e)) {
                    samArr = [...samArr, ...e]
                } else {
                    samArr.push(e)
                }
            })
            let DateFil = samArr.filter(e => e.time === val.Label)
            let uniqchild = [...new Set(DateFil.map(vals => vals.name))]
            let uniqArr = []
            uniqchild.forEach(f => {
                let fil = DateFil.filter(ar => ar.name === f)
                uniqArr.push(fil[0])
            })
            let ChartData = {
                label: val.Data.label + ' - ' + val.Label,
                data: [],
                backgroundColor: [],
            }
            uniqArr.filter(e => e.time === val.Label).forEach((e) => {
                ChartData.data.push(e.data)
                datasets.label.push(e.name)
                ChartData.backgroundColor.push(val.Data.backgroundColor)
            })
            datasets.Data.push(ChartData)
        } catch (err) {
            console.log("Error at Shiftwise NodeData", err)
        }
        // console.log(datasets,"datasets")
        setChildNodeData(datasets)
    }

    function generateRandomColor() {
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal;
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);
        return `#${randColor.toUpperCase()}`
    }


    const OverAllList = [
        { id: "Daywise", value: "Day", disabled: false },
        { id: "Shiftwise", value: "Shift", disabled: false },
    ]

    function handleAssetenergy(e) {
        setAssetengval(e)
    }

    const nodeshiftwisedata = (NodeDataShift) => {
        // console.log(NodeDataShift,"NodeDataShift")
        let datasets = []
        let bgColors = {};

        try {
            let uniquenodes = [...new Set(NodeDataShift.map(val => val.node))]
            uniquenodes.forEach((val, i) => { if (!bgColors[val]) { bgColors[val] = COLORS[i % COLORS.length] } })
            // console.log(NodeDataShift,"NodeDataShift")
            NodeDataShift.forEach((val) => {
                // console.log(val.children,"al.children")
                datasets.push(
                    {
                        label: val.node,
                        data: val.data,
                        backgroundColor: bgColors[val.node],//colors[val.node],
                        children: val.children.flat(1).map(x => {
                            if (getNameById(x.name)) {
                                return { ...x, name: getNameById(x.name) }

                            } else {
                                return x
                            }
                        }),
                        stack: val.name,
                        selectedHierarchy: TypeFactor === "hierarchy" ? selectedHierarchy : null
                    },
                )
            })
        } catch (err) {
            console.log("Error at Shiftwise NodeData", err)
        }
        // console.log(datasets,"datasets")
        setnodeshiftchartdata(datasets)
        //return datasets
    }



    function handleTimeslotenergy(e) {
        setTimeslotengval(e.target.value)
    }

    const getCardName = () => {
        if (selectedenergytype === 1) {
            return "Electricity"
        } else {
            if (selectedenergytype === 2) {
                return "Water"
            } else {
                return "Gas"
            }
        }
    }


    function renderEnergyAssertLayout(val) {
        // console.log(dataShift,"dataShift",dataDay,shifttime)
        if (val && !showHierarchyChildren) {
            return (
                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
            )
        } else {
                if (OverallSwitchIndex) {
                    if(dataShift.length > 0 && shifttime.length > 0 ){
                        return (
                            <div style={{ height: "350px" }}>
        
                                <Charts
                                    charttype={"bar"}
                                    title={''}
                                    yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                                    labels={shifttime.map(val => moment(val).format('ll'))}
                                    data={nodedaywisedata(dataShift)}
                                    legend={true}
                                />
                            </div>
                        )
                    }else{
                        return(
                         <div style={{ height: "350px" }}>
                         <Typography
                             style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                             value={t("Configure Nodes in Setting screen to view the card")}>
                         </Typography>
                     </div>
                        )  
                     }
                    
                } else {
                    if(dataDay.length > 0 && daytime.length > 0){
                        return (
                            <div style={{ height: "350px" }}>
                                <Charts
                                    charttype={"line"}
                                    title={''}
                                    yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                                    labels={daytime.map(val => moment(val).format('ll'))}
                                    data={dataDay.map(x => { return x.data })}
                                    fill={true}
                                    toolTipLabel={'Daywise Consumption'}
                                    datalabels={true}
                                />
                            </div>
                        )
                    }else{
                        return(
                         <div style={{ height: "350px" }}>
                         <Typography
                             style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                             value={t("Configure Nodes in Setting screen to view the card")}>
                         </Typography>
                     </div>
                        )  
                     }
                    
                
            }
          
        }
    }

    const renderEnergyNodeLayout = () => {
        if (isEnergyNodesLoading && !showHierarchyChildren) {
            return (
                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
            )

        } else {
            if (nodeDataShift.length > 0 && nodeshiftchartdata.length > 0 && nodeDataDay.length > 0) {

                if (NodeSwitchIndex) {
                    // console.log(shifttime,"shifttime",nodeshiftchartdata,"nodeshiftchartdata",ReDraw,"ReDraw",TypeFactor,"TypeFactor")
                    return (
                        <div style={{ height: "350px" }}>
                            <Charts
                                charttype={"shiftbar"}
                                title={'Consumption - Node'}
                                yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                                labels={shifttime.map(val => moment(val).format('ll'))}
                                data={nodeshiftchartdata}
                                legend={true}
                                renderChild={(val) => ChildData(val)}
                                redraw={ReDraw}
                                noSharedTooltip={true}
                                withTotal={true}
                                nodeType={TypeFactor}
                            />
                        </div>
                    )

                } else {
                    // console.log("ReDra",nodedaywisedata(nodeDataDay),nodeDataDay)

                    return (
                        <div style={{ height: "350px" }}>
                            <Charts
                                charttype={"bar"}
                                title={'Consumption - Node'}
                                yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                                labels={daytime.map(val => moment(val).format('ll'))}
                                data={nodedaywisedata(nodeDataDay, 'day')}
                                legend={true}
                                renderChild={(val) => ChildData(val)}
                                redraw={ReDraw}
                                noSharedTooltip={true}
                                withTotal={true}
                                nodeType={TypeFactor}

                            />
                        </div>
                    )
                }
            } else {
                return (
                    <div style={{ height: "350px" }}>
                        <Typography
                            style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                            value={t("Configure Nodes in Setting screen to view the card")}>
                        </Typography>
                    </div>
                )
            }
        }

    }
    const renderChildNodeHierarchyLayout = (chartArr) => {

         if (chartArr.length > 0) {
            return chartArr.map(v => {
                return (
                    <Card key={v.field+1} elevation={0} style={{ height: "350px", padding: "8px", marginTop: 10 }}>

                        <Charts
                            charttype={"bar"}
                            title={'Hierarchy level - ' + (v.field + 1)}
                            yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                            labels={daytime.map(val => moment(val).format('ll'))}
                            data={nodedaywisedata(v.data, 'day')}
                            legend={true}
                            renderChild={(val) => ChildData(val, v.field)}
                            redraw={ReDraw}
                            nodeType={TypeFactor}

                        />
                    </Card>
                )
            })
        }


    }
    const renderChildNodeLayout = () => {
        if (ChildNodeData.Data.length) {
            return (
                <Charts
                    charttype={"Childbar"}
                    title={'Consumption - ' + ChildNodeData.title}
                    yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                    labels={ChildNodeData.label}
                    data={ChildNodeData.Data}
                    legend={true}

                />
            )

        } else {
            return (
                <div>
                    <Typography
                        style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                        value={t("Configure Nodes in Setting screen to view the card")}>
                    </Typography>
                </div>
            )

        }
    }
    const renderinstrumentlevel = () => {
        if (onlyInstrumentData && onlyInstrumentData.Data && onlyInstrumentData.Data.length > 0) {
            // console.log(ChildNodeData,"vChildNodeData")
            if (onlyInstrumentData.label.length === 0) {
                return (
                    <div>
                        <Typography
                            style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                            value={t("No data")}>
                        </Typography>
                    </div>
                )
            } else {
                return (
                    <Charts
                        charttype={"Childbar"}
                        title={'Consumption - ' + onlyInstrumentData.title}
                        yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                        labels={onlyInstrumentData.label}
                        data={onlyInstrumentData.Data}
                        legend={true}

                    />
                )
            }


        }
        else {
            return (
                <div>
                    <Typography
                        style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                        value={t("Loading...")}>
                    </Typography>
                </div>
            )

        }

    }

    const renderPieChartDataLayout = () => {
        if (isPieChartLoading) {
            return (
                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
            )
        } else {
            if (AssetengOption.length > 0 && PieData.Data.length > 0) {
                return (
                    <div style={{ height: "375px", padding: 10 }}>
                        < Charts
                            charttype={"pie"}
                            hidelegend={false}
                            title={''}
                            labels={PieData.label}
                            data={PieData.Data}
                            colors={PieData.BGcolor}
                        />
                    </div>
                )
            } else {
                return (
                    <div>
                        <Typography
                            style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                            value={t("No Asset with selected energy type found")}>
                        </Typography>
                    </div>
                )


            }

        }
    }

    const renderTimeSlotEnergyNode = () => {
        if (timeslotenergynodes.length > 0) {
            if ((moment.duration(moment(customdatesval.EndDate).diff(moment(customdatesval.StartDate))).asHours() >= 24) || (props.btGroupValue === 7)) {
                return (
                    <div style={{ height: "400px" }}>
                        <Overview data={uniquetimeslotdata} slots={KPIInfo} datalabels={true}/>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Typography
                            style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                            value={t("Please select a minimum range of 24 hours to view the graph")}>
                        </Typography>
                    </div>
                )
            }

        } else {
            return (
                <div>
                    <Typography
                        style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                        value={t("Please configure nodes in TimeSlot Settings")}>
                    </Typography>
                </div>
            )

        }
    }

    const renderAssertCampareLayout = () => {
        if (isAssetcomparisionLoading) {
            return (
                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
            )
        } else {
            if (AssetengOption.length > 0 && compareAssetShifData.length > 0 && AsssetCompare.Data.length > 0 ) {
                if (!AssetCompareIndex) {
                    return (
                        <div style={{ height: "350px" }}>
                            <Charts
                                charttype={"bar"}
                                title={''}
                                yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                                labels={AsssetCompare.label}
                                data={AsssetCompare.Data ? AsssetCompare.Data : []}
                            />
                        </div>
                    )
                } else {
                    return (
                        <div style={{ height: "350px" }}>
                            <Charts
                                charttype={"shiftbar"}
                                title={''}
                                yAxisTitle={`Consumption ${selectedenergytype === 2 ? "kL"  : selectedenergytype === 1 ?  "kwh" : 'kg'}`}
                                labels={AssetLabelShiftwise.length > 0 ? AssetLabelShiftwise.map(val => moment(val).format('ll')) : []}
                                data={compareAssetShifData}
                                legend={true}
                                redraw={ReDraw}

                            />
                        </div>
                    )
                }

            } else {
                return (
                    <div style={{ height: "350px" }}>
                        <Typography
                            style={{ color: theme.colorPalette.primary, textAlign: "center" }}
                            value={t("No Asset with selected energy type found")}>
                        </Typography>
                    </div>
                )
            }
        }
    }
    const GridSize = selectedenergytype === 1 ? 12 : 9

    return (

        <div className="p-4">
            {energyasset !== null ?
                <div style={{ display: "block" }}>
                    <Cards
                        dataDay={dataDay}
                        price={price}
                        energyassettypes={energyassettypes}
                        energyassetinstruments={energyassetinstruments}
                        energyassetmetrics={energyassetmetrics}
                        energyassetval={energyassetval}
                        waterWastetypes={WaterWastetypes}
                        waterWasteinstruments={WaterWasteinstruments}
                        waterWastemetrics={WaterWastemetrics}
                        WaterWasteval={WaterWasteval}
                        headPlant={props.headPlant}
                        duration={moment.duration(moment(endrange).diff(moment(startrange))).asSeconds()}
                        btGroupValue={props.btGroupValue}
                        customdatesval={customdatesval}
                        Co2Factor={!Co2FactorLoading && Co2FactorData && !Co2FactorError ? Co2FactorData : []}
                        
                    />
                    <div style={{ display: "block", }}>
                     <div className="mt-4">
                     <Card elevation={0} style={{ height: "450px", marginBottom: 8, padding: "8px" }}  >
                            <div className="flex p-2 items-center justify-between" >
                                <Typography variant="heading-01-xs" color='secondary'
                                    value={t("Overall " + getCardName() + " Consumption")} />
                                <ContentSwitcherNDL listArray={OverAllList} contentSwitcherClick={(e) => setOverallSwitchIndex(e)} switchIndex={OverallSwitchIndex} ></ContentSwitcherNDL>
                            </div>
                            {renderEnergyAssertLayout(isEnergyAssetCardLoading)}
                        </Card>
                     </div>
                     <div className="mt-4">
                     <Card elevation={0} style={{ height: "450px", padding: "8px" }}>
                            <div className="flex p-2 items-center justify-between" >
                                <Typography variant="heading-01-xs" color='secondary'
                                    value={t(getCardName() + " Consumption - Node")} />
                                <ContentSwitcherNDL listArray={OverAllList} contentSwitcherClick={(e) => { setNodeSwitchIndex(e); setReDraw(true); setTimeout(() => { setReDraw(false) }, 500) }} switchIndex={NodeSwitchIndex} ></ContentSwitcherNDL>
                            </div>

                            {renderEnergyNodeLayout()}

                        </Card>
                     </div>

                     
                        {showChildren &&
                            <Card elevation={0} style={{ height: "350px", padding: "16px", marginTop: 16 }}>
                                {renderChildNodeLayout()}
                            </Card>
                        }
                        {
                            showHierarchyChildren &&
                            renderChildNodeHierarchyLayout(dayDataNodeChild)
                        }
                        {
                            hierarchyChildLoading &&
                            <Card elevation={0} style={{ height: "350px", padding: "8px", marginTop: 16 }}>
                                <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                            </Card>
                        }
                        {
                            onlyInstrument &&
                            <Card elevation={0} style={{ height: "350px", padding: "8px", marginTop: 16 }}>
                                {renderinstrumentlevel()}
                            </Card>
                        }

                    </div>

                    <Grid container spacing={4} style={{marginTop:'16px'}}>
                        {selectedenergytype !== 2 &&
                            <Grid item xs={3} >
                                <Card elevation={0} style={{ height: "450px", padding: "8px" }}>
                                    <div className="flex p-2 items-center justify-between" >
                                        <Typography variant="heading-01-xs" color='secondary'
                                            value={t("Asset Energy Distribution")} />
                                    </div>
                                    {renderPieChartDataLayout()}
                                </Card>
                            </Grid>
                        }
                        {selectedenergytype === 1 &&
                            <Grid item xs={9} >
                                <Card elevation={0} style={{ height: "450px", padding: "16px" }}>
                                    <div className="flex items-center justify-between" >
                                        <Typography variant="heading-01-xs" color='secondary'
                                            value={t("Timeslot Energy Comparison")} />

                                        <div style={{ width: '200px' }}>
                                            <SelectBox
                                                id="timeslot-asset-List"
                                                placeholder={t('SelectAsset')}
                                                auto={true}
                                                options={timeslotenergynodes}
                                                isMArray={true}
                                                keyValue={"name"}
                                                keyId={"id"}
                                                multiple={false}
                                                onChange={(option) => handleTimeslotenergy(option)}
                                                value={Timeslotengval}
                                            />
                                        </div>

                                    </div>

                                    {renderTimeSlotEnergyNode()}
                                </Card>
                            </Grid>
                        }
                        {selectedenergytype !== 2 &&
                            <Grid item xs={GridSize} >
                                <Card elevation={0} style={{ height: "450px", padding: "8px" }}>
                                    <div className="flex p-2 items-center justify-between" >
                                        <Typography variant="heading-01-xs" color='secondary'
                                            value={t("Asset Energy Comparison")} />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <div style={{ width: '200px' }}>
                                                <SelectBox
                                                    id="asset-List"
                                                    placeholder={t('SelectAsset')}
                                                    auto={true}
                                                    options={AssetengOption}
                                                    isMArray={true}
                                                    keyValue={"name"}
                                                    keyId={"id"}
                                                    multiple={true}
                                                    onChange={(option) => handleAssetenergy(option)}
                                                    value={Assetengval}
                                                    maxSelect={2}
                                                />
                                            </div>
                                            <ContentSwitcherNDL listArray={OverAllList} contentSwitcherClick={(e) => { setAssetCompareIndex(e); setReDraw(true); setTimeout(() => { setReDraw(false) }, 500) }} switchIndex={AssetCompareIndex} ></ContentSwitcherNDL>
                                        </div>
                                    </div>
                                    {renderAssertCampareLayout()}
                                </Card>
                            </Grid>
                        }
                    </Grid>
                </div>

                :
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <Typography
                        style={{ color: theme.colorPalette.primary }}
                        value={t("Add Energy Asset in Setting screen to view the dashboard")}>
                    </Typography>
                </Grid>
            }

        </div >

    )
}
const isRender = (prev, next) => {
    return ((prev.headPlant.id !== next.headPlant.id) || (prev.typelist.length !== next.typelist.length) || (prev.btGroupValue !== next.btGroupValue) || (prev.mode !== next.mode)) ? false : true
}
const EnergyDashboard = React.memo(EnergyDB, isRender);
export default EnergyDashboard;
