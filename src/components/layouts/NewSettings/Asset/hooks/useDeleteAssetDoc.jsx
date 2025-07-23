import { useState } from "react";
import configParam from "config"; 

const useDeleteAssetDoc = () => {
    const [DeleteAssetDocLoading, setLoading] = useState(false);
    const [DeleteAssetDocData, setData] = useState(null);
    const [DeleteAssetDocError, setError] = useState(null);

    const getDeleteAssetDoc = async (body) => {
        setLoading(true);
        await configParam.RUN_REST_API('/settings/deleteAssetImageUpload', body)
            .then((res) => {
                if (res !== undefined && res.data) {
                    setData(res)
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
    return { DeleteAssetDocLoading, DeleteAssetDocData, DeleteAssetDocError, getDeleteAssetDoc };
};

export default useDeleteAssetDoc;