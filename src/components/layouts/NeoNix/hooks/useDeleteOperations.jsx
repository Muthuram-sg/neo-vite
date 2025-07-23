import { useState } from 'react';
import configParam from 'config';

const useDeleteOperations = () => {
  const [deleteOperationsLoading, setLoading] = useState(false);
  const [deleteOperationsData, setData] = useState(null);
  const [deleteOperationsError, setError] = useState(null);

  const getDeleteOperations = async (id) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/OperationMaster/RemoveOperationMaster", 
       {'id': id},
        "",
        "",
        "DELETE",
        false
      );

      if (result !== undefined) {
        setData(result);
        setError(false);
      } else {
        setData(null);
        setError(true);
      }
    } catch (err) {
      setData(null);
      setError(err);
      console.error('deleteOperationsError', err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteOperationsLoading, deleteOperationsData, deleteOperationsError, getDeleteOperations };
};
export default useDeleteOperations;