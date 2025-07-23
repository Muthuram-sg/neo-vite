import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteProductExecReport = () => {
    const [DeleteProductExecLoading, setLoading] = useState(false);
    const [DeleteProductExecData, setData] = useState(null);
    const [DeleteProductExecError, setError] = useState(null);

    const getDeleteProductExecData = async (id) => {
     console.log("checkId",id)
        setLoading(true);
        configParam.RUN_GQL_API(mutations.DeleteProductExec,{id:id})
            .then((response) => {
                if (response !== undefined && response.delete_neo_skeleton_prod_exec && response.delete_neo_skeleton_prod_exec.affected_rows > 0) {
                    setData(response.delete_neo_skeleton_prod_exec.affected_rows);
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }

            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { DeleteProductExecLoading, DeleteProductExecData, DeleteProductExecError, getDeleteProductExecData };
}


export default useDeleteProductExecReport;