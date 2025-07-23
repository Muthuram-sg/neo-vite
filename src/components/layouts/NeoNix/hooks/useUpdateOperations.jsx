import { useState } from 'react';
import configParam from 'config';

const useUpdateOperations = () => {
  const [editOpertaionsLoading, setLoading] = useState(false);
  const [editOpertaionsData, setData] = useState(null);
  const [editOpertaionsError, setError] = useState(null);

  const getUpdateOperations = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/OperationMaster/EditOperationMaster",
        formData,
        "",
        "",
        "POST",
         false,
      );

      if (result !== undefined) {
        console.clear()
        console.log('updateOperationsData', result);
        setData(result);
        setError(false);
      } else {
         console.log('updateOperationsData', result);
        setData(null);
        setError(true);
      }
    } catch (err) {
       console.log('updateOperationsData', err);
      setData(null);
      setError(err);
      console.error('updateOperationsError', err);
    } finally {
      setLoading(false);
    }
  };

  return { editOpertaionsLoading, editOpertaionsData, editOpertaionsError, getUpdateOperations };
};
export default useUpdateOperations;