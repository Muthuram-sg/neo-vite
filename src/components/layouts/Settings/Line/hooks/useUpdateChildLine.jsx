import { useState } from "react";
import configParam from "config";
import Mutations from "components/layouts/Mutations";

const useUpdateChildLine = () => {
    const [UpdateChildLineLoading, setLoading] = useState(false);
    const [UpdateChildLineData, setData] = useState(null);
    const [UpdateChildLineError, setError] = useState(null);

    const getUpdateChildLine = async ( parent_line_id,child_line_ids ) => {
        setLoading(true);

        configParam.RUN_GQL_API(Mutations.UpdateChildLine,{ parent_line_id : parent_line_id,child_line_ids:child_line_ids})
            .then((response) => {
                if(response.update_neo_skeleton_lines_hierarchy){
                    setData(response.update_neo_skeleton_lines_hierarchy);
                    setError(false)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", "ERR", e, "Line Setting Update", new Date())
                setLoading(false);
                setError(e);
                setData(null);
            })
    }

    return { UpdateChildLineLoading, UpdateChildLineData, UpdateChildLineError, getUpdateChildLine };
}


export default useUpdateChildLine;