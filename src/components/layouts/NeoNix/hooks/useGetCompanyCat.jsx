import { useState } from "react";
import configParam from "config"; // Make sure RUN_REST_API is defined and working

const useGetCompanyCategoryTypes = () => {
  const [companyCateLoading, setCompanyCateLoading] = useState(false);
  const [companyCateData, setCompanyCateData] = useState([]);
  const [companyCateError, setCompanyCateError] = useState(null);

  const getCompanyCategoryTypes = async () => {
    setCompanyCateLoading(true);

    const url = "/neonix-api/api/Company/GetCompanyCateType";

    try {
      const response = await configParam.RUN_REST_API(url, "", "", "", "Get");

      if (response && response.response) {
        setCompanyCateData(response.response);
        setCompanyCateError(null);
      } else {
        setCompanyCateData([]);
        setCompanyCateError("No data returned");
      }
    } catch (error) {
      console.error("Company Category Types API error:", error);
      setCompanyCateData([]);
      setCompanyCateError(error);
    } finally {
      setCompanyCateLoading(false);
    }
  };

  return {
    companyCateLoading,
    companyCateData,
    companyCateError,
    getCompanyCategoryTypes
  };
};

export default useGetCompanyCategoryTypes;
