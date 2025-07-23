import { useState } from "react";
import configParam from "config";

const useGetDefectImage = () => {
    const [DefectImageLoading, setLoading] = useState(false);
    const [DefectImageData, setData] = useState(null);
    const [DefectImageError, setError] = useState(null);


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


    const getDefectImage = async (schema,image_name,path) => {
        setLoading(true);
        console.log(image_name,"image_name")
        const url = "/iiot/getGypsumDefectsImage";
        let body = {
            schema:schema,
            ip_address:removeProtocol(path),
            img_name:image_name,
            issecure:isHttps(path)
        }
        await configParam.RUN_REST_API(url, body)
            .then((response) => {
                if (response  && response.data) {
                    console.log(response.data)
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

    return { DefectImageLoading, DefectImageData, DefectImageError, getDefectImage };
};

export default useGetDefectImage;