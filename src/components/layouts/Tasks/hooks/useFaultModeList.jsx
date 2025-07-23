import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useFaultModeList = () => { 
    const [FaultModeListLoading, setLoading] = useState(false);  
    const [FaultModeListData, setData] = useState(null);  
    const [FaultModeListError, setError] = useState(null);  

    const getFaultModeList = async () => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getFaultModeList,{}) 

            .then((returnData) => {  
                if (returnData !== undefined && returnData.neo_skeleton_fault_mode && returnData.neo_skeleton_fault_mode.length > 0) {  

                    setData(returnData.neo_skeleton_fault_mode) 
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
                console.log("NEW MODEL", "ERR", e, "Fault Mode List", new Date()) 
            }); 

    }; 
    return { FaultModeListLoading, FaultModeListData, FaultModeListError, getFaultModeList }; 
}; 

export default useFaultModeList; 