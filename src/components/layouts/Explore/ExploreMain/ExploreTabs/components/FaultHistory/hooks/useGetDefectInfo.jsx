import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetDefectInfo = () => {
    const [defetcsinfoLoading, setLoading] = useState(false);
    const [defectsinfodata, setData] = useState(null);
    const [defectsinfoerror, setError] = useState(null);

    const getDefectInfo = async () => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getDefectsInfo)
            .then(defectsinfo => {
                if (defectsinfo && defectsinfo.neo_skeleton_defects) {
                    setData( defectsinfo.neo_skeleton_defects)
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
    return { defetcsinfoLoading, defectsinfodata, defectsinfoerror, getDefectInfo };
}

export default useGetDefectInfo;
