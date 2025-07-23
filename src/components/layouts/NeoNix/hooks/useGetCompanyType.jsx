import { useState } from "react";
import configParam from "config"; // Make sure RUN_REST_API is properly configured

const useGetCompanyTypes = () => {
  const [companyTypeLoading, setCompanyTypeLoading] = useState(false);
  const [companyTypeData, setCompanyTypeData] = useState([]);
  const [companyTypeError, setCompanyTypeError] = useState(null);

  const getCompanyTypes = async () => {
    setCompanyTypeLoading(true);

    const url = "/neonix-api/api/Company/GetCompanyType";

    try {
      const response = await configParam.RUN_REST_API(url, "", "", "", "Get");

      if (response && response.response) {
        setCompanyTypeData(response.response);
        setCompanyTypeError(null);
      } else {
        setCompanyTypeData([]);
        setCompanyTypeError("No data returned");
      }
    } catch (error) {
      console.error("Company Type API error:", error);
      setCompanyTypeData([]);
      setCompanyTypeError(error);
    } finally {
      setCompanyTypeLoading(false);
    }
  };

  return {
    companyTypeLoading,
    companyTypeData,
    companyTypeError,
    getCompanyTypes
  };
};

export default useGetCompanyTypes;
