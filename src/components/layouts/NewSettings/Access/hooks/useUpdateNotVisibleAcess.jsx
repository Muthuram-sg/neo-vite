import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateNotVisibleAccess = () => {
    const [UpdateAccessNotVisibleLoading, setLoading] = useState(false);
    const [UpdateAccessNotVisibleData, setData] = useState(null);
    const [UpdateAccessNotVisibleError, setError] = useState(null);

    const UpdatedModuleAndSubModuleNotVisibility = async (  line_id,notVisible_Module_ids,notVisible_sub_module_ids ) => {
     console.log(notVisible_sub_module_ids,"notVisible_Module_ids",notVisible_Module_ids)
        setLoading(true);
            configParam.RUN_GQL_API(mutations.UpdatedModuleAndSubModuleNotVisibility,{ line_id:line_id ,module_ids:notVisible_Module_ids,sub_module_ids:notVisible_sub_module_ids})
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
     UpdateAccessNotVisibleLoading,
        UpdateAccessNotVisibleData,
        UpdateAccessNotVisibleError,
        UpdatedModuleAndSubModuleNotVisibility,
    };
    }

export default useUpdateNotVisibleAccess;
