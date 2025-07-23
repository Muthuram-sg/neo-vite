import { useState } from 'react';
import configParam from 'config';

const useEditCustomer = () => {
  const [editCustomerLoading, setLoading] = useState(false);
  const [editCustomerData, setData] = useState(null);
  const [editCustomerError, setError] = useState(null);

  const getEditCustomer = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/CustomerMaster/EditCustomerMaster",
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
      console.error('updateCustomerError', err);
    } finally {
      setLoading(false);
    }
  };

  return { editCustomerLoading, editCustomerData, editCustomerError, getEditCustomer };
};
export default useEditCustomer;