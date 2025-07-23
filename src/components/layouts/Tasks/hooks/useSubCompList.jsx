import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useSubCompList = () => { 
    const [SubComponentListLoading, setLoading] = useState(false);  
    const [SubComponentListData, setData] = useState(null);  
    const [SubComponentListError, setError] = useState(null);  

    const getSubCompList = async () => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getSubComponentListMaster,{}) 

            .then((returnData) => {   
                if (returnData !== undefined && returnData.neo_skeleton_task_sub_component_master && returnData.neo_skeleton_task_sub_component_master.length > 0) {  

                    setData(returnData.neo_skeleton_task_sub_component_master) 
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
                console.log("NEW MODEL", "ERR", e, "Sub Component List", new Date()) 
            }); 

    }; 
    return { SubComponentListLoading, SubComponentListData, SubComponentListError, getSubCompList }; 
}; 

export default useSubCompList; 