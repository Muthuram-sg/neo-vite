import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useLineHeirarchy = () => {
    const [LineHeirarchyLoading, setLoading] = useState(false);
    const [LineHeirarchyData, setData] = useState(null);
    const [LineHeirarchyError, setError] = useState(null);

    const getLineHeirarchy = async ( line_id ) => {
        setLoading(true);

        configParam.RUN_GQL_API(Queries.getLineHeirarchy,{ LineID : line_id})
            .then((response) => {
                if(response.neo_skeleton_lines_hierarchy.length>0){
                    setData(response.neo_skeleton_lines_hierarchy);
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

    return { LineHeirarchyLoading, LineHeirarchyData, LineHeirarchyError, getLineHeirarchy };
}


export default useLineHeirarchy;