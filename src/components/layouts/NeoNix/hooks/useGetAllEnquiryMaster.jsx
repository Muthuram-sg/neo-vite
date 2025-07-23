import { useState } from "react";
import configParam from "config"; // Assumes RUN_REST_API handles everything

const useGetEnquiryMaster = () => {
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryData, setEnquiryData] = useState(null);
  const [enquiryError, setEnquiryError] = useState(null);

  const getAllEnquiryMaster = async () => {
    setEnquiryLoading(true);
    const url = "/neonix-api/api/EnquiryMaster/GetAllEnquiryMaster";

    await configParam.RUN_REST_API(url, "", "", "", "Get")
      .then((response) => {
        if (response !== undefined && response) {
          setEnquiryData(response.response); // Adjust if response format differs
          setEnquiryError(false);
        } else {
          setEnquiryData(null);
          setEnquiryError(response);
        }
        setEnquiryLoading(false);
      })
      .catch((e) => {
        console.error("EnquiryMaster API FAILURE:", e);
        setEnquiryLoading(false);
        setEnquiryError(e);
        setEnquiryData(null);
      });
  };

  return {
    enquiryLoading,
    enquiryData,
    enquiryError,
    getAllEnquiryMaster,
  };
};

export default useGetEnquiryMaster;
