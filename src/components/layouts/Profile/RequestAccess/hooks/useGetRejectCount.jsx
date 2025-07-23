import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetRejectCount = () => {
  const [outRejectCountLoading, setLoading] = useState(false);
  const [outRejectCountData, setData] = useState(null);
  const [outRejectCountError, setError] = useState(null);

  const GetRejectCount = async (userId, lineId, toDate) => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.getRequestRejectcount, {
        userId: userId,
        lineId: lineId,
        toDate: toDate,
      })
      .then((returnLine) => {
        console.log("test",{
          userId: userId,
          lineId: lineId,
          toDate: toDate,
        });
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
    outRejectCountLoading,
    outRejectCountData,
    outRejectCountError,
    GetRejectCount,
  };
};

export default useGetRejectCount;
