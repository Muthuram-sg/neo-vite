import React, { useEffect, useState, useRef } from "react"; 
import Grid from "components/Core/GridNDL";
import Typography from "components/Core/Typography/TypographyNDL"
import LoadingScreenNDL from "LoadingScreenNDL"; 
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import CircularProgress from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import DatePickerNDL from "components/Core/DatepickerNDL";
import { useTranslation } from 'react-i18next';
import configParam from "config";
import moment from 'moment'; 
import KpiCards from "components/Core/KPICards/KpiCardsNDL" 
import gqlQueries from "components/layouts/Queries"
import { useRecoilState } from "recoil";
import {
    currentUserRole, ExecDialog, Loadingpanel, themeMode, userData, userLine, selectedPlant, oeeProdData, showOEEAsset, snackToggle, snackMessage, snackType,  customdates, ProgressLoad, ProdBtnGrp, oeeAssets, executionData, executionDetails,adddtreasondisbale, pickerDisable,DateSrch
} from "recoilStore/atoms";
import { useMutation } from "@apollo/client";
 import OEECard from './ProductionChild/OEECard' 
import DowntimeCard from './ProductionChild/DowntimeCard'
import DowntimeCardForLongRange from './ProductionChild/DowntimeCardForLongRange'
import PartsForLongRange from './ProductionChild/PartsForLongRange'
import AssetStatusCard from './ProductionChild/AssetStatusCard'
import MaterialEfficiency from "./ProductionChild/DryerMaterialEfficiency";
import EnergyEfficiency from "./ProductionChild/DryerEnergyEfficiency";
import EfficiencyCard from "./ProductionChild/DryerEfficiencyCard.jsx"; 
import MachineStatus from "./ProductionChild/MachineStatus";
import PartsPerHourCard from "./ProductionChild/PartsPerHourCard";
import { useAuth } from "components/Context";
import useCycleTime from './hooks/useCycleTime'; 
import usePartSignalStatus from 'Hooks/usePartSignalStatus';
import usePartsSummary from './hooks/usePartsSummary'; 
import useQualityDefects from 'Hooks/useQualityDefects';
import useDownTime from './hooks/useDownTime';
import useReasonList from "Hooks/useReasonList";
import useReasonTypeList from "../../../../../Hooks/useReasonTypeList";
import usePartsPerDressingCount from "./hooks/usePartsPerDressingCount";
import useDressingCount from "components/layouts/Reports/ProductionWorkOrder/hooks/useDressingCount";
import useMetricTypelist from "components/layouts/Dashboards/Content/standard/hooks/useMetricTypes";
import useWorkExecution from "Hooks/useGetWorkExecution";
import useGasEnergyData from "./hooks/useGasEnergyData"; 
import useElectricalEnergyData from "./hooks/useElectricEnergyData";
import useMoistureInData from "./hooks/useMoistureInData";
import useMoistureOutData from "./hooks/useMoistureOutData";
import useExecutionData from "./hooks/useExecutionData";
import useMaterialData from "./hooks/useMaterialData";
import useHourlyEfficiencyData from "./hooks/useGetHourlyDrierEfficiency";
import useShiftEfficiencyData from "./hooks/useGetShiftDrierEfficiency";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from "components/Core/ButtonNDL" 
import useGetWorkOrderForLine from "./hooks/useGetWorkOrderForLine"; 
export default function DryerDashboard() {
    const { HF } = useAuth();
    const { t } = useTranslation();
    const [OEEData, setOEEData] = useRecoilState(oeeProdData);
    const [, setProgressBar] = useRecoilState(ProgressLoad);
    const [orderList] = useState([]);
    const [curTheme] = useRecoilState(themeMode);
    const [operatorsListArr] = useRecoilState(userLine);
    const [oeeAssetsArray] = useRecoilState(oeeAssets);
    const [selectedAssetID, setSelectedAssetID] = useRecoilState(showOEEAsset);
    const [isDryer, setIsDryer] = useState(false);
    const [isLongRange, setIsLongRange] = useState(false);
    const [headPlant] = useRecoilState(selectedPlant);
    const [currUser] = useRecoilState(userData);
    const [currUserRole] = useRecoilState(currentUserRole);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [startExecDialog, setStartExecDialog] = useRecoilState(ExecDialog);
    const [startWOEDate, setWOEStartDate] = useState(new Date());
    const [endWOEDate, setWOEEndDate] = useState(new Date());
    const [operator, setOperator] = useState('');
    const [workOrder, setWorkOrder] = useState('');
    const [LoadPanel, setLoadPanel] = useRecoilState(Loadingpanel);
    const [ProdGroupRange] = useRecoilState(ProdBtnGrp);
    const [isShiftAvailable, setIsShiftAvailable] = useState(true);
    const [customdatesval,setCustomdatesval] = useRecoilState(customdates); 
    const [DatesSearch,setDatesSearch] = useRecoilState(DateSrch);
    const [startRange, setStartRange] = useState('');
    const [endRange, setEndRange] = useState('');
    const [oeeConfigData, setOEEConfigData] = useState([]);
    const [PerHourData, setPerHourData] = useState([]);
    const [PerDressData, setPerDressData] = useState([]);
    const [, setDateDisabled] = useRecoilState(pickerDisable);
    const [Timeout, setTimeout] = useState(20000);
    const [prevRange,setprevRange] = useState(ProdGroupRange)
    const [oEE, setOEE] = useState({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 });
    const [,setExecutionList] = useRecoilState(executionData);
    const [workExecutionDetails] = useRecoilState(executionDetails)
    const [energyEff,setEnergyEff] = useState(null);
    const [IntrType, setIntrType] = React.useState(0);
    const [dryerStart, setDryerStart] = useState(new Date());
    const [dryerEnd, setDryerEnd] = useState(new Date())
    const [dryerHourlyData, setDryerHourlyData] = useState([]);
    const [dryerShiftData, setDryerShiftData] = useState([]);
    const [dryerMatData, setDryerMatData] = useState(null);
    const [dryerExecData, setDryerExecData] = useState([]);
    const [efficiencyLable,setefficiencyLable] = useState('')
    const { cycleLoading, cycleData, cycleError, getCycleTime } = useCycleTime(); 
    const { partLoading, partData, partError, getPartsCompleted } = usePartSignalStatus();
    
    const { partSumLoading, partSumData, partSumError, getPartsPerHour } = usePartsSummary(); 
    const { qualDefLoading, qualDefData, qualDefError, getQualityDefects } = useQualityDefects();
    const { outDTLoading, outDTData, outDTError, getDownTimeReason } = useDownTime();
    const { reasonTypeLoading, reasonTypeData, reasonTypeError, getReasonTypeList } = useReasonTypeList();
    const { reasonLoading, reasonData, reasonError, getReasonList } = useReasonList();
    const { dressingCountLoading, dressingCountData, dressingCountError, getDressingCount } = useDressingCount();
    const { metrictypelistLoading, metrictypelistdata, metrictypelisterror, getMetricTypelist } = useMetricTypelist()
    const { partsPerDressingCountLoading, partsPerDressingCountData, partsPerDressingCountError, getPartsPerDressingCount } = usePartsPerDressingCount();
    const { WorkExecutionLoading, WorkExecutionData, WorkExecutionError, getWorkExecutionTime } = useWorkExecution();
    const { GasEnergyLoading, GasEnergyData, GasEnergyError, getGasEnergy } = useGasEnergyData();
    const { ElectricalEnergyLoading, ElectricalEnergyData, ElectricalEnergyError, getElectricalEnergy } = useElectricalEnergyData()
    const { MoistureInLoading, MoistureInData, MoistureInError, getMoistureIn } = useMoistureInData();
    const { MoistureOutLoading, MoistureOutData, MoistureOutError, getMoistureOut } = useMoistureOutData();
    const { ExecutionLoading, ExecutionData, ExecutionError, getExecution } = useExecutionData();
    const { MaterialLoading, MaterialData, MaterialError, getMaterial } = useMaterialData();
    const { HourlyEfficiencyLoading, HourlyEfficiencyData, HourlyEfficiencyError, getHourlyEfficiency } = useHourlyEfficiencyData();
    const { ShiftEfficiencyLoading, ShiftEfficiencyData, ShiftEfficiencyError, getShiftEfficiency } = useShiftEfficiencyData(); 
    const  { WorkOrderLineLoading, WorkOrderLineData, WorkOrderLineError, getWorkOrderLine } = useGetWorkOrderForLine() 
    const [workOrderLine,setworkOrderLine] = useState([]) 
    const [,setalarmicondisable]  = useRecoilState(adddtreasondisbale)
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }
  
    useEffect(()=>{
       
        if(workExecutionDetails.some(f=> !f.ended_at) && (ProdGroupRange === 6 || ProdGroupRange === 11 )){
            setTimeout(20000)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partData])

    useEffect(() => { 
        getWorkOrderLine(headPlant.id)
        setTimeout(null)
        setOEEConfigData([])
        // alert("1")
        setExecutionList([])
    }, [headPlant.id]) // eslint-disable-line react-hooks/exhaustive-deps  

    useEffect(()=>{
    
        if(!WorkOrderLineLoading && WorkOrderLineData && !WorkOrderLineError){
            setworkOrderLine(WorkOrderLineData)
        }

    },[WorkOrderLineLoading, WorkOrderLineData, WorkOrderLineError])
    useEffect(() => {
        getMetricTypelist()
        getReasonTypeList();
        getReasonList();

        return () => {
            setSelectedAssetID({ show: false, id: 0 })
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setTimeout(null)
        setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })
        const selectedAsset = oeeAssetsArray.filter(x=>x.entity.id === selectedAssetID.id) 
        if (selectedAsset.length > 0) {
            if (selectedAsset[0].entity && selectedAsset[0].entity.dryer_config) {
                setIsDryer(selectedAsset[0].entity.dryer_config.is_enable)
            } else {
                setIsDryer(false)
            }
        } else {
            setIsDryer(false)
        }
        getAssetOEEConfigs()
        if (selectedAssetID.id) {
            // setProgressBar(true)
            setTimeout(()=>{
                if (ProdGroupRange === 7 || ProdGroupRange === 20 || ProdGroupRange === 21 || ProdGroupRange === 17 ) {
                    setTimeout(null)
                } else {
                    
                    setTimeout(20000)
                }
            },20000)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAssetID])  

    useEffect(() => {
        // setProgressBar(true)
        
        if (oeeConfigData.length === 0) {
            setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })
            getAssetOEEConfigs()
            if (ProdGroupRange === 7 || ProdGroupRange === 20 || ProdGroupRange === 21 || ProdGroupRange === 17 ) {
                setTimeout(null)
            } else {
                
                setTimeout(20000)
            }
        }
        else if (ProdGroupRange === 6 || ProdGroupRange === 7 || ProdGroupRange === 10 || ProdGroupRange === 11 || ProdGroupRange === 19 || ProdGroupRange === 20 || ProdGroupRange === 21 || ProdGroupRange === 22 || ProdGroupRange === 23 || ProdGroupRange === 17) {
            if (ProdGroupRange === 7 || ProdGroupRange === 20 || ProdGroupRange === 21 || ProdGroupRange === 17 ) {
                setTimeout(null)
                triggerOEE(oeeConfigData)
            } else {
                // console.log("TimeoutTimeout",Timeout,prevRange,ProdGroupRange)
                if(prevRange === ProdGroupRange){
                    triggerOEE(oeeConfigData,Timeout)    
                }else{
                    triggerOEE(oeeConfigData)    
                }
                
                setTimeout(20000)
            }
            setprevRange(ProdGroupRange)
            setDateDisabled(true)
            
        }else{
            setProgressBar(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customdatesval])

    useEffect(() => {
        if (oeeConfigData.length > 0) {
            if (ProdGroupRange === 6 || ProdGroupRange === 7 || ProdGroupRange === 10 || ProdGroupRange === 11 || ProdGroupRange === 19 || ProdGroupRange === 20 || ProdGroupRange === 21 || ProdGroupRange === 22 || ProdGroupRange === 23 || ProdGroupRange === 17) {

                triggerOEE(oeeConfigData)
                if (!metrictypelisterror && !metrictypelistLoading && metrictypelistdata) {
                    let metType = metrictypelistdata.filter(e => e.name === oeeConfigData[0].metric.name)
                    setIntrType(metType[0].instrument_type)
                }
               
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oeeConfigData,DatesSearch])

    useEffect(() => {
        if ((!cycleError && !cycleLoading && cycleData) && (!partError && !partLoading && partData) && (!partSumError && !partSumLoading && partSumData) && (!qualDefError && !qualDefLoading && qualDefData)) {
             // console.log(workExecutionDetails,"useEffect",partData)
             let oee = configParam.OEE_PROD_VALUE(
                {
                    start: startRange,
                    end: moment(Math.min(new Date(), new Date(endRange))).format('YYYY-MM-DDTHH:mm:ssZ')
                },
                {
                    job_exp_cycle_time: 0,
                    mode_exp_cycle_time: partData && partData[0] ? partData[0][0].cycleTime : 0,
                    part_act_cycle_time: partData && partData[0] ? partData[0][0].actCycleTime : 0,
                    workExe: workExecutionDetails,
                    total_time: partData && partData[0] ? partData[0][0].total_time : 0
                },
                partData && partData[0] && partData[0][0].data ? partData[0][0].data.length : 0,
                partData && partData[0] && partData[0][0].assetStatData && partData[0][0].assetStatData.dTime !== undefined ? partData[0][0].assetStatData.dTime : 0,
                partData && partData[0] && partData[0][0].assetStatData && partData[0][0].assetStatData.totalDTime !== undefined ? partData[0][0].assetStatData.totalDTime : 0,
                qualDefData && qualDefData.length > 0 && qualDefData[0].loss ? qualDefData[0].loss : 0,
                partData && partData[0] && partData[0][0].assetStatData && partData[0][0].assetStatData.hourlyDowntime
                    ? Object.keys(partData[0][0].assetStatData.hourlyDowntime).map((x) => partData[0][0].assetStatData.hourlyDowntime[x]).reduce((acc, value) => acc + value, 0)
                    : 0
            );
            

             setOEE(oee)
            setProgressBar(false)
            setalarmicondisable(false)
            setDateDisabled(false)
        }else if(!cycleLoading && cycleError && !partLoading && !partSumLoading && !qualDefLoading){
            setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })
            setProgressBar(false)
            setalarmicondisable(false)
            setDateDisabled(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cycleLoading, cycleError, partLoading, partError, partSumLoading, partSumError, qualDefLoading, qualDefError])

    useEffect(() => {
        if (!partSumError && !partSumLoading && partSumData) {
            if (partSumData.length > 0) {
                setPerHourData(partSumData)
            } else {
                setPerHourData([])
            }
        }
        if (!dressingCountLoading && dressingCountData && !dressingCountError) {
            if (dressingCountData.length > 0) {
                getDressingParts()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partSumData,dressingCountData,partSumLoading,partSumError,dressingCountLoading,dressingCountError])
    console.log("setExecutionList",WorkExecutionData,WorkExecutionLoading)
    useEffect(()=>{ 
        // alert("UEUE")
        // console.clear()
        console.log(WorkExecutionData)
        if(!WorkExecutionLoading && WorkExecutionData && !WorkExecutionError){  
            if(WorkExecutionData.length > 0){
                console.log("DSDS___", WorkExecutionData)
                // alert("2")
                setExecutionList(WorkExecutionData) 
            }
            else{ 
                // alert("HI3")
                if(isDryer){
                   setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })                
                    setProgressBar(false)
                    setDateDisabled(false)
                }
                setExecutionList([]) 
              
            }
        }
        if(!WorkExecutionLoading && !WorkExecutionData && WorkExecutionError){  
                // alert("4")
                setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })                
                setProgressBar(false)
                setDateDisabled(false)
                setExecutionList([]) 
             
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[WorkExecutionData])  
    useEffect(()=>{ 
        if(oeeConfigData.length>0 && startRange){
            if(isDryer){
                // console.log(startRange,"startRangestartRange")
                triggerDryerOEE(workExecutionDetails,startRange,endRange)
            }else{ 
                triggerprodOEE(workExecutionDetails,startRange,endRange,false)

            }
            if(workExecutionDetails.length > 0){
                // console.log(workExecutionDetails,"workExecutionDetails",workExecutionDetails.some(f=> !f.ended_at),isDryer) 
                    setTimeout(null)
            }
        }
            
        // }
        if(isDryer && workExecutionDetails.length === 0){ 
                setEnergyEff(null);
                setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })
                setDryerMatData(null);
                setDryerExecData([])
                setDryerHourlyData([]);
                setDryerShiftData([]);
                setLoadPanel(false); 
                setProgressBar(false)
        }
        if(!isDryer && workExecutionDetails.length === 0){
            setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "Behind", runTime: 0, downTime: 0 })
            setPerHourData([])
            setPerDressData([])
            setLoadPanel(false);
            setProgressBar(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[workExecutionDetails,oeeConfigData ]) 
    useEffect(()=>{
        if(!MaterialLoading && MaterialData && !MaterialError){
            setDryerMatData(MaterialData);
        }
        if(!MaterialLoading && MaterialError){
            setDryerMatData(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MaterialData, MaterialLoading])
    useEffect(() => {
        if (!ExecutionLoading && ExecutionData && !ExecutionError) {
            setDryerExecData(ExecutionData);
        }
        if(!ExecutionLoading && ExecutionError){
            setDryerExecData([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ExecutionData,ExecutionLoading])
    useEffect(()=>{
        //  console.log(workExecutionDetails,"workExecutionDetails")
        if(!GasEnergyLoading && !GasEnergyError && GasEnergyData && !ElectricalEnergyLoading && !ElectricalEnergyError && ElectricalEnergyData && !MoistureInLoading && !MoistureInError && MoistureInData && !MoistureOutLoading && !MoistureOutError && MoistureOutData && !MaterialLoading && !MaterialError&& MaterialData && workExecutionDetails){
            let energy = {
                gasEnergy: GasEnergyData?GasEnergyData:0,
                electricalEnergy: ElectricalEnergyData?ElectricalEnergyData:0,
                moistureInData: MoistureInData?MoistureInData:0,
                moistureOutData: MoistureOutData?MoistureOutData:0,
                materialfeed:MaterialData.feed_data?MaterialData.feed_data:0,
                materialDried: MaterialData.dried_data?MaterialData.dried_data:0,
                materialScrap: MaterialData.scrap_data?MaterialData.scrap_data:0,
                idealEnergy: workExecutionDetails.length && workExecutionDetails[0].expEnergy?workExecutionDetails[0].expEnergy:0,
                idealMoistureIn: workExecutionDetails.length && workExecutionDetails[0].moisture_in?workExecutionDetails[0].moisture_in:0,
                idealMoistureOut: workExecutionDetails.length && workExecutionDetails[0].moisture_out?workExecutionDetails[0].moisture_out:0
            }  
            const energyEffs = configParam.ENREGY_EFFICIENCY(energy)

            setEnergyEff(energyEffs);
        }
        if((!GasEnergyLoading && GasEnergyError) || (!ElectricalEnergyLoading && ElectricalEnergyError) || (!MoistureInLoading && MoistureInError) || (!MoistureOutLoading && MoistureOutError) || (!MaterialLoading && MaterialError)){
            setEnergyEff(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[GasEnergyLoading,GasEnergyData,ElectricalEnergyLoading,ElectricalEnergyData,MoistureInData,MoistureOutData,MaterialData])

    useEffect(() => {
        if (!MaterialLoading && !MaterialError && MaterialData && !ExecutionLoading && !ExecutionError && ExecutionData) {
            const dryer_oee = configParam.calculateDryerOEE(workExecutionDetails,{start: dryerStart, end: dryerEnd} , MaterialData.feed_data ? MaterialData.feed_data : 0, MaterialData.dried_data ? MaterialData.dried_data : 0, MaterialData.scrap_data ? MaterialData.scrap_data : 0, ExecutionData[0] && ExecutionData[0].dTime ? ExecutionData[0].dTime : 0, ExecutionData[0] && ExecutionData[0].totalDTime ? ExecutionData[0].totalDTime : 0);
            setOEE(dryer_oee)
            setDateDisabled(false)
        }
        if((!MaterialLoading && MaterialError) || (!ExecutionLoading && ExecutionError)){
            
            setOEE({ availability: 0, performance: 0, quality: 0, oee: 0, availLoss: 0, perfLoss: 0, qualLoss: 0, expParts: 0, actParts: 0, expCycle: 0, actcycle: 0, expSetup: 0, actSetup: 0, partDiffVal: 0, partDiffStat: "BehindMMM", runTime: 0, downTime: 0 })
            setDateDisabled(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[MaterialData,ExecutionData])
    useEffect(()=>{
        if(!HourlyEfficiencyLoading && !HourlyEfficiencyError && HourlyEfficiencyData && workExecutionDetails){
            if(HourlyEfficiencyData.length>0){
                const hour_result = []
                let labelDate = []
                HourlyEfficiencyData.forEach(x => {
                    let energy = {
                        moistureInData: x.moisture_in,
                        moistureOutData: x.moisture_out,
                        materialfeed: x.feed_data,
                        materialDried: x.dried_data,
                        materialScrap: x.scrap_data,
                        gasEnergy: x.gas_energy,
                        electricalEnergy: x.elect_energy,
                        idealEnergy: workExecutionDetails.length && workExecutionDetails[0].expEnergy?workExecutionDetails[0].expEnergy:0,
                        idealMoistureIn: workExecutionDetails.length && workExecutionDetails[0].moisture_in?workExecutionDetails[0].moisture_in:0,
                        idealMoistureOut: workExecutionDetails.length && workExecutionDetails[0].moisture_out?workExecutionDetails[0].moisture_out:0 
                    }
                    const me = configParam.MAT_EFFICIENCY(x.feed_data, x.dried_data, x.scrap_data)
                    const ee = configParam.ENREGY_EFFICIENCY(energy)
                    const oee = configParam.calculateDryerOEE(workExecutionDetails, {start: dryerStart, end: dryerEnd}, x.feed_data, x.dried_data, x.scrap_data, x.downtime)
                    let minutes = moment(new Date(x.start).getTime()).format('MM')
                   let formatedHour 
                   if(isLongRange){
                    formatedHour = moment(x.start).subtract(moment(x.start).isDST() ? 1 : 0,'hour').add(60 - minutes, 'minutes').startOf('hour').format('DD/MM/YYYY')     
                   }else{
                     formatedHour = moment(x.start).subtract(moment(x.start).isDST() ? 1 : 0,'hour').add(60 - minutes, 'minutes').startOf('hour').format('HH:mm')
                   } 
                    labelDate.push(moment(new Date(x.start).getTime()).format('DD-MM-YYYY'))
                    hour_result.push({ hour: formatedHour, OEE: isFinite(oee.oee) && oee.oee>= 0 ? oee.oee : 0,ME:me >= 0 ? Math.round(me) : 0  ,EE:ee.energy_efficiency >= 0 ? Math.round(ee.energy_efficiency) : 0 })
                   
                })
                setDryerHourlyData(hour_result);
                setefficiencyLable(labelDate)
            } else {
                setDryerHourlyData([]);
            }
        }
        if(!HourlyEfficiencyLoading && HourlyEfficiencyError){
            setDryerHourlyData([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[HourlyEfficiencyData])
    useEffect(()=>{
        if(!ShiftEfficiencyLoading && !ShiftEfficiencyError && ShiftEfficiencyData ){
            // console.log(ShiftEfficiencyData,"ShiftEfficiencyData1")
            if(ShiftEfficiencyData.length>0){
                const hour_result = [
                    {
                        name: 'OEE',
                        data: []
                    },
                    {
                        name: 'ME',
                        data: []
                    },
                    {
                        name: 'EE',
                        data: []
                    }
                ]
                ShiftEfficiencyData.forEach(x => {
                    let energy = {
                        moistureInData: x.moisture_in,
                        moistureOutData: x.moisture_out,
                        materialfeed: x.feed_data,
                        materialDried: x.dried_data,
                        materialScrap: x.scrap_data,
                        gasEnergy: x.gas_energy,
                        electricalEnergy: x.elect_energy, 
                        idealEnergy: workExecutionDetails.length && workExecutionDetails[0].expEnergy?workExecutionDetails[0].expEnergy:0,
                        idealMoistureIn: workExecutionDetails.length && workExecutionDetails[0].moisture_in?workExecutionDetails[0].moisture_in:0,
                        idealMoistureOut: workExecutionDetails.length && workExecutionDetails[0].moisture_out?workExecutionDetails[0].moisture_out:0 
                    }
                    const me = configParam.MAT_EFFICIENCY(x.feed_data, x.dried_data, x.scrap_data)
                    const ee = configParam.ENREGY_EFFICIENCY(energy)
                    const oee = configParam.calculateDryerOEE(workExecutionDetails, {start: dryerStart, end: dryerEnd}, x.feed_data, x.dried_data, x.scrap_data, x.downtime)
                    const oeeObj = [...hour_result[0].data]
                    const meObj = [...hour_result[1].data]
                    const eeObj = [...hour_result[2].data]
                    oeeObj.push({ x: x.name, y: oee.oee >= 0 ? oee.oee : 0 })
                    meObj.push({ x: x.name, y: me >= 0 ? Math.round(me) : 0 })
                    eeObj.push({ x: x.name, y: ee.energy_efficiency >= 0 ? Math.round(ee.energy_efficiency) : 0 })
                    hour_result[0].data = oeeObj;
                    hour_result[1].data = meObj;
                    hour_result[2].data = eeObj;
                })
                setDryerShiftData(hour_result);
                // console.log(ShiftEfficiencyData,"ShiftEfficiencyData",hour_result)
                
            } else {
                setDryerShiftData([]);
            }
        }
        
        if(!ShiftEfficiencyLoading && ShiftEfficiencyError){
            setDryerShiftData([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ShiftEfficiencyData])


    useEffect(() => {
        if (!partsPerDressingCountError && !partsPerDressingCountLoading && partsPerDressingCountData) {
            setPerDressData(partsPerDressingCountData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partsPerDressingCountLoading, partsPerDressingCountData, partsPerDressingCountError])

    useInterval(() => {
        // Your custom logic here  
        // triggerOEE(oeeConfigData, 'repeat');
        console.log(Timeout,"Timeout")
        let endrange = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"+ TZone)
        setCustomdatesval({ StartDate: new Date(customdatesval.StartDate), EndDate: new Date(endrange) })
    }, Timeout);


    const getDressingParts = () => {
        if (!partsPerDressingCountLoading && partsPerDressingCountData && !partsPerDressingCountError) {
            setPerDressData(partsPerDressingCountData)
        }
    
    }
    function getAssetOEEConfigs() {
        if (selectedAssetID.id) {
            configParam.RUN_GQL_API(gqlQueries.getSingleAssetOEEConfig, { asset_id: selectedAssetID.id })
                .then((oeeData) => {
                    if (oeeData !== undefined && oeeData.neo_skeleton_prod_asset_oee_config && oeeData.neo_skeleton_prod_asset_oee_config.length > 0) {
                        setOEEConfigData(oeeData.neo_skeleton_prod_asset_oee_config)
                    } else {
                        setProgressBar(false)
                    }
                });
        }
        else {
            setOEEConfigData([])
            setProgressBar(false)
        }
    }
    async function triggerDryerOEE(data, start_range, end_range) {

        const execution = data[0];
        const dryer_entity = oeeConfigData[0];
        const dryerObj = dryer_entity.entity && dryer_entity.entity.dryer_config?dryer_entity.entity.dryer_config:null;
        // console.log(execution,data,"triggerDryerOEE",start_range,isLongRange)
        if(dryerObj){ 
            let jobStart = execution ? execution.jobStart : start_range
            let jobEnd = execution ? execution.jobEnd : end_range
            const [start, end] = configParam.excutionDuration(jobStart,jobEnd,start_range,end_range)
            getMaterial(headPlant.schema,{feed_id :dryerObj.total_sand_fed_instrument,feed_key:dryerObj.MetricBySandFeed ? dryerObj.MetricBySandFeed.name : "" }, dryerObj.total_sand_dried_instrument, dryerObj.MetricBySandDried ? dryerObj.MetricBySandDried.name : "", dryerObj.total_scrap_instrument, dryerObj.MetricBySandScrap ? dryerObj.MetricBySandScrap.name : "", {start:start,end:end});
            getGasEnergy(headPlant.schema, dryerObj.gas_energy_consumption_instrument, dryerObj.MetricByGasEnergy ? dryerObj.MetricByGasEnergy.name : "", start, end);
            getElectricalEnergy(headPlant.schema, dryerObj.electrical_energy_consumption_instrument, dryerObj.MetricByElectricalEnergy ? dryerObj.MetricByElectricalEnergy.name : "", start, end)
            getMoistureIn(headPlant.schema, dryerObj.moisture_input_instrument, dryerObj.MetricByMoistureIn ? dryerObj.MetricByMoistureIn.name : "", start, end)
            getMoistureOut(headPlant.schema, dryerObj.moisture_output_instrument, dryerObj.MetricByMoistureOut ? dryerObj.MetricByMoistureOut.name : "", start, end)
            getExecution(headPlant.schema, dryerObj.total_startup_time_instrument, dryerObj.MetricByExecution ? dryerObj.MetricByExecution.name : "", start, end, dryer_entity)
            getHourlyEfficiency(headPlant.schema, start, end, dryer_entity.entity_id, dryerObj,isLongRange)
            let totalDays = moment(end_range).diff(moment(start_range), 'minutes');
            if(totalDays < 1440){
                getShiftEfficiency(headPlant.id, headPlant.schema, start, end, dryer_entity.entity_id, dryerObj)
            } 
            setOEEData(dryer_entity)
            setDryerStart(start);
            setDryerEnd(end);
            setLoadPanel(false);
            setProgressBar(false)
            setDatesSearch(false)
        } else {
            setLoadPanel(false);
            setProgressBar(false)
            setDatesSearch(false)
        }
    }

    async function triggerprodOEE(data,startrange,endrange,isRepeat){
       
        const val = oeeConfigData[0] 
        let start,end;
         
        [start, end] = [startrange, endrange];
        
      setStartRange(start);
      setEndRange(end)
        // console.log(val,"triggerprodOEE",start,end,execution)
        getPartsCompleted(headPlant.schema, oeeConfigData, start, end,isRepeat,partData && partData.length>0 && partData[0] && partData[0][0].data?partData[0][0].data:[],(workExecutionDetails) ? workExecutionDetails : [],partData && partData.length>0 && partData[0] ? partData[0][0].cycleTime : 0)
        getDressingCount(headPlant.schema,oeeConfigData,start,end)
        const getDates=(startDate, EndDate)=> {
            let dateArray = [];
            let currentDate = moment(startDate);
            let stopDate = moment(EndDate);
        while (currentDate <= stopDate) {
            dateArray.push( moment(currentDate).format('YYYY-MM-DDTHH:mm:ss') )
            currentDate = moment(currentDate).add(1, 'hour');
        }
        return dateArray;
        }
        let DateArr =getDates(start, end)
        getPartsPerHour({schema:headPlant.schema,instrument : val ? val.part_signal_instrument : '',metric:(val && val.metric) ? val.metric.name : ''} ,{start:start,end:end}, val ? val.is_part_count_binary : '',val ? val.is_part_count_downfall : '',(val && val.dressing_program !== null) ? val.dressing_program: '',isLongRange, 
        val && val.metricByDressingSignal  && val.metricByDressingSignal.name  ?val.metricByDressingSignal.name :"" ,isRepeat,PerHourData,DateArr)
        if(!isRepeat){
            getPartsPerDressingCount(headPlant.schema, {instrument:val ? val.part_signal_instrument:'', metric:(val && val.metric) ? val.metric.name: ''},{start:start,end:end}, val ? val.is_part_count_binary : '', val ? val.is_part_count_downfall : '', (val && val.dressing_program !== null) ? val.dressing_program: '',(val && val.metricByDressingSignal !== null && val.metricByDressingSignal.name !== null) ? val.metricByDressingSignal.name: '')

        }
        getQualityDefects(oeeConfigData, start, end,workExecutionDetails ? workExecutionDetails : [])
        if(val){
            getDownTimeReason(val.entity_id, start, end)
        }
        setOEEData(val);
        setLoadPanel(false);
        setProgressBar(false)
        setDatesSearch(false)

    }

    useEffect(() => {
        // alert('HI')
        triggerOEE(oeeConfigData)
    }, [])

    async function triggerOEE(data, isRepeat) {
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+ TZone)
        let endrange = moment(isRepeat ? new Date():customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss"+ TZone) 

        let val = data[0]
        let shiftAvailable = true; 
        getCycleTime(data, 'now()', 'now()') 
        setIsLongRange(false)   
        // console.log(startrange,"startrange",endrange)
        if(ProdGroupRange === 17) {
            
            let totalDays = moment(endrange).diff(moment(startrange), 'minutes');
            if(totalDays > 1440){
                setIsLongRange(true)
            }
        }
            if(isDryer){  
                    getWorkExecutionTime(data,[{start: startrange,end: endrange}]);
                     triggerDryerOEE(workExecutionDetails,startrange,endrange)
                              
            }else{
                if (shiftAvailable && val) { 
                    if(!isRepeat){ 
                        getWorkExecutionTime(data,[{start: startrange,end: endrange}]);
                    }
                    else{
                            triggerprodOEE(workExecutionDetails,startrange,endrange,isRepeat)  
                    }  
                  
                } 
              
                setIsShiftAvailable(shiftAvailable); 
            }
            console.clear()   
            console.log(startrange)        
            setStartRange(startrange);
            setEndRange(endrange)
           
       
    }
    // #region Handles

    const handleOperator = (e) => {
        setOperator(e.target.value);
    }
    const handleOrder = (e) => {
        setWorkOrder(e.target.value);
    }
    const handleWOEStartDate = (e) => {
        setWOEStartDate(e);
    }
    const handleWOEEndDate = (e) => {
        setWOEEndDate(e);
    }
    const handleSEDialogClose = () => {
        setOperator('')
        setWorkOrder('')
        setWOEStartDate(new Date());
        setWOEEndDate(new Date());
        setStartExecDialog(false);
    }
    const [addExecution, { error: addExecutionError }] = useMutation(
        configParam.addWorkInitiations,
        {
            update: (inMemoryCache, returnData) => {
                if (!addExecutionError) {
                    let data = returnData.data.insert_neo_skeleton_prod_exec_one
                    if (data) {
                        SetMessage(t('Started a new work order execution'))
                        SetType("success")
                        setOpenSnack(true)
                        handleSEDialogClose();
                        getAssetOEEConfigs();
                    }
                }
                else {
                    SetMessage(t('Failed to add the work order execution'))
                    SetType("error")
                    setOpenSnack(true)
                    handleSEDialogClose();
                }
            }
        }
    );

    const startExecution = (e) => {
        const stDate = moment(startWOEDate).format();
        const eddate = moment(endWOEDate).format();
        addExecution({ variables: { order_id: workOrder, start_dt: stDate, end_dt: eddate, entity_id: OEEData.entity.id, operator_id: operator, user_id: currUser.id, line_id: headPlant.id } })
    }

    const operatorsList = operatorsListArr.map(v=> {return {...v,name:v.userByUserId.name}})

    const assertStatusData =()=>{
        console.log(partData,"assertStatusData")
        if(isDryer){
            if(dryerExecData && dryerExecData[0] && dryerExecData[0].dTime >= 0){
                return dryerExecData[0]
            }else{
                return []
            }
        }else{
          if(partData && partData[0] && partData[0][0].assetStatData && partData[0][0].assetStatData.dTime >= 0){
            return  partData[0][0].assetStatData
          }else{
            return []
          }  
        }
    }
    let dryerLoading = (MaterialLoading && ExecutionLoading) ? true : false
    let energy_efficiencyLoading = (!GasEnergyLoading && !ElectricalEnergyLoading && !MoistureInLoading && !MoistureOutLoading && !MaterialLoading) ? false : true
    let energy_eff_data = energyEff ? energyEff : null
     let parts_data = partData && partData.length>0 && partData[0] && oEE.expCycle !== 0 &&  partData[0][0].data ? partData[0][0].data : []

    function TriggerExec(){
        let endrange = moment().format("YYYY-MM-DDTHH:mm:ss"+ TZone) 
        
            getWorkExecutionTime(oeeConfigData,[{start: startRange,end: endrange}]);
        getWorkOrderLine(headPlant.id)
    }

    const prodDashBoardLayout=()=>{
       
        if(OEEData && OEEData.length !== 0 && selectedAssetID.id){
            return(
                <React.Fragment>
                <div className="p-4">
                <Grid container spacing={4}> 
                 
                            <Grid item xs={12} sm={12}  >
                                <MachineStatus
                                    assertName={oeeAssetsArray ? oeeAssetsArray.filter(x => x.entity.id === selectedAssetID.id) : []}
                                    OEEData={oEE}
                                    workExecutionDetails={workExecutionDetails}
                                    startRange={startRange || moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+ TZone)}
                                    endRange={endRange}
                                    ProdGroupRange={ProdGroupRange}
                                    assetStatusData={assertStatusData()}
                                    isLongRange={isLongRange}
                                    isDryer={isDryer}
                                    totalParts = {partData && partData.length>0 && partData[0] && partData[0][0].data ? partData[0][0].data.length : 0 }
                                    rejectedParts = {partData && partData.length>0 && partData[0] && partData[0][0].rejectedParts ? partData[0][0].rejectedParts.length : 0 }
                                    sandDried = {dryerMatData && dryerMatData.dried_data ? parseFloat(dryerMatData.dried_data).toFixed(2) : "--"}
                                    sandScrapped = {dryerMatData && dryerMatData.scrap_data? parseFloat(dryerMatData.scrap_data).toFixed(2) : "--"}
                                    workOrderLine ={workOrderLine}
                                    TriggerExec={()=> TriggerExec()}
                                    partData={partData && partData.length>0 && partData[0] && partData[0][0].data ? partData[0][0].data : [] }
                               />
                            </Grid>
                            {!isLongRange ? 
                        (
                            <React.Fragment>
                               
                                {!ExecutionError ?
                                    <Grid item xs={12} >
                                        <AssetStatusCard loading={ExecutionLoading} start={startRange} end={endRange} assetStatusData={dryerExecData && dryerExecData[0] && dryerExecData[0].dTime >= 0 ? dryerExecData[0] : [] } OEEData={oEE} downtimeReason={!outDTLoading && !outDTError && outDTData ? outDTData : []} />
                                    </Grid> : ""}
                                   
                            </React.Fragment>

                        
                        ) : <React.Fragment></React.Fragment>
                    }

                         
                        {isLongRange ?
                            ( 
                                    <React.Fragment>
                                        <Grid item sm={isDryer ? 8 : 12}>
                                            <Grid container spacing={4} >
                                                <Grid item xs={12} sm={isDryer ? 6:4}>
                                                    <OEECard
                                                        isDryer={isDryer}
                                                        dryerLoading={dryerLoading}
                                                        loading={(!cycleLoading && !partLoading && !partSumLoading && !qualDefLoading) ? false : true}
                                                        OEEData={
                                                            {
                                                                OEE: oEE.oee,
                                                                Performance: oEE.performance,
                                                                Quality: oEE.quality,
                                                                PerformanceLossSeconds: oEE.perfLoss,
                                                                QualityLossSeconds: oEE.qualLoss,
                                                                PartsDifferenceStatus: oEE.partDiffStat,
                                                                PartsDifferenceValue: oEE.partDiffVal,
                                                            }
                                                        }
                                                        
                                                        machineAvailablity={oEE.availability}
                                                        machineTime={oEE.availLoss} />
                                                </Grid>
                                               
                                           
                                                {/* {isDryer ? ( */}
                                                    <React.Fragment>
                                                        <Grid item xs={6} sm={6}>
                                                            <div className="h-full flex flex-col gap-2" >
                                                                <KpiCards style={{height:"50%"}}>
                                                                <Typography color='secondary' variant="heading-01-xs" >
                                                                                <div  className="flex items-center h-5" > 
                                                                                        {"Moisture In"}
                                                                                        {MoistureInLoading && <div className="ml-4"><CircularProgress /></div>}       
                                                                                </div>
                                                                            </Typography> 
                                                                            <div  className="flex items-center justify-center flex-col gap-2 h-[140px] ">
                                                                            <Typography variant="display-lg" mono  value={`${!MoistureInLoading && !MoistureInError && MoistureInData ? MoistureInData.toFixed(2) : 0}%`}></Typography>
                                                                            <div class="self-stretch justify-center items-center gap-2 inline-flex">
                                                                            <Typography variant="paragraph-xs" color='secondary'>{`Expected `}<span className="text-[12px] text-Text-text-primary leading-[14px] font-normal font-geist-mono" mono>{`${workExecutionDetails.length>0 ? workExecutionDetails[0].moisture_in : 0}%`}</span></Typography>
                                                                            </div>
                                                                            </div>

                                                                </KpiCards>
                                                                <KpiCards style={{height:"50%"}}>
                                                                <Typography color='secondary' variant="heading-01-xs" >
                                                                <div  className="flex items-center h-5" >
                                                                                         {"Moisture Out"}
                                                                                        {MoistureOutLoading && <div className="ml-4"><CircularProgress /></div>}       
                                                                                </div>
                                                                            </Typography> 
                                                                            <div  className="flex items-center justify-center flex-col gap-2 h-[140px] ">
                                                                            <Typography mono variant="display-lg" value={`${!MoistureOutLoading && !MoistureOutError && MoistureOutData ? (MoistureOutData).toFixed(2) : 0}%`}></Typography>
                                                                            <div class="self-stretch justify-center items-center gap-2 inline-flex">
                                                                            <Typography variant="paragraph-xs" color='secondary'>{`Expected `}<span className="text-[12px] text-Text-text-primary leading-[14px] font-normal font-geist-mono" mono>{`${workExecutionDetails.length>0 ? workExecutionDetails[0].moisture_out : 0}%`}</span></Typography>
                                                                            </div>
                                                                            </div>
                                                                </KpiCards>
                                                            </div> 
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <MaterialEfficiency loading={MaterialLoading} materialData={dryerMatData ? dryerMatData : null} />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <EnergyEfficiency loading={energy_efficiencyLoading} energy={energy_eff_data} />
                                                        </Grid>
                                                    </React.Fragment>
                                                 
                                                {
                                                    !isDryer &&
                                                         
                                                        <React.Fragment>
                                                            <Grid item xs={12} sm={4}>
                                                                <PartsForLongRange
                                                                isLongRange={isLongRange}
                                                                entity_id={OEEData.entity_id}
                                                                startDate={startRange}
                                                                endDate={endRange}
                                                                loading={partLoading}
                                                                partsData={parts_data}
                                                                />
                                                            </Grid>
                                                        </React.Fragment>
                                                }
                                            </Grid>
                                        </Grid>
                                        {isDryer &&
                                        <Grid item xs={4} >
                                            <DowntimeCardForLongRange
                                                isLongRange={isLongRange}
                                                entity_id={OEEData.entity_id}
                                                startDate={startRange}
                                                endDate={endRange}
                                                loading={ExecutionLoading}
                                                assetRawStatus={(dryerExecData && dryerExecData[0]) ? dryerExecData[0] : []}
                                                oeeConfigData={oeeConfigData}
                                                />
                                        </Grid>}
                                        <Grid item sm={12}>
                                            <Grid container spacing={4}>
                                                <Grid item xs={12} lg={12}> 
                                                    <EfficiencyCard efficiencyLable={efficiencyLable} isLongRange={isLongRange} shiftLoading={ShiftEfficiencyLoading} hourLoading={HourlyEfficiencyLoading} start={dryerStart} end={dryerEnd} shiftData={dryerShiftData} hourlyData={dryerHourlyData} />
                                                </Grid>
                                             
                                            
                                            </Grid>
                                        </Grid>
                                    </React.Fragment> 
                            )
                            :
                            ( 
                                    <React.Fragment>
                                        <Grid item sm={8}>
                                            <Grid container spacing={4} >
                                                <Grid item xs={12} sm={6}>
                                                    <OEECard
                                                        isDryer={isDryer}
                                                        dryerLoading={(MaterialLoading && ExecutionLoading) ? true : false}
                                                        loading={(!cycleLoading && !partLoading && !partSumLoading && !qualDefLoading) ? false : true}
                                                        OEEData={
                                                            {
                                                                OEE: oEE.oee,
                                                                Performance: oEE.performance,
                                                                Quality: oEE.quality,
                                                                PerformanceLossSeconds: oEE.perfLoss,
                                                                QualityLossSeconds: oEE.qualLoss,
                                                                PartsDifferenceStatus: oEE.partDiffStat,
                                                                PartsDifferenceValue: oEE.partDiffVal
                                                            }
                                                        }
                                                        machineAvailablity={oEE.availability}
                                                        machineTime={oEE.availLoss} />
                                                </Grid> 
                                                    <React.Fragment>
                                                        <Grid item xs={12} sm={6}>
                                                                <div className="h-full flex flex-col gap-2" >
                                                                    <KpiCards style={{height:"50%"}}>

                                                                    <Typography color='secondary' variant="heading-01-xs" >
                                                                        <div className='flex items-center h-5' > 
                                                                                {"Moisture In"}
                                                                                {MoistureInLoading && <div className='ml-4'><CircularProgress /></div>}       
                                                                        </div>
                                                                    </Typography>
                                                                                <div  className="flex items-center justify-center flex-col gap-2 h-[140px] ">
                                                                                    <Typography variant="display-lg" mono value={`${!MoistureInLoading && !MoistureInError && MoistureInData ? MoistureInData.toFixed(2) : 0}%`}></Typography>

                                                                                    <div class="self-stretch justify-center items-center gap-2 inline-flex">
                                                                                        <Typography variant="paragraph-xs" color='secondary'>{`Expected `}<span className="text-[12px] text-Text-text-primary leading-[14px] font-normal font-geist-mono" mono>{`${workExecutionDetails.length>0 ? workExecutionDetails[0]?.moisture_in : 0}%`}</span></Typography>
                                                                                    </div>
                                                                                    </div>

                                                                    </KpiCards>
                                                                    <KpiCards style={{height:"50%"}}>

                                                                    <Typography color='secondary' variant="heading-01-xs" >
                                                                    <div className='flex items-center h-5' > 
                                                                                {"Moiture Out"}
                                                                                {MoistureOutLoading && <div className='ml-4'><CircularProgress /></div>}       
                                                                        </div>
                                                                    </Typography> 
                                                                    <div className="flex items-center justify-center flex-col gap-2 h-[140px]">

                                                                        <Typography variant="display-lg" mono value={`${!MoistureOutLoading && !MoistureOutError && MoistureOutData ? MoistureOutData.toFixed(2) : 0}%`}></Typography>
                                                                        <div class="self-stretch justify-center items-center gap-2 inline-flex">
                                                                        <Typography  variant="paragraph-xs" >Expected <span className="text-[12px] text-Text-text-primary leading-[14px] font-normal font-geist-mono" mono>{`${workExecutionDetails.length>0 ? workExecutionDetails[0]?.moisture_out:0}%`}</span></Typography>
                                                                    </div>
                                                                    </div>

                                                                    </KpiCards>
                                                                </div>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <MaterialEfficiency loading={MaterialLoading} materialData={dryerMatData ? dryerMatData : null} />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <EnergyEfficiency loading={(!GasEnergyLoading && !ElectricalEnergyLoading && !MoistureInLoading && !MoistureOutLoading && !MaterialLoading) ? false : true} energy={energyEff ? energyEff : null} />
                                                        </Grid>
                                                    </React.Fragment>
                                                 
                                                {
                                                    !isDryer &&
                                                         
                                                        <Grid item sm={12}>
                                                                <PartsPerHourCard isLongRange={isLongRange} loading={partLoading} ProdGroupRange={ProdGroupRange} partLoading={partSumLoading} assetStatusData={partData && partData[0] && partData[0][0].assetStatData && partData[0][0].assetStatData.hourlyDowntime ? partData[0][0].assetStatData.hourlyDowntime : [] } dressLoading={dressingCountLoading} partsData={partData && (partData.length>0) && partData[0] && partData[0][0].data ? partData[0][0].data : []} headPlant={headPlant} downtimeReason={!outDTLoading && !outDTError && outDTData ? outDTData : []} trendsData={PerHourData} triggerDressParts={getDressingParts} dressingCount={dressingCountData} DressData={PerDressData} OEEData={OEEData} expectedCycleTime={oEE.expCycle ? `${isNaN(oEE.expCycle) || !isFinite(oEE.expCycle) || !oEE.expCycle ? 0 : parseFloat(oEE.expCycle).toFixed(2)}` : 0} actualCycleTime={oEE.actcycle ? oEE.actcycle : 0} DatesSearch={DatesSearch}
                                                                cycleTime={partData && partData.length>0 && partData[0] && partData[0][0].actCycleTime ? partData[0][0].actCycleTime : [] } />
                                                        </Grid>

                                                }

                                            </Grid>
                                        </Grid>
                                        {isDryer &&
                                        <Grid item xs={4} >
                               
                                            <DowntimeCard
                                                        isDryer={isDryer}
                                                        loading={ExecutionLoading}
                                                        oeeConfigData={oeeConfigData}
                                                        prodReasonType={!reasonTypeLoading && !reasonTypeError && reasonTypeData}
                                                        reasons={!reasonLoading && !reasonError && reasonData}
                                                        assetRawStatus={dryerExecData && dryerExecData[0] ? dryerExecData[0] : []}
                                                        OEEData={OEEData}
                                                        currUserRole={currUserRole}
                                                        entity_id={OEEData.entity_id}
                                                        userid={currUser.id}
                                                        headplantid={headPlant.id}
                                                        treiggerOEE={() => triggerDryerOEE(workExecutionDetails, startRange, endRange)}
                                                        partsData={partData && (partData.length>0) && partData[0] && partData[0][0].data ? partData[0][0].data : [] }
                                                    />
                                        </Grid>}
                                       

                                        <Grid item sm={!isDryer ? 4 : 12} >
                                            {
                                                 
                                                    <EfficiencyCard   efficiencyLable={efficiencyLable} isLongRange={isLongRange} shiftLoading={ShiftEfficiencyLoading} hourLoading={HourlyEfficiencyLoading} start={dryerStart} end={dryerEnd} shiftData={dryerShiftData} hourlyData={dryerHourlyData} />
                                            }

                                        </Grid>
                                        
                                    </React.Fragment>
                            )
                        }

                    
                </Grid>
                </div>
             
                
            </React.Fragment>
            )

        }else{
            if(!isShiftAvailable){
                return(
                    <Grid container spacing={4} style={{ padding:16}}>
                <Grid item xs={12} style={{ padding: 4 }}>
                    <KpiCards style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }}>
                        <div style={{ padding: 10, textAlign: "center" }}>
                        <Typography variant="lable-01-s" value={t("NoShiftAvailable")} />
                        </div>
                    </KpiCards>
                </Grid>
            </Grid>
                )
                
            }else{
                return(
<Grid container spacing={1} style={{ padding: 16 }}>
                <Grid item xs={12} style={{ padding: 4 }}>
                    <KpiCards style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FCFCFC" : "#1D1D1D" }}>
                        <div style={{ padding: 10, textAlign: "center" }}>
                            <Typography variant="lable-01-s" value={t("PleaseSelectAnAsset")} />
                        </div>
                    </KpiCards>
                </Grid>
            </Grid>
                )
                
            }
        }
    }
    
    return (
  

        <div>
             {WorkExecutionLoading && <LoadingScreenNDL />}
            <ModalNDL open={startExecDialog} onClose={handleSEDialogClose} > 
                <ModalHeaderNDL>
                <Typography variant="heading-02-s" model value={t("StartExecution")}/>           
                </ModalHeaderNDL>
                <ModalContentNDL> 
                        <Typography value={t("Start Date")}/>
                        <DatePickerNDL
                            id="work-start-date"
                            onChange={(dates) => {
                                handleWOEStartDate(dates);
                            }} 
                            startDate={startWOEDate}
                            dateFormat={"dd/MM/yyyy  " + HF.HM}
                            customRange={false}
                            showTimeSelect={true} 
                            timeFormat="HH:mm:ss"
                            placeholder={t("Start Date")}
                        />
                        <Typography value={t("End Date")} style={{marginTop:8}}/>
                        <DatePickerNDL
                            id="work-end-date"
                            onChange={(dates) => {
                                handleWOEEndDate(dates);
                            }} 
                            startDate={endWOEDate}
                            dateFormat={"dd/MM/yyyy  " + HF.HM}
                            customRange={false}
                            showTimeSelect={true} 
                            timeFormat="HH:mm:ss"
                            placeholder={t("End Date")}
                        /> 
                         
                    <div style={{ marginBottom: 10, marginTop: '5px' }}> 
                        <SelectBox 
                            label={t("WorkOrder")}
                            id="select-order"
                            auto={false}
                            multiple={false}
                            options={orderList}
                            isMArray={true}
                            checkbox={false}
                            value={workOrder}
                            onChange={handleOrder}
                            keyValue="order_id"
                            keyId="id" 
                        />
                      
                    </div>
                    <div style={{ marginBottom: 10, marginTop: '5px' }}> 
                        <SelectBox 
                            label={t("Operator")}
                            id="select-order"
                            auto={false}
                            multiple={false}
                            options={operatorsList}
                            isMArray={true}
                            checkbox={false}
                            value={operator}
                            onChange={handleOperator}
                            keyValue="name"
                            keyId="user_id" 
                        />
                     
                    </div>
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button style={{ marginTop: 10, marginBottom: 10 }} value={t("Save")} onClick={startExecution} />
                    <Button style={{ marginTop: 10, marginBottom: 10 }} value={t('Cancel')} onClick={handleSEDialogClose} />
                </ModalFooterNDL>
            </ModalNDL>
            
            {/* Comment Dialog */}
            {LoadPanel ? <LoadingScreenNDL /> :
               prodDashBoardLayout()
            }
        </div>
    )
}   