import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useLineHierarchy = () => {
    const [linehierarchyLoading, setLoading] = useState(false);
    const [linehierarchyData, setData] = useState(null);
    const [linehierarchyError, setError] = useState(null);

    const getLineHierarchy = async (line_id,user_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.GetUserLineHierarchy, {line_id:line_id,user_id:user_id})
            .then((hierdata) => {
                if (hierdata.neo_skeleton_user_line_default_hierarchy && hierdata.neo_skeleton_user_line_default_hierarchy.length > 0 ) {
                    setData(hierdata.neo_skeleton_user_line_default_hierarchy)
                    setError(false)
                    setLoading(false)
                }
                else {
                    setData([])
                    setError(true)
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log("NEW MODEL", e, "Explore", new Date())
                setLoading(false);
                setError(e);
                setData([]);
            });

    };
    return { linehierarchyLoading, linehierarchyData, linehierarchyError, getLineHierarchy };
};

export default useLineHierarchy;