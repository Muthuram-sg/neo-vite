import { useState } from "react";
import configParam from "config";
import gqlQueries from "components/layouts/Queries";

const useGetLinecount = () => {
  const [outLineCountLoading, setLoading] = useState(false);
  const [outLineCountData, setData] = useState(null);
  const [outLineCountError, setError] = useState(null);

  const GetLinecount = async (plant_id) => {
    setLoading(true);
    await configParam
      .RUN_GQL_API(gqlQueries.checkIfLineExists, {
        plant_id: plant_id,
      })
      .then((returnLine) => {
        if (
          returnLine &&
          returnLine.neo_skeleton_lines &&
          returnLine.neo_skeleton_lines
        ) {
          let data = returnLine.neo_skeleton_lines;
          setData(data);
          setLoading(false);
        } else {
          setData([]);
          setLoading(false);
          console.log("returndata undefined getInstrumentFormulaList");
        }
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
    outLineCountLoading,
    outLineCountData,
    outLineCountError,
    GetLinecount,
  };
};

export default useGetLinecount;
