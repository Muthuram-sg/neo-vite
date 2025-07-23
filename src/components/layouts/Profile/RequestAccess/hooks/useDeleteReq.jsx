import { useState } from "react";
import configParam from "config";
import mutations from "components/layouts/Mutations";

const useDeleteReq = () => {
  const [outDeleteReqLoading, setLoading] = useState(false);
  const [outDeleteReqData, setData] = useState(null);
  const [outDeleteReqError, setError] = useState(null);

  const getDeleteAccessReq = async (id) => {
    setLoading(true);

    configParam
      .RUN_GQL_API(mutations.deleteAccessRequest, {
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
    outDeleteReqLoading,
    outDeleteReqData,
    outDeleteReqError,
    getDeleteAccessReq,
  };
};

export default useDeleteReq;
