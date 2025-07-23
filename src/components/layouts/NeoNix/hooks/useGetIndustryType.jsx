import { useState } from "react";
import configParam from "config"; // Ensure RUN_REST_API is configured correctly

const useGetIndustryTypes = () => {
  const [industryLoading, setIndustryLoading] = useState(false);
  const [industryData, setIndustryData] = useState([]);
  const [industryError, setIndustryError] = useState(null);

  const getIndustryTypes = async () => {
    setIndustryLoading(true);

    const url = "/neonix-api/api/Company/GetIndustryType";

    try {
      const response = await configParam.RUN_REST_API(url, "", "", "", "Get");
      if (response && response.response) {
        setIndustryData(response.response);
        setIndustryError(null);
      } else {
        setIndustryData([]);
        setIndustryError("No data returned");
      }
    } catch (error) {
      console.error("Industry Types API error:", error);
      setIndustryData([]);
      setIndustryError(error);
    } finally {
      setIndustryLoading(false);
    }
  };

  return {
    industryLoading,
    industryData,
    industryError,
    getIndustryTypes
  };
};

export default useGetIndustryTypes;
