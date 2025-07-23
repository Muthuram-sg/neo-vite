import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateAccess = () => {
    const [UpdateAccessLoading, setLoading] = useState(false);
    const [UpdateAccessData, setData] = useState(null);
    const [UpdateAccessError, setError] = useState(null);

    const updatedModuleAndSubModuleVisibility = async ( line_id, module_ids, sub_module_ids ) => {
        setLoading(true);
            configParam.RUN_GQL_API(mutations.UpdatedModuleAndSubModuleVisibility,{line_id:line_id ,module_ids:module_ids,sub_module_ids:sub_module_ids})
                .then((response) => { 
                    console.log("responseUpdate",response)
                    if (response && (response.update_neo_skeleton_module_access.affected_rows > 0 ||
                        response.update_neo_skeleton_sub_module_access.affected_rows > 0)) {
                        setData(response); 
                        setError(null);
                        setLoading(false) 
                    }
                    else {
                        setData(null)
                        setError(true)
                        setLoading(false)
                    }
    
                })
                .catch((e) => {
                    console.log("Sub MOdal Access", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                    setLoading(false);
                    setError(e);
                    setData(null);
                })
        }

    return {
        UpdateAccessLoading,
        UpdateAccessData,
        UpdateAccessError,
        updatedModuleAndSubModuleVisibility,
    };
    }

export default useUpdateAccess;
