import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useUpdateAnnotation = () => {
    const [updateannotLoading, setLoading] = useState(false);
    const [updateannotData, setData] = useState(null);
    const [updateannotError, setError] = useState(null);

    const getUpdateAnnotation = async (entityObj,metric_val, iid,comment,line_id,frm,to,title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.Updateannotation, { schema: entityObj.schema, date: entityObj.x, metric_key: metric_val, instrument_id: iid, comments: comment, line_id: line_id })
            .then((commentsdata) => {
                if (commentsdata && commentsdata.update_neo_skeleton_data_annotations ) {
                    setData({data:commentsdata.update_neo_skeleton_data_annotations,metric_val:metric_val,iid:iid,frm:frm,to:to,metric_title:title})
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData({data:[],metric_val:metric_val,iid:iid,frm:frm,to:to})
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Trends", new Date())
                setLoading(false);
                setError(e);
                setData({data:[],metric_val:metric_val,iid:iid,frm:frm,to:to});
            });

    };
    return { updateannotLoading, updateannotData, updateannotError, getUpdateAnnotation };
};

export default useUpdateAnnotation;