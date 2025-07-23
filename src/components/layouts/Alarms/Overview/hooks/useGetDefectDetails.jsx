import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetDefectDetails = () => {
    const [alarmDefectLoading, setLoading] = useState(false);
    const [alarmDefectData, setData] = useState(null);
    const [alarmDefectError, setError] = useState(null);

    const getAlarmDefects = async (defect_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getDefectsDetails,  { defect_id : defect_id })
            .then(response => {
                if (response.neo_skeleton_defects) {
                    setData(response.neo_skeleton_defects)
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
    return { alarmDefectLoading, alarmDefectData, alarmDefectError, getAlarmDefects };
}

export default useGetDefectDetails;
