import { useState } from 'react';
import configParam from 'config';

const useCreateEnquiry = () => {
  const [createEnquiryLoading, setLoading] = useState(false);
  const [createEnquiryData, setData] = useState(null);
  const [createEnquiryError, setError] = useState(null);

  const getCreateEnquiry = async (formData) => {
    setLoading(true);

    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/EnquiryMaster/CreateEnquiryMaster",
        formData,
        "",
        "",
        "POST",
        false
      );

      if (result === 'Created Successfully ') {
        setData(result);
        setError(null);
      } else {
        setData(null);
        setError(true);
      }
    } catch (err) {
      setData(null);
      setError(err);
      console.error("createCompanyError", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    createEnquiryLoading,
    createEnquiryData,
    createEnquiryError,
    getCreateEnquiry
  };
};

export default useCreateEnquiry;
