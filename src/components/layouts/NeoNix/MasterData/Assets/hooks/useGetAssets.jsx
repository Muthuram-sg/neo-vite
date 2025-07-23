// NOSONAR  -  working fine
import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";
// NOSONAR start - Need the below state 
const useGetAssets = () => { //NOSONAR
    const [getAssetsLoading, setLoading] = useState(false); //NOSONAR
    const [getAssetsError, setError] = useState(null); //NOSONAR
    const [getAssetsData, setData] = useState(null); //NOSONAR
// NOSONAR End - Need the above state 
    const fetchAssets = async (filterParams) => {
        setLoading(true);
        const url = `/neonix-api/api/AssetMaster/GetAllAssetMaster`;
        await configParam.RUN_REST_API(url, "",'','',"GET")
            .then((returnData) => {
                if (returnData.response) {
                    setData(returnData.response);
                    setError(false);
                    setLoading(false);
                } else {
                    setData(null);
                    setError(true);
                    setLoading(false);
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Fetching Assets", new Date());
            });
    };
    return { getAssetsLoading, getAssetsData, getAssetsError, fetchAssets };
};

export default useGetAssets;
