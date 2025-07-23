import { useState } from 'react';
import configParam from 'config';

const useCreateCompanyMaster = () => {
  const [createCompanyLoading, setLoading] = useState(false);
  const [createCompanyData, setData] = useState(null);
  const [createCompanyError, setError] = useState(null);

  const getCreateCompany = async (formData) => {
    setLoading(true);

    try {
      const result = await configParam.RUN_REST_API(
        "/neonix-api/api/Company/CreateCompanyMaster",
        formData,
        "",
        "",
        "POST",
        true
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
    createCompanyLoading,
    createCompanyData,
    createCompanyError,
    getCreateCompany
  };
};

export default useCreateCompanyMaster;
