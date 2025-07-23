import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetEntityAssetByCategory = () => {
    const [entityAssetByCategoryLoading, setLoading] = useState(false); 
    const [entityAssetByCategoryError, setError] = useState(null); 
    const [entityAssetByCategoryData, setData] = useState(null); 

    const getEntityAssetByCategory = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getEntityAssetByCategory,{ line_id: lineID, categoryID: 3})
        
            .then((returnData) => { 
                if (returnData !== undefined && returnData.neo_skeleton_entity && returnData.neo_skeleton_entity.length > 0) { 
                    
                    setData(returnData.neo_skeleton_entity)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData([])
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "CMS Dashboard", new Date())
            });

    };
    return {  entityAssetByCategoryLoading, entityAssetByCategoryData, entityAssetByCategoryError, getEntityAssetByCategory };
};

export default useGetEntityAssetByCategory;