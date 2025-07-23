import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries"; 

const useGetDashBoardList = () => {
    const [DashBoardListLoading, setLoading] = useState(false);
    const [DashBoardListData, setData] = useState(null);
    const [DashBoardListError, setError] = useState(null);

    const getDashBoardList = async (line_id) => {
        setLoading(true);
        await configParam.RUN_GQL_API(gqlQueries.getDashboardListCustom, { line_id: line_id })
        .then(DashBoardList => {
            if (DashBoardList !== undefined && DashBoardList.neo_skeleton_dashboard) {
                setData(DashBoardList.neo_skeleton_dashboard)
                setError(false)
                setLoading(false)
            } else {
                setData(null)
                setError(true)
                setLoading(false)
            }


             console.log(DashBoardList, "DashBoardList")
        })
        .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
        });



    }
    return { DashBoardListLoading, DashBoardListData, DashBoardListError, getDashBoardList };
}

export default useGetDashBoardList;
