import { useState } from "react";
import configParam from "config";


const useBuildYourAnamolyModel= () => {
    const [ModelLoading, setLoading] = useState(false);
    const [ModelData, setData] = useState(null);
    const [ModelError, setError] = useState(null);

    const getBuildYourAnamolyModel= async (body) => {
        setLoading(true);

        await configParam.RUN_REST_API('/iiot/buildyouranamolymodel', body)
            .then((response) => {
                if (response !== undefined ) {
                    setData(response);
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "API FAILURE",e , window.location.pathname.split("/").pop(), new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    };


        return { ModelLoading, ModelData, ModelError, getBuildYourAnamolyModel };
    };

    export default useBuildYourAnamolyModel;