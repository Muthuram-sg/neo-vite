import { useState } from "react";
import configParam from "config"; // Ensure RUN_REST_API is configured correctly

const useGetCountryList = () => {
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [countryError, setCountryError] = useState(null);

  const getCountryList = async () => {
    setCountryLoading(true);

    const url = "/neonix-api/api/CustomerMaster/GetCountryList";

    try {
      const response = await configParam.RUN_REST_API(url, "", "", "", "GET");
      if (response && response) {
        setCountryData(response.response);
        setCountryError(null);
      } else {
        setCountryData([]);
        setCountryError("No data returned");
      }
    } catch (error) {
      setCountryData([]);
      setCountryError(error);
    } finally {
      setCountryLoading(false);
    }
  };

  return {
    countryLoading,
    countryData,
    countryError,
    getCountryList,
  };
};

export default useGetCountryList;
