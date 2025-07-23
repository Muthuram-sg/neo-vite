import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetPendingList = () => {
  const [outPendingReqLoading, setLoading] = useState(false);
  const [outPendingReqData, setData] = useState(null);
  const [outPendingReqError, setError] = useState(null);

  const GetPendingReqList = async (userId, lineId) => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.PendingReqList, {
        user_id: userId,
        line_id: lineId,
      })
      .then((tempPendingList) => {
        if (
          tempPendingList &&
          tempPendingList.neo_skeleton_user_request_access &&
          tempPendingList.neo_skeleton_user_request_access.length > 0
        ) {
          let data = tempPendingList.neo_skeleton_user_request_access;
          setData(data);
          setLoading(false);
        } else {
          setLoading(false);
          setData([]);
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
    outPendingReqLoading,
    outPendingReqData,
    outPendingReqError,
    GetPendingReqList,
  };
};

export default useGetPendingList;
