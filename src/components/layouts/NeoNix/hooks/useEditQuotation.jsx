import { useState } from 'react';
import configParam from 'config';

const useEditQuotation = () => {
  const [editQuotationLoading, setLoading] = useState(false);
  const [editQuotationData, setData] = useState(null);
  const [editQuotationError, setError] = useState(null);

  const geteditQuotation = async (formData) => {
    setLoading(true);
    
    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/QuotationMaster/EditQuotationMaster",
        formData,
        "",
        "",
        "PUT",
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

  return { editQuotationLoading, editQuotationData, editQuotationError, geteditQuotation };
};
export default useEditQuotation;