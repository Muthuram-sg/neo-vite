import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries" 
 

const useGetInstrumentType = () => { 
    const [InstrumentTypeLoading, setLoading] = useState(false); 
    const [InstrumentTypeData, setData] = useState(null); 
    const [InstrumentTypeError, setError] = useState(null); 

    const getInstrumentType = async (line_id) => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getIntrumentType, { line_id: line_id }) 
            .then((returnData) => { 
                 console.log("getInstrumentType", returnData) 
                if (returnData !== undefined && returnData.neo_skeleton_instruments && returnData.neo_skeleton_instruments.length > 0) { 
                    setData(returnData.neo_skeleton_instruments) 
                    setError(false) 
                    setLoading(false) 
                } else { 
                    setData(null) 
                    setError(false) 
                    setLoading(false) 
                } 
            }) 
            .catch((e) => { 
                setLoading(false); 
                setError(e); 
                setData(null); 
                console.log("NEW MODEL", "ERR", e, "GetEntityInstrumentsList", new Date()) 
            }); 

    }; 
    return { InstrumentTypeLoading, InstrumentTypeData, InstrumentTypeError, getInstrumentType }; 
}; 

 

export default useGetInstrumentType; 