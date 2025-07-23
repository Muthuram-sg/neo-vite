/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import { selectedPlant, themeMode, SQMTRange, ActivityWise, ProductList, prodsqmtloading } from "recoilStore/atoms";
import moment from 'moment';
import { useRecoilState } from "recoil";
import Card from "components/Core/KPICards/KpiCardsNDL";
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL"; 
import LinearProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import { useTranslation } from "react-i18next";
import ApexCharts from 'apexcharts';
import common from "../components/common";
import useProductQuantityList from "../hooks/useProductQuantity";
import useVirtualInstrumentFormula from "../hooks/useVirtualInstrumentFormula";
import Apexcharts from "../components/ApexCharts/ApexChart";
import useEnergyDay from "../hooks/usegetEnergyDay";
import useGetEnergybysplitday from "../hooks/usegetEnergyBysplitDay"
import ProductTabCommon from "./components/common";
import PrimaryChart from "./components/PrimaryChart";
import useGetAllInstrument from "../hooks/useGetAllInstrument";
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import * as XLSX from 'xlsx';


export default function ProductDashboard(props) {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant)
    const [curTheme] = useRecoilState(themeMode);
    const [loading, setLoading] = useRecoilState(prodsqmtloading)
    const [Shiftloading, setShiftLoading] = useState(false)
    const [initialmonthprodenergy, setinitialmonthprodenergy] = useState([])
    const [monthprodenergy, setmonthprodenergy] = useState([])
    const [monthprodenergyShiftwise, setmonthprodenergyShiftwise] = useState([])
    const [dayWiseprodenergy, setdayWiseprodenergy] = useState([])
    const [Shiftwiseprodenergy, setShiftwiseprodenergy] = useState([])
    const [selectedmonth, setselectedMonth] = useState('')
    const [selectedmonthindex, setselectedMonthIndex] = useState(-1)
    const [showdaywisechart, setshowdaywisechart] = useState(false)
    const [showprimarygrouping, setshowprimarygrouping] = useState(false)
    const [showsecondarygrouping, setshowsecondarygrouping] = useState(false)
    const [prodquantity, setprodquantitydata] = useState([])
    const [ProdSqmtRange] = useRecoilState(SQMTRange);
    const [ActivityValue] = useRecoilState(ActivityWise)
    const [OverallSwitchIndex, setOverallSwitchIndex] = useState(0);
    const [flowIndex, setflowIndex] = useState(0);
    const [primaryfiltercategories, setprimaryfiltercategories] = useState([])
    const [secondaryfiltercategories, setsecondaryfiltercategories] = useState([])
    const [primarygroupingdata, setprimarygroupingdata] = useState([])
    const [secondarygroupingdata, setsecondarygroupingdata] = useState([])
    const [showteritiarygrouping, setshowteritiarygrouping] = useState(false) 
    const [products] = useRecoilState(ProductList)
    const [selectedFamily, setselectedFamily] = useState("")
    const [activitychartdata, setActivityChartData] = useState({ "Data": [], "labels": [] })
    const [selectedNode, setSelectedNode] = useState({})
    const [ChildNodeData, setChildNodeData] = useState([])
    const [showChildren, setshowChildren] = useState(false)
    const [factor, setfactor] = useState(1)
    const [selectedActivity, setselectedActivity] = useState('')
    const [nodata, setnodata] = useState(false)
    const [allInstrumentList,setallInstrumentList] = useState([])
    const [MonthExcelData,setMonthExcelData]= useState([])
     

    const { productquantitylistLoading, productquantitylistdata, productquantitylisterror, getProductQuantityList } = useProductQuantityList()
    const { VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror, getVirtualInstrumentFormula } = useVirtualInstrumentFormula() 
    const {energybysplitdayLoading, energybysplitdayData, energybysplitdayError,getenergybysplitday} = useGetEnergybysplitday()
    const {  InstrumentListLoading, InstrumentListData, InstrumentListError, getInstrumentList } = useGetAllInstrument()

    const downloadExcel = (data, name) => {
        const headers = ["Date", "Shift Name", "Start Date", "End Date","Prod Name","Energy","Event","Value"];
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name + ".xlsx");
    };

    useEffect(()=>{
        getInstrumentList()
    },[])

    //Step 1 - On landing on the tab , this useffect gets triggered
    useEffect(() => {

        try {
            //If product node data is already loaded , we simply call the setRange function that trigger Production Event list for selected Range
            if (VirtualInstrumentFormuladata && VirtualInstrumentFormuladata.length > 0) {
                if (ProdSqmtRange.start && ProdSqmtRange.end) {
                    setLoading(true)
                    setShiftLoading(true)
                    setRange()
                }

            }

            //Else we first get the product node details from here
            else {

                if (headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.nodes && headPlant.node.product_energy.nodes.length > 0) {
                    getVirtualInstrumentFormula(headPlant.node.product_energy.nodes.map(productnode => productnode.id))
                }

            }


            if (headPlant.node && headPlant.node.product_energy) {
                setfactor(headPlant.node.product_energy.unit)
            }

        } catch (err) {
            console.log("error at useEffect headPlant,prodsqmt", err)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id, ProdSqmtRange])



    //Step 2 - We fetch the product nodes and try and get the Product Event List here - This is becuase , we should not show the tab if no node is configured
    useEffect(() => {

        try {
            if (!VirtualInstrumentFormulaLoading && VirtualInstrumentFormuladata && !VirtualInstrumentFormulaerror) {
                setLoading(true)
                setShiftLoading(true)
                setRange()
            }
        } catch (err) {
            console.log("error at useEffect-Virtual Instrument Product Tab", err)
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [VirtualInstrumentFormulaLoading, VirtualInstrumentFormuladata, VirtualInstrumentFormulaerror])

    const convertTime = (time) => {
        let st = new Date(
          moment().format(
            `YYYY-MM-DDT` + time
          ) + "Z"
        );
        let st1 = st.toLocaleTimeString("en-GB");
        let st2 = st1.split(":");
        return `${st2[0]}:${st2[1]}`;
      }

    //Step 3 - Fetch events for selected Range
    function setRange() {
        try {
            let startrange;
            let endrange;
            // console.log(headPlant,"headPlantheadPlant")
            
            startrange = moment(ProdSqmtRange.start).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
            endrange = moment(ProdSqmtRange.end).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ')
            if(headPlant.shift.ShiftType === "Daily"){
                let shifttime = convertTime(headPlant.shift.shifts[headPlant.shift.shifts.length -1].endDate)
                let endTime = shifttime.split(":")
                startrange = moment(ProdSqmtRange.start).startOf('day').add(Number(endTime[0]),'hour').add(Number(endTime[1]),'minutes').format('YYYY-MM-DDTHH:mm:ssZ')
                endrange = moment(ProdSqmtRange.end).endOf('day').add(Number(endTime[0]),'hour').add(Number(endTime[1]),'minutes').format('YYYY-MM-DDTHH:mm:ssZ')
            }
            // console.log("shifttimeshifttime",startrange,endrange)
            getProductQuantityList(startrange, endrange, headPlant.id)
        } catch (err) {
            setLoading(false)
            setShiftLoading(false)
            console.log("Error in setRange - ProductDB", err)
        }

    }
  
      
    //Step 4 - Fetch event list for selected Range .
    useEffect(() => {
        try {
            if ((!productquantitylisterror && !productquantitylistLoading && productquantitylistdata)) {
                    let shitfDates =  productquantitylistdata.filter(p => {
                        // console.log(p,"p")
                        if( p.info && Object.keys(p.info).length > 0 && 'shitfdate' in p.info && p.info.shitfdate){
                     return  p
                        }
                    }
                    )
                let filterprodquantitydata = []
                filterprodquantitydata = shitfDates.filter(p => (new Date(moment(p.info.shitfdate).startOf("day")).getTime() >= new Date(moment(ProdSqmtRange.start).startOf("day")).getTime()) && (new Date(moment(p.info.shitfdate).startOf("day")).getTime() <= new Date(moment(ProdSqmtRange.end).endOf("day")).getTime()))
                setprodquantitydata(filterprodquantitydata)
            } else if (productquantitylisterror) {
                setLoading(false)
            }

        } catch (err) {
            console.log("Error at ProductQuantity useEffect", err)
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productquantitylistLoading, productquantitylistdata, productquantitylisterror])


    //Step 5 - Set Product Event List and Trigger the getDurations function to fetch event start and end time
    useEffect(() => {
        try {
            setmonthprodenergy([])
            setshowteritiarygrouping(false)
            setshowprimarygrouping(false)
            setshowsecondarygrouping(false)
            setshowChildren(false)
            setshowdaywisechart(false)
            if (prodquantity && props.selectedproducts.length > 0) {
                getDurations(prodquantity)
            } else {
                // console.log("p4")
                setLoading(false)
                setmonthprodenergy([])
                setmonthprodenergyShiftwise([])
            }
        } catch (err) {
            console.log("error in useeffect prodquantity", err)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedproducts, prodquantity, ActivityValue])

    useEffect(()=>{
        if(!InstrumentListLoading &&  InstrumentListData && !InstrumentListError){
            // console.log(InstrumentListData,"InstrumentListData")
           setallInstrumentList(InstrumentListData)

        }
    },[InstrumentListLoading, InstrumentListData, InstrumentListError])
    //Step 6 - Fetch the events start and end times so that we can get the energy consumption values
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
    const getDurations = (productquantitylist) => {
        try {
            setLoading(true)
            setShiftLoading(true)
            let durations = []
            setshowdaywisechart(false)

            //Filter the Products based on the selected Primary Filter(Product or Characteristics)
            let filteredlist = filterproducts(productquantitylist)
            // console .log(filteredlist,"productquantitylist",productquantitylist)
            //Make the array of durations for the filtered product events
            filteredlist.map((val, index) => {

                //avoiding duplicate durations
                if (durations.findIndex(d => new Date(d.start).getTime() === new Date(val.start_dt).getTime() &&
                    new Date(d.end).getTime() === new Date(val.end_dt).getTime()) < 0) {
                    durations.push({ start: val.start_dt, end: val.end_dt })
                }
        //    console.log("durations",durations)
            })
            let dates = common.splitDatesMonthWise(ProdSqmtRange.start, ProdSqmtRange.end)
            //Trigger the energydashday API to fetch energydata values
            // console.log(durations,VirtualInstrumentFormuladata,"VirtualInstrumentFormuladata",dates)
            if (durations.length > 0 && VirtualInstrumentFormuladata && VirtualInstrumentFormuladata.length > 0) {
                let finalrequestarray = []
                VirtualInstrumentFormuladata.map((val) => {
                    let values = common.getVirtualInstrumentInfo(val, props.typelist)
                    // finalrequestarray.push({ "start": moment(ProdSqmtRange.start).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'), "end": moment(ProdSqmtRange.end).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'), "type": values[2], "metrics": values[1], "instruments": values[0], "viid": val })
                    dates.forEach(d=>{
                        finalrequestarray.push({ "start": moment(d.start).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ'), "end": moment(d.end).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'), "type": values[2], "metrics": values[1], "instruments": values[0], "viid": val })
                    })
                    
                    // getenergybysplitday
                })
                getenergybysplitday(finalrequestarray, durations, [], true,true,VirtualInstrumentFormuladata)
                // getEnergyDay(finalrequestarray, durations, [], true,true)

            }
            else {
                setLoading(false)
                setShiftLoading(false)
                setmonthprodenergy([])
                setmonthprodenergyShiftwise([])
            }
        }
        catch (err) {
            setLoading(false)
            console.log("Error at get Durations Product Tab", err)
        }
    }



    //common function to fetch the filtervalues

    function filterproducts(productquantitylist) {

        try {
        let filteredlist = []
        let prodids = props.selectedproducts.map(p => p.id)
        let filterName = ProductTabCommon.getPrimaryFilterName(headPlant)

            if (headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.primary !== 2) {
                console.log("callingIFFF")
                filteredlist = productquantitylist.filter(p => prodids.findIndex(pid => pid === p.prod_order.prod_product.id) >= 0);
            }

            else {
                console.log("callingELSEEE")
                let filteredproducts = products.filter(p => props.selectedproducts.findIndex(pid => p.info && pid.name === p.info[filterName]) >= 0)
                filteredlist = productquantitylist.filter(p => filteredproducts.findIndex(pid => pid.id === p.prod_order.prod_product.id) >= 0)
            }
            console.log("filteredlistCheck",filteredlist)
            return filteredlist
        } catch (err) {
            console.log("Error at FilterProducts function-Product Tab ED", err)
            return []
        }

    }




    //Process Activity wise energydata
    function ActivityEnergyData(productenergydata, ActiveWise) {


        try {


            let TotalShifts = []
            let aggregatedActiveEnergydata = ActiveWise.map(v => {
                let aggregatedproductenergydata = []
                v.data.map((val) => {

                    //AddShifts
                    if (val.info && val.info.Shift) {
                        let shiftIndex = TotalShifts.findIndex(s => s.name === val.info.Shift)
                        if (shiftIndex < 0) {
                            TotalShifts.push({ name: val.info.Shift })
                        }
                    }

                    let index = aggregatedproductenergydata.findIndex(i => (i.prod_order_id === val.prod_order.order_id) && (i.prod_product_id === val.prod_order.prod_product.id) && ((i.start_dt === val.start_dt) || (i.end_dt === val.end_dt)))
                    if (index < 0) {
                        aggregatedproductenergydata.push(
                            {
                                "start_dt": val.start_dt,
                                "end_dt": val.end_dt,
                                "prod_order_id": val.prod_order.order_id,
                                "prod_product_id": val.prod_order.prod_product.id,
                                "prod_product_name": val.prod_order.prod_product.name,
                                "prod_product_info": val.prod_order.prod_product.info,
                                "info": {
                                    "Length": [val.info ? val.info.Length : 0], "Width": [val.info ? val.info.Width : 0], "Thickness": [val.info ? val.info.Thickness : 0],
                                    "Quantity": [val.info ? val.info.Quantity : 0], "Weight": [val.info ? val.info.Weight : 0],
                                    "Value": [val.info && val.info.Value && isFinite(val.info.Value) ? Number(val.info.Value) : 0],
                                    "Event": [val.info ? val.info.Event : ''],

                                },
                                "shiftdate": val.info && val.info.shitfdate
                                    ? val.info.shitfdate
                                    : undefined,
                                "Shift": val.info && val.info.Shift ? val.info.Shift : undefined
                            })
                    }
                    else {
                        aggregatedproductenergydata[index].info.Event.push(val.info ? val.info.Event : '')
                        aggregatedproductenergydata[index].info.Length.push(val.info ? val.info.Length : 0)
                        aggregatedproductenergydata[index].info.Width.push(val.info ? val.info.Width : 0)
                        aggregatedproductenergydata[index].info.Thickness.push(val.info ? val.info.Thickness : 0)
                        aggregatedproductenergydata[index].info.Quantity.push(val.info ? val.info.Quantity : 0)
                        aggregatedproductenergydata[index].info.Weight.push(val.info ? val.info.Weight : 0)
                        aggregatedproductenergydata[index].info.Value.push(val.info && val.info.Value && isFinite(val.info.Value) ? Number(val.info.Value) : 0)

                    }
                })
                return { ...v, data: aggregatedproductenergydata }
            })
            return [aggregatedActiveEnergydata, TotalShifts]
        } catch (err) {
            console.log("Erorr at ActivityEnergyData processing Product SQMT ", err)
            return [[], []]
        }

    }





    //Map energy to product
    function ProductEnergyMapping(aggregatedActiveEnergydata) {
        try {
            let Actenergymappeddata = []

            aggregatedActiveEnergydata.map(v => {

                v.data.map((val, index) => {
                    let prodenergymappeddata = []
                    let totalNodeEnergy = 0
                    energybysplitdayData.map((energy, energyindex) => {

                        const energydata = energy.dayData ? energy.dayData.flat(1) : []
                        let instru = []
                        if (energy.vi) {
                            instru = [...new Set(common.getVirtualInstrumentInfo(energy.vi, [])[0].split(","))]
                        } else {
                            instru = []
                        }
                        energydata.map((item) => {
                            if (new Date(item.time).getTime() === (new Date(val.start_dt)).getTime()) {
                                //Check for the node record for that time
                                let prodIndex = prodenergymappeddata.findIndex((prod) => {
                                    return (new Date(prod.rawtime).getTime() === new Date(item.time).getTime() && prod.productnode.id === energy.vi.id)
                                })
                                if (prodIndex === -1) {

                                    prodenergymappeddata.push(
                                        {
                                            "productnode": energy.vi,
                                            "energy": item.value,
                                            "time": moment(item.time).format("DD MMM"),
                                            "readings": [item.value],
                                            "rawtime": item.time,
                                            "instruments": [].concat(instru.map(iid => { return ({ "name": iid, "energy": iid === item.iid ? item.value : 0, "time": moment(item.time).format('ll'), "label": energy.vi.name }) }))
                                        })

                                }
                                else {
                                    if (prodenergymappeddata[prodIndex].instruments.findIndex(i => i.name === item.iid) < 0) {
                                        prodenergymappeddata[prodIndex].instruments.push({
                                            "name": item.iid, "energy": item.value,
                                            "time": moment(item.time).format('ll'), "label": energy.vi.name
                                        })

                                    } else {
                                        prodenergymappeddata[prodIndex].instruments[prodenergymappeddata[prodIndex].instruments.findIndex(i => i.name === item.iid)].energy = prodenergymappeddata[prodIndex].instruments[prodenergymappeddata[prodIndex].instruments.findIndex(i => i.name === item.iid)].energy + item.value
                                    }
                                    prodenergymappeddata[prodIndex].energy = prodenergymappeddata[prodIndex].energy + item.value
                                    prodenergymappeddata[prodIndex].readings.push(item.value)


                                }
                            }
                        })


                    })

                    if (prodenergymappeddata.length > 0) {
                        totalNodeEnergy = prodenergymappeddata.reduce(
                            (accumulator, currentValue) => accumulator + Number(currentValue.energy),
                            0,
                        )
                        let event_present = Actenergymappeddata.findIndex(event => event.Event_name === v.Event_name)
                        if (event_present >= 0) {
                            Actenergymappeddata[event_present].productnodeenergydata.push(Object.assign({}, val, { "data": prodenergymappeddata, "energy": totalNodeEnergy }))
                        } else {
                            Actenergymappeddata.push({ "Event_name": v.Event_name, "productnodeenergydata": [Object.assign({}, val, { "data": prodenergymappeddata, "energy": totalNodeEnergy })] })
                        }
                    }

                })

            })

            // })
            return Actenergymappeddata
        }
        catch (err) {
            console.log("Error at ProductEnergyMapping in Product Tab ED", err)
            return []
        }
    }


    //Process hierarchy structure
    function processhierarchy(Actenergymappeddata, events) {

        let overallmonthproductenergydata = JSON.parse(JSON.stringify(initialmonthprodenergy));

        let filterName = ProductTabCommon.getPrimaryFilterName(headPlant)

        // console.log(Actenergymappeddata,"Actenergymappeddata",events,overallmonthproductenergydata)

        try {
            Actenergymappeddata.map(event => {
                event.productnodeenergydata.map((val) => {
                    // v.data.map((val) => {

                    let index = overallmonthproductenergydata.findIndex(x => x.month === new Date(val.shiftdate).getMonth())
                    if (index === -1) {
                        if (val.shiftdate) {

                            overallmonthproductenergydata.push(
                                {
                                    "month": new Date(val.shiftdate).getMonth(),

                                    "dayWiseData": [{
                                        "day": moment(val.shiftdate).format("DD MMM"),//val.time,
                                        "energy": val.energy,
                                        "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                        "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                        "Event": event.Event_name
                                    }],
                                    "totalEnergy": val.energy,
                                    "monthName": ProductTabCommon.monthNames[new Date(val.shiftdate).getMonth()].name,
                                    "totalWeight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                    "totalValue": (event.Event_name === "Production" && val.info) ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                    "DTValue": (event.Event_name === "Downtime" && val.info) ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                    "Event": event.Event_name
                                }
                            )

                        }

                    }

                    else {
                        let day = overallmonthproductenergydata[index].dayWiseData.findIndex(y => y.day === moment(val.shiftdate).format("DD MMM"))
                        let primaryfilterindex
                        let primaryfilter
                        if (headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.primary !== 2) {

                            primaryfilterindex = overallmonthproductenergydata[index].primaryfilterdata.findIndex(p => p.primaryfilter === (val.prod_product_name ? val.prod_product_name : "-"))
                            primaryfilter = (val.prod_product_name ? val.prod_product_name : "-")

                        } else {
                            primaryfilterindex = overallmonthproductenergydata[index].primaryfilterdata.findIndex(p => p.primaryfilter === (val.prod_product_info[filterName] ? val.prod_product_info[filterName] : "-"))

                            primaryfilter = val.prod_product_info[filterName] ? val.prod_product_info[filterName] : "-"
                        }
                        //Family is not present
                        if (primaryfilterindex < 0) {

                            overallmonthproductenergydata[index].primaryfilterdata.push({
                                "primaryfilter": primaryfilter,
                                "eventdata": events.map(eve => {
                                    if (eve === event.Event_name) {
                                        return {
                                            "Event_name": event.Event_name,
                                            "products": [{
                                                "productId": val.prod_product_id,
                                                "productenergy": val.energy,
                                                "productName": val.prod_product_name,
                                                "productvalue": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                                //"Event": event.Event_name,
                                                "durations": [{
                                                    // "time": val.rawtime,
                                                    "energy": val.energy,
                                                    "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                                    "start": val.start_dt,
                                                    "end": val.end_dt,
                                                    "index": 1,
                                                    "Event": event.Event_name
                                                }],
                                                "productnodeenergydata": val.data.map(pn => {
                                                    return {
                                                        "productnode": pn.productnode,
                                                        "data": [{
                                                            "day": moment(val.shiftdate).format("DD MMM"),
                                                            "energy": pn.energy,
                                                            "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                            "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                            "Event": event.Event_name,
                                                            "instruments": pn.instruments,
                                                            "time": pn.time
                                                        }]
                                                    }
                                                }),

                                                // [{
                                                //     "productnode": val.productnode,
                                                //     "data": [{
                                                //         "day": moment(val.shiftdate).format("DD MMM"),
                                                //         "energy": val.energy,
                                                //         "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                //         "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                //         "Event": event.Event_name,
                                                //         "instruments": val.instruments,
                                                //         "time": val.time
                                                //     }]
                                                // }],
                                                "productinfo": val.prod_product_info

                                            }]
                                        }
                                    }
                                    else {
                                        return { "Event_name": eve, "products": [] }
                                    }

                                })
                            })


                        }

                        else {
                            let eventindex = overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata.findIndex(e => e.Event_name === event.Event_name)
                            //Event Index
                            if (eventindex < 0) {
                                overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata.push({
                                    "Event_name": event.Event_name,
                                    "products": [{
                                        "productId": val.prod_product_id,
                                        "productenergy": val.energy,
                                        "productName": val.prod_product_name,
                                        "productvalue": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                        //"Event": v.Event_name,
                                        "durations": [{
                                            //"time": val.rawtime,
                                            "energy": val.energy,
                                            "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                            "start": val.start_dt,
                                            "end": val.end_dt,
                                            "index": 1,
                                            "Event": event.Event_name
                                        }],
                                        "productnodeenergydata": val.data.map(pn => {
                                            return {
                                                "productnode": pn.productnode,
                                                "data": [{
                                                    "day": moment(val.shiftdate).format("DD MMM"),
                                                    "energy": pn.energy,
                                                    "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                    "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                    "Event": event.Event_name,
                                                    "instruments": pn.instruments,
                                                    "time": pn.time
                                                }]
                                            }
                                        }),
                                        "productinfo": val.prod_product_info

                                    }]
                                })
                            }

                            else {
                                let productIndex = overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products.findIndex(p => p.productId === val.prod_product_id)

                                //product is not present
                                if (productIndex < 0) {
                                    overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products.push({
                                        "productId": val.prod_product_id,
                                        "productenergy": val.energy,
                                        "productName": val.prod_product_name,
                                        "productvalue": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                        //"Event": event.Event_name,
                                        "durations": [{
                                            //"time": val.rawtime,
                                            "energy": val.energy,
                                            "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                            "start": val.start_dt,
                                            "end": val.end_dt,
                                            "index": 1,
                                            "Event": event.Event_name
                                        }],
                                        "productnodeenergydata": val.data.map(pn => {
                                            return {
                                                "productnode": pn.productnode,
                                                "data": [{
                                                    "day": moment(val.shiftdate).format("DD MMM"),
                                                    "energy": pn.energy,
                                                    "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                    "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                    "Event": event.Event_name,
                                                    "instruments": pn.instruments,
                                                    "time": pn.time
                                                }]
                                            }
                                        }),
                                        "productinfo": val.prod_product_info

                                    })
                                } else {

                                    overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productenergy = overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productenergy + val.energy
                                    overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productvalue = overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productvalue + (val.info ?
                                        val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                    overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].durations.push({
                                        //"time": val.rawtime,
                                        "energy": val.energy,
                                        "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                        "start": val.start_dt,
                                        "end": val.end_dt,
                                        "index": overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].durations.length + 1
                                    })

                                    //productnode updated logic
                                    val.data.map(pn => {
                                        let productnodeindex = overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productnodeenergydata.findIndex(p => p.productnode.id === pn.productnode.id)
                                        if (productnodeindex < 0) {
                                            overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productnodeenergydata.push(
                                                {
                                                    "productnode": pn.productnode,
                                                    "data": [{
                                                        "day": moment(val.shiftdate).format("DD MMM"),
                                                        "energy": pn.energy,
                                                        "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                        "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                        "Event": event.Event_name,
                                                        "instruments": pn.instruments,
                                                        "time": pn.time
                                                    }]
                                                }
                                            )
                                        } else {
                                            overallmonthproductenergydata[index].primaryfilterdata[primaryfilterindex].eventdata[eventindex].products[productIndex].productnodeenergydata[productnodeindex].data.push(
                                                {

                                                    "day": moment(val.shiftdate).format("DD MMM"),
                                                    "energy": pn.energy,
                                                    "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                    "value": Number(val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                    "Event": event.Event_name,
                                                    "instruments": pn.instruments,
                                                    "time": pn.time
                                                })
                                        }
                                    })


                                }
                            }
                        }

                        if (day === -1) {

                            overallmonthproductenergydata[index].dayWiseData.push(
                                {
                                    "day": moment(val.shiftdate).format("DD MMM"),//val.time,
                                    "energy": val.energy,
                                    "products": [],
                                    "Weight": Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                    "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                    "Event": event.Event_name
                                })

                        }
                        else {
                            let productindex = overallmonthproductenergydata[index].dayWiseData[day].products.findIndex(p => p.productId === val.prod_product_id)
                            if (productindex === -1) {


                                overallmonthproductenergydata[index].dayWiseData[day].products.push(
                                    {
                                        "productId": val.prod_product_id,
                                        "productenergy": val.energy,
                                        "productName": val.prod_product_name,
                                        "productvalue": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                        "Event": val.Event_name,
                                        "durations": [{
                                            //"time": val.rawtime,
                                            "energy": val.energy,
                                            "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                            "start": val.start_dt,
                                            "end": val.end_dt,
                                            "index": 1,
                                            "Event": event.Event_name
                                        }],
                                        "productinfo": val.prod_product_info
                                    })


                            }
                            else {


                                // overallmonthproductenergydata
                                overallmonthproductenergydata[index].dayWiseData[day].products[productindex].productenergy = overallmonthproductenergydata[index].dayWiseData[day].products[productindex].productenergy + val.energy
                                overallmonthproductenergydata[index].dayWiseData[day].products[productindex].productvalue = overallmonthproductenergydata[index].dayWiseData[day].products[productindex].productvalue + (val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                overallmonthproductenergydata[index].dayWiseData[day].products[productindex].durations.push({
                                    "time": val.rawtime,
                                    "energy": val.energy,
                                    "value": val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                    "start": val.start_dt,
                                    "end": val.end_dt,
                                    "index": overallmonthproductenergydata[index].dayWiseData[day].products[productindex].durations.length + 1
                                })
                            }

                            //overallmonthproductenergydata
                            overallmonthproductenergydata[index].dayWiseData[day].energy = overallmonthproductenergydata[index].dayWiseData[day].energy + val.energy
                            overallmonthproductenergydata[index].dayWiseData[day].Weight = overallmonthproductenergydata[index].dayWiseData[day].Weight + Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0)
                            overallmonthproductenergydata[index].dayWiseData[day].value = overallmonthproductenergydata[index].dayWiseData[day].value + (val.info ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                            overallmonthproductenergydata[index].dayWiseData[day].Event = event.Event_name
                            overallmonthproductenergydata[index].totalEnergy = overallmonthproductenergydata[index].totalEnergy + val.energy
                            overallmonthproductenergydata[index].totalWeight = overallmonthproductenergydata[index].totalWeight + Number(val.info ? val.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0)
                            overallmonthproductenergydata[index].totalValue = overallmonthproductenergydata[index].totalValue + ((event.Event_name === "Production" && val.info) ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                            overallmonthproductenergydata[index].DTValue = overallmonthproductenergydata[index].DTValue + ((event.Event_name === "Downtime" && val.info) ? val.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                            // overallmonthproductenergydata[index].Event = event.Event_name
                        }

                    }


                    // })
                })
            })

            console.log(overallmonthproductenergydata,"overallmonthproductenergydata")
            return overallmonthproductenergydata
        } catch (err) {
            console.log("Error at processing hierarchy in ProductDB", err)
            return []
        }

    }

    function processshifthierarchy(Actenergymappeddata, TotalShifts) {

        try {


            let MonthProdShiftWise = TotalShifts.map(ts => {
                let monthproductenergydataShift = JSON.parse(JSON.stringify(initialmonthprodenergy));
                return { ...ts, data: monthproductenergydataShift }
            })

            MonthProdShiftWise.map((s, shiftWiseIndex) => {

                Actenergymappeddata.map(event => {
                    event.productnodeenergydata.map((v) => {
                        if (v.Shift === s.name) {

                            let index = MonthProdShiftWise[shiftWiseIndex].data.findIndex(x => x.month === new Date(v.shiftdate).getMonth())
                            if (index === -1) {
                                if (v.shiftdate) {
                                    MonthProdShiftWise[shiftWiseIndex].data.push(
                                        {
                                            "month": new Date(v.shiftdate).getMonth(),
                                            "dayWiseData": [{
                                                "day": moment(v.shiftdate).format("DD MMM"),
                                                "energy": v.energy,
                                                "Weight": Number(v.info ? v.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                "value": Number(v.info ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                                "shift_name": s.name,
                                                "Event": event.Event_name
                                            }],
                                            "totalEnergy": v.energy,
                                            "monthName": ProductTabCommon.monthNames[new Date(v.shiftdate).getMonth()].name,
                                            "totalWeight": Number(v.info ? v.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                            "totalValue": (event.Event_name === "Production" && v.info) ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                            "shift_name": s.name,
                                            "Event": event.Event_name
                                        })
                                }   

                            }

                            else {
                                let day = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData.findIndex(y => y.day === moment(v.shiftdate).format("DD MMM"))

                                if (day === -1) {
                                    MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData.push(
                                        {
                                            "day": moment(v.shiftdate).format("DD MMM"),
                                            "energy": v.energy,
                                            "products": [],
                                            "Weight": Number(v.info ? v.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0),
                                            "value": v.info ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                            "shift_name": s.name,
                                            "Event": event.Event_name
                                        })

                                }
                                else {
                                    let productindex = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products.findIndex(p => p.productId === v.prod_product_id)
                                    if (productindex === -1) {
                                        MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products.push(
                                            {
                                                "productId": v.prod_product_id,
                                                "productenergy": v.energy,
                                                "productName": v.prod_product_name,
                                                "productvalue": v.info ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0, //productarea renamed as productvalue
                                                "shift_name": s.name,
                                                "durations": [{
                                                    // "time": v.rawtime,
                                                    "energy": v.energy,
                                                    "value": v.info ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                                    "start": v.start_dt,
                                                    "end": v.end_dt,
                                                    "index": 1,
                                                    "shift_name": s.name,
                                                    "Event": event.Event_name
                                                }]
                                            })

                                    }
                                    else {
                                        MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].productenergy = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].productenergy + v.energy
                                        MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].productvalue = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].productvalue + (v.info ?
                                            v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                        MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].shift_name = s.name
                                        MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].durations.push({
                                            // "time": v.rawtime,
                                            "energy": v.energy,
                                            "value": v.info ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0,
                                            "start": v.start_dt,
                                            "end": v.end_dt,
                                            "index": MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].products[productindex].durations.length + 1,
                                            "shift_name": s.name,
                                            "Event": event.Event_name
                                        })
                                    }
                                    MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].energy = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].energy + v.energy
                                    MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].Weight = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].Weight + Number(v.info ? v.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                    MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].value = MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].value + (v.info ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                    MonthProdShiftWise[shiftWiseIndex].data[index].dayWiseData[day].shift_name = s.name
                                    MonthProdShiftWise[shiftWiseIndex].data[index].totalEnergy = MonthProdShiftWise[shiftWiseIndex].data[index].totalEnergy + v.energy
                                    MonthProdShiftWise[shiftWiseIndex].data[index].totalWeight = MonthProdShiftWise[shiftWiseIndex].data[index].totalWeight + Number(v.info ? v.info.Weight.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                    MonthProdShiftWise[shiftWiseIndex].data[index].totalValue = MonthProdShiftWise[shiftWiseIndex].data[index].totalValue + ((event.Event_name === "Production" && v.info) ? v.info.Value.reduce((partialSum, a) => partialSum + a, 0) : 0)
                                }

                            }

                        }

                    })
                })


            })
            return MonthProdShiftWise
        } catch (err) {
            console.log("Error at processshifthierarchy Product Tab", err)
            return []
        }



    }

    function ExcelFormat(data,data2){
        // console.log(data,"Excellldataaaa",data2)
        let ArrExcel=[]
        data2.map(val=>{
            val.data.map(day=>{
                day.dayWiseData.map(d=>{
                    d.products.map(p=>{
                        p.durations.map(t=>{
                            ArrExcel.push({
                                "line_id" : headPlant.id,
                                "start_date": t.start,
                                "end_date": t.end,
                                "prod_name": p.productName,
                                "prod_id": p.productId,
                                "Energy": t.energy,
                                "Event": t.Event,
                                "value": t.value,
                                "Shift_name": t.shift_name,
                                "Date" : moment(t.start).format("DD-MM-YYYY")
                            })
                        })
                    })

                })
            })
        })
        return ArrExcel

    }

    useEffect(() => {

        if (!energybysplitdayLoading && energybysplitdayData && !energybysplitdayError) {
            // console.log(energybysplitdayData,"energybysplitdayData")
            if (energybysplitdayData.length > 0) {
                try {
                    let productenergydata = filterproducts(prodquantity)
                    let ActiveWise = ActivityValue.map(v => {
                        let arr = productenergydata.filter(f => f.info && f.info.Event === v.name)
                        return { Event_name: v.name, data: arr }
                    })
                    let [aggregatedActiveEnergydata, TotalShifts] = ActivityEnergyData(productenergydata, ActiveWise)

                    let prodcutionfiltereddata = productenergydata.filter(f => f.info && f.info.Event === "Production")
                    let [productionaggregatedData] = ActivityEnergyData(productenergydata, [{ Event_name: "Production", data: prodcutionfiltereddata }])

                    let Actenergymappeddata = ProductEnergyMapping(aggregatedActiveEnergydata)

                    let ProdActenergymappeddata = ProductEnergyMapping(productionaggregatedData)

                    //loop starts here 

                    let events = Actenergymappeddata.map(e => e.Event_name)


                    let overallmonthproductenergydata = processhierarchy(Actenergymappeddata, events)
                    let filterProd = events.filter(f=> f==="Production")
                    let Prodoverallmonthproductenergydata = filterProd.length ? processhierarchy(ProdActenergymappeddata, filterProd) : []

                    let overallMonthShiftenergydata = processshifthierarchy(Actenergymappeddata, TotalShifts)

                    let ExcelData = ExcelFormat(overallmonthproductenergydata,overallMonthShiftenergydata)
                    ExcelData = ExcelData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
                    ExcelData = ExcelData.map(x=>{
                        return {
                            Date:x.Date,
                            Energy:x.Energy,
                            Event:x.Event,
                            "Shift Name":x.Shift_name,
                            "Start Date":moment(x.start_date).format("DD-MM-YYYY HH:mm:ss"),
                            "End Date":moment(x.end_date).format("DD-MM-YYYY HH:mm:ss"),
                            "Prod Name":x.prod_name,
                            Value:x.value
                            }
                    })
                    console.log(ExcelData,'ExcelData')
                    setMonthExcelData(ExcelData)

                    let overallMonthProdShiftenergydata = processshifthierarchy(ProdActenergymappeddata, TotalShifts)
                    // console.log(ExcelData,"overallmonthproductenergydata",overallMonthShiftenergydata,overallmonthproductenergydata)
                    let updatenonproductionevents = JSON.parse(JSON.stringify(overallmonthproductenergydata))
                    updatenonproductionevents.map(o => {
                        let filteredmonth = Prodoverallmonthproductenergydata.filter(pom => pom.month === o.month)
                        if (filteredmonth.length > 0) {
                            o.primaryfilterdata.map(pm => {

                                let prodprimaryfilter = filteredmonth[0].primaryfilterdata.filter(prodpm => prodpm.primaryfilter === pm.primaryfilter)
                                if (prodprimaryfilter.length > 0 && prodprimaryfilter[0].eventdata && prodprimaryfilter[0].eventdata[0]) {
                                    pm.eventdata.map(pme => {
                                        //Choose Non production events
                                        if (pme.Event_name === "Production") {
                                            pme.products.map(pmp => {

                                                let filteredproduct = prodprimaryfilter[0].eventdata[0].products.filter(p => p.productId === pmp.productId)
                                                if (filteredproduct.length > 0) {
                                                    pmp.productvalue = filteredproduct[0].productvalue

                                                }

                                            })
                                        }
                                    })
                                }

                            })
                            o.dayWiseData.map(d => {
                                let day = filteredmonth[0].dayWiseData.filter(fd => fd.day === d.day)
                                if (day.length > 0) {
                                    d.value = day[0].value
                                }
                            })
                            o.totalValue = filteredmonth[0].totalValue
                        }

                    })
                    let energyvalues = updatenonproductionevents.map(val => val.totalValue)
                    setnodata(energyvalues.every(item => item === 0))

                    let updatenonproductionshiftevents = JSON.parse(JSON.stringify(overallMonthShiftenergydata))

                    updatenonproductionshiftevents.map(us => {
                        let filteredshift = overallMonthProdShiftenergydata.filter(os => os.name === us.name)
                        if (filteredshift.length > 0) {
                            us.data.map(usd => {
                                let filteredshiftmonth = filteredshift[0].data.filter(fsd => fsd.month === usd.month)
                                if (filteredshiftmonth.length > 0) {
                                    usd.dayWiseData.map(d => {
                                        let day = filteredshiftmonth[0].dayWiseData.filter(fd => fd.day === d.day)
                                        if (day.length > 0) {
                                            d.value = day[0].value
                                        }
                                    })
                                   
                                }
                            })
                        }
                    })
                    setmonthprodenergy(updatenonproductionevents)
                    // console.log(overallmonthproductenergydata,"updatenonproductionshiftevents",updatenonproductionevents)
                    setmonthprodenergyShiftwise(updatenonproductionshiftevents)
                    setShiftLoading(false)


                    ApexCharts.exec('MonthwiseChart', "updateOptions", {
                        states: {
                            hover: {
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
                }
                catch (err) { console.log("Error at Product SQMT Chart Mounting", err) }
            }
            setLoading(false)
        } else if (energybysplitdayError) {
            setLoading(false)
            setMonthExcelData([])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [energybysplitdayLoading, energybysplitdayData, energybysplitdayError,])




    useEffect(() => {
        let tempmonthprodenergy = []
        if (ProdSqmtRange.start && ProdSqmtRange.end) {
            let monthEndval = ProdSqmtRange.end.getMonth() + 1
            let MonthEnd = []
            if (ProdSqmtRange.end.getFullYear() !== ProdSqmtRange.start.getFullYear()) {
                monthEndval = 12
                MonthEnd = ProductTabCommon.monthNames.slice(0, ProdSqmtRange.end.getMonth() + 1)
            }
            let MonthStart = ProductTabCommon.monthNames.slice(ProdSqmtRange.start.getMonth(), monthEndval)

            let curYear = ProdSqmtRange.start.getFullYear()
            let MonthArr = [...MonthStart, ...MonthEnd]
            MonthArr.forEach((val, index) => {
                if (MonthArr.length - 1 === index) {
                    curYear = ProdSqmtRange.end.getFullYear()
                }
                tempmonthprodenergy.push({
                    "month": val.id, "monthName": val.name, "primaryfilterdata": [],
                    "dayWiseData": ProductTabCommon.getDates(val.id, curYear, ProdSqmtRange), "totalEnergy": 0, "totalValue": 0, "totalWeight": 0 , "DTValue":0
                })
            })
            setinitialmonthprodenergy(tempmonthprodenergy)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ProdSqmtRange])

    

    useEffect(() => {
        try {
            if (Object.keys(selectedNode).length > 0)
                TeritiaryFilterChart(selectedNode)
        } catch (err) {
            console.log("Error at useeffect flowIndex", err)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flowIndex])




    useEffect(() => {
        try {
            if (monthprodenergyShiftwise.length > 0) {
                ShiftWiseProdData(monthprodenergyShiftwise.map(x => { return { ...x, data: (x.data.filter(e => e.month === selectedmonthindex).length > 0) ? x.data.filter(e => e.month === selectedmonthindex)[0].dayWiseData : [] } }))
            }
        }
        catch (err) {
            console.log("Error at useEffect monthprodenergyShiftwise", err)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthprodenergyShiftwise, selectedmonthindex])

    const showdayWiseData = (month, show) => {
        try {
            let monthFilter = ProductTabCommon.monthNames.filter(f => f.name === month)
            setshowdaywisechart(show)
            setselectedMonthIndex(monthFilter[0].id)
            setdayWiseprodenergy(monthprodenergy.filter(e => e.month === monthFilter[0].id)[0].dayWiseData)
            ShiftWiseProdData(monthprodenergyShiftwise.map(x => { return { ...x, data: x.data.filter(e => e.month === monthFilter[0].id)[0].dayWiseData } }))
        }
        catch (err) {
            console.log("Error at showdayWiseData Product Tab", err)
        }

    }


    const nodeshiftwisedata = (nodeDataShift) => {
        // console.log("nodeDataShift", nodeDataShift)
        let datasets = []
        let bgColors = {};
        let labels = []

        try {
            let uniquenodes = [...new Set(nodeDataShift.map(val => val.node))]
            uniquenodes.forEach((val, i) => { if (!bgColors[val]) { bgColors[val] = ProductTabCommon.COLORS[i % ProductTabCommon.COLORS.length] } })
            nodeDataShift.forEach((val) => {
                datasets.push(
                    {
                        label: val.node,
                        data: val.data,
                        backgroundColor: bgColors[val.node],//colors[val.node],
                        productnode: val.productnode,
                        stack: val.name,
                        misc: val.misc,
                        denmetric: val.denmetric,
                        energy: val.energy
                    },
                )
                if (labels.findIndex(l => l.node === val.node) >= 0) {
                    labels[labels.findIndex(l => l.node === val.node)].stack.push(val.name)
                } else {
                    labels.push({ "node": val.node, "stack": [val.name] })
                }

            })
        } catch (err) {
            console.log("Error at Shiftwise NodeData", err)
        }

        setprimarygroupingdata(datasets)
    }

    const nodedaywisedata = (data) => {
        let datasets = []
        let bgColors = [];
        try {
            for (let i = 0; i < data.length; i++) {
                bgColors.push(ProductTabCommon.COLORS[i % ProductTabCommon.COLORS.length]);
            }
            data.map((val, index) => {
                datasets.push(
                    {
                        label: val.name,
                        data: val.data,
                        misc: val.misc,
                        productnode: val.productnode,
                        backgroundColor: bgColors[index],//colors[val.name],
                        denmetric: val.denmetric,
                        energy: val.energy,
                    },
                )
            })
            setshowsecondarygrouping(true)
            setsecondarygroupingdata(datasets)
        } catch (err) {
            console.log("Error at daywise data fn Product Tab", err)
        }

    }

    function SecondaryFilterChart(val) {
        try {
            if (selectedFamily !== val.Label || selectedActivity !== val.Data.stack) {
                setshowteritiarygrouping(false)
                setshowChildren(false)
            }
            setselectedFamily(val.Label)
            setselectedActivity(val.Data.stack)
            //filterselectedmonth
            let selectedmonthdata = monthprodenergy.filter(m => m.monthName === val.Data.misc.selectedmonth)

            let selectedfamily = selectedmonthdata[0].primaryfilterdata.filter(p => p.primaryfilter === val.Label)

            //filterselectedactivity 

            let selectedevent = selectedfamily[0].eventdata.filter(e => e.Event_name === val.Data.stack)

            let secondarychartcategories = selectedevent[0].products //.map(p => p.productId)

            setsecondaryfiltercategories(selectedevent[0].products)
            let nodeenergy = []
            selectedevent[0].products.map(prod => {
                let prodarea = prod.productvalue
                prod.productnodeenergydata.map(pmnode => {
                    let nodeindex = nodeenergy.findIndex(n => n.productnode.id === pmnode.productnode.id && n.productdesc.productId === prod.productId
                    )

                    //nodeabsent
                    if (nodeindex < 0) {
                        nodeenergy.push({
                            "productnode": pmnode.productnode, "data": pmnode.data.reduce(
                                (accumulator, currentValue) => accumulator + currentValue.energy,
                                0,
                            ), "productdesc": prod, "denmetric": prodarea,
                            // pmnode.data.reduce(
                            //     (accumulator, currentValue) => accumulator + currentValue.value,
                            //     0)
                        })
                    }
                    //nodepresent
                    else {
                        nodeenergy[nodeindex].data = nodeenergy[nodeindex].data + pmnode.data.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.energy,
                            0,
                        )

                        nodeenergy[nodeindex].denmetric = nodeenergy[nodeindex].denmetric + prodarea
                        // pmnode.data.reduce(
                        //     (accumulator, currentValue) => accumulator + currentValue.value,
                        //     0,
                        // )


                    }
                })
            })
            let productnodes = headPlant.node.product_energy.nodes
            let pregroupingchartprepdata = []
            //energy for each node for each family for each activity
            productnodes.map(pn => {
                pregroupingchartprepdata.push({
                    "name": pn.name,
                    "data": [],
                    "misc": [],
                    "productnode": pn,
                    "denmetric": [],
                    "energy": [],


                })
            })

            //Add data to each object
            secondarychartcategories.forEach(secondarycat => {

                pregroupingchartprepdata.forEach(pgc => {
                    let datapresent = nodeenergy.findIndex(n => n.productnode.id === pgc.productnode.id && secondarycat.productId === n.productdesc.productId)
                    pgc.misc.push(secondarycat)
                    if (datapresent >= 0) {
                        // pgc.data.push(nodeenergy[datapresent].data)

                        pgc.data.push(nodeenergy[datapresent].denmetric !== 0 ? (nodeenergy[datapresent].data / nodeenergy[datapresent].denmetric) : 0)
                        pgc.denmetric.push(nodeenergy[datapresent].denmetric)
                        pgc.energy.push(nodeenergy[datapresent].data)
                    } else {
                        // pgc.data.push(0)
                        pgc.data.push(0)
                        pgc.denmetric.push(0)
                        pgc.energy.push(0)
                    }
                })
            })

            nodedaywisedata(pregroupingchartprepdata)
        }
        catch (err) {
            console.log("Error at SecondaryFilterChart Product Tab", err)
        }
    }

    function TeritiaryFilterChart(val) {

        try {
            setSelectedNode(val)
            //filterselectedmonth
            let selectedmonthdata = monthprodenergy.filter(m => m.monthName === selectedmonth)

            //filterseletedfamily
            let selectedfamily = selectedmonthdata[0].primaryfilterdata.filter(p => p.primaryfilter === selectedFamily)

            let selectedevent = selectedfamily[0].eventdata.filter(e => e.Event_name === selectedActivity)

            let selectedproduct = val.Data.misc.filter(p => p.productName === val.Label)
            //colors
            let bgColors = []


            if (selectedevent.length > 0 && selectedproduct.length > 0) {
                if (flowIndex === 0) {
                    let activitychart = []

                    let selectedproddurations = selectedevent[0].products.filter(p => p.productId === selectedproduct[0].productId)

                    selectedproddurations.length > 0 && selectedproddurations[0].durations.map(d => {
                        activitychart.push({
                            "index": d.index,
                            "durationenergy": d.energy,
                            "denmetric": d.value,
                            "data": d.value !== 0 ? (d.energy / d.value) : 0,
                            "durations": { "start": d.start, "end": d.end }
                        })
                    })


                    for (let i = 0; i < activitychart.length; i++) {
                        bgColors.push(ProductTabCommon.COLORS[i % ProductTabCommon.COLORS.length]);
                    }

                    let activitydata = [{
                        "label": selectedproduct[0].productName,
                        "data": activitychart.map(a => a.data),
                        "energy": activitychart.map(a => a.durationenergy),
                        "denmetric": activitychart.map(a => a.denmetric),
                        "backgroundColor": activitychart.map(a => "#008ffb"),
                        "durations": activitychart.map(a => a.durations)


                    }]


                    setActivityChartData({ "Data": activitydata, "labels": activitychart.map(a => a.index) })
                } else {
                    let nodechart = []

                    selectedproduct[0].productnodeenergydata.map(pn => {
                        let instruments = []
                        let totalnodeneergy = pn.data.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.energy,
                            0,
                        )

                        let totalnodedenmetric = selectedproduct[0].productvalue
                        // pn.data.reduce(
                        //     (accumulator, currentValue) => accumulator + currentValue.value,
                        //     0,
                        // )

                        pn.data.map((d) => {
                            d.instruments.map((instru) => {
                                let instrupresent = instruments.findIndex(ins => ins.name === instru.name && ins.time === instru.time)
                                if (instrupresent < 0) {
                                    instruments.push(instru)
                                } else {
                                    instruments[instrupresent].energy = instruments[instrupresent].energy + instru.energy
                                }
                            })

                        })


                        let data = totalnodedenmetric !== 0 ? (totalnodeneergy / totalnodedenmetric) : 0
                        nodechart.push({ "productnode": Object.assign({}, pn.productnode, { "instruments": instruments }), "nodeenergy": totalnodeneergy, "denmetric": totalnodedenmetric, "data": data })
                    })




                    for (let j = 0; j < nodechart.length; j++) {
                        bgColors.push(ProductTabCommon.COLORS[j % ProductTabCommon.COLORS.length]);
                    }
                    let nodedata = [{
                        "label": val.Label,
                        "data": nodechart.map(a => a.data),
                        "energy": nodechart.map(a => a.nodeenergy),
                        "denmetric": nodechart.map(a => a.denmetric),
                        "backgroundColor": nodechart.map((a, index) => bgColors[index]),
                        "nodeobjs": nodechart.map(a => a.productnode),
                        "children": nodechart.map(a => a.productnode.instruments),

                    }]

                    setActivityChartData({ "Data": nodedata, "labels": nodechart.map(a => a.productnode.name) })

                }
                setshowteritiarygrouping(true)
            }
        } catch (err) {
            console.log("error at TeritiaryFilterChart Product Tab", err)
        }

    }

    const monthchartdatapointSelection = (event, chartContext, config) => {

        try {
            const dataPoint = monthprodenergy.map(val => val.monthName)[config.dataPointIndex];
            let monthprodindex = monthprodenergy.findIndex(m => m.monthName === dataPoint)
            let primarychartcategories = monthprodenergy[monthprodindex].primaryfilterdata.map(p => p.primaryfilter)

            let productnodes = headPlant.node.product_energy.nodes

            let events = ActivityValue.map(a => a.name)
            setprimaryfiltercategories(primarychartcategories)
            setshowprimarygrouping(true)
            // setselectedmonthenergy(monthprodenergy.filter(m => m.monthName === dataPoint))
            setselectedMonth(dataPoint)

            if (dataPoint !== selectedmonth) {
                setshowsecondarygrouping(false)
                setshowteritiarygrouping(false)
                setshowChildren(false)
            }


            let nodeenergy = []
            monthprodenergy[monthprodindex].primaryfilterdata.map(
                (pmevent) => {
                    pmevent.eventdata.map(em => {


                        em.products.map(prod => {
                            let prodarea = prod.productvalue
                            prod.productnodeenergydata.map(pmnode => {
                                let nodeindex = nodeenergy.findIndex(n => n.productnode.id === pmnode.productnode.id
                                    && n.family === pmevent.primaryfilter && n.event === em.Event_name)

                                //nodeabsent
                                if (nodeindex < 0) {
                                    nodeenergy.push({
                                        "productnode": pmnode.productnode, "data": pmnode.data.reduce(
                                            (accumulator, currentValue) => accumulator + currentValue.energy,
                                            0,
                                        ), "family": pmevent.primaryfilter, "event": em.Event_name, "denmetric": prodarea
                                        // pmnode.data.reduce(
                                        //     (accumulator, currentValue) => accumulator + currentValue.value,
                                        //     0)
                                    })
                                }
                                //nodepresent
                                else {
                                    nodeenergy[nodeindex].data = nodeenergy[nodeindex].data + pmnode.data.reduce(
                                        (accumulator, currentValue) => accumulator + currentValue.energy,
                                        0,
                                    )

                                    nodeenergy[nodeindex].denmetric = nodeenergy[nodeindex].denmetric + Number(prodarea)
                                    // pmnode.data.reduce(
                                    //     (accumulator, currentValue) => accumulator + currentValue.value,
                                    //     0,
                                    // )

                                }
                            })
                        })
                    })
                }

            )

            let pregroupingchartprepdata = []
            //energy for each node for each family for each activity
            productnodes.map(pn => {
                events.map(e => {
                    pregroupingchartprepdata.push({
                        "node": pn.name,
                        "name": e,
                        "data": [],
                        "misc": { "selectedmonth": dataPoint },
                        "productnode": pn,
                        "denmetric": [],
                        "energy": []

                    })
                })
            })

            //Add data to each object
            primarychartcategories.forEach(primarycat => {
                pregroupingchartprepdata.forEach(pgc => {
                    let datapresent = nodeenergy.findIndex(n => n.productnode.id === pgc.productnode.id && n.event === pgc.name && primarycat === n.family)
                    if (datapresent >= 0) {
                        pgc.data.push(nodeenergy[datapresent].denmetric !== 0 ? (nodeenergy[datapresent].data / nodeenergy[datapresent].denmetric) : 0)
                        pgc.denmetric.push(nodeenergy[datapresent].denmetric)
                        pgc.energy.push(nodeenergy[datapresent].data)
                    } else {
                        pgc.data.push(0)
                        pgc.denmetric.push(0)
                        pgc.energy.push(0)
                    }
                })
            })

            nodeshiftwisedata(pregroupingchartprepdata)

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

        } catch (err) {
            console.log("Error at monthchartdatapointSelection Product Tab", err)
        }

    }


    const ChildwiseData = (val) => {

        try {
            let children = val.e.chart.config.data.datasets[val.element[0].datasetIndex].children[val.element[0].index]
            let bgColors = []
            for (let i = 0; i < children.length; i++) {
                bgColors.push(ProductTabCommon.COLORS[i % ProductTabCommon.COLORS.length]);
            }

            let groupedChildren = []
            children.map(c => {
                let presentIndex = groupedChildren.findIndex(g => g.name === c.name)
                if (presentIndex >= 0) {
                    groupedChildren[presentIndex].energy = Number(groupedChildren[presentIndex].energy) + Number(c.energy)
                } else {
                    groupedChildren.push({ name: c.name, energy: Number(c.energy) })
                }
            })
            let nodedata = [{
                "label": val.Data.label,
                "data": groupedChildren.map(a => a.energy),
                "backgroundColor": groupedChildren.map((a, index) => bgColors[index]),


            }]
            // console.log(nodedata,'nodedata')
            setshowChildren(true)
            setChildNodeData({ "Data": nodedata, "labels": groupedChildren.map(a => getNameById(a.name)), "title": val.Data.label + ' ' + val.Label })
        } catch (err) {
            console.log("error in child node graph", err)
        }


    } 

    const SwitchList = [
        { id: "Daywise", value: "Day", disabled: false },
        { id: "Shiftwise", value: "Shift", disabled: false },
    ]


    function ShiftWiseProdData(data) {
        let ChartData = data.map(e => {
            return {
                ...e,
                data: e.data.map(val => isFinite(val.energy / val.value) ? (val.energy / val.value) : 0),
                rawData: e.data

            }
        })
        // console.log(ChartData, "ShiftWiseProdDataShiftWiseProdData", data)
        setShiftwiseprodenergy(ChartData)
    }

    function changeshiftWise(e) {
        setOverallSwitchIndex(e)
        ApexCharts.exec('ShiftwiseChart', 'updateSeries', Shiftwiseprodenergy, true);
    }


    function changeflow(e) {
        setflowIndex(e)
    }


    const customtooltip = (context, chartindex) => {
        // console.log(chartindex,"context", context,"flowIndex",flowIndex)
        try {
            let chart = context[0]
            let energy = chart.dataset.energy[chart.dataIndex]
            let denmetric = chart.dataset.denmetric[chart.dataIndex]
            let value = chart.dataset.data[chart.dataIndex]

            if (chartindex !==3 || (chartindex === 3 && flowIndex === 1)) {
                return (chart.dataset.stack ? chart.dataset.stack : chart.label) + " : " + value.toFixed(2) + '(TotalEnergy - ' + energy.toFixed(2) +
                    'kWh , ' + ProductTabCommon.setfactortext(factor)[0] + '- ' + denmetric.toFixed(2) + ProductTabCommon.setfactortext(factor)[1] + ' )'
            } else if (chartindex === 3 && flowIndex === 0) {
                    let start = chart.dataset.durations[chart.dataIndex].start
                    let end = chart.dataset.durations[chart.dataIndex].end
                    return 'Start : ' + moment(start).format("DD/MM/YYYY HH:mm:ss") + ' - End : ' +
                        moment(end).format("DD/MM/YYYY HH:mm:ss") + '(TotalEnergy - ' + energy.toFixed(2) +
                        'kWh , ' + ProductTabCommon.setfactortext(factor)[0] + '- ' + denmetric.toFixed(2) + ProductTabCommon.setfactortext(factor)[1] + ' )'
                } 

            


        } catch (err) {
            console.log("error in tooltip", err)
        }
    }

    // console.log("monthprodenergy", monthprodenergy)
    return (
        <div className='p-4' >
            {headPlant.node && headPlant.node.product_energy &&
                <React.Fragment>
                    <div>
                        <Grid container spacing={4}>
                            <Grid item xs={showdaywisechart ? 6 : 12} >
                                < Card elevation={0} >
                                    <div className="w-full h-full">
                                        <div className="flex justify-between gap-3 ">
                                            <div className="flex items-center gap-3 pb-3">
                                                <Typography variant="heading-01-xs" color='secondary'  value={'Specific Energy Monthwise - Production'} />
                                                {loading && <LinearProgress></LinearProgress>}
                                            </div>
                                            {MonthExcelData.length>0 &&
                                            <Download
                                            style={{cursor:"pointer"}}
                                                stroke={"#007BFF"}
                                                id={"download-"}
                                                onClick={(e) => {
                                                    downloadExcel(MonthExcelData, "Exported Energy");
                                                }}
                                            />
                                            }
                                        </div>
                                        {monthprodenergy.length > 0 && !nodata &&
                                            <Apexcharts
                                                theme={curTheme}
                                                height={350}
                                                chartid={"MonthwiseChart"}
                                                charttype={"bar"} 
                                                dataPointSelection={(event, chartContext, config) => monthchartdatapointSelection(event, chartContext, config)}
                                                colors={["#FFCC00", "#FF6682", "#6CE07F", "#FF2E54", "#5957D6", "#FF9500", "#FF382E", "#8584E1", "#4AD962", "#FFE066", "#007BFF", "#08ABF7"]}
                                                categories={monthprodenergy.map(val => val.monthName)}
                                                yAxisTitle={"Consumption per " + ProductTabCommon.setfactortext(factor)[1] + "(kWh/" + ProductTabCommon.setfactortext(factor)[1] + ")"}
                                                xAxisTooltip={(value, series, seriesIndex, dataPointIndex, w) => { return "Energy" }}
                                                yAxixTooltipTitle={(value, series, seriesIndex, dataPointIndex, w) => monthprodenergy.map(val => val.monthName)[dataPointIndex] + " : "}
                                                yAxisTooltipValue={(value, series, seriesIndex, dataPointIndex, w) => value.toFixed(2) + '(TotalEnergy - ' + monthprodenergy[dataPointIndex].totalEnergy.toFixed(2) +
                                                    'kWh , ' + ProductTabCommon.setfactortext(factor)[0] + ' - ' + monthprodenergy[dataPointIndex].totalValue.toFixed(2) + ProductTabCommon.setfactortext(factor)[1] + ' )'}
                                                series={[{data: monthprodenergy.map(val=> isFinite(val.totalEnergy / val.totalValue) ? (val.totalEnergy / val.totalValue) : 0)}]
                                                }
                                                legend={true}
                                                distributed={false}
                                            />
                                        }


                                    </div>
                                </Card>
                            </Grid>
                            {showdaywisechart &&
                                <Grid item xs={6} >
                                    < Card elevation={0} style={{height:480}} >
                                        <div >
                                            <div className="flex items-center justify-between" >
                                                <div className="flex items-center gap-3 pb-3">
                                                    <Typography variant="heading-01-xs" color='secondary'  value={OverallSwitchIndex ? "Specific Energy  - Shiftwise" : "Specific Energy Daywise - Production" } />
                                                    {((OverallSwitchIndex > 0) && Shiftloading) && <LinearProgress></LinearProgress>}
                                                </div>
                                                <ContentSwitcherNDL listArray={SwitchList} contentSwitcherClick={(e) => changeshiftWise(e)} switchIndex={OverallSwitchIndex} ></ContentSwitcherNDL>
                                            </div>

                                            {!OverallSwitchIndex &&
                                                <Apexcharts
                                                    theme={curTheme}
                                                    height={350}
                                                    chartid={"DaywiseChart"}
                                                    charttype={"bar"}
                                                    type={"bar"}
                                                    // dataPointSelection={(event, chartContext, config) => daychartdatapointSelection(event, chartContext, config)}
                                                    categories={dayWiseprodenergy.map(val => val.day)}
                                                    yAxisTitle={"Consumption per " + ProductTabCommon.setfactortext(factor)[1] + "(kWh/" + ProductTabCommon.setfactortext(factor)[1] + ")"}
                                                    xAxisTooltip={(value, series, seriesIndex, dataPointIndex, w) => { return "Energy" }}
                                                    yAxixTooltipTitle={(value, series, seriesIndex, dataPointIndex, w) =>
                                                        dayWiseprodenergy.map(val => val.day)[dataPointIndex] + " : "}
                                                    yAxisTooltipValue={(value, series, seriesIndex, dataPointIndex, w) =>
                                                        value.toFixed(2) + '(Energy - ' + dayWiseprodenergy[dataPointIndex].energy.toFixed(2) +
                                                        'kWh ,' + ProductTabCommon.setfactortext(factor)[0] + ' - ' + dayWiseprodenergy[dataPointIndex].value.toFixed(2) + ProductTabCommon.setfactortext(factor)[1] + ' )'}
                                                    series={[{
                                                        data: dayWiseprodenergy.map(val => isFinite(val.energy / val.value) ? (val.energy / val.value) : 0)
                                                    }]}
                                                    legend={false}
                                                />
                                            }
                                            {(OverallSwitchIndex > 0) &&
                                                <Apexcharts
                                                    theme={curTheme}
                                                    height={350}
                                                    chartid={"ShiftwiseChart"}
                                                    charttype={"bar"}
                                                    dataPointSelection={(event, chartContext, config) => console.log(event, chartContext, config)}
                                                    categories={dayWiseprodenergy.map(val => val.day)}
                                                    yAxisTitle={"Consumption per " + ProductTabCommon.setfactortext(factor)[1] + "(kWh/" + ProductTabCommon.setfactortext(factor)[1] + ")"}
                                                    xAxisTooltip={(value, series, seriesIndex, dataPointIndex, w) => { return "Energy - " + Shiftwiseprodenergy[seriesIndex].name }}
                                                    yAxixTooltipTitle={(value, series, seriesIndex, dataPointIndex, w) =>
                                                        w.config.xaxis.categories[dataPointIndex] + " : "}
                                                    yAxisTooltipValue={(value, series, seriesIndex, dataPointIndex, w) => {
                                                        // console.log(Shiftwiseprodenergy,"dataPointIndex",dataPointIndex,value,series,seriesIndex)
                                                        return value.toFixed(2) + '(Energy - ' + Shiftwiseprodenergy[seriesIndex].rawData[dataPointIndex].energy.toFixed(2) + 'kWh ,' + ProductTabCommon.setfactortext(factor)[0] + ' - ' +
                                                            Shiftwiseprodenergy[seriesIndex].rawData[dataPointIndex].value.toFixed(2) + ProductTabCommon.setfactortext(factor)[1] + ' )'
                                                    }
                                                    }
                                                    series={Shiftwiseprodenergy}
                                                    legend={true}
                                                    distributed={false}
                                                    colors={["#104C1A", "#F47180", "#856A00"]}
                                                />
                                            }

                                        </div>
                                    </Card>
                                </Grid>
                            }
                            {showprimarygrouping &&

                                <PrimaryChart
                                    charttype={"shiftbar"}
                                    yAxisTitle={"Consumption per " + ProductTabCommon.setfactortext(factor)[1] + "(kWh/" + ProductTabCommon.setfactortext(factor)[1] + ")"}
                                    filtercategories={primaryfiltercategories}
                                    groupingdata={primarygroupingdata}
                                    renderChild={(val) => SecondaryFilterChart(val)}
                                    customtooltip={customtooltip}
                                    chartIndex={1}
                                    datalabels={true}
                                    chartTitle={headPlant.node && headPlant.node.product_energy && headPlant.node.product_energy.primary !== 2 ? t("Specific Energy Productwise") : t("Specific Energy Familywise")}
                                />
                            }
                            {showsecondarygrouping &&

                                <PrimaryChart
                                    charttype={"bar"}
                                    yAxisTitle={"Consumption per " + ProductTabCommon.setfactortext(factor)[1] + "(kWh/" + ProductTabCommon.setfactortext(factor)[1] + ")"}
                                    filtercategories={secondaryfiltercategories.map(s => s.productName)}
                                    groupingdata={secondarygroupingdata}
                                    renderChild={(val) => TeritiaryFilterChart(val)}
                                    customtooltip={customtooltip}
                                    chartIndex={2}
                                    chartTitle={"Specific Energy  Productwise"}
                                    changeflow={changeflow}
                                    contentswitcher={true}
                                />
                            }
                            {showteritiarygrouping &&

                                <PrimaryChart
                                    charttype={"bar"}
                                    yAxisTitle={"Consumption per " + ProductTabCommon.setfactortext(factor)[1] + "(kWh/" + ProductTabCommon.setfactortext(factor)[1] + ")"}
                                    filtercategories={activitychartdata.labels}
                                    groupingdata={activitychartdata.Data}
                                    renderChild={(val) => flowIndex === 1 && ChildwiseData(val)}
                                    customtooltip={customtooltip}
                                    chartIndex={3}
                                    chartTitle={flowIndex === 0 ? 'Specific Energy  Activitywise' : 'Specific Energy  Nodewise'}

                                />
                            }

                            {showChildren && (flowIndex === 1) &&

                                <PrimaryChart
                                    charttype={"bar"}
                                    yAxisTitle={"Consumption (kWh)"}
                                    filtercategories={ChildNodeData.labels}
                                    groupingdata={ChildNodeData.Data}
                                    renderChild={(val) => flowIndex === 1 && ChildwiseData(val)}
                                    customtooltip={customtooltip}
                                    chartIndex={4}
                                    chartTitle={'Specific Energy ' + ChildNodeData.title}

                                />
                            }
                        </Grid>
                    </div>
                </React.Fragment>
            }
            {(!headPlant.node || !headPlant.node.product_energy) &&
                <Grid item xs={12} >
                    <div className="flex items-center justify-center">
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Typography variant='paragraph-s'
                    value={t('Add Product Energy Asset in Setting screen to view the dashboard')} />
                    </div>
                   
                </Grid>
            }
        </div>

    )
}