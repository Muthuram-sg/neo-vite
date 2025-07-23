import { useState } from "react";
import configParam from "config";  
import mutations from "components/layouts/Mutations";
const useAddGroupMetric= () => {
    const [ CreateMetricsGroupLoading , setLoading] = useState(false);
    const [ CreateMetricsGroupData, setData] = useState(null);
    const [ CreateMetricsGroupError , setError] = useState(null);

    const getCreateMetricsGroup = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutations.createMetricsGroup,body) 
          .then((returnData) => {

          
            if ( returnData !== undefined && returnData.insert_neo_skeleton_metrics_group.affected_rows > 0) {
                setData(returnData.insert_neo_skeleton_metrics_group.returning[0].grpname)
                setError(false)
                setLoading(false)
            } else{
                setData(null)
                setError(false)
                setLoading(false)
            }
          })
          .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
        });
        
    };
    return { CreateMetricsGroupLoading,  CreateMetricsGroupData , CreateMetricsGroupError,getCreateMetricsGroup };
};

export default  useAddGroupMetric;