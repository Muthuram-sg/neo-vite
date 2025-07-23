import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useCycleTime = () => {
  const [cycleLoading, setLoading] = useState(false);
  const [cycleData, setData] = useState(null);
  const [cycleError, setError] = useState(null);

  const getCycleTime = async (asset_idArray, start_date, end_date) => {
    setLoading(true);
    Promise.all(asset_idArray.map(async (val) => {
      return configParam.RUN_GQL_API(gqlQueries.getExecCycleTime, { asset_id: val.entity_id, from: start_date, to: end_date })
        .then((oeeData) => {
          if (oeeData !== undefined && oeeData.neo_skeleton_prod_exec && oeeData.neo_skeleton_prod_exec.length > 0) {
            let cycleTime = 3600 / parseInt(oeeData.neo_skeleton_prod_exec[0].prod_order.prod_product.unit) 
            return { jobStart: oeeData.neo_skeleton_prod_exec[0].start_dt, jobEnd: oeeData.neo_skeleton_prod_exec[0].end_dt, cycleTime: cycleTime }
          } else {
            return { cycleTime: 0 }
          }
        })
        .catch((e) => {
          return e;
        });
    }))
      .then(data => {
        setData(data);
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
  return { cycleLoading, cycleData, cycleError, getCycleTime };
};

export default useCycleTime;