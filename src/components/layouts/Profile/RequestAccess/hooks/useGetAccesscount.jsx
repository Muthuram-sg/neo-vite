import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAccesscount = () => {
  const [outAccountCountLoading, setLoading] = useState(false);
  const [outAccountCountData, setData] = useState(null);
  const [outAccountCountError, setError] = useState(null);

  const GetAccesscount = async (userId, lineId) => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.checkIfAccessExists, {
        userId: userId,
        lineId: lineId,
      })
      .then((returnLineFormula) => {
        if (
          returnLineFormula !== undefined &&
          returnLineFormula.neo_skeleton_user_role_line_aggregate &&
          returnLineFormula.neo_skeleton_user_role_line_aggregate.aggregate &&
          returnLineFormula.neo_skeleton_user_role_line_aggregate.aggregate
            .count
        ) {
          let data =
            returnLineFormula.neo_skeleton_user_role_line_aggregate.aggregate
              .count;
          setData(data);
          console.log("account", data);
          setLoading(false);
        } else {
          setLoading(false);
          console.log("returndata undefined getInstrumentFormulaList");
        }
      })
      .catch((e) => {
        console.log(
          "NEW MODEL",
          "ERR",
          e,
          "User Setting Request Access Count",
          new Date()
        );
        setLoading(false);
        setError(e);
        setData(null);
      });
  };
  return {
    outAccountCountLoading,
    outAccountCountData,
    outAccountCountError,
    GetAccesscount,
  };
};

export default useGetAccesscount;
