import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetOptixAssertOption = () => {
    const [GetOptixAssertOptionLoading, setLoading] = useState(false); 
    const [GetOptixAssertOptionError, setError] = useState(null); 
    const [GetOptixAssertOptionData, setData] = useState(null); 

    const getGetOptixAssertOption = async (instrument_type,line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAssertForOptix,{instrument_type: instrument_type,line_id:line_id})
        
            .then((returnData) => {
                if (returnData !== undefined && returnData.neo_skeleton_entity && returnData.neo_skeleton_entity) {
                    setData(returnData.neo_skeleton_entity)
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
    return {  GetOptixAssertOptionLoading, GetOptixAssertOptionData, GetOptixAssertOptionError, getGetOptixAssertOption };
};

export default useGetOptixAssertOption;