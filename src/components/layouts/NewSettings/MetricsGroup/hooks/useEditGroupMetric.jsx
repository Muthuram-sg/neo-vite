import { useState } from "react";
import configParam from "config";  
import mutations from "components/layouts/Mutations";
const useEditGroupMetric= () => {
    const [ UpdateMetricsGroupLoading , setLoading] = useState(false);
    const [ UpdateMetricsGroupData, setData] = useState(null);
    const [ UpdateMetricsGroupError , setError] = useState(null);

    const getUpdateMetricsGroup = async (body) => {
        setLoading(true);
        await configParam.RUN_GQL_API(mutations.updateMetricsGroup,body) 
          .then((returnData) => {

          
            if ( returnData !== undefined && returnData.update_neo_skeleton_metrics_group.affected_rows > 0) {
                setData(returnData.update_neo_skeleton_metrics_group.returning[0].grpname)
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
    return { UpdateMetricsGroupLoading,  UpdateMetricsGroupData , UpdateMetricsGroupError,getUpdateMetricsGroup };
};

export default  useEditGroupMetric;