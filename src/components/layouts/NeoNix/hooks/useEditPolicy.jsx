import { useState } from 'react';
import configParam from 'config';

const useEditPolicy = () => {
  const [editPolicyLoading, setLoading] = useState(false);
  const [editPolicyData, setData] = useState(null);
  const [editPolicyError, setError] = useState(null);

  const getEditPolicy = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/Policy/EditPolicyMaster",
        formData,
        "",
        "",
        "PUT",
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
      console.error('updatePolicyError', err);
    } finally {
      setLoading(false);
    }
  };

  return { editPolicyLoading, editPolicyData, editPolicyError, getEditPolicy };
};
export default useEditPolicy;