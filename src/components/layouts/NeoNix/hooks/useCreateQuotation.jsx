import { useState } from 'react';
import configParam from 'config';

const useCreateQuotation = () => {
  const [addQuotationLoading, setLoading] = useState(false);
  const [addQuotationData, setData] = useState(null);
  const [addQuotationError, setError] = useState(null);

  const getaddQuotation = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/QuotationMaster/CreateQuotationMaster",
        formData,
        "",
        "",
        "POST",
         false,
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
      console.error('updateQuotationError', err);
    } finally {
      setLoading(false);
    }
  };

  return { addQuotationLoading, addQuotationData, addQuotationError, getaddQuotation };
};
export default useCreateQuotation;