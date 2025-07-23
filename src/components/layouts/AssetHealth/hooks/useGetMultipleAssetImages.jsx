import { useState } from "react";
import configParam from "config"; 

const useGetMultipleAssetImages = () => {
    const [ViewAssetDocLoading, setLoading] = useState(false);
    const [ViewAssetDocData, setData] = useState(null);
    const [ViewAssetDocError, setError] = useState(null);

    const getViewAssetDoc = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/settings/viewMultipleAssetFiles', body)
            .then((res) => {
                console.log(res,"res")
                if (res !== undefined) {
                    setData(res.data)
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
                console.log("NEW MODEL", e, "Asset OEE config in Analytics", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { ViewAssetDocLoading, ViewAssetDocData, ViewAssetDocError, getViewAssetDoc };
};

export default useGetMultipleAssetImages;