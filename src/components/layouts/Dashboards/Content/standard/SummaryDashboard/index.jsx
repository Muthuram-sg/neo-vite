import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import { selectedPlant, userDefaultLines, dashBtnGrp, DateSrch, customdates, sumaryLoading, pickerDisable , ErrorPage,themeMode} from 'recoilStore/atoms';
import { useRecoilState } from "recoil";
import moment from 'moment';
import Card from "components/Core/KPICards/KpiCardsNDL";
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Divider from 'components/Core/HorizontalLine/HorizontalLineNDL'; 
import Download from 'assets/neo_icons/Menu/DownloadSimple.svg?react';
import Dialog from 'components/Core/ModalNDL/index';
import DialogTitle from 'components/Core/ModalNDL/ModalHeaderNDL';
import DialogContent from 'components/Core/ModalNDL/ModalContentNDL';
import DialogActions from 'components/Core/ModalNDL/ModalFooterNDL';
import Typography from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL'
import Button from 'components/Core/ButtonNDL/index';
import { useTranslation } from "react-i18next";
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx";
import useMetricTypelist from "components/layouts/Dashboards/Content/standard/hooks/useMetricTypes.jsx";
import configParam from 'config';
import OEE from './components/OEEDashboard';
import Execution from './components/Executions';
import PartsProduced from './components/PartsProduced.jsx';
import DataAlert from './components/DataAlert';
import ConnectivityAlert from './components/ConnectivityAlert';
import Tasks from './components/Tasks';
import EnergyDashboard from './components/EnergyDashboard';
import ChildSummary from "./components/ChildSummary";
import useDataAlertsPlant from './hooks/useDataAlertsPlant.jsx'
import useMetricsInstrument from 'components/layouts/Line/hooks/useMetricsInstrument.jsx';
import useEnergyAllPlants from "./hooks/useEnergyAllPlants.jsx"; 
import useWaterEnergy from "./hooks/useWaterEnergy.jsx"
import useLPGEnergy from "./hooks/useLPGEnergy.jsx"
import useCNGEnergy from "./hooks/useCNGEnergy.jsx"
import useDGEnergy from "./hooks/useDGEnergy.jsx"
import useSolarEnergy from "./hooks/useSolarEnergy.jsx"
import useCo2AllPlants from './hooks/useCo2AllPlants'
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import Co2ICon from 'assets/neo_icons/newUIIcons/Co2.svg?react';
import * as XLSX from 'xlsx';

