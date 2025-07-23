import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useMetricsInstrument = () => {
    const [MetricsInstrumentLoading, setLoading] = useState(false);
    const [MetricsInstrumentData, setData] = useState(null);
    const [MetricsInstrumentError, setError] = useState(null);

    const getMetricsInstrument  = async ( ) => {
        setLoading(true);

        configParam.RUN_GQL_API(Queries.getMetricsInstrument, {  })
            .then((returnData) => {
                if(returnData !== undefined && returnData.neo_skeleton_instruments_metrics){
                    setData(returnData.neo_skeleton_instruments_metrics);
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
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { MetricsInstrumentLoading, MetricsInstrumentData, MetricsInstrumentError, getMetricsInstrument };
}


export default useMetricsInstrument;