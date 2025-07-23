import { useState } from 'react';
import configParam from 'config';

const useCreateCustomer = () => {
  const [createCustomerLoading, setLoading] = useState(false);
  const [createCustomerData, setData] = useState(null);
  const [createCustomerError, setError] = useState(null);

  const getCreateCustomer = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/CustomerMaster/NewCustomerMaster",
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
      console.error('createCustomerError', err);
    } finally {
      setLoading(false);
    }
  };

  return { createCustomerLoading, createCustomerData, createCustomerError, getCreateCustomer };
};
export default useCreateCustomer;