function SummaryDashboard() {
    const { t } = useTranslation();
    const [,setErrorPage] = useRecoilState(ErrorPage)
    let {moduleName,subModule1,queryParam} = useParams()
    const [flag,setFlag] = useState(true)
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [DatesSearch] = useRecoilState(DateSrch);
    const [customdatesval] = useRecoilState(customdates);
    const [navigateArr, setnavigateArr] = useState([{ name: 'Summary', id: 1 }])
    const [linkIndex, setlinkIndex] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [headPlant] = useRecoilState(selectedPlant); 
    const [choosenModule, setChoosenModule] = useState("");
    const [choosenType, setChoosenType] = useState("");
    const [choosenSchema,setChoosenSchema] = useState("")
    const [userDefaultList] = useRecoilState(userDefaultLines);
    const [typelist, setTypelist] = useState([])
    const [EngParentData, setEngParentData] = useState([]);
    const [WaterTodayData,setWaterTodayData] = useState([]);
    const [CNGTodayData,setCNGTodayData] = useState([]);
    const [LPGTodayData,setLPGTodayData] = useState([]);
    const [DGTodayData,setDGTodayData] = useState([]);
    const [SolarTodayData,setSolarTodayData] = useState([]);
    const [Dailogtitle, setDailogtitle] = useState('')
    const [PlantName,setPlantName] = useState('')
    const [childData, setChildData] = useState([]);
    const [childTitle, setChildTitle] = useState("");
    const [Subchildarr, setSubchildarr] = useState([]);
    const [AlertPlants, setAlertPlants] = useState([])
    const [InstrumentMet, setInstrumentMet] = useState([]);
    const [electricityUnitPrice, setElectricityUnitPrice] = useState([]);
    const [sumaryLoad, setsumaryLoad] = useRecoilState(sumaryLoading);
    const [, setDateDisabled] = useRecoilState(pickerDisable);
    const [ActualEmission,setActualEmission] = useState([])  
    const { metrictypelistLoading, metrictypelistdata, metrictypelisterror, getMetricTypelist } = useMetricTypelist()
    const { EnergyAllPlantsLoading, EnergyAllPlantsData, EnergyAllPlantsError, getEnergyAllPlants } = useEnergyAllPlants();
    const { DataAlertsPlantLoading, DataAlertsPlantData, DataAlertsPlantError, getDataAlertsPlant } = useDataAlertsPlant()
    const { MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentError, getMetricsInstrument } = useMetricsInstrument() 
    const {WaterEnergyLoading, WaterEnergyData, WaterEnergyError, getWaterEnergy } = useWaterEnergy(); 
    const {LPGEnergyLoading, LPGEnergyData, LPGEnergyError, getLPGEnergy } = useLPGEnergy(); 
    const {CNGEnergyLoading, CNGEnergyData, CNGEnergyError, getCNGEnergy } = useCNGEnergy(); 
    const {DGEnergyLoading, DGEnergyData, DGEnergyError, getDGEnergy } = useDGEnergy(); 
    const {SolarEnergyLoading, SolarEnergyData, SolarEnergyError, getSolarEnergy } = useSolarEnergy();
    const {Co2AllPlantsLoading, Co2AllPlantsData, Co2AllPlantsError, getCo2AllPlants } = useCo2AllPlants();
    const [curTheme] = useRecoilState(themeMode);
    
    const downloadExcel = (data, name,headers) => { 
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, name + ".xlsx");
    };

   
    useEffect(() => {
        getMetricTypelist()
        getMetricsInstrument()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        LinkChange(0)
        setsumaryLoad({ Energy: true, OEE: true, Exec: true, Parts: true, Alert: true, Task: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [btGroupValue])

    useEffect(() => {
        let loadstat = Object.keys(sumaryLoad).map(v => {
            return sumaryLoad[v].toString()
        })
        let load = "true"
        if (loadstat.includes(load)) {
            setDateDisabled(true)
        } else {
            setDateDisabled(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sumaryLoad])
console.log(sumaryLoad,"load")
    useEffect(() => {
        if (!MetricsInstrumentLoading && !MetricsInstrumentError && MetricsInstrumentData) {
            setInstrumentMet(MetricsInstrumentData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentLoading])
    // Energy Fetching Default Data
    useEffect(() => {
        if ((!metrictypelisterror && !metrictypelistLoading && metrictypelistdata)) {
            let typelists = []
            // eslint-disable-next-line array-callback-return
            metrictypelistdata.map((val) => {
                typelists.push({ "metric_name": val.name, "type": val.metric_type.type, "id": val.metric_type.id })
            })
            setTypelist(typelists)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metrictypelistLoading, metrictypelistdata, metrictypelisterror])

    useEffect(() => {
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
        if (childLine && childLine.length > 0 && userDefaultList.length>0 && headPlant.id) {
            // console.log(childLine,"getCo2AllPlantsgetCo2AllPlants")
            getCo2AllPlants(childLine, userDefaultList, headPlant)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])

    

    useEffect(() => {
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
        // console.log(childLine,"childLinechildLine",typelist.length,userDefaultList.length,headPlant.id,Co2AllPlantsData)
        setEngParentData([])
        setElectricityUnitPrice([]) 
        
        if (childLine && childLine.length > 0 && typelist.length > 0 && userDefaultList.length>0 && headPlant.id && !Co2AllPlantsLoading && Co2AllPlantsData && !Co2AllPlantsError) { 
            getEnergyAllPlants(childLine, 6, userDefaultList, typelist, headPlant)
            getWaterEnergy(childLine, 6, userDefaultList, typelist, headPlant)
            getCNGEnergy(childLine, 6, userDefaultList, typelist, headPlant)
            getLPGEnergy(childLine, 6, userDefaultList, typelist, headPlant)
            getDataAlertsPlant(childLine.filter(e => e.line_id !== headPlant.id), 6, userDefaultList)
            getDGEnergy(childLine, 6, userDefaultList, typelist, headPlant)
            getSolarEnergy(childLine, 6, userDefaultList, typelist, headPlant) 
            let dataUnit = []
            childLine.filter(e=> e.line_id !== headPlant.id).map(async (val,i) =>{
                let childPlant = userDefaultList.map(x => x.line).filter(v=> v.id === val.line_id)[0];
                let EnergyPrice =0
                let DGPrice = 0
                let SolarPrice = 0
                let WaterPrice = 0
                let LPGPrice = 0
                let CNGPrice = 0
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 1).length>0)) {
                    EnergyPrice = childPlant.node.nodes.filter(f=> f.type === 1)[0].price
                }
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 2).length>0)) {
                    WaterPrice = childPlant.node.nodes.filter(f=> f.type === 2)[0].price
                }
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 3).length>0)) {
                    LPGPrice = childPlant.node.nodes.filter(f=> f.type === 3)[0].price
                }
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 4).length>0)) {
                    CNGPrice = childPlant.node.nodes.filter(f=> f.type === 4)[0].price
                }
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 5).length>0)) {
                    DGPrice = childPlant.node.nodes.filter(f=> f.type === 5)[0].price
                }
                if (childPlant.node && childPlant.node.nodes && (childPlant.node.nodes.filter(f=> f.type === 6).length>0)) {
                    SolarPrice = childPlant.node.nodes.filter(f=> f.type === 6)[0].price
                }
                dataUnit.push({
                    plantName: childPlant.name,
                    UnitPrice: EnergyPrice ? EnergyPrice : 0,
                    DGPrice: DGPrice,
                    SolarPrice: SolarPrice,
                    CNGPrice:CNGPrice,
                    LPGPrice: LPGPrice,
                    WaterPrice : WaterPrice,
                    line_id: childPlant.id,
                    schema : childPlant.schema,
                    Co2List: Co2AllPlantsData.find(c=> c.PlantDetail.id === childPlant.id).Co2Factor
                })
            })
            // console.log(dataUnit,"dataUnitdataUnit")
            setElectricityUnitPrice(dataUnit);  
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id, typelist,Co2AllPlantsData]) 

    useEffect(() => {
        // console.log(EnergyAllPlantsData,"EnergyAllPlantsdataIndex")
        if (!EnergyAllPlantsLoading && EnergyAllPlantsData && !EnergyAllPlantsError) {
            let FinalData = []
            // eslint-disable-next-line array-callback-return
            EnergyAllPlantsData.map(val => {
                let daywiseData = []; 
                // eslint-disable-next-line array-callback-return
                val.Data.map((instrument) => {
                    if (instrument.dayData) {
                        // eslint-disable-next-line array-callback-return
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                // eslint-disable-next-line array-callback-return
                                data.map((valt) => {
                                    let metrictype = common.getmetrictype([valt.key], typelist)
                                    let total
                                    if (metrictype === 2 && !valt.offline){
                                        total = valt.endReading - valt.startReading;
                                    } else{
                                        total = valt.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                })
                                formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: parseInt(isFinite(calcFormula(formula)) && (calcFormula(formula) >= 0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                                }
                            }
                            else {
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: 0, time: "" })
                                }
                            }
                        })
                    }
                })
                FinalData.push({
                    plantName: val.PlantDetail.name,
                    line: val.PlantDetail.id,
                    schema:val.PlantDetail.plant_name,
                    Data: 0,
                    today: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2))
                })
            })
