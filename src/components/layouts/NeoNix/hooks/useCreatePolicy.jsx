import { useState } from 'react';
import configParam from 'config';

const useCreatePolicy = () => {
  const [createPolicyLoading, setLoading] = useState(false);
  const [createPolicyData, setData] = useState(null);
  const [createPolicyError, setError] = useState(null);

  const getCreatePolicy = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/Policy/CreatePolicyMaster",
        formData,
        "",
        "",
        "POST",
         true,
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
      console.error('createPolicyError', err);
    } finally {
      setLoading(false);
    }
  };

  return { createPolicyLoading, createPolicyData, createPolicyError, getCreatePolicy };
};
export default useCreatePolicy;