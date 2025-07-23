import { useState } from "react";
import configParam from "config"; // Make sure RUN_REST_API is defined and working

const useUpdateCompanyMaster = () => {
  const [companyUpdateLoading, setCompanyLoading] = useState(false);
  const [companyUpdateData, setCompanyData] = useState([]);
  const [companyUpdateError, setCompanyError] = useState(null);

  const updateCompany = async (formData) => {
    setCompanyLoading(true);

    const url = "/neonix-api/api/Company/EditCompanyMaster";

    try {
      const response = await configParam.RUN_REST_API(url, formData, "", "", "PUT", true);
      
      console.log("formData ", response);
      if (response === 'Updated Successfully ') {
        setCompanyData(response);
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
    companyUpdateLoading,
    companyUpdateData,
    companyUpdateError,
    updateCompany
  };
};

export default useUpdateCompanyMaster;