console.log(FinalData,"final")
            setEngParentData(FinalData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EnergyAllPlantsLoading, EnergyAllPlantsData, EnergyAllPlantsError])

    // Water Energy Default
    useEffect(() => {
        // console.log(EnergyAllPlantsData,"EnergyAllPlantsdataIndex")
        if (!WaterEnergyLoading && WaterEnergyData && !WaterEnergyError) {
            let FinalData = []
            // eslint-disable-next-line array-callback-return
            WaterEnergyData.map(val => {
                let daywiseData = []; 
                // eslint-disable-next-line array-callback-return
                val.Data.map((instrument) => {
                    if (instrument.dayData) {
                        // eslint-disable-next-line array-callback-return
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                // eslint-disable-next-line array-callback-return
                                data.map((valt) => {
                                    let metrictype = common.getmetrictype([valt.key], typelist)
                                    let total
                                    if (metrictype === 2 && !valt.offline){
                                        total = valt.endReading - valt.startReading;
                                    } else{
                                        total = valt.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                })
                                formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: parseInt(isFinite(calcFormula(formula)) && (calcFormula(formula) >= 0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                                }
                            }
                            else {
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: 0, time: "" })
                                }
                            }
                        })
                    }
                })
                FinalData.push({
                    plantName: val.PlantDetail.name,
                    line: val.PlantDetail.id,
                    schema:val.PlantDetail.plant_name,
                    Data: 0,
                    today: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2))
                })
            })

            setWaterTodayData(FinalData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [WaterEnergyLoading, WaterEnergyData, WaterEnergyError])

    // LPG Energy Default
    useEffect(() => {
        // console.log(EnergyAllPlantsData,"EnergyAllPlantsdataIndex")
        if (!LPGEnergyLoading && LPGEnergyData && !LPGEnergyError) {
            let FinalData = []
            // eslint-disable-next-line array-callback-return
            LPGEnergyData.map(val => {
                let daywiseData = []; 
                // eslint-disable-next-line array-callback-return
                val.Data.map((instrument) => {
                    if (instrument.dayData) {
                        // eslint-disable-next-line array-callback-return
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                // eslint-disable-next-line array-callback-return
                                data.map((valt) => {
                                    let metrictype = common.getmetrictype([valt.key], typelist)
                                    let total
                                    if (metrictype === 2 && !valt.offline){
                                        total = valt.endReading - valt.startReading;
                                    } else{
                                        total = valt.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                })
                                formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: parseInt(isFinite(calcFormula(formula)) && (calcFormula(formula) >= 0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                                }
                            }
                            else {
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: 0, time: "" })
                                }
                            }
                        })
                    }
                })
                FinalData.push({
                    plantName: val.PlantDetail.name,
                    line: val.PlantDetail.id,
                    schema:val.PlantDetail.plant_name,
                    Data: 0,
                    today: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2))
                })
            })

            setLPGTodayData(FinalData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LPGEnergyLoading, LPGEnergyData, LPGEnergyError])

    // CNG Energy Default
    useEffect(() => {
        // console.log(EnergyAllPlantsData,"EnergyAllPlantsdataIndex")
        if (!CNGEnergyLoading && CNGEnergyData && !CNGEnergyError) {
            let FinalData = []
            // eslint-disable-next-line array-callback-return
            CNGEnergyData.map(val => {
                let daywiseData = []; 
                // eslint-disable-next-line array-callback-return
                val.Data.map((instrument) => {
                    if (instrument.dayData) {
                        // eslint-disable-next-line array-callback-return
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                // eslint-disable-next-line array-callback-return
                                data.map((valt) => {
                                    let metrictype = common.getmetrictype([valt.key], typelist)
                                    let total
                                    if (metrictype === 2 && !valt.offline){
                                        total = valt.endReading - valt.startReading;
                                    } else{
                                        total = valt.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                })
                                
                                formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                // console.log(instrument.vi.formula,"instrument.vi.formula",formula,val.PlantDetail.name)
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: parseInt(isFinite(calcFormula(formula)) && (calcFormula(formula) >= 0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                                }
                            }
                            else {
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: 0, time: "" })
                                }
                            }
                        })
                    }
                })
                FinalData.push({
                    plantName: val.PlantDetail.name,
                    line: val.PlantDetail.id,
                    schema:val.PlantDetail.plant_name,
                    Data: 0,
                    today: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2))
                })
            })

            setCNGTodayData(FinalData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CNGEnergyLoading, CNGEnergyData, CNGEnergyError])

    // DG Energy Default
    useEffect(() => {
        // console.log(EnergyAllPlantsData,"EnergyAllPlantsdataIndex")
        if (!DGEnergyLoading && DGEnergyData && !DGEnergyError) {
            let FinalData = []
            // eslint-disable-next-line array-callback-return
            DGEnergyData.map(val => {
                let daywiseData = []; 
                // eslint-disable-next-line array-callback-return
                val.Data.map((instrument) => {
                    if (instrument.dayData) {
                        // eslint-disable-next-line array-callback-return
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                // eslint-disable-next-line array-callback-return
                                data.map((valt) => {
                                    let metrictype = common.getmetrictype([valt.key], typelist)
                                    let total
                                    if (metrictype === 2 && !valt.offline){
                                        total = valt.endReading - valt.startReading;
                                    } else{
                                        total = valt.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                })
                                formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: parseInt(isFinite(calcFormula(formula)) && (calcFormula(formula) >= 0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                                }
                            }
                            else {
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: 0, time: "" })
                                }
                            }
                        })
                    }
                })
                FinalData.push({
                    plantName: val.PlantDetail.name,
                    line: val.PlantDetail.id,
                    schema:val.PlantDetail.plant_name,
                    Data: 0,
                    today: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2))
                })
            })

            setDGTodayData(FinalData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DGEnergyLoading, DGEnergyData, DGEnergyError])

    // Solar Energy Default
    useEffect(() => {
        // console.log(EnergyAllPlantsData,"EnergyAllPlantsdataIndex")
        if (!SolarEnergyLoading && SolarEnergyData && !SolarEnergyError) {
            let FinalData = []
            // eslint-disable-next-line array-callback-return
            SolarEnergyData.map(val => {
                let daywiseData = []; 
                // eslint-disable-next-line array-callback-return
                val.Data.map((instrument) => {
                    if (instrument.dayData) {
                        // eslint-disable-next-line array-callback-return
                        instrument.dayData.map((data) => {
                            let formula = instrument.vi.formula
                            if (data.length > 0) {
                                // eslint-disable-next-line array-callback-return
                                data.map((valt) => {
                                    let metrictype = common.getmetrictype([valt.key], typelist)
                                    let total
                                    if (metrictype === 2 && !valt.offline){
                                        total = valt.endReading - valt.startReading;
                                    } else{
                                        total = valt.value
                                    } 
                                    total = total === null ? 0 : total;
                                    formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                })
                                formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: parseInt(isFinite(calcFormula(formula)) && (calcFormula(formula) >= 0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
                                }
                            }
                            else {
                                if (instrument.vi.id === val.EnergyAsset) {
                                    daywiseData.push({ data: 0, time: "" })
                                }
                            }
                        })
                    }
                })
                FinalData.push({
                    plantName: val.PlantDetail.name,
                    line: val.PlantDetail.id,
                    schema:val.PlantDetail.plant_name,
                    Data: 0,
                    today: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2))
                })
            })

            setSolarTodayData(FinalData)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SolarEnergyLoading, SolarEnergyData, SolarEnergyError])

    // Data Alerts Default
    useEffect(() => {
        if (!DataAlertsPlantLoading && DataAlertsPlantData && !DataAlertsPlantError) {
            let Alertresult = [];
            DataAlertsPlantData.forEach(x => Alertresult = [...Alertresult, ...x]);
            let AlertData = Alertresult.map(e => {
                console.log(e,"e")
                return {
                    ...e, actual_range: 0,
                    today: e.Data.count ?  Number(e.Data.count) :0,
                    line_name: e.childPlant.name,
                    plantName:e.childPlant.name,
                    line: e.childPlant.id,
                    schema:e.childPlant.plant_name
                }
            })
            setAlertPlants(AlertData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DataAlertsPlantLoading, DataAlertsPlantData, DataAlertsPlantError])


    function getplants(e) {
        if (e.planttype === 2) {
          
            let linkarr = [...navigateArr]
            linkarr.push({ name: e.title, id: 2 })
            setnavigateArr(linkarr)
            setlinkIndex(1)
        } else {
            console.log(e,"eChildPlant") 
            setChoosenModule(e.module);
            setChoosenType(e.type);
            setChoosenSchema(e.schema)
            setDailogtitle(e.title)
            setPlantName(e.name)
            setIsOpen(true);
        }
    }
    function LinkChange(e) {
        if (e === 0) {
            if (document.getElementById('ParentSummary')){
                document.getElementById('ParentSummary').style.display = 'grid';
            }
                
            if (document.getElementById('childsummary')){
                document.getElementById('childsummary').style.display = 'none';
                setChildTitle("");
                setChildData([]);
            }
                
        }else{
            if(e === 1 && Subchildarr.length>0){
                setChildTitle(Subchildarr[0].title);
                setChildData(Subchildarr[0].data);    
            } 
        }
        // console.log(Subchildarr,"Subchildarr",e)
        let id = e+1
        setnavigateArr(navigateArr.slice(0, id))
        setlinkIndex(e)
    }

    const handleDialogClose = () => {
        setIsOpen(false); 
        setChoosenModule("");
        setChoosenType("");
        setChoosenSchema("")
    }

    useEffect(() => {
        let submoduleArr = ['co2','oee','execution','Parts','Tasks','water','Gas','energy','energy Price','Connectivity','Data Alerts']
        let ConsupArr2 = ['Main Incomer','Solar Consumption','DG Consumption']
        let GasArr2 = ['LPG Consumption','CNG Consumption']
        let PriceArr2 = ['Electricity Price','DG Price','Solar Price','Water Price','LPG Price','CNG Price']
     if(moduleName === 'BI' && subModule1 === 'co2' && ActualEmission.length > 0 && !sumaryLoad.Energy && flag){
        renderChild(ActualEmission,t("Co2 Emission"))
        setFlag(false)
     }else if (moduleName && !['BI'].includes(moduleName)){
        setErrorPage(true)
     }else if (moduleName === 'BI' && subModule1 && !submoduleArr.includes(subModule1)){
        setErrorPage(true)
     }else if (moduleName === 'BI' && subModule1=== 'Gas' && queryParam && !GasArr2.includes(queryParam)){
        setErrorPage(true)
     }else if (moduleName === 'BI' && subModule1=== 'energy' && queryParam && !ConsupArr2.includes(queryParam)){
        setErrorPage(true)
     }else if (moduleName === 'BI' && subModule1=== 'energy Price' && queryParam && !PriceArr2.includes(queryParam)){
        setErrorPage(true)
     }
    //  console.log(moduleName,subModule1,"moduleName,subModule1",queryParam)
    },[ActualEmission,moduleName,subModule1,queryParam])

    const redirectToPlant = () => {
      
        // const url = `${configParam.APP_URL}/${choosenSchema}/${choosenModule}/${choosenType}/range=${moment(customdatesval.StartDate).format('DD-MM-YYYY HH:mm:ss')};${moment(customdatesval.EndDate).format('DD-MM-YYYY HH:mm:ss')}`;
        // https://mango-bay-00d944000-140routingforeac.eastasia.5.azurestaticapps.net
        let url
        if(choosenModule === 'Tasks'){
            url = `${configParam.APP_URL}/${choosenSchema}/${choosenModule}`;
        }else if(choosenType === 'connectivity'){
            url = `${configParam.APP_URL}/${choosenSchema}/${choosenModule}/${choosenType}`;
        }
        else{
            url = `${configParam.APP_URL}/${choosenSchema}/${choosenModule}/${choosenType}/range=${moment(customdatesval.StartDate).format('DD-MM-YYYY HH:mm:ss')};${moment(customdatesval.EndDate).format('DD-MM-YYYY HH:mm:ss')}`;
        }
        
        console.log(url,"urlurl")
        window.open(url);
        localStorage.setItem("moduleName",choosenType)
        handleDialogClose();
    };
    const renderChild = (data,title ,idx) => {
      console.log(data,title,"check BI")
        let linkarr = [...navigateArr]
        console.log(data, title,linkarr,"child")
        linkarr.push({ name: title, id: idx ? idx : 2 })
        if(document.getElementById('ParentSummary'))
            document.getElementById('ParentSummary').style.display = 'none';
        if(document.getElementById('childsummary'))
            document.getElementById('childsummary').style.display = 'grid';
        setnavigateArr(linkarr)
        if(data[0].subChild){
            setSubchildarr([{data:data,title:title}])
        }
        setChildTitle(title);
        setChildData(data);
        setlinkIndex(idx ? 2 : 1)
    }
   
    return (
        <React.Fragment>
            {
                linkIndex || (childTitle === 'Electricity Consumption' || childTitle === 'Energy Price') ? 
                <React.Fragment>
<div className="flex items-center justify-between py-2 px-4 h-[48px] bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
                <div>
                       {/* <span style={{ fontSize: '16px', color: '#A8A8A8' }}>Dashboard</span> */}
                       {linkIndex ? 
                    navigateArr.map((v, i) => {
                        return (
                            <span
                                key={v.name}
                                onClick={() => LinkChange(i)}
                                style={{ cursor: 'pointer', fontSize: '16px', fontWeight:(i === linkIndex) ? 400 : 500,color: (i === linkIndex) ? (curTheme === 'dark' ? '#eeeeee'   :'#161616') : '#6e6e6e' }}>
                                <span className="font-geist-sans">{i ? ' / ':''}</span>{v.name}
                            </span>
                        )
                    })
                    :
                    null
                    }
                </div>
                <div>
                {(childTitle === 'Electricity Consumption' || childTitle === 'Energy Price') && 
                <Button type='ghost' icon={Download}   id={"download-Energy"}
                onClick={(e) => {
                    const headers = (childTitle === 'Electricity Consumption') ? ["Name","Unit"] : ["Name","Price"]; 
                    let data = childData[0].subChild.map(x=>{
                        let key = (childTitle === 'Electricity Consumption') ? "Unit" : "Price"
                        return {
                            "Name" : x.title,
                            [key] : x.Data.reduce((partialSum, x) => partialSum + x.actual_range, 0).toFixed(2) + " kWh",
                        }
                    })
                     downloadExcel(data,"Exported Data",headers)
                }}  />
                   }
                </div>
            </div>
            <Divider variant="divider1"></Divider>
            </React.Fragment>
            :<></>
            }
            
            <Grid container spacing={4} style={{padding:"16px" }} id="ParentSummary">
                <Grid item xs={12} >
                    <EnergyDashboard userDefaultList={userDefaultList} headPlant={headPlant} typelist={typelist}
                        btGroupValue={btGroupValue}
                        customdatesval={customdatesval}
                        defaultData={EngParentData}
                        getChild={renderChild} 
                        electricityUnitPrice={electricityUnitPrice}
                        loading={(e) => setsumaryLoad({ ...sumaryLoad, Energy: e })}
                        actualEmission={(e)=>setActualEmission(e)}
                        waterDataToday ={WaterTodayData} 
                        CNGTodayData={CNGTodayData}
                        LPGTodayData={LPGTodayData}
                        DGTodayData={DGTodayData}
                        SolarTodayData={SolarTodayData}
                    />
                </Grid>
                <Grid xs={3} >
                    <Card style={{cursor:'pointer',height:"160px"}} onClick={()=>renderChild(ActualEmission,t("Co2 Emission"))}>
                        <div  className='flex flex-col justify-between'  >
                            <div className='flex justify-between'>
                            <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("C02Emission")} />
                                {sumaryLoad.Energy ? <CircularProgress disableShrink size={15} color="primary" /> :<> </>}
                                <Co2ICon />
                            </div>
                            <div className="flex items-center gap-2">
                            <TypographyNDL mono  variant="display-lg">
                            {(ActualEmission.reduce((partialSum, x) => partialSum + Number(x.actual_range), 0) ).toFixed(0)  }</TypographyNDL>
                            <TypographyNDL  variant="display-lg">Tons CO2e</TypographyNDL>
                            </div>
                           
                            <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{(Number((ActualEmission.reduce((partialSum, x) => partialSum + Number(x.today), 0)).toFixed(0))).toFixed(0) + " Tons CO2e"}</TypographyNDL>
                             </div>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={3} >
                    <OEE getChild={sumaryLoad.OEE ? '' : renderChild}
                        headPlant={headPlant}
                        loading={(e,data,str) => {
                            console.log(e,data,str,"e value")
                            setsumaryLoad({ ...sumaryLoad, OEE: e });
                           if(moduleName === 'BI' && subModule1 === 'oee'){
                            renderChild(data,str)
                           }
                        }}
                    />
                </Grid>
                <Grid item xs={3} >
                    <Execution getChild={sumaryLoad.Exec ? '' : renderChild}
                        DatesSearch={DatesSearch}
                        headPlant={headPlant}
                        customdatesval={customdatesval}
                        loading={(e,data,str) => {
                            setsumaryLoad({ ...sumaryLoad, Exec: e })
                            if(moduleName === 'BI' && subModule1 === 'execution'){
                                renderChild(data,str)
                               }
                        }
                    }
                    />
                </Grid>
                <Grid item xs={3} >
                    <PartsProduced getChild={sumaryLoad.Parts ? '' : renderChild}
                        DatesSearch={DatesSearch}
                        customdatesval={customdatesval}
                        headPlant={headPlant}
                        loading={(e,data,str) => {
                            setsumaryLoad({ ...sumaryLoad, Parts: e });
                            if(moduleName === 'BI' && subModule1 === 'Parts'){
                                renderChild(data,str)
                               }
                        }}
                    />
                </Grid>
                <Grid item xs={3} >
                    <Tasks getChild={sumaryLoad.Task ? '' : renderChild}
                        DatesSearch={DatesSearch}
                        headPlant={headPlant}
                        customdatesval={customdatesval}
                        loading={(e,data,str) =>{

                         setsumaryLoad({ ...sumaryLoad, Task: e });
                         if(moduleName === 'BI' && subModule1 === 'Tasks'){
                            renderChild(data,str)
                           }
                        }}
                    />
                </Grid>
                <Grid item xs={3} >
                    <DataAlert
                        userDefaultList={userDefaultList}
                        headPlant={headPlant}
                        btGroupValue={btGroupValue}
                        getChild={sumaryLoad.Alert ? '' : renderChild}
                        AlertDefault={AlertPlants}
                        DatesSearch={DatesSearch}
                        customdatesval={customdatesval}
                        loading={(e) => {
                            setsumaryLoad({ ...sumaryLoad, Alert: e });
                          
                        }}
                    />
                </Grid>
                <Grid item xs={3} >
                    <ConnectivityAlert
                        userDefaultList={userDefaultList}
                        headPlant={headPlant}
                        InstrumentMet={InstrumentMet}
                        getChild={renderChild}
                    />
                </Grid>
                
            </Grid>
            <Grid container spacing={4} style={{ padding:"16px", display: 'none' }} id="childsummary">
                <ChildSummary childData={childData} childTitle={childTitle} getplants={getplants} getChild={renderChild}/>
            </Grid>
            <Dialog onClose={handleDialogClose} size={"md"} aria-labelledby="entity-dialog-title" open={isOpen}>
                <DialogTitle id="entity-dialog-title" > 
                    <Typography value ='Are you sure want to explore the dashboard?' variant='heading-02-xs' />
                    </DialogTitle>
                <DialogContent dividers>       
                    <Typography color='secondary' variant='paragraph-s'>
                        Do you really want to open the {PlantName+'`s '+Dailogtitle} dashboard? This will open in new tab.
                    </Typography>
                    <DialogActions>
                        <Button type='secondary' onClick={() => { handleDialogClose() }} value={t('Cancel')} />
                        <Button value={t('Open')} onClick={redirectToPlant} />

                    </DialogActions>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
export default SummaryDashboard;
