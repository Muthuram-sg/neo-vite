import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useInsertProdOperator = () => {
    const [InsertProdOperatorLoading, setLoading] = useState(false);
    const [InsertProdOperatorData, setData] = useState(null);
    const [InsertProdOperatorError, setError] = useState(null);

    const getInsertProdOperator = async (body) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.addProdOperator,body)
            .then((response) => {
                console.log(response)
                if (response !== undefined && response.insert_neo_skeleton_prod_operator && response.insert_neo_skeleton_prod_operator.returning.length > 0) {
                    setData(response.insert_neo_skeleton_prod_operator.returning);
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

    return { InsertProdOperatorLoading, InsertProdOperatorData, InsertProdOperatorError, getInsertProdOperator };
}


export default useInsertProdOperator;