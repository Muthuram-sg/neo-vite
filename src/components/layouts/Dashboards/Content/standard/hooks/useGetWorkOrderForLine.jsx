import { useState } from "react";
import configParam from "config";
import Queries from "components/layouts/Queries";

const useGetWorkOrderForLine = () => {
    const [WorkOrderLineLoading, setLoading] = useState(false);
    const [WorkOrderLineError, setError] = useState(null);
    const [WorkOrderLineData, setData] = useState(null);

    const getWorkOrderLine = async (lineID) => {
        setLoading(true);
        await configParam.RUN_GQL_API(Queries.getLineWorkOrder, { line_id: lineID})
            .then((workorders) => {
                console.log(workorders,'workorders')
                if (workorders && workorders.neo_skeleton_prod_order && workorders.neo_skeleton_prod_order.length >0) {
                    setData(workorders.neo_skeleton_prod_order)
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
                setLoading(false);
                setError(e);
                setData(null);
                console.log("NEW MODEL", "ERR", e, "CMS Dashboard", new Date())
            });

    };
    return { WorkOrderLineLoading, WorkOrderLineData, WorkOrderLineError, getWorkOrderLine };
};

export default useGetWorkOrderForLine;