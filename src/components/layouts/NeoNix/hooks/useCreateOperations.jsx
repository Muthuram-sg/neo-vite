import { useState } from 'react';
import configParam from 'config';

const useCreateOperations = () => {
  const [createOperationsLoading, setLoading] = useState(false);
  const [createOperationsData, setData] = useState(null);
  const [createOperationsError, setError] = useState(null);

  const getCreateOperations = async (formData) => {
    setLoading(true);
    
    try {
          // let body ={schema:schema ,instrumentid : instruments , metricid:keys , from : from , to : to , datacount,f90:f90,maxalert:maxalert}
            console.log(formData,"bodformDatay")
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/OperationMaster/CreateOperationMaster",
        formData,
        "",
        "",
        "POST",
         false,
      );
      console.log(result,"bodformDa333tay")
      if (result !== undefined) {
              console.log(result,"bodformDa333tay if")

        setData(result);
        setError(false);
      } else {
       console.log(result,"bodformDa333tay else")
        setData(null);
        setError(true);
      }
    } catch (err) {
      setData(null);
      setError(err);
      console.error('createOperationsError', err);
    } finally {
      setLoading(false);
    }
  };

  return { createOperationsLoading, createOperationsData, createOperationsError, getCreateOperations };
};
export default useCreateOperations;