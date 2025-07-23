// NOSONAR  -  working fine
import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

// NOSONAR start - Need the below state 
const useDeleteAssets = () => { //NOSONAR
    const [deleteAssetLoading, setLoading] = useState(false); //NOSONAR
    const [deleteAssetError, setError] = useState(null); //NOSONAR
    const [deleteAssetData, setData] = useState(null); //NOSONAR
// NOSONAR End - Need the above state 

    const deleteAsset = async (assetId) => {
        setLoading(true);
        try {
          const result = await configParam.RUN_REST_API(
            `/neonix-api/api/AssetMaster/RemoveAssetMaster`, 
           {'id': assetId},
            "",
            "",
            "DELETE",
            false
          );

          if (result !== undefined) {
            setData(result);
            setError(false);
          } else {
            setData(null);
            setError(true);
          }
        } catch (err) {
          setData(null);
          setError(err);
          console.error('deleteCustomerError', err);
        } finally {
          setLoading(false);
        }
    };

    return { deleteAssetLoading, deleteAssetData, deleteAssetError, deleteAsset };
};

export default useDeleteAssets;
