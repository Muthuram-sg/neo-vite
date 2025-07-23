import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useCo2Factor = () => {
    const [Co2FactorLoading, setLoading] = useState(false); 
    const [Co2FactorError, setError] = useState(null); 
    const [Co2FactorData, setData] = useState(null); 

    const getCo2Factor = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.Co2Factor,{ line_id: line_id})
        
            .then((returnData) => {
                if (returnData.neo_skeleton_co2_factor) {
                    setData(returnData.neo_skeleton_co2_factor)
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
                console.log("NEW MODEL", "ERR", e, "Co2Factor Setting", new Date())
            });

    };
    return {  Co2FactorLoading, Co2FactorData, Co2FactorError, getCo2Factor };
};

export default useCo2Factor;