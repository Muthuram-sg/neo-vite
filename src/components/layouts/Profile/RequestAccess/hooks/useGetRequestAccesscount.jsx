import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetRequestAccessCount = () => {
  const [outRequestAccessCountLoading, setLoading] = useState(false);
  const [outRequestAccessCountData, setData] = useState(null);
  const [outRequestAccessCountError, setError] = useState(null);

  const GetRequestAccessCount = async (userId, lineId) => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.getRequestAccesscount, {
        userId: userId,
        lineId: lineId,
      })
      .then((returnLine) => {
        setData(returnLine);
        setLoading(false);
        setError(null);
      })
      .catch((e) => {
        console.log(
          "NEW MODEL",
          "ERR",
          e,
          "User Setting Request Line Count",
          new Date()
        );
        setLoading(false);
        setError(e);
        setData(null);
      });
  };
  return {
    outRequestAccessCountLoading,
    outRequestAccessCountData,
    outRequestAccessCountError,
    GetRequestAccessCount,
  };
};

export default useGetRequestAccessCount;
