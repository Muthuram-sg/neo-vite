import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetAccesHistory = () => {
  const [outAccessHistoryLoading, setLoading] = useState(false);
  const [outAccessHistoryData, setData] = useState(null);
  const [outAccessHistoryError, setError] = useState(null);

  const getAccessHistory = async (userId) => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.getAccessReqHistory, {
        user_id: userId,
      })
      .then((accessHistoryData) => {
        if (
          accessHistoryData.neo_skeleton_user_request_access &&
          accessHistoryData.neo_skeleton_user_request_access.length > 0
        ) {
          let data = accessHistoryData.neo_skeleton_user_request_access;
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
    outAccessHistoryLoading,
    outAccessHistoryData,
    outAccessHistoryError,
    getAccessHistory,
  };
};

export default useGetAccesHistory;
