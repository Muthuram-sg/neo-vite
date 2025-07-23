import { useState } from "react";
import configParam from "config";

const useGetAllQuotation = () => {
  const [allQuotationLoading, setLoading] = useState(false);
  const [allQuotationData, setData] = useState(null);
  const [allQuotationError, setError] = useState(null);

  const getAllQuotation = async () => {
    setLoading(true);
    const url = "/neonix-api/api/QuotationMaster/GetAllQuotationMaster";

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

  return { allQuotationLoading, allQuotationData, allQuotationError, getAllQuotation };
};

export default useGetAllQuotation;
