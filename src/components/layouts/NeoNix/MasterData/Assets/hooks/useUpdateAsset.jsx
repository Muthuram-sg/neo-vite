// NOSONAR  -  working fine
import { useState } from "react";
import configParam from "config";
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc  } from "recoilStore/atoms";
// NOSONAR start - Need the below state 
const useUpdateAsset = () => { //NOSONAR
    const [updateAssetLoading, setLoading] = useState(false); //NOSONAR
    const [updateAssetError, setError] = useState(null); //NOSONAR
    const [updateAssetData, setData] = useState(null); //NOSONAR

    const [, setOpenSnack] = useRecoilState(snackToggle);
            const [, SetMessage] = useRecoilState(snackMessage);
            const [, SetType] = useRecoilState(snackType);
            const [, SetDesc] = useRecoilState(snackDesc);

    const updateAsset = async (assetDetails) => {
        setLoading(true);
        try {
                    let url = `/neonix-api/api/AssetMaster/EditAssetMaster`;
                    const result = await configParam.RUN_REST_API(url, assetDetails,'','',"POST")
                    if (result === 'Updated Successfully ') {
                            console.log(result )
                            setOpenSnack(true)
                            SetMessage("Asset Updated")
                            SetType("success")
                            SetDesc("Asset has been successfully updated")
                            setData(result);
                            setError(false);
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
        // let url = `/neonix-api/api/AssetMaster/EditAssetMaster`;
        // await configParam.RUN_REST_API(url, assetDetails,'','',"POST")
        //     .then((returnData) => {
        //         // console.clear();
                
        //         if (returnData) {
        //             console.log(returnData);
        //             setData(returnData);
        //             setError(false);
        //             setLoading(false);
        //         } else {
        //             setData(null);
        //             setError(true);
        //             setLoading(false);
        //         }
        //     })
        //     .catch((e) => {
        //         setLoading(false);
        //         setError(e);
        //         setData(null);
        //         console.log("NEW MODEL", "ERR", e, "Updating Asset", new Date());
        //     });
    };
    return { updateAssetLoading, updateAssetData, updateAssetError, updateAsset };
};

export default useUpdateAsset;
