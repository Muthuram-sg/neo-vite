import { useState } from "react"; 
import configParam from "config"; 
import gqlQueries from "components/layouts/Queries" 
 

const useGetEntityInstrumentsList = () => { 
    const [EntityInstrumentsListLoading, setLoading] = useState(false); 
    const [EntityInstrumentsListData, setData] = useState(null); 
    const [EntityInstrumentsListError, setError] = useState(null); 

    const getEntityInstrumentsList = async (line_id) => { 
        setLoading(true); 
        await configParam.RUN_GQL_API(gqlQueries.getEntityInstrumentsList, { line_id: line_id }) 
            .then((returnData) => {  
                if (returnData !== undefined && returnData.neo_skeleton_entity_instruments && returnData.neo_skeleton_entity_instruments.length > 0) { 
                    setData(returnData.neo_skeleton_entity_instruments) 
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
    return { EntityInstrumentsListLoading, EntityInstrumentsListData, EntityInstrumentsListError, getEntityInstrumentsList }; 
}; 

 

export default useGetEntityInstrumentsList; 