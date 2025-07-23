import { useState } from 'react';
import configParam from 'config';

const useDeletePolicy = () => {
  const [deletePolicyLoading, setLoading] = useState(false);
  const [deletePolicyData, setData] = useState(null);
  const [deletePolicyError, setError] = useState(null);

  const getDeletePolicy = async (id) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        '/neonix-api/api/Policy/RemovePolicyMaster', 
       {id},
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
      console.error('deletePolicyError', err);
    } finally {
      setLoading(false);
    }
  };

  return { deletePolicyLoading, deletePolicyData, deletePolicyError, getDeletePolicy };
};
export default useDeletePolicy;