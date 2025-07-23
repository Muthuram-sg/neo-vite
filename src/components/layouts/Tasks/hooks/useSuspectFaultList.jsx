import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useSuspectFaultList = () => { 
    const [SuspectFaultListLoading, setLoading] = useState(false);  
    const [SuspectFaultListData, setData] = useState(null);  
    const [SuspectFaultListError, setError] = useState(null);  

    const getSuspectFaultList = async () => { 
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
                console.log("NEW MODEL", "ERR", e, "Suspected Fault List", new Date()) 
            }); 

    }; 
    return { SuspectFaultListLoading, SuspectFaultListData, SuspectFaultListError, getSuspectFaultList }; 
}; 

export default useSuspectFaultList; 