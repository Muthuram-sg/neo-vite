/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import useTheme from 'TailwindTheme';
import Grid from "components/Core/GridNDL";
import Card from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import LinearProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import moment from 'moment';
import { useTranslation } from "react-i18next";
import common from "../components/common"; 
import Charts from "../components/ChartJS/Chart";
import HighCharts from "../components/HighCharts/HighCharts";
import useEnergyDay from "../hooks/usegetEnergyDay";
import useVirtualInstrumentFormula from "../hooks/useVirtualInstrumentFormula";
import { calcFormula } from 'components/Common/commonFunctions.jsx';

function WaterfallDB(props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const [previousyear, setpreviousyear] = useState([])
    const [currentyear, setcurrentyear] = useState([])
    const [pyear, setprevyear] = useState('')
    const [curyear, setcurryear] = useState('')
    const [datedata, setdatedata] = useState([])
    const [datetocomparedata, setdatetocomparedata] = useState([])
    const [nodes, setnodenames] = useState([])
    const theme = useTheme();

    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();
    const { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula } = useVirtualInstrumentFormula();

    const classes = {
        cardTheme: {
            height: "100%",
            backgroundColor: theme.colorPalette.cards
        },
        title: {
            display: 'flex',
            alignItems: 'center',
        },
        dividerMargin: {
            marginTop: 8,
            marginBottom: 8
        },

    }
    const getwaterfalldata = () => {

        let waterfalldata = []
        try {
            waterfalldata.push({
                name: moment(props.date).format("MMM DD YYYY"),
                y: datedata.reduce((total, obj) => obj.data + total, 0),
                color: "#007BFF"
            })
            datedata.forEach((val) => {
                let index = datetocomparedata.findIndex(i => i.name === val.name)
                if (index !== -1) waterfalldata.push({ name: val.name, y: datetocomparedata[index].data - val.data })

            })
            waterfalldata.push({
                name: moment(props.datetocompare).format("MMM DD YYYY"),
                y: datetocomparedata.reduce((total, obj) => obj.data + total, 0),
                color: "#007BFF",
                isSum: true
            })
        } catch (err) {
            console.log("err at WaterfallData", err)
        }

        return waterfalldata
    }

    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            let previousyeardata = []
            let currentyeardata = []
            let datedatas = []
            let datetocomparedatas = []
            if (energydayData.length > 0) {
                energydayData.map((instrument) => {
                    if (instrument.dayData.length > 0) {
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                data.map((val) => {
                                    let metrictype = common.getmetrictype([val.key], props.typelist)
                                    let total
                                    if (Number(metrictype) === 2 && !val.offline){
                                        total = val.endReading - val.startReading;
                                    } else{
                                        total = val.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replace(val.iid + "." + val.key, total)
                                })
                                formula = formula.replace(/[a-z0-9]+.kwh/g, 0).replace('--', '-');
                                if (new Date(pyear, 0, 1).getTime() === new Date(data[0].time).getTime()) {
                                    previousyeardata.push({
                                        data: parseInt(isFinite(calcFormula(formula))&& calcFormula(formula)>=0 ? calcFormula(formula) : 0),
                                        time: moment(data[0].time).format('ll'), name: instrument.vi.name
                                    })
                                } else if (new Date(curyear, 0, 1).getTime() === new Date(data[0].time).getTime()) {
                                    currentyeardata.push({
                                        data: parseInt(isFinite(calcFormula(formula))&& calcFormula(formula)>=0 ? calcFormula(formula) : 0),
                                        time: moment(data[0].time).format('ll'), name: instrument.vi.name
                                    })
                                } else if (new Date(moment(props.date, "DD/MM/YYYY").startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')).getTime() === new Date(data[0].time).getTime()) {
                                    datedatas.push({
                                        data: parseInt(isFinite(calcFormula(formula))&& calcFormula(formula)>=0 ? calcFormula(formula) : 0),
                                        time: moment(data[0].time).format('ll'), name: instrument.vi.name
                                    })
                                } else {
                                    datetocomparedatas.push({
                                        data: parseInt(isFinite(calcFormula(formula))&& calcFormula(formula)>=0 ? calcFormula(formula) : 0),
                                        time: moment(data[0].time).format('ll'), name: instrument.vi.name
                                    })
                                }

                            }

                        })
                    }



                })
            }
            setpreviousyear(previousyeardata)
            setcurrentyear(currentyeardata)
            setdatedata(datedatas)
            setdatetocomparedata(datetocomparedatas)
            setLoading(false)


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])
    useEffect(() => {
        if (!VirtualInstrumentFormulaLoading && VirtualInstrumentFormuladata && !VirtualInstrumentFormulaerror) {
            let finalrequestarray = []
            let range = setRange()
            let dates = [{
                "start": range[0], "end": range[1]
            }, {
                "start": range[2], "end": range[3]
            }, {
                "start": moment(new Date(moment(props.date, "DD/MM/YYYY"))).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
                "end": moment(new Date(moment(props.date, "DD/MM/YYYY"))).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
            }, {
                "start": moment(new Date(moment(props.datetocompare, "DD/MM/YYYY"))).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),
                "end": moment(new Date(moment(props.datetocompare, "DD/MM/YYYY"))).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
            }

            ]

            let nodenames = []
            VirtualInstrumentFormuladata.map((val) => {
                nodenames.push(val.name)
               
                let values = common.getVirtualInstrumentInfo(val, props.typelist)
                let instruments = values[0]
                let metrics = values[1]
                let types = values[2]

                finalrequestarray.push({ "start": range[0], "end": range[1], "type": types, "metrics": metrics, "instruments": instruments, "viid": val })

            })
            setnodenames(nodenames)
            getEnergyDay(finalrequestarray, dates, [])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror])
    useEffect(() => {

        if (props.nodes && !isNaN(new Date(props.date)) && !isNaN(new Date(props.datetocompare))) {
            setLoading(true)
            getVirtualInstrumentFormula(props.nodes)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.nodes.length, props.date, props.datetocompare])



    const setRange = () => {
        let currentyearloc = new Date().getFullYear()
        let previousyearloc = currentyearloc - 1
        setprevyear(previousyearloc)
        setcurryear(currentyearloc)
        let previousstart = moment(new Date(previousyearloc, 0, 1)).format('YYYY-MM-DDTHH:mm:ssZ')
        let previousend = moment(new Date(previousyearloc, 11, 31, 23, 59, 59)).format('YYYY-MM-DDTHH:mm:ssZ')

        let currentstart = moment(new Date(currentyearloc, 0, 1)).format('YYYY-MM-DDTHH:mm:ssZ')
        if (currentyearloc === new Date().getFullYear()) {
            let currentend = moment().format('YYYY-MM-DDTHH:mm:ssZ')
        } else {
            currentend = moment(new Date(currentyearloc, 11, 31, 23, 59, 59)).format('YYYY-MM-DDTHH:mm:ssZ')
        }
        return [previousstart, previousend, currentstart, currentend]

    }

    const renderPreviousYear = () =>{
        if(previousyear.length > 0){
            return(
                <Card elevation={0} style={{ height: "80vh", width: "10vw",  padding: "8px"}}>
                <Charts
                    charttype={"bar"}
                    title={'Previous Year'}
                    customtooltip={() => nodes.toString()}
                    labels={[pyear]}
                    data={[{
                        label: pyear,
                        data: [Math.round((previousyear.reduce((total, obj) => obj.data + total, 0)) / (Number(pyear) % 4 === 0 ? 366 : 365))],
                        backgroundColor: '#BABABA'
                    }]}
                    ymin={0}
                    ymax={Math.ceil(Math.max((previousyear.reduce((total, obj) => obj.data + total, 0)) / (Number(pyear) % 4 === 0 ? 366 : 365),
                        (currentyear.reduce((total, obj) => obj.data + total, 0)) * (24 * 60 * 60 * 1000) /
                        (new Date(moment().startOf('day')).getTime() - new Date(curyear, 0, 1).getTime()))
                    )}
                />
            </Card>
            )
        }else{
            return(
                <Card elevation={0} style={{ width: "10vw"}}>
                <div>
                    <Typography variant="heading-01-xs" color='secondary' style={classes.title} value={t("Previous Year")}/>
                </div>


            </Card>
            )
        }
    }

    const renderDateData = () =>{
        if(datedata.length > 0){
return(
    <Card elevation={0} style={{ width: "72vw"}}>
                                <HighCharts
                                    charttype={"waterfall"}
                                    chartTitle={"Consumption-Waterfall"}
                                    tooltip={(param) => {
                                        return param.key +
                                        '</br> <b>' + Math.abs(param.y) + '</b>'}}
                                    yAxisTitle={"kWh"}
                                    legend={false}
                                    series={[{
                                        upColor: '#28BD41',
                                        color: '#FF0D00',
                                        data:
                                            getwaterfalldata(),
                                        dataLabels: {
                                            enabled: false
                                        },
                                        pointPadding: 0
                                    }]}
                                    height={600}
                                />
                            </Card>
)
        }else{
            return(
                <Card elevation={0} style={{ width: "72vw"}}>
                <div>
                    <Typography variant="heading-01-xs" color='secondary' style={classes.title} value={t("Consumption-Waterfall")}/>
                </div>


            </Card>
            )
        }
    }

    const renderCurrentYear = () =>{
        if(currentyear.length > 0){
            return(
            <Card elevation={0} style={{ height: "80vh", width: "10vw",  padding: "8px" }}>
                                <Charts
                                    charttype={"bar"}
                                    title={'Current Year'}
                                    customtooltip={() => nodes.toString()}
                                    labels={[curyear]}
                                    data={[{
                                        label: curyear,
                                        data: [Math.round((currentyear.reduce((total, obj) => obj.data + total, 0)) * (24 * 60 * 60 * 1000) /
                                            (new Date(moment().startOf('day')).getTime() - new Date(curyear, 0, 1).getTime()))
                                        ],
                                        backgroundColor: '#BABABA'


                                    }]}
                                    ymin={0}
                                    ymax={Math.ceil(Math.max((previousyear.reduce((total, obj) => obj.data + total, 0)) / (Number(pyear) % 4 === 0 ? 366 : 365),
                                        (currentyear.reduce((total, obj) => obj.data + total, 0)) * (24 * 60 * 60 * 1000) /
                                        (new Date(moment().startOf('day')).getTime() - new Date(curyear, 0, 1).getTime()))
                                    )}
                                />

                            </Card>
                            )
        }else{
            return(
                <Card elevation={0} style={{ width: "10vw"}}>
                <div>
                    <Typography variant="heading-01-xs" color='secondary' style={classes.title} value={t("Current Year")}/>

                </div>


            </Card>
            )
        }
    }

    return (


        <React.Fragment>
            {props.nodes.length > 0 ?
                <React.Fragment>
                    {loading && <LinearProgress></LinearProgress>}
                    <div className="flex p-4 gap-4 ">
                        {renderPreviousYear()}
                        {renderDateData()}
                        {renderCurrentYear()}
                    </div>
                </React.Fragment> :
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}><Typography style={{ color: theme.colorPalette.primary }}
                    value={t('Configure the nodes in Setting screen to view the dashboard')} /></Grid>
            }
        </React.Fragment>
    )
}
const isRender = (prev, next) => {
    return (
        (prev.date !== next.date) || 
        (prev.datetocompare !== next.datetocompare) || 
        (prev.nodes.length !== next.nodes.length)
    )
}
const WaterFallDashboard = React.memo(WaterfallDB, isRender);
export default WaterFallDashboard;