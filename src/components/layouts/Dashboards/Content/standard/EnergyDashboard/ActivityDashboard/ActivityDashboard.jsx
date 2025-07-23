/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import EnhancedTable from "components/Table/Table";
import Typography from "components/Core/Typography/TypographyNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import ApexCharts from 'apexcharts';
import { themeMode } from "recoilStore/atoms";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"

import useProductOutageList from "../../hooks/useProductOutage";
import common from "../components/common";

import useVirtualInstrumentFormula from "../hooks/useVirtualInstrumentFormula";
import Apexcharts from "../components/ApexCharts/ApexChart";
import useEnergyDay from "../hooks/usegetEnergyDay"
export default function ActivityDashboard(props) {

    const { t } = useTranslation();
    const [curTheme] = useRecoilState(themeMode);
    const [startrange, setstartrange] = useState(new Date())
    const [endrange, setendrange] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [tabledata, setTableData] = useState([])//NOSONAR
    const [, setproductoutageenergy] = useState([])//NOSONAR
    const [initialmonthprodenergy, setinitialmonthprodenergy] = useState([])
    const [monthprodenergy, setmonthprodenergy] = useState([])
    const [dayWiseprodenergy, setdayWiseprodenergy] = useState([])
    const [prodWiseDayEnergy, setprodWiseDayEnergy] = useState([])
    const [selectedmonth, setselectedMonth] = useState('')//NOSONAR
    const [selectedday, setselectedday] = useState('')
    const [selectedmonthindex, setselectedMonthIndex] = useState(-1)//NOSONAR
    const [selecteddayindex, setselectedDayIndex] = useState(-1)//NOSONAR
    const [showdaywisechart, setshowdaywisechart] = useState(false)
    const [showprodwisechart, setshowprodwisechart] = useState(false)
    const [, setdurations] = useState([])//NOSONAR
    const [productoutage, setproductoutage] = useState([])


    const { productoutagelistLoading, productoutagelistdata, productoutagelisterror, getProductOutageList } = useProductOutageList()
    const { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula } = useVirtualInstrumentFormula()
    const { energydayLoading, energydayData, energydayError, getEnergyDay } = useEnergyDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const headCells = [
        {
            id: 'Date',
            numeric: false,
            disablePadding: true,
            label: t('Date'),
        },
        {
            id: 'StartTime',
            numeric: false,
            disablePadding: true,
            label: t('Start Time'),
        },
        {
            id: 'EndTime',
            numeric: false,
            disablePadding: false,
            label: t('End Time'),
        },
        {
            id: 'Product',
            numeric: false,
            disablePadding: false,
            label: t('Product'),
        },
        {
            id: 'DowntimeReason',
            numeric: false,
            disablePadding: false,
            label: t('Downtime Reason'),
        },
        {
            id: 'Duration',
            numeric: false,
            disablePadding: false,
            label: t('Duration'),
        },
        {
            id: 'Kwh',
            numeric: false,
            disablePadding: false,
            label: t('Kwh'),
        }


    ];

    const getDates = (month, year) => {

        let days = new Date(year, month + 1, 0).getDate()

        return  Array.from(new Array(days), (val, index) => { return { "day": moment(new Date(year, month, index + 1)).format("DD MMM"), "energy": 0, "products": [] } });

    }
    const processedrows = (prodoutageenergymappeddata) => {
        let temptabledata = []
        if (prodoutageenergymappeddata && prodoutageenergymappeddata.length > 0) {
            prodoutageenergymappeddata.forEach((val) => {
                if (val) {
                    temptabledata.push([
                        val.start_dt ? moment(val.start_dt).format("DD/MM/YYYY") : '-',
                        val.start_dt ? moment(val.start_dt).format("HH:mm:ss") : '-',
                        val.end_dt ? moment(val.end_dt).format("HH:mm:ss") : "-",
                        val.prod_order && val.prod_order.prod_product ? val.prod_order.prod_product.name : "",
                        val.prod_reason && val.prod_reason.reason ? val.prod_reason.reason : "-",
                        moment.utc(moment(val.end_dt).diff(moment(val.start_dt))).format("HH:mm:ss"),
                        val.energy ? val.energy.toFixed(3) : 0
                    ]);
                }
            });
            

        }


        setTableData(temptabledata)
        setLoading(false)
    }


    const getDurations = (productoutagelist) => {
        setLoading(true)
        let durations = []
        setshowdaywisechart(false)
        setshowprodwisechart(false)
        productoutagelist.map((val) => {

            if (val.prod_order && val.prod_order.prod_product) {
                if (props.products.includes(val.prod_order.prod_product.id)) {//NOSONAR
                    let index = durations.findIndex(d => (new Date(d.start).getTime() === new Date(val.start_dt).getTime()) &&
                        (new Date(d.end).getTime() === new Date(val.end_dt).getTime()))
                    if (index === -1) {
                        durations.push({ start: val.start_dt, end: val.end_dt })
                    }

                }
            }
        })

        if (durations.length > 0 && VirtualInstrumentFormuladata && VirtualInstrumentFormuladata.length > 0) {
            let finalrequestarray = []
            VirtualInstrumentFormuladata.map((val) => {
                let values = common.getVirtualInstrumentInfo(val, props.typelist)//NOSONAR
                finalrequestarray.push({ "start": startrange, "end": endrange, "type": values[2], "metrics": values[1], "instruments": values[0], "viid": val })

            })
            getEnergyDay(finalrequestarray, durations, [])
        }
        else {

            setLoading(false)
            setmonthprodenergy([])
            setTableData([])
        }
        setdurations(durations)
    }

    useEffect(() => {
        if (productoutage && props.nodes.length > 0) {//NOSONAR
            getDurations(productoutage)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.products.length, props.nodes.length])//NOSONAR


    useEffect(() => {

        if (!productoutagelistLoading && productoutagelistdata && !productoutagelisterror) {
            setproductoutage(productoutagelistdata)
            getDurations(productoutagelistdata)
            //processedrows()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productoutagelistLoading, productoutagelistdata, productoutagelisterror])

    function setRange() {
        try {
            let startranges;
            let endranges;
            startranges = moment([props.year]).startOf('year').format('YYYY-MM-DDTHH:mm:ssZ')//NOSONAR
            endranges = moment([props.year]).endOf('year').format('YYYY-MM-DDTHH:mm:ssZ')//NOSONAR
            setstartrange(startranges)
            setendrange(endranges)
            getProductOutageList(startranges, endranges, props.headPlant.id)//NOSONAR
        } catch (err) {

            setLoading(false)
            console.log("Error in setRange - ProductDB", err)
        }

    }


    useEffect(() => {

        if (!VirtualInstrumentFormulaLoading && VirtualInstrumentFormuladata && !VirtualInstrumentFormulaerror) {
            setLoading(true)
            setRange()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror])

    useEffect(() => {


        getVirtualInstrumentFormula(props.nodes)//NOSONAR
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.year, props.nodes.length, props.headPlant.id])//NOSONAR


    useEffect(() => {
        let tempmonthprodenergy = []
        monthNames.forEach((val, index) => {
            tempmonthprodenergy.push({ "month": index, "monthName": val, "dayWiseData": getDates(index, props.year), "totalEnergy": 0 });
        });
        

        setinitialmonthprodenergy(tempmonthprodenergy)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.year])


    useEffect(() => {
        if (!energydayLoading && energydayData && !energydayError) {
            if (energydayData.length > 0) {
                const energydata = energydayData.map(e => e.dayData).flat(Infinity) //Should check the function authenticity
                let selectedprodoutage = productoutage.filter((x) => props.products.includes(x.prod_order.prod_product.id))//NOSONAR

                let prodoutageenergymappeddata = []
                selectedprodoutage.forEach((val, index) => {
                    energydata.forEach((item) => {
                        if (new Date(item.time).getTime() >= new Date(val.start_dt).getTime() && new Date(item.time).getTime() < new Date(val.end_dt).getTime()) {
                
                            let prodIndex = prodoutageenergymappeddata.findIndex((prod) => {
                                return (new Date(prod.rawtime).getTime() === new Date(item.time).getTime())
                            })
                            if (prodIndex === -1) {
                                prodoutageenergymappeddata.push(Object.assign({}, val, { "energy": item.value, "time": moment(item.time).format("DD MMM"), "readings": [item.value], "rawtime": item.time, "iid": [].concat([item.iid]) }))//NOSONAR
                            }
                            else {
                                if (prodoutageenergymappeddata[prodIndex].iid.findIndex(i => i === item.iid) < 0) {//NOSONAR
                                    prodoutageenergymappeddata[prodIndex].iid.push(item.iid)
                                    prodoutageenergymappeddata[prodIndex].energy = prodoutageenergymappeddata[prodIndex].energy + item.value
                                    prodoutageenergymappeddata[prodIndex].readings.push(item.value)
                                }
                            }
                        }
                    })
                });
                
                let monthproductenergydata = JSON.parse(JSON.stringify(initialmonthprodenergy));



                prodoutageenergymappeddata.forEach((val) => {
                    let index = monthproductenergydata.findIndex(x => x.month === new Date(val.time).getMonth());
                    if (index === -1) {
                        if (val.time) monthproductenergydata.push(
                            {
                                "month": new Date(val.time).getMonth(),
                                "dayWiseData": [{
                                    "day": val.time,
                                    "energy": val.energy,
                                }],
                                "totalEnergy": val.energy,
                                "monthName": monthNames[new Date(val.time).getMonth()],
                            }
                        );
                    } else {
                        let day = monthproductenergydata[index].dayWiseData.findIndex(y => y.day === val.time);
                        if (day === -1) {
                            monthproductenergydata[index].dayWiseData.push(
                                {
                                    "day": val.time,
                                    "energy": val.energy,
                                    "products": [],
                                }
                            );
                        } else {
                            let productindex = monthproductenergydata[index].dayWiseData[day].products.findIndex(p => p.productId === val.prod_order.prod_product.id);
                            if (productindex === -1) {
                                monthproductenergydata[index].dayWiseData[day].products.push(
                                    {
                                        "productId": val.prod_order.prod_product.id,
                                        "productenergy": val.energy,
                                        "productName": val.prod_order.prod_product.name,
                                        "durations": [{
                                            "time": val.rawtime,
                                            "energy": val.energy,
                                            "start": val.start_dt,
                                            "end": val.end_dt,
                                            "index": 1
                                        }]
                                    }
                                );
                            } else {
                                monthproductenergydata[index].dayWiseData[day].products[productindex].productenergy += val.energy;
                                monthproductenergydata[index].dayWiseData[day].products[productindex].durations.push({
                                    "time": val.rawtime,
                                    "energy": val.energy,
                                    "start": val.start_dt,
                                    "end": val.end_dt,
                                    "index": monthproductenergydata[index].dayWiseData[day].products[productindex].durations.length + 1
                                });
                            }
                            monthproductenergydata[index].dayWiseData[day].energy += val.energy;
                            monthproductenergydata[index].totalEnergy += val.energy;
                        }
                    }
                });
                


                setmonthprodenergy(monthproductenergydata)
                try {
                    ApexCharts.exec('MonthwiseChart', "updateOptions", {
                        states: {
                            normal: {
                                filter: {
                                    type: 'none',
                                    value: 0,
                                }
                            }, hover: {
                                filter: {
                                    type: 'lighten',
                                    value: 0.15,
                                }
                            },
                            active: {
                                allowMultipleDataPointsSelection: false,
                                filter: {
                                    type: 'darken',
                                    value: 0.35,
                                }
                            },

                        },
                    })
                } catch (err) { console.log("Error at Product SQMT Chart Mounting", err) }
                setproductoutageenergy(prodoutageenergymappeddata)
                processedrows(prodoutageenergymappeddata)
                setLoading(false)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energydayLoading, energydayData, energydayError])




    const showdayWiseData = (month, show) => {
        setshowdaywisechart(show)
        setshowprodwisechart(false)
        setselectedMonth(monthNames[month])
        setselectedMonthIndex(month)
        setdayWiseprodenergy(monthprodenergy[month].dayWiseData)
        ApexCharts.exec('DaywiseChart', "updateOptions", {
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0,
                    }
                }, hover: {
                    filter: {
                        type: 'lighten',
                        value: 0.15,
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0,
                    }
                },

            },
        })
    }
    const showprodWiseData = (day, show) => {
        setshowprodwisechart(show)
        setselectedDayIndex(day)
        setselectedday(monthprodenergy[selectedmonthindex].dayWiseData[day].day)
        setprodWiseDayEnergy(monthprodenergy[selectedmonthindex].dayWiseData[day].products)
        ApexCharts.exec('ProductwiseChart', "updateOptions", {
            states: {
                normal: {
                    filter: {
                        type: 'none',
                        value: 0,
                    }
                }, hover: {
                    filter: {
                        type: 'lighten',
                        value: 0.15,
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'none',
                        value: 0,
                    }
                },

            },
        })
    }

    const monthchartdatapointSelection = (event, chartContext, config) => {
        const dataPoint = config.dataPointIndex;

        if (selectedmonthindex === dataPoint) {

            showdayWiseData(dataPoint, !showdaywisechart);
        }
        else {

            showdayWiseData(dataPoint, true);
            ApexCharts.exec('MonthwiseChart', "updateOptions", {
                states: {
                    normal: {
                        filter: {
                            type: 'lighten',
                            value: 0.5,
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'darken',
                            value: 1,
                        }
                    },
                },
            })
        }
    }


    const daychartdatapointSelection = (event, chartContext, config) => {
        const dataPoint = config.dataPointIndex;

        if (selecteddayindex === dataPoint) {

            showprodWiseData(dataPoint, !showprodwisechart);
        }
        else {

            showprodWiseData(dataPoint, true);

            ApexCharts.exec('DaywiseChart', "updateOptions", {
                states: {
                    normal: {
                        filter: {
                            type: 'lighten',
                            value: 0.5,
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: false,
                        filter: {
                            type: 'darken',
                            value: 1,
                        }
                    },
                },
            })
        }
    }


    return (

        <React.Fragment>
            {loading && <LoadingScreenNDL />}
            <div className="p-4">
            <KpiCards  >
                <div className="flex items-center">
                    <Typography variant="heading-01-xs" color='secondary' value={t("Downtime Details")} />
                </div>

                {tabledata.length > 0 &&
                    <EnhancedTable
                        headCells={headCells}
                        data={tabledata}
                        download={true}
                        search={true}
                        rawdata={productoutagelistdata}

                    />
                }

            </KpiCards>
            {monthprodenergy.length > 0 &&
                <KpiCards  >
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }}>

                        <Typography variant="heading-01-xs" color='secondary' value={t("Downtime Energy Consumption - Monthwise")} />
                      
                    </div>




                    <Apexcharts
                        theme={curTheme}
                        height={350}
                        chartid={"MonthwiseChart"}
                        charttype={"bar"}
                        dataPointSelection={(event, chartContext, config) => monthchartdatapointSelection(event, chartContext, config)}
                        colors={["#FFCC00", "#FF6682", "#6CE07F", "#FF2E54", "#5957D6", "#FF9500", "#FF382E", "#8584E1", "#4AD962", "#FFE066", "#007BFF", "#08ABF7"]}
                        categories={monthprodenergy.map(val => val.monthName)}
                        yAxisTitle={"Consumption(kWh)"}
                        xAxisTooltip={(value, series, seriesIndex, dataPointIndex, w) => { return "Energy" }}
                        yAxixTooltipTitle={(value, series, seriesIndex, dataPointIndex, w) => monthNames[dataPointIndex] + " : "}
                        yAxisTooltipValue={(value, series, seriesIndex, dataPointIndex, w) => value.toFixed(3)
                        }
                        series={[{
                            data: monthprodenergy.map(val => val.totalEnergy)
                        }]}
                        legend={true}
                    />


                </KpiCards>
            }
            {showdaywisechart &&
                <KpiCards >
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }}>
                        <Typography variant="heading-01-xs" color='secondary'  value={t("Downtime Energy Consumption - Daywise") + "(" + selectedmonth + ")"} />
                        
                    </div>


                    <Apexcharts
                        theme={curTheme}
                        height={350}
                        chartid={"DaywiseChart"}
                        charttype={"bar"}
                        dataPointSelection={(event, chartContext, config) => daychartdatapointSelection(event, chartContext, config)}
                        categories={dayWiseprodenergy.map(val => val.day)}
                        yAxisTitle={"Consumption(kWh)"}
                        xAxisTooltip={(value, series, seriesIndex, dataPointIndex, w) => { return "Energy" }}
                        yAxixTooltipTitle={(value, series, seriesIndex, dataPointIndex, w) => w.config.xaxis.categories[dataPointIndex] + " : "}
                        yAxisTooltipValue={(value, series, seriesIndex, dataPointIndex, w) =>
                            value.toFixed(3)}
                        series={[{
                            data: dayWiseprodenergy.map(val => val.energy)
                        }]}
                        legend={false}
                    />

                </KpiCards>
            }
            {showprodwisechart &&
                <KpiCards >
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: "10px" }}>

                        <Typography variant="heading-01-xs" color='secondary' value={t("Downtime Energy Consumption - Product") + "(" + moment(new Date(selectedday)).format("DD/MM/" + props.year) + ")"} />
                     
                    </div>


                    <Apexcharts
                        theme={curTheme}
                        height={350}
                        chartid={"ProductwiseChart"}
                        charttype={"bar"}
                        categories={prodWiseDayEnergy.map(val => val.productName)}
                        yAxisTitle={"Consumption(kWh)"}
                        xAxisTooltip={(value, series, seriesIndex, dataPointIndex, w) => { return "Energy" }}
                        yAxixTooltipTitle={(value, series, seriesIndex, dataPointIndex, w) => w.config.xaxis.categories[dataPointIndex] + " : "}
                        yAxisTooltipValue={(value, series, seriesIndex, dataPointIndex, w) =>
                            value.toFixed(3)
                        }
                        series={[{
                            data: prodWiseDayEnergy.map(val => val.productenergy)
                        }]}
                        legend={true}
                    />

                </KpiCards>
            }
            </div>
       
        </React.Fragment>
    )
}

