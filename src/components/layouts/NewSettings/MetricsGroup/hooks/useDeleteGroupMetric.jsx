import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useDeleteGroupMetric = () => {
    const [DeleteGroupMetricLoading, setLoading] = useState(false); 
    const [DeleteGroupMetricError, setError] = useState(null); 
    const [DeleteGroupMetricData, setData] = useState(null); 

    const getDeleteGroupMetric = async (id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutations.deleteMetricsGroup,{ id: id})
        
            .then((returnData) => {
            
                if (returnData.delete_neo_skeleton_metrics_group) {
                    setData(returnData.delete_neo_skeleton_metrics_group.returning[0].grpname)
                    setError(false)
                    setLoading(false)
                }
                else{
                setData(null)
                setError(true)
                setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "Entity Setting", new Date())
            });

    };
    return {  DeleteGroupMetricLoading, DeleteGroupMetricData, DeleteGroupMetricError, getDeleteGroupMetric };
};

export default useDeleteGroupMetric;