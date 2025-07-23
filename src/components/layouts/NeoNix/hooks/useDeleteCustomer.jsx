import { useState } from 'react';
import configParam from 'config';

const useDeleteCustomer = () => {
  const [deleteCustomerLoading, setLoading] = useState(false);
  const [deleteCustomerData, setData] = useState(null);
  const [deleteCustomerError, setError] = useState(null);

  const getDeleteCustomer = async (id, custcode) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        '/neonix-api/api/CustomerMaster/RemoveCustomerMaster', 
       {id, custcode},
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
      console.error('deleteCustomerError', err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteCustomerLoading, deleteCustomerData, deleteCustomerError, getDeleteCustomer };
};
export default useDeleteCustomer;