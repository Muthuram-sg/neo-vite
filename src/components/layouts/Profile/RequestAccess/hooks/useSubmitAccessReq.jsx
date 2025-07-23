import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useSubmitAccessReq = () => {
  const [outReqUpdateLoading, setLoading] = useState(false);
  const [outReqUpdateData, setData] = useState(null);
  const [outReqUpdateError, setError] = useState(null);

  const getSubmitAccessReq = async (
    role_id,
    approve,
    created_by,
    line_id,
    reject
  ) => {
    setLoading(true);

    configParam
      .RUN_GQL_API(mutations.submitAccessReq, {
        role_id,
        approve,
        created_by,
        line_id,
        reject,
      })
      .then((response) => {
        setData(response);
        console.log("submit", response);
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
    outReqUpdateLoading,
    outReqUpdateData,
    outReqUpdateError,
    getSubmitAccessReq,
  };
};

export default useSubmitAccessReq;
