import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAllCNCAsset = () => {
    const [CNCAssetListLoading, setLoading] = useState(false); 
    const [CNCAssetListError, setError] = useState(null); 
    const [CNCAssetListData, setData] = useState(null); 

    const getCNCAssetList = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getCNCAssetList,{ line_id: lineID })
        
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
                console.log("NEW MODEL", "ERR", e, "get CNC Asset List - Settings", new Date())
            });

    };
    return {  CNCAssetListLoading, CNCAssetListData, CNCAssetListError, getCNCAssetList };
};

export default useGetAllCNCAsset;