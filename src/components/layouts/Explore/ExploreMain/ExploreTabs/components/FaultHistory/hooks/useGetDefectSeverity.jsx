import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetDefectSeverity = () => {
    const [defetcsseverityLoading, setLoading] = useState(false);
    const [defectsseveritydata, setData] = useState(null);
    const [defectsseverityerror, setError] = useState(null);

    const getDefectSeverity = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getDefectsSeverity)
            .then(defectsseverity => {
                if (defectsseverity && defectsseverity.neo_skeleton_defects_severity) {
                    setData( defectsseverity.neo_skeleton_defects_severity)
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
    return { defetcsseverityLoading, defectsseveritydata, defectsseverityerror, getDefectSeverity };
}

export default useGetDefectSeverity;
