import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useUpdateProdOperator = () => {
    const [UpdateProdOperatorLoading, setLoading] = useState(false);
    const [UpdateProdOperatorData, setData] = useState(null);
    const [UpdateProdOperatorError, setError] = useState(null);

    const getUpdateProdOperator = async (body) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.UpdateProdOperator,body)
            .then((response) => { 
                if (response !== undefined && response.update_neo_skeleton_prod_operator && response.update_neo_skeleton_prod_operator.returning.length > 0) {
                    setData(response.update_neo_skeleton_prod_operator.returning);
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

    return { UpdateProdOperatorLoading, UpdateProdOperatorData, UpdateProdOperatorError, getUpdateProdOperator };
}


export default useUpdateProdOperator;