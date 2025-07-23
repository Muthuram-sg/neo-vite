import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries"; 

const useMainComponentList = () => { 
    const [MainComponentListLoading, setLoading] = useState(false);  
    const [MainComponentListData, setData] = useState(null);  
    const [MainComponentListError, setError] = useState(null);  

    const getMainComponentList = async () => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getMainComponentMaster,{}) 

            .then((returnData) => {   
                if (returnData !== undefined && returnData.neo_skeleton_task_main_component_master && returnData.neo_skeleton_task_main_component_master.length > 0) {  

                    setData(returnData.neo_skeleton_task_main_component_master) 
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
                console.log("NEW MODEL", "ERR", e, "Main Component List", new Date()) 
            }); 

    }; 
    return { MainComponentListLoading, MainComponentListData, MainComponentListError, getMainComponentList }; 
}; 

export default useMainComponentList; 