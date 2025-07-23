import React,{useState,useEffect} from 'react';
import {useParams} from "react-router-dom"
import { useTranslation } from "react-i18next";
import moment from 'moment';
import configParam from "config";
import Card from "components/Core/KPICards/KpiCardsNDL"; 
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import Grid from 'components/Core/GridNDL' 
import GasIcon from 'assets/neo_icons/Dashboard/Gas_Icon.svg'; 
import CO2 from 'assets/neo_icons/Dashboard/CO2.svg' 
import Incomer from 'assets/neo_icons/Dashboard/Incomer_Icon.svg'
import WaterIcon from 'assets/neo_icons/Dashboard/Water_Icon.svg'
import Equipments from 'assets/neo_icons/Dashboard/Equipment_Icon.svg'
import SolarIcon from 'assets/neo_icons/Dashboard/Solar_Icon.svg'
import { DateSrch} from 'recoilStore/atoms';
import { useRecoilState } from "recoil";  
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx";  
import useEnergyAllPlants from "../hooks/useEnergyAllPlants.jsx";
import useWaterEnergy from "../hooks/useWaterEnergy.jsx"
import useLPGEnergy from "../hooks/useLPGEnergy.jsx"
import useCNGEnergy from "../hooks/useCNGEnergy.jsx"
import useDGEnergy from "../hooks/useDGEnergy.jsx"
import useSolarEnergy from "../hooks/useSolarEnergy.jsx"
import { calcFormula } from 'components/Common/commonFunctions.jsx';
import TypographyNDL from 'components/Core/Typography/TypographyNDL.jsx'
import ElectricityIcons from 'assets/neo_icons/newUIIcons/Electricity.svg?react';
import WaterIcons from 'assets/neo_icons/newUIIcons/Water.svg?react';
import GasIcons from 'assets/neo_icons/newUIIcons/Gas.svg?react';
import MoneyIcons from 'assets/neo_icons/newUIIcons/Money.svg?react';

// impor



