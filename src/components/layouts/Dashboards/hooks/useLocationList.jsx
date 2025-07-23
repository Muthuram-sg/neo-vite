import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useLineListData = () => {
    const [LocationDataLoading, setLoading] = useState(false);
    const [LocationDataData, setData] = useState(null);
    const [LocationDataError, setError] = useState(null);

    const getLineLocationData = async () => {
       
        setLoading(true);

        configParam.RUN_GQL_API(gqlQueries.getAllLineLocation,{})
            .then((response) => {
                setData(response.neo_skeleton_lines);
                setError(false)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "User Setting", new Date())
            })
    }

    return { LocationDataLoading, LocationDataData, LocationDataError, getLineLocationData };
}


export default useLineListData;