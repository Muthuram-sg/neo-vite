import { useState } from "react";
import configParam from "config"; 

const useGetAllInstrument = () => {
    const [InstrumentListLoading, setLoading] = useState(false); 
    const [InstrumentListError, setError] = useState(null); 
    const [InstrumentListData, setData] = useState(null); 

    const getInstrumentList = async () => {
        setLoading(true);
    const url = "/dashboards/getAllInstrument";
    await configParam.RUN_REST_API(url)
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.data && returnData.data.length > 0) { 
                    
                    setData(returnData.data)
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
    return {  InstrumentListLoading, InstrumentListData, InstrumentListError, getInstrumentList };
};

export default useGetAllInstrument;