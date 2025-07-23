import { useState } from "react";
import configParam from "config";
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc  } from "recoilStore/atoms";

const useCreateAssets = () => {
    const [createAssetsLoading, setLoading] = useState(false);
    const [createAssetsData, setData] = useState(null);
    const [createAssetsError, setError] = useState(null);

    const [, setOpenSnack] = useRecoilState(snackToggle);
            const [, SetMessage] = useRecoilState(snackMessage);
            const [, SetType] = useRecoilState(snackType);
            const [, SetDesc] = useRecoilState(snackDesc);

    const createAssets = async (assetDetails) => {
        setLoading(true);
        try {
            let url = `/neonix-api/api/AssetMaster/CreateAssetMaster`;
            const result = await configParam.RUN_REST_API(url, assetDetails,'','',"POST")
            if (result === 'Created Successfully ') {
                    console.log(result )
                    setData(result);
                    setError(false);
                    setOpenSnack(true)
                    SetMessage("New Asset Created")
                    SetType("success")
                    SetDesc("Asset has been successfully created")
                } else {
                    setData(null);
                    setError(result);
                }
                setLoading(false);
        }
        catch (e) {
            console.log("NEW MODEL", "API FAILURE", e, "Creating Assets", new Date());
            setLoading(false);
            setError(e);
            setData(null);
            return;
        }
            // .then((response) => {
            //     if (response) {
            //         console.log(response )
            //         setData(response);
            //         setError(false);
            //     } else {
            //         setData(null);
            //         setError(response);
            //     }
            //     setLoading(false);
            // })
            // .catch((e) => {
            //     console.log("NEW MODEL", "API FAILURE", e, "Creating Assets", new Date());
            //     setLoading(false);
            //     setError(e);
            //     setData(null);
            // });
    };

    return { createAssetsLoading, createAssetsData, createAssetsError, createAssets };
};

export default useCreateAssets;
