import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteProductReport = () => {
    const [DeleteProductDataLoading, setLoading] = useState(false);
    const [DeleteProductDataData, setData] = useState(null);
    const [DeleteProductDataError, setError] = useState(null);

    const getDeleteProductData = async (id) => {
        setLoading(true);
        configParam.RUN_GQL_API(mutations.OfflineProductDelete,{id:id})
            .then((response) => {
                if (response !== undefined && response.delete_neo_skeleton_production_form && response.delete_neo_skeleton_production_form.affected_rows > 0) {
                    setData(response.delete_neo_skeleton_production_form.affected_rows);
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

    return { DeleteProductDataLoading, DeleteProductDataData, DeleteProductDataError, getDeleteProductData };
}


export default useDeleteProductReport;