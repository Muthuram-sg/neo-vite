/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import moment from 'moment';
import { useRecoilState } from "recoil";
import useProductQuantityList from "../hooks/useProductQuantity";
import Card from "components/Core/KPICards/KpiCardsNDL";
import useTheme from 'TailwindTheme';
import LinearProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import { autoavg, manavg, themeMode,customdates } from "recoilStore/atoms";
import * as d3 from "d3";
import { useTranslation } from "react-i18next";
import Charts from "../components/ChartJS/Chart";
import HighCharts from "../components/HighCharts/HighCharts"; 
import useVirtualInstrumentFormula from "../hooks/useVirtualInstrumentFormula";
import common from "../components/common";
import useEnergyDay from "../hooks/usegetEnergyDay";



export default function EnergypersqmtDashboard(props) {
    const { t } = useTranslation();
    const [curTheme]=useRecoilState(themeMode)
    const [customdatesval] = useRecoilState(customdates);
    const [startrange, setstartrange] = useState(new Date())
    const [endrange, setendrange] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [autoaverage, setautoaverage] = useRecoilState(autoavg)
    const [manualaverage, setmanualaverage] = useRecoilState(manavg)
    const [prodquantity, setprodquantitydata] = useState([])
    const [chartdata, setchartdata] = useState({ "scatterdatatonnage": [], "products": [], "boxplotdata": [], "scatterdataarea": [] })
    const { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula } = useVirtualInstrumentFormula()
    const theme = useTheme();

     

    const { productquantitylistLoading, productquantitylistdata, productquantitylisterror, getProductQuantityList } = useProductQuantityList()
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();
    const quartiles = [0, 0.25, 0.5, 0.75, 1]

    useEffect(() => {
        if ((!productquantitylisterror && !productquantitylistLoading && productquantitylistdata)) {

            getDurations(productquantitylistdata)
            setprodquantitydata(productquantitylistdata)
        }
        else {
            setLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productquantitylistLoading, productquantitylistdata, productquantitylisterror])


    const getDurations = (productquantitylist) => {
        setLoading(true)
        let durations = []

        productquantitylist.forEach((val) => {

            if (props.products.includes(val.prod_order.prod_product.id)) {
                let index = durations.findIndex(d => (new Date(d.start).getTime() === new Date(val.start_dt).getTime()) &&
                    (new Date(d.end).getTime() === new Date(val.end_dt).getTime()))
                if (index === -1) {
                    durations.push({ start: val.start_dt, end: val.end_dt })
                }

            }

        })

        if (durations.length > 0 && VirtualInstrumentFormuladata && VirtualInstrumentFormuladata.length > 0) {
            let finalrequestarray = []
            VirtualInstrumentFormuladata.forEach((val) => {
                let values = common.getVirtualInstrumentInfo(val, props.typelist)
                finalrequestarray.push({ "start": startrange, "end": endrange, "type": values[2], "metrics": values[1], "instruments": values[0], "viid": val })

            })
            getEnergyDay(finalrequestarray, durations, [])

        }
        else {

            setchartdata({ "scatterdatatonnage": [], "scatterdataarea": [], "products": [], "boxplotdata": [] })
            setLoading(false)

        }
    }


    useEffect(() => {
        if (prodquantity && props.products.length > 0) {
            getDurations(prodquantity)
        } else {
            setchartdata({ "scatterdatatonnage": [], "products": [], "boxplotdata": [], "scatterdataarea": [] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.products.length, prodquantity])

    useEffect(() => {

        if (!VirtualInstrumentFormulaLoading && VirtualInstrumentFormuladata && !VirtualInstrumentFormulaerror) {
            let range = common.Range(props.btGroupValue, props.headPlant, customdatesval)
            if (!range[2]) {
                setstartrange(range[0])
                setendrange(range[1])
                setLoading(true)
                getProductQuantityList(range[0], range[1], props.headPlant.id)
            }

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror])

    useEffect(() => {
        if (VirtualInstrumentFormuladata && VirtualInstrumentFormuladata.length > 0) {
            let range = common.Range(props.btGroupValue, props.headPlant, customdatesval)
            if (!range[2]) {
                setstartrange(range[0])
                setendrange(range[1])
                setLoading(true)
                getProductQuantityList(range[0], range[1], props.headPlant.id)
            }

        }
        else {
            getVirtualInstrumentFormula([props.headPlant.energy_asset])
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.btGroupValue, props.headPlant.id])



    const getAverage = (readings) => {
        let sum = readings.reduce((val, a) => val + a, 0)
        return sum / (readings.length)
    }




    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            if (energydayData.length > 0) {
                const energydata = energydayData[0].dayData.flat(1)
                let productenergydata = prodquantity.filter((x) => props.products.includes(x.prod_order.prod_product.id))
                let uniqueproductquantitydata = []


                let aggregatedproductenergydata = []
                productenergydata.forEach((val) => {
                    let index = aggregatedproductenergydata.findIndex(i => (i.prod_order_id === val.prod_order.order_id) && (i.prod_product_id === val.prod_order.prod_product.id) && (i.start_dt === val.start_dt) && (i.end_dt === val.end_dt))
                    if (index < 0) {
                        aggregatedproductenergydata.push(
                            {
                                "start_dt": val.start_dt,
                                "end_dt": val.end_dt,
                                "prod_order_id": val.prod_order.order_id,
                                "prod_product_id": val.prod_order.prod_product.id,
                                "prod_product_name": val.prod_order.prod_product.name,
                                "info": {
                                    "Length": [val.info ? val.info.Length : 0], "Width": [val.info ? val.info.Width : 0], "Thickness": [val.info ? val.info.Thickness : 0],
                                    "Quantity": [val.info ? val.info.Quantity : 0], "Weight": [val.info ? val.info.Weight : 0],
                                    "Area": [val.info ? (Number(val.info.Length) * Number(val.info.Width) * Number(val.info.Quantity)) / Math.pow(10, 6) : 0]
                                }
                            })
                    }
                    else {
                        aggregatedproductenergydata[index].info.Length.push(val.info ? val.info.Length : 0)
                        aggregatedproductenergydata[index].info.Width.push(val.info ? val.info.Width : 0)
                        aggregatedproductenergydata[index].info.Thickness.push(val.info ? val.info.Thickness : 0)
                        aggregatedproductenergydata[index].info.Quantity.push(val.info ? val.info.Quantity : 0)
                        aggregatedproductenergydata[index].info.Weight.push(val.info ? val.info.Weight : 0)
                        aggregatedproductenergydata[index].info.Area.push(val.info ? (Number(val.info.Length) * Number(val.info.Width) * Number(val.info.Quantity)) / Math.pow(10, 6) : 0)
                    }
                })


                let prodenergymappeddata = []
                aggregatedproductenergydata.forEach((val, index) => {
                    energydata.forEach((item) => {
                        if (new Date(item.time).getTime() >= new Date(val.start_dt).getTime() && new Date(item.time).getTime() <= new Date(val.end_dt).getTime()) {

                            let prodIndex = prodenergymappeddata.findIndex((prod) => {
                                return (new Date(prod.rawtime).getTime() === new Date(item.time).getTime())
                            })
                            if (prodIndex === -1) {

                                prodenergymappeddata.push(Object.assign({}, val, { "energy": item.value, "time": moment(item.time).format("DD MMM"), "readings": [item.value], "rawtime": item.time, "iid": [].concat([item.iid]) }))
                            }
                            else {
                                if (prodenergymappeddata[prodIndex].iid.findIndex(i => i === item.iid) < 0) {
                                    prodenergymappeddata[prodIndex].iid.push(item.iid)
                                    prodenergymappeddata[prodIndex].energy = prodenergymappeddata[prodIndex].energy + item.value
                                    prodenergymappeddata[prodIndex].readings.push(item.value)
                                }


                            }
                        }
                    })
                })
                prodenergymappeddata.forEach((val) => {
                    let index = uniqueproductquantitydata.findIndex(x => x.prod_product_id === val.prod_product_id && 
                        new Date(x.time).getTime() === new Date(val.time).getTime())
                    if (index === -1) {
                        uniqueproductquantitydata.push({ "time": val.time, "prod_order_id": val.prod_order_id, "prod_product_id": val.prod_product_id, "info": val.info, "energy": val.energy, "readings": val.readings, "prod_product_name": val.prod_product_name })
                    } else {
                        uniqueproductquantitydata[index].energy = uniqueproductquantitydata[index].energy + val.energy
                        uniqueproductquantitydata[index].readings = uniqueproductquantitydata[index].readings.concat(val.readings)
                        uniqueproductquantitydata[index].info.Length = uniqueproductquantitydata[index].info.Length.concat(val.info.Length)
                        uniqueproductquantitydata[index].info.Width = uniqueproductquantitydata[index].info.Width.concat(val.info.Width)
                        uniqueproductquantitydata[index].info.Thickness = uniqueproductquantitydata[index].info.Thickness.concat(val.info.Thickness)
                        uniqueproductquantitydata[index].info.Quantity = uniqueproductquantitydata[index].info.Quantity.concat(val.info.Quantity)
                        uniqueproductquantitydata[index].info.Area = uniqueproductquantitydata[index].info.Area.concat(val.info.Area)
                        uniqueproductquantitydata[index].info.Weight = uniqueproductquantitydata[index].info.Weight.concat(val.info.Weight)
                    }
                })


                let manualaverages = []
                let autoaverages = uniqueproductquantitydata.forEach((val => {

                    const filteredProducts = props.selectedproducts.filter(p => p.id === val.prod_product_id);

                    let expectedEnergy = 0;
                    if (filteredProducts.length > 0) {
                        expectedEnergy = filteredProducts[0].expected_energy ;
                    } 
                    manualaverages.push(expectedEnergy);
                    
                    if (val.readings.length >= 10) {
                        let recentreadings = val.readings.slice(-10, val.readings.length).map(v => v / Number(val.info.Area.reduce((partialSum, a) => partialSum + a, 0)))
                        return getAverage(recentreadings)
                    }
                    else return getAverage(val.readings.map(v => v / Number(val.info.Area.reduce((partialSum, a) => partialSum + a, 0))))

                }))
                let finalobjArr = { "scatterdatatonnage": [], "scatterdataarea": [], "boxplotdata": [], "products": uniqueproductquantitydata.map((val) => val.prod_product_name), "day": uniqueproductquantitydata.map((val) => val.time) }
                let tempObj1 = {
                    name: "Product Wise Consumption",
                    data: uniqueproductquantitydata.map((val) => { return { x: Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0), y: val.energy.toFixed(2) } }),
                }
                let tempObj2 = {
                    name: "Consumption-Production",
                    data: uniqueproductquantitydata.map((val) => {
                        return {
                            x: val.prod_product_name, y: quartiles.map((q) => {
                                let persqmtreadings = val.readings.map(v => v / Number(val.info.Area.reduce((partialSum, a) => partialSum + a, 0)))
                                return d3.quantile(persqmtreadings.sort(), q)
                            })
                        }
                    }),



                }
                let tempObj3 = {
                    name: "Area Wise Consumption",
                    data: uniqueproductquantitydata.map((val) => { return { x: Number(val.info ? val.info.Area.reduce((partialSum, a) => partialSum + a, 0) : 0), y: val.energy.toFixed(2) } }),
                }


                setautoaverage(autoaverages)
                setmanualaverage(manualaverages)

                finalobjArr.scatterdatatonnage.push(tempObj1)
                finalobjArr.boxplotdata.push(tempObj2)
                finalobjArr.scatterdataarea.push(tempObj3)

                setchartdata(finalobjArr)

            }
            setLoading(false)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])


    const renderscatterdatatonnage = () => {
        if (chartdata.scatterdatatonnage.length > 0) {
            return (
                <Grid item sm={6}>
                     < Card  style={{ height: "450px",padding: "10px" }}>
                    <Charts
                        charttype={"scatter"}
                        ChartTitle={"Production Consumption"}
                        toolTipTitle={(context) => { return chartdata.day[context[0].dataIndex] }}
                        toolTipLabel={(context) => { return context.label + " Ton    " + context.parsed.y + " kWh" }}
                        toolTipBeforeBody={(context) => { return chartdata.products[context[0].dataIndex] }}
                        xAxisTitle={"Production (Ton)"}
                        yAxisTitle={"Consumption (kwh)"}
                        data={[{
                            label: "Tonnage Wise Consumption",
                            data: chartdata.scatterdatatonnage[0].data,
                            backgroundColor: "#007BFF"
                        }]}

                    />
                </Card>
                </Grid>
               
            )
        } else {
            return (
                <Grid item sm={6}>
                < Card  style={{ height: "450px" }}>
                        <Typography variant="heading-01-xs" color='secondary'value={t("Tonnage Wise Consumption")} />
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="flex items-center justify-center">
                        <Typography variant="heading-02-sm" value="No Data"> </Typography>
                        </div>
                </Card>
                </Grid>
            )
        }
    }

    const renderscatterdataarea = () => {
        if (chartdata.scatterdataarea.length > 0) {
            return (
                <Grid item sm={6}>
                < Card  style={{ height: "450px"}}>
                    <Charts
                        charttype={"scatter"}
                        ChartTitle={"Area wise Consumption"}
                        toolTipTitle={(context) => { return chartdata.day[context[0].dataIndex] }}
                        toolTipLabel={(context) => { return context.label + " sqmt    " + context.parsed.y + " kWh" }}
                        toolTipBeforeBody={(context) => { return chartdata.products[context[0].dataIndex] }}
                        xAxisTitle={"Area (sqmt)"}
                        yAxisTitle={"Consumption (kwh)"}
                        data={[{
                            label: "Area Wise Consumption",
                            data: chartdata.scatterdataarea[0].data,
                            backgroundColor: "#007BFF"
                        }]}

                    />
                </Card>
                </Grid>
            )

        } else {
            return (
                <Grid item sm={6}>
                < Card  style={{ height: "450px"}}>
                        <Typography variant="heading-01-xs" color='secondary'value={t("Area Wise Consumption")} />
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="flex items-center justify-center">
                        <Typography variant="heading-02-sm" value={t("No Data")}> </Typography>
                        </div>

                </Card>
                </Grid>
            )
        }
    }

    const renderboxplotdata = () => {
        if (chartdata.boxplotdata.length > 0) {
            return (
                < Card  style={{ height: "450px", width: "99.5%", padding: "10px" }}>
                    <HighCharts
                        charttype={"boxplot"}
                        chartTitle={"Consumption-Product"}
                        categories={chartdata.boxplotdata[0].data.map(val => val.x)}
                        xAxisTitle={"Products"}
                        yAxisTitle={"Consumption (kWh)"}
                        legend={true}
                        series={[{
                            name: 'Observations',
                            data:
                                chartdata.boxplotdata[0].data.map(val => val.y),
                            tooltip: {
                                headerFormat: '<em>{point.key}</em><br/>'
                            },
                            type: 'boxplot'

                        },

                        {
                            type: 'line',
                            name: 'Expected Value',
                            data: props.averagetype === 1 ? autoaverage : manualaverage,
                            marker: {
                                lineWidth: 2,
                                lineColor: "#28BD41",
                                fillColor: 'white'

                            },
                            lineColor: '#28BD41'

                        }

                        ]}
                    />

                </Card>
            )

        } else {
            return (
                < Card >
                    <div style={{ padding: 10 }}>
                        <Typography variant="heading-01-xs" color='secondary' value={t("Consumption-Product")} />
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className="flex items-center justify-center">
                        <Typography variant="heading-02-sm" value="No Data"> </Typography>
                        </div>

                    </div>
                </Card>
            )
        }
    }


    return (
        <div  className="p-4" >
            {props.headPlant.energy_asset !== null ?
                <React.Fragment>
                    {loading && <LinearProgress></LinearProgress>}
                    {
                        <div>
                            <div style={{ backgroundColor:curTheme==='dark'?'#000000': ""}}>
                                <Grid container spacing={4}>
                                {renderscatterdatatonnage()}
                                {renderscatterdataarea()}
                                </Grid>
                             
                            </div>
                            <div style={{ marginTop: "16px" }}>
                                {renderboxplotdata()}
                            </div>
                        </div>}
                </React.Fragment>
                :
             
                <Grid item xs={12} >
                    <div className="flex items-center justify-center">
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <Typography style={{ color: theme.colorPalette.primary }}
                    value={t('Add Energy Asset in Setting screen to view the dashboard')} />
                    </div>
                   </Grid>}
        </div>

    )
}