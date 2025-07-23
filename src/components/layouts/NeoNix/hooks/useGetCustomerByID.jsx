import { useState } from "react";
import configParam from "config";

const useGetCustomerByID = () => {
  const [customerLoading, setLoading] = useState(false);
  const [customerData, setData] = useState(null);
  const [customerError, setError] = useState(null);

  const getcustomer = async (cust_code) => {
    setLoading(true);
    const url = "/neonix-api/api/QuotationMaster/GetDataAgainstCustomerMaster";
    await configParam.RUN_REST_API(url, {cust_code})
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

  return { customerLoading, customerData, customerError, getcustomer };
};

export default useGetCustomerByID;
