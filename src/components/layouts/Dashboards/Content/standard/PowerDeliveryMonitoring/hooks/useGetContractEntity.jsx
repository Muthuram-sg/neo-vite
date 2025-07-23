import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetContractEntity = () => {
    const [EntityListLoading, setLoading] = useState(false); 
    const [EntityListError, setError] = useState(null); 
    const [EntityListData, setData] = useState(null); 

    const getEntityList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getContractEntity,{ line_id: lineID })
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_entity && returnData.neo_skeleton_entity.length > 0) { 
                    
                    setData(returnData.neo_skeleton_entity)
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
    return {  EntityListLoading, EntityListData, EntityListError, getEntityList };
};

export default useGetContractEntity;