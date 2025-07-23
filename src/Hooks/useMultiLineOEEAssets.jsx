import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useMultiLineOEEAssets = () => {
    const [MultiLineOEEAssetsListLoading, setLoading] = useState(false);
    const [MultiLineOEEAssetsListData, setData] = useState(null);
    const [MultiLineOEEAssetsListError, setError] = useState(null); 
    const getMultiLineOEEAssetsList = async (child_lines) => {
        if(child_lines && child_lines.length>0){
            Promise.all(            
                child_lines.map( async x=>{                    
                    await configParam.RUN_GQL_API(Queries.GetMultiLineOEEAssets, {line_id: x.line_id},x.token)
                    .then((returnData) => { 
                        if (returnData !== undefined) { 
                            let response = [];
                            if(returnData.neo_skeleton_prod_asset_oee_config.length > 0){
                                 response = returnData.neo_skeleton_prod_asset_oee_config.map(y=>{
                                    return {
                                        token: x.token,
                                        line_id: x.line_id,
                                        data: y
                                    }                            
                                })
                            }else{
                                return { line_id: x.line_id,data: null}
                            }
                            return response;
                        }
                    });                            
                })        
            )
            .then((data) => {
                    const result = data.flat();
                    if(result.length>0){ 
                        setLoading(false);
                        setError(false);
                        setData(result);
                    }else{                    
                        setLoading(false);
                        setError(true);
                        setData(null);
                    }
            })  
            .catch((e) => {
                setLoading(false);
                setError(true);
                setData(null);
            });
        }else{
            setLoading(false);
            setData(null);
            setError(true);
        }
    };
    return { MultiLineOEEAssetsListLoading, MultiLineOEEAssetsListData, MultiLineOEEAssetsListError, getMultiLineOEEAssetsList };
};

export default useMultiLineOEEAssets;