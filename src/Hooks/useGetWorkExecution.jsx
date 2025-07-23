/* eslint-disable array-callback-return */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetWorkExecution = () => {
  const [WorkExecutionLoading, setLoading] = useState(false);
  const [WorkExecutionData, setData] = useState(null);
  const [WorkExecutionError, setError] = useState(null);

  const getWorkExecutionTime = async (asset_idArray, durations) => {
    setLoading(true);

    Promise.all(durations.map((date) => {
      let start_date = date.start;
      let end_date = date.end; 
      return Promise.all(asset_idArray.map(async (val) => {
        let prodWO_Exe = await configParam.RUN_GQL_API(gqlQueries.getProductionWorkOrderExecutions, { asset_id: val.entity_id, from: start_date, to: end_date })
          .then((oeeData) => {
            console.log("oeedata",oeeData)
            let execdata = [] 
            oeeData.neo_skeleton_prod_exec.map((exec) => {
              if (oeeData !== undefined && oeeData.neo_skeleton_prod_exec && oeeData.neo_skeleton_prod_exec.length > 0) {
                let cycleTime = 3600 / Number(exec.prod_order.prod_product.unit)
                let expEnergy = exec.prod_order.prod_product.expected_energy ? exec.prod_order.prod_product.expected_energy : 0;
                let moisture_in = exec.prod_order.prod_product.moisture_in ? exec.prod_order.prod_product.moisture_in : 0;
                let moisture_out = exec.prod_order.prod_product.moisture_out ? exec.prod_order.prod_product.moisture_out : 0
                let execid = exec.id ? exec.id : 0;
                let woid = exec.prod_order && exec.prod_order.id ? exec.prod_order.id : "";
                let operatorid = exec.userByOperatorId && exec.userByOperatorId.id ? exec.userByOperatorId.id : "";
                let unit = exec.prod_order && exec.prod_order.prod_product && exec.prod_order.prod_product.unit ? exec.prod_order.prod_product.unit : "";
                let productname = exec.prod_order && exec.prod_order.prod_product && exec.prod_order.prod_product.name ? exec.prod_order.prod_product.name : "";
                let orderid = exec.prod_order && exec.prod_order.order_id ? exec.prod_order.order_id : "";
                let qty = exec.prod_order && exec.prod_order.qty ? exec.prod_order.qty : "";
                let operator = exec.userByOperatorId && exec.userByOperatorId.name ? exec.userByOperatorId.name : "";
                let entity_id = exec.entity && exec.entity.id ? exec.entity.id : "";
                let entity_name = exec.entity && exec.entity.name ? exec.entity.name : ""
                let status = exec.status ? exec.status : ""
                let JobEndDate = exec.end_dt
                let JobStartDate = exec.start_dt
                // let prod_mic_duration = exec.prod_order?.prod_product?.is_micro_stop ? exec.prod_order?.prod_product?.mic_stop_to_time - exec.prod_order?.prod_product?.mic_stop_from_time : null
                let prod_mic_duration = exec.prod_order?.prod_product?.is_micro_stop ? exec.prod_order?.prod_product?.mic_stop_to_time : null
                let is_product_microstop = exec.prod_order?.prod_product?.is_micro_stop
                if(new Date(exec.end_dt).getTime() >  new Date(end_date).getTime()){
                  JobEndDate = end_date
                }
                if(new Date(exec.start_dt).getTime() <  new Date(start_date).getTime()){
                  JobStartDate = start_date
                }
                execdata.push({
                  jobStart: JobStartDate, jobEnd: JobEndDate, cycleTime: cycleTime, productname: productname, orderid: orderid, operator: operator, qty: qty, unit: unit, execid: execid, woid: woid, operatorid: operatorid, entity_id: entity_id, entity_name: entity_name, status: status, start: start_date,
                  end: end_date, expEnergy: expEnergy, moisture_in: moisture_in, moisture_out: moisture_out,id: exec.id,ended_at: exec.end_dt, prod_mic_duration, is_product_microstop
                })
              } else {
                execdata.push({ cycleTime: 0 })
              }
            


            }) 
            return execdata
          })
          .catch((e) => {
            return e;
          });
          let prodWO_ExeLive = await configParam.RUN_GQL_API(gqlQueries.getProductionWorkOrderExecutionsLive, { 
            asset_id: val.entity_id, 
            // from: start_date, 
            to: end_date  })
          .then((oeeData) => {
            //console.log("oeedata",oeeData)
            let execdata = [] 
            oeeData.neo_skeleton_prod_exec.map((exec) => {
              if (oeeData !== undefined && oeeData.neo_skeleton_prod_exec && oeeData.neo_skeleton_prod_exec.length > 0) {
                let cycleTime = 3600 / Number(exec.prod_order.prod_product.unit)
                let expEnergy = exec.prod_order.prod_product.expected_energy ? exec.prod_order.prod_product.expected_energy : 0;
                let moisture_in = exec.prod_order.prod_product.moisture_in ? exec.prod_order.prod_product.moisture_in : 0;
                let moisture_out = exec.prod_order.prod_product.moisture_out ? exec.prod_order.prod_product.moisture_out : 0
                let execid = exec.id ? exec.id : 0;
                let woid = exec.prod_order && exec.prod_order.id ? exec.prod_order.id : "";
                let operatorid = exec.userByOperatorId && exec.userByOperatorId.id ? exec.userByOperatorId.id : "";
                let unit = exec.prod_order && exec.prod_order.prod_product && exec.prod_order.prod_product.unit ? exec.prod_order.prod_product.unit : "";
                let productname = exec.prod_order && exec.prod_order.prod_product && exec.prod_order.prod_product.name ? exec.prod_order.prod_product.name : "";
                let orderid = exec.prod_order && exec.prod_order.order_id ? exec.prod_order.order_id : "";
                let qty = exec.prod_order && exec.prod_order.qty ? exec.prod_order.qty : "";
                let operator = exec.userByOperatorId && exec.userByOperatorId.name ? exec.userByOperatorId.name : "";
                let entity_id = exec.entity && exec.entity.id ? exec.entity.id : "";
                let entity_name = exec.entity && exec.entity.name ? exec.entity.name : ""
                let status = exec.status ? exec.status : ""
                let JobEndDate = exec.end_dt
                let JobStartDate = exec.start_dt
                // let prod_mic_duration = exec.prod_order?.prod_product?.is_micro_stop ? exec.prod_order?.prod_product?.mic_stop_to_time - exec.prod_order?.prod_product?.mic_stop_from_time : null
                let prod_mic_duration = exec.prod_order?.prod_product?.is_micro_stop ? exec.prod_order?.prod_product?.mic_stop_to_time : null
                let is_product_microstop = exec.prod_order?.prod_product?.is_micro_stop
                if(exec.end_dt === null){
                  JobEndDate = end_date
                }
                if(new Date(exec.start_dt).getTime() <  new Date(start_date).getTime()){
                  JobStartDate = start_date
                }
                execdata.push({
                  jobStart: JobStartDate, jobEnd: JobEndDate, cycleTime: cycleTime, productname: productname, orderid: orderid, operator: operator, qty: qty, unit: unit, execid: execid, woid: woid, operatorid: operatorid, entity_id: entity_id, entity_name: entity_name, status: status, start: start_date,
                  end: end_date, expEnergy: expEnergy, moisture_in: moisture_in, moisture_out: moisture_out,id: exec.id, ended_at: exec.end_dt, prod_mic_duration, is_product_microstop
                })
              } else {
                execdata.push({ cycleTime: 0 })
              }
            


            }) 
            return execdata
          })
          .catch((e) => {
            return e;
          });
      
          return [...prodWO_Exe,...prodWO_ExeLive]
      }))
        .then(data => {
          
          return data.flat(1)
        })
        .catch((e) => {
          setData(e);
          setError(true)
          setLoading(false)
        }) 
    }))
      .then(data => {
        
        let result = data.length > 0 ? data.flat(1) : [] 
        if(result.length > 0){
          result.sort((a, b) => new Date(b.jobStart) - new Date(a.jobStart));
          console.log(data,"dataFinal",result)
        }
        
        setData(result);
        setError(false)
      })
      .catch((e) => {
        setData(e);
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      });

  };
  return { WorkExecutionLoading, WorkExecutionData, WorkExecutionError, getWorkExecutionTime };
};

export default useGetWorkExecution;