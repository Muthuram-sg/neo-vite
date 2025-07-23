import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useInstrumentStatusList = () => { 
    const [InstrumentStatusLoading, setLoading] = useState(false);  
    const [InstrumentStatusData, setData] = useState(null);  
    const [InstrumentStatusError, setError] = useState(null);  

    const getInstrumentStatusList = async () => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentStatusList,{}) 

            .then((returnData) => {   
                if (returnData !== undefined && returnData.neo_skeleton_instrument_status_type && returnData.neo_skeleton_instrument_status_type.length > 0) {  

                    setData(returnData.neo_skeleton_instrument_status_type) 
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
                console.log("NEW MODEL", "ERR", e, "Instrument Status List", new Date()) 
            }); 

    }; 
    return { InstrumentStatusLoading, InstrumentStatusData, InstrumentStatusError, getInstrumentStatusList }; 
}; 

export default useInstrumentStatusList; 