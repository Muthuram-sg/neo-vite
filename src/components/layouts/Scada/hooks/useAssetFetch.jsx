import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useAssetsFetch = () => {
    const [AssetsFetchLoading, setLoading] = useState(false); 
    const [AssetsFetchError, setError] = useState(null); 
    const [AssetsFetchData, setData] = useState(null); 

    const getAssetsFetch = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.GetAssetListFetch,{"entity_type": 3 ,"line_id": lineID})
        
            .then((returnData) => {  
                if (returnData !== undefined && returnData) { 
                  // console.log(returnData);
                    if(returnData.neo_skeleton_entity){
                        setData(returnData.neo_skeleton_entity)
                        setError(false)
                        setLoading(false)
                        
                    }
                    
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
    return {  AssetsFetchLoading, AssetsFetchError, AssetsFetchData, getAssetsFetch};
};

export default useAssetsFetch;