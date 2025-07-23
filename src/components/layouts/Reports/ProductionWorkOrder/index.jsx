
/* eslint-disable array-callback-return */
import React, { useState, useEffect,forwardRef } from "react"; 
import Grid from 'components/Core/GridNDL'
import { useRecoilState } from "recoil";
import {
  selectedPlant, 
  stdDowntimeAsset,
  editExec,
  customdates,
  reportProgress,
  oeereportgroupby,
  oeeAssets,
  userLine
} from "recoilStore/atoms";
import common from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/common.jsx";
import moment from "moment";
import configParam from "config";
import ProductionWorkOrders from "./Components/ProductionWorkOrders"; 
import useWorkExecutionTime from 'Hooks/useGetWorkExecution.jsx'
import useGetMultipleAssetOEEConfig from "./hooks/useMultipleAssetOEEConfig";
import useGetCurrentOperator from "components/layouts/Dashboards/Content/standard/ProductionChild/hooks/useGetCurrentOperator.jsx";
import { useTranslation } from "react-i18next";
import usePartSignalStatus from 'Hooks/usePartSignalStatus'

const ProductionWorkOrder = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [UserforLine] = useRecoilState(userLine); 
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setTableData] = useState([]); 
  const [downtimeAsset] = useRecoilState(stdDowntimeAsset);
  const [, setProgress] = useRecoilState(reportProgress);
  const [editExecute, setEditExec] = useRecoilState(editExec);
  const [customdatesval] = useRecoilState(customdates);
  const [oeeConfigData, setOEEConfigData] = useState([]);
  const [rangeStart, setRangeStart] = useState(new Date());
  const [rangeEnd, setRangeEnd] = useState(new Date())
  const [outTableData, setOutTableData] = useState([])
  const [durations, setdurations] = useState([])

  const [groupby] = useRecoilState(oeereportgroupby)
  const [executiondata, setexecutiondata] = useState([])
  const [oeeAssetsArray] = useRecoilState(oeeAssets);
  const [isDryer,setIsDryer] = useState(false);
  let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
  let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
  let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
  let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 


  const { WorkExecutionLoading, WorkExecutionData, WorkExecutionError, getWorkExecutionTime } = useWorkExecutionTime();
  const { multipleAssetOEEConfigLoading, multipleAssetOEEConfigData, multipleAssetOEEConfigError, getMultipleAssetOEEConfig } = useGetMultipleAssetOEEConfig();
  const { GetCurrentOperatorLoading, GetCurrentOperatorData, GetCurrentOperatorError, getGetCurrentOperator } = useGetCurrentOperator()
  const { partLoading, partData, partError, getPartsCompleted } = usePartSignalStatus();

  const [headCells, setheadCells] = useState([
    {
      id: "sno",
      numeric: false,
      disablePadding: false,
      label: "SNo",
      hide: false
    },
    {
      id: "assetName",
      numeric: false,
      disablePadding: false,
      label: t("AssetName"),
      hide: false
    },
    {
      id: "workorder",
      numeric: false,
      disablePadding: false,
      label: t("WorkOrder"),
      hide: false
    },
    {
      id: "start_date",
      numeric: false,
      disablePadding: false,
      label: t("Start Date"),
      hide: false
    },
    {
      id: "end_date",
      numeric: false,
      disablePadding: false,
      label: t("End Date"),
      hide: false
    },

    {
      id: "shift",
      numeric: false,
      disablePadding: false,
      label: t("Shift"),
      hide: false

    },

    {
      id: "operator",
      numeric: false,
      disablePadding: false,
      label: t("Operator"),
      hide: false
    },
    {
      id: "product",
      numeric: false,
      disablePadding: false,
      label: t("Product"),
      hide: false
    },
    {
      id: "dressing_count",
      numeric: false,
      disablePadding: false,
      label: t("Dressing Count"),
      hide: false
    },
    {
      id: "downtime",
      numeric: false,
      disablePadding: false,
      label: t("Downtime"),
      hide: false
    },
    {
      id: "plannedQty",
      numeric: false,
      disablePadding: false,
      label: t("Expected Qty"),
      hide: false
    },
    {
      id: "actualQty",
      numeric: false,
      disablePadding: false,
      label: t("Manufactured Qty"),
      hide: false
    },
    {
      id: "quality_defects",
      numeric: false,
      disablePadding: false,
      label: t("Defective Qty"),
      hide: false
    },

    {
      id: "qualified",
      numeric: false,
      disablePadding: false,
      label: t("Qualified Qty"),
      hide: false
    },

    {
      id: "oee",
      numeric: false,
      disablePadding: false,
      label: t("OEE"),
      hide: false
    },
    {
      id: "material_efficiency",
      numeric: false,
      disablePadding: false,
      label: t("ME"),
      hide: false,
      display: "none"
    },

    {
      id: "energy_efficiency",
      numeric: false,
      disablePadding: false,
      label: t("EE"),
      hide: false,
      display: "none"
    },

    {
      id: "electrical_energy",
      numeric: false,
      disablePadding: false,
      label: t("Electrical Energy"),
      hide: false,
      display: "none"
    },

    {
      id: "gas_energy",
      numeric: false,
      disablePadding: false,
      label: t("Gas Energy"),
      hide: false,
      display: "none"
    }

  ])  

  useEffect(() => {
    if (downtimeAsset.length > 0) {
      const dryerAsset = oeeAssetsArray.filter(x => downtimeAsset.includes(x.entity.id) && x.entity.dryer_config && x.entity.dryer_config.is_enable);
      if (dryerAsset.length > 0) {
        setIsDryer(true);
      } else {
        setIsDryer(false);
      }
    } else {
      setIsDryer(false);
    }
    getAssetOEEConfigs();
    setOutTableData([])
    console.log(downtimeAsset,"downtimeAsset",customdatesval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downtimeAsset, customdatesval, groupby]);

  useEffect(() => {
    const columns = headCells.forEach(x => {
      let obj1 = { ...x };
      if (isDryer) {
        if (['material_efficiency', 'energy_efficiency', 'electrical_energy', 'gas_energy'].includes(x.id)) {
          obj1.display = "block";
        }
      } else {
        if (['material_efficiency', 'energy_efficiency', 'electrical_energy', 'gas_energy'].includes(x.id)) {
          obj1.display = "none";
        }
      }
      return obj1;
    })
    setheadCells(columns);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDryer])

  useEffect(() => {
    if (!GetCurrentOperatorLoading && GetCurrentOperatorData && !GetCurrentOperatorError) {
      
          triggerOEE(oeeConfigData)
          

    }
}, [GetCurrentOperatorLoading, GetCurrentOperatorData, GetCurrentOperatorError])

  function get_prod_oee_value (data, mode_exp_cycle_time, part_act_cycle_time, total_parts, total_unplanned_dt, total_dt, quality_defects){
    
    let exp_cycle_time = data.job_exp_cycle_time !== 0 ? data.job_exp_cycle_time : mode_exp_cycle_time
    let total_secs = ((new Date(data.end).getTime() - new Date(data.start).getTime())/1000)
    let total_planned_dt = total_dt - total_unplanned_dt
    let avail = 1 - (total_unplanned_dt / (total_secs - total_planned_dt))
    let availLoss = (total_unplanned_dt)
    let perf = total_parts / ((total_secs - total_dt) / exp_cycle_time)
    let runTime = total_secs - total_dt
    let downTime = total_dt
    let expParts = (total_secs - total_planned_dt) / exp_cycle_time
    let targetedParts = (total_secs - total_dt) / exp_cycle_time
    let qual = 1 - (quality_defects / total_parts)
    let perfLoss = (expParts - total_parts) * exp_cycle_time
    //its lost time due to quality defects but not the actual defects.
    let qualLoss = (quality_defects * exp_cycle_time) 
    let qualdefects = quality_defects
    avail = isNaN(avail) || !isFinite(avail) || !avail ? 0 : avail;
    perf = isNaN(perf) || !isFinite(perf) || !perf ? 0 : perf;
    qual = isNaN(qual) || !isFinite(qual) || !qual ? 0 : qual;
    let temp1 = targetedParts - total_parts
    let temp2 = total_parts - targetedParts
    let partDiffVal = temp1 < 0 ? temp2 : temp1
    let partDiffStat = temp1 < 0 ? "Ahead" : "Behind"
    return  { availability: avail, performance: perf, quality: qual, oee: avail * perf * qual, availLoss: availLoss, perfLoss: perfLoss, qualLoss: qualLoss, qualdefects: qualdefects, expParts: expParts, actParts: total_parts, expCycle: exp_cycle_time, actcycle: part_act_cycle_time, expSetup: 0, actSetup: 0, partDiffVal: partDiffVal, partDiffStat: partDiffStat, runTime: runTime, downTime: downTime }
  }////

  const get_operator_oee_value = (data, part_act_cycle_time, total_parts, total_unplanned_dt, total_dt, quality_defects, total_duration) => {
    let avail = 0
    let qual = 0
    let availLoss = 0
    let perf = 0
    let perf_num = 0
    let runTime = 0
    let downTime = 0
    let expParts = 0
    let perfLoss = 0
    let qualLoss = 0
    let actParts = 0
    let Planned_Downtime = 0
    let Total_Duration = 0
    let qualdefects = 0
    let Unplanned_Downtime = 0
    let Total_Parts = 0
    let exp_cycle_time=0
    total_duration.forEach((val, index) => {
      exp_cycle_time = data.mode_exp_cycle_time[index]
      let total_secs = val
      Total_Duration = Total_Duration + val
      let total_planned_dt = total_dt[index] - total_unplanned_dt[index]
      Planned_Downtime = Planned_Downtime + total_planned_dt
      Unplanned_Downtime = Unplanned_Downtime + total_unplanned_dt[index]
      availLoss = availLoss + total_unplanned_dt[index]
      perf_num = perf_num + (total_parts[index] * exp_cycle_time)
      runTime = runTime + (total_secs - total_dt[index])
      downTime = downTime + total_dt[index]
      expParts = expParts + ((total_secs - total_dt[index]) / exp_cycle_time)
      Total_Parts = Total_Parts + total_parts[index]
      perfLoss = perfLoss + (((total_secs - total_planned_dt) / exp_cycle_time) - total_parts[index]) * exp_cycle_time
      qualLoss = qualLoss + (quality_defects[index] * exp_cycle_time)
      actParts = actParts + total_parts[index]
      qualdefects = qualdefects + Number(quality_defects[index])
    })


    avail = 1 - (Unplanned_Downtime / (Total_Duration - Planned_Downtime))
    qual = 1 - (qualdefects / Total_Parts)
    perf = perf_num / (Total_Duration - Planned_Downtime - Unplanned_Downtime)
  
    avail = isNaN(avail) || !isFinite(avail) || !avail ? 0 : avail;
    perf = isNaN(perf) || !isFinite(perf) || !perf ? 0 : perf;
    qual = isNaN(qual) || !isFinite(qual) || !qual ? 0 : qual;
    
    return { availability: avail, performance: perf, quality: qual, oee: avail * perf * qual, availLoss: availLoss, perfLoss: perfLoss, qualLoss: qualLoss, qualdefects: qualdefects, expParts: Number.isFinite(expParts) ? expParts: 0, actParts: actParts, actcycle: part_act_cycle_time, expSetup: 0, actSetup: 0, runTime: runTime, downTime: downTime }
  }


  const get_group_by_report_data = (data) => {
    let groupdata = []
    data.forEach((val) => {
      if (val.isDryer) {
        let energy = {
          moistureInData: val.moistin,
          moistureOutData: val.moistout,
          materialfeed: val.feed,
          materialDried: val.dried,
          materialScrap: val.scrap,
          gasEnergy: val.gas,
          electricalEnergy: val.elect,
          idealEnergy: val.expEnergy,
          idealMoistureIn: val.moisture_in,
          idealMoistureOut: val.moisture_out
        }
        const me = configParam.MAT_EFFICIENCY(val.feed, val.dried, val.scrap)
        const ee = configParam.ENREGY_EFFICIENCY(energy)
        const oee = configParam.calculateDryerOEE(val, {start: val.start, end: val.end}, val.feed, val.dried, val.scrap, val.unplannedDT, val.totalDowntime)
        const dryer = {
          OEE: oee.oee,
          ME: me,
          EE: ee.energy_efficiency,
          downTime: val.unplannedDT,
          gas: ee.gasEnergy,
          elect: ee.electricalEnergy,
          expParts: oee.expParts,
          actParts: val.feed,
          qualdefects: val.scrap,
          goodParts: val.dried,
          operator: val.operator ? val.operator : "",
          operatorid: val.operatorid ? val.operatorid : "",
          startrange: val.start,
          endrange: val.end,
          product_id: val.productname ? val.productname : "",
          order_id: val.orderid ? val.orderid : "",
          qty: val.qty ? val.qty : "",
          unit: val.unit ? val.unit : "",
          execid: val.execid ? val.execid : "",
          woid: val.woid ? val.woid : "",
          executionstatus: val.status ? val.status : 0,
          entity_id: val.entity_id,
          assetName: val.entity_name,
          dressingCount: 0,
          isDryer: true
        }
        groupdata.push(dryer)
      } else {
        let data1={
          job_exp_cycle_time:val.job_cycleTime,
          mode_exp_cycle_time:val.mode_cycleTime
        }
        let OEE = get_operator_oee_value(
          data1,
          val.part_act_cycle_time,
          val.total_parts,
          val.total_unplanned_dt,
          val.total_dt,
          val.quality_defects,
          val.total_duration
        )
        const availability = isNaN(OEE.availability) ? 0 : OEE.availability;
        const performance = isNaN(OEE.performance) ? 0 : OEE.performance;
        const Quality = isNaN(OEE.quality) ? 0 : OEE.quality;
        if(groupby === 4){
          OEE.OEE =  parseFloat((performance) * 100)
        }else if(groupby === 3){
          OEE.OEE = ((OEE.actParts - OEE.qualdefects)/OEE.expParts) * 100
        }else{
          OEE.OEE = parseFloat((availability * performance * Quality) * 100)
        }
        if (val) {
          OEE.operator = val.operator ? val.operator : ""
          OEE.operatorid = val.operatorid ? val.operatorid : "";
          OEE.startrange = val.start;
          OEE.endrange = val.end;
          OEE.product_id = val.productname ? val.productname : "";
          OEE.order_id = val.orderid ? val.orderid : "";
          OEE.qty = val.qty ? val.qty : "";
          OEE.unit = val.unit ? val.unit : "";
          OEE.execid = val.execid ? val.execid : "";
          OEE.woid = val.woid ? val.woid : "";
          OEE.executionstatus = val.status ? val.status : 0;
          OEE.entity_id = val.entity_id;
          OEE.assetName = val.entity_name;
          OEE.goodParts = OEE.actParts ? Number(OEE.actParts) - Number(OEE.qualdefects) : "0";
          OEE.dressingCount = val.dressingCount.reduce((partialSum, a) => Number(a) + partialSum, 0);
          OEE.isDryer = false;
        }
        groupdata.push(OEE)
      }//

    })
    return groupdata

  }
  useEffect(() => {
    if (!partLoading && !partError && partData) {
      var operatordata = []
      var tempoperatordta = []
      var tempdaywisedata = []
      var tempshiftwisedata = []
      partData?.map((x) => {
        // console.log(x,"partDatapartData")
      
      var details = x ? x : []
      executiondata.forEach((val) => {
        let ind = -1
        let OEE;
        var index = -1
        if (groupby === 4 || groupby === 3) {
          index = details.findIndex(item => (item.entity_id === val.entity_id && item.execid === val.execid && item.operatorid === val.operatorid))
        }
        else if (groupby === 1 || groupby === 2) {
          index = details.findIndex(item => (new Date(item.start).getTime() === new Date(val.start).getTime()) &&
            (new Date(item.end).getTime() === new Date(val.end).getTime()))
        }
// console.log(index,"indexindex",groupby,val)
        if (index >= 0) {
          if (groupby === 3) {
            let Jobstart = new Date(val.jobStart).getTime() > new Date(rangeStart).getTime() ? (val.jobStart) : rangeStart
            var start = new Date(val.jobStart).getTime() < new Date(rangeStart).getTime() ? (rangeStart) : Jobstart
            let Jobend = new Date(val.jobEnd).getTime() > new Date(rangeEnd).getTime() ? (rangeEnd) : val.jobEnd
            var end = new Date(val.jobEnd).getTime() < new Date(rangeEnd).getTime() ? (val.jobEnd) : Jobend

            ind = tempoperatordta.findIndex(o => o.operatorid === val.operatorid)
            if (ind === -1) {
              if (val.isDryer) {
                tempoperatordta.push(Object.assign({}, val, {
                  isDryer: true,
                  feed: details[index].feed ? details[index].feed : 0,
                  dried: details[index].dried ? details[index].dried : 0,
                  scrap: details[index].scrap ? details[index].scrap : 0,
                  gas: details[index].gas ? details[index].gas : 0,
                  elect: details[index].elect ? details[index].elect : 0,
                  moistin: details[index].moistin ? details[index].moistin : 0,
                  moistout: details[index].moistout ? details[index].moistout : 0,
                  unplannedDT: details[index].unplannedDT ? details[index].unplannedDT : 0,
                  totalDowntime: details[index].unplannedDT ? details[index].totalDowntime : 0,
                }))
              } else {
                tempoperatordta.push(Object.assign({}, val, {
                  job_cycleTime: [val.cycleTime ? val.cycleTime : 0],
                  mode_cycleTime: [details[index].partsdata.cycleTime ? details[index].partsdata.cycleTime : 0],
                  part_act_cycle_time: [details[index].partsdata.actCycleTime ? details[index].partsdata.actCycleTime : 0],
                  total_parts: [(details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0],
                  total_unplanned_dt: [details[index].assetStatus.totalDTime ? details[index].assetStatus.totalDTime : 0],
                  total_dt: [details[index].assetStatus.dTime ? details[index].assetStatus.dTime : 0],
                  quality_defects: [details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0],
                  total_duration: [(new Date(end).getTime() - new Date(start).getTime())/1000 ],
                  dressingCount: [details[index].dressing_count.count ? details[index].dressing_count.count : 0],
                  operators: [val.operator ? val.operator : '']
                }))
              }
            } else {
              if (val.isDryer) {
                let tempObj = tempoperatordta[ind];
                tempoperatordta[ind].feed = details[index].feed ? tempObj.feed + details[index].feed : 0;
                tempoperatordta[ind].dried = details[index].dried ? tempObj.dried + details[index].dried : 0;
                tempoperatordta[ind].scrap = details[index].scrap ? tempObj.scrap + details[index].scrap : 0;
                tempoperatordta[ind].gas = details[index].gas ? tempObj.gas + details[index].gas : 0;
                tempoperatordta[ind].elect = details[index].elect ? tempObj.elect + details[index].elect : 0;
                tempoperatordta[ind].moistin = details[index].moistin ? tempObj.moistin + details[index].moistin : 0;
                tempoperatordta[ind].moistout = details[index].moistout ? tempObj.moistout + details[index].moistout : 0;
                tempoperatordta[ind].unplannedDT = details[index].unplannedDT ? tempObj.unplannedDT + details[index].unplannedDT : 0;
                tempoperatordta[ind].totalDowntime = details[index].unplannedDT ? tempObj.totalDowntime + details[index].totalDowntime : 0;
              } else {
                tempoperatordta[ind].job_cycleTime.push(val.cycleTime)
                tempoperatordta[ind].mode_cycleTime.push(details[index].partsdata.cycleTime)
                tempoperatordta[ind].part_act_cycle_time.push(details[index].partsdata.actCycleTime)
                tempoperatordta[ind].total_parts.push((details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0)
                tempoperatordta[ind].total_unplanned_dt.push(details[index].assetStatus.totalDTime)
                tempoperatordta[ind].total_dt.push(details[index].assetStatus.dTime)
                tempoperatordta[ind].quality_defects.push(details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0)
                tempoperatordta[ind].total_duration.push((new Date(end).getTime() - new Date(start).getTime())/1000)
                tempoperatordta[ind].dressingCount.push(details[index].dressing_count.count ? details[index].dressing_count.count : 0)
                tempoperatordta[ind].operators.push(val.operator)
              }
            }

          } else if (groupby === 1) {
            start = val.start
            end = val.end 
            
            var completed = new Date(val.jobStart).getTime() <= new Date(val.start).getTime() && new Date(val.jobEnd).getTime() <= new Date(val.start).getTime() //ongoing execution

            var yet_to_start = new Date(val.jobStart).getTime() >= new Date(val.end).getTime() && new Date(val.jobEnd).getTime() >= new Date(val.end).getTime()

            ind = tempdaywisedata.findIndex(d => (new Date(d.start).getDate() === new Date(val.start).getDate() &&
              new Date(d.end).getDate() === new Date(val.end).getDate())
            )
            if (ind === -1) {
              if (val.isDryer) {
                tempdaywisedata.push(Object.assign({}, val, {
                  isDryer: true,
                  feed: details[index].feed ? details[index].feed : 0,
                  dried: details[index].dried ? details[index].dried : 0,
                  scrap: details[index].scrap ? details[index].scrap : 0,
                  gas: details[index].gas ? details[index].gas : 0,
                  elect: details[index].elect ? details[index].elect : 0,
                  moistin: details[index].moistin ? details[index].moistin : 0,
                  moistout: details[index].moistout ? details[index].moistout : 0,
                  unplannedDT: details[index].unplannedDT ? details[index].unplannedDT : 0,
                  totalDowntime: details[index].unplannedDT ? details[index].totalDowntime : 0,
                }))
              } else {
                tempdaywisedata.push(Object.assign({}, val, {
                  job_cycleTime: [val.cycleTime ? val.cycleTime : 0],
                  mode_cycleTime: [details[index].partsdata.cycleTime ? details[index].partsdata.cycleTime : 0],
                  part_act_cycle_time: [details[index].partsdata.actCycleTime ? details[index].partsdata.actCycleTime : 0],
                  total_parts: [(details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0],
                  total_unplanned_dt: [details[index].assetStatus.totalDTime ? details[index].assetStatus.totalDTime : 0],
                  total_dt: [details[index].assetStatus.dTime ? details[index].assetStatus.dTime : 0],
                  quality_defects: [details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0],
                  total_duration: [(new Date(end).getTime() - new Date(start).getTime())/1000],
                  dressingCount: [details[index].dressing_count.count ? details[index].dressing_count.count : 0],
                  opertors: [!(completed || yet_to_start) && val.operator ? val.operator : ''],
                  isDryer: false
                }))
              }
            } else if (tempdaywisedata[ind].entity_id === val.entity_id) {
              if (val.isDryer) {
                let tempObj = tempdaywisedata[ind];
                tempdaywisedata[ind].feed = details[index].feed ? tempObj.feed + details[index].feed : 0;
                tempdaywisedata[ind].dried = details[index].dried ? tempObj.dried + details[index].dried : 0;
                tempdaywisedata[ind].scrap = details[index].scrap ? tempObj.scrap + details[index].scrap : 0;
                tempdaywisedata[ind].gas = details[index].gas ? tempObj.gas + details[index].gas : 0;
                tempdaywisedata[ind].elect = details[index].elect ? tempObj.elect + details[index].elect : 0;
                tempdaywisedata[ind].moistin = details[index].moistin ? tempObj.moistin + details[index].moistin : 0;
                tempdaywisedata[ind].moistout = details[index].moistout ? tempObj.moistout + details[index].moistout : 0;
                tempdaywisedata[ind].unplannedDT = details[index].unplannedDT ? tempObj.unplannedDT + details[index].unplannedDT : 0;
                tempdaywisedata[ind].totalDowntime = details[index].unplannedDT ? tempObj.totalDowntime + details[index].totalDowntime : 0;
              } else {
                tempdaywisedata[ind].job_cycleTime.push(val.cycleTime)
                tempdaywisedata[ind].mode_cycleTime.push(details[index].partsdata.cycleTime ? details[index].partsdata.cycleTime : 0)
                tempdaywisedata[ind].part_act_cycle_time.push(details[index].partsdata.actCycleTime ? details[index].partsdata.actCycleTime : 0)
                tempdaywisedata[ind].total_parts.push((details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0)
                tempdaywisedata[ind].total_unplanned_dt.push(details[index].assetStatus.totalDTime)
                tempdaywisedata[ind].total_dt.push(details[index].assetStatus.dTime)
                tempdaywisedata[ind].quality_defects.push(details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0)
                tempdaywisedata[ind].total_duration.push((new Date(end).getTime() - new Date(start).getTime())/1000)
                tempdaywisedata[ind].dressingCount.push(details[index].dressing_count.count ? details[index].dressing_count.count : 0)
                tempdaywisedata[ind].opertors.push(!(completed || yet_to_start) && val.operator ? val.operator : '')
              }
            }
          } else if (groupby === 2) {
            start = val.start
            end = val.end


            completed = new Date(val.jobStart).getTime() <= new Date(val.start).getTime() && new Date(val.jobEnd).getTime() <= new Date(val.start).getTime() //ongoing execution

            yet_to_start = new Date(val.jobStart).getTime() >= new Date(val.end).getTime() && new Date(val.jobEnd).getTime() >= new Date(val.end).getTime()

            ind = tempshiftwisedata.findIndex(d => new Date(d.start).getTime() === new Date(val.start).getTime() &&
              new Date(d.end).getTime() === new Date(val.end).getTime())
            if (ind === -1) {
              if (val.isDryer) {
                tempshiftwisedata.push(Object.assign({}, val, {
                  isDryer: true,
                  feed: details[index].feed ? details[index].feed : 0,
                  dried: details[index].dried ? details[index].dried : 0,
                  scrap: details[index].scrap ? details[index].scrap : 0,
                  gas: details[index].gas ? details[index].gas : 0,
                  elect: details[index].elect ? details[index].elect : 0,
                  moistin: details[index].moistin ? details[index].moistin : 0,
                  moistout: details[index].moistout ? details[index].moistout : 0,
                  unplannedDT: details[index].unplannedDT ? details[index].unplannedDT : 0,
                  totalDowntime: details[index].unplannedDT ? details[index].totalDowntime : 0,
                }))
              } else {
                tempshiftwisedata.push(Object.assign({}, val, {
                  job_cycleTime: [val.cycleTime ? val.cycleTime : 0],
                  mode_cycleTime: [details[index].partsdata.cycleTime ? details[index].partsdata.cycleTime : 0],
                  part_act_cycle_time: [details[index].actCycleTime ? details[index].actCycleTime : 0],
                  total_parts: [(details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0],
                  total_unplanned_dt: [details[index].assetStatus.dTime ? details[index].assetStatus.totalDTime : 0],
                  total_dt: [details[index].assetStatus.totalDTime ? details[index].assetStatus.dTime : 0],
                  quality_defects: [details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0],
                  total_duration: [(new Date(end).getTime() - new Date(start).getTime())/1000],
                  dressingCount: [details[index].dressing_count.count ? details[index].dressing_count.count : 0],
                  operators: [!(completed || yet_to_start) && val.operator ? val.operator : '']
                }))
              }
            } else if (tempshiftwisedata[ind].entity_id !== val.entity_id){
              if (val.isDryer) {
                let tempObj = tempshiftwisedata[ind];
                tempshiftwisedata[ind].feed = details[index].feed ? tempObj.feed + details[index].feed : 0;
                tempshiftwisedata[ind].dried = details[index].dried ? tempObj.dried + details[index].dried : 0;
                tempshiftwisedata[ind].scrap = details[index].scrap ? tempObj.scrap + details[index].scrap : 0;
                tempshiftwisedata[ind].gas = details[index].gas ? tempObj.gas + details[index].gas : 0;
                tempshiftwisedata[ind].elect = details[index].elect ? tempObj.elect + details[index].elect : 0;
                tempshiftwisedata[ind].moistin = details[index].moistin ? tempObj.moistin + details[index].moistin : 0;
                tempshiftwisedata[ind].moistout = details[index].moistout ? tempObj.moistout + details[index].moistout : 0;
                tempshiftwisedata[ind].unplannedDT = details[index].unplannedDT ? tempObj.unplannedDT + details[index].unplannedDT : 0;
                tempshiftwisedata[ind].totalDowntime = details[index].unplannedDT ? tempObj.totalDowntime + details[index].totalDowntime : 0;
              } else {
                tempshiftwisedata[ind].job_cycleTime.push(val.cycleTime)
                tempshiftwisedata[ind].mode_cycleTime.push(details[index].partsdata.cycleTime ? details[index].partsdata.cycleTime : 0)
                tempshiftwisedata[ind].part_act_cycle_time.push(details[index].actCycleTime ? details[index].actCycleTime : 0)
                tempshiftwisedata[ind].total_parts.push((details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0)
                tempshiftwisedata[ind].total_unplanned_dt.push(details[index].assetStatus.totalDTime)
                tempshiftwisedata[ind].total_dt.push(details[index].assetStatus.dTime)
                tempshiftwisedata[ind].quality_defects.push(details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0)
                tempshiftwisedata[ind].total_duration.push((new Date(end).getTime() - new Date(start).getTime())/1000)
                tempshiftwisedata[ind].dressingCount.push(details[index].dressing_count.count ? details[index].dressing_count.count : 0)
                tempshiftwisedata[ind].operators.push(!(completed || yet_to_start) && val.operator ? val.operator : '')
              }
            }


          }


          if (groupby === 4) {
            start = val.start
            end = val.end
            if (val.isDryer) {
              let executionObj = {
                isDryer: true,
                feed: details[index].feed ? details[index].feed : 0,
                dried: details[index].dried ? details[index].dried : 0,
                scrap: details[index].scrap ? details[index].scrap : 0,
                gas: details[index].gas ? details[index].gas : 0,
                elect: details[index].elect ? details[index].elect : 0,
                moistin: details[index].moistin ? details[index].moistin : 0,
                moistout: details[index].moistout ? details[index].moistout : 0,
                unplannedDT: details[index].unplannedDT ? details[index].unplannedDT : 0,
                totalDowntime: details[index].unplannedDT ? details[index].totalDowntime : 0,
              };
              const executionArr = get_group_by_report_data([{ ...val, ...executionObj }])
              if (executionArr.length > 0) {
                operatordata.push(executionArr[0])
              }
            } else {
              let data={
                start:start,
                end:end,
                job_exp_cycle_time: 0
              }
              OEE = get_prod_oee_value(data, details[index].partsdata.cycleTime, details[index].actCycleTime, (details[index].partsdata.data && details[index].partsdata.data.length) ? details[index].partsdata.data.length : 0, details[index].assetStatus.dTime, details[index].assetStatus.totalDTime, details[index].qualityDefects.loss ? details[index].qualityDefects.loss : 0)
              const availability = isNaN(OEE.availability) ? 0 : OEE.availability;
              const performance = isNaN(OEE.performance) ? 0 : OEE.performance;
              const Quality = isNaN(OEE.quality) ? 0 : OEE.quality;
              OEE.OEE = parseFloat((availability * performance * Quality) * 100)
              OEE.entity_id = val.entity_id;
              OEE.assetName = val.entity_name
              if (val) {
                OEE.product_id = val.productname ? val.productname : "";
                OEE.order_id = val.orderid ? val.orderid : "";
                OEE.operator = val.operator ? val.operator : "";
                OEE.qty = val.qty ? val.qty : "";
                OEE.unit = val.unit ? val.unit : "";
                OEE.execid = val.execid ? val.execid : "";
                OEE.woid = val.woid ? val.woid : "";
                OEE.operatorid = val.operatorid ? val.operatorid : "";
                OEE.executionstatus = val.status ? val.status : 0;
                OEE.goodParts = OEE.actParts ? Number(OEE.actParts) - Number(OEE.qualdefects) : "0";
              }
              if (details[index].dressing_count) {
                OEE.dressingCount = details[index].dressing_count.count ? details[index].dressing_count.count : 0;
              }

              if (details[index].assetStatus && details[index].assetStatus.data && details[index].assetStatus.data.length > 0) {
                if (!val.is_status_signal_available) {
                  OEE.status = details[index].assetStatus.raw[details[index].assetStatus.data.length - 1] && details[index].assetStatus.raw[details[index].assetStatus.data.length - 1].value === 1 ? "IDLE" : "ACTIVE";
                } else {
                  OEE.status = details[index].assetStatus.raw[details[index].assetStatus.data.length - 1] && details[index].assetStatus.raw[details[index].assetStatus.data.length - 1].value;
                }

              }
              if (details[index].assetStatus && details[index].assetStatus.reasons && details[index].assetStatus.reasons.length > 0) {
                OEE.downtime_reasons = details[index].assetStatus.reasons;
              }
              if (details[index].qualityDefects && details[index].qualityDefects.reasons && details[index].qualityDefects.reasons.length > 0) {
                OEE.qualdefect_reasons = details[index].qualityDefects.reasons;
              }
              OEE.startrange = val.jobStart;
              OEE.endrange = val.jobEnd;
              operatordata.push(OEE)
            }

          }
        }
      })
    })
      // return;
      if (groupby === 3) {
        operatordata = get_group_by_report_data(tempoperatordta)
      }
      else if (groupby === 1) {
        operatordata = get_group_by_report_data(tempdaywisedata)

      }
      else if (groupby === 2) {
        operatordata = get_group_by_report_data(tempshiftwisedata)
      }
      setOutTableData(operatordata);
      setTableData(operatordata);
      setProgress(false)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partLoading, partData, partError])

  useEffect(() => {

    if ((!WorkExecutionError && !WorkExecutionLoading && WorkExecutionData)) {

      setProgress(true)
      let temp = []
      let tempexecution = []
      WorkExecutionData.forEach((val, index) => {
        let datesArr =[]
        const TemppushFnc=(start, end)=>{
          if (start && end) {
            
            
            let OptID ='' 
            let OptName = 'Unclassified'
            if(groupby === 3 && GetCurrentOperatorData.length>0){
              GetCurrentOperatorData.sort((a, b) => new Date(b.start) - new Date(a.start));
              console.log(GetCurrentOperatorData,"GetCurrentOperatorData",val)
              GetCurrentOperatorData.map(op=>{
                if((moment(start).isBetween(moment(op.start), moment(op.end)) || moment(start).isSame(op.start)) && (moment(end).isBetween(moment(op.start), moment(op.end)) || moment(end).isSame(op.end))){
                  OptID =op.operator_id
                  OptName = UserforLine.find(x => x.user_id === OptID).userByUserId.name
                  let tempIdx = tempexecution.findIndex((d) => d.start === start);
                  if(tempIdx >=0){
                    tempexecution[tempIdx].operatorid = OptID
                    tempexecution[tempIdx].operator = OptName
                  }else{ 
                    if( moment(end).isBefore(op.end)){
                      tempexecution.push(Object.assign({}, WorkExecutionData[index],
                        { 
                          "start": end,
                          "end": op.end,
                          jobStart:op.end,
                          jobEnd:end,
                          operatorid: '',
                          operator: 'Unclassified'
                        }))
                    }
                    tempexecution.push(Object.assign({}, WorkExecutionData[index],
                      { 
                        "start": start,
                        "end": end,
                        operatorid: OptID,
                        operator: OptName
                    }))
                    if(moment(start).isBefore(op.start)){
                      tempexecution.push(Object.assign({}, WorkExecutionData[index],
                        { 
                          "start": op.start,
                          "end": start,
                          jobStart:op.start,
                          jobEnd:start,
                          operatorid: '',
                          operator: 'Unclassified'
                        }))  
                    }
                    
                  }  
                }else{
                  if((moment(start).isBetween(moment(op.start), moment(op.end)) || moment(start).isSame(op.start))){
                    OptID =op.operator_id
                    OptName = UserforLine.find(x => x.user_id === OptID).userByUserId.name
                    temp.push({
                      "start_date": start,
                      "end_date": op.end,
                      "execid": val.execid
                    })
                    temp.push({
                      "start_date": start,
                      "end_date": end,
                      "execid": val.execid
                    })
                    tempexecution.push(Object.assign({}, WorkExecutionData[index],
                      { 
                        "start": start,
                        "end": op.end,
                        jobEnd:op.end,
                        operatorid: OptID,
                        operator: OptName
                      }))
                      tempexecution.push(Object.assign({}, WorkExecutionData[index],
                        { 
                          "start": op.end,
                          "end": end,
                          jobStart:op.end,
                          operatorid: '',
                          operator: 'Unclassified'
                        }))
                  }else{
                    if((moment(end).isBetween(moment(op.start), moment(op.end)) || moment(end).isSame(op.end))){
                      OptID =op.operator_id
                      OptName = UserforLine.find(x => x.user_id === OptID).userByUserId.name
                      let tempIdx = tempexecution.findIndex((d) => d.end === end);
                      if(tempIdx >=0){
                        tempexecution[tempIdx].operatorid = OptID
                        tempexecution[tempIdx].operator = OptName
                        tempexecution[tempIdx].start = op.start
                        tempexecution[tempIdx].jobStart = op.start
                        tempexecution.push(Object.assign({}, WorkExecutionData[index],
                          { 
                            "start": start,
                            "end": op.start,
                            jobStart:start,
                            jobEnd: op.start,
                            operatorid: '',
                            operator: 'Unclassified'
                          }))

                      }else{
                        if(moment(end).isSame(op.end)){
                          tempexecution.push(Object.assign({}, WorkExecutionData[index],
                            { 
                              "start": op.start,
                              "end": end,
                              jobStart:op.start,
                              operatorid: OptID,
                              operator: OptName
                            }))  
                        }else{
                          tempexecution.push(Object.assign({}, WorkExecutionData[index],
                            { 
                              "start": end,
                              "end": op.end,
                              jobStart:op.end,
                              jobEnd:end,
                              operatorid: '',
                              operator: 'Unclassified'
                            }))
                            tempexecution.push(Object.assign({}, WorkExecutionData[index],
                              { 
                                "start": op.start,
                                "end": end,
                                jobStart:op.start,
                                operatorid: OptID,
                                operator: OptName
                              }))
                        }
                        
                      }
                        
                    }else{ 
                      let tempIdx = tempexecution.findIndex((d) => d.start === start);
                      if (tempIdx === -1){
                        tempexecution.push(Object.assign({}, WorkExecutionData[index],
                          { 
                            "start": start,
                            "end": end,
                            operatorid: OptID,
                            operator: OptName
                          }))
                      }
                      
                    }
                  }
                }
              })
            }else{
              temp.push({
                "start_date": start,
                "end_date": end,
                "execid": val.execid
              })
              tempexecution.push(Object.assign({}, WorkExecutionData[index],
                { 
                  "start": start,
                  "end": end,
                  operatorid: OptID,
                  operator: OptName
                }))
            }
            
          }
        }
        
        if (val && (groupby === 4 || groupby === 3 || groupby === 1)) {
            const [start, end] = configParam.excutionDuration(val.jobStart, val.jobEnd, rangeStart, rangeEnd);
            TemppushFnc(start, end);
        }
      
        else if (groupby === 2) {
          datesArr = getShiftBetweenDates(moment(val.jobStart), moment(val.jobEnd), headPlant.shift)
        }
        datesArr.forEach((date, i) => {
          const [start, end] = configParam.excutionDuration(date.start, date.end, rangeStart, rangeEnd);
          TemppushFnc(start, end)
        })
      }) 
      if(WorkExecutionData.length===0){
        let datesArr =[]
        const TemppushFnc=(start, end)=>{
          tempexecution.push(Object.assign({},
            { 
              "start": start,
              "end": end,
              jobStart:start,
              jobEnd:end,
              operatorid: '',
              operator: 'Unclassified',
              "execid": '',
              entity_name:oeeConfigData[0].entity.name,
              entity_id: oeeConfigData[0].entity.id
            }))
        }
        if ((groupby === 4 || groupby === 3) ) {
            const [start, end] = configParam.excutionDuration(rangeStart, rangeEnd, rangeStart, rangeEnd);
            TemppushFnc(start, end);
        }
    
        else if (groupby === 1) {
          datesArr = common.getBetweenDates(moment(rangeStart), moment(rangeEnd), 'day')
        }
        else if (groupby === 2) {
          datesArr = common.getShiftBetweenDates(moment(rangeStart), moment(rangeEnd), headPlant.shift)
        }
        datesArr.forEach((date, i) => {
          const [start, end] = configParam.excutionDuration(date.start, date.end, rangeStart, rangeEnd);
          TemppushFnc(start, end)
        })
        
      }
      setexecutiondata(tempexecution)
      // console.log(tempexecution,"tempexecution",WorkExecutionData,temp)
      setdurations(tempexecution)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WorkExecutionLoading, WorkExecutionError, WorkExecutionData])

  useEffect(() => {
    
    if(oeeConfigData.length>0){
      let ConfigData = durations.map(d=> {return {...d,...oeeConfigData[0],wo_start: d.start,wo_end: d.end}}) 
      getPartsCompleted(headPlant.schema, (groupby === 4) ? oeeConfigData : ConfigData, customdatesval.StartDate, customdatesval.EndDate,false,'',(groupby === 4) ? ConfigData : [],0,false,true)
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations])

  useEffect(()=>{
    console.log(partLoading, partData, partError,"partLoading, partData, partError")
  },[ partLoading, partData, partError])

  function getAssetOEEConfigs() {
    if (downtimeAsset && downtimeAsset.length > 0) {
      getMultipleAssetOEEConfig(downtimeAsset);
    }
  }
  useEffect(() => {
    if (!multipleAssetOEEConfigLoading && multipleAssetOEEConfigData && !multipleAssetOEEConfigError) {
      setOEEConfigData(multipleAssetOEEConfigData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multipleAssetOEEConfigData]);
  useEffect(() => {

    if (oeeConfigData.length > 0) {
      
      getGetCurrentOperator(oeeConfigData[0].entity.id, moment(customdatesval.StartDate).format('YYYY-MM-DDTHH:mm:ssZ'), moment(customdatesval.EndDate).format('YYYY-MM-DDTHH:mm:ssZ'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oeeConfigData, customdatesval])


  function getShiftBetweenDates(from, to, shift) {


    let now = from.clone(), dates = [];
    let offset = moment(now).utcOffset()

    while (now.isSameOrBefore(to)) {

      if (shift.ShiftType === "Weekly") {

        let td = new Date(now).getDay() - 1 < 0 ? "6" : (new Date(now).getDay() - 1).toString();
        if (shift.shifts[td]) {

          for (let j of shift.shifts[td]) {

            let shifStartDate = j.startDate.split(":")
            let shifEndDate = j.endDate.split(":")
            let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0)//new Date(now)
            let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0)//new Date(now)
            let tempStartwithoffset = tempStart.add(offset, 'minutes')
            let tempEndwithoffset = tempEnd.add(offset, 'minutes')

            let start = moment(now).set('hour', tempStartwithoffset.hours()).set('minute', tempStartwithoffset.minutes()).set('seconds', 0)
            let end = moment(now).set('hour', tempEndwithoffset.hours()).set('minute', tempEndwithoffset.minutes()).set('seconds', 0)
            if (new Date(end).getTime() < new Date(start).getTime()) {
              end.add(1, 'day')
            }
            dates.push({ start: moment(from).format("YYYY-MM-DDTHH:mm:ss"+TZone), end: moment(to).format("YYYY-MM-DDTHH:mm:ss"+TZone), name: shift.shifts[td].name })
          }
        }
        now.add(1, 'days');

      } else {
        for (let i of shift.shifts) {
          let shifStartDate = i.startDate.split(":")
          let shifEndDate = i.endDate.split(":")
          let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0)//new Date(now)
          let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0)//new Date(now)
          if (new Date(tempEnd) < new Date(tempStart)) { tempEnd.add(1, 'day') }
          dates.push({ start: moment(tempStart).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone), end: moment(tempEnd).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ss"+TZone), name: i.name })
        }
        now.add(1, 'days');
      }

    }

    return dates;


  }
  async function triggerOEE(dataArray) {
    let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+TZone)
    let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss"+TZone)

   
    let dates = [{ start: startrange, end: endrange }]
    setRangeStart(startrange)
    setRangeEnd(endrange)
    getWorkExecutionTime(dataArray, dates)
    
  }
  useEffect(() => {

    if (editExecute) {
      setEditExec(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {

    let newheadCells = []

    //Shiftwise
    if (groupby === 2) {

      newheadCells = headCells.map(p => {
        if (p.id === "shift") {
          return Object.assign({}, p, { "display": "block", "hide": false })
        } else if (p.id === "workorder") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "end_date") {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "start_date") {
          return Object.assign({}, p, { "label": "Date", "display": "block", "hide": false })
        } else if ((p.id === "product")) {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "operator") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "dressing_count") {
          if (headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 2)
            return Object.assign({}, p, { "display": "block", "hide": false })
          else
            return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "assetName") {
          return Object.assign({}, p, { "display": "block", "hide": false })
        } else if (p.id === "oee") {
          return Object.assign({}, p, { "display": "block", "label": t("OEE"), "hide": false })
        } else {
          return Object.assign({}, p)
        }

      }
      )

    }


    //Executionwise
    else if (groupby === 4) {

      newheadCells = headCells.map(p => {
        if (p.id === "workorder") {
          return Object.assign({}, p, { "display": 'block', "hide": false })
        } else if (p.id === "shift") {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "end_date") {
          return Object.assign({}, p, { "display": 'block', "label": "End Date", "hide": false })
        } else if (p.id === "start_date") {
          return Object.assign({}, p, { "label": "Start Date", "display": "block", "hide": false })
        } else if (p.id === "assetName") {
          return Object.assign({}, p, { "display": "block", "hide": false })
        } else if (p.id === "dressing_count") {
          if (headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 2)
            return Object.assign({}, p, { "display": "block", "hide": false })
          else
            return Object.assign({}, p, { "display": "none", "hide": true })
        }else if(p.id === 'downtime'){
          return Object.assign({}, p, { "display": 'block', "hide": false })
        } else if ((p.id === "product")) {
          return Object.assign({}, p, { "display": 'block', "hide": false })
        } else if (p.id === "operator") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "oee") {
          return Object.assign({}, p, { "display": "block", "label": t("OEE"), "hide": false })
        }
        else {
          return Object.assign({}, p)
        }
      }
      )
    }

    //Operatorwise
    else if (groupby === 3) {

      newheadCells = headCells.map(p => {
        if (p.id === "workorder") {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "assetName") {
          return Object.assign({}, p, { "display": 'block', "hide": false })
        } else if (p.id === "end_date") {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "start_date") {
          return Object.assign({}, p, { "display": "block", "hide": false })
        } else if (p.id === "dressing_count") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "product") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "shift") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "oee") {
          return Object.assign({}, p, { "display": "block", "label": "Operator Efficiency", "hide": false })
        } else if (p.id === "operator") {
          return Object.assign({}, p, { "display": "block", "hide": false })
        }
        else {
          return Object.assign({}, p)
        }
      }
      )
    }
    //Daywise
    else {

      newheadCells = headCells.map(p => {
        if (p.id === "shift") {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if ((p.id === "workorder")) {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "end_date") {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "start_date") {
          return Object.assign({}, p, { "label": "Date", "display": "block", "hide": false })
        } else if ((p.id === "product")) {
          return Object.assign({}, p, { "display": 'none', "hide": true })
        } else if (p.id === "dressing_count") {
          if (headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 2)
            return Object.assign({}, p, { "display": "block", "hide": false })
          else
            return Object.assign({}, p, { "display": "none", "hide": true })
        } else if (p.id === "assetName") {
          return Object.assign({}, p, { "display": "block", "hide": false })
        } else if (p.id === "oee") {
          return Object.assign({}, p, { "display": "block", "label": t("OEE"), "hide": false })
        } else if (p.id === "operator") {
          return Object.assign({}, p, { "display": "none", "hide": true })
        } else {
          return Object.assign({}, p)
        }
      }
      )

    }

    setheadCells(newheadCells)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupby])

  return (
    <div className="p-4">
      {!editExecute ? (
        <Grid container >
          <Grid item xs={12} >
            <ProductionWorkOrders outTableData={outTableData} triggerOEE={getAssetOEEConfigs} headcell={headCells} updateCell={(e) => setheadCells(e)} />
          </Grid>
        </Grid>
      ) : <React.Fragment></React.Fragment>
      }
    </div>
  );
})
export default ProductionWorkOrder;
