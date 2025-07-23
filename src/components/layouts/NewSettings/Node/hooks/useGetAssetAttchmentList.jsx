import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetAssetDocsList = () => {
    const [GetAssetDocsListLoading, setLoading] = useState(false); 
    const [GetAssetDocsListError, setError] = useState(null); 
    const [GetAssetDocsListData, setData] = useState(null); 

    const getGetAssetDocsList = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getAttachmentList,body)
            .then((returnData) => {
                console.log(returnData,'returnData')
                if (returnData !== undefined && returnData.neo_skeleton_asset_attachment ) {
                    setData(returnData.neo_skeleton_asset_attachment)
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
    return {  GetAssetDocsListLoading, GetAssetDocsListData, GetAssetDocsListError, getGetAssetDocsList };
};

export default useGetAssetDocsList;