import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useWorkExcuetion = () => {
  const [WorkExecutionLoading, setLoading] = useState(false);
  const [WorkExecutionData, setData] = useState(null);
  const [WorkExecutionError, setError] = useState(null);

  const getWorkExecutionTime = async (asset_idArray, durations) => {
    setLoading(true);
    Promise.all(durations.map((date) => {
      let start_date = date.start;
      let end_date = date.end; 
       
      let result = Promise.all(asset_idArray.map(async (val) => {
         return configParam.RUN_GQL_API(gqlQueries.getProductionWorkOrderExecutions, { asset_id: val.entity_id, from: start_date, to: end_date })
          .then((oeeData) => { 
            let execdata = []
            // eslint-disable-next-line array-callback-return
            oeeData.neo_skeleton_prod_exec.map((exec) => {
              if (oeeData !== undefined && oeeData.neo_skeleton_prod_exec && oeeData.neo_skeleton_prod_exec.length > 0) { 
                console.log(3600 / parseInt(exec.prod_order.prod_product.unit),"getProductionWorkOrderExecutions",3600 / Number(exec.prod_order.prod_product.unit),exec.prod_order.prod_product.unit)
                let cycleTime = 3600 / Number(exec.prod_order.prod_product.unit)
                let expEnergy = exec.prod_order.prod_product.expected_energy?exec.prod_order.prod_product.expected_energy:0;
                let moisture_in = exec.prod_order.prod_product.moisture_in?exec.prod_order.prod_product.moisture_in:0;
                let moisture_out = exec.prod_order.prod_product.moisture_out?exec.prod_order.prod_product.moisture_out:0
                let execid = exec.id ? exec.id : 0;
                let woid = (exec.prod_order && exec.prod_order.id) ? exec.prod_order.id : "";
                let operatorid = (exec.userByOperatorId && exec.userByOperatorId.id) ? exec.userByOperatorId.id : "" ;
                let unit = (exec.prod_order && exec.prod_order.prod_product && exec.prod_order.prod_product.unit) ? exec.prod_order.prod_product.unit : "" ;
                let productname = (exec.prod_order && exec.prod_order.prod_product && exec.prod_order.prod_product.name) ? exec.prod_order.prod_product.name : "" ;
                let orderid = (exec.prod_order && exec.prod_order.order_id) ? exec.prod_order.order_id : "";
                let qty = (exec.prod_order && exec.prod_order.qty) ? exec.prod_order.qty : "";
                let operator = (exec.userByOperatorId && exec.userByOperatorId.name) ? exec.userByOperatorId.name : "";
                let entity_id = (exec.entity && exec.entity.id) ? exec.entity.id : "";
                let entity_name = (exec.entity && exec.entity.name) ? exec.entity.name : ""
                let status = exec.status ? exec.status : ""
                let isDryer = exec.entity.dryer_config && exec.entity.dryer_config.is_enable ? true: false;
                execdata.push({
                  jobStart: exec.start_dt, jobEnd: exec.end_dt, cycleTime: cycleTime, productname: productname, orderid: orderid, operator: operator, qty: qty, unit: unit, execid: execid, woid: woid, operatorid: operatorid, entity_id: entity_id, entity_name: entity_name, status: status, start: start_date,
                  end: end_date,expEnergy: expEnergy,moisture_in: moisture_in,moisture_out: moisture_out,isDryer: isDryer
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
      }))
        .then(data => {
          
          return data.flat(1)
        })
        .catch((e) => {
          setData(e);
          setError(true)
          setLoading(false)
        }) 
      return result;

    }))
      .then(data => {
        
        setData(data.length > 0 ? data.flat(1) : []);
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

export default useWorkExcuetion;