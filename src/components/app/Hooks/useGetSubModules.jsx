/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetModuleAccessList = () => {
    const [SubModuleAccessLoading, setLoading] = useState(false);
    const [SubModuleAccessData, setData] = useState(null);
    const [SubModuleAccessError, setError] = useState(null);

    const getSubModuleAccess = async (line_id) => {
    //  console.log("line_id",line_id)
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSubModelAccessList, {line_id: line_id})
            .then((returnData) => {
            //  console.log("returnDatareturnData",returnData)
                if (returnData.neo_skeleton_sub_module_access) {
                    setData(returnData.neo_skeleton_sub_module_access)
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
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { SubModuleAccessLoading, SubModuleAccessData, SubModuleAccessError, getSubModuleAccess };
};

export default useGetModuleAccessList;
