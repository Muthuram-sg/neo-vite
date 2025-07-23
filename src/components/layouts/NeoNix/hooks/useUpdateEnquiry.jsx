import { useState } from 'react';
import configParam from 'config';

const useUpdateEnquiry = () => {
  const [updateEnquiryLoading, setLoading] = useState(false);
  const [updateEnquiryData, setData] = useState(null);
  const [updateEnquiryError, setError] = useState(null);

  const getUpdateEnquiry = async (formData) => {
    setLoading(true);

    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/EnquiryMaster/EditEnquiryMaster",
        formData,
        "",
        "",
        "PUT",
        false
      );

      if (result === 'Updated Successfully ') {
        setData(result);
        setError(null);
      } else {
        setData(null);
        setError(true);
      }
    } catch (err) {
      setData(null);
      setError(err);
      console.error("updateEnquiryError", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateEnquiryLoading,
    updateEnquiryData,
    updateEnquiryError,
    getUpdateEnquiry
  };
};

export default useUpdateEnquiry;
