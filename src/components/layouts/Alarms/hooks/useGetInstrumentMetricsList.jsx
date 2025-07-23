import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetInstrumentMetricsList= () => {
    const [ InstrumentMetricsListLoading , setLoading] = useState(false);
    const [ InstrumentMetricsListData, setData] = useState(null);
    const [ InstrumentMetricsListError , setError] = useState(null);

    const getInsrumentMetricsList = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getMetricsForSingleInstrument, { instruments_id: id}) 
          .then((metricList) => {
         
            if ( metricList !== undefined && metricList.neo_skeleton_instruments_metrics && metricList.neo_skeleton_instruments_metrics.length > 0) {
                setData(metricList.neo_skeleton_instruments_metrics)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return {   InstrumentMetricsListLoading,  InstrumentMetricsListData , InstrumentMetricsListError, getInsrumentMetricsList };
};

export default useGetInstrumentMetricsList;