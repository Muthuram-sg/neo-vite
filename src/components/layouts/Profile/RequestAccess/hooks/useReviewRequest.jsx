import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useReviewRequest = () => {
  const [outReviewReqLoading, setLoading] = useState(false);
  const [outReviewReqData, setData] = useState(null);
  const [outReviewReqError, setError] = useState(null);

  const getReviewAccessReq = async (
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
    outReviewReqLoading,
    outReviewReqData,
    outReviewReqError,
    getReviewAccessReq,
  };
};

export default useReviewRequest;
