import { useState } from "react";
import configParam from "config";

const useGetAnalyticsDefectImage = () => {
    const [AnalyticsImageLoading, setLoading] = useState(false);
    const [AnalyticsImageData, setData] = useState(null);
    const [AnalyticsImageError, setError] = useState(null);


    function isHttps(url) {
        try {
          const urlObject = new URL(url); // Parse the URL
          return urlObject.protocol === "https:"; // Check the protocol
        } catch (error) {
          console.error("Invalid URL:", error.message);
          return false; // Return false if the URL is invalid
        }
      }

      function removeProtocol(url) {
        try {
          const urlObject = new URL(url); // Parse the URL
          return urlObject.host + urlObject.pathname; // Combine host and pathname
        } catch (error) {
          console.error("Invalid URL:", error.message);
          return url; // Return original string if URL is invalid
        }
      }


    const getAnalyticsImage = async (schema,path) => {
        setLoading(true);
        const url = "/dashboards/getDefectsImages";
        let body = {
            schema:schema,
            ip_address:removeProtocol(path),
            issecure:isHttps(path)
        }
        await configParam.RUN_REST_API(url, body)
            .then((response) => {
                if (response  && response.data) {
                    // console.log(response.data,"ressss")
                    setLoading(false);
                    setError(false);
                    setData(response.data);

                } else {
                    setLoading(false);
                    setError(false);
                    setData([]);
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });

    };

    return { AnalyticsImageLoading, AnalyticsImageData, AnalyticsImageError, getAnalyticsImage };
};

export default useGetAnalyticsDefectImage;