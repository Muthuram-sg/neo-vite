import { useState } from "react";
import configParam from "config"; 

const useGetWorkOrderAndExecution= () => {
  const [WorkOrderAndExecutionLoading, setLoading] = useState(false);
  const [WorkOrderAndExecutionData, setData] = useState(null);
  const [WorkOrderAndExecutionError, setError] = useState(null);

  const getWorkOrderAndExecution = async (body) => {
    setLoading(true);
    const url = "/dashboards/creatWorkOrder";
    await configParam.RUN_REST_API(url, body,"","","POST")
      .then((response) => {
        console.log(response,"response")
        if (response) {
          setData(response.data);
          setError(false); 
        } else {
          setData(response);
          setError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
        setData(null);
      });
  }; 
  return { WorkOrderAndExecutionLoading, WorkOrderAndExecutionData, WorkOrderAndExecutionError, getWorkOrderAndExecution };
};

export default useGetWorkOrderAndExecution;