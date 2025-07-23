/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Card from "components/Core/KPICards/KpiCardsNDL";
import moment from 'moment';
import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType, HourlyLabels, DailyLabels, WeeklyLabels, MonthlyLabels } from "recoilStore/atoms";
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import useTheme from 'TailwindTheme';
import common from "../components/common";
import Charts from "../components/ChartJS/Chart";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
//Hooks
import useVirtualInstrumentFormula from "../hooks/useVirtualInstrumentFormula"
import useEnergyDay from "../hooks/usegetEnergyDay"
import useEnergyShift from "../hooks/useEnergyShift"
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";


export default function ParallelConsumption(props) { 
    const [currentday, setcurrentday] = useState([])
    const [previousday, setpreviousday] = useState([])
    const [currentshift, setcurrentshift] = useState([])
    const [previousshift, setpreviousshift] = useState([])
    const [hourlylabels, sethourlylabels] = useRecoilState(HourlyLabels)
    const [dailylabels, setdailylabels] = useRecoilState(DailyLabels)
    const [weeklylabels, setweeklylabels] = useRecoilState(WeeklyLabels)
    const [monthlylabels, setmonthlylabels] = useRecoilState(MonthlyLabels)
    const [energyasset, setenergyasset] = useState('')
    const [, setshifttime] = useState([])
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [ShiftLoading,setShiftLoading] = useState(false)
    const [DayLoading,setDayLoading] = useState(false)
    const theme = useTheme();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const palette = ["#88B056", "#EC3B77", "#FF6C3E", "#9721B6", "#3DA3F5", "#21BDD2", "#FFD121", "#DF3B44", "#2E81FF"]


    const { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula } = useVirtualInstrumentFormula()
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();
    const { energyshiftLoading, energyshiftData, energyshiftError, getEnergyShift } = useEnergyShift();


    useEffect(() => {

        if (!VirtualInstrumentFormulaLoading && VirtualInstrumentFormuladata && !VirtualInstrumentFormulaerror) {
            let finalrequestarray = []
            let params = setgroupbyanddifference()
            let range = setRange()
            let dates = common.getBetweenDates(moment(range[0]), moment(range[1]), params[0])
            let previousdates = common.getBetweenDates(moment(range[0]).subtract(params[1], 'd'), moment(range[1]).subtract(params[1], 'd'), params[0])
            let shiftdates = common.getShiftBetweenDates(moment(range[0]), moment(range[1]), props.headPlant.shift)
            let previousshiftdates = common.getShiftBetweenDates(moment(range[0]).subtract(params[1], 'd'), moment(range[1]).subtract(params[1], 'd'), props.headPlant.shift)
            VirtualInstrumentFormuladata.forEach((val) => {
                let values = common.getVirtualInstrumentInfo(val, props.typelist)
                let instruments = values[0]
                let metrics = values[1]
                let types = values[2]
                finalrequestarray.push({ "start": range[0], "end": range[1], "type": types, "metrics": metrics, "instruments": instruments, "viid": val })
            })
            
            getEnergyDay(finalrequestarray, dates, previousdates)
            getEnergyShift(finalrequestarray, shiftdates, previousshiftdates)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror])

    const setgroupbyanddifference = () => {
        let groupby 
        let difference 
        if (props.category === 1) {
            groupby = 'hour'
            difference = 1

        } else if (props.category === 2) {
            groupby = 'day'
            difference = common.getDays(new Date().getFullYear(), new Date().getMonth())

        }
        else if (props.category === 3) {
            groupby = 'day'
            difference = 7

        } else if (props.category === 4) {
            groupby = 'month'
            difference = common.getDaysinYear(new Date().getFullYear())

        }
        return [groupby, difference]
    }

    useEffect(() => { 
        let viids = []
        let energy_nodeids = []
        if (props.headPlant.node && props.headPlant.node.nodes) {
            energy_nodeids = props.headPlant.node.nodes.filter(n => n.type === 1)
            viids.push(energy_nodeids[0].asset)
            setenergyasset(energy_nodeids[0].asset)
            setDayLoading(true)
            setShiftLoading(true)
            getVirtualInstrumentFormula(viids)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant.id, props.category])



    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            let daywiseData = [];
            let previousdaywiseData = []
            energydayData.forEach((instrument) => {
                if(instrument.dayData){
                    const processDayData = (data, outputArray,formula) => {
                        data.forEach((val) => {
                            let metrictype = common.getmetrictype([val.key], props.typelist)
                            let total;
                            if (Number(metrictype) === 2 && !val.offline) {
                                total = val.endReading - val.startReading;
                            } else {
                                total = val.value;
                            }
                            total = total === null ? 0 : total;
                            formula = formula.replace(val.iid + "." + val.key, total);
                        });
                    
                        formula = formula.replace(/[a-z0-9]+.kwh/g, 0).replace('--', '-');
                    
                        if (instrument.vi.id === energyasset) {
                            outputArray.push({ data: parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0), time: data.length > 0 ? data[0].time : "" });
                        }
                    };
                    
                    instrument.dayData.forEach((data) => {
                        let formula = instrument.vi.formula;
                        if (data.length > 0) {
                            processDayData(data, daywiseData,formula);
                        } else {
                            if (instrument.vi.id === energyasset) {
                                daywiseData.push({ data: 0, time: "" });
                            }
                        }
                    });
                    
                    instrument.previousdayData.forEach((data) => {
                        let formula = instrument.vi.formula;
                        if (data.length > 0) {
                            processDayData(data, previousdaywiseData,formula);
                        } else {
                            if (instrument.vi.id === energyasset) {
                                previousdaywiseData.push({ data: 0, time: "" });
                            }
                        }
                    });
            }
            })
            setcurrentday(daywiseData)
            setpreviousday(previousdaywiseData) 
            setDayLoading(false)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])


    useEffect(() => {
        if (!energyshiftLoading && energyshiftData && !energyshiftError) {


            let shiftwiseEaCurrentData = []
            let shiftwiseEaPreviousData = []
            let tempshifttime = []
            let time = []
            let metrictype = 2
            energyshiftData.flat(1).forEach((instrument) => {
                let shiftwiseData = instrument.shift.shifts;
                instrument.shiftData.forEach((data) => {
                    let formula = instrument.vi.formula;



                    data.data.forEach((val) => {
                        let total
                        if (metrictype === 2 && !val.offline){
                            total = val.endReading - val.startReading;
                        } else{
                            total = val.value
                        } 
                        total = total === null ? 0 : total;
                        formula = formula.replace(val.iid + "." + val.key, total)
                        if (!tempshifttime.includes(moment(val.time).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))) tempshifttime.push(moment(val.time).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))
                        if (!time.includes(moment(val.time).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))) time.push(moment(val.time).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))
                    })
                    formula = formula.replace(/[a-z0-9]+.kwh/g, 0).replace(/[a-z0-9]+_pulse/g, 0).replace('--', '-');
                    if (instrument.shift.ShiftType === "Weekly") {
                        Object.keys(shiftwiseData).forEach((shiftData, index) => {
                            let t = new Date().getDay();
                            if (t === parseInt(shiftData)) {
                                shiftwiseData[index].map((x) => {
                                    if (!x.data) {
                                        x.data = []
                                    }
                                    if (!x.node) {
                                        x.node = instrument.vi.name
                                    }
                                    if (x.name === data.name) {
                                        x.data.push(parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0))
                                    }
                                })
                                if (instrument.vi.id === energyasset) {
                                    shiftwiseEaCurrentData = [...shiftwiseData[index]]
                                }

                            }
                        })
                    } else {
                        shiftwiseData.forEach((x) => {

                            if (!x.data) {
                                x.data = []
                            }
                            if (!x.node) {

                                x.node = instrument.vi.name
                            }
                            if (!x.time) {
                                x.time = []
                            }
                            if (x.name === data.name) {

                                x.data.push(parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ?
                                    calcFormula(formula) : 0))
                                if (data.data.length > 0) {
                                    if (!x.time.includes(moment(data.data[0].time).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))) x.time.push(moment(data.data[0].time).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'))
                                }
                                else x.time.push('')
                            }
                        })
                        if (instrument.vi.id === energyasset) {
                            shiftwiseEaCurrentData = [...shiftwiseData]
                        }
                    }
                })

                instrument.previousshiftData.forEach((data) => {
                    let formula = instrument.vi.formula;

                    data.data.forEach((val) => {
                        let total
                        if (Number(metrictype) === 2 && !val.offline){
                            total = val.endReading - val.startReading;
                        } else{
                            total = val.value
                        } 
                        total = total === null ? 0 : total;
                        formula = formula.replace(val.iid + "." + val.key, total)

                    })
                    formula = formula.replace(/[a-z0-9]+.kwh/g, 0).replace(/[a-z0-9]+_pulse/g, 0).replace('--', '-');
                    const updateShiftwiseData = (shiftData, datum, formulas) => {
                        shiftData.forEach((x) => {
                            if (x.name === datum.name) {
                                if (!x.previousdata) {
                                    x.previousdata = [];
                                }
                                x.previousdata.push(parseInt(isFinite(calcFormula(formulas)) && calcFormula(formulas) >= 0 ? calcFormula(formulas) : 0));
                            }
                        });
                    };
                    if (instrument.shift.ShiftType === "Weekly") {
                        Object.keys(shiftwiseData).forEach((previousshiftData, index) => {
                            let t = new Date().getDay();
                            if (t === parseInt(previousshiftData)) {
                                shiftwiseData[index].map((x) => {
                                    if (x.name === data.name) {
                                        if (!x.previousdata) {
                                            x.previousdata = []
                                        }
                                        x.previousdata.push(parseInt(isFinite(calcFormula(formula)) && calcFormula(formula) >= 0 ? calcFormula(formula) : 0))
                                    }
                                })
                                if (instrument.vi.id === energyasset) {

                                    shiftwiseEaPreviousData = [...shiftwiseData[index]]
                                }
                            }
                        })
                    } else {
                        updateShiftwiseData(shiftwiseData,data, formula);
                        if (instrument.vi.id === energyasset) {

                            shiftwiseEaPreviousData = [...shiftwiseData]
                        }
                    }




                })

                if (props.category === 4) {

                    shiftwiseEaCurrentData.forEach(val => {
                        if (!val.currentyeardata) {
                            val.currentyeardata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                        if (!val.previousyeardata) {
                            val.previousyeardata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        }
                        if (!val.months) {
                            val.months = monthlylabels.length > 0 ? [...monthlylabels.map(value => value.end)] : common.getBetweenDates(moment(moment().startOf('year').format('YYYY-MM-DDTHH:mm:ssZ')), moment(moment().endOf('year').format('YYYY-MM-DDTHH:mm:ssZ')), 'month').map(valt => valt.end)
                        }

                        val.time.forEach((t, i) => {
                            if (t !== '') {
                                let monthindex = val.months.findIndex(m => new Date(t).getMonth() === new Date(m).getMonth())

                                if (val.currentyeardata.length > 0) {
                                    val.currentyeardata[monthindex] = val.currentyeardata[monthindex] + val.data[i]
                                }
                                if (val.previousyeardata.length > 0) {
                                    val.previousyeardata[monthindex] = val.previousyeardata[monthindex] + val.previousdata[i]
                                }

                            }

                        })
                    })
                }
            })
            setcurrentshift(shiftwiseEaCurrentData.flat(1))
            setpreviousshift(shiftwiseEaPreviousData.flat(1))
            if(props.category === 4){
                setshifttime(shiftwiseEaCurrentData.flat(1).length > 0 ? shiftwiseEaCurrentData.flat(1)[0].months : [])
            }else{
                setshifttime(shiftwiseEaCurrentData.flat(1).length > 0 ? shiftwiseEaCurrentData.flat(1)[0].time : [])
            }
            setShiftLoading(false)
              


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energyshiftLoading, energyshiftData, energyshiftError])


    function setRange() {

        let startrange;
        let endrange;

        try {
            if (props.category === 1) {
                startrange = moment().startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
                endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
                sethourlylabels(common.getBetweenDates(moment(startrange), moment(endrange), 'hour'))

            }
            else if (props.category === 2) {
                startrange = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ssZ')
                endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
                setdailylabels(common.getBetweenDates(moment(startrange), moment(endrange), 'day'))

            }
            else if (props.category === 3) {
                startrange = moment().startOf('week').format('YYYY-MM-DDTHH:mm:ssZ')
                endrange = moment().endOf('week').format("YYYY-MM-DDTHH:mm:ssZ")
                setweeklylabels(common.getBetweenDates(moment(startrange), moment(endrange), 'day'))

            }
            else if (props.category === 4) {
                startrange = moment().startOf('year').format('YYYY-MM-DDTHH:mm:ssZ')
                endrange = moment().endOf('year').format("YYYY-MM-DDTHH:mm:ssZ")
                setmonthlylabels(common.getBetweenDates(moment(startrange), moment(endrange), 'month'))

            }
            return [startrange, endrange]
        } catch (err) {
            console.log("Error at getRange", err)
            setSnackMessage("Unable to fetch the data")
            setSnackType("warning")
            setOpenSnack(true)
            return [startrange, endrange]
        }


    }
    const energyassetcurrvsprevdata = () => {
        let datasets = []
        let pd = []
        let cd = []


        pd = [...previousday]
        cd = [...currentday]



        datasets.push(
            {
                label: "Previous",
                data: pd.length !== 0 ? pd.map(x => { return x.data }) : [],
                backgroundColor: "#4AD962",
                stack: 'Stack 0'
            },
            {
                label: "Current",
                data: cd.length !== 0 ? cd.map(x => { return x.data }) : [],
                backgroundColor: "#3396FF",
                stack: 'Stack 1'
            },

        )


        return datasets
    }
    const shiftcurrvsprevdata = () => {
        let datasets = []
        let bgColors = []
        let pd = []
        let cd = []


        pd = [...previousshift]
        cd = [...currentshift]


        for (let i = 0; i < pd.length; i++) {
            bgColors.push(palette[i % palette.length]);
        }
        cd.forEach((val, index) => {
            datasets.push(
                {
                    label: pd[index].name,
                    data: props.category === 4 ? pd[index].previousyeardata : pd[index].previousdata,
                    backgroundColor: bgColors[index],
                    stack: 'Stack 0'
                },
                {
                    label: val.name,
                    data: props.category === 4 ? val.currentyeardata : val.data,
                    backgroundColor: bgColors[index],
                    stack: 'Stack 1'
                },)
        })


        return datasets
    }

    const getLabels = () => {

        try {
            if (props.category === 1) {


                return (hourlylabels.length > 0 ? hourlylabels.map(val => moment(val.end).format("HH:00")) : common.getBetweenDates(moment(moment().startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")), moment(moment().endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")), 'hour').map(val => moment(val.end).format("HH:00")))
            }
            else if (props.category === 2) {

                return (dailylabels.length > 0 ? dailylabels.map(val => new Date(val.end).getDate()) :
                    common.getBetweenDates(moment(moment().startOf('month').format("YYYY-MM-DDTHH:mm:ssZ")), moment(moment().endOf('month').format("YYYY-MM-DDTHH:mm:ssZ")), 'day').map(val => new Date(val.end).getDate())
                )
            }
            else if (props.category === 3) {

                return (weeklylabels.length > 0 ? weeklylabels.map(val => days[new Date(val.end).getDay()]) :
                    common.getBetweenDates(moment(moment().startOf('week').format("YYYY-MM-DDTHH:mm:ssZ")), moment(moment().endOf('week').format("YYYY-MM-DDTHH:mm:ssZ")), 'day').map(val => days[new Date(val.end).getDay()]))
            }
            else if (props.category === 4) {

                return (monthlylabels.length > 0 ? monthlylabels.map(val => monthNames[new Date(val.end).getMonth()]) :
                    common.getBetweenDates(moment(moment().startOf('year').format("YYYY-MM-DDTHH:mm:ssZ")), moment(moment().endOf('year').format("YYYY-MM-DDTHH:mm:ssZ")), 'month').map(val => monthNames[new Date(val.end).getMonth()]))
            }
        } catch (err) {
            setSnackMessage("Unable to fetch the data")
            setSnackType("warning")
            setOpenSnack(true)
            console.log("error at getLabels in Parallel Consumption", err)
            return []

        }
    } 
   

    const customtooltip = (context) => {
        const toolTipLabel =(value,syear,lableArr,format,duration,endduration)=>{
            if(value){
               return moment(lableArr[context[0].dataIndex].end).subtract(syear, duration).format(format)
            }else{
                return  moment(common.getBetweenDates(moment(moment().startOf(duration).format('YYYY-MM-DDTHH:mm:ssZ')), moment(moment().endOf(duration).format('YYYY-MM-DDTHH:mm:ssZ')), endduration)[context[0].dataIndex].end).subtract(syear, duration).format(format)
            }
        }
        try {
            let subYear = context[0].dataset.stack === "Stack 1" ? 0 : 1
            if (props.category === 4) {
                return (
                    toolTipLabel(monthlylabels.length > 0,subYear,monthlylabels,"MMM YYYY","year","month") 
                )
            }
            else if (props.category === 1) {
                if(context[0].dataset.stack === "Stack 1"){
                     return (toolTipLabel(hourlylabels.length > 0,subYear,hourlylabels,"ll","day","hour") )
                }else{
                    return (toolTipLabel(monthlylabels.length > 0,subYear,monthlylabels,"ll","day","hour") )
                }
              
            }
            else if (props.category === 2) {
               
                    return ( toolTipLabel(dailylabels.length > 0,subYear,dailylabels,"ll","month","day") )

            }
            else if (props.category === 3) {

                return ( toolTipLabel(weeklylabels.length > 0,subYear,weeklylabels,"ll","week","day") )

            }
        } catch (err) {
            console.log("Error at setting tooltip", err)
        }
    }

    const renderParallelConsumption = ()=>{
        if(!props.mode){
            return(
                <Card  style={{ height: "450px" }} >
                {DayLoading ?
                    <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                    :
                    <Charts
                        charttype={"bar"}
                        title={'Consumption - Current Vs Previous'}
                        yAxisTitle={"Consumption (kwh)"}
                        labels={getLabels()}
                        data={energyassetcurrvsprevdata()}
                        customtooltip={customtooltip}
                        legend={true}
                    />
                }
            </Card>
            )
        }else{
            if(props.category !== 1){
                return(
                    <Card  style={{ height: "350px",marginTop:'16px' }}>
                    {ShiftLoading ?
                    <div style={{ display: "flex", justifyContent: "center", margin: 10 }}><CircularProgress /></div>
                    :
                    <Charts
                        charttype={"bar"}
                        title={'Consumption - Current Vs Previous'}
                        yAxisTitle={"Consumption (kwh)"}
                        labels={getLabels()}
                        data={shiftcurrvsprevdata()}
                        customtooltip={customtooltip}
                    />
                    }
                </Card>
                )
              
            }else{
                return(
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}><Typography value={"Hourly Data can not be viewed for shiftwise selection."}style={{ color: theme.colorPalette.primary }}/>
                   </Grid>
                )
            }
        }
    }

    return (

        <div className="p-4"> 
            {renderParallelConsumption()}
        </div >

    )
}


