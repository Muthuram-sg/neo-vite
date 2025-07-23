import { useState } from "react";
import configParam from "config"; // Make sure RUN_REST_API is defined and working

const useGetCompanyMaster = () => {
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [companyError, setCompanyError] = useState(null);

  const getAllCompany = async () => {
    setCompanyLoading(true);

    const url = "/neonix-api/api/Company/GetAllCompanyMaster";

    try {
      const response = await configParam.RUN_REST_API(url, "", "", "", "Get");

      if (response && response.response) {
        setCompanyData(response.response);
        setCompanyError(null);
      } else {
        setCompanyData([]);
        setCompanyError("No data returned");
      }
    } catch (error) {
      console.error("Company Category Types API error:", error);
      setCompanyData([]);
      setCompanyError(error);
    } finally {
      setCompanyLoading(false);
    }
  };

  return {
    companyLoading,
    companyData,
    companyError,
    getAllCompany
  };
};

export default useGetCompanyMaster;
