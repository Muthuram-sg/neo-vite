/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetModuleAccessList = () => {
    const [ModuleAccessLoading, setLoading] = useState(false);
    const [ModuleAccessData, setData] = useState(null);
    const [ModuleAccessError, setError] = useState(null);

    const getModuleAccess = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getModelAccessList, {line_id: line_id})
            .then((returnData) => {
                if (returnData.neo_skeleton_module_access) {
                    setData(returnData.neo_skeleton_module_access)
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
    return { ModuleAccessLoading, ModuleAccessData, ModuleAccessError, getModuleAccess };
};

export default useGetModuleAccessList;
