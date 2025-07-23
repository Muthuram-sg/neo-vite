import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useFaultClassification = () => { 
    const [FaultClassificationLoading, setLoading] = useState(false);  
    const [FaultClassificationData, setData] = useState(null);  
    const [FaultClassificationError, setError] = useState(null);  

    const getFaultClassification = async () => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getFaultClassificationList,{}) 

            .then((returnData) => {  
               
                if (returnData !== undefined && returnData.neo_skeleton_fault_classification && returnData.neo_skeleton_fault_classification.length > 0) {  

                    setData(returnData.neo_skeleton_fault_classification) 
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
    return { FaultClassificationLoading, FaultClassificationData, FaultClassificationError, getFaultClassification }; 
}; 

export default useFaultClassification; 