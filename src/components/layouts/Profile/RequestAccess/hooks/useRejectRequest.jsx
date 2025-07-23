import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useRejectRequest = () => {
  const [outRejectReqLoading, setLoading] = useState(false);
  const [outRejectReqData, setData] = useState(null);
  const [outRejectReqError, setError] = useState(null);

  const getRejctReq = async (
    approve,
    reject,
    reviewed_ts,
    user_id,
    reject_reason,
    id
  ) => {
    setLoading(true);

    configParam
      .RUN_GQL_API(mutations.toReviewRequest, {
        approve,
        reject,
        reviewed_ts,
        user_id,
        reject_reason,
        id,
      })
      .then((response) => {
        console.log("enter rej", response);
        setData(response);
        setError(false);
        setLoading(false);
      })
      .catch((e) => {
        console.log(
          "NEW MODEL",
          "ERR",
          e,
          " Submit Request Access",
          new Date()
        );
        setLoading(false);
        setError(e);
        setData(null);
      });
  };

  return {
    outRejectReqLoading,
    outRejectReqData,
    outRejectReqError,
    getRejctReq,
  };
};

export default useRejectRequest;
