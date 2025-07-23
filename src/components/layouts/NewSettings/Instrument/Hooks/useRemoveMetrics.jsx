import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";


const useRemoveMetrics = () => {
    const [RemoveMetricsLoading, setLoading] = useState(false);
    const [RemoveMetricsData, setData] = useState(null);
    const [RemoveMetricsError, setError] = useState(null);
    const getRemoveMetrics = async (instrumentID,line_id) => {
        setLoading(true);

        await configParam.RUN_GQL_API(mutations.deleteInstrumentMetricswithoutMetric, {instrumentid: instrumentID })
            .then(async(response) => {
                let data = response.delete_neo_skeleton_instruments_metrics;
                if (data && data.affected_rows >= 1) {
                   const result= await configParam.RUN_GQL_API(mutations.DeleteInstrument,{ id: instrumentID, line_id: line_id })
                    .then((response1)=>{
                        
                        return response1.delete_neo_skeleton_instruments
                        
                    })
                  
                    setData(result);
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { RemoveMetricsLoading, RemoveMetricsData, RemoveMetricsError, getRemoveMetrics };
}


export default useRemoveMetrics;