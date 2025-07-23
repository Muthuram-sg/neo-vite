import { useState } from "react";
import configParam from "config";  
import gqlQueries from "components/layouts/Queries"

const useGetInstrumentMetrics= () => {
    const [  InstrumetMetricsLoading , setLoading] = useState(false);
    const [  InstrumetMetricsData, setData] = useState(null);
    const [  InstrumetMetricsError , setError] = useState(null);

    const getInstrumentMetrics= async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentmetrics, {  }) 
          .then((instrumentsData) => {
           
            if ( instrumentsData !== undefined && instrumentsData.neo_skeleton_instruments_metrics) {
                setData(instrumentsData.neo_skeleton_instruments_metrics)
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
    return {    InstrumetMetricsLoading,   InstrumetMetricsData ,  InstrumetMetricsError, getInstrumentMetrics};
};

export default  useGetInstrumentMetrics;