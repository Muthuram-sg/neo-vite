import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useInsertProductForm= () => {
    const [InsertProdctFormLoading, setLoading] = useState(false);
    const [InsertProductFormData, setData] = useState(null);
    const [InsertProductFormError, setError] = useState(null);

    const getInsertProductForm = async (body) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.OfflineProductInsert,body)
            .then((response) => {
                if (response !== undefined && response.insert_neo_skeleton_production_form && response.insert_neo_skeleton_production_form.affected_rows > 0) {
                    setData(response.insert_neo_skeleton_production_form.affected_rows);
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

    return { InsertProdctFormLoading, InsertProductFormData, InsertProductFormError, getInsertProductForm };
}


export default useInsertProductForm;