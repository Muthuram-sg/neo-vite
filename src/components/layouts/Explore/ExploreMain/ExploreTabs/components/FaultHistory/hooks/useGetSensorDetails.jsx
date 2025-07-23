import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetSensorDetails = () => {
    const [sensordetailsLoading, setLoading] = useState(false);
    const [sensordetailsdata, setData] = useState(null);
    const [sensordetailserror, setError] = useState(null);

    const getSensorDetails = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getSensorDetails,{line_id :line_id})
            .then(sensordetails => {
                if (sensordetails && sensordetails.neo_skeleton_sensors) {
                    setData( sensordetails.neo_skeleton_sensors)
                    setError(false)
                    setLoading(false)
                } else {
                    setData(null)
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                setLoading(false);
                setError(e);
                setData(null);
            });



    }
    return { sensordetailsLoading, sensordetailsdata, sensordetailserror, getSensorDetails };
}

export default useGetSensorDetails;