function EnergyDashboard(props){
    const { t } = useTranslation(); 
    let {moduleName,subModule1,queryParam} = useParams()
    const [electricityTitle,setElectricityTitle] = useState('Electricity Consumption')
    const [gasTitle,setGasTitle] = useState('Gas Consumption')
    const [priceTitle,setPriceTitle] = useState('Energy Price')
    const [ParentData,setParentData] = useState([]) 
    const [WaterData,setWaterData] = useState([]) 
    const [WaterFinalData,setWaterFinalData] = useState([]) 
    const [ActualData,setActualData] = useState([])  
    const [ActualPrice,setActualPrice] = useState([])  
    const [ActualDGPrice,setActualDGPrice] = useState([])  
    const [ActualSolarPrice,setActualSolarPrice] = useState([])  
    const [ActualWaterPrice,setActualWaterPrice] = useState([])  
    const [ActualLPGPrice,setActualLPGPrice] = useState([])  
    const [ActualCNGPrice,setActualCNGPrice] = useState([])  
    const [AllEnergyPrice,setAllEnergyPrice] = useState([])  
    const [LPGData,setLPGData] = useState([])  
    const [CNGData,setCNGData] = useState([])
    const [DGData,setDGData] = useState([]) 
    const [SolarData,setSolarData] = useState([]) 
    const [ActualCNGData,setActualCNGData] = useState([]) 
    const [ActualLPGData,setActualLPGData] = useState([]) 
    const [GasData,setGasData]  = useState([]) 
    const [ActualSolarData,setActualSolarData] = useState([])
    const [ActualDGData,setActualDGData] = useState([])
    const [AllEnergyData,setAllEnergyData] = useState([])
    // const [ActualEmission,setActualEmission] = useState([])  
    const [flag,setFlag] = useState(true)
    const [Loading,setLoading] = useState(false)  
    const [Loadingwater,setLoadingwater] = useState(false)  
    const [LoadingGas,setLoadingGas] = useState(false)  
    const [LoadingPrice,setLoadingPrice] = useState(false)  
    const [,setDatesSearch] = useRecoilState(DateSrch); 
    const {EnergyAllPlantsLoading, EnergyAllPlantsData, EnergyAllPlantsError, getEnergyAllPlants } = useEnergyAllPlants(); 
    const {WaterEnergyLoading, WaterEnergyData, WaterEnergyError, getWaterEnergy } = useWaterEnergy(); 
    const {LPGEnergyLoading, LPGEnergyData, LPGEnergyError, getLPGEnergy } = useLPGEnergy(); 
    const {CNGEnergyLoading, CNGEnergyData, CNGEnergyError, getCNGEnergy } = useCNGEnergy(); 
    const {DGEnergyLoading, DGEnergyData, DGEnergyError, getDGEnergy } = useDGEnergy(); 
    const {SolarEnergyLoading, SolarEnergyData, SolarEnergyError, getSolarEnergy } = useSolarEnergy(); 
    

    useEffect(() => {
        let childLine = JSON.parse(localStorage.getItem('child_line_token'));
        setParentData([])
        setWaterData([]) 
        if(childLine && childLine.length>0 && props.typelist.length > 0 && props.userDefaultList.length){
            setLoading(true) 
            setLoadingwater(true)
            setLoadingGas(true)
            setLoadingPrice(true)
            props.loading(true)
            // console.log(props.btGroupValue,"props.btGroupValue",props.customdatesval,childLine,props.userDefaultList)
            getEnergyAllPlants(childLine,props.btGroupValue,props.userDefaultList,props.typelist,props.headPlant) 
            getWaterEnergy(childLine,props.btGroupValue,props.userDefaultList,props.typelist,props.headPlant)
            getLPGEnergy(childLine,props.btGroupValue,props.userDefaultList,props.typelist,props.headPlant) 
            getCNGEnergy(childLine,props.btGroupValue,props.userDefaultList,props.typelist,props.headPlant) 
            getDGEnergy(childLine,props.btGroupValue,props.userDefaultList,props.typelist,props.headPlant) 
            getSolarEnergy(childLine,props.btGroupValue,props.userDefaultList,props.typelist,props.headPlant) 
        }   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant.id,props.typelist,props.customdatesval])
 
    useEffect(() => {
        if (!EnergyAllPlantsLoading && EnergyAllPlantsData && !EnergyAllPlantsError) {
            let FinalData = []
            setParentData([])
            if(EnergyAllPlantsData.length>0){
                // eslint-disable-next-line array-callback-return
                EnergyAllPlantsData.map(val=>{
                    let daywiseData = [];  
                    // eslint-disable-next-line array-callback-return
                    val.Data.map((instrument) => { 
                            if(instrument.dayData){
                                // eslint-disable-next-line array-callback-return
                                instrument.dayData.map((data) => {
                                    let formula = instrument.vi ? instrument.vi.formula : ''
                                    if (data.length > 0) {
                                        // eslint-disable-next-line array-callback-return
                                        data.map((valt) => {
                                            let metrictype = common.getmetrictype([valt.key], props.typelist)
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
                                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && (calcFormula(formula)>=0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
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
                        Data: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)),
                        today: props.btGroupValue === 6 ? Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)) : 0
                    })
                })
            }
            // console.log(FinalData,"setParentData")
            setParentData(FinalData)
            setDatesSearch(false) 
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EnergyAllPlantsLoading, EnergyAllPlantsData, EnergyAllPlantsError])

    // DG Energy
    useEffect(() => {
        if (!DGEnergyLoading && DGEnergyData && !DGEnergyError) {
            let FinalData = []
            setDGData([])
            if(DGEnergyData.length>0){
                // eslint-disable-next-line array-callback-return
                DGEnergyData.map(val=>{
                    let daywiseData = [];  
                    // eslint-disable-next-line array-callback-return
                    val.Data.map((instrument) => { 
                            if(instrument.dayData){
                                // eslint-disable-next-line array-callback-return
                                instrument.dayData.map((data) => {
                                    let formula = instrument.vi ? instrument.vi.formula : ''
                                    if (data.length > 0) {
                                        // eslint-disable-next-line array-callback-return
                                        data.map((valt) => {
                                            let metrictype = common.getmetrictype([valt.key], props.typelist)
                                            let total
                                            if (metrictype === 2 && !valt.offline){
                                                 total = valt.endReading - valt.startReading;
                                            }
                                            else{
                                                 total = valt.value
                                            }
                                            total = total === null ? 0 : total;
                                            formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                        })
                                        formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                         
                                        if (instrument.vi.id === val.EnergyAsset) {
                                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && (calcFormula(formula)>=0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
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
                        Data: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)),
                        today: props.btGroupValue === 6 ? Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)) : 0
                    })
                })
            }
            setDGData(FinalData)
            // console.log(FinalData,"DGEnFinalData")
            // setDatesSearch(false) 
            // setLoading(false) 
            // props.loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DGEnergyLoading, DGEnergyData, DGEnergyError])

    // Solar Energy
    useEffect(() => {
        if (!SolarEnergyLoading && SolarEnergyData && !SolarEnergyError) {
            let FinalData = []
            setSolarData([])
            if(SolarEnergyData.length>0){
                // eslint-disable-next-line array-callback-return
                SolarEnergyData.map(val=>{
                    let daywiseData = [];  
                    // eslint-disable-next-line array-callback-return
                    val.Data.map((instrument) => { 
                            if(instrument.dayData){
                                // eslint-disable-next-line array-callback-return
                                instrument.dayData.map((data) => {
                                    let formula = instrument.vi ? instrument.vi.formula : ''
                                    if (data.length > 0) {
                                        // eslint-disable-next-line array-callback-return
                                        data.map((valt) => {
                                            let metrictype = common.getmetrictype([valt.key], props.typelist)
                                            let total
                                            if (metrictype === 2 && !valt.offline) {
                                                 total = valt.endReading - valt.startReading;
                                            }
                                            else{
                                                 total = valt.value
                                            }
                                            total = total === null ? 0 : total;
                                            formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                        })
                                        formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                         
                                        if (instrument.vi.id === val.EnergyAsset) {
                                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && (calcFormula(formula)>=0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
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
                        Data: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)),
                        today: props.btGroupValue === 6 ? Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)) : 0
                    })
                })
            }
            setSolarData(FinalData)
            // console.log(FinalData,"SolarFinalData")
            // setDatesSearch(false) 
            // setLoading(false) 
            // props.loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SolarEnergyLoading, SolarEnergyData, SolarEnergyError])
     
    useEffect(()=>{
        if((props.defaultData.length>0) && (ParentData.length > 0)){
            let actualData = props.defaultData.map(e=>{
                let filterplant = ParentData.filter(f=>f.plantName === e.plantName) 
                let todayFilter = filterplant[0] ? filterplant[0].today : 0
                return {...e , actual_range: filterplant[0] ? filterplant[0].Data : 0, 
                    today: (props.btGroupValue === 6) ? todayFilter : e.today,
                    line_name: filterplant[0] ? filterplant[0].plantName : '',
                    module: 'dashboard',
                    type: t("Energy Consumption"),
                    title: 'Energy',
                    icon: Incomer,
                    unit:'kWh'
                }
            })
            setActualData(actualData) 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.defaultData,ParentData]) 
    
    useEffect(()=>{
        if((props.DGTodayData.length>0) && (DGData.length > 0)){
            let actualData = props.DGTodayData.map(e=>{
                let filterplant = DGData.filter(f=>f.plantName === e.plantName) 
                let todayFilter = filterplant[0] ? filterplant[0].today : 0
                return {...e , actual_range: filterplant[0] ? filterplant[0].Data : 0, 
                    today: (props.btGroupValue === 6) ? todayFilter : e.today,
                    line_name: filterplant[0] ? filterplant[0].plantName : '',
                    module: 'dashboard',
                    type: t("Energy Consumption"),
                    title: 'Energy',
                    icon: Equipments,
                    unit:'kWh'
                }
            })
            setActualDGData(actualData) 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.DGTodayData,DGData])
    
    useEffect(()=>{
        if((props.SolarTodayData.length>0) && (SolarData.length > 0)){
            let actualData = props.SolarTodayData.map(e=>{
                let filterplant = SolarData.filter(f=>f.plantName === e.plantName) 
                let todayFilter = filterplant[0] ? filterplant[0].today : 0
                return {...e , actual_range: filterplant[0] ? filterplant[0].Data : 0, 
                    today: (props.btGroupValue === 6) ? todayFilter : e.today,
                    line_name: filterplant[0] ? filterplant[0].plantName : '',
                    module: 'dashboard',
                    type: t("Energy Consumption"),
                    title: 'Energy',
                    icon: SolarIcon,
                    unit:'kWh'
                }
            })
            setActualSolarData(actualData) 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.SolarTodayData,SolarData])

    useEffect(()=>{
        if((props.waterDataToday.length>0) && (WaterData.length > 0)){
            let actualData = props.waterDataToday.map(e=>{
                let filterplant = WaterData.filter(f=>f.plantName === e.plantName) 
                let todayFilter = filterplant[0] ? filterplant[0].today : 0
                return {...e , actual_range: filterplant[0] ? filterplant[0].Data : 0, 
                    today: (props.btGroupValue === 6) ? todayFilter : e.today,
                    line_name: filterplant[0] ? filterplant[0].plantName : '',
                    module: 'dashboard',
                    type: t("Energy Consumption"),
                    title: 'Energy',
                    icon: WaterIcon,
                    unit:'kL'
                }
            })
            setLoadingwater(false)
            console.log(WaterData,"waterDataToday",props.waterDataToday)
            setWaterFinalData(actualData) 
            if(moduleName === 'BI' && subModule1 && subModule1.toLowerCase() === 'water' && flag){
                GetChildFn(actualData,t("Water Consumption"),false)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.waterDataToday,WaterData,moduleName,subModule1]) 

    useEffect(()=>{
        if(ActualData.length > 0){
            let ActualUnit = props.electricityUnitPrice.map(e=>{
                let filData = ActualData.filter(f=>f.plantName === e.plantName) 
                return {...e , actual_range: filData[0] ? (filData[0].actual_range * e.UnitPrice) : 0, 
                    today: filData[0] ? (filData[0].today * e.UnitPrice) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Electricity Price"),
                    title: 'Energy',
                    icon: MoneyIcons,
                    unit:'',
                    currency:"₹ "
                }
            })
            let ActualCo2 = props.electricityUnitPrice.map(e=>{
                let filData = ActualData.filter(f=>f.plantName === e.plantName) 
                let DefCo2 = e.Co2List.filter(d=> d.default_value)
                let Co2Default = DefCo2.length ? Number(DefCo2[0].co2_value) : configParam.CO2_tag
                let co2Today = Co2Default  
                let co2Range = Co2Default
                e.Co2List.map(c=> { 
                    if( (moment().startOf('day').isBetween(moment(c.starts_at), moment(c.ends_at)) || moment().startOf('day').isSame(c.starts_at)) && (moment().isBetween(moment(c.starts_at), moment(c.ends_at)) || moment().isSame(c.ends_at))){
                        co2Today = Number(c.co2_value)
                    }
                    if( (moment(props.customdatesval.StartDate).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(props.customdatesval.StartDate).isSame(c.starts_at)) && (moment(props.customdatesval.EndDate).isBetween(moment(c.starts_at), moment(c.ends_at)) || moment(props.customdatesval.EndDate).isSame(c.ends_at))){
                        co2Range = Number(c.co2_value)
                    }
                })
                return {...e , actual_range: filData[0] ? (filData[0].actual_range/1000 * co2Range).toFixed(0) : 0, 
                    today: filData[0] ? (filData[0].today/1000 * co2Today).toFixed(0) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Co2 Emission"),
                    title: 'Energy',
                    icon: CO2,
                    unit:'Tons CO2e'
                }
            })
            setActualPrice(ActualUnit)
            props.actualEmission(ActualCo2)
            // setActualEmission(ActualCo2)
        }
        if(ActualDGData.length > 0){
            let ActualDGUnit = props.electricityUnitPrice.map(e=>{
                let filData = ActualDGData.filter(f=>f.plantName === e.plantName) 
                return {...e , actual_range: filData[0] ? (filData[0].actual_range * e.DGPrice) : 0, 
                    today: filData[0] ? (filData[0].today * e.DGPrice) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Electricity Price"),
                    title: 'Energy',
                    icon: MoneyIcons,
                    unit:'',
                    currency:"₹ "
                }
            })
            setActualDGPrice(ActualDGUnit)
        }
        if(ActualSolarData.length > 0){
            let ActualSolarUnit = props.electricityUnitPrice.map(e=>{
                let filData = ActualSolarData.filter(f=>f.plantName === e.plantName) 
                return {...e , actual_range: filData[0] ? (filData[0].actual_range * e.SolarPrice) : 0, 
                    today: filData[0] ? (filData[0].today * e.SolarPrice) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Electricity Price"),
                    title: 'Energy',
                    icon: MoneyIcons,
                    unit:'',
                    currency:"₹ "

                }
            })
            setActualSolarPrice(ActualSolarUnit)
        }
        if(WaterFinalData.length > 0){
            let ActualWaterUnit = props.electricityUnitPrice.map(e=>{
                let filData = WaterFinalData.filter(f=>f.plantName === e.plantName) 
                return {...e , actual_range: filData[0] ? (filData[0].actual_range * e.WaterPrice) : 0, 
                    today: filData[0] ? (filData[0].today * e.WaterPrice) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Electricity Price"),
                    title: 'Energy',
                    icon: MoneyIcons,
                    unit:'',
                    currency:"₹ "

                }
            })
            setActualWaterPrice(ActualWaterUnit)
        }
        if(ActualCNGData.length > 0){
            let ActualCNGUnit = props.electricityUnitPrice.map(e=>{
                let filData = ActualCNGData.filter(f=>f.plantName === e.plantName) 
                return {...e , actual_range: filData[0] ? (filData[0].actual_range * e.CNGPrice) : 0, 
                    today: filData[0] ? (filData[0].today * e.CNGPrice) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Electricity Price"),
                    title: 'Energy',
                    icon: MoneyIcons,
                    unit:'' ,
                    currency:"₹ "
                }
            })
            setActualCNGPrice(ActualCNGUnit)
        }
        if(ActualLPGData.length > 0){
            let ActualLPGUnit = props.electricityUnitPrice.map(e=>{
                let filData = ActualLPGData.filter(f=>f.plantName === e.plantName) 
                return {...e , actual_range: filData[0] ? (filData[0].actual_range * e.LPGPrice) : 0, 
                    today: filData[0] ? (filData[0].today * e.LPGPrice) : 0,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Electricity Price"),
                    title: 'Energy',
                    icon: MoneyIcons,
                    unit:'' ,
                    currency:"₹ "
                }
            })
            setActualLPGPrice(ActualLPGUnit)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ActualData,ActualDGData,ActualSolarData,WaterFinalData,ActualCNGData,ActualLPGData,props.electricityUnitPrice])

    //Water Energy
    useEffect(() => {
        if (!WaterEnergyLoading && WaterEnergyData && !WaterEnergyError) {
            let FinalData = []
            
            if(WaterEnergyData.length>0){
                // eslint-disable-next-line array-callback-return
                WaterEnergyData.map(val=>{
                    let daywiseData = [];  
                    // eslint-disable-next-line array-callback-return
                    val.Data.map((instrument) => { 
                            if(instrument.dayData){
                                // eslint-disable-next-line array-callback-return
                                instrument.dayData.map((data) => {
                                    let formula = instrument.vi ? instrument.vi.formula : ''
                                    if (data.length > 0) {
                                        // eslint-disable-next-line array-callback-return
                                        data.map((valt) => {
                                            let metrictype = common.getmetrictype([valt.key], props.typelist)
                                            let total
                                            if (metrictype === 2 && !valt.offline) {
                                                 total = valt.endReading - valt.startReading;
                                            }
                                            else{
                                                 total = valt.value
                                            }
                                            total = total === null ? 0 : total;
                                            formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                        })
                                        formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                         
                                        if (instrument.vi.id === val.EnergyAsset) {
                                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && (calcFormula(formula)>=0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
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
                        Data: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)),
                        today: props.btGroupValue === 6 ? Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)) : 0
                    })
                })
            }
            console.log(FinalData,"WaterFinalData")
            setWaterData(FinalData) 
            // setDatesSearch(false)  
            // props.loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [WaterEnergyLoading, WaterEnergyData, WaterEnergyError])

    //LPG Energy
    useEffect(() => {
        if (!LPGEnergyLoading && LPGEnergyData && !LPGEnergyError) {
            let FinalData = []
            setLPGData([])
            if(LPGEnergyData.length>0){
                // eslint-disable-next-line array-callback-return
                LPGEnergyData.map(val=>{
                    let daywiseData = [];  
                    // eslint-disable-next-line array-callback-return
                    val.Data.map((instrument) => { 
                            if(instrument.dayData){
                                // eslint-disable-next-line array-callback-return
                                instrument.dayData.map((data) => {
                                    let formula = instrument.vi ? instrument.vi.formula : ''
                                    if (data.length > 0) {
                                        // eslint-disable-next-line array-callback-return
                                        data.map((valt) => {
                                            let metrictype = common.getmetrictype([valt.key], props.typelist)
                                            let total
                                            if (metrictype === 2 && !valt.offline) {
                                             total = valt.endReading - valt.startReading;
                                            }
                                            else{
                                                 total = valt.value
                                            }
                                            total = total === null ? 0 : total;
                                            formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                        })
                                        formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                         
                                        if (instrument.vi.id === val.EnergyAsset) {
                                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && (calcFormula(formula)>=0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
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
                        Data: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)),
                        today: props.btGroupValue === 6 ? Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)) : 0
                    })
                })
            }
            // console.log(FinalData,"LPGFinalData")
            setLPGData(FinalData)
            // setDatesSearch(false) 
            // setLoading(false) 
            // props.loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [LPGEnergyLoading, LPGEnergyData, LPGEnergyError])

    //CNG Energy
    useEffect(() => {
        if (!CNGEnergyLoading && CNGEnergyData && !CNGEnergyError) {
            let FinalData = []
            setCNGData([])
            if(CNGEnergyData.length>0){
                // eslint-disable-next-line array-callback-return
                CNGEnergyData.map(val=>{
                    let daywiseData = [];  
                    // eslint-disable-next-line array-callback-return
                    val.Data.map((instrument) => { 
                            if(instrument.dayData){
                                // eslint-disable-next-line array-callback-return
                                instrument.dayData.map((data) => {
                                    let formula = instrument.vi ? instrument.vi.formula : ''
                                    if (data.length > 0) {
                                        // eslint-disable-next-line array-callback-return
                                        data.map((valt) => {
                                            let metrictype = common.getmetrictype([valt.key], props.typelist)
                                            let total
                                            if (metrictype === 2 && !valt.offline) {
                                             total = valt.endReading - valt.startReading;
                                            }
                                            else{
                                                 total = valt.value
                                            }
                                            total = total === null ? 0 : total;
                                            formula = formula.replaceAll(valt.iid + "." + valt.key, total)
                                        })
                                        formula = formula.replaceAll(/[a-z0-9]+.kwh/g, 0).replaceAll(/[a-z0-9]+.totaliser/g, 0).replaceAll(/[a-z0-9]+_pulse/g, 0).replaceAll('--', '-');
                                        // console.log(instrument.vi.formula,"instrument.vi.formula",formula,val.PlantDetail.name)
                                        if (instrument.vi.id === val.EnergyAsset) {
                                            daywiseData.push({ data: Number(isFinite(calcFormula(formula)) && (calcFormula(formula)>=0) ? calcFormula(formula) : 0), time: moment(data[0].time).format('ll') })
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
                        Data: Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)),
                        today: props.btGroupValue === 6 ? Number(daywiseData.reduce((partialSum, x) => partialSum + x.data, 0).toFixed(2)) : 0
                    })
                })
            }
            // console.log(FinalData,"CNGFinalData")
            setCNGData(FinalData)
            // setDatesSearch(false) 
            // setLoading(false) 
            // props.loading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CNGEnergyLoading, CNGEnergyData, CNGEnergyError])

    useEffect(()=>{
        if(LPGData.length > 0){
            let ActualLPG = props.LPGTodayData.map(e=>{
                let filData = LPGData.filter(f=>f.plantName === e.plantName) 
                let todayFilter = filData[0] ? filData[0].today : 0
                return {...e , actual_range: filData[0] ? filData[0].Data : 0, 
                    today: (props.btGroupValue === 6) ? todayFilter : e.today,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Energy Consumption"),
                    title: 'Energy',
                    icon: GasIcon,
                    unit:'Kg'
                }
            })
            setActualLPGData(ActualLPG)
        }
        if(CNGData.length > 0){
            let ActualCNG = props.CNGTodayData.map(e=>{
                let filData = CNGData.filter(f=>f.plantName === e.plantName) 
                let todayFilter = filData[0] ? filData[0].today : 0
                return {...e , actual_range: filData[0] ? filData[0].Data : 0,  
                    today: (props.btGroupValue === 6) ? todayFilter : e.today,
                    line_name: filData[0] ? filData[0].plantName : '',
                    line: filData[0] ? filData[0].line : '',
                    module: 'dashboard',
                    type: t("Energy Consumption"),
                    title: 'Energy',
                    icon: GasIcon,
                    unit:'Kg'
                }
            })
            // console.log(CNGData,"CNGDataCNGData",props.LPGTodayData)
            setActualCNGData(ActualCNG)
            // setActualEmission(ActualCo2)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[CNGData,props.CNGTodayData,LPGData,props.LPGTodayData])

    useEffect(()=>{
        if(ActualCNGData.length>0 && ActualLPGData.length>0){
            let actualData =[] 
            
                let Data = (ActualCNGData.reduce((partialSum, x) => partialSum + x.actual_range, 0)) + (ActualLPGData.reduce((partialSum, x) => partialSum + x.actual_range, 0))
                let todayFilter = (ActualCNGData.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualLPGData.reduce((partialSum, x) => partialSum + x.today, 0))
                // console.log(Data,todayFilter,"Gsassss")
                actualData.push({   actual_range : Data,
                                    today: todayFilter,
                                    subChild:[{title: "LPG Consumption",Data : ActualLPGData,icon:GasIcon,unit: 'Kg'},
                                    {title: "CNG Consumption",Data : ActualCNGData,icon:GasIcon,unit: 'Kg'}]
                                })
            setGasData(actualData)  
            setLoadingGas(false)
            console.log(ActualLPGData,"ActualLPGData",ActualCNGData)
            if(moduleName === 'BI' && subModule1 === 'Gas' && actualData.length > 0){
                // console.log(actualData,"actualData")
                if(gasTitle === 'Gas Consumption' && flag){
                    GetChildFn(actualData,t("Gas Consumption"),false,queryParam)
                }
               
                if(gasTitle !== "Gas Consumption" && flag){
                    actualData.forEach(dataItem => {
                         
                        // Look for a matching subChild within each dataItem
                        const matchedChild = dataItem.subChild.find(child => child.title === queryParam);
                        // console.log(matchedChild,"matched")
                        if (matchedChild) {
                            // Call GetChildFn with the matched subChild's Data and title
                            props.getChild(matchedChild.Data, matchedChild.title,3) 
                        }
                    });
                    setFlag(false)
                }
              
               // setFlag(false)
            }
        }
    },[ActualCNGData,ActualLPGData,moduleName,subModule1,queryParam,gasTitle])

    useEffect(()=>{
        if(ActualDGData.length>0 && ActualSolarData.length>0 && ActualData.length>0){
            let actualData =[] 
            
                let Data = (ActualDGData.reduce((partialSum, x) => partialSum + x.actual_range, 0)) + (ActualSolarData.reduce((partialSum, x) => partialSum + x.actual_range, 0)) + (ActualData.reduce((partialSum, x) => partialSum + x.actual_range, 0))
                let todayFilter = (ActualDGData.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualSolarData.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualData.reduce((partialSum, x) => partialSum + x.today, 0))
                // console.log(Data,todayFilter,"Gsassss")
                actualData.push({   actual_range : Data,
                                    today: todayFilter,
                                    subChild:
                                        [
                                            {title: "Main Incomer",Data : ActualData,icon:Incomer,unit: 'kWh'},
                                            {title: "Solar Consumption",Data : ActualSolarData,icon:SolarIcon,unit: 'kWh'},
                                            {title: "DG Consumption",Data : ActualDGData,icon:Equipments,unit: 'kWh'},
                                        ]
                                })
        //  console.log(ActualData,ActualSolarData,ActualDGData,moduleName,subModule1,queryParam,electricityTitle,"electricity")
            setAllEnergyData(actualData) 
            setLoading(false) 
            props.loading(false)
            if(moduleName === 'BI' && subModule1 === 'energy' && actualData.length > 0){
                // console.log(actualData,"actualData")
                if(electricityTitle === 'Electricity Consumption' && flag){
                    GetChildFn(actualData,t("Electricity Consumption"),false,queryParam)
                }
              
                
                if(electricityTitle !== "Electricity Consumption" && flag){
                    // console.log(electricityTitle,"matched name")
                    
                    actualData.forEach(dataItem => {
                        // Look for a matching subChild within each dataItem
                        const matchedChild = dataItem.subChild.find(child => child.title === queryParam);
                        // console.log(matchedChild,"matched")
                        if (matchedChild) {
                            // Call GetChildFn with the matched subChild's Data and title
                            props.getChild(matchedChild.Data, matchedChild.title,3) 
                        }
                    });
                    setFlag(false)
                }
              
               // setFlag(false)
            }
           
        }
    },[ActualSolarData,ActualDGData,ActualData,moduleName,subModule1,queryParam,electricityTitle])

    useEffect(()=>{
        if(ActualSolarPrice.length>0 && ActualDGPrice.length>0 && ActualPrice.length>0 && ActualWaterPrice.length>0){
            let actualData =[] 
            
                let Data = (ActualPrice.reduce((partialSum, x) => partialSum + Number(x.actual_range), 0)) + (ActualSolarPrice.reduce((partialSum, x) => partialSum + Number(x.actual_range), 0)) + (ActualDGPrice.reduce((partialSum, x) => partialSum + Number(x.actual_range), 0)) + (ActualWaterPrice.reduce((partialSum, x) => partialSum + x.actual_range, 0)) + (ActualLPGPrice.reduce((partialSum, x) => partialSum + x.actual_range, 0)) + (ActualCNGPrice.reduce((partialSum, x) => partialSum + x.actual_range, 0))
                let todayFilter = (ActualPrice.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualSolarPrice.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualDGPrice.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualWaterPrice.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualLPGPrice.reduce((partialSum, x) => partialSum + x.today, 0)) + (ActualCNGPrice.reduce((partialSum, x) => partialSum + x.today, 0))
                // console.log(Data,todayFilter,"EnergyPrice",ActualPrice)
                actualData.push({   actual_range : Data,
                                    today: todayFilter,
                                    subChild:
                                        [
                                            {title: "Electricity Price",Data : ActualPrice,icon:MoneyIcons,unit: '',currency:"₹ "},
                                            {title: "DG Price",Data : ActualDGPrice,icon:MoneyIcons,unit: '',currency:"₹ "},
                                            {title: "Solar Price",Data : ActualSolarPrice,icon:MoneyIcons,unit: '',currency:"₹ "},
                                            {title: "Water Price",Data : ActualWaterPrice,icon:MoneyIcons,unit: '',currency:"₹ "},
                                            {title: "LPG Price",Data : ActualLPGPrice,icon:MoneyIcons,unit: '',currency:"₹ "},
                                            {title: "CNG Price",Data : ActualCNGPrice,icon:MoneyIcons,unit: '',currency:"₹ "},
                                        ]
                                })
            setAllEnergyPrice(actualData) 
            // console.log(actualData,"setAllEnergyPrice")
            setLoadingPrice(false)
            if(moduleName === 'BI' && subModule1 === 'energy Price' && actualData.length > 0){
                
                if(priceTitle === 'Energy Price' && flag){
                    GetChildFn(actualData,t("Energy Price"),false,queryParam)
                }
              
                
                if(priceTitle !== "Energy Price" && flag){
                    actualData.forEach(dataItem => {
                         
                        // Look for a matching subChild within each dataItem
                        const matchedChild = dataItem.subChild.find(child => child.title === queryParam);
                        // console.log(matchedChild,"matched")
                        if (matchedChild) {
                            // Call GetChildFn with the matched subChild's Data and title
                            props.getChild(matchedChild.Data, matchedChild.title,3) 
                        }
                    });
                    setFlag(false)
                }
              
              
            }
        }
    },[ActualSolarPrice,ActualDGPrice,ActualPrice,ActualWaterPrice,ActualLPGPrice,ActualCNGPrice,moduleName,subModule1,queryParam,priceTitle])
    
    function GetChildFn(data,title,load,query){
        // console.log(data,title,load,query,"handle")
        if(title === t("Electricity Consumption") && query){
            setElectricityTitle(query)
        }
        else if(title === t("Gas Consumption") && query)
       {
        setGasTitle(query)
       }
       else if(title === t("Energy Price") && query){
        setPriceTitle(query)
       }
       if(!query){
        setFlag(false)
       }
        if(!load){
            props.getChild(data,title)
        }
    }
    return(
        <Grid container spacing={4}>
            <Grid xs={3} >
                <Card elevation={0} style={{cursor:'pointer', height:"160px"}} onClick={()=>GetChildFn(AllEnergyData,t("Electricity Consumption"),Loading)}>
                    <div className='flex flex-col justify-between gap-2' >
                        <div className='flex justify-between'>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Electricity Consumption")}/>
                            {Loading ? <CircularProgress disableShrink size={15} color="primary" /> :<></> }
                            <ElectricityIcons />
                        </div>
                            <div className='flex items-center gap-2'>
                            <TypographyNDL mono  variant="display-lg">
                        {(AllEnergyData.reduce((partialSum, x) => partialSum + x.actual_range, 0)).toFixed(2) }
                        </TypographyNDL>
                        <TypographyNDL   variant="display-lg">kWh</TypographyNDL>
                            </div>
                        <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{(AllEnergyData.reduce((partialSum, x) => partialSum + x.today, 0)).toFixed(2) + " kWh"}</TypographyNDL>
                             </div>
                    </div>
                </Card>
            </Grid>
            <Grid xs={3} >
                <Card elevation={0} style={{cursor:'pointer', height:"160px"}} onClick={()=>GetChildFn(WaterFinalData,t("Water Consumption"),Loadingwater)}>
                    <div className='flex flex-col justify-between gap-2 '  >

                        <div className='flex justify-between'>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Water Consumption")}/>
                            {Loadingwater ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                            <WaterIcons/>
                        </div>
                        <div className='flex items-center gap-2'>
                            <TypographyNDL mono  variant="display-lg">
                            {(WaterFinalData.reduce((partialSum, x) => partialSum + x.actual_range, 0)).toFixed(2)  }
                        </TypographyNDL>
                        <TypographyNDL   variant="display-lg">kL</TypographyNDL>
                            </div>
                        
                        <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{(WaterFinalData.reduce((partialSum, x) => partialSum + x.today, 0)).toFixed(2) + " kL"}</TypographyNDL>
                             </div>
                    </div>
                </Card>
            </Grid>
            <Grid xs={3} >
                <Card elevation={0} style={{cursor:'pointer', height:"160px"}} onClick={()=>GetChildFn(GasData,t("Gas Consumption"),LoadingGas) }>
                    <div className='flex flex-col justify-between gap-2' >
                        <div className='flex justify-between'>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Gas Consumption")}/>
                            {LoadingGas ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                            <GasIcons /> 

                        </div>
                        <div className='flex items-center gap-2'>
                            <TypographyNDL mono  variant="display-lg">
                            {(GasData.reduce((partialSum, x) => partialSum + x.actual_range, 0)).toFixed(2)}
                        </TypographyNDL>
                        <TypographyNDL   variant="display-lg">kg</TypographyNDL>
                            </div>
                            <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{(GasData.reduce((partialSum, x) => partialSum + x.today, 0)).toFixed(2) + " Kg"}</TypographyNDL>
                             </div>
                    </div>
                </Card>
            </Grid>
            <Grid xs={3} >
                <Card elevation={0} style={{cursor:'pointer', height:"160px"}} onClick={()=>GetChildFn(AllEnergyPrice,t("Energy Price"),LoadingPrice)}>
                    <div className='flex flex-col justify-between gap-2'>
                        <div className='flex justify-between'>
                        <TypographyNDL variant="label-01-s" color='secondary' style={{ textAlign: 'left' }} value={t("Energy Price")}/>
                            {LoadingPrice ? <CircularProgress disableShrink size={15} color="primary" /> : <></>}
                            <MoneyIcons />
                        </div>
                        <TypographyNDL mono  variant="display-lg">
                        {"₹ "+(AllEnergyPrice.reduce((partialSum, x) => partialSum + Number(x.actual_range), 0)).toFixed(2)}
                        </TypographyNDL>
                        <div className='flex flex-col gap-0.5'>
                                                                            <TypographyNDL variant="paragraph-xs" color='secondary'>{t("Today")}</TypographyNDL>
                                                                            <TypographyNDL mono variant="paragraph-xs">{"₹ "+(AllEnergyPrice.reduce((partialSum, x) => partialSum + Number(x.today), 0)).toFixed(2)}</TypographyNDL>
                             </div>
                       
                    </div>
                </Card>
            </Grid>
            
        </Grid>
    )
}
export default EnergyDashboard;