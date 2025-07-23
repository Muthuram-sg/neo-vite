import { useState } from 'react';
import configParam from 'config';

const useDeleteQuotation = () => {
  const [deleteQuotationLoading, setLoading] = useState(false);
  const [deleteQuotationData, setData] = useState(null);
  const [deleteQuotationError, setError] = useState(null);

  const getDeleteQuotation = async (quo_id) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        '/neonix-api/api/QuotationMaster/RemoveQuotationMaster', 
       {quo_id},
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
      console.error('deleteQuotationError', err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteQuotationLoading, deleteQuotationData, deleteQuotationError, getDeleteQuotation };
};
export default useDeleteQuotation;