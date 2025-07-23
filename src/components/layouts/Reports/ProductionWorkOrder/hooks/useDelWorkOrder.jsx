import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDelWorkOrder = () => {
    const [deleteReportLoading, setLoading] = useState(false);
    const [deleteReportData, setData] = useState(null);
    const [deleteReportError, setError] = useState(null);

    const getDeleteReport = async ( id ) => {
      

        configParam.RUN_GQL_API(mutations.deleteWorkInitiations,{ id })
            .then((returnData) => {
                
                    console.log("del",returnData.delete_neo_skeleton_prod_exec.affected_rows);
                    setData(returnData.delete_neo_skeleton_prod_exec.affected_rows)
                    setError(false)
                    setLoading(false)
                
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { deleteReportLoading, deleteReportData, deleteReportError, getDeleteReport };
}


export default useDelWorkOrder;