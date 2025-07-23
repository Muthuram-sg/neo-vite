import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAssetList = () => {
    const [GetAssetListLoading, setLoading] = useState(false); 
    const [GetAssetListError, setError] = useState(null); 
    const [GetAssetListData, setData] = useState(null); 

    const getGetAssetList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAssetListForLine,{ line_id: line_id })
        
            .then((returnData) => {
                // console.log(returnData,'returnData')
                if (returnData !== undefined && returnData.neo_skeleton_entity ) {
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
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  GetAssetListLoading, GetAssetListData, GetAssetListError, getGetAssetList };
};

export default useGetAssetList;