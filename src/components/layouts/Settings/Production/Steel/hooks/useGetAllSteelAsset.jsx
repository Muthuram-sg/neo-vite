import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAllSteelAsset = () => {
    const [SteelAssetListLoading, setLoading] = useState(false); 
    const [SteelAssetListError, setError] = useState(null); 
    const [SteelAssetListData, setData] = useState(null); 

    const getSteelAssetList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getSteelAssetList,{ line_id: lineID })
        
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
                console.log("NEW MODEL", "ERR", e, "get Steel Asset List - Settings", new Date())
            });

    };
    return {  SteelAssetListLoading, SteelAssetListData, SteelAssetListError, getSteelAssetList };
};

export default useGetAllSteelAsset;