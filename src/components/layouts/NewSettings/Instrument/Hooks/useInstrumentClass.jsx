import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useInstrumentClass = () => { 
    const [InstrumentClassLoading, setLoading] = useState(false);  
    const [InstrumentClassData, setData] = useState(null);  
    const [InstrumentClassError, setError] = useState(null);  

    const getInstrumentClass = async () => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getInstrumentClass) 

            .then((returnData) => {  
                //console.log("getFaultModeList",returnData) 
                if (returnData !== undefined && returnData.neo_skeleton_instrument_class.length > 0) {  
                    setData(returnData.neo_skeleton_instrument_class) 
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
                console.log("NEW MODEL", "ERR", e, "Instrument Class", new Date()) 
            }); 

    }; 
    return { InstrumentClassLoading, InstrumentClassData, InstrumentClassError, getInstrumentClass }; 
}; 

export default useInstrumentClass; 