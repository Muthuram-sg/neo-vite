import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useCheckPointAnnot = () => {
    const [checkpointannotLoading, setLoading] = useState(false);
    const [checkpointannotData, setData] = useState(null);
    const [checkpointannotError, setError] = useState(null);

    const getCheckPointAnnot = async (metric_val, iid,x ,frm,to,title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.checkPointAnnot, { date: x, metric_key: metric_val, instrument_id: iid })
            .then((commentsdata) => {
                if (commentsdata.neo_skeleton_data_annotations ) {
                    setData({data :commentsdata.neo_skeleton_data_annotations ,metric_val : metric_val , iid : iid , frm:frm , to :to,metric_title:title}) 
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData({data:[],metric_val : metric_val , iid : iid,frm:frm , to :to})
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Trends", new Date())
                setLoading(false);
                setError(e);
                setData({data:[],metric_val : metric_val , iid : iid,frm:frm , to :to});
            });

    };
    return { checkpointannotLoading, checkpointannotData, checkpointannotError, getCheckPointAnnot };
};

export default useCheckPointAnnot;