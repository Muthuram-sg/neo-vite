/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetPlantAsset = () => {
    const [plantAssetLoading, setLoading] = useState(false);
    const [plantAssetData, setData] = useState(null);
    const [plantAssetError, setError] = useState(null);

    const getPlantAssets = async (line_id) => {
        setLoading(true);
        if(line_id !== null && line_id !== undefined && line_id !== "") {
        await configParam.RUN_GQL_API(gqlQueries.getPlantAssets, {line_id: line_id})
            .then((returnData) => {
                // console.clear()
                // console.log(returnData, "returnData.neo_skeleton_line_logo");
                if (Array.isArray(returnData.neo_skeleton_line_logo) && returnData.neo_skeleton_line_logo.length > 0) {
                    setData(returnData?.neo_skeleton_line_logo?.[0])
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "GateWay Setting", new Date())
                setData([]);
                setLoading(false);
                setError(e);
            });
        }
        else {
            setData([]);
            setLoading(false);
            setError(false)
        }

    };
    return { plantAssetLoading, plantAssetData, plantAssetError, getPlantAssets };
};

export default useGetPlantAsset;
