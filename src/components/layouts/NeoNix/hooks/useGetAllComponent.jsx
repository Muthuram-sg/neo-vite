import { useState } from "react";
import configParam from "config";

const useGetAllComponent = () => {
  const [allCurrencyLoading, setLoading] = useState(false);
  const [allCurrencyData, setData] = useState(null);
  const [allCurrencyError, setError] = useState(null);

  const getAllCurrency = async () => {
    setLoading(true);
    const url = "/neonix-api/api/ComponentMaster/GetAllComponentMaster";

    await configParam.RUN_REST_API(url, "", "", "", "Get")
      .then((response) => {
        if (response !== undefined && response) {
          setData(response.response);
          setError(false);
        } else {
          setData(null);
          setError(response);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log("API FAILURE", e, window.location.pathname.split("/").pop(), new Date());
        setLoading(false);
        setError(e);
        setData(null);
      });
  };

  return { allCurrencyLoading, allCurrencyData, allCurrencyError, getAllCurrency };
};

export default useGetAllComponent;
