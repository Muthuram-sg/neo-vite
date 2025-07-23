import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useMetricsForInstrument = () => {
    const [MetricsForInstrumentLoading, setLoading] = useState(false); 
    const [MetricsForInstrumentError, setError] = useState(null); 
    const [MetricsForInstrumentData, setData] = useState(null); 

    const getMetricsForInstrument = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getMetricsForInstrument,{id: id})
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_instruments_metrics) {
                    setData(returnData.neo_skeleton_instruments_metrics)
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
                console.log("NEW MODEL", "ERR", e, "Reports", new Date())
            });

    };
    return {  MetricsForInstrumentLoading, MetricsForInstrumentData, MetricsForInstrumentError, getMetricsForInstrument };
};

export default useMetricsForInstrument;