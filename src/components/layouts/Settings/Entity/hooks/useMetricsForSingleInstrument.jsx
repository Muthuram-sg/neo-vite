import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useMetricsForSingleInstrument = () => {
    const [MetricsForSingleInstrumentLoading, setLoading] = useState(false); 
    const [MetricsForSingleInstrumentError, setError] = useState(null); 
    const [MetricsForSingleInstrumentData, setData] = useState(null); 

    const getMetricsForSingleInstrument = async (instruments_id,type) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getMetricsForSingleInstrument,{ instruments_id: instruments_id })
        
            .then((returnData) => {
             
                if (returnData !== undefined && returnData.neo_skeleton_instruments_metrics && returnData.neo_skeleton_instruments_metrics) {
                    setData({Data:returnData.neo_skeleton_instruments_metrics,type : type})
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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  MetricsForSingleInstrumentLoading, MetricsForSingleInstrumentData, MetricsForSingleInstrumentError, getMetricsForSingleInstrument };
};

export default useMetricsForSingleInstrument;