import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";

const useAddAnnotation = () => {
    const [addAnnotationLoading, setLoading] = useState(false);
    const [addAnnotationData, setData] = useState(null);
    const [addAnnotationError, setError] = useState(null);

    const getAddAnnotation = async (entity, iid,comment,line_id,user_id,frm,to,title) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Mutation.Addnewannotation, { schema: entity.schema, date: entity.x,value: entity.y, metric_key: entity.metric_val, instrument_id: iid, comments: comment, line_id: line_id ,user_id: user_id})
            .then((commentsdata) => {
                if (commentsdata && commentsdata.insert_neo_skeleton_data_annotations ) {
                    setData({data:commentsdata.insert_neo_skeleton_data_annotations,metric_val:entity.metric_val,iid:iid,frm:frm,to:to,metric_title:title})
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData({data:[],metric_val:entity.metric_val,iid:iid,frm:frm,to:to})
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Trends", new Date())
                setLoading(false);
                setError(e);
                setData({data:[],metric_val:entity.metric_val,iid:iid,frm:frm,to:to});
            });

    };
    return { addAnnotationLoading, addAnnotationData, addAnnotationError, getAddAnnotation };   
};

export default useAddAnnotation;