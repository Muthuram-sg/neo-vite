import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetGiaDetails = () => {
  const [outGiaDetailsLoading, setLoading] = useState(false);
  const [outGiaDetailsData, setData] = useState(null);
  const [outGiaDetailsError, setError] = useState(null);

  const getGiaDetailsList = async () => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.getgialistDetails, {})
      .then((response) => {
        let data = response.neo_skeleton_gaia_plants_details;
        setData(data);
        setLoading(false);
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
    outGiaDetailsLoading,
    outGiaDetailsData,
    outGiaDetailsError,
    getGiaDetailsList,
  };
};

export default useGetGiaDetails;
