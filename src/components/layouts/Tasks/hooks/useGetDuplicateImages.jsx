import { useState } from "react";
import configParam from "config";

const useGetDuplicateImages = () => {
    const [DuplicateImagesLoading, setLoading] = useState(true);
    const [DuplicateImagesData, setData] = useState(null);
    const [DuplicateImagesError, setError] = useState(null);

    const getDuplicateImages = async (fileNames) => {
        setLoading(true);
        const url = "/tasks/getDuplicateImages";
      
        await configParam.RUN_REST_API(url, {fileName:fileNames},'','',"POST",'',true)
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

    return { DuplicateImagesLoading, DuplicateImagesData, DuplicateImagesError, getDuplicateImages };
};

export default useGetDuplicateImages;