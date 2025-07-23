import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useComments = () => {
    const [commentsLoading, setLoading] = useState(false);
    const [commentsData, setData] = useState(null);
    const [commentsError, setError] = useState(null);

    const getComments = async (meters) => {
        console.log(meters,"hook data")
        setLoading(true);
        Promise.all(meters.map(async (x)=>{
            let params={
                from : x.frmDate,
                to : x.toDate,
                metric_key : x.metric_val,
                instrument_id : x.id
            }
            return  configParam.RUN_GQL_API(gqlQueries.getPointAnnot, params)
            .then((commentsdata) => {
                if (commentsdata.neo_skeleton_data_annotations ) {
                    return commentsdata.neo_skeleton_data_annotations
                } else {
                    return []
                }
            })

        }))
        .then((result)=>{
            setLoading(false);
            setError(false);
            setData(result);
        })
        .catch((e) => {
            console.log("NEW MODEL", e, "Trends", new Date())
            setLoading(false);
            setError(e);
            setData(null);
        });
       
    

    };
    return { commentsLoading, commentsData, commentsError, getComments };
};

export default useComments;